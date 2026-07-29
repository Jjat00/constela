-- Agregar campos de contacto al perfil
-- Permite a los usuarios compartir sitio web, redes sociales y WhatsApp

alter table public.profiles
add column website text,
add column instagram text,
add column linkedin text,
add column github text,
add column whatsapp_number text;

-- Comentarios para documentación
comment on column public.profiles.website is 'URL del sitio web del usuario (p.ej. https://example.com)';
comment on column public.profiles.instagram is 'Handle de Instagram sin @';
comment on column public.profiles.linkedin is 'URL del perfil de LinkedIn';
comment on column public.profiles.github is 'Handle de GitHub';
comment on column public.profiles.whatsapp_number is 'Número de WhatsApp en formato internacional (p.ej. +34612345678)';
