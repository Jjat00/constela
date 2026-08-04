import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { Anotacion, Celeste, Titular } from "../piezas/Texto";
import { SUAVE, useLienzo, usePaleta } from "../visual";

/**
 * 0:29 — El cierre. El titular de la landing, el dominio y la promesa de los
 * ocho segundos. Un solo bloque centrado: si alguien deja el video aquí, se
 * lleva la dirección.
 */
export const Cierre: React.FC = () => {
  const frame = useCurrentFrame();
  const { u, anotacion, vertical } = useLienzo();
  const paleta = usePaleta();

  const paso = (desde: number, dura = 30) =>
    interpolate(frame, [desde, desde + dura], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: SUAVE,
    });

  return (
    <AbsoluteFill
      name="Cierre"
      style={{
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        gap: 30 * u,
      }}
    >
      <Img
        src={staticFile(paleta.logo)}
        style={{
          height: (vertical ? 74 : 60) * u,
          width: "auto",
          opacity: paso(4, 26) * 0.9,
        }}
      />

      <Titular
        name="Titular"
        tamano={(vertical ? 96 : 104) * u}
        opacidad={paso(16, 30)}
        subir={interpolate(frame, [16, 54], [16 * u, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: SUAVE,
        })}
        style={{ textAlign: "center", lineHeight: 0.96 }}
      >
        Tu red es
        <br />
        <Celeste>tu universo.</Celeste>
      </Titular>

      <div
        style={{
          height: 1,
          width: interpolate(frame, [44, 92], [0, (vertical ? 420 : 540) * u], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: SUAVE,
          }),
          background: `linear-gradient(90deg, transparent, ${paleta.filamento}55, transparent)`,
        }}
      />

      <div
        style={{
          fontFamily: paleta.sans,
          fontSize: (vertical ? 46 : 42) * u,
          fontWeight: 500,
          letterSpacing: "-0.045em",
          color: paleta.remate,
          opacity: paso(56, 30),
        }}
      >
        constela.com.co
      </div>

      <Anotacion name="Cierre" tamano={anotacion} opacidad={paso(76, 30)}>
        [ entras con Google · 8 segundos ]
      </Anotacion>
    </AbsoluteFill>
  );
};
