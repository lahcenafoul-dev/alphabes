import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import StoryShelf from "@/components/stories/StoryShelf";
import { absoluteUrl, alternatesFor } from "@/lib/i18n/routes";

const title = "Histoires pour enfants à lire et à écouter";
const description =
  "24 petites histoires illustrées pour les enfants de 3 à 8 ans, en trois niveaux, à lire ensemble ou à écouter : l'amitié, les émotions, les chiffres, les lettres, le coucher…";

export const storiesMetadataFr: Metadata = {
  title,
  description,
  alternates: alternatesFor("fr", "/stories"),
  openGraph: { title, description, url: absoluteUrl("fr", "/stories") },
};

export default function StoriesFr() {
  return (
    <div className="bg-owl-bg text-owl-ink">
      <main id="main-content" className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-12">
        <nav aria-label="Fil d'Ariane" className="text-sm text-owl-muted">
          <ol className="flex gap-2">
            <li><Link href="/" className="hover:text-owl-purple">Accueil</Link> /</li>
            <li aria-current="page" className="font-bold text-owl-ink">Histoires</li>
          </ol>
        </nav>

        <h1 className="mt-4 font-display text-4xl font-extrabold leading-tight sm:text-5xl">Des histoires à lire et à écouter</h1>
        <p className="mt-4 max-w-3xl text-lg text-owl-muted">
          Choisissez une histoire à lire ensemble. Chaque page a son image, et on peut l&apos;écouter. Le niveau 1 est
          pour les plus petits ; au niveau 3, les histoires sont plus longues, pour les enfants qui commencent à lire
          seuls.
        </p>

        <StoryShelf locale="fr" />
      </main>
    </div>
  );
}
