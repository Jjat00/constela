import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { EstrellaSVG } from "../piezas/EstrellaSVG";
import { Anotacion, Lede, Titular } from "../piezas/Texto";
import { prng } from "../universo";
import { SUAVE, useLienzo, usePaleta } from "../visual";

/**
 * 0:04 — El problema. Un salón lleno es un cielo de estrellas anónimas: todas
 * del mismo brillo, ninguna con nombre, ni una línea entre ellas. Es
 * literalmente el mapa vacío del que parte el producto.
 */

const ANONIMAS = (() => {
  const azar = prng(23);
  return Array.from({ length: 54 }, () => ({
    x: azar(),
    y: azar(),
    m: 0.5 + azar() * 0.5,
    fase: azar() * Math.PI * 2,
  }));
})();

export const Problema: React.FC = () => {
  const frame = useCurrentFrame();
  const { u, width, height, margen, anotacion, vertical } = useLienzo();
  const paleta = usePaleta();

  const campo = interpolate(frame, [0, 40], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: SUAVE,
  });
  const sale = interpolate(frame, [148, 178], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: SUAVE,
  });
  const linea = (desde: number) =>
    interpolate(frame, [desde, desde + 26], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: SUAVE,
    });

  return (
    <AbsoluteFill name="Problema" style={{ opacity: sale }}>
      <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
        {ANONIMAS.map((estrella, i) => (
          <EstrellaSVG
            key={i}
            x={margen + estrella.x * (width - margen * 2)}
            y={height * (vertical ? 0.06 : 0.08) + estrella.y * height * (vertical ? 0.5 : 0.84)}
            m={estrella.m * 2.6 * u}
            // Anónimas: clase A en el cielo, un punto de la tinta plana
            // cuando la propuesta que enseña el video no tiene clases.
            halo={paleta.espectral ? "#CDD8FF" : paleta.cuerpo}
            opacidad={
              campo * 0.5 * (0.6 + 0.4 * Math.sin(frame / 22 + estrella.fase))
            }
          />
        ))}
      </svg>

      {/* Tipografía sola, centrada: el cielo anónimo de detrás ya es el
          argumento, así que aquí no compite ningún objeto. */}
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          paddingLeft: margen,
          paddingRight: margen,
        }}
      >
        <Anotacion name="Etiqueta" tamano={anotacion} opacidad={linea(14)}>
          [ hoy, en cualquier evento ]
        </Anotacion>
        <Titular
          name="Titular"
          tamano={(vertical ? 88 : 96) * u}
          opacidad={linea(26)}
          subir={interpolate(frame, [26, 60], [14 * u, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: SUAVE,
          })}
          style={{ marginTop: 32 * u, textAlign: "center", lineHeight: 1.02 }}
        >
          Cien personas.
          <br />
          Cero contexto.
        </Titular>
        <Lede
          name="Lede"
          tamano={(vertical ? 34 : 30) * u}
          opacidad={linea(56)}
          style={{
            marginTop: 34 * u,
            maxWidth: vertical ? "100%" : 780 * u,
            textAlign: "center",
          }}
        >
          La red que importa es invisible: nadie sabe quién es quién, ni a qué
          vino.
        </Lede>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
