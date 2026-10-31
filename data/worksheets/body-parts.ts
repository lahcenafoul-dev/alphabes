// Body parts worksheets, drawn by scripts/sheets/art-layout.ts: a drawing in
// the middle and a box for each part, left and right (above and below for a
// wide subject). Two versions:
//   label  a line from each part to an empty box, and a word bank to copy from
//   match  the words are printed in the boxes, mixed up: draw a line from
//          each word to the dot on its part
// The words are what children of 4 to 8 say, with the article in French,
// Spanish and Portuguese (they learn the noun with it).
import { circle, ellipse } from "@/lib/sheets/geometry";
import { slugify, type L10n, type Sheet, type SheetKind } from "@/lib/sheets/types";
import { HOW_TO_DRAW, eye, type ArtShape } from "./how-to-draw";

/** A part to name: its word, the point its line starts from, and the side its box is on. */
export type BodyLabel = { word: L10n; at: [number, number]; side: "left" | "right" | "top" | "bottom" };

export type BodySubject = {
  id: string;
  /** "the parts of the body": the sheet's topic, with its article. */
  topic: L10n;
  /** Back to front, in a 100 × 100 box (y down). */
  shapes: ArtShape[];
  labels: BodyLabel[];
};

const W = {
  hair: { en: "hair", fr: "les cheveux", es: "el pelo", pt: "o cabelo" },
  ear: { en: "ear", fr: "l'oreille", es: "la oreja", pt: "a orelha" },
  eye: { en: "eye", fr: "l'œil", es: "el ojo", pt: "o olho" },
  mouth: { en: "mouth", fr: "la bouche", es: "la boca", pt: "a boca" },
  neck: { en: "neck", fr: "le cou", es: "el cuello", pt: "o pescoço" },
  arm: { en: "arm", fr: "le bras", es: "el brazo", pt: "o braço" },
  hand: { en: "hand", fr: "la main", es: "la mano", pt: "a mão" },
  leg: { en: "leg", fr: "la jambe", es: "la pierna", pt: "a perna" },
  foot: { en: "foot", fr: "le pied", es: "el pie", pt: "o pé" },
  eyebrow: { en: "eyebrow", fr: "le sourcil", es: "la ceja", pt: "a sobrancelha" },
  nose: { en: "nose", fr: "le nez", es: "la nariz", pt: "o nariz" },
  cheek: { en: "cheek", fr: "la joue", es: "la mejilla", pt: "a bochecha" },
  chin: { en: "chin", fr: "le menton", es: "la barbilla", pt: "o queixo" },
  teeth: { en: "teeth", fr: "les dents", es: "los dientes", pt: "os dentes" },
  thumb: { en: "thumb", fr: "le pouce", es: "el pulgar", pt: "o polegar" },
  finger: { en: "finger", fr: "le doigt", es: "el dedo", pt: "o dedo" },
  littleFinger: { en: "little finger", fr: "le petit doigt", es: "el meñique", pt: "o mindinho" },
  nail: { en: "nail", fr: "l'ongle", es: "la uña", pt: "a unha" },
  wrist: { en: "wrist", fr: "le poignet", es: "la muñeca", pt: "o pulso" },
  // Animals and plants.
  head: { en: "head", fr: "la tête", es: "la cabeza", pt: "a cabeça" },
  body: { en: "body", fr: "le corps", es: "el cuerpo", pt: "o corpo" },
  beak: { en: "beak", fr: "le bec", es: "el pico", pt: "o bico" },
  wing: { en: "wing", fr: "l'aile", es: "el ala", pt: "a asa" },
  legs: { en: "legs", fr: "les pattes", es: "las patas", pt: "as patas" },
  animalLeg: { en: "leg", fr: "la patte", es: "la pata", pt: "a pata" },
  paw: { en: "paw", fr: "la patte", es: "la pata", pt: "a pata" },
  antenna: { en: "antenna", fr: "l'antenne", es: "la antena", pt: "a antena" },
  stripes: { en: "stripes", fr: "les rayures", es: "las rayas", pt: "as listras" },
  stinger: { en: "stinger", fr: "le dard", es: "el aguijón", pt: "o ferrão" },
  tongue: { en: "tongue", fr: "la langue", es: "la lengua", pt: "a língua" },
  whiskers: { en: "whiskers", fr: "les moustaches", es: "los bigotes", pt: "os bigodes" },
  claw: { en: "claw", fr: "la pince", es: "la pinza", pt: "a garra" },
  shell: { en: "shell", fr: "la carapace", es: "el caparazón", pt: "a carapaça" },
  mane: { en: "mane", fr: "la crinière", es: "la crin", pt: "a crina" },
  hoof: { en: "hoof", fr: "le sabot", es: "el casco", pt: "o casco" },
  spots: { en: "spots", fr: "les taches", es: "las manchas", pt: "as manchas" },
  gills: { en: "gills", fr: "les branchies", es: "las branquias", pt: "as brânquias" },
  fin: { en: "fin", fr: "la nageoire", es: "la aleta", pt: "a nadadeira" },
  tail: { en: "tail", fr: "la queue", es: "la cola", pt: "a cauda" },
  scales: { en: "scales", fr: "les écailles", es: "las escamas", pt: "as escamas" },
  petal: { en: "petal", fr: "le pétale", es: "el pétalo", pt: "a pétala" },
  centre: { en: "center", fr: "le cœur", es: "el centro", pt: "o miolo" },
  stem: { en: "stem", fr: "la tige", es: "el tallo", pt: "o caule" },
  leaf: { en: "leaf", fr: "la feuille", es: "la hoja", pt: "a folha" },
  roots: { en: "roots", fr: "les racines", es: "las raíces", pt: "as raízes" },
} satisfies Record<string, L10n>;

