// Spanish printable worksheets ("fichas"), the pages under /es/fichas.
// Written for Spanish-speaking schools (docs/spanish-plan.md, D7 option B):
// letra script (print) and letra cursiva (Playwrite MX) on four-line "doble
// raya" guides, numbers on cuadrícula, syllables in the order of the método
// silábico. Every slug is Spanish-only: they don't mirror the English or the
// French worksheets.
//
// The PDFs are pre-rendered by `npm run fichas:es` (scripts/fichas-es/) with
// Chromium, like the French ones. They live in public/fichas-pdf/ with a
// JPEG preview of each page. This file is the catalogue both the script and
// the pages read.
//
// Pure data (plus the letter and syllable data it builds on).
import { spanishLetters, type SpanishLetter, type SpanishWord } from "./letters-es";

export const FICHAS_PDF_DIR = "/fichas-pdf";

export type FichaCategoryGroup = "letras" | "temas" | "silabas";

export type FichaCategory = {
  slug: string;
  group: FichaCategoryGroup;
  name: string;
  /** Card blurb and meta description. */
  description: string;
  /** Paragraph at the top of the category page. */
  intro: string;
  level: string;
  skills: string[];
};

/** The six worksheet types made for the letters, in page order. */
export type LetterFichaType = "trazo" | "cursiva" | "reconocer" | "silaba" | "colorear" | "palabras";

export type Ficha = {
  slug: string;
  category: string;
  title: string;
  /** Short name used in lists ("Letra B", "El número 3"). */
  label: string;
  description: string;
  /** The instruction printed on the sheet. */
  consigna: string;
  level: string;
  skills: string[];
  /** Letter slug, for letter worksheets. */
  letter?: string;
  /** Syllable sheet, for syllable worksheets. */
  syllables?: string;
  pdf: string;
  preview: string;
};

export type FichaPack = {
  slug: string;
  title: string;
  description: string;
  fichas: string[];
  pdf: string;
};

// ---------------------------------------------------------------- content

const w = (word: string, withArticle: string, emoji: string): SpanishWord => ({ word, withArticle, emoji });

/**
 * "Escribe la primera sílaba": pictured words split into syllables ("ma|no"),
 * all starting with the letter. Letters with no clear first-letter words
 * (ñ, q, w, x) get no such sheet.
 */
export const FIRST_SYLLABLE_WORDS: Record<string, SpanishWord[]> = {
  a: [w("a|vión", "un avión", "✈️"), w("a|be|ja", "una abeja", "🐝"), w("a|ra|ña", "una araña", "🕷️"), w("an|cla", "un ancla", "⚓")],
  b: [w("ba|lle|na", "una ballena", "🐳"), w("bar|co", "un barco", "⛵"), w("bo|ta", "una bota", "👢"), w("bu|rro", "un burro", "🫏")],
  c: [w("co|ne|jo", "un conejo", "🐰"), w("ca|sa", "una casa", "🏠"), w("cu|cha|ra", "una cuchara", "🥄"), w("ce|re|za", "una cereza", "🍒")],
  d: [w("da|do", "un dado", "🎲"), w("del|fín", "un delfín", "🐬"), w("di|no|sau|rio", "un dinosaurio", "🦕"), w("du|cha", "una ducha", "🚿")],
  e: [w("e|le|fan|te", "un elefante", "🐘"), w("es|tre|lla", "una estrella", "⭐"), w("es|co|ba", "una escoba", "🧹"), w("el|fo", "un elfo", "🧝")],
  f: [w("fo|ca", "una foca", "🦭"), w("fue|go", "un fuego", "🔥"), w("fan|tas|ma", "un fantasma", "👻")],
  g: [w("ga|to", "un gato", "🐱"), w("go|ri|la", "un gorila", "🦍"), w("gu|sa|no", "un gusano", "🐛"), w("gi|ra|sol", "un girasol", "🌻")],
  h: [w("he|la|do", "un helado", "🍦"), w("hue|vo", "un huevo", "🥚"), w("hor|mi|ga", "una hormiga", "🐜"), w("ha|da", "un hada", "🧚")],
  i: [w("i|gua|na", "una iguana", "🦎"), w("is|la", "una isla", "🏝️"), w("i|mán", "un imán", "🧲")],
  j: [w("ji|ra|fa", "una jirafa", "🦒"), w("ja|bón", "un jabón", "🧼"), w("ju|gue|te", "un juguete", "🧸")],
  k: [w("ko|a|la", "un koala", "🐨"), w("ka|yak", "un kayak", "🛶"), w("ki|wi", "un kiwi", "🥝")],
  l: [w("le|ón", "un león", "🦁"), w("lu|na", "una luna", "🌙"), w("lá|piz", "un lápiz", "✏️"), w("lo|ro", "un loro", "🦜")],
  m: [w("man|za|na", "una manzana", "🍎"), w("mo|no", "un mono", "🐒"), w("ma|no", "una mano", "✋"), w("ma|ri|po|sa", "una mariposa", "🦋")],
  n: [w("nu|be", "una nube", "☁️"), w("na|riz", "una nariz", "👃"), w("ni|ño", "un niño", "🧒"), w("ni|do", "un nido", "🪺")],
  o: [w("o|so", "un oso", "🐻"), w("o|ve|ja", "una oveja", "🐑"), w("o|jo", "un ojo", "👁️")],
  p: [w("pa|to", "un pato", "🦆"), w("pe|rro", "un perro", "🐶"), w("pe|lo|ta", "una pelota", "⚽"), w("pin|güi|no", "un pingüino", "🐧")],
  r: [w("ra|tón", "un ratón", "🐭"), w("ra|na", "una rana", "🐸"), w("ro|sa", "una rosa", "🌹"), w("re|loj", "un reloj", "⏰")],
  s: [w("ser|pien|te", "una serpiente", "🐍"), w("si|lla", "una silla", "🪑"), w("so|pa", "una sopa", "🍲")],
  t: [w("tor|tu|ga", "una tortuga", "🐢"), w("to|ma|te", "un tomate", "🍅"), w("ti|gre", "un tigre", "🐯"), w("ta|xi", "un taxi", "🚕")],
  u: [w("u|va", "una uva", "🍇"), w("u|ni|cor|nio", "un unicornio", "🦄"), w("u|ña", "una uña", "💅")],
  v: [w("va|ca", "una vaca", "🐄"), w("vol|cán", "un volcán", "🌋"), w("ve|la", "una vela", "🕯️")],
  y: [w("yo|yó", "un yoyó", "🪀"), w("ya|te", "un yate", "🛥️")],
  z: [w("za|pa|to", "un zapato", "👞"), w("zo|rro", "un zorro", "🦊"), w("za|na|ho|ria", "una zanahoria", "🥕")],
};

