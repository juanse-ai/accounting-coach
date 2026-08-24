import { useEffect, useId, useMemo, useState } from 'react'
import {
  Bar, BarChart, CartesianGrid, LabelList,
  Legend, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts'
import { useResultados } from '../hooks/useResultados.js'
import { envios as listarEnvios, nombresParaMostrar, porEjercicio, porParticipante, resumen } from '../logica/tablero.js'
import DetalleEnvios from './DetalleEnvios.jsx'
import { supabase, hayBackend } from '../lib/supabase.js'

/* Los colores salen de los tokens en tiempo de ejecución, no copiados a mano:
   `fail-fast-tokens.css` sigue siendo la única fuente. Se leen una vez porque
   la app es dark-only y los tokens no cambian durante la sesión.

   Acierto es verde `--ff-success` y error rojo `--ff-danger`, que es lo que el
   sistema ya tenía asignado a esos dos significados.

   El par tiene un costo medido, no supuesto: bajo deuteranopía verde y rojo se
   separan apenas ΔE 5.9 (contra 26.4 en visión normal). O sea que el color, por
   sí solo, no comunica nada a quien no distingue rojo de verde — y es justo lo
   único que este gráfico tiene que decir. Por eso el color NUNCA va solo:

     · trama diagonal en la serie de errores, que se lee en blanco y negro
     · separación de 2px entre segmentos apilados
     · leyenda siempre visible y rótulo de texto en cada envío
     · vista de tabla con los mismos números

   Si alguna de esas cuatro se cae, el gráfico deja de ser legible para ~8% de
   los hombres. No son adornos. */
const leerTokens = () => {
  const cs = getComputedStyle(document.documentElement)
  const t = (n) => cs.getPropertyValue(n).trim()
  return {
    acierto: t('--ff-success') || '#4db08a',
    error: t('--ff-danger') || '#e76161',
    errorTrama: t('--ff-danger-fg') || '#ee9090',
    superficie: t('--ff-bg') || '#161618',
    rejilla: t('--ff-border') || '#2a2a2e',
    tinta: t('--ff-fg-subtle') || '#8a8a8a',
    tintaFuerte: t('--ff-fg-strong') || '#ffffff',
    neutro: t('--ff-fg-faint') || '#525252',
  }
}

function Tarjeta({ etiqueta, valor, sufijo }) {
  return (
    <div className="ficha">
      <span className="etiqueta-dato">{etiqueta}</span>
      <p className="ficha__valor cifra">
        {valor}
        {sufijo && <span className="ficha__sufijo">{sufijo}</span>}
      </p>
    </div>
  )
}

function Globo({ active, payload, label, ejercicios }) {
  if (!active || !payload?.length) return null
  const hecho = ejercicios?.find((e) => e.id === label)?.hecho
  return (
    <div className="globo">
      <p className="globo__titulo">Ejercicio {label}</p>
      {hecho && <p className="globo__hecho">{hecho}</p>}
      {payload.map((p) => (
        <p key={p.dataKey} className="globo__fila">
          <span className="globo__punto" data-serie={p.dataKey} aria-hidden="true" />
          {p.name}: <span className="cifra">{p.value}</span>
        </p>
      ))}
    </div>
  )
}

export default function Resultados({ participante }) {
  const { datos, cargando, error, envivo } = useResultados()
  const [filtro, setFiltro] = useState('')
  const [verTabla, setVerTabla] = useState(false)
  const [yo, setYo] = useState('')
  const idFiltro = useId()
  const color = useMemo(() => leerTokens(), [])

  // Traduce el id privado de la sesión a su id público, que es lo único que el
  // tablero conoce. Sólo sirve para preseleccionar "mis resultados".
  useEffect(() => {
    let vivo = true
    if (!hayBackend || !participante?.id) return undefined
    supabase
      .rpc('id_publico_propio', { p_participante_id: participante.id })
      .then(({ data }) => {
        if (!vivo || !data) return
        setYo(data)
        setFiltro((actual) => actual || data)
      })
      .catch(() => {})
    return () => {
      vivo = false
    }
  }, [participante?.id])

  const nombres = useMemo(() => nombresParaMostrar(datos.participantes), [datos.participantes])
  const activo = filtro || null
  const cifras = useMemo(() => resumen(datos, activo), [datos, activo])
  const ejercicios = useMemo(() => porEjercicio(datos, activo), [datos, activo])
  const gente = useMemo(
    () => porParticipante(datos).map((p) => (p.id === yo ? { ...p, nombre: `${p.nombre} (tú)` } : p)),
    [datos, yo]
  )
  const envios = useMemo(() => listarEnvios(datos, activo), [datos, activo])

  const alturaGente = Math.max(160, gente.length * 30 + 40)

  return (
    <section className="tablero" aria-labelledby="tablero-titulo">
      <header className="tablero__cabeza">
        <div>
          <span className="etiqueta-dato">Resultados públicos</span>
          <h2 className="titulo-seccion" id="tablero-titulo">
            Cómo va la práctica
          </h2>
        </div>
        <p className="tablero__vivo" data-vivo={envivo} role="status">
          <span className="tablero__punto" aria-hidden="true" />
          {envivo ? 'En vivo' : 'Reconectando…'}
        </p>
      </header>

      <div className="tablero__controles">
        <div className="tablero__filtro">
          <label className="etiqueta-campo" htmlFor={idFiltro}>
            Filtrar por participante
          </label>
          <select
            id={idFiltro}
            className="entrada"
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
          >
            <option value="">Todos ({datos.participantes.length})</option>
            {datos.participantes.map((p) => (
              <option key={p.id} value={p.id}>
                {nombres.get(p.id)}
                {p.id === yo ? ' (tú)' : ''}
              </option>
            ))}
          </select>
        </div>
        <button
          type="button"
          className="boton boton--mini"
          onClick={() => setVerTabla((v) => !v)}
          aria-pressed={verTabla}
        >
          {verTabla ? 'Ver gráficos' : 'Ver como tabla'}
        </button>
      </div>

      {error && <p className="tablero__error" role="alert">{error}</p>}
      {cargando && <p className="tablero__vacio">Cargando el tablero…</p>}

      {!cargando && (
        <>
          <div className="tablero__fichas">
            {activo ? (
              <>
                <Tarjeta etiqueta="Resueltos" valor={cifras.resueltos} sufijo={` / ${ejercicios.length}`} />
                <Tarjeta etiqueta="Envíos" valor={cifras.envios} />
                <Tarjeta etiqueta="Acertados" valor={cifras.aciertos} />
                <Tarjeta etiqueta="Puntería" valor={cifras.precision} sufijo="%" />
              </>
            ) : (
              <>
                <Tarjeta etiqueta="Participantes" valor={cifras.participantes} />
                <Tarjeta etiqueta="Envíos" valor={cifras.envios} />
                <Tarjeta etiqueta="Acertados" valor={cifras.aciertos} />
                <Tarjeta etiqueta="Puntería" valor={cifras.precision} sufijo="%" />
              </>
            )}
          </div>

          {/* Franja de estado: 18 estados binarios no son un gráfico, son una
              lista. Con filtro es la respuesta directa a "cuáles acertó y
              cuáles no"; sin filtro no se dibuja porque mezclaría a todos. */}
          {activo && (
            <div className="tablero__bloque">
              <h3 className="tablero__subtitulo">Cada pregunta, una por una</h3>
              <ol className="franja">
                {ejercicios.map((e) => (
                  <li key={e.id} className="franja__celda" data-estado={e.estado}>
                    <span className="franja__num cifra">{e.id}</span>
                    <span className="franja__envios cifra">{e.envios || '·'}</span>
                    <span className="visualmente-oculto">
                      {e.estado === 'resuelto'
                        ? `Ejercicio ${e.id}: acertada en ${e.envios} ${e.envios === 1 ? 'envío' : 'envíos'}.`
                        : e.estado === 'errado'
                          ? `Ejercicio ${e.id}: errónea, ${e.envios} ${e.envios === 1 ? 'envío' : 'envíos'}.`
                          : `Ejercicio ${e.id}: sin intentar.`}
                    </span>
                  </li>
                ))}
              </ol>
              <p className="tablero__pie">
                Verde: acertada. Rojo rayado: enviada con errores. Vacío: sin intentar.
              </p>
            </div>
          )}

          {verTabla ? (
            <div className="tablero__bloque">
              <h3 className="tablero__subtitulo">Los mismos datos, en tabla</h3>
              <div className="tabla-envoltura">
                <table className="tabla">
                  <caption className="visualmente-oculto">
                    Envíos acertados y erróneos por ejercicio
                  </caption>
                  <thead>
                    <tr>
                      <th scope="col">Ej.</th>
                      <th scope="col">Nivel</th>
                      <th scope="col">Acertados</th>
                      <th scope="col">Erróneos</th>
                      <th scope="col">Envíos</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ejercicios.map((e) => (
                      <tr key={e.id}>
                        <th scope="row" className="cifra">{e.id}</th>
                        <td>{e.nivel}</td>
                        <td className="cifra">{e.aciertos}</td>
                        <td className="cifra">{e.errores}</td>
                        <td className="cifra">{e.envios}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <>
              <div className="tablero__bloque">
                <h3 className="tablero__subtitulo">
                  {activo ? 'Envíos por ejercicio' : 'Dónde se traba la gente'}
                </h3>
                <div className="grafico" style={{ height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={ejercicios} margin={{ top: 12, right: 8, bottom: 4, left: 0 }}>
                      <defs>
                        {/* La trama es la señal no cromática del error: quien no
                            distingue verde de ámbar la lee por el rayado. */}
                        <pattern
                          id="trama-error"
                          width="6"
                          height="6"
                          patternTransform="rotate(45)"
                          patternUnits="userSpaceOnUse"
                        >
                          <rect width="6" height="6" fill={color.error} />
                          <line x1="0" y1="0" x2="0" y2="6" stroke={color.errorTrama} strokeWidth="2.5" />
                        </pattern>
                      </defs>
                      <CartesianGrid stroke={color.rejilla} strokeDasharray="2 4" vertical={false} />
                      <XAxis
                        dataKey="id"
                        tick={{ fill: color.tinta, fontSize: 12 }}
                        stroke={color.rejilla}
                        tickLine={false}
                      />
                      <YAxis
                        allowDecimals={false}
                        tick={{ fill: color.tinta, fontSize: 12 }}
                        stroke={color.rejilla}
                        tickLine={false}
                        width={32}
                      />
                      <Tooltip
                        cursor={{ fill: 'rgba(255,255,255,0.04)' }}
                        content={<Globo ejercicios={ejercicios} />}
                      />
                      <Legend
                        wrapperStyle={{ fontSize: 12, color: color.tinta, paddingTop: 8 }}
                        iconType="square"
                      />
                      {/* stroke del color de la superficie = el separador de 2px
                          que el sistema pide entre segmentos apilados. */}
                      <Bar
                        dataKey="aciertos"
                        name="Acertados"
                        stackId="e"
                        fill={color.acierto}
                        stroke={color.superficie}
                        strokeWidth={2}
                        isAnimationActive={false}
                      />
                      <Bar
                        dataKey="errores"
                        name="Erróneos"
                        stackId="e"
                        fill="url(#trama-error)"
                        stroke={color.superficie}
                        strokeWidth={2}
                        radius={[4, 4, 0, 0]}
                        isAnimationActive={false}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <p className="tablero__pie">
                  Cada barra es un ejercicio. Lo alto es cuánto se ha enviado; lo rayado,
                  cuánto se envió mal.
                </p>
              </div>

              {!activo && gente.length > 0 && (
                <div className="tablero__bloque">
                  <h3 className="tablero__subtitulo">Avance por participante</h3>
                  <div className="grafico" style={{ height: alturaGente }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={gente}
                        layout="vertical"
                        margin={{ top: 4, right: 32, bottom: 4, left: 8 }}
                      >
                        <CartesianGrid stroke={color.rejilla} strokeDasharray="2 4" horizontal={false} />
                        <XAxis
                          type="number"
                          domain={[0, ejercicios.length]}
                          allowDecimals={false}
                          tick={{ fill: color.tinta, fontSize: 12 }}
                          stroke={color.rejilla}
                          tickLine={false}
                        />
                        <YAxis
                          type="category"
                          dataKey="nombre"
                          tick={{ fill: color.tinta, fontSize: 12 }}
                          stroke={color.rejilla}
                          tickLine={false}
                          width={116}
                        />
                        <Tooltip
                          cursor={{ fill: 'rgba(255,255,255,0.04)' }}
                          contentStyle={{
                            background: color.superficie,
                            border: `1px solid ${color.rejilla}`,
                            borderRadius: 10,
                            fontSize: 12,
                          }}
                          formatter={(v) => [`${v} de ${ejercicios.length}`, 'Resueltos']}
                        />
                        {/* Una sola serie: sin leyenda, con rótulo directo. El
                            color marca a la persona, no su puesto. */}
                        <Bar
                          dataKey="resueltos"
                          fill={color.acierto}
                          radius={[0, 4, 4, 0]}
                          barSize={16}
                          isAnimationActive={false}
                        >
                          <LabelList
                            dataKey="resueltos"
                            position="right"
                            fill={color.tintaFuerte}
                            fontSize={12}
                          />
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <p className="tablero__pie">
                    Ejercicios distintos resueltos, sobre {ejercicios.length}.
                  </p>
                </div>
              )}
            </>
          )}

          <div className="tablero__bloque">
            <h3 className="tablero__subtitulo">
              {activo ? 'Cada envío, con su asiento' : 'Lo último que se envió'}
            </h3>
            <DetalleEnvios envios={activo ? envios : envios.slice(0, 20)} mostrarNombre={!activo} />
          </div>
        </>
      )}
    </section>
  )
}
