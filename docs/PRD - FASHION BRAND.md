# PRD – Fashion Brand E-Commerce Experience
**Status:** Draft v1.0 – for review
**Source:** `docs/PROJECT BRIEF - FASHION BRAND.md` + `README.md`
**Date:** 2026-09-26

## 1. Overview
Build a simple, enjoyable online shopping experience for an affordable fashion brand targeting young adults, students, and working professionals.

Tagline (from README): Affordable, fashionable, good-quality clothing for shoppers who want to look stylish and confident without overspending.

Current repo state: docs-only, no code yet. This PRD defines MVP to move to prototype.

## 2. Objectives
1. Help customers discover the brand and trust it for consistent quality.
2. Help customers find clothing that matches style + budget quickly.
3. Provide end-to-end journey: Discover → Browse → Choose style/size → Details → Order → Pay → Receive.
4. Keep shopping convenient, with clear delivery, returns, and size help.

## 3. Target Users
- Young adults (18-35)
- Students (price-sensitive, trend-driven)
- Working professionals (need smart-casual / everyday wear, convenience)
- Shared traits: budget-conscious, value style + quality, mobile-first, want trusted brand.

User needs:
- Look stylish/confident without spending too much
- Filter by style, size, price, suitability
- Trust quality consistency + convenient shopping

## 4. Problem Statement
Many customers struggle to find clothing that is simultaneously fashionable, affordable, good quality, and suitable for personal style. They also struggle to identify a brand they can trust for consistent quality and convenient shopping.

## 5. MVP Scope

### In Scope (from README MVP checklist)
1. **Brand landing / discovery page**
   - Hero, value props (affordable / stylish / quality), featured collections, testimonials/trust signals
2. **Collection browsing + search/filter**
   - Category browse (e.g. Tops, Bottoms, Dresses, Outerwear – TBD), search, filter by size, price, color, style, availability, sort by new/popular/price
3. **Product details**
   - Images (multi-angle), sizes + size guide, price, availability/stock, description/fabric/care, related items
4. **Cart + checkout + payment**
   - Add/update/remove, guest checkout, address entry, shipping options, payment (card/mobile money – TBD by region), order summary
5. **Order confirmation + delivery info**
   - Confirmation page/email/SMS, order tracking, delivery estimate
6. **Returns / size help**
   - Size guide, exchange/return policy, return request flow

### Out of Scope for MVP
- Loyalty program, wishlist 2.0, advanced personalization/AI styling
- Multi-vendor marketplace, in-store POS
- Native mobile apps (MVP = responsive web first, unless decided otherwise)
- Multi-currency / multi-language (unless region requires)

## 6. Main Journey + Requirements

### J1: Discover brand
- Landing loads <3s on mobile, clear CTA to shop collections.
- SEO basics, social links, brand story.

### J2: Browse collections
- Grid/list view, pagination, out-of-stock badges.
- Filters persist, empty-state helpful (“Try removing filters”).
- Acceptance: user can find an item under budget in <2 min.

### J3: Choose style & size + view details
- Size selector with availability per size, size guide modal.
- Price, discount, stock indicator, delivery estimate.
- Image zoom, mobile swipe.

### J4: Place order
- Cart drawer/page, quantity edit, promo code (optional MVP).
- Checkout: contact → shipping → payment → review.
- Validation, error handling, prevent double-order.

### J5: Make payment
- Payment provider TBD (see Open Questions). Must support failed-payment retry, receipt.
- No card data stored on own servers; use PCI-compliant provider.

### J6: Receive conveniently
- Confirmation with order ID, email/SMS.
- Track status: Confirmed → Packed → Shipped → Delivered.
- Delivery info page + support contact.

### J7: Post-purchase (trust loop)
- Easy returns/exchanges, size help FAQ, review/rating (basic MVP).
- Support channel (WhatsApp/email/chat – TBD).

## 7. Functional Requirements Summary
- FR1: CMS/admin to add/edit products, prices, stock, collections (minimal admin, can be static JSON for prototype).
- FR2: Search + filter + sort.
- FR3: Product PDP with variants (size/color).
- FR4: Cart persistence (localStorage for prototype, account later).
- FR5: Checkout + payment integration + order creation.
- FR6: Order history / tracking via order ID + email (no login required for MVP).
- FR7: Returns request form + policy page.
- FR8: Responsive mobile-first UI, accessible (contrast, keyboard, alt text).

## 8. Non-Functional Requirements
- Performance: LCP <2.5s, mobile-friendly.
- Usability: 3-clicks to product, 5 steps max checkout.
- Reliability: stock accuracy, no oversell.
- Security: HTTPS, PCI via provider, PII protection.
- Scalability: start static + serverless, easy to add backend.
- Trust: consistent imagery, clear pricing, transparent shipping/returns.

## 9. User Stories (MVP sample)
1. As a student, I can filter tops under $X in size M so I stay in budget.
   - AC: filter applies, count shown, clear filters.
2. As a shopper, I can view size guide on PDP so I choose correct size.
   - AC: guide opens, measurements in cm/inch.
