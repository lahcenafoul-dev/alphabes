// HTML/SVG templates for the Portuguese worksheet PDFs (see generate.ts).
// Every sheet is one A4 page, 180 mm wide inside its margins; SVG blocks use
// millimetres as user units. The writing-row filler, page CSS and drawing
// helpers are shared with the French worksheets (scripts/fiches-fr).
//
// Rulings (docs/portuguese-plan.md, P6):
//   caligrafia: the four lines of the Brazilian caderno de caligrafia, spaced
//               for Playwrite BR: x-height 0.5 em, loops and capitals about
//               1.15 em (2.3 x-heights), tails 0.65 em (1.3 x-heights) below.
//   pauta de forma: capital line, dashed x-height, baseline and descender
//               line, for the print letters (Andika).
//   quadriculado: 6 mm squares, for the number sheets.
import { getPortugueseLetter, type PortugueseLetter, type PortugueseWord } from "../../lib/letters-pt";
import {
  COLOURS,
  FIRST_SYLLABLE_WORDS,
  FREQUENT_WORD_GROUPS,
  LOOK_ALIKES,
  NUMBERS,
  SHAPES,
  getAtividadeCategory,
  getSyllableSheet,
  type Atividade,
} from "../../lib/atividades-pt";
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

export const PAGE_CSS_PT = `${PAGE_CSS}
.cur-pt { font-family: cursive-pt }
.blank { display: inline-block; width: 22mm; height: 13mm; border: 0.4mm dashed #8c9bab; border-radius: 2mm; vertical-align: middle; margin-right: 1mm }
`;

const plain = (word: string) => word.replace(/\|/g, "");

// ------------------------------------------------------------------ page

export function pageHtml(a: Atividade, body: string): string {
  const category = getAtividadeCategory(a.category)!;
  return `<section class="page">
  <header class="band"><span class="brand">AlphaBes.com</span><span class="kind">${esc(category.name)}</span></header>
  <div class="who"><span>Nome: ....................................</span><span>Data: ........................</span></div>
  <h1>${esc(a.title)}</h1>
  <p class="consigne"><span class="pencil">✏️</span>${esc(a.instrucao)}</p>
  <div class="body">${body}</div>
  <footer><span>${esc(category.level)}</span><span>Atividade grátis · alphabes.com/pt/atividades</span></footer>
</section>`;
}

// ------------------------------------------------------------------ rulings

type Ruling = { svg: (content: string) => string; baseline: (r: number) => number; height: number };

const svgBox = (height: number, lines: string[]) => (content: string) =>
  `<svg width="${W}mm" height="${height}mm" viewBox="0 0 ${W} ${height}">${lines.join("")}${content}</svg>`;

function rowLines(top: number, mid: number, base: number, bottom: number): string[] {
  const line = (y: number, stroke: string, width: number, dash = "") =>
    `<line x1="0" x2="${W}" y1="${y}" y2="${y}" stroke="${stroke}" stroke-width="${width}"${dash ? ` stroke-dasharray="${dash}"` : ""}/>`;
  return [line(top, LIGHT_LINE, 0.3), line(mid, BLUE_LINE, 0.25, "1.5 1.5"), line(base, "#5b7fa8", 0.35), line(bottom, LIGHT_LINE, 0.3)];
}

/** Caligrafia lines for cursive (Playwrite BR): x-height `xh` mm, font size 2·xh. */
function caligrafia(rows: number, xh: number): Ruling {
  const pitch = 5 * xh;
  const height = rows * pitch;
  // 2.9 x-heights above the first baseline: the 2.3 of the top line plus
  // room for accents and tildes on capitals (Ã, Ô).
  const baseline = (r: number) => r * pitch + 2.9 * xh;
  const lines: string[] = [];
  for (let r = 0; r < rows; r++) {
    const b = baseline(r);
    lines.push(...rowLines(b - 2.3 * xh, b - xh, b, b + 1.3 * xh));
  }
  return { height, baseline, svg: svgBox(height, lines) };
}

