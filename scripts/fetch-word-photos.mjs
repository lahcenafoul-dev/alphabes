// node scripts/fetch-word-photos.mjs [options]
//
// Downloads one Pixabay photo per word picture into public/words/<key>.webp
// (480 x 480 WebP, under 40 KB), which components/WordIllustration.tsx shows
// instead of the drawing. Runs locally only, never in the build. Writes:
//   public/words/<key>.webp
//   public/words/credits.json   source, photographer and licence per photo
//   lib/word-photos.ts          the keys that have a photo (for the site)
//   scripts/review.html         every photo with its word, to check by eye
//                               (not committed)
//
// Needs PIXABAY_API_KEY in .env.local (never committed or printed). Words
// already downloaded are skipped. Settings are in
// scripts/word-photos.config.json.
//
// Options:
//   --only=apple,bat     fetch only these keys
//   --redo=apple,bat     reject the current photo of these keys and fetch
//                        the next best one
//   --pick=apple:123456  use this Pixabay image id (the number at the end
//                        of its pixabay.com URL)
//   --review             only rebuild review.html and lib/word-photos.ts
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import sharp from "sharp";

const ROOT = process.cwd();
const OUT = join(ROOT, "public", "words");
const CONFIG_FILE = join(ROOT, "scripts", "word-photos.config.json");
const CREDITS_FILE = join(OUT, "credits.json");
const MANIFEST_FILE = join(ROOT, "lib", "word-photos.ts");
const REVIEW_FILE = join(ROOT, "scripts", "review.html");

const SIZE = 480;
const MAX_BYTES = 40 * 1024;
const DELAY_MS = 800; // Pixabay allows 100 requests a minute
const LICENSE = "Pixabay Content License";
const LICENSE_URL = "https://pixabay.com/service/license-summary/";
const PEOPLE_TAGS = /\b(people|person|man|men|woman|women|girl|boy|child|children|kid|kids|baby|lady|guy|human|portrait|model|face|hand|hands|selfie|family|couple)\b/;
const AI_TAGS = /\b(ai[- ]generated|generated|ai art|midjourney|stable diffusion)\b/;
const ISOLATED_TAGS = /\b(isolated|white background|cut ?out|cutout|png|transparent|studio)\b/;

const args = Object.fromEntries(
  process.argv.slice(2).map((a) => {
    const [k, v = "true"] = a.replace(/^--/, "").split("=");
    return [k, v];
  }),
);
const list = (v) => (v && v !== "true" ? v.split(",").map((s) => s.trim()).filter(Boolean) : []);

