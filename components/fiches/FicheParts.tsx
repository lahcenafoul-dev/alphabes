import { Link } from "@/i18n/navigation";
import type { Fiche } from "@/lib/fiches-fr";

// Building blocks of the French worksheet pages (/fr/fiches).

/** Preview of a worksheet page: a small pre-rendered JPEG (scripts/fiches-fr). */
export function FichePreview({ fiche, className, eager }: { fiche: Fiche; className?: string; eager?: boolean }) {
  return (
    // The previews are already sized and compressed at build time, and image
    // optimization isn't set up on Workers, so a plain <img> is the right tool.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={fiche.preview}
      alt={`Aperçu de la fiche : ${fiche.title}`}
      width={476}
      height={673}
      loading={eager ? "eager" : "lazy"}
      className={`h-auto w-full rounded-block border border-chalkboard/10 bg-white ${className ?? ""}`}
    />
  );
}

/** Card linking to a worksheet, with its preview. */
export function FicheCard({ fiche, showLabel = true }: { fiche: Fiche; showLabel?: boolean }) {
  return (
    <li>
      <Link
        href={{ pathname: "/worksheets/[category]", params: { category: fiche.slug } }}
        className="block h-full rounded-block border border-chalkboard/10 bg-paper p-3 shadow-block hover:border-crayon-blue hover:shadow-blockHover transition"
      >
        <FichePreview fiche={fiche} />
        {showLabel && <p className="mt-2 text-center font-display font-bold text-sm">{fiche.label}</p>}
      </Link>
    </li>
  );
}

const button =
  "inline-flex items-center gap-2 rounded-block px-6 py-3 font-display font-bold text-white shadow-block hover:shadow-blockHover transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-crayon-blue";

/** "Imprimer" opens the PDF (the browser's viewer prints it); "Télécharger" saves it. */
export function PdfButtons({ pdf, fileName, pages }: { pdf: string; fileName: string; pages?: number }) {
  return (
    <div className="flex flex-wrap gap-4 print:hidden">
      <a href={pdf} target="_blank" rel="noopener" className={`${button} bg-crayon-blue`}>
        🖨️ Imprimer
      </a>
      <a href={pdf} download={fileName} className={`${button} bg-crayon-green`}>
        ⬇️ Télécharger le PDF{pages && pages > 1 ? ` (${pages} pages)` : ""}
      </a>
    </div>
  );
}
