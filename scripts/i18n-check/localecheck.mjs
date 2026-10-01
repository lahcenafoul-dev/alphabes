// Usage: node localecheck.mjs <fr|es> [baseUrl] -- checks one language's pages
// against a running server: status, lang, titles, canonical/hreflang, English
// left in the text, every internal link, and the routing rules.
const lang = process.argv[2];
const base = process.argv[3] ?? "http://localhost:3100";

// French phase 2: the alphabet (26 letters + é è ê ç), the accents page and the imagier.
const frLetters = [..."abcdefghijklmnopqrstuvwxyz", "e-accent-aigu", "e-accent-grave", "e-accent-circonflexe", "c-cedille"];
// French phase 3: the sounds (lib/sons-fr.ts).
const frSounds = [
  "voyelles", "premier-son", "syllabes", "ou", "on", "an", "in", "oi", "ch", "gn", "eu", "o-au-eau",
  "e-accent-aigu", "e-accent-grave", "ill", "c-et-g", "s-et-ss", "lettres-muettes", "mots-outils",
];

// [path, fetch options, expected status, expected redirect (path + query) or null, label]
const RULES_FR = [
  ["/fr/blog", {}, 404, null, "French page not written yet"],
  ["/fr/xyz", {}, 404, null, "unknown French URL"],
  ["/does-not-exist", {}, 404, null, "unknown English URL"],
  ["/en/pricing", {}, 307, "/pricing", "/en prefix removed"],
  ["/fr/pricing", {}, 404, null, "English word under /fr"],
  ["/fr/tableau-de-bord", {}, 307, "/fr/connexion?next=%2Ffr%2Ftableau-de-bord", "French dashboard needs login"],
  ["/dashboard", {}, 307, "/login?next=%2Fdashboard", "English dashboard needs login"],
  ["/pricing", { headers: { cookie: "NEXT_LOCALE=fr" } }, 307, "/fr/tarifs", "remembered French choice"],
  ["/blog", { headers: { cookie: "NEXT_LOCALE=fr" } }, 200, null, "no French twin: stay"],
  ["/games", { headers: { cookie: "NEXT_LOCALE=fr" } }, 307, "/fr/jeux", "games index has a French twin"],
  ["/games/find-the-letter", { headers: { cookie: "NEXT_LOCALE=fr" } }, 307, "/fr/jeux/trouve-la-lettre", "game twin with a French slug"],
  ["/fr/jeux/find-the-letter", {}, 404, null, "English game slug under /fr/jeux"],
  ["/games/trouve-la-lettre", {}, 404, null, "French game slug under an English URL"],
  ["/kindergarten/sight-words", { headers: { cookie: "NEXT_LOCALE=fr" } }, 307, "/fr/grande-section/mots-outils", "topic twin with a French slug"],
  ["/fr/maternelle/graphisme", { headers: { cookie: "NEXT_LOCALE=en" } }, 200, null, "French-only topic, English chosen: stay"],
  ["/preschool/graphisme", {}, 404, null, "French topic under an English URL"],
  ["/activities", { headers: { cookie: "NEXT_LOCALE=fr" } }, 307, "/fr/activites", "activities have a French twin"],
  ["/alphabet/c-cedille", {}, 404, null, "French-only letter under an English URL"],
  ["/fr/alphabet/c-cedille", { headers: { cookie: "NEXT_LOCALE=en" } }, 200, null, "French-only letter, English chosen: stay"],
  ["/fr/sons/blending", {}, 404, null, "English phonics skill under /fr/sons"],
  ["/phonics/ou", {}, 404, null, "French sound under an English URL"],
  ["/phonics", { headers: { cookie: "NEXT_LOCALE=fr" } }, 307, "/fr/sons", "phonics index has a French twin"],
  ["/phonics/blending", { headers: { cookie: "NEXT_LOCALE=fr" } }, 200, null, "English-only skill, French chosen: stay"],
  ["/fr/fiches/letter-a-tracing", {}, 404, null, "English worksheet under /fr/fiches"],
  ["/worksheets/lettre-a-cursive", {}, 404, null, "French worksheet under an English URL"],
  ["/fr/fiches/packs/complete-bundle", {}, 404, null, "English bundle under /fr/fiches/packs"],
  ["/worksheets", { headers: { cookie: "NEXT_LOCALE=fr" } }, 307, "/fr/fiches", "worksheet index has a French twin"],
  ["/worksheets/letter-a-tracing", { headers: { cookie: "NEXT_LOCALE=fr" } }, 200, null, "English-only worksheet, French chosen: stay"],
  ["/fr/histoires/the-little-apple", {}, 404, null, "English story under /fr/histoires"],
  ["/stories/la-petite-pomme", {}, 404, null, "French story under an English URL"],
  ["/stories", { headers: { cookie: "NEXT_LOCALE=fr" } }, 307, "/fr/histoires", "story list has a French twin"],
  ["/fr/tarifs", { headers: { cookie: "NEXT_LOCALE=en" } }, 307, "/pricing", "remembered English choice"],
  ["/pricing", { headers: { "accept-language": "fr-FR,fr;q=0.9" } }, 200, null, "no Accept-Language redirect"],
];

