import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import ListenButton from "@/components/ListenButton";
import { absoluteUrl, alternatesFor } from "@/lib/i18n/routes";
import { buildBreadcrumbJsonLd } from "@/lib/json-ld";
import { TILDE_SLUG, tildeGroups } from "@/lib/letters-es";

const title = "La tilde y la diéresis: á, é, í, ó, ú y ü explicadas a los niños";
const description =
  "Qué es la tilde y para qué sirve (mamá, café, avión), la tilde que distingue palabras (tú y tu) y la diéresis de pingüino, explicadas para niños y familias.";

export const tildeMetadataEs: Metadata = {
  title,
  description,
  alternates: alternatesFor("es", "/alphabet/[letter]", { letter: TILDE_SLUG }),
  openGraph: { title, description, url: absoluteUrl("es", "/alphabet/[letter]", { letter: TILDE_SLUG }) },
};

const faq = [
  {
    question: "¿La á es una letra distinta de la a?",
    answer:
      "No. El abecedario tiene 27 letras y las vocales con tilde no son letras nuevas: á se lee igual que a. La tilde solo indica qué sílaba se dice con más fuerza. La ñ, en cambio, sí es una letra propia.",
  },
  {
    question: "¿A qué edad se aprende a poner la tilde?",
    answer:
      "En preescolar los niños la ven en su nombre o en palabras como mamá y papá. Las reglas para saber cuándo se escribe se estudian en primaria, hacia segundo o tercer grado, cuando ya separan bien las sílabas.",
  },
  {
    question: "¿Las mayúsculas llevan tilde?",
    answer:
      "Sí. La RAE indica que las mayúsculas llevan tilde igual que las minúsculas: ÁRBOL, MÉXICO, ÁFRICA. Ayuda a leer bien la palabra.",
  },
];

export default function TildeEs() {
  const url = absoluteUrl("es", "/alphabet/[letter]", { letter: TILDE_SLUG });

  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Inicio", url: absoluteUrl("es", "/") },
    { name: "Abecedario", url: absoluteUrl("es", "/alphabet") },
    { name: "La tilde y la diéresis", url },
  ]);
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
    <main id="main-content" className="mx-auto max-w-4xl px-6 py-12">
      <nav aria-label="Ruta de navegación" className="text-sm text-chalkboard/60">
        <ol className="flex flex-wrap gap-2">
          <li><Link href="/">Inicio</Link> /</li>
          <li><Link href="/alphabet">Abecedario</Link> /</li>
          <li aria-current="page" className="font-bold">La tilde y la diéresis</li>
        </ol>
      </nav>

      <h1 className="mt-6 text-4xl font-extrabold">La tilde y la diéresis</h1>
      <p className="mt-4 text-lg text-chalkboard/80 max-w-2xl">
        En español, los signos sobre las vocales no crean letras nuevas ni cambian su sonido: la á
        suena igual que la a. Sirven para saber qué sílaba se dice con más fuerza, para distinguir
        algunas palabras, y para que la u suene en pingüino.
      </p>

      <div className="mt-10 space-y-6">
        {tildeGroups.map((group) => (
          <article key={group.id} className="rounded-block border border-chalkboard/10 bg-paper p-6 shadow-block">
            <div className="flex flex-wrap items-baseline gap-4">
              <span className="font-display text-4xl font-extrabold text-crayon-blue" aria-hidden="true">
                {group.marks}
              </span>
              <h2 className="font-display text-xl font-bold">{group.title}</h2>
            </div>
            <p className="mt-2 text-chalkboard/80">{group.explanation}</p>
            <ul className="mt-4 flex flex-wrap gap-3">
              {group.examples.map((ex) => (
                <li key={ex.text}>
                  <ListenButton
                    locale="es"
                    text={ex.text}
                    ariaLabel={`Escuchar: ${ex.text}`}
                    className="inline-flex items-center gap-2 rounded-block border border-chalkboard/15 px-4 py-2 font-display font-bold hover:border-crayon-blue transition-colors"
                  >
                    <span aria-hidden="true">{ex.emoji}</span> {ex.text} <span aria-hidden="true">🔊</span>
                  </ListenButton>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>

      <section className="mt-10 rounded-block bg-crayon-purple/10 p-6" aria-labelledby="enie-heading">
        <h2 id="enie-heading" className="text-2xl font-bold">
          ¿Y la ñ?
        </h2>
        <p className="mt-2 text-chalkboard/80">
          La rayita ondulada de la ñ no es una tilde de acento: se llama virgulilla, y la ñ es una
          letra propia del abecedario, con su sonido, entre la n y la o.
        </p>
        <Link
          href={{ pathname: "/alphabet/[letter]", params: { letter: "enie" } }}
          className="mt-4 inline-block font-display font-bold text-crayon-blue hover:underline"
        >
          La letra Ñ →
        </Link>
      </section>

      <section className="mt-12" aria-labelledby="faq-heading">
        <h2 id="faq-heading" className="text-2xl font-bold">
          Preguntas frecuentes
        </h2>
        <dl className="mt-4 space-y-5">
          {faq.map((f) => (
            <div key={f.question}>
              <dt className="font-display font-bold">{f.question}</dt>
              <dd className="mt-1 text-chalkboard/70">{f.answer}</dd>
            </div>
          ))}
        </dl>
      </section>

      <p className="mt-12">
        <Link href="/alphabet" className="font-display font-bold text-crayon-blue hover:underline">
          ← Volver al abecedario
        </Link>
      </p>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
    </main>
  );
}
