// Usage (from the repo root): node scripts/i18n-check/browser.mjs [baseUrl] [shotsDir]
// Real-browser checks of the language switcher, French forms and mobile layout.
import { mkdirSync, readFileSync } from "fs";
import { chromium } from "@playwright/test";

const base = process.argv[2] ?? "http://localhost:3100";
const shots = process.argv[3] ?? "i18n-shots";
mkdirSync(shots, { recursive: true });
let problems = 0;
const check = (ok, label) => { if (!ok) problems++; console.log(`  ${ok ? "✓" : "✗"} ${label}`); };

const browser = await chromium.launch();

async function newPage(viewport = { width: 1280, height: 900 }) {
  const context = await browser.newContext({ viewport });
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(`pageerror: ${e.message}`));
  page.on("console", (m) => { if (m.type() === "error") errors.push(`console: ${m.text()}`); });
  return { context, page, errors };
}
const switcherHref = (page, lang) => page.locator(`[role=group] a[hreflang=${lang}]`).first().getAttribute("href");
const cookie = async (context) => (await context.cookies()).find((c) => c.name === "NEXT_LOCALE")?.value;

console.log("Language switcher (desktop)");
{
  const { context, page, errors } = await newPage();
  await page.goto(base + "/");
  await page.waitForLoadState("networkidle");
  check((await page.getAttribute("html", "lang")) === "en", "English home has lang=en");
  check((await switcherHref(page, "fr")) === "/fr", "FR link on / points to /fr");
  await page.screenshot({ path: `${shots}/en-home.png`, clip: { x: 0, y: 0, width: 1280, height: 420 } });

  await page.goto(base + "/about");
  await page.waitForLoadState("networkidle");
  check((await switcherHref(page, "fr")) === "/fr/a-propos", "FR link on /about points to /fr/a-propos");

  await page.goto(base + "/blog");
  await page.waitForLoadState("networkidle");
  check((await switcherHref(page, "fr")) === "/fr", "FR link on /blog (no French version) falls back to /fr");

  await page.goto(base + "/pricing");
  await page.waitForLoadState("networkidle");
  await Promise.all([page.waitForURL("**/fr/tarifs"), page.locator("[role=group] a[hreflang=fr]").click()]);
  check(page.url().endsWith("/fr/tarifs"), "clicking FR on /pricing opens /fr/tarifs");
  check((await cookie(context)) === "fr", "NEXT_LOCALE=fr cookie is set");
  check((await page.getAttribute("html", "lang")) === "fr", "French page has lang=fr");
  await page.screenshot({ path: `${shots}/fr-tarifs.png`, fullPage: false });

  await page.goto(base + "/contact");
  check(page.url().endsWith("/fr/contact"), "with the cookie, /contact redirects to /fr/contact");
  await page.goto(base + "/blog");
  check(new URL(page.url()).pathname === "/blog", "with the cookie, /blog (no French version) stays English");

  await page.goto(base + "/fr/tarifs");
  await page.waitForLoadState("networkidle");
  check((await switcherHref(page, "en")) === "/pricing", "EN link on /fr/tarifs points to /pricing");
  await Promise.all([page.waitForURL(/\/pricing$/), page.locator("[role=group] a[hreflang=en]").click()]);
  check((await cookie(context)) === "en", "clicking EN sets NEXT_LOCALE=en");
  await page.goto(base + "/fr/tarifs");
  check(page.url().endsWith("/pricing"), "with the EN cookie, /fr/tarifs redirects to /pricing");
  check(errors.length === 0, `no console/page errors${errors.length ? ": " + errors.slice(0, 3).join(" | ") : ""}`);
  await context.close();
}

