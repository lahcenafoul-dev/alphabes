import type { Metadata } from "next";
import { frenchLetterParams } from "@/lib/letters-fr";
import { spanishLetterParams } from "@/lib/letters-es";
import { initLocale } from "@/lib/i18n/server";
import WorksheetEn, { englishWorksheetParams, worksheetMetadataEn } from "./worksheet-en";
import WorksheetFr, { worksheetMetadataFr } from "./worksheet-fr";
import WorksheetEs, { worksheetMetadataEs } from "./worksheet-es";

type Props = { params: Promise<{ locale: string; letter: string }> };

// Every valid page is listed in generateStaticParams, so unknown params go
// straight to the 404 page. (Calling notFound() inside the page instead leaves
// an empty error shell in the server HTML with this Next.js version.)
export const dynamicParams = false;

// /fr/alphabet/[letter]/fiche also covers é, è, ê and ç; /es/abecedario/[letter]/ficha covers ñ.
export function generateStaticParams({ params }: { params: { locale: string } }) {
  const letters =
    params.locale === "fr" ? frenchLetterParams() : params.locale === "es" ? spanishLetterParams() : englishWorksheetParams();
  return letters.map((letter) => ({ letter }));
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { locale: param, letter } = await props.params;
  const locale = initLocale(param);
  return { en: worksheetMetadataEn, fr: worksheetMetadataFr, es: worksheetMetadataEs }[locale](letter);
}

export default async function LetterWorksheetPage(props: Props) {
  const { locale: param, letter } = await props.params;
  const locale = initLocale(param);
  const Page = { en: WorksheetEn, fr: WorksheetFr, es: WorksheetEs }[locale];
  return <Page letter={letter} />;
}
