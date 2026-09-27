# Implementation Plan – Fashion Brand E-Commerce (MVP to Launch)
**Status:** Draft v1.0 for review
**Source:** `docs/PROJECT BRIEF - FASHION BRAND.md` + `docs/PRD - FASHION BRAND.md`
**Date:** 2026-09-26

This is a docs-only repo today. This plan takes you from 0 → live MVP in phases, with stack choices + why.

---
## 0. Guiding Decisions (proposed, confirm to proceed)

**Platform:** Responsive website first (mobile-first), not native app.
Why: Users discover via search/social on mobile; 1 codebase; SEO; cheaper to iterate. Wrap as PWA later.

**Architecture style:** Modular monolith – single Next.js app + managed backend (Supabase).
Why: Small catalog (<200 SKUs), small team, need speed. No microservices for MVP.

**Rendering:** SSR/ISR for landing/collections/PDP (SEO + speed), CSR for cart/checkout/account.
Why: Discovery matters for a new brand; checkout needs interactivity.

> If you prefer Shopify/WooCommerce to code less, say so – Plan B is in §8. Default below is custom for full control + low cost.

---
## 1. Recommended Stack – Summary (use this)

| Layer | Recommended | Why this + not alternative |
|---|---|---|
| **Web (Storefront)** | **Next.js 14 App Router + TypeScript + Tailwind CSS + shadcn/ui, hosted on Vercel** | SEO + ISR for landing/collections/PDP (critical for brand discovery), `next/image` for fashion photos, 1 codebase mobile-first. Rejected Vite SPA (poor SEO), rejected Shopify (monthly cost + lock-in for MVP). |
| **Database** | **Supabase Postgres (DB only – Auth/Storage disabled)** | Postgres for products → variants → orders → returns joins, free tier to start, connection pooling + backups managed. We use it as pure Postgres via `DATABASE_URL`; Drizzle ORM for migrations. Rejected Firebase (weak joins). |
| **Auth** | **Better Auth (with Drizzle adapter to Supabase Postgres)** | Modern TS-first auth, email/password + magic-link/OTP + social (Google) + guest-checkout support, sessions in our own DB (full control, no vendor lock). Better DX + cheaper than Clerk/Auth0, more flexible than Supabase Auth. Supabase Auth will NOT be used to avoid dual user tables. |
| **Files / Storage** | **Cloudflare R2 + Cloudflare CDN (custom domain `cdn.yourbrand.com`)** | S3-compatible, **zero egress fees** (critical – fashion = heavy images), global CDN, presigned uploads for admin. Served via `next/image` (remote loader) + R2 public URL. Rejected Supabase Storage (egress costs + fewer edge locations) and Cloudinary for MVP (cost). |
| **Payments** | **Stripe Checkout default; Paystack / Flutterwave if NG/KE/GH; COD toggle optional** | Stripe = PCI-safe hosted page, cards + Apple/Google Pay + webhooks + test mode. Paystack/Flutterwave = cards + bank + mobile-money where Stripe is weak. Abstracted in `lib/payments.ts` so you can swap. |
| **Email** | **Resend + React Email** | Simple API, great DX with Next.js, templates as React components (confirmation, shipping, return). Rejected SendGrid (heavier/older DX) for MVP. |
| **SMS / WhatsApp** | **SMS: Twilio global, or Termii / Africa's Talking if NG/KE; WhatsApp: WhatsApp Cloud API (or Twilio WhatsApp) for order updates + support button** | Order confirmation + delivery updates where email open-rate is low; WhatsApp button on PDP/cart converts well for fashion. Start email + WhatsApp support link, add automated SMS in Phase 4. |

Details per layer below – this table is the lock-in decision.

## 1. Stack – What We Will Use and Why

### 1.1 Frontend
- **Next.js 14 (App Router) + TypeScript**
  Why: SEO + ISR for products, image optimization, API routes for checkout webhooks, Vercel deploys, large hiring pool. Alternative Vite SPA rejected – poor SEO for discovery.
- **Tailwind CSS + shadcn/ui (Radix primitives)**
  Why: Fast mobile-first styling, accessible components out-of-box, themable via CSS variables for brand identity, avoids building dropdown/dialog/sheet from scratch.
