// The "how to draw" and body parts sheets (data/worksheets/how-to-draw.ts,
// body-parts.ts): drawings made of shapes listed back to front, each closed
// shape filled white (or with its colour) so it hides what is behind it.
//
// How to draw: the step pictures in a grid (3 per row, or 4 in one row), the
// lines added at each step in pink, the last picture coloured, and a big
// practice box below.
// Body parts: the drawing between columns of boxes (or rows, for a wide one). Each box in a
// column sits as close as it can to the height of its part, the boxes of a row are evenly spaced; the checks make sure no line
// crosses another line, another box, or a part of the drawing other than the
// one it starts in.
import { getHowToDraw, stepCount, type ArtShape, type DrawShape, type HowToDrawSheet } from "../../data/worksheets/how-to-draw";
import { BODY_UI, getBodySubject, type BodyLabel, type BodyPartsSheet } from "../../data/worksheets/body-parts";
import { PAINTS } from "../../data/worksheets/colouring";
import { bbox, flatten, inside, rectSegDist, segSegDist, segments, type Poly, type Pt, type Rect } from "../../lib/sheets/geometry";
import type { SheetLocale } from "../../lib/sheets/types";
import { INK, LILAC, MUTED, PURPLE, esc, typo } from "./chrome";

type Box = { w: number; h: number };

const r2 = (n: number) => Math.round(n * 100) / 100;

/** The colour of the lines each step adds; it still reads as grey in black and white. */
export const NEW_LINE = "#F0307A";

/** Problems found while drawing the sheets (printed by generate.ts). */
export const ART_PROBLEMS: string[] = [];

export const ART_CSS = `
.bp-bank { margin-top: 4mm; border: 0.5mm solid #DCD5FA; border-radius: 4mm; padding: 2.4mm 4mm 3mm; display: flex; flex-wrap: wrap; justify-content: center; align-items: center; gap: 2mm 3mm }
.bp-bank b { width: 100%; text-align: center; font-family: display; font-weight: 800; font-size: 4.2mm; color: ${PURPLE} }
.bp-bank span { font-family: display; font-weight: 700; font-size: 5.4mm; line-height: 1; padding: 1.8mm 3.4mm 1.2mm; border-radius: 99mm; background: ${LILAC} }
`;

const isClosed = (polys: Poly[]) => polys.length > 0 && polys.every((p) => p.closed);

/** Shapes in drawing units: `stroke` gives each shape's line colour; `coloured` paints them. */
function shapesSvg(shapes: ArtShape[], s: number, line: number, coloured: boolean, stroke: (i: number) => string = () => INK): string {
  const w = (mm: number) => r2(mm / s);
  return shapes
    .map((sh, i) => {
      const c = stroke(i);
      if (sh.fill === "ink") return `<path d="${sh.d}" fill="${c}"/>`;
      if (sh.fill === "white") return `<path d="${sh.d}" fill="#fff"/>`;
      const width = w(sh.width ?? line);
      if (!isClosed(flatten(sh.d))) return `<path d="${sh.d}" fill="none" stroke="${c}" stroke-width="${width}"/>`;
      const fill = coloured && sh.paint ? (sh.paint === "white" ? "#fff" : PAINTS[sh.paint].hex) : "#fff";
      return `<path d="${sh.d}" fill="${fill}" stroke="${c}" stroke-width="${width}"/>`;
    })
    .join("");
}

/** Scale and offset that fit the shapes' bounding box in a rectangle (mm), centred. */
function fit(shapes: ArtShape[], area: Rect): { s: number; tx: number; ty: number; bb: Rect } {
  const bb = bbox(shapes.flatMap((sh) => flatten(sh.d)));
  const s = Math.min((area.x1 - area.x0) / (bb.x1 - bb.x0), (area.y1 - area.y0) / (bb.y1 - bb.y0));
  return {
    s,
    tx: area.x0 + (area.x1 - area.x0 - (bb.x1 - bb.x0) * s) / 2 - bb.x0 * s,
    ty: area.y0 + (area.y1 - area.y0 - (bb.y1 - bb.y0) * s) / 2 - bb.y0 * s,
    bb,
  };
}

const group = (f: { s: number; tx: number; ty: number }, inner: string) =>
  `<g transform="translate(${r2(f.tx)} ${r2(f.ty)}) scale(${r2(f.s)})" stroke-linejoin="round" stroke-linecap="round">${inner}</g>`;

// ------------------------------------------------------------------ how to draw

const GAP = 5;
const FRAME_LINE = 0.7;
const HOW_UI: Record<SheetLocale, { turn: string }> = {
  en: { turn: "Your turn!" },
  fr: { turn: "À toi !" },
  es: { turn: "¡Te toca!" },
  pt: { turn: "Sua vez!" },
};

