// Our own line drawings for the dot-to-dot and colouring sheets, drawn in a
// 100 × 100 box (y down). Every drawing has:
//   outline  one closed path: the dots of the dot-to-dot sheets follow it,
//            and it is the first colouring region (in `paint`)
//   regions  more closed shapes, painted in order on top of the outline
//            (`clip`: cut to the outline; `under`: painted before it)
//   details  eyes, mouths, lines: printed on every sheet, never numbered
//   start    where dot 1 goes (the dots then run clockwise)
// On dot-to-dot sheets the clipped regions are left out (they'd float
// without the outline); the others are printed as part of the picture.
import { circle, ellipse } from "@/lib/sheets/geometry";
import type { L10n } from "@/lib/sheets/types";
import type { ColourId } from "./vocab";

/** The colours of the colouring sheets: the seven of vocab.ts, plus brown and grey. */
export type Paint = ColourId | "brown" | "grey";

export type DrawingRegion = { d: string; paint: Paint; clip?: boolean; under?: boolean };
/** A line (stroke only), or a small shape filled in ink or white (eyes, noses). */
export type DrawingDetail = { d: string; fill?: "ink" | "white"; width?: number };

export type Drawing = {
  id: string;
  /** The subject's name, without article. */
  name: L10n;
  /** With the definite article ("le chat", "la manzana"). */
  the: L10n;
  outline: string;
  paint: Paint;
  regions: DrawingRegion[];
  details: DrawingDetail[];
  start: { x: number; y: number };
};

/** An eye: white, with a big pupil and a highlight. */
function eye(x: number, y: number, r: number): DrawingDetail[] {
  return [
    { d: circle(x, y, r), fill: "ink" },
    { d: circle(x - r * 0.32, y - r * 0.35, r * 0.34), fill: "white" },
  ];
}

