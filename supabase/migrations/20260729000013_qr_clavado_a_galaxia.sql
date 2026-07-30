-- Una sola especie de QR (ADR 0005): muere el QR de evento y solo existe el
-- QR personal clavado a una galaxia (/u/slug?e=evento). Unirse a un evento
-- pasa SIEMPRE por una persona que ya está dentro — la única estrella que
-- puede estar sola es el creador, que nace dentro vía create_event.
--
-- Cambios:
--   1. is_event_attendee sale del API expuesto (schema private) y
--      handle_new_user deja de ser ejecutable por los roles de la API.
--   2. create_event: crear evento + entrar + activarlo, atómico. La puerta
--      /e/slug muere, así que el creador ya no puede depender del auto-join.
--   3. join_event_via_profile v3: el QR promete una galaxia concreta —
--      valida que el dueño esté dentro y devuelve estados distinguibles.
--   4. Mueren los caminos directos por REST: attendees_insert_self y
--      events_insert_own (todo INSERT pasa por las RPCs de arriba).
--   5. Un usuario solo ve sus propios eventos (creador o asistente).
--   6. get_event_by_slug: ficha solo-asistentes, con creador y stats.
--   7. get_event_graph: expone created_by para «creó esta galaxia».

-- ============================================================
-- 1. Endurecimiento (advisors): fuera del API expuesto
-- ============================================================

-- PostgREST solo expone el schema public: mover is_event_attendee a private
-- la saca del API sin romper nada — las políticas RLS que la usan la
-- referencian por OID y sobreviven al cambio de schema; las funciones que la
-- nombran en su cuerpo se redefinen todas más abajo.
create schema if not exists private;
grant usage on schema private to authenticated;

alter function public.is_event_attendee(uuid, uuid) set schema private;
revoke execute on function private.is_event_attendee(uuid, uuid) from public, anon;
grant execute on function private.is_event_attendee(uuid, uuid) to authenticated;

-- Solo el trigger de auth.users (que dispara supabase_auth_admin) la necesita
revoke execute on function public.handle_new_user() from public, anon, authenticated;
grant execute on function public.handle_new_user() to supabase_auth_admin;

-- Los dos últimos search_path mutables del advisor: ambas solo usan
-- funciones de pg_catalog, que sigue resolviéndose con search_path vacío.
alter function public.tag_slugify(text) set search_path = '';
alter function public.set_updated_at() set search_path = '';

-- ============================================================
-- 2. create_event: evento + creador dentro + galaxia activa, atómico
-- ============================================================

-- Antes la action insertaba el evento y el auto-join de /e/slug metía al
-- creador. Esa puerta muere: si el creador no naciera dentro, su QR clavado
-- no tendría galaxia que prometer. security definer porque el INSERT directo
-- sobre events y event_attendees queda revocado (sección 4).
create or replace function public.create_event(
  p_slug text,
  p_name text,
  p_city text default null,
  p_starts_at timestamptz default null
)
returns json
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_event_id uuid;
begin
  if auth.uid() is null then
    raise exception 'create_event requiere sesión';
  end if;
  if coalesce(trim(p_slug), '') = '' or coalesce(trim(p_name), '') = '' then
    raise exception 'create_event: slug y nombre obligatorios';
  end if;

  insert into public.events (slug, name, city, starts_at, created_by)
  values (
    left(trim(p_slug), 60),
    left(trim(p_name), 80),
    nullif(left(trim(coalesce(p_city, '')), 60), ''),
    p_starts_at,
    auth.uid()
  )
  returning id into v_event_id;

  insert into public.event_attendees (event_id, user_id)
  values (v_event_id, auth.uid());

  update public.profiles
  set active_event_id = v_event_id
  where id = auth.uid();

  return json_build_object('id', v_event_id, 'slug', left(trim(p_slug), 60));
end;
$$;

revoke execute on function public.create_event(text, text, text, timestamptz) from public, anon;
grant execute on function public.create_event(text, text, text, timestamptz) to authenticated;

-- ============================================================
-- 3. Membresía contagiosa v3: el QR va clavado a UNA galaxia
-- ============================================================

