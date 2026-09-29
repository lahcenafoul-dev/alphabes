import type { Metadata } from "next";
import LocaleDocument, { buildLocaleMetadata } from "@/components/LocaleDocument";
import { routing } from "@/i18n/routing";
import { initLocale, type LocaleParams } from "@/lib/i18n/server";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: LocaleParams }): Promise<Metadata> {
  const locale = initLocale((await params).locale);
  return buildLocaleMetadata(locale);
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: LocaleParams;
}) {
  const locale = initLocale((await params).locale);
  return <LocaleDocument locale={locale}>{children}</LocaleDocument>;
}
