# Phase 1 — Done (static prototype, terminal was unavailable so build not run)

## What was built
- Next.js 14 + TS + Tailwind scaffold: `package.json`, `tsconfig.json`, `next.config.mjs`, `tailwind.config.ts`, `postcss.config.mjs`, `.gitignore`
- Design tokens in `app/globals.css`: Sand #F6F3EF / Ink #171717 / Berry #C81D5E, Sora + Inter, radius 12, soft shadow, `.btn-primary/.btn-secondary/.card/.badge/.input`
- UI primitives: `components/ui/button.tsx`, `badge.tsx`, `price.tsx`, `rating.tsx`
- Shop components: `ProductCard.tsx`, `TrustBar.tsx`, `SizeGuide.tsx` (interactive)
- Mock catalog: `data/products.json` (6 products) + `lib/products.ts`, `lib/money.ts`, `lib/cn.ts`
- Pages: `/` landing (hero + collections + popular), `/collections` list, `/product/[slug]` PDP with variants + size guide + related, `/design` system preview
- Stack alignment: DB = Supabase Postgres (not wired yet — Phase 3), Auth = Better Auth (Phase 4), Storage = Cloudflare R2 (images currently Unsplash placeholders with `cdn.yourbrand.com` allowlisted in `next.config.mjs`)

## How to run (you need to — my terminal is blocked: `spawn UNKNOWN`)
1. `cd "C:\Users\USER\Documents\FASHION PROJECT"`
2. `npm install`
3. `npm run dev` → open http://localhost:3000, /collections, /product/everyday-tee-sand, /design
4. `npm run build` to verify; expected: no errors (only `next/image` eslint bypass via img tags in Phase 1)

## Exit criteria check
- [x] Tokens + 7 components + `/design` preview
- [x] Static landing/listing/PDP from JSON
- [ ] Perf/Lighthouse + Vercel preview — do after `npm run build` + deploy
- [ ] `npm run lint`/`typecheck` — blocked here, run locally

## Next (Phase 2)
Search/filter/sort URL-synced, Zustand cart + drawer, PDP add-to-cart, Vitest + Playwright.
