import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { cursivaFont } from "@/lib/fonts/cursive-pt";
import { absoluteUrl, alternatesFor } from "@/lib/i18n/routes";
import { buildBreadcrumbJsonLd } from "@/lib/json-ld";
import { ACENTOS_SLUG, CEDILHA_SLUG, letterWithWord, portugueseLetters } from "@/lib/letters-pt";

const title = "O alfabeto para crianças: as 26 letras, os sons e as palavras";
const description =
  "Aprenda o alfabeto de A a Z, com o Ç: o nome e o som de cada letra, a família silábica, palavras com figuras para ouvir e o traçado em letra bastão, de forma e cursiva.";

export const alphabetMetadataPt: Metadata = {
  title,
  description,
  alternates: alternatesFor("pt", "/alphabet"),
  openGraph: { title, description, url: absoluteUrl("pt", "/alphabet") },
};

const blockColors = ["bg-crayon-red", "bg-crayon-blue", "bg-crayon-green", "bg-crayon-yellow", "bg-crayon-purple"];

const cardClass =
  "group block h-full rounded-block border-2 border-chalkboard/10 bg-paper p-4 text-center shadow-block hover:border-crayon-blue hover:shadow-blockHover transition-colors motion-reduce:transition-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-crayon-blue";

const faqItems = [
  {
    question: "Quantas letras tem o alfabeto?",
    answer:
      "26 letras: 5 vogais (a, e, i, o, u) e 21 consoantes. O K, o W e o Y voltaram ao alfabeto com o Acordo Ortográfico, em vigor no Brasil desde 2009. O Ç não é uma letra a mais: é o C com cedilha, e por isso aparece aqui logo depois do C.",
  },
  {
    question: "É melhor ensinar o nome ou o som das letras?",
    answer:
      "Os dois, mas é o som que permite ler. A criança aprende a ler juntando o som de uma consoante com uma vogal: b com a faz “ba”. Por isso, em cada letra você pode ouvir o nome e também a família silábica: ba, be, bi, bo, bu.",
  },
  {
    question: "Em que ordem se aprendem as letras?",
    answer:
      "Não é preciso seguir a ordem do alfabeto. Muitas escolas começam pelas vogais e depois pelas famílias do P, do B, do M, do T e do D, com as quais a criança logo lê palavras como pato, bola, mala e dado. A ordem alfabética se aprende à parte, com uma música.",
  },
  {
    question: "Com que idade se aprende o alfabeto?",
    answer:
      "Por volta dos 3 ou 4 anos, muitas crianças reconhecem as letras do próprio nome. Entre 4 e 6 anos, na pré-escola, aprendem as vogais, as letras e as primeiras sílabas. A alfabetização se completa no 1º e no 2º ano do ensino fundamental.",
  },
  {
    question: "Letra bastão, de forma ou cursiva?",
    answer:
      "As três, uma de cada vez. Na educação infantil a criança começa pela letra bastão (de forma maiúscula), depois conhece a letra de forma minúscula, a dos livros, e aprende a letra cursiva em geral no 1º ou no 2º ano. Aqui você pode praticar todas.",
  },
];

