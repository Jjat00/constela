import { cn } from "@/lib/utils";

/**
 * Cosmos — primitivas del cielo de Constela (DESIGN.md v5 «Observatorio»).
 *
 * Todo es determinista: el cielo se genera con un PRNG de semilla fija, así
 * que se renderiza en servidor (cero JS de cliente), no hay hydration
 * mismatch y el universo es el mismo en cada visita. Los tamaños de estrella
 * van en px fijos: un cielo nunca escala con el alto del documento.
 *
 * v5: el cielo es casi monocromo — fondo #0A0C12, banda láctea y nebulosas
 * grises, estrellas blancas. El color (espectrales, oro, H-alfa) vive en el
 * grafo y en la identidad, no en el fondo.
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
 * vive en el halo — es lo que las hace creíbles. Población del grafo,
 * no del cielo de fondo.
 */
export const SPECTRA = [
  { halo: "#9DB4FF", core: "#EEF2FF" }, // B — azul estelar
  { halo: "#CDD8FF", core: "#F8FAFF" }, // A — blanco azulado
  { halo: "#F4F2EE", core: "#FFFFFF" }, // F/G — blanco cálido
  { halo: "#FFD9A8", core: "#FFF8EC" }, // K — cálida dorada
  { halo: "#FFB380", core: "#FFF3E6" }, // M — naranja gigante
];

/** Letras de las clases espectrales, en el mismo orden que SPECTRA. */
export const SPECTRA_LETTERS = ["B", "A", "F", "K", "M"];

function hashOf(id: string) {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) | 0;
  return Math.abs(h);
}

/** Clase espectral estable por persona: el mismo id, siempre el mismo color. */
export function spectrumOf(id: string) {
  return SPECTRA[hashOf(id) % SPECTRA.length];
}

/** La letra de la clase espectral («B»…«M») estable por id. */
export function spectralLetterOf(id: string) {
  return SPECTRA_LETTERS[hashOf(id) % SPECTRA.length];
}

type Star = {
  x: number; // %
  y: number; // %
  r: number; // px
  opacity: number;
  bright: boolean;
  delay: number; // s
  duration: number; // s
};

function makeStars(seed: number, count: number): Star[] {
  const rand = prng(seed);
  const stars: Star[] = [];
  for (let i = 0; i < count; i++) {
    const u = rand();
    const bright = u > 0.94;
    stars.push({
      x: Math.round(rand() * 1000) / 10,
      y: Math.round(rand() * 1000) / 10,
      r: bright ? 1.4 + rand() * 0.6 : 0.5 + rand() * 0.6,
      opacity: 0.18 + u * 0.55,
      bright,
      delay: Math.round(rand() * 50) / 10,
      duration: 3 + Math.round(rand() * 40) / 10,
    });
  }
  return stars;
}

/**
 * Campo de estrellas + banda láctea + nebulosas grises sobre #0A0C12.
 * Cubre a su contenedor (position: absolute); el contenedor decide el
 * tamaño y lleva `relative` (o se monta `fixed inset-0` como fondo global).
 */
