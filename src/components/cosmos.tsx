import { cn } from "@/lib/utils";

/**
 * Cosmos — primitivas del «universo real» de Constela (DESIGN.md v3).
 *
 * Todo es determinista: el cielo se genera con un PRNG de semilla fija, así
 * que se renderiza en servidor (cero JS de cliente), no hay hydration
 * mismatch y el universo es el mismo en cada visita. Los tamaños de estrella
 * van en px fijos: un cielo nunca escala con el alto del documento.
 */

/** mulberry32 — PRNG pequeño y estable; suficiente para sembrar un cielo. */
function prng(seed: number) {
  let s = seed | 0;
  return function () {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Clases espectrales reales (halo) — mismos valores que la tabla de
 * DESIGN.md §2. El núcleo de toda estrella es casi blanco: el color solo
 * vive en el halo — es lo que las hace creíbles.
 */
export const SPECTRA = [
  { halo: "#9DB4FF", core: "#EEF2FF" }, // B — azul estelar
  { halo: "#CDD8FF", core: "#F8FAFF" }, // A — blanco azulado
  { halo: "#F4F2EE", core: "#FFFFFF" }, // F/G — blanco cálido
  { halo: "#FFD9A8", core: "#FFF8EC" }, // K — cálida dorada
  { halo: "#FFB380", core: "#FFF3E6" }, // M — naranja gigante
];

/** Clase espectral estable por persona: el mismo id, siempre el mismo color. */
export function spectrumOf(id: string) {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) | 0;
  return SPECTRA[Math.abs(h) % SPECTRA.length];
}

function pickSpectrum(u: number) {
  // Pesos realistas: el cielo es mayormente blanco; el color es minoría
  if (u < 0.12) return SPECTRA[0];
  if (u < 0.32) return SPECTRA[1];
  if (u < 0.68) return SPECTRA[2];
  if (u < 0.88) return SPECTRA[3];
  return SPECTRA[4];
}

type Star = {
  x: number; // %
  y: number; // %
  r: number; // px
  opacity: number;
  halo: string;
  core: string;
  tier: "tiny" | "mid" | "bright";
  delay: number; // s
  duration: number; // s
};

function makeStars(seed: number, count: number): Star[] {
  const rand = prng(seed);
  const stars: Star[] = [];
  for (let i = 0; i < count; i++) {
    const u = rand();
    const tier = u > 0.95 ? "bright" : u > 0.74 ? "mid" : "tiny";
    const spec = pickSpectrum(rand());
    stars.push({
      x: Math.round(rand() * 1000) / 10,
      y: Math.round(rand() * 1000) / 10,
      r:
        tier === "bright"
          ? 1.7 + rand() * 0.9
          : tier === "mid"
            ? 0.9 + rand() * 0.7
            : 0.4 + rand() * 0.5,
      opacity:
        tier === "bright"
          ? 0.95
          : tier === "mid"
            ? 0.45 + rand() * 0.35
            : 0.2 + rand() * 0.35,
      halo: spec.halo,
      core: tier === "tiny" ? "#F4F2EE" : spec.core,
      tier,
      delay: Math.round(rand() * 60) / 10,
      duration: 3 + Math.round(rand() * 30) / 10,
    });
  }
  return stars;
}

/**
 * Campo de estrellas + Vía Láctea + nebulosas. Cubre a su contenedor
 * (position: absolute); el contenedor decide el tamaño y lleva `relative`.
 */
export function CosmicSky({
  seed = 7,
  stars = 150,
  milkyWay = true,
  nebulas = "faint",
  shootingStar = false,
  className,
}: {
  seed?: number;
  stars?: number;
  milkyWay?: boolean;
  /** `rich` (v4): nebulosas violeta + H-alfa + azul en deriva lenta — el
   *  fondo del command center es un universo vivo, no una imagen. */
  nebulas?: "none" | "faint" | "rich";
  /** Una estrella fugaz ocasional (ciclo largo, casi siempre oculta). */
  shootingStar?: boolean;
  className?: string;
}) {
  const field = makeStars(seed, stars);
  const filterId = `sky-blur-${seed}`;

  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden",
        className,
      )}
    >
      {/* Vía Láctea: banda diagonal difusa que estructura el vacío */}
      {milkyWay && (
        <div
          className="absolute top-[8%] -left-[30%] h-[26rem] w-[160%] -rotate-[24deg] blur-2xl"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, rgba(244,242,238,0.028) 22%, rgba(205,216,255,0.055) 46%, rgba(244,242,238,0.04) 62%, transparent 100%)",
          }}
        />
      )}

      {/* Nebulosas: manchas de emisión muy difusas, ambiente y no protagonista */}
      {nebulas === "faint" && (
        <>
          <div
            className="absolute -top-32 right-[-18%] h-[30rem] w-[42rem] rounded-full opacity-[0.11] blur-3xl"
            style={{
              background:
                "radial-gradient(closest-side, oklch(0.68 0.17 355 / 70%), transparent 70%)",
            }}
          />
          <div
            className="absolute top-[52%] left-[-16%] h-[26rem] w-[38rem] rounded-full opacity-[0.09] blur-3xl"
            style={{
              background:
                "radial-gradient(closest-side, oklch(0.76 0.09 265 / 70%), transparent 70%)",
            }}
          />
        </>
      )}
      {nebulas === "rich" && (
        <>
          {/* Reflexión violeta: la luz ambiental del command center */}
          <div
            className="animate-drift absolute -top-40 right-[-12%] h-[34rem] w-[48rem] rounded-full opacity-[0.14] blur-3xl"
            style={{
              background:
                "radial-gradient(closest-side, oklch(0.58 0.21 281 / 75%), transparent 70%)",
            }}
          />
          {/* Emisión H-alfa lejana */}
          <div
            className="animate-drift absolute top-[38%] left-[-14%] h-[28rem] w-[40rem] rounded-full opacity-[0.1] blur-3xl"
            style={{
              background:
                "radial-gradient(closest-side, oklch(0.68 0.17 355 / 70%), transparent 70%)",
              animationDelay: "-16s",
              animationDirection: "reverse",
            }}
          />
          {/* Reflexión azul fría */}
          <div
            className="animate-drift absolute bottom-[-18%] right-[22%] h-[26rem] w-[38rem] rounded-full opacity-[0.09] blur-3xl"
            style={{
              background:
                "radial-gradient(closest-side, oklch(0.7 0.15 250 / 70%), transparent 70%)",
              animationDelay: "-32s",
            }}
          />
        </>
      )}

      {/* Estrella fugaz: cruza una vez por ciclo y muere */}
      {shootingStar && (
        <div className="animate-shoot absolute top-[16%] right-[6%] h-px w-24 opacity-0">
          <div
            className="h-full w-full"
            style={{
              background:
                "linear-gradient(90deg, transparent, rgba(248,250,255,0.9))",
              boxShadow: "0 0 6px rgba(248,250,255,0.6)",
            }}
          />
        </div>
      )}

      {/* Estrellas: muchas débiles, pocas brillantes (ley de potencias) */}
      <svg className="absolute inset-0 h-full w-full">
        <defs>
          <filter id={filterId} x="-120%" y="-120%" width="340%" height="340%">
            <feGaussianBlur stdDeviation="2.2" />
          </filter>
        </defs>
        {field.map((s, i) =>
          s.tier === "bright" ? (
            // Estrella brillante: halo espectral + picos de difracción + núcleo
            <svg
              key={i}
              x={`${s.x}%`}
              y={`${s.y}%`}
              overflow="visible"
              className="animate-twinkle"
              style={{
                animationDelay: `${s.delay}s`,
                animationDuration: `${s.duration + 1.5}s`,
              }}
            >
              <circle
                r={s.r * 3.2}
                fill={s.halo}
                opacity={0.22}
                filter={`url(#${filterId})`}
              />
              <line
                x1={-s.r * 6.5}
                x2={s.r * 6.5}
                y1={0}
                y2={0}
                stroke={s.halo}
                strokeWidth={0.6}
                strokeLinecap="round"
                opacity={0.4}
              />
              <line
                x1={0}
                x2={0}
                y1={-s.r * 6.5}
                y2={s.r * 6.5}
                stroke={s.halo}
                strokeWidth={0.6}
                strokeLinecap="round"
                opacity={0.4}
              />
              <circle r={s.r} fill={s.core} />
            </svg>
          ) : (
            <circle
              key={i}
              cx={`${s.x}%`}
              cy={`${s.y}%`}
              r={s.r}
              fill={s.tier === "mid" ? s.core : s.halo}
              opacity={s.opacity}
              className={s.tier === "mid" ? "animate-twinkle" : undefined}
              style={
                s.tier === "mid"
                  ? {
                      animationDelay: `${s.delay}s`,
                      animationDuration: `${s.duration + 2}s`,
                    }
                  : undefined
              }
            />
          ),
        )}
      </svg>
    </div>
  );
}

