-- Catálogo vivo de tags (ADR 0004): las estrellas se describen con un rol,
-- intereses y (opcionalmente) qué buscan en el evento. El catálogo arranca
-- curado pero CRECE: si alguien escribe un tag que no existe, queda guardado
-- para que el siguiente lo elija en vez de inventar un duplicado.
--
-- La clave primaria es (category, slug): el mismo texto puede ser rol e
-- interés a la vez ("diseño" como oficio y como tema de conversación) sin
-- colisionar, y cada campo del perfil sabe siempre en qué categoría buscar.
-- Los slugs de profiles.role/tags/intents no llevan FK (una FK compuesta
-- exigiría guardar la categoría en cada fila): la integridad la garantiza
-- ensure_tags, único camino de escritura al catálogo.

-- ============================================================
-- Normalización: un tag es su slug
-- ============================================================

-- "Full Stack", "full-stack" y "Full  stack " son el mismo tag. Sin acentos
-- para que "diseño" y "diseno" tampoco se dupliquen.
create or replace function public.tag_slugify(p_label text)
returns text
language sql
immutable
as $$
  select nullif(
    trim(both '-' from
      regexp_replace(
        lower(translate(
          coalesce(p_label, ''),
          'áàâäãåéèêëíìîïóòôöõúùûüñçÁÀÂÄÃÅÉÈÊËÍÌÎÏÓÒÔÖÕÚÙÛÜÑÇ',
          'aaaaaaeeeeiiiiooooouuuuncAAAAAAEEEEIIIIOOOOOUUUUNC'
        )),
        '[^a-z0-9]+', '-', 'g'
      )
    ),
    ''
  );
$$;

-- ============================================================
-- Catálogo
-- ============================================================

-- El slug es una columna generada: es imposible que se desalinee del label y
-- que escribir el label de un tag curado cree un gemelo. `aliases` recoge las
-- otras formas de decir lo mismo ("sre" → devops, "pm" → product manager):
-- ensure_tags las resuelve al slug canónico antes de crear nada.
create table public.tags (
  category text not null check (category in ('rol', 'interes', 'intencion')),
  label text not null,
  slug text generated always as (public.tag_slugify(label)) stored,
  aliases text[] not null default '{}',
  -- is_curated: vino con la app; false = lo creó una persona en su onboarding
  is_curated boolean not null default false,
  created_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  primary key (category, slug)
);

create index tags_category_label_idx on public.tags (category, label);
create index tags_aliases_idx on public.tags using gin (aliases);

alter table public.tags enable row level security;

-- El catálogo es público: /u/[slug] renderiza sin sesión y necesita labels
create policy "tags_select_all"
  on public.tags for select to anon, authenticated
  using (true);

grant select on public.tags to anon, authenticated;

-- ============================================================
-- Perfil: rol (uno), intereses (varios, ya existía como tags) e intención
-- ============================================================

alter table public.profiles
  add column role text,
  add column intents text[] not null default '{}',
  -- Marca de onboarding: null = nunca completó la bienvenida
  add column onboarded_at timestamptz;

create index profiles_role_idx on public.profiles (role) where role is not null;
create index profiles_tags_idx on public.profiles using gin (tags);
create index profiles_intents_idx on public.profiles using gin (intents);

-- ============================================================
-- Semilla curada
-- ============================================================

