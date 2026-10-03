# Portuguese version of AlphaBes: plan and status

Last updated: 2026-10-03 (**the Portuguese version is live**: phases 0–7 done, sitemap resubmitted in Search Console by the owner; only the teacher and legal reviews (P11) remain). Read this first when continuing the Portuguese work, together with CLAUDE.md, [french-plan.md](french-plan.md) and [spanish-plan.md](spanish-plan.md): the Portuguese work reuses everything built for French and Spanish.

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

## Phase 2 notes

- **Letters** (`lib/letters-pt.ts`): the 27 entries of the approved sample in the order a, b, c, ç, d…z (`alphabetLetters` is the 26 without Ç). Each has its Brazilian name plus `otherNames` (E “ê”, O “ô”, K “capa”, W “dábliu”, “vê duplo”, Y “i grego”), IPA, the family the sound button reads (ba, be, bi, bo, bu), a note “Para a família” and an FAQ. Brazilian pronunciation is the default (di/ti “dji/tchi”, l at the end of a syllable as u, final e and o as i and u, strong and weak r, s as z between vowels), with Portugal mentioned where useful. Y's second word shows “fazer yoga” (the article of *yoga/ioga* varies). The tests reject Portugal-only words and Spanish words.
- **Pages:** `/pt/alfabeto` (26 cards + Ç card, dashed, “não é uma letra nova”; “Os quatro tipos de letra”), `/pt/alfabeto/[letter]` (`letter-pt.tsx`; “A” works like “a”; Ç is `c-cedilha`, `/pt/alfabeto/ç` 404s), `/pt/alfabeto/acentos` (`acentos-pt.tsx`: agudo, circunflexo, til, grave, and a box saying the cedilha is not an accent), `/pt/alfabeto/[letter]/atividade` (tracing), `/pt/cartoes`. The letter pages get their syllable link in phase 3 and their printable sheets in phase 4 (as `letter-es.tsx` has them); the tracing page gets its PDF downloads in phase 4.
- **Cursive (P6):** Playwrite BR, `lib/fonts/cursive-pt.ts`. Licence checked 2026-10-03 at google/fonts (`ofl/playwritebr/OFL.txt`): SIL OFL 1.1, “Copyright 2023 The Playwrite Project Authors”, no Reserved Font Name. Measured: x-height 0.50 em, capitals and loops to about 1.15 em, tails to −0.65 em, every Portuguese character present. Phase 4 embeds a static TTF in the PDF generator, as for Playwrite MX.
- **Tracing:** `TracingCanvas` takes `prints` (several print styles before cursive: *Bastão* “A”, *Forma* “a”) and the ruling `"caligrafia"`: the four lines of the Brazilian *caderno de caligrafia*, spaced 1.3 x-heights above the middle line and below the baseline to fit Playwrite BR, centred on the canvas. English, French and Spanish canvases are unchanged (same buttons and labels).
- **Routing:** `c-cedilha` and `acentos` are Portuguese-only (`LOCALE_ONLY_PARAMS.pt`); `PORTUGUESE_VALIDATORS` lists the letter params; switching language on Ç or the accents page goes to the other language's alphabet, and Spanish ñ / French ç go to `/pt/alfabeto`.

## Phase 3 notes

