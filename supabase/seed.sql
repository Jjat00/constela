-- Seed de desarrollo local — datos reales y conectados (se aplica con `supabase db reset`, nunca en prod vía db push)

-- ============================================================
-- Evento real: Bogotá 2026
-- ============================================================

insert into public.events (slug, name, city, starts_at, ends_at)
values (
  'bogota-2026-08',
  'Bogotá Tech Meetup · Agosto 2026',
  'Bogotá · Colombia',
  '2026-08-20 18:00:00-05',
  '2026-08-20 23:00:00-05'
),
(
  'medellin-2026-09',
  'Medellín Dev Conference · Septiembre 2026',
  'Medellín · Colombia',
  '2026-09-15 09:00:00-05',
  '2026-09-15 18:00:00-05'
)
on conflict (slug) do nothing;

-- ============================================================
-- Personas demo: perfiles reales con headlines, roles e intereses
-- UUIDs fijos y ordenados para garantizar par canónico en conexiones
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
  ('a0000000-0000-4000-8000-000000000008'::uuid, 'irene@demo.constela',    'Irene Castaño'),
  ('b1111111-1111-4000-8000-000000000001'::uuid, 'jaime@demo.constela',    'Jaime Jjat')
) as d(id, email, full_name)
on conflict (id) do nothing;

-- Perfiles completos: headline, avatar, rol, tags e intenciones
-- onboarded_at = now() para que todos pasen la bienvenida automáticamente
update public.profiles p
set headline = d.headline,
    avatar_url = d.avatar,
    role = d.role,
    tags = d.tags,
    intents = d.intents,
    onboarded_at = now()
from (values
  ('a0000000-0000-4000-8000-000000000001'::uuid, 'Backend · APIs en Go y Rust',          array['backend'],        array['backend','infraestructura','datos'],   array['conocer-gente','ofrezco-mentoria'],  'https://i.pravatar.cc/100?img=12'),
  ('a0000000-0000-4000-8000-000000000002'::uuid, 'PM en fintech · en búsqueda activa',   array['product-manager'],array['producto','fintech','startups'],       array['contratando'],                       'https://i.pravatar.cc/100?img=32'),
  ('a0000000-0000-4000-8000-000000000003'::uuid, 'Frontend · React + TypeScript',        array['frontend'],       array['frontend','diseño','carrera'],         array['busco-trabajo','conocer-gente'],     'https://i.pravatar.cc/100?img=53'),
  ('a0000000-0000-4000-8000-000000000004'::uuid, 'Data scientist · ML en producción',    array['data-scientist'], array['ia','datos','machine-learning'],       array['ofrezco-mentoria'],                  'https://i.pravatar.cc/100?img=47'),
  ('a0000000-0000-4000-8000-000000000005'::uuid, 'Growth marketer · edtech',             array['marketing'],      array['marketing','comunidad','startups'],    array['busco-clientes','contratando'],      'https://i.pravatar.cc/100?img=15'),
  ('a0000000-0000-4000-8000-000000000006'::uuid, 'Diseñadora de producto · UX',          array['product-design'], array['diseño','producto','carrera'],         array['busco-trabajo'],                     'https://i.pravatar.cc/100?img=45'),
  ('a0000000-0000-4000-8000-000000000007'::uuid, 'SRE · Kubernetes y AWS',               array['devops'],         array['infraestructura','open-source'],       array['conocer-gente','contratando'],       'https://i.pravatar.cc/100?img=68'),
  ('a0000000-0000-4000-8000-000000000008'::uuid, 'Fundadora · edtech + IA',              array['founder'],        array['startups','educacion','ia'],           array['busco-inversion','contratando'],     'https://i.pravatar.cc/100?img=25'),
  ('b1111111-1111-4000-8000-000000000001'::uuid, 'Creador de Constela · full-stack',     array['founder'],        array['frontend','backend','open-source','ia'],array['conocer-gente'],                    'https://i.pravatar.cc/100?img=42')
) as d(id, headline, role, tags, intents, avatar)
where p.id = d.id;

-- ============================================================
-- Asistentes: todos en Bogotá 2026 + Jaime también en Medellín
-- ============================================================

