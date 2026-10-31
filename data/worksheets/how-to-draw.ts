// "How to draw" worksheets, drawn by scripts/sheets/art-layout.ts: a subject
// in 4 to 6 numbered pictures, each adding a few lines to the one before
// (the new lines in colour), the last one coloured in, and a big box at the
// bottom to draw it yourself.
//
// Each subject is a list of shapes in a 100 × 100 box (y down), listed back
// to front: a shape added at a later step can still sit behind an earlier one
// (the cat's body behind its head). Every step picture is made from the
// shapes of its step and the steps before.
import { circle, ellipse } from "@/lib/sheets/geometry";
import { slugify, type L10n, type Sheet, type SheetKind } from "@/lib/sheets/types";
import type { Paint } from "./drawings";

/**
 * A closed shape (filled white, then with `paint` in the coloured picture), a
 * line (no `paint`), or a small shape filled in ink or white (eyes, glints).
 */
export type ArtShape = { d: string; paint?: Paint | "white"; fill?: "ink" | "white"; width?: number };
export type DrawShape = ArtShape & { step: number };

export type HowToDraw = {
  id: string;
  name: L10n;
  /** With the indefinite article ("a cat", "une pomme"). */
  a: L10n;
  shapes: DrawShape[];
};

const at = (step: number, shapes: ArtShape[]): DrawShape[] => shapes.map((s) => ({ ...s, step }));

/** A cartoon eye: an ink pupil and its glint. */
export function eye(x: number, y: number, r: number): ArtShape[] {
  return [
    { d: circle(x, y, r), fill: "ink" },
    { d: circle(x - r * 0.32, y - r * 0.35, r * 0.34), fill: "white" },
  ];
}

export const HOW_TO_DRAW: HowToDraw[] = [
  {
    id: "cat",
    name: { en: "cat", fr: "chat", es: "gato", pt: "gato" },
    a: { en: "a cat", fr: "un chat", es: "un gato", pt: "um gato" },
    shapes: [
      ...at(5, [{ d: "M64 86 C82 90 90 76 87 62 C86 56 79 56 81 62 C84 72 78 80 64 79 Z", paint: "orange" }]),
      ...at(3, [{ d: ellipse(50, 73, 21, 21), paint: "orange" }]),
      ...at(2, [
        { d: "M33 25 L31 5 L47 17 Z", paint: "orange" },
        { d: "M67 25 L69 5 L53 17 Z", paint: "orange" },
        { d: "M35 20 L33.6 10.5 L41.5 16.5 Z", paint: "pink" },
        { d: "M65 20 L66.4 10.5 L58.5 16.5 Z", paint: "pink" },
      ]),
      ...at(1, [{ d: circle(50, 34, 19), paint: "orange" }]),
      ...at(3, [{ d: ellipse(50, 79, 11, 11), paint: "yellow" }]),
      ...at(5, [
        { d: ellipse(41, 93, 7, 4), paint: "yellow" },
        { d: ellipse(59, 93, 7, 4), paint: "yellow" },
      ]),
      ...at(4, [
        ...eye(43, 31, 3.2),
        ...eye(57, 31, 3.2),
        { d: "M47.5 38 L52.5 38 L50 41 Z", paint: "pink" },
        { d: "M50 41 Q47 44.5 44.5 42.5 M50 41 Q53 44.5 55.5 42.5" },
        { d: "M37 39 L27 37.5 M37 42 L27 43 M63 39 L73 37.5 M63 42 L73 43", width: 0.5 },
      ]),
    ],
  },
  {
    id: "apple",
    name: { en: "apple", fr: "pomme", es: "manzana", pt: "maçã" },
    a: { en: "an apple", fr: "une pomme", es: "una manzana", pt: "uma maçã" },
    shapes: [
      ...at(2, [{ d: "M48 31 C48 24 47 18 44.5 12.5 L48.5 11.5 C51 17.5 52 24 52.5 31 Z", paint: "brown" }]),
      ...at(1, [{ d: "M50 30 C40 21 17 24 17 50 C17 74 34 93 50 86 C66 93 83 74 83 50 C83 24 60 21 50 30 Z", paint: "red" }]),
      ...at(3, [
        { d: "M52 20 C57 10 69 8 76 12 C71 21 61 24 52 20 Z", paint: "green" },
        { d: "M54.5 19 C61 16 67 14 73 12.5", width: 0.5 },
      ]),
      ...at(4, [{ d: "M26 54 C25 44 30 37 38 35 C34 40 31 46 30.5 54 Z", paint: "white" }]),
    ],
  },
  {
    id: "house",
    name: { en: "house", fr: "maison", es: "casa", pt: "casa" },
    a: { en: "a house", fr: "une maison", es: "una casa", pt: "uma casa" },
    shapes: [
      ...at(5, [{ d: "M64 34 L64 15 L73 15 L73 41 Z", paint: "grey" }]),
      ...at(1, [{ d: "M22 46 L78 46 L78 93 L22 93 Z", paint: "yellow" }]),
      ...at(2, [{ d: "M13 49 L50 15 L87 49 Z", paint: "red" }]),
      ...at(3, [
        { d: "M42.5 93 L42.5 72 Q50 63 57.5 72 L57.5 93 Z", paint: "brown" },
        { d: circle(53.5, 83, 1.3), fill: "ink" },
      ]),
      ...at(4, [
        { d: "M27 57 L39 57 L39 69 L27 69 Z", paint: "blue" },
        { d: "M61 57 L73 57 L73 69 L61 69 Z", paint: "blue" },
        { d: "M33 57 L33 69 M27 63 L39 63 M67 57 L67 69 M61 63 L73 63", width: 0.5 },
      ]),
    ],
  },
  {
    id: "fish",
    name: { en: "fish", fr: "poisson", es: "pez", pt: "peixe" },
    a: { en: "a fish", fr: "un poisson", es: "un pez", pt: "um peixe" },
    shapes: [
      ...at(2, [{ d: "M68 50 L91 30 Q85 50 91 70 Z", paint: "yellow" }]),
      ...at(3, [
        { d: "M36 36 Q46 15 62 33 Z", paint: "yellow" },
        { d: "M44 64 Q50 80 58 65 Z", paint: "yellow" },
      ]),
      ...at(1, [{ d: "M18 50 C28 27 62 25 75 50 C62 75 28 73 18 50 Z", paint: "orange" }]),
      ...at(3, [{ d: "M47 52 Q56 53 59 61 Q50 62 47 52 Z", paint: "yellow" }]),
      ...at(4, [
        { d: circle(31, 45, 4.6), paint: "white" },
        ...eye(32, 45.5, 2.3),
        { d: "M19.5 53 Q23 55.5 26.5 53.5" },
        { d: "M39 38 Q45 50 39 62" },
      ]),
      ...at(5, [
        { d: "M55 37 Q59.5 41.5 55 46 M64 39.5 Q68.5 44 64 48.5 M64 53 Q68.5 57.5 64 62 M55 61 Q59.5 65 55 69", width: 0.6 },
        { d: circle(10, 33, 2.6), paint: "white" },
        { d: circle(6.5, 25, 1.8), paint: "white" },
      ]),
    ],
  },
];

