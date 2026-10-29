"use client";

import { renderWorksheetPdf, worksheetPictureWords } from "@/lib/pdf";
import { loadWordPhotos } from "@/lib/pdf/photos";
import type { WorksheetRecord } from "@/lib/worksheets-data";
import { InlineIcon } from "@/components/UiIcon";

// staticPdfUrl: the pre-rendered PDF (lib/static-pdf-overrides.ts) with its
// version query, from the server; without it the PDF is made here with jsPDF.
export default function PdfDownloadButton({ worksheet, staticPdfUrl }: { worksheet: WorksheetRecord; staticPdfUrl?: string | null }) {
  const download = async () => {
    if (staticPdfUrl) {
      window.location.href = staticPdfUrl;
      return;
    }
    const [{ jsPDF }, photos] = await Promise.all([import("jspdf"), loadWordPhotos(worksheetPictureWords(worksheet))]);
    const doc = new jsPDF({ unit: "mm", format: "a4" });
    renderWorksheetPdf(doc, worksheet, photos);
    doc.save(`${worksheet.slug}.pdf`);
  };

  return (
    <button
      onClick={download}
      className="rounded-block bg-crayon-green text-white px-6 py-3 font-display font-bold shadow-block hover:shadow-blockHover transition"
    >
      <InlineIcon name="download" />
      Download PDF
    </button>
  );
}
