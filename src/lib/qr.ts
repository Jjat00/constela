import QRCode from "qrcode";

export function siteUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3001";
}

/**
 * SVG del QR para una ruta de la app (`/u/abc`, `/e/mi-evento`…).
 * Por defecto se dibuja claro sobre transparente, para el fondo nocturno.
 * En `/qr` se invierte (`variant: "paper"`): oscuro sobre papel es lo que
 * cualquier lector lee sin dudar, y de paso la pantalla ilumina más.
 */
export function qrSvg(path: string, variant: "night" | "paper" = "night") {
  return QRCode.toString(`${siteUrl()}${path}`, {
    type: "svg",
    margin: 0,
    errorCorrectionLevel: "M",
    color:
      variant === "paper"
        ? { dark: "#131019", light: "#0000" }
        : { dark: "#F5F3EE", light: "#0000" },
  });
}
