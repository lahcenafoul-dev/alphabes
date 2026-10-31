// The flash card sets (data/worksheets/flash-cards.ts): four 9 cm cards per
// page, with the full cut grid dashed over them (the outline and the middle
// lines, so every cut serves two cards). Each card is a picture in a coloured
// frame with its word below, or the picture alone in the sets without words.
// Pages a set doesn't fill end with blank cards to draw on. Card pages have
// no Name/Date line: there is nothing to write.
import { CARDS_PER_PAGE, type Card, type Feeling, type FlashCardsSheet, type Paint, type Solid } from "../../data/worksheets/flash-cards";
import { COLOURS } from "../../data/worksheets/vocab";
import type { SheetLocale } from "../../lib/sheets/types";
import { picturePrint } from "../picture-emoji";
import { BRIGHT, INK, MUTED, SOFT, esc, typo, type SheetPart } from "./chrome";
import { scissorsSvg, shapeSvg } from "./shapes";

type Box = { w: number; h: number };

/** The card's side, in mm. */
const CARD = 90;
const CUT = "#8f89b3";

export const FLASH_CSS = `
.fc-grid { position: relative; display: grid; grid-template-columns: repeat(2, ${CARD}mm); grid-auto-rows: ${CARD}mm }
.fc-cut { position: absolute; left: 0; top: 0; pointer-events: none }
.fc-card { display: flex; padding: 4mm }
.fc-face { flex: 1; border: 1.6mm solid; border-radius: 6mm; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 2.5mm; overflow: hidden }
.fc-word { font-family: display; font-weight: 800; line-height: 1.02; padding: 0.1em 3mm 0; color: ${INK}; text-align: center }
.fc-word i { font-style: normal }
.fc-big { font-family: display; font-weight: 800; line-height: 0.9; padding-top: 0.08em }
.fc-frames { display: flex; gap: 1.6mm }
.fc-frame { display: grid; grid-template-columns: repeat(5, 6.2mm); grid-auto-rows: 6.2mm; border: 0.4mm solid ${INK}; border-radius: 1mm; overflow: hidden }
.fc-frame span { border-right: 0.3mm solid #9a95b8; border-bottom: 0.3mm solid #9a95b8; display: flex; align-items: center; justify-content: center }
.fc-frame span:nth-child(5n) { border-right: 0 }
.fc-frame span:nth-child(n+6) { border-bottom: 0 }
.fc-frame i { width: 4.2mm; height: 4.2mm; border-radius: 50% }
.fc-blank { font-size: 4.2mm; color: ${MUTED}; font-weight: 700; text-align: center; padding: 0 6mm }
.fc-scissors { position: absolute; top: -6.5mm; left: -1mm }
`;

// ------------------------------------------------------------------ faces

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

// ------------------------------------------------------------------ 3D shapes

// Each solid in three tones of one colour: lit top, front, shaded side.
const TONES: Record<Solid, [string, string, string]> = {
  cube: ["#FFE7A3", "#FFC94D", "#E5A91F"],
  sphere: ["#FFD1E0", "#FF8AB3", "#E05A8C"],
  cylinder: ["#CFE8FF", "#7CC0FF", "#3E92DB"],
  cone: ["#FFDCC2", "#FFA766", "#E0803A"],
  pyramid: ["#E2DAFF", "#B3A1FF", "#8770E6"],
  cuboid: ["#D3F5E6", "#7FD9B3", "#3FAE84"],
  prism: ["#FFE0E0", "#FF9C9C", "#E06464"],
};

