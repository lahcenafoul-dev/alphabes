// Cartoon sticker sheets (scripts/sheets/stickers-layout.ts): 9 to 16
// stickers per page with rounded dashed cut lines, to cut out and glue, or to
// print on sticker paper. Themes use the cartoons of public/words/; the
// alphabet stickers show a word starting with the letter in each language;
// the reward stickers have their own words in each language.
import { frenchLetters } from "@/lib/letters-fr";
import { spanishLetters } from "@/lib/letters-es";
import { portugueseLetters } from "@/lib/letters-pt";
import type { ShapeId } from "./vocab";
import type { L10n, Sheet, SheetKind } from "@/lib/sheets/types";

export type Sticker =
  | { type: "picture"; picture: string }
  | { type: "letter"; upper: string; lower: string; picture: L10n<string | null> }
  | { type: "number"; n: number }
  | { type: "shape"; shape: ShapeId }
  | { type: "reward"; text: L10n; picture: string };

export type StickerGroup = "letters-numbers" | "animals" | "food" | "things" | "rewards";

export type StickersParams = { theme: string; cols: number; rows: number; stickers: Sticker[] };
export type StickersSheet = Sheet<StickersParams>;

const pics = (keys: string[]): Sticker[] => keys.map((picture) => ({ type: "picture", picture }));

// ------------------------------------------------------------------ alphabet

// English has no picture data per letter (lib/letters-data.ts), so the
// words are chosen here, all with a cartoon in public/words/.
const ENGLISH_ALPHABET: Record<string, string> = {
  a: "apple", b: "bear", c: "cat", d: "dog", e: "elephant", f: "fish", g: "giraffe", h: "horse", i: "igloo",
  j: "jellyfish", k: "kite", l: "lion", m: "moon", n: "nest", o: "owl", p: "pig", q: "quail", r: "rabbit",
  s: "sun", t: "tiger", u: "umbrella", v: "violin", w: "whale", x: "xylophone", y: "yak", z: "zebra",
};

type LetterWords = { slug: string; words: { picture: string }[] }[];

/**
 * The first word of the letter that has a cartoon, in a language's letter
 * data. "number-4" (French and Portuguese Q, quatre/quatro) is a drawn digit
 * on the site, not a cartoon.
 */
function letterPicture(letters: LetterWords, letter: string): string | null {
  return letters.find((l) => l.slug === letter)?.words.find((w) => w.picture && !w.picture.startsWith("number-"))?.picture ?? null;
}

function alphabet(from: string, to: string): Sticker[] {
  const out: Sticker[] = [];
  for (let c = from.charCodeAt(0); c <= to.charCodeAt(0); c++) {
    const lower = String.fromCharCode(c);
    out.push({
      type: "letter",
      upper: lower.toUpperCase(),
      lower,
      picture: {
        en: ENGLISH_ALPHABET[lower],
        fr: letterPicture(frenchLetters, lower),
        es: letterPicture(spanishLetters, lower),
        pt: letterPicture(portugueseLetters, lower),
      },
    });
  }
  return out;
}

// ------------------------------------------------------------------ rewards

const reward = (en: string, fr: string, es: string, pt: string, picture: string): Sticker => ({ type: "reward", text: { en, fr, es, pt }, picture });

// No words that change with the child's gender (French "gentil/gentille",
// Portuguese "obrigado/obrigada", "corajoso/corajosa").
const PRAISE: Sticker[] = [
  reward("Great job!", "Bravo !", "¡Muy bien!", "Muito bem!", "star"),
  reward("Well done!", "Bien joué !", "¡Excelente!", "Parabéns!", "trophy"),
  reward("Super star!", "Super !", "¡Súper!", "Show!", "gold-medal"),
  reward("You did it!", "Tu as réussi !", "¡Lo lograste!", "Você conseguiu!", "crown"),
  reward("Awesome!", "Génial !", "¡Genial!", "Mandou bem!", "thumbs-up"),
  reward("Keep going!", "Continue !", "¡Sigue así!", "Continue assim!", "rocket"),
  reward("Amazing work!", "Excellent !", "¡Increíble!", "Incrível!", "rainbow"),
  reward("High five!", "Tope là !", "¡Choca esos cinco!", "Toca aqui!", "hand"),
  reward("Brilliant!", "Magnifique !", "¡Bravo!", "Excelente!", "sun"),
  reward("So proud!", "Trop bien !", "¡Felicidades!", "Que orgulho!", "heart"),
  reward("Wow!", "Waouh !", "¡Guau!", "Uau!", "party-popper"),
  reward("Hooray!", "Hourra !", "¡Hurra!", "Viva!", "balloon"),
];

