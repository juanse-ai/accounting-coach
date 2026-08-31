-- El quiz, rehecho: nueve preguntas nuevas y cinco que se quedan.
--
-- La baraja de preguntas daba por sabido todo el vocabulario técnico. Se podía
-- responder entera sin saber qué es una GPU, qué son los pesos de un modelo ni
-- por qué existe un sitio donde se publican. Eso deja fuera a quien más falta
-- le hace la clase.
--
-- Entran, en este orden: qué es una GPU, qué son los pesos, qué es un modelo
-- de pesos abiertos, quién fundó NVIDIA, quién fundó Hugging Face, qué es una
-- TPU, quién fundó Groq, la estructura de la compra de Groq y por qué las dos
-- operaciones sirven a lo mismo.
--
-- Se quedan las cinco de concepto que la presentación sostiene con una lámina
-- entera: valoración, múltiplo, escrow, goodwill y regulador. Se reescriben en
-- el mismo castellano que las láminas: sin «denominador», sin «hyperscalers»,
-- sin guiones largos.
--
-- Tres preguntas llevan caras. La de NVIDIA enseña a dos de sus tres
-- fundadores, la de Hugging Face a dos de los tres suyos, y la de Groq a uno.
-- Del resto no hay fotografía libre en Wikimedia Commons, y bajar una que no
-- lo sea para una clase publicada no es una opción. Las caras van SIN pie: en
-- una pregunta que pide los nombres, rotularlas sería regalar la respuesta.
-- El texto alternativo describe a la persona sin nombrarla, por lo mismo.
--
-- Se edita en sitio y no se reemplaza: la clase ya tiene una respuesta
-- enviada, y `respuestas` cae en cascada. El motor de opción guarda el texto
-- elegido junto al índice justamente para esto, así que ese envío sigue siendo
-- legible aunque la pregunta que lo originó ahora diga otra cosa.

-- ── 01 · Qué es una GPU ────────────────────────────────────────────────────

update public.preguntas p set
  nivel = 'Básico',
  enunciado = 'NVIDIA vende GPUs, y de ahí sale casi todo lo que factura. ¿Qué hace una GPU que la volvió la pieza central de la inteligencia artificial?',
  aviso = null,
  apoyo = null,
  nota = 'Una GPU nació para dibujar gráficos, y dibujar una pantalla es calcular millones de píxeles a la vez. Resulta que entrenar y correr una red neuronal es el mismo tipo de trabajo: muchísimas multiplicaciones sencillas que se pueden hacer todas al tiempo. Por eso la pieza que se inventó para los videojuegos terminó siendo la de la IA. La memoria de la tarjeta importa, y mucho, pero es una consecuencia: sin cálculo en paralelo la memoria sola no serviría de nada. Y una GPU no reemplaza al procesador del computador: trabaja a su lado, el procesador manda y ella hace el trabajo pesado.',
  datos = '{"opciones":[
    {"texto":"Guarda el modelo entero en su memoria, y sin esa memoria el modelo no cabría en ninguna parte.","correcta":false},
    {"texto":"Hace muchísimas operaciones sencillas a la vez, en vez de pocas y complicadas una tras otra, que es justo la forma que tiene el cálculo de una red neuronal.","correcta":true},
    {"texto":"Reemplaza al procesador del computador y hace su mismo trabajo, solo que más rápido.","correcta":false},
    {"texto":"Está diseñada para dibujar imágenes, y un modelo de IA es en el fondo una imagen muy grande.","correcta":false}
  ]}'::jsonb
  from public.clases c
 where c.id = p.clase_id and c.slug = 'nvidia-hugging-face' and p.codigo = '01';

-- ── 02 · Qué son los pesos ─────────────────────────────────────────────────

