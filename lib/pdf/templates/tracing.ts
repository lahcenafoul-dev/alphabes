// Letter Tracing PDF template. This is the extracted, behaviorally-identical
// body of components/WorksheetClient.tsx's original inline downloadPDF --
// same visual output, same saved-file semantics -- so the legacy interactive
// /alphabet/[letter]/worksheet page and the new "Letter X Tracing" worksheet
// type render byte-identical PDFs from one function.
import type { jsPDF } from "jspdf";
import { PAGE_MARGIN, drawWorksheetHeader, drawWorksheetTitle, drawWorksheetFooter } from "../chrome";

export function drawTracingWorksheet(doc: jsPDF, data: { letter: string; word: string }): void {
  const upper = data.letter.toUpperCase();
  const lower = data.letter.toLowerCase();
  const pageWidth = doc.internal.pageSize.getWidth();

  drawWorksheetHeader(doc, "Letter Tracing Worksheet");
  drawWorksheetTitle(doc, `Letter ${upper}${lower}`, data.word);

  // Big outline guide letters
  doc.setFont("helvetica", "bold");
  doc.setFontSize(70);
  doc.setDrawColor(59, 130, 246);
  doc.setLineWidth(0.6);
  doc.text(upper, 45, 85, { renderingMode: "stroke" });
  doc.text(lower, 115, 85, { renderingMode: "stroke" });

  // Practice rows with dotted guide lines
  const startY = 105;
  for (let row = 0; row < 3; row++) {
    const y = startY + row * 28;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(24);
    doc.setDrawColor(180, 180, 180);
    doc.setLineWidth(0.3);
    for (let i = 0; i < 4; i++) {
      const x = PAGE_MARGIN + 10 + i * 22;
      doc.text(upper, x, y, { renderingMode: "stroke" });
      doc.text(lower, x + 11, y, { renderingMode: "stroke" });
    }

    doc.setDrawColor(150, 150, 150);
    doc.setLineDashPattern([1, 1], 0);
    doc.line(PAGE_MARGIN, y + 3, pageWidth - PAGE_MARGIN, y + 3);
    doc.setLineDashPattern([], 0);
  }

  drawWorksheetFooter(doc, `${data.word} starts with the letter ${upper}${lower}.`, 210);
}
