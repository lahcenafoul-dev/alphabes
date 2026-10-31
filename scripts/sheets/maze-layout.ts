// The maze sheets (data/worksheets/mazes.ts): the maze (lib/sheets/maze.ts)
// as an SVG, in mm, with the start cartoon on the left and the goal on the
// right, each next to its opening; shaped mazes sit in their outline, tinted
// in the shape's colour. Page 2 is the same maze with the path drawn in.
import { mazeActor, mazeColour, mazeOutline, type MazesSheet } from "../../data/worksheets/mazes";
import { makeMaze, shapeCells, shapeFrame, solve, walls, type Maze } from "../../lib/sheets/maze";
import type { SheetLocale } from "../../lib/sheets/types";
import { picturePrint } from "../picture-emoji";
import { INK, type SheetPart } from "./chrome";

type Box = { w: number; h: number };

const r2 = (n: number) => Math.round(n * 100) / 100;

export const MAZE_CSS = `
.mz { position: relative }
.mz-pic { position: absolute; line-height: 0; transform: translate(-50%, -50%) }
`;

/** The cartoons' size and the room kept for them on each side, in mm. */
const PIC = 21;
const SIDE = 25;

/** Every maze of the sheets, built once (the tests use it too). */
export function sheetMaze(sheet: MazesSheet): Maze {
  const { shape, cols } = sheet.params;
  return makeMaze(shapeCells(cols, mazeOutline(shape)), sheet.id);
}

/** Wall and path sizes for a cell size, in mm (the tests check them). */
export function mazeMetrics(cell: number): { wall: number; path: number } {
  const wall = Math.min(1.6, Math.max(0.9, cell * 0.11));
  return { wall, path: cell - wall };
}

/** The maze's place on the page: the cell size and the grid's top-left corner, in mm. */
export function mazeGeometry(sheet: MazesSheet, box: Box) {
  const m = sheetMaze(sheet);
  const outline = mazeOutline(sheet.params.shape);
  const W = box.w - 2 * SIDE;
  const H = box.h - 8;
  if (!outline) {
    // A square maze's openings are on its sides: room for each cartoon and a 7 mm arrow.
    const cell = Math.min((box.w - 2 * (PIC + 8)) / m.cols, H / m.rows);
    return { m, cell, gx: (box.w - cell * m.cols) / 2, gy: (box.h - cell * m.rows) / 2, outline, scale: 0, ox: 0, oy: 0 };
  }
  // The drawing's 0–100 box, scaled so the outline (3 mm stroke) fits.
  const f = shapeFrame(m.cols, outline);
  const top = Math.min(f.y, 0);
  const spanY = Math.max(f.y + f.rows * f.size, 100) - top;
  const scale = Math.min((W - 4) / 100, (H - 4) / spanY);
  const ox = (box.w - 100 * scale) / 2;
  const oy = (box.h - spanY * scale) / 2 - top * scale;
  return { m, cell: f.size * scale, gx: ox + f.x * scale, gy: oy + f.y * scale, outline, scale, ox, oy };
}

