// Printable flash cards (scripts/sheets/flash-cards-layout.ts): sets of 9 cm
// square cards, four to a page with dashed cut lines, each a picture and its
// word in the sheet's language. Pictures are the cartoons of public/words/,
// or drawn in code (feelings faces, colours, shapes, numbers). Some sets also
// exist without words, for guessing games. French, Spanish and Portuguese
// nouns carry their article, so children learn the gender with the word.
import { frenchLetters } from "@/lib/letters-fr";
import { spanishLetters } from "@/lib/letters-es";
import { portugueseLetters } from "@/lib/letters-pt";
import { slugify, type L10n, type Sheet, type SheetKind } from "@/lib/sheets/types";
import { SHAPE_NAMES, type ShapeId } from "./vocab";

export type Feeling = "happy" | "sad" | "angry" | "scared" | "surprised" | "disgusted" | "tired" | "calm";
export type Solid = "cube" | "sphere" | "cylinder" | "cone" | "pyramid" | "cuboid" | "prism";
export type Paint = "red" | "blue" | "yellow" | "green" | "orange" | "purple" | "pink" | "brown" | "black" | "white" | "grey";

export type Card =
  | { type: "picture"; picture: string; word: L10n }
  | { type: "feeling"; feeling: Feeling; word: L10n }
  | { type: "solid"; solid: Solid; word: L10n }
  | { type: "shape"; shape: ShapeId; word: L10n }
  | { type: "colour"; paint: Paint; word: L10n }
  | { type: "number"; n: number; word: L10n }
  /** A letter, with a word that holds it and its cartoon, in each language (none for a few letters). */
  | { type: "letter"; upper: string; lower: string; word: L10n<string | null>; picture: L10n<string | null> };

export type FlashCardsGroup = "letters-numbers" | "colours-shapes" | "animals" | "food" | "everyday" | "nature";
export type FlashCardsParams = { theme: string; words: boolean; cards: Card[] };
export type FlashCardsSheet = Sheet<FlashCardsParams>;

export const CARDS_PER_PAGE = 4;

const p = (picture: string, en: string, fr: string, es: string, pt: string): Card => ({ type: "picture", picture, word: { en, fr, es, pt } });
const f = (feeling: Feeling, en: string, fr: string, es: string, pt: string): Card => ({ type: "feeling", feeling, word: { en, fr, es, pt } });
const s3 = (solid: Solid, en: string, fr: string, es: string, pt: string): Card => ({ type: "solid", solid, word: { en, fr, es, pt } });
const sh = (shape: ShapeId, fr: string, es: string, pt: string): Card => ({ type: "shape", shape, word: { en: SHAPE_NAMES[shape].en, fr, es, pt } });
const c = (paint: Paint, en: string, fr: string, es: string, pt: string): Card => ({ type: "colour", paint, word: { en, fr, es, pt } });

// ------------------------------------------------------------------ alphabet

// The same English words as the alphabet sticker sheets (data/worksheets/stickers.ts).
const ENGLISH_ALPHABET: Record<string, string> = {
  a: "apple", b: "bear", c: "cat", d: "dog", e: "elephant", f: "fish", g: "giraffe", h: "horse", i: "igloo",
  j: "jellyfish", k: "kite", l: "lion", m: "moon", n: "nest", o: "owl", p: "pig", q: "quail", r: "rabbit",
  s: "sun", t: "tiger", u: "umbrella", v: "violin", w: "whale", x: "xylophone", y: "yak", z: "zebra",
};

type LetterWords = { slug: string; words: { word: string; picture: string }[] }[];

/** The first word of the letter that has a cartoon ("number-4" is a drawn digit, not a cartoon). */
function letterWord(letters: LetterWords, letter: string): { word: string | null; picture: string | null } {
  const w = letters.find((l) => l.slug === letter)?.words.find((x) => x.picture && !x.picture.startsWith("number-"));
  return w ? { word: w.word.replace(/\|/g, "").toLowerCase(), picture: w.picture } : { word: null, picture: null };
}

