// Usage (from the repo root): node scripts/i18n-check/aplaude-mobile.mjs [baseUrl] [shotsDir]
// "Aplaude las sílabas" played to the end at phone width (390 px), with a
// fake es-MX voice: layout (no horizontal scroll, the five count buttons on
// one row and fully on screen), speech, and the ten rounds. The page width
// is reported separately from the game: at 320 px the site header (logo,
// EN/FR/ES switcher, menu button) is 355 px wide on every page (open issue in
// docs/spanish-plan.md). No phone emulation: it would widen the layout to fit
// the header and hide that.
import { mkdirSync } from "fs";
import { chromium } from "@playwright/test";

const base = process.argv[2] ?? "http://localhost:3400";
const shots = process.argv[3] ?? "i18n-shots";
mkdirSync(shots, { recursive: true });
let problems = 0;
const check = (ok, label) => { if (!ok) problems++; console.log(`  ${ok ? "✓" : "✗"} ${label}`); };

const fakeVoices = (langs) => `(() => {
  const voices = ${JSON.stringify(langs)}.map((lang) => ({ lang, name: "Voz " + lang, localService: true, default: false, voiceURI: lang }));
  window.__spoken = [];
  window.SpeechSynthesisUtterance = class { constructor(text) { this.text = text; } };
  Object.defineProperty(window, "speechSynthesis", { value: {
    getVoices: () => voices, cancel() {}, speak: (u) => { window.__spoken.push({ text: u.text, lang: u.lang }); },
    addEventListener() {}, removeEventListener() {},
  } });
})()`;

const browser = await chromium.launch();
for (const viewport of [{ width: 390, height: 844 }, { width: 360, height: 740 }, { width: 320, height: 640 }]) {
  console.log(`Aplaude las sílabas at ${viewport.width} px`);
  const context = await browser.newContext({ viewport, hasTouch: true });
  await context.addInitScript(fakeVoices(["en-US", "es-ES", "es-MX"]));
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(`pageerror: ${e.message}`));
  page.on("console", (m) => { if (m.type() === "error") errors.push(`console: ${m.text()}`); });
  await page.goto(base + "/es/juegos/aplaude-las-silabas");
  await page.waitForLoadState("networkidle");
  // Close the cookie banner, which covers the bottom of the screen.
  await page.getByRole("button", { name: "Rechazar" }).click();
  await page.getByRole("region", { name: "Consentimiento de cookies" }).waitFor({ state: "hidden" });

  const mainOverflow = () =>
    page.evaluate(() => Math.max(0, ...[...document.querySelectorAll("main *")].map((e) => Math.round(e.getBoundingClientRect().right - window.innerWidth))));
  check((await mainOverflow()) <= 0, `the game fits the screen (overflow ${await mainOverflow()}px)`);
  const pageOverflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  console.log(`  · whole page, header included: ${pageOverflow > 0 ? `${pageOverflow}px too wide` : "fits"}`);
  const countButton = (n) => page.getByRole("button", { name: n === 1 ? "1 sílaba" : `${n} sílabas`, exact: true });
  const boxes = await Promise.all([1, 2, 3, 4, 5].map((n) => countButton(n).boundingBox()));
  const sameRow = boxes.every((b) => Math.abs(b.y - boxes[0].y) < 3);
  check(sameRow, `the five count buttons are on one row (y = ${boxes.map((b) => Math.round(b.y)).join(", ")})`);
  check(boxes.every((b) => b.x >= 0 && b.x + b.width <= viewport.width), "the count buttons are fully on screen");
  check(boxes.every((b) => b.width >= 44 && b.height >= 44), `buttons big enough to tap (${Math.round(boxes[0].width)}×${Math.round(boxes[0].height)} px)`);
  if (viewport.width === 390) await page.screenshot({ path: `${shots}/es-aplaude-390.png`, fullPage: true });

  await page.getByRole("button", { name: "🔊 Escuchar", exact: true }).tap();
  const heard = await page.evaluate(() => window.__spoken.at(-1));
  check(heard?.lang === "es-MX" && /^[a-zñáéíóúü]+$/.test(heard.text), `the word is read with the Mexican voice (${heard?.text})`);
  await page.getByRole("button", { name: "👏 Escuchar por sílabas" }).tap();
  const split = await page.evaluate(() => window.__spoken.at(-1));
  check(split?.lang === "es-MX" && /, |^[a-zñáéíóúü]+\. /.test(split.text), `the word is read by syllables (${split?.text})`);

  const solved = page.getByText(/^✓ ¡Sí!/);
  const counts = new Set();
  let wrongShown = false;
  for (let round = 1; round <= 10; round++) {
    check(await page.getByText(`Ronda ${round}/10`).isVisible(), `round ${round} of 10`);
    for (let n = 1; n <= 5; n++) {
      await countButton(n).tap();
      if (await solved.isVisible()) { counts.add(n); break; }
      if (await page.getByText("Casi. Escucha otra vez").isVisible()) wrongShown = true;
    }
    check(await solved.isVisible(), `round ${round}: the right count is accepted`);
    const word = (await page.locator("main p[aria-live=polite]").first().innerText()).trim();
    if (round === 1 && viewport.width === 390) await page.screenshot({ path: `${shots}/es-aplaude-390-solved.png`, fullPage: true });
    const next = page.getByRole("button", { name: round === 10 ? "Ver el resultado" : "Otra palabra →" });
    const nb = await next.boundingBox();
    check(nb && nb.x >= 0 && nb.x + nb.width <= viewport.width, `round ${round}: next button on screen (${word})`);
    await next.tap();
  }
  check(wrongShown, "a wrong count says « Casi. Escucha otra vez »");
  check(await page.getByRole("button", { name: "Jugar otra vez" }).isVisible(), "the game ends with « Jugar otra vez »");
  check(counts.size === 5, `words from 1 to 5 syllables came up (${[...counts].sort().join(", ")})`);
  check((await mainOverflow()) <= 0, `end screen fits the screen (overflow ${await mainOverflow()}px)`);
  if (viewport.width === 390) await page.screenshot({ path: `${shots}/es-aplaude-390-end.png`, fullPage: true });
  check(errors.length === 0, `no console/page errors${errors.length ? ": " + errors.slice(0, 3).join(" | ") : ""}`);
  await context.close();
}
await browser.close();
console.log(problems ? `\n${problems} problem(s)` : "\nall checks passed");
process.exit(problems ? 1 : 0);
