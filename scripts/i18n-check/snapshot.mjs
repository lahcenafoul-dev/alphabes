// Usage: node snapshot.mjs <outDir> [baseUrl] [--langs=en,fr]
// Fetches every URL in sitemap.xml (rewritten to baseUrl) plus extras, and
// writes, per route: a normalized "SEO + text" digest, and full HTML.
// --langs picks the languages to snapshot (default: English and French, the
// languages whose pages must not change when another language is added).
import { mkdirSync, writeFileSync } from "fs";
import { join } from "path";

const args = process.argv.slice(2).filter((a) => !a.startsWith("--"));
const outDir = args[0];
const base = args[1] ?? "http://localhost:3100";
const langs = (process.argv.find((a) => a.startsWith("--langs="))?.slice(8) ?? "en,fr").split(",");
const langOf = (p) => p.match(/^\/(fr|es)(\/|$)/)?.[1] ?? "en";
mkdirSync(join(outDir, "digest"), { recursive: true });
mkdirSync(join(outDir, "html"), { recursive: true });

const sm = await (await fetch(`${base}/sitemap.xml`)).text();
writeFileSync(join(outDir, "sitemap.xml"), sm);
const robots = await (await fetch(`${base}/robots.txt`)).text();
writeFileSync(join(outDir, "robots.txt"), robots);

const paths = new Set(
  [...sm.matchAll(/<loc>https:\/\/alphabes\.com([^<]*)<\/loc>/g)]
    .map((m) => m[1] || "/")
    .filter((p) => langs.includes(langOf(p))),
);
// Pages missing from the sitemap: private pages, 404s, a sample story, and
// the English game pages (only the French ones are in the sitemap).
const EXTRAS = {
  en: [
    "/dashboard", "/does-not-exist", "/stories/the-little-apple", "/alphabet/a/worksheet",
    ...["find-the-letter", "match-letter-picture", "beginning-sound", "letter-tracing", "alphabet-quiz"].map((g) => `/games/${g}`),
  ],
  fr: [
    "/fr/tableau-de-bord", "/fr/does-not-exist", "/fr/histoires/la-petite-pomme", "/fr/alphabet/a/fiche",
    ...["trouve-la-lettre", "lettre-et-image", "premier-son", "trace-la-lettre", "quiz-alphabet"].map((g) => `/fr/jeux/${g}`),
  ],
  es: [],
};
langs.forEach((l) => EXTRAS[l]?.forEach((p) => paths.add(p)));

const decode = (s) =>
  s.replace(/&amp;/g, "&").replace(/&#x27;|&#39;/g, "'").replace(/&quot;/g, '"').replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&nbsp;/g, " ");

function digest(html, status, location) {
  const head = html.split("</head>")[0] ?? "";
  const lines = [`status: ${status}`];
  if (location) lines.push(`location: ${location}`);
  const htmlTag = html.match(/<html[^>]*>/)?.[0]?.replace(/ class="[^"]*"/, "");
  lines.push(`html: ${htmlTag}`);
  lines.push(`title: ${decode(head.match(/<title>([^<]*)<\/title>/)?.[1] ?? "")}`);
  for (const m of head.matchAll(/<meta [^>]*>/g)) {
    if (/charSet|viewport|next-size-adjust/.test(m[0])) continue;
    lines.push(decode(m[0]));
  }
  for (const m of head.matchAll(/<link [^>]*rel="(canonical|alternate)"[^>]*>/g)) lines.push(decode(m[0]));
  for (const m of html.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)) lines.push(`ld+json: ${m[1]}`);
  // Visible body text (scripts/styles stripped), one block per line.
  const body = (html.split("<body")[1] ?? "")
    .replace(/<header data-site-header[\s\S]*?<\/header>/, "")
    .replace(/<script[\s\S]*?<\/script>/g, "")
    .replace(/<style[\s\S]*?<\/style>/g, "")
    .replace(/<template[\s\S]*?<\/template>/g, "");
  lines.push("--- links");
  for (const m of body.matchAll(/<a [^>]*href="([^"]*)"/g)) lines.push(`a ${decode(m[1])}`);
  lines.push("--- text");
  const text = decode(body.replace(/<(br|\/p|\/h\d|\/li|\/div|\/section|\/header|\/footer|\/nav|\/a|\/button|\/td|\/th)[^>]*>/g, "\n").replace(/<[^>]+>/g, " "))
    .split("\n")
    .map((l) => l.replace(/\s+/g, " ").trim())
    .filter(Boolean);
  lines.push(...text);
  return lines.join("\n") + "\n";
}

const fname = (p) => (p === "/" ? "_root" : p.slice(1).replace(/\//g, "__"));
let n = 0;
for (const p of [...paths].sort()) {
  const res = await fetch(base + p, { redirect: "manual" });
  const html = await res.text();
  writeFileSync(join(outDir, "html", fname(p) + ".html"), html);
  writeFileSync(join(outDir, "digest", fname(p) + ".txt"), digest(html, res.status, res.headers.get("location")));
  n++;
}
console.log(`snapshotted ${n} routes into ${outDir}`);
