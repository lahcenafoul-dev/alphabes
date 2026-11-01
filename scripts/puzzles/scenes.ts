// npx tsx scripts/puzzles/scenes.ts [id…]
//
// Draws the sliding puzzles' pictures (lib/puzzles.ts): a background (sky,
// hills…) and our own drawings (data/worksheets/drawings.ts), in colour,
// written to public/puzzles/<id>.webp (960 px square). Commit the files:
// the game serves them as static images.
import { mkdirSync } from "fs";
import { join } from "path";
import sharp from "sharp";
import { PUZZLES, type SceneBackground, type SlidingPuzzle } from "../../lib/puzzles";
import { drawingArt } from "../sheets/drawing-layout";

const SIZE = 960;
const OUT = join(process.cwd(), "public", "puzzles");

// In the scene's 200 × 200 box.
const BACKGROUNDS: Record<SceneBackground, string> = {
  garden: `<defs><linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9ED8FF"/><stop offset="1" stop-color="#E4F5FF"/></linearGradient></defs>
    <rect width="200" height="200" fill="url(#sky)"/>
    <ellipse cx="105" cy="16" rx="16" ry="6" fill="#fff"/><ellipse cx="96" cy="13" rx="9" ry="6" fill="#fff"/>
    <ellipse cx="40" cy="70" rx="14" ry="5" fill="#fff" opacity="0.9"/>
    <path d="M0 128 Q50 104 100 122 T200 116 V200 H0 Z" fill="#8FD694"/>
    <path d="M0 152 Q60 136 120 150 T200 146 V200 H0 Z" fill="#6CC47A"/>
    <path d="M104 200 Q108 170 112 136 L120 136 Q124 170 136 200 Z" fill="#F3D9A4"/>`,
  sea: `<rect width="200" height="200" fill="#9ED8FF"/><path d="M0 110 H200 V200 H0 Z" fill="#3EA6FF"/>`,
  night: `<rect width="200" height="200" fill="#2B2A6B"/>`,
  snow: `<rect width="200" height="200" fill="#DDEEFF"/><path d="M0 130 Q100 110 200 130 V200 H0 Z" fill="#fff"/>`,
};

function sceneSvg(p: SlidingPuzzle): string {
  const items = p.items.map((it, i) => drawingArt(it.drawing, { x0: it.x, y0: it.y, x1: it.x + it.w, y1: it.y + it.h }, `${p.id}-${i}`, "paint"));
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${SIZE}" height="${SIZE}" viewBox="0 0 200 200">${BACKGROUNDS[p.background]}${items.join("")}</svg>`;
}

async function main() {
  const ids = process.argv.slice(2);
  const list = PUZZLES.filter((p) => !ids.length || ids.includes(p.id));
  mkdirSync(OUT, { recursive: true });
  for (const p of list) {
    const file = join(OUT, `${p.id}.webp`);
    await sharp(Buffer.from(sceneSvg(p))).webp({ quality: 82 }).toFile(file);
    console.log(`  ${file}`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