console.log("French UI and forms");
{
  const { context, page, errors } = await newPage();
  await page.goto(base + "/fr");
  await page.waitForLoadState("networkidle");
  check(await page.getByRole("button", { name: "Accepter" }).isVisible(), "cookie banner is in French (Accepter)");
  check(await page.getByRole("region", { name: "Consentement aux cookies" }).getByRole("link").isVisible(), "cookie banner links to the French cookie policy");
  const bannerHref = await page.getByRole("region", { name: "Consentement aux cookies" }).getByRole("link").getAttribute("href");
  check(bannerHref === "/fr/cookies", `banner link is /fr/cookies (${bannerHref})`);
  await page.getByRole("button", { name: "Refuser" }).click();
  await page.screenshot({ path: `${shots}/fr-home.png`, clip: { x: 0, y: 0, width: 1280, height: 900 } });

  await page.goto(base + "/fr/connexion");
  await page.waitForLoadState("networkidle");
  await page.getByLabel("Adresse e-mail").fill("personne-inconnue@example.com");
  await page.getByLabel("Mot de passe").fill("mauvais-mot-de-passe");
  await page.getByRole("button", { name: "Se connecter" }).click();
  const loginError = page.getByText("Adresse e-mail ou mot de passe incorrect.");
  await loginError.waitFor({ timeout: 15000 }).catch(() => {});
  check(await loginError.isVisible(), "login shows the French error for wrong credentials");

  // LIVE=1 (checking alphabes.com): don't send a test message.
  if (!process.env.LIVE) {
  await page.goto(base + "/fr/contact");
  await page.waitForLoadState("networkidle");
  await page.getByLabel("Nom").fill("Test");
  await page.getByLabel("Adresse e-mail").fill("test@example.com");
  await page.getByLabel("Message").fill("Bonjour, ceci est un test.");
  await page.getByRole("button", { name: "Envoyer le message" }).click();
  const sent = page.getByText("Merci ! Nous vous répondrons très vite.");
  await sent.waitFor({ timeout: 15000 }).catch(() => {});
  check(await sent.isVisible(), "contact form shows the French confirmation");
  }

  await page.goto(base + "/fr/inscription");
  await page.waitForLoadState("networkidle");
  check(await page.getByText("8 caractères minimum.").isVisible(), "register form is in French");
  check(errors.filter((e) => !/401|Unauthorized|status of 401/.test(e)).length === 0, `no unexpected console errors${errors.length ? ": " + errors.slice(0, 3).join(" | ") : ""}`);
  await context.close();
}

console.log("Mobile (390px)");
{
  const { context, page, errors } = await newPage({ width: 390, height: 844 });
  for (const p of ["/", "/fr", "/fr/tarifs", "/pricing", "/fr/confidentialite", "/alphabet/a"]) {
    await page.goto(base + p);
    await page.waitForLoadState("networkidle");
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    check(overflow <= 0, `${p}: no horizontal scroll (overflow ${overflow}px)`);
  }
  await page.goto(base + "/fr");
  await page.waitForLoadState("networkidle");
  const menuButton = page.getByRole("button", { name: "Menu" });
  check(await menuButton.isVisible(), "mobile menu button is visible");
  await menuButton.click();
  check(await page.locator("#mobile-menu").isVisible(), "mobile menu opens");
  check(await page.locator("#mobile-menu").getByRole("link", { name: "Mon espace" }).isVisible(), "menu has 'Mon espace'");
  await page.screenshot({ path: `${shots}/fr-mobile-menu.png` });
  await page.getByRole("button", { name: "Fermer le menu" }).click();
  check(!(await page.locator("#mobile-menu").isVisible()), "mobile menu closes");
  await page.goto(base + "/");
  await page.waitForLoadState("networkidle");
  await page.screenshot({ path: `${shots}/en-mobile.png` });
  check(errors.length === 0, `no console/page errors${errors.length ? ": " + errors.slice(0, 3).join(" | ") : ""}`);
  await context.close();
}

// Fake voices: the device has only the voices listed; speech is recorded, not played.
const fakeVoices = (langs) => `(() => {
  const voices = ${JSON.stringify(langs)}.map((lang) => ({ lang, name: "Voix " + lang, localService: true, default: false, voiceURI: lang }));
  window.__spoken = [];
  window.__cancels = 0;
  let current = null;
  // Like a real browser: an utterance ends (onend) or is cancelled (onerror).
  window.__finishSpeech = () => { const u = current; current = null; u?.onend?.(); };
  window.SpeechSynthesisUtterance = class { constructor(text) { this.text = text; } };
  Object.defineProperty(window, "speechSynthesis", { value: {
    getVoices: () => voices,
    cancel() { window.__cancels++; const u = current; current = null; u?.onerror?.(); },
    speak: (u) => { current = u; window.__spoken.push({ text: u.text, lang: u.lang }); },
    addEventListener() {}, removeEventListener() {},
  } });
})()`;

