// Portuguese printable worksheets ("atividades para imprimir"), the pages
// under /pt/atividades. Written for Brazilian schools (docs/portuguese-plan.md,
// P4, P6): the four kinds of letter (letra bastão, letra de forma, letra
// cursiva maiúscula and minúscula), cursive in Playwrite BR on "caligrafia"
// guide lines, numbers to trace and count, syllables in the order of the
// alfabetização (famílias silábicas, dígrafos, sons nasais, sílabas
// complexas). Every slug is Portuguese-only: they don't mirror the English,
// French or Spanish worksheets.
//
// The PDFs are pre-rendered by `npm run atividades:pt` (scripts/atividades-pt/)
// with Chromium, like the French and Spanish ones. They live in
// public/atividades-pdf/ with a JPEG preview of each page. This file is the
// catalogue both the script and the pages read.
//
// Pure data (plus the letter data it builds on).
import { CEDILHA_SLUG, portugueseLetters, type PortugueseLetter, type PortugueseWord } from "./letters-pt";
import { FIRST_SYLLABLE_WORDS, LOOK_ALIKES } from "./atividades-pt-words";

export const ATIVIDADES_PDF_DIR = "/atividades-pdf";

export type AtividadeCategoryGroup = "letras" | "temas" | "silabas";

export type AtividadeCategory = {
  slug: string;
  group: AtividadeCategoryGroup;
  name: string;
  /** Card blurb and meta description. */
  description: string;
  /** Paragraph at the top of the category page. */
  intro: string;
  level: string;
  skills: string[];
};

/** The seven worksheet types made for the letters, in page order. */
export type LetterAtividadeType = "bastao" | "forma" | "cursiva" | "reconhecer" | "silaba" | "colorir" | "palavras";

export type Atividade = {
  slug: string;
  category: string;
  title: string;
  /** Short name used in lists ("Letra B", "O número 3"). */
  label: string;
  description: string;
  /** The instruction printed on the sheet. */
  instrucao: string;
  level: string;
  skills: string[];
  /** Letter slug, for letter worksheets. */
  letter?: string;
  /** Syllable sheet, for syllable worksheets. */
  syllables?: string;
  pdf: string;
  preview: string;
};

export type AtividadePack = {
  slug: string;
  title: string;
  description: string;
  atividades: string[];
  // The pack's PDF in pro-files/ (a Pro download, never a public URL;
  // lib/billing/bundles.ts).
  file: string;
};

// ---------------------------------------------------------------- content

const w = (word: string, withArticle: string, picture: string): PortugueseWord => ({ word, withArticle, picture });

// In ./atividades-pt-words.ts, so the games can use them without bundling the whole catalogue.
export { FIRST_SYLLABLE_WORDS, LOOK_ALIKES };


export const NUMBERS = [
  "zero", "um", "dois", "três", "quatro", "cinco", "seis", "sete", "oito", "nove", "dez",
  "onze", "doze", "treze", "quatorze", "quinze", "dezesseis", "dezessete", "dezoito", "dezenove", "vinte",
];

export type Shape = { slug: string; name: string; withArticle: string; /** Shape drawn by the French template helper. */ draw: string };
export const SHAPES: Shape[] = [
  { slug: "circulo", name: "círculo", withArticle: "o círculo", draw: "rond" },
  { slug: "quadrado", name: "quadrado", withArticle: "o quadrado", draw: "carre" },
  { slug: "triangulo", name: "triângulo", withArticle: "o triângulo", draw: "triangle" },
  { slug: "retangulo", name: "retângulo", withArticle: "o retângulo", draw: "rectangle" },
  { slug: "losango", name: "losango", withArticle: "o losango", draw: "losange" },
  { slug: "oval", name: "oval", withArticle: "o oval", draw: "ovale" },
  { slug: "estrela", name: "estrela", withArticle: "a estrela", draw: "etoile" },
  { slug: "coracao", name: "coração", withArticle: "o coração", draw: "coeur" },
];

export type Colour = { slug: string; name: string; hex: string; thing: PortugueseWord };
export const COLOURS: Colour[] = [
  { slug: "vermelho", name: "vermelho", hex: "#E53935", thing: w("maçã", "a maçã", "apple") },
  { slug: "azul", name: "azul", hex: "#1E88E5", thing: w("baleia", "a baleia", "whale") },
  { slug: "amarelo", name: "amarelo", hex: "#FDD835", thing: w("sol", "o sol", "sun") },
  { slug: "verde", name: "verde", hex: "#43A047", thing: w("sapo", "o sapo", "frog") },
  { slug: "laranja", name: "laranja", hex: "#FB8C00", thing: w("cenoura", "a cenoura", "carrot") },
  { slug: "roxo", name: "roxo", hex: "#8E24AA", thing: w("uvas", "as uvas", "grapes") },
  { slug: "rosa", name: "rosa", hex: "#F48FB1", thing: w("flamingo", "o flamingo", "flamingo") },
  { slug: "marrom", name: "marrom", hex: "#795548", thing: w("urso", "o urso", "bear") },
  { slug: "cinza", name: "cinza", hex: "#9E9E9E", thing: w("elefante", "o elefante", "elephant") },
  { slug: "preto", name: "preto", hex: "#212121", thing: w("chapéu", "o chapéu", "hat") },
];

