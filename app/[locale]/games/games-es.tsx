import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { absoluteUrl, alternatesFor } from "@/lib/i18n/routes";
import { buildBreadcrumbJsonLd } from "@/lib/json-ld";
import { spanishGames } from "@/lib/juegos-es";

const title = "Juegos educativos para aprender el abecedario y las sílabas";
const description =
  "Seis juegos en español para preescolar y primer grado, tres de ellos gratis: encontrar letras, unir la letra con su dibujo, la primera sílaba, trazar letras en cursiva, el quiz del abecedario y aplaudir las sílabas.";

export const gamesMetadataEs: Metadata = {
  title,
  description,
  alternates: alternatesFor("es", "/games"),
  openGraph: { title, description, url: absoluteUrl("es", "/games") },
};

const tips = [
  "Las primeras veces, jueguen juntos: lean la instrucción con tu hijo o hija y muéstrale dónde tocar.",
  "De cinco a diez minutos son suficientes. Es mejor un juego corto cada día que una sesión larga.",
  "Equivocarse no es grave: el juego dice el nombre de lo que se tocó, y así también se aprende.",
  "El sonido usa la voz en español del dispositivo: sube el volumen y, si no se escucha nada, sigue los consejos que aparecen para instalar una voz.",
];

export default function GamesEs() {
  const url = absoluteUrl("es", "/games");
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Inicio", url: absoluteUrl("es", "/") },
    { name: "Juegos", url },
  ]);
  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Juegos educativos AlphaBes",
    itemListElement: spanishGames.map((g, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: g.title,
      url: absoluteUrl("es", "/games/[slug]", { slug: g.slug }),
    })),
  };

  return (
    <main id="main-content" className="mx-auto max-w-6xl px-6 py-12">
      <nav aria-label="Ruta de navegación" className="text-sm text-chalkboard/60">
        <ol className="flex gap-2">
          <li><Link href="/">Inicio</Link> /</li>
          <li aria-current="page" className="font-bold">Juegos</li>
        </ol>
      </nav>

      <h1 className="mt-6 text-4xl font-extrabold">Juegos para aprender las letras y las sílabas</h1>
      <p className="mt-2 text-chalkboard/70 max-w-2xl">
        Seis juegos cortos en español, para jugar en cualquier pantalla, también en el teléfono:
        reconocer las letras, escuchar las sílabas y practicar la escritura. Las instrucciones se pueden
        escuchar: no hace falta saber leer para jugar.
      </p>

      <div className="mt-8 grid sm:grid-cols-2 md:grid-cols-3 gap-5">
        {spanishGames.map((g) => (
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
                  {g.isPremium ? "Pro" : "Gratis"}
                </span>
                <span className="inline-block rounded-full bg-crayon-yellow/25 px-3 py-1 text-xs font-bold">{g.age}</span>
              </span>
              <Link
                href={{ pathname: "/games/[slug]", params: { slug: g.slug } }}
                className="shrink-0 rounded-block bg-chalkboard text-paper font-display font-bold px-4 py-2 text-sm shadow-block hover:shadow-blockHover transition"
              >
                ▶ Jugar
              </Link>
            </div>
          </div>
        ))}
      </div>

      <section className="mt-16 bg-crayon-yellow/15 rounded-block p-8" aria-labelledby="tips-heading">
        <h2 id="tips-heading" className="text-3xl font-bold">
          Consejos para mamá y papá
        </h2>
        <ul className="mt-6 space-y-3 list-disc list-inside text-chalkboard/80 max-w-3xl">
          {tips.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
        <p className="mt-6 text-chalkboard/80 max-w-3xl">
          Para seguir, repasen cada letra en{" "}
          <Link href="/alphabet" className="font-bold underline">
            el abecedario
          </Link>
          , escuchen{" "}
          <Link href="/phonics" className="font-bold underline">
            las sílabas
          </Link>{" "}
          o impriman una{" "}
          <Link href="/worksheets" className="font-bold underline">
            ficha
          </Link>
          .
        </p>
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }} />
    </main>
  );
}