console.log("Alphabet (phase 2)");
{

  const { context, page, errors } = await newPage();
  await page.goto(base + "/alphabet/b");
  await page.waitForLoadState("networkidle");
  check((await switcherHref(page, "fr")) === "/fr/alphabet/b", "FR link on /alphabet/b points to /fr/alphabet/b");
  await page.goto(base + "/fr/alphabet/c-cedille");
  await page.waitForLoadState("networkidle");
  check((await switcherHref(page, "en")) === "/alphabet", "EN link on a French-only letter goes to /alphabet");
  await page.goto(base + "/fr/imagier");
  await page.waitForLoadState("networkidle");
  check((await switcherHref(page, "en")) === "/flashcards", "EN link on /fr/imagier points to /flashcards");

  // Tracing: draw a stroke, switch to cursive.
  await page.goto(base + "/fr/alphabet/e-accent-aigu/fiche");
  await page.waitForLoadState("networkidle");
  const canvas = page.getByLabel("Zone de tracé de la lettre É");
  const box = await canvas.boundingBox();
  await page.mouse.move(box.x + 100, box.y + 100);
  await page.mouse.down();
  await page.mouse.move(box.x + 300, box.y + 150, { steps: 10 });
  await page.mouse.up();
  const inked = await canvas.evaluate((c) => {
    const d = c.getContext("2d").getImageData(0, 0, c.width, c.height).data;
    for (let i = 0; i < d.length; i += 4) if (d[i] === 37 && d[i + 1] === 99 && d[i + 2] === 235) return true;
    return false;
  });
  check(inked, "drawing on the canvas leaves blue ink");
  await page.screenshot({ path: `${shots}/fr-fiche-script.png`, fullPage: true });
  await page.getByRole("button", { name: "Cursive" }).click();
  check((await page.getByRole("button", { name: "Cursive" }).getAttribute("aria-pressed")) === "true", "cursive toggle is pressed");
  const fontLoaded = () => [...document.fonts].some((f) => /Playwrite/.test(f.family) && f.status === "loaded");
  await page.waitForFunction(fontLoaded, null, { timeout: 15000 }).catch(() => {});
  check(await page.evaluate(fontLoaded), "cursive font (Playwrite FR Trad) loaded");
  await page.waitForTimeout(300);
  await canvas.screenshot({ path: `${shots}/fr-fiche-cursive-canvas.png` });

  // French PDF download: the pre-rendered tracing worksheet (lib/fiches-fr.ts).
  const [download] = await Promise.all([page.waitForEvent("download"), page.getByRole("link", { name: /Fiche de tracé/ }).click()]);
  const pdfPath = `${shots}/${download.suggestedFilename()}`;
  await download.saveAs(pdfPath);
  const pdf = readFileSync(pdfPath, "latin1");
  check(download.suggestedFilename() === "fiche-lettre-e-accent-aigu.pdf", `PDF file name (${download.suggestedFilename()})`);
  check(pdf.startsWith("%PDF") && pdf.length > 10_000, `a real PDF was downloaded (${pdf.length} bytes)`);
  check(errors.length === 0, `no console/page errors${errors.length ? ": " + errors.slice(0, 3).join(" | ") : ""}`);
  await context.close();

  // Speech with a French voice: French text, fr-FR voice.
  {
    const { context, page } = await newPage();
    await context.addInitScript(fakeVoices(["en-US", "fr-CA", "fr-FR"]));
    await page.goto(base + "/fr/alphabet/b");
    await page.waitForLoadState("networkidle");
    await page.getByRole("button", { name: "🔊 Le son" }).click();
    await page.getByRole("button", { name: "Écouter : une banane" }).click();
    const spoken = await page.evaluate(() => window.__spoken);
    check(spoken[0]?.text === "ba, bo, bi. Comme dans ballon, banane." && spoken[0]?.lang === "fr-FR", `sound read in French (${JSON.stringify(spoken[0])})`);
    check(spoken[1]?.text === "une banane", "word read with its article");
    check(!(await page.getByText("Aucune voix française").isVisible()), "no missing-voice message when a French voice exists");
    await context.close();
  }
  // Speech without a French voice: nothing said, French help shown.
  {
    const { context, page } = await newPage({ width: 390, height: 844 });
    await context.addInitScript(fakeVoices(["en-US", "en-GB"]));
    await page.goto(base + "/fr/alphabet/b");
    await page.waitForLoadState("networkidle");
    await page.getByRole("button", { name: "🔊 Le nom de la lettre" }).click();
    const notice = page.getByText("Aucune voix française n'est installée sur cet appareil.");
    check(await notice.isVisible(), "missing-voice message appears");
    check((await page.evaluate(() => window.__spoken.length)) === 0, "an English voice never reads French");
    await page.screenshot({ path: `${shots}/fr-no-voice.png` });
    await page.getByRole("button", { name: "Fermer", exact: true }).click();
    check(!(await notice.isVisible()), "missing-voice message closes");
    await context.close();
  }
  // Layout at 390px.
  {
    const { context, page, errors } = await newPage({ width: 390, height: 844 });
    for (const p of ["/fr/alphabet", "/fr/alphabet/e", "/fr/alphabet/e/fiche", "/fr/alphabet/accents", "/fr/imagier", "/alphabet/a/worksheet"]) {
      await page.goto(base + p);
      await page.waitForLoadState("networkidle");
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      check(overflow <= 0, `${p}: no horizontal scroll (overflow ${overflow}px)`);
      await page.screenshot({ path: `${shots}/m${p.replaceAll("/", "_")}.png`, fullPage: true });
    }
    check(errors.length === 0, `no console/page errors${errors.length ? ": " + errors.slice(0, 3).join(" | ") : ""}`);
    await context.close();
  }
}