function solidSvg(solid: Solid, size: number): string {
  const [top, front, side] = TONES[solid];
  const face = (d: string, fill: string) => `<path d="${d}" fill="${fill}" stroke="${INK}" stroke-width="2.4" stroke-linejoin="round"/>`;
  let body = "";
  switch (solid) {
    case "cube":
      body = face("M22 38 L62 38 L62 80 L22 80 Z", front) + face("M22 38 L40 22 L80 22 L62 38 Z", top) + face("M62 38 L80 22 L80 64 L62 80 Z", side);
      break;
    case "cuboid":
      body = face("M10 44 L68 44 L68 80 L10 80 Z", front) + face("M10 44 L28 28 L88 28 L68 44 Z", top) + face("M68 44 L88 28 L88 64 L68 80 Z", side);
      break;
    case "sphere":
      body = `<defs><radialGradient id="sg" cx="0.38" cy="0.34" r="0.7"><stop offset="0" stop-color="${top}"/><stop offset="0.55" stop-color="${front}"/><stop offset="1" stop-color="${side}"/></radialGradient></defs><circle cx="50" cy="52" r="34" fill="url(#sg)" stroke="${INK}" stroke-width="2.4"/>`;
      break;
    case "cylinder":
      body = face("M27 26 L27 76 A23 8 0 0 0 73 76 L73 26 Z", front) + face("M27 26 A23 8 0 0 1 73 26 A23 8 0 0 1 27 26 Z", top) + `<path d="M60 36 L60 80" stroke="${side}" stroke-width="7" opacity="0.6"/>`;
      break;
    case "cone":
      body = face("M50 14 L76 74 A26 9 0 0 1 24 74 Z", front) + `<path d="M50 14 L68 79" stroke="${side}" stroke-width="8" opacity="0.5"/>` + `<path d="M24 74 A26 9 0 0 0 76 74" fill="none" stroke="${INK}" stroke-width="2.4" stroke-dasharray="3 3"/>`;
      break;
    case "pyramid":
      body = face("M50 14 L20 72 L60 84 Z", front) + face("M50 14 L60 84 L84 66 Z", side);
      break;
    case "prism":
      body = face("M12 78 L36 36 L60 78 Z", front) + face("M36 36 L62 22 L86 64 L60 78 Z", side);
      break;
  }
  return `<svg width="${size}mm" height="${size}mm" viewBox="0 0 100 100" aria-hidden="true">${body}</svg>`;
}

// ------------------------------------------------------------------ colours

const PAINT: Record<Paint, string> = {
  ...Object.fromEntries(Object.entries(COLOURS).map(([k, v]) => [k, v.hex])),
  purple: "#8E24AA",
  pink: "#F06292",
  brown: "#8D6E63",
  black: "#212121",
  white: "#FFFFFF",
  grey: "#9E9E9E",
} as Record<Paint, string>;

const SPLASH =
  "M50 12 C62 10 68 22 78 22 C90 23 92 38 86 47 C81 55 91 66 82 77 C74 87 60 82 51 88 C41 94 27 90 22 80 C17 70 7 63 13 51 C18 41 9 28 20 20 C30 13 39 13 50 12 Z";

function paintSvg(paint: Paint, size: number): string {
  const fill = PAINT[paint];
  const shine = paint === "white" ? "" : `<path d="M30 34 Q36 26 46 26" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round" opacity="0.55"/>`;
  return `<svg width="${size}mm" height="${size}mm" viewBox="0 0 100 100" aria-hidden="true"><path d="${SPLASH}" fill="${fill}" stroke="${INK}" stroke-width="2.4" stroke-linejoin="round"/><circle cx="88" cy="20" r="4.5" fill="${fill}" stroke="${INK}" stroke-width="2"/><circle cx="12" cy="86" r="3.5" fill="${fill}" stroke="${INK}" stroke-width="2"/>${shine}</svg>`;
}

// ------------------------------------------------------------------ cards

const BLANK: Record<SheetLocale, string> = {
  en: "Draw your own card!",
  fr: "Dessine ta propre carte !",
  es: "¡Dibuja tu propia tarjeta!",
  pt: "Desenhe o seu próprio cartão!",
};

/** Long words get a smaller size; the longest wrap on two lines. */
const wordSize = (w: string) => (w.length > 16 ? 6.6 : w.length > 13 ? 7.4 : w.length > 10 ? 8.6 : 10);

