import { supabase, hayBackend } from './supabase.js'

// El contenido de las clases ya no viaja en el bundle: se pide al servidor.
// Ambas lecturas son funciones SECURITY DEFINER, igual que el resto — las
// tablas siguen cerradas.

/** El catálogo, sin contenido: lo que necesitan el selector y el landing. */
export async function cargarClases() {
  if (!hayBackend) return []
  const { data, error } = await supabase.rpc('clases_publicas')
  if (error) throw error
  return data ?? []
}

/** Todo lo de una clase: láminas, plan de cuentas y preguntas. */
export async function cargarClase(slug) {
  if (!hayBackend || !slug) return null
  const { data, error } = await supabase.rpc('clase_completa', { p_slug: slug })
  if (error) throw error
  if (!data?.clase) return null
  return {
    ...data.clase,
    laminas: data.laminas ?? [],
    cuentas: data.cuentas ?? [],
    preguntas: data.preguntas ?? [],
  }
}