console.log("Sounds (phase 3)");
{
  const { context, page, errors } = await newPage();
  await context.addInitScript(fakeVoices(["en-US", "fr-FR"]));
  await page.goto(base + "/phonics");
  await page.waitForLoadState("networkidle");
  check((await switcherHref(page, "fr")) === "/fr/sons", "FR link on /phonics points to /fr/sons");
  await page.goto(base + "/phonics/blending");
  await page.waitForLoadState("networkidle");
  check((await switcherHref(page, "fr")) === "/fr/sons", "FR link on an English-only skill goes to /fr/sons");
  await page.goto(base + "/fr/sons/ou");
  await page.waitForLoadState("networkidle");
  check((await switcherHref(page, "en")) === "/phonics", "EN link on a French sound goes to /phonics");

  // The hunt: a right card turns green, a wrong one explains, the counter moves.
  await page.getByRole("button", { name: "Écouter : un mouton" }).click();
  await page.getByRole("button", { name: "Écouter : la lune" }).click();
  check(await page.getByText("Oui : on entend [u] dans « mouton ».").isVisible(), "right card says why");
  check(await page.getByText("Non : pas de [u] dans « lune ».").isVisible(), "wrong card says why");
  check(await page.getByText("Trouvés : 1 sur 3").isVisible(), "counter shows 1 of 3");
  let spoken = await page.evaluate(() => window.__spoken.map((u) => u.text));
  check(spoken.join("|") === "un mouton|la lune", `hunt words read aloud (${spoken.join("|")})`);
  await page.getByRole("button", { name: "Écouter : une citrouille" }).click();
  await page.getByRole("button", { name: "Écouter : une douche" }).click();
  check(await page.getByText("Bravo, tu as trouvé les 3 mots !").isVisible(), "hunt finished message");
  await page.screenshot({ path: `${shots}/fr-son-ou.png`, fullPage: true });

  // The syllable builder: l + i = li.
  await page.goto(base + "/fr/sons/syllabes");
  await page.waitForLoadState("networkidle");
  await page.getByRole("button", { name: "l", exact: true }).click();
  await page.getByRole("button", { name: "i", exact: true }).click();
  check(await page.getByRole("button", { name: "Écouter la syllabe li" }).isVisible(), "builder shows li");
  spoken = await page.evaluate(() => window.__spoken.map((u) => u.text));
  check(spoken.at(-1) === "li", `builder reads the syllable (${spoken.at(-1)})`);
  await page.screenshot({ path: `${shots}/fr-son-syllabes.png`, fullPage: true });
  check(errors.length === 0, `no console/page errors${errors.length ? ": " + errors.slice(0, 3).join(" | ") : ""}`);
  await context.close();
}
{
  const { context, page, errors } = await newPage({ width: 390, height: 844 });
  for (const p of ["/fr/sons", "/fr/sons/syllabes", "/fr/sons/ill", "/fr/sons/c-et-g", "/fr/sons/mots-outils", "/phonics"]) {
    await page.goto(base + p);
    await page.waitForLoadState("networkidle");
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    check(overflow <= 0, `${p}: no horizontal scroll (overflow ${overflow}px)`);
    await page.screenshot({ path: `${shots}/m${p.replaceAll("/", "_")}.png`, fullPage: true });
  }
  check(errors.length === 0, `no console/page errors${errors.length ? ": " + errors.slice(0, 3).join(" | ") : ""}`);
  await context.close();
}

