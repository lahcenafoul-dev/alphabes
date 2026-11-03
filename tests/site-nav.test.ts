import { describe, expect, it } from "vitest";
import { routing, type Locale } from "@/i18n/routing";
import { paramsExist } from "@/lib/i18n/known-params";
import { isAvailable, matchPath } from "@/lib/i18n/routes";
import { activityLinks, numberCards } from "@/lib/numbers-page";
import { siteNav } from "@/lib/site-nav";
import en from "@/messages/en.json";
import fr from "@/messages/fr.json";
import es from "@/messages/es.json";
import pt from "@/messages/pt.json";

const MESSAGES = { en, fr, es, pt } as const;
const translate = (locale: Locale) => (key: string) => {
  const value = (MESSAGES[locale].Header as Record<string, string>)[key];
  if (!value) throw new Error(`Header.${key} missing in ${locale}`);
  return value;
};

// A link is good when the middleware would serve it: a known URL, in that
// language, for a page written in that language, with real params.
function expectRealPage(locale: Locale, href: string) {
  const path = href.split("#")[0];
  const match = matchPath(path);
  expect(match, href).not.toBeNull();
  expect(match!.locale, href).toBe(locale);
  expect(isAvailable(locale, match!.pathname), href).toBe(true);
  expect(paramsExist(match!.pathname, match!.params, locale), href).toBe(true);
}

describe.each(routing.locales)("site menu and /numbers in %s", (locale) => {
  const nav = siteNav(locale, translate(locale));

  it("has the six items in order, with Alphabet, Numbers and Worksheets dropdowns", () => {
    expect(nav.map((i) => i.key)).toEqual(["alphabet", "numbers", "games", "worksheets", "stories", "parents"]);
    expect(nav.filter((i) => i.children).map((i) => i.key)).toEqual(["alphabet", "numbers", "worksheets"]);
    // The dropdown's first link is the section's own page (the phone menu leaves it out).
    for (const item of nav) if (item.children) expect(item.children[0].href).toBe(item.href);
  });

  it("links only to pages that exist in this language", () => {
    const hrefs = nav.flatMap((i) => [i.href, ...(i.children ?? []).map((c) => c.href)]);
    for (const href of hrefs) expectRealPage(locale, href);
  });

  it("shows the numbers 0 to 20 on /numbers, each linking to a real page", () => {
    const cards = numberCards(locale);
    expect(cards.map((c) => c.n)).toEqual(Array.from({ length: 21 }, (_, n) => n));
    for (const c of [...cards, ...activityLinks(locale)]) expectRealPage(locale, c.href);
  });
});
