// The origami sheets (data/worksheets/origami.ts): the model's numbered steps
// in a grid of three columns (two or three rows), each a drawing of the paper as it is before that fold
// (lib/sheets/origami.ts) with the fold line dashed and an arrow showing where
// the paper goes, and one short sentence; the last cell is the finished model
// with its face. A legend at the bottom explains the marks.
import { getModel, type FaceMark, type OrigamiModel, type OrigamiSheet } from "../../data/worksheets/origami";
import {
  area,
  centroid,
  diamond,
  fold,
  hull,
  lineThrough,
  movingParts,
  reflect,
  turnOver,
  type Fold,
  type Paper,
  type Pt,
} from "../../lib/sheets/origami";
import type { L10n, SheetLocale } from "../../lib/sheets/types";
import { esc, INK, PURPLE, typo } from "./chrome";

type Box = { w: number; h: number };

const r2 = (n: number) => Math.round(n * 100) / 100;

const ARROW = "#FF4F8B";
const GAP = 4;
const LEGEND = 12;
/** Paper units shown across a step's drawing. */
const SPAN = 2.5;
/** Shortest fold arrow, in mm. */
const MIN_ARROW = 11;

export const ORIGAMI_CSS = `
.og { display: grid; grid-template-columns: repeat(3, 1fr); gap: ${GAP}mm }
.og-cell { display: flex; flex-direction: column; align-items: center; border: 0.4mm solid #E4DEFF; border-radius: 4mm; padding: 1mm 2mm 2mm }
.og-cell p { margin: 0.5mm 0 0; font-size: 4mm; line-height: 1.22; text-align: center; font-weight: 700 }
.og-cell.done { background: #FFF8E6; border-color: #FFD98A }
.og-key { display: flex; flex-wrap: wrap; justify-content: center; align-items: center; gap: 1.5mm 6mm; margin-top: ${GAP}mm; height: ${LEGEND - GAP}mm; font-size: 3.6mm; color: #565177 }
.og-key span { display: flex; align-items: center; gap: 1.6mm }
`;

/** The paper before each step, and after the last one. */
export function origamiStates(m: OrigamiModel): { before: Paper; fold: Fold; turn: boolean }[] & { done?: Paper } {
  let paper = diamond();
  const out: { before: Paper; fold: Fold; turn: boolean }[] & { done?: Paper } = [];
  for (const s of m.steps) {
    if (s.turn) paper = turnOver(paper);
    out.push({ before: paper, fold: s.fold, turn: !!s.turn });
    paper = fold(paper, s.fold);
  }
  out.done = paper;
  return out;
}

type View = { s: number; cx: number; cy: number; X: (x: number) => number; Y: (y: number) => number; P: (p: Pt) => string };

/** Scale (mm per unit) and centre: the paper and where its moving part lands. */
function view(points: Pt[], s: number, size: number): View {
  const xs = points.map((p) => p.x);
  const ys = points.map((p) => p.y);
  const mx = (Math.min(...xs) + Math.max(...xs)) / 2;
  const my = (Math.min(...ys) + Math.max(...ys)) / 2;
  const X = (x: number) => r2(size / 2 + (x - mx) * s);
  const Y = (y: number) => r2(size / 2 - (y - my) * s);
  return { s, cx: X(0), cy: Y(0), X, Y, P: (p) => `${X(p.x)} ${Y(p.y)}` };
}

function paperSvg(paper: Paper, v: View, colour: string): string {
  return paper
    .map((piece) => {
      const fill = piece.face === "colour" ? colour : "#fff";
      const poly = `<path d="M${piece.pts.map(v.P).join("L")}Z" fill="${fill}" stroke="${INK}" stroke-width="0.4" stroke-linejoin="round"/>`;
      const creases = piece.creases.map(([a, b]) => `<path d="M${v.P(a)}L${v.P(b)}" stroke="${INK}" stroke-width="0.25" opacity="0.45"/>`).join("");
      return poly + creases;
    })
    .join("");
}

function head(tip: Pt, from: Pt, filled: boolean): string {
  const dx = tip.x - from.x;
  const dy = tip.y - from.y;
  const l = Math.hypot(dx, dy) || 1;
  const ux = dx / l;
  const uy = dy / l;
  const L = 2.8;
  const W = 1.5;
  const a = `${r2(tip.x - ux * L - uy * W)} ${r2(tip.y - uy * L + ux * W)}`;
  const b = `${r2(tip.x - ux * L + uy * W)} ${r2(tip.y - uy * L - ux * W)}`;
  return `<path d="M${a}L${r2(tip.x)} ${r2(tip.y)}L${b}${filled ? "Z" : ""}" fill="${filled ? ARROW : "none"}" stroke="${ARROW}" stroke-width="0.6" stroke-linejoin="round" stroke-linecap="round"/>`;
}

