// The mazes of the maze sheets (data/worksheets/mazes.ts): a grid of cells,
// clipped to a shape for the shaped mazes, carved into a perfect maze (one
// path between any two cells) by a seeded depth-first search, so a sheet is
// the same on every run. Plain TypeScript, so the tests can check every maze
// without a browser.
import { bbox, flatten, inside } from "./geometry";
import { seededRandom } from "./types";

export type Cell = { c: number; r: number };
export type Side = "left" | "right" | "top" | "bottom";

export type Maze = {
  cols: number;
  rows: number;
  /** cells[r][c]: part of the maze. */
  cells: boolean[][];
  /** Passages, as "c,r|c,r" keys (smaller cell first). */
  open: Set<string>;
  start: Cell;
  goal: Cell;
  /** The outer side left open at the start and at the goal. */
  startSide: Side;
  goalSide: Side;
};

const key = (a: Cell, b: Cell) => {
  const [p, q] = a.r < b.r || (a.r === b.r && a.c < b.c) ? [a, b] : [b, a];
  return `${p.c},${p.r}|${q.c},${q.r}`;
};

export const isOpen = (m: Maze, a: Cell, b: Cell) => m.open.has(key(a, b));
export const inMaze = (m: Maze, c: number, r: number) => r >= 0 && r < m.rows && c >= 0 && c < m.cols && m.cells[r][c];

export function neighbours(m: Maze, { c, r }: Cell): Cell[] {
  return [
    { c: c - 1, r },
    { c: c + 1, r },
    { c, r: r - 1 },
    { c, r: r + 1 },
  ].filter((n) => inMaze(m, n.c, n.r));
}

/**
 * The cells of a `cols`-wide grid laid over an outline (an SVG path) that lie
 * wholly inside it, keeping the largest connected group. Without an outline,
 * every cell of a cols × rows grid.
 */
export function shapeCells(cols: number, outline?: string, rows = cols): boolean[][] {
  if (!outline) return Array.from({ length: rows }, () => Array(cols).fill(true));
  const polys = flatten(outline);
  const b = bbox(polys);
  const size = (b.x1 - b.x0) / cols;
  const n = Math.round((b.y1 - b.y0) / size);
  const y0 = (b.y0 + b.y1) / 2 - (n * size) / 2;
  const at = (c: number, r: number) => ({ x: b.x0 + c * size, y: y0 + r * size });
  const grid = Array.from({ length: n }, (_, r) =>
    Array.from({ length: cols }, (_, c) => {
      // The four corners and the middle.
      const pts = [at(c, r), at(c + 1, r), at(c, r + 1), at(c + 1, r + 1), at(c + 0.5, r + 0.5)];
      return pts.every((q) => inside(polys, q));
    }),
  );
  // Keep the largest 4-connected group.
  const seen = grid.map((row) => row.map(() => -1));
  const sizes: number[] = [];
  for (let r = 0; r < n; r++)
    for (let c = 0; c < cols; c++) {
      if (!grid[r][c] || seen[r][c] >= 0) continue;
      const id = sizes.length;
      let count = 0;
      const stack = [{ c, r }];
      seen[r][c] = id;
      while (stack.length) {
        const p = stack.pop()!;
        count++;
        for (const q of [
          { c: p.c - 1, r: p.r },
          { c: p.c + 1, r: p.r },
          { c: p.c, r: p.r - 1 },
          { c: p.c, r: p.r + 1 },
        ])
          if (q.r >= 0 && q.r < n && q.c >= 0 && q.c < cols && grid[q.r][q.c] && seen[q.r][q.c] < 0) {
            seen[q.r][q.c] = id;
            stack.push(q);
          }
      }
      sizes.push(count);
    }
  const best = sizes.indexOf(Math.max(...sizes));
  return grid.map((row, r) => row.map((v, c) => v && seen[r][c] === best));
}

/** Where the grid sits over the outline's 0–100 drawing: its top-left corner and cell size. */
export function shapeFrame(cols: number, outline: string): { x: number; y: number; size: number; rows: number } {
  const b = bbox(flatten(outline));
  const size = (b.x1 - b.x0) / cols;
  const rows = Math.round((b.y1 - b.y0) / size);
  return { x: b.x0, y: (b.y0 + b.y1) / 2 - (rows * size) / 2, size, rows };
}

