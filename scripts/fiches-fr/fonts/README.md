# Fonts for the French worksheet PDFs

Used only by `scripts/fiches-fr/generate.ts` to render the PDFs; the website
never serves these files. All three families are under the SIL Open Font
License 1.1 (licence texts next to each file), which allows commercial use
and embedding in documents. The OFL doesn't apply to the PDFs themselves.

| File | Family | Source | Changes |
|---|---|---|---|
| `PlaywriteFRTrad-Regular.ttf` | Playwrite FR Trad (TypeTogether) | google/fonts `ofl/playwritefrtrad` | Static weight-400 instance of the variable font, overlaps removed (fontTools instancer) |
| `NotoEmoji-Regular.ttf` | Noto Emoji, monochrome (Google) | google/fonts `ofl/notoemoji` | Static weight-400 instance of the variable font, overlaps removed (clean outlines for colouring) |
| `Andika-Regular.ttf`, `Andika-Bold.ttf` | Andika (SIL International) | google/fonts `ofl/andika` | None ("Andika" is a Reserved Font Name, so this font must not be modified) |

Neither Playwrite nor Noto Emoji declares a Reserved Font Name, so the
modified instances may keep their names.
