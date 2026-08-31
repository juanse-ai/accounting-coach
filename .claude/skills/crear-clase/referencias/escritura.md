# Cómo se escribe una clase

## Las láminas

**Dos párrafos, no tres.** El techo cómodo son ~70 palabras de cuerpo por
lámina; pasado eso, la gente lee en vez de escuchar. Si un párrafo se puede
borrar sin perder un dato ni un argumento, sobraba.

**Lo que se pueda enseñar, no se cuenta.** Una lista de ocho inversionistas es
un muro de logos. Un historial de tres operaciones con su desenlace es tres
logos con su pie. Cada dato que sube al visual libera una línea del párrafo.

**El rótulo de la lámina es opcional, y casi siempre sobra.** `etiqueta` sirve
cuando ordena la baraja en secciones que se repiten («Fundamento», «Historia ·
1494»). Cuando solo repite en pequeño lo que el título ya dice en grande («El
hecho · agosto 2026» encima de «NVIDIA compra Hugging Face»), es ruido: déjalo
en `null`.

**El título va partido en segmentos** para poder acentuar una parte:

```js
titulo: [{ t: 'El sobrante se llama ' }, { t: 'goodwill', acento: true }]
```

No se parte por coincidencia de texto porque se rompe con tildes, con la palabra
repetida y con los signos de una ecuación. Se marca a mano y no tiene casos borde.

**Bloques del cuerpo**:

```js
{ tipo: 'p', texto }
{ tipo: 'lista', items: ['…'] }                       // numerada, 3–5 items
{ tipo: 'fichas', leyenda?, items: [{ texto, ficha, tono?, flecha? }] }
```

`fichas` es una lista donde cada renglón lleva una píldora corta al lado:
`Efectivo → Cierto hoy`. Sustituye a un párrafo de enumeración y ocupa la mitad.
La `leyenda` es lo que el lector de pantalla dice entre el texto y la ficha
(«aumentan al»), para que la relación no se pierda.

**Ninguna lámina habla de otra.** «Ahí empieza el problema de la lámina 11»,
«el sobrante tiene nombre, y es la lámina siguiente», «esto da para media
clase». Quien está mirando la 4 no sabe qué hay en la 11 ni puede ir a verlo,
así que la frase no dice nada y encima suena a nota interna del que escribió la
baraja. Si el punto vale la pena, dilo aquí y completo; si no, bórralo. Vale
también para el quiz: una `nota` no manda a la pregunta siguiente.

**Los hechos van con fuente y fecha.** Lo que no se puede verificar se rotula
como supuesto ahí mismo: «cifras de ejemplo; el precio es el reportado».

**Desconfía de los superlativos.** «La mayor», «la primera», «el récord», «nunca
antes»: son las afirmaciones que más rápido se pudren y las que peor quedan
cuando alguien en la sala sabe el contrapunto. Antes de escribir una, búscala
sola, con su año, y pregúntate qué operación podría desmentirla.

Y cuando encuentres el contraejemplo, mira su estructura antes de tachar la
frase. Esta clase decía que Hugging Face sería la mayor adquisición de NVIDIA,
y era falso: por Groq había pagado más. Pero por Groq no compró la empresa,
licenció su tecnología y contrató a su equipo, y por eso el regulador nunca la
revisó. El contraejemplo no rompía la lámina: le faltaba, y terminó siendo la
mejor de la baraja.

## Las preguntas

**Se pregunta el concepto, no la cifra.** «¿Cuánto pagó X?» se responde
recordando y no enseña nada. «¿Qué es exactamente una valoración?» se responde
entendiendo. Las cifras pueden ir dentro del enunciado como dato de trabajo,
nunca como lo que hay que recordar.

Prueba rápida: **si la respuesta correcta es un número o un nombre propio, la
pregunta está mal planteada.** Reescríbela hacia el porqué.

La excepción es cuando el nombre propio es el punto de partida y no el examen:
quién fundó una empresa, con las caras delante. Ahí se pide un dato de memoria
a propósito, para anclar la historia antes de razonarla, y lo que salva la
pregunta son las otras dos piezas. Los distractores tienen que ser gente real
de la misma historia: Gordon Moore fundó Intel, Lisa Su dirige AMD, Jonathan
Ross fundó Groq, y equivocarse con cualquiera de ellos enseña algo. Y la `nota`
tiene que contar por qué ese nombre importa, no repetirlo. Tres de estas en una
baraja de catorce es el techo; más y el quiz se vuelve trivia.

**Los distractores enseñan.** Los tres que sobran no son relleno: son los
errores que la gente realmente comete. «Se diluye menos repartiendo la ronda»,
«el goodwill se amortiza a cinco años», «lo que no se puede tocar no entra al
balance». Una opción absurda es una opción desperdiciada.

**Varía dónde cae la correcta.** Cuatro preguntas seguidas con la respuesta en B
se aprenden sin leer.

**La `nota` es la clase, no el veredicto.** Se muestra solo al acertar y es el
único sitio donde se puede explicar sin límite. Di por qué la correcta es
correcta *y* por qué las otras tientan. Es la parte más valiosa de escribir.

**Progresión de niveles**: `Básico` es reconocer el concepto, `Intermedio`
aplicarlo a un caso, `Avanzado` combinarlo con otro o llevarlo a sus
consecuencias. Un tercio de cada uno funciona bien.

## Los dos tipos de pregunta

```js
{ tipo: 'opcion', datos: { opciones: [{ texto, correcta }] } }   // 2–8, una sola correcta
{ tipo: 'asiento', datos: { lineas: [{ cuenta, padre, lado, monto }] } }  // 1–20, cuadradas
```

`asiento` solo sirve para contabilidad de partida doble y exige que la clase
tenga su `cuentas`. `padre` es una de `Activo`, `Pasivo`, `Patrimonio`,
`Ingreso`, `Gasto`; `lado` es `Débito` o `Crédito`.

Para todo lo demás, `opcion`.

## El tono de esta app

Español, segunda persona, frases cortas. Sin signos de admiración, sin
«¡genial!», sin emojis en el contenido. Cuando algo es una limitación conocida,
se dice: «la estructura no se divulgó» es mejor que inventarla.

**Nada de guiones largos.** Es el tic más delator de un texto escrito por una
máquina, y quien lee la clase lo nota aunque no sepa nombrarlo. Cada vez que te
salga uno, el signo que la frase pedía de verdad era otro:

| En vez de | Va |
| --- | --- |
| `neutral — que es justamente lo que…` | coma, si es un inciso |
| `no era cierto — un pleito que no contó` | dos puntos, si lo que sigue explica |
| `al resultado — por eso el goodwill…` | punto, si eran dos frases disfrazadas |
| `cosas —que no hay pleitos ocultos— y…` | dos puntos y punto, o paréntesis |

Vale para las láminas, los enunciados, las opciones y las notas. Búscalos antes
de dar por terminada una clase:

```bash
grep -n '—\|–' mi-clase.mjs
```
