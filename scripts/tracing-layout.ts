// The letter tracing sheet layout shared by the English, French, Spanish and
// Portuguese PDFs (scripts/worksheets-en, fiches-fr, fichas-es, atividades-pt):
//   - a header with a coloured letter badge, the title and Name/Date lines;
//   - a hero with the big letter pair ("Ee") in Baloo 2, "E is for Elephant"
//     with the letter coloured, and the word's cartoon at a third of the width;
//   - dotted tracing rows (the letter, then the word) and a plain row to write
//     on one's own, spread over the rest of the page;
//   - a small footer.
// Each language passes its own words; the page is US Letter (English) or A4.
// The shells must declare the "display" (Baloo 2) and "script" (Andika) fonts.
import { CAP, XH, esc, fill } from "./fiches-fr/templates";
import { pictureEmoji, pictureHero } from "./picture-emoji";

const INK = "#1f2a44";

// The site's crayon colours (components/WordIllustration.tsx), each at least
// 4.9:1 on white, so the badge's white letter and the coloured initial read well.
const COLOURS = ["#D1343A", "#1F6FB8", "#25803F", "#6D3FD9", "#B9520E"];
const colourOf = (letter: string) => COLOURS[(letter.toUpperCase().charCodeAt(0) - 65 + COLOURS.length * 10) % COLOURS.length];

const PAGES = {
  letter: { width: 215.9, height: 279.4, margin: 15.95 },
  a4: { width: 210, height: 297, margin: 15 },
};

/** Scoped to [data-tp], so it can sit next to a language's own page CSS. */
export const TRACING_CSS = `
[data-tp] { position: relative; overflow: hidden; background: #fff; color: ${INK}; display: flex; flex-direction: column; font-family: script, sans-serif }
[data-tp] .tp-display { font-family: display, script, sans-serif }
[data-tp] .tp-top { display: flex; align-items: center; gap: 5mm }
[data-tp] .tp-badge { width: 15mm; height: 15mm; border-radius: 4mm; color: #fff; display: flex; align-items: center; justify-content: center; font-size: 11mm; font-weight: 800; line-height: 1; padding-top: 1.2mm; flex: none }
[data-tp] .tp-title { margin: 0; font-size: 10mm; font-weight: 800; line-height: 1 }
[data-tp] .tp-brand { margin-left: auto; font-size: 5.5mm; font-weight: 700; color: #3b82f6 }
[data-tp] .tp-who { margin-top: 6mm; display: flex; gap: 10mm; font-size: 4.2mm; color: #4b5563 }
[data-tp] .tp-who span { flex: 1; display: flex; gap: 2mm; align-items: flex-end }
[data-tp] .tp-who span::after { content: ""; flex: 1; border-bottom: 0.3mm solid #9aa6b5; height: 4mm }
[data-tp] .tp-who span.tp-date { flex: 0 0 58mm }
[data-tp] .tp-hero { margin-top: 8mm; display: flex; align-items: center; justify-content: space-between; gap: 6mm }
[data-tp] .tp-pair { font-size: 46mm; font-weight: 800; line-height: 0.9; letter-spacing: 1mm }
[data-tp] .tp-isfor { margin-top: 3mm; font-size: 8mm; font-weight: 600; line-height: 1.1 }
[data-tp] .tp-pic { width: 64mm; height: 64mm; object-fit: contain; display: block; flex: none }
[data-tp] .tp-pic.tp-emoji { font-family: emoji; font-size: 52mm; line-height: 64mm; text-align: center }
[data-tp] .tp-rows { flex: 1; display: flex; flex-direction: column; justify-content: space-evenly; padding: 4mm 0 2mm }
[data-tp] .tp-label { font-size: 4.2mm; color: #4b5563; margin: 0 0 1mm }
[data-tp] .tp-rows svg { display: block; overflow: visible }
/* Tracing copies: layoutFills draws them as outlined letters; dash the outline. */
[data-tp] .tp-rows text[paint-order] { stroke-dasharray: 1.6 1.1; stroke-linecap: round; stroke-width: 0.9px; stroke: #8c9bab }
[data-tp] .tp-footer { position: static; display: flex; justify-content: space-between; font-size: 3.6mm; color: #374151; padding-bottom: 8mm }
`;

