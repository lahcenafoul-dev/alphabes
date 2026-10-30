// Pattern worksheets ("What comes next?" and "Complete the pattern"), drawn by
// scripts/sheets/patterns-layout.ts. Six rows per sheet; each row repeats a
// unit (AB, AAB, ABB, ABC, AABB) made of cartoons, shapes or coloured
// balloons, or grows by one picture per box. Two versions of every sheet:
//   circle  the last box is empty; circle the right answer among three
//   draw    two or three boxes are empty; draw (or colour) what goes there
import { COLOURS, SHAPE_NAMES, type ColourId, type ShapeId } from "./vocab";
import { cap, pick, seededRandom, slugify, type L10n, type Sheet, type SheetKind } from "@/lib/sheets/types";

/** "pic:apple" (a cartoon), "shape:star" or "colour:red" (a balloon). */
export type PatternItem = string;
/** A box of a row: `count` copies of an item, or null for an empty box. */
export type PatternCell = { item: PatternItem; count: number } | null;
export type PatternRow = { cells: PatternCell[]; choices?: { item: PatternItem; count: number }[] };

export type PatternType = "ab" | "aab" | "abb" | "abc" | "aabb" | "growing";
export type PatternTheme = "fruits" | "animals" | "vehicles" | "food" | "seasons" | "shapes" | "colours";
export type PatternVersion = "circle" | "draw";

export type PatternsParams = { type: PatternType; theme: PatternTheme; version: PatternVersion; rows: PatternRow[] };
export type PatternsSheet = Sheet<PatternsParams>;

// Cartoons that read clearly at 14 mm and don't look like each other.
const POOLS: Record<PatternTheme, PatternItem[]> = {
  fruits: ["apple", "banana", "strawberry", "orange", "pear", "cherry", "grapes", "lemon", "watermelon", "pineapple", "coconut"].map((k) => `pic:${k}`),
  animals: ["cat", "dog", "cow", "pig", "duck", "frog", "lion", "elephant", "monkey", "rabbit", "bear", "owl", "fox", "penguin", "turtle", "zebra"].map((k) => `pic:${k}`),
  vehicles: ["car", "bus", "airplane", "bicycle", "train", "sailboat", "helicopter", "tractor", "taxi", "motorbike", "rocket", "ambulance"].map((k) => `pic:${k}`),
  food: ["pizza", "cake", "cookie", "bread", "cheese", "ice-cream", "hamburger", "hot-dog", "candy", "lollipop", "sandwich", "egg", "popcorn", "waffle"].map((k) => `pic:${k}`),
  seasons: ["sun", "snowflake", "leaf", "flower", "umbrella", "cloud", "rainbow", "tulip", "sunflower", "pumpkin", "mushroom", "christmas-tree"].map((k) => `pic:${k}`),
  shapes: (["circle", "square", "triangle", "star", "heart", "diamond", "hexagon", "oval"] as ShapeId[]).map((s) => `shape:${s}`),
  colours: (Object.keys(COLOURS) as ColourId[]).map((c) => `colour:${c}`),
};

const UNITS: Record<Exclude<PatternType, "growing">, number[]> = {
  ab: [0, 1],
  aab: [0, 0, 1],
  abb: [0, 1, 1],
  abc: [0, 1, 2],
  aabb: [0, 0, 1, 1],
};

const ROWS = 6;

/** "What comes next?": at least two whole units, then an empty box and three choices. */
function circleRow(unit: number[], items: PatternItem[], extra: PatternItem, rand: () => number): PatternRow {
  const minShown = unit.length * 2;
  // Up to 8 boxes; a random length so the answer isn't always the first item.
  const lengths = [minShown, minShown + 1, minShown + 2].filter((n) => n + 1 <= 9);
  const shown = lengths[Math.floor(rand() * lengths.length)];
  const cells: PatternCell[] = Array.from({ length: shown }, (_, i) => ({ item: items[unit[i % unit.length]], count: 1 }));
  const answer = items[unit[shown % unit.length]];
  const wrong = [...new Set([...items.filter((x) => x !== answer), extra])];
  const choices = pick([answer, ...pick(wrong, 2, rand)], 3, rand).map((item) => ({ item, count: 1 }));
  return { cells: [...cells, null], choices };
}

