import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import NotFoundContent from "@/components/NotFoundContent";
import type { Locale } from "@/i18n/routing";

// Shown when a page calls notFound() (an unknown story or child profile).
// Unknown URLs and unknown letters/games/worksheets get app/global-not-found.tsx
// via the middleware instead, which renders properly on the server.
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
