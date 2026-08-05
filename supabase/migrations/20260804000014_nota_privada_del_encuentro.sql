-- La nota del encuentro se vuelve privada por lado (decisión 2026-08-04):
-- cada extremo guarda SU nota sobre el encuentro y solo su autor la lee y la
-- edita. Reemplaza a connections.note — una sola por arista, visible y
-- editable por ambos — que el usuario descartó antes de que existiera UI de
-- escritura, así que en producción no hay notas reales que migrar; el select
-- de abajo cubre el seed local y cualquier resto por si acaso.

create table public.connection_notes (
  connection_id uuid not null references public.connections (id) on delete cascade,
  author_id uuid not null references public.profiles (id) on delete cascade,
  note text not null,
  updated_at timestamptz not null default now(),
  primary key (connection_id, author_id)
);
-- Sin grants explícitos: los default privileges de la 0003 ya dan a
-- authenticated el CRUD sobre tablas nuevas de public; RLS decide las filas.

-- Lo escrito hasta hoy pasa a ser nota privada de quien creó la arista, que
-- era quien la escribía (el flujo «Conectar v1» retirado el 2026-07-27).
insert into public.connection_notes (connection_id, author_id, note)
select id, created_by, note
from public.connections
where note is not null;

alter table public.connections drop column note;

-- Sin la nota, connections no tiene columna editable. Además la política de
-- update dejaba a un extremo RE-CABLEAR su arista hacia un tercero (cambiar
-- user_a manteniéndose él dentro del USING, que sin WITH CHECK también valida
-- la fila nueva): fabricaba un encuentro que nunca ocurrió, contra ADR 0001.
drop policy "connections_update_endpoint" on public.connections;
revoke update on table public.connections from authenticated;

alter table public.connection_notes enable row level security;

-- Solo el autor: ni siquiera el otro extremo de la arista la ve.
create policy "connection_notes_select_author"
  on public.connection_notes for select to authenticated
  using (author_id = (select auth.uid()));

-- Escribir exige además ser extremo de esa arista.
create policy "connection_notes_insert_author"
  on public.connection_notes for insert to authenticated
  with check (
    author_id = (select auth.uid())
    and exists (
      select 1 from public.connections c
      where c.id = connection_id
        and (c.user_a = (select auth.uid()) or c.user_b = (select auth.uid()))
    )
  );

create policy "connection_notes_update_author"
  on public.connection_notes for update to authenticated
  using (author_id = (select auth.uid()));

create policy "connection_notes_delete_author"
  on public.connection_notes for delete to authenticated
  using (author_id = (select auth.uid()));

-- ============================================================
-- get_event_graph v5: la 'note' de cada arista ahora es LA TUYA
-- ============================================================

-- El shape del JSON no cambia: cada arista sigue trayendo 'note', pero es la
-- nota privada DE QUIEN CONSULTA sobre ese encuentro (null en las demás). La
-- función es security definer, así que el filtro por auth.uid() va explícito
-- en el join — la RLS de connection_notes no aplica aquí dentro.
create or replace function public.get_event_graph(p_event_id uuid)
returns json
language sql
security definer
set search_path = ''
stable
as $$
  select case
    when not private.is_event_attendee(p_event_id, auth.uid()) then
      json_build_object('nodes', '[]'::json, 'edges', '[]'::json)
    else
      json_build_object(
        'createdBy', (
          select e.created_by from public.events e where e.id = p_event_id
        ),
        'nodes', (
          select coalesce(json_agg(json_build_object(
            'id', p.id,
            'name', p.name,
            'headline', p.headline,
            'role', p.role,
            'tags', p.tags,
            'intents', p.intents,
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
            'note', cn.note,
            'createdAt', c.created_at
          )), '[]'::json)
          from public.connections c
          left join public.connection_notes cn
            on cn.connection_id = c.id and cn.author_id = auth.uid()
          where c.event_id = p_event_id
        )
      )
  end;
$$;
