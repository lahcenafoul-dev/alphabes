// The story cast for the Canva prompts. Each description is copied word for
// word into every prompt that shows the character, so the character looks
// the same in every picture. `name` is how the English picture scenes in
// prisma/stories-v2 refer to the character.

export type Character = { id: string; name: string; description: string; swims?: boolean };

export const CHILDREN: Character[] = [
  { id: "boo", name: "Boo", description: "Boo, a small round bear cub with fluffy honey-brown fur, a cream-coloured muzzle and tummy, small round ears, big shiny dark-brown eyes, wearing a little red knitted scarf" },
  { id: "milo", name: "Milo", description: "Milo, a small orange tabby kitten with darker orange stripes, white paws and a white chest, big green eyes, a pink nose, a long striped tail, wearing a green collar with a tiny gold bell" },
  { id: "rex", name: "Rex", description: "Rex, a small cream-coloured puppy with floppy light-brown ears, a light-brown patch around his left eye, a black button nose, a short wagging tail, wearing a blue bandana around his neck" },
  { id: "daisy", name: "Daisy", description: "Daisy, a small fluffy yellow duckling with an orange beak and orange webbed feet, big shiny black eyes, a little tuft of feathers on top of her head with a pink daisy flower clip" },
  { id: "finn", name: "Finn", description: "Finn, a small round turquoise fish with big friendly eyes, soft yellow fins and a yellow tail, and one small white star-shaped spot on his side", swims: true },
  { id: "ollie", name: "Ollie", description: "Ollie, a small round purple owl with violet feathers, a pale lavender belly, darker indigo wings, two small ear tufts, big round white eyes with dark navy pupils, a small golden-orange beak, wearing a tiny yellow bow tie" },
  { id: "leo", name: "Leo", description: "Leo, a little lion cub with golden-yellow fur, a short fluffy orange mane, a cream muzzle, round ears, a long tail with an orange tuft at the tip, wearing a small straw sun hat" },
  { id: "hazel", name: "Hazel", description: "Hazel, a small hedgehog with soft rounded brown spines, a cream-coloured face and tummy, rosy cheeks, a tiny black nose, wearing a little purple dress with white polka dots" },
  { id: "pepper", name: "Pepper", description: "Pepper, a tiny grey mouse with big round pink ears, a pink nose, long whiskers, a thin pink tail, wearing a yellow-and-white striped shirt" },
  { id: "bibi", name: "Bibi", description: "Bibi, a small white bunny with long upright ears that are pink inside, a pink nose, a fluffy round tail, wearing orange overalls" },
  { id: "tess", name: "Tess", description: "Tess, a small tortoise with soft light-green skin, a rounded golden-brown shell with a honeycomb pattern, big kind brown eyes, wearing a teal knitted beanie hat" },
  { id: "juno", name: "Juno", description: "Juno, a little fruit bat with soft dark-grey fur, big rounded ears, big brown eyes, purple-grey wings, a sweet smile, wearing a small orange star-shaped hair clip" },
];

export const SUPPORTING: Character[] = [
  { id: "shelly", name: "Shelly", description: "Shelly, a small round red crab with big shiny eyes on short stalks, two little claws, a shy smile, and a tiny white seashell stuck on her back" },
  { id: "hop", name: "Hop", description: "Hop, a little green frog with big round yellow eyes, a pale-green tummy, long legs, and three small dark-green spots on his back" },
  { id: "mama-cat", name: "Mama Cat", description: "Mama Cat, a tall orange tabby cat with darker orange stripes, white paws, green eyes, wearing a long blue cardigan" },
  { id: "mama-dog", name: "Mama Dog", description: "Mama Dog, a big cream-coloured dog with floppy light-brown ears and a kind face, wearing a red cardigan" },
  { id: "mama-duck", name: "Mama Duck", description: "Mama Duck, a big white duck with an orange beak and orange webbed feet, wearing a light-blue headscarf" },
  { id: "mama-bunny", name: "Mama Bunny", description: "Mama Bunny, a tall white rabbit with long ears that are pink inside, wearing a yellow flowery apron" },
  { id: "papa-mouse", name: "Papa Mouse", description: "Papa Mouse, a grey mouse with big round pink ears, long whiskers and small round glasses, wearing a brown knitted waistcoat" },
  { id: "grandma-hedgehog", name: "Grandma Hedgehog", description: "Grandma Hedgehog, a plump hedgehog with soft silver-grey spines, a cream face, small round glasses, wearing a pink apron with white hearts" },
  { id: "grandpa-owl", name: "Grandpa Owl", description: "Grandpa Owl, a big round owl with soft grey-violet feathers, a white feathery beard, bushy white eyebrows, big round eyes and a golden beak, wearing a red knitted cardigan" },
  { id: "miss-goose", name: "Miss Goose", description: "Miss Goose, a tall friendly white goose with an orange beak, round blue glasses, wearing a yellow scarf" },
];

export const CAST: Character[] = [...CHILDREN, ...SUPPORTING];

/** The characters a scene names, in the order they first appear in it. */
export function charactersIn(scene: string): Character[] {
  // Longest names first, so "Mama Duck" is found before anything shorter.
  const found: { c: Character; at: number }[] = [];
  for (const c of [...CAST].sort((a, b) => b.name.length - a.name.length)) {
    const m = new RegExp(`\\b${c.name}\\b`).exec(scene);
    if (m) found.push({ c, at: m.index });
  }
  return found.sort((a, b) => a.at - b.at).map((f) => f.c);
}
