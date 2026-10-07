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