export type HowToDrawPlan = { frames: Rect[]; practice: Rect; problems: string[] };

export function howToDrawPlan(sheet: HowToDrawSheet, box: Box): HowToDrawPlan {
  const h = getHowToDraw(sheet.params.subject);
  const n = stepCount(h);
  const problems: string[] = [];
  if (n < 4 || n > 6) problems.push(`${sheet.id}: ${n} pictures (4 to 6)`);
  for (let k = 1; k < n; k++) if (!h.shapes.some((sh) => sh.step === k)) problems.push(`${sheet.id}: step ${k} adds nothing`);
  const cols = n === 4 ? 4 : 3;
  const rows = Math.ceil(n / cols);
  const fw = (box.w - (cols - 1) * GAP) / cols;
  const fh = cols === 4 ? 46 : 52;
  const frames: Rect[] = [];
  for (let i = 0; i < n; i++) {
    const row = Math.floor(i / cols);
    // A short last row is centred.
    const inRow = row === rows - 1 ? n - row * cols : cols;
    const x0 = (box.w - (inRow * fw + (inRow - 1) * GAP)) / 2 + (i - row * cols) * (fw + GAP);
    const y0 = row * (fh + GAP);
    frames.push({ x0, y0, x1: x0 + fw, y1: y0 + fh });
  }
  const top = rows * fh + (rows - 1) * GAP + 6;
  const practice = { x0: 0, y0: top, x1: box.w, y1: box.h };
  if (practice.y1 - practice.y0 < 60) problems.push(`${sheet.id}: practice box only ${Math.round(practice.y1 - practice.y0)} mm high`);
  return { frames, practice, problems };
}

export function howToDrawBody(sheet: HowToDrawSheet, locale: SheetLocale, box: Box): string {
  const plan = howToDrawPlan(sheet, box);
  ART_PROBLEMS.push(...plan.problems.map((x) => `${locale} ${x}`));
  const h = getHowToDraw(sheet.params.subject);
  const n = plan.frames.length;
  const frames = plan.frames
    .map((f, i) => {
      const step = i + 1;
      const last = step === n;
      const shapes: DrawShape[] = h.shapes.filter((sh) => sh.step <= step);
      // The same scale in every picture, so the drawing doesn't jump around.
      const fitted = fit(h.shapes, { x0: f.x0 + 9, y0: f.y0 + 4, x1: f.x1 - 5, y1: f.y1 - 4 });
      const art = shapesSvg(shapes, fitted.s, FRAME_LINE, last, (j) => (!last && shapes[j].step === step ? NEW_LINE : INK));
      return `<rect x="${r2(f.x0 + 0.25)}" y="${r2(f.y0 + 0.25)}" width="${r2(f.x1 - f.x0 - 0.5)}" height="${r2(f.y1 - f.y0 - 0.5)}" rx="4" fill="#fff" stroke="#CFC6FF" stroke-width="0.5"/>
        ${group(fitted, art)}
        <circle cx="${r2(f.x0 + 5.5)}" cy="${r2(f.y0 + 5.5)}" r="4" fill="${last ? "#FFC94D" : PURPLE}"/>
        <text x="${r2(f.x0 + 5.5)}" y="${r2(f.y0 + 7.3)}" font-size="5.2" text-anchor="middle" font-family="display" font-weight="800" fill="${last ? INK : "#fff"}">${step}</text>`;
    })
    .join("");
  const p = plan.practice;
  const practice = `<rect x="${r2(p.x0 + 0.3)}" y="${r2(p.y0 + 0.3)}" width="${r2(p.x1 - p.x0 - 0.6)}" height="${r2(p.y1 - p.y0 - 0.6)}" rx="5" fill="#fff" stroke="${PURPLE}" stroke-width="0.6" stroke-dasharray="2.4 1.6"/>
    <text x="${r2(p.x0 + 5)}" y="${r2(p.y0 + 8)}" font-size="5" font-family="display" font-weight="800" fill="${PURPLE}">${esc(typo(HOW_UI[locale].turn, locale))}</text>`;
  return `<svg width="${box.w}mm" height="${box.h}mm" viewBox="0 0 ${box.w} ${box.h}" aria-hidden="true">${frames}${practice}</svg>`;
}

// ------------------------------------------------------------------ body parts

const BOX_W = 40;
const BOX_H = 11;
const PITCH = BOX_H + 4;
const BANK_H = 30;
const BODY_LINE = 0.8;
/** How close a line may come to a part it doesn't start in, and to other lines and boxes, mm. */
const CLEAR = 1;