/** Lines for print letters (Andika at `size` mm): capital, x-height, baseline, descender. */
function pautaForma(rows: number, size: number, pitch: number): Ruling {
  const height = rows * pitch;
  const baseline = (r: number) => r * pitch + size * CAP + 3;
  const lines: string[] = [];
  for (let r = 0; r < rows; r++) {
    const b = baseline(r);
    lines.push(...rowLines(b - size * CAP, b - size * XH, b, b + size * 0.25));
  }
  return { height, baseline, svg: svgBox(height, lines) };
}

/** Quadriculado: squares of `cell` mm, `rows` cells high. */
function quadriculado(rows: number, cell: number): { svg: (content: string) => string; height: number } {
  const height = rows * cell;
  const lines: string[] = [];
  for (let y = 0; y <= height + 0.01; y += cell) lines.push(`<line x1="0" x2="${W}" y1="${y}" y2="${y}" stroke="${LIGHT_LINE}" stroke-width="0.2"/>`);
  for (let x = 0; x <= W + 0.01; x += cell) lines.push(`<line x1="${x}" x2="${x}" y1="0" y2="${height}" stroke="${LIGHT_LINE}" stroke-width="0.2"/>`);
  return { height, svg: svgBox(height, lines) };
}

/** Cursive rows on caligrafia lines: each word as model + grey copies, then (optionally) model + empty row. */
function cursiveRows(words: string[], xh = 3.2, greyMax = 99, blank = true): string {
  const per = blank ? 2 : 1;
  const r = caligrafia(words.length * per, xh);
  const content = words
    .flatMap((word, i) => [
      fill({ text: word, x0: 2, x1: W - 2, y: r.baseline(i * per), size: 2 * xh, font: "cur-pt", kind: "model-grey", gap: 2.5 * xh, max: greyMax }),
      ...(blank ? [fill({ text: word, x0: 2, x1: W - 2, y: r.baseline(i * per + 1), size: 2 * xh, font: "cur-pt", kind: "model-blank", gap: 0 })] : []),
    ])
    .join("");
  return r.svg(content);
}

// ------------------------------------------------------------------ helpers

function letterOf(a: Atividade): PortugueseLetter {
  return getPortugueseLetter(a.letter!)!;
}

/** The letter's words, then its first-syllable words: three at most, no repeats. */
export function letterWords(l: PortugueseLetter): PortugueseWord[] {
  const out: PortugueseWord[] = [];
  const firstSyllable = (FIRST_SYLLABLE_WORDS[l.slug] ?? []).map((x) => ({ ...x, word: plain(x.word) }));
  for (const x of [...l.words, ...(l.wordsInside ?? []), ...firstSyllable]) {
    if (out.length < 3 && !out.some((o) => o.word.toLowerCase() === x.word.toLowerCase())) out.push(x);
  }
  return out;
}

/** The big outlined letter and the picture at the top of the tracing sheets. */
function tracingTop(ch: string, word: PortugueseWord, wordText: string): string {
  const tail = hasTail(ch);
  return `<div style="display:flex;align-items:center;justify-content:space-between">
    <svg width="90mm" height="52mm" viewBox="0 0 90 52">
      <text x="45" y="${tail ? 36 : 44}" text-anchor="middle" font-family="script" font-weight="700" font-size="${tail ? 46 : 56}" fill="#fff" paint-order="stroke" stroke="${OUTLINE}" stroke-width="1">${esc(ch)}</text>
    </svg>
    <div style="text-align:center"><div class="emoji" style="font-size:24mm;line-height:1.1">${word.emoji}</div><div style="font-size:6mm">${esc(wordText)}</div></div>
  </div>`;
}