export const DRAWINGS: Drawing[] = [
  {
    id: "cat",
    name: { en: "cat", fr: "chat", es: "gato", pt: "gato" },
    the: { en: "the cat", fr: "le chat", es: "el gato", pt: "o gato" },
    // Sitting, facing us, the tail curled up on the right.
    outline:
      "M30 8 L41 23 Q50 20 59 23 L70 8 L73 29 C80 37 80 49 71 56 C77 61 79 68 79 74 C82 70 84 64 85 58 C86 53 92 53 92 58 C93 72 90 88 78 94 L24 94 C19 88 19 66 29 56 C20 49 20 37 27 29 Z",
    paint: "orange",
    regions: [
      // Inner ears.
      { d: "M31 13 L38 22.5 L29.5 26 Z", paint: "pink" },
      { d: "M69 13 L62 22.5 L70.5 26 Z", paint: "pink" },
      // Collar and bell.
      { d: "M15 54 Q50 66 85 54 L85 60 Q50 72 15 60 Z", paint: "red", clip: true },
      { d: circle(50, 70.5, 4), paint: "yellow" },
      // Belly and tail tip.
      { d: ellipse(50, 84, 13, 8), paint: "yellow" },
      { d: "M80 62 L100 62 L100 40 L80 40 Z", paint: "brown", clip: true },
    ],
    details: [
      ...eye(41, 39, 3.6),
      ...eye(59, 39, 3.6),
      { d: "M47.5 45 L52.5 45 L50 48 Z", fill: "ink" },
      { d: "M50 48 Q47 51.5 44.5 49.5 M50 48 Q53 51.5 55.5 49.5", width: 1 },
      { d: "M35 46 L27 44.5 M35 48.5 L27 49.5 M65 46 L73 44.5 M65 48.5 L73 49.5", width: 0.8 },
    ],
    start: { x: 30, y: 8 },
  },
  {
    id: "fish",
    name: { en: "fish", fr: "poisson", es: "pez", pt: "peixe" },
    the: { en: "the fish", fr: "le poisson", es: "el pez", pt: "o peixe" },
    // Swimming left: round body, fins on top and below, a big tail.
    outline:
      "M8 52 C11 36 27 27 44 26 C49 18 58 13 67 15 C64 21 63 26 64 30 C70 34 74 38 77 43 L93 28 C88 42 88 60 93 74 L77 59 C72 67 62 73 54 75 C55 81 51 86 44 86 C45 81 43 78 41 76 C25 75 11 66 8 52 Z",
    paint: "blue",
    regions: [
      // Stripes, then the tail and fins over them, so the fins stay whole.
      { d: "M34 20 C30 40 30 62 34 82 L42 82 C38 62 38 40 42 20 Z", paint: "yellow", clip: true },
      { d: "M53 20 C49 40 49 62 53 82 L61 82 C57 62 57 40 61 20 Z", paint: "yellow", clip: true },
      { d: "M78 28 C73 42 73 60 78 76 L100 85 L100 20 Z", paint: "orange", clip: true },
      { d: "M44 28.5 Q55 25 66 31 L72 8 L40 8 Z", paint: "orange", clip: true },
      { d: "M40 74.5 Q47 77 55 73.5 L57 92 L36 92 Z", paint: "orange", clip: true },
    ],
    details: [
      { d: circle(22, 45, 5.2), fill: "white", width: 1.2 },
      { d: circle(23, 45.5, 2.8), fill: "ink" },
      { d: circle(22, 44.2, 0.9), fill: "white" },
      { d: "M11.5 56 Q15 59 19 57", width: 1.1 },
    ],
    start: { x: 8, y: 52 },
  },
  {
    id: "apple",
    name: { en: "apple", fr: "pomme", es: "manzana", pt: "maçã" },
    the: { en: "the apple", fr: "la pomme", es: "la manzana", pt: "a maçã" },
    // Two lobes on top, a stem and a leaf.
    outline:
      "M50 33 C58 24 80 22 86 42 C91 60 81 86 67 91 C61 93 56 91 50 89 C44 91 39 93 33 91 C19 86 9 60 14 42 C20 22 42 24 50 33 Z",
    paint: "red",
    regions: [
      { d: "M47 34 C47 26 48 19 52 12 L57 14 C53 20 52.5 27 53 34 Z", paint: "brown", under: true },
      { d: "M55 19 C60 9 72 7 78 11 C74 19 64 23 55 19 Z", paint: "green" },
      // A shine on the left lobe (colouring sheets only: on its own it reads as a stray shape).
      { d: "M22 44 C24 36 30 32 36 32 C33 36 28 41 27 48 C26 52 21 51 22 44 Z", paint: "pink", clip: true },
    ],
    details: [{ d: "M56 18 C62 15 68 13 74 12", width: 0.9 }],
    start: { x: 50, y: 33 },
  },
  {
    id: "car",
    name: { en: "car", fr: "voiture", es: "carro", pt: "carro" },
    the: { en: "the car", fr: "la voiture", es: "el carro", pt: "o carro" },
    // Side view, driving right. The wheels are tucked under the body (only
    // their lower half shows), so even 10 dots draw a clear car body.
    outline:
      "M8 72 L8 58 C8 52 12 49.5 19 49 L28 48 C32 34 38 28 50 28 L62 28 C70 28 75 34 80 46 C88 47 93 51 93 58 L93 72 Z",
    paint: "red",
    regions: [
      // Wheels and hubcaps.
      { d: circle(73, 74, 9), paint: "grey", under: true },
      { d: circle(27, 74, 9), paint: "grey", under: true },
      { d: circle(73, 74, 4.2), paint: "yellow", under: true },
      { d: circle(27, 74, 4.2), paint: "yellow", under: true },
      // Windows.
      { d: "M33 47 C36 38 41 33.5 48 33.5 L48 47 Z", paint: "blue" },
      { d: "M53 33.5 L61 33.5 C67 33.5 70.5 38 74 47 L53 47 Z", paint: "blue" },
    ],
    details: [
      { d: "M50.5 50 L50.5 66", width: 0.9 },
      { d: "M42 54 L46 54 M56 54 L60 54", width: 1.1 },
      { d: ellipse(88.5, 55, 2.2, 2.6), fill: "white", width: 1 },
    ],
    start: { x: 8, y: 72 },
  },
  {
    id: "butterfly",
    name: { en: "butterfly", fr: "papillon", es: "mariposa", pt: "borboleta" },
    the: { en: "the butterfly", fr: "le papillon", es: "la mariposa", pt: "a borboleta" },
    // Wings open, seen from above; antennae on top.
    outline:
      "M50 24 C53 24 55 27 55 30 C62 16 78 8 88 12 C96 16 94 34 86 42 C82 46 74 48 66 49 C78 54 86 64 82 76 C78 86 64 86 58 76 L55 80 C55 83 53 86 50 86 C47 86 45 83 45 80 L42 76 C36 86 22 86 18 76 C14 64 22 54 34 49 C26 48 18 46 14 42 C6 34 4 16 12 12 C22 8 38 16 45 30 C45 27 47 24 50 24 Z",
    paint: "purple",
    regions: [
      // Lower wings in another colour.
      { d: "M53 49 L100 49 L100 100 L53 100 Z", paint: "blue", clip: true },
      { d: "M47 49 L0 49 L0 100 L47 100 Z", paint: "blue", clip: true },
      // Spots.
      { d: circle(76, 27, 7), paint: "yellow" },
      { d: circle(24, 27, 7), paint: "yellow" },
      { d: circle(70, 69, 5.5), paint: "pink" },
      { d: circle(30, 69, 5.5), paint: "pink" },
      // Body.
      // Its ends follow the outline, so no sliver of wing shows above or below it.
      { d: "M45 30 C45 27 47 24 50 24 C53 24 55 27 55 30 L55 80 C55 83 53 86 50 86 C47 86 45 83 45 80 Z", paint: "brown" },
    ],
    details: [
      { d: "M47.5 25.5 C46 18 43 13 37 10 M52.5 25.5 C54 18 57 13 63 10", width: 1 },
      { d: circle(37, 10, 1.6), fill: "ink" },
      { d: circle(63, 10, 1.6), fill: "ink" },
    ],
    start: { x: 50, y: 86 },
  },
  {
    id: "rocket",
    name: { en: "rocket", fr: "fusée", es: "cohete", pt: "foguete" },
    the: { en: "the rocket", fr: "la fusée", es: "el cohete", pt: "o foguete" },
    // Standing up, with a round window, two fins and a flame.
    outline:
      "M50 5 C60 13 66 27 66 43 L66 60 L80 73 L80 88 L66 80 C60 82 40 82 34 80 L20 88 L20 73 L34 60 L34 43 C34 27 40 13 50 5 Z",
    paint: "blue",
    regions: [
      { d: "M42 85 C42 92 47 96 50 99 C53 96 58 92 58 85 Z", paint: "orange", under: true },
      { d: "M39 78 L61 78 L59 87 L41 87 Z", paint: "grey", under: true },
      // Nose cone and fins.
      { d: "M30 27 Q50 22 70 27 L70 0 L30 0 Z", paint: "red", clip: true },
      { d: "M66 55 L100 55 L100 100 L66 100 Z", paint: "red", clip: true },
      { d: "M34 55 L0 55 L0 100 L34 100 Z", paint: "red", clip: true },
      // Window.
      { d: circle(50, 46, 8.5), paint: "yellow" },
    ],
    details: [{ d: "M45 43 Q46.5 39.5 50 39", width: 1.2 }],
    start: { x: 50, y: 5 },
  },
];

export function getDrawing(id: string): Drawing {
  const d = DRAWINGS.find((x) => x.id === id);
  if (!d) throw new Error(`No drawing "${id}"`);
  return d;
}
