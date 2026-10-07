# SEO batch 2: proposed text changes (not applied)

Proposals for I1, I7, I8, M1 and M2 of [seo-audit.md](seo-audit.md). Nothing here is applied until the owner approves it, language by language. English first, then French, Spanish and Portuguese. Lengths are computed, not estimated: a title is shown as Google would get it, including " | AlphaBes" when rule R1 keeps it.

## Rules (code, all languages)

These shorten 952 titles over 60 characters to 73 without rewriting them one by one; the 73 are rewritten by hand in the tables below.

| Rule | What | Effect |
|---|---|---|
| R1 | The " \| AlphaBes" suffix is added only when the whole title stays within 60 characters (Google shows the site name separately, now helped by the `WebSite` JSON-LD) | Most long titles lose 11 characters, nothing else changes |
| R2 | Worksheet suffixes fall back when too long: " \| Free Printable PDF" → " (Free PDF)" → none; FR " \| Fiche PDF gratuite" → " (PDF gratuit)"; ES " \| Ficha PDF gratis" → " (PDF gratis)"; PT " \| Atividade em PDF grátis" → " (PDF grátis)"; the bundle/pack suffixes the same way | Worksheet, pack and bundle pages in 4 languages |
| R3 | Story descriptions (fr/es/pt today, en after I1): page 1 + page 2 + the closing sentence; if that exceeds 160 characters, page 1 + the closing sentence | 23 story descriptions back under 160 |
| R4 | English letter-bundle description pattern (26 pages), see the English table | 169 → 135 characters |

Examples of R1 + R2:

| Before (chars) | After (chars) |
|---|---|
| Uppercase Letter Practice Worksheets Bundle (A-Z) \| Free Printable PDF Bundle \| AlphaBes (88) | Uppercase Letter Practice Worksheets Bundle (A-Z) \| AlphaBes (60) |
| Letter Tracing Worksheets A-Z \| Free Printable PDFs \| AlphaBes (62) | Letter Tracing Worksheets A-Z \| Free Printable PDFs (51) |
| El número 19 (diecinueve): escribir y colorear \| Ficha PDF gratis \| AlphaBes (76) | El número 19 (diecinueve): escribir y colorear (PDF gratis) (59) |
| Reconhecer a letra Z nos quatro tipos de letra \| Atividade em PDF grátis \| AlphaBes (83) | Reconhecer a letra Z nos quatro tipos de letra (PDF grátis) (59) |
| Letter A Tracing Worksheet \| Free Printable PDF \| AlphaBes (58) | Letter A Tracing Worksheet \| Free Printable PDF \| AlphaBes (58) |

Legal pages, login, register, contact and about keep their short titles (people search for them by name).

## English

### I1. Story pages (8): title and description

Pattern: title `{title}: A Short Story to Read and Listen To`, description `{page1} A short illustrated story for young children to read together or listen to.` (page 1 is the text everyone can read).

| Page | Proposed title, as shown (chars) | Proposed description (chars) |
|---|---|---|
| `/stories/the-little-apple` | **The Little Apple: A Short Story to Read and Listen To** (53) | **Once upon a time, there was a little red apple. A short illustrated story for young children to read together or listen to.** (123) |
| `/stories/brave-little-bear` | **The Brave Little Bear: A Short Story to Read and Listen To** (58) | **In a cozy forest, there lived a small bear named Boo. A short illustrated story for young children to read together or listen to.** (129) |
| `/stories/the-curious-cat` | **The Curious Cat: A Short Story to Read and Listen To** (52) | **Milo the cat loved to explore new places. A short illustrated story for young children to read together or listen to.** (117) |
| `/stories/the-little-dog` | **The Little Dog: A Short Story to Read and Listen To** (51) | **Rex the dog loved to play in the park. A short illustrated story for young children to read together or listen to.** (114) |
| `/stories/the-shy-duck` | **The Shy Duck: A Short Story to Read and Listen To \| AlphaBes** (60) | **Daisy the duck lived by a calm pond. A short illustrated story for young children to read together or listen to.** (112) |
| `/stories/the-happy-fish` | **The Happy Fish: A Short Story to Read and Listen To** (51) | **Finn the fish lived in a coral reef. A short illustrated story for young children to read together or listen to.** (112) |
| `/stories/the-wise-owl` | **The Wise Owl: A Short Story to Read and Listen To \| AlphaBes** (60) | **Ollie the owl lived high in an old tree. A short illustrated story for young children to read together or listen to.** (116) |
| `/stories/the-lions-nap` | **The Lion's Nap: A Short Story to Read and Listen To** (51) | **Leo the lion loved to nap under the sun. A short illustrated story for young children to read together or listen to.** (116) |

### I8. Titles and H1s

| Page | Current title (chars) | Proposed title, as shown (chars) | H1 |
|---|---|---|---|
| `/pricing` | Pricing \| AlphaBes (18) | **AlphaBes Pro: Plans and Pricing \| AlphaBes** (42) | Pricing → **Plans and Pricing** |
| `/games` | Learning Games \| AlphaBes (25) | **Alphabet Games for Kids: Letters and Sounds \| AlphaBes** (54) | Fun Learning Games → **Alphabet Games for Kids** |
| `/games/find-the-letter` | Find the Letter \| AlphaBes (26) | **Find the Letter: Free Alphabet Game for Kids \| AlphaBes** (55) | unchanged |
| `/games/match-letter-picture` | Match Letter and Picture \| AlphaBes (35) | **Match the Letter and Picture: Free Phonics Game \| AlphaBes** (58) | unchanged |
| `/games/beginning-sound` | Beginning Sound \| AlphaBes (26) | **Beginning Sounds Game: Hear the First Sound \| AlphaBes** (54) | unchanged |
| `/games/letter-tracing` | Letter Tracing \| AlphaBes (25) | **Letter Tracing Game: Trace A to Z on Screen \| AlphaBes** (54) | unchanged |
| `/games/alphabet-quiz` | Alphabet Quiz \| AlphaBes (24) | **Alphabet Quiz: Letter Names and Sounds Game \| AlphaBes** (54) | unchanged |
| `/stories` | Story Time \| AlphaBes (21) | **Short Stories for Kids to Read and Listen To \| AlphaBes** (55) | Story Time → **Short Stories for Kids** |
| `/flashcards` | Flashcards \| AlphaBes (21) | **Alphabet Flashcards: A to Z Picture Words \| AlphaBes** (52) | Flashcards → **Alphabet Flashcards** |
| `/activities` | Activities \| AlphaBes (21) | **Hands-On Alphabet and Phonics Activities \| AlphaBes** (51) | Activities → **Alphabet and Phonics Activities** |
| `/phonics/letter-sounds` | Letter Sounds \| AlphaBes (24) | **Letter Sounds for Kids: A to Z with Examples \| AlphaBes** (55) | unchanged |
| `/phonics/beginning-sounds` | Beginning Sounds \| AlphaBes (27) | **Beginning Sounds: Hear the First Sound in a Word \| AlphaBes** (59) | unchanged |
| `/phonics/cvc-words` | CVC Words \| AlphaBes (20) | **CVC Words for Kids: Read Your First Words \| AlphaBes** (52) | unchanged |
| `/phonics/blending` | Blending \| AlphaBes (19) | **Blending Sounds: How Kids Learn to Read Words \| AlphaBes** (56) | unchanged |
| `/phonics/short-vowels` | Short Vowels \| AlphaBes (23) | **Short Vowel Sounds for Kids: a, e, i, o, u \| AlphaBes** (53) | unchanged |
| `/phonics/long-vowels` | Long Vowels \| AlphaBes (22) | **Long Vowel Sounds for Kids: Cake, Bike, Boat \| AlphaBes** (55) | unchanged |
| `/phonics/segmenting` | Segmenting \| AlphaBes (21) | **Segmenting: Break a Word into Its Sounds \| AlphaBes** (51) | unchanged |
| `/phonics/word-families` | Word Families \| AlphaBes (24) | **Word Families for Kids: -at, -ig, -un and More \| AlphaBes** (57) | unchanged |
| `/worksheets/tracing` | Tracing Worksheets \| AlphaBes (29) | **Tracing Worksheets for Preschool and Pre-K \| AlphaBes** (53) | unchanged |
| `/worksheets/phonics` | Phonics Worksheets \| AlphaBes (29) | **Phonics Worksheets for Kindergarten (Free PDF) \| AlphaBes** (57) | unchanged |
| `/worksheets/colors` | Colors Worksheets \| AlphaBes (28) | **Color Worksheets for Preschool (Free PDF) \| AlphaBes** (52) | unchanged |
| `/worksheets/bundles` | Worksheet Bundles \| AlphaBes (28) | **Alphabet Worksheet Bundles: A to Z in One PDF \| AlphaBes** (56) | unchanged |
| `/kindergarten` | Kindergarten Learning Activities: Sight Words, Writing & Phonics \| AlphaBes (75) | **Kindergarten Activities: Sight Words and Writing \| AlphaBes** (59) | unchanged |