const I_CAN: Sticker[] = [
  reward("I can read!", "Je sais lire !", "¡Ya sé leer!", "Já sei ler!", "book"),
  reward("I can count!", "Je sais compter !", "¡Ya sé contar!", "Já sei contar!", "dice"),
  reward("I can write!", "Je sais écrire !", "¡Ya sé escribir!", "Já sei escrever!", "pencil"),
  reward("I love drawing!", "J'adore dessiner !", "¡Me encanta dibujar!", "Adoro desenhar!", "paint-palette"),
  reward("I know my ABCs!", "Je connais l'alphabet !", "¡Me sé el abecedario!", "Sei o alfabeto!", "books"),
  reward("I can write my name!", "J'écris mon prénom !", "¡Escribo mi nombre!", "Escrevo meu nome!", "pen"),
  reward("I tried my best!", "J'ai fait de mon mieux !", "¡Hice mi mejor esfuerzo!", "Dei o meu melhor!", "thumbs-up"),
  reward("I finished my work!", "J'ai fini mon travail !", "¡Terminé mi trabajo!", "Terminei a tarefa!", "test-paper"),
  reward("Reading star", "Étoile de la lecture", "Estrella de la lectura", "Estrela da leitura", "star"),
  reward("Number star", "Étoile des nombres", "Estrella de los números", "Estrela dos números", "light-bulb"),
  reward("Lovely writing!", "Belle écriture !", "¡Qué bonita letra!", "Que letra caprichada!", "paper"),
  reward("Beautiful drawing!", "Joli dessin !", "¡Qué lindo dibujo!", "Que desenho lindo!", "rainbow"),
];

const KIND_HELPER: Sticker[] = [
  reward("I shared!", "J'ai partagé !", "¡Compartí!", "Eu dividi!", "cookie"),
  reward("I helped!", "J'ai aidé !", "¡Ayudé!", "Eu ajudei!", "hand"),
  reward("I listened!", "J'ai bien écouté !", "¡Escuché!", "Eu escutei!", "ear"),
  reward("I said please!", "J'ai dit s'il te plaît !", "¡Dije por favor!", "Pedi por favor!", "heart"),
  reward("I said thank you!", "J'ai dit merci !", "¡Dije gracias!", "Agradeci!", "flower"),
  reward("I tidied up!", "J'ai rangé !", "¡Recogí mis juguetes!", "Guardei os brinquedos!", "box"),
  reward("I was brave!", "J'ai osé !", "¡Fui valiente!", "Tive coragem!", "lion"),
  reward("I played with others!", "J'ai joué avec les autres !", "¡Jugué con todos!", "Brinquei com todos!", "ball"),
  reward("I waited my turn!", "J'ai attendu mon tour !", "¡Esperé mi turno!", "Esperei minha vez!", "watch"),
  reward("I ate my veggies!", "J'ai mangé mes légumes !", "¡Comí verduras!", "Comi verduras!", "broccoli"),
  reward("I brushed my teeth!", "Je me suis brossé les dents !", "¡Me lavé los dientes!", "Escovei os dentes!", "toothbrush"),
  reward("I gave a hug!", "J'ai fait un câlin !", "¡Di un abrazo!", "Dei um abraço!", "teddy-bear"),
];

// ------------------------------------------------------------------ sheets

type Spec = { id: string; group: StickerGroup; cols: number; rows: number; stickers: Sticker[]; name: L10n; about: L10n };

const n = (from: number, to: number): Sticker[] => Array.from({ length: to - from + 1 }, (_, i) => ({ type: "number", n: from + i }));