const LANGS = {
  fr: {
    // Where a signed-out visitor is redirected (307) instead of a 200.
    loginRedirect: "tableau-de-bord",
    // English words that are also French words.
    sameWords: ["parent", "parents", "sons", "session"],
    pages: [
      "/fr", "/fr/tarifs", "/fr/a-propos", "/fr/contact", "/fr/confidentialite", "/fr/conditions-utilisation", "/fr/cookies", "/fr/connexion", "/fr/inscription",
      "/fr/alphabet", "/fr/alphabet/accents", "/fr/imagier",
      ...frLetters.flatMap((l) => [`/fr/alphabet/${l}`, `/fr/alphabet/${l}/fiche`]),
      "/fr/sons",
      ...frSounds.map((s) => `/fr/sons/${s}`),
      // French phase 4: worksheets (a sample; the tests check every catalogue entry).
      "/fr/fiches", "/fr/fiches/packs", "/fr/fiches/ecriture-cursive", "/fr/fiches/nombres", "/fr/fiches/sons",
      "/fr/fiches/lettre-a-cursive", "/fr/fiches/lettre-e-accent-aigu-son", "/fr/fiches/syllabes-m", "/fr/fiches/son-ou",
      "/fr/fiches/couleur-rouge", "/fr/fiches/packs/pack-alphabet-complet", "/fr/fiches/packs/pack-lettre-c-cedille",
      // French phase 5: stories (from the database).
      "/fr/histoires", "/fr/histoires/la-petite-pomme", "/fr/histoires/la-sieste-de-leon",
      // French phase 6: games, school levels and activities.
      "/fr/jeux", "/fr/jeux/trouve-la-lettre", "/fr/jeux/lettre-et-image", "/fr/jeux/premier-son", "/fr/jeux/trace-la-lettre", "/fr/jeux/quiz-alphabet",
      "/fr/maternelle", "/fr/maternelle/graphisme", "/fr/maternelle/tracer-les-lettres", "/fr/maternelle/coloriage",
      "/fr/grande-section", "/fr/grande-section/syllabes", "/fr/grande-section/mots-outils", "/fr/grande-section/ecriture-cursive",
      "/fr/activites",
    ],
    rules: RULES_FR,
  },
  // Filled phase by phase, as Spanish pages are written (docs/spanish-plan.md).
  es: {
    loginRedirect: "mi-cuenta",
    sameWords: [],
    pages: [],
    rules: [],
  },
};

const config = LANGS[lang];
if (!config) {
  console.log("Usage: node localecheck.mjs <fr|es> [baseUrl]");
  process.exit(1);
}
const { pages, rules, loginRedirect, sameWords } = config;
const NAME = { fr: "French", es: "Spanish" }[lang];

