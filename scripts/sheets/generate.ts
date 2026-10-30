// npm run sheets [-- <filter>] [--kind=<id>] [--locale=<en,fr…>] [--out=<dir>] [--png]
//
// Renders the worksheets of the new types (lib/sheets/catalog.ts: missing
// numbers, patterns, sticker sheets) with Chromium (Playwright), like
// scripts/fiches-fr. For every sheet and language it writes:
//   the PDF            public/<language folder>/<type>/<slug>.pdf
//   the preview        <language preview folder>/<slug>.jpg (476 px) and .320.jpg
// (paths from lib/sheets/catalog.ts). English pages are US Letter, the others A4.
//
// <filter> renders only sheets whose id or slug contains it (comma-separated
// parts allowed). --out=<dir> writes the PDFs (and, with --png, a PNG of each
// page) there instead of public/, for a sample. Re-run after changing a
// layout or a catalogue, and commit the files: the site serves them as
// static assets.
import { mkdirSync, readFileSync, statSync } from "fs";
import { dirname, join } from "path";
import { chromium, type Page } from "@playwright/test";
import sharp from "sharp";
import { preparePictures } from "../picture-emoji";
import { PREVIEW_SIZE, SHEETS, SHEET_PAGE, getSheetKind, sheetPdf, sheetPreview, type Sheet, type SheetLocale } from "../../lib/sheets/catalog";
import { SHEET_LOCALES } from "../../lib/sheets/types";
import type { MissingNumbersSheet } from "../../data/worksheets/missing-numbers";
import type { PatternsSheet } from "../../data/worksheets/patterns";
import type { StickersSheet } from "../../data/worksheets/stickers";
import { PAGES, SHEET_CSS, bodyBox, fitBodies, sheetPage } from "./chrome";
import { missingNumbersBody } from "./missing-numbers-layout";
import { PATTERNS_CSS, patternsBody } from "./patterns-layout";
import { STICKERS_CSS, stickersBody } from "./stickers-layout";

const ROOT = process.cwd();
const FONTS_EN = join(ROOT, "scripts", "worksheets-en", "fonts");
const FONTS = join(ROOT, "scripts", "fiches-fr", "fonts");

const args = process.argv.slice(2);
const filter = args.find((a) => !a.startsWith("--"));
const kind = args.find((a) => a.startsWith("--kind="))?.slice(7);
const locales = (args.find((a) => a.startsWith("--locale="))?.slice(9).split(",") ?? SHEET_LOCALES) as SheetLocale[];
const out = args.find((a) => a.startsWith("--out="))?.slice(6);
const withPng = args.includes("--png");
// Prints the body box and the exercise's size, in mm, for each page.
const debug = args.includes("--debug");

function fontFace(family: string, file: string, weight: string | number = 400): string {
  return `@font-face { font-family: "${family}"; font-weight: ${weight}; src: url(data:font/ttf;base64,${readFileSync(file).toString("base64")}) format("truetype") }`;
}

const SHELL = (lang: string) => `<!doctype html><html lang="${lang}"><head><meta charset="utf-8"><title>AlphaBes</title><style>
${fontFace("display", join(FONTS_EN, "Baloo2-Variable.ttf"), "400 800")}
${fontFace("script", join(FONTS, "Andika-Regular.ttf"))}
${fontFace("script", join(FONTS, "Andika-Bold.ttf"), 700)}
${fontFace("emoji", join(FONTS, "NotoEmoji-Regular.ttf"))}
${SHEET_CSS}
${PATTERNS_CSS}
${STICKERS_CSS}
</style>
<script>/* tsx wraps functions in __name(); fitBodies runs here, so define it. */ var __name = (f) => f;</script>
</head><body></body></html>`;

function body(sheet: Sheet, locale: SheetLocale): string {
  const box = bodyBox(SHEET_PAGE[locale]);
  switch (sheet.kind) {
    case "missing-numbers":
      return missingNumbersBody(sheet as MissingNumbersSheet, locale, box);
    case "patterns":
      return patternsBody(sheet as PatternsSheet, locale, box);
    case "stickers":
      return stickersBody(sheet as StickersSheet, locale, box);
  }
}

