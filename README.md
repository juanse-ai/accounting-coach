# Partida doble · práctica de asientos y cuentas T

Aplicación de una sola página para practicar partida doble: se lee un hecho
económico, se arma el asiento línea por línea y se verifica contra la respuesta
esperada. Herramienta de aprendizaje personal, en español.

## Correr

```bash
cp .env.example .env   # y llenar las dos variables
npm install
npm run dev      # servidor de desarrollo
npm run build    # build de producción en dist/
npm run preview  # servir el build
```

`VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY` (la clave *publishable*) son las
únicas variables que la app usa, y las dos terminan dentro del bundle: Vite
inyecta todo lo que empieza por `VITE_`. Eso es correcto para la publishable y
sería un desastre para la clave de servicio, que nunca debe llevar ese prefijo.
Sin esas variables la app arranca igual, avisa por consola y no guarda nada.

## Cómo está organizado

```
src/
  data/planCuentas.js         Plan de cuentas: nombre, cuenta padre y por qué pertenece ahí.
  data/ejercicios.js          Los 18 ejercicios: hecho, líneas esperadas y nota explicativa.
  logica/verificar.js         Comparación sin importar el orden + totales de la balanza.
  hooks/useProgreso.js        Persistencia en localStorage, tolerante a fallos.
  hooks/useParticipante.js    Identidad de la sesión: alta en el landing y localStorage.
  logica/registro.js          Validación de nombre y correo, espejo de la del servidor.
  lib/supabase.js             Cliente, solo con la clave publishable.
  lib/respuestas.js           Envío de cada respuesta + cola de reintento.
  componentes/Landing.jsx     La puerta: nombre y correo antes de los ejercicios.
  componentes/Resultados.jsx  Tablero público con Recharts. Se carga aparte (lazy).
  componentes/DetalleEnvios   Cada envío con el asiento tal como se escribió.
  hooks/useResultados.js      Carga + eventos en vivo + reconciliación periódica.
  lib/resultados.js           Lectura pública y suscripción al canal Broadcast.
  logica/tablero.js           Derivaciones puras del tablero (resumen, por ejercicio…).
  componentes/                Backlog, LineaAsiento, Balanza, Retroalimentacion, CuentasT.
  componentes/LogoFailFast    Lockup de marca, recoloreado para fondo negro.
  estilos/fail-fast-tokens.css Tokens del design system de Fail Fast (dark only).
  estilos.css                 Estilos de la app, construidos sobre esos tokens.
```

## Design system

La interfaz usa el **design system de Fail Fast**: negro puro de página, superficies
que suben por escalones (`#141416` → `#161618` → `#1c1c1f`), hairlines de `#2a2a2e`
en vez de sombras, Inter empaquetada con `@fontsource` (no CDN), serif del sistema
para el display editorial, cabecera píldora flotante con vidrio esmerilado, radios
de 6 px en inputs / 10 px en botones / 12–16 px en tarjetas, y motion en
`cubic-bezier(0.22, 1, 0.36, 1)` a 220 ms.

`src/estilos/fail-fast-tokens.css` es un recorte literal de `colors_and_type.css`
del sistema: solo los tokens que esta app usa, sin valores alterados. Si el sistema
cambia, ese es el único archivo a resincronizar.

**Dos extensiones deliberadas**, ambas documentadas en la cabecera de `estilos.css`:

