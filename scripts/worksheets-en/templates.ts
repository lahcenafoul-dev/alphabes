// The English letter tracing page (see generate.ts): the shared layout in
// scripts/tracing-layout.ts on US Letter, with the letter's first example word.
import type { LetterContent } from "../../lib/letters-data";
import { pictureKey } from "../../lib/picture-key";
import { TRACING_CSS, tracingSheet } from "../tracing-layout";

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
    title: `Letter ${U} Tracing`,
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
