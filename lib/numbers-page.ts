// The /numbers page (app/[locale]/numbers): the numbers 0 to 20 as cards, each
// leading to that number's own worksheet where one exists, and the other
// number activities. Every link is checked by tests/site-nav.test.ts.
import type { Locale } from "@/i18n/routing";
import { SHEET_KINDS } from "@/lib/sheets/catalog";
import { NUMBER_FLASH_CARDS, NUMBER_STICKERS, NUMBER_TRACING, sheetPath } from "@/lib/site-nav";

export const NUMBERS = Array.from({ length: 21 }, (_, n) => n);

const WORDS: Record<Locale, string[]> = {
  en: ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen", "twenty"],
  fr: ["zéro", "un", "deux", "trois", "quatre", "cinq", "six", "sept", "huit", "neuf", "dix", "onze", "douze", "treize", "quatorze", "quinze", "seize", "dix-sept", "dix-huit", "dix-neuf", "vingt"],
  es: ["cero", "uno", "dos", "tres", "cuatro", "cinco", "seis", "siete", "ocho", "nueve", "diez", "once", "doce", "trece", "catorce", "quince", "dieciséis", "diecisiete", "dieciocho", "diecinueve", "veinte"],
  pt: ["zero", "um", "dois", "três", "quatro", "cinco", "seis", "sete", "oito", "nove", "dez", "onze", "doze", "treze", "quatorze", "quinze", "dezesseis", "dezessete", "dezoito", "dezenove", "vinte"],
};

// The highest number with its own worksheet page: English has tracing sheets
// for 0 to 9, French "nombre-0" to "nombre-10", Spanish and Portuguese 0 to 20.
const OWN_SHEET_UP_TO: Record<Locale, number> = { en: 9, fr: 10, es: 20, pt: 20 };
const OWN_SHEET: Record<Locale, (n: number) => string> = {
  en: (n) => `number-${n}-tracing`,
  fr: (n) => `nombre-${n}`,
  es: (n) => `numero-${n}`,
  pt: (n) => `numero-${n}`,
};

type Copy = {
  title: string;
  description: string;
  home: string;
  crumb: string;
  h1: string;
  intro: string;
  cardsHeading: string;
  /** Under each card: what the link opens. */
  target: { own: string; cards: string; stickers: string };
  moreHeading: string;
  activities: { key: "tracing" | "cursive" | "missing" | "dots" | "stickers" | "cards"; name: string; text: string }[];
  tipsHeading: string;
  tips: string[];
};

