-- La constelación es el grafo COMPLETO del evento (ADR 0003): todos los
-- asistentes como nodos (con o sin conexiones) y todas las conexiones como
-- aristas, sin límite de profundidad, visible para cualquier asistente del
-- evento. Reemplaza a get_my_graph (1º+2º grado), que queda eliminada.
-- Las notas siguen siendo privadas: solo se exponen en tus propias aristas.

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
            'avatarUrl', p.avatar_url
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

drop function if exists public.get_my_graph(uuid);
