// The telling-time sheets (data/worksheets/telling-time.ts): clocks drawn in
// code, with the numbers 1 to 12, minute ticks, a short pink hour hand and
// a long blue minute hand. Each activity lays out its clocks to fill the
// page; page 2 is the answer key, with the answers in pink.
import { ANSWER_KEY, digital, getRoutine, timeWords, type Time, type TellingTimeSheet } from "../../data/worksheets/telling-time";
import { seededRandom, pick, type SheetLocale } from "../../lib/sheets/types";
import { picturePrint } from "../picture-emoji";
import { INK, MUTED, PURPLE, esc, typo, type SheetPart } from "./chrome";

type Box = { w: number; h: number };

const r1 = (n: number) => Math.round(n * 10) / 10;
const r2 = (n: number) => Math.round(n * 100) / 100;

export const HOUR_HAND = "#FF5C93";
export const MINUTE_HAND = "#3EA6FF";
const ANSWER = "#E0306E";

export const CLOCK_CSS = `
.ck-grid { display: grid; align-items: center; justify-items: center }
.ck-cell { display: flex; flex-direction: column; align-items: center; gap: 2mm }
.ck-ans { display: flex; align-items: center; gap: 1.2mm; font-family: display; font-weight: 800; font-size: 6.5mm; line-height: 1 }
.ck-ans b { display: flex; align-items: center; justify-content: center; width: 13mm; height: 10.5mm; border: 0.5mm solid ${PURPLE}; border-radius: 2.4mm; color: ${ANSWER}; padding-top: 0.6mm }
.ck-sep { color: ${INK} }
.ck-words { font-size: 3.7mm; color: ${MUTED}; text-align: center; line-height: 1.15; min-height: 4.3mm }
.ck-words.key { color: ${ANSWER}; font-weight: 700 }
.ck-time { font-family: display; font-weight: 800; font-size: 8mm; line-height: 1; padding-top: 0.08em }
.ck-label { font-size: 3.6mm; color: ${MUTED}; text-align: center; font-weight: 700 }
.ck-abs { position: relative }
.ck-abs > * { position: absolute }
.ck-dot { width: 3.4mm; height: 3.4mm; border-radius: 50%; background: ${INK}; transform: translate(-50%, -50%) }
.ck-digital { display: flex; align-items: center; justify-content: center; border: 0.6mm solid ${PURPLE}; border-radius: 3mm; background: #F4F1FF; font-family: display; font-weight: 800; font-size: 8mm; line-height: 1; padding-top: 0.8mm; transform: translateY(-50%) }
.ck-card { display: flex; align-items: center; gap: 3mm; border: 0.5mm solid #CFC6FF; border-radius: 4mm; padding: 2.5mm 3mm; box-sizing: border-box }
.ck-say { display: flex; flex-direction: column; align-items: center; gap: 2mm; flex: 1; text-align: center; font-size: 4.3mm; font-weight: 700; line-height: 1.2 }
`;

/** A clock face; with `time`, its hands. `size` in mm. */
export function clockSvg(size: number, time?: Time | null): string {
  const ticks: string[] = [];
  for (let i = 0; i < 60; i++) {
    const a = (i * 6 * Math.PI) / 180;
    const big = i % 5 === 0;
    const r0 = big ? 38.5 : 40.5;
    ticks.push(`M${r2(50 + r0 * Math.sin(a))} ${r2(50 - r0 * Math.cos(a))}L${r2(50 + 43 * Math.sin(a))} ${r2(50 - 43 * Math.cos(a))}`);
  }
  const nums = Array.from({ length: 12 }, (_, i) => {
    const n = i + 1;
    const a = (n * 30 * Math.PI) / 180;
    return `<text x="${r2(50 + 31 * Math.sin(a))}" y="${r2(50 - 31 * Math.cos(a) + 3.9)}" text-anchor="middle" font-family="display" font-weight="800" font-size="11" fill="${INK}">${n}</text>`;
  }).join("");
  let hands = "";
  if (time) {
    const [h, m] = time;
    const ha = (((h % 12) + m / 60) * 30 * Math.PI) / 180;
    const ma = (m * 6 * Math.PI) / 180;
    // The minute hand first, so the short hour hand stays visible on top (12:00).
    hands =
      `<path d="M50 50L${r2(50 + 28 * Math.sin(ma))} ${r2(50 - 28 * Math.cos(ma))}" stroke="${MINUTE_HAND}" stroke-width="3.2" stroke-linecap="round"/>` +
      `<path d="M50 50L${r2(50 + 18 * Math.sin(ha))} ${r2(50 - 18 * Math.cos(ha))}" stroke="${HOUR_HAND}" stroke-width="5.2" stroke-linecap="round"/>`;
  }
  return `<svg width="${r1(size)}mm" height="${r1(size)}mm" viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="50" r="46.5" fill="#fff" stroke="${PURPLE}" stroke-width="4"/><path d="${ticks.join("")}" stroke="${INK}" stroke-width="0.9" stroke-linecap="round"/><path d="${ticks.filter((_, i) => i % 5 === 0).join("")}" stroke="${INK}" stroke-width="1.8" stroke-linecap="round"/>${nums}${hands}<circle cx="50" cy="50" r="3.4" fill="${INK}"/></svg>`;
}

