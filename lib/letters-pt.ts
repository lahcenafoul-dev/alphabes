// Portuguese alphabet content: the 26 letters plus Ç, written for Brazilian
// families (docs/portuguese-plan.md, P1, P5): Brazilian letter names,
// Brazilian pronunciation (the "dji" and "tchi" of di and ti, the l that
// sounds like u at the end of a syllable, the final e and o heard as i and u)
// and example words children know. Ç is not a letter of the alphabet but is
// taught with it, so it gets a page right after C. The English, French and
// Spanish letters live in letters-data.ts, letters-fr.ts and letters-es.ts;
// the alphabets are separate on purpose.
//
// Pure data with no imports, so middleware, pages and tests can all use it.

export type PortugueseWord = {
  word: string;
  /** With its article, as a child would say it ("um avião"). */
  withArticle: string;
  emoji: string;
};

export type PortugueseLetter = {
  /** URL param: "a", or "c-cedilha" for ç. */
  slug: string;
  lower: string;
  upper: string;
  /** The letter's name as Brazilian schools say it ("bê", "dáblio"). */
  name: string;
  /** Other names children may hear ("i grego", "vê duplo"). */
  otherNames?: string[];
  /** Main sound(s) in IPA, shown to parents. */
  ipa: string;
  kind: "vogal" | "consoante";
  /** What the speech engine says for the letter's name. */
  nameSpoken: string;
  /**
   * What the speech engine says for the sound. A consonant can't be said
   * alone, so it's heard in its family (ba, be, bi, bo, bu), as Brazilian
   * schools teach it.
   */
  soundSpoken: string;
  /** The sound, explained for parents (also the answer to the first FAQ). */
  sound: string;
  /** Example words. For ç, w and x the letter is inside the word. */
  words: PortugueseWord[];
  /** More words where the letter's sound is heard inside the word. */
  wordsInside?: PortugueseWord[];
  /** "Para a família" note for parents. */
  tip: string;
  faq: { question: string; answer: string };
  /** Letters (slugs) linked from this letter's page; "acentos" is the accents page. */
  related?: string[];
};

export const ACENTOS_SLUG = "acentos";
export const CEDILHA_SLUG = "c-cedilha";

const w = (word: string, withArticle: string, emoji: string): PortugueseWord => ({ word, withArticle, emoji });