### M2. Descriptions

| Page | Current (chars) | Proposed (chars) |
|---|---|---|
| `/stories` | AlphaBes teaches children ages 3-8 letters, phonics sounds, and early reading through interactive lessons, printable worksheets, and games. (139) | **Eight short illustrated stories for children ages 3 to 7 to read together or listen to: a little red apple, a brave bear, a curious cat and more.** (145) |
| `/activities` | Hands-on alphabet and phonics activities for home or classroom use. (67) | **Simple alphabet activities to pair with any letter lesson: find and circle letters, trace, sort pictures by first sound, and color by letter.** (141) |
| `/alphabet` | Learn the alphabet from A to Z with letter sounds, uppercase and lowercase letters, tracing practice, phonics activities, and free printable worksheets for preschool and kindergarten. (183) | **Learn the alphabet from A to Z: letter names and sounds, uppercase and lowercase, words to hear, tracing, and free printable worksheets.** (136) |
| `/contact` | Get in touch with the AlphaBes team. (36) | **Questions, ideas or a problem with a worksheet? Write to the AlphaBes team and we'll get back to you as soon as we can.** (119) |
| `/kindergarten` | Age-appropriate kindergarten learning activities from AlphaBes: sight words, independent handwriting, and phonics, with links to every relevant resource on the site. (165) | **Kindergarten activities from AlphaBes: sight words, writing letters without tracing, and phonics, with worksheets and games for ages 5 to 6.** (140) |
| `/kindergarten/handwriting` | Move from guided tracing to writing letters and words independently. (68) | **Kindergarten handwriting: move from guided tracing to writing letters and words on their own, with tips on size, spacing and pencil grip.** (137) |
| `/phonics` | Help children build early reading skills with phonics practice, letter sounds, beginning sounds, CVC words, blending activities, and printable phonics resources. (161) | **Phonics for kids: letter sounds, beginning sounds, CVC words, blending and word families, with examples, games and printable worksheets.** (136) |
| `/phonics/letter-sounds` | Match every letter to the sound it makes. (41) | **Letter sounds for kids: the sound each letter makes from A to Z, with example words and simple ways to practice them at home.** (125) |
| `/phonics/beginning-sounds` | Identify the first sound in a spoken word. (42) | **Beginning sounds: help your child hear the first sound in a word, like /b/ in ball, with listening games and picture activities.** (128) |
| `/phonics/cvc-words` | Sound out simple consonant-vowel-consonant words. (49) | **CVC words like cat, pig and sun are a child's first readable words. Learn how to sound them out, with examples and practice ideas.** (130) |
| `/phonics/blending` | Combine individual sounds smoothly into a word. (47) | **Blending sounds turns c-a-t into cat. How to teach blending step by step, with example words and short games to play at home.** (125) |
| `/phonics/short-vowels` | Practice the short sound of each vowel in simple words. (55) | **The short vowel sounds of a, e, i, o and u, as in apple, bed, pig, hot and sun, with example words and tips for early readers.** (126) |
| `/phonics/long-vowels` | Recognize the long, letter-name sound of each vowel. (52) | **Long vowels say their own name, like a in cake or o in boat. Examples, the silent e pattern, and when to teach long vowel sounds.** (129) |
| `/phonics/segmenting` | Break a spoken word into its individual sounds. (47) | **Segmenting means breaking a word into its sounds, like map into /m/ /a/ /p/. Why it matters for spelling, with examples and games.** (130) |
| `/phonics/word-families` | Spot common word endings shared by several simple words. (56) | **Word families like -at, -ig and -un help kids read new words fast: cat, hat, mat. Lists of examples and ways to practice them.** (126) |
| `/preschool` | Age-appropriate preschool learning activities from AlphaBes: letter recognition, tracing, coloring, and beginning sounds, with links to every relevant resource on the site. (172) | **Preschool activities from AlphaBes: letter recognition, tracing, coloring and first sounds, with free worksheets and games for ages 3 to 5.** (139) |
| `/pricing` | Compare AlphaBes Free and Pro plans. Pro is $7.99/month or $59/year. (68) | **Compare the AlphaBes Free and Pro plans. Pro is $7.99 a month or $59 a year and adds the premium games and whole-bundle downloads.** (130) |
| `/worksheets` | 260+ free printable alphabet worksheets: tracing, uppercase, lowercase, recognition, beginning sounds, coloring, matching, missing letter, writing practice, and review for every letter A-Z. (189) | **Free printable alphabet worksheets for every letter A to Z: tracing, uppercase, lowercase, recognition, beginning sounds, coloring and more.** (140) |
| `/worksheets/alphabet` | Letter recognition and formation practice for every letter A-Z. (63) | **Alphabet worksheets for every letter from A to Z: recognize, trace and write each letter in uppercase and lowercase. Free printable PDFs.** (137) |
| `/worksheets/alphabet-writing-practice` | Extended handwriting practice with guided tracing rows followed by independent writing lines for both the uppercase and lowercase letter, building writing stamina. (163) | **Writing practice for each letter: guided tracing rows, then lines to write the uppercase and lowercase letter on their own.** (123) |
| `/worksheets/beginning-sounds` | Practice identifying the first sound in a word. (47) | **Beginning sounds worksheets: circle the pictures that start with each letter's sound, from A to Z. Free printable PDFs for pre-K.** (129) |
| `/worksheets/coloring` | Letter-themed coloring pages that reinforce recognition through play. (69) | **Letter coloring pages from A to Z: a big outline letter and a picture that starts with it, to color and say aloud. Free printable PDFs.** (135) |
| `/worksheets/colors` | Color recognition and coloring practice. (40) | **Color worksheets for preschool: ten colors to recognize, color in and name, one page per color. Free printable PDFs to print at home.** (133) |
| `/worksheets/cvc-words` | Simple consonant-vowel-consonant word practice pages. (53) | **CVC word worksheets: read, trace and write simple words like cat, dog and sun, one word per page. Free printable PDFs for kindergarten.** (135) |
| `/worksheets/handwriting` | Line-based handwriting practice for uppercase and lowercase letters. (68) | **Handwriting worksheets with ruled lines for uppercase and lowercase letters, from tracing to writing on their own. Free printable PDFs.** (135) |
| `/worksheets/letter-coloring` | A printer-friendly coloring page featuring a large outline letter and a simple original illustration of a word that starts with it — reinforcing letter-word association through open-ended coloring. (197) | **Coloring pages with a big outline letter and a picture that starts with it, to link each letter to a word. One page per letter, A to Z.** (135) |
| `/worksheets/letter-cursive` | Cursive letter-formation practice for every letter A-Z. (55) | **Cursive letter worksheets for every letter A to Z: trace the joined uppercase and lowercase forms, then write them. Free printable PDFs.** (136) |
| `/worksheets/letter-recognition` | A mixed grid of uppercase and lowercase letters, including similar-looking distractors, for the child to find and circle every matching letter — building fast, confident letter recognition. (189) | **Letter recognition worksheets: find and circle every matching letter in a grid of look-alike letters. One page per letter, A to Z.** (130) |
| `/worksheets/letter-tracing` | Guided tracing practice with large dotted uppercase and lowercase letters, multiple practice rows, and space for independent writing. Builds pencil control and letter-shape memory. (180) | **Letter tracing worksheets with large dotted uppercase and lowercase letters, practice rows and space to write. One per letter, A to Z.** (134) |
| `/worksheets/numbers` | Tracing practice for numbers 0-9. (33) | **Number tracing worksheets from 0 to 9: trace each number, count and color, one page per number. Free printable PDFs for preschool.** (130) |
| `/worksheets/numbers-cursive` | Cursive-style tracing practice for numbers 0-9. (47) | **Cursive-style number tracing worksheets from 0 to 9, one page per number, to practice smooth, joined number shapes. Free printable PDFs.** (136) |
| `/worksheets/phonics` | Letter-sound, beginning-sound, and blending practice pages. (59) | **Phonics worksheets for every letter: letter sounds, beginning sounds and blending practice pages for pre-K and kindergarten. Free PDFs.** (135) |
| `/worksheets/shapes` | Tracing practice for common shapes. (35) | **Shape tracing worksheets: circle, square, triangle, star, heart and more, one shape per page to trace and name. Free printable PDFs.** (132) |
| `/worksheets/sight-words` | Practice pages for common sight words young readers see often. (62) | **Sight word worksheets for the first words kids read: a, and, I, in, is, it, the, to, was, you. Read, trace and write. Free PDFs.** (128) |
| `/worksheets/tracing` | Guided tracing pages to build pencil control and letter shapes. (63) | **Tracing worksheets for preschool and pre-K: guided pages for every letter A to Z to build pencil control and letter shapes. Free PDFs.** (134) |
| `/blog/alphabet` | Guides on teaching letter names, shapes, and recognition. (57) | **Articles for parents and teachers on teaching letter names, letter shapes and letter recognition, with simple ideas to try at home.** (131) |
| `/blog/fun-abc-games-for-kids` | Simple games that turn alphabet practice into play. (51) | **Simple ABC games that turn alphabet practice into play: letter hunts, sound games and quick ideas that need little or no preparation.** (133) |
| `/blog/how-to-practice-phonics-at-home` | Everyday routines that build phonics skills without extra flashcards. (69) | **Everyday routines that build phonics skills at home without extra flashcards: sounds in the car, at meals and during story time.** (128) |
| `/blog/how-to-teach-the-alphabet-to-preschoolers` | Simple, low-pressure ways to introduce letters to a 3-4 year old. (65) | **How to teach the alphabet to a 3 or 4 year old: simple, low-pressure ways to introduce letters, which letters to start with, and why.** (133) |
| `/blog/kindergarten` | Guides for kindergarten letter, phonics, and writing skills. (60) | **Articles on kindergarten letters, phonics and writing: what children learn at 5 and 6, and how parents can help at home.** (120) |
| `/blog/learning-activities` | Games and general activity ideas for early learners. (52) | **Games and activity ideas for early learners: quick, hands-on ways to practice letters and sounds at home or in class.** (117) |
| `/blog/phonics` | Letter sounds, blending, and early reading skills. (50) | **Articles on phonics for parents: letter sounds, blending, CVC words and early reading, with a simple timeline and ideas to try.** (127) |
| `/blog/preschool-activities` | Hands-on ideas for preschool-aged learners. (43) | **Hands-on preschool activity ideas for ages 3 to 5: letters, sounds and fine motor play, with little preparation needed.** (119) |
| `/blog/worksheets` | How to pick and use printable practice pages. (45) | **How to choose and use printable worksheets for preschool and kindergarten: what to look for, how often, and how to keep it fun.** (127) |