// ------------------------------------------------------------------ sheets

export type HowToDrawParams = { subject: string };
export type HowToDrawSheet = Sheet<HowToDrawParams>;

const each = <T>(f: (l: keyof L10n) => T): L10n<T> => ({ en: f("en"), fr: f("fr"), es: f("es"), pt: f("pt") });
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
/** "a cat" → "a Cat": the article stays small in English titles. */
const words = (s: string) => s.split(" ").map((w) => (["a", "an"].includes(w) ? w : cap(w))).join(" ");

/** The number of pictures: the drawing steps, then the coloured one. */
export const stepCount = (h: HowToDraw) => Math.max(...h.shapes.map((s) => s.step)) + 1;

function sheet(h: HowToDraw): HowToDrawSheet {
  const n = stepCount(h);
  return {
    kind: "how-to-draw",
    id: `draw-${h.id}`,
    slug: {
      en: `how-to-draw-${slugify(h.a.en)}`,
      fr: `dessiner-${slugify(h.a.fr)}`,
      es: `como-dibujar-${slugify(h.a.es)}`,
      pt: `como-desenhar-${slugify(h.a.pt)}`,
    },
    title: {
      en: `How to Draw ${words(h.a.en)}`,
      fr: `Apprendre à dessiner ${h.a.fr}`,
      es: `Cómo dibujar ${h.a.es}`,
      pt: `Como desenhar ${h.a.pt}`,
    },
    label: each((l) => cap(h.name[l])),
    description: {
      en: `Free printable drawing worksheet: how to draw ${h.a.en} in ${n} easy steps, the new lines shown in color, with a big box to practice.`,
      fr: `Fiche de dessin gratuite à imprimer : dessiner ${h.a.fr} en ${n} étapes faciles, les nouveaux traits en couleur, avec un grand cadre pour s'entraîner.`,
      es: `Ficha de dibujo gratis para imprimir: cómo dibujar ${h.a.es} en ${n} pasos fáciles, con las líneas nuevas en color y un recuadro grande para practicar.`,
      pt: `Atividade de desenho grátis para imprimir: como desenhar ${h.a.pt} em ${n} passos fáceis, com as linhas novas em cor e um quadro grande para praticar.`,
    },
    instruction: {
      en: "Copy the pictures in order: the new lines are in pink. Then draw your own in the big box.",
      fr: "Copie les dessins dans l'ordre : les nouveaux traits sont en rose. Puis dessine le tien dans le grand cadre.",
      es: "Copia los dibujos en orden: las líneas nuevas están en rosa. Luego haz el tuyo en el recuadro grande.",
      pt: "Copie os desenhos em ordem: as linhas novas estão em rosa. Depois faça o seu no quadro grande.",
    },
    filters: { steps: String(n) },
    params: { subject: h.id },
  };
}

