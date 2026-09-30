import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import StoryIllustration from "@/components/StoryIllustration";
import { getPrisma } from "@/lib/prisma";
import { absoluteUrl, alternatesFor } from "@/lib/i18n/routes";

const title = "Histoires pour enfants à lire et à écouter";
const description =
  "Huit petites histoires illustrées pour les enfants de 3 à 7 ans, à lire ensemble ou à écouter : une pomme, un ourson, un chat curieux, un lion qui veut faire la sieste…";

export const storiesMetadataFr: Metadata = {
  title,
  description,
  alternates: alternatesFor("fr", "/stories"),
  openGraph: { title, description, url: absoluteUrl("fr", "/stories") },
};

export default async function StoriesFr() {
  const stories = await getPrisma().story.findMany({
    where: { locale: "FR" },
    orderBy: { order: "asc" },
  });

  return (
    <main id="main-content" className="mx-auto max-w-5xl px-6 py-12">
      <nav aria-label="Fil d'Ariane" className="text-sm text-chalkboard/60">
        <ol className="flex gap-2">
          <li><Link href="/">Accueil</Link> /</li>
          <li aria-current="page" className="font-bold">Histoires</li>
        </ol>
      </nav>

      <h1 className="mt-4 text-4xl font-extrabold">Des histoires à lire et à écouter</h1>
      <p className="mt-2 text-chalkboard/70 max-w-2xl">
        Choisissez une histoire à lire ensemble. Chaque page a son image, et on peut l&apos;écouter : les plus
        petits suivent, les lecteurs du CP lisent les phrases eux-mêmes.
      </p>

      <ul className="mt-10 grid gap-6 sm:grid-cols-2 md:grid-cols-3">
        {stories.map((story) => (
          <li key={story.id}>
            <Link
              href={{ pathname: "/stories/[slug]", params: { slug: story.slug } }}
              className="block rounded-block border border-chalkboard/10 shadow-block overflow-hidden hover:shadow-lg transition"
            >
              <StoryIllustration scene={story.coverUrl} endLabel="Fin" />
              <div className="p-4">
                <h2 className="font-display font-bold text-lg">{story.title}</h2>
                <p className="mt-1 text-sm text-chalkboard/60">
                  De {story.ageRangeMin} à {story.ageRangeMax} ans
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