export default function AlphabetPt() {
  const url = absoluteUrl("pt", "/alphabet");

  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Início", url: absoluteUrl("pt", "/") },
    { name: "Alfabeto", url },
  ]);
  const learningResourceJsonLd = {
    "@context": "https://schema.org",
    "@type": "LearningResource",
    name: "O alfabeto de A a Z",
    description,
    url,
    inLanguage: "pt-BR",
    educationalLevel: "Educação infantil",
    learningResourceType: "Lesson",
    teaches: "Reconhecer as letras, o nome, o som e a família silábica de cada uma, e o traçado das letras",
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
      <nav aria-label="Caminho de navegação" className="text-sm text-chalkboard/60">
        <ol className="flex gap-2">
          <li><Link href="/">Início</Link> /</li>
          <li aria-current="page" className="font-bold">Alfabeto</li>
        </ol>
      </nav>

      <header className="mt-6 max-w-3xl">
        <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
          O alfabeto de A a Z: as letras, os sons e palavras para ouvir
        </h1>
        <p className="mt-4 text-lg text-chalkboard/70">
          Uma lição para cada uma das 26 letras e para o Ç: a letra bastão, a de forma e a cursiva,
          o nome, o som e a família silábica, palavras com figuras para ouvir e o traçado. Para
          crianças de 3 a 6 anos, da educação infantil ao 1º ano.
        </p>
        <div className="mt-6 flex flex-wrap gap-4">
          <Link
            href={{ pathname: "/alphabet/[letter]", params: { letter: "a" } }}
            className="rounded-block bg-crayon-blue text-paper font-display font-bold px-6 py-3 shadow-block hover:shadow-blockHover transition-shadow"
          >
            Começar pela letra A
          </Link>
          <Link
            href="/flashcards"
            className="rounded-block border-2 border-chalkboard/20 px-6 py-3 font-display font-bold hover:border-crayon-blue transition-colors"
          >
            Ver os cartões
          </Link>
        </div>
      </header>

      <section className="mt-16" aria-labelledby="az-heading">
        <h2 id="az-heading" className="text-3xl font-bold">As 26 letras e o Ç</h2>
        <p className="mt-2 text-chalkboard/70 max-w-2xl">
          Toque numa letra para abrir a lição. Embaixo de cada letra está o nome dela, como se diz no
          Brasil.
        </p>
        <ul className="mt-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {portugueseLetters.map((l, i) => {
            const [w1, w2] = l.words;
            const cedilha = l.slug === CEDILHA_SLUG;
            return (
              <li key={l.slug}>
                <Link
                  href={{ pathname: "/alphabet/[letter]", params: { letter: l.slug } }}
                  aria-label={`${cedilha ? "O Ç (cê-cedilha)" : `A letra ${l.upper}`}: ${l.upper}, como em ${w1.word.toLowerCase()} e ${w2.word.toLowerCase()}`}
                  className={`${cardClass} ${cedilha ? "border-dashed" : ""}`}
                >
                  <span
                    className={`letter-block ${blockColors[i % blockColors.length]} mx-auto flex aspect-square w-16 items-center justify-center text-2xl`}
                    aria-hidden="true"
                  >
                    {l.upper}{l.lower}
                  </span>
                  <span className="mt-1 block text-xs text-chalkboard/60">“{l.name}”</span>
                  <span className="mt-2 block text-2xl" aria-hidden="true">
                    {w1.emoji}
                  </span>
                  <span className="mt-2 block font-display font-bold text-sm">{letterWithWord(l, w1)}</span>
                  {cedilha && <span className="mt-1 block text-xs text-chalkboard/60">não é uma letra nova</span>}
                </Link>
              </li>
            );
          })}
        </ul>
        <p className="mt-6 text-chalkboard/70">
          E as vogais com acento (á, â, é, ê, ó, ô) e com til (ã, õ)?{" "}
          <Link
            href={{ pathname: "/alphabet/[letter]", params: { letter: ACENTOS_SLUG } }}
            className="font-display font-bold text-crayon-blue hover:underline"
          >
            Os acentos e o til →
          </Link>
        </p>
      </section>

      <section className="mt-16" aria-labelledby="name-sound-heading">
        <h2 id="name-sound-heading" className="text-3xl font-bold">O nome, o som e a família silábica</h2>
        <div className="mt-4 grid gap-6 md:grid-cols-2">
          <p className="text-chalkboard/80">
            Cada letra tem um <strong>nome</strong> (o M se chama “eme”) e um <strong>som</strong>, o
            que se ouve no começo de macaco. Para ler, o que conta é o som: o M e o A juntos se leem
            “ma”, e não “eme-a”. Por isso, em cada letra você pode ouvir o nome e a família silábica:
            ma, me, mi, mo, mu.
          </p>
          <p className="text-chalkboard/80">
            Algumas letras têm dois sons, como o c de casa e o de cebola, ou o g de gato e o de
            girafa. O s soa como z entre vogais (casa), o r é forte em rato e fraco em caro, e o h
            não tem som no começo da palavra. As vogais e e o mudam de som com o acento: avó e avô.
          </p>
        </div>
      </section>

      <section className="mt-16 bg-crayon-green/10 rounded-block p-8" aria-labelledby="writing-heading">
        <h2 id="writing-heading" className="text-3xl font-bold">Os quatro tipos de letra</h2>
        <p className="mt-2 text-chalkboard/70 max-w-2xl">
          Na escola, a criança conhece a mesma letra de quatro jeitos. Começa escrevendo com a letra
          bastão, lê a letra de forma dos livros e aprende depois a letra cursiva, maiúscula e
          minúscula. Cada letra tem uma atividade de traçado na tela nos três estilos, com as linhas
          do caderno de caligrafia para a cursiva.
        </p>
        <ul className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl">
          {[
            { label: "Letra bastão", sample: "A B C", cursive: false },
            { label: "Letra de forma minúscula", sample: "a b c", cursive: false },
            { label: "Cursiva maiúscula", sample: "A B C", cursive: true },
            { label: "Cursiva minúscula", sample: "a b c", cursive: true },
          ].map((t) => (
            <li key={t.label} className="rounded-block border border-chalkboard/10 bg-paper p-4 text-center shadow-block">
              <span
                className={`block text-3xl ${t.cursive ? `leading-[3.5rem] ${cursivaFont.className}` : "font-extrabold leading-[3.5rem]"}`}
              >
                {t.sample}
              </span>
              <span className="mt-2 block text-sm text-chalkboard/70">{t.label}</span>
            </li>
          ))}
        </ul>
        <Link
          href={{ pathname: "/alphabet/[letter]/worksheet", params: { letter: "a" } }}
          className="mt-6 inline-block rounded-block bg-chalkboard text-paper font-display font-bold px-5 py-2.5 shadow-block hover:shadow-blockHover transition-shadow"
        >
          Experimentar com a letra A
        </Link>
      </section>

      <section className="mt-16" aria-labelledby="howto-heading">
        <h2 id="howto-heading" className="text-3xl font-bold">Como ajudar a criança a aprender as letras</h2>
        <ol className="mt-6 space-y-3 list-decimal list-inside text-chalkboard/80">
          <li>Comece pelas letras do nome dela: são as que ela tem mais vontade de conhecer.</li>
          <li>Poucas letras de cada vez bastam. Cinco minutos por dia valem mais que uma sessão longa.</li>
          <li>Diga o som da letra mostrando uma palavra que começa com ele: S de sol, ssss.</li>
          <li>Quando ela conhecer uma consoante e as vogais, juntem as duas: ba, be, bi, bo, bu. Ela já está lendo!</li>
          <li>Procurem letras em todo lugar: nas placas, nas embalagens, nas histórias da hora de dormir.</li>
          <li>
            Revejam sempre as letras que já conhecem, por exemplo com{" "}
            <Link href="/flashcards" className="font-bold underline">os cartões</Link>.
          </li>
        </ol>
      </section>

      <section className="mt-16 max-w-3xl" aria-labelledby="faq-heading">
        <h2 id="faq-heading" className="text-3xl font-bold">Perguntas frequentes sobre o alfabeto</h2>
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
        <h2 className="text-3xl font-bold">Vamos começar?</h2>
        <p className="mt-2 text-paper/70 max-w-xl mx-auto">
          Escolha uma letra ou veja os cartões para descobrir todas as palavras.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-4">
          <Link
            href={{ pathname: "/alphabet/[letter]", params: { letter: "a" } }}
            className="rounded-block bg-crayon-yellow text-chalkboard font-display font-bold px-6 py-3 shadow-block hover:shadow-blockHover transition-shadow"
          >
            Começar pelo A
          </Link>
          <Link
            href="/flashcards"
            className="rounded-block border-2 border-paper/40 px-6 py-3 font-display font-bold hover:border-paper transition-colors"
          >
            Os cartões
          </Link>
        </div>
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(learningResourceJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
    </main>
  );
}
