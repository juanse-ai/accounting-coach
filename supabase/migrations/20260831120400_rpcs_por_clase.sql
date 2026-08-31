-- Las funciones, ahora por clase.
--
-- Dos nuevas de lectura —el catálogo y el contenido de una clase— porque el
-- contenido dejó de viajar en el bundle. Y dos rehechas: la escritura de una
-- respuesta y la lectura del tablero.
--
-- `registrar_respuesta` no sabe qué tipos de pregunta existen. Recibe un sobre
-- jsonb, lo guarda, y si trae `lineas` las proyecta además a respuesta_lineas.
-- Un tipo nuevo de pregunta no la toca.

-- ── Catálogo ───────────────────────────────────────────────────────────────

create or replace function public.clases_publicas()
returns jsonb
language sql
stable
security definer
set search_path to 'public', 'pg_temp'
as $$
  select coalesce(jsonb_agg(
           jsonb_build_object(
             'id',       c.id,
             'slug',     c.slug,
             'nombre',   c.nombre,
             'etiqueta', c.etiqueta,
             'titular',  c.titular,
             'bajada',   c.bajada,
             'preguntas', (select count(*) from public.preguntas q where q.clase_id = c.id))
           order by c.orden), '[]'::jsonb)
    from public.clases c
   where c.activa;
$$;

comment on function public.clases_publicas() is
  'Las clases que se pueden presentar. Sin contenido: solo lo que necesita el selector y el landing.';

-- ── Contenido de una clase ─────────────────────────────────────────────────

-- Devuelve también la respuesta esperada de cada pregunta, porque la
-- calificación es del lado del cliente. Es la misma exposición que había
-- cuando el contenido vivía en el bundle, ni más ni menos; moverla al
-- servidor es un cambio aparte, con su propia decisión de producto.
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
                 'datos',     q.datos)
               order by q.orden)
        from public.preguntas q where q.clase_id = c.id), '[]'::jsonb)
  )
  from public.clases c
  where c.slug = p_slug and c.activa;
$$;

comment on function public.clase_completa(text) is
  'Todo lo que el frontend necesita para presentar una clase: láminas, plan de cuentas y preguntas.';

-- ── Escritura ──────────────────────────────────────────────────────────────

drop function if exists public.registrar_respuesta(uuid, text, boolean, jsonb);

create or replace function public.registrar_respuesta(
  p_participante_id uuid,
  p_pregunta_id     uuid,
  p_es_correcta     boolean,
  p_datos           jsonb
) returns uuid
language plpgsql
security definer
set search_path to 'public', 'pg_temp'
as $$
declare
  v_respuesta_id uuid;
  v_intento      int;
  v_debitos      numeric(14, 2);
  v_creditos     numeric(14, 2);
  v_id_pub       uuid;
  v_estado       text;
  v_creado       timestamptz;
  v_clase        text;
  v_codigo       text;
  v_lineas       jsonb;
  v_sobre        jsonb;
  v_payload      jsonb;
