# Constela — Observatorio Design System (v6)

> Documento portable: llévalo a cualquier IA de imágenes (Midjourney, DALL·E, Ideogram, Figma AI…) para generar piezas que respeten el estilo de Constela. Los prompts listos están al final en inglés.
>
> v6 (2026-08-04): nace de una tanda de diez propuestas de portada que el usuario revisó una a una; ganó la 1 y se promovió a toda la app. **Reemplaza a la v4 «Cinematic Universe» y a la v5.** La idea rectora se invierte: donde v4 quería que cada pantalla pareciera *un frame de una película de ciencia ficción*, v6 quiere que parezca **un instrumento de medición**. La red del evento no ilumina: mide.
>
> Cómo se hizo, y es la parte reutilizable: **el rediseño entró por los tokens, no por las pantallas.** `.glass` dejó de tener `backdrop-filter` y sombra y pasó a ser papel + filete; `.grain::after` pasó a `content: none`; `--glow-sol` a `none`; `CosmicSky` quedó reducido a un `div` del color del fondo. Ninguna de las ~7.400 líneas de UI que usaban esas clases se tocó — siguen ahí, y ahora dibujan otra cosa.

## 1. Esencia de la marca

- **Qué es**: app de networking para eventos presenciales. Conectas escaneando el QR de otra persona; la red del evento se dibuja como una constelación.
- **Concepto**: *las personas no son contactos: son estrellas. Las relaciones crean constelaciones. Las comunidades, galaxias.* El cosmos no es decoración: mapea al dominio, y **eso es lo único de la metáfora que v6 conserva sin discutir**.
- **Nombre**: Constela (de "constelación", usado como verbo: *constela tu red*). Siempre en minúscula en el wordmark.
- **Dirección artística**: atlas estelar impreso · placa fotográfica de observatorio · cuaderno de laboratorio · Teenage Engineering · Braun. **Instrumento, no espectáculo**: preciso, sobrio, medido. Una pantalla de Constela debe parecer una lámina de datos que alguien enmarcaría, no un póster de cine.
- **Lo que NO es**: caricatura, neón cyberpunk, HUD de videojuego, morado plano de plantilla, **ni el cristal flotando sobre un cosmos vivo de la v4** — eso se retiró a propósito.

## 2. Paleta (v6) — papel, tinta, un filete y un solo azul

Cuatro valores hacen el 95 % de la interfaz. La quinta columna del sistema no es un color: es el espacio en blanco.

| Rol | Nombre | Hex (fuente de verdad) | Uso |
|---|---|---|---|
| Fondo | **Papel** | `#0B0C0F` | Liso. Sin gradiente, sin viñeta, sin cielo. Dark-only. |
| Texto | **Tinta** | `#F2F3F5` | Titulares, cuerpo, y el relleno de la acción principal |
| Texto suave | Suave | `#8E939C` | Cuerpo secundario, párrafos de apoyo |
| Texto tenue | Tenue | `#7C828C` | Microetiquetas mono, texto terciario |
| Línea | **Filete** | `rgba(255,255,255,.11)` | La hairline: mide 1px y cruza a sangre. **Es el único separador del sistema** |
| **Acento** | **Azul frío** | **`#6E9BFF`** | El único color de la interfaz: foco, links, selección, cierres triádicos |
| Relleno de hover | — | `#14161A` | El único «hover» con relleno de todo el sistema |
| Superficie | — | `#101216` | Campos de formulario. No es una tarjeta elevada: no las hay |

**Población del grafo** (clase espectral estable por identidad — hash del id, la misma persona brilla siempre igual). Estos sí son color, porque **son dato, no acento**:

| Clase | Halo | Núcleo |
|---|---|---|
| B — azul estelar | `#9DB4FF` | `#EEF2FF` |
| A — blanco azulado | `#CDD8FF` | `#F8FAFF` |
| F/G — blanco cálido | `#F4F2EE` | `#FFFFFF` |
| K — cálida dorada | `#FFD9A8` | `#FFF8EC` |
| M — gigante naranja | `#FFB380` | — |

