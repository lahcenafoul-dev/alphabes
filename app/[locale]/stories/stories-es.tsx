import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import StoryShelf from "@/components/stories/StoryShelf";
import { absoluteUrl, alternatesFor } from "@/lib/i18n/routes";

const title = "Cuentos cortos para niños para leer y escuchar";
const description =
  "24 cuentos cortos ilustrados para niños de 3 a 8 años, en tres niveles, para leer juntos o escuchar: amigos, emociones, números, letras y la hora de dormir.";

export const storiesMetadataEs: Metadata = {
  title,
  description,
  alternates: alternatesFor("es", "/stories"),
  openGraph: { title, description, url: absoluteUrl("es", "/stories") },
};

export default function StoriesEs() {
  return (
    <div className="bg-owl-bg text-owl-ink">
      <main id="main-content" className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-12">
        <nav aria-label="Ruta de navegación" className="text-sm text-owl-muted">
          <ol className="flex gap-2">
            <li><Link href="/" className="hover:text-owl-purple">Inicio</Link> /</li>
            <li aria-current="page" className="font-bold text-owl-ink">Cuentos</li>
          </ol>
        </nav>

        <h1 className="mt-4 font-display text-4xl font-extrabold leading-tight sm:text-5xl">Cuentos para leer y escuchar</h1>
        <p className="mt-4 max-w-3xl text-lg text-owl-muted">
          Elige un cuento para leer juntos. Cada página tiene su dibujo y se puede escuchar. El nivel 1 es para los más
          pequeños, y en el nivel 3 los cuentos son más largos, para los niños que ya empiezan a leer solos.
        </p>

        <StoryShelf locale="es" />
      </main>
    </div>
  );
}
