# SEO audit: alphabes.com

Audit date: 2026-10-07. Production release: `74f8c3f` (sitemap valid against the 0.9 XSD). Phase 1 only: nothing has been changed or deployed.

## Method

- **Crawl:** every `<loc>` in `https://alphabes.com/sitemap.xml` (1,666 URLs: 489 en, 380 fr, 377 es, 420 pt) was fetched with the Googlebot smartphone user agent, without following redirects automatically, so each redirect hop is recorded. From each page the crawl took the status, headers, `<html lang>`, title, meta description, robots, canonical, hreflang, headings, images, links, JSON-LD and OG/Twitter tags.
- **Discovered URLs:** every internal link found on those pages (2,797 distinct targets) was compared with the sitemap. The 133 HTML pages linked internally but missing from the sitemap were crawled as well.
- **Edge cases:** http, www, trailing slash, `/en` prefix, upper case, unknown URLs, private pages, icons and manifest were checked with curl.
- **Performance:** Lighthouse 13 (mobile emulation, simulated slow 4G) on 5 page types × 4 languages, run from this PC. Lab data only: no field (CrUX) data was available.
- **Code:** the findings were traced to `lib/sitemap.ts`, `lib/i18n/routes.ts`, `components/LocaleDocument.tsx`, `app/robots.ts`, `next.config.js`, `middleware.ts` and the page metadata functions.

## Summary

**No Critical issues.** Every sitemap URL answers 200 with no redirects and no 5xx. Every page has exactly one self-referencing absolute https canonical, one H1, the right `<html lang>`, and is `index, follow` (except the two noted below). hreflang is reciprocal and identical in the HTML and the sitemap. No JSON-LD fails to parse. Real 404s are returned for unknown URLs, http and www redirect to `https://alphabes.com`, and all HTML is gzip/brotli compressed.

| # | Issue | Severity | Pages affected | Fix |
|---|---|---|---|---|
| I1 | English story pages have no title or meta description of their own: they get the site default (8 identical titles and descriptions) | Important | 8 (`/stories/*`) + `/stories` description | Give English stories the same `generateMetadata` as fr/es/pt |
| I2 | 115 indexable pages are linked internally but missing from the sitemap: letter worksheet pages in all 4 languages, and the 5 English game pages that 15 sitemap URLs name as hreflang `en` | Important | 110 + 5 | Add `/alphabet/[letter]/worksheet` (×4 languages) and the English games to `lib/sitemap.ts` |
| I3 | `noindex` pages listed in the sitemap | Important | `/login`, `/register` | Remove them from the sitemap |
| I4 | `/privacy` duplicates `/privacy-policy`: same title and H1, an older and shorter policy, orphan (nothing links to it), but in the sitemap | Important | 2 | 301 `/privacy` → `/privacy-policy`, drop it from the sitemap (legal: your call) |
| I5 | `og:url` points at the home page instead of the page itself | Important | 107 (pricing, about, legal, EN phonics skills, EN worksheet hubs and bundles, EN stories…) | Every page sets `openGraph.url` = its canonical (shared helper) |
| I6 | No `og:image` (pages that set their own `openGraph` lose the inherited image) | Important | 806 (402 en, 134 fr, 130 es, 140 pt) | Shared OG helper that always includes an image |
| I7 | Thin, templated English pages: about 50 words of main content and no preview image | Important | 8 EN phonics skills, ~80 EN number/shape/colour/sight-word/CVC worksheets, 5 EN games, 5 blog category pages | Add real content (preview image, how-to-use, tips, related links) or noindex the weakest |
| I8 | Main English hub titles miss the search keyword and are very short | Important | `/pricing`, `/games`, `/games/*`, `/stories`, `/worksheets/tracing` and 31 others under 30 characters | Rewrite titles and H1s around the target keyword (needs your approval for each text) |
| I9 | Total Blocking Time 210–560 ms on every page in mobile Lighthouse (INP risk); one shared JS chunk does ~1 s of scripting | Important | All pages | Trim client JS: `next/dynamic` for the cookie banner and other islands, check what's in chunk `1255` |
| I10 | Layout shift (CLS 0.27–0.31) on every game page: the game is client-only and pushes the footer down when it mounts | Important | 22 game pages (5 en, 5 fr, 6 es, 6 pt) | Give `ClientOnly` a placeholder with the game's height |
| I11 | Worksheet hubs load 1.0–1.1 MB of preview JPGs shown 3× smaller than their size; LCP up to 5.1 s | Important | fr/es/pt worksheet hubs and home pages | ~300 px thumbnails or `next/image` with `sizes` |
| M1 | Titles longer than 60 characters (378 even without the " \| AlphaBes" suffix) | Minor | 952 (166 en, 235 fr, 254 es, 297 pt) | Shorten the title patterns, drop " \| Free Printable PDF" |
| M2 | Meta descriptions over 160 characters (83) or under 70 (51) | Minor | 134 | Rewrite to 120–155 characters |
| M3 | `twitter:title` is "AlphaBes" and `twitter:description` is the site slogan on every page | Minor | 1,657 | Drop the layout's fixed Twitter title so it falls back to the page title |
| M4 | `og:type` and `og:locale` missing on pages with their own `openGraph` | Minor | ~1,550 | Same shared OG helper (I5/I6) |
| M5 | `og:image` is the English "AlphaBes" card in all 4 languages | Minor | All pages | Optional per-language OG image |
| M6 | No HSTS header | Minor | Whole site | Enable HSTS in Cloudflare (SSL/TLS → Edge Certificates) |
| M7 | `/en/*` redirects with a temporary 307 (should be 308); `http://www` takes 2 hops | Minor | Edge cases | Make it 308 in middleware; one-hop rule in Cloudflare |
| M8 | No web app manifest and no `apple-touch-icon`; `favicon.ico` is sent with `max-age=0` | Minor | Whole site | Add `app/manifest.ts` and `app/apple-icon.tsx` |
| M9 | Preview images, PDFs and audio in `public/` are sent with `max-age=0` | Minor | ~750 images, PDFs | `public/_headers` rules (e.g. 1 day + stale-while-revalidate) |
| M10 | JSON-LD gaps: no `WebSite`; no `Product`/`Offer` on pricing; stories have no `CreativeWork`/`Book`; English `LearningResource` lacks `inLanguage`/`image`; letter pages' `LearningResource` has no `url`; the Organization has no `logo` | Minor | Many | Add the missing types and fields |
| M11 | Footer column titles are `<h2>` ("Learn", "Account"…), so every page outline ends with 4 empty-looking H2s | Minor | All pages | Use `<p>` or `<h3>` styled the same |
| M12 | Every page links "Dashboard" in the footer, a 307 redirect to login for crawlers | Minor | All pages | Show it only when signed in, or link straight to login |
| M13 | The language switcher's server HTML links to each language's home page; the exact twin URL is only set after JavaScript runs | Minor | All pages with twins | Optional: render the twin hrefs on the server (hreflang already covers discovery) |
| M14 | Story pages and their index aren't cached at the edge (TTFB 0.4–1.8 s); some cold blog/bundle pages took up to 6 s | Minor | 36 + a few | Cache story pages (ISR) like the others |
| M15 | ~750 worksheet PDFs in `public/` are crawlable and can rank as bare PDFs in place of their HTML pages | Minor | PDFs | Optional `X-Robots-Tag: noindex` for `*-pdf/*.pdf` |
| M16 | The French, Spanish and Portuguese stories are short (100–120 words); naturally thin | Minor | 24 | Add a short "for parents" block (questions to ask, words to spot) |

