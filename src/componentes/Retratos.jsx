import { Foto } from './Diagramas.jsx'

/**
 * Las caras de una pregunta: una fila de retratos con pie opcional.
 *
 *   {retratos: [{src, alt, pie?}], credito?}
 *
 * Es del quiz y no de la presentación, aunque se parezca a la forma `marcas`.
 * Las formas de `Diagramas.jsx` pintan con la paleta cerrada de la baraja
 * —las custom properties `--dk-*` viven sobre `.aprende` y no existen fuera
 * del diálogo—, así que dibujarlas aquí las dejaría sin color. Lo único que
 * se reutiliza es `Foto`, que no tiene paleta: si el archivo no carga, pone
 * su texto alternativo en el hueco y la pregunta se sigue pudiendo responder.
 *
 * El `pie` de cada retrato es opcional a propósito: en una pregunta que pide
 * los nombres, rotular las caras sería regalar la respuesta.
 */
export default function Retratos({ retratos, credito }) {
  if (!retratos?.length) return null

  return (
    <figure className="retratos">
      <ul className="retratos__fila" role="list">
        {retratos.map((r, i) => (
          <li key={i} className="retratos__celda">
            <Foto key={r.src} src={r.src} alt={r.alt} clase="retrato" />
            {r.pie && <span className="retratos__pie">{r.pie}</span>}
          </li>
        ))}
      </ul>
      {credito && <figcaption className="retratos__credito">{credito}</figcaption>}
    </figure>
  )
}
