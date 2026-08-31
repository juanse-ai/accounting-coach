import { useCallback, useEffect, useRef, useState } from 'react'
import Backlog from './Backlog.jsx'
import Retratos from './Retratos.jsx'
import Retroalimentacion from './Retroalimentacion.jsx'
import { motorDe } from '../motores/index.js'
import { registrarRespuesta } from '../lib/respuestas.js'

// Rótulo del envío de la respuesta. 'omitido' no se anuncia: significa que
// no hay backend configurado y no hay nada que contar.
const AVISO_ENVIO = {
  guardando: 'Guardando tu respuesta…',
  guardado: 'Respuesta guardada.',
  pendiente: 'Sin conexión: tu respuesta se enviará cuando vuelva.',
}

/**
 * El quiz de una clase, sea cual sea.
 *
 * Todo lo que aquí se ve es la parte que no cambia entre tipos de pregunta:
 * la lista lateral, el enunciado, las acciones, la retroalimentación y la
 * navegación. Lo que sí cambia —cómo se responde, cómo se califica, qué se
 * guarda, cómo se ve la solución— se lo pide al motor de `pregunta.tipo`.
 *
 * Los borradores, resultados y envíos se guardan por id de pregunta, no por
 * posición: ir a otra clase y volver no borra un asiento a medio armar.
 */
