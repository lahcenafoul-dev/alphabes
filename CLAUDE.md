# AlphaBes

## Hosting

The site (alphabes.com) is hosted on **Cloudflare Workers**, built with OpenNext (`@opennextjs/cloudflare`). Netlify is no longer used.

- **Deploys are automatic.** Cloudflare Workers Builds builds and deploys the `alphabes` worker on every push to `main`. Shipping a change means committing and pushing to `main`; there is no manual deploy step.
- **Never deploy from this Windows machine.** Don't run `npm run deploy`, `npx opennextjs-cloudflare deploy` or `wrangler deploy` locally: workerd crashes and R2 uploads time out here.
- **Local OpenNext builds on Windows are not representative.** An OpenNext path bug skips copying Prisma's WASM client on Windows, so a local `opennextjs-cloudflare build`/`preview` bundles Prisma's Node engine and database pages fail. Workers Builds runs on Linux and is unaffected. Use `npm run dev` for local testing.
- **Environment variables** live in the Cloudflare dashboard, not in `.env` (local only):
  - Build-time `NEXT_PUBLIC_APP_URL`: Workers & Pages → alphabes → Settings → Build → Variables and secrets.
  - Runtime secrets and vars (`DATABASE_URL`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, Stripe keys): Workers & Pages → alphabes → Settings → Variables and Secrets. Saving there only creates a new version; it must also be **deployed**. `keep_vars` in `wrangler.jsonc` stops deploys from wiping them.
- **Caching:** prerendered pages use the R2 bucket `alphabes-inc-cache` (see `wrangler.jsonc` and `open-next.config.ts`). The build never touches the database.
- **DNS** for alphabes.com is on Cloudflare. `www` and plain HTTP redirect to `https://alphabes.com`.

## Database

Neon PostgreSQL through Prisma 5 with the Neon driver adapter (`previewFeatures = ["driverAdapters"]`). On Workers a database connection can't be shared between requests, so always get the client with `getPrisma()` from `lib/prisma.ts` inside the request (route handler, server component, or auth callback), never at module level. The local `.env` points at the Neon `dev` branch.

## Languages (English + French)

**The French plan, the owner's decisions, phase status, branch workflow and open issues are in [docs/french-plan.md](docs/french-plan.md). Read it before any French work.**

next-intl with `localePrefix: "as-needed"`: English keeps its unprefixed URLs, French lives under `/fr` with French path words (`/fr/jeux`, `/fr/histoires`). Pages are in `app/[locale]/`; the URL map is `i18n/routing.ts`.

- **English URLs and output must not change.** Before and after i18n work, compare the rendered English pages (title, meta, canonical, JSON-LD, links, text); only hreflang and the site header may differ.
- **Which pages exist in French** is `FRENCH_PATHNAMES` in `lib/i18n/routes.ts`. It drives the middleware (other `/fr` URLs 404), hreflang (`alternatesFor`), the sitemap, and the header/footer links. Add a pathname there only once its French page is written.
- **UI strings** are in `messages/en.json` and `messages/fr.json` (same keys; `tests/i18n/messages.test.ts` checks). Teaching content differs by language, so long-form pages have `*-en.tsx` / `*-fr.tsx` components rather than translated strings. Write French directly for French-speaking families; don't translate word for word.
- **Pages** call `initLocale(locale)` from `lib/i18n/server.ts` first, so they stay static.
- **404 pages:** with this Next.js version, a page calling `notFound()` returns status 404 but an empty error shell in the server HTML (the page only appears after JavaScript). So the middleware sends unknown URLs, unknown params (`lib/i18n/known-params.ts`) and unwritten French pages to `app/global-not-found.tsx` (`experimental.globalNotFound`), which renders the 404 in the right language. When adding a content route, add its validator there. Don't add a root `app/not-found.tsx`: Next renders it into every page, and anything request-dependent in it makes the whole site dynamic.
- **Header, footer and 404 content** build hrefs with `localizedPath(locale, ...)` and `next/link`, and providers use `components/IntlClientProvider.tsx` with explicit props, so none of them depend on the request locale.
- **Language cookie:** the EN/FR switcher sets `NEXT_LOCALE`; the middleware then redirects to the same page in that language when it exists. Never redirect on `Accept-Language`.
- **API errors** return `{ error, code }`; clients show `Errors.<code>` from the messages.
