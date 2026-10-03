import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import StoryIllustration from "@/components/StoryIllustration";
import { getPrisma } from "@/lib/prisma";
import { absoluteUrl, alternatesFor } from "@/lib/i18n/routes";

const title = "Histórias curtas para crianças lerem e ouvirem";
const description =
  "Oito histórias curtas ilustradas para crianças de 3 a 7 anos, para ler juntos ou ouvir: uma maçãzinha, um ursinho corajoso, uma gatinha curiosa, um leão que quer tirar uma soneca…";

export const storiesMetadataPt: Metadata = {
  title,
  description,
  alternates: alternatesFor("pt", "/stories"),
  openGraph: { title, description, url: absoluteUrl("pt", "/stories") },
};

export default async function StoriesPt() {
  const stories = await getPrisma().story.findMany({
    where: { locale: "PT" },
    orderBy: { order: "asc" },
  });

  return (
    <main id="main-content" className="mx-auto max-w-5xl px-6 py-12">
      <nav aria-label="Caminho de navegação" className="text-sm text-chalkboard/60">
        <ol className="flex gap-2">
          <li><Link href="/">Início</Link> /</li>
          <li aria-current="page" className="font-bold">Histórias</li>
        </ol>
      </nav>

      <h1 className="mt-4 text-4xl font-extrabold">Histórias para ler e ouvir</h1>
      <p className="mt-2 text-chalkboard/70 max-w-2xl">
        Escolha uma história para ler juntos. Cada página tem a sua figura e pode ser ouvida: os pequenos acompanham a
        história, e quem já conhece as famílias silábicas pode ler as frases sozinho.
      </p>

      <ul className="mt-10 grid gap-6 sm:grid-cols-2 md:grid-cols-3">
        {stories.map((story) => (
          <li key={story.id}>
            <Link
              href={{ pathname: "/stories/[slug]", params: { slug: story.slug } }}
              className="block rounded-block border border-chalkboard/10 shadow-block overflow-hidden hover:shadow-lg transition"
            >
              <StoryIllustration scene={story.coverUrl} endLabel="Fim" />
              <div className="p-4">
                <h2 className="font-display font-bold text-lg">{story.title}</h2>
                <p className="mt-1 text-sm text-chalkboard/60">
                  De {story.ageRangeMin} a {story.ageRangeMax} anos
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
