// The sliding puzzles of the games section (/games/sliding-puzzle and
// /games/sliding-puzzle/[puzzle]): each is one of our own cartoon scenes,
// drawn from the phase 2 drawings (data/worksheets/drawings.ts) by
// scripts/puzzles/scenes.ts into public/puzzles/<id>.webp, cut into 3 × 3 or
// 4 × 4 tiles in the browser. Pure data: the pages, the middleware, the
// sitemap and the scene script read it.
import { getDrawing } from "@/data/worksheets/drawings";
import { slugify, type L10n } from "@/lib/sheets/types";

export type PuzzleSize = 3 | 4;

/** One drawing placed in the scene, in a 200 × 200 box (y down). */
export type SceneItem = { drawing: string; x: number; y: number; w: number; h: number };

export type SceneBackground =
  | "garden" | "sea" | "night" | "snow" | "party" | "road" | "farm" | "beach"
  | "rain" | "forest" | "pond" | "sky" | "autumn" | "rainbow";

export type SlidingPuzzle = {
  id: string;
  slug: L10n;
  /** Short name ("Sunny Garden"). */
  name: L10n;
  /** The page's SEO title and meta description. */
  title: L10n;
  description: L10n;
  /** What the picture shows, for the "how it should look" image's alt text. */
  alt: L10n;
  /** The size the puzzle opens at; the other size is one tap away. */
  size: PuzzleSize;
  background: SceneBackground;
  items: SceneItem[];
};

type Scene = {
  id: string;
  name: L10n;
  background: SceneBackground;
  /** Nine drawings, one per tile of the 3 × 3 board, row by row. */
  grid: string[];
  /** The four named in the description, in that order. */
  main: string[];
  /** Placed by hand instead of the grid. */
  items?: SceneItem[];
};

