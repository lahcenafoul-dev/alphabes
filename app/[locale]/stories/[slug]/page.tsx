import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getPrisma } from "@/lib/prisma";
import Link from "next/link";
import type { Metadata } from "next";
import { routing, type Locale } from "@/i18n/routing";
import { DB_LOCALE, fromDbLocale } from "@/lib/i18n/db-locale";
import { absoluteUrl, alternatesFor, localizedPath, type RouteParams } from "@/lib/i18n/routes";
import { initLocale } from "@/lib/i18n/server";
import StoryReader from "./story-reader";

type Props = { params: Promise<{ locale: string; slug: string }> };

// A story exists only in its own language (the middleware already 404s the
// others). Its twins are the same tale in the other languages, found through
// translationGroup, so they all carry hreflang to each other.
async function findStoryMeta(slug: string, locale: Locale) {
  const prisma = getPrisma();
  const story = await prisma.story.findFirst({
    where: { slug, locale: DB_LOCALE[locale] },
    select: { title: true, translationGroup: true, pages: { select: { text: true }, orderBy: { pageNumber: "asc" }, take: 2 } },
  });
  if (!story) return null;
  const twins = story.translationGroup
    ? await prisma.story.findMany({
        where: { translationGroup: story.translationGroup, locale: { not: DB_LOCALE[locale] } },
        select: { slug: true, locale: true },
      })
    : [];
  const otherParams: Partial<Record<Locale, RouteParams>> = {};
  for (const twin of twins) {
    const l = fromDbLocale(twin.locale);
    if (routing.locales.includes(l)) otherParams[l] = { slug: twin.slug };
  }
  return { story, otherParams };
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { locale: param, slug } = await props.params;
  const locale = initLocale(param);
  const found = await findStoryMeta(slug, locale);
  const alternates = alternatesFor(locale, "/stories/[slug]", { slug }, found?.otherParams);
  // Without its own canonical, a story inherited the home page's.
  if (locale === "en" || !found) return { alternates };
  const text = found.story.pages.map((p) => p.text).join(" ");
  const { title, description } =
    locale === "fr"
      ? {
          title: `${found.story.title} : une histoire à lire et à écouter`,
          description: `${text} Une histoire illustrée pour les enfants, à lire ensemble ou à écouter.`,
        }
      : {
          title: `${found.story.title}: un cuento para leer y escuchar`,
          description: `${text} Un cuento ilustrado para niños, para leer juntos o escuchar.`,
        };
  return { title, description, alternates, openGraph: { title, description, url: absoluteUrl(locale, "/stories/[slug]", { slug }) } };
}

export default async function StoryPage(props: Props) {
  const prisma = getPrisma();
  const params = await props.params;
  const locale = initLocale(params.locale);
  const story = await prisma.story.findFirst({
    where: { slug: params.slug, locale: DB_LOCALE[locale] },
    include: { pages: { orderBy: { pageNumber: "asc" } } },
  });

  if (!story) notFound();

  const session = await getServerSession(authOptions);
  const email = session?.user?.email;

  let children: { id: string; firstName: string }[] = [];
  if (email) {
    const user = await prisma.user.findUnique({
      where: { email },
      include: { children: { select: { id: true, firstName: true, language: true } } },
    });
    // Children who learn in the story's language come first (preselected).
    const all = user?.children ?? [];
    children = [...all.filter((c) => c.language === story.locale), ...all.filter((c) => c.language !== story.locale)].map(
      ({ id, firstName }) => ({ id, firstName }),
    );
  }

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
      ) : (
        <nav className="text-sm text-chalkboard/60">
          <Link href="/">Home</Link> / <Link href="/stories">Story Time</Link>
        </nav>
      )}

      <h1 className="mt-4 text-3xl font-extrabold">{story.title}</h1>

      <StoryReader story={story} childProfiles={children} locale={locale} />
    </main>
  );
}