Reglas duras:

- **La jerarquía la hacen el tamaño del tipo y el aire, nunca el color.** Si una pantalla necesita un color nuevo para que se entienda, la pantalla está mal.
- **La acción principal es tinta plena invertida** (`#F2F3F5` de fondo, `#0B0C0F` de texto), jamás una píldora de color.
- **Un solo azul en toda la app.** `--cosmic`, `--celeste`, `--halfa`, `--ring` y `--chart-1` apuntan todos a `#6E9BFF`. Si aparece un segundo azul, es un error.
- **«Tú» ya no es oro.** El sol dorado de v4 (`#FFD97A`) se retiró: tu estrella es la única en blanco pleno (`--sol: #F2F3F5`), y destaca por magnitud y posición, no por tinte.
- **Los cierres triádicos son azules, ya no rosa H-alfa.** Siguen siendo el momento visual de la marca; lo que cambió es que ahora se señalan con la única tinta del sistema.
- **Nada resplandece.** `--glow-sol: none`. Sin glows, sin bloom, sin sombras, sin degradados, sin grano de película.
- **Esquina de 2px** (`--radius: 0.125rem`) y **toda** la escala de radios cuelga de ahí: `rounded-2xl` y `rounded-sm` miden lo mismo. La única excepción viva es `rounded-full` en lo que es de verdad circular (avatares, puntos).

## 3. Tipografía (v6)

| Rol | Fuente | Uso |
|---|---|---|
| Display y cuerpo | **Inter Tight** | Titulares hasta 6,4rem y texto corrido. Grotesca ya condensada de fábrica: crece sin abrirse y no necesita tracking negativo de rescate |
| Mono | **IBM Plex Mono** (400/500) | Microetiquetas `[ ASÍ ]`, magnitudes, coordenadas, pies de figura — anotación de observatorio |

v6 retira Geist y Geist Mono. El mono vive casi entero a **10,5px con `letter-spacing: .16em` y versalitas**, que es donde IBM Plex tiene más carácter de ingeniería. Escala de tracking en `globals.css`: `-0.05em` para el titular de portada, `-0.04em` para h1/h2, `-0.035em` para títulos menores, `0` para el cuerpo — que es el ancla del sistema.

> El mono en versalitas es ilegible pasadas seis palabras. Para una frase larga en mono (avisos, notas al margen) va en caja baja y a 11,5px: ver `.obs-aviso`.

## 4. Gramática de layout

v6 tiene **dos registros**, y comparten tokens pero no composición.

### El documento (portada y páginas públicas)

Las clases viven en `src/components/obs-css.tsx`, servidas inline por página — son la composición de una plantilla concreta, no tokens, y no tienen por qué pesar en el CSS de la app con sesión.

- **Carril** de `max-width: 88rem` con padding fluido; el contenido se organiza en **bandas separadas por una hairline que cruza a sangre**, de borde a borde del viewport.
- **Cero cajas.** No hay cards, ni sombras, ni fondos de sección. Una figura se marca con su fila de datos en mono arriba y su filete, nada más.
- El titular de portada ocupa 7 columnas y la red las 5 restantes, **recortada por el borde** — el diagrama continúa fuera de la página.
- **Tres figuras y ninguna caja**: el diagrama de la red, el video de 35 s y el mapa real corriendo sobre el evento de ejemplo. Las dos últimas no son ilustración: son la aplicación.

### La app con sesión

- **El fondo es papel liso.** `CosmicSky` sigue montado en el shell pero en v6 es un `div` del color del fondo: el campo de estrellas, la Vía Láctea, las nebulosas y el planeta-horizonte están apagados.
- `.glass` sobrevive como nombre de clase en decenas de archivos, pero hoy significa **papel + filete de 1px**: sin `backdrop-filter`, sin sombra. Un panel translúcido sobre un cosmos era la firma de v4; en v6 sería un error.
- **Desktop (≥lg)**: barra lateral izquierda, la constelación a toda altura al centro, rail derecho con datos reales. **Móvil**: el grafo casi a pantalla completa y barra inferior al alcance del pulgar — el evento se vive de pie y a una mano.
- **Sin features fantasma**: cada control visible opera sobre datos que existen. En distribución guerrilla toda pantalla es una primera impresión.

