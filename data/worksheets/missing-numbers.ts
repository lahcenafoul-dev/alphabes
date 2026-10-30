// Missing numbers worksheets: write the numbers that are missing, in six
// layouts (scripts/sheets/missing-numbers-layout.ts):
//   grid        numbers under cartoons, some boxes empty
//   path        a caterpillar or snake whose body segments are numbers
//   chart       the hundred chart (or half of it) with blanks
//   train       carriages pulled by a train, with cartoon passengers
//   skip        counting by 2s, 5s and 10s
//   neighbours  the number before, after or in between
// Blanks are drawn from a random generator seeded with the sheet id, so they
// stay the same from one build to the next.
import { cap, pick, seededRandom, slugify, type L10n, type Sheet, type SheetKind } from "@/lib/sheets/types";

export type MissingNumbersParams =
  | { layout: "grid" | "path" | "train"; start: number; end: number; picture: string; blanks: number[] }
  | { layout: "chart"; start: number; end: number; blanks: number[] }
  | { layout: "skip"; step: number; to: number; picture: string; perGroup: number; rows: { values: number[]; blanks: number[] }[] }
  | { layout: "neighbours"; mode: "before" | "after" | "between"; items: { n: number; picture: string }[] };

export type MissingNumbersSheet = Sheet<MissingNumbersParams>;

type Difficulty = "easy" | "hard";

const DIFFICULTY: Record<Difficulty, L10n> = {
  easy: { en: "easy", fr: "facile", es: "fácil", pt: "fácil" },
  hard: { en: "hard", fr: "difficile", es: "difícil", pt: "difícil" },
};

const range = (a: number, b: number): L10n => ({ en: `${a}–${b}`, fr: `de ${a} à ${b}`, es: `del ${a} al ${b}`, pt: `de ${a} a ${b}` });

/** The "numbers up to" filter: the highest number on the sheet, rounded up to 10, 20, 50 or 100. */
const upTo = (end: number) => String(end <= 10 ? 10 : end <= 20 ? 20 : end <= 50 ? 50 : 100);

const NAME: L10n = { en: "Missing Numbers", fr: "Nombres manquants", es: "Números faltantes", pt: "Números que faltam" };
const PREFIX: L10n = { en: "missing-numbers", fr: "nombres-manquants", es: "numeros-faltantes", pt: "numeros-que-faltam" };

/** `count` numbers of the list left blank, never the first one (the child needs somewhere to start). */
function blanksOf(numbers: number[], ratio: number, rand: () => number): number[] {
  const count = Math.max(1, Math.round(numbers.length * ratio));
  // Never more than three blanks in a row, nor in a group of five (a row of
  // the grid, path or train), so the child always has numbers to count from.
  const blank = new Set<number>();
  const at = (i: number) => blank.has(numbers[i]);
  for (const n of pick(numbers.slice(1), numbers.length - 1, rand)) {
    if (blank.size === count) break;
    const i = numbers.indexOf(n);
    let run = 1;
    for (let j = i - 1; j >= 0 && at(j); j--) run++;
    for (let j = i + 1; j < numbers.length && at(j); j++) run++;
    const group = Math.floor(i / 5) * 5;
    const inGroup = numbers.slice(group, group + 5).filter((m) => blank.has(m)).length;
    if (run <= 3 && inGroup < 3) blank.add(n);
  }
  return [...blank].sort((a, b) => a - b);
}

const numbersFrom = (a: number, b: number) => Array.from({ length: b - a + 1 }, (_, i) => a + i);

function slugOf(parts: L10n<string[]>): L10n {
  return {
    en: [PREFIX.en, ...parts.en].map(slugify).join("-"),
    fr: [PREFIX.fr, ...parts.fr].map(slugify).join("-"),
    es: [PREFIX.es, ...parts.es].map(slugify).join("-"),
    pt: [PREFIX.pt, ...parts.pt].map(slugify).join("-"),
  };
}

const each = <T>(f: (l: keyof L10n) => T): L10n<T> => ({ en: f("en"), fr: f("fr"), es: f("es"), pt: f("pt") });

/** "Missing Numbers 1–10: Apple Grid (easy)". */
function titleOf(r: L10n, what: L10n, diff?: Difficulty): L10n {
  const d = (l: keyof L10n) => (diff ? ` (${DIFFICULTY[diff][l]})` : "");
  return {
    en: `Missing Numbers ${r.en}: ${what.en}${d("en")}`,
    fr: `Nombres manquants ${r.fr} : ${what.fr}${d("fr")}`,
    es: `Números faltantes ${r.es}: ${what.es}${d("es")}`,
    pt: `Números que faltam ${r.pt}: ${what.pt}${d("pt")}`,
  };
}

const RANGES: [number, number][] = [
  [1, 10],
  [1, 20],
  [21, 40],
  [41, 60],
  [61, 80],
  [81, 100],
];

// ------------------------------------------------------------------ grid

type Picture = { key: string; what: L10n; noun: L10n; slug: L10n };

