import Link from "next/link";
import { CosmicSky } from "@/components/cosmos";
import { GoogleButton } from "@/app/login/google-button";
import { LogoutButton } from "@/app/login/logout-button";
import { SiteFooter } from "@/components/site-footer";
import { createClient } from "@/lib/supabase/server";

/*
 * CONTRATO DE DIRECCIÓN — v5 «Observatorio» (diseño 1a, Constela.dc.html)
 *
 * THESIS: la landing es la puerta, no un folleto: un titular, un botón y el
 * universo detrás. Toda la promesa cabe en un viewport; rechazo del hero
 * SaaS con secciones, marquee y features.
 * OWN-WORLD: cielo #0A0C12 casi monocromo con horizonte de planeta; la red
 * del evento dibujándose arriba a la derecha; titular gigante Geist con
 * «tu universo.» en celeste #9DC8FF; CTA de cristal cosmic blue; mono de
 * observatorio para las coordenadas.
 * STORY: ver la red dibujarse → «tu red es tu universo» → entrar con Google
 * en 8 segundos.
 * FORM: dirección pineada por el usuario (claude.ai/design, 2026-07-28).
 */

/** mulberry32 — misma familia de PRNG que el resto del cosmos. */
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
 * Constelación decorativa: el StarMap del diseño en modo `decor`, con el
 * mismo universo demo determinista de `constela-data.js` (36 estrellas,
 * ángulo áureo + vecino más cercano + cierre triádico). Es ilustración,
 * no datos: va `aria-hidden` y sin interacción — pero el dibujo es el
 * mismo del render: triángulos H-alfa, halos espectrales con blur, sol
 * con corona y picos de difracción.
 */
const CLASES_DECOR = ["#9DB4FF", "#CDD8FF", "#E6ECFF", "#FFD9A8", "#FFB380"];

function universoDecor(seed = 11, n = 36) {
  const rand = prng(seed);
  // Mismo consumo de rand() que buildUniverse: los descartes mantienen la
  // secuencia y con ella las posiciones exactas del render del diseño.
  const stars: Array<{ x: number; y: number; halo: string; sun: boolean }> =
    [];
  for (let i = 0; i < n; i++) {
    const a = i * 2.39996 + (rand() - 0.5) * 0.5;
    const r =
      i === 0 ? 0 : (0.16 + 0.84 * Math.sqrt(i / n)) * (0.86 + rand() * 0.28);
    const halo =
      i === 0
        ? "#FFD97A"
        : CLASES_DECOR[Math.floor(rand() * CLASES_DECOR.length)];
    const x = 500 + Math.cos(a) * r * 410;
    const y = 500 + Math.sin(a) * r * 400;
    if (i > 0) rand(); // rol
    rand(); // interés
    rand(); // intención
    rand(); // twinkle
    rand(); // delay
    stars.push({ x, y, halo, sun: i === 0 });
  }

  const adj = stars.map(() => new Set<number>());
  const edges: Array<{ a: number; b: number }> = [];
  const link = (a: number, b: number) => {
    if (a === b || adj[a].has(b)) return;
    adj[a].add(b);
    adj[b].add(a);
    edges.push({ a, b });
  };
  for (let i = 1; i < n; i++) {
    const near = stars
      .slice(0, i)
      .map((s, j) => ({
        id: j,
        d: (s.x - stars[i].x) ** 2 + (s.y - stars[i].y) ** 2,
      }))
      .sort((p, q) => p.d - q.d)
      .slice(0, 5);
    const first = near[Math.floor(rand() * Math.min(2, near.length))].id;
    link(i, first);
    const fn = [...adj[first]].filter((x) => x !== i);
    if (fn.length && rand() < 0.72) link(i, fn[Math.floor(rand() * fn.length)]);
    if (rand() < 0.3 && near[2]) link(i, near[2].id);
    if (i < 7) link(i, 0);
  }

  const mags = stars.map((s, i) =>
    s.sun ? 5.4 : 1 + Math.min(adj[i].size, 7) * 0.34,
  );

  // Cierres triádicos del sol: los polígonos H-alfa del render
  const triads: string[] = [];
  for (const e of edges) {
    const shared = [...adj[e.a]].filter((x) => x > e.b && adj[e.b].has(x));
    for (const c of shared) {
      if (e.a !== 0 && e.b !== 0 && c !== 0) continue;
      triads.push(
        [stars[e.a], stars[e.b], stars[c]]
          .map((s) => `${s.x.toFixed(1)},${s.y.toFixed(1)}`)
          .join(" "),
      );
    }
  }

  return { stars, edges, mags, triads };
}

