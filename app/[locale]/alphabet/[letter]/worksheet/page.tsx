import type { Metadata } from "next";
import { frenchLetterParams } from "@/lib/letters-fr";
import { spanishLetterParams } from "@/lib/letters-es";
import { portugueseLetterParams } from "@/lib/letters-pt";
import { byLocale } from "@/lib/i18n/routes";
import { initLocale } from "@/lib/i18n/server";
import WorksheetEn, { englishWorksheetParams, worksheetMetadataEn } from "./worksheet-en";
import WorksheetFr, { worksheetMetadataFr } from "./worksheet-fr";
import WorksheetEs, { worksheetMetadataEs } from "./worksheet-es";
import WorksheetPt, { worksheetMetadataPt } from "./worksheet-pt";

type Props = { params: Promise<{ locale: string; letter: string }> };

// Every valid page is listed in generateStaticParams, so unknown params go
// straight to the 404 page. (Calling notFound() inside the page instead leaves
// an empty error shell in the server HTML with this Next.js version.)
export const dynamicParams = false;

// /fr/alphabet/[letter]/fiche also covers é, è, ê and ç; /es/abecedario/[letter]/ficha covers ñ;
// /pt/alfabeto/[letter]/atividade covers ç.
export function generateStaticParams({ params }: { params: { locale: string } }) {
  const letters =
    params.locale === "fr"
      ? frenchLetterParams()
      : params.locale === "es"
        ? spanishLetterParams()
        : params.locale === "pt"
          ? portugueseLetterParams()
          : englishWorksheetParams();
  return letters.map((letter) => ({ letter }));
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { locale: param, letter } = await props.params;
  const locale = initLocale(param);
  return byLocale(locale, { en: worksheetMetadataEn, fr: worksheetMetadataFr, es: worksheetMetadataEs, pt: worksheetMetadataPt })(letter);
}

export default async function LetterWorksheetPage(props: Props) {
  const { locale: param, letter } = await props.params;
  const locale = initLocale(param);
  const Page = byLocale(locale, { en: WorksheetEn, fr: WorksheetFr, es: WorksheetEs, pt: WorksheetPt });
  return <Page letter={letter} />;
}
