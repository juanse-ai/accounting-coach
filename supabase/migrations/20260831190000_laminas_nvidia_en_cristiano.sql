-- Las catorce láminas de «NVIDIA · Hugging Face», escritas en cristiano.
--
-- La baraja estaba bien pensada y mal dicha. Tres problemas, uno por uno:
--
-- 1. Se referenciaba a sí misma. La lámina 4 terminaba en «ahí empieza el
--    problema de la lámina 11», que a quien está mirando la 4 no le dice nada:
--    ni sabe qué hay en la 11 ni puede ir a verlo. Ahora la 4 dice cuál es el
--    problema. Lo mismo con «el sobrante tiene nombre, y es la lámina
--    siguiente» (8) y con «da para media clase» (1).
--
-- 2. Usaba palabras que la clase todavía no había explicado: sinergia,
--    dilución, ARR, valor razonable, vesting, múltiplo, hyperscalers, la pila.
--    Cada término técnico se queda, pero explicado ahí mismo y en la frase
--    donde aparece por primera vez: «reparte la empresa entre más dueños»,
--    «lo que valdría vendida aparte», «las acciones que el equipo todavía
--    estaba ganándose se le entregan de golpe».
--
-- 3. Comprimía tanto que perdía el sentido. «Creció más rápido el denominador»
--    es correcto y no se entiende; «los ingresos crecieron más rápido que el
--    precio» dice lo mismo y sí. La lámina del múltiplo pasa de `balance` a
--    `tabla` por eso: la tabla puede poner precio, ingresos y la división en
--    tres renglones rotulados, y el balance escribía «Total» delante de un
--    número de veces, que no es un total de nada.
--
-- Los datos no se tocan: mismo precio, misma ronda, mismas fechas, mismas
-- fuentes. Cambia cómo se cuentan. La portada recupera el pie con la fuente y
-- la fecha del reporte, que se había perdido en una edición anterior.

update public.laminas l set
  titulo = '[{"t":"NVIDIA compra "},{"t":"Hugging Face","acento":true}]'::jsonb,
  cuerpo = '[
    {"tipo":"p","texto":"USD 12.900 millones por Hugging Face. Lo reportó la prensa en agosto de 2026 y todavía no hay acuerdo firmado."},
    {"tipo":"p","texto":"Sería la empresa más grande que NVIDIA compra entera. No el cheque más grande: por Groq pagó unos USD 20.000 millones, pero ahí no compró la empresa. Esa diferencia cambia todo lo demás."}
  ]'::jsonb,
  visual = 'marcas',
  datos = '{
    "items":[
      {"src":"https://upload.wikimedia.org/wikipedia/commons/2/21/Nvidia_logo.svg","alt":"Logotipo de NVIDIA."},
      {"src":"https://upload.wikimedia.org/wikipedia/commons/d/d6/Hf-logo-with-title.svg","alt":"Logo de Hugging Face: la cara amarilla que abraza, junto al nombre.","escala":1.4}
    ],
    "separador":"×",
    "pie":"Reportado por The Information y Business Insider el 26 y 27 de agosto de 2026."
  }'::jsonb
  from public.clases c
 where c.id = l.clase_id and c.slug = 'nvidia-hugging-face' and l.orden = 1;

update public.laminas l set
  titulo = '[{"t":"Qué es "},{"t":"Hugging Face","acento":true}]'::jsonb,
  cuerpo = '[
    {"tipo":"p","texto":"Es el sitio donde se publican y se descargan los modelos de inteligencia artificial abiertos, los que cualquiera puede bajar y usar sin pagar licencia. Hay más de tres millones."},
    {"tipo":"lista","items":["Modelos listos para usar","Datos para entrenarlos","Librerías para conectarlos a un programa","La comunidad que los mantiene"]},
    {"tipo":"p","texto":"Casi no cobra por nada de eso. Su valor está en otra parte: casi todo el que trabaja con IA abierta entra por ahí."}
  ]'::jsonb
  from public.clases c
 where c.id = l.clase_id and c.slug = 'nvidia-hugging-face' and l.orden = 2;

