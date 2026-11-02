# Stories v2: plan and English stories

The brief is `../owl-design/PROMPT-stories.md`. The work is on branch `stories-v2`.

The goal: rewrite the 8 stories as real little stories, add 16 new ones (24 in all, 8 per level, in EN/FR/ES/PT), and replace the SVG scenes with Canva illustrations.

## Status
- **Step A (2026-11-02): done, waiting for the owner's review.** The 24 English stories are below. The character sheet prompts are in `../owl-design/stories/prompts.md`.
- **Step B:** write FR/ES/PT, all the cover and page prompts, and `MISSING.txt`.
- **Step C:** image script, reader, listing, seed, tests, build and browser check.

## Decisions
- **Levels:** Level 1 is ages 3–4 (6 pages, one short sentence). Level 2 is ages 4–6 (7 pages, 1–2 sentences). Level 3 is ages 6–8 (8 pages, 2–3 sentences with dialogue).
- **Kept slugs and groups:** the 8 existing stories keep their slugs and `translationGroup` (`apple`, `dog`, `fish`, `duck`, `lion`, `bear`, `cat`, `owl`). Their plots stay close to the old ones.
- **One cast of friends** across all the stories. Each character has a fixed description used word for word in every prompt. The English hero names stay as they are. FR/ES/PT keep their existing names for the kept stories.
- **The alphabet story uses only letters whose word starts the same way in all four languages, so one picture works for all of them:**
  - A: airplane / avion / avión / avião
  - B: ball / ballon / balón / bola
  - E: elephant / éléphant / elefante / elefante
  - L: lion / lion / león / leão
  - T: tomato / tomate / tomate / tomate
  - U: ukulele / ukulélé / ukelele / ukulele

## Overview

| # | Title | Level | Group · EN slug | | Main characters | Theme |
|---|---|---|---|---|---|---|
| 1 | The Little Apple | 1 | `apple` · `the-little-apple` | kept | Hazel, Boo | trying again, sharing |
| 2 | The Little Dog | 1 | `dog` · `the-little-dog` | kept | Rex | a lost thing found |
| 3 | The Happy Fish | 1 | `fish` · `the-happy-fish` | kept | Finn, Shelly | friendship |
| 4 | Daisy and the Puddles | 1 | `puddles` · `daisy-and-the-puddles` | new | Daisy, Mama Duck | counting 1–5, weather |
| 5 | Milo Paints a Picture | 1 | `paint` · `milo-paints-a-picture` | new | Milo, Mama Cat | colors |
| 6 | Bibi Tries a Bite | 1 | `taste` · `bibi-tries-a-bite` | new | Bibi, Mama Bunny | food and tasting |
| 7 | Pepper Finds a Home | 1 | `home` · `pepper-finds-a-home` | new | Pepper | animals and their homes |
| 8 | Tess Goes Up the Hill | 1 | `hill` · `tess-goes-up-the-hill` | new | Tess | trying again, proud |
| 9 | The Shy Duck | 2 | `duck` · `the-shy-duck` | kept | Daisy, Hop | being brave, friendship |
| 10 | The Lion's Nap | 2 | `lion` · `the-lions-nap` | kept | Leo | being kind, staying calm |
| 11 | The Brave Little Bear | 2 | `bear` · `brave-little-bear` | kept | Boo, Milo | being brave |
| 12 | Just One More | 2 | `bedtime` · `pepper-just-one-more` | new | Pepper, Papa Mouse | bedtime |
| 13 | Rex and the Big Grrr | 2 | `angry` · `rex-and-the-big-grrr` | new | Rex, Mama Dog | feelings: angry |
| 14 | Hazel Helps Grandma | 2 | `helping` · `hazel-helps-grandma` | new | Hazel, Grandma Hedgehog | helping at home |
| 15 | Milo Waits for Snow | 2 | `snow` · `milo-waits-for-snow` | new | Milo, Mama Cat | the four seasons |
| 16 | Your Turn, My Turn | 2 | `sharing` · `your-turn-my-turn` | new | Bibi, Leo | sharing |
| 17 | The Curious Cat | 3 | `cat` · `the-curious-cat` | kept | Milo, Mama Cat | curiosity, waiting |
| 18 | The Wise Owl | 3 | `owl` · `the-wise-owl` | kept | Ollie, Pepper | being kind, helping |
| 19 | Ollie's Letter Box | 3 | `letters` · `ollies-letter-box` | new | Ollie, Grandpa Owl + friends | the alphabet |
| 20 | Boo's Ten Strawberries | 3 | `strawberries` · `boos-ten-strawberries` | new | Boo, Hazel, Bibi | counting 1–10 |
| 21 | Bibi's Red Balloon | 3 | `balloon` · `bibis-red-balloon` | new | Bibi, Tess, Rex, Daisy | feelings: sad |
| 22 | Juno and the Sunset | 3 | `bat` · `juno-and-the-sunset` | new | Juno, Milo, Rex | friendship, being different |
| 23 | Rex Rides a Bike | 3 | `bike` · `rex-rides-a-bike` | new | Rex, Mama Dog, Tess | trying again, proud |
| 24 | Daisy's First Day | 3 | `school` · `daisys-first-day` | new | Daisy, Pepper, Mama Duck, Miss Goose | being brave, a new friend |

