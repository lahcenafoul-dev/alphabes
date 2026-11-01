// The Tracing Lines sheets (data/worksheets/tracing-lines.ts), in mm:
//   lines     six rows, each a dotted line from a cartoon to its goal; the
//             dots are close on the first two rows, wider on the next two,
//             widest on the last two (spirals: six spirals, the goal in the
//             middle)
//   pictures  a big dashed copy of the drawing and three small ones, the
//             coloured drawing in the top corner
//   shapes    one big shape, three medium, five small, each with a green
//             start dot and an arrow; the coloured shape in the corner
import { type LineType, type TraceShape, type TracingSheet } from "../../data/worksheets/tracing-lines";
import type { SheetLocale } from "../../lib/sheets/types";
import { picturePrint } from "../picture-emoji";
import { drawingArt, TRACE_INK } from "./drawing-layout";

type Box = { w: number; h: number };
type P = [number, number];

const r2 = (n: number) => Math.round(n * 100) / 100;

const GREEN = "#18A97F";
/** Dot spacing (mm) of the three levels, two rows each. */
const SPACING = [2.4, 4, 6];
const DOT = 1.6;
const PIC = 18;

export const TRACING_CSS = `
.tr { position: relative }
.tr-pic { position: absolute; line-height: 0; transform: translate(-50%, -50%) }
`;


/** A row's line from x = 0 to L, around y = 0 (y down), with half-height A. */
function linePoints(type: LineType, L: number, A: number, row: number): P[] {
  const pts: P[] = [];
  const sample = (f: (x: number) => number) => {
    for (let x = 0; x <= L + 1e-6; x += 0.25) pts.push([x, f(x)]);
  };
  const periods = (target: number) => Math.max(1, Math.round(L / target));
  switch (type) {
    case "straight":
      return [[0, 0], [L, 0]];
    case "slanted":
      // Drawn as separate strokes (linesBody).
      return [[0, 0], [L, 0]];
    case "zigzag": {
      // Starts and ends half-way up, so it meets the cartoons.
      const n = periods(18) * 2;
      const step = L / n;
      return [[0, 0], ...Array.from({ length: n }, (_, k) => [(k + 0.5) * step, k % 2 ? A : -A] as P), [L, 0]];
    }
    case "mountains": {
      // Tall and small peaks in turn.
      const n = periods(32) * 2;
      return Array.from({ length: n + 1 }, (_, k) => [(k * L) / n, k % 2 ? (k % 4 === 1 ? -A : -A * 0.15) : A * 0.75] as P);
    }
    case "wavy": {
      const P = L / (periods(30) + 0.5);
      sample((x) => -A * 0.85 * Math.sin((2 * Math.PI * x) / P));
      return pts;
    }
    case "curves": {
      // Hops: arches standing on the line.
      const P = L / periods(26);
      sample((x) => A * 0.7 - 1.6 * A * Math.abs(Math.sin((Math.PI * x) / P)));
      return pts;
    }
    case "loops": {
      // Joined loops, like a row of cursive e's: a stretched cycloid.
      const n = periods(17);
      const r = L / (2 * Math.PI * n);
      const d = 1.9 * r;
      for (let t = Math.PI; t <= Math.PI + 2 * Math.PI * n + 1e-6; t += 0.02) {
        pts.push([r * (t - Math.PI) - d * Math.sin(t), -A * 0.95 * Math.cos(t)]);
      }
      return pts;
    }
    default:
      throw new Error(`No line ${type}`);
  }
}

/**
 * Dots along a line, about `spacing` apart. Corners (`corners`: every point
 * of a zigzag or a mountain) always get a dot, so the shape still shows
 * when the dots are far apart.
 */