update public.laminas l set
  titulo = '[{"t":"Por qué uno paga "},{"t":"más que otro","acento":true}]'::jsonb,
  cuerpo = '[
    {"tipo":"p","texto":"Nadie vende por menos de lo que la empresa vale para él, ni compra por más de lo que le sirve. Entre esos dos números hay un espacio, y el precio decide cómo se reparte."},
    {"tipo":"p","texto":"Un fondo de inversión solo puede contar lo que la empresa gana por su cuenta. NVIDIA suma además lo que esa empresa le hace ganar a su negocio de chips. Ese extra se llama sinergia, y por eso puede pagar más por exactamente lo mismo."}
  ]'::jsonb,
  visual = 'bloqueT',
  datos = '{
    "nombre":"Lo que está en juego",
    "lados":[{"rotulo":"Se lo lleva el comprador"},{"rotulo":"Se lo lleva el vendedor"}],
    "pie":"Lo reparte el precio"
  }'::jsonb
  from public.clases c
 where c.id = l.clase_id and c.slug = 'nvidia-hugging-face' and l.orden = 3;

update public.laminas l set
  titulo = '[{"t":"Ya era "},{"t":"socio","acento":true},{"t":", ahora sería dueño"}]'::jsonb,
  cuerpo = '[
    {"tipo":"p","texto":"En agosto de 2023 Hugging Face levantó USD 235 millones y ese dinero entró a su caja. Los USD 4.500 millones de valoración no entraron a ninguna parte: son lo que habría costado comprar la empresa entera a ese mismo precio."},
    {"tipo":"p","texto":"Entraron ocho inversionistas que compiten entre sí y ninguno quedó con el control. Así el sitio seguía siendo de todos y de nadie. Que un solo fabricante de chips lo compre entero es lo contrario, y por ahí es por donde va a mirar el regulador."}
  ]'::jsonb
  from public.clases c
 where c.id = l.clase_id and c.slug = 'nvidia-hugging-face' and l.orden = 4;

update public.laminas l set
  titulo = '[{"t":"Qué es un "},{"t":"múltiplo","acento":true}]'::jsonb,
  cuerpo = '[
    {"tipo":"p","texto":"Un múltiplo es el precio dividido entre lo que la empresa factura en un año. Dice cuántos años de ingresos cuesta, y sirve para comparar empresas de tamaños distintos. Un precio suelto no sirve para eso."},
    {"tipo":"p","texto":"De 2023 a 2026 el precio casi se triplicó y el múltiplo bajó. No es contradicción: los ingresos crecieron más rápido que el precio."}
  ]'::jsonb,
  visual = 'tabla',
  datos = '{
    "columnas":[{"rotulo":""},{"rotulo":"2023 · La ronda"},{"rotulo":"2026 · La compra"}],
    "filas":[
      {"celdas":[{"texto":"Precio de la empresa"},{"texto":"USD 4.500 M"},{"texto":"USD 12.900 M","tono":"ciruela","flecha":"arriba"}]},
      {"celdas":[{"texto":"Ingresos del año"},{"texto":"No divulgados"},{"texto":"~USD 150 M"}]},
      {"celdas":[{"texto":"Precio dividido entre ingresos"},{"texto":"Más de 100 veces"},{"texto":"Unas 86 veces","tono":"info","flecha":"abajo"}]}
    ]
  }'::jsonb
  from public.clases c
 where c.id = l.clase_id and c.slug = 'nvidia-hugging-face' and l.orden = 5;

update public.laminas l set
  titulo = '[{"t":"Cuánto se paga y "},{"t":"con qué","acento":true}]'::jsonb,
  cuerpo = '[
    {"tipo":"p","texto":"Cuánto se paga y con qué se paga son dos acuerdos distintos. Aquí no se divulgó el segundo, pero las formas de pagar son siempre las mismas tres."},
    {"tipo":"fichas","leyenda":"para el vendedor es","items":[
      {"texto":"Efectivo","ficha":"Seguro","tono":"info"},
      {"texto":"Acciones","ficha":"Sube o baja","tono":"ciruela"},
      {"texto":"Earnout","ficha":"Solo si se cumple","tono":"neutro"}
    ]},
    {"tipo":"p","texto":"El efectivo cierra la cifra de una vez y vacía la caja. Pagar con acciones propias reparte la empresa entre más dueños y deja al vendedor expuesto a que esa acción baje. Las compras grandes mezclan."}
  ]'::jsonb,
  visual = 'tabla',
  datos = '{
    "columnas":[{"rotulo":"Forma de pago"},{"rotulo":"Riesgo del vendedor","sentido":"arriba"},{"rotulo":"Costo del comprador","sentido":"abajo"}],
    "filas":[
      {"celdas":[{"texto":"Efectivo"},{"texto":"Ninguno","tono":"info"},{"texto":"Se va la caja","tono":"ciruela"}]},
      {"celdas":[{"texto":"Acciones"},{"texto":"Que la acción baje","tono":"ciruela"},{"texto":"Más dueños","tono":"ciruela"}]},
      {"celdas":[{"texto":"Earnout"},{"texto":"Que no se cumpla","tono":"ciruela"},{"texto":"Paga solo si pasa","tono":"info"}]}
    ]
  }'::jsonb
  from public.clases c
 where c.id = l.clase_id and c.slug = 'nvidia-hugging-face' and l.orden = 6;