const config = JSON.parse(readFileSync(CONFIG_FILE, "utf8"));
const credits = existsSync(CREDITS_FILE) ? JSON.parse(readFileSync(CREDITS_FILE, "utf8")) : [];
const creditOf = (key) => credits.find((c) => c.word === key);
const saveConfig = () => writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2) + "\n");
const saveCredits = () => {
  credits.sort((a, b) => a.word.localeCompare(b.word));
  writeFileSync(CREDITS_FILE, JSON.stringify(credits, null, 2) + "\n");
};
const photoFile = (key) => join(OUT, `${key}.webp`);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function apiKey() {
  const file = join(ROOT, ".env.local");
  const line = existsSync(file) && readFileSync(file, "utf8").split(/\r?\n/).find((l) => /^\s*PIXABAY_API_KEY\s*=/.test(l));
  const key = line ? line.split("=").slice(1).join("=").trim().replace(/^["']|["']$/g, "") : "";
  if (!key) throw new Error("Add PIXABAY_API_KEY=... to .env.local (get one at https://pixabay.com/api/docs/)");
  const ignored = readFileSync(join(ROOT, ".gitignore"), "utf8").split(/\r?\n/).some((l) => [".env.local", ".env*", ".env*.local"].includes(l.trim()));
  if (!ignored) throw new Error(".env.local must be listed in .gitignore before it holds an API key");
  return key;
}

// Every key the site shows (scripts/word-photo-keys.ts), via tsx since the
// word data is TypeScript.
function allKeys() {
  const tsx = join(ROOT, "node_modules", "tsx", "dist", "cli.mjs");
  return JSON.parse(execFileSync(process.execPath, [tsx, join("scripts", "word-photo-keys.ts")], { encoding: "utf8" }));
}

/** Errors never include the request URL, which holds the API key. */
async function pixabay(token, params) {
  const url = new URL("https://pixabay.com/api/");
  url.search = new URLSearchParams({ key: token, image_type: "photo", safesearch: "true", per_page: "10", order: "popular", ...params }).toString();
  await sleep(DELAY_MS);
  const res = await fetch(url);
  if (res.status === 429) {
    console.log("  rate limited, waiting a minute");
    await sleep(60_000);
    return pixabay(token, params);
  }
  if (!res.ok) throw new Error(`Pixabay API answered ${res.status}`);
  return (await res.json()).hits ?? [];
}

function score(hit, word, terms, fromWhite) {
  const tags = hit.tags.toLowerCase();
  const tagList = tags.split(",").map((t) => t.trim());
  if (AI_TAGS.test(tags)) return -1;
  if (!config.people.includes(word) && PEOPLE_TAGS.test(tags)) return -1;
  if (hit.imageHeight > hit.imageWidth * 1.15) return -1; // landscape or square only
  if (Math.min(hit.imageWidth, hit.imageHeight) < SIZE) return -1;
  if ((config.rejected[word] ?? []).includes(hit.id)) return -1;
  let s = 0;
  const main = terms[terms.length - 1];
  if (tagList[0]?.includes(main)) s += 4;
  else if (tags.includes(main)) s += 2;
  else return -1; // not about the word at all
  s += terms.filter((t) => tags.includes(t)).length;
  if (ISOLATED_TAGS.test(tags)) s += 2;
  if (fromWhite) s += 1;
  s += Math.min(2, Math.log10(1 + hit.likes + hit.downloads / 50) / 2);
  return s;
}

async function bestHit(token, word) {
  const query = config.queries[word] ?? word.replace(/-/g, " ");
  const terms = query.toLowerCase().split(/\s+/);
  const seen = new Map();
  const passes = [
    { q: `${query} isolated`, colors: "white", white: true },
    { q: `${query} isolated`, white: false },
    { q: query, white: false },
  ];
  for (const p of passes) {
    const hits = await pixabay(token, { q: p.q, ...(p.colors && { colors: p.colors }) });
    for (const h of hits) {
      const s = score(h, word, terms, p.white);
      if (s > (seen.get(h.id)?.s ?? -Infinity)) seen.set(h.id, { h, s });
    }
    const top = [...seen.values()].sort((a, b) => b.s - a.s)[0];
    if (top && top.s >= 7) break; // good enough, save requests
  }
  return [...seen.values()].filter((c) => c.s >= 0).sort((a, b) => b.s - a.s)[0]?.h;
}

/** True when the picture's border is (nearly) white: an object on a plain background. */
async function onWhite(buf) {
  const { data, info } = await sharp(buf).resize(64, 64, { fit: "fill" }).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  let border = 0;
  let white = 0;
  for (let y = 0; y < info.height; y++) {
    for (let x = 0; x < info.width; x++) {
      if (x > 1 && y > 1 && x < info.width - 2 && y < info.height - 2) continue;
      border++;
      const i = (y * info.width + x) * 3;
      if (data[i] > 232 && data[i + 1] > 232 && data[i + 2] > 232) white++;
    }
  }
  return white / border > 0.85;
}

/** A square 480 px WebP under 40 KB: a white-background object is trimmed and centred, a scene is cropped to its most interesting part. */
export async function toWebp(buf) {
  let img;
  if (await onWhite(buf)) {
    const inner = Math.round(SIZE * 0.86);
    const pad = (SIZE - inner) / 2;
    const trimmed = await sharp(buf).flatten({ background: "#ffffff" }).trim({ background: "#ffffff", threshold: 24 }).toBuffer();
    img = sharp(trimmed)
      .resize(inner, inner, { fit: "contain", background: "#ffffff" })
      .extend({ top: Math.floor(pad), bottom: Math.ceil(pad), left: Math.floor(pad), right: Math.ceil(pad), background: "#ffffff" });
  } else {
    img = sharp(buf).resize(SIZE, SIZE, { fit: "cover", position: sharp.strategy.attention });
  }
  const square = await img.flatten({ background: "#ffffff" }).toBuffer();
  for (let quality = 80; ; quality -= 5) {
    const out = await sharp(square).webp({ quality, effort: 6 }).toBuffer();
    if (out.length <= MAX_BYTES || quality <= 30) return out;
  }
}

async function download(word, hit) {
  const res = await fetch(hit.largeImageURL);
  if (!res.ok) throw new Error(`image download answered ${res.status}`);
  const webp = await toWebp(Buffer.from(await res.arrayBuffer()));
  mkdirSync(OUT, { recursive: true });
  writeFileSync(photoFile(word), webp);
  const entry = {
    word,
    pixabayId: hit.id,
    source: hit.pageURL,
    photographer: hit.user,
    photographerUrl: `https://pixabay.com/users/${hit.user}-${hit.user_id}/`,
    license: LICENSE,
    licenseUrl: LICENSE_URL,
  };
  const i = credits.findIndex((c) => c.word === word);
  if (i >= 0) credits[i] = entry;
  else credits.push(entry);
  saveCredits();
  return webp.length;
}

function writeManifest(keys) {
  // Every key with a file: the site's own cartoons, which need no credit.
  const have = keys.filter((k) => existsSync(photoFile(k)));
  const body = have.map((k) => `  "${k}",`).join("\n");
  writeFileSync(
    MANIFEST_FILE,
    `// Generated by scripts/fetch-word-photos.mjs: the picture keys with a photo
// in public/words/<key>.webp. Don't edit by hand; re-run the script.
export const WORD_PHOTOS: ReadonlySet<string> = new Set([${have.length ? `\n${body}\n` : ""}]);
`,
  );
  return have;
}

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);

function writeReview(keys, have, missing) {
  const cards = have
    .map((k) => {
      const c = creditOf(k);
      const kb = Math.round(statSync(photoFile(k)).size / 1024);
      return `<label class="card"><img src="../public/words/${k}.webp?${c?.pixabayId ?? kb}" width="160" height="160" alt="">
  <span class="word"><input type="checkbox" value="${k}"> ${esc(k)}</span>
  <span class="meta">${c && !c.own ? `<a href="${esc(c.source)}" target="_blank" rel="noopener">#${c.pixabayId}</a> · ${esc(c.photographer)}` : "own picture"} · ${kb} KB</span></label>`;
    })
    .join("\n");
  const skipped = config.skip.filter((k) => keys.includes(k));
  writeFileSync(
    REVIEW_FILE,
    `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Word photos review</title><style>
body { font: 14px system-ui, sans-serif; margin: 16px; color: #1f2a44 }
.grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(176px, 1fr)); gap: 12px }
.card { display: flex; flex-direction: column; gap: 4px; padding: 8px; border: 1px solid #ddd; border-radius: 12px; cursor: pointer }
.card:has(input:checked) { border-color: #e11d48; background: #fff1f2 }
.card img { width: 100%; height: auto; border-radius: 10px }
.word { font-weight: 700; font-size: 15px } .meta { color: #666; font-size: 12px }
#out { position: sticky; top: 0; background: #fff; padding: 8px 0; border-bottom: 1px solid #ddd; margin-bottom: 12px; z-index: 1 }
code { background: #f3f4f6; padding: 2px 6px; border-radius: 6px; word-break: break-all }
</style></head><body>
<h1>Word photos (${have.length} of ${keys.length} words)</h1>
<div id="out">Tick the photos to replace, then run: <code id="cmd">(none ticked)</code></div>
<p><b>No photo found</b> (drawing shown): ${missing.length ? missing.map(esc).join(", ") : "none"}</p>
<p><b>Kept as drawings on purpose</b> (scripts/word-photos.config.json "skip"): ${skipped.map(esc).join(", ")}</p>
<div class="grid">
${cards}
</div>
<script>
const cmd = document.getElementById("cmd");
document.addEventListener("change", () => {
  const keys = [...document.querySelectorAll("input:checked")].map((i) => i.value);
  cmd.textContent = keys.length ? "node scripts/fetch-word-photos.mjs --redo=" + keys.join(",") : "(none ticked)";
});
</script>
</body></html>
`,
  );
}

async function main() {
  const keys = allKeys();
  const only = list(args.only);
  const redo = list(args.redo);
  const picks = list(args.pick).map((p) => p.split(":"));
  for (const k of [...only, ...redo, ...picks.map(([k]) => k)]) {
    if (!keys.includes(k)) throw new Error(`"${k}" is not a word picture key`);
    if (creditOf(k)?.own) throw new Error(`"${k}" is the site's own picture: replace public/words-src/${k}.jpg and run scripts/own-word-pictures.mjs`);
  }

  for (const k of redo) {
    const c = creditOf(k);
    if (c) (config.rejected[k] ??= []).includes(c.pixabayId) || config.rejected[k].push(c.pixabayId);
    delete config.picks[k];
    rmSync(photoFile(k), { force: true });
  }
  for (const [k, id] of picks) {
    config.picks[k] = Number(id);
    rmSync(photoFile(k), { force: true });
  }
  if (redo.length || picks.length) saveConfig();

  const missing = [];
  if (!args.review) {
    // The site shows only its own cartoon pictures (scripts/own-word-pictures.mjs); the photos were moved to public/words-old/.
    throw new Error("Pixabay photos are no longer shown on the site. Only --review (rebuild lib/word-photos.ts) is supported.");
  }
  if (!args.review) {
    const token = apiKey();
    const todo = (only.length ? only : redo.length || picks.length ? [...redo, ...picks.map(([k]) => k)] : keys).filter(
      (k) => !config.skip.includes(k) || config.picks[k],
    );
    let done = 0;
    for (const word of todo) {
      if (existsSync(photoFile(word)) && creditOf(word)) continue;
      try {
        const hit = config.picks[word] ? (await pixabay(token, { id: String(config.picks[word]) }))[0] : await bestHit(token, word);
        if (!hit) {
          missing.push(word);
          console.log(`${word}: no good photo`);
          continue;
        }
        const bytes = await download(word, hit);
        done++;
        console.log(`${word}: #${hit.id} by ${hit.user}, ${Math.round(bytes / 1024)} KB`);
      } catch (e) {
        missing.push(word);
        console.log(`${word}: failed (${e.message})`);
      }
    }
    console.log(`\n${done} downloaded.`);
  }

  // Credits for photos that were deleted by hand go too.
  // Own pictures (scripts/own-word-pictures.mjs) keep their credit while their file exists, even when no word uses them yet.
  for (const c of [...credits]) if (!existsSync(photoFile(c.word)) || (!keys.includes(c.word) && !c.own)) credits.splice(credits.indexOf(c), 1);
  if (existsSync(OUT)) {
    saveCredits();
  }
  const have = writeManifest(keys);
  const noPhoto = keys.filter((k) => !have.includes(k) && !config.skip.includes(k));
  writeReview(keys, have, noPhoto);
  const total = have.reduce((n, k) => n + statSync(photoFile(k)).size, 0);
  console.log(`${have.length} of ${keys.length} words have a photo (${Math.round(total / 1024)} KB in all).`);
  if (noPhoto.length) console.log(`No photo yet: ${noPhoto.join(", ")}`);
  console.log(`Review them in scripts/review.html`);
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((e) => {
    console.error(e.message);
    process.exit(1);
  });
}
