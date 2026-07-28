# Constela — Design System & Brand Guide (v3 «universo real»)

> Documento portable: llévalo a cualquier IA de imágenes (Midjourney, DALL·E, Ideogram, Figma AI…) para generar logos, ilustraciones y piezas que respeten el estilo de Constela. Los prompts listos están al final en inglés (funcionan mejor así).
>
> v3 (2026-07-28): se reemplazó el mundo v2 «cielo nocturno editorial» (vector plano, grain setentero, prohibición de azules) por un **universo físicamente real en registro de cine espacial cálido**. Decisión del usuario: todo debe parecer un universo de verdad — soles, planetas, galaxias, constelaciones creíbles — y las estrellas deben parecer estrellas. La paleta se redefinió desde la física estelar; el ámbar sobrevive porque una estrella tipo Sol ES dorada.

## 1. Esencia de la marca

- **Qué es**: app de networking para eventos presenciales. Conectas escaneando el QR de otra persona; la red del evento se dibuja como una constelación.
- **Metáfora central, ahora sistema literal**: *el evento es una galaxia; cada persona es una estrella; tú eres un sol; tus conexiones dibujan tu constelación.* El cosmos no es decoración: mapea al dominio.
- **Nombre**: Constela (de "constelación", usado como verbo: *constela tu red*). Siempre en minúscula en el wordmark: `constela✦`.
- **Personalidad**: cine espacial cálido — Interstellar/NASA cinematográfico, no cyberpunk ni SaaS. Sobrio, inmenso, físico. La emoción viene de la escala y la luz real, nunca de neones.
- **Registro del realismo**: cinematográfico. Negro espacio profundo, estrellas con difracción, nebulosas tenues, un sol con corona. Espectacular pero contenido: el contenido siempre gana al fondo.

## 2. Paleta (v3) — la física es el sistema de color

La paleta sale de la clasificación espectral real (O-B-A-F-G-K-M) y de la emisión H-alfa. Nada de colores "de marca" arbitrarios: cada color existe en el cielo.

| Rol | Nombre | Hex aprox. | oklch (fuente de verdad) | Uso |
|---|---|---|---|---|
| Fondo | Negro espacio | `#060509` | `oklch(0.10 0.012 290)` | Fondo global, dark-only. Casi negro con un velo violeta; nunca negro puro plano |
| Superficie | Polvo cósmico | `#12101A` | `oklch(0.16 0.018 290)` | Cards, sheets, popovers |
| Texto | Luz estelar | `#F4F2EE` | `oklch(0.96 0.005 90)` | Blanco cálido de estrella F, nunca blanco frío puro |
| Texto suave | Polvo iluminado | `#9C97A8` | `oklch(0.66 0.02 290)` | Secundario, microetiquetas |
| **Primario** | **Sol** (estrella G) | **`#F5B45C`** | `oklch(0.81 0.12 75)` | CTAs, tu estrella, itálicas destacadas, corona |
| Espectral B | Azul estelar | `#9DB4FF` | `oklch(0.76 0.09 265)` | Estrellas jóvenes calientes, acentos fríos, aristas |
| Espectral A | Blanco azulado | `#CDD8FF` | `oklch(0.87 0.05 270)` | Estrellas brillantes, líneas de constelación |
| Espectral K | Cálida dorada | `#FFD9A8` | `oklch(0.88 0.07 75)` | Estrellas cálidas |
| Espectral M | Naranja gigante | `#FFB380` | `oklch(0.79 0.10 55)` | Gigantes rojas, variedad cálida |
| **H-alfa** | Nebulosa de emisión | `#F0699F` | `oklch(0.68 0.17 355)` | **Cierres triádicos** — el momento visual de la marca; rosa físico del hidrógeno |
| Éxito | Aurora (oxígeno) | `#63D6B4` | `oklch(0.79 0.09 170)` | Éxito; verde de línea de emisión OIII |
| Líneas | Borde tenue | `rgba(244,242,238,0.10)` | — | Bordes UI |

Reglas:

- **La prohibición de azules de la v2 queda levantada**: el azul estelar es físico, no "tech". Lo que sigue prohibido es el azul-SaaS como fondo o como marca de agua emocional.
- El **sol dorado es el único protagonista** entre los colores: CTAs y "tú" siempre en sol. Los espectrales son población, no protagonistas.
- Los colores espectrales aparecen **como luz** (núcleos, halos, glows), casi nunca como tinta plana de UI.
- **Grain de película fino (~4%)** sobre todo: es el grano de cine, parte del registro.

## 3. Tipografía (v3 — continuidad deliberada)

| Rol | Fuente | Uso |
|---|---|---|
| Display | **Bricolage Grotesque** (bold, tracking apretado) | Titulares grandes, wordmark |
| Acento editorial | **Instrument Serif** *itálica* | 1-3 palabras clave dentro del titular, en color sol |
| Cuerpo | Geist | Párrafos, UI |
| Mono | Geist Mono | Microetiquetas `[ así ]`, números 01/02/03, coordenadas, datos de observación |

El patrón firma se conserva: titular en Bricolage con una palabra en Instrument Serif itálica dorada. El mono ahora lee como **anotación de observatorio** (coordenadas, magnitudes, catálogos) — es medición, no costume.

## 4. Anatomía del cielo (recetas de material)

Capas del fondo, de atrás hacia delante — todas sutiles, el conjunto es lo que convence:

1. **Gradiente de espacio**: nunca un color plano; el negro espacio con un velo radial apenas visible (violeta/azul muy oscuro) que da profundidad.
2. **Vía Láctea**: banda diagonal difusa (gradiente + ruido), opacidad baja; da estructura al vacío.
3. **Campo de estrellas**: distribución ley de potencias — muchas débiles diminutas (1–2px), pocas brillantes. Cada estrella tiene clase espectral (azul B, blanca A, cálida K…) y las brillantes llevan **picos de difracción** (cruz fina) y titileo lento. Tamaños SIEMPRE en px fijos, nunca escalados al alto del documento.
4. **Nebulosas**: 1–2 manchas grandes muy difusas (blur alto), H-alfa rosa o reflexión azul, opacidad ≤ 12%. Ambiente, no protagonista.
5. **Grain de cine** (~4%) fijo encima de todo.

**Anatomía de una estrella** (la regla que hace que "parezcan estrellas"): núcleo blanco-caliente (el centro es casi blanco SIEMPRE, del color solo se tiñe el halo) → halo espectral suave → picos de difracción finos en las brillantes → titileo sutil (opacidad, 3–6s, desfasado). Una estrella dibujada como disco plano de color es un error de la v2, no una estrella.

**El sol (tú)**: núcleo blanco → fotosfera dorada → corona irregular (2 capas de glow, la externa muy amplia y tenue) → respiración lenta de la corona (~7s). Es siempre el objeto más brillante de su pantalla.

**Planeta**: esfera con luz direccional (el lado del sol), terminador suave, y **borde de atmósfera** iluminado (rim light fino). Se usa como material de escala en superficies Persuade; nunca compite con el contenido en superficies Operate.

**Galaxia (= evento)**: espiral pequeña — núcleo dorado cálido + dos brazos difusos azulados con rotación implícita. Vive en las cards de `/eventos` y donde un evento se presenta como lugar.

## 5. Semántica cósmica (el mapa dominio → cosmos)

| Dominio | Cosmos | Regla visual |
|---|---|---|
| Evento | **Galaxia** | Espiral con núcleo cálido; "estás aquí" = tu galaxia activa |
| Tú | **Sol** | Dorado, corona, el más brillante; anclado al centro de tu vista |
| Asistente | **Estrella** | Clase espectral estable por persona (hash del id → B/A/F/K/M) |
| Nº de conexiones | **Magnitud** | Más conexiones = mayor brillo y radio; sin conexiones = estrella tenue |
| Conexión | **Línea de constelación** | Trazo fino blanco-azulado, como atlas estelar |
| Cierre triádico | **Nebulosa de emisión** | Relleno H-alfa ~8% + trazo rosa: el triángulo ionizado |
| Filtro activo | **Cielo profundo** | Lo no coincidente se apaga a polvo; el mapa nunca se reordena |

## 6. Movimiento