/** Look-alike letters mixed into the recognition grid. */
export const LOOK_ALIKES: Record<string, string> = {
  a: "odeq", b: "dpqh", c: "eo", d: "bpqa", e: "coa", f: "tlj", g: "qpy", h: "nbk", i: "ljt", j: "igy",
  k: "hxl", l: "itf", m: "nwu", n: "muhñ", ñ: "nmh", o: "ace", p: "qbd", q: "pgd", r: "nvt", s: "zc", t: "fli",
  u: "nvy", v: "wuy", w: "vmu", x: "kzy", y: "vgj", z: "sx",
};

export const NUMBERS = [
  "cero", "uno", "dos", "tres", "cuatro", "cinco", "seis", "siete", "ocho", "nueve", "diez",
  "once", "doce", "trece", "catorce", "quince", "dieciséis", "diecisiete", "dieciocho", "diecinueve", "veinte",
];

export type Shape = { slug: string; name: string; withArticle: string; /** Shape drawn by the French template helper. */ draw: string };
export const SHAPES: Shape[] = [
  { slug: "circulo", name: "círculo", withArticle: "el círculo", draw: "rond" },
  { slug: "cuadrado", name: "cuadrado", withArticle: "el cuadrado", draw: "carre" },
  { slug: "triangulo", name: "triángulo", withArticle: "el triángulo", draw: "triangle" },
  { slug: "rectangulo", name: "rectángulo", withArticle: "el rectángulo", draw: "rectangle" },
  { slug: "rombo", name: "rombo", withArticle: "el rombo", draw: "losange" },
  { slug: "ovalo", name: "óvalo", withArticle: "el óvalo", draw: "ovale" },
  { slug: "estrella", name: "estrella", withArticle: "la estrella", draw: "etoile" },
  { slug: "corazon", name: "corazón", withArticle: "el corazón", draw: "coeur" },
];

export type Colour = {
  slug: string;
  /** The word written on the sheet's cursive row. */
  name: string;
  /** Another name used in other countries, shown in brackets: "café (marrón)". */
  alt?: string;
  hex: string;
  thing: SpanishWord;
};

/** "café (marrón)" for a colour with another regional name, else the name. */
export const colourLabel = (c: Colour) => (c.alt ? `${c.name} (${c.alt})` : c.name);
export const COLOURS: Colour[] = [
  { slug: "rojo", name: "rojo", hex: "#E53935", thing: w("manzana", "la manzana", "🍎") },
  { slug: "azul", name: "azul", hex: "#1E88E5", thing: w("ballena", "la ballena", "🐳") },
  { slug: "amarillo", name: "amarillo", hex: "#FDD835", thing: w("sol", "el sol", "☀️") },
  { slug: "verde", name: "verde", hex: "#43A047", thing: w("rana", "la rana", "🐸") },
  { slug: "naranja", name: "naranja", hex: "#FB8C00", thing: w("zanahoria", "la zanahoria", "🥕") },
  { slug: "morado", name: "morado", hex: "#8E24AA", thing: w("uvas", "las uvas", "🍇") },
  { slug: "rosa", name: "rosa", hex: "#F48FB1", thing: w("flamenco", "el flamenco", "🦩") },
  { slug: "cafe", name: "café", alt: "marrón", hex: "#795548", thing: w("oso", "el oso", "🐻") },
  { slug: "gris", name: "gris", hex: "#9E9E9E", thing: w("elefante", "el elefante", "🐘") },
  { slug: "negro", name: "negro", hex: "#212121", thing: w("sombrero", "el sombrero", "🎩") },
];

