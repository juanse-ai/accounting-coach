import { supabase, hayBackend } from './supabase.js'

const CLAVE_PENDIENTES = 'partida-doble:pendientes:v2'
// La cola v1 hablaba de ejercicios, que ya no existen: el servidor la
// rechazaría para siempre. Se descarta de una vez en vez de reintentarla.
const CLAVE_PENDIENTES_V1 = 'partida-doble:pendientes:v1'
const MAX_PENDIENTES = 50

// Cada envío se manda en el momento, no al terminar la clase. Si la red falla,
// el envío no se pierde: queda en una cola en localStorage y se reintenta con
// el siguiente envío o al abrir la app. Nada de esto puede lanzar hacia la
// interfaz — verificar la respuesta tiene que funcionar aunque el backend no.

function leerPendientes() {
  try {
    const crudo = window.localStorage.getItem(CLAVE_PENDIENTES)
    const datos = crudo ? JSON.parse(crudo) : []
    return Array.isArray(datos) ? datos : []
  } catch {
    return []
  }
}

function guardarPendientes(cola) {
  try {
    // Se conservan los más recientes: una cola vieja e infinita no le sirve
    // a nadie y puede reventar la cuota de localStorage.
    window.localStorage.setItem(
      CLAVE_PENDIENTES,
      JSON.stringify(cola.slice(-MAX_PENDIENTES))
    )
  } catch {
    // Sin cola en disco el reintento se pierde al cerrar la pestaña.
  }
}

function encolar(payload) {
  guardarPendientes([...leerPendientes(), payload])
}

async function enviar(payload) {
  const { error } = await supabase.rpc('registrar_respuesta', payload)
  if (error) throw error
}

/**
 * Reintenta la cola en orden. Se detiene en el primer fallo de red para no
 * gastar intentos, pero descarta los envíos que el servidor rechaza por datos
 * inválidos: reintentarlos fallaría igual para siempre.
 */
export async function vaciarPendientes() {
  if (!hayBackend) return
  try {
    window.localStorage.removeItem(CLAVE_PENDIENTES_V1)
  } catch {
    // Da igual: si no se puede borrar, tampoco se lee.
  }

  let cola = leerPendientes()
  if (cola.length === 0) return

  while (cola.length > 0) {
    try {
      await enviar(cola[0])
    } catch (e) {
      // 22023 / 23503 = la fila nunca va a ser aceptada. Cualquier otro error
      // (red, 5xx) sí merece otro intento más tarde.
      const permanente = e?.code === '22023' || e?.code === '23503'
      if (!permanente) break
    }
    cola = cola.slice(1)
    guardarPendientes(cola)
  }
}

/**
 * Guarda un envío. `datos` es el sobre que arma el motor de la pregunta: la
 * función no sabe qué hay dentro y no le hace falta.
 *
 * Devuelve 'guardado' | 'pendiente' | 'omitido' y nunca lanza.
 */
export async function registrarRespuesta({ participanteId, preguntaId, esCorrecta, datos }) {
  if (!hayBackend || !participanteId) return 'omitido'

  const payload = {
    p_participante_id: participanteId,
    p_pregunta_id: preguntaId,
    p_es_correcta: esCorrecta,
    p_datos: datos ?? {},
  }

  try {
    await enviar(payload)
    // El envío de ahora pasó, así que la red está viva: buen momento para
    // desatascar lo que quedó de intentos anteriores.
    vaciarPendientes().catch(() => {})
    return 'guardado'
  } catch {
    encolar(payload)
    return 'pendiente'
  }
}
