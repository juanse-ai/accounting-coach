# Clases · presentación y quiz

Aplicación de una sola página para dar una clase: una presentación de láminas y
un quiz que se corrige solo. En español.

**Todo el contenido vive en Supabase.** El frontend no sabe de contabilidad ni
de fusiones y adquisiciones: sabe dibujar formas y calificar tipos de pregunta.
Publicar una clase nueva es insertar filas — no se toca código.

Hoy hay dos clases publicadas:

| Clase | Presentación | Quiz |
| --- | --- | --- |
| **Contabilidad Básica** | 12 láminas, de la ecuación contable a las cuentas T | 18 asientos de libro diario |
| **NVIDIA · Hugging Face** | 14 láminas sobre las compras de NVIDIA | 14 preguntas de opción múltiple sobre startups y M&A avanzado |

El quiz de la segunda clase pregunta conceptos, no cifras: qué es una valoración
y en qué se diferencia del dinero levantado, qué mide un múltiplo, qué diluye y
qué no, qué compra un comprador estratégico que un fondo no puede comprar, qué
riesgo cubre cada instrumento del contrato, de dónde sale el goodwill y qué es
exactamente lo que teme el regulador. Los números del caso aparecen dentro del
enunciado como dato de trabajo — ninguna pregunta se responde recordando uno.

El selector de la cabecera cambia de clase en caliente: se recargan las láminas,
el plan de cuentas, las preguntas y el tablero.

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
Sin esas variables la app arranca, avisa por consola y no muestra ninguna clase:
desde que el contenido vive en la base, el backend dejó de ser opcional.

## Cómo está organizado

No hay carpeta `src/data/`: el contenido está en la base.

```
src/
  App.jsx                     Cabecera, selección de clase y qué vista se muestra.

  motores/index.js            El registro: un motor por cada `preguntas.tipo`.
  motores/asiento.jsx         Armar un asiento y verificarlo contra el esperado.
  motores/opcion.jsx          Una correcta entre varias.
  componentes/Quiz.jsx        El quiz genérico. No conoce ningún tipo: delega en el motor.
  componentes/Presentacion.jsx  Las láminas de la clase, en un <dialog> modal.
  componentes/Diagramas.jsx   Las siete formas, dibujadas desde `laminas.datos`.
  componentes/SelectorClase   El selector, en la cabecera y en el landing.

  lib/clases.js               Catálogo y contenido de una clase.
  hooks/useClases.js          Qué clases hay y cuál está elegida (localStorage).
  hooks/useClase.js           El contenido de la elegida.
  hooks/useProgreso.js        Avance por clase, en localStorage, tolerante a fallos.
  hooks/useParticipante.js    Identidad de la sesión: alta en el landing y localStorage.
  logica/verificar.js         Comparación de asientos sin importar el orden + la balanza.
  logica/registro.js          Validación de nombre y correo, espejo de la del servidor.
  logica/promptChatGPT.js     El límite del enlace; el texto lo arma cada motor.
  lib/supabase.js             Cliente, solo con la clave publishable.
  lib/respuestas.js           Envío de cada respuesta + cola de reintento.
  componentes/Landing.jsx     La puerta: elegir clase, nombre y correo.
  componentes/Resultados.jsx  Tablero público con Recharts. Se carga aparte (lazy).
  componentes/DetalleEnvios   Cada envío, dibujado por el motor de su tipo.
  hooks/useResultados.js      Carga + eventos en vivo + reconciliación periódica.
  lib/resultados.js           Lectura pública y suscripción al canal Broadcast.
  logica/tablero.js           Derivaciones puras del tablero (resumen, por pregunta…).
  componentes/                Backlog, LineaAsiento, Balanza, Retroalimentacion, CuentasT.
  componentes/LogoFailFast    Lockup de marca, recoloreado para fondo negro.
  estilos/fail-fast-tokens.css Tokens del design system de Fail Fast (dark only).
  estilos.css                 Estilos de la app, construidos sobre esos tokens.
  estilos/aprende.css         Hoja de la presentación: la única con paleta propia.
supabase/migrations/          El esquema y el contenido, versionados.
.claude/skills/crear-clase/   El skill que crea clases: referencias, plantilla y generador.
public/aprende/               Las 7 fotos de Contabilidad Básica, servidas en local.
public/clases/                Capturas de pantalla propias; el resto de imágenes se enlaza.
```

### Publicar una clase nueva

Cinco `insert`, ninguno en `src/`:

