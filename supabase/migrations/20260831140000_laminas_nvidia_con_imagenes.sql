-- Las láminas de «NVIDIA · Hugging Face», más cortas y con imágenes.
--
-- La baraja decía bien las cosas pero las decía largo: tres párrafos donde
-- bastaban dos, y cero imágenes en doce láminas. Se recorta el texto sin
-- soltar ni un dato ni el análisis, y lo que se puede enseñar en vez de
-- contar pasa al visual: las marcas de la operación, los ocho inversionistas
-- de la ronda, el historial antimonopolio de NVIDIA con su desenlace al pie.
--
-- Las imágenes se enlazan, no se descargan: Wikimedia Commons para los
-- logos y la foto de la GPU. Si alguna deja de responder, el componente
-- pinta su texto alternativo y la lámina sigue diciendo lo mismo.

update public.laminas l set
  etiqueta = 'El hecho · agosto 2026',
  titulo = '[{"t":"NVIDIA compra "},{"t":"Hugging Face","acento":true}]'::jsonb,
  cuerpo = '[{"tipo":"p","texto":"USD 12.900 millones. Sería la mayor adquisición de su historia: casi el doble de Mellanox, su récord anterior."},{"tipo":"p","texto":"Reportado, no firmado. Y así se analiza casi toda operación de M&A — antes de que exista del todo."}]'::jsonb,
  visual = 'marcas',
  datos = '{"items":[{"src":"https://yt3.googleusercontent.com/btm1_PK-7VRUr9GY2D0UV_2XfbUZPBjghyptjSO1crsfN86HyTYDWPmUbq7JxC3H0Lxe_s067nA=s900-c-k-c0x00ffffff-no-rj","alt":"Logo de NVIDIA: el ojo estilizado en verde sobre fondo blanco."},{"src":"https://upload.wikimedia.org/wikipedia/commons/d/d6/Hf-logo-with-title.svg","alt":"Logo de Hugging Face: la cara amarilla que abraza, junto al nombre."}],"separador":"×","pie":"Reportado el 26 y 27 de agosto de 2026 por The Information y Business Insider."}'::jsonb,
  imagen = null::jsonb
  from public.clases c
 where c.id = l.clase_id and c.slug = 'nvidia-hugging-face' and l.orden = 1;

update public.laminas l set
  etiqueta = 'Qué se compra',
  titulo = '[{"t":"El "},{"t":"GitHub de la IA","acento":true}]'::jsonb,
  cuerpo = '[{"tipo":"p","texto":"NVIDIA vende el cómputo. Hugging Face es la plaza donde se publica y se descarga lo que corre encima."},{"tipo":"lista","items":["Los pesos de los modelos abiertos","Los datasets de entrenamiento","Las librerías que los usan","La comunidad que lo mantiene vivo"]},{"tipo":"p","texto":"No hay activo que tocar ni contrato que ceder: lo que se compra es por dónde pasa la gente."}]'::jsonb,
  visual = null::text,
  datos = '{}'::jsonb,
  imagen = '{"src":"https://upload.wikimedia.org/wikipedia/commons/b/b9/MSI_GeForce_RTX_3070_VENTUS_3X_OC.jpg","alt":"Una tarjeta gráfica NVIDIA GeForce RTX con tres ventiladores, vista de frente.","encuadre":"cubrir"}'::jsonb
  from public.clases c
 where c.id = l.clase_id and c.slug = 'nvidia-hugging-face' and l.orden = 2;

update public.laminas l set
  etiqueta = 'Fundamento',
  titulo = '[{"t":"Un precio parte un "},{"t":"excedente","acento":true}]'::jsonb,
  cuerpo = '[{"tipo":"p","texto":"Una compra solo ocurre si la empresa vale más para el comprador que para el vendedor. Esa diferencia es el excedente, y el precio decide cómo se reparte."},{"tipo":"p","texto":"Un fondo solo cuenta lo que la empresa rinde sola: su techo es bajo. Un estratégico suma lo que le hace a su propio negocio —la sinergia— y por eso paga más por exactamente lo mismo."}]'::jsonb,
  visual = 'bloqueT',
  datos = '{"nombre":"Excedente del trato","lados":[{"rotulo":"Se queda el comprador"},{"rotulo":"Se queda el vendedor"}],"pie":"Precio"}'::jsonb,
  imagen = null::jsonb
  from public.clases c
 where c.id = l.clase_id and c.slug = 'nvidia-hugging-face' and l.orden = 3;

