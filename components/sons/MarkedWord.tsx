import { plainWord, wordParts } from "@/lib/sons-fr";

// Shows a sound-page word with its markup: the sound's letters in red,
// silent letters in grey, or syllables in alternating colours. Screen
// readers get the plain word, not the pieces.
export default function MarkedWord({
  word,
  marks = "sound",
}: {
  word: string;
  marks?: "sound" | "silent";
}) {
  const syllables = word.includes("|");
  const parts = wordParts(word);
  return (
    <>
      <span className="sr-only">{plainWord(word)}</span>
      <span aria-hidden="true">
        {parts.map((p, i) => {
          if (syllables) {
            return (
              <span
                key={i}
                className={p.mark ? "text-[#C8323A]" : "text-[#1D6FC2]"}
              >
                {p.text}
              </span>
            );
          }
          if (!p.mark) return <span key={i}>{p.text}</span>;
          return marks === "silent" ? (
            <span key={i} className="text-chalkboard/35">
              {p.text}
            </span>
          ) : (
            <span
              key={i}
              className="text-[#C8323A] underline decoration-2 underline-offset-4"
            >
              {p.text}
            </span>
          );
        })}
      </span>
    </>
  );
}
