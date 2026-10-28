// node scripts/own-word-pictures.mjs <folder> <key> [<key> ...]
//
// Converts the site's own word pictures, <folder>/<key>.jpg (cartoon clip art
// on white, provided by the owner), into public/words/<key>.webp (480 x 480
// WebP, under 40 KB), the same files scripts/fetch-word-photos.mjs downloads
// from Pixabay. The originals are kept outside the repo (the owner's copy is
// C:\alphabes-originals\words-src), never in public/. Only the keys named are
// converted, so newer WebPs added by hand are not replaced. Each gets an
// `own: true` credit in public/words/credits.json, so the Pixabay script never
// replaces it. Then run `node scripts/fetch-word-photos.mjs --review` to
// update lib/word-photos.ts.
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { basename, join } from "node:path";
import sharp from "sharp";

const [SRC, ...keys] = process.argv.slice(2);
if (!SRC || keys.length === 0) throw new Error("usage: node scripts/own-word-pictures.mjs <folder> <key> [<key> ...]");
const OUT = join(process.cwd(), "public", "words");
const CREDITS_FILE = join(OUT, "credits.json");
const SIZE = 480;
const MAX_BYTES = 40 * 1024;

const credits = existsSync(CREDITS_FILE) ? JSON.parse(readFileSync(CREDITS_FILE, "utf8")) : [];

for (const key of keys) {
  const file = `${key}.jpg`;
  if (!existsSync(join(SRC, file))) throw new Error(`${join(SRC, file)} not found`);
  let quality = 80;
  let webp;
  for (;;) {
    webp = await sharp(join(SRC, file))
      .flatten({ background: "#ffffff" })
      .resize(SIZE, SIZE, { fit: "contain", background: "#ffffff" })
      .webp({ quality, effort: 6 })
      .toBuffer();
    if (webp.length <= MAX_BYTES || quality <= 50) break;
    quality -= 5;
  }
  if (webp.length > MAX_BYTES) throw new Error(`${key}: still ${Math.round(webp.length / 1024)} KB at quality 50`);
  writeFileSync(join(OUT, `${key}.webp`), webp);

  const entry = { word: key, source: `alphabes-originals/${basename(SRC)}/${file}`, photographer: "AlphaBes", license: "Provided by the site owner", own: true };
  const i = credits.findIndex((c) => c.word === key);
  if (i >= 0) credits[i] = entry;
  else credits.push(entry);
  console.log(`${key}: quality ${quality}, ${Math.round(webp.length / 1024)} KB`);
}

credits.sort((a, b) => a.word.localeCompare(b.word));
writeFileSync(CREDITS_FILE, JSON.stringify(credits, null, 2) + "\n");