/** "Complete the pattern": 8 boxes, the first unit always shown, then 2 or 3 empty boxes. */
function drawRow(unit: number[], items: PatternItem[], blanks: number, rand: () => number): PatternRow {
  const length = unit.length === 4 ? 10 : 8;
  const free = Array.from({ length: length - unit.length }, (_, i) => i + unit.length);
  // The last box is always one of them, so the row ends on a question.
  const empty = new Set([length - 1, ...pick(free.slice(0, -1), blanks - 1, rand)]);
  return { cells: Array.from({ length }, (_, i) => (empty.has(i) ? null : { item: items[unit[i % unit.length]], count: 1 })) };
}

/** A growing (or shrinking) row: 1, 2, 3, 4… pictures per box. */
function growingRow(item: PatternItem, version: PatternVersion, r: number, rand: () => number): PatternRow {
  const down = r % 3 === 2;
  const start = down ? 5 + Math.floor(rand() * 2) : 1 + Math.floor(rand() * 2);
  const step = down ? -1 : 1;
  const counts = [0, 1, 2, 3].map((i) => start + i * step);
  const answer = start + 4 * step;
  const cells: PatternCell[] = [...counts.map((count) => ({ item, count })), null];
  if (version === "draw") return { cells };
  const options = [answer - 1, answer + 1, answer - 2, answer + 2].filter((n) => n > 0 && n <= 6).slice(0, 2);
  return { cells, choices: pick([answer, ...options], 3, rand).map((count) => ({ item, count })) };
}

function rowsFor(type: PatternType, theme: PatternTheme, version: PatternVersion, seed: string): PatternRow[] {
  const rand = seededRandom(seed);
  const pool = POOLS[theme];
  const rows: PatternRow[] = [];
  // Go through the pool in a shuffled order, so each row has new pictures.
  let order = pick(pool, pool.length, rand);
  const take = (n: number): PatternItem[] => {
    if (order.length < n) order = pick(pool, pool.length, rand);
    return order.splice(0, n);
  };
  for (let r = 0; r < ROWS; r++) {
    if (type === "growing") {
      rows.push(growingRow(take(1)[0], version, r, rand));
      continue;
    }
    const unit = UNITS[type];
    const letters = Math.max(...unit) + 1;
    const items = take(letters);
    // The third choice comes from the theme but isn't in the row.
    if (version === "circle") rows.push(circleRow(unit, items, pick(pool.filter((x) => !items.includes(x)), 1, rand)[0], rand));
    else rows.push(drawRow(unit, items, r < 3 ? 2 : 3, rand));
  }
  return rows;
}

// ------------------------------------------------------------------ words

const TYPE_NAME: Record<PatternType, L10n> = {
  ab: { en: "AB", fr: "AB", es: "AB", pt: "AB" },
  aab: { en: "AAB", fr: "AAB", es: "AAB", pt: "AAB" },
  abb: { en: "ABB", fr: "ABB", es: "ABB", pt: "ABB" },
  abc: { en: "ABC", fr: "ABC", es: "ABC", pt: "ABC" },
  aabb: { en: "AABB", fr: "AABB", es: "AABB", pt: "AABB" },
  growing: { en: "Growing", fr: "qui grandit", es: "que crece", pt: "crescente" },
};

const TYPE_SLUG: Record<PatternType, L10n> = {
  ab: { en: "ab", fr: "ab", es: "ab", pt: "ab" },
  aab: { en: "aab", fr: "aab", es: "aab", pt: "aab" },
  abb: { en: "abb", fr: "abb", es: "abb", pt: "abb" },
  abc: { en: "abc", fr: "abc", es: "abc", pt: "abc" },
  aabb: { en: "aabb", fr: "aabb", es: "aabb", pt: "aabb" },
  growing: { en: "growing", fr: "qui-grandit", es: "creciente", pt: "crescente" },
};