// Two cartoons per range. Spanish names avoid words that change by country
// (docs/spanish-plan.md, D2).
const GRID_PICTURES: Record<string, [Picture, Picture]> = {
  "1-10": [
    { key: "apple", what: { en: "Apple Grid", fr: "grille des pommes", es: "cuadrícula de manzanas", pt: "grade das maçãs" }, noun: { en: "apples", fr: "pommes", es: "manzanas", pt: "maçãs" }, slug: { en: "apple", fr: "pommes", es: "manzanas", pt: "macas" } },
    { key: "bee", what: { en: "Bee Grid", fr: "grille des abeilles", es: "cuadrícula de abejas", pt: "grade das abelhas" }, noun: { en: "bees", fr: "abeilles", es: "abejas", pt: "abelhas" }, slug: { en: "bee", fr: "abeilles", es: "abejas", pt: "abelhas" } },
  ],
  "1-20": [
    { key: "grapes", what: { en: "Grape Grid", fr: "grille des raisins", es: "cuadrícula de uvas", pt: "grade das uvas" }, noun: { en: "grapes", fr: "grappes de raisin", es: "uvas", pt: "uvas" }, slug: { en: "grape", fr: "raisins", es: "uvas", pt: "uvas" } },
    { key: "fish", what: { en: "Fish Grid", fr: "grille des poissons", es: "cuadrícula de peces", pt: "grade dos peixes" }, noun: { en: "fish", fr: "poissons", es: "peces", pt: "peixes" }, slug: { en: "fish", fr: "poissons", es: "peces", pt: "peixes" } },
  ],
  "21-40": [
    { key: "orange", what: { en: "Orange Grid", fr: "grille des oranges", es: "cuadrícula de naranjas", pt: "grade das laranjas" }, noun: { en: "oranges", fr: "oranges", es: "naranjas", pt: "laranjas" }, slug: { en: "orange", fr: "oranges", es: "naranjas", pt: "laranjas" } },
    { key: "turtle", what: { en: "Turtle Grid", fr: "grille des tortues", es: "cuadrícula de tortugas", pt: "grade das tartarugas" }, noun: { en: "turtles", fr: "tortues", es: "tortugas", pt: "tartarugas" }, slug: { en: "turtle", fr: "tortues", es: "tortugas", pt: "tartarugas" } },
  ],
  "41-60": [
    { key: "pear", what: { en: "Pear Grid", fr: "grille des poires", es: "cuadrícula de peras", pt: "grade das peras" }, noun: { en: "pears", fr: "poires", es: "peras", pt: "peras" }, slug: { en: "pear", fr: "poires", es: "peras", pt: "peras" } },
    { key: "frog", what: { en: "Frog Grid", fr: "grille des grenouilles", es: "cuadrícula de ranas", pt: "grade dos sapos" }, noun: { en: "frogs", fr: "grenouilles", es: "ranas", pt: "sapos" }, slug: { en: "frog", fr: "grenouilles", es: "ranas", pt: "sapos" } },
  ],
  "61-80": [
    { key: "cherry", what: { en: "Cherry Grid", fr: "grille des cerises", es: "cuadrícula de cerezas", pt: "grade das cerejas" }, noun: { en: "cherries", fr: "cerises", es: "cerezas", pt: "cerejas" }, slug: { en: "cherry", fr: "cerises", es: "cerezas", pt: "cerejas" } },
    { key: "owl", what: { en: "Owl Grid", fr: "grille des hiboux", es: "cuadrícula de búhos", pt: "grade das corujas" }, noun: { en: "owls", fr: "hiboux", es: "búhos", pt: "corujas" }, slug: { en: "owl", fr: "hiboux", es: "buhos", pt: "corujas" } },
  ],
  "81-100": [
    { key: "watermelon", what: { en: "Watermelon Grid", fr: "grille des pastèques", es: "cuadrícula de sandías", pt: "grade das melancias" }, noun: { en: "watermelons", fr: "pastèques", es: "sandías", pt: "melancias" }, slug: { en: "watermelon", fr: "pasteques", es: "sandias", pt: "melancias" } },
    { key: "butterfly", what: { en: "Butterfly Grid", fr: "grille des papillons", es: "cuadrícula de mariposas", pt: "grade das borboletas" }, noun: { en: "butterflies", fr: "papillons", es: "mariposas", pt: "borboletas" }, slug: { en: "butterfly", fr: "papillons", es: "mariposas", pt: "borboletas" } },
  ],
};

// ------------------------------------------------------------------ path and train

const PATH_HEADS: Picture[] = [
  { key: "caterpillar", what: { en: "Caterpillar Number Path", fr: "la chenille des nombres", es: "la oruga de los números", pt: "a lagarta dos números" }, noun: { en: "caterpillar", fr: "chenille", es: "oruga", pt: "lagarta" }, slug: { en: "caterpillar", fr: "chenille", es: "oruga", pt: "lagarta" } },
  { key: "snake", what: { en: "Snake Number Path", fr: "le serpent des nombres", es: "la serpiente de los números", pt: "a cobra dos números" }, noun: { en: "snake", fr: "serpent", es: "serpiente", pt: "cobra" }, slug: { en: "snake", fr: "serpent", es: "serpiente", pt: "cobra" } },
];

