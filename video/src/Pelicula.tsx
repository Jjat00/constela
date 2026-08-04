import { AbsoluteFill, Sequence } from "remotion";
import { Cielo } from "./piezas/Cielo";
import { Marca } from "./escenas/Marca";
import { Problema } from "./escenas/Problema";
import { Escaneo } from "./escenas/Escaneo";
import { Constelacion } from "./escenas/Constelacion";
import { Cierre } from "./escenas/Cierre";
import { PALETAS, PaletaProvider, type TemaId } from "./visual";

/**
 * Constela — video de presentación (35 s).
 *
 * CONTRATO DE DIRECCIÓN
 * THESIS: el producto se demuestra, no se narra. Cada escena enseña una sola
 * cosa que solo Constela puede enseñar, y el cielo nunca corta: un único
 * fondo continuo detrás de todo, como si la cámara no dejara la sala.
 * Rechaza el sizzle de capturas de pantalla en marcos de teléfono.
 * OWN-WORLD: los hex de DESIGN.md sin traducir, DM Sans 500 con tracking
 * cerrado, mono de observatorio para las anotaciones `[ ASÍ ]`, oro solo para
 * «tú», H-alfa solo para los cierres triádicos, grano de cine encima de todo.
 * STORY: marca → el problema (un cielo anónimo) → el gesto (un QR, una
 * línea) → la red completa dibujándose → el filtro que apaga lo que no
 * aplica → el dominio.
 * FORM: escenas encadenadas con solapes cortos; una idea por plano; el mapa
 * estelar es el único protagonista visual.
 */

/** 30 fps · 35 s. Los solapes hacen que ninguna escena entre en negro. */
export const DURACION = 1050;

/**
 * `tema` elige la tinta y nada más: las escenas, los tiempos y la
 * composición son los mismos. `cosmos` es el video de producción —el de la
 * landing—, `documento` la lámina impresa que enseña `/opcion2` y
 * `observatorio` el instrumento monocromo de `/opcion1`.
 */
export const Pelicula: React.FC<{ tema?: TemaId }> = ({ tema = "cosmos" }) => (
  <PaletaProvider value={PALETAS[tema]}>
  <AbsoluteFill style={{ backgroundColor: PALETAS[tema].fondo }}>
    <Cielo />

    <Sequence name="Marca"  durationInFrames={130}>
      <Marca />
    </Sequence>

    <Sequence name="Problema" from={116} durationInFrames={182}>
      <Problema />
    </Sequence>

    <Sequence name="Escaneo" from={282} durationInFrames={180}>
      <Escaneo />
    </Sequence>

    <Sequence name="Constelación" from={450} durationInFrames={450}>
      <Constelacion />
    </Sequence>

    <Sequence name="Cierre" from={886} durationInFrames={164}>
      <Cierre />
    </Sequence>
  </AbsoluteFill>
  </PaletaProvider>
);
