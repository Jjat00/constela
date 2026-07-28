# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- **Primario**: asistentes de eventos presenciales — arranque real: un evento tech en Bogotá (agosto 2026). Usan el teléfono de pie, a una mano, en medio del ruido del evento, con atención fragmentada.
- **Cómo llegan** (confirmado 2026-07-28): distribución **guerrilla persona a persona**. No hay adopción oficial del organizador: el creador asiste al evento y lo riega escaneo a escaneo, apoyado en la membresía contagiosa. La primera impresión de casi todo usuario ocurre en el momento del escaneo, sobre el teléfono de otra persona.
- **Audiencia futura confirmada como ambición** (no diseñada aún): organizadores de eventos como posible cliente cuando Constela sea multi-evento.

## Product Purpose

Networking de eventos presenciales que por fin **se ve**: conectas escaneando el QR personal del otro y la red del evento se dibuja en vivo como una constelación. Elimina la fricción de la puerta (link/QR → dentro) y convierte la red colectiva del evento en algo observable y navegable.

**Éxito de la v1 en el evento de Bogotá** (confirmado 2026-07-28, los cuatro a la vez):

1. **Encuentros reales**: la gente usa filtros, roles e intenciones para decidir a quién acercarse; las aristas reflejan conversaciones que sí ocurrieron.
2. **El wow colectivo**: ver la constelación crecer en vivo es el momento memorable que la gente comenta.
3. **Validar el producto**: salir del evento con señales de que Constela merece continuar.
4. **Pieza de portfolio**: demostrar nivel de craft técnico y de diseño.

## Positioning

Lo que un producto vecino no podría copiar sin cambiar de naturaleza:

- **La arista significa un encuentro presencial real.** Solo nace de abrir el QR/link personal del otro (en server action, nunca en render; tocar una estrella en la constelación abre su mini-perfil, jamás conecta). Sin botones de "agregar", sin solicitudes, sin conectar desde el sofá. (ADR 0001)
- **Membresía contagiosa**: escanear a alguien que ya está en un evento te une a su evento, en cadena. El producto se distribuye persona a persona sin necesitar al organizador. (ADR 0001)
- **La constelación es el grafo completo del evento**, visible para cualquier asistente: el producto es la visión colectiva de la red, no "mi red hasta 2º grado". (ADR 0003)
- **El cierre triádico** (triángulos de personas que se conocen entre sí) es el momento visual y social distintivo.

## Operating Context

- De pie, a una mano, pantalla del teléfono, luz y conectividad variables. Acciones clave alcanzables en el tercio inferior; el QR personal a un tap desde cualquier pantalla, a pantalla completa y brillo alto.
- Onboarding de una sola pantalla (`/bienvenida`), menos de 60 segundos, siempre con "lo hago después" — nadie queda atrapado en medio de un evento. (ADR 0004)
- Sin apoyo del organizador (modo guerrilla): cada pantalla debe funcionar como primera impresión ante alguien que acaba de ser escaneado y no sabe qué es esto.
- Público hispanohablante; toda la UI y el copy en español.

## Capabilities and Constraints

- **Stack**: Next.js 16 (App Router, React 19, React Compiler) · Tailwind v4 + shadcn/ui · Supabase (Auth, Postgres + RLS, Realtime) · deploy en Vercel. Desarrollo local-first contra Supabase en Docker (README).
- **Login**: exclusivamente "Continuar con Google" (ADR 0002). Costo aceptado: sin cuenta Google no se entra. El acceso dev por correo (Mailpit) existe solo en desarrollo.
- **Modelo abierto de eventos**: cualquier persona logueada crea eventos; no existen roles de organizador, invitaciones ni moderación en el MVP. (ADR 0001)
- **Catálogo vivo de tags** (rol / interés / intención): arranca curado, crece con el uso, y los sinónimos se resuelven al mismo tag en vez de crear gemelos. (ADR 0004)
- **Terminología obligatoria**: el lenguaje del dominio vive en CONTEXT.md (estrella, evento, asistente, conexión, constelación, cierre triádico, membresía contagiosa…), incluidos los términos a evitar en UI.
- **Fases y estado del build**: PLAN.md es la fuente de verdad del roadmap; PRODUCT.md no duplica estado de sprint.
- **Abierto / por decidir**: forma final de la pantalla `/live` proyectable (existe en el plan, sin contexto de proyector garantizado en modo guerrilla); estrategia post-evento concreta para el crecimiento multi-evento.

## Brand Commitments

- Nombre **Constela** (de "constelación", usado como verbo); wordmark siempre en minúscula: `constela✦`; el nombre nunca se traduce.
- **DESIGN.md (v4 «Cinematic Universe»)** es la autoridad visual vigente: command center sobre un cosmos vivo a pantalla completa, glassmorphism, chrome violeta nebulosa con el oro reservado para «tú», tipografía Geist-led, física estelar y semántica cósmica intactas (evento = galaxia, tú = sol, magnitud = conexiones); el grafo ES la marca; dark-only. (Reemplazó a la v3 «universo real» el 2026-07-28, fijado por el usuario con imagen de referencia y master prompt propios.)
- Tagline: **"El networking que por fin se ve"**. Voz cálida y editorial, siempre en español.

## Evidence on Hand

- **No existen** testimonios, métricas de uso, prensa, casos ni clientes: no fabricar ninguno.
- Decisiones de producto documentadas en `docs/adr/` (4 ADRs); lenguaje del dominio en `CONTEXT.md`.
- Seed local de demo para QA (regla: ningún recién llegado nace como estrella suelta — se conecta a tres personas ya conectadas entre sí para nacer dentro de un triángulo).

## Product Principles

1. **Cero fricción en la puerta**: abrir un link/QR te deja dentro; lo único obligatorio después es un rol de un tap.
2. **La arista es un encuentro real**: ninguna interacción remota puede fabricar una conexión.
3. **La visión colectiva es el producto**: todos los asistentes ven la constelación completa del evento.
4. **Mobile-first de pie, desktop digno**: se diseña para una mano en el evento; cada pantalla escala a desktop con layout propio, nunca un móvil estirado.
5. **Cada pantalla es una primera impresión**: en distribución contagiosa, cualquier vista puede ser la puerta de entrada de alguien nuevo.

## Accessibility & Inclusion

- `prefers-reduced-motion` se respeta en toda animación (compromiso vigente en DESIGN.md).
- Uso a una mano y de pie: objetivos táctiles generosos y acciones clave en el tercio inferior de la pantalla.
