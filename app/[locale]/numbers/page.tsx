import type { Metadata } from "next";
import NumbersPage from "@/components/numbers/NumbersPage";
import { absoluteUrl, alternatesFor } from "@/lib/i18n/routes";
import { initLocale, type LocaleParams } from "@/lib/i18n/server";
import { numbersCopy } from "@/lib/numbers-page";
import { withSocialMetadata } from "@/lib/social-metadata";

// /numbers, /fr/nombres, /es/numeros, /pt/numeros (lib/numbers-page.ts).
async function pageMetadata({ params }: { params: LocaleParams }): Promise<Metadata> {
  const locale = initLocale((await params).locale);
  const { title, description } = numbersCopy(locale);
  return {
    title,
    description,
    alternates: alternatesFor(locale, "/numbers"),
    openGraph: { title, description, url: absoluteUrl(locale, "/numbers") },
  };
}

export default async function Numbers({ params }: { params: LocaleParams }) {
  const locale = initLocale((await params).locale);
  return <NumbersPage locale={locale} />;
}

export const generateMetadata = withSocialMetadata(pageMetadata);
