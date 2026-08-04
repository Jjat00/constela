# Constela — Plan por fases

> Grafo de networking para eventos presenciales. Cada persona es una estrella; tus conexiones dibujan tu constelación del evento.
>
> **Objetivo v1**: usable en el evento tech de Bogotá (agosto 2026). Mobile-first, PWA, UX/UI de primer nivel.

## Concepto

- Los asistentes entran con un link/QR del evento, crean perfil mínimo y reciben su **QR personal**.
- Conectar = escanear el QR del otro (o abrir su link). La arista se crea al instante, con nota opcional ("hablamos de RAG").
- Cada quien ve **su constelación**: conexiones directas (1º grado) + las conexiones de sus conexiones (2º grado), con **triángulos cerrados** resaltados (cierre triádico).
- Pantalla `/live` del evento: el grafo global creciendo en tiempo real (proyectable).

## Stack

| Capa | Elección | Por qué |
|---|---|---|
| Framework | **Next.js 16** (App Router, React 19, TypeScript) | Preferencia del usuario; SSR para páginas públicas de perfil/evento |
| UI | **Tailwind CSS v4 + shadcn/ui** | Velocidad + control total del design system |
| Motion | **Framer Motion (motion)** | Micro-interacciones y transiciones de calidad |
| Grafo | **react-force-graph-2d** (canvas, d3-force) | 60fps en móvil; modo 3D disponible si se quiere para `/live` |
| Backend | **Supabase** (Auth, Postgres, Realtime, RLS) | Auth con Google/magic link; Realtime para el grafo en vivo |
| QR | `qrcode` (generar) + `html5-qrcode` o BarcodeDetector API (escanear) | Escaneo en navegador sin app nativa |
| Deploy | **Vercel** | Camino natural de Next.js; previews por PR |
| Email (fase 6) | Resend | Follow-up post-evento |

## Modelo de datos (Postgres / Supabase)

```sql
profiles         (id uuid PK → auth.users, name, headline, avatar_url, qr_slug text unique,
                  role text, tags text[], intents text[], onboarded_at timestamptz)
events           (id uuid PK, slug text unique, name, starts_at, ends_at, created_by)
event_attendees  (event_id, user_id, joined_at, PK(event_id, user_id))
connections      (id uuid PK, event_id, user_a, user_b, note text, created_at,
                  CHECK (user_a < user_b),            -- par canónico, sin duplicados espejo
                  UNIQUE (event_id, user_a, user_b))
tags             (category, label, slug GENERATED, aliases text[], is_curated, created_by,
                  PK(category, slug))                 -- catálogo vivo, ADR 0004
```

- **RLS**: solo asistentes del evento leen datos del evento; una conexión solo la insertan sus dos extremos.
- **2º grado**: función RPC (`get_my_graph(event_id)`) que devuelve nodos y aristas hasta 2 saltos — evita exponer la tabla completa al cliente.
- Todo scoped por `event_id` desde el día 1: multi-evento gratis.

## Principios UX/UI (transversales, no negociables)

1. **Mobile-first, desktop digno**: se diseña primero para usarse de pie y a una mano (acciones clave en el tercio inferior), pero cada pantalla escala a desktop con layout propio (p. ej. `/home` a 2 columnas con la constelación grande) — nunca un layout móvil estirado.
2. **Estética "mapa estelar"**: fondo oscuro profundo, nodos con glow, aristas con gradiente sutil. El grafo ES el branding.
3. **QR a un tap desde cualquier pantalla** (FAB persistente). Al mostrarlo: pantalla completa + brillo alto.
4. **Onboarding < 60 segundos**: login → nombre → rol → 3 tags → listo. Nada más es obligatorio.
5. **60fps o nada**: grafo en canvas, animaciones con transform/opacity, skeletons en toda carga.
6. **Estados vacíos con alma**: "Tu constelación está por nacer — escanea tu primer QR".
7. Accesibilidad AA: contraste, targets ≥44px, `prefers-reduced-motion`.

## Fases

### Fase 0 — Fundaciones (días 1–3) ✅ 2026-07-23
- [x] Scaffold `create-next-app` (Next.js 16.2, TS, App Router, Tailwind v4, React Compiler) + shadcn/ui (preset Nova/Radix)
- [x] Design tokens: paleta dark "mapa estelar" en `globals.css` + guía de marca portable en `DESIGN.md`
- [x] **Stack local Supabase** (CLI + Docker): Postgres + Auth + Realtime + Studio — réplica de prod en local
- [x] Migración inicial: schema + RLS + trigger de perfil + RPC `get_my_graph` (`supabase/migrations/`)
- [x] Proyecto Supabase cloud creado (`constela`, ref `usaytsxnbqxyrmdpewbw`, us-east-1) — queda **vacío** hasta el final
- [x] Deploy en Vercel — pospuesto durante el desarrollo local (ver flujo local-first) y hecho en la sesión 13–14: **en producción con dominio propio, `https://constela.com.co`**
- **Entregable**: app corriendo 100% en local con landing placeholder y schema listo.

