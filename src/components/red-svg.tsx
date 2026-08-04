import { construirRed } from "@/lib/constelacion";

/*
 * La red del evento, dibujada. Es el diagrama del hero de la portada.
 *
 * Los datos son siempre los mismos (`construirRed`): la forma del grafo es la
 * marca y ninguna pantalla puede inventarse una red más favorecedora. Lo que
 * los props gobiernan es la tinta, el grosor, si hay halos, si hay picos de
 * difracción y si los cierres triádicos se rellenan. Nació con esas perillas
 * para que diez propuestas de rediseño comparasen lenguaje visual y no
 * contenido; ganó la del Observatorio y hoy solo se usa esa combinación, pero
 * las perillas se quedan porque son lo que permite volver a probar.
 *
 * Decorativa: `aria-hidden` y sin interacción. La red que sí se toca vive en
 * `/home` con datos reales.
 */

export type RedProps = {
  seed?: number;
  n?: number;
  /** Tintas espectrales (5). Si se pasa una sola, la red es monocroma. */
  colores?: string[];
  colorSol?: string;
  colorLinea?: string;
  /** Relleno y trazo de los cierres triádicos. `null` los apaga. */
  colorTriada?: string | null;
  grosor?: number;
  opacidadLinea?: number;
  /** Halo difuso alrededor de cada estrella (el registro «cine»). */
  halo?: boolean;
  /** Picos de difracción en las estrellas brillantes. */
  picos?: boolean;
  /** Núcleo blanco dentro de cada estrella. */
  nucleo?: boolean;
  /** Corona respirando en el sol. */
  corona?: boolean;
  /** Dibuja las aristas con `stroke-dashoffset` al entrar. */
  animar?: boolean;
  escala?: number;
  className?: string;
  preserveAspectRatio?: string;
};

export function RedSVG({
  seed = 11,
  n = 36,
  colores = ["#9DB4FF", "#CDD8FF", "#E6ECFF", "#FFD9A8", "#FFB380"],
  colorSol = "#FFD97A",
  colorLinea = "#CDD8FF",
  colorTriada = "#F0699F",
  grosor = 0.65,
  opacidadLinea = 0.34,
  halo = true,
  picos = true,
  nucleo = true,
  corona = true,
  animar = true,
  escala = 1,
  className,
  preserveAspectRatio = "xMidYMid slice",
}: RedProps) {
  const { estrellas, aristas, triadas } = construirRed(seed, n);
  const tinta = (i: number) => colores[i % colores.length];

  return (
    <svg
      aria-hidden
      viewBox="0 0 1000 1000"
      preserveAspectRatio={preserveAspectRatio}
      className={className}
    >
      {colorTriada &&
        triadas.map((pts, i) => (
          <polygon
            key={`t${i}`}
            points={pts}
            fill={colorTriada}
            fillOpacity={0.085}
            stroke={colorTriada}
            strokeOpacity={0.34}
            strokeWidth={grosor * 0.9}
          />
        ))}

      {aristas.map((e, i) => (
        <line
          key={`a${i}`}
          x1={estrellas[e.a].x.toFixed(1)}
          y1={estrellas[e.a].y.toFixed(1)}
          x2={estrellas[e.b].x.toFixed(1)}
          y2={estrellas[e.b].y.toFixed(1)}
          stroke={colorLinea}
          strokeWidth={grosor}
          strokeLinecap="round"
          opacity={opacidadLinea}
          pathLength={animar ? 1 : undefined}
          className={animar ? "animate-draw" : undefined}
          style={animar ? { animationDelay: `${0.25 + i * 0.03}s` } : undefined}
        />
      ))}

      {estrellas.map((s, i) => {
        const m = s.mag * 0.9 * escala;
        const color = s.sol ? colorSol : tinta(s.clase);
        return (
          <g key={`e${i}`} transform={`translate(${s.x.toFixed(1)} ${s.y.toFixed(1)})`}>
            {s.sol && corona && (
              <>
                <circle
                  r={46 * escala}
                  fill={colorSol}
                  opacity={0.16}
                  className="animate-corona"
                  style={{
                    filter: "blur(16px)",
                    transformBox: "fill-box",
                    transformOrigin: "center",
                  }}
                />
                <circle
                  r={22 * escala}
                  fill={colorSol}
                  opacity={0.45}
                  style={{ filter: "blur(7px)" }}
                />
              </>
            )}
            {halo && (
              <circle
                r={(m * 4.2).toFixed(1)}
                fill={color}
                opacity={s.sol ? 0.3 : 0.22}
                style={{ filter: `blur(${(m * 1.5).toFixed(1)}px)` }}
              />
            )}
            <circle
              r={(m * 1.9).toFixed(1)}
              fill={color}
              opacity={s.sol ? 0.95 : halo ? 0.62 : 0.9}
            />
            {nucleo && (
              <circle r={(m * (s.sol ? 0.62 : 0.72)).toFixed(2)} fill="#FFFFFF" />
            )}
            {picos && (s.mag > 2.1 || s.sol) && (
              <>
                <line
                  x1={(-m * 4.6).toFixed(1)}
                  y1="0"
                  x2={(m * 4.6).toFixed(1)}
                  y2="0"
                  stroke={s.sol ? colorSol : color}
                  strokeWidth={0.5}
                  opacity={0.5}
                  style={{ filter: "blur(0.6px)" }}
                />
                <line
                  x1="0"
                  y1={(-m * 4.6).toFixed(1)}
                  x2="0"
                  y2={(m * 4.6).toFixed(1)}
                  stroke={s.sol ? colorSol : color}
                  strokeWidth={0.5}
                  opacity={0.5}
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