update public.preguntas p set
  nivel = 'Básico',
  enunciado = 'Cuando alguien dice que publicó «los pesos» de un modelo, ¿qué publicó exactamente?',
  aviso = null,
  apoyo = null,
  nota = 'Entrenar un modelo es ajustar millones de números hasta que las respuestas empiecen a salir bien. Esos números son los pesos: son el resultado del entrenamiento, no su receta. Por eso publicar los pesos es publicar el modelo ya hecho, y cualquiera puede bajarlos y usarlos sin repetir el entrenamiento, que es la parte cara. El código es la receta y los datos son los ingredientes. Se pueden publicar también, pero son otra cosa, y casi nunca se publican los tres juntos.',
  datos = '{"opciones":[
    {"texto":"El código del programa que se usó para entrenarlo.","correcta":false},
    {"texto":"Los textos y las imágenes con los que se entrenó.","correcta":false},
    {"texto":"Los millones de números que quedaron dentro del modelo al terminar de entrenarlo, que son los que deciden qué responde.","correcta":true},
    {"texto":"Cuánta memoria y cuánta electricidad consume el modelo cada vez que se usa.","correcta":false}
  ]}'::jsonb
  from public.clases c
 where c.id = p.clase_id and c.slug = 'nvidia-hugging-face' and p.codigo = '02';

-- ── 03 · Qué es un modelo de pesos abiertos ────────────────────────────────

update public.preguntas p set
  nivel = 'Básico',
  enunciado = 'Hugging Face es donde se publican los modelos de pesos abiertos. ¿Qué quiere decir que un modelo sea de pesos abiertos?',
  aviso = null,
  apoyo = null,
  nota = 'Quiere decir que el modelo ya entrenado se puede bajar y correr donde uno quiera. Eso es lo que lo separa de un modelo cerrado, al que solo se llega llamando al servidor de su dueño. Ojo con las dos confusiones más comunes. Una: abierto no es lo mismo que sin restricciones, porque casi todos vienen con una licencia que dice qué se puede hacer con ellos. Dos: abrir los pesos no es abrir los datos ni el código con que se entrenó, que casi nunca se publican, y por eso se dice «pesos abiertos» y no «código abierto». Aquí está la razón de fondo por la que este sitio le interesa a un fabricante de chips: un modelo que corre en el computador de cualquiera corre sobre el hardware que ese cualquiera tenga.',
  datos = '{"opciones":[
    {"texto":"Que cualquiera puede descargar sus pesos y correrlo en su propia máquina, sin pedirle permiso ni conexión a nadie.","correcta":true},
    {"texto":"Que sus respuestas no tienen filtros ni restricciones de ningún tipo.","correcta":false},
    {"texto":"Que se publicaron también los datos con los que se entrenó y el código del entrenamiento.","correcta":false},
    {"texto":"Que usarlo es gratis a través de la página web de quien lo hizo.","correcta":false}
  ]}'::jsonb
  from public.clases c
 where c.id = p.clase_id and c.slug = 'nvidia-hugging-face' and p.codigo = '03';

-- ── 04 · Quién fundó NVIDIA ────────────────────────────────────────────────

