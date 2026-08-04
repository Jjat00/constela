/**
 * El banco de hechos de las dos páginas de categoría.
 *
 * MISMO CONTRATO QUE `portada.ts`, y aquí aprieta más: estas páginas existen
 * para que alguien que busca «app de networking para eventos» encuentre
 * Constela, y esa es exactamente la situación en la que un texto de marketing
 * se pone a inventar cifras. **No hay una sola estadística en este archivo.**
 * No porque no ayudaran —una cifra con fuente es lo que más citan los motores
 * de respuesta— sino porque no tenemos ninguna que sea nuestra y verificable,
 * y repetir el «88 % de las tarjetas se tiran en una semana» que circula por
 * internet sin poder rastrearlo hasta su estudio sería fabricar evidencia
 * (PRODUCT.md § Evidence on Hand).
 *
 * Lo que sí se afirma es lo que se puede sostener: cómo funciona un evento,
 * qué hace y qué no hace Constela, y qué cuesta (nada). La comparación de la
 * tabla es **entre métodos, no entre productos**: «la app del organizador» es
 * una categoría de herramienta, no un competidor con nombre. No se nombra ni
 * se describe ningún producto ajeno — no podríamos hacerlo con precisión y
 * equivocarnos sería, además de injusto, la clase de error que un lector del
 * gremio detecta en dos segundos.
 *
 * Español de América, segunda persona del singular, como el resto del copy.
 */

/** Última revisión del contenido de estas dos páginas. Se toca al editarlas. */
export const REVISADO = "2026-08-04";

// ─────────────────────────────────────────────────────────────────────────────
// /app-de-networking-para-eventos — la página de categoría
// ─────────────────────────────────────────────────────────────────────────────

