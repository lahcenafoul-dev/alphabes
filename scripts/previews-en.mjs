// npm run previews:en
// Renders page 1 of every English worksheet PDF in public/worksheets-pdf/
// into public/worksheets-pdf/previews/<name>.jpg (476 px wide, like the
// French, Spanish and Portuguese previews) and <name>.320.jpg (the card
// thumbnail). pdf.js runs in Playwright's Chromium; sharp writes the JPEGs.
// Only rewrites a preview older than its PDF.
import { readFileSync, readdirSync, mkdirSync, statSync } from "fs";
import { join, dirname } from "path";
import { createRequire } from "module";
import { chromium } from "@playwright/test";
import sharp from "sharp";

const require = createRequire(import.meta.url);
const PDF_DIR = "public/worksheets-pdf";
const OUT = join(PDF_DIR, "previews");
const pdfjsDir = dirname(require.resolve("pdfjs-dist/package.json"));
const HOST = "http://render.local";

const pdfs = readdirSync(PDF_DIR)
  .filter((d) => d !== "previews")
  .flatMap((d) => readdirSync(join(PDF_DIR, d)).filter((f) => f.endsWith(".pdf")).map((f) => join(d, f)));
mkdirSync(OUT, { recursive: true });

const page = await (await chromium.launch()).newPage();
await page.route(`${HOST}/**`, (route) => {
  const path = new URL(route.request().url()).pathname;
  if (path === "/") return route.fulfill({ contentType: "text/html", body: "<!doctype html><body></body>" });
  const file = path.startsWith("/pdfjs/") ? join(pdfjsDir, path.slice(7)) : join(PDF_DIR, decodeURIComponent(path.slice(1)));
  const type = file.endsWith(".mjs") ? "text/javascript" : "application/pdf";
  return route.fulfill({ contentType: type, body: readFileSync(file) });
});
await page.goto(HOST + "/");

let written = 0;
for (const pdf of pdfs) {
  const name = pdf.split(/[\\/]/).pop().replace(/\.pdf$/, "");
  const out = join(OUT, `${name}.jpg`);
  try {
    if (statSync(out).mtimeMs >= statSync(join(PDF_DIR, pdf)).mtimeMs) continue;
  } catch {}
  // Page 1 at twice the 476 px target, as a PNG data URL.
  const dataUrl = await page.evaluate(async ({ url, width }) => {
    const pdfjs = await import("/pdfjs/build/pdf.min.mjs");
    pdfjs.GlobalWorkerOptions.workerSrc = "/pdfjs/build/pdf.worker.min.mjs";
    const doc = await pdfjs.getDocument(url).promise;
    const first = await doc.getPage(1);
    const viewport = first.getViewport({ scale: width / first.getViewport({ scale: 1 }).width });
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(viewport.width);
    canvas.height = Math.round(viewport.height);
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    await first.render({ canvasContext: ctx, viewport }).promise;
    return canvas.toDataURL("image/png");
  }, { url: "/" + pdf.split(/[\\/]/).join("/"), width: 952 });
  const png = Buffer.from(dataUrl.split(",")[1], "base64");
  await sharp(png).resize({ width: 476 }).jpeg({ quality: 72, mozjpeg: true }).toFile(out);
  await sharp(png).resize({ width: 320 }).jpeg({ quality: 72, mozjpeg: true }).toFile(join(OUT, `${name}.320.jpg`));
  written++;
}
await page.context().browser().close();
console.log(`${written} preview(s) written from ${pdfs.length} PDFs`);