// The counting animals of public/counting/ ride the trains.
const TRAIN_PASSENGERS: Picture[] = [
  { key: "count-1-panda", what: { en: "Number Train with Pandas", fr: "le train des pandas", es: "el tren de los pandas", pt: "o trem dos pandas" }, noun: { en: "pandas", fr: "pandas", es: "pandas", pt: "pandas" }, slug: { en: "pandas", fr: "pandas", es: "pandas", pt: "pandas" } },
  { key: "count-2-penguin", what: { en: "Number Train with Penguins", fr: "le train des pingouins", es: "el tren de los pingüinos", pt: "o trem dos pinguins" }, noun: { en: "penguins", fr: "pingouins", es: "pingüinos", pt: "pinguins" }, slug: { en: "penguins", fr: "pingouins", es: "pinguinos", pt: "pinguins" } },
  { key: "count-5-fox", what: { en: "Number Train with Foxes", fr: "le train des renards", es: "el tren de los zorros", pt: "o trem das raposas" }, noun: { en: "foxes", fr: "renards", es: "zorros", pt: "raposas" }, slug: { en: "foxes", fr: "renards", es: "zorros", pt: "raposas" } },
  { key: "count-7-bunny", what: { en: "Number Train with Bunnies", fr: "le train des lapins", es: "el tren de los conejos", pt: "o trem dos coelhos" }, noun: { en: "bunnies", fr: "lapins", es: "conejos", pt: "coelhos" }, slug: { en: "bunnies", fr: "lapins", es: "conejos", pt: "coelhos" } },
  { key: "count-6-hedgehog", what: { en: "Number Train with Hedgehogs", fr: "le train des hérissons", es: "el tren de los erizos", pt: "o trem dos ouriços" }, noun: { en: "hedgehogs", fr: "hérissons", es: "erizos", pt: "ouriços" }, slug: { en: "hedgehogs", fr: "herissons", es: "erizos", pt: "ouricos" } },
  { key: "count-4-owl", what: { en: "Number Train with Owls", fr: "le train des hiboux", es: "el tren de los búhos", pt: "o trem das corujas" }, noun: { en: "owls", fr: "hiboux", es: "búhos", pt: "corujas" }, slug: { en: "owls", fr: "hiboux", es: "buhos", pt: "corujas" } },
];

const LAYOUT_DESCRIPTION: Record<"grid" | "path" | "train", (p: Picture, a: number, b: number, k: number) => L10n> = {
  grid: (p, a, b, k) => ({
    en: `Free printable missing numbers worksheet: count from ${a} to ${b} under the ${p.noun.en} and write the ${k} missing numbers in the empty boxes.`,
    fr: `Fiche gratuite à imprimer : compter de ${a} à ${b} sous les ${p.noun.fr} et écrire les ${k} nombres qui manquent dans les cases vides.`,
    es: `Ficha gratis para imprimir: contar del ${a} al ${b} debajo de las imágenes de ${p.noun.es} y escribir los ${k} números que faltan en las casillas vacías.`,
    pt: `Atividade grátis para imprimir: contar de ${a} a ${b} embaixo das figuras de ${p.noun.pt} e escrever os ${k} números que faltam nos quadrinhos vazios.`,
  }),
  path: (p, a, b, k) => ({
    en: `Free printable number path: follow the ${p.noun.en} from ${a} to ${b} and fill in the ${k} missing numbers on its body.`,
    fr: `Fiche gratuite à imprimer : suivre le corps ${p.key === "caterpillar" ? "de la" : "du"} ${p.noun.fr} de ${a} à ${b} et écrire les ${k} nombres qui manquent.`,
    es: `Ficha gratis para imprimir: seguir el cuerpo de la ${p.noun.es} del ${a} al ${b} y escribir los ${k} números que faltan.`,
    pt: `Atividade grátis para imprimir: seguir o corpo da ${p.noun.pt} de ${a} a ${b} e escrever os ${k} números que faltam.`,
  }),
  train: (p, a, b, k) => ({
    en: `Free printable number train: the ${p.noun.en} ride carriages numbered ${a} to ${b}. Write the ${k} missing numbers on the carriages.`,
    fr: `Fiche gratuite à imprimer : les ${p.noun.fr} voyagent dans des wagons numérotés de ${a} à ${b}. Écrire les ${k} nombres qui manquent sur les wagons.`,
    es: `Ficha gratis para imprimir: los ${p.noun.es} viajan en vagones numerados del ${a} al ${b}. Escribir los ${k} números que faltan en los vagones.`,
    pt: `Atividade grátis para imprimir: ${p.key === "count-5-fox" || p.key === "count-4-owl" ? "as" : "os"} ${p.noun.pt} viajam em vagões numerados de ${a} a ${b}. Escrever os ${k} números que faltam nos vagões.`,
  }),
};

