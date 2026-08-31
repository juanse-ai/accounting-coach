const BASE = 'https://chatgpt.com/'

// Margen cómodo por debajo de lo que cualquier navegador o servidor acepta
// en una query string. Si el prompt se pasa, se usa la versión recortada en
// vez de truncar una frase por la mitad.
const LARGO_MAXIMO_URL = 2000

const aUrl = (texto) => {
  const url = new URL(BASE)
  url.searchParams.set('q', texto)
  return url.toString()
}

/**
 * Salida de emergencia: se lleva la pregunta a ChatGPT para que explique el
 * razonamiento. Cada motor arma su propio texto —sabe qué es relevante para su
 * tipo de pregunta— y decide qué sacrificar si no cabe. Aquí solo vive el
 * límite del enlace, que es lo único común a todos.
 */
export function urlChatGPT(completo, recortado = completo) {
  const url = aUrl(completo)
  return url.length <= LARGO_MAXIMO_URL ? url : aUrl(recortado)
}