## 5. Qué es dato y qué era cine

La distinción que gobierna v6. Se apagó **el énfasis**, nunca la información:

| Se conserva (es dato) | Se apagó (era cine) |
|---|---|
| Clase espectral por identidad (hash del id) | El halo difuso de 2,4× y los picos de difracción del avatar |
| Magnitud: más conexiones, más brillo y radio | La corona dorada de «tú» y su respiración de 7 s |
| El triángulo del cierre triádico | El relleno rosa H-alfa y su glow |
| La forma del grafo y sus filamentos | El campo de estrellas, la Vía Láctea, las nebulosas, el planeta-horizonte |
| El filete de 1,5px en el color de la clase, alrededor del avatar | El grano de película al 4 % |

**Anatomía de una estrella**: núcleo casi blanco siempre; el color solo tiñe el halo — es lo que las hace creíbles. Una estrella como disco plano de color sigue siendo un error.

**Conexiones**: trazo fino, sin glow. La forma la manda el atlas estelar, nunca el plasma grueso de videojuego.

## 6. Semántica cósmica (dominio → cosmos)

| Dominio | Cosmos | Regla visual v6 |
|---|---|---|
| Evento | **Galaxia** | «Estás aquí» = tu galaxia activa |
| Tú | **Tu estrella** | Blanco pleno `#F2F3F5`; destaca por magnitud y posición, no por color |
| Asistente | **Estrella** | Clase espectral estable por persona (hash del id → B/A/F/K/M) |
| Nº de conexiones | **Magnitud** | Más conexiones = mayor radio |
| Conexión | **Filamento** | Trazo fino; sin glow |
| Cierre triádico | **Triángulo azul** | `#6E9BFF` — el momento social del producto |
| Filtro/búsqueda activa | **Cielo profundo** | Lo no coincidente se apaga; **el mapa nunca se reordena**, así que nunca pierdes de vista dónde estaba quién |

## 7. Movimiento

v6 recorta drásticamente el repertorio de v4. Lo que queda:

- **Transiciones de estado**: 0.18s ease en color y opacidad. Es el movimiento por defecto de todo el sistema.
- **La constelación que se dibuja** al entrar, y el pulso al seleccionar una estrella.
- **El mapa nunca se reordena** al filtrar: se apaga lo que no coincide. Es la regla de movimiento más importante del producto.
- Retirados: titileo del cielo, deriva de nebulosas, respiración de corona, estrella fugaz, parallax.
- Todo respeta `prefers-reduced-motion` (estado final visible, sin animación). El rAF del grafo pausa con `document.hidden`.
- Prohibido: lens flares, warp speed, partículas persiguiendo el cursor, scroll-jacking.

## 8. NO usar

- **Cristal, blur, sombras, degradados, glows y grano** — todo el vocabulario de v4. Si algo flota, está mal.
- Un segundo color de acento. Un solo azul.
- El oro para «tú» y el rosa H-alfa para las tríadas (v4/v5).
- Estrellas como discos planos o glyphs ✦ decorativos regados por la página.
- Radios generosos: `rounded-3xl` existe pero mide 2px, y eso es deliberado.
- Fondos blancos (dark-only: la app se usa de noche, en eventos).
- Gamificación visual (niveles, XP, badges) — descartada a propósito.
- Features fantasma o UI muerta de cualquier tipo.
- Robots, cerebros IA, wireframes de globo terráqueo.

## 9. Idioma

El **sitio público es bilingüe** desde 2026-08-04: español en la raíz, inglés bajo `/en`, con dos layouts raíz (`app/(es)/` y `app/(en)/`) porque `<html lang>` es un atributo del documento. Todo el copy sale de `src/lib/copy/`, donde `tipos.ts` obliga a que los dos idiomas tengan las mismas piezas.