const INSTRUCTION: Record<string, L10n> = {
  grid: {
    en: "Count along and write the missing numbers in the empty boxes.",
    fr: "Compte et écris les nombres qui manquent dans les cases vides.",
    es: "Cuenta y escribe los números que faltan en las casillas vacías.",
    pt: "Conte e escreva os números que faltam nos quadrinhos vazios.",
  },
  path: {
    en: "Start at the head and follow the body. Write the missing numbers.",
    fr: "Pars de la tête et suis le corps. Écris les nombres qui manquent.",
    es: "Empieza en la cabeza y sigue el cuerpo. Escribe los números que faltan.",
    pt: "Comece pela cabeça e siga o corpo. Escreva os números que faltam.",
  },
  train: {
    en: "Write the missing numbers on the train carriages.",
    fr: "Écris les nombres qui manquent sur les wagons.",
    es: "Escribe los números que faltan en los vagones.",
    pt: "Escreva os números que faltam nos vagões.",
  },
  chart: {
    en: "Fill in the chart: write the missing numbers in the empty squares.",
    fr: "Complète le tableau : écris les nombres qui manquent dans les cases vides.",
    es: "Completa la tabla: escribe los números que faltan en las casillas vacías.",
    pt: "Complete a tabela: escreva os números que faltam nos quadrinhos vazios.",
  },
};

const LAYOUT_SLUG: Record<"grid" | "path" | "train", L10n> = {
  grid: { en: "picture-grid", fr: "grille", es: "cuadricula", pt: "grade" },
  path: { en: "path", fr: "chemin", es: "camino", pt: "caminho" },
  train: { en: "train", fr: "train", es: "tren", pt: "trem" },
};

function rangeSheets(): MissingNumbersSheet[] {
  const out: MissingNumbersSheet[] = [];
  const diffs: Difficulty[] = ["easy", "hard"];
  for (const layout of ["grid", "path", "train"] as const) {
    RANGES.forEach(([a, b], ri) => {
      const pictures = layout === "grid" ? GRID_PICTURES[`${a}-${b}`] : layout === "path" ? [PATH_HEADS[ri % 2]] : [TRAIN_PASSENGERS[ri]];
      for (const p of pictures) {
        for (const diff of diffs) {
          const id = `${layout}-${a}-${b}-${slugify(p.key)}-${diff}`;
          const rand = seededRandom(id);
          const blanks = blanksOf(numbersFrom(a, b), diff === "easy" ? 0.3 : 0.6, rand);
          const r = range(a, b);
          const title = titleOf(r, p.what, diff);
          out.push({
            kind: "missing-numbers",
            id,
            slug: slugOf(each((l) => [`${a}-${b}`, LAYOUT_SLUG[layout][l], p.slug[l], DIFFICULTY[diff][l]])),
            title,
            label: each((l) => `${cap(p.what[l])} ${r[l]} (${DIFFICULTY[diff][l]})`),
            description: LAYOUT_DESCRIPTION[layout](p, a, b, blanks.length),
            instruction: INSTRUCTION[layout],
            filters: { upTo: upTo(b), layout, difficulty: diff },
            params: { layout, start: a, end: b, picture: p.key, blanks },
          });
        }
      }
    });
  }
  return out;
}

// ------------------------------------------------------------------ hundred chart

type ChartVariant = { id: string; start: number; end: number; diff: Difficulty; what: L10n; slug: L10n; blanks: (rand: () => number) => number[]; about: L10n };

const chartNumbers = (a: number, b: number) => numbersFrom(a, b);

