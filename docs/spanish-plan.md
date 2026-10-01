# Spanish version of AlphaBes: plan and status

Last updated: 2026-10-02 (phase 3 done). Read this first when continuing the Spanish work, together with CLAUDE.md and [french-plan.md](french-plan.md) (the Spanish work reuses everything built there).

## Goal

A full Spanish version of AlphaBes, same look and features as the English and French ones, written for Spanish-speaking families (Mexico, the rest of Latin America, US Hispanic families, and understandable in Spain), children 3–8. Not a translation of the English or French content: Spanish letter names, the syllable method (*método silábico*), Spanish example words, Spanish school handwriting, original stories. Natural Spanish for children and parents.

Hard rules:
- **English URLs and content stay exactly as they are**, and so do the **French** ones. Only hreflang (a new `es` alternate) and the site header (a third switcher button) may change. Checked with the snapshot comparison for both languages (see Testing).
- Spanish pages are added to the Spanish page list only once they are written; every other `/es` URL answers 404 in Spanish.

## Branch workflow

- Branch `spanish-version`, created from `origin/main` (4894cd3) on 2026-10-01. Pushing it doesn't deploy (only `main` deploys).
- Fixes for the live site go on small branches from `main`; then `main` is merged into `spanish-version`.
- At the end of each phase: `npx tsc --noEmit`, `npm run lint`, `npm run build`, `npx vitest run`, the English **and French** comparisons, the Spanish checks and the browser checks. Then commit and **wait for the owner's OK before pushing** and before starting the next phase.
- Build and test in a separate worktree (the owner runs `npm run dev` in the repo folder): same commands as in french-plan.md, "Branch workflow". Stop the `next start` server before removing the worktree: find its PID with `netstat -ano | grep :3400` and stop it with PowerShell `Stop-Process -Id <pid> -Force` (`taskkill` answers "not found" here); otherwise the folder stays locked.
- Never deploy from this Windows machine (CLAUDE.md, Hosting).

## Decisions (made by the owner)

**2026-10-01: the owner accepted every recommendation below, and option B for handwriting (D7).** The "Alternatives" column is kept for reference only.