- **Zustand + URL search params**
  Why: Cart in Zustand persisted to localStorage (guest-first). Filters in URL (`?size=M&maxPrice=50&sort=new`) – shareable, back-button safe. No Redux overhead.
- **React Hook Form + Zod**
  Why: Checkout/address/returns forms with validation, fewer bugs.
- **next/image**
  Why: Auto-resize/compress fashion photos, critical for mobile <3s LCP.

### 1.2 Backend / Data
- **DB: Supabase Postgres (as managed Postgres only)**
  Why: You get backups, pooling (`pooler.supabase.com:6543`), dashboard, but we bypass PostgREST/RLS for app writes and use Drizzle ORM + `DATABASE_URL` directly. This keeps Better Auth + app tables in one schema. Start with `data/products.json` → `drizzle/seed.ts` → Supabase.
  Tables: `collections, products, variants, orders, order_items, returns` + Better Auth tables: `user, session, account, verification` (auto via `better-auth` Drizzle adapter).
- **Auth: Better Auth (`better-auth` npm, `lib/auth.ts` + `lib/auth-client.ts`)**
  Why vs Supabase Auth/Clerk/Auth0: self-hosted in Next.js API routes (`/api/auth/[...all]`), TS-first, supports guest-checkout (anonymous link later to full account), email/password + email-OTP/magic-link + Google OAuth, easy `useSession()` client. No per-MAU fee. Must-do: set `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, Drizzle adapter to same Supabase Postgres; turn OFF Supabase Auth providers to avoid confusion; sessions = database sessions (7-day, updateAge 24h).
  MVP flow: guest can buy (order by email); optional login for tracking/history; Phase 4 adds OTP + Google.
- **Storage: Cloudflare R2**
  Why vs Supabase Storage: $0 egress (Supabase charges after quota – deadly for image-heavy fashion), S3 API (`@aws-sdk/client-s3`), Cloudflare CDN cache in front, custom domain `cdn.brand.com`. Structure: `products/{slug}/1.jpg`, `collections/*.jpg`. Upload: admin-only presigned PUT (`POST /api/uploads/sign`), public read via CDN. `next/image` with `remotePatterns: [cdn.brand.com]`. Image variant flow: upload original → serve resized via `next/image` or Cloudflare Polish/Transforms (optional paid). Recommendation: keep originals <1.5MB, export 1200px WebP/AVIF at build/upload time with `sharp`.

Core tables (MVP):
`collections(id, slug, title, image)` / `products(id, slug, title, description, fabric, care, price, compare_at_price, collection_id, rating, created_at)` / `variants(id, product_id, size, color, sku, stock)` / `orders(id, status, email, phone, user_id?, address_json, subtotal, shipping_fee, total, payment_ref)` / `order_items(id, order_id, variant_id, qty, unit_price)` / `returns(id, order_id, reason, status)`

Order state: `pending_payment → confirmed → packed → shipped → delivered` + `failed / refunded / returned`.

### 1.3 Payments, Shipping, Comms
- **Payments: Stripe Checkout (default)**
  Why: PCI-compliant hosted page, cards + Apple/Google Pay, webhooks for order confirmation, test mode. If region is NG/KE/GH: use **Paystack or Flutterwave** for cards/bank/mobile-money; add **Cash on Delivery** toggle if needed. Decision required – see PRD §12.
- **Shipping:** Manual zones table for MVP (`zone, fee, eta_days`), 3rd-party courier later. No live-rating API in MVP.
- **Comms:** Resend (email) + SMS/WhatsApp via Termii/Twilio (region-dependent) for confirmation + tracking. Start with email + order-ID lookup page.

### 1.4 Hosting / DevOps
- **Vercel (frontend + API routes incl. Better Auth) + Supabase Postgres (DB) + Cloudflare R2 (images)**
  Why: Vercel native for Next.js (previews, rollback); Supabase only for Postgres (pooling); R2 for $0-egress CDN. Env needed: `DATABASE_URL`, `BETTER_AUTH_SECRET/URL`, `R2_ACCOUNT_ID/ACCESS_KEY/SECRET/BUCKET/PUBLIC_URL`, payment + Resend keys.
- **GitHub + GitHub Actions:** lint → typecheck → test → build → preview deploy. Branch protection on `main`.
- **Cloudinary (optional future)** only if you need AI background removal/try-on; not needed with R2 + next/image for MVP.

### 1.5 Quality
- **ESLint + Prettier + TypeScript strict**
- **Vitest (unit) + Playwright (e2e: browse → PDP → cart → checkout mock)**
- **PostHog (product analytics) + GA4 (marketing) + Sentry (errors)**
  Why: PostHog for funnel (PDP→cart→pay) without heavy setup; Sentry to catch checkout failures.

---
## 2. Design System – Phase 1 Foundation

Goal: Look stylish/confident + affordable-premium, not cheap. Trust through consistency.

### 2.1 Brand tokens (proposed, tweak with real brand name/logo)
- **Colors:** Base neutrals `Sand #F6F3EF / Ink #171717 / Stone #8A8A8A`; Accent `Bold Berry #C81D5E` or `Electric Indigo #3B2CFF` (pick 1); Success #178A4E, Warning #B7791F, Danger #C0392B. WCAG AA contrast on text/buttons.
- **Typography:** Display: `Sora` or `Space Grotesk` (youthful-bold for hero); Body: `Inter` (legible, free). Scale 12/14/16/20/24/32/48. Line-height 1.5 body, 1.1 display.
- **Spacing/radius/shadow:** 4pt scale; radius 12 cards, 999 pills; soft shadow `0 8px 30px rgba(0,0,0,.08)`.
- **Imagery rules:** 4:5 product shots on light background, 2nd slide on-model, no heavy filters. Alt text required.

Implemented as Tailwind theme + CSS vars in `app/globals.css` + `tailwind.config.ts`. Single source of truth, dark-mode-ready (defer).

### 2.2 Components (build once in `components/ui` + `components/shop`)
`Button, Input, Select, Badge, Price, RatingStars, ProductCard, CollectionCard, FilterSheet, SortMenu, SizeSelector + SizeGuideModal, ImageGallery + Zoom, CartDrawer, QtyStepper, CheckoutSteps, OrderTracker, EmptyState, FAQAccordion, TrustBar (shipping/returns/quality icons)`

Each: props → a11y (keyboard, focus, aria) → responsive (360px first) → Storybook-style preview page `/design` for review (no Storybook dep in MVP).

### 2.3 Key screens (wireframe → hi-fi)
Landing → Collection listing → PDP → Cart drawer → Checkout (3 steps) → Confirmation/Tracking → Returns/Size Help + Policy pages. Prototype in Figma (free) then code; keep Figma link in README.

Deliverable Phase 1: `/design` page live + Figma + tokens merged.

---
## 3. Phased Delivery Plan

### Phase 0 – Lock scope (2-3 days, no code)
- Answer PRD §12: brand name, categories, price range, region/currency, payments, shipping zones/fees, returns window, guest vs login.
- Freeze MVP catalog structure (collections, sizes XS-XL, colors).
- Define content needs: 5-10 real products with photos/copy for pilot.
- Exit: decisions logged in `docs/DECISIONS.md`.

### Phase 1 – Design system + static prototype (1 week)
- Init: `npx create-next-app --ts --tailwind --app`, add shadcn/ui, ESLint/Prettier, `globals.css` tokens.
- Build tokens + 15 components above + `/design` preview.
- Static pages with `products.json`: landing, listing, PDP.
- Perf budget: LCP <2.5s on Moto G4 emulation, images <200KB.
- Exit: Vercel preview URL reviewed on mobile.

### Phase 2 – Shop core (browse → cart) (1-1.5 weeks)
- Listing: search, filter (size/price/color/availability), sort, pagination, URL-synced.
- PDP: gallery, variant availability per size, price/stock/ETA, related items, size guide modal.
- Cart: drawer + page, Zustand + localStorage, promo code stub.
- Empty states, out-of-stock handling, analytics events (`view_item, add_to_cart`).
- Tests: Vitest for price/filter utils + Playwright browse→add.
- Exit: Can find <budget item in <2 min (hallway test).

### Phase 3 – Checkout + payments + orders (1.5-2 weeks)
- Supabase schema + seed; migrate from JSON.
- Checkout: contact → shipping (zones table) → payment (Stripe/Paystack Checkout) → review. RHF+Zod validation, idempotency key to prevent double-charge.
- Webhook → create `orders` + decrement stock transactionally; failure → retry + `failed` status.
- Confirmation page + email (Resend) with order ID + ETA; tracking page `/track?order=XYZ`.
- Tests: webhook happy/fail, stock race, e2e checkout with test card.
- Exit: Test payment → order → email works end-to-end.

### Phase 4 – Trust loop: delivery, returns, support (1 week)
- Account-lite: lookup by order ID + email (no password MVP); auth later.
- Returns: policy page + request form → `returns` table + admin email; size-guide content + FAQ.
- Reviews basic (rating + text, moderated flag).
- Support: WhatsApp/email link, contact page, 404/500 pages.
- Exit: Return request → acknowledgment; tracking statuses manually updatable in Supabase dashboard.

### Phase 5 – Hardening + launch pilot (1 week)
- A11y audit (axe), SEO (metadata, sitemap, OG), PWA manifest, Sentry, PostHog funnels.
- Perf: ISR (`revalidate 3600`), image audit, Lighthouse ≥90 mobile.
- Legal: Terms, Privacy, Shipping/Returns pages (template + local review).
- Pilot with 10-20 users, measure PRD §10 metrics, fix top 5 drop-offs.
- Exit: `main` tagged `v1.0-mvp`, runbook in README.

### Phase 6 – Post-MVP (parked, prioritize by data)
Wishlist, login/OTP + order history, promo/loyalty, Algolia search, multi-currency/i18n, admin dashboard (or Medusa), native wrapper, personalization.

Total estimate for solo/small team: **5-7 weeks to pilot** assuming content/photos ready. Add 1-2 weeks if brand/photos pending.

---
## 4. Repo Structure (target)
```
FASHION PROJECT/
├── app/ (routes: / /collections/[slug] /product/[slug] /cart /checkout /confirm /track /returns /design)
├── components/ui/ + components/shop/
├── lib/ (supabase, cart-store, money, filters)
├── data/products.json (mock → seed.sql later)
├── e2e/ + __tests__/
├── docs/ (BRIEF, PRD, this plan, DECISIONS.md)
└── README.md (setup, scripts, deploy)
```

---
## 5. Recommendations (beyond code)
1. **Content beats code:** Invest in consistent on-model photos + fabric/care copy; trust = returns drop.
2. **Size accuracy:** Publish measured cm/inch chart early; track `size-return rate` as North Star for fit.
3. **Pricing transparency:** Show shipping upfront, no surprise fees at pay – #1 abandonment killer.
4. **SEO/social:** Collection pages with real copy + Instagram/TikTok links; OG images per collection.
5. **Support shortcut:** WhatsApp button on PDP/cart for MVP – cheap, converts well for fashion.
6. **Legal:** Get local review of payments/taxes/returns before launch.
7. **Analytics discipline:** Only 5 events MVP: `view_item, add_to_cart, begin_checkout, purchase, request_return`.
8. **Security:** Never store cards; RLS on Supabase; rate-limit checkout; validate webhooks.

## 6. Risks + Mitigations
- Photos not ready → Use placeholders + lock image spec now; don’t code PDP zoom twice.
- Payment region mismatch → Confirm Stripe vs Paystack/Flutterwave in Phase 0; abstract `lib/payments.ts`.
- Oversell → DB transaction on stock decrement; show low-stock badge ≤3 left.
- Scope creep (loyalty/AI styling) → Park to Phase 6; enforce MVP checklist in PR reviews.

## 7. What I Need From You to Start Phase 0→1
Brand name/logo, 5 sample products (name/price/sizes/photos), region/currency, payment choice, shipping fees/ETAs, returns window. With those I can scaffold Next.js + design system + mock catalog immediately.

---
## 8. Appendix – Alternatives Considered
- **Shopify Starter:** Faster if you want no-code admin + payments, but monthly cost + less custom UX + lock-in. Revisit if team has zero dev capacity.
- **Medusa + Next storefront:** Better for multi-region/scale, but overkill for <200 SKUs MVP.
- **Firebase:** Good auth, weaker joins for variants/orders vs Postgres.

*Next action: confirm §0 decisions, then I scaffold repo + `/design` preview.*
