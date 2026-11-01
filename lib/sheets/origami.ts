// A small paper-folding model for the origami sheets (data/worksheets/origami.ts,
// scripts/sheets/origami-layout.ts). The paper is a stack of flat convex
// pieces, bottom to top, each showing its coloured or its white side. A fold
// cuts the pieces it moves along the fold line, reflects the moving parts
// across it and turns them over, so every step's drawing is the previous
// step's paper really folded: the steps can't contradict each other.
//
// Coordinates are in "paper units", y up: a square sheet set as a diamond has
// its corners at (0, 1), (1, 0), (0, -1) and (-1, 0).

export type Pt = { x: number; y: number };
export type Face = "colour" | "white";
export type Piece = { pts: Pt[]; face: Face; creases: [Pt, Pt][] };
/** The pieces, bottom to top. */
export type Paper = Piece[];

export type Fold = {
  /** Two points of the fold line. */
  line: [Pt, Pt];
  /** A point on the side that moves. */
  from: Pt;
  /** Fold every layer (default), or only the top piece at `at` (the front flap). */
  layers?: "all" | "top";
  /** A point inside the top piece, for `layers: "top"` (default: `from`). */
  at?: Pt;
  /** A mountain fold: the part goes behind instead of towards you. */
  behind?: boolean;
  /** Fold and unfold: the paper only gets a crease. */
  unfold?: boolean;
};

const EPS = 1e-9;

export const pt = (x: number, y: number): Pt => ({ x, y });

/** The diamond: a square sheet with a corner at the top, white side up. */
export function diamond(): Paper {
  return [{ pts: [pt(0, 1), pt(-1, 0), pt(0, -1), pt(1, 0)], face: "white", creases: [] }];
}

/** > 0 on the left of a→b, < 0 on the right. */
const side = (a: Pt, b: Pt, p: Pt) => (b.x - a.x) * (p.y - a.y) - (b.y - a.y) * (p.x - a.x);

export function reflect(p: Pt, [a, b]: [Pt, Pt]): Pt {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const t = ((p.x - a.x) * dx + (p.y - a.y) * dy) / (dx * dx + dy * dy);
  const fx = a.x + t * dx;
  const fy = a.y + t * dy;
  return { x: 2 * fx - p.x, y: 2 * fy - p.y };
}

/** The part of a convex polygon on one side of the line (sign 1: left, -1: right). */
export function clip(pts: Pt[], [a, b]: [Pt, Pt], sign: number): Pt[] {
  const out: Pt[] = [];
  for (let i = 0; i < pts.length; i++) {
    const p = pts[i];
    const q = pts[(i + 1) % pts.length];
    const sp = sign * side(a, b, p);
    const sq = sign * side(a, b, q);
    if (sp >= -EPS) out.push(p);
    if ((sp > EPS && sq < -EPS) || (sp < -EPS && sq > EPS)) {
      const t = sp / (sp - sq);
      out.push({ x: p.x + t * (q.x - p.x), y: p.y + t * (q.y - p.y) });
    }
  }
  return area(out) > 1e-6 ? out : [];
}

function clipSegment([p, q]: [Pt, Pt], line: [Pt, Pt], sign: number): [Pt, Pt] | null {
  const sp = sign * side(line[0], line[1], p);
  const sq = sign * side(line[0], line[1], q);
  if (sp < -EPS && sq < -EPS) return null;
  if (sp >= -EPS && sq >= -EPS) return [p, q];
  const t = sp / (sp - sq);
  const m = { x: p.x + t * (q.x - p.x), y: p.y + t * (q.y - p.y) };
  return sp >= -EPS ? [p, m] : [m, q];
}

export function area(pts: Pt[]): number {
  let s = 0;
  for (let i = 0; i < pts.length; i++) {
    const p = pts[i];
    const q = pts[(i + 1) % pts.length];
    s += p.x * q.y - q.x * p.y;
  }
  return Math.abs(s) / 2;
}

export function centroid(pts: Pt[]): Pt {
  let a = 0;
  let cx = 0;
  let cy = 0;
  for (let i = 0; i < pts.length; i++) {
    const p = pts[i];
    const q = pts[(i + 1) % pts.length];
    const c = p.x * q.y - q.x * p.y;
    a += c;
    cx += (p.x + q.x) * c;
    cy += (p.y + q.y) * c;
  }
  return { x: cx / (3 * a), y: cy / (3 * a) };
}

/** True if p is inside the convex polygon (not on its edge). */
export function contains(pts: Pt[], p: Pt): boolean {
  let sign = 0;
  for (let i = 0; i < pts.length; i++) {
    const s = side(pts[i], pts[(i + 1) % pts.length], p);
    if (Math.abs(s) < EPS) return false;
    if (sign === 0) sign = Math.sign(s);
    else if (Math.sign(s) !== sign) return false;
  }
  return true;
}

