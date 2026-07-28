-- Seed de desarrollo local (se aplica con `supabase db reset`, nunca en prod vía db push)

insert into public.events (slug, name, starts_at, ends_at)
values (
  'demo-bogota',
  '[demo] Evento de prueba local',
  '2026-08-20 17:00:00-05',
  '2026-08-20 22:00:00-05'
)
on conflict (slug) do nothing;

-- ============================================================
-- Personas demo: pueblan la constelación del evento de prueba.
-- Se insertan en auth.users (el trigger handle_new_user crea el perfil);
-- UUIDs fijos y ordenados para poder armar conexiones con par canónico.
-- ============================================================

insert into auth.users (
  id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at
)
select
  d.id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
  d.email, extensions.crypt('demo-constela', extensions.gen_salt('bf')), now(),
  '{"provider":"email","providers":["email"]}'::jsonb,
  jsonb_build_object('full_name', d.full_name), now(), now()
from (values
  ('a0000000-0000-4000-8000-000000000001'::uuid, 'beto@demo.constela',     'Beto Cárdenas'),
  ('a0000000-0000-4000-8000-000000000002'::uuid, 'carla@demo.constela',    'Carla Mendoza'),
  ('a0000000-0000-4000-8000-000000000003'::uuid, 'diego@demo.constela',    'Diego Rojas'),
  ('a0000000-0000-4000-8000-000000000004'::uuid, 'elena@demo.constela',    'Elena Vargas'),
  ('a0000000-0000-4000-8000-000000000005'::uuid, 'fabian@demo.constela',   'Fabián Torres'),
  ('a0000000-0000-4000-8000-000000000006'::uuid, 'gabriela@demo.constela', 'Gabriela Pinzón'),
  ('a0000000-0000-4000-8000-000000000007'::uuid, 'hugo@demo.constela',     'Hugo Salazar'),
  ('a0000000-0000-4000-8000-000000000008'::uuid, 'irene@demo.constela',    'Irene Castaño')
) as d(id, email, full_name)
on conflict (id) do nothing;

-- Rol, intereses e intención salen del catálogo curado (migración
-- 20260727000007): así el filtro de la constelación tiene con qué jugar en
-- local. onboarded_at marcado: las personas demo no pasan por la bienvenida.
update public.profiles p
set headline = d.headline,
    avatar_url = d.avatar,
    role = d.role,
    tags = d.tags,
    intents = d.intents,
    onboarded_at = now()
from (values
  ('a0000000-0000-4000-8000-000000000001'::uuid, 'Backend · APIs y datos',      'backend',        array['backend','datos','ia'],                array['conocer-gente'],                 'https://i.pravatar.cc/100?img=12'),
  ('a0000000-0000-4000-8000-000000000002'::uuid, 'Product manager en fintech',  'product-manager',array['producto','fintech','carrera'],        array['contratando'],                   'https://i.pravatar.cc/100?img=32'),
  ('a0000000-0000-4000-8000-000000000003'::uuid, 'Frontend con ojo de diseño',  'frontend',       array['frontend','diseno','carrera'],         array['busco-trabajo'],                 'https://i.pravatar.cc/100?img=53'),
  ('a0000000-0000-4000-8000-000000000004'::uuid, 'Data science · IA aplicada',  'data-scientist', array['ia','datos','educacion'],              array['ofrezco-mentoria'],              'https://i.pravatar.cc/100?img=47'),
  ('a0000000-0000-4000-8000-000000000005'::uuid, 'Growth y comunidad',          'marketing',      array['marketing','comunidad','startups'],    array['busco-clientes'],                'https://i.pravatar.cc/100?img=15'),
  ('a0000000-0000-4000-8000-000000000006'::uuid, 'Diseñadora de producto',      'product-design', array['diseno','producto'],                   array['busco-trabajo'],                 'https://i.pravatar.cc/100?img=45'),
  ('a0000000-0000-4000-8000-000000000007'::uuid, 'SRE · plataforma',            'devops',         array['infraestructura','open-source'],       array['conocer-gente'],                 'https://i.pravatar.cc/100?img=68'),
  ('a0000000-0000-4000-8000-000000000008'::uuid, 'Fundadora · edtech con IA',   'founder',        array['startups','educacion','ia'],           array['busco-inversion','contratando'], 'https://i.pravatar.cc/100?img=25')
) as d(id, headline, role, tags, intents, avatar)
where p.id = d.id;

