-- Modelo por clase.
--
-- Hasta aquí el contenido vivía en dos sitios: el catálogo mínimo de
-- `ejercicios` en la base y el contenido real (láminas, plan de cuentas,
-- líneas esperadas, notas) dentro del bundle de JavaScript. Una clase nueva
-- exigía tocar código.
--
-- A partir de aquí una clase es una fila, y todo lo que la distingue —su
-- presentación, su plan de cuentas y sus preguntas— cuelga de ella. El
-- frontend deja de conocer contabilidad: sabe renderizar formas, no temas.
--
-- Igual que el resto del esquema: RLS encendido sin políticas y sin permisos
-- de tabla para anon. Todo entra y sale por funciones SECURITY DEFINER.

-- ── Clase ──────────────────────────────────────────────────────────────────

create table public.clases (
  id        uuid primary key default gen_random_uuid(),
  slug      text not null unique
              constraint clases_slug_valido check (slug ~ '^[a-z0-9]([a-z0-9-]{0,58}[a-z0-9])?$'),
  nombre    text not null
              constraint clases_nombre_valido check (length(btrim(nombre)) between 1 and 120),
  -- Los tres textos del landing. Viven aquí y no en el componente porque son
  -- la promesa de ESTA clase, no del producto.
  etiqueta  text not null,
  titular   text not null,
  bajada    text not null,
  orden     integer not null unique,
  activa    boolean not null default true
);

comment on table  public.clases       is 'Una clase: un tema con su presentación y su quiz. La unidad que el frontend selecciona.';
comment on column public.clases.slug  is 'Identificador estable para enlaces y para la selección guardada en el navegador.';

-- ── Presentación ───────────────────────────────────────────────────────────

create table public.laminas (
  id       uuid not null primary key default gen_random_uuid(),
  clase_id uuid not null references public.clases(id) on delete cascade,
  orden    integer not null constraint laminas_orden_valido check (orden > 0),
  etiqueta text not null,
  -- El título es una lista de segmentos, no una cadena: el sistema pide que
  -- una parte vaya en el acento, y partir por coincidencia de texto se rompe
  -- con tildes, con la palabra repetida y con los signos de una ecuación.
  titulo   jsonb not null
             constraint laminas_titulo_valido check (jsonb_typeof(titulo) = 'array' and jsonb_array_length(titulo) > 0),
  -- Bloques: {tipo:'p',texto} | {tipo:'lista',items:[]} | {tipo:'fichas',items:[{texto,ficha,tono}]}
  cuerpo   jsonb not null default '[]'::jsonb
             constraint laminas_cuerpo_valido check (jsonb_typeof(cuerpo) = 'array'),
  -- Nombre de una forma del registro de diagramas del frontend. La forma la
  -- pone el código; lo que dice, esta fila.
  visual   text,
  datos    jsonb not null default '{}'::jsonb
             constraint laminas_datos_valido check (jsonb_typeof(datos) = 'object'),
  imagen   jsonb
             constraint laminas_imagen_valida check (imagen is null or jsonb_typeof(imagen) = 'object'),
  constraint laminas_orden_unico unique (clase_id, orden)
);

comment on table  public.laminas        is 'Una lámina de la presentación de una clase.';
comment on column public.laminas.visual is 'Clave de la forma en el registro de diagramas. Sin fila que la nombre, la forma no se dibuja.';
comment on column public.laminas.datos  is 'Lo que la forma dibuja. Cada forma documenta su propia estructura.';

create index laminas_clase_idx on public.laminas (clase_id, orden);

-- ── Plan de cuentas ────────────────────────────────────────────────────────

-- Solo lo consumen las preguntas de tipo 'asiento'. Una clase que no las use
-- simplemente no tiene filas aquí.
create table public.cuentas (
  id        uuid not null primary key default gen_random_uuid(),
  clase_id  uuid not null references public.clases(id) on delete cascade,
  nombre    text not null
              constraint cuentas_nombre_valido check (length(btrim(nombre)) between 1 and 120),
  padre     text not null
              constraint cuentas_padre_valido check (padre in ('Activo', 'Pasivo', 'Patrimonio', 'Ingreso', 'Gasto')),
  contraria boolean not null default false,
  razon     text not null,
  constraint cuentas_nombre_unico unique (clase_id, nombre)
);

comment on table public.cuentas is 'Plan de cuentas de una clase. La razón se usa en la retroalimentación cuando alguien clasifica mal.';

create index cuentas_clase_idx on public.cuentas (clase_id, nombre);

-- ── Preguntas ──────────────────────────────────────────────────────────────

create table public.preguntas (
  id        uuid not null primary key default gen_random_uuid(),
  clase_id  uuid not null references public.clases(id) on delete cascade,
  -- Rótulo visible: es el «01» de la lista y de las tarjetas del tablero.
  -- El identificador de verdad es el uuid; esto es tipografía.
  codigo    text not null constraint preguntas_codigo_valido check (codigo ~ '^[0-9]{2}$'),
  orden     integer not null constraint preguntas_orden_valido check (orden > 0),
  -- El discriminador. Cada valor tiene un motor en el frontend que sabe
  -- editarlo, calificarlo y mostrarlo. Un tipo nuevo no toca esta tabla.
  tipo      text not null constraint preguntas_tipo_valido check (tipo in ('asiento', 'opcion')),
  nivel     text not null constraint preguntas_nivel_valido check (nivel in ('Básico', 'Intermedio', 'Avanzado')),
  enunciado text not null,
  aviso     text,
  nota      text not null,
  datos     jsonb not null constraint preguntas_datos_valido check (
              jsonb_typeof(datos) = 'object'
              and case tipo
                    when 'asiento' then jsonb_typeof(datos -> 'lineas')   = 'array' and jsonb_array_length(datos -> 'lineas')   between 1 and 20
                    when 'opcion'  then jsonb_typeof(datos -> 'opciones') = 'array' and jsonb_array_length(datos -> 'opciones') between 2 and 8
                    else false
                  end),
  constraint preguntas_orden_unico  unique (clase_id, orden),
  constraint preguntas_codigo_unico unique (clase_id, codigo)
);

comment on table  public.preguntas       is 'Una pregunta del quiz. `tipo` decide qué motor del frontend la atiende.';
comment on column public.preguntas.datos is 'asiento: {lineas:[{cuenta,padre,lado,monto}]}. opcion: {opciones:[{texto,correcta}]}.';
comment on column public.preguntas.nota  is 'El «por qué», que solo se muestra una vez respondida.';

create index preguntas_clase_idx on public.preguntas (clase_id, orden);

alter table public.clases    enable row level security;
alter table public.laminas   enable row level security;
alter table public.cuentas   enable row level security;
alter table public.preguntas enable row level security;
