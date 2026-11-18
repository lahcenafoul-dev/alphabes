import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { routing, type Locale } from "@/i18n/routing";
import { absoluteUrl, alternatesFor, localizedPath } from "@/lib/i18n/routes";
import { initLocale } from "@/lib/i18n/server";
import StoryReader from "./story-reader";
import { ForParents, WholeStory } from "@/components/stories/StorySections";
import { buildShortStoryJsonLd, buildStoriesBreadcrumbJsonLd } from "@/lib/json-ld";
import { withSocialMetadata } from "@/lib/social-metadata";
import { storiesFor, storyBySlug, storyExtras, storyOgImage, storyTwins } from "@/lib/stories";

type Props = { params: Promise<{ locale: string; slug: string }> };

// Built at build time from prisma/stories-v2 (lib/stories.ts), like the other
// content pages, so they are cached (s-maxage) instead of rendered per
// request. Nothing here depends on the visitor: the reader asks for the
// signed-in parent's children in the browser (/api/children) and saves
// progress through /api/stories/[slug]/progress. A story exists only in its
// own language; unknown slugs never reach the page (the middleware 404s them).
export const dynamicParams = false;

export function generateStaticParams({ params }: { params: { locale: string } }) {
  const locale = routing.locales.find((l) => l === params.locale);
  return locale ? storiesFor(locale).map((s) => ({ slug: s.slug })) : [];
}

async function pageMetadata(props: Props): Promise<Metadata> {
  const { locale: param, slug } = await props.params;
  const locale = initLocale(param);
  const story = storyBySlug(slug, locale);
  // Its twins are the same tale in the other languages (translationGroup), so
  // they all carry hreflang to each other.
  const alternates = alternatesFor(locale, "/stories/[slug]", { slug }, story ? storyTwins(story.translationGroup, locale) : undefined);
  // Without its own canonical, a story inherited the home page's.
  if (!story) return { alternates };
  const { title: name, translationGroup } = story;
  const title = {
    en: `${name}: A Short Story to Read and Listen To`,
    fr: `${name} : une histoire à lire et à écouter`,
    es: `${name}: un cuento para leer y escuchar`,
    pt: `${name}: uma história para ler e ouvir`,
  }[locale];
  // The description written for each story (prisma/stories-v2).
  const description = storyExtras(translationGroup, locale)?.description;
  const images = [{ url: storyOgImage(translationGroup), width: 1200, height: 630, alt: name }];
  return {
    title,
    description,
    alternates,
    openGraph: { title, description, url: absoluteUrl(locale, "/stories/[slug]", { slug }), images },
  };
}

export default async function StoryPage(props: Props) {
  const params = await props.params;
  const locale = initLocale(params.locale);
  const story = storyBySlug(params.slug, locale);

  if (!story) notFound();
  const extras = storyExtras(story.translationGroup, locale);

  return (
    <main id="main-content" className="mx-auto max-w-3xl px-6 py-12">
      {locale === "fr" ? (
        <nav aria-label="Fil d'Ariane" className="text-sm text-chalkboard/60">
          <Link href={localizedPath("fr", "/")}>Accueil</Link> / <Link href={localizedPath("fr", "/stories")}>Histoires</Link>
        </nav>
      ) : locale === "es" ? (
        <nav aria-label="Ruta de navegación" className="text-sm text-chalkboard/60">
          <Link href={localizedPath("es", "/")}>Inicio</Link> / <Link href={localizedPath("es", "/stories")}>Cuentos</Link>
        </nav>
      ) : locale === "pt" ? (
        <nav aria-label="Caminho de navegação" className="text-sm text-chalkboard/60">
          <Link href={localizedPath("pt", "/")}>Início</Link> / <Link href={localizedPath("pt", "/stories")}>Histórias</Link>
        </nav>
      ) : (
        <nav className="text-sm text-chalkboard/60">
          <Link href="/">Home</Link> / <Link href="/stories">Story Time</Link>
        </nav>
      )}

      <h1 className="mt-4 text-3xl font-extrabold">{story.title}</h1>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(buildShortStoryJsonLd(locale, { ...story, description: extras?.description, teaches: extras?.teaches, keywords: extras?.words })) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(buildStoriesBreadcrumbJsonLd(locale, story)) }} />

      <StoryReader story={story} locale={locale} alt={extras?.alt} questions={extras?.questions} />
      <WholeStory locale={locale} pages={story.pages} alt={extras?.alt ?? []} />
      <ForParents locale={locale} teaches={extras?.teaches ?? ""} questions={extras?.questions ?? []} words={extras?.words ?? []} />
    </main>
  );
}

export const generateMetadata = withSocialMetadata(pageMetadata);