Letter bundles (26 pages, R4):

| Pages | Current (chars) | Proposed (chars) |
|---|---|---|
| `/worksheets/bundles/letter-{a…z}-bundle` | All 10 worksheet types for the letter Aa: tracing, uppercase, lowercase, recognition, beginning sounds, coloring, matching, missing letter, writing practice, and review. (169) | **All 10 worksheet types for the letter Aa in one PDF: tracing, recognition, beginning sounds, coloring, matching, writing and review.** (132) |

### I7. Content for the thin English pages

I7 is English only: the French, Spanish and Portuguese pages of the same kind are already written in depth. Each block below is new visible text, added under what the page shows today; nothing existing is removed. A technical part with no text, generating preview images for the English worksheets from their existing PDFs, is listed last.

#### Phonics skills (8 pages, `/phonics/*`): two new sections each

| Page | "How to practice at home" | "Watch out for" |
|---|---|---|
| Letter Sounds | 1. Pick three letters a day, not the whole alphabet. 2. Say the sound, not the name: /m/, not "em". Keep stop sounds short: /b/, not "buh". 3. Play "I spy something that starts with /s/" around the house. 4. Check with the flashcards: point to a letter, your child says its sound. | Letters with two common sounds (c, g) and the vowels. Start with the sound in the example word (c as in cat, g as in goat) and leave the others for later. |
| Beginning Sounds | 1. Say a word slowly and stretch the first sound: "ssssun". 2. Ask "What's the first sound?" before asking for the letter. 3. Sort small toys or pictures into two piles by their first sound. 4. Once it's easy, ask for the letter that makes that sound. | Words that start with a blend (stop, tree): the first sound is still just /s/ or /t/. Children often say the whole blend at first, and that's fine. |
| CVC Words | 1. Start with a word family your child knows: cat, hat, mat. 2. Point under each letter as you say its sound, then sweep your finger to read the word. 3. Change one letter at a time: cat → cut → cup. 4. Read the word, then find or draw its picture. | Saying each sound with an extra "uh" (cuh-a-tuh), which makes blending harder. Keep the sounds short and clean. |
| Blending | 1. Start with two sounds: /a/ + /t/ = at. 2. Say the sounds slowly without stopping between them, then faster. 3. Use continuous sounds first (m, s, f, l), which are easier to stretch. 4. Play "robot talk": you say c-a-t, your child says cat. | Pausing between sounds. If your child says the sounds but not the word, say them again faster each time until the word "pops out". |
| Short Vowels | 1. Teach one vowel at a time with one picture: a as in apple. 2. Read CVC words that change only the vowel: bat, bet, bit, bot, but. 3. Make a hand signal for each vowel. 4. Sort pictures by their middle sound. | Short e and short i, which sound alike to many children (pen, pin). Say them side by side and look at your mouth shape in a mirror. |
| Long Vowels | 1. Start once short vowels are automatic. 2. Show the silent e: cap → cape, kit → kite. 3. Say "the vowel says its name". 4. Sort words into short and long vowel piles. | Expecting every e at the end to be silent in every word. Keep to simple pairs (cap/cape, hop/hope) at first. |
| Segmenting | 1. Use three counters or claps for a three-sound word. 2. Say the word, then slide a counter for each sound: /m/ /a/ /p/. 3. Go from sounds back to the word to check. 4. Then write one letter for each counter. | Splitting into syllables instead of sounds. "Sun" is one syllable but three sounds: /s/ /u/ /n/. |
| Word Families | 1. Write the ending (-at) and change the first letter: c, h, m, s. 2. Read the list from top to bottom, faster each time. 3. Make a flip book or a wheel with the ending fixed. 4. Find the family in a story or a sign. | Nonsense words (zat, jat). They are good practice for blending, as long as your child knows they aren't real words. |

