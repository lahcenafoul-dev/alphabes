// The first-syllable words and look-alike letters of the Portuguese worksheets
// (lib/atividades-pt.ts), also used by the Portuguese games. Pure data, kept apart from the
// worksheet catalogue so the games' browser code stays small.
import type { PortugueseWord } from "./letters-pt";

const w = (word: string, withArticle: string, emoji: string): PortugueseWord => ({ word, withArticle, emoji });

/**
 * "A sílaba inicial": pictured words split into syllables ("bo|la"), all
 * starting with the letter. Ç (never first), K, Q, W and Y (borrowed words or
 * a silent u) get no such sheet.
 */
export const FIRST_SYLLABLE_WORDS: Record<string, PortugueseWord[]> = {
  a: [w("a|be|lha", "uma abelha", "🐝"), w("a|vi|ão", "um avião", "✈️"), w("a|ra|nha", "uma aranha", "🕷️"), w("ân|co|ra", "uma âncora", "⚓")],
  b: [w("bo|la", "uma bola", "⚽"), w("ba|lei|a", "uma baleia", "🐳"), w("ba|na|na", "uma banana", "🍌"), w("bo|né", "um boné", "🧢")],
  c: [w("ca|sa", "uma casa", "🏠"), w("ce|bo|la", "uma cebola", "🧅"), w("co|e|lho", "um coelho", "🐰"), w("ca|va|lo", "um cavalo", "🐴")],
  d: [w("da|do", "um dado", "🎲"), w("den|te", "um dente", "🦷"), w("di|nos|sau|ro", "um dinossauro", "🦕"), w("de|do", "um dedo", "👆")],
  e: [w("e|le|fan|te", "um elefante", "🐘"), w("es|tre|la", "uma estrela", "⭐"), w("es|co|va", "uma escova", "🪥"), w("es|qui|lo", "um esquilo", "🐿️")],
  f: [w("fo|ca", "uma foca", "🦭"), w("fo|go", "o fogo", "🔥"), w("fa|da", "uma fada", "🧚"), w("fan|tas|ma", "um fantasma", "👻")],
  g: [w("ga|to", "um gato", "🐱"), w("gi|ra|fa", "uma girafa", "🦒"), w("go|ri|la", "um gorila", "🦍"), w("ga|li|nha", "uma galinha", "🐔")],
  h: [w("he|li|cóp|te|ro", "um helicóptero", "🚁"), w("hi|po|pó|ta|mo", "um hipopótamo", "🦛"), w("ho|tel", "um hotel", "🏨"), w("ham|búr|guer", "um hambúrguer", "🍔")],
  i: [w("i|gua|na", "uma iguana", "🦎"), w("i|lha", "uma ilha", "🏝️"), w("í|mã", "um ímã", "🧲"), w("i|gre|ja", "uma igreja", "⛪")],
  j: [w("ja|ca|ré", "um jacaré", "🐊"), w("ja|ne|la", "uma janela", "🪟"), w("jo|a|ni|nha", "uma joaninha", "🐞"), w("jar|dim", "um jardim", "🌷")],
  l: [w("le|ão", "um leão", "🦁"), w("lu|a", "a lua", "🌙"), w("lá|pis", "um lápis", "✏️"), w("li|mão", "um limão", "🍋")],
  m: [w("ma|ca|co", "um macaco", "🐒"), w("ma|la", "uma mala", "🧳"), w("ma|çã", "uma maçã", "🍎"), w("mo|to", "uma moto", "🏍️")],
  n: [w("na|vi|o", "um navio", "🚢"), w("nu|vem", "uma nuvem", "☁️"), w("na|riz", "um nariz", "👃"), w("ni|nho", "um ninho", "🪺")],
  o: [w("o|vo", "um ovo", "🥚"), w("o|ve|lha", "uma ovelha", "🐑"), w("o|lho", "um olho", "👁️"), w("on|ça", "uma onça", "🐆")],
  p: [w("pa|to", "um pato", "🦆"), w("pei|xe", "um peixe", "🐟"), w("pi|po|ca", "uma pipoca", "🍿"), w("pe|ra", "uma pera", "🍐")],
  r: [w("ra|to", "um rato", "🐭"), w("re|ló|gio", "um relógio", "⌚"), w("ro|sa", "uma rosa", "🌹"), w("ro|bô", "um robô", "🤖")],
  s: [w("sa|po", "um sapo", "🐸"), w("si|no", "um sino", "🔔"), w("so|pa", "uma sopa", "🍲"), w("su|co", "um suco", "🧃")],
  t: [w("tar|ta|ru|ga", "uma tartaruga", "🐢"), w("to|ma|te", "um tomate", "🍅"), w("ti|gre", "um tigre", "🐯"), w("tá|xi", "um táxi", "🚕")],
  u: [w("u|va", "uma uva", "🍇"), w("ur|so", "um urso", "🐻"), w("u|ni|cór|nio", "um unicórnio", "🦄"), w("u|nha", "uma unha", "💅")],
  v: [w("va|ca", "uma vaca", "🐄"), w("vul|cão", "um vulcão", "🌋"), w("ve|la", "uma vela", "🕯️"), w("vi|o|lão", "um violão", "🎸")],
  x: [w("xí|ca|ra", "uma xícara", "☕"), w("xa|drez", "o xadrez", "♟️"), w("xam|pu", "um xampu", "🧴")],
  z: [w("ze|bra", "uma zebra", "🦓"), w("ze|ro", "o número zero", "0️⃣")],
};

/** Look-alike letters mixed into the recognition grid. */
export const LOOK_ALIKES: Record<string, string> = {
  a: "odeq", b: "dpqh", c: "eoç", ç: "cse", d: "bpqa", e: "coa", f: "tlj", g: "qpy", h: "nbk", i: "ljt", j: "igy",
  k: "hxl", l: "itf", m: "nwu", n: "muh", o: "ace", p: "qbd", q: "pgd", r: "nvt", s: "zc", t: "fli",
  u: "nvy", v: "wuy", w: "vmu", x: "kzy", y: "vgj", z: "sx",
};
