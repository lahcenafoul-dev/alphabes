import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { FicheCard, FichePreview, PdfButtons } from "@/components/fiches/FicheParts";
import {
  FICHE_CATEGORIES,
  ficheNeighbors,
  fichesForLetter,
  fichesInCategory,
  getFiche,
  getFicheCategory,
  getFichePack,
  type Fiche,
  type FicheCategory,
} from "@/lib/fiches-fr";
import { SITE_URL, absoluteUrl, alternatesFor } from "@/lib/i18n/routes";
import { buildBreadcrumbJsonLd } from "@/lib/json-ld";
import { getFrenchLetter } from "@/lib/letters-fr";
import { getFrenchSound } from "@/lib/sons-fr";

export function categoryMetadataFr(slug: string): Metadata {
  const url = absoluteUrl("fr", "/worksheets/[category]", { category: slug });
  const alternates = alternatesFor("fr", "/worksheets/[category]", { category: slug });
  const category = getFicheCategory(slug);
  if (category) {
    const title = `${category.name} : fiches gratuites à imprimer`;
    return { title, description: category.description, alternates, openGraph: { title, description: category.description, url } };
  }
  const fiche = getFiche(slug);
  if (!fiche) return {};
  const title = `${fiche.title} | Fiche PDF gratuite`;
  return { title, description: fiche.description, alternates, openGraph: { title, description: fiche.description, url, images: [SITE_URL + fiche.preview] } };
}

export default function CategoryFr({ slug }: { slug: string }) {
  const category = getFicheCategory(slug);
  if (category) return <CategoryView category={category} />;
  // The page only renders params listed by ficheCategoryParams().
  return <FicheView fiche={getFiche(slug)!} />;
}

function Breadcrumb({ items }: { items: { label: string; category?: string }[] }) {
  return (
    <nav aria-label="Fil d'Ariane" className="text-sm text-chalkboard/60 print:hidden">
      <ol className="flex flex-wrap gap-2">
        <li><Link href="/">Accueil</Link> /</li>
        <li><Link href="/worksheets">Fiches</Link> /</li>
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

function CategoryView({ category }: { category: FicheCategory }) {
  const items = fichesInCategory(category.slug);
  const pack = getFichePack(`pack-${category.slug}`);
  const url = absoluteUrl("fr", "/worksheets/[category]", { category: category.slug });
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Accueil", url: absoluteUrl("fr", "/") },
    { name: "Fiches", url: absoluteUrl("fr", "/worksheets") },
    { name: category.name, url },
  ]);
  const others = FICHE_CATEGORIES.filter((c) => c.slug !== category.slug);

  return (
    <main id="main-content" className="mx-auto max-w-6xl px-6 py-12">
      <Breadcrumb items={[{ label: category.name }]} />
      <h1 className="mt-4 text-4xl font-extrabold">{category.name} : fiches à imprimer</h1>
      <p className="mt-3 text-lg text-chalkboard/70 max-w-3xl">{category.intro}</p>
      <p className="mt-3 text-sm text-chalkboard/60">
        {items.length} fiches · {category.level} · {category.skills.join(", ")}
      </p>
      {pack && (
        <Link
          href={{ pathname: "/worksheets/bundles/[bundleSlug]", params: { bundleSlug: pack.slug } }}
          className="mt-6 inline-block rounded-block bg-crayon-purple text-white font-display font-bold px-5 py-2.5 shadow-block hover:shadow-blockHover transition"
        >
          Tout imprimer : le pack de {items.length} fiches →
        </Link>
      )}

      <ul className="mt-10 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        {items.map((f) => (
          <FicheCard key={f.slug} fiche={f} />
        ))}
      </ul>

      <section className="mt-16" aria-labelledby="other-heading">
        <h2 id="other-heading" className="text-2xl font-bold">
          Autres fiches
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