console.log("Worksheets (phase 4)");
{
  const { context, page, errors } = await newPage();
  await page.goto(base + "/worksheets");
  await page.waitForLoadState("networkidle");
  check((await switcherHref(page, "fr")) === "/fr/fiches", "FR link on /worksheets points to /fr/fiches");
  await page.goto(base + "/fr/fiches/lettre-b-cursive");
  await page.waitForLoadState("networkidle");
  check((await switcherHref(page, "en")) === "/worksheets", "EN link on a French worksheet goes to /worksheets");
  const img = page.getByAltText(/Aperçu de la fiche : Écrire la lettre B en cursive/);
  check(await img.evaluate((i) => i.complete && i.naturalWidth > 300), "worksheet preview image loads");
  const href = await page.getByRole("link", { name: /Télécharger le PDF/ }).getAttribute("href");
  const res = await page.request.get(base + href);
  check(res.status() === 200 && res.headers()["content-type"]?.includes("pdf"), `worksheet PDF is served (${res.status()} ${res.headers()["content-type"]})`);
  await page.screenshot({ path: `${shots}/fr-fiche-cursive.png`, fullPage: true });
  await page.goto(base + "/fr/fiches/packs/pack-lettre-a");
  await page.waitForLoadState("networkidle");
  const packHref = await page.getByRole("link", { name: /Télécharger le PDF \(6 pages\)/ }).getAttribute("href");
  check((await page.request.get(base + packHref)).status() === 200, "pack PDF is served");
  check(errors.length === 0, `no console/page errors${errors.length ? ": " + errors.slice(0, 3).join(" | ") : ""}`);
  await context.close();
}
{
  const { context, page, errors } = await newPage({ width: 390, height: 844 });
  for (const p of ["/fr/fiches", "/fr/fiches/ecriture-cursive", "/fr/fiches/lettre-b-son", "/fr/fiches/packs", "/fr/alphabet/b", "/worksheets"]) {
    await page.goto(base + p);
    await page.waitForLoadState("networkidle");
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    check(overflow <= 0, `${p}: no horizontal scroll (overflow ${overflow}px)`);
    await page.screenshot({ path: `${shots}/m${p.replaceAll("/", "_")}.png`, fullPage: true });
  }
  check(errors.length === 0, `no console/page errors${errors.length ? ": " + errors.slice(0, 3).join(" | ") : ""}`);
  await context.close();
}