update public.preguntas p set
  nivel = 'Básico',
  enunciado = 'NVIDIA la fundaron tres personas en 1993, en una cafetería de San José, California. Dos de ellas están en las fotos. ¿Cómo se llaman los tres?',
  aviso = null,
  apoyo = '{
    "retratos":[
      {"src":"https://upload.wikimedia.org/wikipedia/commons/thumb/c/c4/Jensen_Huang_%28cropped%29.jpg/500px-Jensen_Huang_%28cropped%29.jpg","alt":"Un hombre de pelo gris con gafas y chaqueta de cuero negra, sonriendo de frente."},
      {"src":"https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Chris_Malachowsky_%2854986972670%29.jpg/500px-Chris_Malachowsky_%2854986972670%29.jpg","alt":"Un hombre mayor de pelo blanco y barba blanca recortada, con camisa clara, hablando ante un micrófono."}
    ],
    "credito":"Fotos: oficina del primer ministro de India (GODL-India) y Maryland GovPics (CC BY 4.0)."
  }'::jsonb,
  nota = 'Jensen Huang, Chris Malachowsky y Curtis Priem. Huang sigue siendo el director ejecutivo treinta y tres años después, cosa rarísima en esta industria; los otros dos ya no trabajan ahí, y de Priem no hay fotografía libre, por eso son dos caras y no tres. Los nombres de las otras opciones también salen de esta historia, pero de otras empresas: Gordon Moore y Robert Noyce fundaron Intel, Lisa Su dirige AMD y Jonathan Ross fundó Groq. Los tres compiten con NVIDIA, y los tres vuelven a aparecer en esta clase.',
  datos = '{"opciones":[
    {"texto":"Jensen Huang, Gordon Moore y Robert Noyce.","correcta":false},
    {"texto":"Jensen Huang, Chris Malachowsky y Curtis Priem.","correcta":true},
    {"texto":"Jensen Huang, Lisa Su y Curtis Priem.","correcta":false},
    {"texto":"Jensen Huang, Jonathan Ross y Chris Malachowsky.","correcta":false}
  ]}'::jsonb
  from public.clases c
 where c.id = p.clase_id and c.slug = 'nvidia-hugging-face' and p.codigo = '04';

-- ── 05 · Quién fundó Hugging Face ──────────────────────────────────────────

update public.preguntas p set
  nivel = 'Básico',
  enunciado = 'Hugging Face nació en Nueva York en 2016, y su primer producto no tenía nada que ver con lo que es hoy: era una aplicación de chat para adolescentes. Dos de sus tres fundadores están en las fotos. ¿Cómo se llaman los tres?',
  aviso = null,
  apoyo = '{
    "retratos":[
      {"src":"https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/Cl%C3%A9ment_Delangue_on_SiliconANGLE_theCUBE.jpg/500px-Cl%C3%A9ment_Delangue_on_SiliconANGLE_theCUBE.jpg","alt":"Un hombre joven de pelo castaño corto y camiseta azul, hablando a la cámara desde una silla de oficina."},
      {"src":"https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/Thomas_Wolf_at_Slush_2024.jpg/500px-Thomas_Wolf_at_Slush_2024.jpg","alt":"Un hombre de camisa de jean sentado en el escenario de una conferencia, mirando hacia un lado mientras habla."}
    ],
    "credito":"Fotos: SiliconANGLE theCUBE y Slush (CC BY 3.0)."
  }'::jsonb,
  nota = 'Clément Delangue, Julien Chaumond y Thomas Wolf, los tres franceses, en Nueva York y en 2016. La carita amarilla que abraza viene de aquella aplicación de chat, y el nombre también. Lo que terminó valiendo no fue ese producto sino la herramienta que soltaron por el camino: una librería para usar modelos de lenguaje, que se volvió el estándar y arrastró detrás al sitio donde se publican. Los nombres de las otras opciones son de la misma industria y de países vecinos, que es lo que los vuelve tentadores: Yann LeCun es francés y dirigió la investigación de IA de Meta, Aidan Gomez fundó Cohere y Emad Mostaque fundó Stability AI.',
  datos = '{"opciones":[
    {"texto":"Clément Delangue, Aidan Gomez y Thomas Wolf.","correcta":false},
    {"texto":"Yann LeCun, Julien Chaumond y Thomas Wolf.","correcta":false},
    {"texto":"Clément Delangue, Julien Chaumond y Emad Mostaque.","correcta":false},
    {"texto":"Clément Delangue, Julien Chaumond y Thomas Wolf.","correcta":true}
  ]}'::jsonb
  from public.clases c
 where c.id = p.clase_id and c.slug = 'nvidia-hugging-face' and p.codigo = '05';

-- ── 06 · Qué es una TPU ────────────────────────────────────────────────────

