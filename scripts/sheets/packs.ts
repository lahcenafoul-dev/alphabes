// npm run packs -- [--pack=<id,…>] [--locale=<en,fr…>] [--paper=<letter,a4>] [--out=<dir>] [--samples=<dir>]
//
// Builds the Pro packs (lib/sheets/packs.ts): one PDF per pack, language and
// paper size (the Mega pack: one per part), each a single document printed
// once by Chromium, so the fonts and repeated pictures are embedded once.
// A pack is a cover, a contents page, "How to use this pack", the sheets
// (footer "AlphaBes Pro" and the page number), answer keys four to a page,
// and a certificate.
//
// The PDFs go to pro-files/<lang>/packs/<slug>[-part-<n>]-<paper>.pdf
// (git-ignored; scripts/upload-pro-files.mjs sends them to the private R2
// bucket), and lib/sheets/pack-manifest.json records each file's pages, size
// and sha256. Never into public/. --out=<dir> writes them there instead (a
// sample), and --samples=<dir> also saves PNGs of the cover, contents,
// how-to page, two sheet pages, an answer key page and the certificate.
//
// Build one language, one type and one paper size at a time (memory), and
// never with the dev server running.
import { createHash } from "crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import { dirname, join } from "path";
import { chromium } from "@playwright/test";
import sharp from "sharp";
import { preparePictures } from "../picture-emoji";
import { sheetPreview, sheetsOfKind, type Sheet, type SheetLocale } from "../../lib/sheets/catalog";
import {
  KEY_KINDS,
  PACKS,
  completePack,
  packFiles,
  packKey,
  packKindLevel,
  packKindName,
  type Pack,
  type PackKind,
  type PackPaper,
  type PackSection,
} from "../../lib/sheets/packs";
import { PUZZLES } from "../../lib/puzzles";
import type { MissingNumbersSheet } from "../../data/worksheets/missing-numbers";
import type { PatternsSheet } from "../../data/worksheets/patterns";
import type { BodyPartsSheet } from "../../data/worksheets/body-parts";
import { INK, LILAC, MUTED, PAGES, PURPLE, SOFT, BRIGHT, bodyBox, esc, fitBodies, sheetPage, typo } from "./chrome";
import { missingNumbersBody } from "./missing-numbers-layout";
import { patternsBody } from "./patterns-layout";
import { bodyPartsBody, ART_PROBLEMS } from "./art-layout";
import { DRAWING_PROBLEMS, drawingArt } from "./drawing-layout";
import { PUZZLE_CSS, puzzleBoard, puzzleCut } from "./puzzle-print-layout";
import { packText, type PackText } from "./pack-text";
import { SHELL, body } from "./render";

const ROOT = process.cwd();
const MANIFEST = join(ROOT, "lib", "sheets", "pack-manifest.json");
/** Each file stays under this; a bigger pack is split into parts (lib/sheets/packs.ts). */
const MAX_BYTES = 15 * 1024 * 1024;

const args = process.argv.slice(2);
const arg = (name: string) => args.find((a) => a.startsWith(`--${name}=`))?.slice(name.length + 3);
const packIds = arg("pack")?.split(",");
const locales = (arg("locale")?.split(",") ?? ["en"]) as SheetLocale[];
const papers = (arg("paper")?.split(",") ?? ["letter", "a4"]) as PackPaper[];
const out = arg("out");
const samples = arg("samples");

const OWL = (size: number) =>
  `<svg viewBox="0 0 44 44" style="width:${size}mm;height:${size}mm" aria-hidden="true"><circle cx="22" cy="24" r="19" fill="${PURPLE}"/><path d="M8 10l7 6M36 10l-7 6" stroke="${PURPLE}" stroke-width="5" stroke-linecap="round"/><circle cx="15" cy="22" r="7" fill="#fff"/><circle cx="29" cy="22" r="7" fill="#fff"/><circle cx="16" cy="23" r="3.4" fill="${INK}"/><circle cx="28" cy="23" r="3.4" fill="${INK}"/><path d="M19 30l3 4 3-4z" fill="#FFC94D"/></svg>`;

