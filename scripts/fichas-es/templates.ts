// HTML/SVG templates for the Spanish worksheet PDFs (see generate.ts). Every
// sheet is one A4 page, 180 mm wide inside its margins; SVG blocks use
// millimetres as user units. The writing-row filler, page CSS and drawing
// helpers are shared with the French worksheets (scripts/fiches-fr).
//
// Rulings (docs/spanish-plan.md, D7 option B):
//   doble raya: capital line, dashed middle line (x-height), baseline and
//               descender line. Playwrite MX fits it exactly: x-height 0.5 em,
//               capitals and loops 1.0 em (two x-heights), tails 0.5 em below.
//   cuadrícula: 6 mm squares, for the number sheets.
import { getSpanishLetter, type SpanishLetter, type SpanishWord } from "../../lib/letters-es";
import {
  COLOURS,
  FIRST_SYLLABLE_WORDS,
  FREQUENT_WORD_GROUPS,
  LOOK_ALIKES,
  NUMBERS,
  SHAPES,
  getFichaCategory,
  getSyllableSheet,
  type Ficha,
} from "../../lib/fichas-es";
import {
  BLUE_LINE,
  CAP,
  LIGHT_LINE,
  OUTLINE,
  PAGE_CSS,
  W,
  XH,
  esc,
  fill,
  hasTail,
  rng,
  shapePath,
  shuffle,
  type FillKind,
} from "../fiches-fr/templates";

export const PAGE_CSS_ES = `${PAGE_CSS}
.cur-es { font-family: cursive-es }
.blank { display: inline-block; width: 22mm; height: 13mm; border: 0.4mm dashed #8c9bab; border-radius: 2mm; vertical-align: middle; margin-right: 1mm }
`;

const plain = (word: string) => word.replace(/\|/g, "");

// ------------------------------------------------------------------ page

export function pageHtml(ficha: Ficha, body: string): string {
  const category = getFichaCategory(ficha.category)!;
  return `<section class="page">
  <header class="band"><span class="brand">AlphaBes.com</span><span class="kind">${esc(category.name)}</span></header>
  <div class="who"><span>Nombre: ....................................</span><span>Fecha: ........................</span></div>
  <h1>${esc(ficha.title)}</h1>
  <p class="consigne"><span class="pencil">✏️</span>${esc(ficha.consigna)}</p>
  <div class="body">${body}</div>
  <footer><span>${esc(category.level)}</span><span>Ficha gratis · alphabes.com/es/fichas</span></footer>
</section>`;
}

// ------------------------------------------------------------------ rulings

type Ruling = { svg: (content: string) => string; baseline: (r: number) => number; height: number };

const svgBox = (height: number, lines: string[]) => (content: string) =>
  `<svg width="${W}mm" height="${height}mm" viewBox="0 0 ${W} ${height}">${lines.join("")}${content}</svg>`;

function rowLines(cap: number, mid: number, base: number, desc: number): string[] {
  const line = (y: number, stroke: string, width: number, dash = "") =>
    `<line x1="0" x2="${W}" y1="${y}" y2="${y}" stroke="${stroke}" stroke-width="${width}"${dash ? ` stroke-dasharray="${dash}"` : ""}/>`;
  return [line(cap, LIGHT_LINE, 0.3), line(mid, BLUE_LINE, 0.25, "1.5 1.5"), line(base, "#5b7fa8", 0.35), line(desc, LIGHT_LINE, 0.3)];
}

/** Doble raya for cursive (Playwrite MX): x-height `xh` mm, font size 2·xh. */
function dobleRaya(rows: number, xh: number): Ruling {
  const pitch = 4.6 * xh;
  const height = rows * pitch;
  // 1.6 x-heights above the capital line's baseline leave room for accents (Á, Ñ).
  const baseline = (r: number) => r * pitch + 2.6 * xh;
  const lines: string[] = [];
  for (let r = 0; r < rows; r++) {
    const b = baseline(r);
    lines.push(...rowLines(b - 2 * xh, b - xh, b, b + xh));
  }
  return { height, baseline, svg: svgBox(height, lines) };
}

/** Doble raya for letra script (Andika at `size` mm): capital, x-height, baseline, descender. */
function dobleRayaScript(rows: number, size: number, pitch: number): Ruling {
  const height = rows * pitch;
  const baseline = (r: number) => r * pitch + size * CAP + 3;
  const lines: string[] = [];
  for (let r = 0; r < rows; r++) {
    const b = baseline(r);
    lines.push(...rowLines(b - size * CAP, b - size * XH, b, b + size * 0.25));
  }
  return { height, baseline, svg: svgBox(height, lines) };
}

