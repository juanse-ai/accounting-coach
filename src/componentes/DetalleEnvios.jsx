import { MOTORES } from '../motores/index.js'

/**
 * Los envíos, uno por tarjeta, con la respuesta tal como la dio la persona.
 * Es la parte que responde "cómo respondió", no sólo si acertó.
 *
 * Cómo se ve una respuesta lo decide su motor: aquí solo se elige cuál.
 */
export default function DetalleEnvios({ envios, mostrarNombre }) {
  if (envios.length === 0) {
    return <p className="tablero__vacio">Todavía no hay envíos que mostrar.</p>
  }

  return (
    <ol className="envios">
      {envios.map((e) => {
        const Envio = MOTORES[e.tipo]?.Envio
        return (
          <li key={e.id} className="envio" data-estado={e.estado}>
            <div className="envio__cabeza">
              <span className="envio__num cifra">{e.codigo}</span>
              {mostrarNombre && <span className="envio__nombre">{e.nombre}</span>}
              <span className="envio__intento">Intento {e.intento}</span>
              <span className="insignia" data-estado={e.estado}>
                {e.estado === 'correcto' ? 'Acertada' : 'Errónea'}
              </span>
            </div>
            {Envio && <Envio datos={e.datos} />}
          </li>
        )
      })}
    </ol>
  )
}