const SPECS: Spec[] = [
  {
    id: "alphabet-a-i",
    group: "letters-numbers",
    cols: 3,
    rows: 3,
    stickers: alphabet("a", "i"),
    name: { en: "Alphabet Stickers A to I", fr: "Gommettes de l'alphabet de A à I", es: "Stickers del abecedario de la A a la I", pt: "Adesivos do alfabeto de A a I" },
    about: { en: "the letters A to I, each with a picture that starts with it", fr: "les lettres de A à I, chacune avec une image qui commence par elle", es: "las letras de la A a la I, cada una con un dibujo que empieza por ella", pt: "as letras de A a I, cada uma com uma figura que começa com ela" },
  },
  {
    id: "alphabet-j-r",
    group: "letters-numbers",
    cols: 3,
    rows: 3,
    stickers: alphabet("j", "r"),
    name: { en: "Alphabet Stickers J to R", fr: "Gommettes de l'alphabet de J à R", es: "Stickers del abecedario de la J a la R", pt: "Adesivos do alfabeto de J a R" },
    about: { en: "the letters J to R, each with a picture that starts with it", fr: "les lettres de J à R, chacune avec une image qui commence par elle", es: "las letras de la J a la R, cada una con un dibujo que empieza por ella", pt: "as letras de J a R, cada uma com uma figura que começa com ela" },
  },
  {
    id: "alphabet-s-z",
    group: "letters-numbers",
    cols: 3,
    rows: 3,
    stickers: [...alphabet("s", "z"), { type: "picture", picture: "star" }],
    name: { en: "Alphabet Stickers S to Z", fr: "Gommettes de l'alphabet de S à Z", es: "Stickers del abecedario de la S a la Z", pt: "Adesivos do alfabeto de S a Z" },
    about: { en: "the letters S to Z, each with a picture that starts with it, and a star", fr: "les lettres de S à Z, chacune avec une image qui commence par elle, et une étoile", es: "las letras de la S a la Z, cada una con un dibujo que empieza por ella, y una estrella", pt: "as letras de S a Z, cada uma com uma figura que começa com ela, e uma estrela" },
  },
  {
    id: "numbers-0-10",
    group: "letters-numbers",
    cols: 3,
    rows: 4,
    stickers: [...n(0, 10), { type: "picture", picture: "star" }],
    name: { en: "Number Stickers 0 to 10", fr: "Gommettes des nombres de 0 à 10", es: "Stickers de números del 0 al 10", pt: "Adesivos de números de 0 a 10" },
    about: { en: "the numbers 0 to 10, each with dots to count", fr: "les nombres de 0 à 10, chacun avec des points à compter", es: "los números del 0 al 10, cada uno con puntos para contar", pt: "os números de 0 a 10, cada um com bolinhas para contar" },
  },
  {
    id: "numbers-11-20",
    group: "letters-numbers",
    cols: 3,
    rows: 4,
    stickers: [...n(11, 20), { type: "picture", picture: "star" }, { type: "picture", picture: "trophy" }],
    name: { en: "Number Stickers 11 to 20", fr: "Gommettes des nombres de 11 à 20", es: "Stickers de números del 11 al 20", pt: "Adesivos de números de 11 a 20" },
    about: { en: "the numbers 11 to 20, each with dots in two ten-frames", fr: "les nombres de 11 à 20, chacun avec des points dans deux boîtes de dix", es: "los números del 11 al 20, cada uno con puntos en dos marcos de diez", pt: "os números de 11 a 20, cada um com bolinhas em dois quadros de dez" },
  },
  {
    id: "farm-animals",
    group: "animals",
    cols: 3,
    rows: 4,
    stickers: pics(["cow", "pig", "sheep", "goat", "horse", "hen", "rooster", "duck", "donkey", "chick", "rabbit", "ox"]),
    name: { en: "Farm Animal Stickers", fr: "Gommettes des animaux de la ferme", es: "Stickers de animales de la granja", pt: "Adesivos de animais da fazenda" },
    about: { en: "12 farm animals: cow, pig, sheep, horse, hen and more", fr: "12 animaux de la ferme : vache, cochon, mouton, cheval, poule…", es: "12 animales de la granja: vaca, cerdo, oveja, caballo, gallina y más", pt: "12 animais da fazenda: vaca, porco, ovelha, cavalo, galinha e outros" },
  },
  {
    id: "wild-animals",
    group: "animals",
    cols: 3,
    rows: 4,
    stickers: pics(["lion", "tiger", "elephant", "giraffe", "zebra", "monkey", "gorilla", "hippo", "crocodile", "kangaroo", "koala", "jaguar"]),
    name: { en: "Wild Animal Stickers", fr: "Gommettes des animaux sauvages", es: "Stickers de animales salvajes", pt: "Adesivos de animais selvagens" },
    about: { en: "12 wild animals: lion, tiger, elephant, giraffe, zebra and more", fr: "12 animaux sauvages : lion, tigre, éléphant, girafe, zèbre…", es: "12 animales salvajes: león, tigre, elefante, jirafa, cebra y más", pt: "12 animais selvagens: leão, tigre, elefante, girafa, zebra e outros" },
  },
  {
    id: "sea-animals",
    group: "animals",
    cols: 3,
    rows: 3,
    stickers: pics(["fish", "whale", "dolphin", "octopus", "crab", "jellyfish", "seal", "turtle", "penguin"]),
    name: { en: "Sea Animal Stickers", fr: "Gommettes des animaux de la mer", es: "Stickers de animales del mar", pt: "Adesivos de animais do mar" },
    about: { en: "9 big sea animal stickers: fish, whale, dolphin, octopus, crab and more", fr: "9 grandes gommettes d'animaux de la mer : poisson, baleine, dauphin, pieuvre, crabe…", es: "9 stickers grandes de animales del mar: pez, ballena, delfín, pulpo, cangrejo y más", pt: "9 adesivos grandes de animais do mar: peixe, baleia, golfinho, polvo, caranguejo e outros" },
  },
  {
    id: "bugs",
    group: "animals",
    cols: 3,
    rows: 3,
    stickers: pics(["ant", "bee", "butterfly", "caterpillar", "ladybug", "snail", "spider", "worm", "cricket"]),
    name: { en: "Bug Stickers", fr: "Gommettes des petites bêtes", es: "Stickers de bichos", pt: "Adesivos de bichinhos de jardim" },
    about: { en: "9 big bug stickers: ant, bee, butterfly, ladybug, snail and more", fr: "9 grandes gommettes de petites bêtes : fourmi, abeille, papillon, coccinelle, escargot…", es: "9 stickers grandes de bichos: hormiga, abeja, mariposa, caracol, araña y más", pt: "9 adesivos grandes de bichinhos: formiga, abelha, borboleta, joaninha, caracol e outros" },
  },
  {
    id: "birds",
    group: "animals",
    cols: 3,
    rows: 3,
    stickers: pics(["eagle", "owl", "parrot", "flamingo", "swan", "dove", "bird", "quail", "rooster"]),
    name: { en: "Bird Stickers", fr: "Gommettes des oiseaux", es: "Stickers de aves", pt: "Adesivos de aves" },
    about: { en: "9 big bird stickers: eagle, owl, parrot, flamingo, swan and more", fr: "9 grandes gommettes d'oiseaux : aigle, hibou, perroquet, flamant rose, cygne…", es: "9 stickers grandes de aves: águila, búho, loro, flamenco, cisne y más", pt: "9 adesivos grandes de aves: águia, coruja, papagaio, flamingo, cisne e outros" },
  },
  {
    id: "pets",
    group: "animals",
    cols: 3,
    rows: 3,
    stickers: pics(["dog", "cat", "rabbit", "mouse", "hedgehog", "iguana", "parrot", "fish", "turtle"]),
    name: { en: "Pet Stickers", fr: "Gommettes des animaux de compagnie", es: "Stickers de mascotas", pt: "Adesivos de bichos de estimação" },
    about: { en: "9 big pet stickers: dog, cat, rabbit, mouse, hedgehog and more", fr: "9 grandes gommettes d'animaux de compagnie : chien, chat, lapin, souris, hérisson…", es: "9 stickers grandes de mascotas: perro, gato, conejo, ratón, erizo y más", pt: "9 adesivos grandes de bichos de estimação: cachorro, gato, coelho, rato, ouriço e outros" },
  },
  {
    id: "fruits",
    group: "food",
    cols: 3,
    rows: 4,
    stickers: pics(["apple", "banana", "strawberry", "orange", "pear", "cherry", "grapes", "lemon", "watermelon", "pineapple", "coconut", "melon"]),
    name: { en: "Fruit Stickers", fr: "Gommettes des fruits", es: "Stickers de frutas", pt: "Adesivos de frutas" },
    about: { en: "12 fruit stickers: apple, banana, strawberry, orange, pear and more", fr: "12 gommettes de fruits : pomme, banane, fraise, orange, poire…", es: "12 stickers de frutas: manzana, naranja, pera, cereza, uvas y más", pt: "12 adesivos de frutas: maçã, banana, morango, laranja, pera e outras" },
  },
  {
    id: "vegetables",
    group: "food",
    cols: 3,
    rows: 4,
    stickers: pics(["carrot", "broccoli", "corn", "cucumber", "onion", "potato", "pumpkin", "tomato", "garlic", "mushroom", "beans", "olive"]),
    name: { en: "Vegetable Stickers", fr: "Gommettes des légumes", es: "Stickers de verduras", pt: "Adesivos de legumes e verduras" },
    about: { en: "12 vegetable stickers: carrot, broccoli, corn, tomato, pumpkin and more", fr: "12 gommettes de légumes : carotte, brocoli, maïs, tomate, citrouille…", es: "12 stickers de verduras: zanahoria, brócoli, tomate, cebolla, ajo y más", pt: "12 adesivos de legumes e verduras: cenoura, brócolis, milho, tomate, abóbora e outros" },
  },
  {
    id: "treats",
    group: "food",
    cols: 3,
    rows: 4,
    stickers: pics(["cake", "cookie", "candy", "lollipop", "ice-cream", "chocolate", "waffle", "popcorn", "honey", "flan", "yogurt", "juice"]),
    name: { en: "Sweet Treat Stickers", fr: "Gommettes des gourmandises", es: "Stickers de dulces y postres", pt: "Adesivos de doces e sobremesas" },
    about: { en: "12 sweet treat stickers: cake, cookie, ice cream, waffle, popcorn and more", fr: "12 gommettes de gourmandises : gâteau, biscuit, glace, gaufre, pop-corn…", es: "12 stickers de dulces: galleta, paleta, helado, chocolate, flan y más", pt: "12 adesivos de doces: bolo, biscoito, sorvete, chocolate, pipoca e outros" },
  },
  {
    id: "meals",
    group: "food",
    cols: 3,
    rows: 4,
    stickers: pics(["pizza", "hamburger", "hot-dog", "sandwich", "bread", "cheese", "egg", "soup", "rice", "noodles", "salad", "chicken-leg"]),
    name: { en: "Food Stickers", fr: "Gommettes des repas", es: "Stickers de comida", pt: "Adesivos de comidas" },
    about: { en: "12 food stickers: pizza, sandwich, bread, cheese, soup, rice and more", fr: "12 gommettes de repas : pizza, sandwich, pain, fromage, soupe, riz…", es: "12 stickers de comida: pizza, pan, queso, huevo, sopa, arroz y más", pt: "12 adesivos de comidas: pizza, sanduíche, pão, queijo, sopa, arroz e outras" },
  },
  {
    id: "vehicles",
    group: "things",
    cols: 4,
    rows: 4,
    stickers: pics(["car", "bus", "airplane", "bicycle", "train", "sailboat", "helicopter", "tractor", "taxi", "motorbike", "rocket", "ambulance", "ship", "van", "canoe", "fast-train"]),
    name: { en: "Vehicle Stickers", fr: "Gommettes des véhicules", es: "Stickers de vehículos", pt: "Adesivos de veículos" },
    about: { en: "16 vehicle stickers: car, bus, airplane, train, tractor, rocket and more", fr: "16 gommettes de véhicules : voiture, bus, avion, train, tracteur, fusée…", es: "16 stickers de vehículos: avión, tren, tractor, cohete, barco y más", pt: "16 adesivos de veículos: carro, ônibus, avião, trem, trator, foguete e outros" },
  },
  {
    id: "toys",
    group: "things",
    cols: 3,
    rows: 4,
    stickers: pics(["ball", "balloon", "kite", "doll", "teddy-bear", "yo-yo", "drum", "robot", "dice", "xylophone", "gift", "bowling"]),
    name: { en: "Toy Stickers", fr: "Gommettes des jouets", es: "Stickers de juguetes", pt: "Adesivos de brinquedos" },
    about: { en: "12 toy stickers: ball, balloon, kite, doll, teddy bear, robot and more", fr: "12 gommettes de jouets : ballon, cerf-volant, poupée, ours en peluche, robot…", es: "12 stickers de juguetes: pelota, globo, muñeca, oso de peluche, robot y más", pt: "12 adesivos de brinquedos: bola, balão, pipa, boneca, ursinho, robô e outros" },
  },
  {
    id: "music",
    group: "things",
    cols: 3,
    rows: 3,
    stickers: pics(["guitar", "piano", "violin", "flute", "trumpet", "saxophone", "ukulele", "microphone", "music-note"]),
    name: { en: "Music Stickers", fr: "Gommettes de la musique", es: "Stickers de música", pt: "Adesivos de música" },
    about: { en: "9 big music stickers: guitar, piano, violin, flute, trumpet and more", fr: "9 grandes gommettes de musique : guitare, piano, violon, flûte, trompette…", es: "9 stickers grandes de música: guitarra, piano, violín, flauta, trompeta y más", pt: "9 adesivos grandes de música: violão, piano, violino, flauta, trompete e outros" },
  },
  {
    id: "space-weather",
    group: "things",
    cols: 3,
    rows: 4,
    stickers: pics(["rocket", "planet", "moon", "star", "sun", "earth", "galaxy", "cloud", "rainbow", "snowflake", "lightning", "rain"]),
    name: { en: "Space and Weather Stickers", fr: "Gommettes de l'espace et de la météo", es: "Stickers del espacio y el clima", pt: "Adesivos do espaço e do tempo" },
    about: { en: "12 stickers of the sky: rocket, planet, moon, sun, rainbow, snowflake and more", fr: "12 gommettes du ciel : fusée, planète, lune, soleil, arc-en-ciel, flocon…", es: "12 stickers del cielo: cohete, planeta, luna, sol, arcoíris, copo de nieve y más", pt: "12 adesivos do céu: foguete, planeta, lua, sol, arco-íris, floco de neve e outros" },
  },
  {
    id: "garden",
    group: "things",
    cols: 3,
    rows: 3,
    stickers: pics(["flower", "tulip", "sunflower", "rose", "tree", "leaf", "mushroom", "cactus", "potted-plant"]),
    name: { en: "Garden and Nature Stickers", fr: "Gommettes du jardin et de la nature", es: "Stickers del jardín y la naturaleza", pt: "Adesivos do jardim e da natureza" },
    about: { en: "9 big nature stickers: flower, tulip, sunflower, tree, leaf, cactus and more", fr: "9 grandes gommettes de la nature : fleur, tulipe, tournesol, arbre, feuille, cactus…", es: "9 stickers grandes de la naturaleza: flor, tulipán, girasol, árbol, hoja, cactus y más", pt: "9 adesivos grandes da natureza: flor, tulipa, girassol, árvore, folha, cacto e outros" },
  },
  {
    id: "fairy-tale",
    group: "things",
    cols: 3,
    rows: 3,
    stickers: pics(["dragon", "unicorn", "castle", "crown", "fairy", "wizard", "magic-wand", "princess", "king"]),
    name: { en: "Fairy Tale Stickers", fr: "Gommettes des contes de fées", es: "Stickers de cuentos de hadas", pt: "Adesivos de contos de fadas" },
    about: { en: "9 big fairy tale stickers: dragon, unicorn, castle, crown, fairy, wizard and more", fr: "9 grandes gommettes de contes : dragon, licorne, château, couronne, fée, magicien…", es: "9 stickers grandes de cuentos: dragón, unicornio, castillo, corona, hada, mago y más", pt: "9 adesivos grandes de contos de fadas: dragão, unicórnio, castelo, coroa, fada, mago e outros" },
  },
  {
    id: "shapes",
    group: "things",
    cols: 3,
    rows: 4,
    stickers: (["circle", "square", "triangle", "rectangle", "star", "heart", "diamond", "oval", "pentagon", "hexagon", "crescent", "arrow"] as ShapeId[]).map((shape) => ({ type: "shape", shape })),
    name: { en: "Shape Stickers", fr: "Gommettes des formes", es: "Stickers de figuras geométricas", pt: "Adesivos de formas geométricas" },
    about: { en: "12 shape stickers with their names: circle, square, triangle, star, heart and more", fr: "12 gommettes de formes avec leur nom : rond, carré, triangle, étoile, cœur…", es: "12 stickers de figuras con su nombre: círculo, cuadrado, triángulo, estrella, corazón y más", pt: "12 adesivos de formas com o nome: círculo, quadrado, triângulo, estrela, coração e outras" },
  },
  {
    id: "rewards-praise",
    group: "rewards",
    cols: 3,
    rows: 4,
    stickers: PRAISE,
    name: { en: "Reward Stickers: Great Job!", fr: "Gommettes de récompense : Bravo !", es: "Stickers de premio: ¡Muy bien!", pt: "Adesivos de recompensa: Muito bem!" },
    about: { en: "12 reward stickers with words of praise: Great job!, Well done!, You did it! and more", fr: "12 gommettes de récompense pour féliciter : Bravo !, Bien joué !, Tu as réussi !…", es: "12 stickers de premio para felicitar: ¡Muy bien!, ¡Excelente!, ¡Lo lograste! y más", pt: "12 adesivos de recompensa para elogiar: Muito bem!, Parabéns!, Você conseguiu! e outros" },
  },
  {
    id: "rewards-i-can",
    group: "rewards",
    cols: 3,
    rows: 4,
    stickers: I_CAN,
    name: { en: "Reward Stickers: I Can Do It!", fr: "Gommettes de récompense : je sais faire !", es: "Stickers de premio: ¡ya sé hacerlo!", pt: "Adesivos de recompensa: eu já sei!" },
    about: { en: "12 school reward stickers: I can read!, I can count!, I can write my name! and more", fr: "12 gommettes pour l'école : Je sais lire !, Je sais compter !, J'écris mon prénom !…", es: "12 stickers para la escuela: ¡Ya sé leer!, ¡Ya sé contar!, ¡Escribo mi nombre! y más", pt: "12 adesivos para a escola: Já sei ler!, Já sei contar!, Escrevo meu nome! e outros" },
  },
  {
    id: "rewards-kind-helper",
    group: "rewards",
    cols: 3,
    rows: 4,
    stickers: KIND_HELPER,
    name: { en: "Reward Stickers for Kind Helpers", fr: "Gommettes de récompense : les bons gestes", es: "Stickers de premio: buenas acciones", pt: "Adesivos de recompensa: boas atitudes" },
    about: { en: "12 stickers for good habits and kind acts: I shared!, I helped!, I brushed my teeth! and more", fr: "12 gommettes pour les bons gestes : J'ai partagé !, J'ai aidé !, J'ai rangé !…", es: "12 stickers para los buenos hábitos: ¡Compartí!, ¡Ayudé!, ¡Me lavé los dientes! y más", pt: "12 adesivos para as boas atitudes: Eu dividi!, Eu ajudei!, Escovei os dentes! e outros" },
  },
];