- **Levels:** Level 1 is ages 3–4 (6 pages), Level 2 is ages 4–6 (7 pages), and Level 3 is ages 6–8 (8 pages). There are 8 stories per level. The 8 kept stories keep their slug and `translationGroup`. Cat and owl move from ages 4–7 to 6–8.
- **One cast of friends** shared across the stories: Boo, Milo, Rex, Daisy, Finn, Ollie, Leo, Hazel, Pepper, Bibi, Tess and Juno. The English names of the 7 kept heroes stay the same. FR/ES/PT keep their own names (Titou, Bruno, Beto…) in step B.
- **Story text** uses US spelling ("colors"), like the current stories.

---

## Level 1 (ages 3–4, 6 pages, one short sentence)

### 1. The Little Apple · `apple` (kept)
**Characters:** Hazel the hedgehog (main), Boo the bear. **Refrain:** "…no apple!"

| Page | Text | Picture |
|---|---|---|
| 1 | Hazel sees a shiny red apple, high up in the tree. | Hazel looks up at one apple; Boo watches from behind a bush |
| 2 | Hop, hop, hop… no apple! | Hazel jumping |
| 3 | Stretch, stretch, stretch… no apple! | Hazel on tiptoe on a log |
| 4 | Shake, shake, shake… no apple! | Hazel shaking the trunk |
| 5 | Whoosh goes the wind, and down falls the apple! | leaves blowing, the apple falling into her paws |
| 6 | Hazel shares her apple with Boo: crunch, crunch, yum! | the two of them eating |

**Talk about it:** What did Hazel try first? What do you do when something is too hard? Who would you share an apple with?

### 2. The Little Dog · `dog` (kept)
**Characters:** Rex the puppy (main), Milo in the background. **Refrain:** "Not this one…"

| Page | Text | Picture |
|---|---|---|
| 1 | Rex has lost his red ball in the park. | Rex sniffing the grass |
| 2 | Not this one… it's an orange! | an orange in a picnic basket |
| 3 | Not this one… it's Milo's yarn! | Milo holding a red ball of yarn |
| 4 | Not this one… it's a balloon! | a red balloon tied to a bench |
| 5 | Under the big tree… YES, it's his red ball! | the ball between the roots |
| 6 | Rex and his red ball play all day: throw, catch, wag, wag, wag! | a happy game |

**Talk about it:** Where did Rex find his ball? What round things did he find first? What do you do when you lose something?

### 3. The Happy Fish · `fish` (kept)
**Characters:** Finn the fish (main), Shelly the crab, a snail, a starfish. **Refrain:** "Play with me?"

| Page | Text |
|---|---|
| 1 | Finn the little fish wants a friend to play with. |
| 2 | "Play with me?" asks Finn, but Snail is fast asleep. |
| 3 | "Play with me?" asks Finn, but Starfish is too busy. |
| 4 | "Play with me?" asks Finn, and a little shell wiggles. |
| 5 | Peek-a-boo, it's Shelly the crab! |
| 6 | "Yes!" says Shelly, and they play hide and seek all day. |

**Talk about it:** Why couldn't Snail play? How do you ask a new friend to play? What is your favorite game?

### 4. Daisy and the Puddles · `puddles` (new)
**Characters:** Daisy the duckling (main), Mama Duck. **Counting** 1–5. **Refrain:** "…too small!"

