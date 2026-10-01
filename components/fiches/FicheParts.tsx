import { Link } from "@/i18n/navigation";

// Building blocks of the French and Spanish worksheet pages (/fr/fiches,
// /es/fichas). French is the default, so the French pages pass no locale.

/** What these blocks need from a French fiche or a Spanish ficha. */
export type PrintableSheet = { slug: string; title: string; label: string; preview: string };
type SheetLocale = "fr" | "es";

const LABELS = {
  fr: { preview: "Aperçu de la fiche :", print: "🖨️ Imprimer", download: "⬇️ Télécharger le PDF", pages: "pages" },
  es: { preview: "Vista previa de la ficha:", print: "🖨️ Imprimir", download: "⬇️ Descargar el PDF", pages: "páginas" },
};

/** Preview of a worksheet page: a small pre-rendered JPEG (scripts/fiches-fr, scripts/fichas-es). */
export function FichePreview({
  fiche,
  className,
  eager,
  locale = "fr",
}: {
  fiche: PrintableSheet;
  className?: string;
  eager?: boolean;
  locale?: SheetLocale;
}) {
  return (
    // The previews are already sized and compressed at build time, and image
    // optimization isn't set up on Workers, so a plain <img> is the right tool.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={fiche.preview}
      alt={`${LABELS[locale].preview} ${fiche.title}`}
      width={476}
      height={673}
      loading={eager ? "eager" : "lazy"}
      className={`h-auto w-full rounded-block border border-chalkboard/10 bg-white ${className ?? ""}`}
    />
  );
}

/** Card linking to a worksheet, with its preview. */
export function FicheCard({
  fiche,
  showLabel = true,
  locale = "fr",
}: {
  fiche: PrintableSheet;
  showLabel?: boolean;
  locale?: SheetLocale;
}) {
  return (
    <li>
      <Link
        href={{ pathname: "/worksheets/[category]", params: { category: fiche.slug } }}
        className="block h-full rounded-block border border-chalkboard/10 bg-paper p-3 shadow-block hover:border-crayon-blue hover:shadow-blockHover transition"
      >
        <FichePreview fiche={fiche} locale={locale} />
        {showLabel && <p className="mt-2 text-center font-display font-bold text-sm">{fiche.label}</p>}
      </Link>
    </li>
  );
}

const button =
  "inline-flex items-center gap-2 rounded-block px-6 py-3 font-display font-bold text-white shadow-block hover:shadow-blockHover transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-crayon-blue";

/** "Imprimer" opens the PDF (the browser's viewer prints it); "Télécharger" saves it. */
export function PdfButtons({
  pdf,
  fileName,
  pages,
  locale = "fr",
}: {
  pdf: string;
  fileName: string;
  pages?: number;
  locale?: SheetLocale;
}) {
  const t = LABELS[locale];
  return (
    <div className="flex flex-wrap gap-4 print:hidden">
      <a href={pdf} target="_blank" rel="noopener" className={`${button} bg-crayon-blue`}>
        {t.print}
      </a>
      <a href={pdf} download={fileName} className={`${button} bg-crayon-green`}>
        {t.download}
        {pages && pages > 1 ? ` (${pages} ${t.pages})` : ""}
      </a>
    </div>
  );
}
