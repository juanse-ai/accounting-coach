import { useCallback, useEffect, useRef, useState } from 'react'

const CLAVE = 'partida-doble:progreso:v2'
const CLAVE_V1 = 'partida-doble:progreso:v1'
// Todo lo guardado antes de que existieran las clases era de esta.
const CLASE_V1 = 'contabilidad-basica'

// Estados posibles: 'resuelto' | 'errado'. Sin entrada = sin intentar.
// El progreso se guarda por clase y por código de pregunta —el «01» visible—
// y no por id: así sobrevive a que la clase se vuelva a sembrar.
// Si localStorage no está disponible (modo privado, permisos, cuota),
// la app sigue funcionando en memoria.
const limpiarClase = (datos) => {
  if (!datos || typeof datos !== 'object' || Array.isArray(datos)) return {}
  const limpio = {}
  for (const [codigo, estado] of Object.entries(datos)) {
    if (estado === 'resuelto' || estado === 'errado') limpio[codigo] = estado
  }
  return limpio
}

function leer() {
  try {
    const crudo = window.localStorage.getItem(CLAVE)
    if (crudo) {
      const datos = JSON.parse(crudo)
      if (!datos || typeof datos !== 'object' || Array.isArray(datos)) return {}
      return Object.fromEntries(Object.entries(datos).map(([slug, p]) => [slug, limpiarClase(p)]))
    }
    // Quien ya venía practicando no pierde su avance al partir en clases.
    const viejo = window.localStorage.getItem(CLAVE_V1)
    return viejo ? { [CLASE_V1]: limpiarClase(JSON.parse(viejo)) } : {}
  } catch {
    return {}
  }
}

export function useProgreso(clase) {
  const [todo, setTodo] = useState(leer)
  const puedeGuardar = useRef(true)

  useEffect(() => {
    if (!puedeGuardar.current) return
    try {
      window.localStorage.setItem(CLAVE, JSON.stringify(todo))
    } catch {
      // Se deja de intentar para no repetir el error en cada tecla.
      puedeGuardar.current = false
    }
  }, [todo])

  const marcar = useCallback(
    (codigo, estado) => {
      if (!clase) return
      setTodo((prev) => {
        const suyo = prev[clase] ?? {}
        // Una pregunta resuelta no vuelve a marcarse como errada.
        if (suyo[codigo] === 'resuelto') return prev
        if (suyo[codigo] === estado) return prev
        return { ...prev, [clase]: { ...suyo, [codigo]: estado } }
      })
    },
    [clase]
  )

  return { progreso: (clase && todo[clase]) || {}, marcar }
}
