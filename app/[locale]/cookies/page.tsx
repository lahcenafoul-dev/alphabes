import type { Metadata } from "next";
import { byLocale } from "@/lib/i18n/routes";
import { initLocale, type LocaleParams } from "@/lib/i18n/server";
import CookiesEn, { cookiesMetadataEn } from "./cookies-en";
import CookiesFr, { cookiesMetadataFr } from "./cookies-fr";
import CookiesEs, { cookiesMetadataEs } from "./cookies-es";
import CookiesPt, { cookiesMetadataPt } from "./cookies-pt";

export async function generateMetadata({ params }: { params: LocaleParams }): Promise<Metadata> {
  const locale = initLocale((await params).locale);
  return byLocale(locale, { en: cookiesMetadataEn, fr: cookiesMetadataFr, es: cookiesMetadataEs, pt: cookiesMetadataPt });
}

export default async function CookiesPage({ params }: { params: LocaleParams }) {
  const locale = initLocale((await params).locale);
  const Page = byLocale(locale, { en: CookiesEn, fr: CookiesFr, es: CookiesEs, pt: CookiesPt });
  return <Page />;
}
