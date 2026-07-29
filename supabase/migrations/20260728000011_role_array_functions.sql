-- role pasó a text[] (migración 0010) pero dos funciones seguían leyéndolo
-- como text: list_tags fallaba por tipos en runtime (y la UI mostraba el
-- catálogo vacío) y get_profile_by_slug rompía /u/[slug]. get_event_graph
-- no necesita cambios: json_build_object serializa el array tal cual.

create or replace function public.list_tags()
returns table (
  category text,
  slug text,
  label text,
  aliases text[],
  is_curated boolean,
  uses bigint
)
language sql
security definer
set search_path = ''
stable
as $$
  with used as (
    select 'rol'::text as category, r as slug, count(*) as uses
    from public.profiles p, unnest(p.role) as r
    group by r
    union all
    select 'interes', t, count(*)
    from public.profiles p, unnest(p.tags) as t
    group by t
    union all
    select 'intencion', i, count(*)
    from public.profiles p, unnest(p.intents) as i
    group by i
  )
  select t.category, t.slug, t.label, t.aliases, t.is_curated,
         coalesce(u.uses, 0) as uses
  from public.tags t
  left join used u on u.category = t.category and u.slug = t.slug
  order by t.category, coalesce(u.uses, 0) desc, t.label;
$$;

-- Cambia el tipo de retorno (role text → text[]): hay que soltarla primero
drop function public.get_profile_by_slug(text);

create function public.get_profile_by_slug(p_slug text)
returns table (
  id uuid,
  name text,
  headline text,
  role text[],
  tags text[],
  intents text[],
  avatar_url text
)
language sql
security definer
set search_path = ''
stable
as $$
  select p.id, p.name, p.headline, p.role, p.tags, p.intents, p.avatar_url
  from public.profiles p
  where p.qr_slug = p_slug;
$$;
