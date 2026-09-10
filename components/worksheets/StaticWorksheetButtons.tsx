"use client";

// Download/Print buttons for static-PDF-only worksheets (Mechanism B) that
// have no jsPDF-generated fallback -- unlike PdfDownloadButton/PrintButton,
// these always point at a real file in public/worksheets-pdf/.
export default function StaticWorksheetButtons({ pdfUrl, slug }: { pdfUrl: string; slug: string }) {
  return (
    <div className="mt-6 flex flex-wrap gap-4 print:hidden">
      <button
        onClick={() => window.open(pdfUrl, "_blank")}
        className="rounded-block bg-crayon-blue text-white px-6 py-3 font-display font-bold shadow-block hover:shadow-blockHover transition"
      >
        🖨️ Print Worksheet
      </button>
      <a
        href={pdfUrl}
        download={`${slug}.pdf`}
        className="rounded-block bg-crayon-green text-white px-6 py-3 font-display font-bold shadow-block hover:shadow-blockHover transition"
      >
        ⬇️ Download PDF
      </a>
    </div>
  );
}
