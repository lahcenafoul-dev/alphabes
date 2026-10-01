// The French school-level hubs: /fr/maternelle (petite et moyenne section,
// 3-5 ans) and /fr/grande-section (5-6 ans), and their topic pages. Written
// for French-speaking parents, not translated from the English hubs.
//
// Topics with an English twin (`en`) are also paired in TRANSLATED_PARAMS
// (lib/i18n/routes.ts); tests check that the two agree.
import type { AppPathname } from "@/i18n/routing";

export type SchoolLevel = "maternelle" | "grande-section";

export type TopicLink = { label: string; pathname: AppPathname; params?: Record<string, string> };

export type SchoolTopic = {
  level: SchoolLevel;
  slug: string;
  /** The English topic's slug, when there is one. */
  en?: string;
  title: string;
  metaTitle: string;
  summary: string;
  emoji: string;
  intro: string[];
  tips: string[];
  activity: { title: string; material: string; steps: string[] };
  links: TopicLink[];
};

const fiches = (category: string, label: string): TopicLink => ({
  label,
  pathname: "/worksheets/[category]",
  params: { category },
});
const game = (slug: string, label: string): TopicLink => ({ label, pathname: "/games/[slug]", params: { slug } });
const sound = (skill: string, label: string): TopicLink => ({ label, pathname: "/phonics/[skill]", params: { skill } });