- **Pages** (`lib/silabas-pt.ts`, slugs also in `PORTUGUESE_SYLLABLE_SLUGS`): 24 instead of the ~25 planned, because two planned pages would have repeated others: “r forte e fraco” is part of `rr` (“O R forte e o RR”) and “s com som de z” is part of `ss` (“O SS e o S com som de Z”); “g-e-gu” became `g-e-j` (ga/go/gu, ge/gi and the j), since `gu` has its own page. Groups: *As vogais e as famílias silábicas* (vogais, encontros-vocalicos, familias-silabicas, contar-silabas), *Os dígrafos* (ch, lh, nh, rr, ss, qu, gu), *Os sons nasais* (til, an-en-in-on-un, am-em-im-om-um), *As sílabas complexas* (encontros-com-r, encontros-com-l, ar-er-ir-or-ur, as-es-is-os-us, al-el-il-ol-ul, c-e-cedilha, g-e-j, x, h-inicial), *Ler com fluência* (palavras-frequentes). Picture hunts on 15 pages, with minimal pairs (sono/sonho, pato/prato, carro/pera, casa/osso, anel/chapéu, guitarra/pinguim).
- **Brazilian points written in:** the r and the s at the end of a syllable vary by region (all correct, same spelling); the l at the end of a syllable is u (“sau”) with the tip “sal → salgado”; “m antes de p e b”; the trema was abolished in 2009 (pinguim, linguiça: the u is heard); the BNCC expects children to read by the end of the 2º ano.
- **Speech:** family tiles and the syllable builder say `ptSyllableSpoken(s)`: open e and o as in class (“bé”, “bó”, “lhé”), so a voice doesn't read “be” as the letter name “bê”. Syllables inside real words (Monte a palavra, Bata palmas) are read as written.
- **Components:** `WordBuilder` and `SyllableClap` take `locale` ("es" default, Spanish unchanged), `SoundHunt` and `SyllableBuilder` gained Portuguese labels. The builder offers p, b, t, d, f, v, m, n, l, s, j, r, ch, lh, nh (c and g have their own pages).
- **Links:** letter pages link to their syllable page (`SYLLABLE_PAGE` in `letter-pt.tsx`; k, w, y have none); the home page's syllable cards link to vogais, familias-silabicas, ch and til. `ch` exists in Spanish and Portuguese but they are not twins (the switcher goes to the other index).
- The syllable pages get their printable sheets in phase 4.

## Phase 4 notes

