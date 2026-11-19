// The text under the sheet list on the letter bundle and pack pages (SEO phase
// 4, B3): what each sheet holds, who the pack is for, a 5-day plan and the
// letter in one line. Every fact comes from the data the PDFs are made from
// (lib/letters-*, lib/fiches-fr, lib/fichas-es, lib/atividades-pt, the EN
// sheet templates), so each pack describes its own sheets. The four languages
// have different sheets, so each one has its own text, not a translation.
import type { Locale } from "@/i18n/routing";
import { localizedPath } from "./i18n/routes";
import { listJoin, type Block, type Inline } from "./guide-blocks";
// English
import { getLetterContent, type LetterContent } from "./letters-data";
import { firstWord, missingWords, otherLetters } from "./letter-sheet-content";
import { pictureKey } from "./picture-key";
import { distractorsFor as upperDistractors } from "./pdf/templates/uppercase";
import { distractorsFor as lowerDistractors } from "./pdf/templates/lowercase";
import { reviewDistractors } from "./pdf/templates/review";
import { getBundleBySlug } from "./worksheet-bundles";
import { soundSentence } from "./worksheet-letter-guide";
// French
import { LETTER_IMAGES, LOOK_ALIKES as FR_LOOK_ALIKES, getFiche, getFichePack } from "./fiches-fr";
import { getFrenchLetter, type FrenchLetter } from "./letters-fr";
// Spanish
import { FIRST_SYLLABLE_WORDS as ES_SYLLABLES, LOOK_ALIKES as ES_LOOK_ALIKES, getFicha, getFichaPack } from "./fichas-es";
import { getSpanishLetter, type SpanishLetter } from "./letters-es";
// Portuguese
import { FIRST_SYLLABLE_WORDS as PT_SYLLABLES, LOOK_ALIKES as PT_LOOK_ALIKES, getAtividade, getAtividadePack } from "./atividades-pt";
import { getPortugueseLetter, type PortugueseLetter } from "./letters-pt";
import { frenchLetterWords, portugueseLetterWords, spanishLetterWords } from "./pack-words";

const plain = (w: string) => w.replace(/\|/g, "");
const lower = (w: string) => plain(w).toLowerCase();
const sheetHref = (locale: Locale, slug: string) => localizedPath(locale, "/worksheets/[category]", { category: slug });

/** The sheets, in order, split into five days (the first days get the extra sheets). */
function fiveDays<T>(items: T[]): T[][] {
  const base = Math.floor(items.length / 5);
  const extra = items.length % 5;
  const days: T[][] = [];
  let i = 0;
  for (let d = 0; d < 5; d++) {
    const n = base + (d < extra ? 1 : 0);
    days.push(items.slice(i, i + n));
    i += n;
  }
  return days.filter((d) => d.length);
}

/** "Day 1: …" lines, each naming its sheets as links. */
function dayLines(days: { href: string; text: string }[][], dayWord: string, and: string, colon = ": "): Inline[][] {
  return days.map((sheets, d) => {
    const out: Inline[] = [{ strong: `${dayWord} ${d + 1}${colon}` }];
    sheets.forEach((s, i) => {
      if (i) out.push(i === sheets.length - 1 ? ` ${and} ` : ", ");
      out.push(s);
    });
    return out;
  });
}

// ================================================================ English

const an = (n: string) => (/^[aeiou]/.test(n) ? `an ${n}` : `a ${n}`);
const noun = (word: string) => pictureKey(word).replace(/-/g, " ");

type EnType = "tracing" | "uppercase" | "lowercase" | "recognition" | "beginning-sounds" | "coloring" | "matching" | "missing-letter" | "writing-practice" | "review";

const EN_LABEL: Record<EnType, string> = {
  tracing: "Tracing",
  uppercase: "Uppercase",
  lowercase: "Lowercase",
  recognition: "Recognition",
  "beginning-sounds": "Beginning sounds",
  coloring: "Coloring",
  matching: "Matching",
  "missing-letter": "Missing letter",
  "writing-practice": "Writing practice",
  review: "Review",
};

