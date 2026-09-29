// French alphabet content: the 26 letters plus é, è, ê and ç, written for
// French-speaking families (letter names, sounds and example words follow
// what children learn at school in France and Morocco). The English letters
// live in letters-data.ts; the two alphabets are separate on purpose.
//
// Pure data with no imports, so middleware, pages and tests can all use it.

export type FrenchWord = {
  word: string;
  /** With its article, as a child would say it ("un avion"). */
  withArticle: string;
  emoji: string;
};

export type FrenchLetter = {
  /** URL param: "a", or "e-accent-aigu" for é. */
  slug: string;
  lower: string;
  upper: string;
  /** How the letter's name is said ("bé", "effe"). */
  name: string;
  /** Main sound(s) in IPA, shown to parents. */
  ipa: string;
  kind: "voyelle" | "consonne";
  /** What the speech engine says for the letter's name. */
  nameSpoken: string;
  /**
   * What the speech engine says for the sound. Browsers can't say an
   * isolated consonant, so consonants are heard in syllables (ba, bo, bi).
   */
  soundSpoken: string;
  /** The sound, explained for parents (also the answer to the first FAQ). */
  sound: string;
  words: FrenchWord[];
  /** Words where the letter's sound is heard inside the word (U). */
  wordsInside?: FrenchWord[];
  /** "Bon à savoir" note for parents. */
  tip: string;
  faq: { question: string; answer: string };
  /** Letters (slugs) linked from this letter's page. */
  related?: string[];
};

export const ACCENTS_SLUG = "accents";

