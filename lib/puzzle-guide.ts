// The text for each sliding puzzle picture page (SEO phase 4, B5): 60 to 100
// words that only fit that picture. A hand-written line about the scene with
// a question to talk about, then what each row of the picture shows, the
// animals to count and which drawing the empty square hides, all taken from
// the scene itself (lib/puzzles.ts) so it stays true if a scene changes.
import type { Locale } from "@/i18n/routing";
import { getDrawing } from "@/data/worksheets/drawings";
import { PUZZLES, type SlidingPuzzle } from "./puzzles";
import type { Block } from "./guide-blocks";

const ANIMALS = new Set(["bird", "butterfly", "dog", "cat", "owl", "fish", "whale", "turtle", "snail"]);

/** One line per scene: what is going on, and a question to ask. */
const SCENE_TEXT: Record<string, Record<Locale, string>> = {
  "sunny-garden": {
    en: "A sunny day outside a little yellow house, with a kite flying high. Who might live in the house?",
    fr: "Une journée de soleil devant une petite maison jaune, avec un cerf-volant tout là-haut. Qui peut bien habiter là ?",
    es: "Un día de sol frente a una casita amarilla, con un papalote muy alto. ¿Quién vivirá en la casa?",
    pt: "Um dia de sol na frente de uma casinha amarela, com uma pipa lá no alto. Quem será que mora na casa?",
  },
  "by-the-sea": {
    en: "Out on the sea, a sailboat meets a whale while a plane flies over. Which ones live in the water?",
    fr: "En pleine mer, un bateau croise une baleine pendant qu'un avion passe au-dessus. Lesquels vivent dans l'eau ?",
    es: "En el mar, un velero se cruza con una ballena mientras pasa un avión. ¿Cuáles viven en el agua?",
    pt: "No mar, um veleiro encontra uma baleia enquanto um avião passa lá em cima. Quais vivem na água?",
  },
  "starry-night": {
    en: "Night has fallen: a rocket and a plane cross the sky, and the owl is awake. What can you see at night where you live?",
    fr: "La nuit est tombée : une fusée et un avion traversent le ciel, et la chouette est réveillée. Que voit-on la nuit chez toi ?",
    es: "Ya es de noche: un cohete y un avión cruzan el cielo, y el búho está despierto. ¿Qué se ve de noche donde vives?",
    pt: "Já é noite: um foguete e um avião cruzam o céu, e a coruja está acordada. O que dá para ver à noite onde você mora?",
  },
  "snowy-day": {
    en: "A snowy day by the house, and the sun is out. What would you wear to play outside?",
    fr: "Un jour de neige près de la maison, et le soleil brille. Que mettrais-tu pour jouer dehors ?",
    es: "Un día de nieve junto a la casa, y sale el sol. ¿Qué te pondrías para jugar afuera?",
    pt: "Um dia de neve perto da casa, e o sol apareceu. O que você vestiria para brincar lá fora?",
  },
  "healthy-snacks": {
    en: "A picture full of good things to eat: three fruits, a carrot and a mushroom. Which one would you pick for a snack?",
    fr: "Une image pleine de bonnes choses à manger : trois fruits, une carotte et un champignon. Lequel choisirais-tu pour le goûter ?",
    es: "Una imagen llena de cosas ricas: tres frutas, una zanahoria y un hongo. ¿Cuál elegirías para la merienda?",
    pt: "Uma imagem cheia de coisas gostosas: três frutas, uma cenoura e um cogumelo. Qual você escolheria para o lanche?",
  },
  "birthday-party": {
    en: "It's party time: a cupcake, an ice cream and a balloon, with a cat and a dog as guests. Whose birthday could it be?",
    fr: "C'est la fête : un cupcake, une glace et un ballon, avec un chat et un chien pour invités. C'est l'anniversaire de qui ?",
    es: "¡Es una fiesta! Un pastelito, un helado y un globo, con un gato y un perro de invitados. ¿De quién será el cumpleaños?",
    pt: "É dia de festa: um cupcake, um sorvete e um balão, com um gato e um cachorro de convidados. De quem será o aniversário?",
  },
  "on-the-road": {
    en: "A car and a truck drive past a house while a plane flies over. Which one is the fastest?",
    fr: "Une voiture et un camion passent devant une maison, et un avion vole au-dessus. Lequel va le plus vite ?",
    es: "Un carro y un camión pasan frente a una casa mientras vuela un avión. ¿Cuál va más rápido?",
    pt: "Um carro e um caminhão passam na frente de uma casa enquanto um avião voa. Qual é o mais rápido?",
  },
  "on-the-farm": {
    en: "A day on the farm: a truck by the farmhouse, a carrot and an apple from the garden. What else grows on a farm?",
    fr: "Une journée à la ferme : un camion près de la maison, une carotte et une pomme du jardin. Que pousse-t-il d'autre à la ferme ?",
    es: "Un día en la granja: un camión junto a la casa, una zanahoria y una manzana de la huerta. ¿Qué más crece en una granja?",
    pt: "Um dia na fazenda: um caminhão perto da casa, uma cenoura e uma maçã da horta. O que mais cresce numa fazenda?",
  },
  "beach-day": {
    en: "A day at the beach: an umbrella for shade, an ice cream and a kite in the wind. What would you take to the beach?",
    fr: "Une journée à la plage : un parapluie pour l'ombre, une glace et un cerf-volant dans le vent. Qu'emporterais-tu à la plage ?",
    es: "Un día de playa: un paraguas para la sombra, un helado y un papalote al viento. ¿Qué llevarías a la playa?",
    pt: "Um dia de praia: um guarda-chuva para fazer sombra, um sorvete e uma pipa ao vento. O que você levaria para a praia?",
  },
  "rainy-day": {
    en: "Rain is falling, so out come the umbrella and the snail. What do you like to do on a rainy day?",
    fr: "Il pleut : c'est le moment du parapluie et de l'escargot. Qu'aimes-tu faire les jours de pluie ?",
    es: "Está lloviendo: es la hora del paraguas y del caracol. ¿Qué te gusta hacer cuando llueve?",
    pt: "Está chovendo: é hora do guarda-chuva e do caracol. O que você gosta de fazer em dia de chuva?",
  },
  "in-the-forest": {
    en: "Deep in the forest, an owl watches over a mushroom and a wild strawberry. Who else could live in the woods?",
    fr: "Au fond de la forêt, une chouette veille sur un champignon et une fraise des bois. Qui d'autre vit dans la forêt ?",
    es: "En el bosque, un búho vigila un hongo y una fresa silvestre. ¿Quién más podría vivir en el bosque?",
    pt: "No meio da floresta, uma coruja cuida de um cogumelo e de um morango silvestre. Quem mais pode morar na floresta?",
  },
  "at-the-pond": {
    en: "A quiet pond with a little boat, a fish and a turtle. Which animals like to swim?",
    fr: "Un étang tranquille avec un petit bateau, un poisson et une tortue. Quels animaux aiment nager ?",
    es: "Un estanque tranquilo con un velero pequeño, un pez y una tortuga. ¿Qué animales saben nadar?",
    pt: "Um lago tranquilo com um veleirinho, um peixe e uma tartaruga. Quais animais gostam de nadar?",
  },
  "picnic-time": {
    en: "A picnic under the tree: an apple, a pear, a cupcake and an ice cream, and the dog hopes for a bite. What would you bring?",
    fr: "Un pique-nique sous l'arbre : une pomme, une poire, un cupcake et une glace, et le chien espère en avoir un peu. Qu'apporterais-tu ?",
    es: "Un pícnic bajo el árbol: una manzana, una pera, un pastelito y un helado, y el perro quiere probar. ¿Qué llevarías tú?",
    pt: "Um piquenique debaixo da árvore: maçã, pera, cupcake e sorvete, e o cachorro quer um pedaço. O que você levaria?",
  },
  "up-in-the-sky": {
    en: "Almost everything here flies: a rocket, a plane, a kite, a balloon and a few animals with wings. Which one goes the highest?",
    fr: "Ici, presque tout vole : une fusée, un avion, un cerf-volant, un ballon et quelques animaux à ailes. Lequel monte le plus haut ?",
    es: "Aquí casi todo vuela: un cohete, un avión, un papalote, un globo y algunos animales con alas. ¿Cuál sube más alto?",
    pt: "Aqui quase tudo voa: um foguete, um avião, uma pipa, um balão e alguns bichos com asas. Qual sobe mais alto?",
  },
  "in-the-park": {
    en: "An afternoon in the park with a balloon, a kite and an ice cream. What's your favorite thing to do at the park?",
    fr: "Un après-midi au parc avec un ballon, un cerf-volant et une glace. Qu'est-ce que tu préfères faire au parc ?",
    es: "Una tarde en el parque con un globo, un papalote y un helado. ¿Qué es lo que más te gusta hacer en el parque?",
    pt: "Uma tarde no parque com um balão, uma pipa e um sorvete. O que você mais gosta de fazer no parque?",
  },
  "pet-friends": {
    en: "A house full of pets: a cat, a dog, a fish, a bird and a turtle. Which one would you like to look after?",
    fr: "Une maison pleine d'animaux de compagnie : un chat, un chien, un poisson, un oiseau et une tortue. Duquel aimerais-tu t'occuper ?",
    es: "Una casa llena de mascotas: un gato, un perro, un pez, un pájaro y una tortuga. ¿Cuál te gustaría cuidar?",
    pt: "Uma casa cheia de bichos de estimação: gato, cachorro, peixe, passarinho e tartaruga. De qual você gostaria de cuidar?",
  },
  "vegetable-garden": {
    en: "In the vegetable garden, a carrot, a strawberry and a pear are ready to pick, and a snail is on its way. What grows under the ground?",
    fr: "Au potager, une carotte, une fraise et une poire sont prêtes à cueillir, et un escargot arrive. Qu'est-ce qui pousse sous la terre ?",
    es: "En la huerta, una zanahoria, una fresa y una pera están listas, y llega un caracol. ¿Qué crece bajo la tierra?",
    pt: "Na horta, uma cenoura, um morango e uma pera estão prontos para colher, e um caracol vem chegando. O que cresce debaixo da terra?",
  },
  "sweet-treats": {
    en: "A picture of treats: a cupcake and an ice cream, with fruit too. Which ones are fruit?",
    fr: "Une image de douceurs : un cupcake et une glace, et des fruits aussi. Lesquels sont des fruits ?",
    es: "Una imagen de golosinas: un pastelito y un helado, y también frutas. ¿Cuáles son frutas?",
    pt: "Uma imagem de gostosuras: um cupcake e um sorvete, e frutas também. Quais são frutas?",
  },
  "autumn-walk": {
    en: "An autumn walk with the dog: an apple and a pear are ripe and a mushroom pops up. What changes in autumn?",
    fr: "Une promenade d'automne avec le chien : la pomme et la poire sont mûres, et un champignon sort. Qu'est-ce qui change en automne ?",
    es: "Un paseo de otoño con el perro: la manzana y la pera están maduras y sale un hongo. ¿Qué cambia en otoño?",
    pt: "Um passeio de outono com o cachorro: a maçã e a pera estão maduras e brota um cogumelo. O que muda no outono?",
  },
  "toy-box": {
    en: "A box of toys: a rocket, a plane, a boat, a car and a truck. Which ones go on land, on water or in the air?",
    fr: "Une caisse de jouets : une fusée, un avion, un bateau, une voiture et un camion. Lesquels roulent, flottent ou volent ?",
    es: "Una caja de juguetes: un cohete, un avión, un velero, un carro y un camión. ¿Cuáles van por tierra, por agua o por aire?",
    pt: "Uma caixa de brinquedos: foguete, avião, veleiro, carro e caminhão. Quais andam na terra, na água ou no ar?",
  },
  "camping-night": {
    en: "A night of camping under the stars, with the owl awake and a cat and a dog close by. What sounds might you hear at night?",
    fr: "Une nuit de camping sous les étoiles, avec la chouette réveillée, le chat et le chien tout près. Quels bruits entend-on la nuit ?",
    es: "Una noche de campamento bajo las estrellas, con el búho despierto y el gato y el perro cerca. ¿Qué ruidos se oyen de noche?",
    pt: "Uma noite de acampamento sob as estrelas, com a coruja acordada e o gato e o cachorro por perto. Que barulhos se ouvem à noite?",
  },
  "spring-meadow": {
    en: "Spring in the meadow: a flower opens, a butterfly visits and a turtle takes its time. What tells you it's spring?",
    fr: "Le printemps dans la prairie : une fleur s'ouvre, un papillon passe et une tortue prend son temps. À quoi voit-on que c'est le printemps ?",
    es: "Primavera en el prado: se abre una flor, pasa una mariposa y una tortuga va despacio. ¿Cómo sabes que es primavera?",
    pt: "Primavera no campo: uma flor se abre, uma borboleta passa e uma tartaruga vai devagar. Como dá para saber que é primavera?",
  },
  "rainbow-day": {
    en: "Sun after the rain makes a rainbow, and the umbrella can close. Can you name the colors of the rainbow?",
    fr: "Le soleil après la pluie fait un arc-en-ciel, et le parapluie peut se fermer. Sais-tu nommer les couleurs de l'arc-en-ciel ?",
    es: "El sol después de la lluvia trae un arcoíris, y el paraguas ya se puede cerrar. ¿Sabes decir los colores del arcoíris?",
    pt: "O sol depois da chuva traz um arco-íris, e o guarda-chuva já pode fechar. Você sabe dizer as cores do arco-íris?",
  },
  "travel-time": {
    en: "Time to travel: by rocket, plane, car or truck. Where would you go, and how would you get there?",
    fr: "C'est l'heure de partir : en fusée, en avion, en voiture ou en camion. Où irais-tu, et comment ?",
    es: "Hora de viajar: en cohete, en avión, en carro o en camión. ¿Adónde irías, y cómo?",
    pt: "Hora de viajar: de foguete, de avião, de carro ou de caminhão. Para onde você iria, e como?",
  },
};

