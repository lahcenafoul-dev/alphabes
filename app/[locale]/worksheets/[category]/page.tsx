import type { Metadata } from "next";
import { ficheCategoryParams } from "@/lib/fiches-fr";
import { fichaCategoryParams } from "@/lib/fichas-es";
import { atividadeCategoryParams } from "@/lib/atividades-pt";
import { byLocale } from "@/lib/i18n/routes";
import type { Locale } from "@/i18n/routing";
import { initLocale } from "@/lib/i18n/server";
import CategoryEn, { categoryMetadataEn, englishCategoryParams } from "./category-en";
import CategoryFr, { categoryMetadataFr } from "./category-fr";
import CategoryEs, { categoryMetadataEs } from "./category-es";
import CategoryPt, { categoryMetadataPt } from "./category-pt";
import { withSocialMetadata } from "@/lib/social-metadata";
import SheetPage, { isSheetSlug, sheetMetadata } from "@/components/sheets/SheetPages";
import { sheetCategoryParams } from "@/lib/sheets/catalog";

type Props = { params: Promise<{ locale: string; category: string }> };

// Every valid page is listed in generateStaticParams, so unknown params go
// straight to the 404 page. (Calling notFound() inside the page instead leaves
// an empty error shell in the server HTML with this Next.js version.)
export const dynamicParams = false;

// The French worksheets (lib/fiches-fr.ts), the Spanish ones
// (lib/fichas-es.ts) and the Portuguese ones (lib/atividades-pt.ts) have their
// own slugs, unrelated to the English ones. The worksheet types of
// lib/sheets/catalog.ts (missing numbers, patterns, sticker sheets) exist in
// every language and use components/sheets/SheetPages.tsx.
// Keep in sync with lib/i18n/known-params.ts.
export function generateStaticParams({ params }: { params: { locale: string } }) {
  const slugs =
    params.locale === "fr"
      ? ficheCategoryParams()
      : params.locale === "es"
        ? fichaCategoryParams()
        : params.locale === "pt"
          ? atividadeCategoryParams()
          : englishCategoryParams();
  return [...slugs, ...sheetCategoryParams(params.locale as Locale)].map((category) => ({ category }));
}

async function pageMetadata(props: Props): Promise<Metadata> {
  const { locale: param, category } = await props.params;
  const locale = initLocale(param);
  // The worksheet types of lib/sheets/catalog.ts; their slugs differ from the others.
  if (isSheetSlug(locale, category)) return sheetMetadata(locale, category);
  return byLocale(locale, { en: categoryMetadataEn, fr: categoryMetadataFr, es: categoryMetadataEs, pt: categoryMetadataPt })(category);
}

export default async function WorksheetCategoryPage(props: Props) {
  const { locale: param, category } = await props.params;
  const locale = initLocale(param);
  if (isSheetSlug(locale, category)) return <SheetPage locale={locale} slug={category} />;
  const Page = byLocale(locale, { en: CategoryEn, fr: CategoryFr, es: CategoryEs, pt: CategoryPt });
  return <Page slug={category} />;
}

export const generateMetadata = withSocialMetadata(pageMetadata);
