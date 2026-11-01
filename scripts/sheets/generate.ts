// npm run sheets [-- <filter>] [--kind=<id>] [--locale=<en,fr…>] [--out=<dir>] [--png]
//
// Renders the worksheets of the new types (lib/sheets/catalog.ts: missing
// numbers, patterns, sticker sheets, dot to dot, colouring, how to draw,
// body parts, flash cards, telling time, mazes, tracing lines,
// origami) with Chromium (Playwright), like
// scripts/fiches-fr. For every sheet and language it writes:
//   the PDF            public/<language folder>/<type>/<slug>.pdf (one or more pages)
//   the preview        <language preview folder>/<slug>.jpg (476 px) and .320.jpg
// (paths from lib/sheets/catalog.ts). English pages are US Letter, the others A4.
//
// <filter> renders only sheets whose id or slug contains it (comma-separated
// parts allowed). --out=<dir> writes the PDFs (and, with --png, a PNG of each
// page) there instead of public/, for a sample. Re-run after changing a
// layout or a catalogue, and commit the files: the site serves them as
// static assets.
import { mkdirSync, statSync } from "fs";
import { dirname, join } from "path";
import { chromium, type Page } from "@playwright/test";
import sharp from "sharp";
import { preparePictures } from "../picture-emoji";
import { PREVIEW_SIZE, SHEETS, SHEET_PAGE, getSheetKind, sheetPdf, sheetPreview, type Sheet, type SheetLocale } from "../../lib/sheets/catalog";
import { SHEET_LOCALES } from "../../lib/sheets/types";
import { PAGES, fitBodies, sheetPage } from "./chrome";
import { DRAWING_PROBLEMS } from "./drawing-layout";
import { ART_PROBLEMS } from "./art-layout";
import { SHELL, body } from "./render";

const ROOT = process.cwd();

const args = process.argv.slice(2);
const filter = args.find((a) => !a.startsWith("--"));
const kind = args.find((a) => a.startsWith("--kind="))?.slice(7);
const locales = (args.find((a) => a.startsWith("--locale="))?.slice(9).split(",") ?? SHEET_LOCALES) as SheetLocale[];
const out = args.find((a) => a.startsWith("--out="))?.slice(6);
const withPng = args.includes("--png");
// Prints the body box and the exercise's size, in mm, for each page.
const debug = args.includes("--debug");

function pageHtml(sheet: Sheet, locale: SheetLocale): string {
  const b = body(sheet, locale);
  const parts = typeof b === "string" ? [{ body: b }] : b;
  return parts
    .map((p) =>
      sheetPage({
        locale,
        page: SHEET_PAGE[locale],
        kindName: getSheetKind(sheet.kind).name[locale],
        title: p.title ?? sheet.title[locale],
        instruction: p.instruction ?? sheet.instruction[locale],
        body: p.body,
        noNameLine: p.noNameLine,
      }),
    )
    .join("");
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
  if (withPng && shot) {
    // One PNG per page: name.png, then name-2.png…
    const pages = page.locator(".sh");
    for (let i = 0; i < (await pages.count()); i++) {
      const png = i ? await pages.nth(i).screenshot({ type: "png" }) : shot;
      await sharp(png).toFile(pdfFile.replace(/\.pdf$/, i ? `-${i + 1}.png` : ".png"));
    }
  }
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
  // Draft sheets only go to --out, never to public/.
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
  if (DRAWING_PROBLEMS.length || ART_PROBLEMS.length) {
    console.warn(`Drawing problems (fix the drawing):\n  ${[...DRAWING_PROBLEMS, ...ART_PROBLEMS].join("\n  ")}`);
    process.exitCode = 1;
  }
  if (shrunk.length) {
    console.warn(`Shrunk to fit (fix the layout): ${shrunk.join(", ")}`);
    process.exitCode = 1;
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