/** Cuadrícula: squares of `cell` mm, `rows` cells high. */
function cuadricula(rows: number, cell: number): { svg: (content: string) => string; height: number } {
  const height = rows * cell;
  const lines: string[] = [];
  for (let y = 0; y <= height + 0.01; y += cell) lines.push(`<line x1="0" x2="${W}" y1="${y}" y2="${y}" stroke="${LIGHT_LINE}" stroke-width="0.2"/>`);
  for (let x = 0; x <= W + 0.01; x += cell) lines.push(`<line x1="${x}" x2="${x}" y1="0" y2="${height}" stroke="${LIGHT_LINE}" stroke-width="0.2"/>`);
  return { height, svg: svgBox(height, lines) };
}

/** Cursive rows on doble raya: each word as model + grey copies, then (optionally) model + empty row. */
function cursiveRows(words: string[], xh = 3.4, greyMax = 99, blank = true): string {
  const per = blank ? 2 : 1;
  const r = dobleRaya(words.length * per, xh);
  const content = words
    .flatMap((word, i) => [
      fill({ text: word, x0: 2, x1: W - 2, y: r.baseline(i * per), size: 2 * xh, font: "cur-es", kind: "model-grey", gap: 2.5 * xh, max: greyMax }),
      ...(blank ? [fill({ text: word, x0: 2, x1: W - 2, y: r.baseline(i * per + 1), size: 2 * xh, font: "cur-es", kind: "model-blank", gap: 0 })] : []),
    ])
    .join("");
  return r.svg(content);
}

// ------------------------------------------------------------------ helpers

function letterOf(f: Ficha): SpanishLetter {
  return getSpanishLetter(f.letter!)!;
}

function pictureCard(word: SpanishWord, picSize: number, textSize: number): string {
  return `<div class="card"><div class="pic" style="font-size:${picSize}mm">${word.emoji}</div><div style="font-size:${textSize}mm;margin-top:1.5mm">${esc(plain(word.word))}</div></div>`;
}

/** The letter's words, then its first-syllable words: three at most, no repeats. */
export function letterWords(l: SpanishLetter): SpanishWord[] {
  const out: SpanishWord[] = [];
  const firstSyllable = (FIRST_SYLLABLE_WORDS[l.slug] ?? []).map((x) => ({ ...x, word: plain(x.word) }));
  for (const x of [...l.words, ...(l.wordsInside ?? []), ...firstSyllable]) {
    if (out.length < 3 && !out.some((o) => o.word.toLowerCase() === x.word.toLowerCase())) out.push(x);
  }
  return out;
}

// ------------------------------------------------------------------ letter sheets

function trazo(f: Ficha): string {
  const l = letterOf(f);
  const word = l.words[0];
  const top = `<div style="display:flex;align-items:center;justify-content:space-between">
    <svg width="120mm" height="52mm" viewBox="0 0 120 52">
      <text x="2" y="${hasTail(l.upper) ? 36 : 44}" font-family="script" font-weight="700" font-size="${hasTail(l.upper) ? 46 : 56}" fill="#fff" paint-order="stroke" stroke="${OUTLINE}" stroke-width="1">${esc(l.upper)}</text>
      <text x="62" y="${hasTail(l.lower) ? 36 : 44}" font-family="script" font-weight="700" font-size="${hasTail(l.lower) ? 46 : 56}" fill="#fff" paint-order="stroke" stroke="${OUTLINE}" stroke-width="1">${esc(l.lower)}</text>
    </svg>
    <div style="text-align:center"><div class="emoji" style="font-size:24mm;line-height:1.1">${word.emoji}</div><div style="font-size:6mm">${esc(word.word.toLowerCase())}</div></div>
  </div>
  <div style="display:flex;gap:10mm;align-items:baseline;margin:2mm 0 3mm;font-size:4mm;color:#555">Tres formas de escribirla:
    <span style="font-size:9mm;color:#1f2a44">${esc(l.upper)}</span><span style="font-size:9mm;color:#1f2a44">${esc(l.lower)}</span><span class="cur-es" style="font-size:8mm;color:#1f2a44">${esc(l.lower)}</span></div>`;
  const size = 18;
  const r = dobleRayaScript(6, size, 23.5);
  const rows = (
    [
      [l.upper, "model-outline"],
      [l.upper, "outline"],
      [l.upper, "model-blank"],
      [l.lower, "model-outline"],
      [l.lower, "outline"],
      [l.lower, "model-blank"],
    ] as [string, FillKind][]
  )
    .map(([text, kind], i) => fill({ text, x0: 2, x1: W - 2, y: r.baseline(i), size, font: "script", kind, gap: 7 }))
    .join("");
  return top + r.svg(rows);
}

