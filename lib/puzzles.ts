// The sliding puzzles of the games section (/games/sliding-puzzle/[puzzle]):
// each is one of our own cartoon scenes, drawn from the phase 2 drawings
// (data/worksheets/drawings.ts) by scripts/puzzles/scenes.ts into
// public/puzzles/<id>.webp, cut into 3 × 3 or 4 × 4 tiles in the browser.
// Pure data: the pages, the middleware and the scene script read it.
import type { L10n } from "@/lib/sheets/types";

export type PuzzleSize = 3 | 4;

/** One drawing placed in the scene, in a 200 × 200 box (y down). */
export type SceneItem = { drawing: string; x: number; y: number; w: number; h: number };

export type SceneBackground = "garden" | "sea" | "night" | "snow";

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
  /** The size the puzzle opens at; both sizes can be played. */
  size: PuzzleSize;
  background: SceneBackground;
  items: SceneItem[];
};

export const PUZZLES: SlidingPuzzle[] = [
  {
    id: "sunny-garden",
    slug: { en: "sunny-garden", fr: "jardin-ensoleille", es: "jardin-soleado", pt: "jardim-ensolarado" },
    name: { en: "Sunny Garden", fr: "Le jardin ensoleillé", es: "El jardín soleado", pt: "O jardim ensolarado" },
    title: {
      en: "Sunny Garden Sliding Puzzle for Kids: Play Online Free",
      fr: "Taquin du jardin ensoleillé pour enfants : jeu en ligne gratuit",
      es: "Rompecabezas deslizante del jardín soleado: juego gratis",
      pt: "Quebra-cabeça deslizante do jardim ensolarado: jogo grátis",
    },
    description: {
      en: "Slide the tiles to put the sunny garden back together: a house, a tree, a dog and a kite. A free online sliding puzzle for kids in 3×3 or 4×4.",
      fr: "Fais glisser les pièces pour reconstituer le jardin ensoleillé : une maison, un arbre, un chien et un cerf-volant. Un taquin gratuit en 3×3 ou 4×4.",
      es: "Desliza las piezas para armar el jardín soleado: una casa, un árbol, un perro y una cometa. Rompecabezas deslizante gratis en 3×3 o 4×4.",
      pt: "Deslize as peças para montar o jardim ensolarado: uma casa, uma árvore, um cachorro e uma pipa. Quebra-cabeça deslizante grátis em 3×3 ou 4×4.",
    },
    alt: {
      en: "A sunny garden with a house, a tree, a dog, flowers, a snail, a bird and a kite",
      fr: "Un jardin ensoleillé avec une maison, un arbre, un chien, des fleurs, un escargot, un oiseau et un cerf-volant",
      es: "Un jardín soleado con una casa, un árbol, un perro, flores, un caracol, un pájaro y una cometa",
      pt: "Um jardim ensolarado com uma casa, uma árvore, um cachorro, flores, um caracol, um passarinho e uma pipa",
    },
    size: 3,
    background: "garden",
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
];

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