- **Titileo** (scintillation): opacidad 0.5→1, 3–6s, desfases aleatorios; solo en estrellas, nunca en texto.
- **Respiración de corona**: escala/opacidad del glow del sol, ~7s.
- **Constelación que se dibuja**: stroke-draw de las líneas al entrar (~1.8s, ease-out).
- **Deriva**: los cuerpos grandes (planeta, galaxia) pueden derivar lentamente (float ≥ 10s).
- Todo respeta `prefers-reduced-motion` (estado final visible, sin animación).
- Prohibido: parallax agresivo, lens flares, warp speed, partículas persiguiendo el cursor.

## 7. NO usar

- Estrellas como discos planos de color o glyphs ✦ decorativos regados por la página (el ✦ vive solo en el wordmark).
- Cosmos de caricatura o flat-vector; 3D plástico; renders "espaciales" con HUDs de ciencia ficción.
- Azul-SaaS como fondo o identidad; neón cyberpunk; degradados arcoíris; morado-galaxia de plantilla.
- Fondos blancos (dark-only: la app se usa de noche, en eventos).
- Robots, cerebros IA, wireframes de globo terráqueo.

## 8. Direcciones para el logo

1. **Constelación-C** (vigente): 4–6 estrellas conectadas por líneas finas blanco-azuladas cuya silueta insinúa una "C"; la estrella mayor con picos de difracción; una conexión cierra un triángulo con trazo H-alfa.
2. **Sol con corona**: disco dorado con corona irregular y un pico de difracción horizontal — el "tú" hecho marca.
3. **Wordmark**: `constela` en Bricolage Grotesque semibold minúscula + `✦` dorado tras la última "a".

El logo debe funcionar: monocromo blanco cálido sobre `#060509`, favicon 32px, marca de agua.

## 9. Prompts listos para IA de imágenes (inglés)

**Logo (dirección 1):**
```
Minimal logo for "Constela", a networking app. A small constellation of 5 realistic glowing stars connected by hairline pale-blue lines, subtly forming the letter C; the brightest star has fine diffraction spikes and a warm golden glow (#F5B45C), one connecting line closes a triangle traced in soft hydrogen-alpha pink (#F0699F). Deep space black background (#060509). Photoreal star glow on a flat vector layout, cinematic, elegant, no text. Style: warm cinematic space (Interstellar palette), NOT cyberpunk, NOT cartoon.
```

**Icono de app / favicon:**
```
App icon: one radiant golden sun-star with soft corona and fine diffraction spikes (#F5B45C), two smaller blue-white stars beside it connected by hairline constellation lines, closed triangle hinted in faint pink, deep space black rounded square (#060509), subtle film grain, cinematic realism, no text.
```

**Hero / imagen de portada:**
```
Wide cinematic space scene: deep black sky (#060509) full of realistic stars of varying magnitude and spectral color (blue-white, white, warm orange), fine diffraction spikes on the brightest ones, a faint diagonal Milky Way band, one warm golden sun-star with corona (#F5B45C) connected by hairline pale-blue constellation lines to nearby stars, one triangle softly glowing hydrogen-alpha pink (#F0699F), a faint emission nebula far away, subtle film grain. Interstellar-grade realism, quiet and immense, lots of negative space, no planets in frame, no text, NOT cartoon, NOT purple template galaxy.
```

**OG image / social:**
```
Social card 1200x630: cinematic deep space (#060509), realistic starfield with spectral colors and one golden sun-star with corona on the right third connected into a small constellation with hairline lines and one faint pink triangle, subtle Milky Way haze crossing diagonally, film grain, large clean dark area on the left for text overlay. Warm cinematic realism, premium, NOT neon.
```

## 10. Voz y copy (para piezas con texto)

- Tagline principal: **"El networking que por fin se ve"**.
- Alternativas: "Tu constelación del evento", "Cada persona es una estrella", "Escanea. Conecta. Constela.", "Los triángulos se cierran", "Hecho para encontrarse".
- El vocabulario cósmico del dominio vive en `CONTEXT.md` (estrella, constelación, cierre triádico…) y ahora puede crecer con la semántica v3 (galaxia = evento, magnitud = brillo por conexiones) siempre que la UI siga el glosario.
- Siempre en español para el público; el nombre nunca se traduce; wordmark en minúscula.