| Page | Text |
|---|---|
| 1 | Rain, rain, rain, and Daisy wants the biggest puddle! |
| 2 | One puddle: splish… too small! |
| 3 | Two puddles: splish, splash… too small! |
| 4 | Three puddles, four puddles… too small, too small! |
| 5 | Puddle number five is BIG… SPLASH! |
| 6 | One muddy duckling, happy in a warm bubble bath. |

**Talk about it:** Let's count the puddles together. Do you like rainy days? What do you wear in the rain?

### 5. Milo Paints a Picture · `paint` (new)
**Characters:** Milo the kitten (main), Mama Cat. **Colors:** red, blue, yellow, green.

| Page | Text |
|---|---|
| 1 | Milo wants to paint a picture for Mama. |
| 2 | Red paint makes a red apple. |
| 3 | Blue paint makes a blue sky. |
| 4 | Yellow paint makes a yellow sun. |
| 5 | Oops, Milo steps in green paint: pat, pat, pat! |
| 6 | Green paws make green grass, and Mama loves it! |

**Talk about it:** What colors did Milo use? What happened when he stepped in the paint? What would you paint for someone you love?

### 6. Bibi Tries a Bite · `taste` (new)
**Characters:** Bibi the bunny (main), Mama Bunny. **Refrain:** "Just one little bite… yum!"

| Page | Text |
|---|---|
| 1 | Bibi only likes carrots: crunch, crunch! |
| 2 | A green pea? No, no, no! |
| 3 | Just one little bite… yum! |
| 4 | Yellow corn? Just one little bite… yum, yum! |
| 5 | A purple plum? Just one little bite… yum, yum, yum! |
| 6 | Now Bibi likes carrots, peas, corn and plums! |

**Talk about it:** Which food did Bibi try first? Is there a food you didn't like at first? What new food could you try?

### 7. Pepper Finds a Home · `home` (new)
**Characters:** Pepper the mouse (main); a bird, a bee, Hop the frog and Bibi at their homes. **Refrain:** "Is this my home? No, it's…"

| Page | Text |
|---|---|
| 1 | Pepper the mouse needs a little home. |
| 2 | Is this my home? No, it's Bird's nest! |
| 3 | Is this my home? No, it's Bee's hive! |
| 4 | Is this my home? No, it's Hop's pond! |
| 5 | Is this my home? No, it's Bibi's burrow! |
| 6 | An old boot by the garden gate… yes, this is Pepper's home! |

**Talk about it:** Where does a bird live? And a bee? What do you like best about your home?

### 8. Tess Goes Up the Hill · `hill` (new)
**Characters:** Tess the tortoise (main); Rex and Daisy cheering. **Refrain:** "Up, up, up… oops!"

| Page | Text |
|---|---|
| 1 | Tess wants to climb to the top of the hill. |
| 2 | Up, up, up… oops, down she slides! |
| 3 | Up, up, up… oops, down she rolls! |
| 4 | Slow and steady, Tess takes one step at a time. |
| 5 | Up, up, up… she did it! |
| 6 | Tess is proud, and she can see far, far away. |

**Talk about it:** What happened the first time Tess tried? What helped her get to the top? When did you feel proud?

---

## Level 2 (ages 4–6, 7 pages, 1–2 sentences)

### 9. The Shy Duck · `duck` (kept)
**Characters:** Daisy the duckling (main), Hop the frog, other ducklings. **Refrain:** "Maybe tomorrow."

| Page | Text |
|---|---|
| 1 | Daisy the duckling lives by a calm pond. The other ducklings swim and splash all day. |
| 2 | "Come and swim!" they call, but Daisy hides in the reeds. "Maybe tomorrow," she whispers. |
| 3 | The next day, Daisy puts one foot in the water. "Too cold! Maybe tomorrow." |
| 4 | The next day, she puts two feet in. "Too wobbly! Maybe tomorrow." |
| 5 | Then Hop the frog lands on a lily pad next to her. "I'm shy too. Shall we jump in together?" |
| 6 | Daisy takes a deep breath. One, two, three… SPLASH! |
| 7 | "Not tomorrow… today!" laughs Daisy, swimming with her new friends. |

**Talk about it:** Why did Daisy hide? How did Hop help her? Is there something you'd like to try "today"?

