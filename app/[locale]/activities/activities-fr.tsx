import type { Metadata } from "next";
import Link from "next/link";
import { absoluteUrl, alternatesFor, localizedPath } from "@/lib/i18n/routes";
import { buildBreadcrumbJsonLd } from "@/lib/json-ld";

const title = "Activités pour apprendre les lettres et les sons, sans écran";
const description =
  "Huit activités faciles à faire à la maison ou en classe, avec ce qu'on a sous la main : chasse aux lettres, pâte à modeler, plateau de semoule, sac à sons, loto, mémory… De la petite section au CP.";

export const activitiesMetadataFr: Metadata = {
  title,
  description,
  alternates: alternatesFor("fr", "/activities"),
  openGraph: { title, description, url: absoluteUrl("fr", "/activities") },
};

type Activity = {
  id: string;
  emoji: string;
  title: string;
  age: string;
  summary: string;
  material: string;
  steps: string[];
  link: { label: string; href: string };
};

const fiches = (category: string) => localizedPath("fr", "/worksheets/[category]", { category });

const activities: Activity[] = [
  {
    id: "chasse-aux-lettres",
    emoji: "🔎",
    title: "La chasse aux lettres",
    age: "3-6 ans",
    summary: "Retrouver les lettres de son prénom dans des magazines, les découper et les coller.",
    material: "Des vieux magazines ou prospectus, des ciseaux à bouts ronds, de la colle, une feuille.",
    steps: [
      "Écrivez le prénom de l'enfant en capitales en haut de la feuille.",
      "Ensemble, cherchez chaque lettre du prénom dans les magazines.",
      "L'enfant découpe (ou déchire) les lettres trouvées et les colle sous le modèle, dans l'ordre.",
      "Relisez le prénom en montrant chaque lettre du doigt.",
    ],
    link: { label: "Jeu : trouve la lettre", href: localizedPath("fr", "/games/[slug]", { slug: "trouve-la-lettre" }) },
  },
  {
    id: "pate-a-modeler",
    emoji: "🟠",
    title: "Les lettres en pâte à modeler",
    age: "3-5 ans",
    summary: "Rouler des boudins et former les lettres sur un grand modèle.",
    material: "De la pâte à modeler, des modèles de lettres en grand (une fiche de tracé fait l'affaire).",
    steps: [
      "Posez le modèle d'une lettre devant l'enfant.",
      "Il roule des boudins de pâte et les pose sur chaque trait de la lettre.",
      "Il suit ensuite la lettre en pâte avec le doigt, en disant son nom.",
      "Pour les grands : former la lettre sans modèle, puis un petit mot.",
    ],
    link: { label: "Fiches de tracé des lettres", href: fiches("trace-des-lettres") },
  },
  {
    id: "plateau-semoule",
    emoji: "🏖️",
    title: "Écrire dans la semoule",
    age: "3-6 ans",
    summary: "Tracer les lettres du doigt dans un plateau de semoule, de sable ou de sel.",
    material: "Un plateau ou une boîte plate, de la semoule (ou du sable, du sel), des cartes de lettres.",
    steps: [
      "Versez une fine couche de semoule dans le plateau.",
      "Montrez une carte de lettre et tracez-la du doigt dans la semoule, en partant du bon endroit.",
      "L'enfant la trace à son tour. On secoue le plateau pour effacer.",
      "Variante : vous tracez une lettre, l'enfant devine laquelle.",
    ],
    link: { label: "Jeu : trace la lettre", href: localizedPath("fr", "/games/[slug]", { slug: "trace-la-lettre" }) },
  },
  {
    id: "sac-a-sons",
    emoji: "👜",
    title: "Le sac à sons",
    age: "4-6 ans",
    summary: "Trier des objets de la maison selon le son qu'on entend au début de leur nom.",
    material: "Un sac, une dizaine de petits objets (balle, bouchon, peigne, pomme, livre…), deux boîtes.",
    steps: [
      "Choisissez deux sons bien différents, par exemple [b] et [p], et marquez une boîte pour chacun.",
      "L'enfant pioche un objet dans le sac et dit son nom à voix haute.",
      "Il écoute le début du mot et range l'objet dans la bonne boîte.",
      "Vérifiez ensemble en redisant les mots : « bbbouchon », « ppppeigne ».",
    ],
    link: { label: "Jeu : le premier son", href: localizedPath("fr", "/games/[slug]", { slug: "premier-son" }) },
  },
  {
    id: "loto-des-lettres",
    emoji: "🎲",
    title: "Le loto des lettres",
    age: "4-6 ans",
    summary: "Un loto fait maison pour reconnaître les lettres en jouant à plusieurs.",
    material: "Des grilles de 6 cases avec des lettres, des petits cartons avec les mêmes lettres, des jetons.",
    steps: [
      "Chaque joueur reçoit une grille de six lettres.",
      "On tire un carton et on dit le nom de la lettre.",
      "Celui qui a la lettre sur sa grille pose un jeton dessus.",
      "Le premier qui remplit sa grille gagne. Pour les grands, on dit le son au lieu du nom.",
    ],
    link: { label: "Fiches de reconnaissance des lettres", href: fiches("reconnaissance-des-lettres") },
  },
  {
    id: "syllabes-en-sautant",
    emoji: "🦘",
    title: "Les syllabes en sautant",
    age: "5-6 ans",
    summary: "Faire un saut par syllabe : le corps aide à entendre les morceaux des mots.",
    material: "Rien, ou des cerceaux posés au sol.",
    steps: [
      "Dites un mot : « ba-na-ne ».",
      "L'enfant fait un saut (ou passe d'un cerceau à l'autre) à chaque syllabe.",
      "Il compte ses sauts : trois sauts, trois syllabes.",
      "Essayez avec les prénoms de la famille, puis avec des mots longs : « hip-po-po-ta-me » !",
    ],
    link: { label: "Fabriquer des syllabes", href: localizedPath("fr", "/phonics/[skill]", { skill: "syllabes" }) },
  },
  {
    id: "coloriage-magique",
    emoji: "🎨",
    title: "Le coloriage de la lettre",
    age: "3-5 ans",
    summary: "Colorier une grande lettre et les images dont le nom commence par elle.",
    material: "Une fiche de coloriage imprimée, des crayons de couleur.",
    steps: [
      "Imprimez le coloriage d'une lettre, par exemple le M.",
      "Nommez ensemble les images : maison, moto…",
      "L'enfant colorie, avec les couleurs de son choix.",
      "Il colorie la grande lettre en dernier, en disant son nom.",
    ],
    link: { label: "Fiches de coloriage des lettres", href: fiches("coloriage-des-lettres") },
  },
  {
    id: "memory-capitales-minuscules",
    emoji: "🃏",
    title: "Le mémory capitale-minuscule",
    age: "5-7 ans",
    summary: "Retrouver les paires A-a, B-b… pour relier les deux écritures d'une lettre.",
    material: "Des cartes faites maison : une lettre en capitale sur l'une, la même en minuscule sur l'autre.",
    steps: [
      "Préparez 6 à 10 paires de cartes et retournez-les, face cachée.",
      "Chacun son tour, on retourne deux cartes en disant le nom des lettres.",
      "Si c'est la même lettre (A et a), on garde la paire et on rejoue.",
      "Celui qui a le plus de paires à la fin gagne.",
    ],
    link: { label: "L'alphabet, lettre par lettre", href: localizedPath("fr", "/alphabet") },
  },
];

