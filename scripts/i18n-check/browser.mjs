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

console.log("Spanish: switcher, forms and mobile (Spanish phase 1)");
{
  const { context, page, errors } = await newPage();
  await page.goto(base + "/pricing");
  await page.waitForLoadState("networkidle");
  check((await switcherHref(page, "es")) === "/es/precios", "ES link on /pricing points to /es/precios");
  await page.goto(base + "/blog");
  await page.waitForLoadState("networkidle");
  check((await switcherHref(page, "es")) === "/es", "ES link on /blog (no Spanish version) falls back to /es");
  await page.goto(base + "/fr/a-propos");
  await page.waitForLoadState("networkidle");
  check((await switcherHref(page, "es")) === "/es/quienes-somos", "ES link on /fr/a-propos points to /es/quienes-somos");
  await Promise.all([page.waitForURL("**/es/quienes-somos"), page.locator("[role=group] a[hreflang=es]").click()]);
  check((await cookie(context)) === "es", "clicking ES sets NEXT_LOCALE=es");
  check((await page.getAttribute("html", "lang")) === "es", "Spanish page has lang=es");
  check((await switcherHref(page, "en")) === "/about" && (await switcherHref(page, "fr")) === "/fr/a-propos", "EN and FR links on /es/quienes-somos point to their twins");
  await page.goto(base + "/terms");
  check(page.url().endsWith("/es/terminos-de-uso"), "with the ES cookie, /terms redirects to /es/terminos-de-uso");
  await page.goto(base + "/blog");
  check(new URL(page.url()).pathname === "/blog", "with the ES cookie, /blog (no Spanish version) stays");

  await page.goto(base + "/es");
  await page.waitForLoadState("networkidle");
  check(await page.getByRole("button", { name: "Aceptar" }).isVisible(), "cookie banner is in Spanish (Aceptar)");
  const bannerHref = await page.getByRole("region", { name: "Consentimiento de cookies" }).getByRole("link").getAttribute("href");
  check(bannerHref === "/es/cookies", `banner link is /es/cookies (${bannerHref})`);
  await page.getByRole("button", { name: "Rechazar" }).click();
  await page.screenshot({ path: `${shots}/es-home.png`, clip: { x: 0, y: 0, width: 1280, height: 900 } });
  await page.screenshot({ path: `${shots}/es-home-full.png`, fullPage: true });

  await page.goto(base + "/es/iniciar-sesion");
  await page.waitForLoadState("networkidle");
  await page.getByLabel("Correo electrónico").fill("persona-desconocida@example.com");
  await page.getByLabel("Contraseña").fill("contrasena-incorrecta");
  await page.getByRole("button", { name: "Iniciar sesión" }).last().click();
  const loginError = page.getByText("Correo electrónico o contraseña incorrectos.");
  await loginError.waitFor({ timeout: 15000 }).catch(() => {});
  check(await loginError.isVisible(), "login shows the Spanish error for wrong credentials");

  if (!process.env.LIVE) {
    await page.goto(base + "/es/contacto");
    await page.waitForLoadState("networkidle");
    await page.getByLabel("Nombre").fill("Prueba");
    await page.getByLabel("Correo electrónico").fill("test@example.com");
    await page.getByLabel("Mensaje").fill("Hola, esto es una prueba.");
    await page.getByRole("button", { name: "Enviar el mensaje" }).click();
    const sent = page.getByText("¡Gracias! Te responderemos muy pronto.");
    await sent.waitFor({ timeout: 15000 }).catch(() => {});
    check(await sent.isVisible(), "contact form shows the Spanish confirmation");
  }

  await page.goto(base + "/es/registro");
  await page.waitForLoadState("networkidle");
  check(await page.getByText("Mínimo 8 caracteres.").isVisible(), "register form is in Spanish");

  await page.goto(base + "/es/xyz");
  await page.waitForLoadState("networkidle");
  check((await page.getAttribute("html", "lang")) === "es", "Spanish 404 page has lang=es");
  check(await page.getByRole("heading", { name: "Ups, no encontramos esta página" }).isVisible(), "Spanish 404 page text");
  check(errors.filter((e) => !/401|404|Unauthorized|status of 40[14]/.test(e)).length === 0, `no unexpected console errors${errors.length ? ": " + errors.slice(0, 3).join(" | ") : ""}`);
  await context.close();
}
{
  const { context, page, errors } = await newPage({ width: 390, height: 844 });
  for (const p of ["/es", "/es/precios", "/es/politica-de-privacidad", "/es/iniciar-sesion", "/fr", "/"]) {
    await page.goto(base + p);
    await page.waitForLoadState("networkidle");
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    check(overflow <= 0, `${p}: no horizontal scroll at 390px (overflow ${overflow}px)`);
  }
  await page.goto(base + "/es");
  await page.waitForLoadState("networkidle");
  // Below 640px the switcher is one button; the pills (EN / FR / ES / PT) are hidden.
  check(await page.locator("[data-site-header] button[aria-controls=language-menu]").isVisible(), "phone switcher button is visible");
  check(!(await page.locator("[data-site-header] [role=group]").isVisible()), "switcher pills are hidden at 390px");
  await page.screenshot({ path: `${shots}/es-mobile.png` });
  await page.getByRole("button", { name: "Menú" }).click();
  check(await page.locator("#mobile-menu").getByRole("link", { name: "Mi cuenta" }).isVisible(), "mobile menu has 'Mi cuenta'");
  await page.screenshot({ path: `${shots}/es-mobile-menu.png` });
  check(errors.length === 0, `no console/page errors${errors.length ? ": " + errors.slice(0, 3).join(" | ") : ""}`);
  await context.close();
}