const SCENES: Scene[] = [
  {
    id: "sunny-garden",
    name: { en: "Sunny Garden", fr: "Jardin ensoleillé", es: "Jardín soleado", pt: "Jardim ensolarado" },
    background: "garden",
    grid: ["sun", "bird", "kite", "tree", "house", "butterfly", "dog", "flower", "snail"],
    main: ["house", "tree", "dog", "kite"],
    items: [
      { drawing: "sun", x: 6, y: 6, w: 52, h: 52 },
      { drawing: "bird", x: 80, y: 22, w: 34, h: 30 },
      { drawing: "kite", x: 146, y: 4, w: 44, h: 56 },
      { drawing: "tree", x: 4, y: 62, w: 60, h: 76 },
      { drawing: "house", x: 76, y: 68, w: 70, h: 68 },
      { drawing: "butterfly", x: 152, y: 80, w: 40, h: 36 },
      { drawing: "dog", x: 8, y: 140, w: 54, h: 54 },
      { drawing: "flower", x: 86, y: 150, w: 32, h: 44 },
      { drawing: "snail", x: 140, y: 156, w: 50, h: 38 },
    ],
  },
  {
    id: "by-the-sea",
    name: { en: "By the Sea", fr: "Au bord de la mer", es: "Junto al mar", pt: "À beira-mar" },
    background: "sea",
    grid: ["sun", "bird", "airplane", "sailboat", "whale", "balloon", "fish", "turtle", "star"],
    main: ["whale", "sailboat", "turtle", "fish"],
  },
  {
    id: "starry-night",
    name: { en: "Starry Night", fr: "Nuit étoilée", es: "Noche estrellada", pt: "Noite estrelada" },
    background: "night",
    grid: ["star", "rocket", "airplane", "owl", "house", "tree", "cat", "car", "mushroom"],
    main: ["rocket", "owl", "house", "cat"],
  },
  {
    id: "snowy-day",
    name: { en: "Snowy Day", fr: "Jour de neige", es: "Día de nieve", pt: "Dia de neve" },
    background: "snow",
    grid: ["sun", "bird", "balloon", "tree", "house", "owl", "dog", "cat", "car"],
    main: ["house", "dog", "cat", "owl"],
  },
  {
    id: "healthy-snacks",
    name: { en: "Healthy Snacks", fr: "Bons goûters", es: "Meriendas sanas", pt: "Lanches saudáveis" },
    background: "party",
    grid: ["apple", "pear", "strawberry", "carrot", "mushroom", "flower", "heart", "sun", "butterfly"],
    main: ["apple", "pear", "strawberry", "carrot"],
  },
  {
    id: "birthday-party",
    name: { en: "Birthday Party", fr: "Fête d'anniversaire", es: "Fiesta de cumpleaños", pt: "Festa de aniversário" },
    background: "party",
    grid: ["balloon", "star", "kite", "cupcake", "heart", "ice-cream", "cat", "strawberry", "dog"],
    main: ["cupcake", "balloon", "ice-cream", "cat"],
  },
  {
    id: "on-the-road",
    name: { en: "On the Road", fr: "Sur la route", es: "En la carretera", pt: "Na estrada" },
    background: "road",
    grid: ["sun", "airplane", "balloon", "house", "tree", "bird", "car", "dog", "truck"],
    main: ["car", "truck", "airplane", "house"],
  },
  {
    id: "on-the-farm",
    name: { en: "On the Farm", fr: "À la ferme", es: "En la granja", pt: "Na fazenda" },
    background: "farm",
    grid: ["sun", "bird", "tree", "house", "truck", "cat", "dog", "carrot", "apple"],
    main: ["house", "truck", "dog", "cat"],
  },
  {
    id: "beach-day",
    name: { en: "Beach Day", fr: "Journée à la plage", es: "Día de playa", pt: "Dia de praia" },
    background: "beach",
    grid: ["sun", "kite", "bird", "sailboat", "fish", "turtle", "umbrella", "ice-cream", "star"],
    main: ["umbrella", "ice-cream", "sailboat", "turtle"],
  },
  {
    id: "rainy-day",
    name: { en: "Rainy Day", fr: "Jour de pluie", es: "Día de lluvia", pt: "Dia de chuva" },
    background: "rain",
    grid: ["bird", "umbrella", "tree", "house", "car", "mushroom", "snail", "flower", "dog"],
    main: ["umbrella", "snail", "mushroom", "house"],
  },
  {
    id: "in-the-forest",
    name: { en: "In the Forest", fr: "Dans la forêt", es: "En el bosque", pt: "Na floresta" },
    background: "forest",
    grid: ["bird", "owl", "butterfly", "tree", "mushroom", "strawberry", "snail", "flower", "turtle"],
    main: ["owl", "tree", "mushroom", "snail"],
  },
  {
    id: "at-the-pond",
    name: { en: "At the Pond", fr: "Au bord de l'étang", es: "En el estanque", pt: "Na lagoa" },
    background: "pond",
    grid: ["sun", "bird", "butterfly", "tree", "sailboat", "flower", "turtle", "fish", "snail"],
    main: ["turtle", "fish", "sailboat", "butterfly"],
  },
  {
    id: "picnic-time",
    name: { en: "Picnic Time", fr: "Pique-nique", es: "Día de pícnic", pt: "Piquenique" },
    background: "garden",
    grid: ["sun", "butterfly", "tree", "apple", "cupcake", "pear", "dog", "strawberry", "ice-cream"],
    main: ["cupcake", "apple", "strawberry", "dog"],
  },
  {
    id: "up-in-the-sky",
    name: { en: "Up in the Sky", fr: "Dans le ciel", es: "En el cielo", pt: "No céu" },
    background: "sky",
    grid: ["star", "rocket", "sun", "kite", "airplane", "bird", "balloon", "butterfly", "owl"],
    main: ["airplane", "rocket", "balloon", "kite"],
  },
  {
    id: "in-the-park",
    name: { en: "In the Park", fr: "Au parc", es: "En el parque", pt: "No parque" },
    background: "garden",
    grid: ["sun", "balloon", "kite", "tree", "dog", "bird", "umbrella", "ice-cream", "flower"],
    main: ["dog", "kite", "balloon", "ice-cream"],
  },
  {
    id: "pet-friends",
    name: { en: "Pet Friends", fr: "Mes animaux", es: "Mis mascotas", pt: "Meus bichinhos" },
    background: "party",
    grid: ["bird", "heart", "fish", "cat", "house", "dog", "turtle", "flower", "snail"],
    main: ["cat", "dog", "fish", "turtle"],
  },
  {
    id: "vegetable-garden",
    name: { en: "Vegetable Garden", fr: "Le potager", es: "El huerto", pt: "A horta" },
    background: "farm",
    grid: ["sun", "butterfly", "bird", "carrot", "mushroom", "strawberry", "pear", "snail", "flower"],
    main: ["carrot", "strawberry", "mushroom", "snail"],
  },
  {
    id: "sweet-treats",
    name: { en: "Sweet Treats", fr: "Gourmandises", es: "Dulces", pt: "Docinhos" },
    background: "party",
    grid: ["star", "balloon", "heart", "cupcake", "ice-cream", "strawberry", "apple", "cat", "pear"],
    main: ["cupcake", "ice-cream", "strawberry", "apple"],
  },
  {
    id: "autumn-walk",
    name: { en: "Autumn Walk", fr: "Promenade d'automne", es: "Paseo de otoño", pt: "Passeio de outono" },
    background: "autumn",
    grid: ["bird", "owl", "umbrella", "tree", "apple", "pear", "dog", "mushroom", "snail"],
    main: ["tree", "owl", "mushroom", "dog"],
  },
  {
    id: "toy-box",
    name: { en: "Toy Box", fr: "Coffre à jouets", es: "Caja de juguetes", pt: "Caixa de brinquedos" },
    background: "party",
    grid: ["rocket", "kite", "balloon", "airplane", "star", "sailboat", "car", "heart", "truck"],
    main: ["rocket", "car", "truck", "kite"],
  },
  {
    id: "camping-night",
    name: { en: "Camping Night", fr: "Nuit de camping", es: "Noche de campamento", pt: "Noite de acampamento" },
    background: "night",
    grid: ["star", "airplane", "owl", "tree", "heart", "mushroom", "dog", "snail", "cat"],
    main: ["owl", "tree", "dog", "cat"],
  },
  {
    id: "spring-meadow",
    name: { en: "Spring Meadow", fr: "Prairie au printemps", es: "Prado en primavera", pt: "Campo na primavera" },
    background: "garden",
    grid: ["sun", "kite", "bird", "butterfly", "flower", "heart", "turtle", "strawberry", "snail"],
    main: ["flower", "butterfly", "turtle", "kite"],
  },
  {
    id: "rainbow-day",
    name: { en: "Rainbow Day", fr: "Arc-en-ciel", es: "Día de arcoíris", pt: "Dia de arco-íris" },
    background: "rainbow",
    grid: ["sun", "balloon", "bird", "kite", "heart", "star", "umbrella", "flower", "butterfly"],
    main: ["sun", "umbrella", "balloon", "butterfly"],
  },
  {
    id: "travel-time",
    name: { en: "Travel Time", fr: "En voyage", es: "De viaje", pt: "Hora de viajar" },
    background: "road",
    grid: ["rocket", "airplane", "sun", "balloon", "house", "tree", "car", "dog", "truck"],
    main: ["airplane", "rocket", "car", "truck"],
  },
];

