import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { Anotacion } from "../piezas/Texto";
import { COLOR, SUAVE, useLienzo } from "../visual";

/**
 * 0:00 — La marca. Un lockup, una anotación y una línea de horizonte que se
 * abre. Nada más: la primera imagen de un producto no es un argumento.
 */
export const Marca: React.FC = () => {
  const frame = useCurrentFrame();
  const { u, anotacion, vertical } = useLienzo();

  const entra = interpolate(frame, [6, 34], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: SUAVE,
  });
  const sale = interpolate(frame, [96, 122], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: SUAVE,
  });

  return (
    <AbsoluteFill
      name="Marca"
      style={{
        justifyContent: "center",
        alignItems: "center",
        gap: 40 * u,
        opacity: sale,
      }}
    >
      <Img
        src={staticFile("logo-constela.png")}
        style={{
          height: (vertical ? 132 : 104) * u,
          width: "auto",
          opacity: entra,
          scale: interpolate(frame, [6, 40], [0.94, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: SUAVE,
            output: "perceptual-scale",
          }),
        }}
      />

      {/* La línea de horizonte, que se abre desde el centro */}
      <div
        style={{
          height: 1,
          width: interpolate(frame, [16, 70], [0, (vertical ? 460 : 620) * u], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: SUAVE,
          }),
          background: `linear-gradient(90deg, transparent, ${COLOR.filamento}55, transparent)`,
        }}
      />

      <Anotacion
        name="Firma"
        tamano={anotacion}
        opacidad={interpolate(frame, [30, 58], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: SUAVE,
        })}
      >
        [ Constela · para cualquier evento ]
      </Anotacion>
    </AbsoluteFill>
  );
};
