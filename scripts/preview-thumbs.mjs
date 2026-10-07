// npm run previews:thumbs
// Writes a 320 px wide copy (x.320.jpg) next to every worksheet preview
// (x.jpg) in public/, for the srcset of the worksheet cards
// (components/fiches/FicheParts.tsx). Run it after regenerating previews;
// tests/seo/preview-thumbs.test.ts fails while one is missing or older.
import { readdirSync, statSync } from "fs";
import { join } from "path";
import sharp from "sharp";

const DIRS = ["public/fiches-pdf/apercus", "public/fichas-pdf/vistas-previas", "public/atividades-pdf/previas"];
const WIDTH = 320;

let written = 0;
for (const dir of DIRS) {
  for (const name of readdirSync(dir)) {
    if (!name.endsWith(".jpg") || name.endsWith(`.${WIDTH}.jpg`)) continue;
    const src = join(dir, name);
    const out = join(dir, name.replace(/\.jpg$/, `.${WIDTH}.jpg`));
    let fresh = false;
    try {
      fresh = statSync(out).mtimeMs >= statSync(src).mtimeMs;
    } catch {}
    if (fresh) continue;
    await sharp(src).resize({ width: WIDTH }).jpeg({ quality: 72, mozjpeg: true }).toFile(out);
    written++;
  }
}
console.log(`${written} thumbnail(s) written`);