/**
 * The start is the left-most cell (the lowest of them, on its left side),
 * the goal the right-most (the highest, on its right side); a square maze
 * starts at the top left and ends at the bottom right.
 */
function ends(cells: boolean[][]): { start: Cell; goal: Cell } {
  const all = cells.flatMap((row, r) => row.flatMap((v, c) => (v ? [{ c, r }] : [])));
  const minC = Math.min(...all.map((p) => p.c));
  const maxC = Math.max(...all.map((p) => p.c));
  const left = all.filter((p) => p.c === minC);
  const right = all.filter((p) => p.c === maxC);
  const square = all.length === cells.length * cells[0].length;
  return {
    start: square ? left[0] : left[Math.floor((left.length - 1) / 2)],
    goal: square ? right[right.length - 1] : right[Math.floor(right.length / 2)],
  };
}

export function makeMaze(cells: boolean[][], seed: string): Maze {
  const rows = cells.length;
  const cols = cells[0].length;
  const { start, goal } = ends(cells);
  const m: Maze = { cols, rows, cells, open: new Set(), start, goal, startSide: "left", goalSide: "right" };
  const rand = seededRandom(seed);
  // Depth-first search from the start: a spanning tree of the cells.
  const seen = new Set([`${start.c},${start.r}`]);
  const stack: Cell[] = [start];
  while (stack.length) {
    const p = stack[stack.length - 1];
    const next = neighbours(m, p).filter((q) => !seen.has(`${q.c},${q.r}`));
    if (!next.length) {
      stack.pop();
      continue;
    }
    const q = next[Math.floor(rand() * next.length)];
    m.open.add(key(p, q));
    seen.add(`${q.c},${q.r}`);
    stack.push(q);
  }
  return m;
}

/** The only path from the start to the goal, cell by cell. */
export function solve(m: Maze): Cell[] {
  const prev = new Map<string, Cell | null>([[`${m.start.c},${m.start.r}`, null]]);
  const queue: Cell[] = [m.start];
  while (queue.length) {
    const p = queue.shift()!;
    if (p.c === m.goal.c && p.r === m.goal.r) break;
    for (const q of neighbours(m, p))
      if (isOpen(m, p, q) && !prev.has(`${q.c},${q.r}`)) {
        prev.set(`${q.c},${q.r}`, p);
        queue.push(q);
      }
  }
  const path: Cell[] = [];
  for (let p: Cell | null | undefined = m.goal; p; p = prev.get(`${p.c},${p.r}`)) path.unshift(p);
  return path;
}

/** The maze's walls, in cell units: [x0, y0, x1, y1], merged into long straight lines. */
export function walls(m: Maze): [number, number, number, number][] {
  const h: [number, number, number][] = []; // y, x0, x1
  const v: [number, number, number][] = []; // x, y0, y1
  const gapAt = (cell: Cell, side: Side) =>
    (m.start.c === cell.c && m.start.r === cell.r && m.startSide === side) || (m.goal.c === cell.c && m.goal.r === cell.r && m.goalSide === side);
  for (let r = 0; r < m.rows; r++)
    for (let c = 0; c < m.cols; c++) {
      if (!m.cells[r][c]) continue;
      const p = { c, r };
      // Top and left of every cell; bottom and right only on the outside.
      if (!inMaze(m, c, r - 1) ? !gapAt(p, "top") : !isOpen(m, p, { c, r: r - 1 })) h.push([r, c, c + 1]);
      if (!inMaze(m, c, r + 1) && !gapAt(p, "bottom")) h.push([r + 1, c, c + 1]);
      if (!inMaze(m, c - 1, r) ? !gapAt(p, "left") : !isOpen(m, p, { c: c - 1, r })) v.push([c, r, r + 1]);
      if (!inMaze(m, c + 1, r) && !gapAt(p, "right")) v.push([c + 1, r, r + 1]);
    }
  const merge = (list: [number, number, number][]) => {
    list.sort((a, b) => a[0] - b[0] || a[1] - b[1]);
    const out: [number, number, number][] = [];
    for (const s of list) {
      const last = out[out.length - 1];
      if (last && last[0] === s[0] && last[2] === s[1]) last[2] = s[2];
      else out.push([...s]);
    }
    return out;
  };
  return [...merge(h).map(([y, x0, x1]) => [x0, y, x1, y] as [number, number, number, number]), ...merge(v).map(([x, y0, y1]) => [x, y0, x, y1] as [number, number, number, number])];
}
