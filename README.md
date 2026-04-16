# Compliment Hotline — Web

Marketing + submission site for the [Compliment Hotline](https://complimenthotline.org) art piece. A wooden cart carries eight vintage landline phones to disco festivals. Visitors pick up a phone, hear a compliment from a stranger, and record one for the next person. This site lets anyone in the world leave a text or audio compliment that gets queued for a real phone.

Companion to the hardware repo ([Compliment Hotline Cart](../Compliment%20Hotline%20Cart)).

## Stack

- **Vite + React + TypeScript** — the site itself
- **Tailwind CSS** — design tokens match the disco/festival aesthetic
- **Remotion** — the animated hero video (`/public/hero.mp4` + `/public/hero-poster.jpg`, rendered at build time)
- **Cloudflare Pages** — static hosting + edge Functions
- **Cloudflare D1** — text compliments and audio metadata
- **Cloudflare R2** — audio blob storage (opus/webm, capped at 2 MiB / 30 s)
- **Cloudflare KV** — fixed-window rate limiting

## Layout

```
src/                 React site (hero, marquee, submit form, rotary recorder)
functions/           Cloudflare Pages Functions
  _lib/              shared env, response, hash, rate-limit, filter, admin helpers
  api/compliments/   text.ts, recent.ts, stats.ts, [id]/audio.ts, audio/{init,upload,finalize}.ts
  api/admin/         login.ts, queue.ts, approve.ts, reject.ts, audio/[id].ts
remotion/            Remotion project (6 scenes, 540 frames @ 30fps = 18s)
migrations/          D1 SQL migrations
public/              static assets (favicon, admin.html, poster fallback)
scripts/deploy.sh    one-shot bootstrap + deploy
```

## First-time deploy

```bash
# 1. Install and log in
npm install
wrangler login

# 2. Run the bootstrap script (creates D1 + R2 + KV, applies migrations, renders the hero, deploys)
./scripts/deploy.sh

# 3. Set secrets
wrangler pages secret put ADMIN_TOKEN --project-name=compliment-hotline
wrangler pages secret put IP_HASH_SALT_SEED --project-name=compliment-hotline

# 4. Point complimenthotline.org at the Pages project in the Cloudflare dashboard
```

## Local development

```bash
npm run dev              # Vite dev server on :5173
npx wrangler pages dev   # Functions + static preview on :8788 (proxied by Vite)
npm run remotion:studio  # Interactive Remotion scene editor
```

## Moderation flow

Web submissions land as `status='pending'`. The hardware moderation worker (`../Compliment Hotline Cart/moderation/worker.py`) only handles Asterisk recordings. For web compliments:

- Visit `/admin.html`
- Log in with `ADMIN_TOKEN`
- Approve or reject each pending item (audio streams directly in the browser)
- Approved items appear in the public marquee and `/api/compliments/recent`

## API

| Method | Path                                    | Purpose                                             |
| ------ | --------------------------------------- | --------------------------------------------------- |
| POST   | `/api/compliments/text`                 | Submit a text compliment                            |
| POST   | `/api/compliments/audio/init`           | Reserve a slot, returns `put_url`                   |
| PUT    | `/api/compliments/audio/upload?key=&id=`| Browser uploads blob (Content-Type must match)      |
| POST   | `/api/compliments/audio/finalize`       | Verify upload landed in R2                          |
| GET    | `/api/compliments/recent?cursor=`       | Paginated feed of approved compliments              |
| GET    | `/api/compliments/stats`                | `{ total }` for the counter                         |
| GET    | `/api/compliments/:id/audio`            | Streams the approved audio (immutable-cached)       |
| GET    | `/api/admin/login`                      | Check session                                       |
| POST   | `/api/admin/login`                      | Exchange token for httpOnly cookie                  |
| GET    | `/api/admin/queue`                      | Pending items                                       |
| POST   | `/api/admin/approve` / `reject`         | Moderate                                            |
| GET    | `/api/admin/audio/:id`                  | Preview pending audio                               |

## Abuse defenses

- KV fixed-window rate limits per IP hash: text 5/min & 20/hr; audio 3/min & 10/hr
- Audio cap: 2 MiB / 30 s, Content-Length enforced
- Hidden honeypot field (`hp`)
- Keyword blocklist pre-filter on text (inline reject)
- Daily-rotating IP salt so `ip_hash` isn't a stable identifier across days
- Every submission starts pending; nothing public without human review

## Hero video

Rendered at build time with `npm run remotion:render` + `npm run remotion:poster`. If rendering fails (CI, low disk, etc.) the site falls back to `/hero-poster.svg` + CSS-only animation (disco ball, sparkle field, drop-in title).

## License

MIT. Be kind.
