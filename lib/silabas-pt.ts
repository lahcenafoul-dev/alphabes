// Portuguese syllables ("as sílabas"): the pages under /pt/silabas, in the
// order Brazilian schools teach reading (alfabetização): the vowels and the
// encontros vocálicos, the famílias silábicas (ba, be, bi, bo, bu), the
// dígrafos (ch, lh, nh, rr, ss, qu, gu), the nasal sounds (ã, ão, an, am…)
// and the sílabas complexas (pra, flor, mar, sol, escola, and the letters
// with more than one sound). Every page is Portuguese-only
// (docs/portuguese-plan.md).
//
// Word markup, shared with the French sounds and the Spanish syllables
// (components/sons/MarkedWord):
//   "[ch]ave"   highlights the letters the page is about
//               (on the initial-h page: the silent letter)
//   "bo|la"     splits a word into syllables
//
// Brazilian classrooms recite the families with open vowels ("bá, bé, bi,
// bó, bu"), and a browser voice reads a lone "be" as the letter name "bê", so
// family tiles and the syllable builder speak `ptSyllableSpoken(s)`.
//
// Data only (type imports are erased), so middleware, pages and tests can
// all use it.
import type { BuildWord } from "@/lib/silabas-es";
import type { SoundHunt, SoundTile, SoundWord } from "@/lib/sons-fr";

export type SilabaGroup = "base" | "digrafos" | "nasais" | "complexas" | "palavras";

export type PortugueseSyllablePage = {
  slug: string;
  /** Page heading. */
  title: string;
  /** <title> (the layout adds "| AlphaBes"). */
  metaTitle: string;
  /** What goes in the big block ("ba", "ch"…). */
  short: string;
  level: string;
  group: SilabaGroup;
  /** Card blurb and meta description. */
  summary: string;
  intro: string;
  /** Read by the "Ouvir" button. */
  spoken: string;
  /** How [brackets] are shown: the letters studied (default) or silent letters. */
  marks?: "sound" | "silent";
  words?: SoundWord[];
  rules?: string[];
  /** Syllable tables to listen to, one row per consonant or group. */
  tiles?: { title: string; items: SoundTile[] }[];
  /** Shows the consonant + vowel syllable builder. */
  builder?: boolean;
  /** "Monte a palavra" exercise. */
  build?: BuildWord[];
  /** "Bata palmas" exercise (words with | markup). */
  clap?: SoundWord[];
  hunt?: SoundHunt;
  sentence?: string;
  /** "Para a família" note. */
  tip: string;
  faq: { question: string; answer: string }[];
  /** Page slugs linked from the page. */
  related: string[];
};

export const SILABA_GROUPS: { id: SilabaGroup; title: string; blurb: string }[] = [
  {
    id: "base",
    title: "As vogais e as famílias silábicas",
    blurb: "As vogais, os encontros vocálicos e depois uma consoante com cada vogal: ba, be, bi, bo, bu. É assim que começa a alfabetização.",
  },
  {
    id: "digrafos",
    title: "Os dígrafos",
    blurb: "Duas letras com um som só: ch, lh, nh, rr, ss, qu e gu.",
  },
  {
    id: "nasais",
    title: "Os sons nasais",
    blurb: "O som que passa pelo nariz: o til (mão, maçã) e a vogal com m ou n (canto, campo).",
  },
  {
    id: "complexas",
    title: "As sílabas complexas",
    blurb: "Duas consoantes antes da vogal (prato, flor), consoantes no fim da sílaba (mar, escola, sol) e as letras com mais de um som (c, g, x, h).",
  },
  {
    id: "palavras",
    title: "Ler com fluência",
    blurb: "As palavras curtas que aparecem em todas as frases.",
  },
];

/** Consonants and digraphs offered by the Portuguese syllable builder (c and g have pages of their own). */
export const PT_BUILDER_CONSONANTS = ["p", "b", "t", "d", "f", "v", "m", "n", "l", "s", "j", "r", "ch", "lh", "nh"];
export const PT_BUILDER_VOWELS = ["a", "e", "i", "o", "u"];

/** How a family syllable is said in class: "be" → "bé", "lho" → "lhó" (open e and o). */
export function ptSyllableSpoken(s: string): string {
  if (s.endsWith("e")) return `${s.slice(0, -1)}é`;
  if (s.endsWith("o")) return `${s.slice(0, -1)}ó`;
  return s;
}

const row = (title: string, syllables: string): { title: string; items: SoundTile[] } => ({
  title,
  items: syllables.split(" ").map((label) => {
    const spoken = ptSyllableSpoken(label);
    return spoken === label ? { label } : { label, spoken };
  }),
});

const w = (word: string, withArticle: string, emoji: string): SoundWord => ({ word, withArticle, emoji });
const yes = (word: string, withArticle: string, emoji: string) => ({ ...w(word, withArticle, emoji), answer: true });
const no = (word: string, withArticle: string, emoji: string) => ({ ...w(word, withArticle, emoji), answer: false });