/** How the unit sounds, for the descriptions: "apple, banana, apple, banana". */
const TYPE_EXAMPLE: Record<PatternType, L10n> = {
  ab: { en: "two things taking turns (A, B, A, B)", fr: "deux éléments qui alternent (A, B, A, B)", es: "dos elementos que se turnan (A, B, A, B)", pt: "dois elementos que se alternam (A, B, A, B)" },
  aab: { en: "two of one thing, then one of another (A, A, B)", fr: "deux fois le même élément, puis un autre (A, A, B)", es: "dos veces lo mismo y luego otra cosa (A, A, B)", pt: "duas vezes o mesmo elemento e depois outro (A, A, B)" },
  abb: { en: "one thing, then two of another (A, B, B)", fr: "un élément, puis deux fois un autre (A, B, B)", es: "una cosa y luego dos veces otra (A, B, B)", pt: "um elemento e depois duas vezes outro (A, B, B)" },
  abc: { en: "three different things in turn (A, B, C)", fr: "trois éléments différents à la suite (A, B, C)", es: "tres cosas distintas en orden (A, B, C)", pt: "três elementos diferentes em ordem (A, B, C)" },
  aabb: { en: "two of one thing, then two of another (A, A, B, B)", fr: "deux fois un élément, puis deux fois un autre (A, A, B, B)", es: "dos veces una cosa y dos veces otra (A, A, B, B)", pt: "duas vezes um elemento e duas vezes outro (A, A, B, B)" },
  growing: { en: "one more picture in each box (1, 2, 3…), or one fewer", fr: "une image de plus dans chaque case (1, 2, 3…), ou une de moins", es: "un dibujo más en cada casilla (1, 2, 3…), o uno menos", pt: "uma figura a mais em cada quadrinho (1, 2, 3…), ou uma a menos" },
};

const THEME: Record<PatternTheme, { with: L10n; slug: L10n; filter: L10n }> = {
  fruits: { with: { en: "with Fruit", fr: "avec des fruits", es: "con frutas", pt: "com frutas" }, slug: { en: "fruit", fr: "fruits", es: "frutas", pt: "frutas" }, filter: { en: "Fruit", fr: "Fruits", es: "Frutas", pt: "Frutas" } },
  animals: { with: { en: "with Animals", fr: "avec des animaux", es: "con animales", pt: "com animais" }, slug: { en: "animals", fr: "animaux", es: "animales", pt: "animais" }, filter: { en: "Animals", fr: "Animaux", es: "Animales", pt: "Animais" } },
  vehicles: { with: { en: "with Vehicles", fr: "avec des véhicules", es: "con vehículos", pt: "com veículos" }, slug: { en: "vehicles", fr: "vehicules", es: "vehiculos", pt: "veiculos" }, filter: { en: "Vehicles", fr: "Véhicules", es: "Vehículos", pt: "Veículos" } },
  food: { with: { en: "with Food", fr: "avec des aliments", es: "con comida", pt: "com comidas" }, slug: { en: "food", fr: "aliments", es: "comida", pt: "comidas" }, filter: { en: "Food", fr: "Aliments", es: "Comida", pt: "Comidas" } },
  seasons: { with: { en: "with Weather and Seasons", fr: "avec la météo et les saisons", es: "con el clima y las estaciones", pt: "com o tempo e as estações" }, slug: { en: "seasons", fr: "saisons", es: "estaciones", pt: "estacoes" }, filter: { en: "Seasons", fr: "Saisons", es: "Estaciones", pt: "Estações" } },
  shapes: { with: { en: "with Shapes", fr: "avec des formes", es: "con figuras", pt: "com formas" }, slug: { en: "shapes", fr: "formes", es: "figuras", pt: "formas" }, filter: { en: "Shapes", fr: "Formes", es: "Figuras", pt: "Formas" } },
  colours: { with: { en: "with Colors", fr: "avec des couleurs", es: "con colores", pt: "com cores" }, slug: { en: "colors", fr: "couleurs", es: "colores", pt: "cores" }, filter: { en: "Colors", fr: "Couleurs", es: "Colores", pt: "Cores" } },
};

const VERSION: Record<PatternVersion, { title: L10n; slug: L10n; filter: L10n }> = {
  circle: {
    title: { en: "What Comes Next?", fr: "qu'est-ce qui vient après ?", es: "¿qué sigue?", pt: "o que vem depois?" },
    slug: { en: "what-comes-next", fr: "entoure", es: "que-sigue", pt: "o-que-vem-depois" },
    filter: { en: "Circle the answer", fr: "Entourer la réponse", es: "Encerrar la respuesta", pt: "Circular a resposta" },
  },
  draw: {
    title: { en: "Complete the Pattern", fr: "complète la suite", es: "completa la serie", pt: "complete a sequência" },
    slug: { en: "complete", fr: "complete", es: "completa", pt: "complete" },
    filter: { en: "Draw in the boxes", fr: "Dessiner dans les cases", es: "Dibujar en las casillas", pt: "Desenhar nos quadrinhos" },
  },
};

