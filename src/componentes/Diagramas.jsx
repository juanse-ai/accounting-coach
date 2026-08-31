import { useState } from 'react'

/**
 * Las formas de la presentación.
 *
 * Seis dibujos construidos en marcado y CSS —no como imagen— para que el
 * texto siga siendo texto: se lee con lector de pantalla, se busca con Ctrl+F
 * y escala con el zoom del navegador. Lo que es puro trazo (reglas, flechas,
 * el lazo del balance) va con aria-hidden.
 *
 * Cada componente dibuja una FORMA y no un tema: qué dice la forma lo pone la
 * lámina, en su columna `datos`. Por eso una misma tabla sirve para las cinco
 * familias contables y para comparar tres adquisiciones, sin tocar el código.
 * Cada forma documenta abajo qué estructura espera.
 */

/**
 * Una foto de la lámina. `loading` va en eager a propósito: en la lámina sólo
 * existe una imagen y es justo lo que se está mirando, así que diferirla es lo
 * contrario de lo que hace falta.
 *
 * Si el archivo no carga, el texto alternativo deja de ser alternativo y pasa
 * a leerse en pantalla: la lámina pierde la foto pero no lo que la foto decía.
 * El `key={src}` en quien la usa es lo que devuelve `fallo` a false al cambiar
 * de lámina; sin él, una foto rota se llevaría por delante a las siguientes.
 */