export const portugueseLetters: PortugueseLetter[] = [
  {
    slug: "a",
    lower: "a",
    upper: "A",
    name: "a",
    ipa: "[a]",
    kind: "vogal",
    nameSpoken: "a",
    soundSpoken: "a. Como em abelha, avião.",
    sound: "A letra A soa [a], como no começo de abelha e de avião. É uma vogal: sai com a boca bem aberta. Com o til, ã, o som passa pelo nariz, como em maçã e mãe.",
    words: [w("Abelha", "uma abelha", "🐝"), w("Avião", "um avião", "✈️")],
    tip: "O A costuma ser a primeira letra que a criança reconhece, porque abre o alfabeto e aparece em muitos nomes. Procurem juntos o A nas embalagens, nas placas e nas capas dos livros.",
    faq: {
      question: "Com que idade a criança reconhece a letra A?",
      answer: "Entre 3 e 5 anos, na educação infantil, muitas crianças já reconhecem o A, principalmente se ele está no nome delas. Ligar a letra ao som e ler sílabas como ba, ma e pa vem por volta dos 5 ou 6 anos, no fim da pré-escola e no 1º ano.",
    },
    related: ["e", "o", ACENTOS_SLUG],
  },
  {
    slug: "b",
    lower: "b",
    upper: "B",
    name: "bê",
    ipa: "[b]",
    kind: "consoante",
    nameSpoken: "bê",
    soundSpoken: "ba, be, bi, bo, bu. Como em bola, baleia.",
    sound: "A letra B soa [b]: os lábios se juntam e se abrem, como em bola e baleia. Ela quase sempre vem com uma vogal, e assim nasce a família do B: ba, be, bi, bo, bu.",
    words: [w("Bola", "uma bola", "⚽"), w("Baleia", "uma baleia", "🐳")],
    tip: "As crianças pequenas trocam muito o b e o d na escrita: é normal até uns 7 anos. Ao traçar o b, comece pelo “pauzinho” e depois faça a “barriguinha”; o d começa pela barriguinha.",
    faq: {
      question: "Qual é a diferença entre o B e o P?",
      answer: "Os dois se fazem com os lábios fechados, mas no B a garganta vibra e no P não. Coloque a mão da criança na sua garganta enquanto você diz “ba” e depois “pa”: ela vai sentir a diferença.",
    },
    related: ["p", "d", "v"],
  },
  {
    slug: "c",
    lower: "c",
    upper: "C",
    name: "cê",
    ipa: "[k] / [s]",
    kind: "consoante",
    nameSpoken: "cê",
    soundSpoken: "ca, co, cu. Como em casa. ce, ci. Como em cebola.",
    sound: "A letra C tem dois sons. Com a, o e u ela soa [k], como em casa (ca, co, cu). Com e e i ela soa [s], como em cebola (ce, ci). Para ter o som [s] antes de a, o e u, usa-se o Ç: maçã, poço, açúcar.",
    words: [w("Casa", "uma casa", "🏠"), w("Cebola", "uma cebola", "🧅")],
    tip: "Não precisa explicar tudo de uma vez. Comecem com ca, co, cu (casa, cola, cubo) e, quando a criança estiver segura, apresentem ce e ci como a “surpresa” do C. Para o som [k] com e e i, escreve-se qu: queijo, quilo.",
    faq: {
      question: "Quando o C tem som de K e quando tem som de S?",
      answer: "Antes de a, o e u, o C soa [k]: casa, cola, cubo. Antes de e e i, soa [s]: cebola, cinema. Por isso, para o som [k] antes de e e i usamos qu (queijo, quilo), e para o som [s] antes de a, o e u usamos ç (maçã, açúcar).",
    },
    related: [CEDILHA_SLUG, "k", "q", "s"],
  },
  {
    slug: CEDILHA_SLUG,
    lower: "ç",
    upper: "Ç",
    name: "cê-cedilha",
    ipa: "[s]",
    kind: "consoante",
    nameSpoken: "cê cedilha",
    soundSpoken: "ça, ço, çu. Como em maçã, palhaço.",
    sound: "O Ç é o C com uma “cobrinha” embaixo, a cedilha. Ele soa sempre [s] e só aparece antes de a, o e u: ça, ço, çu, como em maçã e palhaço. Antes de e e i ele não é usado, porque ali o C já soa [s] sozinho (cebola, cinema).",
    words: [w("Maçã", "uma maçã", "🍎"), w("Palhaço", "um palhaço", "🤡")],
    wordsInside: [w("Coração", "um coração", "❤️"), w("Taça", "uma taça", "🏆")],
    tip: "O Ç não é uma letra nova: é o C com cedilha, e por isso não entra na conta das 26 letras do alfabeto. Nenhuma palavra em português começa com Ç. Ao escrever, a criança vai aprender que ce e ci nunca levam cedilha.",
    faq: {
      question: "Por que nenhuma palavra começa com Ç?",
      answer: "Porque o Ç só aparece antes de a, o e u, e no começo das palavras o som [s] se escreve com S (sapo, sol, suco). O Ç fica sempre no meio das palavras: maçã, poço, açúcar.",
    },
    related: ["c", "s"],
  },
  {
    slug: "d",
    lower: "d",
    upper: "D",
    name: "dê",
    ipa: "[d] / [dʒ]",
    kind: "consoante",
    nameSpoken: "dê",
    soundSpoken: "da, de, di, do, du. Como em dado, dente.",
    sound: "A letra D soa [d], como em dado: a ponta da língua toca atrás dos dentes de cima. Em grande parte do Brasil, antes do som de i (di, e o de no fim das palavras) ela soa “dji”, como em dia e em dente. A escrita não muda: é sempre d.",
    words: [w("Dado", "um dado", "🎲"), w("Dente", "um dente", "🦷")],
    tip: "Se a criança escrever “djia” para dia, é porque ela escreve o que ouve: explique com calma que o som “dji” se escreve com di. O mesmo acontece com o T (tia soa “tchia”).",
    faq: {
      question: "Por que o D às vezes soa “dji”?",
      answer: "Na maior parte do Brasil, o d antes do som de i é pronunciado “dji”: dia, cidade, tarde. Em Portugal e em algumas regiões do Brasil ele continua [d]. É só uma diferença de sotaque: a palavra se escreve sempre do mesmo jeito.",
    },
    related: ["t", "b"],
  },
  {
    slug: "e",
    lower: "e",
    upper: "E",
    name: "é",
    otherNames: ["ê"],
    ipa: "[e] / [ɛ]",
    kind: "vogal",
    nameSpoken: "é",
    soundSpoken: "é, ê. Como em elefante, estrela.",
    sound: "A letra E tem dois sons: aberto, [ɛ], como em café e em pé, e fechado, [e], como em você e em elefante. No fim das palavras, quase sempre soa como i: dente se diz “denti”.",
    words: [w("Elefante", "um elefante", "🐘"), w("Estrela", "uma estrela", "⭐")],
    tip: "As vogais (a, e, i, o, u) são a base da leitura: com elas se formam todas as sílabas. O acento ajuda a saber o som do E: é aberto em café, ê fechado em você.",
    faq: {
      question: "Por que o E no fim da palavra soa como I?",
      answer: "No português do Brasil, o e sem acento no fim da palavra costuma ser pronunciado como i: leite (“leiti”), dente (“denti”). Na escrita continua sendo e. Ao ditar palavras, vale lembrar a criança disso.",
    },
    related: ["a", "i", ACENTOS_SLUG],
  },
  {
    slug: "f",
    lower: "f",
    upper: "F",
    name: "efe",
    ipa: "[f]",
    kind: "consoante",
    nameSpoken: "efe",
    soundSpoken: "fa, fe, fi, fo, fu. Como em foca, flor.",
    sound: "A letra F soa [f]: os dentes de cima encostam no lábio de baixo e o ar sai, como em foca e flor.",
    words: [w("Foca", "uma foca", "🦭"), w("Flor", "uma flor", "🌸")],
    tip: "O F e o V se fazem do mesmo jeito; a diferença é que no V a garganta vibra. Brinquem de “soprar” o F (fffff) e de “zumbir” o V (vvvvv).",
    faq: {
      question: "Qual é a diferença entre o F e o V?",
      answer: "Os dois sons se fazem com os dentes de cima no lábio de baixo. No F só sai ar; no V a voz também sai e a garganta vibra. Por isso faca e vaca são palavras diferentes.",
    },
    related: ["v"],
  },
  {
    slug: "g",
    lower: "g",
    upper: "G",
    name: "gê",
    ipa: "[g] / [ʒ]",
    kind: "consoante",
    nameSpoken: "gê",
    soundSpoken: "ga, go, gu. Como em gato. ge, gi. Como em girafa.",
    sound: "A letra G tem dois sons. Com a, o e u ela soa [g], como em gato (ga, go, gu). Com e e i ela soa como o J, [ʒ], como em girafa (ge, gi). Para ter o som [g] antes de e e i, escreve-se gu: guerra, guitarra.",
    words: [w("Gato", "um gato", "🐱"), w("Girafa", "uma girafa", "🦒")],
    tip: "Comecem com ga, go, gu (gato, galo, gota) e só depois apresentem ge e gi, que soam como j (gelo, girafa). O gu de guerra e guitarra, em que o u não soa, vem por último.",
    faq: {
      question: "Quando o G soa como J?",
      answer: "Antes de e e de i: gelo, gente, girafa, gibi. Antes de a, o e u, ele soa [g]: gato, gola, guloso. Para o som [g] antes de e e i, usa-se gu (guerra, guitarra), e o u não é pronunciado.",
    },
    related: ["j", "q"],
  },
  {
    slug: "h",
    lower: "h",
    upper: "H",
    name: "agá",
    ipa: "(sem som)",
    kind: "consoante",
    nameSpoken: "agá",
    soundSpoken: "O H no começo da palavra não tem som. Hora. Hipopótamo.",
    sound: "No começo das palavras, o H não tem som: helicóptero se lê “elicóptero”. Mesmo assim ele é importante, porque junto com outras letras forma os dígrafos ch (chave), lh (palhaço) e nh (ninho), que têm sons próprios.",
    words: [w("Helicóptero", "um helicóptero", "🚁"), w("Hipopótamo", "um hipopótamo", "🦛")],
    tip: "Como o H não tem som no começo da palavra, a criança só aprende onde ele vai vendo muitas vezes as palavras escritas: hora, hoje, homem. Mais importante é perceber o H nos dígrafos ch, lh e nh, que ela vai encontrar o tempo todo.",
    faq: {
      question: "Para que serve o H se ele não tem som?",
      answer: "No começo das palavras, o H vem da origem delas (do latim) e continua na escrita: hoje, hora, hotel. No meio das palavras, ele forma com c, l e n os dígrafos ch, lh e nh, que representam sons que nenhuma letra sozinha representa: chuva, filho, banho.",
    },
    related: ["c", "l", "n"],
  },
  {
    slug: "i",
    lower: "i",
    upper: "I",
    name: "i",
    ipa: "[i]",
    kind: "vogal",
    nameSpoken: "i",
    soundSpoken: "i. Como em iguana, ilha.",
    sound: "A letra I soa [i], como no começo de iguana e de ilha. É uma vogal e quase sempre soa igual. Com outra vogal ela forma encontros como ai, ei e oi: pai, rei, boi.",
    words: [w("Iguana", "uma iguana", "🦎"), w("Ilha", "uma ilha", "🏝️")],
    tip: "O i minúsculo tem um pingo, e as crianças adoram lembrar disso. Ao traçar, primeiro o pauzinho, depois o pingo. Para brincar com o som, digam juntos palavras que terminam em i: saci, abacaxi, caqui.",
    faq: {
      question: "Quando o I tem acento?",
      answer: "O í com acento agudo marca a sílaba mais forte quando a regra pede, como em saída e país. O som é o mesmo, [i]; o acento só mostra onde está a força da palavra.",
    },
    related: ["e", "u", ACENTOS_SLUG],
  },
  {
    slug: "j",
    lower: "j",
    upper: "J",
    name: "jota",
    ipa: "[ʒ]",
    kind: "consoante",
    nameSpoken: "jota",
    soundSpoken: "ja, je, ji, jo, ju. Como em jacaré, janela.",
    sound: "A letra J soa [ʒ], como em jacaré e janela. É o mesmo som do G em ge e gi: gelo, girafa.",
    words: [w("Jacaré", "um jacaré", "🐊"), w("Janela", "uma janela", "🪟")],
    tip: "Como o J e o G de ge e gi soam igual, a criança só descobre qual usar vendo as palavras escritas: jeito e gente, jiboia e girafa. No começo, basta ler ja, je, ji, jo, ju.",
    faq: {
      question: "O J e o G soam igual?",
      answer: "Sim, antes de e e i: jeito e gente começam com o mesmo som. Antes de a, o e u, só o J tem esse som (janela, jogo, jujuba), porque ali o G soa [g] (gato, gola).",
    },
    related: ["g"],
  },
  {
    slug: "k",
    lower: "k",
    upper: "K",
    name: "cá",
    otherNames: ["capa"],
    ipa: "[k]",
    kind: "consoante",
    nameSpoken: "cá",
    soundSpoken: "ca. Como em kiwi, karaokê.",
    sound: "A letra K soa [k], como o C de casa. Ela aparece em palavras de outras línguas e em nomes: kiwi, karaokê, ketchup, Kátia.",
    words: [w("Kiwi", "um kiwi", "🥝"), w("Karaokê", "um karaokê", "🎤")],
    tip: "O K é raro: a criança vai encontrá-lo sobretudo em nomes (Kauã, Kátia), em marcas e em palavras como kiwi. Não é preciso treinar sílabas com K; basta reconhecer a letra.",
    faq: {
      question: "Por que o K está no alfabeto?",
      answer: "Com o Acordo Ortográfico, que passou a valer no Brasil em 2009, o K, o W e o Y voltaram a fazer parte do alfabeto, que ficou com 26 letras. Eles são usados em nomes próprios, em símbolos (km, kg) e em palavras de outras línguas.",
    },
    related: ["c", "q", "w", "y"],
  },
  {
    slug: "l",
    lower: "l",
    upper: "L",
    name: "ele",
    ipa: "[l] / [w]",
    kind: "consoante",
    nameSpoken: "ele",
    soundSpoken: "la, le, li, lo, lu. Como em leão, lua.",
    sound: "A letra L soa [l], como em leão e lua: a ponta da língua toca o céu da boca, atrás dos dentes. No fim da sílaba, no Brasil, ela soa como u: sal, papel e anel se dizem “sau”, “papeu” e “aneu”.",
    words: [w("Leão", "um leão", "🦁"), w("Lua", "a lua", "🌙")],
    tip: "Como o L no fim da sílaba soa como u, é comum a criança escrever “papeu” em vez de papel ou “sau” em vez de sal. É uma troca normal no começo, que diminui com a leitura.",
    faq: {
      question: "Por que o L no fim da palavra soa como U?",
      answer: "No português do Brasil, o l no fim da sílaba é pronunciado [w], como um u: Brasil, sol, calça. Em Portugal e em algumas regiões do Sul ele ainda soa [l]. A escrita é sempre com l, por isso a criança precisa aprender essas palavras vendo-as escritas.",
    },
    related: ["r", "u"],
  },
  {
    slug: "m",
    lower: "m",
    upper: "M",
    name: "eme",
    ipa: "[m]",
    kind: "consoante",
    nameSpoken: "eme",
    soundSpoken: "ma, me, mi, mo, mu. Como em macaco, mala.",
    sound: "A letra M soa [m]: os lábios se fecham e o som sai pelo nariz, como em macaco e mala. No fim da sílaba ela não soa sozinha: deixa a vogal de antes nasal, como em campo e bombom.",
    words: [w("Macaco", "um macaco", "🐒"), w("Mala", "uma mala", "🧳")],
    tip: "A família do M (ma, me, mi, mo, mu) costuma ser a primeira família silábica ensinada, porque o som do M é fácil de prolongar (mmmm) e com ele a criança logo lê palavras como mala, mola e Mimi.",
    faq: {
      question: "Quando se usa M antes de P e B?",
      answer: "Antes de p e b, sempre se escreve m, nunca n: campo, tempo, bombom, samba. Antes das outras consoantes, usa-se n: canto, ponte, mundo.",
    },
    related: ["n", "p", "b"],
  },
  {
    slug: "n",
    lower: "n",
    upper: "N",
    name: "ene",
    ipa: "[n]",
    kind: "consoante",
    nameSpoken: "ene",
    soundSpoken: "na, ne, ni, no, nu. Como em navio, nuvem.",
    sound: "A letra N soa [n], como em navio e nuvem: a ponta da língua toca atrás dos dentes de cima e o som sai pelo nariz. No fim da sílaba, ela deixa a vogal nasal, como em canto e ponte, e com o H forma o nh de ninho.",
    words: [w("Navio", "um navio", "🚢"), w("Nuvem", "uma nuvem", "☁️")],
    tip: "Aproveite para mostrar o nh: ninho, galinha, banho. A criança percebe que o h muda o som do n.",
    faq: {
      question: "O que é o NH?",
      answer: "É um dígrafo: duas letras com um só som, [ɲ], como em ninho, banho e galinha. É o mesmo som do ñ do espanhol.",
    },
    related: ["m", "h"],
  },
  {
    slug: "o",
    lower: "o",
    upper: "O",
    name: "ó",
    otherNames: ["ô"],
    ipa: "[o] / [ɔ]",
    kind: "vogal",
    nameSpoken: "ó",
    soundSpoken: "ó, ô. Como em ovo, ovelha.",
    sound: "A letra O tem dois sons: aberto, [ɔ], como em avó e bola, e fechado, [o], como em avô e ovo. No fim das palavras, quase sempre soa como u: gato se diz “gatu”.",
    words: [w("Ovo", "um ovo", "🥚"), w("Ovelha", "uma ovelha", "🐑")],
    tip: "Brinquem com o par avó e avô: só o acento muda, e com ele o som do O. O acento agudo (ó) mostra o som aberto, e o circunflexo (ô), o fechado.",
    faq: {
      question: "Por que o O no fim da palavra soa como U?",
      answer: "No português do Brasil, o o sem acento no fim da palavra é pronunciado como u: gato, livro, sapato. Na escrita continua sendo o, e essa é uma das primeiras coisas que a criança precisa lembrar ao escrever.",
    },
    related: ["a", "u", ACENTOS_SLUG],
  },
  {
    slug: "p",
    lower: "p",
    upper: "P",
    name: "pê",
    ipa: "[p]",
    kind: "consoante",
    nameSpoken: "pê",
    soundSpoken: "pa, pe, pi, po, pu. Como em pato, peixe.",
    sound: "A letra P soa [p]: os lábios se fecham e se abrem com um sopro, como em pato e peixe.",
    words: [w("Pato", "um pato", "🦆"), w("Peixe", "um peixe", "🐟")],
    tip: "Segure um papelzinho na frente da boca da criança: ao dizer “pa”, ele se mexe; ao dizer “ba”, quase nada. É um jeito divertido de sentir a diferença entre o P e o B.",
    faq: {
      question: "Por que a criança troca o P e o B ao escrever?",
      answer: "Os dois sons se fazem no mesmo lugar; só a vibração da garganta muda. Trocas como “bato” por pato são comuns no começo da alfabetização e diminuem com a leitura em voz alta e com a prática das famílias do P e do B.",
    },
    related: ["b", "t"],
  },
  {
    slug: "q",
    lower: "q",
    upper: "Q",
    name: "quê",
    ipa: "[k]",
    kind: "consoante",
    nameSpoken: "quê",
    soundSpoken: "qua, que, qui, quo. Como em queijo, quatro.",
    sound: "A letra Q vem sempre com o u. Em que e qui o u não soa: queijo e quilo se dizem “keijo” e “kilo”. Em qua e quo o u soa: quatro, quando.",
    words: [w("Queijo", "um queijo", "🧀"), w("Quatro", "o número quatro", "4️⃣")],
    tip: "Apresente o Q junto com o u, como uma dupla inseparável: qu. Depois mostre que em queijo e quilo o u fica “quietinho”, e em quatro e quadrado ele aparece.",
    faq: {
      question: "Por que o Q sempre vem com U?",
      answer: "Em português, o q só aparece no grupo qu. Antes de e e i, qu tem o som [k] (queijo, quilo), porque ce e ci soam [s]. Antes de a e o, o u também é pronunciado: quatro, quando.",
    },
    related: ["c", "k", "g"],
  },
  {
    slug: "r",
    lower: "r",
    upper: "R",
    name: "erre",
    ipa: "[ʁ] / [ɾ]",
    kind: "consoante",
    nameSpoken: "erre",
    soundSpoken: "ra, re, ri, ro, ru. Como em rato, relógio.",
    sound: "A letra R tem dois sons. No começo da palavra e no rr, o som é forte, como em rato e carro (em muitas regiões do Brasil ele parece um h soprado). Entre vogais, o som é fraco, batido, como em caro e barata.",
    words: [w("Rato", "um rato", "🐭"), w("Relógio", "um relógio", "⌚")],
    wordsInside: [w("Carro", "um carro", "🚗"), w("Pera", "uma pera", "🍐")],
    tip: "Comparem caro e carro, ou muro e murro: com um r o som é fraco, com dois é forte. Esses pares ajudam a criança a entender por que às vezes se escreve rr.",
    faq: {
      question: "Quando se escreve RR?",
      answer: "O rr só aparece entre duas vogais, quando o som é forte: carro, terra, burro. No começo da palavra o r já é forte sozinho (rato, rua) e nunca se dobra. Depois de n, l ou s também basta um r: honra.",
    },
    related: ["l", "s"],
  },
  {
    slug: "s",
    lower: "s",
    upper: "S",
    name: "esse",
    ipa: "[s] / [z]",
    kind: "consoante",
    nameSpoken: "esse",
    soundSpoken: "sa, se, si, so, su. Como em sapo, sol.",
    sound: "A letra S soa [s] no começo das palavras, como em sapo e sol. Entre duas vogais, ela soa [z]: casa, mesa, rosa. Para ter o som [s] entre vogais, escreve-se ss: pássaro, osso.",
    words: [w("Sapo", "um sapo", "🐸"), w("Sol", "o sol", "☀️")],
    wordsInside: [w("Rosa", "uma rosa", "🌹"), w("Pássaro", "um pássaro", "🐦")],
    tip: "Mostre os dois sons do S na mesma conversa: sapo (som de s) e rosa (som de z). Depois apresente o ss como o jeito de manter o som de s entre vogais: osso, pássaro, assado.",
    faq: {
      question: "Por que o S às vezes tem som de Z?",
      answer: "Entre duas vogais, o s é pronunciado [z]: casa, mesa, camisa. Por isso, para o som [s] entre vogais se usa ss (pássaro, osso), ç (moço) ou c antes de e e i (vacina).",
    },
    related: ["z", CEDILHA_SLUG, "x"],
  },
  {
    slug: "t",
    lower: "t",
    upper: "T",
    name: "tê",
    ipa: "[t] / [tʃ]",
    kind: "consoante",
    nameSpoken: "tê",
    soundSpoken: "ta, te, ti, to, tu. Como em tartaruga, tomate.",
    sound: "A letra T soa [t], como em tartaruga e tomate: a ponta da língua toca atrás dos dentes de cima. Em grande parte do Brasil, antes do som de i ela soa “tchi”, como em tia e em leite. A escrita não muda.",
    words: [w("Tartaruga", "uma tartaruga", "🐢"), w("Tomate", "um tomate", "🍅")],
    tip: "Se a criança escrever “tchia” para tia, ela está escrevendo o que ouve. Explique que o som “tchi” se escreve ti ou te: tia, tigre, leite.",
    faq: {
      question: "Qual é a diferença entre o T e o D?",
      answer: "Os dois sons se fazem no mesmo lugar, mas com o D a garganta vibra e com o T não. Coloque a mão da criança na sua garganta enquanto diz “da” e depois “ta”: ela vai sentir.",
    },
    related: ["d", "p"],
  },
  {
    slug: "u",
    lower: "u",
    upper: "U",
    name: "u",
    ipa: "[u]",
    kind: "vogal",
    nameSpoken: "u",
    soundSpoken: "u. Como em uva, urso.",
    sound: "A letra U soa [u], como no começo de uva e de urso. É uma vogal e quase sempre soa igual. Em que, qui, gue e gui ela fica muda: queijo, guitarra.",
    words: [w("Uva", "uma uva", "🍇"), w("Urso", "um urso", "🐻")],
    tip: "Brinquem de “fazer bico” para dizer u. Muitas crianças escrevem u no lugar do o ou do l no fim das palavras (“gatu”, “sau”), porque é o som que ouvem: é uma fase normal.",
    faq: {
      question: "Quando o U não soa?",
      answer: "Em que, qui, gue e gui, o u serve só para mostrar o som do q ou do g: queijo, quilo, guerra, guitarra. Em qua e gua ele soa: quatro, água.",
    },
    related: ["o", "i", "l"],
  },
  {
    slug: "v",
    lower: "v",
    upper: "V",
    name: "vê",
    ipa: "[v]",
    kind: "consoante",
    nameSpoken: "vê",
    soundSpoken: "va, ve, vi, vo, vu. Como em vaca, vulcão.",
    sound: "A letra V soa [v]: os dentes de cima encostam no lábio de baixo e a garganta vibra, como em vaca e vulcão.",
    words: [w("Vaca", "uma vaca", "🐄"), w("Vulcão", "um vulcão", "🌋")],
    tip: "Em português, o V e o B têm sons bem diferentes: compare vela e bela. Se a criança trocar, peça para ela sentir os dentes encostando no lábio quando diz o V.",
    faq: {
      question: "Qual é a diferença entre o V e o F?",
      answer: "Os dois se fazem com os dentes de cima no lábio de baixo. No V a voz sai e a garganta vibra; no F só sai ar. Por isso vaca e faca são palavras diferentes.",
    },
    related: ["f", "b", "w"],
  },
  {
    slug: "w",
    lower: "w",
    upper: "W",
    name: "dáblio",
    otherNames: ["dábliu", "vê duplo"],
    ipa: "[w] / [v]",
    kind: "consoante",
    nameSpoken: "dáblio",
    soundSpoken: "Como em kiwi, waffle.",
    sound: "A letra W aparece em palavras de outras línguas e em nomes. Às vezes soa como u, como em kiwi e waffle, e às vezes como v, como em alguns nomes: Wagner.",
    words: [w("Kiwi", "um kiwi", "🥝"), w("Waffle", "um waffle", "🧇")],
    tip: "O W é raro: a criança vai vê-lo em nomes (Wesley, Wanda), em marcas e em palavras como show e kiwi. Não é preciso treinar sílabas com W; basta reconhecer a letra.",
    faq: {
      question: "Como se pronuncia o W?",
      answer: "Depende da origem da palavra: soa como u em palavras do inglês (show, kiwi, waffle) e como v em alguns nomes de origem alemã (Wagner, que muitos dizem “Vágner”). Por isso o W se aprende palavra por palavra.",
    },
    related: ["k", "y", "v", "u"],
  },
  {
    slug: "x",
    lower: "x",
    upper: "X",
    name: "xis",
    ipa: "[ʃ] / [ks] / [z] / [s]",
    kind: "consoante",
    nameSpoken: "xis",
    soundSpoken: "xa, xe, xi, xo, xu. Como em xícara, abacaxi.",
    sound: "A letra X tem vários sons. O mais comum, e o primeiro que a criança aprende, é [ʃ], o mesmo do ch: xícara, abacaxi, peixe. Em outras palavras ela soa [ks] (táxi), [z] (exemplo) ou [s] (próximo).",
    words: [w("Xícara", "uma xícara", "☕"), w("Abacaxi", "um abacaxi", "🍍")],
    tip: "Para as crianças de 3 a 8 anos, basta o som de “ch”: xícara, xixi, peixe, caixa. Os outros sons do X vêm com a leitura, palavra por palavra.",
    faq: {
      question: "Quando se escreve X e quando se escreve CH?",
      answer: "Os dois têm o mesmo som em xícara e chuva, e não há uma regra que sirva sempre. Algumas pistas: depois de ai, ei e ou costuma vir x (caixa, peixe, frouxo) e depois de en também (enxada). Fora isso, a criança aprende lendo e escrevendo as palavras.",
    },
    related: ["s", "z", "c"],
  },
  {
    slug: "y",
    lower: "y",
    upper: "Y",
    name: "ípsilon",
    otherNames: ["i grego"],
    ipa: "[i]",
    kind: "consoante",
    nameSpoken: "ípsilon",
    soundSpoken: "i. Como em yakisoba, yoga.",
    sound: "A letra Y soa [i]. Ela aparece em palavras de outras línguas, como yakisoba e yoga, e em nomes como Yasmin e Yuri.",
    words: [w("Yakisoba", "um yakisoba", "🍜"), w("Yoga", "fazer yoga", "🧘")],
    tip: "O Y é raro e aparece em nomes (Yasmin, Yuri) e em palavras de outras línguas. Não é preciso treinar sílabas com Y; o importante é a criança reconhecer a letra e saber que ela soa como i.",
    faq: {
      question: "O Y é uma letra do alfabeto português?",
      answer: "Sim. Desde o Acordo Ortográfico, em vigor no Brasil desde 2009, o alfabeto tem 26 letras, com K, W e Y. Elas são usadas em nomes, símbolos e palavras de outras línguas; nas palavras portuguesas, o som [i] se escreve com i.",
    },
    related: ["i", "k", "w"],
  },
  {
    slug: "z",
    lower: "z",
    upper: "Z",
    name: "zê",
    ipa: "[z]",
    kind: "consoante",
    nameSpoken: "zê",
    soundSpoken: "za, ze, zi, zo, zu. Como em zebra, zero.",
    sound: "A letra Z soa [z], como em zebra e zero: é um zumbido, como o de uma abelha (zzzz). No fim das palavras, soa como s: nariz, feliz, luz.",
    words: [w("Zebra", "uma zebra", "🦓"), w("Zero", "o número zero", "0️⃣")],
    tip: "Brinquem de zumbir como uma abelha: zzzz. Mais tarde a criança vai descobrir que o som de z também se escreve com s entre vogais (casa, mesa), e que só a prática mostra qual usar.",
    faq: {
      question: "Por que casa se escreve com S e não com Z?",
      answer: "Entre vogais, o s soa [z], então o mesmo som pode ser escrito com s (casa, rosa) ou com z (azul, beleza). Não há uma regra simples: a criança aprende cada palavra lendo e escrevendo.",
    },
    related: ["s", "x"],
  },
];