function enLine(type: EnType, c: LetterContent): string {
  const { uppercase: U, lowercase: l, slug } = c;
  const word = c.exampleWords[0].word;
  switch (type) {
    case "tracing":
      return `${U} and ${l} to trace on guide lines, then the word ${word}.`;
    case "uppercase": {
      const d = upperDistractors(U, 17).sort();
      return `a big outline ${U}, three ${U}s to find among 20 letters (${d[0]} to ${d[d.length - 1]}), six to trace.`;
    }
    case "lowercase": {
      const d = lowerDistractors(l, 17).sort();
      return `the same for ${l}, among ${d[0]} to ${d[d.length - 1]}.`;
    }
    case "recognition": {
      const p = otherLetters(slug);
      return `circle the ${U}s and ${l}s among 10 tiles, then join ${listJoin([U, ...p.map((x) => x.toUpperCase())], "and")} to ${listJoin([l, ...p], "and")}.`;
    }
    case "beginning-sounds": {
      const others = otherLetters(slug).map((s) => noun(firstWord(s)));
      return `circle the two ${noun(word)} pictures among five (with ${listJoin(others.map(an), "and")}).`;
    }
    case "coloring":
      return `a big ${U}${l} and ${an(noun(word))} to color.`;
    case "matching":
      return `join four letters to their pictures, then find the picture that starts with ${U}.`;
    case "missing-letter": {
      const words = missingWords(c).map(({ word: w, at }) => `${w.slice(0, at)}_${w.slice(at + 1)}`);
      return words.length === 1 ? `complete ${words[0]}, then trace ${U}.` : `complete ${listJoin(words, "and")}, then trace ${U}.`;
    }
    case "writing-practice":
      return `four lines of ${U}${l} pairs, then the word ${word}.`;
    case "review":
      return `trace ${U}${l}, find it in a grid of 12 letters (with ${listJoin(reviewDistractors(l), "and")}), check if ${word} starts with ${U}, write it alone.`;
  }
}

function englishBundle(slug: string): Block[] {
  const bundle = getBundleBySlug(slug);
  const m = slug.match(/^letter-([a-z])-bundle$/);
  if (!bundle || !m) return [];
  const c = getLetterContent(m[1])!;
  const { uppercase: U, lowercase: l } = c;
  const sheets = bundle.worksheetSlugs.map((s) => ({ slug: s, type: s.replace(/^letter-[a-z]-/, "") as EnType }));
  const link = (s: (typeof sheets)[number]) => ({ href: `/worksheets/${s.slug}`, text: EN_LABEL[s.type] });
  const byType = (t: EnType) => link(sheets.find((s) => s.type === t)!);
  return [
    {
      id: "inside",
      heading: "What's on each sheet, easiest first",
      list: sheets.map((s) => [link(s), `: ${enLine(s.type, c)}`]),
    },
    {
      id: "who",
      heading: "Who it's for",
      paragraphs: [
        [
          `Ages 3 to 7. Tracing, uppercase and coloring suit ages 3 to 5; missing letter, writing practice and review suit 5 to 7, once ${U} is familiar. Every sheet is also free to print on its own, from its page.`,
        ],
      ],
    },
    {
      id: "plan",
      heading: "A 5-day plan",
      list: dayLines(
        [
          [byType("tracing"), byType("uppercase")],
          [byType("lowercase"), byType("recognition")],
          [byType("beginning-sounds"), byType("coloring")],
          [byType("matching"), byType("missing-letter")],
          [byType("writing-practice"), byType("review")],
        ],
        "Day",
        "and",
      ),
    },
    {
      id: "letter",
      heading: `The letter ${U}`,
      paragraphs: [[`${soundSentence(c)} `, { href: `/alphabet/${c.slug}`, text: `More about the letter ${U}` }, "."]],
    },
  ];
}

// ================================================================ French