function dotted(pts: P[], spacing: number, corners: boolean): string {
  const dots: P[] = [];
  const along = (list: P[]) => {
    // Evenly along the whole list, ending on its last point.
    const lens = list.slice(1).map((p, i) => Math.hypot(p[0] - list[i][0], p[1] - list[i][1]));
    const total = lens.reduce((a, b) => a + b, 0);
    const n = Math.max(1, Math.round(total / spacing));
    let seg = 0;
    let done = 0;
    for (let k = dots.length ? 1 : 0; k <= n; k++) {
      const at = (k * total) / n;
      while (seg < lens.length - 1 && done + lens[seg] < at - 1e-9) done += lens[seg++];
      const t = lens[seg] ? Math.min(1, (at - done) / lens[seg]) : 0;
      const [a, b] = [list[seg], list[seg + 1]];
      dots.push([a[0] + t * (b[0] - a[0]), a[1] + t * (b[1] - a[1])]);
    }
  };
  if (corners) for (let i = 1; i < pts.length; i++) along([pts[i - 1], pts[i]]);
  else along(pts);
  return `<g fill="${TRACE_INK}">${dots.map(([x, y]) => `<circle cx="${r2(x)}" cy="${r2(y)}" r="${DOT / 2}"/>`).join("")}</g>`;
}

function startDot(x: number, y: number): string {
  return `<circle cx="${r2(x)}" cy="${r2(y)}" r="2" fill="${GREEN}"/>`;
}

const pic = (key: string, x: number, y: number, size = PIC) =>
  `<div class="tr-pic" style="left:${r2(x)}mm;top:${r2(y)}mm;font-size:${size}mm">${picturePrint(key)}</div>`;

function linesBody(sheet: TracingSheet & { params: { group: "lines" } }, box: Box): string {
  const { line, rows } = sheet.params;
  if (line === "spirals") return spiralsBody(rows, box);
  const rowH = box.h / rows.length;
  const x0 = PIC + 6;
  const x1 = box.w - PIC - 6;
  const A = Math.min(9.5, rowH * 0.3);
  const svg: string[] = [];
  const pics: string[] = [];
  rows.forEach(([from, to], i) => {
    const cy = rowH * (i + 0.5);
    const pts = linePoints(line, x1 - x0, A, i).map(([x, y]) => [x0 + x, cy + y] as P);
    // Level separators: a light line between the pairs of rows.
    if (i && i % 2 === 0) svg.push(`<path d="M4 ${r2(rowH * i)}H${r2(box.w - 4)}" stroke="#E4DEFF" stroke-width="0.4" stroke-dasharray="1.5 1.5"/>`);
    const spacing = SPACING[Math.floor(i / 2)];
    if (line === "slanted") {
      // A row of slanted strokes, each drawn from the top (rain falling on the way).
      const n = Math.round((x1 - x0) / 14);
      const step = (x1 - x0 - A) / (n - 1);
      for (let k = 0; k < n; k++) {
        const x = x0 + k * step;
        svg.push(dotted([[x, cy - A], [x + A, cy + A]], spacing, true));
        svg.push(`<circle cx="${r2(x)}" cy="${r2(cy - A)}" r="1.3" fill="${GREEN}"/>`);
      }
    } else {
      svg.push(dotted(pts, spacing, line === "zigzag" || line === "mountains" || line === "straight"));
      svg.push(startDot(pts[0][0], pts[0][1]));
    }
    pics.push(pic(from, PIC / 2 + 1, cy), pic(to, box.w - PIC / 2 - 1, cy));
  });
  return `<div class="tr" style="width:${box.w}mm;height:${box.h}mm"><svg width="${box.w}mm" height="${box.h}mm" viewBox="0 0 ${box.w} ${box.h}" aria-hidden="true">${svg.join("")}</svg>${pics.join("")}</div>`;
}

