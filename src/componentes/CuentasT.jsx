import { formatearMonto } from '../utils/formato.js'
import { DEBITO } from '../logica/verificar.js'

export default function CuentasT({ lineas, nota }) {
  return (
    <section className="cuentas-t" aria-label="Cuentas T del asiento">
      <h2 className="titulo-seccion">Cuentas T</h2>
      <div className="cuentas-t__grid">
        {lineas.map((l, i) => {
          const esDebito = l.lado === DEBITO
          return (
            <article key={`${l.cuenta}-${i}`} className="t">
              <header className="t__cabeza">
                <h3 className="t__nombre">{l.cuenta}</h3>
                <span className="t__padre etiqueta-dato">{l.padre}</span>
              </header>
              <div className="t__cuerpo">
                <div className="t__col t__col--debito">
                  <span className="t__rotulo">Débito</span>
                  <span className="t__valor cifra">{esDebito ? formatearMonto(l.monto) : ''}</span>
                </div>
                <div className="t__col t__col--credito">
                  <span className="t__rotulo">Crédito</span>
                  <span className="t__valor cifra">{!esDebito ? formatearMonto(l.monto) : ''}</span>
                </div>
              </div>
            </article>
          )
        })}
      </div>
      <aside className="nota">
        <span className="etiqueta-dato">Por qué</span>
        <p className="nota__texto">{nota}</p>
      </aside>
    </section>
  )
}
