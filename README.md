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

- Analytics: Google Analytics / Yandex Metrika
- Ads: Google AdSense client id
- Billing: Stripe checkout variables
- Auth/storage: Firebase public config

## Build

```bash
npm run build
npm run start
```

## Implemented from rollout guide

- Tool routes + metadata + sitemap
- Blog section with first SEO article
- Privacy Policy and Terms pages
- Optional analytics/ads scripts via env
- Stripe checkout API route scaffold
- Firebase initialization scaffold