update public.laminas l set
  etiqueta = 'Startup · financiación',
  titulo = '[{"t":"Ya era "},{"t":"socio","acento":true},{"t":", ahora sería dueño"}]'::jsonb,
  cuerpo = '[{"tipo":"p","texto":"Serie D, agosto de 2023: USD 235 millones que entraron a la caja, a una valoración de USD 4.500 millones por la empresa entera. Una valoración es un precio implícito, no un saldo."},{"tipo":"p","texto":"Media industria del silicio adentro y nadie con control: esa ronda compró neutralidad. Comprar la empresa entera es lo contrario — y ahí empieza el problema de la lámina 11."}]'::jsonb,
  visual = 'marcas',
  datos = '{"items":[{"src":"https://upload.wikimedia.org/wikipedia/commons/f/f9/Salesforce.com_logo.svg","alt":"Logo de Salesforce."},{"src":"https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg","alt":"Logo de Google."},{"src":"https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg","alt":"Logo de Amazon."},{"src":"https://yt3.googleusercontent.com/btm1_PK-7VRUr9GY2D0UV_2XfbUZPBjghyptjSO1crsfN86HyTYDWPmUbq7JxC3H0Lxe_s067nA=s900-c-k-c0x00ffffff-no-rj","alt":"Logo de NVIDIA: el ojo estilizado en verde sobre fondo blanco."},{"src":"https://upload.wikimedia.org/wikipedia/commons/6/6a/Intel_logo_%282020%2C_dark_blue%29.svg","alt":"Logo de Intel."},{"src":"https://upload.wikimedia.org/wikipedia/commons/7/7c/AMD_Logo.svg","alt":"Logo de AMD."},{"src":"https://upload.wikimedia.org/wikipedia/commons/f/fc/Qualcomm-Logo.svg","alt":"Logo de Qualcomm."},{"src":"https://upload.wikimedia.org/wikipedia/commons/5/51/IBM_logo.svg","alt":"Logo de IBM."}],"pie":"Serie D · agosto de 2023 · USD 235 M · liderada por Salesforce Ventures"}'::jsonb,
  imagen = null::jsonb
  from public.clases c
 where c.id = l.clase_id and c.slug = 'nvidia-hugging-face' and l.orden = 4;

update public.laminas l set
  etiqueta = 'Valoración',
  titulo = '[{"t":"Un múltiplo, "},{"t":"no un precio","acento":true}]'::jsonb,
  cuerpo = '[{"tipo":"p","texto":"Un múltiplo dice cuántas veces el ingreso anual vale la empresa. Sirve para comparar; un precio suelto, no."},{"tipo":"p","texto":"El precio casi se triplicó y el múltiplo bajó. No es contradicción: creció más rápido el denominador. Más cara en dólares, más barata en múltiplos."}]'::jsonb,
  visual = 'balance',
  datos = '{"columnas":[{"rotulo":"2023 · Serie D","filas":[{"cuenta":"Valoración","monto":"USD 4.500 M"},{"cuenta":"Múltiplo","monto":">100×"}],"total":">100×"},{"rotulo":"2026 · Compra","filas":[{"cuenta":"Precio","monto":"USD 12.900 M"},{"cuenta":"ARR estimado","monto":"USD 150 M"}],"total":"~86×"}],"signo":"≠","sello":"Sube el precio, baja el múltiplo"}'::jsonb,
  imagen = null::jsonb
  from public.clases c
 where c.id = l.clase_id and c.slug = 'nvidia-hugging-face' and l.orden = 5;