1. Una fila en `clases` (slug, nombre y los tres textos del landing).
2. Sus `laminas`, en orden. Cada una puede nombrar una de las siete formas y
   traer sus `datos`.
3. Sus `cuentas`, solo si va a tener preguntas de tipo `asiento`.
4. Sus `preguntas`, con `tipo` y `datos`.
5. Recargar. El selector la muestra sola.

Hay un **skill** que hace todo eso: `.claude/skills/crear-clase/`. Trae la
referencia de las siete formas y de cómo se escribe una lámina y una pregunta,
una plantilla ejecutable y un generador que valida el contenido y escribe la
migración:

```bash
node .claude/skills/crear-clase/herramientas/generar.mjs mi-clase.mjs --verificar-imagenes
```

El generador aborta —sin escribir nada— si una pregunta tiene dos respuestas
correctas, si un asiento no cuadra, si una cuenta no está en el plan de la
clase, si una lámina nombra una forma que no existe o si una imagen no
responde; y avisa cuando una lámina se pasa de palabras o cuando una imagen
raster pesa de más.

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

**Una tercera extensión, y la única con paleta propia: la baraja "Aprende".**
La pestaña Aprende de la cabecera abre un `<dialog>` modal con una presentación
de 12 láminas. No es una vista más: se superpone a la que esté activa, así que
el asiento a medio armar sigue detrás intacto. Y no sigue la paleta del sistema
—trae la suya: fondo `#0a0a0a`, tinta `#fafafa` y un acento `#7b9cff` que pinta
la etiqueta de sección, una palabra de cada título y los números de las listas.

Eso contradice de frente dos reglas de arriba: el fondo de página es negro puro,
y la etiqueta de sección es **siempre** neutra porque el acento nunca la toca.
Se acepta porque la baraja es una pieza editorial cerrada con su propio brief, y
a cambio la excepción queda encerrada: los tres valores son custom properties
declaradas sobre `.aprende` y no sobre `:root`, así que fuera del diálogo no
existen. La píldora "Aprende" de la cabecera se queda neutra como sus vecinas.
Todo lo que no es paleta —espacio, radios, easing, Inter, `.cifra`, `.boton`,
`.visualmente-oculto`— se hereda del sistema sin tocar.

Seis de las doce láminas no llevan foto sino un diagrama construido en marcado y
CSS, no como imagen: así el texto sigue siendo texto —se lee con lector de
pantalla, se busca con Ctrl+F y escala con el zoom—. La tabla de las cinco
familias (lámina 11) reusa las flechas direccionales del selector de lado del
asiento: apuntan a la columna donde cae el monto en la cuenta T, que es justo
lo que remata el cuerpo de la lámina. No tiene columna de "saldo normal": para
las cinco familias coincide con el lado que aumenta, y verlo dos veces hacía
dudar de si decían cosas distintas. Dos láminas se salen de los tres
colores de la baraja, y en las dos el color es el contenido que se enseña, no
adorno: la 2 usa rojo y verde (`--ff-danger` / `--ff-success`) para entradas y
salidas, y la 11 pinta débito y crédito con la escala semántica de la app
(`--debito` azul y `--credito` ciruela), la misma que el aprendiz verá en el
asiento apenas cierre la baraja. En ninguna va solo el color: la 2 lleva el
signo `+` / `−` más un rótulo oculto, y las fichas de la 11 llevan la flecha de
"aumenta" y la palabra del lado escrita.

El diálogo es `<dialog>` nativo abierto con `showModal()`, que regala trampa de
foco, cierre con Escape, inertizado del fondo y capa superior. Lo único que hay
que devolverle a React es el evento `close`. El foco vuelve al botón que abrió la
baraja desde un efecto: el interior se desmonta al cerrar —para no descargarle
1,5 MB de fotos a quien nunca la abre— y con él se iba el foco.

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
clases  1 ── N  laminas          (la presentación)
   │
   ├── 1 ── N  cuentas           (plan de cuentas; solo para preguntas de asiento)
   │
   └── 1 ── N  preguntas  N ── 1  respuestas  N ── 1  participantes
                                      │
                                      └── 1 ── N  respuesta_lineas