const CHART_VARIANTS: ChartVariant[] = [
  {
    id: "easy",
    start: 1,
    end: 100,
    diff: "easy",
    what: { en: "Hundred Chart", fr: "tableau des nombres jusqu'à 100", es: "tabla del 1 al 100", pt: "tabela até 100" },
    slug: { en: "hundred-chart", fr: "tableau", es: "tabla", pt: "tabela" },
    blanks: (rand) => blanksOf(chartNumbers(1, 100), 0.25, rand),
    about: { en: "25 numbers are missing here and there", fr: "25 nombres manquent, un peu partout", es: "faltan 25 números, aquí y allá", pt: "faltam 25 números, aqui e ali" },
  },
  {
    id: "hard",
    start: 1,
    end: 100,
    diff: "hard",
    what: { en: "Hundred Chart", fr: "tableau des nombres jusqu'à 100", es: "tabla del 1 al 100", pt: "tabela até 100" },
    slug: { en: "hundred-chart", fr: "tableau", es: "tabla", pt: "tabela" },
    blanks: (rand) => blanksOf(chartNumbers(1, 100), 0.55, rand),
    about: { en: "more than half of the numbers are missing", fr: "plus de la moitié des nombres manquent", es: "falta más de la mitad de los números", pt: "falta mais da metade dos números" },
  },
  {
    id: "columns",
    start: 1,
    end: 100,
    diff: "hard",
    what: { en: "Hundred Chart with Missing Columns", fr: "tableau jusqu'à 100, colonnes à compléter", es: "tabla del 1 al 100 con columnas vacías", pt: "tabela até 100 com colunas vazias" },
    slug: { en: "hundred-chart-columns", fr: "tableau-colonnes", es: "tabla-columnas", pt: "tabela-colunas" },
    blanks: () => chartNumbers(1, 100).filter((n) => [2, 5, 8].includes(n % 10)),
    about: { en: "three whole columns are empty: the numbers ending in 2, 5 and 8", fr: "trois colonnes entières sont vides : les nombres qui finissent par 2, 5 et 8", es: "tres columnas enteras están vacías: los números que terminan en 2, 5 y 8", pt: "três colunas inteiras estão vazias: os números que terminam em 2, 5 e 8" },
  },
  {
    id: "rows",
    start: 1,
    end: 100,
    diff: "hard",
    what: { en: "Hundred Chart with Missing Rows", fr: "tableau jusqu'à 100, lignes à compléter", es: "tabla del 1 al 100 con filas vacías", pt: "tabela até 100 com linhas vazias" },
    slug: { en: "hundred-chart-rows", fr: "tableau-lignes", es: "tabla-filas", pt: "tabela-linhas" },
    blanks: () => chartNumbers(1, 100).filter((n) => [2, 5, 8].includes(Math.floor((n - 1) / 10))),
    about: { en: "three whole rows are empty: 21 to 30, 51 to 60 and 81 to 90", fr: "trois lignes entières sont vides : de 21 à 30, de 51 à 60 et de 81 à 90", es: "tres filas enteras están vacías: del 21 al 30, del 51 al 60 y del 81 al 90", pt: "três linhas inteiras estão vazias: de 21 a 30, de 51 a 60 e de 81 a 90" },
  },
  {
    id: "diagonals",
    start: 1,
    end: 100,
    diff: "hard",
    what: { en: "Hundred Chart with a Big X", fr: "tableau jusqu'à 100, le grand X", es: "tabla del 1 al 100 con una gran X", pt: "tabela até 100 com um grande X" },
    slug: { en: "hundred-chart-x", fr: "tableau-grand-x", es: "tabla-gran-x", pt: "tabela-grande-x" },
    blanks: () => chartNumbers(1, 100).filter((n) => {
      const r = Math.floor((n - 1) / 10);
      const c = (n - 1) % 10;
      return c === r || c === 9 - r;
    }),
    about: { en: "the empty squares make a big X across the chart", fr: "les cases vides dessinent un grand X dans le tableau", es: "las casillas vacías forman una gran X en la tabla", pt: "os quadrinhos vazios formam um grande X na tabela" },
  },
  {
    id: "evens",
    start: 1,
    end: 100,
    diff: "hard",
    what: { en: "Hundred Chart, Even Numbers Missing", fr: "tableau jusqu'à 100, les nombres pairs", es: "tabla del 1 al 100, los números pares", pt: "tabela até 100, os números pares" },
    slug: { en: "hundred-chart-even-numbers", fr: "tableau-nombres-pairs", es: "tabla-numeros-pares", pt: "tabela-numeros-pares" },
    blanks: () => chartNumbers(1, 100).filter((n) => n % 2 === 0),
    about: { en: "every even number is missing, so the child counts by 2s", fr: "tous les nombres pairs manquent : on compte de 2 en 2", es: "faltan todos los números pares: se cuenta de 2 en 2", pt: "faltam todos os números pares: conta-se de 2 em 2" },
  },
  ...([
    [1, 50],
    [51, 100],
  ] as const).flatMap(([a, b]) =>
    (["easy", "hard"] as const).map((diff): ChartVariant => ({
      id: `half-${a}-${b}-${diff}`,
      start: a,
      end: b,
      diff,
      what: { en: `Number Chart`, fr: `tableau des nombres`, es: `tabla de números`, pt: `tabela de números` },
      slug: { en: "number-chart", fr: "tableau", es: "tabla", pt: "tabela" },
      blanks: (rand) => blanksOf(chartNumbers(a, b), diff === "easy" ? 0.25 : 0.55, rand),
      about: diff === "easy"
        ? { en: "a quarter of the numbers are missing", fr: "un quart des nombres manquent", es: "falta la cuarta parte de los números", pt: "falta a quarta parte dos números" }
        : { en: "more than half of the numbers are missing", fr: "plus de la moitié des nombres manquent", es: "falta más de la mitad de los números", pt: "falta mais da metade dos números" },
    })),
  ),
];

function chartSheets(): MissingNumbersSheet[] {
  return CHART_VARIANTS.map((v) => {
    const id = `chart-${v.id}`;
    const blanks = v.blanks(seededRandom(id));
    const r = range(v.start, v.end);
    const special = !["easy", "hard"].includes(v.id) && !v.id.startsWith("half");
    const title = titleOf(r, v.what, special ? undefined : v.diff);
    return {
      kind: "missing-numbers" as const,
      id,
      slug: slugOf(each((l) => [`${v.start}-${v.end}`, v.slug[l], ...(special ? [] : [DIFFICULTY[v.diff][l]])])),
      title,
      label: each((l) => `${cap(v.what[l])} ${r[l]}${special ? "" : ` (${DIFFICULTY[v.diff][l]})`}`),
      description: {
        en: `Free printable number chart from ${v.start} to ${v.end}: ${v.about.en}. Write them in to practice counting and place value.`,
        fr: `Tableau des nombres de ${v.start} à ${v.end} à imprimer gratuitement : ${v.about.fr}. On les écrit pour s'entraîner à compter et à repérer les dizaines.`,
        es: `Tabla de números del ${v.start} al ${v.end} gratis para imprimir: ${v.about.es}. Se escriben para practicar el conteo y las decenas.`,
        pt: `Tabela de números de ${v.start} a ${v.end} grátis para imprimir: ${v.about.pt}. Escreva-os para praticar a contagem e as dezenas.`,
      },
      instruction: INSTRUCTION.chart,
      filters: { upTo: upTo(v.end), layout: "chart", difficulty: v.diff },
      params: { layout: "chart" as const, start: v.start, end: v.end, blanks },
    };
  });
}