export type TracingRow = { label: string; text: string; kind: "letter" | "word" | "own" };

export type TracingSheet = {
  page: "letter" | "a4";
  /** The badge letter. */
  badge: string;
  title: string;
  /** "Name:" and "Date:" in the sheet's language. */
  name: string;
  date: string;
  /** The big letters, e.g. "Ee". */
  pair: string;
  /** "E is for ", "E comme "… */
  isFor: string;
  /** The word; its first occurrence of `letter` is coloured. */
  word: string;
  letter: string;
  /** The word's picture key (public/words/<key>.webp), or its emoji if there is none. */
  picture: string;
  rows: TracingRow[];
  footer: [string, string];
};

/** One handwriting row: capital line, dashed x-height and baseline, with room above. */
function row(width: number, size: number, content: (baseline: number) => string): string {
  const height = size * 1.25;
  const b = size * 0.98;
  const lines = [
    `<line x1="0" x2="${width}" y1="${b - size * CAP}" y2="${b - size * CAP}" stroke="#cfe0f2" stroke-width="0.35"/>`,
    `<line x1="0" x2="${width}" y1="${b - size * XH}" y2="${b - size * XH}" stroke="#8fb3dc" stroke-width="0.3" stroke-dasharray="1.6 1.6"/>`,
    `<line x1="0" x2="${width}" y1="${b}" y2="${b}" stroke="#5b7fa8" stroke-width="0.4"/>`,
  ];
  return `<svg width="${width}mm" height="${height}mm" viewBox="0 0 ${width} ${height}">${lines.join("")}${content(b)}</svg>`;
}

/** The word with the first occurrence of the letter coloured ("Elephant", "maçã"). */
function colouredWord(word: string, letter: string, colour: string): string {
  const i = word.toLowerCase().indexOf(letter.toLowerCase());
  if (i < 0) return esc(word);
  return `${esc(word.slice(0, i))}<span style="color:${colour}">${esc(word.slice(i, i + letter.length))}</span>${esc(word.slice(i + letter.length))}`;
}

export function tracingSheet(s: TracingSheet): string {
  const page = PAGES[s.page];
  const width = Math.round((page.width - 2 * page.margin) * 10) / 10;
  const colour = colourOf(s.letter.normalize("NFD").charAt(0));
  const src = pictureHero(s.picture);
  const picture = src ? `<img class="tp-pic" src="${src}" alt="">` : `<div class="tp-pic tp-emoji">${pictureEmoji(s.picture)}</div>`;
  const size = 22;
  const rows = s.rows
    .map((r) => {
      // The word is smaller, so the model and at least one dotted copy fit.
      const rowSize = r.kind === "letter" ? size : r.text.length > 8 ? 11 : r.text.length > 6 ? 13 : 15;
      const svg =
        r.kind === "own"
          ? row(width, 15, () => "")
          : row(width, rowSize, (y) => fill({ text: r.text, x0: 1, x1: width - 1, y, size: rowSize, font: "script", kind: "model-outline", gap: r.kind === "letter" ? 9 : 8 }));
      return `<div><p class="tp-label">${esc(r.label)}</p>${svg}</div>`;
    })
    .join("");
  return `<section class="page" data-tp style="width:${page.width}mm;height:${page.height}mm;padding:12mm ${page.margin}mm 0">
  <div class="tp-top tp-display">
    <div class="tp-badge" style="background:${colour}">${esc(s.badge)}</div>
    <h1 class="tp-title">${esc(s.title)}</h1>
    <span class="tp-brand">AlphaBes</span>
  </div>
  <div class="tp-who"><span>${esc(s.name)}</span><span class="tp-date">${esc(s.date)}</span></div>
  <div class="tp-hero">
    <div class="tp-display">
      <div class="tp-pair">${esc(s.pair)}</div>
      <div class="tp-isfor">${esc(s.isFor)}${colouredWord(s.word, s.letter, colour)}</div>
    </div>
    ${picture}
  </div>
  <div class="tp-rows">${rows}</div>
  <footer class="tp-footer"><span>${esc(s.footer[0])}</span><span>${esc(s.footer[1])}</span></footer>
</section>`;
}