/** The fold line, and a curved arrow from the moving part to where it lands (mm). */
function foldMarks(paper: Paper, f: Fold, v: View): string {
  const sel = f.layers === "top" ? movingParts(paper, f) : paper.map((p) => p.pts);
  const across = lineThrough(hull(sel.flat()), f.line) ?? f.line;
  const [a, b] = across;
  const len = Math.hypot(b.x - a.x, b.y - a.y);
  const ext = 0.12 / len;
  const a2 = { x: a.x - (b.x - a.x) * ext, y: a.y - (b.y - a.y) * ext };
  const b2 = { x: b.x + (b.x - a.x) * ext, y: b.y + (b.y - a.y) * ext };
  const dash = f.behind ? "2.2 0.9 0.4 0.9" : "1.7 1.1";
  const line = `<path d="M${v.P(a2)}L${v.P(b2)}" stroke="${INK}" stroke-width="0.5" stroke-dasharray="${dash}"/>`;

  // The arrow: from inside the moving part (towards its corner) to its mirror image.
  const parts = movingParts(paper, f).sort((p, q) => area(q) - area(p));
  const c = centroid(parts[0]);
  const start0 = { x: c.x + (f.from.x - c.x) * 0.35, y: c.y + (f.from.y - c.y) * 0.35 };
  const end0 = reflect(start0, f.line);
  let s = { x: v.X(start0.x), y: v.Y(start0.y) };
  let e = { x: v.X(end0.x), y: v.Y(end0.y) };
  // Small flaps still get an arrow long enough to see.
  const d = Math.hypot(e.x - s.x, e.y - s.y);
  if (d < MIN_ARROW) {
    const k = MIN_ARROW / d;
    const m = { x: (s.x + e.x) / 2, y: (s.y + e.y) / 2 };
    s = { x: m.x + (s.x - m.x) * k, y: m.y + (s.y - m.y) * k };
    e = { x: m.x + (e.x - m.x) * k, y: m.y + (e.y - m.y) * k };
  }
  // Bulge away from the middle of the paper.
  const mid = { x: (s.x + e.x) / 2, y: (s.y + e.y) / 2 };
  const n = { x: -(e.y - s.y) * 0.32, y: (e.x - s.x) * 0.32 };
  const centre = centroid(hull(paper.flatMap((p) => p.pts)));
  const cm = { x: v.X(centre.x), y: v.Y(centre.y) };
  const away = (mid.x + n.x - cm.x) ** 2 + (mid.y + n.y - cm.y) ** 2 >= (mid.x - n.x - cm.x) ** 2 + (mid.y - n.y - cm.y) ** 2;
  const k = { x: r2(mid.x + (away ? n.x : -n.x)), y: r2(mid.y + (away ? n.y : -n.y)) };
  // Stop short of the ends so the heads don't cover the paper's corner.
  const arc = `<path d="M${r2(s.x)} ${r2(s.y)}Q${k.x} ${k.y} ${r2(e.x)} ${r2(e.y)}" fill="none" stroke="${ARROW}" stroke-width="0.6"${f.behind ? ` stroke-dasharray="1.4 0.9"` : ""}/>`;
  const heads = head(e, k, !f.behind) + (f.unfold ? head(s, k, true) : "");
  return line + arc + heads;
}

/** Turn-over sign: a circular arrow. */
function turnSvg(x: number, y: number): string {
  const r = 3.6;
  const p = (deg: number) => `${r2(x + r * Math.cos((deg * Math.PI) / 180))} ${r2(y + r * Math.sin((deg * Math.PI) / 180))}`;
  return `<g><path d="M${p(200)}A${r} ${r} 0 1 1 ${p(150)}" fill="none" stroke="${PURPLE}" stroke-width="0.8" stroke-linecap="round"/><path d="M${p(150)}l-1.9 -1.6M${p(150)}l2.3 -0.6" stroke="${PURPLE}" stroke-width="0.8" stroke-linecap="round"/></g>`;
}

function badge(n: number): string {
  return `<circle cx="4.6" cy="4.6" r="4" fill="${PURPLE}"/><text x="4.6" y="6.15" text-anchor="middle" font-family="display" font-weight="800" font-size="4.6" fill="#fff">${n}</text>`;
}

function faceSvg(marks: FaceMark[], v: View): string {
  return marks
    .map((m) => {
      if ("eye" in m) {
        const [x, y] = m.eye;
        const r = r2(m.r * v.s);
        return `<circle cx="${v.X(x)}" cy="${v.Y(y)}" r="${r}" fill="${INK}"/><circle cx="${r2(v.X(x) + r * 0.35)}" cy="${r2(v.Y(y) - r * 0.35)}" r="${r2(r * 0.32)}" fill="#fff"/>`;
      }
      if ("nose" in m) {
        const [x, y] = m.nose;
        return `<ellipse cx="${v.X(x)}" cy="${v.Y(y)}" rx="${r2(m.rx * v.s)}" ry="${r2(m.ry * v.s)}" fill="${INK}"/>`;
      }
      // Path data in paper units: drawn in a flipped, scaled group.
      return `<g transform="translate(${v.cx} ${v.cy}) scale(${v.s} ${-v.s})"><path d="${m.line}" fill="${m.fill ?? "none"}" stroke="${INK}" stroke-width="${r2(0.6 / v.s)}" stroke-linecap="round" stroke-linejoin="round"/></g>`;
    })
    .join("");
}

