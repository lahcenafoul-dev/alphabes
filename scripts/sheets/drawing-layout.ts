// The exercises of the dot-to-dot and colouring sheets, drawn from our own
// line drawings (data/worksheets/drawings.ts). Each has a plan (pure
// geometry: where the dots, labels and numbers go, and the problems found)
// and a body (the SVG for the sheet). The tests check the plans; the
// generator prints the bodies.
//
// Coordinates: the drawings are in a 100 × 100 box ("units"); the plans and
// the SVG work in millimetres, the drawing scaled by `s` mm per unit.
import { PAINTS } from "../../data/worksheets/colouring";
import { DOT_COUNT, dotLabels, type DotLevel, type DotToDotSheet } from "../../data/worksheets/dot-to-dot";
import { getDrawing, type Drawing, type DrawingRegion } from "../../data/worksheets/drawings";
import type { ColouringSheet } from "../../data/worksheets/colouring";
import {
  bbox,
  checkDots,
  flatten,
  inside,
  pickDots,
  placeLabels,
  rectSegDist,
  regionSpots,
  segDist,
  segments,
  type Label,
  type LabelOptions,
  type Poly,
  type Pt,
  type Rect,
} from "../../lib/sheets/geometry";
import type { SheetLocale } from "../../lib/sheets/types";
import { esc, INK, LILAC, MUTED, PURPLE } from "./chrome";

type Box = { w: number; h: number };

const r2 = (n: number) => Math.round(n * 100) / 100;

/** Line widths in mm. */
const OUTLINE_W = 0.9;
const REGION_W = 0.7;
const DETAIL_W = 0.9;

export const DRAWING_CSS = `
.dw-key { display: flex; flex-wrap: wrap; justify-content: center; gap: 2.5mm 4mm; margin-top: 4mm; font-size: 4.6mm; line-height: 1 }
.dw-key span { display: flex; align-items: center; gap: 1.8mm; padding: 1.6mm 3.2mm 1.6mm 1.6mm; border: 0.4mm solid #DCD5FA; border-radius: 99mm }
.dw-key b { font-family: display; font-weight: 800; font-size: 5.6mm; min-width: 6.5mm; height: 6.5mm; display: flex; align-items: center; justify-content: center; padding-top: 0.12em; border-radius: 99mm; background: ${LILAC}; color: ${INK} }
.dw-key i { width: 6mm; height: 6mm; border-radius: 99mm; border: 0.45mm solid ${INK}; flex: none }
`;

// ------------------------------------------------------------------ shared

type Parsed = {
  drawing: Drawing;
  outline: Poly[];
  regions: { region: DrawingRegion; polys: Poly[] }[];
  details: { polys: Poly[]; fill?: "ink" | "white"; width: number }[];
};

const parsed = new Map<string, Parsed>();

function parse(id: string): Parsed {
  let p = parsed.get(id);
  if (!p) {
    const drawing = getDrawing(id);
    p = {
      drawing,
      outline: flatten(drawing.outline),
      regions: drawing.regions.map((region) => ({ region, polys: flatten(region.d) })),
      details: drawing.details.map((d) => ({ polys: flatten(d.d), fill: d.fill, width: d.width ?? DETAIL_W })),
    };
    parsed.set(id, p);
  }
  return p;
}

const scalePolys = (polys: Poly[], s: number): Poly[] => polys.map((p) => ({ closed: p.closed, pts: p.pts.map((q) => ({ x: q.x * s, y: q.y * s })) }));

/** The parts of a drawing printed on a dot-to-dot sheet besides the dots. */
function dotParts(p: Parsed, level: DotLevel) {
  return {
    // Under the outline (a stem, a flame): only the part outside it shows.
    under: p.regions.filter((r) => r.region.under),
    // Inside shapes; left out of the easy sheets, where the few straight
    // lines would cut through them.
    shapes: level === "easy" ? [] : p.regions.filter((r) => !r.region.under && !r.region.clip),
  };
}

