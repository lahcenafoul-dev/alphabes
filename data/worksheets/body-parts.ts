// Body parts worksheets, drawn by scripts/sheets/art-layout.ts: a drawing in
// the middle and a box for each part, left and right (above and below for a
// wide subject). Two versions:
//   label  a line from each part to an empty box, and a word bank to copy from
//   match  the words are printed in the boxes, mixed up: draw a line from
//          each word to the dot on its part
// The words are what children of 4 to 8 say, with the article in French,
// Spanish and Portuguese (they learn the noun with it).
import { circle } from "@/lib/sheets/geometry";
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
  gills: { en: "gills", fr: "les branchies", es: "las branquias", pt: "as brânquias" },
  fin: { en: "fin", fr: "la nageoire", es: "la aleta", pt: "a nadadeira" },
  tail: { en: "tail", fr: "la queue", es: "la cola", pt: "a cauda" },
  scales: { en: "scales", fr: "les écailles", es: "las escamas", pt: "as escamas" },
} satisfies Record<string, L10n>;

/** The how-to-draw subject's finished picture. */
const finished = (id: string): ArtShape[] => HOW_TO_DRAW.find((h) => h.id === id)!.shapes.map(({ step: _, ...s }) => s);

export const BODY_SUBJECTS: BodySubject[] = [
  {
    id: "body",
    topic: { en: "the parts of the body", fr: "les parties du corps", es: "las partes del cuerpo", pt: "as partes do corpo" },
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
      { d: "M37 16 C36 -2 64 -2 63 16 C60 9.5 54 8 50 11 C46 8 40 9.5 37 16 Z" },
      { d: "M44 3.6 Q41.5 6.5 41 10 M50 2.6 L50 7.5 M56 3.6 Q58.5 6.5 59 10", width: 0.6 },
      ...eye(45, 17, 1.7),
      ...eye(55, 17, 1.7),
      { d: "M50 20 Q52 22.5 50 23.5" },
      { d: "M45 25.5 Q50 29.5 55 25.5" },
    ],
    labels: [
      { word: W.hair, at: [41, 7], side: "left" },
      { word: W.ear, at: [34, 23], side: "left" },
      { word: W.mouth, at: [50, 27.5], side: "left" },
      { word: W.hand, at: [23, 64], side: "left" },
      { word: W.foot, at: [37, 91.5], side: "left" },
      { word: W.eye, at: [55, 17], side: "right" },
      { word: W.neck, at: [53, 33], side: "right" },
      { word: W.arm, at: [67, 49], side: "right" },
      { word: W.leg, at: [56, 80], side: "right" },
    ],
  },
  {
    id: "fish",
    topic: { en: "the parts of a fish", fr: "les parties du poisson", es: "las partes del pez", pt: "as partes do peixe" },
    shapes: finished("fish"),
    labels: [
      { word: W.eye, at: [28.4, 47.6], side: "top" },
      { word: W.fin, at: [48, 27], side: "top" },
      { word: W.scales, at: [66.2, 44], side: "top" },
      { word: W.mouth, at: [19.5, 53], side: "bottom" },
      { word: W.gills, at: [41.2, 56], side: "bottom" },
      { word: W.tail, at: [84, 56], side: "bottom" },
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