function cursiva(f: Ficha): string {
  const l = letterOf(f);
  const word = l.words[0].word.toLowerCase();
  const xh = 4;
  const r = dobleRaya(6, xh);
  const row = (i: number, text: string, kind: FillKind) =>
    fill({ text, x0: 2, x1: W - 2, y: r.baseline(i), size: 2 * xh, font: "cur-es", kind, gap: 3 * xh });
  const top = `<div style="display:flex;align-items:center;gap:8mm;margin-bottom:3mm">
    <div class="cur-es" style="font-size:12mm;line-height:normal;padding:0 4mm;border:0.35mm solid #d5dbe3;border-radius:3mm">${esc(l.upper)} ${esc(l.lower)}</div>
    <div class="emoji" style="font-size:14mm">${l.words[0].emoji}</div>
    <div style="font-size:4mm;color:#555;max-width:70mm">La minúscula, la mayúscula y después la palabra <strong>${esc(word)}</strong>.</div></div>`;
  return (
    top +
    r.svg(
      [
        row(0, l.lower, "model-grey"),
        row(1, l.lower, "model-blank"),
        row(2, l.upper, "model-grey"),
        row(3, l.upper, "model-blank"),
        row(4, word, "model-grey"),
        row(5, word, "model-blank"),
      ].join(""),
    )
  );
}

function reconocer(f: Ficha): string {
  const l = letterOf(f);
  const rand = rng(f.slug);
  const target = l.lower;
  const alikes = [...(LOOK_ALIKES[target] ?? "")];
  const others = [..."abcdefghijklmnñopqrstuvwxyz"].filter((c) => c !== target && !alikes.includes(c));
  type Cell = { ch: string; style: "cap" | "script" | "cur" };
  const styles: Cell["style"][] = ["cap", "script", "cur"];
  const cells: Cell[] = [];
  for (let i = 0; i < 14; i++) cells.push({ ch: target, style: styles[i % 3] });
  for (let i = 0; i < 28; i++) {
    const ch = rand() < 0.65 && alikes.length ? alikes[Math.floor(rand() * alikes.length)] : others[Math.floor(rand() * others.length)];
    cells.push({ ch, style: styles[Math.floor(rand() * 3)] });
  }
  const html = shuffle(cells, rand)
    .map((c) => {
      const text = c.style === "cap" ? c.ch.toUpperCase() : c.ch;
      const style = c.style === "cur" ? "font-size:9mm;line-height:normal" : "font-size:14mm;line-height:1";
      return `<div class="card ${c.style === "cur" ? "cur-es" : ""}" style="height:22mm;padding:0;display:flex;align-items:center;justify-content:center;${style}">${esc(text)}</div>`;
    })
    .join("");
  const legend = `<div style="display:flex;gap:8mm;align-items:center;margin-bottom:4mm;font-size:4.2mm">Busca:
    <span class="card" style="font-size:11mm;padding:0 3mm">${esc(l.upper)}</span>
    <span class="card" style="font-size:11mm;padding:0 3mm">${esc(l.lower)}</span>
    <span class="card cur-es" style="font-size:7mm;padding:0 3mm;line-height:normal">${esc(l.lower)}</span></div>`;
  return legend + `<div class="grid" style="grid-template-columns:repeat(7,1fr);gap:3mm">${html}</div>`;
}