/** Frequent words, four per sheet, with a sentence that uses them. */
export const FREQUENT_WORD_GROUPS: { words: string[]; sentence: string }[] = [
  { words: ["el", "la", "los", "las"], sentence: "El gato y la rana ven los peces y las flores." },
  { words: ["un", "una", "y", "es"], sentence: "Es un oso y una oveja." },
  { words: ["mi", "tu", "yo", "con"], sentence: "Yo juego con mi perro y con tu pelota." },
  { words: ["en", "de", "al", "del"], sentence: "La taza de Ana está en la mesa del comedor." },
  { words: ["no", "sí", "que", "se"], sentence: "¿Se ve la luna? Sí, que bonita. No hay nubes." },
];

/**
 * Syllable sheets ("una ficha por consonante"): the syllables to read, then
 * pictured words cut into syllables ("ma|no"). `pages` lists the syllable
 * pages (lib/silabas-es.ts) that link to the sheet.
 */
export type SyllableSheet = {
  slug: string;
  /** Short name: "m", "ca, co, cu", "bl". */
  label: string;
  syllables: string[];
  words: SpanishWord[];
  pages: string[];
  /** Blends (bl, tr…) go in their own category. */
  blend?: boolean;
  /** A note under the syllable table ("la u no suena"). */
  note?: string;
};

const sheet = (
  slug: string,
  label: string,
  syllables: string,
  pages: string[],
  words: SpanishWord[],
  extra: { blend?: boolean; note?: string } = {},
): SyllableSheet => ({ slug, label, syllables: syllables.split(" "), words, pages, ...extra });

