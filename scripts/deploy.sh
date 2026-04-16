#!/usr/bin/env bash
# One-shot bootstrap + deploy for the Compliment Hotline website.
# Prereqs: wrangler logged in (`wrangler login`), Node 20+, npm.

set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

STEP() { printf "\n\033[1;35m▸ %s\033[0m\n" "$*"; }
NOTE() { printf "  \033[0;36m%s\033[0m\n" "$*"; }

STEP "Checking wrangler auth"
if ! wrangler whoami >/dev/null 2>&1; then
  echo "✘ wrangler is not logged in. Run: wrangler login" >&2
  exit 1
fi

STEP "Installing dependencies"
npm install

STEP "Creating D1 database (idempotent)"
if ! wrangler d1 list 2>/dev/null | grep -q "compliment-hotline"; then
  CREATE_OUT=$(wrangler d1 create compliment-hotline)
  echo "$CREATE_OUT"
  D1_ID=$(echo "$CREATE_OUT" | grep -oE 'database_id[[:space:]]*=[[:space:]]*"[a-f0-9-]+"' | head -1 | cut -d'"' -f2)
  NOTE "D1 created with id: $D1_ID"
  NOTE "⚠ Paste this into wrangler.toml under [[d1_databases]] database_id, then re-run."
  if [ -n "${D1_ID:-}" ]; then
    sed -i.bak "s/REPLACE_WITH_D1_ID/$D1_ID/" wrangler.toml && rm wrangler.toml.bak
    NOTE "wrangler.toml updated automatically."
  fi
else
  NOTE "D1 already exists."
fi

STEP "Creating R2 bucket (idempotent)"
wrangler r2 bucket create compliment-hotline-audio 2>/dev/null || NOTE "bucket already exists"

STEP "Applying R2 CORS"
wrangler r2 bucket cors put compliment-hotline-audio --file r2-cors.json || NOTE "cors set skipped"

STEP "Creating KV namespace (idempotent)"
if ! grep -q "REPLACE_WITH_KV_ID" wrangler.toml; then
  NOTE "KV id already set in wrangler.toml"
else
  KV_OUT=$(wrangler kv namespace create RATE_LIMIT 2>&1 || true)
  echo "$KV_OUT"
  KV_ID=$(echo "$KV_OUT" | grep -oE 'id = "[a-f0-9]+"' | head -1 | cut -d'"' -f2)
  if [ -n "${KV_ID:-}" ]; then
    sed -i.bak "s/REPLACE_WITH_KV_ID/$KV_ID/" wrangler.toml && rm wrangler.toml.bak
    NOTE "KV id set: $KV_ID"
  fi
fi

STEP "Applying D1 migrations (remote)"
wrangler d1 migrations apply compliment-hotline --remote

STEP "Rendering Remotion hero video + poster"
npm run remotion:render || NOTE "remotion:render failed — deploy will continue without hero.mp4"
npm run remotion:poster || NOTE "remotion:poster failed — using /hero-poster.svg fallback"

STEP "Building site"
npm run build

STEP "Deploying to Cloudflare Pages"
wrangler pages deploy dist --project-name=compliment-hotline

STEP "Done"
NOTE "Set your admin secret next: wrangler pages secret put ADMIN_TOKEN --project-name=compliment-hotline"
NOTE "And the salt:             wrangler pages secret put IP_HASH_SALT_SEED --project-name=compliment-hotline"
NOTE "Then point complimenthotline.org at the Pages project in the Cloudflare dashboard."