-- v2 te unía a la galaxia activa del dueño — un blanco móvil: el QR impreso
-- prometía un evento y podía entregarte otro. v3 recibe la galaxia escrita
-- en el QR, valida que el dueño siga dentro y une al escaneador a ESA.
-- Devuelve json con status en lugar de tabla vacía: la UI del encuentro
-- necesita distinguir por qué no hubo puerta.
drop function if exists public.join_event_via_profile(text);

create function public.join_event_via_profile(p_slug text, p_event_slug text)
returns json
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_owner uuid;
  v_event public.events%rowtype;
begin
  if auth.uid() is null then
    return json_build_object('status', 'sin-sesion');
  end if;

  select p.id into v_owner
  from public.profiles p
  where p.qr_slug = p_slug;

  if v_owner is null then
    return json_build_object('status', 'estrella-no-existe');
  end if;

  select e.* into v_event
  from public.events e
  where e.slug = p_event_slug;

  if v_event.id is null then
    return json_build_object('status', 'galaxia-no-existe');
  end if;

  -- El QR promete ESA galaxia: si su dueño ya no está dentro, no hay puerta
  if not private.is_event_attendee(v_event.id, v_owner) then
    return json_build_object('status', 'dueno-fuera');
  end if;

  insert into public.event_attendees (event_id, user_id)
  values (v_event.id, auth.uid())
  on conflict do nothing;

  -- El escaneo te sitúa: esa galaxia pasa a ser la tuya activa
  update public.profiles
  set active_event_id = v_event.id
  where id = auth.uid();

  return json_build_object(
    'status', 'ok',
    'event_id', v_event.id,
    'event_slug', v_event.slug,
    'event_name', v_event.name
  );
end;
$$;

revoke execute on function public.join_event_via_profile(text, text) from public, anon;
grant execute on function public.join_event_via_profile(text, text) to authenticated;

-- ============================================================
-- 4. Mueren los caminos directos por REST
-- ============================================================

-- Nadie entra a un evento (ni lo crea) escribiendo filas a mano: entrar es
-- escanear a una persona (join v3) y crear es create_event. Salir sí sigue
-- siendo un derecho directo (attendees_delete_self se queda).
drop policy "attendees_insert_self" on public.event_attendees;
revoke insert on public.event_attendees from authenticated;

drop policy "events_insert_own" on public.events;
revoke insert on public.events from authenticated;

-- ============================================================
-- 5. Un usuario solo ve SUS eventos (creador o asistente)
-- ============================================================

-- using(true) tenía sentido cuando /e/slug era una puerta pública; sin ella,
-- enumerar eventos ajenos solo filtraría datos (decisión 10 del grilling).
drop policy "events_select_authenticated" on public.events;

create policy "events_select_member"
  on public.events for select to authenticated
  using (
    created_by = (select auth.uid())
    or private.is_event_attendee(id, (select auth.uid()))
  );

-- ============================================================
-- 6. get_event_by_slug: ficha de la galaxia, solo para asistentes
-- ============================================================

-- De lookup público (la puerta que muere) a ficha gated: extraños reciben
-- cero filas (→ 404). Devuelve al creador con avatar y las stats que la
-- ficha muestra. `create or replace` no puede cambiar el retorno: drop.
drop function if exists public.get_event_by_slug(text);

create function public.get_event_by_slug(p_slug text)
returns table (
  id uuid,
  slug text,
  name text,
  city text,
  starts_at timestamptz,
  ends_at timestamptz,
  created_by uuid,
  creator_name text,
  creator_avatar text,
  attendee_count bigint,
  connection_count bigint
)
language sql
security definer
set search_path = ''
stable
as $$
  select e.id, e.slug, e.name, e.city, e.starts_at, e.ends_at,
         e.created_by, p.name, p.avatar_url,
         (select count(*) from public.event_attendees ea where ea.event_id = e.id),
         (select count(*) from public.connections c where c.event_id = e.id)
  from public.events e
  left join public.profiles p on p.id = e.created_by
  where e.slug = p_slug
    and (e.created_by = auth.uid() or private.is_event_attendee(e.id, auth.uid()));
$$;

revoke execute on function public.get_event_by_slug(text) from public, anon;
grant execute on function public.get_event_by_slug(text) to authenticated;

-- ============================================================
-- 7. get_event_graph: quién encendió esta galaxia
-- ============================================================

-- `createdBy` alimenta el «creó esta galaxia» del mini-perfil. Sin marca
-- visual en la estrella del grafo: el oro es solo para «tú».
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
