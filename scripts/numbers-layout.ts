// The number tracing sheet: the letter tracing layout (scripts/tracing-layout.ts)
// with its own hero:
//   - a box with a hand (or two) holding up N fingers, drawn in SVG;
//   - the big number as a dotted outline, with N copies of one cartoon around it;
//   - a box with the number word (THREE, TROIS, TRES, TRÊS);
// then the dotted number to trace, the word, and a row to write on one's own.
// 0 shows a fist and one empty nest; 11–20 show two full hands and "+N".
// Each language passes its own words; the shells must declare the "display"
// (Baloo 2) and "script" (Andika, with its bold) fonts, like the letter sheets.
import { esc } from "./fiches-fr/templates";
import { picturePrint } from "./picture-emoji";
import { tracingSheet, type TracingSheet } from "./tracing-layout";

const INK = "#1f2a44";

/**
 * One cartoon per number, never the same twice: the counting animals of
 * public/counting/ for 0–10 (0 is the empty nest), then cartoons from
 * public/words/ for 11–20. Keys are the file names without ".webp".
 */
export const COUNTED: Record<number, string> = {
  0: "count-0-nest",
  1: "count-1-panda",
  2: "count-2-penguin",
  3: "count-3-frog",
  4: "count-4-owl",
  5: "count-5-fox",
  6: "count-6-hedgehog",
  7: "count-7-bunny",
  8: "count-8-bee",
  9: "count-9-snail",
  10: "count-10-turtle",
  11: "butterfly",
  12: "egg",
  13: "cookie",
  14: "flower",
  15: "leaf",
  16: "candy",
  17: "bee",
  18: "heart",
  19: "carrot",
  20: "grapes",
};

export const NUMBERS_CSS = `
[data-tp] .np-hero { margin-top: 6mm; display: flex; align-items: center; justify-content: space-between; gap: 4mm }
[data-tp] .np-box { width: 40mm; height: 58mm; border: 0.5mm solid #cbd5e1; border-radius: 4mm; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 2mm; padding: 3mm 2mm; flex: none }
[data-tp] .np-box svg { display: block }
[data-tp] .np-cap { font-size: 3.8mm; color: #4b5563; text-align: center; line-height: 1.15 }
[data-tp] .np-plus { font-size: 7mm; font-weight: 800; line-height: 1 }
[data-tp] .np-word { font-weight: 800; line-height: 1; padding-top: 1mm; letter-spacing: 0.3mm }
[data-tp] .np-centre { position: relative; flex: none }
[data-tp] .np-centre svg { display: block; overflow: visible }
[data-tp] .np-item { position: absolute; display: block; line-height: 1; font-family: emoji }
[data-tp] .np-item img { display: block; vertical-align: top }
`;

// ------------------------------------------------------------------ the hand
//
// A plain outlined hand, palm towards the reader, to colour in. Fingers count
// in the usual order: index, middle, ring, little finger, then the thumb.
// Fingers drawn first, the palm on top, so its edge reads as the knuckles.

/** A rounded finger from (x, base) going up, of width w and length len, turned by deg around its base. */
function finger(x: number, base: number, w: number, len: number, deg = 0): string {
  return `<rect x="${x}" y="${base - len}" width="${w}" height="${len + 3}" rx="${w / 2}" transform="rotate(${deg} ${x + w / 2} ${base})"/>`;
}

const FINGERS = [
  { x: 10, w: 5.2, len: 16 }, // index
  { x: 15.6, w: 5.2, len: 18 }, // middle
  { x: 21.2, w: 5, len: 16.5 }, // ring
  { x: 26.6, w: 4.6, len: 13 }, // little
];

/** One hand holding up `up` fingers (0–5): raised ones behind the palm, curled ones on it. */
function hand(up: number): string {
  const raised = FINGERS.filter((_, i) => i < Math.min(up, 4)).map((f) => finger(f.x, 23, f.w, f.len));
  const curled = FINGERS.filter((_, i) => i >= Math.min(up, 4)).map((f) => `<rect x="${f.x}" y="19" width="${f.w}" height="8" rx="${f.w / 2}"/>`);
  const thumb = up >= 5 ? finger(6.5, 33, 5.2, 13, -40) : "";
  const thumbCurled = up >= 5 ? "" : `<rect x="7.5" y="28.5" width="15" height="5.4" rx="2.7"/>`;
  return `<g fill="#fff" stroke="${INK}" stroke-width="0.9" stroke-linejoin="round">
    ${raised.join("")}${thumb}
    <path d="M9 22 H32.5 V34 Q32.5 40 28.5 42 V47 H13.5 V42 Q9 40 9 34 Z"/>
    ${curled.join("")}${thumbCurled}
  </g>`;
}