/** Frequent words, four per sheet, with a sentence that uses them. */
export const FREQUENT_WORD_GROUPS: { words: string[]; sentence: string }[] = [
  { words: ["o", "a", "os", "as"], sentence: "O gato e a pata veem os peixes e as flores." },
  { words: ["um", "uma", "e", "é"], sentence: "É um urso e uma ovelha." },
  { words: ["eu", "meu", "com", "você"], sentence: "Eu brinco com meu cachorro e com você." },
  { words: ["de", "do", "da", "em"], sentence: "O livro de histórias do Léo está em cima da mesa." },
  { words: ["não", "sim", "que", "no"], sentence: "Você viu a lua no céu? Sim, que bonita! Não tem nuvens." },
];

/**
 * Syllable sheets: the syllables to read, then pictured words cut into
 * syllables ("bo|la"; rr and ss are split, as in Brazilian school:
 * "car|ro", "pás|sa|ro"). `pages` lists the syllable pages
 * (lib/silabas-pt.ts) that link to the sheet.
 */
export type SyllableSheet = {
  slug: string;
  /** Short name: "b", "ca, co, cu", "ch", "br". */
  label: string;
  syllables: string[];
  words: PortugueseWord[];
  pages: string[];
  category: "familias-silabicas" | "digrafos" | "sons-nasais" | "silabas-complexas";
  /** A note under the syllable table ("o u não soa"). */
  note?: string;
  /** Colour the consonant and the vowel of each syllable (false for vowel-first groups: an, ar, ão). */
  split?: boolean;
};

type SheetCategory = SyllableSheet["category"];
const sheet = (
  category: SheetCategory,
  slug: string,
  label: string,
  syllables: string,
  pages: string[],
  words: PortugueseWord[],
  extra: { note?: string; split?: boolean } = {},
): SyllableSheet => ({ slug, label, syllables: syllables.split(" "), words, pages, category, split: true, ...extra });

const familia = (...a: [string, string, string, string[], PortugueseWord[], { note?: string }?]) => sheet("familias-silabicas", ...a);
const digrafo = (...a: [string, string, string, string[], PortugueseWord[], { note?: string }?]) => sheet("digrafos", ...a);