### 10. The Lion's Nap · `lion` (kept)
**Characters:** Leo the lion cub (main), three little birds. **Refrain:** "Tweet, tweet, TWEET!"

| Page | Text |
|---|---|
| 1 | Leo the lion cub is sleepy. He lies down under the big tree for a nap. |
| 2 | "Tweet, tweet, TWEET!" sing the little birds, and Leo opens one eye. |
| 3 | Leo covers his ears with his paws, but the birds are still too loud: tweet, tweet, TWEET! |
| 4 | Leo hides under a big bush, but the birds are still too loud: tweet, tweet, TWEET! |
| 5 | Leo wants to roar, but he takes a deep breath instead. "Little birds, could you sing softly, please?" |
| 6 | "Of course!" say the birds, and they sing a soft, sleepy song: tweet… tweet… tweet… |
| 7 | Leo smiles, closes his eyes and has the best nap ever. |

**Talk about it:** What did Leo try before asking? Why didn't he roar? How do you ask nicely for something?

### 11. The Brave Little Bear · `bear` (kept)
**Characters:** Boo the bear cub (main), Milo. **Refrain:** "Be brave, Boo."

| Page | Text |
|---|---|
| 1 | Boo the bear cub lives at the edge of a big forest. At night, the forest is very dark. |
| 2 | Boo is scared of the dark. "What if something is hiding in there?" he says. |
| 3 | One evening, a voice calls from the forest: "Help! I'm stuck!" It's his friend Milo! |
| 4 | Boo's knees shake. "Be brave, Boo," he says, and he takes his little lantern into the dark. |
| 5 | Something rustles, and Boo jumps! But it's only a leaf dancing in the wind. "Be brave, Boo." |
| 6 | There's Milo, stuck high up in a tree! Boo is a good climber, so up he goes to help him down. |
| 7 | They walk home together, paw in paw. "The dark isn't so scary with a friend," says Boo. |

**Talk about it:** What was Boo scared of? What helped him be brave? What do you do when you feel scared?

### 12. Just One More · `bedtime` (new)
**Characters:** Pepper the mouse (main), Papa Mouse. **Refrain:** "Papa, just one more…"

| Page | Text |
|---|---|
| 1 | It's bedtime. Papa Mouse tucks Pepper into her little bed. |
| 2 | "Papa, just one more drink of water, please!" Papa brings a tiny cup. |
| 3 | "Papa, just one more story, please!" Papa reads a short one about the moon. |
| 4 | "Papa, just one more kiss, please!" Mwah, goes Papa, right on her nose. |
| 5 | "Papa, just one more song, please!" Papa sings softly: la-la-la-loo. |
| 6 | Pepper's eyes feel heavy. "Just one more… yaaawn," she says. |
| 7 | Pepper is fast asleep, and Papa whispers, "Sleep tight, little Pepper." |

**Talk about it:** What did Pepper ask for? What do you do before bed? What is your favorite bedtime song or story?

### 13. Rex and the Big Grrr · `angry` (new)
**Characters:** Rex the puppy (main), Mama Dog. **Refrain:** "the GRRR is still there."

| Page | Text |
|---|---|
| 1 | Rex builds a tall, tall tower of blocks. It's the tallest tower ever! |
| 2 | He puts one more block on top… CRASH! Rex feels a big, hot GRRR inside. |
| 3 | "GRRR!" Rex stomps his feet: stomp, stomp, stomp! But the GRRR is still there. |
| 4 | Mama sits down next to him. "Let's smell a flower and blow out a candle," she says. |
| 5 | Rex breathes in slowly… and out slowly. The GRRR gets a little smaller. |
| 6 | "Can you help me build it again?" asks Rex. "Yes! Big blocks at the bottom," says Mama. |
| 7 | The new tower is tall and strong. The GRRR is gone, and Rex feels warm and happy inside. |

**Talk about it:** Why did Rex feel angry? What helped the GRRR get smaller? Let's "smell a flower and blow out a candle" together.

### 14. Hazel Helps Grandma · `helping` (new)
**Characters:** Hazel the hedgehog (main), Grandma Hedgehog; friends at the end. **Refrain:** "Can I help?"