const LOCALES = ["en", "fr", "es", "pt"] as const;
const AND: L10n = { en: "and", fr: "et", es: "y", pt: "e" };

/** "the sun, the house and the dog", in each language. */
function list(ids: string[]): L10n {
  const out = {} as L10n;
  for (const l of LOCALES) {
    const names = ids.map((id) => getDrawing(id).the[l]);
    out[l] = `${names.slice(0, -1).join(", ")} ${AND[l]} ${names[names.length - 1]}`;
  }
  return out;
}

/** The nine drawings in the cells of a 3 × 3 grid, a little apart from each other. */
function gridItems(ids: string[]): SceneItem[] {
  const cell = 200 / 3;
  // Small fixed offsets, so the scene doesn't look like a table.
  const shift = [[2, 3], [-3, -2], [3, 1], [-2, 2], [1, -3], [3, 2], [-3, 1], [2, -2], [-1, 3]];
  return ids.map((drawing, i) => ({
    drawing,
    x: (i % 3) * cell + 9 + shift[i][0],
    y: Math.floor(i / 3) * cell + 9 + shift[i][1],
    w: cell - 18,
    h: cell - 18,
  }));
}

function puzzle(s: Scene): SlidingPuzzle {
  const n = s.name;
  const main = list(s.main);
  const all = list(s.grid);
  return {
    id: s.id,
    slug: { en: s.id, fr: slugify(n.fr), es: slugify(n.es), pt: slugify(n.pt) },
    name: n,
    title: {
      en: `${n.en} Sliding Puzzle for Kids: Play Online Free`,
      fr: `${n.fr} : taquin en ligne gratuit pour enfants`,
      es: `${n.es}: rompecabezas deslizante gratis`,
      pt: `${n.pt}: quebra-cabeça deslizante grátis`,
    },
    description: {
      en: `Slide the tiles to put the picture back together: ${main.en}. A free online sliding puzzle for kids, in 3×3 or 4×4.`,
      fr: `Fais glisser les pièces pour reconstituer l'image : ${main.fr}. Un taquin gratuit pour enfants, en 3×3 ou 4×4.`,
      es: `Desliza las piezas para armar la imagen: ${main.es}. Un rompecabezas deslizante gratis para niños, en 3×3 o 4×4.`,
      pt: `Deslize as peças para montar a imagem: ${main.pt}. Um quebra-cabeça deslizante grátis para crianças, em 3×3 ou 4×4.`,
    },
    alt: { en: `${n.en}: ${all.en}`, fr: `${n.fr} : ${all.fr}`, es: `${n.es}: ${all.es}`, pt: `${n.pt}: ${all.pt}` },
    size: 3,
    background: s.background,
    items: s.items ?? gridItems(s.grid),
  };
}

