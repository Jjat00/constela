import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Mapa } from "../piezas/Mapa";
import { Velo } from "../piezas/Velo";
import { Anotacion, Celeste, Titular } from "../piezas/Texto";
import { cuantasEncendidas, ESTRELLAS, LINEAS, type Filtro } from "../universo";
import { MONO_TRACKING, SUAVE, TRAZO, useLienzo, usePaleta } from "../visual";

/**
 * 0:15 — La constelación se dibuja sola y después obedece.
 *
 * Las dos ideas viven en un solo plano y sin corte: primero el evento entero
 * aparece —estrellas, filamentos escalonados, cierres triádicos en H-alfa— y
 * luego se filtra, que es cuando el mapa deja de ser bonito y se vuelve útil.
 * Cortar entre las dos las convertiría en dos features; juntas son una sola
 * promesa.
 */

const FILTROS: Array<{ filtro: Filtro; etiqueta: string }> = [
  { filtro: { categoria: "interes", slug: "ia" }, etiqueta: "ia" },
  { filtro: { categoria: "intencion", slug: "contratando" }, etiqueta: "contratando" },
];

/** El conteo real del universo, no un número escrito a mano. */
const ENCENDIDAS = FILTROS.map((f) => cuantasEncendidas(f.filtro));

export const Constelacion: React.FC = () => {
  const frame = useCurrentFrame();
  const { u, mapa, pie, titularPie, anotacion, nombreEstrella, chip } = useLienzo();
  const paleta = usePaleta();

  const paso = (desde: number, dura = 26) =>
    interpolate(frame, [desde, desde + dura], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: SUAVE,
    });

  // Coreografía del dibujo
  const aparicion = interpolate(frame, [8, 132], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: SUAVE,
  });
  const trazo = interpolate(frame, [26, 168], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: TRAZO,
  });
  const nombres = paso(140, 34);
  const triadas = paso(168, 40);

  // El filtro: se aplica, se limpia, se aplica otro — como en el panel real
  const cual = frame >= 352 ? 1 : 0;
  const filtroProgreso = interpolate(
    frame,
    [262, 288, 330, 352, 378],
    [0, 1, 1, 0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: SUAVE,
    },
  );
  const filtroActivo = filtroProgreso > 0.02 ? FILTROS[cual].filtro : null;
  const mostradas = Math.round(
    interpolate(filtroProgreso, [0, 1], [ESTRELLAS.length, ENCENDIDAS[cual]], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }),
  );

  const salida = interpolate(frame, [408, 444], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: SUAVE,
  });

  return (
    <AbsoluteFill name="Constelacion" style={{ opacity: salida }}>
      {/* Deriva de cámara: el observatorio nunca está del todo quieto */}
      <AbsoluteFill
        style={{
          scale: interpolate(frame, [0, 450], [1, 1.05], {
            extrapolateRight: "clamp",
            output: "perceptual-scale",
          }),
        }}
      >
        <Mapa
          cx={mapa.cx}
          cy={mapa.cy}
          radio={mapa.radio}
          cuerpo={mapa.cuerpo}
          trazo={trazo}
          aparicion={aparicion}
          nombres={nombres}
          triadas={triadas}
          filtro={filtroActivo}
          filtroProgreso={filtroProgreso}
          u={u}
          etiqueta={nombreEstrella}
          rotar={mapa.rotar}
        />
      </AbsoluteFill>

      <Velo />

      {/* La franja al pie: anotación, titular del momento y los chips */}
      <AbsoluteFill
        style={{
          left: pie.left,
          top: pie.top,
          width: pie.ancho,
          height: pie.alto,
          justifyContent: "flex-start",
        }}
      >
        <Anotacion
          name="Etiqueta"
          tamano={anotacion}
          opacidad={interpolate(frame, [14, 40, 210, 232], [0, 1, 1, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: SUAVE,
          })}
        >
          [ {ESTRELLAS.length} estrellas · {LINEAS.length} conexiones ]
        </Anotacion>

        {/* Primer tiempo: el evento se dibuja */}
        <Titular
          name="Titular dibujo"
          tamano={titularPie}
          opacidad={interpolate(frame, [26, 58, 208, 230], [0, 1, 1, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: SUAVE,
          })}
          subir={interpolate(frame, [26, 62], [12 * u, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: SUAVE,
          })}
          style={{ position: "absolute", top: 44 * u }}
        >
          La red del evento <Celeste>se dibuja sola.</Celeste>
        </Titular>

        {/* Segundo tiempo: el mapa obedece */}
        <Titular
          name="Titular filtro"
          tamano={titularPie}
          opacidad={interpolate(frame, [226, 256], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: SUAVE,
          })}
          subir={interpolate(frame, [226, 262], [12 * u, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: SUAVE,
          })}
          style={{ position: "absolute", top: 44 * u }}
        >
          Filtras, y se apaga <Celeste>lo que no aplica.</Celeste>
        </Titular>

        {/* Los chips del panel real, con su lectura al lado */}
        <div
          style={{
            position: "absolute",
            top: 44 * u + titularPie * 1.5,
            display: "flex",
            alignItems: "center",
            gap: 18 * u,
            flexWrap: "wrap",
            opacity: paso(240, 30),
          }}
        >
          {FILTROS.map((opcion, i) => {
            const activo = filtroProgreso > 0.02 && cual === i;
            return (
              <div
                key={opcion.etiqueta}
                style={{
                  fontFamily: paleta.sans,
                  fontSize: chip,
                  fontWeight: 500,
                  letterSpacing: "-0.04em",
                  padding: `${chip * 0.5}px ${chip}px`,
                  // Píldora en el cielo y en el papel —es lo que hace el panel
                  // real dentro de `/opcion2`, donde solo las cards se
                  // cuadran—; rectángulo en el observatorio, que no tiene una.
                  borderRadius: paleta.chip.radio * u,
                  border: `1px solid ${activo ? paleta.chipActivo.borde : paleta.chip.borde}`,
                  background: activo ? paleta.chipActivo.fondo : paleta.chip.fondo,
                  color: activo ? paleta.chipActivo.texto : paleta.suave,
                }}
              >
                {opcion.etiqueta}
              </div>
            );
          })}
          <div
            style={{
              fontFamily: paleta.mono,
              fontSize: anotacion,
              letterSpacing: MONO_TRACKING,
              color: paleta.suave,
              opacity: paso(266, 24),
            }}
          >
            <span style={{ color: paleta.remate }}>{mostradas}</span> de{" "}
            {ESTRELLAS.length} estrellas
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