type FrType = "coloriage" | "trace" | "reconnaissance" | "son" | "cursive" | "mots";
const FR_ORDER: FrType[] = ["coloriage", "trace", "reconnaissance", "son", "cursive", "mots"];
const FR_LABEL: Record<FrType, string> = {
  coloriage: "Coloriage",
  trace: "Tracé",
  reconnaissance: "Reconnaître la lettre",
  son: "Le son de la lettre",
  cursive: "Cursive",
  mots: "Écrire des mots",
};

function frLine(type: FrType, l: FrenchLetter): string {
  const w0 = l.words[0];
  const alikes = [...(FR_LOOK_ALIKES[l.lower] ?? "")];
  switch (type) {
    case "coloriage":
      return `un grand ${l.upper} et un petit ${l.lower} à colorier, et un dessin, ${w0.withArticle}, avec le mot en script et en cursive.`;
    case "trace":
      return `${l.upper} et ${l.lower} à repasser, puis le mot ${lower(w0.word)}, et une ligne pour écrire seul.`;
    case "reconnaissance":
      return `14 ${l.upper} ${l.lower} à entourer dans une grille de 42 lettres, en capitale, script et cursive${alikes.length ? `, parmi des lettres qui leur ressemblent comme ${listJoin(alikes.slice(0, 3).map((x) => `le ${x}`), "et")}` : ""}.`;
    case "son": {
      const yes = LETTER_IMAGES[l.slug].yes.map((w) => lower(w.word));
      return `neuf images à nommer ; on entoure les ${yes.length} qui commencent par son son : ${listJoin(yes, "et")}.`;
    }
    case "cursive":
      return `${l.lower}, ${l.upper} et le mot ${lower(w0.word)} en cursive sur lignes Seyès : à repasser, puis seul.`;
    case "mots": {
      const words = frenchLetterWords(l).map((w) => lower(w.word));
      return `${listJoin(words, "et")} à lire, repasser et écrire en cursive${words.length < 3 ? ", et une ligne pour un autre mot avec la lettre" : ""}.`;
    }
  }
}

function frenchPack(slug: string): Block[] {
  const pack = getFichePack(slug);
  if (!pack || !slug.startsWith("pack-lettre-")) return [];
  const l = getFrenchLetter(slug.slice("pack-lettre-".length))!;
  const sheets = FR_ORDER.flatMap((t) => {
    const f = pack.fiches.map((s) => getFiche(s)!).find((x) => x.slug.endsWith(`-${t}`));
    return f ? [{ type: t, link: { href: sheetHref("fr", f.slug), text: FR_LABEL[t] } }] : [];
  });
  const words = l.words.map((w) => lower(w.word));
  return [
    {
      id: "inside",
      heading: "Chaque fiche, de la plus simple à la plus difficile",
      list: sheets.map((s) => [s.link, ` : ${frLine(s.type, l)}`]),
    },
    {
      id: "who",
      heading: "Pour qui ?",
      paragraphs: [
        [
          `De la petite section au CP : le coloriage dès la petite section, le tracé et la reconnaissance en moyenne et grande section${sheets.some((s) => s.type === "son") ? ", le son en grande section" : ""}, la cursive et les mots en grande section et au CP. Chaque fiche reste gratuite à l'unité, depuis sa page.`,
        ],
      ],
    },
    {
      id: "plan",
      heading: "Un plan sur 5 jours",
      list: dayLines(fiveDays(sheets.map((s) => s.link)), "Jour", "et", " : "),
    },
    {
      id: "letter",
      heading: `La lettre ${l.upper}`,
      paragraphs: [
        [
          `${l.sound} Des mots pour s'entraîner : ${listJoin(words, "et")}. `,
          { href: localizedPath("fr", "/alphabet/[letter]", { letter: l.slug }), text: `Tout sur la lettre ${l.upper}` },
          ".",
        ],
      ],
    },
  ];
}

// ================================================================ Spanish

