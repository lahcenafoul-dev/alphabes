import type { Metadata } from "next";
import Link from "next/link";
import { absoluteUrl, alternatesFor, localizedPath } from "@/lib/i18n/routes";
import { buildBreadcrumbJsonLd } from "@/lib/json-ld";

const title = "Brincadeiras para aprender as letras e as sílabas, sem telas";
const description =
  "Oito brincadeiras fáceis para fazer em casa ou na escola com o que se tem à mão: procurar letras, massinha, a bandeja de sal, “Eu vejo” com sílabas, bater palmas e pular as sílabas, bingo e jogo da memória. De 3 a 7 anos.";

export const activitiesMetadataPt: Metadata = {
  title,
  description,
  alternates: alternatesFor("pt", "/activities"),
  openGraph: { title, description, url: absoluteUrl("pt", "/activities") },
};

type Activity = {
  id: string;
  emoji: string;
  title: string;
  age: string;
  summary: string;
  material: string;
  steps: string[];
  link: { label: string; href: string };
};

const atividades = (category: string) => localizedPath("pt", "/worksheets/[category]", { category });
const jogo = (slug: string) => localizedPath("pt", "/games/[slug]", { slug });
const silabas = (skill: string) => localizedPath("pt", "/phonics/[skill]", { skill });

const activities: Activity[] = [
  {
    id: "procure-as-letras",
    emoji: "🔎",
    title: "Procure as letras do seu nome",
    age: "3 a 6 anos",
    summary: "Achar as letras do nome em revistas, recortar e colar na ordem.",
    material: "Revistas ou folhetos velhos, tesoura sem ponta, cola e uma folha.",
    steps: [
      "Escreva o nome da criança em letra bastão, bem grande, no alto da folha.",
      "Procurem juntos cada letra do nome nas revistas.",
      "A criança recorta (ou rasga) as letras que encontra e cola embaixo do modelo, na ordem.",
      "Leiam o nome apontando cada letra com o dedo.",
    ],
    link: { label: "Jogo: encontre a letra", href: jogo("encontre-a-letra") },
  },
  {
    id: "letras-de-massinha",
    emoji: "🟠",
    title: "Letras de massinha",
    age: "3 a 5 anos",
    summary: "Fazer rolinhos de massinha e formar as letras sobre um modelo grande.",
    material: "Massinha de modelar e modelos de letras grandes (serve uma atividade de letra bastão).",
    steps: [
      "Coloque na frente da criança o modelo de uma letra.",
      "A criança faz rolinhos de massinha e coloca sobre cada traçado da letra.",
      "Depois ela segue a letra de massinha com o dedo, dizendo o nome dela.",
      "Para os maiores: formar a letra sem modelo e depois uma palavra curta (bola, sol).",
    ],
    link: { label: "Atividades de letra bastão", href: atividades("letra-bastao") },
  },
  {
    id: "bandeja-de-sal",
    emoji: "🏖️",
    title: "Escrever na bandeja de sal",
    age: "3 a 6 anos",
    summary: "Traçar as letras com o dedo numa bandeja com sal, areia ou farinha.",
    material: "Uma bandeja ou uma caixa baixa, sal (ou areia, farinha) e cartões com letras.",
    steps: [
      "Coloque uma camada fina de sal na bandeja.",
      "Mostre um cartão e trace a letra com o dedo no sal, começando pelo lugar certo.",
      "Depois a criança traça. Para apagar, é só balançar a bandeja.",
      "Variação: você traça uma letra e a criança adivinha qual é.",
    ],
    link: { label: "Jogo: trace a letra", href: jogo("trace-a-letra") },
  },
  {
    id: "eu-vejo-silabas",
    emoji: "👀",
    title: "“Eu vejo” com sílabas",
    age: "4 a 6 anos",
    summary: "A brincadeira de sempre, mas com a primeira sílaba: “Eu vejo uma coisa que começa com bo…”.",
    material: "Nada: só olhar em volta, em casa, no parque ou no carro.",
    steps: [
      "Escolha uma coisa que os dois possam ver, por exemplo uma bola.",
      "Diga: “Eu vejo, eu vejo uma coisa que começa com… bo”.",
      "A criança procura e diz nomes de coisas até acertar: “bo-la!”.",
      "Troquem de papel: agora ela escolhe a coisa e diz a sílaba.",
    ],
    link: { label: "Jogo: com que sílaba começa?", href: jogo("silaba-inicial") },
  },
  {
    id: "pule-as-silabas",
    emoji: "🦘",
    title: "Bata palmas e pule as sílabas",
    age: "4 a 6 anos",
    summary: "Uma palma ou um pulo por sílaba: o corpo ajuda a ouvir os pedaços das palavras.",
    material: "Nada, ou alguns bambolês ou almofadas no chão.",
    steps: [
      "Diga uma palavra: “bor-bo-le-ta”.",
      "A criança dá um pulo (ou passa de uma almofada para outra) a cada sílaba.",
      "Contem os pulos: quatro pulos, quatro sílabas.",
      "Experimentem com os nomes da família e depois com palavras compridas: “hi-po-pó-ta-mo”.",
    ],
    link: { label: "Jogo: bata palmas", href: jogo("bata-palmas") },
  },
  {
    id: "alfabeto-movel-de-tampinhas",
    emoji: "🔤",
    title: "Alfabeto móvel de tampinhas",
    age: "5 a 7 anos",
    summary: "Escrever sílabas em tampinhas de garrafa e juntar para formar palavras: bo + la = bola.",
    material: "Umas quinze tampinhas de garrafa PET e uma caneta permanente.",
    steps: [
      "Escreva nas tampinhas sílabas que a criança já conhece: ba, be, bo, la, lo, ma, pa, to, sa…",
      "Forme uma palavra com duas tampinhas, por exemplo “bo” e “la”, e leiam juntos: “bola”.",
      "Agora é a vez dela: que palavras consegue formar? bala, mala, pato, sapo…",
      "Para os maiores: com três tampinhas (ja-ne-la, to-ma-te).",
    ],
    link: { label: "As famílias silábicas", href: silabas("familias-silabicas") },
  },
  {
    id: "bingo-das-letras",
    emoji: "🎲",
    title: "O bingo das letras",
    age: "4 a 6 anos",
    summary: "Um bingo feito em casa para reconhecer as letras brincando com outras pessoas.",
    material: "Cartelas de 6 casas com letras, cartões com as mesmas letras e feijões ou botões para marcar.",
    steps: [
      "Cada jogador recebe uma cartela com seis letras.",
      "Sorteia-se um cartão e diz-se o nome da letra.",
      "Quem tem essa letra na cartela coloca um feijão em cima.",
      "Ganha quem completar a cartela primeiro. Para os maiores, diga uma sílaba (ma) e procurem a letra com que ela começa.",
    ],
    link: { label: "Atividades de reconhecer letras", href: atividades("reconhecer-letras") },
  },
  {
    id: "jogo-da-memoria",
    emoji: "🃏",
    title: "Jogo da memória: maiúscula e minúscula",
    age: "5 a 7 anos",
    summary: "Achar os pares A-a, B-b, Ç-ç… para ligar as duas formas de cada letra.",
    material: "Cartões feitos em casa: uma letra maiúscula num, a mesma letra minúscula no outro.",
    steps: [
      "Preparem de 6 a 10 pares de cartões e coloquem virados para baixo.",
      "Cada um, na sua vez, vira dois cartões dizendo o nome das letras.",
      "Se for a mesma letra (A e a), fica com o par e joga de novo.",
      "Ganha quem tiver mais pares no fim.",
    ],
    link: { label: "O alfabeto, letra por letra", href: localizedPath("pt", "/alphabet") },
  },
];