/** Print tracing rows: the letter (outlined model, outlines, empty), then the word (outlined model, empty). */
function printRows(ch: string, word: string): string {
  const size = 18;
  const r = pautaForma(5, size, 23.5);
  const rows = (
    [
      [ch, "model-outline", 7],
      [ch, "outline", 7],
      [ch, "model-blank", 7],
      [word, "model-outline", 9],
      [word, "model-blank", 9],
    ] as [string, FillKind, number][]
  )
    .map(([text, kind, gap], i) => fill({ text, x0: 2, x1: W - 2, y: r.baseline(i), size, font: "script", kind, gap, max: text.length > 1 ? 2 : 99 }))
    .join("");
  return r.svg(rows);
}

// ------------------------------------------------------------------ letter sheets

function bastao(a: Atividade): string {
  const l = letterOf(a);
  const word = l.words[0];
  const caps = word.word.toUpperCase();
  return (
    tracingTop(l.upper, word, caps) +
    `<p style="font-size:4.4mm;color:#555;margin:2mm 0 3mm">A letra bastão é a letra de forma maiúscula: ${esc(l.upper)}. Cubra e depois escreva a palavra <strong>${esc(caps)}</strong>.</p>` +
    printRows(l.upper, caps)
  );
}

function forma(a: Atividade): string {
  const l = letterOf(a);
  const word = l.words[0];
  const lower = word.word.toLowerCase();
  return (
    tracingTop(l.lower, word, lower) +
    `<p style="font-size:4.4mm;color:#555;margin:2mm 0 3mm">A letra de forma minúscula é a letra dos livros: ${esc(l.lower)}. Cubra e depois escreva a palavra <strong>${esc(lower)}</strong>.</p>` +
    printRows(l.lower, lower)
  );
}

