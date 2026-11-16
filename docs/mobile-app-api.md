# Mobile app API

The official AlphaBes app (Expo, Android and iOS; repo `Desktop\alphabes-app`, started 2026-11-16) talks to the website through `/api/app/*`. These routes are new code only. No page changed, and no table, package or secret was added.

## Store rules (owner, 2026-11-16)

- The app sells nothing. It shows no price, no PayPal, and no link or button to buy on the website.
- Pro is unlocked only when a parent logs in, behind the app's parent gate, with an account that already has Pro on alphabes.com.
- Locked items in the app show only "🔒 Pro" and "Ask a grown-up".
- The API therefore never sends a price, plan name, PayPal id or payment date: only `pro: true/false`, decided by `hasPro()` (`lib/billing/entitlement.ts`).

## The token (`lib/app-api/token.ts`)

- The app can't use the website's cookie session. Instead it holds a token made with NextAuth's own `encode`/`decode` and `NEXTAUTH_SECRET`.
- The token is encrypted, with salt `alphabes-app-token` and audience `app`. Because the salt differs, a website session cookie is never accepted as an app token, and an app token is never accepted as a session cookie.
- It lasts 90 days and is renewed by every `GET /api/app/me`, which the app calls each time it opens.
- It carries a fingerprint of the stored password hash. Changing the password on the website signs the app out on every phone.
- Routes read it from `Authorization: Bearer <token>` with `getAppUser(req, prisma)`.

## Routes

All of them answer JSON. Errors are `{ error, code }`, and responses are `Cache-Control: no-store`.

| Route | Body / answer | Errors |
| --- | --- | --- |
| `POST /api/app/login` | `{ email, password }` → `{ token, account }`. Same bcrypt check as `lib/auth.ts`. Rate limited with the website login (10 a minute per IP, `middleware.ts`). | `invalid_login` (400/401), `rate_limited` (429) |
| `GET /api/app/me` | → `{ token, account }`, with a renewed token | `unauthorized` (401) |
| `GET /api/app/children` | → `{ children }` | `unauthorized` |
| `POST /api/app/children` | `{ firstName, ageBand: "3-4"\|"5-6"\|"7-8", language?: "en"\|"fr"\|"es"\|"pt" }` → `{ child }` (201) | `invalid_child`, `unauthorized` |
| `POST /api/app/progress` | `{ childId, stories: [{ locale, slug, lastPageRead, completed }] }`, at most 100 entries → `{ saved, unknown }` | `invalid_data`, `profile_not_found` (another parent's child), `unauthorized` |
| `GET /api/app/packs/[locale]/[slug]` | The Pro pack or bundle PDF. Same files, keys and `?paper=letter\|a4&part=` as `/api/bundles`. | `unauthorized` (401), `pro_required` (403), `not_found` (404). Never redirects. |

Notes on the routes:

- **`account`** is `{ name, email, pro, children: [{ id, firstName, ageBand, language, avatarKey }] }`.
- **`/api/app/progress`** writes the existing `StoryProgress`, exactly like the website reader (`app/api/stories/[slug]/progress`), so stories finished in the app show on the dashboard.
  - A late or repeated save never undoes a finished story.
  - Stories that don't exist, or whose language doesn't match, are skipped and listed in `unknown`.

## What stays on the phone

Game scores, tracing stars and letters visited stay on the phone and show in the app's grown-ups area. This was the owner's decision A (2026-11-16): no database change.

If the website should show them later, that needs one new table (`AppActivity`) with a hand-written migration, applied with `prisma migrate deploy` only. That would be a separate, approved step.

## In-App Purchases later

The app asks one place, `src/lib/pro.ts` → `usePro()`, which combines "sources" of Pro. Today the only source is this API's `account.pro`.

A store source (for example RevenueCat) would be added there in the app. If the website should also honour an app purchase, it would need its own webhook route and its own entry in `hasPro()`. Nothing of this is built.

## Tests

- `tests/app-api/token.test.ts`: a round trip, plus refusal of a wrong secret, a website session token, an expired token and garbage.
- `tests/app-api/routes.test.ts`: every route with an in-memory database. It also checks that no answer contains billing words.