update public.preguntas p set
  nivel = 'Intermedio',
  enunciado = 'Google no usa GPUs para buena parte de su inteligencia artificial: usa TPUs, que fabrica para sí mismo. ¿Qué es una TPU?',
  aviso = null,
  apoyo = null,
  nota = 'Una GPU es de propósito general dentro de lo suyo: sirve para gráficos, para simulaciones y para IA. Una TPU está hecha para un solo trabajo, y eso es justamente lo que la vuelve buena en él y la deja inútil para lo demás. Google la construyó porque las cuentas le decían que, si la búsqueda por voz crecía como iba a crecer, tendría que duplicar sus centros de datos para atenderla. Esa es la jugada que a NVIDIA le preocupa desde hace años: sus clientes más grandes son también los únicos que se pueden fabricar el chip ellos mismos.',
  datos = '{"opciones":[
    {"texto":"Una GPU de NVIDIA a la que Google le instala su propio programa.","correcta":false},
    {"texto":"Un servicio en la nube donde se alquilan GPUs por horas.","correcta":false},
    {"texto":"Un formato de archivo para guardar y compartir modelos ya entrenados.","correcta":false},
    {"texto":"Un chip que Google diseñó desde cero para un solo trabajo, el cálculo de redes neuronales, y que por eso puede ser más rápido y gastar menos que una GPU en esa tarea.","correcta":true}
  ]}'::jsonb
  from public.clases c
 where c.id = p.clase_id and c.slug = 'nvidia-hugging-face' and p.codigo = '06';

-- ── 07 · Quién fundó Groq ──────────────────────────────────────────────────

update public.preguntas p set
  nivel = 'Intermedio',
  enunciado = 'La persona de la foto fundó Groq en 2016, junto con Douglas Wightman. ¿Quién es y de dónde venía?',
  aviso = null,
  apoyo = '{
    "retratos":[
      {"src":"https://upload.wikimedia.org/wikipedia/commons/thumb/0/03/Jonathan_Ross_at_World_Economic_Forum_Annual_Meeting_2025.png/500px-Jonathan_Ross_at_World_Economic_Forum_Annual_Meeting_2025.png","alt":"Un hombre de pelo oscuro, saco azul oscuro y camisa blanca sin corbata, sentado en el escenario de un foro."}
    ],
    "credito":"Foto: World Economic Forum (CC BY 3.0)."
  }'::jsonb,
  nota = 'Jonathan Ross. La TPU empezó como un proyecto suyo dentro de Google, de los que se hacían con el tiempo libre que la empresa daba para eso, y terminó siendo el chip con el que Google dejó de depender de NVIDIA. Después se fue y montó Groq para hacer lo mismo desde afuera, apuntando a lo único que NVIDIA no domina: correr los modelos ya entrenados. Diez años más tarde NVIDIA se lo llevó, junto con su tecnología y sus ingenieros. Jim Keller y Noam Shazeer son reales y están en la misma industria, pero ninguno arrancó la TPU: Keller diseñó procesadores en AMD, Apple, Tesla e Intel, y Shazeer es uno de los autores del artículo que definió la arquitectura de los modelos de lenguaje de hoy.',
  datos = '{"opciones":[
    {"texto":"Jonathan Ross, que en Google había arrancado el proyecto de la TPU.","correcta":true},
    {"texto":"Jonathan Ross, que venía de diseñar los chips de red de Mellanox.","correcta":false},
    {"texto":"Jim Keller, que había diseñado procesadores en AMD, Apple y Tesla.","correcta":false},
    {"texto":"Noam Shazeer, uno de los autores del artículo que definió la arquitectura de los modelos de lenguaje de hoy.","correcta":false}
  ]}'::jsonb
  from public.clases c
 where c.id = p.clase_id and c.slug = 'nvidia-hugging-face' and p.codigo = '07';

-- ── 08 · Qué es una valoración ─────────────────────────────────────────────

