import type { Locale } from "@/i18n/routing";
import { DB_LOCALE } from "@/lib/i18n/db-locale";
import { SITE_URL, absoluteUrl, localizedPath } from "@/lib/i18n/routes";
import { getPrisma } from "@/lib/prisma";
import { storyExtras } from "@/lib/stories";
import StoryGrid, { type StoryCard } from "./StoryGrid";

// The story list of one language (from the database, in order), as cards
// with the level filter, plus its ItemList JSON-LD.
export default async function StoryShelf({ locale }: { locale: Locale }) {
  const stories = await getPrisma().story.findMany({
    where: { locale: DB_LOCALE[locale] },
    orderBy: { order: "asc" },
    include: { _count: { select: { pages: true } } },
  });

  const cards: StoryCard[] = stories.map((s) => {
    const extras = storyExtras(s.translationGroup, locale);
    return {
      href: localizedPath(locale, "/stories/[slug]", { slug: s.slug }),
      title: s.title,
      description: extras?.description ?? "",
      cover: s.coverUrl,
      alt: extras?.alt[0] ?? s.title,
      level: extras?.level ?? (s.ageRangeMax <= 4 ? 1 : s.ageRangeMax <= 6 ? 2 : 3),
      ageMin: s.ageRangeMin,
      ageMax: s.ageRangeMax,
      pages: s._count.pages,
      isNew: extras?.isNew ?? false,
    };
  });

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: stories.map((s, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: absoluteUrl(locale, "/stories/[slug]", { slug: s.slug }),
      name: s.title,
      ...(s.coverUrl?.startsWith("/") && { image: new URL(s.coverUrl, SITE_URL).href }),
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <StoryGrid stories={cards} locale={locale} />
    </>
  );
}
