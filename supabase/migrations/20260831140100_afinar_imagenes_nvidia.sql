-- Dos ajustes que solo se ven corriendo la baraja.
--
-- 1. La foto de la GPU se enlazaba al original de Wikimedia: 2 MB, y a mitad
--    de lámina todavía no había aparecido. Wikimedia sirve miniaturas bajo
--    `/thumb/<ruta>/<ancho>px-<archivo>`; la de 960 px pesa 127 KB y en esta
--    columna se ve igual. Regla para cualquier imagen raster enlazada.
--
-- 2. El pie de la ronda repetía los USD 235 millones que ya dice el párrafo,
--    y al partirse dejaba un «M» huérfano en el renglón siguiente.

update public.laminas l
   set imagen = jsonb_set(l.imagen, '{src}',
         '"https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/MSI_GeForce_RTX_3070_VENTUS_3X_OC.jpg/960px-MSI_GeForce_RTX_3070_VENTUS_3X_OC.jpg"'::jsonb)
  from public.clases c
 where c.id = l.clase_id and c.slug = 'nvidia-hugging-face' and l.orden = 2;

update public.laminas l
   set datos = jsonb_set(l.datos, '{pie}',
         '"Serie D · agosto de 2023 · liderada por Salesforce Ventures"'::jsonb)
  from public.clases c
 where c.id = l.clase_id and c.slug = 'nvidia-hugging-face' and l.orden = 4;