/**
 * Marco estelar para avatares: la persona vive dentro de su estrella —
 * halo espectral estable por id, picos de difracción y anillo. Es el mismo
 * tratamiento que pinta el grafo, en versión DOM para páginas de perfil.
 */
export function HaloEstelar({
  id,
  size = 96,
  children,
  className,
}: {
  id: string;
  size?: number;
  children: React.ReactNode;
  className?: string;
}) {
  const spec = spectrumOf(id);
  return (
    <div
      className={cn("relative", className)}
      style={{ width: size, height: size }}
    >
      <div
        aria-hidden
        className="absolute inset-0 rounded-full"
        style={{
          background: `radial-gradient(closest-side, ${spec.halo}59, transparent 70%)`,
          transform: "scale(2.4)",
        }}
      />
      <div
        aria-hidden
        className="absolute top-1/2 left-1/2 h-px -translate-x-1/2 -translate-y-1/2"
        style={{
          width: size * 2.6,
          background: `linear-gradient(90deg, transparent, ${spec.halo}B3, transparent)`,
        }}
      />
      <div
        aria-hidden
        className="absolute top-1/2 left-1/2 w-px -translate-x-1/2 -translate-y-1/2"
        style={{
          height: size * 2.6,
          background: `linear-gradient(180deg, transparent, ${spec.halo}B3, transparent)`,
        }}
      />
      <div
        className="relative h-full w-full overflow-hidden rounded-full"
        style={{
          boxShadow: `0 0 0 1.5px ${spec.halo}CC, 0 0 24px ${spec.halo}66`,
        }}
      >
        {children}
      </div>
    </div>
  );
}