const LEGEND_TEXT: Record<"colour" | "white" | "fold" | "behind" | "turn", L10n> = {
  colour: { en: "colored side", fr: "côté coloré", es: "lado de color", pt: "lado colorido" },
  white: { en: "white side", fr: "côté blanc", es: "lado blanco", pt: "lado branco" },
  fold: { en: "fold towards you", fr: "plier vers soi", es: "doblar hacia ti", pt: "dobrar para a frente" },
  behind: { en: "fold behind", fr: "plier derrière", es: "doblar hacia atrás", pt: "dobrar para trás" },
  turn: { en: "turn over", fr: "retourner", es: "dar la vuelta", pt: "virar" },
};

function legend(m: OrigamiModel, locale: SheetLocale): string {
  const sw = (fill: string) => `<svg width="5mm" height="5mm" viewBox="0 0 5 5"><rect x="0.3" y="0.3" width="4.4" height="4.4" fill="${fill}" stroke="${INK}" stroke-width="0.4"/></svg>`;
  const line = (dash: string) => `<svg width="11mm" height="4mm" viewBox="0 0 11 4"><path d="M0.5 2H6.5" stroke="${INK}" stroke-width="0.5" stroke-dasharray="${dash}"/><path d="M7 3.2Q8.6 0.2 10.4 2" fill="none" stroke="${ARROW}" stroke-width="0.6"/></svg>`;
  const items = [
    `${sw(m.colour)}${LEGEND_TEXT.colour[locale]}`,
    `${sw("#fff")}${LEGEND_TEXT.white[locale]}`,
    `${line("1.7 1.1")}${LEGEND_TEXT.fold[locale]}`,
  ];
  if (m.steps.some((s) => s.fold.behind)) items.push(`${line("2.2 0.9 0.4 0.9")}${LEGEND_TEXT.behind[locale]}`);
  if (m.steps.some((s) => s.turn)) items.push(`<svg width="6mm" height="6mm" viewBox="0 0 9 9">${turnSvg(4.5, 4.5)}</svg>${LEGEND_TEXT.turn[locale]}`);
  return `<div class="og-key">${items.map((i) => `<span>${i}</span>`).join("")}</div>`;
}

export function origamiBody(sheet: OrigamiSheet, locale: SheetLocale, box: Box): string {
  const m = getModel(sheet.params.model);
  const states = origamiStates(m);
  const cellW = (box.w - 2 * GAP) / 3;
  // Two rows of three, or three rows for models of 7 to 9 steps.
  const rows = Math.ceil((states.length + 1) / 3);
  const cellH = (box.h - LEGEND - (rows - 1) * GAP) / rows;
  // The cell's padding and border take 4.8 mm of its width.
  const size = Math.min(cellW - 5, cellH - (rows > 2 ? 15 : 23));
  const s = size / SPAN;

  const cells = states.map(({ before, fold: f, turn }, i) => {
    const landed = movingParts(before, f).flatMap((pts) => pts.map((p) => reflect(p, f.line)));
    const v = view([...before.flatMap((p) => p.pts), ...landed], s, size);
    const svg = `<svg width="${r2(size)}mm" height="${r2(size)}mm" viewBox="0 0 ${r2(size)} ${r2(size)}" aria-hidden="true">${paperSvg(before, v, m.colour)}${foldMarks(before, f, v)}${turn ? turnSvg(size - 5, 5) : ""}${badge(i + 1)}</svg>`;
    return `<div class="og-cell" style="height:${r2(cellH)}mm">${svg}<p>${esc(typo(m.steps[i].text[locale], locale))}</p></div>`;
  });
  const done = states.done!;
  // The finished model, as big as the cell allows (at most 1.6 times the steps' scale).
  const pts = done.flatMap((p) => p.pts);
  const extent = Math.max(Math.max(...pts.map((p) => p.x)) - Math.min(...pts.map((p) => p.x)), Math.max(...pts.map((p) => p.y)) - Math.min(...pts.map((p) => p.y)));
  const v = view(pts, Math.min(s * 1.6, (size * 0.78) / extent), size);
  const finished = `<svg width="${r2(size)}mm" height="${r2(size)}mm" viewBox="0 0 ${r2(size)} ${r2(size)}" aria-hidden="true">${paperSvg(done, v, m.colour)}${faceSvg(m.face, v)}${badge(states.length + 1)}</svg>`;
  cells.push(`<div class="og-cell done" style="height:${r2(cellH)}mm">${finished}<p>${esc(typo(m.done[locale], locale))}</p></div>`);
  return `<div style="width:${box.w}mm"><div class="og">${cells.join("")}</div>${legend(m, locale)}</div>`;
}
