import { useEffect, useState } from 'react'
import { cargarClase } from '../lib/clases.js'

/**
 * El contenido de la clase seleccionada. Cambiar de slug lo vuelve a pedir.
 *
 * Lo cargado lleva escrito a qué clase pertenece, y el estado que se devuelve
 * se deriva de comparar ese sello con el slug pedido. Así no hay que vaciar
 * nada al cambiar de clase —vaciar sería escribir estado dentro del efecto, y
 * media clase vieja en pantalla mientras carga la nueva es justo lo que se
 * quiere evitar—: si el sello no coincide, todavía no hay nada que mostrar.
 */
export function useClase(slug) {
  const [caja, setCaja] = useState({ slug: null, clase: null, error: '' })

  useEffect(() => {
    if (!slug) return undefined

    let vivo = true
    cargarClase(slug)
      .then((datos) => {
        if (!vivo) return
        setCaja({
          slug,
          clase: datos,
          error: datos ? '' : 'Esa clase ya no está disponible.',
        })
      })
      .catch(() => {
        if (vivo) setCaja({ slug, clase: null, error: 'No pudimos cargar la clase.' })
      })

    return () => {
      vivo = false
    }
  }, [slug])

  const suya = Boolean(slug) && caja.slug === slug

  return {
    clase: suya ? caja.clase : null,
    cargando: Boolean(slug) && !suya,
    error: suya ? caja.error : '',
  }
}
