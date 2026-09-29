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