export const CATEGORIA = {
  ruta: "/app-de-networking-para-eventos",
  etiqueta: "La categoría",
  titulo: "Qué es una app de networking para eventos",
  h1: "Una app de networking para eventos sirve para una sola cosa: que no pierdas a la gente que sí conociste.",
  /**
   * La respuesta directa, en dos frases y sin rodeos. Es el primer párrafo de
   * la página por una razón doble: es lo que se lee de pie en un pasillo, y es
   * el fragmento que un buscador —o un modelo respondiendo una pregunta—
   * extrae cuando alguien pregunta qué es esto.
   */
  clave:
    "Una app de networking para eventos es una herramienta que registra los encuentros que ocurren en un evento presencial y los convierte en contactos que puedes recuperar después. Las hay de dos clases: las que digitalizan el intercambio de datos —una tarjeta con QR en vez de una de papel— y las que además dibujan la red que se va formando entre los asistentes.",
  descripcion:
    "Qué es una app de networking para eventos, las cuatro formas de intercambiar contactos en uno y qué cambia cuando la red del evento se puede ver. Constela es gratis.",

  problema: {
    titulo: "El problema no es intercambiar datos. Es lo que pasa al día siguiente.",
    parrafos: [
      "Intercambiar contactos en un evento está resuelto desde hace décadas: una tarjeta, un teléfono dictado, un usuario de LinkedIn escrito a mano. Lo que ninguno de esos gestos resuelve es el día siguiente, cuando tienes ocho nombres y ninguna forma de recordar cuál era el que trabajaba en lo tuyo.",
      "Un contacto guardado sin contexto es casi lo mismo que no tenerlo. La tarjeta no sabe de qué hablaron, LinkedIn no sabe dónde se conocieron, y el teléfono guardado como «Andrés evento» no dice nada que sirva para escribirle una semana después sin que suene a mensaje en frío.",
      "Y hay un problema anterior, más grande y del que casi nadie habla: en un salón con doscientas personas no sabes a quién acercarte. La información que decidiría el encuentro —quién está contratando, quién hace lo mismo que tú, quién vino a buscar socios— existe, pero está repartida en doscientas cabezas y no hay forma de verla.",
    ],
  },

  /**
   * Las cuatro formas reales de resolverlo. Ninguna fila describe un producto
   * concreto: son métodos, y cada uno se juzga por lo que deja después, que es
   * la única vara que importa cuando el evento terminó.
   */
  tabla: {
    titulo: "Las cuatro formas de intercambiar contactos en un evento",
    columnas: ["Método", "Qué cuesta en el momento", "Qué queda después"],
    filas: [
      {
        metodo: "Tarjeta de papel",
        cuesta:
          "Nada de fricción: se entrega en un segundo y funciona sin batería ni señal.",
        queda:
          "Un cartón con un cargo y un correo. Ni el contexto de la conversación ni una forma de saber quién más conoce a esa persona.",
      },
      {
        metodo: "Buscarse en LinkedIn ahí mismo",
        cuesta:
          "Medio minuto por persona con mala señal, el nombre mal escrito y tres perfiles homónimos.",
        queda:
          "Una conexión más en una lista de miles, sin marca de dónde nació. En seis meses no sabrás si se conocieron o si te aceptó una solicitud en frío.",
      },
      {
        metodo: "La app del organizador",
        cuesta:
          "Descargarla, crear una cuenta y llenar un perfil antes de que empiece el evento.",
        queda:
          "Un directorio de asistentes, mientras el evento dure. Existe solo si el organizador decidió pagarla, y muere con la edición de este año.",
      },
      {
        metodo: "Escanear el QR personal del otro",
        cuesta:
          "Un escaneo. No hay que instalar nada ni que el organizador participe.",
        queda:
          "Una conexión que solo pudo nacer en persona, dentro del mapa del evento entero: quién es cada quien, quién conoce a quién y por dónde pedir una presentación.",
        nuestro: true,
      },
    ],
  },

  diferencia: {
    titulo: "Lo que cambia cuando la red se puede ver",
    parrafos: [
      "Casi todas las herramientas de esta categoría tratan el networking como un problema de almacenamiento: capturar el dato del otro y guardarlo bien. Constela lo trata como un problema de visibilidad. La pregunta que resuelve no es «¿cómo guardo este contacto?», sino «¿a quién debería acercarme en este salón?».",
      "Por eso la red del evento no es privada. Cualquier asistente ve el grafo completo: las estrellas son las personas, las líneas son los encuentros que de verdad ocurrieron y los triángulos son los grupos de tres que ya se conocen entre sí. Ver un triángulo del que cuelga alguien con quien quieres hablar es, literalmente, ver por dónde pedir que te presenten.",
      "El costo de ese diseño es deliberado: no se puede conectar con nadie a distancia. No hay botón de agregar, ni solicitudes pendientes, ni forma de sumar contactos desde el sofá. Una línea entre dos estrellas significa que esas dos personas estuvieron una frente a la otra, y esa garantía se rompería en el instante en que existiera un botón.",
    ],
  },

  preguntas: [
    {
      q: "¿Cuánto cuesta una app de networking para eventos?",
      a: "Depende de quién la pague. Las plataformas que contrata un organizador se cobran por evento o por asistente y suelen venderse dentro de un paquete de gestión del evento. Constela no cobra: es gratis para cualquier asistente y no tiene planes de pago, porque no la contrata nadie — la instala la propia gente escaneándose.",
    },
    {
      q: "¿Necesito que el organizador del evento la haya adoptado?",
      a: "En Constela no. Te unes al evento escaneando el QR de alguien que ya está dentro, y a partir de ahí tu propio QR es la puerta para el siguiente. Es la diferencia práctica con las plataformas de organizador: aquellas existen si alguien las compró, esta existe si dos personas se escanearon.",
    },
    {
      q: "¿Hay que instalar algo?",
      a: "No. Constela es una aplicación web: se abre en el navegador del teléfono al escanear un QR. Puedes guardarla en la pantalla de inicio si quieres que se comporte como una app, pero nadie tiene que pasar por una tienda de aplicaciones en mitad de un evento.",
    },
    {
      q: "¿Quién puede ver mis datos?",
      a: "Los asistentes del evento ven tu nombre, tu rol y los temas que dijiste que te interesan — eso es lo que hace que alguien decida acercarse a ti. Tus canales de contacto directos, como el WhatsApp, solo aparecen para quien se cruzó contigo en persona. El detalle completo está en la política de privacidad.",
    },
    {
      q: "¿Sirve para eventos pequeños?",
      a: "Sí, y la red se lee mejor cuanto más pequeño es el evento: en un grupo de treinta personas la constelación completa cabe en una pantalla y los triángulos se distinguen de un vistazo. En eventos grandes el valor se desplaza a los filtros, que apagan lo que no coincide con lo que buscas.",
    },
  ],
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// /networking-en-eventos — la guía
// ─────────────────────────────────────────────────────────────────────────────

export const GUIA = {
  ruta: "/networking-en-eventos",
  etiqueta: "La guía",
  titulo: "Cómo hacer networking en un evento presencial",
  h1: "Cómo hacer networking en un evento sin que se te haga cuesta arriba.",
  clave:
    "Hacer networking en un evento presencial es, en la práctica, resolver tres cosas seguidas: a quién acercarte, cómo empezar la conversación y qué hacer con ella después. Casi todos los consejos que circulan atacan la segunda. Las que de verdad deciden el resultado son la primera y la tercera.",
  descripcion:
    "Guía práctica de networking en eventos presenciales: a quién acercarte, cómo empezar y qué hacer después. Sin trucos de vendedor y sin fórmulas de LinkedIn.",

  antes: {
    titulo: "Antes: decide una sola cosa",
    parrafos: [
      "No hace falta una estrategia. Hace falta una frase: a qué vas. «Busco un cofundador técnico», «quiero entender cómo se cobra esto», «vengo a que me vean para contratarme». Una sola, dicha en voz alta antes de entrar.",
      "Sirve para dos cosas, y ninguna es motivacional. La primera es que filtra: con una intención clara, la mitad de las conversaciones posibles del salón dejan de importarte y puedes dedicarle el doble de tiempo a la otra mitad. La segunda es que te da respuesta a la única pregunta que todo el mundo hace en un evento —«¿y tú a qué viniste?»— sin tener que improvisar un discurso sobre tu empresa.",
      "Si el evento tiene alguna forma de decir esa intención por adelantado, dila. Es información que le sirve más al resto que a ti: alguien que busca exactamente lo que tú ofreces necesita poder encontrarte.",
    ],
  },

  durante: {
    titulo: "Durante: el problema es a quién, no cómo",
    parrafos: [
      "Casi toda la literatura sobre networking enseña a empezar conversaciones. Es la parte fácil. La difícil es que en un salón lleno la información que decidiría con quién hablar está repartida en doscientas cabezas y no se ve: quién está contratando, quién trabaja en lo mismo que tú, quién ya conoce a la persona que te interesa.",
      "Sin esa información, la mayoría de la gente hace lo mismo: se queda con quien ya conocía, o se acerca a quien está solo porque es más fácil. Las dos son decisiones tomadas por comodidad, no por criterio, y las dos explican por qué se sale de muchos eventos con la sensación de no haber aprovechado nada.",
      "Lo que sí funciona y no cuesta nada: preguntar por la tercera persona. «¿Conoces a alguien aquí que trabaje en esto?» convierte una conversación en dos, y una presentación hecha por alguien de confianza empieza a un nivel al que una conversación en frío no llega. Es el mismo principio por el que en Constela se iluminan los triángulos: tres personas que ya se conocen entre sí son el camino más corto hacia una cuarta.",
    ],
  },

  despues: {
    titulo: "Después: el contacto sin contexto no vale nada",
    parrafos: [
      "El día siguiente es donde se pierde casi todo. No porque a la gente le dé pereza escribir, sino porque escribir requiere recordar, y lo que queda de un evento —una tarjeta, un nombre en el teléfono, una conexión aceptada— no contiene lo que haría falta recordar: de qué hablaron, qué buscaba esa persona, por qué valía la pena seguir.",
      "El truco viejo y bueno es anotar en la tarjeta, en el momento, una línea sobre la conversación. Funciona, y sigue funcionando. El problema es que nadie lo hace de pie, con una copa en una mano y el teléfono en la otra.",
      "Por eso el registro tiene que ocurrir en el mismo gesto que el encuentro, o no ocurre. Si conectar exige un paso aparte —abrir una app, buscar un nombre, mandar una solicitud— ese paso se pospone hasta que deja de tener sentido. Si conectar ES el gesto de escanear a alguien que tienes delante, ya quedó registrado quién, dónde y cuándo, sin que nadie tuviera que acordarse de nada.",
    ],
  },

  errores: {
    titulo: "Cuatro cosas que no funcionan",
    lista: [
      "Repartir tarjetas en volumen. Veinte contactos sin contexto rinden menos que tres conversaciones que recuerdas.",
      "Vender en la primera frase. En un evento nadie está en modo compra; el que abre vendiendo se convierte en la persona de la que el resto se aleja.",
      "Dejar el seguimiento para «cuando tenga tiempo». El contexto se evapora en días, y con él la única razón por la que ese mensaje no sería spam.",
      "Quedarte con la gente que ya conoces. Es la decisión más cómoda del salón y la única que garantiza que el evento no te sirvió para nada.",
    ],
  },

  preguntas: [
    {
      q: "¿Cómo empiezo una conversación en un evento si no conozco a nadie?",
      a: "Con una pregunta sobre el evento, no sobre la persona: qué charla le pareció mejor, si es la primera vez que viene, qué la trajo. Son preguntas que cualquiera puede responder sin sentirse interrogado, y en la respuesta suele venir gratis la información que necesitas para decidir si esa conversación vale la pena continuar.",
    },
    {
      q: "¿Cuántas personas debería conocer en un evento?",
      a: "Menos de las que crees. Tres conversaciones que puedas recordar y continuar valen más que veinte contactos que no vas a poder situar el lunes. El volumen solo tiene sentido si tienes forma de registrar el contexto de cada encuentro, y de pie en un salón casi nadie la tiene.",
    },
    {
      q: "¿Qué hago con los contactos después del evento?",
      a: "Escribir en las primeras cuarenta y ocho horas, mientras la conversación todavía se recuerda por los dos lados, y decir de qué hablaron antes de proponer nada. Un mensaje que empieza recordando el contexto no es un mensaje en frío; uno que empieza proponiendo una reunión, sí.",
    },
    {
      q: "¿Sirve de algo el networking si soy tímido?",
      a: "Sí, y normalmente mejor: las conversaciones largas con pocas personas rinden más que el circuito de saludar a todo el mundo. Lo que ayuda de verdad no es forzarse a ser extrovertido, es reducir la incertidumbre — saber de antemano a quién tiene sentido acercarse convierte el problema social en un problema de información.",
    },
    {
      q: "¿Sirve el networking en línea igual que el presencial?",
      a: "Sirve para mantener, no para empezar. Un mensaje a un desconocido en una red social compite con otros cincuenta iguales; una conversación de diez minutos frente a frente no compite con nada. Lo que las herramientas en línea hacen bien es sostener después lo que empezó en persona.",
    },
  ],
} as const;
