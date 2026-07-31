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
  `../src/app/globals.css`, que es la fuente de verdad del sistema visual.
- **Nada de animaciones CSS**: todo se mueve con `useCurrentFrame()` e
  `interpolate()`, o no se mueve al renderizar.
- `out/` y `node_modules/` están fuera de git (ver `.gitignore` de la raíz).
