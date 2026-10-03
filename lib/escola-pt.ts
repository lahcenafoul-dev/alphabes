// The Portuguese school-level hubs: /pt/educacao-infantil (3 a 5 anos) and
// /pt/primeiro-ano (6 a 7 anos, the literacy year), and their topic pages.
// Written for Brazilian families, not translated from the other hubs
// (docs/portuguese-plan.md, P7). Every page gives the ages.
//
// Topics with an English twin (`en`) are also paired in TRANSLATED_PARAMS
// (lib/i18n/routes.ts); tests check that the two agree.
import type { AppPathname } from "@/i18n/routing";

export type SchoolLevelPt = "educacao-infantil" | "primeiro-ano";

export type TopicLinkPt = { label: string; pathname: AppPathname; params?: Record<string, string> };

export type SchoolTopicPt = {
  level: SchoolLevelPt;
  slug: string;
  /** The English topic's slug, when there is one. */
  en?: string;
  title: string;
  metaTitle: string;
  summary: string;
  emoji: string;
  intro: string[];
  tips: string[];
  activity: { title: string; material: string; steps: string[] };
  links: TopicLinkPt[];
};

const atividades = (category: string, label: string): TopicLinkPt => ({
  label,
  pathname: "/worksheets/[category]",
  params: { category },
});
const game = (slug: string, label: string): TopicLinkPt => ({ label, pathname: "/games/[slug]", params: { slug } });
const silabas = (skill: string, label: string): TopicLinkPt => ({ label, pathname: "/phonics/[skill]", params: { skill } });