function silabaInicial(f: Ficha): string {
  const words = FIRST_SYLLABLE_WORDS[f.letter!];
  const l = letterOf(f);
  const [first] = words;
  const parts = first.word.split("|");
  const model = `<div style="display:flex;align-items:center;gap:6mm;margin-bottom:5mm;font-size:5mm">
    <span>Ejemplo:</span><span class="emoji" style="font-size:12mm">${first.emoji}</span>
    <span style="font-size:9mm"><span style="color:#c8323a;border-bottom:0.5mm solid #c8323a">${esc(parts[0])}</span>${esc(parts.slice(1).join(""))}</span>
    <span style="color:#555">(${esc(parts.join(" - "))})</span></div>`;
  const cards = words
    .map((x) => {
      const p = x.word.split("|");
      return `<div class="card" style="padding:4mm 2mm"><div class="pic" style="font-size:30mm">${x.emoji}</div>
        <div style="font-size:10mm;margin-top:3mm;white-space:nowrap"><span class="blank"></span>${esc(p.slice(1).join(""))}</div>
        <div style="font-size:3.6mm;color:#888;margin-top:2mm">${"👏 ".repeat(p.length).trim()}</div></div>`;
    })
    .join("");
  const cols = words.length === 3 ? 3 : 2;
  return `${model}<div class="grid" style="grid-template-columns:repeat(${cols},1fr);gap:5mm">${cards}</div>
    <p style="font-size:4.6mm;margin:5mm 0 1mm">Escribe la palabra completa en cursiva:</p>${cursiveRows([plain(first.word).toLowerCase()], 3.4, 3, false)}
    <p style="font-size:3.8mm;color:#777;margin-top:2mm">Las palmas debajo de cada dibujo dicen cuántas sílabas tiene la palabra. Letra ${esc(l.upper)}.</p>`;
}

function colorear(f: Ficha): string {
  const l = letterOf(f);
  const word = l.words[0];
  return `<div style="display:flex;align-items:center;justify-content:space-between">
    <svg width="112mm" height="120mm" viewBox="0 0 112 120">
      <text x="56" y="${hasTail(l.upper) ? 84 : 100}" text-anchor="middle" font-family="script" font-weight="700" font-size="${hasTail(l.upper) ? 106 : 130}" fill="#fff" paint-order="stroke" stroke="#1f2a44" stroke-width="1.2">${esc(l.upper)}</text>
    </svg>
    <svg width="68mm" height="120mm" viewBox="0 0 68 120">
      <text x="34" y="${hasTail(l.lower) ? 72 : 96}" text-anchor="middle" font-family="script" font-weight="700" font-size="${hasTail(l.lower) ? 78 : 92}" fill="#fff" paint-order="stroke" stroke="#1f2a44" stroke-width="1">${esc(l.lower)}</text>
    </svg></div>
  <div style="display:flex;align-items:center;gap:10mm;margin-top:6mm">
    <svg width="95mm" height="92mm" viewBox="0 0 95 95"><text x="47.5" y="80" text-anchor="middle" font-family="emoji" font-size="84" fill="none" stroke="#1f2a44" stroke-width="0.45">${word.emoji}</text></svg>
    <div><div style="font-size:4.4mm;color:#555">${esc(word.withArticle)}</div><div style="font-size:12mm">${esc(word.word.toLowerCase())}</div><div class="cur-es" style="font-size:12mm;line-height:1.8">${esc(word.word.toLowerCase())}</div></div></div>`;
}

function palabras(f: Ficha): string {
  const l = letterOf(f);
  const list = letterWords(l);
  return list
    .map(
      (x) => `<div style="display:flex;align-items:center;gap:5mm;margin:1mm 0 0"><span class="emoji" style="font-size:12mm">${x.emoji}</span>
        <span style="font-size:7mm">${esc(x.word.toLowerCase())}</span><span style="font-size:4mm;color:#777">(${esc(x.withArticle)})</span></div>${cursiveRows([x.word.toLowerCase()], 3.2)}`,
    )
    .join("");
}

// ------------------------------------------------------------------ theme sheets