/** Segments (in units) of what's printed on a dot-to-dot sheet besides the dots: visible parts only. */
function dotAvoid(p: Parsed, level: DotLevel): { segs: [Pt, Pt][]; filled: Poly[][] } {
  const { under, shapes } = dotParts(p, level);
  const segs: [Pt, Pt][] = [];
  for (const u of under) for (const [a, b] of segments(u.polys)) if (!inside(p.outline, { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 })) segs.push([a, b]);
  for (const r of shapes) segs.push(...segments(r.polys));
  for (const d of p.details) segs.push(...segments(d.polys));
  // A shape's edge drawn along the outline (the butterfly's body ends) is the outline itself: dots go there.
  const outlineSegs = segments(p.outline);
  const onOutline = ([a, b]: [Pt, Pt]) => {
    const m = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
    return outlineSegs.some(([c, e]) => segDist(m, c, e) < 0.3);
  };
  return { segs: segs.filter((s) => !onOutline(s)), filled: p.details.filter((d) => d.fill).map((d) => d.polys) };
}

function bboxOfAll(p: Parsed, includeRegions: boolean): Rect {
  const polys = [...p.outline, ...(includeRegions ? p.regions.flatMap((r) => (r.region.clip ? [] : r.polys)) : []), ...p.details.flatMap((d) => d.polys)];
  return bbox(polys);
}

// ------------------------------------------------------------------ dot to dot

const DOT_STYLE: Record<DotLevel, { fs: number; dotR: number; charW: number }> = {
  easy: { fs: 8.5, dotR: 1.7, charW: 0.6 },
  medium: { fs: 6.6, dotR: 1.4, charW: 0.6 },
  letters: { fs: 6.2, dotR: 1.4, charW: 0.74 },
  hard: { fs: 4.8, dotR: 1.1, charW: 0.6 },
};
/** Digits' height in Baloo 2, as a share of the font size. */
const CAP = 0.7;
const PAD = 0.9;
/** The corner box with the finished picture, and the gap kept around it. */
const CORNER = 40;
const CORNER_GAP = 3;

export type DotPlan = {
  s: number;
  /** Where the drawing's (0, 0) goes in the body, in mm. */
  tx: number;
  ty: number;
  dots: Pt[];
  labels: Label[];
  fs: number;
  dotR: number;
  startR: number;
  corner: Rect;
  problems: string[];
};

export function dotPlan(sheet: DotToDotSheet, box: Box): DotPlan {
  const { drawing: id, level } = sheet.params;
  const p = parse(id);
  const st = DOT_STYLE[level];
  const startR = st.dotR * 2.2;
  const texts = dotLabels(level);
  const avoidUnits = dotAvoid(p, level);
  const bb = bboxOfAll(p, level !== "easy");
  const bw = bb.x1 - bb.x0;
  const bh = bb.y1 - bb.y0;
  // Room for the labels around the drawing.
  const margin = st.fs * 1.1;
  let s = Math.min((box.w - 2 * margin) / bw, (box.h - 2 * margin) / bh);
  let lastError = "";
  for (let attempt = 0; attempt < 18; attempt++, s *= 0.965) {
    const outline = scalePolys(p.outline, s)[0];
    const avoid = avoidUnits.segs.map(([a, b]): [Pt, Pt] => [
      { x: a.x * s, y: a.y * s },
      { x: b.x * s, y: b.y * s },
    ]);
    const opts: LabelOptions = {
      h: st.fs * CAP,
      charW: st.fs * st.charW,
      dotR: st.dotR,
      startR,
      pad: PAD,
      avoid,
      bounds: { x0: bb.x0 * s - margin * 1.6, y0: bb.y0 * s - margin * 1.6, x1: bb.x1 * s + margin * 1.6, y1: bb.y1 * s + margin * 1.6 },
    };
    // Dots never sit on, or right next to, the drawing's other lines.
    const keepClear = startR + PAD;
    const dots = pickDots(outline, DOT_COUNT[level], { x: p.drawing.start.x * s, y: p.drawing.start.y * s }, 2 * st.dotR + PAD + 1.5, (q) =>
      avoid.every(([a, b]) => segDist(q, a, b) > keepClear),
    );
    let labels: Label[];
    try {
      labels = placeLabels(dots, texts, opts);
    } catch (e) {
      lastError = (e as Error).message;
      continue;
    }
    const placed = placeWithCorner(dots, labels, avoid, opts, box);
    if (!placed) {
      lastError = "no free corner for the picture";
      continue;
    }
    const problems = checkDots(dots, labels, opts);
    return { s, tx: placed.tx, ty: placed.ty, dots, labels, fs: st.fs, dotR: st.dotR, startR, corner: placed.corner, problems };
  }
  throw new Error(`${sheet.id}: ${lastError}`);
}