export const SYLLABLE_SHEETS: SyllableSheet[] = [
  familia("familia-b", "b", "ba be bi bo bu", ["familias-silabicas"], [w("bo|la", "uma bola", "ball"), w("ba|na|na", "uma banana", "banana"), w("bo|né", "um boné", "cap"), w("ba|lei|a", "uma baleia", "whale")]),
  familia("familia-ca-co-cu", "ca, co, cu", "ca co cu", ["c-e-cedilha"], [w("ca|sa", "uma casa", "house"), w("co|e|lho", "um coelho", "rabbit"), w("cu|bo", "um cubo de gelo", "ice"), w("fo|ca", "uma foca", "seal")]),
  familia("familia-ce-ci", "ce, ci", "ce ci", ["c-e-cedilha"], [w("ce|bo|la", "uma cebola", "onion"), w("ci|ne|ma", "um cinema", "clapperboard"), w("ce|nou|ra", "uma cenoura", "carrot")], { note: "Antes de e e i, o c soa como s." }),
  familia("familia-c-cedilha", "ça, ço, çu", "ça ço çu", ["c-e-cedilha"], [w("ma|çã", "uma maçã", "apple"), w("pa|lha|ço", "um palhaço", "clown"), w("co|ra|ção", "um coração", "heart"), w("ta|ça", "uma taça", "trophy")], { note: "O ç só aparece antes de a, o e u." }),
  familia("familia-d", "d", "da de di do du", ["familias-silabicas"], [w("da|do", "um dado", "dice"), w("de|do", "um dedo", "finger"), w("den|te", "um dente", "tooth"), w("di|nos|sau|ro", "um dinossauro", "dinosaur")]),
  familia("familia-f", "f", "fa fe fi fo fu", ["familias-silabicas"], [w("fo|ca", "uma foca", "seal"), w("fa|da", "uma fada", "fairy"), w("fo|go", "o fogo", "fire"), w("ca|fé", "um café", "cup")]),
  familia("familia-ga-go-gu", "ga, go, gu", "ga go gu", ["g-e-j", "gu"], [w("ga|to", "um gato", "cat"), w("go|ri|la", "um gorila", "gorilla"), w("ga|li|nha", "uma galinha", "hen"), w("a|gu|lha", "uma agulha", "needle")]),
  familia("familia-ge-gi", "ge, gi", "ge gi", ["g-e-j"], [w("ge|lo", "o gelo", "ice"), w("gi|ra|fa", "uma girafa", "giraffe"), w("ti|ge|la", "uma tigela", "bowl")], { note: "Antes de e e i, o g soa como j." }),
  familia("familia-j", "j", "ja je ji jo ju", ["g-e-j"], [w("ja|ca|ré", "um jacaré", "crocodile"), w("ja|ne|la", "uma janela", "window"), w("jo|a|ni|nha", "uma joaninha", "ladybug"), w("joi|a", "uma joia", "diamond")]),
  familia("familia-l", "l", "la le li lo lu", ["familias-silabicas", "al-el-il-ol-ul"], [w("lu|a", "a lua", "moon"), w("le|ão", "um leão", "lion"), w("li|mão", "um limão", "lemon"), w("ma|la", "uma mala", "suitcase")]),
  familia("familia-m", "m", "ma me mi mo mu", ["familias-silabicas", "am-em-im-om-um"], [w("ma|ca|co", "um macaco", "monkey"), w("me|sa", "uma mesa", "chair"), w("mo|to", "uma moto", "motorbike"), w("ca|mi|sa", "uma camisa", "shirt")]),
  familia("familia-n", "n", "na ne ni no nu", ["familias-silabicas", "an-en-in-on-un"], [w("na|vi|o", "um navio", "ship"), w("nu|vem", "uma nuvem", "cloud"), w("na|riz", "um nariz", "nose"), w("bo|ne|ca", "uma boneca", "doll")]),
  familia("familia-p", "p", "pa pe pi po pu", ["familias-silabicas"], [w("pa|to", "um pato", "duck"), w("pe|ra", "uma pera", "pear"), w("pi|po|ca", "uma pipoca", "popcorn"), w("pi|a|no", "um piano", "piano")]),
  familia("familia-r", "r", "ra re ri ro ru", ["rr"], [w("ra|to", "um rato", "mouse"), w("ro|sa", "uma rosa", "rose"), w("re|ló|gio", "um relógio", "watch"), w("ro|bô", "um robô", "robot")], { note: "No começo da palavra, o r é forte." }),
  familia("familia-s", "s", "sa se si so su", ["ss"], [w("sa|po", "um sapo", "frog"), w("si|no", "um sino", "bell"), w("so|pa", "uma sopa", "soup"), w("su|co", "um suco", "juice")]),
  familia("familia-t", "t", "ta te ti to tu", ["familias-silabicas"], [w("to|ma|te", "um tomate", "tomato"), w("tar|ta|ru|ga", "uma tartaruga", "turtle"), w("ti|gre", "um tigre", "tiger")]),
  familia("familia-v", "v", "va ve vi vo vu", ["familias-silabicas"], [w("va|ca", "uma vaca", "cow"), w("ve|la", "uma vela", "candle"), w("vi|o|lão", "um violão", "guitar"), w("u|va", "uma uva", "grapes")]),
  familia("familia-x", "x", "xa xe xi xo xu", ["x", "ch"], [w("xí|ca|ra", "uma xícara", "cup"), w("a|ba|ca|xi", "um abacaxi", "pineapple"), w("pei|xe", "um peixe", "fish"), w("cai|xa", "uma caixa", "box")], { note: "Aqui o x tem o som de ch." }),
  familia("familia-z", "z", "za ze zi zo zu", ["ss"], [w("ze|bra", "uma zebra", "zebra"), w("ze|ro", "o número zero", "number-0"), w("a|zei|to|na", "uma azeitona", "olive")]),
  digrafo("digrafo-ch", "ch", "cha che chi cho chu", ["ch"], [w("cha|ve", "uma chave", "key"), w("chu|va", "a chuva", "rain"), w("cho|co|la|te", "um chocolate", "chocolate"), w("bi|cho", "um bicho", "caterpillar")]),
  digrafo("digrafo-lh", "lh", "lha lhe lhi lho lhu", ["lh"], [w("pa|lha|ço", "um palhaço", "clown"), w("co|e|lho", "um coelho", "rabbit"), w("a|be|lha", "uma abelha", "bee"), w("fo|lha", "uma folha", "leaf")]),
  digrafo("digrafo-nh", "nh", "nha nhe nhi nho nhu", ["nh"], [w("ni|nho", "um ninho", "nest"), w("ga|li|nha", "uma galinha", "hen"), w("a|ra|nha", "uma aranha", "spider"), w("ba|nho", "um banho", "bathtub")]),
  digrafo("digrafo-rr", "rr", "rra rre rri rro rru", ["rr"], [w("car|ro", "um carro", "car"), w("ca|chor|ro", "um cachorro", "dog"), w("ter|ra", "a Terra", "earth"), w("ar|roz", "o arroz", "rice")], { note: "Na separação de sílabas, o rr fica dividido: car-ro." }),
  digrafo("digrafo-ss", "ss", "ssa sse ssi sso ssu", ["ss"], [w("pás|sa|ro", "um pássaro", "bird"), w("os|so", "um osso", "bone"), w("vas|sou|ra", "uma vassoura", "broom")], { note: "Na separação de sílabas, o ss fica dividido: pás-sa-ro." }),
  digrafo("digrafo-qu", "que, qui", "que qui", ["qu"], [w("quei|jo", "um queijo", "cheese"), w("es|qui|lo", "um esquilo", "squirrel"), w("mos|qui|to", "um mosquito", "mosquito")], { note: "Em que e qui, o u não soa." }),
  digrafo("digrafo-gu", "gue, gui", "gue gui", ["gu"], [w("gui|tar|ra", "uma guitarra", "guitar"), w("fo|gue|te", "um foguete", "rocket"), w("fo|guei|ra", "uma fogueira", "fire")], { note: "Em gue e gui, o u não soa." }),
  sheet("sons-nasais", "nasal-til", "ã, ão, ãe, õe", "ã ão ãe õe", ["til"], [w("ma|çã", "uma maçã", "apple"), w("ba|lão", "um balão", "balloon"), w("le|ão", "um leão", "lion"), w("li|mões", "os limões", "lemon")], { note: "O til mostra que o som passa pelo nariz.", split: false }),
  sheet("sons-nasais", "nasal-an-en-in-on-un", "an, en, in, on, un", "an en in on un", ["an-en-in-on-un"], [w("an|jo", "um anjo", "angel"), w("den|te", "um dente", "tooth"), w("pin|ti|nho", "um pintinho", "chick"), w("on|ça", "uma onça", "jaguar")], { split: false }),
  sheet("sons-nasais", "nasal-am-em-im-om-um", "am, em, im, om, um", "am em im om um", ["am-em-im-om-um"], [w("pom|ba", "uma pomba", "dove"), w("tam|bor", "um tambor", "drum"), w("bom|bom", "um bombom", "candy"), w("lâm|pa|da", "uma lâmpada", "light-bulb")], { note: "Antes de p e b, escreve-se m.", split: false }),
  sheet("silabas-complexas", "encontro-br", "br", "bra bre bri bro bru", ["encontros-com-r"], [w("bra|ço", "um braço", "arm"), w("co|bra", "uma cobra", "snake"), w("bru|xa", "uma bruxa", "witch"), w("ca|bra", "uma cabra", "goat")]),
  sheet("silabas-complexas", "encontro-cr", "cr", "cra cre cri cro cru", ["encontros-com-r"], [w("cro|co|di|lo", "um crocodilo", "crocodile"), w("mi|cro|fo|ne", "um microfone", "microphone"), w("cri|an|ça", "uma criança", "child")]),
  sheet("silabas-complexas", "encontro-dr", "dr", "dra dre dri dro dru", ["encontros-com-r"], [w("dra|gão", "um dragão", "dragon"), w("pe|dra", "uma pedra", "rock"), w("qua|dra|do", "um quadrado", "square")]),
  sheet("silabas-complexas", "encontro-fr", "fr", "fra fre fri fro fru", ["encontros-com-r"], [w("fru|ta", "uma fruta", "strawberry"), w("fri|o", "o frio", "cold"), w("fran|go", "um frango", "chicken-leg")]),
  sheet("silabas-complexas", "encontro-gr", "gr", "gra gre gri gro gru", ["encontros-com-r"], [w("gri|lo", "um grilo", "cricket"), w("ti|gre", "um tigre", "tiger"), w("gra|ma", "a grama", "sprout")]),
  sheet("silabas-complexas", "encontro-pr", "pr", "pra pre pri pro pru", ["encontros-com-r"], [w("pra|to", "um prato", "plate"), w("prê|mio", "um prêmio", "trophy"), w("prin|ce|sa", "uma princesa", "princess"), w("pre|sen|te", "um presente", "gift")]),
  sheet("silabas-complexas", "encontro-tr", "tr", "tra tre tri tro tru", ["encontros-com-r"], [w("trem", "um trem", "train"), w("tra|tor", "um trator", "tractor"), w("es|tre|la", "uma estrela", "star"), w("trom|pe|te", "um trompete", "trumpet")]),
  sheet("silabas-complexas", "encontro-bl", "bl", "bla ble bli blo blu", ["encontros-com-l"], [w("blo|co", "um bloco", "brick"), w("blu|sa", "uma blusa", "blouse"), w("bi|bli|o|te|ca", "uma biblioteca", "books")]),
  sheet("silabas-complexas", "encontro-cl", "cl", "cla cle cli clo clu", ["encontros-com-l"], [w("bi|ci|cle|ta", "uma bicicleta", "bicycle"), w("cli|pe", "um clipe", "paper-clip"), w("te|cla|do", "um teclado", "keyboard")]),
  sheet("silabas-complexas", "encontro-fl", "fl", "fla fle fli flo flu", ["encontros-com-l"], [w("flor", "uma flor", "flower"), w("flau|ta", "uma flauta", "flute"), w("fle|cha", "uma flecha", "bow-and-arrow"), w("flo|res|ta", "uma floresta", "tree")]),
  sheet("silabas-complexas", "encontro-gl", "gl", "gla gle gli glo glu", ["encontros-com-l"], [w("glo|bo", "um globo", "globe"), w("i|glu", "um iglu", "hut")]),
  sheet("silabas-complexas", "encontro-pl", "pl", "pla ple pli plo plu", ["encontros-com-l"], [w("pla|ne|ta", "um planeta", "planet"), w("plan|ta", "uma planta", "potted-plant")]),
  sheet("silabas-complexas", "final-r", "ar, er, ir, or, ur", "ar er ir or ur", ["ar-er-ir-or-ur"], [w("bar|co", "um barco", "sailboat"), w("por|ta", "uma porta", "door"), w("sor|ve|te", "um sorvete", "ice-cream"), w("for|mi|ga", "uma formiga", "ant")], { split: false }),
  sheet("silabas-complexas", "final-s", "as, es, is, os, us", "as es is os us", ["as-es-is-os-us"], [w("es|co|la", "uma escola", "school"), w("cas|te|lo", "um castelo", "castle"), w("mos|ca", "uma mosca", "fly"), w("ô|ni|bus", "um ônibus", "bus")], { split: false }),
  sheet("silabas-complexas", "final-l", "al, el, il, ol, ul", "al el il ol ul", ["al-el-il-ol-ul"], [w("sol", "o sol", "sun"), w("a|nel", "um anel", "ring"), w("bal|de", "um balde", "bucket"), w("cal|ça", "uma calça", "trousers")], { note: "No fim da sílaba, o l soa como u.", split: false }),
];