begin
  select id_publico into v_id_pub
    from public.participantes
   where id = p_participante_id;

  if v_id_pub is null then
    raise exception 'Participante no registrado.' using errcode = '23503';
  end if;

  select c.slug, q.codigo
    into v_clase, v_codigo
    from public.preguntas q
    join public.clases c on c.id = q.clase_id
   where q.id = p_pregunta_id;

  if v_codigo is null then
    raise exception 'Pregunta desconocida: %', p_pregunta_id using errcode = '23503';
  end if;

  if p_es_correcta is null then
    raise exception 'Falta el resultado de la verificación.' using errcode = '22023';
  end if;

  if jsonb_typeof(p_datos) is distinct from 'object' then
    raise exception 'La respuesta debe ser un objeto.' using errcode = '22023';
  end if;

  -- Lo único que la función sabe de un tipo concreto: si el sobre trae
  -- `lineas`, esas van a su tabla y salen del sobre. Cada dato en un sitio.
  v_lineas := case when jsonb_typeof(p_datos -> 'lineas') = 'array' then p_datos -> 'lineas' end;
  v_sobre  := p_datos - 'lineas';

  if v_lineas is not null and jsonb_array_length(v_lineas) not between 1 and 20 then
    raise exception 'El asiento debe traer entre 1 y 20 líneas.' using errcode = '22023';
  end if;

  perform pg_advisory_xact_lock(hashtextextended(p_participante_id::text || ':' || p_pregunta_id::text, 0));

  select coalesce(max(intento), 0) + 1
    into v_intento
    from public.respuestas
   where participante_id = p_participante_id
     and pregunta_id     = p_pregunta_id;

  select coalesce(sum(case when l ->> 'lado' = 'Débito'  then (l ->> 'monto')::numeric end), 0),
         coalesce(sum(case when l ->> 'lado' = 'Crédito' then (l ->> 'monto')::numeric end), 0)
    into v_debitos, v_creditos
    from jsonb_array_elements(coalesce(v_lineas, '[]'::jsonb)) as l;

  v_estado := case when p_es_correcta then 'correcto' else 'incorrecto' end;

  insert into public.respuestas (
    participante_id, pregunta_id, intento, estado, es_correcta, datos, total_debitos, total_creditos
  ) values (
    p_participante_id, p_pregunta_id, v_intento, v_estado, p_es_correcta, v_sobre, v_debitos, v_creditos
  )
  returning id, creado_en into v_respuesta_id, v_creado;

  if v_lineas is not null then
    insert into public.respuesta_lineas (respuesta_id, orden, cuenta, cuenta_padre, lado, monto)
    select v_respuesta_id,
           ord::int,
           btrim(l ->> 'cuenta'),
           btrim(l ->> 'padre'),
           l ->> 'lado',
           (l ->> 'monto')::numeric
      from jsonb_array_elements(v_lineas) with ordinality as t(l, ord);
  end if;

  update public.participantes
     set ultima_actividad = now()
   where id = p_participante_id;

  -- El sobre se rearma leyendo lo que quedó guardado, no el argumento: lo que
  -- sale al tablero es exactamente lo que la base aceptó.
  v_payload := v_sobre || case
    when v_lineas is null then '{}'::jsonb
    else jsonb_build_object('lineas', coalesce((
           select jsonb_agg(
                    jsonb_build_object(
                      'orden',  rl.orden,
                      'cuenta', rl.cuenta,
                      'padre',  rl.cuenta_padre,
                      'lado',   rl.lado,
                      'monto',  rl.monto)
                    order by rl.orden)
             from public.respuesta_lineas rl
            where rl.respuesta_id = v_respuesta_id), '[]'::jsonb))
  end;

  begin
    perform realtime.send(
      jsonb_build_object(
        'id',           v_respuesta_id,
        'participante', v_id_pub,
        'clase',        v_clase,
        'pregunta',     p_pregunta_id,
        'codigo',       v_codigo,
        'intento',      v_intento,
        'estado',       v_estado,
        'creado_en',    v_creado,
        'datos',        v_payload
      ),
      'respuesta',
      'resultados-publicos',
      false
    );
  exception when others then null;
  end;

  return v_respuesta_id;
end;
$$;

-- ── Tablero ────────────────────────────────────────────────────────────────

drop function if exists public.resultados_publicos();

-- Sin clase devuelve todo; con clase, solo lo suyo. El tope de 5.000 pasa a
-- aplicarse por clase, que es como se mira el tablero.
create or replace function public.resultados_publicos(p_clase_id uuid default null)
returns jsonb
language sql
stable
security definer
set search_path to 'public', 'pg_temp'
as $$
  select jsonb_build_object(

    'participantes', coalesce((
      select jsonb_agg(
               jsonb_build_object(
                 'id',        p.id_publico,
                 'nombre',    p.nombre,
                 'creado_en', p.creado_en)
               order by p.creado_en)
        from public.participantes p), '[]'::jsonb),

    -- Sin `datos`: el tablero es público y no necesita la respuesta esperada.
    'preguntas', coalesce((
      select jsonb_agg(
               jsonb_build_object(
                 'id',        q.id,
                 'clase',     q.clase_id,
                 'codigo',    q.codigo,
                 'tipo',      q.tipo,
                 'nivel',     q.nivel,
                 'enunciado', q.enunciado)
               order by q.orden)
        from public.preguntas q
       where p_clase_id is null or q.clase_id = p_clase_id), '[]'::jsonb),

    'respuestas', coalesce((
      select jsonb_agg(fila.dato order by fila.creado_en)
        from (
          select r.creado_en,
                 jsonb_build_object(
                   'id',           r.id,
                   'participante', p.id_publico,
                   'clase',        q.clase_id,
                   'pregunta',     r.pregunta_id,
                   'codigo',       q.codigo,
                   'intento',      r.intento,
                   'estado',       r.estado,
                   'creado_en',    r.creado_en,
                   'datos',        r.datos || case
                     when not exists (select 1 from public.respuesta_lineas rl where rl.respuesta_id = r.id)
                       then '{}'::jsonb
                     else jsonb_build_object('lineas', (
                       select jsonb_agg(
                                jsonb_build_object(
                                  'orden',  rl.orden,
                                  'cuenta', rl.cuenta,
                                  'padre',  rl.cuenta_padre,
                                  'lado',   rl.lado,
                                  'monto',  rl.monto)
                                order by rl.orden)
                         from public.respuesta_lineas rl
                        where rl.respuesta_id = r.id))
                   end
                 ) as dato
            from public.respuestas r
            join public.participantes p on p.id = r.participante_id
            join public.preguntas q on q.id = r.pregunta_id
           where p_clase_id is null or q.clase_id = p_clase_id
           order by r.creado_en desc
           limit 5000
        ) fila), '[]'::jsonb)
  );
$$;
