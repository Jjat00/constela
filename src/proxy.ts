import { type NextRequest, NextResponse } from "next/server";
import {
  COOKIE_IDIOMA,
  COOKIE_IDIOMA_MAX_AGE,
  esLocale,
  esRastreador,
  gemela,
  localeDeAcceptLanguage,
  type Pagina,
  PARAM_IDIOMA,
  RUTAS,
  ubicar,
} from "@/lib/i18n";
import { updateSession } from "@/lib/supabase/middleware";

/*
 * Lo que ocurre antes de cada petición: primero el idioma, después la sesión.
 *
 * (En Next 16 esto se llama Proxy; es el archivo que hasta la 15 era
 * `middleware.ts`. Mismo mecanismo, otro nombre.)
 *
 * EN UNA FRASE: quien abre `/` con el navegador en inglés acaba en `/en`, y
 * quien lo abre en español se queda donde está.
 *
 * El orden importa. La negociación de idioma se resuelve entera antes de mirar
 * la sesión, porque una petición que va a acabar en un 307 no tiene por qué
 * pagar un viaje de red a Supabase para refrescar un token que se va a
 * refrescar igual en la URL de destino.
 */

export async function proxy(request: NextRequest) {
  const aqui = ubicar(request.nextUrl.pathname);

  if (aqui) {
    const redireccion = negociarIdioma(request, aqui);
    if (redireccion) return redireccion;
  }

  // Las páginas de documento no muestran nada que dependa de quién eres (ver
  // `src/components/obs-doc.tsx`), así que se ahorran el `getUser()`. Las dos
  // portadas sí lo necesitan: enseñan «entrar» o «entrar a tu constelación»
  // según haya sesión.
  if (aqui && aqui.pagina !== "portada") {
    return conVary(NextResponse.next());
  }

  const respuesta = await updateSession(request);
  return aqui ? conVary(respuesta) : respuesta;
}

/**
 * La adaptación al idioma del navegador. Devuelve una redirección, o `null`
 * si la petición se queda donde está.
 *
 * LAS CUATRO REGLAS, Y POR QUÉ CADA UNA:
 *
 * 1. **El árbol `/en` no redirige nunca.** Una URL escrita a mano, pegada en
 *    un chat o guardada en favoritos manda por encima de cualquier
 *    preferencia. La adaptación automática es para quien llega sin haber
 *    elegido, no para desautorizar a quien eligió.
 *
 * 2. **La elección explícita gana y se recuerda.** El selector de idioma
 *    enlaza con `?lang=`; aquí se convierte en cookie y se redirige a la URL
 *    limpia. Sin esa cookie, alguien con el navegador en inglés que pulsara
 *    «ES» sería devuelto a `/en` por la misma detección que lo trajo, y el
 *    español sería inalcanzable.
 *
 * 3. **Los rastreadores no se redirigen jamás.** Es la regla que protege el
 *    SEO entero: si Googlebot fuera rebotado de `/` a `/en`, la portada
 *    española no se indexaría en su propia URL y el `hreflang` que las declara
 *    hermanas sería una promesa falsa. No se les sirve una versión distinta
 *    —el HTML de `/` es idéntico para un bot y para una persona con el
 *    navegador en español—, solo se les deja llegar a las dos.
 *
 * 4. **La redirección es 307, temporal.** Un 301 le diría a Google que `/` se
 *    ha mudado a `/en` de forma permanente, que es exactamente lo contrario de
 *    lo que este sitio quiere decir.
 */
