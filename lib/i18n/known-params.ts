// Which params exist for the content-driven routes, using the same lookups
// as the pages. The middleware checks these so an unknown letter, game or
// worksheet gets the real 404 page (app/global-not-found.tsx) in the right
// language: letting the page call notFound() leaves an empty error shell in
// the server HTML with this Next.js version.
//
// Database-backed routes (stories, dashboard) aren't listed; their pages
// still call notFound().
import type { AppPathname, Locale } from "@/i18n/routing";
import { getLetterData } from "@/lib/alphabet-data";
import { getBlogCategory, getBlogPost } from "@/lib/blog-data";
import { getFiche, getFicheCategory, getFichePack } from "@/lib/fiches-fr";
import { getGame } from "@/lib/games-data";
import { getKindergartenTopic } from "@/lib/kindergarten-data";
import { getLetterContent } from "@/lib/letters-data";
import { ACCENTS_SLUG, frenchLetterParams } from "@/lib/letters-fr";
import { getPhonicsSkill } from "@/lib/phonics-data";
import { getPreschoolTopic } from "@/lib/preschool-data";
import { getFrenchSound } from "@/lib/sons-fr";
import { getStaticWorksheetCategory } from "@/lib/static-worksheet-categories";
import { getStaticWorksheetBySlug } from "@/lib/static-worksheets-data";
import { getBundleBySlug } from "@/lib/worksheet-bundles";
import { getWorksheetCategory } from "@/lib/worksheet-categories";
import { getWorksheetTypeByCategorySlug } from "@/lib/worksheet-types";
import { getWorksheetBySlug } from "@/lib/worksheets-data";
import type { RouteParams } from "./routes";

type Validator = (params: RouteParams, locale: Locale) => boolean;

// French letters: the 26 (as "a" or "A"), then é, è, ê, ç by slug.
const FRENCH_LETTERS = new Set(frenchLetterParams());

const VALIDATORS: Partial<Record<AppPathname, Validator>> = {
  "/alphabet/[letter]": ({ letter }, locale) =>
    locale === "fr" ? FRENCH_LETTERS.has(letter) || letter === ACCENTS_SLUG : !!getLetterContent(letter),
  "/alphabet/[letter]/worksheet": ({ letter }, locale) =>
    locale === "fr" ? FRENCH_LETTERS.has(letter) : !!getLetterData(letter),
  "/blog/[slug]": ({ slug }) => !!(getBlogCategory(slug) || getBlogPost(slug)),
  "/games/[slug]": ({ slug }) => !!getGame(slug),
  "/kindergarten/[topic]": ({ topic }) => !!getKindergartenTopic(topic),
  "/phonics/[skill]": ({ skill }, locale) => (locale === "fr" ? !!getFrenchSound(skill) : !!getPhonicsSkill(skill)),
  "/preschool/[topic]": ({ topic }) => !!getPreschoolTopic(topic),
  "/worksheets/[category]": ({ category }, locale) =>
    locale === "fr"
      ? !!(getFicheCategory(category) || getFiche(category))
      : !!(
          getWorksheetCategory(category) ||
          getWorksheetTypeByCategorySlug(category) ||
          getWorksheetBySlug(category) ||
          getStaticWorksheetCategory(category) ||
          getStaticWorksheetBySlug(category)
        ),
  "/worksheets/bundles/[bundleSlug]": ({ bundleSlug }, locale) =>
    locale === "fr" ? !!getFichePack(bundleSlug) : !!getBundleBySlug(bundleSlug),
};

/** False only when we know the params don't exist; true for routes we can't check. */
export function paramsExist(pathname: AppPathname, params: RouteParams, locale: Locale): boolean {
  const validate = VALIDATORS[pathname];
  return validate ? validate(params, locale) : true;
}