/** Six spirals (2 × 3): each starts at a cartoon and winds in to the goal in its middle. */
function spiralsBody(rows: [string, string][], box: Box): string {
  const cellW = box.w / 2;
  const cellH = box.h / 3;
  const R = Math.min(cellH / 2 - 3, (cellW - PIC - 8) / 2);
  const r0 = 8.5;
  const turns = 2.25;
  const svg: string[] = [];
  const pics: string[] = [];
  rows.forEach(([from, to], i) => {
    const cx = (i % 2) * cellW + PIC + 6 + R;
    const cy = Math.floor(i / 2) * cellH + cellH / 2;
    const pts: P[] = [];
    const T = turns * 2 * Math.PI;
    for (let t = 0; t <= T + 1e-6; t += 0.03) {
      const r = R - ((R - r0) * t) / T;
      // From the left, clockwise.
      pts.push([cx - r * Math.cos(t), cy - r * Math.sin(t)]);
    }
    svg.push(dotted(pts, SPACING[Math.floor(i / 2)], false));
    svg.push(startDot(pts[0][0], pts[0][1]));
    pics.push(pic(from, cx - R - PIC / 2 - 3, cy), pic(to, cx, cy, 12));
  });
  return `<div class="tr" style="width:${box.w}mm;height:${box.h}mm"><svg width="${box.w}mm" height="${box.h}mm" viewBox="0 0 ${box.w} ${box.h}" aria-hidden="true">${svg.join("")}</svg>${pics.join("")}</div>`;
}

/** The model in a corner: a dashed rounded box with the coloured picture. */
function cornerBox(x: number, y: number, size: number, inner: string): string {
  return `<rect x="${r2(x + 0.3)}" y="${r2(y + 0.3)}" width="${r2(size - 0.6)}" height="${r2(size - 0.6)}" rx="4" fill="#fff" stroke="#CFC6FF" stroke-width="0.6" stroke-dasharray="2 1.4"/>${inner}`;
}

function picturesBody(id: string, box: Box): string {
  const CORNER = 42;
  const gap = 6;
  const topH = box.h * 0.6;
  const parts: string[] = [];
  parts.push(drawingArt(id, { x0: 2, y0: 2, x1: box.w - CORNER - gap, y1: topH - 2 }, "big", "trace"));
  parts.push(cornerBox(box.w - CORNER, 0, CORNER, drawingArt(id, { x0: box.w - CORNER + 5, y0: 5, x1: box.w - 5, y1: CORNER - 5 }, "model", "paint")));
  const smallW = (box.w - 2 * gap) / 3;
  const y0 = topH + gap;
  parts.push(`<path d="M0 ${r2(topH + gap / 2)}H${box.w}" stroke="#E4DEFF" stroke-width="0.4" stroke-dasharray="1.5 1.5"/>`);
  for (let k = 0; k < 3; k++) {
    const x = k * (smallW + gap);
    parts.push(drawingArt(id, { x0: x + 3, y0: y0 + 3, x1: x + smallW - 3, y1: box.h - 3 }, `small${k}`, "trace"));
  }
  return `<svg width="${box.w}mm" height="${box.h}mm" viewBox="0 0 ${box.w} ${box.h}" aria-hidden="true">${parts.join("")}</svg>`;
}

// The shapes in a 40 × 40 box, each path starting where the child starts
// (the green dot), with the direction to go and which side is outside.
const SHAPES: Record<TraceShape, { d: string; start: P; dir: P; out: P; colour: string }> = {
  circle: { d: "M20 4 A16 16 0 1 0 20 36 A16 16 0 1 0 20 4", start: [20, 4], dir: [-1, 0], out: [0, -1], colour: "#3EA6FF" },
  square: { d: "M5 5 H35 V35 H5 Z", start: [5, 5], dir: [1, 0], out: [0, -1], colour: "#18A97F" },
  triangle: { d: "M20 4.5 L36.5 34.5 H3.5 Z", start: [20, 4.5], dir: [0.48, 0.88], out: [0.88, -0.48], colour: "#FFB020" },
  star: {
    d: "M20 3.5 L24.6 14.6 L36.5 15.5 L27.4 23.2 L30.3 34.8 L20 28.5 L9.7 34.8 L12.6 23.2 L3.5 15.5 L15.4 14.6 Z",
    start: [20, 3.5],
    dir: [0.38, 0.92],
    out: [0.92, -0.38],
    colour: "#FFD23F",
  },
  heart: {
    d: "M20 10 C18.5 7 15.5 5 12 5 C7.5 5 3.5 8.5 3.5 13.5 C3.5 21 9 27 20 35 C31 27 36.5 21 36.5 13.5 C36.5 8.5 32.5 5 28 5 C24.5 5 21.5 7 20 10 Z",
    start: [20, 10],
    dir: [-0.45, -0.89],
    out: [-0.89, 0.45],
    colour: "#FF5C93",
  },
};