function mazeSvg(sheet: MazesSheet, box: Box, solved: boolean): string {
  const { m, cell, gx, gy, outline, scale, ox, oy } = mazeGeometry(sheet, box);
  const colour = mazeColour(sheet.params.shape);
  const { wall } = mazeMetrics(cell);
  const X = (c: number) => r2(gx + c * cell);
  const Y = (r: number) => r2(gy + r * cell);
  const parts: string[] = [];
  // The shape, tinted, then the maze's cells in white.
  if (outline) {
    parts.push(`<path d="${outline}" transform="translate(${r2(ox)} ${r2(oy)}) scale(${r2(scale)})" fill="${colour}22" stroke="${colour}" stroke-width="${r2(2.4 / scale)}" stroke-linejoin="round"/>`);
  } else {
    parts.push(`<rect x="${X(0) - 3}" y="${Y(0) - 3}" width="${r2(cell * m.cols + 6)}" height="${r2(cell * m.rows + 6)}" rx="4" fill="${colour}22" stroke="${colour}" stroke-width="1.2"/>`);
  }
  const white = m.cells.flatMap((row, r) => row.flatMap((v, c) => (v ? [`M${X(c)} ${Y(r)}h${r2(cell)}v${r2(cell)}h${r2(-cell)}z`] : []))).join("");
  parts.push(`<path d="${white}" fill="#fff" stroke="#fff" stroke-width="0.3"/>`);

  // Openings: a short corridor out of the maze to each cartoon.
  const sy = Y(m.start.r + 0.5);
  const ty = Y(m.goal.r + 0.5);
  const startX = X(m.start.c);
  const goalX = X(m.goal.c + 1);
  // The cartoons stay at least 7 mm from their opening, so the arrows show.
  const picL = Math.min(SIDE / 2 - 1, startX - PIC / 2 - 7);
  const picR = Math.max(box.w - SIDE / 2 + 1, goalX + PIC / 2 + 7);
  const arrow = (x0: number, x1: number, y: number) =>
    `<path d="M${r2(x0)} ${y}H${r2(x1 - 2.2)}" stroke="#FF5C93" stroke-width="1.4" stroke-linecap="round" stroke-dasharray="0.1 2.4"/><path d="M${r2(x1 - 2.6)} ${r2(y - 1.8)}L${r2(x1)} ${y}L${r2(x1 - 2.6)} ${r2(y + 1.8)}" fill="none" stroke="#FF5C93" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"/>`;
  parts.push(arrow(picL + PIC / 2 - 1, startX - 0.8, sy));
  parts.push(arrow(goalX + 0.8, picR - PIC / 2 + 1, ty));

  if (solved) {
    const path = solve(m);
    const pts = [`${r2(startX - cell * 0.5)} ${sy}`, ...path.map((p) => `${X(p.c + 0.5)} ${Y(p.r + 0.5)}`), `${r2(goalX + cell * 0.5)} ${ty}`];
    parts.push(`<path d="M${pts.join("L")}" fill="none" stroke="#FF5C93" stroke-width="${r2(Math.min(3, cell * 0.32))}" stroke-linecap="round" stroke-linejoin="round" opacity="0.85"/>`);
  }

  const lines = walls(m)
    .map(([x0, y0, x1, y1]) => `M${X(x0)} ${Y(y0)}L${X(x1)} ${Y(y1)}`)
    .join("");
  parts.push(`<path d="${lines}" fill="none" stroke="${INK}" stroke-width="${r2(wall)}" stroke-linecap="round"/>`);

  const pic = (key: string, x: number, y: number) => `<div class="mz-pic" style="left:${r2(x)}mm;top:${r2(y)}mm;font-size:${PIC}mm">${picturePrint(key)}</div>`;
  return `<div class="mz" style="width:${box.w}mm;height:${box.h}mm"><svg width="${box.w}mm" height="${box.h}mm" viewBox="0 0 ${box.w} ${box.h}" aria-hidden="true">${parts.join("")}</svg>${pic(sheet.params.from, picL, sy)}${pic(sheet.params.to, picR, ty)}</div>`;
}

const SOLUTION: Record<SheetLocale, string> = { en: "Solution", fr: "Solution", es: "Solución", pt: "Solução" };

export function mazesBody(sheet: MazesSheet, locale: SheetLocale, box: Box): SheetPart[] {
  const from = mazeActor(sheet.params.from).the[locale];
  const to = mazeActor(sheet.params.to).the[locale];
  // French "de le" → "du", "à le" → "au"; Portuguese "de o" → "do", "de a" → "da".
  const deFr = from.startsWith("le ") ? `du ${from.slice(3)}` : `de ${from}`;
  const aFr = to.startsWith("le ") ? `jusqu'au ${to.slice(3)}` : `jusqu'à ${to}`;
  const path: Record<SheetLocale, string> = {
    en: `The path from ${from} to ${to}.`,
    fr: `Le chemin ${deFr} ${aFr}.`,
    es: `El camino desde ${from} hasta ${to}.`,
    pt: `O caminho d${from} até ${to}.`,
  };
  return [
    { body: mazeSvg(sheet, box, false) },
    { body: mazeSvg(sheet, box, true), title: `${SOLUTION[locale]}${locale === "fr" ? " : " : ": "}${sheet.title[locale]}`, instruction: path[locale] },
  ];
}