export default function ActivitiesPt() {
  const url = absoluteUrl("pt", "/activities");
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Início", url: absoluteUrl("pt", "/") },
    { name: "Brincadeiras", url },
  ]);
  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Brincadeiras para aprender as letras e as sílabas",
    itemListElement: activities.map((a, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: a.title,
      url: `${url}#${a.id}`,
    })),
  };

  return (
    <main id="main-content" className="mx-auto max-w-5xl px-6 py-12">
      <nav aria-label="Caminho de navegação" className="text-sm text-chalkboard/60">
        <ol className="flex gap-2">
          <li><Link href={localizedPath("pt", "/")}>Início</Link> /</li>
          <li aria-current="page" className="font-bold">Brincadeiras</li>
        </ol>
      </nav>

      <h1 className="mt-6 text-4xl font-extrabold">Brincadeiras para aprender, sem telas</h1>
      <p className="mt-2 text-chalkboard/70 max-w-2xl">
        Ideias simples, com o que se tem em casa, para acompanhar as letras e as sílabas da semana. Cada brincadeira
        dura de dez a quinze minutos e funciona tão bem em família quanto na sala de aula.
      </p>

      <ul className="mt-8 grid sm:grid-cols-2 gap-5">
        {activities.map((a) => (
          <li key={a.id} id={a.id} className="flex flex-col rounded-block border border-chalkboard/10 p-6 shadow-block scroll-mt-24">
            <div className="flex items-start justify-between gap-3">
              <h2 className="font-display font-bold text-lg">
                <span aria-hidden="true">{a.emoji} </span>
                {a.title}
              </h2>
              <span className="shrink-0 rounded-full bg-crayon-yellow/25 px-3 py-1 text-xs font-bold">{a.age}</span>
            </div>
            <p className="mt-2 text-sm text-chalkboard/70">{a.summary}</p>
            <p className="mt-3 text-sm">
              <strong>Material:</strong> {a.material}
            </p>
            <ol className="mt-3 space-y-1 list-decimal list-inside text-sm text-chalkboard/80">
              {a.steps.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ol>
            <Link href={a.link.href} className="mt-auto pt-4 text-sm font-bold text-crayon-blue underline underline-offset-2">
              {a.link.label} →
            </Link>
          </li>
        ))}
      </ul>

      <Link
        href={localizedPath("pt", "/worksheets")}
        className="mt-8 inline-block rounded-block bg-crayon-green text-paper font-display font-bold px-5 py-2.5 shadow-block hover:shadow-blockHover transition"
      >
        As atividades para imprimir
      </Link>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }} />
    </main>
  );
}