update public.laminas l set
  etiqueta = 'M&A avanzado · estructura',
  titulo = '[{"t":"Cuánto se paga y "},{"t":"con qué","acento":true}]'::jsonb,
  cuerpo = '[{"tipo":"p","texto":"La estructura no se divulgó. El «cuánto» y el «con qué» son dos negociaciones distintas."},{"tipo":"fichas","leyenda":"lo vuelve","items":[{"texto":"Efectivo","ficha":"Cierto hoy","tono":"info"},{"texto":"Acciones","ficha":"Atado al comprador","tono":"ciruela"},{"texto":"Earnout","ficha":"Atado al resultado","tono":"neutro"}]},{"tipo":"p","texto":"Las acciones diluyen al comprador y le pasan al vendedor el riesgo del precio. El efectivo cierra la cifra pero consume caja. Las operaciones grandes mezclan."}]'::jsonb,
  visual = 'tabla',
  datos = '{"columnas":[{"rotulo":"Forma de pago"},{"rotulo":"Riesgo del vendedor","sentido":"arriba"},{"rotulo":"Costo del comprador","sentido":"abajo"}],"filas":[{"celdas":[{"texto":"Efectivo"},{"texto":"Ninguno","tono":"info"},{"texto":"Caja o deuda","tono":"ciruela"}]},{"celdas":[{"texto":"Acciones"},{"texto":"Precio de la acción","tono":"ciruela"},{"texto":"Dilución","tono":"ciruela"}]},{"celdas":[{"texto":"Earnout"},{"texto":"Resultados futuros","tono":"ciruela"},{"texto":"Solo si se cumple","tono":"info"}]}]}'::jsonb,
  imagen = null::jsonb
  from public.clases c
 where c.id = l.clase_id and c.slug = 'nvidia-hugging-face' and l.orden = 6;

update public.laminas l set
  etiqueta = 'M&A avanzado · el precio a plazos',
  titulo = '[{"t":"Earnout y "},{"t":"escrow","acento":true}]'::jsonb,
  cuerpo = '[{"tipo":"p","texto":"El earnout condiciona parte del precio a que se cumplan metas: resuelve que las dos partes proyecten distinto."},{"tipo":"p","texto":"El escrow retiene otra parte en garantía por si lo que el vendedor declaró no era cierto — un pleito que no contó, una licencia mal cedida."},{"tipo":"p","texto":"Dos riesgos distintos, dos remedios distintos."}]'::jsonb,
  visual = 'flujo',
  datos = '{"nodos":[{"texto":"Firma"},{"texto":"Cierre"},{"texto":"Escrow"},{"texto":"Earnout"}]}'::jsonb,
  imagen = null::jsonb
  from public.clases c
 where c.id = l.clase_id and c.slug = 'nvidia-hugging-face' and l.orden = 7;

update public.laminas l set
  etiqueta = 'M&A avanzado · contabilidad',
  titulo = '[{"t":"El precio no es "},{"t":"lo que se compra","acento":true}]'::jsonb,
  cuerpo = '[{"tipo":"p","texto":"Al cerrar hay que repartir el precio entre todo lo adquirido, a valor razonable: caja, tecnología, marca, contratos."},{"tipo":"p","texto":"Nunca cuadra: lo identificable siempre vale menos que lo pagado. El sobrante tiene nombre, y es la lámina siguiente. (Cifras de ejemplo; el precio es el reportado.)"}]'::jsonb,
  visual = 'balance',
  datos = '{"columnas":[{"rotulo":"Lo que se paga","filas":[{"cuenta":"Precio de compra","monto":"USD 12.900 M"}],"total":"USD 12.900 M"},{"rotulo":"Lo que se identifica","filas":[{"cuenta":"Activos netos","monto":"USD 3.100 M"},{"cuenta":"Sobrante","monto":"USD 9.800 M"}],"total":"USD 12.900 M"}],"signo":"=","sello":"Todo el precio tiene que quedar asignado"}'::jsonb,
  imagen = null::jsonb
  from public.clases c
 where c.id = l.clase_id and c.slug = 'nvidia-hugging-face' and l.orden = 8;

update public.laminas l set
  etiqueta = 'M&A avanzado · contabilidad',
  titulo = '[{"t":"El sobrante se llama "},{"t":"goodwill","acento":true}]'::jsonb,
  cuerpo = '[{"tipo":"p","texto":"Precio pagado menos valor razonable de lo identificable. No se calcula: sobra."},{"tipo":"p","texto":"Y es lo que se compró sin poder separarlo: las sinergias esperadas y el equipo ya armado y funcionando."},{"tipo":"p","texto":"No se amortiza; se prueba por deterioro. Si la unidad deja de valer lo pagado, la pérdida entra de golpe al resultado — por eso el goodwill lleva la nota de si la compra salió bien."}]'::jsonb,
  visual = 'partido',
  datos = '{"mitades":[{"rotulo":"Identificable"},{"rotulo":"Goodwill"}],"reglas":true}'::jsonb,
  imagen = null::jsonb
  from public.clases c
 where c.id = l.clase_id and c.slug = 'nvidia-hugging-face' and l.orden = 9;

