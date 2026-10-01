// Spanish alphabet content: the 27 letters (with ñ), written for
// Spanish-speaking families in neutral Latin American Spanish
// (docs/spanish-plan.md, D1–D5): RAE letter names with the names many Latin
// American children learn, Latin American pronunciation (seseo, yeísmo) with
// a note where Spain differs, and example words that mean the same thing in
// every Spanish-speaking country. The English and French letters live in
// letters-data.ts and letters-fr.ts; the alphabets are separate on purpose.
//
// Pure data with no imports, so middleware, pages and tests can all use it.

export type SpanishWord = {
  word: string;
  /** With its article, as a child would say it ("un avión"). */
  withArticle: string;
  emoji: string;
};

export type SpanishLetter = {
  /** URL param: "a", or "enie" for ñ (an ñ in a URL shows as %C3%B1). */
  slug: string;
  lower: string;
  upper: string;
  /** The letter's name as the RAE recommends it ("be", "uve doble"). */
  name: string;
  /** Other names children often learn in Latin America ("ve chica", "i griega"). */
  otherNames?: string[];
  /** Main sound(s) in IPA, shown to parents. */
  ipa: string;
  kind: "vocal" | "consonante";
  /** What the speech engine says for the letter's name. */
  nameSpoken: string;
  /**
   * What the speech engine says for the sound. A consonant can't be said
   * alone, so it's heard in its syllables (ma, me, mi, mo, mu), as Spanish
   * schools teach it.
   */
  soundSpoken: string;
  /** The sound, explained for parents (also the answer to the first FAQ). */
  sound: string;
  /** Example words. For ñ, w and some others the letter is inside the word. */
  words: SpanishWord[];
  /** More words where the letter's sound is heard inside the word. */
  wordsInside?: SpanishWord[];
  /** "Para mamá y papá" note for parents. */
  tip: string;
  faq: { question: string; answer: string };
  /** Letters (slugs) linked from this letter's page; "tilde" is the tilde page. */
  related?: string[];
};

export const TILDE_SLUG = "tilde";

const w = (word: string, withArticle: string, emoji: string): SpanishWord => ({ word, withArticle, emoji });