/** Moves the drawing in the body so that one corner is free for the finished picture. */
function placeWithCorner(dots: Pt[], labels: Label[], avoid: [Pt, Pt][], o: LabelOptions, box: Box): { tx: number; ty: number; corner: Rect } | null {
  const n = dots.length;
  const lines: [Pt, Pt][] = dots.map((d, i) => [d, dots[(i + 1) % n]]);
  const segs = [...lines, ...avoid];
  const all = [...dots.map((d) => ({ x0: d.x - o.startR, y0: d.y - o.startR, x1: d.x + o.startR, y1: d.y + o.startR })), ...labels.map((l) => l.rect)];
  for (const [a, b] of avoid) all.push({ x0: Math.min(a.x, b.x), y0: Math.min(a.y, b.y), x1: Math.max(a.x, b.x), y1: Math.max(a.y, b.y) });
  const cb = { x0: Math.min(...all.map((r) => r.x0)), y0: Math.min(...all.map((r) => r.y0)), x1: Math.max(...all.map((r) => r.x1)), y1: Math.max(...all.map((r) => r.y1)) };
  const cw = cb.x1 - cb.x0;
  const ch = cb.y1 - cb.y0;
  if (cw > box.w || ch > box.h) return null;
  const xs = [(box.w - cw) / 2, 0, box.w - cw].map((x) => x - cb.x0);
  const ys = [(box.h - ch) / 2, 0, box.h - ch].map((y) => y - cb.y0);
  // Bottom-right first: the picture is a reward at the end.
  const corners = [
    { x0: box.w - CORNER, y0: box.h - CORNER },
    { x0: box.w - CORNER, y0: 0 },
    { x0: 0, y0: box.h - CORNER },
    { x0: 0, y0: 0 },
  ].map((c) => ({ ...c, x1: c.x0 + CORNER, y1: c.y0 + CORNER }));
  for (const corner of corners)
    for (const ty of ys)
      for (const tx of xs) {
        // The corner, moved into the drawing's coordinates, with its gap.
        const r = { x0: corner.x0 - tx - CORNER_GAP, y0: corner.y0 - ty - CORNER_GAP, x1: corner.x1 - tx + CORNER_GAP, y1: corner.y1 - ty + CORNER_GAP };
        const hit =
          dots.some((d) => d.x + o.startR > r.x0 && d.x - o.startR < r.x1 && d.y + o.startR > r.y0 && d.y - o.startR < r.y1) ||
          labels.some((l) => l.rect.x0 < r.x1 && r.x0 < l.rect.x1 && l.rect.y0 < r.y1 && r.y0 < l.rect.y1) ||
          segs.some(([a, b]) => rectSegDist(r, a, b) === 0);
        if (!hit) return { tx, ty, corner };
      }
  return null;
}

