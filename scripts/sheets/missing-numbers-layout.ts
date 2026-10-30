// The exercise of a missing numbers sheet (data/worksheets/missing-numbers.ts),
// sized to the page's body box (scripts/sheets/chrome.ts). Six layouts:
// picture grid, caterpillar/snake path, hundred chart, train, skip counting,
// and before/after/between. Empty boxes have a purple border; printed numbers
// sit on a light fill.
import type { MissingNumbersSheet } from "../../data/worksheets/missing-numbers";
import type { SheetLocale } from "../../lib/sheets/types";
import { picturePrint, pictureSrc } from "../picture-emoji";
import { BRIGHT, INK, PURPLE, SOFT } from "./chrome";

type Box = { w: number; h: number };

const r1 = (n: number) => Math.round(n * 10) / 10;

/** A number box (or an empty one), w × h mm; the font fits the digits. */
function nb(n: number | null, w: number, h: number, extra = ""): string {
  const digits = n === null ? 2 : String(n).length;
  const size = r1(Math.min(h * 0.64, (w - 2) / (digits * 0.56)));
  return `<div class="nb${n === null ? " blank" : ""}" style="width:${r1(w)}mm;height:${r1(h)}mm;font-size:${size}mm;${extra}">${n ?? ""}</div>`;
}

/** A cartoon as an <img> of the given size (the picture's 1em img, scaled by font-size). */
const pic = (key: string, size: number) => `<div style="font-size:${r1(size)}mm;line-height:0">${picturePrint(key)}</div>`;

function image(key: string, x: number, y: number, size: number): string {
  const src = pictureSrc(key);
  if (!src) throw new Error(`No cartoon for "${key}"`);
  return `<image href="${src}" x="${r1(x)}" y="${r1(y)}" width="${r1(size)}" height="${r1(size)}" preserveAspectRatio="xMidYMid meet"/>`;
}

const range = (a: number, b: number) => Array.from({ length: b - a + 1 }, (_, i) => a + i);

// ------------------------------------------------------------------ grid

function grid(p: { start: number; end: number; picture: string; blanks: number[] }, box: Box): string {
  const numbers = range(p.start, p.end);
  const cols = 5;
  const rows = numbers.length / cols;
  const gapX = 4;
  const gapY = 5;
  const cellW = (box.w - (cols - 1) * gapX) / cols;
  const nbH = rows > 2 ? 15 : 18;
  const picSize = Math.min(cellW - 7, (box.h - (rows - 1) * gapY) / rows - nbH - 9);
  const blanks = new Set(p.blanks);
  const cells = numbers
    .map((n, i) => {
      const ring = BRIGHT[i % BRIGHT.length];
      return `<div style="width:${r1(cellW)}mm;border:0.45mm solid ${ring}55;border-radius:4mm;padding:2.5mm 0 3mm;display:flex;flex-direction:column;align-items:center;gap:2mm">
        ${pic(p.picture, picSize)}${nb(blanks.has(n) ? null : n, cellW * 0.72, nbH)}</div>`;
    })
    .join("");
  return `<div style="display:grid;grid-template-columns:repeat(${cols},${r1(cellW)}mm);gap:${gapY}mm ${gapX}mm">${cells}</div>`;
}

// ------------------------------------------------------------------ path

const PATH_COLOURS: Record<string, { body: string; fills: [string, string]; line: string }> = {
  caterpillar: { body: "#BFE8C9", fills: ["#DDF7EE", "#C8F0D6"], line: "#18A97F" },
  snake: { body: "#F6E7A6", fills: ["#FFF6CF", "#FFEBA6"], line: "#C98A00" },
};

