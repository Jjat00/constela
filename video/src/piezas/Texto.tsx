import { Interactive } from "remotion";
import { MONO_TRACKING, usePaleta } from "../visual";

/**
 * La voz de Constela en video. Dos registros y ninguno más: el titular en DM
 * Sans peso 500 con tracking cerrado —la palabra que remata, en celeste— y la
 * anotación de observatorio en mono, `[ ASÍ ]`, siempre en tinta tenue.
 *
 * En papel la familia es Geist —la de la escuela de `/opcion2`, y la mitad de
 * su estilo—, el tracking se abre a su `-.045em` y el remate pasa del celeste
 * al azul de enlace; el mono se queda en Geist Mono, que ya es el de la app y
 * el de esa propuesta. En el observatorio de `/opcion1` cambian los dos: Inter
 * Tight apretada y IBM Plex Mono, y el remate deja de tener color.
 */

export const Anotacion: React.FC<{
  name: string;
  children: React.ReactNode;
  opacidad: number;
  tamano: number;
  color?: string;
  style?: React.CSSProperties;
}> = ({ name, children, opacidad, tamano, color, style }) => {
  const paleta = usePaleta();
  return (
    <Interactive.Div
      name={name}
      style={{
        fontFamily: paleta.mono,
        fontSize: tamano,
        letterSpacing: MONO_TRACKING,
        color: color ?? paleta.tenue,
        opacity: opacidad,
        textTransform: "uppercase",
        ...style,
      }}
    >
      {children}
    </Interactive.Div>
  );
};

export const Titular: React.FC<{
  name: string;
  children: React.ReactNode;
  opacidad: number;
  tamano: number;
  subir?: number;
  style?: React.CSSProperties;
}> = ({ name, children, opacidad, tamano, subir = 0, style }) => {
  const paleta = usePaleta();
  return (
    <Interactive.Div
      name={name}
      style={{
        fontFamily: paleta.sans,
        fontSize: tamano,
        fontWeight: 500,
        letterSpacing: paleta.tracking,
        lineHeight: 0.98,
        color: paleta.tinta,
        opacity: opacidad,
        translate: `0px ${subir}px`,
        ...style,
      }}
    >
      {children}
    </Interactive.Div>
  );
};

/** La palabra que remata: celeste en el cielo, azul de enlace en papel. */
export const Celeste: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const paleta = usePaleta();
  return <span style={{ color: paleta.remate }}>{children}</span>;
};

export const Lede: React.FC<{
  name: string;
  children: React.ReactNode;
  opacidad: number;
  tamano: number;
  style?: React.CSSProperties;
}> = ({ name, children, opacidad, tamano, style }) => {
  const paleta = usePaleta();
  return (
    <Interactive.Div
      name={name}
      style={{
        fontFamily: paleta.sans,
        fontSize: tamano,
        fontWeight: 400,
        letterSpacing: "-0.04em",
        lineHeight: 1.45,
        color: paleta.suave,
        opacity: opacidad,
        ...style,
      }}
    >
      {children}
    </Interactive.Div>
  );
};