- **Catalogue** (`lib/atividades-pt.ts`): seven sheets per letter (26 + Ç): `letra-<l>-bastao`, `-forma`, `-cursiva`, `-reconhecer` (the four kinds of letter in one grid), `-silaba` (22 letters: none for Ç, K, Q, W, Y), `-colorir`, `-palavras`; themes `numero-0`…`numero-20` (on quadriculado, “quatorze”), `forma-<shape>` (8), `cor-<colour>` (10: marrom, cinza…), `palavras-frequentes-1`…`5`; syllables: 19 `familia-*` (including ca-co-cu, ce-ci, c-cedilha, ga-go-gu, ge-gi), 7 `digrafo-*`, 3 `nasal-*`, 15 `encontro-*` / `final-r|s|l`. Words on syllable sheets are split the Brazilian way: rr and ss are divided (car-ro, pás-sa-ro); a test checks it. Each syllable sheet lists the syllable pages that show it (`SyllableSheet.pages`), and every syllable page shows its sheets except vogais, encontros-vocalicos, contar-silabas, h-inicial and palavras-frequentes.
- **Generator:** `scripts/atividades-pt/generate.ts` + `templates.ts`, `npm run atividades:pt` (or `-- familia-b,letra-a-` for a subset, `--packs=pacote-digrafos` for some packs). Font: `scripts/atividades-pt/fonts/PlaywriteBR-Regular.ttf`, a static weight-400 instance of the variable font with overlaps removed (`fonttools varLib.instancer … wght=400 --remove-overlaps`), licence next to it; Andika and Noto Emoji from `scripts/fiches-fr/fonts/`. The shared `fill`/`layoutFills` know a third cursive font, `cur-pt`; no French or Spanish PDF was regenerated. Rendering everything took about 2 minutes here (2026-10-03).
- **Rulings:** caligrafia = top line 2.3 x-heights above the baseline, dashed middle line at 1, baseline, bottom line 1.3 below (Playwrite BR's loops and tails), 5 x-heights per row. Print sheets (bastão, forma) use the four-line print guide sized to Andika.
- **Files:** `public/atividades-pdf/<category>/<slug>.pdf`, `previas/<slug>.jpg`, `pacotes/<slug>.pdf`. Some sheet slugs are the same words as Spanish ones (`letra-a-cursiva`, `numero-3`): harmless, they live under `/pt/atividades` and `/es/fichas` and are never paired.
- **Links:** letter pages list their seven sheets and their pack; the tracing page downloads the bastão, forma and cursive PDFs; syllable pages show their sheets and the sheets link back; the home page shows “Atividades populares”.

## Phase 5 notes

- **Stories:** `portugueseStories` in `prisma/stories-data.ts`, the 8 approved titles and slugs, same pictures and order as the other languages (`translationGroup` apple … lion). Characters: Bia (apple), Beto and his friend Tuca, Mimi, Totó, Lili and a sapinho, Bolinha and a caranguejinho, Juju the owl and a ratinho, Leo. Brazilian words and forms (cachorrinho, tirar uma soneca, esconde-esconde, “Vem nadar comigo!”), “ ” quotation marks. `tests/i18n/stories.test.ts` checks twins, slugs, no Portugal-only words (with “bebê”, not “bebé”), no Spanish words (compared with accents kept, so “lá” is not “la”), quotes closed.
- **Database:** seeded on the Neon `dev` branch on 2026-10-03 with `node --env-file=.env node_modules/tsx/dist/cli.mjs prisma/seed-stories.ts` (host checked: `ep-shiny-breeze-b1bguixr`). Checked read-only: 8 stories, 40 pages, 8 translation groups per language. Production at launch (phase 7), after the deploy.
- **Pages:** `/pt/historias` (`stories-pt.tsx`, stories with `locale = PT`), `/pt/historias/[slug]` (the shared story page: Portuguese title “… : uma história para ler e ouvir”, description and breadcrumb). The reader's “🔊 Ouvir” / “⏹ Parar” (`StoryAudio`, written in phase 1) reads with the browser's Brazilian voice, then any pt voice; no recorded audio.

## Phase 6 notes

- **Games** (`/pt/jogos`): `lib/jogos-pt.ts` and `components/jogos-pt/` (the French games' feedback line and button styles, Portuguese score and end screen). Six games: *encontre-a-letra*, *letra-e-figura*, *silaba-inicial*, *trace-a-letra*, *quiz-do-alfabeto* (twins of the five English games) and *bata-palmas*, twin of the Spanish *aplaude-las-silabas* (`{ es, pt }` group in `TRANSLATED_PARAMS`, no English page, so no x-default). Same Free/Pro badges as English; *bata-palmas* is free. The games use the 26 letters (Ç is not one of them), except *trace-a-letra*, which traces the 26 and Ç (4th) on caligrafia lines.
- **Sound rules** (`soundAlike`, `syllableSound`, Brazilian pronunciation): ce/ci and ç → s, ca/ka/que → k, ge/gi → j, gue → g, initial x → ch, silent h; e and i count as alike (estrela is often “istrela”). Unlike Spanish, z ≠ s and b ≠ v. *Com que sílaba começa?* only asks open first syllables heard as written (no h, x, ce/ci, ge/gi, accents, closed syllables or diphthongs). Bug found by the tests and fixed: stripping accents (NFD) also strips the cedilla, so ç is turned into s first.
- **Educação infantil / 1º ano** (`/pt/educacao-infantil`, `/pt/primeiro-ano`): content in `lib/escola-pt.ts`, pages in `components/escola/`. Educação infantil (3 a 5 anos): *coordenacao-motora* (Portuguese only), *tracar-as-letras* (↔ letter-tracing, letra bastão first), *colorir* (↔ coloring). 1º ano (6 a 7 anos): *familias-silabicas* (Portuguese only), *palavras-frequentes* (↔ sight-words), *letra-cursiva* (↔ handwriting). The 1º ano hub cites the BNCC goal (literacy by the end of the 2º ano).
- **Brincadeiras** (`/pt/brincadeiras`): 8 screen-free activities, each linked to a game, worksheet or syllable page, including “Eu vejo” com sílabas, *alfabeto móvel de tampinhas*, *bingo das letras* and *jogo da memória*.
- **Wording:** `tests/i18n/jogos-pt.test.ts` checks the game, school and activity texts against Portugal-only words (plasticina, ecrã, equipa, “está a” + infinitive…) and Spanish words, and that every “ ” is closed.
- **Child language:** “Português” in the add/edit child forms (`ChildForm.langPT` in the four message files), `PT` branches in `Dashboard.language` and `ChildDashboard.language`, `PT` accepted by the children API. A profile created on the Portuguese site defaults to Portuguese; a Portuguese child's buttons open `/pt/alfabeto`, `/pt/jogos`, `/pt/historias`.
- **Home:** the “Jogos para aprender” section lists the six games.

## Phases

| Phase | Content | Status |
|---|---|---|
| 0 | Branch; this plan; baseline snapshots of English, French **and Spanish** from `main`; `snapshot.mjs` takes Spanish by default; `localecheck.mjs pt` (handles `lang="pt-BR"`). | **Done** (2026-10-03), pushed. Baseline in `../snap-pt-base`: 1,256 routes (496 English, 382 French, 378 Spanish) from `main` 3e30909, build 1,515 pages; a second snapshot of the same build is identical, so the comparison is repeatable. On that build `localecheck` passes for `fr`, `es` and `pt` (`pt`: 9 routing rules, every `/pt` URL 404s until phase 1), 334 browser checks pass. tsc, lint and 189 unit tests pass on the branch. |
| 1 | Four-language foundation, header switcher (P12), `messages/pt.json`, Portuguese UI pages (home, quem somos, preços, contato, entrar, cadastro, minha conta, legal LGPD placeholders, cookies), Portuguese 404, API errors, `PT` migration on `dev`. | **Done** (2026-10-03), pushed. English, French and Spanish identical to the baseline (1,256 routes) apart from hreflang: the 7 twins of the Portuguese pages in each language (21 pages) each gained one `hreflang="pt"` line, nothing else. Sitemap: 1,250 URLs, 7 Portuguese ones with four-way alternates. `localecheck pt`, `fr` and `es` pass, 411 browser checks, 205 unit tests, build 2,079 pages (was 1,515). See "Phase 1 notes". |
| 2 | Alfabeto: `lib/letters-pt.ts` (26 + Ç + acentos), chart, letter pages with the 4 tipos de letra, cartões, speech (P10), tracing canvas bastão/forma/cursiva, Playwrite BR licence check. | **Done** (2026-10-03), pushed. English, French and Spanish identical to the baseline apart from hreflang: since phase 1, 86 pages gained one `hreflang="pt"` line (the alphabet, the 26 letters and the cards in the three languages, and the sample A tracing page in English and French), nothing removed. Sitemap: 1,280 URLs, 37 Portuguese. `localecheck pt`, `fr`, `es` pass, 440 browser checks, 221 unit tests, build 2,082 pages. See "Phase 2 notes". |
| 3 | Sílabas: ~25 pages, builders, clapping, picture hunt. | **Done** (2026-10-03), pushed. 24 pages (see "Phase 3 notes"). English, French and Spanish identical to the baseline apart from hreflang: since phase 2 only `/phonics`, `/fr/sons` and `/es/silabas` gained one `hreflang="pt"` line. Sitemap: 1,305 URLs, 62 Portuguese. `localecheck pt`, `fr`, `es` pass, 466 browser checks (exercises played with a fake pt-BR voice), 240 unit tests, build 2,098 pages (the first build attempt failed fetching Google Fonts in `next/font`, as on 2026-10-02; the retry passed). |
| 4 | Atividades para imprimir: PDFs and pacotes (P6). | **Done** (2026-10-03), pushed. 272 sheets and 43 packs (587 files, 40 MB), see "Phase 4 notes". English, French and Spanish identical to the baseline apart from hreflang: since phase 3 only `/worksheets`, `/worksheets/bundles`, `/fr/fiches`, `/fr/fiches/packs`, `/es/fichas`, `/es/fichas/paquetes` gained one `hreflang="pt"` line. Sitemap: 1,637 URLs, 394 Portuguese. `localecheck pt`, `fr`, `es` pass, 486 browser checks (a Portuguese PDF downloaded and checked), 260 unit tests, build 2,022 pages. |
| 5 | Histórias: 8 stories, seed `dev`, Portuguese voice reader. | **Done** (2026-10-03), pushed. English, French and Spanish identical to the baseline apart from hreflang: since phase 4 only the three story lists and the 24 English, French and Spanish stories gained one `hreflang="pt"` line (27 pages). Sitemap: 1,646 URLs, 403 Portuguese; each story lists its four twins. `localecheck pt`, `fr`, `es` pass, 513 browser checks (Portuguese story read with a fake pt-BR voice; no-voice help), 264 unit tests, build 2,022 pages. Seeded on `dev` only. See "Phase 5 notes". |
| 6 | Jogos (P9), educação infantil, primeiro ano, brincadeiras, "Português" in the child language select, games on the home page. | **Done** (2026-10-03), pushed. English, French and Spanish identical to the baseline apart from hreflang: since phase 5, the 39 English, French and Spanish twins of the new pages gained one `hreflang="pt"` line, and the Spanish *aplaude-las-silabas* (no hreflang before) gained `es` and `pt`, now paired with *bata-palmas*. Sitemap: 1,662 URLs, 419 Portuguese. `localecheck pt`, `fr`, `es` pass, 562 browser checks (every game played with a fake pt-BR voice), 580 with `CHECK_ACCOUNTS=1` on `dev` (child language and a Portuguese sign-up; `User.locale = PT` checked read-only; the two throwaway accounts removed), 281 unit tests, build 2,025 pages. See "Phase 6 notes". |
| 7 | Launch (below). | **Done** (2026-10-03), including the Search Console resubmission (owner). Backup branch `backup-before-portuguese-launch-2026-10-03`; owner ran `prisma migrate deploy`, `main` fast-forwarded to aaf4716 and deployed by Workers Builds, owner ran `db:seed` (32 stories). The seed landed a few minutes before the deploy went live, so the 24 English, French and Spanish story pages returned 500 until it did (see "Launch incident"). Live checks passed (step 5). |

### Launch (phase 7)

Order as for Spanish: **migrate, deploy, then seed**. The live Prisma client knows only EN, FR, ES; Portuguese stories in the database before the deploy would break or pollute the live sitemap and story lists.

#### Before the launch (2026-10-03)

- `portuguese-version` is pushed up to phase 6 (`dadb121`); `origin/main` is 3e30909, an ancestor, so step 3 is a plain fast-forward.
- **Production checked read-only** (branch `production`, `br-divine-boat-b1dq055o`, project `dawn-hat-12644431`): 4 migrations applied, none rolled back (`0_baseline`, `20260908075129_cascade_story_deletes`, `20260930050000_story_locale`, `20261001220000_locale_es`); `Locale` = `EN, FR, ES`; stories EN 8, FR 8, ES 8 (120 pages); 6 users, 4 child profiles. So `20261003030000_locale_pt` is the only pending migration.
- **Backup made:** Neon branch `backup-before-portuguese-launch-2026-10-03`, id **`br-late-glade-b18it3re`**, from `production` at LSN `0/4F8B9F0` (2026-10-03 18:02 UTC), no compute. If production ever has to go back to this state, the owner restores `production` from this branch in the Neon console (Branches → production → Restore); that overwrites production, so it is never done without the owner. Delete it once the launch has been stable for a few weeks.

#### Steps

1. ~~With the owner's OK, I create the Neon backup branch from `production` (no compute), after a read-only check of production.~~ **Done**, see above.
2. **Done.** The owner runs, from the repo folder, with the **production** connection string (never stored in `.env`):
   ```powershell
   $env:DATABASE_URL = "<production connection string>"
   npx prisma migrate deploy      # adds PT to the Locale enum
   Remove-Item Env:DATABASE_URL
   ```
   Done 2026-10-03: checked read-only afterwards, `Locale` = `EN, FR, ES, PT`, 5 migrations, none rolled back, data unchanged, live pages 200. Expected: "1 migration found to apply" (`20261003030000_locale_pt`). Adding an enum value is harmless for the live site: the live Prisma client simply never uses `PT`. Then I check read-only that `Locale` = `EN, FR, ES, PT` and `_prisma_migrations` has 5 rows, and that the live site still works.
3. **Done** (`3e30909..aaf4716`; `/pt` returned 200 about 4½ minutes after the push). Fast-forward `main` to `portuguese-version` and push (`git checkout main && git merge --ff-only portuguese-version && git push origin main`); Workers Builds deploys. I watch the build until the new version is live (`/pt` returns 200).
4. **Done** (but see "Launch incident"). The owner seeds right after the deploy:
   ```powershell
   $env:DATABASE_URL = "<production connection string>"
   npm run db:seed                # upserts 32 stories; EN, FR, ES unchanged
   Remove-Item Env:DATABASE_URL
   ```
   Then I check read-only: 8 stories and 40 pages in each of the four languages. **Checked**: EN, FR, ES, PT each 8 stories and 40 pages; 6 users, 4 child profiles.
5. **Done 2026-10-03.** The 1,256 English, French and Spanish routes on alphabes.com are identical to the phase 6 build and to the baseline from `main` (apart from hreflang); sitemap 1,662 URLs, 419 Portuguese; all 32 stories (8 per language) return 200; `localecheck pt`, `fr`, `es` pass; `LIVE=1 browser.mjs` passed all 559 checks (`LIVE` skips the checks that send a contact message). A first run stopped on "download.saveAs: canceled" for a French PDF; the PDFs were served correctly (200, `application/pdf`) and the rerun passed, so it was a one-off. Planned checks: EN/FR/ES snapshot of alphabes.com compared with the baseline (only hreflang and the header may differ), `localecheck pt`, `fr`, `es`, `LIVE=1 browser.mjs`, and `/pt/historias` lists the 8 stories. Then the owner resubmits `https://alphabes.com/sitemap.xml` in Search Console (**done** 2026-10-03).

#### Launch incident (2026-10-03, a few minutes)

The owner ran `db:seed` before the deploy was live (`/pt` still 404). The old code's Prisma client knew only EN, FR, ES; each story page reads its twins in the other languages for hreflang, found the Portuguese rows and failed: all 24 English, French and Spanish story pages returned **500** (story lists, home and sitemap stayed 200). No data was lost. Nothing was changed by hand: the deploy went live minutes later and the pages came back by themselves (all 32 return 200). Cause not confirmed in the Worker logs, but the timing fits.
**Lesson for the next language:** the seed waits for my "live" message (`/<locale>` returns 200), not just for the push. If that ever goes wrong again and the build is slow or failed, the quick fix is to delete that language's stories (`DELETE FROM "Story" WHERE locale = '<X>'`, its pages cascade), with the owner's OK, then seed again after the deploy.

After launch (not blocking): a Brazilian *alfabetizadora* reviews letters, syllables, games and stories (P11); a lawyer reviews the LGPD legal pages, still marked "Texto provisório".

## Testing

As in french-plan.md and spanish-plan.md, plus:
- **Spanish snapshot comparison** (new in phase 0): `snapshot.mjs` now takes `en,fr,es` by default. Baseline from `main` in `../snap-pt-base`; compare each phase with `node scripts/i18n-check/compare.mjs ../snap-pt-base <newDir>`.
- `localecheck.mjs pt`: pages and rules filled phase by phase in `LANGS.pt`; expects `lang="pt-BR"`.
- `browser.mjs`: four-language switcher (pills and the phone menu), Portuguese forms and pages, games with a fake pt-BR voice, layout at 320/360/375/390 px.
- Unit tests for the Portuguese data (26 letters + Ç, names, first letters of words, syllable lists, no Portugal-only words, games' answers, PDFs present).

## Open issues

- Size: another ~40 MB of PDFs and ~500 more prerendered pages; report the build page count and asset size each phase.
