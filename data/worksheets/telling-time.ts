// Telling-time sheets (scripts/sheets/clock-layout.ts): clocks drawn in code
// at five levels (o'clock to any minute) and in four activities, plus daily
// routines with our cartoons. Each sheet has an answer key on page 2. The
// times are drawn from the sheet's id, so a sheet never changes, and say
// the time the way each language does ("trois heures et demie",
// "las tres y media", "três e meia").
import { pick, seededRandom, type L10n, type Sheet, type SheetKind, type SheetLocale } from "@/lib/sheets/types";

export type ClockLevel = "oclock" | "half" | "quarter" | "five" | "any";
export type ClockActivity = "read" | "draw" | "match" | "before-after" | "routine";
/** [hour 1–12, minute]. */
export type Time = [number, number];

// ------------------------------------------------------------------ words

const EN = ["", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen"];
const EN_TENS = ["", "", "twenty", "thirty", "forty", "fifty"];
const FR = ["", "une", "deux", "trois", "quatre", "cinq", "six", "sept", "huit", "neuf", "dix", "onze", "douze", "treize", "quatorze", "quinze", "seize", "dix-sept", "dix-huit", "dix-neuf"];
const FR_TENS = ["", "", "vingt", "trente", "quarante", "cinquante"];
const ES = ["", "uno", "dos", "tres", "cuatro", "cinco", "seis", "siete", "ocho", "nueve", "diez", "once", "doce", "trece", "catorce", "quince", "dieciséis", "diecisiete", "dieciocho", "diecinueve", "veinte", "veintiuno", "veintidós", "veintitrés", "veinticuatro", "veinticinco", "veintiséis", "veintisiete", "veintiocho", "veintinueve"];
const ES_TENS = ["", "", "", "treinta", "cuarenta", "cincuenta"];
const PT = ["", "um", "dois", "três", "quatro", "cinco", "seis", "sete", "oito", "nove", "dez", "onze", "doze", "treze", "catorze", "quinze", "dezesseis", "dezessete", "dezoito", "dezenove"];
const PT_TENS = ["", "", "vinte", "trinta", "quarenta", "cinquenta"];

/** A number of minutes, 1–59, in words. */
function minutes(n: number, l: SheetLocale): string {
  const t = Math.floor(n / 10);
  const u = n % 10;
  switch (l) {
    case "en":
      return n < 20 ? EN[n] : EN_TENS[t] + (u ? `-${EN[u]}` : "");
    case "fr":
      // "vingt et une" (minute is feminine).
      return n < 20 ? FR[n] : FR_TENS[t] + (u === 1 ? " et une" : u ? `-${FR[u]}` : "");
    case "es":
      return n < 30 ? ES[n] : ES_TENS[t] + (u ? ` y ${ES[u]}` : "");
    case "pt":
      return n < 20 ? PT[n] : PT_TENS[t] + (u ? ` e ${PT[u]}` : "");
  }
}

const next = (h: number) => (h % 12) + 1;

/** "It's half past three.", "Il est trois heures et demie.", "Son las tres y media.", "São três e meia." */
export function timeWords([h, m]: Time, l: SheetLocale): string {
  switch (l) {
    case "en": {
      const hh = (x: number) => (x === 12 ? "twelve" : EN[x]);
      if (m === 0) return `It's ${hh(h)} o'clock.`;
      if (m === 30) return `It's half past ${hh(h)}.`;
      if (m === 15) return `It's quarter past ${hh(h)}.`;
      if (m === 45) return `It's quarter to ${hh(next(h))}.`;
      return `It's ${hh(h)} ${m < 10 ? `oh ${EN[m]}` : minutes(m, "en")}.`;
    }
    case "fr": {
      // 12 is "midi": the sheets are about the day.
      const hh = (x: number) => (x === 12 ? "midi" : x === 1 ? "une heure" : `${FR[x]} heures`);
      if (m === 0) return `Il est ${hh(h)}.`;
      if (m === 30) return `Il est ${hh(h)} et ${h === 12 ? "demi" : "demie"}.`;
      if (m === 15) return `Il est ${hh(h)} et quart.`;
      if (m === 45) return `Il est ${hh(next(h))} moins le quart.`;
      if (m % 5 === 0 && m > 30) return `Il est ${hh(next(h))} moins ${minutes(60 - m, "fr")}.`;
      return `Il est ${hh(h)} ${minutes(m, "fr")}.`;
    }
    case "es": {
      const hh = (x: number) => (x === 1 ? "la una" : `las ${ES[x]}`);
      const verb = (x: number) => (x === 1 ? "Es" : "Son");
      if (m === 0) return `${verb(h)} ${hh(h)}.`;
      if (m === 30) return `${verb(h)} ${hh(h)} y media.`;
      if (m === 15) return `${verb(h)} ${hh(h)} y cuarto.`;
      if (m === 45) return `${verb(next(h))} ${hh(next(h))} menos cuarto.`;
      if (m % 5 === 0 && m > 30) return `${verb(next(h))} ${hh(next(h))} menos ${minutes(60 - m, "es")}.`;
      return `${verb(h)} ${hh(h)} y ${minutes(m, "es")}.`;
    }
    case "pt": {
      // Hours are feminine: "uma", "duas"; 12 is "meio-dia".
      const word = (x: number) => (x === 1 ? "uma" : x === 2 ? "duas" : x === 12 ? "meio-dia" : PT[x]);
      const verb = (x: number) => (x === 1 || x === 12 ? "É" : "São");
      if (m === 0) return `${verb(h)} ${word(h)}${h === 12 ? "" : h === 1 ? " hora" : " horas"}.`;
      if (m === 30) return `${verb(h)} ${word(h)} e meia.`;
      if (m === 45) {
        const n = next(h);
        return `São quinze para ${n === 1 ? "a uma" : n === 12 ? "o meio-dia" : `as ${word(n)}`}.`;
      }
      return `${verb(h)} ${word(h)} e ${minutes(m, "pt")}.`;
    }
  }
}

/** "3:30"; French writes "3 h 30" ("3 h" on the hour). */
export function digital([h, m]: Time, l: SheetLocale): string {
  if (l === "fr") return m ? `${h} h ${String(m).padStart(2, "0")}` : `${h} h`;
  return `${h}:${String(m).padStart(2, "0")}`;
}

// ------------------------------------------------------------------ levels

const LEVELS: Record<ClockLevel, { name: L10n; minutes: number[] }> = {
  oclock: { name: { en: "O'Clock", fr: "les heures pile", es: "las horas en punto", pt: "as horas exatas" }, minutes: [0] },
  half: { name: { en: "Half Past", fr: "les heures et demie", es: "las horas y media", pt: "as horas e meia" }, minutes: [30] },
  quarter: { name: { en: "Quarter Past and Quarter To", fr: "et quart, moins le quart", es: "y cuarto, menos cuarto", pt: "e quinze, quinze para" }, minutes: [15, 45] },
  five: { name: { en: "5 Minutes", fr: "de 5 en 5 minutes", es: "de 5 en 5 minutos", pt: "de 5 em 5 minutos" }, minutes: [5, 10, 20, 25, 35, 40, 50, 55] },
  any: { name: { en: "Any Minute", fr: "à la minute près", es: "minuto a minuto", pt: "minuto a minuto" }, minutes: Array.from({ length: 59 }, (_, i) => i + 1).filter((m) => m % 5) },
};

const ACTIVITIES: Record<Exclude<ClockActivity, "routine">, { name: L10n; count: number; instruction: L10n }> = {
  read: {
    name: { en: "What Time Is It?", fr: "Quelle heure est-il ?", es: "¿Qué hora es?", pt: "Que horas são?" },
    count: 6,
    instruction: {
      en: "Look at each clock and write the time.",
      fr: "Regarde chaque horloge et écris l'heure.",
      es: "Mira cada reloj y escribe la hora.",
      pt: "Olhe cada relógio e escreva a hora.",
    },
  },
  draw: {
    name: { en: "Draw the Hands", fr: "Dessine les aiguilles", es: "Dibuja las manecillas", pt: "Desenhe os ponteiros" },
    count: 6,
    instruction: {
      en: "Draw the hands: the short one for the hour, the long one for the minutes.",
      fr: "Dessine les aiguilles : la petite pour les heures, la grande pour les minutes.",
      es: "Dibuja las manecillas: la corta para la hora, la larga para los minutos.",
      pt: "Desenhe os ponteiros: o pequeno para as horas, o grande para os minutos.",
    },
  },
  match: {
    name: { en: "Match the Clocks", fr: "Relie les horloges", es: "Une los relojes", pt: "Ligue os relógios" },
    count: 5,
    instruction: {
      en: "Draw a line from each clock to the same time.",
      fr: "Relie chaque horloge à la même heure.",
      es: "Une cada reloj con la misma hora.",
      pt: "Ligue cada relógio à mesma hora.",
    },
  },
  "before-after": {
    name: { en: "One Hour Before and After", fr: "Une heure avant, une heure après", es: "Una hora antes y después", pt: "Uma hora antes e depois" },
    count: 4,
    instruction: {
      en: "Write the time one hour before and one hour after each clock.",
      fr: "Écris l'heure qu'il était une heure avant, et celle qu'il sera une heure après.",
      es: "Escribe la hora una hora antes y una hora después de cada reloj.",
      pt: "Escreva a hora uma hora antes e uma hora depois de cada relógio.",
    },
  },
};

// ------------------------------------------------------------------ routines

export type RoutineStep = { time: Time; picture: string; text: L10n };

const step = (h: number, m: number, picture: string, en: string, fr: string, es: string, pt: string): RoutineStep => ({ time: [h, m], picture, text: { en, fr, es, pt } });

const ROUTINES: { id: string; name: L10n; steps: RoutineStep[] }[] = [
  {
    id: "school-day",
    name: { en: "My School Day", fr: "Ma journée d'école", es: "Mi día de escuela", pt: "Meu dia de escola" },
    steps: [
      step(7, 0, "alarm-clock", "I wake up at 7:00.", "Je me réveille à 7 h.", "Me despierto a las 7:00.", "Eu acordo às 7:00."),
      step(7, 30, "bread", "I eat breakfast at 7:30.", "Je prends mon petit déjeuner à 7 h 30.", "Desayuno a las 7:30.", "Eu tomo café da manhã às 7:30."),
      step(8, 0, "school", "I go to school at 8:00.", "Je vais à l'école à 8 h.", "Voy a la escuela a las 8:00.", "Eu vou para a escola às 8:00."),
      step(12, 0, "soup", "I eat lunch at 12:00.", "Je déjeune à midi.", "Como a las 12:00.", "Eu almoço ao meio-dia."),
      step(4, 30, "ball", "I play at 4:30.", "Je joue à 4 h 30.", "Juego a las 4:30.", "Eu brinco às 4:30."),
      step(8, 0, "bed", "I go to bed at 8:00.", "Je me couche à 8 h.", "Me acuesto a las 8:00.", "Eu vou dormir às 8:00."),
    ],
  },
  {
    id: "weekend",
    name: { en: "My Weekend", fr: "Mon week-end", es: "Mi fin de semana", pt: "Meu fim de semana" },
    steps: [
      step(8, 30, "sun", "I get up at 8:30.", "Je me lève à 8 h 30.", "Me levanto a las 8:30.", "Eu levanto às 8:30."),
      step(9, 0, "juice", "I drink juice at 9:00.", "Je bois du jus à 9 h.", "Tomo jugo a las 9:00.", "Eu tomo suco às 9:00."),
      step(10, 0, "bicycle", "I ride my bike at 10:00.", "Je fais du vélo à 10 h.", "Ando en bici a las 10:00.", "Eu ando de bicicleta às 10:00."),
      step(12, 30, "pizza", "I eat lunch at 12:30.", "Je déjeune à midi et demi.", "Como a las 12:30.", "Eu almoço ao meio-dia e meia."),
      step(6, 0, "bathtub", "I take a bath at 6:00.", "Je prends mon bain à 6 h.", "Me baño a las 6:00.", "Eu tomo banho às 6:00."),
      step(8, 30, "book", "I read a story at 8:30.", "Je lis une histoire à 8 h 30.", "Leo un cuento a las 8:30.", "Eu leio uma história às 8:30."),
    ],
  },
];

// ------------------------------------------------------------------ sheets

export type TellingTimeParams = { activity: ClockActivity; level: ClockLevel | null; times: Time[]; routine?: string };
export type TellingTimeSheet = Sheet<TellingTimeParams>;

export const getRoutine = (id: string) => ROUTINES.find((r) => r.id === id)!;

/** `n` times of a level, on different hours, from a seed. */
function times(level: ClockLevel, n: number, seed: string): Time[] {
  const rand = seededRandom(seed);
  const hours = pick(Array.from({ length: 12 }, (_, i) => i + 1), n, rand);
  const mins = LEVELS[level].minutes;
  return hours.map((h) => [h, mins[Math.floor(rand() * mins.length)]]);
}

const SLUG_LEVEL: Record<ClockLevel, L10n> = {
  oclock: { en: "o-clock", fr: "heures-pile", es: "en-punto", pt: "horas-exatas" },
  half: { en: "half-past", fr: "et-demie", es: "y-media", pt: "e-meia" },
  quarter: { en: "quarter-past-to", fr: "et-quart-moins-le-quart", es: "y-cuarto-menos-cuarto", pt: "e-quinze-quinze-para" },
  five: { en: "5-minutes", fr: "5-minutes", es: "5-minutos", pt: "5-minutos" },
  any: { en: "any-minute", fr: "minute-pres", es: "minuto-a-minuto", pt: "minuto-a-minuto" },
};
const SLUG_ACTIVITY: Record<Exclude<ClockActivity, "routine">, L10n> = {
  read: { en: "what-time-is-it", fr: "quelle-heure-est-il", es: "que-hora-es", pt: "que-horas-sao" },
  draw: { en: "draw-the-clock-hands", fr: "dessine-les-aiguilles", es: "dibuja-las-manecillas", pt: "desenhe-os-ponteiros" },
  match: { en: "match-the-clocks", fr: "relie-les-horloges", es: "une-los-relojes", pt: "ligue-os-relogios" },
  "before-after": { en: "one-hour-before-and-after", fr: "une-heure-avant-apres", es: "una-hora-antes-y-despues", pt: "uma-hora-antes-e-depois" },
};
const SHEET_WORD: L10n = { en: "Sheet", fr: "fiche", es: "ficha", pt: "atividade" };

function activitySheet(activity: Exclude<ClockActivity, "routine">, level: ClockLevel, set: number): TellingTimeSheet {
  const a = ACTIVITIES[activity];
  const lv = LEVELS[level].name;
  const id = `time-${activity}-${level}-${set}`;
  // "What Time Is It? Half Past", "Draw the Hands: Half Past".
  const sep = (l: SheetLocale) => (a.name[l].endsWith("?") ? " " : l === "fr" ? " : " : ": ");
  // A capital after a question mark: "Quelle heure est-il ? Les heures pile".
  const after = (l: SheetLocale) => (a.name[l].endsWith("?") ? lv[l].charAt(0).toUpperCase() + lv[l].slice(1) : lv[l]);
  return {
    kind: "telling-time",
    id,
    slug: {
      en: `${SLUG_ACTIVITY[activity].en}-${SLUG_LEVEL[level].en}-${set}`,
      fr: `${SLUG_ACTIVITY[activity].fr}-${SLUG_LEVEL[level].fr}-${set}`,
      es: `${SLUG_ACTIVITY[activity].es}-${SLUG_LEVEL[level].es}-${set}`,
      pt: `${SLUG_ACTIVITY[activity].pt}-${SLUG_LEVEL[level].pt}-${set}`,
    },
    title: {
      en: `${a.name.en}${sep("en")}${lv.en}, Sheet ${set}`,
      fr: `${a.name.fr}${sep("fr")}${after("fr")}, ${SHEET_WORD.fr} ${set}`,
      es: `${a.name.es}${sep("es")}${after("es")}, ${SHEET_WORD.es} ${set}`,
      pt: `${a.name.pt}${sep("pt")}${after("pt")}, ${SHEET_WORD.pt} ${set}`,
    },
    label: {
      en: `${lv.en}, sheet ${set}`,
      fr: `${lv.fr.charAt(0).toUpperCase() + lv.fr.slice(1)}, ${SHEET_WORD.fr} ${set}`,
      es: `${lv.es.charAt(0).toUpperCase() + lv.es.slice(1)}, ${SHEET_WORD.es} ${set}`,
      pt: `${lv.pt.charAt(0).toUpperCase() + lv.pt.slice(1)}, ${SHEET_WORD.pt} ${set}`,
    },
    description: {
      en: `Free printable telling time worksheet (${lv.en.toLowerCase()}): ${a.instruction.en.charAt(0).toLowerCase() + a.instruction.en.slice(1)} Answer key on page 2.`,
      fr: `Fiche gratuite pour apprendre à lire l'heure (${lv.fr}) : ${a.instruction.fr.charAt(0).toLowerCase() + a.instruction.fr.slice(1)} Corrigé en page 2.`,
      es: `Ficha gratis para aprender la hora (${lv.es}): ${a.instruction.es.charAt(0).toLowerCase() + a.instruction.es.slice(1)} Respuestas en la página 2.`,
      pt: `Atividade grátis para aprender as horas (${lv.pt}): ${a.instruction.pt.charAt(0).toLowerCase() + a.instruction.pt.slice(1)} Gabarito na página 2.`,
    },
    instruction: a.instruction,
    filters: { level, activity },
    pages: 2,
    params: { activity, level, times: times(level, a.count, id) },
  };
}

function routineSheet(r: (typeof ROUTINES)[number]): TellingTimeSheet {
  return {
    kind: "telling-time",
    id: `time-routine-${r.id}`,
    slug: {
      en: `daily-routine-clocks-${r.id}`,
      fr: `routine-horloges-${r.id === "weekend" ? "week-end" : "journee-ecole"}`,
      es: `rutina-relojes-${r.id === "weekend" ? "fin-de-semana" : "dia-de-escuela"}`,
      pt: `rotina-relogios-${r.id === "weekend" ? "fim-de-semana" : "dia-de-escola"}`,
    },
    title: {
      en: `Daily Routine Clocks: ${r.name.en}`,
      fr: `Les heures de la journée : ${r.name.fr.charAt(0).toLowerCase() + r.name.fr.slice(1)}`,
      es: `Las horas del día: ${r.name.es.charAt(0).toLowerCase() + r.name.es.slice(1)}`,
      pt: `As horas do dia: ${r.name.pt.charAt(0).toLowerCase() + r.name.pt.slice(1)}`,
    },
    label: r.name,
    description: {
      en: `Free printable daily routine worksheet: read what happens at each time of ${r.name.en.toLowerCase()} and draw the hands on the clock. Answer key on page 2.`,
      fr: `Fiche gratuite sur les heures de la journée : lis ce qui se passe à chaque heure et dessine les aiguilles sur l'horloge. Corrigé en page 2.`,
      es: `Ficha gratis sobre las horas del día: lee lo que pasa a cada hora y dibuja las manecillas en el reloj. Respuestas en la página 2.`,
      pt: `Atividade grátis sobre as horas do dia: leia o que acontece em cada hora e desenhe os ponteiros no relógio. Gabarito na página 2.`,
    },
    instruction: {
      en: "Read each sentence, then draw the hands on the clock.",
      fr: "Lis chaque phrase, puis dessine les aiguilles sur l'horloge.",
      es: "Lee cada frase y dibuja las manecillas en el reloj.",
      pt: "Leia cada frase e desenhe os ponteiros no relógio.",
    },
    filters: { level: "routine", activity: "routine" },
    pages: 2,
    params: { activity: "routine", level: null, times: r.steps.map((s) => s.time), routine: r.id },
  };
}

export const tellingTimeSheets: TellingTimeSheet[] = [
  ...(["oclock", "half", "quarter", "five", "any"] as ClockLevel[]).flatMap((level) =>
    (["read", "draw", "match", "before-after"] as const).flatMap((activity) => [1, 2].map((set) => activitySheet(activity, level, set))),
  ),
  ...ROUTINES.map(routineSheet),
];

export const ANSWER_KEY: L10n = { en: "Answer key", fr: "Corrigé", es: "Respuestas", pt: "Gabarito" };

export const tellingTimeKind: SheetKind = {
  id: "telling-time",
  slug: { en: "telling-time", fr: "lire-l-heure", es: "aprender-la-hora", pt: "aprender-as-horas" },
  name: { en: "Telling Time", fr: "Lire l'heure", es: "Aprender la hora", pt: "Aprender as horas" },
  heading: {
    en: "Telling Time Worksheets for Kids",
    fr: "Fiches pour apprendre à lire l'heure",
    es: "Fichas para aprender la hora",
    pt: "Atividades para aprender as horas",
  },
  metaTitle: {
    en: "Telling Time Worksheets: Clocks to Read and Draw | Free PDFs",
    fr: "Apprendre à lire l'heure : fiches gratuites à imprimer",
    es: "Aprender la hora: fichas de relojes gratis",
    pt: "Aprender as horas: atividades de relógio grátis",
  },
  description: {
    en: "Free printable telling time worksheets: read clocks, draw the hands, match analog and digital times, from o'clock to any minute, with answer keys.",
    fr: "Fiches gratuites pour lire l'heure : lire une horloge, dessiner les aiguilles, relier horloges et heures, des heures pile à la minute près, avec corrigés.",
    es: "Fichas gratis para aprender la hora: leer relojes, dibujar las manecillas y unir relojes con la hora digital, de la hora en punto al minuto, con respuestas.",
    pt: "Atividades grátis para aprender as horas: ler relógios, desenhar ponteiros e ligar relógios à hora digital, das horas exatas ao minuto, com gabarito.",
  },
  intro: {
    en: "Every clock has the numbers 1 to 12, a short pink hand for the hour and a long blue hand for the minutes. Start with o'clock, then half past, quarter past and quarter to, 5-minute steps and finally any minute. Each sheet has an answer key on page 2.",
    fr: "Chaque horloge a les nombres de 1 à 12, une petite aiguille rose pour les heures et une grande aiguille bleue pour les minutes. On commence par les heures pile, puis les demies, les quarts, les minutes de 5 en 5 et enfin la minute près. Chaque fiche a son corrigé en page 2.",
    es: "Cada reloj tiene los números del 1 al 12, una manecilla corta rosa para la hora y una larga azul para los minutos. Se empieza por la hora en punto, luego y media, y cuarto y menos cuarto, de 5 en 5 minutos y por último minuto a minuto. Cada ficha trae las respuestas en la página 2.",
    pt: "Cada relógio tem os números de 1 a 12, um ponteiro pequeno rosa para as horas e um grande azul para os minutos. Comece pelas horas exatas, depois e meia, e quinze e quinze para, de 5 em 5 minutos e por fim minuto a minuto. Cada atividade traz o gabarito na página 2.",
  },
  howTo: {
    en: "Use a real clock next to the sheet if you have one. Read the short hand first (the hour), then the long hand (the minutes). Say each time out loud together.",
    fr: "Si possible, gardez une vraie horloge à côté de la fiche. On lit d'abord la petite aiguille (les heures), puis la grande (les minutes). Dites chaque heure à voix haute ensemble.",
    es: "Si pueden, tengan un reloj de verdad junto a la ficha. Primero se lee la manecilla corta (la hora) y luego la larga (los minutos). Digan cada hora en voz alta juntos.",
    pt: "Se puder, deixe um relógio de verdade ao lado da atividade. Primeiro lê-se o ponteiro pequeno (as horas), depois o grande (os minutos). Digam cada hora em voz alta juntos.",
  },
  level: {
    en: "Kindergarten to second grade (ages 5–8)",
    fr: "De la grande section au CE1 (5 à 8 ans)",
    es: "Preescolar a segundo grado (5 a 8 años)",
    pt: "Educação infantil ao 2º ano (5 a 8 anos)",
  },
  skills: {
    en: ["Telling time", "Numbers to 60", "Daily routines"],
    fr: ["Lire l'heure", "Nombres jusqu'à 60", "Moments de la journée"],
    es: ["Leer la hora", "Números hasta 60", "Rutinas del día"],
    pt: ["Ler as horas", "Números até 60", "Rotina do dia"],
  },
  filters: [
    {
      key: "level",
      label: { en: "Level", fr: "Niveau", es: "Nivel", pt: "Nível" },
      options: [
        ...(Object.keys(LEVELS) as ClockLevel[]).map((v) => ({ value: v, label: LEVELS[v].name })),
        { value: "routine", label: { en: "Daily routine", fr: "Journée", es: "Rutina", pt: "Rotina" } },
      ],
    },
    {
      key: "activity",
      label: { en: "Activity", fr: "Activité", es: "Actividad", pt: "Atividade" },
      options: [
        ...(Object.keys(ACTIVITIES) as Exclude<ClockActivity, "routine">[]).map((v) => ({ value: v, label: ACTIVITIES[v].name })),
        { value: "routine", label: { en: "Daily routine", fr: "Journée", es: "Rutina", pt: "Rotina" } },
      ],
    },
  ],
};
