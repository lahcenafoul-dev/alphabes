import type { jsPDF } from "jspdf";
import { PAGE_MARGIN, drawWorksheetHeader, drawWorksheetTitle, drawWorksheetFooter } from "../chrome";
import type { WorksheetRecord } from "../../worksheets-data";

export function drawWritingPractice(doc: jsPDF, w: WorksheetRecord): void {
  const { uppercase: U, lowercase: L } = w;
  const pageWidth = doc.internal.pageSize.getWidth();

  drawWorksheetHeader(doc, "Alphabet Writing Practice");
  drawWorksheetTitle(doc, `Writing Practice: ${U}${L}`, w.primaryWord);

  const startY = 68;
  for (let row = 0; row < 5; row++) {
    const y = startY + row * 26;
    const guided = row < 2;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    if (guided) {
      doc.setDrawColor(180, 180, 180);
      doc.setLineWidth(0.3);
      for (let i = 0; i < 6; i++) {
        const x = PAGE_MARGIN + 10 + i * 28;
        doc.text(U, x, y, { renderingMode: "stroke" });
        doc.text(L, x + 12, y, { renderingMode: "stroke" });
      }
    }

    doc.setDrawColor(150, 150, 150);
    doc.setLineDashPattern([1, 1], 0);
    doc.line(PAGE_MARGIN, y + 3, pageWidth - PAGE_MARGIN, y + 3);
    doc.setLineDashPattern([], 0);

    if (!guided) {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(170, 170, 170);
      doc.text("write on your own", PAGE_MARGIN, y - 3);
    }
  }

  drawWorksheetFooter(doc, w.instructions);
}