// ------------------------------------------------------------------ skip counting

const SKIPS: { step: number; to: number; picture: string; perGroup: number }[] = [
  { step: 2, to: 20, picture: "sock", perGroup: 2 },
  { step: 2, to: 40, picture: "shoe", perGroup: 2 },
  { step: 5, to: 50, picture: "hand", perGroup: 1 },
  { step: 5, to: 100, picture: "star", perGroup: 5 },
  { step: 10, to: 100, picture: "hand", perGroup: 2 },
];

function skipSheets(): MissingNumbersSheet[] {
  const out: MissingNumbersSheet[] = [];
  for (const s of SKIPS) {
    for (const diff of ["easy", "hard"] as const) {
      const id = `skip-${s.step}-${s.to}-${diff}`;
      const rand = seededRandom(id);
      const values = numbersFrom(1, s.to / s.step).map((i) => i * s.step);
      // Rows of 10; a short sequence is practised several times, with more
      // blanks each time.
      const chunks: number[][] = [];
      for (let i = 0; i < values.length; i += 10) chunks.push(values.slice(i, i + 10));
      const rows: { values: number[]; blanks: number[] }[] = [];
      const total = 6;
      for (let r = 0; r < total; r++) {
        const row = chunks[r % chunks.length];
        const base = diff === "easy" ? 0.2 : 0.4;
        const ratio = base + (r / (total - 1)) * 0.3;
        rows.push({ values: row, blanks: blanksOf(row, ratio, rand) });
      }
      const k = rows.reduce((n, r) => n + r.blanks.length, 0);
      const what: L10n = {
        en: `Count by ${s.step}s to ${s.to}`,
        fr: `compter de ${s.step} en ${s.step} jusqu'à ${s.to}`,
        es: `contar de ${s.step} en ${s.step} hasta ${s.to}`,
        pt: `contar de ${s.step} em ${s.step} até ${s.to}`,
      };
      out.push({
        kind: "missing-numbers",
        id,
        slug: slugOf(each((l) => [{ en: `count-by-${s.step}s`, fr: `de-${s.step}-en-${s.step}`, es: `de-${s.step}-en-${s.step}`, pt: `de-${s.step}-em-${s.step}` }[l], { en: "to", fr: "jusqu-a", es: "hasta", pt: "ate" }[l], String(s.to), DIFFICULTY[diff][l]])),
        title: {
          en: `Skip Counting by ${s.step}s to ${s.to}: Missing Numbers (${DIFFICULTY[diff].en})`,
          fr: `Compter de ${s.step} en ${s.step} jusqu'à ${s.to} : nombres manquants (${DIFFICULTY[diff].fr})`,
          es: `Contar de ${s.step} en ${s.step} hasta ${s.to}: números faltantes (${DIFFICULTY[diff].es})`,
          pt: `Contar de ${s.step} em ${s.step} até ${s.to}: números que faltam (${DIFFICULTY[diff].pt})`,
        },
        label: each((l) => `${cap(what[l])} (${DIFFICULTY[diff][l]})`),
        description: {
          en: `Free printable skip counting worksheet: count by ${s.step}s up to ${s.to} with a picture helper, then write the ${k} missing numbers in six rows.`,
          fr: `Fiche gratuite à imprimer : compter de ${s.step} en ${s.step} jusqu'à ${s.to} avec des images pour aider, puis écrire les ${k} nombres qui manquent sur six lignes.`,
          es: `Ficha gratis para imprimir: contar de ${s.step} en ${s.step} hasta ${s.to} con dibujos de ayuda y escribir los ${k} números que faltan en seis filas.`,
          pt: `Atividade grátis para imprimir: contar de ${s.step} em ${s.step} até ${s.to} com figuras de ajuda e escrever os ${k} números que faltam em seis linhas.`,
        },
        instruction: {
          en: `Count by ${s.step}s. Write the missing numbers.`,
          fr: `Compte de ${s.step} en ${s.step}. Écris les nombres qui manquent.`,
          es: `Cuenta de ${s.step} en ${s.step}. Escribe los números que faltan.`,
          pt: `Conte de ${s.step} em ${s.step}. Escreva os números que faltam.`,
        },
        filters: { upTo: upTo(s.to), layout: "skip", difficulty: diff },
        params: { layout: "skip", step: s.step, to: s.to, picture: s.picture, perGroup: s.perGroup, rows },
      });
    }
  }
  return out;
}

// ------------------------------------------------------------------ before, after, between

const NEIGHBOUR_PICTURES = ["ladybug", "bee", "fish", "frog", "owl", "turtle", "butterfly", "snail", "duck", "chick", "cat", "dog", "rabbit", "fox", "penguin", "bear"];

