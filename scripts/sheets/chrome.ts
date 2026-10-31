// The page around every sheet of the new worksheet types (lib/sheets/), in
// the home page's owl colours: a small owl logo and "AlphaBes", the title, a
// Name/Date line, the instruction, the exercise, and a footer. English pages
// are US Letter, the others A4; margins are 12 mm at the sides and 10 mm at
// the top and bottom. The exercise (from the type's layout script) gets a box
// whose size it can rely on (bodyBox); the browser shrinks it if it ever
// overflows (fitBodies), and the script reports that.
import type { SheetLocale } from "../../lib/sheets/types";

export const INK = "#1D1846";
export const PURPLE = "#6A4CFF";
export const LILAC = "#EEEAFF";
export const MUTED = "#565177";
/** Light fills for boxes and stickers: pink, yellow, green, purple, blue. */
export const SOFT = ["#FFE1EC", "#FFF0C7", "#DDF7EE", "#E9E4FF", "#DDEEFF"];
/** Their stronger versions, for outlines. */
export const BRIGHT = ["#FF5C93", "#FFB020", "#18A97F", "#6A4CFF", "#3EA6FF"];

/** French puts a space before ! ? : ; — a non-breaking one, so "!" never wraps alone. */
export const typo = (s: string, locale: SheetLocale) => (locale === "fr" ? s.replace(/ ([!?:;»])/g, " $1").replace(/« /g, "« ") : s);

export const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export const PAGES = {
  letter: { width: 215.9, height: 279.4 },
  a4: { width: 210, height: 297 },
};
const SIDE = 12;
const TOP = 10;
const BOTTOM = 10;

/**
 * The room left for the exercise, in mm, with a two-line title. Layouts
 * size themselves to fit it; a one-line title leaves a little more room,
 * and the body centres its content vertically.
 */
export function bodyBox(page: "letter" | "a4"): { w: number; h: number } {
  const p = PAGES[page];
  // logo row 10, title 2 lines 17 + 3, Name/Date 9, instruction 15, gaps 6,
  // footer 7, and 4 mm to spare. Measured (--debug): at least 194.5 mm on
  // Letter and 208.5 mm on A4 (the longest titles).
  // 1 mm less in width, so rounded sizes never add up to more than the page.
  return { w: Math.floor(p.width - 2 * SIDE - 1), h: Math.round((p.height - TOP - BOTTOM - 71) * 10) / 10 };
}

const LABELS: Record<SheetLocale, { name: string; date: string; site: string }> = {
  en: { name: "Name:", date: "Date:", site: "alphabes.com · Free printable worksheets" },
  fr: { name: "Prénom :", date: "Date :", site: "alphabes.com/fr · Fiches gratuites à imprimer" },
  es: { name: "Nombre:", date: "Fecha:", site: "alphabes.com/es · Fichas gratis para imprimir" },
  pt: { name: "Nome:", date: "Data:", site: "alphabes.com/pt · Atividades grátis para imprimir" },
};

// The owl's head from the home page (components/home/Owl.tsx, OwlMark).
const OWL = `<svg class="sh-owl" viewBox="0 0 44 44" aria-hidden="true"><circle cx="22" cy="24" r="19" fill="${PURPLE}"/><path d="M8 10l7 6M36 10l-7 6" stroke="${PURPLE}" stroke-width="5" stroke-linecap="round"/><circle cx="15" cy="22" r="7" fill="#fff"/><circle cx="29" cy="22" r="7" fill="#fff"/><circle cx="16" cy="23" r="3.4" fill="${INK}"/><circle cx="28" cy="23" r="3.4" fill="${INK}"/><path d="M19 30l3 4 3-4z" fill="#FFC94D"/></svg>`;

const PENCIL = `<svg class="sh-pencil" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 20l1.2-4.6L16 4.6a2 2 0 0 1 2.8 0l.6.6a2 2 0 0 1 0 2.8L8.6 18.8z" fill="#FFC94D" stroke="${INK}" stroke-width="1.6" stroke-linejoin="round"/><path d="M14.5 6.1l3.4 3.4" stroke="${INK}" stroke-width="1.6"/><path d="M4 20l1.2-4.6 3.4 3.4z" fill="${INK}"/></svg>`;

