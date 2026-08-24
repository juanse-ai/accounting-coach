import { useCallback, useState } from 'react'
import { supabase, hayBackend } from '../lib/supabase.js'
import { validarRegistro } from '../logica/registro.js'

const CLAVE = 'partida-doble:participante:v1'

// La identidad vive en localStorage para no volver a pedir los datos en cada
// visita. Misma tolerancia a fallos que useProgreso: si el almacenamiento
// está bloqueado la sesión funciona igual, solo que dura lo que dure la
// pestaña.
function leer() {
  try {
    const crudo = window.localStorage.getItem(CLAVE)
    if (!crudo) return null
    const datos = JSON.parse(crudo)
    if (!datos || typeof datos !== 'object') return null
    const { id, nombre, email } = datos
    if (typeof id !== 'string' || !id) return null
    if (typeof nombre !== 'string' || typeof email !== 'string') return null
    return { id, nombre, email }
  } catch {
    return null
  }
}

function guardar(participante) {
  try {
    if (participante) window.localStorage.setItem(CLAVE, JSON.stringify(participante))
    else window.localStorage.removeItem(CLAVE)
  } catch {
    // Sin persistencia, pero la sesión en memoria sigue siendo válida.
  }
}

export function useParticipante() {
  const [participante, setParticipante] = useState(leer)
  const [enviando, setEnviando] = useState(false)
  const [errorServidor, setErrorServidor] = useState('')

  // Devuelve los errores de campo para que el formulario los pinte; el error
  // de red se expone aparte porque no pertenece a ningún campo.
  const registrar = useCallback(async ({ nombre, email }) => {
    const revision = validarRegistro({ nombre, email })
    if (!revision.valido) return revision.errores

    setEnviando(true)
    setErrorServidor('')
    try {
      // Sin backend configurado la app no puede guardar respuestas, pero
      // tampoco tiene sentido bloquear el acceso: se entra sin id.
      if (!hayBackend) {
        const sesion = { id: '', nombre: revision.nombre, email: revision.email }
        setParticipante(sesion)
        guardar(sesion)
        return null
      }

      const { data, error } = await supabase.rpc('registrar_participante', {
        p_nombre: revision.nombre,
        p_email: revision.email,
      })
      if (error) throw error

      const sesion = { id: data, nombre: revision.nombre, email: revision.email }
      setParticipante(sesion)
      guardar(sesion)
      return null
    } catch (e) {
      setErrorServidor(
        e?.message?.includes('Failed to fetch')
          ? 'No hay conexión con el servidor. Revisa tu red e inténtalo otra vez.'
          : 'No pudimos registrarte en este momento. Inténtalo otra vez.'
      )
      return { _servidor: true }
    } finally {
      setEnviando(false)
    }
  }, [])

  const salir = useCallback(() => {
    setParticipante(null)
    setErrorServidor('')
    guardar(null)
  }, [])

  return { participante, registrar, salir, enviando, errorServidor }
}
