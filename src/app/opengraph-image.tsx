import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { SITIO } from "@/lib/seo";

/*
 * La tarjeta que sale cuando alguien pega el link de Constela en un chat.
 *
 * POR QUÉ IMPORTA MÁS AQUÍ QUE EN OTROS PRODUCTOS: la distribución es
 * guerrilla, persona a persona (PRODUCT.md § Users). El link de Constela viaja
 * pegado en WhatsApp entre gente que acaba de conocerse — esta imagen es, en
 * la práctica, la primera pantalla del producto para media audiencia, y hasta
 * hoy no existía.
 *
 * Está dibujada en el idioma de v6 «Observatorio», no en el de una plantilla
 * de OG: papel liso, hairline al 11 %, cero degradados y cero resplandor. La
 * red se dibuja aquí a mano con divs porque Satori —el motor de
 * `ImageResponse`— no ejecuta el SVG animado de la portada; las coordenadas
 * son fijas para que la imagen sea idéntica en cada build y la caché de las
 * redes sociales no tenga que invalidarse.
 */

export const alt = `${SITIO.nombre} — ${SITIO.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const PAPEL = "#0B0C0F";
const TINTA = "#F2F3F5";
const SUAVE = "#8E939C";
const TENUE = "#7C828C";
const AZUL = "#6E9BFF";
const FILETE = "rgba(255,255,255,0.11)";

/** El lienzo de la constelación, en sus propias coordenadas. */
const LIENZO = 420;

type Nodo = { x: number; y: number; r: number; tinta?: string };

/**
 * Una constelación cualquiera de un evento cualquiera: diez estrellas y los
 * encuentros que las unieron. La grande y blanca es «tú» (v6 apagó el oro);
 * el triángulo azul es un cierre triádico, que es el momento social del
 * producto y por tanto lo único que aquí se destaca.
 */
const NODOS: Nodo[] = [
  { x: 58, y: 96, r: 3.5 },
  { x: 168, y: 42, r: 5, tinta: "#CDD8FF" },
  { x: 300, y: 104, r: 3 },
  { x: 358, y: 224, r: 4.5 },
  { x: 246, y: 302, r: 8, tinta: TINTA },
  { x: 118, y: 262, r: 3.5 },
  { x: 36, y: 192, r: 3 },
  { x: 202, y: 172, r: 5.5, tinta: "#9DB4FF" },
  { x: 316, y: 356, r: 2.5 },
  { x: 92, y: 366, r: 3 },
];

const ARISTAS: [number, number][] = [
  [0, 1],
  [1, 2],
  [2, 3],
  [0, 6],
  [6, 5],
  [5, 9],
  [9, 4],
  [4, 8],
  [8, 3],
  [1, 7],
  [5, 7],
  [0, 7],
];

/** Los tres que se conocen entre sí: el cierre triádico. */
const TRIADA: [number, number][] = [
  [3, 4],
  [4, 7],
  [7, 3],
];

/**
 * Una arista.
 *
 * Se posiciona por su **punto medio** y no por su extremo izquierdo: Satori
 * ignora `transform-origin` y rota siempre alrededor del centro del elemento.
 * Con el origen a la izquierda —que es como se dibujaría esto en un navegador—
 * cada línea salía despedida de sus dos estrellas y la constelación quedaba
 * hecha un montón de palillos sueltos. Centrada, la rotación por defecto de
 * Satori cae justo donde tiene que caer.
 */
function Linea({
  a,
  b,
  color,
  opacidad,
  grosor,
}: {
  a: Nodo;
  b: Nodo;
  color: string;
  opacidad: number;
  grosor: number;
}) {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const largo = Math.sqrt(dx * dx + dy * dy);
  const angulo = (Math.atan2(dy, dx) * 180) / Math.PI;
  return (
    <div
      style={{
        position: "absolute",
        left: (a.x + b.x) / 2 - largo / 2,
        top: (a.y + b.y) / 2 - grosor / 2,
        width: largo,
        height: grosor,
        background: color,
        opacity: opacidad,
        transform: `rotate(${angulo}deg)`,
      }}
    />
  );
}

/**
 * Inter Tight, la tipografía de v6, para que la tarjeta social no sea la única
 * superficie de Constela escrita en otra letra. Se descarga en el build igual
 * que hace `next/font` con las del sitio.
 *
 * Con red de seguridad a propósito: si Google Fonts no responde durante un
 * despliegue, la imagen sale con la fuente por defecto de Satori en vez de
 * tumbar el build entero. Una tarjeta social con la letra equivocada es un
 * defecto; un despliegue caído por una tarjeta social es un incidente.
 */
async function interTight(): Promise<
  { name: string; data: ArrayBuffer; weight: 400 | 600; style: "normal" }[]
> {
  try {
    const pesos = [400, 600] as const;
    const fuentes = await Promise.all(
      pesos.map(async (weight) => {
        const css = await fetch(
          `https://fonts.googleapis.com/css2?family=Inter+Tight:wght@${weight}`,
          { headers: { "User-Agent": "Mozilla/5.0" } },
        ).then((r) => r.text());
        const url = css.match(/src:\s*url\((https:[^)]+)\)/)?.[1];
        if (!url) throw new Error("sin url de fuente");
        const data = await fetch(url).then((r) => r.arrayBuffer());
        return { name: "Inter Tight", data, weight, style: "normal" as const };
      }),
    );
    return fuentes;
  } catch {
    return [];
  }
}

