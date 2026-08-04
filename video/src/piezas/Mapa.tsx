import { interpolate } from "remotion";
import { EstrellaSVG } from "./EstrellaSVG";
import { usePaleta } from "../visual";
import {
  encendida,
  ESTRELLAS,
  LINEAS,
  TRIANGULOS,
  type Estrella,
  type Filtro,
} from "../universo";

/**
 * El mapa estelar: la anatomía EXACTA del grafo de la app —núcleo blanco,
 * halo espectral difuso, picos de difracción en las brillantes, sol con
 * corona— y el mismo gesto de entrada: los filamentos se trazan escalonados,
 * después se ionizan los cierres triádicos en H-alfa.
 *
 * Todo se dibuja en un SVG con coordenadas de píxel ya resueltas: nada
 * depende del reloj ni del azar, solo de los progresos que entran por props.
 */

export type MapaProps = {
  /** Centro del mapa en el lienzo. */
  cx: number;
  cy: number;
  /** Media distancia del encuadre: las estrellas viven en [-radio, radio]. */
  radio: number;
  /** Píxeles por unidad de magnitud (el «grosor» de las estrellas). */
  cuerpo: number;
  /** 0 → ninguna línea; 1 → todas trazadas. Escalonado como en la app. */
  trazo: number;
  /** 0 → sin estrellas; 1 → todas encendidas. */
  aparicion: number;
  /** Opacidad de los nombres. */
  nombres: number;
  /** Opacidad del gas H-alfa de los triángulos. */
  triadas: number;
  /** Filtro activo; lo que no coincide baja al 14 % como en el panel real. */
  filtro?: Filtro;
  /** 0 → filtro sin aplicar todavía; 1 → aplicado del todo. */
  filtroProgreso?: number;
  /** Escala tipográfica de los nombres. */
  u: number;
  /** Tamaño del nombre de cada estrella, ya en píxeles. */
  etiqueta: number;
  /** Acuesta el dibujo 90°: el mismo grafo, girado para un encuadre alto. */
  rotar?: boolean;
};

/** Cada estrella entra un poco después que la anterior, del centro hacia fuera. */
function retrasoDe(i: number) {
  return i / (ESTRELLAS.length * 1.6);
}

/** El mismo escalonado de `.animate-draw`: 0.035 de desfase por filamento. */
function progresoLinea(i: number, trazo: number) {
  const inicio = (i * 0.035) / (1 + LINEAS.length * 0.035);
  const p = (trazo - inicio) / (1 - inicio || 1);
  if (p <= 0) return 0;
  if (p >= 1) return 1;
  return p * p * (3 - 2 * p);
}