3. As a guest, I can checkout without account so I buy quickly.
   - AC: order placed, confirmation ID shown/sent.
4. As a buyer, I can track delivery so I know when clothes arrive.
   - AC: status + ETA visible from order ID.
5. As a buyer, I can request return so I trust quality promise.
   - AC: policy visible, form submitted, acknowledgment.

## 10. Success Metrics
- Conversion: visitor → PDP → cart → purchase (target TBD, e.g. >1.5% MVP)
- Avg. time to find + order, cart abandonment rate
- Return rate due to size, CS contacts per order
- NPS / repeat purchase intent, trust rating
- Page load, checkout drop-off

## 11. Assumptions
- Responsive website first (not native app).
- Single region + currency for MVP.
- Small catalog (<200 SKUs), simple size runs (XS-XL).
- Manual fulfillment + 3rd-party delivery initially.

## 12. Open Questions – Need Decision
1. Project type: website / mobile app / Instagram/WhatsApp store?
2. Brand name, categories, price range, regions/currency?
3. Payment methods: card, mobile money, cash on delivery?
4. Shipping: zones, fees, timelines, provider?
5. Returns window + who pays return shipping?
6. Auth: guest-only MVP or login? Order tracking method?
7. Tech stack preference? Admin/CMS need?
8. Content: product photos/copy ready?

## 13. Next Steps (per README Getting Started)
1. Answer §12 open questions.
2. Lock MVP screens from Main Journey.
3. Design wireframes → prototype.
4. Implement prototype (frontend + mock checkout), then pilot.

## 14. Technology Decisions (locked)
- **Web:** Next.js 14 App Router + TypeScript + Tailwind CSS + shadcn/ui, hosted on Vercel.
  Why: SEO/ISR for brand discovery, `next/image` for fashion photos, single mobile-first codebase. Rejected Vite SPA (poor SEO) and Shopify (cost/lock-in for MVP).
- **Database:** Supabase Postgres (DB-only, Auth/Storage disabled).
  Why: Managed Postgres with pooling/backups for products → variants → orders → returns joins; used as pure Postgres via `DATABASE_URL` + Drizzle ORM. Rejected Firebase (weak joins).
- **Auth:** Better Auth (with Drizzle adapter to Supabase Postgres).
  Why: TS-first, self-hosted in Next.js (`/api/auth/[...all]`), supports email/password + magic-link/OTP + Google + guest-checkout linking, sessions in our own DB, no per-MAU fee. More flexible than Supabase Auth; cheaper than Clerk/Auth0. Supabase Auth stays OFF to avoid dual user tables.
- **Files / Storage:** Cloudflare R2 + Cloudflare CDN (`cdn.yourbrand.com`).
  Why: S3-compatible, $0 egress (critical for image-heavy fashion), global CDN, presigned admin uploads, served via `next/image` remote loader. Rejected Supabase Storage (egress costs) and Cloudinary for MVP (cost).
- **Payments:** Stripe Checkout default; Paystack/Flutterwave if NG/KE/GH; COD toggle optional, abstracted in `lib/payments.ts`.
  Why: PCI-safe hosted page + webhooks; regional providers cover mobile-money/bank where Stripe is weak.
- **Email:** Resend + React Email.
  Why: Next.js-native transactional templates (confirmation/shipping/returns); simpler DX than SendGrid for MVP.
- **SMS / WhatsApp:** Twilio global SMS or Termii/Africa's Talking regionally; WhatsApp Cloud API (or Twilio WhatsApp) for order updates + support button.
  Why: Higher open rates than email for delivery updates; WhatsApp support converts well for fashion.

## 15. Design Changes (Phase 1 palette update)
- Changed palette from Sand/Ink/Berry (`#F6F3EF / #171717 / #C81D5E`) to **Forest #1B4332 / Charcoal #24272B / Steel #6E7B8B / Light #F4F5F3** (Forest dark #143325, Forest light #E4EDE6).
  Why: Calmer, premium, trustworthy feel for affordable fashion; better fit forforest-green brand direction requested by stakeholder.
- Usage: Light page background, Charcoal text/headings, Steel muted/meta/secondary text, Forest primary CTAs, sale badges, logo accent, focus rings.
- Applied to: `tailwind.config.ts` (new `forest/charcoal/steel/light` tokens + legacy `sand/ink/stone2/berry` aliases), `app/globals.css` (`bg-light/text-charcoal`, `bg-forest` buttons), layout header/footer, Button/Badge/Price, ProductCard, TrustBar, SizeGuide, `/`, `/collections`, `/product/[slug]`, `/design`, and `docs/DESIGN-PREVIEW.html`.
- No layout, copy, journey, or scope changes; tokens-only update. Legacy aliases retained so existing `bg-sand/text-berry`-style classes still resolve to the new values.

---
*Derived from PROJECT BRIEF - FASHION BRAND.md: Users (young adults/students/professionals), Problem (fashionable+affordable+quality+personal style + trust), Main Journey (discover→browse→choose→details→order→pay→receive).*
