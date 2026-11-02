# Stories v2: plan, decisions and status

The brief is `../owl-design/PROMPT-stories.md`. The work is on branch `stories-v2`.

The goal: rewrite the 8 stories as real little stories, add 16 new ones (24 in all, 8 per level, in EN/FR/ES/PT), and replace the SVG scenes with Canva illustrations.

## Status
- **Step A (2026-11-02): done.** The 24 English stories and the character cast. Approved by the owner on 2026-11-02, including the 6-letter alphabet story, the changes to the old stories, and question+answer pages on level 1.
- **Step B (2026-11-02): done and approved by the owner on 2026-11-02, including broccoli instead of peas, "Boo's Ten Cherries" and the two wording changes. Waiting for the owner to make the images.**
  - FR/ES/PT versions, SEO descriptions and talk-about-it questions for all 24 stories, in `prisma/stories-v2/`.
  - All Canva prompts in `../owl-design/stories/prompts.md` and the list of missing pictures in `../owl-design/stories/images/MISSING.txt`, both from `npm run stories:prompts`.
- **Step C:** image script, reader, listing, seed, tests, build and browser check. It starts when the owner says the images are ready.

## Where things are
- **`prisma/stories-v2/`:** the 24 stories (`level-1.ts`, `level-2.ts`, `level-3.ts`, types in `types.ts`).
  - Each story has its `group` (= `translationGroup` and image folder), level, `isNew`, the English picture scenes (`cover`, `scenes`), and per language: slug, title, SEO description, pages and questions.
  - Pure data. Nothing reads it yet: `prisma/stories-data.ts` and the seed stay as they are until step C.
- **`scripts/stories/characters.ts`:** the fixed character descriptions.
  - A character name in a scene (Boo, Mama Cat…) puts that character's description into the prompt word for word.
- **`scripts/stories/prompts.ts`** (`npm run stories:prompts`, or `-- --missing` for the list only): writes `prompts.md` and `MISSING.txt` in `../owl-design/stories/`.
  - That is 214 pictures: 22 character sheets, 24 covers and 168 pages.
- **`tests/stories-v2.test.ts`** checks:
  - 8 stories per level, and the page count of each level in every language;
  - the kept slugs, unique slugs, and a cast character in every scene;
  - the same Spanish and Portuguese word rules as `tests/i18n/stories.test.ts`, and French punctuation.
