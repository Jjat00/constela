import { Button } from "@/components/ui/button";

const STARS = [
  { cx: 8, cy: 22, r: 0.5, d: "0s" },
  { cx: 16, cy: 70, r: 0.35, d: "1.1s" },
  { cx: 27, cy: 14, r: 0.45, d: "2.2s" },
  { cx: 41, cy: 82, r: 0.3, d: "0.6s" },
  { cx: 55, cy: 8, r: 0.4, d: "1.7s" },
  { cx: 68, cy: 76, r: 0.35, d: "2.8s" },
  { cx: 81, cy: 18, r: 0.5, d: "0.9s" },
  { cx: 93, cy: 60, r: 0.35, d: "2s" },
  { cx: 35, cy: 45, r: 0.25, d: "1.4s" },
  { cx: 74, cy: 40, r: 0.3, d: "0.2s" },
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
      <svg
        aria-hidden
        className="pointer-events-none absolute inset-0 h-full w-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid slice"
      >
        {STARS.map((s, i) => (
          <circle
            key={i}
            cx={s.cx}
            cy={s.cy}
            r={s.r}
            fill="var(--lumen)"
            className="animate-twinkle"
            style={{ animationDelay: s.d }}
          />
        ))}
      </svg>

      {/* Nav */}
      <header className="relative z-10 flex items-center justify-between px-6 py-5 sm:px-10">
        <span className="font-display text-xl font-semibold tracking-tight">
          constela<span className="text-primary">✦</span>
        </span>
        <Button size="sm" className="rounded-full px-4">
          Crear mi constelación
        </Button>
      </header>

      {/* Hero */}
      <section className="relative z-10 mx-auto flex w-full max-w-6xl flex-col items-start gap-8 px-6 pt-16 pb-24 sm:px-10 sm:pt-24">
        <p className="font-mono text-xs tracking-[0.3em] text-muted-foreground uppercase">
          [ red viva para eventos presenciales ]
        </p>

        <h1 className="font-display max-w-4xl text-[clamp(2.8rem,9vw,6.5rem)] leading-[0.98] font-bold tracking-tight text-balance">
          El networking que por fin{" "}
          <em className="font-serif font-normal text-primary italic">se ve</em>.
        </h1>

        <p className="max-w-xl text-lg leading-8 text-muted-foreground sm:text-xl">
          Conecta con un escaneo. Cada persona que conoces se vuelve una
          estrella, y tu red del evento se dibuja sola — con las conexiones de
          tus conexiones, en vivo.
        </p>

        <div className="flex flex-wrap items-center gap-5">
          <Button
            size="lg"
            className="node-glow h-12 rounded-full px-7 text-base"
          >
            Crea tu constelación
          </Button>
          <a
            href="#como-funciona"
            className="font-mono text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
          >
            ver cómo funciona ↓
          </a>
        </div>

        {/* Constelación que se dibuja */}
        <svg
          aria-hidden
          className="animate-float mt-6 w-full max-w-3xl self-center"
          viewBox="0 0 100 90"
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
          {Array.from({ length: 2 }).map((_, i) => (
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
        className="relative z-10 mx-auto w-full max-w-6xl px-6 py-24 sm:px-10"
      >
        <h2 className="font-display mb-12 text-3xl font-bold tracking-tight sm:text-5xl">
          Tres gestos,{" "}
          <em className="font-serif font-normal text-primary italic">
            una constelación
          </em>
        </h2>
        <div className="grid gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-3">
          {STEPS.map((s) => (
            <article
              key={s.n}
              className="group bg-background p-8 transition-colors hover:bg-card"
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
      <section className="relative z-10 mx-auto grid w-full max-w-6xl items-center gap-12 px-6 py-24 sm:grid-cols-2 sm:px-10">
        <div className="flex flex-col gap-6">
          <p className="font-mono text-xs tracking-[0.3em] text-muted-foreground uppercase">
            [ cierre triádico ]
          </p>
          <h2 className="font-display text-3xl font-bold tracking-tight text-balance sm:text-5xl">
            Cuando el círculo{" "}
            <em className="font-serif font-normal text-[var(--pulsar)] italic">
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
              <circle cx={x} cy={y} r={6} fill="var(--lumen)" opacity={0.14} />
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
      <section className="relative z-10 mx-auto flex w-full max-w-4xl flex-col items-center gap-8 px-6 py-28 text-center sm:px-10">
        <h2 className="font-display text-4xl leading-[1.05] font-bold tracking-tight text-balance sm:text-6xl">
          Tu próximo evento merece{" "}
          <em className="font-serif text-primary italic">más que tarjetas</em>
        </h2>
        <Button
          size="lg"
          className="node-glow h-13 rounded-full px-8 text-base"
        >
          Crea tu constelación
        </Button>
      </section>

      <footer className="relative z-10 flex items-center justify-between border-t border-border px-6 py-6 font-mono text-xs text-muted-foreground sm:px-10">
        <span>
          constela<span className="text-primary">✦</span> 2026
        </span>
        <span>hecho para encontrarse</span>
      </footer>
    </div>
  );
}
