// Geometry for the line-drawing sheets (data/worksheets/drawings.ts) (dot to dot, colouring): flattening
// SVG paths into polylines, picking the dots along an outline, placing their
// numbers where they touch nothing, and finding where a colouring region's
// number fits. Plain TypeScript, so the tests can check every sheet without
// a browser.

export type Pt = { x: number; y: number };
/** A flattened subpath; `closed` when it ends with Z. */
export type Poly = { pts: Pt[]; closed: boolean };

const dist = (a: Pt, b: Pt) => Math.hypot(a.x - b.x, a.y - b.y);

// ------------------------------------------------------------------ paths

/**
 * Flattens an SVG path (M L H V C Q Z, absolute or relative) into polylines.
 * Curves are cut into `steps` straight pieces.
 */
export function flatten(d: string, steps = 24): Poly[] {
  const tokens = d.match(/[MLHVCQZmlhvcqz]|-?\d*\.?\d+(?:e-?\d+)?/g) ?? [];
  const polys: Poly[] = [];
  let cur: Poly | null = null;
  let p: Pt = { x: 0, y: 0 };
  let start: Pt = p;
  let cmd = "";
  let i = 0;
  const num = () => Number(tokens[i++]);
  const isNum = () => i < tokens.length && !/^[A-Za-z]$/.test(tokens[i]);
  const push = (q: Pt) => {
    cur!.pts.push(q);
    p = q;
  };
  while (i < tokens.length) {
    if (!isNum()) cmd = tokens[i++];
    const rel = cmd === cmd.toLowerCase();
    const o = rel ? p : { x: 0, y: 0 };
    switch (cmd.toUpperCase()) {
      case "M": {
        const q = { x: o.x + num(), y: o.y + num() };
        cur = { pts: [q], closed: false };
        polys.push(cur);
        p = start = q;
        // Further pairs after M are line-tos.
        cmd = rel ? "l" : "L";
        break;
      }
      case "L":
        push({ x: o.x + num(), y: o.y + num() });
        break;
      case "H":
        push({ x: (rel ? p.x : 0) + num(), y: p.y });
        break;
      case "V":
        push({ x: p.x, y: (rel ? p.y : 0) + num() });
        break;
      case "C": {
        const a = { x: o.x + num(), y: o.y + num() };
        const b = { x: o.x + num(), y: o.y + num() };
        const e = { x: o.x + num(), y: o.y + num() };
        const s = p;
        for (let k = 1; k <= steps; k++) {
          const t = k / steps;
          const u = 1 - t;
          push({
            x: u * u * u * s.x + 3 * u * u * t * a.x + 3 * u * t * t * b.x + t * t * t * e.x,
            y: u * u * u * s.y + 3 * u * u * t * a.y + 3 * u * t * t * b.y + t * t * t * e.y,
          });
        }
        break;
      }
      case "Q": {
        const a = { x: o.x + num(), y: o.y + num() };
        const e = { x: o.x + num(), y: o.y + num() };
        const s = p;
        for (let k = 1; k <= steps; k++) {
          const t = k / steps;
          const u = 1 - t;
          push({ x: u * u * s.x + 2 * u * t * a.x + t * t * e.x, y: u * u * s.y + 2 * u * t * a.y + t * t * e.y });
        }
        break;
      }
      case "Z":
        if (cur) {
          cur.closed = true;
          if (dist(cur.pts[cur.pts.length - 1], start) < 1e-6) cur.pts.pop();
        }
        p = start;
        break;
      default:
        throw new Error(`Unsupported path command "${cmd}" in ${d}`);
    }
  }
  return polys;
}

/** A circle as a closed path of four cubic curves. */
export function circle(cx: number, cy: number, r: number): string {
  return ellipse(cx, cy, r, r);
}

