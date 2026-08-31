-- Diez preguntas de evaluación sobre rondas de inversión.
--
-- Hasta aquí el quiz preguntaba conceptos y se respondían leyendo. Estas se
-- responden haciendo la cuenta, que es lo que hay que saber hacer cuando a uno
-- le ponen un term sheet delante:
--
--   15  Qué significa que alguien «lidere» una ronda
--   16  Pre-money y post-money: cuál es cuál con las cifras de la Serie D
--   17  Qué porcentaje se llevaron los nuevos, con el error clásico de distractor
--   18  «10 millones a una valoración de 40», sin decir si es pre o post
--   19  El paquete de acciones para empleados y de qué bolsillo sale
--   20  El deportista que puso 250.000 dólares en 2018
--   21  Por qué su retorno es 240x y no las mil y pico que creció la empresa
--   22  El derecho pro rata
--   23  La preferencia de liquidación cuando la venta sale mal
--   24  La ronda a la baja
--
-- La cuenta del 17 está pensada alrededor de su distractor: 235/4.265 da 5,5%
-- y es lo que sale cuando uno divide entre el pre-money en vez del post. Es el
-- error que de verdad se comete, así que es la opción que tiene que estar.
--
-- La 20 va sin foto a propósito, aunque tres preguntas de esta clase sí la
-- llevan: con la cara delante, «¿cuál de estos cuatro deportistas?» se
-- responde sin leer la historia, que es lo único que la pregunta enseña.
--
-- Las cifras de Durant son estimaciones de prensa de agosto de 2026 y el
-- enunciado lo dice: el porcentaje que tiene nunca se publicó, así que los
-- USD 60 millones son un cálculo de terceros, no un dato.

with c as (select id from public.clases where slug = 'nvidia-hugging-face')
insert into public.preguntas (clase_id, codigo, orden, tipo, nivel, enunciado, aviso, nota, apoyo, datos)
select c.id, v.* from c, (values

('15', 15, 'opcion', 'Básico',
 'De la Serie D de Hugging Face se dice que Salesforce Ventures la «lideró». ¿Qué hace el que lidera una ronda?',
 null::text,
 'El líder pone la parte más grande del cheque y, a cambio, es el que negocia el precio y las condiciones. Los demás entran a lo ya pactado, que es justamente por lo que se les llama acompañantes: se ahorran la negociación y la revisión a fondo de la empresa. Por eso conseguir líder es la parte difícil de una ronda y el resto suele llenarse rápido. Liderar no es controlar: en la Serie D entraron ocho y ninguno quedó mandando.',
 null::jsonb,
 '{"opciones":[
   {"texto":"Es el inversionista que lleva más tiempo en la empresa y por eso encabeza la lista.","correcta":false},
   {"texto":"Pone la mayor parte del dinero y negocia el precio y las condiciones que los demás aceptan.","correcta":true},
   {"texto":"Es el que se queda con el control de la empresa después de la ronda.","correcta":false},
   {"texto":"Es el que consigue a los demás inversionistas, aunque él no ponga dinero.","correcta":false}
 ]}'::jsonb),

('16', 16, 'opcion', 'Básico',
 'En agosto de 2023 Hugging Face levantó USD 235 millones y quedó valorada en USD 4.500 millones después de la ronda. ¿Cuánto valía justo antes de que entrara ese dinero?',
 null::text,
 'USD 4.265 millones, que es la valoración pre-money: lo que vale la empresa antes de que entre la plata nueva. La post-money es la de después, y es la suma de las dos cosas: pre-money más lo levantado. La cifra que se publica casi siempre es la post-money, porque es la más grande y la que suena mejor en el titular. Cuando alguien dice solo «una valoración de 4.500», hay que preguntar cuál de las dos es, porque cambia quién se queda con qué.',
 null::jsonb,
 '{"opciones":[
   {"texto":"USD 4.500 millones: la valoración es la misma antes y después.","correcta":false},
   {"texto":"USD 4.735 millones.","correcta":false},
   {"texto":"USD 4.265 millones.","correcta":true},
   {"texto":"USD 235 millones, que es lo que entró.","correcta":false}
 ]}'::jsonb),

('17', 17, 'opcion', 'Intermedio',
 'Con esas mismas cifras, USD 235 millones levantados y USD 4.500 millones de valoración después de la ronda, ¿con qué porcentaje de la empresa se quedaron los inversionistas que entraron en esa ronda?',
 null::text,
 'Con el 5,2%: lo que ponen dividido entre lo que vale la empresa ya con ese dinero adentro, o sea 235 entre 4.500. La división tiene que ir sobre la post-money, y la razón es fácil de ver: los 235 millones ya están dentro de la empresa el día que se firma, así que forman parte de lo que se está repartiendo. Dividir entre la pre-money da 5,5% y es el error más común de todos; parece un detalle de tres décimas, pero es la diferencia entre lo que el fundador cree que entregó y lo que entregó de verdad.',
 null::jsonb,
 '{"opciones":[
   {"texto":"Con el 5,5%, que es 235 dividido entre 4.265.","correcta":false},
   {"texto":"Con el 19,1%, porque 4.500 es diecinueve veces 235.","correcta":false},
   {"texto":"No se puede saber sin conocer cuántas acciones tenía la empresa.","correcta":false},
   {"texto":"Con el 5,2%, que es 235 dividido entre 4.500.","correcta":true}
 ]}'::jsonb),

