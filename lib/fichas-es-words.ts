// The first-syllable words and look-alike letters of the Spanish worksheets
// (lib/fichas-es.ts), also used by the Spanish games. Pure data, kept apart from the
// worksheet catalogue so the games' browser code stays small.
import type { SpanishWord } from "./letters-es";

const w = (word: string, withArticle: string, emoji: string): SpanishWord => ({ word, withArticle, emoji });

/**
 * "Escribe la primera sílaba": pictured words split into syllables ("ma|no"),
 * all starting with the letter. Letters with no clear first-letter words
 * (ñ, q, w, x) get no such sheet.
 */
export const FIRST_SYLLABLE_WORDS: Record<string, SpanishWord[]> = {
  a: [w("a|vión", "un avión", "✈️"), w("a|be|ja", "una abeja", "🐝"), w("a|ra|ña", "una araña", "🕷️"), w("an|cla", "un ancla", "⚓")],
  b: [w("ba|lle|na", "una ballena", "🐳"), w("bar|co", "un barco", "⛵"), w("bo|ta", "una bota", "👢"), w("bu|rro", "un burro", "🫏")],
  c: [w("co|ne|jo", "un conejo", "🐰"), w("ca|sa", "una casa", "🏠"), w("cu|cha|ra", "una cuchara", "🥄"), w("ce|re|za", "una cereza", "🍒")],
  d: [w("da|do", "un dado", "🎲"), w("del|fín", "un delfín", "🐬"), w("di|no|sau|rio", "un dinosaurio", "🦕"), w("du|cha", "una ducha", "🚿")],
  e: [w("e|le|fan|te", "un elefante", "🐘"), w("es|tre|lla", "una estrella", "⭐"), w("es|co|ba", "una escoba", "🧹"), w("el|fo", "un elfo", "🧝")],
  f: [w("fo|ca", "una foca", "🦭"), w("fue|go", "un fuego", "🔥"), w("fan|tas|ma", "un fantasma", "👻")],
  g: [w("ga|to", "un gato", "🐱"), w("go|ri|la", "un gorila", "🦍"), w("gu|sa|no", "un gusano", "🐛"), w("gi|ra|sol", "un girasol", "🌻")],
  h: [w("he|la|do", "un helado", "🍦"), w("hue|vo", "un huevo", "🥚"), w("hor|mi|ga", "una hormiga", "🐜"), w("ha|da", "un hada", "🧚")],
  i: [w("i|gua|na", "una iguana", "🦎"), w("is|la", "una isla", "🏝️"), w("i|mán", "un imán", "🧲")],
  j: [w("ji|ra|fa", "una jirafa", "🦒"), w("ja|bón", "un jabón", "🧼"), w("ju|gue|te", "un juguete", "🧸")],
  k: [w("ko|a|la", "un koala", "🐨"), w("ka|yak", "un kayak", "🛶"), w("ki|wi", "un kiwi", "🥝")],
  l: [w("le|ón", "un león", "🦁"), w("lu|na", "una luna", "🌙"), w("lá|piz", "un lápiz", "✏️"), w("lo|ro", "un loro", "🦜")],
  m: [w("man|za|na", "una manzana", "🍎"), w("mo|no", "un mono", "🐒"), w("ma|no", "una mano", "✋"), w("ma|ri|po|sa", "una mariposa", "🦋")],
  n: [w("nu|be", "una nube", "☁️"), w("na|riz", "una nariz", "👃"), w("ni|ño", "un niño", "🧒"), w("ni|do", "un nido", "🪺")],
  o: [w("o|so", "un oso", "🐻"), w("o|ve|ja", "una oveja", "🐑"), w("o|jo", "un ojo", "👁️")],
  p: [w("pa|to", "un pato", "🦆"), w("pe|rro", "un perro", "🐶"), w("pe|lo|ta", "una pelota", "⚽"), w("pin|güi|no", "un pingüino", "🐧")],
  r: [w("ra|tón", "un ratón", "🐭"), w("ra|na", "una rana", "🐸"), w("ro|sa", "una rosa", "🌹"), w("re|loj", "un reloj", "⏰")],
  s: [w("ser|pien|te", "una serpiente", "🐍"), w("si|lla", "una silla", "🪑"), w("so|pa", "una sopa", "🍲")],
  t: [w("tor|tu|ga", "una tortuga", "🐢"), w("to|ma|te", "un tomate", "🍅"), w("ti|gre", "un tigre", "🐯"), w("ta|xi", "un taxi", "🚕")],
  u: [w("u|va", "una uva", "🍇"), w("u|ni|cor|nio", "un unicornio", "🦄"), w("u|ña", "una uña", "💅")],
  v: [w("va|ca", "una vaca", "🐄"), w("vol|cán", "un volcán", "🌋"), w("ve|la", "una vela", "🕯️")],
  y: [w("yo|yó", "un yoyó", "🪀"), w("ya|te", "un yate", "🛥️")],
  z: [w("za|pa|to", "un zapato", "👞"), w("zo|rro", "un zorro", "🦊"), w("za|na|ho|ria", "una zanahoria", "🥕")],
};

/** Look-alike letters mixed into the recognition grid. */
export const LOOK_ALIKES: Record<string, string> = {
  a: "odeq", b: "dpqh", c: "eo", d: "bpqa", e: "coa", f: "tlj", g: "qpy", h: "nbk", i: "ljt", j: "igy",
  k: "hxl", l: "itf", m: "nwu", n: "muhñ", ñ: "nmh", o: "ace", p: "qbd", q: "pgd", r: "nvt", s: "zc", t: "fli",
  u: "nvy", v: "wuy", w: "vmu", x: "kzy", y: "vgj", z: "sx",
};