type EsType = "colorear" | "trazo" | "reconocer" | "silaba" | "cursiva" | "palabras";
const ES_ORDER: EsType[] = ["colorear", "trazo", "reconocer", "silaba", "cursiva", "palabras"];
const ES_LABEL: Record<EsType, string> = {
  colorear: "Colorear",
  trazo: "Trazo",
  reconocer: "Reconocer la letra",
  silaba: "Primera sílaba",
  cursiva: "Cursiva",
  palabras: "Escribir palabras",
};

function esLine(type: EsType, l: SpanishLetter): string {
  const w0 = l.words[0];
  const alikes = [...(ES_LOOK_ALIKES[l.lower] ?? "")];
  switch (type) {
    case "colorear":
      return `una ${l.upper} grande y una ${l.lower} para colorear, y un dibujo, ${w0.withArticle}, con la palabra en script y en cursiva.`;
    case "trazo":
      return `la ${l.upper} y la ${l.lower} para repasar, luego la palabra ${lower(w0.word)} y una línea para escribir solo.`;
    case "reconocer":
      return `14 ${l.upper} ${l.lower} para encerrar en una cuadrícula de 42 letras, en mayúscula, script y cursiva, entre letras parecidas como ${listJoin(alikes.slice(0, 3).map((x) => `la ${x}`), "y")}.`;
    case "silaba": {
      const words = ES_SYLLABLES[l.slug]!;
      const [first] = words;
      return `${words.length} dibujos con la primera sílaba en blanco (${listJoin(words.map((w) => lower(w.word)), "y")}), palmadas para contar sílabas y ${lower(first.word)} para escribir en cursiva.`;
    }
    case "cursiva":
      return `la ${l.lower}, la ${l.upper} y la palabra ${lower(w0.word)} en cursiva sobre doble raya: para repasar y después escribir solo.`;
    case "palabras": {
      const words = spanishLetterWords(l).map((w) => lower(w.word));
      return `${listJoin(words, "y")}, con su dibujo, para repasar y copiar en cursiva.`;
    }
  }
}

function spanishPack(slug: string): Block[] {
  const pack = getFichaPack(slug);
  if (!pack || !slug.startsWith("paquete-letra-")) return [];
  const key = slug.slice("paquete-letra-".length);
  const l = getSpanishLetter(key);
  if (!l) return typePack("es", pack.fichas);
  const sheets = ES_ORDER.flatMap((t) => {
    const f = pack.fichas.map((s) => getFicha(s)!).find((x) => x.slug.endsWith(`-${t}`));
    return f ? [{ type: t, link: { href: sheetHref("es", f.slug), text: ES_LABEL[t] } }] : [];
  });
  const words = l.words.map((w) => lower(w.word));
  return [
    {
      id: "inside",
      heading: "Cada ficha, de la más fácil a la más difícil",
      list: sheets.map((s) => [s.link, `: ${esLine(s.type, l)}`]),
    },
    {
      id: "who",
      heading: "Para quién es",
      paragraphs: [
        [
          `De 3 a 7 años: colorear desde preescolar; el trazo y reconocer, de 4 a 6; ${sheets.some((s) => s.type === "silaba") ? "la primera sílaba y la cursiva" : "la cursiva"}, de 5 a 7; escribir palabras, en primero. Cada ficha también se imprime gratis por separado, desde su página.`,
        ],
      ],
    },
    {
      id: "plan",
      heading: "Un plan de 5 días",
      list: dayLines(fiveDays(sheets.map((s) => s.link)), "Día", "y"),
    },
    {
      id: "letter",
      heading: `La letra ${l.upper}`,
      paragraphs: [
        [
          `${l.sound} Palabras para practicar: ${listJoin(words, "y")}. `,
          { href: localizedPath("es", "/alphabet/[letter]", { letter: l.slug }), text: `Todo sobre la letra ${l.upper}` },
          ".",
        ],
      ],
    },
  ];
}

// ================================================================ Portuguese

