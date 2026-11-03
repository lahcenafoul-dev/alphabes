import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import StoryShelf from "@/components/stories/StoryShelf";
import { absoluteUrl, alternatesFor } from "@/lib/i18n/routes";

const title = "Histórias curtas para crianças lerem e ouvirem";
const description =
  "24 histórias curtas ilustradas para crianças de 3 a 8 anos, em três níveis, para ler juntos ou ouvir: amizade, sentimentos, números, letras e a hora de dormir.";

export const storiesMetadataPt: Metadata = {
  title,
  description,
  alternates: alternatesFor("pt", "/stories"),
  openGraph: { title, description, url: absoluteUrl("pt", "/stories") },
};

export default function StoriesPt() {
  return (
    <div className="bg-owl-bg text-owl-ink">
      <main id="main-content" className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-12">
        <nav aria-label="Caminho de navegação" className="text-sm text-owl-muted">
          <ol className="flex gap-2">
            <li><Link href="/" className="hover:text-owl-purple">Início</Link> /</li>
            <li aria-current="page" className="font-bold text-owl-ink">Histórias</li>
          </ol>
        </nav>

        <h1 className="mt-4 font-display text-4xl font-extrabold leading-tight sm:text-5xl">Histórias para ler e ouvir</h1>
        <p className="mt-4 max-w-3xl text-lg text-owl-muted">
          Escolha uma história para ler juntos. Cada página tem a sua figura e pode ser ouvida. O nível 1 é para os
          pequenos, e no nível 3 as histórias são mais longas, para as crianças que já começam a ler sozinhas.
        </p>

        <StoryShelf locale="pt" />
      </main>
    </div>
  );
}