function alphabet(from: string, to: string): Card[] {
  const out: Card[] = [];
  for (let k = from.charCodeAt(0); k <= to.charCodeAt(0); k++) {
    const lower = String.fromCharCode(k);
    const fr = letterWord(frenchLetters, lower);
    const es = letterWord(spanishLetters, lower);
    const pt = letterWord(portugueseLetters, lower);
    out.push({
      type: "letter",
      upper: lower.toUpperCase(),
      lower,
      word: { en: ENGLISH_ALPHABET[lower], fr: fr.word, es: es.word, pt: pt.word },
      picture: { en: ENGLISH_ALPHABET[lower], fr: fr.picture, es: es.picture, pt: pt.picture },
    });
  }
  return out;
}

// ------------------------------------------------------------------ numbers

const NUMBER_WORDS: L10n<string[]> = {
  en: ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen", "twenty"],
  fr: ["zéro", "un", "deux", "trois", "quatre", "cinq", "six", "sept", "huit", "neuf", "dix", "onze", "douze", "treize", "quatorze", "quinze", "seize", "dix-sept", "dix-huit", "dix-neuf", "vingt"],
  es: ["cero", "uno", "dos", "tres", "cuatro", "cinco", "seis", "siete", "ocho", "nueve", "diez", "once", "doce", "trece", "catorce", "quince", "dieciséis", "diecisiete", "dieciocho", "diecinueve", "veinte"],
  pt: ["zero", "um", "dois", "três", "quatro", "cinco", "seis", "sete", "oito", "nove", "dez", "onze", "doze", "treze", "catorze", "quinze", "dezesseis", "dezessete", "dezoito", "dezenove", "vinte"],
};

const numbers = (from: number, to: number): Card[] =>
  Array.from({ length: to - from + 1 }, (_, i) => {
    const n = from + i;
    return { type: "number", n, word: { en: NUMBER_WORDS.en[n], fr: NUMBER_WORDS.fr[n], es: NUMBER_WORDS.es[n], pt: NUMBER_WORDS.pt[n] } };
  });

// ------------------------------------------------------------------ themes

type Theme = { id: string; group: FlashCardsGroup; name: L10n; cards: Card[]; withoutWords?: boolean };