1. **Débito y Crédito toman la escala semántica, no el primario.** Débito usa la
   familia `--ff-info` (azul) y Crédito la familia `--ff-accent-plum` (ciruela);
   acierto y error usan `--ff-success` y `--ff-danger`. Así `--ff-primary` conserva
   su único trabajo según el sistema: la CTA "Verificar asiento". La escala semántica
   existe justamente para color que carga significado, que es lo que el par
   débito/crédito hace en toda la app. El ámbar (`--ff-warn`) queda reservado para lo
   que no es un lado: nivel Intermedio, ejercicio intentado con errores y el aviso de
   asiento incompleto.

   El sistema define `--ff-accent-plum`, `-bg` y `-border` pero no el hermano claro
   para texto que sí tienen las otras familias. Se deriva en
   `fail-fast-tokens.css` como `--ff-accent-plum-fg: #c49ad2`, con el mismo salto de
   luminosidad que usan warn e info. Si el sistema publica el suyo, se borra esa línea.

   **Nota de contraste:** el azul y el ciruela contrastan bien contra el fondo (7.0–8.8)
   pero muy poco entre sí (1.15), porque casi no difieren en luminosidad. Por eso el
   lado nunca depende solo del color: las píldoras llevan una flecha direccional, la
   columna del monto está rotulada, y en la cuenta T la posición izquierda/derecha es
   la que manda. Si quieres más separación, subir `--ff-accent-plum-fg` a un ciruela
   más oscuro es un cambio de una línea.

2. **Las columnas de cifras usan `--ff-font-mono`.** El sistema reserva la mono para
   tokens y código; aquí se extiende a montos, sumas y numeración porque en un libro
   contable la alineación de columnas es información, no estilo. La alternativa
   estricta sería `.ff-num` (Inter con `tabular-nums`), que alinea igual — es un
   cambio de una línea si prefieres adherencia total.

Dos cosas del brief original quedaron sobrescritas por el sistema: el fondo dejó de
ser tinta azulada y pasó a negro puro (el sistema es dark-only sobre `#000000`), y
la mono dejó de ser JetBrains Mono para ser la pila `ui-monospace` del sistema.
Tampoco se usa el gradiente de marca: el sistema permite uno por página y solo en un
titular hero, y esta herramienta no tiene hero — el acento ya vive en el logo y la CTA.

El logo viene de `failfast-logo-black.svg`. Sobre negro, sus dos colores se resuelven
como el sistema indica: el lockup `#222222` pasa a `currentColor` (blanco) y el
acento `#4867FF` sube al primario de modo oscuro `#5c78ff`.

## Captura de respuestas

Nadie llega a los ejercicios sin dejar nombre y correo: el landing es una puerta,
no un banner que se pueda cerrar. Y cada asiento se guarda **en el momento de
enviarlo**, no al terminar los 18 — quien abandona en el ejercicio 4 deja
registrados sus cuatro intentos, que es justamente el dato que dice dónde se
traba la práctica.

### El modelo

```
participantes  1 ── N  respuestas  N ── 1  ejercicios
                        │
                        └── 1 ── N  respuesta_lineas
```

| Tabla | Una fila es… |
| --- | --- |
| `participantes` | Una persona. Identidad única por correo, normalizado a minúsculas. |
| `ejercicios` | Uno de los 18. Espejo de `src/data/ejercicios.js`. |
| `respuestas` | **Un envío**: quién, qué ejercicio, qué número de intento y si acertó. |
| `respuesta_lineas` | Una línea del asiento tal como la escribió la persona. |

**Las líneas son filas, no un blob JSON.** Un asiento contable ya es una
relación: cada línea tiene cuenta, cuenta padre, lado y monto. Guardarlo como
JSON obligaría a desarmarlo en cada consulta; así, «qué cuenta se confunde más»
o «en qué lado se equivoca la gente» son un `group by`.

**Cada intento se guarda entero, no se pisa.** Reintentar es parte del ejercicio,
y la secuencia de intentos —qué cambió entre el primero y el segundo— dice más
que el resultado final. Por eso `respuestas` lleva un contador `intento` único
por persona y ejercicio, y no un `upsert`.

**No se guardan los asientos incompletos.** Si faltan campos, `verificarAsiento`
devuelve `incompleto` y no hubo respuesta que registrar: solo se envían los
`correcto` e `incorrecto`.

### Por qué el cliente no toca las tablas

La app es una SPA sin login. Con la clave publishable no hay usuario autenticado
y por lo tanto no hay forma honesta de escribir una política de RLS por fila. La
salida es la contraria: **RLS activo y sin políticas en las cuatro tablas** —todo
acceso directo desde `anon` queda denegado, incluida la lectura de correos— y las
escrituras pasan por dos funciones `SECURITY DEFINER` con `search_path` fijo:

