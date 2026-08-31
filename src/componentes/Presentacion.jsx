import { useCallback, useEffect, useRef, useState } from 'react'
import Diagrama, { Flecha, Foto } from './Diagramas.jsx'

/**
 * La presentación de una clase, en un <dialog> nativo.
 *
 * No sabe de qué trata: recibe las láminas y las dibuja. Una lámina trae un
 * rótulo, un título partido en segmentos —para poder acentuar una parte sin
 * adivinar dónde cortar la cadena—, un cuerpo de bloques, y opcionalmente una
 * forma (`visual` + `datos`) o una foto.
 */

/* ── Lámina ────────────────────────────────────────────────── */

function Bloque({ bloque }) {
  if (bloque.tipo === 'fichas') {
    return (
      <ol className="aprende__fichas" role="list">
        {(bloque.items ?? []).map((item, j) => (
          <li key={j}>
            <span className="aprende__num" aria-hidden="true">
              {String(j + 1).padStart(2, '0')}
            </span>
            <span className="aprende__item">{item.texto}</span>
            {/* La ficha dice "↑ Débito"; sin la leyenda el lector de pantalla
                oiría "Activos, Débito" y se perdería la relación. */}
            {bloque.leyenda && <span className="visualmente-oculto">{bloque.leyenda}</span>}
            <span className="aprende__ficha" data-tono={item.tono ?? 'neutro'}>
              <Flecha hacia={item.flecha} clase="aprende__ficha-flecha" />
              {item.ficha}
            </span>
          </li>
        ))}
      </ol>
    )
  }

  if (bloque.tipo === 'lista') {
    return (
      <ol className="aprende__lista" role="list">
        {(bloque.items ?? []).map((item, j) => (
          <li key={j}>
            {/* El número se ve pero no se anuncia: la <ol> ya numera,
                y oírlo dos veces es ruido. */}
            <span className="aprende__num" aria-hidden="true">
              {String(j + 1).padStart(2, '0')}
            </span>
            {item}
          </li>
        ))}
      </ol>
    )
  }

  return <p>{bloque.texto}</p>
}

function Lamina({ lamina, total }) {
  return (
    <article
      className="aprende__lamina"
      role="group"
      aria-roledescription="lámina"
      aria-label={`${lamina.numero} de ${total}`}
    >
      <div className="aprende__texto">
        {/* El rótulo es opcional: cuando no aporta más que el título, estorba. */}
        {lamina.etiqueta && <p className="aprende__etiqueta">{lamina.etiqueta}</p>}
        <h3 className="aprende__titulo">
          {lamina.titulo.map((seg, i) => (
            <span key={i} className={seg.acento ? 'aprende__acento' : undefined}>
              {seg.t}
            </span>
          ))}
        </h3>
        <div className="aprende__cuerpo">
          {lamina.cuerpo.map((bloque, i) => (
            <Bloque key={i} bloque={bloque} />
          ))}
        </div>
      </div>

      <div className="aprende__visual">
        {lamina.visual ? (
          <Diagrama visual={lamina.visual} datos={lamina.datos} imagen={lamina.imagen} />
        ) : (
          lamina.imagen && (
            <figure className="aprende__figura">
              <Foto
                key={lamina.imagen.src}
                src={lamina.imagen.src}
                alt={lamina.imagen.alt}
                clase="aprende__foto"
                encuadre={lamina.imagen.encuadre}
              />
              {/* Una foto con licencia Creative Commons obliga a acreditar a
                  quien la hizo. Sin sitio donde ponerlo, la única salida
                  honesta sería no usarla. */}
              {lamina.imagen.credito && (
                <figcaption className="aprende__credito">{lamina.imagen.credito}</figcaption>
              )}
            </figure>
          )
        )}
      </div>
    </article>
  )
}

/* ── Diálogo ───────────────────────────────────────────────── */

/**
 * La presentación vive en un <dialog> nativo abierto con showModal(). Eso
 * regala lo que aquí habría que escribir a mano y mantener: trampa de foco,
 * cierre con Escape, inertizado del resto de la página, ::backdrop y capa
 * superior —el z-index 30 de la cabecera deja de importar—. Lo único que hay
 * que devolverle a React es el evento `close`, para que el estado de arriba
 * se entere cuando el navegador cierra por su cuenta.
 */