function pageHtml(sheet: Sheet, locale: SheetLocale): string {
  return sheetPage({
    locale,
    page: SHEET_PAGE[locale],
    kindName: getSheetKind(sheet.kind).name[locale],
    title: sheet.title[locale],
    instruction: sheet.instruction[locale],
    body: body(sheet, locale),
  });
}

/** Renders one page; returns true if its exercise had to be shrunk to fit. */
async function render(page: Page, sheet: Sheet, locale: SheetLocale, pdfFile: string, previewFile?: string): Promise<boolean> {
  const html = pageHtml(sheet, locale);
  const title = `${sheet.title[locale]} – AlphaBes`;
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
  if (debug) {
    const m = await page.evaluate(() => {
      const b = document.querySelector<HTMLElement>(".sh-body")!;
      const px = 96 / 25.4;
      const r = (n: number) => Math.round((n / px) * 10) / 10;
      return `body ${r(b.clientWidth)}×${r(b.clientHeight)} mm, content ${r(b.firstElementChild!.scrollWidth)}×${r(b.firstElementChild!.scrollHeight)} mm`;
    });
    console.log(`  ${locale} ${sheet.id}: ${m}`);
  }
  const shrunk = await page.evaluate(fitBodies);
  const size = PAGES[SHEET_PAGE[locale]];
  mkdirSync(dirname(pdfFile), { recursive: true });
  await page.pdf({ path: pdfFile, width: `${size.width}mm`, height: `${size.height}mm`, printBackground: true });
  const shot = previewFile || withPng ? await page.locator(".sh").first().screenshot({ type: "png" }) : null;
  if (withPng && shot) await sharp(shot).toFile(pdfFile.replace(/\.pdf$/, ".png"));
  if (previewFile && shot) {
    mkdirSync(dirname(previewFile), { recursive: true });
    const { width, height } = PREVIEW_SIZE[SHEET_PAGE[locale]];
    await sharp(shot).resize(width, height, { fit: "fill" }).jpeg({ quality: 72, mozjpeg: true }).toFile(previewFile);
    await sharp(shot).resize({ width: 320 }).jpeg({ quality: 72, mozjpeg: true }).toFile(previewFile.replace(/\.jpg$/, ".320.jpg"));
  }
  return shrunk > 0;
}

async function main() {
  const parts = filter?.split(",") ?? [];
  const list = SHEETS.filter((s) => (!kind || s.kind === kind) && (!filter || parts.some((p) => s.id.includes(p) || Object.values(s.slug).some((x) => x.includes(p)))));
  if (!list.length) throw new Error(`No sheet matches "${filter ?? kind}"`);

  await preparePictures();
  const browser = await chromium.launch();
  const shrunk: string[] = [];
  let total = 0;
  let files = 0;
  for (const locale of locales) {
    const pageSize = PAGES[SHEET_PAGE[locale]];
    const widthPx = Math.round((pageSize.width / 25.4) * 96);
    const heightPx = Math.round((pageSize.height / 25.4) * 96);
    // Screenshots at twice the preview width (476 px), then scaled down.
    const context = await browser.newContext({ viewport: { width: widthPx, height: heightPx }, deviceScaleFactor: withPng ? 2 : 952 / widthPx });
    const page = await context.newPage();
    await page.setContent(SHELL(locale));
    for (const [i, sheet] of list.entries()) {
      const pdf = out ? join(out, locale, `${sheet.slug[locale]}.pdf`) : join(ROOT, "public", sheetPdf(locale, sheet));
      const preview = out ? undefined : join(ROOT, "public", sheetPreview(locale, sheet));
      if (await render(page, sheet, locale, pdf, preview)) shrunk.push(`${locale} ${sheet.id}`);
      total += statSync(pdf).size;
      files++;
      if ((i + 1) % 25 === 0 || i === list.length - 1) console.log(`  ${locale}: ${i + 1}/${list.length}`);
    }
    await context.close();
  }
  await browser.close();
  console.log(`${files} PDFs, ${Math.round(total / 1024)} KB (${Math.round(total / 1024 / files)} KB each)`);
  if (shrunk.length) {
    console.warn(`Shrunk to fit (fix the layout): ${shrunk.join(", ")}`);
    process.exitCode = 1;
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