function ConstelacionDecor() {
  const { stars, edges, mags, triads } = universoDecor();
  return (
    <svg
      aria-hidden
      viewBox="0 0 1000 1000"
      preserveAspectRatio="xMidYMid slice"
      className="absolute inset-0 h-full w-full"
    >
      {triads.map((pts, i) => (
        <polygon
          key={i}
          points={pts}
          fill="#F0699F"
          fillOpacity={0.085}
          stroke="#F0699F"
          strokeOpacity={0.34}
          strokeWidth={0.6}
        />
      ))}
      {edges.map((e, i) => (
        <line
          key={i}
          x1={stars[e.a].x.toFixed(1)}
          y1={stars[e.a].y.toFixed(1)}
          x2={stars[e.b].x.toFixed(1)}
          y2={stars[e.b].y.toFixed(1)}
          stroke="#CDD8FF"
          strokeWidth={0.65}
          opacity={0.34}
          pathLength={1}
          className="animate-draw"
          style={{
            animationDelay: `${0.25 + i * 0.035}s`,
            filter: "drop-shadow(0 0 3px rgba(205,216,255,0.35))",
          }}
        />
      ))}
      {stars.map((s, i) => {
        const mag = mags[i];
        const m = mag * 0.9; // decor: apenas más discreto que el mapa real
        return (
          <g key={i} transform={`translate(${s.x.toFixed(1)} ${s.y.toFixed(1)})`}>
            {s.sun && (
              <>
                <circle
                  r={46}
                  fill="#FFD97A"
                  opacity={0.16}
                  className="animate-corona"
                  style={{
                    filter: "blur(16px)",
                    transformBox: "fill-box",
                    transformOrigin: "center",
                  }}
                />
                <circle
                  r={22}
                  fill="#FFE9A8"
                  opacity={0.5}
                  style={{ filter: "blur(7px)" }}
                />
              </>
            )}
            <circle
              r={(m * 4.2).toFixed(1)}
              fill={s.halo}
              opacity={s.sun ? 0.3 : 0.22}
              style={{ filter: `blur(${(m * 1.5).toFixed(1)}px)` }}
            />
            <circle
              r={(m * 1.9).toFixed(1)}
              fill={s.halo}
              opacity={s.sun ? 0.95 : 0.62}
            />
            <circle r={(m * (s.sun ? 0.62 : 0.72)).toFixed(2)} fill="#FFFFFF" />
            {(mag > 2.1 || s.sun) && (
              <>
                <line
                  x1={(-m * 4.6).toFixed(1)}
                  y1="0"
                  x2={(m * 4.6).toFixed(1)}
                  y2="0"
                  stroke={s.sun ? "#FFF4C7" : "#FFFFFF"}
                  strokeWidth={0.5}
                  opacity={0.45}
                  style={{ filter: "blur(0.6px)" }}
                />
                <line
                  x1="0"
                  y1={(-m * 4.6).toFixed(1)}
                  x2="0"
                  y2={(m * 4.6).toFixed(1)}
                  stroke={s.sun ? "#FFF4C7" : "#FFFFFF"}
                  strokeWidth={0.5}
                  opacity={0.45}
                  style={{ filter: "blur(0.6px)" }}
                />
              </>
            )}
          </g>
        );
      })}
    </svg>
  );
}