export const SYLLABLE_SHEETS: SyllableSheet[] = [
  sheet("silabas-m", "m", "ma me mi mo mu", ["silabas-directas"], [w("ma|no", "una mano", "✋"), w("mo|no", "un mono", "🐒"), w("mo|to", "una moto", "🏍️"), w("ma|ri|po|sa", "una mariposa", "🦋")]),
  sheet("silabas-p", "p", "pa pe pi po pu", ["silabas-directas"], [w("pa|to", "un pato", "🦆"), w("pe|lo|ta", "una pelota", "⚽"), w("pa|lo|ma", "una paloma", "🕊️"), w("pe|ra", "una pera", "🍐")]),
  sheet("silabas-s", "s", "sa se si so su", ["silabas-directas", "ce-ci-y-z"], [w("so|pa", "una sopa", "🍲"), w("sa|po", "un sapo", "🐸"), w("si|lla", "una silla", "🪑"), w("ca|sa", "una casa", "🏠")]),
  sheet("silabas-l", "l", "la le li lo lu", ["silabas-directas"], [w("lu|na", "una luna", "🌙"), w("lo|ro", "un loro", "🦜"), w("le|ón", "un león", "🦁"), w("li|món", "un limón", "🍋")]),
  sheet("silabas-t", "t", "ta te ti to tu", ["silabas-directas"], [w("to|ma|te", "un tomate", "🍅"), w("pa|to", "un pato", "🦆"), w("ti|je|ras", "unas tijeras", "✂️"), w("ta|za", "una taza", "☕")]),
  sheet("silabas-d", "d", "da de di do du", ["silabas-directas"], [w("da|do", "un dado", "🎲"), w("de|do", "un dedo", "👆"), w("di|ne|ro", "el dinero", "💵"), w("du|cha", "una ducha", "🚿")]),
  sheet("silabas-n", "n", "na ne ni no nu", ["silabas-directas"], [w("nu|be", "una nube", "☁️"), w("na|riz", "una nariz", "👃"), w("ni|do", "un nido", "🪺"), w("lu|na", "una luna", "🌙")]),
  sheet("silabas-f", "f", "fa fe fi fo fu", ["silabas-directas"], [w("fo|ca", "una foca", "🦭"), w("fue|go", "un fuego", "🔥"), w("ca|fé", "un café", "☕"), w("fan|tas|ma", "un fantasma", "👻")]),
  sheet("silabas-b", "b", "ba be bi bo bu", ["silabas-directas", "b-y-v"], [w("bo|ta", "una bota", "👢"), w("bu|rro", "un burro", "🫏"), w("ba|lle|na", "una ballena", "🐳"), w("be|bé", "un bebé", "👶")]),
  sheet("silabas-v", "v", "va ve vi vo vu", ["b-y-v"], [w("va|ca", "una vaca", "🐄"), w("ve|la", "una vela", "🕯️"), w("u|va", "una uva", "🍇"), w("vol|cán", "un volcán", "🌋")]),
  sheet("silabas-r", "r suave", "ra re ri ro ru", ["r-y-rr"], [w("pe|ra", "una pera", "🍐"), w("lo|ro", "un loro", "🦜"), w("co|ro|na", "una corona", "👑"), w("ma|ri|po|sa", "una mariposa", "🦋")], { note: "Entre dos vocales, la r suena suave." }),
  sheet("silabas-rr", "rr", "rra rre rri rro rru", ["r-y-rr"], [w("pe|rro", "un perro", "🐶"), w("zo|rro", "un zorro", "🦊"), w("bu|rro", "un burro", "🫏"), w("go|rra", "una gorra", "🧢")], { note: "La rr suena fuerte, como la r al principio de ratón." }),
  sheet("silabas-j", "j", "ja je ji jo ju", ["ge-gi-y-j"], [w("ji|ra|fa", "una jirafa", "🦒"), w("ja|bón", "un jabón", "🧼"), w("o|jo", "un ojo", "👁️"), w("a|jo", "un ajo", "🧄")]),
  sheet("silabas-enie", "ñ", "ña ñe ñi ño ñu", ["enie"], [w("ni|ño", "un niño", "🧒"), w("a|ra|ña", "una araña", "🕷️"), w("u|ña", "una uña", "💅"), w("ba|ño", "un baño", "🛁")]),
  sheet("silabas-ll", "ll", "lla lle lli llo llu", ["ll-y-y"], [w("lla|ve", "una llave", "🔑"), w("llu|via", "la lluvia", "🌧️"), w("es|tre|lla", "una estrella", "⭐"), w("po|lli|to", "un pollito", "🐥")]),
  sheet("silabas-y", "y", "ya ye yi yo yu", ["ll-y-y"], [w("yo|yó", "un yoyó", "🪀"), w("ya|te", "un yate", "🛥️"), w("pla|ya", "una playa", "🏖️"), w("ra|yo", "un rayo", "⚡")]),
  sheet("silabas-ch", "ch", "cha che chi cho chu", ["ch"], [w("cho|co|la|te", "un chocolate", "🍫"), w("le|che", "la leche", "🥛"), w("cu|cha|ra", "una cuchara", "🥄"), w("mo|chi|la", "una mochila", "🎒")]),
  sheet("silabas-h", "h", "ha he hi ho hu", ["h-muda"], [w("he|la|do", "un helado", "🍦"), w("hue|vo", "un huevo", "🥚"), w("hor|mi|ga", "una hormiga", "🐜"), w("bú|ho", "un búho", "🦉")], { note: "La h no suena: ha se lee «a»." }),
  sheet("silabas-z", "z", "za zo zu", ["ce-ci-y-z"], [w("za|pa|to", "un zapato", "👞"), w("zo|rro", "un zorro", "🦊"), w("ta|za", "una taza", "☕")]),
  sheet("silabas-ca-co-cu", "ca, co, cu", "ca co cu", ["ca-co-cu-que-qui"], [w("ca|sa", "una casa", "🏠"), w("co|ne|jo", "un conejo", "🐰"), w("cu|cha|ra", "una cuchara", "🥄"), w("fo|ca", "una foca", "🦭")]),
  sheet("silabas-que-qui", "que, qui", "que qui", ["ca-co-cu-que-qui"], [w("que|so", "un queso", "🧀"), w("mos|qui|to", "un mosquito", "🦟"), w("ra|que|ta", "una raqueta", "🎾"), w("pa|que|te", "un paquete", "📦")], { note: "En que y qui, la u no suena." }),
  sheet("silabas-ce-ci", "ce, ci", "ce ci", ["ce-ci-y-z"], [w("ce|re|za", "una cereza", "🍒"), w("ce|bra", "una cebra", "🦓"), w("ci|ne", "un cine", "🎬")], { note: "En Latinoamérica, ce y ci suenan como se y si." }),
  sheet("silabas-ga-go-gu", "ga, go, gu", "ga go gu", ["ga-go-gu-gue-gui"], [w("ga|to", "un gato", "🐱"), w("go|ri|la", "un gorila", "🦍"), w("gu|sa|no", "un gusano", "🐛"), w("la|go", "un lago", "🏞️")]),
  sheet("silabas-gue-gui", "gue, gui", "gue gui", ["ga-go-gu-gue-gui", "dieresis"], [w("gui|ta|rra", "una guitarra", "🎸"), w("ham|bur|gue|sa", "una hamburguesa", "🍔"), w("á|gui|la", "un águila", "🦅")], { note: "En gue y gui, la u no suena." }),
  sheet("silabas-ge-gi", "ge, gi", "ge gi", ["ge-gi-y-j"], [w("gi|ra|sol", "un girasol", "🌻"), w("ge|ma", "una gema", "💎"), w("ma|gia", "la magia", "🪄")], { note: "Ge y gi suenan como je y ji." }),
  sheet("trabadas-bl", "bl", "bla ble bli blo blu", ["trabadas-con-l"], [w("blu|sa", "una blusa", "👚"), w("ca|ble", "un cable", "🔌"), w("pue|blo", "un pueblo", "🏘️")], { blend: true }),
  sheet("trabadas-cl", "cl", "cla cle cli clo clu", ["trabadas-con-l"], [w("clip", "un clip", "📎"), w("bi|ci|cle|ta", "una bicicleta", "🚲"), w("te|cla|do", "un teclado", "⌨️")], { blend: true }),
  sheet("trabadas-fl", "fl", "fla fle fli flo flu", ["trabadas-con-l"], [w("flor", "una flor", "🌸"), w("flau|ta", "una flauta", "🪈"), w("fle|cha", "una flecha", "🏹"), w("flan", "un flan", "🍮")], { blend: true }),
  sheet("trabadas-gl", "gl", "gla gle gli glo glu", ["trabadas-con-l"], [w("glo|bo", "un globo", "🎈"), w("i|gle|sia", "una iglesia", "⛪"), w("re|gla", "una regla", "📏")], { blend: true }),
  sheet("trabadas-pl", "pl", "pla ple pli plo plu", ["trabadas-con-l"], [w("pla|to", "un plato", "🍽️"), w("plu|ma", "una pluma", "🪶"), w("pla|ya", "una playa", "🏖️"), w("plan|ta", "una planta", "🪴")], { blend: true }),
  sheet("trabadas-br", "br", "bra bre bri bro bru", ["trabadas-con-r"], [w("bra|zo", "un brazo", "💪"), w("bru|ja", "una bruja", "🧙‍♀️"), w("li|bro", "un libro", "📖"), w("ca|bra", "una cabra", "🐐")], { blend: true }),
  sheet("trabadas-cr", "cr", "cra cre cri cro cru", ["trabadas-con-r"], [w("mi|cró|fo|no", "un micrófono", "🎤"), w("se|cre|to", "un secreto", "🤫"), w("crá|ne|o", "un cráneo", "💀")], { blend: true }),
  sheet("trabadas-dr", "dr", "dra dre dri dro dru", ["trabadas-con-r"], [w("co|co|dri|lo", "un cocodrilo", "🐊"), w("dra|gón", "un dragón", "🐉"), w("la|dri|llo", "un ladrillo", "🧱"), w("pie|dra", "una piedra", "🪨")], { blend: true }),
  sheet("trabadas-fr", "fr", "fra fre fri fro fru", ["trabadas-con-r"], [w("fru|ta", "una fruta", "🍎"), w("frí|o", "el frío", "🥶"), w("fras|co", "un frasco", "🫙")], { blend: true }),
  sheet("trabadas-gr", "gr", "gra gre gri gro gru", ["trabadas-con-r"], [w("gri|llo", "un grillo", "🦗"), w("ti|gre", "un tigre", "🐯"), w("can|gre|jo", "un cangrejo", "🦀")], { blend: true }),
  sheet("trabadas-pr", "pr", "pra pre pri pro pru", ["trabadas-con-r"], [w("prín|ci|pe", "un príncipe", "🤴"), w("prin|ce|sa", "una princesa", "👸"), w("pre|mio", "un premio", "🏆")], { blend: true }),
  sheet("trabadas-tr", "tr", "tra tre tri tro tru", ["trabadas-con-r"], [w("tren", "un tren", "🚂"), w("trom|pe|ta", "una trompeta", "🎺"), w("es|tre|lla", "una estrella", "⭐")], { blend: true }),
];

