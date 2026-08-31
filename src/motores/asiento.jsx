/* oxlint-disable react/only-export-components -- Un motor es, a propósito, un
   objeto que junta los componentes de un tipo de pregunta con su lógica: esa
   cohesión es el punto del registro. El costo es perder Fast Refresh en este
   archivo, que se toca poco. */
import Balanza from '../componentes/Balanza.jsx'
import CuentasT from '../componentes/CuentasT.jsx'
import LineaAsiento from '../componentes/LineaAsiento.jsx'
import { urlChatGPT } from '../logica/promptChatGPT.js'
import { CUENTAS_PADRE, lineaVacia, totales, verificarAsiento } from '../logica/verificar.js'
import { formatearMonto } from '../utils/formato.js'

/**
 * Motor de las preguntas de tipo «asiento»: armar un asiento de libro diario
 * línea por línea y verificarlo contra el esperado.
 *
 * Todo lo que este tipo de pregunta necesita saber vive aquí — cómo se edita,
 * cómo se califica, qué se guarda, cómo se muestra la solución y cómo se ve un
 * envío en el tablero. El quiz solo lo busca en el registro y lo usa.
 */

// El id solo tiene que ser único dentro del borrador, y se deriva de él: así
// `borrador()` es pura y dos llamadas dan líneas iguales. Con un contador de
// módulo, un render que no alcanzara a guardar el borrador cambiaría las
// claves de React y el input perdería el foco a media palabra.
const nuevaLinea = (id) => ({ id, cuenta: '', padre: '', lado: '', monto: 0, montoTexto: '' })

const siguienteId = (lineas) =>
  `l${lineas.reduce((mayor, l) => Math.max(mayor, Number(String(l.id).slice(1)) || 0), 0) + 1}`

// Lista plana y alfabética a propósito: agruparla por cuenta padre regalaría
// la clasificación que la pregunta pide deducir. El orden se hace aquí y no en
// SQL porque «es» ordena las tildes como la gente espera.
const ordenar = (cuentas) =>
  [...cuentas].sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'))

function Editor({ clase, borrador, onCambiar, bloqueado }) {
  const lineas = borrador
  const cuentas = ordenar(clase.cuentas)
  const { debitos, creditos } = totales(lineas)

  const cambiarLinea = (idLinea, parche) =>
    onCambiar(lineas.map((l) => (l.id === idLinea ? { ...l, ...parche } : l)))

  const quitarLinea = (idLinea) =>
    onCambiar(lineas.length <= 2 ? lineas : lineas.filter((l) => l.id !== idLinea))

  return (
    <>
      <div className="asiento__cabecera" aria-hidden="true">
        <span className="asiento__col asiento__col--indice">Nº</span>
        <span className="asiento__col">Cuenta</span>
        <span className="asiento__col">Cuenta padre</span>
        <span className="asiento__col">Lado</span>
        <span className="asiento__col asiento__col--debito">Débito</span>
        <span className="asiento__col asiento__col--credito">Crédito</span>
        <span className="asiento__col asiento__col--quitar" />
      </div>

      <ul className="asiento__lineas">
        {lineas.map((linea, i) => (
          <LineaAsiento
            key={linea.id}
            linea={linea}
            cuentas={cuentas}
            indice={i}
            puedeQuitar={lineas.length > 2}
            bloqueada={bloqueado}
            onCambiar={cambiarLinea}
            onQuitar={quitarLinea}
          />
        ))}
      </ul>

      <div className="asiento__acciones-linea">
        <button
          type="button"
          className="boton"
          onClick={() => onCambiar([...lineas, nuevaLinea(siguienteId(lineas))])}
          disabled={bloqueado}
        >
          + Agregar línea
        </button>
      </div>

      <Balanza debitos={debitos} creditos={creditos} />
    </>
  )
}

function Solucion({ pregunta }) {
  return <CuentasT lineas={pregunta.datos.lineas} nota={pregunta.nota} />
}

function Envio({ datos }) {
  const FLECHA = { Débito: '←', Crédito: '→' }
  return (
    <ul className="envio__lineas">
      {(datos?.lineas ?? []).map((l) => (
        <li key={l.orden} className="envio__linea" data-lado={l.lado}>
          <span className="envio__cuenta">{l.cuenta}</span>
          <span className="envio__padre">{l.padre}</span>
          <span className="envio__lado">
            <span aria-hidden="true">{FLECHA[l.lado] ?? ''}</span> {l.lado}
          </span>
          <span className="envio__monto cifra">{formatearMonto(Number(l.monto))}</span>
        </li>
      ))}
    </ul>
  )
}

const describir = (l) =>
  `- ${l.cuenta || '(sin cuenta)'} · ${l.padre || '(sin clasificar)'} · ${
    l.lado || '(sin lado)'
  } · ${formatearMonto(l.monto)}`

/**
 * El asiento correcto va dentro a propósito —el usuario lo pidió— así que lo
 * que aporta ChatGPT es el porqué, no el qué. De ahí que el prompt le prohíba
 * limitarse a soltar la respuesta.
 */
function armarPrompt(pregunta, mias, errores) {
  return [
    'Estoy aprendiendo contabilidad de partida doble y me equivoqué en un ejercicio.',
    'Quiero entender el razonamiento, no solo la respuesta. Explícame el porqué paso a paso, en español.',
    '',
    `HECHO ECONÓMICO (ejercicio ${pregunta.codigo}, nivel ${pregunta.nivel}):`,
    pregunta.enunciado,
    '',
    'EL ASIENTO QUE YO REGISTRÉ:',
    ...(mias.length ? mias.map(describir) : ['- (no registré ninguna línea)']),
    '',
    'EL ASIENTO CORRECTO:',
    ...pregunta.datos.lineas.map(describir),
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

export const asiento = {
  claseFormulario: 'respuesta asiento',
  Editor,
  Solucion,
  Envio,

  borrador: () => [nuevaLinea('l1'), nuevaLinea('l2')],

  verificar: (borrador, pregunta, clase) =>
    verificarAsiento(borrador, pregunta.datos.lineas, clase.cuentas),

  // Solo las líneas que la persona llenó de verdad, con el monto numérico
  // que ya calculó el formulario.
  datos: (borrador) => ({
    lineas: borrador
      .filter((l) => !lineaVacia(l))
      .map((l) => ({ cuenta: l.cuenta, padre: l.padre, lado: l.lado, monto: l.monto })),
  }),

  ayuda: (pregunta, borrador, resultado) => {
    const mias = (borrador ?? []).filter((l) => !lineaVacia(l))
    const errores = resultado?.errores ?? []
    // Los señalamientos son lo más prescindible: ChatGPT puede deducirlos
    // comparando los dos asientos, que sí van siempre.
    return urlChatGPT(
      armarPrompt(pregunta, mias, errores),
      armarPrompt(pregunta, mias, [])
    )
  },
}
