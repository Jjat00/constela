# Video de presentación de Constela

35 s, 30 fps, en las dos orientaciones. Hecho con [Remotion](https://remotion.dev):
el video es React, así que el sistema visual de la app no se imita — se importa.

- **`Constela-16x9`** · 1920×1080 — portfolio, pitch, YouTube, incrustarlo en la landing.
- **`Constela-9x16`** · 1080×1920 — stories, WhatsApp, TikTok: donde de verdad se
  reparte Constela, persona a persona.

Las dos comparten escenas: la composición se adapta leyendo el lienzo
(`useLienzo`), nunca recortando. En vertical el mapa **gira 90°** — la
constelación es ancha y el teléfono es alto, así que su eje largo se acuesta
sobre el del encuadre.

## Tres tintas

Además del cosmos de producción hay dos traducciones, una por propuesta de
rediseño que enseña el video:

- **`Constela-doc-16x9` / `-9x16`** — el mismo video **impreso en papel**, para
  `/opcion2` «Documento»: un rectángulo de cielo nocturno entre dos secciones
  de papel se lee como una cita de otra publicación, y esa página no cita.
- **`Constela-obs-16x9` / `-9x16`** — el mismo video **medido**, para
  `/opcion1` «Observatorio». Aquí el fondo ya coincidía —las dos son de
  noche—, y precisamente por eso hay que traducirlo: lo que esa propuesta
  rechaza no es el color del cielo, es el cine.

El guion, los tiempos y la composición **no cambian**; cambia la paleta y la
puesta en escena (`Paleta` en `src/visual.ts`, temas `COSMOS`, `DOCUMENTO` y
`OBSERVATORIO`). No es un cambio de hex: las tres cosas que solo funcionan
sobre cielo negro —halo difuso, núcleo blanco y picos de difracción— se
**apagan** en papel, donde serían niebla, un agujero y unas cruces sucias; se
van también el campo de estrellas, la nebulosa, la viñeta y el grano; el
cristal del QR pasa a ser papel con filete; y la familia es **Geist**, la de
esa escuela. Es el mismo criterio que usa `TINTA_DOCUMENTO` con el canvas del
mapa interactivo en `../src/app/opcion2/demo.tsx`: las dos piezas de esa página
son la misma tinta.

El observatorio apaga **lo mismo** aunque el cielo se lo permitiría, porque su
tesis es que la red no ilumina: mide. Se queda el núcleo blanco (su diagrama
del hero lo dibuja), el oro de «tú» pasa a blanco pleno, el H-alfa de los
triángulos al único azul frío de la página, los chips dejan de ser píldoras y
la familia es **Inter Tight + IBM Plex Mono**.

Dos compensaciones que **no se ajustan a ojo**:

- **`filamentoFuerza`** iguala el trazo del mapa al del diagrama del hero de su
  página. Se despeja: el hero de `/opcion1` traza `#8E939C` al 40 % sobre
  `#0B0C0F` → `rgb(63, 66, 71)`; el filamento fino del video va al 42 % con la
  misma tinta → `f = 0,95`. En papel el mismo cálculo da `0,68`.
- **`veloArranque`** decide cuánto sube la bruma del pie. En el observatorio es
  el más corto de los tres (`0,12`) porque el sol no tiene ni corona ni halo
  que lo sostengan: con el `0,95` del cosmos, «tú» salía a `rgb(120)` en la
  escena del escaneo mientras la otra estrella llegaba intacta — la jerarquía
  al revés, el mismo fallo que el velo blanco causa en papel.

Un tema **no puede alterar los otros**: el render de `Constela-16x9` es
idéntico bit a bit al de antes de que existiera la paleta (verificado por `md5`
de fotogramas de cuatro escenas, contra el árbol de `HEAD` reconstruido con
`git --work-tree=$TMP checkout HEAD -- video/src`). Si tocas `COSMOS`, cambias
producción.

Los assets también tienen tinta, porque el logo es blanco y el QR es oro:
`logo-constela-tinta.png` (el mismo PNG con la luminancia invertida, alfa
intacto) y `qr-constela-tinta.svg` para el papel; `qr-constela-observatorio.svg`
—el mismo QR con el trazo en `#F2F3F5`— para el observatorio, que sí reutiliza
el logo blanco.

## Los planos

| desde | escena | qué enseña |
|---|---|---|
| 0:00 | `Marca` | el lockup, la línea de horizonte y la firma |
| 0:04 | `Problema` | un cielo de estrellas anónimas: cien personas, cero contexto |
| 0:09 | `Escaneo` | el QR, la pasada del escáner y la primera línea |
| 0:15 | `Constelación` | la red del evento dibujándose y después filtrándose |
| 0:29 | `Cierre` | «tu red es tu universo» y el dominio |

## Trabajar en él

```bash
npm run dev                 # Remotion Studio, con línea de tiempo
npx remotion still Constela-16x9 --frame=700 --scale=0.4 out/p.png   # un fotograma
npx remotion render Constela-16x9 out/constela-16x9.mp4 --crf=17     # el video
npx remotion render Constela-9x16 out/constela-9x16.mp4 --crf=17
```

Lo que se publica **no es el master**. Los masters pesan 5–6 MB y eso no se
sirve en una página: se reencodean y viven en `../public/video/`, con su póster
sacado del **fotograma 570** (el mapa completo, antes de que entren los
nombres — el mejor cartel del video).

```bash
# el video de la propuesta en papel, de master a lo que se sirve (~1,2 MB)
npx remotion render Constela-doc-16x9 out/master-doc-16x9.mp4 --crf=17
ffmpeg -i out/master-doc-16x9.mp4 -c:v libx264 -crf 27 -preset slow -an \
  -movflags +faststart ../public/video/constela-doc-16x9.mp4
ffmpeg -i ../public/video/constela-doc-16x9.mp4 -vf "select=eq(n\,570)" \
  -vframes 1 -c:v libwebp -quality 82 ../public/video/poster-doc-16x9.webp
```

## Reglas de la casa

- **Los datos son los de la app.** `src/universo.ts` lleva las mismas 24
  estrellas y 45 conexiones que la demo de la landing
  (`../src/lib/demo-universe.ts`), con el vocabulario del catálogo curado real.
  El conteo del filtro (`5 de 24`) se calcula, no se escribe a mano.
- **El trazado tiene que ser determinista.** Remotion renderiza los fotogramas
  en varias pestañas a la vez y cada una recarga el módulo: si d3-force diera
  un layout distinto, la constelación saltaría a mitad del video. Por eso las
  posiciones iniciales van sembradas por hash y `Math.random` queda sustituido
  por un PRNG con semilla mientras corre la simulación.
- **Los colores no se inventan**: `src/visual.ts` copia los hex de
  `../src/app/globals.css`, que es la fuente de verdad del sistema visual (y,
  para el tema Documento, del bloque CSS de `../src/app/opcion2/page.tsx`).
- **Ningún componente lee `COSMOS` o `DOCUMENTO` directamente**: se pide la
  paleta con `usePaleta()`. Una constante de módulo con un hex dentro es lo
  que hacía que el video tuviera una sola tinta.
- **Nada de animaciones CSS**: todo se mueve con `useCurrentFrame()` e
  `interpolate()`, o no se mueve al renderizar.
- `out/` y `node_modules/` están fuera de git (ver `.gitignore` de la raíz).