// ---------------------------------------------------------------- catalogue

const LETTER_TYPES: { type: LetterAtividadeType; category: AtividadeCategory }[] = [
  {
    type: "bastao",
    category: {
      slug: "letra-bastao",
      group: "letras",
      name: "Letra bastão",
      description: "Cobrir a letra bastão (de forma maiúscula) e uma palavra em maiúsculas, e depois escrever sozinho.",
      intro:
        "Uma atividade por letra: a letra bastão, a de forma maiúscula, que a criança usa primeiro na educação infantil, para cobrir seguindo o contorno, uma palavra em maiúsculas e linhas para escrever sozinha.",
      level: "Educação infantil (4 a 5 anos)",
      skills: ["Letra bastão", "Traçado", "Coordenação motora"],
    },
  },
  {
    type: "forma",
    category: {
      slug: "letra-de-forma",
      group: "letras",
      name: "Letra de forma",
      description: "Cobrir a letra de forma minúscula, a dos livros, e uma palavra, e depois escrever sozinho.",
      intro:
        "Depois da letra bastão, a letra de forma minúscula, a que a criança lê nos livros: para cobrir seguindo o contorno, numa palavra e sozinha nas linhas.",
      level: "Pré-escola e 1º ano (5 a 6 anos)",
      skills: ["Letra de forma", "Minúsculas", "Traçado"],
    },
  },
  {
    type: "cursiva",
    category: {
      slug: "letra-cursiva",
      group: "letras",
      name: "Letra cursiva",
      description: "A letra cursiva nas linhas de caligrafia: um modelo, letras para cobrir e linhas para escrever.",
      intro:
        "Cada atividade mostra a letra cursiva da escola nas linhas do caderno de caligrafia: um modelo, letras cinza para cobrir e a linha para escrever sozinho. Primeiro a minúscula, depois a maiúscula e uma palavra.",
      level: "1º e 2º ano (6 a 8 anos)",
      skills: ["Letra cursiva", "Caligrafia", "Traçado"],
    },
  },
  {
    type: "reconhecer",
    category: {
      slug: "reconhecer-letras",
      group: "letras",
      name: "Reconhecer as letras",
      description: "Achar a letra nos quatro tipos de letra entre letras parecidas.",
      intro:
        "Uma grade de letras nos quatro tipos de letra (bastão, de forma, cursiva maiúscula e minúscula), misturadas com letras parecidas (b, d, p, q…). A criança circula todas as que reconhece.",
      level: "Educação infantil e 1º ano (4 a 6 anos)",
      skills: ["Reconhecer letras", "Quatro tipos de letra", "Atenção visual"],
    },
  },
  {
    type: "silaba",
    category: {
      slug: "silaba-inicial",
      group: "letras",
      name: "A sílaba inicial",
      description: "Dizer o nome da figura e escrever a sílaba com que ela começa: __la, bola.",
      intro:
        "Quatro figuras com a palavra incompleta: falta a primeira sílaba. A criança diz a palavra em voz alta, bate palmas para as sílabas e escreve a primeira no quadrinho. Um exercício que junta o ouvido, as sílabas e a escrita.",
      level: "Pré-escola e 1º ano (5 a 7 anos)",
      skills: ["Sílabas", "Consciência fonológica", "Escrita"],
    },
  },
  {
    type: "colorir",
    category: {
      slug: "colorir-letras",
      group: "letras",
      name: "Colorir letras",
      description: "Uma letra grande e uma figura para colorir, para ligar a letra a uma palavra.",
      intro:
        "Uma letra grande para colorir e uma figura cujo nome começa com essa letra (ou a tem no meio). Perfeito para os pequenos, a partir dos 3 anos.",
      level: "Educação infantil (3 a 5 anos)",
      skills: ["Coordenação motora", "Reconhecer letras", "Vocabulário"],
    },
  },
  {
    type: "palavras",
    category: {
      slug: "escrever-palavras",
      group: "letras",
      name: "Escrever palavras",
      description: "Palavras com figura para copiar em letra cursiva nas linhas de caligrafia: modelo, cobrir e escrever.",
      intro:
        "Duas ou três palavras com figura para cada letra, para escrever em letra cursiva nas linhas de caligrafia: lê-se o modelo, cobre-se a palavra cinza e depois escreve-se sozinho.",
      level: "1º ano (6 a 7 anos)",
      skills: ["Letra cursiva", "Copiar palavras", "Vocabulário"],
    },
  },
];

