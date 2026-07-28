-- Los nodos del grafo exponen qr_slug: tocar una estrella abre su perfil
-- (/u/[slug]). Solo asistentes del evento llegan aquí, y el slug es
-- precisamente lo que un QR escaneado revela — no filtra nada nuevo.

create or replace function public.get_event_graph(p_event_id uuid)
returns json
language sql
security definer
set search_path = ''
stable
as $$
  select case
    when not public.is_event_attendee(p_event_id, auth.uid()) then
      json_build_object('nodes', '[]'::json, 'edges', '[]'::json)
    else
      json_build_object(
        'nodes', (
          select coalesce(json_agg(json_build_object(
            'id', p.id,
            'name', p.name,
            'headline', p.headline,
            'tags', p.tags,
            'avatarUrl', p.avatar_url,
            'qrSlug', p.qr_slug
          )), '[]'::json)
          from public.event_attendees ea
          join public.profiles p on p.id = ea.user_id
          where ea.event_id = p_event_id
        ),
        'edges', (
          select coalesce(json_agg(json_build_object(
            'id', c.id,
            'source', c.user_a,
            'target', c.user_b,
            'note', case
              when c.user_a = auth.uid() or c.user_b = auth.uid() then c.note
              else null
            end,
            'createdAt', c.created_at
          )), '[]'::json)
          from public.connections c
          where c.event_id = p_event_id
        )
      )
  end;
$$;