export function Foto({ src, alt, clase, encuadre }) {
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

/* Trazos en el estilo del resto de la app: 24x24, remates redondos, grosor 2.
   Los dos horizontales son los mismos que usa el selector de lado del asiento,
   para que la presentación y el quiz hablen igual. */
const TRAZO = {
  izquierda: 'M19 12H5M12 19l-7-7 7-7',
  derecha: 'M5 12h14M12 5l7 7-7 7',
  arriba: 'M12 19V5M5 12l7-7 7 7',
  abajo: 'M12 5v14M19 12l-7 7-7-7',
}

export function Flecha({ hacia, clase }) {
  if (!TRAZO[hacia]) return null
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

/**
 * Una celda con tono: flecha opcional + palabra. El color nunca carga solo el
 * significado — la palabra está siempre, y la flecha refuerza.
 */
function Celda({ texto, tono, flecha }) {
  return (
    <span className="dg__lado-celda" data-tono={tono ?? 'neutro'}>
      {flecha === 'izquierda' && <Flecha hacia="izquierda" clase="dg__flecha-lado" />}
      {texto}
      {flecha && flecha !== 'izquierda' && <Flecha hacia={flecha} clase="dg__flecha-lado" />}
    </span>
  )
}

/**
 * registro — un libro de una sola columna.
 * {titulo, filas: [{signo?, texto?, monto, marca?}], pie: {rotulo, valor}}
 * `signo` '+' o '−' colorea y rotula la fila; sin signo la fila es neutra.
 */
function Registro({ datos }) {
  const filas = datos.filas ?? []
  const conTexto = filas.some((f) => f.texto)
  return (
    <div className="dg dg--simple" data-columnas={conTexto ? '4' : '3'}>
      {datos.titulo && <p className="dg__titulo">{datos.titulo}</p>}
      <ul className="dg__filas">
        {filas.map((f, i) => (
          <li
            key={i}
            className="dg__fila"
            data-signo={f.signo === '+' ? 'entra' : f.signo === '−' ? 'sale' : 'neutro'}
          >
            <span className="dg__signo" aria-hidden="true">
              {f.signo ?? ''}
            </span>
            {f.signo && (
              <span className="visualmente-oculto">{f.signo === '+' ? 'Entra' : 'Sale'}</span>
            )}
            {conTexto && <span className="dg__texto">{f.texto ?? ''}</span>}
            <span className="dg__monto cifra">{f.monto}</span>
            <span className="dg__causa">{f.marca ?? ''}</span>
          </li>
        ))}
      </ul>
      {datos.pie && (
        <p className="dg__pie">
          <span>{datos.pie.rotulo}</span>
          <span className="cifra">{datos.pie.valor}</span>
        </p>
      )}
    </div>
  )
}

/**
 * flujo — nodos encadenados por flechas.
 * {nodos: [{texto}], imagenEnMedio?: boolean}
 * Con `imagenEnMedio` la foto de la lámina se intercala en el centro.
 */
function Flujo({ datos, imagen }) {
  const nodos = datos.nodos ?? []
  const medio = datos.imagenEnMedio && imagen ? Math.ceil(nodos.length / 2) : -1

  const flecha = (clave) => (
    <svg key={clave} className="dg__flecha" viewBox="0 0 40 12" aria-hidden="true">
      <path
        d="M1 6h34M30 1l6 5-6 5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )

  return (
    <div className="dg dg--causa">
      {nodos.flatMap((n, i) => {
        const piezas = []
        if (i > 0) piezas.push(flecha(`f${i}`))
        if (i === medio) {
          piezas.push(
            <Foto key="foto" src={imagen.src} alt={imagen.alt} clase="dg__foto" />,
            flecha('f-medio')
          )
        }
        piezas.push(
          <span key={`n${i}`} className="dg__polo">
            {n.texto}
          </span>
        )
        return piezas
      })}
    </div>
  )
}

/**
 * balance — dos columnas enfrentadas con sus totales, atadas por un sello.
 * {columnas: [{rotulo, filas: [{cuenta, monto}], total}] (exactamente dos),
 *  signo?, sello?}
 */
function Balance({ datos }) {
  const [izquierda, derecha] = datos.columnas ?? []

  const columna = (col) =>
    col && (
      <div className="dg__columna">
        <p className="dg__rotulo">{col.rotulo}</p>
        <ul className="dg__asientos">
          {(col.filas ?? []).map((f, i) => (
            <li key={i}>
              <span className="dg__cuenta">{f.cuenta}</span>
              <span className="dg__valor cifra">{f.monto}</span>
            </li>
          ))}
        </ul>
        {col.total && (
          <p className="dg__total">
            <span>Total</span>
            <span className="cifra">{col.total}</span>
          </p>
        )}
      </div>
    )

  return (
    <div className="dg dg--verificacion">
      {columna(izquierda)}
      <span className="dg__eje" aria-hidden="true" />
      {columna(derecha)}
      {datos.sello && (
        <>
          <span className="dg__lazo" aria-hidden="true" />
          <p className="dg__sello">
            {datos.signo && (
              <span className="dg__igual" aria-hidden="true">
                {datos.signo}
              </span>
            )}
            {datos.sello}
          </p>
        </>
      )}
    </div>
  )
}

/**
 * partido — una hoja partida al medio en dos mitades rotuladas.
 * {mitades: [{rotulo}, {rotulo}], reglas?: boolean}
 */
function Partido({ datos }) {
  const [a, b] = datos.mitades ?? []
  const mitad = (m) =>
    m && (
      <div className="dg__mitad">
        <p className="dg__rotulo">{m.rotulo}</p>
        {datos.reglas && <span className="dg__reglas" aria-hidden="true" />}
      </div>
    )
  return (
    <div className="dg dg--mayor">
      {mitad(a)}
      <span className="dg__pliegue" aria-hidden="true" />
      {mitad(b)}
    </div>
  )
}

/**
 * tabla — encabezados y filas. La primera celda de cada fila es su encabezado.
 * {columnas: [{rotulo, sentido?}], filas: [{celdas: [{texto, tono?, flecha?}]}]}
 */
function Tabla({ datos }) {
  const columnas = datos.columnas ?? []
  return (
    <div className="dg dg--tabla">
      <table className="dg__tabla">
        <thead>
          <tr>
            {columnas.map((c, i) => (
              <th key={i} scope="col">
                {c.sentido ? (
                  <span className="dg__encabezado">
                    <Flecha hacia={c.sentido} clase="dg__flecha-sentido" />
                    {c.rotulo}
                  </span>
                ) : (
                  c.rotulo
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {(datos.filas ?? []).map((f, i) => (
            <tr key={i}>
              {(f.celdas ?? []).map((celda, j) =>
                j === 0 ? (
                  <th key={j} scope="row">
                    {celda.texto}
                  </th>
                ) : (
                  <td key={j}>
                    <Celda {...celda} />
                  </td>
                )
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

/**
 * marcas — logos sobre placa clara, con pie opcional en cada uno.
 * {items: [{src, alt, pie?, escala?}], separador?: '×', pie?: 'texto al pie'}
 *
 * La placa clara no es decoración: un logo viene dibujado para fondo blanco y
 * sobre el negro de la baraja la mitad desaparece. Con la placa entra
 * cualquier marca sin tener que retocarla.
 *
 * El tamaño y el número de columnas salen de cuántos items hay: dos logos son
 * una portada, cuatro caben en una columna y se leen como una cronología, y de
 * cinco en adelante hacen falta dos columnas para que sea un muro. No hace
 * falta decirlo en los datos.
 */
function Marcas({ datos }) {
  const items = datos.items ?? []
  return (
    <div
      className="dg dg--marcas"
      data-columnas={items.length > 4 ? 'dos' : 'una'}
      data-tamano={items.length <= 2 ? 'grande' : 'normal'}
    >
      <ul className="dg__marcas">
        {items.flatMap((m, i) => [
          ...(i > 0 && datos.separador
            ? [
                <li key={`s${i}`} className="dg__marca-signo" aria-hidden="true">
                  {datos.separador}
                </li>,
              ]
            : []),
          <li key={i} className="dg__marca-celda">
            {/* `escala` corrige el aire que cada marca trae dibujado dentro de
                su propio archivo: a la misma altura, un logotipo apretado se ve
                el doble que uno con margen. Es ajuste óptico, no tamaño. */}
            <span className="dg__marca" style={m.escala ? { '--escala': m.escala } : undefined}>
              <Foto key={m.src} src={m.src} alt={m.alt} clase="dg__marca-img" encuadre="contener" />
            </span>
            {m.pie && <span className="dg__marca-pie">{m.pie}</span>}
          </li>,
        ])}
      </ul>
      {datos.pie && <p className="dg__marca-total">{datos.pie}</p>}
    </div>
  )
}

/**
 * bloqueT — un bloque en T: nombre arriba, dos lados, un pie.
 * {nombre, lados: [{rotulo}, {rotulo}], pie}
 */
function BloqueT({ datos }) {
  return (
    <div className="dg dg--t">
      <p className="dg__nombre">{datos.nombre}</p>
      <div className="dg__t">
        {(datos.lados ?? []).map((l, i) => (
          <div key={i} className="dg__lado">
            <span className="dg__rotulo">{l.rotulo}</span>
          </div>
        ))}
      </div>
      {datos.pie && (
        <p className="dg__saldo">
          <span>{datos.pie}</span>
        </p>
      )}
    </div>
  )
}

// Las claves son las que la columna `laminas.visual` puede nombrar. Una forma
// nueva es un componente más y una línea más; una lámina que nombre algo que
// no está aquí simplemente no dibuja nada.
const FORMAS = {
  registro: Registro,
  flujo: Flujo,
  balance: Balance,
  partido: Partido,
  tabla: Tabla,
  bloqueT: BloqueT,
  marcas: Marcas,
}

export default function Diagrama({ visual, datos, imagen }) {
  const Forma = FORMAS[visual]
  if (!Forma) return null
  return <Forma datos={datos ?? {}} imagen={imagen} />
}
