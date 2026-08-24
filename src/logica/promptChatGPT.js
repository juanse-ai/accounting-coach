import { CUENTAS_PADRE } from '../data/planCuentas.js'
import { formatearMonto } from '../utils/formato.js'
import { lineaVacia } from './verificar.js'

const BASE = 'https://chatgpt.com/'

// Margen cómodo por debajo de lo que cualquier navegador o servidor acepta
// en una query string. Si el prompt se pasa, se recorta la sección más
// redundante en vez de truncar una frase por la mitad.
const LARGO_MAXIMO_URL = 2000

const describir = (l) =>
  `- ${l.cuenta || '(sin cuenta)'} · ${l.padre || '(sin clasificar)'} · ${
    l.lado || '(sin lado)'
  } · ${formatearMonto(l.monto)}`

function armar(ejercicio, mias, errores) {
  return [
    'Estoy aprendiendo contabilidad de partida doble y me equivoqué en un ejercicio.',
    'Quiero entender el razonamiento, no solo la respuesta. Explícame el porqué paso a paso, en español.',
    '',
    `HECHO ECONÓMICO (ejercicio ${ejercicio.id}, nivel ${ejercicio.nivel}):`,
    ejercicio.hecho,
    '',
    'EL ASIENTO QUE YO REGISTRÉ:',
    ...(mias.length ? mias.map(describir) : ['- (no registré ninguna línea)']),
    '',
    'EL ASIENTO CORRECTO:',
    ...ejercicio.lineas.map(describir),
    '',
    ...(errores.length ? ['LO QUE LA APP ME SEÑALÓ:', ...errores.map((e) => `- ${e.texto}`), ''] : []),
    `Contexto: las cuentas padre posibles son ${CUENTAS_PADRE.join(', ')}. En una cuenta T el débito va a la izquierda y el crédito a la derecha, y todo asiento debe cuadrar.`,
    '',
    'Explícame tres cosas:',
    '1) Por qué el asiento correcto es ese, cuenta por cuenta.',
    '2) Qué razonamiento equivocado me pudo llevar a lo que yo registré.',
    '3) Cómo reconocer este mismo patrón la próxima vez que aparezca.',
  ].join('\n')
}

const aUrl = (texto) => {
  const url = new URL(BASE)
  url.searchParams.set('q', texto)
  return url.toString()
}

/**
 * Texto que se le inyecta a ChatGPT cuando el asiento salió mal: el hecho
 * económico, lo que el usuario registró, el asiento esperado, los
 * señalamientos de la app y las reglas de la cuenta T.
 *
 * El asiento correcto va dentro a propósito —el usuario lo pidió— así que lo
 * que aporta ChatGPT es el porqué, no el qué. De ahí que el prompt le prohíba
 * limitarse a soltar la respuesta.
 */
export function construirPrompt(ejercicio, lineasUsuario, resultado) {
  const mias = (lineasUsuario ?? []).filter((l) => !lineaVacia(l))
  const errores = resultado?.errores ?? []

  const completo = armar(ejercicio, mias, errores)
  if (aUrl(completo).length <= LARGO_MAXIMO_URL) return completo

  // Los señalamientos son lo más prescindible: ChatGPT puede deducirlos
  // comparando los dos asientos, que sí van siempre.
  return armar(ejercicio, mias, [])
}

export function urlChatGPT(ejercicio, lineasUsuario, resultado) {
  return aUrl(construirPrompt(ejercicio, lineasUsuario, resultado))
}
