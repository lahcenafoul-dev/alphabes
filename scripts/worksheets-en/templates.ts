// The English letter pages (see generate.ts): the shared layout in
// scripts/tracing-layout.ts on US Letter, with the letter's first example word.
import { getAllLetterSlugs, getLetterContent, type LetterContent } from "../../lib/letters-data";
import { pictureKey } from "../../lib/picture-key";
import { esc, rng, shuffle } from "../fiches-fr/templates";
import { picturePrint } from "../picture-emoji";
import { TRACING_CSS, tracingSheet, type TracingRow } from "../tracing-layout";

export const PAGE_CSS = `
@page { size: letter; margin: 0 }
* { box-sizing: border-box }
html, body { margin: 0; padding: 0; background: #fff }
.page { page-break-after: always; break-after: page }
.page:last-child { page-break-after: auto; break-after: auto }
${TRACING_CSS}
`;

export function tracingPage(letter: LetterContent): string {
  const { uppercase: U, lowercase: l } = letter;
  const word = letter.exampleWords[0].word;
  return tracingSheet({
    page: "letter",
    badge: U,
    title: sheetTitle("tracing", U),
    name: "Name:",
    date: "Date:",
    pair: `${U}${l}`,
    isFor: `${U} is for `,
    word,
    letter: U,
    picture: pictureKey(word),
    rows: [
      { label: `Trace the uppercase ${U}`, text: U, kind: "letter" },
      { label: `Trace the lowercase ${l}`, text: l, kind: "letter" },
      { label: "Trace the word", text: word, kind: "word" },
      { label: "Now write it on your own", text: "", kind: "own" },
    ],
    footer: ["alphabes.com · Free printable alphabet worksheets", `Letter ${U}`],
  });
}

// ------------------------------------------------------------------ other letter sheets
//
// Same header and hero as the tracing sheet, with each type's own exercises
// below, as on the earlier static PDFs: the other letters are the ones 5, 11
// and 17 places on (E: J, P, V), each shown by its first example word.

export const SHEET_TYPES = ["tracing", "beginning-sounds", "matching", "recognition", "writing-practice", "missing-letter", "cursive"] as const;
export type SheetType = (typeof SHEET_TYPES)[number];

const SLUGS = getAllLetterSlugs();
const firstWord = (slug: string) => getLetterContent(slug)!.exampleWords[0].word;
const pic = (word: string) => picturePrint(pictureKey(word));
const others = (slug: string, offsets = [5, 11, 17]) => offsets.map((o) => SLUGS[(SLUGS.indexOf(slug) + o) % SLUGS.length]);

const tiles = (items: string[], cls = "", small = false) => `<div class="tp-tiles${small ? " tp-small" : ""}">${items.map((i) => `<div class="tp-tile${cls}">${i}</div>`).join("")}</div>`;
const STARS: TracingRow = { label: "", kind: "html", html: `<div class="tp-stars">How did I do? <b>★</b><b>★</b><b>★</b></div>` };

/** Two columns to join with a line: the left items in order, the right ones shuffled. */
function matchColumns(left: string[], right: string[], seed: string, rightCls = ""): string {
  const order = shuffle(
    right.map((_, i) => i),
    rng(seed),
  );
  // Never leave a pair face to face.
  while (order.some((o, i) => o === i)) order.push(order.shift()!);
  const col = (items: string[], cls: string, dotFirst: boolean) =>
    `<div>${items
      .map((i) => `<div class="tp-item">${dotFirst ? `<span class="tp-dot"></span>` : ""}<div class="tp-tile${cls}">${i}</div>${dotFirst ? "" : `<span class="tp-dot"></span>`}</div>`)
      .join("")}</div>`;
  return `<div class="tp-match">${col(left, " tp-letter", false)}${col(
    order.map((o) => right[o]),
    rightCls,
    true,
  )}</div>`;
}

/** Up to three words to complete: the letter's word, then other letters' words that contain it. */
function missingWords(letter: LetterContent): { word: string; at: number }[] {
  const words = [{ word: letter.exampleWords[0].word, at: 0 }];
  for (const slug of SLUGS) {
    if (words.length === 3) break;
    if (slug === letter.slug) continue;
    const w = firstWord(slug);
    const at = w.toLowerCase().indexOf(letter.lowercase);
    if (at > 0) words.push({ word: w, at });
  }
  return words;
}

