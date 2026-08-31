-- Fuera tres láminas: la forma de pago, el reparto del precio y el goodwill.
--
-- La baraja queda en once. Se van, por su número de entonces:
--
--   6.  Cuánto se paga y con qué   (efectivo, acciones, earnout)
--   8.  Al cerrar hay que repartir el precio
--   9.  El sobrante se llama goodwill
--
-- Se comprobó antes de borrar que ninguna de las once restantes las nombra ni
-- se apoya en ellas: la de earnout y escrow define los dos términos por su
-- cuenta, y la única que menciona «acciones» habla de las del equipo.
--
-- El `orden` es único por clase, así que renumerar de un solo update chocaría
-- consigo mismo a mitad de camino. Se corren todas a +100 primero y se
-- reasigna 1..11 después, que es la manera barata de no pelear con el índice.
--
-- Lo que queda descolgado es el quiz: la pregunta 13 pregunta por el goodwill
-- y ya no hay lámina que lo explique. Se deja en pie a propósito, para no
-- tomar por mi cuenta una decisión sobre el quiz que no se me pidió.

delete from public.laminas l
 using public.clases c
 where c.id = l.clase_id and c.slug = 'nvidia-hugging-face' and l.orden in (6, 8, 9);

update public.laminas l set orden = l.orden + 100
  from public.clases c
 where c.id = l.clase_id and c.slug = 'nvidia-hugging-face';

with renumeradas as (
  select l.id, row_number() over (order by l.orden) as n
    from public.laminas l
    join public.clases c on c.id = l.clase_id
   where c.slug = 'nvidia-hugging-face')
update public.laminas l set orden = renumeradas.n
  from renumeradas
 where renumeradas.id = l.id;

update public.clases set
  bajada = '11 láminas y 14 preguntas sobre las compras de NVIDIA. Empieza por lo básico, qué es una GPU y qué son los pesos de un modelo, y llega hasta el riesgo regulatorio, pasando por quién fundó cada una de las tres empresas.'
 where slug = 'nvidia-hugging-face';
