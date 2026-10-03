import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import ClientOnly from "@/components/games/ClientOnly";
import PremiumGameTeaser from "@/components/billing/PremiumGameTeaser";
import EncuentraLaLetra from "@/components/juegos-es/EncuentraLaLetra";
import LetraYDibujo from "@/components/juegos-es/LetraYDibujo";
import AplaudeLasSilabas from "@/components/juegos-es/AplaudeLasSilabas";
import { absoluteUrl, alternatesFor } from "@/lib/i18n/routes";
import { buildBreadcrumbJsonLd } from "@/lib/json-ld";
import { getSpanishGame, spanishGames } from "@/lib/juegos-es";

export function gameMetadataEs(slug: string): Metadata {
  const g = getSpanishGame(slug);
  if (!g) return {};
  const title = g.isPremium
    ? `${g.title}: juego educativo para aprender a leer`
    : `${g.title}: juego educativo gratis para aprender a leer`;
  return {
    title,
    description: g.description,
    alternates: alternatesFor("es", "/games/[slug]", { slug: g.slug }),
    openGraph: { title, description: g.description, url: absoluteUrl("es", "/games/[slug]", { slug: g.slug }) },
  };
}

// The free games only; premium ones are played on the play page.
function GameBody({ slug }: { slug: string }) {
  switch (slug) {
    case "encuentra-la-letra":
      return <EncuentraLaLetra />;
    case "letra-y-dibujo":
      return <LetraYDibujo />;
    case "aplaude-las-silabas":
      return <AplaudeLasSilabas />;
    default:
      return null;
  }
}

export default function GameEs({ slug }: { slug: string }) {
  // The page only renders games listed in lib/juegos-es.ts.
  const g = getSpanishGame(slug)!;
  const url = absoluteUrl("es", "/games/[slug]", { slug: g.slug });
  const others = spanishGames.filter((o) => o.slug !== g.slug);

  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Inicio", url: absoluteUrl("es", "/") },
    { name: "Juegos", url: absoluteUrl("es", "/games") },
    { name: g.title, url },
  ]);
  const learningResourceJsonLd = {
    "@context": "https://schema.org",
    "@type": "LearningResource",
    name: g.title,
    description: g.description,
    url,
    inLanguage: "es",
    learningResourceType: "Game",
    educationalLevel: "Preescolar y primer grado",
    typicalAgeRange: g.age.replace(" años", "").replace(" a ", "-"),
    isAccessibleForFree: !g.isPremium,
  };

  return (
    <main id="main-content" className="mx-auto max-w-4xl px-4 sm:px-6 py-12">
      <nav aria-label="Ruta de navegación" className="text-sm text-chalkboard/60">
        <ol className="flex flex-wrap gap-2">
          <li><Link href="/">Inicio</Link> /</li>
          <li><Link href="/games">Juegos</Link> /</li>
          <li aria-current="page" className="font-bold">{g.title}</li>
        </ol>
      </nav>

      <h1 className="mt-4 text-4xl font-extrabold">
        <span aria-hidden="true">{g.emoji} </span>
        {g.title}
      </h1>
      <p className="mt-2 text-chalkboard/70 max-w-2xl">{g.description}</p>

      {g.isPremium ? (
        <PremiumGameTeaser locale="es" slug={g.slug} />
      ) : (
        <div className="mt-8 rounded-block border border-chalkboard/10 p-4 sm:p-6 shadow-block">
          <ClientOnly fallback={<p className="text-chalkboard/50">Cargando el juego…</p>}>
            <GameBody slug={g.slug} />
          </ClientOnly>
        </div>
      )}

      <section className="mt-10 rounded-block bg-crayon-yellow/15 p-6" aria-labelledby="parents-heading">
        <h2 id="parents-heading" className="font-display font-bold text-lg">
          Para mamá y papá
        </h2>
        <p className="mt-2 text-chalkboard/80">{g.forParents}</p>
        <p className="mt-2 text-sm text-chalkboard/60">Edad recomendada: de {g.age}.</p>
      </section>

      <section className="mt-10" aria-labelledby="others-heading">
        <h2 id="others-heading" className="font-display font-bold text-lg">
          Más juegos
        </h2>
        <ul className="mt-3 flex flex-wrap gap-3">
          {others.map((o) => (
            <li key={o.slug}>
              <Link
                href={{ pathname: "/games/[slug]", params: { slug: o.slug } }}
                className="inline-block rounded-block border border-chalkboard/15 px-4 py-2 text-sm font-display font-bold hover:border-crayon-blue transition-colors"
              >
                <span aria-hidden="true">{o.emoji} </span>
                {o.title}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(learningResourceJsonLd) }} />
    </main>
  );
}