/** Boxes to write a time in ("__:__", French "__ h __"), filled in on the key. */
function answer(time: Time | null, locale: SheetLocale): string {
  const [h, m] = time ?? [null, null];
  const sep = locale === "fr" ? "h" : ":";
  return `<div class="ck-ans"><b>${h ?? ""}</b><span class="ck-sep">${sep}</span><b>${m === null ? "" : String(m).padStart(2, "0")}</b></div>`;
}

const words = (time: Time, locale: SheetLocale, key = false) => `<div class="ck-words${key ? " key" : ""}">${esc(typo(timeWords(time, locale), locale))}</div>`;

/** Clocks in `cols` columns and as many rows as needed, each cell `content(time, size)`. */
function grid(times: Time[], box: Box, cols: number, extra: number, content: (t: Time, size: number) => string): string {
  const rows = Math.ceil(times.length / cols);
  const cellH = box.h / rows;
  const size = Math.min(cellH - extra, box.w / cols - 14);
  return `<div class="ck-grid" style="width:${box.w}mm;height:${r1(box.h)}mm;grid-template-columns:repeat(${cols},1fr);grid-template-rows:repeat(${rows},1fr)">${times.map((t) => `<div class="ck-cell">${content(t, size)}</div>`).join("")}</div>`;
}

function readBody(times: Time[], locale: SheetLocale, box: Box, key: boolean): string {
  return grid(times, box, 2, 23, (t, size) => `${clockSvg(size, t)}${answer(key ? t : null, locale)}${key ? words(t, locale, true) : `<div class="ck-words"></div>`}`);
}

function drawBody(times: Time[], locale: SheetLocale, box: Box, key: boolean): string {
  return grid(times, box, 2, 21, (t, size) => `<div class="ck-time">${esc(digital(t, locale))}</div>${words(t, locale)}${clockSvg(size, key ? t : null)}`);
}

function matchBody(sheet: TellingTimeSheet, locale: SheetLocale, box: Box, key: boolean): string {
  const times = sheet.params.times;
  const n = times.length;
  // The digital times in a seeded order, never all in place.
  let order = pick([...times.keys()], n, seededRandom(`${sheet.id}-order`));
  if (order.some((o, i) => o === i)) order = order.map((_, i) => (i + 2) % n);
  const rowH = box.h / n;
  const size = Math.min(rowH - 4, 34);
  const clockX = 8 + size / 2;
  const dotL = clockX + size / 2 + 8;
  const boxW = 46;
  const boxX = box.w - 8 - boxW;
  const dotR = boxX - 8;
  const y = (i: number) => r2(rowH * (i + 0.5));
  const items: string[] = [];
  times.forEach((t, i) => {
    items.push(`<div style="left:${r2(clockX - size / 2)}mm;top:${r2(y(i) - size / 2)}mm">${clockSvg(size, t)}</div>`);
    items.push(`<span class="ck-dot" style="left:${r2(dotL)}mm;top:${y(i)}mm"></span>`);
    const tt = times[order[i]];
    items.push(`<span class="ck-dot" style="left:${r2(dotR)}mm;top:${y(i)}mm"></span>`);
    items.push(`<div class="ck-digital" style="left:${r2(boxX)}mm;top:${y(i)}mm;width:${boxW}mm;height:${r1(Math.min(18, rowH - 10))}mm">${esc(digital(tt, locale))}</div>`);
  });
  const lines = key
    ? `<svg style="left:0;top:0" width="${box.w}mm" height="${r1(box.h)}mm" viewBox="0 0 ${box.w} ${r1(box.h)}"><path d="${times
        .map((_, i) => `M${r2(dotL)} ${y(i)}L${r2(dotR)} ${y(order.indexOf(i))}`)
        .join("")}" stroke="${ANSWER}" stroke-width="1" stroke-linecap="round"/></svg>`
    : "";
  return `<div class="ck-abs" style="width:${box.w}mm;height:${r1(box.h)}mm">${lines}${items.join("")}</div>`;
}

