/**
 * Un canal se escribe como se recuerde: «@nadie», «nadie» o la URL completa
 * del perfil son la misma persona. Aquí se destila el handle una sola vez —
 * el formulario guarda limpio y la tarjeta tolera lo ya guardado.
 */

export const conProtocolo = (url: string) =>
  /^https?:\/\//i.test(url) ? url : `https://${url}`;

function handleDe(valor: string, dominio: RegExp): string {
  const v = valor.trim().replace(/^@/, "");
  if (dominio.test(v)) {
    try {
      const partes = new URL(conProtocolo(v)).pathname
        .split("/")
        .filter(Boolean);
      if (partes[0]) return partes[0].replace(/^@/, "");
    } catch {
      // No era una URL de verdad: se queda tal como lo escribió.
    }
  }
  return v;
}

export const handleGithub = (valor: string) =>
  handleDe(valor, /github\.com/i);

export const handleInstagram = (valor: string) =>
  handleDe(valor, /instagram\.com/i);
