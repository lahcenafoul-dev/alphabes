import type { Metadata } from "next";
import { fichePacks } from "@/lib/fiches-fr";
import { fichaPacks } from "@/lib/fichas-es";
import { byLocale } from "@/lib/i18n/routes";
import { initLocale } from "@/lib/i18n/server";
import BundleEn, { bundleMetadataEn, englishBundleParams } from "./bundle-en";
import PackFr, { packMetadataFr } from "./pack-fr";
import PackEs, { packMetadataEs } from "./pack-es";

type Props = { params: Promise<{ locale: string; bundleSlug: string }> };

// Every valid page is listed in generateStaticParams, so unknown params go
// straight to the 404 page. (Calling notFound() inside the page instead leaves
// an empty error shell in the server HTML with this Next.js version.)
export const dynamicParams = false;

// French and Spanish packs have their own slugs. Keep in sync with lib/i18n/known-params.ts.
export function generateStaticParams({ params }: { params: { locale: string } }) {
  const slugs =
    params.locale === "fr"
      ? fichePacks.map((p) => p.slug)
      : params.locale === "es"
        ? fichaPacks.map((p) => p.slug)
        : englishBundleParams();
  return slugs.map((bundleSlug) => ({ bundleSlug }));
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { locale: param, bundleSlug } = await props.params;
  const locale = initLocale(param);
  return byLocale(locale, { en: bundleMetadataEn, fr: packMetadataFr, es: packMetadataEs })(bundleSlug);
}

export default async function BundleDetailPage(props: Props) {
  const { locale: param, bundleSlug } = await props.params;
  const locale = initLocale(param);
  const Page = byLocale(locale, { en: BundleEn, fr: PackFr, es: PackEs });
  return <Page slug={bundleSlug} />;
}
