# AlphaBes Pro packs

Print-ready PDF packs of the worksheet types (lib/sheets/), for AlphaBes Pro
subscribers only. Single sheets stay free. Started 2026-10 on branch
`pro-bundles` (brief: `../owl-design/PROMPT-pro-bundles.md`).

## The packs

`lib/sheets/packs.ts` lists 39 packs, each in English, French, Spanish and
Portuguese and on US Letter and A4:

- 13 complete packs, one per type (the 12 sheet types and the printable
  sliding puzzles);
- 25 smaller packs by level or theme;
- the Mega pack, in five parts (one file per part, each under 15 MB).

Each PDF has a cover, a contents page, "How to use this pack", the sheets
(footer "AlphaBes Pro" and the page number), answer keys four to a page where
the type has answers, and a certificate. The pack pages' words are in
`scripts/sheets/pack-text.ts`.

## Building

```
npm run packs -- --pack=<ids> --locale=<en|fr|es|pt> --paper=<letter|a4>
npm run packs -- --pack=<ids> --locale=<lang> --paper=<lang's paper> --previews
```

- Build one language, one type and one paper size at a time (memory), never
  with the dev server running, and never two builds at once (they overwrite
  each other's files and manifest entries). Build the Mega pack one part per
  process with `--part=<n>`. A full build is about 25 minutes per language
  and paper.
- `npx tsx scripts/sheets/missing-packs.ts <kind|mega> <lang> <paper>` lists
  what isn't built and recorded yet (for `mega`, the missing part numbers), so
  a stopped build can resume. The manifest is written after every PDF.
- PDFs go to `pro-files/<lang>/packs/<slug>[-part-<n>]-<paper>.pdf`
  (git-ignored). `lib/sheets/pack-manifest.json` (committed) records each
  file's pages, size and sha256; `tests/sheets/pack-pages.test.ts` checks that
  every file is there and under 15 MB.
- `--previews` writes no PDF, only the page pictures (WebP, 480 px) to
  `public/pro-packs/<lang>/<slug>/`: covers, a sheet page and an answer key.
- `--samples=<dir>` saves full-size PNGs of the main pages for checking.

## Upload and protection

- `node scripts/upload-pro-files.mjs [--lang=xx]` sends `pro-files/<lang>/*.pdf`
  and `pro-files/<lang>/packs/*.pdf` to the private R2 bucket
  `alphabes-pro-files` (needs `npx wrangler login`). It resumes and skips
  unchanged files.
- Only `/api/bundles/<lang>/<slug>?paper=letter|a4[&part=1..5]` serves them
  (`lib/billing/bundles.ts`, `downloadFile`): logged out → login, then back to
  the pack page; logged in without Pro → pricing; Pro → the file,
  `private, no-store`. Tests: `tests/billing/bundle-route.test.ts`.
- Never put the PDFs in `public/`.

## On the site

- Pack pages share the bundles route (`/worksheets/bundles/<slug>`,
  `/fr/fiches/packs/<slug>`, `/es/fichas/paquetes/<slug>`,
  `/pt/atividades/pacotes/<slug>`), rendered by
  `components/sheets/ProPacks.tsx` with words from `lib/sheets/pack-ui.ts`.
- Also: a Pro packs section on each bundles listing, a "get the pack" box on
  each worksheet type and sheet page, a banner on the worksheet hubs, a
  "Pro worksheet packs" entry in the Worksheets menu, a line in the pricing
  plans, and "Not Pro yet? See plans" on the login page.