> **Flujo local-first (decisión 2026-07-23)**: todo el desarrollo ocurre contra el stack local del Supabase CLI (`pnpm exec supabase start`). Las migraciones en `supabase/migrations/` son la fuente de verdad. Solo cuando la app esté completa en local se hace `supabase db push` al proyecto cloud y el deploy a Vercel. El login con magic link funciona en local sin configurar nada: los correos se capturan en el buzón local del stack (Mailpit).

### Fase 1 — Identidad (días 4–7) ✅ 2026-07-24 (rediseñada tras grilling)
> Rediseño 2026-07-24 (sesión de grilling — ver `CONTEXT.md` y `docs/adr/`): login SOLO
> Google (ADR 0002), sin onboarding (nombre y foto llegan de Google; `/perfil` opcional),
> home centrado en el evento (`/home`), modelo abierto de eventos con auto-join y
> membresía contagiosa (ADR 0001), constelación = grafo completo del evento (ADR 0003).
- [x] Auth: solo Google (ADR 0002) — acceso dev por correo/Mailpit solo en local
- [x] Onboarding mínimo de una pantalla en `/bienvenida` la primera vez (rol → intereses → intención), sobre un **catálogo vivo de tags** que crece con lo que la gente escribe (ADR 0004) — reintroduce lo que el ADR 0002 había quitado, con "lo hago después" siempre a mano
- [x] Perfil editable en `/perfil` (nombre, headline, rol, intereses, intención) con el mismo selector
- [x] QR personal: `qr_slug` → página pública `/u/[slug]` + membresía contagiosa (RPC `join_event_via_profile`)
- [x] Eventos: crear en `/eventos/nuevo` (cualquier usuario), auto-join al abrir `/e/[slug]`, QR del evento compartible
- [x] `/home`: evento activo + constelación (grafo completo, `get_event_graph`) + Mi QR; sin evento → eventos activos + crear
- [ ] ⏳ Credenciales Google OAuth del usuario (Google Cloud Console) — bloquea probar el login real
- **Entregable**: entro con Google, tengo mi QR, estoy en el evento y veo la constelación (aunque sea mi sola estrella).

### Fase 2 — Conexión (semana 2)
- [x] Flujo de conexión v1 (2026-07-24, endurecido 2026-07-27): abrir `/u/[slug]` conecta automáticamente (sin botón, ADR 0001; par canónico, 23505 = ya conectados). La arista se crea en la server action `connectOnScan`, invocada desde el cliente al montar — **nunca en el render**, para que ningún prefetch ni recarga cree conexiones. La nota del encuentro se añadirá desde la lista de conexiones
- [ ] Escáner QR in-app (cámara) — hoy funciona el fallback universal: la cámara del teléfono abre la URL del QR
- [ ] Lista "Mis conexiones" con búsqueda y notas editables
- [ ] Confirmación con avatar + micro-interacción al conectar
- **Entregable**: dos personas se conectan en <10 segundos.

### Fase 3 — La constelación (semana 3)
- [x] Grafo completo del evento sin límite de profundidad (`react-force-graph-2d` + RPC `get_event_graph`, ADR 0003) — v1 adelantada al home en fase 1
- [x] Tap en nodo → mini-perfil (sheet inferior, 2026-07-27): foto, titular, tags y el estado de la relación (conectados + nota del encuentro, o "aún no se han cruzado"). **No conecta**: la arista solo nace de escanear un QR en persona
- [x] Filtro por rol / intereses / intención (2026-07-27): chips con conteo del evento; lo que no coincide se apaga en vez de desaparecer, el grafo no se reordena (ADR 0004)
- [ ] Triángulos cerrados resaltados visualmente
- [ ] Sugerencias de cierre: "Tú y Ana conocieron ambos a Carlos"
- **Entregable**: el momento "wow" personal — la constelación viva del evento.

### Fase 4 — Evento en vivo (semana 4)
- [ ] Supabase Realtime: aristas nuevas aparecen animadas sin recargar
- [ ] `/live/[event]`: grafo global proyectable (modo pantalla grande, quizá 3D)
- [ ] Contadores del evento: asistentes, conexiones, triángulos
- **Entregable**: la pantalla del evento — el argumento para organizadores.

### Fase 5 — Pulido para el día D (días finales)
- [ ] PWA: manifest, iconos, splash, instalable
- [ ] Micro-interacciones (Framer Motion): conexión creada, nodo nuevo, badges
- [ ] QA en gama media Android + iPhone Safari (cámara, brillo, performance)
- [ ] Seed de demo + plan de contingencia offline
- **Entregable**: build de producción probada en dispositivos reales.

### Fase 6 — Post-evento (después del evento)
- [ ] Export de conexiones (CSV / vCard)
- [ ] Email de follow-up a las 48h (Resend)
- [ ] Métricas de red: nodos puente, super-conectores, comunidades; badges
- [ ] Retro: métricas de adopción reales → decidir si Constela sigue como producto

## Riesgos

| Riesgo | Mitigación |
|---|---|
| Arranque en frío el día del evento | El usuario como paciente cero; QR = tarjeta de presentación; pitch a organizadores con `/live` |
| Cámara en iOS Safari (permisos/https) | Fallback siempre disponible: el QR codifica una URL normal |
| Límites free tier de Supabase Realtime | Un solo canal por evento; throttle de updates en `/live` |
| Scope creep antes del evento | Fases 0–5 son el MVP; todo lo demás vive en fase 6 |