function star(cx: number, cy: number, r: number): string {
  const pts: string[] = [];
  for (let i = 0; i < 10; i++) {
    const a = -Math.PI / 2 + (i * Math.PI) / 5;
    const rr = i % 2 ? r * 0.48 : r;
    pts.push(`${r2(cx + rr * Math.cos(a))},${r2(cy + rr * Math.sin(a))}`);
  }
  return `<polygon points="${pts.join(" ")}" fill="#FFC94D" stroke="${INK}" stroke-width="0.45" stroke-linejoin="round"/>`;
}

export function dotToDotBody(sheet: DotToDotSheet, _locale: SheetLocale, box: Box): string {
  const plan = dotPlan(sheet, box);
  const p = parse(sheet.params.drawing);
  const { s, tx, ty } = plan;
  const uid = `d-${sheet.id}`;
  const { under, shapes } = dotParts(p, sheet.params.level);
  const w = (mm: number) => r2(mm / s);
  // Along the outline, where the child draws, the drawing's own lines are left out
  // (the "band" mask), so a dot never sits on a printed line.
  const art = `<g transform="translate(${r2(tx)} ${r2(ty)}) scale(${r2(s)})" stroke="${INK}" stroke-linejoin="round" stroke-linecap="round">
    <mask id="${uid}-out" maskUnits="userSpaceOnUse" x="-50" y="-50" width="200" height="200"><rect x="-50" y="-50" width="200" height="200" fill="#fff"/><path d="${p.drawing.outline}" fill="#000"/></mask>
    ${under.map((u) => `<path d="${u.region.d}" fill="#fff" stroke-width="${w(REGION_W)}" mask="url(#${uid}-out)"/>`).join("")}
    <mask id="${uid}-band" maskUnits="userSpaceOnUse" x="-50" y="-50" width="200" height="200"><rect x="-50" y="-50" width="200" height="200" fill="#fff"/><path d="${p.drawing.outline}" fill="none" stroke="#000" stroke-width="${w(2 * plan.dotR + 2 * PAD)}"/></mask>
    <g mask="url(#${uid}-band)">
      ${shapes.map((r) => `<path d="${r.region.d}" fill="#fff" stroke-width="${w(REGION_W)}"/>`).join("")}
      ${detailsSvg(p, s)}
    </g>
  </g>`;
  const dots = plan.dots
    .map((d, i) => (i === 0 ? star(tx + d.x, ty + d.y, plan.startR) : `<circle cx="${r2(tx + d.x)}" cy="${r2(ty + d.y)}" r="${plan.dotR}" fill="${INK}"/>`))
    .join("");
  const labels = plan.labels
    .map(
      (l, i) =>
        `<text x="${r2(tx + l.x)}" y="${r2(ty + l.rect.y1)}" font-size="${plan.fs}" text-anchor="middle" font-family="display" font-weight="${i === 0 ? 800 : 700}" fill="${i === 0 ? PURPLE : INK}">${esc(l.text)}</text>`,
    )
    .join("");
  const c = plan.corner;
  const corner = `<rect x="${r2(c.x0 + 0.3)}" y="${r2(c.y0 + 0.3)}" width="${CORNER - 0.6}" height="${CORNER - 0.6}" rx="4" fill="#fff" stroke="#CFC6FF" stroke-width="0.6" stroke-dasharray="2 1.4"/>
    ${pictureSvg(p, { x0: c.x0 + 5, y0: c.y0 + 5, x1: c.x1 - 5, y1: c.y1 - 5 }, `${uid}-pic`, true)}`;
  return `<svg width="${box.w}mm" height="${box.h}mm" viewBox="0 0 ${box.w} ${box.h}" aria-hidden="true">${art}${dots}${labels}${corner}</svg>`;
}

// ------------------------------------------------------------------ colouring