const PREFIX: L10n = { en: "patterns", fr: "suite-logique", es: "serie", pt: "sequencia" };

function titleOf(type: PatternType, theme: PatternTheme, version: PatternVersion): L10n {
  const t = TYPE_NAME[type];
  const th = THEME[theme].with;
  const v = VERSION[version].title;
  if (type === "growing")
    return {
      en: `Growing Patterns ${th.en}: ${v.en}`,
      fr: `Suite qui grandit ${th.fr} : ${v.fr}`,
      es: `Serie que crece ${th.es}: ${v.es}`,
      pt: `Sequência crescente ${th.pt}: ${v.pt}`,
    };
  return {
    en: `${t.en} Patterns ${th.en}: ${v.en}`,
    fr: `Suite logique ${t.fr} ${th.fr} : ${v.fr}`,
    es: `Serie ${t.es} ${th.es}: ${v.es}`,
    pt: `Sequência ${t.pt} ${th.pt}: ${v.pt}`,
  };
}

function instructionOf(type: PatternType, theme: PatternTheme, version: PatternVersion): L10n {
  if (type === "growing")
    return version === "circle"
      ? { en: "Look how each box changes. Circle the box that comes next.", fr: "Regarde comment chaque case change. Entoure la case qui vient après.", es: "Mira cómo cambia cada casilla. Encierra la que sigue.", pt: "Veja como cada quadrinho muda. Circule o que vem depois." }
      : { en: "Look how each box changes. Draw what comes next in the empty box.", fr: "Regarde comment chaque case change. Dessine ce qui vient après dans la case vide.", es: "Mira cómo cambia cada casilla. Dibuja lo que sigue en la casilla vacía.", pt: "Veja como cada quadrinho muda. Desenhe o que vem depois no quadrinho vazio." };
  if (version === "circle")
    return { en: "Say each pattern out loud. Circle the picture that comes next.", fr: "Dis chaque suite à voix haute. Entoure l'image qui vient après.", es: "Di cada serie en voz alta. Encierra el dibujo que sigue.", pt: "Fale cada sequência em voz alta. Circule a figura que vem depois." };
  if (theme === "colours")
    return { en: "Find the pattern. Color the empty balloons with the right color.", fr: "Trouve la règle. Colorie les ballons vides de la bonne couleur.", es: "Descubre la serie. Colorea los globos vacíos del color correcto.", pt: "Descubra a sequência. Pinte os balões vazios com a cor certa." };
  return { en: "Find the pattern. Draw the missing pictures in the empty boxes.", fr: "Trouve la règle. Dessine ce qui manque dans les cases vides.", es: "Descubre la serie. Dibuja lo que falta en las casillas vacías.", pt: "Descubra a sequência. Desenhe o que falta nos quadrinhos vazios." };
}

const THEME_NOUN: Record<PatternTheme, L10n> = {
  fruits: { en: "fruit", fr: "des fruits", es: "frutas", pt: "frutas" },
  animals: { en: "animals", fr: "des animaux", es: "animales", pt: "animais" },
  vehicles: { en: "vehicles", fr: "des véhicules", es: "vehículos", pt: "veículos" },
  food: { en: "food", fr: "des aliments", es: "comida", pt: "comidas" },
  seasons: { en: "weather and season pictures", fr: "des images de la météo et des saisons", es: "dibujos del clima y las estaciones", pt: "figuras do tempo e das estações" },
  shapes: { en: "shapes", fr: "des formes", es: "figuras", pt: "formas" },
  colours: { en: "colored balloons", fr: "des ballons de couleur", es: "globos de colores", pt: "balões coloridos" },
};

