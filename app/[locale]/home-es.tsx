import type { Metadata } from "next";
import OwlHome, { type HomeCopy } from "@/components/home/OwlHome";
import type { ReactNode } from "react";
import { Link } from "@/i18n/navigation";
import type { AppPathname } from "@/i18n/routing";
import { alternatesFor, isAvailable } from "@/lib/i18n/routes";
import { FicheCard } from "@/components/fiches/FicheParts";
import { getFicha } from "@/lib/fichas-es";
import { spanishGames } from "@/lib/juegos-es";
import { IconTile } from "@/components/UiIcon";

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
  "text-owl-purple",
  "text-[#C2185B]",
  "text-owl-green-dark",
  "text-[#B9520E]",
  "text-owl-ink",
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

// Los textos del diseño «Owl Quiz» (components/home/OwlHome.tsx).
const copy: HomeCopy = {
  nav: { games: "Juegos", worksheets: "Fichas", stories: "Cuentos", parents: "Familias", join: "Regístrate gratis" },
  headline: { seo: "Aprender el abecedario: fichas y juegos gratis", line1: "Pequeños curiosos,", big: "gran", after: "." },
  intro:
    "Nuestro búho amigo acompaña a niñas y niños de 3 a 8 años por las letras, los sonidos y las primeras palabras, jugando pregunta a pregunta.",
  play: "Jugar gratis",
  howItWorks: "Mira cómo funciona",
  speaks: "Habla",
  quiz: {
    label: "El quiz del búho",
    question: "¿Qué dibujo empieza con esta letra?",
    roundLabel: "Pregunta {n} de {total}",
    allDone: "¡Listo!",
    stars: "Estrellas: {score}",
    hearLetter: "Escuchar la letra {letter}",
    hint: "Toca la letra para escucharla y elige un dibujo.",
    right: "¡Sí! {word} empieza con {letter}.",
    next: "Siguiente",
    wrong: "¡Casi! Escucha otra vez y prueba con otro.",
    tryAgainSpoken: "Inténtalo otra vez",
    finalTitle: "¡Uh, uh! Eres una estrella de las letras.",
    playAgain: "Jugar otra vez",
  },
  features: {
    title: "Todo lo que necesita un pequeño lector",
    intro: "Juegos en la pantalla, fichas en papel y cuentos antes de dormir.",
    letters: ["Letras y sonidos", "El nombre y el sonido de cada letra, bien claritos."],
    tracing: ["El trazo", "Traza cada letra con el dedo, trazo a trazo."],
    worksheets: ["Fichas", "Fichas de trazo, para colorear y de números, listas para imprimir."],
    stories: ["Cuentos", "Cuentos cortos con dibujos para leer juntos."],
  },
  path: {
    title: "Un camino claro de la A a la Z",
    steps: [
      ["Conocer la letra", "Su nombre, su sonido y una palabra con dibujo."],
      ["Jugar un juego corto", "Preguntas para ver que ya lo aprendió."],
      ["Trazar e imprimir", "Practicar la escritura en la pantalla y en papel."],
      ["Leer un cuento", "Usar las letras nuevas."],
    ],
  },
  parents: {
    title: "Pensado también para las familias",
    text: "Un perfil para cada niño, su progreso de un vistazo y la siguiente ficha lista para imprimir.",
    cta: "Crear una cuenta gratis",
  },
  footer: { ages: "© AlphaBes · De 3 a 8 años", languages: "Idiomas", legal: "Sobre AlphaBes" },
};

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
    <OwlHome locale="es" copy={copy}>
      {/* Intro: the text of the former hero */}
      <section className="mx-auto max-w-[1200px] px-4 sm:px-6 py-16">
        <h2 className="text-3xl md:text-4xl font-extrabold leading-tight">Aprender el abecedario jugando</h2>
        <p className="mt-3 text-lg leading-relaxed text-owl-muted max-w-2xl">
          Las 27 letras, de la A a la Z con la Ñ, sus sílabas y su trazo, con fichas gratis
          para imprimir, sílabas para leer y juegos interactivos, de preescolar a primero de
          primaria.
        </p>
        {has("/worksheets") && (
          <Link href="/worksheets" className="mt-6 owl-btn owl-btn-purple">
            Ver las fichas
          </Link>
        )}
      </section>

      {/* 1. El abecedario */}
      <section className="mx-auto max-w-[1200px] px-4 sm:px-6 py-16">
        <h2 className="text-3xl md:text-4xl font-extrabold leading-tight">Descubre el abecedario</h2>
        <p className="mt-3 text-lg leading-relaxed text-owl-muted max-w-2xl">
          Cada letra tiene su propia lección: la mayúscula y la minúscula, su nombre y su
          sonido para escuchar, y palabras de ejemplo pensadas para los más pequeños.
        </p>
        <div className="mt-8 grid grid-cols-4 sm:grid-cols-6 md:grid-cols-9 gap-3">
          {letters.map((l, i) => (
            <MaybeLink
              key={l}
              pathname="/alphabet/[letter]"
              params={{ letter: letterSlug(l) }}
              className={`owl-letter aspect-square text-3xl md:text-4xl ${blockColors[i % blockColors.length]}`}
              label={`Lección de la letra ${l.toUpperCase()}`}
            >
              {l.toUpperCase()}
            </MaybeLink>
          ))}
        </div>
      </section>

      {/* 2. Las sílabas */}
      <section className="bg-white">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6 py-16">
          <h2 className="text-3xl md:text-4xl font-extrabold leading-tight">Aprende las sílabas</h2>
          <p className="mt-3 text-lg leading-relaxed text-owl-muted max-w-2xl">
            Paso a paso hacia la lectura: las vocales, las sílabas directas (ma, me, mi, mo,
            mu), luego las inversas, las trabadas como bra o pla, y los casos especiales: ch,
            ll, rr, que, gue y la h muda.
          </p>
          <div className="mt-8 grid sm:grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Las vocales", skill: "vocales" },
              { label: "Sílabas directas", skill: "silabas-directas" },
              { label: "Sílabas trabadas", skill: "trabadas-con-l" },
              { label: "La h muda", skill: "h-muda" },
            ].map((item) => (
              <MaybeLink
                key={item.skill}
                pathname="/phonics/[skill]"
                params={{ skill: item.skill }}
                className="owl-card"
              >
                {item.label}
              </MaybeLink>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Fichas gratis */}
      <section className="mx-auto max-w-[1200px] px-4 sm:px-6 py-16">
        <h2 className="text-3xl md:text-4xl font-extrabold leading-tight">Fichas del abecedario gratis</h2>
        <p className="mt-3 text-lg leading-relaxed text-owl-muted max-w-2xl">
          Fichas gratis para imprimir de todas las letras del abecedario, con la ñ: trazo,
          letra cursiva, colorear, reconocer letras, sílabas y primeras palabras. Están pensadas
          para mamás y papás, para la educación en casa y para maestras y maestros de preescolar
          y primaria que quieren una ficha lista para usar, sin preparación.
        </p>
        {has("/worksheets/[category]") && (
          <>
            <h3 className="mt-8 font-display font-bold text-xl">Fichas populares</h3>
            <ul className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
              {["letra-a-cursiva", "silabas-m", "letra-m-silaba", "numero-5"].map((slug) => (
                <FicheCard key={slug} fiche={getFicha(slug)!} locale="es" />
              ))}
            </ul>
          </>
        )}
        {has("/worksheets") && (
          <div className="mt-6 flex flex-wrap items-center gap-4">
            <Link
              href="/worksheets"
              className="owl-btn owl-btn-purple"
            >
              Ver todas las fichas
            </Link>
            {has("/worksheets/bundles") && (
              <Link href="/worksheets/bundles" className="font-display font-bold text-owl-purple hover:underline">
                Los paquetes en PDF →
              </Link>
            )}
          </div>
        )}
      </section>

      {/* 3b. Trazo y cursiva */}
      <section className="bg-owl-mint">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6 py-16">
          <h2 className="text-3xl md:text-4xl font-extrabold leading-tight">El trazo de las letras</h2>
          <p className="mt-3 text-lg leading-relaxed text-owl-muted max-w-2xl">
            Para cada letra, una ficha de trazo en letra script, mayúscula y minúscula, con
            líneas punteadas para seguir antes de escribir solos. Y para ir más lejos, fichas de
            letra cursiva en doble raya, como en el cuaderno de la escuela.
          </p>
          {has("/alphabet/[letter]/worksheet") && (
            <Link
              href={{ pathname: "/alphabet/[letter]/worksheet", params: { letter: "a" } }}
              className="mt-6 owl-btn owl-btn-ink"
            >
              Trazar la letra A
            </Link>
          )}
        </div>
      </section>

      {/* 4. Juegos */}
      <section className="bg-owl-cream">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6 py-16">
          <h2 className="text-3xl md:text-4xl font-extrabold leading-tight">Juegos para aprender</h2>
          <p className="mt-3 text-lg leading-relaxed text-owl-muted max-w-2xl">
            Encontrar la letra, unir la letra con su dibujo, descubrir con qué sílaba empieza una
            palabra, trazar letras y aplaudir las sílabas: juegos cortos, con instrucciones que se
            pueden escuchar.
          </p>
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {spanishGames.map((g) => (
              <Link
                key={g.slug}
                href={{ pathname: "/games/[slug]", params: { slug: g.slug } }}
                className="owl-card text-center"
              >
                <IconTile name={g.icon} className="mx-auto mb-2 h-12 w-12" />
                {g.title}
              </Link>
            ))}
          </div>
          {has("/games") && (
            <Link
              href="/games"
              className="mt-6 owl-btn owl-btn-ink"
            >
              Jugar
            </Link>
          )}
        </div>
      </section>

      {/* 4b. PDF */}
      <section className="mx-auto max-w-[1200px] px-4 sm:px-6 py-16">
        <h2 className="text-3xl md:text-4xl font-extrabold leading-tight">Fichas en PDF listas para imprimir</h2>
        <p className="mt-3 text-lg leading-relaxed text-owl-muted max-w-2xl">
          Cada ficha es un PDF listo para imprimir: la ves en la pantalla y la imprimes o la
          descargas con un clic. No necesitas cuenta para las fichas gratis: la maestra prepara
          las copias del grupo la noche anterior, y en casa imprimes una justo antes de salir.
        </p>
      </section>

      {/* 4c. Preescolar */}
      <section className="bg-white">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6 py-16">
          <h2 className="text-3xl md:text-4xl font-extrabold leading-tight">Actividades para preescolar y kínder</h2>
          <p className="mt-3 text-lg leading-relaxed text-owl-muted max-w-2xl">
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
                className="owl-card"
              >
                {item.label}
              </MaybeLink>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Espacio para familias */}
      <section className="mx-auto max-w-[1200px] px-4 sm:px-6 py-16 grid md:grid-cols-2 gap-8 items-center">
        <div>
          <h2 className="text-3xl md:text-4xl font-extrabold leading-tight">Espacio para familias</h2>
          <p className="mt-3 text-lg leading-relaxed text-owl-muted">
            Sigue el progreso de tu hijo o hija con el abecedario y las sílabas, mira las
            lecciones terminadas y descubre el siguiente paso recomendado.
          </p>
          <Link
            href="/dashboard"
            className="mt-6 owl-btn owl-btn-purple"
          >
            Ir a mi cuenta
          </Link>
        </div>
        <div className="rounded-3xl bg-owl-ink text-white p-6">
          <p className="font-display font-bold text-lg">Esta semana</p>
          <ul className="mt-3 space-y-2 text-[#C9C3EE] text-sm">
            <li>12 lecciones terminadas</li>
            <li>Abecedario: 18 de 27 letras</li>
            <li>Sigue: la letra S y sus sílabas sa, se, si, so, su</li>
          </ul>
        </div>
      </section>

      {/* 6. Pro */}
      <section className="bg-owl-ink text-white">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6 py-16 text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold leading-tight">AlphaBes Pro</h2>
          <p className="mt-3 text-lg text-[#C9C3EE] max-w-xl mx-auto">
            Desbloquea todas las fichas, todos los juegos y todas las lecciones de sílabas, con el
            seguimiento del progreso y paquetes de fichas para imprimir.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-6">
            <div className="rounded-3xl bg-white text-owl-ink p-6 w-64">
              <p className="font-display font-bold text-xl">Mensual</p>
              <p className="mt-2 text-3xl font-extrabold">US$7.99<span className="text-base font-normal">/mes</span></p>
            </div>
            <div className="rounded-3xl bg-owl-sun text-owl-ink p-6 w-64">
              <p className="font-display font-bold text-xl">Anual</p>
              <p className="mt-2 text-3xl font-extrabold">US$59<span className="text-base font-normal">/año</span></p>
            </div>
          </div>
          <Link
            href="/pricing"
            className="mt-8 owl-btn owl-btn-sun"
          >
            Ver todos los precios
          </Link>
        </div>
      </section>

      {/* 7. Preguntas frecuentes */}
      <section className="mx-auto max-w-3xl px-4 sm:px-6 py-16">
        <h2 className="text-3xl md:text-4xl font-extrabold leading-tight">Preguntas frecuentes</h2>
        <dl className="mt-8 space-y-6">
          {faq.map((item) => (
            <div key={item.question}>
              <dt className="font-display font-bold text-lg">{item.question}</dt>
              <dd className="mt-1 leading-relaxed text-owl-muted">{item.answer}</dd>
            </div>
          ))}
        </dl>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
    </OwlHome>
  );
}
