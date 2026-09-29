import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import NotFoundContent from "@/components/NotFoundContent";
import type { Locale } from "@/i18n/routing";

// Shown when a page calls notFound() (an unknown letter, game or story).
// Unknown URLs are handled by app/not-found.tsx via the middleware.
export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("NotFound");
  return {
    title: t("title"),
    robots: { index: false },
  };
}

export default async function NotFound() {
  const locale = (await getLocale()) as Locale;
  return <NotFoundContent locale={locale} />;
}