export type BodyBox = { rect: Rect; label: BodyLabel; /** The word printed in it (match version), else null. */ word: BodyLabel | null };

export type BodyPlan = {
  fitted: { s: number; tx: number; ty: number };
  /** Each label's part point and box, in label order. */
  anchors: Pt[];
  boxes: BodyBox[];
  /** Line ends: from the part to the box. */
  lines: [Pt, Pt][];
  height: number;
  problems: string[];
};

/** Box centres along one side, in part order, each as close to its part as the others allow. */
function spread(want: number[], size: number, pitch: number, half: number): number[] {
  const out = [...want];
  for (let i = 1; i < out.length; i++) out[i] = Math.max(out[i], out[i - 1] + pitch);
  if (out.length) out[out.length - 1] = Math.min(out[out.length - 1], size - half);
  for (let i = out.length - 2; i >= 0; i--) out[i] = Math.min(out[i], out[i + 1] - pitch);
  if (out.length && out[0] < half) {
    const shift = half - out[0];
    for (let i = 0; i < out.length; i++) out[i] += shift;
  }
  return out;
}

export function bodyPlan(sheet: BodyPartsSheet, box: Box): BodyPlan {
  const b = getBodySubject(sheet.params.subject);
  const height = box.h - (sheet.params.version === "label" ? BANK_H : 0);
  // Columns of boxes left and right, rows above and below (wide subjects): the drawing gets the rest.
  const has = (side: BodyLabel["side"]) => b.labels.some((l) => l.side === side);
  const area = {
    x0: has("left") ? BOX_W + 6 : 0,
    y0: has("top") ? BOX_H + 10 : 2,
    x1: box.w - (has("right") ? BOX_W + 6 : 0),
    y1: height - (has("bottom") ? BOX_H + 10 : 2),
  };
  const fitted = fit(b.shapes, area);
  const { s, tx, ty } = fitted;
  const toMm = (q: Pt): Pt => ({ x: q.x * s + tx, y: q.y * s + ty });
  const anchors = b.labels.map((l) => toMm({ x: l.at[0], y: l.at[1] }));
  const problems: string[] = [];

  const boxes: BodyBox[] = new Array(b.labels.length);
  const lines: [Pt, Pt][] = new Array(b.labels.length);
  for (const side of ["left", "right", "top", "bottom"] as const) {
    const column = side === "left" || side === "right";
    const along = (q: Pt) => (column ? q.y : q.x);
    const idx = b.labels.map((_, i) => i).filter((i) => b.labels[i].side === side).sort((i, j) => along(anchors[i]) - along(anchors[j]));
    const pitch = column ? PITCH : BOX_W + 4;
    const size = column ? height : box.w;
    // Columns: each box near its part. Rows: evenly spaced across the page.
    const centres = column ? spread(idx.map((i) => along(anchors[i])), size, pitch, BOX_H / 2) : idx.map((_, k) => (size * (k + 0.5)) / idx.length);
    if (idx.length * pitch - 4 > size) problems.push(`${sheet.id}: too many boxes on the ${side}`);
    idx.forEach((i, k) => {
      const c = centres[k];
      const rect = column
        ? { x0: side === "left" ? 0 : box.w - BOX_W, y0: c - BOX_H / 2, x1: side === "left" ? BOX_W : box.w, y1: c + BOX_H / 2 }
        : { x0: c - BOX_W / 2, y0: side === "top" ? 0 : height - BOX_H, x1: c + BOX_W / 2, y1: side === "top" ? BOX_H : height };
      const end = side === "left" ? { x: rect.x1, y: c } : side === "right" ? { x: rect.x0, y: c } : side === "top" ? { x: c, y: rect.y1 } : { x: c, y: rect.y0 };
      boxes[i] = { rect, label: b.labels[i], word: null };
      lines[i] = [anchors[i], end];
    });
  }

  if (sheet.params.version === "match") {
    // Box order: top to bottom. Each word moves half the list
    // along, so no word is printed next to its own part.
    const order = boxes.map((_, i) => i).sort((i, j) => (boxes[i].rect.y0 - boxes[j].rect.y0) || (boxes[i].rect.x0 - boxes[j].rect.x0));
    const k = Math.ceil(order.length / 2);
    order.forEach((slot, i) => (boxes[slot].word = b.labels[order[(i + k) % order.length]]));
  } else {
    // The lines: they leave the part they start in and then touch nothing.
    const parts = b.shapes.map((sh) => flatten(sh.d).map((p) => ({ closed: p.closed, pts: p.pts.map(toMm) })));
    lines.forEach(([a, z], i) => {
      const name = b.labels[i].word.en;
      const len = Math.hypot(z.x - a.x, z.y - a.y);
      // Start 1.5 mm from the dot: a part whose edge the dot sits on is left behind.
      const a1 = { x: a.x + ((z.x - a.x) * 1.5) / len, y: a.y + ((z.y - a.y) * 1.5) / len };
      parts.forEach((polys, j) => {
        // The part the line starts in, or on (a mouth, a gill line).
        if (isClosed(polys) && inside(polys, a)) return;
        if (Math.min(...segments(polys).map(([p, q]) => segSegDist(a, a, p, q))) < 0.6) return;
        const d = Math.min(...segments(polys).map(([p, q]) => segSegDist(a1, z, p, q)));
        if (d < CLEAR) problems.push(`${sheet.id}: the "${name}" line comes ${d.toFixed(1)} mm from shape ${j}`);
      });
      lines.forEach(([c, e], k) => {
        if (k <= i) return;
        const d = segSegDist(a, z, c, e);
        if (d < CLEAR) problems.push(`${sheet.id}: the "${name}" and "${b.labels[k].word.en}" lines come ${d.toFixed(1)} mm apart`);
      });
      boxes.forEach((o, k) => {
        if (k !== i && rectSegDist(o.rect, a, z) < CLEAR) problems.push(`${sheet.id}: the "${name}" line touches the "${o.label.word.en}" box`);
      });
    });
  }
  return { fitted, anchors, boxes, lines, height, problems };
}