const COPY: Record<Locale, Copy> = {
  en: {
    title: "Numbers 0 to 20 for Kids: Free Printable Worksheets",
    description:
      "Learn the numbers 0 to 20 with free printables: number tracing sheets, missing numbers, dot to dot, number stickers and flash cards for children aged 3 to 7.",
    home: "Home",
    crumb: "Numbers",
    h1: "Numbers 0 to 20",
    intro:
      "Pick a number to trace, say and count. Each card opens a free printable for that number, and the activities below practise counting and number order once your child knows the first ten.",
    cardsHeading: "Choose a number",
    target: { own: "Tracing sheet", cards: "Flash cards", stickers: "Stickers" },
    moreHeading: "More number activities",
    activities: [
      { key: "tracing", name: "Number tracing", text: "One sheet per number from 0 to 9: count the pictures, show it on your fingers, then trace and write it." },
      { key: "cursive", name: "Cursive numbers", text: "The same numbers in a joined, handwriting style." },
      { key: "missing", name: "Missing numbers", text: "Fill the gaps in number lines, trains and grids, from 1–10 up to 100." },
      { key: "dots", name: "Dot to dot", text: "Join the dots in order to reveal a picture: 1–10, 1–20 and 1–50." },
      { key: "stickers", name: "Number stickers", text: "Print-and-stick numbers from 0 to 20 for matching and counting games." },
      { key: "cards", name: "Number flash cards", text: "Cut-out cards for 0 to 20, each with the number word and ten-frames of dots to count." },
    ],
    tipsHeading: "Tips for parents",
    tips: [
      "Start with 0 to 5 and add a new number only when the last one feels easy.",
      "Count real things together (steps, spoons, toy cars) before writing the number.",
      "Short and often works best: one sheet a day beats five in a row.",
    ],
  },
  fr: {
    title: "Les nombres de 0 à 20 : fiches à imprimer pour enfants",
    description:
      "Apprendre les nombres de 0 à 20 avec des fiches gratuites : écrire les chiffres, compter, nombres manquants, points à relier et gommettes, de la maternelle au CP.",
    home: "Accueil",
    crumb: "Nombres",
    h1: "Les nombres de 0 à 20",
    intro:
      "Choisissez un nombre à repasser, à dire et à compter. Chaque carte ouvre une fiche gratuite, et les activités plus bas font travailler la suite des nombres une fois les dix premiers connus.",
    cardsHeading: "Choisir un nombre",
    target: { own: "Fiche du nombre", cards: "Cartes", stickers: "Gommettes" },
    moreHeading: "D'autres activités sur les nombres",
    activities: [
      { key: "tracing", name: "Écrire les chiffres", text: "Une fiche par nombre de 0 à 10 : repasser le chiffre, compter les dessins, le montrer avec ses doigts." },
      { key: "missing", name: "Nombres manquants", text: "Compléter les trains, les chemins et les grilles, de 1 à 10 jusqu'à 100." },
      { key: "dots", name: "Points à relier", text: "Relier les points dans l'ordre pour faire apparaître un dessin : jusqu'à 10, 20 ou 50." },
      { key: "stickers", name: "Gommettes des nombres", text: "Des gommettes de 0 à 20 à imprimer, pour associer et compter." },
    ],
    tipsHeading: "Conseils aux parents",
    tips: [
      "Commencez par 0 à 5 et n'ajoutez un nombre que lorsque le précédent est bien acquis.",
      "Comptez de vrais objets ensemble (marches, cuillères, petites voitures) avant d'écrire le chiffre.",
      "Mieux vaut peu et souvent : une fiche par jour plutôt que cinq d'affilée.",
    ],
  },
  es: {
    title: "Los números del 0 al 20 para niños: fichas para imprimir",
    description:
      "Aprende los números del 0 al 20 con fichas gratis: repasar y contar, números faltantes, une los puntos, stickers y tarjetas de números para niños de 3 a 7 años.",
    home: "Inicio",
    crumb: "Números",
    h1: "Los números del 0 al 20",
    intro:
      "Elige un número para repasarlo, decirlo y contarlo. Cada tarjeta abre una ficha gratis de ese número, y las actividades de abajo practican el orden de los números cuando ya conoce los primeros diez.",
    cardsHeading: "Elige un número",
    target: { own: "Ficha del número", cards: "Tarjetas", stickers: "Stickers" },
    moreHeading: "Más actividades con números",
    activities: [
      { key: "tracing", name: "Repasar los números", text: "Una ficha por número del 0 al 20: repasar, contar los dibujos y mostrarlo con los dedos." },
      { key: "missing", name: "Números faltantes", text: "Completar trenes, caminos y cuadrículas, del 1 al 10 hasta el 100." },
      { key: "dots", name: "Une los puntos", text: "Unir los puntos en orden para descubrir el dibujo: hasta 10, 20 o 50." },
      { key: "stickers", name: "Stickers de números", text: "Stickers del 0 al 20 para imprimir, emparejar y contar." },
      { key: "cards", name: "Tarjetas de números", text: "Tarjetas del 0 al 20 para recortar, con el nombre del número y puntos en cuadros de diez para contar." },
    ],
    tipsHeading: "Consejos para las familias",
    tips: [
      "Empiecen por el 0 al 5 y sumen un número nuevo solo cuando el anterior ya sea fácil.",
      "Cuenten cosas de verdad (escalones, cucharas, carritos) antes de escribir el número.",
      "Poco y seguido funciona mejor: una ficha al día rinde más que cinco seguidas.",
    ],
  },
  pt: {
    title: "Os números de 0 a 20 para crianças: atividades para imprimir",
    description:
      "Aprenda os números de 0 a 20 com atividades grátis: cobrir e contar, números que faltam, ligue os pontos e adesivos de números para crianças de 3 a 7 anos.",
    home: "Início",
    crumb: "Números",
    h1: "Os números de 0 a 20",
    intro:
      "Escolha um número para cobrir, falar e contar. Cada cartão abre uma atividade grátis daquele número, e as brincadeiras abaixo treinam a ordem dos números quando a criança já conhece os dez primeiros.",
    cardsHeading: "Escolha um número",
    target: { own: "Atividade do número", cards: "Cartões", stickers: "Adesivos" },
    moreHeading: "Mais atividades com números",
    activities: [
      { key: "tracing", name: "Cobrir os números", text: "Uma atividade por número de 0 a 20: cobrir, contar os desenhos e mostrar com os dedos." },
      { key: "missing", name: "Números que faltam", text: "Completar trenzinhos, caminhos e tabelas, de 1 a 10 até 100." },
      { key: "dots", name: "Ligue os pontos", text: "Ligar os pontos em ordem para descobrir o desenho: até 10, 20 ou 50." },
      { key: "stickers", name: "Adesivos de números", text: "Adesivos de 0 a 20 para imprimir, combinar e contar." },
    ],
    tipsHeading: "Dicas para a família",
    tips: [
      "Comecem pelo 0 a 5 e acrescentem um número novo só quando o anterior estiver fácil.",
      "Contem coisas de verdade (degraus, colheres, carrinhos) antes de escrever o número.",
      "Pouco e sempre funciona melhor: uma atividade por dia rende mais que cinco seguidas.",
    ],
  },
};

