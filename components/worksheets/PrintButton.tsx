"use client";

import { InlineIcon } from "@/components/UiIcon";

export default function PrintButton({ staticPdfUrl }: { staticPdfUrl?: string | null }) {
  const handlePrint = async () => {
    if (staticPdfUrl) {
      window.open(staticPdfUrl, "_blank");
      return;
    }
    // Word photos load lazily: load every picture before printing.
    const images = [...document.images];
    for (const img of images) img.loading = "eager";
    await Promise.all(images.map((img) => img.decode().catch(() => {})));
    window.print();
  };

  return (
    <button
      onClick={handlePrint}
      className="rounded-block bg-crayon-blue text-white px-6 py-3 font-display font-bold shadow-block hover:shadow-blockHover transition"
    >
      <InlineIcon name="print" />
      Print Worksheet
    </button>
  );
}
