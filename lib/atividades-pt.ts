// Portuguese printable worksheets ("atividades para imprimir"), the pages
// under /pt/atividades. Written for Brazilian schools (docs/portuguese-plan.md,
// P4, P6): the four kinds of letter (letra bastão, letra de forma, letra
// cursiva maiúscula and minúscula), cursive in Playwrite BR on "caligrafia"
// guide lines, numbers on quadriculado, syllables in the order of the
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

const w = (word: string, withArticle: string, emoji: string): PortugueseWord => ({ word, withArticle, emoji });

/**
 * "A sílaba inicial": pictured words split into syllables ("bo|la"), all
 * starting with the letter. Ç (never first), K, Q, W and Y (borrowed words or
 * a silent u) get no such sheet.
 */
export const FIRST_SYLLABLE_WORDS: Record<string, PortugueseWord[]> = {
  a: [w("a|be|lha", "uma abelha", "🐝"), w("a|vi|ão", "um avião", "✈️"), w("a|ra|nha", "uma aranha", "🕷️"), w("ân|co|ra", "uma âncora", "⚓")],
  b: [w("bo|la", "uma bola", "⚽"), w("ba|lei|a", "uma baleia", "🐳"), w("ba|na|na", "uma banana", "🍌"), w("bo|né", "um boné", "🧢")],
  c: [w("ca|sa", "uma casa", "🏠"), w("ce|bo|la", "uma cebola", "🧅"), w("co|e|lho", "um coelho", "🐰"), w("ca|va|lo", "um cavalo", "🐴")],
  d: [w("da|do", "um dado", "🎲"), w("den|te", "um dente", "🦷"), w("di|nos|sau|ro", "um dinossauro", "🦕"), w("de|do", "um dedo", "👆")],
  e: [w("e|le|fan|te", "um elefante", "🐘"), w("es|tre|la", "uma estrela", "⭐"), w("es|co|va", "uma escova", "🪥"), w("es|qui|lo", "um esquilo", "🐿️")],
  f: [w("fo|ca", "uma foca", "🦭"), w("fo|go", "o fogo", "🔥"), w("fa|da", "uma fada", "🧚"), w("fan|tas|ma", "um fantasma", "👻")],
  g: [w("ga|to", "um gato", "🐱"), w("gi|ra|fa", "uma girafa", "🦒"), w("go|ri|la", "um gorila", "🦍"), w("ga|li|nha", "uma galinha", "🐔")],
  h: [w("he|li|cóp|te|ro", "um helicóptero", "🚁"), w("hi|po|pó|ta|mo", "um hipopótamo", "🦛"), w("ho|tel", "um hotel", "🏨"), w("ham|búr|guer", "um hambúrguer", "🍔")],
  i: [w("i|gua|na", "uma iguana", "🦎"), w("i|lha", "uma ilha", "🏝️"), w("í|mã", "um ímã", "🧲"), w("i|gre|ja", "uma igreja", "⛪")],
  j: [w("ja|ca|ré", "um jacaré", "🐊"), w("ja|ne|la", "uma janela", "🪟"), w("jo|a|ni|nha", "uma joaninha", "🐞"), w("jar|dim", "um jardim", "🌷")],
  l: [w("le|ão", "um leão", "🦁"), w("lu|a", "a lua", "🌙"), w("lá|pis", "um lápis", "✏️"), w("li|mão", "um limão", "🍋")],
  m: [w("ma|ca|co", "um macaco", "🐒"), w("ma|la", "uma mala", "🧳"), w("ma|çã", "uma maçã", "🍎"), w("mo|to", "uma moto", "🏍️")],
  n: [w("na|vi|o", "um navio", "🚢"), w("nu|vem", "uma nuvem", "☁️"), w("na|riz", "um nariz", "👃"), w("ni|nho", "um ninho", "🪺")],
  o: [w("o|vo", "um ovo", "🥚"), w("o|ve|lha", "uma ovelha", "🐑"), w("o|lho", "um olho", "👁️"), w("on|ça", "uma onça", "🐆")],
  p: [w("pa|to", "um pato", "🦆"), w("pei|xe", "um peixe", "🐟"), w("pi|po|ca", "uma pipoca", "🍿"), w("pe|ra", "uma pera", "🍐")],
  r: [w("ra|to", "um rato", "🐭"), w("re|ló|gio", "um relógio", "⌚"), w("ro|sa", "uma rosa", "🌹"), w("ro|bô", "um robô", "🤖")],
  s: [w("sa|po", "um sapo", "🐸"), w("si|no", "um sino", "🔔"), w("so|pa", "uma sopa", "🍲"), w("su|co", "um suco", "🧃")],
  t: [w("tar|ta|ru|ga", "uma tartaruga", "🐢"), w("to|ma|te", "um tomate", "🍅"), w("ti|gre", "um tigre", "🐯"), w("tá|xi", "um táxi", "🚕")],
  u: [w("u|va", "uma uva", "🍇"), w("ur|so", "um urso", "🐻"), w("u|ni|cór|nio", "um unicórnio", "🦄"), w("u|nha", "uma unha", "💅")],
  v: [w("va|ca", "uma vaca", "🐄"), w("vul|cão", "um vulcão", "🌋"), w("ve|la", "uma vela", "🕯️"), w("vi|o|lão", "um violão", "🎸")],
  x: [w("xí|ca|ra", "uma xícara", "☕"), w("xa|drez", "o xadrez", "♟️"), w("xam|pu", "um xampu", "🧴")],
  z: [w("ze|bra", "uma zebra", "🦓"), w("ze|ro", "o número zero", "0️⃣")],
};

