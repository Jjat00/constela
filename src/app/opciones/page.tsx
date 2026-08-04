import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@/components/logo";
import { RedSVG } from "@/components/opciones/red-svg";

/*
 * El índice de las diez propuestas de landing.
 *
 * Va deliberadamente en la marca vigente (v5 «Observatorio»: DM Sans, cielo
 * #02030A, cosmic blue) y no en un estilo propio: es el mostrador, no una
 * pieza más. Si el índice tuviera personalidad competiría con lo que hay que
 * comparar.
 *
 * Cada ficha lleva la apuesta y el coste de su opción, porque elegir un
 * rediseño es elegir qué se pierde: sin esa línea, las diez parecen
 * intercambiables.
 */

export const metadata: Metadata = {
  title: "Diez rediseños de la landing — Constela",
  description:
    "Diez propuestas de landing para Constela, cada una en su propia ruta: qué apuesta y qué cuesta cada una.",
};

type Ficha = {
  n: number;
  nombre: string;
  escuela: string;
  paleta: string[];
  tipo: string;
  apuesta: string;
  coste: string;
  fondo: string;
};

const FICHAS: Ficha[] = [
  {
    n: 1,
    nombre: "Observatorio",
    escuela: "Minimalismo suizo",
    paleta: ["#0B0C0F", "#F2F3F5", "#6E9BFF"],
    tipo: "Inter Tight · IBM Plex Mono",
    apuesta: "Precisión: retícula visible, hairlines y un solo azul en toda la página.",
    coste: "Renuncia al «wow» del cosmos. Es la que menos emociona y la que mejor envejece.",
    fondo: "#0B0C0F",
  },
  {
    n: 2,
    nombre: "Documento",
    escuela: "Escuela Vercel",
    paleta: ["#FFFFFF", "#000000", "#0070F3"],
    tipo: "Geist",
    apuesta: "Confianza técnica: blanco puro, contraste máximo, cajas de 1px.",
    coste: "Pierde el cielo entero. Constela parecería infraestructura, no un evento.",
    fondo: "#FFFFFF",
  },
  {
    n: 3,
    nombre: "Corriente",
    escuela: "Escuela Linear",
    paleta: ["#08090D", "#7C74F0", "#6E9BFF"],
    tipo: "Inter",
    apuesta: "Sensación de producto caro: malla violeta, cristal y tipo pequeño y nítido.",
    coste: "Devuelve el violeta que la v5 abandonó, y se parece a otros veinte SaaS.",
    fondo: "#08090D",
  },
  {
    n: 4,
    nombre: "Telemetría",
    escuela: "Futurista · consola de misión",
    paleta: ["#05070A", "#FFB000", "#6FE3FF"],
    tipo: "JetBrains Mono",
    apuesta: "El producto como instrumento: todo etiquetado, todo medido, ámbar de aviso.",
    coste: "La más lejana de la marca y la que peor escala fuera del nicho técnico.",
    fondo: "#05070A",
  },
  {
    n: 5,
    nombre: "Encuentro",
    escuela: "Startup cálida",
    paleta: ["#FBF6EF", "#C25A3C", "#E0A33D"],
    tipo: "Fraunces · Plus Jakarta Sans",
    apuesta: "Calidez: papel crema, terracota y una voz que sonríe. La más fácil de leer.",
    coste: "Pierde la nocturnidad y el cine — y el evento se vive de noche.",
    fondo: "#FBF6EF",
  },
  {
    n: 6,
    nombre: "Efemérides",
    escuela: "Editorial impreso",
    paleta: ["#F4F1EA", "#1B3A6B", "#A93226"],
    tipo: "Instrument Serif · Inter",
    apuesta: "Autoridad: boletín astronómico con capitular, columnas y lámina grabada.",
    coste: "La más lenta de leer y la menos «app». Exige texto bueno para funcionar.",
    fondo: "#F4F1EA",
  },
  {
    n: 7,
    nombre: "Cartel",
    escuela: "Brutalismo de póster",
    paleta: ["#0D0D0D", "#E8FF4D", "#F5F5F0"],
    tipo: "Anton · Space Mono",
    apuesta: "Legibilidad de lejos y de reojo — que es cómo se mira un teléfono ajeno.",
    coste: "Nada premium, y el texto largo se le atraganta.",
    fondo: "#0D0D0D",
  },
  {
    n: 8,
    nombre: "Secuencia",
    escuela: "Cinematográfico",
    paleta: ["#02030A", "#FFD97A", "#9DC8FF"],
    tipo: "DM Sans · Geist Mono (sin fuentes nuevas)",
    apuesta: "La única que no toca la marca: misma paleta y tipo, estructura de película.",
    coste: "El contenido denso se resiste al formato de cartela; obliga a scrollear.",
    fondo: "#02030A",
  },
  {
    n: 9,
    nombre: "Cristal",
    escuela: "Spatial · Vision Pro",
    paleta: ["#060A16", "#A8D8FF", "#B9B4FF"],
    tipo: "Manrope",
    apuesta: "Profundidad como jerarquía: bento de placas de vidrio sobre luz ambiental.",
    coste: "El vidrio es caro de pintar y frágil en móviles viejos.",
    fondo: "#060A16",
  },
  {
    n: 10,
    nombre: "Serigrafía",
    escuela: "Riso duotono",
    paleta: ["#EFE7DA", "#1B3FD8", "#FF4F58"],
    tipo: "Space Grotesk",
    apuesta: "Cartel repartido a mano: dos tintas planas, sobreimpresión y grano.",
    coste: "Dos tintas dejan poco margen para estados de UI. Memorable, poco escalable.",
    fondo: "#EFE7DA",
  },
];

