// Usage (from the repo root, with `npm run dev` on the port given):
//   node scripts/i18n-check/pro-packs.mjs [baseUrl] [shotsDir]
// Browser checks of the Pro packs (docs/pro-packs.md) in the 4 languages, at
// 1280 and 390 px: the bundles listing's packs section, a pack page (cover,
// previews, download buttons, no horizontal scroll), the "get the pack" box on
// a worksheet type and a sheet page, the menu entry, the pricing line and the
// login page's "Not Pro yet? See plans" link. Downloads: logged out → the
// login page, then (with CHECK_ACCOUNTS=1, a throwaway Pro account on the dev
// database, removed by cleanup-accounts.mjs) the PDF itself, read from
// pro-files/ by `next dev`.
import { mkdirSync, readFileSync } from "fs";
import { chromium } from "@playwright/test";

const base = process.argv[2] ?? "http://localhost:3100";
const shots = process.argv[3] ?? "i18n-shots/pro-packs";
mkdirSync(shots, { recursive: true });
let problems = 0;
const check = (ok, label) => {
  if (!ok) problems++;
  console.log(`  ${ok ? "✓" : "✗"} ${label}`);
};
const messages = Object.fromEntries(["en", "fr", "es", "pt"].map((l) => [l, JSON.parse(readFileSync(`messages/${l}.json`, "utf8"))]));

const L = {
  en: { prefix: "", listing: "/worksheets/bundles", pack: "/worksheets/bundles/missing-numbers-complete-pack", mega: "/worksheets/bundles/mega-pack", kind: "/worksheets/missing-numbers", login: "/login", pricing: "/pricing", hub: "/worksheets", paper: "letter", section: "AlphaBes Pro packs" },
  fr: { prefix: "/fr", listing: "/fr/fiches/packs", pack: "/fr/fiches/packs/pack-nombres-manquants-complet", mega: "/fr/fiches/packs/pack-mega", kind: "/fr/fiches/nombres-manquants", login: "/fr/connexion", pricing: "/fr/tarifs", hub: "/fr/fiches", paper: "a4", section: "Les packs AlphaBes Pro" },
  es: { prefix: "/es", listing: "/es/fichas/paquetes", pack: "/es/fichas/paquetes/paquete-numeros-faltantes-completo", mega: "/es/fichas/paquetes/paquete-mega", kind: "/es/fichas/numeros-faltantes", login: "/es/iniciar-sesion", pricing: "/es/precios", hub: "/es/fichas", paper: "a4", section: "Paquetes AlphaBes Pro" },
  pt: { prefix: "/pt", listing: "/pt/atividades/pacotes", pack: "/pt/atividades/pacotes/pacote-numeros-que-faltam-completo", mega: "/pt/atividades/pacotes/pacote-mega", kind: "/pt/atividades/numeros-que-faltam", login: "/pt/entrar", pricing: "/pt/precos", hub: "/pt/atividades", paper: "a4", section: "Pacotes AlphaBes Pro" },
};

const browser = await chromium.launch();
async function newPage(viewport) {
  const context = await browser.newContext({ viewport });
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(`pageerror: ${e.message}`));
  page.on("console", (m) => {
    if (m.type() === "error") errors.push(`console: ${m.text()}`);
  });
  return { context, page, errors };
}
async function open(page, path) {
  const res = await page.goto(base + path);
  await page.waitForLoadState("networkidle");
  return res?.status() ?? 0;
}
// Screenshots keep the caret ("initial"): hiding it restyles the inputs, which
// React reports as a hydration mismatch when it happens before hydration.
const overflow = (page) => page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
const brokenImages = (page) =>
  page.evaluate(async () => {
    // Scrolled into view rather than set to loading="eager": changing the
    // attribute before React hydrates is itself a hydration mismatch.
    const imgs = [...document.querySelectorAll("main img")];
    for (const img of imgs) {
      img.scrollIntoView();
      await img.decode().catch(() => {});
    }
    window.scrollTo(0, 0);
    return imgs.filter((i) => !i.complete || i.naturalWidth === 0).map((i) => i.getAttribute("src"));
  });

let proCookies = null;
if (process.env.CHECK_ACCOUNTS) {
  console.log("Pro test account (dev database)");
  const { context, page } = await newPage({ width: 1280, height: 900 });
  const email = `i18n-check-${Date.now()}-packs@example.com`;
  await open(page, "/register");
  await page.getByLabel("Your Name").fill("Packs test");
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password").fill("password-test-123");
  await page.getByRole("button", { name: "Start Learning Free" }).click();
  await page.waitForURL("**/dashboard", { timeout: 30000 });
  const url = readFileSync(".env", "utf8").split(/\r?\n/).find((l) => l.startsWith("DATABASE_URL="))?.slice(13).replace(/^"|"$/g, "");
  const { PrismaClient } = await import("@prisma/client");
  const prisma = new PrismaClient({ datasources: { db: { url } } });
  const user = await prisma.user.findUniqueOrThrow({ where: { email } });
  const period = { plan: "PRO_MONTHLY", status: "ACTIVE", currentPeriodEnd: new Date(Date.now() + 86_400_000) };
  await prisma.subscription.upsert({ where: { userId: user.id }, update: period, create: { userId: user.id, ...period } });
  await prisma.$disconnect();
  proCookies = (await context.cookies()).filter((c) => c.name.includes("next-auth"));
  check(proCookies.length > 0, `Pro test account ready (${email})`);
  await context.close();
}

