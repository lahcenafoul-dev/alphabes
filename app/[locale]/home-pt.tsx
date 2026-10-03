import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Link } from "@/i18n/navigation";
import type { AppPathname } from "@/i18n/routing";
import { alternatesFor, isAvailable } from "@/lib/i18n/routes";
import { FicheCard } from "@/components/fiches/FicheParts";
import { getAtividade } from "@/lib/atividades-pt";
import { portugueseGames } from "@/lib/jogos-pt";

const title = "Aprender o alfabeto: atividades e jogos grátis | AlphaBes";
const description =
  "Atividades de alfabetização grátis para imprimir, traçado de letras, famílias silábicas e primeiras leituras para a educação infantil e o 1º ano. Lições e jogos interativos para crianças de 3 a 8 anos.";

export const homeMetadataPt: Metadata = {
  title,
  description,
  alternates: alternatesFor("pt", "/"),
  openGraph: { title, description, url: "https://alphabes.com/pt", locale: "pt_BR" },
};

// The 26 letters, with the Ç card right after C (docs/portuguese-plan.md, P5).
const letters = [..."abc", "ç", ..."defghijklmnopqrstuvwxyz"];
const letterSlug = (l: string) => (l === "ç" ? "c-cedilha" : l);

const blockColors = [
  "bg-crayon-red",
  "bg-crayon-blue",
  "bg-crayon-yellow",
  "bg-crayon-green",
  "bg-crayon-purple",
];

const faq = [
  {
    question: "Para que idade é o AlphaBes?",
    answer:
      "O AlphaBes é para crianças de 3 a 8 anos, da educação infantil ao 2º ano: desde reconhecer as letras até ler as primeiras sílabas, palavras e histórias.",
  },
  {
    question: "O AlphaBes é grátis?",
    answer:
      "Sim. O plano grátis traz as primeiras lições do alfabeto, uma seleção de atividades e alguns jogos. O plano Pro dá acesso a todo o conteúdo.",
  },
  {
    question: "Preciso imprimir as atividades em cores?",
    answer:
      "Não. Todas as atividades ficam ótimas em preto e branco, na impressora de casa ou na copiadora da escola.",
  },
  {
    question: "Por que aprender com as famílias silábicas?",
    answer:
      "Em português, a criança aprende a ler juntando uma consoante com uma vogal: b com a faz “ba”. Com ba, be, bi, bo, bu ela já lê bebê e babá. Depois vêm os dígrafos (ch, lh, nh), os sons nasais (ão, an, em) e as sílabas complexas. É a ordem da alfabetização nas escolas do Brasil.",
  },
];

/** A link when the Portuguese page exists, otherwise plain content (pages arrive phase by phase). */
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
  if (!isAvailable("pt", pathname)) return <div className={className}>{children}</div>;
  const href = (params ? { pathname, params } : pathname) as Parameters<typeof Link>[0]["href"];
  return (
    <Link href={href} className={className} aria-label={label}>
      {children}
    </Link>
  );
}

