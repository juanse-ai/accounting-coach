import { CUENTAS_ORDENADAS, CUENTAS_PADRE } from '../data/planCuentas.js'
import { DEBITO, CREDITO } from '../logica/verificar.js'
import { formatearEntrada, montoDesdeEntrada } from '../utils/formato.js'

// Trazo Lucide: 2px, extremos y uniones redondeados, como pide el sistema.
function Flecha({ hacia }) {
  return (
    <svg
      className="lado__flecha"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {hacia === 'izquierda' ? (
        <path d="M19 12H5M12 19l-7-7 7-7" />
      ) : (
        <path d="M5 12h14M12 5l7 7-7 7" />
      )}
    </svg>
  )
}

export default function LineaAsiento({
  linea,
  indice,
  puedeQuitar,
  onCambiar,
  onQuitar,
  bloqueada,
}) {
  const idBase = `linea-${linea.id}`
  const cambiar = (campo, valor) => onCambiar(linea.id, { [campo]: valor })

  const campoMonto = (
    <div className="linea__monto-campo">
      <label className="visualmente-oculto" htmlFor={`${idBase}-monto`}>
        Monto de la línea {indice + 1}
      </label>
      <input
        id={`${idBase}-monto`}
        className="entrada entrada--monto cifra"
        type="text"
        inputMode="numeric"
        autoComplete="off"
        placeholder="0"
        disabled={bloqueada}
        value={linea.montoTexto}
        onChange={(e) => {
          const texto = formatearEntrada(e.target.value)
          onCambiar(linea.id, { montoTexto: texto, monto: montoDesdeEntrada(texto) })
        }}
      />
    </div>
  )

  return (
    <li className="linea" data-lado={linea.lado || 'sin'}>
      <span className="linea__indice cifra" aria-hidden="true">
        {String(indice + 1).padStart(2, '0')}
      </span>

      <div className="linea__campo linea__campo--cuenta">
        <label className="etiqueta-campo" htmlFor={`${idBase}-cuenta`}>
          Cuenta
        </label>
        <select
          id={`${idBase}-cuenta`}
          className="entrada"
          disabled={bloqueada}
          value={linea.cuenta}
          onChange={(e) => cambiar('cuenta', e.target.value)}
        >
          <option value="">Elige una cuenta…</option>
          {CUENTAS_ORDENADAS.map((c) => (
            <option key={c.nombre} value={c.nombre}>
              {c.nombre}
              {c.contraria ? ' (contraria)' : ''}
            </option>
          ))}
        </select>
      </div>

      <div className="linea__campo linea__campo--padre">
        <label className="etiqueta-campo" htmlFor={`${idBase}-padre`}>
          Cuenta padre
        </label>
        <select
          id={`${idBase}-padre`}
          className="entrada"
          disabled={bloqueada}
          value={linea.padre}
          onChange={(e) => cambiar('padre', e.target.value)}
        >
          <option value="">Clasifícala…</option>
          {CUENTAS_PADRE.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
      </div>

      <div className="linea__campo linea__campo--lado">
        <span className="etiqueta-campo" id={`${idBase}-lado-label`}>
          Lado
        </span>
        <div className="lado" role="group" aria-labelledby={`${idBase}-lado-label`}>
          {/* Cada flecha apunta a la columna donde el monto caerá en la cuenta T:
              el Débito a la izquierda, el Crédito a la derecha. */}
          <button
            type="button"
            className="lado__boton lado__boton--debito"
            aria-pressed={linea.lado === DEBITO}
            disabled={bloqueada}
            onClick={() => cambiar('lado', linea.lado === DEBITO ? '' : DEBITO)}
          >
            <Flecha hacia="izquierda" />
            Débito
          </button>
          <button
            type="button"
            className="lado__boton lado__boton--credito"
            aria-pressed={linea.lado === CREDITO}
            disabled={bloqueada}
            onClick={() => cambiar('lado', linea.lado === CREDITO ? '' : CREDITO)}
          >
            Crédito
            <Flecha hacia="derecha" />
          </button>
        </div>
      </div>

      {/* El monto se sitúa en la columna del lado elegido: así la línea
          se lee como el renglón de un libro diario. */}
      <div className="linea__montos">
        <span className="etiqueta-campo etiqueta-campo--monto">Monto</span>
        <div className="linea__columnas">
          <div className="linea__columna linea__columna--debito">
            {/* En escritorio estos rótulos los da la cabecera de la tabla. */}
            <span className="linea__rotulo" aria-hidden="true">Débito</span>
            {linea.lado === DEBITO ? campoMonto : <span className="linea__hueco" aria-hidden="true" />}
          </div>
          <div className="linea__columna linea__columna--credito">
            <span className="linea__rotulo" aria-hidden="true">Crédito</span>
            {linea.lado === CREDITO ? campoMonto : <span className="linea__hueco" aria-hidden="true" />}
          </div>
        </div>
        {!linea.lado && <p className="linea__aviso">Elige un lado para escribir el monto</p>}
      </div>

      <button
        type="button"
        className="linea__quitar"
        onClick={() => onQuitar(linea.id)}
        disabled={bloqueada || !puedeQuitar}
        aria-label={`Quitar la línea ${indice + 1}`}
        title="Quitar línea"
      >
        <svg viewBox="0 0 14 14" aria-hidden="true">
          <path d="M3.5 3.5l7 7M10.5 3.5l-7 7" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      </button>
    </li>
  )
}
