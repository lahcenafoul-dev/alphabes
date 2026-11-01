// What the sheet scripts share (generate.ts for the single sheets, packs.ts
// for the Pro packs): the HTML page with the fonts and every layout's CSS,
// and each type's exercise for a sheet, sized to the paper's body box.
import { readFileSync } from "fs";
import { join } from "path";
import { SHEET_PAGE, type Sheet, type SheetLocale } from "../../lib/sheets/catalog";
import type { MissingNumbersSheet } from "../../data/worksheets/missing-numbers";
import type { PatternsSheet } from "../../data/worksheets/patterns";
import type { StickersSheet } from "../../data/worksheets/stickers";
import type { DotToDotSheet } from "../../data/worksheets/dot-to-dot";
import type { ColouringSheet } from "../../data/worksheets/colouring";
import type { HowToDrawSheet } from "../../data/worksheets/how-to-draw";
import type { BodyPartsSheet } from "../../data/worksheets/body-parts";
import type { MazesSheet } from "../../data/worksheets/mazes";
import type { TellingTimeSheet } from "../../data/worksheets/telling-time";
import type { FlashCardsSheet } from "../../data/worksheets/flash-cards";
import type { OrigamiSheet } from "../../data/worksheets/origami";
import type { TracingSheet } from "../../data/worksheets/tracing-lines";
import { SHEET_CSS, bodyBox, type SheetPart } from "./chrome";
import { missingNumbersBody } from "./missing-numbers-layout";
import { PATTERNS_CSS, patternsBody } from "./patterns-layout";
import { STICKERS_CSS, stickersBody } from "./stickers-layout";
import { DRAWING_CSS, colouringBody, dotToDotBody } from "./drawing-layout";
import { ART_CSS, bodyPartsBody, howToDrawBody } from "./art-layout";
import { MAZE_CSS, mazesBody } from "./maze-layout";
import { CLOCK_CSS, tellingTimeBody } from "./clock-layout";
import { FLASH_CSS, flashCardsBody } from "./flash-cards-layout";
import { ORIGAMI_CSS, origamiBody } from "./origami-layout";
import { TRACING_CSS, tracingBody } from "./tracing-layout";

const ROOT = process.cwd();
const FONTS_EN = join(ROOT, "scripts", "worksheets-en", "fonts");
const FONTS = join(ROOT, "scripts", "fiches-fr", "fonts");

function fontFace(family: string, file: string, weight: string | number = 400): string {
  return `@font-face { font-family: "${family}"; font-weight: ${weight}; src: url(data:font/ttf;base64,${readFileSync(file).toString("base64")}) format("truetype") }`;
}

/** The empty page the sheets are rendered into, with `css` added (the packs' own pages). */
export const SHELL = (lang: string, css = "") => `<!doctype html><html lang="${lang}"><head><meta charset="utf-8"><title>AlphaBes</title><style>
${fontFace("display", join(FONTS_EN, "Baloo2-Variable.ttf"), "400 800")}
${fontFace("script", join(FONTS, "Andika-Regular.ttf"))}
${fontFace("script", join(FONTS, "Andika-Bold.ttf"), 700)}
${fontFace("emoji", join(FONTS, "NotoEmoji-Regular.ttf"))}
${SHEET_CSS}
${PATTERNS_CSS}
${STICKERS_CSS}
${DRAWING_CSS}
${ART_CSS}
${MAZE_CSS}
${CLOCK_CSS}
${FLASH_CSS}
${ORIGAMI_CSS}
${TRACING_CSS}
${css}
</style>
<script>/* tsx wraps functions in __name(); fitBodies runs here, so define it. */ var __name = (f) => f;</script>
</head><body></body></html>`;

/** A sheet's exercise (one page, or several), on the language's paper or the one given. */
export function body(sheet: Sheet, locale: SheetLocale, paper: "letter" | "a4" = SHEET_PAGE[locale]): string | SheetPart[] {
  const box = bodyBox(paper);
  switch (sheet.kind) {
    case "missing-numbers":
      return missingNumbersBody(sheet as MissingNumbersSheet, locale, box);
    case "patterns":
      return patternsBody(sheet as PatternsSheet, locale, box);
    case "stickers":
      return stickersBody(sheet as StickersSheet, locale, box);
    case "dot-to-dot":
      return dotToDotBody(sheet as DotToDotSheet, locale, box);
    case "colouring":
      return colouringBody(sheet as ColouringSheet, locale, box);
    case "how-to-draw":
      return howToDrawBody(sheet as HowToDrawSheet, locale, box);
    case "body-parts":
      return bodyPartsBody(sheet as BodyPartsSheet, locale, box);
    case "flash-cards":
      return flashCardsBody(sheet as FlashCardsSheet, locale, box);
    case "telling-time":
      return tellingTimeBody(sheet as TellingTimeSheet, locale, box);
    case "mazes":
      return mazesBody(sheet as MazesSheet, locale, box);
    case "tracing-lines":
      return tracingBody(sheet as TracingSheet, locale, box);
    case "origami":
      return origamiBody(sheet as OrigamiSheet, locale, box);
    default:
      throw new Error(`No layout for ${sheet.kind}`);
  }
}
