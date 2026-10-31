// Printable flash cards (scripts/sheets/flash-cards-layout.ts): sets of 9 cm
// square cards, four to a page with dashed cut lines, each a picture and its
// word in the sheet's language. Pictures are the cartoons of public/words/,
// or drawn in code (feelings faces). Each set also exists without words, for
// guessing games. French, Spanish and Portuguese words carry their article,
// so children learn the gender with the word.
import { slugify, type L10n, type Sheet, type SheetKind } from "@/lib/sheets/types";

export type Feeling = "happy" | "sad" | "angry" | "scared" | "surprised" | "disgusted" | "tired" | "calm";

export type Card = { type: "picture"; picture: string; word: L10n } | { type: "feeling"; feeling: Feeling; word: L10n };

export type FlashCardsParams = { theme: string; words: boolean; cards: Card[] };
export type FlashCardsSheet = Sheet<FlashCardsParams>;

export const CARDS_PER_PAGE = 4;

const p = (picture: string, en: string, fr: string, es: string, pt: string): Card => ({ type: "picture", picture, word: { en, fr, es, pt } });
const f = (feeling: Feeling, en: string, fr: string, es: string, pt: string): Card => ({ type: "feeling", feeling, word: { en, fr, es, pt } });

type Theme = { id: string; name: L10n; cards: Card[] };

const THEMES: Theme[] = [
  {
    id: "farm-animals",
    name: { en: "Farm Animals", fr: "les animaux de la ferme", es: "animales de la granja", pt: "animais da fazenda" },
    cards: [
      p("cow", "cow", "la vache", "la vaca", "a vaca"),
      p("pig", "pig", "le cochon", "el cerdo", "o porco"),
      p("sheep", "sheep", "le mouton", "la oveja", "a ovelha"),
      p("goat", "goat", "la chèvre", "la cabra", "a cabra"),
      p("horse", "horse", "le cheval", "el caballo", "o cavalo"),
      p("hen", "hen", "la poule", "la gallina", "a galinha"),
      p("rooster", "rooster", "le coq", "el gallo", "o galo"),
      p("duck", "duck", "le canard", "el pato", "o pato"),
      p("donkey", "donkey", "l'âne", "el burro", "o burro"),
      p("chick", "chick", "le poussin", "el pollito", "o pintinho"),
      p("rabbit", "rabbit", "le lapin", "el conejo", "o coelho"),
      p("ox", "ox", "le bœuf", "el buey", "o boi"),
    ],
  },
  {
    id: "feelings",
    name: { en: "Feelings", fr: "les émotions", es: "las emociones", pt: "as emoções" },
    // English names the face; the other languages use nouns, which don't
    // change with the child's gender ("content/contente").
    cards: [
      f("happy", "happy", "la joie", "la alegría", "a alegria"),
      f("sad", "sad", "la tristesse", "la tristeza", "a tristeza"),
      f("angry", "angry", "la colère", "el enojo", "a raiva"),
      f("scared", "scared", "la peur", "el miedo", "o medo"),
      f("surprised", "surprised", "la surprise", "la sorpresa", "a surpresa"),
      f("disgusted", "disgusted", "le dégoût", "el asco", "o nojo"),
      f("tired", "tired", "la fatigue", "el cansancio", "o cansaço"),
      f("calm", "calm", "le calme", "la calma", "a calma"),
    ],
  },
];

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