const PACK_CSS = `
${PUZZLE_CSS}
.pk { position: relative; overflow: hidden; background: #fff; color: ${INK}; font-family: script, sans-serif; display: flex; flex-direction: column; padding: 14mm 16mm 10mm; page-break-after: always; break-after: page }
.pk .d, .pk h1, .pk h2 { font-family: display, script, sans-serif }
.pk-band { position: absolute; left: 0; right: 0; top: 0; height: 104mm; background: ${LILAC} }
.pk-cover { align-items: center; text-align: center }
.pk-cover > :not(.pk-band) { position: relative }
.pk-brand { display: flex; align-items: center; gap: 3mm; font-family: display; font-weight: 800; font-size: 9mm }
.pk-pro { margin-top: 4mm; font-family: display; font-weight: 800; font-size: 4.2mm; letter-spacing: 0.4mm; color: #fff; background: ${PURPLE}; border-radius: 99mm; padding: 1.6mm 6mm 1.2mm }
.pk-cover h1 { margin: 9mm 0 0; font-size: 15mm; line-height: 1.02; letter-spacing: -0.3mm }
.pk-cover h2 { margin: 3mm 0 0; font-size: 8mm; font-weight: 700; color: ${PURPLE} }
.pk-facts { margin-top: 7mm; display: flex; flex-wrap: wrap; gap: 3mm; justify-content: center; font-family: display; font-weight: 700; font-size: 4.4mm }
.pk-facts span { background: #fff; border: 0.5mm solid #CFC6FF; border-radius: 99mm; padding: 1.6mm 5mm 1.1mm }
.pk-thumbs { margin-top: auto; display: grid; gap: 5mm; justify-content: center }
.pk-thumbs img { width: 100%; border-radius: 2mm; border: 0.4mm solid #DCD5FA; box-shadow: 0 1mm 2.5mm rgba(29,24,70,0.12); background: #fff }
.pk-foot { margin-top: 6mm; height: 4mm; display: flex; justify-content: space-between; font-size: 3.3mm; color: ${MUTED} }
.pk-head { display: flex; align-items: center; gap: 3mm; font-family: display; font-weight: 800; font-size: 6mm }
.pk h1.pk-title { margin: 7mm 0 2mm; font-size: 10mm; line-height: 1.05 }
.pk-lead { margin: 0 0 6mm; font-size: 4.6mm; line-height: 1.4; color: ${MUTED} }
.pk-toc { list-style: none; margin: 0; padding: 0; font-size: 4.6mm }
.pk-toc.two { columns: 2; column-gap: 10mm }
.pk-toc li { break-inside: avoid; display: flex; align-items: baseline; gap: 2mm; padding: 1.3mm 0 }
.pk-toc li::after { content: ""; order: 1; flex: 1; border-bottom: 0.45mm dotted #B9AEF5; transform: translateY(-1mm) }
.pk-toc li b { order: 2; font-family: display; font-weight: 800 }
.pk-toc li.kind { margin-top: 2.5mm; font-family: display; font-weight: 800; font-size: 5.4mm; color: ${PURPLE} }
.pk-toc li.sub { padding-left: 6mm }
.pk-toc li.end { margin-top: 2.5mm; font-family: display; font-weight: 800 }
.pk-tips { margin: 0; padding: 0; list-style: none; display: flex; flex-direction: column; gap: 3mm; font-size: 4.5mm; line-height: 1.38 }
.pk-tips li { display: flex; gap: 3mm }
.pk-tips li::before { content: ""; flex: none; width: 3mm; height: 3mm; margin-top: 1.5mm; border-radius: 50%; background: var(--dot) }
.pk-box { margin-top: 6mm; padding: 4mm 5mm; border-radius: 4mm; background: #FFF3D6; font-size: 4.4mm; line-height: 1.4 }
.pk-h3 { margin: 7mm 0 3mm; font-family: display; font-weight: 800; font-size: 6mm }
.pk-keys { display: grid; grid-template-columns: repeat(2, auto); gap: 6mm 6mm; justify-content: center }
.pk-key { display: flex; flex-direction: column; align-items: center; gap: 1.5mm }
.pk-key > div { overflow: hidden; border: 0.4mm solid #E6E1FA; border-radius: 2mm }
.pk-key span { font-size: 3.1mm; line-height: 1.25; color: ${MUTED}; text-align: center }
.pk-cert { align-items: center; justify-content: center; text-align: center; padding: 18mm }
.pk-frame { position: absolute; inset: 9mm; border-radius: 8mm; border: 2.4mm solid ${PURPLE}; box-shadow: inset 0 0 0 2mm #fff, inset 0 0 0 3mm #FFC94D }
.pk-cert > :not(.pk-frame) { position: relative }
.pk-cert h1 { margin: 6mm 0 0; font-size: 18mm; color: ${PURPLE}; letter-spacing: 0.4mm }
.pk-cert .great { margin-top: 10mm; font-family: display; font-weight: 800; font-size: 10mm }
.pk-line { margin: 6mm auto 0; width: 130mm; border-bottom: 0.6mm solid ${INK}; height: 14mm }
.pk-cert .done { margin-top: 10mm; font-family: display; font-weight: 700; font-size: 7mm; line-height: 1.25; max-width: 150mm }
.pk-sign { margin-top: 26mm; display: flex; gap: 20mm; font-size: 4.6mm; color: ${MUTED} }
.pk-sign span { width: 60mm; border-top: 0.45mm solid ${MUTED}; padding-top: 2mm }
.pk-stars { margin-top: 10mm; display: flex; gap: 6mm; justify-content: center }
`;