const WORDS: Record<
  Locale,
  {
    heading: string;
    and: string;
    rows: [string, string, string];
    animals: (n: number, list: string) => string;
    tip: (hidden: string) => string;
  }
> = {
  en: {
    heading: "About this picture",
    and: "and",
    rows: ["Top row", "Middle row", "Bottom row"],
    animals: (n, list) => (n === 1 ? `Only one animal hides in it: ${list}.` : `Count the animals together: there are ${n} (${list}).`),
    tip: (hidden) => `Tip: in 3×3 the empty square is the bottom right one, so ${hidden} only comes back once the puzzle is solved.`,
  },
  fr: {
    heading: "Dans cette image",
    and: "et",
    rows: ["En haut", "Au milieu", "En bas"],
    animals: (n, list) => (n === 1 ? `Un seul animal s'y cache : ${list}.` : `Comptez les animaux ensemble : il y en a ${n} (${list}).`),
    tip: (hidden) => `Astuce : en 3×3, la case vide est celle d'en bas à droite, donc ${hidden} ne revient qu'une fois le taquin terminé.`,
  },
  es: {
    heading: "En esta imagen",
    and: "y",
    rows: ["Arriba", "En el medio", "Abajo"],
    animals: (n, list) => (n === 1 ? `Solo se esconde un animal: ${list}.` : `Cuenten los animales juntos: hay ${n} (${list}).`),
    tip: (hidden) => `Consejo: en 3×3 el hueco es el cuadro de abajo a la derecha, así que ${hidden} solo aparece al terminar el rompecabezas.`,
  },
  pt: {
    heading: "Nesta imagem",
    and: "e",
    rows: ["Em cima", "No meio", "Embaixo"],
    animals: (n, list) => (n === 1 ? `Só um bicho se esconde nela: ${list}.` : `Contem os bichos juntos: são ${n} (${list}).`),
    tip: (hidden) => `Dica: no 3×3 o espaço vazio é o quadrado de baixo à direita, então ${hidden} só volta quando o quebra-cabeça fica pronto.`,
  },
};