**La aplicación con sesión sigue solo en español**, y se dice en voz alta: en la portada inglesa antes de la parte jugable, en `llms.txt` y en el `inLanguage` del JSON-LD. Los tags del catálogo tampoco se traducen — son datos reales de la migración 0007.

Ninguna pieza gráfica cambia con el idioma salvo las dos láminas sociales (`/og/es`, `/og/en`), que llevan el titular dentro.

## 10. Direcciones para el logo

1. **Constelación-C** (vigente): 4–6 estrellas conectadas por líneas finas cuya silueta insinúa una "C"; una conexión cierra un triángulo. En v6 el triángulo se traza en azul `#6E9BFF`, no en rosa.
2. **Wordmark**: `constela` en minúscula (Inter Tight semibold).

El logo debe funcionar: monocromo blanco sobre `#0B0C0F`, favicon 32px, marca de agua. El lockup real es un PNG (`src/assets/logo-constela.png`) y es el mismo objeto en la pestaña, en el pie y en la tarjeta social — **nunca se recompone con tipografía**.

> El ✦ dorado tras la última "a" que llevaba el wordmark en v4 se retiró con el oro.

## 11. Prompts listos para IA de imágenes (inglés)

**Fondo / lámina de marca:**
```
Minimal star atlas plate on flat matte near-black paper (#0B0C0F), no gradient and no vignette. A small constellation of 10 stars of varying magnitude drawn as clean flat dots in cool greys and one pale blue (#6E9BFF), connected by hairline 1px straight lines; one triangle of three mutually connected stars is traced in pale blue. One hairline rule crosses the full width, edge to edge, at 11% white. Enormous negative space. Printed instrument, scientific plate, Teenage Engineering restraint. NO glow, NO bloom, NO diffraction spikes, NO film grain, NO glass, NO blur, NO purple, NO nebula, NO gradient. No text.
```

**Logo (dirección 1):**
```
Minimal logo for "Constela", a networking app. Five flat dots of slightly different sizes connected by hairline straight lines, subtly forming the letter C; one connecting line closes a small triangle traced in pale blue (#6E9BFF). Flat matte near-black background (#0B0C0F), cool grey dots. Precise, geometric, printed-atlas feel. NO glow, NO gradient, NO 3D, no text.
```

**Social card:**
```
Social card 1200x630: flat matte near-black paper (#0B0C0F), a 1px hairline at 11% white crossing the full width top and bottom. Left two thirds empty for text; right third holds a small constellation of flat dots connected by hairline lines with one pale blue (#6E9BFF) triangle. Monochrome except that single blue. Quiet, precise, instrument-like. NO glow, NO grain, NO gradient, NO glass.
```

> La lámina social real no se genera con estos prompts: la dibuja `src/lib/og-lamina.tsx` con `next/og`, y es la referencia si hay dudas. Ojo con Satori: **ignora `transform-origin`**, así que los segmentos rotados se posicionan por su punto medio.

## 12. Voz y copy

- Tagline: **"El networking que por fin se ve"** / *"Networking you can finally see"*.
- Titular de portada: **"Tu red es tu universo."** / *"Your network is your universe."*
- **Español de América**, segunda persona del singular («escaneas», «tu red»); cuando hace falta plural es «ustedes» — nunca «vosotros». El inglés es americano (organizer, digitize).
- El nombre nunca se traduce; wordmark en minúscula.
- El vocabulario del dominio vive en `CONTEXT.md`; la semántica cósmica puede usarse en copy siempre que la UI siga el glosario.
- **Cero evidencia fabricada** (`PRODUCT.md` § Evidence on Hand): no existen testimonios, métricas de uso, prensa, casos ni clientes. Ninguna página del sitio contiene una sola estadística, y eso es una decisión, no un descuido: la que circula por internet sobre tarjetas de presentación no se puede rastrear hasta un estudio.
- Meta emocional: no «estoy usando una app de networking», sino **«por fin veo la sala en la que estoy»**.
