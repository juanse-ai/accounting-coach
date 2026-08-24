import { useCallback, useEffect, useRef, useState } from 'react'
import { FAMILIAS, LAMINAS, VERIFICACION } from '../data/aprende.js'

/**
 * Una foto de la baraja. `loading` va en eager a propósito: en la lámina sólo
 * existe una imagen y es justo lo que se está mirando, así que diferirla es lo
 * contrario de lo que hace falta.
 *
 * Si el archivo no carga, el texto alternativo deja de ser alternativo y pasa
 * a leerse en pantalla: la lámina pierde la foto pero no lo que la foto decía.
 * El `key={src}` en quien la usa es lo que devuelve `fallo` a false al cambiar
 * de lámina; sin él, una foto rota se llevaría por delante a las siguientes.
 */
function Foto({ src, alt, clase, encuadre }) {
  const [fallo, setFallo] = useState(false)

  if (fallo) {
    return (
      <p className={`${clase} ${clase}--sin-foto`} role="img" aria-label={alt}>
        {alt}
      </p>
    )
  }

  return (
    <img
      className={clase}
      src={src}
      alt={alt}
      data-encuadre={encuadre ?? 'cubrir'}
      loading="eager"
      decoding="async"
      fetchPriority="high"
      onError={() => setFallo(true)}
    />
  )
}

/* ── Diagramas ─────────────────────────────────────────────
   Seis láminas no traen foto sino un dibujo, y el dibujo ES el contenido que
   se enseña. Se construyen en marcado y CSS —no como imagen— para que el
   texto siga siendo texto: se lee con lector de pantalla, se busca con
   Ctrl+F y escala con el zoom del navegador. Lo que es puro trazo (reglas,
   flechas, la línea de verificación) va con aria-hidden. */

/** Lámina 2. Una sola columna: tres entradas idénticas que ocultan tres
    hechos distintos. El "¿?" es el argumento de la lámina. */
function EntradaSimple() {
  const movimientos = [
    { signo: '+', monto: '1.000', causa: true },
    { signo: '−', monto: '350' },
    { signo: '+', monto: '1.000', causa: true },
    { signo: '−', monto: '120' },
    { signo: '+', monto: '1.000', causa: true },
  ]
  return (
    <div className="dg dg--simple">
      <p className="dg__titulo">Caja · libro de una columna</p>
      <ul className="dg__filas">
        {movimientos.map((m, i) => (
          <li key={i} className="dg__fila" data-signo={m.signo === '+' ? 'entra' : 'sale'}>
            <span className="dg__signo" aria-hidden="true">
              {m.signo}
            </span>
            <span className="visualmente-oculto">
              {m.signo === '+' ? 'Entra' : 'Sale'}
            </span>
            <span className="dg__monto cifra">{m.monto}</span>
            <span className="dg__causa">{m.causa ? '¿?' : ''}</span>
          </li>
        ))}
      </ul>
      <p className="dg__pie">
        <span>Saldo</span>
        <span className="cifra">2.530</span>
      </p>
    </div>
  )
}

/** Lámina 8. Causa → efecto, con la foto en el medio. */
function CausaEfecto({ imagen }) {
  return (
    <div className="dg dg--causa">
      <span className="dg__polo">Causa</span>
      <svg className="dg__flecha" viewBox="0 0 40 12" aria-hidden="true">
        <path
          d="M1 6h34M30 1l6 5-6 5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <Foto key={imagen.src} src={imagen.src} alt={imagen.alt} clase="dg__foto" />
      <svg className="dg__flecha" viewBox="0 0 40 12" aria-hidden="true">
        <path
          d="M1 6h34M30 1l6 5-6 5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span className="dg__polo">Efecto</span>
    </div>
  )
}

/** Lámina 9. Dos columnas enfrentadas y sus totales al pie, idénticos. */
function Verificacion() {
  const columna = (rotulo, filas) => (
    <div className="dg__columna">
      <p className="dg__rotulo">{rotulo}</p>
      <ul className="dg__asientos">
        {filas.map((f) => (
          <li key={f.cuenta}>
            <span className="dg__cuenta">{f.cuenta}</span>
            <span className="dg__valor cifra">{f.monto}</span>
          </li>
        ))}
      </ul>
      <p className="dg__total">
        <span>Total</span>
        <span className="cifra">{VERIFICACION.total}</span>
      </p>
    </div>
  )
  return (
    <div className="dg dg--verificacion">
      {columna('Débitos', VERIFICACION.debitos)}
      <span className="dg__eje" aria-hidden="true" />
      {columna('Créditos', VERIFICACION.creditos)}
      <span className="dg__lazo" aria-hidden="true" />
      <p className="dg__sello">
        <span className="dg__igual" aria-hidden="true">
          =
        </span>
        Los totales coinciden
      </p>
    </div>
  )
}

