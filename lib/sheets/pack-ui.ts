// The words of the Pro pack pages (components/sheets/ProPacks.tsx): the pack
// page, the packs section of the bundles listing, and the small "get the
// pack" box on the worksheet type and sheet pages. Kept here, like
// lib/sheets/ui.ts, because only these pages use them.
import type { Pack } from "./packs";
import type { SheetLocale } from "./types";

export type PackUi = {
  home: string;
  hub: string;
  bundles: string;
  breadcrumb: string;
  /** The page's h1. */
  title: (kindName: string, pack: Pack, name: string) => string;
  /** Added to the h1 in the <title>. */
  metaSuffix: string;
  description: (kindName: string, items: number, ages: string, keys: boolean) => string;
  megaDescription: (items: number, kinds: number) => string;
  ages: (from: number, to: number) => string;
  /** Sheets in a pack, or puzzles, card sets, models. */
  items: (n: number, kind: string) => string;
  keys: string;
  certificate: string;
  papers: string;
  inside: string;
  extras: string[];
  keysExtra: string;
  parts: string;
  part: (n: number, name: string) => string;
  previewCover: string;
  previewSheet: string;
  previewKey: string;
  download: string;
  downloadNote: string;
  paperName: Record<"letter" | "a4", string>;
  defaultPaper: string;
  fileInfo: (pages: number, mb: string) => string;
  notPro: string;
  /** The packs section on the bundles listing. */
  sectionTitle: string;
  sectionIntro: string;
  megaGroup: string;
  completeGroup: string;
  levelGroup: string;
  /** The box on the worksheet type and sheet pages. */
  upsell: (n: number, kindName: string, keys: boolean) => string;
  upsellCta: string;
  /** The banner on the worksheets hub. */
  promoCta: string;
};