function cursiva(a: Atividade): string {
  const l = letterOf(a);
  const word = l.words[0].word.toLowerCase();
  const xh = 3.8;
  const r = caligrafia(6, xh);
  const row = (i: number, text: string, kind: FillKind) =>
    fill({ text, x0: 2, x1: W - 2, y: r.baseline(i), size: 2 * xh, font: "cur-pt", kind, gap: 3 * xh });
  const top = `<div style="display:flex;align-items:center;gap:8mm;margin-bottom:3mm">
    <div class="cur-pt" style="font-size:12mm;line-height:normal;padding:0 4mm;border:0.35mm solid #d5dbe3;border-radius:3mm">${esc(l.upper)} ${esc(l.lower)}</div>
    <div class="emoji" style="font-size:14mm">${l.words[0].emoji}</div>
    <div style="font-size:4mm;color:#555;max-width:70mm">A minúscula, a maiúscula e depois a palavra <strong>${esc(word)}</strong>.</div></div>`;
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

function reconhecer(a: Atividade): string {
  const l = letterOf(a);
  const rand = rng(a.slug);
  const target = l.lower;
  const alikes = [...(LOOK_ALIKES[target] ?? "")];
  const others = [..."abcçdefghijklmnopqrstuvwxyz"].filter((c) => c !== target && !alikes.includes(c));
  // The four kinds of letter: bastão, forma, cursive capital and cursive lowercase.
  type Style = "bastao" | "forma" | "curCap" | "cur";
  type Cell = { ch: string; style: Style };
  const styles: Style[] = ["bastao", "forma", "curCap", "cur"];
  const cells: Cell[] = [];
  for (let i = 0; i < 14; i++) cells.push({ ch: target, style: styles[i % 4] });
  for (let i = 0; i < 28; i++) {
    const ch = rand() < 0.65 && alikes.length ? alikes[Math.floor(rand() * alikes.length)] : others[Math.floor(rand() * others.length)];
    cells.push({ ch, style: styles[Math.floor(rand() * 4)] });
  }
  const html = shuffle(cells, rand)
    .map((c) => {
      const text = c.style === "bastao" || c.style === "curCap" ? c.ch.toUpperCase() : c.ch;
      const cursive = c.style === "cur" || c.style === "curCap";
      const style = cursive ? "font-size:9mm;line-height:normal" : "font-size:14mm;line-height:1";
      return `<div class="card ${cursive ? "cur-pt" : ""}" style="height:22mm;padding:0;display:flex;align-items:center;justify-content:center;${style}">${esc(text)}</div>`;
    })
    .join("");
  const legend = `<div style="display:flex;gap:6mm;align-items:center;margin-bottom:4mm;font-size:4.2mm">Procure:
    <span class="card" style="font-size:11mm;padding:0 3mm">${esc(l.upper)}</span>
    <span class="card" style="font-size:11mm;padding:0 3mm">${esc(l.lower)}</span>
    <span class="card cur-pt" style="font-size:7mm;padding:0 3mm;line-height:normal">${esc(l.upper)}</span>
    <span class="card cur-pt" style="font-size:7mm;padding:0 3mm;line-height:normal">${esc(l.lower)}</span></div>`;
  return legend + `<div class="grid" style="grid-template-columns:repeat(7,1fr);gap:3mm">${html}</div>`;
}

function silabaInicial(a: Atividade): string {
  const words = FIRST_SYLLABLE_WORDS[a.letter!];
  const l = letterOf(a);
  const [first] = words;
  const parts = first.word.split("|");
  const model = `<div style="display:flex;align-items:center;gap:6mm;margin-bottom:5mm;font-size:5mm">
    <span>Exemplo:</span><span class="emoji" style="font-size:12mm">${first.emoji}</span>
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
    <p style="font-size:4.6mm;margin:5mm 0 1mm">Escreva a palavra inteira em letra cursiva:</p>${cursiveRows([plain(first.word).toLowerCase()], 3.2, 3, false)}
    <p style="font-size:3.8mm;color:#777;margin-top:2mm">As palmas embaixo de cada figura mostram quantas sílabas a palavra tem. Letra ${esc(l.upper)}.</p>`;
}

function colorir(a: Atividade): string {
  const l = letterOf(a);
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
    <div><div style="font-size:4.4mm;color:#555">${esc(word.withArticle)}</div><div style="font-size:12mm">${esc(word.word.toLowerCase())}</div><div class="cur-pt" style="font-size:12mm;line-height:1.9">${esc(word.word.toLowerCase())}</div></div></div>`;
}

function palavras(a: Atividade): string {
  const l = letterOf(a);
  const list = letterWords(l);
  return list
    .map(
      (x) => `<div style="display:flex;align-items:center;gap:5mm;margin:1mm 0 0"><span class="emoji" style="font-size:12mm">${x.emoji}</span>
        <span style="font-size:7mm">${esc(x.word.toLowerCase())}</span><span style="font-size:4mm;color:#777">(${esc(x.withArticle)})</span></div>${cursiveRows([x.word.toLowerCase()], 3)}`,
    )
    .join("");
}

// ------------------------------------------------------------------ theme sheets

function numero(a: Atividade): string {
  const n = Number(a.slug.split("-")[1]);
  const word = NUMBERS[n];
  const cell = 6;
  // Three rows, each three squares: digits two squares high standing on a
  // grid line, then a free square.
  const grid = quadriculado(9, cell);
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
      <div><div style="font-size:12mm">${esc(word)}</div><div class="cur-pt" style="font-size:12mm;line-height:1.9">${esc(word)}</div></div></div>
    <p style="font-size:4.6mm;margin:2mm 0 1mm">Cubra o número e escreva no quadriculado:</p>
    ${grid.svg(rows)}
    <p style="font-size:4.6mm;margin:4mm 0 1mm">Pinte <strong>${n === 0 ? "nenhum balão" : `${n} ${n === 1 ? "balão" : "balões"}`}</strong>:</p>
    <svg width="${W}mm" height="${2 * balloonSize + 12}mm" viewBox="0 0 ${W} ${2 * balloonSize + 12}">${balloons}</svg>
    ${cursiveRows([word], 3, 3)}`;
}

function formaGeometrica(a: Atividade): string {
  const shape = SHAPES.find((s) => `forma-${s.slug}` === a.slug)!;
  const dashed = (content: string, width: number) => `<g fill="none" stroke="#6b7c93" stroke-width="${width}" stroke-dasharray="2 1.6" stroke-linecap="round">${content}</g>`;
  const small = Array.from({ length: 5 }, (_, i) => shapePath(shape.draw, 18 + i * 36, 18, 13)).join("");
  return `<div style="display:flex;align-items:center;gap:10mm">
      <svg width="95mm" height="85mm" viewBox="0 0 95 85">${dashed(shapePath(shape.draw, 47.5, 44, 34), 0.8)}</svg>
      <div><div style="font-size:12mm">${esc(shape.name)}</div><div class="cur-pt" style="font-size:12mm;line-height:1.9">${esc(shape.name)}</div></div></div>
    <p style="font-size:4.6mm;margin:3mm 0 1mm">Cubra as formas pequenas:</p>
    <svg width="${W}mm" height="38mm" viewBox="0 0 ${W} 38">${dashed(small, 0.6)}</svg>
    <p style="font-size:4.6mm;margin:3mm 0 1mm">Desenhe ${esc(shape.withArticle)} sozinho:</p>
    <div style="height:42mm;border:0.35mm dashed #c5ced9;border-radius:3mm"></div>
    <div style="margin-top:4mm">${cursiveRows([shape.name], 3, 3, false)}</div>`;
}

function cor(a: Atividade): string {
  const c = COLOURS.find((x) => `cor-${x.slug}` === a.slug)!;
  const plural = c.thing.withArticle.startsWith("as ") || c.thing.withArticle.startsWith("os ");
  return `<div style="display:flex;align-items:center;gap:6mm">
      <div style="width:18mm;height:18mm;border-radius:50%;background:${c.hex};border:0.35mm solid #1f2a44"></div>
      <div style="font-size:12mm;font-weight:700;color:${c.hex === "#FDD835" ? "#b89a00" : c.hex}">${esc(c.name)}</div>
      <div class="cur-pt" style="font-size:12mm;line-height:1.9">${esc(c.name)}</div></div>
    <svg width="${W}mm" height="140mm" viewBox="0 0 ${W} 140"><text x="${W / 2}" y="122" text-anchor="middle" font-family="emoji" font-size="128" fill="none" stroke="#1f2a44" stroke-width="0.5">${c.thing.emoji}</text></svg>
    <p style="font-size:4.6mm;margin:0 0 1mm">${esc(c.thing.withArticle.charAt(0).toUpperCase() + c.thing.withArticle.slice(1))} ${plural ? "são" : "é"} ${esc(c.name)}. Escreva a palavra:</p>
    ${cursiveRows([c.name], 3, 3)}`;
}

function frequentes(a: Atividade): string {
  const g = FREQUENT_WORD_GROUPS[Number(a.slug.split("-").pop()) - 1];
  const xh = 3;
  const r = caligrafia(g.words.length, xh);
  const rows = g.words.map((word, i) => fill({ text: word, x0: 2, x1: W - 2, y: r.baseline(i), size: 2 * xh, font: "cur-pt", kind: "model-grey", gap: 3 * xh, max: 3 })).join("");
  const words = `<div style="display:flex;gap:6mm;margin-bottom:4mm">${g.words.map((x) => `<span class="card" style="font-size:10mm;padding:1mm 5mm">${esc(x)}</span>`).join("")}</div>`;
  return (
    words +
    r.svg(rows) +
    `<p style="font-size:4.6mm;margin:6mm 0 2mm">Leia a frase e circule as palavras frequentes:</p>
    <p class="card" style="font-size:8mm;line-height:1.7;text-align:left;padding:4mm 6mm">${esc(g.sentence)}</p>
    <p style="font-size:4.6mm;margin:6mm 0 2mm">Escreva uma palavra frequente que você escolher:</p>${caligrafia(1, xh).svg("")}`
  );
}

function silabas(a: Atividade): string {
  const s = getSyllableSheet(a.syllables!)!;
  const rand = rng(a.slug);
  // Consonant(s) in blue, vowel in red; vowel-first groups (an, ar, ão) in one colour.
  const cell = (syl: string) =>
    s.split
      ? `<span style="color:#1d6fc2">${esc(syl.slice(0, syl.length - 1))}</span><span style="color:#c8323a">${esc(syl.slice(-1))}</span>`
      : `<span style="color:#1d6fc2">${esc(syl)}</span>`;
  const table = `<div class="grid" style="grid-template-columns:repeat(${s.syllables.length},1fr);gap:3mm">${s.syllables
    .map((syl) => `<div class="card" style="font-size:13mm;padding:2mm 0">${cell(syl)}</div>`)
    .join("")}</div>`;
  const note = s.note ? `<p style="font-size:4.2mm;color:#555;margin:2mm 0 0">${esc(s.note)}</p>` : "";
  const mixedLine = () => shuffle([...s.syllables, ...s.syllables.slice(0, Math.max(0, 5 - s.syllables.length))], rand).join("&nbsp;&nbsp;&nbsp;");
  const mixed = [mixedLine(), mixedLine()].map((line) => `<p style="font-size:9mm;margin:2.5mm 0;letter-spacing:0.3mm">${line}</p>`).join("");
  const words = `<div class="grid" style="grid-template-columns:repeat(${Math.min(s.words.length, 4)},1fr);gap:4mm;margin-top:3mm">${s.words
    .map((x) => `<div class="card"><div class="pic" style="font-size:18mm">${x.emoji}</div><div style="font-size:7.5mm;margin-top:2mm;white-space:nowrap">${x.word.split("|").map((p) => `<span class="syl">${esc(p)}</span>`).join("")}</div></div>`)
    .join("")}</div>`;
  const toWrite = s.syllables.length >= 3 ? [s.syllables[0], s.syllables[2]] : s.syllables.slice(0, 2);
  const xh = 3;
  const r = caligrafia(toWrite.length, xh);
  const rows = toWrite.map((t, i) => fill({ text: t, x0: 2, x1: W - 2, y: r.baseline(i), size: 2 * xh, font: "cur-pt", kind: "model-grey", gap: 3 * xh })).join("");
  return `${table}${note}<p style="font-size:4.6mm;margin:3mm 0 0">Leia as sílabas fora de ordem:</p>${mixed}<p style="font-size:4.6mm;margin:2mm 0 0">Leia as palavras:</p>${words}<p style="font-size:4.6mm;margin:4mm 0 1mm">Escreva as sílabas em letra cursiva:</p>${r.svg(rows)}`;
}

// ------------------------------------------------------------------ dispatch

export function atividadeBody(a: Atividade): string {
  switch (a.category) {
    case "letra-bastao":
      return bastao(a);
    case "letra-de-forma":
      return forma(a);
    case "letra-cursiva":
      return cursiva(a);
    case "reconhecer-letras":
      return reconhecer(a);
    case "silaba-inicial":
      return silabaInicial(a);
    case "colorir-letras":
      return colorir(a);
    case "escrever-palavras":
      return palavras(a);
    case "numeros":
      return numero(a);
    case "formas":
      return formaGeometrica(a);
    case "cores":
      return cor(a);
    case "palavras-frequentes":
      return frequentes(a);
    case "familias-silabicas":
    case "digrafos":
    case "sons-nasais":
    case "silabas-complexas":
      return silabas(a);
    default:
      throw new Error(`No template for ${a.category}`);
  }
}