```

| Tabla | Una fila es… |
| --- | --- |
| `clases` | Un tema, con los textos del landing. La unidad que el selector cambia. |
| `laminas` | Una lámina: rótulo, título en segmentos, cuerpo de bloques y, si la tiene, una forma o una foto. |
| `cuentas` | Una cuenta del plan de la clase, con la razón por la que pertenece a su familia. |
| `preguntas` | Una pregunta. `tipo` decide qué motor del frontend la atiende. |
| `participantes` | Una persona. Identidad única por correo, normalizado a minúsculas. |
| `respuestas` | **Un envío**: quién, qué pregunta, qué número de intento y si acertó. |
| `respuesta_lineas` | Una línea del asiento tal como la escribió la persona. |

**`preguntas.tipo` es el punto de extensión.** Hoy vale `asiento` (armar un
asiento de libro diario) u `opcion` (una correcta entre varias), y `datos` lleva
lo propio de cada uno: `{lineas:[…]}` o `{opciones:[…]}`. Un tipo nuevo es un
módulo en `src/motores/` y una línea en su registro — no toca el esquema, ni el
quiz, ni el tablero.

**Las líneas del asiento son filas, no un blob JSON.** Un asiento contable ya es
una relación: cada línea tiene cuenta, cuenta padre, lado y monto. Guardarlo como
JSON obligaría a desarmarlo en cada consulta; así, «qué cuenta se confunde más» o
«en qué lado se equivoca la gente» son un `group by`.

**`respuestas.datos` es el sobre genérico**, y no se solapa con esa tabla: al
guardar, las líneas salen del sobre y van a `respuesta_lineas`; al leer, se
vuelven a unir. Cada dato en un solo sitio, y un tipo de pregunta nuevo no
necesita una tabla propia.

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
salida es la contraria: **RLS activo y sin políticas en todas las tablas** —todo
acceso directo desde `anon` queda denegado, incluida la lectura de correos— y
todo pasa por funciones `SECURITY DEFINER` con `search_path` fijo:

- `clases_publicas()` → el catálogo, sin contenido. Lo que necesitan el selector
  y el landing.
- `clase_completa(slug)` → láminas, plan de cuentas y preguntas de una clase.
- `registrar_participante(nombre, email)` → devuelve el `uuid`. Idempotente por
  correo: volver a entrar con el mismo continúa el mismo historial.
- `registrar_respuesta(participante_id, pregunta_id, es_correcta, datos)` →
  escribe la cabecera y, si el sobre trae líneas, también sus líneas, en una sola
  transacción. **No sabe qué tipos de pregunta existen.**
- `resultados_publicos(clase_id)` y `id_publico_propio(participante_id)` → la
  lectura del tablero, recortada.

Todas validan y normalizan lo que reciben, y ninguna devuelve datos de terceros.

**`clase_completa` devuelve también la respuesta esperada de cada pregunta**,
porque la calificación es del lado del cliente. Es la misma exposición que había
cuando el contenido viajaba en el bundle, ni más ni menos: cualquiera puede leer
las respuestas si se lo propone. Moverla al servidor es un cambio aparte, con su
propia decisión de producto. El linter de Supabase marca ambas como «ejecutables por anon»: es
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

### Migraciones

Están en `supabase/migrations/` y aplicadas en el proyecto. Las cuatro del
modelo por clase se leen en orden:

| Migración | Qué hace |
| --- | --- |
| `crear_modelo_clases` | `clases`, `laminas`, `cuentas`, `preguntas`. |
| `sembrar_clase_contabilidad_basica` | Generada desde los `src/data/*.js` que eran la fuente, para que el contenido no pudiera cambiar al mudarse. |
| `migrar_respuestas_a_preguntas` | `respuestas` pasa a colgar de `preguntas`. Los 714 envíos y sus 1.462 líneas se conservan. |
| `sembrar_clase_nvidia_hugging_face` | La segunda clase. |
| `rpcs_por_clase` | Las funciones de lectura y escritura, rehechas. |
| `revocar_permisos_anon` | Quitarle a `anon` los permisos de tabla que Supabase concede por defecto, para que las tablas nuevas queden negadas dos veces como las viejas. |
| `preguntas_conceptuales_nvidia` | Reemplaza las 12 preguntas de la segunda clase: las primeras se respondían recordando cifras. Trae un guard que aborta si alguien ya había enviado respuestas. |
| `laminas_nvidia_con_imagenes` | Recorta el texto de las 12 láminas y mueve al visual lo que se puede enseñar en vez de contar: los logos de la operación, los ocho inversionistas de la ronda, el historial antimonopolio con su desenlace. |
| `afinar_imagenes_nvidia` | Cambia el original de Wikimedia (2 MB, no alcanzaba a cargar) por su miniatura de 960 px. |
| `limpiar_baraja_nvidia` | Quita el rótulo de cada lámina y la atribución de la portada, cambia los dieciséis guiones largos por el signo que la frase pedía, y reemplaza el avatar cuadrado de NVIDIA por su logotipo horizontal. `laminas.etiqueta` pasa a ser opcional. |
| `escala_optica_marcas` | Iguala cómo se ve el logotipo de Hugging Face al lado de los otros. |
| `corregir_groq` | La portada afirmaba que Hugging Face sería la mayor adquisición de NVIDIA. Es falso: en diciembre de 2025 pagó unos USD 20.000 millones por Groq. Pero no compró la empresa (licenció su tecnología y contrató a su equipo), así que nunca se notificó al regulador. La corrección entra en la portada, en la lámina del regulador y en dos preguntas: el quiz pasa a 13. |
| `groq_contra_hugging_face` | Saca la lámina genérica de los cuatro estados y pone tres en su lugar: qué hace Groq, las dos compras lado a lado, y la pila que NVIDIA lleva comprada capa por capa. La baraja pasa a 14 y el quiz también. Las fotos ganan `credito`, porque el die del LPU es CC BY-SA y hay que acreditarlo. |
| `portada_y_hugging_face` | La portada pierde el párrafo sobre el estado de la operación, que la lámina 13 dice mejor. La segunda cambia la foto de una GPU por una captura de huggingface.co y reescribe el texto en llano. |

Antes de esto el esquema solo existía en el proyecto remoto; ahora el repo
alcanza para reconstruirlo.

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

**El frontend no tiene contenido, tiene formas.** Las siete formas de diagrama de
la presentación —`registro`, `flujo`, `balance`, `partido`, `tabla`, `bloqueT`,
`marcas`— dibujan una estructura y nada más; qué dice cada una lo pone la columna `datos`
de la lámina. La misma tabla sirve para las cinco familias contables y para
comparar Mellanox, Arm y Hugging Face. Las dos clases publicadas las usan
sin compartir una línea de contenido.

**Un motor por tipo de pregunta.** `src/motores/` tiene un módulo por cada valor
de `preguntas.tipo`, y cada uno sabe cinco cosas y solo esas: con qué borrador
empieza, cómo se edita, cómo se califica, qué se guarda y cómo se muestra —la
solución al acertar, el envío en el tablero—. `Quiz.jsx` no conoce ningún tipo:
busca el motor en el registro y le delega.

**La cuenta padre no se autocompleta.** Al elegir "Caja" el selector de cuenta
padre queda vacío. La tabla `cuentas` sabe que Caja es Activo, pero ese dato solo
lo consume la verificación: clasificar es lo que se está practicando. Por la
misma razón el selector de cuentas es una lista plana alfabética y no está
agrupada por categoría — agruparla regalaría la respuesta.

**La balanza no valida el asiento.** Solo suma débitos y créditos. Un asiento
puede cuadrar perfectamente con las cuentas equivocadas, y la interfaz lo deja
pasar a propósito: el texto bajo la balanza lo dice explícitamente.

**La retroalimentación no revela la respuesta.** En un asiento se señala qué está
mal en cada línea (cuenta padre, lado, monto, cuenta que sobra); si falta una
línea se dice el lado pero nunca la cuenta. En una pregunta de opción se dice
cuál falló, no cuál era. La solución y la nota explicativa solo aparecen al
acertar.

**El enlace a ChatGPT no revela lo mismo en los dos tipos.** En un asiento lleva
la respuesta esperada dentro —quien lo abre ya pidió que se la expliquen, y el
prompt le prohíbe limitarse a soltarla—. En una pregunta de opción no: con cuatro
opciones, decírselo a ChatGPT es decírselo al usuario, así que se le pide que
razone sobre todas.

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

## Sobre la pregunta 05 de Contabilidad Básica

El enunciado original de este ejercicio llegó truncado: se perdieron las líneas
del asiento y el comienzo de la nota. Se reconstruyó de la única forma que el
hecho económico admite (abonar 500.000 en efectivo a un proveedor: Cuentas por
Pagar al débito contra Caja al crédito) y se completó la nota a partir del
fragmento que sobrevivió. La pregunta queda marcada con `"reconstruido": true`
dentro de su columna `datos` para poder revisarla contra la fuente. Los otros 17
ejercicios son literales.