const join = (names: string[], and: string) => (names.length === 1 ? names[0] : `${names.slice(0, -1).join(", ")} ${and} ${names[names.length - 1]}`);

/** The drawings of a scene in the three rows of the 3 × 3 board, left to right (from each drawing's centre). */
export function sceneRows(p: SlidingPuzzle): string[][] {
  const cell = 200 / 3;
  const rows: { id: string; x: number }[][] = [[], [], []];
  for (const it of p.items) {
    const row = Math.min(2, Math.floor((it.y + it.h / 2) / cell));
    rows[row].push({ id: it.drawing, x: it.x + it.w / 2 });
  }
  return rows.map((r) => r.sort((a, b) => a.x - b.x).map((d) => d.id));
}

/** The drawing in the bottom right square, hidden by the gap until the 3 × 3 puzzle is solved. */
export function hiddenDrawing(p: SlidingPuzzle): string {
  const cell = 200 / 3;
  const inCorner = p.items.filter((it) => it.x + it.w / 2 >= 2 * cell && it.y + it.h / 2 >= 2 * cell);
  if (inCorner.length !== 1) throw new Error(`${p.id}: ${inCorner.length} drawings in the bottom right square`);
  return inCorner[0].drawing;
}

export function puzzleGuide(locale: Locale, slug: string): Block[] {
  const p = PUZZLES.find((x) => x.slug[locale] === slug);
  const line = p && SCENE_TEXT[p.id]?.[locale];
  if (!p || !line) return [];
  const w = WORDS[locale];
  const the = (id: string) => getDrawing(id).the[locale];
  const rows = sceneRows(p)
    .map((r, i) => `${w.rows[i]}${locale === "fr" ? " :" : ":"} ${join(r.map(the), w.and)}.`)
    .join(" ");
  const animals = p.items.map((it) => it.drawing).filter((id) => ANIMALS.has(id));
  const paragraphs = [[line], [rows], [[animals.length ? w.animals(animals.length, join(animals.map(the), w.and)) : "", w.tip(the(hiddenDrawing(p)))].filter(Boolean).join(" ")]];
  return [{ id: "picture", heading: w.heading, paragraphs }];
}
