import type { Metadata, ResolvingMetadata } from "next";
import { routing, type Locale } from "@/i18n/routing";
import { SITE_URL, isLocale } from "@/lib/i18n/routes";
import { META_OVERRIDES } from "@/lib/seo/meta-overrides";

// Open Graph locale per language. Spanish targets Latin America first
// (docs/spanish-plan.md), Portuguese is Brazilian (docs/portuguese-plan.md).
export const OG_LOCALE: Record<Locale, string> = { en: "en_US", fr: "fr_FR", es: "es_LA", pt: "pt_BR" };

type Images = NonNullable<NonNullable<Metadata["openGraph"]>["images"]>;

function plainTitle(title: Metadata["title"]): string | undefined {
  if (!title) return undefined;
  if (typeof title === "string") return title;
  if ("absolute" in title && title.absolute) return title.absolute;
  if ("default" in title) return title.default;
  return undefined;
}

const BRAND = " | AlphaBes";
// Google cuts titles at about 60 characters (docs/seo-batch2-proposals.md).
export const MAX_TITLE = 60;

// Rule R2: the "free PDF" suffixes of worksheet, pack and bundle titles, each
// with shorter fallbacks when the title would be too long ("" drops it).
const SUFFIX_FALLBACKS: [string, string[]][] = [
  [" | Free Printable PDF Bundle", [" (Free PDF Bundle)", ""]],
  [" | Free Printable PDFs", [" (Free PDFs)", ""]],
  [" | Free Printable PDF", [" (Free PDF)", ""]],
  [" | Fiche PDF gratuite", [" (PDF gratuit)", ""]],
  [" | PDF gratuit à imprimer", [" (PDF gratuit)", ""]],
  [" | Ficha PDF gratis", [" (PDF gratis)", ""]],
  [" | PDF gratis para imprimir", [" (PDF gratis)", ""]],
  [" | Atividade em PDF grátis", [" (PDF grátis)", ""]],
  [" | PDF grátis para imprimir", [" (PDF grátis)", ""]],
];

/**
 * The <title> as shown: a worksheet suffix shortened or dropped when the
 * title would pass 60 characters (R2), then " | AlphaBes" only when it still
 * fits (R1). A title over 60 characters on its own is left whole.
 */
export function fitTitle(title: string): string {
  let t = title.endsWith(BRAND) ? title.slice(0, -BRAND.length) : title;
  for (const [suffix, fallbacks] of SUFFIX_FALLBACKS) {
    if (!t.endsWith(suffix)) continue;
    const base = t.slice(0, -suffix.length);
    t = [suffix, ...fallbacks].map((s) => base + s).find((c) => c.length <= MAX_TITLE) ?? base;
    break;
  }
  return (t + BRAND).length <= MAX_TITLE ? t + BRAND : t;
}

/** The path of a canonical URL ("https://alphabes.com/fr/tarifs" → "/fr/tarifs"). */
function pathOf(url: string): string {
  return url.startsWith(SITE_URL) ? url.slice(SITE_URL.length) || "/" : url;
}

/**
 * Completes a page's metadata: the title and description rewritten for search
 * (lib/seo/meta-overrides.ts) and fitted to Google's length (fitTitle), and
 * the Open Graph and Twitter tags. A page's `openGraph` replaces the layout's
 * whole object in Next.js, so without this a page loses the site image, type
 * and locale, and a page that sets no `openGraph` shares the home page's URL
 * and title. The URL is always the page's canonical; what the page sets
 * itself (a worksheet preview image, `type: "article"`) wins over the
 * defaults, except the rewritten title and description.
 */
export function completeSocial(locale: Locale, metadata: Metadata, defaultImages?: Images): Metadata {
  const og = metadata.openGraph ?? {};
  const canonical = metadata.alternates?.canonical;
  const url = canonical ? String(canonical) : og.url;
  const override = url ? META_OVERRIDES[pathOf(String(url))] : undefined;
  const pageTitle = override?.title ?? plainTitle(metadata.title);
  const title = override?.title ?? og.title ?? pageTitle;
  const description = override?.description ?? og.description ?? metadata.description ?? undefined;
  const images = og.images ?? defaultImages;
  return {
    ...metadata,
    ...(pageTitle && { title: { absolute: fitTitle(pageTitle) } }),
    ...(override?.description && { description: override.description }),
    openGraph: {
      type: "website",
      siteName: "AlphaBes",
      locale: OG_LOCALE[locale],
      ...og,
      ...(url && { url }),
      ...(title && { title }),
      ...(description && { description }),
      ...(images && { images }),
    } as Metadata["openGraph"],
    twitter: {
      card: "summary_large_image",
      ...(title && { title }),
      ...(description && { description }),
      ...(images && { images: images as NonNullable<Metadata["twitter"]>["images"] }),
      ...metadata.twitter,
    } as Metadata["twitter"],
  };
}

type PageProps = { params: Promise<{ locale: string }> };

/**
 * Wraps a page's metadata function so its social tags are complete. The
 * default image is the one the layout inherits from app/opengraph-image.tsx.
 */
export function withSocialMetadata<P extends PageProps>(
  build: (props: P, parent: ResolvingMetadata) => Metadata | Promise<Metadata>,
) {
  return async function generateMetadata(props: P, parent: ResolvingMetadata): Promise<Metadata> {
    const metadata = await build(props, parent);
    const param = (await props.params).locale;
    const locale = isLocale(param) ? param : routing.defaultLocale;
    const images = (await parent).openGraph?.images as Images | undefined;
    return completeSocial(locale, metadata, images);
  };
}