| # | Topic | Recommendation | Alternatives |
|---|---|---|---|
| D1 | Variety of Spanish | **Neutral Latin American Spanish** as you asked: *ustedes* (never *vosotros*), seseo (ce/ci/z sound like s), yeísmo (ll = y). Pages for parents add a short note where Spain differs (z and ce/ci = [θ] in most of Spain). hreflang **`es`** (not `es-MX`/`es-419`) and `<html lang="es">`, so Google shows the pages to Spain and US searchers too. | hreflang `es-419` (Latin America only, Spain would get English/French) or `es-MX`. |
| D2 | Regional words | **Avoid words that change by country in teaching content** (example words, worksheets, games), and use the most widely understood one in running text. Your example *carro* is one of them (Mexico/Colombia *carro*, Argentina *auto*, Spain *coche*): I'd use *auto* or avoid it. Other traps: plátano/banana, fresa/frutilla, durazno/melocotón, jugo/zumo, pastel/torta/tarta (*torta* is a sandwich in Mexico), papa/patata, autobús/camión/colectivo/guagua, computadora/ordenador, lentes/gafas, piña/ananá. Never *coger* (vulgar in much of Latin America): *agarrar*, *tomar*. | Mexican vocabulary throughout (Mexico is the largest audience). |
| D3 | Addressing parents | **tú** for parents and children (warm, usual on Spanish-language family sites); *ustedes* for plural. | **usted** for parents (more formal, common in Mexico/Colombia for institutions). |
| D4 | Letter names | **The RAE names you listed as the main name**, with the names Latin American children often learn shown beside them: B *be* (also *be larga*, *be grande*), V *uve* (also *ve*, *ve corta*, *ve chica*), W *uve doble* (also *doble ve*, *doble u*), Y *ye* (also *i griega*), R *erre* (also *ere*). Otherwise a Mexican child hears "uve" and doesn't recognise the letter. CH and LL are not letters (since 2010; 27 letters) and are taught as syllables. | RAE names only. |
| D5 | Accents | **One "La tilde" page** (`/es/abecedario/tilde`): á é í ó ú mark the stressed syllable but don't change the vowel's sound, so they don't get letter pages; **ü** (pingüino) is explained there and on the *gue/gui/güe/güi* syllable page. **Ñ is a full letter page.** | Separate pages per accented vowel (not useful: same sound). |
| D6 | Spanish URLs | The table below. Main choices: **`/es/abecedario`** (what Spanish-speaking parents search: "abecedario para niños"), **`/es/silabas`** for the sounds section, Ñ's page slug **`enie`** (an `ñ` in a URL shows as `%C3%B1` when shared). | `/es/alfabeto`; `/es/abecedario/ñ`. |
| D7 | Handwriting and ruled paper | See "Worksheets: handwriting options". **Chosen: option B** (print *letra script* as the main style + a cursive *letra ligada* version, both on *doble raya* guide lines, numbers on *cuadrícula*). | Options A and C. |
| D8 | School levels | `preschool` → **`/es/preescolar`** (3–5 years), `kindergarten` → **`/es/kinder`** (5–6 years), as you said. The word means different ages by country (in Mexico *kínder* is all of preescolar, 3–6; in Chile *kínder* is the 5–6 year), so every page states the ages ("de 3 a 5 años") and never a school grade name alone. | `/es/inicial` and `/es/preparatoria`. |
| D9 | Prices | Keep USD (as French), written **"US$7.99"** with "Precios en dólares estadounidenses (USD)". The bare "$" means pesos in Mexico, Argentina, Chile, Colombia. Stripe stays paused. | "USD 7.99". |
| D10 | Games | The 5 twins of the English games, **with "first sound" replaced by "first syllable"** (*¿Con qué sílaba empieza?*), which is how Spanish children work. **Plus one Spanish-only game: *Aplaude las sílabas*** (count a word's syllables: *ma-ri-po-sa* = 4 claps), the classic Spanish pre-reading exercise. | The 5 twins only. |
| D11 | Story audio | Browser speech as you asked: **es-MX, then es-US, then es-419/any Latin American es-\*, then es-ES, then any es** voice; a friendly Spanish message with Android/iOS/Windows hints when the device has none. No paid TTS. | — |
| D12 | Content review | A native Spanish-speaking teacher (ideally one from Mexico who knows the syllable method) reviews the letter, syllable and story pages before launch. Legal pages are written as "placeholder, needs legal review" (Mexico LFPDPPP, Spain RGPD/LOPDGDD, Argentina Ley 25.326, as well as GDPR and Moroccan law 09-08 already covered). | — |

### Spanish URLs (D6)

Internal pathname → Spanish URL. Pages without an entry here have no Spanish version (blog, legacy `/privacy`).

| Internal | Spanish | Internal | Spanish |
|---|---|---|---|
| `/` | `/es` | `/phonics` | `/es/silabas` |
| `/about` | `/es/quienes-somos` | `/phonics/[skill]` | `/es/silabas/[skill]` |
| `/activities` | `/es/actividades` | `/preschool` | `/es/preescolar` |
| `/alphabet` | `/es/abecedario` | `/preschool/[topic]` | `/es/preescolar/[topic]` |
| `/alphabet/[letter]` | `/es/abecedario/[letter]` | `/pricing` | `/es/precios` |
| `/alphabet/[letter]/worksheet` | `/es/abecedario/[letter]/ficha` | `/privacy-policy` | `/es/politica-de-privacidad` |
| `/contact` | `/es/contacto` | `/register` | `/es/registro` |
| `/cookies` | `/es/cookies` | `/stories` | `/es/cuentos` |
| `/dashboard` | `/es/mi-cuenta` | `/stories/[slug]` | `/es/cuentos/[slug]` |
| `/dashboard/[id]` | `/es/mi-cuenta/[id]` | `/terms` | `/es/terminos-de-uso` |
| `/flashcards` | `/es/tarjetas` | `/worksheets` | `/es/fichas` |
| `/games` | `/es/juegos` | `/worksheets/[category]` | `/es/fichas/[category]` |
| `/games/[slug]` | `/es/juegos/[slug]` | `/worksheets/bundles` | `/es/fichas/paquetes` |
| `/kindergarten` | `/es/kinder` | `/worksheets/bundles/[bundleSlug]` | `/es/fichas/paquetes/[bundleSlug]` |
| `/kindergarten/[topic]` | `/es/kinder/[topic]` | `/login` | `/es/iniciar-sesion` |

Translated params (twins): games *encuentra-la-letra* (find-the-letter), *letra-y-dibujo* (match-letter-picture), *primera-silaba* (beginning-sound), *traza-la-letra* (letter-tracing), *quiz-del-abecedario* (alphabet-quiz); Spanish-only *aplaude-las-silabas*. Preescolar: *traza-las-letras* (letter-tracing), *colorear* (coloring), Spanish-only *trazos* (pre-writing strokes, *grafomotricidad*). Kínder: *palabras-frecuentes* (sight-words), *letra-cursiva* (handwriting), Spanish-only *silabas*.

## Sample alphabet (for approval)

27 letters. Name in italics; two example words with emoji, chosen to mean the same thing in every Spanish-speaking country (D2).

| Letter | Name | Words | Note for parents |
|---|---|---|---|
| A a | *a* | Avión ✈️ · Abeja 🐝 | |
| B b | *be* (be larga, be grande) | Ballena 🐳 · Barco ⛵ | Same sound as V. |
| C c | *ce* | Conejo 🐰 · Cereza 🍒 | Hard in ca, co, cu; soft (= s) in ce, ci. |
| D d | *de* | Dado 🎲 · Delfín 🐬 | |
| E e | *e* | Elefante 🐘 · Estrella ⭐ | |
| F f | *efe* | Foca 🦭 · Flor 🌸 | |
| G g | *ge* | Gato 🐱 · Girasol 🌻 | Hard in ga, go, gu; like J in ge, gi. |
| H h | *hache* | Helado 🍦 · Huevo 🥚 | Silent letter (*la h muda*). |
| I i | *i* | Iguana 🦎 · Isla 🏝️ | |
| J j | *jota* | Jirafa 🦒 · Jabón 🧼 | |
| K k | *ka* | Koala 🐨 · Kayak 🛶 | Rare; same sound as ca, que. |
| L l | *ele* | León 🦁 · Luna 🌙 | |
| M m | *eme* | Manzana 🍎 · Mono 🐒 | Usually the first consonant taught (ma, me, mi, mo, mu). |
| N n | *ene* | Nube ☁️ · Nariz 👃 | |
| Ñ ñ | *eñe* | Araña 🕷️ · Niño 🧒 | Few words start with ñ (ñandú, ñu, no clear emoji), so the page shows ñ inside words; *ñandú* is mentioned in the text. |
| O o | *o* | Oso 🐻 · Oveja 🐑 | |
| P p | *pe* | Pato 🦆 · Perro 🐶 | |
| Q q | *cu* | Queso 🧀 · Mosquito 🦟 | Always *qu* + e/i; the u is silent. |
| R r | *erre* (ere) | Ratón 🐭 · Rana 🐸 | Strong at the start of a word; soft in *pera*; *rr* between vowels (perro). |
| S s | *ese* | Sol ☀️ · Serpiente 🐍 | |
| T t | *te* | Tortuga 🐢 · Tren 🚂 | |
| U u | *u* | Uva 🍇 · Unicornio 🦄 | |
| V v | *uve* (ve, ve corta, ve chica) | Vaca 🐄 · Volcán 🌋 | Same sound as B. |
| W w | *uve doble* (doble ve, doble u) | Kiwi 🥝 · Sándwich 🥪 | Borrowed words; sounds like *u*/*gu*. |
| X x | *equis* | Taxi 🚕 · Xilófono 🎵 | ks in taxi, s in xilófono, j in México. |
| Y y | *ye* (i griega) | Yoyó 🪀 · Yate 🛥️ | Like ll (yeísmo); alone or at the end of a word it sounds *i* (y, rey 👑). |
| Z z | *zeta* | Zapato 👞 · Zorro 🦊 | Sounds like s in Latin America, [θ] in most of Spain. |

Plus the "La tilde" page: á é í ó ú (Mamá 👩, Café ☕, Maíz 🌽, Avión ✈️, Menú 📋) and ü (Pingüino 🐧).

## The syllables section (`/es/silabas`)

Spanish is read syllable by syllable, and spelling is regular, so the section follows the order of the *método silábico* used in schools (vowels → direct syllables → inverse, mixed and blended ones → the letters whose sound depends on their neighbours). **Built in phase 3** (`lib/silabas-es.ts`), 20 pages in four groups, URL `/es/silabas/<slug>`:

- **Las vocales y las sílabas:** `vocales`, `silabas-directas` (with the syllable builder and "Arma la palabra"), `silabas-inversas`, `silabas-mixtas`, `contar-silabas` ("Aplaude las sílabas").
- **Las sílabas trabadas:** `trabadas-con-l` (bl, cl, fl, gl, pl), `trabadas-con-r` (br, cr, dr, fr, gr, pr, tr).
- **Letras y sonidos especiales:** `ch`, `ll-y-y`, `r-y-rr`, `ca-co-cu-que-qui`, `ce-ci-y-z` (seseo, with Spain noted), `ga-go-gu-gue-gui` (the "g suave"), `ge-gi-y-j` (the "g fuerte"), `dieresis`, `h-muda`, `b-y-v`, `enie`, `x`.
- **Leer de corrido:** `palabras-frecuentes`.

Each page: level by age, a listen button, the explanation, rules where useful, syllable tables to hear, words with the studied letters highlighted (or split into coloured syllables), a sentence, a picture hunt on 10 pages (with minimal pairs: pato/plato, mono/moño, pera/perro, guitarra/pingüino), a note for parents, two FAQs and related pages. The plan's names "g fuerte: ga, go, gu" were corrected: Spanish schools call ga, go, gu, gue, gui the soft g and ge, gi the strong g.

## Worksheets (`/es/fichas`)

Same structure as the French *fiches* (pre-rendered PDFs with Chromium, generator in `scripts/fiches-fr/` made language-aware), stored under **`public/fichas-pdf/`** so no folder clashes with the French ones. About 250 PDFs: 6 types × 27 letters (*trazo*, *letra cursiva*, *reconocer la letra*, *sílaba inicial*, *colorear*, *escribir palabras*), *números* 0–20 (with number words: uno, dos…), *figuras*, *colores*, *palabras frecuentes*, *sílabas* (one sheet per consonant: ma me mi mo mu…), *sílabas trabadas*; about 40 *paquetes*. The repository grows by about 30 MB again.

### Handwriting options (D7)

What children actually use at school differs by country:
- **Mexico (SEP)**: first *letra script* (print), lowercase first; cursive taught in many schools from 1st–2nd grade. Notebooks *de doble raya* (two lines per row, like a 4-line guide) for writing, *cuadro grande* / *cuadrícula* for maths.
- **Argentina, Uruguay**: start with **uppercase print** (*imprenta mayúscula*) in kindergarten, then lowercase print, then *cursiva*.
- **Chile, Colombia, Peru**: *letra ligada* (joined) taught early, notebooks *de caligrafía* with double lines.
- **Spain**: cursive (*letra enlazada*) from age 5–6, on *pauta* paper (*cuadrovía Lamela*, double lines).

Options:
- **A. Print only**: *letra script* (Andika, already used) on *doble raya* guide lines (top, dashed middle, base, descender line). Simplest, universal.
- **B. Print + cursive (chosen)**: A, plus a cursive version of each letter sheet on the same *doble raya*, in **Playwrite MX** (TypeTogether's Mexican school cursive, Google Fonts, SIL OFL 1.1 like Playwrite FR Trad; **licence checked 2026-10-01**: SIL OFL 1.1, copyright The Playwrite Project Authors, no Reserved Font Name; use, embedding and selling with software are allowed, only selling the font file on its own is not, and the OFL doesn't cover documents made with it. It has every Spanish character (ñ Ñ á é í ó ú ü ¿ ¡) and its capitals are exactly twice its x-height, which fits four-line *doble raya*. Loaded by `next/font` (`lib/fonts/cursive-es.ts`); phase 4 embeds the TTF in the PDF generator). Numbers and shapes on *cuadrícula*. The tracing canvas gets the same *script* / *cursiva* toggle as French.
- **C. B + uppercase print sheets** (*imprenta mayúscula*) for Argentina/Uruguay. Adds about 27 PDFs.

Other cursive models I can show you before choosing: Playwrite ES (Spain), Playwrite CL, Playwrite AR, Playwrite CO.

## Stories (`/es/cuentos`)

8 original Spanish stories, same illustration scenes as the English and French ones (paired by `translationGroup`, so twins get hreflang to each other in all three languages), stored with `locale = ES`. Short sentences built from direct syllables first (*pato*, *mamá*, *luna*), so a beginning reader can read some of them. Proposed titles (approve in phase 5):

| Group | Title | Slug |
|---|---|---|
| apple | La manzanita roja | `la-manzanita-roja` |
| bear | Bruno, el osito valiente | `bruno-el-osito-valiente` |
| cat | Mía, la gatita curiosa | `mia-la-gatita-curiosa` |
| dog | Canelo y su pelota | `canelo-y-su-pelota` |
| duck | Lupita, la patita tímida | `lupita-la-patita-timida` |
| fish | Burbujas, el pececito | `burbujas-el-pececito` |
| owl | Tito, el búho sabio | `tito-el-buho-sabio` |
| lion | La siesta de Leo | `la-siesta-de-leo` |

### Database change (done in phase 1, additive)

```prisma
enum Locale { EN FR ES }
```
One migration, `20261001220000_locale_es` (`ALTER TYPE "Locale" ADD VALUE 'ES'`); nothing else changes: `Story.locale`, `ChildProfile.language` and `User.locale` already use the enum. **Moved to phase 1** because Spanish sign-ups store `User.locale = ES`. Applied to the Neon `dev` branch on 2026-10-01 with `prisma migrate deploy`; production only at launch, by the owner (phase 7). After phase 5, `npm run db:seed` upserts 24 stories (English and French text unchanged).

**Incident, 2026-10-01:** while preparing this migration, `prisma migrate diff --shadow-database-url <dev DATABASE_URL>` reset the `dev` branch (all rows and the migration history were deleted; production and the French backup branch were not touched, checked read-only). With the owner's OK, `dev` was reset from `production` (Neon "reset from parent"), then the migration was applied with `prisma migrate deploy`. `dev` now holds a copy of production's data, including the real user accounts. CLAUDE.md now forbids using a real database as a shadow database.

## Technical work: from two languages to three (phase 1)

The French work assumed exactly two languages in several places; phase 1 makes them work for any number:

- `i18n/routing.ts`: `locales: ["en", "fr", "es"]`, Spanish path words.
- `lib/i18n/routes.ts`: `FRENCH_PATHNAMES` becomes a per-language list (`LOCALE_PATHNAMES.fr` / `.es`); `TRANSLATED_PARAMS` maps groups (`{ en, fr, es }`) instead of `enToFr`; `FRENCH_ONLY_PARAMS` becomes "only in language X" (French accented letters and sounds, Spanish ñ/tilde pages and syllables); `alternatesFor` lists every language where the page exists (en, fr, es, x-default = en). English and French pages that get a Spanish twin gain one `hreflang="es"` line, nothing else.
- `middleware.ts`, `lib/i18n/known-params.ts`, `lib/story-exists.ts`: Spanish 404s, Spanish params; DB ↔ URL locale through one helper instead of `locale === "FR" ? "fr" : "en"`.
- The ~50 `locale === "fr" ? <Fr/> : <En/>` choices in pages: each page gets a per-language object (`{ en: AboutEn, fr: AboutFr, es: AboutEs }[locale]`) when its Spanish version is written, so a missing Spanish component is a type error. Pages not written in Spanish yet keep the old ternary (they render English for `es`, but the middleware 404s them).
- `app/sitemap.ts`: Spanish URLs, three-way story alternates.
- `LanguageSwitcher`: EN / FR / ES (already loops over the locales; check it fits the 390 px header and the mobile menu).
- `lib/speech.ts`: a preferred-voices list per language (D11).
- `messages/es.json` (same keys, checked by `tests/i18n/messages.test.ts`), Spanish 404 page, Spanish API error texts.
- The build pre-renders about 1,700 pages instead of about 1,140 (Spanish copies of English-only pages until each phase adds content, as in French).

## Phase 1 notes (things later phases must remember)

- **Adding a Spanish page:** write the `*-es.tsx` component, route it in `page.tsx` with the per-language object, add the pathname to `SPANISH_PATHNAMES` (`lib/i18n/routes.ts`), add its param validator to `SPANISH_VALIDATORS` (`lib/i18n/known-params.ts`; until then every Spanish param 404s), Spanish-only params to `LOCALE_ONLY_PARAMS.es`, translated slugs to the `TRANSLATED_PARAMS` groups, and its pages and rules to `LANGS.es` in `localecheck.mjs` (remove the phase 1 "not written yet" rules there as pages arrive).
- Each dynamic page's `generateStaticParams` must return the Spanish list for `es` once it exists (same rule as French).
- **Spanish home page** (`app/[locale]/home-es.tsx`): every section is written; links appear by themselves when their page exists (`MaybeLink`, `has()`). The four syllable cards link to their pages (done in phase 3); phase 4 can add "Fichas populares"; phase 6 can list the games as in French.
- **Child language:** the add/edit child forms still offer English and French only, and a profile created on the Spanish site defaults to English. Phase 6 adds "Español" to the forms (`ChildForm.langES`), to the children API's `z.enum(["EN", "FR"])` (`app/api/children/**`) and to `add-child-form.tsx`'s default. The dashboard messages already have an `ES` branch.
- The story page (`stories/[slug]/page.tsx`) already finds twins in all languages and has Spanish metadata, breadcrumb and reader labels; the Spanish audio button (browser voice) comes in phase 5 (`story-reader.tsx` still picks `StoryAudioFr` only for French).
- The English and French cookie and privacy pages still say "EN / FR" buttons (left unchanged so their text doesn't change); the Spanish ones say "EN / FR / ES". Update all three together later if wanted.
- Open Graph locale for Spanish pages is `es_LA` (Facebook's Latin American Spanish); the organization JSON-LD lists Mexico, the US, Colombia, Argentina, Peru, Chile, Venezuela, Ecuador, Guatemala and Spain.

## Phase 2 notes

- **Letters** (`lib/letters-es.ts`): the 27 letters of the approved sample, in order a…n, ñ, o…z. Each has its RAE name plus `otherNames` shown after it ("se llama «uve» (también: «ve», «ve corta», «ve chica»…)"), its IPA, the syllables the "sound" button reads (consonants are heard as ma, me, mi, mo, mu, the way Spanish schools teach them), a note "Para mamá y papá" and an FAQ. Seseo and yeísmo are the default, with Spain's pronunciation mentioned for c/z and the sh-like y of Argentina and Uruguay. R has *pera* and *perro* as inside words, Y has *rey*. `letterWithWord()` says "A de avión", or "Ñ, como en araña" when the word doesn't start with the letter (ñ, q's mosquito, w, x).
- **Pages:** `/es/abecedario` (27 cards, name under each letter, link to the tilde page), `/es/abecedario/[letter]` (`letter-es.tsx`; "A" works like "a"; ñ is `enie`, `/es/abecedario/ñ` 404s), `/es/abecedario/tilde` (`tilde-es.tsx`: tilde, tilde diacrítica, diéresis, and a box explaining that ñ's mark is not an accent), `/es/abecedario/[letter]/ficha` (tracing in script or cursiva on *doble raya*, plus a listen button), `/es/tarjetas`.
- **Not yet:** the letter and ficha pages have no PDF downloads and no "Fichas para imprimir" section; phase 4 adds them (the French equivalents are `FicheActions` and the fiches section of `letter-fr.tsx`).
- **Speech:** `ListenButton` and `useSpeech(locale)` take `locale="es"`; `useFrenchSpeech()` is unchanged for the French games. The Spanish no-voice notice gives Android, iPhone/iPad and Windows steps. Browser checks confirm es-MX is chosen over es-US and es-ES, es-ES is used when it's the only Spanish voice, and a French or English voice never reads Spanish.
- **Tracing:** `TracingCanvas` takes `cursive.ruling = "doble-raya"` (capital line, dashed middle line, baseline, descender line). French keeps Seyès (the default).
- **Routing:** `enie` and `tilde` are Spanish-only (`LOCALE_ONLY_PARAMS.es`), `SPANISH_VALIDATORS` lists the letter params. Switching language on ñ or the tilde page goes to the other language's alphabet; French-only letters go to `/es/abecedario`.

## Phase 3 notes

- **Data:** `lib/silabas-es.ts` (`spanishSyllablePages`, `SYLLABLE_GROUPS`, builder letters `ES_BUILDER_CONSONANTS` with ch and ll). The slugs are also listed in `SPANISH_SYLLABLE_SLUGS` (`lib/i18n/routes.ts`, Spanish-only, checked by the tests). Word markup is the French one (`[ch]ocolate`, `ma|no`), shown by the shared `components/sons/MarkedWord`.
- **Exercises:** `components/sons/SoundHunt` and `SyllableBuilder` take `locale` (and the builder its letters); French pages pass nothing and are unchanged. New Spanish-only `components/silabas/WordBuilder` ("Arma la palabra": tiles in a fixed shuffled order so server and browser match; a wrong syllable is refused with a hint; the finished word is read by syllables) and `SyllableClap` (count 1–5; the right answer shows coloured syllables and reads them).
- **Links:** each letter page links to its syllable page (`SYLLABLE_PAGE` in `letter-es.tsx`; letters without a special page go to `silabas-directas`). The switcher on a syllable page goes to `/phonics` or `/fr/sons`.
- **Content checks in the tests:** built words are spelled exactly by their syllables, decoys are distinct, hunt answers match the rule (ch, ñ, ü, vowels, blends), no regional words, no look-alike Cyrillic letters (one had slipped into a FAQ and was fixed).
- **Phase 4** should add the syllable worksheets (one per consonant: ma me mi mo mu…, and trabadas) and link them from these pages, as the French sound pages link their fiche.

## Phases

| Phase | Content | Status |
|---|---|---|
| 0 | Baseline snapshots from `main`: English (existing script) **and French** (extend `snapshot.mjs`/`compare.mjs` to the French sitemap URLs); generalize `frcheck.mjs` into a per-language check (`localecheck.mjs fr|es`). | **Done** (2026-10-01), not pushed. Baseline in `../snap-es-base` (878 routes: 496 English, 382 French, from `main` 4894cd3); a second snapshot of the same build is identical, so the comparison is repeatable. `localecheck.mjs fr` passes on `main` (480 checks). |
| 1 | Three-language foundation (section above), header with EN/FR/ES, Spanish UI pages: home, quiénes somos, precios, contacto, iniciar sesión, registro, mi cuenta, legal pages (placeholders), cookies, Spanish 404, API errors. | **Done** (2026-10-01), not pushed. English and French identical to the baseline (878 routes) apart from hreflang: the 7 English and 7 French twins of the Spanish pages each gained one `hreflang="es"` line, nothing else; the sitemap gained the 7 Spanish URLs with three-way alternates. `localecheck.mjs es` and `fr` pass, browser checks pass (164), 120 unit tests. Build: 1,612 pages (was ~1,140). See "Phase 1 notes". |
| 2 | Abecedario: `lib/letters-es.ts` (27 letters + tilde page), chart, letter pages, `/es/tarjetas`, Spanish speech with voice fallback and no-voice message, tracing canvas with *script* / *cursiva*. | **Done** (2026-10-01), not pushed. English and French identical to the baseline apart from hreflang: since phase 1, 58 pages gained one `hreflang="es"` line (the 26 letters, the alphabet, the cards and the A tracing page, in English and French). Sitemap: 37 Spanish URLs. `localecheck es` and `fr` pass, 185 browser checks, 135 unit tests, build 1,615 pages. See "Phase 2 notes". |
| 3 | Sílabas: ~20 pages + index, syllable builder, word builder, syllable clapping, picture hunt. | **Done** (2026-10-02), not pushed. English and French identical to the baseline apart from hreflang: since phase 2 only `/phonics` and `/fr/sons` gained `hreflang="es"` (the syllable pages are Spanish-only). Sitemap: 58 Spanish URLs. `localecheck es` and `fr` pass, 208 browser checks (the exercises are played with a fake es-MX voice), 151 unit tests, build 1,627 pages. See "Phase 3 notes". |
| 4 | Fichas: Spanish PDFs and *paquetes* (handwriting per D7), generator made language-aware, letter pages link their *ficha*. | |
| 5 | Cuentos (the `ES` migration was done in phase 1): 8 stories, list filtered by language, reader with browser Spanish voice ("Escuchar" / "⏹ Detener"). | |
| 6 | Juegos (5 twins + *aplaude-las-silabas* per D10), preescolar, kínder, actividades, "Español" in the child language select. | |
| 7 | Launch (below). | |

### Launch (phase 7)

1. I create a Neon backup branch of production, `backup-before-spanish-launch-<date>` (no compute), with your OK (or you create it: Neon console → Branches → New branch from `production`).
2. You run, from the repo folder with the **production** connection string (never stored in `.env`):
   ```powershell
   $env:DATABASE_URL = "<production connection string>"
   npx prisma migrate deploy      # adds ES to the Locale enum
   npm run db:seed                # upserts 24 stories; English and French unchanged
   Remove-Item Env:DATABASE_URL
   ```
   (Exact commands confirmed at launch time, as last time.)
3. Merge `spanish-version` into `main` and push (Cloudflare Workers Builds deploys).
4. Live checks on alphabes.com (`LIVE=1`): English and French identical apart from hreflang and the switcher, Spanish checks, browser checks.
5. You resubmit `https://alphabes.com/sitemap.xml` in Search Console.

## Testing

As in french-plan.md, plus:
- **French snapshot comparison** (new in phase 0): `snapshot.mjs <outDir> [baseUrl] [--langs=en,fr]` now takes English and French by default, plus pages missing from the sitemap (private pages, 404s, a sample story, the English game pages). French must stay identical apart from hreflang and the header. Compare each phase with `node scripts/i18n-check/compare.mjs ../snap-es-base <newDir>`; add `--langs=es` to snapshot the Spanish pages.
- `localecheck.mjs es` (pages and rules filled in phase by phase in its `LANGS.es`): every Spanish page (status, `lang="es"`, titles, canonical/hreflang), every internal link, routing rules (Spanish 404s, cookie redirect to `es`, no Accept-Language redirect).
- `browser.mjs`: the three-way switcher, Spanish forms, each phase's Spanish pages, games played with fake Spanish voices, 390 px layout.
- Unit tests for the Spanish data (27 letters, names, words' first letters, syllable lists, games' answers, fichas files present).

## Open issues

- Content review: the letter tips and FAQs (`lib/letters-es.ts`), the alphabet and tilde pages and the 20 syllable pages (`lib/silabas-es.ts`) should get the native-teacher review (D12), ideally from a teacher who uses the syllable method.
- `localecheck.mjs` lists English words that are also words in the checked language (`sameWords`: *parent(s)*, *sons*, *session* for French) and uses letter-aware word boundaries, so French no longer reports false positives. Add Spanish ones there if they appear.
