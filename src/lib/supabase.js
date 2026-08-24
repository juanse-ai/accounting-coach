import { createClient } from '@supabase/supabase-js'

// Vite solo inyecta al bundle las variables con prefijo VITE_. Aquí va la
// clave *publishable* y nada más: es pública por diseño, no da acceso directo
// a ninguna tabla (todas tienen RLS sin políticas) y solo puede ejecutar las
// dos funciones de escritura. La clave de servicio nunca toca este archivo.
const url = import.meta.env.VITE_SUPABASE_URL
const clave = import.meta.env.VITE_SUPABASE_ANON_KEY

export const hayBackend = Boolean(url && clave)

// Si faltan las variables la app no se cae: arranca sin captura, igual que
// arranca sin localStorage. Quien despliega ve el aviso en consola.
if (!hayBackend) {
  console.warn(
    '[partida-doble] Falta VITE_SUPABASE_URL o VITE_SUPABASE_ANON_KEY: ' +
      'la app funciona pero no guarda nada.'
  )
}

export const supabase = hayBackend
  ? createClient(url, clave, {
      auth: { persistSession: false, autoRefreshToken: false },
    })
  : null