export function CosmicSky({
  seed = 7,
  stars = 150,
  milkyWay = true,
  nebulas = "faint",
  planet = false,
  className,
}: {
  seed?: number;
  stars?: number;
  milkyWay?: boolean;
  /** Nebulosas grises de reflexión — `rich` añade la tercera y la deriva. */
  nebulas?: "none" | "faint" | "rich";
  /** Horizonte de planeta oscuro asomando por abajo (landing). */
  planet?: boolean;
  className?: string;
}) {
  const field = makeStars(seed, stars);

  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden bg-[#0A0C12]",
        className,
      )}
    >
      {/* Banda láctea: velo diagonal difuso que estructura el vacío */}
      {milkyWay && (
        <div
          className="absolute top-[8%] -left-[20%] h-[52%] w-[150%] -rotate-[19deg]"
          style={{
            background: "rgba(214,218,228,0.045)",
            filter: "blur(26px)",
          }}
        />
      )}

      {/* Nebulosas de reflexión: grises, muy difusas — ambiente, no color */}
      {nebulas !== "none" && (
        <>
          <div
            className={cn(
              "absolute rounded-full",
              nebulas === "rich" && "animate-drift",
            )}
            style={{
              left: "12%",
              top: "14%",
              width: "46%",
              height: "40%",
              background:
                "radial-gradient(circle at 42% 40%, rgba(200,204,216,0.10) 0%, transparent 70%)",
              filter: "blur(46px)",
            }}
          />
          <div
            className={cn(
              "absolute rounded-full",
              nebulas === "rich" && "animate-drift",
            )}
            style={{
              left: "58%",
              top: "8%",
              width: "52%",
              height: "46%",
              background:
                "radial-gradient(circle at 42% 40%, rgba(170,178,200,0.12) 0%, transparent 70%)",
              filter: "blur(62px)",
              animationDelay: "-16s",
              animationDirection: "reverse",
            }}
          />
          {nebulas === "rich" && (
            <div
              className="animate-drift absolute rounded-full"
              style={{
                left: "34%",
                top: "58%",
                width: "44%",
                height: "38%",
                background:
                  "radial-gradient(circle at 42% 40%, rgba(140,148,168,0.09) 0%, transparent 70%)",
                filter: "blur(54px)",
                animationDelay: "-32s",
              }}
            />
          )}
        </>
      )}

      {/* Estrellas: puntos blancos; las brillantes titilan */}
      <svg className="absolute inset-0 h-full w-full">
        {field.map((s, i) => (
          <circle
            key={i}
            cx={`${s.x}%`}
            cy={`${s.y}%`}
            r={s.r}
            fill="#F8FAFF"
            opacity={s.opacity}
            className={s.bright ? "animate-twinkle" : undefined}
            style={
              s.bright
                ? {
                    animationDelay: `${s.delay}s`,
                    animationDuration: `${s.duration}s`,
                  }
                : undefined
            }
          />
        ))}
      </svg>

      {/* Horizonte de planeta: silueta oscura con rim light superior */}
{planet && (
        <div
          className="absolute left-1/2 w-[500vw] aspect-square rounded-full -translate-x-1/2"
          style={{
            top: "75vh",
            background: "#0C0E13",
            boxShadow: "inset 0 2px 0 0 rgba(214,218,228,0.28)",
          }}
        />
      )}
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
 * Aura dorada para «tú»: el halo de identidad detrás de tu foto.
 * Radial blur como en el diseño — nunca para otras personas.
 */
