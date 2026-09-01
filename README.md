# AlphaBes

Learn Letters. Learn Sounds. Learn English. — Next.js 14 + TypeScript + Tailwind + PostgreSQL/Prisma.

## What's implemented in this pass

This is a real, working foundation, not a mockup — every file here runs.

- **App shell**: root layout, fonts (Baloo 2 display / Nunito body), global styles, org-level JSON-LD, skip-link, focus-visible styling, reduced-motion support.
- **Homepage** (`/`): all 7 required sections, real copy, FAQ schema.
- **Alphabet system**: `/alphabet` index + `/alphabet/[letter]` dynamic route with `generateStaticParams` for all 26 letters. Letters **A, B, C** are fully authored (sound, IPA, 4 example words, FAQ) as the content pattern; **D–Z** render with correct letterforms/slugs today and are structured to receive the same content with no code changes (see `lib/letters-data.ts`).
- **Worksheets** (`/worksheets`): category filter UI + card grid built directly against the `Worksheet`/`WorksheetCategory` Prisma shape, so swapping the placeholder array for a `prisma.worksheet.findMany()` call is a one-line change.
- **Pricing** (`/pricing`): real plan data, posts to a working Stripe Checkout route.
- **Auth**: NextAuth credentials provider backed by Prisma + bcrypt, JWT sessions, role on the token.
- **Stripe**: `/api/stripe/checkout` (server-validated price IDs, creates/reuses a Customer) and `/api/stripe/webhook` (verifies signature, syncs `Subscription` on checkout/renewal/cancel).
- **Database**: complete `prisma/schema.prisma` covering every entity in the spec (User, Parent/Child, Letter, Lesson, PhonicsLesson, Worksheet(+Category), Game, Flashcard, Activity, Progress, Subscription, BlogPost, Category), with indexes and cascades.
- **SEO**: `app/sitemap.ts` (all static routes + all 26 letters, extensible to blog/worksheets), `app/robots.ts`, per-page canonical URLs, Open Graph, and JSON-LD (Organization, LearningResource, BreadcrumbList, FAQPage).
- **Security**: `middleware.ts` protects `/dashboard` and `/admin`, gates `/admin` to the `ADMIN` role, and rate-limits the credentials login callback. Security headers set in `next.config.js`. Stripe price IDs are validated server-side, never trusted from the client.
- **Privacy**: `ChildProfile` intentionally stores only a first name and an age band — no photos, no contact info, no location, in line with COPPA-conscious design for a children's product.

## What is deliberately not built yet

Building all of the following with real content in one pass would mean inventing placeholder statistics, testimonials, or thin content — which the brief explicitly forbids. Each is architected and ready to fill in:

1. **Letters D–Z content** — add entries to the `authored` map in `lib/letters-data.ts` (or, once the admin panel exists, via the `Letter` table) using the exact shape already defined by A/B/C.
2. **Games** (`/games`, 5 game types) — `GameType` enum and `Game` model exist; each game is a client component reading its `config` JSON. Build one (e.g. Find the Letter) as the reference implementation, then the rest follow the same pattern.
3. **Full dashboard** (`/dashboard`) — `Progress` model is in place; needs a server component querying a child's `Progress` rows grouped by lesson/game/activity.
4. **Admin panel** (`/admin`) — role gate is already enforced in `middleware.ts`; needs CRUD screens (forms + server actions) per model.
5. **Blog** (`/blog`) — `BlogPost`/`Category` models exist; needs MDX or rich-text rendering plus the 7 initial articles, written as genuine, non-AI-thin educational content.
6. **Remaining static pages** (`/about`, `/contact`, `/privacy`, `/terms`, `/cookies`) — straightforward content pages once legal copy is finalized (recommend real legal review for privacy/terms given this is a children's product).
7. **Object storage wiring** — `.env.example` documents S3 vars; add a small `lib/storage.ts` using the included `@aws-sdk/client-s3` dependency to generate signed URLs for premium worksheet PDFs, checked against `Worksheet.isPremium` + the user's `Subscription.status`.

## Database

```bash
npx prisma migrate dev --name init
npx prisma generate
```

`prisma/schema.prisma` is the source of truth — see comments inline for design notes (e.g. why `ChildProfile` is minimal, why `Progress` is a single polymorphic ledger rather than three parallel tables).

## Environment variables

Copy `.env.example` to `.env` and fill in real values. Required for a working deploy: `DATABASE_URL`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, `NEXT_PUBLIC_APP_URL`, the four `STRIPE_*` values, and the `S3_*` values once worksheet downloads are wired up.

## Deployment (Vercel + managed Postgres, e.g. Neon/Supabase/RDS)

1. Provision Postgres, set `DATABASE_URL`.
2. `npx prisma migrate deploy` against production.
3. Set all env vars from `.env.example` in the hosting platform.
4. Create Stripe Products/Prices for Pro Monthly ($7.99) and Pro Annual ($59); put their IDs in `STRIPE_PRICE_PRO_MONTHLY` / `STRIPE_PRICE_PRO_ANNUAL`.
5. Add a Stripe webhook endpoint pointing at `/api/stripe/webhook` for `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`; copy the signing secret into `STRIPE_WEBHOOK_SECRET`.
6. Point `alphabes.com` DNS at the deployment; verify domain in Google Search Console; submit `https://alphabes.com/sitemap.xml`.
7. Add `NEXT_PUBLIC_GA_MEASUREMENT_ID` and load Google Analytics via `next/script` in `app/layout.tsx` (`strategy="afterInteractive"`), gated behind a cookie-consent choice given `/cookies` targets the UK (PECR/UK GDPR) and US/Canada audiences.

## Testing strategy

- **Unit** (Vitest): pure logic — `lib/letters-data.ts` lookups, Stripe price-ID allow-listing, progress aggregation helpers.
- **Integration**: API routes against a test Postgres schema (`prisma migrate reset` in CI) — auth flow, checkout route rejecting unknown price IDs, webhook signature verification with Stripe's test fixtures.
- **E2E** (Playwright): critical paths — register → free lesson → hit a paywall → checkout (Stripe test mode) → dashboard shows Pro; keyboard-only navigation through an alphabet lesson for accessibility regression coverage.
- **Accessibility**: axe-core scan in CI on `/`, `/alphabet/a`, `/worksheets`, `/pricing`.
- **Visual**: no snapshot testing on the letter-block grid until the games are built, since interactive canvas/animation content isn't well served by pixel diffs.

## Tech stack

Next.js 14 (App Router) · TypeScript · Tailwind CSS · PostgreSQL · Prisma · NextAuth · Stripe · S3-compatible object storage.