update public.preguntas p set
  nivel = 'Intermedio',
  enunciado = 'En 2023 Hugging Face levantó USD 235 millones y se dijo que quedaba valorada en USD 4.500 millones. ¿Qué es exactamente esa segunda cifra?',
  aviso = null,
  apoyo = null,
  nota = 'Una valoración es un precio, no un saldo. Nadie puso 4.500 millones sobre la mesa: unos inversionistas pusieron 235 a cambio de un porcentaje, y de esa proporción sale cuánto costaría la empresa entera al mismo precio. Por eso una valoración no dice cuánta plata tiene la empresa en el banco, ni cuánto factura, ni cuánto va a pagar el próximo comprador. Se ve tres años después, cuando la cifra ya es otra muy distinta.',
  datos = '{"opciones":[
    {"texto":"El dinero que quedó en la caja de Hugging Face después de la ronda.","correcta":false},
    {"texto":"Lo que costaría la empresa entera al mismo precio que pagaron esos inversionistas por su parte.","correcta":true},
    {"texto":"La suma de todo lo que Hugging Face ha facturado desde que se fundó.","correcta":false},
    {"texto":"El precio mínimo que cualquier comprador está obligado a pagar por ella.","correcta":false}
  ]}'::jsonb
  from public.clases c
 where c.id = p.clase_id and c.slug = 'nvidia-hugging-face' and p.codigo = '08';

-- ── 09 · Qué mide un múltiplo ──────────────────────────────────────────────

update public.preguntas p set
  nivel = 'Intermedio',
  enunciado = 'Entre 2023 y 2026 el precio de Hugging Face casi se triplicó y, sin embargo, su múltiplo bajó: de más de 100 veces sus ingresos a unas 86. ¿Cómo pueden pasar las dos cosas a la vez?',
  aviso = null,
  apoyo = null,
  nota = 'Un múltiplo es una división: el precio partido entre lo que la empresa factura en un año. Si lo que factura crece más rápido que el precio, la división da menos aunque el precio haya subido. Por eso un múltiplo sirve para comparar una empresa con otra y no para decir, él solo, si está cara: uno alto suele significar que el mercado espera crecimiento, y uno bajo, que el crecimiento ya llegó.',
  datos = '{"opciones":[
    {"texto":"Porque el múltiplo y el precio miden lo mismo, así que una de las dos cifras tiene que estar mal.","correcta":false},
    {"texto":"Porque los múltiplos bajan solos con el paso del tiempo, como se descuenta una máquina.","correcta":false},
    {"texto":"Porque lo que factura creció más rápido que el precio: más cara en dólares y más barata comparada con lo que vende.","correcta":true},
    {"texto":"Porque al bajar el múltiplo la empresa perdió valor, aunque le hayan pagado más.","correcta":false}
  ]}'::jsonb
  from public.clases c
 where c.id = p.clase_id and c.slug = 'nvidia-hugging-face' and p.codigo = '09';

-- ── 10 · Escrow ────────────────────────────────────────────────────────────

update public.preguntas p set
  nivel = 'Intermedio',
  enunciado = 'Hugging Face aloja modelos y datos que suben terceros. Si un año después de cerrada la compra aparece un pleito por algo que se subió antes, ¿qué parte del contrato está pensada para que ese costo no lo termine pagando el comprador?',
  aviso = null,
  apoyo = null,
  nota = 'El vendedor afirma por escrito un montón de cosas: que no hay pleitos escondidos, que las licencias están en regla, que no hay deudas sin declarar. Eso son las declaraciones y garantías. Si alguna resulta falsa, el escrow es el dinero ya apartado para cubrirlo, y por eso se libera meses o años después del cierre y no el mismo día. Es un riesgo distinto del que cubre un earnout: aquí no se trata de que el negocio no rinda, sino de que lo que dijeron no era cierto.',
  datos = '{"opciones":[
    {"texto":"El earnout, porque un pleito reduciría los resultados de los años siguientes.","correcta":false},
    {"texto":"Lo que el vendedor declaró por escrito, respaldado por una parte del precio que queda retenida en garantía uno o dos años.","correcta":true},
    {"texto":"La multa que se pacta para la parte que se retire antes de cerrar.","correcta":false},
    {"texto":"Ninguna: al cerrar, todo el riesgo pasa al comprador sin excepción.","correcta":false}
  ]}'::jsonb
  from public.clases c
 where c.id = p.clase_id and c.slug = 'nvidia-hugging-face' and p.codigo = '10';