const r1 = (n: number) => Math.round(n * 10) / 10;

// ------------------------------------------------------------------ pictures

const dataUri = (buf: Buffer, type: string) => `data:${type};base64,${buf.toString("base64")}`;
const puzzleSrc = new Map<string, string>();

async function puzzlePicture(id: string): Promise<string> {
  if (!puzzleSrc.has(id)) {
    const jpg = await sharp(join(ROOT, "public", "puzzles", `${id}.webp`)).resize(1000).jpeg({ quality: 82, mozjpeg: true }).toBuffer();
    puzzleSrc.set(id, dataUri(jpg, "image/jpeg"));
  }
  return puzzleSrc.get(id)!;
}

async function thumb(kind: PackKind, item: string, locale: SheetLocale): Promise<string> {
  if (kind === "sliding-puzzles") {
    const jpg = await sharp(join(ROOT, "public", "puzzles", `${item}.webp`)).resize(300).jpeg({ quality: 78 }).toBuffer();
    return dataUri(jpg, "image/jpeg");
  }
  const file = join(ROOT, "public", sheetPreview(locale, sheetOf(kind, item)).replace(/\.jpg$/, ".320.jpg"));
  return dataUri(readFileSync(file), "image/jpeg");
}

function sheetOf(kind: PackKind, id: string): Sheet {
  const sheet = sheetsOfKind(kind as Sheet["kind"]).find((s) => s.id === id);
  if (!sheet) throw new Error(`No ${kind} sheet "${id}"`);
  return sheet;
}

// ------------------------------------------------------------------ one file

type Group = { kind: PackKind; sections: PackSection[] };
type Key = { html: string; caption: string };
type TocRow = { cls: "kind" | "sub" | "end" | ""; label: string; page: number };

/** One PDF's pages: the HTML of each, and the page numbers the samples need. */
type Book = { pages: string[]; marks: Record<string, number>; items: number };

