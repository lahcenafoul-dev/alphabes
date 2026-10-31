// The maze sheets (lib/sheets/maze.ts, scripts/sheets/maze-layout.ts): every
// maze is one connected tree (so exactly one path from the start to the
// goal), the same on every run, and printed with walls and paths wide enough
// for a pencil, on Letter (English) and A4 (the other languages).
import { describe, expect, it } from "vitest";
import { mazesSheets } from "@/data/worksheets/mazes";
import { isOpen, neighbours, solve, walls, type Cell } from "@/lib/sheets/maze";
import { mazeGeometry, mazeMetrics, sheetMaze } from "@/scripts/sheets/maze-layout";
import { bodyBox } from "@/scripts/sheets/chrome";

const cellsOf = (cells: boolean[][]): Cell[] => cells.flatMap((row, r) => row.flatMap((v, c) => (v ? [{ c, r }] : [])));

describe("mazes", () => {
  it("are perfect: every cell reached, with one fewer passage than cells", () => {
    for (const sheet of mazesSheets) {
      const m = sheetMaze(sheet);
      const all = cellsOf(m.cells);
      // Passages only join neighbouring maze cells.
      let passages = 0;
      for (const p of all) for (const q of neighbours(m, p)) if (isOpen(m, p, q)) passages++;
      expect(passages / 2, sheet.id).toBe(all.length - 1);
      expect(m.open.size, sheet.id).toBe(all.length - 1);
      // Connected: a search from the start reaches every cell.
      const seen = new Set([`${m.start.c},${m.start.r}`]);
      const stack = [m.start];
      while (stack.length) {
        const p = stack.pop()!;
        for (const q of neighbours(m, p))
          if (isOpen(m, p, q) && !seen.has(`${q.c},${q.r}`)) {
            seen.add(`${q.c},${q.r}`);
            stack.push(q);
          }
      }
      expect(seen.size, sheet.id).toBe(all.length);
    }
  });

  it("have a path from the start to the goal, through open passages", () => {
    for (const sheet of mazesSheets) {
      const m = sheetMaze(sheet);
      const path = solve(m);
      expect(path[0], sheet.id).toEqual(m.start);
      expect(path[path.length - 1], sheet.id).toEqual(m.goal);
      for (let i = 1; i < path.length; i++) expect(isOpen(m, path[i - 1], path[i]), sheet.id).toBe(true);
    }
  });

  it("are big enough for their level and stay the same", () => {
    for (const sheet of mazesSheets) {
      const m = sheetMaze(sheet);
      const n = cellsOf(m.cells).length;
      const min = { easy: 20, medium: 50, hard: 110 }[sheet.params.level];
      expect(n, sheet.id).toBeGreaterThanOrEqual(min);
      expect(walls(sheetMaze(sheet)), sheet.id).toEqual(walls(m));
    }
  });

  for (const page of ["letter", "a4"] as const)
    it(`print walls of at least 0.9 mm and paths of at least 5 mm (${page})`, () => {
      for (const sheet of mazesSheets) {
        const { cell } = mazeGeometry(sheet, bodyBox(page));
        const { wall, path } = mazeMetrics(cell);
        expect(wall, sheet.id).toBeGreaterThanOrEqual(0.9);
        expect(path, sheet.id).toBeGreaterThanOrEqual(5);
      }
    });
});
