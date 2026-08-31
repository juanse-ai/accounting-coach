-- Una pregunta puede enseñar caras.
--
-- Hasta aquí una pregunta era solo texto: enunciado, aviso y opciones. Sirve
-- para todo lo que se razona, que es casi todo. No sirve para «quiénes son
-- estas tres personas», donde la pregunta ES la imagen.
--
-- `apoyo` es eso y solo eso: la fila de retratos que acompaña al enunciado.
-- No es el sistema de formas de la presentación —ese vive en `laminas.visual`
-- y usa la paleta cerrada de la baraja, que no existe fuera del diálogo—,
-- sino una pieza del quiz con la paleta del quiz.
--
--   {"retratos":[{"src","alt","pie"?}], "credito"?}
--
-- El `pie` de cada retrato es opcional a propósito: en una pregunta que pide
-- los nombres, rotular las caras sería regalar la respuesta. El `alt` no es
-- opcional nunca, y por la misma razón describe a la persona sin nombrarla.
-- `credito` es una sola línea al pie para las licencias de todas las fotos,
-- que suelen ser de autores distintos.

alter table public.preguntas
  add column apoyo jsonb
    constraint preguntas_apoyo_valido check (
      apoyo is null
      or (jsonb_typeof(apoyo) = 'object'
          and jsonb_typeof(apoyo -> 'retratos') = 'array'
          and jsonb_array_length(apoyo -> 'retratos') between 1 and 6));

comment on column public.preguntas.apoyo is
  'Apoyo visual del enunciado: {retratos:[{src,alt,pie?}], credito?}. Null en la mayoría de preguntas.';

-- El RPC tiene que devolverlo, o la columna no existe para el frontend.
create or replace function public.clase_completa(p_slug text)
returns jsonb
language sql
stable
security definer
set search_path to 'public', 'pg_temp'
as $$
  select jsonb_build_object(

    'clase', jsonb_build_object(
      'id', c.id, 'slug', c.slug, 'nombre', c.nombre,
      'etiqueta', c.etiqueta, 'titular', c.titular, 'bajada', c.bajada),

    'laminas', coalesce((
      select jsonb_agg(
               jsonb_build_object(
                 'id',       l.id,
                 'numero',   to_char(l.orden, 'FM00'),
                 'etiqueta', l.etiqueta,
                 'titulo',   l.titulo,
                 'cuerpo',   l.cuerpo,
                 'visual',   l.visual,
                 'datos',    l.datos,
                 'imagen',   l.imagen)
               order by l.orden)
        from public.laminas l where l.clase_id = c.id), '[]'::jsonb),

    'cuentas', coalesce((
      select jsonb_agg(
               jsonb_build_object(
                 'nombre',    x.nombre,
                 'padre',     x.padre,
                 'contraria', x.contraria,
                 'razon',     x.razon)
               order by x.nombre)
        from public.cuentas x where x.clase_id = c.id), '[]'::jsonb),

    'preguntas', coalesce((
      select jsonb_agg(
               jsonb_build_object(
                 'id',        q.id,
                 'codigo',    q.codigo,
                 'tipo',      q.tipo,
                 'nivel',     q.nivel,
                 'enunciado', q.enunciado,
                 'aviso',     q.aviso,
                 'nota',      q.nota,
                 'apoyo',     q.apoyo,
                 'datos',     q.datos)
               order by q.orden)
        from public.preguntas q where q.clase_id = c.id), '[]'::jsonb)
  )
  from public.clases c
  where c.slug = p_slug and c.activa;
$$;

comment on function public.clase_completa(text) is
  'Todo lo que el frontend necesita para presentar una clase: láminas, plan de cuentas y preguntas.';