function descriptionOf(type: PatternType, theme: PatternTheme, version: PatternVersion): L10n {
  const ex = TYPE_EXAMPLE[type];
  const n = THEME_NOUN[theme];
  const end: L10n =
    version === "circle"
      ? { en: "circle what comes next among three pictures", fr: "entourer ce qui vient après parmi trois images", es: "encerrar lo que sigue entre tres dibujos", pt: "circular o que vem depois entre três figuras" }
      : theme === "colours"
        ? { en: "color the empty balloons to finish each row", fr: "colorier les ballons vides pour finir chaque ligne", es: "colorear los globos vacíos para terminar cada fila", pt: "pintar os balões vazios para terminar cada linha" }
        : { en: "draw the missing pictures in the empty boxes", fr: "dessiner ce qui manque dans les cases vides", es: "dibujar lo que falta en las casillas vacías", pt: "desenhar o que falta nos quadrinhos vazios" };
  return {
    en: `Free printable pattern worksheet with ${n.en}: six rows where ${ex.en} repeat. Say each row aloud, then ${end.en}.`,
    fr: `Fiche gratuite de suites logiques avec ${n.fr} : six lignes où se répètent ${ex.fr}. On dit chaque ligne à voix haute, puis on doit ${end.fr}.`,
    es: `Ficha gratis de series con ${n.es}: seis filas donde se repiten ${ex.es}. Se dice cada fila en voz alta y luego hay que ${end.es}.`,
    pt: `Atividade grátis de sequência lógica com ${n.pt}: seis linhas em que se repetem ${ex.pt}. Fale cada linha em voz alta e depois ${end.pt}.`,
  };
}

const each = <T>(f: (l: keyof L10n) => T): L10n<T> => ({ en: f("en"), fr: f("fr"), es: f("es"), pt: f("pt") });

function sheet(type: PatternType, theme: PatternTheme, version: PatternVersion): PatternsSheet {
  const id = `${type}-${theme}-${version}`;
  return {
    kind: "patterns",
    id,
    slug: each((l) => [PREFIX[l], TYPE_SLUG[type][l], THEME[theme].slug[l], VERSION[version].slug[l]].map(slugify).join("-")),
    title: titleOf(type, theme, version),
    label: each((l) => `${type === "growing" ? cap(TYPE_NAME.growing[l]) : TYPE_NAME[type][l]} · ${THEME[theme].filter[l]} · ${VERSION[version].filter[l]}`),
    description: descriptionOf(type, theme, version),
    instruction: instructionOf(type, theme, version),
    filters: { type, theme, version },
    params: { type, theme, version, rows: rowsFor(type, theme, version, id) },
  };
}

const REPEATING: PatternType[] = ["ab", "aab", "abb", "abc", "aabb"];
const REPEATING_THEMES: PatternTheme[] = ["fruits", "animals", "vehicles", "food", "seasons", "shapes", "colours"];
const GROWING_THEMES: PatternTheme[] = ["fruits", "animals", "food", "shapes", "colours"];

export const patternsSheets: PatternsSheet[] = [
  ...REPEATING.flatMap((type) => REPEATING_THEMES.flatMap((theme) => (["circle", "draw"] as const).map((v) => sheet(type, theme, v)))),
  ...GROWING_THEMES.flatMap((theme) => (["circle", "draw"] as const).map((v) => sheet("growing", theme, v))),
];

/** The name printed under a shape or a balloon ("étoile", "rojo"); none for cartoons. */
export function itemCaption(item: PatternItem, locale: keyof L10n): string | null {
  const [kind, id] = item.split(":");
  if (kind === "shape") return SHAPE_NAMES[id as ShapeId][locale];
  if (kind === "colour") return COLOURS[id as ColourId].name[locale];
  return null;
}

