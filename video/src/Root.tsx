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
 */
export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="Constela-16x9"
        component={Pelicula}
        durationInFrames={DURACION}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="Constela-9x16"
        component={Pelicula}
        durationInFrames={DURACION}
        fps={30}
        width={1080}
        height={1920}
      />
    </>
  );
};