for (const [lang, p] of Object.entries(L)) {
  for (const width of [1280, 390]) {
    console.log(`${lang.toUpperCase()} at ${width}px, logged out`);
    const { context, page, errors } = await newPage({ width, height: 900 });

    check((await open(page, p.listing)) === 200, `${p.listing} 200`);
    check(await page.getByRole("heading", { name: p.section }).isVisible(), "listing: Pro packs section");
    check((await page.locator(`main a[href="${p.pack}"]`).count()) >= 1, "listing: links to the complete Missing Numbers pack");
    check((await overflow(page)) <= 0, "listing: no horizontal scroll");
    await page.screenshot({ path: `${shots}/${lang}-${width}-listing.png`, caret: "initial" });

    check((await open(page, p.pack)) === 200, `${p.pack} 200`);
    check((await page.locator("h1").count()) === 1, "pack page: one h1");
    const downloads = page.locator(`main a[href^="/api/bundles/${lang}/"]`);
    check((await downloads.count()) === 2, "pack page: 2 download buttons (both papers)");
    check(((await downloads.first().getAttribute("href")) ?? "").includes(`paper=${p.paper}`), `pack page: ${p.paper} first`);
    check((await brokenImages(page)).length === 0, `pack page: cover and previews load ${JSON.stringify(await brokenImages(page))}`);
    check((await page.locator(`main a[href="${p.pricing}"]`).count()) >= 1, "pack page: link to the plans");
    check((await page.locator('link[rel=alternate][hreflang]').count()) === 5, "pack page: hreflang ×4 + x-default");
    check((await page.locator('script[type="application/ld+json"]').count()) >= 2, "pack page: JSON-LD");
    check((await overflow(page)) <= 0, "pack page: no horizontal scroll");
    await page.screenshot({ path: `${shots}/${lang}-${width}-pack.png`, fullPage: true, caret: "initial" });

    check((await open(page, p.mega)) === 200, `${p.mega} 200`);
    check((await page.locator(`main a[href^="/api/bundles/${lang}/"]`).count()) === 10, "Mega pack: 5 parts × 2 papers");
    check((await overflow(page)) <= 0, "Mega pack: no horizontal scroll");
    if (width === 390) await page.screenshot({ path: `${shots}/${lang}-${width}-mega.png`, fullPage: true, caret: "initial" });

    check((await open(page, p.kind)) === 200, `${p.kind} 200`);
    check((await page.locator(`main aside a[href="${p.pack}"]`).count()) === 1, "type page: “get the pack” box");
    // The first sheet of the gallery.
    const sheetHref = await page.locator(`main section:has(h2.sr-only) a[href^="${p.hub}/"]`).first().getAttribute("href").catch(() => null);
    if (sheetHref) {
      await open(page, sheetHref);
      check((await page.locator(`main aside a[href="${p.pack}"]`).count()) === 1, `sheet page ${sheetHref}: “get the pack” box`);
      check((await overflow(page)) <= 0, "sheet page: no horizontal scroll");
    }

    await open(page, p.hub);
    check((await page.locator(`main a[href="${p.listing}"]`).count()) >= 1, "hub: links to the packs");
    check((await page.locator(`header a[href="${p.listing}"]`).count()) >= 1, "menu: Pro packs entry");

    await open(page, p.pricing);
    check((await page.locator("main").innerText()).includes(messages[lang].Pricing.monthly.features.at(-1)), "pricing: packs listed as a Pro benefit");

    await open(page, p.login);
    check(await page.getByRole("link", { name: messages[lang].Login.seePlans }).isVisible(), `login: “${messages[lang].Login.notPro} ${messages[lang].Login.seePlans}”`);
    if (width === 390) await page.screenshot({ path: `${shots}/${lang}-${width}-login.png`, caret: "initial" });

    // A download while logged out goes to the login page, then back.
    await open(page, p.pack);
    await Promise.all([page.waitForURL(`**${p.login}?next=*`), downloads.first().click()]);
    check(decodeURIComponent(page.url()).endsWith(`next=${p.pack}`), "download logged out → login, then back to the pack");
    check(errors.length === 0, `no console/page errors${errors.length ? ": " + errors.slice(0, 3).join(" | ") : ""}`);
    await context.close();

    if (proCookies) {
      console.log(`${lang.toUpperCase()} at ${width}px, as Pro`);
      const { context, page } = await newPage({ width, height: 900 });
      await context.addCookies(proCookies);
      await open(page, p.mega);
      const link = page.locator(`main a[href^="/api/bundles/${lang}/"]`).nth(1);
      const [download] = await Promise.all([page.waitForEvent("download"), link.click()]);
      const file = await download.path();
      const head = readFileSync(file).subarray(0, 5).toString();
      check(head === "%PDF-", `Pro download: ${download.suggestedFilename()} is a PDF`);
      const res = await context.request.get(base + `/api/bundles/${lang}/${p.mega.split("/").pop()}?paper=a3`, { maxRedirects: 0 });
      check(res.status() === 404, "Pro download: unknown paper 404");
      await context.close();
    }
  }
}

// A direct request for a Pro file never works without the check.
{
  const { context } = await newPage({ width: 1280, height: 900 });
  for (const path of ["/pro-files/en/packs/mega-pack-part-1-letter.pdf", "/en/packs/mega-pack-part-1-letter.pdf", "/pro-packs/en/mega-pack/mega-pack-part-1-letter.pdf"]) {
    const res = await context.request.get(base + path, { maxRedirects: 0 });
    check(res.status() === 404, `${path}: ${res.status()} (no PDF without the route)`);
  }
  await context.close();
}

await browser.close();
console.log(problems ? `\n${problems} problem(s)` : "\nall Pro pack browser checks passed");