export function ellipse(cx: number, cy: number, rx: number, ry: number): string {
  const k = 0.5523;
  const f = (n: number) => Math.round(n * 1000) / 1000;
  return [
    `M${f(cx + rx)} ${f(cy)}`,
    `C${f(cx + rx)} ${f(cy + ry * k)} ${f(cx + rx * k)} ${f(cy + ry)} ${f(cx)} ${f(cy + ry)}`,
    `C${f(cx - rx * k)} ${f(cy + ry)} ${f(cx - rx)} ${f(cy + ry * k)} ${f(cx - rx)} ${f(cy)}`,
    `C${f(cx - rx)} ${f(cy - ry * k)} ${f(cx - rx * k)} ${f(cy - ry)} ${f(cx)} ${f(cy - ry)}`,
    `C${f(cx + rx * k)} ${f(cy - ry)} ${f(cx + rx)} ${f(cy - ry * k)} ${f(cx + rx)} ${f(cy)}Z`,
  ].join(" ");
}

export function bbox(polys: Poly[]): { x0: number; y0: number; x1: number; y1: number } {
  const all = polys.flatMap((p) => p.pts);
  return {
    x0: Math.min(...all.map((p) => p.x)),
    y0: Math.min(...all.map((p) => p.y)),
    x1: Math.max(...all.map((p) => p.x)),
    y1: Math.max(...all.map((p) => p.y)),
  };
}

/** Even-odd point-in-polygon test over every subpath. */
export function inside(polys: Poly[], q: Pt): boolean {
  let c = false;
  for (const { pts } of polys) {
    for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
      const a = pts[i];
      const b = pts[j];
      if (a.y > q.y !== b.y > q.y && q.x < ((b.x - a.x) * (q.y - a.y)) / (b.y - a.y) + a.x) c = !c;
    }
  }
  return c;
}

/** The segments of polylines (closing the closed ones). */
export function segments(polys: Poly[]): [Pt, Pt][] {
  const out: [Pt, Pt][] = [];
  for (const { pts, closed } of polys) {
    for (let i = 0; i + 1 < pts.length; i++) out.push([pts[i], pts[i + 1]]);
    if (closed && pts.length > 2) out.push([pts[pts.length - 1], pts[0]]);
  }
  return out;
}

export function segDist(q: Pt, a: Pt, b: Pt): number {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const l = dx * dx + dy * dy;
  const t = l ? Math.max(0, Math.min(1, ((q.x - a.x) * dx + (q.y - a.y) * dy) / l)) : 0;
  return Math.hypot(q.x - (a.x + t * dx), q.y - (a.y + t * dy));
}

// ------------------------------------------------------------------ boxes

export type Rect = { x0: number; y0: number; x1: number; y1: number };

const overlaps = (a: Rect, b: Rect) => a.x0 < b.x1 && b.x0 < a.x1 && a.y0 < b.y1 && b.y0 < a.y1;

/** Shortest distance from a point to a rectangle (0 inside). */
function rectPointDist(r: Rect, q: Pt): number {
  const dx = Math.max(r.x0 - q.x, 0, q.x - r.x1);
  const dy = Math.max(r.y0 - q.y, 0, q.y - r.y1);
  return Math.hypot(dx, dy);
}

/** Shortest distance from a segment to a rectangle (0 if they touch). */
export function rectSegDist(r: Rect, a: Pt, b: Pt): number {
  const inRect = (q: Pt) => q.x >= r.x0 && q.x <= r.x1 && q.y >= r.y0 && q.y <= r.y1;
  if (inRect(a) || inRect(b)) return 0;
  const corners = [
    { x: r.x0, y: r.y0 },
    { x: r.x1, y: r.y0 },
    { x: r.x1, y: r.y1 },
    { x: r.x0, y: r.y1 },
  ];
  // Crossing an edge?
  for (let i = 0; i < 4; i++) if (segsCross(a, b, corners[i], corners[(i + 1) % 4])) return 0;
  return Math.min(rectPointDist(r, a), rectPointDist(r, b), ...corners.map((c) => segDist(c, a, b)));
}

