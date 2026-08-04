import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { EstrellaSVG } from "../piezas/EstrellaSVG";
import { Velo } from "../piezas/Velo";
import { Anotacion, Celeste, Titular } from "../piezas/Texto";
import { SUAVE, TRAZO, useLienzo, usePaleta } from "../visual";

/**
 * 0:09 — El gesto. Dos estrellas, un QR y la primera línea. Es la mecánica
 * entera del producto en un plano: la arista solo nace de un encuentro real,
 * así que aquí es lo único que ocurre.
 */
export const Escaneo: React.FC = () => {
  const frame = useCurrentFrame();
  const { u, mapa, pie, titularPie, anotacion, vertical } = useLienzo();
  const paleta = usePaleta();

  const paso = (desde: number, dura = 26) =>
    interpolate(frame, [desde, desde + dura], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: SUAVE,
    });

  const sale = interpolate(frame, [150, 176], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: SUAVE,
  });

  // El sol (tú) abajo a la izquierda del encuadre; la otra estrella, arriba
  const solX = mapa.cx - mapa.radio * 0.5;
  const solY = mapa.cy + mapa.radio * 0.42;
  const otraX = mapa.cx + mapa.radio * 0.52;
  const otraY = mapa.cy - mapa.radio * 0.34;

  const trazo = interpolate(frame, [74, 112], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: TRAZO,
  });
  // El destello del momento en que la línea llega: sube y baja
  const destello = interpolate(frame, [108, 118, 140], [0, 1, 0.25], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: SUAVE,
  });

  const qrLado = (vertical ? 210 : 190) * u;

  return (
    <AbsoluteFill name="Escaneo" style={{ opacity: sale }}>
      <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
        {trazo > 0 && (
          <>
            <line
              x1={solX}
              y1={solY}
              x2={solX + (otraX - solX) * trazo}
              y2={solY + (otraY - solY) * trazo}
              stroke={paleta.filamento}
              strokeOpacity={(0.16 + destello * 0.2) * paleta.filamentoFuerza}
              strokeWidth={7 * u}
              strokeLinecap="round"
            />
            <line
              x1={solX}
              y1={solY}
              x2={solX + (otraX - solX) * trazo}
              y2={solY + (otraY - solY) * trazo}
              stroke={paleta.filamento}
              strokeOpacity={(0.5 + destello * 0.45) * paleta.filamentoFuerza}
              strokeWidth={2.2 * u}
              strokeLinecap="round"
            />
          </>
        )}

        <EstrellaSVG
          x={solX}
          y={solY}
          m={5.4 * 0.9 * mapa.cuerpo * 1.5}
          halo={paleta.sol}
          esSol
          cuerpo={mapa.cuerpo * 1.5}
          picos
          opacidad={paso(6, 30)}
        />
        <EstrellaSVG
          x={otraX}
          y={otraY}
          m={(2.4 + destello * 1.1) * 0.9 * mapa.cuerpo * 1.5}
          // La otra: clase B en el cielo, la tinta plana sin clases.
          halo={paleta.espectral ? "#9DB4FF" : paleta.cuerpo}
          picos={destello > 0.3}
          opacidad={paso(16, 30)}
        />
      </svg>

      {/* El QR personal, al lado de la estrella que se escanea: a la derecha
          en horizontal, a la izquierda en vertical — siempre por dentro del
          encuadre seguro. */}
      <AbsoluteFill
        style={{
          left: vertical ? otraX - qrLado - 64 * u : otraX + 58 * u,
          top: otraY - qrLado / 2,
          width: qrLado,
          height: qrLado + 46 * u,
          opacity: interpolate(frame, [24, 46, 118, 138], [0, 1, 1, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: SUAVE,
          }),
        }}
      >
        {/* Cristal en el cielo, papel en el documento: la misma tarjeta con
            el filete de 1px de la escuela y sin nada que flote. */}
        <div
          style={{
            width: qrLado,
            height: qrLado,
            padding: 22 * u,
            borderRadius: paleta.cristal.radio * u,
            border: `1px solid ${paleta.cristal.borde}`,
            background: paleta.cristal.fondo,
            backdropFilter: paleta.cristal.blur,
            boxShadow: paleta.cristal.sombra,
            overflow: "hidden",
            position: "relative",
          }}
        >
          <Img
            src={staticFile(paleta.qr)}
            style={{ width: "100%", height: "100%" }}
          />
          {/* La pasada del escáner: una banda de luz que baja una sola vez */}
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              height: 3,
              top: interpolate(frame, [52, 92], [0, qrLado], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
                easing: TRAZO,
              }),
              background: `linear-gradient(90deg, transparent, ${paleta.sol}, transparent)`,
              opacity: interpolate(frame, [52, 60, 86, 94], [0, 1, 1, 0], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }),
              filter: `blur(${2 * u}px)`,
            }}
          />
        </div>
        <Anotacion
          name="QR"
          tamano={anotacion * 0.85}
          opacidad={1}
          style={{ marginTop: 16 * u, textAlign: "center", width: qrLado, whiteSpace: "nowrap" }}
        >
          [ su QR personal ]
        </Anotacion>
      </AbsoluteFill>

      <Velo />

      <AbsoluteFill
        style={{
          left: pie.left,
          top: pie.top,
          width: pie.ancho,
          height: pie.alto,
          justifyContent: "flex-start",
        }}
      >
        <Anotacion name="Etiqueta" tamano={anotacion} opacidad={paso(8)}>
          [ el gesto ]
        </Anotacion>
        <Titular
          name="Titular"
          tamano={titularPie}
          opacidad={paso(18)}
          subir={interpolate(frame, [18, 52], [12 * u, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: SUAVE,
          })}
          style={{ position: "absolute", top: 44 * u }}
        >
          Escaneas su QR. <Celeste>Nace una línea.</Celeste>
        </Titular>
        <Anotacion
          name="Resultado"
          tamano={anotacion}
          opacidad={paso(112)}
          color={paleta.remate}
          style={{ position: "absolute", top: 44 * u + titularPie * 1.5 }}
        >
          [ una arista = un encuentro real ]
        </Anotacion>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
