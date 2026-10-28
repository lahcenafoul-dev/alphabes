// French sounds ("les sons", CP level): the pages under /fr/sons. French
// children learn to read by syllables and by the sounds written with two or
// three letters (ou, on, ch…), so these pages don't mirror the English
// phonics skills (lib/phonics-data.ts); every page is French-only.
//
// Word markup, shown on the pages and stripped for speech:
//   "l[ou]p"  highlights the letters that make the page's sound
//             (on the silent-letters page: the silent letters)
//   "vé|lo"   splits a word into syllables (the syllable page)
//
// Speech: browsers can't say an isolated sound reliably ("gn" is read
// "gé enne"), so every spoken text uses real words or simple syllables.
//
// Pure data with no imports, so middleware, pages and tests can all use it.

export type SoundWord = {
  /** With markup: "l[ou]p", "vé|lo". */
  word: string;
  /** With its article, as a child would say it ("un loup"). Read aloud. */
  withArticle: string;
  /** Its picture (components/WordIllustration.tsx). */
  picture: string;
};

export type SoundTile = {
  label: string;
  /** What the speech engine says (defaults to the label). */
  spoken?: string;
  /** Small caption under the tile ("dur", "doux"). */
  note?: string;
};

export type SoundHunt = {
  question: string;
  /** Feedback when the child taps a right card; "{mot}" is the word. */
  yes: string;
  /** Feedback for a card without the sound. */
  no: string;
  items: (SoundWord & { answer: boolean })[];
};

export type SoundGroup = "bases" | "sons" | "pieges" | "mots";

export type FrenchSound = {
  slug: string;
  /** Page heading. */
  title: string;
  /** <title> (the layout adds "| AlphaBes"). */
  metaTitle: string;
  /** What goes in the big block ("ou", "é"…). */
  short: string;
  /** Every spelling covered, for the subtitle ("on · om"). */
  spellings?: string;
  /** Sound in IPA, shown to parents. */
  ipa?: string;
  level: string;
  group: SoundGroup;
  /** Card blurb and meta description. */
  summary: string;
  intro: string;
  /** Read by the "Écouter le son" button. */
  soundSpoken: string;
  /** How [brackets] are shown: the sound (default) or silent letters. */
  marks?: "sound" | "silent";
  words?: SoundWord[];
  rules?: string[];
  tiles?: { title: string; items: SoundTile[] };
  /** Shows the consonant + vowel syllable builder. */
  builder?: boolean;
  hunt?: SoundHunt;
  sentence?: string;
  /** "Bon à savoir" note for parents. */
  tip: string;
  faq: { question: string; answer: string }[];
  /** Sound slugs linked from the page. */
  related: string[];
};

export const SOUND_GROUPS: { id: SoundGroup; title: string; blurb: string }[] = [
  {
    id: "bases",
    title: "Les bases",
    blurb: "Entendre les sons, connaître les voyelles, puis coller une consonne et une voyelle pour lire ses premières syllabes.",
  },
  {
    id: "sons",
    title: "Les sons à plusieurs lettres",
    blurb: "Deux ou trois lettres qui, ensemble, font un seul son. On les découvre un par un au CP.",
  },
  {
    id: "pieges",
    title: "Les pièges de l'écrit",
    blurb: "Les lettres qui changent de son selon leurs voisines, et celles qu'on écrit sans les entendre.",
  },
  {
    id: "mots",
    title: "Lire plus vite",
    blurb: "Les petits mots qui reviennent dans toutes les phrases.",
  },
];