// ---------------------------------------------------------------- catalogue

const LETTER_TYPES: { type: LetterFichaType; category: FichaCategory }[] = [
  {
    type: "trazo",
    category: {
      slug: "trazo-de-letras",
      group: "letras",
      name: "Trazo de letras",
      description: "Repasar la letra mayúscula y minúscula en letra script sobre doble raya, y después escribirla solo.",
      intro:
        "Una ficha por letra: la mayúscula y la minúscula en letra script para repasar siguiendo el contorno, y después renglones de doble raya para escribirla solo. Para preescolar y kínder, antes de la cursiva.",
      level: "Preescolar y kínder (4 a 6 años)",
      skills: ["Trazo", "Mayúsculas", "Letra script"],
    },
  },
  {
    type: "cursiva",
    category: {
      slug: "letra-cursiva",
      group: "letras",
      name: "Letra cursiva",
      description: "La letra en cursiva sobre doble raya: un modelo, letras para repasar y renglones para escribir.",
      intro:
        "Cada ficha muestra la letra en cursiva, la letra ligada de la escuela, sobre renglones de doble raya: un modelo, letras grises para repasar y el renglón para escribir solo. Primero la minúscula, luego la mayúscula y después una palabra.",
      level: "Kínder y primero (5 a 7 años)",
      skills: ["Letra cursiva", "Doble raya", "Trazo"],
    },
  },
  {
    type: "reconocer",
    category: {
      slug: "reconocer-letras",
      group: "letras",
      name: "Reconocer las letras",
      description: "Encontrar la letra en mayúscula, en script y en cursiva entre letras que se le parecen.",
      intro:
        "Una cuadrícula de letras en tres tipos de letra (mayúscula, script y cursiva), mezcladas con letras que se parecen (b, d, p, q…). El niño encierra todas las que reconoce.",
      level: "Preescolar y kínder (4 a 6 años)",
      skills: ["Reconocer letras", "Tres tipos de letra", "Atención visual"],
    },
  },
  {
    type: "silaba",
    category: {
      slug: "primera-silaba",
      group: "letras",
      name: "La primera sílaba",
      description: "Decir el nombre del dibujo y escribir la sílaba con la que empieza: __no, mano.",
      intro:
        "Cuatro dibujos con su palabra incompleta: falta la primera sílaba. El niño dice la palabra en voz alta, aplaude sus sílabas y escribe la primera en el recuadro. Un ejercicio que une el oído, las sílabas y la escritura.",
      level: "Kínder y primero (5 a 7 años)",
      skills: ["Sílabas", "Conciencia fonológica", "Escritura"],
    },
  },
  {
    type: "colorear",
    category: {
      slug: "colorear-letras",
      group: "letras",
      name: "Colorear letras",
      description: "Una letra grande y un dibujo para colorear, para unir la letra con una palabra.",
      intro:
        "Una letra grande para colorear y un dibujo cuyo nombre empieza con esa letra (o la lleva dentro). Perfecto para los más pequeños, desde los 3 años.",
      level: "Preescolar (3 a 5 años)",
      skills: ["Motricidad fina", "Reconocer letras", "Vocabulario"],
    },
  },
  {
    type: "palabras",
    category: {
      slug: "escribir-palabras",
      group: "letras",
      name: "Escribir palabras",
      description: "Palabras con dibujo para copiar en cursiva sobre doble raya: modelo, repasar y escribir solo.",
      intro:
        "Dos o tres palabras con dibujo por letra, para escribir en cursiva sobre doble raya: se lee el modelo, se repasa la palabra gris y después se escribe sola.",
      level: "Primero de primaria (6 a 7 años)",
      skills: ["Letra cursiva", "Copiar palabras", "Vocabulario"],
    },
  },
];

