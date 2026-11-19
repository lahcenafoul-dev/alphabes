import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { frenchLetterParams } from "@/lib/letters-fr";
import { spanishLetterParams } from "@/lib/letters-es";
import { portugueseLetterParams } from "@/lib/letters-pt";
import { initLocale } from "@/lib/i18n/server";
import WorksheetFr, { worksheetMetadataFr } from "./worksheet-fr";
import WorksheetEs, { worksheetMetadataEs } from "./worksheet-es";
import WorksheetPt, { worksheetMetadataPt } from "./worksheet-pt";
import { withSocialMetadata } from "@/lib/social-metadata";

type Props = { params: Promise<{ locale: string; letter: string }> };

// Every valid page is listed in generateStaticParams, so unknown params go
// straight to the 404 page. (Calling notFound() inside the page instead leaves
// an empty error shell in the server HTML with this Next.js version.)
export const dynamicParams = false;

// /fr/alphabet/[letter]/fiche also covers é, è, ê and ç; /es/abecedario/[letter]/ficha covers ñ;
// /pt/alfabeto/[letter]/atividade covers ç. There is no English page: the
// English tracer gave the same PDF as /worksheets/letter-x-tracing and 301s
// there (next.config.js, SEO phase 4, 2026-11-19).
export function generateStaticParams({ params }: { params: { locale: string } }) {
  const letters =
    params.locale === "fr"
      ? frenchLetterParams()
      : params.locale === "es"
        ? spanishLetterParams()
        : params.locale === "pt"
          ? portugueseLetterParams()
          : [ENGLISH_PLACEHOLDER];
  return letters.map((letter) => ({ letter }));
}

// English gets one placeholder page that is a 404, never a real one. It can't
// be an empty list: Next 15.5 then passes { locale: "en" } on without a letter,
// counts the route's params as incomplete and prerenders no tracer at all, in
// any language. Nobody reaches it: next.config.js 301s /alphabet/x/worksheet
// and the middleware 404s every other English tracer URL.
const ENGLISH_PLACEHOLDER = "none";

const PAGES = {
  fr: { Page: WorksheetFr, metadata: worksheetMetadataFr },
  es: { Page: WorksheetEs, metadata: worksheetMetadataEs },
  pt: { Page: WorksheetPt, metadata: worksheetMetadataPt },
};

const pagesFor = (locale: string) => {
  const pages = PAGES[locale as keyof typeof PAGES];
  if (!pages) notFound();
  return pages;
};

async function pageMetadata(props: Props): Promise<Metadata> {
  const { locale: param, letter } = await props.params;
  const locale = initLocale(param);
  return pagesFor(locale).metadata(letter);
}

export default async function LetterWorksheetPage(props: Props) {
  const { locale: param, letter } = await props.params;
  const locale = initLocale(param);
  const { Page } = pagesFor(locale);
  return <Page letter={letter} />;
}

export const generateMetadata = withSocialMetadata(pageMetadata);
