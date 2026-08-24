import { formatearMonto } from '../utils/formato.js'

const FLECHA = { 'Débito': '←', 'Crédito': '→' }

/**
 * Los envíos, uno por tarjeta, con el asiento tal como lo escribió la persona.
 * Es la parte que responde "cómo respondió", no sólo si acertó.
 *
 * El lado se lee sin depender del color, igual que en el formulario: la flecha
 * apunta a la columna donde cae el monto. El azul y el ciruela contrastan poco
 * entre sí, así que nunca cargan solos el significado.
 */
export default function DetalleEnvios({ envios, mostrarNombre }) {
  if (envios.length === 0) {
    return <p className="tablero__vacio">Todavía no hay envíos que mostrar.</p>
  }

  return (
    <ol className="envios">
      {envios.map((e) => (
        <li key={e.id} className="envio" data-estado={e.estado}>
          <div className="envio__cabeza">
            <span className="envio__num cifra">{e.ejercicio}</span>
            {mostrarNombre && <span className="envio__nombre">{e.nombre}</span>}
            <span className="envio__intento">Intento {e.intento}</span>
            <span className="insignia" data-estado={e.estado}>
              {e.estado === 'correcto' ? 'Acertada' : 'Errónea'}
            </span>
          </div>

          <ul className="envio__lineas">
            {(e.lineas ?? []).map((l) => (
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
        </li>
      ))}
    </ol>
  )
}
