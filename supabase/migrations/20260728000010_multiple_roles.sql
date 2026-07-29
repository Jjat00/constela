-- Permitir múltiples roles por perfil
-- Cambio de tipo: role text → role text[]

-- Crear columna temporal
alter table public.profiles
add column role_new text[] default '{}';

-- Copiar datos, convirtiendo text a text[]
update public.profiles
set role_new = case
  when role is not null and role != '' then array[role]
  else '{}'::text[]
end;

-- Eliminar la columna antigua
alter table public.profiles
drop column role;

-- Renombrar la nueva columna
alter table public.profiles
rename column role_new to role;

-- Establecer no null
alter table public.profiles
alter column role set not null;

-- Recrear índice optimizado para arrays
drop index if exists profiles_role_idx;
create index profiles_role_idx on public.profiles using gin (role);