async function buildFile(pack: Pack, locale: SheetLocale, paper: PackPaper, part?: number): Promise<Book> {
  const t = packText(locale);
  const box = bodyBox(paper);
  const size = PAGES[paper];
  const groups: Group[] = pack.parts ? pack.parts[part! - 1].kinds.map((k) => ({ kind: k, sections: completePack(k).sections })) : [{ kind: pack.kind as PackKind, sections: pack.sections }];
  const items = groups.reduce((n, g) => n + g.sections.reduce((m, s) => m + s.items.length, 0), 0);
  const pages: string[] = [];
  const marks: Record<string, number> = {};
  const toc: TocRow[] = [];
  const keys = new Map<PackKind, Key[]>();
  // The cover, contents and how-to pages come first: content starts on page 4.
  const FIRST = 4;
  const next = () => FIRST + pages.length;
  const foot = (): [string, string] => [t.site, t.page(next())];
  const page = (kindName: string, title: string, instruction: string, inner: string, noNameLine = false) =>
    sheetPage({ locale, page: paper, kindName, title, instruction, body: inner, noNameLine, foot: foot() });

  for (const g of groups) {
    const kindName = packKindName(g.kind)[locale];
    if (pack.parts) toc.push({ cls: "kind", label: kindName, page: next() });
    const withKeys = pack.keys && KEY_KINDS.includes(g.kind);
    const list: Key[] = [];
    for (const section of g.sections) {
      toc.push({ cls: pack.parts ? "sub" : "", label: section.label[locale], page: next() });
      for (const item of section.items) {
        if (g.kind === "sliding-puzzles") {
          const p = PUZZLES.find((x) => x.id === item)!;
          const src = await puzzlePicture(item);
          const name = p.name[locale];
          pages.push(page(kindName, t.puzzle.cut(name, 3), t.puzzle.cutInstruction, puzzleCut(src, 3, box), true));
          pages.push(page(kindName, t.puzzle.cut(name, 4), t.puzzle.cutInstruction, puzzleCut(src, 4, box), true));
          pages.push(page(kindName, t.puzzle.board(name), t.puzzle.boardInstruction, puzzleBoard(src, esc(t.puzzle.model), box), true));
          continue;
        }
        const sheet = sheetOf(g.kind, item);
        const at = next();
        const b = body(sheet, locale, paper);
        const parts = typeof b === "string" ? [{ body: b }] : b;
        // Telling time and mazes print their answers as a second page: it goes to the keys.
        const answerPages = g.kind === "telling-time" || g.kind === "mazes" ? parts.splice(1) : [];
        for (const p of parts) pages.push(page(kindName, p.title ?? sheet.title[locale], p.instruction ?? sheet.instruction[locale], p.body, p.noNameLine));
        if (withKeys) {
          const html = keyHtml(g.kind, sheet, locale, box, answerPages.map((p) => p.body));
          if (html) list.push({ html, caption: t.keyCaption(sheet.title[locale], at) });
        }
      }
    }
    if (list.length) keys.set(g.kind, list);
  }
  marks.sheet = FIRST;

  // Answer keys, four to a page, type by type.
  for (const [kind, list] of keys) {
    const kindName = packKindName(kind)[locale];
    toc.push({ cls: "end", label: pack.parts ? `${t.answerKeys}: ${kindName}` : t.answerKeys, page: next() });
    marks.key ??= next();
    for (let i = 0; i < list.length; i += 4) pages.push(page(kindName, t.keyTitle(kindName), t.keyInstruction, keyGrid(list.slice(i, i + 4), box), true));
  }

  toc.push({ cls: "end", label: t.certificate, page: next() });
  const title = pack.parts ? t.part(part!, pack.parts.length, pack.parts[part! - 1].name[locale]) : pack.name[locale];
  const packName = pack.parts ? t.packName(pack.name[locale], title) : t.packName(packKindName(pack.kind as PackKind)[locale], pack.scope === "level" ? pack.name[locale] : undefined);
  marks.certificate = next();
  pages.push(certificate(t, locale, size, packName));

  // Thumbnails: six sheets spread across the pack (one a type in the Mega pack).
  const all = groups.flatMap((g) => g.sections.flatMap((s) => s.items.map((item) => ({ kind: g.kind, item }))));
  const picks = pack.parts
    ? groups.map((g) => ({ kind: g.kind, item: g.sections[0].items[0] }))
    : Array.from({ length: Math.min(6, all.length) }, (_, i) => all[Math.floor(((i + 0.5) * all.length) / Math.min(6, all.length))]);
  const thumbs = await Promise.all(picks.map((p) => thumb(p.kind, p.item, locale)));

  const front = [
    cover(t, locale, size, pack, title, groups, items, thumbs),
    contents(t, locale, size, title, toc),
    howTo(t, locale, size, pack, groups, keys.size ? marks.key : 0),
  ];
  marks.cover = 1;
  marks.contents = 2;
  marks.how = 3;
  return { pages: [...front, ...pages], marks, items };
}

