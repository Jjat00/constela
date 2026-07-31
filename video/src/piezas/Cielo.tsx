import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { COLOR, GRANO } from "../visual";
import { prng } from "../universo";

/**
 * El cielo: uno solo para todo el video, detrás de todas las escenas. Es el
 * fondo premium de la app —gradiente casi monocromo, sin nebulosas de
 * colores— con un campo de estrellas lejanas en deriva lentísima. Sembrado
 * con PRNG, así que es idéntico en cada pestaña de render.
 */

type Lejana = { x: number; y: number; r: number; o: number; fase: number };

const CAMPO: Lejana[] = (() => {
  const azar = prng(7);
  const estrellas: Lejana[] = [];
  for (let i = 0; i < 220; i++) {
    const u = azar();
    estrellas.push({
      x: Math.round(azar() * 1000) / 10,
      y: Math.round(azar() * 1000) / 10,
      r: u > 0.94 ? 1.6 + azar() * 0.9 : 0.6 + azar() * 0.7,
      o: 0.14 + u * 0.5,
      fase: azar() * Math.PI * 2,
    });
  }
  return estrellas;
})();

export const Cielo: React.FC<{ densidad?: number }> = ({ densidad = 1 }) => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill
      name="Cielo"
      style={{
        background: `linear-gradient(135deg, ${COLOR.cielo} 0%, ${COLOR.cieloClaro} 50%, ${COLOR.cielo} 100%)`,
      }}
    >
      {/* Deriva cósmica: el cielo respira a escala de minutos, no de segundos */}
      <AbsoluteFill
        style={{
          translate: `${interpolate(frame, [0, 1050], [0, -26])}px ${interpolate(frame, [0, 1050], [0, 14])}px`,
          scale: interpolate(frame, [0, 1050], [1, 1.06]),
        }}
      >
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
        >
          {CAMPO.map((estrella, i) => (
            <circle
              key={i}
              cx={estrella.x}
              cy={estrella.y}
              // El radio va en px reales: un cielo nunca escala con el lienzo
              r={0.06}
              fill={COLOR.tinta}
              opacity={
                estrella.o *
                densidad *
                (0.72 + 0.28 * Math.sin(frame / 26 + estrella.fase))
              }
              style={{ transformBox: "fill-box" }}
            />
          ))}
        </svg>
      </AbsoluteFill>

      {/* Velo de nebulosa gris: ambiente, nunca color */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(60% 50% at 62% 34%, rgba(200,204,216,0.09) 0%, transparent 70%)",
        }}
      />
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(52% 44% at 26% 72%, rgba(140,148,168,0.07) 0%, transparent 70%)",
        }}
      />

      {/* Viñeta: los bordes del viewport caen al vacío */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(120% 90% at 50% 45%, transparent 42%, rgba(2,3,10,0.55) 100%)",
        }}
      />

      {/* Grano de cine, encima de todo: el registro es película */}
      <AbsoluteFill
        style={{ opacity: 0.05, backgroundImage: GRANO, mixBlendMode: "overlay" }}
      />
    </AbsoluteFill>
  );
};