export default function HomePt() {
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    inLanguage: "pt-BR",
    mainEntity: faq.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
  const has = (pathname: AppPathname) => isAvailable("pt", pathname);

  return (
    <main id="main-content">
      {/* Hero */}
      <section className="bg-chalkboard text-paper">
        <div className="mx-auto max-w-6xl px-6 py-16 md:py-24 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
              Aprender o alfabeto brincando
            </h1>
            <p className="mt-5 text-lg md:text-xl text-paper/80 max-w-md">
              As 26 letras, de A a Z, e o Ç, com as famílias silábicas e o traçado, atividades
              grátis para imprimir, sílabas para ler e jogos interativos, da educação infantil ao
              1º ano.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/register"
                className="rounded-block bg-crayon-yellow text-chalkboard font-display font-bold px-6 py-3 shadow-block hover:shadow-blockHover transition"
              >
                Começar grátis
              </Link>
              {has("/worksheets") && (
                <Link
                  href="/worksheets"
                  className="rounded-block border-2 border-paper/40 px-6 py-3 font-display font-bold hover:border-paper transition"
                >
                  Ver as atividades
                </Link>
              )}
            </div>
          </div>

          {/* Signature element: shelf of wooden alphabet blocks */}
          <div
            className="grid grid-cols-7 gap-2 md:gap-3"
            role="img"
            aria-label="Prateleira de cubos de madeira, de A a Z"
          >
            {letters.map((l) => (
              <div key={l} className="letter-block aspect-square text-xl md:text-2xl">
                {l.toUpperCase()}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 1. O alfabeto */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="text-3xl font-bold">Conheça o alfabeto</h2>
        <p className="mt-2 text-chalkboard/70 max-w-2xl">
          Cada letra tem a sua lição: a letra bastão, a letra de forma e a letra cursiva, o nome e
          o som para ouvir, e palavras de exemplo pensadas para os pequenos.
        </p>
        <div className="mt-8 grid grid-cols-4 sm:grid-cols-6 md:grid-cols-9 gap-3">
          {letters.map((l, i) => (
            <MaybeLink
              key={l}
              pathname="/alphabet/[letter]"
              params={{ letter: letterSlug(l) }}
              className={`letter-block aspect-square text-lg ${blockColors[i % blockColors.length]}`}
              label={`Lição da letra ${l.toUpperCase()}`}
            >
              {l.toUpperCase()}
            </MaybeLink>
          ))}
        </div>
      </section>

      {/* 2. As sílabas */}
      <section className="bg-crayon-blue/10">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <h2 className="text-3xl font-bold">Aprenda as sílabas</h2>
          <p className="mt-2 text-chalkboard/70 max-w-2xl">
            Passo a passo até a leitura: as vogais, as famílias silábicas (ba, be, bi, bo, bu),
            depois os dígrafos como ch, lh e nh, os sons nasais como ão e an, e as sílabas
            complexas como bra e pla.
          </p>
          <div className="mt-8 grid sm:grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "As vogais", skill: "vogais" },
              { label: "As famílias silábicas", skill: "familias-silabicas" },
              { label: "Os dígrafos", skill: "ch" },
              { label: "Os sons nasais", skill: "til" },
            ].map((item) => (
              <MaybeLink
                key={item.skill}
                pathname="/phonics/[skill]"
                params={{ skill: item.skill }}
                className="rounded-block bg-paper p-5 shadow-block hover:shadow-blockHover transition font-display font-bold"
              >
                {item.label}
              </MaybeLink>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Atividades grátis */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="text-3xl font-bold">Atividades do alfabeto grátis</h2>
        <p className="mt-2 text-chalkboard/70 max-w-2xl">
          Atividades grátis para imprimir de todas as letras do alfabeto: traçado em letra bastão
          e em letra de forma, letra cursiva, colorir, reconhecer letras, famílias silábicas e
          primeiras palavras. Pensadas para mães e pais, para quem ensina em casa e para
          professoras e professores da educação infantil e do 1º ano que querem uma atividade
          pronta para usar, sem preparação.
        </p>
        {has("/worksheets/[category]") && (
          <>
            <h3 className="mt-8 font-display font-bold text-xl">Atividades populares</h3>
            <ul className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
              {["letra-a-cursiva", "familia-b", "letra-b-silaba", "letra-a-bastao"].map((slug) => (
                <FicheCard key={slug} fiche={getAtividade(slug)!} locale="pt" />
              ))}
            </ul>
          </>
        )}
        {has("/worksheets") && (
          <div className="mt-6 flex flex-wrap items-center gap-4">
            <Link
              href="/worksheets"
              className="inline-block rounded-block bg-crayon-green text-paper font-display font-bold px-6 py-3 shadow-block hover:shadow-blockHover transition"
            >
              Ver todas as atividades
            </Link>
            {has("/worksheets/bundles") && (
              <Link href="/worksheets/bundles" className="font-display font-bold text-crayon-purple hover:underline">
                Os pacotes em PDF →
              </Link>
            )}
          </div>
        )}
      </section>

      {/* 3b. Traçado e caligrafia */}
      <section className="bg-crayon-green/10">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <h2 className="text-3xl font-bold">O traçado das letras</h2>
          <p className="mt-2 text-chalkboard/70 max-w-2xl">
            Os quatro tipos de letra que a criança vê na escola: a letra bastão, que vem primeiro,
            a letra de forma minúscula e a letra cursiva, maiúscula e minúscula. Para cada letra,
            uma atividade de traçado com linhas pontilhadas para seguir antes de escrever sozinho,
            e atividades de caligrafia com pauta, como no caderno da escola.
          </p>
          {has("/alphabet/[letter]/worksheet") && (
            <Link
              href={{ pathname: "/alphabet/[letter]/worksheet", params: { letter: "a" } }}
              className="mt-6 inline-block rounded-block bg-chalkboard text-paper font-display font-bold px-6 py-3 shadow-block hover:shadow-blockHover transition"
            >
              Traçar a letra A
            </Link>
          )}
        </div>
      </section>

      {/* 4. Jogos */}
      <section className="bg-crayon-yellow/15">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <h2 className="text-3xl font-bold">Jogos para aprender</h2>
          <p className="mt-2 text-chalkboard/70 max-w-2xl">
            Encontrar a letra, ligar a letra à figura, descobrir com que sílaba começa uma palavra,
            traçar letras e bater palmas para contar as sílabas: jogos curtos, com instruções que a
            criança pode ouvir.
          </p>
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {portugueseGames.map((g) => (
              <Link
                key={g.slug}
                href={{ pathname: "/games/[slug]", params: { slug: g.slug } }}
                className="rounded-block bg-paper p-5 shadow-block hover:shadow-blockHover transition font-display font-bold text-center"
              >
                <span className="block text-3xl" aria-hidden="true">
                  {g.emoji}
                </span>
                {g.title}
              </Link>
            ))}
          </div>
          {has("/games") && (
            <Link
              href="/games"
              className="mt-6 inline-block rounded-block bg-chalkboard text-paper font-display font-bold px-6 py-3 shadow-block hover:shadow-blockHover transition"
            >
              Jogar
            </Link>
          )}
        </div>
      </section>

      {/* 4b. PDF */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="text-3xl font-bold">Atividades em PDF prontas para imprimir</h2>
        <p className="mt-2 text-chalkboard/70 max-w-2xl">
          Cada atividade é um PDF pronto para imprimir: você vê na tela e imprime ou baixa com um
          clique. Não precisa de conta para as atividades grátis: a professora prepara as cópias da
          turma na noite anterior e, em casa, você imprime uma logo antes de sair.
        </p>
      </section>

      {/* 4c. Educação infantil */}
      <section className="bg-crayon-purple/10">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <h2 className="text-3xl font-bold">Para a educação infantil e o 1º ano</h2>
          <p className="mt-2 text-chalkboard/70 max-w-2xl">
            Além das atividades para imprimir, o AlphaBes tem brincadeiras, cartões com figuras e
            jogos pensados para a atenção dos pequenos, dos 3 aos 6 anos.
          </p>
          <div className="mt-6 grid sm:grid-cols-3 md:grid-cols-4 gap-4">
            {(
              [
                { pathname: "/preschool", label: "Educação infantil (3 a 5 anos)" },
                { pathname: "/kindergarten", label: "1º ano (6 anos)" },
                { pathname: "/activities", label: "Brincadeiras" },
                { pathname: "/flashcards", label: "Cartões com figuras" },
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

      {/* 5. Espaço da família */}
      <section className="mx-auto max-w-6xl px-6 py-16 grid md:grid-cols-2 gap-8 items-center">
        <div>
          <h2 className="text-3xl font-bold">Espaço da família</h2>
          <p className="mt-2 text-chalkboard/70">
            Acompanhe o progresso do seu filho ou da sua filha com o alfabeto e as sílabas, veja as
            lições concluídas e descubra o próximo passo recomendado.
          </p>
          <Link
            href="/dashboard"
            className="mt-6 inline-block rounded-block bg-crayon-blue text-paper font-display font-bold px-6 py-3 shadow-block hover:shadow-blockHover transition"
          >
            Ir para minha conta
          </Link>
        </div>
        <div className="rounded-block bg-chalkboard text-paper p-6 shadow-block">
          <p className="font-display font-bold text-lg">Nesta semana</p>
          <ul className="mt-3 space-y-2 text-paper/80 text-sm">
            <li>12 lições concluídas</li>
            <li>Alfabeto: 18 de 26 letras</li>
            <li>Próximo passo: a família do S, sa, se, si, so, su</li>
          </ul>
        </div>
      </section>

      {/* 6. Pro */}
      <section className="bg-chalkboard text-paper">
        <div className="mx-auto max-w-6xl px-6 py-16 text-center">
          <h2 className="text-3xl font-bold">AlphaBes Pro</h2>
          <p className="mt-2 text-paper/70 max-w-xl mx-auto">
            Desbloqueie todas as atividades, todos os jogos e todas as lições de sílabas, com o
            acompanhamento do progresso e pacotes de atividades para imprimir.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-6">
            <div className="rounded-block bg-paper text-chalkboard p-6 w-64 shadow-block">
              <p className="font-display font-bold text-xl">Mensal</p>
              <p className="mt-2 text-3xl font-extrabold">US$ 7,99<span className="text-base font-normal">/mês</span></p>
            </div>
            <div className="rounded-block bg-crayon-yellow text-chalkboard p-6 w-64 shadow-block">
              <p className="font-display font-bold text-xl">Anual</p>
              <p className="mt-2 text-3xl font-extrabold">US$ 59<span className="text-base font-normal">/ano</span></p>
            </div>
          </div>
          <Link
            href="/pricing"
            className="mt-8 inline-block rounded-block bg-crayon-green px-6 py-3 font-display font-bold shadow-block hover:shadow-blockHover transition"
          >
            Ver todos os preços
          </Link>
        </div>
      </section>

      {/* 7. Perguntas frequentes */}
      <section className="mx-auto max-w-3xl px-6 py-16">
        <h2 className="text-3xl font-bold">Perguntas frequentes</h2>
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