const THEME_CATEGORIES: AtividadeCategory[] = [
  {
    slug: "numeros",
    group: "temas",
    name: "Os números",
    description: "Os números de 0 a 20: cobrir o número, contar os desenhos, mostrar com os dedos e ler o nome.",
    intro:
      "Uma atividade por número, do zero ao vinte: o número grande para cobrir, cercado de tantos desenhos quanto ele indica, a mão que mostra o número com os dedos, o nome por extenso, e o número e a palavra para cobrir.",
    level: "Educação infantil e 1º ano (4 a 7 anos)",
    skills: ["Escrever números", "Contar", "Ler os números"],
  },
  {
    slug: "formas",
    group: "temas",
    name: "As formas",
    description: "Círculo, quadrado, triângulo… cobrir as formas geométricas e escrever o nome.",
    intro:
      "Oito formas para cobrir seguindo os pontinhos: uma grande e várias pequenas, e o nome para escrever. Elas preparam o traçado das letras.",
    level: "Educação infantil (3 a 5 anos)",
    skills: ["Traçado", "Formas geométricas", "Vocabulário"],
  },
  {
    slug: "cores",
    group: "temas",
    name: "As cores",
    description: "Dez cores: colorir a figura com a cor certa e escrever o nome da cor.",
    intro:
      "Vermelho como a maçã, amarelo como o sol… Cada atividade liga uma cor a uma figura para colorir e ao nome da cor para ler e escrever.",
    level: "Educação infantil (3 a 5 anos)",
    skills: ["Cores", "Colorir", "Ler palavras"],
  },
  {
    slug: "palavras-frequentes",
    group: "temas",
    name: "Palavras frequentes",
    description: "As palavras curtas mais frequentes (o, a, um, e, de, que…) para ler, cobrir e escrever.",
    intro:
      "Quatro palavras frequentes por atividade: lidas em letra de forma, cobertas em letra cursiva, escritas sozinho e encontradas numa frase.",
    level: "1º ano (6 a 7 anos)",
    skills: ["Palavras frequentes", "Leitura", "Letra cursiva"],
  },
];

