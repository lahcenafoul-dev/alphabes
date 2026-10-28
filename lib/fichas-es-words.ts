// The first-syllable words and look-alike letters of the Spanish worksheets
// (lib/fichas-es.ts), also used by the Spanish games. Pure data, kept apart from the
// worksheet catalogue so the games' browser code stays small.
import type { SpanishWord } from "./letters-es";

const w = (word: string, withArticle: string, picture: string): SpanishWord => ({ word, withArticle, picture });

/**
 * "Escribe la primera sílaba": pictured words split into syllables ("ma|no"),
 * all starting with the letter. Letters with no clear first-letter words
 * (ñ, q, w, x) get no such sheet.
 */
export const FIRST_SYLLABLE_WORDS: Record<string, SpanishWord[]> = {
  a: [w("a|vión", "un avión", "airplane"), w("a|be|ja", "una abeja", "bee"), w("a|ra|ña", "una araña", "spider"), w("an|cla", "un ancla", "anchor")],
  b: [w("ba|lle|na", "una ballena", "whale"), w("bar|co", "un barco", "sailboat"), w("bo|ta", "una bota", "boot"), w("bu|rro", "un burro", "donkey")],
  c: [w("co|ne|jo", "un conejo", "rabbit"), w("ca|sa", "una casa", "house"), w("cu|cha|ra", "una cuchara", "spoon"), w("ce|re|za", "una cereza", "cherry")],
  d: [w("da|do", "un dado", "dice"), w("del|fín", "un delfín", "dolphin"), w("di|no|sau|rio", "un dinosaurio", "dinosaur"), w("du|cha", "una ducha", "shower")],
  e: [w("e|le|fan|te", "un elefante", "elephant"), w("es|tre|lla", "una estrella", "star"), w("es|co|ba", "una escoba", "broom"), w("el|fo", "un elfo", "elf")],
  f: [w("fo|ca", "una foca", "seal"), w("fue|go", "un fuego", "fire"), w("fan|tas|ma", "un fantasma", "ghost")],
  g: [w("ga|to", "un gato", "cat"), w("go|ri|la", "un gorila", "gorilla"), w("gu|sa|no", "un gusano", "caterpillar"), w("gi|ra|sol", "un girasol", "sunflower")],
  h: [w("he|la|do", "un helado", "ice-cream"), w("hue|vo", "un huevo", "egg"), w("hor|mi|ga", "una hormiga", "ant"), w("ha|da", "un hada", "fairy")],
  i: [w("i|gua|na", "una iguana", "lizard"), w("is|la", "una isla", "island"), w("i|mán", "un imán", "magnet")],
  j: [w("ji|ra|fa", "una jirafa", "giraffe"), w("ja|bón", "un jabón", "soap"), w("ju|gue|te", "un juguete", "teddy-bear")],
  k: [w("ko|a|la", "un koala", "koala"), w("ka|yak", "un kayak", "canoe"), w("ki|wi", "un kiwi", "kiwi")],
  l: [w("le|ón", "un león", "lion"), w("lu|na", "una luna", "moon"), w("lá|piz", "un lápiz", "pencil"), w("lo|ro", "un loro", "parrot")],
  m: [w("man|za|na", "una manzana", "apple"), w("mo|no", "un mono", "monkey"), w("ma|no", "una mano", "hand"), w("ma|ri|po|sa", "una mariposa", "butterfly")],
  n: [w("nu|be", "una nube", "cloud"), w("na|riz", "una nariz", "nose"), w("ni|ño", "un niño", "child"), w("ni|do", "un nido", "nest")],
  o: [w("o|so", "un oso", "bear"), w("o|ve|ja", "una oveja", "sheep"), w("o|jo", "un ojo", "eye")],
  p: [w("pa|to", "un pato", "duck"), w("pe|rro", "un perro", "dog"), w("pe|lo|ta", "una pelota", "ball"), w("pin|güi|no", "un pingüino", "penguin")],
  r: [w("ra|tón", "un ratón", "mouse"), w("ra|na", "una rana", "frog"), w("ro|sa", "una rosa", "rose"), w("re|loj", "un reloj", "alarm-clock")],
  s: [w("ser|pien|te", "una serpiente", "snake"), w("si|lla", "una silla", "chair"), w("so|pa", "una sopa", "soup")],
  t: [w("tor|tu|ga", "una tortuga", "turtle"), w("to|ma|te", "un tomate", "tomato"), w("ti|gre", "un tigre", "tiger"), w("ta|xi", "un taxi", "taxi")],
  u: [w("u|va", "una uva", "grapes"), w("u|ni|cor|nio", "un unicornio", "unicorn"), w("u|ña", "una uña", "nail-polish")],
  v: [w("va|ca", "una vaca", "cow"), w("vol|cán", "un volcán", "volcano"), w("ve|la", "una vela", "candle")],
  y: [w("yo|yó", "un yoyó", "yo-yo"), w("ya|te", "un yate", "yacht")],
  z: [w("za|pa|to", "un zapato", "shoe"), w("zo|rro", "un zorro", "fox"), w("za|na|ho|ria", "una zanahoria", "carrot")],
};

/** Look-alike letters mixed into the recognition grid. */
export const LOOK_ALIKES: Record<string, string> = {
  a: "odeq", b: "dpqh", c: "eo", d: "bpqa", e: "coa", f: "tlj", g: "qpy", h: "nbk", i: "ljt", j: "igy",
  k: "hxl", l: "itf", m: "nwu", n: "muhñ", ñ: "nmh", o: "ace", p: "qbd", q: "pgd", r: "nvt", s: "zc", t: "fli",
  u: "nvy", v: "wuy", w: "vmu", x: "kzy", y: "vgj", z: "sx",
};
