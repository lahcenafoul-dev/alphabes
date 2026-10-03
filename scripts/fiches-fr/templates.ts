// HTML/SVG templates for the French worksheet PDFs (see generate.ts). The
// Spanish templates (scripts/fichas-es) reuse the exported helpers.
// Every sheet is one A4 page, 180 mm wide inside its margins. SVG blocks use
// millimetres as user units, so font sizes and line positions are exact.
//
// Writing rows are <g class="fill"> placeholders: after the fonts load,
// layoutFills() (run in the browser) writes the model and repeats the grey
// copies until the line is full, measuring the real shaped text.
import { getFrenchLetter, type FrenchLetter, type FrenchWord } from "../../lib/letters-fr";
import { getFrenchSound, plainWord } from "../../lib/sons-fr";
import {
  COLOURS,
  LETTER_IMAGES,
  LOOK_ALIKES,
  MOTS_OUTILS_GROUPS,
  NUMBERS,
  SHAPES,
  SYLLABLE_SHEETS,
  SYLLABLE_VOWELS,
  getFicheCategory,
  imageDistractors,
  type Fiche,
} from "../../lib/fiches-fr";

export const W = 180; // inner width, mm
const GREY = "#b9b9b9";
export const OUTLINE = "#8c9bab";
export const BLUE_LINE = "#8fb3dc";
export const LIGHT_LINE = "#cfe0f2";

// Andika proportions (em): capital height and x-height.
export const CAP = 0.725;
export const XH = 0.508;

export const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

// ------------------------------------------------------------------ page

export function pageHtml(fiche: Fiche, body: string): string {
  const category = getFicheCategory(fiche.category)!;
  return `<section class="page">
  <header class="band"><span class="brand">AlphaBes.com</span><span class="kind">${esc(category.name)}</span></header>
  <div class="who"><span>Prénom : ....................................</span><span>Date : ........................</span></div>
  <h1>${esc(fiche.title)}</h1>
  <p class="consigne"><span class="pencil">✏️</span>${esc(fiche.consigne)}</p>
  <div class="body">${body}</div>
  <footer><span>${esc(category.level)}</span><span>Fiche gratuite · alphabes.com/fr/fiches</span></footer>
</section>`;
}

export const PAGE_CSS = `
@page { size: A4; margin: 0 }
* { box-sizing: border-box }
html, body { margin: 0; padding: 0; color: #1f2a44; font-family: script, sans-serif }
.page { width: 210mm; height: 297mm; padding: 0 15mm; position: relative; overflow: hidden; page-break-after: always; break-after: page }
.page:last-child { page-break-after: auto; break-after: auto }
.band { margin: 0 -15mm; height: 16mm; padding: 0 15mm; background: #3b82f6; color: #fff; display: flex; align-items: center; justify-content: space-between; font-weight: 700 }
.band .brand { font-size: 6mm } .band .kind { font-size: 4.2mm }
.who { margin-top: 5mm; display: flex; justify-content: space-between; font-size: 4mm; color: #555 }
h1 { margin: 5mm 0 0; font-size: 7.5mm; line-height: 1.15; font-weight: 700 }
.consigne { margin: 3mm 0 0; padding: 2.5mm 4mm; border-radius: 3mm; background: #fff6d6; font-size: 4.4mm; line-height: 1.35; display: flex; gap: 3mm; align-items: flex-start }
.pencil { font-family: emoji; font-size: 5mm; line-height: 1.1 }
.body { margin-top: 5mm }
footer { position: absolute; left: 15mm; right: 15mm; bottom: 7mm; display: flex; justify-content: space-between; font-size: 3.2mm; color: #999 }
svg { display: block; overflow: visible }
.emoji { font-family: emoji }
.cur { font-family: cursive-fr }
.grid { display: grid; gap: 4mm }
.card { border: 0.35mm solid #d5dbe3; border-radius: 3mm; text-align: center; padding: 3mm 2mm }
.card .pic { font-family: emoji; line-height: 1.1 }
.syl { display: inline-block; border-bottom: 0.5mm solid #1f2a44; border-radius: 0 0 50% 50% / 0 0 2.2mm 2.2mm; padding: 0 0.6mm 1.4mm; margin: 0 0.3mm }
`;