export const frenchSounds: FrenchSound[] = [
  {
    slug: "voyelles",
    title: "Les voyelles",
    metaTitle: "Les voyelles : a, e, i, o, u, y en maternelle",
    short: "a e i",
    spellings: "a · e · i · o · u · y",
    level: "Grande section",
    group: "bases",
    summary: "Les six voyelles de l'alphabet, leur son, et des mots pour bien les entendre.",
    intro:
      "Il y a six voyelles dans l'alphabet : a, e, i, o, u et y. On peut les chanter aussi longtemps qu'on a de souffle, sans fermer les lèvres ni bouger la langue. Toutes les autres lettres sont des consonnes. Chaque syllabe française contient au moins une voyelle : c'est par elles qu'on commence.",
    soundSpoken: "a. e. i. o. u.",
    tiles: {
      title: "Écoute les voyelles",
      items: [
        { label: "a" },
        { label: "e" },
        { label: "i" },
        { label: "o" },
        { label: "u" },
        { label: "y", spoken: "i grec. Il se lit i, comme dans stylo.", note: "se lit i" },
      ],
    },
    words: [
      { word: "[a]nanas", withArticle: "un ananas", picture: "pineapple" },
      { word: "ch[e]val", withArticle: "un cheval", picture: "horse" },
      { word: "[î]le", withArticle: "une île", picture: "island" },
      { word: "[o]range", withArticle: "une orange", picture: "orange" },
      { word: "[u]sine", withArticle: "une usine", picture: "factory" },
      { word: "st[y]lo", withArticle: "un stylo", picture: "pen" },
    ],
    hunt: {
      question: "Quels mots commencent par une voyelle ?",
      yes: "Oui : « {mot} » commence par une voyelle.",
      no: "Non : « {mot} » commence par une consonne.",
      items: [
        { word: "ours", withArticle: "un ours", picture: "bear", answer: true },
        { word: "lune", withArticle: "la lune", picture: "moon", answer: false },
        { word: "éléphant", withArticle: "un éléphant", picture: "elephant", answer: true },
        { word: "poisson", withArticle: "un poisson", picture: "fish", answer: false },
        { word: "arc-en-ciel", withArticle: "un arc-en-ciel", picture: "rainbow", answer: true },
        { word: "tomate", withArticle: "une tomate", picture: "tomato", answer: false },
      ],
    },
    sentence: "Ali a vu une île.",
    tip: "Commencez par faire chanter les voyelles : aaaa, iiii, oooo. Le u surprend souvent les enfants qui entendent une autre langue à la maison : on dit « i » en arrondissant les lèvres. Pour le y, dites simplement qu'il se lit comme un i dans les mots comme stylo.",
    faq: [
      {
        question: "Combien y a-t-il de voyelles en français ?",
        answer:
          "Six : a, e, i, o, u et y. Les voyelles avec un accent (é, è, ê, à…) restent des voyelles : l'accent change seulement leur son ou le sens du mot.",
      },
      {
        question: "Pourquoi apprendre les voyelles en premier ?",
        answer:
          "Parce que chaque syllabe contient une voyelle. Un enfant qui connaît bien le son des voyelles peut ensuite lire ses premières syllabes : m et a, ma.",
      },
    ],
    related: ["premier-son", "syllabes"],
  },
  {
    slug: "premier-son",
    title: "Le premier son d'un mot",
    metaTitle: "Le premier son d'un mot : exercice d'écoute en maternelle",
    short: "m…",
    level: "Grande section",
    group: "bases",
    summary: "Écouter un mot et trouver le son qu'on entend au début : le premier pas vers la lecture.",
    intro:
      "Avant de lire, l'enfant apprend à écouter les mots. Le premier exercice : trouver le son qu'on entend au début d'un mot. Dans moto, on entend [m] ; dans soleil, [s]. On travaille à l'oral, avec des images, avant même de montrer les lettres.",
    soundSpoken: "moto. maison. mouton. Ces trois mots commencent pareil.",
    words: [
      { word: "[m]oto", withArticle: "une moto", picture: "motorbike" },
      { word: "[s]oleil", withArticle: "le soleil", picture: "sun" },
      { word: "[l]une", withArticle: "la lune", picture: "moon" },
      { word: "[p]omme", withArticle: "une pomme", picture: "apple" },
      { word: "[r]obot", withArticle: "un robot", picture: "robot" },
      { word: "[v]ache", withArticle: "une vache", picture: "cow" },
    ],
    hunt: {
      question: "Quels mots commencent par le son [m], comme moto ?",
      yes: "Oui : « {mot} » commence par [m].",
      no: "Non : « {mot} » ne commence pas par [m].",
      items: [
        { word: "maison", withArticle: "une maison", picture: "house", answer: true },
        { word: "tomate", withArticle: "une tomate", picture: "tomato", answer: false },
        { word: "mouton", withArticle: "un mouton", picture: "sheep", answer: true },
        { word: "lune", withArticle: "la lune", picture: "moon", answer: false },
        { word: "main", withArticle: "une main", picture: "hand", answer: true },
        { word: "sapin", withArticle: "un sapin", picture: "fir-tree", answer: false },
      ],
    },
    tip: "Allongez le premier son quand vous dites le mot : « mmmoto », « sssoleil ». Pour les sons qu'on ne peut pas allonger, comme [p] ou [t], répétez-les : « p-p-pomme ». Le jeu « Dans mon sac, je mets un objet qui commence par… » marche très bien en voiture.",
    faq: [
      {
        question: "Faut-il dire le nom de la lettre ou son son ?",
        answer:
          "Le son. On dit « mmm » et pas « emme » : c'est le son qui aide à lire. Le nom des lettres s'apprend à part, avec l'alphabet.",
      },
      {
        question: "À quel âge faire cet exercice ?",
        answer:
          "En moyenne et en grande section (4 à 6 ans). C'est un exercice d'écoute : il n'y a pas besoin de savoir lire, ni même de connaître les lettres.",
      },
    ],
    related: ["voyelles", "syllabes"],
  },
  {
    slug: "syllabes",
    title: "La syllabe",
    metaTitle: "La syllabe : lire ses premières syllabes (ma, li, to)",
    short: "ma",
    level: "Grande section et CP",
    group: "bases",
    summary: "Une consonne et une voyelle se collent pour faire une syllabe : m et a font « ma ». C'est le cœur de la lecture en français.",
    intro:
      "En français, on apprend à lire par syllabes. Une consonne et une voyelle se collent pour faire une syllabe : m et a font « ma », l et i font « li ». Avec quelques syllabes, on lit déjà de vrais mots : mo-to, vé-lo, to-ma-te.",
    soundSpoken: "ma. li. to. mo, to : moto.",
    builder: true,
    words: [
      { word: "mo|to", withArticle: "une moto", picture: "motorbike" },
      { word: "vé|lo", withArticle: "un vélo", picture: "bicycle" },
      { word: "lu|ne", withArticle: "la lune", picture: "moon" },
      { word: "to|ma|te", withArticle: "une tomate", picture: "tomato" },
      { word: "ba|na|ne", withArticle: "une banane", picture: "banana" },
      { word: "pi|ra|te", withArticle: "un pirate", picture: "pirate-flag" },
    ],
    sentence: "Rémi a vu la lune.",
    tip: "Tapez les syllabes dans les mains : to-ma-te, trois syllabes, trois tapes. Pour coller une consonne et une voyelle, faites durer la consonne et glissez vers la voyelle : « mmmma ». Les consonnes qu'on peut allonger (m, l, r, s, f, v, n) sont les plus faciles pour commencer ; gardez p, t et d pour après.",
    faq: [
      {
        question: "Qu'est-ce que la méthode syllabique ?",
        answer:
          "C'est apprendre à lire en assemblant les sons : d'abord les lettres et leur son, puis les syllabes (ma, li, to), puis les mots. C'est l'approche que les programmes du CP en France mettent au centre de l'apprentissage de la lecture.",
      },
      {
        question: "Mon enfant lit les syllabes, mais pas le mot entier. Est-ce normal ?",
        answer:
          "Oui, au début. Lire « mo » puis « to » sans entendre « moto » est une étape normale. Faites-lui relire un peu plus vite à chaque fois : le mot finit par sortir tout seul.",
      },
    ],
    related: ["voyelles", "premier-son", "ou"],
  },
  {
    slug: "ou",
    title: "Le son ou",
    metaTitle: "Le son ou [u] : mots, phrase et exercice (CP)",
    short: "ou",
    ipa: "[u]",
    level: "CP",
    group: "sons",
    summary: "o et u ensemble font [u], comme dans loup et poule. Souvent le premier son à deux lettres du CP.",
    intro:
      "Quand le o et le u sont côte à côte, ils ne font plus chacun leur son : ensemble, ils font un seul son, [u], comme dans loup. C'est souvent le premier son à deux lettres qu'on apprend au CP.",
    soundSpoken: "ou. Comme dans loup, poule, hibou.",
    words: [
      { word: "l[ou]p", withArticle: "un loup", picture: "wolf" },
      { word: "p[ou]le", withArticle: "une poule", picture: "hen" },
      { word: "hib[ou]", withArticle: "un hibou", picture: "owl" },
      { word: "[ou]rs", withArticle: "un ours", picture: "bear" },
      { word: "b[ou]gie", withArticle: "une bougie", picture: "candle" },
      { word: "s[ou]ris", withArticle: "une souris", picture: "mouse" },
    ],
    hunt: {
      question: "Dans quels mots entends-tu [u], comme dans loup ?",
      yes: "Oui : on entend [u] dans « {mot} ».",
      no: "Non : pas de [u] dans « {mot} ».",
      items: [
        { word: "mouton", withArticle: "un mouton", picture: "sheep", answer: true },
        { word: "lune", withArticle: "la lune", picture: "moon", answer: false },
        { word: "citrouille", withArticle: "une citrouille", picture: "pumpkin", answer: true },
        { word: "vélo", withArticle: "un vélo", picture: "bicycle", answer: false },
        { word: "douche", withArticle: "une douche", picture: "shower", answer: true },
        { word: "tortue", withArticle: "une tortue", picture: "turtle", answer: false },
      ],
    },
    sentence: "Le hibou et le loup jouent dans la boue.",
    tip: "Le piège, c'est le u tout seul : lune et loup n'ont pas le même son. Faites comparer les deux à voix haute. Pour u (lune), on dit « i » avec les lèvres en rond ; pour ou (loup), la bouche fait un petit bisou.",
    faq: [
      {
        question: "Pourquoi ou s'écrit-il avec deux lettres ?",
        answer:
          "Le français a plus de sons que de lettres. Pour écrire certains sons, on associe deux lettres : o et u font [u]. Il y en a d'autres, comme on, an, oi ou ch.",
      },
      {
        question: "Comment écrire le son [u] ?",
        answer:
          "Presque toujours avec ou : loup, poule, genou. Avec un accent, où est le mot de la question « Où es-tu ? ».",
      },
    ],
    related: ["on", "oi", "syllabes"],
  },
  {
    slug: "on",
    title: "Le son on",
    metaTitle: "Le son on (on, om) : mots, règle et exercice (CP)",
    short: "on",
    spellings: "on · om",
    ipa: "[ɔ̃]",
    level: "CP",
    group: "sons",
    summary: "Le son de ballon et de pont, qui s'écrit on, ou om devant b et p.",
    intro:
      "Le o suivi d'un n fait le son [ɔ̃], qu'on entend dans ballon et dans pont. Devant un b ou un p, le n devient un m : on écrit pompier et concombre.",
    soundSpoken: "on. Comme dans ballon, pont, bonbon.",
    rules: [
      "Devant b et p, le n devient m : pompier, concombre, ombre.",
      "Si le n ou le m est suivi d'une voyelle, ou doublé, on n'entend plus [ɔ̃] : to-ma-te, pom-me.",
    ],
    words: [
      { word: "ball[on]", withArticle: "un ballon", picture: "balloon" },
      { word: "p[on]t", withArticle: "un pont", picture: "bridge" },
      { word: "b[on]b[on]", withArticle: "un bonbon", picture: "candy" },
      { word: "mout[on]", withArticle: "un mouton", picture: "sheep" },
      { word: "p[om]pier", withArticle: "un pompier", picture: "firefighter" },
      { word: "c[on]c[om]bre", withArticle: "un concombre", picture: "cucumber" },
    ],
    hunt: {
      question: "Dans quels mots entends-tu [ɔ̃], comme dans ballon ?",
      yes: "Oui : on entend [ɔ̃] dans « {mot} ».",
      no: "Non : pas de [ɔ̃] dans « {mot} ».",
      items: [
        { word: "melon", withArticle: "un melon", picture: "melon", answer: true },
        { word: "tomate", withArticle: "une tomate", picture: "tomato", answer: false },
        { word: "cochon", withArticle: "un cochon", picture: "pig", answer: true },
        { word: "pomme", withArticle: "une pomme", picture: "apple", answer: false },
        { word: "citron", withArticle: "un citron", picture: "lemon", answer: true },
        { word: "robot", withArticle: "un robot", picture: "robot", answer: false },
      ],
    },
    sentence: "Le cochon rond joue avec un ballon.",
    tip: "Faites sentir que le son passe par le nez : en se bouchant le nez, [ɔ̃] devient tout drôle. C'est pareil pour les deux autres sons « du nez » : an et in.",
    faq: [
      {
        question: "Pourquoi écrit-on pompier avec un m ?",
        answer:
          "C'est la règle du m devant m, b et p : devant ces trois lettres, on écrit m au lieu de n. Elle vaut aussi pour an (jambe) et pour in (timbre).",
      },
      {
        question: "Pourquoi n'entend-on pas [ɔ̃] dans tomate ?",
        answer:
          "Parce que le m est suivi d'une voyelle : on lit to-ma-te. Le o ne fait [ɔ̃] que si le n ou le m ferme la syllabe, comme dans pont ou pompier.",
      },
    ],
    related: ["an", "in", "ou"],
  },
  {
    slug: "an",
    title: "Le son an",
    metaTitle: "Le son an (an, en, am, em) : mots, règle et exercice (CP)",
    short: "an",
    spellings: "an · en · am · em",
    ipa: "[ɑ̃]",
    level: "CP",
    group: "sons",
    summary: "Le son de maman et de dent, qui s'écrit de quatre façons : an, en, am, em.",
    intro:
      "Le son [ɑ̃], celui de maman, s'écrit de quatre façons : an, en, am et em. Les plus courantes sont an (éléphant) et en (dent). On écrit am et em devant b et p, comme dans lampe ou tempête.",
    soundSpoken: "an. Comme dans maman, dent, éléphant.",
    rules: [
      "Devant b et p, on écrit am ou em : jambe, lampe, tempête.",
      "an ou en ? À l'oral, c'est le même son. L'orthographe se retient mot par mot, en lisant.",
    ],
    words: [
      { word: "éléph[an]t", withArticle: "un éléphant", picture: "elephant" },
      { word: "ser[pen]t", withArticle: "un serpent", picture: "snake" },
      { word: "d[en]t", withArticle: "une dent", picture: "tooth" },
      { word: "[an]ge", withArticle: "un ange", picture: "angel" },
      { word: "[am]poule", withArticle: "une ampoule", picture: "light-bulb" },
      { word: "t[en]te", withArticle: "une tente", picture: "tent" },
    ],
    hunt: {
      question: "Dans quels mots entends-tu [ɑ̃], comme dans maman ?",
      yes: "Oui : on entend [ɑ̃] dans « {mot} ».",
      no: "Non : pas de [ɑ̃] dans « {mot} ».",
      items: [
        { word: "kangourou", withArticle: "un kangourou", picture: "kangaroo", answer: true },
        { word: "banane", withArticle: "une banane", picture: "banana", answer: false },
        { word: "pantalon", withArticle: "un pantalon", picture: "trousers", answer: true },
        { word: "canard", withArticle: "un canard", picture: "duck", answer: false },
        { word: "orange", withArticle: "une orange", picture: "orange", answer: true },
        { word: "lune", withArticle: "la lune", picture: "moon", answer: false },
      ],
    },
    sentence: "Maman chante devant la tente.",
    tip: "Même piège que pour on : dans banane ou canard, le a et le n appartiennent à deux syllabes différentes (ba-na-ne, ca-nard), donc on n'entend pas [ɑ̃]. Faites découper le mot en syllabes pour vérifier.",
    faq: [
      {
        question: "an ou en : comment choisir ?",
        answer:
          "On entend le même son, donc il faut mémoriser l'orthographe des mots au fil des lectures. Les familles de mots aident : dent, dentiste, dentifrice.",
      },
      {
        question: "Pourquoi le son de « chien » s'écrit-il en ?",
        answer:
          "Après un i, en se lit souvent comme in : chien, bien, rien. Ces petits mots fréquents se découvrent avec le son in.",
      },
    ],
    related: ["on", "in"],
  },
  {
    slug: "in",
    title: "Le son in",
    metaTitle: "Le son in (in, im, ain, ein) : mots, règle et exercice (CP)",
    short: "in",
    spellings: "in · im · ain · ein",
    ipa: "[ɛ̃]",
    level: "CP",
    group: "sons",
    summary: "Le son de lapin, de main et de pain, qui s'écrit in, im, ain ou ein.",
    intro:
      "Le son [ɛ̃] de lapin s'écrit le plus souvent in. On le trouve aussi sous la forme ain (main, pain), ein (peinture), et im devant b ou p (timbre).",
    soundSpoken: "Comme dans lapin, sapin, main, pain.",
    rules: [
      "Devant b et p, on écrit im : timbre, imperméable.",
      "ain et ein se lisent comme in : on les retient mot par mot.",
    ],
    words: [
      { word: "lap[in]", withArticle: "un lapin", picture: "rabbit" },
      { word: "sap[in]", withArticle: "un sapin", picture: "fir-tree" },
      { word: "m[ain]", withArticle: "une main", picture: "hand" },
      { word: "p[ain]", withArticle: "du pain", picture: "bread" },
      { word: "dauph[in]", withArticle: "un dauphin", picture: "dolphin" },
      { word: "p[ein]ture", withArticle: "de la peinture", picture: "paint-palette" },
    ],
    hunt: {
      question: "Dans quels mots entends-tu [ɛ̃], comme dans lapin ?",
      yes: "Oui : on entend [ɛ̃] dans « {mot} ».",
      no: "Non : pas de [ɛ̃] dans « {mot} ».",
      items: [
        { word: "raisin", withArticle: "du raisin", picture: "grapes", answer: true },
        { word: "lion", withArticle: "un lion", picture: "lion", answer: false },
        { word: "poussin", withArticle: "un poussin", picture: "chick", answer: true },
        { word: "piano", withArticle: "un piano", picture: "piano", answer: false },
        { word: "train", withArticle: "un train", picture: "fast-train", answer: true },
        { word: "pantalon", withArticle: "un pantalon", picture: "trousers", answer: false },
      ],
    },
    sentence: "Le lapin mange du pain dans le jardin.",
    tip: "Dans beaucoup de régions, un (brun, lundi) se prononce comme in : on peut les apprendre ensemble. Attention aussi à mine ou cabine : le n est suivi d'une voyelle, donc on lit mi-ne, sans le son [ɛ̃].",
    faq: [
      {
        question: "Quelle différence entre in et ain ?",
        answer: "Aucune à l'oral : lapin et main ont le même son. La différence est seulement dans l'écriture, qu'on retient en lisant.",
      },
      {
        question: "Pourquoi « chien » se termine-t-il par en ?",
        answer:
          "Après un i, en se lit souvent [ɛ̃] : chien, bien, rien. C'est une exception qu'on rencontre tôt au CP, parce que ces petits mots sont très fréquents.",
      },
    ],
    related: ["an", "on", "ill"],
  },
  {
    slug: "oi",
    title: "Le son oi",
    metaTitle: "Le son oi [wa] : mots, phrase et exercice (CP)",
    short: "oi",
    ipa: "[wa]",
    level: "CP",
    group: "sons",
    summary: "o et i ensemble font [wa], comme dans roi et étoile.",
    intro:
      "Le o et le i ensemble ne se lisent ni o ni i : ils font [wa], comme dans roi. C'est un son très fréquent : moi, toi, trois, noir, voiture…",
    soundSpoken: "Comme dans roi, poisson, étoile.",
    words: [
      { word: "r[oi]", withArticle: "un roi", picture: "king" },
      { word: "p[oi]sson", withArticle: "un poisson", picture: "fish" },
      { word: "ét[oi]le", withArticle: "une étoile", picture: "star" },
      { word: "[oi]seau", withArticle: "un oiseau", picture: "bird" },
      { word: "p[oi]re", withArticle: "une poire", picture: "pear" },
      { word: "tr[oi]s", withArticle: "trois", picture: "number-3" },
    ],
    hunt: {
      question: "Dans quels mots entends-tu [wa], comme dans roi ?",
      yes: "Oui : on entend [wa] dans « {mot} ».",
      no: "Non : pas de [wa] dans « {mot} ».",
      items: [
        { word: "voiture", withArticle: "une voiture", picture: "car", answer: true },
        { word: "lion", withArticle: "un lion", picture: "lion", answer: false },
        { word: "doigt", withArticle: "un doigt", picture: "index-finger", answer: true },
        { word: "robot", withArticle: "un robot", picture: "robot", answer: false },
        { word: "noir", withArticle: "noir", picture: "black-circle", answer: true },
        { word: "lit", withArticle: "un lit", picture: "bed", answer: false },
      ],
    },
    sentence: "Le roi a vu trois étoiles dans le noir.",
    tip: "Le son [wa] s'écrit avec deux lettres qui, seules, font un tout autre son : c'est déroutant au début. Montrez les deux lettres collées avec le doigt et répétez « o et i, ça fait oi », comme une petite formule. Dans lion, les lettres sont dans l'autre sens : on lit li-on.",
    faq: [
      {
        question: "Pourquoi oi se lit-il [wa] ?",
        answer:
          "C'est l'histoire de la langue : il y a très longtemps, on prononçait vraiment « o-i ». La prononciation a changé, l'orthographe est restée.",
      },
      {
        question: "Y a-t-il d'autres façons d'écrire [wa] ?",
        answer: "Rarement : oy dans quelques mots (voyage, noyau) et oê dans poêle. Au CP, oi suffit.",
      },
    ],
    related: ["ou", "eu", "o-au-eau"],
  },
  {
    slug: "ch",
    title: "Le son ch",
    metaTitle: "Le son ch [ʃ] : mots, phrase et exercice (CP)",
    short: "ch",
    ipa: "[ʃ]",
    level: "CP",
    group: "sons",
    summary: "c et h ensemble font [ʃ], le son de chut ! qu'on entend dans chat et vache.",
    intro:
      "Le c et le h réunis font [ʃ], le son qu'on fait pour demander le silence : chut ! On l'entend au début de chat et à la fin de vache.",
    soundSpoken: "Chut ! Comme dans chat, chien, vache.",
    words: [
      { word: "[ch]at", withArticle: "un chat", picture: "cat" },
      { word: "[ch]ien", withArticle: "un chien", picture: "dog" },
      { word: "va[ch]e", withArticle: "une vache", picture: "cow" },
      { word: "[ch]eval", withArticle: "un cheval", picture: "horse" },
      { word: "[ch]apeau", withArticle: "un chapeau", picture: "hat" },
      { word: "bou[ch]e", withArticle: "une bouche", picture: "mouth" },
    ],
    hunt: {
      question: "Dans quels mots entends-tu [ʃ], comme dans chat ?",
      yes: "Oui : on entend [ʃ] dans « {mot} ».",
      no: "Non : pas de [ʃ] dans « {mot} ».",
      items: [
        { word: "chocolat", withArticle: "du chocolat", picture: "chocolate", answer: true },
        { word: "soleil", withArticle: "le soleil", picture: "sun", answer: false },
        { word: "cochon", withArticle: "un cochon", picture: "pig", answer: true },
        { word: "cactus", withArticle: "un cactus", picture: "cactus", answer: false },
        { word: "chaussure", withArticle: "une chaussure", picture: "sneaker", answer: true },
        { word: "koala", withArticle: "un koala", picture: "koala", answer: false },
      ],
    },
    sentence: "Le chat de Sacha cherche le chien.",
    tip: "Les enfants confondent souvent [ʃ] et [s] (chat, sac) ou [ʃ] et [ʒ] (chou, joue). Faites sentir la différence : pour [ʃ], on souffle sans voix, comme pour chut ; pour [ʒ], la gorge vibre.",
    faq: [
      {
        question: "Le ch se lit-il toujours [ʃ] ?",
        answer: "Presque toujours. Dans quelques mots, il se lit [k] : chorale, orchestre, écho. On les rencontre plus tard.",
      },
      {
        question: "Comment l'expliquer à un enfant ?",
        answer: "Le h ne fait pas de bruit tout seul, mais placé après le c, il le transforme : ensemble, c et h font chut !",
      },
    ],
    related: ["gn", "c-et-g", "s-et-ss"],
  },
  {
    slug: "gn",
    title: "Le son gn",
    metaTitle: "Le son gn [ɲ] : mots, phrase et exercice (CP)",
    short: "gn",
    ipa: "[ɲ]",
    level: "CP",
    group: "sons",
    summary: "g et n ensemble font [ɲ], le son de champignon et de montagne.",
    intro:
      "Le g et le n ensemble font [ɲ], le son qu'on entend dans champignon et montagne. On ne le trouve presque jamais au début des mots : il est au milieu ou à la fin.",
    soundSpoken: "Comme dans champignon, montagne, araignée.",
    words: [
      { word: "champi[gn]on", withArticle: "un champignon", picture: "mushroom" },
      { word: "monta[gn]e", withArticle: "une montagne", picture: "mountain" },
      { word: "cy[gn]e", withArticle: "un cygne", picture: "swan" },
      { word: "a[gn]eau", withArticle: "un agneau", picture: "sheep" },
      { word: "arai[gn]ée", withArticle: "une araignée", picture: "spider" },
      { word: "vi[gn]e", withArticle: "une vigne", picture: "grapes" },
    ],
    hunt: {
      question: "Dans quels mots entends-tu [ɲ], comme dans montagne ?",
      yes: "Oui : on entend [ɲ] dans « {mot} ».",
      no: "Non : pas de [ɲ] dans « {mot} ».",
      items: [
        { word: "baignoire", withArticle: "une baignoire", picture: "bathtub", answer: true },
        { word: "guitare", withArticle: "une guitare", picture: "guitar", answer: false },
        { word: "gagnant", withArticle: "le gagnant", picture: "trophy", answer: true },
        { word: "nuage", withArticle: "un nuage", picture: "cloud", answer: false },
        { word: "neige", withArticle: "la neige", picture: "snowflake", answer: false },
      ],
    },
    sentence: "L'araignée grimpe sur la montagne.",
    tip: "L'erreur la plus courante est de lire les deux lettres séparément : « mon-tag-ne ». Pour aider l'enfant à produire [ɲ], faites-lui dire « ni-a » de plus en plus vite : on s'approche de « gna ».",
    faq: [
      {
        question: "Le son gn existe-t-il dans d'autres langues ?",
        answer:
          "Oui : c'est le ñ espagnol (España), le nh portugais et le gn italien. Pour un enfant qui entend l'une de ces langues à la maison, c'est un son familier.",
      },
      {
        question: "gn se lit-il toujours [ɲ] ?",
        answer: "Presque toujours. Quelques mots savants font exception, comme diagnostic, mais les enfants ne les rencontrent pas au CP.",
      },
    ],
    related: ["ch", "ill", "syllabes"],
  },
  {
    slug: "eu",
    title: "Le son eu",
    metaTitle: "Le son eu (eu, œu) : mots, phrase et exercice (CP)",
    short: "eu",
    spellings: "eu · œu",
    ipa: "[ø] [œ]",
    level: "CP",
    group: "sons",
    summary: "Le son de feu, de fleur et de cœur, qui s'écrit eu ou œu.",
    intro:
      "eu et œu s'écrivent pour un son proche du e de cheval, mais plus marqué, avec les lèvres arrondies : un peu fermé dans feu, un peu ouvert dans fleur. À l'école, on les apprend comme un seul son.",
    soundSpoken: "eux. Comme dans feu, fleur, cœur.",
    rules: ["Le œ, c'est un o et un e collés : œuf, cœur, sœur, nœud."],
    words: [
      { word: "f[eu]", withArticle: "le feu", picture: "fire" },
      { word: "fl[eu]r", withArticle: "une fleur", picture: "flower" },
      { word: "c[œu]r", withArticle: "un cœur", picture: "heart" },
      { word: "[œu]f", withArticle: "un œuf", picture: "egg" },
      { word: "bl[eu]", withArticle: "bleu", picture: "blue-circle" },
      { word: "chev[eu]x", withArticle: "des cheveux", picture: "hair" },
    ],
    hunt: {
      question: "Dans quels mots entends-tu eu, comme dans feu ?",
      yes: "Oui : on entend eu dans « {mot} ».",
      no: "Non : pas de eu dans « {mot} ».",
      items: [
        { word: "deux", withArticle: "deux", picture: "number-2", answer: true },
        { word: "zèbre", withArticle: "un zèbre", picture: "zebra", answer: false },
        { word: "tracteur", withArticle: "un tracteur", picture: "tractor", answer: true },
        { word: "fée", withArticle: "une fée", picture: "fairy", answer: false },
        { word: "nœud", withArticle: "un nœud", picture: "bow", answer: true },
        { word: "vélo", withArticle: "un vélo", picture: "bicycle", answer: false },
      ],
    },
    sentence: "Ma sœur a deux fleurs bleues.",
    tip: "Les sons de feu et de fleur sont très proches, et beaucoup de francophones ne les distinguent pas. Ce qui compte au CP : reconnaître eu et œu à l'écrit, et savoir qu'ils se lisent de la même façon.",
    faq: [
      {
        question: "Quelle différence entre eu et e ?",
        answer: "Le e tout seul (cheval, petit) est plus court et plus léger. eu est bien marqué, lèvres arrondies. À l'écrit, eu compte toujours deux lettres.",
      },
      {
        question: "Pourquoi écrit-on œuf avec œ ?",
        answer: "C'est une lettre double, o et e collés, héritée du latin. On la trouve dans quelques mots courants : œuf, bœuf, cœur, sœur, nœud.",
      },
    ],
    related: ["ou", "o-au-eau", "e-accent-grave"],
  },
  {
    slug: "o-au-eau",
    title: "Le son o",
    metaTitle: "Le son o (o, au, eau) : mots, règle et exercice (CP)",
    short: "eau",
    spellings: "o · au · eau",
    ipa: "[o]",
    level: "CP",
    group: "sons",
    summary: "Le son [o] s'écrit o, au ou eau : vélo, auto, bateau.",
    intro:
      "Le son [o] s'écrit de trois façons : avec la lettre o toute seule (vélo), avec au (auto) ou avec eau (bateau). Dans eau, les trois lettres font un seul son.",
    soundSpoken: "eau. Comme dans vélo, auto, bateau.",
    rules: [
      "eau est presque toujours à la fin du mot : bateau, gâteau, cadeau.",
      "au se trouve souvent au début ou au milieu : auto, chaussette.",
    ],
    words: [
      { word: "vél[o]", withArticle: "un vélo", picture: "bicycle" },
      { word: "[au]to", withArticle: "une auto", picture: "car" },
      { word: "bat[eau]", withArticle: "un bateau", picture: "sailboat" },
      { word: "chât[eau]", withArticle: "un château", picture: "castle" },
      { word: "ch[au]ssette", withArticle: "une chaussette", picture: "sock" },
      { word: "cad[eau]", withArticle: "un cadeau", picture: "gift" },
    ],
    hunt: {
      question: "Dans quels mots entends-tu [o], comme dans vélo ?",
      yes: "Oui : on entend [o] dans « {mot} ».",
      no: "Non : pas de [o] dans « {mot} ».",
      items: [
        { word: "piano", withArticle: "un piano", picture: "piano", answer: true },
        { word: "loup", withArticle: "un loup", picture: "wolf", answer: false },
        { word: "saucisse", withArticle: "une saucisse", picture: "hot-dog", answer: true },
        { word: "poire", withArticle: "une poire", picture: "pear", answer: false },
        { word: "moto", withArticle: "une moto", picture: "motorbike", answer: true },
        { word: "lune", withArticle: "la lune", picture: "moon", answer: false },
      ],
    },
    sentence: "Paul a un gâteau et un beau cadeau.",
    tip: "Le vrai piège est dans l'autre sens : le o fait [o] tout seul, mais pas quand il est pris dans ou, on ou oi. Un enfant qui lit « lo-u-p » pour loup a besoin de revoir ces sons à deux lettres. Pour écrire [o], au et eau se retiennent mot par mot.",
    faq: [
      {
        question: "Comment savoir s'il faut écrire o, au ou eau ?",
        answer:
          "On ne peut pas l'entendre : il faut mémoriser les mots. Un indice aide : eau est presque toujours à la fin (bateau), au plutôt au début ou au milieu (auto, chaussette).",
      },
      {
        question: "Pourquoi le mot eau s'écrit-il avec trois lettres ?",
        answer: "Ces lettres gardent la trace de l'ancienne prononciation du mot. Aujourd'hui, e, a et u réunis font un seul son, [o].",
      },
    ],
    related: ["ou", "eu", "oi"],
  },
  {
    slug: "e-accent-aigu",
    title: "Le son é",
    metaTitle: "Le son é (é, er, ez) : mots, règle et exercice (CP)",
    short: "é",
    spellings: "é · er · ez",
    ipa: "[e]",
    level: "CP",
    group: "sons",
    summary: "Le son de bébé, qui s'écrit é, et aussi er ou ez à la fin des mots.",
    intro:
      "Le son [e] de bébé s'écrit le plus souvent é. À la fin des mots, on le trouve aussi sous la forme er (panier) et ez (nez). Les verbes comme chanter ou jouer se terminent par er.",
    soundSpoken: "é. Comme dans bébé, nez, panier.",
    rules: [
      "À la fin d'un mot, er et ez se lisent souvent [e] : panier, nez, chez.",
      "Attention : dans mer ou hiver, on entend le r, et le e se lit comme è.",
    ],
    words: [
      { word: "b[é]b[é]", withArticle: "un bébé", picture: "baby" },
      { word: "f[é]e", withArticle: "une fée", picture: "fairy" },
      { word: "n[ez]", withArticle: "un nez", picture: "nose" },
      { word: "pani[er]", withArticle: "un panier", picture: "basket" },
      { word: "d[é]", withArticle: "un dé", picture: "dice" },
      { word: "[é]cole", withArticle: "une école", picture: "school" },
    ],
    hunt: {
      question: "Dans quels mots entends-tu [e], comme dans bébé ?",
      yes: "Oui : on entend [e] dans « {mot} ».",
      no: "Non : pas de [e] dans « {mot} ».",
      items: [
        { word: "épée", withArticle: "une épée", picture: "swords", answer: true },
        { word: "zèbre", withArticle: "un zèbre", picture: "zebra", answer: false },
        { word: "télé", withArticle: "la télé", picture: "television", answer: true },
        { word: "cheval", withArticle: "un cheval", picture: "horse", answer: false },
        { word: "fusée", withArticle: "une fusée", picture: "rocket", answer: true },
        { word: "fête", withArticle: "une fête", picture: "party-popper", answer: false },
      ],
    },
    sentence: "Le bébé a un vélo et un dé.",
    tip: "Le e change de son selon son accent : é [e], è et ê [ɛ], e sans accent [ə] ou muet. Au CP, on apprend d'abord é, le plus fréquent. Pour faire sentir la différence entre é et è, souriez pour é (bouche peu ouverte) et ouvrez un peu plus la bouche pour è.",
    faq: [
      {
        question: "Pourquoi « nez » s'écrit-il avec un z qu'on n'entend pas ?",
        answer: "À la fin de quelques mots, ez se lit [e] : nez, chez, assez. On le retrouve aussi avec « vous » : vous chantez.",
      },
      {
        question: "Comment savoir s'il faut écrire é ou er ?",
        answer:
          "Au début et au milieu d'un mot, c'est é (école, vélo). À la fin, cela dépend du mot : bébé mais panier. Les verbes comme chanter ou jouer, eux, finissent par er.",
      },
    ],
    related: ["e-accent-grave", "eu", "lettres-muettes"],
  },
  {
    slug: "e-accent-grave",
    title: "Le son è",
    metaTitle: "Le son è (è, ê, ai, ei) : mots, règle et exercice (CP)",
    short: "è",
    spellings: "è · ê · ai · ei",
    ipa: "[ɛ]",
    level: "CP",
    group: "sons",
    summary: "Le son de chèvre, de forêt, de fraise et de reine : è, ê, ai, ei.",
    intro:
      "Le son [ɛ] de chèvre s'écrit de plusieurs façons : è (chèvre), ê (forêt), ai (fraise) et ei (reine). On l'entend aussi quand un e est suivi de deux consonnes, comme dans perle ou escargot.",
    soundSpoken: "Comme dans chèvre, forêt, fraise, reine.",
    rules: [
      "ai et ei se lisent comme è : fraise, lait, reine, neige.",
      "Un e suivi de deux consonnes se lit aussi [ɛ] : perle, verre, escargot.",
    ],
    words: [
      { word: "ch[è]vre", withArticle: "une chèvre", picture: "goat" },
      { word: "for[ê]t", withArticle: "une forêt", picture: "fir-tree" },
      { word: "f[ê]te", withArticle: "une fête", picture: "party-popper" },
      { word: "fr[ai]se", withArticle: "une fraise", picture: "strawberry" },
      { word: "l[ai]t", withArticle: "du lait", picture: "milk" },
      { word: "r[ei]ne", withArticle: "une reine", picture: "princess" },
    ],
    hunt: {
      question: "Dans quels mots entends-tu [ɛ], comme dans chèvre ?",
      yes: "Oui : on entend [ɛ] dans « {mot} ».",
      no: "Non : pas de [ɛ] dans « {mot} ».",
      items: [
        { word: "sorcière", withArticle: "une sorcière", picture: "wizard", answer: true },
        { word: "bébé", withArticle: "un bébé", picture: "baby", answer: false },
        { word: "baleine", withArticle: "une baleine", picture: "whale", answer: true },
        { word: "renard", withArticle: "un renard", picture: "fox", answer: false },
        { word: "neige", withArticle: "la neige", picture: "snowflake", answer: true },
        { word: "fée", withArticle: "une fée", picture: "fairy", answer: false },
      ],
    },
    sentence: "La reine mange une fraise dans la forêt.",
    tip: "Selon les régions et les pays, é et è se prononcent plus ou moins différemment. Ne cherchez pas une prononciation parfaite : l'essentiel est que l'enfant reconnaisse toutes les façons d'écrire le son [ɛ].",
    faq: [
      {
        question: "Quelle différence entre è et ê ?",
        answer:
          "À l'oral, presque aucune : chèvre et forêt ont le même son. Le ê garde souvent la trace d'un s disparu : forêt (forestier), fête (festival).",
      },
      {
        question: "Comment lire « ai » ?",
        answer: "Comme è : fraise, lait, maison. Mais dans ail ou travail, on entend [aj] : c'est le son ill.",
      },
    ],
    related: ["e-accent-aigu", "ill", "eu"],
  },
  {
    slug: "ill",
    title: "Le son ill",
    metaTitle: "Le son ill (ill, ail, eil, euil, ouil) : mots et exercice (CP)",
    short: "ill",
    spellings: "ill · ail · eil · euil · ouil",
    ipa: "[j]",
    level: "CP",
    group: "sons",
    summary: "Le son de soleil, d'abeille et de papillon : ill au milieu des mots, il à la fin.",
    intro:
      "Le son [j], celui qu'on entend à la fin de soleil, s'écrit ill au milieu des mots (papillon, abeille) et il à la fin, après une voyelle : ail (travail), eil (soleil), euil (écureuil).",
    soundSpoken: "Comme dans soleil, abeille, papillon.",
    rules: [
      "Au milieu d'un mot, on écrit ill : papillon, abeille, grenouille.",
      "À la fin, après a, e, eu ou ou, on écrit il : travail, soleil, écureuil.",
      "Trois mots à retenir : dans ville, mille et tranquille, on entend [l].",
    ],
    words: [
      { word: "pap[ill]on", withArticle: "un papillon", picture: "butterfly" },
      { word: "ab[eill]e", withArticle: "une abeille", picture: "bee" },
      { word: "sol[eil]", withArticle: "le soleil", picture: "sun" },
      { word: "gren[ouill]e", withArticle: "une grenouille", picture: "frog" },
      { word: "écur[euil]", withArticle: "un écureuil", picture: "squirrel" },
      { word: "bout[eill]e", withArticle: "une bouteille", picture: "bottle" },
    ],
    hunt: {
      question: "Dans quels mots entends-tu [j], comme dans soleil ?",
      yes: "Oui : on entend [j] dans « {mot} ».",
      no: "Non : pas de [j] dans « {mot} ».",
      items: [
        { word: "fille", withArticle: "une fille", picture: "girl", answer: true },
        { word: "ville", withArticle: "une ville", picture: "city", answer: false },
        { word: "chenille", withArticle: "une chenille", picture: "caterpillar", answer: true },
        { word: "lit", withArticle: "un lit", picture: "bed", answer: false },
        { word: "orteil", withArticle: "un orteil", picture: "foot", answer: true },
        { word: "tulipe", withArticle: "une tulipe", picture: "tulip", answer: false },
      ],
    },
    sentence: "Une abeille et un papillon volent au soleil.",
    tip: "Faites repérer la voyelle avant ill : a-ill (paille), e-ill (abeille), ou-ill (grenouille). Quand ill suit une consonne, comme dans fille ou chenille, on entend aussi le i : fi-ye.",
    faq: [
      {
        question: "Pourquoi écrit-on soleil avec un seul l ?",
        answer:
          "À la fin d'un mot, après une voyelle, le son [j] s'écrit avec un seul l : soleil, travail, fauteuil. Au milieu, on double le l : abeille, bataille.",
      },
      {
        question: "Et ville, alors ?",
        answer: "C'est l'une des rares exceptions : dans ville, mille et tranquille, ll se lit [l]. Ces trois mots s'apprennent par cœur.",
      },
    ],
    related: ["gn", "e-accent-grave", "in"],
  },
  {
    slug: "c-et-g",
    title: "Le c et le g : son dur, son doux",
    metaTitle: "Le c et le g : son dur ou doux, ç et ge (CP)",
    short: "c g",
    spellings: "c · ç · g · ge · gu",
    ipa: "[k] [s] · [g] [ʒ]",
    level: "CP",
    group: "pieges",
    summary: "Devant a, o, u, le c et le g sont durs (canard, gâteau) ; devant e, i, y, ils sont doux (citron, girafe).",
    intro:
      "Le c et le g changent de son selon la lettre qui les suit. Devant a, o et u, ils sont durs : [k] dans canard, [g] dans gâteau. Devant e, i et y, ils deviennent doux : [s] dans citron, [ʒ] dans girafe.",
    soundSpoken: "ca, co. ce, ci. ga, go. ge, gi.",
    rules: [
      "Devant a, o, u : le c se lit [k] et le g se lit [g] (canard, gâteau).",
      "Devant e, i, y : le c se lit [s] et le g se lit [ʒ] (citron, girafe).",
      "Pour lire [s] devant a, o, u, on ajoute une cédille : ç (garçon, leçon).",
      "Pour lire [ʒ] devant a, o, u, on ajoute un e : ge (pigeon, nageoire).",
      "Pour lire [g] devant e ou i, on ajoute un u : gu (guitare, bague).",
    ],
    tiles: {
      title: "Écoute la différence",
      items: [
        { label: "ca", note: "dur" },
        { label: "co", note: "dur" },
        { label: "ce", note: "doux" },
        { label: "ci", note: "doux" },
        { label: "ça", note: "doux" },
        { label: "ga", note: "dur" },
        { label: "go", note: "dur" },
        { label: "ge", note: "doux" },
        { label: "gi", note: "doux" },
      ],
    },
    words: [
      { word: "[c]anard", withArticle: "un canard", picture: "duck" },
      { word: "[c]itron", withArticle: "un citron", picture: "lemon" },
      { word: "gar[ç]on", withArticle: "un garçon", picture: "boy" },
      { word: "[g]âteau", withArticle: "un gâteau", picture: "cake" },
      { word: "[g]irafe", withArticle: "une girafe", picture: "giraffe" },
      { word: "pi[ge]on", withArticle: "un pigeon", picture: "bird" },
    ],
    hunt: {
      question: "Dans quels mots le c se lit-il [s], comme dans citron ?",
      yes: "Oui : dans « {mot} », le c se lit [s].",
      no: "Non : dans « {mot} », le c se lit [k].",
      items: [
        { word: "cerise", withArticle: "une cerise", picture: "cherry", answer: true },
        { word: "cochon", withArticle: "un cochon", picture: "pig", answer: false },
        { word: "glaçon", withArticle: "un glaçon", picture: "ice", answer: true },
        { word: "carotte", withArticle: "une carotte", picture: "carrot", answer: false },
        { word: "cinq", withArticle: "cinq", picture: "number-5", answer: true },
        { word: "cadeau", withArticle: "un cadeau", picture: "gift", answer: false },
      ],
    },
    sentence: "Le garçon mange une glace au citron.",
    tip: "Une petite formule aide : « Devant e et i, le c chante s et le g chante j. » Les voyelles a, o, u gardent le c et le g durs. La cédille est comme un petit crochet qui transforme le c en s.",
    faq: [
      {
        question: "À quoi sert la cédille ?",
        answer:
          "Elle se met sous le c, devant a, o ou u, pour qu'il se lise [s] : garçon, leçon, reçu. Sans elle, on lirait « gar-kon ».",
      },
      {
        question: "Pourquoi écrit-on guitare avec un u ?",
        answer:
          "Sans le u, on lirait « gi-tare », avec le son [ʒ]. Le u, qu'on n'entend pas, garde le son dur du g devant e et i : guitare, bague, guêpe.",
      },
    ],
    related: ["s-et-ss", "ch", "lettres-muettes"],
  },
  {
    slug: "s-et-ss",
    title: "s ou ss : poisson ou poison ?",
    metaTitle: "s ou ss : poisson ou poison ? Le s entre deux voyelles (CP)",
    short: "ss",
    spellings: "s · ss · z",
    ipa: "[s] [z]",
    level: "CP",
    group: "pieges",
    summary: "Entre deux voyelles, s se lit [z] (poison) et ss se lit [s] (poisson).",
    intro:
      "Entre deux voyelles, un s tout seul se lit [z] : poison, maison, rose. Pour garder le son [s] entre deux voyelles, on double le s : poisson, tasse. Poisson et poison ne se lisent pas pareil !",
    soundSpoken: "poisson. poison. coussin. cousin.",
    rules: [
      "Au début d'un mot, s se lit [s] : serpent, soleil.",
      "Entre deux voyelles, s se lit [z] : rose, maison, cerise.",
      "Entre deux voyelles, ss se lit [s] : poisson, tasse, trousse.",
      "Le z se lit toujours [z] : zèbre, zéro.",
    ],
    tiles: {
      title: "Écoute bien la différence",
      items: [
        { label: "poisson", note: "[s]" },
        { label: "poison", note: "[z]" },
        { label: "coussin", note: "[s]" },
        { label: "cousin", note: "[z]" },
        { label: "dessert", note: "[s]" },
        { label: "désert", note: "[z]" },
      ],
    },
    words: [
      { word: "poi[ss]on", withArticle: "un poisson", picture: "fish" },
      { word: "poi[s]on", withArticle: "du poison", picture: "potion" },
      { word: "ta[ss]e", withArticle: "une tasse", picture: "cup" },
      { word: "ro[s]e", withArticle: "une rose", picture: "rose" },
      { word: "mai[s]on", withArticle: "une maison", picture: "house" },
      { word: "[s]erpent", withArticle: "un serpent", picture: "snake" },
    ],
    hunt: {
      question: "Dans quels mots entends-tu [z], comme dans rose ?",
      yes: "Oui : on entend [z] dans « {mot} ».",
      no: "Non : pas de [z] dans « {mot} ».",
      items: [
        { word: "cerise", withArticle: "une cerise", picture: "cherry", answer: true },
        { word: "sac", withArticle: "un sac", picture: "backpack", answer: false },
        { word: "vase", withArticle: "un vase", picture: "vase", answer: true },
        { word: "saucisse", withArticle: "une saucisse", picture: "hot-dog", answer: false },
        { word: "chemise", withArticle: "une chemise", picture: "shirt", answer: true },
        { word: "salade", withArticle: "une salade", picture: "salad", answer: false },
      ],
    },
    sentence: "Le poisson rose nage dans la tasse.",
    tip: "Faites écouter les paires poisson et poison, coussin et cousin : l'enfant découvre qu'une seule lettre change le mot. C'est la meilleure façon de montrer pourquoi on double le s.",
    faq: [
      {
        question: "Pourquoi écrit-on poisson avec deux s ?",
        answer: "Parce que le s est entre deux voyelles (oi et on). Avec un seul s, on lirait [z], comme dans poison.",
      },
      {
        question: "Le son [s] s'écrit-il toujours avec un s ?",
        answer: "Non : il s'écrit aussi c devant e et i (cerise, citron) et ç devant a, o, u (garçon). Voir la page sur le c et le g.",
      },
    ],
    related: ["c-et-g", "lettres-muettes", "ch"],
  },
  {
    slug: "lettres-muettes",
    title: "Les lettres muettes",
    metaTitle: "Les lettres muettes : le h, les consonnes finales, le e muet (CP)",
    short: "h",
    spellings: "h · t · d · s · x · e…",
    level: "CP",
    group: "pieges",
    summary: "Le h de hibou, le t de chat, le s de souris : des lettres qu'on écrit sans les entendre.",
    intro:
      "En français, beaucoup de lettres s'écrivent mais ne se prononcent pas. Le h au début de hibou, le t à la fin de chat, le s à la fin de souris : on les voit, on ne les entend pas. Ce sont les lettres muettes. Dans les mots ci-dessous, elles sont en gris.",
    soundSpoken: "chat. hibou. souris. Certaines lettres ne s'entendent pas.",
    marks: "silent",
    rules: [
      "Le h ne se prononce pas tout seul : hibou, hérisson. Avec le c, il forme le son ch.",
      "Beaucoup de consonnes finales sont muettes : chat, loup, renard, souris.",
      "La lettre muette s'entend souvent dans un mot de la même famille : chat, chaton ; grand, grande ; lait, laitier.",
      "Le e à la fin d'un mot est souvent muet : lune, pomme, tomate.",
    ],
    words: [
      { word: "cha[t]", withArticle: "un chat", picture: "cat" },
      { word: "[h]ibou", withArticle: "un hibou", picture: "owl" },
      { word: "souri[s]", withArticle: "une souris", picture: "mouse" },
      { word: "lou[p]", withArticle: "un loup", picture: "wolf" },
      { word: "renar[d]", withArticle: "un renard", picture: "fox" },
      { word: "escargo[t]", withArticle: "un escargot", picture: "snail" },
    ],
    hunt: {
      question: "Dans quels mots entends-tu la dernière lettre ?",
      yes: "Oui : on entend la dernière lettre de « {mot} ».",
      no: "Non : la dernière lettre de « {mot} » est muette.",
      items: [
        { word: "bus", withArticle: "un bus", picture: "bus", answer: true },
        { word: "lit", withArticle: "un lit", picture: "bed", answer: false },
        { word: "ours", withArticle: "un ours", picture: "bear", answer: true },
        { word: "riz", withArticle: "du riz", picture: "rice", answer: false },
        { word: "sac", withArticle: "un sac", picture: "backpack", answer: true },
        { word: "pied", withArticle: "un pied", picture: "foot", answer: false },
      ],
    },
    sentence: "Le chat gris dort dans le lit.",
    tip: "Les lettres muettes gênent peu la lecture : l'enfant apprend vite à ne pas les prononcer. Elles comptent surtout pour écrire. Le jeu des familles de mots (chat, chaton ; petit, petite) aide à savoir quelle lettre ajouter à la fin.",
    faq: [
      {
        question: "Pourquoi y a-t-il des lettres muettes en français ?",
        answer:
          "Beaucoup se prononçaient autrefois, et l'orthographe les a gardées. Elles sont utiles : elles montrent la famille du mot (le t de chat se retrouve dans chaton) et le pluriel (les chats).",
      },
      {
        question: "Comment savoir si la dernière lettre se prononce ?",
        answer:
          "Il n'y a pas de règle absolue. On entend souvent le c, le r, le f et le l à la fin (sac, mer, neuf, bol) ; les autres consonnes finales sont souvent muettes.",
      },
    ],
    related: ["s-et-ss", "mots-outils", "e-accent-aigu"],
  },
  {
    slug: "mots-outils",
    title: "Les mots-outils",
    metaTitle: "Les mots-outils du CP : liste et lecture à voix haute",
    short: "et",
    level: "CP",
    group: "mots",
    summary: "Les petits mots qui reviennent dans toutes les phrases (le, la, et, est, dans…), à reconnaître d'un coup d'œil.",
    intro:
      "Les mots-outils sont les petits mots qui reviennent dans toutes les phrases : le, la, un, et, dans, avec… On ne peut pas les dessiner, et certains ne se lisent pas comme ils s'écrivent (est, les). Au CP, on apprend à les reconnaître d'un coup d'œil pour lire plus vite.",
    soundSpoken: "le. la. les. un. une. et. est. dans.",
    tiles: {
      title: "Écoute les mots-outils",
      items: [
        { label: "le" },
        { label: "la" },
        { label: "les" },
        { label: "un" },
        { label: "une" },
        { label: "et" },
        { label: "est" },
        { label: "il" },
        { label: "elle" },
        { label: "je" },
        { label: "tu" },
        { label: "on" },
        { label: "dans" },
        { label: "sur" },
        { label: "avec" },
        { label: "pour" },
        { label: "mais" },
        { label: "qui" },
        { label: "c'est" },
        { label: "il y a" },
      ],
    },
    sentence: "Il y a un chat et un chien dans la maison.",
    tip: "Affichez quelques mots-outils sur le frigo et changez-les chaque semaine. Faites-les chercher dans un livre : combien de « et » sur cette page ? Et distinguez tôt et (le chat et le chien) de est (le chat est gris).",
    faq: [
      {
        question: "Combien de mots-outils apprendre au CP ?",
        answer: "Les listes des manuels en comptent souvent entre 50 et 100. Commencez par une vingtaine, les plus fréquents : ceux de cette page.",
      },
      {
        question: "Faut-il les apprendre par cœur ?",
        answer:
          "Oui pour les plus irréguliers (est, et, les), mais beaucoup se déchiffrent aussi (la, sur, avec). Le but est de les reconnaître sans s'arrêter, pour lire les phrases d'une traite.",
      },
    ],
    related: ["syllabes", "lettres-muettes", "voyelles"],
  },
];

