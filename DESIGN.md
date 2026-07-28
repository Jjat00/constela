# Constela — Cinematic Universe Design System (v4)

> Documento portable: llévalo a cualquier IA de imágenes (Midjourney, DALL·E, Ideogram, Figma AI…) para generar piezas que respeten el estilo de Constela. Los prompts listos están al final en inglés.
>
> v4 (2026-07-28): reemplaza al v3 «universo real». Fijado por el usuario con una imagen de referencia y un master prompt propio («Cinematic Universe Design System»). La idea rectora: **el usuario no navega una app — explora su propio universo.** La física estelar de la v3 (clases espectrales, H-alfa, aurora) sobrevive como sistema de color del cielo; el chrome de UI vira al violeta nebulosa y el layout pasa de páginas con header a **cristal flotando sobre un cosmos a pantalla completa**.

## 1. Esencia de la marca

- **Qué es**: app de networking para eventos presenciales. Conectas escaneando el QR de otra persona; la red del evento se dibuja como una constelación.
- **Concepto**: *las personas no son contactos: son estrellas. Las relaciones crean constelaciones. Las comunidades, galaxias. El evento es tu universo y tú eres su sol.* El cosmos no es decoración: mapea al dominio.
- **Nombre**: Constela (de "constelación", usado como verbo: *constela tu red*). Siempre en minúscula en el wordmark: `constela✦`.
- **Dirección artística** (del master prompt del usuario): Interstellar · Dune · Mass Effect · NASA/James Webb · Apple Vision Pro · Nothing OS · Arc · Linear. **Cinematográfico, no "temática espacial"**: premium, mágico, emocional, creíble. Cada pantalla debe parecer un frame de una película de ciencia ficción de $200M.
- **Lo que NO es**: caricatura, neón cyberpunk recargado, HUD de videojuego, morado plano de plantilla.

## 2. Paleta (v4) — la noche índigo, la física intacta

Los valores del chrome vienen del master prompt del usuario; los colores físicos (espectrales, H-alfa, aurora) se heredan de la v3 porque existen en el cielo y mapean al dominio.

| Rol | Nombre | Hex (fuente de verdad) | oklch aprox. | Uso |
|---|---|---|---|---|
| Fondo profundo | Primary Background | `#02030A` | `oklch(0.08 0.02 265)` | El vacío: viñetas, bordes del viewport |
| Fondo | Deep Space | `#050816` | `oklch(0.12 0.035 265)` | Fondo global, dark-only |
| Superficie | Galaxy | `#09111F` | `oklch(0.17 0.03 255)` | Base de paneles, popovers |
| **Primario** | **Nebula Purple** | **`#6E63FF`** | `oklch(0.58 0.21 281)` | CTAs y controles activos (tinta de chrome, no de titulares) |
| Acento frío | Cosmic Blue | `#4EA8FF` | `oklch(0.70 0.15 250)` | Acentos secundarios, links fríos, datos |
| Texto | Starlight White | `#F8FAFF` | `oklch(0.98 0.005 255)` | Titulares y cuerpo |
| Texto suave | Soft Gray | `#AAB2C8` | `oklch(0.75 0.025 265)` | Secundario, microetiquetas |
| **Tú** | **Golden Star** | **`#FFD97A`** | `oklch(0.89 0.11 90)` | *Solo tú*: tu sol, tu corona, tu QR, tu identidad |
| Destello | Supernova | `#FFF4C7` | `oklch(0.96 0.06 95)` | Núcleos de estrellas doradas, picos de luz |
| Acento claro | Lavanda | `#A9A1FF` | `oklch(0.75 0.13 285)` | **La palabra destacada de los titulares** (con glow, como en el comp de referencia) y texto pequeño violeta (el primario es corto de contraste en texto fino) |
| Espectral B | Azul estelar | `#9DB4FF` | `oklch(0.76 0.09 265)` | Estrellas jóvenes calientes |
| Espectral A | Blanco azulado | `#CDD8FF` | `oklch(0.87 0.05 270)` | Estrellas brillantes, líneas de constelación |
| Espectral K/M | Doradas y gigantes | `#FFD9A8` / `#FFB380` | — | Población cálida del cielo |
| **H-alfa** | Nebulosa de emisión | `#F0699F` | `oklch(0.68 0.17 355)` | **Cierres triádicos** — el momento visual de la marca |
| Éxito | Aurora (oxígeno) | `#63D6B4` | `oklch(0.79 0.09 170)` | Éxito, confirmaciones |
| Bordes | — | `rgba(255,255,255,.08)` | — | Bordes de cristal |
| Glass | — | `rgba(255,255,255,.05)` | — | Relleno de cristal sobre el cosmos |

