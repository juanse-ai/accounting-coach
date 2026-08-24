import { useCallback, useEffect, useRef, useState } from 'react'

const CLAVE = 'partida-doble:progreso:v1'

// Estados posibles: 'resuelto' | 'errado'. Sin entrada = sin intentar.
// Si localStorage no está disponible (modo privado, permisos, cuota),
// la app sigue funcionando en memoria.
function leer() {
  try {
    const crudo = window.localStorage.getItem(CLAVE)
    if (!crudo) return {}
    const datos = JSON.parse(crudo)
    if (!datos || typeof datos !== 'object' || Array.isArray(datos)) return {}
    const limpio = {}
    for (const [id, estado] of Object.entries(datos)) {
      if (estado === 'resuelto' || estado === 'errado') limpio[id] = estado
    }
    return limpio
  } catch {
    return {}
  }
}

export function useProgreso() {
  const [progreso, setProgreso] = useState(leer)
  const puedeGuardar = useRef(true)

  useEffect(() => {
    if (!puedeGuardar.current) return
    try {
      window.localStorage.setItem(CLAVE, JSON.stringify(progreso))
    } catch {
      // Se deja de intentar para no repetir el error en cada tecla.
      puedeGuardar.current = false
    }
  }, [progreso])

  const marcar = useCallback((id, estado) => {
    setProgreso((prev) => {
      // Un ejercicio resuelto no vuelve a marcarse como errado.
      if (prev[id] === 'resuelto') return prev
      if (prev[id] === estado) return prev
      return { ...prev, [id]: estado }
    })
  }, [])

  return { progreso, marcar }
}