export const portugueseSyllablePages: PortugueseSyllablePage[] = [
  // ——— As vogais e as famílias silábicas ———
  {
    slug: "vogais",
    title: "As vogais",
    metaTitle: "As vogais para crianças: a, e, i, o, u, com palavras e jogos",
    short: "a e i o u",
    level: "Educação infantil (3 a 5 anos)",
    group: "base",
    summary: "a, e, i, o, u: as cinco vogais. Toda sílaba tem pelo menos uma, e o e e o o têm som aberto e fechado.",
    intro:
      "O português tem cinco letras vogais: a, e, i, o, u. Toda sílaba tem pelo menos uma vogal. O e e o o têm dois sons, aberto e fechado (é, ê; ó, ô), e todas as vogais podem ficar nasais, com o som passando pelo nariz, como em mãe e canto.",
    spoken: "a, e, i, o, u. a de abelha. e de elefante. i de ilha. o de ovo. u de uva.",
    tiles: [
      {
        title: "Ouça as vogais",
        items: [
          { label: "a", note: "abelha" },
          { label: "e", spoken: "é", note: "elefante" },
          { label: "i", note: "ilha" },
          { label: "o", spoken: "ó", note: "ovo" },
          { label: "u", note: "uva" },
        ],
      },
      {
        title: "Abertas e fechadas",
        items: [
          { label: "é", spoken: "é. café.", note: "café" },
          { label: "ê", spoken: "ê. você.", note: "você" },
          { label: "ó", spoken: "ó. avó.", note: "avó" },
          { label: "ô", spoken: "ô. avô.", note: "avô" },
        ],
      },
    ],
    words: [
      w("[a]belha", "uma abelha", "🐝"),
      w("[e]lefante", "um elefante", "🐘"),
      w("[i]lha", "uma ilha", "🏝️"),
      w("[o]vo", "um ovo", "🥚"),
      w("[u]va", "uma uva", "🍇"),
      w("[o]velha", "uma ovelha", "🐑"),
    ],
    hunt: {
      question: "Quais palavras começam com vogal?",
      yes: "Sim: “{mot}” começa com vogal.",
      no: "Não: “{mot}” começa com consoante.",
      items: [
        yes("urso", "um urso", "🐻"),
        no("gato", "um gato", "🐱"),
        yes("iguana", "uma iguana", "🦎"),
        no("lua", "a lua", "🌙"),
        yes("abacaxi", "um abacaxi", "🍍"),
        no("pato", "um pato", "🦆"),
      ],
    },
    sentence: "Eva viu a uva.",
    tip: "Cantem juntos uma música das vogais e façam um gesto para cada uma: boca bem aberta no a, sorriso no i, boca redonda no o, biquinho no u. Com as vogais bem aprendidas, as famílias silábicas ficam muito mais fáceis.",
    faq: [
      {
        question: "Quantas vogais tem o português?",
        answer: "Cinco letras vogais: a, e, i, o, u. Mas os sons são mais: o e e o o podem ser abertos (é, ó) ou fechados (ê, ô), e todas as vogais podem ser nasais (ã, en, im, õ, um). Por isso a criança vai aprendendo os acentos aos poucos.",
      },
      {
        question: "Com que idade se aprendem as vogais?",
        answer: "Muitas crianças as reconhecem entre 3 e 5 anos, na educação infantil. Primeiro aprendem a ouvi-las no começo das palavras, depois a reconhecê-las escritas.",
      },
    ],
    related: ["encontros-vocalicos", "familias-silabicas"],
  },
  {
    slug: "encontros-vocalicos",
    title: "Os encontros vocálicos",
    metaTitle: "Encontros vocálicos: ai, ei, oi, ou, au, eu, ui, com palavras",
    short: "ai",
    level: "Educação infantil e pré-escola (4 a 6 anos)",
    group: "base",
    summary: "ai, ei, oi, ou, au, eu, ui: duas vogais juntas na mesma sílaba, como em pai, rei e boi.",
    intro:
      "Duas vogais juntas formam um encontro vocálico: ai (pai), ei (rei), oi (boi), ou (ouro), au (mau), eu (chapéu), ui (fui). Elas são lidas de uma vez, na mesma sílaba. Muitas escolas ensinam os encontros vocálicos logo depois das vogais, porque com eles a criança já lê palavras inteiras: oi, ai, eu.",
    spoken: "ai. ei. oi. ou. au. eu. ui. pai. rei. boi.",
    tiles: [
      {
        title: "Os encontros",
        items: [
          { label: "ai", note: "pai" },
          { label: "ei", note: "rei" },
          { label: "oi", note: "boi" },
          { label: "ou", note: "ouro" },
          { label: "au", note: "mau" },
          { label: "eu", note: "chapéu" },
          { label: "ui", note: "fui" },
        ],
      },
    ],
    words: [
      w("p[ai]", "o pai", "👨"),
      w("r[ei]", "um rei", "👑"),
      w("b[oi]", "um boi", "🐂"),
      w("[ou]ro", "o ouro", "🥇"),
      w("chap[éu]", "um chapéu", "🎩"),
      w("p[ei]xe", "um peixe", "🐟"),
    ],
    sentence: "O rei e o boi viram o peixe.",
    tip: "Brinquem de eco: você diz “ai!” e a criança repete; depois “ei!”, “oi!”, “ui!”. São palavras que as crianças já usam, e fica fácil reconhecê-las escritas.",
    faq: [
      {
        question: "O que é um encontro vocálico?",
        answer: "É quando duas ou três vogais aparecem juntas numa palavra. Quando ficam na mesma sílaba, como em pai e boi, formam um ditongo; quando se separam, como em sa-ú-de, formam um hiato. Para a criança, basta ler os grupos juntos.",
      },
      {
        question: "Por que se ensinam antes das consoantes?",
        answer: "Porque, com as vogais e os encontros vocálicos, a criança já lê e escreve palavras e expressões de verdade, como oi, ai, eu e au-au. Isso a motiva antes de chegar às famílias silábicas.",
      },
    ],
    related: ["vogais", "familias-silabicas"],
  },
  {
    slug: "familias-silabicas",
    title: "As famílias silábicas",
    metaTitle: "Famílias silábicas: ba, be, bi, bo, bu para começar a ler",
    short: "ba",
    level: "Pré-escola e 1º ano (5 a 6 anos)",
    group: "base",
    summary: "Uma consoante com as cinco vogais forma uma família: ba, be, bi, bo, bu. É o coração da alfabetização no Brasil.",
    intro:
      "Juntando uma consoante com cada vogal, nasce uma família silábica: b com a faz ba, e a família do B é ba, be, bi, bo, bu. Com poucas famílias a criança já lê palavras de verdade: bola, pato, dado, mala, sapo.",
    spoken: "bá, bé, bi, bó, bu. bó, la: bola.",
    builder: true,
    tiles: [
      row("A família do B", "ba be bi bo bu"),
      row("A família do P", "pa pe pi po pu"),
      row("A família do T", "ta te ti to tu"),
      row("A família do D", "da de di do du"),
      row("A família do M", "ma me mi mo mu"),
      row("A família do L", "la le li lo lu"),
    ],
    words: [
      w("bo|la", "uma bola", "⚽"),
      w("pa|to", "um pato", "🦆"),
      w("da|do", "um dado", "🎲"),
      w("ma|la", "uma mala", "🧳"),
      w("sa|po", "um sapo", "🐸"),
      w("ja|ne|la", "uma janela", "🪟"),
    ],
    build: [
      { word: "bola", withArticle: "uma bola", emoji: "⚽", syllables: ["bo", "la"], extra: ["ba", "lo"] },
      { word: "pato", withArticle: "um pato", emoji: "🦆", syllables: ["pa", "to"], extra: ["po", "ta"] },
      { word: "dado", withArticle: "um dado", emoji: "🎲", syllables: ["da", "do"], extra: ["de", "di"] },
      { word: "mala", withArticle: "uma mala", emoji: "🧳", syllables: ["ma", "la"], extra: ["mo", "le"] },
      { word: "sapo", withArticle: "um sapo", emoji: "🐸", syllables: ["sa", "po"], extra: ["so", "pi"] },
      { word: "foca", withArticle: "uma foca", emoji: "🦭", syllables: ["fo", "ca"], extra: ["fa", "co"] },
      { word: "tomate", withArticle: "um tomate", emoji: "🍅", syllables: ["to", "ma", "te"], extra: ["ta", "mo"] },
      { word: "janela", withArticle: "uma janela", emoji: "🪟", syllables: ["ja", "ne", "la"], extra: ["jo", "na"] },
    ],
    sentence: "A babá deu a bola ao bebê.",
    tip: "Para juntar a consoante com a vogal, prolonguem a consoante e deslizem para a vogal: “mmmma”. Por isso algumas professoras começam por famílias de sons que se esticam, como M, F, S, V e L. Dez minutos por dia bastam.",
    faq: [
      {
        question: "Em que ordem se ensinam as famílias silábicas?",
        answer: "Cada escola tem a sua ordem. Muitas começam pelas famílias do P, do B, do T e do D; outras pelo M, pelo L e pelo F. O importante é que cada família nova sirva para ler palavras com as famílias já conhecidas.",
      },
      {
        question: "Ler por sílabas não é decorar?",
        answer: "Não, se a criança entende como a sílaba se forma: o som da consoante mais o som da vogal. Por isso vale montar e desmontar sílabas, como no jogo desta página, e não só recitar a família em coro.",
      },
    ],
    related: ["vogais", "contar-silabas", "encontros-com-r"],
  },
  {
    slug: "contar-silabas",
    title: "Bata palmas para as sílabas",
    metaTitle: "Contar sílabas batendo palmas: jogo para a educação infantil",
    short: "👏",
    level: "Educação infantil e pré-escola (4 a 6 anos)",
    group: "base",
    summary: "Uma palma para cada sílaba: sol, uma palma; bor-bo-le-ta, quatro. Um jogo de ouvido antes de ler.",
    intro:
      "Antes de ler, a criança aprende a ouvir que as palavras são feitas de pedacinhos: as sílabas. Bate-se uma palma para cada sílaba. Sol tem uma, ca-sa tem duas, bor-bo-le-ta tem quatro. Não é preciso saber ler: é um jogo de ouvido.",
    spoken: "sol. ca, sa: casa. bor, bo, le, ta: borboleta.",
    clap: [
      w("sol", "o sol", "☀️"),
      w("ca|sa", "uma casa", "🏠"),
      w("ca|va|lo", "um cavalo", "🐴"),
      w("bor|bo|le|ta", "uma borboleta", "🦋"),
      w("flor", "uma flor", "🌸"),
      w("co|e|lho", "um coelho", "🐰"),
      w("hi|po|pó|ta|mo", "um hipopótamo", "🦛"),
      w("ga|to", "um gato", "🐱"),
      w("e|le|fan|te", "um elefante", "🐘"),
      w("tar|ta|ru|ga", "uma tartaruga", "🐢"),
    ],
    words: [
      w("sol", "o sol", "☀️"),
      w("ca|sa", "uma casa", "🏠"),
      w("ca|va|lo", "um cavalo", "🐴"),
      w("bor|bo|le|ta", "uma borboleta", "🦋"),
    ],
    tip: "Batam palmas também para os nomes da família: Lu-cas, duas palmas; Ma-ri-a, três. Dá para pular, bater no tambor ou dar passos em vez de bater palmas. É um dos melhores exercícios para preparar a leitura.",
    faq: [
      {
        question: "Para que serve contar sílabas?",
        answer: "Ajuda a criança a perceber que as palavras podem ser divididas em pedaços, que é exatamente o que ela faz ao ler pelas famílias silábicas. É um exercício de consciência fonológica, trabalhado na educação infantil.",
      },
      {
        question: "E se a criança bater uma palma a mais?",
        answer: "É normal no começo. Digam a palavra bem devagar, exagerando cada pedaço, e batam palmas juntos. Comecem com palavras de uma e de duas sílabas.",
      },
    ],
    related: ["vogais", "familias-silabicas"],
  },

  // ——— Os dígrafos ———
  {
    slug: "ch",
    title: "O CH",
    metaTitle: "O dígrafo CH: cha, che, chi, cho, chu, com palavras",
    short: "ch",
    level: "1º ano (6 a 7 anos)",
    group: "digrafos",
    summary: "c e h juntos fazem um só som, o mesmo do x de xícara: chave, chuva, bicho.",
    intro:
      "Quando o c e o h aparecem juntos, eles formam um dígrafo: duas letras com um som só. O ch soa como o x de xícara: chave, chuva, chocolate. A família do ch é cha, che, chi, cho, chu.",
    spoken: "chá, ché, chi, chó, chu. chave. chuva.",
    tiles: [row("A família do CH", "cha che chi cho chu")],
    words: [
      w("[ch]ave", "uma chave", "🔑"),
      w("[ch]uva", "a chuva", "🌧️"),
      w("[ch]ocolate", "um chocolate", "🍫"),
      w("bi[ch]o", "um bicho", "🐛"),
      w("[ch]apéu", "um chapéu", "🎩"),
      w("ca[ch]orro", "um cachorro", "🐶"),
    ],
    rules: [
      "O ch tem um só som, o mesmo do x em xícara.",
      "Não há regra para saber se é ch ou x: chuva e xícara se aprendem vendo as palavras escritas.",
    ],
    hunt: {
      question: "Em quais palavras você ouve o som do ch?",
      yes: "Sim: “{mot}” tem o som do ch.",
      no: "Não: “{mot}” não tem esse som.",
      items: [
        yes("chave", "uma chave", "🔑"),
        yes("cachorro", "um cachorro", "🐶"),
        no("gato", "um gato", "🐱"),
        yes("chinelo", "um chinelo", "🩴"),
        no("mesa", "uma mesa", "🪑"),
        yes("peixe", "um peixe", "🐟"),
      ],
    },
    sentence: "O cachorro achou a chave na chuva.",
    tip: "Peça para a criança fazer “chhhh”, como quem pede silêncio: é o som do ch. Depois procurem palavras com esse som em casa: chave, chinelo, chuveiro.",
    faq: [
      {
        question: "Qual é a diferença entre CH e X?",
        answer: "Em palavras como chuva e xícara, os dois têm o mesmo som. A escolha depende da palavra e se aprende lendo. Algumas pistas: depois de ditongo usa-se x (caixa, peixe) e depois de en também (enxada).",
      },
      {
        question: "O que é um dígrafo?",
        answer: "São duas letras que representam um só som: ch, lh, nh, rr, ss, e qu e gu quando o u não soa. A criança aprende a ler cada dígrafo como um bloco.",
      },
    ],
    related: ["lh", "nh", "x"],
  },
  {
    slug: "lh",
    title: "O LH",
    metaTitle: "O dígrafo LH: lha, lhe, lhi, lho, lhu, com palavras",
    short: "lh",
    level: "1º ano (6 a 7 anos)",
    group: "digrafos",
    summary: "l e h juntos fazem o som de filho, palha e coelho: lha, lhe, lhi, lho, lhu.",
    intro:
      "O lh é um dígrafo com um som próprio, que nenhuma letra tem sozinha: a língua encosta no céu da boca e o som sai pelos lados, como em filho, palha e coelho. Ele quase sempre aparece no meio da palavra.",
    spoken: "lhá, lhé, lhi, lhó, lhu. palhaço. coelho.",
    tiles: [row("A família do LH", "lha lhe lhi lho lhu")],
    words: [
      w("pa[lh]aço", "um palhaço", "🤡"),
      w("coe[lh]o", "um coelho", "🐰"),
      w("abe[lh]a", "uma abelha", "🐝"),
      w("o[lh]o", "um olho", "👁️"),
      w("ove[lh]a", "uma ovelha", "🐑"),
      w("fo[lh]a", "uma folha", "🍃"),
    ],
    hunt: {
      question: "Em quais palavras você ouve o lh?",
      yes: "Sim: “{mot}” tem lh.",
      no: "Não: “{mot}” não tem lh.",
      items: [
        yes("abelha", "uma abelha", "🐝"),
        no("bola", "uma bola", "⚽"),
        yes("ovelha", "uma ovelha", "🐑"),
        no("lua", "a lua", "🌙"),
        yes("folha", "uma folha", "🍃"),
        no("sol", "o sol", "☀️"),
      ],
    },
    sentence: "A abelha e o coelho olham a folha.",
    tip: "Comparem li e lh com pares como óleo e olho, ou Júlio e julho. Diga as duas palavras devagar e peça para a criança dizer qual é qual.",
    faq: [
      {
        question: "Por que a criança escreve “olio” em vez de olho?",
        answer: "Porque os sons de li e lh são parecidos para quem está começando. Trabalhem pares como óleo e olho: falando devagar e olhando a boca, a criança percebe a diferença.",
      },
      {
        question: "O LH aparece no começo das palavras?",
        answer: "Quase nunca: só em palavras raras, como lhama. Em geral ele vem no meio da palavra: filho, palha, coelho.",
      },
    ],
    related: ["nh", "ch", "al-el-il-ol-ul"],
  },
  {
    slug: "nh",
    title: "O NH",
    metaTitle: "O dígrafo NH: nha, nhe, nhi, nho, nhu, com palavras",
    short: "nh",
    level: "1º ano (6 a 7 anos)",
    group: "digrafos",
    summary: "n e h juntos fazem o som de ninho, galinha e banho: nha, nhe, nhi, nho, nhu.",
    intro:
      "O nh é um dígrafo: n e h juntos formam um som nasal, como em ninho, galinha e banho. É o mesmo som do ñ do espanhol. Ele aparece no meio das palavras.",
    spoken: "nhá, nhé, nhi, nhó, nhu. galinha. ninho.",
    tiles: [row("A família do NH", "nha nhe nhi nho nhu")],
    words: [
      w("ni[nh]o", "um ninho", "🪺"),
      w("gali[nh]a", "uma galinha", "🐔"),
      w("ara[nh]a", "uma aranha", "🕷️"),
      w("ba[nh]o", "um banho", "🛁"),
      w("mi[nh]oca", "uma minhoca", "🪱"),
      w("u[nh]a", "uma unha", "💅"),
    ],
    hunt: {
      question: "Em quais palavras você ouve o nh?",
      yes: "Sim: “{mot}” tem nh.",
      no: "Não: “{mot}” não tem nh.",
      items: [
        yes("galinha", "uma galinha", "🐔"),
        no("nuvem", "uma nuvem", "☁️"),
        yes("aranha", "uma aranha", "🕷️"),
        no("sono", "o sono", "😴"),
        yes("sonho", "um sonho", "💭"),
        no("lua", "a lua", "🌙"),
      ],
    },
    sentence: "A galinha e a aranha veem o ninho.",
    tip: "Brinquem com pares que só mudam no nh: sono e sonho, mina e minha. Falem devagar e procurem juntos a diferença.",
    faq: [
      {
        question: "Qual é a diferença entre NH e NI?",
        answer: "Em palavras como Antônio e sonho, os sons são parecidos, e a criança pode trocar. Trabalhem pares como sono e sonho; falando devagar, ela percebe que o nh é um som só.",
      },
      {
        question: "Por que o H muda o som do N?",
        answer: "Porque juntos eles formam um dígrafo, uma dupla de letras com um som só. O português usa o h assim em três dígrafos: ch, lh e nh.",
      },
    ],
    related: ["lh", "ch", "an-en-in-on-un"],
  },
  {
    slug: "rr",
    title: "O R forte e o RR",
    metaTitle: "R forte, R fraco e RR: rato, caro, carro, com palavras",
    short: "rr",
    level: "1º ano (6 a 7 anos)",
    group: "digrafos",
    summary: "O r é forte no começo da palavra (rato) e no rr (carro), e fraco entre vogais (caro). Quando se escreve rr?",
    intro:
      "A letra r tem dois sons. No começo da palavra ela é forte: rato, roda, rua. Entre duas vogais, um r só é fraco, batido: caro, barata, pera. Para ter o som forte entre vogais, escreve-se rr: carro, terra, cachorro. O rr é um dígrafo: duas letras, um som.",
    spoken: "rato. caro. carro. rá, ré, ri, ró, ru.",
    tiles: [row("R forte no começo da palavra", "ra re ri ro ru"), row("RR entre vogais", "rra rre rri rro rru")],
    words: [
      w("[r]ato", "um rato", "🐭"),
      w("[r]oda", "uma roda", "🛞"),
      w("ca[rr]o", "um carro", "🚗"),
      w("te[rr]a", "a Terra", "🌍"),
      w("cacho[rr]o", "um cachorro", "🐶"),
      w("pe[r]a", "uma pera", "🍐"),
    ],
    rules: [
      "No começo da palavra, um r só já é forte: rato, rua.",
      "Entre vogais, um r só é fraco (caro); para o som forte, escreve-se rr (carro).",
      "O rr nunca começa uma palavra.",
    ],
    hunt: {
      question: "Em quais palavras o r é forte?",
      yes: "Sim: em “{mot}” o r é forte.",
      no: "Não: em “{mot}” o r é fraco.",
      items: [
        yes("carro", "um carro", "🚗"),
        no("pera", "uma pera", "🍐"),
        yes("rato", "um rato", "🐭"),
        no("arara", "uma arara", "🦜"),
        yes("terra", "a Terra", "🌍"),
        no("coroa", "uma coroa", "👑"),
      ],
    },
    sentence: "O rato correu na terra atrás do carro.",
    tip: "Comparem caro e carro, muro e murro: a diferença é só o som do r. Diga as duas palavras e peça para a criança dizer qual tem o r “forte”.",
    faq: [
      {
        question: "Por que o R forte soa diferente em cada região?",
        answer: "O r forte é pronunciado de vários jeitos no Brasil: como um h soprado (no Rio e em boa parte do país), vibrando na ponta da língua (em partes do Sul) ou de outras formas. Todos estão certos, e todos se escrevem com r no começo ou rr no meio.",
      },
      {
        question: "E o R no fim da sílaba?",
        answer: "No fim da sílaba, como em mar, porta e comer, o r também muda conforme a região. Esse caso tem uma página própria: ar, er, ir, or, ur.",
      },
    ],
    related: ["ar-er-ir-or-ur", "ss", "encontros-com-r"],
  },
  {
    slug: "ss",
    title: "O SS e o S com som de Z",
    metaTitle: "S com som de Z e o dígrafo SS: casa, rosa, pássaro, osso",
    short: "ss",
    level: "1º ano (6 a 7 anos)",
    group: "digrafos",
    summary: "Entre vogais, um s só soa como z (casa); para o som de s, escreve-se ss (pássaro).",
    intro:
      "No começo da palavra, o s tem o som de s: sapo, sol. Mas entre duas vogais, um s só soa como z: casa, mesa, rosa. Para manter o som de s entre vogais, escreve-se ss: pássaro, osso, vassoura. O ss é um dígrafo: duas letras, um som.",
    spoken: "casa. rosa. pássaro. osso.",
    tiles: [
      {
        title: "Ouça a diferença",
        items: [
          { label: "casa", note: "som de z" },
          { label: "rosa", note: "som de z" },
          { label: "osso", note: "som de s" },
          { label: "pássaro", note: "som de s" },
        ],
      },
    ],
    words: [
      w("ca[s]a", "uma casa", "🏠"),
      w("ro[s]a", "uma rosa", "🌹"),
      w("me[s]a", "uma mesa", "🪑"),
      w("pá[ss]aro", "um pássaro", "🐦"),
      w("o[ss]o", "um osso", "🦴"),
      w("va[ss]oura", "uma vassoura", "🧹"),
    ],
    rules: [
      "Entre duas vogais, um s só tem som de z: casa, mesa.",
      "Para o som de s entre vogais, escreve-se ss: pássaro, osso.",
      "O ss nunca começa nem termina uma palavra.",
    ],
    hunt: {
      question: "Em quais palavras o s tem som de z?",
      yes: "Sim: em “{mot}” o s soa como z.",
      no: "Não: em “{mot}” o s soa como s.",
      items: [
        yes("casa", "uma casa", "🏠"),
        no("osso", "um osso", "🦴"),
        yes("rosa", "uma rosa", "🌹"),
        no("pássaro", "um pássaro", "🐦"),
        yes("mesa", "uma mesa", "🪑"),
        no("sapo", "um sapo", "🐸"),
      ],
    },
    sentence: "O pássaro pousou na mesa da casa.",
    tip: "Leiam juntos asa e assa: com um s, zumbido de abelha (zzz); com dois, assobio de cobra (sss). Pares assim ajudam a criança a ouvir por que o ss existe.",
    faq: [
      {
        question: "Por que o S entre vogais soa como Z?",
        answer: "É uma regra antiga da língua portuguesa: um s sozinho entre vogais é pronunciado [z]. Por isso existem o ss, o ç e o c antes de e e i para o som de s no meio das palavras: pássaro, moço, vacina.",
      },
      {
        question: "Quando se usa SS, Ç ou C?",
        answer: "Os três têm som de s entre vogais, e a escolha depende da palavra: pássaro, maçã, vacina. Há algumas pistas (o ç nunca vem antes de e e i), mas a maior parte se aprende lendo.",
      },
    ],
    related: ["c-e-cedilha", "rr", "as-es-is-os-us"],
  },
  {
    slug: "qu",
    title: "QUE, QUI, QUA",
    metaTitle: "QUE, QUI e QUA: o u que não soa e o u que soa",
    short: "qu",
    level: "1º ano (6 a 7 anos)",
    group: "digrafos",
    summary: "Em que e qui o u não soa (queijo, esquilo); em qua e quo ele soa (quatro, aquário).",
    intro:
      "A letra q vem sempre com o u. Em que e qui o u é mudo, e as duas letras fazem o som de k: queijo, esquilo, moleque. Em qua e quo o u soa: quatro, quadro, aquário. Por isso dizemos que, em que e qui, o qu é um dígrafo.",
    spoken: "que, qui. queijo. esquilo. qua: quatro.",
    tiles: [row("O u não soa", "que qui"), row("O u soa", "qua quo")],
    words: [
      w("[qu]eijo", "um queijo", "🧀"),
      w("es[qu]ilo", "um esquilo", "🐿️"),
      w("mos[qu]ito", "um mosquito", "🦟"),
      w("[qu]atro", "o número quatro", "4️⃣"),
      w("a[qu]ário", "um aquário", "🐠"),
      w("[qu]adrado", "um quadrado", "🟥"),
    ],
    rules: [
      "O q sempre vem com o u.",
      "Em que e qui, o u não soa: queijo, esquilo.",
      "Em qua e quo, o u soa: quatro, quando.",
    ],
    hunt: {
      question: "Em quais palavras o u do qu não soa?",
      yes: "Sim: em “{mot}” o u fica mudo.",
      no: "Não: em “{mot}” o u soa.",
      items: [
        yes("queijo", "um queijo", "🧀"),
        no("quatro", "o número quatro", "4️⃣"),
        yes("esquilo", "um esquilo", "🐿️"),
        no("aquário", "um aquário", "🐠"),
        yes("mosquito", "um mosquito", "🦟"),
        no("quadrado", "um quadrado", "🟥"),
      ],
    },
    sentence: "O esquilo comeu o queijo no quintal.",
    tip: "Apresente o qu como uma dupla inseparável. Depois brinquem de detetive: em queijo e esquilo o u está “dormindo”; em quatro e aquário ele “acorda”.",
    faq: [
      {
        question: "Por que se escreve queijo e não “keijo”?",
        answer: "Porque, em português, o som de k antes de e e i se escreve qu. Antes de a, o, u, ele se escreve com c: casa, cola, cubo. O k só aparece em nomes e em palavras de outras línguas.",
      },
      {
        question: "O que aconteceu com o trema?",
        answer: "O trema (ü), que mostrava o u pronunciado em palavras como “cinqüenta”, foi abolido pelo Acordo Ortográfico, em vigor no Brasil desde 2009. Hoje se escreve cinquenta e tranquilo, e o leitor aprende com a prática quando o u soa.",
      },
    ],
    related: ["c-e-cedilha", "gu", "ch"],
  },
  {
    slug: "gu",
    title: "GUE, GUI, GUA",
    metaTitle: "GUE, GUI e GUA: o u que não soa e o u que soa",
    short: "gu",
    level: "1º ano (6 a 7 anos)",
    group: "digrafos",
    summary: "Em gue e gui o u não soa (guitarra, foguete): assim o g mantém o som de gato antes de e e i.",
    intro:
      "Antes de e e de i, o g soa como j (gelo, girafa). Para manter o som de gato, escreve-se gu: guerra, guitarra, foguete. Nesses casos o u não é pronunciado. Em gua o u soa: água, guarda-chuva.",
    spoken: "gue, gui. guitarra. foguete. gua: água.",
    tiles: [row("O u não soa", "gue gui"), row("O u soa", "gua guo")],
    words: [
      w("[gu]itarra", "uma guitarra", "🎸"),
      w("fo[gu]ete", "um foguete", "🚀"),
      w("fo[gu]eira", "uma fogueira", "🔥"),
      w("pre[gu]iça", "uma preguiça", "🦥"),
      w("á[gu]a", "a água", "💧"),
      w("[gu]arda-chuva", "um guarda-chuva", "☂️"),
    ],
    rules: [
      "Antes de e e i, o g soa como j: gelo, girafa.",
      "Para o som de gato antes de e e i, escreve-se gu: guerra, guitarra (o u não soa).",
      "Em gua, o u soa: água, guarda-chuva.",
    ],
    hunt: {
      question: "Em quais palavras o u do gu não soa?",
      yes: "Sim: em “{mot}” o u fica mudo.",
      no: "Não: em “{mot}” o u soa.",
      items: [
        yes("guitarra", "uma guitarra", "🎸"),
        no("água", "a água", "💧"),
        yes("foguete", "um foguete", "🚀"),
        no("guarda-chuva", "um guarda-chuva", "☂️"),
        yes("preguiça", "uma preguiça", "🦥"),
        no("pinguim", "um pinguim", "🐧"),
      ],
    },
    sentence: "O foguete passou sobre a fogueira.",
    tip: "Mostre a família do g com som de gato: ga, gue, gui, go, gu. Escrevam juntos e circulem o u que não soa.",
    faq: [
      {
        question: "Como saber se o U do GU é pronunciado?",
        answer: "Na maioria das palavras com gue e gui o u é mudo (guerra, guitarra). Em algumas ele soa, como em pinguim e linguiça. Desde o Acordo Ortográfico não há mais trema para avisar, então a criança aprende essas palavras de ouvido.",
      },
      {
        question: "Por que não se escreve “gitarra”?",
        answer: "Porque gi soaria “ji”, como em girafa. O u entre o g e o i serve para manter o som de gato.",
      },
    ],
    related: ["g-e-j", "qu"],
  },

  // ——— Os sons nasais ———
  {
    slug: "til",
    title: "O til: ã, õ, ão, ãe, õe",
    metaTitle: "O til e o som nasal: ã, õ, ão, ãe, õe (mão, maçã, limões)",
    short: "ão",
    level: "1º ano (6 a 7 anos)",
    group: "nasais",
    summary: "O til mostra o som que passa pelo nariz: maçã, mão, mãe, limões. O ão é um dos sons mais comuns do português.",
    intro:
      "O til (~) em cima do a e do o mostra que o som é nasal: ele passa pelo nariz. Aparece sozinho (maçã, irmã) e nos grupos ão, ãe e õe: mão, pão, mãe, limões. O ão está em muitas palavras que a criança conhece: balão, avião, leão, feijão.",
    spoken: "ã. ão. ãe. õe. mão. mãe. limões.",
    tiles: [
      {
        title: "Os sons com til",
        items: [
          { label: "ã", note: "maçã" },
          { label: "ão", note: "mão" },
          { label: "ãe", note: "mãe" },
          { label: "õe", note: "limões" },
        ],
      },
    ],
    words: [
      w("maç[ã]", "uma maçã", "🍎"),
      w("m[ão]", "uma mão", "✋"),
      w("p[ão]", "um pão", "🍞"),
      w("bal[ão]", "um balão", "🎈"),
      w("le[ão]", "um leão", "🦁"),
      w("lim[õe]s", "os limões", "🍋"),
    ],
    hunt: {
      question: "Em quais palavras você ouve o ão?",
      yes: "Sim: “{mot}” tem ão.",
      no: "Não: “{mot}” não tem ão.",
      items: [
        yes("avião", "um avião", "✈️"),
        no("bola", "uma bola", "⚽"),
        yes("feijão", "o feijão", "🫘"),
        no("pato", "um pato", "🦆"),
        yes("sabão", "um sabão", "🧼"),
        no("lua", "a lua", "🌙"),
      ],
    },
    sentence: "O leão comeu pão com a mão.",
    tip: "Brinquem de tapar o nariz: falando “mão” com o nariz tapado, o som muda, porque ele passa pelo nariz. É um jeito divertido de sentir o som nasal.",
    faq: [
      {
        question: "O til é um acento?",
        answer: "Não é bem um acento: ele não mostra a sílaba mais forte, e sim que a vogal é nasal. Mas, como os acentos, fica em cima da vogal e não cria uma letra nova.",
      },
      {
        question: "Como fica o plural das palavras com ão?",
        answer: "Varia: mão vira mãos, pão vira pães, limão vira limões. A criança vai aprendendo palavra por palavra; no começo, basta ler o ão sem tropeçar.",
      },
    ],
    related: ["an-en-in-on-un", "am-em-im-om-um"],
  },
  {
    slug: "an-en-in-on-un",
    title: "AN, EN, IN, ON, UN",
    metaTitle: "Sons nasais com N: an, en, in, on, un (canto, dente, onça)",
    short: "an",
    level: "1º ano (6 a 7 anos)",
    group: "nasais",
    summary: "Uma vogal com n no fim da sílaba fica nasal: anjo, dente, pintinho, onça, mundo.",
    intro:
      "Quando o n vem no fim da sílaba, ele não soa como n: ele deixa a vogal de antes nasal, com o som passando pelo nariz. É assim em an (anjo), en (dente), in (pintinho), on (onça) e un (mundo).",
    spoken: "an. en. in. on. un. anjo. dente. onça. mundo.",
    tiles: [
      {
        title: "Ouça os sons nasais",
        items: [
          { label: "an", note: "anjo" },
          { label: "en", note: "dente" },
          { label: "in", note: "pintinho" },
          { label: "on", note: "onça" },
          { label: "un", note: "mundo" },
        ],
      },
    ],
    words: [
      w("[an]jo", "um anjo", "👼"),
      w("d[en]te", "um dente", "🦷"),
      w("p[in]tinho", "um pintinho", "🐥"),
      w("[on]ça", "uma onça", "🐆"),
      w("m[un]do", "o mundo", "🌎"),
      w("elef[an]te", "um elefante", "🐘"),
    ],
    rules: [
      "Antes de consoante, a vogal com n fica nasal: anjo, dente.",
      "Antes de p e b, usa-se m, não n: campo, bombom (veja am, em, im, om, um).",
    ],
    sentence: "O anjo e a onça contam até cinco.",
    tip: "Peça para a criança dizer “aaanjo” bem devagar, com a mão no nariz: ela vai sentir o nariz vibrar no an.",
    faq: [
      {
        question: "O N do fim da sílaba é pronunciado?",
        answer: "Não como um n de verdade: ele só deixa a vogal nasal. Por isso a criança às vezes esquece de escrevê-lo (“dete” em vez de dente). Falar devagar e sentir o nariz ajuda.",
      },
      {
        question: "Qual é a diferença entre AN e Ã?",
        answer: "O som é o mesmo, nasal. A diferença está na escrita: o til aparece em geral no fim da palavra (maçã, irmã) e nos grupos ão, ãe e õe; o an, en, in, on e un aparecem antes de consoante (anjo, dente).",
      },
    ],
    related: ["til", "am-em-im-om-um"],
  },
  {
    slug: "am-em-im-om-um",
    title: "AM, EM, IM, OM, UM",
    metaTitle: "M antes de P e B: am, em, im, om, um (campo, bombom, jardim)",
    short: "am",
    level: "1º e 2º ano (6 a 8 anos)",
    group: "nasais",
    summary: "Antes de p e b, sempre m: campo, tambor, bombom. E no fim das palavras: homem, jardim.",
    intro:
      "O m no fim da sílaba também deixa a vogal nasal. Ele aparece em dois lugares: antes de p e b (campo, tambor, lâmpada) e no fim das palavras (homem, jardim, bombom, algum). A regra que a criança aprende cedo: antes de p e b, só se escreve m.",
    spoken: "am. em. im. om. um. campo. tambor. bombom.",
    tiles: [row("Os sons com M", "am em im om um")],
    words: [
      w("[am]bulância", "uma ambulância", "🚑"),
      w("b[om]b[om]", "um bombom", "🍬"),
      w("p[om]ba", "uma pomba", "🕊️"),
      w("t[am]bor", "um tambor", "🥁"),
      w("l[âm]pada", "uma lâmpada", "💡"),
      w("jard[im]", "um jardim", "🌷"),
    ],
    rules: [
      "Antes de p e b, escreve-se sempre m: campo, tambor, lâmpada.",
      "No fim das palavras também se usa m: homem, jardim, bombom.",
      "Antes das outras consoantes, usa-se n: canto, ponte.",
    ],
    sentence: "A pomba pousou no tambor do jardim.",
    tip: "Transformem a regra em música: “Antes de P e B, M você vai escrever!”. Depois procurem palavras com mp e mb nos rótulos e nos livros: campo, empada, bombom.",
    faq: [
      {
        question: "Por que antes de P e B se usa M?",
        answer: "Porque m, p e b se fazem com os lábios fechados: a boca já está na posição certa. É uma das primeiras regras de ortografia que a criança aprende, no 1º ou no 2º ano.",
      },
      {
        question: "E o M no fim das palavras?",
        answer: "No fim das palavras, o m também deixa a vogal nasal: homem, jardim, bom, algum. Por isso o plural dessas palavras vira ns: homens, jardins.",
      },
    ],
    related: ["an-en-in-on-un", "til"],
  },

  // ——— As sílabas complexas ———
  {
    slug: "encontros-com-r",
    title: "Sílabas com BR, CR, DR, FR, GR, PR, TR, VR",
    metaTitle: "Encontros consonantais com R: bra, cra, dra, fra, gra, pra, tra",
    short: "tr",
    level: "1º e 2º ano (6 a 8 anos)",
    group: "complexas",
    summary: "bra, cra, dra, fra, gra, pra, tra, vra: duas consoantes antes da vogal, como em braço, dragão, fruta, prato, trem e livro.",
    intro:
      "Nas sílabas complexas, duas consoantes vêm antes da vogal. Os encontros com r são os mais comuns: br, cr, dr, fr, gr, pr, tr e vr. O r vem colado na consoante, sem vogal no meio: pra (prato), tre (trem), bra (braço).",
    spoken: "brá, crá, drá, frá, grá, prá, trá. prato. trem.",
    tiles: [
      row("BR", "bra bre bri bro bru"),
      row("CR", "cra cre cri cro cru"),
      row("DR", "dra dre dri dro dru"),
      row("FR", "fra fre fri fro fru"),
      row("GR", "gra gre gri gro gru"),
      row("PR", "pra pre pri pro pru"),
      row("TR", "tra tre tri tro tru"),
    ],
    words: [
      w("[br]aço", "um braço", "💪"),
      w("[dr]agão", "um dragão", "🐉"),
      w("[fr]uta", "uma fruta", "🍓"),
      w("[pr]ato", "um prato", "🍽️"),
      w("[tr]em", "um trem", "🚂"),
      w("li[vr]o", "um livro", "📖"),
    ],
    hunt: {
      question: "Em quais palavras há um encontro com r?",
      yes: "Sim: “{mot}” tem um encontro com r.",
      no: "Não: “{mot}” não tem.",
      items: [
        yes("prato", "um prato", "🍽️"),
        no("pato", "um pato", "🦆"),
        yes("trem", "um trem", "🚂"),
        no("gato", "um gato", "🐱"),
        yes("dragão", "um dragão", "🐉"),
        no("dado", "um dado", "🎲"),
      ],
    },
    sentence: "O dragão comeu a fruta do prato no trem.",
    tip: "Use pares que só mudam no r: pato e prato, fita e frita, pego e prego. Diga uma das palavras, e a criança mostra a figura certa ou escreve a palavra.",
    faq: [
      {
        question: "Por que a criança escreve “pato” em vez de prato?",
        answer: "Porque esquecer o r do encontro é uma das trocas mais comuns no começo. Trabalhem pares como pato e prato, falando bem devagar e mostrando a língua batendo no r.",
      },
      {
        question: "Quando se ensinam as sílabas complexas?",
        answer: "Em geral no 1º e no 2º ano, depois que a criança já lê bem as famílias silábicas simples (consoante + vogal). TR, PR e BR, as mais frequentes, costumam vir primeiro.",
      },
    ],
    related: ["encontros-com-l", "rr", "familias-silabicas"],
  },
  {
    slug: "encontros-com-l",
    title: "Sílabas com BL, CL, FL, GL, PL",
    metaTitle: "Encontros consonantais com L: bla, cla, fla, gla, pla",
    short: "bl",
    level: "1º e 2º ano (6 a 8 anos)",
    group: "complexas",
    summary: "bla, cla, fla, gla, pla: duas consoantes antes da vogal, como em bloco, bicicleta, flor, globo e planeta.",
    intro:
      "Os encontros com l são bl, cl, fl, gl e pl: bloco, bicicleta, flor, globo, planeta. Como nos encontros com r, a criança lê as duas consoantes juntas, sem vogal no meio: fl + o = flo, e flor.",
    spoken: "blá, clá, flá, glá, plá. flor. planeta.",
    tiles: [
      row("BL", "bla ble bli blo blu"),
      row("CL", "cla cle cli clo clu"),
      row("FL", "fla fle fli flo flu"),
      row("GL", "gla gle gli glo glu"),
      row("PL", "pla ple pli plo plu"),
    ],
    words: [
      w("[bl]oco", "um bloco", "🧱"),
      w("bici[cl]eta", "uma bicicleta", "🚲"),
      w("[fl]or", "uma flor", "🌸"),
      w("[gl]obo", "um globo", "🌐"),
      w("[pl]aneta", "um planeta", "🪐"),
      w("[fl]auta", "uma flauta", "🪈"),
    ],
    hunt: {
      question: "Em quais palavras há um encontro com l?",
      yes: "Sim: “{mot}” tem um encontro com l.",
      no: "Não: “{mot}” não tem.",
      items: [
        yes("flor", "uma flor", "🌸"),
        no("foca", "uma foca", "🦭"),
        yes("planeta", "um planeta", "🪐"),
        no("pato", "um pato", "🦆"),
        yes("bicicleta", "uma bicicleta", "🚲"),
        no("bola", "uma bola", "⚽"),
      ],
    },
    sentence: "Clara toca flauta no planeta azul.",
    tip: "Se a criança lê “fe-lor” em vez de flor, peça para ela falar as duas consoantes coladas, bem rápido: fl! Depois acrescente a vogal: flo, flor.",
    faq: [
      {
        question: "Por que a criança coloca uma vogal no meio (“pelaneta”)?",
        answer: "Porque é mais fácil dizer uma consoante de cada vez. É uma etapa normal; com a leitura em voz alta e pares como foca e flor, ela aprende a juntar as duas.",
      },
      {
        question: "Qual é a diferença entre os encontros e os dígrafos?",
        answer: "Nos encontros (pr, fl, tr…) as duas consoantes são pronunciadas. Nos dígrafos (ch, lh, nh…) as duas letras fazem um som só.",
      },
    ],
    related: ["encontros-com-r", "familias-silabicas"],
  },
  {
    slug: "ar-er-ir-or-ur",
    title: "AR, ER, IR, OR, UR",
    metaTitle: "O R no fim da sílaba: ar, er, ir, or, ur (mar, porta, sorvete)",
    short: "ar",
    level: "1º e 2º ano (6 a 8 anos)",
    group: "complexas",
    summary: "O r no fim da sílaba: barco, porta, sorvete, comer. Muitas crianças esquecem de escrevê-lo.",
    intro:
      "O r também aparece no fim da sílaba: mar, porta, barco, sorvete, comer. Nesse lugar o som muda muito de uma região para outra, e no fim dos verbos (comer, dormir) às vezes quase não se ouve. Por isso a criança precisa prestar atenção para não esquecer de escrevê-lo.",
    spoken: "ar. er. ir. or. ur. barco. porta. sorvete.",
    tiles: [row("O R no fim da sílaba", "ar er ir or ur")],
    words: [
      w("b[ar]co", "um barco", "⛵"),
      w("p[or]ta", "uma porta", "🚪"),
      w("s[or]vete", "um sorvete", "🍦"),
      w("t[ar]taruga", "uma tartaruga", "🐢"),
      w("[ar]co-íris", "um arco-íris", "🌈"),
      w("f[or]miga", "uma formiga", "🐜"),
    ],
    rules: [
      "No fim da sílaba, o r soa de jeitos diferentes conforme a região, mas sempre se escreve r.",
      "No fim dos verbos (comer, dormir), o r quase não se ouve na fala, mas é escrito.",
    ],
    sentence: "A tartaruga e a formiga tomam sorvete no barco.",
    tip: "Peça para a criança “esticar” o r: “baaarco”, “pooorta”. Depois escrevam juntos e circulem o r, que às vezes some na fala.",
    faq: [
      {
        question: "Por que a criança escreve “come” em vez de comer?",
        answer: "Porque, na fala de muitas regiões, o r no fim dos verbos quase não é pronunciado. Na escrita ele é obrigatório. Ler muitas vezes os verbos terminados em r (comer, brincar, dormir) ajuda.",
      },
      {
        question: "Qual é o som certo do R no fim da sílaba?",
        answer: "Não há um só: em porta, o r pode ser dito como um h soprado, com a língua enrolada (o r caipira) ou batido, conforme a região. Todos estão certos, e todos se escrevem com r.",
      },
    ],
    related: ["rr", "as-es-is-os-us", "al-el-il-ol-ul"],
  },
  {
    slug: "as-es-is-os-us",
    title: "AS, ES, IS, OS, US",
    metaTitle: "O S no fim da sílaba: as, es, is, os, us (escola, castelo, ônibus)",
    short: "es",
    level: "1º e 2º ano (6 a 8 anos)",
    group: "complexas",
    summary: "O s no fim da sílaba: escola, castelo, ônibus, e o plural: gatos, bolas.",
    intro:
      "O s também aparece no fim da sílaba: escola, castelo, mosca, e é a marca do plural: dois gatos, três bolas. Nesse lugar ele pode soar como s ou, em algumas regiões, como no Rio de Janeiro, como um x (“eshcola”).",
    spoken: "as. es. is. os. us. escola. castelo. ônibus.",
    tiles: [row("O S no fim da sílaba", "as es is os us")],
    words: [
      w("[es]cova", "uma escova", "🪥"),
      w("ca[s]telo", "um castelo", "🏰"),
      w("[es]trela", "uma estrela", "⭐"),
      w("[es]cola", "uma escola", "🏫"),
      w("m[os]ca", "uma mosca", "🪰"),
      w("ônib[us]", "um ônibus", "🚌"),
    ],
    rules: [
      "No fim da sílaba, o s pode soar como s ou como x, conforme a região: os dois estão certos.",
      "O s no fim das palavras marca o plural: gato, gatos; bola, bolas.",
    ],
    sentence: "As moscas voam no castelo da escola.",
    tip: "Brinquem de “um e muitos”: um gato, dois gatos; uma bola, três bolas. A criança percebe que o s no fim indica mais de um.",
    faq: [
      {
        question: "Por que no Rio o S parece um X?",
        answer: "É uma característica do sotaque carioca e de outras regiões: o s no fim da sílaba é pronunciado como um x (“pashta”, “doix”). A escrita não muda: é sempre s.",
      },
      {
        question: "Por que a criança escreve “scola”?",
        answer: "Muitas palavras começam com es seguido de consoante: escola, estrela, espelho. Como o e quase não se ouve, algumas crianças o esquecem. Ler essas palavras muitas vezes resolve.",
      },
    ],
    related: ["ss", "ar-er-ir-or-ur"],
  },
  {
    slug: "al-el-il-ol-ul",
    title: "AL, EL, IL, OL, UL",
    metaTitle: "O L no fim da sílaba: al, el, il, ol, ul (sol, anel, papel)",
    short: "al",
    level: "1º e 2º ano (6 a 8 anos)",
    group: "complexas",
    summary: "No Brasil, o l no fim da sílaba soa como u: sol, anel, papel. Por isso a criança troca l e u ao escrever.",
    intro:
      "No fim da sílaba, o l é pronunciado como u na maior parte do Brasil: sal soa “sau”, papel soa “papéu”, sol soa “sóu”. A escrita continua com l. Por isso é comum a criança escrever “sau” ou “papeu”: ela escreve o que ouve.",
    spoken: "al. el. il. ol. ul. sol. anel. papel.",
    tiles: [row("O L no fim da sílaba", "al el il ol ul")],
    words: [
      w("s[ol]", "o sol", "☀️"),
      w("an[el]", "um anel", "💍"),
      w("pap[el]", "um papel", "📄"),
      w("futeb[ol]", "o futebol", "⚽"),
      w("b[al]de", "um balde", "🪣"),
      w("c[al]ça", "uma calça", "👖"),
    ],
    hunt: {
      question: "Em quais palavras o fim da sílaba se escreve com l?",
      yes: "Sim: “{mot}” se escreve com l.",
      no: "Não: “{mot}” se escreve com u.",
      items: [
        yes("sol", "o sol", "☀️"),
        no("chapéu", "um chapéu", "🎩"),
        yes("anel", "um anel", "💍"),
        no("pneu", "um pneu", "🛞"),
        yes("balde", "um balde", "🪣"),
        no("troféu", "um troféu", "🏆"),
      ],
    },
    sentence: "O sol brilha no anel e no papel.",
    tip: "Na dúvida entre l e u, peça para a criança pensar numa palavra da mesma família: sal, salgado; papel, papelaria. Se o l aparece, a palavra se escreve com l.",
    faq: [
      {
        question: "Por que a criança escreve “sau” em vez de sal?",
        answer: "Porque, no Brasil, o l no fim da sílaba soa como u. É uma troca normal no começo da alfabetização. A pista das palavras da mesma família (sal, salgado) ajuda muito.",
      },
      {
        question: "Em todo o Brasil o L soa como U?",
        answer: "Na maior parte, sim. Em algumas regiões do Sul e em Portugal ele ainda soa como l. A escrita é a mesma em todo lugar.",
      },
    ],
    related: ["ar-er-ir-or-ur", "lh"],
  },
  {
    slug: "c-e-cedilha",
    title: "CA, CE, CI e o Ç",
    metaTitle: "O C e o Ç: ca, co, cu, ce, ci, ça, ço, çu, com palavras",
    short: "ç",
    level: "1º ano (6 a 7 anos)",
    group: "complexas",
    summary: "O c soa como k em ca, co, cu (casa) e como s em ce, ci (cebola). Com cedilha, ça, ço, çu: maçã, palhaço.",
    intro:
      "A letra c tem dois sons. Antes de a, o e u ela soa forte, como k: casa, cola, cubo. Antes de e e i ela soa como s: cebola, cinema. Para ter o som de s antes de a, o e u, coloca-se a cedilha: ça, ço, çu, como em maçã, palhaço e açúcar.",
    spoken: "ca, co, cu. ce, ci. ça, ço, çu.",
    tiles: [row("C com som de K", "ca co cu"), row("C com som de S", "ce ci"), row("Ç com som de S", "ça ço çu")],
    words: [
      w("[c]asa", "uma casa", "🏠"),
      w("[c]ubo", "um cubo de gelo", "🧊"),
      w("[c]ebola", "uma cebola", "🧅"),
      w("[c]inema", "um cinema", "🎬"),
      w("ma[ç]ã", "uma maçã", "🍎"),
      w("palha[ç]o", "um palhaço", "🤡"),
    ],
    rules: [
      "Antes de a, o, u, o c soa como k: casa, cola, cubo.",
      "Antes de e, i, o c soa como s: cebola, cinema.",
      "O ç só vem antes de a, o, u, e nunca começa uma palavra: maçã, poço, açúcar.",
    ],
    hunt: {
      question: "Em quais palavras o c soa como s?",
      yes: "Sim: em “{mot}” o c soa como s.",
      no: "Não: em “{mot}” o c soa como k.",
      items: [
        yes("cebola", "uma cebola", "🧅"),
        no("casa", "uma casa", "🏠"),
        yes("maçã", "uma maçã", "🍎"),
        no("coelho", "um coelho", "🐰"),
        yes("cinema", "um cinema", "🎬"),
        no("cubo", "um cubo de gelo", "🧊"),
      ],
    },
    sentence: "A moça comeu a maçã no cinema.",
    tip: "Façam uma tabela com duas colunas: “c forte” (casa, cola) e “c com som de s” (cebola, maçã). A cada palavra nova, a criança decide em que coluna ela vai.",
    faq: [
      {
        question: "Por que não se escreve “çebola”?",
        answer: "Porque antes de e e i o c já soa como s sozinho; a cedilha só é necessária antes de a, o, u. Por isso nunca se usa ç antes de e e i.",
      },
      {
        question: "Como ter o som de K antes de E e I?",
        answer: "Escreve-se qu: queijo, quilo. Veja a página do qu.",
      },
    ],
    related: ["qu", "ss", "g-e-j"],
  },
  {
    slug: "g-e-j",
    title: "GA, GE, GI e o J",
    metaTitle: "O G e o J: ga, go, gu, ge, gi, ja, je, ji, jo, ju",
    short: "ge",
    level: "1º ano (6 a 7 anos)",
    group: "complexas",
    summary: "O g soa como em gato em ga, go, gu, e como j em ge, gi (gelo, girafa). O j soa sempre igual: janela, jacaré.",
    intro:
      "A letra g também tem dois sons. Antes de a, o e u, ela soa como em gato: ga, go, gu (gato, gota, guloso). Antes de e e i, ela soa como o j: gelo, girafa. O j tem sempre o mesmo som: ja, je, ji, jo, ju. Por isso ge e je, gi e ji soam igual.",
    spoken: "ga, go, gu. ge, gi. ja, je, ji, jo, ju.",
    tiles: [row("G como em gato", "ga go gu"), row("G com som de J", "ge gi"), row("O J", "ja je ji jo ju")],
    words: [
      w("[g]ato", "um gato", "🐱"),
      w("[g]oleiro", "um goleiro", "🥅"),
      w("[g]elo", "o gelo", "🧊"),
      w("[g]irafa", "uma girafa", "🦒"),
      w("[j]acaré", "um jacaré", "🐊"),
      w("[j]oaninha", "uma joaninha", "🐞"),
    ],
    rules: [
      "Antes de a, o, u, o g soa como em gato: ga, go, gu.",
      "Antes de e, i, o g soa como j: gelo, girafa.",
      "Para o som de gato antes de e e i, escreve-se gu: guerra, guitarra.",
    ],
    hunt: {
      question: "Em quais palavras você ouve o som do j?",
      yes: "Sim: “{mot}” tem o som do j.",
      no: "Não: em “{mot}” o g soa como em gato.",
      items: [
        yes("girafa", "uma girafa", "🦒"),
        no("gato", "um gato", "🐱"),
        yes("gelo", "o gelo", "🧊"),
        no("goleiro", "um goleiro", "🥅"),
        yes("jacaré", "um jacaré", "🐊"),
        no("galinha", "uma galinha", "🐔"),
      ],
    },
    sentence: "A girafa e a joaninha comem gelo.",
    tip: "Quando a criança tiver dúvida entre g e j (gente ou “jente”?), mostre que não há regra que resolva sempre: é preciso ver a palavra escrita. Um caderninho de palavras difíceis ajuda.",
    faq: [
      {
        question: "Quando se usa G e quando se usa J?",
        answer: "Antes de a, o e u, o som de j só pode ser escrito com j (janela, jogo, juba). Antes de e e i, pode ser g ou j (gelo, jeito), e a escolha se aprende lendo. Uma pista: as palavras terminadas em -agem levam g (garagem, viagem).",
      },
      {
        question: "Por que se escreve guerra com U?",
        answer: "Porque sem o u, ge soaria como je. O u serve para manter o som de gato; veja a página do gu.",
      },
    ],
    related: ["gu", "c-e-cedilha"],
  },
  {
    slug: "x",
    title: "Os sons do X",
    metaTitle: "Os sons do X: xícara, táxi, exemplo, próximo",
    short: "x",
    level: "1º e 2º ano (6 a 8 anos)",
    group: "complexas",
    summary: "O x tem vários sons: ch (xícara, abacaxi), ks (táxi), z (exemplo) e s (próximo). O mais comum é o de ch.",
    intro:
      "O x é a letra com mais sons do português. O mais comum, e o primeiro que a criança aprende, é o som de ch: xícara, xixi, abacaxi, peixe, caixa. Em outras palavras ele soa ks (táxi), z (exemplo) ou s (próximo). Esses sons se aprendem palavra por palavra.",
    spoken: "xícara. abacaxi. peixe. táxi. exemplo. próximo.",
    tiles: [
      {
        title: "Os quatro sons",
        items: [
          { label: "xícara", note: "som de ch" },
          { label: "táxi", note: "som de ks" },
          { label: "exemplo", note: "som de z" },
          { label: "próximo", note: "som de s" },
        ],
      },
    ],
    words: [
      w("[x]ícara", "uma xícara", "☕"),
      w("abaca[x]i", "um abacaxi", "🍍"),
      w("pei[x]e", "um peixe", "🐟"),
      w("cai[x]a", "uma caixa", "📦"),
      w("tá[x]i", "um táxi", "🚕"),
      w("[x]adrez", "o xadrez", "♟️"),
    ],
    hunt: {
      question: "Em quais palavras o x soa como ch?",
      yes: "Sim: em “{mot}” o x soa como ch.",
      no: "Não: em “{mot}” o x tem outro som.",
      items: [
        yes("xícara", "uma xícara", "☕"),
        no("táxi", "um táxi", "🚕"),
        yes("peixe", "um peixe", "🐟"),
        yes("caixa", "uma caixa", "📦"),
        no("boxe", "o boxe", "🥊"),
        yes("abacaxi", "um abacaxi", "🍍"),
      ],
    },
    sentence: "O peixe dorme na caixa ao lado da xícara.",
    tip: "Para as crianças pequenas, fique no som de ch: xícara, xixi, peixe, caixa, ameixa. Os outros sons do x aparecem mais tarde, com a leitura.",
    faq: [
      {
        question: "Quando o X soa como CH?",
        answer: "Na maioria das palavras do dia a dia: no começo (xícara, xampu), depois de ditongo (peixe, caixa, ameixa) e depois de en (enxada, enxergar). Nesses casos não se usa ch.",
      },
      {
        question: "Como saber o som do X numa palavra nova?",
        answer: "Não há uma regra que sirva sempre: o som se aprende ouvindo e lendo a palavra. Na dúvida, vale perguntar a um adulto ou consultar o dicionário.",
      },
    ],
    related: ["ch", "ss"],
  },
  {
    slug: "h-inicial",
    title: "O H no começo da palavra",
    metaTitle: "O H mudo: palavras com H no começo (hora, hipopótamo, hoje)",
    short: "h",
    level: "1º ano (6 a 7 anos)",
    group: "complexas",
    summary: "No começo da palavra, o h não tem som: hora, hipopótamo, helicóptero. Ele só soa nos dígrafos ch, lh e nh.",
    intro:
      "O h no começo da palavra é mudo: hora se lê “ora”, hipopótamo se lê “ipopótamo”. Ele se escreve por causa da origem das palavras, e por isso a criança só aprende onde ele vai vendo as palavras escritas. No meio da palavra, o h forma os dígrafos ch, lh e nh.",
    spoken: "hora. hipopótamo. helicóptero. hoje.",
    marks: "silent",
    words: [
      w("[h]ipopótamo", "um hipopótamo", "🦛"),
      w("[h]elicóptero", "um helicóptero", "🚁"),
      w("[h]omem", "um homem", "👨"),
      w("[h]ospital", "um hospital", "🏥"),
      w("[h]otel", "um hotel", "🏨"),
      w("[h]ambúrguer", "um hambúrguer", "🍔"),
    ],
    rules: [
      "No começo da palavra, o h não soa: hora se lê “ora”.",
      "As palavras com h no começo se aprendem vendo-as escritas: hoje, hora, homem.",
      "Com c, l e n, o h forma os dígrafos ch, lh e nh, que têm som.",
    ],
    sentence: "Hoje o hipopótamo foi ao hospital de helicóptero.",
    tip: "Procurem palavras com h nos rótulos e nos livros: hoje, hora, hotel, hospital. Pintem o h de cinza para lembrar que ele está “calado”.",
    faq: [
      {
        question: "Por que se escreve o H se ele não soa?",
        answer: "Por causa da história das palavras: muitas vêm do latim com h (hora, homem, hoje). A pronúncia mudou, mas a escrita guardou a letra.",
      },
      {
        question: "E o H dos nomes estrangeiros?",
        answer: "Em nomes e palavras de outras línguas, o h às vezes é pronunciado como um r forte: Harry, hip-hop. É uma exceção, que a criança aprende com cada palavra.",
      },
    ],
    related: ["ch", "lh", "nh"],
  },

  // ——— Ler com fluência ———
  {
    slug: "palavras-frequentes",
    title: "Palavras frequentes",
    metaTitle: "Palavras frequentes para ler com fluência: o, a, um, e, de, que",
    short: "o",
    level: "1º e 2º ano (6 a 8 anos)",
    group: "palavras",
    summary: "o, a, um, uma, e, de, que, em, com, não: palavras curtas que aparecem em todas as frases. Reconhecê-las de relance deixa a leitura mais rápida.",
    intro:
      "Algumas palavras aparecem em quase todas as frases: o, a, os, as, um, uma, e, de, do, da, em, no, na, com, que, não. Elas se leem como as outras, sílaba por sílaba, mas, como aparecem muito, vale reconhecê-las de relance. Assim a leitura fica mais fluente.",
    spoken: "o. a. um. uma. e. de. em. com. que. não. é.",
    tiles: [
      {
        title: "As mais frequentes",
        items: ["o", "a", "os", "as", "um", "uma", "e", "é", "de", "do", "da", "em", "no", "na", "com", "que", "não", "eu"].map((label) => ({
          label,
          ...(label === "o" && { spoken: "o. O gato." }),
          ...(label === "a" && { spoken: "a. A casa." }),
          ...(label === "e" && { spoken: "e. Ana e Eva." }),
          ...(label === "é" && { spoken: "é. Ele é meu amigo." }),
        })),
      },
    ],
    sentence: "Eu vi o gato e a bola na casa da vovó.",
    tip: "Escrevam as palavras frequentes em cartões e brinquem de achá-las numa história: quantas vezes aparece “que”? Ler em voz alta juntos, todos os dias, é o que mais ajuda a ler com fluência.",
    faq: [
      {
        question: "É preciso decorar essas palavras?",
        answer: "Não exatamente: em português elas podem ser lidas pelas sílabas. Mas, como aparecem tanto, vê-las muitas vezes faz a criança reconhecê-las sem decifrar, e sobra atenção para entender o texto.",
      },
      {
        question: "Quando a criança lê com fluência?",
        answer: "Aos poucos, ao longo do 1º e do 2º ano. Primeiro ela lê sílaba por sílaba, depois palavra por palavra e, por fim, frases inteiras. Ler textos curtos e conhecidos todos os dias é o que mais ajuda.",
      },
    ],
    related: ["familias-silabicas", "contar-silabas"],
  },
];

export function getPortugueseSyllablePage(slug: string): PortugueseSyllablePage | undefined {
  return portugueseSyllablePages.find((p) => p.slug === slug);
}

/** Pages in reading order, grouped as on the index page. */
export function orderedPortuguesePages(): PortugueseSyllablePage[] {
  return SILABA_GROUPS.flatMap((g) => portugueseSyllablePages.filter((p) => p.group === g.id));
}

/** Previous and next page, following the index order (no wrap-around). */
export function portuguesePageNeighbors(slug: string): { prev?: PortugueseSyllablePage; next?: PortugueseSyllablePage } {
  const list = orderedPortuguesePages();
  const i = list.findIndex((p) => p.slug === slug);
  return { prev: list[i - 1], next: list[i + 1] };
}