function exercises(type: Exclude<SheetType, "tracing">, letter: LetterContent): TracingRow[] {
  const { uppercase: U, lowercase: l, slug } = letter;
  const word = letter.exampleWords[0].word;
  const trace: TracingRow = { label: `Trace the letter ${U}`, text: U, kind: "letter", size: 18 };
  const own: TracingRow = { label: "Now write it on your own", text: "", kind: "own", size: 13 };
  switch (type) {
    case "beginning-sounds": {
      const [a, b, c] = others(slug).map(firstWord);
      return [
        { label: `Circle the pictures that start with ${U}`, kind: "html", html: tiles([word, a, word, b, c].map(pic)) },
        { ...trace, size: 22 },
        { ...own, size: 15 },
        STARS,
      ];
    }
    case "matching": {
      const pairs = [slug, ...others(slug)];
      const choices = shuffle([word, ...others(slug, [3, 8, 20]).map(firstWord)], rng(`${slug}-circle`));
      return [
        {
          label: "Match each letter to its picture",
          kind: "html",
          html: matchColumns(
            pairs.map((s) => s.toUpperCase()),
            pairs.map((s) => pic(firstWord(s))),
            `${slug}-match`,
          ),
        },
        { label: `Which picture starts with ${U}? Circle it`, kind: "html", html: tiles(choices.map(pic), "", true) },
        { ...trace, size: 15 },
        { ...own, size: 11 },
        STARS,
      ];
    }
    case "recognition": {
      const rand = rng(`${slug}-find`);
      const fillers = shuffle(
        SLUGS.filter((s) => s !== slug),
        rand,
      )
        .slice(0, 5)
        .map((s, i) => (i % 2 ? s : s.toUpperCase()));
      // Spread the targets out: at most two side by side.
      const isTarget = (ch: string) => ch === U || ch === l;
      let grid = shuffle([U, U, U, l, l, ...fillers], rand);
      while (grid.some((ch, i) => i > 1 && isTarget(ch) && isTarget(grid[i - 1]) && isTarget(grid[i - 2]))) grid = shuffle(grid, rand);
      const pairs = [slug, ...others(slug)];
      return [
        { label: `Circle every ${U} and ${l} you see`, kind: "html", html: tiles(grid, " tp-letter") },
        { label: "How many did you find?", kind: "html", html: `<p class="tp-count">I found <span></span> letters ${U}.</p>` },
        {
          label: "Match each uppercase letter to its lowercase",
          kind: "html",
          html: matchColumns(
            pairs.map((s) => s.toUpperCase()),
            pairs,
            `${slug}-case`,
            " tp-letter",
          ),
        },
        STARS,
      ];
    }
    case "writing-practice":
      return [
        ...Array.from({ length: 4 }, (_, i): TracingRow => ({ label: i ? "" : `Write ${U}${l} on every line`, text: `${U}${l}`, kind: "letter", size: 16 })),
        { label: "Practice the word", text: word, kind: "word" },
        STARS,
      ];
    case "missing-letter":
      return [
        {
          label: `Fill in the missing letter ${U}`,
          kind: "html",
          html: `<div class="tp-missing">${missingWords(letter)
            .map(({ word: w, at }) => `<div><span class="tp-pic-s">${pic(w)}</span><span>${esc(w.slice(0, at))}<span class="tp-gap"></span>${esc(w.slice(at + 1))}</span></div>`)
            .join("")}</div>`,
        },
        trace,
        own,
        STARS,
      ];
    case "cursive":
      return [
        { label: `Trace the cursive uppercase ${U}`, text: U, kind: "letter", size: 13, font: "cur-en" },
        { label: `Trace the cursive lowercase ${l}`, text: l, kind: "letter", size: 13, font: "cur-en" },
        { label: "Trace the word in cursive", text: word, kind: "word", size: word.length > 7 ? 9 : 11, font: "cur-en" },
        { label: "Now write it on your own", text: "", kind: "own", size: 11, font: "cur-en" },
      ];
  }
}

const TITLES: Record<SheetType, (U: string) => string> = {
  tracing: (U) => `Letter ${U} Tracing`,
  "beginning-sounds": (U) => `Letter ${U} Beginning Sounds`,
  matching: (U) => `Letter ${U} Picture Matching`,
  recognition: (U) => `Letter ${U} Recognition`,
  "writing-practice": (U) => `Letter ${U} Handwriting`,
  "missing-letter": (U) => `Letter ${U} Missing Letter`,
  cursive: (U) => `Letter ${U} Cursive`,
};

/** "Letter E Beginning Sounds": the sheet's heading. */
export const sheetTitle = (type: SheetType, U: string) => TITLES[type](U);

export function letterPage(type: SheetType, letter: LetterContent): string {
  if (type === "tracing") return tracingPage(letter);
  const { uppercase: U, lowercase: l } = letter;
  const word = letter.exampleWords[0].word;
  return tracingSheet({
    page: "letter",
    badge: U,
    title: sheetTitle(type, U),
    name: "Name:",
    date: "Date:",
    pair: `${U}${l}`,
    pairCursive: type === "cursive",
    isFor: `${U} is for `,
    word,
    letter: U,
    picture: pictureKey(word),
    rows: exercises(type, letter),
    footer: ["alphabes.com · Free printable alphabet worksheets", `Letter ${U}`],
  });
}
