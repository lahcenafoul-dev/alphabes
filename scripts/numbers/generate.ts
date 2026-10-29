// npm run numbers:en [-- <numbers>] [--out=<dir>] [--png]
//
// Renders the English number tracing PDFs (scripts/numbers-layout.ts) with
// Chromium (Playwright), like scripts/worksheets-en. Writes
// public/worksheets-pdf/numbers/number-<n>-tracing.pdf, the path
// lib/static-worksheets-data.ts already serves. Then run `npm run previews:en`.
// The French, Spanish and Portuguese number sheets use the same layout from
// their own generators (npm run fiches:fr, fichas:es, atividades:pt).
//
// <numbers> renders only those ("3" or "0,1,2"). --out=<dir> writes the PDFs
// there instead of public/ (for a sample), and --png also saves a PNG of each
// page next to its PDF.
import { mkdirSync, readFileSync, statSync } from "fs";
import { dirname, join } from "path";
import { chromium, type Page } from "@playwright/test";
import { layoutFills } from "../fiches-fr/templates";
import { preparePictures } from "../picture-emoji";
import { COUNTED, NUMBERS_CSS, numberSheet } from "../numbers-layout";
import { PAGE_CSS } from "../worksheets-en/templates";

const ROOT = process.cwd();
const FONTS = join(ROOT, "scripts", "worksheets-en", "fonts");
const FONTS_SHARED = join(ROOT, "scripts", "fiches-fr", "fonts");

const args = process.argv.slice(2);
const filter = args.find((a) => !a.startsWith("--"));
const out = args.find((a) => a.startsWith("--out="))?.slice(6);
const withPng = args.includes("--png");

const WORDS = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine"];

function fontFace(family: string, file: string, weight: string | number = 400): string {
  const data = readFileSync(file).toString("base64");
  return `@font-face { font-family: "${family}"; font-weight: ${weight}; src: url(data:font/ttf;base64,${data}) format("truetype") }`;
}

const SHELL = `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>AlphaBes</title><style>
${fontFace("display", join(FONTS, "Baloo2-Variable.ttf"), "400 800")}
${fontFace("script", join(FONTS_SHARED, "Andika-Regular.ttf"))}
${fontFace("script", join(FONTS_SHARED, "Andika-Bold.ttf"), 700)}
${fontFace("emoji", join(FONTS_SHARED, "NotoEmoji-Regular.ttf"))}
${PAGE_CSS}
${NUMBERS_CSS}
</style>
<script>/* tsx wraps functions in __name(); layoutFills runs here, so define it. */ var __name = (f) => f;</script>
</head><body></body></html>`;

function numberPage(n: number): string {
  const word = WORDS[n];
  return numberSheet({
    page: "letter",
    badge: String(n),
    title: `Number ${n} Tracing`,
    name: "Name:",
    date: "Date:",
    hero: {
      n,
      word: word.toUpperCase(),
      picture: COUNTED[n],
      handCaption: n === 1 ? "1 finger" : `${n} fingers`,
      wordCaption: "Number word",
    },
    rows: [
      { label: `Trace the number ${n}`, text: String(n), kind: "letter" },
      { label: "", text: String(n), kind: "letter" },
      { label: `Trace the word ${word}`, text: word, kind: "word" },
      { label: "Now write it on your own", text: "", kind: "own" },
    ],
    footer: ["alphabes.com · Free printable number worksheets", `Number ${n}`],
  });
}

async function render(page: Page, html: string, title: string, pdfFile: string) {
  await page.evaluate(
    ({ html, title }) => {
      document.body.innerHTML = html;
      document.title = title;
    },
    { html, title },
  );
  await page.evaluate(() => Promise.all([...document.images].map((img) => img.decode().catch(() => {}))));
  await page.evaluate(() => Promise.all([...document.fonts].map((f) => f.load())));
  await page.evaluate(() => document.fonts.ready);
  await page.evaluate(layoutFills);
  mkdirSync(dirname(pdfFile), { recursive: true });
  await page.pdf({ path: pdfFile, preferCSSPageSize: true, printBackground: true });
  if (withPng) await page.locator(".page").first().screenshot({ path: pdfFile.replace(/\.pdf$/, ".png") });
}

async function main() {
  const all = WORDS.map((_, n) => n);
  const numbers = filter ? filter.split(",").map(Number).filter((n) => all.includes(n)) : all;
  if (!numbers.length) throw new Error(`No number matches "${filter}"`);

  await preparePictures();
  const browser = await chromium.launch();
  // US Letter at 96 dpi is 816 × 1056 px; scale 2 gives a sharp PNG.
  const context = await browser.newContext({ viewport: { width: 816, height: 1056 }, deviceScaleFactor: withPng ? 2 : 1 });
  const page = await context.newPage();
  await page.setContent(SHELL);
  for (const n of numbers) {
    const pdf = join(out ?? join(ROOT, "public", "worksheets-pdf", "numbers"), `number-${n}-tracing.pdf`);
    await render(page, numberPage(n), `Number ${n} Tracing Worksheet – AlphaBes`, pdf);
    console.log(`  ${pdf}: ${Math.round(statSync(pdf).size / 1024)} KB`);
  }
  await browser.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