/** Lámina 10. La página del mayor partida al medio. Sin cifras: la lámina
    dice que débito y crédito son una posición, así que solo va la partición. */
function MayorPartido() {
  return (
    <div className="dg dg--mayor">
      <div className="dg__mitad">
        <p className="dg__rotulo">Débito</p>
        <span className="dg__reglas" aria-hidden="true" />
      </div>
      <span className="dg__pliegue" aria-hidden="true" />
      <div className="dg__mitad">
        <p className="dg__rotulo">Crédito</p>
        <span className="dg__reglas" aria-hidden="true" />
      </div>
    </div>
  )
}

/* Trazos de las flechas, en el estilo del resto de la app: 24x24, remates
   redondos, grosor 2. Los dos horizontales son los mismos que usa el selector
   de lado del asiento, para que la baraja y el ejercicio hablen igual. */
const TRAZO = {
  izquierda: 'M19 12H5M12 19l-7-7 7-7',
  derecha: 'M5 12h14M12 5l7 7-7 7',
  arriba: 'M12 19V5M5 12l7-7 7 7',
  abajo: 'M12 5v14M19 12l-7 7-7-7',
}

function Flecha({ hacia, clase }) {
  return (
    <svg
      className={clase}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={TRAZO[hacia]} />
    </svg>
  )
}

/** La celda de un lado: la flecha apunta a la columna donde cae el monto en la
    cuenta T —el débito a la izquierda, el crédito a la derecha—, que es
    justamente lo que remata el cuerpo de la lámina. La palabra sigue ahí: la
    flecha refuerza, no sustituye. */
function Lado({ lado }) {
  const debito = lado === 'Débito'
  return (
    <span className="dg__lado-celda" data-lado={lado}>
      {debito && <Flecha hacia="izquierda" clase="dg__flecha-lado" />}
      {lado}
      {!debito && <Flecha hacia="derecha" clase="dg__flecha-lado" />}
    </span>
  )
}

