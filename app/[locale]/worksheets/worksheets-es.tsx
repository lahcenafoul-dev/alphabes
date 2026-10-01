import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { FichePreview } from "@/components/fiches/FicheParts";
import { FICHA_CATEGORIES, fichas, fichasInCategory, getFicha, type FichaCategoryGroup } from "@/lib/fichas-es";
import { absoluteUrl, alternatesFor } from "@/lib/i18n/routes";
import { buildBreadcrumbJsonLd } from "@/lib/json-ld";
import { spanishLetters } from "@/lib/letters-es";

const title = "Fichas para imprimir gratis: abecedario, letra cursiva y sílabas";
const description = `${fichas.length} fichas gratis en PDF para preescolar, kínder y primero de primaria: trazo de letras, letra cursiva en doble raya, sílabas, números en cuadrícula, figuras y colores.`;

export const worksheetsMetadataEs: Metadata = {
  title,
  description,
  alternates: alternatesFor("es", "/worksheets"),
  openGraph: { title, description, url: absoluteUrl("es", "/worksheets") },
};

const faq = [
  {
    question: "¿Las fichas son gratis de verdad?",
    answer: "Sí. Todas las fichas y todos los paquetes de esta página se descargan e imprimen gratis, sin crear una cuenta.",
  },
  {
    question: "¿En qué tamaño se imprimen?",
    answer:
      "Cada ficha es un PDF tamaño A4, listo para imprimir en blanco y negro. En impresoras con papel carta también sale bien: elige «ajustar a la página» si los márgenes se cortan. Para que la doble raya conserve sus medidas, imprime al 100 %.",
  },
  {
    question: "¿Qué letra cursiva usan?",
    answer:
      "Una cursiva escolar de modelo mexicano (Playwrite MX), con las letras ligadas como se aprenden en la escuela, sobre renglones de doble raya: las letras pequeñas ocupan el espacio entre la línea punteada y la base, y las mayúsculas y las letras altas llegan hasta la línea de arriba.",
  },
  {
    question: "¿Para qué edad son?",
    answer:
      "De los 3 a los 7 años, de preescolar a primero de primaria. Cada ficha indica su nivel: colorear y figuras para los más pequeños; cursiva, sílabas y palabras para kínder y primero.",
  },
];

function CategoryCard({ slug }: { slug: string }) {
  const c = FICHA_CATEGORIES.find((x) => x.slug === slug)!;
  const items = fichasInCategory(slug);
  return (
    <li>
      <Link
        href={{ pathname: "/worksheets/[category]", params: { category: c.slug } }}
        className="flex h-full gap-4 rounded-block border border-chalkboard/10 bg-paper p-4 shadow-block hover:border-crayon-blue hover:shadow-blockHover transition"
      >
        <div className="w-24 shrink-0">
          <FichePreview fiche={items[0]} locale="es" />
        </div>
        <div>
          <p className="font-display font-bold text-lg">{c.name}</p>
          <p className="mt-1 text-sm text-chalkboard/70">{c.description}</p>
          <p className="mt-2 text-xs font-bold text-chalkboard/60">
            {items.length} fichas · {c.level}
          </p>
        </div>
      </Link>
    </li>
  );
}

const inGroup = (group: FichaCategoryGroup) => FICHA_CATEGORIES.filter((c) => c.group === group);