update public.laminas l set
  etiqueta = 'M&A avanzado · el activo se va a las 6',
  titulo = '[{"t":"Lo que compras "},{"t":"se puede ir","acento":true}]'::jsonb,
  cuerpo = '[{"tipo":"p","texto":"Al cerrar, el vesting se acelera y el equipo cobra de golpe: justo cuando más falta hace que se quede."},{"tipo":"fichas","leyenda":"sirve para","items":[{"texto":"Vesting acelerado","ficha":"Liberar","tono":"ciruela"},{"texto":"Paquete de retención","ficha":"Retener","tono":"info"},{"texto":"Earnout al equipo","ficha":"Alinear","tono":"neutro"}]},{"tipo":"p","texto":"Por eso una parte del precio se vuelve a atar al futuro. Y en un repositorio abierto también se puede ir la comunidad, que no firmó nada."}]'::jsonb,
  visual = 'tabla',
  datos = '{"columnas":[{"rotulo":"Riesgo"},{"rotulo":"Cuándo aparece","sentido":"arriba"},{"rotulo":"Con qué se ataja","sentido":"abajo"}],"filas":[{"celdas":[{"texto":"Fuga del equipo"},{"texto":"Al cierre","tono":"ciruela"},{"texto":"Retención","tono":"info"}]},{"celdas":[{"texto":"Fuga de la comunidad"},{"texto":"Al anuncio","tono":"ciruela"},{"texto":"Compromisos públicos","tono":"info"}]},{"celdas":[{"texto":"Choque cultural"},{"texto":"Meses después","tono":"ciruela"},{"texto":"Autonomía pactada","tono":"info"}]}]}'::jsonb,
  imagen = null::jsonb
  from public.clases c
 where c.id = l.clase_id and c.slug = 'nvidia-hugging-face' and l.orden = 10;

update public.laminas l set
  etiqueta = 'M&A avanzado · el regulador',
  titulo = '[{"t":"La sombra de "},{"t":"Arm","acento":true}]'::jsonb,
  cuerpo = '[{"tipo":"p","texto":"El regulador no mira el tamaño: mira si el dueño de las GPUs, siendo dueño del repositorio neutral, lo inclinaría hacia su propio hardware y en contra de AMD, Intel y los chips de los hyperscalers."},{"tipo":"p","texto":"Notificación obligatoria en Estados Unidos; revisión probable también en la Unión Europea y el Reino Unido, hasta bien entrado 2027."}]'::jsonb,
  visual = 'marcas',
  datos = '{"items":[{"src":"https://upload.wikimedia.org/wikipedia/commons/d/d7/Logotipo_Mellanox_Technologies.png","alt":"Logo de Mellanox Technologies.","pie":"2020 · USD 6.900 M · cerrada"},{"src":"https://upload.wikimedia.org/wikipedia/commons/7/77/Arm_logo_2017.svg","alt":"Logo de Arm.","pie":"2022 · USD 40.000 M · abandonada"},{"src":"https://upload.wikimedia.org/wikipedia/commons/d/d6/Hf-logo-with-title.svg","alt":"Logo de Hugging Face: la cara amarilla que abraza, junto al nombre.","pie":"2026 · USD 12.900 M · reportada"}],"pie":"Lo que cambia no es el tamaño, sino qué tan central es el activo para los rivales del comprador."}'::jsonb,
  imagen = null::jsonb
  from public.clases c
 where c.id = l.clase_id and c.slug = 'nvidia-hugging-face' and l.orden = 11;

update public.laminas l set
  etiqueta = 'Cómo leer una operación',
  titulo = '[{"t":"Reportado no es "},{"t":"cerrado","acento":true}]'::jsonb,
  cuerpo = '[{"tipo":"p","texto":"Cuatro estados entre la prensa y el dinero, y en cualquiera se cae. Arm llegó a estar firmada."},{"tipo":"p","texto":"Lo primero al analizar una compra es ubicarla en esa fila: cambia qué obliga a quién, quién paga si alguien se retira, y cuánto de lo que se lee es hecho y cuánto intención."}]'::jsonb,
  visual = 'flujo',
  datos = '{"nodos":[{"texto":"Reportado"},{"texto":"Firmado"},{"texto":"Aprobado"},{"texto":"Cerrado"}]}'::jsonb,
  imagen = null::jsonb
  from public.clases c
 where c.id = l.clase_id and c.slug = 'nvidia-hugging-face' and l.orden = 12;