export const schoolTopics: SchoolTopic[] = [
  // ------------------------------------------------------------ maternelle
  {
    level: "maternelle",
    slug: "graphisme",
    title: "Le graphisme en maternelle",
    metaTitle: "Le graphisme en maternelle : préparer la main à l'écriture",
    summary: "Traits, ronds, ponts et boucles : les gestes qui préparent à l'écriture, bien avant les lettres.",
    emoji: "〰️",
    intro: [
      "Avant d'écrire des lettres, la main apprend des gestes : tirer un trait de haut en bas, tourner un rond dans le bon sens, enchaîner des ponts et des vagues. C'est le graphisme, une activité centrale de la petite et de la moyenne section.",
      "Ces gestes sont les morceaux des lettres de demain : le rond deviendra le o et le a, le pont deviendra le n et le m, la boucle deviendra le l et le e de la cursive. Un enfant qui les maîtrise apprendra à écrire avec beaucoup moins d'effort.",
    ],
    tips: [
      "Commencez en grand, debout : au tableau, sur une grande feuille au mur, dans le sable ou dans la mousse à raser. Le petit format vient après.",
      "Les ronds se tournent dans le sens inverse des aiguilles d'une montre, comme on écrira le o et le a. Montrez le départ « en haut, vers la gauche ».",
      "Un gros feutre ou une craie épaisse se tiennent plus facilement qu'un crayon fin.",
      "Nommez les gestes : « je descends », « je monte et je redescends », « je fais une boucle ». Les mots aident la main à retenir.",
    ],
    activity: {
      title: "Les vagues de la mer",
      material: "Une grande feuille, des feutres bleus, un petit bateau dessiné ou découpé.",
      steps: [
        "Dessinez une ligne de mer en bas de la feuille.",
        "L'enfant fait avancer le bateau sur des vagues : des ponts qui montent et redescendent, sans lever le feutre.",
        "Faites ensuite des vagues plus petites, puis des boucles « quand la mer s'agite ».",
        "Terminez par un soleil : un rond, puis des traits tout autour.",
      ],
    },
    links: [
      game("trace-la-lettre", "Jeu : trace la lettre"),
      fiches("formes", "Fiches des formes"),
      { label: "Activités à faire à la maison", pathname: "/activities" },
    ],
  },
  {
    level: "maternelle",
    slug: "tracer-les-lettres",
    en: "letter-tracing",
    title: "Tracer les lettres en maternelle",
    metaTitle: "Tracer les lettres en maternelle : capitales d'abord, sans stress",
    summary: "Les capitales d'abord, en suivant des pointillés, pour apprendre la forme et le sens de chaque lettre.",
    emoji: "✏️",
    intro: [
      "En petite et moyenne section, on écrit d'abord en capitales d'imprimerie (A, B, C) : ce sont des traits et des ronds, plus faciles à tracer que les lettres attachées. Le prénom de l'enfant est en général le premier mot qu'il apprend à écrire.",
      "Tracer en suivant des pointillés apprend la forme de la lettre et l'ordre des gestes. L'important n'est pas un tracé parfait, mais de partir du bon endroit et d'aller dans le bon sens.",
    ],
    tips: [
      "Deux ou trois lettres par séance suffisent. Commencez par celles du prénom.",
      "Montrez le point de départ : la plupart des capitales commencent en haut.",
      "Laissez l'enfant tracer d'abord avec le doigt, puis avec un gros crayon.",
      "Un trait qui sort des pointillés n'est pas grave : la précision vient avec le temps.",
    ],
    activity: {
      title: "Le prénom en pâte à modeler",
      material: "De la pâte à modeler, une feuille avec le prénom écrit en grandes capitales.",
      steps: [
        "Écrivez le prénom de l'enfant en très grandes capitales sur une feuille.",
        "L'enfant roule des boudins de pâte à modeler et les pose sur chaque trait des lettres.",
        "Ensuite, il suit les lettres avec le doigt, en disant leur nom.",
        "Enfin, il les trace au crayon, à côté du modèle.",
      ],
    },
    links: [
      fiches("trace-des-lettres", "Fiches de tracé des lettres"),
      game("trace-la-lettre", "Jeu : trace la lettre"),
      { label: "L'alphabet, lettre par lettre", pathname: "/alphabet" },
    ],
  },
  {
    level: "maternelle",
    slug: "coloriage",
    en: "coloring",
    title: "Coloriage des lettres en maternelle",
    metaTitle: "Coloriage des lettres en maternelle : apprendre l'alphabet en coloriant",
    summary: "Colorier une grande lettre et ses images : la main s'exerce et la lettre devient familière.",
    emoji: "🖍️",
    intro: [
      "Colorier, c'est déjà travailler la main : tenir le crayon, rester à peu près dans la forme, changer de couleur. Ce sont les mêmes muscles que pour écrire.",
      "Quand le coloriage montre une grande lettre et des images qui commencent par cette lettre, l'enfant la regarde longtemps et en parle : il apprend sans s'en rendre compte.",
    ],
    tips: [
      "Laissez l'enfant choisir ses couleurs : le but est de s'exercer, pas de faire « juste ».",
      "Un coloriage n'a pas besoin d'être fini. Dix minutes, c'est très bien.",
      "Pendant qu'il colorie, nommez la lettre et les images : « B, comme ballon ».",
      "Des crayons de couleur bien taillés ou des feutres pointe moyenne sont plus faciles à contrôler que les gros feutres.",
    ],
    activity: {
      title: "La chasse aux couleurs",
      material: "Une fiche de coloriage, des crayons de couleur.",
      steps: [
        "Imprimez le coloriage d'une lettre, par exemple le B.",
        "Demandez : « Colorie le ballon en rouge, la banane en jaune. »",
        "Coloriez la grande lettre en dernier, en disant son nom ensemble.",
        "Affichez la fiche : l'enfant la montrera à toute la famille.",
      ],
    },
    links: [
      fiches("coloriage-des-lettres", "Fiches de coloriage des lettres"),
      fiches("couleurs", "Fiches des couleurs"),
      { label: "L'imagier", pathname: "/flashcards" },
    ],
  },
  // --------------------------------------------------------- grande section
  {
    level: "grande-section",
    slug: "syllabes",
    title: "Les syllabes en grande section",
    metaTitle: "Les syllabes en grande section : frapper, compter, assembler",
    summary: "Découper les mots en syllabes à l'oral, puis assembler une consonne et une voyelle : ma, li, to.",
    emoji: "👏",
    intro: [
      "En grande section, l'enfant apprend à entendre que les mots sont faits de morceaux : les syllabes. « Ca-na-pé » en a trois, « chat » une seule. Ce travail à l'oral est la base de la lecture.",
      "Vers la fin de l'année, beaucoup d'enfants commencent à assembler une consonne et une voyelle : m et a font « ma ». C'est le cœur de la lecture en français, qui se poursuit au CP.",
    ],
    tips: [
      "Frappez les syllabes dans les mains en disant le mot : to-ma-te, trois tapes.",
      "Commencez par les prénoms de la famille : chacun compte les syllabes du sien.",
      "Pour assembler, faites « glisser » le son : « mmmmm… a… ma ! ». Les consonnes qui durent (m, l, r, s, f, v) sont les plus faciles.",
      "Restez à l'oral tant que l'enfant ne connaît pas encore bien les lettres.",
    ],
    activity: {
      title: "Le panier des syllabes",
      material: "Un panier et quelques objets de la maison (cuillère, ballon, chaussette…).",
      steps: [
        "Sortez un objet du panier et dites son nom.",
        "L'enfant frappe les syllabes et les compte : bal-lon, deux syllabes.",
        "Rangez les objets en tas : une syllabe, deux syllabes, trois syllabes.",
        "Pour les plus grands : trouvez un objet dont le nom commence par la même syllabe (ba-teau, ba-nane).",
      ],
    },
    links: [
      sound("syllabes", "Fabriquer des syllabes (page des sons)"),
      fiches("syllabes", "Fiches des syllabes"),
      game("premier-son", "Jeu : le premier son"),
    ],
  },
  {
    level: "grande-section",
    slug: "mots-outils",
    en: "sight-words",
    title: "Les mots-outils en grande section",
    metaTitle: "Les mots-outils en grande section : le, la, un, et, est…",
    summary: "Les petits mots très fréquents (le, la, un, et, est) qu'on apprend à reconnaître d'un coup d'œil.",
    emoji: "🧩",
    intro: [
      "Les mots-outils sont les petits mots qui reviennent dans presque toutes les phrases : le, la, les, un, une, et, est, il, elle… Les reconnaître d'un coup d'œil permet de lire une phrase sans s'arrêter à chaque mot.",
      "En grande section, on en découvre quelques-uns, souvent dans les phrases de la classe ou dans les albums. Au CP, on en apprend beaucoup plus, en même temps que les sons.",
    ],
    tips: [
      "Trois ou quatre mots à la fois, pas plus. On en ajoute quand ceux-là sont bien connus.",
      "Cherchez-les dans un livre ou sur un emballage : « Où est le mot le ? ».",
      "Écrivez-les sur des étiquettes et collez-les sur le frigo.",
      "Faites des phrases avec les mots-outils et les prénoms de la famille : « Papa et Léa ».",
    ],
    activity: {
      title: "Le loto des petits mots",
      material: "Des étiquettes avec quatre mots-outils écrits deux fois, des jetons ou des pâtes.",
      steps: [
        "Écrivez quatre mots-outils (le, la, un, et) sur une grille, et les mêmes sur des étiquettes.",
        "Tirez une étiquette et lisez le mot à voix haute.",
        "L'enfant pose un jeton sur le même mot dans sa grille.",
        "Quand il connaît les mots, c'est lui qui tire et lit les étiquettes.",
      ],
    },
    links: [
      sound("mots-outils", "Les mots-outils (page des sons)"),
      fiches("mots-outils", "Fiches des mots-outils"),
      { label: "Les histoires à lire", pathname: "/stories" },
    ],
  },
  {
    level: "grande-section",
    slug: "ecriture-cursive",
    en: "handwriting",
    title: "L'écriture cursive en grande section",
    metaTitle: "L'écriture cursive en grande section : les lettres attachées",
    summary: "Passer des capitales aux lettres attachées, sur les lignes du cahier, en commençant par les boucles.",
    emoji: "✍️",
    intro: [
      "En grande section, on commence l'écriture cursive : les lettres attachées qu'on écrira à l'école jusqu'au bout. Elle s'apprend sur des lignes (souvent le grand carreau Seyès), en respectant la hauteur de chaque lettre.",
      "On commence par les lettres faites de boucles et de ponts (e, l, i, u, n, m), puis on écrit son prénom et de petits mots. Chaque lettre a un point de départ et un sens : c'est ce qui permet ensuite de les attacher.",
    ],
    tips: [
      "Assis bien droit, les pieds au sol, la feuille un peu penchée : la position compte autant que la lettre.",
      "Le crayon se tient entre le pouce et l'index, posé sur le majeur, sans serrer.",
      "Faites d'abord la lettre en grand, dans l'air ou sur une ardoise, avant de l'écrire sur les lignes.",
      "Des séances courtes et fréquentes valent mieux qu'une longue page de lignes.",
    ],
    activity: {
      title: "Les boucles sur l'ardoise",
      material: "Une ardoise et un feutre effaçable, ou une feuille et un crayon.",
      steps: [
        "Tracez une ligne et faites ensemble une rangée de petites boucles (comme des e), sans lever le crayon.",
        "Puis une rangée de grandes boucles (comme des l).",
        "Alternez : petite boucle, grande boucle. On vient d'écrire « el » !",
        "Terminez en écrivant le prénom de l'enfant en cursive, qu'il repasse au feutre.",
      ],
    },
    links: [
      fiches("ecriture-cursive", "Fiches d'écriture cursive"),
      game("trace-la-lettre", "Jeu : trace la lettre (en cursive)"),
      { label: "L'alphabet, lettre par lettre", pathname: "/alphabet" },
    ],
  },
];

