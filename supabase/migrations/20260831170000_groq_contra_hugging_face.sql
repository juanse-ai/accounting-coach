-- «Reportado no es cerrado» sale, y en su lugar entra lo que de verdad tiene
-- esta operación: el contraste con Groq.
--
-- La lámina de los cuatro estados era correcta pero genérica: sirve para
-- cualquier compra. El contraste entre las dos operaciones de NVIDIA solo se
-- puede enseñar aquí, y explica de una sola vez por qué el precio no dice el
-- nombre de la operación, por qué el regulador ve una y no la otra, y qué está
-- armando NVIDIA compra tras compra.
--
-- Donde había una lámina ahora hay tres:
--
--   12. Qué hace Groq y por qué una empresa mucho más chica era una amenaza.
--   13. Las dos compras, lado a lado.
--   14. La pila: seis capas, seis operaciones, una sola tesis.
--
-- El quiz pierde la pregunta de los cuatro estados y gana dos: la estrategia y
-- la diferencia entre entrenar y correr un modelo.

-- ── 12 · Qué es Groq ───────────────────────────────────────────────────────

update public.laminas l set
  titulo = '[{"t":"El chip que "},{"t":"sí competía","acento":true}]'::jsonb,
  cuerpo = '[
    {"tipo":"p","texto":"Groq no hace chips para entrenar modelos: los hace para correrlos. Su LPU está diseñada para responder rápido y para tardar siempre lo mismo, que en un servicio en vivo importa tanto como la velocidad."},
    {"tipo":"p","texto":"Lo fundó Jonathan Ross, que en Google había arrancado la TPU. El mismo que le construyó un competidor a NVIDIA desde adentro de Google montó otro desde afuera, apuntando a lo único que NVIDIA no domina: la inferencia."}
  ]'::jsonb,
  visual = null,
  datos = '{}'::jsonb,
  imagen = '{
    "src":"https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/LPU-v1-die.jpg/960px-LPU-v1-die.jpg",
    "alt":"Fotografía del die de un chip LPU de Groq: la retícula de circuitos vista de cerca.",
    "encuadre":"cubrir",
    "credito":"Die del LPU · Avivweinstein · CC BY-SA 4.0"
  }'::jsonb
  from public.clases c
 where c.id = l.clase_id and c.slug = 'nvidia-hugging-face' and l.orden = 12;

-- ── 13 · Las dos compras, lado a lado ──────────────────────────────────────

insert into public.laminas (clase_id, orden, etiqueta, titulo, cuerpo, visual, datos, imagen)
select c.id, 13, null,
  '[{"t":"Dos compras, "},{"t":"dos problemas","acento":true}]'::jsonb,
  '[
    {"tipo":"p","texto":"Groq era una amenaza: competía justo donde NVIDIA no manda. Hugging Face no compite con nada suyo, pero decide sobre qué hardware corre la IA abierta."},
    {"tipo":"p","texto":"Quitarse a un rival y quedarse con un paso obligado no se pagan igual, ni se estructuran igual, ni las mira el mismo regulador."}
  ]'::jsonb,
  'tabla',
  '{
    "columnas":[{"rotulo":""},{"rotulo":"Groq"},{"rotulo":"Hugging Face"}],
    "filas":[
      {"celdas":[{"texto":"Qué compra"},{"texto":"Un rival","tono":"ciruela"},{"texto":"Un paso obligado","tono":"info"}]},
      {"celdas":[{"texto":"Estructura"},{"texto":"Licencia","tono":"ciruela"},{"texto":"La empresa","tono":"info"}]},
      {"celdas":[{"texto":"Precio"},{"texto":"USD 20.000 M"},{"texto":"USD 12.900 M"}]},
      {"celdas":[{"texto":"Regulador"},{"texto":"No notificada","tono":"ciruela"},{"texto":"A revisión","tono":"info"}]},
      {"celdas":[{"texto":"Estado"},{"texto":"Cerrada 2025"},{"texto":"Reportada 2026"}]}
    ]
  }'::jsonb,
  null::jsonb
  from public.clases c where c.slug = 'nvidia-hugging-face';

-- ── 14 · La pila ───────────────────────────────────────────────────────────

