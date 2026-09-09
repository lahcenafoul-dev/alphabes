import type { jsPDF } from "jspdf";
import { PAGE_MARGIN, drawWorksheetHeader, drawWorksheetTitle, drawWorksheetFooter } from "../chrome";
import type { WorksheetRecord } from "../../worksheets-data";
import { getAllLetterSlugs } from "../../letters-data";

export function drawMissingLetter(doc: jsPDF, w: WorksheetRecord): void {
  const { uppercase: U, lowercase: L, primaryWord } = w;
  const pageWidth = doc.internal.pageSize.getWidth();
  const restOfWord = primaryWord.slice(1).toLowerCase();

  drawWorksheetHeader(doc, "Missing Letter");
  drawWorksheetTitle(doc, `Missing Letter: ${U}${L}`, "Fill in the missing letter");

  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  doc.setTextColor(30, 30, 30);
  doc.text("1. Write the missing letter to complete the word:", PAGE_MARGIN, 65);

  doc.setDrawColor(60, 60, 60);
  doc.setLineWidth(0.4);
  doc.roundedRect(PAGE_MARGIN + 5, 75, 22, 22, 2, 2, "S");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.text(restOfWord, PAGE_MARGIN + 32, 91);

  // second, third example words if available for more practice rows
  const others = w.exampleWords.slice(1, 3);
  others.forEach((ex, i) => {
    const y = 110 + i * 30;
    doc.setDrawColor(60, 60, 60);
    doc.roundedRect(PAGE_MARGIN + 5, y - 16, 22, 22, 2, 2, "S");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.text(ex.word.slice(1).toLowerCase(), PAGE_MARGIN + 32, y);
  });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  doc.setTextColor(30, 30, 30);
  doc.text("2. Complete the alphabet sequence:", PAGE_MARGIN, 185);

  const letters = getAllLetterSlugs();
  const idx = letters.indexOf(w.letter);
  const prev = letters[(idx - 1 + letters.length) % letters.length].toUpperCase();
  const next = letters[(idx + 1) % letters.length].toUpperCase();

  const seq = [prev, "___", next];
  doc.setFont("helvetica", "bold");
  doc.setFontSize(26);
  seq.forEach((s, i) => {
    doc.text(s, PAGE_MARGIN + 10 + i * 30, 205);
  });

  drawWorksheetFooter(doc, w.instructions);
}
