// npm run atividades:pt [-- <filter>] [--no-packs] [--no-previews] [--packs=<slug,slug>]
//
// Renders the Portuguese worksheet PDFs listed in lib/atividades-pt.ts with
// Chromium (Playwright), which shapes the cursive font properly. Writes, under
// public/atividades-pdf/:
//   <category>/<slug>.pdf     one A4 page per worksheet
//   previas/<slug>.jpg        a preview of that page for the website
//   pacotes/<slug>.pdf        the packs, one PDF with all their pages
//
// <filter> renders only worksheets whose slug contains it, or one of its
// comma-separated parts (packs are skipped then, unless listed with
// --packs=, which renders only those packs). Re-run after changing a
// template or the catalogue, and commit the files: the site serves them as
// static assets. Fonts: Playwrite BR from scripts/atividades-pt/fonts, Andika
// and Noto Emoji shared with the French worksheets (scripts/fiches-fr/fonts).
import { mkdirSync, readFileSync, statSync } from "fs";
import { dirname, join } from "path";
import { chromium, type Page } from "@playwright/test";
import { atividadePacks, atividades, type Atividade } from "../../lib/atividades-pt";
import { layoutFills } from "../fiches-fr/templates";
import { PAGE_CSS_PT, atividadeBody, pageHtml } from "./templates";

const ROOT = process.cwd();
const OUT = join(ROOT, "public");
const FONTS_PT = join(ROOT, "scripts", "atividades-pt", "fonts");
const FONTS_SHARED = join(ROOT, "scripts", "fiches-fr", "fonts");

const args = process.argv.slice(2);
const filter = args.find((a) => !a.startsWith("--"));
const onlyPacks = args.find((a) => a.startsWith("--packs="))?.slice(8).split(",");
const withPacks = (!filter || !!onlyPacks) && !args.includes("--no-packs");
const withPreviews = !args.includes("--no-previews");

function fontFace(family: string, dir: string, file: string, weight = 400): string {
  const data = readFileSync(join(dir, file)).toString("base64");
  return `@font-face { font-family: "${family}"; font-weight: ${weight}; src: url(data:font/ttf;base64,${data}) format("truetype") }`;
}

const SHELL = `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><title>AlphaBes</title><style>
${fontFace("cursive-pt", FONTS_PT, "PlaywriteBR-Regular.ttf")}
${fontFace("script", FONTS_SHARED, "Andika-Regular.ttf")}
${fontFace("script", FONTS_SHARED, "Andika-Bold.ttf", 700)}
${fontFace("emoji", FONTS_SHARED, "NotoEmoji-Regular.ttf")}
${PAGE_CSS_PT}
</style>
<script>/* tsx wraps functions in __name(); layoutFills runs here, so define it. */ var __name = (f) => f;</script>
</head><body></body></html>`;

async function render(page: Page, html: string, title: string, pdfFile: string, previewFile?: string) {
  await page.evaluate(
    ({ html, title }) => {
      document.body.innerHTML = html;
      document.title = title;
    },
    { html, title },
  );
  await page.evaluate(() => document.fonts.ready);
  await page.evaluate(layoutFills);
  mkdirSync(dirname(pdfFile), { recursive: true });
  await page.pdf({ path: pdfFile, preferCSSPageSize: true, printBackground: true });
  if (previewFile) {
    mkdirSync(dirname(previewFile), { recursive: true });
    await page.locator(".page").first().screenshot({ path: previewFile, type: "jpeg", quality: 72 });
  }
}

const kb = (file: string) => Math.round(statSync(file).size / 1024);

async function main() {
  const parts = filter?.split(",") ?? [];
  const list: Atividade[] = filter ? atividades.filter((a) => parts.some((p) => a.slug.includes(p))) : atividades;
  if (!list.length) throw new Error(`No worksheet matches "${filter}"`);

  const browser = await chromium.launch();
  // A4 at 96 dpi is 794 × 1123 px; 0.6 gives ~476 px wide previews.
  const context = await browser.newContext({ viewport: { width: 794, height: 1123 }, deviceScaleFactor: 0.6 });
  const page = await context.newPage();
  await page.setContent(SHELL);
  await page.evaluate(() => document.fonts.ready);

  let total = 0;
  for (const [i, a] of list.entries()) {
    const pdf = join(OUT, a.pdf);
    await render(page, pageHtml(a, atividadeBody(a)), `${a.title} – AlphaBes`, pdf, withPreviews ? join(OUT, a.preview) : undefined);
    total += kb(pdf);
    if ((i + 1) % 20 === 0 || i === list.length - 1) console.log(`  ${i + 1}/${list.length} worksheets`);
  }
  console.log(`Worksheets: ${list.length} PDFs, ${total} KB`);

  if (withPacks) {
    const bySlug = new Map(atividades.map((a) => [a.slug, a]));
    let packTotal = 0;
    const packs = atividadePacks.filter((p) => !onlyPacks || onlyPacks.includes(p.slug));
    for (const pack of packs) {
      const html = pack.atividades.map((slug) => {
        const a = bySlug.get(slug)!;
        return pageHtml(a, atividadeBody(a));
      });
      const pdf = join(OUT, pack.pdf);
      await render(page, html.join(""), `${pack.title} – AlphaBes`, pdf);
      packTotal += kb(pdf);
      console.log(`  ${pack.slug}: ${pack.atividades.length} pages, ${kb(pdf)} KB`);
    }
    console.log(`Packs: ${packs.length} PDFs, ${packTotal} KB`);
  }

  await browser.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
