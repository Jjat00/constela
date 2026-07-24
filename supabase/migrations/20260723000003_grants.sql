-- Postgres 17 en Supabase ya no otorga privilegios por defecto a los roles
-- de la API. RLS decide qué filas; estos GRANT deciden el acceso a la tabla.
-- anon no recibe acceso directo a tablas: las páginas públicas usan las
-- RPCs security definer (get_profile_by_slug, get_event_by_slug).

grant usage on schema public to anon, authenticated;

grant select, update on public.profiles to authenticated;
grant select, insert, update on public.events to authenticated;
grant select, insert, delete on public.event_attendees to authenticated;
grant select, insert, update, delete on public.connections to authenticated;

alter default privileges in schema public
  grant select, insert, update, delete on tables to authenticated;