function negociarIdioma(
  request: NextRequest,
  aqui: { locale: string; pagina: Pagina },
): NextResponse | null {
  const { nextUrl } = request;

  // ── 1. Elección explícita: `?lang=xx` → cookie y URL limpia ───────────────
  const pedido = nextUrl.searchParams.get(PARAM_IDIOMA);
  if (pedido !== null) {
    const destino = nextUrl.clone();
    destino.searchParams.delete(PARAM_IDIOMA);

    if (!esLocale(pedido)) {
      // Un `?lang=` con basura dentro se limpia y ya: ni cookie ni idioma.
      return conVary(NextResponse.redirect(destino, 307));
    }

    destino.pathname = gemela(nextUrl.pathname, pedido) ?? nextUrl.pathname;
    const respuesta = conVary(NextResponse.redirect(destino, 307));
    respuesta.cookies.set(COOKIE_IDIOMA, pedido, {
      path: "/",
      maxAge: COOKIE_IDIOMA_MAX_AGE,
      sameSite: "lax",
    });
    return respuesta;
  }

  // ── 2. El árbol inglés se queda quieto ────────────────────────────────────
  if (aqui.locale !== "es") return null;

  // ── 3. La preferencia guardada manda sobre el navegador ───────────────────
  const guardado = request.cookies.get(COOKIE_IDIOMA)?.value;
  if (guardado !== undefined) {
    return guardado === "en" ? aIngles(request, aqui.pagina) : null;
  }

  // ── 4. Sin preferencia decide el navegador — salvo si quien llama es un bot
  if (esRastreador(request.headers.get("user-agent"))) return null;

  const preferido = localeDeAcceptLanguage(
    request.headers.get("accept-language"),
  );
  return preferido === "en" ? aIngles(request, aqui.pagina) : null;
}

function aIngles(request: NextRequest, pagina: Pagina) {
  const destino = request.nextUrl.clone();
  destino.pathname = RUTAS.en[pagina];
  return conVary(NextResponse.redirect(destino, 307));
}

/**
 * `Vary` en todo lo que sale de la negociación de idioma.
 *
 * Sin esta cabecera, una caché compartida guardaría la redirección de la
 * primera visita y se la serviría a todo el mundo: un visitante en inglés
 * dejaría el salto a `/en` fijado para el siguiente, que llegaba en español.
 * Es el fallo clásico de la negociación de contenido detrás de una caché, y
 * ocurre en las **redirecciones**, que es donde esta cabecera sí llega:
 * comprobado con `curl -I`, el 307 sale con `Vary: Accept-Language, Cookie`.
 *
 * En las respuestas 200 no llega: Next reescribe `Vary` con su propia lista
 * (`RSC, Next-Router-State-Tree, …`) al servir la página, y pisarla desde
 * `next.config` para colar dos valores más rompería el cacheo del payload de
 * RSC a cambio de casi nada — en Vercel el proxy se ejecuta antes de servir
 * cualquier respuesta cacheada, así que la decisión de idioma se vuelve a
 * tomar en cada petición y ninguna caché puede saltársela.
 */
function conVary(respuesta: NextResponse) {
  respuesta.headers.set("Vary", "Accept-Language, Cookie");
  return respuesta;
}

/*
 * Qué NO pasa por aquí.
 *
 * `updateSession` llama a `supabase.auth.getUser()` en cada petición que
 * atraviesa este matcher — un viaje de red a Supabase. Eso está bien para las
 * pantallas de la app y es imprescindible para las protegidas, pero era el
 * peaje que pagaban también `/robots.txt`, `/sitemap.xml`, `/llms.txt` y las
 * imágenes sociales, que se sirven sin tocar el servidor. Un rastreador que
 * lee el sitemap no tiene sesión que refrescar.
 *
 * Las cuatro páginas de documento SÍ entran ahora en el matcher —antes se
 * excluían aquí mismo— porque son tres de las seis URLs que negocian idioma.
 * No pagan el viaje a Supabase de todas formas: quien las excluye ya no es
 * esta expresión, es la comprobación de `pagina !== "portada"` de arriba, que
 * dice lo mismo pero en el sitio donde se puede leer por qué.
 *
 * Las rutas protegidas (`/home`, `/perfil`, `/ajustes`, `/eventos`, `/qr`,
 * `/me`) siguen dentro, que es lo único que este archivo no puede
 * equivocarse en hacer. `/tarjeta` ya no es protegida —se comparte sin
 * sesión— pero sigue pasando por aquí: quien sí tiene sesión la necesita
 * fresca para ver su WhatsApp y su encuentro.
 */
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|og/|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|txt|md|xml|webmanifest)$).*)",
  ],
};