export default function Presentacion({ abierto, onCerrar, laminas = [], titulo }) {
  const dialogoRef = useRef(null)
  const [indice, setIndice] = useState(0)

  useEffect(() => {
    const dialogo = dialogoRef.current
    if (!dialogo) return

    // El guardia importa: en desarrollo StrictMode monta el efecto dos veces
    // y showModal() lanza InvalidStateError sobre un diálogo ya abierto.
    if (abierto && !dialogo.open) {
      dialogo.showModal()
    } else if (!abierto && dialogo.open) {
      dialogo.close()
    }
  }, [abierto])

  // El navegador cierra solo con Escape. Sin esto, `abierto` seguiría en true
  // y el botón "Aprende" no volvería a abrir la presentación.
  useEffect(() => {
    const dialogo = dialogoRef.current
    if (!dialogo) return
    const alCerrar = () => onCerrar()
    dialogo.addEventListener('close', alCerrar)
    return () => dialogo.removeEventListener('close', alCerrar)
  }, [onCerrar])

  // showModal() inertiza el fondo pero no le quita el scroll: sin esto, la
  // rueda del ratón sigue moviendo la página por debajo del diálogo.
  useEffect(() => {
    if (!abierto) return
    // Quitar la barra de scroll ensancha el viewport y la cabecera píldora,
    // que está centrada, daría un salto. Se repone su ancho como relleno.
    const barra = window.innerWidth - document.documentElement.clientWidth
    const overflowPrevio = document.body.style.overflow
    const rellenoPrevio = document.body.style.paddingRight
    document.body.style.overflow = 'hidden'
    if (barra > 0) document.body.style.paddingRight = `${barra}px`
    return () => {
      document.body.style.overflow = overflowPrevio
      document.body.style.paddingRight = rellenoPrevio
    }
  }, [abierto])

  // Se pide por adelantado la foto de la lámina siguiente: la flecha derecha
  // debe mostrarla, no empezar a buscarla. Sólo con la presentación abierta,
  // para no gastarle datos a quien nunca la abre.
  useEffect(() => {
    if (!abierto) return
    const proxima = laminas[indice + 1]?.imagen?.src
    if (!proxima) return
    const precarga = new Image()
    precarga.src = proxima
  }, [abierto, indice, laminas])

  const ir = useCallback(
    (paso) => {
      setIndice((i) => Math.min(laminas.length - 1, Math.max(0, i + paso)))
    },
    [laminas.length]
  )

  // El foco está atrapado dentro del diálogo, así que el listener puede vivir
  // en el elemento y no en document: no hay que apagarlo al cerrar.
  const alTeclear = (evento) => {
    if (evento.key === 'ArrowRight') ir(1)
    else if (evento.key === 'ArrowLeft') ir(-1)
    else if (evento.key === 'Home') setIndice(0)
    else if (evento.key === 'End') setIndice(laminas.length - 1)
    else return
    evento.preventDefault()
  }

  const lamina = laminas[Math.min(indice, laminas.length - 1)]

  return (
    <dialog
      className="aprende"
      ref={dialogoRef}
      aria-labelledby="aprende-rotulo"
      onKeyDown={alTeclear}
      // Clic fuera de la tarjeta: el <dialog> ocupa toda la pantalla, así que
      // el impacto directo sobre él es el que cayó en el ::backdrop.
      onClick={(e) => e.target === dialogoRef.current && onCerrar()}
    >
      {/* El contenido solo se monta con el diálogo abierto: así las fotos no
          se descargan para quien nunca entra a la presentación. */}
      {abierto && lamina && (
        <div className="aprende__marco">
          {/* Nombre estable del diálogo. Si lo diera el título de la lámina,
              el diálogo se llamaría distinto en cada flecha. */}
          <h2 className="visualmente-oculto" id="aprende-rotulo">
            {`Aprende: ${titulo}`}
          </h2>

          <header className="aprende__barra">
            <p className="aprende__contador">
              <span className="cifra">{lamina.numero}</span>
              <span className="aprende__contador-total"> / {laminas.length}</span>
            </p>
            <button
              type="button"
              className="aprende__cerrar"
              onClick={onCerrar}
              aria-label="Cerrar la presentación"
            >
              <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                <path
                  d="M6 6l12 12M18 6L6 18"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </header>

          <Lamina lamina={lamina} total={laminas.length} />

          <footer className="aprende__pie">
            <button
              type="button"
              className="boton"
              onClick={() => ir(-1)}
              disabled={indice === 0}
            >
              ← Anterior
            </button>

            <ol className="aprende__riel">
              {laminas.map((l, i) => (
                <li key={l.id}>
                  <button
                    type="button"
                    className="aprende__punto"
                    aria-current={i === indice ? 'true' : undefined}
                    onClick={() => setIndice(i)}
                  >
                    <span className="visualmente-oculto">{`Lámina ${l.numero}`}</span>
                  </button>
                </li>
              ))}
            </ol>

            <button
              type="button"
              className="boton"
              onClick={() => ir(1)}
              disabled={indice >= laminas.length - 1}
            >
              Siguiente →
            </button>
          </footer>

          {/* Cambiar de lámina no mueve el foco, así que el lector de pantalla
              necesita que alguien le diga dónde quedó. */}
          <p className="visualmente-oculto" role="status" aria-live="polite">
            {`Lámina ${indice + 1} de ${laminas.length}`}
          </p>
        </div>
      )}
    </dialog>
  )
}
