import type { Metadata } from "next";
import { initLocale, type LocaleParams } from "@/lib/i18n/server";
import CookiesEn, { cookiesMetadataEn } from "./cookies-en";
import CookiesFr, { cookiesMetadataFr } from "./cookies-fr";
import CookiesEs, { cookiesMetadataEs } from "./cookies-es";

export async function generateMetadata({ params }: { params: LocaleParams }): Promise<Metadata> {
  const locale = initLocale((await params).locale);
  return { en: cookiesMetadataEn, fr: cookiesMetadataFr, es: cookiesMetadataEs }[locale];
}

export default async function CookiesPage({ params }: { params: LocaleParams }) {
  const locale = initLocale((await params).locale);
  const Page = { en: CookiesEn, fr: CookiesFr, es: CookiesEs }[locale];
  return <Page />;
}
