import { Suspense, lazy, useCallback, useEffect, useRef, useState } from 'react'
import Landing from './componentes/Landing.jsx'
import LogoFailFast from './componentes/LogoFailFast.jsx'
import Presentacion from './componentes/Presentacion.jsx'
import Quiz from './componentes/Quiz.jsx'
import SelectorClase from './componentes/SelectorClase.jsx'
import { useClase } from './hooks/useClase.js'
import { useClases } from './hooks/useClases.js'
import { useParticipante } from './hooks/useParticipante.js'
import { useProgreso } from './hooks/useProgreso.js'
import { vaciarPendientes } from './lib/respuestas.js'

// Recharts y su cadena de dependencias pesan más que toda la app junta, y
// quien viene a practicar no necesita nada de eso. Se carga sólo cuando
// alguien abre el tablero.
const Resultados = lazy(() => import('./componentes/Resultados.jsx'))

// El tablero no es una vista más del menú: vive detrás de una ruta que no se
// enlaza desde ninguna parte. Sin router, la ruta se lee una sola vez al cargar
// el módulo — la app nunca cambia de URL, así que no hay nada que re-evaluar.
const RUTA_TABLERO = '/manchester-united'
const tableroHabilitado =
  window.location.pathname.replace(/\/+$/, '').toLowerCase() === RUTA_TABLERO

