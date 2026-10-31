// Colouring worksheets, drawn by scripts/sheets/colouring-layout.ts from our
// own drawings (data/worksheets/drawings.ts). Two versions of every drawing:
//   number  color by number: each region has a number, and the key at the
//           bottom gives each number's colour, named in the sheet's language
//   plain   a big outline to colour freely, for the youngest
import { DRAWINGS, type Drawing, type Paint } from "./drawings";
import { COLOURS } from "./vocab";
import { slugify, type L10n, type Sheet, type SheetKind } from "@/lib/sheets/types";

export type ColouringVersion = "number" | "plain";
export type ColouringParams = { drawing: string; version: ColouringVersion };
export type ColouringSheet = Sheet<ColouringParams>;

/** Each paint's printed colour and name. */
export const PAINTS: Record<Paint, { hex: string; name: L10n }> = {
  ...COLOURS,
  brown: { hex: "#8D5A3B", name: { en: "brown", fr: "marron", es: "café", pt: "marrom" } },
  grey: { hex: "#9E9E9E", name: { en: "gray", fr: "gris", es: "gris", pt: "cinza" } },
};

const each = <T>(f: (l: keyof L10n) => T): L10n<T> => ({ en: f("en"), fr: f("fr"), es: f("es"), pt: f("pt") });
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

const VERSION: Record<ColouringVersion, { prefix: L10n; filter: L10n }> = {
  number: {
    prefix: { en: "color-by-number", fr: "coloriage-magique", es: "colorea-por-numeros", pt: "pinte-por-numeros" },
    filter: { en: "Color by number", fr: "Coloriage magique", es: "Colorea por números", pt: "Pinte por números" },
  },
  plain: {
    prefix: { en: "coloring-page", fr: "coloriage", es: "dibujo-para-colorear", pt: "desenho-para-colorir" },
    filter: { en: "Free coloring", fr: "Coloriage libre", es: "Colorear libre", pt: "Pintura livre" },
  },
};

function titleOf(d: Drawing, version: ColouringVersion): L10n {
  if (version === "number")
    return {
      en: `Color by Number: ${cap(d.name.en)}`,
      fr: `Coloriage magique : ${d.the.fr}`,
      es: `Colorea por números: ${d.the.es}`,
      pt: `Pinte por números: ${d.the.pt}`,
    };
  return {
    en: `${cap(d.name.en)} Coloring Page`,
    fr: `Coloriage : ${d.the.fr}`,
    es: `Dibujo para colorear: ${d.the.es}`,
    pt: `Desenho para colorir: ${d.the.pt}`,
  };
}

function instructionOf(d: Drawing, version: ColouringVersion): L10n {
  if (version === "number")
    return {
      en: "Find each number in the key below. Color that part with the matching color.",
      fr: "Cherche chaque nombre dans la légende en bas. Colorie la zone avec la bonne couleur.",
      es: "Busca cada número en la clave de abajo. Colorea esa parte con su color.",
      pt: "Procure cada número na legenda abaixo. Pinte essa parte com a cor certa.",
    };
  return {
    en: `Color ${d.the.en} with your favorite colors.`,
    fr: `Colorie ${d.the.fr} avec tes couleurs préférées.`,
    es: `Colorea ${d.the.es} con tus colores favoritos.`,
    pt: `Pinte ${d.the.pt} com suas cores favoritas.`,
  };
}

function descriptionOf(d: Drawing, version: ColouringVersion): L10n {
  if (version === "number")
    return {
      en: `Free printable color by number: ${d.the.en}, with big numbers in every part and a color key at the bottom. Works in black and white too.`,
      fr: `Coloriage magique gratuit à imprimer : ${d.the.fr}, avec un grand nombre dans chaque zone et la légende des couleurs en bas. Fonctionne aussi imprimé en noir et blanc.`,
      es: `Colorea por números gratis: ${d.the.es}, con números grandes en cada parte y la clave de colores abajo. Funciona también impreso en blanco y negro.`,
      pt: `Pinte por números grátis: ${d.the.pt}, com números grandes em cada parte e a legenda de cores embaixo. Funciona também impresso em preto e branco.`,
    };
  return {
    en: `Free printable coloring page: ${d.the.en}, a big simple outline with thick lines for little hands.`,
    fr: `Coloriage gratuit à imprimer : ${d.the.fr}, un grand dessin simple aux traits épais pour les petites mains.`,
    es: `Dibujo para colorear gratis: ${d.the.es}, un contorno grande y sencillo con líneas gruesas para manos pequeñas.`,
    pt: `Desenho para colorir grátis: ${d.the.pt}, um contorno grande e simples com linhas grossas para mãos pequenas.`,
  };
}