---

## Details

### 1. Crawl & indexing

**Status codes.** 1,666/1,666 are `200 text/html; charset=utf-8`, compressed, with no redirects or chains. No soft 404s: the smallest real page has 87 words (`/login`). Response time: p50 0.36 s, p90 0.94 s, max 6.0 s (cold R2 cache on `/blog/how-to-teach-the-alphabet-to-preschoolers`, `/blog/alphabet-activities-for-kindergarten` and 3 bundle pages). 1,630 pages were `x-nextjs-cache: HIT`; the 36 that weren't are the story pages and story indexes (M14).

**robots.txt** (`app/robots.ts`): `Allow: /`, `Disallow: /dashboard, /admin, /api/`, sitemap declared. Correct. `Host:` is a Yandex-only directive and is ignored by Google (harmless). The localized dashboards (`/fr/tableau-de-bord`, `/es/mi-cuenta`, `/pt/minha-conta`) aren't disallowed, but they redirect (307) to a `noindex` login page, so they can't be indexed.

**Meta robots.** 1,664 sitemap pages are `index, follow`. No `X-Robots-Tag` anywhere. Private pages are correctly `noindex`: login, register, dashboard, play pages and 404 in all 4 languages (`app/[locale]/login/page.tsx:15`, `register/page.tsx:15`, `dashboard/page.tsx:20`, `games/[slug]/play/page.tsx:47`, `global-not-found.tsx:26`).

**I3. noindex pages in the sitemap.** `https://alphabes.com/login` and `https://alphabes.com/register` are `noindex` but listed. Code: `lib/sitemap.ts:106-107` (`staticRoutes`). Why it matters: Search Console reports "Submitted URL marked noindex", and it wastes crawl budget. Fix: remove both from `staticRoutes`.

**I2. Indexable pages missing from the sitemap.**
- 110 letter worksheet pages: `/alphabet/{a…z}/worksheet` (26), `/fr/alphabet/{…}/fiche` (30, including é è ê ç), `/es/abecedario/{…}/ficha` (27, including ñ), `/pt/alfabeto/{…}/atividade` (27, including ç). They are `index, follow`, have hreflang to each other, and are linked from every letter page, but `lib/sitemap.ts` has no entry for `/alphabet/[letter]/worksheet`.
- 5 English games: `/games/find-the-letter`, `/games/match-letter-picture`, `/games/beginning-sound`, `/games/letter-tracing`, `/games/alphabet-quiz`. They are `index, follow`, and the 15 fr/es/pt game pages in the sitemap list them as `hreflang="en"` and `x-default`, but they are left out on purpose (`lib/sitemap.ts:226`). A hreflang target outside the sitemap is a mixed signal.
- Fix: add both to `lib/sitemap.ts` (English entries go through `withTwins`, so their twins and hreflang come for free); add a test that every indexable route with params appears in the sitemap.

Other links not in the sitemap are expected: 163 `/api/bundles/*` (Pro downloads, `rel="nofollow"`, disallowed in robots.txt), ~760 worksheet PDFs (M15), and `noindex` pages (login, register, play, dashboard).

**I4. `/privacy` duplicate.** `https://alphabes.com/privacy` (272 words, "Last updated: October 4, 2026") and `https://alphabes.com/privacy-policy` (1,231 words) share the title "Privacy Policy | AlphaBes", the H1 "Privacy Policy" and the default description. `/privacy` is an orphan (0 internal links), English-only, and in the sitemap (`lib/sitemap.ts:111`). Code: `app/[locale]/privacy/page.tsx`. Why it matters: two policies compete, and a parent could land on the older, shorter text. Fix: permanent redirect `/privacy` → `/privacy-policy` (in `next.config.js` `redirects()`), delete the page, remove it from the sitemap and the `/privacy` pathname in `i18n/routing.ts`. Check first that nothing in the policies refers to `/privacy` (legal text: your decision).

**Orphans.** Only `/privacy` (above). Every other sitemap URL is linked from at least one crawled page.

### 2. Canonicals & international SEO

- **Canonicals:** 1,666/1,666 have exactly one canonical, absolute, https, no www, no trailing slash, equal to the URL. The English home page is `https://alphabes.com` (no slash), consistent everywhere.
- **hreflang:** 241 pages have alternates (239 with en/fr/es/pt + x-default, 2 with es+pt). Every alternate is reciprocal, self-referencing, 200, indexable and canonical, and the HTML matches the sitemap exactly (0 differences). Codes are `en`, `fr`, `es`, `pt` with `x-default` = English: valid. `pt` (not `pt-BR`) is the decision recorded in `docs/portuguese-plan.md`; that's fine, since the Portuguese is Brazilian but there's no `pt-PT` version for it to clash with. The 1,425 pages without hreflang have no twin (French sounds, Spanish syllables, language-specific worksheets…), as designed in `lib/i18n/routes.ts`.
- `/es/juegos/aplaude-las-silabas` ↔ `/pt/jogos/bata-palmas` have no `x-default` (no English twin). Allowed by Google; no action needed.
- The only hreflang defect is I2: the 5 English game pages are hreflang targets that aren't in the sitemap.
- **`<html lang>`:** en / fr / es / `pt-BR`, correct on every page (`components/LocaleDocument.tsx`, `HTML_LANG`).
- **Translated slugs** match `i18n/routing.ts` in every alternate checked.

### 3. On-page

**Titles.** All present, one `<title>` per page, no English left in fr/es/pt (checked against a list of common English words in titles, descriptions, headings, link text and alt text: 0 hits).
- I1: the 8 English stories all have the title "AlphaBes – Learn Letters. Learn Sounds. Learn English.", the site default, because `app/[locale]/stories/[slug]/page.tsx:52` returns only `alternates` for English. The fr/es/pt stories get "<Title> : une histoire à lire et à écouter". Fix: the same pattern in English, e.g. "The Little Apple: A Short Story for Kids to Read and Listen To".
- I8: short titles that miss the search keyword: `Pricing | AlphaBes` (and Tarifs/Precios/Preços), `Learning Games | AlphaBes`, `Find the Letter | AlphaBes` (and the other 4 English games, `game-en.tsx:22`), `Story Time | AlphaBes`, `Tracing Worksheets | AlphaBes` (`category-en.tsx:40`), `Flashcards | AlphaBes`, `Activities | AlphaBes`, `Contact Us`, `About AlphaBes | AlphaBes` (brand twice). 36 titles are under 30 characters.
- M1: 952 titles are over 60 characters (Google cuts at about 580 px). Main patterns: `… | Free Printable PDF Bundle | AlphaBes` (English bundles, 88 characters), `Reconhecer a letra Z nos quatro tipos de letra | Atividade em PDF grátis | AlphaBes` (83), long fr/es/pt hub titles (`/pt/primeiro-ano`, 86). Fix the patterns in the data files rather than page by page.
- Duplicates: only the 8 stories (I1) and `/privacy` vs `/privacy-policy` (I4). `/es/cookies` and `/pt/cookies` share "Política de cookies | AlphaBes", which is correct in both languages and is not a problem.