export const Mapa: React.FC<MapaProps> = ({
  cx,
  cy,
  radio,
  cuerpo,
  trazo,
  aparicion,
  nombres,
  triadas,
  filtro = null,
  filtroProgreso = 0,
  u,
  etiqueta,
  rotar = false,
}) => {
  const paleta = usePaleta();

  // Girar es intercambiar ejes: el grafo no tiene norte, solo proporción.
  const ux = (estrella: Estrella) => (rotar ? -estrella.y : estrella.x);
  const uy = (estrella: Estrella) => (rotar ? estrella.x : estrella.y);
  const px = (estrella: Estrella) => cx + ux(estrella) * radio;
  const py = (estrella: Estrella) => cy + uy(estrella) * radio;

  /** 1 encendida, 0.14 apagada — el valor del panel, interpolado. */
  const luz = (estrella: Estrella) =>
    encendida(estrella, filtro)
      ? 1
      : interpolate(filtroProgreso, [0, 1], [1, 0.14], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });

  /**
   * El color del cuerpo. En el cielo lo pone la clase espectral de cada
   * estrella; sin clases hay una sola tinta y el único que se sale es «tú».
   */
  const cuerpoDe = (estrella: Estrella) =>
    paleta.espectral
      ? estrella.halo
      : estrella.esSol
        ? paleta.sol
        : paleta.cuerpo;

  return (
    <svg
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
    >
      {/* Gas ionizado de los cierres triádicos, debajo de todo */}
      {TRIANGULOS.map(([a, b, c], i) => {
        const encendido = Math.min(
          luz(ESTRELLAS[a]),
          luz(ESTRELLAS[b]),
          luz(ESTRELLAS[c]),
        );
        return (
          <polygon
            key={i}
            points={[a, b, c]
              .map((n) => `${px(ESTRELLAS[n]).toFixed(1)},${py(ESTRELLAS[n]).toFixed(1)}`)
              .join(" ")}
            fill={paleta.triada}
            fillOpacity={0.085 * triadas * encendido}
            stroke={paleta.triada}
            strokeOpacity={0.34 * triadas * encendido}
            strokeWidth={1.2 * u}
          />
        );
      })}

      {/* Filamentos: trazo fino con una pasada ancha debajo, como en la app */}
      {LINEAS.map((linea, i) => {
        const p = progresoLinea(i, trazo);
        if (p === 0) return null;
        const desde = ESTRELLAS[linea.a];
        const hasta = ESTRELLAS[linea.b];
        const x1 = px(desde);
        const y1 = py(desde);
        const x2 = x1 + (px(hasta) - x1) * p;
        const y2 = y1 + (py(hasta) - y1) * p;
        const encendido = Math.min(luz(desde), luz(hasta));
        return (
          <g key={i}>
            <line
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke={paleta.filamento}
              strokeOpacity={0.13 * paleta.filamentoFuerza * encendido}
              strokeWidth={6 * u}
              strokeLinecap="round"
            />
            <line
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke={paleta.filamento}
              strokeOpacity={0.42 * paleta.filamentoFuerza * encendido}
              strokeWidth={1.9 * u}
              strokeLinecap="round"
            />
          </g>
        );
      })}

      {/* Las estrellas */}
      {ESTRELLAS.map((estrella, i) => {
        const entrada = interpolate(
          aparicion,
          [retrasoDe(i), retrasoDe(i) + 0.22],
          [0, 1],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
        );
        if (entrada === 0) return null;
        const encendido = luz(estrella);
        const m = estrella.magnitud * 0.9 * cuerpo;
        const x = px(estrella);
        const y = py(estrella);
        const opacidad = entrada * encendido;
        return (
          <g key={estrella.id}>
            <EstrellaSVG
              x={x}
              y={y}
              m={m}
              halo={cuerpoDe(estrella)}
              esSol={estrella.esSol}
              opacidad={opacidad}
              cuerpo={cuerpo}
              picos={estrella.magnitud > 2.1 || estrella.esSol}
            />
            <g transform={`translate(${x.toFixed(1)} ${y.toFixed(1)})`}>
            {nombres > 0 && (
              // El nombre sale hacia AFUERA del mapa: las estrellas de la
              // izquierda lo llevan a su izquierda. Sin esto, los 24 nombres
              // se pisaban en el centro, que es donde más gente hay.
              <text
                x={(ux(estrella) < 0 ? -1 : 1) * (m * 4.6 + 9 * u)}
                y={0}
                textAnchor={ux(estrella) < 0 ? "end" : "start"}
                fill={estrella.esSol ? paleta.sol : paleta.tinta}
                fontFamily={paleta.mono}
                fontSize={etiqueta}
                fontWeight={500}
                dominantBaseline="middle"
                opacity={nombres * entrada * encendido}
                style={{
                  paintOrder: "stroke",
                  stroke: paleta.etiquetaBorde,
                  strokeWidth: etiqueta / 3,
                  strokeLinejoin: "round",
                }}
              >
                {estrella.nombre.toLowerCase()}
              </text>
            )}
            </g>
          </g>
        );
      })}
    </svg>
  );
};
