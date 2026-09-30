import ListenButton from "@/components/ListenButton";
import { getFiche } from "@/lib/fiches-fr";

const link =
  "rounded-block text-white px-6 py-3 font-bold shadow-block hover:shadow-blockHover transition";

// Listen + PDF buttons of /fr/alphabet/[letter]/fiche. The PDFs are the
// pre-rendered French worksheets (lib/fiches-fr.ts): print tracing, and
// cursive on Seyès lines.
export default function FicheActions({ slug, spoken }: { slug: string; spoken: string }) {
  const trace = getFiche(`lettre-${slug}-trace`)!;
  const cursive = getFiche(`lettre-${slug}-cursive`)!;
  return (
    <div className="mt-6 flex flex-wrap gap-4">
      <ListenButton text={spoken} className="rounded-block bg-crayon-blue text-white px-6 py-3 font-bold">
        🔊 Écouter
      </ListenButton>
      <a href={trace.pdf} download={`fiche-lettre-${slug}.pdf`} className={`${link} bg-crayon-green`}>
        ⬇️ Fiche de tracé (PDF)
      </a>
      <a href={cursive.pdf} download={`fiche-cursive-lettre-${slug}.pdf`} className={`${link} bg-crayon-purple`}>
        ⬇️ Fiche en cursive (PDF)
      </a>
    </div>
  );
}