/** One shape to trace, `size` mm wide, top-left at (x, y). */
function shapeToTrace(shape: TraceShape, x: number, y: number, size: number): string {
  const sh = SHAPES[shape];
  const s = size / 40;
  const w = (mm: number) => r2(mm / s);
  const dash = Math.min(2.2, Math.max(1.3, size * 0.03));
  const [sx, sy] = sh.start;
  const [dx, dy] = sh.dir;
  const [ox, oy] = sh.out;
  // The arrow: beside the line, just outside, pointing the way to go.
  const off = 3.2 / s;
  const len = Math.min(7, size * 0.18) / s;
  const ax = sx + ox * off;
  const ay = sy + oy * off;
  const bx = ax + dx * len;
  const by = ay + dy * len;
  const hl = 1.8 / s;
  const arrow = `<path d="M${r2(ax)} ${r2(ay)}L${r2(bx)} ${r2(by)}M${r2(bx - dx * hl + ox * hl * 0.7)} ${r2(by - dy * hl + oy * hl * 0.7)}L${r2(bx)} ${r2(by)}L${r2(bx - dx * hl - ox * hl * 0.7)} ${r2(by - dy * hl - oy * hl * 0.7)}" fill="none" stroke="${GREEN}" stroke-width="${w(0.7)}" stroke-linecap="round" stroke-linejoin="round"/>`;
  return `<g transform="translate(${r2(x)} ${r2(y)}) scale(${r2(s)})"><path d="${sh.d}" fill="none" stroke="${TRACE_INK}" stroke-width="${w(1.1)}" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="${w(dash)} ${w(dash * 0.8)}"/><circle cx="${sx}" cy="${sy}" r="${w(1.9)}" fill="${GREEN}"/>${arrow}</g>`;
}

function shapesBody(shape: TraceShape, box: Box): string {
  const CORNER = 40;
  const gap = 6;
  const big = Math.min(box.h * 0.48, box.w - CORNER - 2 * gap);
  const mid = (box.w - 2 * gap * 2) / 3 - 4;
  const midSize = Math.min(mid, 44);
  const small = Math.min((box.w - 4 * gap) / 5, box.h - big - midSize - 4 * gap);
  const parts: string[] = [];
  parts.push(shapeToTrace(shape, (box.w - CORNER - big) / 2, 0, big));
  const sh = SHAPES[shape];
  const model = `<g transform="translate(${box.w - CORNER + 6} 6) scale(${r2((CORNER - 12) / 40)})"><path d="${sh.d}" fill="${sh.colour}" stroke="#1D1846" stroke-width="2.4" stroke-linejoin="round"/></g>`;
  parts.push(cornerBox(box.w - CORNER, 0, CORNER, model));
  const sep = (y: number) => `<path d="M0 ${r2(y)}H${box.w}" stroke="#E4DEFF" stroke-width="0.4" stroke-dasharray="1.5 1.5"/>`;
  let y = big + gap;
  parts.push(sep(y - gap / 2));
  const midGap = (box.w - 3 * midSize) / 3;
  for (let k = 0; k < 3; k++) parts.push(shapeToTrace(shape, midGap / 2 + k * (midSize + midGap), y, midSize));
  y += midSize + gap;
  parts.push(sep(y - gap / 2));
  const smallGap = (box.w - 5 * small) / 5;
  for (let k = 0; k < 5; k++) parts.push(shapeToTrace(shape, smallGap / 2 + k * (small + smallGap), y, small));
  return `<svg width="${box.w}mm" height="${box.h}mm" viewBox="0 0 ${box.w} ${box.h}" aria-hidden="true">${parts.join("")}</svg>`;
}

export function tracingBody(sheet: TracingSheet, _locale: SheetLocale, box: Box): string {
  const p = sheet.params;
  if (p.group === "lines") return linesBody(sheet as TracingSheet & { params: { group: "lines" } }, box);
  if (p.group === "pictures") return picturesBody(p.drawing, box);
  return shapesBody(p.shape, box);
}
