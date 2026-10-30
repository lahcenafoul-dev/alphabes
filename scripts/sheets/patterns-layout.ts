// The exercise of a pattern sheet (data/worksheets/patterns.ts): six rows of
// boxes holding cartoons, shapes or balloons. "Circle" sheets end each row
// with a "?" box and three choices to circle; "draw" sheets leave two or
// three boxes empty to draw in (or an uncoloured balloon to colour).
import { itemCaption, type PatternCell, type PatternItem, type PatternsSheet } from "../../data/worksheets/patterns";
import type { ColourId, ShapeId } from "../../data/worksheets/vocab";
import type { SheetLocale } from "../../lib/sheets/types";
import { picturePrint } from "../picture-emoji";
import { esc, PURPLE } from "./chrome";
import { balloonSvg, shapeSvg } from "./shapes";

type Box = { w: number; h: number };

const r1 = (n: number) => Math.round(n * 10) / 10;

export const PATTERNS_CSS = `
.pt-rows { display: flex; flex-direction: column }
.pt-row { display: flex; align-items: center; gap: var(--gap) }
.pt-cell { flex: none; border: 0.4mm solid #DCD5FA; border-radius: 2.6mm; display: flex; flex-direction: column; align-items: center; justify-content: center; background: #fff; overflow: hidden }
.pt-cell.blank { border: 0.6mm dashed ${PURPLE} }
.pt-cell.choice { border: 0.55mm solid #FFB020 }
.pt-q { font-family: display; font-weight: 800; color: #B9AEF5; line-height: 1; padding-top: 0.1em }
.pt-cap { font-size: 2.7mm; line-height: 1; color: #3d3866; margin-top: 0.6mm; white-space: nowrap }
.pt-items { display: grid; justify-content: center; align-content: center; gap: 0.6mm }
.pt-sep { flex: none; align-self: stretch; border-left: 0.45mm dashed #B9AEF5; margin: 0 1.2mm }
`;

/** One item at the given size: a cartoon, a shape or a balloon (uncoloured when `blank`). */
function itemHtml(item: PatternItem, size: number, blankBalloon = false): string {
  const [kind, id] = item.split(":");
  if (kind === "shape") return shapeSvg(id as ShapeId, size);
  if (kind === "colour") return balloonSvg(blankBalloon ? null : (id as ColourId), size);
  return `<div style="font-size:${r1(size)}mm;line-height:0">${picturePrint(id)}</div>`;
}

type Dims = { w: number; h: number; caption: boolean };

function cellHtml(cell: PatternCell, d: Dims, locale: SheetLocale, opts: { choice?: boolean; question?: boolean; colourBlank?: PatternItem } = {}): string {
  const style = `width:${r1(d.w)}mm;height:${r1(d.h)}mm`;
  if (!cell) {
    // An uncoloured balloon to colour in, an empty box to draw in, or "?".
    if (opts.colourBlank) return `<div class="pt-cell blank" style="${style}">${itemHtml(opts.colourBlank, Math.min(d.w, d.h) * 0.74, true)}</div>`;
    return `<div class="pt-cell blank" style="${style}">${opts.question ? `<span class="pt-q" style="font-size:${r1(d.h * 0.6)}mm">?</span>` : ""}</div>`;
  }
  const caption = d.caption ? itemCaption(cell.item, locale) : null;
  const room = d.h - (caption ? 4 : 0);
  let inner: string;
  if (cell.count === 1) inner = itemHtml(cell.item, Math.min(d.w * 0.8, room * 0.84));
  else {
    const cols = cell.count <= 2 && d.h <= d.w ? cell.count : cell.count <= 4 || d.h > d.w ? 2 : 3;
    const rows = Math.ceil(cell.count / cols);
    const size = Math.min((d.w - 2.5) / cols - 0.6, (room - 2.5) / rows - 0.6);
    inner = `<div class="pt-items" style="grid-template-columns:repeat(${cols},${r1(size)}mm)">${Array.from({ length: cell.count }, () => itemHtml(cell.item, size)).join("")}</div>`;
  }
  return `<div class="pt-cell${opts.choice ? " choice" : ""}" style="${style}">${inner}${caption ? `<span class="pt-cap">${esc(caption)}</span>` : ""}</div>`;
}

export function patternsBody(sheet: PatternsSheet, locale: SheetLocale, box: Box): string {
  const { rows, version, type, theme } = sheet.params;
  const caption = theme === "shapes" || theme === "colours";
  const gap = 1.8;
  const sep = 3.5;
  const n = Math.max(...rows.map((r) => r.cells.length));
  const choices = version === "circle" ? 3 : 0;
  const units = n + choices;
  const free = box.w - (units - 1) * gap - (choices ? sep + gap : 0);
  // Growing patterns: wider boxes, for up to six pictures each.
  const w = Math.min(type === "growing" ? 34 : 24, free / units);
  // Growing boxes are taller than wide (pictures in two columns, three rows).
  const h = Math.min(type === "growing" ? w * 1.2 : w + (caption ? 3.5 : 0), 27);
  const rowGap = Math.min(13, (box.h - rows.length * h) / (rows.length - 1));
  const d: Dims = { w, h, caption };
  const html = rows
    .map((row) => {
      // For colour sheets the blanks are uncoloured balloons; the right one
      // is the item the pattern puts there.
      const firstFull = row.cells.find((c) => c);
      const cells = row.cells
        .map((c) => {
          if (c) return cellHtml(c, d, locale);
          if (version === "draw" && theme === "colours" && type !== "growing") return cellHtml(null, d, locale, { colourBlank: firstFull!.item });
          return cellHtml(null, d, locale, { question: version === "circle" });
        })
        .join("");
      const options = row.choices ? `<span class="pt-sep"></span>${row.choices.map((c) => cellHtml(c, d, locale, { choice: true })).join("")}` : "";
      return `<div class="pt-row">${cells}${options}</div>`;
    })
    .join("");
  return `<div class="pt-rows" style="--gap:${gap}mm;gap:${r1(rowGap)}mm">${html}</div>`;
}