// ------------------------------------------------------------------ writing rows

export type FillKind = "model-grey" | "model-blank" | "grey" | "outline" | "model-outline";

/**
 * A writing row filled in the browser: model in black, then grey or outlined
 * copies. "cur" is the French cursive, "cur-es" the Spanish one
 * (scripts/fichas-es), "cur-pt" the Portuguese one (scripts/atividades-pt).
 */
export function fill(opts: { text: string; x0: number; x1: number; y: number; size: number; font: "cur" | "cur-es" | "cur-pt" | "script"; kind: FillKind; gap: number; max?: number }): string {
  const { text, x0, x1, y, size, font, kind, gap, max } = opts;
  return `<g class="fill" data-text="${esc(text)}" data-x0="${x0}" data-x1="${x1}" data-y="${y}" data-size="${size}" data-font="${font}" data-kind="${kind}" data-gap="${gap}" data-max="${max ?? 99}"></g>`;
}

/** Runs in the page (via page.evaluate) once the fonts are ready. */
export function layoutFills(): void {
  const NS = "http://www.w3.org/2000/svg";
  const families: Record<string, string> = { cur: "cursive-fr", "cur-es": "cursive-es", "cur-pt": "cursive-pt", script: "script" };
  document.querySelectorAll<SVGGElement>("g.fill").forEach((g) => {
    const d = g.dataset;
    const x1 = Number(d.x1);
    const gap = Number(d.gap);
    const max = Number(d.max);
    let x = Number(d.x0);
    let count = 0;
    const kind = d.kind!;
    const add = (style: "black" | "grey" | "outline"): boolean => {
      const t = document.createElementNS(NS, "text");
      t.textContent = d.text!;
      t.setAttribute("x", String(x));
      t.setAttribute("y", d.y!);
      t.setAttribute("font-family", families[d.font!]);
      t.setAttribute("font-size", d.size!);
      if (style === "outline") {
        // Stroke first, then a white fill over its inner half: hides the
        // overlapping contours some Andika letters have (Y, k…).
        t.setAttribute("fill", "#fff");
        t.setAttribute("paint-order", "stroke");
        t.setAttribute("stroke", "#8c9bab");
        t.setAttribute("stroke-width", "0.7");
      } else t.setAttribute("fill", style === "black" ? "#1f2a44" : "#b9b9b9");
      g.appendChild(t);
      const width = t.getComputedTextLength();
      if (x + width > x1 + 0.01) {
        g.removeChild(t);
        return false;
      }
      x += width + gap;
      return true;
    };
    if (kind.startsWith("model")) add("black");
    if (kind === "model-blank") return;
    const style = kind === "outline" || kind === "model-outline" ? "outline" : "grey";
    while (count < max && add(style)) count++;
  });
}

// ------------------------------------------------------------------ rulings

/** Seyès "grands carreaux": interline I mm, a darker line every 4, red margin. */
function seyes(rows: number, I: number, pitch = 8): { svg: (content: string) => string; baseline: (r: number) => number; height: number } {
  const height = rows * pitch * I;
  const lines: string[] = [];
  for (let k = 0; k <= rows * pitch; k++) {
    const y = k * I;
    const main = k % 4 === 0;
    lines.push(`<line x1="0" x2="${W}" y1="${y}" y2="${y}" stroke="${main ? BLUE_LINE : LIGHT_LINE}" stroke-width="${main ? 0.3 : 0.18}"/>`);
  }
  for (let x = 12 + 4 * I; x <= W; x += 4 * I) lines.push(`<line x1="${x}" x2="${x}" y1="0" y2="${height}" stroke="${LIGHT_LINE}" stroke-width="0.18"/>`);
  lines.push(`<line x1="12" x2="12" y1="0" y2="${height}" stroke="#e57373" stroke-width="0.3"/>`);
  return {
    height,
    // Baseline on the main line halfway down the row: 3 interlines above for
    // loops, 2 below for descenders.
    baseline: (r) => r * pitch * I + (pitch / 2) * I,
    svg: (content) => `<svg width="${W}mm" height="${height}mm" viewBox="0 0 ${W} ${height}">${lines.join("")}${content}</svg>`,
  };
}