const BEFORE_AFTER: Record<SheetLocale, [string, string]> = {
  en: ["1 hour before", "1 hour after"],
  fr: ["1 heure avant", "1 heure après"],
  es: ["1 hora antes", "1 hora después"],
  pt: ["1 hora antes", "1 hora depois"],
};

function beforeAfterBody(times: Time[], locale: SheetLocale, box: Box, key: boolean): string {
  const rowH = box.h / times.length;
  const size = Math.min(rowH - 6, 44);
  const [b, a] = BEFORE_AFTER[locale];
  const shift = ([h, m]: Time, d: number): Time => [((h - 1 + d + 12) % 12) + 1, m];
  const side = (label: string, t: Time) => `<div class="ck-cell"><div class="ck-label">${esc(label)}</div>${answer(key ? t : null, locale)}</div>`;
  const rows = times
    .map((t) => `<div style="display:grid;grid-template-columns:1fr ${r1(size + 16)}mm 1fr;align-items:center;justify-items:center;height:${r1(rowH)}mm">${side(b, shift(t, -1))}${clockSvg(size, t)}${side(a, shift(t, 1))}</div>`)
    .join("");
  return `<div style="width:${box.w}mm">${rows}</div>`;
}

/** French "à 8 h 30" never breaks inside the time. */
const keepTime = (text: string) => text.replace(/\d+ h( \d+)?/g, (t) => t.replace(/ /g, "\u00a0"));

function routineBody(sheet: TellingTimeSheet, locale: SheetLocale, box: Box, key: boolean): string {
  const steps = getRoutine(sheet.params.routine!).steps;
  const rows = Math.ceil(steps.length / 2);
  const gap = 4;
  const cardH = (box.h - (rows - 1) * gap) / rows;
  const cardW = (box.w - gap) / 2;
  const size = Math.min(cardH - 6, cardW * 0.5);
  const cards = steps
    .map(
      (s) =>
        `<div class="ck-card" style="width:${r1(cardW)}mm;height:${r1(cardH)}mm"><div class="ck-say"><div style="font-size:20mm;line-height:0">${picturePrint(s.picture)}</div><div>${esc(typo(keepTime(s.text[locale]), locale))}</div></div>${clockSvg(size, key ? s.time : null)}</div>`,
    )
    .join("");
  return `<div style="display:grid;grid-template-columns:repeat(2,${r1(cardW)}mm);gap:${gap}mm">${cards}</div>`;
}

function page(sheet: TellingTimeSheet, locale: SheetLocale, box: Box, key: boolean): string {
  const { activity, times } = sheet.params;
  switch (activity) {
    case "read":
      return readBody(times, locale, box, key);
    case "draw":
      return drawBody(times, locale, box, key);
    case "match":
      return matchBody(sheet, locale, box, key);
    case "before-after":
      return beforeAfterBody(times, locale, box, key);
    case "routine":
      return routineBody(sheet, locale, box, key);
  }
}

export function tellingTimeBody(sheet: TellingTimeSheet, locale: SheetLocale, box: Box): SheetPart[] {
  return [
    { body: page(sheet, locale, box, false) },
    { body: page(sheet, locale, box, true), title: `${ANSWER_KEY[locale]}${locale === "fr" ? " : " : ": "}${sheet.title[locale]}` },
  ];
}