- `registrar_participante(nombre, email)` → devuelve el `uuid`. Idempotente por
  correo: volver a entrar con el mismo continúa el mismo historial.
- `registrar_respuesta(participante_id, ejercicio_id, es_correcta, lineas)` →
  escribe la cabecera y sus líneas en una sola transacción.

Las dos validan y normalizan lo que reciben, y ninguna devuelve datos de
terceros. El linter de Supabase marca ambas como «ejecutables por anon»: es
intencional, es exactamente el flujo. Para leer los datos está la vista
`vista_respuestas` (`security_invoker`, así que hereda ese mismo RLS y solo la
ven los roles que ya pueden leer las tablas).

**El límite conocido:** quien sepa un correo puede pedir su `uuid` y escribir
respuestas a nombre de esa persona. Para una herramienta de práctica el costo de
un login real no se justifica; si algún día estos datos tienen que ser confiables,
la respuesta es Supabase Auth y políticas contra `auth.uid()`, no parchar esto.

### Si falla la red

`lib/respuestas.js` manda cada envío al instante y, si falla, lo deja en una cola
en localStorage que se reintenta con el siguiente envío y al abrir la app. Los
rechazos del servidor por datos inválidos se descartan en vez de reintentarse
para siempre. Verificar el asiento nunca depende de que el guardado funcione:
misma regla que el progreso en localStorage.

Las migraciones están aplicadas en el proyecto de Supabase
(`crear_modelo_participantes_respuestas`, `crear_rpc_registro_y_respuestas`,
`sembrar_catalogo_ejercicios`, `crear_vista_respuestas_detalle`).

## Tablero de resultados

Segunda vista de la app, en la pestaña **Resultados** de la cabecera. Se filtra
por participante y muestra, en vivo, qué preguntas acertó cada quien y cuáles no.

**Es público de verdad:** se abre desde el landing sin registrarse. Practicar sí
exige dejar nombre y correo; mirar, no.

**El correo nunca sale del servidor.** La carga pública trae `id_publico`,
`nombre`, ejercicio, intento, estado y las líneas del asiento — y nada más. No
hay una consulta que lo devuelva, porque `resultados_publicos()` no lo
construye. Si dos personas se llaman igual, se distinguen con un sufijo corto
del id público, no con el correo.

### Publicar obligó a partir la identidad en dos

Hasta ahora `participantes.id` era a la vez identidad y credencial: quien lo
tuviera podía escribir respuestas a nombre de esa persona. Mientras nada era
público daba igual, porque sólo lo conocía su dueño. Al publicar el tablero ese
id habría viajado a todos los navegadores, y cualquiera podría haber firmado
asientos con el nombre de otro.

Por eso ahora hay dos:

| Columna | Quién lo ve | Para qué sirve |
| --- | --- | --- |
| `id` | sólo su dueño | escribir respuestas |
| `id_publico` | todo el mundo | agrupar y filtrar en el tablero |

`id_publico_propio(id)` traduce en un solo sentido, privado → público, y sólo
puede llamarlo quien ya tiene el privado. Al revés no hay función: eso es lo que
impide convertir un id del tablero en credencial.

### En vivo sin abrir las tablas

Las cuatro tablas siguen con RLS activo y sin políticas. En vez de suscribir el
navegador a cambios de tabla —que habría obligado a dar `SELECT` sobre datos que
incluyen el id privado— `registrar_respuesta` y `registrar_participante` emiten
por **Broadcast** una carga armada a mano, con los mismos campos que devuelve la
lectura pública. El cliente la agrega a lo que ya tiene.

Emitir nunca puede tumbar una escritura: las dos llamadas a `realtime.send` van
dentro de un `exception when others then null`. Si Realtime está caído, la
respuesta igual queda guardada.

**El flujo de eventos no es confiable por sí solo.** Entre que `subscribe()`
responde `SUBSCRIBED` y el servidor engancha el tópico hay unos cientos de
milisegundos en los que un evento se pierde — medido, no supuesto. Por eso
`useResultados` recarga todo cada 60 s y al volver a la pestaña: los eventos
hacen que se sienta inmediato, la recarga garantiza que esté completo. La
recarga compara una firma barata antes de reemplazar el estado, para no
redibujar los gráficos cada minuto sin motivo.

