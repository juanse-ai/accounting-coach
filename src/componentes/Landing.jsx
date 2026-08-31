import { useId, useState } from 'react'
import LogoFailFast from './LogoFailFast.jsx'
import SelectorClase from './SelectorClase.jsx'

/**
 * Puerta de entrada. Nadie llega a las preguntas sin dejar nombre y correo:
 * es lo que amarra cada respuesta a una persona. Dice para qué se usan los
 * datos antes de pedirlos — el que va a practicar merece saberlo.
 *
 * La promesa que se lee arriba es la de la clase seleccionada y viene de la
 * base: cambiarla aquí cambia el texto, sin tocar el componente.
 */
export default function Landing({
  clases,
  slug,
  onSeleccionarClase,
  cargandoClases,
  errorClases,
  onRegistrar,
  enviando,
  errorServidor,
  onVerResultados,
}) {
  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [errores, setErrores] = useState({})

  const idNombre = useId()
  const idEmail = useId()

  const clase = clases.find((c) => c.slug === slug)

  const enviar = async (evento) => {
    evento.preventDefault()
    if (enviando) return
    const fallos = await onRegistrar({ nombre, email })
    setErrores(fallos ?? {})
  }

  // El error se limpia al escribir: mantenerlo mientras se corrige es ruido.
  const alEscribir = (campo, valor) => {
    if (campo === 'nombre') setNombre(valor)
    else setEmail(valor)
    if (errores[campo]) setErrores((prev) => ({ ...prev, [campo]: undefined }))
  }

  return (
    <div className="landing">
      <main className="landing__tarjeta">
        <LogoFailFast alto={20} />

        <div className="landing__intro">
          <span className="etiqueta-dato">
            {clase?.etiqueta ?? (cargandoClases ? 'Cargando…' : 'Clases')}
          </span>
          <h1 className="landing__titulo">
            {clase?.titular ?? (errorClases || 'Todavía no hay ninguna clase publicada.')}
          </h1>
          {clase?.bajada && <p className="landing__bajada">{clase.bajada}</p>}
        </div>

        {/* La clase se elige antes de entrar y se puede cambiar después desde
            la cabecera. Con una sola publicada, el selector no se dibuja. */}
        <SelectorClase clases={clases} valor={slug} onCambiar={onSeleccionarClase} />

        <form className="landing__form" onSubmit={enviar} noValidate>
          <div className="landing__campo">
            <label className="etiqueta-campo" htmlFor={idNombre}>
              Nombre
            </label>
            <input
              id={idNombre}
              className="entrada"
              type="text"
              name="name"
              autoComplete="name"
              maxLength={120}
              placeholder="Cómo te llamas"
              value={nombre}
              disabled={enviando}
              aria-invalid={Boolean(errores.nombre)}
              aria-describedby={errores.nombre ? `${idNombre}-error` : undefined}
              onChange={(e) => alEscribir('nombre', e.target.value)}
            />
            {errores.nombre && (
              <p className="landing__error" id={`${idNombre}-error`}>
                {errores.nombre}
              </p>
            )}
          </div>

          <div className="landing__campo">
            <label className="etiqueta-campo" htmlFor={idEmail}>
              Correo
            </label>
            <input
              id={idEmail}
              className="entrada"
              type="email"
              name="email"
              autoComplete="email"
              maxLength={254}
              placeholder="tu@correo.com"
              value={email}
              disabled={enviando}
              aria-invalid={Boolean(errores.email)}
              aria-describedby={errores.email ? `${idEmail}-error` : undefined}
              onChange={(e) => alEscribir('email', e.target.value)}
            />
            {errores.email && (
              <p className="landing__error" id={`${idEmail}-error`}>
                {errores.email}
              </p>
            )}
          </div>

          {/* aria-live: el fallo de red llega después del envío, sin foco. */}
          <p className="landing__error landing__error--bloque" role="alert" aria-live="polite">
            {errorServidor}
          </p>

          <button type="submit" className="ff-cta landing__cta" disabled={enviando || !clase}>
            {enviando ? 'Entrando…' : 'Empezar a practicar'}
            {!enviando && (
              <svg
                className="ff-cta-arrow"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            )}
          </button>

          <p className="landing__nota">
            Guardamos tu nombre, tu correo y cada respuesta que envíes, para poder
            revisar contigo dónde se traba la práctica. Tu nombre y tus respuestas
            aparecen en el tablero público; tu correo no sale de aquí. Si vuelves
            con el mismo correo, retomas tu historial.
          </p>
        </form>

        {/* El tablero no se enlaza desde aquí salvo que se haya llegado por su
            ruta: sin onVerResultados no hay a dónde ir, y el enlace sobra. */}
        {onVerResultados && (
          <div className="landing__salida">
            <button type="button" className="landing__enlace" onClick={onVerResultados}>
              Ver resultados públicos
              <span aria-hidden="true"> →</span>
            </button>
          </div>
        )}
      </main>
    </div>
  )
}