export const frenchLetters: FrenchLetter[] = [
  {
    slug: "a",
    lower: "a",
    upper: "A",
    name: "a",
    ipa: "[a]",
    kind: "voyelle",
    nameSpoken: "A",
    soundSpoken: "a. Comme dans avion, abeille.",
    sound: "Le A fait le son [a], comme au début d'avion et d'abeille. C'est l'un des premiers sons que les enfants entendent et répètent, dans papa ou dans leur prénom.",
    words: [
      { word: "Avion", withArticle: "un avion", emoji: "✈️" },
      { word: "Abeille", withArticle: "une abeille", emoji: "🐝" },
    ],
    tip: "Le A est souvent la première lettre que l'enfant reconnaît, parce qu'elle ouvre l'alphabet et se trouve dans beaucoup de prénoms. Cherchez ensemble les A sur les paquets, les affiches et les couvertures de livres.",
    faq: {
      question: "À quel âge reconnaître la lettre A ?",
      answer: "Entre 3 et 5 ans, en petite et moyenne section, beaucoup d'enfants reconnaissent déjà le A, surtout s'il est dans leur prénom. Le lien entre la lettre et son son se consolide en grande section.",
    },
    related: [ACCENTS_SLUG],
  },
  {
    slug: "b",
    lower: "b",
    upper: "B",
    name: "bé",
    ipa: "[b]",
    kind: "consonne",
    nameSpoken: "B",
    soundSpoken: "ba, bo, bi. Comme dans ballon, banane.",
    sound: "Le B fait le son [b] : on serre les lèvres, puis on les ouvre d'un coup, comme dans ballon et banane.",
    words: [
      { word: "Ballon", withArticle: "un ballon", emoji: "🎈" },
      { word: "Banane", withArticle: "une banane", emoji: "🍌" },
    ],
    tip: "Les petits confondent souvent b et d, c'est normal jusqu'à 7 ans environ. Tracez-les en cursive : le b commence par une grande boucle vers le haut, le d par un rond. Ce geste différent aide à les distinguer.",
    faq: {
      question: "Quelle différence entre le son [b] et le son [p] ?",
      answer: "Les deux se font avec les lèvres. Avec le [b], la gorge vibre ; avec le [p], non, et on souffle davantage. Posez la main de l'enfant sur votre gorge en disant « ba » puis « pa » : il sentira la différence.",
    },
    related: ["d", "p"],
  },
  {
    slug: "c",
    lower: "c",
    upper: "C",
    name: "cé",
    ipa: "[k] / [s]",
    kind: "consonne",
    nameSpoken: "C",
    soundSpoken: "ca, co, cu. Comme dans canard. ce, ci. Comme dans citron.",
    sound: "Le C a deux sons. Devant a, o et u, il fait [k], comme dans canard (ca, co, cu). Devant e, i et y, il fait [s], comme dans citron (ce, ci).",
    words: [
      { word: "Canard", withArticle: "un canard", emoji: "🦆" },
      { word: "Citron", withArticle: "un citron", emoji: "🍋" },
    ],
    tip: "Inutile de tout expliquer d'un coup. Commencez par le son [k] de canard, puis présentez citron comme la « surprise » du C. La cédille (ç) viendra ensuite.",
    faq: {
      question: "Pourquoi le C se prononce-t-il parfois [s] ?",
      answer: "Devant e, i et y, le C se prononce [s] : cerise, citron, cygne. Pour garder le son [s] devant a, o et u, on ajoute une cédille : garçon, glaçon, leçon.",
    },
    related: ["c-cedille", "k", "q"],
  },
  {
    slug: "d",
    lower: "d",
    upper: "D",
    name: "dé",
    ipa: "[d]",
    kind: "consonne",
    nameSpoken: "D",
    soundSpoken: "da, do, di. Comme dans dauphin, dinosaure.",
    sound: "Le D fait le son [d], comme dans dauphin et dinosaure : le bout de la langue touche le haut, juste derrière les dents.",
    words: [
      { word: "Dauphin", withArticle: "un dauphin", emoji: "🐬" },
      { word: "Dinosaure", withArticle: "un dinosaure", emoji: "🦕" },
    ],
    tip: "Pour ne pas confondre d et b, tracez le d en commençant par le rond, puis montez le grand trait. Le b, lui, commence par le trait.",
    faq: {
      question: "Quelle différence entre le son [d] et le son [t] ?",
      answer: "Les deux se font au même endroit, mais le [d] fait vibrer la gorge et le [t] non. Posez la main de l'enfant sur votre gorge en disant « da » puis « ta » : il sentira la vibration.",
    },
    related: ["b", "t"],
  },
  {
    slug: "e",
    lower: "e",
    upper: "E",
    name: "e",
    ipa: "[ə] / [ɛ]",
    kind: "voyelle",
    nameSpoken: "E",
    soundSpoken: "e. Comme dans petit. è. Comme dans escargot, elfe.",
    sound: "Le nom de la lettre E se dit [ə], comme dans petit ou cheval. Mais escargot et elfe commencent par le son [ɛ] (è) : devant deux consonnes, le E se prononce souvent è, même sans accent.",
    words: [
      { word: "Escargot", withArticle: "un escargot", emoji: "🐌" },
      { word: "Elfe", withArticle: "un elfe", emoji: "🧝" },
    ],
    tip: "Escargot et elfe ne commencent pas par le son du nom de la lettre, mais par è [ɛ]. C'est normal : devant deux consonnes (es-car-got, el-fe), le E se prononce è. Pour entendre le son [ə] du nom de la lettre, pensez à petit, cheval ou chemin.",
    faq: {
      question: "Le E se prononce-t-il toujours de la même façon ?",
      answer: "Non. Sans accent, le E peut faire [ə] (petit), [ɛ] (escargot, la mer), ou ne pas se prononcer du tout à la fin d'un mot (une pomme). Avec un accent, il devient é, è ou ê, et chacun a sa page.",
    },
    related: ["e-accent-aigu", "e-accent-grave", "e-accent-circonflexe"],
  },
  {
    slug: "f",
    lower: "f",
    upper: "F",
    name: "effe",
    ipa: "[f]",
    kind: "consonne",
    nameSpoken: "F",
    soundSpoken: "fa, fo, fi. Comme dans fraise, fleur.",
    sound: "Le F fait le son [f] : un souffle entre les dents du haut et la lèvre du bas, comme dans fraise et fleur.",
    words: [
      { word: "Fraise", withArticle: "une fraise", emoji: "🍓" },
      { word: "Fleur", withArticle: "une fleur", emoji: "🌸" },
    ],
    tip: "Le [f] est un son qu'on peut tenir longtemps : ffffff. Jouez à souffler comme le vent pour le faire durer, puis ajoutez une voyelle : fa, fo, fi.",
    faq: {
      question: "Le son [f] s'écrit-il toujours avec un F ?",
      answer: "Le plus souvent, oui. Mais dans quelques mots, comme éléphant ou photo, il s'écrit PH. Les enfants découvrent cette écriture en général au CP.",
    },
    related: ["v"],
  },
  {
    slug: "g",
    lower: "g",
    upper: "G",
    name: "gé",
    ipa: "[g] / [ʒ]",
    kind: "consonne",
    nameSpoken: "G",
    soundSpoken: "ga, go, gu. Comme dans gâteau. ge, gi. Comme dans girafe.",
    sound: "Comme le C, le G a deux sons. Devant a, o et u, il fait [g], comme dans gâteau (ga, go, gu). Devant e, i et y, il fait [ʒ], comme dans girafe (ge, gi).",
    words: [
      { word: "Gâteau", withArticle: "un gâteau", emoji: "🎂" },
      { word: "Girafe", withArticle: "une girafe", emoji: "🦒" },
    ],
    tip: "Montrez d'abord le G dur de gâteau. Girafe arrive ensuite, comme le deuxième son du G : c'est le même son que le J de jouet.",
    faq: {
      question: "Pourquoi écrit-on « gu » dans guitare ?",
      answer: "Pour garder le son [g] devant e ou i, on ajoute un u qui ne se prononce pas : guitare, guêpe. À l'inverse, pour avoir le son [ʒ] devant a ou o, on ajoute un e : pigeon.",
    },
    related: ["j", "c"],
  },
  {
    slug: "h",
    lower: "h",
    upper: "H",
    name: "ache",
    ipa: "muet",
    kind: "consonne",
    nameSpoken: "H",
    soundSpoken: "Le H ne fait pas de bruit. Hibou. Hérisson.",
    sound: "Le H ne fait aucun son : dans hibou et hérisson, on entend directement la voyelle qui suit. C'est une lettre muette.",
    words: [
      { word: "Hibou", withArticle: "un hibou", emoji: "🦉" },
      { word: "Hérisson", withArticle: "un hérisson", emoji: "🦔" },
    ],
    tip: "On dit « le hibou » et « le hérisson », pas « l'hibou » : ces mots commencent par un H dit aspiré, qui empêche la liaison. Avec d'autres mots, comme l'hiver ou l'herbe, on fait l'élision.",
    faq: {
      question: "À quoi sert le H s'il ne se prononce pas ?",
      answer: "Seul, il ne fait pas de son. Mais avec le C, il forme le son [ʃ] de chat et de cheval, et avec le P le son [f] de photo. Les enfants découvrent ces sons au CP.",
    },
  },
  {
    slug: "i",
    lower: "i",
    upper: "I",
    name: "i",
    ipa: "[i]",
    kind: "voyelle",
    nameSpoken: "I",
    soundSpoken: "i. Comme dans iguane, île.",
    sound: "Le I fait le son [i], comme dans iguane et île. On sourit en le disant !",
    words: [
      { word: "Iguane", withArticle: "un iguane", emoji: "🦎" },
      { word: "Île", withArticle: "une île", emoji: "🏝️" },
    ],
    tip: "N'oubliez pas le point du i minuscule : on le pose à la fin, une fois la lettre tracée. Dans île, le I porte un accent circonflexe qui ne change pas le son.",
    faq: {
      question: "Pourquoi île s'écrit-il avec un accent ?",
      answer: "L'accent circonflexe de île remplace un S ancien : on écrivait autrefois « isle ». Il ne change pas le son, on entend toujours [i].",
    },
    related: ["y", ACCENTS_SLUG],
  },
  {
    slug: "j",
    lower: "j",
    upper: "J",
    name: "ji",
    ipa: "[ʒ]",
    kind: "consonne",
    nameSpoken: "J",
    soundSpoken: "ja, jo, ju. Comme dans jus, jouet.",
    sound: "Le J fait le son [ʒ], comme dans jus et jouet. C'est le même son que le G de girafe.",
    words: [
      { word: "Jus", withArticle: "un jus", emoji: "🧃" },
      { word: "Jouet", withArticle: "un jouet", emoji: "🧸" },
    ],
    tip: "Faites durer le son : jjjjj, comme un moteur qui ronronne. Avec la même bouche mais sans faire vibrer la gorge, on obtient le son [ʃ] de chat.",
    faq: {
      question: "Comment savoir s'il faut écrire J ou G ?",
      answer: "Le son [ʒ] s'écrit avec J (jupe, jouet) ou avec G devant e et i (girafe, genou). L'enfant apprend à choisir en lisant et en écrivant souvent les mêmes mots.",
    },
    related: ["g"],
  },
  {
    slug: "k",
    lower: "k",
    upper: "K",
    name: "ka",
    ipa: "[k]",
    kind: "consonne",
    nameSpoken: "K",
    soundSpoken: "ka, ko, ki. Comme dans koala, kangourou.",
    sound: "Le K fait le son [k], comme dans koala et kangourou. C'est le même son que le C de canard.",
    words: [
      { word: "Koala", withArticle: "un koala", emoji: "🐨" },
      { word: "Kangourou", withArticle: "un kangourou", emoji: "🦘" },
    ],
    tip: "Le K est rare en français : on le trouve surtout dans des mots venus d'autres langues (kiwi, koala, kimono). Le son [k] s'écrit bien plus souvent avec C ou QU.",
    faq: {
      question: "Combien y a-t-il de façons d'écrire le son [k] ?",
      answer: "Trois principales : C (canard), QU (quatre) et K (koala). Au CP, les enfants rencontrent surtout C et QU.",
    },
    related: ["c", "q"],
  },
  {
    slug: "l",
    lower: "l",
    upper: "L",
    name: "elle",
    ipa: "[l]",
    kind: "consonne",
    nameSpoken: "L",
    soundSpoken: "la, lo, li. Comme dans lion, lune.",
    sound: "Le L fait le son [l] : le bout de la langue touche le haut, derrière les dents, comme dans lion et lune.",
    words: [
      { word: "Lion", withArticle: "un lion", emoji: "🦁" },
      { word: "Lune", withArticle: "la lune", emoji: "🌙" },
    ],
    tip: "Le L se prononce facilement et se tient longtemps : llll. C'est souvent avec lui que l'enfant lit ses premières syllabes : la, lo, li, lu.",
    faq: {
      question: "Pourquoi « la, lo, li » sont-ils de bons débuts pour lire ?",
      answer: "Parce qu'ils associent deux sons faciles, une consonne qui se tient et une voyelle. Lire la, lo, li, c'est déjà comprendre la syllabe, le cœur de la lecture en français.",
    },
  },
  {
    slug: "m",
    lower: "m",
    upper: "M",
    name: "emme",
    ipa: "[m]",
    kind: "consonne",
    nameSpoken: "M",
    soundSpoken: "ma, mo, mi. Comme dans moto, maison.",
    sound: "Le M fait le son [m] : on ferme la bouche et on fait vibrer, comme dans moto et maison.",
    words: [
      { word: "Moto", withArticle: "une moto", emoji: "🏍️" },
      { word: "Maison", withArticle: "une maison", emoji: "🏠" },
    ],
    tip: "Mmmm, c'est bon ! Le [m] est souvent le premier son des bébés, dans « maman ». Profitez-en pour lire ensemble ma, mi, mo.",
    faq: {
      question: "Comment ne plus confondre m et n ?",
      answer: "Le m minuscule a deux ponts, le n n'en a qu'un. Comptez les bosses ensemble en traçant les lettres : un pont pour le n, deux ponts pour le m.",
    },
    related: ["n"],
  },
  {
    slug: "n",
    lower: "n",
    upper: "N",
    name: "enne",
    ipa: "[n]",
    kind: "consonne",
    nameSpoken: "N",
    soundSpoken: "na, no, ni. Comme dans nuage, nid.",
    sound: "Le N fait le son [n], comme dans nuage et nid : la langue touche le haut, et l'air passe par le nez.",
    words: [
      { word: "Nuage", withArticle: "un nuage", emoji: "☁️" },
      { word: "Nid", withArticle: "un nid", emoji: "🪺" },
    ],
    tip: "Après une voyelle, le N forme parfois un nouveau son : on (ballon), an (maman), in (lapin). On ne l'entend alors plus comme [n]. Ces sons viennent au CP.",
    faq: {
      question: "Pourquoi le D de nid ne se prononce-t-il pas ?",
      answer: "Beaucoup de mots français se terminent par une consonne muette : un nid, un lit, un chat. Pour s'en souvenir, on cherche parfois un mot de la même famille, mais pour nid il faut simplement le retenir.",
    },
    related: ["m"],
  },
  {
    slug: "o",
    lower: "o",
    upper: "O",
    name: "o",
    ipa: "[o] / [ɔ]",
    kind: "voyelle",
    nameSpoken: "O",
    soundSpoken: "o. Comme dans olive, orange.",
    sound: "Le O fait le son [o], comme dans olive et orange. La bouche fait un rond, comme la lettre !",
    words: [
      { word: "Olive", withArticle: "une olive", emoji: "🫒" },
      { word: "Orange", withArticle: "une orange", emoji: "🍊" },
    ],
    tip: "Montrez que la bouche prend la forme de la lettre. Le o se trace en tournant vers la gauche, en partant du haut, comme le a et le d.",
    faq: {
      question: "Le son [o] s'écrit-il toujours avec un O ?",
      answer: "Non : on le trouve aussi dans au (une chaussure) et eau (un bateau). Ces écritures arrivent plus tard, au CP.",
    },
    related: [ACCENTS_SLUG],
  },
  {
    slug: "p",
    lower: "p",
    upper: "P",
    name: "pé",
    ipa: "[p]",
    kind: "consonne",
    nameSpoken: "P",
    soundSpoken: "pa, po, pi. Comme dans pomme, papillon.",
    sound: "Le P fait le son [p] : on serre les lèvres, puis on souffle d'un coup, comme dans pomme et papillon.",
    words: [
      { word: "Pomme", withArticle: "une pomme", emoji: "🍎" },
      { word: "Papillon", withArticle: "un papillon", emoji: "🦋" },
    ],
    tip: "Tenez un mouchoir devant la bouche de l'enfant : avec le [p], il bouge ! Avec le [b], presque pas. Un jeu simple pour sentir la différence.",
    faq: {
      question: "Comment ne plus confondre p et q ?",
      answer: "Le p a son rond à droite du trait, le q à gauche, et le q est presque toujours suivi d'un u. En cursive, les deux lettres se tracent différemment, ce qui aide aussi.",
    },
    related: ["b", "q"],
  },
  {
    slug: "q",
    lower: "q",
    upper: "Q",
    name: "qu",
    ipa: "[k]",
    kind: "consonne",
    nameSpoken: "Q",
    soundSpoken: "qua, quo, qui. Comme dans quatre, quille.",
    sound: "Le Q fait le son [k], comme dans quatre et quille. En français, il est presque toujours suivi d'un U : « qu » se lit [k].",
    words: [
      { word: "Quatre", withArticle: "quatre", emoji: "4️⃣" },
      { word: "Quille", withArticle: "une quille", emoji: "🎳" },
    ],
    tip: "Apprenez « qu » comme un tout : le Q et le U vont ensemble et font [k]. Dans quatre et quille, le U ne se prononce pas.",
    faq: {
      question: "Pourquoi le Q est-il toujours suivi d'un U ?",
      answer: "C'est une habitude héritée du latin. À part quelques mots comme cinq ou coq, où le Q est seul à la fin, on écrit toujours « qu » : qui, quand, quatre.",
    },
    related: ["c", "k", "p"],
  },
  {
    slug: "r",
    lower: "r",
    upper: "R",
    name: "erre",
    ipa: "[ʁ]",
    kind: "consonne",
    nameSpoken: "R",
    soundSpoken: "ra, ro, ri. Comme dans robot, renard.",
    sound: "Le R fait le son [ʁ], qui se fait au fond de la gorge, comme dans robot et renard.",
    words: [
      { word: "Robot", withArticle: "un robot", emoji: "🤖" },
      { word: "Renard", withArticle: "un renard", emoji: "🦊" },
    ],
    tip: "Le R français est difficile pour certains enfants jusqu'à 5 ou 6 ans. Faites-le gronder comme un lion ou ronronner comme un chat, sans insister s'il ne vient pas encore.",
    faq: {
      question: "Mon enfant ne prononce pas encore le R, est-ce grave ?",
      answer: "Le [ʁ] fait partie des derniers sons maîtrisés. S'il n'est toujours pas là vers 6 ans, ou si l'enfant est difficile à comprendre, parlez-en à votre médecin ou à un orthophoniste.",
    },
  },
  {
    slug: "s",
    lower: "s",
    upper: "S",
    name: "esse",
    ipa: "[s] / [z]",
    kind: "consonne",
    nameSpoken: "S",
    soundSpoken: "sa, so, si. Comme dans soleil, serpent.",
    sound: "Le S fait le son [s], comme dans soleil et serpent. Le serpent siffle : ssssss ! Entre deux voyelles, il fait [z], comme dans une rose.",
    words: [
      { word: "Soleil", withArticle: "le soleil", emoji: "☀️" },
      { word: "Serpent", withArticle: "un serpent", emoji: "🐍" },
    ],
    tip: "Entre deux voyelles, le S se prononce [z] : une rose, une maison. Pour garder le son [s], on double le S : un poisson (et non un poison !).",
    faq: {
      question: "Pourquoi le S ne se prononce-t-il pas à la fin des mots ?",
      answer: "À la fin d'un mot, le S est souvent muet : il marque le pluriel (des pommes) ou fait simplement partie du mot (une souris, un tapis).",
    },
    related: ["z", "c-cedille"],
  },
  {
    slug: "t",
    lower: "t",
    upper: "T",
    name: "té",
    ipa: "[t]",
    kind: "consonne",
    nameSpoken: "T",
    soundSpoken: "ta, to, ti. Comme dans tortue, tomate.",
    sound: "Le T fait le son [t] : la langue tape derrière les dents du haut, comme dans tortue et tomate.",
    words: [
      { word: "Tortue", withArticle: "une tortue", emoji: "🐢" },
      { word: "Tomate", withArticle: "une tomate", emoji: "🍅" },
    ],
    tip: "Le T se trace en deux gestes : le grand trait qui descend, puis la barre. En cursive, la barre se pose à la fin du mot, comme le point du i.",
    faq: {
      question: "Le T se prononce-t-il à la fin des mots ?",
      answer: "Souvent non : un chat, un lit, petit. Le T revient au féminin (petite), une astuce pour savoir qu'il faut l'écrire.",
    },
    related: ["d"],
  },
  {
    slug: "u",
    lower: "u",
    upper: "U",
    name: "u",
    ipa: "[y]",
    kind: "voyelle",
    nameSpoken: "U",
    soundSpoken: "u. Comme dans usine, univers, lune, tortue.",
    sound: "Le U fait le son [y], comme dans usine et univers. Pour le dire, on avance les lèvres en rond, comme pour siffler, et on dit « i ».",
    words: [
      { word: "Usine", withArticle: "une usine", emoji: "🏭" },
      { word: "Univers", withArticle: "l'univers", emoji: "🌌" },
    ],
    wordsInside: [
      { word: "Lune", withArticle: "la lune", emoji: "🌙" },
      { word: "Tortue", withArticle: "une tortue", emoji: "🐢" },
    ],
    tip: "Peu de mots d'enfant commencent par U, mais on l'entend partout au milieu des mots : la lune, une tortue, une jupe. Faites-le chercher dans les mots de tous les jours.",
    faq: {
      question: "Quelle différence entre u et ou ?",
      answer: "Le U seul fait [y] (la lune). Avec un O devant, « ou » fait un autre son, [u], comme dans loup. C'est l'un des premiers sons à deux lettres appris au CP.",
    },
    related: ["o", ACCENTS_SLUG],
  },
  {
    slug: "v",
    lower: "v",
    upper: "V",
    name: "vé",
    ipa: "[v]",
    kind: "consonne",
    nameSpoken: "V",
    soundSpoken: "va, vo, vi. Comme dans vache, vélo.",
    sound: "Le V fait le son [v], comme dans vache et vélo : les dents du haut touchent la lèvre du bas, et ça vibre.",
    words: [
      { word: "Vache", withArticle: "une vache", emoji: "🐄" },
      { word: "Vélo", withArticle: "un vélo", emoji: "🚲" },
    ],
    tip: "V et F se font au même endroit. Avec le V, la gorge vibre ; avec le F, non. Posez la main sur la gorge pour sentir la différence.",
    faq: {
      question: "Comment tracer le V ?",
      answer: "En capitale, on trace deux traits obliques qui se rejoignent en bas, sans lever le crayon : on descend, puis on remonte. En cursive, le v minuscule se termine par une petite boucle qui le relie à la lettre suivante.",
    },
    related: ["f", "w"],
  },
  {
    slug: "w",
    lower: "w",
    upper: "W",
    name: "double vé",
    ipa: "[v] / [w]",
    kind: "consonne",
    nameSpoken: "W",
    soundSpoken: "Wagon, avec le son v. Kiwi, avec le son w.",
    sound: "Le W est rare en français. Il fait [v] dans wagon et [w] dans kiwi, comme dans beaucoup de mots venus de l'anglais.",
    words: [
      { word: "Wagon", withArticle: "un wagon", emoji: "🚃" },
      { word: "Kiwi", withArticle: "un kiwi", emoji: "🥝" },
    ],
    tip: "Pas besoin d'y passer beaucoup de temps : le W se trouve surtout dans des mots empruntés (wagon, kiwi, week-end). Son nom, double vé, amuse souvent les enfants.",
    faq: {
      question: "Pourquoi s'appelle-t-il « double vé » ?",
      answer: "Parce qu'il ressemble à deux V collés : VV. En anglais, on l'appelle au contraire « double u ».",
    },
    related: ["v"],
  },
  {
    slug: "x",
    lower: "x",
    upper: "X",
    name: "iks",
    ipa: "[ks]",
    kind: "consonne",
    nameSpoken: "X",
    soundSpoken: "Xylophone. Taxi.",
    sound: "Le X fait le plus souvent le son [ks], comme dans taxi ou xylophone. On le rencontre rarement au début d'un mot.",
    words: [
      { word: "Xylophone", withArticle: "un xylophone", emoji: "🎼" },
      { word: "Taxi", withArticle: "un taxi", emoji: "🚕" },
    ],
    tip: "Le X est plus souvent au milieu ou à la fin des mots qu'au début : taxi, boxe, et il est muet à la fin de deux, des jeux ou des chevaux. Montrez-le surtout dans taxi.",
    faq: {
      question: "Le X se prononce-t-il toujours [ks] ?",
      answer: "Non : il fait [gz] dans exemple, [s] dans six et dix, [z] dans deuxième, et il est muet à la fin de deux ou de chevaux. Pour commencer, retenez surtout [ks].",
    },
  },
  {
    slug: "y",
    lower: "y",
    upper: "Y",
    name: "i grec",
    ipa: "[j] / [i]",
    kind: "voyelle",
    nameSpoken: "Y",
    soundSpoken: "yo, yo. Comme dans yoyo, yeux.",
    sound: "Au début d'un mot, comme dans yoyo et yeux, le Y fait le son [j], celui qu'on entend aussi dans une paille. Au milieu d'un mot, il se prononce souvent [i], comme dans un cygne ou un stylo.",
    words: [
      { word: "Yoyo", withArticle: "un yoyo", emoji: "🪀" },
      { word: "Yeux", withArticle: "les yeux", emoji: "👀" },
    ],
    tip: "Pour l'enfant, il suffit de retenir que le Y ressemble à un I avec deux bras, et qu'il se lit souvent comme un i.",
    faq: {
      question: "Pourquoi l'appelle-t-on « i grec » ?",
      answer: "Les Romains ont emprunté cette lettre à l'alphabet grec pour écrire les mots venus du grec, d'où son nom. En français, on la trouve surtout dans des mots comme cygne, stylo ou yoyo.",
    },
    related: ["i"],
  },
  {
    slug: "z",
    lower: "z",
    upper: "Z",
    name: "zède",
    ipa: "[z]",
    kind: "consonne",
    nameSpoken: "Z",
    soundSpoken: "za, zo, zi. Comme dans zèbre, zéro.",
    sound: "Le Z fait le son [z], comme dans zèbre et zéro. C'est le bruit de l'abeille : zzzzz !",
    words: [
      { word: "Zèbre", withArticle: "un zèbre", emoji: "🦓" },
      { word: "Zéro", withArticle: "zéro", emoji: "0️⃣" },
    ],
    tip: "Le son [z] s'écrit aussi avec un S entre deux voyelles (une rose, une maison). Le Z, lui, se reconnaît facilement grâce à son zigzag.",
    faq: {
      question: "Comment tracer le Z ?",
      answer: "En capitale, en un seul geste : un trait vers la droite, un trait qui descend en biais, puis un trait vers la droite, comme un éclair. En cursive, le z minuscule descend sous la ligne avec une boucle.",
    },
    related: ["s"],
  },
  {
    slug: "e-accent-aigu",
    lower: "é",
    upper: "É",
    name: "e accent aigu",
    ipa: "[e]",
    kind: "voyelle",
    nameSpoken: "é",
    soundSpoken: "é. Comme dans éléphant, étoile.",
    sound: "Le É fait le son [e], comme dans éléphant et étoile. L'accent aigu monte vers la droite.",
    words: [
      { word: "Éléphant", withArticle: "un éléphant", emoji: "🐘" },
      { word: "Étoile", withArticle: "une étoile", emoji: "⭐" },
    ],
    tip: "Le son [e] s'écrit aussi -er et -ez à la fin des mots (manger, le nez). Mais au début des mots, é est le plus fréquent : éléphant, école, étoile.",
    faq: {
      question: "Comment tracer l'accent aigu ?",
      answer: "On trace d'abord la lettre e, puis on ajoute l'accent : un petit trait qui monte de gauche à droite, comme une pente qu'on grimpe.",
    },
    related: ["e", "e-accent-grave", "e-accent-circonflexe", ACCENTS_SLUG],
  },
  {
    slug: "e-accent-grave",
    lower: "è",
    upper: "È",
    name: "e accent grave",
    ipa: "[ɛ]",
    kind: "voyelle",
    nameSpoken: "è",
    soundSpoken: "è. Comme dans chèvre, zèbre.",
    sound: "Le È fait le son [ɛ], comme dans chèvre et zèbre. L'accent grave descend vers la droite.",
    words: [
      { word: "Chèvre", withArticle: "une chèvre", emoji: "🐐" },
      { word: "Zèbre", withArticle: "un zèbre", emoji: "🦓" },
    ],
    tip: "Presque aucun mot ne commence par è : on le trouve au milieu des mots (une chèvre, une flèche, la mère). Le même son s'écrit aussi ê et ai : la forêt, une fraise.",
    faq: {
      question: "Quelle différence entre é et è ?",
      answer: "L'accent aigu (é) fait [e], la bouche presque fermée, comme dans bébé. L'accent grave (è) fait [ɛ], la bouche plus ouverte, comme dans mère. Dites-les l'un après l'autre en exagérant.",
    },
    related: ["e", "e-accent-aigu", "e-accent-circonflexe", ACCENTS_SLUG],
  },
  {
    slug: "e-accent-circonflexe",
    lower: "ê",
    upper: "Ê",
    name: "e accent circonflexe",
    ipa: "[ɛ]",
    kind: "voyelle",
    nameSpoken: "ê",
    soundSpoken: "ê. Comme dans fête, forêt.",
    sound: "Le Ê fait le son [ɛ], comme le è, dans fête et forêt. L'accent circonflexe ressemble à un petit chapeau.",
    words: [
      { word: "Fête", withArticle: "une fête", emoji: "🎉" },
      { word: "Forêt", withArticle: "une forêt", emoji: "🌲" },
    ],
    tip: "L'accent circonflexe remplace souvent un S qui a disparu : forêt et forestier, fête et festival. Une petite histoire que les grands enfants adorent.",
    faq: {
      question: "Le ê et le è font-ils le même son ?",
      answer: "Oui, dans la plupart des mots : fête et chèvre ont le même son [ɛ]. Seule l'écriture change, il faut donc retenir l'orthographe de chaque mot.",
    },
    related: ["e", "e-accent-aigu", "e-accent-grave", ACCENTS_SLUG],
  },
  {
    slug: "c-cedille",
    lower: "ç",
    upper: "Ç",
    name: "c cédille",
    ipa: "[s]",
    kind: "consonne",
    nameSpoken: "c cédille",
    soundSpoken: "ça, ço, çu. Comme dans garçon, glaçon.",
    sound: "Le Ç fait le son [s], comme dans garçon et glaçon. La cédille, la petite queue sous le C, lui dit de faire [s] devant a, o et u.",
    words: [
      { word: "Garçon", withArticle: "un garçon", emoji: "👦" },
      { word: "Glaçon", withArticle: "un glaçon", emoji: "🧊" },
    ],
    tip: "Devant e et i, le C fait déjà [s] tout seul (cerise, citron). La cédille ne sert donc que devant a, o et u : ça, garçon, reçu.",
    faq: {
      question: "Met-on une cédille devant e ou i ?",
      answer: "Jamais : devant e et i, le C se prononce déjà [s]. La cédille ne s'utilise que devant a, o et u, par exemple dans ça, leçon ou reçu.",
    },
    related: ["c", "s", ACCENTS_SLUG],
  },
];

