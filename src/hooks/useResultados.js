import { useCallback, useEffect, useRef, useState } from 'react'
import { cargarResultados, escucharResultados } from '../lib/resultados.js'
import { hayBackend } from '../lib/supabase.js'

// Cada cuánto se vuelve a pedir todo. Es la red de seguridad de los eventos
// perdidos, no el mecanismo principal: lo normal es que el tablero ya esté al
// día por Broadcast cuando llega esta recarga.
const RECONCILIAR_MS = 60_000

const VACIO = { participantes: [], preguntas: [], respuestas: [] }

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
  `${d.participantes.length}:${d.preguntas.length}:${d.respuestas.length}:${d.respuestas.at(-1)?.id ?? ''}`

/**
 * El tablero de una clase. Cambiar de clase vuelve a cargar todo.
 *
 * Como en useClase, lo cargado lleva el sello de la clase a la que pertenece y
 * lo que se devuelve se deriva de comparar ese sello con la clase pedida:
 * mientras no coincidan, el tablero está cargando y no muestra los envíos de
 * la clase anterior.
 */
export function useResultados(clase) {
  const claseId = clase?.id ?? null
  const claseSlug = clase?.slug ?? null

  const [caja, setCaja] = useState({ clase: null, datos: VACIO, error: '' })
  const [envivo, setEnvivo] = useState(false)
  const montado = useRef(true)

  const recargar = useCallback(async () => {
    if (!hayBackend || !claseId) return
    try {
      const frescos = await cargarResultados(claseId)
      if (!montado.current) return
      setCaja((prev) =>
        prev.clase === claseId && firma(prev.datos) === firma(frescos)
          ? prev
          : { clase: claseId, datos: frescos, error: '' }
      )
    } catch {
      // Si ya hay datos en pantalla no se borran por un fallo de red: se
      // quedan los viejos y el próximo ciclo los pone al día.
      if (!montado.current) return
      setCaja((prev) =>
        prev.clase === claseId
          ? { ...prev, error: 'No pudimos actualizar el tablero.' }
          : { clase: claseId, datos: VACIO, error: 'No pudimos cargar el tablero.' }
      )
    }
  }, [claseId])

  useEffect(() => {
    montado.current = true
    // El linter marca cualquier setState alcanzable desde un efecto, pero aquí
    // no hay ninguno síncrono: `recargar` sólo escribe estado después del
    // await, y este efecto es justo el caso que la regla exceptúa —
    // sincronizar con un sistema externo (la red y el canal de Realtime).
    // oxlint-disable-next-line react/set-state-in-effect
    recargar()

    // Solo se fusiona lo que pertenece a la clase que está en pantalla: el
    // canal es uno solo y los eventos de otra clase llegan igual.
    const mio = (fn) => (dato) =>
      montado.current &&
      setCaja((prev) => (prev.clase === claseId ? { ...prev, datos: fn(prev.datos, dato) } : prev))

    const cortar = escucharResultados({
      claseSlug,
      onEstado: (activo) => montado.current && setEnvivo(activo),
      onRespuesta: mio((d, r) => ({ ...d, respuestas: fusionar(d.respuestas, r) })),
      onParticipante: mio((d, p) => ({ ...d, participantes: fusionar(d.participantes, p) })),
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
  }, [recargar, claseId, claseSlug])

  const suyo = caja.clase === claseId

  return {
    datos: suyo ? caja.datos : VACIO,
    cargando: Boolean(hayBackend && claseId) && !suyo,
    error: suyo ? caja.error : '',
    envivo,
    recargar,
  }
}