export default function Quiz({ clase, participante, progreso, onMarcar }) {
  const [activo, setActivo] = useState('')
  const [borradores, setBorradores] = useState({})
  const [resultados, setResultados] = useState({})
  const [envios, setEnvios] = useState({})
  const panelRef = useRef(null)

  const preguntas = clase.preguntas
  // La selección puede apuntar a una pregunta de otra clase después de
  // cambiar: en ese caso se empieza por la primera.
  const pregunta = preguntas.find((p) => p.id === activo) ?? preguntas[0]
  const motor = motorDe(pregunta)

  const seleccionar = useCallback((id) => {
    setActivo(id)
    panelRef.current?.focus({ preventScroll: true })
    panelRef.current?.scrollIntoView({ block: 'start', behavior: 'auto' })
  }, [])

  // Los hooks van todos arriba: recién después es seguro cortar el render.
  useEffect(() => {
    if (pregunta && !motor) {
      console.warn(`[partida-doble] No hay motor para el tipo «${pregunta.tipo}».`)
    }
  }, [pregunta, motor])

  if (!pregunta) {
    return <p className="tablero__vacio">Esta clase todavía no tiene preguntas.</p>
  }

  if (!motor) {
    return (
      <p className="tablero__vacio">
        Esta versión de la app no sabe presentar preguntas de tipo «{pregunta.tipo}».
      </p>
    )
  }

  const borrador = borradores[pregunta.id] ?? motor.borrador(pregunta)
  const resultado = resultados[pregunta.id] ?? null
  const envio = envios[pregunta.id] ?? null
  const resuelto = resultado?.estado === 'correcto'

  const indice = preguntas.findIndex((p) => p.id === pregunta.id)
  const anterior = preguntas[indice - 1]
  const siguiente = preguntas[indice + 1]

  const cambiarBorrador = (nuevo) => {
    if (resuelto) return
    setBorradores((prev) => ({ ...prev, [pregunta.id]: nuevo }))
    // La retroalimentación anterior deja de valer en cuanto se edita la
    // respuesta, y el aviso del envío tampoco: se refiere a algo que ya no
    // está en pantalla. Lo enviado sigue guardado; lo que se borra es el rótulo.
    setResultados((prev) => (prev[pregunta.id] ? { ...prev, [pregunta.id]: null } : prev))
    setEnvios((prev) => (prev[pregunta.id] ? { ...prev, [pregunta.id]: null } : prev))
  }

  const limpiar = () => {
    setBorradores((prev) => ({ ...prev, [pregunta.id]: motor.borrador(pregunta) }))
    setResultados((prev) => ({ ...prev, [pregunta.id]: null }))
    setEnvios((prev) => ({ ...prev, [pregunta.id]: null }))
  }

  const verificar = (evento) => {
    evento.preventDefault()
    const salida = motor.verificar(borrador, pregunta, clase)
    setResultados((prev) => ({ ...prev, [pregunta.id]: salida }))
    if (salida.estado === 'correcto') onMarcar(pregunta.codigo, 'resuelto')
    else if (salida.estado === 'incorrecto') onMarcar(pregunta.codigo, 'errado')

    // Se guarda ahora, con este envío, no al terminar la clase. Una respuesta
    // a medio dar no llegó a ser una respuesta, así que no se manda.
    if (salida.estado === 'incompleto') return

    // La pregunta activa puede cambiar mientras la petición viaja: se congela
    // el id de la que se está enviando.
    const id = pregunta.id
    setEnvios((prev) => ({ ...prev, [id]: 'guardando' }))
    registrarRespuesta({
      participanteId: participante?.id,
      preguntaId: id,
      esCorrecta: salida.estado === 'correcto',
      datos: motor.datos(borrador, pregunta),
    })
      .then((estado) => setEnvios((prev) => ({ ...prev, [id]: estado })))
      .catch(() => setEnvios((prev) => ({ ...prev, [id]: 'pendiente' })))
  }

  return (
    <>
      <Backlog
        preguntas={preguntas}
        progreso={progreso}
        activo={pregunta.id}
        onSeleccionar={seleccionar}
      />

      <main className="panel" ref={panelRef} tabIndex={-1} aria-labelledby="enunciado-titulo">
        <section className="hecho">
          <div className="hecho__cabeza">
            <span className="hecho__num cifra">{pregunta.codigo}</span>
            <span className="insignia" data-nivel={pregunta.nivel}>
              {pregunta.nivel}
            </span>
            {progreso[pregunta.codigo] === 'resuelto' && (
              <span className="insignia insignia--ok">Resuelta</span>
            )}
          </div>
          <h2 className="hecho__texto" id="enunciado-titulo">
            {pregunta.enunciado}
          </h2>
          {pregunta.aviso && <p className="hecho__aviso">({pregunta.aviso})</p>}
          {/* Va debajo del enunciado y no encima: primero se lee qué se
              pregunta, después se miran las caras. Al revés son tres fotos
              sin contexto. */}
          {pregunta.apoyo && (
            <Retratos retratos={pregunta.apoyo.retratos} credito={pregunta.apoyo.credito} />
          )}
        </section>

        <form className={motor.claseFormulario} id="respuesta" onSubmit={verificar} noValidate>
          <motor.Editor
            pregunta={pregunta}
            clase={clase}
            borrador={borrador}
            onCambiar={cambiarBorrador}
            bloqueado={resuelto}
          />

          <div className="asiento__acciones">
            <button type="submit" className="ff-cta" disabled={resuelto}>
              Verificar
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
            </button>
            <button type="button" className="boton" onClick={limpiar}>
              {resuelto ? 'Volver a intentarlo' : 'Limpiar'}
            </button>
            {/* aria-live: confirma que la respuesta salió, sin robar el foco
                a la retroalimentación, que es lo que importa leer. */}
            <p className="asiento__envio" role="status" aria-live="polite" data-envio={envio}>
              {AVISO_ENVIO[envio] ?? ''}
            </p>
          </div>
        </form>

        <Retroalimentacion
          resultado={resultado}
          pregunta={pregunta}
          borrador={borrador}
          motor={motor}
        />

        {resuelto && <motor.Solucion pregunta={pregunta} />}

        <nav className="navegacion" aria-label="Navegación entre preguntas">
          <button
            type="button"
            className="boton"
            disabled={!anterior}
            onClick={() => anterior && seleccionar(anterior.id)}
          >
            ← Anterior
          </button>
          <button
            type="button"
            className="boton"
            disabled={!siguiente}
            onClick={() => siguiente && seleccionar(siguiente.id)}
          >
            Siguiente →
          </button>
        </nav>
      </main>
    </>
  )
}