insert into public.event_attendees (event_id, user_id)
select e.id, u.uid
from public.events e,
  unnest(array[
    'a0000000-0000-4000-8000-000000000001'::uuid,
    'a0000000-0000-4000-8000-000000000002'::uuid,
    'a0000000-0000-4000-8000-000000000003'::uuid,
    'a0000000-0000-4000-8000-000000000004'::uuid,
    'a0000000-0000-4000-8000-000000000005'::uuid,
    'a0000000-0000-4000-8000-000000000006'::uuid,
    'a0000000-0000-4000-8000-000000000007'::uuid,
    'a0000000-0000-4000-8000-000000000008'::uuid,
    'b1111111-1111-4000-8000-000000000001'::uuid
  ]::uuid[]) as u(uid)
where e.slug = 'bogota-2026-08'
on conflict do nothing;

-- Jaime (Medellín)
insert into public.event_attendees (event_id, user_id)
select e.id, 'b1111111-1111-4000-8000-000000000001'::uuid
from public.events e
where e.slug = 'medellin-2026-09'
on conflict do nothing;

-- ============================================================
-- Conexiones en Bogotá 2026
-- Estructura: triángulos cerrados, cadenas, puentes y conexiones con Jaime
-- Par canónico garantizado: least(a) < greatest(b)
-- ============================================================

with datos as (
  select * from (values
    -- Triángulo 1: Backend + Datos + Jaime (infraestructura)
    ('a0000000-0000-4000-8000-000000000001'::uuid, 'a0000000-0000-4000-8000-000000000004'::uuid, 'Cómo escalar pipelines de ML',    'a0000000-0000-4000-8000-000000000001'::uuid),
    ('a0000000-0000-4000-8000-000000000001'::uuid, 'b1111111-1111-4000-8000-000000000001'::uuid, 'Constela · stack backend Go',    'a0000000-0000-4000-8000-000000000001'::uuid),
    ('a0000000-0000-4000-8000-000000000004'::uuid, 'b1111111-1111-4000-8000-000000000001'::uuid, 'IA en producción · vector DBs', 'a0000000-0000-4000-8000-000000000004'::uuid),

    -- Triángulo 2: Frontend + Diseño + PM
    ('a0000000-0000-4000-8000-000000000002'::uuid, 'a0000000-0000-4000-8000-000000000003'::uuid, 'Design to code en Next.js',      'a0000000-0000-4000-8000-000000000002'::uuid),
    ('a0000000-0000-4000-8000-000000000002'::uuid, 'a0000000-0000-4000-8000-000000000006'::uuid, 'Roadmap de fintech',             'a0000000-0000-4000-8000-000000000002'::uuid),
    ('a0000000-0000-4000-8000-000000000003'::uuid, 'a0000000-0000-4000-8000-000000000006'::uuid, 'Design systems escalables',     'a0000000-0000-4000-8000-000000000003'::uuid),

    -- Triángulo 3: Growth + Marketing + Founder
    ('a0000000-0000-4000-8000-000000000005'::uuid, 'a0000000-0000-4000-8000-000000000008'::uuid, 'Growth para edtech',            'a0000000-0000-4000-8000-000000000005'::uuid),
    ('a0000000-0000-4000-8000-000000000005'::uuid, 'b1111111-1111-4000-8000-000000000001'::uuid, 'Constela · propuesta de valor', 'a0000000-0000-4000-8000-000000000005'::uuid),
    ('a0000000-0000-4000-8000-000000000008'::uuid, 'b1111111-1111-4000-8000-000000000001'::uuid, 'Constelación en edtech',        'a0000000-0000-4000-8000-000000000008'::uuid),

    -- Triángulo 4: DevOps + SRE + Backend
    ('a0000000-0000-4000-8000-000000000001'::uuid, 'a0000000-0000-4000-8000-000000000007'::uuid, 'Kubernetes en Rust',            'a0000000-0000-4000-8000-000000000001'::uuid),
    ('a0000000-0000-4000-8000-000000000007'::uuid, 'b1111111-1111-4000-8000-000000000001'::uuid, 'Infrastructure as code',        'a0000000-0000-4000-8000-000000000007'::uuid),

    -- Puentes adicionales
    ('a0000000-0000-4000-8000-000000000003'::uuid, 'a0000000-0000-4000-8000-000000000004'::uuid, 'Frontend con IA integrada',    'a0000000-0000-4000-8000-000000000003'::uuid),
    ('a0000000-0000-4000-8000-000000000002'::uuid, 'a0000000-0000-4000-8000-000000000008'::uuid, 'Financiación de edtech',        'a0000000-0000-4000-8000-000000000002'::uuid),
    ('a0000000-0000-4000-8000-000000000006'::uuid, 'a0000000-0000-4000-8000-000000000007'::uuid, 'UX en infraestructura',         'a0000000-0000-4000-8000-000000000006'::uuid)
  ) as d(a, b, note, created_by)
),
aristas as (
  insert into public.connections (event_id, user_a, user_b, created_by)
  select e.id, least(d.a, d.b), greatest(d.a, d.b), d.created_by
  from public.events e, datos d
  where e.slug = 'bogota-2026-08'
  on conflict do nothing
  returning id, user_a, user_b
)
-- La nota es privada por lado (migración 0014): la del seed pertenece a
-- quien creó la arista, que era quien la escribía en el flujo retirado.
insert into public.connection_notes (connection_id, author_id, note)
select a.id, d.created_by, d.note
from aristas a
join datos d
  on a.user_a = least(d.a, d.b) and a.user_b = greatest(d.a, d.b)
