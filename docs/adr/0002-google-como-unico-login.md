# Google como único método de login

El login de producción es exclusivamente "Continuar con Google" (OAuth vía Supabase Auth). El flujo de magic link por correo existió y se eliminó deliberadamente (2026-07-24): en el contexto de un evento presencial, abrir el correo para buscar un enlace es la peor fricción posible, y Google además regala nombre y foto de perfil, lo que permitió eliminar el onboarding. Costo aceptado: quien no tenga cuenta Google no puede entrar.

En desarrollo local sobrevive un acceso por correo (Mailpit) visible solo con `NODE_ENV=development`, porque Google OAuth exige credenciales reales incluso en local; es una herramienta de dev, no parte del producto. No lo "arregles" añadiendo el correo de vuelta a producción.
