// Tracing Lines sheets (scripts/sheets/tracing-layout.ts): pre-writing
// practice before letters (the letter tracing pages are elsewhere).
//   lines     8 sheets: straight, slanted, zigzag, wavy, loops, curves,
//             spirals, mountains; each row goes from a cartoon to its goal
//             (the maze stories), the dots further apart in three levels
//   pictures  the 30 phase 2 drawings (data/worksheets/drawings.ts) as dashed
//             lines, with the coloured picture in the corner
//   shapes    circle, square, triangle, star, heart, big to small
import { slugify, type L10n, type Sheet, type SheetKind } from "@/lib/sheets/types";
import { DRAWINGS } from "./drawings";
import { STORIES } from "./mazes";
import { SHAPE_NAMES } from "./vocab";

export type LineType = "straight" | "slanted" | "zigzag" | "wavy" | "loops" | "curves" | "spirals" | "mountains";
export type TraceShape = "circle" | "square" | "triangle" | "star" | "heart";
export type TracingGroup = "lines" | "pictures" | "shapes";

export type TracingParams =
  | { group: "lines"; line: LineType; rows: [string, string][] }
  | { group: "pictures"; drawing: string }
  | { group: "shapes"; shape: TraceShape };
export type TracingSheet = Sheet<TracingParams>;

const LINES: Record<LineType, { name: L10n; title: L10n }> = {
  straight: {
    name: { en: "straight lines", fr: "lignes droites", es: "líneas rectas", pt: "linhas retas" },
    title: { en: "Straight Lines", fr: "les lignes droites", es: "líneas rectas", pt: "linhas retas" },
  },
  slanted: {
    name: { en: "slanted lines", fr: "lignes obliques", es: "líneas inclinadas", pt: "linhas inclinadas" },
    title: { en: "Slanted Lines", fr: "les lignes obliques", es: "líneas inclinadas", pt: "linhas inclinadas" },
  },
  zigzag: {
    name: { en: "zigzag lines", fr: "zigzags", es: "líneas en zigzag", pt: "linhas em zigue-zague" },
    title: { en: "Zigzag Lines", fr: "les zigzags", es: "líneas en zigzag", pt: "linhas em zigue-zague" },
  },
  wavy: {
    name: { en: "wavy lines", fr: "vagues", es: "líneas onduladas", pt: "linhas onduladas" },
    title: { en: "Wavy Lines", fr: "les vagues", es: "líneas onduladas", pt: "linhas onduladas" },
  },
  loops: {
    name: { en: "loops", fr: "boucles", es: "bucles", pt: "laços" },
    title: { en: "Loops", fr: "les boucles", es: "bucles", pt: "laços" },
  },
  curves: {
    name: { en: "curves", fr: "ponts", es: "curvas", pt: "curvas" },
    title: { en: "Curves", fr: "les ponts", es: "curvas", pt: "curvas" },
  },
  spirals: {
    name: { en: "spirals", fr: "spirales", es: "espirales", pt: "espirais" },
    title: { en: "Spirals", fr: "les spirales", es: "espirales", pt: "espirais" },
  },
  mountains: {
    name: { en: "mountains", fr: "montagnes", es: "montañas", pt: "montanhas" },
    title: { en: "Mountains", fr: "les montagnes", es: "montañas", pt: "montanhas" },
  },
};

const LINE_ORDER = Object.keys(LINES) as LineType[];
export const TRACE_SHAPES: TraceShape[] = ["circle", "square", "triangle", "star", "heart"];

const GROUPS: Record<TracingGroup, L10n> = {
  lines: { en: "Lines", fr: "Lignes", es: "Líneas", pt: "Linhas" },
  pictures: { en: "Pictures", fr: "Dessins", es: "Dibujos", pt: "Desenhos" },
  shapes: { en: "Shapes", fr: "Formes", es: "Formas", pt: "Formas" },
};

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
const capWords = (s: string) => s.split(" ").map(cap).join(" ");

/** Rows per line sheet: two at each dot spacing. */
export const LINE_ROWS = 6;