Reglas:

- **El violeta es chrome, el oro es identidad.** Botones, tabs activos y filtros van en nebula purple; tu sol, tu avatar con corona y tu QR van en golden star. Nunca al revés.
- **Los espectrales son población**: aparecen como luz (núcleos, halos, glows), casi nunca como tinta plana de UI.
- La luz se usa con elegancia: **nunca sobresaturar el glow**. Cada estrella emite luz real; los cuerpos grandes iluminan lo cercano; las nebulosas dan luz ambiental de color.
- **Grain de película fino (~4%)** sobre todo: el registro es cine.

## 3. Tipografía (v4 — minimal cinematográfica)

| Rol | Fuente | Uso |
|---|---|---|
| Display | **Geist** (bold/black, tracking apretado) | Titulares enormes, mínimos en palabras; la palabra clave en lavanda con glow |
| Cuerpo | Geist | Texto corto, mucho aire, legibilidad impecable |
| Mono | Geist Mono | Microetiquetas `[ así ]`, magnitudes, coordenadas — anotación de observatorio |

La v4 retira Bricolage Grotesque y las itálicas de Instrument Serif del rol display (decisión del master prompt: Inter/Geist/SF, títulos enormes, minimal). El patrón firma pasa a ser: **titular gigante en Geist bold con 1-2 palabras en nebula purple** (como "Tu red es *tu universo*."). El mono se queda: es medición, no costume.

## 4. El command center (la gramática de layout v4)

La app con sesión no es una serie de páginas: es **una sola sala de observación**. El cosmos ocupa el viewport completo y todo lo demás flota encima como cristal.

- **El fondo no es una imagen: es un universo vivo.** `CosmicSky` a pantalla completa detrás del shell: campo de estrellas por ley de potencias, Vía Láctea, nebulosas en deriva lenta, galaxias lejanas, y un planeta que puede asomar como horizonte en el borde (estilo cabina orbital) — nunca detrás de texto denso ni compitiendo con el grafo.
- **Glassmorphism nivel Apple**: paneles con `backdrop-blur`, relleno `rgba(255,255,255,.05)`, borde `rgba(255,255,255,.08)`, gradientes sutiles, sombras suaves, radios generosos (`rounded-2xl/3xl`). Un panel opaco sobre el cosmos es un error v4.
- **Desktop (≥lg)**: sidebar izquierda flotante (~15rem): wordmark, nav vertical con iconos outline y glow sutil, tu identidad abajo con halo dorado. Centro: **la constelación a toda altura** — el dashboard ES el mapa galáctico, tú al centro. Rail derecho (~19rem) de cristal: stats de tu constelación, actividad reciente, galaxias por explorar. Mucho espacio negativo; nada apretado.
- **Móvil**: el grafo protagonista a pantalla casi completa; barra inferior al alcance del pulgar (el evento se vive de pie y a una mano); identidad y evento como pills de cristal flotantes; stats condensadas.
- **Jerarquía de brillo**: el objeto más brillante de cada pantalla es tu sol. Los paneles son oscuros; la luz la ponen las estrellas y los datos.
- **Búsqueda real**: "Buscar estrellas…" busca por nombre entre las estrellas del evento (dato que ya vive en el cliente). **Sin features fantasma**: cada control visible opera sobre datos que existen — en distribución guerrilla toda pantalla es una primera impresión.

