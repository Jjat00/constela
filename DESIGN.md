# Constela — Design System & Brand Guide

> Documento portable: llévalo a cualquier IA de imágenes (Midjourney, DALL·E, Ideogram, Figma AI…) para generar logos, ilustraciones y piezas que respeten el estilo de Constela. Los prompts listos están al final en inglés (funcionan mejor así).

## 1. Esencia de la marca

- **Qué es**: app de networking para eventos presenciales. Conectas escaneando el QR de otra persona; tu red del evento se dibuja como un grafo.
- **Metáfora central**: *cada persona es una estrella; tus conexiones dibujan tu constelación*. El grafo ES la marca.
- **Nombre**: Constela (de "constelación", usado como verbo imperativo: *constela tu red*).
- **Personalidad**: nocturna, elegante, curiosa, cálida en lo humano y precisa en lo técnico. Nunca corporativa ni fría.
- **Conceptos clave**: constelación, cierre triádico (triángulos de personas que se conocen entre sí), segundo grado (amigos de amigos), tiempo real.

## 2. Paleta

| Rol | Nombre | Hex | Uso |
|---|---|---|---|
| Fondo | Espacio profundo | `#0D1024` | Fondo global, siempre oscuro (app dark-only) |
| Superficie | Nebulosa cercana | `#151A33` | Cards, sheets, popovers |
| Texto | Luz estelar | `#F2F4FB` | Texto principal |
| Texto suave | Polvo cósmico | `#9AA3BF` | Texto secundario |
| **Primario** | **Cian estelar** | **`#4FD8F7`** | CTAs, nodos propios, glow, links |
| Acento 1 | Violeta nebulosa | `#8B5CF6` | Nodos de 2º grado, gradientes |
| Acento 2 | Magenta pulsar | `#E879F9` | Triángulos cerrados, highlights |
| Acento 3 | Oro estrella | `#F5C86B` | Badges, logros, momentos especiales |
| Acento 4 | Teal aurora | `#5EEAD4` | Estados de éxito, variedad en charts |
| Líneas | Borde tenue | `rgba(255,255,255,0.10)` | Bordes, aristas del grafo en reposo |

Reglas: fondo SIEMPRE oscuro; el cian es el protagonista único (los demás acentos son secundarios); los glows son sutiles (blur amplio, opacidad ≤ 50%), nunca neón saturado tipo cyberpunk.

## 3. Tipografía

- **Sans**: Geist (o Inter como sustituto) — títulos en semibold con tracking apretado, cuerpo regular.
- **Mono**: Geist Mono — datos, contadores, slugs.
- Tono de los textos de UI: español, cercano, segunda persona ("tu constelación está por nacer").

## 4. Lenguaje visual

- **Nodos**: círculos con glow suave; el usuario propio brilla más (cian), 1º grado en luz estelar, 2º grado en violeta más tenue.
- **Aristas**: líneas finas (1–1.5px) con opacidad baja; al interactuar se iluminan con gradiente cian→violeta.
- **Triángulos cerrados**: relleno magenta casi transparente (≈8%) + vértices resaltados — es EL momento visual de la marca.
- **Formas**: esquinas redondeadas (radio ~10px), sin sombras duras, profundidad por capas de opacidad y glow, no por drop-shadows grises.
- **Movimiento**: parpadeo lento de estrellas (twinkle 3s), nodos que entran con spring suave; siempre respetar `prefers-reduced-motion`.
- **NO usar**: fondos blancos, degradados arcoíris, estilo corporativo de stock, robots/cerebros de IA cliché, neón cyberpunk agresivo, 3D plástico brillante.

## 5. Direcciones para el logo

1. **Constelación-C** (preferida): 4–6 estrellas conectadas por líneas finas cuya silueta insinúa una letra "C". Una de las conexiones cierra un triángulo.
2. **Triángulo estelar**: tres nodos formando un triángulo cerrado con glow, el nodo superior más brillante — homenaje al cierre triádico.
3. **Wordmark**: "constela" en Geist semibold minúscula, con la "o" reemplazada por un nodo con glow cian y una arista corta saliendo hacia la "n".

El logo debe funcionar: en monocromo blanco sobre `#0D1024`, como favicon 32px, y como marca de agua sutil.

## 6. Prompts listos para IA de imágenes (inglés)

**Logo (dirección 1):**
```
Minimal logo for "Constela", a networking app. A small constellation of 5 glowing stars connected by thin lines, subtly forming the letter C, one connection closing a triangle. Soft cyan glow (#4FD8F7) on deep space navy background (#0D1024). Flat vector, thin elegant lines, no gradients except subtle glow, no text. Style: premium, minimal, astronomical chart meets modern tech brand.
```

**Icono de app / favicon:**
```
App icon: three glowing dots connected as a closed triangle constellation, brightest dot at top, thin starlight lines, soft cyan (#4FD8F7) and violet (#8B5CF6) glow on deep dark navy (#0D1024), rounded square, minimal, flat vector, no text.
```

**Hero / imagen de portada:**
```
Wide hero illustration: a dark night sky over a silhouetted city skyline (Bogotá), stars connected by thin glowing lines forming constellations of human connections, one triangle highlighted in soft magenta (#E879F9), main constellation in cyan (#4FD8F7), subtle violet nebula (#8B5CF6) in background. Minimal, elegant, lots of negative space, no people faces, no text. Mood: quiet wonder, new connections being born.
```

**OG image / social:**
```
Social card background 1200x630: deep space navy (#0D1024) with a subtle star field, one elegant constellation of connected glowing nodes crossing the frame diagonally, cyan glow (#4FD8F7), one closed triangle in faint magenta, large empty area on the left for text overlay. Minimal, premium, flat with soft glows.
```

## 7. Voz y copy (para piezas con texto)

- Tagline principal: **"Tu constelación del evento"**.
- Alternativas: "Cada persona es una estrella", "Conecta. Constela.", "El networking que se ve".
- Siempre en español para el público; el nombre nunca se traduce.