/** The how-to-draw subject's finished picture. */
const finished = (id: string): ArtShape[] => HOW_TO_DRAW.find((h) => h.id === id)!.shapes.map(({ step: _, ...s }) => s);

/** "the parts of a dog", in every language. */
const partsOf = (en: string, fr: string, es: string, pt: string): L10n => ({
  en: `the parts of ${en}`,
  fr: `les parties ${fr}`,
  es: `las partes ${es}`,
  pt: `as partes ${pt}`,
});

export const BODY_SUBJECTS: BodySubject[] = [
  {
    id: "body",
    topic: partsOf("the body", "du corps", "del cuerpo", "do corpo"),
    // A child standing, arms a little away from the body.
    shapes: [
      { d: "M41 37 Q33 47 25 59 L30 62 Q37 52 43 45 Z" },
      { d: "M59 37 Q67 47 75 59 L70 62 Q63 52 57 45 Z" },
      { d: circle(26.5, 62.5, 4.5) },
      { d: circle(73.5, 62.5, 4.5) },
      { d: "M41 70 L40.5 89 L48 89 L49 70 Z" },
      { d: "M51 70 L52 89 L59.5 89 L59 70 Z" },
      { d: "M48 87 L48 94 L34 94 Q33 88.5 40 87 Z" },
      { d: "M52 87 L52 94 L66 94 Q67 88.5 60 87 Z" },
      { d: "M46 29 L54 29 L54 38 L46 38 Z" },
      { d: "M39 37 Q50 34 61 37 L63 71 L37 71 Z" },
      { d: circle(37, 23, 3.2) },
      { d: circle(63, 23, 3.2) },
      { d: circle(50, 17, 13.5) },
      // Hair: a fringe and three tufts on top.
      {
        d: "M36.8 16 C36 8 40 3.6 45 3 L43.5 -2 L48.5 2.4 L51 -3 L53 2.6 L58 -1 L56.8 4 C61 6 64 10 63.2 16 C61.5 12 59 10.5 56 11.5 C54 9 50.5 9 48.5 11.5 C46 9.5 42 10 40 13 C38.5 13.5 37.5 14.5 36.8 16 Z",
      },
      { d: circle(45, 17, 2.7) },
      { d: circle(55, 17, 2.7) },
      ...eye(45.4, 17.4, 1.5),
      ...eye(55.4, 17.4, 1.5),
      { d: "M50 20 Q52 22.5 50 23.5" },
      { d: "M45 25.5 Q50 29.5 55 25.5" },
    ],
    labels: [
      { word: W.hair, at: [41, 6.5], side: "left" },
      { word: W.ear, at: [34, 23], side: "left" },
      { word: W.mouth, at: [50, 27.5], side: "left" },
      { word: W.hand, at: [23, 64], side: "left" },
      { word: W.foot, at: [37, 91.5], side: "left" },
      // On the white of the eye, where the dot shows.
      { word: W.eye, at: [57.4, 17.8], side: "right" },
      { word: W.neck, at: [53, 33], side: "right" },
      { word: W.arm, at: [67, 49], side: "right" },
      { word: W.leg, at: [56, 80], side: "right" },
    ],
  },
  {
    id: "face",
    topic: partsOf("the face", "du visage", "de la cara", "do rosto"),
    shapes: [
      { d: "M41 76 L59 76 L59 96 L41 96 Z" },
      { d: circle(21, 50, 5) },
      { d: circle(79, 50, 5) },
      { d: ellipse(50, 50, 29, 33) },
      {
        d: "M24 31 C25 23 31 18 40 16 L37.5 8.5 L46 13.5 L50 5 L54 13.5 L62.5 8.5 L60 16 C69 18 75 23 76 31 C73 28 68 27 62 29 C58 25 50 24 44 28.5 C36 26 29 27 24 31 Z",
      },
      { d: "M32 37 Q37.5 33 43 36 M57 36 Q62.5 33 68 37", width: 1.2 },
      { d: circle(38, 45, 4.2) },
      { d: circle(62, 45, 4.2) },
      ...eye(38.5, 45.5, 2.1),
      ...eye(62.5, 45.5, 2.1),
      { d: "M50 49 Q45.5 57 49.5 58.5 Q52 59 53.5 57.5" },
      { d: circle(30, 64.5, 4) },
      { d: circle(70, 64.5, 4) },
      { d: "M37 67 Q50 83 63 67 Z", fill: "ink" },
      { d: "M40.5 68 L59.5 68 Q59 71.5 57 72.5 L43 72.5 Q41 71.5 40.5 68 Z" },
    ],
    labels: [
      { word: W.hair, at: [31, 23.5], side: "left" },
      { word: W.eyebrow, at: [34.75, 35.44], side: "left" },
      { word: W.cheek, at: [28, 66], side: "left" },
      { word: W.teeth, at: [45, 70.5], side: "left" },
      { word: W.eye, at: [65.44, 42.59], side: "right" },
      { word: W.nose, at: [52, 58.9], side: "right" },
      { word: W.mouth, at: [55, 75], side: "right" },
      { word: W.chin, at: [58, 81.7], side: "right" },
    ],
  },
  {
    id: "hand",
    topic: partsOf("the hand", "de la main", "de la mano", "da mão"),
    // The back of a hand, fingers up.
    shapes: [
      {
        d: "M37 98 L37 84 C33 80 30 74 28 68 L16 54 C12 49 18 43 23 47 L30 54 L30 26 C30 20 40 20 40 26 L40 44 L42 44 L42 18 C42 12 52 12 52 18 L52 44 L54 44 L54 22 C54 16 64 16 64 22 L64 46 L66 46 L66 32 C66 27 74 27 74 32 L74 66 C74 76 68 82 64 85 L64 98 Z",
      },
      { d: "M32.5 25 C32.5 21.5 37.5 21.5 37.5 25 L37.5 29 L32.5 29 Z" },
      { d: "M44.5 17 C44.5 13.5 49.5 13.5 49.5 17 L49.5 21 L44.5 21 Z" },
      { d: "M56.5 21 C56.5 17.5 61.5 17.5 61.5 21 L61.5 25 L56.5 25 Z" },
      { d: "M68 31.5 C68 28.5 72 28.5 72 31.5 L72 35 L68 35 Z" },
      { d: "M33 66 Q36 64 39 66 M45 66 Q48 64 51 66 M57 66 Q60 64 63 66", width: 0.6 },
      { d: "M33 92 L68 92 L68 100 L33 100 Z" },
    ],
    labels: [
      { word: W.thumb, at: [18, 50], side: "left" },
      { word: W.finger, at: [35, 38], side: "left" },
      { word: W.wrist, at: [45, 88], side: "left" },
      { word: W.nail, at: [59, 22.5], side: "right" },
      { word: W.littleFinger, at: [70, 44], side: "right" },
    ],
  },
  {
    id: "fish",
    topic: partsOf("a fish", "du poisson", "del pez", "do peixe"),
    shapes: finished("fish"),
    labels: [
      { word: W.eye, at: [28.4, 47.6], side: "top" },
      { word: W.fin, at: [48, 27], side: "top" },
      { word: W.scales, at: [67, 44], side: "top" },
      { word: W.mouth, at: [19.5, 53], side: "bottom" },
      { word: W.gills, at: [39.3, 61.5], side: "bottom" },
      { word: W.tail, at: [84, 56], side: "bottom" },
    ],
  },
  {
    id: "bird",
    topic: partsOf("a bird", "de l'oiseau", "del pájaro", "do passarinho"),
    shapes: finished("bird"),
    labels: [
      { word: W.eye, at: [33.5, 34.45], side: "top" },
      { word: W.beak, at: [17, 39.5], side: "left" },
      { word: W.wing, at: [52, 58], side: "left" },
      { word: W.legs, at: [48.5, 84], side: "left" },
      { word: W.tail, at: [88, 49], side: "right" },
    ],
  },
  {
    id: "bee",
    topic: partsOf("a bee", "de l'abeille", "de la abeja", "da abelha"),
    shapes: finished("bee"),
    labels: [
      { word: W.antenna, at: [13, 31], side: "left" },
      { word: W.eye, at: [20.6, 51], side: "left" },
      { word: W.head, at: [26, 63], side: "left" },
      { word: W.legs, at: [42.5, 76], side: "left" },
      { word: W.wing, at: [69, 23], side: "right" },
      { word: W.stripes, at: [64, 66], side: "right" },
      { word: W.stinger, at: [84, 56], side: "right" },
    ],
  },
  {
    id: "dog",
    topic: partsOf("a dog", "du chien", "del perro", "do cachorro"),
    shapes: finished("dog"),
    labels: [
      { word: W.eye, at: [23.4, 34], side: "left" },
      { word: W.nose, at: [9, 41.5], side: "left" },
      { word: W.tongue, at: [19.5, 53], side: "left" },
      { word: W.paw, at: [43.5, 87], side: "left" },
      { word: W.ear, at: [38, 29], side: "right" },
      { word: W.tail, at: [90.5, 40], side: "right" },
    ],
  },
  {
    id: "cat",
    topic: partsOf("a cat", "du chat", "del gato", "do gato"),
    shapes: finished("cat"),
    labels: [
      { word: W.ear, at: [36, 14], side: "left" },
      { word: W.eye, at: [39.8, 31], side: "left" },
      { word: W.paw, at: [37, 93], side: "left" },
      { word: W.whiskers, at: [71, 40], side: "right" },
      { word: W.tail, at: [85, 70], side: "right" },
    ],
  },
  {
    id: "crab",
    topic: partsOf("a crab", "du crabe", "del cangrejo", "do caranguejo"),
    shapes: [
      { d: "M28 62 Q16 62 10 70 M28 68 Q18 72 15 80 M31 73 Q24 79 23 87 M72 62 Q84 62 90 70 M72 68 Q82 72 85 80 M69 73 Q76 79 77 87", width: 1.3 },
      { d: "M33 52 Q22 47 22 37 M67 52 Q78 47 78 37", width: 1.3 },
      { d: "M22 39 C12 39 6 29 10 20 L18 26 L17 16 C26 16 31 30 22 39 Z" },
      { d: "M78 39 C88 39 94 29 90 20 L82 26 L83 16 C74 16 69 30 78 39 Z" },
      { d: "M44 46 L42 33 M56 46 L58 33", width: 1.1 },
      { d: circle(42, 30, 4.5) },
      { d: circle(58, 30, 4.5) },
      ...eye(42, 30.5, 2.2),
      ...eye(58, 30.5, 2.2),
      { d: ellipse(50, 60, 24, 16) },
      { d: "M44 66 Q50 71 56 66" },
    ],
    labels: [
      { word: W.claw, at: [12, 25], side: "left" },
      { word: W.legs, at: [13, 75.5], side: "left" },
      { word: W.eye, at: [44, 26.2], side: "top" },
      { word: W.shell, at: [66, 55], side: "right" },
      { word: W.mouth, at: [50, 69.5], side: "bottom" },
    ],
  },
  {
    id: "horse",
    topic: partsOf("a horse", "du cheval", "del caballo", "do cavalo"),
    // Side on, looking left.
    shapes: [
      { d: "M80 44 C90 46 95 58 91 76 C87 72 85 62 80 54 Z" },
      { d: "M38 52 L38 84 L45 84 L45 52 Z" },
      { d: "M48 54 L48 84 L55 84 L55 54 Z" },
      { d: "M63 54 L63 84 L70 84 L70 54 Z" },
      { d: "M73 52 L73 84 L80 84 L80 52 Z" },
      { d: "M37.5 84 L45.5 84 L46 90 L37 90 Z" },
      { d: "M47.5 84 L55.5 84 L56 90 L47 90 Z" },
      { d: "M62.5 84 L70.5 84 L71 90 L62 90 Z" },
      { d: "M72.5 84 L80.5 84 L81 90 L72 90 Z" },
      { d: "M30 22 L42 17 L54 44 L38 52 Z" },
      { d: ellipse(60, 50, 24, 13) },
      { d: "M29 15 L31 4.5 L37 13 Z" },
      { d: "M24 14 C32 10 42 14 41 22 C40 28 32 32 26 38 C22 42 14 42 12 37 C10 32 14 27 18 22 C19 18 20 16 24 14 Z" },
      { d: "M37 12 C45 12 51 22 55 30 C58 36 60 39 62 42 L54 44 L42 18 Z" },
      ...eye(29, 22, 1.9),
      { d: circle(15.5, 35, 1), fill: "ink" },
    ],
    labels: [
      { word: W.ear, at: [32, 10], side: "left" },
      { word: W.eye, at: [27.1, 22], side: "left" },
      { word: W.animalLeg, at: [41.5, 70], side: "left" },
      { word: W.mane, at: [52, 32], side: "right" },
      { word: W.tail, at: [90, 66], side: "right" },
      { word: W.hoof, at: [77, 87], side: "right" },
    ],
  },
  {
    id: "butterfly",
    topic: partsOf("a butterfly", "du papillon", "de la mariposa", "da borboleta"),
    shapes: finished("butterfly"),
    labels: [
      { word: W.head, at: [50, 30], side: "top" },
      { word: W.wing, at: [15, 24], side: "left" },
      { word: W.spots, at: [34, 73], side: "left" },
      { word: W.antenna, at: [62, 12.5], side: "right" },
      { word: W.body, at: [50, 79], side: "bottom" },
    ],
  },
  {
    id: "turtle",
    topic: partsOf("a turtle", "de la tortue", "de la tortuga", "da tartaruga"),
    shapes: finished("turtle"),
    labels: [
      { word: W.shell, at: [24, 44], side: "left" },
      { word: W.tail, at: [9, 62.5], side: "left" },
      { word: W.animalLeg, at: [29, 75], side: "left" },
      { word: W.eye, at: [92, 48.5], side: "right" },
      { word: W.head, at: [92, 56], side: "right" },
    ],
  },
  {
    id: "flower",
    topic: partsOf("a flower", "de la fleur", "de la flor", "da flor"),
    shapes: [
      ...finished("flower"),
      { d: "M18 94 L82 94", width: 1 },
      { d: "M50 94 L50 101 M50 96.5 Q45 98.5 42 103 M50 96.5 Q55 98.5 58 103 M50 99.5 Q47.5 102 46.5 105 M50 99.5 Q52.5 102 53.5 105", width: 0.7 },
    ],
    labels: [
      { word: W.leaf, at: [33, 66.5], side: "left" },
      { word: W.roots, at: [44, 101], side: "left" },
      { word: W.petal, at: [70, 24], side: "right" },
      { word: W.centre, at: [57, 39], side: "right" },
      { word: W.stem, at: [50, 66.5], side: "right" },
    ],
  },
];

