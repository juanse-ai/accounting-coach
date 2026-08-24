import { useCallback, useEffect, useRef, useState } from 'react'
import { cargarResultados, escucharResultados } from '../lib/resultados.js'
import { hayBackend } from '../lib/supabase.js'

// Cada cuánto se vuelve a pedir todo. Es la red de seguridad de los eventos
// perdidos, no el mecanismo principal: lo normal es que el tablero ya esté al
// día por Broadcast cuando llega esta recarga.
const RECONCILIAR_MS = 60_000

const VACIO = { participantes: [], ejercicios: [], respuestas: [] }

// Fusiona sin duplicar: el mismo envío puede llegar dos veces —una por el
// evento en vivo y otra por la recarga— y debe contar una sola.
function fusionar(previos, entrante) {
  if (!entrante?.id || previos.some((p) => p.id === entrante.id)) return previos
  return [...previos, entrante]
}

// Firma barata para saber si la recarga trajo algo nuevo. Sin esto, cada
// reconciliación reemplazaría el objeto de estado aunque nada haya cambiado, y
// como los gráficos se redibujan con cada identidad nueva, el tablero
// parpadearía cada minuto sin motivo.
const firma = (d) =>
  `${d.participantes.length}:${d.respuestas.length}:${d.respuestas.at(-1)?.id ?? ''}`

export function useResultados() {
  const [datos, setDatos] = useState(VACIO)
  const [cargando, setCargando] = useState(hayBackend)
  const [error, setError] = useState('')
  const [envivo, setEnvivo] = useState(false)
  const montado = useRef(true)

  const recargar = useCallback(async () => {
    if (!hayBackend) return
    try {
      const frescos = await cargarResultados()
      if (montado.current) {
        setDatos((prev) => (firma(prev) === firma(frescos) ? prev : frescos))
        setError('')
      }
    } catch {
      // Si ya hay datos en pantalla no se borran por un fallo de red: se
      // quedan los viejos y el próximo ciclo los pone al día.
      if (montado.current) setError('No pudimos actualizar el tablero.')
    } finally {
      if (montado.current) setCargando(false)
    }
  }, [])

  useEffect(() => {
    montado.current = true
    // El linter marca cualquier setState alcanzable desde un efecto, pero
    // aquí no hay ninguno síncrono: `recargar` sólo escribe estado después
    // del await, y este efecto es justo el caso que la regla exceptúa —
    // sincronizar con un sistema externo (la red y el canal de Realtime).
    // oxlint-disable-next-line react/set-state-in-effect
    recargar()

    const cortar = escucharResultados({
      onEstado: (activo) => montado.current && setEnvivo(activo),
      onRespuesta: (r) =>
        montado.current && setDatos((prev) => ({ ...prev, respuestas: fusionar(prev.respuestas, r) })),
      onParticipante: (p) =>
        montado.current &&
        setDatos((prev) => ({ ...prev, participantes: fusionar(prev.participantes, p) })),
    })

    const reloj = setInterval(recargar, RECONCILIAR_MS)
    // Volver a la pestaña después de un rato es justo cuando más desactualizado
    // está el tablero: se recarga en vez de esperar al siguiente ciclo.
    const alVolver = () => document.visibilityState === 'visible' && recargar()
    document.addEventListener('visibilitychange', alVolver)

    return () => {
      montado.current = false
      clearInterval(reloj)
      document.removeEventListener('visibilitychange', alVolver)
      cortar()
    }
  }, [recargar])

  return { datos, cargando, error, envivo, recargar }
}