function FicheView({ fiche }: { fiche: Fiche }) {
  const category = getFicheCategory(fiche.category)!;
  const { prev, next } = ficheNeighbors(fiche.slug);
  const letter = fiche.letter ? getFrenchLetter(fiche.letter) : undefined;
  const sound = fiche.sound ? getFrenchSound(fiche.sound) : undefined;
  const siblings = letter ? fichesForLetter(letter.slug).filter((f) => f.slug !== fiche.slug) : [];
  const url = absoluteUrl("fr", "/worksheets/[category]", { category: fiche.slug });
  const fileName = `alphabes-${fiche.slug}.pdf`;

  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Accueil", url: absoluteUrl("fr", "/") },
    { name: "Fiches", url: absoluteUrl("fr", "/worksheets") },
    { name: category.name, url: absoluteUrl("fr", "/worksheets/[category]", { category: category.slug }) },
    { name: fiche.label, url },
  ]);
  const resourceJsonLd = {
    "@context": "https://schema.org",
    "@type": "LearningResource",
    name: fiche.title,
    description: fiche.description,
    url,
    inLanguage: "fr",
    educationalLevel: fiche.level,
    learningResourceType: "Worksheet",
    teaches: fiche.skills.join(", "),
    isAccessibleForFree: true,
    image: SITE_URL + fiche.preview,
    encoding: { "@type": "MediaObject", contentUrl: SITE_URL + fiche.pdf, encodingFormat: "application/pdf" },
  };

  return (
    <main id="main-content" className="mx-auto max-w-5xl px-6 py-12">
      <Breadcrumb items={[{ label: category.name, category: category.slug }, { label: fiche.label }]} />

      <div className="mt-6 grid gap-8 md:grid-cols-[1fr_300px]">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold">{fiche.title}</h1>
          <p className="mt-3 text-chalkboard/70">{fiche.description}</p>

          <dl className="mt-6 grid grid-cols-2 gap-3 text-sm">
            <InfoItem label="Niveau" value={fiche.level} />
            <InfoItem label="Type de fiche" value={category.name} />
          </dl>
          <ul className="mt-4 flex flex-wrap gap-2">
            {fiche.skills.map((s) => (
              <li key={s} className="rounded-full bg-crayon-blue/10 text-crayon-blue px-3 py-1 text-xs font-bold">
                {s}
              </li>
            ))}
          </ul>

          <section className="mt-6 rounded-block bg-crayon-yellow/15 p-5" aria-labelledby="consigne-heading">
            <h2 id="consigne-heading" className="font-display font-bold">
              La consigne
            </h2>
            <p className="mt-1 text-chalkboard/80">{fiche.consigne}</p>
          </section>

          <div className="mt-6">
            <PdfButtons pdf={fiche.pdf} fileName={fileName} />
          </div>
          <p className="mt-3 text-sm text-chalkboard/60">PDF A4 gratuit. Imprimez à 100 % (taille réelle) pour garder les bonnes dimensions des lignes.</p>

          {letter && (
            <p className="mt-6">
              <Link href={{ pathname: "/alphabet/[letter]", params: { letter: letter.slug } }} className="font-bold underline">
                La leçon sur la lettre {letter.upper}
              </Link>
              {fiche.category !== "trace-des-lettres" && (
                <>
                  {" · "}
                  <Link href={{ pathname: "/alphabet/[letter]/worksheet", params: { letter: letter.slug } }} className="font-bold underline">
                    Tracer la lettre à l&apos;écran
                  </Link>
                </>
              )}
            </p>
          )}
          {sound && (
            <p className="mt-6">
              <Link href={{ pathname: "/phonics/[skill]", params: { skill: sound.slug } }} className="font-bold underline">
                La page {sound.title.charAt(0).toLowerCase() + sound.title.slice(1)}, à écouter
              </Link>
            </p>
          )}
        </div>

        <div>
          <FichePreview fiche={fiche} eager />
        </div>
      </div>

      {letter && (
        <section className="mt-12" aria-labelledby="siblings-heading">
          <h2 id="siblings-heading" className="text-2xl font-bold">
            Les autres fiches de la lettre {letter.upper}
          </h2>
          <ul className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {siblings.map((f) => (
              <li key={f.slug}>
                <Link
                  href={{ pathname: "/worksheets/[category]", params: { category: f.slug } }}
                  className="block h-full rounded-block border border-chalkboard/10 bg-paper p-3 shadow-block hover:border-crayon-blue hover:shadow-blockHover transition"
                >
                  <FichePreview fiche={f} />
                  <p className="mt-2 text-center font-display font-bold text-sm">{getFicheCategory(f.category)!.name}</p>
                </Link>
              </li>
            ))}
          </ul>
          <Link
            href={{ pathname: "/worksheets/bundles/[bundleSlug]", params: { bundleSlug: `pack-lettre-${letter.slug}` } }}
            className="mt-4 inline-block font-display font-bold text-crayon-purple hover:underline"
          >
            Toutes les fiches de la lettre {letter.upper} en un seul PDF →
          </Link>
        </section>
      )}

      <nav aria-label="Fiche précédente et suivante" className="mt-12 flex justify-between gap-4 text-sm print:hidden">
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