('18', 18, 'opcion', 'Intermedio',
 'Un fundador y un inversionista acuerdan de palabra «USD 10 millones a una valoración de 40», y nadie dice si esos 40 son antes o después de la plata. ¿Qué hay en juego en esa palabra que falta?',
 null::text,
 'Si los 40 son pre-money, la empresa vale 50 con el dinero adentro y el inversionista se queda con 10 de 50, o sea el 20%. Si son post-money, se queda con 10 de 40, o sea el 25%. Cinco puntos de la empresa dependen de una palabra que nadie dijo, y en una empresa de 40 millones esos cinco puntos son dos millones. Por eso un term sheet nunca escribe «valoración» a secas, y por eso la primera pregunta ante cualquier cifra de valoración es cuál de las dos es.',
 null::jsonb,
 '{"opciones":[
   {"texto":"Que el inversionista se quede con el 20% de la empresa o con el 25%.","correcta":true},
   {"texto":"Nada de fondo: los dos números llevan al mismo reparto.","correcta":false},
   {"texto":"Solo cambia en qué orden se firman los documentos.","correcta":false},
   {"texto":"Cambia el impuesto que paga el fundador, no el reparto.","correcta":false}
 ]}'::jsonb),

('19', 19, 'opcion', 'Avanzado',
 'Antes de firmar, el inversionista pide crear un paquete de acciones para los empleados que la empresa contratará después, y pide que ese paquete salga de la valoración pre-money. ¿A quién le cuesta eso?',
 null::text,
 'A los fundadores y a quien ya era accionista. El paquete se crea con acciones nuevas, y meterlo en la pre-money significa que se emiten antes de que entre el dinero: para cuando el inversionista compra su porcentaje, la dilución del paquete ya ocurrió y solo la sufrieron los de antes. Si se creara después, en la post-money, la pagarían todos en proporción, el nuevo incluido. Es una de las negociaciones más silenciosas de una ronda, porque no cambia ni el precio ni el porcentaje que se anuncia: cambia de qué bolsillo sale el paquete.',
 null::jsonb,
 '{"opciones":[
   {"texto":"A los dos lados por igual, porque el paquete diluye a todo el mundo en proporción.","correcta":false},
   {"texto":"Al inversionista nuevo, que es quien lo está pidiendo.","correcta":false},
   {"texto":"A los fundadores y a los accionistas de antes, porque esas acciones se emiten antes de que entre el dinero nuevo.","correcta":true},
   {"texto":"A nadie: son acciones que todavía no se le han entregado a ningún empleado.","correcta":false}
 ]}'::jsonb),

('20', 20, 'opcion', 'Básico',
 'Un deportista profesional puso USD 100.000 en la ronda semilla de Hugging Face en 2018, cuando la empresa todavía era una aplicación de chat, y USD 150.000 más en la Serie A de 2019. Lo hizo a través del fondo que había cofundado en 2016. Con la compra reportada, la prensa calcula que esos USD 250.000 valdrían más de USD 60 millones. ¿Quién es?',
 null::text,
 'Kevin Durant, a través de Thirty Five Ventures, el fondo que montó en 2016 con su socio Rich Kleiman y que ya ha invertido en más de cien empresas. USD 250.000 convertidos en más de USD 60 millones son unas 240 veces lo que puso. Dos advertencias sobre esa cifra: es una estimación de prensa de agosto de 2026, porque el porcentaje que Durant tiene nunca se publicó, y solo se vuelve dinero de verdad si la compra se cierra. Lo interesante no es el número sino cuándo entró: en 2018, cuando lo que compró era una aplicación de chat para adolescentes que todavía no había inventado el negocio por el que hoy la compran.',
 null::jsonb,
 '{"opciones":[
   {"texto":"LeBron James.","correcta":false},
   {"texto":"Serena Williams.","correcta":false},
   {"texto":"Tom Brady.","correcta":false},
   {"texto":"Kevin Durant.","correcta":true}
 ]}'::jsonb),

('21', 21, 'opcion', 'Avanzado',
 'Ese deportista entró en una ronda semilla de USD 4 millones. La empresa hoy se compraría por USD 12.900 millones: multiplicó su valor muchísimo más de mil veces desde entonces. Y sin embargo el retorno que le calculan es de unas 240 veces. ¿Por qué su retorno es tanto menor que lo que creció la empresa?',
 null::text,
 'Porque entre 2018 y hoy la empresa emitió acciones nuevas en cada ronda, y cada emisión le bajó el porcentaje. Lo que un inversionista se lleva no lo decide cuánto creció la empresa, sino qué porcentaje de ella le quedó al final, y ese porcentaje solo baja salvo que ponga dinero nuevo en cada ronda para sostenerlo. De ahí sale la aritmética que gobierna todo el capital de riesgo: entrar temprano y barato es la mitad del asunto, y la otra mitad es cuánto te diluyes por el camino.',
 null::jsonb,
 '{"opciones":[
   {"texto":"Porque el retorno se calcula sobre la valoración pre-money y no sobre el precio de compra.","correcta":false},
   {"texto":"Porque en cada ronda posterior se emitieron acciones nuevas y su porcentaje de la empresa fue bajando.","correcta":true},
   {"texto":"Porque los impuestos sobre la ganancia ya vienen descontados de esa cifra.","correcta":false},
   {"texto":"Porque vendió la mayor parte de su participación en las rondas siguientes.","correcta":false}
 ]}'::jsonb),