/** A sheet's answer key at full body size (shrunk four to a page by keyGrid), or null if it has none. */
function keyHtml(kind: PackKind, sheet: Sheet, locale: SheetLocale, box: { w: number; h: number }, answerPages: string[]): string | null {
  switch (kind) {
    case "missing-numbers":
      return missingNumbersBody(sheet as MissingNumbersSheet, locale, box, true);
    case "patterns":
      return patternsBody(sheet as PatternsSheet, locale, box, true);
    case "body-parts":
      return bodyPartsBody(sheet as BodyPartsSheet, locale, box, true);
    case "dot-to-dot":
    case "colouring": {
      const params = sheet.params as { drawing: string; version?: string };
      if (params.version === "plain") return null;
      return `<svg width="${box.w}mm" height="${box.h}mm" viewBox="0 0 ${box.w} ${box.h}" aria-hidden="true">${drawingArt(params.drawing, { x0: 8, y0: 8, x1: box.w - 8, y1: box.h - 8 }, `k-${sheet.id}`, "paint")}</svg>`;
    }
    case "telling-time":
    case "mazes":
      return answerPages[0] ?? null;
    default:
      return null;
  }
}

function keyGrid(list: Key[], box: { w: number; h: number }): string {
  const gap = 6;
  const caption = 8;
  const s = Math.min((box.w - gap) / 2 / box.w, ((box.h - gap) / 2 - caption) / box.h);
  const cells = list
    .map(
      (k) => `<div class="pk-key"><div style="width:${r1(box.w * s)}mm;height:${r1(box.h * s)}mm">
        <div style="width:${box.w}mm;height:${box.h}mm;transform:scale(${s.toFixed(4)});transform-origin:0 0;display:flex;align-items:center;justify-content:center">${k.html}</div></div>
        <span style="max-width:${r1(box.w * s)}mm">${esc(k.caption)}</span></div>`,
    )
    .join("");
  return `<div class="pk-keys">${cells}</div>`;
}

// ------------------------------------------------------------------ the pack's own pages

type Size = { width: number; height: number };
const frame = (size: Size, cls: string, inner: string) => `<section class="pk ${cls} page" style="width:${size.width}mm;height:${size.height}mm">${inner}</section>`;
const head = () => `<div class="pk-head">${OWL(10)}AlphaBes</div>`;
const pageFoot = (t: PackText, n: number) => `<footer class="pk-foot" style="margin-top:auto"><span>${esc(t.site)}</span><span>${esc(t.page(n))}</span></footer>`;

function cover(t: PackText, locale: SheetLocale, size: Size, pack: Pack, title: string, groups: Group[], items: number, thumbs: string[]): string {
  const name = pack.parts ? pack.name[locale] : packKindName(pack.kind as PackKind)[locale];
  const kind = pack.parts ? "mega" : (pack.kind as PackKind);
  const level = packKindLevel(groups[0].kind)[locale];
  // A Mega pack part: from its youngest to its oldest type's ages ("ages 2–8").
  const inBrackets = (s: string) => s.replace(/^.*\(|\)$/g, "");
  const spans = groups.map((g) => inBrackets(packKindLevel(g.kind)[locale]).match(/\d+/g)!.map(Number));
  const span = [Math.min(...spans.map((x) => x[0])), Math.max(...spans.map((x) => x[1]))];
  let i = 0;
  const ages = pack.parts ? inBrackets(level).replace(/\d+/g, () => String(span[i++])) : level;
  const facts = [t.count(items, kind), pack.parts ? groups.map((g) => packKindName(g.kind)[locale]).join(" · ") : ages];
  if (pack.keys && groups.some((g) => KEY_KINDS.includes(g.kind))) facts.push(t.keys);
  facts.push(t.certificate);
  const cols = thumbs.length <= 4 ? thumbs.length : 3;
  const w = cols === 3 ? 46 : cols === 4 ? 40 : 56;
  return frame(
    size,
    "pk-cover",
    `<div class="pk-band"></div>
    <div class="pk-brand" style="margin-top:6mm">${OWL(17)}AlphaBes</div>
    <div class="pk-pro">${esc(t.pro.toUpperCase())}</div>
    <h1>${esc(typo(name, locale))}</h1>
    <h2>${esc(typo(title, locale))}</h2>
    <div class="pk-facts">${facts.map((f) => `<span>${esc(typo(f, locale))}</span>`).join("")}</div>
    <div class="pk-thumbs" style="grid-template-columns:repeat(${cols},${w}mm)">${thumbs.map((src) => `<img src="${src}" alt="">`).join("")}</div>
    <footer class="pk-foot" style="width:100%"><span>${esc(t.site)}</span><span>${esc(ages)}</span></footer>`,
  );
}