function lineSheet(line: LineType, i: number): TracingSheet {
  const { name, title } = LINES[line];
  // Each sheet starts further along the stories, so neighbours differ.
  const rows = Array.from({ length: LINE_ROWS }, (_, k) => {
    const s = STORIES[(i * 5 + k) % STORIES.length];
    return [s.from.picture, s.to.picture] as [string, string];
  });
  const spiral = line === "spirals";
  return {
    kind: "tracing-lines",
    id: `lines-${line}`,
    slug: {
      en: `tracing-${slugify(name.en)}`,
      fr: `graphisme-${slugify(name.fr)}`,
      es: `trazos-${slugify(name.es)}`,
      pt: `tracados-${slugify(name.pt)}`,
    },
    title: {
      en: `Tracing ${title.en}`,
      fr: `Graphisme : ${title.fr}`,
      es: `Trazos: ${title.es}`,
      pt: `Traçados: ${title.pt}`,
    },
    label: { en: cap(name.en), fr: cap(name.fr), es: cap(name.es), pt: cap(name.pt) },
    description: {
      en: `Free printable pre-writing sheet: trace ${name.en} from each cartoon to its friend, with dots that get further apart in three levels.`,
      fr: `Fiche de graphisme gratuite à imprimer : les ${name.fr}, d'un personnage à son ami, avec des points de plus en plus espacés.`,
      es: `Ficha de trazos gratis para imprimir: ${name.es} de cada personaje a su amigo, con puntos cada vez más separados.`,
      pt: `Atividade de traçado grátis para imprimir: ${name.pt} de cada personagem até o amigo, com pontinhos cada vez mais separados.`,
    },
    instruction: spiral
      ? {
          en: "Start at each picture and trace the spiral to the middle.",
          fr: "Pars de chaque image et repasse la spirale jusqu'au milieu.",
          es: "Empieza en cada dibujo y repasa la espiral hasta el centro.",
          pt: "Comece em cada figura e cubra a espiral até o meio.",
        }
      : {
          en: "Trace each line from the picture to its friend. The dots get further apart as you go down.",
          fr: "Repasse chaque ligne, de l'image jusqu'à son ami. Plus tu descends, plus les points s'écartent.",
          es: "Repasa cada línea del dibujo hasta su amigo. Cuanto más bajas, más separados están los puntos.",
          pt: "Cubra cada linha da figura até o amigo dela. Quanto mais para baixo, mais separados ficam os pontinhos.",
        },
    filters: { group: "lines" },
    params: { group: "lines", line, rows },
  };
}

function pictureSheet(id: string): TracingSheet {
  const d = DRAWINGS.find((x) => x.id === id)!;
  return {
    kind: "tracing-lines",
    id: `picture-${id}`,
    slug: {
      en: `picture-tracing-${slugify(d.name.en)}`,
      fr: `repasse-le-dessin-${slugify(d.name.fr)}`,
      es: `repasa-el-dibujo-${slugify(d.name.es)}`,
      pt: `cubra-o-desenho-${slugify(d.name.pt)}`,
    },
    title: {
      en: `Picture Tracing: ${capWords(d.name.en)}`,
      fr: `Repasse le dessin : ${d.the.fr}`,
      es: `Repasa el dibujo: ${d.the.es}`,
      pt: `Cubra o desenho: ${d.the.pt}`,
    },
    label: { en: capWords(d.name.en), fr: cap(d.name.fr), es: cap(d.name.es), pt: cap(d.name.pt) },
    description: {
      en: `Free printable picture tracing sheet: trace ${d.the.en} on the dashed lines, big then small, and colour it like the model.`,
      fr: `Fiche gratuite à imprimer : repasse ${d.the.fr} sur les pointillés, en grand puis en petit, et colorie-le comme le modèle.`,
      es: `Ficha gratis para imprimir: repasa ${d.the.es} por las líneas de puntos, en grande y en pequeño, y coloréalo como el modelo.`,
      pt: `Atividade grátis para imprimir: cubra ${d.the.pt} nas linhas tracejadas, grande e pequeno, e pinte como o modelo.`,
    },
    instruction: {
      en: "Trace the dashed lines with your pencil. Then colour your pictures like the one in the corner.",
      fr: "Repasse les pointillés avec ton crayon. Puis colorie tes dessins comme le modèle dans le coin.",
      es: "Repasa las líneas de puntos con tu lápiz. Luego colorea tus dibujos como el modelo de la esquina.",
      pt: "Cubra as linhas tracejadas com o lápis. Depois pinte seus desenhos como o modelo do canto.",
    },
    filters: { group: "pictures" },
    params: { group: "pictures", drawing: id },
  };
}

function shapeSheet(shape: TraceShape): TracingSheet {
  const n = SHAPE_NAMES[shape];
  return {
    kind: "tracing-lines",
    id: `shape-${shape}`,
    slug: {
      en: `shape-tracing-${slugify(n.en)}`,
      fr: `tracer-les-formes-${slugify(n.fr)}`,
      es: `trazar-figuras-${slugify(n.es)}`,
      pt: `tracar-formas-${slugify(n.pt)}`,
    },
    title: {
      en: `Shape Tracing: ${cap(n.en)}`,
      fr: `Tracer les formes : le ${n.fr}`.replace("le étoile", "l'étoile"),
      es: `Trazar figuras: el ${n.es}`.replace("el estrella", "la estrella"),
      pt: `Traçar formas: o ${n.pt}`.replace("o estrela", "a estrela"),
    },
    label: { en: cap(n.en), fr: cap(n.fr), es: cap(n.es), pt: cap(n.pt) },
    description: {
      en: `Free printable shape tracing sheet: trace the ${n.en}, from big to small, starting at the green dot.`,
      fr: `Fiche gratuite à imprimer pour tracer la forme ${n.fr}, du plus grand au plus petit, en partant du point vert.`,
      es: `Ficha gratis para imprimir para trazar la figura ${n.es}, de la más grande a la más pequeña, desde el punto verde.`,
      pt: `Atividade grátis para imprimir para traçar a forma ${n.pt}, da maior para a menor, a partir do ponto verde.`,
    },
    instruction: {
      en: "Start at the green dot and trace each shape. Then colour them in.",
      fr: "Pars du point vert et repasse chaque forme. Puis colorie-les.",
      es: "Empieza en el punto verde y repasa cada figura. Luego coloréalas.",
      pt: "Comece no ponto verde e cubra cada forma. Depois pinte todas.",
    },
    filters: { group: "shapes" },
    params: { group: "shapes", shape },
  };
}

