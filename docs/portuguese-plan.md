# Portuguese version of AlphaBes: plan and status

Last updated: 2026-10-03 (phase 0 pushed; phase 1 done, not pushed). Read this first when continuing the Portuguese work, together with CLAUDE.md, [french-plan.md](french-plan.md) and [spanish-plan.md](spanish-plan.md): the Portuguese work reuses everything built for French and Spanish.

## Goal

A full Portuguese version of AlphaBes, same look and features as the English, French and Spanish ones, written for **Brazilian** families (and usable in Portugal, Angola and Mozambique), children 3–8. Not a translation of the Spanish or English content: Brazilian letter names, the *famílias silábicas* method, *dígrafos*, nasal sounds, Brazilian example words, the handwriting Brazilian children learn (*letra bastão*, *letra de forma*, *letra cursiva*), original stories. Natural Brazilian Portuguese for children and parents.

Hard rules:
- **English, French and Spanish URLs and content stay exactly as they are.** Only hreflang (a new `pt` alternate) and the site header (the language switcher) may change. Checked with the snapshot comparison for the three languages (see Testing).
- Portuguese pages are added to the Portuguese page list only once they are written; every other `/pt` URL answers 404 in Portuguese.

## Branch workflow

- Branch `portuguese-version`, created from `origin/main` (3e30909) on 2026-10-03. Pushing it doesn't deploy (only `main` deploys).
- Fixes for the live site go on small branches from `main`; then `main` is merged into `portuguese-version`.
- At the end of each phase: `npx tsc --noEmit`, `npm run lint`, `npm run build`, `npx vitest run`, the English, French **and Spanish** comparisons, `localecheck.mjs pt` (plus `fr` and `es`) and the browser checks. Then commit and **wait for the owner's OK before pushing** and before starting the next phase.
- Build and test in a separate worktree (the owner runs `npm run dev` in the repo folder): see french-plan.md, "Branch workflow", and spanish-plan.md for stopping the `next start` server before removing the worktree.
- Never deploy from this Windows machine (CLAUDE.md, Hosting).
- Database: `.env` was checked on 2026-10-03 (read-only, URL not printed): its only database variable, `DATABASE_URL`, uses compute `ep-shiny-breeze-b1bguixr`, which Neon lists under the branch **`dev`** (`br-lively-block-b1pgc6qp`, project `dawn-hat-12644431`). No shadow database is configured. `dev` is a copy of production (reset on 2026-10-01), so it holds real user accounts. **Never use a real branch as a shadow database**: the migration is written by hand and applied with `prisma migrate deploy` only.

## Decisions (made by the owner)

**2026-10-03: the owner accepted every recommendation below.** The "Alternatives" column is kept for reference only.

