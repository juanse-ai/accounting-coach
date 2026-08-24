import { supabase, hayBackend } from './supabase.js'

export const TOPICO = 'resultados-publicos'

/** Carga completa del tablero. Lo que devuelve el servidor ya viene recortado:
 *  nunca trae correos ni el id privado de nadie. */
export async function cargarResultados() {
  if (!hayBackend) return { participantes: [], ejercicios: [], respuestas: [] }
  const { data, error } = await supabase.rpc('resultados_publicos')
  if (error) throw error
  return {
    participantes: data?.participantes ?? [],
    ejercicios: data?.ejercicios ?? [],
    respuestas: data?.respuestas ?? [],
  }
}

/**
 * Suscripción al canal público. El servidor emite por Broadcast una carga
 * armada a mano —no cambios de tabla— así que suscribirse no abre ninguna
 * tabla ni expone nada privado.
 *
 * El flujo de eventos NO es confiable por sí solo: entre que `subscribe()`
 * responde SUBSCRIBED y el servidor engancha el tópico hay una ventana de unos
 * cientos de milisegundos en la que un evento se pierde (medido, no supuesto).
 * Por eso quien consume esto vuelve a cargar cada tanto: los eventos son para
 * que se sienta inmediato, la recarga es la que garantiza que esté completo.
 */
export function escucharResultados({ onRespuesta, onParticipante, onEstado }) {
  if (!hayBackend) return () => {}

  const canal = supabase
    .channel(TOPICO)
    .on('broadcast', { event: 'respuesta' }, (m) => onRespuesta?.(m.payload))
    .on('broadcast', { event: 'participante' }, (m) => onParticipante?.(m.payload))
    .subscribe((estado) => onEstado?.(estado === 'SUBSCRIBED'))

  return () => {
    onEstado?.(false)
    supabase.removeChannel(canal)
  }
}
