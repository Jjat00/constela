---
version: 1
slug: "src-app-app-layout-tsx"
primary_target: "src/app/(app)/layout.tsx"
related_targets: ["src/app/(app)/home/page.tsx","src/app/(app)/eventos/page.tsx","src/app/(app)/qr/page.tsx","src/app/(app)/perfil/page.tsx"]
---

# Surface brief — shell de la app `(app)` (home, eventos, qr, perfil)

**Scope**: layout del grupo `(app)` + `/home` como command center. **Modo**: Operate (con un gesto Persuade permitido: el titular «Tu red es tu universo.» — cada pantalla es una primera impresión en distribución guerrilla).

**Audiencia y escena**: asistente de evento, de pie, a una mano, de noche; en desktop, el mismo usuario preparando o revisando su red.

**Dirección elegida (v4, fijada por el usuario con imagen de referencia + master prompt)**: command center cinematográfico — cosmos vivo a pantalla completa (CosmicSky rico: Vía Láctea, nebulosas en deriva, planeta-horizonte), paneles de cristal (`glass`) flotando encima: sidebar izquierda en desktop (wordmark, nav vertical, identidad con halo dorado abajo), grafo constelación protagonista al centro, rail derecho con datos reales (stats, actividad reciente por `createdAt` de aristas, galaxias por explorar). Móvil: grafo casi a pantalla completa, pills de cristal flotantes, barra inferior de pulgar.

**Momento memorable**: abrir `/home` y estar dentro del universo del evento — tu sol dorado al centro, la red respirando alrededor, cristal flotando encima.

**Constraints**:
- Sin features fantasma: búsqueda = buscar estrellas por nombre (client-side, real); nada de mensajes/notificaciones/XP.
- La arista solo nace de `connectOnScan` (ADR 0001/0004): el grafo jamás conecta.
- Copy en español según CONTEXT.md; acciones clave en el tercio inferior en móvil; QR a un tap.
- `prefers-reduced-motion` + pausa de rAF con `document.hidden` intactos.

**Sin resolver**: conversión completa de landing/login/bienvenida/e/u al v4 (heredan tokens+display font automáticamente; pass propio pendiente).
