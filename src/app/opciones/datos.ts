/**
 * El banco de hechos de las diez propuestas de landing.
 *
 * Todo lo que las diez opciones pueden decir sale de aquí, y todo lo de aquí
 * sale de PRODUCT.md, CONTEXT.md y los ADR. La regla dura: **no existen
 * testimonios, métricas de uso, prensa, casos ni clientes — no fabricar
 * ninguno** (PRODUCT.md § Evidence on Hand). Si una propuesta necesitara una
 * cifra para funcionar, la propuesta está mal, no los datos.
 *
 * Vive en un solo sitio para que comparar diez diseños compare diseño y no
 * copy: mismo mensaje, diez lenguajes visuales.
 */

export const MARCA = {
  nombre: "Constela",
  wordmark: "constela",
  tagline: "El networking que por fin se ve",
  /** La definición: quien llega acaba de ser escaneado y no sabe qué es esto. */
  definicion:
    "Escaneas el QR de quien acabas de conocer en un evento y la red se dibuja en vivo, a la vista de todo el evento.",
  titular: { antes: "Tu red es", destacado: "tu universo." },
} as const;

/** Los tres gestos. Ninguno describe algo que la app no haga hoy. */
export const PASOS = [
  {
    n: "01",
    titulo: "Escaneas",
    texto:
      "Abres el QR personal de quien tienes delante. Ese gesto te mete al evento y os conecta, en el mismo movimiento.",
  },
  {
    n: "02",
    titulo: "Apareces",
    texto:
      "Naces como estrella dentro de la constelación, con tu rol y lo que viniste a buscar. Un tap, y ya puedes saltártelo.",
  },
  {
    n: "03",
    titulo: "La red se dibuja",
    texto:
      "Cada encuentro añade un filamento. La constelación del evento crece en vivo y la ve el evento entero, no solo tú.",
  },
] as const;

/** Lo que Constela no hace — el posicionamiento, en negativo. */
export const NO_HACE = [
  "Sin botón de «agregar»",
  "Sin solicitudes pendientes",
  "Sin conectar desde el sofá",
  "Sin niveles, puntos ni insignias",
] as const;

/** El vocabulario del dominio (CONTEXT.md): el cosmos mapea al producto. */
export const VOCABULARIO = [
  {
    termino: "Estrella",
    dominio: "Una persona del evento",
    texto:
      "Su clase espectral es estable: la misma persona brilla siempre igual. Cuantas más conexiones, mayor magnitud.",
  },
  {
    termino: "Constelación",
    dominio: "La red completa del evento",
    texto:
      "No es «tu red hasta segundo grado»: es el grafo entero, visible para cualquier asistente.",
  },
  {
    termino: "Cierre triádico",
    dominio: "Tres personas que se conocen entre sí",
    texto:
      "El triángulo que se ilumina cuando dos de tus contactos se conocen. Es el momento social del producto.",
  },
  {
    termino: "Galaxia",
    dominio: "Un evento",
    texto:
      "Cada QR personal está clavado a una galaxia: escanear a alguien te une a la suya, en cadena.",
  },
] as const;

/** Preguntas que sí tienen respuesta hoy. Nada especulativo. */
export const PREGUNTAS = [
  {
    q: "¿Necesito que el organizador lo instale?",
    a: "No. Constela se pasa de persona a persona: te unes al evento escaneando a alguien que ya está dentro.",
  },
  {
    q: "¿Puedo conectar con alguien sin haberlo visto?",
    a: "No, y es a propósito. Una conexión solo nace al abrir el QR personal del otro. Tocar su estrella abre su perfil; no os conecta.",
  },
  {
    q: "¿Quién ve la constelación?",
    a: "Todo el que esté en el evento. La visión colectiva de la red es el producto, no un extra.",
  },
  {
    q: "¿Cómo entro?",
    a: "Con tu cuenta de Google, y ya. El resto del perfil es opcional y se puede dejar para después.",
  },
] as const;

/**
 * Las dos piezas que la landing de producción monta bajo su hero: el video de
 * presentación (35 s, hecho en Remotion — el proyecto vive en `video/`) y el
 * mapa real de `/home` corriendo sobre el evento de ejemplo
 * (`src/lib/demo-universe.ts`). El copy vive aquí, con el resto del banco,
 * para que la opción que las monte no se invente el texto y para que la
 * siguiente pueda montarlas sin reescribirlo.
 *
 * Los números (estrellas, conexiones) NO se escriben aquí: salen de los datos,
 * que son la única fuente que no puede mentir.
 */
export const VIDEO = {
  etiqueta: "En movimiento",
  titulo: "Constela, en 35 segundos.",
  texto:
    "La misma historia, de corrido y sin tocar nada. Todo lo que se ve en el video es la aplicación: ninguna pantalla está maquetada.",
  marco: "constela · presentación",
  pie: "35 s · sin sonido",
} as const;

export const MAPA = {
  etiqueta: "La constelación",
  titulo: "Y el evento entero se vuelve legible.",
  texto:
    "Cada asistente es una estrella; cada QR que escaneas, una línea entre dos. Filtra por rol, interés o intención y lo que no coincide se apaga: el mapa nunca se reordena, así que nunca pierdes de vista dónde estaba quién.",
  textoDos:
    "Ahí se ve lo que un salón lleno esconde: quién está contratando, quién habla de lo mismo que tú, y los triángulos rosados de gente que ya se conoce entre sí — por donde se pide una presentación.",
  marco: "constelación · evento de ejemplo",
  pie: "toca un chip, busca un nombre, abre una estrella",
} as const;

/** Las diez propuestas, para el índice y el conmutador de revisión. */
export const OPCIONES = [
  { n: 1, ruta: "/opcion1", nombre: "Observatorio", nota: "Minimalismo suizo, casi monocromo" },
  { n: 2, ruta: "/opcion2", nombre: "Documento", nota: "Estilo Vercel — blanco, preciso, técnico" },
  { n: 3, ruta: "/opcion3", nombre: "Corriente", nota: "Estilo Linear — violeta, malla, cristal" },
  { n: 4, ruta: "/opcion4", nombre: "Telemetría", nota: "Futurista: consola de misión, mono total" },
  { n: 5, ruta: "/opcion5", nombre: "Encuentro", nota: "Startup cálida, papel crema, redonda" },
  { n: 6, ruta: "/opcion6", nombre: "Efemérides", nota: "Editorial: revista astronómica impresa" },
  { n: 7, ruta: "/opcion7", nombre: "Cartel", nota: "Brutalista, tipografía enorme, amarillo" },
  { n: 8, ruta: "/opcion8", nombre: "Secuencia", nota: "Cinematográfico, letterbox, títulos" },
  { n: 9, ruta: "/opcion9", nombre: "Cristal", nota: "Spatial: vidrio, profundidad, píldoras" },
  { n: 10, ruta: "/opcion10", nombre: "Serigrafía", nota: "Riso duotono, grano, cartel de evento" },
] as const;
