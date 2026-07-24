-- Lookups públicos por slug (security definer):
-- permiten renderizar /u/[slug] y /e/[slug] sin sesión, exponiendo solo
-- campos mínimos y solo por slug exacto (sin enumeración de tablas).

create or replace function public.get_profile_by_slug(p_slug text)
returns table (
  id uuid,
  name text,
  headline text,
  tags text[],
  avatar_url text
)
language sql
security definer
set search_path = ''
stable
as $$
  select p.id, p.name, p.headline, p.tags, p.avatar_url
  from public.profiles p
  where p.qr_slug = p_slug;
$$;

create or replace function public.get_event_by_slug(p_slug text)
returns table (
  id uuid,
  slug text,
  name text,
  starts_at timestamptz,
  ends_at timestamptz
)
language sql
security definer
set search_path = ''
stable
as $$
  select e.id, e.slug, e.name, e.starts_at, e.ends_at
  from public.events e
  where e.slug = p_slug;
$$;
