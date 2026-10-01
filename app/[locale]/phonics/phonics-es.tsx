import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { absoluteUrl, alternatesFor } from "@/lib/i18n/routes";
import { buildBreadcrumbJsonLd } from "@/lib/json-ld";
import { SYLLABLE_GROUPS, spanishSyllablePages } from "@/lib/silabas-es";

const title = "Las sílabas: aprender a leer en español con el método silábico";
const description =
  "Las vocales, las sílabas directas (ma, me, mi, mo, mu), inversas, mixtas y trabadas, y los casos especiales: ch, ll, rr, que, gue, güe, la h muda. Con palabras para escuchar, oraciones y juegos.";

export const phonicsMetadataEs: Metadata = {
  title,
  description,
  alternates: alternatesFor("es", "/phonics"),
  openGraph: { title, description, url: absoluteUrl("es", "/phonics") },
};

const steps = [
  { n: 1, title: "Oír las sílabas", blurb: "Aplaudir los pedacitos de las palabras: ma-ri-po-sa.", slug: "contar-silabas" },
  { n: 2, title: "Las vocales", blurb: "a, e, i, o, u: cinco sonidos que no cambian.", slug: "vocales" },
  { n: 3, title: "Las letras", blurb: "El nombre y el sonido de cada letra, de la A a la Z.", href: "/alphabet" as const },
  { n: 4, title: "Sílabas directas", blurb: "Una consonante y una vocal: ma, pe, si, lo, tu.", slug: "silabas-directas" },
  { n: 5, title: "Sílabas trabadas", blurb: "Dos consonantes juntas: bla, tra, gri.", slug: "trabadas-con-l" },
  { n: 6, title: "Leer de corrido", blurb: "Las palabras frecuentes y las primeras oraciones.", slug: "palabras-frecuentes" },
];

const faq = [
  {
    question: "¿Qué es el método silábico?",
    answer:
      "Es la forma más común de enseñar a leer en español: primero las vocales, después cada consonante con las cinco vocales (ma, me, mi, mo, mu), luego las sílabas inversas, mixtas y trabadas, y por último los casos especiales. Funciona muy bien porque en español las palabras se leen como se escriben.",
  },
  {
    question: "¿En qué orden se enseñan las consonantes?",
    answer:
      "Cada escuela tiene su orden, pero casi siempre se empieza por m, p, s, l y t, que con las vocales ya forman muchas palabras (mamá, papá, sopa, pelota). Las letras con dos sonidos (c, g, r) y la h llegan después. Si conoces el orden de la escuela de tu hijo, síguelo.",
  },
  {
    question: "¿A qué edad se aprende a leer?",
    answer:
      "Los juegos de oído y las vocales empiezan en preescolar, hacia los 4 o 5 años. La mayoría de los niños aprende a leer sílabas y palabras en primero de primaria, hacia los 6 años, y gana fluidez durante segundo.",
  },
  {
    question: "¿Cómo practicar en casa?",
    answer:
      "Diez minutos al día son suficientes. Repasen la página de la semana: escuchen las sílabas, lean las palabras y la oración, y jueguen al ejercicio. Después busquen esas sílabas en un cuento o en los letreros de la calle.",
  },
];

