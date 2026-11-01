// The sliding puzzles (lib/puzzles.ts) printed to cut out, for the Pro
// packs: the picture with dashed cutting lines in 3 × 3 or 4 × 4 (a small
// number in each piece, like "Show numbers" in the online game), and a
// board the same size to lay the pieces on, with the picture beside it.
import { INK, PURPLE, LILAC } from "./chrome";

type Box = { w: number; h: number };

const r1 = (n: number) => Math.round(n * 10) / 10;

/** The picture's side, mm: the same on all three pages, so the pieces fit the board. */
export function puzzleSide(box: Box): number {
  return Math.floor(Math.min(box.h - 2, box.w - 38));
}

export const PUZZLE_CSS = `
.pz-pic { position: relative }
.pz-pic img { width: 100%; height: 100%; border-radius: 1mm }
.pz-pic svg { position: absolute; inset: 0 }
.pz-board { display: flex; gap: 6mm; align-items: flex-start }
.pz-tray { border-radius: 2mm; background: ${LILAC}; box-shadow: 0 0 0 0.8mm #fff, 0 0 0 2.4mm ${PURPLE} }
.pz-side { width: 30mm; display: flex; flex-direction: column; align-items: center; gap: 2mm; font-family: display; font-weight: 700; font-size: 3.6mm; color: ${INK}; text-align: center }
.pz-side img { width: 30mm; height: 30mm; border-radius: 2mm; border: 0.4mm solid #CFC6FF }
`;

/** The picture with its cutting lines: white under dark dashes, so they show on every colour. */
export function puzzleCut(src: string, n: number, box: Box): string {
  const s = puzzleSide(box);
  const step = s / n;
  let lines = "";
  for (let i = 1; i < n; i++) {
    const at = r1(i * step);
    for (const [stroke, w, dash] of [["#fff", 1.1, ""], [INK, 0.5, `stroke-dasharray="2.2 1.6"`]] as const) {
      lines += `<path d="M${at} 0 V${s} M0 ${at} H${s}" stroke="${stroke}" stroke-width="${w}" ${dash}/>`;
    }
  }
  const badge = n === 3 ? 3.4 : 2.8;
  let numbers = "";
  for (let k = 0; k < n * n; k++) {
    const x = (k % n) * step + badge + 1.2;
    const y = Math.floor(k / n) * step + badge + 1.2;
    numbers += `<circle cx="${r1(x)}" cy="${r1(y)}" r="${badge}" fill="#fff" fill-opacity="0.92" stroke="${PURPLE}" stroke-width="0.35"/><text x="${r1(x)}" y="${r1(y + badge * 0.38)}" text-anchor="middle" font-family="display" font-weight="800" font-size="${r1(badge * 1.05)}" fill="${INK}">${k + 1}</text>`;
  }
  const frame = `<rect x="0" y="0" width="${s}" height="${s}" rx="1" fill="none" stroke="${INK}" stroke-width="0.5" stroke-dasharray="2.2 1.6"/>`;
  return `<div class="pz-pic" style="width:${s}mm;height:${s}mm"><img src="${src}" alt=""><svg width="${s}mm" height="${s}mm" viewBox="0 0 ${s} ${s}" aria-hidden="true">${lines}${numbers}${frame}</svg></div>`;
}

/** The board: an empty tray the size of the picture, and the picture small beside it. */
export function puzzleBoard(src: string, model: string, box: Box): string {
  const s = puzzleSide(box);
  return `<div class="pz-board"><div class="pz-tray" style="width:${s}mm;height:${s}mm"></div><div class="pz-side"><img src="${src}" alt=""><span>${model}</span></div></div>`;
}