function numero(f: Ficha): string {
  const n = Number(f.slug.split("-")[1]);
  const word = NUMBERS[n];
  const cell = 6;
  // Three rows, each three squares: digits two squares high standing on a
  // grid line, then a free square.
  const grid = cuadricula(9, cell);
  const size = 16.5; // Andika digits are 0.725 em: two squares high
  const rows = [0, 1, 2]
    .map((i) =>
      fill({
        text: String(n),
        x0: cell,
        x1: W - cell,
        y: (i * 3 + 2) * cell + 0.5,
        size,
        font: "script",
        kind: i === 0 ? "model-outline" : i === 1 ? "outline" : "model-blank",
        gap: cell,
      }),
    )
    .join("");
  const total = n > 10 ? 20 : 10;
  const perRow = total / 2;
  const step = W / perRow;
  const balloonSize = n > 10 ? 15 : 24;
  const balloons = Array.from({ length: total }, (_, i) => {
    const x = step / 2 + (i % perRow) * step;
    const y = i < perRow ? balloonSize + 2 : 2 * balloonSize + 8;
    return `<text x="${x}" y="${y}" text-anchor="middle" font-family="emoji" font-size="${balloonSize}" fill="none" stroke="#1f2a44" stroke-width="0.35">🎈</text>`;
  }).join("");
  return `<div style="display:flex;align-items:center;gap:12mm">
      <svg width="70mm" height="56mm" viewBox="0 0 70 56"><text x="35" y="50" text-anchor="middle" font-family="script" font-weight="700" font-size="${n > 9 ? 54 : 66}" fill="#fff" paint-order="stroke" stroke="${OUTLINE}" stroke-width="1">${n}</text></svg>
      <div><div style="font-size:12mm">${esc(word)}</div><div class="cur-es" style="font-size:12mm;line-height:1.8">${esc(word)}</div></div></div>
    <p style="font-size:4.6mm;margin:2mm 0 1mm">Repasa el número y escríbelo en la cuadrícula:</p>
    ${grid.svg(rows)}
    <p style="font-size:4.6mm;margin:4mm 0 1mm">Colorea <strong>${n === 0 ? "ningún globo" : `${n} ${n === 1 ? "globo" : "globos"}`}</strong>:</p>
    <svg width="${W}mm" height="${2 * balloonSize + 12}mm" viewBox="0 0 ${W} ${2 * balloonSize + 12}">${balloons}</svg>
    ${cursiveRows([word], 3.2, 3)}`;
}

function figura(f: Ficha): string {
  const shape = SHAPES.find((s) => `figura-${s.slug}` === f.slug)!;
  const dashed = (content: string, width: number) => `<g fill="none" stroke="#6b7c93" stroke-width="${width}" stroke-dasharray="2 1.6" stroke-linecap="round">${content}</g>`;
  const small = Array.from({ length: 5 }, (_, i) => shapePath(shape.draw, 18 + i * 36, 18, 13)).join("");
  return `<div style="display:flex;align-items:center;gap:10mm">
      <svg width="95mm" height="85mm" viewBox="0 0 95 85">${dashed(shapePath(shape.draw, 47.5, 44, 34), 0.8)}</svg>
      <div><div style="font-size:12mm">${esc(shape.name)}</div><div class="cur-es" style="font-size:12mm;line-height:1.8">${esc(shape.name)}</div></div></div>
    <p style="font-size:4.6mm;margin:3mm 0 1mm">Repasa las figuras pequeñas:</p>
    <svg width="${W}mm" height="38mm" viewBox="0 0 ${W} 38">${dashed(small, 0.6)}</svg>
    <p style="font-size:4.6mm;margin:3mm 0 1mm">Dibuja ${esc(shape.withArticle)} tú solo:</p>
    <div style="height:42mm;border:0.35mm dashed #c5ced9;border-radius:3mm"></div>
    <div style="margin-top:4mm">${cursiveRows([shape.name], 3.2, 3, false)}</div>`;
}

function color(f: Ficha): string {
  const c = COLOURS.find((x) => `color-${x.slug}` === f.slug)!;
  return `<div style="display:flex;align-items:center;gap:6mm">
      <div style="width:18mm;height:18mm;border-radius:50%;background:${c.hex};border:0.35mm solid #1f2a44"></div>
      <div style="font-size:12mm;font-weight:700;color:${c.hex === "#FDD835" ? "#b89a00" : c.hex}">${esc(c.name)}</div>
      <div class="cur-es" style="font-size:12mm;line-height:1.8">${esc(c.name)}</div></div>
    <svg width="${W}mm" height="140mm" viewBox="0 0 ${W} 140"><text x="${W / 2}" y="122" text-anchor="middle" font-family="emoji" font-size="128" fill="none" stroke="#1f2a44" stroke-width="0.5">${c.thing.emoji}</text></svg>
    <p style="font-size:4.6mm;margin:0 0 1mm">${esc(c.thing.withArticle.charAt(0).toUpperCase() + c.thing.withArticle.slice(1))} ${c.thing.withArticle.startsWith("las ") ? "son" : "es"} de color ${esc(c.name)}. Escribe la palabra:</p>
    ${cursiveRows([c.name], 3.2, 3)}`;
}