export const PUZZLES: SlidingPuzzle[] = SCENES.map(puzzle);

/** The drawings named in a scene, for the tests. */
export const SCENE_DRAWINGS: Record<string, { grid: string[]; main: string[] }> = Object.fromEntries(SCENES.map((s) => [s.id, { grid: s.grid, main: s.main }]));

export function getPuzzle(slug: string, locale: keyof L10n = "en"): SlidingPuzzle | undefined {
  return PUZZLES.find((p) => p.slug[locale] === slug);
}

export const puzzleImage = (p: SlidingPuzzle) => `/puzzles/${p.id}.webp`;

/** The game's buttons and messages ({n}: a number). */
export const PUZZLE_TEXT: L10n<{
  moves: string;
  shuffle: string;
  showNumbers: string;
  size: string;
  model: string;
  tile: string;
  board: string;
  solved: string;
  playAgain: string;
}> = {
  en: {
    moves: "Moves",
    shuffle: "Shuffle",
    showNumbers: "Show numbers",
    size: "Puzzle size",
    model: "How it should look",
    tile: "Tile {n}",
    board: "Puzzle board: use the arrow keys to slide a tile into the gap",
    solved: "You did it in {n} moves!",
    playAgain: "Play again",
  },
  fr: {
    moves: "Coups",
    shuffle: "Mélanger",
    showNumbers: "Voir les numéros",
    size: "Taille du taquin",
    model: "Le modèle",
    tile: "Pièce {n}",
    board: "Plateau du taquin : utilise les flèches pour faire glisser une pièce dans la case vide",
    solved: "Bravo, réussi en {n} coups !",
    playAgain: "Rejouer",
  },
  es: {
    moves: "Movimientos",
    shuffle: "Mezclar",
    showNumbers: "Ver números",
    size: "Tamaño del rompecabezas",
    model: "Así debe quedar",
    tile: "Pieza {n}",
    board: "Tablero: usa las flechas para deslizar una pieza al hueco",
    solved: "¡Lo lograste en {n} movimientos!",
    playAgain: "Jugar otra vez",
  },
  pt: {
    moves: "Jogadas",
    shuffle: "Embaralhar",
    showNumbers: "Mostrar números",
    size: "Tamanho do quebra-cabeça",
    model: "Como deve ficar",
    tile: "Peça {n}",
    board: "Tabuleiro: use as setas para deslizar uma peça até o espaço vazio",
    solved: "Você conseguiu em {n} jogadas!",
    playAgain: "Jogar de novo",
  },
};
