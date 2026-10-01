// Spanish syllables ("las sílabas"): the pages under /es/silabas. Spanish
// children learn to read with the syllable method (método silábico): the
// vowels, then direct syllables (ma, me, mi, mo, mu), inverse and closed
// ones, blends (bla, tra), then the letters whose sound depends on their
// neighbours (ca/ce, ga/ge, que, gue, güe), ch, ll, rr and the silent h.
// These pages don't mirror the English phonics skills or the French sounds;
// every page is Spanish-only (docs/spanish-plan.md).
//
// Word markup, shared with the French sounds (components/sons/MarkedWord):
//   "[ch]ocolate"  highlights the letters the page is about
//                  (on the silent-h page: the silent letter)
//   "ma|no"        splits a word into syllables
//
// Spanish spelling is regular, so browser voices read syllables like "ma",
// "pla" or "gue" well; tiles still get a `spoken` text where a lone letter
// group could be misread ("bl" → "bla, ble, bli, blo, blu").
//
// Data only (type imports are erased), so middleware, pages and tests can
// all use it.
import type { SoundHunt, SoundTile, SoundWord } from "@/lib/sons-fr";

/** A word to build from its syllables, with two decoy syllables. */
export type BuildWord = {
  word: string;
  withArticle: string;
  emoji: string;
  syllables: string[];
  extra: string[];
};

export type SyllableGroup = "base" | "trabadas" | "especiales" | "palabras";

export type SpanishSyllablePage = {
  slug: string;
  /** Page heading. */
  title: string;
  /** <title> (the layout adds "| AlphaBes"). */
  metaTitle: string;
  /** What goes in the big block ("ma", "ch"…). */
  short: string;
  level: string;
  group: SyllableGroup;
  /** Card blurb and meta description. */
  summary: string;
  intro: string;
  /** Read by the "Escuchar" button. */
  spoken: string;
  /** How [brackets] are shown: the letters studied (default) or silent letters. */
  marks?: "sound" | "silent";
  words?: SoundWord[];
  rules?: string[];
  /** Syllable tables to listen to, one row per consonant or group. */
  tiles?: { title: string; items: SoundTile[] }[];
  /** Shows the consonant + vowel syllable builder. */
  builder?: boolean;
  /** "Arma la palabra" exercise. */
  build?: BuildWord[];
  /** "Aplaude las sílabas" exercise (words with | markup). */
  clap?: SoundWord[];
  hunt?: SoundHunt;
  sentence?: string;
  /** "Para mamá y papá" note. */
  tip: string;
  faq: { question: string; answer: string }[];
  /** Page slugs linked from the page. */
  related: string[];
};

export const SYLLABLE_GROUPS: { id: SyllableGroup; title: string; blurb: string }[] = [
  {
    id: "base",
    title: "Las vocales y las sílabas",
    blurb: "Las cinco vocales, y luego una consonante y una vocal juntas: ma, me, mi, mo, mu. Así se empieza a leer en español.",
  },
  {
    id: "trabadas",
    title: "Las sílabas trabadas",
    blurb: "Dos consonantes juntas antes de la vocal: bla, cla, pla; bra, tra, gra. Llegan cuando las sílabas directas ya salen solas.",
  },
  {
    id: "especiales",
    title: "Letras y sonidos especiales",
    blurb: "Las letras que suenan distinto según la vocal que las sigue, las que suenan igual, la h que no suena, y la ch, la ll y la rr.",
  },
  {
    id: "palabras",
    title: "Leer de corrido",
    blurb: "Las palabras cortas que aparecen en todas las oraciones.",
  },
];

/** Consonants and vowels offered by the Spanish syllable builder. */
export const ES_BUILDER_CONSONANTS = ["m", "p", "s", "l", "t", "d", "n", "f", "b", "j", "ñ", "r", "ch", "ll"];
export const ES_BUILDER_VOWELS = ["a", "e", "i", "o", "u"];

const row = (title: string, syllables: string, note?: string): { title: string; items: SoundTile[] } => ({
  title,
  items: syllables.split(" ").map((label) => ({ label, ...(note && { note }) })),
});