export default function IndiceOpciones() {
  return (
    <main className="grain relative min-h-svh">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[42rem] opacity-60 [-webkit-mask-image:radial-gradient(80%_70%_at_50%_0%,#000_10%,transparent_75%)] [mask-image:radial-gradient(80%_70%_at_50%_0%,#000_10%,transparent_75%)]"
      >
        <RedSVG n={30} escala={0.7} className="h-full w-full" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-6xl px-6 lg:px-10">
        <header className="flex items-center justify-between gap-4 pt-8">
          <Link href="/" aria-label="Constela — volver a la landing actual">
            <Logo className="h-8" priority />
          </Link>
          <Link
            href="/"
            className="chip-star flex h-9 items-center px-4 text-[13px] font-medium"
          >
            Landing actual
          </Link>
        </header>

        <section className="pt-16 pb-12 lg:pt-24 lg:pb-16">
          <p className="font-mono text-[11px] tracking-wider text-faint">
            [ REDISEÑO · DIEZ PROPUESTAS ]
          </p>
          <h1 className="mt-5 max-w-[18ch] text-[clamp(2.25rem,6.5vw,4rem)] leading-[1] font-medium tracking-tighter text-balance">
            Diez formas de abrir <span className="text-celeste">la misma puerta.</span>
          </h1>
          <p className="mt-6 max-w-[52ch] text-[15px] leading-relaxed text-muted-foreground lg:text-base">
            Las diez cuentan exactamente lo mismo —los mismos hechos, la misma
            red, sin una sola métrica inventada— y cambian solo el lenguaje
            visual. Cada ficha dice qué gana esa opción y qué pierde, porque
            elegir un rediseño es elegir qué se sacrifica.
          </p>
        </section>

        <ul className="grid gap-4 pb-24 sm:grid-cols-2">
          {FICHAS.map((f) => (
            <li key={f.n}>
              <Link
                href={`/opcion${f.n}`}
                className="glass group flex h-full flex-col gap-4 rounded-2xl p-5 transition-colors hover:border-white/20 lg:p-6"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-mono text-[10.5px] tracking-wider text-faint">
                      OPCIÓN {String(f.n).padStart(2, "0")}
                    </p>
                    <h2 className="mt-1.5 text-xl font-semibold tracking-snug">
                      {f.nombre}
                    </h2>
                    <p className="mt-0.5 text-[13px] text-celeste">{f.escuela}</p>
                  </div>
                  <div
                    aria-hidden
                    className="flex shrink-0 items-center gap-1 rounded-full border border-white/10 p-1.5"
                    style={{ background: f.fondo }}
                  >
                    {f.paleta.map((c) => (
                      <span
                        key={c}
                        className="size-3.5 rounded-full ring-1 ring-black/20"
                        style={{ background: c }}
                      />
                    ))}
                  </div>
                </div>

                <dl className="grid gap-2.5 text-[13.5px] leading-relaxed">
                  <div>
                    <dt className="font-mono text-[10px] tracking-wider text-faint">
                      APUESTA
                    </dt>
                    <dd className="mt-1 text-foreground">{f.apuesta}</dd>
                  </div>
                  <div>
                    <dt className="font-mono text-[10px] tracking-wider text-faint">
                      COSTE
                    </dt>
                    <dd className="mt-1 text-muted-foreground">{f.coste}</dd>
                  </div>
                </dl>

                <p className="mt-auto flex items-center justify-between gap-3 pt-1 font-mono text-[10.5px] tracking-wider text-faint">
                  <span className="min-w-0 truncate">{f.tipo}</span>
                  <span className="shrink-0 text-celeste transition-transform group-hover:translate-x-0.5">
                    VER →
                  </span>
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