type PtType = "colorir" | "bastao" | "forma" | "reconhecer" | "silaba" | "cursiva" | "palavras";
const PT_ORDER: PtType[] = ["colorir", "bastao", "forma", "reconhecer", "silaba", "cursiva", "palavras"];
const PT_LABEL: Record<PtType, string> = {
  colorir: "Colorir",
  bastao: "Letra bastão",
  forma: "Letra de forma",
  reconhecer: "Reconhecer a letra",
  silaba: "Sílaba inicial",
  cursiva: "Cursiva",
  palavras: "Escrever palavras",
};

function ptLine(type: PtType, l: PortugueseLetter): string {
  const w0 = l.words[0];
  const alikes = [...(PT_LOOK_ALIKES[l.lower] ?? "")];
  switch (type) {
    case "colorir":
      return `um ${l.upper} grande e um ${l.lower} para colorir, e uma figura, ${w0.withArticle}, com a palavra em letra de forma e em cursiva.`;
    case "bastao":
      return `o ${l.upper} para cobrir, a palavra ${plain(w0.word).toUpperCase()} em maiúsculas e uma linha para escrever sozinho.`;
    case "forma":
      return `o ${l.lower} para cobrir, a palavra ${lower(w0.word)} e uma linha para escrever sozinho.`;
    case "reconhecer":
      return `14 letras para circular numa grade de 42, nos quatro tipos de letra (bastão, de forma, cursiva maiúscula e minúscula), entre letras parecidas como ${listJoin(alikes.slice(0, 3).map((x) => `o ${x}`), "e")}.`;
    case "silaba": {
      const words = PT_SYLLABLES[l.slug]!;
      const [first] = words;
      return `${words.length} figuras com a primeira sílaba em branco (${listJoin(words.map((w) => lower(w.word)), "e")}), palmas para contar sílabas e ${lower(first.word)} para escrever em cursiva.`;
    }
    case "cursiva":
      return `${l.lower}, ${l.upper} e a palavra ${lower(w0.word)} em cursiva nas linhas de caligrafia: para cobrir e depois escrever sozinho.`;
    case "palavras": {
      const words = portugueseLetterWords(l).map((w) => lower(w.word));
      return `${listJoin(words, "e")}, com a figura, para cobrir e copiar em cursiva.`;
    }
  }
}

function portuguesePack(slug: string): Block[] {
  const pack = getAtividadePack(slug);
  if (!pack || !slug.startsWith("pacote-letra-")) return [];
  const key = slug.slice("pacote-letra-".length);
  const l = getPortugueseLetter(key);
  if (!l) return typePack("pt", pack.atividades);
  const sheets = PT_ORDER.flatMap((t) => {
    const a = pack.atividades.map((s) => getAtividade(s)!).find((x) => x.slug.endsWith(`-${t}`));
    return a ? [{ type: t, link: { href: sheetHref("pt", a.slug), text: PT_LABEL[t] } }] : [];
  });
  const words = l.words.map((w) => lower(w.word));
  return [
    {
      id: "inside",
      heading: "Cada atividade, da mais fácil à mais difícil",
      list: sheets.map((s) => [s.link, `: ${ptLine(s.type, l)}`]),
    },
    {
      id: "who",
      heading: "Para quem é",
      paragraphs: [
        [
          `De 3 a 8 anos: colorir desde os 3; a letra bastão, de 4 a 5; a de forma, de 5 a 6; reconhecer, de 4 a 6${sheets.some((s) => s.type === "silaba") ? "; a sílaba inicial, de 5 a 7" : ""}; a cursiva e as palavras, a partir do 1º ano. Cada atividade também pode ser impressa grátis, sozinha, na página dela.`,
        ],
      ],
    },
    {
      id: "plan",
      heading: "Um plano de 5 dias",
      list: dayLines(fiveDays(sheets.map((s) => s.link)), "Dia", "e"),
    },
    {
      id: "letter",
      heading: l.upper === "Ç" ? "O Ç" : `A letra ${l.upper}`,
      paragraphs: [
        [
          `${l.sound} Palavras para praticar: ${listJoin(words, "e")}. `,
          { href: localizedPath("pt", "/alphabet/[letter]", { letter: l.slug }), text: l.upper === "Ç" ? "Tudo sobre o Ç" : `Tudo sobre a letra ${l.upper}` },
          ".",
        ],
      ],
    },
  ];
}

