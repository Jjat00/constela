import QRCode from "qrcode";

export function siteUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3001";
}

/**
 * La ruta de un QR personal: tu estrella clavada a una galaxia (ADR 0005).
 * No existe un QR que no lleve a ningún evento — quien lo escanea entra a
 * ESA galaxia y queda conectado contigo.
 */
export function starQrPath(qrSlug: string, eventSlug: string) {
  return `/u/${qrSlug}?e=${encodeURIComponent(eventSlug)}`;
}

/**
 * SVG del QR para una ruta de la app (`/u/abc?e=mi-evento`…).
 * Por defecto se dibuja claro sobre transparente, para el fondo nocturno.
 * `sol` es tu QR personal (diseño 2b): módulos dorados — el oro es identidad.
 * `paper` invierte: oscuro sobre claro, para superficies iluminadas.
 */
export function qrSvg(path: string, variant: "night" | "paper" | "sol" = "night") {
  return QRCode.toString(`${siteUrl()}${path}`, {
    type: "svg",
    margin: 0,
    errorCorrectionLevel: "M",
    color:
      variant === "paper"
        ? { dark: "#131019", light: "#0000" }
        : variant === "sol"
          ? { dark: "#FFD97A", light: "#0000" }
          : { dark: "#F5F3EE", light: "#0000" },
  });
}