/**
 * El sol: tú. Núcleo blanco, fotosfera dorada, corona que respira.
 * Siempre el objeto más brillante de su pantalla.
 */
export function Sol({
  size = 88,
  className,
}: {
  size?: number;
  className?: string;
}) {
return (
    <div
      aria-hidden
      className={cn("relative", className)}
      style={{
        width: size,
        aspectRatio: "1/1",
      }}
    >
      {/* Corona externa: muy amplia, muy tenue, respirando */}
      <div
        className="animate-corona absolute inset-0 rounded-full"
        style={{
          background:
            "radial-gradient(closest-side, oklch(0.89 0.11 90 / 30%), transparent 72%)",
          transform: "scale(3)",
        }}
      />
      {/* Corona interna */}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background:
            "radial-gradient(closest-side, oklch(0.91 0.11 92 / 52%), transparent 70%)",
          transform: "scale(1.7)",
        }}
      />
      {/* Fotosfera: luz real con oscurecimiento de limbo (golden star v4) */}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background:
            "radial-gradient(circle at 42% 38%, #FFF9E8 0%, #FFE9A8 28%, #FFD97A 58%, #E3A93E 82%, #B27818 100%)",
          boxShadow:
            "0 0 18px oklch(0.89 0.11 90 / 60%), inset -6px -8px 18px rgba(120,60,10,0.35)",
        }}
      />
      {/* Destello horizontal fino, de lente de cine */}
      <div
        className="absolute top-1/2 left-1/2 h-px -translate-x-1/2 -translate-y-1/2"
        style={{
          width: size * 2.8,
          background:
            "linear-gradient(90deg, transparent, oklch(0.93 0.08 92 / 45%), transparent)",
        }}
      />
    </div>
  );
}