export const spanishLetters: SpanishLetter[] = [
  {
    slug: "a",
    lower: "a",
    upper: "A",
    name: "a",
    ipa: "[a]",
    kind: "vocal",
    nameSpoken: "a",
    soundSpoken: "a. Como en avión, abeja.",
    sound: "La A suena [a], como al principio de avión y de abeja. Es una vocal: se dice con la boca bien abierta y siempre suena igual, en cualquier palabra.",
    words: [w("Avión", "un avión", "✈️"), w("Abeja", "una abeja", "🐝")],
    tip: "La A suele ser la primera letra que tu hijo o hija reconoce, porque abre el abecedario y aparece en muchos nombres. Búsquenla juntos en los empaques, los letreros y las portadas de los cuentos.",
    faq: {
      question: "¿A qué edad se reconoce la letra A?",
      answer: "Entre los 3 y los 5 años, en preescolar, muchos niños ya reconocen la A, sobre todo si está en su nombre. Unirla a su sonido y leerla en sílabas (ma, pa, la) llega hacia los 5 o 6 años.",
    },
    related: ["e", "o", TILDE_SLUG],
  },
  {
    slug: "b",
    lower: "b",
    upper: "B",
    name: "be",
    otherNames: ["be larga", "be grande", "be alta"],
    ipa: "[b]",
    kind: "consonante",
    nameSpoken: "be",
    soundSpoken: "ba, be, bi, bo, bu. Como en ballena, barco.",
    sound: "La B suena [b]: se juntan los labios y se abren, como en ballena y barco. En español la B y la V suenan exactamente igual.",
    words: [w("Ballena", "una ballena", "🐳"), w("Barco", "un barco", "⛵")],
    tip: "Como la B y la V suenan igual, el niño no puede saber de oído cuál va en cada palabra: hay que aprenderlo palabra por palabra. Al principio basta con que lea ba, be, bi, bo, bu; la ortografía vendrá después.",
    faq: {
      question: "¿Por qué la B y la V suenan igual?",
      answer: "En el español de hoy las dos letras se pronuncian [b] en todos los países: barco y vaca empiezan con el mismo sonido. La diferencia es solo de escritura, por eso se aprende leyendo y escribiendo mucho las mismas palabras.",
    },
    related: ["v", "d", "p"],
  },
  {
    slug: "c",
    lower: "c",
    upper: "C",
    name: "ce",
    ipa: "[k] / [s]",
    kind: "consonante",
    nameSpoken: "ce",
    soundSpoken: "ca, co, cu. Como en conejo. ce, ci. Como en cereza.",
    sound: "La C tiene dos sonidos. Con a, o y u suena fuerte, [k], como en conejo (ca, co, cu). Con e y con i suena suave, [s], como en cereza (ce, ci). En gran parte de España, ce y ci se dicen con la lengua entre los dientes.",
    words: [w("Conejo", "un conejo", "🐰"), w("Cereza", "una cereza", "🍒")],
    tip: "No hace falta explicar todo de una vez. Empiecen con ca, co, cu (casa, conejo, cuna) y, cuando lo dominen, presenten ce y ci como la «sorpresa» de la C. Para decir [k] con e o con i se escribe que, qui: queso, quince.",
    faq: {
      question: "¿Cuándo suena fuerte y cuándo suave la C?",
      answer: "Suena fuerte [k] antes de a, o, u (casa, cola, cuna) y suave [s] antes de e, i (cena, cine). Por eso, para el sonido fuerte con e o con i se usa qu: queso, quinto.",
    },
    related: ["k", "q", "s", "z"],
  },
  {
    slug: "d",
    lower: "d",
    upper: "D",
    name: "de",
    ipa: "[d]",
    kind: "consonante",
    nameSpoken: "de",
    soundSpoken: "da, de, di, do, du. Como en dado, delfín.",
    sound: "La D suena [d], como en dado y delfín: la punta de la lengua toca la parte de atrás de los dientes de arriba.",
    words: [w("Dado", "un dado", "🎲"), w("Delfín", "un delfín", "🐬")],
    tip: "Los niños pequeños confunden a menudo la b y la d al escribir: es normal hasta los 7 años más o menos. Al trazar la d, empiecen por la «pancita» y luego suban el palito; la b empieza por el palito.",
    faq: {
      question: "¿Cuál es la diferencia entre la D y la T?",
      answer: "Las dos se dicen en el mismo lugar, pero con la D la garganta vibra y con la T no. Pon la mano de tu hijo en tu garganta mientras dices «da» y luego «ta»: sentirá la diferencia.",
    },
    related: ["b", "t"],
  },
  {
    slug: "e",
    lower: "e",
    upper: "E",
    name: "e",
    ipa: "[e]",
    kind: "vocal",
    nameSpoken: "e",
    soundSpoken: "e. Como en elefante, estrella.",
    sound: "La E suena [e], como al principio de elefante y de estrella. Como todas las vocales del español, siempre suena igual.",
    words: [w("Elefante", "un elefante", "🐘"), w("Estrella", "una estrella", "⭐")],
    tip: "Las cinco vocales (a, e, i, o, u) son la base de la lectura en español: con ellas se forman todas las sílabas. Una buena forma de repasarlas es cantar juntos una canción de las vocales.",
    faq: {
      question: "¿Cuántas vocales tiene el español?",
      answer: "Cinco: a, e, i, o, u. Cada una tiene un solo sonido, que no cambia de una palabra a otra. La y suena como i cuando va sola o al final de una palabra (y, rey), pero se cuenta como consonante.",
    },
    related: ["a", "i", TILDE_SLUG],
  },
  {
    slug: "f",
    lower: "f",
    upper: "F",
    name: "efe",
    ipa: "[f]",
    kind: "consonante",
    nameSpoken: "efe",
    soundSpoken: "fa, fe, fi, fo, fu. Como en foca, flor.",
    sound: "La F suena [f], como en foca y flor: los dientes de arriba tocan el labio de abajo y el aire sale soplando.",
    words: [w("Foca", "una foca", "🦭"), w("Flor", "una flor", "🌸")],
    tip: "La F es un sonido que se puede alargar, «ffff», como un globo que se desinfla. Por eso es fácil de escuchar al principio de las palabras: un buen juego para empezar.",
    faq: {
      question: "¿Cómo se lee «flor» si tiene dos consonantes juntas?",
      answer: "Fl es una sílaba trabada: la f y la l se dicen juntas, sin vocal entre ellas (flo-r). Se aprenden después de las sílabas directas como fa, fe, fi, fo, fu.",
    },
    related: ["v", "l"],
  },
  {
    slug: "g",
    lower: "g",
    upper: "G",
    name: "ge",
    ipa: "[g] / [x]",
    kind: "consonante",
    nameSpoken: "ge",
    soundSpoken: "ga, go, gu. Como en gato. ge, gi. Como en girasol.",
    sound: "La G tiene dos sonidos. Con a, o y u suena suave, [g], como en gato (ga, go, gu). Con e y con i suena fuerte, como la jota, [x], como en girasol (ge, gi).",
    words: [w("Gato", "un gato", "🐱"), w("Girasol", "un girasol", "🌻")],
    tip: "Para el sonido de gato con e o con i, se escribe gue, gui, y la u no suena: guerra, guitarra. Y si la u sí suena, lleva dos puntitos, la diéresis: pingüino. Eso se aprende más adelante, en las sílabas.",
    faq: {
      question: "¿Por qué girasol se lee con sonido de jota?",
      answer: "Antes de e y de i, la G suena como la J: gente, gigante, girasol. Antes de a, o, u suena como en gato, goma, gusano. Por eso jirafa y girasol empiezan con el mismo sonido y distinta letra.",
    },
    related: ["j", "c", TILDE_SLUG],
  },
  {
    slug: "h",
    lower: "h",
    upper: "H",
    name: "hache",
    ipa: "(muda)",
    kind: "consonante",
    nameSpoken: "hache",
    soundSpoken: "ha, he, hi, ho, hu. La hache no suena. Como en helado, huevo.",
    sound: "La H no suena: es la letra muda. En helado y huevo solo se oyen las vocales: elado, uevo. Junto a la c forma ch, que sí tiene sonido, como en chocolate.",
    words: [w("Helado", "un helado", "🍦"), w("Huevo", "un huevo", "🥚")],
    tip: "A los niños les encanta la idea de una letra «que no habla». Pueden decir que la H es tímida y se calla. Como no se oye, para escribirla bien hay que recordar cada palabra.",
    faq: {
      question: "Si la H no suena, ¿para qué sirve?",
      answer: "Casi siempre está por la historia de la palabra (muchas venían del latín con f o con h). No cambia la lectura: hada se lee ada. La excepción es ch, que es un sonido propio: chile, noche.",
    },
    related: ["c"],
  },
  {
    slug: "i",
    lower: "i",
    upper: "I",
    name: "i",
    otherNames: ["i latina"],
    ipa: "[i]",
    kind: "vocal",
    nameSpoken: "i",
    soundSpoken: "i. Como en iguana, isla.",
    sound: "La I suena [i], como al principio de iguana y de isla. Se dice sonriendo, con los labios estirados.",
    words: [w("Iguana", "una iguana", "🦎"), w("Isla", "una isla", "🏝️")],
    tip: "En algunos países le dicen «i latina» para distinguirla de la «i griega» (la y). El punto de la i minúscula es lo último que se pone: primero el palito, después el punto.",
    faq: {
      question: "¿La I y la Y suenan igual?",
      answer: "La y suena como i cuando va sola (y) o al final de una palabra (rey, muy). Al principio de una sílaba suena como ll: yoyó, playa. Por eso la i se llama a veces «i latina» y la y «i griega».",
    },
    related: ["y", "e", "u"],
  },
  {
    slug: "j",
    lower: "j",
    upper: "J",
    name: "jota",
    ipa: "[x]",
    kind: "consonante",
    nameSpoken: "jota",
    soundSpoken: "ja, je, ji, jo, ju. Como en jirafa, jabón.",
    sound: "La J suena [x], un sonido que se hace en la garganta, como en jirafa y jabón. Suena igual con todas las vocales: ja, je, ji, jo, ju.",
    words: [w("Jirafa", "una jirafa", "🦒"), w("Jabón", "un jabón", "🧼")],
    tip: "En algunos países la jota suena más suave, casi como una h que sopla; en otros, más fuerte. Las dos formas están bien: lo importante es que tu hijo la oiga y la reconozca.",
    faq: {
      question: "¿Por qué gente se escribe con G y jirafa con J?",
      answer: "Antes de e y de i, la g y la j suenan igual (gente, jefe; girasol, jirafa). La letra correcta se aprende con cada palabra. Antes de a, o, u solo la j hace este sonido: jamón, joya, juego.",
    },
    related: ["g"],
  },
  {
    slug: "k",
    lower: "k",
    upper: "K",
    name: "ka",
    ipa: "[k]",
    kind: "consonante",
    nameSpoken: "ka",
    soundSpoken: "ka, ke, ki, ko, ku. Como en koala, kayak.",
    sound: "La K suena [k], el mismo sonido de ca, co, cu y de que, qui. Casi solo aparece en palabras que vienen de otros idiomas, como koala, kayak o kilo.",
    words: [w("Koala", "un koala", "🐨"), w("Kayak", "un kayak", "🛶")],
    tip: "La K se ve poco en los cuentos. No hace falta practicarla tanto como la C: basta con que el niño la reconozca y sepa que suena como la c de casa.",
    faq: {
      question: "¿Por qué se escribe «kilo» con K y «queso» con QU?",
      answer: "Las dos formas hacen el mismo sonido [k]. Kilo, koala o kiwi vienen de otros idiomas y conservan su K. En las palabras del español se usa ca, co, cu y que, qui.",
    },
    related: ["c", "q"],
  },
  {
    slug: "l",
    lower: "l",
    upper: "L",
    name: "ele",
    ipa: "[l]",
    kind: "consonante",
    nameSpoken: "ele",
    soundSpoken: "la, le, li, lo, lu. Como en león, luna.",
    sound: "La L suena [l], como en león y luna: la punta de la lengua toca arriba, detrás de los dientes, y el aire sale por los lados.",
    words: [w("León", "un león", "🦁"), w("Luna", "una luna", "🌙")],
    tip: "La L es de las primeras consonantes que se enseñan, junto con la m, la p y la s, porque su sonido se puede alargar. Con la, le, li, lo, lu ya se leen palabras como lulú, lila o loma.",
    faq: {
      question: "¿La LL es una letra?",
      answer: "Ya no: desde 2010, la ll y la ch son dígrafos, es decir, dos letras que juntas hacen un solo sonido. El abecedario tiene 27 letras. La ll se aprende en las sílabas: llave, lluvia, pollo.",
    },
    related: ["y", "r"],
  },
  {
    slug: "m",
    lower: "m",
    upper: "M",
    name: "eme",
    ipa: "[m]",
    kind: "consonante",
    nameSpoken: "eme",
    soundSpoken: "ma, me, mi, mo, mu. Como en manzana, mono.",
    sound: "La M suena [m], como en manzana y mono: los labios se cierran y el sonido sale por la nariz, «mmm», como cuando algo está rico.",
    words: [w("Manzana", "una manzana", "🍎"), w("Mono", "un mono", "🐒")],
    tip: "Muchas escuelas empiezan la lectura con la M: con ma, me, mi, mo, mu y las vocales, el niño ya puede leer mamá, mimo, memo o «mi mamá me mima». Es el primer gran logro del método silábico.",
    faq: {
      question: "¿Por qué se empieza a leer con la M?",
      answer: "Porque su sonido se puede alargar y es fácil de unir a una vocal: «mmm-a» da ma. Con una sola consonante y las cinco vocales ya salen palabras de verdad, y eso motiva mucho.",
    },
    related: ["n", "p"],
  },
  {
    slug: "n",
    lower: "n",
    upper: "N",
    name: "ene",
    ipa: "[n]",
    kind: "consonante",
    nameSpoken: "ene",
    soundSpoken: "na, ne, ni, no, nu. Como en nube, nariz.",
    sound: "La N suena [n], como en nube y nariz: la punta de la lengua toca arriba y el sonido sale por la nariz.",
    words: [w("Nube", "una nube", "☁️"), w("Nariz", "una nariz", "👃")],
    tip: "La N y la Ñ se parecen mucho. Muéstrale que la ñ es una n con «sombrerito» (la virgulilla) y que suena distinto: nene y niño empiezan igual, pero niño tiene ñ en medio.",
    faq: {
      question: "¿Cuál es la diferencia entre la N y la Ñ?",
      answer: "Son dos letras distintas. La n suena [n], como en nube; la ñ suena [ɲ], como en niño o araña: la lengua toca el paladar. Pronuncia «na» y luego «ña» para que tu hijo note la diferencia.",
    },
    related: ["enie", "m"],
  },
  {
    slug: "enie",
    lower: "ñ",
    upper: "Ñ",
    name: "eñe",
    ipa: "[ɲ]",
    kind: "consonante",
    nameSpoken: "eñe",
    soundSpoken: "ña, ñe, ñi, ño, ñu. Como en araña, niño.",
    sound: "La Ñ suena [ɲ], como en araña y niño: la lengua se apoya en el paladar y el sonido sale por la nariz. Es una letra que casi solo tiene el español.",
    words: [w("Araña", "una araña", "🕷️"), w("Niño", "un niño", "🧒")],
    tip: "Pocas palabras empiezan con ñ (ñandú, ñu), así que la buscamos dentro de las palabras: niño, araña, piña, muñeca, uña. En el teclado de la computadora y del celular la ñ tiene su propia tecla o se encuentra manteniendo pulsada la n.",
    faq: {
      question: "¿La Ñ es una letra o una N con tilde?",
      answer: "Es una letra propia, la decimoquinta del abecedario, entre la n y la o. La rayita de arriba se llama virgulilla. No es una tilde de acento: no indica dónde va la fuerza de la palabra.",
    },
    related: ["n", TILDE_SLUG],
  },
  {
    slug: "o",
    lower: "o",
    upper: "O",
    name: "o",
    ipa: "[o]",
    kind: "vocal",
    nameSpoken: "o",
    soundSpoken: "o. Como en oso, oveja.",
    sound: "La O suena [o], como al principio de oso y de oveja. Se dice con la boca redonda, como la forma de la letra.",
    words: [w("Oso", "un oso", "🐻"), w("Oveja", "una oveja", "🐑")],
    tip: "La O es fácil de reconocer: es redonda como la boca que la dice. Pídele a tu hijo que busque objetos redondos y diga «o» con la boca bien redonda.",
    faq: {
      question: "¿Por qué la O se traza en sentido contrario a las agujas del reloj?",
      answer: "Porque ese mismo movimiento sirve para la a, la d, la g y la q. Si el niño aprende a trazar la o empezando arriba y girando hacia la izquierda, después enlazará mejor las letras en cursiva.",
    },
    related: ["a", "u"],
  },
  {
    slug: "p",
    lower: "p",
    upper: "P",
    name: "pe",
    ipa: "[p]",
    kind: "consonante",
    nameSpoken: "pe",
    soundSpoken: "pa, pe, pi, po, pu. Como en pato, perro.",
    sound: "La P suena [p], como en pato y perro: los labios se cierran y se abren de golpe, soltando un poquito de aire.",
    words: [w("Pato", "un pato", "🦆"), w("Perro", "un perro", "🐶")],
    tip: "Con la m y la p ya se leen muchas palabras: papá, mamá, pepa, mapa, puma. Pongan una mano delante de la boca al decir «pa»: el niño sentirá el aire.",
    faq: {
      question: "¿Cuál es la diferencia entre la P y la B?",
      answer: "Las dos se dicen con los labios. Con la b la garganta vibra; con la p no. Di «pa» y luego «ba» con la mano del niño en tu garganta: así notará la diferencia.",
    },
    related: ["b", "m"],
  },
  {
    slug: "q",
    lower: "q",
    upper: "Q",
    name: "cu",
    ipa: "[k]",
    kind: "consonante",
    nameSpoken: "cu",
    soundSpoken: "que, qui. Como en queso, mosquito.",
    sound: "La Q suena [k] y siempre va con la u: que, qui. Esa u no suena: queso se lee «keso» y mosquito, «moskito».",
    words: [w("Queso", "un queso", "🧀"), w("Mosquito", "un mosquito", "🦟")],
    tip: "Una forma divertida de recordarlo: la q y la u son amigas inseparables, siempre van juntas, pero la u se queda calladita. Solo se usan con e y con i: que, qui.",
    faq: {
      question: "¿Por qué no se escribe «qa» ni «qo»?",
      answer: "Para el sonido [k] con a, o, u se usa la c: casa, cosa, cuna. La q solo se usa en que y qui, donde la c sonaría como [s] (cena, cine).",
    },
    related: ["c", "k", "u"],
  },
  {
    slug: "r",
    lower: "r",
    upper: "R",
    name: "erre",
    otherNames: ["ere"],
    ipa: "[r] / [ɾ]",
    kind: "consonante",
    nameSpoken: "erre",
    soundSpoken: "ra, re, ri, ro, ru. Como en ratón, rana.",
    sound: "La R tiene dos sonidos. Al principio de la palabra suena fuerte, vibrando, como en ratón y rana. Entre vocales suena suave, como en pera; para el sonido fuerte entre vocales se escribe rr: perro.",
    words: [w("Ratón", "un ratón", "🐭"), w("Rana", "una rana", "🐸")],
    wordsInside: [w("Pera", "una pera", "🍐"), w("Perro", "un perro", "🐶")],
    tip: "La r fuerte es de los últimos sonidos que los niños logran decir bien, a veces hasta los 5 o 6 años: es normal. Jueguen a imitar un motor, «rrrr», sin corregirle a cada momento.",
    faq: {
      question: "¿Cuándo se escribe R y cuándo RR?",
      answer: "Al principio de una palabra se escribe una sola r, aunque suene fuerte: ratón, rosa. Entre dos vocales, una r suena suave (pera, cara) y rr suena fuerte (perro, carro).",
    },
    related: ["l"],
  },
  {
    slug: "s",
    lower: "s",
    upper: "S",
    name: "ese",
    ipa: "[s]",
    kind: "consonante",
    nameSpoken: "ese",
    soundSpoken: "sa, se, si, so, su. Como en sol, serpiente.",
    sound: "La S suena [s], como en sol y serpiente: el aire sale silbando entre los dientes, «ssss», como una serpiente.",
    words: [w("Sol", "un sol", "☀️"), w("Serpiente", "una serpiente", "🐍")],
    tip: "En Latinoamérica la s, la z y la c de ce, ci suenan igual, así que sapo, zapato y cereza empiezan con el mismo sonido. Escribir la letra correcta se aprende con la práctica.",
    faq: {
      question: "¿Por qué sol se escribe con S y zapato con Z si suenan igual?",
      answer: "En Latinoamérica y en partes de España, la s, la z y la c (ce, ci) se pronuncian igual: es el seseo. La letra correcta depende de cada palabra. En gran parte de España, la z y la c de ce, ci se dicen con la lengua entre los dientes.",
    },
    related: ["z", "c"],
  },
  {
    slug: "t",
    lower: "t",
    upper: "T",
    name: "te",
    ipa: "[t]",
    kind: "consonante",
    nameSpoken: "te",
    soundSpoken: "ta, te, ti, to, tu. Como en tortuga, tren.",
    sound: "La T suena [t], como en tortuga y tren: la punta de la lengua toca los dientes de arriba y se suelta de golpe.",
    words: [w("Tortuga", "una tortuga", "🐢"), w("Tren", "un tren", "🚂")],
    tip: "Con la t se leen pronto palabras como tomate, pato, moto o tapa. Tren tiene una sílaba trabada, tr: la t y la r se dicen juntas, sin vocal entre ellas.",
    faq: {
      question: "¿Cuál es la diferencia entre la T y la D?",
      answer: "Se dicen en el mismo lugar, pero con la d la garganta vibra y con la t no. Di «ta» y luego «da» con la mano del niño en tu garganta.",
    },
    related: ["d"],
  },
  {
    slug: "u",
    lower: "u",
    upper: "U",
    name: "u",
    ipa: "[u]",
    kind: "vocal",
    nameSpoken: "u",
    soundSpoken: "u. Como en uva, unicornio.",
    sound: "La U suena [u], como al principio de uva y de unicornio. Se dice con los labios redondos y hacia adelante, como para dar un beso.",
    words: [w("Uva", "una uva", "🍇"), w("Unicornio", "un unicornio", "🦄")],
    tip: "La u a veces no suena: en que, qui (queso) y en gue, gui (guitarra). Si suena en gue, gui, lleva diéresis: pingüino. Al principio, basta con que el niño la reconozca y la diga.",
    faq: {
      question: "¿Por qué la U no suena en «queso»?",
      answer: "En que, qui y gue, gui, la u solo indica cómo se lee la consonante: queso se lee «keso», guitarra se lee «gitarra» con g de gato. Cuando la u debe sonar en güe, güi, se le ponen dos puntos (diéresis): pingüino.",
    },
    related: ["o", "q", TILDE_SLUG],
  },
  {
    slug: "v",
    lower: "v",
    upper: "V",
    name: "uve",
    otherNames: ["ve", "ve corta", "ve chica", "ve baja"],
    ipa: "[b]",
    kind: "consonante",
    nameSpoken: "uve",
    soundSpoken: "va, ve, vi, vo, vu. Como en vaca, volcán.",
    sound: "La V suena exactamente como la B, [b], como en vaca y volcán. En español no hay diferencia de sonido entre las dos letras.",
    words: [w("Vaca", "una vaca", "🐄"), w("Volcán", "un volcán", "🌋")],
    tip: "En muchos países de Latinoamérica los niños aprenden a llamarla «ve chica» o «ve corta» (y a la b, «be grande» o «be larga»). La Real Academia recomienda «uve». Cualquiera de esos nombres está bien: lo importante es que la reconozca.",
    faq: {
      question: "¿Se dice «uve» o «ve»?",
      answer: "Las dos formas son correctas. La RAE recomienda «uve» para todos los países, pero en gran parte de Latinoamérica se dice «ve», «ve chica» o «ve corta». En la escuela de tu hijo quizá usen uno de estos nombres.",
    },
    related: ["b", "w"],
  },
  {
    slug: "w",
    lower: "w",
    upper: "W",
    name: "uve doble",
    otherNames: ["doble ve", "doble u", "ve doble"],
    ipa: "[w] / [u]",
    kind: "consonante",
    nameSpoken: "uve doble",
    soundSpoken: "wa, we, wi. Como en kiwi, sándwich.",
    sound: "La W casi solo aparece en palabras que vienen de otros idiomas, como kiwi o sándwich. Suele sonar como una u rápida, «ui»; en algunas palabras alemanas suena como b.",
    words: [w("Kiwi", "un kiwi", "🥝"), w("Sándwich", "un sándwich", "🥪")],
    tip: "La W es la letra con más nombres: uve doble (como recomienda la RAE), doble ve, doble u o ve doble, según el país. Usa el que conozca tu hijo en la escuela.",
    faq: {
      question: "¿Cómo se llama la W: doble u, doble ve o uve doble?",
      answer: "Los tres nombres se usan. La RAE recomienda «uve doble»; en México y otros países se dice mucho «doble u», y en otros, «doble ve». Todos son correctos.",
    },
    related: ["v", "u"],
  },
  {
    slug: "x",
    lower: "x",
    upper: "X",
    name: "equis",
    ipa: "[ks] / [s] / [x]",
    kind: "consonante",
    nameSpoken: "equis",
    soundSpoken: "xa, xe, xi, xo, xu. Como en taxi, xilófono.",
    sound: "La X suena casi siempre [ks], como en taxi y examen. Al principio de una palabra suena [s], como en xilófono. Y en algunos nombres de México suena como la jota: México, Oaxaca.",
    words: [w("Taxi", "un taxi", "🚕"), w("Xilófono", "un xilófono", "🎵")],
    tip: "La X es la letra más cambiante. No hace falta explicar todos sus sonidos de golpe: empiecen con taxi y examen, y dejen México para una conversación sobre los nombres de lugares.",
    faq: {
      question: "¿Por qué México se escribe con X si suena como J?",
      answer: "Es una forma antigua de escribir el sonido de la jota que se conservó en algunos nombres, como México, Oaxaca o Texas. La RAE acepta también «Méjico», pero en México y en casi todo el mundo se escribe con X.",
    },
    related: ["s", "j"],
  },
  {
    slug: "y",
    lower: "y",
    upper: "Y",
    name: "ye",
    otherNames: ["i griega"],
    ipa: "[ʝ] / [i]",
    kind: "consonante",
    nameSpoken: "ye",
    soundSpoken: "ya, ye, yi, yo, yu. Como en yoyó, yate.",
    sound: "Al principio de una sílaba, la Y suena como la ll, como en yoyó y yate. Sola o al final de una palabra suena como la i: y, rey, muy.",
    words: [w("Yoyó", "un yoyó", "🪀"), w("Yate", "un yate", "🛥️")],
    wordsInside: [w("Rey", "un rey", "👑")],
    tip: "La RAE recomienda llamarla «ye», pero en muchas familias y escuelas se sigue diciendo «i griega». Los dos nombres están bien. En casi todos los países, yoyó y llave empiezan con el mismo sonido.",
    faq: {
      question: "¿La Y y la LL suenan igual?",
      answer: "En casi todo el mundo hispanohablante, sí: es el yeísmo. Yate y llave empiezan con el mismo sonido, que varía un poco según el país (en Argentina y Uruguay se parece a «sh»).",
    },
    related: ["i", "l"],
  },
  {
    slug: "z",
    lower: "z",
    upper: "Z",
    name: "zeta",
    ipa: "[s] / [θ]",
    kind: "consonante",
    nameSpoken: "zeta",
    soundSpoken: "za, zo, zu. Como en zapato, zorro.",
    sound: "En Latinoamérica la Z suena [s], igual que la s, como en zapato y zorro. En gran parte de España se dice con la lengua entre los dientes, [θ].",
    words: [w("Zapato", "un zapato", "👞"), w("Zorro", "un zorro", "🦊")],
    tip: "La z casi siempre va con a, o, u: za, zo, zu. Con e y con i se usa la c: cereza, cine. Por eso decimos un lápiz, pero dos lápices.",
    faq: {
      question: "¿Por qué lápiz cambia a lápices?",
      answer: "Porque la z se usa con a, o, u y la c con e, i. Al agregar -es, la z se convierte en c: luz, luces; pez, peces. El sonido no cambia.",
    },
    related: ["s", "c"],
  },
];

