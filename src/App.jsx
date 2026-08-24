import { useCallback, useMemo, useRef, useState } from 'react'
import Backlog from './componentes/Backlog.jsx'
import Balanza from './componentes/Balanza.jsx'
import LineaAsiento from './componentes/LineaAsiento.jsx'
import Retroalimentacion from './componentes/Retroalimentacion.jsx'
import CuentasT from './componentes/CuentasT.jsx'
import LogoFailFast from './componentes/LogoFailFast.jsx'
import { EJERCICIOS } from './data/ejercicios.js'
import { totales, verificarAsiento } from './logica/verificar.js'
import { useProgreso } from './hooks/useProgreso.js'

let contador = 0
const nuevaLinea = () => ({
  id: `l${++contador}`,
  cuenta: '',
  padre: '',
  lado: '',
  monto: 0,
  montoTexto: '',
})

const borradorInicial = () => [nuevaLinea(), nuevaLinea()]

export default function App() {
  const { progreso, marcar, reiniciar } = useProgreso()
  const [activo, setActivo] = useState(EJERCICIOS[0].id)
  const [borradores, setBorradores] = useState(() => ({ [EJERCICIOS[0].id]: borradorInicial() }))
  const [resultados, setResultados] = useState({})
  const [confirmandoReinicio, setConfirmandoReinicio] = useState(false)
  const panelRef = useRef(null)

  const ejercicio = useMemo(() => EJERCICIOS.find((e) => e.id === activo), [activo])
  const lineas = borradores[activo] ?? borradorInicial()
  const resultado = resultados[activo] ?? null
  const resuelto = resultado?.estado === 'correcto'

  const { debitos, creditos } = totales(lineas)
  const totalResueltos = EJERCICIOS.filter((e) => progreso[e.id] === 'resuelto').length

  // Actualización funcional: dos cambios en el mismo tick (teclear rápido,
  // elegir cuenta y lado casi a la vez) no pueden pisarse entre sí.
  const actualizarLineas = useCallback((id, transformar) => {
    setBorradores((prev) => ({ ...prev, [id]: transformar(prev[id] ?? borradorInicial()) }))
  }, [])

  const olvidarResultado = useCallback((id) => {
    // La retroalimentación anterior deja de valer en cuanto se edita el asiento.
    setResultados((prev) => (prev[id] ? { ...prev, [id]: null } : prev))
  }, [])

  const seleccionar = useCallback(
    (id) => {
      setActivo(id)
      setBorradores((prev) => (prev[id] ? prev : { ...prev, [id]: borradorInicial() }))
      setConfirmandoReinicio(false)
      panelRef.current?.focus({ preventScroll: true })
      panelRef.current?.scrollIntoView({ block: 'start', behavior: 'auto' })
    },
    []
  )

  const cambiarLinea = (idLinea, parche) => {
    if (resuelto) return
    actualizarLineas(activo, (actuales) =>
      actuales.map((l) => (l.id === idLinea ? { ...l, ...parche } : l))
    )
    olvidarResultado(activo)
  }

  const quitarLinea = (idLinea) => {
    if (resuelto) return
    actualizarLineas(activo, (actuales) =>
      actuales.length <= 2 ? actuales : actuales.filter((l) => l.id !== idLinea)
    )
    olvidarResultado(activo)
  }

  const agregarLinea = () => {
    if (resuelto) return
    actualizarLineas(activo, (actuales) => [...actuales, nuevaLinea()])
  }

  const verificar = (evento) => {
    evento.preventDefault()
    const salida = verificarAsiento(lineas, ejercicio.lineas)
    setResultados((prev) => ({ ...prev, [activo]: salida }))
    if (salida.estado === 'correcto') marcar(activo, 'resuelto')
    else if (salida.estado === 'incorrecto') marcar(activo, 'errado')
  }

  const limpiar = () => {
    actualizarLineas(activo, borradorInicial)
    setResultados((prev) => ({ ...prev, [activo]: null }))
  }

  const indice = EJERCICIOS.findIndex((e) => e.id === activo)
  const anterior = EJERCICIOS[indice - 1]
  const siguiente = EJERCICIOS[indice + 1]

  return (
    <div className="app">
      {/* Con 18 ejercicios en el backlog, el teclado necesita un atajo al formulario. */}
      <a className="salto" href="#asiento">
        Saltar al asiento
      </a>

      <header className="cabecera">
        <div className="cabecera__marca">
          <LogoFailFast alto={18} />
          <span className="cabecera__divisor" aria-hidden="true" />
          <h1 className="cabecera__titulo">Partida doble</h1>
        </div>

        <div className="cabecera__progreso">
          <span className="etiqueta-dato">Resueltos</span>
          <p className="cabecera__contador cifra">
            {String(totalResueltos).padStart(2, '0')}
            <span className="cabecera__total"> / {EJERCICIOS.length}</span>
          </p>
          <div
            className="cabecera__barra"
            role="progressbar"
            aria-valuenow={totalResueltos}
            aria-valuemin={0}
            aria-valuemax={EJERCICIOS.length}
            aria-label="Ejercicios resueltos"
          >
            <span style={{ width: `${(totalResueltos / EJERCICIOS.length) * 100}%` }} />
          </div>
          <button
            type="button"
            className="boton boton--mini"
            onClick={() => {
              if (confirmandoReinicio) {
                reiniciar()
                setResultados({})
                setBorradores({ [activo]: borradorInicial() })
                setConfirmandoReinicio(false)
              } else {
                setConfirmandoReinicio(true)
              }
            }}
            onBlur={() => setConfirmandoReinicio(false)}
          >
            {confirmandoReinicio ? '¿Seguro? Borra todo' : 'Reiniciar progreso'}
          </button>
        </div>
      </header>

      <div className="cuerpo">
        <Backlog
          ejercicios={EJERCICIOS}
          progreso={progreso}
          activo={activo}
          onSeleccionar={seleccionar}
        />

        <main className="panel" ref={panelRef} tabIndex={-1} aria-labelledby="hecho-titulo">
          <section className="hecho">
            <div className="hecho__cabeza">
              <span className="hecho__num cifra">{ejercicio.id}</span>
              <span className="insignia" data-nivel={ejercicio.nivel}>
                {ejercicio.nivel}
              </span>
              {progreso[ejercicio.id] === 'resuelto' && (
                <span className="insignia insignia--ok">Resuelto</span>
              )}
            </div>
            <h2 className="hecho__texto" id="hecho-titulo">
              {ejercicio.hecho}
            </h2>
            {ejercicio.aviso && <p className="hecho__aviso">({ejercicio.aviso})</p>}
          </section>

          <form className="asiento" id="asiento" onSubmit={verificar} noValidate>
            <div className="asiento__cabecera" aria-hidden="true">
              <span className="asiento__col asiento__col--indice">Nº</span>
              <span className="asiento__col">Cuenta</span>
              <span className="asiento__col">Cuenta padre</span>
              <span className="asiento__col">Lado</span>
              <span className="asiento__col asiento__col--debito">Débito</span>
              <span className="asiento__col asiento__col--credito">Crédito</span>
              <span className="asiento__col asiento__col--quitar" />
            </div>

            <ul className="asiento__lineas">
              {lineas.map((linea, i) => (
                <LineaAsiento
                  key={linea.id}
                  linea={linea}
                  indice={i}
                  puedeQuitar={lineas.length > 2}
                  bloqueada={resuelto}
                  onCambiar={cambiarLinea}
                  onQuitar={quitarLinea}
                />
              ))}
            </ul>

            <div className="asiento__acciones-linea">
              <button type="button" className="boton" onClick={agregarLinea} disabled={resuelto}>
                + Agregar línea
              </button>
            </div>

            <Balanza debitos={debitos} creditos={creditos} />

            <div className="asiento__acciones">
              <button type="submit" className="ff-cta" disabled={resuelto}>
                Verificar asiento
                <svg
                  className="ff-cta-arrow"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
              <button type="button" className="boton" onClick={limpiar}>
                {resuelto ? 'Volver a intentarlo' : 'Limpiar'}
              </button>
            </div>
          </form>

          <Retroalimentacion resultado={resultado} ejercicio={ejercicio} lineas={lineas} />

          {resuelto && <CuentasT lineas={ejercicio.lineas} nota={ejercicio.nota} />}

          <nav className="navegacion" aria-label="Navegación entre ejercicios">
            <button
              type="button"
              className="boton"
              disabled={!anterior}
              onClick={() => anterior && seleccionar(anterior.id)}
            >
              ← Anterior
            </button>
            <button
              type="button"
              className="boton"
              disabled={!siguiente}
              onClick={() => siguiente && seleccionar(siguiente.id)}
            >
              Siguiente →
            </button>
          </nav>
        </main>
      </div>
    </div>
  )
}
