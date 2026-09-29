// Usage (from the repo root): node scripts/i18n-check/browser.mjs [baseUrl] [shotsDir]
// Real-browser checks of the language switcher, French forms and mobile layout.
import { mkdirSync } from "fs";
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

  await page.goto(base + "/alphabet");
  await page.waitForLoadState("networkidle");
  check((await switcherHref(page, "fr")) === "/fr", "FR link on /alphabet (no French yet) falls back to /fr");

  await page.goto(base + "/pricing");
  await page.waitForLoadState("networkidle");
  await Promise.all([page.waitForURL("**/fr/tarifs"), page.locator("[role=group] a[hreflang=fr]").click()]);
  check(page.url().endsWith("/fr/tarifs"), "clicking FR on /pricing opens /fr/tarifs");
  check((await cookie(context)) === "fr", "NEXT_LOCALE=fr cookie is set");
  check((await page.getAttribute("html", "lang")) === "fr", "French page has lang=fr");
  await page.screenshot({ path: `${shots}/fr-tarifs.png`, fullPage: false });

  await page.goto(base + "/contact");
  check(page.url().endsWith("/fr/contact"), "with the cookie, /contact redirects to /fr/contact");
  await page.goto(base + "/alphabet");
  check(page.url().endsWith("/alphabet"), "with the cookie, /alphabet (no French yet) stays English");

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

  await page.goto(base + "/fr/contact");
  await page.waitForLoadState("networkidle");
  await page.getByLabel("Nom").fill("Test");
  await page.getByLabel("Adresse e-mail").fill("test@example.com");
  await page.getByLabel("Message").fill("Bonjour, ceci est un test.");
  await page.getByRole("button", { name: "Envoyer le message" }).click();
  const sent = page.getByText("Merci ! Nous vous répondrons très vite.");
  await sent.waitFor({ timeout: 15000 }).catch(() => {});
  check(await sent.isVisible(), "contact form shows the French confirmation");

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

await browser.close();
console.log(problems ? `\n${problems} problem(s)` : "\nall browser checks passed");