export const tracingSheets: TracingSheet[] = [
  ...LINE_ORDER.map(lineSheet),
  ...DRAWINGS.map((d) => pictureSheet(d.id)),
  ...TRACE_SHAPES.map(shapeSheet),
];

export const tracingKind: SheetKind = {
  id: "tracing-lines",
  slug: { en: "tracing-lines", fr: "graphisme", es: "trazos", pt: "tracados" },
  name: { en: "Tracing Lines", fr: "Graphisme", es: "Trazos", pt: "Traçados" },
  heading: {
    en: "Tracing Lines for Preschool: Free Pre-Writing Worksheets",
    fr: "Fiches de graphisme pour la maternelle",
    es: "Fichas de trazos para preescolar",
    pt: "Atividades de traçado para a educação infantil",
  },
  metaTitle: {
    en: "Tracing Lines Worksheets: Pre-Writing Practice | Free PDFs",
    fr: "Fiches de graphisme maternelle : lignes, formes et dessins",
    es: "Fichas de trazos para preescolar: líneas, figuras y dibujos",
    pt: "Atividades de traçado: linhas, formas e desenhos grátis",
  },
  description: {
    en: "Free printable tracing sheets before writing letters: straight, zigzag, wavy and looped lines, shapes and pictures to trace.",
    fr: "Fiches de graphisme gratuites : lignes droites, zigzags, vagues, boucles et spirales, formes et dessins à repasser.",
    es: "Fichas de trazos gratis: líneas rectas, zigzag, ondas, bucles y espirales, figuras y dibujos para repasar.",
    pt: "Atividades de traçado grátis: linhas retas, zigue-zague, ondas, laços e espirais, formas e desenhos para cobrir.",
  },
  intro: {
    en: "Before letters come lines. These sheets practise the strokes that make up every letter: straight and slanted lines, zigzags, waves, loops and spirals, then shapes and whole pictures. On the line sheets, the dots get further apart down the page, so children guide their pencil more and more on their own.",
    fr: "Avant les lettres, il y a les traits. Ces fiches entraînent les gestes de l'écriture : lignes droites et obliques, zigzags, vagues, boucles et spirales, puis les formes et des dessins entiers. Sur les fiches de lignes, les points s'écartent en descendant : l'enfant guide son crayon de plus en plus seul.",
    es: "Antes de las letras vienen los trazos. Estas fichas practican los movimientos de la escritura: líneas rectas e inclinadas, zigzag, ondas, bucles y espirales, y luego figuras y dibujos enteros. En las fichas de líneas, los puntos se separan al bajar: el niño guía su lápiz cada vez más solo.",
    pt: "Antes das letras vêm os traços. Estas atividades treinam os movimentos da escrita: linhas retas e inclinadas, zigue-zague, ondas, laços e espirais, e depois formas e desenhos inteiros. Nas atividades de linhas, os pontinhos se separam para baixo: a criança guia o lápis cada vez mais sozinha.",
  },
  howTo: {
    en: "Let your child trace with a finger first, then with a thick pencil or crayon, always from left to right on the line sheets. Praise a steady line more than speed, and stop before little hands get tired.",
    fr: "Laissez l'enfant suivre d'abord du doigt, puis avec un gros crayon, toujours de gauche à droite sur les fiches de lignes. Félicitez un trait régulier plus que la vitesse, et arrêtez avant que la main fatigue.",
    es: "Deje que el niño siga primero con el dedo y luego con un lápiz grueso, siempre de izquierda a derecha en las fichas de líneas. Elogie un trazo firme más que la rapidez, y paren antes de que la mano se canse.",
    pt: "Deixe a criança seguir primeiro com o dedo e depois com um lápis grosso, sempre da esquerda para a direita nas atividades de linhas. Elogie um traço firme mais do que a rapidez, e parem antes que a mão canse.",
  },
  level: {
    en: "Preschool and pre-K (ages 3–5)",
    fr: "Maternelle (3 à 5 ans)",
    es: "Preescolar (3 a 5 años)",
    pt: "Educação infantil (3 a 5 anos)",
  },
  skills: {
    en: ["Pencil control", "Pre-writing strokes", "Hand-eye coordination"],
    fr: ["Tenue du crayon", "Gestes de l'écriture", "Coordination œil-main"],
    es: ["Control del lápiz", "Trazos previos a la escritura", "Coordinación ojo-mano"],
    pt: ["Controle do lápis", "Traços da pré-escrita", "Coordenação olho-mão"],
  },
  filters: [
    {
      key: "group",
      label: { en: "Type", fr: "Type", es: "Tipo", pt: "Tipo" },
      options: (Object.keys(GROUPS) as TracingGroup[]).map((v) => ({ value: v, label: GROUPS[v] })),
    },
  ],
};
