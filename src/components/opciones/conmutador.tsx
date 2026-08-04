import Link from "next/link";
import { OPCIONES } from "@/app/opciones/datos";

/*
 * El conmutador de revisión: chrome de comparación, no parte del diseño.
 *
 * Comparar diez landings exige saltar entre ellas sin volver al índice cada
 * vez. Va deliberadamente en un lenguaje neutro —vidrio oscuro, misma forma en
 * las diez— para no contaminar la propuesta que se está mirando: si cambiara
 * de estilo en cada opción, la comparación dejaría de ser limpia.
 *
 * Se estiliza con CSS propio y prefijo `cmt-` en vez de con los tokens de la
 * página, justo para que ninguna opción pueda teñirlo por accidente.
 */

const CSS = `
.cmt-barra{position:fixed;left:50%;bottom:max(0.85rem,env(safe-area-inset-bottom));transform:translateX(-50%);z-index:80;display:flex;align-items:center;gap:.15rem;padding:.3rem;border-radius:999px;background:rgba(9,11,18,.82);border:1px solid rgba(255,255,255,.14);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);box-shadow:0 18px 44px -18px rgba(0,0,0,.85);font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:11px;letter-spacing:.06em;color:#fff;max-width:calc(100vw - 1.5rem)}
.cmt-barra a,.cmt-barra span{display:inline-flex;align-items:center;justify-content:center;height:30px;border-radius:999px;color:rgba(255,255,255,.62);text-decoration:none;white-space:nowrap}
.cmt-barra a{transition:background-color .18s ease,color .18s ease}
.cmt-barra a:hover{background:rgba(255,255,255,.12);color:#fff}
.cmt-barra a:focus-visible{outline:2px solid #fff;outline-offset:2px}
.cmt-flecha{width:30px;font-size:13px}
.cmt-inerte{width:30px;opacity:.28}
.cmt-actual{padding:0 .7rem;color:#fff;gap:.5rem;overflow:hidden}
.cmt-actual b{font-weight:500}
.cmt-nota{color:rgba(255,255,255,.45);display:none}
.cmt-todas{padding:0 .8rem;border-left:1px solid rgba(255,255,255,.14);margin-left:.15rem;border-radius:0 999px 999px 0}
@media (min-width:640px){.cmt-nota{display:inline}}
`;

export function Conmutador({ n }: { n: number }) {
  const actual = OPCIONES.find((o) => o.n === n);
  const anterior = OPCIONES.find((o) => o.n === n - 1);
  const siguiente = OPCIONES.find((o) => o.n === n + 1);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <nav className="cmt-barra" aria-label="Comparar propuestas de landing">
        {anterior ? (
          <Link
            href={anterior.ruta}
            className="cmt-flecha"
            aria-label={`Opción ${anterior.n}: ${anterior.nombre}`}
          >
            ←
          </Link>
        ) : (
          <span className="cmt-inerte" aria-hidden>
            ←
          </span>
        )}

        <span className="cmt-actual">
          <b>
            {n}/10 · {actual?.nombre}
          </b>
          <span className="cmt-nota">{actual?.nota}</span>
        </span>

        {siguiente ? (
          <Link
            href={siguiente.ruta}
            className="cmt-flecha"
            aria-label={`Opción ${siguiente.n}: ${siguiente.nombre}`}
          >
            →
          </Link>
        ) : (
          <span className="cmt-inerte" aria-hidden>
            →
          </span>
        )}

        <Link href="/opciones" className="cmt-todas">
          Todas
        </Link>
      </nav>
    </>
  );
}