export default function App() {
  const { participante, registrar, salir, enviando, errorServidor } = useParticipante()
  const { clases, slug, seleccionar, cargando: cargandoClases, error: errorClases } = useClases()
  const { clase, cargando: cargandoClase, error: errorClase } = useClase(slug)
  const { progreso, marcar } = useProgreso(slug)
  const [vista, setVista] = useState(tableroHabilitado ? 'resultados' : 'preguntas')
  const [aprendiendo, setAprendiendo] = useState(false)
  const botonAprendeRef = useRef(null)

  // Al abrir la app se reintenta lo que quedó sin enviar en una visita
  // anterior, antes de que la persona genere respuestas nuevas.
  useEffect(() => {
    vaciarPendientes().catch(() => {})
  }, [])

  // La pestaña dice qué clase se está viendo: con dos abiertas, el título es
  // lo único que las distingue.
  useEffect(() => {
    document.title = clase ? `${clase.nombre} · Fail Fast` : 'Clases · Fail Fast'
  }, [clase])

  const cerrarAprende = useCallback(() => setAprendiendo(false), [])

  // El <dialog> nativo devuelve el foco al elemento que lo abrió, pero sólo si
  // lo que lo tenía sigue montado al cerrarse. Aquí el interior de la
  // presentación se desmonta —para no descargarle 1,5 MB de fotos a quien
  // nunca la abre— y el foco terminaba en el <body>: quien navega con teclado
  // perdía el sitio.
  //
  // Se devuelve a mano, y desde un efecto y no desde el manejador de `close`:
  // el efecto corre después de que React confirma el desmontaje, que es lo
  // único que garantiza que nadie pise el focus() a continuación.
  const estabaAprendiendo = useRef(false)
  useEffect(() => {
    if (estabaAprendiendo.current && !aprendiendo) botonAprendeRef.current?.focus()
    estabaAprendiendo.current = aprendiendo
  }, [aprendiendo])

  // Todos los hooks quedaron arriba: recién aquí es seguro cortar el render.
  //
  // La puerta sigue siendo puerta para practicar, pero no para mirar: el
  // tablero es público, así que un visitante sin registrar llega a él sin
  // dejar nada. Volver a "Preguntas" lo devuelve al formulario de entrada.
  const enTablero = tableroHabilitado && vista === 'resultados'
  if (!participante && !enTablero) {
    return (
      <Landing
        clases={clases}
        slug={slug}
        onSeleccionarClase={seleccionar}
        cargandoClases={cargandoClases}
        errorClases={errorClases}
        onRegistrar={registrar}
        enviando={enviando}
        errorServidor={errorServidor}
        onVerResultados={tableroHabilitado ? () => setVista('resultados') : undefined}
      />
    )
  }

  const preguntas = clase?.preguntas ?? []
  const totalResueltos = preguntas.filter((p) => progreso[p.codigo] === 'resuelto').length

  return (
    <div className="app">
      {/* Con la lista de preguntas al lado, el teclado necesita un atajo al
          formulario. */}
      {!enTablero && (
        <a className="salto" href="#respuesta">
          Saltar a la respuesta
        </a>
      )}

      <header className="cabecera">
        <div className="cabecera__marca">
          <LogoFailFast alto={18} />
          <span className="cabecera__divisor" aria-hidden="true" />
          <h1 className="cabecera__titulo">{clase?.nombre ?? 'Clases'}</h1>
          {participante && (
            <>
              <span className="cabecera__divisor" aria-hidden="true" />
              {/* El correo va en el title: es el dato que identifica la sesión,
                  pero no merece ocupar la píldora. */}
              <span className="cabecera__sesion" title={participante.email}>
                {participante.nombre}
              </span>
            </>
          )}
        </div>

        {/* Dos vistas, no dos páginas: la app no tiene router y la respuesta a
            medio armar tiene que sobrevivir a ir y volver. La segunda sólo
            aparece para quien llegó por RUTA_TABLERO. */}
        <nav className="cabecera__vistas" aria-label="Secciones">
          <SelectorClase clases={clases} valor={slug} onCambiar={seleccionar} compacto />
          <button
            type="button"
            className="cabecera__vista"
            aria-pressed={!enTablero}
            onClick={() => setVista('preguntas')}
          >
            Preguntas
          </button>
          {tableroHabilitado && (
            <button
              type="button"
              className="cabecera__vista"
              aria-pressed={enTablero}
              onClick={() => setVista('resultados')}
            >
              Resultados
            </button>
          )}
          {/* No es una tercera vista sino una puerta: abre la presentación
              encima de lo que haya, por eso lleva haspopup y no aria-pressed. */}
          <button
            type="button"
            className="cabecera__vista"
            ref={botonAprendeRef}
            aria-haspopup="dialog"
            aria-expanded={aprendiendo}
            disabled={!clase?.laminas.length}
            onClick={() => setAprendiendo(true)}
          >
            Aprende
          </button>
        </nav>

        <div className="cabecera__progreso">
          {participante ? (
            <>
              <span className="etiqueta-dato">Resueltas</span>
              <p className="cabecera__contador cifra">
                {String(totalResueltos).padStart(2, '0')}
                <span className="cabecera__total"> / {preguntas.length}</span>
              </p>
              <div
                className="cabecera__barra"
                role="progressbar"
                aria-valuenow={totalResueltos}
                aria-valuemin={0}
                aria-valuemax={preguntas.length}
                aria-label="Preguntas resueltas"
              >
                <span
                  style={{
                    width: preguntas.length
                      ? `${(totalResueltos / preguntas.length) * 100}%`
                      : '0%',
                  }}
                />
              </div>
              <div className="cabecera__acciones">
                {/* Salir solo cierra la sesión local: las respuestas ya enviadas
                    siguen guardadas y vuelven a asociarse con el mismo correo. */}
                <button type="button" className="boton boton--mini" onClick={salir}>
                  Salir
                </button>
              </div>
            </>
          ) : (
            // Visitante mirando el tablero sin registrarse: lo único que le
            // falta es la invitación a practicar.
            <div className="cabecera__acciones">
              <button
                type="button"
                className="boton boton--mini"
                onClick={() => setVista('preguntas')}
              >
                Entrar a practicar
              </button>
            </div>
          )}
        </div>
      </header>

      <div className="cuerpo" data-vista={vista}>
        {enTablero ? (
          <Suspense fallback={<p className="tablero__vacio">Cargando el tablero…</p>}>
            <Resultados clase={clase} participante={participante} />
          </Suspense>
        ) : cargandoClases || cargandoClase ? (
          <p className="tablero__vacio">Cargando la clase…</p>
        ) : clase ? (
          <Quiz
            clase={clase}
            participante={participante}
            progreso={progreso}
            onMarcar={marcar}
          />
        ) : (
          <p className="tablero__error" role="alert">
            {errorClase || errorClases || 'No hay ninguna clase publicada todavía.'}
          </p>
        )}
      </div>

      {/* La clave remonta la presentación al cambiar de clase: el índice de
          lámina de la anterior no tiene sentido en la nueva. */}
      {clase && (
        <Presentacion
          key={clase.slug}
          abierto={aprendiendo}
          onCerrar={cerrarAprende}
          laminas={clase.laminas}
          titulo={clase.nombre}
        />
      )}
    </div>
  )
}
