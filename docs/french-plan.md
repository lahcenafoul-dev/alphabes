# French version of AlphaBes: plan and status

Last updated: 2026-09-29. Read this first when continuing the French work.

## Goal

A full French version of AlphaBes, same look and features as the English one, written for French-speaking families (France, Morocco, Belgium, Switzerland, Canada), children 3–8. Not a translation: French letter names, sounds, example words, phonics (French school "sons"), cursive and stories. Natural French for children and parents, no machine-translation feel.

Hard rule: **English URLs and content stay exactly as they are** (no redirects, no SEO loss). Check it with the English snapshot comparison (see Testing).

## Branch workflow

- All French work happens on **`french-version`** (pushed to GitHub). Pushing that branch doesn't deploy; Cloudflare Workers Builds only deploys `main`.
- **Don't merge `french-version` into `main` until every phase is done** and the owner approves: the French home page links to sections built in later phases.
- Fixes for the live English site go on a small branch from `main`, merged into `main` and pushed (that deploys), then `main` is merged into `french-version`.
- At the end of each phase: `npx tsc --noEmit`, `npm run lint`, `npm run build`, `npx vitest run`, the English comparison, the French checks and the browser checks. Then commit and **wait for the owner's OK before pushing** and before starting the next phase.
- The owner often runs `npm run dev` in the repo folder, which shares `.next` with builds. Build and test in a separate git worktree instead:
  ```sh
  git worktree add ../lphbes-fix <branch>        # or --detach french-version
  cp .env ../lphbes-fix/.env
  cmd //c "mklink /J ..\\lphbes-fix\\node_modules node_modules"
  # ...build / next start -p 3400 / checks in ../lphbes-fix...
  cmd //c "rmdir ..\\lphbes-fix\\node_modules"   # remove the link FIRST, never the real node_modules
  git worktree remove --force ../lphbes-fix
  ```
- Never deploy from this Windows machine (see CLAUDE.md, Hosting).

## Decisions (made by the owner)

