import type { jsPDF } from "jspdf";
import { PAGE_MARGIN, drawWorksheetHeader, drawWorksheetTitle, drawWorksheetFooter } from "../chrome";
import { ICONS, drawFallbackIcon } from "../icons";
import type { WorksheetRecord } from "../../worksheets-data";

export function drawLetterReview(doc: jsPDF, w: WorksheetRecord): void {
  const { uppercase: U, lowercase: L, letter, primaryWord } = w;
  const pageWidth = doc.internal.pageSize.getWidth();

  drawWorksheetHeader(doc, "Letter Review");
  drawWorksheetTitle(doc, `Letter ${U}${L} Review`, "Show what you know!");

  // 1. Trace
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.setTextColor(30, 30, 30);
  doc.text("1. Trace the letter:", PAGE_MARGIN, 65);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(24);
  doc.setDrawColor(180, 180, 180);
  doc.setLineWidth(0.3);
  for (let i = 0; i < 5; i++) {
    const x = PAGE_MARGIN + 12 + i * 32;
    doc.text(U, x, 82, { renderingMode: "stroke" });
    doc.text(L, x + 12, 82, { renderingMode: "stroke" });
  }
  doc.setDrawColor(150, 150, 150);
  doc.setLineDashPattern([1, 1], 0);
  doc.line(PAGE_MARGIN, 85, pageWidth - PAGE_MARGIN, 85);
  doc.setLineDashPattern([], 0);

  // 2. Recognition
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.text(`2. Circle every ${U} and ${L}:`, PAGE_MARGIN, 105);
  const distractors = "aeostmn".split("").filter((c) => c !== L);
  const grid = [U, distractors[0], L, distractors[1], U, distractors[2], L, distractors[3], U, L, distractors[4], L];
  doc.setFont("helvetica", "bold");
  doc.setFontSize(15);
  doc.setDrawColor(60, 60, 60);
  doc.setLineWidth(0.4);
  grid.forEach((ch, i) => {
    doc.text(ch, PAGE_MARGIN + 10 + (i % 6) * 27, 118 + Math.floor(i / 6) * 16, { renderingMode: "stroke" });
  });

  // 3. Beginning sound picture
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.text(`3. Say the word. Does it start with ${U}?`, PAGE_MARGIN, 158);
  const draw = ICONS[primaryWord.toLowerCase()];
  if (draw) draw(doc, PAGE_MARGIN + 20, 180, 26);
  else drawFallbackIcon(doc, PAGE_MARGIN + 20, 180, 16, letter);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.text(primaryWord, PAGE_MARGIN + 45, 182);

  // 4. Independent write
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.text("4. Write the letter on your own:", PAGE_MARGIN, 205);
  doc.setDrawColor(150, 150, 150);
  doc.setLineDashPattern([1, 1], 0);
  doc.line(PAGE_MARGIN, 220, pageWidth - PAGE_MARGIN, 220);
  doc.setLineDashPattern([], 0);

  drawWorksheetFooter(doc, w.instructions);
}
