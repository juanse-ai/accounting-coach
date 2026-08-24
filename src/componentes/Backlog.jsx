const ETIQUETA_ESTADO = {
  resuelto: 'Resuelto',
  errado: 'Intentado con errores',
  pendiente: 'Sin intentar',
}

function Marca({ estado }) {
  if (estado === 'resuelto') {
    return (
      <svg className="marca" viewBox="0 0 12 12" aria-hidden="true">
        <path d="M2 6.4 4.6 9 10 3.2" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )
  }
  if (estado === 'errado') {
    return (
      <svg className="marca" viewBox="0 0 12 12" aria-hidden="true">
        <path d="M6 2.6v4.2M6 9.3v.2" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    )
  }
  return <span className="marca marca--vacia" aria-hidden="true" />
}

export default function Backlog({ ejercicios, progreso, activo, onSeleccionar }) {
  return (
    <nav className="backlog" aria-label="Ejercicios">
      <p className="backlog__titulo">Ejercicios</p>
      <ol className="backlog__lista">
        {ejercicios.map((ej) => {
          const estado = progreso[ej.id] ?? 'pendiente'
          const esActivo = ej.id === activo
          return (
            <li key={ej.id}>
              <button
                type="button"
                className="backlog__item"
                data-estado={estado}
                aria-current={esActivo ? 'true' : undefined}
                onClick={() => onSeleccionar(ej.id)}
              >
                <span className="backlog__num">{ej.id}</span>
                <span className="backlog__meta">
                  <span className="backlog__nivel">{ej.nivel}</span>
                  <span className="visualmente-oculto">
                    {`. ${ETIQUETA_ESTADO[estado]}.`}
                  </span>
                </span>
                <Marca estado={estado} />
              </button>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
