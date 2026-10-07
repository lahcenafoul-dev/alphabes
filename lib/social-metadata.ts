import type { Metadata, ResolvingMetadata } from "next";
import { routing, type Locale } from "@/i18n/routing";
import { isLocale } from "@/lib/i18n/routes";

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

/**
 * Completes a page's Open Graph and Twitter tags from its own metadata.
 * A page's `openGraph` replaces the layout's whole object in Next.js, so
 * without this a page loses the site image, type and locale, and a page that
 * sets no `openGraph` shares the home page's URL and title. The URL is always
 * the page's canonical; what the page sets itself (a worksheet preview image,
 * `type: "article"`) wins over the defaults.
 */
export function completeSocial(locale: Locale, metadata: Metadata, defaultImages?: Images): Metadata {
  const og = metadata.openGraph ?? {};
  const canonical = metadata.alternates?.canonical;
  const url = canonical ? String(canonical) : og.url;
  const title = og.title ?? plainTitle(metadata.title);
  const description = og.description ?? metadata.description ?? undefined;
  const images = og.images ?? defaultImages;
  return {
    ...metadata,
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
