-- Corrección: Groq.
--
-- La portada decía que Hugging Face «sería la mayor adquisición de su historia,
-- casi el doble de Mellanox, su récord anterior». Es falso. El 24 de diciembre
-- de 2025 NVIDIA pagó unos USD 20.000 millones por la tecnología de Groq y por
-- su equipo: su cheque más grande, y Mellanox dejó de ser el récord anterior.
--
-- Pero el error es mejor que el dato que faltaba. NVIDIA no compró Groq: firmó
-- una licencia no exclusiva sobre su tecnología y contrató a sus ingenieros
-- clave, incluido su fundador. Groq siguió existiendo como sociedad
-- independiente. Formalmente no hubo adquisición, así que no hubo notificación
-- previa bajo la HSR y el regulador no llegó a mirar la operación más cara de
-- la historia de la compañía. En marzo de 2026 dos senadores de Estados Unidos
-- le escribieron a NVIDIA preguntando si eso no era, precisamente, una forma de
-- esquivar la ley.
--
-- Eso es exactamente lo que esta clase enseña, y no estaba: la estructura de
-- una operación decide cómo se llama y quién llega a revisarla, no su precio.
-- Entra en la portada, en la lámina del regulador (que pasa de tres casos a
-- cuatro) y en dos preguntas.

-- ── Portada ────────────────────────────────────────────────────────────────

update public.laminas l set cuerpo = '[
  {"tipo":"p","texto":"USD 12.900 millones. Sería la empresa más grande que NVIDIA compra entera, aunque no su cheque más grande: ese sigue siendo Groq. La diferencia entre las dos cosas da para media clase."},
  {"tipo":"p","texto":"Reportado en agosto de 2026, sin acuerdo firmado. Así se analiza casi toda operación de M&A: antes de que exista del todo."}
]'::jsonb
  from public.clases c
 where c.id = l.clase_id and c.slug = 'nvidia-hugging-face' and l.orden = 1;

-- ── El regulador: cuatro operaciones, cuatro desenlaces ────────────────────

update public.laminas l set
  cuerpo = '[
    {"tipo":"p","texto":"El regulador no mira el tamaño: mira si el dueño de las GPUs, siendo dueño del repositorio neutral, lo inclinaría hacia su propio hardware y en contra de AMD, Intel y los chips de los hyperscalers."},
    {"tipo":"p","texto":"Y solo revisa lo que se le notifica. Por Groq, NVIDIA pagó más y no notificó nada: licenció la tecnología y contrató al equipo sin comprar la empresa. Comprar Hugging Face entera no admite esa salida."}
  ]'::jsonb,
  datos = '{
    "items":[
      {"src":"https://upload.wikimedia.org/wikipedia/commons/d/d7/Logotipo_Mellanox_Technologies.png","alt":"Logo de Mellanox Technologies.","pie":"2020 · USD 6.900 M · comprada y cerrada"},
      {"src":"https://upload.wikimedia.org/wikipedia/commons/7/77/Arm_logo_2017.svg","alt":"Logo de Arm.","pie":"2022 · USD 40.000 M · abandonada"},
      {"src":"https://upload.wikimedia.org/wikipedia/commons/c/cc/Groq_logo.svg","alt":"Logotipo de Groq.","pie":"2025 · USD 20.000 M · licencia, sin notificar"},
      {"src":"https://upload.wikimedia.org/wikipedia/commons/d/d6/Hf-logo-with-title.svg","alt":"Logo de Hugging Face: la cara amarilla que abraza, junto al nombre.","escala":1.4,"pie":"2026 · USD 12.900 M · compra, a revisión"}
    ],
    "pie":"Lo que decide si hay revisión no es el precio, sino la estructura."
  }'::jsonb
  from public.clases c
 where c.id = l.clase_id and c.slug = 'nvidia-hugging-face' and l.orden = 11;

-- ── Pregunta 02: deja de ser un dato y pasa a ser el concepto ──────────────

update public.preguntas p set
  enunciado = 'Se dice que sería la mayor adquisición de NVIDIA y, sin embargo, por Groq pagó más: unos USD 20.000 millones en diciembre de 2025. ¿Cómo pueden ser ciertas las dos cosas a la vez?',
  nota = 'Groq siguió existiendo como sociedad independiente. NVIDIA se llevó una licencia no exclusiva sobre su tecnología y a sus ingenieros clave, incluido su fundador, pero no compró la compañía: formalmente no adquirió nada, aunque pagara más que por ninguna compra de su historia. Mellanox (2020, USD 6.900 millones) sigue siendo la empresa más grande que compró entera, y Hugging Face la superaría. Primera lección de M&A avanzado: cómo se llama una operación depende de su estructura, no de su precio.',
  datos = '{"opciones":[
    {"texto":"Porque el precio de Groq incluye deuda asumida y el de Hugging Face no.","correcta":false},
    {"texto":"Porque por Groq no compró la empresa: licenció su tecnología y contrató a su equipo, y eso no es una adquisición.","correcta":true},
    {"texto":"Porque la cifra de Groq nunca llegó a confirmarse.","correcta":false},
    {"texto":"Porque una compra solo cuenta como adquisición cuando comprador y comprado están en el mismo país.","correcta":false}
  ]}'::jsonb
  from public.clases c
 where c.id = p.clase_id and c.slug = 'nvidia-hugging-face' and p.codigo = '02';

-- ── La pregunta que faltaba, entre el regulador y los cuatro estados ───────

-- Se corre la 12 antes de insertar: `orden` y `codigo` son únicos por clase.
update public.preguntas p set codigo = '13', orden = 13
  from public.clases c
 where c.id = p.clase_id and c.slug = 'nvidia-hugging-face' and p.codigo = '12';

insert into public.preguntas (clase_id, codigo, orden, tipo, nivel, enunciado, aviso, nota, datos)
select c.id, '12', 12, 'opcion', 'Avanzado',
  'Por Groq, NVIDIA pagó unos USD 20.000 millones sin comprar la empresa: licenció su tecnología y contrató a su equipo. ¿Qué cambia esa estructura frente a comprar la compañía?',
  null,
  'La notificación previa a las autoridades de competencia se dispara al adquirir acciones o activos de una empresa. Una licencia no exclusiva más una oferta de trabajo a su equipo, formalmente, no es ninguna de las dos, y Groq siguió existiendo. Por eso la operación más cara de NVIDIA nunca pasó por el regulador, y por eso en marzo de 2026 dos senadores de Estados Unidos le escribieron preguntando si no era exactamente una forma de esquivar la ley. La regla para eso existe: si una estructura se arma para evadir la notificación, se ignora la forma y se mira el fondo. Pero eso hay que probarlo después, y para entonces la operación ya ocurrió.',
  '{"opciones":[
    {"texto":"Nada de fondo: pagar por los activos y pagar por la empresa son la misma operación con otro nombre.","correcta":false},
    {"texto":"Que el precio deja de ser una inversión y se registra íntegro como gasto del período.","correcta":false},
    {"texto":"Que no hay nada que notificar a las autoridades de competencia, así que no hay revisión previa.","correcta":true},
    {"texto":"Que los dueños de Groq cobran más, porque no hay que repartir con la sociedad.","correcta":false}
  ]}'::jsonb
  from public.clases c where c.slug = 'nvidia-hugging-face';