// ------------------------------------------------------------------ sheets

export type BodyVersion = "label" | "match";
export type BodyPartsParams = { subject: string; version: BodyVersion };
export type BodyPartsSheet = Sheet<BodyPartsParams>;

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
const words = (s: string) => s.split(" ").map((w) => (["the", "of", "a"].includes(w) ? w : cap(w))).join(" ");

const VERSION: Record<BodyVersion, { verb: L10n; filter: L10n }> = {
  label: {
    verb: { en: "label", fr: "légende", es: "nombra", pt: "nomeie" },
    filter: { en: "Label it", fr: "Légender", es: "Nombrar", pt: "Nomear" },
  },
  match: {
    verb: { en: "match", fr: "relie", es: "une", pt: "ligue" },
    filter: { en: "Match it", fr: "Relier", es: "Unir", pt: "Ligar" },
  },
};

function sheet(b: BodySubject, version: BodyVersion): BodyPartsSheet {
  const verb = VERSION[version].verb;
  const n = b.labels.length;
  return {
    kind: "body-parts",
    id: `${b.id}-${version}`,
    slug: {
      en: `${verb.en}-${slugify(b.topic.en)}`,
      fr: `${slugify(verb.fr)}-${slugify(b.topic.fr)}`,
      es: `${verb.es}-${slugify(b.topic.es)}`,
      pt: `${verb.pt}-${slugify(b.topic.pt)}`,
    },
    title: {
      en: `${cap(verb.en)} ${words(b.topic.en)}`,
      fr: `${cap(verb.fr)} ${b.topic.fr}`,
      es: `${cap(verb.es)} ${b.topic.es}`,
      pt: `${cap(verb.pt)} ${b.topic.pt}`,
    },
    label: { en: cap(b.topic.en.replace(/^the /, "")), fr: cap(b.topic.fr), es: cap(b.topic.es), pt: cap(b.topic.pt) },
    description:
      version === "label"
        ? {
            en: `Free printable worksheet: label ${b.topic.en}. A cute drawing with ${n} lines to empty boxes, and a word bank to copy the words from.`,
            fr: `Fiche gratuite à imprimer : légende ${b.topic.fr}. Un joli dessin, ${n} traits vers des cases vides et les mots à recopier en bas.`,
            es: `Ficha gratis para imprimir: nombra ${b.topic.es}. Un dibujo con ${n} líneas hacia casillas vacías y un banco de palabras para copiar.`,
            pt: `Atividade grátis para imprimir: nomeie ${b.topic.pt}. Um desenho com ${n} linhas até quadros vazios e um banco de palavras para copiar.`,
          }
        : {
            en: `Free printable worksheet: match ${b.topic.en}. Draw a line from each of the ${n} words to the right dot on the picture.`,
            fr: `Fiche gratuite à imprimer : relie ${b.topic.fr}. Trace un trait de chacun des ${n} mots jusqu'au bon point du dessin.`,
            es: `Ficha gratis para imprimir: une ${b.topic.es}. Traza una línea de cada una de las ${n} palabras al punto correcto del dibujo.`,
            pt: `Atividade grátis para imprimir: ligue ${b.topic.pt}. Trace uma linha de cada uma das ${n} palavras até o ponto certo do desenho.`,
          },
    instruction:
      version === "label"
        ? {
            en: "Write the name of each part in its box. The words are at the bottom.",
            fr: "Écris le nom de chaque partie dans sa case. Les mots sont en bas.",
            es: "Escribe el nombre de cada parte en su casilla. Las palabras están abajo.",
            pt: "Escreva o nome de cada parte no seu quadro. As palavras estão embaixo.",
          }
        : {
            en: "Draw a line from each word to the dot on the right part.",
            fr: "Relie chaque mot au point sur la bonne partie du dessin.",
            es: "Une cada palabra con el punto de la parte correcta.",
            pt: "Ligue cada palavra ao ponto da parte certa.",
          },
    filters: { version },
    params: { subject: b.id, version },
  };
}

