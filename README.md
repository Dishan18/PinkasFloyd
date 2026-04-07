# Pinkasfloyd

Pinkasfloyd is a Next.js App Router storefront for collectible posters inspired by music, cinema, and culture.

The project includes:

- Poster catalog and category filtering
- Poster detail with size/framing selection
- Client-side cart and checkout handoff
- Supabase auth (login/signup/reset)
- Supabase-backed orders and wishlist
- Payment handoff to WhatsApp with prefilled order message

## Tech Stack

- Next.js 15 (App Router)
- React 19
- TypeScript
- Tailwind CSS 3
- React Three Fiber + Drei
- Supabase JavaScript SDK
- Zustand

Core files:

- [package.json](package.json)
- [next.config.ts](next.config.ts)
- [tsconfig.json](tsconfig.json)
- [eslint.config.mjs](eslint.config.mjs)
- [lib/supabaseClient.js](lib/supabaseClient.js)
- [lib/seo.js](lib/seo.js)
- [supabase/schema.sql](supabase/schema.sql)

## Routes

Public:

- [app/page.tsx](app/page.tsx)
- [app/shop/page.tsx](app/shop/page.tsx)
- [app/poster/[id]/page.tsx](app/poster/[id]/page.tsx)
- [app/contact/page.tsx](app/contact/page.tsx)
- [app/privacy/page.tsx](app/privacy/page.tsx)
- [app/terms/page.tsx](app/terms/page.tsx)
- [app/shipping/page.tsx](app/shipping/page.tsx)
- [app/refund/page.tsx](app/refund/page.tsx)

User/account flows:

- [app/account/page.tsx](app/account/page.tsx)
- [app/cart/page.tsx](app/cart/page.tsx)
- [app/payment/page.tsx](app/payment/page.tsx)
- [app/orders/page.tsx](app/orders/page.tsx)
- [app/wishlist/page.tsx](app/wishlist/page.tsx)
- [app/reset-password/page.tsx](app/reset-password/page.tsx)

## Local Setup

### Prerequisites

- Node.js 18+
- npm
- Supabase project

### Install

```bash
npm install
```

### Environment Variables

Create .env.local in project root:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Optional: used by next.config.ts for analytics env wiring in production
GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

### Supabase Setup

1. Open Supabase SQL Editor.
2. Run [supabase/schema.sql](supabase/schema.sql).
3. Ensure Email auth is enabled.

### Run

```bash
npm run dev
```

Open http://localhost:3000

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
```

## Core Flows

### Wishlist

- Helpers: [app/lib/wishlist.ts](app/lib/wishlist.ts)
- Storage: Supabase wishlist table (user_id + poster_id unique pair)

### Cart and Checkout

- Cart persisted in localStorage
- Shipping details collected in cart page
- Auth required before payment step
- Payment page inserts order in Supabase and redirects to WhatsApp

### Orders

- Order records stored in public.orders
- User can view own orders by status in [app/orders/page.tsx](app/orders/page.tsx)

## SEO and Indexing

- Metadata helper: [lib/seo.js](lib/seo.js)
- Robots: [public/robots.txt](public/robots.txt)
- Sitemap: [public/sitemap.xml](public/sitemap.xml)

Private routes are disallowed in robots:

- /account
- /cart
- /payment
- /orders
- /wishlist
- /reset-password

## Deployment Checklist

1. Set environment variables in your host (for example Vercel).
2. Verify Supabase schema is applied in production.
3. Run production build locally:

```bash
npm run build
```

4. Confirm NEXT_PUBLIC_SITE_URL matches production domain.
