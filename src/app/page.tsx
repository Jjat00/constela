import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CosmicSky, Planeta } from "@/components/cosmos";

/*
 * CONTRATO DE DIRECCIÓN — v3 «universo real» (DESIGN.md v3)
 *
 * THESIS: el networking que "por fin se ve" se demuestra con un cielo
 * físicamente creíble, no se afirma; rechazo del hero SaaS (mockup + badges).
 * OWN-WORLD: negro espacio con velo violeta; estrellas de núcleo blanco,
 * halo espectral y picos de difracción; el "tú" es un sol dorado con corona;
 * líneas de constelación azul pálido; triángulo H-alfa; grain de cine;
 * Bricolage + Instrument itálica dorada + mono de observatorio.
 * STORY: entender que conectar dibuja un cielo → creer que se ve →
 * crear tu constelación.
 * FIRST VIEWPORT: titular arriba-izquierda, CTA sol, constelación REAL
 * centrada bajo el copy con el sol "tú"; cielo profundo detrás.
 * FORM: mundo pinneado por el usuario (universo super realista): sin
 * tómbola. Cierre de página: el CTA final amanece sobre el limbo de un
 * planeta — el próximo evento como mundo nuevo.
 */

// Constelación del hero. Cada nodo lleva su clase espectral (halo); el
// índice 1 eres tú: un sol dorado. El núcleo de toda estrella es blanco.
const NODES = [
  { x: 22, y: 60, r: 1.0, halo: "#CDD8FF", core: "#F8FAFF" },
  { x: 38, y: 34, r: 1.5, halo: "#F5B45C", core: "#FFF6E3" }, // tú — sol
  { x: 58, y: 48, r: 1.1, halo: "#F4F2EE", core: "#FFFFFF" },
  { x: 72, y: 26, r: 0.85, halo: "#9DB4FF", core: "#EEF2FF" },
  { x: 84, y: 58, r: 0.75, halo: "#FFB380", core: "#FFF3E6" },
  { x: 46, y: 74, r: 0.85, halo: "#CDD8FF", core: "#F8FAFF" },
];

const EDGES: Array<[number, number, string, boolean?]> = [
  [1, 0, "0.2s"],
  [1, 2, "0.55s"],
  [2, 3, "0.9s"],
  [2, 4, "1.25s"],
  [0, 5, "1.6s"],
  [0, 2, "2.1s", true], // cierre del triángulo 0-1-2
];

const STEPS = [
  {
    n: "01",
    title: "Escanea",
    body: "Cada asistente lleva su QR. Lo apuntas, y ya está: la conexión existe. Sin buscar nombres, sin solicitudes pendientes.",
  },
  {
    n: "02",
    title: "Anota",
    body: "«Hablamos de RAG en producción». Una línea opcional en el momento, que vale oro una semana después del evento.",
  },
  {
    n: "03",
    title: "Constela",
    body: "Tu red se dibuja en vivo: tus conexiones, las de tus conexiones, y los triángulos que se cierran entre ustedes.",
  },
];

/** Una estrella creíble dentro del SVG del hero: halo + difracción + núcleo. */
function HeroStar({
  x,
  y,
  r,
  halo,
  core,
  isSun,
  delay,
}: {
  x: number;
  y: number;
  r: number;
  halo: string;
  core: string;
  isSun?: boolean;
  delay: string;
}) {
  const spike = r * (isSun ? 6 : 4.2);
  return (
    <g>
      {/* Corona del sol: luz que se desvanece, nunca un disco plano */}
      {isSun && (
        <circle
          cx={x}
          cy={y}
          r={r * 6}
          fill="url(#sun-corona)"
          className="animate-corona"
          style={{ transformOrigin: `${x}px ${y}px` }}
        />
      )}
      <circle
        cx={x}
        cy={y}
        r={r * 2.6}
        fill={isSun ? "url(#sun-corona)" : halo}
        opacity={isSun ? 1 : 0.3}
        filter={isSun ? undefined : "url(#hero-halo)"}
      />
      {/* Picos de difracción */}
      <line
        x1={x - spike}
        x2={x + spike}
        y1={y}
        y2={y}
        stroke={halo}
        strokeWidth={isSun ? 0.22 : 0.16}
        strokeLinecap="round"
        opacity={0.55}
      />
      <line
        x1={x}
        x2={x}
        y1={y - spike}
        y2={y + spike}
        stroke={halo}
        strokeWidth={isSun ? 0.22 : 0.16}
        strokeLinecap="round"
        opacity={0.55}
      />
      {/* Núcleo blanco-caliente */}
      <circle
        cx={x}
        cy={y}
        r={r}
        fill={core}
        className="animate-twinkle"
        style={{ animationDelay: delay }}
      />
    </g>
  );
}