const bySlug = new Map(spanishLetters.map((l) => [l.slug, l]));

/** A Spanish letter by its URL param; "A" works like "a" (as in English and French). */
export function getSpanishLetter(param: string): SpanishLetter | undefined {
  return bySlug.get(param) ?? (param.length === 1 ? bySlug.get(param.toLowerCase()) : undefined);
}

/** Params for /es/abecedario/[letter] and its ficha: every letter, "A" as well as "a" ("enie" only in lowercase). */
export function spanishLetterParams(): string[] {
  return spanishLetters.flatMap((l) => (l.slug.length > 1 ? [l.slug] : [l.slug, l.upper]));
}

/** Previous/next letter, in the order a…n, ñ, o…z (wrapping around). */
export function spanishNeighbors(slug: string): { prev: SpanishLetter; next: SpanishLetter } {
  const i = spanishLetters.findIndex((l) => l.slug === slug);
  const n = spanishLetters.length;
  return { prev: spanishLetters[(i - 1 + n) % n], next: spanishLetters[(i + 1) % n] };
}

const strip = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

/** "A de avión" when the word starts with the letter, else "Ñ, como en araña". */
export function letterWithWord(l: SpanishLetter, word: SpanishWord): string {
  const starts = l.lower === "ñ" ? word.word.toLowerCase().startsWith("ñ") : strip(word.word).startsWith(l.lower);
  return starts ? `${l.upper} de ${word.word.toLowerCase()}` : `${l.upper}, como en ${word.word.toLowerCase()}`;
}