const THEME_CATEGORIES: FichaCategory[] = [
  {
    slug: "numeros",
    group: "temas",
    name: "Los números",
    description: "Los números del 0 al 20 en cuadrícula: repasar el número, colorear la cantidad y escribir su nombre.",
    intro:
      "Una ficha por número, del cero al veinte: el número para repasar en cuadrícula, como en el cuaderno de matemáticas, la cantidad para colorear y el nombre del número para copiar en cursiva.",
    level: "Preescolar a primero (4 a 7 años)",
    skills: ["Escribir números", "Cantidades", "Cuadrícula"],
  },
  {
    slug: "figuras",
    group: "temas",
    name: "Las figuras",
    description: "Círculo, cuadrado, triángulo… repasar las figuras y escribir su nombre.",
    intro:
      "Ocho figuras para repasar siguiendo los puntos: una grande y varias pequeñas, y su nombre para escribir. Preparan el trazo de las letras.",
    level: "Preescolar (3 a 5 años)",
    skills: ["Trazo", "Figuras geométricas", "Vocabulario"],
  },
  {
    slug: "colores",
    group: "temas",
    name: "Los colores",
    description: "Diez colores: colorear el dibujo del color correcto y escribir el nombre del color.",
    intro:
      "Rojo como la manzana, amarillo como el sol… Cada ficha une un color con un dibujo para colorear y el nombre del color para leer y escribir.",
    level: "Preescolar (3 a 5 años)",
    skills: ["Colores", "Colorear", "Leer palabras"],
  },
  {
    slug: "palabras-frecuentes",
    group: "temas",
    name: "Palabras frecuentes",
    description: "Las palabras cortas más frecuentes (el, la, un, y, de, en…) para leer, repasar y escribir.",
    intro:
      "Cuatro palabras frecuentes por ficha: se leen en script, se repasan en cursiva, se escriben solas y se encuentran en una oración.",
    level: "Primero de primaria (6 a 7 años)",
    skills: ["Palabras frecuentes", "Lectura", "Letra cursiva"],
  },
];

const SYLLABLE_CATEGORIES: FichaCategory[] = [
  {
    slug: "silabas",
    group: "silabas",
    name: "Las sílabas",
    description: "Una ficha por consonante: leer sus sílabas (ma, me, mi, mo, mu), palabras partidas en sílabas y escribir en cursiva.",
    intro:
      "Una ficha para cada consonante, en el orden del método silábico: la tabla de sílabas para leer, las mismas sílabas en desorden, palabras con dibujo partidas en sílabas y sílabas para escribir en cursiva. También ch, ll, rr, que y qui, gue y gui.",
    level: "Kínder y primero (5 a 7 años)",
    skills: ["Sílabas", "Lectura", "Letra cursiva"],
  },
  {
    slug: "silabas-trabadas",
    group: "silabas",
    name: "Sílabas trabadas",
    description: "bl, cl, fl, gl, pl y br, cr, dr, fr, gr, pr, tr: leer las sílabas trabadas y las palabras que las llevan.",
    intro:
      "Una ficha para cada grupo de sílabas trabadas: la tabla de sílabas (bla, ble, bli…), palabras con dibujo partidas en sílabas y sílabas para escribir en cursiva.",
    level: "Primero de primaria (6 a 7 años)",
    skills: ["Sílabas trabadas", "Lectura", "Letra cursiva"],
  },
];

export const FICHA_CATEGORIES: FichaCategory[] = [
  ...LETTER_TYPES.map((t) => t.category),
  ...THEME_CATEGORIES,
  ...SYLLABLE_CATEGORIES,
];

const pdfPath = (category: string, slug: string) => `${FICHAS_PDF_DIR}/${category}/${slug}.pdf`;
const previewPath = (slug: string) => `${FICHAS_PDF_DIR}/vistas-previas/${slug}.jpg`;