| # | Topic | Decision | Alternatives |
|---|---|---|---|
| P1 | Variety | **Brazilian Portuguese** (pt-BR) for content and spelling (*você*, bebê, ônibus; Acordo Ortográfico de 1990, Brazilian forms). Internal locale and URL prefix **`pt`**, `<html lang="pt-BR">` (phones and screen readers then use a Brazilian voice), Open Graph `pt_BR`. **hreflang `pt`** (not `pt-BR`): there is no European Portuguese version, so `pt` also reaches Portugal, Angola and Mozambique, as `es` did for Spanish. | hreflang `pt-BR` (Brazil only). |
| P2 | Vocabulary | Brazilian words where Brazil and Portugal differ (xícara, abacaxi, sorvete, ônibus), a neutral word when one exists and is as good for children. A test rejects Portugal-only words (autocarro, comboio, frigorífico, chávena, ananás, casa de banho, pequeno-almoço, telemóvel, rebuçado, sumo…). | Neutral words only. |
| P3 | Addressing | **você** for parents and children; *vocês* for plural. | o senhor / a senhora. |
| P4 | Worksheets vs activities | In Brazil **"atividades" is the search word for printable worksheets** ("atividades de alfabetização para imprimir"). So worksheets → **`/pt/atividades`**, screen-free activities → **`/pt/brincadeiras`**. | `/pt/atividades` = activities, worksheets `/pt/para-imprimir`. |
| P5 | Ç and accents | The **26 letters** (K, W, Y included), plus a **Ç card right after C** on the chart, marked "cê-cedilha, não é uma letra nova", with its own page `/pt/alfabeto/c-cedilha` (Brazilian alphabet charts usually show it). One **"Acentos e til"** page (`/pt/alfabeto/acentos`): á â ã é ê í ó ô õ ú, and à only as a short note for parents (crase is beyond 3–8). | Accents on the letter pages. |
| P6 | Handwriting | The **"4 tipos de letra"** Brazilian teachers present: **letra bastão** (capital print, the first style in educação infantil), **letra de forma** (lowercase print), **letra cursiva** capital and lowercase, on *caderno de caligrafia* guide lines, in **Playwrite BR** (TypeTogether's Brazilian school cursive; licence to be checked in phase 2 as for Playwrite MX and FR Trad). The tracing canvas toggles *bastão / forma / cursiva*. Numbers on *quadriculado*. | Forma + cursiva only. |
| P7 | School levels | `preschool` → **`/pt/educacao-infantil`** (pré-escola, 4–5 years, plus 3-year-olds), `kindergarten` → **`/pt/primeiro-ano`** (1º ano do ensino fundamental, 6 years, the literacy year). Every page states the ages. | `/pt/pre-escola`. |
| P8 | Prices | "**US$ 7,99**" with "Preços em dólares americanos (USD)"; a bare "$" reads as reais. Stripe stays paused. | — |
| P9 | Games | The 5 twins of the English games, with "first sound" → **"sílaba inicial"**, plus **`bata-palmas`** (clap the syllables), paired with the Spanish *aplaude-las-silabas*. | The 5 twins only. |
| P10 | Audio | Browser speech: **pt-BR first, then any `pt-*` voice** (pt-PT). A Portuguese message with Android, iPhone/iPad and Windows help when the device has no Portuguese voice. An English, French or Spanish voice never reads Portuguese. No paid TTS. | — |
| P11 | Review and legal | A Brazilian *alfabetizadora* reviews letters, syllables and stories (after launch is fine, as for Spanish). Legal pages are placeholders, "needs legal review", citing the **LGPD** (Lei 13.709/2018; art. 14: a parent's consent for children's data) next to the GDPR and Moroccan law 09-08. | — |
| P12 | Header at 390 px | With three buttons the header already needs 379 px; a fourth pill (~40 px) doesn't fit. **Below 640 px the switcher becomes one button showing the current language ("PT ▾") that opens a list of the 4 languages**; from 640 px the 4 pills stay. This changes the phone header for every language (allowed: only hreflang and the header may differ). Checked at 320, 360, 375 and 390 px. | Narrower pills (tap targets ~28 px, too small). |

### Portuguese URLs

Internal pathname → Portuguese URL. Pages without an entry have no Portuguese version (blog, legacy `/privacy`).

| Internal | Portuguese | Internal | Portuguese |
|---|---|---|---|
| `/` | `/pt` | `/phonics` | `/pt/silabas` |
| `/about` | `/pt/quem-somos` | `/phonics/[skill]` | `/pt/silabas/[skill]` |
| `/activities` | `/pt/brincadeiras` | `/preschool` | `/pt/educacao-infantil` |
| `/alphabet` | `/pt/alfabeto` | `/preschool/[topic]` | `/pt/educacao-infantil/[topic]` |
| `/alphabet/[letter]` | `/pt/alfabeto/[letter]` | `/pricing` | `/pt/precos` |
| `/alphabet/[letter]/worksheet` | `/pt/alfabeto/[letter]/atividade` | `/privacy-policy` | `/pt/politica-de-privacidade` |
| `/contact` | `/pt/contato` | `/register` | `/pt/cadastro` |
| `/cookies` | `/pt/cookies` | `/stories` | `/pt/historias` |
| `/dashboard` | `/pt/minha-conta` | `/stories/[slug]` | `/pt/historias/[slug]` |
| `/dashboard/[id]` | `/pt/minha-conta/[id]` | `/terms` | `/pt/termos-de-uso` |
| `/flashcards` | `/pt/cartoes` | `/worksheets` | `/pt/atividades` |
| `/games` | `/pt/jogos` | `/worksheets/[category]` | `/pt/atividades/[category]` |
| `/games/[slug]` | `/pt/jogos/[slug]` | `/worksheets/bundles` | `/pt/atividades/pacotes` |
| `/kindergarten` | `/pt/primeiro-ano` | `/worksheets/bundles/[bundleSlug]` | `/pt/atividades/pacotes/[bundleSlug]` |
| `/kindergarten/[topic]` | `/pt/primeiro-ano/[topic]` | `/login` | `/pt/entrar` |

Translated params (twins): games *encontre-a-letra* (find-the-letter), *letra-e-figura* (match-letter-picture), *silaba-inicial* (beginning-sound), *trace-a-letra* (letter-tracing), *quiz-do-alfabeto* (alphabet-quiz), *bata-palmas* (↔ es *aplaude-las-silabas*). Educação infantil: *tracar-as-letras* (letter-tracing), *colorir* (coloring), Portuguese-only *coordenacao-motora*. Primeiro ano: *palavras-frequentes* (sight-words), *letra-cursiva* (handwriting), Portuguese-only *familias-silabicas*. Letter slugs: `a` … `z`, Portuguese-only `c-cedilha` and `acentos`.

## Sample alphabet (approved)

26 letters + Ç. Brazilian name in italics; two example words with emoji.

| Letter | Name | Words | Note for parents |
|---|---|---|---|
| A a | *a* | Abelha 🐝 · Avião ✈️ | |
| B b | *bê* | Bola ⚽ · Baleia 🐳 | |
| C c | *cê* | Casa 🏠 · Cebola 🧅 | Hard in ca, co, cu; = s in ce, ci. Ç comes next. |
| Ç ç | *cê-cedilha* | Maçã 🍎 · Palhaço 🤡 | Not a new letter; never starts a word; ça, ço, çu. |
| D d | *dê* | Dado 🎲 · Dente 🦷 | *de/di* sound "dji" in most of Brazil (dia); spelling stays d. |
| E e | *é* | Elefante 🐘 · Estrela ⭐ | Open é (café), closed ê (bebê). |
| F f | *efe* | Foca 🦭 · Flor 🌸 | |
| G g | *gê* | Gato 🐱 · Girafa 🦒 | Hard in ga, go, gu; like j in ge, gi; gue/gui. |
| H h | *agá* | Helicóptero 🚁 · Hipopótamo 🦛 | Silent at the start of a word; part of ch, lh, nh. |
| I i | *i* | Iguana 🦎 · Ilha 🏝️ | |
| J j | *jota* | Jacaré 🐊 · Janela 🪟 | |
| K k | *cá* | Kiwi 🥝 · Karaokê 🎤 | Borrowed words and names (Kátia). |
| L l | *ele* | Leão 🦁 · Lua 🌙 | At the end of a syllable it sounds like u in Brazil (sal, papel). |
| M m | *eme* | Macaco 🐒 · Mala 🧳 | Usually the first família silábica taught. |
| N n | *ene* | Navio 🚢 · Nuvem ☁️ | |
| O o | *ó* | Ovo 🥚 · Ovelha 🐑 | Open ó (avó), closed ô (avô). |
| P p | *pê* | Pato 🦆 · Peixe 🐟 | |
| Q q | *quê* | Queijo 🧀 · Quatro 4️⃣ | Always qu; u silent in que/qui, heard in qua. |
| R r | *erre* | Rato 🐭 · Relógio ⌚ | Strong at the start and in rr (carro), weak between vowels (caro). |
| S s | *esse* | Sapo 🐸 · Sol ☀️ | Sounds z between vowels (casa); ss (pássaro). |
| T t | *tê* | Tartaruga 🐢 · Tomate 🍅 | *te/ti* sound "tchi" in most of Brazil (tia). |
| U u | *u* | Uva 🍇 · Urso 🐻 | |
| V v | *vê* | Vaca 🐄 · Vulcão 🌋 | |
| W w | *dáblio* | Kiwi 🥝 · Waffle 🧇 | Sounds u or v; names (Wagner, Wesley). |
| X x | *xis* | Xícara ☕ · Abacaxi 🍍 | Several sounds (xícara, táxi, exame, próximo); only the "ch" sound for ages 3–8. |
| Y y | *ípsilon* (also *i grego*) | Yakisoba 🍜 · Yoga 🧘 | Borrowed words and names (Yasmin). |
| Z z | *zê* | Zebra 🦓 · Zero 0️⃣ | |

Other names shown beside the main one where children hear them: K *cá* (also *capa*), W *dáblio* (also *dábliu*, *vê duplo* in Portugal), Y *ípsilon* (also *i grego*).

"Acentos e til" page: sofá 🛋️ (á), lâmpada 💡 (â), mão ✋ / maçã 🍎 (ã), café ☕ (é), bebê 👶 (ê), avó 👵 (ó), avô 👴 / robô 🤖 (ô), limões 🍋 (õ), coração ❤️ (ç + ã); à as a note for parents.

## The syllables section (`/pt/silabas`)

Portuguese is taught syllable by syllable in Brazilian schools: vowels → *famílias silábicas* → *dígrafos* → nasal sounds → *sílabas complexas*. About 25 pages in that order (slugs fixed in phase 3, `lib/silabas-pt.ts`):

- **Vogais e famílias silábicas:** `vogais`, `encontros-vocalicos` (ai, ei, oi, ou, au, eu, ui), `familias-silabicas` (syllable builder ba-be-bi-bo-bu, "Monte a palavra" with movable syllables, the *alfabeto móvel* idea), `contar-silabas` (clapping).
- **Dígrafos:** `ch`, `lh`, `nh`, `rr`, `ss`, `qu` (que, qui, qua), `gu` (gue, gui, gua).
- **Sons nasais:** `til` (ã, õ, ão, ãe, õe), `an-en-in-on-un`, `am-em-im-om-um` (rule: m before p and b).
- **Sílabas complexas:** `encontros-com-l` (bl, cl, fl, gl, pl), `encontros-com-r` (br, cr, dr, fr, gr, pr, tr, vr), `ar-er-ir-or-ur`, `as-es-is-os-us`, `al-el-il-ol-ul`, `c-e-cedilha` (ca co cu / ce ci / ça ço çu), `g-e-gu` (ga go gu / ge gi / gue gui), `r-forte-e-fraco`, `s-com-som-de-z`, `x`, `h-inicial`.
- **Ler com fluência:** `palavras-frequentes`.

Each page: level by age, listen button, explanation, syllable tables to hear, words with the studied letters highlighted or split into coloured syllables, a sentence, a picture hunt on some pages with minimal pairs (pato/prato, cara/carro, mala/malha, pão/pau), a note for parents, FAQs, related pages and (phase 4) its printable sheets.

## Worksheets (`/pt/atividades`, P4, P6)

Same pipeline as French and Spanish: PDFs pre-rendered with Chromium by `npm run atividades:pt` (`scripts/atividades-pt/`), catalogue in `lib/atividades-pt.ts`, files committed under `public/`. Letters (26 + ç) × types: tracing *letra bastão*, tracing *letra de forma*, *letra cursiva*, recognise the letter, *sílaba inicial*, colour, write words. Themes: numbers 0–20 on *quadriculado*, shapes, colours, frequent words. Syllables: one sheet per família silábica, dígrafo, nasal group and encontro consonantal, each linked both ways with the syllable pages. Packs: whole alphabet, per category, per letter.

## Stories (`/pt/historias`)

8 original stories, same illustration scenes as the other languages (`translationGroup`), `locale = PT`, short sentences built from simple syllables first. Draft titles (the owner can change them; only the slug is in URLs):

| Group | Title | Slug |
|---|---|---|
| apple | A maçãzinha vermelha | `a-macazinha-vermelha` |
| bear | Beto, o ursinho corajoso | `beto-o-ursinho-corajoso` |
| cat | Mimi, a gatinha curiosa | `mimi-a-gatinha-curiosa` |
| dog | Totó e sua bola | `toto-e-sua-bola` |
| duck | Lili, a patinha tímida | `lili-a-patinha-timida` |
| fish | Bolinha, o peixinho | `bolinha-o-peixinho` |
| owl | Juju, a coruja sabida | `juju-a-coruja-sabida` |
| lion | A soneca do Leo | `a-soneca-do-leo` |

### Database change (phase 1, additive)

```prisma
enum Locale { EN FR ES PT }
```
One migration written by hand (no shadow database): `ALTER TYPE "Locale" ADD VALUE 'PT';`. Applied to `dev` with `prisma migrate deploy` in phase 1 (Portuguese sign-ups store `User.locale = PT`); production only at launch, by the owner. Stories seeded on `dev` in phase 5.

## Technical work: from three languages to four (phase 1)

- `i18n/routing.ts`: `locales: ["en", "fr", "es", "pt"]`, Portuguese path words.
- `lib/i18n/routes.ts`: `PORTUGUESE_PATHNAMES`, `pt` in `TRANSLATED_PARAMS` groups and `LOCALE_ONLY_PARAMS`; `alternatesFor` lists `pt` (hreflang value `pt`, P1).
- `lib/i18n/db-locale.ts` (`PT`), middleware, `known-params.ts` (`PORTUGUESE_VALIDATORS`), `story-exists.ts`, sitemap (four-way alternates).
- Remaining `locale === "fr" ? … : …` choices and the per-language objects get `pt` as each Portuguese page is written.
- `<html lang>`: `pt-BR` for Portuguese (the other languages unchanged), Open Graph `pt_BR`.
- `LanguageSwitcher` per P12; `lib/speech.ts` voice preferences per P10.
- `messages/pt.json`, Portuguese 404, API error texts.

## Phase 1 notes (things later phases must remember)

- **Adding a Portuguese page:** write the `*-pt.tsx` component, add `pt:` to its `byLocale(locale, { en, fr, es })` call in `page.tsx` (`byLocale` in `lib/i18n/routes.ts` falls back to English for a language not written yet; the middleware 404s those URLs), add the pathname to `PORTUGUESE_PATHNAMES`, the param validator to `PORTUGUESE_VALIDATORS` (`lib/i18n/known-params.ts`; until then every Portuguese param 404s), Portuguese-only params to `LOCALE_ONLY_PARAMS.pt`, twins to the `TRANSLATED_PARAMS` groups, sitemap entries for Portuguese-only pages, and the pages and rules to `LANGS.pt` in `localecheck.mjs` (move the "not written yet" rules as pages arrive). Pages that still choose with `if (locale === "fr") … if (locale === "es")` (school levels, letters, dynamic routes' `generateStaticParams`) need a `pt` branch then.
- **Database:** migration `20261003030000_locale_pt` (`ALTER TYPE "Locale" ADD VALUE 'PT'`), written by hand and checked against `prisma migrate diff --from-schema-datamodel <old> --to-schema-datamodel <new>` (no database involved). Applied to `dev` on 2026-10-03 with `prisma migrate deploy` after `migrate status` (host checked: `ep-shiny-breeze-b1bguixr`, branch `dev`). Portuguese sign-ups store `User.locale = PT` (the register API follows `routing.locales`).
- **Document language:** `<html lang="pt-BR">` and JSON-LD `inLanguage: "pt-BR"` (`HTML_LANG` in `components/LocaleDocument.tsx`), hreflang `pt`, Open Graph `pt_BR`, organization `areaServed` BR, PT, AO, MZ.
- **Header (P12):** `LanguageSwitcher` shows four pills from 640 px; below that a button with the current code ("PT ▾", accessible name "Escolher o idioma: PT") opens `#language-menu` (closes on Escape, with focus back on the button, and on a tap outside). Measuring the header showed that between 768 and 1023 px the inline section links already overflowed on `main` (about 110 px in English with three pills), so they are now inline only from 1024 px (`lg`), and the menu button covers everything below. `browser.mjs` checks the header at 320–1280 px in the four languages.
- **Speech (P10, done early):** `pt: [["pt-br"]]` then any `pt-*` voice, `LANG_TAG` pt-BR, Portuguese no-voice notice in `ListenButton` (Android, iPhone/iPad, Windows). Story reader labels ("Ouvir" / "⏹ Parar", "Próxima →", "Fim") are written; phase 5 checks them on real stories.
- **Home page** (`app/[locale]/home-pt.tsx`): letter, syllable and school-level cards become links by themselves as pages arrive (`MaybeLink`). Phase 4 adds "Atividades populares", phase 6 the list of games.
- **Child language:** not offered yet (phase 6, as for Spanish): the add/edit child forms and `Dashboard.language` / `ChildDashboard.language` need a `PT` branch in all four message files, `langPT`, and `PT` in `app/api/children` (`z.enum(["EN", "FR", "ES"])`).
- The English, French and Spanish cookie and privacy pages still say "EN / FR / ES" buttons (left unchanged so their text doesn't change); the Portuguese ones say "EN / FR / ES / PT".
- The legal pages cite the LGPD (art. 14 children, art. 18 rights, ANPD, *encarregado*), the ECA, the Código de Defesa do Consumidor (terms), and are marked "Texto provisório" (P11).

## Phases

| Phase | Content | Status |
|---|---|---|
| 0 | Branch; this plan; baseline snapshots of English, French **and Spanish** from `main`; `snapshot.mjs` takes Spanish by default; `localecheck.mjs pt` (handles `lang="pt-BR"`). | **Done** (2026-10-03), not pushed. Baseline in `../snap-pt-base`: 1,256 routes (496 English, 382 French, 378 Spanish) from `main` 3e30909, build 1,515 pages; a second snapshot of the same build is identical, so the comparison is repeatable. On that build `localecheck` passes for `fr`, `es` and `pt` (`pt`: 9 routing rules, every `/pt` URL 404s until phase 1), 334 browser checks pass. tsc, lint and 189 unit tests pass on the branch. |
| 1 | Four-language foundation, header switcher (P12), `messages/pt.json`, Portuguese UI pages (home, quem somos, preços, contato, entrar, cadastro, minha conta, legal LGPD placeholders, cookies), Portuguese 404, API errors, `PT` migration on `dev`. | **Done** (2026-10-03), not pushed. English, French and Spanish identical to the baseline (1,256 routes) apart from hreflang: the 7 twins of the Portuguese pages in each language (21 pages) each gained one `hreflang="pt"` line, nothing else. Sitemap: 1,250 URLs, 7 Portuguese ones with four-way alternates. `localecheck pt`, `fr` and `es` pass, 411 browser checks, 205 unit tests, build 2,079 pages (was 1,515). See "Phase 1 notes". |
| 2 | Alfabeto: `lib/letters-pt.ts` (26 + Ç + acentos), chart, letter pages with the 4 tipos de letra, cartões, speech (P10), tracing canvas bastão/forma/cursiva, Playwrite BR licence check. | To do |
| 3 | Sílabas: ~25 pages, builders, clapping, picture hunt. | To do |
| 4 | Atividades para imprimir: PDFs and pacotes (P6). | To do |
| 5 | Histórias: 8 stories, seed `dev`, Portuguese voice reader. | To do |
| 6 | Jogos (P9), educação infantil, primeiro ano, brincadeiras, "Português" in the child language select, games on the home page. | To do |
| 7 | Launch (below). | To do |

### Launch (phase 7)

Order as for Spanish: **migrate, deploy, then seed**. The live Prisma client knows only EN, FR, ES; Portuguese stories in the database before the deploy would break or pollute the live sitemap and story lists.

1. With the owner's OK, I create the Neon backup branch `backup-before-portuguese-launch-<date>` from `production` (no compute), after a read-only check of production (migrations, `Locale` values, story counts).
2. Push `portuguese-version`. The owner runs, from the repo folder, with the **production** connection string (never stored in `.env`):
   ```powershell
   $env:DATABASE_URL = "<production connection string>"
   npx prisma migrate deploy      # adds PT to the Locale enum
   Remove-Item Env:DATABASE_URL
   ```
3. Fast-forward `main` to `portuguese-version` and push; Workers Builds deploys.
4. The owner seeds right after the deploy:
   ```powershell
   $env:DATABASE_URL = "<production connection string>"
   npm run db:seed                # upserts 32 stories; EN, FR, ES unchanged
   Remove-Item Env:DATABASE_URL
   ```
5. Live checks (EN/FR/ES comparison, `localecheck pt fr es`, `LIVE=1 browser.mjs`), then the owner resubmits the sitemap in Search Console.

## Testing

As in french-plan.md and spanish-plan.md, plus:
- **Spanish snapshot comparison** (new in phase 0): `snapshot.mjs` now takes `en,fr,es` by default. Baseline from `main` in `../snap-pt-base`; compare each phase with `node scripts/i18n-check/compare.mjs ../snap-pt-base <newDir>`.
- `localecheck.mjs pt`: pages and rules filled phase by phase in `LANGS.pt`; expects `lang="pt-BR"`.
- `browser.mjs`: four-language switcher (pills and the phone menu), Portuguese forms and pages, games with a fake pt-BR voice, layout at 320/360/375/390 px.
- Unit tests for the Portuguese data (26 letters + Ç, names, first letters of words, syllable lists, no Portugal-only words, games' answers, PDFs present).

## Open issues

- Size: another ~40 MB of PDFs and ~500 more prerendered pages; report the build page count and asset size each phase.