/** Where the line crosses a convex polygon, or null if it misses it. */
export function lineThrough(pts: Pt[], [a, b]: [Pt, Pt]): [Pt, Pt] | null {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const ts: number[] = [];
  for (let i = 0; i < pts.length; i++) {
    const p = pts[i];
    const q = pts[(i + 1) % pts.length];
    const sp = side(a, b, p);
    const sq = side(a, b, q);
    if ((sp <= EPS && sq >= -EPS) || (sp >= -EPS && sq <= EPS)) {
      const t = Math.abs(sp - sq) < EPS ? 0 : sp / (sp - sq);
      const x = p.x + t * (q.x - p.x);
      const y = p.y + t * (q.y - p.y);
      ts.push(((x - a.x) * dx + (y - a.y) * dy) / (dx * dx + dy * dy));
    }
  }
  if (ts.length < 2) return null;
  const t0 = Math.min(...ts);
  const t1 = Math.max(...ts);
  if (t1 - t0 < 1e-6) return null;
  return [
    { x: a.x + t0 * dx, y: a.y + t0 * dy },
    { x: a.x + t1 * dx, y: a.y + t1 * dy },
  ];
}

/** The convex hull of points (for the outline of the whole paper). */
export function hull(points: Pt[]): Pt[] {
  const ps = [...points].sort((p, q) => p.x - q.x || p.y - q.y);
  const half = (list: Pt[]) => {
    const h: Pt[] = [];
    for (const p of list) {
      while (h.length >= 2 && side(h[h.length - 2], h[h.length - 1], p) <= EPS) h.pop();
      h.push(p);
    }
    return h.slice(0, -1);
  };
  return [...half(ps), ...half([...ps].reverse())];
}

/** The pieces a fold moves: all of them, or the top one at the fold's point. */
function chosen(paper: Paper, f: Fold): Set<Piece> {
  if (f.layers !== "top") return new Set(paper);
  const at = f.at ?? f.from;
  const top = [...paper].reverse().find((p) => contains(p.pts, at));
  if (!top) throw new Error(`No paper at (${at.x}, ${at.y})`);
  return new Set([top]);
}

/** The parts of the paper that move, before they move (for the arrow). */
export function movingParts(paper: Paper, f: Fold): Pt[][] {
  const sign = Math.sign(side(f.line[0], f.line[1], f.from));
  const sel = chosen(paper, f);
  return paper.filter((p) => sel.has(p)).map((p) => clip(p.pts, f.line, sign)).filter((pts) => pts.length);
}

const flip = (face: Face): Face => (face === "colour" ? "white" : "colour");

export function fold(paper: Paper, f: Fold): Paper {
  const sign = Math.sign(side(f.line[0], f.line[1], f.from));
  if (!sign) throw new Error("The fold's `from` point is on its line");
  const sel = chosen(paper, f);
  if (f.unfold) {
    return paper.map((p) => {
      const crease = sel.has(p) ? lineThrough(p.pts, f.line) : null;
      return crease ? { ...p, creases: [...p.creases, crease] } : p;
    });
  }
  const kept: Paper = [];
  const moved: Paper = [];
  for (const p of paper) {
    if (!sel.has(p)) {
      kept.push(p);
      continue;
    }
    const stay = clip(p.pts, f.line, -sign);
    const go = clip(p.pts, f.line, sign);
    if (stay.length) {
      kept.push({ pts: stay, face: p.face, creases: p.creases.flatMap((c) => {
          const s = clipSegment(c, f.line, -sign);
          return s ? [s] : [];
        }) });
    }
    if (go.length) {
      moved.push({
        pts: go.map((q) => reflect(q, f.line)).reverse(),
        face: flip(p.face),
        creases: p.creases.flatMap((c) => {
          const s = clipSegment(c, f.line, sign);
          return s ? [[reflect(s[0], f.line), reflect(s[1], f.line)] as [Pt, Pt]] : [];
        }),
      });
    }
  }
  // Turning a stack over reverses its order: its top layer lands lowest.
  moved.reverse();
  return f.behind ? [...moved, ...kept] : [...kept, ...moved];
}

/** Turns the paper over, left to right. */
export function turnOver(paper: Paper): Paper {
  const m = (p: Pt) => ({ x: -p.x, y: p.y });
  return [...paper].reverse().map((p) => ({
    pts: p.pts.map(m).reverse(),
    face: flip(p.face),
    creases: p.creases.map(([a, b]) => [m(a), m(b)] as [Pt, Pt]),
  }));
}

/** The outline of the folded paper (its convex hull). */
export function outline(paper: Paper): Pt[] {
  return hull(paper.flatMap((p) => p.pts));
}