update public.laminas l set
  titulo = '[{"t":"Earnout y "},{"t":"escrow","acento":true}]'::jsonb,
  cuerpo = '[
    {"tipo":"p","texto":"Un earnout es una parte del precio que solo se paga si el negocio cumple ciertas metas después de la compra. Sirve cuando comprador y vendedor no se ponen de acuerdo en cuánto va a crecer: así ninguno tiene que aceptar el número del otro."},
    {"tipo":"p","texto":"Un escrow es otra parte que queda guardada en un banco unos meses y se libera solo si lo que el vendedor declaró resulta cierto. Cubre las sorpresas: un pleito que no contó, una licencia mal cedida."}
  ]'::jsonb,
  visual = 'flujo',
  datos = '{"nodos":[{"texto":"Se firma"},{"texto":"Se cierra y se paga"},{"texto":"Escrow · meses"},{"texto":"Earnout · años"}]}'::jsonb
  from public.clases c
 where c.id = l.clase_id and c.slug = 'nvidia-hugging-face' and l.orden = 7;

update public.laminas l set
  titulo = '[{"t":"Al cerrar hay que "},{"t":"repartir el precio","acento":true}]'::jsonb,
  cuerpo = '[
    {"tipo":"p","texto":"Cuando la compra se cierra, el comprador tiene que anotar en su contabilidad qué compró exactamente. Reparte el precio entre todo lo que se puede identificar por separado, y a cada cosa le pone lo que valdría vendida aparte: caja, tecnología, marca, contratos."},
    {"tipo":"p","texto":"Nunca alcanza. La suma de esas partes queda siempre por debajo de lo pagado, y ese sobrante también hay que anotarlo. Las cifras del reparto son de ejemplo; el precio es el reportado."}
  ]'::jsonb,
  visual = 'balance',
  datos = '{
    "signo":"=",
    "sello":"Ni un dólar del precio puede quedar sin asignar",
    "columnas":[
      {"rotulo":"Lo que se paga","filas":[{"cuenta":"Precio de compra","monto":"USD 12.900 M"}],"total":"USD 12.900 M"},
      {"rotulo":"Lo que se identifica","filas":[{"cuenta":"Identificable","monto":"USD 3.100 M"},{"cuenta":"Sobrante","monto":"USD 9.800 M"}],"total":"USD 12.900 M"}
    ]
  }'::jsonb
  from public.clases c
 where c.id = l.clase_id and c.slug = 'nvidia-hugging-face' and l.orden = 8;

update public.laminas l set
  titulo = '[{"t":"El sobrante se llama "},{"t":"goodwill","acento":true}]'::jsonb,
  cuerpo = '[
    {"tipo":"p","texto":"El goodwill no se calcula: es lo que queda después de repartir el precio entre todo lo demás. Es lo que se compró sin poder separarlo, como el equipo ya armado y funcionando o las ventajas de juntar los dos negocios."},
    {"tipo":"p","texto":"No se va descontando año a año como una máquina. Se revisa: si el negocio comprado deja de valer lo que se pagó, la pérdida entra entera al resultado de ese año. Por eso el goodwill termina siendo la nota de si la compra salió bien."}
  ]'::jsonb,
  visual = 'partido',
  datos = '{"mitades":[{"rotulo":"Se puede separar"},{"rotulo":"No se puede: goodwill"}],"reglas":true}'::jsonb
  from public.clases c
 where c.id = l.clase_id and c.slug = 'nvidia-hugging-face' and l.orden = 9;

