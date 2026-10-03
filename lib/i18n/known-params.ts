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
import { getSchoolTopic } from "@/lib/ecole-fr";
import { getFiche, getFicheCategory, getFichePack } from "@/lib/fiches-fr";
import { getGame } from "@/lib/games-data";
import { getFrenchGame } from "@/lib/games-fr";
import { getSpanishGame } from "@/lib/juegos-es";
import { getSchoolTopicEs } from "@/lib/escuela-es";
import { getKindergartenTopic } from "@/lib/kindergarten-data";
import { getLetterContent } from "@/lib/letters-data";
import { ACCENTS_SLUG, frenchLetterParams } from "@/lib/letters-fr";
import { TILDE_SLUG, spanishLetterParams } from "@/lib/letters-es";
import { getSpanishSyllablePage } from "@/lib/silabas-es";
import { ACENTOS_SLUG as PT_ACENTOS_SLUG, portugueseLetterParams } from "@/lib/letters-pt";
import { getPortugueseSyllablePage } from "@/lib/silabas-pt";
import { getAtividade, getAtividadeCategory, getAtividadePack } from "@/lib/atividades-pt";
import { getPortugueseGame } from "@/lib/jogos-pt";
import { getSchoolTopicPt } from "@/lib/escola-pt";
import { getFicha as getSpanishFicha, getFichaCategory, getFichaPack } from "@/lib/fichas-es";
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
  "/games/[slug]": ({ slug }, locale) => (locale === "fr" ? !!getFrenchGame(slug) : !!getGame(slug)),
  "/kindergarten/[topic]": ({ topic }, locale) =>
    locale === "fr" ? !!getSchoolTopic("grande-section", topic) : !!getKindergartenTopic(topic),
  "/phonics/[skill]": ({ skill }, locale) => (locale === "fr" ? !!getFrenchSound(skill) : !!getPhonicsSkill(skill)),
  "/preschool/[topic]": ({ topic }, locale) =>
    locale === "fr" ? !!getSchoolTopic("maternelle", topic) : !!getPreschoolTopic(topic),
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

// Spanish params, added phase by phase with the Spanish pages
// (docs/spanish-plan.md). A route listed above but not here has no Spanish
// params yet, so every Spanish param 404s rather than falling back to the
// English check.
const SPANISH_LETTERS = new Set(spanishLetterParams());
const SPANISH_VALIDATORS: Partial<Record<AppPathname, (params: RouteParams) => boolean>> = {
  "/alphabet/[letter]": ({ letter }) => SPANISH_LETTERS.has(letter) || letter === TILDE_SLUG,
  "/alphabet/[letter]/worksheet": ({ letter }) => SPANISH_LETTERS.has(letter),
  "/games/[slug]": ({ slug }) => !!getSpanishGame(slug),
  "/kindergarten/[topic]": ({ topic }) => !!getSchoolTopicEs("kinder", topic),
  "/phonics/[skill]": ({ skill }) => !!getSpanishSyllablePage(skill),
  "/preschool/[topic]": ({ topic }) => !!getSchoolTopicEs("preescolar", topic),
  "/worksheets/[category]": ({ category }) => !!(getFichaCategory(category) || getSpanishFicha(category)),
  "/worksheets/bundles/[bundleSlug]": ({ bundleSlug }) => !!getFichaPack(bundleSlug),
};

// Portuguese params, added phase by phase with the Portuguese pages
// (docs/portuguese-plan.md); same rule as Spanish.
const PORTUGUESE_LETTERS = new Set(portugueseLetterParams());
const PORTUGUESE_VALIDATORS: Partial<Record<AppPathname, (params: RouteParams) => boolean>> = {
  "/alphabet/[letter]": ({ letter }) => PORTUGUESE_LETTERS.has(letter) || letter === PT_ACENTOS_SLUG,
  "/alphabet/[letter]/worksheet": ({ letter }) => PORTUGUESE_LETTERS.has(letter),
  "/games/[slug]": ({ slug }) => !!getPortugueseGame(slug),
  "/kindergarten/[topic]": ({ topic }) => !!getSchoolTopicPt("primeiro-ano", topic),
  "/phonics/[skill]": ({ skill }) => !!getPortugueseSyllablePage(skill),
  "/preschool/[topic]": ({ topic }) => !!getSchoolTopicPt("educacao-infantil", topic),
  "/worksheets/[category]": ({ category }) => !!(getAtividadeCategory(category) || getAtividade(category)),
  "/worksheets/bundles/[bundleSlug]": ({ bundleSlug }) => !!getAtividadePack(bundleSlug),
};

/** False only when we know the params don't exist; true for routes we can't check. */
export function paramsExist(pathname: AppPathname, params: RouteParams, locale: Locale): boolean {
  const validate = VALIDATORS[pathname];
  if (!validate) return true;
  if (locale === "es") return SPANISH_VALIDATORS[pathname]?.(params) ?? false;
  if (locale === "pt") return PORTUGUESE_VALIDATORS[pathname]?.(params) ?? false;
  return validate(params, locale);
}