// The tilde page (/es/abecedario/tilde): accents don't create new letters in
// Spanish and don't change a vowel's sound, so they share one page. The
// examples are said aloud by the page.
export type TildeExample = { text: string; emoji: string };
export type TildeGroup = {
  id: string;
  title: string;
  marks: string;
  explanation: string;
  examples: TildeExample[];
};

export const tildeGroups: TildeGroup[] = [
  {
    id: "tilde",
    title: "La tilde: dónde va la fuerza",
    marks: "á é í ó ú",
    explanation: "La rayita sobre una vocal se llama tilde. No cambia el sonido de la vocal: indica la sílaba que se dice con más fuerza. Sin tilde, «mamá» se leería «mama», con la fuerza en la primera sílaba.",
    examples: [
      { text: "mamá", emoji: "👩" },
      { text: "café", emoji: "☕" },
      { text: "maíz", emoji: "🌽" },
      { text: "avión", emoji: "✈️" },
      { text: "menú", emoji: "📋" },
    ],
  },
  {
    id: "diacritica",
    title: "La tilde que distingue palabras",
    marks: "tú · tu",
    explanation: "Algunas palabras cortas se escriben con o sin tilde según lo que significan: «tú» (la persona) y «tu» (lo que es tuyo), «él» y «el», «sí» y «si». Se aprenden con la práctica, más adelante.",
    examples: [
      { text: "Tú tienes tu pelota.", emoji: "⚽" },
      { text: "Sí, quiero.", emoji: "👍" },
    ],
  },
  {
    id: "dieresis",
    title: "La diéresis: la u que sí suena",
    marks: "ü",
    explanation: "En gue y gui la u no suena (guitarra). Cuando sí tiene que sonar, se le ponen dos puntitos encima, la diéresis: pingüino, agüita.",
    examples: [
      { text: "un pingüino", emoji: "🐧" },
      { text: "una agüita", emoji: "💧" },
    ],
  },
];