| Page | Text |
|---|---|
| 1 | Friends are coming for lunch at Grandma's house. "Can I help?" asks Hazel. |
| 2 | Hazel carries the eggs: wobble, wobble… crack! Oh no! |
| 3 | "Can I help?" Hazel sweeps the floor: swish, swish… achoo! Now there's dust everywhere. |
| 4 | "I'm not a good helper," sighs Hazel. Grandma hugs her: "Let's find the right job for you." |
| 5 | "Can I help?" Hazel washes the carrots: scrub, scrub, until they shine! |
| 6 | Then she sets the table: one plate, one cup and one spoon for each friend. |
| 7 | "Who set this beautiful table?" ask the friends. "I did!" says Hazel proudly. |

**Talk about it:** What went wrong at first? What jobs was Hazel good at? How do you help at home?

### 15. Milo Waits for Snow · `snow` (new)
**Characters:** Milo the kitten (main), Mama Cat. **Refrain:** "Is it snow?" "Not yet!"

| Page | Text |
|---|---|
| 1 | Milo has never seen snow. Every day he asks, "When will it snow?" |
| 2 | In spring, white petals fall from the trees. "Is it snow?" "Not yet! Those are flowers." |
| 3 | In summer, white fluff floats in the air. "Is it snow?" "Not yet! That's dandelion fluff." |
| 4 | In autumn, leaves tumble from the trees. "Is it snow?" "Not yet! Those are leaves." |
| 5 | Then the days get short and cold. Milo puts on his stripy hat and waits by the window. |
| 6 | One morning, everything is soft and white. "Is it snow?" "YES! It's snow!" |
| 7 | Milo makes a little snow cat, then warms his paws with Mama and a cup of warm milk. |

**Talk about it:** What did Milo see in spring, summer and autumn? Which season do you like best? What would you make in the snow?

### 16. Your Turn, My Turn · `sharing` (new)
**Characters:** Bibi the bunny and Leo the lion cub. **Refrain:** "My turn!" → "Your turn!"

| Page | Text |
|---|---|
| 1 | In the park, there is one red swing. Bibi and Leo both run to it. |
| 2 | "My turn!" says Bibi. "My turn!" says Leo. |
| 3 | They both pull the swing: pull, pull, pull! The swing goes nowhere, and nobody has fun. |
| 4 | Bibi sits on the grass with a frown. Leo sits on the grass with a frown too. |
| 5 | Then Leo has an idea. "Your turn first, Bibi. I'll push you!" |
| 6 | Whoosh! Bibi swings high and laughs. Then she hops off: "Your turn, Leo! I'll push you!" |
| 7 | Your turn, my turn, all afternoon long. Sharing makes the swing twice as much fun! |

**Talk about it:** What happened when they both pulled? What was Leo's idea? What do you share with your friends?

---

## Level 3 (ages 6–8, 8 pages, 2–3 sentences and dialogue)

### 17. The Curious Cat · `cat` (kept)
**Characters:** Milo the kitten (main), Mama Cat. **Refrain:** "Just one tiny peek."

| Page | Text |
|---|---|
| 1 | Milo the kitten is very curious. He wants to know what is under every rug and inside every box. |
| 2 | One day, a big box arrives. "It's a surprise for later," says Mama. "Please don't open it, Milo." |
| 3 | Milo sits next to the box. He waits and waits. "Just one tiny peek," he whispers. |
| 4 | Inside are soft balls of yarn: red, blue and yellow! Milo taps one with his paw, and it rolls away. |
| 5 | Around the chair, under the table, over the sofa… Soon the yarn is everywhere, and Milo is all tangled up! |
| 6 | He pulls, but the yarn gets tighter. He rolls, but it gets even worse. "Mama! Help!" he calls. |
| 7 | Mama laughs and untangles him. "The yarn was for a warm hat for you," she says. Milo helps her roll it all back into balls. |
| 8 | A few days later, Milo has a stripy new hat. "Next time, I'll wait," he says. Then he sees another box… |

**Talk about it:** Why did Mama ask Milo to wait? What happened when he peeked? Is it hard for you to wait for a surprise?

### 18. The Wise Owl · `owl` (kept)
**Characters:** Ollie the owl (main), Pepper the mouse. **Refrain:** Ollie's questions.