## 5. Anatomía del cielo (recetas de material)

Capas de atrás hacia delante — el conjunto es lo que convence:

1. **Gradiente de espacio**: deep space con velo radial violeta; nunca color plano.
2. **Vía Láctea**: banda diagonal difusa, opacidad baja.
3. **Campo de estrellas**: muchas débiles diminutas (1–2px), pocas brillantes con clase espectral, picos de difracción y titileo desfasado. Tamaños SIEMPRE en px fijos.
4. **Nebulosas**: 1–3 manchas muy difusas (blur alto) en deriva lenta — H-alfa rosa, reflexión azul o violeta; ≤ 16% en Operate, ≤ 20% en Persuade.
5. **Cuerpos**: galaxias lejanas pequeñas; un planeta-horizonte opcional en el borde del shell.
6. **Grain de cine** (~4%) fijo encima de todo.

**Anatomía de una estrella** (el elemento más importante): núcleo blanco-caliente (el centro es casi blanco SIEMPRE; el color solo tiñe el halo) → halo espectral con scattering → picos de difracción en las brillantes → titileo sutil desfasado → radio de glow según magnitud. Cada estrella es única; una estrella como disco plano de color es un error.

**El sol (tú)**: núcleo blanco → fotosfera dorada (golden star) → corona irregular (2 capas de glow) → respiración lenta (~7s). Tu avatar vive dentro del sol. Siempre el objeto más brillante de su pantalla.

**Conexiones**: más que líneas — **filamentos de luz**: trazo fino blanco-azulado con gradiente sutil hacia sus estrellas y glow tenue; al pasar el cursor, pulsan. El atlas estelar sigue mandando la forma (trazos finos, nunca plasma grueso de videojuego).

**Galaxia (= evento)**: espiral pequeña — núcleo cálido + brazos difusos azulados. Vive en las cards de eventos y en «explora galaxias».

## 6. Semántica cósmica (el mapa dominio → cosmos)

| Dominio | Cosmos | Regla visual |
|---|---|---|
| Evento | **Galaxia** | Espiral con núcleo cálido; "estás aquí" = tu galaxia activa |
| Tú | **Sol** | Dorado, corona, el más brillante; centrado en tu vista |
| Asistente | **Estrella** | Clase espectral estable por persona (hash del id → B/A/F/K/M) |
| Nº de conexiones | **Magnitud** | Más conexiones = mayor brillo y radio de glow |
| Conexión | **Filamento de constelación** | Trazo fino blanco-azulado con glow tenue; pulsa al hover |
| Cierre triádico | **Nebulosa de emisión** | Relleno H-alfa ~8% + trazo rosa: el triángulo ionizado |
| Filtro/búsqueda activa | **Cielo profundo** | Lo no coincidente se apaga a polvo; el mapa nunca se reordena |

## 7. Movimiento — nada se siente estático, todo con elegancia

- **Titileo**: opacidad 0.5→1, 3–6s, desfases aleatorios; solo en estrellas, nunca en texto.
- **Deriva cósmica**: nebulosas y cuerpos grandes derivan lentísimo (≥ 20s); el cielo respira.
- **Respiración de corona**: ~7s, en tu sol.
- **Constelación que se dibuja**: stroke-draw al entrar (~1.8s, ease-out).
- **Filamentos**: pulso suave al hover de una conexión.
- **Cristal que llega**: paneles con fade+rise corto (~300ms); transiciones lentas y cinematográficas, jamás cascada aparatosa.
- **Estrella fugaz** ocasional y discreta: un trazo que cruza y muere (< 1 por minuto).
- Profundidad por capas sí; **parallax agresivo no** (batería de teléfono en evento + uso de pie). El rAF del grafo pausa con `document.hidden`.
- Todo respeta `prefers-reduced-motion` (estado final visible, sin animación).
- Prohibido: lens flares gratuitos, warp speed, partículas persiguiendo el cursor, scroll-jacking.