export function numbersCopy(locale: Locale): Copy {
  return COPY[locale];
}

export type NumberCard = { n: number; word: string; href: string; target: string };

/** The 21 cards: a number's own sheet, or else the flash cards (English) or stickers (French) that show it. */
export function numberCards(locale: Locale): NumberCard[] {
  const { target } = COPY[locale];
  return NUMBERS.map((n) => {
    if (n <= OWN_SHEET_UP_TO[locale]) return { n, word: WORDS[locale][n], href: sheetPath(locale, OWN_SHEET[locale](n)), target: target.own };
    const cards = NUMBER_FLASH_CARDS[locale];
    if (cards) return { n, word: WORDS[locale][n], href: sheetPath(locale, cards[n <= 10 ? 0 : 1]), target: `${target.cards} ${n <= 10 ? "0–10" : "11–20"}` };
    return { n, word: WORDS[locale][n], href: sheetPath(locale, NUMBER_STICKERS[locale][1]), target: `${target.stickers} 11–20` };
  });
}

const kindSlug = (en: string, locale: Locale) => SHEET_KINDS.find((k) => k.slug.en === en)!.slug[locale];

/** The "More number activities" cards; a language shows only the ones it has (Copy.activities). */
export function activityLinks(locale: Locale): (Copy["activities"][number] & { href: string })[] {
  const hrefs: Record<Copy["activities"][number]["key"], () => string> = {
    tracing: () => sheetPath(locale, NUMBER_TRACING[locale]),
    cursive: () => sheetPath(locale, "numbers-cursive"),
    missing: () => sheetPath(locale, kindSlug("missing-numbers", locale)),
    dots: () => sheetPath(locale, kindSlug("dot-to-dot", locale)),
    stickers: () => sheetPath(locale, NUMBER_STICKERS[locale][0]),
    cards: () => sheetPath(locale, NUMBER_FLASH_CARDS[locale]![0]),
  };
  return COPY[locale].activities.map((a) => ({ ...a, href: hrefs[a.key]() }));
}
