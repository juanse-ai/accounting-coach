import { useCallback, useEffect, useRef, useState } from 'react'
import { cargarClases } from '../lib/clases.js'

const CLAVE = 'partida-doble:clase:v1'

// Cuál clase se estaba viendo. Misma tolerancia que el resto: sin
// almacenamiento la selección dura lo que dure la pestaña.
function leer() {
  try {
    return window.localStorage.getItem(CLAVE) ?? ''
  } catch {
    return ''
  }
}

function guardar(slug) {
  try {
    if (slug) window.localStorage.setItem(CLAVE, slug)
    else window.localStorage.removeItem(CLAVE)
  } catch {
    // Sin persistir: al volver se abre la primera clase.
  }
}

/**
 * El catálogo de clases y cuál está seleccionada. La selección guardada puede
 * apuntar a una clase que ya no existe —se despublicó, cambió de slug—, así
 * que siempre se contrasta contra lo que devuelve el servidor.
 */
export function useClases() {
  const [clases, setClases] = useState([])
  const [slug, setSlug] = useState(leer)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')
  const montado = useRef(true)

  useEffect(() => {
    montado.current = true
    cargarClases()
      .then((lista) => {
        if (!montado.current) return
        setClases(lista)
        setSlug((actual) => (lista.some((c) => c.slug === actual) ? actual : (lista[0]?.slug ?? '')))
        setError('')
      })
      .catch(() => montado.current && setError('No pudimos cargar las clases.'))
      .finally(() => montado.current && setCargando(false))
    return () => {
      montado.current = false
    }
  }, [])

  const seleccionar = useCallback((nuevo) => {
    setSlug(nuevo)
    guardar(nuevo)
  }, [])

  return { clases, slug, seleccionar, cargando, error }
}