export const patternsKind: SheetKind = {
  id: "patterns",
  slug: { en: "patterns", fr: "suites-logiques", es: "series-y-patrones", pt: "sequencias-logicas" },
  name: { en: "Patterns", fr: "Suites logiques", es: "Series y patrones", pt: "Sequências lógicas" },
  heading: {
    en: "Pattern Worksheets: What Comes Next?",
    fr: "Suites logiques (algorithmes) : fiches à imprimer",
    es: "Series y patrones: fichas para imprimir",
    pt: "Sequências lógicas: atividades para imprimir",
  },
  metaTitle: {
    en: "Pattern Worksheets for Kids | Free Printable PDFs",
    fr: "Suites logiques maternelle : fiches gratuites à imprimer",
    es: "Series y patrones para niños: fichas gratis para imprimir",
    pt: "Sequência lógica para crianças: atividades grátis para imprimir",
  },
  description: {
    en: "80 free printable pattern worksheets: AB, AAB, ABB, ABC, AABB and growing patterns with fruit, animals, vehicles, shapes and colors. Circle what comes next or draw it.",
    fr: "80 fiches gratuites de suites logiques (algorithmes) : AB, AAB, ABB, ABC, AABB et suites qui grandissent, avec des fruits, des animaux, des formes et des couleurs.",
    es: "80 fichas gratis de series: AB, AAB, ABB, ABC, AABB y series que crecen, con frutas, animales, vehículos, figuras y colores. Encierra lo que sigue o dibújalo.",
    pt: "80 atividades grátis de sequência lógica: AB, AAB, ABB, ABC, AABB e sequências crescentes, com frutas, animais, veículos, formas e cores. Circule ou desenhe o que vem depois.",
  },
  intro: {
    en: "Spotting a pattern is an early math skill: the child notices what repeats and predicts what comes next. Each sheet has six rows with one kind of pattern, from the simple AB (apple, banana, apple, banana) to ABC, AABB and growing patterns. Choose the \"circle\" version for the youngest, who pick the answer among three pictures, or the \"draw\" version, with empty boxes to fill in.",
    fr: "Repérer une suite logique (un « algorithme », comme on dit à l'école), c'est voir ce qui se répète et deviner ce qui vient après : une base des mathématiques. Chaque fiche propose six lignes du même type, de la suite AB (pomme, banane, pomme, banane) aux suites ABC, AABB et aux suites qui grandissent. Version « entoure » pour les plus petits, qui choisissent parmi trois images, ou version « dessine », avec des cases vides à compléter.",
    es: "Descubrir una serie es una habilidad temprana de matemáticas: el niño ve qué se repite y adivina qué sigue. Cada ficha tiene seis filas de un mismo tipo de serie, desde la sencilla AB (manzana, pera, manzana, pera) hasta ABC, AABB y series que crecen. Elija la versión «encierra» para los más pequeños, que escogen entre tres dibujos, o la versión «completa», con casillas vacías para dibujar.",
    pt: "Perceber uma sequência é uma habilidade matemática inicial: a criança vê o que se repete e adivinha o que vem depois. Cada atividade tem seis linhas do mesmo tipo de sequência, da simples AB (maçã, pera, maçã, pera) até ABC, AABB e sequências crescentes. Escolha a versão «circule» para os menores, que escolhem entre três figuras, ou a versão «complete», com quadrinhos vazios para desenhar.",
  },
  howTo: {
    en: "Read each row together, naming the pictures in a rhythm (\"apple, banana, apple, banana…\"); the pattern is easier to hear than to see. Ask what comes next before your child circles or draws it. Clapping or tapping the pattern helps too.",
    fr: "Lisez chaque ligne ensemble en nommant les images en rythme (« pomme, banane, pomme, banane… ») : la suite s'entend mieux qu'elle ne se voit. Demandez ce qui vient après avant que l'enfant entoure ou dessine. Taper la suite dans les mains aide aussi.",
    es: "Lean juntos cada fila, nombrando los dibujos con ritmo («manzana, pera, manzana, pera…»): la serie se oye mejor de lo que se ve. Pregunte qué sigue antes de que el niño encierre o dibuje. Aplaudir la serie también ayuda.",
    pt: "Leiam juntos cada linha, falando o nome das figuras com ritmo («maçã, pera, maçã, pera…»): a sequência se ouve melhor do que se vê. Pergunte o que vem depois antes de a criança circular ou desenhar. Bater palmas no ritmo também ajuda.",
  },
  level: {
    en: "Preschool and kindergarten (ages 3–6)",
    fr: "Petite à grande section (3 à 6 ans)",
    es: "Preescolar (3 a 6 años)",
    pt: "Educação infantil (3 a 6 anos)",
  },
  skills: {
    en: ["Patterns", "Logic", "Early math"],
    fr: ["Algorithmes", "Logique", "Premiers pas en maths"],
    es: ["Series", "Lógica", "Iniciación a las matemáticas"],
    pt: ["Sequências", "Lógica", "Iniciação à matemática"],
  },
  filters: [
    {
      key: "type",
      label: { en: "Pattern", fr: "Suite", es: "Serie", pt: "Sequência" },
      options: (["ab", "aab", "abb", "abc", "aabb", "growing"] as const).map((t) => ({ value: t, label: each((l) => cap(TYPE_NAME[t][l])) })),
    },
    {
      key: "theme",
      label: { en: "Theme", fr: "Thème", es: "Tema", pt: "Tema" },
      options: REPEATING_THEMES.map((t) => ({ value: t, label: THEME[t].filter })),
    },
    {
      key: "version",
      label: { en: "Activity", fr: "Activité", es: "Actividad", pt: "Atividade" },
      options: (["circle", "draw"] as const).map((v) => ({ value: v, label: VERSION[v].filter })),
    },
  ],
};