update public.laminas l set
  titulo = '[{"t":"Lo que compras "},{"t":"se puede ir","acento":true}]'::jsonb,
  cuerpo = '[
    {"tipo":"p","texto":"Buena parte de lo que se paga son las personas. Y al cerrar la compra, las acciones que el equipo todavía estaba ganándose se le entregan de golpe: cobran justo cuando más falta hace que se queden."},
    {"tipo":"fichas","leyenda":"es un","items":[
      {"texto":"Cobran al cerrar","ficha":"Riesgo","tono":"ciruela"},
      {"texto":"Bono por quedarse","ficha":"Remedio","tono":"info"},
      {"texto":"Bono por resultados","ficha":"Remedio","tono":"neutro"}
    ]},
    {"tipo":"p","texto":"Por eso una parte del precio se vuelve a atar al futuro: se paga si la persona sigue ahí o si el negocio cumple. En un sitio abierto también se puede ir la comunidad, que no firmó nada."}
  ]'::jsonb,
  visual = 'tabla',
  datos = '{
    "columnas":[{"rotulo":"Riesgo"},{"rotulo":"Cuándo aparece","sentido":"arriba"},{"rotulo":"Con qué se ataja","sentido":"abajo"}],
    "filas":[
      {"celdas":[{"texto":"Se va el equipo"},{"texto":"Al cerrar","tono":"ciruela"},{"texto":"Pago por quedarse","tono":"info"}]},
      {"celdas":[{"texto":"Se va la comunidad"},{"texto":"Al anunciarse","tono":"ciruela"},{"texto":"Promesas públicas","tono":"info"}]},
      {"celdas":[{"texto":"Choque de culturas"},{"texto":"Meses después","tono":"ciruela"},{"texto":"Dejarlos operar solos","tono":"info"}]}
    ]
  }'::jsonb
  from public.clases c
 where c.id = l.clase_id and c.slug = 'nvidia-hugging-face' and l.orden = 10;

update public.laminas l set
  titulo = '[{"t":"Lo que mira el "},{"t":"regulador","acento":true}]'::jsonb,
  cuerpo = '[
    {"tipo":"p","texto":"Al regulador no le importa el tamaño de la compra. Le importa si el dueño del sitio por donde pasan todos los modelos podría empujarlos hacia sus propios chips, y dejar en desventaja a AMD, a Intel y a los chips que Google y Amazon fabrican para sí mismos."},
    {"tipo":"p","texto":"En 2022 NVIDIA intentó comprar Arm y tuvo que abandonar por esa misma razón. Por Groq pagó más que por Hugging Face y nadie la revisó: no compró la empresa, licenció su tecnología y contrató a su gente."}
  ]'::jsonb,
  visual = 'marcas',
  datos = '{
    "items":[
      {"src":"https://upload.wikimedia.org/wikipedia/commons/d/d7/Logotipo_Mellanox_Technologies.png","alt":"Logo de Mellanox Technologies.","pie":"2020 · USD 6.900 M · comprada y cerrada"},
      {"src":"https://upload.wikimedia.org/wikipedia/commons/7/77/Arm_logo_2017.svg","alt":"Logo de Arm.","pie":"2022 · USD 40.000 M · abandonada"},
      {"src":"https://upload.wikimedia.org/wikipedia/commons/c/cc/Groq_logo.svg","alt":"Logotipo de Groq.","pie":"2025 · USD 20.000 M · licencia, sin revisión"},
      {"src":"https://upload.wikimedia.org/wikipedia/commons/d/d6/Hf-logo-with-title.svg","alt":"Logo de Hugging Face: la cara amarilla que abraza, junto al nombre.","pie":"2026 · USD 12.900 M · compra, a revisión","escala":1.4}
    ],
    "pie":"Lo que decide si hay revisión no es el precio, sino cómo se arma la operación."
  }'::jsonb
  from public.clases c
 where c.id = l.clase_id and c.slug = 'nvidia-hugging-face' and l.orden = 11;