export const howToDrawSheets: HowToDrawSheet[] = HOW_TO_DRAW.map(sheet);

export function getHowToDraw(id: string): HowToDraw {
  const h = HOW_TO_DRAW.find((x) => x.id === id);
  if (!h) throw new Error(`No how-to-draw subject "${id}"`);
  return h;
}

export const howToDrawKind: SheetKind = {
  id: "how-to-draw",
  slug: { en: "how-to-draw", fr: "apprendre-a-dessiner", es: "como-dibujar", pt: "como-desenhar" },
  name: { en: "How to Draw", fr: "Apprendre à dessiner", es: "Cómo dibujar", pt: "Como desenhar" },
  heading: {
    en: "How to Draw: Step-by-Step Drawing for Kids",
    fr: "Apprendre à dessiner étape par étape",
    es: "Cómo dibujar paso a paso para niños",
    pt: "Como desenhar passo a passo para crianças",
  },
  metaTitle: {
    en: "How to Draw for Kids: Step-by-Step Worksheets | Free PDFs",
    fr: "Apprendre à dessiner étape par étape : fiches gratuites",
    es: "Cómo dibujar paso a paso: fichas gratis para niños",
    pt: "Como desenhar passo a passo: atividades grátis",
  },
  description: {
    en: "Free printable step-by-step drawing worksheets: animals, fruit and more in 4 to 6 easy steps, with a big box to practice.",
    fr: "Fiches gratuites pour apprendre à dessiner étape par étape : des animaux, des fruits et plus, en 4 à 6 étapes, avec un grand cadre pour s'entraîner.",
    es: "Fichas gratis para aprender a dibujar paso a paso: animales, frutas y más en 4 a 6 pasos fáciles, con un recuadro grande para practicar.",
    pt: "Atividades grátis para aprender a desenhar passo a passo: animais, frutas e mais em 4 a 6 passos fáceis, com um quadro grande para praticar.",
  },
  intro: {
    en: "Each sheet breaks a drawing into simple shapes: a circle, two triangles, an oval. Every picture adds a few lines to the one before, shown in pink, and the last one is colored in. The child copies the steps in the big box at the bottom, then colors their own drawing.",
    fr: "Chaque fiche découpe un dessin en formes simples : un rond, deux triangles, un ovale. Chaque image ajoute quelques traits à la précédente, en rose, et la dernière est en couleur. L'enfant reproduit les étapes dans le grand cadre en bas, puis colorie son dessin.",
    es: "Cada ficha divide un dibujo en formas sencillas: un círculo, dos triángulos, un óvalo. Cada imagen agrega unas líneas a la anterior, en rosa, y la última está coloreada. El niño copia los pasos en el recuadro grande de abajo y luego colorea su dibujo.",
    pt: "Cada atividade divide um desenho em formas simples: um círculo, dois triângulos, um oval. Cada imagem acrescenta algumas linhas à anterior, em rosa, e a última está colorida. A criança copia os passos no quadro grande embaixo e depois pinta o seu desenho.",
  },
  howTo: {
    en: "Draw lightly with a pencil first, so lines can be erased. Name each shape together as your child draws it. There is no wrong drawing: a wobbly cat is still a cat.",
    fr: "Dessinez d'abord légèrement au crayon à papier, pour pouvoir gommer. Nommez ensemble chaque forme pendant que l'enfant la trace. Il n'y a pas de dessin raté : un chat un peu tordu reste un chat.",
    es: "Dibujen primero suave con lápiz, para poder borrar. Nombren juntos cada forma mientras el niño la traza. No hay dibujos equivocados: un gato chueco sigue siendo un gato.",
    pt: "Desenhem primeiro de leve com lápis, para poder apagar. Digam juntos o nome de cada forma enquanto a criança desenha. Não existe desenho errado: um gato torto continua sendo um gato.",
  },
  level: {
    en: "Preschool to second grade (ages 4–8)",
    fr: "De la maternelle au CE1 (4 à 8 ans)",
    es: "Preescolar a segundo grado (4 a 8 años)",
    pt: "Educação infantil ao 2º ano (4 a 8 anos)",
  },
  skills: {
    en: ["Drawing", "Shapes", "Fine motor skills"],
    fr: ["Dessin", "Formes", "Motricité fine"],
    es: ["Dibujo", "Formas", "Motricidad fina"],
    pt: ["Desenho", "Formas", "Coordenação motora fina"],
  },
  filters: [
    {
      key: "steps",
      label: { en: "Steps", fr: "Étapes", es: "Pasos", pt: "Passos" },
      options: ["4", "5", "6"].map((v) => ({ value: v, label: { en: `${v} steps`, fr: `${v} étapes`, es: `${v} pasos`, pt: `${v} passos` } })),
    },
  ],
};
