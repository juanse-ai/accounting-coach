-- Un solo vocabulario en la lámina 14.
--
-- El párrafo enumeraba las capas con unas palabras («redes, reparto del
-- trabajo, nube, inferencia, distribución») y la tabla de al lado con otras
-- («conectar las máquinas, repartir el trabajo, alquilar cómputo, hacer correr
-- los modelos, repartir los modelos»). Dos maneras de nombrar la misma lista,
-- una junto a la otra, y el lector tiene que emparejarlas él. El párrafo
-- adopta el vocabulario de la tabla.

update public.laminas l set cuerpo = jsonb_set(l.cuerpo, '{0,texto}',
  '"Conectar las máquinas, repartir el trabajo entre ellas, alquilar cómputo, hacer correr los modelos y ahora repartirlos. Ninguna de esas compras le suma ingresos comparables a lo que NVIDIA factura vendiendo chips."'::jsonb)
  from public.clases c
 where c.id = l.clase_id and c.slug = 'nvidia-hugging-face' and l.orden = 14;