// ================================================================ type packs (ES cursiva; PT bastão, forma, cursiva)

/** A pack of one sheet type for every letter: what each sheet holds, who it's for and the letters day by day. */
function typePack(locale: "es" | "pt", slugs: string[]): Block[] {
  const sheets = slugs.map((s) => (locale === "es" ? getFicha(s)! : getAtividade(s)!));
  const type = sheets[0].slug.split("-").pop()!;
  const letterOf = (s: (typeof sheets)[number]) => (locale === "es" ? getSpanishLetter(s.letter!)! : getPortugueseLetter(s.letter!)!);
  const examples = sheets.slice(0, 3).map((s) => lower(letterOf(s).words[0].word));
  const days = fiveDays(sheets.map((s) => ({ href: sheetHref(locale, s.slug), text: letterOf(s).upper })));
  const n = sheets.length;
  if (locale === "es") {
    return [
      {
        id: "inside",
        heading: "Qué hay en cada ficha",
        paragraphs: [
          [
            `${n} fichas, una por letra, de la A a la Z con la Ñ. Cada una tiene la letra en cursiva arriba con su dibujo, y después, sobre doble raya como en el cuaderno, la minúscula, la mayúscula y una palabra (${examples.join(", ")}…): primero un modelo con letras grises para repasar, luego una línea para escribir solo.`,
          ],
        ],
      },
      {
        id: "who",
        heading: "Para quién es",
        paragraphs: [[`Para kínder y primero (5 a 7 años), cuando el niño ya traza las letras de imprenta y empieza con la letra ligada. Cada ficha se puede imprimir gratis por separado, desde su página.`]],
      },
      { id: "plan", heading: "Un plan de 5 días", list: dayLines(days, "Día", "y") },
    ];
  }
  const what =
    type === "bastao"
      ? `a letra bastão (maiúscula de forma) para cobrir, uma palavra em maiúsculas (${examples.map((x) => x.toUpperCase()).join(", ")}…) e uma linha para escrever sozinho`
      : type === "forma"
        ? `a letra de forma minúscula, a dos livros, para cobrir, uma palavra (${examples.join(", ")}…) e uma linha para escrever sozinho`
        : `a minúscula, a maiúscula e uma palavra em cursiva (${examples.join(", ")}…) nas linhas de caligrafia: um modelo, letras para cobrir e uma linha para escrever sozinho`;
  const who =
    type === "bastao"
      ? "Para a educação infantil (4 a 5 anos), a primeira letra que a criança aprende a escrever."
      : type === "forma"
        ? "Para a pré-escola e o 1º ano (5 a 6 anos), quando a criança já escreve a letra bastão e começa a ler a letra dos livros."
        : "Para o 1º e o 2º ano (6 a 8 anos), quando a criança passa para a letra cursiva.";
  return [
    { id: "inside", heading: "O que tem em cada atividade", paragraphs: [[`${n} atividades, uma por letra, de A a Z com o Ç. Cada uma tem ${what}.`]] },
    { id: "who", heading: "Para quem é", paragraphs: [[`${who} Cada atividade também pode ser impressa grátis, sozinha, na página dela.`]] },
    { id: "plan", heading: "Um plano de 5 dias", list: dayLines(days, "Dia", "e") },
  ];
}

export function bundleGuide(locale: Locale, slug: string): Block[] {
  switch (locale) {
    case "fr":
      return frenchPack(slug);
    case "es":
      return spanishPack(slug);
    case "pt":
      return portuguesePack(slug);
    default:
      return englishBundle(slug);
  }
}