function segsCross(p1: Pt, p2: Pt, p3: Pt, p4: Pt): boolean {
  const d = (a: Pt, b: Pt, c: Pt) => (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x);
  const d1 = d(p3, p4, p1);
  const d2 = d(p3, p4, p2);
  const d3 = d(p1, p2, p3);
  const d4 = d(p1, p2, p4);
  return d1 * d2 < 0 && d3 * d4 < 0;
}

// ------------------------------------------------------------------ dots

/** Resamples a closed polyline into `n` points spaced evenly along it. */
function resample(pts: Pt[], n: number): Pt[] {
  const ring = [...pts, pts[0]];
  const lens = [0];
  for (let i = 1; i < ring.length; i++) lens.push(lens[i - 1] + dist(ring[i - 1], ring[i]));
  const total = lens[lens.length - 1];
  const out: Pt[] = [];
  let j = 1;
  for (let k = 0; k < n; k++) {
    const s = (k / n) * total;
    while (lens[j] < s) j++;
    const t = (s - lens[j - 1]) / (lens[j] - lens[j - 1] || 1);
    out.push({ x: ring[j - 1].x + t * (ring[j].x - ring[j - 1].x), y: ring[j - 1].y + t * (ring[j].y - ring[j - 1].y) });
  }
  return out;
}

const triArea = (a: Pt, b: Pt, c: Pt) => Math.abs((b.x - a.x) * (c.y - a.y) - (c.x - a.x) * (b.y - a.y)) / 2;

/**
 * Picks `n` dots along a closed outline so that, joined in order, they draw
 * the shape: the outline is resampled finely, then the least important
 * points are dropped one by one (Visvalingam), which keeps the corners
 * (ear tips, fin tips) and spreads the rest along the curves. Then, while two
 * neighbouring dots are closer than `minGap` (both sides of a sharp corner),
 * the less important one goes and a dot is added back in the middle of the
 * longest stretch without dots.
 *
 * Points where `allowed` says no (too close to the drawing's other lines)
 * are never dots.
 *
 * Returns the dots clockwise (on screen), dot 1 the one nearest `start`.
 */
export function pickDots(outline: Poly, n: number, start: Pt, minGap: number, allowed: (q: Pt) => boolean = () => true): Pt[] {
  let pts = resample(outline.pts, Math.max(400, n * 8)).filter(allowed);
  // Clockwise on screen (y down) = positive shoelace sum.
  const area = pts.reduce((s, p, i) => {
    const q = pts[(i + 1) % pts.length];
    return s + (p.x * q.y - q.x * p.y);
  }, 0);
  if (area < 0) pts = pts.reverse();
  const m = pts.length;
  const alive = new Array<boolean>(m).fill(true);
  let count = m;
  const prevOf = (i: number) => {
    let j = i;
    do j = (j - 1 + m) % m;
    while (!alive[j]);
    return j;
  };
  const nextOf = (i: number) => {
    let j = i;
    do j = (j + 1) % m;
    while (!alive[j]);
    return j;
  };
  const weight = (i: number) => triArea(pts[prevOf(i)], pts[i], pts[nextOf(i)]);
  // Simple O(n²) Visvalingam: small inputs (a few hundred points).
  while (count > n) {
    let best = -1;
    let bestArea = Infinity;
    for (let i = 0; i < m; i++) {
      if (!alive[i]) continue;
      const a = weight(i);
      if (a < bestArea) {
        bestArea = a;
        best = i;
      }
    }
    alive[best] = false;
    count--;
  }
  for (let guard = 0; guard < n * 4; guard++) {
    const crowded = pts.map((_, i) => i).find((i) => alive[i] && dist(pts[i], pts[nextOf(i)]) < minGap);
    if (crowded === undefined) break;
    const other = nextOf(crowded);
    alive[weight(crowded) < weight(other) ? crowded : other] = false;
    // The longest stretch (in resampled points) between two dots gets a dot in its middle.
    let from = -1;
    let len = 0;
    for (let i = 0; i < m; i++) {
      if (!alive[i]) continue;
      const l = (nextOf(i) - i + m) % m;
      if (l > len) {
        len = l;
        from = i;
      }
    }
    alive[(from + Math.floor(len / 2)) % m] = true;
  }
  const dots = pts.filter((_, i) => alive[i]);
  let first = 0;
  dots.forEach((d, i) => {
    if (dist(d, start) < dist(dots[first], start)) first = i;
  });
  return [...dots.slice(first), ...dots.slice(0, first)];
}

