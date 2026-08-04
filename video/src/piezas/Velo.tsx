import { AbsoluteFill } from "remotion";
import { useLienzo, usePaleta } from "../visual";

/**
 * El velo del pie: un degradado al vacío sobre el tercio bajo del encuadre.
 * Deja que el mapa siga siendo grande y llegue hasta abajo —que es lo que lo
 * hace cinematográfico— sin que una estrella se meta detrás de una letra.
 *
 * En papel el vacío es papel: el mismo degradado, hacia #FAFAFA.
 */
export const Velo: React.FC<{ opacidad?: number }> = ({ opacidad = 1 }) => {
  const { height, pie } = useLienzo();
  const { velo, veloArranque } = usePaleta();
  const desde = ((pie.top - pie.alto * veloArranque) / height) * 100;
  const medio = (pie.top / height) * 100;

  return (
    <AbsoluteFill
      style={{
        opacity: opacidad,
        background: `linear-gradient(to bottom, transparent ${desde.toFixed(1)}%, rgba(${velo},0.82) ${medio.toFixed(1)}%, rgba(${velo},0.97) 100%)`,
      }}
    />
  );
};
