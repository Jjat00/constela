import "./index.css";
import { Composition } from "remotion";
import { DURACION, Pelicula } from "./Pelicula";

/**
 * Las dos caras del mismo video: 16:9 para presentar el producto (portfolio,
 * pitch, la propia landing) y 9:16 para el teléfono, que es donde de verdad
 * se reparte Constela — persona a persona, en el evento.
 *
 * Las escenas son las mismas: la composición se adapta leyendo el lienzo
 * (`useLienzo`), no recortando.
 *
 * Y tres tintas. `Constela-*` es el video de producción, en el cielo de la
 * app; `Constela-doc-*` el mismo video impreso en papel, para la propuesta
 * `/opcion2` «Documento», donde un rectángulo negro cósmico entre dos
 * secciones de papel se lee como una cita de otra publicación; y
 * `Constela-obs-*` el de `/opcion1` «Observatorio», que también es de noche
 * pero apaga el cine —ni halo, ni picos, ni corona, ni grano— y deja un solo
 * azul frío. Cambia la paleta y la puesta en escena, nunca el guion: ver
 * `Paleta` en `visual.ts`.
 */
export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="Constela-16x9"
        component={Pelicula}
        defaultProps={{ tema: "cosmos" as const }}
        durationInFrames={DURACION}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="Constela-9x16"
        component={Pelicula}
        defaultProps={{ tema: "cosmos" as const }}
        durationInFrames={DURACION}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="Constela-doc-16x9"
        component={Pelicula}
        defaultProps={{ tema: "documento" as const }}
        durationInFrames={DURACION}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="Constela-doc-9x16"
        component={Pelicula}
        defaultProps={{ tema: "documento" as const }}
        durationInFrames={DURACION}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="Constela-obs-16x9"
        component={Pelicula}
        defaultProps={{ tema: "observatorio" as const }}
        durationInFrames={DURACION}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="Constela-obs-9x16"
        component={Pelicula}
        defaultProps={{ tema: "observatorio" as const }}
        durationInFrames={DURACION}
        fps={30}
        width={1080}
        height={1920}
      />
    </>
  );
};
