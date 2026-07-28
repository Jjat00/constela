import Link from "next/link";
import { Button } from "@/components/ui/button";

// Posiciones en % del documento completo; tamaño en px fijos para que las
// estrellas no escalen con la altura de la página.
const STARS = [
  { x: "8%", y: "2%", s: 3, d: "0s" },
  { x: "22%", y: "5%", s: 2, d: "1.4s" },
  { x: "55%", y: "3%", s: 2.5, d: "0.6s" },
  { x: "81%", y: "6%", s: 3, d: "2.2s" },
  { x: "93%", y: "12%", s: 2, d: "1.1s" },
  { x: "12%", y: "17%", s: 2.5, d: "2.8s" },
  { x: "68%", y: "20%", s: 3, d: "0.9s" },
  { x: "35%", y: "26%", s: 2, d: "1.7s" },
  { x: "88%", y: "30%", s: 2.5, d: "0.2s" },
  { x: "6%", y: "41%", s: 2, d: "2.4s" },
  { x: "74%", y: "46%", s: 3, d: "1.2s" },
  { x: "28%", y: "55%", s: 2, d: "0.4s" },
  { x: "91%", y: "62%", s: 2.5, d: "2s" },
  { x: "15%", y: "70%", s: 3, d: "1.5s" },
  { x: "62%", y: "78%", s: 2, d: "2.6s" },
  { x: "40%", y: "88%", s: 2.5, d: "0.8s" },
];

// Constelación del hero: nodos y aristas; el triángulo central se cierra al final
const NODES = [
  { x: 22, y: 60, r: 1.1 },
  { x: 38, y: 34, r: 1.5 }, // tú
  { x: 58, y: 48, r: 1.2 },
  { x: 72, y: 26, r: 0.9 },
  { x: 84, y: 58, r: 0.8 },
  { x: 46, y: 74, r: 0.9 },
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

export default function Home() {
  return (
    <div className="grain relative flex flex-1 flex-col overflow-x-clip">
      {/* Auroras de fondo */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 h-[36rem] w-[56rem] -translate-x-1/2 rounded-full opacity-25 blur-3xl"
        style={{
          background:
            "radial-gradient(closest-side, oklch(0.8 0.14 70 / 55%), transparent 70%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute top-[38rem] -left-60 h-[30rem] w-[42rem] rounded-full opacity-20 blur-3xl"
        style={{
          background:
            "radial-gradient(closest-side, oklch(0.62 0.13 295 / 60%), transparent 70%)",
        }}
      />

      {/* Estrellas de fondo */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        {STARS.map((s, i) => (
          <span
            key={i}
            className="animate-twinkle bg-lumen absolute rounded-full"
            style={{
              left: s.x,
              top: s.y,
              width: s.s,
              height: s.s,
              animationDelay: s.d,
            }}
          />
        ))}
      </div>

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
        <section className="relative z-10 mx-auto flex w-full max-w-6xl flex-col items-start gap-7 px-5 pt-12 pb-16 sm:gap-8 sm:px-8 sm:pt-24 sm:pb-24 lg:px-10">
          <p className="font-mono text-xs tracking-[0.3em] text-muted-foreground uppercase">
            [ red viva para eventos presenciales ]
          </p>

          <h1 className="font-display max-w-4xl text-[clamp(2.8rem,9vw,6.5rem)] leading-[0.98] font-bold tracking-tight text-balance">
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

          {/* Constelación que se dibuja */}
          <svg
            aria-hidden
            className="animate-float mt-6 w-full max-w-3xl self-center"
            viewBox="16 20 73 60"
            fill="none"
          >
            {EDGES.map(([a, b, delay, closes], i) => (
              <line
                key={i}
                x1={NODES[a].x}
                y1={NODES[a].y}
                x2={NODES[b].x}
                y2={NODES[b].y}
                pathLength={1}
                stroke={closes ? "var(--pulsar)" : "var(--lila)"}
                strokeOpacity={closes ? 0.9 : 0.45}
                strokeWidth={closes ? 0.35 : 0.25}
                className="animate-draw"
                style={{ animationDelay: delay }}
              />
            ))}
            {NODES.map((n, i) => (
              <g key={i}>
                <circle
                  cx={n.x}
                  cy={n.y}
                  r={n.r * 2.6}
                  fill="var(--lumen)"
                  opacity={0.12}
                />
                <circle
                  cx={n.x}
                  cy={n.y}
                  r={n.r}
                  fill={i === 1 ? "var(--lumen)" : "var(--foreground)"}
                  className="animate-twinkle"
                  style={{ animationDelay: `${i * 0.5}s` }}
                />
              </g>
            ))}
            <text
              x={NODES[1].x}
              y={NODES[1].y - 4}
              fontSize="2.6"
              fill="var(--lumen)"
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
                <span>cada persona es una estrella ✦</span>
                <span>tu red, dibujada en vivo ✦</span>
                <span>escanea. conecta. constela. ✦</span>
                <span>los triángulos se cierran ✦</span>
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
                className="bg-background p-6 transition-colors hover:bg-card sm:p-8"
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
              <em className="font-serif font-normal text-pulsar italic">
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
          <svg
            aria-hidden
            className="mx-auto w-full max-w-xs"
            viewBox="0 0 100 100"
            fill="none"
          >
            <polygon
              points="50,16 18,78 82,78"
              fill="var(--pulsar)"
              fillOpacity="0.07"
              stroke="var(--pulsar)"
              strokeOpacity="0.75"
              strokeWidth="0.5"
            />
            {[
              [50, 16],
              [18, 78],
              [82, 78],
            ].map(([x, y], i) => (
              <g key={i}>
                <circle
                  cx={x}
                  cy={y}
                  r={6}
                  fill="var(--lumen)"
                  opacity={0.14}
                />
                <circle
                  cx={x}
                  cy={y}
                  r={2.2}
                  fill="var(--lumen)"
                  className="animate-twinkle"
                  style={{ animationDelay: `${i * 0.7}s` }}
                />
              </g>
            ))}
          </svg>
        </section>

        {/* CTA final */}
        <section className="relative z-10 mx-auto flex w-full max-w-4xl flex-col items-center gap-8 px-5 py-20 text-center sm:px-8 sm:py-28 lg:px-10">
          <h2 className="font-display text-3xl leading-[1.05] font-bold tracking-tight text-balance sm:text-6xl">
            Tu próximo evento merece{" "}
            <em className="font-serif text-primary italic">más que tarjetas</em>
          </h2>
          <Button
            asChild
            size="lg"
            className="node-glow h-12 w-full rounded-full px-7 text-base sm:w-auto"
          >
            <Link href="/login">Crea tu constelación</Link>
          </Button>
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
