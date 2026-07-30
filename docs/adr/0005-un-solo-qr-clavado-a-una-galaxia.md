# Un solo QR: el personal, clavado a una galaxia

Muere el QR de evento (2026-07-29). Solo existe una especie de QR: el **QR personal clavado a una galaxia** — `/u/{slug}?e={evento}`. Escanearlo (con sesión) valida que el dueño pertenezca a ese evento, une al escaneador a ESE evento, crea la arista dueño↔escaneador y deja esa galaxia como activa del escaneador. Unirse a un evento pasa **siempre por una persona** que ya está dentro; la única estrella que puede estar sola es el creador, que nace dentro vía la RPC atómica `create_event` (evento + asistente + galaxia activa). Esto reemplaza el modelo de dos QRs del ADR 0001: `/e/{slug}` deja de auto-unir y sobrevive solo como **ficha de la galaxia** para asistentes (extraños → 404), con el creador visible; el resto del ADR 0001 (la arista solo nace de un encuentro real, en server action, cualquiera crea eventos) sigue vigente.

Se decidió así tras la primera prueba real en prod: el propio creador esperaba que el QR del evento conectara las estrellas, y la base mostró 2 asistentes con `connections` vacía. No era un bug — era el diseño de dos QRs — pero si ni el creador distingue qué QR conecta y cuál solo une, la especie ambigua sobra: **todo escaneo une Y conecta**. Coherencia extra: nadie nace suelto en la constelación (la regla del seed de PRODUCT.md pasa a ser invariante del producto), y un QR sin galaxia sería una promesa rota — por eso `/u/{slug}` pelado es solo ficha pública y no conecta, y sin tu primera galaxia no hay QR.

Decisiones que lo acompañan (grilling 2026-07-29):

- La lista «eventos activos» del estado vacío de `/home` se elimina; crear evento redirige a `/home`.
- El botón de las cards de `/eventos` es «Mi QR de este evento» (`/qr?e={slug}`), que **no** cambia tu galaxia activa — mudarse sigue siendo «Ver constelación».
- `/qr` muestra el QR clavado a la galaxia activa (o a la que pida `?e=`, validando pertenencia).
- El creador es visible en el mini-perfil de su estrella («creó esta galaxia»), en la card y en la ficha — sin marca visual en el grafo: el oro es solo para «tú».
- Visibilidad de datos: un usuario solo ve sus propios eventos (`events_select`: creador o asistente).
- En la base (migración 0013): mueren las puertas directas por REST (`attendees_insert_self`, `events_insert_own` — entrar es `join_event_via_profile(slug, event_slug)` v3 y crear es `create_event`); `get_event_by_slug` queda gated a asistentes y devuelve creador y stats; `get_event_graph` expone `created_by`.

## Considered Options

- Mantener los dos QRs y explicar mejor el del evento (rechazada: la confusión la sufrió el propio creador en la primera prueba real; un copy mejor no arregla una especie ambigua).
- QR de evento que también conecte con el dueño del evento (rechazada: convertiría al creador en hub artificial — la arista debe significar un encuentro con la persona que te escaneó, no con quien montó el evento).
- QR personal sin galaxia (`/u/{slug}`) que una al evento activo del dueño en el momento del escaneo (rechazada: era el v2 — un blanco móvil; el QR impreso prometía un evento y podía entregarte otro).
- Retrocompatibilidad con QRs viejos de evento (rechazada: no hay datos reales que proteger).