### La paleta se calculó, no se eligió a ojo

Acierto en verde `--ff-success`, error en rojo `--ff-danger`. El par tiene un
costo medido: bajo deuteranopía los dos se separan apenas **ΔE 5.9** (contra
26.4 en visión normal), así que el color por sí solo no le dice nada a quien no
distingue rojo de verde — que es justo lo único que el gráfico tiene que decir.

El color nunca va solo. Cuatro señales cargan el mismo significado:

1. **Trama diagonal** en la serie de errores, legible en blanco y negro.
2. **Separador de 2 px** del color de la superficie entre segmentos apilados.
3. **Leyenda siempre visible** y rótulo de texto ("Acertada" / "Errónea") en cada envío.
4. **Vista de tabla** con los mismos números, a un clic.

Si alguna de las cuatro se cae, el gráfico deja de ser legible para cerca del 8 %
de los hombres. No son adornos.

El ámbar quedó para lo que **no** es un error: el punto de "reconectando" del
indicador en vivo, y el `errado` del backlog, que significa "intentado, aún sin
resolver" y no "respuesta equivocada".

### Peso

Recharts arrastra Redux, immer y d3: pesa más que toda la app junta. Se carga con
`React.lazy`, así que sale en su propio archivo y sólo lo descarga quien abre el
tablero. El bundle de quien viene a practicar creció 4 kB.

## Decisiones que no son accidentales

**La cuenta padre no se autocompleta.** Al elegir "Caja" el selector de cuenta
padre queda vacío. `planCuentas.js` sabe que Caja es Activo, pero ese dato solo
lo consume la verificación: clasificar es lo que se está practicando. Por la
misma razón el selector de cuentas es una lista plana alfabética y no está
agrupada por categoría — agruparla regalaría la respuesta.

**La balanza no valida el asiento.** Solo suma débitos y créditos. Un asiento
puede cuadrar perfectamente con las cuentas equivocadas, y la interfaz lo deja
pasar a propósito: el texto bajo la balanza lo dice explícitamente.

**La retroalimentación no revela la respuesta.** Cuando hay error se señala qué
está mal en cada línea (cuenta padre, lado, monto, cuenta que sobra). Si falta
una línea se dice el lado pero nunca la cuenta. Las cuentas T y la nota
explicativa solo aparecen cuando el asiento está correcto.

**El lado se lee sin depender del color.** Los dos botones de lado son píldoras
con una flecha que apunta a la columna donde caerá el monto en la cuenta T: `←`
para Débito, `→` para Crédito. La flecha es la señal no cromática del lado, y
además enseña la geometría de la T antes de que el usuario la vea dibujada.

**Vocabulario fijo.** "Débito" y "Crédito" en toda la interfaz, nunca
"Debe"/"Haber". Azul para débito y ciruela para crédito en botones, balanza y
cuentas T; verde solo para acierto, rojo solo para error. Las cifras y la
numeración van en monoespaciada para que las columnas alineen como en un libro
contable; los rótulos van en Inter, neutros, según la regla de etiquetas de
sección del sistema.

**El progreso puede fallar sin romper nada.** Lectura y escritura de
localStorage están envueltas en `try/catch`; si el almacenamiento está
bloqueado o el dato guardado está corrupto, la app arranca limpia y sigue
funcionando en memoria.

## Sobre el ejercicio 05

El enunciado original de este ejercicio llegó truncado: se perdieron las líneas
del asiento y el comienzo de la nota. Se reconstruyó de la única forma que el
hecho económico admite (abonar 500.000 en efectivo a un proveedor: Cuentas por
Pagar al débito contra Caja al crédito) y se completó la nota a partir del
fragmento que sobrevivió. La línea queda marcada con `reconstruido: true` en
`src/data/ejercicios.js` para poder revisarla contra la fuente. Los otros 17
ejercicios son literales.
