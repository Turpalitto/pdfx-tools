# PDF X Tools

Next.js project for a browser-first PDF toolkit (compress, merge, convert, OCR, signing, page numbering).

## Stack

- Next.js App Router
- React
- Tailwind CSS

## Local Run

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Environment Variables

Create `.env.local` from `.env.example` and fill only what you use.

- `NEXT_PUBLIC_APP_URL` - public base URL for checkout redirects/canonical data.
- `NEXT_PUBLIC_GA_ID`, `NEXT_PUBLIC_YANDEX_METRIKA_ID`, `NEXT_PUBLIC_ADSENSE_CLIENT` - optional analytics/ads.
- `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` - optional Search Console verification.

### Firebase Client (Google Sign-In on frontend)

- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`

### Firebase Admin (server auth verification + Firestore source of truth)

- `FIREBASE_PROJECT_ID`
- `FIREBASE_CLIENT_EMAIL`
- `FIREBASE_PRIVATE_KEY` (store with escaped newlines: `\n`)

### Stripe

- `STRIPE_SECRET_KEY`
- `STRIPE_PRICE_ID`
- `STRIPE_WEBHOOK_SECRET`

### Hard Gating Flags

- `NEXT_PUBLIC_AUTH_REQUIRED_FOR_PRO=true`
- `NEXT_PUBLIC_HARD_GATING=true`

## Auth + Entitlements + Billing Flow

- Auth: Google-only via Firebase Auth (`AuthProvider` + `useAuth`).
- Entitlements API: `GET /api/entitlements` returns plan/usage snapshot.
- Usage API: `POST /api/usage/consume` updates daily quota in Firestore transaction.
- Checkout API: `POST /api/checkout` requires Firebase ID token and creates Stripe checkout with `metadata.uid`.
- Webhook API: `POST /api/stripe/webhook` syncs subscription state to `users/{uid}` and deduplicates events via `stripe_events/{eventId}`.

## Fallback Behavior (when secrets are missing)

- Guest quota (localStorage) keeps working: `5` operations/day.
- Without Firebase Admin env, server APIs return structured errors (`code`, `message`) instead of crashing UI.
- Without Stripe env, checkout/webhook endpoints return explicit setup errors.
- UI shows actionable messages like `Функция временно недоступна`.

## Build

```bash
npm run build
npm run start
```

## Implemented from rollout guide

- Tool routes + metadata + sitemap/robots
- Blog section with SEO metadata
- Privacy/Terms legal pages with canonical + social metadata
- Google auth provider + navbar account state (FREE/PRO)
- Server-side entitlements and usage APIs backed by Firestore
- Stripe checkout (auth required) + webhook subscription sync
- Fallback-safe behavior for missing env secrets