function sheet(t: Theme, words: boolean): FlashCardsSheet {
  const pages = Math.ceil(t.cards.length / CARDS_PER_PAGE);
  const n = t.cards.length;
  const bare = (l: keyof L10n) => slugify(t.name[l].replace(/^(les|las|as) /, ""));
  return {
    kind: "flash-cards",
    id: `cards-${t.id}${words ? "" : "-no-words"}`,
    slug: words
      ? { en: `${slugify(t.name.en)}-flash-cards`, fr: `cartes-${bare("fr")}`, es: `tarjetas-${bare("es")}`, pt: `cartoes-${bare("pt")}` }
      : { en: `${slugify(t.name.en)}-picture-cards-no-words`, fr: `cartes-${bare("fr")}-sans-mots`, es: `tarjetas-${bare("es")}-sin-palabras`, pt: `cartoes-${bare("pt")}-sem-palavras` },
    title: words
      ? { en: `${t.name.en} Flash Cards`, fr: `Cartes images : ${t.name.fr}`, es: `Tarjetas ilustradas: ${t.name.es}`, pt: `Cartões ilustrados: ${t.name.pt}` }
      : {
          en: `${t.name.en} Picture Cards Without Words`,
          fr: `Cartes images sans mots : ${t.name.fr}`,
          es: `Tarjetas sin palabras: ${t.name.es}`,
          pt: `Cartões sem palavras: ${t.name.pt}`,
        },
    label: words
      ? { en: t.name.en, fr: cap(t.name.fr), es: cap(t.name.es), pt: cap(t.name.pt) }
      : { en: `${t.name.en} (no words)`, fr: `${cap(t.name.fr)} (sans mots)`, es: `${cap(t.name.es)} (sin palabras)`, pt: `${cap(t.name.pt)} (sem palavras)` },
    description: words
      ? {
          en: `Free printable flash cards: ${n} big ${t.name.en.toLowerCase()} cards with the picture and the word, 4 to a page, ready to cut out (${pages} pages).`,
          fr: `Cartes images gratuites à imprimer : ${n} grandes cartes (${t.name.fr}) avec l'image et le mot, 4 par page, à découper (${pages} pages).`,
          es: `Tarjetas ilustradas gratis para imprimir: ${n} tarjetas grandes (${t.name.es}) con el dibujo y la palabra, 4 por página, para recortar (${pages} páginas).`,
          pt: `Cartões ilustrados grátis para imprimir: ${n} cartões grandes (${t.name.pt}) com a figura e a palavra, 4 por página, para recortar (${pages} páginas).`,
        }
      : {
          en: `Free printable picture cards without words: ${n} big ${t.name.en.toLowerCase()} cards for guessing and naming games, 4 to a page (${pages} pages).`,
          fr: `Cartes images sans mots, gratuites : ${n} grandes cartes (${t.name.fr}) pour des jeux de devinettes, 4 par page (${pages} pages).`,
          es: `Tarjetas sin palabras gratis: ${n} tarjetas grandes (${t.name.es}) para juegos de adivinar, 4 por página (${pages} páginas).`,
          pt: `Cartões sem palavras grátis: ${n} cartões grandes (${t.name.pt}) para jogos de adivinhação, 4 por página (${pages} páginas).`,
        },
    instruction: words
      ? {
          en: "Cut out the cards along the dashed lines. Say the word on each card.",
          fr: "Découpe les cartes en suivant les pointillés. Dis le mot de chaque carte.",
          es: "Recorta las tarjetas por las líneas punteadas. Di la palabra de cada tarjeta.",
          pt: "Recorte os cartões nas linhas tracejadas. Diga a palavra de cada cartão.",
        }
      : {
          en: "Cut out the cards along the dashed lines. Pick a card: can you name the picture?",
          fr: "Découpe les cartes en suivant les pointillés. Tire une carte : sais-tu nommer l'image ?",
          es: "Recorta las tarjetas por las líneas punteadas. Saca una tarjeta: ¿sabes cómo se llama?",
          pt: "Recorte os cartões nas linhas tracejadas. Tire um cartão: você sabe o nome da figura?",
        },
    filters: { words: words ? "yes" : "no" },
    params: { theme: t.id, words, cards: t.cards },
  };
}

export const flashCardsSheets: FlashCardsSheet[] = THEMES.flatMap((t) => [sheet(t, true), sheet(t, false)]);