const NEIGHBOUR_MODES: Record<"before" | "after" | "between", { what: L10n; slug: L10n; instruction: L10n; about: L10n }> = {
  before: {
    what: { en: "What Comes Before?", fr: "le nombre qui vient avant", es: "el antecesor", pt: "o antecessor" },
    slug: { en: "number-before", fr: "nombre-avant", es: "antecesor", pt: "antecessor" },
    instruction: { en: "Write the number that comes just before.", fr: "Écris le nombre qui vient juste avant.", es: "Escribe el número que va justo antes.", pt: "Escreva o número que vem logo antes." },
    about: { en: "the number that comes just before", fr: "le nombre qui vient juste avant", es: "el número que va justo antes (el antecesor)", pt: "o número que vem logo antes (o antecessor)" },
  },
  after: {
    what: { en: "What Comes After?", fr: "le nombre qui vient après", es: "el sucesor", pt: "o sucessor" },
    slug: { en: "number-after", fr: "nombre-apres", es: "sucesor", pt: "sucessor" },
    instruction: { en: "Write the number that comes just after.", fr: "Écris le nombre qui vient juste après.", es: "Escribe el número que va justo después.", pt: "Escreva o número que vem logo depois." },
    about: { en: "the number that comes just after", fr: "le nombre qui vient juste après", es: "el número que va justo después (el sucesor)", pt: "o número que vem logo depois (o sucessor)" },
  },
  between: {
    what: { en: "What Number Is Between?", fr: "le nombre du milieu", es: "el número de en medio", pt: "o número do meio" },
    slug: { en: "number-between", fr: "nombre-du-milieu", es: "numero-de-en-medio", pt: "numero-do-meio" },
    instruction: { en: "Write the number that goes in the middle.", fr: "Écris le nombre qui va au milieu.", es: "Escribe el número que va en medio.", pt: "Escreva o número que fica no meio." },
    about: { en: "the number that goes between two others", fr: "le nombre qui se trouve entre deux autres", es: "el número que va entre otros dos", pt: "o número que fica entre outros dois" },
  },
};

const NEIGHBOUR_RANGES: [number, number, Difficulty][] = [
  [1, 10, "easy"],
  [1, 20, "easy"],
  [21, 50, "hard"],
  [51, 100, "hard"],
];

function neighbourSheets(): MissingNumbersSheet[] {
  const out: MissingNumbersSheet[] = [];
  for (const mode of ["before", "after", "between"] as const) {
    for (const [a, b, diff] of NEIGHBOUR_RANGES) {
      const id = `neighbours-${mode}-${a}-${b}`;
      const rand = seededRandom(id);
      // The shown number(s) and the answer all stay within the range.
      const lo = mode === "after" ? a : a + 1;
      const hi = mode === "before" ? b : b - 1;
      const count = Math.min(10, hi - lo + 1);
      const ns = pick(numbersFrom(lo, hi), count, rand);
      const pictures = pick(NEIGHBOUR_PICTURES, count, rand);
      const m = NEIGHBOUR_MODES[mode];
      const r = range(a, b);
      out.push({
        kind: "missing-numbers",
        id,
        slug: slugOf(each((l) => [`${a}-${b}`, m.slug[l]])),
        title: titleOf(r, { en: m.what.en, fr: m.what.fr, es: m.what.es, pt: m.what.pt }),
        label: each((l) => `${cap(m.what[l])} ${r[l]}`),
        description: {
          en: `Free printable number worksheet: ${count} cute animals each hold a number from ${a} to ${b}. Write ${m.about.en}.`,
          fr: `Fiche gratuite à imprimer : ${count} animaux montrent chacun un nombre de ${a} à ${b}. Écrire ${m.about.fr}.`,
          es: `Ficha gratis para imprimir: ${count} animalitos muestran un número del ${a} al ${b}. Escribir ${m.about.es}.`,
          pt: `Atividade grátis para imprimir: ${count} bichinhos mostram um número de ${a} a ${b}. Escrever ${m.about.pt}.`,
        },
        instruction: m.instruction,
        filters: { upTo: upTo(b), layout: "neighbours", difficulty: diff },
        params: { layout: "neighbours", mode, items: ns.map((n, i) => ({ n, picture: pictures[i] })) },
      });
    }
  }
  return out;
}

// ------------------------------------------------------------------ the type

export const missingNumbersSheets: MissingNumbersSheet[] = [...rangeSheets(), ...chartSheets(), ...skipSheets(), ...neighbourSheets()];

