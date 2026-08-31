-- Escala óptica del logotipo de Hugging Face.
--
-- Todas las marcas se dibujan a la misma altura, pero cada archivo trae su
-- propio margen adentro: el de Hugging Face deja bastante aire alrededor del
-- texto, así que al lado de Arm o de NVIDIA se ve la mitad de grande aunque
-- ocupe los mismos píxeles. `escala` lo compensa. Es ajuste óptico y no tamaño:
-- lo que se iguala es cómo se ven, no cuánto miden.

update public.laminas l
   set datos = jsonb_set(
         l.datos, '{items}',
         (select jsonb_agg(
                   case when m ->> 'src' like '%Hf-logo%'
                        then m || '{"escala": 1.4}'::jsonb
                        else m end)
            from jsonb_array_elements(l.datos -> 'items') m))
  from public.clases c
 where c.id = l.clase_id
   and c.slug = 'nvidia-hugging-face'
   and l.visual = 'marcas'
   and l.datos -> 'items' @> '[{"src": "https://upload.wikimedia.org/wikipedia/commons/d/d6/Hf-logo-with-title.svg"}]'::jsonb;