update public.laminas l set
  titulo = '[{"t":"El chip que "},{"t":"sí competía","acento":true}]'::jsonb,
  cuerpo = '[
    {"tipo":"p","texto":"Entrenar un modelo y usarlo son dos trabajos distintos. Usarlo, que es lo que pasa cada vez que alguien escribe una pregunta, se llama inferencia. Ahí NVIDIA no manda tanto."},
    {"tipo":"p","texto":"Groq hace chips solo para eso: responder rápido y tardar siempre lo mismo, que en un servicio en vivo importa tanto como la velocidad. Lo fundó Jonathan Ross, el mismo que en Google arrancó la TPU, el chip con el que Google dejó de depender de NVIDIA."}
  ]'::jsonb,
  imagen = '{
    "src":"https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/LPU-v1-die.jpg/960px-LPU-v1-die.jpg",
    "alt":"Fotografía del interior de un chip de Groq: la retícula de circuitos vista muy de cerca.",
    "encuadre":"cubrir",
    "credito":"Die del LPU · Avivweinstein · CC BY-SA 4.0"
  }'::jsonb
  from public.clases c
 where c.id = l.clase_id and c.slug = 'nvidia-hugging-face' and l.orden = 12;

update public.laminas l set
  titulo = '[{"t":"Dos compras, "},{"t":"dos problemas","acento":true}]'::jsonb,
  cuerpo = '[
    {"tipo":"p","texto":"Groq era una amenaza: hacía chips que competían justo donde NVIDIA es más débil. Hugging Face no compite con nada suyo, pero es la puerta por donde entra todo el mundo, y quien controla esa puerta influye en qué chips se usan."},
    {"tipo":"p","texto":"Sacarse un rival de encima y quedarse con la puerta no se pagan igual, ni se firman igual, ni los mira el mismo regulador."}
  ]'::jsonb,
  visual = 'tabla',
  datos = '{
    "columnas":[{"rotulo":""},{"rotulo":"Groq"},{"rotulo":"Hugging Face"}],
    "filas":[
      {"celdas":[{"texto":"Qué se lleva"},{"texto":"Un competidor","tono":"ciruela"},{"texto":"La puerta de entrada","tono":"info"}]},
      {"celdas":[{"texto":"Cómo se hizo"},{"texto":"Licencia y contratos","tono":"ciruela"},{"texto":"Compra de la empresa","tono":"info"}]},
      {"celdas":[{"texto":"Cuánto costó"},{"texto":"USD 20.000 M"},{"texto":"USD 12.900 M"}]},
      {"celdas":[{"texto":"El regulador"},{"texto":"No la revisó","tono":"ciruela"},{"texto":"La va a revisar","tono":"info"}]},
      {"celdas":[{"texto":"En qué va"},{"texto":"Cerrada en 2025"},{"texto":"Solo reportada"}]}
    ]
  }'::jsonb
  from public.clases c
 where c.id = l.clase_id and c.slug = 'nvidia-hugging-face' and l.orden = 13;

update public.laminas l set
  titulo = '[{"t":"No compra empresas: compra el "},{"t":"camino entero","acento":true}]'::jsonb,
  cuerpo = '[
    {"tipo":"p","texto":"Redes, reparto del trabajo entre máquinas, nube, inferencia y ahora distribución. Ninguna de esas compras le suma ingresos comparables a lo que NVIDIA factura vendiendo chips."},
    {"tipo":"p","texto":"Lo que compra es otra cosa: que entre un programador y su chip no quede nada que sea de alguien más. Esa es la apuesta, y es exactamente lo que el regulador termina mirando."}
  ]'::jsonb,
  visual = 'tabla',
  datos = '{
    "columnas":[{"rotulo":"Qué hace falta"},{"rotulo":"Con qué compra lo tapó"}],
    "filas":[
      {"celdas":[{"texto":"Conectar las máquinas"},{"texto":"Mellanox · 2020","tono":"info"}]},
      {"celdas":[{"texto":"Procesadores"},{"texto":"Arm · 2022, abandonada","tono":"ciruela"}]},
      {"celdas":[{"texto":"Repartir el trabajo"},{"texto":"Run:ai · 2024","tono":"info"}]},
      {"celdas":[{"texto":"Alquilar cómputo"},{"texto":"Lepton AI · 2025","tono":"info"}]},
      {"celdas":[{"texto":"Hacer correr los modelos"},{"texto":"Groq · 2025","tono":"info"}]},
      {"celdas":[{"texto":"Repartir los modelos"},{"texto":"Hugging Face · 2026","tono":"neutro"}]}
    ]
  }'::jsonb
  from public.clases c
 where c.id = l.clase_id and c.slug = 'nvidia-hugging-face' and l.orden = 14;