function contents(t: PackText, locale: SheetLocale, size: Size, title: string, toc: TocRow[]): string {
  const rows = toc.map((r) => `<li class="${r.cls}"><span>${esc(typo(r.label, locale))}</span><b>${r.page}</b></li>`).join("");
  // Long lists (the Mega pack's parts) get a smaller font and two columns.
  const long = toc.length > 17;
  const font = long ? 3.9 : 4.6;
  return frame(
    size,
    "",
    `${head()}<h1 class="pk-title">${esc(typo(t.contents, locale))}</h1><p class="pk-lead">${esc(typo(title, locale))} · ${esc(typo(t.contentsIntro, locale))}</p>
    <ol class="pk-toc${long ? " two" : ""}" style="font-size:${font}mm"><li class="end"><span>${esc(typo(t.howTitle, locale))}</span><b>3</b></li>${rows}</ol>${pageFoot(t, 2)}`,
  );
}

function howTo(t: PackText, locale: SheetLocale, size: Size, pack: Pack, groups: Group[], keyPage: number): string {
  const tip = (s: string, i: number) => `<li style="--dot:${BRIGHT[i % BRIGHT.length]}"><span>${esc(typo(s, locale))}</span></li>`;
  const kindTips = pack.parts ? groups.map((g) => t.howKind[g.kind].line) : t.howKind[pack.kind as PackKind].tips;
  const general = keyPage ? t.howGeneral : t.howGeneral.filter((s) => !/answer|réponse|respuesta|resposta/i.test(s));
  const kindTitle = pack.parts ? pack.name[locale] : packKindName(pack.kind as PackKind)[locale];
  return frame(
    size,
    "",
    `${head()}<h1 class="pk-title">${esc(typo(t.howTitle, locale))}</h1><p class="pk-lead">${esc(typo(t.howIntro, locale))}</p>
    <div class="pk-h3">${esc(typo(kindTitle, locale))}</div><ul class="pk-tips">${kindTips.map(tip).join("")}</ul>
    <div class="pk-h3">${esc(t.pro)}</div><ul class="pk-tips">${general.map((s, i) => tip(s, i + 2)).join("")}</ul>
    ${keyPage ? `<div class="pk-box" style="background:${SOFT[2]}"><b>${esc(t.answerKeys)}</b> · ${esc(t.page(keyPage))}</div>` : ""}
    ${pageFoot(t, 3)}`,
  );
}

function certificate(t: PackText, locale: SheetLocale, size: Size, packName: string): string {
  const star = (fill: string) => `<svg viewBox="0 0 24 24" style="width:12mm;height:12mm"><path d="M12 2l2.9 6.6 7.1.6-5.4 4.7 1.6 7L12 17.3 5.8 20.9l1.6-7L2 9.2l7.1-.6z" fill="${fill}" stroke="${INK}" stroke-width="0.8" stroke-linejoin="round"/></svg>`;
  return frame(
    size,
    "pk-cert",
    `<div class="pk-frame"></div>
    ${OWL(34)}
    <h1>${esc(typo(t.certTitle, locale))}</h1>
    <div class="pk-stars">${star("#FFC94D")}${star("#FF5C93")}${star("#3EA6FF")}</div>
    <div class="great">${esc(typo(t.certGreat, locale))}</div>
    <div class="pk-line"></div>
    <div class="done">${esc(typo(t.certFinished(packName), locale))}</div>
    <div class="pk-sign"><span>${esc(t.certDate)}</span><span>${esc(t.certSigned)}</span></div>
    <div class="pk-brand" style="margin-top:14mm;font-size:6mm">${OWL(9)}AlphaBes</div>`,
  );
}

