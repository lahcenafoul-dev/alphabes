# PayPal Subscriptions for AlphaBes: plan and status

Last updated: 2026-10-04 (**plan approved by the owner** with the changes in "Decisions"; phases 1–6 done, 1–5 pushed; waiting for the OK to push phase 6 and start phase 7). Read this first when continuing the billing work, together with CLAUDE.md. Any page work also follows the language rules in [french-plan.md](french-plan.md), [spanish-plan.md](spanish-plan.md) and [portuguese-plan.md](portuguese-plan.md).

## Goal

Replace the unused Stripe scaffolding (Stripe isn't available in Morocco) with **PayPal Subscriptions**: a monthly and a yearly AlphaBes Pro plan in USD, bought from the pricing page in English, French, Spanish and Portuguese, kept in sync by a verified, idempotent webhook, cancellable from the parent dashboard, with Pro features decided on the server. Sandbox first, then live.

Hard rules:
- **Secrets never printed**, never committed, never sent to the browser: `PAYPAL_CLIENT_ID`, `PAYPAL_CLIENT_SECRET`, `PAYPAL_WEBHOOK_ID`, `PAYPAL_PLAN_MONTHLY`, `PAYPAL_PLAN_YEARLY`, `PAYPAL_MODE` live only in `.env` (local, sandbox values) and in Cloudflare (Workers & Pages → alphabes → Settings → Variables and Secrets, then **deploy**). The checkout chosen below needs no PayPal value in the browser, so nothing goes in the build-time variables.
- **Database:** the migration is generated without a database (`prisma migrate diff --from-schema-datamodel … --to-schema-datamodel …`), applied to `dev` only with `prisma migrate deploy`. **Never a shadow database, never `migrate dev`/`reset`/`db push`.** Production is migrated by the owner, after a Neon backup branch, with the commands in "Launch".
- **Page output:** English, French, Spanish and Portuguese pages stay identical except the pages this plan changes on purpose (pricing, dashboard, legal pages, premium game pages, footer link to the refund page). Checked with the snapshot comparisons used for the language work.
- Never deploy from this Windows machine; deploys happen by pushing `main`.

## What exists today (checked 2026-10-03)

- `lib/stripe.ts`, `app/api/stripe/checkout/route.ts`, `app/api/stripe/webhook/route.ts`, the `stripe` package (16.9.0). Never configured: no Stripe variables in Cloudflare.
- The pricing page (`app/[locale]/pricing/page.tsx`) is static and reads `STRIPE_PRICE_*` at **build** time. Those are not build variables, so the "Choose" buttons never render on the live site; every plan shows "Start Free". Prices in the four message files: **$7.99/month, $59/year**.
- `Subscription` model: `plan` (`FREE`, `PRO_MONTHLY`, `PRO_ANNUAL`), `status` (Stripe's statuses), `stripeCustomerId`, `stripeSubscriptionId`, `currentPeriodEnd`. `/api/register` creates a `FREE` row for each new user.
- **Nothing is gated anywhere.** `isPremium` flags exist (3 games per language in `lib/games-data.ts`, `games-fr.ts`, `juegos-es.ts`, `jogos-pt.ts`; `Story.isPremium`, `Lesson`, `Worksheet`, … in the database) but only change a "Pro" badge and `isAccessibleForFree` in JSON-LD. The French game titles say *jeu éducatif gratuit* even for the premium ones. Bundle PDFs are generated in the browser (`components/worksheets/BundleDownloadButton.tsx`).
- Dashboard shows "Free Plan"/"Pro" from `subscription.plan` and an upsell. No billing section.
- Legal pages: `terms` and `privacy-policy` in 4 languages (English terms name Stripe; FR/ES/PT privacy policies say "provider being chosen, previously Stripe"), plus the old English-only `/privacy` page that names Stripe. **No refund page.**
- Wayalt (`Desktop/travel-project`) has a working sandbox PayPal integration to reuse: `lib/paypal/client.ts` (OAuth token + fetch wrapper), `subscriptions.ts` (create with redirect to PayPal's approve link, re-check on return), `webhooks.ts` (signature check through PayPal's verify API), setup scripts for product/plan and webhook. Gaps to fix here: no renewal handling, no idempotency, webhook re-serializes the JSON body before verifying (can fail verification), no cancel button, uses `Buffer`.

## What the owner creates in PayPal

Everything in the PayPal **developer dashboard** (developer.paypal.com, logged in with the existing Business account). The app's credentials are separate from wayalt's, so the two sites' webhooks and plans never mix.

### Sandbox (now)

1. **Apps & Credentials → Sandbox → Create App**: name `AlphaBes`, type *Merchant*, linked to a **new sandbox business account** (Testing Tools → Sandbox Accounts → Create account → Business, e.g. `alphabes-merchant@…`). Copy Client ID and Secret into `.env` yourself (I won't print or read them back):
   ```
   PAYPAL_MODE=sandbox
   PAYPAL_CLIENT_ID=...
   PAYPAL_CLIENT_SECRET=...
   ```
2. **Sandbox buyer accounts** (Sandbox Accounts → Create → Personal), one per test country so PayPal's pages appear in each language: US (English), France (French), Mexico (Spanish), Brazil (Portuguese). Note their passwords; they only hold fake money.
3. **Product and plans:** I add `scripts/paypal/setup-plans.mjs` (from wayalt's). You run it once per environment; it creates the product "AlphaBes Pro" and the plans (monthly, yearly, and in sandbox only a **daily test plan** to see renewals within a day), and writes the plan IDs into `.env` without printing them. You can also create them by hand in the sandbox business account (sandbox.paypal.com → Pay & Get Paid → Subscriptions); then paste the plan IDs into `.env` as `PAYPAL_PLAN_MONTHLY`, `PAYPAL_PLAN_YEARLY`.
4. **Webhook** (in the `AlphaBes` sandbox app → Webhooks → Add Webhook). For local tests the URL is a Cloudflare tunnel to `npm run dev` (`cloudflared tunnel --url http://localhost:3000`, URL + `/api/paypal/webhook`); for the check on alphabes.com it's `https://alphabes.com/api/paypal/webhook`. An app can have several webhooks; each has its own ID. Events:
   - `BILLING.SUBSCRIPTION.ACTIVATED`, `BILLING.SUBSCRIPTION.UPDATED`, `BILLING.SUBSCRIPTION.RE-ACTIVATED`
   - `BILLING.SUBSCRIPTION.SUSPENDED`, `BILLING.SUBSCRIPTION.PAYMENT.FAILED`
   - `BILLING.SUBSCRIPTION.CANCELLED`, `BILLING.SUBSCRIPTION.EXPIRED`
   - `PAYMENT.SALE.COMPLETED` (each renewal payment), `PAYMENT.SALE.REFUNDED`, `PAYMENT.SALE.REVERSED`

   Copy its **Webhook ID** into `.env` as `PAYPAL_WEBHOOK_ID`.

### Live (at launch, phase 8)

5. **Before anything else, check that the live Business account can receive money.** Moroccan PayPal accounts have historically been limited for receiving payments. Confirm on paypal.com (not the sandbox) that the account can receive a USD payment (for example a $1 payment from a friend's account) and that you can withdraw it. Also check that recurring payments are enabled for the account. If either fails, we stop here; the sandbox work is still useful but the launch waits.
6. **Apps & Credentials → Live → Create App** `AlphaBes` (same Business account).
7. **Product and plans in live:** run the setup script with the live credentials, or create them in paypal.com → Pay & Get Paid → Subscriptions. No daily test plan in live.
8. **Live webhook** `https://alphabes.com/api/paypal/webhook`, same events.
9. **Business account settings** (paypal.com → Account Settings): customer service email and website `https://alphabes.com`; soft descriptor (what appears on card statements) `ALPHABES`; payment receiving preferences: accept USD without asking.
10. Paste the live values into Cloudflare (Variables and Secrets, type *Secret* for all six) and **deploy** the new version.

## Decisions (made by the owner)

**2026-10-03: the owner approved B1–B9 with these choices, which override the recommendation column where they differ:**

- **B1 prices: keep $7.99/month and $59/year** (the prices already shown in the 4 languages; the yearly plan maps to `PRO_ANNUAL`).
- **B2** no free trial. **B3** server redirect to PayPal's hosted page.
- **B4** Pro unlocks premium games, premium stories and bundle downloads; individual worksheets and progress tracking stay free.
- **B5** cancel keeps Pro until the end of the paid period; **full refund within 14 days on the yearly plan only**; no refunds on the monthly plan.
- **B6** no plan switching in v1. **B7** sandbox test on alphabes.com, checkout limited to `ADMIN` accounts while `PAYPAL_MODE=sandbox`.
- **B8** update the old `/privacy` text, URL unchanged.
- **B9** seller in the terms: **"AlphaBes, operated by Lahcen Afoullousse, Morocco"**.

The table below is the original proposal, kept for reference.

| # | Topic | Recommendation | Alternatives |
|---|---|---|---|
| B1 | Prices | **$5.99/month and $39.99/year** (yearly ≈ $3.33/month, saves 44%, "about 5 months free"). Reasons: Pro today unlocks a modest library (3 games per language, premium stories, bundles), ABCmouse charges $12.99/$59.99 for far more; a large part of the audience pays in USD from Latin America, Brazil and French-speaking Africa, where $7.99/month is a lot; PayPal's fixed fee (≈ $0.49 + ~3.5–5% for international buyers) makes very low monthly prices inefficient, and the yearly plan is where most families of young children buy. Prices can be raised later for new subscribers only (new PayPal plans), existing subscribers keep theirs. | Keep **$7.99/$59** (no copy change in the 4 languages). Or $4.99/$39 (fees take ~15% of the monthly). |
| B2 | Free trial | **None at launch.** The free plan is the trial; PayPal trial cycles add states to handle. | 7-day trial on the yearly plan. |
| B3 | Checkout flow | **Server redirect to PayPal's hosted page** (as on wayalt): the pricing form posts `plan=monthly|yearly` to `/api/paypal/subscribe`, which checks the session, creates the subscription with `custom_id = user id` and the buyer's language, and redirects to PayPal. PayPal's page is shown in **en-US, fr-FR, es-MX, pt-BR** from the page's language (PayPal may still switch to the buyer's account language). The pricing page stays static, no PayPal script or ID in the browser, card payment is still offered by PayPal on its page where available. | PayPal JS SDK Smart Buttons on the pricing page (`intent=subscription`, `locale=`): in-page popup, but needs the client ID at build time, a third-party script on a static page, and a client-side `onApprove` call anyway. |
| B4 | What Pro unlocks (server-side) | **(a)** The 3 premium games per language: their pages stay static and indexable (title, text, JSON-LD with `isAccessibleForFree: false`), but the game itself moves to a dynamic, `noindex` play page that checks the session and subscription on the server and shows either the game or a paywall in the right language (`/games/[slug]/play`, `/fr/jeux/[slug]/jouer`, `/es/juegos/[slug]/jugar`, `/pt/jogos/[slug]/jogar`). The French titles of those 3 games drop *gratuit* (and the same in ES/PT if present). **(b)** Premium stories (`Story.isPremium`): the story reader is already per request; it checks Pro on the server. **(c)** Bundle downloads: the "download the whole bundle" button calls a server route that checks Pro before returning the bundle contents. **Stays free:** every individual worksheet and PDF, alphabet and phonics pages, free games, progress tracking (existing users have it today). Pricing features are rewritten to match exactly what is gated. | Also gate individual worksheets (hurts the pages that bring search traffic), or gate progress tracking (takes something away from current users). Or only gate games at first. |
| B5 | Cancel and refunds | **Cancel any time from the dashboard: renewals stop immediately, Pro stays until the end of the paid period.** Monthly: no refund for a partly used month. Yearly: full refund if asked within 14 days of the first yearly payment (also covers the EU 14-day withdrawal right); refunds made by you in PayPal; a full refund ends Pro at once (webhook `PAYMENT.SALE.REFUNDED`). New page **Refund policy** in 4 languages (`/refunds`, `/fr/remboursements`, `/es/reembolsos`, `/pt/reembolsos`), linked from the footer, pricing page and terms. | No refunds at all (weaker with PayPal buyer protection and EU rules). Or 7 days. |
| B6 | Changing plan | **Not in v1.** To go from monthly to yearly: cancel, then subscribe again after the paid month ends (the dashboard explains it). | PayPal's "revise subscription" API (proration and edge cases). |
| B7 | Testing on alphabes.com before going live | **Deploy first with sandbox credentials and `PAYPAL_MODE=sandbox`; in sandbox mode only `ADMIN` accounts may start a checkout** (others get "Subscriptions open soon"). Then switch the Cloudflare values to live. | Go straight to live after local sandbox tests. |
| B8 | Old English `/privacy` page | **Update its text** (replace Stripe by PayPal); URL unchanged. | Redirect it to `/privacy-policy` (changes an English URL). |
| B9 | Seller named in the terms | **"AlphaBes, operated by [your legal name], Morocco"** with the contact email; billing through PayPal. You give me the exact name. Legal review stays recommended (as already noted on the terms page). | Business name only. |

## Design

### Database (migration 1, additive, "expand")

```prisma
enum SubscriptionStatus { ... existing ..., APPROVAL_PENDING, SUSPENDED, EXPIRED }

model Subscription {
  ...existing fields (stripe* kept until migration 2)...
  paypalSubscriptionId String?   @unique
  paypalPlanId         String?
  canceledAt           DateTime?
  lastPaymentAt        DateTime?
  syncedAt             DateTime? // when we last copied PayPal's state
}

// One row per PayPal webhook event, so a retried or replayed event is never processed twice.
model PaymentEvent {
  id          String    @id        // PayPal event id (WH-...)
  type        String
  resourceId  String               // subscription or sale id
  receivedAt  DateTime  @default(now())
  processedAt DateTime?
  @@index([resourceId])
}
```

- Additive only, so the live site keeps working between the production migration and the deploy (the live Prisma client simply ignores the new columns, table and enum values).
- **Migration 2 ("contract"), after the PayPal version is live and stable:** drop `stripeCustomerId`, `stripeSubscriptionId` and their indexes. Separate because the code live at the time of migration 1 still selects those columns. Before it, a read-only check that both columns are empty in production.
- Plan names stay `PRO_MONTHLY` / `PRO_ANNUAL` (no rename; the yearly plan maps to `PRO_ANNUAL`).

### Server code

- `lib/paypal/client.ts`: OAuth token (cached per isolate, refreshed before expiry), `paypalFetch` wrapper, base URL from `PAYPAL_MODE`. Workers-safe (`btoa`, `fetch`, no `Buffer`). Errors never include secrets or full response bodies in logs.
- `lib/paypal/subscriptions.ts`: create (plan from a server-side map `monthly → PAYPAL_PLAN_MONTHLY`, `yearly → PAYPAL_PLAN_YEARLY`; the client never sends a plan ID), get, cancel (`POST /v1/billing/subscriptions/{id}/cancel`). `PayPal-Request-Id` on every write.
- `lib/billing/sync.ts`: **`syncSubscription(paypalId)` is the only code that writes billing state.** It fetches the subscription from PayPal (the source of truth) and copies status, plan, `billing_info.next_billing_time` → `currentPeriodEnd`, last payment time. The return page, the webhook and the cancel route all call it. Because it copies PayPal's current state instead of applying event deltas, out-of-order or repeated events converge to the right state. It refuses a subscription whose `custom_id` doesn't match a user, or whose plan isn't one of ours.
- `lib/billing/entitlement.ts`: `hasPro(subscription, now)`: true when status is `ACTIVE` and the paid period hasn't ended (+ 3 days of grace for late renewals), or when canceled/expired but still inside the paid period. `SUSPENDED`, `APPROVAL_PENDING` and refunded subscriptions: no Pro. Pure function, unit-tested; every gate uses it.
- Routes (all read `getPrisma()` inside the request):
  - `POST /api/paypal/subscribe` (form post from the pricing page with `plan` and `locale`): not logged in → localized login with `next` back to pricing; already Pro → dashboard; sandbox mode and not admin → pricing with a message; otherwise create the subscription (`custom_id`, language, `brand_name: "AlphaBes"`, `shipping_preference: NO_SHIPPING`, `user_action: SUBSCRIBE_NOW`, return URL = localized dashboard `?billing=return`, cancel URL = localized pricing `?billing=canceled`), store it as `APPROVAL_PENDING`, redirect (303) to PayPal. Checks the `Origin` header (session cookie is SameSite=Lax as well).
  - `POST /api/paypal/webhook`: reads the **raw body**, requires the five `paypal-*` headers, verifies through `POST /v1/notifications/verify-webhook-signature` with the raw event spliced into the request **unchanged** (no parse-and-re-stringify), returns 400 on failure. Then, in one transaction: insert `PaymentEvent` (a duplicate id means already processed → 200), call `syncSubscription` for the subscription concerned (`resource.id`, or `resource.billing_agreement_id` for sale events), set `processedAt`. A refund/reversal of the latest payment cancels the subscription at PayPal and ends Pro. On an unexpected error it returns 500 so PayPal retries (it retries for up to 3 days), and the duplicate check makes retries safe.
  - `POST /api/paypal/cancel` (dashboard): session required, cancels the user's own subscription at PayPal with a reason, then syncs. Errors return `{ error, code }` as elsewhere.
- Return from PayPal: the dashboard (already per request) sees `?billing=return&subscription_id=…`, checks the subscription belongs to this user, syncs it and shows "Welcome to Pro" (or "Payment pending, this can take a minute"). Activation therefore works even if the webhook is late, and the webhook covers a parent who closes the tab.

### Pages and text (4 languages)

- **Pricing:** two forms posting `plan=monthly|yearly` (no plan IDs, so they render in the static build), new prices, features matching B4, "Billed through PayPal. Cancel any time." note, link to the refund page, message after a canceled checkout. Login redirect localized.
- **Dashboard → "Subscription" card:** plan, status, next payment date or "Pro until …", **Cancel subscription** (confirmation step, explains access lasts until the end of the period), link to manage it in PayPal (paypal.com → Settings → Payments → Automatic payments), messages for pending, suspended (payment failed: update the payment method in PayPal) and canceled states.
- **Paywall** block for premium games and stories: what Pro unlocks, price, buttons to pricing/login.
- **Legal pages, 4 languages, written per language (not translated):** terms (billing through PayPal, auto-renewal, cancel any time, end of access, price changes with notice, refunds link, seller per B9), privacy policy (PayPal as processor: receives name, email, payment details; we store only the PayPal subscription ID, plan, status and dates, never card or bank data; PayPal's privacy statement linked), refund policy (new page, B5), and the old English `/privacy` page (B8). "Last updated" dates changed.
- Messages: new keys in `messages/en|fr|es|pt.json` (`Pricing`, `Dashboard`, `Billing`, `Paywall`, `Errors.paypal_*`); `tests/i18n/messages.test.ts` keeps the four files in step.

## Phases

Each phase ends with `npx tsc --noEmit`, `npm run lint`, `npx vitest run`, `npm run build`, the EN/FR/ES/PT snapshot comparisons (only the pages listed for that phase may differ), `localecheck` for fr/es/pt, then a commit and **your OK before pushing** and before the next phase. Work in a separate worktree as in the language plans.

| # | Content | Status |
|---|---|---|
| 0 | This plan; branch `paypal-subscriptions` (from `portuguese-version` at f373e43, which is `origin/main` plus one plan commit). You create the sandbox app, accounts, plans and webhook (steps 1–4). | **Done** (2026-10-03): plan approved. Sandbox setup (steps 1–4) is the owner's, needed before phase 2 tests. |
| 1 | Schema + migration 1 (generated without a database), applied to `dev` with `migrate deploy`; read-only check of `dev` after. `entitlement.ts` with unit tests. | **Done** (2026-10-03), committed, not pushed. Migration `20261003200000_paypal_subscriptions` generated with `migrate diff --from-schema-datamodel/--to-schema-datamodel` (no database, no shadow), applied to `dev` only (`.env` checked: endpoint `ep-shiny-breeze-b1bguixr` = `dev`). `dev` read-only before: 5 migrations, 6 users, 6 `Subscription` rows, Stripe columns empty, PostgreSQL 18; after: 6 migrations, none failed, same rows, new columns, `PaymentEvent`, indexes and statuses present. `lib/billing/entitlement.ts` (`hasPro`: active + 3-day renewal grace; canceled/expired until the paid period ends; pending/suspended no). 287 unit tests (6 new), tsc, lint, build 2,025 pages (unchanged). No page code changed, so no snapshot comparison was needed. |
| 2 | `lib/paypal/*`, `lib/billing/sync.ts`, the three API routes, `scripts/paypal/setup-plans.mjs` and `scripts/paypal/setup-webhook.mjs`. Unit tests. | **Done** (2026-10-03), committed (d873bcb, 6d20788), not pushed. 318 unit tests (31 new: plans and period ends, raw-body signature request, unsigned/forged events, duplicate and retried events, every sync case incl. refund and duplicate subscriptions, `.env` writer), tsc, lint, build (2,028 = 2,025 pages + the 3 new API routes). Smoke test on `next start`: webhook without signature 400, subscribe/cancel from another origin 403, logged-out subscribe → localized login with `next` (`/fr/connexion?next=/fr/tarifs`, `/pt/entrar?next=/pt/precos`, `/login?next=/pricing`), cancel logged out 401, pricing pages unchanged. Logged-in flows need the sandbox plans (see "Phase 2 notes"). |
| 3 | Pricing page and dashboard subscription card in 4 languages, messages, return/cancel handling. | **Done** (2026-10-03), committed (d8e13bc + browser checks), not pushed. Pricing: forms post `plan=monthly|yearly` + locale (no plan IDs, page still static, and the "Choose" buttons now render: with Stripe they never did); features rewritten to match B4 (premium stories left out: none exist yet, see Open questions); yearly "2 months free" corrected to "save 38%" (12 × $7.99 = $95.88 vs $59); PayPal billing note; `?billing=` notices read in the browser. Dashboard: return from PayPal checked with PayPal before rendering (`lib/billing/return.ts`), notices, Pro badge from `hasPro`, subscription card (renewal or end date, cancel with confirmation, PayPal automatic-payments link, plan-switch note), upsell text updated. 323 unit tests, tsc, lint, build 2,028. **Snapshot comparison of all 4 languages** (1,675 routes, baseline = bcec56d): exactly the 4 pricing pages differ, with the intended text. `localecheck fr/es/pt` pass; browser checks 616 with `CHECK_ACCOUNTS=1` (new "Billing" section: forms, notices and logged-out redirect in 4 languages; logged in on `dev` as a non-admin in sandbox: "opens soon", dashboard notices, a malformed or unknown subscription id shows the problem notice); the 3 throwaway accounts removed. |
| 4 | Server-side gating per B4: play pages, story check, bundle route, paywall, game titles/JSON-LD. | **Done** (2026-10-04), committed (c4c517e, 1849bd0, e33f7a1), not pushed. **Games:** the 12 premium games (3 per language) are played on a per-request, noindex play page (`/games/[slug]/play`, `/fr/jeux/[slug]/jouer`, `/es/juegos/[slug]/jugar`, `/pt/jogos/[slug]/jogar`; only premium slugs, others 404; not in the sitemap; the switcher maps twins) that checks the session and subscription on the server and shows the game or the paywall; the static game pages stay indexable with a Pro block and a Play button and no longer contain the game code; their titles drop *gratuit/gratis/grátis*; the FR/ES/PT game lists no longer say every game is free. **Stories:** a story with `isPremium` sends only its first page without Pro (plus the paywall); none is flagged (owner's choice), so nothing changes today. **Bundles (owner chose the private bucket):** R2 bucket `alphabes-pro-files` created 2026-10-03 (empty, private), binding `PRO_FILES` in `wrangler.jsonc`; the 126 FR/ES/PT pack PDFs moved from `public/` to `pro-files/fr|es|pt/` (git mv) and the 37 English bundles are pre-generated in `pro-files/en/` (`npm run bundles:en`); `/api/bundles/<lang>/<slug>` sends logged-out visitors to login, non-Pro to pricing (`?billing=bundle` notice), Pro gets the PDF (private, no-store, noindex); old public pack URLs 308 to the pack page; `*.pdf binary` in `.gitattributes`. **Checks:** 338 unit tests, tsc, lint, build 2,028; 4-language snapshot vs phase 3: exactly 178 routes differ (163 bundle pages, 12 premium game pages, 3 game lists); `localecheck fr/es/pt` pass; browser checks 590 (paywall mode) and 619 with `CHECK_ACCOUNTS=1` (premium games played as Pro on their play pages); throwaway accounts removed. |
| 5 | Remove Stripe: `lib/stripe.ts`, `app/api/stripe/`, the `stripe` package, `.env.example` (PayPal variables with empty values), README, `localecheck.mjs` allow-list (`Stripe` → `PayPal`). | **Done** (2026-10-04), committed (c4a58ca), not pushed. Stripe code, routes and package removed (`/api/stripe/*` now 404); `.env.example` lists the `PAYPAL_*` variables with empty values; README billing lines and CLAUDE.md (secrets, Pro-files bucket, billing) updated. Added `scripts/upload-pro-files.mjs` at the owner's request (see Launch, step 3). tsc, lint, 338 unit tests, build 2,026 (the 2 Stripe routes gone); 4-language snapshot vs phase 4: **all 1,675 routes identical**. Left for phase 6: the Stripe mentions in the legal pages and the `localecheck.mjs` allow-list (`Stripe` → `PayPal`) with them; for migration 2 (after launch): the two Stripe columns. |
| 6 | Legal pages ×4, refund page ×4 (routes, sitemap, hreflang, footer). | **Done** (2026-10-04), committed, not pushed. **Refund policy** (new, `/refunds`, `/fr/remboursements`, `/es/reembolsos`, `/pt/reembolsos`, written per language): cancel any time from the dashboard or PayPal, Pro until the end of the paid period; monthly not refunded; yearly refunded in full within 14 days of the **first** yearly payment (B5 as decided; renewals not covered, see Open questions); refunds through PayPal end Pro; contact us before a PayPal dispute; consumer-law rights not limited. Linked from the footer (every page), the pricing page and the terms; in the sitemap (1,666 URLs) with hreflang. **Terms ×4:** who runs AlphaBes (Lahcen Afoullousse, Morocco, B9), what Pro includes (premium games, whole-bundle PDFs, any story marked Pro), PayPal billing in USD (PayPal sets any conversion), auto-renewal, cancel from the dashboard or PayPal, failed payments pause Pro, refund policy link, 30 days' notice of price changes. **Privacy ×4 + old English `/privacy`:** PayPal processes payments under its own privacy statement; we keep only the PayPal subscription identifier, plan, status, payment/renewal/cancellation dates and a record of PayPal notifications; no card or bank data. No Stripe text left anywhere; `localecheck` allow-list `Stripe` → `PayPal`. **Checks:** 340 unit tests (refund page routes and hreflang), tsc, lint, build 2,030; snapshot vs phase 5, compared line by line regardless of order: 1,659 pages differ only by the footer link, 4 new refund pages, 13 pages with the intended text (pricing, terms and privacy ×4, old `/privacy`), nothing else; `localecheck fr/es/pt` pass; 590 browser checks pass; French refund page checked at 390 px (no overflow). Legal review is still recommended (the pages say so). |
| 7 | Sandbox end-to-end, locally through the tunnel: subscribe monthly and yearly in each language with the 4 sandbox buyers (PayPal page in the right language, dashboard shows Pro, gated content opens); renewal with the daily test plan (`PAYMENT.SALE.COMPLETED`, period moves forward, no duplicate); "Resend" an event from the PayPal dashboard (no double processing); a forged/unsigned POST (400, nothing changes); suspend through the API and reactivate; cancel from the dashboard and from the PayPal buyer account (Pro until period end); refund from the merchant account (Pro ends); buy twice (refused). Test accounts on `dev` removed afterwards. | |
| 8 | Launch (below). | |

### Phase 2 notes

- **Settings** (`.env` locally, Cloudflare in production): `PAYPAL_MODE` (`sandbox`|`live`, anything else = sandbox), `PAYPAL_CLIENT_ID`, `PAYPAL_CLIENT_SECRET`, `PAYPAL_WEBHOOK_ID`, `PAYPAL_PLAN_MONTHLY`, `PAYPAL_PLAN_YEARLY`, and in sandbox only `PAYPAL_PLAN_TEST` (the $1 daily plan; ignored in live mode).
- **Owner's sandbox setup:**
  1. `node --env-file=.env scripts/paypal/setup-plans.mjs`: creates the product and the three sandbox plans and writes the three plan variables into `.env` (not printed). Stops if they're already set (`--force` to make a new set). **Done 2026-10-03** (run by me at the owner's request, nothing printed): the three IDs are in `.env`; PayPal shows *AlphaBes Pro Monthly* 7.99 USD/month, *Yearly* 59.00 USD/year, *Daily (sandbox test)* 1.00 USD/day, all ACTIVE, suspended after 2 failed payments. A create-subscription check through `lib/paypal` in each language (en-US, fr-FR, es-MX, pt-BR) returned `APPROVAL_PENDING` with a sandbox approve link and our `custom_id`; those 4 unapproved subscriptions simply expire.
  2. (Phase 7.) Start a tunnel to `npm run dev` (`cloudflared tunnel --url http://localhost:3000`, cloudflared is not installed yet: `winget install --id Cloudflare.cloudflared`), then `node --env-file=.env scripts/paypal/setup-webhook.mjs https://<tunnel>/api/paypal/webhook`. The first run creates the webhook and writes `PAYPAL_WEBHOOK_ID`; later runs (new tunnel address) move the same webhook to the new URL.
  3. (Phase 7.) Restart `npm run dev` so it reads the new `.env` values.
  Live mode (phase 8): same scripts with the live values and `--live`, run by the owner in their own terminal; they print the IDs for Cloudflare.
- **Who can check out:** while `PAYPAL_MODE=sandbox`, only `ADMIN` accounts (others go back to pricing with `?billing=soon`, shown in phase 3). The daily test plan (`plan=test`) is admin-only and sandbox-only.
- **Linking:** a subscription carries the parent's `User.id` as `custom_id`; the subscribe route stores nothing. A subscription is written to the database only once PayPal reports it active (approved and paid), by the webhook or by the return to the dashboard (phase 3), whichever comes first.
- **Refunds:** any refund or reversal of a subscription payment (`PAYMENT.SALE.REFUNDED`/`REVERSED`) cancels the subscription at PayPal and ends Pro at once, partial refunds included. To refund part of a payment and keep Pro, don't use a PayPal refund; ask me for a manual fix instead.
- **Two subscriptions at once** (two checkouts in two tabs): the second one is canceled at PayPal automatically and logged (`duplicate subscription … refund its payment`); the owner refunds its payment.
- **Failed renewals:** PayPal retries; Pro continues for 3 days after the due date; after 2 failed attempts PayPal suspends the subscription and Pro stops. A new subscription cancels the suspended one first.

### Phase 4 notes

- **Pro files upload (owner's decision 2026-10-04: by script, not by hand):** `node scripts/upload-pro-files.mjs` uploads `pro-files/<lang>/<slug>.pdf` (37 + 43 + 40 + 43 files, about 40 MB) to `alphabes-pro-files` with the same keys, through `wrangler r2 object put --remote` (it only writes objects; it never deploys). Each file gets up to 5 attempts with growing pauses (R2 uploads can time out from this machine), is then read back and compared by sha256, and is recorded in `.pro-files-uploaded.json` (git-ignored): a stopped run resumes where it stopped, and later runs send only changed files (`--force` sends all, `--lang=fr` one language, `--dry-run` lists without uploading). Needs a Cloudflare login first (`npx wrangler login`, done by the owner in their browser; or `CLOUDFLARE_API_TOKEN` with R2 edit rights in the environment, never printed). Keep the bucket private: no public development URL, no custom domain. Until it's uploaded, Pro parents get a 404 on bundle downloads (logged as "Pro file missing from the bucket").
- **Regenerating:** `npm run fiches:fr`, `fichas:es`, `atividades:pt` now write packs into `pro-files/<lang>/`; `npm run bundles:en` writes the English bundles. Commit, then run `node scripts/upload-pro-files.mjs` (only the changed files are sent).
- **Local development:** `npm run dev` has no R2 binding here, so the route reads the local `pro-files/` folder instead (`lib/billing/bundles.ts`); `next start` and production read only the bucket.
- **Browser checks:** without `CHECK_ACCOUNTS=1` the premium games' checks only verify the Pro block and the paywall; with it, a throwaway dev account gets an active Pro row (no PayPal) and the games are played on their play pages. Run `cleanup-accounts.mjs` afterwards.
- **SEO:** premium game pages keep their URL, text and JSON-LD (`isAccessibleForFree: false` in FR/ES/PT); their titles lost "free". Pack pages keep their URL; the PDF links now go to `/api/bundles/...` (`rel="nofollow"`), and the old PDF URLs redirect to the pack pages.

## Launch (phase 8)

Order: **backup, migrate, deploy in sandbox mode, test, switch to live.** Migration 1 is additive, so it's harmless for the live site before the deploy.

1. I check production **read-only** (pending migrations, `Subscription` rows, Stripe columns empty) and, with your OK, create a Neon backup branch `backup-before-paypal-<date>` from `production` (no compute). Or you create it in the Neon console (Branches → production → Create branch).
2. You run, from the repo folder, with the **production** connection string (never stored in `.env`):
   ```powershell
   $env:DATABASE_URL = "<production connection string>"
   npx prisma migrate status      # expect: 1 migration not yet applied (the PayPal one)
   npx prisma migrate deploy      # adds the PayPal columns, PaymentEvent table, 3 status values
   Remove-Item Env:DATABASE_URL
   ```
   I then check read-only that the columns/table exist, `_prisma_migrations` has one more row, no rollback, data unchanged, live site still works.
3. **Upload `pro-files/` to the bucket with the script** (owner's decision): the owner runs `npx wrangler login` once (browser sign-in), then I run `node scripts/upload-pro-files.mjs --dry-run` (expect 163 files), then `node scripts/upload-pro-files.mjs` and rerun it until it ends with "All … uploaded and checked" (it resumes; failed files are retried on the next run). Done before the deploy, so Pro downloads work from the first minute. In Cloudflare: add the six PayPal variables with the **sandbox** values (`PAYPAL_MODE=sandbox`), and deploy that version. Add the sandbox webhook for `https://alphabes.com/api/paypal/webhook` and use its ID.
4. Merge `paypal-subscriptions` into `main` and push; Workers Builds deploys. I watch until it's live.
5. On alphabes.com, logged in as admin: a sandbox subscription in each language, cancel, webhook delivery (PayPal dashboard → Webhooks → events show 200).
6. Live account checks (step 5 of the PayPal section) passed → create the live app, plans and webhook (steps 6–9), replace the six Cloudflare values with live ones (`PAYPAL_MODE=live`), deploy. You buy the monthly plan with your own card or account, check the dashboard shows Pro, cancel, refund yourself in PayPal; checkout is then open to everyone.
7. A few weeks later: migration 2 (drop the Stripe columns), same procedure (backup, `migrate status`, `migrate deploy`).

## Open questions

- **Yearly renewals and refunds:** the refund policy follows B5 literally (14 days after the *first* yearly payment). Many services also refund a yearly *renewal* asked within 14 days; say if you want that, it's one sentence per language.

- The live account's ability to receive and withdraw USD from Morocco (PayPal step 5) decides whether phase 8 can happen.
- **Premium stories:** checked on `dev` (2026-10-03): no story is premium in any language (0 of 8 each; the seed sets none). The owner chooses which stories become Pro, or none; the pricing page lists premium stories only once some exist.