| Topic | Decision |
|---|---|
| i18n library | next-intl, `localePrefix: "as-needed"`: English unprefixed, French under `/fr`. No `Accept-Language` redirects. |
| Header | New site-wide header on every page, English included: logo, main links, "My Account / Mon espace", EN/FR switcher. |
| French URL words | Translated: `/fr/jeux`, `/fr/histoires`, `/fr/fiches`, `/fr/sons`, `/fr/connexion`… Full map in `i18n/routing.ts`. |
| School levels | `preschool` → `/fr/maternelle` (PS–MS, 3–5); `kindergarten` → `/fr/grande-section` (GS, 5–6). |
| Flashcards | `/fr/imagier` (French word for a picture word book). |
| Remembering the language | The switcher sets a `NEXT_LOCALE` cookie (1 year); the middleware sends the visitor to the same page in that language when it exists. |
| Pricing | Keep USD for now (French format: "7,99 $", with a note "Prix en dollars américains (USD)"). Stripe is paused (not available in Morocco). |
| Story audio | **Google Cloud Text-to-Speech**, fr-FR Neural2 or WaveNet voice (owner already has a Google Cloud project). Stay inside the free tier and **tell the owner the expected cost before generating**. Browser speech (Web Speech API, fr-FR) as fallback when a page has no audio file. |
| Cursive font | Use a free font **only if its license clearly allows commercial use in a paid product**. If none qualifies, show the owner the paid options with prices **before buying**. Candidates to check: Belle Allure, Écolier, Cursive standard. Worksheets on Seyès ruling (grands carreaux). |
| Letter E | The letter's name is [ə], but *Escargot* and *Elfe* start with the è sound [ɛ]. The E page must say so for parents. |
| Accents | Full letter pages for **é, è, ê, ç** (they change the sound). **à, ù, â, î, ô, û, ë, ï, œ** go on one "Les accents" page (à and ù don't change the sound). |
| Content review | The owner accepted the plan; recommended: a native French teacher reviews stories and sound pages before launch. Legal pages need a lawyer (GDPR/CNIL, Moroccan law 09-08/CNDP). |

### Approved sample alphabet (emoji per word)

A *a* Avion ✈️ Abeille 🐝 · B *bé* Ballon 🎈 Banane 🍌 · C *cé* Canard 🦆 Citron 🍋 (hard and soft c) · D *dé* Dauphin 🐬 Dinosaure 🦕 · E *e* [ə] Escargot 🐌 Elfe 🧝 (both start with è [ɛ]; explain) · F *effe* Fraise 🍓 Fleur 🌸 · G *gé* Gâteau 🎂 Girafe 🦒 · H *ache* Hibou 🦉 Hérisson 🦔 (silent letter) · I Iguane 🦎 Île 🏝️ · J *ji* Jus 🧃 Jouet 🧸 · K *ka* Koala 🐨 Kangourou 🦘 · L *elle* Lion 🦁 Lune 🌙 · M *emme* Moto 🏍️ Maison 🏠 · N *enne* Nuage ☁️ Nid 🪺 · O Olive 🫒 Orange 🍊 · P *pé* Pomme 🍎 Papillon 🦋 · Q *qu* Quatre 4️⃣ Quille 🎳 · R *erre* Robot 🤖 Renard 🦊 · S *esse* Soleil ☀️ Serpent 🐍 · T *té* Tortue 🐢 Tomate 🍅 · U [y] Usine 🏭 Univers 🌌 (+ Lune/Tortue to show the sound) · V *vé* Vache 🐄 Vélo 🚲 · W *double vé* Wagon 🚃 Kiwi 🥝 · X *iks* Xylophone 🎼 Taxi 🚕 · Y *i grec* Yoyo 🪀 Yeux 👀 · Z *zède* Zèbre 🦓 Zéro 0️⃣ · É Éléphant 🐘 Étoile ⭐ · È Chèvre 🐐 Zèbre 🦓 · Ê Fête 🎉 Forêt 🌲 · Ç Garçon 👦 Glaçon 🧊

### Sound skills (French "sons", CP level)

Les voyelles · La syllabe (ma, pa, li: the heart of French reading) · Le premier son · ou (loup) · on/om (ballon) · an/en (maman, dent) · in/ain/ein (lapin, main, pain) · oi (roi) · ch (chat) · gn (champignon) · eu/œu (feu, cœur) · au/eau/o (bateau, château) · é/er/ez (bébé, nez) · è/ê/ai/ei (fraise, reine) · ill/ail/eil (abeille, soleil) · c/ç and g/ge (hard and soft) · s vs ss (poisson/poison) · Les lettres muettes · Les mots-outils. French replaces "CVC words" with syllables.

### Speech

`speak(text, locale)`: pick a fr-FR voice (then any fr-*) after `voiceschanged`; if the device has no French voice, show a friendly French message with Android/iOS/Windows hints. Browser speech can't say isolated sounds reliably ("gn" is read "gé enne"), so each item gets a separate `spokenText`, e.g. "ou, comme dans loup".

## How it's built (phase 1)

See CLAUDE.md, "Languages", for the rules. In short:

- Pages live in `app/[locale]/`. `lib/i18n/routes.ts` has **`FRENCH_PATHNAMES`**, the list of pages that exist in French. It drives the middleware (other `/fr` URLs 404), hreflang, the French sitemap entries and the header/footer links. Add a pathname only once its French page is written.
- UI strings: `messages/en.json` / `messages/fr.json`. Long-form pages: `*-en.tsx` / `*-fr.tsx` components chosen by `page.tsx`.
- Pages call `initLocale(locale)` first so they stay static.
- 404s: the middleware sends unknown URLs, unknown params (`lib/i18n/known-params.ts`), unknown stories (`lib/story-exists.ts`, a cached DB query) and unwritten French pages to `app/global-not-found.tsx` (`experimental.globalNotFound`), which renders the 404 page in English or French with status 404. A page calling `notFound()` itself leaves an empty error shell in the server HTML with Next 15.5, so avoid relying on it.
- API errors return `{ error, code }`; forms show `Errors.<code>` in the visitor's language.

## Phases

| Phase | Content | Status |
|---|---|---|
| 0 | Baseline snapshot of all English routes; ESLint config + existing lint fixes | **Done** |
| 1 | next-intl routing, header + EN/FR switcher, cookie, hreflang + sitemap, French UI (home, about, pricing, contact, login, register, dashboard, legal), API error codes, French 404 | **Done**, pushed. |
| 2 | Alphabet: French letter data (26 + é è ê ç), "Les accents" page, alphabet chart, letter pages, flashcards (`/fr/imagier`), `speak()` with French voice + no-voice message, tracing canvas with script/cursive toggle | **Done**, committed, not pushed: waiting for the owner's OK. |
| 3 | Sons (phonics): ~18 skill pages + index, speakable examples | To do |
| 4 | Worksheets: French jsPDF templates and text, cursive font (license rule) + Seyès lines, French static sets (nombres, formes, couleurs, mots-outils, syllabes), bundles (`/fr/fiches/packs`), pre-rendered French PDFs | To do |
| 5 | Stories: DB migration, 8 original French stories (same illustration scenes), story list filtered by language, reader in French, audio via Google Cloud TTS (cost estimate first) | To do |
| 6 | Games (5 French games), child language preference (dashboard forms + links), maternelle, grande section, activities | To do |
| 7 | Launch: production DB migration (with OK), merge to `main`, submit the French sitemap in Search Console. French blog optional (new writing). | To do |

### Planned database changes (phase 5, additive)

```prisma
enum Locale { EN FR }
model Story        { locale Locale @default(EN)  translationGroup String?  @@index([locale, order]) }
model ChildProfile { language Locale @default(EN) }
model User         { locale Locale @default(EN) }
```
Slugs stay globally unique; fill in `StoryPage.audioUrl`. Apply to the Neon `dev` branch first; production gets `prisma migrate deploy` only with the owner's OK, before the merge to `main`.

### Things later phases must remember

- `/stories/[slug]` and `/worksheets/[category]` (and bundles) will have French slugs that differ from English: add them to `PARAMS_DIFFER` handling / `otherParams` in `alternatesFor`, make `lib/i18n/known-params.ts` locale-aware, and make `storyExists` check the story's language.
- Each dynamic page's `generateStaticParams` receives `{ params: { locale } }`: return the French list for `fr` once it exists. Don't return `[]` for one locale (Next then prebuilds nothing for the route); the middleware already hides unwritten French pages.
- French home page (`app/[locale]/home-fr.tsx`): the "Apprendre les sons" tiles link to `/phonics` until phase 3 gives them real slugs; the worksheet links point to `/worksheets` until phase 4, which should also add a "Fiches populaires" section and accent letter blocks (é è ê ç).
- Phase 2 uses **Playwrite FR Trad** (Google Fonts, SIL OFL 1.1, commercial use allowed) for cursive, in `lib/fonts/cursive.ts`. Phase 4's jsPDF templates need the same font embedded (TTF) for cursive worksheets.
- French-only letters (é è ê ç) have no English twin: the switcher sends them to `/alphabet`, and `/alphabet/c-cedille` etc. 404.

## Testing

Scripts in `scripts/i18n-check/` (run against `next start`, usually on port 3100 or 3400):

- `snapshot.mjs <outDir> [baseUrl]`: saves a digest (title, meta, canonical, JSON-LD, links, visible text) and the HTML of every English URL in the sitemap.
- `compare.mjs <baselineDir> <currentDir>`: route-by-route diff (hreflang ignored, header excluded). Make the baseline from `main` built in a worktree at the start of a phase; English must stay identical apart from intended changes.
- `frcheck.mjs [baseUrl]`: French pages (status, `lang="fr"`, titles, canonical/hreflang), every internal link on them, and the routing rules (404s, `/en` redirect, dashboard login, language cookie, no Accept-Language redirect). Its "English-looking text" check has false positives (French words like *parents*, *session*, *sons*).
- `browser.mjs [baseUrl] [shotsDir]`: Playwright checks of the switcher, cookie, French forms, cookie banner, mobile menu and 390px layout, with screenshots.
- Unit tests: `npx vitest run` (`tests/i18n/`).

## Open issues

- The French home page links to sections built in phases 2–6; they 404 until then (the header and footer only show French pages that exist).
- The English 404 page no longer has `og:image`/`twitter:image` tags (`global-not-found` doesn't get root file metadata). Harmless on a noindex page.
- `experimental.globalNotFound` is experimental in Next 15.5 (stable in Next 16). Re-test 404s after any Next upgrade.
- The build pre-renders French copies of English-only pages (unreachable, the middleware 404s them) until each phase adds French content: about 1,140 pages instead of about 575.
- Each page is about 1–1.7 KB (gzip) heavier, mostly the new header.
- The legacy `/privacy` page has no French version (the footer links `/privacy-policy`).
- Legal pages in both languages are marked "placeholder, needs legal review".
- No emails are sent by the app yet; when some are added (password reset, welcome), make them language-aware using `User.locale`.
- `app/[locale]/dashboard/[id]` still calls `notFound()` for someone else's child (private page, empty shell in the server HTML; fine in the browser).
