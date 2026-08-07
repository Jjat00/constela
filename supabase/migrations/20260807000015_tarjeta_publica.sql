-- La tarjeta se comparte fuera del evento: quien recibe el link no tiene
-- sesión. El lookup público expone también los canales que ya son públicos
-- donde viven (web, LinkedIn, GitHub, Instagram). El WhatsApp es un teléfono,
-- no un perfil: sigue detrás de la RLS de profiles (solo authenticated) y de
-- la regla del encuentro real. Sin enumeración: solo por slug exacto.

drop function public.get_profile_by_slug(text);

create function public.get_profile_by_slug(p_slug text)
returns table (
  id uuid,
  name text,
  headline text,
  role text[],
  tags text[],
  intents text[],
  avatar_url text,
  website text,
  instagram text,
  linkedin text,
  github text
)
language sql
security definer
set search_path = ''
stable
as $$
  select p.id, p.name, p.headline, p.role, p.tags, p.intents, p.avatar_url,
         p.website, p.instagram, p.linkedin, p.github
  from public.profiles p
  where p.qr_slug = p_slug;
$$;