/** Lámina 11. La regla de las cinco familias, en tabla. */
function TablaFamilias() {
  return (
    <div className="dg dg--tabla">
      <table className="dg__tabla">
        <thead>
          <tr>
            <th scope="col">Familia</th>
            <th scope="col">
              <span className="dg__encabezado">
                <Flecha hacia="arriba" clase="dg__flecha-sentido" />
                Aumenta
              </span>
            </th>
            <th scope="col">
              <span className="dg__encabezado">
                <Flecha hacia="abajo" clase="dg__flecha-sentido" />
                Disminuye
              </span>
            </th>
          </tr>
        </thead>
        <tbody>
          {FAMILIAS.map((f) => (
            <tr key={f.familia}>
              <th scope="row">{f.familia}</th>
              <td>
                <Lado lado={f.aumenta} />
              </td>
              <td>
                <Lado lado={f.disminuye} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

/** Lámina 12. La cuenta T vacía y rotulada: nombre, partición, saldo. */
function CuentaTVacia() {
  return (
    <div className="dg dg--t">
      <p className="dg__nombre">Nombre de la cuenta</p>
      <div className="dg__t">
        <div className="dg__lado">
          <span className="dg__rotulo">Débito</span>
        </div>
        <div className="dg__lado">
          <span className="dg__rotulo">Crédito</span>
        </div>
      </div>
      <p className="dg__saldo">
        <span>Saldo</span>
      </p>
    </div>
  )
}

const DIAGRAMAS = {
  entradaSimple: EntradaSimple,
  causaEfecto: CausaEfecto,
  verificacion: Verificacion,
  mayorPartido: MayorPartido,
  tablaFamilias: TablaFamilias,
  cuentaT: CuentaTVacia,
}

/* ── Lámina ────────────────────────────────────────────────── */

function Lamina({ lamina }) {
  const Diagrama = lamina.visual ? DIAGRAMAS[lamina.visual] : null

  return (
    <article
      className="aprende__lamina"
      role="group"
      aria-roledescription="lámina"
      aria-label={`${lamina.id} de ${LAMINAS.length}`}
    >
      <div className="aprende__texto">
        <p className="aprende__etiqueta">{lamina.etiqueta}</p>
        <h3 className="aprende__titulo">
          {lamina.titulo.map((seg, i) =>
            seg.acento ? (
              <span key={i} className="aprende__acento">
                {seg.t}
              </span>
            ) : (
              <span key={i}>{seg.t}</span>
            )
          )}
        </h3>
        <div className="aprende__cuerpo">
          {lamina.cuerpo.map((bloque, i) =>
            bloque.tipo === 'lista' ? (
              <ol className="aprende__lista" role="list" key={i}>
                {bloque.items.map((item, j) => (
                  <li key={item}>
                    {/* El número se ve pero no se anuncia: la <ol> ya numera,
                        y oírlo dos veces es ruido. */}
                    <span className="aprende__num" aria-hidden="true">
                      {String(j + 1).padStart(2, '0')}
                    </span>
                    {item}
                  </li>
                ))}
              </ol>
            ) : (
              <p key={i}>{bloque.texto}</p>
            )
          )}
        </div>
      </div>

      <div className="aprende__visual">
        {Diagrama ? (
          <Diagrama imagen={lamina.imagen} />
        ) : (
          lamina.imagen && (
            <Foto
              key={lamina.imagen.src}
              src={lamina.imagen.src}
              alt={lamina.imagen.alt}
              clase="aprende__foto"
              encuadre={lamina.imagen.encuadre}
            />
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
export default function Aprende({ abierto, onCerrar }) {
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
  // debe mostrarla, no empezar a buscarla. Sólo con la baraja abierta, para no
  // gastarle datos a quien nunca la abre.
  useEffect(() => {
    if (!abierto) return
    const proxima = LAMINAS[indice + 1]?.imagen?.src
    if (!proxima) return
    const precarga = new Image()
    precarga.src = proxima
  }, [abierto, indice])

  const ir = useCallback((paso) => {
    setIndice((i) => Math.min(LAMINAS.length - 1, Math.max(0, i + paso)))
  }, [])

  // El foco está atrapado dentro del diálogo, así que el listener puede vivir
  // en el elemento y no en document: no hay que apagarlo al cerrar.
  const alTeclear = (evento) => {
    if (evento.key === 'ArrowRight') ir(1)
    else if (evento.key === 'ArrowLeft') ir(-1)
    else if (evento.key === 'Home') setIndice(0)
    else if (evento.key === 'End') setIndice(LAMINAS.length - 1)
    else return
    evento.preventDefault()
  }

  const lamina = LAMINAS[indice]

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
      {abierto && (
        <div className="aprende__marco">
          {/* Nombre estable del diálogo. Si lo diera el título de la lámina,
              el diálogo se llamaría distinto en cada flecha. */}
          <h2 className="visualmente-oculto" id="aprende-rotulo">
            Aprende: contabilidad básica
          </h2>

          <header className="aprende__barra">
            <p className="aprende__contador">
              <span className="cifra">{lamina.id}</span>
              <span className="aprende__contador-total"> / {LAMINAS.length}</span>
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

          <Lamina lamina={lamina} />

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
              {LAMINAS.map((l, i) => (
                <li key={l.id}>
                  <button
                    type="button"
                    className="aprende__punto"
                    aria-current={i === indice ? 'true' : undefined}
                    onClick={() => setIndice(i)}
                  >
                    <span className="visualmente-oculto">{`Lámina ${l.id}`}</span>
                  </button>
                </li>
              ))}
            </ol>

            <button
              type="button"
              className="boton"
              onClick={() => ir(1)}
              disabled={indice === LAMINAS.length - 1}
            >
              Siguiente →
            </button>
          </footer>

          {/* Cambiar de lámina no mueve el foco, así que el lector de pantalla
              necesita que alguien le diga dónde quedó. */}
          <p className="visualmente-oculto" role="status" aria-live="polite">
            {`Lámina ${indice + 1} de ${LAMINAS.length}`}
          </p>
        </div>
      )}
    </dialog>
  )
}
