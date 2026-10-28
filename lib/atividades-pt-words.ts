// The first-syllable words and look-alike letters of the Portuguese worksheets
// (lib/atividades-pt.ts), also used by the Portuguese games. Pure data, kept apart from the
// worksheet catalogue so the games' browser code stays small.
import type { PortugueseWord } from "./letters-pt";

const w = (word: string, withArticle: string, picture: string): PortugueseWord => ({ word, withArticle, picture });

/**
 * "A sílaba inicial": pictured words split into syllables ("bo|la"), all
 * starting with the letter. Ç (never first), K, Q, W and Y (borrowed words or
 * a silent u) get no such sheet.
 */
export const FIRST_SYLLABLE_WORDS: Record<string, PortugueseWord[]> = {
  a: [w("a|be|lha", "uma abelha", "bee"), w("a|vi|ão", "um avião", "airplane"), w("a|ra|nha", "uma aranha", "spider"), w("ân|co|ra", "uma âncora", "anchor")],
  b: [w("bo|la", "uma bola", "ball"), w("ba|lei|a", "uma baleia", "whale"), w("ba|na|na", "uma banana", "banana"), w("bo|né", "um boné", "cap")],
  c: [w("ca|sa", "uma casa", "house"), w("ce|bo|la", "uma cebola", "onion"), w("co|e|lho", "um coelho", "rabbit"), w("ca|va|lo", "um cavalo", "horse")],
  d: [w("da|do", "um dado", "dice"), w("den|te", "um dente", "tooth"), w("di|nos|sau|ro", "um dinossauro", "dinosaur"), w("de|do", "um dedo", "finger")],
  e: [w("e|le|fan|te", "um elefante", "elephant"), w("es|tre|la", "uma estrela", "star"), w("es|co|va", "uma escova", "toothbrush"), w("es|qui|lo", "um esquilo", "squirrel")],
  f: [w("fo|ca", "uma foca", "seal"), w("fo|go", "o fogo", "fire"), w("fa|da", "uma fada", "fairy"), w("fan|tas|ma", "um fantasma", "ghost")],
  g: [w("ga|to", "um gato", "cat"), w("gi|ra|fa", "uma girafa", "giraffe"), w("go|ri|la", "um gorila", "gorilla"), w("ga|li|nha", "uma galinha", "hen")],
  h: [w("he|li|cóp|te|ro", "um helicóptero", "helicopter"), w("hi|po|pó|ta|mo", "um hipopótamo", "hippo"), w("ho|tel", "um hotel", "hotel"), w("ham|búr|guer", "um hambúrguer", "hamburger")],
  i: [w("i|gua|na", "uma iguana", "lizard"), w("i|lha", "uma ilha", "island"), w("í|mã", "um ímã", "magnet"), w("i|gre|ja", "uma igreja", "church")],
  j: [w("ja|ca|ré", "um jacaré", "crocodile"), w("ja|ne|la", "uma janela", "window"), w("jo|a|ni|nha", "uma joaninha", "ladybug"), w("jar|dim", "um jardim", "tulip")],
  l: [w("le|ão", "um leão", "lion"), w("lu|a", "a lua", "moon"), w("lá|pis", "um lápis", "pencil"), w("li|mão", "um limão", "lemon")],
  m: [w("ma|ca|co", "um macaco", "monkey"), w("ma|la", "uma mala", "suitcase"), w("ma|çã", "uma maçã", "apple"), w("mo|to", "uma moto", "motorbike")],
  n: [w("na|vi|o", "um navio", "ship"), w("nu|vem", "uma nuvem", "cloud"), w("na|riz", "um nariz", "nose"), w("ni|nho", "um ninho", "nest")],
  o: [w("o|vo", "um ovo", "egg"), w("o|ve|lha", "uma ovelha", "sheep"), w("o|lho", "um olho", "eye"), w("on|ça", "uma onça", "jaguar")],
  p: [w("pa|to", "um pato", "duck"), w("pei|xe", "um peixe", "fish"), w("pi|po|ca", "uma pipoca", "popcorn"), w("pe|ra", "uma pera", "pear")],
  r: [w("ra|to", "um rato", "mouse"), w("re|ló|gio", "um relógio", "watch"), w("ro|sa", "uma rosa", "rose"), w("ro|bô", "um robô", "robot")],
  s: [w("sa|po", "um sapo", "frog"), w("si|no", "um sino", "bell"), w("so|pa", "uma sopa", "soup"), w("su|co", "um suco", "juice")],
  t: [w("tar|ta|ru|ga", "uma tartaruga", "turtle"), w("to|ma|te", "um tomate", "tomato"), w("ti|gre", "um tigre", "tiger"), w("tá|xi", "um táxi", "taxi")],
  u: [w("u|va", "uma uva", "grapes"), w("ur|so", "um urso", "bear"), w("u|ni|cór|nio", "um unicórnio", "unicorn"), w("u|nha", "uma unha", "nail-polish")],
  v: [w("va|ca", "uma vaca", "cow"), w("vul|cão", "um vulcão", "volcano"), w("ve|la", "uma vela", "candle"), w("vi|o|lão", "um violão", "guitar")],
  x: [w("xí|ca|ra", "uma xícara", "cup"), w("xa|drez", "o xadrez", "chess-pawn"), w("xam|pu", "um xampu", "shampoo")],
  z: [w("ze|bra", "uma zebra", "zebra"), w("ze|ro", "o número zero", "number-0")],
};

/** Look-alike letters mixed into the recognition grid. */
export const LOOK_ALIKES: Record<string, string> = {
  a: "odeq", b: "dpqh", c: "eoç", ç: "cse", d: "bpqa", e: "coa", f: "tlj", g: "qpy", h: "nbk", i: "ljt", j: "igy",
  k: "hxl", l: "itf", m: "nwu", n: "muh", o: "ace", p: "qbd", q: "pgd", r: "nvt", s: "zc", t: "fli",
  u: "nvy", v: "wuy", w: "vmu", x: "kzy", y: "vgj", z: "sx",
};
