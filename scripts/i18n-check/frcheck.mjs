// Usage: node frcheck.mjs [baseUrl] -- checks the French pages against a running server.
const base = process.argv[2] ?? "http://localhost:3100";
// Phase 2: the alphabet (26 letters + é è ê ç), the accents page and the imagier.
const letters = [..."abcdefghijklmnopqrstuvwxyz", "e-accent-aigu", "e-accent-grave", "e-accent-circonflexe", "c-cedille"];
// Phase 3: the sounds (lib/sons-fr.ts).
const sounds = [
  "voyelles", "premier-son", "syllabes", "ou", "on", "an", "in", "oi", "ch", "gn", "eu", "o-au-eau",
  "e-accent-aigu", "e-accent-grave", "ill", "c-et-g", "s-et-ss", "lettres-muettes", "mots-outils",
];
const pages = [
  "/fr", "/fr/tarifs", "/fr/a-propos", "/fr/contact", "/fr/confidentialite", "/fr/conditions-utilisation", "/fr/cookies", "/fr/connexion", "/fr/inscription",
  "/fr/alphabet", "/fr/alphabet/accents", "/fr/imagier",
  ...letters.flatMap((l) => [`/fr/alphabet/${l}`, `/fr/alphabet/${l}/fiche`]),
  "/fr/sons",
  ...sounds.map((s) => `/fr/sons/${s}`),
  // Phase 4: worksheets (a sample; the tests check every catalogue entry).
  "/fr/fiches", "/fr/fiches/packs", "/fr/fiches/ecriture-cursive", "/fr/fiches/nombres", "/fr/fiches/sons",
  "/fr/fiches/lettre-a-cursive", "/fr/fiches/lettre-e-accent-aigu-son", "/fr/fiches/syllabes-m", "/fr/fiches/son-ou",
  "/fr/fiches/couleur-rouge", "/fr/fiches/packs/pack-alphabet-complet", "/fr/fiches/packs/pack-lettre-c-cedille",
];
const decode = (s) => s.replace(/&amp;/g, "&").replace(/&#x27;|&#39;/g, "'").replace(/&quot;/g, '"').replace(/&nbsp;/g, " ");
// English words that shouldn't appear in French page text.
const ENGLISH = /\b(the|and|your|with|free|worksheets?|letters?|sounds?|children|parents?|sign up|log in|learn|games?|stories|about us|privacy|terms|cookie policy)\b/i;
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
  const lang = html.match(/<html lang="([a-z]+)"/)?.[1];
  const canonical = html.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
  const hreflang = [...html.matchAll(/hrefLang="([^"]+)" href="([^"]+)"/g)].map((m) => `${m[1]}=${m[2].replace("https://alphabes.com", "")}`);
  console.log(`${p} ${res.status} lang=${lang} title="${title}"`);
  console.log(`    canonical=${canonical ?? "-"} hreflang=[${hreflang.join(" ")}]`);
  if (res.status !== 200) fail(`${p} status ${res.status}`);
  if (lang !== "fr") fail(`${p} lang ${lang}`);
  const body = (html.split("<body")[1] ?? "").replace(/<script[\s\S]*?<\/script>/g, "").replace(/<template[\s\S]*?<\/template>/g, "");
  for (const m of body.matchAll(/<a [^>]*href="([^"#]*)"/g)) if (m[1].startsWith("/")) links.add(m[1]);
  const text = decode(body.replace(/<[^>]+>/g, "\n")).split("\n").map((l) => l.trim()).filter(Boolean);
  const english = text.filter((t) => ENGLISH.test(t) && !ALLOWED_EN.some((r) => r.test(t)));
  if (english.length) fail(`${p} English-looking text: ${JSON.stringify(english.slice(0, 5))}`);
}

console.log(`\nChecking ${links.size} internal links found on French pages…`);
for (const l of [...links].sort()) {
  const { res } = await get(l);
  const where = res.headers.get("location");
  const ok = res.status === 200 || (res.status === 307 && l.includes("tableau-de-bord"));
  console.log(`  ${ok ? "✓" : "✗"} ${res.status} ${l}${where ? " -> " + where : ""}`);
  if (!ok) problems++;
}

console.log("\nRouting rules:");
const rules = [
  ["/fr/jeux", {}, 404, null, "French page not written yet"],
  ["/fr/xyz", {}, 404, null, "unknown French URL"],
  ["/does-not-exist", {}, 404, null, "unknown English URL"],
  ["/en/pricing", {}, 307, "/pricing", "/en prefix removed"],
  ["/fr/pricing", {}, 404, null, "English word under /fr"],
  ["/fr/tableau-de-bord", {}, 307, "/fr/connexion?next=%2Ffr%2Ftableau-de-bord", "French dashboard needs login"],
  ["/dashboard", {}, 307, "/login?next=%2Fdashboard", "English dashboard needs login"],
  ["/pricing", { headers: { cookie: "NEXT_LOCALE=fr" } }, 307, "/fr/tarifs", "remembered French choice"],
  ["/games", { headers: { cookie: "NEXT_LOCALE=fr" } }, 200, null, "no French twin yet: stay"],
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
  ["/fr/tarifs", { headers: { cookie: "NEXT_LOCALE=en" } }, 307, "/pricing", "remembered English choice"],
  ["/pricing", { headers: { "accept-language": "fr-FR,fr;q=0.9" } }, 200, null, "no Accept-Language redirect"],
];
for (const [path, opts, status, location, label] of rules) {
  const { res, html } = await get(path, opts);
  const loc = res.headers.get("location");
  const locPath = loc ? new URL(loc, base).pathname + new URL(loc, base).search : null;
  const ok = res.status === status && (location === null || locPath === location);
  const extra = res.status === 404 ? ` lang=${html.match(/<html lang="([a-z]+)"/)?.[1]} h1="${decode(html.match(/<h1[^>]*>([^<]*)/)?.[1] ?? "")}"` : "";
  console.log(`  ${ok ? "✓" : "✗"} ${label}: ${path} -> ${res.status}${locPath ? " " + locPath : ""}${extra}`);
  if (!ok) problems++;
}

console.log(problems ? `\n${problems} problem(s)` : "\nall French checks passed");