const bySlug = new Map(portugueseLetters.map((l) => [l.slug, l]));

/** "a", "A" and "c-cedilha" all resolve; anything else is undefined. */
export function getPortugueseLetter(param: string): PortugueseLetter | undefined {
  return bySlug.get(param.length === 1 ? param.toLowerCase() : param);
}

/** The letter params with a page: each single letter as "a" and "A", plus "c-cedilha". */
export function portugueseLetterParams(): string[] {
  return portugueseLetters.flatMap((l) => (l.slug.length > 1 ? [l.slug] : [l.slug, l.upper]));
}

/** The 26 letters of the alphabet, without Ç. */
export const alphabetLetters = portugueseLetters.filter((l) => l.slug !== CEDILHA_SLUG);

/** Previous/next letter, in the order a, b, c, ç, d…z (wrapping around). */
export function portugueseNeighbors(slug: string): { prev: PortugueseLetter; next: PortugueseLetter } {
  const i = portugueseLetters.findIndex((l) => l.slug === slug);
  const n = portugueseLetters.length;
  return { prev: portugueseLetters[(i - 1 + n) % n], next: portugueseLetters[(i + 1) % n] };
}

const strip = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

/** "A de abelha" when the word starts with the letter, else "Ç, como em maçã". */
export function letterWithWord(l: PortugueseLetter, word: PortugueseWord): string {
  const starts = l.lower === "ç" ? false : strip(word.word).startsWith(l.lower);
  return starts ? `${l.upper} de ${word.word.toLowerCase()}` : `${l.upper}, como em ${word.word.toLowerCase()}`;
}

