import { supabase, hayBackend } from './supabase.js'

export const TOPICO = 'resultados-publicos'

const VACIO = { participantes: [], preguntas: [], respuestas: [] }

/** Carga completa del tablero de una clase. Lo que devuelve el servidor ya
 *  viene recortado: nunca trae correos, ni el id privado de nadie, ni la
 *  respuesta esperada de ninguna pregunta. */
export async function cargarResultados(claseId) {
  if (!hayBackend) return VACIO
  const { data, error } = await supabase.rpc('resultados_publicos', { p_clase_id: claseId ?? null })
  if (error) throw error
  return {
    participantes: data?.participantes ?? [],
    preguntas: data?.preguntas ?? [],
    respuestas: data?.respuestas ?? [],
  }
}

/**
 * Suscripción al canal público. El servidor emite por Broadcast una carga
 * armada a mano —no cambios de tabla— así que suscribirse no abre ninguna
 * tabla ni expone nada privado.
 *
 * El canal es uno solo para todas las clases: cada evento dice de cuál viene y
 * el que no corresponde se descarta aquí.
 *
 * El flujo de eventos NO es confiable por sí solo: entre que `subscribe()`
 * responde SUBSCRIBED y el servidor engancha el tópico hay una ventana de unos
 * cientos de milisegundos en la que un evento se pierde (medido, no supuesto).
 * Por eso quien consume esto vuelve a cargar cada tanto: los eventos son para
 * que se sienta inmediato, la recarga es la que garantiza que esté completo.
 */
export function escucharResultados({ claseSlug, onRespuesta, onParticipante, onEstado }) {
  if (!hayBackend) return () => {}

  const canal = supabase
    .channel(TOPICO)
    .on('broadcast', { event: 'respuesta' }, (m) => {
      if (!claseSlug || m.payload?.clase === claseSlug) onRespuesta?.(m.payload)
    })
    .on('broadcast', { event: 'participante' }, (m) => onParticipante?.(m.payload))
    .subscribe((estado) => onEstado?.(estado === 'SUBSCRIBED'))

  return () => {
    onEstado?.(false)
    supabase.removeChannel(canal)
  }
}