console.log("Stories (phase 5)");
{
  const { context, page, errors } = await newPage();
  await context.addInitScript(fakeVoices(["en-US", "fr-FR"]));
  await page.goto(base + "/stories");
  await page.waitForLoadState("networkidle");
  check((await switcherHref(page, "fr")) === "/fr/histoires", "FR link on /stories points to /fr/histoires");
  check(!(await page.getByText("La petite pomme").count()), "English story list has no French story");
  await page.goto(base + "/fr/histoires");
  await page.waitForLoadState("networkidle");
  check((await page.locator("main").getByRole("heading", { level: 2 }).count()) === 8, "French story list shows 8 stories");
  check(!(await page.getByText("The Little Apple").count()), "French story list has no English story");
  await page.getByRole("link", { name: /La petite pomme/ }).click();
  await page.waitForURL("**/fr/histoires/la-petite-pomme");
  await page.waitForLoadState("networkidle");
  check(new URL(page.url()).pathname === "/fr/histoires/la-petite-pomme", "story opens at /fr/histoires/la-petite-pomme");
  check((await switcherHref(page, "en")) === "/stories", "EN link on a French story goes to /stories");
  const hreflang = await page.locator('link[rel=alternate][hreflang=en]').getAttribute("href");
  check(hreflang === "https://alphabes.com/stories/the-little-apple", `hreflang pairs the twin story (${hreflang})`);
  await page.getByRole("button", { name: "Écouter la page" }).click();
  const spoken = await page.evaluate(() => window.__spoken.map((u) => `${u.lang}|${u.text}`));
  check(spoken[0] === "fr-FR|Il était une fois une petite pomme rouge, toute ronde.", `page read with a French voice (${spoken[0]})`);
  const listen = page.getByRole("button", { name: "Écouter la page" });
  const stopBtn = page.getByRole("button", { name: "Arrêter la lecture" });
  check(await stopBtn.isVisible(), "while reading, the button becomes Arrêter");
  await stopBtn.click();
  check(await listen.isVisible(), "Arrêter stops and shows Écouter again");
  await listen.click();
  await page.evaluate(() => window.__finishSpeech());
  // The end of speech comes from outside React: wait for the re-render.
  await listen.waitFor({ timeout: 3000 }).catch(() => {});
  check(await listen.isVisible(), "button returns to Écouter when the page has been read");
  await listen.click();
  const cancelsBefore = await page.evaluate(() => window.__cancels);
  await page.getByRole("button", { name: "Suivant →" }).click();
  check((await page.evaluate(() => window.__cancels)) > cancelsBefore, "turning the page stops the reading");
  check(await listen.isVisible(), "next page shows Écouter");
  await listen.click();
  const spoken2 = await page.evaluate(() => window.__spoken.at(-1));
  check(spoken2.lang === "fr-FR" && spoken2.text !== spoken[0].split("|")[1], `page 2 reads its own text (${spoken2.text})`);
  await page.getByRole("button", { name: "← Retour" }).click();
  for (let i = 0; i < 4; i++) await page.getByRole("button", { name: "Suivant →" }).click();
  check(await page.getByText("Page 5 sur 5").isVisible(), "French page counter");
  check(await page.getByText("Fin", { exact: true }).isVisible(), "last picture says Fin");
  await page.screenshot({ path: `${shots}/fr-histoire.png`, fullPage: true });
  check(errors.length === 0, `no console/page errors${errors.length ? ": " + errors.slice(0, 3).join(" | ") : ""}`);
  await context.close();
}
{
  const { context, page, errors } = await newPage({ width: 390, height: 844 });
  for (const p of ["/fr/histoires", "/fr/histoires/hugo-le-hibou", "/stories"]) {
    await page.goto(base + p);
    await page.waitForLoadState("networkidle");
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    check(overflow <= 0, `${p}: no horizontal scroll (overflow ${overflow}px)`);
  }
  check(errors.length === 0, `no console/page errors${errors.length ? ": " + errors.slice(0, 3).join(" | ") : ""}`);
  await context.close();
}

