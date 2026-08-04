# Constela

Tu constelación del evento: conecta escaneando un QR y mira la red del evento convertirse en un grafo vivo.

**En producción: [constela.com.co](https://constela.com.co)**

- **Plan por fases**: [PLAN.md](./PLAN.md)
- **Qué es y qué no**: [PRODUCT.md](./PRODUCT.md) · **Lenguaje del dominio**: [CONTEXT.md](./CONTEXT.md) · **Decisiones**: [docs/adr/](./docs/adr/)
- **Marca y design system** (portable a IAs de imágenes): [DESIGN.md](./DESIGN.md) — v6 «Observatorio»

## Stack

Next.js 16 (App Router, TS, React Compiler) · Tailwind v4 + shadcn/ui · Supabase (Auth, Postgres, Realtime) · pnpm.

## El árbol de rutas (lo que más despista al llegar)

**No existe `src/app/layout.tsx`.** El sitio público es bilingüe y `<html lang>` es un atributo del documento, así que hay **dos layouts raíz**, uno por idioma. Los dos son cuatro líneas que llaman al mismo `RaizHtml`.

```
src/app/
  (es)/            ← layout raíz lang="es" · la aplicación entera
    page.tsx                              /
    app-de-networking-para-eventos/       /app-de-networking-para-eventos
    networking-en-eventos/                /networking-en-eventos
    (app)/ (legal)/ login/ bienvenida/ u/ e/
  (en)/            ← layout raíz lang="en" · solo el sitio público
    en/page.tsx                           /en
    en/event-networking-app/              /en/event-networking-app
    en/networking-at-events/              /en/networking-at-events
  og/[locale]/     ← las dos láminas sociales: /og/es y /og/en
  not-found.tsx    ← trae su propio <html>: no hay layout raíz encima
  robots.ts · sitemap.ts · manifest.ts
```

Los route groups `(es)` y `(en)` **no aparecen en la URL**: mover la app dentro de `(es)` no cambió ni una ruta. El resto de lo que hay que saber:

| Dónde | Qué |
|---|---|
| `src/lib/i18n.ts` | Locales, mapa de rutas gemelas, detección de `Accept-Language` |
| `src/lib/copy/` | Todo el texto público. `tipos.ts` obliga a que ES y EN tengan las mismas piezas — si falta una, no compila |
| `src/lib/seo.ts` | Metadata, `hreflang` y JSON-LD, por idioma |
| `src/proxy.ts` | Negociación de idioma (307, exime a rastreadores) **y** refresco de sesión de Supabase, en ese orden |
| `src/components/vista-*.tsx` | Las tres páginas públicas, parametrizadas por `locale` |
| `src/components/obs-css.tsx` | Las clases de v6 «Observatorio»; los tokens están en `globals.css` |

> **Aviso para agentes**: `AGENTS.md` obliga a leer `node_modules/next/dist/docs/` antes de escribir código. Este Next 16 no es el del entrenamiento — el `middleware.ts` de siempre aquí se llama `proxy.ts`.

## Desarrollo local (flujo local-first)

Todo se desarrolla contra un stack Supabase local en Docker — réplica de producción. Nada toca la nube hasta el deploy final.

```bash
# 1. Levantar el stack local (Docker debe estar corriendo)
pnpm exec supabase start

# 2. Dev server (el puerto 3000 suele estar ocupado por otros proyectos)
pnpm dev -p 3001
```

| Servicio | URL |
|---|---|
| App | http://localhost:3001 |
| API Supabase local | http://127.0.0.1:44321 |
| **Studio** (admin DB) | http://127.0.0.1:44323 |
| **Mailpit** (captura los magic links de login) | http://127.0.0.1:44324 |
| Postgres directo | `postgresql://postgres:postgres@127.0.0.1:44322/postgres` |

> **¿Por qué puertos 4432X y no los 5432X por defecto?** Windows/WSL2 reserva el rango 54299-54398 (Hyper-V), así que los defaults del CLI no se pueden bindear. Están remapeados en `supabase/config.toml`.

Migraciones en `supabase/migrations/` — son la **fuente de verdad** del schema:

```bash
pnpm exec supabase migration new <nombre>   # crear una nueva
pnpm exec supabase db reset                 # recrear la DB local desde cero
```

## Producción

**Front en Vercel, dominio propio: [constela.com.co](https://constela.com.co).** Un push a `main` es un despliegue de producción — no hay rama de staging.

Proyecto Supabase: `constela` (ref `usaytsxnbqxyrmdpewbw`, us-east-1).

```bash
pnpm exec supabase link --project-ref usaytsxnbqxyrmdpewbw
pnpm exec supabase db push        # aplicar migraciones a prod
```

### Verificar un build antes de subirlo

```bash
pnpm build && pnpm start -p 3005
curl -s http://127.0.0.1:3005/en | grep -o '<link rel="canonical"[^>]*>'
```

> **Mata los `next start` viejos primero.** Un servidor anterior sirviendo el build de antes ya costó una vuelta entera de diagnóstico: si el HTML no cuadra con `.next/server/app/<ruta>.html`, el servidor es viejo, no el código.
