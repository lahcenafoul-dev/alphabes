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
  // Pro packs and bundles (lib/sheets/pack-ui.ts).
  [" | Printable PDF (AlphaBes Pro)", [" (Pro PDF)", ""]],
  [" | PDF à imprimer (AlphaBes Pro)", [" (PDF Pro)", ""]],
  [" | PDF para imprimir (AlphaBes Pro)", [" (PDF Pro)", ""]],
];
// In Portuguese, a title that already ends in a bracket ("… (caligrafia)",
// "… (1 a 10)") takes this instead of " (PDF grátis)": never two brackets in a row.
const PT_AFTER_BRACKET: [string, string] = [" (PDF grátis)", " – PDF grátis"];

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
    const shorter = base.endsWith(")") ? fallbacks.map((f) => (f === PT_AFTER_BRACKET[0] ? PT_AFTER_BRACKET[1] : f)) : fallbacks;
    t = [suffix, ...shorter].map((s) => base + s).find((c) => c.length <= MAX_TITLE) ?? base;
    break;
  }
  return (t + BRAND).length <= MAX_TITLE ? t + BRAND : t;
}

// Google shows about 155–160 characters of a description (SEO phase 4).
export const MAX_DESCRIPTION = 155;

/**
 * A description over 155 characters, cut to fit by dropping whole
 * sentences from the end, so the first sentence (with the page's main
 * keyword) always stays. One sentence that is too long on its own is left
 * whole: it needs a shorter text (tests/seo/meta-lengths.test.ts).
 */
export function fitDescription(description: string): string {
  if (description.length <= MAX_DESCRIPTION) return description;
  const sentences = description.split(/(?<=[.!?…])\s+(?=[\p{Lu}0-9¿¡«"“])/u);
  while (sentences.length > 1 && sentences.join(" ").length > MAX_DESCRIPTION) sentences.pop();
  return sentences.join(" ");
}

type ImageItem = string | URL | { url: string | URL; alt?: string };

/**
 * Every image as an object with an alt text (og:image:alt, twitter:image:alt).
 * An image the page described keeps its own alt; the others get `alt`, the
 * page's share title, which is in the page's language (the site image's
 * English alt from app/opengraph-image.tsx would be wrong on a French page).
 */
export function withImageAlt(images: Images, alt: string): Images {
  const list = (Array.isArray(images) ? images : [images]) as ImageItem[];
  return list.map((img) =>
    typeof img === "string" || img instanceof URL ? { url: img, alt } : { ...img, alt: img.alt || alt },
  ) as Images;
}

/** The images without their alt, so withImageAlt gives them a new one. */
function stripAlt(images: Images): Images {
  const list = (Array.isArray(images) ? images : [images]) as ImageItem[];
  return list.map((img) => (typeof img === "string" || img instanceof URL ? img : { ...img, alt: undefined })) as Images;
}

/**
 * og:locale:alternate: the Open Graph locales of the page's other languages,
 * from its hreflang alternates (x-default and the page's own language left out).
 */
export function alternateOgLocales(locale: Locale, metadata: Metadata): string[] {
  const languages = metadata.alternates?.languages;
  if (!languages) return [];
  return Object.keys(languages)
    .filter((l): l is Locale => l !== locale && isLocale(l))
    .map((l) => OG_LOCALE[l]);
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
  const rawDescription = override?.description ?? og.description ?? metadata.description ?? undefined;
  const description = rawDescription ? fitDescription(rawDescription) : undefined;
  // og.title can be a template object; the alt needs the plain text.
  const altText = plainTitle(title);
  // The page's own images keep their alt. The inherited site image always
  // takes the page's title: its English alt (app/opengraph-image.tsx) would
  // be wrong on a French page and too generic everywhere else.
  const images = og.images
    ? altText ? withImageAlt(og.images, altText) : og.images
    : defaultImages && altText
      ? withImageAlt(stripAlt(defaultImages), altText)
      : defaultImages;
  const alternateLocale = alternateOgLocales(locale, metadata);
  return {
    ...metadata,
    ...(pageTitle && { title: { absolute: fitTitle(pageTitle) } }),
    ...((override?.description || metadata.description) && { description: fitDescription(override?.description ?? metadata.description!) }),
    openGraph: {
      type: "website",
      siteName: "AlphaBes",
      locale: OG_LOCALE[locale],
      ...og,
      ...(url && { url }),
      ...(title && { title }),
      ...(description && { description }),
      ...(images && { images }),
      ...(alternateLocale.length > 0 && { alternateLocale }),
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
