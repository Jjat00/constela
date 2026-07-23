# Constela — Design System & Brand Guide (v2 «cielo nocturno»)

> Documento portable: llévalo a cualquier IA de imágenes (Midjourney, DALL·E, Ideogram, Figma AI…) para generar logos, ilustraciones y piezas que respeten el estilo de Constela. Los prompts listos están al final en inglés (funcionan mejor así).
>
> v2 (2026-07-23): se abandonó la paleta cian-sobre-navy de la v1 por sentirse "SaaS genérico". La v2 es un cielo nocturno real: cálido, editorial, con carácter.

## 1. Esencia de la marca

- **Qué es**: app de networking para eventos presenciales. Conectas escaneando el QR de otra persona; tu red del evento se dibuja como un grafo.
- **Metáfora central**: *cada persona es una estrella; tus conexiones dibujan tu constelación*. El grafo ES la marca.
- **Nombre**: Constela (de "constelación", usado como verbo: *constela tu red*). Siempre en minúscula en el wordmark: `constela✦`.
- **Personalidad**: nocturna, editorial, cálida. Como una revista de astronomía impresa en los 70 que aprendió a programar. Nunca corporativa, nunca neón-cyberpunk.
- **Conceptos clave**: constelación, cierre triádico (triángulos de personas que se conocen entre sí), segundo grado, tiempo real.

## 2. Paleta (v2)

| Rol | Nombre | Hex aprox. | oklch (fuente de verdad) | Uso |
|---|---|---|---|---|
| Fondo | Noche ciruela | `#131019` | `oklch(0.14 0.02 300)` | Fondo global, siempre oscuro (dark-only) |
| Superficie | Ciruela cercana | `#1C1824` | `oklch(0.18 0.025 300)` | Cards, sheets, popovers |
| Texto | Luz de papel | `#F5F3EE` | `oklch(0.96 0.008 90)` | Texto principal (blanco cálido, nunca blanco puro frío) |
| Texto suave | Bruma | `#A49FAD` | `oklch(0.68 0.02 300)` | Secundario, microetiquetas |
| **Primario** | **Lumen (ámbar estelar)** | **`#F0A94B`** | `oklch(0.8 0.14 70)` | CTAs, nodos propios, itálicas destacadas, glow |
| Acento 1 | Lila eléctrico | `#B49FE8` | `oklch(0.75 0.11 295)` | Aristas del grafo, nodos 2º grado, auroras |
| Acento 2 | Pulsar (magenta) | `#E06FAE` | `oklch(0.7 0.16 340)` | Triángulos cerrados — EL momento visual de la marca |
| Acento 3 | Teal aurora | `#5FD3B3` | `oklch(0.78 0.1 170)` | Éxito, variedad en charts |
| Líneas | Borde tenue | `rgba(255,255,255,0.10)` | — | Bordes, aristas en reposo |

Reglas: fondo SIEMPRE ciruela oscuro (no negro puro, no navy); el ámbar es el único protagonista; glows sutiles (blur amplio, opacidad ≤ 45%); **grain/ruido de película** sobre todo (opacidad ~5%) — es parte de la identidad.

## 3. Tipografía (v2)

| Rol | Fuente | Uso |
|---|---|---|
| Display | **Bricolage Grotesque** (bold, tracking apretado) | Titulares grandes, wordmark |
| Acento editorial | **Instrument Serif** *itálica* | 1-3 palabras clave dentro del titular, en color lumen |
| Cuerpo | Geist | Párrafos, UI |
| Mono | Geist Mono | Microetiquetas `[ así ]`, números 01/02/03, datos |

Patrón firma: titular en Bricolage con una palabra en Instrument Serif itálica ámbar — *"El networking que por fin **se ve**."*

## 4. Lenguaje visual

- **Nodos**: círculos con halo ámbar suave; el usuario propio en lumen, el resto en luz de papel, 2º grado más tenue.
- **Aristas**: líneas finas lila con opacidad baja; el cierre de un triángulo se dibuja en pulsar.
- **Triángulos cerrados**: relleno pulsar ~7% + trazo pulsar — el momento mágico.
- **Microetiquetas mono**: `[ red viva para eventos presenciales ]` en uppercase, tracking amplio.
- **Texturas**: grain de película fijo; auroras difusas (radial-gradients ámbar y lila con blur alto).
- **Movimiento**: estrellas que titilan (3.4s), constelación que se dibuja sola (stroke draw ~1.8s), marquee lento de frases; siempre `prefers-reduced-motion`.
- **NO usar**: cian/azul tech, fondos blancos, navy corporativo, neón cyberpunk saturado, degradados arcoíris, 3D plástico, robots/cerebros IA.

## 5. Direcciones para el logo

1. **Constelación-C** (preferida): 4–6 estrellas ámbar conectadas por líneas finas lila cuya silueta insinúa una "C"; una conexión cierra un triángulo (esa arista en magenta).
2. **Triángulo estelar**: tres nodos ámbar formando un triángulo con glow, vértice superior más brillante.
3. **Wordmark**: `constela` en Bricolage Grotesque semibold minúscula + `✦` ámbar tras la última "a" (así está hoy en la web).

El logo debe funcionar: monocromo blanco cálido sobre `#131019`, favicon 32px, marca de agua.

## 6. Prompts listos para IA de imágenes (inglés)

**Logo (dirección 1):**
```
Minimal logo for "Constela", a networking app. A small constellation of 5 warm amber glowing stars (#F0A94B) connected by thin soft-violet lines (#B49FE8), subtly forming the letter C, one connection closing a triangle highlighted in magenta (#E06FAE). Deep dark plum background (#131019). Flat vector, thin elegant lines, subtle film grain, no text. Style: vintage astronomy chart meets modern editorial tech brand, warm and premium, NOT cyan, NOT cyberpunk.
```

**Icono de app / favicon:**
```
App icon: three warm amber glowing dots (#F0A94B) connected as a closed triangle constellation with thin violet lines (#B49FE8), brightest dot at top, on deep dark plum background (#131019), rounded square, subtle film grain, minimal flat vector, no text. Warm editorial mood, not neon.
```

**Hero / imagen de portada:**
```
Wide editorial illustration: a deep plum night sky (#131019) with subtle film grain, warm amber stars (#F0A94B) connected by thin violet constellation lines (#B49FE8) forming a network of human connections, one triangle softly highlighted in magenta (#E06FAE), faint warm aurora glows. Minimal, lots of negative space, vintage astronomy atlas style with modern restraint, no people, no text, NOT blue/cyan.
```

**OG image / social:**
```
Social card background 1200x630: deep plum night (#131019) with film grain, one elegant constellation of warm amber nodes (#F0A94B) and thin violet lines crossing the frame diagonally, one closed triangle in faint magenta, large empty area on the left for text overlay. Warm, editorial, premium, flat with soft glows, NOT cyan.
```

## 7. Voz y copy (para piezas con texto)

- Tagline principal: **"El networking que por fin se ve"**.
- Alternativas: "Tu constelación del evento", "Cada persona es una estrella", "Escanea. Conecta. Constela.", "Los triángulos se cierran", "Hecho para encontrarse".
- Siempre en español para el público; el nombre nunca se traduce; wordmark en minúscula.
