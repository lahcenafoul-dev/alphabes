"use client";

export default function PrintButton({ staticPdfUrl }: { staticPdfUrl?: string | null }) {
  const handlePrint = () => {
    if (staticPdfUrl) {
      window.open(staticPdfUrl, "_blank");
      return;
    }
    window.print();
  };

  return (
    <button
      onClick={handlePrint}
      className="rounded-block bg-crayon-blue text-white px-6 py-3 font-display font-bold shadow-block hover:shadow-blockHover transition"
    >
      🖨️ Print Worksheet
    </button>
  );
}