export const schoolTopicsPt: SchoolTopicPt[] = [
  // ------------------------------------------------------------ educação infantil
  {
    level: "educacao-infantil",
    slug: "coordenacao-motora",
    title: "Coordenação motora na educação infantil",
    metaTitle: "Coordenação motora fina na educação infantil: preparar a mão para escrever",
    summary: "Linhas, círculos, pontes e laços: os movimentos que preparam a mão para escrever, muito antes das letras.",
    emoji: "〰️",
    intro: [
      "Antes de escrever letras, a mão aprende movimentos: uma linha de cima para baixo, um círculo, uma fileira de pontes, ondas. É a coordenação motora fina, trabalhada quase todos os dias na educação infantil com traçados, desenhos, massinha e brincadeiras.",
      "Esses traçados são as peças das letras: o círculo vira o o e o a, a ponte vira o n e o m, o laço vira o l e o e da letra cursiva. Uma criança que domina os traçados aprende a escrever com muito menos esforço.",
    ],
    tips: [
      "Comecem grande e de pé: num quadro, numa folha grande presa na parede, na areia ou com espuma na mesa. O pequeno vem depois.",
      "Os círculos são traçados no sentido contrário ao dos ponteiros do relógio, como serão escritos o o e o a. Mostre o ponto de partida: “em cima, para a esquerda”.",
      "Um giz de cera grosso é mais fácil de segurar do que um lápis fino.",
      "Deem nome aos movimentos: “desço”, “subo e desço”, “dou uma volta”. As palavras ajudam a mão a lembrar.",
    ],
    activity: {
      title: "As ondas do mar",
      material: "Uma folha grande, giz de cera ou canetinhas azuis e um barquinho desenhado ou recortado.",
      steps: [
        "Desenhem juntos uma linha de mar na parte de baixo da folha.",
        "A criança faz o barquinho andar sobre as ondas: pontes que sobem e descem, sem levantar o giz.",
        "Depois façam ondas menores e, em seguida, laços “quando o mar fica agitado”.",
        "Terminem com um sol: um círculo com raios em volta.",
      ],
    },
    links: [
      game("trace-a-letra", "Jogo: trace a letra"),
      atividades("formas", "Atividades de formas"),
      { label: "Brincadeiras para fazer em casa", pathname: "/activities" },
    ],
  },
  {
    level: "educacao-infantil",
    slug: "tracar-as-letras",
    en: "letter-tracing",
    title: "Traçar as letras na educação infantil",
    metaTitle: "Traçar as letras na educação infantil: primeiro o nome, em letra bastão",
    summary: "Seguir linhas pontilhadas para aprender a forma de cada letra e a ordem dos traçados, começando pelas letras do nome, em letra bastão.",
    emoji: "✏️",
    intro: [
      "Na educação infantil, a primeira palavra que a criança quer escrever é quase sempre o próprio nome. Por isso vale começar por essas letras, em letra bastão (a letra de forma maiúscula), como fazem as escolas.",
      "Traçar sobre linhas pontilhadas ensina a forma da letra e a ordem dos traçados. O importante não é ficar perfeito, e sim começar no lugar certo e seguir na direção certa.",
    ],
    tips: [
      "Duas ou três letras por vez bastam. Comecem pelas do nome.",
      "Mostre o ponto de partida: quase todas as letras começam em cima.",
      "Primeiro com o dedo, na mesa ou no ar; depois com um giz de cera grosso.",
      "Se sair das linhas, tudo bem: a precisão vem com o tempo.",
    ],
    activity: {
      title: "O nome de massinha",
      material: "Massinha de modelar e uma folha com o nome da criança escrito em letras grandes.",
      steps: [
        "Escreva o nome da criança em letra bastão, bem grande, numa folha.",
        "Façam juntos rolinhos de massinha e coloquem sobre cada traçado das letras.",
        "Depois, sigam cada letra com o dedo, dizendo o nome dela: “eme, a, erre…”.",
        "No fim, a criança escreve o nome com giz de cera ao lado do modelo.",
      ],
    },
    links: [
      atividades("letra-bastao", "Atividades de letra bastão"),
      game("trace-a-letra", "Jogo: trace a letra"),
      { label: "O alfabeto, letra por letra", pathname: "/alphabet" },
    ],
  },
  {
    level: "educacao-infantil",
    slug: "colorir",
    en: "coloring",
    title: "Colorir as letras na educação infantil",
    metaTitle: "Colorir as letras na educação infantil: aprender o alfabeto pintando",
    summary: "Pintar uma letra grande e as figuras dela: a mão se exercita e a letra fica familiar.",
    emoji: "🖍️",
    intro: [
      "Pintar já é trabalhar a mão: segurar o lápis de cor, ficar mais ou menos dentro da forma, trocar de cor. São os mesmos músculos usados para escrever.",
      "Quando a folha mostra uma letra grande e figuras que começam com ela, a criança olha para a letra um bom tempo e fala sobre ela: aprende sem perceber.",
    ],
    tips: [
      "Deixe a criança escolher as cores: o objetivo é praticar, não que fique “certo”.",
      "Não precisa terminar a folha. Dez minutos está ótimo.",
      "Enquanto ela pinta, digam o nome da letra e das figuras: “o eme, de macaco”.",
      "Lápis de cor bem apontados são mais fáceis de controlar do que canetinhas grossas.",
    ],
    activity: {
      title: "Pinte o que eu disser",
      material: "Uma atividade de colorir e lápis de cor.",
      steps: [
        "Imprima a atividade de uma letra, por exemplo o M.",
        "Peça: “Pinte a maçã de vermelho e a mala de azul”.",
        "Pintem por último a letra grande, dizendo juntos o nome dela.",
        "Coloquem a folha na geladeira: a criança vai mostrar para toda a família.",
      ],
    },
    links: [
      atividades("colorir-letras", "Atividades de colorir letras"),
      atividades("cores", "Atividades das cores"),
      { label: "Os cartões com figuras", pathname: "/flashcards" },
    ],
  },
  // ------------------------------------------------------------ 1º ano
  {
    level: "primeiro-ano",
    slug: "familias-silabicas",
    title: "As famílias silábicas no 1º ano",
    metaTitle: "Famílias silábicas no 1º ano: como ajudar a criança a ler em casa",
    summary: "Juntar consoante e vogal (ba, be, bi, bo, bu), ler as primeiras palavras e depois os dígrafos: o caminho da alfabetização.",
    emoji: "🔤",
    intro: [
      "O 1º ano é o ano da alfabetização. A criança aprende a juntar o som de uma consoante com cada vogal e a ler as famílias silábicas: ba, be, bi, bo, bu. Com poucas famílias ela já lê palavras de verdade: bola, pato, dado, mala.",
      "Depois vêm os dígrafos (ch, lh, nh), os sons nasais (mão, canto) e as sílabas complexas (prato, flor). Cada criança vai no seu ritmo: o importante é ler um pouco todos os dias.",
    ],
    tips: [
      "Siga a ordem da escola: se a turma está na família do P, brinquem com pa, pe, pi, po, pu em casa.",
      "Batam palmas para as sílabas das palavras: ja-ne-la, três palmas.",
      "Montem palavras com sílabas escritas em pedacinhos de papel, como o alfabeto móvel da escola.",
      "Leiam juntos placas, rótulos e embalagens: tudo vira leitura.",
    ],
    activity: {
      title: "O alfabeto móvel de sílabas",
      material: "Papel, tesoura e canetinha.",
      steps: [
        "Escrevam em pedacinhos de papel as sílabas de uma família e das vogais: ba, be, bi, bo, bu, la, lo, a, o.",
        "Peça para a criança montar palavras: bo + la = bola, ba + la = bala.",
        "Leiam juntos cada palavra montada, batendo palmas para as sílabas.",
        "A cada semana, acrescentem uma família nova.",
      ],
    },
    links: [
      silabas("familias-silabicas", "As famílias silábicas, para ouvir"),
      atividades("familias-silabicas", "Atividades de famílias silábicas"),
      game("bata-palmas", "Jogo: bata palmas"),
    ],
  },
  {
    level: "primeiro-ano",
    slug: "palavras-frequentes",
    en: "sight-words",
    title: "As palavras frequentes no 1º ano",
    metaTitle: "Palavras frequentes no 1º ano: o, a, um, e, de, que, para ler com fluência",
    summary: "o, a, um, e, de, que, não: as palavras curtas que aparecem em toda frase. Reconhecê-las de relance ajuda a ler com fluência.",
    emoji: "👀",
    intro: [
      "Algumas palavras aparecem em quase todas as frases: o, a, um, uma, e, é, de, do, da, em, que, não. Elas se leem pelas sílabas, como as outras, mas aparecem tanto que vale reconhecê-las de relance.",
      "Quando a criança reconhece essas palavras sem precisar decifrar, sobra atenção para entender o que lê. É um dos passos da leitura fluente, trabalhado no 1º e no 2º ano.",
    ],
    tips: [
      "Poucas palavras de cada vez: quatro por semana bastam.",
      "Procurem essas palavras nos livros e nas placas: “Quantos ‘que’ tem nesta página?”.",
      "Escrevam as palavras em cartões e brinquem de jogo da memória.",
      "Leiam em voz alta juntos todos os dias, apontando as palavras com o dedo.",
    ],
    activity: {
      title: "A caça às palavras",
      material: "Um livro de histórias e marcadores de página coloridos.",
      steps: [
        "Escolham uma palavra frequente, por exemplo “que”.",
        "Folheiem o livro juntos e marquem cada “que” encontrado.",
        "Contem quantos acharam e leiam juntos as frases marcadas.",
        "No dia seguinte, escolham outra palavra.",
      ],
    },
    links: [
      silabas("palavras-frequentes", "As palavras frequentes, para ouvir"),
      atividades("palavras-frequentes", "Atividades de palavras frequentes"),
      { label: "As histórias", pathname: "/stories" },
    ],
  },
  {
    level: "primeiro-ano",
    slug: "letra-cursiva",
    en: "handwriting",
    title: "A letra cursiva no 1º ano",
    metaTitle: "Letra cursiva no 1º ano: caligrafia passo a passo",
    summary: "Laços, pontes e letras ligadas no caderno de caligrafia: como acompanhar em casa a passagem para a letra cursiva.",
    emoji: "✍️",
    intro: [
      "Depois da letra bastão e da letra de forma, muitas escolas apresentam a letra cursiva no 1º ou no 2º ano, no caderno de caligrafia. As letras são ligadas, e cada uma tem o seu ponto de partida e o seu caminho.",
      "A idade da letra cursiva muda de uma escola para outra. Em casa, o melhor é seguir o modelo da escola e praticar pouco e com calma.",
    ],
    tips: [
      "Antes das letras, laços e pontes: são os movimentos da letra cursiva.",
      "Respeitem as linhas do caderno de caligrafia: as letras pequenas ficam entre a linha pontilhada e a linha de base.",
      "Cinco a dez minutos bastam. A mão cansa rápido nessa idade.",
      "Comecem pelas letras do nome e por palavras curtas: bola, uva, lua.",
    ],
    activity: {
      title: "Laços no ar e no papel",
      material: "Um caderno de caligrafia ou uma atividade de letra cursiva, e um lápis.",
      steps: [
        "Façam juntos laços grandes no ar, com o braço inteiro.",
        "Depois façam laços na mesa com o dedo.",
        "No papel, alternem: laço pequeno, laço grande. É o começo do e e do l!",
        "Terminem escrevendo juntos uma palavra curta em letra cursiva.",
      ],
    },
    links: [
      atividades("letra-cursiva", "Atividades de letra cursiva"),
      game("trace-a-letra", "Jogo: trace a letra"),
      atividades("escrever-palavras", "Atividades de escrever palavras"),
    ],
  },
];

