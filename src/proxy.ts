import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function proxy(request: NextRequest) {
  return await updateSession(request);
}

/*
 * Qué NO pasa por el refresco de sesión.
 *
 * `updateSession` llama a `supabase.auth.getUser()` en cada petición que
 * atraviesa este matcher — un viaje de red a Supabase. Eso está bien para las
 * pantallas de la app y es imprescindible para las protegidas, pero era el
 * peaje que pagaban también `/robots.txt`, `/sitemap.xml`, `/llms.txt` y las
 * dos páginas de contenido, que se prerrenderizan en el build precisamente
 * para servirse sin tocar el servidor. Un rastreador que lee el sitemap no
 * tiene sesión que refrescar.
 *
 * Las dos páginas de documento se excluyen porque no muestran absolutamente
 * nada que dependa de quién eres (ver `src/components/obs-doc.tsx`). El efecto
 * secundario: navegar SOLO por ellas no refresca el token de sesión. Es
 * inofensivo — cualquier otra ruta de la app lo refresca, incluida la portada.
 *
 * Las rutas protegidas (`/home`, `/perfil`, `/ajustes`, `/eventos`, `/qr`,
 * `/me`, `/tarjeta`) siguen dentro, que es lo único que este archivo no puede
 * equivocarse en hacer.
 */
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|opengraph-image|twitter-image|networking-en-eventos|app-de-networking-para-eventos|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|txt|md|xml|webmanifest)$).*)",
  ],
};
