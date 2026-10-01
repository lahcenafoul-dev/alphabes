# French version of AlphaBes: plan and status

Last updated: 2026-10-01 (launched). Read this first when continuing the French work.

## Goal

A full French version of AlphaBes, same look and features as the English one, written for French-speaking families (France, Morocco, Belgium, Switzerland, Canada), children 3–8. Not a translation: French letter names, sounds, example words, phonics (French school "sons"), cursive and stories. Natural French for children and parents, no machine-translation feel.

Hard rule: **English URLs and content stay exactly as they are** (no redirects, no SEO loss). Check it with the English snapshot comparison (see Testing).

## Branch workflow

- **Launched 2026-10-01**: `french-version` was fast-forwarded into `main` and deployed. From now on, French and English work both go on small branches from `main`, merged into `main` (pushing `main` deploys). Keep running the English comparison and the French checks before merging.
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
| Story audio | **Google Cloud Text-to-Speech**, fr-FR Neural2 or WaveNet voice (owner already has a Google Cloud project). Stay inside the free tier and **tell the owner the expected cost before generating**. Browser speech (Web Speech API, fr-FR) as fallback when a page has no audio file. **2026-10-01: TTS skipped for now** (Google Cloud billing won't activate): French stories launch with browser speech only; the TTS script stays ready for later. |
| Cursive font | Use a free font **only if its license clearly allows commercial use in a paid product**. If none qualifies, show the owner the paid options with prices **before buying**. **Chosen: Playwrite FR Trad** (TypeTogether, SIL OFL 1.1: commercial use and embedding allowed, the OFL doesn't cover documents made with it). Its proportions match Seyès exactly (x-height = 1 interline, loops = 3). Worksheets on Seyès ruling (grands carreaux). |
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
| 2 | Alphabet: French letter data (26 + é è ê ç), "Les accents" page, alphabet chart, letter pages, flashcards (`/fr/imagier`), `speak()` with French voice + no-voice message, tracing canvas with script/cursive toggle | **Done**, pushed. |
| 3 | Sons (phonics): 19 sound pages + index (`/fr/sons`), speakable words and sentences, "Où est le son ?" picture hunt, syllable builder | **Done**, pushed. |
| 4 | Worksheets: 238 French PDFs (6 types × 30 letters, nombres, formes, couleurs, mots-outils, syllabes, sons), 43 packs (`/fr/fiches/packs`), cursive on Seyès lines, pre-rendered with Chromium | **Done**, pushed. |
| 5 | Stories: DB migration, 8 original French stories (same illustration scenes), story list filtered by language, reader in French, audio via Google Cloud TTS (cost estimate first) | **Done**, pushed. Migration applied to the Neon `dev` branch only (production in phase 7). Audio: **browser French voice** (owner's decision, 2026-10-01: Google TTS skipped, billing won't activate). "Écouter" becomes "⏹ Arrêter" while reading; turning the page or leaving stops it. No MP3s generated. |
| 6 | Games (5 French games), child language preference (dashboard forms + links), maternelle, grande section, activities | **Done**, pushed. |
| 7 | Launch: production DB migration (with OK), merge to `main`, submit the French sitemap in Search Console. French blog optional (new writing). | **Done** 2026-10-01, except Search Console (owner: resubmit `https://alphabes.com/sitemap.xml`, which now lists the French pages). The owner ran `prisma migrate deploy` and `db:seed` on production (16 stories, English text unchanged); Neon backup branch `backup-before-french-launch-2026-10-01` (no compute) holds production as it was before. Live checks passed: English identical apart from hreflang and the known phase 1 changes, French checks and browser checks (`LIVE=1`) on alphabes.com. |

### Database changes (phase 5, additive)

```prisma
enum Locale { EN FR }
model Story        { locale Locale @default(EN)  translationGroup String?  @@index([locale, order]) }
model ChildProfile { language Locale @default(EN) }
model User         { locale Locale @default(EN) }
```
Slugs stay globally unique. Migration `20260930050000_story_locale`, **applied to `dev` on 2026-09-30**; production gets `prisma migrate deploy` and `npm run db:seed` only with the owner's OK, before the merge to `main` (phase 7). `ChildProfile.language` and `User.locale` are used from phase 6.

- Story content lives in `prisma/stories-data.ts` (both languages, `translationGroup` pairs twins); `npm run db:seed` upserts it. Twins get hreflang to each other (page metadata and sitemap).
- Stories exist only in their language: the lists filter by `locale`, and `storyExists(slug, locale)` in the middleware 404s a story under the other language's URL.
- Audio: `npm run tts:histoires` prints the estimate and sends nothing. `-- --list-voices` / `-- --generate [--voice fr-FR-Neural2-A]` need `GOOGLE_TTS_API_KEY` (key restricted to Text-to-Speech) and write `public/audio/histoires/<slug>-<page>.mp3`; then `npm run db:seed` fills `StoryPage.audioUrl`. Without a file, "Écouter" uses the browser's French voice.
- **TTS for later** (not run, Google Cloud billing not active): estimate 2,186 characters for the 40 pages, inside the 1M free characters/month for Neural2/WaveNet (≈ $0.04 even at list price, about $16 per 1M; check Google's pricing page). Planned voice: a slow female fr-FR voice (fr-FR-Neural2-A, rate ≈ 0.85). The owner wants **one sample page first**, then an OK before the other 39: `--generate` currently does all pages, so add a one-page option before running it. MP3s, once there, take priority over browser speech automatically (`components/StoryAudioFr.tsx`).

### Things later phases must remember

- Each dynamic page's `generateStaticParams` receives `{ params: { locale } }`: return the French list for `fr` once it exists. Don't return `[]` for one locale (Next then prebuilds nothing for the route); the middleware already hides unwritten French pages.
- French home page (`app/[locale]/home-fr.tsx`): the worksheet links point to `/worksheets` until phase 4, which should also add a "Fiches populaires" section and accent letter blocks (é è ê ç).
- The French sounds (`lib/sons-fr.ts`, slugs also listed in `FRENCH_SOUND_SLUGS` in `lib/i18n/routes.ts`) are all French-only: `/phonics/[skill]` is in `PARAMS_DIFFER`, so English skill pages get no French hreflang, and the switcher falls back to the section index (`sectionFallbackPath`). Only `/phonics` ↔ `/fr/sons` are paired. Phase 4 can link sound pages to French phonics worksheets; phase 6 games can reuse `components/sons/SoundHunt.tsx` and `useFrenchSpeech()`.
- Phase 2 uses **Playwrite FR Trad** (Google Fonts, SIL OFL 1.1, commercial use allowed) for cursive, in `lib/fonts/cursive.ts`. Phase 4's jsPDF templates need the same font embedded (TTF) for cursive worksheets.
- French-only letters (é è ê ç) have no English twin: the switcher sends them to `/alphabet`, and `/alphabet/c-cedille` etc. 404.

## Games, school levels, activities and child language (phase 6)

- **Games** (`/fr/jeux`): `lib/games-fr.ts` (pages and round builders) and `components/games-fr/`. Five French games with French slugs, each the twin of an English game: *trouve-la-lettre* (find-the-letter), *lettre-et-image* (match-letter-picture), *premier-son* (beginning-sound), *trace-la-lettre* (letter-tracing), *quiz-alphabet* (alphabet-quiz). Same Free/Pro badges as English (not enforced, as in English). Every instruction can be heard (browser French voice); the picture words come from `LETTER_IMAGES` (`lib/fiches-fr.ts`), so first letters and first sounds are known. *Le premier son* never asks c, k, q, e or y (their first sound isn't clear by ear) and never offers two close sounds together (`CLOSE_KEYS`). *Trace la lettre* reuses `TracingCanvas` (script/cursive on Seyès-like lines), 30 letters in order. 10 rounds per game, kind end screen.
- **Translated slugs**: `TRANSLATED_PARAMS` in `lib/i18n/routes.ts` pairs English and French params for `/games/[slug]`, `/preschool/[topic]` and `/kindergarten/[topic]`. It drives hreflang, the switcher, the cookie redirect and the sitemap. A French slug missing from the map has no twin (French-only topic: canonical only, switcher falls back to the section index). Tests check the map against the data.
- **Maternelle / grande section** (`/fr/maternelle`, `/fr/grande-section`): content in `lib/ecole-fr.ts`, pages in `components/ecole/`. Three topics each: maternelle *graphisme* (French only), *tracer-les-lettres* (↔ letter-tracing), *coloriage* (↔ coloring); grande section *syllabes* (French only), *mots-outils* (↔ sight-words), *ecriture-cursive* (↔ handwriting). Each topic: intro, tips, an activity to do at home, links to fiches, games and sound pages.
- **Activités** (`/fr/activites`): 8 screen-free activities (materials + steps), each linked to a fiche, game or sound page.
- **Child language**: the add/edit child forms have a "Langue d'apprentissage" select (`ChildProfile.language`, default = the site language the profile is created on). The child page's buttons (alphabet, games, stories) open in the child's language, whatever the dashboard's; the dashboard cards show it. On a story page, children learning in the story's language are offered first. `User.locale` is set at sign-up from the page language (for future emails).
- **Sign-in fix**: after login or sign-up, the forms now do a full page load to the dashboard. With `router.push`, the client router reused the dashboard's pre-sign-in redirect (the header's account link is prefetched while signed out), so new users landed on the login page. Only on this branch (`main` has no site header).
- English pages for games, preschool, kindergarten and activities moved to `*-en.tsx` unchanged; they now get hreflang. English output identical (491 routes, plus the 5 game pages checked separately).

## Worksheets (phase 4)

- Catalogue: `lib/fiches-fr.ts` (categories, worksheets, packs, and the content they draw: letter pictures, numbers, shapes, colours, mots-outils, syllables). Pages: `app/[locale]/worksheets/**/*-fr.tsx`.
- **The PDFs are pre-rendered, not made in the browser.** jsPDF doesn't apply OpenType shaping, so cursive letters don't join. `npm run fiches:fr` (`scripts/fiches-fr/`) renders HTML/SVG templates with Playwright's Chromium into `public/fiches-pdf/<category>/<slug>.pdf`, a JPEG preview per page (`apercus/`) and the packs (`packs/`): 519 files, about 33 MB. Re-run it after changing a template or the catalogue (`npm run fiches:fr -- lettre-b-,son-ou` renders a subset), then commit the files. `tests/i18n/fiches-fr.test.ts` fails if a PDF or preview is missing.
- Fonts (only in the generator, never served): Playwrite FR Trad and Noto Emoji (static instances with overlaps removed, OFL, no Reserved Font Names), Andika (OFL, unmodified: its name is reserved). Licences and changes in `scripts/fiches-fr/fonts/README.md`. Pictures are Noto Emoji in black and white, outlined for colouring.
- `/fr/alphabet/[letter]/fiche` now downloads the pre-rendered tracing and cursive PDFs; the English jsPDF tracing template is back to its `main` version.
- Git for Windows converts PDFs to text in `git diff` (`astextplain`), so never move PDFs between worktrees with `git diff | git apply`: copy the files.

## Testing

Scripts in `scripts/i18n-check/` (run against `next start`, usually on port 3100 or 3400):

- `snapshot.mjs <outDir> [baseUrl]`: saves a digest (title, meta, canonical, JSON-LD, links, visible text) and the HTML of every English URL in the sitemap.
- `compare.mjs <baselineDir> <currentDir>`: route-by-route diff (hreflang ignored, header excluded). Make the baseline from `main` built in a worktree at the start of a phase; English must stay identical apart from intended changes.
- `frcheck.mjs [baseUrl]`: French pages (status, `lang="fr"`, titles, canonical/hreflang), every internal link on them, and the routing rules (404s, `/en` redirect, dashboard login, language cookie, no Accept-Language redirect). Its "English-looking text" check has false positives (French words like *parents*, *session*, *sons*, and words like *préparent*: `é` breaks its word boundary).
- `browser.mjs [baseUrl] [shotsDir]`: Playwright checks of the switcher, cookie, French forms, cookie banner, mobile menu and 390px layout, each phase's pages (games are played with fake voices), with screenshots. `LIVE=1` skips the contact form (for checks against alphabes.com). With `CHECK_ACCOUNTS=1` (never on production) it also signs up a throwaway account (`i18n-check-<time>@example.com`) on the database in `.env` (Neon **dev** only) to test the child language; delete those accounts afterwards with `node scripts/i18n-check/cleanup-accounts.mjs`.
- The English snapshot only covers sitemap URLs: the English game pages (`/games/<slug>`) aren't in the sitemap, so compare them separately when touching games.
- Unit tests: `npx vitest run` (`tests/i18n/`).

## Open issues

- The phase 6 texts (maternelle and grande section hubs and topics, activities, game help for parents) should get the same native-teacher review as the stories and sound pages.
- English and French pages share one route bundle, so the English worksheet pages now load next-intl's localized `Link` too (about +14 kB of JavaScript, as on the alphabet pages).
- Regenerating the worksheets rewrites every PDF (Chromium stamps a creation date), so only re-run it when something changed.
- The English 404 page no longer has `og:image`/`twitter:image` tags (`global-not-found` doesn't get root file metadata). Harmless on a noindex page.
- `experimental.globalNotFound` is experimental in Next 15.5 (stable in Next 16). Re-test 404s after any Next upgrade.
- The build pre-renders French copies of English-only pages (unreachable, the middleware 404s them) until each phase adds French content: about 1,140 pages instead of about 575.
- Each page is about 1–1.7 KB (gzip) heavier, mostly the new header.
- The legacy `/privacy` page has no French version (the footer links `/privacy-policy`).
- Legal pages in both languages are marked "placeholder, needs legal review".
- No emails are sent by the app yet; when some are added (password reset, welcome), make them language-aware using `User.locale`.
- `app/[locale]/dashboard/[id]` still calls `notFound()` for someone else's child (private page, empty shell in the server HTML; fine in the browser).
