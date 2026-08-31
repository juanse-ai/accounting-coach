/* oxlint-disable react/only-export-components -- Un motor es, a propósito, un
   objeto que junta los componentes de un tipo de pregunta con su lógica: esa
   cohesión es el punto del registro. El costo es perder Fast Refresh en este
   archivo, que se toca poco. */
import { urlChatGPT } from '../logica/promptChatGPT.js'

/**
 * Motor de las preguntas de tipo «opción»: una sola respuesta correcta entre
 * varias. Mismo contrato que el motor del asiento, otra forma de responder.
 *
 * `borrador` es {elegida}: el índice marcado, o -1 mientras no haya ninguno.
 */

const LETRAS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']

const SIN_ELEGIR = -1

const elegidaValida = (pregunta, i) => i >= 0 && i < pregunta.datos.opciones.length

function Editor({ pregunta, borrador, onCambiar, bloqueado }) {
  return (
    // Radios de verdad y no botones con role: el navegador ya sabe moverse
    // entre ellos con las flechas y anunciar «2 de 4». Escribirlo a mano sería
    // reimplementar peor lo que el <input> hace gratis.
    <ul className="opciones" role="list">
      {pregunta.datos.opciones.map((o, i) => (
        <li key={i}>
          <label className="opcion" data-elegida={borrador.elegida === i}>
            <input
              className="opcion__radio"
              type="radio"
              name={`opciones-${pregunta.id}`}
              checked={borrador.elegida === i}
              disabled={bloqueado}
              onChange={() => onCambiar({ elegida: i })}
            />
            <span className="opcion__letra" aria-hidden="true">
              {LETRAS[i] ?? i + 1}
            </span>
            <span className="opcion__texto">{o.texto}</span>
          </label>
        </li>
      ))}
    </ul>
  )
}

function Solucion({ pregunta }) {
  const correcta = pregunta.datos.opciones.find((o) => o.correcta)
  return (
    <section className="solucion" aria-label="La respuesta">
      <h2 className="titulo-seccion">La respuesta</h2>
      <p className="solucion__texto">{correcta?.texto}</p>
      <aside className="nota">
        <span className="etiqueta-dato">Por qué</span>
        <p className="nota__texto">{pregunta.nota}</p>
      </aside>
    </section>
  )
}

function Envio({ datos }) {
  return (
    <p className="envio__eleccion">
      <span className="etiqueta-dato">Eligió</span>
      {datos?.texto ?? '—'}
    </p>
  )
}

export const opcion = {
  claseFormulario: 'respuesta',
  Editor,
  Solucion,
  Envio,

  borrador: () => ({ elegida: SIN_ELEGIR }),

  verificar: (borrador, pregunta) => {
    const { elegida } = borrador
    if (!elegidaValida(pregunta, elegida)) {
      return { estado: 'incompleto', mensaje: 'Elige una de las opciones antes de verificar.' }
    }

    const escogida = pregunta.datos.opciones[elegida]
    if (escogida.correcta) return { estado: 'correcto', errores: [] }

    // Se dice cuál falló, nunca cuál era: la pregunta se puede volver a
    // intentar, igual que un asiento errado.
    return {
      estado: 'incorrecto',
      errores: [{ tipo: 'sobra', texto: `«${escogida.texto}» no es la respuesta.` }],
      pista: 'Descarta primero las que son falsas por una razón evidente; suele quedar una sola en pie.',
    }
  },

  // Se guarda el índice y el texto: el índice para contar, el texto para que
  // el envío siga siendo legible aunque la pregunta se reescriba después.
  datos: (borrador, pregunta) => ({
    elegida: borrador.elegida,
    texto: pregunta.datos.opciones[borrador.elegida]?.texto ?? '',
  }),

  // A diferencia del asiento, aquí NO se le manda cuál es la correcta: con
  // cuatro opciones, decírselo a ChatGPT es decírselo al usuario, y la
  // pregunta se puede reintentar. Se le pide que razone sobre todas.
  ayuda: (pregunta, borrador) => {
    const escogida = pregunta.datos.opciones[borrador.elegida]?.texto
    return urlChatGPT(
      [
        'Estoy estudiando y me equivoqué en una pregunta de opción múltiple.',
        'Quiero entender el razonamiento. No me digas solo cuál es: analiza una por una y explícame en español por qué cada opción es verdadera o falsa.',
        '',
        `PREGUNTA (nivel ${pregunta.nivel}):`,
        pregunta.enunciado,
        ...(pregunta.aviso ? ['', `NOTA DEL ENUNCIADO: ${pregunta.aviso}`] : []),
        '',
        'OPCIONES:',
        ...pregunta.datos.opciones.map((o, i) => `${LETRAS[i] ?? i + 1}) ${o.texto}`),
        '',
        ...(escogida ? [`YO ELEGÍ: ${escogida}`, ''] : []),
        'Explícame qué concepto hay detrás de la pregunta y cómo debería haber razonado para llegar a la correcta.',
      ].join('\n')
    )
  },
}
