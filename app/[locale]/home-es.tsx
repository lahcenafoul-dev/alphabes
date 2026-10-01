import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Link } from "@/i18n/navigation";
import type { AppPathname } from "@/i18n/routing";
import { alternatesFor, isAvailable } from "@/lib/i18n/routes";

const title = "Aprender el abecedario: fichas y juegos gratis | AlphaBes";
const description =
  "Fichas gratis para imprimir, trazo de letras, sílabas y primeras lecturas para preescolar, kínder y primero de primaria. Lecciones y juegos interactivos para niños de 3 a 8 años.";

export const homeMetadataEs: Metadata = {
  title,
  description,
  alternates: alternatesFor("es", "/"),
  openGraph: { title, description, url: "https://alphabes.com/es", locale: "es_LA" },
};

// The 27 letters of the Spanish alphabet (ñ's page slug is "enie").
const letters = [..."abcdefghijklmn", "ñ", ..."opqrstuvwxyz"];
const letterSlug = (l: string) => (l === "ñ" ? "enie" : l);

const blockColors = [
  "bg-crayon-red",
  "bg-crayon-blue",
  "bg-crayon-yellow",
  "bg-crayon-green",
  "bg-crayon-purple",
];

const faq = [
  {
    question: "¿Para qué edad es AlphaBes?",
    answer:
      "AlphaBes es para niños de 3 a 8 años, de preescolar a segundo de primaria: desde reconocer las letras hasta leer sus primeras sílabas, palabras y cuentos.",
  },
  {
    question: "¿AlphaBes es gratis?",
    answer:
      "Sí. El plan gratis incluye las primeras lecciones del abecedario, una selección de fichas y algunos juegos. El plan Pro da acceso a todo el contenido.",
  },
  {
    question: "¿Hay que imprimir las fichas a color?",
    answer:
      "No. Todas las fichas se imprimen muy bien en blanco y negro, en la impresora de casa o en la copiadora de la escuela.",
  },
  {
    question: "¿Por qué aprender con sílabas?",
    answer:
      "En español se lee como se escribe, así que los niños aprenden a leer uniendo una consonante con una vocal: m con a hace «ma». Con ma, me, mi, mo, mu ya pueden leer mamá, mimo o mula. Es el método silábico que usan muchas escuelas de Latinoamérica y España.",
  },
];

/** A link when the Spanish page exists, otherwise plain content (pages arrive phase by phase). */
function MaybeLink({
  pathname,
  params,
  className,
  label,
  children,
}: {
  pathname: AppPathname;
  params?: Record<string, string>;
  className: string;
  label?: string;
  children: ReactNode;
}) {
  if (!isAvailable("es", pathname)) return <div className={className}>{children}</div>;
  const href = (params ? { pathname, params } : pathname) as Parameters<typeof Link>[0]["href"];
  return (
    <Link href={href} className={className} aria-label={label}>
      {children}
    </Link>
  );
}