| Page | Text |
|---|---|
| 1 | Ollie the owl lives high in an old oak tree. Every night, he watches the stars and the sleepy forest below. |
| 2 | One night, he hears a small sniff. Pepper the mouse is sitting on the path. "I'm lost," she says. "I can't find my home." |
| 3 | "What does your home look like?" asks Ollie. "It's an old boot by a garden gate," says Pepper. |
| 4 | Ollie flies up high to look. "Is it near the pond?" he asks. "No," says Pepper. "I don't live near water." |
| 5 | "Is it near the big rock?" asks Ollie. Pepper shakes her head. "No, it's not there either." |
| 6 | Ollie thinks hard. "What can you see from your door?" "Tall yellow sunflowers!" says Pepper. Ollie knows exactly where they grow. |
| 7 | Ollie flies low and slow, so Pepper can follow. Past the pond, past the rock, to the sunflowers… and there's the old boot! |
| 8 | "Thank you, Ollie! You are so wise," says Pepper. Ollie smiles. "I just asked good questions." |

**Talk about it:** Which question helped Ollie find the way? What would you say to describe your home? What do you do if you get lost?

### 19. Ollie's Letter Box · `letters` (new)
**Characters:** Ollie the owl (main), Rex, Hazel, Leo, Bibi, Grandpa Owl. **Letters:** A, B, E, L, T, U.

| Page | Text |
|---|---|
| 1 | Tomorrow is Letter Day at school. Ollie must fill his box with a treasure for each letter: A, B, E, L, T and U. "That's a lot of treasures!" he says. |
| 2 | In the attic, Ollie finds an old toy airplane. "A is for airplane!" Zoom, into the box it goes. |
| 3 | Rex gives him a bouncy ball. "B is for ball!" says Ollie. Boing, boing! |
| 4 | Hazel gives him a little gray toy elephant. "E is for elephant!" says Ollie. |
| 5 | "L is for… me!" roars Leo, and he climbs into the box. "You're too big!" laughs Ollie. So Leo gives him his toy lion instead. |
| 6 | Bibi picks a red tomato in her garden. "T is for tomato!" Now only one letter is left: U. |
| 7 | U is tricky. Ollie looks everywhere, but he can't find a U treasure. Then he hears music: Grandpa Owl is playing a tiny guitar. "It's a ukulele," says Grandpa. |
| 8 | On Letter Day, Ollie shows his treasures: airplane, ball, elephant, lion, tomato… and ukulele! He plays a song, and everyone sings along. |

**Talk about it:** Which treasure was the hardest to find? What starts with the first letter of your name? What would you put in your letter box?

### 20. Boo's Ten Strawberries · `strawberries` (new)
**Characters:** Boo the bear cub (main), Hazel, Bibi. **Counting** 1–10. **Refrain:** "Oops…"

| Page | Text |
|---|---|
| 1 | The friends are having a picnic. "Boo, please bring ten strawberries," says Hazel. "Ten? Easy!" says Boo. |
| 2 | "One, two, three," counts Boo, dropping them into his basket. Then he eats one. "Mmm! Oops… two." |
| 3 | "Three, four, five, six." The strawberries look so juicy! Boo eats two more. "Oops… four." |
| 4 | "This time I won't eat any," says Boo. "Five, six, seven, eight, nine…" His tummy rumbles. Gulp! "Oops… eight." |
| 5 | Boo looks into his basket and sighs. "I'll never get to ten!" |
| 6 | Bibi and Hazel come to find him. "We'll help," says Bibi. "You pick, and we'll count." |
| 7 | "One, two, three, four, five, six, seven, eight, nine… TEN!" they count together. Ten red strawberries sit in the basket. |
| 8 | At the picnic, everyone shares the strawberries. And Boo? He gets the very first one! |

**Talk about it:** Why did Boo never get to ten on his own? How did his friends help? Let's count to ten together.

### 21. Bibi's Red Balloon · `balloon` (new)
**Characters:** Bibi the bunny (main), Rex, Daisy, Tess. **Refrain:** "She is still sad."

| Page | Text |
|---|---|
| 1 | Bibi has a red balloon from the fair. She holds the string tight and skips all the way home. |
| 2 | Whoosh! The wind pulls the string from her paw. The balloon floats up, up, up into the sky. |
| 3 | Bibi sits down and cries. "My balloon is gone," she sobs. She feels heavy and gray inside. |
| 4 | Rex wants to help. He tells his funniest joke. Bibi doesn't laugh. She is still sad. |
| 5 | Daisy wants to help. She does her silliest dance. Bibi doesn't smile. She is still sad. |
| 6 | Then Tess comes and sits next to Bibi. She doesn't say anything. She just holds Bibi's paw. |
| 7 | After a while, Bibi feels a little lighter. "Thank you for staying with me," she says. "It's okay to be sad," says Tess. |
| 8 | Together they look up. The balloon is a tiny red dot above the clouds. "Bye-bye, balloon!" Bibi waves, and she smiles a little. |