export default function ActivitiesFr() {
  const url = absoluteUrl("fr", "/activities");
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Accueil", url: absoluteUrl("fr", "/") },
    { name: "Activités", url },
  ]);
  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Activités pour apprendre les lettres et les sons",
    itemListElement: activities.map((a, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: a.title,
      url: `${url}#${a.id}`,
    })),
  };

  return (
    <main id="main-content" className="mx-auto max-w-5xl px-6 py-12">
      <nav aria-label="Fil d'Ariane" className="text-sm text-chalkboard/60">
        <ol className="flex gap-2">
          <li><Link href={localizedPath("fr", "/")}>Accueil</Link> /</li>
          <li aria-current="page" className="font-bold">Activités</li>
        </ol>
      </nav>

      <h1 className="mt-6 text-4xl font-extrabold">Activités pour apprendre, sans écran</h1>
      <p className="mt-2 text-chalkboard/70 max-w-2xl">
        Des idées simples, avec ce qu&apos;on a à la maison, pour accompagner les lettres et les sons
        de la semaine. Chaque activité prend dix à quinze minutes et se fait aussi bien en famille
        qu&apos;en classe.
      </p>

      <ul className="mt-8 grid sm:grid-cols-2 gap-5">
        {activities.map((a) => (
          <li key={a.id} id={a.id} className="flex flex-col rounded-block border border-chalkboard/10 p-6 shadow-block scroll-mt-24">
            <div className="flex items-start justify-between gap-3">
              <h2 className="font-display font-bold text-lg">
                <span aria-hidden="true">{a.emoji} </span>
                {a.title}
              </h2>
              <span className="shrink-0 rounded-full bg-crayon-yellow/25 px-3 py-1 text-xs font-bold">{a.age}</span>
            </div>
            <p className="mt-2 text-sm text-chalkboard/70">{a.summary}</p>
            <p className="mt-3 text-sm">
              <strong>Matériel :</strong> {a.material}
            </p>
            <ol className="mt-3 space-y-1 list-decimal list-inside text-sm text-chalkboard/80">
              {a.steps.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ol>
            <Link href={a.link.href} className="mt-auto pt-4 text-sm font-bold text-crayon-blue underline underline-offset-2">
              {a.link.label} →
            </Link>
          </li>
        ))}
      </ul>

      <Link
        href={localizedPath("fr", "/worksheets")}
        className="mt-8 inline-block rounded-block bg-crayon-green text-paper font-display font-bold px-5 py-2.5 shadow-block hover:shadow-blockHover transition"
      >
        Les fiches à imprimer
      </Link>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }} />
    </main>
  );
}
