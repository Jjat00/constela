import { usePaleta } from "../visual";

/**
 * La anatomía de una estrella, calcada del grafo de la app: corona y luz
 * interna solo para el sol, halo exterior difuso, halo cercano con el color
 * espectral, núcleo blanco-caliente y picos de difracción en las brillantes.
 * Se dibuja igual en el mapa completo y en el primer plano del escaneo.
 *
 * En papel se queda solo el disco. Corona, halo, núcleo y picos son luz —
 * cosas que un cielo negro puede sostener y una hoja no: encima del papel se
 * convierten en niebla, en un agujero blanco y en unas cruces sucias. Sin
 * halo detrás, el disco sube a 0.9 para sostenerse solo, exactamente como
 * hace el grafo de la app cuando se le apaga (`PaletaGrafo`).
 */
export const EstrellaSVG: React.FC<{
  x: number;
  y: number;
  /** Radio base ya en píxeles (magnitud × 0.9 × cuerpo). */
  m: number;
  halo: string;
  esSol?: boolean;
  opacidad?: number;
  /** Para la corona del sol, en las mismas proporciones del hero. */
  cuerpo?: number;
  picos?: boolean;
}> = ({ x, y, m, halo, esSol = false, opacidad = 1, cuerpo = 1, picos = false }) => {
  const paleta = usePaleta();

  return (
    <g transform={`translate(${x.toFixed(1)} ${y.toFixed(1)})`}>
      {esSol && paleta.corona && (
        <>
          <circle
            r={46 * cuerpo * 0.9}
            fill={paleta.sol}
            opacity={0.16 * opacidad}
            style={{ filter: `blur(${16 * cuerpo}px)` }}
          />
          <circle
            r={22 * cuerpo * 0.9}
            fill="#FFE9A8"
            opacity={0.5 * opacidad}
            style={{ filter: `blur(${7 * cuerpo}px)` }}
          />
        </>
      )}
      {paleta.halo && (
        <circle
          r={m * 4.2}
          fill={halo}
          opacity={(esSol ? 0.3 : 0.22) * opacidad}
          style={{ filter: `blur(${Math.max(0.5, m * 1.5)}px)` }}
        />
      )}
      <circle
        r={m * 1.9}
        fill={halo}
        opacity={(esSol ? 0.95 : paleta.disco) * opacidad}
      />
      {paleta.nucleo && (
        <circle
          r={m * (esSol ? 0.62 : 0.72)}
          fill={paleta.nucleo}
          opacity={opacidad}
        />
      )}
      {picos && paleta.picos && (
        <>
          <line
            x1={-m * 4.6}
            y1={0}
            x2={m * 4.6}
            y2={0}
            stroke={esSol ? paleta.supernova : "#FFFFFF"}
            strokeWidth={Math.max(1, m * 0.05)}
            opacity={0.45 * opacidad}
            style={{ filter: "blur(0.8px)" }}
          />
          <line
            x1={0}
            y1={-m * 4.6}
            x2={0}
            y2={m * 4.6}
            stroke={esSol ? paleta.supernova : "#FFFFFF"}
            strokeWidth={Math.max(1, m * 0.05)}
            opacity={0.45 * opacidad}
            style={{ filter: "blur(0.8px)" }}
          />
        </>
      )}
    </g>
  );
};
