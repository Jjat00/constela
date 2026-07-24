#!/usr/bin/env bash
# Arranca el stack local de Supabase inyectando las variables de .env.local,
# que config.toml referencia con env() (credenciales de Google OAuth).
set -euo pipefail
cd "$(dirname "$0")/.."

if [ -f .env.local ]; then
  set -a
  # shellcheck disable=SC1091
  source .env.local
  set +a
fi

exec pnpm exec supabase "${1:-start}"