const PREFIX: L10n = { en: "sticker-sheet", fr: "gommettes", es: "stickers", pt: "adesivos" };

/** The theme part of each sheet's slug, after the prefix. */
const THEME_SLUG: Record<string, [en: string, fr: string, es: string, pt: string]> = {
  "alphabet-a-i": ["alphabet-a-to-i", "alphabet-a-i", "abecedario-a-i", "alfabeto-a-i"],
  "alphabet-j-r": ["alphabet-j-to-r", "alphabet-j-r", "abecedario-j-r", "alfabeto-j-r"],
  "alphabet-s-z": ["alphabet-s-to-z", "alphabet-s-z", "abecedario-s-z", "alfabeto-s-z"],
  "numbers-0-10": ["numbers-0-to-10", "nombres-0-10", "numeros-0-10", "numeros-0-10"],
  "numbers-11-20": ["numbers-11-to-20", "nombres-11-20", "numeros-11-20", "numeros-11-20"],
  "farm-animals": ["farm-animals", "animaux-de-la-ferme", "animales-de-la-granja", "animais-da-fazenda"],
  "wild-animals": ["wild-animals", "animaux-sauvages", "animales-salvajes", "animais-selvagens"],
  "sea-animals": ["sea-animals", "animaux-de-la-mer", "animales-del-mar", "animais-do-mar"],
  bugs: ["bugs", "petites-betes", "bichos", "bichinhos-de-jardim"],
  birds: ["birds", "oiseaux", "aves", "aves"],
  pets: ["pets", "animaux-de-compagnie", "mascotas", "bichos-de-estimacao"],
  fruits: ["fruit", "fruits", "frutas", "frutas"],
  vegetables: ["vegetables", "legumes", "verduras", "legumes-e-verduras"],
  treats: ["sweet-treats", "gourmandises", "dulces-y-postres", "doces-e-sobremesas"],
  meals: ["food", "repas", "comida", "comidas"],
  vehicles: ["vehicles", "vehicules", "vehiculos", "veiculos"],
  toys: ["toys", "jouets", "juguetes", "brinquedos"],
  music: ["music", "musique", "musica", "musica"],
  "space-weather": ["space-and-weather", "espace-et-meteo", "espacio-y-clima", "espaco-e-tempo"],
  garden: ["garden-and-nature", "jardin-et-nature", "jardin-y-naturaleza", "jardim-e-natureza"],
  "fairy-tale": ["fairy-tales", "contes-de-fees", "cuentos-de-hadas", "contos-de-fadas"],
  shapes: ["shapes", "formes", "figuras-geometricas", "formas-geometricas"],
  "rewards-praise": ["rewards-great-job", "recompense-bravo", "premio-muy-bien", "recompensa-muito-bem"],
  "rewards-i-can": ["rewards-i-can-do-it", "recompense-je-sais-faire", "premio-ya-se-hacerlo", "recompensa-eu-ja-sei"],
  "rewards-kind-helper": ["rewards-kind-helpers", "recompense-bons-gestes", "premio-buenas-acciones", "recompensa-boas-atitudes"],
};