/** Where a dot's label goes, in the same units as the dots. */
export type Label = { text: string; x: number; y: number; rect: Rect };

export type LabelOptions = {
  /** Label height (cap height of the digits) and width per character. */
  h: number;
  charW: number;
  /** Dot radius (dot 1, the start, is bigger), and the clear space kept around labels. */
  dotR: number;
  startR: number;
  pad: number;
  /** Lines the labels must stay clear of (besides the dot lines). */
  avoid: [Pt, Pt][];
  /** Rectangles the labels must stay inside. */
  bounds: Rect;
};

/**
 * Places the label of every dot next to it, touching nothing: not another
 * dot, not the lines joining the dots, not the drawing's other lines, not
 * another label. Tries 24 directions, preferring the one pointing away from
 * the shape, at growing distances. Throws if a label has nowhere to go.
 */
export function placeLabels(dots: Pt[], texts: string[], o: LabelOptions): Label[] {
  const n = dots.length;
  const lines: [Pt, Pt][] = dots.map((d, i) => [d, dots[(i + 1) % n]]);
  // Dot n joins back to dot 1 only when the outline closes: it does here.
  const blockers = [...lines, ...o.avoid];
  const labels: Label[] = [];
  const cx = dots.reduce((s, d) => s + d.x, 0) / n;
  const cy = dots.reduce((s, d) => s + d.y, 0) / n;
  for (let i = 0; i < n; i++) {
    const d = dots[i];
    const a = dots[(i - 1 + n) % n];
    const b = dots[(i + 1) % n];
    // Outward direction: away from the bisector of the two lines, or from the centre.
    const u1 = norm({ x: d.x - a.x, y: d.y - a.y });
    const u2 = norm({ x: d.x - b.x, y: d.y - b.y });
    let out = norm({ x: u1.x + u2.x, y: u1.y + u2.y });
    if (!isFinite(out.x) || Math.hypot(out.x, out.y) < 0.1) out = norm({ x: d.x - cx, y: d.y - cy });
    const w = texts[i].length * o.charW;
    const h = o.h;
    let placed: Label | null = null;
    const steps = [0, 0.6, 1.3, 2.1, 3];
    for (const extra of steps) {
      let best: { label: Label; score: number } | null = null;
      for (let k = 0; k < 24; k++) {
        const ang = (k / 24) * Math.PI * 2;
        const dir = { x: Math.cos(ang), y: Math.sin(ang) };
        // Distance from the dot centre to the label box edge, along dir.
        const gap = radius(i, o) + o.pad + extra;
        const hx = w / 2;
        const hy = h / 2;
        const t = Math.min(Math.abs(dir.x) > 1e-6 ? hx / Math.abs(dir.x) : Infinity, Math.abs(dir.y) > 1e-6 ? hy / Math.abs(dir.y) : Infinity);
        const c = { x: d.x + dir.x * (gap + t), y: d.y + dir.y * (gap + t) };
        const rect = { x0: c.x - hx, y0: c.y - hy, x1: c.x + hx, y1: c.y + hy };
        if (!fits(rect, o, dots, blockers, labels)) continue;
        const score = -(dir.x * out.x + dir.y * out.y);
        if (!best || score < best.score) best = { label: { text: texts[i], x: c.x, y: c.y, rect }, score };
      }
      if (best) {
        placed = best.label;
        break;
      }
    }
    if (!placed) throw new Error(`No room for label ${texts[i]} at ${d.x.toFixed(1)},${d.y.toFixed(1)}`);
    labels.push(placed);
  }
  return labels;
}