function path(p: { start: number; end: number; picture: string; blanks: number[] }, box: Box): string {
  const numbers = range(p.start, p.end);
  const perRow = 5;
  const rows = numbers.length / perRow;
  const headW = 36;
  const s = (box.w - headW - 2) / perRow;
  const d = s * 0.9;
  const v = rows > 2 ? Math.min(s + 10, (box.h - d - 8) / (rows - 1)) : s + 16;
  const top = Math.max(d / 2 + 2, headW / 2);
  const c = PATH_COLOURS[p.picture];
  const blanks = new Set(p.blanks);
  const at = (i: number) => {
    const row = Math.floor(i / perRow);
    const k = i % perRow;
    const col = row % 2 === 0 ? k : perRow - 1 - k;
    return { x: headW + s / 2 + col * s, y: top + row * v };
  };
  const centres = numbers.map((_, i) => at(i));
  const height = centres[centres.length - 1].y + d / 2 + 4;
  const band = `<polyline points="${centres.map(({ x, y }) => `${r1(x)},${r1(y)}`).join(" ")}" fill="none" stroke="${c.body}" stroke-width="${r1(d * 0.55)}" stroke-linejoin="round" stroke-linecap="round"/>`;
  const legs =
    p.picture === "caterpillar"
      ? centres.map(({ x, y }) => `<path d="M${r1(x - d * 0.18)} ${r1(y + d * 0.42)} l-1 3.2 M${r1(x + d * 0.18)} ${r1(y + d * 0.42)} l1 3.2" stroke="${c.line}" stroke-width="0.9" stroke-linecap="round"/>`).join("")
      : "";
  const size = r1(d * 0.5);
  const segments = numbers
    .map((n, i) => {
      const { x, y } = centres[i];
      const blank = blanks.has(n);
      const circle = `<circle cx="${r1(x)}" cy="${r1(y)}" r="${r1(d / 2)}" fill="${blank ? "#fff" : c.fills[i % 2]}" stroke="${blank ? PURPLE : c.line}" stroke-width="${blank ? 0.9 : 0.7}"/>`;
      const text = blank ? "" : `<text x="${r1(x)}" y="${r1(y + size * 0.36)}" text-anchor="middle" font-family="display" font-weight="800" font-size="${size}" fill="${INK}">${n}</text>`;
      return circle + text;
    })
    .join("");
  const head = image(p.picture, 0, top - headW / 2, headW);
  return `<svg width="${r1(box.w)}mm" height="${r1(height)}mm" viewBox="0 0 ${r1(box.w)} ${r1(height)}">${band}${legs}${segments}${head}</svg>`;
}

// ------------------------------------------------------------------ hundred chart

function chart(p: { start: number; end: number; blanks: number[] }, box: Box): string {
  const numbers = range(p.start, p.end);
  const rows = numbers.length / 10;
  const w = Math.min(box.w / 10, 19);
  const h = Math.min(box.h / rows, rows > 5 ? w : 26);
  const font = r1(Math.min(h * 0.46, w * 0.42));
  const blanks = new Set(p.blanks);
  const cells = numbers
    .map((n, i) => {
      const blank = blanks.has(n);
      const tens = (i + 1) % 10 === 0;
      const bg = blank ? "#fff" : tens ? "#E4DEFF" : "#F4F1FF";
      const inner = blank ? `box-shadow: inset 0 0 0 0.45mm ${PURPLE};` : "";
      return `<div style="width:${r1(w)}mm;height:${r1(h)}mm;background:${bg};${inner}border-right:0.3mm solid #B9AEF5;border-bottom:0.3mm solid #B9AEF5;display:flex;align-items:center;justify-content:center;font-family:display;font-weight:800;font-size:${font}mm;padding-top:0.1em">${blank ? "" : n}</div>`;
    })
    .join("");
  return `<div style="display:grid;grid-template-columns:repeat(10,${r1(w)}mm);border-top:0.3mm solid #B9AEF5;border-left:0.3mm solid #B9AEF5;border-radius:2mm;overflow:hidden">${cells}</div>`;
}

// ------------------------------------------------------------------ train

function train(p: { start: number; end: number; picture: string; blanks: number[] }, box: Box): string {
  const numbers = range(p.start, p.end);
  const perTrain = 5;
  const trains = numbers.length / perTrain;
  const locoW = 36;
  const cw = (box.w - locoW - 1) / perTrain;
  const ch = 20;
  const passenger = 14;
  const wheel = 2.8;
  const rowH = passenger + ch + 2 * wheel + 3;
  const gap = trains > 2 ? Math.min(9, (box.h - trains * rowH) / (trains - 1)) : 22;
  const blanks = new Set(p.blanks);
  let out = "";
  for (let t = 0; t < trains; t++) {
    const y0 = t * (rowH + gap);
    const roof = y0 + passenger;
    const floor = roof + ch;
    const rail = floor + 2 * wheel + 0.6;
    out += `<line x1="0" x2="${r1(box.w)}" y1="${r1(rail)}" y2="${r1(rail)}" stroke="${INK}" stroke-width="0.6"/>`;
    // The engine faces left, at the head of the train.
    out += image("train", 0, rail - locoW - 0.3, locoW);
    for (let k = 0; k < perTrain; k++) {
      const n = numbers[t * perTrain + k];
      const x = locoW + 1 + k * cw;
      const bw = cw - 3;
      const fill = SOFT[(t + k) % SOFT.length];
      out += `<line x1="${r1(x - 3)}" x2="${r1(x + 0.5)}" y1="${r1(floor - 3)}" y2="${r1(floor - 3)}" stroke="${INK}" stroke-width="1"/>`;
      out += `<rect x="${r1(x)}" y="${r1(roof)}" width="${r1(bw)}" height="${ch}" rx="3" fill="${fill}" stroke="${INK}" stroke-width="0.7"/>`;
      for (const wx of [x + bw * 0.25, x + bw * 0.75]) out += `<circle cx="${r1(wx)}" cy="${r1(floor + wheel)}" r="${wheel}" fill="#fff" stroke="${INK}" stroke-width="0.7"/>`;
      const blank = blanks.has(n);
      const winX = x + 3;
      const winW = bw - 6;
      out += `<rect x="${r1(winX)}" y="${r1(roof + 2.8)}" width="${r1(winW)}" height="${r1(ch - 5.6)}" rx="2" fill="#fff" stroke="${blank ? PURPLE : "#CFC6FF"}" stroke-width="${blank ? 0.8 : 0.4}"/>`;
      if (!blank) {
        const size = r1(Math.min(10, winW / (String(n).length * 0.58)));
        out += `<text x="${r1(winX + winW / 2)}" y="${r1(roof + ch / 2 + size * 0.36)}" text-anchor="middle" font-family="display" font-weight="800" font-size="${size}" fill="${INK}">${n}</text>`;
      }
      out += image(p.picture, x + bw / 2 - passenger / 2, roof - passenger + 0.6, passenger);
    }
  }
  const height = trains * rowH + (trains - 1) * gap;
  return `<svg width="${r1(box.w)}mm" height="${r1(height)}mm" viewBox="0 0 ${r1(box.w)} ${r1(height)}">${out}</svg>`;
}