function letterFicha(l: SpanishLetter, type: LetterFichaType, category: FichaCategory): Ficha | null {
  const slug = `letra-${l.slug}-${type}`;
  const base = {
    slug,
    category: category.slug,
    level: category.level,
    skills: category.skills,
    letter: l.slug,
    pdf: pdfPath(category.slug, slug),
    preview: previewPath(slug),
    label: `Letra ${l.upper}`,
  };
  const first = l.words[0].word.toLowerCase();
  switch (type) {
    case "trazo":
      return {
        ...base,
        title: `Trazar la letra ${l.upper} en mayúscula y minúscula`,
        description: `Ficha gratis para imprimir: trazar la letra ${l.upper} en mayúscula y la ${l.lower} en minúscula, en letra script sobre doble raya, con la palabra ${first}.`,
        consigna: `Repasa las letras ${l.upper} y ${l.lower} siguiendo el contorno, y después escríbelas solo en el renglón.`,
      };
    case "cursiva":
      return {
        ...base,
        title: `Escribir la letra ${l.upper} en cursiva (doble raya)`,
        description: `Ficha de letra cursiva de la ${l.upper} sobre doble raya: un modelo, letras para repasar, la mayúscula y la palabra ${first}.`,
        consigna: "Repasa las letras grises y después escribe la letra sola hasta el final del renglón.",
      };
    case "reconocer":
      return {
        ...base,
        title: `Reconocer la letra ${l.upper} en sus tres formas`,
        description: `Ficha gratis: encontrar la letra ${l.upper} en mayúscula, en script y en cursiva entre letras que se le parecen.`,
        consigna: `Encierra todas las letras ${l.upper} ${l.lower} que encuentres: en mayúscula, en script y en cursiva.`,
      };
    case "silaba": {
      const words = FIRST_SYLLABLE_WORDS[l.slug];
      if (!words) return null;
      return {
        ...base,
        title: `La primera sílaba: palabras con ${l.upper}`,
        description: `Ficha de sílabas con la letra ${l.upper}: decir el nombre de cada dibujo y escribir su primera sílaba, como ${words[0].word.split("|")[0]} en ${words[0].word.replace(/\|/g, "")}.`,
        consigna: "Di el nombre del dibujo, aplaude sus sílabas y escribe la primera en el recuadro.",
      };
    }
    case "colorear":
      return {
        ...base,
        title: `Colorear la letra ${l.upper}`,
        description: `Dibujo para colorear gratis: una letra ${l.upper} grande y ${l.words[0].withArticle}, para unir la letra con la palabra.`,
        consigna: `Colorea la letra ${l.upper} grande, la ${l.lower} pequeña y el dibujo: es ${l.words[0].withArticle}. Di la palabra en voz alta.`,
      };
    case "palabras":
      return {
        ...base,
        title: `Escribir palabras con la letra ${l.upper}`,
        description: `Ficha de letra cursiva sobre doble raya: palabras con ${l.upper} para leer, repasar y escribir solo.`,
        consigna: "Lee la palabra, repásala en gris y después escríbela sola en el renglón.",
      };
  }
}

