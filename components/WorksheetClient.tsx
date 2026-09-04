"use client";

import { jsPDF } from "jspdf";

type Props = {
  letter: string;
  word: string;
  emoji: string;
};

export default function WorksheetClient({ letter, word, emoji }: Props) {
  const upper = letter.toUpperCase();
  const lower = letter.toLowerCase();

  const playSound = () => {
    const utterance = new SpeechSynthesisUtterance(
      `${upper}. ${word} starts with ${upper}.`
    );
    utterance.lang = "en-US";
    utterance.rate = 0.85;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  const downloadPDF = () => {
    const doc = new jsPDF({ unit: "mm", format: "a4" });
    const pageWidth = doc.internal.pageSize.getWidth();

    doc.setFontSize(24);
    doc.text(`Letter ${upper}${lower} Worksheet`, pageWidth / 2, 20, {
      align: "center",
    });

    doc.setFontSize(80);
    doc.setTextColor(200, 200, 200);
    doc.text(upper, 40, 60);
    doc.text(lower, 100, 60);

    doc.setDrawColor(150, 150, 150);
    doc.setLineDashPattern([1, 1], 0);
    for (let i = 0; i < 4; i++) {
      const y = 80 + i * 15;
      doc.text(upper, 30 + i * 12, y);
      doc.text(lower, 90 + i * 12, y);
    }

    doc.setLineDashPattern([], 0);
    doc.setDrawColor(0, 0, 0);
    for (let i = 0; i < 3; i++) {
      const y = 150 + i * 15;
      doc.line(20, y, pageWidth - 20, y);
    }

    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text(`${word} starts with the letter ${upper}${lower}`, 20, 210);

    doc.save(`letter-${lower}-worksheet.pdf`);
  };

  return (
    <div className="mt-6 flex flex-wrap gap-4">
      <button
        onClick={playSound}
        className="rounded-block bg-crayon-blue text-white px-6 py-3 font-bold"
      >
        🔊 Listen
      </button>
      <button
        onClick={downloadPDF}
        className="rounded-block bg-crayon-green text-white px-6 py-3 font-bold"
      >
        ⬇️ Download PDF
      </button>
    </div>
  );
}