insert into public.laminas (clase_id, orden, etiqueta, titulo, cuerpo, visual, datos, imagen)
select c.id, 14, null,
  '[{"t":"No compra empresas: compra "},{"t":"la pila","acento":true}]'::jsonb,
  '[
    {"tipo":"p","texto":"Redes, orquestación, nube, inferencia, distribución. Ninguna de esas compras le mueve los ingresos al lado de lo que NVIDIA factura en GPUs."},
    {"tipo":"p","texto":"Lo que compra es que nada de lo que hay entre un desarrollador y su chip sea de otro. Esa es la tesis, y también es lo que el regulador termina mirando."}
  ]'::jsonb,
  'tabla',
  '{
    "columnas":[{"rotulo":"Capa"},{"rotulo":"Operación"}],
    "filas":[
      {"celdas":[{"texto":"Redes"},{"texto":"Mellanox · 2020","tono":"info"}]},
      {"celdas":[{"texto":"CPU"},{"texto":"Arm · 2022, abandonada","tono":"ciruela"}]},
      {"celdas":[{"texto":"Orquestación"},{"texto":"Run:ai · 2024","tono":"info"}]},
      {"celdas":[{"texto":"Nube"},{"texto":"Lepton AI · 2025","tono":"info"}]},
      {"celdas":[{"texto":"Inferencia"},{"texto":"Groq · 2025","tono":"info"}]},
      {"celdas":[{"texto":"Distribución"},{"texto":"Hugging Face · 2026","tono":"neutro"}]}
    ]
  }'::jsonb,
  null::jsonb
  from public.clases c where c.slug = 'nvidia-hugging-face';

-- ── El quiz ────────────────────────────────────────────────────────────────

-- La 13 dejaba de tener lámina que la sostuviera: pasa a preguntar la tesis.
update public.preguntas p set
  nivel = 'Avanzado',
  enunciado = 'Mellanox en redes, Run:ai en orquestación, Lepton en nube, Groq en inferencia y ahora Hugging Face en distribución. Ninguna de esas compras le mueve los ingresos a NVIDIA al lado de lo que factura en GPUs. ¿Qué está comprando entonces?',
  nota = 'Es integración vertical: no compra para entrar en otro negocio, sino para controlar cada capa por la que pasa su propio producto. De ahí salen dos cosas que confunden si se miran sueltas. Una, que los precios parezcan desproporcionados frente a lo que esas empresas facturan: lo que se paga no es su flujo de caja, es lo que costaría que las tuviera otro. Y dos, que el regulador las mire con lupa aunque comprador y comprado no compitan entre sí, porque el daño que se teme no es que suba un precio sino que el dueño de una capa le cierre el paso a los rivales de otra.',
  datos = '{"opciones":[
    {"texto":"Diversificación: si el mercado de GPUs se enfría, esos negocios lo sostienen.","correcta":false},
    {"texto":"Patentes, para cobrarles licencias a sus competidores.","correcta":false},
    {"texto":"Que nada de lo que hay entre un desarrollador y su chip sea de otro.","correcta":true},
    {"texto":"Equipos de ingeniería, porque contratarlos uno por uno saldría más caro.","correcta":false}
  ]}'::jsonb
  from public.clases c
 where c.id = p.clase_id and c.slug = 'nvidia-hugging-face' and p.codigo = '13';

insert into public.preguntas (clase_id, codigo, orden, tipo, nivel, enunciado, aviso, nota, datos)
select c.id, '14', 14, 'opcion', 'Intermedio',
  'Groq no hacía chips para entrenar modelos sino para correrlos. ¿Por qué eso convierte a una empresa mucho más pequeña en una amenaza para NVIDIA?',
  null,
  'Entrenar un modelo es un evento; usarlo es un hábito. El entrenamiento es donde NVIDIA no tiene rival, pero la inferencia crece con cada usuario y cada consulta, y ahí un chip especializado puede ganarle en lo único que importa en un servicio en vivo: responder rápido y tardar siempre lo mismo. Comprar a Groq no le sumó a NVIDIA un negocio nuevo, le quitó de encima al competidor que apuntaba a la parte del mercado que todavía estaba en disputa.',
  '{"opciones":[
    {"texto":"Porque entrenar y correr un modelo son el mismo trabajo, y quien hace bien uno hace bien el otro.","correcta":false},
    {"texto":"Porque entrenar se hace una vez y correr el modelo se hace cada vez que alguien lo usa: ahí está el volumen, y ahí NVIDIA no era la única opción.","correcta":true},
    {"texto":"Porque los chips de inferencia son más caros de fabricar y dejan más margen.","correcta":false},
    {"texto":"Porque sin chips de inferencia las GPUs de NVIDIA no pueden entrenar.","correcta":false}
  ]}'::jsonb
  from public.clases c where c.slug = 'nvidia-hugging-face';

update public.clases set
  bajada = '14 láminas y 14 preguntas sobre las compras de NVIDIA: qué es una valoración, qué mide un múltiplo, estructura del pago, earnout y escrow, goodwill, riesgo regulatorio y por qué Groq y Hugging Face son dos operaciones distintas.'
 where slug = 'nvidia-hugging-face';