/** Three-line guide for print letters: capital line, dashed x-height, baseline. */
function guideRows(rows: number, size: number, pitch: number): { svg: (content: string) => string; baseline: (r: number) => number; height: number } {
  const height = rows * pitch;
  const baseline = (r: number) => r * pitch + pitch * 0.82;
  const lines: string[] = [];
  for (let r = 0; r < rows; r++) {
    const b = baseline(r);
    lines.push(`<line x1="0" x2="${W}" y1="${b - size * CAP}" y2="${b - size * CAP}" stroke="${LIGHT_LINE}" stroke-width="0.3"/>`);
    lines.push(`<line x1="0" x2="${W}" y1="${b - size * XH}" y2="${b - size * XH}" stroke="${BLUE_LINE}" stroke-width="0.25" stroke-dasharray="1.5 1.5"/>`);
    lines.push(`<line x1="0" x2="${W}" y1="${b}" y2="${b}" stroke="#5b7fa8" stroke-width="0.35"/>`);
  }
  return { height, baseline, svg: (content) => `<svg width="${W}mm" height="${height}mm" viewBox="0 0 ${W} ${height}">${lines.join("")}${content}</svg>` };
}

// ------------------------------------------------------------------ helpers

/** Letters that go below the baseline need a higher baseline in fixed boxes. */
export const hasTail = (ch: string) => /[gjpqyçÇ]/.test(ch);

function letterOf(f: Fiche): FrenchLetter {
  return getFrenchLetter(f.letter!)!;
}