export function topicsOfPt(level: SchoolLevelPt): SchoolTopicPt[] {
  return schoolTopicsPt.filter((t) => t.level === level);
}

export function getSchoolTopicPt(level: SchoolLevelPt, slug: string): SchoolTopicPt | undefined {
  return schoolTopicsPt.find((t) => t.level === level && t.slug === slug);
}

// ---------------------------------------------------------------- hubs

export type SchoolHubPt = {
  pathname: "/preschool" | "/kindergarten";
  topicPathname: "/preschool/[topic]" | "/kindergarten/[topic]";
  name: string;
  title: string;
  metaTitle: string;
  description: string;
  age: string;
  /** For JSON-LD typicalAgeRange. */
  ageRange: string;
  intro: string;
  learns: { title: string; text: string }[];
  resources: TopicLinkPt[];
  faq: { question: string; answer: string }[];
};

export const SCHOOL_HUBS_PT: Record<SchoolLevelPt, SchoolHubPt> = {
  "educacao-infantil": {
    pathname: "/preschool",
    topicPathname: "/preschool/[topic]",
    name: "Educação infantil",
    title: "Aprender na educação infantil, de 3 a 5 anos",
    metaTitle: "Educação infantil: atividades para aprender as letras (3 a 5 anos)",
    description:
      "Coordenação motora, primeiras letras, colorir e ouvir as sílabas: ideias, jogos e atividades para acompanhar em casa uma criança de 3 a 5 anos.",
    age: "3 a 5 anos",
    ageRange: "3-5",
    intro:
      "Dos 3 aos 5 anos, na pré-escola, a criança aprende brincando: conversa muito, reconhece o próprio nome, descobre algumas letras e prepara a mão para escrever. Não há pressa: cada criança avança no seu ritmo. Aqui estão ideias para acompanhar em casa, com calma.",
    learns: [
      { title: "Falar e ouvir", text: "Aprender palavras novas, contar o que aconteceu, brincar com rimas, músicas e adivinhas." },
      { title: "Reconhecer letras", text: "Primeiro as do nome, em letra bastão, depois as vogais e outras letras do alfabeto." },
      { title: "Preparar a mão", text: "Traçados, pintura, massinha e recorte: os movimentos que vão servir para escrever." },
      { title: "Ouvir as sílabas", text: "Bater palmas para as sílabas das palavras e reconhecer as vogais no começo de uma palavra." },
    ],
    resources: [
      { label: "O alfabeto", pathname: "/alphabet" },
      { label: "Os cartões com figuras", pathname: "/flashcards" },
      { label: "Os jogos", pathname: "/games" },
      { label: "As brincadeiras", pathname: "/activities" },
      { label: "As atividades para imprimir", pathname: "/worksheets" },
    ],
    faq: [
      {
        question: "A criança precisa saber o alfabeto todo aos 4 anos?",
        answer:
          "Não. Nessa idade, reconhecer algumas letras, principalmente as do nome e as vogais, já está ótimo. O alfabeto completo vai se formando até os 5 ou 6 anos.",
      },
      {
        question: "É preciso ensinar a ler na educação infantil?",
        answer:
          "Não é preciso. O que mais ajuda é ler histórias, conversar e brincar com as palavras: rimas, sílabas, “o que é o que é”. Se a criança mostrar interesse pelas letras, acompanhe, sem pressionar. A alfabetização acontece no 1º e no 2º ano.",
      },
      {
        question: "Quanto tempo por dia?",
        answer:
          "Alguns minutos bastam, quando a criança tiver vontade. Uma música, uma letra procurada numa história ou uma folha para pintar já é muito.",
      },
      {
        question: "A criança de 3 anos não segura bem o lápis. É grave?",
        answer:
          "Não, é normal. Massinha, pregadores de roupa, recorte e giz de cera grosso fortalecem a mão aos poucos. O jeito certo de segurar o lápis vem por volta dos 4 ou 5 anos.",
      },
    ],
  },
  "primeiro-ano": {
    pathname: "/kindergarten",
    topicPathname: "/kindergarten/[topic]",
    name: "1º ano",
    title: "Aprender no 1º ano, aos 6 anos",
    metaTitle: "1º ano: famílias silábicas, primeiras leituras e letra cursiva (6 a 7 anos)",
    description:
      "As famílias silábicas, as primeiras palavras e frases, as palavras frequentes e a letra cursiva: ideias, jogos e atividades para o ano da alfabetização, aos 6 anos.",
    age: "6 a 7 anos",
    ageRange: "6-7",
    intro:
      "O 1º ano do ensino fundamental é o ano da alfabetização: a criança, com 6 anos, aprende a juntar as letras em sílabas, a ler palavras e frases curtas e a escrever. A Base Nacional Comum Curricular (BNCC) prevê que ela esteja alfabetizada até o fim do 2º ano. É um ano importante, mas ainda se aprende muito brincando.",
    learns: [
      { title: "Todas as letras", text: "O nome e o som das 26 letras, nos quatro tipos de letra, e o Ç." },
      { title: "As famílias silábicas", text: "Juntar consoante e vogal (ba, be, bi, bo, bu), depois os dígrafos e os sons nasais." },
      { title: "As primeiras leituras", text: "Ler palavras, frases curtas e as palavras frequentes (o, a, e, de, que)." },
      { title: "A escrita", text: "O nome e palavras curtas, em letra de forma e, em muitas escolas, em letra cursiva no caderno de caligrafia." },
    ],
    resources: [
      { label: "O alfabeto", pathname: "/alphabet" },
      { label: "As sílabas", pathname: "/phonics" },
      { label: "Os jogos", pathname: "/games" },
      { label: "As histórias", pathname: "/stories" },
      { label: "As atividades para imprimir", pathname: "/worksheets" },
    ],
    faq: [
      {
        question: "A criança precisa ler no fim do 1º ano?",
        answer:
          "Muitas leem palavras e frases curtas, outras ainda estão juntando as sílabas: as duas coisas são normais. A BNCC dá até o fim do 2º ano para a alfabetização se completar. O importante é ler um pouco todos os dias.",
      },
      {
        question: "Letra de forma ou cursiva: o que praticar em casa?",
        answer:
          "A da escola. Cada escola escolhe o seu momento para a letra cursiva. Em casa, façam laços e pontes e escrevam o nome como a professora ensina.",
      },
      {
        question: "Como ajudar sem virar dever de casa?",
        answer:
          "Leiam uma história por dia, brinquem com as sílabas (“o que começa como bola?”) e deixem a criança escrever a lista de compras ou um bilhete. O gosto pela leitura vale mais do que estar adiantado.",
      },
      {
        question: "E se ela ainda troca o b e o d?",
        answer:
          "É muito comum no 1º ano, e até depois. Trabalhem uma letra de cada vez, com uma pista (o b tem a “barriga” para a frente) e o jogo “Encontre a letra”.",
      },
    ],
  },
};