export default async function LandingPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <main className="grain relative flex min-h-svh flex-col overflow-hidden">
      <CosmicSky planet />

      {/* La red del evento, dibujándose en el cielo */}
      <div
        aria-hidden
        className="absolute z-0 -top-[6%] right-0 left-0 h-[56%] [-webkit-mask-image:radial-gradient(66%_66%_at_50%_42%,#000_25%,transparent_100%)] [mask-image:radial-gradient(66%_66%_at_50%_42%,#000_25%,transparent_100%)] lg:-top-[14%] lg:-right-[8%] lg:left-auto lg:h-[124%] lg:w-[66%] lg:[-webkit-mask-image:radial-gradient(70%_70%_at_62%_45%,#000_30%,transparent_100%)] lg:[mask-image:radial-gradient(70%_70%_at_62%_45%,#000_30%,transparent_100%)]"
      >
        <ConstelacionDecor />
      </div>

      {/* Chrome mínimo: wordmark + coordenadas del evento + la puerta */}
      <header className="relative z-10 flex items-center justify-between px-7 pt-[calc(2rem+env(safe-area-inset-top))] lg:px-14 lg:pt-8">
        <p className="text-[17px] font-semibold tracking-tight lg:text-[19px]">
          constela<span className="text-sol">✦</span>
        </p>
        <p className="glass hidden rounded-full px-3.5 py-2 font-mono text-[11px] tracking-[0.16em] text-muted-foreground lg:block">
          [ PARA CUALQUIER EVENTO ]
        </p>
        {/* La puerta de servicio: quien ya sabe qué es esto no debería tener
            que leer el titular otra vez. Píldora sutil, nunca cosmic blue —
            el CTA de la pantalla sigue siendo uno solo. */}
        {user ? (
          <LogoutButton />
        ) : (
          <Link
            href="/login"
            className="chip-star flex h-9.5 items-center px-5 text-[13px] font-medium"
          >
            Entrar
          </Link>
        )}
      </header>

      {/* El titular y la puerta */}
      <div className="relative z-10 flex flex-1 flex-col justify-end px-7 pb-9 lg:justify-center lg:px-22 lg:pb-20">
        <div className="animate-rise max-w-[41rem]">
          <h1 className="text-[clamp(2.75rem,10vw,5.875rem)] leading-[0.98] font-bold tracking-[-0.045em] text-balance lg:leading-[0.94]">
            Tu red es
            <br />
            <span className="text-celeste">tu universo.</span>
          </h1>
          <p className="mt-5 max-w-100 text-[15px] leading-relaxed text-muted-foreground lg:mt-6.5 lg:text-lg">
            El networking que por fin se ve. Escaneas, y la red del evento se
            dibuja.
          </p>
          <div className="mt-8 flex flex-col gap-3.5 lg:mt-10 lg:flex-row lg:items-center lg:gap-4.5">
            {user ? (
              <Link
                href="/home"
                className="btn-cosmic flex h-14 items-center justify-center px-7 text-base font-medium lg:h-[54px]"
              >
                Entrar a tu constelación
              </Link>
            ) : (
              <div className="w-full lg:w-72">
                <GoogleButton next="/home" />
              </div>
            )}
            <p className="text-center font-mono text-[11px] tracking-[0.16em] text-faint lg:text-left">
              [ 8 SEGUNDOS ]
            </p>
          </div>
        </div>
      </div>

      {/* El borde del universo: la tesis a un lado, lo legal al otro. Ya no
          es absolute — el pie ocupa su sitio en el flujo para que en móvil
          nunca se monte sobre el CTA. */}
      <SiteFooter tagline="CADA PERSONA ES UNA ESTRELLA" className="lg:px-22" />
    </main>
  );
}