export const bodyPartsSheets: BodyPartsSheet[] = BODY_SUBJECTS.flatMap((b) => (["label", "match"] as const).map((v) => sheet(b, v)));

export function getBodySubject(id: string): BodySubject {
  const b = BODY_SUBJECTS.find((x) => x.id === id);
  if (!b) throw new Error(`No body-parts subject "${id}"`);
  return b;
}

export const BODY_UI: Record<keyof L10n, { bank: string }> = {
  en: { bank: "Word bank" },
  fr: { bank: "Les mots" },
  es: { bank: "Banco de palabras" },
  pt: { bank: "Banco de palavras" },
};

export const bodyPartsKind: SheetKind = {
  id: "body-parts",
  slug: { en: "body-parts", fr: "parties-du-corps", es: "partes-del-cuerpo", pt: "partes-do-corpo" },
  name: { en: "Body Parts", fr: "Parties du corps", es: "Partes del cuerpo", pt: "Partes do corpo" },
  heading: {
    en: "Body Parts Worksheets: Label and Match",
    fr: "Les parties du corps : fiches à légender et à relier",
    es: "Partes del cuerpo: fichas para nombrar y unir",
    pt: "Partes do corpo: atividades para nomear e ligar",
  },
  metaTitle: {
    en: "Body Parts Worksheets for Kids: Label and Match | Free PDFs",
    fr: "Parties du corps maternelle : fiches gratuites à imprimer",
    es: "Partes del cuerpo para niños: fichas gratis para imprimir",
    pt: "Partes do corpo para crianças: atividades grátis",
  },
  description: {
    en: "Free printable body parts worksheets: label the parts of the body and of animals with a word bank, or match each word to its part.",
    fr: "Fiches gratuites sur les parties du corps et des animaux : légender avec les mots donnés, ou relier chaque mot à la bonne partie.",
    es: "Fichas gratis de las partes del cuerpo y de los animales: nombrar con el banco de palabras o unir cada palabra con su parte.",
    pt: "Atividades grátis das partes do corpo e dos animais: nomear com o banco de palavras ou ligar cada palavra à sua parte.",
  },
  intro: {
    en: "A friendly drawing sits in the middle of each sheet, with a line from each part to a box. In the label version the child copies the right word from the word bank into each box; in the match version the words are already printed, mixed up, and the child draws a line from each one to its part.",
    fr: "Chaque fiche montre un dessin au milieu, avec un trait de chaque partie vers une case. Pour légender, l'enfant recopie le bon mot dans chaque case ; pour relier, les mots sont déjà écrits, dans le désordre, et il trace un trait de chaque mot à la bonne partie.",
    es: "Cada ficha tiene un dibujo en el centro, con una línea de cada parte a una casilla. Para nombrar, el niño copia la palabra correcta del banco de palabras en cada casilla; para unir, las palabras ya están escritas, en desorden, y traza una línea de cada una a su parte.",
    pt: "Cada atividade tem um desenho no meio, com uma linha de cada parte até um quadro. Para nomear, a criança copia a palavra certa do banco de palavras em cada quadro; para ligar, as palavras já estão escritas, fora de ordem, e ela traça uma linha de cada uma até a sua parte.",
  },
  howTo: {
    en: "Point to each part on your child, then on the drawing, and say its name together. Read the word bank aloud before writing. Younger children can start with the match version.",
    fr: "Montrez chaque partie sur l'enfant, puis sur le dessin, et dites son nom ensemble. Lisez les mots à voix haute avant d'écrire. Les plus jeunes peuvent commencer par la fiche à relier.",
    es: "Señale cada parte en el niño y luego en el dibujo, y digan juntos su nombre. Lean las palabras en voz alta antes de escribir. Los más pequeños pueden empezar con la ficha para unir.",
    pt: "Aponte cada parte na criança e depois no desenho, e digam juntos o nome. Leiam as palavras em voz alta antes de escrever. Os menores podem começar pela atividade de ligar.",
  },
  level: {
    en: "Preschool to second grade (ages 4–8)",
    fr: "De la maternelle au CE1 (4 à 8 ans)",
    es: "Preescolar a segundo grado (4 a 8 años)",
    pt: "Educação infantil ao 2º ano (4 a 8 anos)",
  },
  skills: {
    en: ["Vocabulary", "Reading", "Science"],
    fr: ["Vocabulaire", "Lecture", "Découverte du monde"],
    es: ["Vocabulario", "Lectura", "Ciencias"],
    pt: ["Vocabulário", "Leitura", "Ciências"],
  },
  filters: [
    {
      key: "version",
      label: { en: "Activity", fr: "Activité", es: "Actividad", pt: "Atividade" },
      options: (["label", "match"] as const).map((v) => ({ value: v, label: VERSION[v].filter })),
    },
  ],
};