export function getFrenchSound(slug: string): FrenchSound | undefined {
  return frenchSounds.find((s) => s.slug === slug);
}

/** Pages in reading order, grouped as on the index page. */
export function orderedSounds(): FrenchSound[] {
  return SOUND_GROUPS.flatMap((g) => frenchSounds.filter((s) => s.group === g.id));
}

/** Previous and next page, following the index order (no wrap-around). */
export function soundNeighbors(slug: string): { prev?: FrenchSound; next?: FrenchSound } {
  const list = orderedSounds();
  const i = list.findIndex((s) => s.slug === slug);
  return { prev: list[i - 1], next: list[i + 1] };
}

export type WordPart = { text: string; mark: boolean };

/** "l[ou]p" → [{l}, {ou, marked}, {p}]; "vé|lo" → syllables, every other one marked. */
export function wordParts(word: string): WordPart[] {
  if (word.includes("|")) return word.split("|").map((text, i) => ({ text, mark: i % 2 === 1 }));
  return word
    .split(/(\[[^\]]+\])/)
    .filter(Boolean)
    .map((part) => (part.startsWith("[") ? { text: part.slice(1, -1), mark: true } : { text: part, mark: false }));
}

/** The word without markup: "l[ou]p" → "loup", "vé|lo" → "vélo". */
export function plainWord(word: string): string {
  return word.replace(/[[\]|]/g, "");
}

/** Consonants and vowels offered by the syllable builder. */
export const BUILDER_CONSONANTS = ["m", "l", "r", "s", "f", "v", "n", "p", "t", "d"];
export const BUILDER_VOWELS = ["a", "i", "o", "u", "é"];