/** The word, with the first letter that (without its accent) is `letter` in colour. */
function marked(word: string, letter: string, colour: string): string {
  const chars = [...word];
  const i = chars.findIndex((ch) => ch.normalize("NFD")[0].toLowerCase() === letter);
  if (i < 0) return esc(word);
  return `${esc(chars.slice(0, i).join(""))}<i style="color:${colour}">${esc(chars[i])}</i>${esc(chars.slice(i + 1).join(""))}`;
}

function tenFrame(filled: number, colour: string): string {
  return `<div class="fc-frame">${Array.from({ length: 10 }, (_, i) => `<span>${i < filled ? `<i style="background:${colour}"></i>` : ""}</span>`).join("")}</div>`;
}

function face(card: Card, colour: string, words: boolean, locale: SheetLocale): string {
  const art = words ? 52 : 64;
  const word = (w: string, html = esc(w)) => (words ? `<div class="fc-word" style="font-size:${wordSize(w)}mm">${html}</div>` : "");
  switch (card.type) {
    case "picture":
      return `<div style="font-size:${art}mm;line-height:0">${picturePrint(card.picture)}</div>${word(card.word[locale])}`;
    case "feeling":
      return `${faceSvg(card.feeling, art)}${word(card.word[locale])}`;
    case "solid":
      return `${solidSvg(card.solid, art)}${word(card.word[locale])}`;
    case "shape":
      return `${shapeSvg(card.shape, art * 0.92)}${word(card.word[locale])}`;
    case "colour":
      return `${paintSvg(card.paint, art)}${word(card.word[locale])}`;
    case "number": {
      const frames = card.n > 10 ? [10, card.n - 10] : [card.n];
      return `<div class="fc-big" style="font-size:${words ? 28 : 34}mm;color:${colour}">${card.n}</div><div class="fc-frames">${frames.map((k) => tenFrame(k, colour)).join("")}</div>${word(card.word[locale])}`;
    }
    case "letter": {
      const picture = card.picture[locale];
      const w = card.word[locale];
      if (!picture || !w) return `<div class="fc-big" style="font-size:40mm;color:${colour}">${esc(card.upper + card.lower)}</div>`;
      return `<div class="fc-big" style="font-size:17mm;color:${colour}">${esc(card.upper + card.lower)}</div><div style="font-size:38mm;line-height:0">${picturePrint(picture)}</div>${word(w, marked(w, card.lower, colour))}`;
    }
  }
}

function card(c: Card | null, i: number, words: boolean, locale: SheetLocale): string {
  const colour = BRIGHT[i % BRIGHT.length];
  if (!c)
    return `<div class="fc-card"><div class="fc-face" style="border-color:${colour};border-style:dashed;background:${SOFT[i % SOFT.length]}55"><div class="fc-blank">${esc(typo(BLANK[locale], locale))}</div></div></div>`;
  return `<div class="fc-card"><div class="fc-face" style="border-color:${colour}">${face(c, colour, words, locale)}</div></div>`;
}

/** The cut lines: around the four cards and between them. */
const CUT_GRID = `<svg class="fc-cut" width="${2 * CARD}mm" height="${2 * CARD}mm" viewBox="0 0 ${2 * CARD} ${2 * CARD}" aria-hidden="true"><path d="M0.3 0.3H${2 * CARD - 0.3}V${2 * CARD - 0.3}H0.3Z M${CARD} 0V${2 * CARD} M0 ${CARD}H${2 * CARD}" fill="none" stroke="${CUT}" stroke-width="0.45" stroke-dasharray="2.2 1.6"/></svg>`;

export function flashCardsBody(sheet: FlashCardsSheet, locale: SheetLocale, _box: Box): SheetPart[] {
  const { cards, words } = sheet.params;
  const parts: SheetPart[] = [];
  for (let start = 0; start < cards.length; start += CARDS_PER_PAGE) {
    const page = Array.from({ length: CARDS_PER_PAGE }, (_, k) => cards[start + k] ?? null);
    parts.push({
      body: `<div class="fc-grid">${page.map((c, k) => card(c, start + k, words, locale)).join("")}${CUT_GRID}<span class="fc-scissors">${scissorsSvg(6)}</span></div>`,
      noNameLine: true,
    });
  }
  return parts;
}