const SYLLABLE_CATEGORIES: AtividadeCategory[] = [
  {
    slug: "familias-silabicas",
    group: "silabas",
    name: "Famílias silábicas",
    description: "Uma atividade por família: ler ba, be, bi, bo, bu, palavras separadas em sílabas e escrever em letra cursiva.",
    intro:
      "Uma atividade para cada família silábica, na ordem da alfabetização: a tabela de sílabas para ler, as mesmas sílabas fora de ordem, palavras com figura separadas em sílabas e sílabas para escrever em letra cursiva. Também ca, co, cu, ce, ci, ça, ço, çu, ga, go, gu e ge, gi.",
    level: "Pré-escola e 1º ano (5 a 7 anos)",
    skills: ["Famílias silábicas", "Leitura", "Letra cursiva"],
  },
  {
    slug: "digrafos",
    group: "silabas",
    name: "Dígrafos",
    description: "ch, lh, nh, rr, ss, qu e gu: ler as sílabas, palavras separadas em sílabas e escrever.",
    intro:
      "Uma atividade para cada dígrafo, duas letras com um som só: ch, lh, nh, rr, ss, que, qui, gue e gui. Atenção: na separação de sílabas, o rr e o ss ficam divididos (car-ro, pás-sa-ro).",
    level: "1º ano (6 a 7 anos)",
    skills: ["Dígrafos", "Leitura", "Letra cursiva"],
  },
  {
    slug: "sons-nasais",
    group: "silabas",
    name: "Sons nasais",
    description: "O til (ã, ão, ãe, õe) e a vogal com n ou m (an, en, am, em…): ler e escrever.",
    intro:
      "Três atividades para os sons que passam pelo nariz: o til (maçã, leão, limões), a vogal com n (anjo, dente, onça) e a vogal com m antes de p e b (pomba, tambor, bombom).",
    level: "1º ano (6 a 7 anos)",
    skills: ["Sons nasais", "Leitura", "Ortografia"],
  },
  {
    slug: "silabas-complexas",
    group: "silabas",
    name: "Sílabas complexas",
    description: "br, cr, dr, fr, gr, pr, tr, bl, cl, fl, gl, pl e o r, o s e o l no fim da sílaba: ler e escrever.",
    intro:
      "Uma atividade para cada encontro consonantal (bra, pra, tra, bla, fla…) e para as sílabas terminadas em r, s e l (barco, escola, anel): a tabela de sílabas, palavras com figura separadas em sílabas e sílabas para escrever em letra cursiva.",
    level: "1º e 2º ano (6 a 8 anos)",
    skills: ["Sílabas complexas", "Leitura", "Letra cursiva"],
  },
];

export const ATIVIDADE_CATEGORIES: AtividadeCategory[] = [
  ...LETTER_TYPES.map((t) => t.category),
  ...THEME_CATEGORIES,
  ...SYLLABLE_CATEGORIES,
];

const pdfPath = (category: string, slug: string) => `${ATIVIDADES_PDF_DIR}/${category}/${slug}.pdf`;
const previewPath = (slug: string) => `${ATIVIDADES_PDF_DIR}/previas/${slug}.jpg`;

const cedilha = (l: PortugueseLetter) => l.slug === CEDILHA_SLUG;
/** "a letra B", or "o Ç". */
const theLetter = (l: PortugueseLetter) => (cedilha(l) ? "o Ç" : `a letra ${l.upper}`);

