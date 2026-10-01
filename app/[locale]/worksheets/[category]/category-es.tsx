import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { FicheCard, FichePreview, PdfButtons } from "@/components/fiches/FicheParts";
import {
  FICHA_CATEGORIES,
  fichaNeighbors,
  fichasForLetter,
  fichasInCategory,
  getFicha,
  getFichaCategory,
  getFichaPack,
  getSyllableSheet,
  type Ficha,
  type FichaCategory,
} from "@/lib/fichas-es";
import { SITE_URL, absoluteUrl, alternatesFor } from "@/lib/i18n/routes";
import { buildBreadcrumbJsonLd } from "@/lib/json-ld";
import { getSpanishLetter } from "@/lib/letters-es";
import { getSpanishSyllablePage } from "@/lib/silabas-es";

export function categoryMetadataEs(slug: string): Metadata {
  const url = absoluteUrl("es", "/worksheets/[category]", { category: slug });
  const alternates = alternatesFor("es", "/worksheets/[category]", { category: slug });
  const category = getFichaCategory(slug);
  if (category) {
    const title = `${category.name}: fichas gratis para imprimir`;
    return { title, description: category.description, alternates, openGraph: { title, description: category.description, url } };
  }
  const ficha = getFicha(slug);
  if (!ficha) return {};
  const title = `${ficha.title} | Ficha PDF gratis`;
  return { title, description: ficha.description, alternates, openGraph: { title, description: ficha.description, url, images: [SITE_URL + ficha.preview] } };
}

export default function CategoryEs({ slug }: { slug: string }) {
  const category = getFichaCategory(slug);
  if (category) return <CategoryView category={category} />;
  // The page only renders params listed by fichaCategoryParams().
  return <FichaView ficha={getFicha(slug)!} />;
}

function Breadcrumb({ items }: { items: { label: string; category?: string }[] }) {
  return (
    <nav aria-label="Ruta de navegación" className="text-sm text-chalkboard/60 print:hidden">
      <ol className="flex flex-wrap gap-2">
        <li><Link href="/">Inicio</Link> /</li>
        <li><Link href="/worksheets">Fichas</Link> /</li>
        {items.map((item, i) =>
          i < items.length - 1 && item.category ? (
            <li key={item.label}>
              <Link href={{ pathname: "/worksheets/[category]", params: { category: item.category } }}>{item.label}</Link> /
            </li>
          ) : (
            <li key={item.label} aria-current="page" className="font-bold">
              {item.label}
            </li>
          ),
        )}
      </ol>
    </nav>
  );
}

