-- La constelación tiene lugar: ciudad del evento (diseño 2d/2e).
-- Campo opcional — los eventos existentes siguen válidos sin ciudad.

alter table public.events add column if not exists city text;

-- get_event_by_slug ahora también cuenta dónde. `create or replace` no puede
-- cambiar el tipo de retorno: se dropea y recrea, y los grants se reponen
-- (mismo patrón que get_profile_by_slug en 0007).
drop function if exists public.get_event_by_slug(text);

create function public.get_event_by_slug(p_slug text)
returns table (
  id uuid,
  slug text,
  name text,
  city text,
  starts_at timestamptz,
  ends_at timestamptz
)
language sql
security definer
set search_path = ''
stable
as $$
  select e.id, e.slug, e.name, e.city, e.starts_at, e.ends_at
  from public.events e
  where e.slug = p_slug;
$$;

revoke execute on function public.get_event_by_slug(text) from public;
grant execute on function public.get_event_by_slug(text) to anon, authenticated;
