import type { Metadata } from "next";
import { frenchLetterParams } from "@/lib/letters-fr";
import { initLocale } from "@/lib/i18n/server";
import WorksheetEn, { englishWorksheetParams, worksheetMetadataEn } from "./worksheet-en";
import WorksheetFr, { worksheetMetadataFr } from "./worksheet-fr";

type Props = { params: Promise<{ locale: string; letter: string }> };

// Every valid page is listed in generateStaticParams, so unknown params go
// straight to the 404 page. (Calling notFound() inside the page instead leaves
// an empty error shell in the server HTML with this Next.js version.)
export const dynamicParams = false;

// /fr/alphabet/[letter]/fiche also covers é, è, ê and ç.
export function generateStaticParams({ params }: { params: { locale: string } }) {
  const letters = params.locale === "fr" ? frenchLetterParams() : englishWorksheetParams();
  return letters.map((letter) => ({ letter }));
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { locale: param, letter } = await props.params;
  const locale = initLocale(param);
  return locale === "fr" ? worksheetMetadataFr(letter) : worksheetMetadataEn(letter);
}

export default async function LetterWorksheetPage(props: Props) {
  const { locale: param, letter } = await props.params;
  const locale = initLocale(param);
  return locale === "fr" ? <WorksheetFr letter={letter} /> : <WorksheetEn letter={letter} />;
}