function sheet(d: Drawing, version: ColouringVersion): ColouringSheet {
  return {
    kind: "colouring",
    id: `${d.id}-${version}`,
    slug: each((l) => `${VERSION[version].prefix[l]}-${slugify(d.name[l])}`),
    title: titleOf(d, version),
    label: each((l) => `${cap(d.name[l])} · ${VERSION[version].filter[l]}`),
    description: descriptionOf(d, version),
    instruction: instructionOf(d, version),
    filters: { version },
    params: { drawing: d.id, version },
  };
}

export const colouringSheets: ColouringSheet[] = DRAWINGS.flatMap((d) => (["number", "plain"] as const).map((v) => sheet(d, v)));

export const colouringKind: SheetKind = {
  id: "colouring",
  slug: { en: "coloring", fr: "coloriages", es: "colorear", pt: "colorir" },
  name: { en: "Coloring", fr: "Coloriages", es: "Colorear", pt: "Colorir" },
  heading: {
    en: "Coloring Pages and Color by Number",
    fr: "Coloriages et coloriages magiques à imprimer",
    es: "Dibujos para colorear y colorea por números",
    pt: "Desenhos para colorir e pinte por números",
  },
  metaTitle: {
    en: "Color by Number and Coloring Pages for Kids | Free PDFs",
    fr: "Coloriages magiques maternelle : fiches gratuites à imprimer",
    es: "Colorea por números y dibujos para colorear: fichas gratis",
    pt: "Pinte por números e desenhos para colorir: atividades grátis",
  },
  description: {
    en: "Free printable color by number sheets and coloring pages: cute animals, fruit and vehicles with big numbers, a color key, and thick lines.",
    fr: "Coloriages magiques et coloriages gratuits à imprimer : des animaux, des fruits et des véhicules, avec de grands nombres, une légende et des traits épais.",
    es: "Fichas gratis de colorea por números y dibujos para colorear: animales, frutas y vehículos con números grandes, clave de colores y líneas gruesas.",
    pt: "Atividades grátis de pinte por números e desenhos para colorir: animais, frutas e veículos com números grandes, legenda de cores e linhas grossas.",
  },
  intro: {
    en: "Color by number turns coloring into a reading game: the child reads the number in each part, finds it in the key, and picks the matching crayon. Every drawing also comes as a plain coloring page for the youngest. The lines are thick and every part is a closed shape, so the sheets print well, even in black and white.",
    fr: "Le coloriage magique transforme le coloriage en jeu de lecture : l'enfant lit le nombre de chaque zone, le retrouve dans la légende et prend la bonne couleur. Chaque dessin existe aussi en coloriage libre pour les plus petits. Les traits sont épais et chaque zone est bien fermée : les fiches s'impriment bien, même en noir et blanc.",
    es: "Colorear por números convierte el coloreado en un juego de lectura: el niño lee el número de cada parte, lo busca en la clave y elige el color que corresponde. Cada dibujo también viene para colorear libremente, para los más pequeños. Las líneas son gruesas y cada parte está cerrada, así que las fichas se imprimen bien, incluso en blanco y negro.",
    pt: "Pintar por números transforma a pintura em um jogo de leitura: a criança lê o número de cada parte, procura na legenda e escolhe a cor certa. Cada desenho também vem para pintar livremente, para os menores. As linhas são grossas e cada parte é fechada, então as atividades imprimem bem, mesmo em preto e branco.",
  },
  howTo: {
    en: "Lay out the crayons from the key before you start. Let your child read each number aloud and say its color. Small parts are easier with a sharp colored pencil; big parts can be done with a crayon.",
    fr: "Préparez les couleurs de la légende avant de commencer. Laissez l'enfant lire chaque nombre à voix haute et dire sa couleur. Les petites zones se colorient mieux au crayon de couleur bien taillé, les grandes au feutre ou à la craie grasse.",
    es: "Prepare los colores de la clave antes de empezar. Deje que el niño lea cada número en voz alta y diga su color. Las partes pequeñas son más fáciles con un lápiz de color con buena punta; las grandes, con crayón.",
    pt: "Separe as cores da legenda antes de começar. Deixe a criança ler cada número em voz alta e dizer a cor. As partes pequenas ficam mais fáceis com lápis de cor bem apontado; as grandes, com giz de cera.",
  },
  level: {
    en: "Preschool to first grade (ages 3–7)",
    fr: "Maternelle et CP (3 à 7 ans)",
    es: "Preescolar y primer grado (3 a 7 años)",
    pt: "Educação infantil e 1º ano (3 a 7 anos)",
  },
  skills: {
    en: ["Number recognition", "Colors", "Fine motor skills"],
    fr: ["Reconnaître les nombres", "Couleurs", "Motricité fine"],
    es: ["Reconocer números", "Colores", "Motricidad fina"],
    pt: ["Reconhecer números", "Cores", "Coordenação motora fina"],
  },
  filters: [
    {
      key: "version",
      label: { en: "Activity", fr: "Activité", es: "Actividad", pt: "Atividade" },
      options: (["number", "plain"] as const).map((v) => ({ value: v, label: VERSION[v].filter })),
    },
  ],
};
