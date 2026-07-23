# Constela ✦

Tu constelación del evento: conecta escaneando un QR y mira tu red del evento convertirse en un grafo vivo.

- **Plan por fases**: [PLAN.md](./PLAN.md)
- **Marca y design system** (portable a IAs de imágenes): [DESIGN.md](./DESIGN.md)

## Stack

Next.js 16 (App Router, TS, React Compiler) · Tailwind v4 + shadcn/ui · Supabase (Auth, Postgres, Realtime) · pnpm.

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

## Producción (cuando la app esté completa en local)

Proyecto Supabase: `constela` (ref `usaytsxnbqxyrmdpewbw`, us-east-1).

```bash
pnpm exec supabase link --project-ref usaytsxnbqxyrmdpewbw
pnpm exec supabase db push        # aplicar migraciones a prod
```

Deploy del front: Vercel (pendiente, ver PLAN.md Fase 0).