/** Deterministic pseudo-random numbers, so every run draws the same sheet. */
export function rng(seedText: string): () => number {
  let a = [...seedText].reduce((n, ch) => (n * 31 + ch.charCodeAt(0)) >>> 0, 2166136261);
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function shuffle<T>(items: T[], rand: () => number): T[] {
  const a = [...items];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pictureCard(word: FrenchWord, picSize: number, textSize: number): string {
  return `<div class="card"><div class="pic" style="font-size:${picSize}mm">${word.emoji}</div><div style="font-size:${textSize}mm;margin-top:1.5mm">${esc(plainWord(word.word))}</div></div>`;
}

/** Seyès rows per word: model + grey copies, then (unless `blank` is false) model + empty line. */
function wordRows(words: string[], I: number, greyMax = 99, blank = true): string {
  const per = blank ? 2 : 1;
  const s = seyes(words.length * per, I);
  const content = words
    .flatMap((word, i) => [
      fill({ text: word, x0: 14, x1: W - 2, y: s.baseline(i * per), size: 2 * I, font: "cur", kind: "model-grey", gap: 2.5 * I, max: greyMax }),
      ...(blank ? [fill({ text: word, x0: 14, x1: W - 2, y: s.baseline(i * per + 1), size: 2 * I, font: "cur", kind: "model-blank", gap: 0 })] : []),
    ])
    .join("");
  return s.svg(content);
}

// ------------------------------------------------------------------ letter sheets

function trace(f: Fiche): string {
  const l = letterOf(f);
  const word = l.words[0];
  const top = `<div style="display:flex;align-items:center;justify-content:space-between">
    <svg width="120mm" height="52mm" viewBox="0 0 120 52">
      <text x="2" y="${hasTail(l.upper) ? 36 : 44}" font-family="script" font-weight="700" font-size="${hasTail(l.upper) ? 46 : 56}" fill="#fff" paint-order="stroke" stroke="${OUTLINE}" stroke-width="1">${esc(l.upper)}</text>
      <text x="62" y="${hasTail(l.lower) ? 36 : 44}" font-family="script" font-weight="700" font-size="${hasTail(l.lower) ? 46 : 56}" fill="#fff" paint-order="stroke" stroke="${OUTLINE}" stroke-width="1">${esc(l.lower)}</text>
    </svg>
    <div style="text-align:center"><div class="emoji" style="font-size:24mm;line-height:1.1">${word.emoji}</div><div style="font-size:6mm">${esc(word.word.toLowerCase())}</div></div>
  </div>
  <div style="display:flex;gap:10mm;align-items:baseline;margin:2mm 0 3mm;font-size:4mm;color:#555">Les trois écritures :
    <span style="font-size:9mm;color:#1f2a44">${esc(l.upper)}</span><span style="font-size:9mm;color:#1f2a44">${esc(l.lower)}</span><span class="cur" style="font-size:8mm;color:#1f2a44">${esc(l.lower)}</span></div>`;
  const size = 21;
  const g = guideRows(6, size, 25);
  const rows = [
    fill({ text: l.upper, x0: 2, x1: W - 2, y: g.baseline(0), size, font: "script", kind: "model-outline", gap: 7 }),
    fill({ text: l.upper, x0: 2, x1: W - 2, y: g.baseline(1), size, font: "script", kind: "outline", gap: 7 }),
    fill({ text: l.upper, x0: 2, x1: W - 2, y: g.baseline(2), size, font: "script", kind: "model-blank", gap: 0 }),
    fill({ text: l.lower, x0: 2, x1: W - 2, y: g.baseline(3), size, font: "script", kind: "model-outline", gap: 7 }),
    fill({ text: l.lower, x0: 2, x1: W - 2, y: g.baseline(4), size, font: "script", kind: "outline", gap: 7 }),
    fill({ text: l.lower, x0: 2, x1: W - 2, y: g.baseline(5), size, font: "script", kind: "model-blank", gap: 0 }),
  ].join("");
  return top + g.svg(rows);
}

function cursive(f: Fiche): string {
  const l = letterOf(f);
  const word = l.words[0].word.toLowerCase();
  const I = 4;
  const s = seyes(6, I);
  const row = (r: number, text: string, kind: FillKind) =>
    fill({ text, x0: 14, x1: W - 2, y: s.baseline(r), size: 2 * I, font: "cur", kind, gap: 3 * I });
  const top = `<div style="display:flex;align-items:center;gap:8mm;margin-bottom:3mm">
    <div class="cur" style="font-size:12mm;line-height:normal;padding:0 4mm;border:0.35mm solid #d5dbe3;border-radius:3mm">${esc(l.upper)} ${esc(l.lower)}</div>
    <div class="emoji" style="font-size:14mm">${l.words[0].emoji}</div>
    <div style="font-size:4mm;color:#555;max-width:70mm">La minuscule, la majuscule, puis le mot <strong>${esc(word)}</strong>.</div></div>`;
  return (
    top +
    s.svg(
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

function reconnaissance(f: Fiche): string {
  const l = letterOf(f);
  const rand = rng(f.slug);
  const target = l.lower;
  const alikes = [...(LOOK_ALIKES[target] ?? "")];
  const others = [..."abcdefghijklmnopqrstuvwxyz"].filter((c) => c !== target && !alikes.includes(c));
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
      // Same box for every cell; cursive loops and tails need a taller line.
      const style = c.style === "cur" ? "font-size:7.5mm;line-height:normal" : "font-size:14mm;line-height:1";
      return `<div class="card ${c.style === "cur" ? "cur" : ""}" style="height:22mm;padding:0;display:flex;align-items:center;justify-content:center;${style}">${esc(text)}</div>`;
    })
    .join("");
  const legend = `<div style="display:flex;gap:8mm;align-items:center;margin-bottom:4mm;font-size:4.2mm">À trouver :
    <span class="card" style="font-size:11mm;padding:0 3mm">${esc(l.upper)}</span>
    <span class="card" style="font-size:11mm;padding:0 3mm">${esc(l.lower)}</span>
    <span class="card cur" style="font-size:6mm;padding:0 3mm;line-height:normal">${esc(l.lower)}</span></div>`;
  return legend + `<div class="grid" style="grid-template-columns:repeat(7,1fr);gap:3mm">${html}</div>`;
}

function son(f: Fiche): string {
  const images = LETTER_IMAGES[f.letter!];
  const rand = rng(f.slug);
  const items = shuffle([...images.yes, ...imageDistractors(f.letter!, 9 - images.yes.length)], rand);
  const l = letterOf(f);
  const model = `<div style="display:flex;align-items:center;gap:6mm;margin-bottom:5mm;font-size:5mm">
    <span class="card" style="font-size:14mm;padding:0 4mm">${esc(l.upper)} ${esc(l.lower)}</span>
    <span>comme</span>${pictureCard(images.yes[0], 14, 5)}</div>`;
  return model + `<div class="grid" style="grid-template-columns:repeat(3,1fr);gap:5mm">${items.map((w) => pictureCard(w, 30, 6)).join("")}</div>`;
}

function coloriage(f: Fiche): string {
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
    <div><div style="font-size:4.4mm;color:#555">${esc(word.withArticle)}</div><div style="font-size:12mm">${esc(word.word.toLowerCase())}</div><div class="cur" style="font-size:12mm;line-height:1.6">${esc(word.word.toLowerCase())}</div></div></div>`;
}

/** The letter's words, then the "son" worksheet's, three at most. */
export function letterWords(l: FrenchLetter): FrenchWord[] {
  const out: FrenchWord[] = [];
  for (const w of [...l.words, ...(l.wordsInside ?? []), ...(LETTER_IMAGES[l.slug]?.yes ?? [])]) {
    if (out.length < 3 && !out.some((o) => o.word.toLowerCase() === w.word.toLowerCase())) out.push(w);
  }
  return out;
}

function mots(f: Fiche): string {
  const l = letterOf(f);
  const I = 3;
  const list = letterWords(l);
  const words = list
    .map(
      (w) => `<div style="display:flex;align-items:center;gap:5mm;margin:1mm 0 1mm"><span class="emoji" style="font-size:12mm">${w.emoji}</span>
        <span style="font-size:7mm">${esc(w.word.toLowerCase())}</span><span style="font-size:4mm;color:#777">(${esc(w.withArticle)})</span></div>${wordRows([w.word.toLowerCase()], I)}`,
    )
    .join("");
  // With fewer than three words there's room for a free line.
  const free = list.length < 3 ? `<p style="font-size:4.6mm;margin:3mm 0 1mm">Écris un autre mot avec la lettre ${esc(l.lower)} :</p>${seyes(1, I).svg("")}` : "";
  return words + free;
}

// ------------------------------------------------------------------ theme sheets

function nombre(f: Fiche): string {
  const n = Number(f.slug.split("-")[1]);
  const word = NUMBERS[n];
  const size = 21;
  const g = guideRows(2, size, 25);
  const balloons = Array.from({ length: 10 }, (_, i) => {
    const x = 9 + (i % 5) * 36;
    const y = i < 5 ? 26 : 58;
    return `<text x="${x}" y="${y}" text-anchor="middle" font-family="emoji" font-size="24" fill="none" stroke="#1f2a44" stroke-width="0.35">🎈</text>`;
  }).join("");
  return `<div style="display:flex;align-items:center;gap:12mm">
      <svg width="60mm" height="56mm" viewBox="0 0 60 56"><text x="30" y="50" text-anchor="middle" font-family="script" font-weight="700" font-size="66" fill="#fff" paint-order="stroke" stroke="${OUTLINE}" stroke-width="1">${n}</text></svg>
      <div><div style="font-size:12mm">${esc(word)}</div><div class="cur" style="font-size:12mm;line-height:1.6">${esc(word)}</div></div></div>
    ${g.svg(
      [
        fill({ text: String(n), x0: 2, x1: W - 2, y: g.baseline(0), size, font: "script", kind: "model-outline", gap: 8 }),
        fill({ text: String(n), x0: 2, x1: W - 2, y: g.baseline(1), size, font: "script", kind: "model-blank", gap: 0 }),
      ].join(""),
    )}
    <p style="font-size:4.6mm;margin:4mm 0 1mm">Colorie <strong>${n === 0 ? "aucun ballon" : `${n} ballon${n > 1 ? "s" : ""}`}</strong> :</p>
    <svg width="${W}mm" height="64mm" viewBox="0 0 ${W} 64">${balloons}</svg>
    ${wordRows([word], 3, 3)}`;
}

export function shapePath(slug: string, cx: number, cy: number, r: number): string {
  switch (slug) {
    case "rond":
      return `<circle cx="${cx}" cy="${cy}" r="${r}"/>`;
    case "carre":
      return `<rect x="${cx - r}" y="${cy - r}" width="${2 * r}" height="${2 * r}"/>`;
    case "rectangle":
      return `<rect x="${cx - 1.4 * r}" y="${cy - 0.8 * r}" width="${2.8 * r}" height="${1.6 * r}"/>`;
    case "triangle":
      return `<polygon points="${cx},${cy - r} ${cx + r * 1.1},${cy + r * 0.85} ${cx - r * 1.1},${cy + r * 0.85}"/>`;
    case "losange":
      return `<polygon points="${cx},${cy - r} ${cx + r * 0.75},${cy} ${cx},${cy + r} ${cx - r * 0.75},${cy}"/>`;
    case "ovale":
      return `<ellipse cx="${cx}" cy="${cy}" rx="${r * 1.35}" ry="${r * 0.85}"/>`;
    case "etoile": {
      const pts = Array.from({ length: 10 }, (_, i) => {
        const a = -Math.PI / 2 + (i * Math.PI) / 5;
        const rr = i % 2 === 0 ? r : r * 0.45;
        return `${(cx + rr * Math.cos(a)).toFixed(2)},${(cy + rr * Math.sin(a)).toFixed(2)}`;
      });
      return `<polygon points="${pts.join(" ")}"/>`;
    }
    case "coeur":
      return `<path d="M ${cx} ${cy + r * 0.9} C ${cx - r * 1.5} ${cy - r * 0.1}, ${cx - r * 0.8} ${cy - r * 1.3}, ${cx} ${cy - r * 0.45} C ${cx + r * 0.8} ${cy - r * 1.3}, ${cx + r * 1.5} ${cy - r * 0.1}, ${cx} ${cy + r * 0.9} Z"/>`;
    default:
      throw new Error(`Unknown shape ${slug}`);
  }
}

function forme(f: Fiche): string {
  const shape = SHAPES.find((s) => `forme-${s.slug}` === f.slug)!;
  const dashed = (content: string, width: number) => `<g fill="none" stroke="#6b7c93" stroke-width="${width}" stroke-dasharray="2 1.6" stroke-linecap="round">${content}</g>`;
  const small = Array.from({ length: 5 }, (_, i) => shapePath(shape.slug, 18 + i * 36, 18, 13)).join("");
  return `<div style="display:flex;align-items:center;gap:10mm">
      <svg width="95mm" height="85mm" viewBox="0 0 95 85">${dashed(shapePath(shape.slug, 47.5, 44, 34), 0.8)}</svg>
      <div><div style="font-size:12mm">${esc(shape.name)}</div><div class="cur" style="font-size:12mm;line-height:1.6">${esc(shape.name)}</div></div></div>
    <p style="font-size:4.6mm;margin:3mm 0 1mm">Repasse les petites formes :</p>
    <svg width="${W}mm" height="38mm" viewBox="0 0 ${W} 38">${dashed(small, 0.6)}</svg>
    <p style="font-size:4.6mm;margin:3mm 0 1mm">Dessine ${esc(shape.withArticle)} tout seul :</p>
    <div style="height:42mm;border:0.35mm dashed #c5ced9;border-radius:3mm"></div>
    <div style="margin-top:4mm">${wordRows([shape.name], 3, 3, false)}</div>`;
}

function couleur(f: Fiche): string {
  const c = COLOURS.find((x) => `couleur-${x.slug}` === f.slug)!;
  return `<div style="display:flex;align-items:center;gap:6mm">
      <div style="width:18mm;height:18mm;border-radius:50%;background:${c.hex};border:0.35mm solid #1f2a44"></div>
      <div style="font-size:12mm;font-weight:700;color:${c.hex === "#FDD835" ? "#b89a00" : c.hex}">${esc(c.name)}</div>
      <div class="cur" style="font-size:12mm;line-height:1.6">${esc(c.name)}</div></div>
    <svg width="${W}mm" height="140mm" viewBox="0 0 ${W} 140"><text x="${W / 2}" y="122" text-anchor="middle" font-family="emoji" font-size="128" fill="none" stroke="#1f2a44" stroke-width="0.5">${c.thing.emoji}</text></svg>
    <p style="font-size:4.6mm;margin:0 0 1mm">${esc(c.thing.withArticle.charAt(0).toUpperCase() + c.thing.withArticle.slice(1))} est ${esc(c.name)}. Écris le mot :</p>
    ${wordRows([c.name], 3, 3)}`;
}

function motsOutils(f: Fiche): string {
  const g = MOTS_OUTILS_GROUPS[Number(f.slug.split("-").pop()) - 1];
  const I = 3;
  const s = seyes(g.words.length, I);
  const rows = g.words.map((word, i) => fill({ text: word, x0: 14, x1: W - 2, y: s.baseline(i), size: 2 * I, font: "cur", kind: "model-grey", gap: 3 * I, max: 3 })).join("");
  const words = `<div style="display:flex;gap:6mm;margin-bottom:4mm">${g.words.map((w) => `<span class="card" style="font-size:10mm;padding:1mm 5mm">${esc(w)}</span>`).join("")}</div>`;
  return (
    words +
    s.svg(rows) +
    `<p style="font-size:4.6mm;margin:6mm 0 2mm">Lis la phrase et entoure les mots-outils :</p>
    <p class="card" style="font-size:8mm;line-height:1.7;text-align:left;padding:4mm 6mm">${esc(g.sentence)}</p>
    <p style="font-size:4.6mm;margin:6mm 0 2mm">Écris un mot-outil de ton choix :</p>${seyes(1, I).svg("")}`
  );
}

function syllabes(f: Fiche): string {
  const sheet = SYLLABLE_SHEETS.find((s) => `syllabes-${s.consonant}` === f.slug)!;
  const rand = rng(f.slug);
  const syl = SYLLABLE_VOWELS.map((v) => sheet.consonant + v);
  const table = `<div class="grid" style="grid-template-columns:repeat(6,1fr);gap:3mm">${syl
    .map((s) => `<div class="card" style="font-size:13mm;padding:2mm 0"><span style="color:#1d6fc2">${esc(sheet.consonant)}</span><span style="color:#c8323a">${esc(s.slice(1))}</span></div>`)
    .join("")}</div>`;
  const mixed = [0, 1].map(() => shuffle(syl, rand).join("&nbsp;&nbsp;&nbsp;")).map((line) => `<p style="font-size:9mm;margin:3mm 0;letter-spacing:0.3mm">${line}</p>`).join("");
  const words = `<div class="grid" style="grid-template-columns:repeat(${Math.min(sheet.words.length, 4)},1fr);gap:4mm;margin-top:3mm">${sheet.words
    .map((w) => `<div class="card"><div class="pic" style="font-size:18mm">${w.emoji}</div><div style="font-size:8mm;margin-top:2mm">${w.word.split("|").map((p) => `<span class="syl">${esc(p)}</span>`).join("")}</div></div>`)
    .join("")}</div>`;
  const I = 3;
  const s = seyes(2, I);
  const rows = [syl[0], syl[2]].map((t, i) => fill({ text: t, x0: 14, x1: W - 2, y: s.baseline(i), size: 2 * I, font: "cur", kind: "model-grey", gap: 3 * I })).join("");
  return `${table}<p style="font-size:4.6mm;margin:4mm 0 0">Lis les syllabes dans le désordre :</p>${mixed}<p style="font-size:4.6mm;margin:3mm 0 0">Lis les mots :</p>${words}<p style="font-size:4.6mm;margin:5mm 0 1mm">Écris les syllabes :</p>${s.svg(rows)}`;
}

function sonSheet(f: Fiche): string {
  const sound = getFrenchSound(f.sound!)!;
  const words = sound.words!;
  const cards = `<div class="grid" style="grid-template-columns:repeat(3,1fr);gap:4mm">${words
    .map((w) => `<div class="card" style="padding:2mm"><div class="pic" style="font-size:15mm">${w.emoji}</div><div style="font-size:8.5mm;margin-top:1mm;letter-spacing:0.4mm">${esc(plainWord(w.word))}</div></div>`)
    .join("")}</div>`;
  const heading = `<div style="display:flex;align-items:center;gap:6mm;margin-bottom:4mm">
    <span class="card" style="font-size:13mm;padding:0 5mm">${esc(sound.short)}</span>
    <span style="font-size:4.6mm;color:#555">${esc([sound.spellings, sound.ipa && `on entend ${sound.ipa}`].filter(Boolean).join(" · "))}</span></div>`;
  const sentence = sound.sentence ? `<p style="font-size:4.6mm;margin:5mm 0 2mm">Lis la phrase :</p><p class="card" style="font-size:8mm;line-height:1.6;text-align:left;padding:3mm 6mm">${esc(sound.sentence)}</p>` : "";
  const toWrite = words.slice(0, 2).map((w) => plainWord(w.word));
  const I = 3;
  const s = seyes(2, I);
  const rows = toWrite.map((t, i) => fill({ text: t, x0: 14, x1: W - 2, y: s.baseline(i), size: 2 * I, font: "cur", kind: "model-grey", gap: 3 * I })).join("");
  return `${heading}${cards}${sentence}<p style="font-size:4.6mm;margin:5mm 0 1mm">Écris les mots :</p>${s.svg(rows)}`;
}

// ------------------------------------------------------------------ dispatch

export function ficheBody(f: Fiche): string {
  switch (f.category) {
    case "trace-des-lettres":
      return trace(f);
    case "ecriture-cursive":
      return cursive(f);
    case "reconnaissance-des-lettres":
      return reconnaissance(f);
    case "son-des-lettres":
      return son(f);
    case "coloriage-des-lettres":
      return coloriage(f);
    case "ecrire-des-mots":
      return mots(f);
    case "nombres":
      return nombre(f);
    case "formes":
      return forme(f);
    case "couleurs":
      return couleur(f);
    case "mots-outils":
      return motsOutils(f);
    case "syllabes":
      return syllabes(f);
    case "sons":
      return sonSheet(f);
    default:
      throw new Error(`No template for ${f.category}`);
  }
}