Each page also gets 6 to 8 more example words (from the existing worksheets' word lists) and links to the matching worksheets and games.

#### English worksheet pages (~380): a "How to use this worksheet" block

One short block per worksheet family, with the item's name filled in. Today these pages have one sentence; the block adds about 80 words, and the preview image adds what the page actually looks like.

| Family (pages) | Proposed block, for one example item |
|---|---|
| Letter worksheets (260, 10 types × 26 letters) | **How to use this worksheet.** Print it in black and white, at home or at school. Say the letter's name and its sound together before you start: "B, /b/, like ball." Let your child trace with a finger first, then with a pencil, starting at the dot. A few lines done well are better than a whole page done in a hurry. Then look for the letter B in a book or on a cereal box. |
| Number tracing (10) and cursive numbers (10) | **How to use this worksheet.** Count out 3 small objects before tracing the number 3, so the number means something. Trace the big number with a finger, then with a pencil, following the arrows. Say the word "three" as you write it. When the row is done, ask your child to circle their best one. |
| Shapes (10) | **How to use this worksheet.** Find a circle in the room before you start: a plate, a clock, a button. Trace the circle slowly, keeping the pencil on the line, then draw one on your own. Name the shape out loud each time. Tracing shapes builds the same hand control that letters need. |
| Colors (10) | **How to use this worksheet.** Have the red crayon ready and name the color together. Color the picture, then find three red things around you. Read the word "red" with your finger under it. One color a day is plenty for a three-year-old. |
| Sight words (10) | **How to use this worksheet.** Sight words like "the" don't follow the usual sound rules, so they are learned by seeing them often. Read the word together, trace it, then write it. Then hunt for "the" on a page of a picture book. Five minutes a day works better than one long session. |
| CVC words (10) | **How to use this worksheet.** Say each sound of "cat" slowly, /c/ /a/ /t/, then blend them into the word. Trace the word, then write it on your own. Change one letter to make a new word: cat → hat → hot. |

Technical part (no text): generate a preview JPEG for each English worksheet from its existing PDF in `public/worksheets-pdf/`, with the same script approach as the French previews, and show it instead of the letter placeholder. Previews and thumbnails would also fill the English worksheets' `og:image` and the `image` field of their `LearningResource` JSON-LD.

#### English game pages (5): "How to play" and "What your child practices"

| Game | How to play | What your child practices |
|---|---|---|
| Find the Letter | A letter is named at the top. Tap every matching letter in the grid as fast as you can; a wrong tap just shakes, so there's nothing to lose. | Recognizing a letter quickly in uppercase and lowercase, among letters that look alike. |
| Match the Letter and Picture | Each round shows a letter and a few pictures. Tap the picture whose name starts with that letter's sound. | Linking each letter to its sound and to words that start with it. |
| Beginning Sounds (Pro) | Listen to a word, then choose the letter that matches its first sound. Tap the speaker to hear the word again. | Hearing the first sound in a spoken word, the first step toward spelling. |
| Letter Tracing (Pro) | Trace each letter on the screen with a finger or a mouse, following the start dot and the arrows. | Letter formation: where to start each letter and which way to go. |
| Alphabet Quiz (Pro) | Answer short multiple-choice questions about letter names and sounds. | Checking what your child already knows, letter by letter. |

The "How to play" text must be checked against each game as it actually plays before it goes live (for example, what happens on a wrong answer).

#### Blog category pages (6): an introduction (about 50 words each)

| Category | Proposed introduction |
|---|---|
| Alphabet | How do children learn their letters, and in what order? These articles cover letter names and shapes, uppercase versus lowercase, and simple ways to practice recognition at home, with ideas you can try in five minutes. |
| Phonics | Phonics links letters to sounds, the key to reading. Read when to start letter sounds, how to practice them at home without drills, and how children move from single sounds to their first CVC words. |
| Worksheets | Printable worksheets work best in small doses. These guides help you choose the right worksheets for your child's age, use them without tears, and know when to switch to a game instead. |
| Preschool Activities | Hands-on ideas for children aged 3 to 5: letter hunts, play dough letters, sound games and other activities that need little preparation and no screen. |
| Kindergarten | What do children learn about letters, sounds and writing in kindergarten? Practical articles for parents who want to support reading and handwriting at home. |
| Learning Activities | Quick games and activities for early learners: ways to practice letters and sounds in the car, at the table or on a walk. |

The blog categories have only 1 to 3 articles each. An alternative to writing introductions is to `noindex` the category pages and keep the articles indexed.

## French

### Titles (I8 for pricing, M1 for the rest; all others follow rules R1 and R2)

| Page | Current title (chars) | Proposed title, as shown (chars) | H1 |
|---|---|---|---|
| `/fr/tarifs` | Tarifs \| AlphaBes (17) | **AlphaBes Pro : formules et tarifs \| AlphaBes** (44) | Tarifs → **Formules et tarifs** |
| `/fr/fiches` | Fiches gratuites à imprimer : alphabet, écriture cursive et sons \| AlphaBes (75) | **Fiches à imprimer gratuites : alphabet, cursive, sons** (53) | unchanged |
| `/fr/grande-section` | Grande section : lettres, syllabes et écriture cursive (5-6 ans) \| AlphaBes (75) | **Grande section : lettres, syllabes et cursive (5-6 ans)** (55) | unchanged |
| `/fr/histoires/moustache-le-chat-curieux` | Moustache, le chat curieux : une histoire à lire et à écouter \| AlphaBes (72) | **Moustache, le chat curieux : histoire à lire et à écouter** (57) | unchanged |
| `/fr/jeux/lettre-et-image` | Associe la lettre et l'image : jeu éducatif gratuit pour apprendre les lettres \| AlphaBes (89) | **Associe la lettre et l'image : jeu gratuit \| AlphaBes** (53) | unchanged |
| `/fr/jeux/quiz-alphabet` | Le quiz de l'alphabet : jeu éducatif pour apprendre les lettres \| AlphaBes (74) | **Le quiz de l'alphabet : jeu pour apprendre les lettres** (54) | unchanged |
| `/fr/jeux/trouve-la-lettre` | Trouve la lettre : jeu éducatif gratuit pour apprendre les lettres \| AlphaBes (77) | **Trouve la lettre : jeu gratuit pour apprendre les lettres** (57) | unchanged |
| `/fr/maternelle` | Petite et moyenne section : activités pour apprendre les lettres (3-5 ans) \| AlphaBes (85) | **Maternelle : apprendre les lettres en PS et MS (3-5 ans)** (56) | unchanged |
| `/fr/maternelle/coloriage` | Coloriage des lettres en maternelle : apprendre l'alphabet en coloriant \| AlphaBes (82) | **Coloriage des lettres en maternelle : l'alphabet à colorier** (59) | unchanged |
| `/fr/maternelle/tracer-les-lettres` | Tracer les lettres en maternelle : capitales d'abord, sans stress \| AlphaBes (76) | **Tracer les lettres en maternelle : les capitales d'abord** (56) | unchanged |
| `/fr/sons` | Les sons du français : apprendre à lire en maternelle et au CP \| AlphaBes (73) | **Les sons du français : apprendre à lire, maternelle et CP** (57) | unchanged |
| `/fr/sons/ill` | Le son ill (ill, ail, eil, euil, ouil) : mots et exercice (CP) \| AlphaBes (73) | **Le son ill (ill, ail, eil, euil, ouil) : mots et exercice** (57) | unchanged |
| `/fr/sons/lettres-muettes` | Les lettres muettes : le h, les consonnes finales, le e muet (CP) \| AlphaBes (76) | **Les lettres muettes : le h, les consonnes finales, le e muet** (60) | unchanged |

### Descriptions (M2)

| Page | Current (chars) | Proposed (chars) |
|---|---|---|
| `/fr/activites` | Huit activités faciles à faire à la maison ou en classe, avec ce qu'on a sous la main : chasse aux lettres, pâte à modeler, plateau de semoule, sac à sons, loto, mémory… De la petite section au CP. (197) | **Huit activités faciles à la maison ou en classe : chasse aux lettres, pâte à modeler, plateau de semoule, loto, mémory… De la PS au CP.** (135) |
| `/fr/alphabet` | Apprendre l'alphabet français de A à Z : le nom et le son de chaque lettre, des mots illustrés à écouter, les accents (é, è, ê, ç) et des fiches de tracé en script et en cursive. (178) | **L'alphabet de A à Z : le nom et le son de chaque lettre, des mots illustrés à écouter, les accents et des fiches de tracé en script et en cursive.** (146) |
| `/fr/alphabet/accents` | Les accents expliqués aux enfants et aux parents : ceux qui changent le son (é, è, ê, ç) et ceux qui ne le changent pas (à, ù, â, î, ô, û), le tréma et le e dans l'o. (166) | **Les accents expliqués aux enfants : ceux qui changent le son (é, è, ê, ç), ceux qui ne le changent pas (à, ù, â, î…), le tréma et le e dans l'o.** (144) |
| `/fr/contact` | Une question ou une suggestion ? Écrivez à l'équipe AlphaBes. (61) | **Une question, une suggestion ou un souci avec une fiche ? Écrivez à l'équipe AlphaBes, nous vous répondons au plus vite.** (120) |
| `/fr/cookies` | Les cookies utilisés par AlphaBes et comment gérer vos choix. (61) | **Les cookies utilisés par AlphaBes, à quoi ils servent et comment accepter, refuser ou modifier vos choix à tout moment.** (119) |
| `/fr/fiches` | 238 fiches gratuites en PDF pour la maternelle et le CP : tracé des lettres, écriture cursive sur lignes Seyès, reconnaissance, sons, syllabes, nombres, formes et couleurs. (172) | **238 fiches gratuites en PDF pour la maternelle et le CP : tracé des lettres, cursive sur Seyès, sons, syllabes, nombres, formes et couleurs.** (140) |
| `/fr/fiches/formes` | Rond, carré, triangle… repasser les formes et écrire leur nom. (62) | **Rond, carré, triangle, étoile… des fiches pour repasser les formes et écrire leur nom. Gratuites, à imprimer, pour la maternelle.** (129) |
| `/fr/fiches/packs` | Plusieurs fiches dans un seul PDF : le pack alphabet complet, toutes les fiches d'une lettre, ou tout un type de fiche de A à Z. Gratuit, pour la maternelle et le CP. (166) | **Plusieurs fiches dans un seul PDF : l'alphabet complet, toutes les fiches d'une lettre, ou un type de fiche de A à Z. Maternelle et CP.** (135) |
| `/fr/grande-section` | Toutes les lettres, les syllabes, les premiers mots-outils et l'écriture cursive : des idées, des jeux et des fiches pour la grande section, l'année qui prépare au CP. (167) | **Les lettres, les syllabes, les premiers mots-outils et l'écriture cursive : idées, jeux et fiches pour la grande section, avant le CP.** (134) |
| `/fr/histoires` | Huit petites histoires illustrées pour les enfants de 3 à 7 ans, à lire ensemble ou à écouter : une pomme, un ourson, un chat curieux, un lion qui veut faire la sieste… (168) | **Huit petites histoires illustrées pour les 3-7 ans, à lire ensemble ou à écouter : une pomme, un ourson, un chat curieux, un lion qui fait la sieste…** (149) |
| `/fr/jeux` | Cinq jeux en français pour la maternelle et le CP, dont deux gratuits : trouver une lettre, associer la lettre et l'image, entendre le premier son, tracer les lettres en cursive et un quiz de l'alphabet. (203) | **Cinq jeux pour la maternelle et le CP, dont deux gratuits : trouver une lettre, l'associer à une image, le premier son, le tracé et un quiz.** (140) |
| `/fr/maternelle` | Graphisme, tracé des lettres en capitales, coloriage et premiers sons : des idées et des fiches pour accompagner un enfant de petite et moyenne section, à la maison. (165) | **Graphisme, tracé des lettres en capitales, coloriage et premiers sons : idées et fiches pour accompagner un enfant de PS et MS à la maison.** (139) |
| `/fr/sons` | Les voyelles, la syllabe, puis les sons ou, on, an, in, oi, ch… Des pages à écouter, avec des mots illustrés, une phrase à lire et un petit jeu, pour apprendre à lire pas à pas. (177) | **Les voyelles, la syllabe, puis ou, on, an, in, oi, ch… Des pages à écouter, des mots illustrés, une phrase à lire et un jeu, pour apprendre à lire.** (147) |
| `/fr/sons/e-accent-aigu` | Le son de bébé, qui s'écrit é, et aussi er ou ez à la fin des mots. (67) | **Le son [e] de bébé, qui s'écrit é, et aussi er ou ez à la fin des mots : des mots illustrés à écouter, une phrase à lire et un jeu.** (131) |
| `/fr/sons/e-accent-grave` | Le son de chèvre, de forêt, de fraise et de reine : è, ê, ai, ei. (65) | **Le son [ɛ] de chèvre, de forêt, de fraise et de reine, qui s'écrit è, ê, ai ou ei : des mots à écouter, une phrase à lire et un jeu.** (132) |
| `/fr/sons/eu` | Le son de feu, de fleur et de cœur, qui s'écrit eu ou œu. (57) | **Le son [ø] de feu, de fleur et de cœur, qui s'écrit eu ou œu : des mots illustrés à écouter, une phrase à lire et un petit jeu (CP).** (132) |
| `/fr/sons/gn` | g et n ensemble font [ɲ], le son de champignon et de montagne. (62) | **g et n ensemble font [ɲ], le son de champignon et de montagne : des mots illustrés à écouter, une phrase à lire et un petit jeu (CP).** (133) |
| `/fr/sons/in` | Le son de lapin, de main et de pain, qui s'écrit in, im, ain ou ein. (68) | **Le son [ɛ̃] de lapin, de main et de pain, qui s'écrit in, im, ain ou ein : des mots à écouter, une phrase à lire et un petit jeu (CP).** (134) |
| `/fr/sons/o-au-eau` | Le son [o] s'écrit o, au ou eau : vélo, auto, bateau. (53) | **Le son [o] s'écrit o, au ou eau : vélo, auto, bateau. Des mots illustrés à écouter, une phrase à lire et un petit jeu, pour le CP.** (130) |
| `/fr/sons/oi` | o et i ensemble font [wa], comme dans roi et étoile. (52) | **o et i ensemble font [wa], comme dans roi et étoile : des mots illustrés à écouter, une phrase à lire et un petit jeu, pour le CP.** (130) |
| `/fr/sons/on` | Le son de ballon et de pont, qui s'écrit on, ou om devant b et p. (65) | **Le son [ɔ̃] de ballon et de pont, qui s'écrit on, ou om devant b et p : des mots à écouter, une phrase à lire et un petit jeu (CP).** (131) |

Story descriptions (8): rule R3. Example: *Il était une fois une petite pomme rouge, toute ronde. Une histoire illustrée pour les enfants, à lire ensemble ou à écouter.* (125).

## Spanish

### Titles (I8 for pricing, M1 for the rest; all others follow rules R1 and R2)

| Page | Current title (chars) | Proposed title, as shown (chars) | H1 |
|---|---|---|---|
| `/es/precios` | Precios \| AlphaBes (18) | **AlphaBes Pro: planes y precios \| AlphaBes** (41) | Precios → **Planes y precios** |
| `/es/abecedario` | El abecedario para niños: las 27 letras, sus sonidos y palabras \| AlphaBes (74) | **El abecedario para niños: las 27 letras y sus sonidos** (53) | unchanged |
| `/es/abecedario/tilde` | La tilde y la diéresis: á, é, í, ó, ú y ü explicadas a los niños \| AlphaBes (75) | **La tilde y la diéresis explicadas a los niños \| AlphaBes** (56) | unchanged |
| `/es/actividades` | Actividades para aprender las letras y las sílabas, sin pantallas \| AlphaBes (76) | **Actividades para aprender letras y sílabas, sin pantallas** (57) | unchanged |
| `/es/fichas` | Fichas para imprimir gratis: abecedario, letra cursiva y sílabas \| AlphaBes (75) | **Fichas para imprimir gratis: abecedario, cursiva y sílabas** (58) | unchanged |
| `/es/juegos/aplaude-las-silabas` | Aplaude las sílabas: juego educativo gratis para aprender a leer \| AlphaBes (75) | **Aplaude las sílabas: juego gratis para aprender a leer** (54) | unchanged |
| `/es/juegos/encuentra-la-letra` | Encuentra la letra: juego educativo gratis para aprender a leer \| AlphaBes (74) | **Encuentra la letra: juego gratis para aprender a leer** (53) | unchanged |
| `/es/juegos/letra-y-dibujo` | La letra y el dibujo: juego educativo gratis para aprender a leer \| AlphaBes (76) | **La letra y el dibujo: juego gratis para aprender a leer** (55) | unchanged |
| `/es/juegos/primera-silaba` | ¿Con qué sílaba empieza?: juego educativo para aprender a leer \| AlphaBes (73) | **¿Con qué sílaba empieza?: juego para aprender a leer** (52) | unchanged |
| `/es/kinder/silabas` | Las sílabas en kínder: aplaudir, contar y unir ma, me, mi, mo, mu \| AlphaBes (76) | **Las sílabas en kínder: aplaudir, contar y unir \| AlphaBes** (57) | unchanged |
| `/es/preescolar` | Preescolar: actividades para aprender las letras (3 a 5 años) \| AlphaBes (72) | **Preescolar: actividades para aprender las letras (3-5 años)** (59) | unchanged |
| `/es/preescolar/colorear` | Colorear las letras en preescolar: aprender el abecedario coloreando \| AlphaBes (79) | **Colorear las letras en preescolar: el abecedario \| AlphaBes** (59) | unchanged |
| `/es/preescolar/traza-las-letras` | Trazar las letras en preescolar: primero su nombre, sin prisas \| AlphaBes (73) | **Trazar las letras en preescolar: primero su nombre** (50) | unchanged |
| `/es/preescolar/trazos` | Trazos para preescolar: preparar la mano para escribir (grafomotricidad) \| AlphaBes (83) | **Trazos para preescolar: grafomotricidad para escribir** (53) | unchanged |
| `/es/silabas` | Las sílabas: aprender a leer en español con el método silábico \| AlphaBes (73) | **Las sílabas: aprender a leer con el método silábico** (51) | unchanged |
| `/es/silabas/palabras-frecuentes` | Palabras frecuentes para leer de corrido: el, la, un, y, de, en \| AlphaBes (74) | **Palabras frecuentes para leer de corrido: el, la, un, y** (55) | unchanged |
| `/es/silabas/silabas-mixtas` | Sílabas mixtas (cerradas): sol, pan, mar, con palabras para leer \| AlphaBes (75) | **Sílabas mixtas (cerradas): sol, pan, mar, con palabras** (54) | unchanged |
| `/es/silabas/trabadas-con-l` | Sílabas trabadas con l: bla, cla, fla, gla, pla, con palabras \| AlphaBes (72) | **Sílabas trabadas con l: bla, cla, fla, gla, pla \| AlphaBes** (58) | unchanged |

### Descriptions (M2)

| Page | Current (chars) | Proposed (chars) |
|---|---|---|
| `/es` | Fichas gratis para imprimir, trazo de letras, sílabas y primeras lecturas para preescolar, kínder y primero de primaria. Lecciones y juegos interactivos para niños de 3 a 8 años. (178) | **Fichas gratis para imprimir, trazo de letras, sílabas y primeras lecturas para preescolar y primaria. Juegos y lecciones para niños de 3 a 8 años.** (146) |
| `/es/abecedario` | Aprende el abecedario en español de la A a la Z, con la Ñ: el nombre y el sonido de cada letra, sus sílabas, palabras con dibujos para escuchar y el trazo en letra script y cursiva. (181) | **El abecedario de la A a la Z, con la Ñ: el nombre y el sonido de cada letra, sus sílabas, palabras con dibujos y el trazo en script y cursiva.** (142) |
| `/es/actividades` | Ocho actividades fáciles para hacer en casa o en el salón con lo que hay a la mano: buscar letras, plastilina, la bandeja de sal, «Veo, veo» con sílabas, aplaudir y saltar las sílabas, bingo y juego de memoria. De 3 a 7 años. (225) | **Ocho actividades fáciles para la casa o el salón: buscar letras, plastilina, la bandeja de sal, «Veo, veo» con sílabas, bingo y memoria. De 3 a 7 años.** (151) |
| `/es/contacto` | ¿Tienes una pregunta o una sugerencia? Escribe al equipo de AlphaBes. (69) | **¿Tienes una pregunta, una sugerencia o un problema con una ficha? Escribe al equipo de AlphaBes y te respondemos lo antes posible.** (130) |
| `/es/cookies` | Las cookies que usa AlphaBes y cómo administrar tus preferencias. (65) | **Las cookies que usa AlphaBes, para qué sirven y cómo aceptar, rechazar o cambiar tus preferencias en cualquier momento.** (119) |
| `/es/cuentos` | Ocho cuentos cortos ilustrados para niños de 3 a 7 años, para leer juntos o escuchar: una manzanita, un osito valiente, una gatita curiosa, un león que quiere dormir la siesta… (176) | **Ocho cuentos cortos ilustrados para niños de 3 a 7 años, para leer juntos o escuchar: una manzanita, un osito valiente, una gatita curiosa…** (139) |
| `/es/fichas` | 239 fichas gratis en PDF para preescolar, kínder y primero de primaria: trazo de letras, letra cursiva en doble raya, sílabas, números en cuadrícula, figuras y colores. (168) | **239 fichas gratis en PDF para preescolar y primaria: trazo de letras, cursiva en doble raya, sílabas, números en cuadrícula, figuras y colores.** (143) |
| `/es/fichas/paquetes` | Varias fichas en un solo PDF: el abecedario completo, todas las fichas de una letra, las sílabas o un tipo de ficha de la A a la Z. Gratis, para preescolar y primero de primaria. (178) | **Varias fichas en un solo PDF: el abecedario completo, todas las fichas de una letra, las sílabas o un tipo de ficha de la A a la Z.** (131) |
| `/es/juegos` | Seis juegos en español para preescolar y primer grado, tres de ellos gratis: encontrar letras, unir la letra con su dibujo, la primera sílaba, trazar letras en cursiva, el quiz del abecedario y aplaudir las sílabas. (215) | **Seis juegos para preescolar y primer grado, tres gratis: encontrar letras, la letra y su dibujo, la primera sílaba, trazar, un quiz y aplaudir sílabas.** (151) |
| `/es/silabas` | Las vocales, las sílabas directas (ma, me, mi, mo, mu), inversas, mixtas y trabadas, y los casos especiales: ch, ll, rr, que, gue, güe, la h muda. Con palabras para escuchar, oraciones y juegos. (194) | **Las vocales, las sílabas directas (ma, me, mi, mo, mu), inversas, mixtas y trabadas, y los casos especiales: ch, ll, rr, que, gue, la h muda.** (141) |

Story descriptions (8): rule R3. Example: *Había una vez una manzanita roja, redonda y bonita. Un cuento ilustrado para niños, para leer juntos o escuchar.* (112).

## Portuguese

### Titles (I8 for pricing, M1 for the rest; all others follow rules R1 and R2)

| Page | Current title (chars) | Proposed title, as shown (chars) | H1 |
|---|---|---|---|
| `/pt/precos` | Preços \| AlphaBes (17) | **AlphaBes Pro: planos e preços \| AlphaBes** (40) | Preços → **Planos e preços** |
| `/pt/alfabeto` | O alfabeto para crianças: as 26 letras, os sons e as palavras \| AlphaBes (72) | **O alfabeto para crianças: as 26 letras e os sons \| AlphaBes** (59) | unchanged |
| `/pt/alfabeto/acentos` | Os acentos e o til: á, â, ã, é, ê, ó, ô, õ explicados para crianças \| AlphaBes (78) | **Os acentos e o til explicados para crianças \| AlphaBes** (54) | unchanged |
| `/pt/atividades` | Atividades para imprimir grátis: alfabeto, letra cursiva e sílabas \| AlphaBes (77) | **Atividades para imprimir grátis: alfabeto, cursiva, sílabas** (59) | unchanged |
| `/pt/educacao-infantil` | Educação infantil: atividades para aprender as letras (3 a 5 anos) \| AlphaBes (77) | **Educação infantil: atividades com as letras (3 a 5 anos)** (56) | unchanged |
| `/pt/educacao-infantil/colorir` | Colorir as letras na educação infantil: aprender o alfabeto pintando \| AlphaBes (79) | **Colorir as letras na educação infantil: o alfabeto** (50) | unchanged |
| `/pt/educacao-infantil/coordenacao-motora` | Coordenação motora fina na educação infantil: preparar a mão para escrever \| AlphaBes (85) | **Coordenação motora fina: preparar a mão para escrever** (53) | unchanged |
| `/pt/educacao-infantil/tracar-as-letras` | Traçar as letras na educação infantil: primeiro o nome, em letra bastão \| AlphaBes (82) | **Traçar as letras: primeiro o nome, em letra bastão** (50) | unchanged |
| `/pt/jogos/letra-e-figura` | A letra e a figura: jogo educativo grátis para aprender a ler \| AlphaBes (72) | **A letra e a figura: jogo grátis para aprender a ler** (51) | unchanged |
| `/pt/primeiro-ano` | 1º ano: famílias silábicas, primeiras leituras e letra cursiva (6 a 7 anos) \| AlphaBes (86) | **1º ano: famílias silábicas, leitura e letra cursiva** (51) | unchanged |
| `/pt/primeiro-ano/familias-silabicas` | Famílias silábicas no 1º ano: como ajudar a criança a ler em casa \| AlphaBes (76) | **Famílias silábicas no 1º ano: como ajudar em casa \| AlphaBes** (60) | unchanged |
| `/pt/primeiro-ano/palavras-frequentes` | Palavras frequentes no 1º ano: o, a, um, e, de, que, para ler com fluência \| AlphaBes (85) | **Palavras frequentes no 1º ano: ler com fluência \| AlphaBes** (58) | unchanged |
| `/pt/silabas/ar-er-ir-or-ur` | O R no fim da sílaba: ar, er, ir, or, ur (mar, porta, sorvete) \| AlphaBes (73) | **O R no fim da sílaba: ar, er, ir, or, ur \| AlphaBes** (51) | unchanged |
| `/pt/silabas/as-es-is-os-us` | O S no fim da sílaba: as, es, is, os, us (escola, castelo, ônibus) \| AlphaBes (77) | **O S no fim da sílaba: as, es, is, os, us \| AlphaBes** (51) | unchanged |
| `/pt/silabas/encontros-com-r` | Encontros consonantais com R: bra, cra, dra, fra, gra, pra, tra \| AlphaBes (74) | **Encontros consonantais com R: bra, cra, pra, tra \| AlphaBes** (59) | unchanged |
| `/pt/silabas/encontros-vocalicos` | Encontros vocálicos: ai, ei, oi, ou, au, eu, ui, com palavras \| AlphaBes (72) | **Encontros vocálicos: ai, ei, oi, ou, au, eu, ui \| AlphaBes** (58) | unchanged |
| `/pt/silabas/palavras-frequentes` | Palavras frequentes para ler com fluência: o, a, um, e, de, que \| AlphaBes (74) | **Palavras frequentes para ler com fluência: o, a, um, e** (54) | unchanged |

Letter worksheet pages (27, `/pt/alfabeto/{a…z, c-cedilha}/atividade`): `Letra {L}: atividade de traçado em letra bastão, de forma e cursiva` → **`Letra {L}: traçado em letra bastão, de forma e cursiva`**, e.g. **Letra A: traçado em letra bastão, de forma e cursiva** (52).

H1 on the pricing page: see the table. No other H1 changes.

### Descriptions (M2)

| Page | Current (chars) | Proposed (chars) |
|---|---|---|
| `/pt` | Atividades de alfabetização grátis para imprimir, traçado de letras, famílias silábicas e primeiras leituras para a educação infantil e o 1º ano. Lições e jogos interativos para crianças de 3 a 8 anos. (201) | **Atividades de alfabetização grátis para imprimir, traçado, famílias silábicas e primeiras leituras. Jogos e lições para crianças de 3 a 8 anos.** (143) |
| `/pt/alfabeto` | Aprenda o alfabeto de A a Z, com o Ç: o nome e o som de cada letra, a família silábica, palavras com figuras para ouvir e o traçado em letra bastão, de forma e cursiva. (168) | **O alfabeto de A a Z, com o Ç: o nome e o som de cada letra, a família silábica, palavras com figuras e o traçado em bastão, forma e cursiva.** (140) |
| `/pt/atividades` | 272 atividades de alfabetização grátis em PDF para a educação infantil e o 1º ano: letra bastão, letra de forma, letra cursiva com caligrafia, famílias silábicas, números no quadriculado, formas e cores. (203) | **272 atividades grátis em PDF para a educação infantil e o 1º ano: letra bastão, de forma e cursiva, famílias silábicas, números, formas e cores.** (144) |
| `/pt/atividades/cores` | Dez cores: colorir a figura com a cor certa e escrever o nome da cor. (69) | **Dez cores para reconhecer: colorir a figura com a cor certa e escrever o nome da cor. Atividades grátis em PDF para imprimir.** (125) |
| `/pt/atividades/pacotes` | Várias atividades num só PDF: o alfabeto completo, todas as atividades de uma letra, as famílias silábicas ou um tipo de atividade de A a Z. Grátis, para a educação infantil e o 1º ano. (185) | **Várias atividades num só PDF: o alfabeto completo, todas as atividades de uma letra, as famílias silábicas ou um tipo de atividade.** (131) |
| `/pt/atividades/reconhecer-letras` | Achar a letra nos quatro tipos de letra entre letras parecidas. (63) | **Achar a letra nos quatro tipos de letra, entre letras parecidas: uma atividade por letra, de A a Z. Grátis, em PDF para imprimir.** (129) |
| `/pt/brincadeiras` | Oito brincadeiras fáceis para fazer em casa ou na escola com o que se tem à mão: procurar letras, massinha, a bandeja de sal, “Eu vejo” com sílabas, bater palmas e pular as sílabas, bingo e jogo da memória. De 3 a 7 anos. (221) | **Oito brincadeiras fáceis em casa ou na escola: procurar letras, massinha, bandeja de sal, “Eu vejo” com sílabas, bingo e memória. De 3 a 7 anos.** (144) |
| `/pt/contato` | Tem uma pergunta ou uma sugestão? Escreva para a equipe do AlphaBes. (68) | **Tem uma pergunta, uma sugestão ou um problema com uma atividade? Escreva para a equipe do AlphaBes e respondemos o quanto antes.** (128) |
| `/pt/cookies` | Os cookies que o AlphaBes usa e como gerenciar as suas preferências. (68) | **Os cookies que o AlphaBes usa, para que servem e como aceitar, recusar ou mudar as suas preferências a qualquer momento.** (120) |
| `/pt/historias` | Oito histórias curtas ilustradas para crianças de 3 a 7 anos, para ler juntos ou ouvir: uma maçãzinha, um ursinho corajoso, uma gatinha curiosa, um leão que quer tirar uma soneca… (179) | **Oito histórias curtas ilustradas para crianças de 3 a 7 anos, para ler juntos ou ouvir: uma maçãzinha, um ursinho corajoso, uma gatinha…** (136) |
| `/pt/jogos` | Seis jogos em português para a educação infantil e o 1º ano, três deles grátis: encontrar letras, ligar a letra à figura, a sílaba inicial, traçar letras em cursiva, o quiz do alfabeto e bater palmas para as sílabas. (216) | **Seis jogos para a educação infantil e o 1º ano, três grátis: encontrar letras, letra e figura, sílaba inicial, traçado, quiz e bater palmas.** (140) |
| `/pt/primeiro-ano` | As famílias silábicas, as primeiras palavras e frases, as palavras frequentes e a letra cursiva: ideias, jogos e atividades para o ano da alfabetização, aos 6 anos. (164) | **As famílias silábicas, as primeiras palavras e frases, as palavras frequentes e a letra cursiva: ideias, jogos e atividades para os 6 anos.** (139) |
| `/pt/silabas` | As vogais, os encontros vocálicos, as famílias silábicas (ba, be, bi, bo, bu), os dígrafos (ch, lh, nh, rr, ss, qu, gu), os sons nasais e as sílabas complexas. Com palavras para ouvir, frases e jogos. (200) | **As vogais, os encontros vocálicos, as famílias silábicas, os dígrafos (ch, lh, nh, rr, ss, qu, gu), os sons nasais e as sílabas complexas.** (138) |

Story descriptions (7): rule R3. Example: *Era uma vez uma maçãzinha vermelha, redonda e bonita. Uma história ilustrada para crianças, para ler juntos ou ouvir.* (117).

