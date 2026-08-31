#!/usr/bin/env node
/**
 * Convierte un módulo de contenido en una migración de Supabase.
 *
 *   node generar.mjs mi-clase.mjs [--verificar-imagenes] [--salida <ruta.sql>]
 *
 * Valida antes de escribir y aborta con el motivo. Lo que revisa no es
 * cosmético: son los errores que dejan una clase publicada pero rota: una
 * pregunta con dos respuestas correctas, un asiento que no cuadra, una lámina
 * que nombra una forma que no existe, una imagen de 3 MB que nunca aparece.
 */
import { writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const AQUI = dirname(fileURLToPath(import.meta.url))
const RAIZ = resolve(AQUI, '../../../..')

const FORMAS = ['registro', 'flujo', 'balance', 'partido', 'tabla', 'bloqueT', 'marcas']
const BLOQUES = ['p', 'lista', 'fichas']
const TIPOS = ['asiento', 'opcion']
const NIVELES = ['Básico', 'Intermedio', 'Avanzado']
const PADRES = ['Activo', 'Pasivo', 'Patrimonio', 'Ingreso', 'Gasto']
const LADOS = ['Débito', 'Crédito']
const TONOS = ['info', 'ciruela', 'neutro']

const PALABRAS_MAX = 90 // Aviso, no error: pasado esto la lámina se lee en vez de escucharse.
const RASTER_MAX_KB = 300

const fallos = []
const avisos = []
const mal = (m) => fallos.push(m)
const ojo = (m) => avisos.push(m)

const q = (s) => (s === null || s === undefined ? 'null::text' : `'${String(s).replace(/'/g, "''")}'`)
const j = (o) => (o === null || o === undefined ? 'null::jsonb' : `${q(JSON.stringify(o))}::jsonb`)
const palabras = (o) => JSON.stringify(o).replace(/[^\p{L}\s]/gu, ' ').split(/\s+/).filter(Boolean).length

/* ── Validación ───────────────────────────────────────────────────────── */

function validarClase(c) {
  if (!c) return mal('Falta `clase`.')
  if (!/^[a-z0-9]([a-z0-9-]{0,58}[a-z0-9])?$/.test(c.slug ?? ''))
    mal(`clase.slug inválido: «${c.slug}». Solo minúsculas, dígitos y guiones.`)
  for (const campo of ['nombre', 'etiqueta', 'titular', 'bajada'])
    if (!String(c[campo] ?? '').trim()) mal(`clase.${campo} está vacío. Los tres textos salen en el landing.`)
  if (!Number.isInteger(c.orden) || c.orden < 1) mal('clase.orden debe ser un entero ≥ 1.')
}

function validarLamina(l, i) {
  const donde = `Lámina ${i + 1}`
  if (!String(l.etiqueta ?? '').trim()) mal(`${donde}: falta la etiqueta.`)

  if (!Array.isArray(l.titulo) || l.titulo.length === 0) {
    mal(`${donde}: el título es una lista de segmentos, p. ej. [{t:'El '},{t:'goodwill',acento:true}].`)
  } else if (!l.titulo.some((s) => String(s?.t ?? '').trim())) {
    mal(`${donde}: el título no tiene texto.`)
  }

  for (const [k, b] of (l.cuerpo ?? []).entries()) {
    if (!BLOQUES.includes(b?.tipo)) {
      mal(`${donde}, bloque ${k + 1}: tipo «${b?.tipo}» desconocido. Solo ${BLOQUES.join(', ')}.`)
      continue
    }
    if (b.tipo === 'p' && !String(b.texto ?? '').trim()) mal(`${donde}, bloque ${k + 1}: párrafo vacío.`)
    if (b.tipo === 'lista' && !(b.items ?? []).length) mal(`${donde}, bloque ${k + 1}: lista sin items.`)
    if (b.tipo === 'fichas')
      for (const [m, it] of (b.items ?? []).entries()) {
        if (!it?.texto || !it?.ficha) mal(`${donde}, ficha ${m + 1}: necesita «texto» y «ficha».`)
        if (it?.tono && !TONOS.includes(it.tono)) mal(`${donde}, ficha ${m + 1}: tono «${it.tono}» no existe.`)
      }
  }

  if (l.visual && !FORMAS.includes(l.visual))
    mal(`${donde}: la forma «${l.visual}» no está en el registro. Disponibles: ${FORMAS.join(', ')}.`)
  if (l.visual && l.imagen && l.visual !== 'flujo')
    mal(`${donde}: lleva forma Y imagen. Solo «flujo» admite las dos (con datos.imagenEnMedio).`)
  if (!l.visual && !l.imagen) ojo(`${donde}: sin forma ni imagen, la columna derecha queda vacía.`)

  // Cada forma pide lo suyo. Se revisa lo mínimo que la deja dibujar algo.
  const d = l.datos ?? {}
  const pide = {
    marcas: () => (d.items ?? []).length || mal(`${donde}: «marcas» sin «items».`),
    balance: () =>
      (d.columnas ?? []).length === 2 || mal(`${donde}: «balance» necesita exactamente dos columnas.`),
    partido: () =>
      (d.mitades ?? []).length === 2 || mal(`${donde}: «partido» necesita exactamente dos mitades.`),
    bloqueT: () => (d.lados ?? []).length === 2 || mal(`${donde}: «bloqueT» necesita exactamente dos lados.`),
    tabla: () => ((d.columnas ?? []).length && (d.filas ?? []).length) || mal(`${donde}: «tabla» sin columnas o sin filas.`),
    flujo: () => (d.nodos ?? []).length >= 2 || mal(`${donde}: «flujo» necesita al menos dos nodos.`),
    registro: () => (d.filas ?? []).length || mal(`${donde}: «registro» sin filas.`),
  }
  if (l.visual) pide[l.visual]?.()

  if (l.visual === 'tabla')
    for (const [k, f] of (d.filas ?? []).entries())
      if ((f.celdas ?? []).length !== d.columnas.length)
        mal(`${donde}, fila ${k + 1}: tiene ${f.celdas?.length ?? 0} celdas y la tabla ${d.columnas.length} columnas.`)

  const n = palabras(l.cuerpo ?? [])
  if (n > PALABRAS_MAX) ojo(`${donde}: ${n} palabras de cuerpo. Sobre ${PALABRAS_MAX} la lámina se lee en vez de escucharse.`)
}

function validarPregunta(p, i, cuentas) {
  const donde = `Pregunta ${p.codigo ?? i + 1}`
  if (!TIPOS.includes(p.tipo)) return mal(`${donde}: tipo «${p.tipo}» sin motor. Solo ${TIPOS.join(' o ')}.`)
  if (!NIVELES.includes(p.nivel)) mal(`${donde}: nivel «${p.nivel}» inválido.`)
  if (!String(p.enunciado ?? '').trim()) mal(`${donde}: enunciado vacío.`)
  if (!String(p.nota ?? '').trim()) mal(`${donde}: falta la nota. Es lo único que se muestra al acertar.`)

  if (p.tipo === 'opcion') {
    const o = p.datos?.opciones ?? []
    if (o.length < 2 || o.length > 8) mal(`${donde}: ${o.length} opciones; van entre 2 y 8.`)
    const ok = o.filter((x) => x.correcta).length
    if (ok !== 1) mal(`${donde}: ${ok} opciones correctas. Tiene que haber exactamente una.`)
    o.forEach((x, k) => String(x.texto ?? '').trim() || mal(`${donde}, opción ${k + 1}: sin texto.`))
  }

  if (p.tipo === 'asiento') {
    const ls = p.datos?.lineas ?? []
    if (ls.length < 1 || ls.length > 20) return mal(`${donde}: ${ls.length} líneas; van entre 1 y 20.`)
    let debe = 0
    let haber = 0
    for (const [k, l] of ls.entries()) {
      if (!PADRES.includes(l.padre)) mal(`${donde}, línea ${k + 1}: padre «${l.padre}» inválido.`)
      if (!LADOS.includes(l.lado)) mal(`${donde}, línea ${k + 1}: lado «${l.lado}» inválido.`)
      if (!(l.monto > 0)) mal(`${donde}, línea ${k + 1}: el monto debe ser positivo.`)
      if (cuentas.size && !cuentas.has(l.cuenta))
        mal(`${donde}, línea ${k + 1}: la cuenta «${l.cuenta}» no está en el plan de la clase.`)
      if (l.lado === 'Débito') debe += l.monto
      else haber += l.monto
    }
    if (debe !== haber) mal(`${donde}: el asiento no cuadra: débitos ${debe}, créditos ${haber}.`)
  }
}

/* ── Imágenes ─────────────────────────────────────────────────────────── */

function urlsDe(laminas) {
  const out = []
  for (const [i, l] of laminas.entries()) {
    if (l.imagen?.src) out.push({ url: l.imagen.src, donde: `Lámina ${i + 1} · imagen` })
    for (const [k, m] of (l.datos?.items ?? []).entries())
      if (m?.src) out.push({ url: m.src, donde: `Lámina ${i + 1} · marca ${k + 1}` })
  }
  return out
}

// Wikimedia exige un User-Agent que la identifique y corta con 429 si se le
// piden muchas seguidas. Ninguna de las dos cosas dice nada de la URL, así que
// se manda la cabecera, se espacian las peticiones y un 429 es aviso, no falla.
const AGENTE = 'crear-clase/1.0 (skill de esta app; contacto vía el repo)'
const RESPIRO_MS = 300

const dormir = (ms) => new Promise((r) => setTimeout(r, ms))

async function verificarImagenes(laminas) {
  const urls = urlsDe(laminas)
  if (!urls.length) return
  console.log(`\nVerificando ${urls.length} imágenes…`)
  for (const [i, { url, donde }] of urls.entries()) {
    if (i) await dormir(RESPIRO_MS)
    try {
      const r = await fetch(url, { method: 'HEAD', redirect: 'follow', headers: { 'User-Agent': AGENTE } })
      const tipo = r.headers.get('content-type') ?? ''
      const kb = Math.round(Number(r.headers.get('content-length') ?? 0) / 1024)
      if (r.status === 429) {
        ojo(`${donde}: 429, el servidor está limitando. Vuelve a verificar más tarde. ${url}`)
      } else if (!r.ok) {
        mal(`${donde}: HTTP ${r.status}. ${url}`)
      } else if (!tipo.startsWith('image/')) {
        mal(`${donde}: no es una imagen (${tipo}). ${url}`)
      } else if (!tipo.includes('svg') && kb > RASTER_MAX_KB) {
        ojo(`${donde}: ${kb} KB. Usa la miniatura de Wikimedia (/thumb/…/960px-…). ${url}`)
      }
      console.log(`  ${r.ok ? '·' : '✗'} ${String(r.status)} ${String(kb || '?').padStart(4)} KB  ${donde}`)
    } catch (e) {
      mal(`${donde}: no responde (${e.message}). ${url}`)
    }
  }
}

/* ── SQL ──────────────────────────────────────────────────────────────── */

function sql({ clase, laminas, cuentas = [], preguntas }) {
  const L = []
  const c = "(select id from public.clases where slug = " + q(clase.slug) + ")"

  L.push(`-- Semilla de «${clase.nombre}».`)
  L.push('--')
  L.push('-- Generada con .claude/skills/crear-clase. Todo el contenido vive aquí:')
  L.push('-- el frontend solo dibuja formas y califica tipos de pregunta.')
  L.push('')
  L.push('insert into public.clases (slug, nombre, etiqueta, titular, bajada, orden) values')
  L.push(`  (${q(clase.slug)}, ${q(clase.nombre)}, ${q(clase.etiqueta)}, ${q(clase.titular)}, ${q(clase.bajada)}, ${clase.orden});`)
  L.push('')
  L.push(`insert into public.laminas (clase_id, orden, etiqueta, titulo, cuerpo, visual, datos, imagen)`)
  L.push('values')
  L.push(
    laminas
      .map((l, i) =>
        `  (${c}, ${i + 1}, ${q(l.etiqueta)}, ${j(l.titulo)}, ${j(l.cuerpo ?? [])}, ` +
        `${q(l.visual ?? null)}, ${j(l.datos ?? {})}, ${j(l.imagen ?? null)})`
      )
      .join(',\n') + ';'
  )

  if (cuentas.length) {
    L.push('')
    L.push('insert into public.cuentas (clase_id, nombre, padre, contraria, razon)')
    L.push('values')
    L.push(
      cuentas
        .map((x) => `  (${c}, ${q(x.nombre)}, ${q(x.padre)}, ${x.contraria ? 'true' : 'false'}, ${q(x.razon)})`)
        .join(',\n') + ';'
    )
  }

  L.push('')
  L.push('insert into public.preguntas (clase_id, codigo, orden, tipo, nivel, enunciado, aviso, nota, datos)')
  L.push('values')
  L.push(
    preguntas
      .map((p, i) =>
        `  (${c}, ${q(p.codigo ?? String(i + 1).padStart(2, '0'))}, ${i + 1}, ${q(p.tipo)}, ${q(p.nivel)}, ` +
        `${q(p.enunciado)}, ${q(p.aviso ?? null)}, ${q(p.nota)}, ${j(p.datos)})`
      )
      .join(',\n') + ';'
  )

  return L.join('\n') + '\n'
}

/* ── Main ─────────────────────────────────────────────────────────────── */

const args = process.argv.slice(2)
const entrada = args.find((a) => !a.startsWith('--'))
if (!entrada) {
  console.error('Uso: node generar.mjs <archivo.mjs> [--verificar-imagenes] [--salida <ruta.sql>]')
  process.exit(2)
}

const mod = await import(pathToFileURL(resolve(process.cwd(), entrada)).href)
const contenido = mod.default ?? mod
const { clase, laminas = [], cuentas = [], preguntas = [] } = contenido

validarClase(clase)
if (!laminas.length) mal('La clase no tiene láminas.')
if (!preguntas.length) mal('La clase no tiene preguntas.')
laminas.forEach(validarLamina)

const nombres = new Set(cuentas.map((x) => x.nombre))
if (nombres.size !== cuentas.length) mal('Hay cuentas con el nombre repetido.')
for (const x of cuentas) if (!PADRES.includes(x.padre)) mal(`Cuenta «${x.nombre}»: padre «${x.padre}» inválido.`)

const codigos = new Set()
preguntas.forEach((p, i) => {
  const cod = p.codigo ?? String(i + 1).padStart(2, '0')
  if (!/^[0-9]{2}$/.test(cod)) mal(`Pregunta ${i + 1}: código «${cod}» debe ser de dos dígitos.`)
  if (codigos.has(cod)) mal(`Código de pregunta repetido: «${cod}».`)
  codigos.add(cod)
  validarPregunta({ ...p, codigo: cod }, i, nombres)
})

if (preguntas.some((p) => p.tipo === 'asiento') && !cuentas.length)
  mal('Hay preguntas de tipo «asiento» pero la clase no trae plan de cuentas.')

if (args.includes('--verificar-imagenes')) await verificarImagenes(laminas)

for (const a of avisos) console.warn(`⚠  ${a}`)
if (fallos.length) {
  console.error(`\n✗ ${fallos.length} problema${fallos.length > 1 ? 's' : ''}:\n`)
  for (const f of fallos) console.error(`   ${f}`)
  process.exit(1)
}

const sello = new Date().toISOString().replace(/\D/g, '').slice(0, 14)
const salida = args.includes('--salida')
  ? resolve(process.cwd(), args[args.indexOf('--salida') + 1])
  : resolve(RAIZ, 'supabase/migrations', `${sello}_sembrar_clase_${clase.slug.replace(/-/g, '_')}.sql`)

writeFileSync(salida, sql(contenido))
console.log(`\n✓ ${laminas.length} láminas · ${preguntas.length} preguntas · ${cuentas.length} cuentas`)
console.log(`  ${salida}`)
console.log('\n  Ahora: pega el archivo en mcp__supabase__apply_migration y verifica con')
console.log(`  clase_completa('${clase.slug}').`)