const radius = (i: number, o: LabelOptions) => (i === 0 ? o.startR : o.dotR);

function norm(v: Pt): Pt {
  const l = Math.hypot(v.x, v.y);
  return { x: v.x / l, y: v.y / l };
}

function fits(rect: Rect, o: LabelOptions, dots: Pt[], blockers: [Pt, Pt][], labels: Label[]): boolean {
  const b = o.bounds;
  if (rect.x0 < b.x0 || rect.y0 < b.y0 || rect.x1 > b.x1 || rect.y1 > b.y1) return false;
  for (const [i, d] of dots.entries()) if (rectPointDist(rect, d) < radius(i, o) + o.pad) return false;
  for (const [a, c] of blockers) if (rectSegDist(rect, a, c) < o.pad) return false;
  const grown = { x0: rect.x0 - o.pad, y0: rect.y0 - o.pad, x1: rect.x1 + o.pad, y1: rect.y1 + o.pad };
  for (const l of labels) if (overlaps(grown, l.rect)) return false;
  return true;
}

/** Checks a finished dot-to-dot layout: returns the problems found (none = good). */
export function checkDots(dots: Pt[], labels: Label[], o: LabelOptions): string[] {
  const problems: string[] = [];
  const n = dots.length;
  const lines: [Pt, Pt][] = dots.map((d, i) => [d, dots[(i + 1) % n]]);
  labels.forEach((l, i) => {
    const others = labels.filter((_, j) => j !== i);
    if (!fits(l.rect, { ...o, pad: o.pad * 0.99 }, dots, [...lines, ...o.avoid], others)) problems.push(`label ${l.text} touches something`);
  });
  dots.forEach((d, i) => {
    dots.forEach((e, j) => {
      if (j > i && dist(d, e) < radius(i, o) + radius(j, o) + o.pad) problems.push(`dots ${i + 1} and ${j + 1} touch`);
    });
    for (const [a, b] of o.avoid) if (segDist(d, a, b) < radius(i, o) + o.pad / 2) problems.push(`dot ${i + 1} touches a line of the drawing`);
    // A line between two dots passing over a third dot.
    lines.forEach(([a, b], k) => {
      if (k !== i && (k + 1) % n !== i && segDist(d, a, b) < radius(i, o) + o.pad / 2) problems.push(`line ${k + 1}→${((k + 1) % n) + 1} crosses dot ${i + 1}`);
    });
  });
  return problems;
}

// ------------------------------------------------------------------ regions

/** One colouring region: its shape, and the shape it's clipped to (if any). */
export type RegionShape = { polys: Poly[]; clip?: Poly[] };

export type RegionSpot = {
  /** Index in the painting order. */
  region: number;
  /** The widest point of one visible piece of the region, and how far its edge is. */
  x: number;
  y: number;
  r: number;
  /** The piece's area, in square units. */
  area: number;
};

/**
 * Finds where to write each region's number: rasterises the picture on a
 * grid (later regions paint over earlier ones; `blocked` lines and shapes,
 * such as eyes, are kept clear), splits each region into its visible
 * pieces, and returns the point of each piece farthest from its edges.
 */