// Colours and numbers are adjectives here: no article.
const THEMES: Theme[] = [
  { id: "alphabet-a-h", group: "letters-numbers", name: { en: "Alphabet A to H", fr: "l'alphabet de A à H", es: "el abecedario de la A a la H", pt: "o alfabeto de A a H" }, cards: alphabet("a", "h") },
  { id: "alphabet-i-p", group: "letters-numbers", name: { en: "Alphabet I to P", fr: "l'alphabet de I à P", es: "el abecedario de la I a la P", pt: "o alfabeto de I a P" }, cards: alphabet("i", "p") },
  { id: "alphabet-q-z", group: "letters-numbers", name: { en: "Alphabet Q to Z", fr: "l'alphabet de Q à Z", es: "el abecedario de la Q a la Z", pt: "o alfabeto de Q a Z" }, cards: alphabet("q", "z") },
  { id: "numbers-0-10", group: "letters-numbers", name: { en: "Numbers 0 to 10", fr: "les nombres de 0 à 10", es: "los números del 0 al 10", pt: "os números de 0 a 10" }, cards: numbers(0, 10) },
  { id: "numbers-11-20", group: "letters-numbers", name: { en: "Numbers 11 to 20", fr: "les nombres de 11 à 20", es: "los números del 11 al 20", pt: "os números de 11 a 20" }, cards: numbers(11, 20) },
  {
    id: "colours",
    group: "colours-shapes",
    name: { en: "Colors", fr: "les couleurs", es: "los colores", pt: "as cores" },
    // Spanish "morado" and "café", the most common words in Latin America.
    cards: [
      c("red", "red", "rouge", "rojo", "vermelho"),
      c("blue", "blue", "bleu", "azul", "azul"),
      c("yellow", "yellow", "jaune", "amarillo", "amarelo"),
      c("green", "green", "vert", "verde", "verde"),
      c("orange", "orange", "orange", "naranja", "laranja"),
      c("purple", "purple", "violet", "morado", "roxo"),
      c("pink", "pink", "rose", "rosa", "rosa"),
      c("brown", "brown", "marron", "café", "marrom"),
      c("black", "black", "noir", "negro", "preto"),
      c("white", "white", "blanc", "blanco", "branco"),
      c("grey", "gray", "gris", "gris", "cinza"),
    ],
  },
  {
    id: "shapes",
    group: "colours-shapes",
    name: { en: "Shapes", fr: "les formes", es: "las figuras", pt: "as formas" },
    cards: [
      sh("circle", "le rond", "el círculo", "o círculo"),
      sh("square", "le carré", "el cuadrado", "o quadrado"),
      sh("triangle", "le triangle", "el triángulo", "o triângulo"),
      sh("rectangle", "le rectangle", "el rectángulo", "o retângulo"),
      sh("oval", "l'ovale", "el óvalo", "o oval"),
      sh("diamond", "le losange", "el rombo", "o losango"),
      sh("star", "l'étoile", "la estrella", "a estrela"),
      sh("heart", "le cœur", "el corazón", "o coração"),
      sh("pentagon", "le pentagone", "el pentágono", "o pentágono"),
      sh("hexagon", "l'hexagone", "el hexágono", "o hexágono"),
      sh("crescent", "le croissant", "la media luna", "a meia-lua"),
      sh("arrow", "la flèche", "la flecha", "a seta"),
    ],
  },
  {
    id: "3d-shapes",
    group: "colours-shapes",
    name: { en: "3D Shapes", fr: "les solides", es: "los cuerpos geométricos", pt: "os sólidos geométricos" },
    cards: [
      s3("cube", "cube", "le cube", "el cubo", "o cubo"),
      s3("sphere", "sphere", "la boule", "la esfera", "a esfera"),
      s3("cylinder", "cylinder", "le cylindre", "el cilindro", "o cilindro"),
      s3("cone", "cone", "le cône", "el cono", "o cone"),
      s3("pyramid", "pyramid", "la pyramide", "la pirámide", "a pirâmide"),
      s3("cuboid", "rectangular prism", "le pavé", "el prisma rectangular", "o paralelepípedo"),
      s3("prism", "triangular prism", "le prisme", "el prisma triangular", "o prisma"),
    ],
  },
  {
    id: "farm-animals",
    group: "animals",
    withoutWords: true,
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
    id: "wild-animals",
    group: "animals",
    withoutWords: true,
    name: { en: "Wild Animals", fr: "les animaux sauvages", es: "animales salvajes", pt: "animais selvagens" },
    cards: [
      p("lion", "lion", "le lion", "el león", "o leão"),
      p("tiger", "tiger", "le tigre", "el tigre", "o tigre"),
      p("elephant", "elephant", "l'éléphant", "el elefante", "o elefante"),
      p("giraffe", "giraffe", "la girafe", "la jirafa", "a girafa"),
      p("zebra", "zebra", "le zèbre", "la cebra", "a zebra"),
      p("monkey", "monkey", "le singe", "el mono", "o macaco"),
      p("gorilla", "gorilla", "le gorille", "el gorila", "o gorila"),
      p("hippo", "hippo", "l'hippopotame", "el hipopótamo", "o hipopótamo"),
      p("crocodile", "crocodile", "le crocodile", "el cocodrilo", "o crocodilo"),
      p("kangaroo", "kangaroo", "le kangourou", "el canguro", "o canguru"),
      p("koala", "koala", "le koala", "el koala", "o coala"),
      p("jaguar", "jaguar", "le jaguar", "el jaguar", "a onça"),
    ],
  },
  {
    id: "sea-animals",
    group: "animals",
    withoutWords: true,
    name: { en: "Sea Animals", fr: "les animaux de la mer", es: "animales del mar", pt: "animais do mar" },
    cards: [
      p("fish", "fish", "le poisson", "el pez", "o peixe"),
      p("whale", "whale", "la baleine", "la ballena", "a baleia"),
      p("dolphin", "dolphin", "le dauphin", "el delfín", "o golfinho"),
      p("octopus", "octopus", "la pieuvre", "el pulpo", "o polvo"),
      p("crab", "crab", "le crabe", "el cangrejo", "o caranguejo"),
      p("jellyfish", "jellyfish", "la méduse", "la medusa", "a água-viva"),
      p("seal", "seal", "le phoque", "la foca", "a foca"),
      p("turtle", "turtle", "la tortue", "la tortuga", "a tartaruga"),
    ],
  },
  {
    id: "pets",
    group: "animals",
    name: { en: "Pets", fr: "les animaux de compagnie", es: "mascotas", pt: "animais de estimação" },
    cards: [
      p("cat", "cat", "le chat", "el gato", "o gato"),
      p("dog", "dog", "le chien", "el perro", "o cachorro"),
      p("rabbit", "rabbit", "le lapin", "el conejo", "o coelho"),
      p("mouse", "mouse", "la souris", "el ratón", "o ratinho"),
      p("parrot", "parrot", "le perroquet", "el loro", "o papagaio"),
      p("fish", "fish", "le poisson", "el pez", "o peixe"),
      p("turtle", "turtle", "la tortue", "la tortuga", "a tartaruga"),
      p("hedgehog", "hedgehog", "le hérisson", "el erizo", "o ouriço"),
    ],
  },
  {
    id: "birds",
    group: "animals",
    name: { en: "Birds", fr: "les oiseaux", es: "las aves", pt: "as aves" },
    cards: [
      p("bird", "bird", "l'oiseau", "el pájaro", "o passarinho"),
      p("owl", "owl", "la chouette", "el búho", "a coruja"),
      p("eagle", "eagle", "l'aigle", "el águila", "a águia"),
      p("parrot", "parrot", "le perroquet", "el loro", "o papagaio"),
      p("penguin", "penguin", "le pingouin", "el pingüino", "o pinguim"),
      p("flamingo", "flamingo", "le flamant rose", "el flamenco", "o flamingo"),
      p("swan", "swan", "le cygne", "el cisne", "o cisne"),
      p("duck", "duck", "le canard", "el pato", "o pato"),
      p("dove", "dove", "la colombe", "la paloma", "a pomba"),
      p("quail", "quail", "la caille", "la codorniz", "a codorna"),
      p("hen", "hen", "la poule", "la gallina", "a galinha"),
      p("rooster", "rooster", "le coq", "el gallo", "o galo"),
    ],
  },
  {
    id: "bugs",
    group: "animals",
    name: { en: "Bugs", fr: "les petites bêtes", es: "los bichos", pt: "os bichinhos" },
    cards: [
      p("bee", "bee", "l'abeille", "la abeja", "a abelha"),
      p("ant", "ant", "la fourmi", "la hormiga", "a formiga"),
      p("butterfly", "butterfly", "le papillon", "la mariposa", "a borboleta"),
      p("ladybug", "ladybug", "la coccinelle", "la catarina", "a joaninha"),
      p("spider", "spider", "l'araignée", "la araña", "a aranha"),
      p("snail", "snail", "l'escargot", "el caracol", "o caracol"),
      p("caterpillar", "caterpillar", "la chenille", "la oruga", "a lagarta"),
      p("fly", "fly", "la mouche", "la mosca", "a mosca"),
      p("mosquito", "mosquito", "le moustique", "el mosquito", "o mosquito"),
      p("cricket", "cricket", "le grillon", "el grillo", "o grilo"),
      p("worm", "worm", "le ver de terre", "la lombriz", "a minhoca"),
    ],
  },
  {
    id: "fruits",
    group: "food",
    withoutWords: true,
    name: { en: "Fruits", fr: "les fruits", es: "las frutas", pt: "as frutas" },
    cards: [
      p("apple", "apple", "la pomme", "la manzana", "a maçã"),
      p("banana", "banana", "la banane", "el plátano", "a banana"),
      p("cherry", "cherry", "la cerise", "la cereza", "a cereja"),
      p("grapes", "grapes", "le raisin", "las uvas", "a uva"),
      p("kiwi", "kiwi", "le kiwi", "el kiwi", "o kiwi"),
      p("lemon", "lemon", "le citron", "el limón", "o limão"),
      p("melon", "melon", "le melon", "el melón", "o melão"),
      p("orange", "orange", "l'orange", "la naranja", "a laranja"),
      p("pear", "pear", "la poire", "la pera", "a pera"),
      p("pineapple", "pineapple", "l'ananas", "la piña", "o abacaxi"),
      p("strawberry", "strawberry", "la fraise", "la fresa", "o morango"),
      p("watermelon", "watermelon", "la pastèque", "la sandía", "a melancia"),
    ],
  },
  {
    id: "vegetables",
    group: "food",
    withoutWords: true,
    name: { en: "Vegetables", fr: "les légumes", es: "las verduras", pt: "os legumes" },
    cards: [
      p("broccoli", "broccoli", "le brocoli", "el brócoli", "o brócolis"),
      p("carrot", "carrot", "la carotte", "la zanahoria", "a cenoura"),
      p("corn", "corn", "le maïs", "el maíz", "o milho"),
      p("cucumber", "cucumber", "le concombre", "el pepino", "o pepino"),
      p("garlic", "garlic", "l'ail", "el ajo", "o alho"),
      p("onion", "onion", "l'oignon", "la cebolla", "a cebola"),
      p("potato", "potato", "la pomme de terre", "la papa", "a batata"),
      p("pumpkin", "pumpkin", "la citrouille", "la calabaza", "a abóbora"),
      p("tomato", "tomato", "la tomate", "el tomate", "o tomate"),
      p("beans", "beans", "les haricots", "los frijoles", "o feijão"),
      p("mushroom", "mushroom", "le champignon", "el champiñón", "o cogumelo"),
      p("olive", "olive", "l'olive", "la aceituna", "a azeitona"),
    ],
  },
  {
    id: "food",
    group: "food",
    withoutWords: true,
    name: { en: "Food", fr: "les aliments", es: "la comida", pt: "a comida" },
    cards: [
      p("bread", "bread", "le pain", "el pan", "o pão"),
      p("cheese", "cheese", "le fromage", "el queso", "o queijo"),
      p("egg", "egg", "l'œuf", "el huevo", "o ovo"),
      p("rice", "rice", "le riz", "el arroz", "o arroz"),
      p("soup", "soup", "la soupe", "la sopa", "a sopa"),
      p("noodles", "noodles", "les nouilles", "los fideos", "o macarrão"),
      p("pizza", "pizza", "la pizza", "la pizza", "a pizza"),
      p("sandwich", "sandwich", "le sandwich", "el sándwich", "o sanduíche"),
      p("hamburger", "hamburger", "le hamburger", "la hamburguesa", "o hambúrguer"),
      p("hot-dog", "hot dog", "le hot-dog", "el hot dog", "o cachorro-quente"),
      p("yogurt", "yogurt", "le yaourt", "el yogur", "o iogurte"),
      p("honey", "honey", "le miel", "la miel", "o mel"),
      p("cake", "cake", "le gâteau", "el pastel", "o bolo"),
      p("cookie", "cookie", "le biscuit", "la galleta", "o biscoito"),
      p("ice-cream", "ice cream", "la glace", "el helado", "o sorvete"),
      p("popcorn", "popcorn", "le pop-corn", "las palomitas", "a pipoca"),
    ],
  },
  {
    id: "vehicles",
    group: "everyday",
    withoutWords: true,
    name: { en: "Vehicles", fr: "les véhicules", es: "los transportes", pt: "os meios de transporte" },
    cards: [
      p("car", "car", "la voiture", "el carro", "o carro"),
      p("bus", "bus", "le bus", "el autobús", "o ônibus"),
      p("bicycle", "bicycle", "le vélo", "la bicicleta", "a bicicleta"),
      p("motorbike", "motorcycle", "la moto", "la moto", "a moto"),
      p("train", "train", "le train", "el tren", "o trem"),
      p("airplane", "airplane", "l'avion", "el avión", "o avião"),
      p("helicopter", "helicopter", "l'hélicoptère", "el helicóptero", "o helicóptero"),
      p("rocket", "rocket", "la fusée", "el cohete", "o foguete"),
      p("ship", "ship", "le bateau", "el barco", "o navio"),
      p("sailboat", "sailboat", "le voilier", "el velero", "o veleiro"),
      p("tractor", "tractor", "le tracteur", "el tractor", "o trator"),
      p("ambulance", "ambulance", "l'ambulance", "la ambulancia", "a ambulância"),
    ],
  },
  {
    id: "weather",
    group: "nature",
    name: { en: "Weather", fr: "la météo", es: "el clima", pt: "o tempo" },
    cards: [
      p("sun", "sun", "le soleil", "el sol", "o sol"),
      p("cloud", "cloud", "le nuage", "la nube", "a nuvem"),
      p("rain", "rain", "la pluie", "la lluvia", "a chuva"),
      p("snowflake", "snow", "la neige", "la nieve", "a neve"),
      p("lightning", "lightning", "l'éclair", "el rayo", "o raio"),
      p("rainbow", "rainbow", "l'arc-en-ciel", "el arcoíris", "o arco-íris"),
      p("umbrella", "umbrella", "le parapluie", "el paraguas", "o guarda-chuva"),
    ],
  },
  {
    id: "feelings",
    group: "everyday",
    withoutWords: true,
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
  {
    id: "clothes",
    group: "everyday",
    name: { en: "Clothes", fr: "les vêtements", es: "la ropa", pt: "as roupas" },
    cards: [
      p("shirt", "T-shirt", "le tee-shirt", "la camiseta", "a camiseta"),
      p("blouse", "blouse", "le chemisier", "la blusa", "a blusa"),
      p("trousers", "pants", "le pantalon", "el pantalón", "a calça"),
      p("dress", "dress", "la robe", "el vestido", "o vestido"),
      p("jacket", "jacket", "le blouson", "la chaqueta", "a jaqueta"),
      p("sock", "sock", "la chaussette", "el calcetín", "a meia"),
      p("shoe", "shoe", "la chaussure", "el zapato", "o sapato"),
      p("sneaker", "sneaker", "la basket", "el tenis", "o tênis"),
      p("boot", "boot", "la botte", "la bota", "a bota"),
      p("flip-flop", "flip-flop", "la tong", "la chancla", "o chinelo"),
      p("hat", "hat", "le chapeau", "el sombrero", "o chapéu"),
      p("cap", "cap", "la casquette", "la gorra", "o boné"),
    ],
  },
  {
    id: "toys",
    group: "everyday",
    name: { en: "Toys", fr: "les jouets", es: "los juguetes", pt: "os brinquedos" },
    cards: [
      p("ball", "ball", "le ballon", "la pelota", "a bola"),
      p("doll", "doll", "la poupée", "la muñeca", "a boneca"),
      p("teddy-bear", "teddy bear", "le nounours", "el osito de peluche", "o ursinho"),
      p("kite", "kite", "le cerf-volant", "el papalote", "a pipa"),
      p("yo-yo", "yo-yo", "le yoyo", "el yoyó", "o ioiô"),
      p("dice", "dice", "le dé", "el dado", "o dado"),
      p("robot", "robot", "le robot", "el robot", "o robô"),
      p("drum", "drum", "le tambour", "el tambor", "o tambor"),
      p("gift", "present", "le cadeau", "el regalo", "o presente"),
      p("magic-wand", "magic wand", "la baguette magique", "la varita mágica", "a varinha mágica"),
    ],
  },
  {
    id: "school",
    group: "everyday",
    name: { en: "School Things", fr: "le matériel scolaire", es: "útiles escolares", pt: "o material escolar" },
    cards: [
      p("backpack", "backpack", "le cartable", "la mochila", "a mochila"),
      p("book", "book", "le livre", "el libro", "o livro"),
      p("pencil", "pencil", "le crayon", "el lápiz", "o lápis"),
      p("pen", "pen", "le stylo", "el bolígrafo", "a caneta"),
      p("ruler", "ruler", "la règle", "la regla", "a régua"),
      p("scissors", "scissors", "les ciseaux", "las tijeras", "a tesoura"),
      p("globe", "globe", "le globe", "el globo terráqueo", "o globo"),
      p("paint-palette", "paint palette", "la palette", "la paleta de colores", "a paleta"),
    ],
  },
  {
    id: "home",
    group: "everyday",
    name: { en: "Home and Kitchen", fr: "la maison et la cuisine", es: "la casa y la cocina", pt: "a casa e a cozinha" },
    cards: [
      p("bed", "bed", "le lit", "la cama", "a cama"),
      p("chair", "chair", "la chaise", "la silla", "a cadeira"),
      p("sofa", "couch", "le canapé", "el sofá", "o sofá"),
      p("lamp", "lamp", "la lampe", "la lámpara", "o abajur"),
      p("door", "door", "la porte", "la puerta", "a porta"),
      p("window", "window", "la fenêtre", "la ventana", "a janela"),
      p("bathtub", "bathtub", "la baignoire", "la bañera", "a banheira"),
      p("television", "TV", "la télévision", "la televisión", "a televisão"),
      p("cup", "cup", "la tasse", "la taza", "a xícara"),
      p("plate", "plate", "l'assiette", "el plato", "o prato"),
      p("spoon", "spoon", "la cuillère", "la cuchara", "a colher"),
      p("bowl", "bowl", "le bol", "el tazón", "a tigela"),
    ],
  },
  {
    id: "body",
    group: "everyday",
    name: { en: "My Body", fr: "le corps", es: "el cuerpo", pt: "o corpo" },
    cards: [
      p("eye", "eye", "l'œil", "el ojo", "o olho"),
      p("ear", "ear", "l'oreille", "la oreja", "a orelha"),
      p("nose", "nose", "le nez", "la nariz", "o nariz"),
      p("mouth", "mouth", "la bouche", "la boca", "a boca"),
      p("tooth", "tooth", "la dent", "el diente", "o dente"),
      p("hair", "hair", "les cheveux", "el pelo", "o cabelo"),
      p("arm", "arm", "le bras", "el brazo", "o braço"),
      p("hand", "hand", "la main", "la mano", "a mão"),
      p("finger", "finger", "le doigt", "el dedo", "o dedo"),
      p("foot", "foot", "le pied", "el pie", "o pé"),
    ],
  },
  {
    id: "nature",
    group: "nature",
    name: { en: "Nature", fr: "la nature", es: "la naturaleza", pt: "a natureza" },
    cards: [
      p("tree", "tree", "l'arbre", "el árbol", "a árvore"),
      p("flower", "flower", "la fleur", "la flor", "a flor"),
      p("leaf", "leaf", "la feuille", "la hoja", "a folha"),
      p("sunflower", "sunflower", "le tournesol", "el girasol", "o girassol"),
      p("cactus", "cactus", "le cactus", "el cactus", "o cacto"),
      p("nest", "nest", "le nid", "el nido", "o ninho"),
      p("rock", "rock", "le rocher", "la roca", "a pedra"),
      p("mountain", "mountain", "la montagne", "la montaña", "a montanha"),
      p("volcano", "volcano", "le volcan", "el volcán", "o vulcão"),
      p("lake", "pond", "la mare", "el estanque", "a lagoa"),
      p("island", "island", "l'île", "la isla", "a ilha"),
      p("wave", "wave", "la vague", "la ola", "a onda"),
    ],
  },
  {
    id: "music",
    group: "everyday",
    name: { en: "Music", fr: "la musique", es: "la música", pt: "a música" },
    cards: [
      p("drum", "drum", "le tambour", "el tambor", "o tambor"),
      p("guitar", "guitar", "la guitare", "la guitarra", "o violão"),
      p("piano", "piano", "le piano", "el piano", "o piano"),
      p("violin", "violin", "le violon", "el violín", "o violino"),
      p("flute", "flute", "la flûte", "la flauta", "a flauta"),
      p("trumpet", "trumpet", "la trompette", "la trompeta", "o trompete"),
      p("saxophone", "saxophone", "le saxophone", "el saxofón", "o saxofone"),
      p("xylophone", "xylophone", "le xylophone", "el xilófono", "o xilofone"),
      p("ukulele", "ukulele", "le ukulélé", "el ukulele", "o ukulele"),
      p("microphone", "microphone", "le micro", "el micrófono", "o microfone"),
      p("bell", "bell", "la cloche", "la campana", "o sino"),
      p("music-note", "music note", "la note de musique", "la nota musical", "a nota musical"),
    ],
  },
];

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
/** "l'alphabet de A à H" → "alphabet-de-a-a-h"; "los colores" → "colores". */
const bare = (s: string) => slugify(s.replace(/^(les |las |los |as |os |la |le |el |o |a |l')/, ""));

function sheet(t: Theme, words: boolean): FlashCardsSheet {
  const pages = Math.ceil(t.cards.length / CARDS_PER_PAGE);
  const n = t.cards.length;
  const name = { en: t.name.en, fr: t.name.fr, es: t.name.es, pt: t.name.pt };
  return {
    kind: "flash-cards",
    id: `cards-${t.id}${words ? "" : "-no-words"}`,
    slug: words
      ? { en: `${slugify(name.en)}-flash-cards`, fr: `cartes-${bare(name.fr)}`, es: `tarjetas-${bare(name.es)}`, pt: `cartoes-${bare(name.pt)}` }
      : { en: `${slugify(name.en)}-picture-cards-no-words`, fr: `cartes-${bare(name.fr)}-sans-mots`, es: `tarjetas-${bare(name.es)}-sin-palabras`, pt: `cartoes-${bare(name.pt)}-sem-palavras` },
    title: words
      ? { en: `${name.en} Flash Cards`, fr: `Cartes images : ${name.fr}`, es: `Tarjetas ilustradas: ${name.es}`, pt: `Cartões ilustrados: ${name.pt}` }
      : { en: `${name.en} Picture Cards Without Words`, fr: `Cartes images sans mots : ${name.fr}`, es: `Tarjetas sin palabras: ${name.es}`, pt: `Cartões sem palavras: ${name.pt}` },
    label: words
      ? { en: name.en, fr: cap(name.fr), es: cap(name.es), pt: cap(name.pt) }
      : { en: `${name.en} (no words)`, fr: `${cap(name.fr)} (sans mots)`, es: `${cap(name.es)} (sin palabras)`, pt: `${cap(name.pt)} (sem palavras)` },
    description: words
      ? {
          en: `Free printable flash cards: ${n} big cards (${name.en.toLowerCase()}) with the picture and the word, 4 to a page, ready to cut out (${pages} pages).`,
          fr: `Cartes images gratuites à imprimer : ${n} grandes cartes (${name.fr}) avec l'image et le mot, 4 par page, à découper (${pages} pages).`,
          es: `Tarjetas ilustradas gratis para imprimir: ${n} tarjetas grandes (${name.es}) con el dibujo y la palabra, 4 por página, para recortar (${pages} páginas).`,
          pt: `Cartões ilustrados grátis para imprimir: ${n} cartões grandes (${name.pt}) com a figura e a palavra, 4 por página, para recortar (${pages} páginas).`,
        }
      : {
          en: `Free printable picture cards without words: ${n} big cards (${name.en.toLowerCase()}) for guessing and naming games, 4 to a page (${pages} pages).`,
          fr: `Cartes images sans mots, gratuites : ${n} grandes cartes (${name.fr}) pour des jeux de devinettes, 4 par page (${pages} pages).`,
          es: `Tarjetas sin palabras gratis: ${n} tarjetas grandes (${name.es}) para juegos de adivinar, 4 por página (${pages} páginas).`,
          pt: `Cartões sem palavras grátis: ${n} cartões grandes (${name.pt}) para jogos de adivinhação, 4 por página (${pages} páginas).`,
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
    filters: { theme: t.group, words: words ? "yes" : "no" },
    pages,
    params: { theme: t.id, words, cards: t.cards },
  };
}

export const flashCardsSheets: FlashCardsSheet[] = [
  ...THEMES.map((t) => sheet(t, true)),
  ...THEMES.filter((t) => t.withoutWords).map((t) => sheet(t, false)),
];

/** Every cartoon the cards draw (the tests check they exist). */
export const flashCardPictures = (): string[] =>
  THEMES.flatMap((t) => t.cards.flatMap((card) => (card.type === "picture" ? [card.picture] : card.type === "letter" ? Object.values(card.picture).filter((x): x is string => !!x) : [])));

const GROUPS: Record<FlashCardsGroup, L10n> = {
  "letters-numbers": { en: "Letters and numbers", fr: "Lettres et nombres", es: "Letras y números", pt: "Letras e números" },
  "colours-shapes": { en: "Colors and shapes", fr: "Couleurs et formes", es: "Colores y figuras", pt: "Cores e formas" },
  animals: { en: "Animals", fr: "Animaux", es: "Animales", pt: "Animais" },
  food: { en: "Food", fr: "Aliments", es: "Comida", pt: "Comida" },
  everyday: { en: "Everyday life", fr: "La vie de tous les jours", es: "La vida diaria", pt: "O dia a dia" },
  nature: { en: "Nature and weather", fr: "Nature et météo", es: "Naturaleza y clima", pt: "Natureza e tempo" },
};

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
      key: "theme",
      label: { en: "Theme", fr: "Thème", es: "Tema", pt: "Tema" },
      options: (Object.keys(GROUPS) as FlashCardsGroup[]).map((v) => ({ value: v, label: GROUPS[v] })),
    },
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
