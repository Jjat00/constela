-- Constela — schema inicial
-- Grafo de networking por evento: perfiles, eventos, asistentes y conexiones (aristas).

-- ============================================================
-- Tablas
-- ============================================================

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  name text not null default '',
  headline text,
  tags text[] not null default '{}',
  avatar_url text,
  qr_slug text not null unique default encode(gen_random_bytes(6), 'hex'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.events (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  starts_at timestamptz,
  ends_at timestamptz,
  created_by uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now()
);

create table public.event_attendees (
  event_id uuid not null references public.events (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  joined_at timestamptz not null default now(),
  primary key (event_id, user_id)
);

-- Par canónico: user_a < user_b evita aristas espejo; UNIQUE evita duplicados.
create table public.connections (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events (id) on delete cascade,
  user_a uuid not null references public.profiles (id) on delete cascade,
  user_b uuid not null references public.profiles (id) on delete cascade,
  note text,
  created_by uuid not null references public.profiles (id),
  created_at timestamptz not null default now(),
  constraint connections_canonical_pair check (user_a < user_b),
  constraint connections_unique_pair unique (event_id, user_a, user_b)
);

create index connections_event_user_a_idx on public.connections (event_id, user_a);
create index connections_event_user_b_idx on public.connections (event_id, user_b);
create index event_attendees_user_idx on public.event_attendees (user_id);

-- ============================================================
-- Triggers
-- ============================================================

-- Perfil automático al registrarse (name/avatar desde el proveedor OAuth si existen)
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, name, avatar_url)
  values (
    new.id,
    coalesce(
      new.raw_user_meta_data ->> 'full_name',
      new.raw_user_meta_data ->> 'name',
      split_part(coalesce(new.email, ''), '@', 1)
    ),
    new.raw_user_meta_data ->> 'avatar_url'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- ============================================================
-- RLS
-- ============================================================

alter table public.profiles enable row level security;
alter table public.events enable row level security;
alter table public.event_attendees enable row level security;
alter table public.connections enable row level security;

-- security definer para evitar recursión de políticas sobre event_attendees
create or replace function public.is_event_attendee(p_event_id uuid, p_user_id uuid)
returns boolean
language sql
security definer
set search_path = ''
stable
as $$
  select exists (
    select 1 from public.event_attendees
    where event_id = p_event_id and user_id = p_user_id
  );
$$;

create policy "profiles_select_authenticated"
  on public.profiles for select to authenticated
  using (true);

create policy "profiles_update_own"
  on public.profiles for update to authenticated
  using (id = (select auth.uid()))
  with check (id = (select auth.uid()));

create policy "events_select_authenticated"
  on public.events for select to authenticated
  using (true);

create policy "events_insert_own"
  on public.events for insert to authenticated
  with check (created_by = (select auth.uid()));

create policy "events_update_creator"
  on public.events for update to authenticated
  using (created_by = (select auth.uid()));

create policy "attendees_select_coattendees"
  on public.event_attendees for select to authenticated
  using (public.is_event_attendee(event_id, (select auth.uid())));

create policy "attendees_insert_self"
  on public.event_attendees for insert to authenticated
  with check (user_id = (select auth.uid()));

create policy "attendees_delete_self"
  on public.event_attendees for delete to authenticated
  using (user_id = (select auth.uid()));

-- Solo veo mis aristas directas; el 2º grado sale de la RPC (que controla qué expone)
create policy "connections_select_own"
  on public.connections for select to authenticated
  using (user_a = (select auth.uid()) or user_b = (select auth.uid()));

create policy "connections_insert_endpoint"
  on public.connections for insert to authenticated
  with check (
    created_by = (select auth.uid())
    and (user_a = (select auth.uid()) or user_b = (select auth.uid()))
    and public.is_event_attendee(event_id, user_a)
    and public.is_event_attendee(event_id, user_b)
  );

create policy "connections_update_endpoint"
  on public.connections for update to authenticated
  using (user_a = (select auth.uid()) or user_b = (select auth.uid()));

create policy "connections_delete_endpoint"
  on public.connections for delete to authenticated
  using (user_a = (select auth.uid()) or user_b = (select auth.uid()));

-- ============================================================
-- RPC: mi grafo (1º + 2º grado) en un solo round-trip
-- Las notas de aristas ajenas se ocultan (privacidad).
-- ============================================================

create or replace function public.get_my_graph(p_event_id uuid)
returns json
language sql
security definer
set search_path = ''
stable
as $$
  with me as (
    select auth.uid() as uid
  ),
  first_deg as (
    select c.*
    from public.connections c, me
    where c.event_id = p_event_id
      and (c.user_a = me.uid or c.user_b = me.uid)
  ),
  neighbors as (
    select distinct case when f.user_a = m.uid then f.user_b else f.user_a end as uid
    from first_deg f, me m
  ),
  second_deg as (
    select c.*
    from public.connections c
    where c.event_id = p_event_id
      and (
        c.user_a in (select uid from neighbors)
        or c.user_b in (select uid from neighbors)
      )
  ),
  edges as (
    select distinct id, event_id, user_a, user_b, note, created_at
    from (
      select id, event_id, user_a, user_b, note, created_at from first_deg
      union
      select id, event_id, user_a, user_b, note, created_at from second_deg
    ) e
  ),
  node_ids as (
    select distinct uid
    from (
      select user_a as uid from edges
      union
      select user_b as uid from edges
      union
      select uid from me
    ) n
    where uid is not null
  )
  select json_build_object(
    'nodes', (
      select coalesce(json_agg(json_build_object(
        'id', p.id,
        'name', p.name,
        'headline', p.headline,
        'tags', p.tags,
        'avatarUrl', p.avatar_url
      )), '[]'::json)
      from public.profiles p
      where p.id in (select uid from node_ids)
    ),
    'edges', (
      select coalesce(json_agg(json_build_object(
        'id', e.id,
        'source', e.user_a,
        'target', e.user_b,
        'note', case
          when e.user_a = (select uid from me) or e.user_b = (select uid from me) then e.note
          else null
        end,
        'createdAt', e.created_at
      )), '[]'::json)
      from edges e
    )
  );
$$;

-- ============================================================
-- Realtime: aristas nuevas en vivo
-- ============================================================

alter publication supabase_realtime add table public.connections;