export default function WorksheetsEs() {
  const url = absoluteUrl("es", "/worksheets");
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Inicio", url: absoluteUrl("es", "/") },
    { name: "Fichas", url },
  ]);
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((f) => ({ "@type": "Question", name: f.question, acceptedAnswer: { "@type": "Answer", text: f.answer } })),
  };
  const hero = getFicha("letra-a-cursiva")!;

  return (
    <main id="main-content" className="mx-auto max-w-6xl px-6 py-12">
      <nav aria-label="Ruta de navegación" className="text-sm text-chalkboard/60">
        <ol className="flex gap-2">
          <li><Link href="/">Inicio</Link> /</li>
          <li aria-current="page" className="font-bold">Fichas</li>
        </ol>
      </nav>

      <header className="mt-6 grid gap-8 md:grid-cols-[1fr_220px] md:items-center">
        <div>
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">Fichas para imprimir de preescolar y primero</h1>
          <p className="mt-4 text-lg text-chalkboard/70 max-w-2xl">
            {fichas.length} fichas gratis en PDF: las 27 letras en mayúscula, script y cursiva sobre doble raya, la
            primera sílaba de las palabras, una ficha de sílabas para cada consonante, los números en cuadrícula, las
            figuras y los colores. Imprime una ficha o un paquete completo de una vez.
          </p>
          <div className="mt-6 flex flex-wrap gap-4">
            <Link
              href={{ pathname: "/worksheets/[category]", params: { category: "silabas" } }}
              className="rounded-block bg-crayon-blue text-paper font-display font-bold px-6 py-3 shadow-block hover:shadow-blockHover transition-shadow"
            >
              Fichas de sílabas
            </Link>
            <Link
              href={{ pathname: "/worksheets/[category]", params: { category: "letra-cursiva" } }}
              className="rounded-block border-2 border-chalkboard/20 px-6 py-3 font-display font-bold hover:border-crayon-blue transition-colors"
            >
              Letra cursiva
            </Link>
            <Link
              href="/worksheets/bundles"
              className="rounded-block border-2 border-chalkboard/20 px-6 py-3 font-display font-bold hover:border-crayon-blue transition-colors"
            >
              Los paquetes en PDF
            </Link>
          </div>
        </div>
        <div className="hidden md:block">
          <FichePreview fiche={hero} eager locale="es" />
        </div>
      </header>

      <section className="mt-16" aria-labelledby="letters-heading">
        <h2 id="letters-heading" className="text-3xl font-bold">
          Las fichas de las letras
        </h2>
        <p className="mt-2 text-chalkboard/70 max-w-2xl">
          Seis fichas para cada una de las 27 letras, de colorear a los 3 años a escribir palabras en cursiva en primero.
        </p>
        <ul className="mt-6 grid md:grid-cols-2 gap-4">
          {inGroup("letras").map((c) => (
            <CategoryCard key={c.slug} slug={c.slug} />
          ))}
        </ul>
        <h3 className="mt-10 font-display font-bold text-xl">Todas las fichas de una letra</h3>
        <ul className="mt-4 flex flex-wrap gap-2">
          {spanishLetters.map((l) => (
            <li key={l.slug}>
              <Link
                href={{ pathname: "/worksheets/bundles/[bundleSlug]", params: { bundleSlug: `paquete-letra-${l.slug}` } }}
                aria-label={`Las fichas de la letra ${l.upper}`}
                className="letter-block bg-crayon-blue h-11 w-11 text-xl"
              >
                {l.upper}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-16" aria-labelledby="syllables-heading">
        <h2 id="syllables-heading" className="text-3xl font-bold">
          Las sílabas
        </h2>
        <p className="mt-2 text-chalkboard/70 max-w-2xl">
          Una ficha para cada consonante (ma, me, mi, mo, mu…) y para cada grupo de sílabas trabadas, en el orden del método
          silábico. Cada una acompaña su página de{" "}
          <Link href="/phonics" className="font-bold underline">
            sílabas
          </Link>
          , con sonido.
        </p>
        <ul className="mt-6 grid md:grid-cols-2 gap-4">
          {inGroup("silabas").map((c) => (
            <CategoryCard key={c.slug} slug={c.slug} />
          ))}
        </ul>
      </section>

      <section className="mt-16" aria-labelledby="themes-heading">
        <h2 id="themes-heading" className="text-3xl font-bold">
          Números, figuras, colores y palabras frecuentes
        </h2>
        <ul className="mt-6 grid md:grid-cols-2 gap-4">
          {inGroup("temas").map((c) => (
            <CategoryCard key={c.slug} slug={c.slug} />
          ))}
        </ul>
      </section>

      <section className="mt-16 rounded-block bg-crayon-purple/10 p-8" aria-labelledby="packs-heading">
        <h2 id="packs-heading" className="text-3xl font-bold">
          Imprimir todo de una vez
        </h2>
        <p className="mt-2 text-chalkboard/70 max-w-2xl">
          Los paquetes reúnen varias fichas en un solo PDF: todas las fichas de una letra, todo el abecedario en cursiva o el
          abecedario completo para el salón de clases.
        </p>
        <Link
          href="/worksheets/bundles"
          className="mt-6 inline-block rounded-block bg-crayon-purple text-white font-display font-bold px-5 py-2.5 shadow-block hover:shadow-blockHover transition"
        >
          Ver los paquetes
        </Link>
      </section>

      <section className="mt-16 max-w-3xl" aria-labelledby="faq-heading">
        <h2 id="faq-heading" className="text-3xl font-bold">
          Preguntas frecuentes
        </h2>
        <dl className="mt-6 space-y-6">
          {faq.map((f) => (
            <div key={f.question}>
              <dt className="font-display font-bold text-lg">{f.question}</dt>
              <dd className="mt-1 text-chalkboard/70">{f.answer}</dd>
            </div>
          ))}
        </dl>
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
    </main>
  );
}