on conflict do nothing;

-- ============================================================
-- Trigger: toda nueva estrella se conecta con tres personas al unirse a Bogotá
-- No aparece sola; sale del seed ya integrada en la constelación.
-- Vive solo en desarrollo local (`supabase db reset`); nunca en producción.
-- ============================================================

create or replace function public.seed_connect_newcomer()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  bogota_event uuid;
  demo_people uuid[] := array[
    'a0000000-0000-4000-8000-000000000001'::uuid,
    'a0000000-0000-4000-8000-000000000002'::uuid,
    'a0000000-0000-4000-8000-000000000003'::uuid,
    'a0000000-0000-4000-8000-000000000004'::uuid,
    'a0000000-0000-4000-8000-000000000005'::uuid,
    'a0000000-0000-4000-8000-000000000006'::uuid,
    'a0000000-0000-4000-8000-000000000007'::uuid,
    'a0000000-0000-4000-8000-000000000008'::uuid,
    'b1111111-1111-4000-8000-000000000001'::uuid
  ]::uuid[];
  -- Tríada de conexión: los tres que forman un triángulo con el newcomer
  mates uuid[] := array[
    'a0000000-0000-4000-8000-000000000001'::uuid,
    'a0000000-0000-4000-8000-000000000004'::uuid,
    'b1111111-1111-4000-8000-000000000001'::uuid
  ]::uuid[];
  mate uuid;
  arista uuid;
begin
  select id into bogota_event from public.events where slug = 'bogota-2026-08';

  -- Solo en Bogotá, y si no es ya del seed
  if new.event_id is distinct from bogota_event or new.user_id = any (demo_people)
  then
    return new;
  end if;

  -- Conecta con los tres mates
  foreach mate in array mates loop
    -- «on conflict do nothing» no devuelve fila: sin el reset, `arista`
    -- arrastraría el id de la vuelta anterior del loop
    arista := null;
    insert into public.connections (event_id, user_a, user_b, created_by)
    values (
      new.event_id,
      least(new.user_id, mate),
      greatest(new.user_id, mate),
      new.user_id
    )
    on conflict do nothing
    returning id into arista;

    -- Nota privada del recién llegado (0014): así abre el mini-perfil de sus
    -- mates con una nota ya escrita, sin haberla tecleado
    if arista is not null then
      insert into public.connection_notes (connection_id, author_id, note)
      values (arista, new.user_id, 'nos presentaron en la entrada')
      on conflict do nothing;
    end if;
  end loop;

  return new;
end;
$$;

create or replace trigger seed_connect_newcomer_on_join
after insert on public.event_attendees
for each row execute function public.seed_connect_newcomer();