function detailsSvg(p: Parsed, s: number): string {
  return p.drawing.details
    .map((d) => {
      if (d.fill === "ink") return `<path d="${d.d}" fill="${INK}" stroke="none"/>`;
      if (d.fill === "white") return `<path d="${d.d}" fill="#fff" ${d.width ? `stroke-width="${r2(d.width / s)}"` : `stroke="none"`}/>`;
      return `<path d="${d.d}" fill="none" stroke-width="${r2((d.width ?? DETAIL_W) / s)}"/>`;
    })
    .join("");
}

/**
 * The whole drawing fitted in a rectangle (mm): coloured (`paint`) for the
 * finished-picture corner, or white to colour in.
 */
function pictureSvg(p: Parsed, area: Rect, uid: string, paint: boolean, numbers = ""): string {
  const bb = bbox([...p.outline, ...p.regions.flatMap((r) => (r.region.clip ? [] : r.polys)), ...p.details.flatMap((d) => d.polys)]);
  const s = Math.min((area.x1 - area.x0) / (bb.x1 - bb.x0), (area.y1 - area.y0) / (bb.y1 - bb.y0));
  const tx = area.x0 + ((area.x1 - area.x0) - (bb.x1 - bb.x0) * s) / 2 - bb.x0 * s;
  const ty = area.y0 + ((area.y1 - area.y0) - (bb.y1 - bb.y0) * s) / 2 - bb.y0 * s;
  return `<g transform="translate(${r2(tx)} ${r2(ty)}) scale(${r2(s)})">${drawingSvg(p, s, uid, paint)}</g>${numbers ? `<g transform="translate(${r2(tx)} ${r2(ty)})">${numbers}</g>` : ""}`;
}

/** The drawing in units: regions in painting order, then the outline and details on top. */
function drawingSvg(p: Parsed, s: number, uid: string, paint: boolean): string {
  const fill = (r: DrawingRegion | null) => (paint ? PAINTS[r ? r.paint : p.drawing.paint].hex : "#fff");
  const w = (mm: number) => r2(mm / s);
  const path = (r: { region: DrawingRegion }) =>
    `<path d="${r.region.d}" fill="${fill(r.region)}" stroke-width="${w(REGION_W)}"${r.region.clip ? ` clip-path="url(#${uid}-clip)"` : ""}/>`;
  return `<defs><clipPath id="${uid}-clip"><path d="${p.drawing.outline}"/></clipPath></defs>
  <g stroke="${INK}" stroke-linejoin="round" stroke-linecap="round">
    ${p.regions.filter((r) => r.region.under).map(path).join("")}
    <path d="${p.drawing.outline}" fill="${fill(null)}" stroke="none"/>
    ${p.regions.filter((r) => !r.region.under).map(path).join("")}
    <path d="${p.drawing.outline}" fill="none" stroke-width="${w(OUTLINE_W)}"/>
    ${detailsSvg(p, s)}
  </g>`;
}

export type ColourSpot = { x: number; y: number; n: number; fs: number };

export type ColourPlan = {
  /** Colour numbers in key order: number 1 is paints[0]. */
  paints: string[];
  spots: ColourSpot[];
  /** The drawing's area in the body, mm. */
  area: Rect;
  s: number;
  problems: string[];
};

const KEY_H = 24;
/** Numbers in the regions: largest and smallest font size, mm. */
const NUM_MAX = 8;
const NUM_MIN = 3.8;