export function bodyPartsBody(sheet: BodyPartsSheet, locale: SheetLocale, box: Box): string {
  const plan = bodyPlan(sheet, box);
  ART_PROBLEMS.push(...plan.problems.map((x) => `${locale} ${x}`));
  const b = getBodySubject(sheet.params.subject);
  const match = sheet.params.version === "match";
  const art = group(plan.fitted, shapesSvg(b.shapes, plan.fitted.s, BODY_LINE, false));
  const lines = match ? "" : plan.lines.map(([a, z]) => `<path d="M${r2(a.x)} ${r2(a.y)} L${r2(z.x)} ${r2(z.y)}" stroke="${MUTED}" stroke-width="0.4"/>`).join("");
  const dots = plan.anchors.map((a) => `<circle cx="${r2(a.x)}" cy="${r2(a.y)}" r="${match ? 1.3 : 0.9}" fill="${match ? PURPLE : MUTED}" stroke="#fff" stroke-width="0.4"/>`).join("");
  const boxes = plan.boxes
    .map(({ rect: r, word }, i) => {
      const frame = `<rect x="${r2(r.x0 + 0.25)}" y="${r2(r.y0 + 0.25)}" width="${BOX_W - 0.5}" height="${BOX_H - 0.5}" rx="3" fill="#fff" stroke="${PURPLE}" stroke-width="0.5"/>`;
      if (!word) return `${frame}<path d="M${r2(r.x0 + 3)} ${r2(r.y1 - 2.6)} H${r2(r.x1 - 3)}" stroke="#CFC6FF" stroke-width="0.35" stroke-dasharray="1.2 1"/>`;
      // Match: the word, and a dot on the box's inner edge to start the line from.
      const inner = plan.lines[i][1];
      // Long words ("les moustaches") get a smaller font, to keep clear of the box's edges.
      const text = word.word[locale];
      const size = r2(Math.min(5.4, (5.4 * 11.5) / text.length));
      return `${frame}<text x="${r2((r.x0 + r.x1) / 2)}" y="${r2(r.y0 + BOX_H / 2 + size * 0.35)}" font-size="${size}" text-anchor="middle" font-family="display" font-weight="700" fill="${INK}">${esc(text)}</text>
        <circle cx="${r2(inner.x)}" cy="${r2(inner.y)}" r="1.3" fill="${PURPLE}" stroke="#fff" stroke-width="0.4"/>`;
    })
    .join("");
  const svg = `<svg width="${box.w}mm" height="${r2(plan.height)}mm" viewBox="0 0 ${box.w} ${r2(plan.height)}" aria-hidden="true">${art}${lines}${dots}${boxes}</svg>`;
  if (match) return svg;
  // Alphabetical by the noun, not its article ("la bouche" among the b's).
  const noun = (w: string) => w.replace(/^(l'|le |la |les |el |los |las |o |a |os |as )/, "");
  const bank = b.labels.map((l) => l.word[locale]).sort((x, y) => noun(x).localeCompare(noun(y), locale));
  return `<div style="width:${box.w}mm">${svg}<div class="bp-bank"><b>${esc(BODY_UI[locale].bank)}</b>${bank.map((w) => `<span>${esc(w)}</span>`).join("")}</div></div>`;
}