export default function Home() {
  return (
    <div className="grain relative flex flex-1 flex-col overflow-x-clip">
      {/* El cielo: estrellas espectrales, Vía Láctea y nebulosas tenues */}
      <CosmicSky seed={7} stars={170} />

      {/* Nav */}
      <header className="relative z-10 flex items-center justify-between px-5 py-4 sm:px-8 sm:py-5 lg:px-10">
        <span className="font-display text-xl font-semibold tracking-tight">
          constela<span className="text-primary">✦</span>
        </span>
        <Button asChild size="sm" className="h-10 rounded-full px-4">
          <Link href="/login">
            <span className="sm:hidden">Entrar</span>
            <span className="hidden sm:inline">Crea tu constelación</span>
          </Link>
        </Button>
      </header>

      <main className="flex flex-1 flex-col">
        {/* Hero */}
        <section className="relative z-10 mx-auto flex w-full max-w-6xl flex-col items-start gap-7 px-5 pt-12 pb-16 sm:gap-6 sm:px-8 sm:pt-14 sm:pb-20 lg:px-10">
          <p className="font-mono text-xs tracking-[0.3em] text-muted-foreground uppercase">
            [ red viva para eventos presenciales ]
          </p>

          <h1 className="font-display max-w-4xl text-[clamp(2.8rem,8vw,5.5rem)] leading-[0.98] font-bold tracking-tight text-balance">
            El networking que por fin{" "}
            <em className="font-serif font-normal text-primary italic">
              se ve
            </em>
            .
          </h1>

          <p className="max-w-xl text-lg leading-8 text-muted-foreground sm:text-xl">
            Conecta con un escaneo. Cada persona que conoces se vuelve una
            estrella, y tu red del evento se dibuja sola — con las conexiones de
            tus conexiones, en vivo.
          </p>

          <div className="flex w-full flex-wrap items-center gap-5 sm:w-auto">
            <Button
              asChild
              size="lg"
              className="node-glow h-12 w-full rounded-full px-7 text-base sm:w-auto"
            >
              <Link href="/login">Crea tu constelación</Link>
            </Button>
            <a
              href="#como-funciona"
              className="rounded-sm font-mono text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline focus-visible:text-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
            >
              ver cómo funciona ↓
            </a>
          </div>

          {/* La constelación: estrellas reales que se conectan */}
          <svg
            aria-hidden
            className="animate-float mt-6 w-full max-w-3xl self-center sm:-mt-4 sm:max-w-2xl"
            viewBox="16 18 73 62"
            fill="none"
          >
            <defs>
              <filter
                id="hero-halo"
                x="-150%"
                y="-150%"
                width="400%"
                height="400%"
              >
                <feGaussianBlur stdDeviation="1.3" />
              </filter>
              <radialGradient id="sun-corona">
                <stop offset="0%" stopColor="#F5B45C" stopOpacity="0.5" />
                <stop offset="45%" stopColor="#F5B45C" stopOpacity="0.18" />
                <stop offset="100%" stopColor="#F5B45C" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* El triángulo 0-1-2 se ioniza al cerrarse: relleno H-alfa */}
            <polygon
              points={`${NODES[0].x},${NODES[0].y} ${NODES[1].x},${NODES[1].y} ${NODES[2].x},${NODES[2].y}`}
              fill="var(--halfa)"
              fillOpacity={0.06}
            />

            {EDGES.map(([a, b, delay, closes], i) => (
              <line
                key={i}
                x1={NODES[a].x}
                y1={NODES[a].y}
                x2={NODES[b].x}
                y2={NODES[b].y}
                pathLength={1}
                stroke={closes ? "var(--halfa)" : "var(--estrella-a)"}
                strokeOpacity={closes ? 0.85 : 0.4}
                strokeWidth={closes ? 0.3 : 0.2}
                className="animate-draw"
                style={{ animationDelay: delay }}
              />
            ))}

            {NODES.map((n, i) => (
              <HeroStar
                key={i}
                x={n.x}
                y={n.y}
                r={n.r}
                halo={n.halo}
                core={n.core}
                isSun={i === 1}
                delay={`${i * 0.5}s`}
              />
            ))}

            <text
              x={NODES[1].x}
              y={NODES[1].y - 4.6}
              fontSize="2.6"
              fill="var(--sol)"
              fontFamily="var(--font-geist-mono)"
              textAnchor="middle"
            >
              tú
            </text>
          </svg>
        </section>

        {/* Marquee */}
        <div
          aria-hidden
          className="relative z-10 overflow-hidden border-y border-border py-3"
        >
          <div className="animate-marquee flex w-max gap-8 font-mono text-xs tracking-[0.25em] whitespace-nowrap text-muted-foreground uppercase">
            {/* 4 copias: el loop desplaza -50%, y dos sets deben cubrir el viewport más ancho */}
            {Array.from({ length: 4 }).map((_, i) => (
              <span key={i} className="flex gap-8">
                <span>cada persona es una estrella ·</span>
                <span>tu red, dibujada en vivo ·</span>
                <span>escanea. conecta. constela. ·</span>
                <span>los triángulos se cierran ·</span>
              </span>
            ))}
          </div>
        </div>

        {/* Cómo funciona */}
        <section
          id="como-funciona"
          className="relative z-10 mx-auto w-full max-w-6xl px-5 py-16 sm:px-8 sm:py-24 lg:px-10"
        >
          <h2 className="font-display mb-8 text-3xl font-bold tracking-tight sm:mb-12 sm:text-5xl">
            Tres gestos,{" "}
            <em className="font-serif font-normal text-primary italic">
              una constelación
            </em>
          </h2>
          <div className="grid gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-3">
            {STEPS.map((s) => (
              <article
                key={s.n}
                className="bg-background/80 p-6 backdrop-blur-[2px] transition-colors hover:bg-card sm:p-8"
              >
                <span className="font-mono text-sm text-primary">{s.n}</span>
                <h3 className="font-display mt-3 mb-3 text-2xl font-semibold">
                  {s.title}
                </h3>
                <p className="text-sm leading-7 text-muted-foreground">
                  {s.body}
                </p>
              </article>
            ))}
          </div>
        </section>

        {/* Cierre triádico */}
        <section className="relative z-10 mx-auto grid w-full max-w-6xl items-center gap-10 px-5 py-16 sm:grid-cols-2 sm:gap-12 sm:px-8 sm:py-24 lg:px-10">
          <div className="flex flex-col gap-6">
            <p className="font-mono text-xs tracking-[0.3em] text-muted-foreground uppercase">
              [ cierre triádico ]
            </p>
            <h2 className="font-display text-3xl font-bold tracking-tight text-balance sm:text-5xl">
              Cuando el círculo{" "}
              <em className="font-serif font-normal text-halfa italic">
                se cierra
              </em>
            </h2>
            <p className="max-w-md leading-8 text-muted-foreground">
              Conociste a alguien, que conoció a alguien… que tú también
              conociste. Ese triángulo tiene nombre en teoría de redes — y aquí
              tiene luz propia. Constela lo detecta y te sugiere el siguiente:
              «tú y Ana conocieron ambos a Carlos, y ustedes aún no».
            </p>
          </div>
          {/* El triángulo ionizado: tres estrellas reales y gas H-alfa dentro */}
          <svg
            aria-hidden
            className="mx-auto w-full max-w-xs"
            viewBox="0 0 100 100"
            fill="none"
          >
            <defs>
              <filter
                id="tri-halo"
                x="-150%"
                y="-150%"
                width="400%"
                height="400%"
              >
                <feGaussianBlur stdDeviation="2" />
              </filter>
              <radialGradient id="tri-gas" cx="50%" cy="62%">
                <stop offset="0%" stopColor="var(--halfa)" stopOpacity="0.16" />
                <stop offset="100%" stopColor="var(--halfa)" stopOpacity="0.03" />
              </radialGradient>
            </defs>
            <polygon
              points="50,16 18,78 82,78"
              fill="url(#tri-gas)"
              stroke="var(--halfa)"
              strokeOpacity="0.7"
              strokeWidth="0.5"
            />
            {[
              [50, 16, 2.4, "#F5B45C", "#FFF6E3"],
              [18, 78, 2, "#CDD8FF", "#F8FAFF"],
              [82, 78, 2, "#9DB4FF", "#EEF2FF"],
            ].map(([x, y, r, halo, core], i) => (
              <g key={i}>
                <circle
                  cx={x as number}
                  cy={y as number}
                  r={(r as number) * 3}
                  fill={halo as string}
                  opacity={0.28}
                  filter="url(#tri-halo)"
                />
                <line
                  x1={(x as number) - (r as number) * 4}
                  x2={(x as number) + (r as number) * 4}
                  y1={y as number}
                  y2={y as number}
                  stroke={halo as string}
                  strokeWidth={0.4}
                  strokeLinecap="round"
                  opacity={0.5}
                />
                <line
                  x1={x as number}
                  x2={x as number}
                  y1={(y as number) - (r as number) * 4}
                  y2={(y as number) + (r as number) * 4}
                  stroke={halo as string}
                  strokeWidth={0.4}
                  strokeLinecap="round"
                  opacity={0.5}
                />
                <circle
                  cx={x as number}
                  cy={y as number}
                  r={r as number}
                  fill={core as string}
                  className="animate-twinkle"
                  style={{ animationDelay: `${i * 0.7}s` }}
                />
              </g>
            ))}
          </svg>
        </section>

        {/* CTA final: amanecer sobre un mundo nuevo */}
        <section className="relative z-10 overflow-hidden">
          <div className="relative z-10 mx-auto flex w-full max-w-4xl flex-col items-center gap-8 px-5 pt-20 pb-44 text-center sm:px-8 sm:pt-28 sm:pb-56">
            <h2 className="font-display text-3xl leading-[1.05] font-bold tracking-tight text-balance sm:text-6xl">
              Tu próximo evento merece{" "}
              <em className="font-serif text-primary italic">
                más que tarjetas
              </em>
            </h2>
            <Button
              asChild
              size="lg"
              className="node-glow h-12 w-full rounded-full px-7 text-base sm:w-auto"
            >
              <Link href="/login">Crea tu constelación</Link>
            </Button>
          </div>
          {/* El limbo del planeta: el próximo evento como mundo por conocer */}
          <Planeta
            size={1100}
            className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-[78%] opacity-90"
          />
        </section>
      </main>

      <footer className="relative z-10 flex items-center justify-between gap-4 border-t border-border px-5 py-6 font-mono text-xs text-muted-foreground sm:px-8 lg:px-10">
        <span>
          constela<span className="text-primary">✦</span> 2026
        </span>
        <span>hecho para encontrarse</span>
      </footer>
    </div>
  );
}