insert into public.event_attendees (event_id, user_id)
select e.id, u.uid
from public.events e,
  unnest(array[
    'a0000000-0000-4000-8000-000000000001',
    'a0000000-0000-4000-8000-000000000002',
    'a0000000-0000-4000-8000-000000000003',
    'a0000000-0000-4000-8000-000000000004',
    'a0000000-0000-4000-8000-000000000005',
    'a0000000-0000-4000-8000-000000000006',
    'a0000000-0000-4000-8000-000000000007',
    'a0000000-0000-4000-8000-000000000008'
  ]::uuid[]) as u(uid)
where e.slug = 'demo-bogota'
on conflict do nothing;

-- Conexiones demo: dos triángulos cerrados, una cadena y un nodo puente.
-- Par canónico garantizado: los UUIDs están ordenados por su último dígito.
insert into public.connections (event_id, user_a, user_b, note, created_by)
select e.id, d.a, d.b, d.note, d.a
from public.events e,
  (values
    ('a0000000-0000-4000-8000-000000000001'::uuid, 'a0000000-0000-4000-8000-000000000002'::uuid, 'Hablamos de pricing por uso'),
    ('a0000000-0000-4000-8000-000000000002'::uuid, 'a0000000-0000-4000-8000-000000000003'::uuid, null),
    ('a0000000-0000-4000-8000-000000000001'::uuid, 'a0000000-0000-4000-8000-000000000003'::uuid, 'Triángulo cerrado en el demo ✦'),
    ('a0000000-0000-4000-8000-000000000003'::uuid, 'a0000000-0000-4000-8000-000000000004'::uuid, 'RAG en producción'),
    ('a0000000-0000-4000-8000-000000000004'::uuid, 'a0000000-0000-4000-8000-000000000005'::uuid, null),
    ('a0000000-0000-4000-8000-000000000003'::uuid, 'a0000000-0000-4000-8000-000000000005'::uuid, null),
    ('a0000000-0000-4000-8000-000000000002'::uuid, 'a0000000-0000-4000-8000-000000000006'::uuid, 'Design systems'),
    ('a0000000-0000-4000-8000-000000000006'::uuid, 'a0000000-0000-4000-8000-000000000007'::uuid, null),
    ('a0000000-0000-4000-8000-000000000005'::uuid, 'a0000000-0000-4000-8000-000000000008'::uuid, 'Flutter + IA en edtech'),
    ('a0000000-0000-4000-8000-000000000007'::uuid, 'a0000000-0000-4000-8000-000000000008'::uuid, null)
  ) as d(a, b, note)
where e.slug = 'demo-bogota'
on conflict do nothing;

-- ============================================================
-- Regla de pruebas: mi estrella nunca aparece sola.
--
-- Los usuarios reales se crean al hacer login, después de este seed, así que
-- sus conexiones no se pueden dejar escritas aquí. En su lugar queda este
-- disparador: al entrar alguien al evento demo que no sea una de las ocho
-- personas de arriba, se le tienden tres líneas. Así la constelación tiene
-- aristas propias y triángulos desde el primer segundo, sin escanear nada.
--
-- Vive solo en el seed (`supabase db reset` local); nunca llega a producción,
-- que se despliega con las migraciones de supabase/migrations/.
-- ============================================================

create or replace function public.seed_connect_newcomer()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  demo_event uuid;
  demo_people uuid[] := array[
    'a0000000-0000-4000-8000-000000000001',
    'a0000000-0000-4000-8000-000000000002',
    'a0000000-0000-4000-8000-000000000003',
    'a0000000-0000-4000-8000-000000000004',
    'a0000000-0000-4000-8000-000000000005',
    'a0000000-0000-4000-8000-000000000006',
    'a0000000-0000-4000-8000-000000000007',
    'a0000000-0000-4000-8000-000000000008'
  ]::uuid[];
  -- Beto, Diego y Fabián: entre ellos ya hay aristas, así que estas tres
  -- conexiones cierran además un triángulo con la estrella recién llegada.
  mates uuid[] := array[
    'a0000000-0000-4000-8000-000000000001',
    'a0000000-0000-4000-8000-000000000003',
    'a0000000-0000-4000-8000-000000000005'
  ]::uuid[];
  mate uuid;
begin
  select id into demo_event from public.events where slug = 'demo-bogota';

  if new.event_id is distinct from demo_event or new.user_id = any (demo_people)
  then
    return new;
  end if;

  foreach mate in array mates loop
    insert into public.connections (event_id, user_a, user_b, note, created_by)
    values (
      new.event_id,
      least(new.user_id, mate),
      greatest(new.user_id, mate),
      'conexión de prueba del seed ✦',
      new.user_id
    )
    on conflict do nothing;
  end loop;

  return new;
end;
$$;

create or replace trigger seed_connect_newcomer_on_join
after insert on public.event_attendees
for each row execute function public.seed_connect_newcomer();
