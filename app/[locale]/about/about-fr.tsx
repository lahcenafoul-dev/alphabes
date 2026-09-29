import type { Metadata } from "next";
import { alternatesFor } from "@/lib/i18n/routes";

export const aboutMetadataFr: Metadata = {
  title: "À propos d'AlphaBes",
  description:
    "AlphaBes aide les enfants de 3 à 8 ans à apprendre les lettres, les sons et à faire leurs premiers pas en lecture.",
  alternates: alternatesFor("fr", "/about"),
};

export default function AboutFr() {
  return (
    <main id="main-content" className="mx-auto max-w-2xl px-6 py-12">
      <h1 className="text-4xl font-extrabold">À propos d&apos;AlphaBes</h1>
      <div className="mt-6 space-y-4 text-chalkboard/80 leading-relaxed">
        <p>
          AlphaBes est né d&apos;une idée simple : rendre la toute première étape de la lecture,
          les lettres et leurs sons, accessible aux enfants de 3 à 8 ans, ainsi qu&apos;aux
          parents et aux enseignants qui les accompagnent.
        </p>
        <p>
          Chaque leçon associe une lettre à son son, à de vrais mots d&apos;exemple et à des
          activités concrètes, comme le tracé ou la recherche du premier son d&apos;un mot.
          L&apos;enfant retrouve ainsi la même lettre de plusieurs façons avant de passer à la
          suivante.
        </p>
        <p>
          La version française n&apos;est pas une simple traduction : le nom des lettres, les
          sons, les mots d&apos;exemple et l&apos;écriture cursive suivent ce que les enfants
          apprennent à l&apos;école, en France comme au Maroc.
        </p>
        <p>
          Le site est conçu pour bien fonctionner sur téléphone et sur tablette, car c&apos;est
          souvent là que les jeunes enfants s&apos;exercent. L&apos;interface reste assez simple
          pour qu&apos;un enfant s&apos;y retrouve seul, une fois qu&apos;un adulte l&apos;a aidé à
          démarrer.
        </p>
      </div>
    </main>
  );
}