// The accents page (/pt/alfabeto/acentos): accented vowels are not new
// letters, so they share one page. The examples are said aloud by the page.
export type AcentoExample = { text: string; emoji: string };
export type AcentoGroup = {
  id: string;
  title: string;
  marks: string;
  explanation: string;
  examples: AcentoExample[];
};

export const acentoGroups: AcentoGroup[] = [
  {
    id: "agudo",
    title: "O acento agudo: a sílaba forte e o som aberto",
    marks: "á é í ó ú",
    explanation: "O acento agudo mostra a sílaba mais forte da palavra e, no é e no ó, o som aberto da vogal: café, avó. Sem o acento, sofá se leria “sófa”.",
    examples: [
      { text: "sofá", emoji: "🛋️" },
      { text: "café", emoji: "☕" },
      { text: "ímã", emoji: "🧲" },
      { text: "avó", emoji: "👵" },
    ],
  },
  {
    id: "circunflexo",
    title: "O acento circunflexo: o som fechado",
    marks: "â ê ô",
    explanation: "O “chapeuzinho” mostra a sílaba forte e o som fechado da vogal: lâmpada, bebê, avô. Compare avó, com som aberto, e avô, com som fechado.",
    examples: [
      { text: "lâmpada", emoji: "💡" },
      { text: "bebê", emoji: "👶" },
      { text: "avô", emoji: "👴" },
      { text: "robô", emoji: "🤖" },
    ],
  },
  {
    id: "til",
    title: "O til: o som que passa pelo nariz",
    marks: "ã õ",
    explanation: "O til mostra que a vogal é nasal: o som passa pelo nariz. Ele aparece no ã e no õ, e nos grupos ão, ãe e õe: mão, mãe, limões.",
    examples: [
      { text: "mão", emoji: "✋" },
      { text: "maçã", emoji: "🍎" },
      { text: "pão", emoji: "🍞" },
      { text: "limões", emoji: "🍋" },
    ],
  },
  {
    id: "grave",
    title: "O acento grave: para mais tarde",
    marks: "à",
    explanation: "O à aparece quando duas palavras se juntam (a + a), como em “Vamos à praia”. O som é o mesmo do a. A criança só vai estudá-lo mais tarde, no ensino fundamental.",
    examples: [{ text: "Vamos à praia.", emoji: "🏖️" }],
  },
];