export default function HomeEs() {
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    inLanguage: "es",
    mainEntity: faq.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
  const has = (pathname: AppPathname) => isAvailable("es", pathname);

  return (
    <main id="main-content">
      {/* Hero */}
      <section className="bg-chalkboard text-paper">
        <div className="mx-auto max-w-6xl px-6 py-16 md:py-24 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
              Aprender el abecedario jugando
            </h1>
            <p className="mt-5 text-lg md:text-xl text-paper/80 max-w-md">
              Las 27 letras, de la A a la Z con la Ñ, sus sílabas y su trazo, con fichas gratis
              para imprimir, sílabas para leer y juegos interactivos, de preescolar a primero de
              primaria.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/register"
                className="rounded-block bg-crayon-yellow text-chalkboard font-display font-bold px-6 py-3 shadow-block hover:shadow-blockHover transition"
              >
                Empezar gratis
              </Link>
              {has("/worksheets") && (
                <Link
                  href="/worksheets"
                  className="rounded-block border-2 border-paper/40 px-6 py-3 font-display font-bold hover:border-paper transition"
                >
                  Ver las fichas
                </Link>
              )}
            </div>
          </div>

          {/* Signature element: shelf of wooden alphabet blocks */}
          <div
            className="grid grid-cols-7 gap-2 md:gap-3"
            role="img"
            aria-label="Repisa de cubos de madera, de la A a la Z"
          >
            {letters.map((l) => (
              <div key={l} className="letter-block aspect-square text-xl md:text-2xl">
                {l.toUpperCase()}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 1. El abecedario */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="text-3xl font-bold">Descubre el abecedario</h2>
        <p className="mt-2 text-chalkboard/70 max-w-2xl">
          Cada letra tiene su propia lección: la mayúscula y la minúscula, su nombre y su
          sonido para escuchar, y palabras de ejemplo pensadas para los más pequeños.
        </p>
        <div className="mt-8 grid grid-cols-4 sm:grid-cols-6 md:grid-cols-9 gap-3">
          {letters.map((l, i) => (
            <MaybeLink
              key={l}
              pathname="/alphabet/[letter]"
              params={{ letter: letterSlug(l) }}
              className={`letter-block aspect-square text-lg ${blockColors[i % blockColors.length]}`}
              label={`Lección de la letra ${l.toUpperCase()}`}
            >
              {l.toUpperCase()}
            </MaybeLink>
          ))}
        </div>
      </section>

      {/* 2. Las sílabas */}
      <section className="bg-crayon-blue/10">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <h2 className="text-3xl font-bold">Aprende las sílabas</h2>
          <p className="mt-2 text-chalkboard/70 max-w-2xl">
            Paso a paso hacia la lectura: las vocales, las sílabas directas (ma, me, mi, mo,
            mu), luego las inversas, las trabadas como bra o pla, y los casos especiales: ch,
            ll, rr, que, gue y la h muda.
          </p>
          <div className="mt-8 grid sm:grid-cols-2 md:grid-cols-4 gap-4">
            {["Las vocales", "Sílabas directas", "Sílabas trabadas", "La h muda"].map((label) => (
              <MaybeLink
                key={label}
                pathname="/phonics"
                className="rounded-block bg-paper p-5 shadow-block hover:shadow-blockHover transition font-display font-bold"
              >
                {label}
              </MaybeLink>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Fichas gratis */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="text-3xl font-bold">Fichas del abecedario gratis</h2>
        <p className="mt-2 text-chalkboard/70 max-w-2xl">
          Fichas gratis para imprimir de todas las letras del abecedario, con la ñ: trazo,
          letra cursiva, colorear, reconocer letras, sílabas y primeras palabras. Están pensadas
          para mamás y papás, para la educación en casa y para maestras y maestros de preescolar
          y primaria que quieren una ficha lista para usar, sin preparación.
        </p>
        {has("/worksheets") && (
          <div className="mt-6 flex flex-wrap items-center gap-4">
            <Link
              href="/worksheets"
              className="inline-block rounded-block bg-crayon-green text-paper font-display font-bold px-6 py-3 shadow-block hover:shadow-blockHover transition"
            >
              Ver todas las fichas
            </Link>
            {has("/worksheets/bundles") && (
              <Link href="/worksheets/bundles" className="font-display font-bold text-crayon-purple hover:underline">
                Los paquetes en PDF →
              </Link>
            )}
          </div>
        )}
      </section>

      {/* 3b. Trazo y cursiva */}
      <section className="bg-crayon-green/10">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <h2 className="text-3xl font-bold">El trazo de las letras</h2>
          <p className="mt-2 text-chalkboard/70 max-w-2xl">
            Para cada letra, una ficha de trazo en letra script, mayúscula y minúscula, con
            líneas punteadas para seguir antes de escribir solos. Y para ir más lejos, fichas de
            letra cursiva en doble raya, como en el cuaderno de la escuela.
          </p>
          {has("/alphabet/[letter]/worksheet") && (
            <Link
              href={{ pathname: "/alphabet/[letter]/worksheet", params: { letter: "a" } }}
              className="mt-6 inline-block rounded-block bg-chalkboard text-paper font-display font-bold px-6 py-3 shadow-block hover:shadow-blockHover transition"
            >
              Trazar la letra A
            </Link>
          )}
        </div>
      </section>

      {/* 4. Juegos */}
      <section className="bg-crayon-yellow/15">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <h2 className="text-3xl font-bold">Juegos para aprender</h2>
          <p className="mt-2 text-chalkboard/70 max-w-2xl">
            Encontrar la letra, unir la letra con su dibujo, descubrir con qué sílaba empieza una
            palabra, trazar letras y aplaudir las sílabas: juegos cortos, con instrucciones que se
            pueden escuchar.
          </p>
          {has("/games") && (
            <Link
              href="/games"
              className="mt-6 inline-block rounded-block bg-chalkboard text-paper font-display font-bold px-6 py-3 shadow-block hover:shadow-blockHover transition"
            >
              Jugar
            </Link>
          )}
        </div>
      </section>

      {/* 4b. PDF */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="text-3xl font-bold">Fichas en PDF listas para imprimir</h2>
        <p className="mt-2 text-chalkboard/70 max-w-2xl">
          Cada ficha es un PDF listo para imprimir: la ves en la pantalla y la imprimes o la
          descargas con un clic. No necesitas cuenta para las fichas gratis: la maestra prepara
          las copias del grupo la noche anterior, y en casa imprimes una justo antes de salir.
        </p>
      </section>

      {/* 4c. Preescolar */}
      <section className="bg-crayon-purple/10">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <h2 className="text-3xl font-bold">Actividades para preescolar y kínder</h2>
          <p className="mt-2 text-chalkboard/70 max-w-2xl">
            Además de las fichas, AlphaBes tiene actividades, tarjetas con dibujos y juegos
            pensados para la atención de los más pequeños, de los 3 a los 6 años.
          </p>
          <div className="mt-6 grid sm:grid-cols-3 md:grid-cols-4 gap-4">
            {(
              [
                { pathname: "/preschool", label: "Preescolar (3 a 5 años)" },
                { pathname: "/kindergarten", label: "Kínder (5 a 6 años)" },
                { pathname: "/activities", label: "Actividades" },
                { pathname: "/flashcards", label: "Tarjetas con dibujos" },
              ] as const
            ).map((item) => (
              <MaybeLink
                key={item.pathname}
                pathname={item.pathname}
                className="rounded-block bg-paper p-5 shadow-block hover:shadow-blockHover transition font-display font-bold"
              >
                {item.label}
              </MaybeLink>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Espacio para familias */}
      <section className="mx-auto max-w-6xl px-6 py-16 grid md:grid-cols-2 gap-8 items-center">
        <div>
          <h2 className="text-3xl font-bold">Espacio para familias</h2>
          <p className="mt-2 text-chalkboard/70">
            Sigue el progreso de tu hijo o hija con el abecedario y las sílabas, mira las
            lecciones terminadas y descubre el siguiente paso recomendado.
          </p>
          <Link
            href="/dashboard"
            className="mt-6 inline-block rounded-block bg-crayon-blue text-paper font-display font-bold px-6 py-3 shadow-block hover:shadow-blockHover transition"
          >
            Ir a mi cuenta
          </Link>
        </div>
        <div className="rounded-block bg-chalkboard text-paper p-6 shadow-block">
          <p className="font-display font-bold text-lg">Esta semana</p>
          <ul className="mt-3 space-y-2 text-paper/80 text-sm">
            <li>12 lecciones terminadas</li>
            <li>Abecedario: 18 de 27 letras</li>
            <li>Sigue: la letra S y sus sílabas sa, se, si, so, su</li>
          </ul>
        </div>
      </section>

      {/* 6. Pro */}
      <section className="bg-chalkboard text-paper">
        <div className="mx-auto max-w-6xl px-6 py-16 text-center">
          <h2 className="text-3xl font-bold">AlphaBes Pro</h2>
          <p className="mt-2 text-paper/70 max-w-xl mx-auto">
            Desbloquea todas las fichas, todos los juegos y todas las lecciones de sílabas, con el
            seguimiento del progreso y paquetes de fichas para imprimir.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-6">
            <div className="rounded-block bg-paper text-chalkboard p-6 w-64 shadow-block">
              <p className="font-display font-bold text-xl">Mensual</p>
              <p className="mt-2 text-3xl font-extrabold">US$7.99<span className="text-base font-normal">/mes</span></p>
            </div>
            <div className="rounded-block bg-crayon-yellow text-chalkboard p-6 w-64 shadow-block">
              <p className="font-display font-bold text-xl">Anual</p>
              <p className="mt-2 text-3xl font-extrabold">US$59<span className="text-base font-normal">/año</span></p>
            </div>
          </div>
          <Link
            href="/pricing"
            className="mt-8 inline-block rounded-block bg-crayon-green px-6 py-3 font-display font-bold shadow-block hover:shadow-blockHover transition"
          >
            Ver todos los precios
          </Link>
        </div>
      </section>

      {/* 7. Preguntas frecuentes */}
      <section className="mx-auto max-w-3xl px-6 py-16">
        <h2 className="text-3xl font-bold">Preguntas frecuentes</h2>
        <dl className="mt-8 space-y-6">
          {faq.map((item) => (
            <div key={item.question}>
              <dt className="font-display font-bold text-lg">{item.question}</dt>
              <dd className="mt-1 text-chalkboard/70">{item.answer}</dd>
            </div>
          ))}
        </dl>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
    </main>
  );
}