console.log("Games, school levels and activities (phase 6)");
{
  const { context, page, errors } = await newPage();
  await context.addInitScript(fakeVoices(["en-US", "fr-FR"]));
  const lastSpoken = () => page.evaluate(() => window.__spoken.at(-1) ?? null);
  const choiceButtons = () => page.locator("main .grid button");

  await page.goto(base + "/games");
  await page.waitForLoadState("networkidle");
  check((await switcherHref(page, "fr")) === "/fr/jeux", "FR link on /games points to /fr/jeux");
  await page.goto(base + "/games/alphabet-quiz");
  await page.waitForLoadState("networkidle");
  check((await switcherHref(page, "fr")) === "/fr/jeux/quiz-alphabet", "FR link on an English game points to its French twin");

  await page.goto(base + "/fr/jeux");
  await page.waitForLoadState("networkidle");
  check((await page.getByRole("link", { name: "▶ Jouer" }).count()) === 5, "French games page lists 5 games");

  // Trouve la lettre: hear the letter, a wrong pick, then the right one.
  await page.goto(base + "/fr/jeux/trouve-la-lettre");
  await page.waitForLoadState("networkidle");
  check((await switcherHref(page, "en")) === "/games/find-the-letter", "EN link on a French game points to its English twin");
  const target = (await page.locator("p", { hasText: "Trouve la lettre" }).locator(".letter-block").innerText()).trim();
  await page.getByRole("button", { name: "Écouter la lettre à trouver" }).click();
  const asked = await lastSpoken();
  check(asked?.lang === "fr-FR" && /^Trouve la lettre .+\.$/.test(asked.text), `the letter is asked with a French voice (${asked?.text})`);
  const letters = await choiceButtons().allInnerTexts();
  await choiceButtons().nth(letters.findIndex((t) => t.trim() !== target)).click();
  check(await page.getByText("Cherche encore !").isVisible(), "a wrong letter says « Cherche encore »");
  await choiceButtons().nth(letters.findIndex((t) => t.trim() === target)).click();
  check(await page.getByText(/Bravo, c'est bien le/).isVisible(), "the right letter says Bravo");
  await page.getByText("Manche 2/10").waitFor({ timeout: 5000 }).catch(() => {});
  check(await page.getByText("Manche 2/10").isVisible(), "next round after a right answer");
  await page.getByRole("button", { name: "minuscules" }).click();
  const grid = await choiceButtons().allInnerTexts();
  check(grid.length === 16 && grid.every((t) => t === t.toLowerCase()), "minuscules shows the grid in lowercase");

  // Associe la lettre et l'image: tap pictures until the right one.
  await page.goto(base + "/fr/jeux/lettre-et-image");
  await page.waitForLoadState("networkidle");
  check((await choiceButtons().count()) === 4, "four pictures to choose from");
  for (let i = 0; i < 4 && !(await page.getByText(/^✓ Oui !/).isVisible()); i++) await choiceButtons().nth(i).click();
  check(await page.getByText(/^✓ Oui ! .+ commence par [A-Z]\.$/).isVisible(), "finding the picture says which letter it starts with");
  check((await lastSpoken())?.text.startsWith("Oui !"), "the picture's name is read aloud");

  // Le premier son.
  await page.goto(base + "/fr/jeux/premier-son");
  await page.waitForLoadState("networkidle");
  await page.getByRole("button", { name: "🔊 Écouter le mot" }).click();
  const word = await lastSpoken();
  check(word?.lang === "fr-FR" && /^[a-zàâéèêîôûç]+$/.test(word.text), `the word is read alone (${word?.text})`);
  check(!(await page.locator("main").getByText(word?.text ?? "∅", { exact: true }).count()), "the word isn't written on the page");
  for (let i = 0; i < 4 && !(await page.getByText(/^✓ Bravo/).isVisible()); i++) await choiceButtons().nth(i).click();
  check(await page.getByText(`« ${word?.text} » commence par`, { exact: false }).isVisible(), "the right letter is praised");

  // Trace la lettre: cursive, minuscule, next letter, and a stroke.
  await page.goto(base + "/fr/jeux/trace-la-lettre");
  await page.waitForLoadState("networkidle");
  await page.getByRole("button", { name: "Cursive" }).click();
  await page.getByRole("button", { name: "Minuscule" }).click();
  await page.getByRole("button", { name: "✅ Lettre suivante →" }).click();
  check(await page.getByText("Lettre 2 sur 30").isVisible(), "next letter (30 letters with é è ê ç)");
  const box = await page.locator("canvas").boundingBox();
  await page.mouse.move(box.x + 100, box.y + 100);
  await page.mouse.down();
  await page.mouse.move(box.x + 200, box.y + 150, { steps: 5 });
  await page.mouse.up();
  await page.waitForTimeout(800);
  await page.screenshot({ path: `${shots}/fr-jeu-trace.png` });

  // Le quiz: ten answers, then the end screen.
  await page.goto(base + "/fr/jeux/quiz-alphabet");
  await page.waitForLoadState("networkidle");
  const feedback = page.getByText(/^✓ Bonne réponse|^✗ La bonne réponse était/);
  for (let i = 0; i < 10; i++) {
    await choiceButtons().first().click();
    await feedback.waitFor();
    await feedback.waitFor({ state: "detached", timeout: 5000 }).catch(() => {});
  }
  check(await page.getByRole("button", { name: "Rejouer" }).isVisible(), "the quiz ends with a score and « Rejouer »");
  await page.screenshot({ path: `${shots}/fr-jeu-quiz-fin.png` });

  // Maternelle, grande section, activités.
  await page.goto(base + "/fr/maternelle");
  await page.waitForLoadState("networkidle");
  check((await switcherHref(page, "en")) === "/preschool", "EN link on /fr/maternelle points to /preschool");
  check((await page.locator("#topics-heading + div a").count()) === 3, "maternelle hub lists 3 topics");
  await page.screenshot({ path: `${shots}/fr-maternelle.png`, fullPage: true });
  await page.goto(base + "/fr/maternelle/graphisme");
  await page.waitForLoadState("networkidle");
  check((await switcherHref(page, "en")) === "/preschool", "EN link on a French-only topic goes to /preschool");
  await page.goto(base + "/fr/grande-section/mots-outils");
  await page.waitForLoadState("networkidle");
  check((await switcherHref(page, "en")) === "/kindergarten/sight-words", "EN link on a twin topic points to its English twin");
  await page.goto(base + "/fr/activites");
  await page.waitForLoadState("networkidle");
  check((await page.locator("main ul > li[id]").count()) === 8, "8 activities");
  check(errors.length === 0, `no console/page errors${errors.length ? ": " + errors.slice(0, 3).join(" | ") : ""}`);
  await context.close();
}
{
  const { context, page, errors } = await newPage({ width: 390, height: 844 });
  for (const p of ["/fr/jeux", "/fr/jeux/trouve-la-lettre", "/fr/jeux/lettre-et-image", "/fr/jeux/premier-son", "/fr/jeux/trace-la-lettre", "/fr/jeux/quiz-alphabet", "/fr/maternelle", "/fr/grande-section/ecriture-cursive", "/fr/activites", "/games"]) {
    await page.goto(base + p);
    await page.waitForLoadState("networkidle");
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    check(overflow <= 0, `${p}: no horizontal scroll (overflow ${overflow}px)`);
    if (p === "/fr/jeux/trouve-la-lettre") await page.screenshot({ path: `${shots}/fr-jeu-mobile.png`, fullPage: true });
  }
  check(errors.length === 0, `no console/page errors${errors.length ? ": " + errors.slice(0, 3).join(" | ") : ""}`);
  await context.close();
}

// Child language (needs the database): CHECK_ACCOUNTS=1 makes a throwaway
// account on the dev branch; remove it with cleanup-accounts.mjs.
if (process.env.CHECK_ACCOUNTS) {
  console.log("Child language (dev database)");
  const { context, page, errors } = await newPage();
  const email = `i18n-check-${Date.now()}@example.com`;
  await page.goto(base + "/fr/inscription");
  await page.waitForLoadState("networkidle");
  await page.getByLabel("Votre nom").fill("Test");
  await page.getByLabel("Adresse e-mail").fill(email);
  await page.getByLabel("Mot de passe").fill("motdepasse-test-123");
  await page.getByRole("button", { name: "Commencer gratuitement" }).click();
  await page.waitForURL("**/fr/tableau-de-bord", { timeout: 30000 });
  await page.getByRole("button", { name: "Ajouter un profil enfant" }).click();
  check((await page.getByLabel("Langue d'apprentissage").inputValue()) === "FR", "a profile added on the French site learns in French by default");
  await page.getByLabel("Prénom de l'enfant").fill("Léa");
  await page.getByRole("button", { name: "Ajouter", exact: true }).click();
  await page.getByText("Apprend en français").waitFor({ timeout: 15000 }).catch(() => {});
  check(await page.getByText("Apprend en français").isVisible(), "the child card shows « Apprend en français »");
  await page.getByRole("link", { name: /Léa/ }).click();
  await page.waitForURL("**/fr/tableau-de-bord/*");
  const hrefs = () => page.locator("main a[class*='px-6 py-3']").evaluateAll((as) => as.map((a) => a.getAttribute("href")).join(" "));
  let links = await hrefs();
  check(links === "/fr/alphabet /fr/jeux /fr/histoires", `French child: links to the French pages (${links})`);
  await page.getByRole("button", { name: "Modifier le profil" }).click();
  await page.getByLabel("Langue d'apprentissage").selectOption("EN");
  await page.getByRole("button", { name: "Enregistrer" }).click();
  await page.getByText(/^Apprend en anglais/).waitFor({ timeout: 15000 }).catch(() => {});
  links = await hrefs();
  check(links === "/alphabet /games /stories", `English child: links to the English pages (${links})`);
  await page.screenshot({ path: `${shots}/fr-enfant-langue.png`, fullPage: true });
  await page.goto(base + "/dashboard");
  await page.waitForLoadState("networkidle");
  check(await page.getByText("Learns in English").isVisible(), "the English dashboard shows « Learns in English »");
  await page.getByRole("button", { name: "Add Child Profile" }).click();
  check((await page.getByLabel("Learning language").inputValue()) === "EN", "a profile added on the English site learns in English by default");
  check(errors.length === 0, `no console/page errors${errors.length ? ": " + errors.slice(0, 3).join(" | ") : ""}`);
  console.log(`  (test account: ${email})`);
  await context.close();
}

await browser.close();
console.log(problems ? `\n${problems} problem(s)` : "\nall browser checks passed");