const bySlug = new Map(frenchLetters.map((l) => [l.slug, l]));

/** A French letter by its URL param; "A" works like "a" (as in English). */
export function getFrenchLetter(param: string): FrenchLetter | undefined {
  return bySlug.get(param) ?? (param.length === 1 ? bySlug.get(param.toLowerCase()) : undefined);
}

export const isAccentLetter = (letter: FrenchLetter) => letter.slug.length > 1;

/** Params for /fr/alphabet/[letter]/fiche: every letter, "A" as well as "a". */
export function frenchLetterParams(): string[] {
  return frenchLetters.flatMap((l) => (isAccentLetter(l) ? [l.slug] : [l.slug, l.upper]));
}

/** Previous/next letter, in the order a…z, é, è, ê, ç (wrapping around). */
export function frenchNeighbors(slug: string): { prev: FrenchLetter; next: FrenchLetter } {
  const i = frenchLetters.findIndex((l) => l.slug === slug);
  const n = frenchLetters.length;
  return { prev: frenchLetters[(i - 1 + n) % n], next: frenchLetters[(i + 1) % n] };
}

// Accents that don't get a letter page of their own: they're explained on
// /fr/alphabet/accents. The examples are said aloud by the page.
export type AccentExample = { text: string; emoji: string };
export type AccentGroup = {
  id: string;
  title: string;
  marks: string;
  explanation: string;
  examples: AccentExample[];
};