const decode = (s) => s.replace(/&amp;/g, "&").replace(/&#x27;|&#39;/g, "'").replace(/&quot;/g, '"').replace(/&nbsp;/g, " ");
// English words that shouldn't appear in the page text. Word boundaries are
// letter-aware, so "préparent" doesn't contain "parent".
const ENGLISH_WORDS = /(?<!\p{L})(the|and|your|with|free|worksheets?|letters?|sounds?|children|parents?|sign up|log in|learn|games?|stories|about us|privacy|terms|cookie policy)(?!\p{L})/giu;
const looksEnglish = (t) => [...t.matchAll(ENGLISH_WORDS)].some((m) => !sameWords.includes(m[1].toLowerCase()));
const ALLOWED_EN = [/^EN$/, /^English$/, /AlphaBes/, /^Pro$/, /Google|AdSense|Analytics|NextAuth|Neon|Postgres|Cloudflare|Stripe|NEXT_LOCALE|EN \/ FR/];

let problems = 0;
const fail = (msg) => { problems++; console.log("  ✗ " + msg); };
const links = new Set();

async function get(path, opts = {}) {
  const res = await fetch(base + path, { redirect: "manual", ...opts });
  return { res, html: await res.text() };
}

for (const p of pages) {
  const { res, html } = await get(p);
  const title = decode(html.match(/<title>([^<]*)<\/title>/)?.[1] ?? "");
  const htmlLang = html.match(/<html lang="([a-z]+)"/)?.[1];
  const canonical = html.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
  const hreflang = [...html.matchAll(/hrefLang="([^"]+)" href="([^"]+)"/g)].map((m) => `${m[1]}=${m[2].replace("https://alphabes.com", "")}`);
  console.log(`${p} ${res.status} lang=${htmlLang} title="${title}"`);
  console.log(`    canonical=${canonical ?? "-"} hreflang=[${hreflang.join(" ")}]`);
  if (res.status !== 200) fail(`${p} status ${res.status}`);
  if (htmlLang !== lang) fail(`${p} lang ${htmlLang}`);
  const body = (html.split("<body")[1] ?? "").replace(/<script[\s\S]*?<\/script>/g, "").replace(/<template[\s\S]*?<\/template>/g, "");
  for (const m of body.matchAll(/<a [^>]*href="([^"#]*)"/g)) if (m[1].startsWith("/")) links.add(m[1]);
  const text = decode(body.replace(/<[^>]+>/g, "\n")).split("\n").map((l) => l.trim()).filter(Boolean);
  const english = text.filter((t) => looksEnglish(t) && !ALLOWED_EN.some((r) => r.test(t)));
  if (english.length) fail(`${p} English-looking text: ${JSON.stringify(english.slice(0, 5))}`);
}

console.log(`\nChecking ${links.size} internal links found on ${NAME} pages…`);
for (const l of [...links].sort()) {
  const { res } = await get(l);
  const where = res.headers.get("location");
  const ok = res.status === 200 || (res.status === 307 && l.includes(loginRedirect));
  console.log(`  ${ok ? "✓" : "✗"} ${res.status} ${l}${where ? " -> " + where : ""}`);
  if (!ok) problems++;
}

console.log("\nRouting rules:");

for (const [path, opts, status, location, label] of rules) {
  const { res, html } = await get(path, opts);
  const loc = res.headers.get("location");
  const locPath = loc ? new URL(loc, base).pathname + new URL(loc, base).search : null;
  const ok = res.status === status && (location === null || locPath === location);
  const extra = res.status === 404 ? ` lang=${html.match(/<html lang="([a-z]+)"/)?.[1]} h1="${decode(html.match(/<h1[^>]*>([^<]*)/)?.[1] ?? "")}"` : "";
  console.log(`  ${ok ? "✓" : "✗"} ${label}: ${path} -> ${res.status}${locPath ? " " + locPath : ""}${extra}`);
  if (!ok) problems++;
}

console.log(problems ? `\n${problems} problem(s)` : `\nall ${NAME} checks passed`);