insert into public.tags (category, label, aliases, is_curated) values
  -- Roles: qué haces
  ('rol', 'frontend',             array['front-end','front','web'],                 true),
  ('rol', 'backend',              array['back-end','servidor'],                     true),
  ('rol', 'full stack',           array['fullstack','full-stack-developer'],        true),
  ('rol', 'móvil',                array['mobile','android','ios','flutter'],        true),
  ('rol', 'ai engineer',          array['ai','ia','inteligencia-artificial'],       true),
  ('rol', 'agentic engineer',     array['agentes','agent-engineer','agentico'],     true),
  ('rol', 'ml engineer',          array['machine-learning','ml'],                   true),
  ('rol', 'data engineer',        array['ingeniero-de-datos','datos'],              true),
  ('rol', 'data scientist',       array['cientifico-de-datos','ds'],                true),
  ('rol', 'data analyst',         array['analista-de-datos','bi'],                  true),
  ('rol', 'devops',               array['sre','platform','infraestructura'],        true),
  ('rol', 'cloud engineer',       array['cloud','aws','gcp','azure'],               true),
  ('rol', 'seguridad',            array['security','appsec','pentester'],           true),
  ('rol', 'qa',                   array['testing','tester','qa-automation'],        true),
  ('rol', 'arquitecto',           array['architect','solution-architect'],          true),
  ('rol', 'embebidos',            array['embedded','iot','firmware'],               true),
  ('rol', 'game dev',             array['gamedev','videojuegos','unity'],           true),
  ('rol', 'product manager',      array['pm','producto','product-owner','po'],      true),
  ('rol', 'ux research',          array['ux','investigacion','ux-researcher'],      true),
  ('rol', 'ui design',            array['ui','ux-ui','uiux','ui-designer'],         true),
  ('rol', 'product design',       array['diseno-de-producto','product-designer'],   true),
  ('rol', 'diseño',               array['design','disenador','grafico'],            true),
  ('rol', 'devrel',               array['developer-relations','comunidad'],         true),
  ('rol', 'growth',               array['marketing','growth-hacker'],               true),
  ('rol', 'contenido',            array['content','technical-writer','writer'],     true),
  ('rol', 'founder',              array['fundador','cofounder','cofundador'],       true),
  ('rol', 'ceo',                  array['c-level','director'],                      true),
  ('rol', 'cto',                  array['director-de-tecnologia'],                  true),
  ('rol', 'engineering manager',  array['em','tech-lead','lider-tecnico','vp'],     true),
  ('rol', 'inversionista',        array['investor','vc','angel'],                   true),
  ('rol', 'recruiter',            array['reclutador','talento','hr','rrhh'],        true),
  ('rol', 'ventas',               array['sales','bd','business-development'],       true),
  ('rol', 'estudiante',           array['student','universitario'],                 true),
  ('rol', 'freelance',            array['consultor','contractor','independiente'],  true),
  ('rol', 'docente',              array['educator','profesor','mentor','teacher'],  true),

  -- Intereses: de qué quieres hablar
  ('interes', 'ia',               array['inteligencia-artificial','ai'],            true),
  ('interes', 'llms',             array['llm','gpt','modelos-de-lenguaje'],         true),
  ('interes', 'agentes de ia',    array['agentes','ai-agents','agentic-ai'],        true),
  ('interes', 'rag',              array['retrieval','vector-db','embeddings'],      true),
  ('interes', 'mlops',            array['ml-ops'],                                  true),
  ('interes', 'computer vision',  array['vision','cv'],                             true),
  ('interes', 'prompt engineering', array['prompts','prompting'],                   true),
  ('interes', 'open source',      array['oss','codigo-abierto'],                    true),
  ('interes', 'cloud',            array['aws','gcp','azure'],                       true),
  ('interes', 'kubernetes',       array['k8s','docker','contenedores'],             true),
  ('interes', 'devtools',         array['herramientas','dx'],                       true),
  ('interes', 'apis',             array['api','rest','graphql'],                    true),
  ('interes', 'realtime',         array['tiempo-real','websockets'],                true),
  ('interes', 'performance',      array['rendimiento','core-web-vitals'],           true),
  ('interes', 'accesibilidad',    array['a11y','accessibility'],                    true),
  ('interes', 'design systems',   array['design-system','sistemas-de-diseno'],      true),
  ('interes', 'no code',          array['nocode','low-code'],                       true),
  ('interes', 'web3',             array['blockchain','cripto','crypto'],            true),
  ('interes', 'ciberseguridad',   array['seguridad','infosec','hacking'],           true),
  ('interes', 'privacidad',       array['datos-personales','gdpr'],                 true),
  ('interes', 'robótica',         array['robotics','drones'],                       true),
  ('interes', 'hardware',         array['iot','maker','electronica'],               true),
  ('interes', 'gaming',           array['videojuegos','games'],                     true),
  ('interes', 'ar vr',            array['ar','vr','xr','realidad-virtual'],         true),
  ('interes', 'startups',         array['startup','emprendimiento'],                true),
  ('interes', 'fundraising',      array['inversion','levantar-capital'],            true),
  ('interes', 'saas',             array['b2b'],                                     true),
  ('interes', 'fintech',          array['pagos','banca'],                           true),
  ('interes', 'healthtech',       array['salud','biotech'],                         true),
  ('interes', 'edtech',           array['educacion'],                               true),
  ('interes', 'ecommerce',        array['retail','comercio'],                       true),
  ('interes', 'sostenibilidad',   array['climatech','green'],                       true),
  ('interes', 'comunidad',        array['community','meetups'],                     true),
  ('interes', 'trabajo remoto',   array['remoto','remote'],                         true),
  ('interes', 'carrera',          array['career','crecimiento-profesional'],        true),
  ('interes', 'python',           array['django','fastapi'],                        true),
  ('interes', 'typescript',       array['javascript','js','ts'],                    true),
  ('interes', 'go',               array['golang'],                                  true),
  ('interes', 'rust',             array[]::text[],                                  true),
  ('interes', 'java',             array['spring','kotlin-jvm'],                     true),
  ('interes', 'kotlin',           array[]::text[],                                  true),
  ('interes', 'swift',            array['ios-dev'],                                 true),
  ('interes', 'php',              array['laravel'],                                 true),
  ('interes', 'ruby',             array['rails'],                                   true),
  ('interes', 'elixir',           array['phoenix'],                                 true),
  ('interes', 'react',            array['react-native'],                            true),
  ('interes', 'next.js',          array['nextjs','next'],                           true),
  ('interes', 'node',             array['nodejs','node-js'],                        true),
  ('interes', 'postgres',         array['postgresql','sql','supabase'],             true),

  -- Intención: a qué viniste
  ('intencion', 'contratando',      array['estoy-contratando','hiring','vacantes'], true),
  ('intencion', 'busco trabajo',    array['buscando-trabajo','empleo','job'],       true),
  ('intencion', 'busco cofundador', array['cofounder','socio'],                     true),
  ('intencion', 'busco clientes',   array['clientes','vender'],                     true),
  ('intencion', 'busco inversión',  array['inversion','fundraising'],               true),
  ('intencion', 'busco mentoría',   array['mentoria','mentor'],                     true),
  ('intencion', 'ofrezco mentoría', array['puedo-ayudar','mentorear'],              true),
  ('intencion', 'vine a aprender',  array['aprender','learning'],                   true),
  ('intencion', 'conocer gente',    array['networking','hacer-amigos'],             true)