export const missingNumbersKind: SheetKind = {
  id: "missing-numbers",
  slug: PREFIX,
  name: NAME,
  heading: {
    en: "Missing Numbers Worksheets",
    fr: "Nombres manquants : fiches à imprimer",
    es: "Números faltantes: fichas para imprimir",
    pt: "Números que faltam: atividades para imprimir",
  },
  metaTitle: {
    en: "Missing Numbers Worksheets 1–100 | Free Printable PDFs",
    fr: "Nombres manquants de 1 à 100 : fiches gratuites à imprimer",
    es: "Números faltantes del 1 al 100: fichas gratis para imprimir",
    pt: "Números que faltam de 1 a 100: atividades grátis para imprimir",
  },
  description: {
    en: "80 free printable missing numbers worksheets from 1 to 100: picture grids, number paths, trains, hundred charts, skip counting and before, after and between.",
    fr: "80 fiches gratuites de nombres manquants de 1 à 100 : grilles illustrées, chenilles, trains, tableaux des nombres, compter de 2 en 2, avant, après et entre.",
    es: "80 fichas gratis de números faltantes del 1 al 100: cuadrículas con dibujos, orugas, trenes, tablas del 100, conteo de 2 en 2, antecesor y sucesor.",
    pt: "80 atividades grátis de números que faltam de 1 a 100: grades com figuras, lagartas, trens, tabelas até 100, contagem de 2 em 2, antecessor e sucessor.",
  },
  intro: {
    en: "Counting is easier when there is something to count. On these sheets the numbers sit under fruit and animals, ride a train, or make up the body of a caterpillar, and a few of them are missing. Start with 1 to 10, then work up to the hundred chart and to counting by 2s, 5s and 10s. Each layout comes in an easy version (fewer blanks) and a hard one.",
    fr: "Compter, c'est plus facile quand il y a quelque chose à compter. Sur ces fiches, les nombres se cachent sous des fruits et des animaux, voyagent en train ou forment le corps d'une chenille, et il en manque quelques-uns. On commence de 1 à 10, puis on va jusqu'au tableau des nombres et au comptage de 2 en 2, de 5 en 5 et de 10 en 10. Chaque modèle existe en version facile (peu de cases vides) et difficile.",
    es: "Contar es más fácil cuando hay algo que contar. En estas fichas los números están debajo de frutas y animales, viajan en tren o forman el cuerpo de una oruga, y faltan algunos. Se empieza del 1 al 10 y se llega a la tabla del 100 y al conteo de 2 en 2, de 5 en 5 y de 10 en 10. Cada modelo tiene una versión fácil (pocas casillas vacías) y una difícil.",
    pt: "Contar fica mais fácil quando há algo para contar. Nestas atividades os números ficam embaixo de frutas e bichinhos, viajam de trem ou formam o corpo de uma lagarta, e alguns estão faltando. Comece de 1 a 10 e chegue até a tabela até 100 e à contagem de 2 em 2, de 5 em 5 e de 10 em 10. Cada modelo tem uma versão fácil (poucos quadrinhos vazios) e uma difícil.",
  },
  howTo: {
    en: "Let your child count aloud from the first number, pointing at each box, and write the missing number when they reach an empty one. If they get stuck, count back from a number they know. When the easy sheet goes smoothly, try the hard version of the same range.",
    fr: "Laissez l'enfant compter à voix haute depuis le premier nombre en montrant chaque case, et écrire le nombre quand il arrive à une case vide. S'il bloque, repartez d'un nombre qu'il connaît. Quand la version facile se passe bien, passez à la version difficile du même modèle.",
    es: "Deje que el niño cuente en voz alta desde el primer número, señalando cada casilla, y escriba el número cuando llegue a una vacía. Si se traba, vuelvan a contar desde un número que conozca. Cuando la versión fácil salga bien, pasen a la difícil del mismo modelo.",
    pt: "Deixe a criança contar em voz alta a partir do primeiro número, apontando cada quadrinho, e escrever o número quando chegar a um vazio. Se ela travar, recomecem de um número que ela conhece. Quando a versão fácil estiver tranquila, passem para a difícil do mesmo modelo.",
  },
  level: {
    en: "Preschool to 1st grade (ages 4–7)",
    fr: "Moyenne section au CP (4 à 7 ans)",
    es: "Preescolar a primer grado (4 a 7 años)",
    pt: "Educação infantil ao 1º ano (4 a 7 anos)",
  },
  skills: {
    en: ["Counting", "Number order", "Writing numbers"],
    fr: ["Compter", "Suite des nombres", "Écrire les nombres"],
    es: ["Contar", "Orden de los números", "Escribir números"],
    pt: ["Contar", "Sequência numérica", "Escrever números"],
  },
  filters: [
    {
      key: "upTo",
      label: { en: "Numbers up to", fr: "Nombres jusqu'à", es: "Números hasta", pt: "Números até" },
      options: ["10", "20", "50", "100"].map((v) => ({ value: v, label: { en: v, fr: v, es: v, pt: v } })),
    },
    {
      key: "layout",
      label: { en: "Layout", fr: "Modèle", es: "Modelo", pt: "Modelo" },
      options: [
        { value: "grid", label: { en: "Picture grid", fr: "Grille illustrée", es: "Cuadrícula", pt: "Grade com figuras" } },
        { value: "path", label: { en: "Number path", fr: "Chemin des nombres", es: "Camino de números", pt: "Caminho dos números" } },
        { value: "train", label: { en: "Train", fr: "Train", es: "Tren", pt: "Trem" } },
        { value: "chart", label: { en: "Hundred chart", fr: "Tableau des nombres", es: "Tabla del 100", pt: "Tabela até 100" } },
        { value: "skip", label: { en: "Skip counting", fr: "Compter par 2, 5, 10", es: "Contar de 2, 5 y 10", pt: "Contar de 2, 5 e 10" } },
        { value: "neighbours", label: { en: "Before, after, between", fr: "Avant, après, entre", es: "Antecesor y sucesor", pt: "Antecessor e sucessor" } },
      ],
    },
    {
      key: "difficulty",
      label: { en: "Difficulty", fr: "Niveau", es: "Nivel", pt: "Nível" },
      options: (["easy", "hard"] as const).map((d) => ({ value: d, label: each((l) => cap(DIFFICULTY[d][l])) })),
    },
  ],
};