export default async function OpenGraphImage() {
  // El lockup real, no un wordmark recompuesto: la marca de la pestaña, del
  // pie y de esta tarjeta tienen que ser el mismo objeto.
  const [logo, fuentes] = await Promise.all([
    readFile(join(process.cwd(), "src/assets/logo-constela.png")),
    interTight(),
  ]);
  const logoSrc = `data:image/png;base64,${logo.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: PAPEL,
          color: TINTA,
          fontFamily: "Inter Tight, sans-serif",
          position: "relative",
        }}
      >
        {/* La hairline que cruza a sangre: el único marco de esta escuela */}
        <div style={{ display: "flex", height: 1, background: FILETE }} />

        <div
          style={{
            display: "flex",
            flex: 1,
            padding: "56px 72px",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              width: 660,
            }}
          >
            {/* `next/image` no existe dentro de Satori: aquí `img` es la
                única primitiva de imagen que hay. */}
            <img src={logoSrc} alt="Constela" height={46} width={139} />

            {/* En una sola línea a propósito: JSX colapsa los saltos de línea
                del código en espacios, y en Satori eso se ve —el titular salía
                con un hueco doble en mitad de la frase. */}
            <div
              style={{
                display: "flex",
                marginTop: 40,
                fontSize: 68,
                fontWeight: 600,
                letterSpacing: "-0.05em",
                lineHeight: 1.02,
              }}
            >
              {"El networking que por fin se ve."}
            </div>

            <div
              style={{
                display: "flex",
                marginTop: 26,
                fontSize: 25,
                lineHeight: 1.45,
                color: SUAVE,
                maxWidth: 600,
              }}
            >
              {"Escaneas el QR de quien acabas de conocer y la red del evento se dibuja en vivo."}
            </div>
          </div>

          {/* La constelación, recortada por el borde como en la portada */}
          <div
            style={{
              display: "flex",
              position: "relative",
              width: LIENZO,
              height: LIENZO,
            }}
          >
            {ARISTAS.map(([i, j]) => (
              <Linea
                key={`a${i}-${j}`}
                a={NODOS[i]}
                b={NODOS[j]}
                color={SUAVE}
                opacidad={0.42}
                grosor={1}
              />
            ))}
            {TRIADA.map(([i, j]) => (
              <Linea
                key={`t${i}-${j}`}
                a={NODOS[i]}
                b={NODOS[j]}
                color={AZUL}
                opacidad={0.85}
                grosor={1.5}
              />
            ))}
            {NODOS.map((n, i) => (
              <div
                key={`n${i}`}
                style={{
                  position: "absolute",
                  left: n.x - n.r,
                  top: n.y - n.r,
                  width: n.r * 2,
                  height: n.r * 2,
                  borderRadius: n.r,
                  background: n.tinta ?? SUAVE,
                }}
              />
            ))}
          </div>
        </div>

        <div style={{ display: "flex", height: 1, background: FILETE }} />
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: "26px 72px 30px",
            fontSize: 17,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            color: TENUE,
          }}
        >
          <div style={{ display: "flex" }}>
            App de networking para eventos
          </div>
          <div style={{ display: "flex" }}>constela.com.co</div>
        </div>
      </div>
    ),
    { ...size, fonts: fuentes.length ? fuentes : undefined },
  );
}