export function topicsOf(level: SchoolLevel): SchoolTopic[] {
  return schoolTopics.filter((t) => t.level === level);
}

export function getSchoolTopic(level: SchoolLevel, slug: string): SchoolTopic | undefined {
  return schoolTopics.find((t) => t.level === level && t.slug === slug);
}

// ---------------------------------------------------------------- hubs

export type SchoolHub = {
  pathname: "/preschool" | "/kindergarten";
  topicPathname: "/preschool/[topic]" | "/kindergarten/[topic]";
  name: string;
  title: string;
  metaTitle: string;
  description: string;
  age: string;
  intro: string;
  learns: { title: string; text: string }[];
  resources: TopicLink[];
  faq: { question: string; answer: string }[];
};

export const SCHOOL_HUBS: Record<SchoolLevel, SchoolHub> = {
  maternelle: {
    pathname: "/preschool",
    topicPathname: "/preschool/[topic]",
    name: "Petite et moyenne section",
    title: "Apprendre en petite et moyenne section de maternelle",
    metaTitle: "Petite et moyenne section : activités pour apprendre les lettres (3-5 ans)",
    description:
      "Graphisme, tracé des lettres en capitales, coloriage et premiers sons : des idées et des fiches pour accompagner un enfant de petite et moyenne section, à la maison.",
    age: "3-5 ans",
    intro:
      "En petite et moyenne section, on apprend en jouant : on parle beaucoup, on reconnaît son prénom, on découvre quelques lettres et on prépare sa main à écrire. Rien ne presse : chaque enfant avance à son rythme. Voici de quoi l'accompagner à la maison, en douceur.",
    learns: [
      { title: "Parler et écouter", text: "Enrichir son vocabulaire, raconter, jouer avec les mots et les comptines." },
      { title: "Reconnaître les lettres", text: "Celles de son prénom d'abord, en capitales, puis d'autres lettres de l'alphabet." },
      { title: "Préparer la main", text: "Graphisme, coloriage, pâte à modeler : les gestes qui serviront pour écrire." },
      { title: "Entendre les sons", text: "Trouver les mots qui riment, frapper les syllabes, entendre le début d'un mot." },
    ],
    resources: [
      { label: "L'alphabet", pathname: "/alphabet" },
      { label: "L'imagier", pathname: "/flashcards" },
      { label: "Les jeux", pathname: "/games" },
      { label: "Les activités", pathname: "/activities" },
      { label: "Les fiches à imprimer", pathname: "/worksheets" },
    ],
    faq: [
      {
        question: "Mon enfant doit-il connaître l'alphabet en sortant de moyenne section ?",
        answer:
          "Non. À cet âge, reconnaître quelques lettres, surtout celles de son prénom, est déjà très bien. La connaissance de toutes les lettres se construit en grande section.",
      },
      {
        question: "Faut-il apprendre à écrire en cursive dès la petite section ?",
        answer:
          "Non. En petite et moyenne section, on travaille le graphisme et les capitales. La cursive commence en général en grande section, quand la main est prête.",
      },
      {
        question: "Combien de temps par jour ?",
        answer:
          "Quelques minutes suffisent, quand l'enfant en a envie. Une comptine, une lettre cherchée dans un livre ou un coloriage, c'est déjà beaucoup.",
      },
      {
        question: "Mon enfant de 3 ans ne tient pas bien son crayon. Est-ce grave ?",
        answer:
          "Non, c'est normal. La pâte à modeler, les pinces à linge, les gommettes et les gros crayons musclent la main petit à petit. La bonne prise du crayon se met en place vers 4 ou 5 ans.",
      },
    ],
  },
  "grande-section": {
    pathname: "/kindergarten",
    topicPathname: "/kindergarten/[topic]",
    name: "Grande section",
    title: "Apprendre en grande section de maternelle",
    metaTitle: "Grande section : lettres, syllabes et écriture cursive (5-6 ans)",
    description:
      "Toutes les lettres, les syllabes, les premiers mots-outils et l'écriture cursive : des idées, des jeux et des fiches pour la grande section, l'année qui prépare au CP.",
    age: "5-6 ans",
    intro:
      "La grande section prépare au CP. L'enfant apprend à reconnaître toutes les lettres, à entendre les syllabes et les sons, et commence à écrire en cursive. C'est une année charnière, mais elle reste une année de maternelle : on apprend toujours en jouant.",
    learns: [
      { title: "Toutes les lettres", text: "Le nom des 26 lettres, en capitales, en script et en cursive, et le son de la plupart d'entre elles." },
      { title: "Les syllabes et les sons", text: "Découper les mots en syllabes, trouver le premier son, et assembler ses premières syllabes." },
      { title: "L'écriture cursive", text: "Les lettres attachées sur les lignes du cahier, son prénom et quelques petits mots." },
      { title: "Les premiers mots", text: "Reconnaître quelques mots-outils (le, la, un, et) et des mots familiers." },
    ],
    resources: [
      { label: "L'alphabet", pathname: "/alphabet" },
      { label: "Les sons", pathname: "/phonics" },
      { label: "Les jeux", pathname: "/games" },
      { label: "Les histoires", pathname: "/stories" },
      { label: "Les fiches à imprimer", pathname: "/worksheets" },
    ],
    faq: [
      {
        question: "Mon enfant doit-il savoir lire à la fin de la grande section ?",
        answer:
          "Non. On apprend à lire au CP. En fin de grande section, on attend surtout que l'enfant connaisse les lettres, entende les syllabes et quelques sons. Certains enfants lisent déjà quelques syllabes, d'autres non : les deux sont normaux.",
      },
      {
        question: "Script ou cursive : que travailler à la maison ?",
        answer:
          "Suivez l'école. En grande section, la cursive s'apprend en classe, avec un modèle précis. À la maison, faites des boucles et des ponts, et écrivez le prénom comme la maîtresse ou le maître l'écrit.",
      },
      {
        question: "Comment préparer mon enfant au CP ?",
        answer:
          "Lisez-lui des histoires chaque jour, jouez avec les sons (« qu'est-ce qui commence comme papa ? »), et laissez-le écrire sa liste de courses ou une carte. Le plaisir des livres compte plus que l'avance.",
      },
      {
        question: "Et si mon enfant confond encore des lettres (b et d) ?",
        answer:
          "C'est très courant jusqu'au CP, et même après. Travaillez une lettre à la fois, avec un repère (le b a « le ventre devant ») et le jeu « Trouve la lettre ».",
      },
    ],
  },
};
