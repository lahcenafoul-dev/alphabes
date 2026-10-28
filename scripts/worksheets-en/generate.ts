// npm run worksheets:en [-- <letters>] [--type=<types>] [--out=<dir>] [--png]
//
// Renders the English letter worksheet PDFs with Chromium (Playwright), like
// scripts/fiches-fr. Writes public/worksheets-pdf/<type>/letter-<x>-<type>.pdf,
// one US Letter page per letter, at the paths lib/static-pdf-overrides.ts and
// lib/static-worksheets-data.ts already serve. Then run `npm run previews:en` and `npm run previews:thumbs`
// for the website previews, and commit the files.
//
// <letters> renders only those letters ("e" or "a,b,c"), --type= only those
// types ("tracing" or "matching,cursive"; all by default). --out=<dir> writes
// the PDFs there instead of public/ (for a sample), and --png also saves a
// PNG of each page next to its PDF.
import { mkdirSync, readFileSync, statSync } from "fs";
import { dirname, join } from "path";
import { chromium, type Page } from "@playwright/test";
import { getAllLetterSlugs, getLetterContent } from "../../lib/letters-data";
import { layoutFills } from "../fiches-fr/templates";
import { preparePictures } from "../picture-emoji";
import { PAGE_CSS, SHEET_TYPES, letterPage, sheetTitle, type SheetType } from "./templates";

const ROOT = process.cwd();
const FONTS = join(ROOT, "scripts", "worksheets-en", "fonts");
const FONTS_SHARED = join(ROOT, "scripts", "fiches-fr", "fonts");

const args = process.argv.slice(2);
const filter = args.find((a) => !a.startsWith("--"));
const out = args.find((a) => a.startsWith("--out="))?.slice(6);
const types = (args.find((a) => a.startsWith("--type="))?.slice(7).split(",") ?? [...SHEET_TYPES]) as SheetType[];
const withPng = args.includes("--png");

function fontFace(family: string, file: string, weight: string | number = 400): string {
  const data = readFileSync(file).toString("base64");
  return `@font-face { font-family: "${family}"; font-weight: ${weight}; src: url(data:font/ttf;base64,${data}) format("truetype") }`;
}

const SHELL = `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>AlphaBes</title><style>
${fontFace("display", join(FONTS, "Baloo2-Variable.ttf"), "400 800")}
${fontFace("cursive-en", join(FONTS, "PlaywriteUSTrad-Variable.ttf"))}
${fontFace("script", join(FONTS_SHARED, "Andika-Regular.ttf"))}
${fontFace("script", join(FONTS_SHARED, "Andika-Bold.ttf"), 700)}
${fontFace("emoji", join(FONTS_SHARED, "NotoEmoji-Regular.ttf"))}
${PAGE_CSS}
</style>
<script>/* tsx wraps functions in __name(); layoutFills runs here, so define it. */ var __name = (f) => f;</script>
</head><body></body></html>`;

async function render(page: Page, html: string, title: string, pdfFile: string) {
  await page.evaluate(
    ({ html, title }) => {
      document.body.innerHTML = html;
      document.title = title;
    },
    { html, title },
  );
  await page.evaluate(() => Promise.all([...document.images].map((img) => img.decode().catch(() => {}))));
  // Load every @font-face before measuring (see scripts/fiches-fr/generate.ts).
  await page.evaluate(() => Promise.all([...document.fonts].map((f) => f.load())));
  await page.evaluate(() => document.fonts.ready);
  await page.evaluate(layoutFills);
  mkdirSync(dirname(pdfFile), { recursive: true });
  await page.pdf({ path: pdfFile, preferCSSPageSize: true, printBackground: true });
  if (withPng) await page.locator(".page").first().screenshot({ path: pdfFile.replace(/\.pdf$/, ".png") });
}

async function main() {
  const wanted = filter?.toLowerCase().split(",");
  const letters = getAllLetterSlugs().filter((l) => !wanted || wanted.includes(l));
  if (!letters.length) throw new Error(`No letter matches "${filter}"`);
  const unknown = types.filter((t) => !SHEET_TYPES.includes(t));
  if (unknown.length) throw new Error(`Unknown type ${unknown.join(", ")}; use ${SHEET_TYPES.join(", ")}`);

  await preparePictures();
  const browser = await chromium.launch();
  // US Letter at 96 dpi is 816 × 1056 px; scale 2 gives a sharp PNG.
  const context = await browser.newContext({ viewport: { width: 816, height: 1056 }, deviceScaleFactor: withPng ? 2 : 1 });
  const page = await context.newPage();
  await page.setContent(SHELL);

  for (const type of types) {
    let total = 0;
    for (const slug of letters) {
      const letter = getLetterContent(slug)!;
      const pdf = join(out ?? join(ROOT, "public", "worksheets-pdf", type), `letter-${slug}-${type}.pdf`);
      await render(page, letterPage(type, letter), `${sheetTitle(type, letter.uppercase)} Worksheet – AlphaBes`, pdf);
      total += statSync(pdf).size;
      console.log(`  ${pdf}: ${Math.round(statSync(pdf).size / 1024)} KB`);
    }
    console.log(`${type}: ${letters.length} PDFs, ${Math.round(total / 1024)} KB`);
  }
  await browser.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
