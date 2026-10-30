// The stickers of a sticker sheet (data/worksheets/stickers.ts): a grid of
// rounded stickers, each inside a dashed cut line, on white (the cartoons
// have white backgrounds, and white saves ink). A coloured ring frames each
// sticker. Letters show the letter pair and a word's cartoon in the sheet's
// language; numbers show dots in ten-frames; rewards show their words.
import type { Sticker, StickersSheet } from "../../data/worksheets/stickers";
import { SHAPE_NAMES } from "../../data/worksheets/vocab";
import type { SheetLocale } from "../../lib/sheets/types";
import { picturePrint } from "../picture-emoji";
import { BRIGHT, INK, esc, typo } from "./chrome";
import { scissorsSvg, shapeSvg } from "./shapes";

type Box = { w: number; h: number };

const r1 = (n: number) => Math.round(n * 10) / 10;

export const STICKERS_CSS = `
.st-grid { display: grid; position: relative }
.st-cut { border: 0.45mm dashed #8f89b3; border-radius: 7mm; padding: 2.2mm; display: flex }
.st-face { flex: 1; border-radius: 5mm; border: 1.3mm solid; background: #fff; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 1mm; overflow: hidden; text-align: center }
.st-letters { font-family: display; font-weight: 800; line-height: 0.9; padding-top: 0.08em }
.st-num { font-family: display; font-weight: 800; line-height: 0.9; padding-top: 0.08em }
.st-frames { display: flex; gap: 1.2mm }
.st-frame { display: grid; grid-template-columns: repeat(5, 1fr); border: 0.35mm solid ${INK}; border-radius: 0.8mm; overflow: hidden }
.st-frame span { border-right: 0.25mm solid #9a95b8; border-bottom: 0.25mm solid #9a95b8; display: flex; align-items: center; justify-content: center }
.st-frame span:nth-child(5n) { border-right: 0 }
.st-frame span:nth-child(n+6) { border-bottom: 0 }
.st-frame i { display: block; border-radius: 50% }
.st-name { font-family: display; font-weight: 700; line-height: 1 }
.st-reward { font-family: display; font-weight: 800; line-height: 1.02; padding: 0 1.5mm }
.st-scissors { position: absolute; top: -5.2mm; left: -1mm }
`;

const pic = (key: string, size: number) => `<div style="font-size:${r1(size)}mm;line-height:0">${picturePrint(key)}</div>`;

/** Two rows of five boxes, the first `filled` with dots. */
function tenFrame(filled: number, cell: number, colour: string): string {
  const cells = Array.from({ length: 10 }, (_, i) => `<span style="width:${r1(cell)}mm;height:${r1(cell)}mm">${i < filled ? `<i style="width:${r1(cell * 0.62)}mm;height:${r1(cell * 0.62)}mm;background:${colour}"></i>` : ""}</span>`).join("");
  return `<div class="st-frame">${cells}</div>`;
}

/** The sticker's content; `size` is the face's shorter side and `width` its width, in mm. */
function face(s: Sticker, size: number, width: number, colour: string, locale: SheetLocale): string {
  switch (s.type) {
    case "picture":
      return pic(s.picture, size * 0.7);
    case "letter": {
      const picture = s.picture[locale];
      return `<div class="st-letters" style="font-size:${r1(size * (picture ? 0.3 : 0.48))}mm;color:${colour}">${esc(s.upper + s.lower)}</div>${picture ? pic(picture, size * 0.42) : ""}`;
    }
    case "number": {
      const frames = s.n > 10 ? [10, s.n - 10] : [s.n];
      const cell = Math.min(5.2, (width * 0.86) / (frames.length * 5 + 0.5), (size * 0.32) / 2);
      return `<div class="st-num" style="font-size:${r1(size * 0.4)}mm;color:${colour}">${s.n}</div><div class="st-frames">${frames.map((f) => tenFrame(f, cell, colour)).join("")}</div>`;
    }
    case "shape":
      return `${shapeSvg(s.shape, size * 0.5)}<div class="st-name" style="font-size:${r1(Math.min(4.6, size * 0.1))}mm">${esc(SHAPE_NAMES[s.shape][locale])}</div>`;
    case "reward": {
      const text = typo(s.text[locale], locale);
      // Two short lines at most for these sizes.
      const font = Math.min(size * 0.13, text.length <= 10 ? 6.2 : text.length <= 18 ? 5.2 : 4.4);
      return `${pic(s.picture, size * 0.46)}<div class="st-reward" style="font-size:${r1(font)}mm">${esc(text)}</div>`;
    }
  }
}

export function stickersBody(sheet: StickersSheet, locale: SheetLocale, box: Box): string {
  const { cols, rows, stickers } = sheet.params;
  const gap = 4;
  // Stickers fill the page: square when the grid allows, otherwise up to
  // 1.4 times as wide as tall.
  const h = (box.h - 6 - (rows - 1) * gap) / rows;
  const w = Math.min((box.w - (cols - 1) * gap) / cols, h * 1.4);
  const border = 2 * 2.2 + 2 * 1.3;
  const cells = stickers
    .map((s, i) => {
      const colour = BRIGHT[i % BRIGHT.length];
      return `<div class="st-cut" style="width:${r1(w)}mm;height:${r1(h)}mm"><div class="st-face" style="border-color:${colour}">${face(s, Math.min(w, h) - border, w - border, colour, locale)}</div></div>`;
    })
    .join("");
  return `<div class="st-grid" style="grid-template-columns:repeat(${cols},${r1(w)}mm);gap:${gap}mm;margin-top:6mm"><span class="st-scissors">${scissorsSvg(5)}</span>${cells}</div>`;
}
