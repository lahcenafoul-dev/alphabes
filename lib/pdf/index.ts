import type { jsPDF } from "jspdf";
import type { WorksheetTypeId } from "../worksheet-types";
import type { WorksheetRecord } from "../worksheets-data";

import { drawTracingWorksheet } from "./templates/tracing";
import { drawUppercasePractice } from "./templates/uppercase";
import { drawLowercasePractice } from "./templates/lowercase";
import { drawLetterRecognition } from "./templates/recognition";
import { drawBeginningSounds } from "./templates/beginningSounds";
import { drawLetterColoring } from "./templates/coloring";
import { drawLetterPictureMatching } from "./templates/matching";
import { drawMissingLetter } from "./templates/missingLetter";
import { drawWritingPractice } from "./templates/writingPractice";
import { drawLetterReview } from "./templates/review";

export const PDF_TEMPLATES: Record<WorksheetTypeId, (doc: jsPDF, w: WorksheetRecord) => void> = {
  tracing: (doc, w) => drawTracingWorksheet(doc, { letter: w.letter, word: w.primaryWord }),
  uppercase: drawUppercasePractice,
  lowercase: drawLowercasePractice,
  recognition: drawLetterRecognition,
  "beginning-sounds": drawBeginningSounds,
  coloring: drawLetterColoring,
  matching: drawLetterPictureMatching,
  "missing-letter": drawMissingLetter,
  writing: drawWritingPractice,
  review: drawLetterReview,
};

export function renderWorksheetPdf(doc: jsPDF, worksheet: WorksheetRecord): void {
  const template = PDF_TEMPLATES[worksheet.worksheetType];
  template(doc, worksheet);
}