function letterAtividade(l: PortugueseLetter, type: LetterAtividadeType, category: AtividadeCategory): Atividade | null {
  const slug = `letra-${l.slug}-${type}`;
  const base = {
    slug,
    category: category.slug,
    level: category.level,
    skills: category.skills,
    letter: l.slug,
    pdf: pdfPath(category.slug, slug),
    preview: previewPath(slug),
    label: cedilha(l) ? "Ç" : `Letra ${l.upper}`,
  };
  const first = l.words[0].word.toLowerCase();
  const name = cap(theLetter(l));
  switch (type) {
    case "bastao":
      return {
        ...base,
        title: `${name} em letra bastão`,
        description: `Atividade grátis para imprimir: cobrir ${theLetter(l)} em letra bastão (de forma maiúscula) e a palavra ${first.toUpperCase()}, e depois escrever sozinho.`,
        instrucao: `Cubra ${theLetter(l)} seguindo o contorno e depois escreva sozinho na linha.`,
      };
    case "forma":
      return {
        ...base,
        title: `${name} em letra de forma minúscula`,
        description: `Atividade grátis para imprimir: cobrir ${cedilha(l) ? "o ç" : `a letra ${l.lower}`} em letra de forma minúscula e a palavra ${first}, e depois escrever sozinho.`,
        instrucao: `Cubra ${cedilha(l) ? "o ç" : `a letra ${l.lower}`} seguindo o contorno e depois escreva sozinho na linha.`,
      };
    case "cursiva":
      return {
        ...base,
        title: `${name} em letra cursiva (caligrafia)`,
        description: `Atividade de letra cursiva ${cedilha(l) ? "do Ç" : `da letra ${l.upper}`} nas linhas de caligrafia: um modelo, letras para cobrir, a maiúscula e a palavra ${first}.`,
        instrucao: "Cubra as letras cinza e depois escreva a letra sozinho até o fim da linha.",
      };
    case "reconhecer":
      return {
        ...base,
        title: `Reconhecer ${theLetter(l)} nos quatro tipos de letra`,
        description: `Atividade grátis: achar ${theLetter(l)} em letra bastão, de forma e cursiva entre letras parecidas.`,
        instrucao: `Circule todas as letras ${l.upper} e ${l.lower} que encontrar: em letra bastão, de forma e cursiva.`,
      };
    case "silaba": {
      const words = FIRST_SYLLABLE_WORDS[l.slug];
      if (!words) return null;
      return {
        ...base,
        title: `A sílaba inicial: palavras com ${l.upper}`,
        description: `Atividade de sílabas com a letra ${l.upper}: dizer o nome de cada figura e escrever a primeira sílaba, como ${words[0].word.split("|")[0]} em ${words[0].word.replace(/\|/g, "")}.`,
        instrucao: "Diga o nome da figura, bata palmas para as sílabas e escreva a primeira no quadrinho.",
      };
    }
    case "colorir":
      return {
        ...base,
        title: `Colorir ${theLetter(l)}`,
        description: `Desenho para colorir grátis: ${theLetter(l)} grande e ${l.words[0].withArticle}, para ligar a letra à palavra.`,
        instrucao: `Pinte o ${l.upper} grande, o ${l.lower} pequeno e a figura: é ${l.words[0].withArticle}. Diga a palavra em voz alta.`,
      };
    case "palavras":
      return {
        ...base,
        title: `Escrever palavras com ${l.upper}`,
        description: `Atividade de letra cursiva nas linhas de caligrafia: palavras com ${l.upper} para ler, cobrir e escrever sozinho.`,
        instrucao: "Leia a palavra, cubra a palavra cinza e depois escreva sozinho na linha.",
      };
  }
}

