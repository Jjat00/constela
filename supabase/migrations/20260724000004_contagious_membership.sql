-- Membresía contagiosa (ADR 0001): escanear el QR personal de alguien que ya
-- está en un evento te une a su evento más reciente automáticamente, y así
-- sucesivamente. El visitante aún no comparte evento con el escaneado, así que
-- RLS no le deja ver la asistencia ajena: esta RPC security definer hace el
-- join de forma controlada y expone únicamente el evento al que entraste.

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
  from public.event_attendees ea
  join public.events e on e.id = ea.event_id
  where ea.user_id = v_owner
  order by ea.joined_at desc
  limit 1;

  if v_event.id is null then
    return;
  end if;

  insert into public.event_attendees (event_id, user_id)
  values (v_event.id, auth.uid())
  on conflict do nothing;

  return query select v_event.id, v_event.slug, v_event.name;
end;
$$;

revoke execute on function public.join_event_via_profile(text) from public, anon;
grant execute on function public.join_event_via_profile(text) to authenticated;
