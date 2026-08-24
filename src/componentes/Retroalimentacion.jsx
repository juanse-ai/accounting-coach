import { urlChatGPT } from '../logica/promptChatGPT.js'

function FlechaSalida() {
  return (
    <svg
      className="boton__icono"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M7 17 17 7M7 7h10v10" />
    </svg>
  )
}

export default function Retroalimentacion({ resultado, ejercicio, lineas }) {
  if (!resultado) return null

  if (resultado.estado === 'incompleto') {
    return (
      <section className="retro retro--aviso" role="alert">
        <p className="retro__titulo">Falta completar el asiento</p>
        <p className="retro__texto">{resultado.mensaje}</p>
      </section>
    )
  }

  if (resultado.estado === 'correcto') {
    return (
      <section className="retro retro--acierto" role="status">
        <p className="retro__titulo">Asiento correcto</p>
        <p className="retro__texto">
          Las cuentas, su clasificación, los lados y los montos coinciden con el registro esperado.
        </p>
      </section>
    )
  }

  return (
    <section className="retro retro--error" role="alert">
      <p className="retro__titulo">
        Hay algo que revisar
        {resultado.correctas > 0 && (
          <span className="retro__parcial">
            {resultado.correctas === 1
              ? ' · 1 línea ya está bien'
              : ` · ${resultado.correctas} líneas ya están bien`}
          </span>
        )}
      </p>
      <ul className="retro__lista">
        {resultado.errores.map((e, i) => (
          <li key={i} className="retro__item" data-tipo={e.tipo}>
            {e.texto}
          </li>
        ))}
      </ul>
      <p className="retro__pista">
        <span className="etiqueta-dato">Pista</span>
        {resultado.pista}
      </p>

      {/* Salida de emergencia: se lleva el ejercicio entero a ChatGPT —el hecho,
          lo que registraste, el asiento esperado y los errores— para que
          explique el razonamiento. Solo aparece cuando el asiento salió mal. */}
      <div className="retro__acciones">
        <a
          className="boton boton--demo"
          href={urlChatGPT(ejercicio, lineas, resultado)}
          target="_blank"
          rel="noopener noreferrer"
        >
          Pregúntale a ChatGPT
          <FlechaSalida />
          <span className="visualmente-oculto">(se abre en una pestaña nueva)</span>
        </a>
      </div>
    </section>
  )
}