## 8. NO usar

- Estrellas como discos planos o glyphs ✦ decorativos regados por la página (el ✦ vive solo en el wordmark).
- Caricatura o flat-vector; 3D plástico; HUD de videojuego.
- Neón cyberpunk recargado; degradados arcoíris; **morado plano de plantilla** (la saturación vive en la luz, no en tinta plana).
- Fondos blancos (dark-only: la app se usa de noche, en eventos).
- Gamificación visual (niveles, XP, badges) — descartada a propósito.
- Features fantasma o UI muerta de cualquier tipo.
- Robots, cerebros IA, wireframes de globo terráqueo.

## 9. Direcciones para el logo

1. **Constelación-C** (vigente): 4–6 estrellas conectadas por líneas finas blanco-azuladas cuya silueta insinúa una "C"; la estrella mayor con picos de difracción; una conexión cierra un triángulo con trazo H-alfa.
2. **Sol con corona**: disco dorado con corona irregular — el "tú" hecho marca.
3. **Wordmark**: `constela` en minúscula (Geist semibold) + `✦` dorado tras la última "a".

El logo debe funcionar: monocromo blanco sobre `#050816`, favicon 32px, marca de agua.

## 10. Prompts listos para IA de imágenes (inglés)

**Fondo de app / hero:**
```
Wide cinematic living universe: profound deep-space night (#050816) with enormous depth — realistic stars of varying magnitude and spectral temperature (blue, white, golden, orange giants) with real bloom and fine diffraction spikes, faint diagonal Milky Way, soft violet and hydrogen-alpha pink nebulas drifting (subtle volumetric light), distant small galaxies, one warm golden sun-star with corona (#FFD97A) connected by hairline pale-blue constellation filaments, one triangle glowing faint pink (#F0699F), optional planet horizon at the bottom edge with atmospheric rim light, subtle film grain. Interstellar / James Webb realism, Apple Vision Pro elegance, quiet and immense, NOT cartoon, NOT cyberpunk neon, NOT flat purple gradient, no text.
```

**Logo (dirección 1):**
```
Minimal logo for "Constela", a networking app. A small constellation of 5 realistic glowing stars connected by hairline pale-blue lines, subtly forming the letter C; the brightest star has fine diffraction spikes and a warm golden glow (#FFD97A), one connecting line closes a triangle traced in soft hydrogen-alpha pink (#F0699F). Deep space background (#050816). Photoreal star glow on a flat vector layout, cinematic, elegant, no text.
```

**OG image / social:**
```
Social card 1200x630: cinematic deep space (#050816), realistic starfield with spectral colors, one golden sun-star with corona on the right third connected into a small constellation with hairline filaments and one faint pink triangle, soft violet nebula haze, film grain, large clean dark area on the left for text overlay. Warm light in a cool night, premium, award-winning, NOT neon.
```

## 11. Voz y copy

- Tagline principal: **"El networking que por fin se ve"**.
- Titular del universo: **"Tu red es tu universo."** (la palabra destacada en lavanda con glow).
- Alternativas: "Cada persona es una estrella", "Escanea. Conecta. Constela.", "Los triángulos se cierran".
- El vocabulario del dominio vive en `CONTEXT.md`; la semántica cósmica (galaxia = evento, magnitud = brillo) puede usarse en copy siempre que la UI siga el glosario.
- Siempre en español para el público; el nombre nunca se traduce; wordmark en minúscula.
- Meta emocional: el usuario no piensa "estoy usando una app de networking" — piensa **"estoy explorando mi propio universo"**.