export default function PhonicsEs() {
  const url = absoluteUrl("es", "/phonics");
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Inicio", url: absoluteUrl("es", "/") },
    { name: "Sílabas", url },
  ]);
  const learningResourceJsonLd = {
    "@context": "https://schema.org",
    "@type": "LearningResource",
    name: "Las sílabas del español",
    description,
    url,
    inLanguage: "es",
    educationalLevel: "Preescolar y primero de primaria",
    learningResourceType: "Lesson",
    teaches: "Las vocales y las sílabas directas, inversas, mixtas y trabadas, y los sonidos especiales del español",
    typicalAgeRange: "4-7",
    isAccessibleForFree: true,
  };
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };

  return (
    <main id="main-content" className="mx-auto max-w-6xl px-6 py-12">
      <nav aria-label="Ruta de navegación" className="text-sm text-chalkboard/60">
        <ol className="flex gap-2">
          <li><Link href="/">Inicio</Link> /</li>
          <li aria-current="page" className="font-bold">Sílabas</li>
        </ol>
      </nav>

      <header className="mt-6 max-w-3xl">
        <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
          Las sílabas: aprender a leer paso a paso
        </h1>
        <p className="mt-4 text-lg text-chalkboard/70">
          En español se aprende a leer uniendo sonidos: primero las vocales, después las sílabas
          (ma, me, mi, mo, mu), luego las trabadas y los casos especiales, como la ch, la rr o la h
          que no suena. Cada página se escucha en voz alta, con palabras con dibujos, una oración
          para leer y un juego.
        </p>
        <div className="mt-6 flex flex-wrap gap-4">
          <Link
            href={{ pathname: "/phonics/[skill]", params: { skill: "vocales" } }}
            className="rounded-block bg-crayon-blue text-paper font-display font-bold px-6 py-3 shadow-block hover:shadow-blockHover transition-shadow"
          >
            Empezar con las vocales
          </Link>
          <Link
            href={{ pathname: "/phonics/[skill]", params: { skill: "silabas-directas" } }}
            className="rounded-block border-2 border-chalkboard/20 px-6 py-3 font-display font-bold hover:border-crayon-blue transition-colors"
          >
            Formar sílabas
          </Link>
        </div>
      </header>

      <section className="mt-16" aria-labelledby="path-heading">
        <h2 id="path-heading" className="text-3xl font-bold">
          El camino de la lectura
        </h2>
        <p className="mt-2 text-chalkboard/70 max-w-2xl">
          Los pasos van más o menos en este orden, de preescolar a primero de primaria. Cada niño
          avanza a su ritmo.
        </p>
        <ol className="mt-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {steps.map((step) => (
            <li key={step.n}>
              <Link
                href={step.href ?? { pathname: "/phonics/[skill]", params: { skill: step.slug! } }}
                className="block h-full rounded-block border border-chalkboard/10 bg-paper p-4 shadow-block hover:border-crayon-blue hover:shadow-blockHover transition-colors"
              >
                <span className="letter-block bg-crayon-purple flex h-10 w-10 items-center justify-center text-base" aria-hidden="true">
                  {step.n}
                </span>
                <p className="mt-3 font-display font-bold text-sm">{step.title}</p>
                <p className="mt-1 text-xs text-chalkboard/70">{step.blurb}</p>
              </Link>
            </li>
          ))}
        </ol>
      </section>

      {SYLLABLE_GROUPS.map((group) => (
        <section key={group.id} className="mt-16" aria-labelledby={`group-${group.id}`}>
          <h2 id={`group-${group.id}`} className="text-3xl font-bold">
            {group.title}
          </h2>
          <p className="mt-2 text-chalkboard/70 max-w-2xl">{group.blurb}</p>
          <ul className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {spanishSyllablePages
              .filter((p) => p.group === group.id)
              .map((p) => (
                <li key={p.slug}>
                  <Link
                    href={{ pathname: "/phonics/[skill]", params: { skill: p.slug } }}
                    className="flex h-full gap-4 rounded-block border border-chalkboard/10 bg-paper p-4 shadow-block hover:border-crayon-blue hover:shadow-blockHover transition-colors"
                  >
                    <span className="letter-block bg-crayon-blue h-14 min-w-14 px-2 text-2xl shrink-0" aria-hidden="true">
                      {p.short}
                    </span>
                    <span>
                      <span className="block font-display font-bold">{p.title}</span>
                      <span className="mt-1 block text-sm text-chalkboard/70">{p.summary}</span>
                      <span className="mt-2 inline-block rounded-full bg-crayon-yellow/25 px-2 py-0.5 text-xs font-bold">
                        {p.level}
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
          </ul>
        </section>
      ))}

      <section className="mt-16 bg-crayon-yellow/15 rounded-block p-8" aria-labelledby="tips-heading">
        <h2 id="tips-heading" className="text-3xl font-bold">
          Consejos para mamá y papá
        </h2>
        <ol className="mt-6 space-y-3 list-decimal list-inside text-chalkboard/80 max-w-3xl">
          <li>Una consonante a la vez: quédense varios días con ma, me, mi, mo, mu antes de pasar a la siguiente.</li>
          <li>Di el sonido, no el nombre de la letra: «mmm» y no «eme».</li>
          <li>Aplaudan las sílabas de las palabras: to-ma-te, tres palmadas.</li>
          <li>Repasen a menudo lo que ya aprendieron, sobre todo los pares que se parecen (pato y plato, pero y perro).</li>
          <li>Sesiones cortas y alegres: diez minutos están muy bien.</li>
          <li>
            Si todavía duda con alguna letra, repásenla en su página del{" "}
            <Link href="/alphabet" className="font-bold underline">
              abecedario
            </Link>
            .
          </li>
        </ol>
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

      <section className="mt-16 bg-chalkboard text-paper rounded-block p-10 text-center">
        <h2 className="text-3xl font-bold">¿Listos para leer?</h2>
        <p className="mt-2 text-paper/70 max-w-xl mx-auto">
          Empiecen con las vocales, o repasen antes las letras del abecedario.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-4">
          <Link
            href={{ pathname: "/phonics/[skill]", params: { skill: "vocales" } }}
            className="rounded-block bg-crayon-yellow text-chalkboard font-display font-bold px-6 py-3 shadow-block hover:shadow-blockHover transition-shadow"
          >
            Las vocales
          </Link>
          <Link
            href="/alphabet"
            className="rounded-block border-2 border-paper/40 px-6 py-3 font-display font-bold hover:border-paper transition-colors"
          >
            El abecedario
          </Link>
        </div>
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(learningResourceJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
    </main>
  );
}