function cap(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function buildFichas(): Ficha[] {
  const out: Ficha[] = [];
  for (const { type, category } of LETTER_TYPES) {
    for (const l of spanishLetters) {
      const f = letterFicha(l, type, category);
      if (f) out.push(f);
    }
  }
  const theme = (slug: string) => FICHA_CATEGORIES.find((c) => c.slug === slug)!;
  const common = (c: FichaCategory, slug: string) => ({ slug, category: c.slug, level: c.level, skills: c.skills, pdf: pdfPath(c.slug, slug), preview: previewPath(slug) });

  const numeros = theme("numeros");
  NUMBERS.forEach((word, n) => {
    out.push({
      ...common(numeros, `numero-${n}`),
      label: `El número ${n}`,
      title: `El número ${n} (${word}): escribir y colorear`,
      description: `Ficha gratis del número ${n}: el número para repasar en cuadrícula, ${n === 0 ? "nada que colorear (¡cero!)" : `${n} ${n === 1 ? "globo" : "globos"} para colorear`} y la palabra «${word}» para escribir en cursiva.`,
      consigna: n === 0 ? "Repasa el número 0. Cero es nada: ¡no colorees ningún globo!" : `Repasa el número ${n} en la cuadrícula y colorea ${n} ${n === 1 ? "globo" : "globos"}.`,
    });
  });
  const figuras = theme("figuras");
  for (const s of SHAPES) {
    out.push({
      ...common(figuras, `figura-${s.slug}`),
      label: cap(s.withArticle),
      title: `${cap(s.withArticle)}: figura para repasar`,
      description: `Ficha gratis: repasar ${s.withArticle} siguiendo los puntos, en grande y en pequeño, y escribir la palabra «${s.name}».`,
      consigna: `Repasa ${s.withArticle} siguiendo los puntos y después dibuja uno solo.`,
    });
  }
  const colores = theme("colores");
  for (const c of COLOURS) {
    out.push({
      ...common(colores, `color-${c.slug}`),
      label: cap(colourLabel(c)),
      title: `El color ${colourLabel(c)}: colorea ${c.thing.withArticle}`,
      description: `Ficha gratis del color ${colourLabel(c)}: colorear ${c.thing.withArticle} de color ${colourLabel(c)} y escribir la palabra «${c.name}».`,
      consigna: `Colorea ${c.thing.withArticle} de color ${colourLabel(c)} y después escribe la palabra ${c.name}.`,
    });
  }
  const frecuentes = theme("palabras-frecuentes");
  FREQUENT_WORD_GROUPS.forEach((g, i) => {
    const list = g.words.join(", ");
    out.push({
      ...common(frecuentes, `palabras-frecuentes-${i + 1}`),
      label: `Palabras frecuentes ${i + 1}`,
      title: `Palabras frecuentes ${i + 1}: ${list}`,
      description: `Ficha gratis de palabras frecuentes: leer, repasar y escribir ${list}, y encontrarlas en una oración.`,
      consigna: "Lee cada palabra, repásala en cursiva y escríbela sola. Encierra estas palabras en la oración.",
    });
  });
  for (const s of SYLLABLE_SHEETS) {
    const c = theme(s.blend ? "silabas-trabadas" : "silabas");
    const row = s.syllables.join(", ");
    out.push({
      ...common(c, s.slug),
      syllables: s.slug,
      label: s.blend ? `Sílabas con ${s.label}` : `Sílabas: ${s.label}`,
      title: `Leer las sílabas ${row}`,
      description: `Ficha de lectura: las sílabas ${row}, palabras con dibujo partidas en sílabas y sílabas para escribir en cursiva.`,
      consigna: "Lee las sílabas y después las palabras, sílaba por sílaba. Escribe las sílabas en cursiva.",
    });
  }
  return out;
}

export const fichas: Ficha[] = buildFichas();

function buildPacks(): FichaPack[] {
  const packPdf = (slug: string) => `${FICHAS_PDF_DIR}/paquetes/${slug}.pdf`;
  const inCategory = (c: string) => fichas.filter((f) => f.category === c).map((f) => f.slug);
  const packs: FichaPack[] = [
    {
      slug: "paquete-abecedario-completo",
      title: "El paquete del abecedario completo",
      description: "Todas las fichas de las letras de la A a la Z, con la Ñ: trazo, cursiva, reconocer, primera sílaba, colorear y palabras, en un solo PDF.",
      fichas: fichas.filter((f) => f.letter).map((f) => f.slug),
      pdf: packPdf("paquete-abecedario-completo"),
    },
  ];
  for (const c of FICHA_CATEGORIES) {
    packs.push({
      slug: `paquete-${c.slug}`,
      title: `Paquete: ${c.name.charAt(0).toLowerCase()}${c.name.slice(1)}`,
      description: `${c.description} Todas las fichas en un solo PDF.`,
      fichas: inCategory(c.slug),
      pdf: packPdf(`paquete-${c.slug}`),
    });
  }
  for (const l of spanishLetters) {
    packs.push({
      slug: `paquete-letra-${l.slug}`,
      title: `Paquete de la letra ${l.upper}`,
      description: `Todas las fichas de la letra ${l.upper} ${l.lower} en un solo PDF: trazo, cursiva, reconocer${FIRST_SYLLABLE_WORDS[l.slug] ? ", primera sílaba" : ""}, colorear y palabras.`,
      fichas: fichas.filter((f) => f.letter === l.slug).map((f) => f.slug),
      pdf: packPdf(`paquete-letra-${l.slug}`),
    });
  }
  return packs;
}

export const fichaPacks: FichaPack[] = buildPacks();

export function getFichaCategory(slug: string): FichaCategory | undefined {
  return FICHA_CATEGORIES.find((c) => c.slug === slug);
}

export function getFicha(slug: string): Ficha | undefined {
  return fichas.find((f) => f.slug === slug);
}

export function getFichaPack(slug: string): FichaPack | undefined {
  return fichaPacks.find((p) => p.slug === slug);
}

export function fichasInCategory(category: string): Ficha[] {
  return fichas.filter((f) => f.category === category);
}

export function fichasForLetter(letter: string): Ficha[] {
  return fichas.filter((f) => f.letter === letter);
}

export function getSyllableSheet(slug: string): SyllableSheet | undefined {
  return SYLLABLE_SHEETS.find((s) => s.slug === slug);
}

/** The syllable worksheets linked from a syllable page (/es/silabas/[skill]). */
export function fichasForSyllablePage(page: string): Ficha[] {
  const slugs = new Set(SYLLABLE_SHEETS.filter((s) => s.pages.includes(page)).map((s) => s.slug));
  return fichas.filter((f) => f.syllables && slugs.has(f.syllables));
}

/** Previous and next worksheet in the same category (no wrap-around). */
export function fichaNeighbors(slug: string): { prev?: Ficha; next?: Ficha } {
  const f = getFicha(slug)!;
  const list = fichasInCategory(f.category);
  const i = list.findIndex((x) => x.slug === slug);
  return { prev: list[i - 1], next: list[i + 1] };
}

/** Every Spanish /fichas/[category] param: categories and worksheets. */
export function fichaCategoryParams(): string[] {
  return [...FICHA_CATEGORIES.map((c) => c.slug), ...fichas.map((f) => f.slug)];
}
