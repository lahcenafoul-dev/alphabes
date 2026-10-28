"use client";

import { renderWorksheetPdf, worksheetPictureWords } from "@/lib/pdf";
import { loadWordPhotos } from "@/lib/pdf/photos";
import type { WorksheetRecord } from "@/lib/worksheets-data";
import { getStaticPdfOverride } from "@/lib/static-pdf-overrides";
import { InlineIcon } from "@/components/UiIcon";

export default function PdfDownloadButton({ worksheet }: { worksheet: WorksheetRecord }) {
  const staticPdfUrl = getStaticPdfOverride(worksheet.slug);

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