export const spanishSyllablePages: SpanishSyllablePage[] = [
  {
    slug: "vocales",
    title: "Las vocales",
    metaTitle: "Las vocales para niños: a, e, i, o, u, con palabras y juegos",
    short: "a e i o u",
    level: "Preescolar (3 a 5 años)",
    group: "base",
    summary: "a, e, i, o, u: las cinco vocales del español. Siempre suenan igual y con ellas se forman todas las sílabas.",
    intro:
      "El español tiene cinco vocales: a, e, i, o, u. A diferencia de otros idiomas, cada vocal tiene un solo sonido, que no cambia de una palabra a otra. Son la base de la lectura: todas las sílabas llevan por lo menos una vocal.",
    spoken: "a, e, i, o, u. a de avión. e de estrella. i de isla. o de oso. u de uva.",
    tiles: [
      {
        title: "Escucha las vocales",
        items: [
          { label: "a", note: "avión" },
          { label: "e", note: "estrella" },
          { label: "i", note: "isla" },
          { label: "o", note: "oso" },
          { label: "u", note: "uva" },
        ],
      },
    ],
    words: [
      { word: "[a]vión", withArticle: "un avión", emoji: "✈️" },
      { word: "[e]strella", withArticle: "una estrella", emoji: "⭐" },
      { word: "[i]sla", withArticle: "una isla", emoji: "🏝️" },
      { word: "[o]so", withArticle: "un oso", emoji: "🐻" },
      { word: "[u]va", withArticle: "una uva", emoji: "🍇" },
      { word: "[e]lefante", withArticle: "un elefante", emoji: "🐘" },
    ],
    hunt: {
      question: "¿Qué palabras empiezan con una vocal?",
      yes: "Sí: «{mot}» empieza con vocal.",
      no: "No: «{mot}» empieza con consonante.",
      items: [
        { word: "oveja", withArticle: "una oveja", emoji: "🐑", answer: true },
        { word: "gato", withArticle: "un gato", emoji: "🐱", answer: false },
        { word: "iguana", withArticle: "una iguana", emoji: "🦎", answer: true },
        { word: "luna", withArticle: "una luna", emoji: "🌙", answer: false },
        { word: "abeja", withArticle: "una abeja", emoji: "🐝", answer: true },
        { word: "perro", withArticle: "un perro", emoji: "🐶", answer: false },
      ],
    },
    sentence: "Ana y Eva ven un oso.",
    tip: "Canten juntos una canción de las vocales y acompañen cada una con un gesto: la boca bien abierta para la a, sonriendo para la i, redonda para la o, como un besito para la u. Con las vocales bien aprendidas, las sílabas llegan mucho más fácil.",
    faq: [
      {
        question: "¿La y es una vocal?",
        answer: "Se cuenta como consonante, aunque suena como i cuando va sola (y) o al final de una palabra (rey, muy). Las vocales del español son cinco: a, e, i, o, u.",
      },
      {
        question: "¿A qué edad se aprenden las vocales?",
        answer: "Muchos niños las reconocen entre los 3 y los 5 años, en preescolar. Primero aprenden a oírlas al principio de las palabras y después a reconocerlas escritas.",
      },
    ],
    related: ["silabas-directas", "contar-silabas"],
  },
  {
    slug: "silabas-directas",
    title: "Las sílabas directas",
    metaTitle: "Sílabas directas: ma, me, mi, mo, mu para empezar a leer",
    short: "ma",
    level: "Kínder y primero (4 a 6 años)",
    group: "base",
    summary: "Una consonante y una vocal forman una sílaba directa: m y a hacen «ma». Es el corazón del método silábico.",
    intro:
      "En español se aprende a leer uniendo una consonante con una vocal. La m con la a hace «ma»; con las cinco vocales salen ma, me, mi, mo, mu. Estas son las sílabas directas, y con muy pocas ya se leen palabras de verdad: mamá, mano, pato, sopa.",
    spoken: "ma, me, mi, mo, mu. ma, no: mano.",
    builder: true,
    tiles: [
      row("Con la m", "ma me mi mo mu"),
      row("Con la p", "pa pe pi po pu"),
      row("Con la s", "sa se si so su"),
      row("Con la l", "la le li lo lu"),
      row("Con la t", "ta te ti to tu"),
    ],
    words: [
      { word: "ma|no", withArticle: "una mano", emoji: "✋" },
      { word: "lu|na", withArticle: "una luna", emoji: "🌙" },
      { word: "pa|to", withArticle: "un pato", emoji: "🦆" },
      { word: "so|pa", withArticle: "una sopa", emoji: "🍲" },
      { word: "to|ma|te", withArticle: "un tomate", emoji: "🍅" },
      { word: "pe|lo|ta", withArticle: "una pelota", emoji: "⚽" },
    ],
    build: [
      { word: "mano", withArticle: "una mano", emoji: "✋", syllables: ["ma", "no"], extra: ["mi", "lo"] },
      { word: "luna", withArticle: "una luna", emoji: "🌙", syllables: ["lu", "na"], extra: ["la", "ne"] },
      { word: "pato", withArticle: "un pato", emoji: "🦆", syllables: ["pa", "to"], extra: ["po", "ta"] },
      { word: "sopa", withArticle: "una sopa", emoji: "🍲", syllables: ["so", "pa"], extra: ["su", "pe"] },
      { word: "dado", withArticle: "un dado", emoji: "🎲", syllables: ["da", "do"], extra: ["de", "di"] },
      { word: "foca", withArticle: "una foca", emoji: "🦭", syllables: ["fo", "ca"], extra: ["fa", "co"] },
      { word: "tomate", withArticle: "un tomate", emoji: "🍅", syllables: ["to", "ma", "te"], extra: ["ta", "mo"] },
      { word: "pelota", withArticle: "una pelota", emoji: "⚽", syllables: ["pe", "lo", "ta"], extra: ["pa", "li"] },
    ],
    sentence: "Mi mamá me mima.",
    tip: "Para unir una consonante con una vocal, alarguen la consonante y deslícense hacia la vocal: «mmmma». Por eso muchas escuelas empiezan con m, s, l y f, que se pueden alargar, y dejan p, t y d para después. Diez minutos al día bastan.",
    faq: [
      {
        question: "¿Qué es el método silábico?",
        answer: "Es aprender a leer juntando sonidos: primero las vocales, luego cada consonante con las cinco vocales (ma, me, mi, mo, mu) y después palabras y oraciones. Es la forma más usada para enseñar a leer en español, porque las palabras se leen tal como se escriben.",
      },
      {
        question: "Mi hijo lee las sílabas pero no la palabra completa. ¿Es normal?",
        answer: "Sí, al principio. Leer «ma» y luego «no» sin oír «mano» es un paso normal. Pídele que lo vuelva a leer un poco más rápido cada vez: la palabra termina saliendo sola.",
      },
    ],
    related: ["vocales", "silabas-inversas", "contar-silabas"],
  },
  {
    slug: "silabas-inversas",
    title: "Las sílabas inversas",
    metaTitle: "Sílabas inversas: al, el, is, on, un, con palabras para leer",
    short: "al",
    level: "Primero de primaria (5 a 7 años)",
    group: "base",
    summary: "Primero la vocal y después la consonante: al, en, is, or, un. Aparecen en palabras como isla, árbol o escoba.",
    intro:
      "En las sílabas inversas el orden se da vuelta: primero va la vocal y después la consonante. a con l hace «al», e con n hace «en». Muchas palabras empiezan así: isla, árbol, escoba, antena.",
    spoken: "al, el, il, ol, ul. is, la: isla.",
    tiles: [
      row("Con la l", "al el il ol ul"),
      row("Con la n", "an en in on un"),
      row("Con la s", "as es is os us"),
      row("Con la r", "ar er ir or ur"),
    ],
    words: [
      { word: "[is]la", withArticle: "una isla", emoji: "🏝️" },
      { word: "[ár]bol", withArticle: "un árbol", emoji: "🌳" },
      { word: "[es]coba", withArticle: "una escoba", emoji: "🧹" },
      { word: "[an]tena", withArticle: "una antena", emoji: "📡" },
      { word: "[en]salada", withArticle: "una ensalada", emoji: "🥗" },
      { word: "[el]fo", withArticle: "un elfo", emoji: "🧝" },
    ],
    build: [
      { word: "isla", withArticle: "una isla", emoji: "🏝️", syllables: ["is", "la"], extra: ["si", "al"] },
      { word: "árbol", withArticle: "un árbol", emoji: "🌳", syllables: ["ár", "bol"], extra: ["ra", "bo"] },
      { word: "escoba", withArticle: "una escoba", emoji: "🧹", syllables: ["es", "co", "ba"], extra: ["se", "ca"] },
      { word: "antena", withArticle: "una antena", emoji: "📡", syllables: ["an", "te", "na"], extra: ["ta", "ne"] },
    ],
    sentence: "El oso está en la isla.",
    tip: "Si tu hijo lee «la» en vez de «al», es que todavía lee siempre consonante y vocal. Señala con el dedo la letra que va primero y lean despacio, letra por letra: a… l… «al».",
    faq: [
      {
        question: "¿Por qué cuestan más las sílabas inversas?",
        answer: "Porque los niños se acostumbran a leer primero la consonante (la, sa, ma). En «al» o «es» tienen que empezar por la vocal. Practicar en pares ayuda: la y al, sa y as, ma y am.",
      },
      {
        question: "¿Cuándo se aprenden?",
        answer: "Después de las sílabas directas, cuando el niño ya lee ma, pa, la con soltura. Suele ser en primero de primaria.",
      },
    ],
    related: ["silabas-directas", "silabas-mixtas"],
  },
  {
    slug: "silabas-mixtas",
    title: "Las sílabas mixtas",
    metaTitle: "Sílabas mixtas (cerradas): sol, pan, mar, con palabras para leer",
    short: "sol",
    level: "Primero de primaria (6 a 7 años)",
    group: "base",
    summary: "Consonante, vocal y otra consonante: sol, pan, mar, pez. También se llaman sílabas cerradas.",
    intro:
      "Una sílaba mixta tiene una consonante, una vocal y otra consonante al final: s-o-l, «sol». Muchas palabras cortas son una sola sílaba mixta (sol, pan, mar, pez), y muchas palabras largas terminan con una (lápiz, caracol).",
    spoken: "sol. pan. mar. pez. lá, piz: lápiz.",
    words: [
      { word: "[sol]", withArticle: "un sol", emoji: "☀️" },
      { word: "[pan]", withArticle: "un pan", emoji: "🍞" },
      { word: "[mar]", withArticle: "un mar", emoji: "🌊" },
      { word: "[pez]", withArticle: "un pez", emoji: "🐟" },
      { word: "lá[piz]", withArticle: "un lápiz", emoji: "✏️" },
      { word: "cara[col]", withArticle: "un caracol", emoji: "🐌" },
    ],
    build: [
      { word: "lápiz", withArticle: "un lápiz", emoji: "✏️", syllables: ["lá", "piz"], extra: ["pi", "la"] },
      { word: "caracol", withArticle: "un caracol", emoji: "🐌", syllables: ["ca", "ra", "col"], extra: ["co", "ar"] },
      { word: "pantalón", withArticle: "un pantalón", emoji: "👖", syllables: ["pan", "ta", "lón"], extra: ["pa", "lo"] },
      { word: "ratón", withArticle: "un ratón", emoji: "🐭", syllables: ["ra", "tón"], extra: ["ro", "to"] },
    ],
    sentence: "El sol sale en el mar.",
    tip: "Lean la sílaba en dos pasos: primero la sílaba directa y luego la consonante final, «so… l», «sol». Cuando salga sola, lean palabras de una sílaba mixta como sol, pan, mar o luz.",
    faq: [
      {
        question: "¿Qué diferencia hay entre una sílaba mixta y una trabada?",
        answer: "En la mixta, la segunda consonante va después de la vocal (sol, pan). En la trabada, las dos consonantes van antes de la vocal (pla, tre). Las dos se aprenden después de las directas.",
      },
      {
        question: "¿Qué consonantes cierran las sílabas?",
        answer: "En español casi siempre l, n, r, s, z o d: sol, pan, mar, mes, pez, red. Por eso las sílabas mixtas se practican sobre todo con esas letras.",
      },
    ],
    related: ["silabas-inversas", "trabadas-con-l", "contar-silabas"],
  },
  {
    slug: "contar-silabas",
    title: "Aplaude las sílabas",
    metaTitle: "Contar sílabas aplaudiendo: juego para niños de preescolar",
    short: "👏",
    level: "Preescolar y kínder (4 a 6 años)",
    group: "base",
    summary: "Aplaudir una vez por cada sílaba: sol, una palmada; ma-ri-po-sa, cuatro. Un juego de oído antes de leer.",
    intro:
      "Antes de leer, los niños aprenden a oír que las palabras están hechas de pedacitos: las sílabas. Se aplaude una vez por cada sílaba. Sol tiene una, ca-sa tiene dos, ma-ri-po-sa tiene cuatro. No hace falta saber leer: es un juego de oído.",
    spoken: "sol. ca, sa: casa. ma, ri, po, sa: mariposa.",
    clap: [
      { word: "sol", withArticle: "un sol", emoji: "☀️" },
      { word: "ca|sa", withArticle: "una casa", emoji: "🏠" },
      { word: "pe|lo|ta", withArticle: "una pelota", emoji: "⚽" },
      { word: "ma|ri|po|sa", withArticle: "una mariposa", emoji: "🦋" },
      { word: "flor", withArticle: "una flor", emoji: "🌸" },
      { word: "co|ne|jo", withArticle: "un conejo", emoji: "🐰" },
      { word: "hi|po|pó|ta|mo", withArticle: "un hipopótamo", emoji: "🦛" },
      { word: "ga|to", withArticle: "un gato", emoji: "🐱" },
      { word: "e|le|fan|te", withArticle: "un elefante", emoji: "🐘" },
      { word: "tor|tu|ga", withArticle: "una tortuga", emoji: "🐢" },
    ],
    words: [
      { word: "sol", withArticle: "un sol", emoji: "☀️" },
      { word: "ca|sa", withArticle: "una casa", emoji: "🏠" },
      { word: "pe|lo|ta", withArticle: "una pelota", emoji: "⚽" },
      { word: "ma|ri|po|sa", withArticle: "una mariposa", emoji: "🦋" },
    ],
    tip: "Aplaudan también los nombres de la familia: Ma-rí-a, tres palmadas; Juan, una. Se puede saltar, tocar el tambor o dar pasos en vez de aplaudir. Es uno de los mejores ejercicios para preparar la lectura.",
    faq: [
      {
        question: "¿Para qué sirve contar sílabas?",
        answer: "Ayuda a oír que las palabras se pueden partir en pedazos, que es justo lo que se hace al leer con sílabas. Los niños que juegan a esto en preescolar suelen aprender a leer con más facilidad.",
      },
      {
        question: "¿Y si mi hijo da una palmada de más?",
        answer: "Es normal al principio. Digan la palabra muy despacio, exagerando cada pedazo, y aplaudan juntos. Empiecen con palabras de una y dos sílabas.",
      },
    ],
    related: ["vocales", "silabas-directas"],
  },
  {
    slug: "trabadas-con-l",
    title: "Sílabas trabadas con l",
    metaTitle: "Sílabas trabadas con l: bla, cla, fla, gla, pla, con palabras",
    short: "bl",
    level: "Primero de primaria (6 a 7 años)",
    group: "trabadas",
    summary: "bl, cl, fl, gl, pl: dos consonantes que se dicen juntas, sin vocal entre ellas. Como en globo, flor o plato.",
    intro:
      "En una sílaba trabada, dos consonantes van juntas antes de la vocal y se dicen de un solo golpe. Con la l se forman bla, cla, fla, gla y pla: blusa, clip, flor, globo, plato. Algunos maestros las llaman sinfones o grupos consonánticos.",
    spoken: "bla, cla, fla, gla, pla. glo, bo: globo.",
    tiles: [
      row("bl", "bla ble bli blo blu"),
      row("cl", "cla cle cli clo clu"),
      row("fl", "fla fle fli flo flu"),
      row("gl", "gla gle gli glo glu"),
      row("pl", "pla ple pli plo plu"),
    ],
    words: [
      { word: "[bl]usa", withArticle: "una blusa", emoji: "👚" },
      { word: "[cl]ip", withArticle: "un clip", emoji: "📎" },
      { word: "[fl]or", withArticle: "una flor", emoji: "🌸" },
      { word: "[gl]obo", withArticle: "un globo", emoji: "🎈" },
      { word: "[pl]ato", withArticle: "un plato", emoji: "🍽️" },
      { word: "[fl]auta", withArticle: "una flauta", emoji: "🪈" },
    ],
    hunt: {
      question: "¿En qué palabras hay una sílaba trabada con l?",
      yes: "Sí: en «{mot}» hay dos consonantes juntas.",
      no: "No: en «{mot}» cada consonante va con su vocal.",
      items: [
        { word: "globo", withArticle: "un globo", emoji: "🎈", answer: true },
        { word: "gato", withArticle: "un gato", emoji: "🐱", answer: false },
        { word: "plato", withArticle: "un plato", emoji: "🍽️", answer: true },
        { word: "pato", withArticle: "un pato", emoji: "🦆", answer: false },
        { word: "flor", withArticle: "una flor", emoji: "🌸", answer: true },
        { word: "foca", withArticle: "una foca", emoji: "🦭", answer: false },
      ],
    },
    sentence: "Pablo tiene un globo azul.",
    tip: "El error típico es meter una vocal de más: «guelobo» en vez de «globo». Comparen pares de palabras: pato y plato, gato y globo, foca y flor. Que el niño oiga la diferencia antes de leerla.",
    faq: [
      {
        question: "¿Qué es una sílaba trabada?",
        answer: "Una sílaba con dos consonantes seguidas antes de la vocal, que se pronuncian juntas: pla, bre, tri. La segunda consonante es siempre l o r.",
      },
      {
        question: "¿Cuándo se enseñan?",
        answer: "Cuando el niño ya lee con soltura las sílabas directas, normalmente en primero de primaria. Primero las trabadas con l o con r, según la escuela.",
      },
    ],
    related: ["trabadas-con-r", "silabas-mixtas"],
  },
  {
    slug: "trabadas-con-r",
    title: "Sílabas trabadas con r",
    metaTitle: "Sílabas trabadas con r: bra, cra, dra, fra, gra, pra, tra",
    short: "tr",
    level: "Primero de primaria (6 a 7 años)",
    group: "trabadas",
    summary: "br, cr, dr, fr, gr, pr, tr: la r se dice pegada a la consonante, como en tren, grillo o fruta.",
    intro:
      "Con la r se forman siete grupos: br, cr, dr, fr, gr, pr y tr. La r suena suave y se dice pegada a la consonante, sin vocal en medio: tren, no «teren». Están en muchísimas palabras: brazo, fruta, grillo, príncipe, cocodrilo.",
    spoken: "bra, cra, dra, fra, gra, pra, tra. tren.",
    tiles: [
      row("br", "bra bre bri bro bru"),
      row("cr", "cra cre cri cro cru"),
      row("dr", "dra dre dri dro dru"),
      row("fr", "fra fre fri fro fru"),
      row("gr", "gra gre gri gro gru"),
      row("pr", "pra pre pri pro pru"),
      row("tr", "tra tre tri tro tru"),
    ],
    words: [
      { word: "[br]azo", withArticle: "un brazo", emoji: "💪" },
      { word: "mi[cr]ófono", withArticle: "un micrófono", emoji: "🎤" },
      { word: "coco[dr]ilo", withArticle: "un cocodrilo", emoji: "🐊" },
      { word: "[fr]uta", withArticle: "una fruta", emoji: "🍎" },
      { word: "[gr]illo", withArticle: "un grillo", emoji: "🦗" },
      { word: "[pr]íncipe", withArticle: "un príncipe", emoji: "🤴" },
      { word: "[tr]en", withArticle: "un tren", emoji: "🚂" },
      { word: "[br]uja", withArticle: "una bruja", emoji: "🧙‍♀️" },
    ],
    hunt: {
      question: "¿En qué palabras hay una sílaba trabada con r?",
      yes: "Sí: en «{mot}» la r va pegada a otra consonante.",
      no: "No: en «{mot}» no hay dos consonantes juntas.",
      items: [
        { word: "tren", withArticle: "un tren", emoji: "🚂", answer: true },
        { word: "pato", withArticle: "un pato", emoji: "🦆", answer: false },
        { word: "grillo", withArticle: "un grillo", emoji: "🦗", answer: true },
        { word: "gato", withArticle: "un gato", emoji: "🐱", answer: false },
        { word: "fruta", withArticle: "una fruta", emoji: "🍎", answer: true },
        { word: "foca", withArticle: "una foca", emoji: "🦭", answer: false },
      ],
    },
    sentence: "Tres tristes tigres tragaban trigo en un trigal.",
    tip: "Los trabalenguas son perfectos para estas sílabas: «Tres tristes tigres» para la tr, «Pablito clavó un clavito» para la bl y la cl. Díganlos despacio primero y cada vez más rápido.",
    faq: [
      {
        question: "Mi hijo dice «teren» en vez de «tren». ¿Qué hago?",
        answer: "Es muy común. Que diga primero solo la r suave, «ra», y luego la pegue a la t: «t-ra», «tra». También ayuda decir la palabra muy rápido: la vocal de más desaparece sola.",
      },
      {
        question: "¿La r de «tren» es fuerte o suave?",
        answer: "Suave, como en pera. Después de otra consonante en la misma sílaba, la r siempre suena suave.",
      },
    ],
    related: ["trabadas-con-l", "r-y-rr"],
  },
  {
    slug: "ch",
    title: "La ch",
    metaTitle: "La ch: cha, che, chi, cho, chu, con palabras para leer",
    short: "ch",
    level: "Primero de primaria (5 a 7 años)",
    group: "especiales",
    summary: "La c y la h juntas hacen un solo sonido, como en chocolate, leche y cuchara.",
    intro:
      "Cuando la c y la h van juntas, ya no suenan cada una por su lado: hacen un sonido nuevo, el de chocolate. La ch es un dígrafo, dos letras que hacen un solo sonido. Hasta 2010 se contaba como una letra del abecedario.",
    spoken: "cha, che, chi, cho, chu. Como en chocolate, leche.",
    tiles: [row("Con la ch", "cha che chi cho chu")],
    words: [
      { word: "[ch]ocolate", withArticle: "un chocolate", emoji: "🍫" },
      { word: "le[ch]e", withArticle: "una leche", emoji: "🥛" },
      { word: "cu[ch]ara", withArticle: "una cuchara", emoji: "🥄" },
      { word: "mo[ch]ila", withArticle: "una mochila", emoji: "🎒" },
      { word: "o[ch]o", withArticle: "un ocho", emoji: "8️⃣" },
      { word: "no[ch]e", withArticle: "una noche", emoji: "🌃" },
    ],
    hunt: {
      question: "¿En qué palabras suena la ch?",
      yes: "Sí: en «{mot}» suena ch.",
      no: "No: en «{mot}» no hay ch.",
      items: [
        { word: "leche", withArticle: "una leche", emoji: "🥛", answer: true },
        { word: "luna", withArticle: "una luna", emoji: "🌙", answer: false },
        { word: "ocho", withArticle: "un ocho", emoji: "8️⃣", answer: true },
        { word: "oso", withArticle: "un oso", emoji: "🐻", answer: false },
        { word: "cuchara", withArticle: "una cuchara", emoji: "🥄", answer: true },
        { word: "casa", withArticle: "una casa", emoji: "🏠", answer: false },
      ],
    },
    sentence: "Chema toma leche con chocolate.",
    tip: "Hagan el sonido de un tren que arranca, «ch, ch, ch», o de alguien que pide silencio. Muestra que la c y la h, cuando van de la mano, cambian de voz.",
    faq: [
      {
        question: "¿La ch es una letra?",
        answer: "Ya no. Desde la Ortografía de 2010 de la RAE, la ch es un dígrafo: dos letras que representan un solo sonido. El abecedario tiene 27 letras. En los diccionarios, las palabras con ch se ordenan dentro de la c.",
      },
      {
        question: "Si la h no suena, ¿por qué la ch sí suena?",
        answer: "Porque en la ch la h no va sola: junto con la c forma un sonido propio. Fuera de la ch, la h sigue siendo muda: helado, búho.",
      },
    ],
    related: ["h-muda", "ll-y-y"],
  },
  {
    slug: "ll-y-y",
    title: "La ll y la y",
    metaTitle: "La ll y la y: lla, lle, lli, llo, llu y ya, ye, yi, yo, yu",
    short: "ll",
    level: "Primero de primaria (5 a 7 años)",
    group: "especiales",
    summary: "En casi todos los países, la ll y la y suenan igual: llave y yoyó empiezan con el mismo sonido.",
    intro:
      "La ll es un dígrafo: dos eles que juntas hacen un solo sonido, como en llave y lluvia. En casi todo el mundo hispanohablante suena igual que la y de yoyó: es el yeísmo. Por eso, para escribir bien hay que aprender qué letra lleva cada palabra.",
    spoken: "lla, lle, lli, llo, llu. ya, ye, yi, yo, yu. llave. yoyó.",
    tiles: [row("Con la ll", "lla lle lli llo llu"), row("Con la y", "ya ye yi yo yu")],
    words: [
      { word: "[ll]ave", withArticle: "una llave", emoji: "🔑" },
      { word: "[ll]uvia", withArticle: "una lluvia", emoji: "🌧️" },
      { word: "estre[ll]a", withArticle: "una estrella", emoji: "⭐" },
      { word: "po[ll]ito", withArticle: "un pollito", emoji: "🐥" },
      { word: "[y]oyó", withArticle: "un yoyó", emoji: "🪀" },
      { word: "pla[y]a", withArticle: "una playa", emoji: "🏖️" },
    ],
    sentence: "La lluvia cae en la playa.",
    tip: "El sonido cambia un poco según el país: en Argentina y Uruguay se parece a «sh». Todas las formas son correctas. Lo que cuesta es la ortografía: llave con ll, yate con y. Lean mucho y jueguen a adivinar cuál lleva cada palabra.",
    faq: [
      {
        question: "¿Cómo saber si se escribe con ll o con y?",
        answer: "De oído no se puede, porque suenan igual. Se aprende viendo las palabras escritas muchas veces. Una pista: las palabras que terminan en -illo o -illa llevan ll (pollito, ardilla).",
      },
      {
        question: "¿La ll es una letra?",
        answer: "No: desde 2010 es un dígrafo, dos letras que hacen un solo sonido. El abecedario tiene 27 letras.",
      },
    ],
    related: ["ch", "silabas-directas"],
  },
  {
    slug: "r-y-rr",
    title: "La r suave, la r fuerte y la rr",
    metaTitle: "La r y la rr: r suave (pera), r fuerte (ratón, perro)",
    short: "rr",
    level: "Primero de primaria (5 a 7 años)",
    group: "especiales",
    summary: "La r suena fuerte al principio (ratón) y suave entre vocales (pera). Para el sonido fuerte entre vocales se escribe rr: perro.",
    intro:
      "La r tiene dos sonidos. Al principio de una palabra suena fuerte, vibrando: ratón, rosa. Entre dos vocales suena suave: pera, loro. Y si entre dos vocales tiene que sonar fuerte, se escriben dos: perro, zorro. Pero y perro no significan lo mismo.",
    spoken: "ra, re, ri, ro, ru. ratón. pera. perro.",
    tiles: [
      { title: "r suave (entre vocales)", items: "ra re ri ro ru".split(" ").map((label) => ({ label, spoken: `a${label}`, note: "suave" })) },
      { title: "rr fuerte", items: "rra rre rri rro rru".split(" ").map((label) => ({ label, spoken: `a${label}`, note: "fuerte" })) },
    ],
    words: [
      { word: "[r]atón", withArticle: "un ratón", emoji: "🐭" },
      { word: "[r]osa", withArticle: "una rosa", emoji: "🌹" },
      { word: "pe[r]a", withArticle: "una pera", emoji: "🍐" },
      { word: "lo[r]o", withArticle: "un loro", emoji: "🦜" },
      { word: "pe[rr]o", withArticle: "un perro", emoji: "🐶" },
      { word: "zo[rr]o", withArticle: "un zorro", emoji: "🦊" },
    ],
    hunt: {
      question: "¿En qué palabras suena la r fuerte?",
      yes: "Sí: en «{mot}» la r suena fuerte.",
      no: "No: en «{mot}» la r suena suave.",
      items: [
        { word: "ratón", withArticle: "un ratón", emoji: "🐭", answer: true },
        { word: "pera", withArticle: "una pera", emoji: "🍐", answer: false },
        { word: "perro", withArticle: "un perro", emoji: "🐶", answer: true },
        { word: "loro", withArticle: "un loro", emoji: "🦜", answer: false },
        { word: "zorro", withArticle: "un zorro", emoji: "🦊", answer: true },
        { word: "mariposa", withArticle: "una mariposa", emoji: "🦋", answer: false },
      ],
    },
    sentence: "El perro de Rosa corre rápido.",
    tip: "Muchos niños dicen bien la r fuerte recién hacia los 5 o 6 años, y está bien. No lo corrijas a cada rato: jueguen a imitar el motor de una moto, «rrrrr», y el sonido llegará.",
    faq: [
      {
        question: "¿Cuándo se escribe rr?",
        answer: "Solo entre dos vocales, cuando la r suena fuerte: perro, torre, zorro. Al principio de una palabra la r ya suena fuerte con una sola: ratón, rosa. Después de n, l o s también: Enrique, alrededor, Israel.",
      },
      {
        question: "¿Es normal que mi hijo diga «pelo» en vez de «perro»?",
        answer: "Sí, hasta los 5 o 6 años la r es uno de los últimos sonidos en salir. Si después de los 6 años sigue sin decirla, conviene consultar con un especialista en lenguaje.",
      },
    ],
    related: ["trabadas-con-r", "silabas-directas"],
  },
  {
    slug: "ca-co-cu-que-qui",
    title: "La c fuerte: ca, co, cu, que, qui",
    metaTitle: "La c fuerte: ca, co, cu y que, qui (la u que no suena)",
    short: "ca",
    level: "Primero de primaria (5 a 7 años)",
    group: "especiales",
    summary: "El sonido de casa se escribe ca, co, cu con c, y que, qui con qu, donde la u no suena.",
    intro:
      "El sonido fuerte de casa y conejo se escribe con c antes de a, o, u: ca, co, cu. Antes de e y de i se escribe que, qui, y la u no suena: queso se lee «keso». En unas pocas palabras de otros idiomas se usa la k: koala, kilo.",
    spoken: "ca, co, cu. que, qui. casa. queso.",
    tiles: [
      row("Con la c", "ca co cu"),
      row("Con qu (la u no suena)", "que qui"),
    ],
    rules: [
      "ca, co, cu se escriben con c: casa, cola, cuchara.",
      "que, qui se escriben con qu, y la u no se pronuncia: queso, mosquito.",
      "La k se usa en pocas palabras de otros idiomas: koala, kilo, kiwi.",
    ],
    words: [
      { word: "[c]asa", withArticle: "una casa", emoji: "🏠" },
      { word: "[c]onejo", withArticle: "un conejo", emoji: "🐰" },
      { word: "[c]uchara", withArticle: "una cuchara", emoji: "🥄" },
      { word: "[qu]eso", withArticle: "un queso", emoji: "🧀" },
      { word: "mos[qu]ito", withArticle: "un mosquito", emoji: "🦟" },
      { word: "[k]oala", withArticle: "un koala", emoji: "🐨" },
    ],
    sentence: "Quique come queso en casa.",
    tip: "Cuenten la historia de la q y la u, que siempre van juntas pero la u se queda calladita. Y comparen: cama y queso empiezan con el mismo sonido, aunque se escriban distinto.",
    faq: [
      {
        question: "¿Por qué no se escribe «keso» o «ceso»?",
        answer: "Porque la c antes de e y de i suena suave, como s (cena, cine). Para mantener el sonido fuerte se usa qu: queso, quince. La k queda para palabras que vienen de otros idiomas.",
      },
      {
        question: "¿Hay palabras con «qua» o «quo»?",
        answer: "En español no: con a, o, u se usa la c (casa, cosa, cuna). Solo aparecen en expresiones latinas, como «statu quo».",
      },
    ],
    related: ["ce-ci-y-z", "ga-go-gu-gue-gui"],
  },
  {
    slug: "ce-ci-y-z",
    title: "La c suave, la s y la z",
    metaTitle: "Ce, ci, za, zo, zu y la s: el mismo sonido en Latinoamérica",
    short: "ce",
    level: "Primero de primaria (6 a 7 años)",
    group: "especiales",
    summary: "En Latinoamérica, ce, ci, za, zo, zu y la s suenan igual: cereza, zapato y sapo empiezan con el mismo sonido.",
    intro:
      "Antes de e y de i, la c suena suave, como una s: cereza, cine. La z hace el mismo sonido con a, o, u: zapato, zorro. En Latinoamérica, en Canarias y en parte de Andalucía, la s, la z y la c de ce, ci suenan igual (seseo). En gran parte de España, la z y la c de ce, ci se dicen con la lengua entre los dientes.",
    spoken: "ce, ci. za, zo, zu. sa, se, si, so, su. cereza. zapato. sapo.",
    tiles: [
      row("Con la c", "ce ci", "como s"),
      row("Con la z", "za zo zu"),
      row("Con la s", "sa se si so su"),
    ],
    rules: [
      "La c suena suave solo antes de e, i: cena, cine.",
      "La z va casi siempre con a, o, u: zapato, zorro, zumbido.",
      "Por eso lápiz se vuelve lápices, y pez se vuelve peces.",
    ],
    words: [
      { word: "[c]ereza", withArticle: "una cereza", emoji: "🍒" },
      { word: "[c]ebra", withArticle: "una cebra", emoji: "🦓" },
      { word: "[c]ine", withArticle: "un cine", emoji: "🎬" },
      { word: "[z]apato", withArticle: "un zapato", emoji: "👞" },
      { word: "[z]orro", withArticle: "un zorro", emoji: "🦊" },
      { word: "[s]apo", withArticle: "un sapo", emoji: "🐸" },
    ],
    sentence: "Cecilia y su cebra van al cine.",
    tip: "Como suenan igual, a los niños les cuesta saber si va c, s o z. No hay prisa: primero que lean bien, la ortografía se afina leyendo. Una pista útil: la z casi nunca va antes de e o i.",
    faq: [
      {
        question: "¿Está mal pronunciar igual la s, la z y la c?",
        answer: "No. El seseo es la pronunciación normal en Latinoamérica, en Canarias y en partes de Andalucía, y es tan correcta como la distinción de gran parte de España.",
      },
      {
        question: "¿Por qué la z no va con e ni con i?",
        answer: "Porque para ese sonido el español usa la c: cena, cine. Hay unas pocas excepciones, como zigzag o zeta.",
      },
    ],
    related: ["ca-co-cu-que-qui", "silabas-directas"],
  },
  {
    slug: "ga-go-gu-gue-gui",
    title: "La g suave: ga, go, gu, gue, gui",
    metaTitle: "La g suave: ga, go, gu y gue, gui (la u que no suena)",
    short: "ga",
    level: "Primero de primaria (6 a 7 años)",
    group: "especiales",
    summary: "El sonido de gato se escribe ga, go, gu, y gue, gui antes de e, i: guitarra, hamburguesa. La u no suena.",
    intro:
      "La g suena suave, como en gato, antes de a, o, u: ga, go, gu. Para que suene igual antes de e y de i se agrega una u que no se pronuncia: gue, gui, como en guitarra y hamburguesa.",
    spoken: "ga, go, gu. gue, gui. gato. guitarra.",
    tiles: [row("Con la g", "ga go gu"), row("Con gu (la u no suena)", "gue gui")],
    words: [
      { word: "[g]ato", withArticle: "un gato", emoji: "🐱" },
      { word: "[g]orila", withArticle: "un gorila", emoji: "🦍" },
      { word: "[g]usano", withArticle: "un gusano", emoji: "🐛" },
      { word: "[gu]itarra", withArticle: "una guitarra", emoji: "🎸" },
      { word: "hambur[gu]esa", withArticle: "una hamburguesa", emoji: "🍔" },
      { word: "á[gu]ila", withArticle: "un águila", emoji: "🦅" },
    ],
    hunt: {
      question: "¿En qué palabras suena la g como en gato?",
      yes: "Sí: en «{mot}» la g suena como en gato.",
      no: "No: en «{mot}» suena distinto, como una jota.",
      items: [
        { word: "gato", withArticle: "un gato", emoji: "🐱", answer: true },
        { word: "girasol", withArticle: "un girasol", emoji: "🌻", answer: false },
        { word: "guitarra", withArticle: "una guitarra", emoji: "🎸", answer: true },
        { word: "jirafa", withArticle: "una jirafa", emoji: "🦒", answer: false },
        { word: "gusano", withArticle: "un gusano", emoji: "🐛", answer: true },
        { word: "gema", withArticle: "una gema", emoji: "💎", answer: false },
      ],
    },
    sentence: "Guille toca la guitarra con su gato.",
    tip: "La u callada de gue y gui es la misma idea que en que y qui: está ahí solo para que la consonante suene bien. Si el niño ya conoce queso, la guitarra será fácil.",
    faq: [
      {
        question: "¿Por qué guitarra lleva una u que no se lee?",
        answer: "Porque sin ella se leería «gitarra», con g de girasol. La u le dice a la g que suene como en gato. Si la u tiene que sonar, se le ponen dos puntitos: pingüino.",
      },
      {
        question: "¿Águila lleva tilde?",
        answer: "Sí: á-gui-la. La fuerza va en la primera sílaba, y como es una palabra esdrújula, siempre lleva tilde.",
      },
    ],
    related: ["ge-gi-y-j", "dieresis", "ca-co-cu-que-qui"],
  },
  {
    slug: "ge-gi-y-j",
    title: "La g fuerte y la j: ge, gi, ja, je, ji, jo, ju",
    metaTitle: "Ge, gi y la j: el sonido de girasol y jirafa",
    short: "ge",
    level: "Primero de primaria (6 a 7 años)",
    group: "especiales",
    summary: "Antes de e y de i, la g suena como la j: girasol y jirafa empiezan con el mismo sonido.",
    intro:
      "Antes de e y de i, la g suena fuerte, igual que la j: gente, girasol. La j hace ese sonido con todas las vocales: ja, je, ji, jo, ju. Por eso girasol y jirafa empiezan igual aunque se escriban con letras distintas.",
    spoken: "ge, gi. ja, je, ji, jo, ju. girasol. jirafa.",
    tiles: [row("Con la g", "ge gi", "como j"), row("Con la j", "ja je ji jo ju")],
    words: [
      { word: "[g]irasol", withArticle: "un girasol", emoji: "🌻" },
      { word: "[g]ema", withArticle: "una gema", emoji: "💎" },
      { word: "[j]irafa", withArticle: "una jirafa", emoji: "🦒" },
      { word: "[j]abón", withArticle: "un jabón", emoji: "🧼" },
      { word: "o[j]o", withArticle: "un ojo", emoji: "👁️" },
      { word: "a[j]o", withArticle: "un ajo", emoji: "🧄" },
    ],
    sentence: "La jirafa Gina mira los girasoles.",
    tip: "Junten en una lista las palabras con ge, gi que conozca tu hijo (gente, gigante, girasol, mágico) y otra con je, ji (jefe, jirafa, jinete). Leerlas a menudo ayuda a recordar cuál lleva cada una.",
    faq: [
      {
        question: "¿Cómo saber si va g o j?",
        answer: "Antes de a, o, u siempre j (jamón, joya, jugar), porque ga, go, gu suenan como en gato. Antes de e, i hay que aprender cada palabra: gente, jefe. Las palabras terminadas en -aje, como garaje o viaje, llevan j.",
      },
      {
        question: "¿La j suena igual en todos los países?",
        answer: "En algunos países suena más fuerte, en la garganta; en otros, más suave, casi como una h que sopla. Las dos formas son correctas.",
      },
    ],
    related: ["ga-go-gu-gue-gui", "x"],
  },
  {
    slug: "dieresis",
    title: "La diéresis: güe, güi",
    metaTitle: "La diéresis: güe, güi, como en pingüino",
    short: "gü",
    level: "Segundo de primaria (7 a 8 años)",
    group: "especiales",
    summary: "Los dos puntitos sobre la u (ü) dicen que la u sí suena: pingüino, agüita. Sin ellos, gue y gui no la pronuncian.",
    intro:
      "En gue y gui la u no suena: guitarra. Cuando sí tiene que sonar, se le ponen dos puntitos encima: la diéresis. Así se escribe pingüino, agüita o paragüitas.",
    spoken: "gue, gui. güe, güi. guitarra. pingüino.",
    tiles: [
      { title: "La u no suena", items: [{ label: "gue", note: "guerra" }, { label: "gui", note: "guitarra" }] },
      { title: "La u sí suena", items: [{ label: "güe", spoken: "güe, como en cigüeña", note: "cigüeña" }, { label: "güi", spoken: "güi, como en pingüino", note: "pingüino" }] },
    ],
    words: [
      { word: "pin[gü]ino", withArticle: "un pingüino", emoji: "🐧" },
      { word: "a[gü]ita", withArticle: "una agüita", emoji: "💧" },
      { word: "para[gü]itas", withArticle: "un paragüitas", emoji: "☂️" },
      { word: "[gu]itarra", withArticle: "una guitarra", emoji: "🎸" },
    ],
    hunt: {
      question: "¿En qué palabras suena la u?",
      yes: "Sí: en «{mot}» la u suena, por eso lleva diéresis.",
      no: "No: en «{mot}» la u no suena.",
      items: [
        { word: "pingüino", withArticle: "un pingüino", emoji: "🐧", answer: true },
        { word: "guitarra", withArticle: "una guitarra", emoji: "🎸", answer: false },
        { word: "paragüitas", withArticle: "un paragüitas", emoji: "☂️", answer: true },
        { word: "hamburguesa", withArticle: "una hamburguesa", emoji: "🍔", answer: false },
        { word: "agüita", withArticle: "una agüita", emoji: "💧", answer: true },
        { word: "águila", withArticle: "un águila", emoji: "🦅", answer: false },
      ],
    },
    sentence: "El pingüino toma agüita bajo el paragüitas.",
    tip: "Las palabras con diéresis son pocas. Basta con conocer algunas: pingüino, cigüeña, vergüenza, agüita. Fíjense que agua no lleva diéresis, pero agüita sí: con a no hace falta.",
    faq: [
      {
        question: "¿Por qué agua no lleva diéresis y agüita sí?",
        answer: "Porque la diéresis solo se usa en güe y güi. En gua y guo la u siempre suena: agua, antiguo. Al decir agüita, la u queda antes de una i y necesita los dos puntos para seguir sonando.",
      },
      {
        question: "¿La ü es una letra?",
        answer: "No: es una u con diéresis, y la diéresis no cambia el abecedario. Las letras siguen siendo 27.",
      },
    ],
    related: ["ga-go-gu-gue-gui", "silabas-directas"],
  },
  {
    slug: "h-muda",
    title: "La h muda",
    metaTitle: "La h muda: palabras con h que no suena (helado, huevo, búho)",
    short: "h",
    level: "Primero de primaria (5 a 7 años)",
    group: "especiales",
    summary: "La h no suena: helado se lee «elado». Se escribe por la historia de las palabras y se aprende viéndolas.",
    intro:
      "La h es la letra muda del español: se escribe pero no se pronuncia. Helado se lee «elado», búho se lee «búo». Solo junto a la c tiene sonido, en la ch. Como no se oye, las palabras con h se aprenden viéndolas escritas.",
    spoken: "helado. huevo. hormiga. búho.",
    marks: "silent",
    words: [
      { word: "[h]elado", withArticle: "un helado", emoji: "🍦" },
      { word: "[h]uevo", withArticle: "un huevo", emoji: "🥚" },
      { word: "[h]ormiga", withArticle: "una hormiga", emoji: "🐜" },
      { word: "[h]ada", withArticle: "un hada", emoji: "🧚" },
      { word: "bú[h]o", withArticle: "un búho", emoji: "🦉" },
      { word: "zana[h]oria", withArticle: "una zanahoria", emoji: "🥕" },
    ],
    rules: [
      "La h no suena: hada se lee «ada».",
      "Las palabras que empiezan con hue- y hie- llevan h: huevo, hueso, hielo.",
      "Junto a la c, la h forma la ch, que sí suena: chocolate.",
    ],
    sentence: "La hormiga y el búho comen helado.",
    tip: "Busquen palabras con h en el súper o en los cuentos: helado, harina, huevo, hoja. Pinten la h de gris en las palabras para recordar que «está callada».",
    faq: [
      {
        question: "¿Por qué se escribe la h si no suena?",
        answer: "Por la historia de las palabras: muchas venían del latín con h (hora, hombre) o con f (de «facere» viene hacer). La pronunciación cambió, pero la escritura la conservó.",
      },
      {
        question: "¿Por qué decimos «un hada» y no «una hada»?",
        answer: "Porque hada empieza con el sonido a con fuerza (la h no suena), como agua o águila. Delante de esas palabras femeninas se usa «un» y «el»: un hada, el agua. Pero se dice «las hadas».",
      },
    ],
    related: ["ch", "silabas-directas"],
  },
  {
    slug: "b-y-v",
    title: "La b y la v",
    metaTitle: "La b y la v: suenan igual (barco, vaca) y cómo distinguirlas",
    short: "b v",
    level: "Primero de primaria (6 a 7 años)",
    group: "especiales",
    summary: "En español la b y la v suenan exactamente igual. Barco y vaca empiezan con el mismo sonido; la diferencia solo se ve al escribir.",
    intro:
      "La b y la v se pronuncian igual en todos los países hispanohablantes: barco y vaca empiezan con el mismo sonido. Al leer no hay ningún problema. Al escribir, hay que aprender qué letra lleva cada palabra, con la ayuda de algunas reglas.",
    spoken: "ba, be, bi, bo, bu. va, ve, vi, vo, vu. barco. vaca.",
    tiles: [row("Con la b", "ba be bi bo bu"), row("Con la v", "va ve vi vo vu", "igual")],
    rules: [
      "Antes de l y de r siempre va b: blusa, brazo.",
      "Después de m siempre va b: cambio, tambor. Después de n va v: invierno, enviar.",
    ],
    words: [
      { word: "[b]arco", withArticle: "un barco", emoji: "⛵" },
      { word: "[b]allena", withArticle: "una ballena", emoji: "🐳" },
      { word: "[b]urro", withArticle: "un burro", emoji: "🫏" },
      { word: "[v]aca", withArticle: "una vaca", emoji: "🐄" },
      { word: "[v]olcán", withArticle: "un volcán", emoji: "🌋" },
      { word: "u[v]a", withArticle: "una uva", emoji: "🍇" },
    ],
    sentence: "Vale va en barco a ver la ballena.",
    tip: "Cuando tu hijo pregunte «¿con be o con ve?», no hay truco de oído: muéstrale la palabra escrita. Algunas familias usan los nombres «be grande» y «ve chica» para no confundirlas al deletrear.",
    faq: [
      {
        question: "¿Hay que pronunciar la v con los dientes en el labio?",
        answer: "No. Ese sonido no existe en el español de ningún país; la RAE indica que la b y la v se pronuncian igual. Pronunciar la v «como en inglés» es un error frecuente pero innecesario.",
      },
      {
        question: "¿Cómo las llama tu escuela?",
        answer: "Según el país: be y uve (RAE), be larga y ve corta, be grande y ve chica, be alta y ve baja. Todas se refieren a las mismas dos letras.",
      },
    ],
    related: ["trabadas-con-l", "silabas-directas"],
  },
  {
    slug: "enie",
    title: "La ñ",
    metaTitle: "La ñ: ña, ñe, ñi, ño, ñu, con palabras para leer",
    short: "ñ",
    level: "Primero de primaria (5 a 7 años)",
    group: "especiales",
    summary: "La ñ suena como en niño y araña: la lengua se pega al paladar. Cambia una n por una ñ y cambia la palabra: mono y moño.",
    intro:
      "La ñ es una letra propia del español, con su sonido: niño, araña, uña. La lengua se apoya en el paladar. No es una n con adorno: cambia el significado de las palabras. Mono es un animal; moño, un lazo en el pelo.",
    spoken: "ña, ñe, ñi, ño, ñu. niño. araña.",
    tiles: [row("Con la ñ", "ña ñe ñi ño ñu")],
    words: [
      { word: "ni[ñ]o", withArticle: "un niño", emoji: "🧒" },
      { word: "ara[ñ]a", withArticle: "una araña", emoji: "🕷️" },
      { word: "u[ñ]a", withArticle: "una uña", emoji: "💅" },
      { word: "ba[ñ]o", withArticle: "un baño", emoji: "🛁" },
      { word: "sue[ñ]o", withArticle: "un sueño", emoji: "😴" },
      { word: "mo[ñ]o", withArticle: "un moño", emoji: "🎀" },
    ],
    hunt: {
      question: "¿En qué palabras suena la ñ?",
      yes: "Sí: en «{mot}» suena ñ.",
      no: "No: en «{mot}» suena n.",
      items: [
        { word: "araña", withArticle: "una araña", emoji: "🕷️", answer: true },
        { word: "rana", withArticle: "una rana", emoji: "🐸", answer: false },
        { word: "moño", withArticle: "un moño", emoji: "🎀", answer: true },
        { word: "mono", withArticle: "un mono", emoji: "🐒", answer: false },
        { word: "niño", withArticle: "un niño", emoji: "🧒", answer: true },
        { word: "nube", withArticle: "una nube", emoji: "☁️", answer: false },
      ],
    },
    sentence: "La niña ve una araña en el baño.",
    tip: "Jueguen con pares que solo cambian por la ñ: mono y moño, cana y caña, pena y peña. Que el niño diga cuál oye. Es una forma muy divertida de afinar el oído.",
    faq: [
      {
        question: "¿Por qué hay tan pocas palabras que empiecen con ñ?",
        answer: "La ñ nació de la nn del latín escrita en abreviatura, y casi siempre quedó en medio de las palabras (año, viene de annus). Empiezan con ñ solo unas pocas: ñandú, ñu, ñoño.",
      },
      {
        question: "¿Cómo se escribe la ñ en el celular o la computadora?",
        answer: "En el celular, mantén pulsada la n. En un teclado latinoamericano o español tiene su propia tecla. En otros teclados de Windows se puede escribir con Alt + 164.",
      },
    ],
    related: ["silabas-directas", "ll-y-y"],
  },
  {
    slug: "x",
    title: "La x",
    metaTitle: "La x: sus tres sonidos (taxi, xilófono, México)",
    short: "x",
    level: "Segundo de primaria (6 a 8 años)",
    group: "especiales",
    summary: "La x suena ks en taxi, s en xilófono y j en México. Es la letra con más sonidos del español.",
    intro:
      "Casi siempre la x suena «ks»: taxi, examen, boxeo. Al principio de una palabra suena como s: xilófono. Y en algunos nombres, sobre todo de México, conserva un sonido antiguo de jota: México, Oaxaca, Texas.",
    spoken: "taxi. examen. xilófono. México.",
    tiles: [
      {
        title: "Tres sonidos",
        items: [
          { label: "taxi", note: "ks" },
          { label: "xilófono", note: "s" },
          { label: "México", note: "j" },
        ],
      },
    ],
    words: [
      { word: "ta[x]i", withArticle: "un taxi", emoji: "🚕" },
      { word: "e[x]amen", withArticle: "un examen", emoji: "📝" },
      { word: "bo[x]eo", withArticle: "el boxeo", emoji: "🥊" },
      { word: "sa[x]ofón", withArticle: "un saxofón", emoji: "🎷" },
      { word: "[x]ilófono", withArticle: "un xilófono", emoji: "🎵" },
      { word: "Mé[x]ico", withArticle: "México", emoji: "🇲🇽" },
    ],
    sentence: "Ximena toma un taxi en México.",
    tip: "No hace falta enseñar los tres sonidos a la vez. Empiecen con taxi y examen, y dejen México y Oaxaca para cuando hablen de mapas y lugares. Ximena y Xavier pueden leerse con s o con j según la familia.",
    faq: [
      {
        question: "¿Por qué México se escribe con x?",
        answer: "Hace siglos, la x se usaba para un sonido parecido a «sh» que después se convirtió en jota. Algunos nombres conservaron la x. La RAE recomienda escribir México con x.",
      },
      {
        question: "¿Cuántos sonidos tiene la x?",
        answer: "Tres: ks (taxi), s al principio de palabra (xilófono) y j en algunos nombres (México). El más frecuente es ks.",
      },
    ],
    related: ["ge-gi-y-j", "ce-ci-y-z"],
  },
  {
    slug: "palabras-frecuentes",
    title: "Palabras frecuentes",
    metaTitle: "Palabras frecuentes para leer de corrido: el, la, un, y, de, en",
    short: "el",
    level: "Kínder y primero (5 a 7 años)",
    group: "palabras",
    summary: "el, la, un, y, de, en, con, mi: palabras cortas que aparecen en todas las oraciones. Reconocerlas de un vistazo hace leer más rápido.",
    intro:
      "Algunas palabras aparecen en casi todas las oraciones: el, la, los, un, una, y, de, en, con, mi. Se leen igual que las demás, sílaba por sílaba, pero como salen tantas veces, conviene reconocerlas de un vistazo. Así la lectura se vuelve más fluida.",
    spoken: "el. la. los. las. un. una. y. de. en. con. mi. es.",
    tiles: [
      {
        title: "Las más frecuentes",
        items: ["el", "la", "los", "las", "un", "una", "y", "de", "en", "con", "mi", "tu", "es", "no", "sí", "yo", "que", "al"].map((label) => ({
          label,
          ...(label === "y" && { spoken: "y. Ana y Eva." }),
        })),
      },
    ],
    sentence: "Yo veo a mi papá en la casa con el perro.",
    tip: "Escriban las palabras frecuentes en tarjetas y jueguen a encontrarlas en un cuento: ¿cuántas veces aparece «la»? Leer en voz alta juntos, cada noche, es lo que más ayuda a leer de corrido.",
    faq: [
      {
        question: "¿Hay que aprenderlas de memoria?",
        answer: "No del todo: en español se pueden leer con las sílabas, porque se escriben como suenan. Pero como aparecen tanto, verlas muchas veces hace que el niño las reconozca sin descifrarlas, y eso libera atención para entender lo que lee.",
      },
      {
        question: "¿Cuándo un niño lee «de corrido»?",
        answer: "Poco a poco, durante primero y segundo de primaria. Primero lee sílaba por sílaba, después palabra por palabra y al final frases enteras. Leer cada día textos cortos y conocidos es lo que más ayuda.",
      },
    ],
    related: ["silabas-directas", "contar-silabas"],
  },
];

export function getSpanishSyllablePage(slug: string): SpanishSyllablePage | undefined {
  return spanishSyllablePages.find((p) => p.slug === slug);
}

/** Pages in reading order, grouped as on the index page. */
export function orderedSyllablePages(): SpanishSyllablePage[] {
  return SYLLABLE_GROUPS.flatMap((g) => spanishSyllablePages.filter((p) => p.group === g.id));
}

/** Previous and next page, following the index order (no wrap-around). */
export function syllablePageNeighbors(slug: string): { prev?: SpanishSyllablePage; next?: SpanishSyllablePage } {
  const list = orderedSyllablePages();
  const i = list.findIndex((p) => p.slug === slug);
  return { prev: list[i - 1], next: list[i + 1] };
}
