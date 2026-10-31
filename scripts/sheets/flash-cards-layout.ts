// The flash card sets (data/worksheets/flash-cards.ts): four 9 cm cards per
// page in a 2 × 2 grid of shared dashed cut lines, each card a picture in a
// coloured frame with its word below (or alone, in the sets without words).
// Pages a set doesn't fill end with blank cards to draw on.
import { CARDS_PER_PAGE, type Card, type Feeling, type FlashCardsSheet } from "../../data/worksheets/flash-cards";
import type { SheetLocale } from "../../lib/sheets/types";
import { picturePrint } from "../picture-emoji";
import { BRIGHT, INK, MUTED, esc, typo, type SheetPart } from "./chrome";
import { scissorsSvg } from "./shapes";

type Box = { w: number; h: number };

/** The card's side, in mm. */
const CARD = 90;

export const FLASH_CSS = `
.fc-grid { position: relative; display: grid; grid-template-columns: repeat(2, ${CARD}mm); grid-auto-rows: ${CARD}mm; border: 0.45mm dashed #8f89b3 }
.fc-card { display: flex; padding: 4mm; border-right: 0.45mm dashed #8f89b3; border-bottom: 0.45mm dashed #8f89b3 }
.fc-card:nth-child(2n+1) { border-right-width: 0.45mm }
.fc-card:nth-child(2n+2) { border-right: 0 }
.fc-card:nth-child(n+3) { border-bottom: 0 }
.fc-face { flex: 1; border: 1.6mm solid; border-radius: 6mm; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 3mm }
.fc-word { font-family: display; font-weight: 800; font-size: 10mm; line-height: 1; padding-top: 0.1em; color: ${INK}; text-align: center }
.fc-blank { font-size: 4.2mm; color: ${MUTED}; font-weight: 700; text-align: center; padding: 0 6mm }
.fc-scissors { position: absolute; top: -6mm; left: -1mm }
`;

const FACE_FILL: Record<Feeling, string> = {
  happy: "#FFD54F",
  sad: "#90CAF9",
  angry: "#FF8A80",
  scared: "#D7B4F3",
  surprised: "#FFCC80",
  disgusted: "#A5D6A7",
  tired: "#C5CAE9",
  calm: "#80DEEA",
};

const dot = (x: number, y: number, r = 4.2) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${INK}"/>`;
const bigEye = (x: number, y: number) => `<circle cx="${x}" cy="${y}" r="8" fill="#fff" stroke="${INK}" stroke-width="2.2"/>${dot(x, y + 1, 3.6)}`;
const line = (d: string, w = 3.2) => `<path d="${d}" fill="none" stroke="${INK}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`;
const cheeks = `<circle cx="27" cy="60" r="5" fill="#FF8FB1" opacity="0.6"/><circle cx="73" cy="60" r="5" fill="#FF8FB1" opacity="0.6"/>`;

// Simple faces drawn for these cards: eyes, brows and mouth say the feeling.
const FACES: Record<Feeling, string> = {
  happy: `${dot(37, 42)}${dot(63, 42)}${cheeks}<path d="M31 57 Q50 80 69 57 Z" fill="${INK}" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/><path d="M41 69 Q50 74 59 69 Q50 64 41 69 Z" fill="#FF6F91"/>`,
  sad: `${line("M27 34 L41 29")}${line("M59 29 L73 34")}${dot(36, 44)}${dot(64, 44)}${line("M35 71 Q50 59 65 71")}<path d="M31 51 Q27 58 31 61 Q35 58 31 51 Z" fill="#3EA6FF"/>`,
  angry: `${line("M27 30 L43 37")}${line("M57 37 L73 30")}${dot(37, 45)}${dot(63, 45)}${line("M35 70 Q50 61 65 70")}`,
  scared: `${line("M27 28 Q35 23 43 27")}${line("M57 27 Q65 23 73 28")}${bigEye(36, 41)}${bigEye(64, 41)}${line("M33 68 Q37 63 41 68 T49 68 T57 68 T65 68")}`,
  surprised: `${line("M27 27 Q35 21 43 26")}${line("M57 26 Q65 21 73 27")}${bigEye(36, 41)}${bigEye(64, 41)}<ellipse cx="50" cy="68" rx="7" ry="9" fill="${INK}"/>`,
  disgusted: `${line("M28 35 L42 38")}${line("M58 38 L72 35")}${line("M29 45 L43 44")}${line("M57 44 L71 45")}<path d="M44 66 Q44 79 50 79 Q56 79 56 66 Z" fill="#FF6F91" stroke="${INK}" stroke-width="2"/>${line("M33 65 Q42 61 50 65 Q58 61 67 65")}`,
  tired: `${line("M29 44 Q36 49 43 44")}${line("M57 44 Q64 49 71 44")}<ellipse cx="50" cy="66" rx="5" ry="4" fill="${INK}"/><text x="61" y="31" font-family="display" font-weight="800" font-size="12" fill="${INK}">z</text><text x="70" y="23" font-family="display" font-weight="800" font-size="9" fill="${INK}">z</text>`,
  calm: `${line("M29 45 Q36 39 43 45")}${line("M57 45 Q64 39 71 45")}${cheeks}${line("M38 63 Q50 71 62 63")}`,
};

export function faceSvg(feeling: Feeling, size: number): string {
  return `<svg width="${size}mm" height="${size}mm" viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="50" r="44" fill="${FACE_FILL[feeling]}" stroke="${INK}" stroke-width="2.6"/>${FACES[feeling]}</svg>`;
}

const BLANK: Record<SheetLocale, string> = {
  en: "Draw your own card!",
  fr: "Dessine ta propre carte !",
  es: "¡Dibuja tu propia tarjeta!",
  pt: "Desenhe o seu próprio cartão!",
};

function card(c: Card | null, i: number, words: boolean, locale: SheetLocale): string {
  const colour = BRIGHT[i % BRIGHT.length];
  if (!c) return `<div class="fc-card"><div class="fc-face" style="border-color:${colour};border-style:dashed"><div class="fc-blank">${esc(typo(BLANK[locale], locale))}</div></div></div>`;
  const size = words ? 54 : 64;
  const art = c.type === "picture" ? `<div style="font-size:${size}mm;line-height:0">${picturePrint(c.picture)}</div>` : faceSvg(c.feeling, size);
  const word = c.word[locale];
  // Long words (and two-word ones) get a smaller size to stay on one line.
  const font = word.length > 13 ? 7.4 : word.length > 10 ? 8.6 : 10;
  return `<div class="fc-card"><div class="fc-face" style="border-color:${colour}">${art}${words ? `<div class="fc-word" style="font-size:${font}mm">${esc(word)}</div>` : ""}</div></div>`;
}

export function flashCardsBody(sheet: FlashCardsSheet, locale: SheetLocale, _box: Box): SheetPart[] {
  const { cards, words } = sheet.params;
  const parts: SheetPart[] = [];
  for (let start = 0; start < cards.length; start += CARDS_PER_PAGE) {
    const page = Array.from({ length: CARDS_PER_PAGE }, (_, k) => cards[start + k] ?? null);
    parts.push({ body: `<div class="fc-grid"><span class="fc-scissors">${scissorsSvg(6)}</span>${page.map((c, k) => card(c, start + k, words, locale)).join("")}</div>` });
  }
  return parts;
}
