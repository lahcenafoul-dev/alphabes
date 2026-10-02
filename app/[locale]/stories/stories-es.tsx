import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import StoryIllustration from "@/components/StoryIllustration";
import { getPrisma } from "@/lib/prisma";
import { absoluteUrl, alternatesFor } from "@/lib/i18n/routes";

const title = "Cuentos cortos para niños para leer y escuchar";
const description =
  "Ocho cuentos cortos ilustrados para niños de 3 a 7 años, para leer juntos o escuchar: una manzanita, un osito valiente, una gatita curiosa, un león que quiere dormir la siesta…";

export const storiesMetadataEs: Metadata = {
  title,
  description,
  alternates: alternatesFor("es", "/stories"),
  openGraph: { title, description, url: absoluteUrl("es", "/stories") },
};

export default async function StoriesEs() {
  const stories = await getPrisma().story.findMany({
    where: { locale: "ES" },
    orderBy: { order: "asc" },
  });

  return (
    <main id="main-content" className="mx-auto max-w-5xl px-6 py-12">
      <nav aria-label="Ruta de navegación" className="text-sm text-chalkboard/60">
        <ol className="flex gap-2">
          <li><Link href="/">Inicio</Link> /</li>
          <li aria-current="page" className="font-bold">Cuentos</li>
        </ol>
      </nav>

      <h1 className="mt-4 text-4xl font-extrabold">Cuentos para leer y escuchar</h1>
      <p className="mt-2 text-chalkboard/70 max-w-2xl">
        Elige un cuento para leer juntos. Cada página tiene su dibujo y se puede escuchar: los más pequeños siguen la
        historia, y los que ya conocen las sílabas pueden leer las frases solos.
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
                  De {story.ageRangeMin} a {story.ageRangeMax} años
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
