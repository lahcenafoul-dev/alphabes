import type { Metadata } from "next";
import { ACCENTS_SLUG, frenchLetterParams } from "@/lib/letters-fr";
import { initLocale } from "@/lib/i18n/server";
import AccentsFr, { accentsMetadataFr } from "./accents-fr";
import LetterEn, { englishLetterParams, letterMetadataEn } from "./letter-en";
import LetterFr, { letterMetadataFr } from "./letter-fr";

type Props = { params: Promise<{ locale: string; letter: string }> };

// Every valid page is listed in generateStaticParams, so unknown params go
// straight to the 404 page. (Calling notFound() inside the page instead leaves
// an empty error shell in the server HTML with this Next.js version.)
export const dynamicParams = false;

// French has its own alphabet: é, è, ê, ç get pages of their own, plus a
// page for the other accents. Keep in sync with lib/i18n/known-params.ts.
export function generateStaticParams({ params }: { params: { locale: string } }) {
  const letters = params.locale === "fr" ? [...frenchLetterParams(), ACCENTS_SLUG] : englishLetterParams();
  return letters.map((letter) => ({ letter }));
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { locale: param, letter } = await props.params;
  const locale = initLocale(param);
  if (locale === "en") return letterMetadataEn(letter);
  return letter === ACCENTS_SLUG ? accentsMetadataFr : letterMetadataFr(letter);
}

export default async function LetterPage(props: Props) {
  const { locale: param, letter } = await props.params;
  const locale = initLocale(param);
  if (locale === "en") return <LetterEn letter={letter} />;
  return letter === ACCENTS_SLUG ? <AccentsFr /> : <LetterFr letter={letter} />;
}
