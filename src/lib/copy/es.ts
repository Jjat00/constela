/**
 * El banco de hechos en español.
 *
 * Todo lo que las tres páginas públicas dicen sale de aquí, y todo lo de aquí
 * sale de PRODUCT.md, CONTEXT.md y los ADR. La regla dura: **no existen
 * testimonios, métricas de uso, prensa, casos ni clientes — no fabricar
 * ninguno** (PRODUCT.md § Evidence on Hand). Si una página necesitara una
 * cifra para funcionar, la página está mal, no los datos.
 *
 * Y aquí aprieta más que en ningún otro archivo, porque estas páginas existen
 * para recibir a quien busca «app de networking para eventos» — la situación
 * exacta en la que un texto de marketing se pone a inventar estadísticas. **No
 * hay una sola en este archivo.** No porque no ayudaran (una cifra con fuente
 * es lo que más citan los motores de respuesta) sino porque no tenemos ninguna
 * que sea nuestra y verificable, y repetir el «88 % de las tarjetas se tiran
 * en una semana» que circula por internet sin poder rastrearlo hasta su
 * estudio sería fabricar evidencia.
 *
 * La comparación de la tabla es **entre métodos, no entre productos**: «la app
 * del organizador» es una categoría de herramienta, no un competidor con
 * nombre. No se nombra ni se describe ningún producto ajeno — no podríamos
 * hacerlo con precisión y equivocarnos sería, además de injusto, la clase de
 * error que un lector del gremio detecta en dos segundos.
 *
 * Español de América: segunda persona del singular («escaneas», «tu red»),
 * que sirve a los dos lados del charco, y cuando hace falta el plural es
 * «ustedes» — nunca «vosotros».
 *
 * Su gemelo inglés es `en.ts`, y los dos implementan `tipos.ts`: lo que se
 * añada aquí hay que añadirlo allí o el proyecto no compila.
 */

import type { Copy } from "./tipos";

/** Última revisión del contenido de las dos páginas de documento (ISO). */
export const REVISADO = "2026-08-04";