-- ── 11 · La estructura de la compra de Groq ────────────────────────────────

update public.preguntas p set
  nivel = 'Avanzado',
  enunciado = 'En diciembre de 2025 NVIDIA pagó unos USD 20.000 millones por Groq sin comprar la empresa: licenció su tecnología y contrató a su equipo, y Groq siguió existiendo. ¿Qué cambia esa forma de armar la operación?',
  aviso = null,
  apoyo = null,
  nota = 'Hay que avisarle a la autoridad de competencia antes de comprar las acciones o los activos de una empresa. Una licencia no exclusiva más una oferta de trabajo a su equipo, en la forma, no es ninguna de las dos cosas, y Groq siguió existiendo como sociedad. Por eso la operación más cara de la historia de NVIDIA nunca pasó por revisión, y por eso en marzo de 2026 dos senadores de Estados Unidos le escribieron preguntando si aquello no era, precisamente, una manera de esquivar la ley. La regla para ese caso existe: si una estructura se arma para evitar el aviso, se ignora la forma y se mira el fondo. Pero eso hay que probarlo después, y para entonces la operación ya ocurrió.',
  datos = '{"opciones":[
    {"texto":"Nada de fondo: pagar por la tecnología y pagar por la empresa son la misma operación con otro nombre.","correcta":false},
    {"texto":"Que el precio deja de ser una inversión y se anota entero como gasto del año.","correcta":false},
    {"texto":"Que los dueños de Groq cobran más, porque no hay que repartir con la sociedad.","correcta":false},
    {"texto":"Que no hay nada que avisarle a la autoridad de competencia, así que no hay revisión previa.","correcta":true}
  ]}'::jsonb
  from public.clases c
 where c.id = p.clase_id and c.slug = 'nvidia-hugging-face' and p.codigo = '11';

-- ── 12 · Groq contra Hugging Face ──────────────────────────────────────────

update public.preguntas p set
  nivel = 'Avanzado',
  enunciado = 'Groq hacía chips que le competían a NVIDIA. Hugging Face no fabrica nada y no le compite en nada. ¿Por qué las dos operaciones, siendo tan distintas, sirven a lo mismo?',
  aviso = null,
  apoyo = null,
  nota = 'Son dos maneras de defender el mismo negocio. Groq atacaba de frente, con un chip mejor para correr modelos. Hugging Face no ataca por ningún lado, pero es donde el programador decide qué modelo usa y cómo lo corre, y esa decisión arrastra al chip detrás. Quitarse un rival y quedarse con el camino obligado son jugadas distintas, se pagan distinto y las mira un regulador distinto, pero apuntan al mismo sitio. Lo que no son es diversificación: ninguna de las dos le mueve la aguja de los ingresos frente a lo que factura vendiendo chips, y por eso comparar el precio contra lo que factura la comprada no explica nada.',
  datos = '{"opciones":[
    {"texto":"Las dos le suman ingresos que compensan lo que ya no crece en chips.","correcta":false},
    {"texto":"Las dos le dan patentes que puede cobrarles a AMD y a Intel.","correcta":false},
    {"texto":"Con Groq se quita de encima a un competidor; con Hugging Face se queda con el sitio por donde pasa el que elige sobre qué chip corre un modelo. En los dos casos protege su negocio de chips.","correcta":true},
    {"texto":"Las dos son formas de pasarse al negocio del software, que deja más margen que el hardware.","correcta":false}
  ]}'::jsonb
  from public.clases c
 where c.id = p.clase_id and c.slug = 'nvidia-hugging-face' and p.codigo = '12';

