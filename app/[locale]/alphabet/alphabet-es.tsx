import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { absoluteUrl, alternatesFor } from "@/lib/i18n/routes";
import { buildBreadcrumbJsonLd } from "@/lib/json-ld";
import { TILDE_SLUG, letterWithWord, spanishLetters } from "@/lib/letters-es";

const title = "El abecedario para niños: las 27 letras, sus sonidos y palabras";
const description =
  "Aprende el abecedario en español de la A a la Z, con la Ñ: el nombre y el sonido de cada letra, sus sílabas, palabras con dibujos para escuchar y el trazo en letra script y cursiva.";

export const alphabetMetadataEs: Metadata = {
  title,
  description,
  alternates: alternatesFor("es", "/alphabet"),
  openGraph: { title, description, url: absoluteUrl("es", "/alphabet") },
};

const blockColors = ["bg-crayon-red", "bg-crayon-blue", "bg-crayon-green", "bg-crayon-yellow", "bg-crayon-purple"];

const cardClass =
  "group block h-full rounded-block border-2 border-chalkboard/10 bg-paper p-4 text-center shadow-block hover:border-crayon-blue hover:shadow-blockHover transition-colors motion-reduce:transition-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-crayon-blue";

const faqItems = [
  {
    question: "¿Cuántas letras tiene el abecedario en español?",
    answer:
      "27 letras: 5 vocales (a, e, i, o, u) y 22 consonantes, con la ñ entre la n y la o. La ch y la ll ya no se cuentan como letras desde 2010: son dígrafos, dos letras que juntas hacen un sonido, y se aprenden con las sílabas.",
  },
  {
    question: "¿Hay que aprender el nombre o el sonido de las letras?",
    answer:
      "Los dos, pero lo que permite leer es el sonido. En español se aprende a leer uniendo el sonido de una consonante con una vocal: m con a hace «ma». Por eso, en cada letra puedes escuchar su nombre y también sus sílabas.",
  },
  {
    question: "¿En qué orden se aprenden las letras?",
    answer:
      "No hace falta seguir el orden del abecedario. Muchas escuelas empiezan por las vocales y luego la m, la p, la s y la l, con las que pronto se leen palabras como mamá, papá, sopa o lulú. El orden alfabético se aprende aparte, con una canción.",
  },
  {
    question: "¿A qué edad se aprende el abecedario?",
    answer:
      "Hacia los 3 o 4 años, muchos niños reconocen las letras de su nombre. Entre los 4 y los 6 años, en preescolar y kínder, aprenden las vocales, las letras y las primeras sílabas. La lectura se afianza en primero de primaria.",
  },
  {
    question: "¿Letra script o cursiva?",
    answer:
      "Depende del país y de la escuela. En México se empieza casi siempre con la letra script (de molde) y la cursiva llega en primero o segundo de primaria; en Chile o en España se enseña antes la letra ligada. Aquí puedes practicar las dos.",
  },
];