('22', 22, 'opcion', 'Intermedio',
 'Un inversionista de la ronda semilla no quiere que su porcentaje baje cuando entren las rondas siguientes. ¿Qué derecho negocia, y qué le exige a él?',
 null::text,
 'El derecho pro rata: la opción, no la obligación, de poner dinero en cada ronda futura para mantener el porcentaje que tiene. Y ahí está la trampa: es un derecho a seguir pagando. Sostener el 5% de una empresa que levanta 235 millones cuesta casi 12 millones, así que casi todos los inversionistas pequeños lo dejan pasar en algún momento y se diluyen. No hay que confundirlo con la protección antidilución, que no cubre las rondas al alza sino solo el caso de que la empresa levante más barato que antes.',
 null::jsonb,
 '{"opciones":[
   {"texto":"El derecho pro rata: puede poner dinero nuevo en cada ronda para sostener su porcentaje, pero tiene que ponerlo.","correcta":true},
   {"texto":"El derecho de veto: puede bloquear cualquier ronda que lo diluya.","correcta":false},
   {"texto":"La preferencia de liquidación: cobra primero cuando la empresa se venda.","correcta":false},
   {"texto":"La protección antidilución: la empresa le regala acciones cada vez que emite.","correcta":false}
 ]}'::jsonb),

('23', 23, 'opcion', 'Avanzado',
 'Una empresa levantó USD 200 millones con preferencia de liquidación de una vez, y termina vendiéndose por USD 150 millones. Los fundadores conservaban en el papel el 60% de las acciones. ¿Cuánto les toca?',
 null::text,
 'Nada. La preferencia de liquidación dice que los inversionistas cobran su dinero antes que nadie, y en una venta de 150 no alcanza ni para devolverles los 200 que pusieron: se llevan los 150 completos y no queda resto que repartir. El 60% de los fundadores era el 60% de lo que sobrara, y no sobró. Por eso una valoración alta con mucho dinero levantado encima no es una buena noticia sin más: sube el piso que hay que superar para que las acciones comunes valgan algo, y una venta que parece un éxito puede dejar a los fundadores en cero.',
 null::jsonb,
 '{"opciones":[
   {"texto":"USD 90 millones, que es el 60% de los 150.","correcta":false},
   {"texto":"USD 50 millones, la diferencia entre lo levantado y el precio de venta.","correcta":false},
   {"texto":"Nada: los USD 150 millones no alcanzan a cubrir los USD 200 millones que los inversionistas cobran primero.","correcta":true},
   {"texto":"Cobran primero ellos por ser fundadores, y el resto va a los inversionistas.","correcta":false}
 ]}'::jsonb),

('24', 24, 'opcion', 'Avanzado',
 'Una empresa valorada en USD 1.000 millones necesita plata y no consigue levantarla sino a USD 400 millones. ¿Por qué esa ronda hace más daño que el simple hecho de valer menos?',
 null::text,
 'Porque al valer menos, la misma plata compra muchas más acciones, y todos los que ya estaban adentro se diluyen mucho más de lo que se habrían diluido al precio anterior. Encima suele disparar las cláusulas antidilución de los inversionistas de rondas previas, que reciben acciones adicionales para compensar el precio caído: esa compensación no sale del aire, sale de diluir todavía más a los fundadores y a los empleados. Y las opciones del equipo, firmadas al precio viejo, quedan sin valor. Por eso muchas empresas prefieren levantar deuda o recortar gastos antes que hacer una ronda a la baja.',
 null::jsonb,
 '{"opciones":[
   {"texto":"Porque una valoración menor obliga a devolverles la diferencia a los inversionistas anteriores en efectivo.","correcta":false},
   {"texto":"Porque la empresa tiene que registrar la caída de valor como una pérdida en su estado de resultados.","correcta":false},
   {"texto":"Porque a partir de ese momento la empresa no puede volver a levantar capital.","correcta":false},
   {"texto":"Porque la misma plata compra más acciones, así que todos los de antes se diluyen mucho más, y encima se activan las cláusulas antidilución que los diluyen otra vez.","correcta":true}
 ]}'::jsonb)

) as v(codigo, orden, tipo, nivel, enunciado, aviso, nota, apoyo, datos);

update public.clases set
  bajada = '11 láminas y 24 preguntas sobre las compras de NVIDIA y sobre cómo funciona una ronda de inversión. Desde qué es una GPU hasta pre-money contra post-money, cuánto se diluye un fundador, preferencia de liquidación y riesgo regulatorio.'
 where slug = 'nvidia-hugging-face';
