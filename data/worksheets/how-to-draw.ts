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
import { STAR, petals, polygon, ray, type Paint } from "./drawings";

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

const r2 = (n: number) => Math.round(n * 100) / 100;

/** Points along an ellipse from `deg0` to `deg1` (0° points right, angles clockwise, y being down), as "x y" pairs for L. */
function arcPts(cx: number, cy: number, rx: number, ry: number, deg0: number, deg1: number, n = 16): string[] {
  return Array.from({ length: n + 1 }, (_, k) => {
    const a = ((deg0 + ((deg1 - deg0) * k) / n) * Math.PI) / 180;
    return `${r2(cx + rx * Math.cos(a))} ${r2(cy + ry * Math.sin(a))}`;
  });
}

/** A rainbow band: the half ring between radius r0 and r1 above (cx, cy). */
function arch(cx: number, cy: number, r0: number, r1: number): string {
  return `M${[...arcPts(cx, cy, r1, r1, 180, 360, 24), ...arcPts(cx, cy, r0, r0, 360, 180, 24)].join(" L")} Z`;
}

/** A stripe across an ellipse, between x0 and x1, its sides bowed by `bow`. */
function stripe(cx: number, cy: number, rx: number, ry: number, x0: number, x1: number, bow: number): string {
  const deg = (x: number) => (Math.acos((x - cx) / rx) * 180) / Math.PI;
  const bottom = arcPts(cx, cy, rx, ry, deg(x0), deg(x1), 8);
  const top = arcPts(cx, cy, rx, ry, -deg(x1), -deg(x0), 8);
  return `M${top[8]} Q${r2(x0 + bow)} ${cy} ${bottom[0]} L${bottom.slice(1).join(" L")} Q${r2(x1 + bow)} ${cy} ${top[0]} L${top.slice(1, -1).join(" L")} Z`;
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
      // The scales stay inside the body, clear of the fins.
      ...at(5, [
        { d: "M57 37 Q61 41 57 45 M65 40 Q69 44 65 48 M57 45.5 Q61 49.5 57 53.5 M65 51 Q69 55 65 59", width: 0.6 },
        { d: circle(10, 33, 2.6), paint: "white" },
        { d: circle(6.5, 25, 1.8), paint: "white" },
      ]),
    ],
  },
  {
    id: "car",
    name: { en: "car", fr: "voiture", es: "carro", pt: "carro" },
    a: { en: "a car", fr: "une voiture", es: "un carro", pt: "um carro" },
    shapes: [
      ...at(2, [{ d: "M27 50 C31 35 38 29 50 29 L62 29 C70 29 75 35 79 49 Z", paint: "red" }]),
      ...at(1, [{ d: "M8 70 L8 57 C8 52 12 49.5 19 49 L80 48 C88 48.5 93 52 93 58 L93 70 Z", paint: "red" }]),
      ...at(4, [
        { d: "M33 47.5 C36 39 41 34.5 48 34.5 L48 47.5 Z", paint: "blue" },
        { d: "M53 34.5 L61 34.5 C67 34.5 70.5 39 73.5 47.5 L53 47.5 Z", paint: "blue" },
      ]),
      ...at(3, [
        { d: circle(27, 72, 9), paint: "grey" },
        { d: circle(73, 72, 9), paint: "grey" },
        { d: circle(27, 72, 4), paint: "yellow" },
        { d: circle(73, 72, 4), paint: "yellow" },
      ]),
      ...at(5, [
        { d: "M50.5 51 L50.5 64 M42 55 L46 55 M56 55 L60 55", width: 0.6 },
        { d: ellipse(88.5, 55.5, 2.2, 2.6), paint: "yellow" },
      ]),
    ],
  },
  {
    id: "butterfly",
    name: { en: "butterfly", fr: "papillon", es: "mariposa", pt: "borboleta" },
    a: { en: "a butterfly", fr: "un papillon", es: "una mariposa", pt: "uma borboleta" },
    shapes: [
      ...at(3, [
        { d: "M49 55 C36 53 20 62 22 76 C24 88 40 86 49 68 Z", paint: "blue" },
        { d: "M51 55 C64 53 80 62 78 76 C76 88 60 86 51 68 Z", paint: "blue" },
      ]),
      ...at(2, [
        { d: "M49 44 C40 22 16 12 11 24 C6 36 20 52 48 54 Z", paint: "purple" },
        { d: "M51 44 C60 22 84 12 89 24 C94 36 80 52 52 54 Z", paint: "purple" },
      ]),
      ...at(4, [
        { d: "M47.5 28 C46 20 43 15 38 12 M52.5 28 C54 20 57 15 62 12", width: 0.6 },
        { d: circle(38, 12, 1.6), fill: "ink" },
        { d: circle(62, 12, 1.6), fill: "ink" },
      ]),
      ...at(1, [
        { d: ellipse(50, 60, 4.5, 21), paint: "brown" },
        { d: circle(50, 34, 6.5), paint: "brown" },
      ]),
      ...at(4, [
        { d: circle(26, 31, 6), paint: "yellow" },
        { d: circle(74, 31, 6), paint: "yellow" },
        { d: circle(34, 73, 4.5), paint: "pink" },
        { d: circle(66, 73, 4.5), paint: "pink" },
        ...eye(47.5, 33.5, 1.4),
        ...eye(52.5, 33.5, 1.4),
      ]),
    ],
  },
  {
    id: "rocket",
    name: { en: "rocket", fr: "fusée", es: "cohete", pt: "foguete" },
    a: { en: "a rocket", fr: "une fusée", es: "un cohete", pt: "um foguete" },
    shapes: [
      ...at(4, [
        { d: "M40 77 C40 88 46 93 50 98 C54 93 60 88 60 77 Z", paint: "orange" },
        { d: "M45 77 C45 84 48 88 50 91 C52 88 55 84 55 77 Z", paint: "yellow" },
      ]),
      ...at(2, [
        { d: "M35 56 L20 72 L20 86 L35 78 Z", paint: "red" },
        { d: "M65 56 L80 72 L80 86 L65 78 Z", paint: "red" },
      ]),
      ...at(1, [{ d: "M50 6 C61 15 66 29 66 45 L66 80 L34 80 L34 45 C34 29 39 15 50 6 Z", paint: "blue" }]),
      ...at(3, [
        { d: "M50 6 C56 11 60 17 62.6 25 Q50 20.5 37.4 25 C40 17 44 11 50 6 Z", paint: "red" },
        { d: circle(50, 46, 8), paint: "yellow" },
        { d: "M45.5 43.5 Q46.5 40 50 39.5", width: 0.6 },
      ]),
    ],
  },
  {
    id: "star",
    name: { en: "star", fr: "étoile", es: "estrella", pt: "estrela" },
    a: { en: "a star", fr: "une étoile", es: "una estrella", pt: "uma estrela" },
    shapes: [
      ...at(1, [{ d: polygon(STAR), paint: "yellow" }]),
      ...at(2, [...eye(43.5, 51, 2.8), ...eye(56.5, 51, 2.8)]),
      ...at(3, [
        { d: "M45.5 58.5 Q50 63 54.5 58.5" },
        { d: circle(39, 60, 3), paint: "pink" },
        { d: circle(61, 60, 3), paint: "pink" },
      ]),
    ],
  },
  {
    id: "heart",
    name: { en: "heart", fr: "cœur", es: "corazón", pt: "coração" },
    a: { en: "a heart", fr: "un cœur", es: "un corazón", pt: "um coração" },
    shapes: [
      ...at(1, [{ d: "M50 88 C30 74 8 58 8 36 C8 20 20 12 31 12 C40 12 46 17 50 25 C54 17 60 12 69 12 C80 12 92 20 92 36 C92 58 70 74 50 88 Z", paint: "red" }]),
      ...at(2, [...eye(39, 42, 3.2), ...eye(61, 42, 3.2)]),
      ...at(3, [
        { d: "M44 53 Q50 59 56 53" },
        { d: circle(31, 52, 3.6), paint: "pink" },
        { d: circle(69, 52, 3.6), paint: "pink" },
        { d: "M20 32 C21 25 25 21 31 20", width: 0.6 },
      ]),
    ],
  },
  {
    id: "balloon",
    name: { en: "balloon", fr: "ballon", es: "globo", pt: "balão" },
    a: { en: "a balloon", fr: "un ballon", es: "un globo", pt: "um balão" },
    shapes: [
      ...at(2, [{ d: "M46 76 L54 76 L57 83 L43 83 Z", paint: "orange" }]),
      ...at(1, [{ d: "M50 8 C70 8 84 23 84 42 C84 62 64 77 50 78 C36 77 16 62 16 42 C16 23 30 8 50 8 Z", paint: "red" }]),
      ...at(3, [{ d: "M50 83 C45 88 55 93 50 99" }]),
      ...at(4, [{ d: "M27 40 C27 30 32 22 40 19 C36 25 34 31 33 40 C33 45 27 45 27 40 Z", paint: "white" }]),
    ],
  },
  {
    id: "sun",
    name: { en: "sun", fr: "soleil", es: "sol", pt: "sol" },
    a: { en: "a sun", fr: "un soleil", es: "un sol", pt: "um sol" },
    shapes: [
      ...at(2, [0, 2, 4, 6, 8].map((i): ArtShape => ({ d: ray(50, 50, 20, 46, -90 + 36 * i, 9), paint: "orange" }))),
      ...at(3, [1, 3, 5, 7, 9].map((i): ArtShape => ({ d: ray(50, 50, 20, 40, -90 + 36 * i, 9), paint: "orange" }))),
      ...at(1, [{ d: circle(50, 50, 24), paint: "yellow" }]),
      ...at(4, [...eye(42, 46, 3), ...eye(58, 46, 3)]),
      ...at(5, [
        { d: "M43 56 Q50 62.5 57 56" },
        { d: circle(35.5, 55, 3.3), paint: "pink" },
        { d: circle(64.5, 55, 3.3), paint: "pink" },
      ]),
    ],
  },
  {
    id: "sailboat",
    name: { en: "sailboat", fr: "bateau", es: "velero", pt: "veleiro" },
    a: { en: "a sailboat", fr: "un bateau", es: "un velero", pt: "um veleiro" },
    shapes: [
      ...at(2, [{ d: "M47.5 4 L50.5 4 L50.5 64 L47.5 64 Z", paint: "brown" }]),
      ...at(4, [{ d: "M50.5 4.5 L61 8 L50.5 11.5 Z", paint: "red" }]),
      ...at(3, [
        { d: "M53.5 14 L84 58 L53.5 58 Z", paint: "yellow" },
        { d: "M44.5 20 L44.5 58 L18 58 Z", paint: "yellow" },
      ]),
      ...at(1, [{ d: "M12 62 L88 62 L77 80 L23 80 Z", paint: "red" }]),
      ...at(4, [{ d: "M8 89 Q15 85 22 89 Q29 93 36 89 M64 89 Q71 85 78 89 Q85 93 92 89", width: 0.6 }]),
    ],
  },
  {
    id: "kite",
    name: { en: "kite", fr: "cerf-volant", es: "papalote", pt: "pipa" },
    a: { en: "a kite", fr: "un cerf-volant", es: "un papalote", pt: "uma pipa" },
    shapes: [
      ...at(1, [{ d: "M50 6 L78 38 L50 78 L22 38 Z", paint: "yellow" }]),
      ...at(2, [
        { d: "M50 6 L78 38 L50 38 Z", paint: "red" },
        { d: "M50 38 L22 38 L50 78 Z", paint: "red" },
      ]),
      ...at(3, [{ d: "M50 78 C42 84 58 90 50 98" }]),
      ...at(4, [
        { d: "M48.6 83.5 L42 80 L42 87 Z", paint: "blue" },
        { d: "M48.6 83.5 L55 80 L55 87 Z", paint: "blue" },
        { d: "M51.7 92 L45.5 88.5 L45.5 95.5 Z", paint: "green" },
        { d: "M51.7 92 L58 88.5 L58 95.5 Z", paint: "green" },
      ]),
    ],
  },
  {
    id: "ice-cream",
    name: { en: "ice cream", fr: "cornet de glace", es: "helado", pt: "sorvete" },
    a: { en: "an ice cream", fr: "un cornet de glace", es: "un helado", pt: "um sorvete" },
    shapes: [
      ...at(1, [{ d: "M23 44 L50 94 L77 44 Z", paint: "orange" }]),
      ...at(4, [
        { d: circle(50, 9, 5), paint: "red" },
        { d: "M50 4 Q51 0 55 -1.5", width: 0.6 },
      ]),
      ...at(2, [
        {
          d: "M50 12 C64 12 75 22 75 35 C79 37 81 41 80 45 Q75 50 70 45 Q65 51 60 45 Q55 51 50 45 Q45 51 40 45 Q35 51 30 45 Q25 50 20 45 C19 41 21 37 25 35 C25 22 36 12 50 12 Z",
          paint: "pink",
        },
      ]),
      ...at(3, [{ d: "M38 56 L57 74 M62 56 L44 74", width: 0.6 }]),
      ...at(4, [{ d: "M38 24 L41 22 M55 20 L58 22 M46 31 L49 30 M62 32 L64 35 M33 37 L35 34 M51 39 L54 38", width: 0.8 }]),
    ],
  },
  {
    id: "mushroom",
    name: { en: "mushroom", fr: "champignon", es: "hongo", pt: "cogumelo" },
    a: { en: "a mushroom", fr: "un champignon", es: "un hongo", pt: "um cogumelo" },
    shapes: [
      ...at(2, [{ d: "M34 50 L66 50 L66 82 C66 90 60 93 50 93 C40 93 34 90 34 82 Z", paint: "yellow" }]),
      ...at(1, [{ d: "M50 12 C74 12 92 30 92 48 C92 54 84 56 50 56 C16 56 8 54 8 48 C8 30 26 12 50 12 Z", paint: "red" }]),
      ...at(3, [
        { d: circle(30, 36, 6), paint: "white" },
        { d: circle(55, 24, 5.5), paint: "white" },
        { d: circle(73, 40, 5), paint: "white" },
        { d: circle(50, 44, 4), paint: "white" },
      ]),
      ...at(4, [...eye(44, 69, 2.4), ...eye(56, 69, 2.4), { d: "M46 76 Q50 80 54 76" }]),
    ],
  },
  {
    id: "tree",
    name: { en: "tree", fr: "arbre", es: "árbol", pt: "árvore" },
    a: { en: "a tree", fr: "un arbre", es: "un árbol", pt: "uma árvore" },
    shapes: [
      ...at(1, [{ d: "M43 58 L57 58 L58 92 L42 92 Z", paint: "brown" }]),
      ...at(2, [
        {
          d: "M50 8 C62 8 70 16 70 24 C80 24 88 32 86 44 C92 50 90 64 78 66 C72 72 62 72 56 68 L44 68 C38 72 28 72 22 66 C10 64 8 50 14 44 C12 32 20 24 30 24 C30 16 38 8 50 8 Z",
          paint: "green",
        },
      ]),
      ...at(3, [
        { d: circle(36, 38, 4), paint: "red" },
        { d: circle(62, 30, 4), paint: "red" },
        { d: circle(65, 52, 4), paint: "red" },
        { d: circle(32, 54, 3.6), paint: "red" },
        { d: circle(49, 46, 3.6), paint: "red" },
      ]),
      ...at(4, [{ d: "M22 92 L78 92 M28 92 L30 88 L32 92 M68 92 L70 88 L72 92 M50 80 Q53 78 54 75", width: 0.6 }]),
    ],
  },
  {
    id: "umbrella",
    name: { en: "umbrella", fr: "parapluie", es: "paraguas", pt: "guarda-chuva" },
    a: { en: "an umbrella", fr: "un parapluie", es: "un paraguas", pt: "um guarda-chuva" },
    shapes: [
      ...at(2, [{ d: "M48 50 L52 50 L52 82 C52 90 40 90 40 82 L44 82 C44 86 48 86 48 82 Z", paint: "brown" }]),
      ...at(1, [{ d: "M50 12 C74 12 92 30 94 52 Q83 46 72 52 Q61 46 50 52 Q39 46 28 52 Q17 46 6 52 C8 30 26 12 50 12 Z", paint: "red" }]),
      ...at(3, [
        { d: "M50 12 Q36 28 28 52 M50 12 Q64 28 72 52", width: 0.7 },
        { d: "M48.8 12 L48.8 6 L51.2 6 L51.2 12 Z", paint: "brown" },
      ]),
      ...at(4, [
        { d: "M16 64 C14 68 13.5 71 16 71 C18.5 71 18 68 16 64 Z", paint: "blue" },
        { d: "M80 66 C78 70 77.5 73 80 73 C82.5 73 82 70 80 66 Z", paint: "blue" },
        { d: "M26 76 C24 80 23.5 83 26 83 C28.5 83 28 80 26 76 Z", paint: "blue" },
        { d: "M70 79 C68 83 67.5 86 70 86 C72.5 86 72 83 70 79 Z", paint: "blue" },
      ]),
    ],
  },
  {
    id: "carrot",
    name: { en: "carrot", fr: "carotte", es: "zanahoria", pt: "cenoura" },
    a: { en: "a carrot", fr: "une carotte", es: "una zanahoria", pt: "uma cenoura" },
    shapes: [
      ...at(3, [
        { d: "M45 28 C38 19 32 13 26 12 C28 20 35 26 44 30 Z", paint: "green" },
        { d: "M55 28 C62 19 68 13 74 12 C72 20 65 26 56 30 Z", paint: "green" },
      ]),
      ...at(2, [{ d: "M46.5 27 C44.5 17 46 9 50 3 C54 9 55.5 17 53.5 27 Z", paint: "green" }]),
      ...at(1, [{ d: "M50 92 C44 80 30 46 30 36 C30 28 38 24 50 24 C62 24 70 28 70 36 C70 46 56 80 50 92 Z", paint: "orange" }]),
      ...at(4, [{ d: "M37 44 L44 44 M56 54 L63 54 M41 66 L47 66 M52 76 L56 76", width: 0.6 }]),
    ],
  },
  {
    id: "pear",
    name: { en: "pear", fr: "poire", es: "pera", pt: "pera" },
    a: { en: "a pear", fr: "une poire", es: "una pera", pt: "uma pera" },
    shapes: [
      ...at(2, [{ d: "M48.5 17 C48.5 11 49.5 7 52.5 3.5 L55.5 5.5 C53 8.5 52 12 52 17 Z", paint: "brown" }]),
      ...at(3, [
        { d: "M55 10 C59 3 67 2 72 5.5 C68 11 61 13.5 55 10 Z", paint: "green" },
        { d: "M57 9.2 C61 7.2 65 6 69.5 5.8", width: 0.5 },
      ]),
      ...at(1, [
        {
          d: "M50 14 C56 14 58 20 59 28 C60 38 76 50 76 68 C76 84 64 92 50 92 C36 92 24 84 24 68 C24 50 40 38 41 28 C42 20 44 14 50 14 Z",
          paint: "yellow",
        },
      ]),
      ...at(4, [{ d: "M32 68 C32 60 35 54 39.5 51 C37.5 57 37 63 37.5 70 C37.5 74 32 74 32 68 Z", paint: "white" }]),
    ],
  },
  {
    id: "strawberry",
    name: { en: "strawberry", fr: "fraise", es: "fresa", pt: "morango" },
    a: { en: "a strawberry", fr: "une fraise", es: "una fresa", pt: "um morango" },
    shapes: [
      ...at(3, [{ d: "M48 20 L48 7 L52 7 L52 20 Z", paint: "brown" }]),
      ...at(1, [{ d: "M50 22 C64 18 82 22 84 36 C86 54 66 82 50 92 C34 82 14 54 16 36 C18 22 36 18 50 22 Z", paint: "red" }]),
      ...at(2, [{ d: "M23 29 Q33 25 37 35 Q42 24 50 33 Q58 24 63 35 Q67 25 77 29 Q68 13 50 16 Q32 13 23 29 Z", paint: "green" }]),
      ...at(4, [
        [38, 44], [50, 42], [62, 44], [30, 54], [44, 55], [56, 55], [70, 54], [38, 66], [50, 67], [62, 66], [44, 78], [56, 78],
      ].map(([x, y]): ArtShape => ({ d: ellipse(x, y, 1, 1.6), fill: "ink" }))),
    ],
  },
  {
    id: "flower",
    name: { en: "flower", fr: "fleur", es: "flor", pt: "flor" },
    a: { en: "a flower", fr: "une fleur", es: "una flor", pt: "uma flor" },
    shapes: [
      ...at(3, [{ d: "M48.5 50 L51.5 50 L51.5 94 L48.5 94 Z", paint: "green" }]),
      ...at(4, [
        { d: "M51.5 82 C57 73 67 70 74 72 C70 81 60 85 51.5 84 Z", paint: "green" },
        { d: "M48.5 74 C43 65 33 62 26 64 C30 73 40 77 48.5 76 Z", paint: "green" },
      ]),
      ...at(2, [{ d: petals(50, 34, 5, 17.5, 11), paint: "pink" }]),
      ...at(1, [{ d: circle(50, 34, 10), paint: "yellow" }]),
      ...at(5, [...eye(46.5, 32, 1.8), ...eye(53.5, 32, 1.8), { d: "M46.5 37 Q50 40 53.5 37" }]),
    ],
  },
  {
    id: "dog",
    name: { en: "dog", fr: "chien", es: "perro", pt: "cachorro" },
    a: { en: "a dog", fr: "un chien", es: "un perro", pt: "um cachorro" },
    // Side on, looking left.
    shapes: [
      ...at(4, [{ d: "M80 52 C86 46 89 38 88 30 C92 32 94 40 91 48 C89 53 86 56 82 58 Z", paint: "yellow" }]),
      ...at(3, [
        { d: "M40 60 L40 85 C40 89 47 89 47 85 L47 60 Z", paint: "yellow" },
        { d: "M50 62 L50 86 C50 90 57 90 57 86 L57 62 Z", paint: "yellow" },
        { d: "M64 62 L64 86 C64 90 71 90 71 86 L71 62 Z", paint: "yellow" },
        { d: "M73.5 60 L73.5 85 C73.5 89 80.5 89 80.5 85 L80.5 60 Z", paint: "yellow" },
      ]),
      ...at(2, [{ d: ellipse(60, 57, 24, 14), paint: "yellow" }]),
      ...at(5, [{ d: circle(67, 53, 6), paint: "brown" }]),
      ...at(1, [
        { d: circle(30, 38, 14), paint: "yellow" },
        { d: ellipse(18, 44, 9, 6.5), paint: "yellow" },
      ]),
      ...at(4, [{ d: "M34 25 C41 23 45.5 30 44.5 40 C44 46 38.5 46.5 37.5 41 C36.5 36 35 30 34 25 Z", paint: "brown" }]),
      ...at(5, [
        ...eye(26, 34, 2.6),
        { d: ellipse(10.5, 41.5, 2.8, 2.2), fill: "ink" },
        { d: "M17 49.5 Q17 55 19.5 55 Q22 55 21.5 49.3 Z", paint: "pink" },
        { d: "M12 47.5 Q17 51 23 47.5" },
      ]),
    ],
  },
  {
    id: "bird",
    name: { en: "bird", fr: "oiseau", es: "pájaro", pt: "passarinho" },
    a: { en: "a bird", fr: "un oiseau", es: "un pájaro", pt: "um passarinho" },
    // Side on, looking left.
    shapes: [
      ...at(5, [
        { d: "M47 72 L50 72 L50 88 L47 88 Z", paint: "orange" },
        { d: "M57 72 L60 72 L60 88 L57 88 Z", paint: "orange" },
        { d: "M42 88.5 L52 88.5 M52 88.5 L62 88.5", width: 0.9 },
      ]),
      ...at(4, [{ d: "M74 52 L94 40 L91 60 L78 64 Z", paint: "blue" }]),
      ...at(1, [{ d: ellipse(56, 58, 24, 17), paint: "blue" }]),
      ...at(4, [{ d: "M46 57 C54 47 70 47 76 57 C68 67 54 67 46 57 Z", paint: "green" }]),
      ...at(3, [{ d: "M27 35 L12 39.5 L27 44 Z", paint: "orange" }]),
      ...at(2, [{ d: circle(36, 40, 12), paint: "blue" }]),
      ...at(3, [...eye(33, 37, 2.6)]),
    ],
  },
  {
    id: "turtle",
    name: { en: "turtle", fr: "tortue", es: "tortuga", pt: "tartaruga" },
    a: { en: "a turtle", fr: "une tortue", es: "una tortuga", pt: "uma tartaruga" },
    // Side on, looking right.
    shapes: [
      ...at(3, [
        { d: "M18 57 L6 63 L18 64 Z", paint: "yellow" },
        { d: "M24 58 L24 76 C24 80 34 80 34 76 L34 58 Z", paint: "yellow" },
        { d: "M66 58 L66 76 C66 80 76 80 76 76 L76 58 Z", paint: "yellow" },
      ]),
      ...at(2, [{ d: circle(88, 51, 8.5), paint: "yellow" }]),
      ...at(1, [{ d: "M16 62 C16 40 32 28 52 28 C72 28 86 40 86 62 Z", paint: "green" }]),
      ...at(4, [
        { d: "M12 62 L90 62 C90 66 88 68 86 68 L16 68 C14 68 12 66 12 62 Z", paint: "yellow" },
        { d: "M40 41 L52 34 L64 41 L64 51 L52 57 L40 51 Z", paint: "brown" },
        { d: circle(28, 51, 4.5), paint: "brown" },
        { d: circle(76, 51, 4.5), paint: "brown" },
      ]),
      ...at(5, [...eye(90, 48.5, 2), { d: "M87 55 Q90.5 57.5 94 54.5" }]),
    ],
  },
  {
    id: "snail",
    name: { en: "snail", fr: "escargot", es: "caracol", pt: "caracol" },
    a: { en: "a snail", fr: "un escargot", es: "un caracol", pt: "um caracol" },
    shapes: [
      ...at(4, [
        { d: "M14 55 L10 45 M22 54.5 L26 45", width: 0.6 },
        { d: circle(10, 45, 1.6), fill: "ink" },
        { d: circle(26, 45, 1.6), fill: "ink" },
      ]),
      ...at(2, [{ d: "M8 80 L8 66 C8 58 14 54 20 54 C26 54 30 58 30 64 L30 72 L88 72 C94 72 96 80 90 80 Z", paint: "yellow" }]),
      ...at(1, [{ d: circle(60, 50, 22), paint: "orange" }]),
      ...at(3, [{ d: "M60 50 C60 46 66 46 66 51 C66 57 56 58 54 51 C52 42 64 38 70 44 C76 52 70 64 58 64 C46 64 41 52 45 42", width: 0.7 }]),
      ...at(4, [...eye(17, 63, 2.2), { d: "M14 70 Q18 73 22 70" }]),
    ],
  },
  {
    id: "whale",
    name: { en: "whale", fr: "baleine", es: "ballena", pt: "baleia" },
    a: { en: "a whale", fr: "une baleine", es: "una ballena", pt: "uma baleia" },
    shapes: [
      ...at(4, [{ d: "M44 30 C42 22 36 16 30 16 C36 12 44 14 48 20 C52 14 60 12 66 16 C60 16 54 22 52 30 Z", paint: "blue" }]),
      ...at(2, [{ d: "M74 58 L89 42 Q97 40 95 48 L88 59 L96 68 Q97 75 89 72 L74 66 Z", paint: "blue" }]),
      ...at(1, [{ d: "M8 58 C8 38 26 28 46 28 C66 28 80 40 82 56 C78 74 62 84 42 84 C22 84 8 76 8 58 Z", paint: "blue" }]),
      ...at(3, [{ d: "M11 67 Q44 80 79 64", width: 0.7 }]),
      ...at(5, [...eye(25, 51, 2.6), { d: "M14 60 Q21 65 30 62" }]),
    ],
  },
  {
    id: "owl",
    name: { en: "owl", fr: "chouette", es: "búho", pt: "coruja" },
    a: { en: "an owl", fr: "une chouette", es: "un búho", pt: "uma coruja" },
    shapes: [
      ...at(5, [
        { d: "M38 87 L35 96 L45 96 L44 89 Z", paint: "orange" },
        { d: "M62 87 L65 96 L55 96 L56 89 Z", paint: "orange" },
      ]),
      ...at(2, [
        { d: "M25 36 L22 13 L40 26 Z", paint: "purple" },
        { d: "M75 36 L78 13 L60 26 Z", paint: "purple" },
      ]),
      ...at(1, [{ d: "M22 40 C16 56 18 76 30 86 C38 92 62 92 70 86 C82 76 84 56 78 40 C74 27 62 22 50 22 C38 22 26 27 22 40 Z", paint: "purple" }]),
      ...at(4, [{ d: ellipse(50, 74, 15, 11), paint: "pink" }]),
      ...at(3, [
        { d: circle(38, 46, 9.5), paint: "yellow" },
        { d: circle(62, 46, 9.5), paint: "yellow" },
        ...eye(38, 46, 4.5),
        ...eye(62, 46, 4.5),
      ]),
      ...at(4, [{ d: "M46 56 L54 56 L50 63 Z", paint: "orange" }]),
      ...at(5, [{ d: "M24 56 Q31 67 27 79 M76 56 Q69 67 73 79", width: 0.7 }]),
    ],
  },
  {
    id: "airplane",
    name: { en: "airplane", fr: "avion", es: "avión", pt: "avião" },
    a: { en: "an airplane", fr: "un avion", es: "un avión", pt: "um avião" },
    // Seen from above.
    shapes: [
      ...at(2, [
        { d: "M44 36 L8 56 L8 64 L44 54 Z", paint: "red" },
        { d: "M56 36 L92 56 L92 64 L56 54 Z", paint: "red" },
      ]),
      ...at(3, [
        { d: "M44 74 L30 85 L30 91 L44 86 Z", paint: "red" },
        { d: "M56 74 L70 85 L70 91 L56 86 Z", paint: "red" },
      ]),
      ...at(1, [{ d: "M50 6 C55 6 57 12 57 20 L57 80 C57 87 54 92 50 92 C46 92 43 87 43 80 L43 20 C43 12 45 6 50 6 Z", paint: "grey" }]),
      ...at(4, [
        { d: "M46 20 C46 13 54 13 54 20 L54 24 L46 24 Z", paint: "blue" },
        ...[34, 42, 50, 58, 66].map((y): ArtShape => ({ d: circle(50, y, 1.8), paint: "white" })),
      ]),
    ],
  },
  {
    id: "truck",
    name: { en: "truck", fr: "camion", es: "camión", pt: "caminhão" },
    a: { en: "a truck", fr: "un camion", es: "un camión", pt: "um caminhão" },
    shapes: [
      ...at(1, [{ d: "M6 30 L58 30 L58 74 L6 74 Z", paint: "green" }]),
      ...at(2, [{ d: "M58 44 L76 44 C82 44 86 50 90 58 L94 62 L94 74 L58 74 Z", paint: "red" }]),
      ...at(3, [
        { d: circle(24, 76, 9), paint: "grey" },
        { d: circle(76, 76, 9), paint: "grey" },
        { d: circle(24, 76, 4), paint: "yellow" },
        { d: circle(76, 76, 4), paint: "yellow" },
      ]),
      ...at(4, [
        { d: "M62 48 L76 48 C79 48 81.5 51 84 57 L62 57 Z", paint: "blue" },
        { d: ellipse(91, 67, 1.8, 2.4), paint: "yellow" },
        { d: "M14 38 L50 38 M14 46 L50 46", width: 0.6 },
      ]),
    ],
  },
  {
    id: "cupcake",
    name: { en: "cupcake", fr: "cupcake", es: "pastelito", pt: "cupcake" },
    a: { en: "a cupcake", fr: "un cupcake", es: "un pastelito", pt: "um cupcake" },
    shapes: [
      ...at(1, [{ d: "M18 52 L82 52 L74 91 L26 91 Z", paint: "purple" }]),
      ...at(4, [{ d: circle(50, 8, 5), paint: "red" }]),
      ...at(2, [
        {
          d: "M50 12 C58 12 62 17 62 21 C72 21 80 29 80 37 C86 39 88 45 84 51 Q76 56 68 51 Q59 56 50 51 Q41 56 32 51 Q24 56 16 51 C12 45 14 39 20 37 C20 29 28 21 38 21 C38 17 42 12 50 12 Z",
          paint: "pink",
        },
      ]),
      ...at(3, [{ d: "M36 58 L38 87 M50 58 L50 87 M64 58 L62 87", width: 0.6 }]),
      ...at(4, [{ d: "M33 31 L36 29 M58 27 L61 29 M45 37 L48 36 M66 41 L68 44 M27 43 L29 40 M54 45 L57 44", width: 0.8 }]),
    ],
  },
  {
    id: "bear",
    name: { en: "bear", fr: "ours", es: "oso", pt: "urso" },
    a: { en: "a bear", fr: "un ours", es: "un oso", pt: "um urso" },
    shapes: [
      ...at(3, [
        { d: ellipse(50, 74, 22, 20), paint: "brown" },
        { d: ellipse(50, 78, 12, 11), paint: "yellow" },
      ]),
      ...at(5, [
        { d: ellipse(29, 70, 6, 10), paint: "brown" },
        { d: ellipse(71, 70, 6, 10), paint: "brown" },
        { d: ellipse(38, 93, 8.5, 5), paint: "brown" },
        { d: ellipse(62, 93, 8.5, 5), paint: "brown" },
      ]),
      ...at(2, [
        { d: circle(33, 18, 8), paint: "brown" },
        { d: circle(67, 18, 8), paint: "brown" },
        { d: circle(33, 18, 4), paint: "yellow" },
        { d: circle(67, 18, 4), paint: "yellow" },
      ]),
      ...at(1, [{ d: circle(50, 34, 20), paint: "brown" }]),
      ...at(4, [
        { d: ellipse(50, 42, 9, 7), paint: "yellow" },
        { d: ellipse(50, 39, 3.5, 2.5), fill: "ink" },
        { d: "M50 41.5 L50 44 M50 44 Q47 47 44.5 45 M50 44 Q53 47 55.5 45" },
        ...eye(42, 30, 2.6),
        ...eye(58, 30, 2.6),
      ]),
    ],
  },
  {
    id: "bee",
    name: { en: "bee", fr: "abeille", es: "abeja", pt: "abelha" },
    a: { en: "a bee", fr: "une abeille", es: "una abeja", pt: "uma abelha" },
    // Side on, flying left.
    shapes: [
      ...at(4, [
        { d: "M50 41 C40 36 34 22 42 16 C50 12 56 26 54 40 Z", paint: "blue" },
        { d: "M58 41 C60 27 68 15 76 19 C82 25 72 37 62 42 Z", paint: "blue" },
        { d: "M76 52 L90 56 L76 60 Z", paint: "grey" },
        { d: "M44 71 L42 78 M54 72.5 L54 79.5 M64 70.5 L66 77", width: 0.7 },
      ]),
      ...at(1, [{ d: ellipse(53, 56, 25, 17), paint: "yellow" }]),
      ...at(3, [
        { d: stripe(53, 56, 25, 17, 46, 53, 3), fill: "ink" },
        { d: stripe(53, 56, 25, 17, 60, 67, 3), fill: "ink" },
      ]),
      ...at(2, [{ d: circle(27, 54, 12), paint: "yellow" }]),
      ...at(5, [
        { d: "M24 43 C22 36 18 32 13 31 M31 43 C32 36 34 32 39 30", width: 0.6 },
        { d: circle(13, 31, 1.6), fill: "ink" },
        { d: circle(39, 30, 1.6), fill: "ink" },
        ...eye(23, 51, 2.4),
        { d: "M19 58 Q23 61 27 58" },
      ]),
    ],
  },
  {
    id: "frog",
    name: { en: "frog", fr: "grenouille", es: "rana", pt: "sapo" },
    a: { en: "a frog", fr: "une grenouille", es: "una rana", pt: "um sapo" },
    shapes: [
      ...at(5, [
        { d: ellipse(24, 76, 10, 12), paint: "green" },
        { d: ellipse(76, 76, 10, 12), paint: "green" },
      ]),
      ...at(2, [{ d: ellipse(50, 68, 27, 21), paint: "green" }]),
      ...at(5, [
        { d: ellipse(50, 73, 15, 12), paint: "yellow" },
        { d: ellipse(39, 89, 8, 4), paint: "green" },
        { d: ellipse(61, 89, 8, 4), paint: "green" },
      ]),
      ...at(3, [
        { d: circle(35, 30, 9), paint: "green" },
        { d: circle(65, 30, 9), paint: "green" },
      ]),
      ...at(1, [{ d: ellipse(50, 44, 25, 15), paint: "green" }]),
      ...at(3, [
        { d: circle(35, 30, 5.5), paint: "white" },
        { d: circle(65, 30, 5.5), paint: "white" },
        ...eye(35, 31, 3),
        ...eye(65, 31, 3),
      ]),
      ...at(4, [
        { d: "M34 47 Q50 58 66 47" },
        { d: circle(30, 47, 3.2), paint: "pink" },
        { d: circle(70, 47, 3.2), paint: "pink" },
        { d: circle(47, 41, 0.8), fill: "ink" },
        { d: circle(53, 41, 0.8), fill: "ink" },
      ]),
    ],
  },
  {
    id: "pig",
    name: { en: "pig", fr: "cochon", es: "cerdo", pt: "porco" },
    a: { en: "a pig", fr: "un cochon", es: "un cerdo", pt: "um porco" },
    shapes: [
      ...at(2, [
        { d: "M29 34 L24 12 L44 25 Z", paint: "pink" },
        { d: "M71 34 L76 12 L56 25 Z", paint: "pink" },
      ]),
      ...at(1, [{ d: circle(50, 50, 28), paint: "pink" }]),
      ...at(3, [
        { d: ellipse(50, 58, 12, 8.5), paint: "pink" },
        { d: ellipse(45.5, 58, 2, 3), fill: "ink" },
        { d: ellipse(54.5, 58, 2, 3), fill: "ink" },
      ]),
      ...at(4, [...eye(39, 44, 3), ...eye(61, 44, 3), { d: "M43 71 Q50 75 57 71" }]),
    ],
  },
  {
    id: "rabbit",
    name: { en: "rabbit", fr: "lapin", es: "conejo", pt: "coelho" },
    a: { en: "a rabbit", fr: "un lapin", es: "un conejo", pt: "um coelho" },
    shapes: [
      ...at(3, [
        { d: ellipse(50, 78, 17, 15), paint: "grey" },
        { d: ellipse(50, 81, 9, 9), paint: "white" },
        { d: ellipse(39, 93, 7.5, 4), paint: "grey" },
        { d: ellipse(61, 93, 7.5, 4), paint: "grey" },
      ]),
      ...at(2, [
        { d: ellipse(41, 22, 6.5, 18), paint: "grey" },
        { d: ellipse(59, 22, 6.5, 18), paint: "grey" },
        { d: ellipse(41, 23, 3, 12.5), paint: "pink" },
        { d: ellipse(59, 23, 3, 12.5), paint: "pink" },
      ]),
      ...at(1, [{ d: circle(50, 50, 18), paint: "grey" }]),
      ...at(4, [
        ...eye(43, 46, 2.6),
        ...eye(57, 46, 2.6),
        { d: "M47.5 53 L52.5 53 L50 56 Z", paint: "pink" },
        { d: "M50 56 Q47.5 59.5 45 57.5 M50 56 Q52.5 59.5 55 57.5" },
      ]),
      ...at(5, [
        { d: "M38 54 L28 52.5 M38 57 L28 58 M62 54 L72 52.5 M62 57 L72 58", width: 0.5 },
        { d: "M47.5 58.3 L47.5 62 L52.5 62 L52.5 58.3", width: 0.6 },
      ]),
    ],
  },
  {
    id: "duck",
    name: { en: "duck", fr: "canard", es: "pato", pt: "pato" },
    a: { en: "a duck", fr: "un canard", es: "un pato", pt: "um pato" },
    // Side on, swimming right.
    shapes: [
      ...at(4, [{ d: "M24 58 L10 48 L16 66 Z", paint: "yellow" }]),
      ...at(1, [{ d: ellipse(46, 64, 28, 17), paint: "yellow" }]),
      ...at(3, [{ d: "M80 33 L95 37 L80 42 Z", paint: "orange" }]),
      ...at(2, [{ d: circle(70, 36, 12), paint: "yellow" }]),
      ...at(3, [...eye(73, 33, 2.5)]),
      ...at(4, [{ d: "M30 62 C36 52 52 52 60 61 C52 71 38 71 30 62 Z", paint: "yellow" }]),
      ...at(5, [{ d: "M6 86 Q13 82 20 86 Q27 90 34 86 Q41 82 48 86 Q55 90 62 86 Q69 82 76 86 Q83 90 90 86", width: 0.7 }]),
    ],
  },
  {
    id: "ladybug",
    name: { en: "ladybug", fr: "coccinelle", es: "catarina", pt: "joaninha" },
    a: { en: "a ladybug", fr: "une coccinelle", es: "una catarina", pt: "uma joaninha" },
    // Seen from above.
    shapes: [
      ...at(5, [
        { d: "M22 48 L12 44 M21 60 L10 60 M23 72 L13 77 M78 48 L88 44 M79 60 L90 60 M77 72 L87 77", width: 0.8 },
        { d: "M45 18 C43 12 40 9 35 8 M55 18 C57 12 60 9 65 8", width: 0.6 },
        { d: circle(35, 8, 1.6), fill: "ink" },
        { d: circle(65, 8, 1.6), fill: "ink" },
      ]),
      ...at(2, [{ d: circle(50, 27, 12), paint: "grey" }]),
      ...at(1, [{ d: circle(50, 58, 30), paint: "red" }]),
      ...at(3, [{ d: "M50 28 L50 88", width: 0.7 }]),
      ...at(4, [
        [37, 44], [63, 44], [32, 62], [68, 62], [40, 77], [60, 77],
      ].map(([x, y]): ArtShape => ({ d: circle(x, y, 4.5), fill: "ink" }))),
      ...at(5, [
        { d: circle(45, 23, 2.6), paint: "white" },
        { d: circle(55, 23, 2.6), paint: "white" },
        ...eye(45, 23.5, 1.4),
        ...eye(55, 23.5, 1.4),
      ]),
    ],
  },
  {
    id: "penguin",
    name: { en: "penguin", fr: "pingouin", es: "pingüino", pt: "pinguim" },
    a: { en: "a penguin", fr: "un pingouin", es: "un pingüino", pt: "um pinguim" },
    shapes: [
      ...at(5, [
        { d: ellipse(41, 91, 8, 4), paint: "orange" },
        { d: ellipse(59, 91, 8, 4), paint: "orange" },
      ]),
      ...at(1, [{ d: ellipse(50, 54, 24, 36), paint: "blue" }]),
      ...at(3, [
        { d: "M27.5 44 C18 56 18 70 24 78 C28 72 30 60 30 50 Z", paint: "blue" },
        { d: "M72.5 44 C82 56 82 70 76 78 C72 72 70 60 70 50 Z", paint: "blue" },
      ]),
      ...at(2, [{ d: "M50 30 C40 26 33 34 34 44 C32 56 32 72 38 82 C44 88 56 88 62 82 C68 72 68 56 66 44 C67 34 60 26 50 30 Z", paint: "white" }]),
      ...at(4, [
        ...eye(44, 38, 2.4),
        ...eye(56, 38, 2.4),
        { d: "M45.5 44 L54.5 44 L50 50 Z", paint: "orange" },
        { d: circle(39, 47, 2.6), paint: "pink" },
        { d: circle(61, 47, 2.6), paint: "pink" },
      ]),
    ],
  },
  {
    id: "cloud",
    name: { en: "cloud", fr: "nuage", es: "nube", pt: "nuvem" },
    a: { en: "a cloud", fr: "un nuage", es: "una nube", pt: "uma nuvem" },
    shapes: [
      ...at(1, [{ d: "M22 66 C12 66 9 52 19 49 C17 38 29 31 38 36 C42 23 62 21 66 35 C76 31 88 39 83 50 C93 52 91 66 80 66 Z", paint: "grey" }]),
      ...at(2, [...eye(40, 50, 2.8), ...eye(60, 50, 2.8)]),
      ...at(3, [
        { d: "M44 57 Q50 62 56 57" },
        { d: circle(33, 56, 3), paint: "pink" },
        { d: circle(67, 56, 3), paint: "pink" },
      ]),
      ...at(4, [
        [28, 76], [44, 80], [60, 76], [74, 82], [36, 90], [54, 92],
      ].map(([x, y]): ArtShape => ({ d: `M${x} ${y - 5} C${x - 2.5} ${y - 1} ${x - 3} ${y + 2} ${x} ${y + 2} C${x + 3} ${y + 2} ${x + 2.5} ${y - 1} ${x} ${y - 5} Z`, paint: "blue" }))),
    ],
  },
  {
    id: "rainbow",
    name: { en: "rainbow", fr: "arc-en-ciel", es: "arcoíris", pt: "arco-íris" },
    a: { en: "a rainbow", fr: "un arc-en-ciel", es: "un arcoíris", pt: "um arco-íris" },
    shapes: [
      ...at(1, [{ d: arch(50, 72, 32, 42), paint: "red" }]),
      ...at(2, [{ d: arch(50, 72, 22, 32), paint: "yellow" }]),
      ...at(3, [{ d: arch(50, 72, 12, 22), paint: "blue" }]),
      ...at(4, [
        { d: "M6 80 C1 80 1 72 6 71 C6 64 14 62 18 66 C22 60 32 62 31 70 C36 71 36 80 31 80 Z", paint: "white" },
        { d: "M69 80 C64 80 64 72 69 71 C69 64 77 62 81 66 C85 60 95 62 94 70 C99 71 99 80 94 80 Z", paint: "white" },
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