/** Look-alike letters mixed into the recognition grid. */
export const LOOK_ALIKES: Record<string, string> = {
  a: "odeq", b: "dpqh", c: "eoç", ç: "cse", d: "bpqa", e: "coa", f: "tlj", g: "qpy", h: "nbk", i: "ljt", j: "igy",
  k: "hxl", l: "itf", m: "nwu", n: "muh", o: "ace", p: "qbd", q: "pgd", r: "nvt", s: "zc", t: "fli",
  u: "nvy", v: "wuy", w: "vmu", x: "kzy", y: "vgj", z: "sx",
};

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
  { slug: "vermelho", name: "vermelho", hex: "#E53935", thing: w("maçã", "a maçã", "🍎") },
  { slug: "azul", name: "azul", hex: "#1E88E5", thing: w("baleia", "a baleia", "🐳") },
  { slug: "amarelo", name: "amarelo", hex: "#FDD835", thing: w("sol", "o sol", "☀️") },
  { slug: "verde", name: "verde", hex: "#43A047", thing: w("sapo", "o sapo", "🐸") },
  { slug: "laranja", name: "laranja", hex: "#FB8C00", thing: w("cenoura", "a cenoura", "🥕") },
  { slug: "roxo", name: "roxo", hex: "#8E24AA", thing: w("uvas", "as uvas", "🍇") },
  { slug: "rosa", name: "rosa", hex: "#F48FB1", thing: w("flamingo", "o flamingo", "🦩") },
  { slug: "marrom", name: "marrom", hex: "#795548", thing: w("urso", "o urso", "🐻") },
  { slug: "cinza", name: "cinza", hex: "#9E9E9E", thing: w("elefante", "o elefante", "🐘") },
  { slug: "preto", name: "preto", hex: "#212121", thing: w("chapéu", "o chapéu", "🎩") },
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
  familia("familia-b", "b", "ba be bi bo bu", ["familias-silabicas"], [w("bo|la", "uma bola", "⚽"), w("ba|na|na", "uma banana", "🍌"), w("bo|né", "um boné", "🧢"), w("ba|lei|a", "uma baleia", "🐳")]),
  familia("familia-ca-co-cu", "ca, co, cu", "ca co cu", ["c-e-cedilha"], [w("ca|sa", "uma casa", "🏠"), w("co|e|lho", "um coelho", "🐰"), w("cu|bo", "um cubo de gelo", "🧊"), w("fo|ca", "uma foca", "🦭")]),
  familia("familia-ce-ci", "ce, ci", "ce ci", ["c-e-cedilha"], [w("ce|bo|la", "uma cebola", "🧅"), w("ci|ne|ma", "um cinema", "🎬"), w("ce|nou|ra", "uma cenoura", "🥕")], { note: "Antes de e e i, o c soa como s." }),
  familia("familia-c-cedilha", "ça, ço, çu", "ça ço çu", ["c-e-cedilha"], [w("ma|çã", "uma maçã", "🍎"), w("pa|lha|ço", "um palhaço", "🤡"), w("co|ra|ção", "um coração", "❤️"), w("ta|ça", "uma taça", "🏆")], { note: "O ç só aparece antes de a, o e u." }),
  familia("familia-d", "d", "da de di do du", ["familias-silabicas"], [w("da|do", "um dado", "🎲"), w("de|do", "um dedo", "👆"), w("den|te", "um dente", "🦷"), w("di|nos|sau|ro", "um dinossauro", "🦕")]),
  familia("familia-f", "f", "fa fe fi fo fu", ["familias-silabicas"], [w("fo|ca", "uma foca", "🦭"), w("fa|da", "uma fada", "🧚"), w("fo|go", "o fogo", "🔥"), w("ca|fé", "um café", "☕")]),
  familia("familia-ga-go-gu", "ga, go, gu", "ga go gu", ["g-e-j", "gu"], [w("ga|to", "um gato", "🐱"), w("go|ri|la", "um gorila", "🦍"), w("ga|li|nha", "uma galinha", "🐔"), w("a|gu|lha", "uma agulha", "🪡")]),
  familia("familia-ge-gi", "ge, gi", "ge gi", ["g-e-j"], [w("ge|lo", "o gelo", "🧊"), w("gi|ra|fa", "uma girafa", "🦒"), w("ti|ge|la", "uma tigela", "🥣")], { note: "Antes de e e i, o g soa como j." }),
  familia("familia-j", "j", "ja je ji jo ju", ["g-e-j"], [w("ja|ca|ré", "um jacaré", "🐊"), w("ja|ne|la", "uma janela", "🪟"), w("jo|a|ni|nha", "uma joaninha", "🐞"), w("joi|a", "uma joia", "💎")]),
  familia("familia-l", "l", "la le li lo lu", ["familias-silabicas", "al-el-il-ol-ul"], [w("lu|a", "a lua", "🌙"), w("le|ão", "um leão", "🦁"), w("li|mão", "um limão", "🍋"), w("ma|la", "uma mala", "🧳")]),
  familia("familia-m", "m", "ma me mi mo mu", ["familias-silabicas", "am-em-im-om-um"], [w("ma|ca|co", "um macaco", "🐒"), w("me|sa", "uma mesa", "🪑"), w("mo|to", "uma moto", "🏍️"), w("ca|mi|sa", "uma camisa", "👕")]),
  familia("familia-n", "n", "na ne ni no nu", ["familias-silabicas", "an-en-in-on-un"], [w("na|vi|o", "um navio", "🚢"), w("nu|vem", "uma nuvem", "☁️"), w("na|riz", "um nariz", "👃"), w("bo|ne|ca", "uma boneca", "🪆")]),
  familia("familia-p", "p", "pa pe pi po pu", ["familias-silabicas"], [w("pa|to", "um pato", "🦆"), w("pe|ra", "uma pera", "🍐"), w("pi|po|ca", "uma pipoca", "🍿"), w("pi|a|no", "um piano", "🎹")]),
  familia("familia-r", "r", "ra re ri ro ru", ["rr"], [w("ra|to", "um rato", "🐭"), w("ro|sa", "uma rosa", "🌹"), w("re|ló|gio", "um relógio", "⌚"), w("ro|bô", "um robô", "🤖")], { note: "No começo da palavra, o r é forte." }),
  familia("familia-s", "s", "sa se si so su", ["ss"], [w("sa|po", "um sapo", "🐸"), w("si|no", "um sino", "🔔"), w("so|pa", "uma sopa", "🍲"), w("su|co", "um suco", "🧃")]),
  familia("familia-t", "t", "ta te ti to tu", ["familias-silabicas"], [w("to|ma|te", "um tomate", "🍅"), w("tar|ta|ru|ga", "uma tartaruga", "🐢"), w("ti|gre", "um tigre", "🐯")]),
  familia("familia-v", "v", "va ve vi vo vu", ["familias-silabicas"], [w("va|ca", "uma vaca", "🐄"), w("ve|la", "uma vela", "🕯️"), w("vi|o|lão", "um violão", "🎸"), w("u|va", "uma uva", "🍇")]),
  familia("familia-x", "x", "xa xe xi xo xu", ["x", "ch"], [w("xí|ca|ra", "uma xícara", "☕"), w("a|ba|ca|xi", "um abacaxi", "🍍"), w("pei|xe", "um peixe", "🐟"), w("cai|xa", "uma caixa", "📦")], { note: "Aqui o x tem o som de ch." }),
  familia("familia-z", "z", "za ze zi zo zu", ["ss"], [w("ze|bra", "uma zebra", "🦓"), w("ze|ro", "o número zero", "0️⃣"), w("a|zei|to|na", "uma azeitona", "🫒")]),
  digrafo("digrafo-ch", "ch", "cha che chi cho chu", ["ch"], [w("cha|ve", "uma chave", "🔑"), w("chu|va", "a chuva", "🌧️"), w("cho|co|la|te", "um chocolate", "🍫"), w("bi|cho", "um bicho", "🐛")]),
  digrafo("digrafo-lh", "lh", "lha lhe lhi lho lhu", ["lh"], [w("pa|lha|ço", "um palhaço", "🤡"), w("co|e|lho", "um coelho", "🐰"), w("a|be|lha", "uma abelha", "🐝"), w("fo|lha", "uma folha", "🍃")]),
  digrafo("digrafo-nh", "nh", "nha nhe nhi nho nhu", ["nh"], [w("ni|nho", "um ninho", "🪺"), w("ga|li|nha", "uma galinha", "🐔"), w("a|ra|nha", "uma aranha", "🕷️"), w("ba|nho", "um banho", "🛁")]),
  digrafo("digrafo-rr", "rr", "rra rre rri rro rru", ["rr"], [w("car|ro", "um carro", "🚗"), w("ca|chor|ro", "um cachorro", "🐶"), w("ter|ra", "a Terra", "🌍"), w("ar|roz", "o arroz", "🍚")], { note: "Na separação de sílabas, o rr fica dividido: car-ro." }),
  digrafo("digrafo-ss", "ss", "ssa sse ssi sso ssu", ["ss"], [w("pás|sa|ro", "um pássaro", "🐦"), w("os|so", "um osso", "🦴"), w("vas|sou|ra", "uma vassoura", "🧹")], { note: "Na separação de sílabas, o ss fica dividido: pás-sa-ro." }),
  digrafo("digrafo-qu", "que, qui", "que qui", ["qu"], [w("quei|jo", "um queijo", "🧀"), w("es|qui|lo", "um esquilo", "🐿️"), w("mos|qui|to", "um mosquito", "🦟")], { note: "Em que e qui, o u não soa." }),
  digrafo("digrafo-gu", "gue, gui", "gue gui", ["gu"], [w("gui|tar|ra", "uma guitarra", "🎸"), w("fo|gue|te", "um foguete", "🚀"), w("fo|guei|ra", "uma fogueira", "🔥")], { note: "Em gue e gui, o u não soa." }),
  sheet("sons-nasais", "nasal-til", "ã, ão, ãe, õe", "ã ão ãe õe", ["til"], [w("ma|çã", "uma maçã", "🍎"), w("ba|lão", "um balão", "🎈"), w("le|ão", "um leão", "🦁"), w("li|mões", "os limões", "🍋")], { note: "O til mostra que o som passa pelo nariz.", split: false }),
  sheet("sons-nasais", "nasal-an-en-in-on-un", "an, en, in, on, un", "an en in on un", ["an-en-in-on-un"], [w("an|jo", "um anjo", "👼"), w("den|te", "um dente", "🦷"), w("pin|ti|nho", "um pintinho", "🐥"), w("on|ça", "uma onça", "🐆")], { split: false }),
  sheet("sons-nasais", "nasal-am-em-im-om-um", "am, em, im, om, um", "am em im om um", ["am-em-im-om-um"], [w("pom|ba", "uma pomba", "🕊️"), w("tam|bor", "um tambor", "🥁"), w("bom|bom", "um bombom", "🍬"), w("lâm|pa|da", "uma lâmpada", "💡")], { note: "Antes de p e b, escreve-se m.", split: false }),
  sheet("silabas-complexas", "encontro-br", "br", "bra bre bri bro bru", ["encontros-com-r"], [w("bra|ço", "um braço", "💪"), w("co|bra", "uma cobra", "🐍"), w("bru|xa", "uma bruxa", "🧙‍♀️"), w("ca|bra", "uma cabra", "🐐")]),
  sheet("silabas-complexas", "encontro-cr", "cr", "cra cre cri cro cru", ["encontros-com-r"], [w("cro|co|di|lo", "um crocodilo", "🐊"), w("mi|cro|fo|ne", "um microfone", "🎤"), w("cri|an|ça", "uma criança", "🧒")]),
  sheet("silabas-complexas", "encontro-dr", "dr", "dra dre dri dro dru", ["encontros-com-r"], [w("dra|gão", "um dragão", "🐉"), w("pe|dra", "uma pedra", "🪨"), w("qua|dra|do", "um quadrado", "🟥")]),
  sheet("silabas-complexas", "encontro-fr", "fr", "fra fre fri fro fru", ["encontros-com-r"], [w("fru|ta", "uma fruta", "🍓"), w("fri|o", "o frio", "🥶"), w("fran|go", "um frango", "🍗")]),
  sheet("silabas-complexas", "encontro-gr", "gr", "gra gre gri gro gru", ["encontros-com-r"], [w("gri|lo", "um grilo", "🦗"), w("ti|gre", "um tigre", "🐯"), w("gra|ma", "a grama", "🌱")]),
  sheet("silabas-complexas", "encontro-pr", "pr", "pra pre pri pro pru", ["encontros-com-r"], [w("pra|to", "um prato", "🍽️"), w("prê|mio", "um prêmio", "🏆"), w("prin|ce|sa", "uma princesa", "👸"), w("pre|sen|te", "um presente", "🎁")]),
  sheet("silabas-complexas", "encontro-tr", "tr", "tra tre tri tro tru", ["encontros-com-r"], [w("trem", "um trem", "🚂"), w("tra|tor", "um trator", "🚜"), w("es|tre|la", "uma estrela", "⭐"), w("trom|pe|te", "um trompete", "🎺")]),
  sheet("silabas-complexas", "encontro-bl", "bl", "bla ble bli blo blu", ["encontros-com-l"], [w("blo|co", "um bloco", "🧱"), w("blu|sa", "uma blusa", "👚"), w("bi|bli|o|te|ca", "uma biblioteca", "📚")]),
  sheet("silabas-complexas", "encontro-cl", "cl", "cla cle cli clo clu", ["encontros-com-l"], [w("bi|ci|cle|ta", "uma bicicleta", "🚲"), w("cli|pe", "um clipe", "📎"), w("te|cla|do", "um teclado", "⌨️")]),
  sheet("silabas-complexas", "encontro-fl", "fl", "fla fle fli flo flu", ["encontros-com-l"], [w("flor", "uma flor", "🌸"), w("flau|ta", "uma flauta", "🪈"), w("fle|cha", "uma flecha", "🏹"), w("flo|res|ta", "uma floresta", "🌳")]),
  sheet("silabas-complexas", "encontro-gl", "gl", "gla gle gli glo glu", ["encontros-com-l"], [w("glo|bo", "um globo", "🌐"), w("i|glu", "um iglu", "🛖")]),
  sheet("silabas-complexas", "encontro-pl", "pl", "pla ple pli plo plu", ["encontros-com-l"], [w("pla|ne|ta", "um planeta", "🪐"), w("plan|ta", "uma planta", "🪴")]),
  sheet("silabas-complexas", "final-r", "ar, er, ir, or, ur", "ar er ir or ur", ["ar-er-ir-or-ur"], [w("bar|co", "um barco", "⛵"), w("por|ta", "uma porta", "🚪"), w("sor|ve|te", "um sorvete", "🍦"), w("for|mi|ga", "uma formiga", "🐜")], { split: false }),
  sheet("silabas-complexas", "final-s", "as, es, is, os, us", "as es is os us", ["as-es-is-os-us"], [w("es|co|la", "uma escola", "🏫"), w("cas|te|lo", "um castelo", "🏰"), w("mos|ca", "uma mosca", "🪰"), w("ô|ni|bus", "um ônibus", "🚌")], { split: false }),
  sheet("silabas-complexas", "final-l", "al, el, il, ol, ul", "al el il ol ul", ["al-el-il-ol-ul"], [w("sol", "o sol", "☀️"), w("a|nel", "um anel", "💍"), w("bal|de", "um balde", "🪣"), w("cal|ça", "uma calça", "👖")], { note: "No fim da sílaba, o l soa como u.", split: false }),
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
    description: "Os números de 0 a 20 no quadriculado: cobrir o número, colorir a quantidade e escrever o nome.",
    intro:
      "Uma atividade por número, do zero ao vinte: o número para cobrir no quadriculado, como no caderno de matemática, a quantidade para colorir e o nome do número para copiar em letra cursiva.",
    level: "Educação infantil e 1º ano (4 a 7 anos)",
    skills: ["Escrever números", "Quantidades", "Quadriculado"],
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
  const balloons = (n: number) => `${n} ${n === 1 ? "balão" : "balões"}`;

  const numeros = theme("numeros");
  NUMBERS.forEach((word, n) => {
    out.push({
      ...common(numeros, `numero-${n}`),
      label: `O número ${n}`,
      title: `O número ${n} (${word}): escrever e colorir`,
      description: `Atividade grátis do número ${n}: o número para cobrir no quadriculado, ${n === 0 ? "nada para colorir (zero!)" : `${balloons(n)} para colorir`} e a palavra “${word}” para escrever em letra cursiva.`,
      instrucao: n === 0 ? "Cubra o número 0. Zero é nada: não pinte nenhum balão!" : `Cubra o número ${n} no quadriculado e pinte ${balloons(n)}.`,
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
