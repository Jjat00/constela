/**
 * X/Twitter lee su propia etiqueta y no cae en la de Open Graph, así que la
 * misma lámina se publica dos veces. Reexportar en vez de duplicar el dibujo
 * es lo que garantiza que no puedan diverger.
 */
export { default, alt, size, contentType } from "./opengraph-image";
