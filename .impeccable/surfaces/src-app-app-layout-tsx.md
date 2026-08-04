---
version: 1
slug: "src-app-app-layout-tsx"
primary_target: "src/app/(es)/(app)/layout.tsx"
related_targets: ["src/app/(es)/(app)/home/page.tsx","src/app/(es)/(app)/eventos/page.tsx","src/app/(es)/(app)/qr/page.tsx","src/app/(es)/(app)/perfil/page.tsx"]
---

# Surface brief — shell de la app `(app)` (home, eventos, qr, perfil)

**Scope**: layout del grupo `(app)` + `/home` como command center. **Modo**: Operate (con un gesto Persuade permitido: el titular «Tu red es tu universo.» — cada pantalla es una primera impresión en distribución guerrilla).

**Audiencia y escena**: asistente de evento, de pie, a una mano, de noche; en desktop, el mismo usuario preparando o revisando su red.

**Dirección elegida (v6 «Observatorio», 2026-08-04 — reemplaza a la v4 «Cinematic Universe»)**: instrumento, no espectáculo. Papel liso `#0B0C0F`, hairlines de 1px, esquina de 2px, Inter Tight + IBM Plex Mono y un solo azul `#6E9BFF`. La composición no cambió —sidebar izquierda en desktop, grafo protagonista al centro, rail derecho con datos reales, barra de pulgar en móvil—: cambió el material. **El cosmos de fondo está apagado** (`CosmicSky` es hoy un `div` del color del fondo) y `.glass` sobrevive como nombre de clase pero significa papel + filete, sin `backdrop-filter` ni sombra. Se apagó el énfasis (el oro de «tú», el rosa H-alfa, el grano), nunca la información: la clase espectral y la magnitud siguen siendo dato.

**Momento memorable**: abrir `/home` y leer la sala de un vistazo — tu estrella en blanco pleno, los triángulos azules de quienes ya se conocen, y el mapa que al filtrar apaga lo que no coincide sin reordenarse nunca.

**Constraints**:
- Sin features fantasma: búsqueda = buscar estrellas por nombre (client-side, real); nada de mensajes/notificaciones/XP.
- La arista solo nace de `connectOnScan` (ADR 0001/0004): el grafo jamás conecta.
- Copy en español según CONTEXT.md — **la app con sesión no es bilingüe**: solo el sitio público lo es (`/` y `/en`). Acciones clave en el tercio inferior en móvil; QR a un tap.
- `prefers-reduced-motion` + pausa de rAF con `document.hidden` intactos.

**Sin resolver**: `login`, `bienvenida`, `e/` y `u/` heredan los tokens de v6 automáticamente —el rediseño entró por `globals.css`, no por las pantallas— pero no han tenido un pase propio de composición. Es exactamente la deuda que hace que sigan montando `CosmicSky` y `.glass`, que hoy ya no dibujan nada.
