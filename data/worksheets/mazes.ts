// Maze sheets (scripts/sheets/maze-layout.ts, lib/sheets/maze.ts): a perfect
// maze (exactly one path) from a cartoon to its goal, square or in the shape
// of a phase 2 drawing (data/worksheets/drawings.ts), with the solution on
// the second page. Each sheet's id seeds its maze, so it never changes.
import { circle } from "@/lib/sheets/geometry";
import { slugify, type L10n, type Sheet, type SheetKind } from "@/lib/sheets/types";
import { getDrawing } from "./drawings";

export type MazeLevel = "easy" | "medium" | "hard";
export type MazeShape = "square" | "circle" | "heart" | "star" | "apple" | "fish" | "house";

/** A cartoon of public/words/, its name and its name with "the". */
type Actor = { picture: string; name: L10n; the: L10n };
type Story = { from: Actor; to: Actor };

const actor = (picture: string, en: string, fr: string, es: string, pt: string): Actor => {
  // "l'abeille" → "abeille"; "el perro" → "perro".
  const bare = (s: string) => s.replace(/^(the|l'|le|la|les|el|los|las|o|a|os|as) ?/, "");
  return { picture, name: { en: bare(en), fr: bare(fr), es: bare(es), pt: bare(pt) }, the: { en, fr, es, pt } };
};

const STORIES: Story[] = [
  { from: actor("bee", "the bee", "l'abeille", "la abeja", "a abelha"), to: actor("flower", "the flower", "la fleur", "la flor", "a flor") },
  { from: actor("dog", "the dog", "le chien", "el perro", "o cachorro"), to: actor("bone", "the bone", "l'os", "el hueso", "o osso") },
  { from: actor("rabbit", "the rabbit", "le lapin", "el conejo", "o coelho"), to: actor("carrot", "the carrot", "la carotte", "la zanahoria", "a cenoura") },
  { from: actor("fish", "the fish", "le poisson", "el pez", "o peixe"), to: actor("aquarium", "the fish tank", "l'aquarium", "la pecera", "o aquário") },
  { from: actor("mouse", "the mouse", "la souris", "el ratón", "o rato"), to: actor("cheese", "the cheese", "le fromage", "el queso", "o queijo") },
  { from: actor("monkey", "the monkey", "le singe", "el mono", "o macaco"), to: actor("banana", "the banana", "la banane", "el plátano", "a banana") },
  { from: actor("bird", "the bird", "l'oiseau", "el pájaro", "o passarinho"), to: actor("nest", "the nest", "le nid", "el nido", "o ninho") },
  { from: actor("squirrel", "the squirrel", "l'écureuil", "la ardilla", "o esquilo"), to: actor("nut", "the nut", "la noix", "la nuez", "a noz") },
  { from: actor("bear", "the bear", "l'ours", "el oso", "o urso"), to: actor("honey", "the honey", "le miel", "la miel", "o mel") },
  { from: actor("frog", "the frog", "la grenouille", "la rana", "o sapo"), to: actor("lake", "the pond", "la mare", "el estanque", "a lagoa") },
  { from: actor("chick", "the chick", "le poussin", "el pollito", "o pintinho"), to: actor("hen", "the hen", "la poule", "la gallina", "a galinha") },
  { from: actor("rocket", "the rocket", "la fusée", "el cohete", "o foguete"), to: actor("moon", "the moon", "la lune", "la luna", "a lua") },
  { from: actor("ship", "the ship", "le bateau", "el barco", "o navio"), to: actor("island", "the island", "l'île", "la isla", "a ilha") },
  { from: actor("ambulance", "the ambulance", "l'ambulance", "la ambulancia", "a ambulância"), to: actor("hospital", "the hospital", "l'hôpital", "el hospital", "o hospital") },
  { from: actor("penguin", "the penguin", "le pingouin", "el pingüino", "o pinguim"), to: actor("igloo", "the igloo", "l'igloo", "el iglú", "o iglu") },
  { from: actor("caterpillar", "the caterpillar", "la chenille", "la oruga", "a lagarta"), to: actor("leaf", "the leaf", "la feuille", "la hoja", "a folha") },
  { from: actor("cat", "the cat", "le chat", "el gato", "o gato"), to: actor("milk", "the milk", "le lait", "la leche", "o leite") },
];

const LEVELS: Record<MazeLevel, L10n> = {
  easy: { en: "easy", fr: "facile", es: "fácil", pt: "fácil" },
  medium: { en: "medium", fr: "moyen", es: "medio", pt: "médio" },
  hard: { en: "hard", fr: "difficile", es: "difícil", pt: "difícil" },
};

const SHAPES: Record<MazeShape, { name: L10n; colour: string; filter?: L10n }> = {
  square: { name: { en: "square", fr: "carré", es: "cuadrado", pt: "quadrado" }, colour: "#6A4CFF" },
  circle: { name: { en: "round", fr: "rond", es: "redondo", pt: "redondo" }, colour: "#3EA6FF" },
  heart: { name: { en: "heart", fr: "en cœur", es: "de corazón", pt: "de coração" }, colour: "#FF5C93", filter: { en: "Heart", fr: "Cœur", es: "Corazón", pt: "Coração" } },
  star: { name: { en: "star", fr: "en étoile", es: "de estrella", pt: "de estrela" }, colour: "#FFB020", filter: { en: "Star", fr: "Étoile", es: "Estrella", pt: "Estrela" } },
  apple: { name: { en: "apple", fr: "en pomme", es: "de manzana", pt: "de maçã" }, colour: "#E53935", filter: { en: "Apple", fr: "Pomme", es: "Manzana", pt: "Maçã" } },
  fish: { name: { en: "fish", fr: "en poisson", es: "de pez", pt: "de peixe" }, colour: "#18A97F", filter: { en: "Fish", fr: "Poisson", es: "Pez", pt: "Peixe" } },
  house: { name: { en: "house", fr: "en maison", es: "de casa", pt: "de casa" }, colour: "#FB8C00", filter: { en: "House", fr: "Maison", es: "Casa", pt: "Casa" } },
};

/** The shape's outline in a 0–100 box (none for a square maze). */
export function mazeOutline(shape: MazeShape): string | undefined {
  if (shape === "square") return undefined;
  if (shape === "circle") return circle(50, 50, 46);
  return getDrawing(shape).outline;
}

export const mazeColour = (shape: MazeShape) => SHAPES[shape].colour;

export type MazesParams = { shape: MazeShape; level: MazeLevel; cols: number; from: string; to: string };
export type MazesSheet = Sheet<MazesParams>;

/** Cells across: square mazes are cols × cols; shaped ones span the drawing's width. */
const SQUARE: Record<MazeLevel, number[]> = { easy: [5, 6, 7, 5, 6, 7], medium: [10, 10, 10, 10, 10, 10], hard: [15, 16, 18, 20, 15, 18] };
// Per shape: thin shapes (the star's points) need more columns to hold
// enough cells, wide ones fewer, so hard paths stay 5 mm wide. A star
// holds too few cells for a hard maze (68), so it has none.
const SHAPED: Record<Exclude<MazeShape, "square">, [number, number, number]> = {
  circle: [9, 13, 17],
  heart: [9, 13, 17],
  star: [12, 16, 0],
  apple: [9, 12, 15],
  fish: [10, 14, 18],
  house: [9, 13, 17],
};

// How many mazes of each shape and level.
const PLAN: [MazeShape, Record<MazeLevel, number>][] = [
  ["square", { easy: 6, medium: 6, hard: 6 }],
  ["circle", { easy: 2, medium: 3, hard: 3 }],
  ["heart", { easy: 2, medium: 2, hard: 2 }],
  ["star", { easy: 3, medium: 3, hard: 0 }],
  ["apple", { easy: 1, medium: 2, hard: 1 }],
  ["fish", { easy: 1, medium: 2, hard: 1 }],
  ["house", { easy: 1, medium: 2, hard: 1 }],
];

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
const capWords = (s: string) => s.split(" ").map(cap).join(" ");
/** Spanish "a el" → "al". */
const aEs = (the: string) => (the.startsWith("el ") ? `al ${the.slice(3)}` : `a ${the}`);

function sheet(shape: MazeShape, level: MazeLevel, cols: number, story: Story): MazesSheet {
  const { from, to } = story;
  const s = SHAPES[shape].name;
  const lv = LEVELS[level];
  const id = `maze-${shape}-${level}-${from.picture}-${to.picture}`;
  return {
    kind: "mazes",
    id,
    slug: {
      en: `${level}-${shape}-maze-${slugify(from.name.en)}-${slugify(to.name.en)}`,
      fr: `labyrinthe-${slugify(s.fr)}-${slugify(lv.fr)}-${slugify(from.name.fr)}-${slugify(to.name.fr)}`,
      es: `laberinto-${slugify(s.es)}-${slugify(lv.es)}-${slugify(from.name.es)}-${slugify(to.name.es)}`,
      pt: `labirinto-${slugify(s.pt)}-${slugify(lv.pt)}-${slugify(from.name.pt)}-${slugify(to.name.pt)}`,
    },
    title: {
      en: `${cap(lv.en)} ${cap(s.en)} Maze: ${capWords(from.name.en)} and ${capWords(to.name.en)}`,
      fr: `Labyrinthe ${s.fr} ${lv.fr} : ${from.the.fr} et ${to.the.fr}`,
      es: `Laberinto ${s.es} ${lv.es}: ${from.the.es} y ${to.the.es}`,
      pt: `Labirinto ${s.pt} ${lv.pt}: ${from.the.pt} e ${to.the.pt}`,
    },
    label: {
      en: `${cap(lv.en)} ${s.en}: ${from.name.en} and ${to.name.en}`,
      fr: `${cap(lv.fr)}, ${s.fr} : ${from.the.fr} et ${to.the.fr}`,
      es: `${cap(lv.es)}, ${s.es}: ${from.the.es} y ${to.the.es}`,
      pt: `${cap(lv.pt)}, ${s.pt}: ${from.the.pt} e ${to.the.pt}`,
    },
    description: {
      en: `Free printable ${lv.en} ${s.en} maze for kids: help ${from.the.en} find ${to.the.en}. One path only, with the solution on page 2.`,
      fr: `Labyrinthe ${s.fr} ${lv.fr} gratuit à imprimer : aide ${from.the.fr} à trouver ${to.the.fr}. Un seul chemin, avec la solution en page 2.`,
      es: `Laberinto ${s.es} ${lv.es} gratis para imprimir: ayuda ${aEs(from.the.es)} a encontrar ${to.the.es}. Un solo camino, con la solución en la página 2.`,
      pt: `Labirinto ${s.pt} ${lv.pt} grátis para imprimir: ajude ${from.the.pt} a encontrar ${to.the.pt}. Um só caminho, com a solução na página 2.`,
    },
    instruction: {
      en: `Help ${from.the.en} find ${to.the.en}: draw the path with your pencil.`,
      fr: `Aide ${from.the.fr} à trouver ${to.the.fr} : trace le chemin avec ton crayon.`,
      es: `Ayuda ${aEs(from.the.es)} a encontrar ${to.the.es}: traza el camino con tu lápiz.`,
      pt: `Ajude ${from.the.pt} a encontrar ${to.the.pt}: trace o caminho com o lápis.`,
    },
    filters: { level, shape },
    pages: 2,
    params: { shape, level, cols, from: from.picture, to: to.picture },
  };
}

function build(): MazesSheet[] {
  const out: MazesSheet[] = [];
  let k = 0;
  for (const [shape, counts] of PLAN)
    for (const level of ["easy", "medium", "hard"] as MazeLevel[])
      for (let i = 0; i < counts[level]; i++) {
        const cols = shape === "square" ? SQUARE[level][i] : SHAPED[shape][["easy", "medium", "hard"].indexOf(level)];
        // Shaped mazes take the story that suits them first.
        out.push(sheet(shape, level, cols, STORIES[k++ % STORIES.length]));
      }
  return out;
}

export const mazesSheets: MazesSheet[] = build();

export const mazeActor = (picture: string) => STORIES.flatMap((s) => [s.from, s.to]).find((a) => a.picture === picture)!;

export const mazesKind: SheetKind = {
  id: "mazes",
  slug: { en: "mazes", fr: "labyrinthes", es: "laberintos", pt: "labirintos" },
  name: { en: "Mazes", fr: "Labyrinthes", es: "Laberintos", pt: "Labirintos" },
  heading: {
    en: "Mazes for Kids: Free Printable Puzzles",
    fr: "Labyrinthes à imprimer pour les enfants",
    es: "Laberintos para niños para imprimir",
    pt: "Labirintos para crianças para imprimir",
  },
  metaTitle: {
    en: "Mazes for Kids: Easy to Hard Printable Mazes | Free PDFs",
    fr: "Labyrinthes pour enfants : faciles à difficiles, à imprimer",
    es: "Laberintos para niños: fáciles a difíciles, gratis",
    pt: "Labirintos para crianças: fáceis a difíceis, grátis",
  },
  description: {
    en: "Free printable mazes for kids: square, round and shaped mazes in three levels, each with a cartoon to guide and a solution page.",
    fr: "Labyrinthes gratuits à imprimer : carrés, ronds ou en forme de cœur, d'étoile ou de poisson, en trois niveaux, avec la solution.",
    es: "Laberintos gratis para imprimir: cuadrados, redondos o con forma de corazón, estrella o pez, en tres niveles y con la solución.",
    pt: "Labirintos grátis para imprimir: quadrados, redondos ou em forma de coração, estrela ou peixe, em três níveis e com a solução.",
  },
  intro: {
    en: "Each maze has exactly one path from the cartoon to its goal: the bee to the flower, the dog to its bone. Easy mazes have big paths for little hands; hard ones fill the page. The second page shows the solution.",
    fr: "Chaque labyrinthe a un seul chemin, du personnage jusqu'à son but : l'abeille jusqu'à la fleur, le chien jusqu'à son os. Les labyrinthes faciles ont de larges chemins pour les petites mains ; les difficiles remplissent la page. La deuxième page donne la solution.",
    es: "Cada laberinto tiene un solo camino del personaje a su meta: la abeja hasta la flor, el perro hasta su hueso. Los fáciles tienen caminos anchos para manos pequeñas; los difíciles llenan la página. La segunda página trae la solución.",
    pt: "Cada labirinto tem um só caminho do personagem até o objetivo: a abelha até a flor, o cachorro até o osso. Os fáceis têm caminhos largos para mãos pequenas; os difíceis ocupam a página toda. A segunda página traz a solução.",
  },
  howTo: {
    en: "Let your child trace the path with a finger first, then with a pencil. Dead ends are part of the game: back up and try another way. Start with the easy level, even for older children.",
    fr: "Laissez l'enfant suivre le chemin du doigt, puis au crayon. Les impasses font partie du jeu : on revient en arrière et on essaie un autre chemin. Commencez par le niveau facile, même avec les plus grands.",
    es: "Deje que el niño siga el camino con el dedo y luego con lápiz. Los callejones sin salida son parte del juego: se regresa y se prueba otro camino. Empiecen por el nivel fácil, incluso con los más grandes.",
    pt: "Deixe a criança seguir o caminho com o dedo e depois com o lápis. Os becos sem saída fazem parte da brincadeira: volta-se e tenta-se outro caminho. Comecem pelo nível fácil, mesmo com os maiores.",
  },
  level: {
    en: "Preschool to second grade (ages 3–8)",
    fr: "De la maternelle au CE1 (3 à 8 ans)",
    es: "Preescolar a segundo grado (3 a 8 años)",
    pt: "Educação infantil ao 2º ano (3 a 8 anos)",
  },
  skills: {
    en: ["Problem solving", "Pencil control", "Visual planning"],
    fr: ["Logique", "Tenue du crayon", "Repérage dans l'espace"],
    es: ["Resolución de problemas", "Control del lápiz", "Orientación espacial"],
    pt: ["Raciocínio", "Controle do lápis", "Orientação espacial"],
  },
  filters: [
    {
      key: "level",
      label: { en: "Level", fr: "Niveau", es: "Nivel", pt: "Nível" },
      options: (["easy", "medium", "hard"] as MazeLevel[]).map((v) => ({ value: v, label: LEVELS[v] })).map((o) => ({ ...o, label: { en: cap(o.label.en), fr: cap(o.label.fr), es: cap(o.label.es), pt: cap(o.label.pt) } })),
    },
    {
      key: "shape",
      label: { en: "Shape", fr: "Forme", es: "Forma", pt: "Forma" },
      options: (Object.keys(SHAPES) as MazeShape[]).map((v) => ({
        value: v,
        label: SHAPES[v].filter ?? { en: cap(SHAPES[v].name.en), fr: cap(SHAPES[v].name.fr), es: cap(SHAPES[v].name.es), pt: cap(SHAPES[v].name.pt) },
      })),
    },
  ],
};