export const flashCardsKind: SheetKind = {
  id: "flash-cards",
  slug: { en: "flash-cards", fr: "cartes-images", es: "tarjetas-ilustradas", pt: "cartoes-ilustrados" },
  name: { en: "Flash Cards", fr: "Cartes images", es: "Tarjetas ilustradas", pt: "Cartões ilustrados" },
  heading: {
    en: "Printable Flash Cards for Kids",
    fr: "Cartes images à imprimer",
    es: "Tarjetas ilustradas para imprimir",
    pt: "Cartões ilustrados para imprimir",
  },
  metaTitle: {
    en: "Printable Flash Cards for Kids: Animals, Food, Feelings | Free PDFs",
    fr: "Cartes images à imprimer : animaux, aliments, émotions",
    es: "Tarjetas ilustradas para imprimir: animales, comida, emociones",
    pt: "Cartões ilustrados para imprimir: animais, comida, emoções",
  },
  description: {
    en: "Free printable flash cards: big picture cards with the word, 4 to a page with cut lines, by theme, plus sets without words for guessing games.",
    fr: "Cartes images gratuites à imprimer : de grandes cartes avec l'image et le mot, 4 par page, par thème, et des séries sans mots pour jouer aux devinettes.",
    es: "Tarjetas ilustradas gratis para imprimir: tarjetas grandes con el dibujo y la palabra, 4 por página, por tema, y series sin palabras para adivinar.",
    pt: "Cartões ilustrados grátis para imprimir: cartões grandes com a figura e a palavra, 4 por página, por tema, e séries sem palavras para adivinhação.",
  },
  intro: {
    en: "Each card is 9 cm square, big enough to hold up in front of a group. Print on card stock if you can, cut along the dashed lines, and use them for naming, sorting, memory and guessing games.",
    fr: "Chaque carte mesure 9 cm de côté, assez grande pour la montrer à un groupe. Imprimez sur du papier épais si possible, découpez en suivant les pointillés, et jouez à nommer, trier, faire des paires ou deviner.",
    es: "Cada tarjeta mide 9 cm por lado, lo bastante grande para mostrarla a un grupo. Imprima en cartulina si puede, recorte por las líneas punteadas y úselas para nombrar, clasificar, jugar memoria o adivinar.",
    pt: "Cada cartão tem 9 cm de lado, grande o bastante para mostrar a um grupo. Imprima em papel mais grosso se puder, recorte nas linhas tracejadas e use para nomear, classificar, jogar memória ou adivinhar.",
  },
  howTo: {
    en: "Show a card and say the word together, then let your child find the card you name. With the cards without words, take turns describing a picture for the other to guess.",
    fr: "Montrez une carte et dites le mot ensemble, puis demandez à l'enfant de retrouver la carte que vous nommez. Avec les cartes sans mots, décrivez chacun votre tour une image que l'autre doit deviner.",
    es: "Muestre una tarjeta y digan juntos la palabra; luego pida al niño que encuentre la tarjeta que usted nombra. Con las tarjetas sin palabras, describan por turnos un dibujo para que el otro adivine.",
    pt: "Mostre um cartão e digam a palavra juntos; depois peça à criança para achar o cartão que você disser. Com os cartões sem palavras, descrevam uma figura por vez para o outro adivinhar.",
  },
  level: {
    en: "Toddlers to first grade (ages 2–7)",
    fr: "De la crèche au CP (2 à 7 ans)",
    es: "De 2 a 7 años",
    pt: "De 2 a 7 anos",
  },
  skills: {
    en: ["Vocabulary", "Speaking", "Memory"],
    fr: ["Vocabulaire", "Langage oral", "Mémoire"],
    es: ["Vocabulario", "Expresión oral", "Memoria"],
    pt: ["Vocabulário", "Expressão oral", "Memória"],
  },
  filters: [
    {
      key: "words",
      label: { en: "Words", fr: "Mots", es: "Palabras", pt: "Palavras" },
      options: [
        { value: "yes", label: { en: "With words", fr: "Avec les mots", es: "Con palabras", pt: "Com palavras" } },
        { value: "no", label: { en: "Without words", fr: "Sans mots", es: "Sin palabras", pt: "Sem palavras" } },
      ],
    },
  ],
};