export function regionSpots(regions: RegionShape[], blocked: { polys: Poly[]; filled: boolean; halfWidth: number }[], box: Rect, cell = 0.5): RegionSpot[] {
  const W = Math.ceil((box.x1 - box.x0) / cell);
  const H = Math.ceil((box.y1 - box.y0) / cell);
  const grid = new Int16Array(W * H).fill(-1);
  const at = (gx: number, gy: number): Pt => ({ x: box.x0 + (gx + 0.5) * cell, y: box.y0 + (gy + 0.5) * cell });
  const blockSegs = blocked.map((b) => {
    const r = bbox(b.polys);
    return { ...b, segs: segments(b.polys), near: { x0: r.x0 - b.halfWidth, y0: r.y0 - b.halfWidth, x1: r.x1 + b.halfWidth, y1: r.y1 + b.halfWidth } };
  });
  // Bounding boxes first: most cells are far from most shapes.
  const boxes = regions.map((r) => bbox(r.polys));
  const inBox = (q: Pt, b: Rect) => q.x >= b.x0 && q.x <= b.x1 && q.y >= b.y0 && q.y <= b.y1;
  for (let gy = 0; gy < H; gy++) {
    for (let gx = 0; gx < W; gx++) {
      const q = at(gx, gy);
      let id = -1;
      for (let r = regions.length - 1; r >= 0; r--) {
        const reg = regions[r];
        if (inBox(q, boxes[r]) && inside(reg.polys, q) && (!reg.clip || inside(reg.clip, q))) {
          id = r;
          break;
        }
      }
      if (id >= 0) {
        for (const b of blockSegs) {
          if (!inBox(q, b.near)) continue;
          if ((b.filled && inside(b.polys, q)) || b.segs.some(([a, c]) => segDist(q, a, c) < b.halfWidth)) {
            id = -2;
            break;
          }
        }
      }
      grid[gy * W + gx] = id;
    }
  }
  // Distance (in cells) to the nearest cell of another id: two-pass chamfer.
  const D = new Float32Array(W * H);
  const BIG = 1e6;
  for (let i = 0; i < W * H; i++) D[i] = grid[i] < 0 ? 0 : BIG;
  const same = (i: number, j: number) => grid[i] === grid[j];
  const relax = (i: number, gx: number, gy: number, dx: number, dy: number, w: number) => {
    const x = gx + dx;
    const y = gy + dy;
    if (x < 0 || y < 0 || x >= W || y >= H) {
      D[i] = Math.min(D[i], w / 2);
      return;
    }
    const j = y * W + x;
    D[i] = Math.min(D[i], same(i, j) ? D[j] + w : w / 2);
  };
  for (let gy = 0; gy < H; gy++)
    for (let gx = 0; gx < W; gx++) {
      const i = gy * W + gx;
      if (!D[i]) continue;
      relax(i, gx, gy, -1, 0, 1);
      relax(i, gx, gy, 0, -1, 1);
      relax(i, gx, gy, -1, -1, Math.SQRT2);
      relax(i, gx, gy, 1, -1, Math.SQRT2);
    }
  for (let gy = H - 1; gy >= 0; gy--)
    for (let gx = W - 1; gx >= 0; gx--) {
      const i = gy * W + gx;
      if (!D[i]) continue;
      relax(i, gx, gy, 1, 0, 1);
      relax(i, gx, gy, 0, 1, 1);
      relax(i, gx, gy, 1, 1, Math.SQRT2);
      relax(i, gx, gy, -1, 1, Math.SQRT2);
    }
  // Connected pieces of each region (8-neighbours, so a sharp tip stays one piece).
  const seen = new Uint8Array(W * H);
  const spots: RegionSpot[] = [];
  for (let s = 0; s < W * H; s++) {
    if (grid[s] < 0 || seen[s]) continue;
    const id = grid[s];
    const stack = [s];
    seen[s] = 1;
    let best = s;
    let count = 0;
    while (stack.length) {
      const i = stack.pop()!;
      count++;
      if (D[i] > D[best]) best = i;
      const gx = i % W;
      const gy = (i - gx) / W;
      for (const [dx, dy] of [
        [1, 0],
        [-1, 0],
        [0, 1],
        [0, -1],
        [1, 1],
        [1, -1],
        [-1, 1],
        [-1, -1],
      ]) {
        const x = gx + dx;
        const y = gy + dy;
        if (x < 0 || y < 0 || x >= W || y >= H) continue;
        const j = y * W + x;
        if (!seen[j] && grid[j] === id) {
          seen[j] = 1;
          stack.push(j);
        }
      }
    }
    const bx = best % W;
    const q = at(bx, (best - bx) / W);
    spots.push({ region: id, x: q.x, y: q.y, r: D[best] * cell, area: count * cell * cell });
  }
  return spots;
}