- **`../owl-design/stories/canva-media.md`** (the owner's file): where each finished image lives in Canva.

## Decisions
- **Levels:** Level 1 is ages 3–4 (6 pages, one short sentence, sometimes a question and its short answer). Level 2 is ages 4–6 (7 pages, 1–2 sentences). Level 3 is ages 6–8 (8 pages, 2–3 sentences with dialogue). The order is level 1, then 2, then 3, as in the table below.
- **Kept slugs and groups:** the 8 existing stories keep their slugs and `translationGroup` (`apple`, `dog`, `fish`, `duck`, `lion`, `bear`, `cat`, `owl`) in all four languages, and their titles. Cat and owl move from ages 4–7 to 6–8.
- **One cast of friends** across all the stories. The 7 kept heroes keep their names in each language. Genders follow the language, because the pictures don't show them: the cat is a boy in EN/FR and a girl in ES/PT, and the owl is a girl in PT.

  | EN | FR | ES | PT |
  |---|---|---|---|
  | Boo (bear) | Titou | Bruno | Beto |
  | Milo (kitten) | Moustache | Mía | Mimi |
  | Rex (puppy) | Filou | Canelo | Totó |
  | Daisy (duckling) | Coline | Lupita | Lili |
  | Finn (fish) | Pilou | Burbujas | Bolinha |
  | Ollie (owl) | Hugo | Tito | Juju |
  | Leo (lion cub) | Léon | Leo | Leo |
  | Hazel (hedgehog) | Noisette | Tina | Bia |
  | Pepper (mouse) | Praline | Pepa | Pipoca |
  | Bibi (bunny) | Nina | Coco | Lulu |
  | Tess (tortoise) | Lola | Tula | Tati |
  | Juno (bat) | Zoé | Luna | Nina |
  | Shelly (crab) | Perle | Rita | Cacá |
  | Hop (frog) | Rainette | Paco | Zeca |
  | Miss Goose (teacher) | Madame Plume | la maestra Pluma | a professora Pena |

  The grown-ups are Maman / mamá / mamãe, Papa / papi / papai, Mamie / la abuela / a vovó, and Papi Hibou / el abuelo búho / o vovô coruja.
- **The alphabet story uses only letters whose word starts the same way in all four languages, so one picture works for all of them:**
  - A: airplane / avion / avión / avião
  - B: ball / ballon / balón / bola
  - E: elephant / éléphant / elefante / elefante
  - L: lion / lion / león / leão
  - T: tomato / tomate / tomate / tomate
  - U: ukulele / ukulélé / ukelele / ukulele
- **Step B changes to the approved English** (made so one picture fits every language):
  - **"Bibi Tries a Bite": peas are now broccoli.** The Spanish word for peas changes by country (*guisante*, *chícharo*, *arveja*).
  - **"Boo's Ten Strawberries" is now "Boo's Ten Cherries"** (group `cherries`, slug `boos-ten-cherries`), because the Spanish test bans *fresa* and *frutilla*.
  - **Small wording changes:**
    - In "Juno and the Sunset", page 2 now reads "Juno, do you want to play?".
    - In "Ollie's Letter Box", Leo says "L is for lion… that's me!", so the line works in every language.
- **Spanish wording:**
  - Papa is ***papi***, because the existing test reads *papá* as the banned *papa*.
  - Hide and seek is *jugar a esconderse*.
  - No *jalar*, *desván* or *pasto*.
- **Portuguese:**
  - Butterflies in the tummy is "frio na barriga".
  - The bedtime song is "nana, nenê", because "la-la" would trip the no-Spanish check.
  - The "está a" check matches substrings without accents, so lines like "lá está a…" and "está acabando" are reworded.

## Story list

The full texts in all four languages are in `prisma/stories-v2/`. Overview:

| # | Group | Level | EN title | New |
|---|---|---|---|---|
| 1 | `apple` | 1 | The Little Apple | |
| 2 | `dog` | 1 | The Little Dog | |
| 3 | `fish` | 1 | The Happy Fish | |
| 4 | `puddles` | 1 | Daisy and the Puddles | new |
| 5 | `paint` | 1 | Milo Paints a Picture | new |
| 6 | `taste` | 1 | Bibi Tries a Bite | new |
| 7 | `home` | 1 | Pepper Finds a Home | new |
| 8 | `hill` | 1 | Tess Goes Up the Hill | new |
| 9 | `duck` | 2 | The Shy Duck | |
| 10 | `lion` | 2 | The Lion's Nap | |
| 11 | `bear` | 2 | The Brave Little Bear | |
| 12 | `bedtime` | 2 | Just One More | new |
| 13 | `angry` | 2 | Rex and the Big Grrr | new |
| 14 | `helping` | 2 | Hazel Helps Grandma | new |
| 15 | `snow` | 2 | Milo Waits for Snow | new |
| 16 | `sharing` | 2 | Your Turn, My Turn | new |
| 17 | `cat` | 3 | The Curious Cat | |
| 18 | `owl` | 3 | The Wise Owl | |
| 19 | `letters` | 3 | Ollie's Letter Box | new |
| 20 | `cherries` | 3 | Boo's Ten Cherries | new |
| 21 | `balloon` | 3 | Bibi's Red Balloon | new |
| 22 | `bat` | 3 | Juno and the Sunset | new |
| 23 | `bike` | 3 | Rex Rides a Bike | new |
| 24 | `school` | 3 | Daisy's First Day | new |

## Notes for step C
- **Alt text per page and language:** not written yet. Write it in step C from the scenes, in each language.
- **Switching over:** `prisma/stories-data.ts`, the seed, `scripts/tts-histoires.ts` and `tests/i18n/stories.test.ts` still use the old 8×5 stories. Step C switches them to `prisma/stories-v2`. The old SVG scenes stay as the fallback when a picture is missing.
- **`isPremium`:** none of the stories is Premium yet.