on conflict (category, slug) do nothing;

-- ============================================================
-- RPC: escribir en el catálogo (único camino)
-- ============================================================

-- Recibe lo que la persona escribió y devuelve los slugs canónicos, creando
-- en el catálogo solo lo que de verdad no existía. Escribir "Full Stack",
-- "fullstack" o "full-stack" devuelve siempre el mismo tag: primero por slug,
-- después por alias. Así el catálogo crece sin llenarse de gemelos.
create or replace function public.ensure_tags(p_category text, p_labels text[])
returns text[]
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_label text;
  v_slug text;
  v_canonical text;
  v_slugs text[] := '{}';
begin
  if auth.uid() is null then
    raise exception 'ensure_tags requiere sesión';
  end if;

  if p_category not in ('rol', 'interes', 'intencion') then
    raise exception 'categoría de tag inválida: %', p_category;
  end if;

  foreach v_label in array coalesce(p_labels, '{}'::text[]) loop
    -- Tope defensivo: nadie describe su estrella con 40 tags, pero un cliente
    -- manipulado sí podría intentar sembrar el catálogo de basura.
    exit when coalesce(array_length(v_slugs, 1), 0) >= 40;

    v_slug := public.tag_slugify(v_label);
    continue when v_slug is null;

    select t.slug into v_canonical
    from public.tags t
    where t.category = p_category
      and (t.slug = v_slug or v_slug = any (t.aliases))
    limit 1;

    if v_canonical is null then
      insert into public.tags (category, label, created_by)
      values (
        p_category,
        lower(left(regexp_replace(trim(v_label), '\s+', ' ', 'g'), 40)),
        auth.uid()
      )
      on conflict (category, slug) do nothing
      returning slug into v_canonical;

      -- Carrera perdida contra otra sesión que insertó el mismo tag
      v_canonical := coalesce(v_canonical, v_slug);
    end if;

    continue when v_canonical = any (v_slugs);
    v_slugs := v_slugs || v_canonical;
  end loop;

  return v_slugs;
end;
$$;

revoke execute on function public.ensure_tags(text, text[]) from public, anon;
grant execute on function public.ensure_tags(text, text[]) to authenticated;

-- ============================================================
-- RPC: leer el catálogo con su popularidad
-- ============================================================

-- Los tags más usados primero: el onboarding muestra lo que la gente de
-- verdad eligió, no un orden alfabético muerto. security definer porque el
-- conteo recorre todos los perfiles y solo expone agregados del catálogo.
create or replace function public.list_tags()
returns table (
  category text,
  slug text,
  label text,
  aliases text[],
  is_curated boolean,
  uses bigint
)
language sql
security definer
set search_path = ''
stable
as $$
  with used as (
    select 'rol'::text as category, p.role as slug, count(*) as uses
    from public.profiles p
    where p.role is not null
    group by p.role
    union all
    select 'interes', t, count(*)
    from public.profiles p, unnest(p.tags) as t
    group by t
    union all
    select 'intencion', i, count(*)
    from public.profiles p, unnest(p.intents) as i
    group by i
  )
  select t.category, t.slug, t.label, t.aliases, t.is_curated,
         coalesce(u.uses, 0) as uses
  from public.tags t
  left join used u on u.category = t.category and u.slug = t.slug
  order by t.category, coalesce(u.uses, 0) desc, t.label;
$$;

revoke execute on function public.list_tags() from public;
grant execute on function public.list_tags() to anon, authenticated;

-- ============================================================
-- El grafo y el perfil público hablan el nuevo idioma
-- ============================================================

-- Los nodos llevan rol e intención además de intereses: el filtro de la
-- constelación se resuelve en el cliente, sin round-trips por cada chip.
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

drop function if exists public.get_profile_by_slug(text);

create or replace function public.get_profile_by_slug(p_slug text)
returns table (
  id uuid,
  name text,
  headline text,
  role text,
  tags text[],
  intents text[],
  avatar_url text
)
language sql
security definer
set search_path = ''
stable
as $$
  select p.id, p.name, p.headline, p.role, p.tags, p.intents, p.avatar_url
  from public.profiles p
  where p.qr_slug = p_slug;
$$;
