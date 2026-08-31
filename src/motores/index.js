import { asiento } from './asiento.jsx'
import { opcion } from './opcion.jsx'

/**
 * Un motor por tipo de pregunta. Cada uno sabe cinco cosas y solo esas: con
 * qué borrador empieza, cómo se edita, cómo se califica, qué se guarda y cómo
 * se muestra —la solución al acertar, el envío en el tablero—.
 *
 * El quiz no conoce ningún tipo: busca el motor por `pregunta.tipo` y le
 * delega. Sumar un tipo nuevo es escribir un módulo y agregarlo aquí; no se
 * toca el quiz, ni el tablero, ni la base.
 *
 * Las claves tienen que coincidir con el CHECK de `preguntas.tipo`.
 */
export const MOTORES = { asiento, opcion }

export const motorDe = (pregunta) => (pregunta ? (MOTORES[pregunta.tipo] ?? null) : null)
