import type { Metadata } from "next";
import { ACCENTS_SLUG, frenchLetterParams } from "@/lib/letters-fr";
import { TILDE_SLUG, spanishLetterParams } from "@/lib/letters-es";
import { ACENTOS_SLUG, portugueseLetterParams } from "@/lib/letters-pt";
import { initLocale } from "@/lib/i18n/server";
import AccentsFr, { accentsMetadataFr } from "./accents-fr";
import LetterEn, { englishLetterParams, letterMetadataEn } from "./letter-en";
import LetterFr, { letterMetadataFr } from "./letter-fr";
import LetterEs, { letterMetadataEs } from "./letter-es";
import TildeEs, { tildeMetadataEs } from "./tilde-es";
import LetterPt, { letterMetadataPt } from "./letter-pt";
import AcentosPt, { acentosMetadataPt } from "./acentos-pt";

type Props = { params: Promise<{ locale: string; letter: string }> };

// Every valid page is listed in generateStaticParams, so unknown params go
// straight to the 404 page. (Calling notFound() inside the page instead leaves
// an empty error shell in the server HTML with this Next.js version.)
export const dynamicParams = false;

// French has its own alphabet: é, è, ê, ç get pages of their own, plus a
// page for the other accents. Spanish has 27 letters (ñ is "enie") and a
// page for the tilde. Portuguese has the 26 letters, Ç ("c-cedilha") and a
// page for the accents. Keep in sync with lib/i18n/known-params.ts.
export function generateStaticParams({ params }: { params: { locale: string } }) {
  const letters =
    params.locale === "fr"
      ? [...frenchLetterParams(), ACCENTS_SLUG]
      : params.locale === "es"
        ? [...spanishLetterParams(), TILDE_SLUG]
        : params.locale === "pt"
          ? [...portugueseLetterParams(), ACENTOS_SLUG]
          : englishLetterParams();
  return letters.map((letter) => ({ letter }));
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { locale: param, letter } = await props.params;
  const locale = initLocale(param);
  if (locale === "en") return letterMetadataEn(letter);
  if (locale === "es") return letter === TILDE_SLUG ? tildeMetadataEs : letterMetadataEs(letter);
  if (locale === "pt") return letter === ACENTOS_SLUG ? acentosMetadataPt : letterMetadataPt(letter);
  return letter === ACCENTS_SLUG ? accentsMetadataFr : letterMetadataFr(letter);
}

export default async function LetterPage(props: Props) {
  const { locale: param, letter } = await props.params;
  const locale = initLocale(param);
  if (locale === "en") return <LetterEn letter={letter} />;
  if (locale === "es") return letter === TILDE_SLUG ? <TildeEs /> : <LetterEs letter={letter} />;
  if (locale === "pt") return letter === ACENTOS_SLUG ? <AcentosPt /> : <LetterPt letter={letter} />;
  return letter === ACCENTS_SLUG ? <AccentsFr /> : <LetterFr letter={letter} />;
}