/**
 * Planeta: esfera con luz direccional cálida (el lado del sol), terminador
 * suave y borde de atmósfera. Material de escala para superficies Persuade.
 */
export function Planeta({
  size = 280,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <div
      aria-hidden
      className={cn("relative", className)}
      style={{
        width: size,
        aspectRatio: "1/1",
        clipPath: "circle(50%)",
      }}
    >
      {/* Cuerpo: iluminado desde arriba-izquierda por el sol */}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background:
            "radial-gradient(circle at 30% 24%, #8D7B68 0%, #4E4A55 30%, #23222F 55%, #0C0C16 78%, #05050A 100%)",
          boxShadow:
            "inset -24px -30px 70px rgba(0,0,0,0.9), inset 10px 12px 34px rgba(245,180,92,0.22)",
        }}
      />
      {/* Atmósfera: rim light fino del lado iluminado */}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          boxShadow:
            "inset 2px 3px 8px rgba(255,223,163,0.5), 0 0 30px rgba(157,180,255,0.08)",
        }}
      />
    </div>
  );
}

/**
 * Galaxia: un evento visto desde lejos. Núcleo cálido + dos brazos
 * espirales difusos azulados. Decorativa, tamaño de card.
 */
export function Galaxia({
  size = 72,
  seed = 1,
  className,
}: {
  size?: number;
  seed?: number;
  className?: string;
}) {
  const angle = 12 + ((seed * 47) % 60);
  const ids = {
    core: `gx-core-${seed}`,
    arm: `gx-arm-${seed}`,
    blur: `gx-blur-${seed}`,
  };
  return (
    <svg
      aria-hidden
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={className}
    >
      <defs>
        {/* Núcleo cálido en espectral K: el oro identidad (#FFD97A) es solo «tú» */}
        <radialGradient id={ids.core}>
          <stop offset="0%" stopColor="#FFF6E3" stopOpacity="0.95" />
          <stop offset="35%" stopColor="#FFD9A8" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#FFD9A8" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={ids.arm}>
          <stop offset="0%" stopColor="#CDD8FF" stopOpacity="0.5" />
          <stop offset="60%" stopColor="#9DB4FF" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#9DB4FF" stopOpacity="0" />
        </radialGradient>
        <filter id={ids.blur} x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="3.2" />
        </filter>
      </defs>
      <g transform={`rotate(${angle} 50 50)`}>
        <ellipse
          cx="50"
          cy="50"
          rx="46"
          ry="15"
          fill={`url(#${ids.arm})`}
          filter={`url(#${ids.blur})`}
        />
        <ellipse
          cx="50"
          cy="50"
          rx="34"
          ry="10"
          fill={`url(#${ids.arm})`}
          filter={`url(#${ids.blur})`}
          transform="rotate(38 50 50)"
        />
        {/* Polvo de estrellas en los brazos */}
        {[
          [22, 46, 0.9],
          [34, 56, 0.7],
          [66, 44, 0.8],
          [78, 53, 0.6],
          [46, 40, 0.7],
          [58, 60, 0.9],
        ].map(([cx, cy, o], i) => (
          <circle
            key={i}
            cx={cx}
            cy={cy}
            r={0.9}
            fill="#F4F2EE"
            opacity={o}
          />
        ))}
      </g>
      <circle cx="50" cy="50" r="22" fill={`url(#${ids.core})`} />
      <circle cx="50" cy="50" r="2.4" fill="#FFF9EE" />
    </svg>
  );
}
