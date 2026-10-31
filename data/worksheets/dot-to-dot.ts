// Dot-to-dot worksheets, drawn by scripts/sheets/dot-to-dot-layout.ts from
// our own drawings (data/worksheets/drawings.ts). The dots follow the
// drawing's outline; the finished picture is shown small in a corner.
//   easy    10 dots, numbered 1–10
//   medium  20 dots, 1–20
//   hard    50 dots, 1–50
//   letters 26 dots, lettered A–Z
import { DRAWINGS, type Drawing } from "./drawings";
import { slugify, type L10n, type Sheet, type SheetKind } from "@/lib/sheets/types";

export type DotLevel = "easy" | "medium" | "hard" | "letters";
export type DotToDotParams = { drawing: string; level: DotLevel };
export type DotToDotSheet = Sheet<DotToDotParams>;

export const DOT_COUNT: Record<DotLevel, number> = { easy: 10, medium: 20, hard: 50, letters: 26 };

/** The dots' labels: 1, 2, 3… or A, B, C… */
export function dotLabels(level: DotLevel): string[] {
  const n = DOT_COUNT[level];
  return Array.from({ length: n }, (_, i) => (level === "letters" ? String.fromCharCode(65 + i) : String(i + 1)));
}

const each = <T>(f: (l: keyof L10n) => T): L10n<T> => ({ en: f("en"), fr: f("fr"), es: f("es"), pt: f("pt") });

const RANGE: Record<DotLevel, L10n> = {
  easy: { en: "1–10", fr: "1 à 10", es: "1 al 10", pt: "1 a 10" },
  medium: { en: "1–20", fr: "1 à 20", es: "1 al 20", pt: "1 a 20" },
  hard: { en: "1–50", fr: "1 à 50", es: "1 al 50", pt: "1 a 50" },
  letters: { en: "A–Z", fr: "A à Z", es: "A a la Z", pt: "A a Z" },
};

const RANGE_SLUG: Record<DotLevel, string> = { easy: "1-10", medium: "1-20", hard: "1-50", letters: "a-z" };

const LEVEL: Record<DotLevel, L10n> = {
  easy: { en: "Easy (1–10)", fr: "Facile (1 à 10)", es: "Fácil (1 al 10)", pt: "Fácil (1 a 10)" },
  medium: { en: "Medium (1–20)", fr: "Moyen (1 à 20)", es: "Medio (1 al 20)", pt: "Médio (1 a 20)" },
  hard: { en: "Hard (1–50)", fr: "Difficile (1 à 50)", es: "Difícil (1 al 50)", pt: "Difícil (1 a 50)" },
  letters: { en: "Letters A–Z", fr: "Lettres A à Z", es: "Letras A a la Z", pt: "Letras A a Z" },
};

const PREFIX: L10n = { en: "dot-to-dot", fr: "points-a-relier", es: "une-los-puntos", pt: "ligue-os-pontos" };

function titleOf(d: Drawing, level: DotLevel): L10n {
  const r = RANGE[level];
  return {
    en: `${cap(d.name.en)} Dot to Dot (${r.en})`,
    fr: `Points à relier : ${d.the.fr} (${r.fr})`,
    es: `Une los puntos: ${d.the.es} (${r.es})`,
    pt: `Ligue os pontos: ${d.the.pt} (${r.pt})`,
  };
}

function instructionOf(level: DotLevel): L10n {
  if (level === "letters")
    return {
      en: "Start at the star and join the letters in order, from A to Z. What did you draw?",
      fr: "Pars de l'étoile et relie les lettres dans l'ordre, de A à Z. Qu'as-tu dessiné ?",
      es: "Empieza en la estrella y une las letras en orden, de la A a la Z. ¿Qué dibujaste?",
      pt: "Comece na estrela e ligue as letras em ordem, de A a Z. O que você desenhou?",
    };
  const r = RANGE[level];
  return {
    en: `Start at the star and join the dots in order, from ${r.en.replace("–", " to ")}. What did you draw?`,
    fr: `Pars de l'étoile et relie les points dans l'ordre, de ${r.fr}. Qu'as-tu dessiné ?`,
    es: `Empieza en la estrella y une los puntos en orden, del ${r.es}. ¿Qué dibujaste?`,
    pt: `Comece na estrela e ligue os pontos em ordem, de ${r.pt}. O que você desenhou?`,
  };
}

