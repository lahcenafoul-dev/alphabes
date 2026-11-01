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

/** Small round spots (stars, snowflakes, confetti, leaves). */
const dots = (at: number[][], r: number, fill: string) => at.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}"/>`).join("");

// In the scene's 200 × 200 box.
const BACKGROUNDS: Record<SceneBackground, string> = {
  garden: `<defs><linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9ED8FF"/><stop offset="1" stop-color="#E4F5FF"/></linearGradient></defs>
    <rect width="200" height="200" fill="url(#sky)"/>
    <ellipse cx="105" cy="16" rx="16" ry="6" fill="#fff"/><ellipse cx="96" cy="13" rx="9" ry="6" fill="#fff"/>
    <ellipse cx="40" cy="70" rx="14" ry="5" fill="#fff" opacity="0.9"/>
    <path d="M0 128 Q50 104 100 122 T200 116 V200 H0 Z" fill="#8FD694"/>
    <path d="M0 152 Q60 136 120 150 T200 146 V200 H0 Z" fill="#6CC47A"/>
    <path d="M104 200 Q108 170 112 136 L120 136 Q124 170 136 200 Z" fill="#F3D9A4"/>`,
  sea: `<rect width="200" height="200" fill="#AEE0FF"/><ellipse cx="150" cy="20" rx="14" ry="5" fill="#fff"/>
    <path d="M0 105 Q25 99 50 105 T100 105 T150 105 T200 105 V200 H0 Z" fill="#3EA6FF"/>
    <path d="M0 150 Q25 144 50 150 T100 150 T150 150 T200 150 V200 H0 Z" fill="#2F8FE6"/>`,
  night: `<rect width="200" height="200" fill="#2B2A6B"/>
    ${dots([[20, 30], [70, 12], [120, 40], [180, 20], [40, 90], [160, 95], [95, 70]], 1.4, "#FFF6C2")}
    <path d="M0 150 Q100 132 200 150 V200 H0 Z" fill="#3E4B8C"/>`,
  snow: `<rect width="200" height="200" fill="#CFE6FF"/>
    ${dots([[15, 20], [60, 45], [110, 15], [170, 50], [30, 100], [140, 110], [90, 120]], 1.8, "#fff")}
    <path d="M0 128 Q100 110 200 128 V200 H0 Z" fill="#fff"/>`,
  party: `<rect width="200" height="200" fill="#FFF1F6"/>
    ${dots([[12, 70], [70, 130], [130, 64], [190, 140], [100, 196], [40, 190], [170, 60]], 1.6, "#FFC94A")}
    <path d="M0 0 L20 12 L40 0 L60 12 L80 0 L100 12 L120 0 L140 12 L160 0 L180 12 L200 0 Z" fill="#FFB3CF"/>`,
  road: `<rect width="200" height="200" fill="#BFE6FF"/>
    <path d="M0 120 Q100 108 200 120 V200 H0 Z" fill="#9BDB8F"/>
    <rect y="150" width="200" height="44" fill="#8A8FA3"/>
    ${[10, 55, 100, 145, 190].map((x) => `<rect x="${x - 10}" y="171" width="20" height="2.5" fill="#fff"/>`).join("")}`,
  farm: `<rect width="200" height="200" fill="#AEE0FF"/>
    <path d="M0 110 Q100 92 200 110 V200 H0 Z" fill="#A9DC76"/>
    <path d="M0 160 H200 V200 H0 Z" fill="#C9965F"/>
    ${[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => `<rect x="${i * 25 + 2}" y="118" width="3" height="22" fill="#fff"/>`).join("")}
    <rect y="124" width="200" height="3" fill="#fff"/><rect y="133" width="200" height="3" fill="#fff"/>`,
  beach: `<rect width="200" height="200" fill="#AEE0FF"/>
    <path d="M0 70 H200 V200 H0 Z" fill="#3EA6FF"/>
    <path d="M0 140 Q100 120 200 140 V200 H0 Z" fill="#F6DE9C"/>`,
  rain: `<rect width="200" height="200" fill="#C5D3E6"/>
    <ellipse cx="40" cy="10" rx="40" ry="14" fill="#9FB0C8"/><ellipse cx="150" cy="8" rx="50" ry="14" fill="#9FB0C8"/>
    ${[[20, 40], [60, 70], [100, 30], [140, 60], [180, 35], [30, 110], [120, 100], [170, 115]].map(([x, y]) => `<path d="M${x} ${y}l-3 7" stroke="#6E8BC0" stroke-width="1.5" stroke-linecap="round"/>`).join("")}
    <path d="M0 140 Q100 128 200 140 V200 H0 Z" fill="#8CC98A"/>`,
  forest: `<rect width="200" height="200" fill="#D6F0D0"/>
    <path d="M0 70 L20 30 L40 70 L60 25 L80 70 L100 32 L120 70 L140 28 L160 70 L180 34 L200 70 V90 H0 Z" fill="#A7D99B"/>
    <path d="M0 140 Q100 126 200 140 V200 H0 Z" fill="#7CC27A"/>`,
  pond: `<rect width="200" height="200" fill="#BFE6FF"/>
    <path d="M0 90 Q100 76 200 90 V200 H0 Z" fill="#9BDB8F"/>
    <ellipse cx="100" cy="160" rx="95" ry="42" fill="#5EC0EB"/>`,
  sky: `<rect width="200" height="200" fill="#9ED8FF"/>
    <ellipse cx="35" cy="60" rx="22" ry="8" fill="#fff"/><ellipse cx="165" cy="125" rx="24" ry="8" fill="#fff"/><ellipse cx="100" cy="190" rx="30" ry="9" fill="#fff"/>`,
  autumn: `<rect width="200" height="200" fill="#FFE9C7"/>
    <path d="M0 125 Q100 108 200 125 V200 H0 Z" fill="#F2B25C"/>
    ${dots([[20, 160], [80, 185], [150, 165], [185, 190], [50, 135], [115, 140]], 2.6, "#E2663B")}`,
  rainbow: `<rect width="200" height="200" fill="#BFE6FF"/>
    ${["#FF6F6F", "#FFB020", "#FFE15A", "#7ED67A", "#5EB4FF", "#A98BFF"].map((c, i) => `<path d="M${10 + i * 7} 200 A${90 - i * 7} ${90 - i * 7} 0 0 1 ${190 - i * 7} 200" fill="none" stroke="${c}" stroke-width="7" opacity="0.55"/>`).join("")}
    <path d="M0 172 Q100 160 200 172 V200 H0 Z" fill="#9BDB8F"/>`,
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