**Meta descriptions.** Present on every page, exactly one each.
- Default site description repeated on 15 pages: the 8 English stories, `/stories`, `/login`, `/register`, `/privacy`, `/privacy-policy`, `/terms`, `/cookies` (I1, plus the legal pages).
- M2: 83 are over 160 characters (e.g. `/es/actividades` 225, `/pt/brincadeiras` 221, `/pt/jogos` 216, `/es/juegos` 215, `/pt` 201); 51 are under 70 (e.g. `/worksheets/numbers` "Tracing practice for numbers 0-9." 33, `/worksheets/shapes` 35, `/contact` 36, `/phonics/letter-sounds` 41, the English blog categories).

**Headings.** 1,666/1,666 have exactly one H1, and it is the first heading; no skipped levels (H1→H3). M11: the footer adds 4 `<h2>` column titles to every page (`components/Footer.tsx:61`). Repeated H1s: only `/privacy` vs `/privacy-policy`.

**Images.** 6,622 `<img>` on 749 distinct preview JPGs (fr/es/pt worksheet previews): all have a translated, descriptive `alt` (e.g. "Aperçu de la fiche : Tracer la lettre A en capitale et en script"), `width` and `height` (no CLS), and 5,870 are `loading="lazy"`. Files are 30 KB on average (max 40 KB), so JPG is acceptable; WebP/AVIF through `next/image` would save about 30%, but that's low priority. English pages have no content images at all, so their worksheet pages show no preview (part of I7).

**I7. Thin pages.** Word counts include about 80 words of header and footer.
- English phonics skills (`/phonics/letter-sounds`, `beginning-sounds`, `cvc-words`, `blending`, `short-vowels`, `long-vowels`, `segmenting`, `word-families`): 136 words in total, about 50 of their own, one example list, and a description of about 45 characters (`app/[locale]/phonics/[skill]/skill-en.tsx:16-17`). These are high-value keywords ("cvc words", "blending sounds") with almost no content.
- About 80 English worksheet detail pages (numbers, number cursive, shapes, colours, sight words, CVC words): about 136 words, one templated sentence, and the "Preview" is just the character "3". The ~300 English letter worksheets are a little longer but built from the same template. Risk: "Crawled – currently not indexed" and a weaker site-wide quality signal.
- English games: 97 words each.
- English blog category pages (`/blog/alphabet` etc.): about 114 words, a listing with no introduction.
- Fix: add the preview image the fr/es/pt pages already have, a "how to use this worksheet" block, 2–3 tips, and related links. Enrich the phonics skills to the depth of `/fr/sons/*`. Otherwise `noindex` the weakest variants (e.g. the single-colour pages).

**Near-duplicates.** No two pages have identical body text. Templated similarity is high inside the English worksheet families (above).

### 4. Structured data

Types found (all parse as valid JSON; `@context` is https schema.org):

| Type | en | fr | es | pt |
|---|---|---|---|---|
| EducationalOrganization (every page) | 489 | 380 | 377 | 420 |
| BreadcrumbList | 440 | 362 | 359 | 402 |
| LearningResource | 388 | 302 | 302 | 339 |
| FAQPage | 58 | 56 | 54 | 58 |
| ItemList | – | 2 | 2 | 2 |
| Article (blog) | 9 | – | – | – |
| WebPage | 4 | – | – | – |

- Breadcrumbs are translated (Home / Accueil / Inicio / Início). The last item is the page itself, and every item URL is a 200 sitemap page.
- FAQ questions were checked against the visible text (e.g. all 7 on `/alphabet`): they appear on the page. Note: since 2023 Google shows FAQ rich results only for government and health sites. The markup is harmless and can stay.
- The Organization `description` is translated, with `inLanguage` and `areaServed` per language.
- M10 gaps (none of them is an error):
  - no `WebSite` node (`name` = AlphaBes, `url`, `inLanguage`), which helps Google show the site name;
  - no `logo` or `sameAs` on the Organization;
  - `/pricing` has no `Product` with `Offer` ($7.99/month, $59/year); it must match the visible prices exactly;
  - stories have no `CreativeWork`/`Book` (`name`, `inLanguage`, `author`, `audience`, `image`);
  - English `LearningResource` has no `inLanguage` and no `image` (fr/es/pt have `image`), and none has `provider`;
  - the `LearningResource` on letter pages (`/alphabet/a` ×4 languages, 110 pages) has no `url`.
- No markup claims anything that isn't visible.

### 5. Internal linking & navigation

- **Broken links:** 0. Every internal link in the crawl resolves to a 200 page, or to a known `noindex` page, a PDF or an API download.
- **Links to redirects:** "Dashboard" in the footer of every page → 307 to login (M12). No other internal link redirects.
- **nofollow:** only on the Pro bundle download links (`/api/bundles/*`), which is correct.
- **Language switcher** (`components/LanguageSwitcher.tsx`): in the server HTML the EN/FR/ES/PT links point at each language's home page, and the exact twin URL (or the section index) is set after mount. That's deliberate, so static pages never hydrate with a wrong href. Google renders JavaScript and hreflang already declares every twin, so this is Minor (M13). The computed targets match `counterpartPath`.
- **Breadcrumbs** are visible on content pages and match the JSON-LD.

### 6. Performance & Core Web Vitals (Lighthouse mobile, lab)

Lighthouse 13, mobile emulation (Moto G Power, slow 4G, 4× CPU throttle), one run per page from this PC on 2026-10-07. Lab numbers vary by ±10–15 points between runs, and the single outliers (es-home Speed Index 34 s and TTFB 7 s, a cold R2 cache) are noise. Field data (CrUX) isn't available yet for this traffic level. INP can't be measured in the lab; TBT is its proxy.