console.log("Portuguese: switcher, forms and mobile (Portuguese phase 1)");
{
  const { context, page, errors } = await newPage();
  await page.goto(base + "/pricing");
  await page.waitForLoadState("networkidle");
  check((await switcherHref(page, "pt")) === "/pt/precos", "PT link on /pricing points to /pt/precos");
  check((await page.locator("[data-site-header] [role=group] a, [data-site-header] [role=group] span").count()) === 4, "switcher shows EN / FR / ES / PT");
  await page.goto(base + "/blog");
  await page.waitForLoadState("networkidle");
  check((await switcherHref(page, "pt")) === "/pt", "PT link on /blog (no Portuguese version) falls back to /pt");
  await page.goto(base + "/es/quienes-somos");
  await page.waitForLoadState("networkidle");
  check((await switcherHref(page, "pt")) === "/pt/quem-somos", "PT link on /es/quienes-somos points to /pt/quem-somos");
  await Promise.all([page.waitForURL("**/pt/quem-somos"), page.locator("[role=group] a[hreflang=pt]").click()]);
  check((await cookie(context)) === "pt", "clicking PT sets NEXT_LOCALE=pt");
  check((await page.getAttribute("html", "lang")) === "pt-BR", "Portuguese page has lang=pt-BR");
  check(
    (await switcherHref(page, "en")) === "/about" && (await switcherHref(page, "fr")) === "/fr/a-propos" && (await switcherHref(page, "es")) === "/es/quienes-somos",
    "EN, FR and ES links on /pt/quem-somos point to their twins",
  );
  const alt = async (l) => page.locator(`link[rel=alternate][hreflang=${l}]`).getAttribute("href");
  check((await alt("pt")) === "https://alphabes.com/pt/quem-somos" && (await alt("x-default")) === "https://alphabes.com/about", "hreflang pt and x-default");
  await page.goto(base + "/terms");
  check(page.url().endsWith("/pt/termos-de-uso"), "with the PT cookie, /terms redirects to /pt/termos-de-uso");
  await page.goto(base + "/alphabet");
  check(new URL(page.url()).pathname === "/alphabet", "with the PT cookie, /alphabet (no Portuguese version yet) stays");

  await page.goto(base + "/pt");
  await page.waitForLoadState("networkidle");
  check(await page.getByRole("button", { name: "Aceitar" }).isVisible(), "cookie banner is in Portuguese (Aceitar)");
  const bannerHref = await page.getByRole("region", { name: "Consentimento de cookies" }).getByRole("link").getAttribute("href");
  check(bannerHref === "/pt/cookies", `banner link is /pt/cookies (${bannerHref})`);
  await page.getByRole("button", { name: "Recusar" }).click();
  await page.screenshot({ path: `${shots}/pt-home.png`, clip: { x: 0, y: 0, width: 1280, height: 900 } });
  await page.screenshot({ path: `${shots}/pt-home-full.png`, fullPage: true });

  await page.goto(base + "/pt/entrar");
  await page.waitForLoadState("networkidle");
  await page.getByLabel("E-mail").fill("pessoa-desconhecida@example.com");
  await page.getByLabel("Senha").fill("senha-incorreta");
  await page.getByRole("button", { name: "Entrar" }).last().click();
  const loginError = page.getByText("E-mail ou senha incorretos.");
  await loginError.waitFor({ timeout: 15000 }).catch(() => {});
  check(await loginError.isVisible(), "login shows the Portuguese error for wrong credentials");

  if (!process.env.LIVE) {
    await page.goto(base + "/pt/contato");
    await page.waitForLoadState("networkidle");
    await page.getByLabel("Nome").fill("Teste");
    await page.getByLabel("E-mail").fill("test@example.com");
    await page.getByLabel("Mensagem").fill("Olá, isto é um teste.");
    await page.getByRole("button", { name: "Enviar a mensagem" }).click();
    const sent = page.getByText("Obrigado! Vamos responder em breve.");
    await sent.waitFor({ timeout: 15000 }).catch(() => {});
    check(await sent.isVisible(), "contact form shows the Portuguese confirmation");
  }

  await page.goto(base + "/pt/cadastro");
  await page.waitForLoadState("networkidle");
  check(await page.getByText("Mínimo de 8 caracteres.").isVisible(), "register form is in Portuguese");

  await page.goto(base + "/pt/xyz");
  await page.waitForLoadState("networkidle");
  check((await page.getAttribute("html", "lang")) === "pt-BR", "Portuguese 404 page has lang=pt-BR");
  check(await page.getByRole("heading", { name: "Ops, não encontramos esta página" }).isVisible(), "Portuguese 404 page text");
  check(errors.filter((e) => !/401|404|Unauthorized|status of 40[14]/.test(e)).length === 0, `no unexpected console errors${errors.length ? ": " + errors.slice(0, 3).join(" | ") : ""}`);
  await context.close();
}
{
  // The phone language menu (docs/portuguese-plan.md, P12).
  const { context, page, errors } = await newPage({ width: 390, height: 844 });
  for (const p of ["/pt", "/pt/precos", "/pt/politica-de-privacidade", "/pt/entrar", "/es", "/"]) {
    await page.goto(base + p);
    await page.waitForLoadState("networkidle");
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    check(overflow <= 0, `${p}: no horizontal scroll at 390px (overflow ${overflow}px)`);
  }
  await page.goto(base + "/pt/precos");
  await page.waitForLoadState("networkidle");
  const langButton = page.locator("[data-site-header] button[aria-controls=language-menu]");
  const shown = (await langButton.locator("span[lang]").innerText()).trim();
  check(shown === "PT", `phone switcher shows the current language (${shown})`);
  check((await langButton.getAttribute("aria-expanded")) === "false", "language list starts closed");
  await langButton.click();
  const menu = page.locator("#language-menu");
  check(await menu.isVisible(), "tapping the button opens the language list");
  check((await langButton.getAttribute("aria-expanded")) === "true", "aria-expanded is true when open");
  check((await menu.locator("li").count()) === 4, "the list has the 4 languages");
  check((await menu.locator("[aria-current=true]").innerText()).includes("Português"), "the current language is marked");
  const menuHref = (l) => menu.locator(`a[hreflang=${l}]`).getAttribute("href");
  check((await menuHref("en")) === "/pricing" && (await menuHref("fr")) === "/fr/tarifs" && (await menuHref("es")) === "/es/precios", "list links point to the page's twins");
  const box = await menu.boundingBox();
  check(box && box.x >= 0 && box.x + box.width <= 390, `the list stays on screen (x ${Math.round(box?.x ?? -1)}–${Math.round((box?.x ?? 0) + (box?.width ?? 0))})`);
  await page.screenshot({ path: `${shots}/pt-mobile-languages.png` });
  await page.keyboard.press("Escape");
  check(!(await menu.isVisible()), "Escape closes the list");
  check(await langButton.evaluate((el) => el === document.activeElement), "focus goes back to the button");
  await langButton.click();
  await page.mouse.click(20, 400);
  check(!(await menu.isVisible()), "a tap outside closes the list");
  await langButton.click();
  await Promise.all([page.waitForURL("**/es/precios"), menu.locator("a[hreflang=es]").click()]);
  check((await cookie(context)) === "es", "choosing ES in the list sets NEXT_LOCALE=es");
  await page.getByRole("button", { name: "Menú" }).click();
  check(await page.locator("#mobile-menu").isVisible(), "the main menu still opens next to the language button");
  await page.goto(base + "/pt");
  await page.waitForLoadState("networkidle");
  await page.screenshot({ path: `${shots}/pt-mobile.png` });
  check(errors.length === 0, `no console/page errors${errors.length ? ": " + errors.slice(0, 3).join(" | ") : ""}`);
  await context.close();
}
{
  // Wider screens: the four pills must fit the header next to the main links
  // (shown inline from 1024px; between 768 and 1023px they overflowed even with
  // three pills, so they moved to the menu there).
  for (const width of [640, 768, 1024, 1280]) {
    const { context, page } = await newPage({ width, height: 800 });
    for (const p of ["/", "/fr", "/es", "/pt"]) {
      await page.goto(base + p);
      await page.waitForLoadState("networkidle");
      const m = await page.evaluate(() => {
        const row = document.querySelector("[data-site-header] > div");
        const pills = row.querySelector("[role=group]");
        // Hidden children (the section links below 1024px) have an empty box.
        const kids = [...row.children].map((c) => c.getBoundingClientRect()).filter((r) => r.width > 0);
        const overlap = kids.some((r, i) => i > 0 && r.left < kids[i - 1].right - 0.5);
        return {
          overflow: row.scrollWidth - row.clientWidth,
          height: row.getBoundingClientRect().height,
          pills: !!pills && getComputedStyle(pills).display !== "none",
          overlap,
          nav: !!row.querySelector("nav")?.getBoundingClientRect().width,
          menuButton: !!row.querySelector("button[aria-controls=mobile-menu]")?.getBoundingClientRect().width,
        };
      });
      check(width >= 1024 ? m.nav && !m.menuButton : !m.nav && m.menuButton, `${width}px ${p}: ${width >= 1024 ? "section links inline" : "section links in the menu"}`);
      check(
        m.pills && m.overflow <= 0 && !m.overlap && m.height <= 72,
        `${width}px ${p}: header fits with the 4 pills (overflow ${m.overflow}px, height ${Math.round(m.height)}px${m.overlap ? ", items overlap" : ""})`,
      );
    }
    await page.goto(base + "/pt");
    await page.screenshot({ path: `${shots}/pt-header-${width}.png`, clip: { x: 0, y: 0, width, height: 120 } });
    await context.close();
  }
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

console.log("Spanish alphabet (Spanish phase 2)");
{
  const { context, page, errors } = await newPage();
  await page.goto(base + "/alphabet/b");
  await page.waitForLoadState("networkidle");
  check((await switcherHref(page, "es")) === "/es/abecedario/b", "ES link on /alphabet/b points to /es/abecedario/b");
  await page.goto(base + "/es/abecedario/enie");
  await page.waitForLoadState("networkidle");
  check((await switcherHref(page, "en")) === "/alphabet" && (await switcherHref(page, "fr")) === "/fr/alphabet", "EN/FR links on ñ go to the alphabet");
  check(await page.getByRole("heading", { name: "La letra Ñ ñ" }).isVisible(), "ñ page heading");
  await page.goto(base + "/fr/alphabet/c-cedille");
  await page.waitForLoadState("networkidle");
  check((await switcherHref(page, "es")) === "/es/abecedario", "ES link on a French-only letter goes to /es/abecedario");
  await page.goto(base + "/es/tarjetas");
  await page.waitForLoadState("networkidle");
  check((await switcherHref(page, "fr")) === "/fr/imagier", "FR link on /es/tarjetas points to /fr/imagier");

  // Tracing on doble raya: draw a stroke, switch to cursive (Playwrite MX).
  await page.goto(base + "/es/abecedario/enie/ficha");
  await page.waitForLoadState("networkidle");
  const canvas = page.getByLabel("Espacio para trazar la letra Ñ");
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
  check(inked, "drawing on the Spanish canvas leaves blue ink");
  await page.getByRole("button", { name: "Cursiva" }).click();
  check((await page.getByRole("button", { name: "Cursiva" }).getAttribute("aria-pressed")) === "true", "cursiva toggle is pressed");
  const fontLoaded = () => [...document.fonts].some((f) => /Playwrite MX/.test(f.family) && f.status === "loaded");
  await page.waitForFunction(fontLoaded, null, { timeout: 15000 }).catch(() => {});
  check(await page.evaluate(fontLoaded), "cursive font (Playwrite MX) loaded");
  await page.waitForTimeout(300);
  await canvas.screenshot({ path: `${shots}/es-ficha-cursiva-canvas.png` });
  await page.screenshot({ path: `${shots}/es-ficha.png`, fullPage: true });
  check(errors.length === 0, `no console/page errors${errors.length ? ": " + errors.slice(0, 3).join(" | ") : ""}`);
  await context.close();

  // Speech: a Mexican voice first, Spanish text.
  {
    const { context, page } = await newPage();
    await context.addInitScript(fakeVoices(["en-US", "es-ES", "es-US", "es-MX"]));
    await page.goto(base + "/es/abecedario/b");
    await page.waitForLoadState("networkidle");
    await page.getByRole("button", { name: "🔊 Sus sílabas" }).click();
    await page.getByRole("button", { name: "Escuchar: un barco" }).click();
    const spoken = await page.evaluate(() => window.__spoken);
    check(spoken[0]?.text === "ba, be, bi, bo, bu. Como en ballena, barco." && spoken[0]?.lang === "es-MX", `syllables read with the es-MX voice (${JSON.stringify(spoken[0])})`);
    check(spoken[1]?.text === "un barco", "word read with its article");
    await context.close();
  }
  // Only a voice from Spain: it is used.
  {
    const { context, page } = await newPage();
    await context.addInitScript(fakeVoices(["en-US", "es-ES"]));
    await page.goto(base + "/es/abecedario/enie");
    await page.waitForLoadState("networkidle");
    await page.getByRole("button", { name: "🔊 El nombre de la letra" }).click();
    const spoken = await page.evaluate(() => window.__spoken);
    check(spoken[0]?.text === "eñe" && spoken[0]?.lang === "es-ES", `falls back to es-ES (${JSON.stringify(spoken[0])})`);
    await context.close();
  }
  // No Spanish voice: nothing said, Spanish help shown.
  {
    const { context, page } = await newPage({ width: 390, height: 844 });
    await context.addInitScript(fakeVoices(["en-US", "fr-FR"]));
    await page.goto(base + "/es/abecedario/b");
    await page.waitForLoadState("networkidle");
    await page.getByRole("button", { name: "🔊 El nombre de la letra" }).click();
    const notice = page.getByText("Este dispositivo no tiene ninguna voz en español.");
    check(await notice.isVisible(), "Spanish missing-voice message appears");
    check((await page.evaluate(() => window.__spoken.length)) === 0, "a French or English voice never reads Spanish");
    await page.screenshot({ path: `${shots}/es-no-voice.png` });
    await page.getByRole("button", { name: "Cerrar", exact: true }).click();
    check(!(await notice.isVisible()), "Spanish missing-voice message closes");
    await context.close();
  }
  // Layout at 390px.
  {
    const { context, page, errors } = await newPage({ width: 390, height: 844 });
    for (const p of ["/es/abecedario", "/es/abecedario/w", "/es/abecedario/enie/ficha", "/es/abecedario/tilde", "/es/tarjetas"]) {
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

console.log("Spanish syllables (Spanish phase 3)");
{
  const { context, page, errors } = await newPage();
  await context.addInitScript(fakeVoices(["en-US", "es-MX"]));
  const spoken = () => page.evaluate(() => window.__spoken.map((s) => `${s.lang}|${s.text}`));
  const last = async () => (await spoken()).at(-1);

  await page.goto(base + "/phonics");
  await page.waitForLoadState("networkidle");
  check((await switcherHref(page, "es")) === "/es/silabas", "ES link on /phonics points to /es/silabas");
  await page.goto(base + "/es/silabas/ch");
  await page.waitForLoadState("networkidle");
  check((await switcherHref(page, "fr")) === "/fr/sons" && (await switcherHref(page, "en")) === "/phonics", "FR/EN links on a syllable page go to the sound indexes");

  // The hunt: a right card turns green, a wrong one explains, the counter moves.
  const hunt = page.getByRole("region", { name: "¡Te toca!" });
  await hunt.getByRole("button", { name: "Escuchar: una leche" }).click();
  check((await last()) === "es-MX|una leche", "hunt card read with the Mexican voice");
  check(await page.getByText("Sí: en «leche» suena ch.").isVisible(), "right hunt card says why");
  await hunt.getByRole("button", { name: "Escuchar: una luna" }).click();
  check(await page.getByText("No: en «luna» no hay ch.").isVisible(), "wrong hunt card says why");
  check(await page.getByText("Encontradas: 1 de 3").isVisible(), "hunt counter in Spanish");
  await page.screenshot({ path: `${shots}/es-silaba-ch.png`, fullPage: true });

  // The syllable builder: ch + a = cha.
  await page.goto(base + "/es/silabas/silabas-directas");
  await page.waitForLoadState("networkidle");
  await page.getByRole("button", { name: "ch", exact: true }).click();
  check((await last()) === "es-MX|cha", "builder reads ch + a");
  await page.getByRole("button", { name: "o", exact: true }).click();
  check((await last()) === "es-MX|cho", "builder reads ch + o");

  // Arma la palabra: a wrong syllable is refused, the right ones build "mano".
  await page.getByRole("group", { name: "Sílabas" }).getByRole("button", { name: "mi", exact: true }).click();
  check(await page.getByText("«mi» no va aquí.", { exact: false }).isVisible(), "word builder refuses a wrong syllable");
  await page.getByRole("group", { name: "Sílabas" }).getByRole("button", { name: "ma", exact: true }).click();
  await page.getByRole("group", { name: "Sílabas" }).getByRole("button", { name: "no", exact: true }).click();
  check(await page.getByText("¡Muy bien! ma + no = mano").isVisible(), "word builder builds mano");
  check((await last()) === "es-MX|ma, no. mano", `finished word read by syllables (${await last()})`);
  await page.getByRole("button", { name: "Otra palabra →" }).click();
  check(await page.getByRole("img", { name: "Dibujo: luna" }).isVisible(), "next word to build is luna");
  await page.screenshot({ path: `${shots}/es-silabas-directas.png`, fullPage: true });

  // Aplaude las sílabas: sol has one syllable; mariposa is reached later.
  await page.goto(base + "/es/silabas/contar-silabas");
  await page.waitForLoadState("networkidle");
  await page.getByRole("button", { name: "2", exact: true }).click();
  check(await page.getByText("Casi. Escucha otra vez").isVisible(), "clap: wrong count gets a hint");
  await page.getByRole("button", { name: "1", exact: true }).click();
  check(await page.getByText("¡Sí! sol tiene 1 sílaba.").isVisible(), "clap: one syllable for sol");
  for (let i = 0; i < 3; i++) await page.getByRole("button", { name: "Otra palabra →" }).click();
  await page.getByRole("button", { name: "4", exact: true }).click();
  check(await page.getByText("¡Sí! mariposa tiene 4 sílabas.").isVisible(), "clap: four syllables for mariposa");
  check((await last()) === "es-MX|ma, ri, po, sa. mariposa", "clap reads the word by syllables");
  check(errors.length === 0, `no console/page errors${errors.length ? ": " + errors.slice(0, 3).join(" | ") : ""}`);
  await context.close();

  // Layout at 390px.
  {
    const { context, page, errors } = await newPage({ width: 390, height: 844 });
    for (const p of ["/es/silabas", "/es/silabas/silabas-directas", "/es/silabas/trabadas-con-r", "/es/silabas/contar-silabas", "/es/silabas/palabras-frecuentes"]) {
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

console.log("Spanish worksheets (Spanish phase 4)");
{
  const { context, page, errors } = await newPage();
  await page.goto(base + "/worksheets");
  await page.waitForLoadState("networkidle");
  check((await switcherHref(page, "es")) === "/es/fichas", "ES link on /worksheets points to /es/fichas");
  await page.goto(base + "/es/fichas/silabas-que-qui");
  await page.waitForLoadState("networkidle");
  check((await switcherHref(page, "fr")) === "/fr/fiches" && (await switcherHref(page, "en")) === "/worksheets", "FR/EN links on a Spanish worksheet go to the worksheet indexes");
  check(await page.getByRole("img", { name: /Vista previa de la ficha: Leer las sílabas que, qui/ }).isVisible(), "worksheet preview with a Spanish alt text");
  const [download] = await Promise.all([page.waitForEvent("download"), page.getByRole("link", { name: /Descargar el PDF/ }).click()]);
  const pdfPath = `${shots}/${download.suggestedFilename()}`;
  await download.saveAs(pdfPath);
  const pdf = readFileSync(pdfPath, "latin1");
  check(download.suggestedFilename() === "alphabes-silabas-que-qui.pdf", `PDF file name (${download.suggestedFilename()})`);
  check(pdf.startsWith("%PDF") && pdf.length > 10_000, `a real Spanish PDF was downloaded (${pdf.length} bytes)`);
  await page.screenshot({ path: `${shots}/es-ficha-silabas.png`, fullPage: true });

  // The syllable page links its worksheets, and the worksheet links back.
  await page.goto(base + "/es/silabas/ca-co-cu-que-qui");
  await page.waitForLoadState("networkidle");
  const sheets = page.getByRole("region", { name: "Las fichas para imprimir" });
  check((await sheets.getByRole("link").count()) === 2, "the ca/que syllable page links its two worksheets");
  await sheets.getByRole("link", { name: /que, qui/ }).click();
  await page.waitForURL("**/es/fichas/silabas-que-qui");
  check(await page.getByRole("link", { name: /para escuchar/ }).first().isVisible(), "the worksheet links back to its syllable page");

  // The tracing page offers its two PDFs.
  await page.goto(base + "/es/abecedario/enie/ficha");
  await page.waitForLoadState("networkidle");
  const [trace] = await Promise.all([page.waitForEvent("download"), page.getByRole("link", { name: "⬇️ Ficha de trazo (PDF)" }).click()]);
  check(trace.suggestedFilename() === "ficha-letra-enie.pdf", `tracing PDF for ñ (${trace.suggestedFilename()})`);
  check(errors.length === 0, `no console/page errors${errors.length ? ": " + errors.slice(0, 3).join(" | ") : ""}`);
  await context.close();

  // Layout at 390px.
  {
    const { context, page, errors } = await newPage({ width: 390, height: 844 });
    for (const p of ["/es/fichas", "/es/fichas/silabas", "/es/fichas/letra-a-cursiva", "/es/fichas/paquetes", "/es/fichas/paquetes/paquete-letra-a", "/es/abecedario/b"]) {
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

console.log("Spanish stories (Spanish phase 5)");
{
  const { context, page, errors } = await newPage();
  await context.addInitScript(fakeVoices(["en-US", "fr-FR", "es-ES", "es-MX"]));
  await page.goto(base + "/stories");
  await page.waitForLoadState("networkidle");
  check((await switcherHref(page, "es")) === "/es/cuentos", "ES link on /stories points to /es/cuentos");
  check(!(await page.getByText("La manzanita roja").count()), "English story list has no Spanish story");
  await page.goto(base + "/es/cuentos");
  await page.waitForLoadState("networkidle");
  check((await page.locator("main").getByRole("heading", { level: 2 }).count()) === 8, "Spanish story list shows 8 stories");
  check(!(await page.getByText("The Little Apple").count()) && !(await page.getByText("La petite pomme").count()), "Spanish story list has no English or French story");
  check(await page.getByText("De 3 a 5 años").first().isVisible(), "ages in Spanish");
  await page.getByRole("link", { name: /La manzanita roja/ }).click();
  await page.waitForURL("**/es/cuentos/la-manzanita-roja");
  await page.waitForLoadState("networkidle");
  check(new URL(page.url()).pathname === "/es/cuentos/la-manzanita-roja", "story opens at /es/cuentos/la-manzanita-roja");
  check((await switcherHref(page, "en")) === "/stories" && (await switcherHref(page, "fr")) === "/fr/histoires", "EN/FR links on a Spanish story go to the story lists");
  const alt = async (l) => page.locator(`link[rel=alternate][hreflang=${l}]`).getAttribute("href");
  check((await alt("en")) === "https://alphabes.com/stories/the-little-apple" && (await alt("fr")) === "https://alphabes.com/fr/histoires/la-petite-pomme", "hreflang pairs the English and French twins");
  const listen = page.getByRole("button", { name: "Escuchar la página" });
  const stopBtn = page.getByRole("button", { name: "Detener la lectura" });
  check(await page.getByRole("button", { name: "Escuchar la página" }).getByText("🔊 Escuchar").isVisible(), "button says Escuchar");
  await listen.click();
  const spoken = await page.evaluate(() => window.__spoken.map((u) => `${u.lang}|${u.text}`));
  check(spoken[0] === "es-MX|Había una vez una manzanita roja, redonda y bonita.", `page read with the Mexican voice (${spoken[0]})`);
  check(await stopBtn.getByText("⏹ Detener").isVisible(), "while reading, the button becomes Detener");
  await stopBtn.click();
  check(await listen.isVisible(), "Detener stops and shows Escuchar again");
  await listen.click();
  await page.evaluate(() => window.__finishSpeech());
  await listen.waitFor({ timeout: 3000 }).catch(() => {});
  check(await listen.isVisible(), "button returns to Escuchar when the page has been read");
  await listen.click();
  const cancelsBefore = await page.evaluate(() => window.__cancels);
  await page.getByRole("button", { name: "Siguiente →" }).click();
  check((await page.evaluate(() => window.__cancels)) > cancelsBefore, "turning the page stops the reading");
  await listen.click();
  const spoken2 = await page.evaluate(() => window.__spoken.at(-1));
  check(spoken2.lang === "es-MX" && spoken2.text === "La manzanita vive arriba, en un árbol muy, muy alto.", `page 2 reads its own text (${spoken2.text})`);
  for (let i = 0; i < 3; i++) await page.getByRole("button", { name: "Siguiente →" }).click();
  check(await page.getByText("Página 5 de 5").isVisible(), "Spanish page counter");
  check(await page.getByText("Fin", { exact: true }).isVisible(), "last picture says Fin");
  await page.screenshot({ path: `${shots}/es-cuento.png`, fullPage: true });
  check(errors.length === 0, `no console/page errors${errors.length ? ": " + errors.slice(0, 3).join(" | ") : ""}`);
  await context.close();
}
{
  // No Spanish voice: nothing is read, the Spanish help appears.
  const { context, page, errors } = await newPage();
  await context.addInitScript(fakeVoices(["en-US", "fr-FR"]));
  await page.goto(base + "/es/cuentos/la-siesta-de-leo");
  await page.waitForLoadState("networkidle");
  await page.getByRole("button", { name: "Escuchar la página" }).click();
  check(await page.getByText("Este dispositivo no tiene ninguna voz en español.").isVisible(), "story without a Spanish voice shows the Spanish help");
  check((await page.evaluate(() => window.__spoken.length)) === 0, "a French or English voice never reads a Spanish story");
  check(await page.getByRole("button", { name: "Escuchar la página" }).isVisible(), "button stays on Escuchar");
  check(errors.length === 0, `no console/page errors${errors.length ? ": " + errors.slice(0, 3).join(" | ") : ""}`);
  await context.close();
}
{
  const { context, page, errors } = await newPage({ width: 390, height: 844 });
  for (const p of ["/es/cuentos", "/es/cuentos/tito-el-buho-sabio", "/es/cuentos/lupita-la-patita-timida"]) {
    await page.goto(base + p);
    await page.waitForLoadState("networkidle");
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    check(overflow <= 0, `${p}: no horizontal scroll (overflow ${overflow}px)`);
    await page.screenshot({ path: `${shots}/m${p.replaceAll("/", "_")}.png`, fullPage: true });
  }
  check(errors.length === 0, `no console/page errors${errors.length ? ": " + errors.slice(0, 3).join(" | ") : ""}`);
  await context.close();
}

console.log("Spanish games, school levels and activities (Spanish phase 6)");
{
  const { context, page, errors } = await newPage();
  await context.addInitScript(fakeVoices(["en-US", "fr-FR", "es-ES", "es-MX"]));
  const lastSpoken = () => page.evaluate(() => window.__spoken.at(-1) ?? null);
  const choiceButtons = () => page.locator("main .grid button");

  await page.goto(base + "/games");
  await page.waitForLoadState("networkidle");
  check((await switcherHref(page, "es")) === "/es/juegos", "ES link on /games points to /es/juegos");
  await page.goto(base + "/fr/jeux/premier-son");
  await page.waitForLoadState("networkidle");
  check((await switcherHref(page, "es")) === "/es/juegos/primera-silaba", "ES link on « Le premier son » points to « ¿Con qué sílaba empieza? »");
  await page.goto(base + "/es");
  await page.waitForLoadState("networkidle");
  check((await page.locator('main a[href^="/es/juegos/"]').count()) === 6, "Spanish home lists the 6 games");

  await page.goto(base + "/es/juegos");
  await page.waitForLoadState("networkidle");
  check((await page.getByRole("link", { name: "▶ Jugar" }).count()) === 6, "Spanish games page lists 6 games");
  await page.screenshot({ path: `${shots}/es-juegos.png`, fullPage: true });

  // Encuentra la letra.
  await page.goto(base + "/es/juegos/encuentra-la-letra");
  await page.waitForLoadState("networkidle");
  check((await switcherHref(page, "en")) === "/games/find-the-letter" && (await switcherHref(page, "fr")) === "/fr/jeux/trouve-la-lettre", "EN/FR links on a Spanish game point to its twins");
  const target = (await page.locator("p", { hasText: "Encuentra la letra" }).locator(".letter-block").innerText()).trim();
  await page.getByRole("button", { name: "Escuchar la letra que hay que encontrar" }).click();
  const asked = await lastSpoken();
  check(asked?.lang === "es-MX" && /^Encuentra la letra .+\.$/.test(asked.text), `the letter is asked with the Mexican voice (${asked?.text})`);
  const letters = await choiceButtons().allInnerTexts();
  await choiceButtons().nth(letters.findIndex((t) => t.trim() !== target)).click();
  check(await page.getByText("¡Sigue buscando!").isVisible(), "a wrong letter says « ¡Sigue buscando! »");
  check(/^Esa es la .+\.$/.test((await lastSpoken())?.text ?? ""), "the wrong letter's name is said");
  await choiceButtons().nth(letters.findIndex((t) => t.trim() === target)).click();
  check(await page.getByText(/¡Muy bien, es la/).isVisible(), "the right letter says ¡Muy bien!");
  await page.getByText("Ronda 2/10").waitFor({ timeout: 5000 }).catch(() => {});
  check(await page.getByText("Ronda 2/10").isVisible(), "next round after a right answer");
  await page.getByRole("button", { name: "minúsculas" }).click();
  const grid = await choiceButtons().allInnerTexts();
  check(grid.length === 16 && grid.every((t) => t === t.toLowerCase()), "minúsculas shows the grid in lowercase");

  // La letra y el dibujo.
  await page.goto(base + "/es/juegos/letra-y-dibujo");
  await page.waitForLoadState("networkidle");
  check((await choiceButtons().count()) === 4, "four pictures to choose from");
  for (let i = 0; i < 4 && !(await page.getByText(/^✓ ¡Sí!/).isVisible()); i++) await choiceButtons().nth(i).click();
  check(await page.getByText(/^✓ ¡Sí! .+ empieza con [A-ZÑ]\.$/).isVisible(), "finding the picture says which letter it starts with");
  check(/^¡Sí! una? /.test((await lastSpoken())?.text ?? ""), "the picture's name is read with its article");

  // ¿Con qué sílaba empieza?
  await page.goto(base + "/es/juegos/primera-silaba");
  await page.waitForLoadState("networkidle");
  await page.getByRole("button", { name: "🔊 Escuchar la palabra" }).click();
  const word = await lastSpoken();
  check(word?.lang === "es-MX" && /^[a-zñáéíóúü]+$/.test(word.text), `the word is read alone (${word?.text})`);
  check(!(await page.locator("main").getByText(word?.text ?? "∅", { exact: true }).count()), "the word isn't written on the page");
  const syllables = await choiceButtons().allInnerTexts();
  check(syllables.length === 4 && syllables.every((t) => /^[a-zñ]{1,3}$/.test(t.trim())), `four syllables to choose from (${syllables.join(" ")})`);
  for (let i = 0; i < 4 && !(await page.getByText(/^✓ ¡Muy bien!/).isVisible()); i++) await choiceButtons().nth(i).click();
  const praise = (await page.getByText(/^✓ ¡Muy bien!/).innerText().catch(() => "")).match(/«(.+)» empieza con «(.+)»/);
  check(praise?.[1] === word?.text && word.text.startsWith(praise[2]), `the right syllable is praised and starts the word (${praise?.[0]})`);

  // Traza la letra: cursive on doble raya, lowercase, through to ñ.
  await page.goto(base + "/es/juegos/traza-la-letra");
  await page.waitForLoadState("networkidle");
  await page.getByRole("button", { name: "Cursiva" }).click();
  await page.getByRole("button", { name: "Minúscula" }).click();
  for (let i = 0; i < 14; i++) await page.getByRole("button", { name: "✅ Letra siguiente →" }).click();
  check(await page.getByText("Letra 15 de 27").isVisible(), "27 letters, ñ is the 15th");
  check((await page.locator("p", { hasText: "Traza la letra" }).locator(".letter-block").innerText()).trim() === "ñ", "the 15th letter is ñ");
  await page.getByRole("button", { name: "🔊 Escuchar" }).click();
  check((await lastSpoken())?.text === "eñe", "its name is read: eñe");
  const box = await page.locator("canvas").boundingBox();
  await page.mouse.move(box.x + 100, box.y + 100);
  await page.mouse.down();
  await page.mouse.move(box.x + 200, box.y + 150, { steps: 5 });
  await page.mouse.up();
  await page.waitForTimeout(800);
  await page.screenshot({ path: `${shots}/es-juego-traza.png` });

  // El quiz: ten answers, then the end screen.
  await page.goto(base + "/es/juegos/quiz-del-abecedario");
  await page.waitForLoadState("networkidle");
  const feedback = page.getByText(/^✓ ¡Respuesta correcta!|^✗ La respuesta correcta era/);
  for (let i = 0; i < 10; i++) {
    await choiceButtons().first().click();
    await feedback.waitFor();
    await feedback.waitFor({ state: "detached", timeout: 5000 }).catch(() => {});
  }
  check(await page.getByRole("button", { name: "Jugar otra vez" }).isVisible(), "the quiz ends with a score and « Jugar otra vez »");
  await page.screenshot({ path: `${shots}/es-juego-quiz-fin.png` });

  // Aplaude las sílabas: ten words, counting claps.
  await page.goto(base + "/es/juegos/aplaude-las-silabas");
  await page.waitForLoadState("networkidle");
  check((await switcherHref(page, "en")) === "/games" && (await switcherHref(page, "fr")) === "/fr/jeux", "EN/FR links on the Spanish-only game go to the games pages");
  await page.getByRole("button", { name: "👏 Escuchar por sílabas" }).click();
  const split = await lastSpoken();
  check(split?.lang === "es-MX" && /^[a-zñáéíóúü]+(, [a-zñáéíóúü]+)*\. [a-zñáéíóúü]+$/.test(split.text), `the word is read by syllables (${split?.text})`);
  const solved = page.getByText(/^✓ ¡Sí!/);
  const counts = new Set();
  for (let round = 1; round <= 10; round++) {
    for (let n = 1; n <= 5; n++) {
      await page.getByRole("button", { name: n === 1 ? "1 sílaba" : `${n} sílabas`, exact: true }).click();
      if (await solved.isVisible()) {
        counts.add(n);
        break;
      }
    }
    if (round === 1) await page.screenshot({ path: `${shots}/es-juego-aplaude.png` });
    await page.getByRole("button", { name: round === 10 ? "Ver el resultado" : "Otra palabra →" }).click();
  }
  check(await page.getByRole("button", { name: "Jugar otra vez" }).isVisible(), "« Aplaude las sílabas » ends after 10 words");
  check(counts.size === 5, `words from 1 to 5 syllables came up (${[...counts].sort().join(", ")})`);

  // Preescolar, kínder, actividades.
  await page.goto(base + "/preschool");
  await page.waitForLoadState("networkidle");
  check((await switcherHref(page, "es")) === "/es/preescolar", "ES link on /preschool points to /es/preescolar");
  await page.goto(base + "/es/preescolar");
  await page.waitForLoadState("networkidle");
  check((await page.locator("#topics-heading + div a").count()) === 3, "preescolar hub lists 3 topics");
  check(await page.getByText("3 a 5 años", { exact: true }).isVisible(), "preescolar hub gives the ages");
  await page.screenshot({ path: `${shots}/es-preescolar.png`, fullPage: true });
  await page.goto(base + "/es/preescolar/trazos");
  await page.waitForLoadState("networkidle");
  check((await switcherHref(page, "en")) === "/preschool" && (await switcherHref(page, "fr")) === "/fr/maternelle", "EN/FR links on a Spanish-only topic go to the hubs");
  await page.goto(base + "/es/kinder/palabras-frecuentes");
  await page.waitForLoadState("networkidle");
  check((await switcherHref(page, "en")) === "/kindergarten/sight-words" && (await switcherHref(page, "fr")) === "/fr/grande-section/mots-outils", "EN/FR links on a twin topic point to its twins");
  await page.goto(base + "/es/kinder");
  await page.waitForLoadState("networkidle");
  check(await page.getByText("5 a 6 años", { exact: true }).isVisible(), "kínder hub gives the ages");
  await page.goto(base + "/es/actividades");
  await page.waitForLoadState("networkidle");
  check((await page.locator("main ul > li[id]").count()) === 8, "8 activities");
  check((await switcherHref(page, "fr")) === "/fr/activites", "FR link on /es/actividades points to /fr/activites");
  check(errors.length === 0, `no console/page errors${errors.length ? ": " + errors.slice(0, 3).join(" | ") : ""}`);
  await context.close();
}
{
  const { context, page, errors } = await newPage({ width: 390, height: 844 });
  for (const p of ["/es/juegos", "/es/juegos/encuentra-la-letra", "/es/juegos/letra-y-dibujo", "/es/juegos/primera-silaba", "/es/juegos/traza-la-letra", "/es/juegos/quiz-del-abecedario", "/es/juegos/aplaude-las-silabas", "/es/preescolar", "/es/preescolar/trazos", "/es/kinder/letra-cursiva", "/es/actividades", "/es"]) {
    await page.goto(base + p);
    await page.waitForLoadState("networkidle");
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    check(overflow <= 0, `${p}: no horizontal scroll (overflow ${overflow}px)`);
    if (p === "/es/juegos/aplaude-las-silabas") await page.screenshot({ path: `${shots}/es-juego-mobile.png`, fullPage: true });
  }
  check(errors.length === 0, `no console/page errors${errors.length ? ": " + errors.slice(0, 3).join(" | ") : ""}`);
  await context.close();
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
  // On alphabes.com the new page can re-render a moment after the click.
  await listen.waitFor({ timeout: 3000 }).catch(() => {});
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
  // Spanish: the default on the Spanish site, and a child switched to Spanish.
  await page.goto(base + "/es/mi-cuenta");
  await page.waitForLoadState("networkidle");
  await page.getByRole("button", { name: "Agregar un perfil de niño" }).click();
  check((await page.getByLabel("Idioma de aprendizaje").inputValue()) === "ES", "a profile added on the Spanish site learns in Spanish by default");
  check((await page.getByLabel("Idioma de aprendizaje").locator("option").allInnerTexts()).includes("Español"), "the select offers Español");
  await page.getByRole("button", { name: "Cancelar" }).click();
  await page.getByRole("link", { name: /Léa/ }).click();
  await page.waitForURL("**/es/mi-cuenta/*");
  await page.getByRole("button", { name: "Editar el perfil" }).click();
  await page.getByLabel("Idioma de aprendizaje").selectOption("ES");
  await page.getByRole("button", { name: "Guardar" }).click();
  await page.getByText("Aprende en español.").waitFor({ timeout: 15000 }).catch(() => {});
  links = await hrefs();
  check(links === "/es/abecedario /es/juegos /es/cuentos", `Spanish child: links to the Spanish pages (${links})`);
  await page.goto(base + "/fr/tableau-de-bord");
  await page.waitForLoadState("networkidle");
  check(await page.getByText("Apprend en espagnol").isVisible(), "the French dashboard shows « Apprend en espagnol »");
  await page.screenshot({ path: `${shots}/es-nino-idioma.png`, fullPage: true });
  check(errors.length === 0, `no console/page errors${errors.length ? ": " + errors.slice(0, 3).join(" | ") : ""}`);
  console.log(`  (test account: ${email})`);
  await context.close();
}

console.log("Header on small phones (320, 360 and 375px, phase 7)");
for (const width of [320, 360, 375]) {
  const { context, page, errors } = await newPage({ width, height: 640 });
  for (const p of ["/", "/fr", "/es", "/pt", "/es/juegos/aplaude-las-silabas", "/alphabet/a"]) {
    await page.goto(base + p);
    await page.waitForLoadState("networkidle");
    const { overflow, right } = await page.evaluate(() => ({
      overflow: document.documentElement.scrollWidth - window.innerWidth,
      right: Math.max(...[...document.querySelectorAll("[data-site-header] [role=group], [data-site-header] button")].map((e) => e.getBoundingClientRect().right)),
    }));
    check(overflow <= 0, `${width}px ${p}: no horizontal scroll (overflow ${overflow}px)`);
    check(right <= width - 16, `${width}px ${p}: menu button keeps a 16px margin (right edge ${Math.round(right)}px)`);
  }
  await page.goto(base + "/es");
  await page.waitForLoadState("networkidle");
  await page.getByRole("button", { name: "Menú" }).click();
  check(await page.locator("#mobile-menu").isVisible(), `${width}px: Spanish mobile menu opens`);
  await page.screenshot({ path: `${shots}/es-header-${width}.png` });
  check(errors.length === 0, `no console/page errors${errors.length ? ": " + errors.slice(0, 3).join(" | ") : ""}`);
  await context.close();
}

await browser.close();
console.log(problems ? `\n${problems} problem(s)` : "\nall browser checks passed");
