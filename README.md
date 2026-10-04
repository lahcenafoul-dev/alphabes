# AlphaBes

Learn Letters. Learn Sounds. Learn English. — Next.js 14 + TypeScript + Tailwind + PostgreSQL/Prisma.

## What's implemented in this pass

This is a real, working foundation, not a mockup — every file here runs.

- **App shell**: root layout, fonts (Baloo 2 display / Nunito body), global styles, org-level JSON-LD, skip-link, focus-visible styling, reduced-motion support.
- **Homepage** (`/`): all 7 required sections, real copy, FAQ schema.
- **Alphabet system**: `/alphabet` index + `/alphabet/[letter]` dynamic route with `generateStaticParams` for all 26 letters. All 26 letters are fully authored (sound, IPA, 4 example words, FAQ) in `lib/letters-data.ts`.
- **Worksheets** (`/worksheets`): category filter UI + card grid built directly against the `Worksheet`/`WorksheetCategory` Prisma shape, so swapping the placeholder array for a `prisma.worksheet.findMany()` call is a one-line change.
- **Pricing** (`/pricing`): Pro Monthly ($7.99) and Pro Annual ($59), checkout through PayPal Subscriptions.
- **Auth**: NextAuth credentials provider backed by Prisma + bcrypt, JWT sessions, role on the token.
- **Billing (PayPal Subscriptions)**: `/api/paypal/subscribe` (plan names only from the browser, redirect to PayPal), `/api/paypal/webhook` (signature verified with PayPal, idempotent via `PaymentEvent`), `/api/paypal/cancel`; `lib/billing/sync.ts` copies PayPal's state into `Subscription`, `lib/billing/entitlement.ts` decides Pro on the server. Pro unlocks the premium games (play pages), premium stories and whole-bundle PDFs (private R2 bucket). Plan, setup and launch steps: `docs/paypal-plan.md`.
- **Database**: complete `prisma/schema.prisma` covering every entity in the spec (User, Parent/Child, Letter, Lesson, PhonicsLesson, Worksheet(+Category), Game, Flashcard, Activity, Progress, Subscription, BlogPost, Category), with indexes and cascades.
- **SEO**: `app/sitemap.ts` (all static routes + all 26 letters, extensible to blog/worksheets), `app/robots.ts`, per-page canonical URLs, Open Graph, and JSON-LD (Organization, LearningResource, BreadcrumbList, FAQPage).
- **Security**: `middleware.ts` protects `/dashboard` and `/admin`, gates `/admin` to the `ADMIN` role, and rate-limits the credentials login callback. Security headers set in `next.config.js`. PayPal plan IDs stay on the server; the browser only sends a plan name.
- **Privacy**: `ChildProfile` intentionally stores only a first name and an age band — no photos, no contact info, no location, in line with COPPA-conscious design for a children's product.
- **Parent dashboard** (`/dashboard`, `/dashboard/[id]`): lists child profiles and, per child, lessons completed, quiz average, stories read, and full quiz results grouped by lesson/game/activity.
- **Blog** (`/blog`): 7 full articles in `lib/blog-data.ts`, rendered as index + detail pages with Article JSON-LD.
- **Static/legal pages**: `/about`, `/contact` (working form posting to `/api/contact`), `/privacy`, `/terms`, `/cookies` — privacy/terms are flagged in-page as placeholder pending legal review.

## What is not built yet

- **Admin panel** (`/admin`) — the role gate is already enforced in `middleware.ts`; it needs CRUD screens (forms + server actions) per model.

The games, the French, Spanish and Portuguese versions (see `docs/*-plan.md`) and the Pro downloads (private R2 bucket, `docs/paypal-plan.md`) are built.

## Database

Neon PostgreSQL through Prisma with the Neon driver adapter; the rules are in `CLAUDE.md` (Database). In short:

- `.env` points at the Neon `dev` branch. Never use a real branch (or `DATABASE_URL`) as a shadow database, and never run `prisma migrate dev`, `migrate reset` or `db push` against one: a shadow database is wiped.
- Write a migration by hand or with `npx prisma migrate diff --from-schema-datamodel <old schema> --to-schema-datamodel prisma/schema.prisma --script` (no database), save it under `prisma/migrations/<timestamp>_<name>/migration.sql`, and apply it with `npx prisma migrate deploy` (to `dev`; production is migrated by the owner after a Neon backup).
- `npx prisma generate` after changing the schema.

`prisma/schema.prisma` is the source of truth — see comments inline for design notes (e.g. why `ChildProfile` is minimal, why `Progress` is a single polymorphic ledger rather than three parallel tables).

## Environment variables

Copy `.env.example` to `.env` and fill in real values. Required for a working deploy: `DATABASE_URL`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, `NEXT_PUBLIC_APP_URL`, the `PAYPAL_*` values (see `docs/paypal-plan.md`), and the `S3_*` values once worksheet downloads are wired up.

## Deployment (Cloudflare Workers)

The site runs on Cloudflare Workers, built with OpenNext (`@opennextjs/cloudflare`); see `CLAUDE.md` (Hosting).

1. **Deploys are automatic:** Workers Builds builds and deploys the `alphabes` worker on every push to `main`. Never deploy from a local Windows machine (`npm run deploy`, `wrangler deploy`).
2. **Database changes:** production is migrated by the owner with `npx prisma migrate deploy`, after a Neon backup branch, before the code that needs it is deployed.
3. **Settings:** runtime secrets (`DATABASE_URL`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, `PAYPAL_*`, email and cron secrets) are set in the Cloudflare dashboard (Workers & Pages → alphabes → Settings → Variables and Secrets) and take effect once deployed; `NEXT_PUBLIC_APP_URL` is a build variable (Settings → Build).
4. **Billing and Pro files:** PayPal app, plans and webhook (`scripts/paypal/setup-plans.mjs`, `scripts/paypal/setup-webhook.mjs`), and `node scripts/upload-pro-files.mjs` for the private R2 bucket; see `docs/paypal-plan.md`.
5. **Search Console:** resubmit `https://alphabes.com/sitemap.xml` after adding pages.

## Testing strategy

- **Unit** (Vitest): pure logic — `lib/letters-data.ts` lookups, the Pro entitlement rules, PayPal subscription sync and webhook idempotency (`tests/billing`), progress aggregation helpers.
- **Integration**: API routes against a throwaway test database (never `dev` or production) — auth flow, subscribe route rejecting unknown plans, webhook signature verification.
- **E2E** (Playwright): critical paths — register → free lesson → hit a paywall → checkout (PayPal sandbox) → dashboard shows Pro; keyboard-only navigation through an alphabet lesson for accessibility regression coverage.
- **Accessibility**: axe-core scan in CI on `/`, `/alphabet/a`, `/worksheets`, `/pricing`.
- **Visual**: no snapshot testing on the letter-block grid until the games are built, since interactive canvas/animation content isn't well served by pixel diffs.

## Tech stack

Next.js 14 (App Router) · TypeScript · Tailwind CSS · PostgreSQL · Prisma · NextAuth · PayPal Subscriptions · Cloudflare R2.
