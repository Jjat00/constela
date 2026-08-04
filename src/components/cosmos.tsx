import { cn } from "@/lib/utils";

/**
 * Cosmos — primitivas de la identidad estelar de Constela (DESIGN.md v6
 * «Observatorio»).
 *
 * Todo es determinista: la clase espectral sale de un hash del id, así que se
 * renderiza en servidor (cero JS de cliente), no hay hydration mismatch y la
 * misma persona es siempre la misma estrella.
 *
 * v6 (2026-08-04): se apaga el cine de v5 — el degradado del cielo, el campo
 * de estrellas, las nebulosas, el horizonte de planeta, la corona dorada y los
 * picos de difracción. El fondo de la app es papel liso `--background` y la
 * única luz de cada pantalla la pone el dato: la clase espectral de cada
 * estrella y su magnitud. Lo que se apagó fue el énfasis (el oro de «tú», el
 * rosa H-alfa), no la información.
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

/**
 * El papel de la pantalla.
 *
 * En v5 esto pintaba un cielo: degradado diagonal, campo de estrellas,
 * nebulosas grises y un horizonte de planeta con resplandor. En v6 el fondo es
 * liso y punto — la escuela dice que nada simula profundidad, y una superficie
 * uniforme es lo que deja que un filete de 1px se lea como estructura.
 *
 * El componente NO se borró junto con el cielo porque sigue haciendo un
 * trabajo real: mantener el contrato de capas. Va `absolute inset-0 z-0` bajo
 * un contenedor `relative` (o `fixed inset-0` como fondo global) y garantiza
 * que el papel llega a sangre incluso donde el contenedor trae su propio
 * fondo, un `overflow-hidden` o una máscara. Si algún día vuelve una textura,
 * vuelve aquí, en un solo sitio.
 */
export function CosmicSky({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn(
        "bg-background pointer-events-none absolute inset-0 z-0",
        className,
      )}
    />
  );
}

/**
 * Marco estelar para avatares: la persona vive dentro de su estrella.
 *
 * v6 conserva lo que es dato —el color de la clase espectral, estable por id—
 * y apaga lo que era cine: el halo difuso de 2,4× y los dos picos de
 * difracción que cruzaban la foto. Queda el filete de 1,5px en el color de la
 * clase, que dice exactamente lo mismo con una línea.
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
        className="relative h-full w-full overflow-hidden rounded-full"
        style={{ boxShadow: `0 0 0 1.5px ${spec.halo}CC` }}
      >
        {children}
      </div>
    </div>
  );
}

/**
 * El sol: tú.
 *
 * Era una fotosfera dorada con corona respirando y destello de lente. En v6
 * «tú» sigue siendo la estrella más brillante de su pantalla, pero lo es por
 * contraste y no por color: disco de tinta plena sobre papel. Sin oro, sin
 * corona, sin destello.
 *
 * Aquí se fueron enteros dos componentes de v5: `AuraSol` (el aura dorada
 * detrás de tu foto), porque el oro dejó de significar «tú», y `Planeta`,
 * porque era material de escala para un cielo que ya no existe.
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
      style={{ width: size, aspectRatio: "1/1" }}
    >
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background: "var(--foreground)",
          boxShadow: "0 0 0 6px rgb(242 243 245 / 8%)",
        }}
      />
    </div>
  );
}

/**
 * Galaxia espiral: un evento visto desde lejos. Dos brazos en giro lentísimo,
 * núcleo y polvo de estrellas. `active` la enciende (el evento donde estás
 * ahora).
 *
 * v6: el núcleo dejó de ser dorado y los brazos, azulados. La galaxia es gris
 * y el ÚNICO cambio que trae `active` es que el núcleo sube a tinta plena — la
 * misma jerarquía por brillo con la que el mapa distingue «tú». El giro se
 * queda: no es adorno, es lo que distingue un evento de un icono.
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
            stopColor="#B9BEC7"
            stopOpacity={active ? 0.5 : 0.3}
          />
          <stop offset="72%" stopColor="#B9BEC7" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={ids.armB}>
          <stop
            offset="0%"
            stopColor="#8E939C"
            stopOpacity={active ? 0.42 : 0.24}
          />
          <stop offset="72%" stopColor="#8E939C" stopOpacity="0" />
        </radialGradient>
        {/* Núcleo: tinta plena si el evento está activo, gris si no */}
        <radialGradient id={ids.core}>
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
          <stop
            offset="34%"
            stopColor={active ? "#F2F3F5" : "#B9BEC7"}
            stopOpacity={active ? 0.7 : 0.45}
          />
          <stop offset="72%" stopColor="#8E939C" stopOpacity="0" />
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
            fill="#F2F3F5"
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