export default function AlphabetEs() {
  const url = absoluteUrl("es", "/alphabet");

  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Inicio", url: absoluteUrl("es", "/") },
    { name: "Abecedario", url },
  ]);
  const learningResourceJsonLd = {
    "@context": "https://schema.org",
    "@type": "LearningResource",
    name: "El abecedario de la A a la Z",
    description,
    url,
    inLanguage: "es",
    educationalLevel: "Preescolar",
    learningResourceType: "Lesson",
    teaches: "Reconocer las letras, su nombre, su sonido y sus sílabas, y el trazo de las letras",
    typicalAgeRange: "3-6",
    isAccessibleForFree: true,
  };
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };

  return (
    <main id="main-content" className="mx-auto max-w-6xl px-6 py-12">
      <nav aria-label="Ruta de navegación" className="text-sm text-chalkboard/60">
        <ol className="flex gap-2">
          <li><Link href="/">Inicio</Link> /</li>
          <li aria-current="page" className="font-bold">Abecedario</li>
        </ol>
      </nav>

      <header className="mt-6 max-w-3xl">
        <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
          El abecedario de la A a la Z: las letras, sus sonidos y palabras para escuchar
        </h1>
        <p className="mt-4 text-lg text-chalkboard/70">
          Una lección para cada una de las 27 letras: la mayúscula, la minúscula y la cursiva, su
          nombre, su sonido y sus sílabas, palabras con dibujos para escuchar y una ficha de trazo.
          Para niños de 3 a 6 años, de preescolar a primero de primaria.
        </p>
        <div className="mt-6 flex flex-wrap gap-4">
          <Link
            href={{ pathname: "/alphabet/[letter]", params: { letter: "a" } }}
            className="rounded-block bg-crayon-blue text-paper font-display font-bold px-6 py-3 shadow-block hover:shadow-blockHover transition-shadow"
          >
            Empezar con la letra A
          </Link>
          <Link
            href="/flashcards"
            className="rounded-block border-2 border-chalkboard/20 px-6 py-3 font-display font-bold hover:border-crayon-blue transition-colors"
          >
            Ver las tarjetas
          </Link>
        </div>
      </header>

      <section className="mt-16" aria-labelledby="az-heading">
        <h2 id="az-heading" className="text-3xl font-bold">Las 27 letras</h2>
        <p className="mt-2 text-chalkboard/70 max-w-2xl">
          Toca una letra para abrir su lección. Debajo de cada letra está su nombre, como se dice en
          español.
        </p>
        <ul className="mt-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {spanishLetters.map((l, i) => {
            const [w1, w2] = l.words;
            return (
              <li key={l.slug}>
                <Link
                  href={{ pathname: "/alphabet/[letter]", params: { letter: l.slug } }}
                  aria-label={`La letra ${l.upper}: ${l.upper} como en ${w1.word.toLowerCase()} y ${w2.word.toLowerCase()}`}
                  className={cardClass}
                >
                  <span
                    className={`letter-block ${blockColors[i % blockColors.length]} mx-auto flex aspect-square w-16 items-center justify-center text-2xl`}
                    aria-hidden="true"
                  >
                    {l.upper}{l.lower}
                  </span>
                  <span className="mt-1 block text-xs text-chalkboard/60">«{l.name}»</span>
                  <span className="mt-2 block text-2xl" aria-hidden="true">
                    {w1.emoji}
                  </span>
                  <span className="mt-2 block font-display font-bold text-sm">{letterWithWord(l, w1)}</span>
                </Link>
              </li>
            );
          })}
        </ul>
        <p className="mt-6 text-chalkboard/70">
          ¿Y las vocales con tilde (á, é, í, ó, ú) y la ü?{" "}
          <Link
            href={{ pathname: "/alphabet/[letter]", params: { letter: TILDE_SLUG } }}
            className="font-display font-bold text-crayon-blue hover:underline"
          >
            La tilde y la diéresis →
          </Link>
        </p>
      </section>

      <section className="mt-16" aria-labelledby="name-sound-heading">
        <h2 id="name-sound-heading" className="text-3xl font-bold">El nombre, el sonido y las sílabas</h2>
        <div className="mt-4 grid gap-6 md:grid-cols-2">
          <p className="text-chalkboard/80">
            Cada letra tiene un <strong>nombre</strong> (la M se llama «eme») y un{" "}
            <strong>sonido</strong>, el que se oye al principio de mono. Para leer cuenta el sonido:
            la M y la A juntas se leen «ma», no «eme-a». Por eso, en cada letra puedes escuchar su
            nombre y sus sílabas: ma, me, mi, mo, mu.
          </p>
          <p className="text-chalkboard/80">
            Las cinco vocales siempre suenan igual. Algunas consonantes tienen dos sonidos, como la c
            de conejo y la de cereza, o la g de gato y la de girasol. La h no suena, y la b y la v
            suenan exactamente igual. Algunas letras tienen varios nombres según el país: la v puede
            ser «uve» o «ve chica», y la y, «ye» o «i griega».
          </p>
        </div>
      </section>

      <section className="mt-16 bg-crayon-green/10 rounded-block p-8" aria-labelledby="writing-heading">
        <h2 id="writing-heading" className="text-3xl font-bold">Mayúsculas, letra script y cursiva</h2>
        <p className="mt-2 text-chalkboard/70 max-w-2xl">
          Los niños se encuentran con la letra script (de molde) en los libros, escriben primero con
          ella y aprenden después la cursiva, la letra ligada. Cada letra tiene una ficha de trazo en
          la pantalla, en script o en cursiva, sobre las líneas de doble raya del cuaderno.
        </p>
        <Link
          href={{ pathname: "/alphabet/[letter]/worksheet", params: { letter: "a" } }}
          className="mt-6 inline-block rounded-block bg-chalkboard text-paper font-display font-bold px-5 py-2.5 shadow-block hover:shadow-blockHover transition-shadow"
        >
          Probar con la letra A
        </Link>
      </section>

      <section className="mt-16" aria-labelledby="howto-heading">
        <h2 id="howto-heading" className="text-3xl font-bold">Cómo ayudar a tu hijo a aprender las letras</h2>
        <ol className="mt-6 space-y-3 list-decimal list-inside text-chalkboard/80">
          <li>Empieza por las letras de su nombre: son las que más ganas tiene de conocer.</li>
          <li>Pocas letras a la vez son suficientes. Cinco minutos al día valen más que una sesión larga.</li>
          <li>Di el sonido de la letra mostrando una palabra que empiece con él: S de sol, ssss.</li>
          <li>Cuando conozca una consonante y las vocales, júntenlas: ma, me, mi, mo, mu. ¡Ya está leyendo!</li>
          <li>Busquen letras en todas partes: en los letreros, los empaques, los cuentos de la noche.</li>
          <li>
            Repasen a menudo las letras que ya vieron, por ejemplo con{" "}
            <Link href="/flashcards" className="font-bold underline">las tarjetas</Link>.
          </li>
        </ol>
      </section>

      <section className="mt-16 max-w-3xl" aria-labelledby="faq-heading">
        <h2 id="faq-heading" className="text-3xl font-bold">Preguntas frecuentes sobre el abecedario</h2>
        <dl className="mt-6 space-y-6">
          {faqItems.map((item) => (
            <div key={item.question}>
              <dt className="font-display font-bold text-lg">{item.question}</dt>
              <dd className="mt-1 text-chalkboard/70">{item.answer}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="mt-16 bg-chalkboard text-paper rounded-block p-10 text-center">
        <h2 className="text-3xl font-bold">¿Listos para empezar?</h2>
        <p className="mt-2 text-paper/70 max-w-xl mx-auto">
          Elige una letra, o mira las tarjetas para descubrir todas las palabras.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-4">
          <Link
            href={{ pathname: "/alphabet/[letter]", params: { letter: "a" } }}
            className="rounded-block bg-crayon-yellow text-chalkboard font-display font-bold px-6 py-3 shadow-block hover:shadow-blockHover transition-shadow"
          >
            Empezar con la A
          </Link>
          <Link
            href="/flashcards"
            className="rounded-block border-2 border-paper/40 px-6 py-3 font-display font-bold hover:border-paper transition-colors"
          >
            Las tarjetas
          </Link>
        </div>
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(learningResourceJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
    </main>
  );
}
