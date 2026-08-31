-- Las respuestas dejan de colgar de `ejercicios` y cuelgan de `preguntas`.
--
-- Se conservan los 714 envíos y sus 1.462 líneas: son datos reales de gente
-- que practicó, y el tablero público los sigue mostrando igual.
--
-- `datos` es el sobre genérico de la respuesta enviada, lo que permite que un
-- tipo de pregunta nuevo no toque el esquema. Las líneas del asiento NO se
-- guardan ahí: siguen siendo filas en `respuesta_lineas`, que es lo que
-- permite preguntar «qué cuenta se confunde más» con un group by en vez de
-- destripar jsonb. El sobre y la tabla no se solapan — cada dato vive en un
-- solo sitio — y la lectura los vuelve a unir.

alter table public.respuestas
  add column pregunta_id uuid references public.preguntas(id) on delete cascade,
  add column datos jsonb not null default '{}'::jsonb
    constraint respuestas_datos_valido check (jsonb_typeof(datos) = 'object');

comment on column public.respuestas.datos is
  'Lo enviado, sin las líneas del asiento: esas están en respuesta_lineas. La lectura une ambas.';

-- El catálogo viejo usaba el mismo rótulo de dos dígitos que ahora es `codigo`.
update public.respuestas r
   set pregunta_id = p.id
  from public.preguntas p
  join public.clases c on c.id = p.clase_id
 where c.slug = 'contabilidad-basica'
   and p.codigo = r.ejercicio_id;

alter table public.respuestas alter column pregunta_id set not null;

alter table public.respuestas drop constraint respuestas_intento_unico;
alter table public.respuestas
  add constraint respuestas_intento_unico unique (participante_id, pregunta_id, intento);

drop view if exists public.vista_respuestas;
drop index if exists public.respuestas_ejercicio_idx;
alter table public.respuestas drop column ejercicio_id;
drop table public.ejercicios;

create index respuestas_pregunta_idx on public.respuestas (pregunta_id);

-- La vista de trabajo, rehecha sobre el modelo nuevo. Sigue siendo interna:
-- expone el correo y ningún rol salvo postgres/service_role puede leerla.
create view public.vista_respuestas with (security_invoker = true) as
  select r.id as respuesta_id,
         p.nombre,
         p.email,
         c.slug as clase,
         q.codigo,
         q.tipo,
         q.nivel,
         q.enunciado,
         r.intento,
         r.estado,
         r.datos,
         r.total_debitos,
         r.total_creditos,
         r.creado_en,
         (select jsonb_agg(jsonb_build_object('orden', rl.orden, 'cuenta', rl.cuenta,
                                              'padre', rl.cuenta_padre, 'lado', rl.lado,
                                              'monto', rl.monto) order by rl.orden)
            from public.respuesta_lineas rl
           where rl.respuesta_id = r.id) as lineas
    from public.respuestas r
    join public.participantes p on p.id = r.participante_id
    join public.preguntas q on q.id = r.pregunta_id
    join public.clases c on c.id = q.clase_id;
