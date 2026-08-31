import { useId } from 'react'

/**
 * Con qué clase se está trabajando. Cambiarla recarga la presentación y el
 * quiz desde la base — no hay nada de la clase anterior en el bundle que
 * pueda quedarse pegado.
 *
 * Con una sola clase publicada el selector sobra y no se dibuja: sería un
 * control con una sola opción.
 */
export default function SelectorClase({ clases, valor, onCambiar, compacto }) {
  const id = useId()
  if (clases.length < 2) return null

  return (
    <div className="selector-clase" data-compacto={Boolean(compacto)}>
      <label className={compacto ? 'visualmente-oculto' : 'etiqueta-campo'} htmlFor={id}>
        Clase
      </label>
      <select
        id={id}
        className="entrada"
        value={valor}
        onChange={(e) => onCambiar(e.target.value)}
      >
        {clases.map((c) => (
          <option key={c.slug} value={c.slug}>
            {c.nombre}
          </option>
        ))}
      </select>
    </div>
  )
}
