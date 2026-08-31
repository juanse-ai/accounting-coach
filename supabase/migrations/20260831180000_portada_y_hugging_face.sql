-- Dos láminas, más directas.
--
-- La portada tenía un segundo párrafo sobre el estado de la operación que
-- repetía lo que la lámina 13 ya dice mejor, con la tabla al lado. Fuera.
--
-- La segunda cambia la foto de una GPU (que ilustraba a NVIDIA, no a Hugging
-- Face) por una captura del sitio: se ve el buscador, el contador de modelos y
-- las descargas de cada uno. Enseña de un vistazo lo que el párrafo tenía que
-- explicar, así que el párrafo se pudo escribir en cristiano: qué es el sitio,
-- cuántos modelos tiene y por qué eso vale dinero.
--
-- La captura vive en public/clases/, como las fotos de Contabilidad Básica
-- viven en public/aprende/. El crédito lleva la fecha a propósito: el contador
-- de modelos sube todos los días y conviene saber de cuándo es la cifra.
--
-- Va con encuadre `contener` y no `cubrir`: una foto se puede recortar sin
-- perder lo que decía, una captura de pantalla no. Recortada por arriba se
-- quedaba sin el buscador ni el contador, que es justo lo que había que ver.

update public.laminas l set cuerpo = '[
  {"tipo":"p","texto":"USD 12.900 millones. Sería la empresa más grande que NVIDIA compra entera, aunque no su cheque más grande: ese sigue siendo Groq. La diferencia entre las dos cosas da para media clase."}
]'::jsonb
  from public.clases c
 where c.id = l.clase_id and c.slug = 'nvidia-hugging-face' and l.orden = 1;

update public.laminas l set
  cuerpo = '[
    {"tipo":"p","texto":"Hugging Face es el sitio donde se publican y se descargan los modelos de inteligencia artificial abiertos. Hay más de tres millones, y usarlos es gratis para casi todo el mundo."},
    {"tipo":"lista","items":["Modelos listos para usar","Datos para entrenarlos","Librerías para conectarlos","La comunidad que los mantiene"]},
    {"tipo":"p","texto":"Ahí está su valor: no en lo que cobra, sino en que casi todo el que trabaja con IA abierta entra por ahí."}
  ]'::jsonb,
  imagen = '{
    "src":"/clases/hugging-face-models.jpg",
    "alt":"La lista de modelos de Hugging Face: un buscador arriba, el contador con más de tres millones de modelos, y debajo cada modelo con sus descargas y su fecha.",
    "encuadre":"contener",
    "credito":"Captura de huggingface.co · agosto de 2026"
  }'::jsonb
  from public.clases c
 where c.id = l.clase_id and c.slug = 'nvidia-hugging-face' and l.orden = 2;
