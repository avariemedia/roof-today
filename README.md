# Roof Today

The contractor-first roof measurement report tool. `$19` per report. No subscription.

Live: https://www.roof-today.com

## Stack

- Next.js 14 (App Router) · TypeScript · Tailwind CSS · Framer Motion
- Stripe Checkout (REST, no SDK dependency)
- Deployed on Netlify

## Local dev

```bash
npm install
cp .env.example .env.local  # fill in keys
npm run dev
```

## Environment variables (Netlify + local)

| Key | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Canonical site URL (e.g. `https://www.roof-today.com`) |
| `STRIPE_SECRET_KEY` | Stripe secret key (live or test) |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret (for future webhook route) |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key |
| `NEXT_PUBLIC_STRIPE_PRICE_SINGLE` | Optional price ID for the $19 single report |

If `STRIPE_SECRET_KEY` is not set, the checkout route falls back to a dev simulation so the funnel still works end-to-end.

## Deploy

Push to `main` → Netlify auto-builds with `@netlify/plugin-nextjs`.

## Key pages

- `/` — home + address capture
- `/report/preview?address=…` — gamified scan + blur-locked report preview
- `/pricing` — tiers + comparison
- `/sample-report` — standalone sample entry
- `/vs/eagleview`, `/vs/gaf-quickmeasure`, `/vs/hover` — comparison pages
- `/for/roofing-contractors`, `/for/solar-installers`, `/for/insurance-adjusters`, `/for/storm-restoration`
- `/features/accuracy`, `/features/speed`, `/features/insurance-reports`

## Next iteration

- Plug in real aerial measurement engine (currently deterministic mock)
- Auth (Clerk or Auth.js) for dashboard + report persistence
- Stripe webhook → trigger real report generation + email delivery
- Google Places autocomplete on address input
- Programmatic location pages (50 states + top 500 metros)
- 20 long-tail blog guides