/** The hands for n: one hand up to 5, then a full hand and a second one; two full hands from 10. */
export function handsSvg(n: number, heightMm: number): string {
  const counts = n <= 5 ? [n] : [5, Math.min(n, 10) - 5];
  const w = 44;
  const g = counts.map((c, i) => `<g transform="translate(${i * w} 0)">${hand(c)}</g>`).join("");
  const vw = w * counts.length;
  return `<svg viewBox="0 0 ${vw} 48" height="${heightMm}mm" width="${(heightMm * vw) / 48}mm" aria-hidden="true">${g}</svg>`;
}

// ------------------------------------------------------------------ the hero

export type NumberHero = {
  n: number;
  /** "THREE", "TROIS"… */
  word: string;
  /** The cartoon key to count (COUNTED). */
  picture: string;
  /** Captions under the hand and above the word: "3 fingers", "Number word" (11–20 show "10 + 2 = 12" instead). */
  handCaption: string;
  wordCaption: string;
};

/** Where n cartoons go around the number: evenly on an ellipse. */
function around(n: number, cx: number, cy: number, rx: number, ry: number): { x: number; y: number }[] {
  return Array.from({ length: n }, (_, i) => {
    // Symmetric about the vertical: 1 on top, 2 left and right, 3 a triangle…
    const a = (90 + (360 * (i + 0.5)) / n) * (Math.PI / 180);
    return { x: cx + rx * Math.cos(a), y: cy + ry * Math.sin(a) };
  });
}

export function numberHero(h: NumberHero): string {
  const W = 94; // the centre's size, mm
  const H = 92;
  const item = h.n > 14 ? 10 : h.n > 8 ? 12.5 : 16;
  // The small print copy: the cartoons are small, and it keeps the PDFs light.
  const pic = picturePrint(h.picture);
  // Zero: one empty nest under the number, nothing to count.
  const spots = h.n === 0 ? [{ x: W / 2, y: H - item / 2 }] : around(h.n, W / 2, H / 2 + 1, h.n > 9 ? 41 : 38, 37);
  const items = spots
    .map(({ x, y }) => `<span class="np-item" style="left:${(x - item / 2).toFixed(2)}mm;top:${(y - item / 2).toFixed(2)}mm;font-size:${item}mm">${pic}</span>`)
    .join("");
  const digits = String(h.n);
  // Andika numerals are 0.725 em tall: 70 mm gives a 51 mm number.
  const size = digits.length > 1 ? 52 : 70;
  // Baloo 2 capitals are about 0.62 em wide: the word fills the box's 34 mm at most.
  const wordSize = Math.min(9, 34 / (h.word.length * 0.62)).toFixed(1);
  const plus = h.n > 10 ? `<div class="np-plus tp-display">+ ${h.n - 10}</div>` : "";
  // Andika Bold, like the rows below: Baloo's 1 is made of overlapping
  // shapes, and its outline would show their lines inside it.
  const number = `<svg width="${W}mm" height="${H}mm" viewBox="0 0 ${W} ${H}"><text x="${W / 2}" y="${H / 2 + size * 0.36}" text-anchor="middle" font-family="script" font-weight="700" font-size="${size}" fill="none" stroke="#8c9bab" stroke-width="0.9" stroke-dasharray="2.2 1.6" stroke-linecap="round" stroke-linejoin="round">${esc(digits)}</text></svg>`;
  return `<div class="np-hero">
    <div class="np-box">${handsSvg(h.n, h.n > 5 ? 18 : 34)}${plus}<div class="np-cap">${esc(h.n > 10 ? `10 + ${h.n - 10} = ${h.n}` : h.handCaption)}</div></div>
    <div class="np-centre" style="width:${W}mm;height:${H}mm">${number}${items}</div>
    <div class="np-box"><div class="np-cap">${esc(h.wordCaption)}</div><div class="np-word tp-display" style="font-size:${wordSize}mm">${esc(h.word)}</div></div>
  </div>`;
}

export type NumberSheet = Omit<TracingSheet, "pair" | "isFor" | "word" | "letter" | "picture" | "hero"> & { hero: NumberHero };

export function numberSheet(s: NumberSheet): string {
  return tracingSheet({ ...s, pair: "", isFor: "", word: "", letter: s.badge, picture: s.hero.picture, hero: numberHero(s.hero) });
}