| Page | Perf | SEO | A11y | BP | LCP | CLS | TBT | FCP | JS KB | Total KB |
|---|---|---|---|---|---|---|---|---|---|---|
| en home | 80 | 100 | 96 | 100 | 2.9 s | 0 | 510 ms | 2.1 s | 166 | 278 |
| en pricing | 85 | 100 | 96 | 100 | 2.5 s | 0 | 350 ms | 2.3 s | 162 | 269 |
| en worksheet `/worksheets/letter-a-tracing` | 82 | 100 | 96 | 100 | 3.4 s | 0 | 250 ms | 2.1 s | 171 | 295 |
| en game `/games/find-the-letter` | **50** | 100 | 96 | 100 | 4.2 s | **0.29** | 540 ms | 2.9 s | 224 | 330 |
| en story | 90 | 100 | 96 | 100 | 1.9 s | 0 | 280 ms | 1.9 s | 186 | 348 |
| fr home | 80 | 100 | 97 | 100 | 3.5 s | 0 | 210 ms | 2.9 s | 166 | 411 |
| fr pricing | 85 | 100 | 96 | 100 | 2.0 s | 0 | 480 ms | 2.0 s | 162 | 271 |
| fr worksheet `/fr/fiches/trace-des-lettres` | 66 | 100 | 96 | 100 | **5.1 s** | 0 | 480 ms | 1.8 s | 164 | **1,078** |
| fr game | 68 | 100 | 96 | 100 | 3.1 s | **0.27** | 410 ms | 2.1 s | 224 | 359 |
| fr story | 86 | 100 | 96 | 100 | 1.5 s | 0 | 320 ms | 1.5 s | 183 | 346 |
| es home | 78 | 100 | 97 | 100 | 2.3 s | 0 | 340 ms | 2.2 s | 172 | 443 |
| es pricing | 88 | 100 | 96 | 100 | 1.9 s | 0 | 460 ms | 1.5 s | 162 | 271 |
| es worksheet `/es/fichas/trazo-de-letras` | 87 | 100 | 96 | 100 | 2.8 s | 0 | 310 ms | 1.7 s | 164 | **1,141** |
| es game | 71 | 100 | 96 | 100 | 1.6 s | **0.31** | 430 ms | 1.2 s | 224 | 366 |
| es story | 86 | 100 | 96 | 100 | 2.8 s | 0 | 210 ms | 2.8 s | 183 | 340 |
| pt home | 83 | 100 | 97 | 100 | 1.6 s | 0 | 560 ms | 1.6 s | 171 | 440 |
| pt pricing | 91 | 100 | 96 | 100 | 2.0 s | 0 | 280 ms | 1.9 s | 162 | 271 |
| pt worksheet `/pt/atividades/letra-bastao` | 84 | 92* | 96 | 100 | 2.4 s | 0 | 440 ms | 2.4 s | 166 | **1,067** |
| pt game | **49** | 100 | 96 | 100 | 3.8 s | **0.29** | 450 ms | 3.1 s | 224 | 366 |
| pt story | 68 | 100 | 96 | 100 | 4.1 s | 0 | 390 ms | 3.3 s | 186 | 350 |

\* "robots.txt is not valid" on one run only: a fetch glitch. robots.txt was checked by hand and is valid.

Findings:

- **I10. CLS 0.27–0.31 on every game page, in all 4 languages** (threshold for "good": 0.1). Cause: `components/games/ClientOnly.tsx` renders `fallback = null` on the server (to avoid a hydration mismatch from `Math.random()`), so the game area is empty in the HTML and pushes the footer down by about 700 px when it mounts. Fix: pass a `fallback` placeholder with the game's height (e.g. `min-h-[…]` skeleton), or reserve the height on the wrapper. CLS is a Core Web Vital: **Important**.
- **I11. Oversized previews on worksheet hubs:** fr/es/pt hubs load 1.0–1.1 MB, because the 476×673 preview JPGs are shown at 148×209 (Lighthouse: 530–585 KB to save per page; LCP 5.1 s on `/fr/fiches/trace-des-lettres`). `components/fiches/FicheParts.tsx:38` already lazy-loads them, which is good, but a 2-column phone grid still downloads many at once. Fix: generate ~300 px-wide thumbnails (or serve through `next/image` with `sizes`), keep the 476 px file for the detail page. **Important** for mobile LCP.
- **I9. Main-thread work and TBT 210–560 ms on every page** (target < 200 ms). JS is 162–224 KB compressed. Most of it is one shared chunk (`chunks/1255-*.js`, about 1 s of scripting on the home page) plus about 100 ms for the Cloudflare Web Analytics beacon. Fix: find what in `1255` is client-side on every page (header, language switcher, cookie banner, `IntlClientProvider` messages), load the cookie banner and other below-the-fold islands with `next/dynamic`, and keep messages per namespace. Legacy JS polyfills: 22 KB to save via a modern `browserslist`.
- **Render-blocking:** one 7 KB CSS file (Tailwind), which is acceptable. Fonts are already self-hosted by `next/font` (Baloo 2 + Nunito, `display: swap`, preloaded), so there's no Google Fonts request to fix. Two fonts × 4 weights each could be trimmed to the weights actually used.
- **TTFB:** cached pages answer in about 0.3 s. Story pages aren't cached (1.2–4 s TTFB in Lighthouse): M14.
- **bfcache:** story pages can't use the back/forward cache (2 reasons, probably `Cache-Control: no-store` on dynamic pages). Minor.
- **Accessibility 96–97 on every page:** colour contrast (the `text-chalkboard/50` grey and the footer's `text-paper/60`) and a label/accessible-name mismatch on the language switcher. Not SEO, but cheap to fix.
- **SEO category: 100** on every page except the one-off robots.txt glitch.
- **Console errors:** none (`errors-in-console` passed everywhere).

### 7. Technical

- **HTTPS:** http → https with a 301 for both hosts; no mixed content (0 `http://` src/href found).
- **www:** `https://www.alphabes.com/x` → 301 → `https://alphabes.com/x`. `http://www.alphabes.com/` takes 2 hops (http→https on www, then www→apex): M7.
- **Trailing slash:** `/pricing/` → 308 `/pricing`. **Upper case:** `/PRICING` → 404 (fine, nothing links to it).
- **`/en` prefix:** `/en/pricing` → **307** `/pricing` (next-intl default). A permanent 308 is better (M7).
- **404:** unknown URLs return a real 404 with `noindex`, in the right language (`/fr/nexiste-pas` → French 404).
- **HSTS:** absent on every response (M6). Add it in Cloudflare (Edge Certificates → HSTS, max-age 6 months, then 1 year with preload), not in Next.
- **Content-Type:** HTML `text/html; charset=utf-8`, sitemap `application/xml`, robots `text/plain`, PDFs `application/pdf`. Correct.
- **Compression:** gzip/brotli on all HTML (87 KB HTML → 14 KB on the wire).
- **Caching:** HTML `s-maxage=31536000` at the edge (browsers revalidate); `/_next/static` immutable for 1 year; `/icon` and `/opengraph-image` immutable. `favicon.ico`, preview JPGs, PDFs and audio: `max-age=0, must-revalidate` (M8, M9).
- **Security headers present:** `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`.
- **Open Graph / Twitter:**
  - I5: `og:url` = home page on 107 pages. The layout default (`components/LocaleDocument.tsx:57`, `url: homeUrl`) is inherited by every page that doesn't set its own `openGraph`.
  - I6: 806 pages have no `og:image`. In Next.js a page's `openGraph` object replaces the parent's whole object, so pages that set `openGraph: { title, description, url }` lose the inherited `/opengraph-image`. Only the fr/es/pt worksheet pages (`category-*.tsx:31-32`) set `images` themselves.
  - M4: `og:type` and `og:locale` disappear for the same reason (missing on ~1,550 pages).
  - M3: `twitter:title` is the fixed "AlphaBes" and `twitter:description` the slogan on 1,657 pages (`LocaleDocument.tsx:64-68`). X/Twitter uses these over `og:*`.
  - Fix for all four: one helper, e.g. `pageMetadata(locale, { title, description, url, image? })` in `lib/`, which every `generateMetadata` uses. It returns `openGraph` with url, type, locale, siteName and images, plus a `twitter` block without a fixed title.
- **Icons:** `/icon` (PNG) and `/favicon.ico` OK. No `apple-touch-icon` (iOS home screen), no `manifest` (M8).
- **Console errors:** none reported by Lighthouse's `errors-in-console` audit on the pages tested (see section 6).

### 8. Content & keywords (brief)

Audience: parents (and teachers) of children aged 3–8. Suggested main keyword per page type, and whether the current title/H1 match the search intent:

| Page type | en | fr | es | pt | Match today |
|---|---|---|---|---|---|
| Home | learn the alphabet for kids / free alphabet worksheets | apprendre l'alphabet maternelle | aprender el abecedario para niños | aprender o alfabeto para crianças | Good in all 4 |
| Alphabet hub | alphabet for kids | alphabet maternelle | abecedario para niños | alfabeto para crianças | Good |
| Letter page | letter A for kids / letter a words | lettre A maternelle | letra A para niños | letra A para crianças | Good; H1 "Letter A a" could add "for kids" |
| Worksheets hub | free printable alphabet worksheets | fiches maternelle à imprimer gratuit | fichas para imprimir preescolar | atividades para imprimir educação infantil | Good |
| Tracing | letter tracing worksheets | fiches tracé des lettres / graphisme | fichas de trazo de letras | atividades de traçar letras | EN title "Tracing Worksheets" is too vague → "Letter Tracing Worksheets A–Z (Free PDF)" |
| Phonics / sounds | phonics for kids; cvc words worksheets; blending sounds | les sons CP / apprendre à lire | sílabas para niños | famílias silábicas | Hubs good; EN skill pages thin (I7) |
| Games | alphabet games for kids / free online letter games | jeux alphabet maternelle | juegos del abecedario | jogos do alfabeto | EN "Learning Games" / "Find the Letter" too generic (I8); fr/es/pt good |
| Stories | short stories for kids to read | histoires courtes pour enfants | cuentos cortos para niños | histórias infantis curtas | fr/es/pt good; EN default title (I1) and "Story Time" |
| Pricing | (brand) AlphaBes Pro price | AlphaBes Pro tarif | precio AlphaBes Pro | preço AlphaBes Pro | Mostly brand searches; "Pricing" → "AlphaBes Pro: Plans & Pricing" |

Volumes weren't pulled (no paid keyword tool was used). They can be checked in Search Console (impressions per query) once the site has a few weeks of data.

---

## Phase 2 notes (for when fixes are approved)

- Text changes listed per language before anything is applied: I1, I8, M1, M2 and I7 change visible or meta text. I4 removes a legal page.
- Many fixes change **English** output (titles, sitemap entries, OG tags). CLAUDE.md's "English URLs and output must not change" rule was written for i18n work, so English changes will be listed for approval too.
- Code-only fixes that don't change any visible text: I2, I3, I5, I6, I9, I10, I11, M3, M4, M7, M8, M9, M11, M12.
- Cloudflare dashboard (owner): M6 HSTS, M7 one-hop www.

---

## Phase 2, batch 1 (2026-10-07): fixes with no visible text change

Owner's scope: I2, I3, I4, I5, I6, I9 (safe changes only), I10, I11, and the non-text Minor issues M3, M4, M7, M8, M9, M10 (WebSite, Offer, stories), M11, M12. No title, description, H1 or body text changed in any language.

### What changed

| # | Change | Code |
|---|---|---|
| I2 | Sitemap lists the letter worksheet pages (26 en, 30 fr, 27 es, 27 pt) and the 5 English games, so all hreflang targets are in it. The fr/es/pt games now come in with their English twin; only the clapping game (es/pt only) is listed alone | `lib/sitemap.ts` |
| I3 | `/login` and `/register` left the sitemap | `lib/sitemap.ts` |
| I4 | `/privacy` → **301** `/privacy-policy`; the old page and its route are gone | `next.config.js`, `i18n/routing.ts` |
| I5, I6, M3, M4 | Every page's metadata goes through `withSocialMetadata`: `og:url` = canonical, `og:title`/`og:description` = the page's own, `og:image` = the page's image or the site card, `og:type`, `og:site_name`, `og:locale` (en_US, fr_FR, es_LA, pt_BR), and matching `twitter:*`. English stories get their name as `og:title` (their `<title>` is batch 2) | `lib/social-metadata.ts`, every `page.tsx`, `components/LocaleDocument.tsx` |
| I9 | The French, Spanish and Portuguese games imported a few word lists from the worksheet catalogues, which pulled the whole catalogues (50 kB gzipped) into the browser code of every game page. The lists moved, unchanged, to `lib/*-words.ts` (re-exported where they were) | `lib/fiches-fr-words.ts`, `lib/fichas-es-words.ts`, `lib/atividades-pt-words.ts` |
| I10 | The free games' box keeps at least the game's smallest measured height while the game loads in the browser | `components/games/game-area.ts`, `game-*.tsx` |
| I11 | A 320 px copy of each of the 749 previews (`x.320.jpg`, `npm run previews:thumbs`); worksheet cards offer it in `srcset`; the large hero preview keeps 476 px | `scripts/preview-thumbs.mjs`, `components/fiches/FicheParts.tsx` |
| M7 | `/en/...` → **308** to the unprefixed URL (was 307) | `middleware.ts` |
| M8 | `/manifest.webmanifest` and `/apple-icon` (180 px), linked from every page | `app/manifest.ts`, `app/apple-icon.tsx`, middleware matcher |
| M9 | Previews, PDFs, story audio and `favicon.ico`: `max-age=86400, stale-while-revalidate=604800` (was `max-age=0`) | `public/_headers` |
| M10 | JSON-LD `WebSite` on the 4 home pages; `Product` "AlphaBes Pro" with the monthly and yearly `Offer` (USD, `UnitPriceSpecification`) on the 4 pricing pages; `ShortStory` on every story page | `lib/json-ld.ts` |
| M11 | Footer column titles are `<p>` with the same classes (were `<h2>`) | `components/Footer.tsx` |
| M12 | The footer's Dashboard link is `rel="nofollow"`, and robots.txt disallows the dashboard in all 4 languages (was `/dashboard` only) | `components/Footer.tsx`, `app/robots.ts` |

Not done under I9: the remaining shared JavaScript is React and the Next.js runtime (103 kB, the same chunks as before), and a game page still ships the game components of all 4 languages. Splitting those per language would mean restructuring the game pages, which isn't a "safe" change. The Cloudflare Web Analytics beacon (~100 ms) is injected by Cloudflare and can only be turned off in the dashboard.

### Tests added (`tests/seo/`, 17 tests)

- `sitemap-coverage`: every letter worksheet and game is listed in all languages; no URL twice; no noindex, private or unwritten page; every hreflang alternate has its own entry; game alternates equal the pages' own.
- `social-metadata`: og/twitter completion, canonical as `og:url`, page values kept, locales.
- `json-ld`: the Offer prices equal what each language's pricing page shows; WebSite and ShortStory URLs and languages.
- `preview-thumbs`: every fr/es/pt preview has an up-to-date thumbnail.
- `robots`: the dashboards in 4 languages are disallowed.
- `tests/i18n/middleware`: `/en`, `/en/`, `/en/x?y` → 308; manifest and icons bypass the middleware.

### Local checks (`next build` + `next start`)

- `tsc` clean, lint clean, **394/394 unit tests** (38 files).
- **Every page compared with production** (`scripts/i18n-check/snapshot.mjs` + a per-line diff, 1,781 pages in 4 languages): visible text, links, title, description, canonical, hreflang, robots and existing JSON-LD are **identical on every page**. The only differences are the og/twitter tags (1,673 pages) and the new JSON-LD (32 ShortStory, 4 WebSite, 4 Product).
- After: all 1,778 indexable pages have `og:image`, `og:type`, `og:locale`, `twitter:image`, and `og:url` = canonical; no generic `twitter:title` remains.
- Sitemap: **XSD valid, 0 errors**, 1,778 URLs = 1,666 − 3 (`/login`, `/register`, `/privacy`) + 115 (exactly the 115 indexable pages the audit found missing). The 1,663 URLs in both have identical entries apart from `lastmod`.
- Game CLS (Playwright, 5 widths from 360 to 1280 px, the 10 free game pages): **0.07–0.31 before → 0–0.036 after**; the game heights are unchanged (no added blank space). All 22 game pages and 3 play pages render with no console errors; premium pages show their paywall when logged out.
- First-load JS: game pages **193 → 162 kB**, play pages 195 → 164 kB, phonics skill pages 141 → 129 kB. Other pages unchanged.
- Preview images loaded on a phone (412 px wide, worksheet hubs and `/fr`): at 1.75× density 33–96 KB → 12–14 KB; at 3× density 63–72 KB → 32–36 KB.
- Checkout: logged-out subscribe, both plans × 4 languages → 303 to the localized login (unchanged).

### Production (2026-10-07)

Commit `54fe465` pushed as `HEAD:main` at 13:25:49 UTC (fast-forward from `74f8c3f`; the branch was not pushed, so no preview version was uploaded). Workers Builds built it 13:26:17–13:29:57 and deployed version `e7e04d1c` at 13:29:49 (100%).

- **Bindings:** `PAYPAL_MODE` is still `live` (compared, not printed); 17 bindings, including `PRO_FILES`, the cache bucket and the 10 secrets.
- **Sitemap:** 200 `application/xml`, the same `Cache-Control`. **XSD valid, 0 errors.** 1,778 URLs, exactly the local build's set. 1,746 `lastmod` values = this build (13:27:01); stories keep their own dates.
- **4 languages unchanged:** every page snapshotted again on production and compared with the morning baseline (1,781 pages: the sitemap plus extras). **0 unexpected differences**; the only changes are the og/twitter tags (1,673 pages) and the new JSON-LD (32 ShortStory, 4 WebSite, 4 Product), exactly as in the local check.
- **Edge cases:** `/privacy` → 301 `/privacy-policy`; `/en/pricing` and `/en` → 308; `/manifest.webmanifest` (`application/manifest+json`), `/apple-icon` and `/icon` 200; robots.txt lists the 4 dashboards; `/login` 200 noindex; `/nope` and `/fr/nope` 404; `/dashboard` 307 to login. Previews, thumbnails and `favicon.ico`: `max-age=86400, stale-while-revalidate=604800`.
- **Game CLS** (Playwright, 50 measurements): worst value per page 0–0.036 (before: 0.07–0.31).

**Crawl, before → after** (Googlebot smartphone, every sitemap URL):

| Check | Before (1,666 URLs) | After (1,778 URLs) |
|---|---|---|
| Non-200 | 0 | 0 |
| noindex pages in the sitemap | 2 | **0** |
| hreflang targets outside the sitemap | 15 | **0** |
| Indexable pages linked on the site but missing from the sitemap | 115 | **0** (what's left: 835 PDFs, 163 Pro download links, noindex login/dashboard/play pages) |
| Orphan pages | 1 (`/privacy`) | **0** |
| No `og:image` | 806 | **0** |
| `og:url` ≠ canonical | 107 | **0** |
| No `og:type` / no `og:locale` | 1,550 / 1,642 | **0 / 0** |
| `twitter:title` = "AlphaBes" | 1,657 | **0** |
| WebSite / Product / ShortStory JSON-LD | 0 / 0 / 0 | 4 / 4 / 32 |
| Manifest and apple-touch-icon linked | 0 | 1,778 |
| Titles > 60 / < 30 characters | 952 / 36 | 979 / 37 (the 112 new sitemap pages bring their titles; batch 2) |
| Descriptions > 160 / < 70 | 83 / 51 | 110 / 55 (batch 2) |
| TTFB p50 / p90 | 0.36 s / 0.94 s | 0.33 s / 0.61 s |

**Lighthouse mobile, before → after** (same 20 pages, one run each, lab noise ±10–15 points):

| Page | Perf | CLS | TBT | Page weight |
|---|---|---|---|---|
| en / fr / es / pt game | 50 / 68 / 71 / 49 → **86 / 83 / 82 / 85** | 0.29 / 0.27 / 0.31 / 0.29 → **0 / 0 / 0 / 0** | 540 / 410 / 430 / 450 → 240 / 310 / 420 / 370 ms | 330–366 → 301–305 KB |
| fr / es / pt worksheet hub | 66 / 87 / 84 → 85 / 77 / 77 | 0 | 480 / 310 / 440 → 360 / 280 / 600 ms | 1,078 / 1,141 / 1,067 → **636 / 643 / 613 KB** |
| home ×4 | 80 / 80 / 78 / 83 → 85 / 75 / 88 / 78 | 0 | 210–560 → 320–580 ms | fr/es/pt 411–443 → 334–370 KB |
| pricing ×4 | 85 / 85 / 88 / 91 → 77 / 87 / 87 / 87 | 0 | 280–480 → 270–490 ms | unchanged |
| story ×4 | 90 / 86 / 86 / 68 → 83 / 90 / 87 / 90 | 0 | 210–390 → 240–420 ms | unchanged |

SEO score 100 on all 20 pages. TBT (I9) moved within noise except on the game pages: the remaining main-thread work is React and the Next.js runtime, shared by every page.

### Status after batch 1

| Issue | Status |
|---|---|
| I2, I3, I4, I5, I6, I10, I11 | **Fixed** (verified on production) |
| I9 | **Partly fixed**: game pages −31 kB JS. The shared React/Next runtime and the 4-language game bundle remain (see above) |
| M3, M4, M7, M8, M9, M11, M12 | **Fixed** |
| M10 | **Partly fixed**: WebSite, Product/Offer and ShortStory added. Still open: Organization `logo`/`sameAs`, English `LearningResource` `inLanguage`/`image`, letter pages' `LearningResource` `url` |
| I1, I7, I8, M1, M2 | **Batch 2**, proposals in [seo-batch2-proposals.md](seo-batch2-proposals.md), waiting for the owner's approval |
| M6 (HSTS), M7 (www 2 hops) | **Owner**, in the Cloudflare dashboard |
| M5, M13, M14, M15, M16 | Open (not in batch 1) |

---

## Phase 2, batch 2 (2026-10-07): titles, descriptions and content

Owner's approval, all 4 languages: rules R1, R2 and R3, the hand-rewritten titles and descriptions, the I7 content (phonics sections, "How to use this worksheet", game sections, English worksheet previews), and `noindex` for the blog categories instead of introductions. Proposals: [seo-batch2-proposals.md](seo-batch2-proposals.md).

**Portuguese letter worksheets:** 27 pages = the 26 letters + Ç (`/pt/alfabeto/c-cedilha/atividade`, a page of its own in `lib/letters-pt.ts`). Ç's title starts with "O Ç" like before: *O Ç: traçado em letra bastão, de forma e cursiva*.

### How it's applied

| Change | Code |
|---|---|
| Hand-rewritten titles and descriptions (159 entries + the 26 English letter bundles) in one table keyed by path. They replace only `<title>`, the meta description and og/twitter; the data and text on the page are untouched | `lib/seo/meta-overrides.ts`, applied in `lib/social-metadata.ts` |
| R1 (brand only when ≤ 60) and R2 (worksheet suffix fallbacks) for every page | `fitTitle()` in `lib/social-metadata.ts` |
| English story titles and descriptions (I1); R3 for fr/es/pt stories | `app/[locale]/stories/[slug]/page.tsx` |
| Portuguese letter-worksheet title pattern | `worksheet-pt.tsx` |
| H1: Plans and Pricing / Formules et tarifs / Planes y precios / Planos e preços; English games, stories, flashcards, activities | `messages/*.json`, `*-en.tsx` |
| Phonics "How to practice at home" and "Watch out for" (8 pages) | `lib/phonics-data.ts`, `skill-en.tsx` |
| Game "How to play" and "What your child practices" (5 pages) | `lib/games-data.ts`, `game-en.tsx` |
| "How to use this worksheet" (346 English worksheet pages) | `lib/worksheet-howto.ts`, `category-en.tsx` |
| Previews of the 242 English worksheets that have a PDF (`npm run previews:en`, pdf.js in Playwright + sharp, 476 px + 320 px), shown in place of the letter placeholder, and used as `og:image` and `LearningResource.image`. The 104 worksheets made in the browser (uppercase, lowercase, coloring, review) have no PDF and keep the placeholder | `scripts/previews-en.mjs`, `public/worksheets-pdf/previews/` |
| Blog categories (6): `noindex, follow`, out of the sitemap | `blog/[slug]/page.tsx`, `lib/sitemap.ts` |

### Corrections made while checking against the real content

The approved texts were checked against the printed sheets (rendered previews), the game components and the blog articles. These sentences were corrected to match reality:

- **Worksheet how-to (letters):** "Print it in black and white" → "in color or in black and white" (the sheets are in color). "trace … starting at the dot" → "Start with a finger on the page, then use a pencil or crayon" (no start dots, and the same block also covers the recognition, matching and coloring sheets).
- **Numbers:** "following the arrows" removed (none on the sheets); the number 0 gets "Show an empty hand or an empty plate … zero means none" instead of "Count out 0 objects".
- **Shapes:** the everyday examples are per shape (a plate for a circle, a roof for a triangle…).
- **Colors:** "Color the picture" → "Color the shapes".
- **Sight words:** "don't follow the usual sound rules" → "come up in almost every book" (and, in, it are decodable).
- **CVC:** the letter-change chain is per word (cat → hat → hot, sun → bun → bin…). **X** uses "like box" (xylophone doesn't start with /ks/).
- **Games:**
  - Find the Letter: one target per round, uppercase only, "Try again" instead of a shake, plus the timer.
  - Match: the picture's name starts with the letter (not always its sound).
  - Beginning Sounds: the word is shown, with a Listen button.
  - Letter Tracing: no start dot or arrows; there's an uppercase/lowercase switch; it covers all 26 letters.
  - Alphabet Quiz: its three kinds of questions.
- **Descriptions (8):**
  - `/worksheets/numbers` (no coloring on the sheets), `/worksheets/numbers-cursive` and `/worksheets/letter-cursive` (the cursive isn't joined).
  - `/worksheets/handwriting` and `/worksheets/alphabet-writing-practice` (one page each, no free-writing lines).
  - `/kindergarten/handwriting` (the tips are about size, spacing and where letters start, not pencil grip).
  - `/blog/fun-abc-games-for-kids` and `/blog/how-to-practice-phonics-at-home` (said what the articles actually contain).

### Tests added

- `tests/seo/meta-overrides`: R1/R2 examples; every override path is a real page; every title ≤ 60 characters as shown; every description 70–160.
- `tests/seo/worksheet-howto`: a how-to text for every letter and static worksheet; a preview and thumbnail for all 242 PDFs.
- `tests/seo/sitemap-coverage`: no blog category in the sitemap.

### Local checks (`next build` + `next start`)

- `tsc` clean, lint clean, **401/401 unit tests** (40 files).
- Every page compared with production (1,778 pages, 4 languages):
  - **French, Spanish and Portuguese visible text unchanged** except the 3 approved pricing H1s.
  - English text changed only on the approved pages: 5 H1s, 8 phonics, 5 games, 346 worksheets.
  - The 6 blog categories left the sitemap.
- On the 1,772 indexable pages: **0 titles over 60 characters** (was 979). 13 under 30 (legal, contact, about: kept, as agreed). Descriptions: 27 over 160 and 4 under 70 (see "Not covered" below).
- No console errors on the new sections; screenshots at 412 px checked.

### Not covered by the approval (owner's decision)

These pages weren't in the original crawl (they joined the sitemap in batch 1), so they had no proposal:

- 27 Spanish letter-worksheet pages (`/es/abecedario/*/ficha`): description of 167 characters (*Traza la letra A a en la pantalla, con el dedo o el ratón, en letra script o cursiva sobre doble raya, escucha su nombre y descarga una ficha PDF gratis para imprimir.*).
- 4 English game pages: descriptions of 60–68 characters.
- 3 English legal pages (`/terms`, `/cookies`, `/privacy-policy`) still use the site's default description, shared by all three. They were outside the proposals (legal pages); a one-line description each would fix it.

### Production (2026-10-07)

Commit `312975d` pushed as `HEAD:main` at 14:18:39 UTC (fast-forward; the branch was not pushed). Workers Builds finished at 14:23:47 and deployed version `3fed0361` (100%).

- **Bindings:** `PAYPAL_MODE` still `live` (compared, not printed); 17 bindings including `PRO_FILES`.
- **Sitemap:** XSD valid, 0 errors. 1,772 URLs: the previous 1,778 minus exactly the 6 blog categories, nothing added. **No noindex page in the sitemap** (0 in the crawl).
- **4 languages:** production compared page by page with the version before batch 2. The result is identical to the local check: **French, Spanish and Portuguese visible text unchanged** except the 3 approved pricing H1s. English text changed only on the approved pages. The blog categories serve `noindex, follow`.
- **Sample titles:**
  - `/pricing`: *AlphaBes Pro: Plans and Pricing | AlphaBes*
  - `/fr/tarifs`: *AlphaBes Pro : formules et tarifs | AlphaBes*
  - `/stories/the-little-apple`: *The Little Apple: A Short Story to Read and Listen To*
  - `/pt/alfabeto/c-cedilha/atividade`: *O Ç: traçado em letra bastão, de forma e cursiva | AlphaBes*

**Crawl of every sitemap URL (Googlebot smartphone), audit → batch 1 → batch 2:**

| Check | Audit | After batch 1 | After batch 2 |
|---|---|---|---|
| Sitemap URLs | 1,666 | 1,778 | 1,772 |
| Non-200 | 0 | 0 | 0 |
| noindex pages in the sitemap | 2 | 0 | 0 |
| hreflang targets outside the sitemap | 15 | 0 | 0 |
| Titles > 60 characters | 952 | 979 | **0** |
| Titles < 30 characters | 36 | 37 | 13 (legal, contact, about: kept) |
| Duplicate titles (pages) | 12 | 10 | 2 (`/es/cookies`, `/pt/cookies`: "Política de cookies", correct in both languages) |
| Descriptions > 160 | 83 | 110 | 27 (Spanish letter worksheets, not in the approval) |
| Descriptions < 70 | 51 | 55 | 4 (English games, not in the approval) |
| Duplicate descriptions (pages) | 15 | 12 | 3 (English legal pages) |
| Pages with `og:image` | 860 | 1,778 | 1,772 |
| English worksheets with a real preview | 0 | 0 | 242 |
| Words per page, median | 225 | 221 | 234 (`/phonics/cvc-words` 123 → 203, `/games/find-the-letter` 97 → 160, `/worksheets/number-3-tracing` 136 → 187) |

### Status after batch 2

| Issue | Status |
|---|---|
| I1, I8, M1 | **Fixed** |
| I7 | **Fixed** for the approved parts (phonics, games, worksheet how-to, previews; blog categories noindex). The 104 browser-made worksheets have no preview |
| M2 | **Fixed** for every page in the proposal; open: 27 Spanish letter worksheets (> 160), 4 English games (< 70), 3 English legal pages (shared default) |
| Still open from the audit | I9 (shared runtime), M5, M7 (owner: www 2 hops), M10 (logo, English `LearningResource` `inLanguage`), M13, M14, M15, M16. M6 (HSTS) fixed, see batch 3 |

---

## Phase 2, batch 3 (2026-10-07): last descriptions, cookie pages

Owner's approval: every row of the batch 3 table; the other fr/es/pt legal descriptions stay as they are.

- **27 Spanish letter-worksheet pages** (`worksheet-es.tsx`): *Traza la letra A a en la pantalla con el dedo o el ratón, en script o cursiva sobre doble raya, escucha su nombre y descarga la ficha PDF gratis.* (145 characters; was 167).
- **4 English games** and **6 legal pages** (`/terms`, `/cookies`, `/privacy-policy`, `/fr/conditions-utilisation`, `/es/terminos-de-uso`, `/pt/termos-de-uso`): new descriptions in `lib/seo/meta-overrides.ts`, 127–149 characters.
- **Cookie pages, language preference:** the switcher has 4 languages.
  - English: "switch between English and French with the EN / FR buttons" → "switch languages with the EN / FR / ES / PT buttons".
  - French: "passez de l'anglais au français avec les boutons EN / FR" → "changez de langue avec les boutons EN / FR / ES / PT".
  - Spanish: "EN / FR / ES" → "EN / FR / ES / PT".
  - Portuguese was already right.
  - The "last updated" date of the 3 changed pages is now October 7, 2026.
- **Test:** the 27 Spanish worksheet descriptions stay within 70–160 characters.
- **Local check:** tsc and lint clean, **402/402 tests**. Every page compared with production: 1,707 identical. 37 pages changed only their description and og/twitter tags, the 3 cookie pages changed their text as above, and 32 stories differ only in the database dates (the local server reads the `dev` branch). **0 descriptions over 160**; none under 70 left to fix (the snapshot shows the sight-word descriptions cut at their quotation marks; the real ones are longer).

### Production (2026-10-07)

Commit `e1fb057` pushed as `HEAD:main` at 22:44:17 UTC; Workers Builds deployed version `edbebc82` (build finished 22:48:02).

- `PAYPAL_MODE` still `live` (compared, not printed); 17 bindings including `PRO_FILES`.
- Sitemap: **XSD valid, 0 errors**, the same 1,772 URLs as before.
- The 14 pages checked serve the new descriptions, all `index, follow`:
  - 27 Spanish worksheets: 145 characters.
  - The 4 games: 127–141 characters.
  - The 6 legal pages: 135–149 characters.
  - The kept fr legal descriptions are unchanged.
- The 4 cookie pages say "EN / FR / ES / PT"; the old two-language wording is gone.

### M6 (HSTS): fixed

Enabled by the owner in Cloudflare (SSL/TLS → Edge Certificates). Checked with `curl -I` on 2026-10-07: `Strict-Transport-Security: max-age=15552000; includeSubDomains` (no preload) on every https response tested:
- `/` (10 out of 10 requests), `/fr/jeux`, `/sitemap.xml`, `/es/precios`, a story, a preview JPG, `/favicon.ico`;
- the `/nope` 404 and the `https://www` 301.

Plain-http responses don't carry it, which is correct (browsers ignore it over http). It comes from Cloudflare, so nothing is added in the app.

### M7 (www in one hop): waiting for the owner

`https://www.alphabes.com/fr/jeux?x=1` takes 1 hop, but `http://www.alphabes.com/fr/jeux?x=1` takes 2: Always Use HTTPS answers first (→ `https://www…`), then the www rule. Path and query are kept. The dashboard change is described in the conversation of 2026-10-07: a Single Redirect for `www.alphabes.com` → `https://alphabes.com` + path (301, query kept), a second one for http on the apex, and Always Use HTTPS turned off. To verify once it's done.