export const PACK_UI: Record<SheetLocale, PackUi> = {
  en: {
    home: "Home",
    hub: "Worksheets",
    bundles: "Bundles",
    breadcrumb: "Breadcrumb",
    title: (kind, pack, name) => (pack.scope === "mega" ? "Mega Pack: Every Worksheet Type" : pack.scope === "complete" ? `${kind} Complete Pack` : `${kind} Pack: ${name}`),
    metaSuffix: "Printable PDF (AlphaBes Pro)",
    description: (kind, n, ages, keys) =>
      `${n} ${kind} worksheets in one print-ready PDF, from easy to hard, with a contents page, tips for parents${keys ? ", answer keys" : ""} and a certificate. ${ages}. US Letter or A4.`,
    megaDescription: (n, kinds) => `All ${kinds} AlphaBes worksheet types in one pack: ${n} worksheets in five print-ready PDFs, with answer keys, tips for parents and certificates. US Letter or A4.`,
    ages: (a, b) => `Ages ${a}–${b}`,
    items: (n, kind) => `${n} ${kind === "sliding-puzzles" ? "sliding puzzles" : kind === "flash-cards" ? "flash card sets" : kind === "origami" ? "origami models" : "worksheets"}`,
    keys: "Answer keys",
    certificate: "Certificate",
    papers: "US Letter and A4",
    inside: "What's inside",
    extras: ["A cover and a contents page with page numbers", "“How to use this pack”: tips for parents and teachers", "The worksheets, from easy to hard, each with a Name/Date line"],
    keysExtra: "Answer keys at the end, with the answers in red",
    parts: "The five parts",
    part: (n, name) => `Part ${n}: ${name}`,
    previewCover: "Cover of the pack",
    previewSheet: "A page from the pack",
    previewKey: "An answer key page",
    download: "Download the pack",
    downloadNote: "Included with AlphaBes Pro. Every worksheet also stays free on its own page.",
    paperName: { letter: "US Letter", a4: "A4" },
    defaultPaper: "recommended",
    fileInfo: (pages, mb) => `${pages} pages · ${mb} MB`,
    notPro: "Not Pro yet? See plans",
    sectionTitle: "AlphaBes Pro packs",
    sectionIntro: "Every worksheet of a type in one tidy PDF, with a contents page, tips for parents, answer keys and a certificate. Included with AlphaBes Pro.",
    megaGroup: "Everything in one pack",
    completeGroup: "Complete packs",
    levelGroup: "Smaller packs by level or theme",
    upsell: (n, kind, keys) => `Want all ${n} ${kind} worksheets in one PDF${keys ? ", with answer keys" : ""}?`,
    upsellCta: "Get the pack (Pro)",
    promoCta: "See the Pro packs",
  },
  fr: {
    home: "Accueil",
    hub: "Fiches",
    bundles: "Packs",
    breadcrumb: "Fil d'Ariane",
    title: (kind, pack, name) => (pack.scope === "mega" ? "Méga pack : tous les types de fiches" : pack.scope === "complete" ? `${kind} : le pack complet` : `Pack ${kind} : ${name}`),
    metaSuffix: "PDF à imprimer (AlphaBes Pro)",
    description: (kind, n, ages, keys) =>
      `${n} fiches « ${kind} » dans un seul PDF prêt à imprimer, de la plus facile à la plus difficile, avec un sommaire, des conseils aux parents${keys ? ", les corrigés" : ""} et un diplôme. ${ages}. Format A4 ou Letter.`,
    megaDescription: (n, kinds) => `Les ${kinds} types de fiches AlphaBes réunis : ${n} fiches en cinq PDF prêts à imprimer, avec les corrigés, des conseils aux parents et des diplômes. Format A4 ou Letter.`,
    ages: (a, b) => `De ${a} à ${b} ans`,
    items: (n, kind) => `${n} ${kind === "sliding-puzzles" ? "taquins" : kind === "flash-cards" ? "jeux de cartes" : kind === "origami" ? "modèles à plier" : "fiches"}`,
    keys: "Corrigés",
    certificate: "Diplôme",
    papers: "A4 et US Letter",
    inside: "Dans ce pack",
    extras: ["Une couverture et un sommaire avec les numéros de page", "« Comment utiliser ce pack » : des conseils pour les parents et les enseignants", "Les fiches, de la plus facile à la plus difficile, avec la ligne Prénom / Date"],
    keysExtra: "Les corrigés à la fin, avec les réponses en rouge",
    parts: "Les cinq parties",
    part: (n, name) => `Partie ${n} : ${name}`,
    previewCover: "Couverture du pack",
    previewSheet: "Une page du pack",
    previewKey: "Une page de corrigés",
    download: "Télécharger le pack",
    downloadNote: "Inclus dans AlphaBes Pro. Chaque fiche reste aussi gratuite sur sa propre page.",
    paperName: { letter: "US Letter", a4: "A4" },
    defaultPaper: "conseillé",
    fileInfo: (pages, mb) => `${pages} pages · ${mb.replace(".", ",")} Mo`,
    notPro: "Pas encore Pro ? Voir les formules",
    sectionTitle: "Les packs AlphaBes Pro",
    sectionIntro: "Toutes les fiches d'un type dans un seul PDF bien rangé, avec un sommaire, des conseils aux parents, les corrigés et un diplôme. Inclus dans AlphaBes Pro.",
    megaGroup: "Tout dans un seul pack",
    completeGroup: "Les packs complets",
    levelGroup: "Des packs plus petits, par niveau ou par thème",
    upsell: (n, kind, keys) => `Envie des ${n} fiches « ${kind} » dans un seul PDF${keys ? ", avec les corrigés" : ""} ?`,
    upsellCta: "Voir le pack (Pro)",
    promoCta: "Voir les packs Pro",
  },
  es: {
    home: "Inicio",
    hub: "Fichas",
    bundles: "Paquetes",
    breadcrumb: "Ruta de navegación",
    title: (kind, pack, name) => (pack.scope === "mega" ? "Megapaquete: todos los tipos de fichas" : pack.scope === "complete" ? `${kind}: paquete completo` : `Paquete de ${kind}: ${name}`),
    metaSuffix: "PDF para imprimir (AlphaBes Pro)",
    description: (kind, n, ages, keys) =>
      `${n} fichas de ${kind} en un solo PDF listo para imprimir, de fáciles a difíciles, con índice, consejos para papás${keys ? ", soluciones" : ""} y un diploma. ${ages}. Tamaño carta o A4.`,
    megaDescription: (n, kinds) => `Los ${kinds} tipos de fichas de AlphaBes juntos: ${n} fichas en cinco PDF listos para imprimir, con soluciones, consejos para papás y diplomas. Tamaño carta o A4.`,
    ages: (a, b) => `De ${a} a ${b} años`,
    items: (n, kind) => `${n} ${kind === "sliding-puzzles" ? "rompecabezas" : kind === "flash-cards" ? "juegos de tarjetas" : kind === "origami" ? "modelos para doblar" : "fichas"}`,
    keys: "Soluciones",
    certificate: "Diploma",
    papers: "A4 y carta",
    inside: "Qué incluye",
    extras: ["Una portada y un índice con números de página", "«Cómo usar este paquete»: consejos para papás y maestros", "Las fichas, de fáciles a difíciles, cada una con su línea de Nombre / Fecha"],
    keysExtra: "Las soluciones al final, con las respuestas en rojo",
    parts: "Las cinco partes",
    part: (n, name) => `Parte ${n}: ${name}`,
    previewCover: "Portada del paquete",
    previewSheet: "Una página del paquete",
    previewKey: "Una página de soluciones",
    download: "Descargar el paquete",
    downloadNote: "Incluido en AlphaBes Pro. Cada ficha sigue gratis en su propia página.",
    paperName: { letter: "Carta", a4: "A4" },
    defaultPaper: "recomendado",
    fileInfo: (pages, mb) => `${pages} páginas · ${mb} MB`,
    notPro: "¿Todavía no eres Pro? Ver planes",
    sectionTitle: "Paquetes AlphaBes Pro",
    sectionIntro: "Todas las fichas de un tipo en un solo PDF ordenado, con índice, consejos para papás, soluciones y un diploma. Incluido en AlphaBes Pro.",
    megaGroup: "Todo en un solo paquete",
    completeGroup: "Paquetes completos",
    levelGroup: "Paquetes más pequeños, por nivel o tema",
    upsell: (n, kind, keys) => `¿Quieres las ${n} fichas de ${kind} en un solo PDF${keys ? ", con soluciones" : ""}?`,
    upsellCta: "Ver el paquete (Pro)",
    promoCta: "Ver los paquetes Pro",
  },
  pt: {
    home: "Início",
    hub: "Atividades",
    bundles: "Pacotes",
    breadcrumb: "Navegação",
    title: (kind, pack, name) => (pack.scope === "mega" ? "Megapacote: todos os tipos de atividades" : pack.scope === "complete" ? `${kind}: pacote completo` : `Pacote de ${kind}: ${name}`),
    metaSuffix: "PDF para imprimir (AlphaBes Pro)",
    description: (kind, n, ages, keys) =>
      `${n} atividades de ${kind} em um só PDF pronto para imprimir, das mais fáceis às mais difíceis, com sumário, dicas para os pais${keys ? ", gabaritos" : ""} e um certificado. ${ages}. Papel A4 ou Carta.`,
    megaDescription: (n, kinds) => `Os ${kinds} tipos de atividades da AlphaBes juntos: ${n} atividades em cinco PDFs prontos para imprimir, com gabaritos, dicas para os pais e certificados. Papel A4 ou Carta.`,
    ages: (a, b) => `De ${a} a ${b} anos`,
    items: (n, kind) => `${n} ${kind === "sliding-puzzles" ? "quebra-cabeças" : kind === "flash-cards" ? "conjuntos de cartões" : kind === "origami" ? "modelos para dobrar" : "atividades"}`,
    keys: "Gabaritos",
    certificate: "Certificado",
    papers: "A4 e Carta",
    inside: "O que vem no pacote",
    extras: ["Uma capa e um sumário com os números das páginas", "«Como usar este pacote»: dicas para pais e professores", "As atividades, das mais fáceis às mais difíceis, cada uma com a linha Nome / Data"],
    keysExtra: "Os gabaritos no final, com as respostas em vermelho",
    parts: "As cinco partes",
    part: (n, name) => `Parte ${n}: ${name}`,
    previewCover: "Capa do pacote",
    previewSheet: "Uma página do pacote",
    previewKey: "Uma página de gabaritos",
    download: "Baixar o pacote",
    downloadNote: "Incluído no AlphaBes Pro. Cada atividade continua grátis na sua própria página.",
    paperName: { letter: "Carta", a4: "A4" },
    defaultPaper: "recomendado",
    fileInfo: (pages, mb) => `${pages} páginas · ${mb.replace(".", ",")} MB`,
    notPro: "Ainda não é Pro? Veja os planos",
    sectionTitle: "Pacotes AlphaBes Pro",
    sectionIntro: "Todas as atividades de um tipo em um só PDF organizado, com sumário, dicas para os pais, gabaritos e um certificado. Incluído no AlphaBes Pro.",
    megaGroup: "Tudo em um só pacote",
    completeGroup: "Pacotes completos",
    levelGroup: "Pacotes menores, por nível ou tema",
    upsell: (n, kind, keys) => `Quer as ${n} atividades de ${kind} em um só PDF${keys ? ", com gabaritos" : ""}?`,
    upsellCta: "Ver o pacote (Pro)",
    promoCta: "Ver os pacotes Pro",
  },
};
