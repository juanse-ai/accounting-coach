// Derivaciones puras del tablero. Viven aparte del componente para poder
// razonarlas —y probarlas— sin montar React ni tocar la red.
//
// Todo sale de lo que devolvió el servidor: las preguntas vienen en la misma
// carga que las respuestas, así que el tablero no puede desincronizarse del
// catálogo como pasaba cuando la lista vivía en el bundle.

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

  // "Resueltas" cuenta preguntas distintas, no envíos: acertar la 03 en el
  // tercer intento resuelve una pregunta, no tres.
  const resueltos = new Set(
    envios.filter((r) => r.estado === 'correcto').map((r) => r.pregunta)
  ).size

  return {
    participantes: datos.participantes.length,
    envios: envios.length,
    aciertos,
    errores: envios.length - aciertos,
    resueltos,
    // Porcentaje de envíos acertados, no de preguntas: mide la puntería.
    precision: envios.length ? Math.round((aciertos / envios.length) * 100) : 0,
  }
}

/** Una fila por pregunta de la clase — una que nadie intentó también es
 *  información, así que se dibuja en cero y no se omite. */
export function porPregunta(datos, participanteId = null) {
  const envios = deParticipante(datos.respuestas, participanteId)
  return datos.preguntas.map((p) => {
    const suyos = envios.filter((r) => r.pregunta === p.id)
    const aciertos = suyos.filter((r) => r.estado === 'correcto').length
    return {
      id: p.id,
      codigo: p.codigo,
      nivel: p.nivel,
      enunciado: p.enunciado,
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
          suyos.filter((r) => r.estado === 'correcto').map((r) => r.pregunta)
        ).size,
        envios: suyos.length,
        precision: suyos.length ? Math.round((aciertos / suyos.length) * 100) : 0,
      }
    })
    .sort((a, b) => b.resueltos - a.resueltos || b.precision - a.precision)
}

/** Los envíos, del más reciente al más viejo, con el nombre y el tipo de
 *  pregunta ya resueltos: el tablero necesita el tipo para saber qué motor
 *  dibuja cada respuesta. */
export function envios(datos, participanteId = null) {
  const nombres = nombresParaMostrar(datos.participantes)
  const tipos = new Map(datos.preguntas.map((p) => [p.id, p.tipo]))
  return deParticipante(datos.respuestas, participanteId)
    .map((r) => ({
      ...r,
      nombre: nombres.get(r.participante) ?? '—',
      tipo: tipos.get(r.pregunta) ?? null,
    }))
    .sort((a, b) => String(b.creado_en).localeCompare(String(a.creado_en)))
}