function cap(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function buildAtividades(): Atividade[] {
  const out: Atividade[] = [];
  for (const { type, category } of LETTER_TYPES) {
    for (const l of portugueseLetters) {
      const a = letterAtividade(l, type, category);
      if (a) out.push(a);
    }
  }
  const theme = (slug: string) => ATIVIDADE_CATEGORIES.find((c) => c.slug === slug)!;
  const common = (c: AtividadeCategory, slug: string) => ({ slug, category: c.slug, level: c.level, skills: c.skills, pdf: pdfPath(c.slug, slug), preview: previewPath(slug) });

  const numeros = theme("numeros");
  NUMBERS.forEach((word, n) => {
    out.push({
      ...common(numeros, `numero-${n}`),
      label: `O número ${n}`,
      title: `O número ${n} (${word}): cobrir e contar`,
      description: `Atividade grátis do número ${n}: o número grande para cobrir, ${n === 0 ? "um ninho vazio (zero é nada!)" : `${n} ${n === 1 ? "desenho" : "desenhos"} para contar, ${n <= 10 ? `${n} ${n === 1 ? "dedo" : "dedos"}` : `10 dedos e mais ${n - 10}`} para mostrar`} e a palavra “${word}” para cobrir.`,
      instrucao:
        n === 0
          ? "Cubra o 0. Zero é nada: o ninho está vazio e a mão, fechada!"
          : `${n === 1 ? "Olhe o desenho" : `Conte os ${n} desenhos`}, ${n <= 10 ? `mostre ${n} ${n === 1 ? "dedo" : "dedos"}` : `mostre 10 dedos e conte mais ${n - 10}`} e cubra o número ${n} e a palavra “${word}”.`,
    });
  });
  const formas = theme("formas");
  for (const s of SHAPES) {
    out.push({
      ...common(formas, `forma-${s.slug}`),
      label: cap(s.withArticle),
      title: `${cap(s.withArticle)}: forma para cobrir`,
      description: `Atividade grátis: cobrir ${s.withArticle} seguindo os pontinhos, grande e pequeno, e escrever a palavra “${s.name}”.`,
      instrucao: `Cubra ${s.withArticle} seguindo os pontinhos e depois desenhe um sozinho.`,
    });
  }
  const cores = theme("cores");
  for (const c of COLOURS) {
    out.push({
      ...common(cores, `cor-${c.slug}`),
      label: cap(c.name),
      title: `A cor ${c.name}: pinte ${c.thing.withArticle}`,
      description: `Atividade grátis da cor ${c.name}: pintar ${c.thing.withArticle} de ${c.name} e escrever a palavra “${c.name}”.`,
      instrucao: `Pinte ${c.thing.withArticle} de ${c.name} e depois escreva a palavra ${c.name}.`,
    });
  }
  const frequentes = theme("palavras-frequentes");
  FREQUENT_WORD_GROUPS.forEach((g, i) => {
    const list = g.words.join(", ");
    out.push({
      ...common(frequentes, `palavras-frequentes-${i + 1}`),
      label: `Palavras frequentes ${i + 1}`,
      title: `Palavras frequentes ${i + 1}: ${list}`,
      description: `Atividade grátis de palavras frequentes: ler, cobrir e escrever ${list}, e achá-las numa frase.`,
      instrucao: "Leia cada palavra, cubra em letra cursiva e escreva sozinho. Circule essas palavras na frase.",
    });
  });
  for (const s of SYLLABLE_SHEETS) {
    const c = theme(s.category);
    const row = s.syllables.join(", ");
    const label =
      s.category === "familias-silabicas"
        ? s.label.length === 1
          ? `A família do ${s.label.toUpperCase()}`
          : `Família: ${s.label}`
        : s.category === "digrafos"
          ? `Dígrafo: ${s.label}`
          : s.category === "sons-nasais"
            ? `Sons nasais: ${s.label}`
            : s.slug.startsWith("final-")
              ? `Sílabas: ${s.label}`
              : `Sílabas com ${s.label}`;
    out.push({
      ...common(c, s.slug),
      syllables: s.slug,
      label,
      title: `Ler as sílabas ${row}`,
      description: `Atividade de leitura: as sílabas ${row}, palavras com figura separadas em sílabas e sílabas para escrever em letra cursiva.`,
      instrucao: "Leia as sílabas e depois as palavras, sílaba por sílaba. Escreva as sílabas em letra cursiva.",
    });
  }
  return out;
}

export const atividades: Atividade[] = buildAtividades();

function buildPacks(): AtividadePack[] {
  const packPdf = (slug: string) => `pro-files/pt/${slug}.pdf`;
  const inCategory = (c: string) => atividades.filter((a) => a.category === c).map((a) => a.slug);
  const packs: AtividadePack[] = [
    {
      slug: "pacote-alfabeto-completo",
      title: "O pacote do alfabeto completo",
      description: "Todas as atividades das letras de A a Z e do Ç: letra bastão, de forma, cursiva, reconhecer, sílaba inicial, colorir e palavras, num só PDF.",
      atividades: atividades.filter((a) => a.letter).map((a) => a.slug),
      file: packPdf("pacote-alfabeto-completo"),
    },
  ];
  for (const c of ATIVIDADE_CATEGORIES) {
    packs.push({
      slug: `pacote-${c.slug}`,
      title: `Pacote: ${c.name.charAt(0).toLowerCase()}${c.name.slice(1)}`,
      description: `${c.description} Todas as atividades num só PDF.`,
      atividades: inCategory(c.slug),
      file: packPdf(`pacote-${c.slug}`),
    });
  }
  for (const l of portugueseLetters) {
    packs.push({
      slug: `pacote-letra-${l.slug}`,
      title: cedilha(l) ? "Pacote do Ç" : `Pacote da letra ${l.upper}`,
      description: `Todas as atividades ${cedilha(l) ? "do Ç" : `da letra ${l.upper} ${l.lower}`} num só PDF: letra bastão, de forma, cursiva, reconhecer${FIRST_SYLLABLE_WORDS[l.slug] ? ", sílaba inicial" : ""}, colorir e palavras.`,
      atividades: atividades.filter((a) => a.letter === l.slug).map((a) => a.slug),
      file: packPdf(`pacote-letra-${l.slug}`),
    });
  }
  return packs;
}

export const atividadePacks: AtividadePack[] = buildPacks();

export function getAtividadeCategory(slug: string): AtividadeCategory | undefined {
  return ATIVIDADE_CATEGORIES.find((c) => c.slug === slug);
}

export function getAtividade(slug: string): Atividade | undefined {
  return atividades.find((a) => a.slug === slug);
}

export function getAtividadePack(slug: string): AtividadePack | undefined {
  return atividadePacks.find((p) => p.slug === slug);
}

export function atividadesInCategory(category: string): Atividade[] {
  return atividades.filter((a) => a.category === category);
}

export function atividadesForLetter(letter: string): Atividade[] {
  return atividades.filter((a) => a.letter === letter);
}

export function getSyllableSheet(slug: string): SyllableSheet | undefined {
  return SYLLABLE_SHEETS.find((s) => s.slug === slug);
}

/** The syllable worksheets linked from a syllable page (/pt/silabas/[skill]). */
export function atividadesForSyllablePage(page: string): Atividade[] {
  const slugs = new Set(SYLLABLE_SHEETS.filter((s) => s.pages.includes(page)).map((s) => s.slug));
  return atividades.filter((a) => a.syllables && slugs.has(a.syllables));
}

/** Previous and next worksheet in the same category (no wrap-around). */
export function atividadeNeighbors(slug: string): { prev?: Atividade; next?: Atividade } {
  const a = getAtividade(slug)!;
  const list = atividadesInCategory(a.category);
  const i = list.findIndex((x) => x.slug === slug);
  return { prev: list[i - 1], next: list[i + 1] };
}

/** Every Portuguese /atividades/[category] param: categories and worksheets. */
export function atividadeCategoryParams(): string[] {
  return [...ATIVIDADE_CATEGORIES.map((c) => c.slug), ...atividades.map((a) => a.slug)];
}
