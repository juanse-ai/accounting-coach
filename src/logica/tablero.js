import { EJERCICIOS } from '../data/ejercicios.js'

// Derivaciones puras del tablero. Viven aparte del componente para poder
// razonarlas —y probarlas— sin montar React ni tocar la red.

/**
 * Nombre para mostrar, único. La gente se registra con el nombre que quiere y
 * dos personas pueden llamarse igual; cuando pasa, se les agrega un sufijo
 * corto del id público para poder distinguirlas en el filtro. El correo no
 * entra aquí: nunca sale del servidor.
 */
export function nombresParaMostrar(participantes) {
  const veces = new Map()
  for (const p of participantes) {
    const n = (p.nombre ?? '').trim()
    veces.set(n, (veces.get(n) ?? 0) + 1)
  }
  const salida = new Map()
  for (const p of participantes) {
    const n = (p.nombre ?? '').trim()
    salida.set(p.id, veces.get(n) > 1 ? `${n} · ${String(p.id).slice(0, 4)}` : n)
  }
  return salida
}

const deParticipante = (respuestas, id) =>
  id ? respuestas.filter((r) => r.participante === id) : respuestas

/** Números de cabecera. Con filtro son los de esa persona; sin filtro, los de todos. */
export function resumen(datos, participanteId = null) {
  const envios = deParticipante(datos.respuestas, participanteId)
  const aciertos = envios.filter((r) => r.estado === 'correcto').length

  // "Resueltos" cuenta ejercicios distintos, no envíos: acertar el 03 en el
  // tercer intento resuelve un ejercicio, no tres.
  const resueltos = new Set(
    envios.filter((r) => r.estado === 'correcto').map((r) => r.ejercicio)
  ).size

  return {
    participantes: datos.participantes.length,
    envios: envios.length,
    aciertos,
    errores: envios.length - aciertos,
    resueltos,
    // Porcentaje de envíos acertados, no de ejercicios: mide la puntería.
    precision: envios.length ? Math.round((aciertos / envios.length) * 100) : 0,
  }
}

/** Una fila por ejercicio, siempre los 18 — un ejercicio que nadie intentó
 *  también es información, así que se dibuja en cero y no se omite. */
export function porEjercicio(datos, participanteId = null) {
  const envios = deParticipante(datos.respuestas, participanteId)
  return EJERCICIOS.map((e) => {
    const suyos = envios.filter((r) => r.ejercicio === e.id)
    const aciertos = suyos.filter((r) => r.estado === 'correcto').length
    return {
      id: e.id,
      nivel: e.nivel,
      hecho: e.hecho,
      aciertos,
      errores: suyos.length - aciertos,
      envios: suyos.length,
      estado: aciertos > 0 ? 'resuelto' : suyos.length > 0 ? 'errado' : 'pendiente',
    }
  })
}

/** Una fila por participante, ordenada por avance. */
export function porParticipante(datos) {
  const nombres = nombresParaMostrar(datos.participantes)
  return datos.participantes
    .map((p) => {
      const suyos = datos.respuestas.filter((r) => r.participante === p.id)
      const aciertos = suyos.filter((r) => r.estado === 'correcto').length
      return {
        id: p.id,
        nombre: nombres.get(p.id) ?? p.nombre,
        resueltos: new Set(
          suyos.filter((r) => r.estado === 'correcto').map((r) => r.ejercicio)
        ).size,
        envios: suyos.length,
        precision: suyos.length ? Math.round((aciertos / suyos.length) * 100) : 0,
      }
    })
    .sort((a, b) => b.resueltos - a.resueltos || b.precision - a.precision)
}

/** Los envíos, del más reciente al más viejo, con el nombre ya resuelto. */
export function envios(datos, participanteId = null) {
  const nombres = nombresParaMostrar(datos.participantes)
  return deParticipante(datos.respuestas, participanteId)
    .map((r) => ({ ...r, nombre: nombres.get(r.participante) ?? '—' }))
    .sort((a, b) => String(b.creado_en).localeCompare(String(a.creado_en)))
}