export const SHEET_CSS = `
@page { margin: 0 }
* { box-sizing: border-box }
html, body { margin: 0; padding: 0; background: #fff }
.sh { position: relative; overflow: hidden; background: #fff; color: ${INK}; font-family: script, sans-serif; display: flex; flex-direction: column; padding: ${TOP}mm ${SIDE}mm ${BOTTOM}mm; page-break-after: always; break-after: page }
.sh:last-child { page-break-after: auto; break-after: auto }
.sh .d { font-family: display, script, sans-serif }
.sh-top { height: 10mm; display: flex; align-items: center; justify-content: space-between }
.sh-logo { display: flex; align-items: center; gap: 2mm; font-family: display; font-weight: 800; font-size: 6mm; line-height: 1 }
.sh-owl { width: 9mm; height: 9mm; display: block }
.sh-kind { font-family: display; font-weight: 700; font-size: 3.8mm; color: ${PURPLE}; background: ${LILAC}; border-radius: 99mm; padding: 1.3mm 4mm 1mm }
.sh-title { margin: 3mm 0 0; font-family: display; font-weight: 800; line-height: 1.08; letter-spacing: -0.1mm }
.sh-who { margin-top: 3.5mm; display: flex; gap: 10mm; font-size: 4.2mm; color: ${MUTED} }
.sh-who span { flex: 1; display: flex; gap: 2mm; align-items: flex-end }
.sh-who span::after { content: ""; flex: 1; border-bottom: 0.3mm solid #9a95b8; height: 4mm }
.sh-who .sh-date { flex: 0 0 58mm }
.sh-instr { margin: 4mm 0 0; padding: 2.4mm 4mm; border-radius: 4mm; background: #FFF3D6; font-size: 4.6mm; line-height: 1.3; display: flex; gap: 3mm; align-items: center; font-weight: 700 }
.sh-pencil { width: 6.5mm; height: 6.5mm; flex: none }
.sh-body { flex: 1; min-height: 0; margin-top: 5mm; display: flex; flex-direction: column; justify-content: center; align-items: center }
.sh-inner { transform-origin: top center }
.sh-foot { margin-top: 3mm; height: 4mm; display: flex; justify-content: space-between; font-size: 3.3mm; color: ${MUTED} }
.sh svg { display: block; overflow: visible }
.sh img { display: block }
/* Number boxes: printed numbers on a light fill, empty ones to write in. */
.nb { display: flex; align-items: center; justify-content: center; border-radius: 2.6mm; font-family: display; font-weight: 800; line-height: 1; padding-top: 0.12em; background: #F4F1FF; border: 0.4mm solid #CFC6FF; color: ${INK} }
.nb.blank { background: #fff; border: 0.7mm solid ${PURPLE} }
`;

/**
 * One page of a sheet with several (flash card sets, answer keys): its
 * exercise, and a title or instruction when they differ from the sheet's.
 */
export type SheetPart = { body: string; title?: string; instruction?: string; noNameLine?: boolean };

export type SheetPage = {
  locale: SheetLocale;
  page: "letter" | "a4";
  kindName: string;
  title: string;
  instruction: string;
  body: string;
  /** Leave out the Name/Date line (flash cards: nothing to write). */
  noNameLine?: boolean;
};

export function sheetPage(s: SheetPage): string {
  const p = PAGES[s.page];
  const t = LABELS[s.locale];
  // Two lines at most: long titles get a smaller size.
  const titleSize = s.title.length > 62 ? 6.4 : s.title.length > 46 ? 7.2 : 8.4;
  return `<section class="sh page" style="width:${p.width}mm;height:${p.height}mm">
  <header class="sh-top"><span class="sh-logo">${OWL}AlphaBes</span><span class="sh-kind">${esc(s.kindName)}</span></header>
  <h1 class="sh-title" style="font-size:${titleSize}mm">${esc(typo(s.title, s.locale))}</h1>
  ${s.noNameLine ? "" : `<div class="sh-who"><span>${esc(typo(t.name, s.locale))}</span><span class="sh-date">${esc(typo(t.date, s.locale))}</span></div>`}
  <p class="sh-instr">${PENCIL}<span>${esc(typo(s.instruction, s.locale))}</span></p>
  <div class="sh-body"><div class="sh-inner">${s.body}</div></div>
  <footer class="sh-foot"><span>${esc(t.site)}</span><span>${esc(s.kindName)}</span></footer>
</section>`;
}

/**
 * Runs in the page once fonts and images are ready: shrinks an exercise that
 * doesn't fit its box (it shouldn't) and returns how many had to be shrunk.
 */
export function fitBodies(): number {
  let shrunk = 0;
  document.querySelectorAll<HTMLElement>(".sh-body").forEach((body) => {
    const inner = body.firstElementChild as HTMLElement;
    const scale = Math.min(body.clientHeight / inner.scrollHeight, body.clientWidth / inner.scrollWidth);
    if (scale < 0.999) {
      inner.style.transform = `scale(${scale})`;
      shrunk++;
    }
  });
  return shrunk;
}
