import { Interactive } from "remotion";
import { COLOR, MONO, MONO_TRACKING, SANS } from "../visual";

/**
 * La voz de Constela en video. Dos registros y ninguno más: el titular en DM
 * Sans peso 500 con tracking cerrado —la palabra que remata, en celeste— y la
 * anotación de observatorio en mono, `[ ASÍ ]`, siempre en tinta tenue.
 */

export const Anotacion: React.FC<{
  name: string;
  children: React.ReactNode;
  opacidad: number;
  tamano: number;
  color?: string;
  style?: React.CSSProperties;
}> = ({ name, children, opacidad, tamano, color = COLOR.tenue, style }) => (
  <Interactive.Div
    name={name}
    style={{
      fontFamily: MONO,
      fontSize: tamano,
      letterSpacing: MONO_TRACKING,
      color,
      opacity: opacidad,
      textTransform: "uppercase",
      ...style,
    }}
  >
    {children}
  </Interactive.Div>
);

export const Titular: React.FC<{
  name: string;
  children: React.ReactNode;
  opacidad: number;
  tamano: number;
  subir?: number;
  style?: React.CSSProperties;
}> = ({ name, children, opacidad, tamano, subir = 0, style }) => (
  <Interactive.Div
    name={name}
    style={{
      fontFamily: SANS,
      fontSize: tamano,
      fontWeight: 500,
      letterSpacing: "-0.055em",
      lineHeight: 0.98,
      color: COLOR.tinta,
      opacity: opacidad,
      translate: `0px ${subir}px`,
      ...style,
    }}
  >
    {children}
  </Interactive.Div>
);

/** La palabra que remata: celeste, nunca más de dos por pantalla. */
export const Celeste: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span style={{ color: COLOR.celeste }}>{children}</span>
);

export const Lede: React.FC<{
  name: string;
  children: React.ReactNode;
  opacidad: number;
  tamano: number;
  style?: React.CSSProperties;
}> = ({ name, children, opacidad, tamano, style }) => (
  <Interactive.Div
    name={name}
    style={{
      fontFamily: SANS,
      fontSize: tamano,
      fontWeight: 400,
      letterSpacing: "-0.04em",
      lineHeight: 1.45,
      color: COLOR.suave,
      opacity: opacidad,
      ...style,
    }}
  >
    {children}
  </Interactive.Div>
);