// ------------------------------------------------------------------ main

type Manifest = Record<string, { pages: number; bytes: number; sha256: string }>;

async function main() {
  const list = packIds ? PACKS.filter((p) => packIds.includes(p.id)) : PACKS;
  if (!list.length) throw new Error(`No pack matches ${packIds?.join(",")}`);
  await preparePictures();
  const manifest: Manifest = existsSync(MANIFEST) ? JSON.parse(readFileSync(MANIFEST, "utf8")) : {};
  const browser = await chromium.launch();
  const problems: string[] = [];
  for (const locale of locales) {
    for (const paper of papers) {
      const size = PAGES[paper];
      const context = await browser.newContext({ viewport: { width: Math.round((size.width / 25.4) * 96), height: Math.round((size.height / 25.4) * 96) }, deviceScaleFactor: samples ? 2 : 1 });
      for (const pack of list) {
        for (const { part } of packFiles(pack)) {
          const key = packKey(locale, pack, paper, part);
          const file = join(out ?? join(ROOT, "pro-files"), key);
          const book = await buildFile(pack, locale, paper, part);
          const page = await context.newPage();
          await page.setContent(SHELL(locale, PACK_CSS));
          await page.evaluate((html) => (document.body.innerHTML = html), book.pages.join(""));
          await page.evaluate(() => Promise.all([...document.images].map((img) => img.decode().catch(() => {}))));
          await page.evaluate(() => document.fonts.ready);
          const shrunk = await page.evaluate(fitBodies);
          if (shrunk) problems.push(`${key}: ${shrunk} page(s) shrunk to fit`);
          mkdirSync(dirname(file), { recursive: true });
          const pdf = await page.pdf({ path: file, width: `${size.width}mm`, height: `${size.height}mm`, printBackground: true });
          const count = await page.locator(".page").count();
          if (count !== book.pages.length) problems.push(`${key}: ${count} pages printed, ${book.pages.length} built`);
          manifest[key] = { pages: count, bytes: pdf.length, sha256: createHash("sha256").update(pdf).digest("hex") };
          console.log(`  ${key}: ${count} pages, ${(pdf.length / 1024 / 1024).toFixed(2)} MB`);
          if (pdf.length > MAX_BYTES) problems.push(`${key}: ${(pdf.length / 1024 / 1024).toFixed(1)} MB, over the 15 MB target (split the pack)`);
          if (samples) {
            const dir = join(samples, `${pack.slug[locale]}${part ? `-part-${part}` : ""}`);
            mkdirSync(dir, { recursive: true });
            const shots: [string, number][] = [
              ["1-cover", book.marks.cover],
              ["2-contents", book.marks.contents],
              ["3-how-to", book.marks.how],
              ["4-sheet", book.marks.sheet],
              ["5-sheet", Math.min(book.marks.sheet + Math.floor(book.items / 2), book.pages.length - 1)],
              ...(book.marks.key ? ([["6-answer-key", book.marks.key]] as [string, number][]) : []),
              ["7-certificate", book.marks.certificate],
            ];
            for (const [name, n] of shots) await page.locator(".page").nth(n - 1).screenshot({ path: join(dir, `${name}.png`) });
          }
          await page.close();
        }
      }
      await context.close();
    }
  }
  await browser.close();
  if (!out) writeFileSync(MANIFEST, JSON.stringify(Object.fromEntries(Object.entries(manifest).sort()), null, 2) + "\n");
  problems.push(...DRAWING_PROBLEMS, ...ART_PROBLEMS);
  if (problems.length) {
    console.warn(`Problems:\n  ${[...new Set(problems)].join("\n  ")}`);
    process.exitCode = 1;
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

