import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { absoluteUrl, alternatesFor } from "@/lib/i18n/routes";
import { buildBreadcrumbJsonLd } from "@/lib/json-ld";
import { frenchGames } from "@/lib/games-fr";

const title = "Jeux éducatifs pour apprendre l'alphabet et les sons";
const description =
  "Cinq jeux gratuits et en français pour la maternelle et le CP : trouver une lettre, associer la lettre et l'image, entendre le premier son, tracer les lettres en cursive et un quiz de l'alphabet.";

export const gamesMetadataFr: Metadata = {
  title,
  description,
  alternates: alternatesFor("fr", "/games"),
  openGraph: { title, description, url: absoluteUrl("fr", "/games") },
};

const tips = [
  "Jouez à côté de l'enfant les premières fois : lisez la consigne avec lui et montrez où toucher.",
  "Cinq à dix minutes suffisent. Mieux vaut un petit jeu chaque jour qu'une longue séance.",
  "Une erreur n'est pas grave : le jeu dit le nom de ce qui a été touché, l'enfant apprend aussi comme ça.",
  "Le son passe par la voix française de l'appareil : montez le volume et, si rien ne se passe, suivez les conseils affichés pour installer une voix.",
];

export default function GamesFr() {
  const url = absoluteUrl("fr", "/games");
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Accueil", url: absoluteUrl("fr", "/") },
    { name: "Jeux", url },
  ]);
  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Jeux éducatifs AlphaBes",
    itemListElement: frenchGames.map((g, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: g.title,
      url: absoluteUrl("fr", "/games/[slug]", { slug: g.slug }),
    })),
  };

  return (
    <main id="main-content" className="mx-auto max-w-6xl px-6 py-12">
      <nav aria-label="Fil d'Ariane" className="text-sm text-chalkboard/60">
        <ol className="flex gap-2">
          <li><Link href="/">Accueil</Link> /</li>
          <li aria-current="page" className="font-bold">Jeux</li>
        </ol>
      </nav>

      <h1 className="mt-6 text-4xl font-extrabold">Des jeux pour apprendre les lettres</h1>
      <p className="mt-2 text-chalkboard/70 max-w-2xl">
        Cinq petits jeux en français, sur ordinateur, tablette ou téléphone, pour reconnaître les
        lettres, entendre les sons et s&apos;entraîner à écrire. Les consignes se lisent à voix haute :
        pas besoin de savoir lire pour jouer.
      </p>

      <div className="mt-8 grid sm:grid-cols-2 md:grid-cols-3 gap-5">
        {frenchGames.map((g) => (
          <div key={g.slug} className="flex flex-col rounded-block border border-chalkboard/10 p-6 shadow-block">
            <p className="text-4xl" aria-hidden="true">
              {g.emoji}
            </p>
            <h2 className="mt-3 font-display font-bold text-lg">{g.title}</h2>
            <p className="mt-2 text-sm text-chalkboard/70">{g.description}</p>
            <div className="mt-auto pt-4 flex items-center justify-between gap-2">
              <span className="flex flex-wrap gap-2">
                <span
                  className={`inline-block rounded-full px-3 py-1 text-xs font-bold ${g.isPremium ? "bg-crayon-purple/20 text-crayon-purple" : "bg-crayon-green/20 text-crayon-green"}`}
                >
                  {g.isPremium ? "Pro" : "Gratuit"}
                </span>
                <span className="inline-block rounded-full bg-crayon-yellow/25 px-3 py-1 text-xs font-bold">{g.age}</span>
              </span>
              <Link
                href={{ pathname: "/games/[slug]", params: { slug: g.slug } }}
                className="shrink-0 rounded-block bg-chalkboard text-paper font-display font-bold px-4 py-2 text-sm shadow-block hover:shadow-blockHover transition"
              >
                ▶ Jouer
              </Link>
            </div>
          </div>
        ))}
      </div>

      <section className="mt-16 bg-crayon-yellow/15 rounded-block p-8" aria-labelledby="tips-heading">
        <h2 id="tips-heading" className="text-3xl font-bold">
          Conseils pour les parents
        </h2>
        <ul className="mt-6 space-y-3 list-disc list-inside text-chalkboard/80 max-w-3xl">
          {tips.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
        <p className="mt-6 text-chalkboard/80 max-w-3xl">
          Pour aller plus loin, revoyez chaque lettre sur{" "}
          <Link href="/alphabet" className="font-bold underline">
            l&apos;alphabet
          </Link>
          , écoutez{" "}
          <Link href="/phonics" className="font-bold underline">
            les sons
          </Link>{" "}
          ou imprimez une{" "}
          <Link href="/worksheets" className="font-bold underline">
            fiche
          </Link>
          .
        </p>
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }} />
    </main>
  );
}