function frecuentes(f: Ficha): string {
  const g = FREQUENT_WORD_GROUPS[Number(f.slug.split("-").pop()) - 1];
  const xh = 3.2;
  const r = dobleRaya(g.words.length, xh);
  const rows = g.words.map((word, i) => fill({ text: word, x0: 2, x1: W - 2, y: r.baseline(i), size: 2 * xh, font: "cur-es", kind: "model-grey", gap: 3 * xh, max: 3 })).join("");
  const words = `<div style="display:flex;gap:6mm;margin-bottom:4mm">${g.words.map((x) => `<span class="card" style="font-size:10mm;padding:1mm 5mm">${esc(x)}</span>`).join("")}</div>`;
  return (
    words +
    r.svg(rows) +
    `<p style="font-size:4.6mm;margin:6mm 0 2mm">Lee la oración y encierra las palabras frecuentes:</p>
    <p class="card" style="font-size:8mm;line-height:1.7;text-align:left;padding:4mm 6mm">${esc(g.sentence)}</p>
    <p style="font-size:4.6mm;margin:6mm 0 2mm">Escribe una palabra frecuente que elijas:</p>${dobleRaya(1, xh).svg("")}`
  );
}

function silabas(f: Ficha): string {
  const s = getSyllableSheet(f.syllables!)!;
  const rand = rng(f.slug);
  const onsetLength = (syl: string) => syl.length - 1;
  const table = `<div class="grid" style="grid-template-columns:repeat(${s.syllables.length},1fr);gap:3mm">${s.syllables
    .map((syl) => `<div class="card" style="font-size:13mm;padding:2mm 0"><span style="color:#1d6fc2">${esc(syl.slice(0, onsetLength(syl)))}</span><span style="color:#c8323a">${esc(syl.slice(onsetLength(syl)))}</span></div>`)
    .join("")}</div>`;
  const note = s.note ? `<p style="font-size:4.2mm;color:#555;margin:2mm 0 0">${esc(s.note)}</p>` : "";
  const mixedLine = () => shuffle([...s.syllables, ...s.syllables.slice(0, Math.max(0, 5 - s.syllables.length))], rand).join("&nbsp;&nbsp;&nbsp;");
  const mixed = [mixedLine(), mixedLine()].map((line) => `<p style="font-size:9mm;margin:2.5mm 0;letter-spacing:0.3mm">${line}</p>`).join("");
  const words = `<div class="grid" style="grid-template-columns:repeat(${Math.min(s.words.length, 4)},1fr);gap:4mm;margin-top:3mm">${s.words
    .map((x) => `<div class="card"><div class="pic" style="font-size:18mm">${x.emoji}</div><div style="font-size:7.5mm;margin-top:2mm;white-space:nowrap">${x.word.split("|").map((p) => `<span class="syl">${esc(p)}</span>`).join("")}</div></div>`)
    .join("")}</div>`;
  const toWrite = s.syllables.length >= 3 ? [s.syllables[0], s.syllables[2]] : s.syllables.slice(0, 2);
  const xh = 3.2;
  const r = dobleRaya(toWrite.length, xh);
  const rows = toWrite.map((t, i) => fill({ text: t, x0: 2, x1: W - 2, y: r.baseline(i), size: 2 * xh, font: "cur-es", kind: "model-grey", gap: 3 * xh })).join("");
  return `${table}${note}<p style="font-size:4.6mm;margin:3mm 0 0">Lee las sílabas en desorden:</p>${mixed}<p style="font-size:4.6mm;margin:2mm 0 0">Lee las palabras:</p>${words}<p style="font-size:4.6mm;margin:4mm 0 1mm">Escribe las sílabas en cursiva:</p>${r.svg(rows)}`;
}

// ------------------------------------------------------------------ dispatch

export function fichaBody(f: Ficha): string {
  switch (f.category) {
    case "trazo-de-letras":
      return trazo(f);
    case "letra-cursiva":
      return cursiva(f);
    case "reconocer-letras":
      return reconocer(f);
    case "primera-silaba":
      return silabaInicial(f);
    case "colorear-letras":
      return colorear(f);
    case "escribir-palabras":
      return palabras(f);
    case "numeros":
      return numero(f);
    case "figuras":
      return figura(f);
    case "colores":
      return color(f);
    case "palabras-frecuentes":
      return frecuentes(f);
    case "silabas":
    case "silabas-trabadas":
      return silabas(f);
    default:
      throw new Error(`No template for ${f.category}`);
  }
}
