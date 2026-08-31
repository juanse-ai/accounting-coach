-- Cerrar las tablas nuevas como están cerradas las viejas.
--
-- Supabase concede por defecto todos los permisos de tabla a `anon` y
-- `authenticated` sobre lo que se crea en `public`. Las cuatro tablas
-- originales no los tienen: la negación está aplicada dos veces —sin permiso
-- de tabla Y con RLS sin políticas— y basta con que una de las dos siga en pie.
--
-- Las tablas de contenido nacieron con esos permisos puestos. Hoy no filtran
-- nada porque RLS las tapa, pero dependen de una sola barrera. Se revocan para
-- que dependan de dos, igual que el resto.
--
-- `vista_respuestas` entra aquí porque se volvió a crear al migrar el modelo y
-- recuperó los permisos por defecto. Expone correos: es la que menos los quiere.

revoke all on public.clases           from anon, authenticated;
revoke all on public.laminas          from anon, authenticated;
revoke all on public.cuentas          from anon, authenticated;
revoke all on public.preguntas        from anon, authenticated;
revoke all on public.vista_respuestas from anon, authenticated;

-- Y que la próxima tabla nazca cerrada, en vez de tener que acordarse.
alter default privileges in schema public revoke all on tables from anon, authenticated;
