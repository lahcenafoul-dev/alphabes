import type { jsPDF } from "jspdf";
import { PAGE_MARGIN, drawWorksheetHeader, drawWorksheetTitle, drawWorksheetFooter } from "../chrome";
import { drawWordPicture, type WordPhotos } from "../icons";
import type { WorksheetRecord } from "../../worksheets-data";
import { getAllLetterSlugs, getLetterContent } from "../../letters-data";

/** 2 real matches + 2 distractors from a different letter. */
export function beginningSoundItems(w: WorksheetRecord) {
  const letters = getAllLetterSlugs();
  const otherLetter = letters[(letters.indexOf(w.letter) + 5) % letters.length];
  const otherWords = getLetterContent(otherLetter)?.exampleWords.slice(0, 2) ?? [];
  return [...w.exampleWords.slice(0, 2), ...otherWords].map((ex, i) => ({ ...ex, isMatch: i < 2 }));
}

export function drawBeginningSounds(doc: jsPDF, w: WorksheetRecord, photos: WordPhotos = {}): void {
  const { uppercase: U, lowercase: L } = w;
  const pageWidth = doc.internal.pageSize.getWidth();

  drawWorksheetHeader(doc, "Beginning Sounds");
  drawWorksheetTitle(doc, `Beginning Sound: ${U}${L}`, `Circle pictures that start with ${U}`);

  const items = beginningSoundItems(w);

  const cols = 2;
  const cellW = (pageWidth - PAGE_MARGIN * 2) / cols;
  items.forEach((item, i) => {
    const cx = PAGE_MARGIN + cellW * (i % cols) + cellW / 2;
    const cy = 85 + Math.floor(i / cols) * 65;
    drawWordPicture(doc, photos, item.word, cx, cy, 34, { size: 32, fallbackSize: 18, letter: item.word });

    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.setTextColor(30, 30, 30);
    doc.text(item.word, cx, cy + 28, { align: "center" });
  });

  drawWorksheetFooter(doc, w.instructions);
}