function descriptionOf(d: Drawing, level: DotLevel): L10n {
  const n = DOT_COUNT[level];
  if (level === "letters")
    return {
      en: `Free printable dot-to-dot: join 26 letters from A to Z to draw ${d.the.en}. Alphabet order practice, with the finished picture in the corner.`,
      fr: `Points à relier gratuits : relie 26 lettres de A à Z pour dessiner ${d.the.fr}. On révise l'ordre de l'alphabet ; le dessin fini est en coin de page.`,
      es: `Une los puntos gratis: une 26 letras de la A a la Z para dibujar ${d.the.es}. Repasa el orden del abecedario; el dibujo terminado está en una esquina.`,
      pt: `Ligue os pontos grátis: ligue 26 letras de A a Z para desenhar ${d.the.pt}. Treina a ordem do alfabeto; o desenho pronto fica no canto.`,
    };
  return {
    en: `Free printable dot-to-dot: join ${n} numbered dots to draw ${d.the.en}. Counting practice from 1 to ${n}, with the finished picture in the corner.`,
    fr: `Points à relier gratuits : relie ${n} points numérotés pour dessiner ${d.the.fr}. On compte de 1 à ${n} ; le dessin fini est en coin de page.`,
    es: `Une los puntos gratis: une ${n} puntos numerados para dibujar ${d.the.es}. Practica contar del 1 al ${n}; el dibujo terminado está en una esquina.`,
    pt: `Ligue os pontos grátis: ligue ${n} pontos numerados para desenhar ${d.the.pt}. Treina a contagem de 1 a ${n}; o desenho pronto fica no canto.`,
  };
}

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

function sheet(d: Drawing, level: DotLevel): DotToDotSheet {
  return {
    kind: "dot-to-dot",
    id: `${d.id}-${level}`,
    slug: each((l) => [PREFIX[l], slugify(d.name[l]), RANGE_SLUG[level]].join("-")),
    title: titleOf(d, level),
    label: each((l) => `${cap(d.name[l])} · ${LEVEL[level][l]}`),
    description: descriptionOf(d, level),
    instruction: instructionOf(level),
    filters: { level },
    params: { drawing: d.id, level },
  };
}

const LEVELS: DotLevel[] = ["easy", "medium", "hard", "letters"];

export const dotToDotSheets: DotToDotSheet[] = DRAWINGS.flatMap((d) => LEVELS.map((level) => sheet(d, level)));