export function AuraSol({
  size,
  className,
}: {
  size: number;
  className?: string;
}) {
  return (
    <div
      aria-hidden
      className={cn("absolute rounded-full", className)}
      style={{
        inset: -Math.round(size * 0.15),
        background:
          "radial-gradient(circle, rgba(255,217,122,0.4) 0%, transparent 70%)",
        filter: `blur(${Math.max(5, Math.round(size * 0.1))}px)`,
      }}
    />
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
            "radial-gradient(closest-side, rgba(255,217,122,0.3), transparent 72%)",
          transform: "scale(3)",
        }}
      />
      {/* Corona interna */}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background:
            "radial-gradient(closest-side, rgba(255,225,140,0.52), transparent 70%)",
          transform: "scale(1.7)",
        }}
      />
      {/* Fotosfera: luz real con oscurecimiento de limbo */}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background:
            "radial-gradient(circle at 42% 38%, #FFF9E8 0%, #FFE9A8 28%, #FFD97A 58%, #E3A93E 82%, #B27818 100%)",
          boxShadow:
            "0 0 18px rgba(255,217,122,0.6), inset -6px -8px 18px rgba(120,60,10,0.35)",
        }}
      />
      {/* Destello horizontal fino, de lente de cine */}
      <div
        className="absolute top-1/2 left-1/2 h-px -translate-x-1/2 -translate-y-1/2"
        style={{
          width: size * 2.8,
          background:
            "linear-gradient(90deg, transparent, rgba(255,240,200,0.45), transparent)",
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
        height: size,
        minWidth: size,
        minHeight: size,
        maxWidth: size,
        maxHeight: size,
        clipPath: `ellipse(${size / 2}px ${size / 2}px at 50% 50%)`,
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
 * Galaxia espiral: un evento visto desde lejos. Dos brazos azulados en giro
 * lentísimo + núcleo cálido + polvo de estrellas. `active` la enciende
 * (el evento donde estás ahora). Traducción del componente `Constelacion`
 * del proyecto de diseño.
 */
export function Galaxia({
  size = 72,
  seed = 1,
  active = false,
  tilt,
  className,
}: {
  size?: number;
  seed?: number;
  active?: boolean;
  /** Inclinación en grados; por defecto se deriva del seed. */
  tilt?: number;
  className?: string;
}) {
  const rand = prng(seed);
  const angle = tilt ?? -(12 + Math.round(rand() * 40));
  const dots = Array.from({ length: 14 }, (_, i) => {
    const a = rand() * Math.PI * 2;
    const r = 22 + rand() * 28;
    return {
      key: i,
      cx: 50 + Math.cos(a) * r,
      cy: 50 + Math.sin(a) * r * 0.42,
      o: 0.25 + rand() * 0.5,
    };
  });
  const ids = {
    core: `gx-core-${seed}-${active ? 1 : 0}`,
    armA: `gx-arma-${seed}-${active ? 1 : 0}`,
    armB: `gx-armb-${seed}-${active ? 1 : 0}`,
    blur: `gx-blur-${seed}`,
  };
  return (
    <svg
      aria-hidden
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={cn("shrink-0", className)}
      style={{ transform: `rotate(${angle}deg)` }}
    >
      <defs>
        <radialGradient id={ids.armA}>
          <stop
            offset="0%"
            stopColor="#9DB4FF"
            stopOpacity={active ? 0.55 : 0.34}
          />
          <stop offset="72%" stopColor="#9DB4FF" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={ids.armB}>
          <stop
            offset="0%"
            stopColor="#9DC8FF"
            stopOpacity={active ? 0.45 : 0.26}
          />
          <stop offset="72%" stopColor="#9DC8FF" stopOpacity="0" />
        </radialGradient>
        {/* Núcleo cálido en espectral K; si el evento está activo, dorado */}
        <radialGradient id={ids.core}>
          <stop offset="0%" stopColor="#FFF4C7" stopOpacity="0.95" />
          <stop
            offset="34%"
            stopColor={active ? "#FFD97A" : "#FFD9A8"}
            stopOpacity={active ? 0.7 : 0.5}
          />
          <stop offset="72%" stopColor="#FFB478" stopOpacity="0" />
        </radialGradient>
        <filter id={ids.blur} x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="3.4" />
        </filter>
      </defs>
      <g
        className="animate-galaxy origin-center"
        style={{ animationDuration: active ? "90s" : "140s" }}
      >
        <ellipse
          cx="50"
          cy="50"
          rx="44"
          ry="24"
          fill={`url(#${ids.armA})`}
          filter={`url(#${ids.blur})`}
          opacity={active ? 1 : 0.72}
        />
        <ellipse
          cx="50"
          cy="50"
          rx="44"
          ry="24"
          fill={`url(#${ids.armB})`}
          filter={`url(#${ids.blur})`}
          transform="rotate(58 50 50)"
          opacity={active ? 0.9 : 0.6}
        />
        {dots.map((d) => (
          <circle
            key={d.key}
            cx={d.cx}
            cy={d.cy}
            r={1}
            fill="#F8FAFF"
            opacity={d.o}
          />
        ))}
      </g>
      <circle
        cx="50"
        cy="50"
        r="15"
        fill={`url(#${ids.core})`}
        opacity={active ? 1 : 0.8}
      />
    </svg>
  );
}