export const otherAccents: AccentGroup[] = [
  {
    id: "a-grave",
    title: "à, l'accent grave sur le a",
    marks: "à",
    explanation: "Il ne change pas le son : on entend toujours [a]. Il sert à distinguer « à » (je vais à la plage) de « a », le verbe avoir (il a un vélo).",
    examples: [{ text: "à la plage", emoji: "🏖️" }],
  },
  {
    id: "u-grave",
    title: "ù, l'accent grave sur le u",
    marks: "ù",
    explanation: "On ne le trouve que dans un seul mot : où. Il permet de distinguer « où » (où est le chat ?) de « ou » (du pain ou des pâtes). Le son ne change pas.",
    examples: [{ text: "Où est le chat ?", emoji: "🐱" }],
  },
  {
    id: "circonflexe",
    title: "â, î, ô, û : l'accent circonflexe",
    marks: "â î ô û",
    explanation: "Le petit chapeau remplace souvent un S qui a disparu (château vient de castel, île de isle). Sur a, i et u, il ne change presque pas le son. Sur le o, il donne un o fermé, comme dans hôpital.",
    examples: [
      { text: "un château", emoji: "🏰" },
      { text: "une île", emoji: "🏝️" },
      { text: "un hôpital", emoji: "🏥" },
      { text: "une bûche", emoji: "🪵" },
    ],
  },
  {
    id: "trema",
    title: "ë, ï : le tréma",
    marks: "ë ï",
    explanation: "Les deux points disent de prononcer la voyelle toute seule, séparément de la précédente : No-ël, ma-ïs. Sans tréma, on lirait « mais ».",
    examples: [
      { text: "Noël", emoji: "🎄" },
      { text: "du maïs", emoji: "🌽" },
    ],
  },
  {
    id: "oe",
    title: "œ, le « e dans l'o »",
    marks: "œ",
    explanation: "Le o et le e sont collés. Ensemble, ils se prononcent comme « eu » : un cœur, un œuf, ma sœur.",
    examples: [
      { text: "un cœur", emoji: "❤️" },
      { text: "un œuf", emoji: "🥚" },
    ],
  },
];