function CategoryView({ category }: { category: FichaCategory }) {
  const items = fichasInCategory(category.slug);
  const pack = getFichaPack(`paquete-${category.slug}`);
  const url = absoluteUrl("es", "/worksheets/[category]", { category: category.slug });
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Inicio", url: absoluteUrl("es", "/") },
    { name: "Fichas", url: absoluteUrl("es", "/worksheets") },
    { name: category.name, url },
  ]);
  const others = FICHA_CATEGORIES.filter((c) => c.slug !== category.slug);

  return (
    <main id="main-content" className="mx-auto max-w-6xl px-6 py-12">
      <Breadcrumb items={[{ label: category.name }]} />
      <h1 className="mt-4 text-4xl font-extrabold">{category.name}: fichas para imprimir</h1>
      <p className="mt-3 text-lg text-chalkboard/70 max-w-3xl">{category.intro}</p>
      <p className="mt-3 text-sm text-chalkboard/60">
        {items.length} fichas · {category.level} · {category.skills.join(", ")}
      </p>
      {pack && (
        <Link
          href={{ pathname: "/worksheets/bundles/[bundleSlug]", params: { bundleSlug: pack.slug } }}
          className="mt-6 inline-block rounded-block bg-crayon-purple text-white font-display font-bold px-5 py-2.5 shadow-block hover:shadow-blockHover transition"
        >
          Imprimir todo: el paquete de {items.length} fichas →
        </Link>
      )}

      <ul className="mt-10 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        {items.map((f) => (
          <FicheCard key={f.slug} fiche={f} locale="es" />
        ))}
      </ul>

      <section className="mt-16" aria-labelledby="other-heading">
        <h2 id="other-heading" className="text-2xl font-bold">
          Otras fichas
        </h2>
        <ul className="mt-4 flex flex-wrap gap-2">
          {others.map((c) => (
            <li key={c.slug}>
              <Link
                href={{ pathname: "/worksheets/[category]", params: { category: c.slug } }}
                className="inline-block rounded-block border border-chalkboard/15 px-4 py-2 font-display font-bold text-sm hover:border-crayon-blue transition-colors"
              >
                {c.name}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
    </main>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-block bg-chalkboard/5 p-3">
      <dt className="text-xs text-chalkboard/60">{label}</dt>
      <dd className="font-display font-bold">{value}</dd>
    </div>
  );
}

function FichaView({ ficha }: { ficha: Ficha }) {
  const category = getFichaCategory(ficha.category)!;
  const { prev, next } = fichaNeighbors(ficha.slug);
  const letter = ficha.letter ? getSpanishLetter(ficha.letter) : undefined;
  const syllablePages = ficha.syllables ? getSyllableSheet(ficha.syllables)!.pages.map((p) => getSpanishSyllablePage(p)!) : [];
  const siblings = letter ? fichasForLetter(letter.slug).filter((f) => f.slug !== ficha.slug) : [];
  const url = absoluteUrl("es", "/worksheets/[category]", { category: ficha.slug });

  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Inicio", url: absoluteUrl("es", "/") },
    { name: "Fichas", url: absoluteUrl("es", "/worksheets") },
    { name: category.name, url: absoluteUrl("es", "/worksheets/[category]", { category: category.slug }) },
    { name: ficha.label, url },
  ]);
  const resourceJsonLd = {
    "@context": "https://schema.org",
    "@type": "LearningResource",
    name: ficha.title,
    description: ficha.description,
    url,
    inLanguage: "es",
    educationalLevel: ficha.level,
    learningResourceType: "Worksheet",
    teaches: ficha.skills.join(", "),
    isAccessibleForFree: true,
    image: SITE_URL + ficha.preview,
    encoding: { "@type": "MediaObject", contentUrl: SITE_URL + ficha.pdf, encodingFormat: "application/pdf" },
  };

  return (
    <main id="main-content" className="mx-auto max-w-5xl px-6 py-12">
      <Breadcrumb items={[{ label: category.name, category: category.slug }, { label: ficha.label }]} />

      <div className="mt-6 grid gap-8 md:grid-cols-[1fr_300px]">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold">{ficha.title}</h1>
          <p className="mt-3 text-chalkboard/70">{ficha.description}</p>

          <dl className="mt-6 grid grid-cols-2 gap-3 text-sm">
            <InfoItem label="Nivel" value={ficha.level} />
            <InfoItem label="Tipo de ficha" value={category.name} />
          </dl>
          <ul className="mt-4 flex flex-wrap gap-2">
            {ficha.skills.map((s) => (
              <li key={s} className="rounded-full bg-crayon-blue/10 text-crayon-blue px-3 py-1 text-xs font-bold">
                {s}
              </li>
            ))}
          </ul>

          <section className="mt-6 rounded-block bg-crayon-yellow/15 p-5" aria-labelledby="consigna-heading">
            <h2 id="consigna-heading" className="font-display font-bold">
              La consigna
            </h2>
            <p className="mt-1 text-chalkboard/80">{ficha.consigna}</p>
          </section>

          <div className="mt-6">
            <PdfButtons pdf={ficha.pdf} fileName={`alphabes-${ficha.slug}.pdf`} locale="es" />
          </div>
          <p className="mt-3 text-sm text-chalkboard/60">
            PDF A4 gratis. Imprime al 100 % (tamaño real) para que los renglones conserven sus medidas.
          </p>

          {letter && (
            <p className="mt-6">
              <Link href={{ pathname: "/alphabet/[letter]", params: { letter: letter.slug } }} className="font-bold underline">
                La lección de la letra {letter.upper}
              </Link>
              {ficha.category !== "trazo-de-letras" && (
                <>
                  {" · "}
                  <Link href={{ pathname: "/alphabet/[letter]/worksheet", params: { letter: letter.slug } }} className="font-bold underline">
                    Trazar la letra en la pantalla
                  </Link>
                </>
              )}
            </p>
          )}
          {syllablePages.length > 0 && (
            <p className="mt-6">
              {syllablePages.map((p, i) => (
                <span key={p.slug}>
                  {i > 0 && " · "}
                  <Link href={{ pathname: "/phonics/[skill]", params: { skill: p.slug } }} className="font-bold underline">
                    {p.title}, para escuchar
                  </Link>
                </span>
              ))}
            </p>
          )}
        </div>

        <div>
          <FichePreview fiche={ficha} eager locale="es" />
        </div>
      </div>

      {letter && (
        <section className="mt-12" aria-labelledby="siblings-heading">
          <h2 id="siblings-heading" className="text-2xl font-bold">
            Las otras fichas de la letra {letter.upper}
          </h2>
          <ul className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {siblings.map((f) => (
              <li key={f.slug}>
                <Link
                  href={{ pathname: "/worksheets/[category]", params: { category: f.slug } }}
                  className="block h-full rounded-block border border-chalkboard/10 bg-paper p-3 shadow-block hover:border-crayon-blue hover:shadow-blockHover transition"
                >
                  <FichePreview fiche={f} locale="es" />
                  <p className="mt-2 text-center font-display font-bold text-sm">{getFichaCategory(f.category)!.name}</p>
                </Link>
              </li>
            ))}
          </ul>
          <Link
            href={{ pathname: "/worksheets/bundles/[bundleSlug]", params: { bundleSlug: `paquete-letra-${letter.slug}` } }}
            className="mt-4 inline-block font-display font-bold text-crayon-purple hover:underline"
          >
            Todas las fichas de la letra {letter.upper} en un solo PDF →
          </Link>
        </section>
      )}

      <nav aria-label="Ficha anterior y siguiente" className="mt-12 flex justify-between gap-4 text-sm print:hidden">
        {prev ? (
          <Link href={{ pathname: "/worksheets/[category]", params: { category: prev.slug } }} className="font-display font-bold">
            ← {prev.label}
          </Link>
        ) : (
          <span />
        )}
        <Link href={{ pathname: "/worksheets/[category]", params: { category: category.slug } }} className="font-display font-bold">
          {category.name}
        </Link>
        {next ? (
          <Link href={{ pathname: "/worksheets/[category]", params: { category: next.slug } }} className="font-display font-bold text-right">
            {next.label} →
          </Link>
        ) : (
          <span />
        )}
      </nav>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(resourceJsonLd) }} />
    </main>
  );
}
