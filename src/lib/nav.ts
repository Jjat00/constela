/**
 * El destino tras el onboarding viaja por la URL, así que se sanea: solo
 * rutas internas. "//evil.com" y "https://evil.com" son redirecciones
 * abiertas disfrazadas de ruta relativa.
 */
export function safeNext(
  value: string | null | undefined,
  fallback = "/home",
): string {
  if (!value) return fallback;
  if (!value.startsWith("/") || value.startsWith("//")) return fallback;
  return value;
}
