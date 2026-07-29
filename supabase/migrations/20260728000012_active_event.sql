-- El evento activo pasa de ser implícito ("tu join más reciente") a una
-- elección explícita: profiles.active_event_id. Todo lo que el usuario ve
-- (universo, QR, eventos) y lo que promete su QR (a qué evento entra quien
-- lo escanea) sale de esta columna. Fallback en la app: el join más reciente.

alter table public.profiles
  add column active_event_id uuid references public.events(id) on delete set null;

-- Arranque: el evento más reciente de cada quien — el comportamiento vigente
update public.profiles p
set active_event_id = (
  select ea.event_id
  from public.event_attendees ea
  where ea.user_id = p.id
  order by ea.joined_at desc
  limit 1
);

-- Membresía contagiosa v2: entras al evento ACTIVO del dueño del QR (antes:
-- su join más reciente, que podía no ser el evento donde estaba parado), y
-- ese evento pasa a ser también tu evento activo — el escaneo te sitúa.
create or replace function public.join_event_via_profile(p_slug text)
returns table (
  event_id uuid,
  event_slug text,
  event_name text
)
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_owner uuid;
  v_event public.events%rowtype;
begin
  if auth.uid() is null then
    return;
  end if;

  select p.id into v_owner
  from public.profiles p
  where p.qr_slug = p_slug;

  if v_owner is null then
    return;
  end if;

  select e.* into v_event
  from public.profiles p
  join public.events e on e.id = p.active_event_id
  where p.id = v_owner;

  -- Dueño sin evento activo elegido: su join más reciente
  if v_event.id is null then
    select e.* into v_event
    from public.event_attendees ea
    join public.events e on e.id = ea.event_id
    where ea.user_id = v_owner
    order by ea.joined_at desc
    limit 1;
  end if;

  if v_event.id is null then
    return;
  end if;

  insert into public.event_attendees (event_id, user_id)
  values (v_event.id, auth.uid())
  on conflict do nothing;

  update public.profiles
  set active_event_id = v_event.id
  where id = auth.uid();

  return query select v_event.id, v_event.slug, v_event.name;
end;
$$;