-- ── 13 · Goodwill ──────────────────────────────────────────────────────────

update public.preguntas p set
  nivel = 'Avanzado',
  enunciado = 'Al cerrar, el comprador tiene que repartir el precio que pagó entre todo lo que compró, poniéndole a cada cosa lo que valdría vendida aparte. En una empresa cuyo valor está en su comunidad y en su equipo, ¿dónde termina la mayor parte del precio y qué pasa con eso después?',
  aviso = null,
  apoyo = null,
  nota = 'El goodwill no se calcula, sobra: es el precio menos lo que valen por separado las cosas que sí se pueden identificar. Recoge justo lo que ninguna norma deja anotar aparte, que son las ventajas esperadas de juntar los dos negocios y el equipo ya armado y funcionando. Y como no se va descontando año a año sino que se revisa, termina siendo la cuenta que lleva la nota de si la compra salió bien: mientras nadie la toque, la apuesta sigue en pie; el día que hay que bajarla, el mercado se entera de golpe.',
  datos = '{"opciones":[
    {"texto":"En goodwill, que sale por diferencia y no se descuenta año a año: se revisa, y si el negocio comprado deja de valer lo pagado la pérdida entra entera al resultado.","correcta":true},
    {"texto":"En una marca o una tecnología, que se van descontando en partes iguales durante cinco años.","correcta":false},
    {"texto":"En el gasto del año: lo que no se puede tocar no entra al balance.","correcta":false},
    {"texto":"Repartido en proporción entre los computadores y los equipos que la empresa ya tenía.","correcta":false}
  ]}'::jsonb
  from public.clases c
 where c.id = p.clase_id and c.slug = 'nvidia-hugging-face' and p.codigo = '13';

-- ── 14 · El regulador ──────────────────────────────────────────────────────

update public.preguntas p set
  nivel = 'Avanzado',
  enunciado = 'Un regulador no bloquea una compra por ser grande, sino por lo que puede cambiar en el mercado. En esta operación, ¿cuál es la preocupación concreta?',
  aviso = null,
  apoyo = null,
  nota = 'Comprador y comprada no compiten entre sí: están en escalones distintos de la misma cadena. Ahí el daño que se teme no es que desaparezca un competidor, sino que el dueño de un escalón use ese control para estorbar a los rivales del otro. Es la razón por la que la compra de Mellanox pasó en 2020 y la de Arm no pasó en 2022. Lo que cambia no es el tamaño de la operación, sino qué tan central es lo comprado para los competidores del comprador.',
  datos = '{"opciones":[
    {"texto":"Que NVIDIA suba el precio de las suscripciones de pago de Hugging Face.","correcta":false},
    {"texto":"Que después de la compra queden menos empresas publicando modelos abiertos.","correcta":false},
    {"texto":"Que el dueño de los chips, siendo dueño del sitio por donde pasan todos los modelos, lo incline hacia sus propios chips y en contra de AMD, de Intel y de los que Google y Amazon fabrican para sí mismos.","correcta":true},
    {"texto":"Que NVIDIA concentre demasiados ingenieros de IA en un solo país.","correcta":false}
  ]}'::jsonb
  from public.clases c
 where c.id = p.clase_id and c.slug = 'nvidia-hugging-face' and p.codigo = '14';

-- ── La bajada del landing, con lo que la clase ahora enseña ────────────────

update public.clases set
  bajada = '14 láminas y 14 preguntas sobre las compras de NVIDIA. Empieza por lo básico, qué es una GPU y qué son los pesos de un modelo, y llega hasta el goodwill y el regulador, pasando por quién fundó cada una de las tres empresas.'
 where slug = 'nvidia-hugging-face';