export const stickersSheets: StickersSheet[] = SPECS.map((s) => ({
  kind: "stickers",
  id: s.id,
  slug: {
    en: `${PREFIX.en}-${THEME_SLUG[s.id][0]}`,
    fr: `${PREFIX.fr}-${THEME_SLUG[s.id][1]}`,
    es: `${PREFIX.es}-${THEME_SLUG[s.id][2]}`,
    pt: `${PREFIX.pt}-${THEME_SLUG[s.id][3]}`,
  },
  title: s.name,
  label: s.name,
  description: {
    en: `Free printable sticker sheet: ${s.about.en}. Cut them out along the rounded dashed lines, or print on sticker paper.`,
    fr: `Planche de gommettes gratuite à imprimer : ${s.about.fr}. À découper en suivant les pointillés, ou à imprimer sur du papier autocollant.`,
    es: `Hoja de stickers gratis para imprimir: ${s.about.es}. Se recortan por la línea punteada o se imprimen en papel adhesivo.`,
    pt: `Cartela de adesivos grátis para imprimir: ${s.about.pt}. Recorte na linha pontilhada ou imprima em papel adesivo.`,
  },
  instruction: {
    en: "Cut out your stickers along the dashed lines, then glue them on (or print on sticker paper).",
    fr: "Découpe tes gommettes en suivant les pointillés, puis colle-les (ou imprime sur du papier autocollant).",
    es: "Recorta tus stickers por la línea punteada y pégalos (o imprime en papel adhesivo).",
    pt: "Recorte seus adesivos na linha pontilhada e cole (ou imprima em papel adesivo).",
  },
  filters: { group: s.group },
  params: { theme: s.id, cols: s.cols, rows: s.rows, stickers: s.stickers },
}));