**Talk about it:** How did Bibi feel when the balloon flew away? What did each friend do to help? What helps you when you feel sad?

### 22. Juno and the Sunset · `bat` (new)
**Characters:** Juno the bat (main), Milo, Rex, Daisy. **Refrain:** "Who wants to play?"

| Page | Text |
|---|---|
| 1 | A new family moves into the old barn: a family of bats! Their little girl is called Juno. |
| 2 | In the morning, the friends knock on the barn door. "Juno, who wants to play?" But Juno is fast asleep, hanging upside down. |
| 3 | At night, Juno flies out. "Who wants to play?" she calls. But all her new friends are asleep in their beds. |
| 4 | Juno feels lonely. "Maybe bats and kittens and puppies can't be friends," she sighs. |
| 5 | Then Milo has an idea. "What about sunset? The day is ending and the night is starting. We'll all be awake!" |
| 6 | So at sunset, everyone meets in the meadow. Juno shows them how she hangs upside down, and Rex shows her how to play fetch. |
| 7 | They play hide and seek until the first stars come out. Juno's big ears hear everyone, so she wins every time! |
| 8 | "See you tomorrow at sunset!" they all shout. Now sunset is everyone's favorite time of day. |

**Talk about it:** Why couldn't Juno play in the day or at night? How did the friends solve it? How can you play with a friend who is different from you?

### 23. Rex Rides a Bike · `bike` (new)
**Characters:** Rex the puppy (main), Mama Dog, Tess. **Refrain:** "Wobble, wobble, BUMP!"

| Page | Text |
|---|---|
| 1 | Rex gets a shiny blue bike for his birthday. He puts on his helmet. "I'm going to ride it right now!" he barks. |
| 2 | He pushes off… wobble, wobble, BUMP! He lands on the soft grass. "That's okay," says Mama. "Try again." |
| 3 | Rex tries again. Wobble, wobble, BUMP! "This bike doesn't like me," he grumbles. |
| 4 | Rex sits down with his arms crossed. "I give up," he says. |
| 5 | Then he sees Tess walking up the hill, one step at a time. "Slow and steady," she calls. "That's how I do it!" |
| 6 | Rex tries once more. He looks straight ahead and pedals slowly: one, two, one, two. Wobble… wobble… |
| 7 | No bump! "Look, Mama, I'm riding!" Rex rides all the way around the park. |
| 8 | That night, Rex parks his bike next to his bed. "Tomorrow I'll ride even farther," he says proudly. |

**Talk about it:** How did Rex feel when he fell? What did Tess teach him? What have you learned by trying again and again?

### 24. Daisy's First Day · `school` (new)
**Characters:** Daisy the duckling (main), Pepper, Mama Duck, Miss Goose (teacher). **Refrain:** "the butterflies in her tummy."

| Page | Text |
|---|---|
| 1 | Today is Daisy's first day at school. Her tummy feels full of butterflies. "What if nobody plays with me?" she asks. |
| 2 | At the door, Daisy holds Mama's wing very tight. "I want to go home," she whispers. |
| 3 | Mama gives her a small, smooth pebble. "Keep this in your pocket," she says. "When you miss me, hold it, and remember I'll come back." |
| 4 | Miss Goose smiles. "Welcome, Daisy! Would you like to paint?" But Daisy shakes her head and hides behind the coats. |
| 5 | Then she sees a little mouse sitting all alone. It's Pepper. "Are you new too?" asks Daisy. "Yes," says Pepper. "I've got butterflies too." |
| 6 | "Shall we paint together?" asks Daisy. Side by side, they paint a big yellow sun. |
| 7 | At snack time, story time and playtime, Daisy and Pepper stay together. Daisy forgets all about the butterflies. |
| 8 | When Mama comes back, Daisy runs to her. "Can I come back tomorrow?" she asks. Mama laughs and hugs her tight. |

**Talk about it:** How did Daisy feel in the morning? What helped her feel better? What would you say to a new child at school?
