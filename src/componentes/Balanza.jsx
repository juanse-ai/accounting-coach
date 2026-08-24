import { formatearMonto } from '../utils/formato.js'

export default function Balanza({ debitos, creditos }) {
  const mayor = Math.max(debitos, creditos)
  const anchoDebito = mayor > 0 ? (debitos / mayor) * 100 : 0
  const anchoCredito = mayor > 0 ? (creditos / mayor) * 100 : 0
  const diferencia = Math.abs(debitos - creditos)
  const cuadra = diferencia === 0 && mayor > 0
  const sobra = debitos > creditos ? 'Débito' : 'Crédito'

  return (
    <section className="balanza" data-cuadra={cuadra} aria-label="Balanza del asiento">
      <div className="balanza__cifras">
        <div className="balanza__cifra balanza__cifra--debito">
          <span className="etiqueta-dato">Suma Débito</span>
          <span className="cifra">{formatearMonto(debitos)}</span>
        </div>
        <div className="balanza__cifra balanza__cifra--credito">
          <span className="etiqueta-dato">Suma Crédito</span>
          <span className="cifra">{formatearMonto(creditos)}</span>
        </div>
      </div>

      <div className="balanza__barra" aria-hidden="true">
        <div className="balanza__mitad balanza__mitad--izq">
          <span className="balanza__relleno balanza__relleno--debito" style={{ width: `${anchoDebito}%` }} />
        </div>
        <span className="balanza__fiel" />
        <div className="balanza__mitad balanza__mitad--der">
          <span className="balanza__relleno balanza__relleno--credito" style={{ width: `${anchoCredito}%` }} />
        </div>
      </div>

      <p className="balanza__estado" role="status">
        {cuadra ? (
          <>
            <span className="balanza__punto" aria-hidden="true" />
            El asiento cuadra
          </>
        ) : mayor === 0 ? (
          'Sin montos registrados'
        ) : (
          <>
            Descuadre de <span className="cifra">{formatearMonto(diferencia)}</span> — sobra del lado {sobra}
          </>
        )}
      </p>
      <p className="balanza__nota">
        La balanza solo revisa aritmética. Un asiento puede cuadrar y aun así usar las cuentas equivocadas.
      </p>
    </section>
  )
}