// ------------------------------------------------------------------ skip counting

function skip(p: { step: number; to: number; picture: string; perGroup: number; rows: { values: number[]; blanks: number[] }[] }, box: Box): string {
  // The helper: five groups of pictures with the running total under each.
  const groups = 5;
  const groupW = (box.w - (groups - 1) * 5) / groups - 4.8;
  // Up to three pictures a row (five go 3 + 2), so they stay big enough to count.
  const perRow = p.perGroup <= 3 ? p.perGroup : Math.ceil(p.perGroup / 2);
  const picSize = Math.min(13, (groupW - (perRow - 1) * 0.6) / perRow);
  const hint = Array.from({ length: groups }, (_, g) => {
    const pics = Array.from({ length: p.perGroup }, () => pic(p.picture, picSize)).join("");
    return `<div style="display:flex;flex-direction:column;align-items:center;gap:1.5mm">
      <div style="display:grid;grid-template-columns:repeat(${perRow},${r1(picSize)}mm);justify-content:center;gap:0.6mm;padding:1.6mm 2mm;border:0.4mm solid #E6E1FA;border-radius:3mm">${pics}</div>
      <div class="d" style="width:9mm;height:9mm;border-radius:50%;background:${SOFT[g % SOFT.length]};display:flex;align-items:center;justify-content:center;font-weight:800;font-size:4.6mm;padding-top:0.6mm">${p.step * (g + 1)}</div></div>`;
  }).join("");
  const cols = 10;
  const gap = 2;
  const w = (box.w - (cols - 1) * gap) / cols;
  const h = 14;
  const rows = p.rows
    .map((row) => {
      const blanks = new Set(row.blanks);
      return `<div style="display:flex;gap:${gap}mm">${row.values.map((n) => nb(blanks.has(n) ? null : n, w, h)).join("")}</div>`;
    })
    .join("");
  return `<div style="display:flex;flex-direction:column;align-items:center;gap:9mm">
    <div style="display:flex;gap:5mm;align-items:flex-start">${hint}</div>
    <div style="display:flex;flex-direction:column;gap:5.5mm">${rows}</div>
  </div>`;
}

// ------------------------------------------------------------------ before, after, between

function neighbours(p: { mode: "before" | "after" | "between"; items: { n: number; picture: string }[] }, box: Box): string {
  const colGap = 10;
  const colW = (box.w - colGap) / 2;
  const boxes = p.mode === "between" ? 3 : 2;
  const picSize = 15;
  const bw = Math.min(24, (colW - picSize - 5 - (boxes - 1) * 3) / boxes);
  const bh = 17;
  const rows = Math.ceil(p.items.length / 2);
  const rowGap = Math.min(10, (box.h - rows * bh) / (rows - 1));
  const items = p.items
    .map(({ n, picture }) => {
      const cells = p.mode === "before" ? [null, n] : p.mode === "after" ? [n, null] : [n - 1, null, n + 1];
      return `<div style="display:flex;align-items:center;gap:5mm">${pic(picture, picSize)}<div style="display:flex;gap:3mm">${cells.map((c) => nb(c, bw, bh)).join("")}</div></div>`;
    })
    .join("");
  return `<div style="display:grid;grid-template-columns:repeat(2,${r1(colW)}mm);column-gap:${colGap}mm;row-gap:${r1(rowGap)}mm">${items}</div>`;
}

// ------------------------------------------------------------------

export function missingNumbersBody(sheet: MissingNumbersSheet, _locale: SheetLocale, box: Box): string {
  const p = sheet.params;
  switch (p.layout) {
    case "grid":
      return grid(p, box);
    case "path":
      return path(p, box);
    case "chart":
      return chart(p, box);
    case "train":
      return train(p, box);
    case "skip":
      return skip(p, box);
    case "neighbours":
      return neighbours(p, box);
  }
}