export const dotToDotKind: SheetKind = {
  id: "dot-to-dot",
  slug: { en: "dot-to-dot", fr: "points-a-relier", es: "une-los-puntos", pt: "ligue-os-pontos" },
  name: { en: "Dot to Dot", fr: "Points à relier", es: "Une los puntos", pt: "Ligue os pontos" },
  heading: {
    en: "Dot to Dot Worksheets: Join the Dots",
    fr: "Points à relier : fiches à imprimer",
    es: "Une los puntos: fichas para imprimir",
    pt: "Ligue os pontos: atividades para imprimir",
  },
  metaTitle: {
    en: "Dot to Dot Worksheets for Kids | Free Printable PDFs",
    fr: "Points à relier maternelle : fiches gratuites à imprimer",
    es: "Une los puntos para niños: fichas gratis para imprimir",
    pt: "Ligue os pontos para crianças: atividades grátis para imprimir",
  },
  description: {
    en: "Free printable dot-to-dot worksheets: join the numbered dots (1–10, 1–20, 1–50) or the letters A–Z to draw animals, fruit and vehicles.",
    fr: "Points à relier gratuits : relie les points numérotés (1 à 10, 1 à 20, 1 à 50) ou les lettres de A à Z pour dessiner des animaux, des fruits et des véhicules.",
    es: "Une los puntos gratis: une los puntos numerados (1 al 10, 1 al 20, 1 al 50) o las letras de la A a la Z para dibujar animales, frutas y vehículos.",
    pt: "Ligue os pontos grátis: ligue os pontos numerados (1 a 10, 1 a 20, 1 a 50) ou as letras de A a Z para desenhar animais, frutas e veículos.",
  },
  intro: {
    en: "Joining the dots is counting with a pencil: the child finds the next number, draws a straight line to it, and watches a picture appear. Start with 10 big dots, move on to 20, then 50 for confident counters. The A–Z sheets practise alphabet order the same way. The finished picture is shown small in a corner, so children can check their work.",
    fr: "Relier des points, c'est compter avec un crayon : l'enfant cherche le nombre suivant, trace un trait jusqu'à lui et voit un dessin apparaître. Commencez par 10 gros points, puis 20, puis 50 pour ceux qui comptent bien. Les fiches de A à Z font réviser l'ordre de l'alphabet de la même façon. Le dessin fini est montré en petit dans un coin pour que l'enfant puisse vérifier.",
    es: "Unir los puntos es contar con el lápiz: el niño busca el número que sigue, traza una línea hasta él y ve aparecer un dibujo. Empiece con 10 puntos grandes, luego 20, y 50 para quienes ya cuentan bien. Las fichas de la A a la Z repasan el orden del abecedario de la misma manera. El dibujo terminado aparece en pequeño en una esquina para que el niño compruebe su trabajo.",
    pt: "Ligar os pontos é contar com o lápis: a criança procura o próximo número, traça uma linha até ele e vê um desenho aparecer. Comece com 10 pontos grandes, depois 20, e 50 para quem já conta bem. As atividades de A a Z treinam a ordem do alfabeto do mesmo jeito. O desenho pronto aparece pequeno em um canto para a criança conferir.",
  },
  howTo: {
    en: "Show your child the star: that's dot 1. Say each number out loud before drawing the line to it. If they get lost, point to the last dot they reached and count on together. When the picture is finished, it's ready to color.",
    fr: "Montrez l'étoile à l'enfant : c'est le point 1. Dites chaque nombre à voix haute avant de tracer le trait. S'il se perd, montrez le dernier point atteint et comptez ensemble à partir de là. Une fois le dessin fini, il peut le colorier.",
    es: "Muéstrele la estrella al niño: es el punto 1. Digan cada número en voz alta antes de trazar la línea. Si se pierde, señale el último punto al que llegó y sigan contando juntos. Cuando termine el dibujo, lo puede colorear.",
    pt: "Mostre a estrela para a criança: é o ponto 1. Falem cada número em voz alta antes de traçar a linha. Se ela se perder, aponte o último ponto a que chegou e continuem contando juntos. Quando o desenho estiver pronto, ela pode pintar.",
  },
  level: {
    en: "Preschool to first grade (ages 3–7)",
    fr: "Maternelle et CP (3 à 7 ans)",
    es: "Preescolar y primer grado (3 a 7 años)",
    pt: "Educação infantil e 1º ano (3 a 7 anos)",
  },
  skills: {
    en: ["Counting", "Number order", "Fine motor skills"],
    fr: ["Compter", "Suite des nombres", "Motricité fine"],
    es: ["Contar", "Orden de los números", "Motricidad fina"],
    pt: ["Contagem", "Sequência numérica", "Coordenação motora fina"],
  },
  filters: [
    {
      key: "level",
      label: { en: "Dots", fr: "Points", es: "Puntos", pt: "Pontos" },
      options: LEVELS.map((v) => ({ value: v, label: LEVEL[v] })),
    },
  ],
};