export function colourPlan(sheet: ColouringSheet, box: Box): ColourPlan {
  const p = parse(sheet.params.drawing);
  const area = { x0: 0, y0: 0, x1: box.w, y1: box.h - (sheet.params.version === "number" ? KEY_H : 0) };
  const bb = bbox([...p.outline, ...p.regions.flatMap((r) => (r.region.clip ? [] : r.polys)), ...p.details.flatMap((d) => d.polys)]);
  const s = Math.min((area.x1 - area.x0) / (bb.x1 - bb.x0), (area.y1 - area.y0) / (bb.y1 - bb.y0));
  const problems: string[] = [];
  for (const [i, r] of [{ polys: p.outline }, ...p.regions].entries()) if (r.polys.some((q) => !q.closed)) problems.push(`region ${i} is not closed`);
  if (sheet.params.version === "plain") return { paints: [], spots: [], area, s, problems };

  // Painting order: under regions, the outline, the rest.
  const order = [...p.regions.filter((r) => r.region.under), { region: { d: p.drawing.outline, paint: p.drawing.paint } as DrawingRegion, polys: p.outline }, ...p.regions.filter((r) => !r.region.under)];
  const paints: string[] = [];
  for (const r of order) if (!paints.includes(r.region.paint)) paints.push(r.region.paint);
  // Number 1 for the biggest region's colour reads best: keep the painting order otherwise.
  const shapes = order.map((r) => ({ polys: r.polys, clip: r.region.clip ? p.outline : undefined }));
  const blocked = p.details.map((d) => ({ polys: d.polys, filled: !!d.fill, halfWidth: (d.width / 2 + 0.8) / s }));
  const spots = regionSpots(shapes, blocked, { x0: bb.x0 - 1, y0: bb.y0 - 1, x1: bb.x1 + 1, y1: bb.y1 + 1 }, 0.4);
  const out: ColourSpot[] = [];
  for (const spot of spots) {
    const n = paints.indexOf(order[spot.region].region.paint) + 1;
    const digits = String(n).length;
    // Room left inside the lines, in mm, and the biggest number that fits in it.
    const room = (spot.r - OUTLINE_W / 2 / s) * s - 0.6;
    const fs = Math.min(NUM_MAX, room / Math.hypot(digits * 0.29, CAP / 2));
    if (spot.area * s * s < 8) {
      problems.push(`${sheet.id}: a sliver of region ${spot.region} (${order[spot.region].region.paint}) at ${spot.x.toFixed(1)},${spot.y.toFixed(1)}, ${Math.round(spot.area * s * s)} mm²`);
      continue;
    }
    if (fs < NUM_MIN) problems.push(`${sheet.id}: region ${spot.region} (${order[spot.region].region.paint}) at ${spot.x.toFixed(1)},${spot.y.toFixed(1)} is too small for its number (${fs.toFixed(1)} mm)`);
    out.push({ x: spot.x, y: spot.y, n, fs: Math.max(fs, NUM_MIN) });
  }
  return { paints, spots: out, area, s, problems };
}

export function colouringBody(sheet: ColouringSheet, locale: SheetLocale, box: Box): string {
  const plan = colourPlan(sheet, box);
  const p = parse(sheet.params.drawing);
  const uid = `c-${sheet.id}`;
  const bb = bbox([...p.outline, ...p.regions.flatMap((r) => (r.region.clip ? [] : r.polys)), ...p.details.flatMap((d) => d.polys)]);
  const { s } = plan;
  // The numbers, in mm relative to the drawing's (0, 0), like pictureSvg places it.
  const numbers = plan.spots
    .map(
      (n) =>
        `<text x="${r2(n.x * s)}" y="${r2(n.y * s + (n.fs * CAP) / 2)}" font-size="${r2(n.fs)}" text-anchor="middle" font-family="display" font-weight="700" fill="${MUTED}">${n.n}</text>`,
    )
    .join("");
  const svgH = plan.area.y1;
  void bb;
  const svg = `<svg width="${box.w}mm" height="${r2(svgH)}mm" viewBox="0 0 ${box.w} ${r2(svgH)}" aria-hidden="true">${pictureSvg(p, plan.area, uid, false, numbers)}</svg>`;
  if (sheet.params.version === "plain") return svg;
  const key = plan.paints
    .map((paint, i) => {
      const c = PAINTS[paint as keyof typeof PAINTS];
      return `<span><b>${i + 1}</b><i style="background:${c.hex}"></i>${esc(c.name[locale])}</span>`;
    })
    .join("");
  return `<div style="width:${box.w}mm">${svg}<div class="dw-key">${key}</div></div>`;
}
