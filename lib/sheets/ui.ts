// The words around the new worksheet types' pages (components/sheets/), in
// each language. Kept here rather than in messages/*.json because they're
// only used by these pages, like the labels of components/fiches/FicheParts.
import type { SheetLocale } from "./types";

export type SheetUi = {
  home: string;
  hub: string;
  breadcrumb: string;
  free: string;
  sheets: (n: number) => string;
  download: string;
  print: string;
  previewOf: string;
  all: string;
  filters: string;
  showing: (from: number, to: number, total: number) => string;
  none: string;
  reset: string;
  prev: string;
  next: string;
  pagination: string;
  page: (n: number) => string;
  onTheSheet: string;
  howTo: string;
  details: string;
  level: string;
  skills: string;
  paper: string;
  /** "US Letter, 2 pages…": the PDF's paper and number of pages. */
  paperSize: (pages: number) => string;
  price: string;
  freeLong: string;
  related: string;
  allOfKind: (name: string) => string;
  otherKinds: string;
  previous: string;
  following: string;
  metaSuffix: string;
};

export const SHEET_UI: Record<SheetLocale, SheetUi> = {
  en: {
    home: "Home",
    hub: "Worksheets",
    breadcrumb: "Breadcrumb",
    free: "Free",
    sheets: (n) => `${n} worksheets`,
    download: "Download PDF",
    print: "Print",
    previewOf: "Preview of the worksheet:",
    all: "All",
    filters: "Filter the worksheets",
    showing: (from, to, total) => `Showing ${from}–${to} of ${total}`,
    none: "No worksheet matches these filters.",
    reset: "Show all",
    prev: "Previous",
    next: "Next",
    pagination: "Pages",
    page: (n) => `Page ${n}`,
    onTheSheet: "On the sheet",
    howTo: "How to use it",
    details: "Details",
    level: "Ages",
    skills: "Skills",
    paper: "Paper",
    paperSize: (n) => `US Letter, ${n} ${n > 1 ? "pages" : "page"}, black-and-white friendly`,
    price: "Price",
    freeLong: "Free, no sign-up",
    related: "More worksheets like this",
    allOfKind: (name) => `${name}: all worksheets`,
    otherKinds: "More printable worksheets",
    previous: "Previous worksheet",
    following: "Next worksheet",
    metaSuffix: "Free Printable PDF",
  },
  fr: {
    home: "Accueil",
    hub: "Fiches",
    breadcrumb: "Fil d'Ariane",
    free: "Gratuit",
    sheets: (n) => `${n} fiches`,
    download: "Télécharger le PDF",
    print: "Imprimer",
    previewOf: "Aperçu de la fiche :",
    all: "Toutes",
    filters: "Filtrer les fiches",
    showing: (from, to, total) => `Fiches ${from} à ${to} sur ${total}`,
    none: "Aucune fiche ne correspond à ces filtres.",
    reset: "Tout afficher",
    prev: "Précédente",
    next: "Suivante",
    pagination: "Pages",
    page: (n) => `Page ${n}`,
    onTheSheet: "Sur la fiche",
    howTo: "Comment l'utiliser",
    details: "En bref",
    level: "Âge",
    skills: "Compétences",
    paper: "Format",
    paperSize: (n) => `A4, ${n} ${n > 1 ? "pages" : "page"}, s'imprime bien en noir et blanc`,
    price: "Prix",
    freeLong: "Gratuit, sans inscription",
    related: "Fiches du même genre",
    allOfKind: (name) => `${name} : toutes les fiches`,
    otherKinds: "D'autres fiches à imprimer",
    previous: "Fiche précédente",
    following: "Fiche suivante",
    metaSuffix: "Fiche PDF gratuite",
  },
  es: {
    home: "Inicio",
    hub: "Fichas",
    breadcrumb: "Ruta de navegación",
    free: "Gratis",
    sheets: (n) => `${n} fichas`,
    download: "Descargar el PDF",
    print: "Imprimir",
    previewOf: "Vista previa de la ficha:",
    all: "Todas",
    filters: "Filtrar las fichas",
    showing: (from, to, total) => `Fichas ${from} a ${to} de ${total}`,
    none: "Ninguna ficha coincide con estos filtros.",
    reset: "Ver todas",
    prev: "Anterior",
    next: "Siguiente",
    pagination: "Páginas",
    page: (n) => `Página ${n}`,
    onTheSheet: "En la ficha",
    howTo: "Cómo usarla",
    details: "En resumen",
    level: "Edad",
    skills: "Habilidades",
    paper: "Formato",
    paperSize: (n) => `A4, ${n} ${n > 1 ? "páginas" : "página"}, se imprime bien en blanco y negro`,
    price: "Precio",
    freeLong: "Gratis, sin registro",
    related: "Más fichas como esta",
    allOfKind: (name) => `${name}: todas las fichas`,
    otherKinds: "Más fichas para imprimir",
    previous: "Ficha anterior",
    following: "Ficha siguiente",
    metaSuffix: "Ficha PDF gratis",
  },
  pt: {
    home: "Início",
    hub: "Atividades",
    breadcrumb: "Navegação estrutural",
    free: "Grátis",
    sheets: (n) => `${n} atividades`,
    download: "Baixar o PDF",
    print: "Imprimir",
    previewOf: "Prévia da atividade:",
    all: "Todas",
    filters: "Filtrar as atividades",
    showing: (from, to, total) => `Atividades ${from} a ${to} de ${total}`,
    none: "Nenhuma atividade corresponde a esses filtros.",
    reset: "Ver todas",
    prev: "Anterior",
    next: "Próxima",
    pagination: "Páginas",
    page: (n) => `Página ${n}`,
    onTheSheet: "Na atividade",
    howTo: "Como usar",
    details: "Resumo",
    level: "Idade",
    skills: "Habilidades",
    paper: "Formato",
    paperSize: (n) => `A4, ${n} ${n > 1 ? "páginas" : "página"}, imprime bem em preto e branco`,
    price: "Preço",
    freeLong: "Grátis, sem cadastro",
    related: "Mais atividades como esta",
    allOfKind: (name) => `${name}: todas as atividades`,
    otherKinds: "Mais atividades para imprimir",
    previous: "Atividade anterior",
    following: "Próxima atividade",
    metaSuffix: "Atividade em PDF grátis",
  },
};