export const stickersKind: SheetKind = {
  id: "stickers",
  slug: { en: "sticker-sheets", fr: "gommettes", es: "stickers", pt: "adesivos" },
  name: { en: "Sticker Sheets", fr: "Gommettes", es: "Stickers", pt: "Adesivos" },
  heading: {
    en: "Printable Cartoon Sticker Sheets",
    fr: "Planches de gommettes à imprimer",
    es: "Hojas de stickers para imprimir",
    pt: "Cartelas de adesivos para imprimir",
  },
  metaTitle: {
    en: "Printable Sticker Sheets for Kids | Free PDFs",
    fr: "Gommettes à imprimer gratuitement : planches pour enfants",
    es: "Stickers para imprimir gratis: hojas para niños",
    pt: "Adesivos para imprimir grátis: cartelas para crianças",
  },
  description: {
    en: "25 free printable sticker sheets: alphabet, numbers 0–20, animals, fruit, vegetables, vehicles, food, shapes and reward stickers, with rounded cut lines.",
    fr: "25 planches de gommettes gratuites : alphabet, nombres de 0 à 20, animaux, fruits, légumes, véhicules, formes et gommettes de récompense, à découper.",
    es: "25 hojas de stickers gratis para imprimir: abecedario, números del 0 al 20, animales, frutas, verduras, vehículos, figuras y stickers de premio.",
    pt: "25 cartelas de adesivos grátis para imprimir: alfabeto, números de 0 a 20, animais, frutas, legumes, veículos, formas e adesivos de recompensa.",
  },
  intro: {
    en: "Our cartoon friends as stickers: 9 to 16 per page, each inside a rounded dashed line that's easy to cut along. Print them on sticker paper for real stickers, or on plain paper and use a glue stick. Use them on charts, in notebooks, to mark a finished worksheet, or as rewards: the reward sheets have their own cheerful words in each language.",
    fr: "Nos petits dessins en gommettes : 9 à 16 par page, chacune entourée de pointillés arrondis faciles à découper. Imprimez-les sur du papier autocollant pour de vraies gommettes, ou sur du papier ordinaire avec un bâton de colle. Pour décorer un cahier, marquer une fiche terminée ou récompenser un effort : les planches de récompense ont leurs propres mots d'encouragement en français.",
    es: "Nuestros dibujos convertidos en stickers: de 9 a 16 por página, cada uno dentro de una línea punteada redondeada fácil de recortar. Imprímalos en papel adhesivo para tener stickers de verdad, o en papel normal y use pegamento en barra. Sirven para decorar cuadernos, marcar una ficha terminada o premiar un esfuerzo: las hojas de premio tienen sus propias palabras de ánimo en español.",
    pt: "Nossos desenhos em forma de adesivos: de 9 a 16 por página, cada um dentro de uma linha pontilhada arredondada fácil de recortar. Imprima em papel adesivo para ter adesivos de verdade, ou em papel comum e use cola bastão. Servem para decorar cadernos, marcar uma atividade terminada ou premiar um esforço: as cartelas de recompensa têm suas próprias palavras de incentivo em português.",
  },
  howTo: {
    en: "Cutting along the dashed lines is good scissor practice: let your child cut out the stickers, then sort them, name them, or count them before gluing. For reward stickers, agree together on what earns one.",
    fr: "Découper en suivant les pointillés est un bon exercice de motricité fine : laissez l'enfant découper les gommettes, puis les trier, les nommer ou les compter avant de les coller. Pour les gommettes de récompense, décidez ensemble de ce qui en fait gagner une.",
    es: "Recortar por la línea punteada es una buena práctica con las tijeras: deje que el niño recorte los stickers y luego los clasifique, los nombre o los cuente antes de pegarlos. Para los stickers de premio, acuerden juntos qué se necesita para ganar uno.",
    pt: "Recortar na linha pontilhada é um ótimo treino com a tesoura: deixe a criança recortar os adesivos e depois separar, nomear ou contar antes de colar. Para os adesivos de recompensa, combinem juntos o que vale um adesivo.",
  },
  level: {
    en: "Ages 3–8",
    fr: "De 3 à 8 ans",
    es: "De 3 a 8 años",
    pt: "De 3 a 8 anos",
  },
  skills: {
    en: ["Cutting", "Vocabulary", "Rewards"],
    fr: ["Découpage", "Vocabulaire", "Récompenses"],
    es: ["Recortar", "Vocabulario", "Premios"],
    pt: ["Recorte", "Vocabulário", "Recompensas"],
  },
  filters: [
    {
      key: "group",
      label: { en: "Theme", fr: "Thème", es: "Tema", pt: "Tema" },
      options: [
        { value: "letters-numbers", label: { en: "Letters and numbers", fr: "Lettres et nombres", es: "Letras y números", pt: "Letras e números" } },
        { value: "animals", label: { en: "Animals", fr: "Animaux", es: "Animales", pt: "Animais" } },
        { value: "food", label: { en: "Food", fr: "À manger", es: "Comida", pt: "Comidas" } },
        { value: "things", label: { en: "Things and nature", fr: "Objets et nature", es: "Objetos y naturaleza", pt: "Objetos e natureza" } },
        { value: "rewards", label: { en: "Rewards", fr: "Récompenses", es: "Premios", pt: "Recompensas" } },
      ],
    },
  ],
};