export const ES: Copy = {
  chrome: {
    entrar: "Entrar →",
    entrarConstelacion: "Entrar a tu constelación",
    volverPortada: "Constela — ir a la portada",
    migasAria: "Migas de pan",
    migasInicio: "Constela",
    pieAria: "Enlaces del sitio",
    pieLegalAria: "Enlaces legales",
    portada: "Portada",
    privacidad: "Privacidad",
    terminos: "Términos",
    copyright: "© 2026 Constela",
    gratis: "Gratis · sin instalar nada",
    idioma: {
      aria: "Idioma",
      otro: "EN",
      otroNombre: "English",
    },
    avisoIdiomaApp: "",
    google: {
      continuar: "Continuar con Google",
      abriendo: "Abriendo Google…",
      error: "Google no respondió. Intenta de nuevo.",
    },
    ficha: {
      rol: "[ TU ROL ]",
      intereses: "[ INTERESES · OPCIONAL ]",
      intencion: "[ INTENCIÓN · OPCIONAL ]",
      buscaRol: "busca tu rol o escríbelo",
      buscaIntereses: "¿de qué quieres hablar?",
      buscaIntencion: "¿a qué viniste?",
      verRestantes: "ver los {n} restantes",
    },
  },

  portada: {
    marca: {
      nombre: "Constela",
      tagline: "El networking que por fin se ve",
      /** La definición: quien llega acaba de ser escaneado y no sabe qué es esto. */
      definicion:
        "Escaneas el QR de quien acabas de conocer en un evento y la red se dibuja en vivo, a la vista de todo el evento.",
      titular: { antes: "Tu red es", destacado: "tu universo." },
    },

    hero: {
      mono: "Constela · para cualquier evento",
      ledeFuerte: "Constela es el networking que por fin se ve.",
      verso: "Cada persona es una estrella, cada conexión, una constelación.",
      tiempo: "8 segundos",
    },

    video: {
      etiqueta: "En movimiento",
      titulo: "Constela, en 35 segundos.",
      texto:
        "La misma historia, de corrido y sin tocar nada. Todo lo que se ve en el video es la aplicación: ninguna pantalla está maquetada.",
      marco: "constela · presentación",
      pie: "35 s · sin sonido",
    },

    /** Los tres gestos. Ninguno describe algo que la app no haga hoy. */
    pasos: {
      mono: "Cómo funciona",
      titulo:
        "Tres gestos, ninguno remoto: la conexión existe porque se vieron.",
      howTo: "Cómo se conecta con alguien en Constela",
      lista: [
        {
          n: "01",
          titulo: "Escaneas",
          texto:
            "Abres el QR personal de quien tienes delante. Ese gesto te mete al evento y los conecta, en el mismo movimiento — y ahí mismo, de un tap, dejas anotado dónde nació el encuentro.",
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
      ],
    },

    /** El vocabulario del dominio (CONTEXT.md): el cosmos mapea al producto. */
    vocabulario: {
      mono: "Vocabulario",
      titulo: "El cosmos no es decoración: es el modelo.",
      lista: [
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
      ],
    },

    /** Lo que Constela no hace — el posicionamiento, en negativo. */
    noHace: {
      mono: "Lo que no encontrarás",
      lista: [
        "Sin botón de «agregar»",
        "Sin solicitudes pendientes",
        "Sin conectar desde el sofá",
        "Sin niveles, puntos ni insignias",
      ],
    },

    /** Preguntas que sí tienen respuesta hoy. Nada especulativo. */
    preguntas: {
      mono: "Preguntas",
      lista: [
        {
          q: "¿Necesito que el organizador lo instale?",
          a: "No. Constela se pasa de persona a persona: te unes al evento escaneando a alguien que ya está dentro.",
        },
        {
          q: "¿Puedo conectar con alguien sin haberlo visto?",
          a: "No, y es a propósito. Una conexión solo nace al abrir el QR personal del otro. Tocar su estrella abre su perfil; no los conecta.",
        },
        {
          q: "¿Quién ve la constelación?",
          a: "Todo el que esté en el evento. La visión colectiva de la red es el producto, no un extra.",
        },
        {
          q: "¿Cómo recuerdo de qué hablé con cada quien?",
          a: "Anotándolo en el momento: al conectar, la misma pantalla ofrece contextos de un tap —«en la charla», «en el after»— y texto libre, y después la nota se edita tocando su estrella. Es privada: solo tú la ves, ni siquiera la otra persona.",
        },
        {
          q: "¿Cómo entro?",
          a: "Con tu cuenta de Google, y ya. El resto del perfil es opcional y se puede dejar para después.",
        },
      ],
    },

    /**
     * La bienvenida real (`/bienvenida`) enseñada en la portada: las tres
     * preguntas del ADR 0004 sobre el catálogo del evento de ejemplo.
     */
    bienvenida: {
      etiqueta: "Primero",
      titulo: "Entras con Google y dices quién eres.",
      texto:
        "Tu rol, los temas de los que quieres hablar y a qué viniste al evento. Una pantalla, menos de un minuto, una sola vez: eso es toda tu estrella.",
      textoDos:
        "No es un perfil para adornar. Esas tres señales son el idioma con el que el resto del evento decide acercarse a ti — y con el que tú decides a quién buscar.",
      pie: "es la pantalla de bienvenida real · los tags son los del evento de ejemplo",
    },

    mapa: {
      etiqueta: "Después",
      titulo: "Y el evento entero se vuelve legible.",
      texto:
        "Cada asistente es una estrella; cada QR que escaneas, una línea entre dos. Filtra por rol, interés o intención y lo que no coincide se apaga: el mapa nunca se reordena, así que nunca pierdes de vista dónde estaba quién.",
      textoDos:
        "Ahí se ve lo que un salón lleno esconde: quién está contratando, quién habla de lo mismo que tú, y los triángulos azules de gente que ya se conoce entre sí — por donde se pide una presentación. Y en las estrellas con las que ya te cruzaste, tu nota de ese encuentro: dónde fue, de qué hablaron. Solo tú la ves.",
      marco: "constelación · evento de ejemplo",
      pie: "toca un chip, busca un nombre, abre una estrella",
    },

    /**
     * Las dos páginas que explican la categoría, no el producto. Van en la
     * portada y no en el pie a propósito: son el único enlace interno del
     * sitio con texto descriptivo, y quien llegó hasta abajo sin entrar es
     * exactamente quien todavía está comparando.
     */
    siguiente: {
      mono: "Seguir leyendo",
      titulo: "Si todavía estás decidiendo cómo hacer networking.",
      enlaces: [
        {
          a: "categoria",
          titulo:
            "Qué es una app de networking para eventos, y en qué se diferencian",
          texto:
            "Las cuatro formas de intercambiar contactos en un evento —papel, LinkedIn, la app del organizador y el escaneo presencial— comparadas por lo que cuesta cada una y por lo que queda después.",
        },
        {
          a: "guia",
          titulo:
            "Cómo hacer networking en un evento sin que se te haga cuesta arriba",
          texto:
            "Qué falla antes de la conversación, por qué los contactos que te llevas a casa casi nunca se convierten en nada y qué hacer distinto la próxima vez que entres a un salón lleno de desconocidos.",
        },
      ],
    },

    cierre: { titulo: "Entra por una estrella." },

    demo: {
      reproducir: "Reproducir",
      pausar: "Pausar",
      videoAria:
        "Constela en 35 segundos: cómo se dibuja la constelación de un evento",
      encendiendo: "encendiendo la constelación…",
      filtrar: "Filtrar la constelación con esto ↓",
      eligeRol: "Elige tu rol",
      senal: "señal elegida",
      senales: "señales elegidas",
      seApaga: "abajo se apaga lo que no coincida",
      pistaVacia: "elige al menos tu rol para ver qué hace",
      estrellas: "estrellas",
      conexiones: "conexiones",
      tusEventos: "tus eventos",
    },
  },

  // ───────────────────────────────────────────────────────────────────────────
  // /app-de-networking-para-eventos — la página de categoría
  // ───────────────────────────────────────────────────────────────────────────

  categoria: {
    etiqueta: "La categoría",
    titulo: "Qué es una app de networking para eventos",
    h1: "Una app de networking para eventos sirve para una sola cosa: que no pierdas a la gente que sí conociste.",
    clave:
      "Una app de networking para eventos es una herramienta que registra los encuentros que ocurren en un evento presencial y los convierte en contactos que puedes recuperar después. Las hay de dos clases: las que digitalizan el intercambio de datos —una tarjeta con QR en vez de una de papel— y las que además dibujan la red que se va formando entre los asistentes.",
    descripcion:
      "Qué es una app de networking para eventos, las cuatro formas de intercambiar contactos en uno y qué cambia cuando la red del evento se puede ver. Constela es gratis.",

    problema: {
      mono: "El problema",
      titulo:
        "El problema no es intercambiar datos. Es lo que pasa al día siguiente.",
      parrafos: [
        "Intercambiar contactos en un evento está resuelto desde hace décadas: una tarjeta, un teléfono dictado, un usuario de LinkedIn escrito a mano. Lo que ninguno de esos gestos resuelve es el día siguiente, cuando tienes ocho nombres y ninguna forma de recordar cuál era el que trabajaba en lo tuyo.",
        "Un contacto guardado sin contexto es casi lo mismo que no tenerlo. La tarjeta no sabe de qué hablaron, LinkedIn no sabe dónde se conocieron, y el teléfono guardado como «Andrés evento» no dice nada que sirva para escribirle una semana después sin que suene a mensaje en frío.",
        "Y hay un problema anterior, más grande y del que casi nadie habla: en un salón con doscientas personas no sabes a quién acercarte. La información que decidiría el encuentro —quién está contratando, quién hace lo mismo que tú, quién vino a buscar socios— existe, pero está repartida en doscientas cabezas y no hay forma de verla.",
      ],
    },

    /**
     * Las cuatro formas reales de resolverlo. Ninguna fila describe un producto
     * concreto: son métodos, y cada uno se juzga por lo que deja después, que
     * es la única vara que importa cuando el evento terminó.
     */
    tabla: {
      mono: "Comparación",
      titulo: "Las cuatro formas de intercambiar contactos en un evento",
      caption:
        "Las cuatro formas de intercambiar contactos en un evento presencial, comparadas por lo que cuestan en el momento y por lo que queda después.",
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
      mono: "La diferencia",
      titulo: "Lo que cambia cuando la red se puede ver",
      parrafos: [
        "Casi todas las herramientas de esta categoría tratan el networking como un problema de almacenamiento: capturar el dato del otro y guardarlo bien. Constela lo trata como un problema de visibilidad. La pregunta que resuelve no es «¿cómo guardo este contacto?», sino «¿a quién debería acercarme en este salón?».",
        "Por eso la red del evento no es privada. Cualquier asistente ve el grafo completo: las estrellas son las personas, las líneas son los encuentros que de verdad ocurrieron y los triángulos son los grupos de tres que ya se conocen entre sí. Ver un triángulo del que cuelga alguien con quien quieres hablar es, literalmente, ver por dónde pedir que te presenten.",
        "El costo de ese diseño es deliberado: no se puede conectar con nadie a distancia. No hay botón de agregar, ni solicitudes pendientes, ni forma de sumar contactos desde el sofá. Una línea entre dos estrellas significa que esas dos personas estuvieron una frente a la otra, y esa garantía se rompería en el instante en que existiera un botón.",
      ],
      cruce: {
        antes:
          "Si lo que buscas no es comparar herramientas sino salir mejor del próximo evento, la ",
        enlace: "guía de networking en eventos presenciales",
        despues: " entra en el cómo.",
        a: "guia",
      },
    },

    preguntas: {
      mono: "Preguntas",
      titulo: "Lo que se pregunta todo el mundo antes de instalar nada.",
      lista: [
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
    },
  },

  // ───────────────────────────────────────────────────────────────────────────
  // /networking-en-eventos — la guía
  // ───────────────────────────────────────────────────────────────────────────

  guia: {
    etiqueta: "La guía",
    titulo: "Cómo hacer networking en un evento presencial",
    h1: "Cómo hacer networking en un evento sin que se te haga cuesta arriba.",
    clave:
      "Hacer networking en un evento presencial es, en la práctica, resolver tres cosas seguidas: a quién acercarte, cómo empezar la conversación y qué hacer con ella después. Casi todos los consejos que circulan atacan la segunda. Las que de verdad deciden el resultado son la primera y la tercera.",
    descripcion:
      "Guía práctica de networking en eventos presenciales: a quién acercarte, cómo empezar y qué hacer después. Sin trucos de vendedor y sin fórmulas de LinkedIn.",
    revisada: "Revisada el 4 de agosto de 2026",

    tiempos: [
      {
        mono: "Antes",
        titulo: "Antes: decide una sola cosa",
        parrafos: [
          "No hace falta una estrategia. Hace falta una frase: a qué vas. «Busco un cofundador técnico», «quiero entender cómo se cobra esto», «vengo a que me vean para contratarme». Una sola, dicha en voz alta antes de entrar.",
          "Sirve para dos cosas, y ninguna es motivacional. La primera es que filtra: con una intención clara, la mitad de las conversaciones posibles del salón dejan de importarte y puedes dedicarle el doble de tiempo a la otra mitad. La segunda es que te da respuesta a la única pregunta que todo el mundo hace en un evento —«¿y tú a qué viniste?»— sin tener que improvisar un discurso sobre tu empresa.",
          "Si el evento tiene alguna forma de decir esa intención por adelantado, dila. Es información que le sirve más al resto que a ti: alguien que busca exactamente lo que tú ofreces necesita poder encontrarte.",
        ],
      },
      {
        mono: "Durante",
        titulo: "Durante: el problema es a quién, no cómo",
        parrafos: [
          "Casi toda la literatura sobre networking enseña a empezar conversaciones. Es la parte fácil. La difícil es que en un salón lleno la información que decidiría con quién hablar está repartida en doscientas cabezas y no se ve: quién está contratando, quién trabaja en lo mismo que tú, quién ya conoce a la persona que te interesa.",
          "Sin esa información, la mayoría de la gente hace lo mismo: se queda con quien ya conocía, o se acerca a quien está solo porque es más fácil. Las dos son decisiones tomadas por comodidad, no por criterio, y las dos explican por qué se sale de muchos eventos con la sensación de no haber aprovechado nada.",
          "Lo que sí funciona y no cuesta nada: preguntar por la tercera persona. «¿Conoces a alguien aquí que trabaje en esto?» convierte una conversación en dos, y una presentación hecha por alguien de confianza empieza a un nivel al que una conversación en frío no llega. Es el mismo principio por el que en Constela se iluminan los triángulos: tres personas que ya se conocen entre sí son el camino más corto hacia una cuarta.",
        ],
      },
      {
        mono: "Después",
        titulo: "Después: el contacto sin contexto no vale nada",
        parrafos: [
          "El día siguiente es donde se pierde casi todo. No porque a la gente le dé pereza escribir, sino porque escribir requiere recordar, y lo que queda de un evento —una tarjeta, un nombre en el teléfono, una conexión aceptada— no contiene lo que haría falta recordar: de qué hablaron, qué buscaba esa persona, por qué valía la pena seguir.",
          "El truco viejo y bueno es anotar en la tarjeta, en el momento, una línea sobre la conversación. Funciona, y sigue funcionando. El problema es que nadie lo hace de pie, con una copa en una mano y el teléfono en la otra.",
          "Por eso el registro tiene que ocurrir en el mismo gesto que el encuentro, o no ocurre. Si conectar exige un paso aparte —abrir una app, buscar un nombre, mandar una solicitud— ese paso se pospone hasta que deja de tener sentido. Si conectar ES el gesto de escanear a alguien que tienes delante, ya quedó registrado quién, dónde y cuándo, sin que nadie tuviera que acordarse de nada.",
        ],
      },
    ],

    errores: {
      mono: "Lo que no funciona",
      titulo: "Cuatro cosas que no funcionan",
      lista: [
        "Repartir tarjetas en volumen. Veinte contactos sin contexto rinden menos que tres conversaciones que recuerdas.",
        "Vender en la primera frase. En un evento nadie está en modo compra; el que abre vendiendo se convierte en la persona de la que el resto se aleja.",
        "Dejar el seguimiento para «cuando tenga tiempo». El contexto se evapora en días, y con él la única razón por la que ese mensaje no sería spam.",
        "Quedarte con la gente que ya conoces. Es la decisión más cómoda del salón y la única que garantiza que el evento no te sirvió para nada.",
      ],
    },

    preguntas: {
      mono: "Preguntas",
      titulo: "Las que se hacen antes de entrar al salón.",
      lista: [
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
    },

    cruce: {
      mono: "Y si buscabas herramienta",
      antes:
        "Esta guía funciona con una libreta y cuatro tarjetas de papel. Si además estabas comparando herramientas, la página sobre ",
      enlace: "qué es una app de networking para eventos",
      despues:
        " compara los cuatro métodos por lo que queda después de cada uno.",
      a: "categoria",
    },
  },
};
