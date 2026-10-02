// The Spanish school-level hubs: /es/preescolar (3 a 5 años) and /es/kinder
// (5 a 6 años), and their topic pages. Written for Spanish-speaking
// families, not translated from the English or French hubs. School years
// have different names and ages by country (in Mexico "kínder" is all of
// preescolar, in Chile it's the 5–6 year), so every page gives the ages
// (docs/spanish-plan.md, D8).
//
// Topics with an English twin (`en`) are also paired in TRANSLATED_PARAMS
// (lib/i18n/routes.ts); tests check that the two agree.
import type { AppPathname } from "@/i18n/routing";

export type SchoolLevelEs = "preescolar" | "kinder";

export type TopicLinkEs = { label: string; pathname: AppPathname; params?: Record<string, string> };

export type SchoolTopicEs = {
  level: SchoolLevelEs;
  slug: string;
  /** The English topic's slug, when there is one. */
  en?: string;
  title: string;
  metaTitle: string;
  summary: string;
  emoji: string;
  intro: string[];
  tips: string[];
  activity: { title: string; material: string; steps: string[] };
  links: TopicLinkEs[];
};

const fichas = (category: string, label: string): TopicLinkEs => ({
  label,
  pathname: "/worksheets/[category]",
  params: { category },
});
const game = (slug: string, label: string): TopicLinkEs => ({ label, pathname: "/games/[slug]", params: { slug } });
const silabas = (skill: string, label: string): TopicLinkEs => ({ label, pathname: "/phonics/[skill]", params: { skill } });

export const schoolTopicsEs: SchoolTopicEs[] = [
  // ------------------------------------------------------------ preescolar
  {
    level: "preescolar",
    slug: "trazos",
    title: "Los trazos en preescolar",
    metaTitle: "Trazos para preescolar: preparar la mano para escribir (grafomotricidad)",
    summary: "Líneas, círculos, puentes y bucles: los movimientos que preparan la mano para escribir, mucho antes de las letras.",
    emoji: "〰️",
    intro: [
      "Antes de escribir letras, la mano aprende movimientos: una línea de arriba abajo, un círculo, una fila de puentes, unas olas. Es la grafomotricidad, y en preescolar se trabaja casi todos los días con trazos, dibujos y juegos.",
      "Estos trazos son las piezas de las letras: el círculo será la o y la a, el puente será la n y la m, el bucle será la l y la e de la letra cursiva. Un niño que domina los trazos aprende a escribir con mucho menos esfuerzo.",
    ],
    tips: [
      "Empiecen en grande y de pie: en un pizarrón, en una hoja grande pegada en la pared, en la arena o con espuma en la mesa. Lo pequeño viene después.",
      "Los círculos se trazan en sentido contrario a las manecillas del reloj, como se escribirán la o y la a. Muestra el punto de partida: «arriba, hacia la izquierda».",
      "Un crayón grueso se agarra más fácil que un lápiz delgado.",
      "Pongan nombre a los movimientos: «bajo», «subo y bajo», «hago una vuelta». Las palabras ayudan a la mano a recordar.",
    ],
    activity: {
      title: "Las olas del mar",
      material: "Una hoja grande, crayones o marcadores azules y un barquito dibujado o recortado.",
      steps: [
        "Dibujen juntos una línea de mar en la parte de abajo de la hoja.",
        "Tu hijo o hija hace avanzar el barquito sobre las olas: puentes que suben y bajan, sin levantar el crayón.",
        "Después hagan olas más pequeñas, y luego bucles «cuando el mar se agita».",
        "Terminen con un sol: un círculo y rayitas alrededor.",
      ],
    },
    links: [
      game("traza-la-letra", "Juego: traza la letra"),
      fichas("figuras", "Fichas de figuras"),
      { label: "Actividades para hacer en casa", pathname: "/activities" },
    ],
  },
  {
    level: "preescolar",
    slug: "traza-las-letras",
    en: "letter-tracing",
    title: "Trazar las letras en preescolar",
    metaTitle: "Trazar las letras en preescolar: primero su nombre, sin prisas",
    summary: "Seguir líneas punteadas para aprender la forma de cada letra y el orden de los trazos, empezando por las letras de su nombre.",
    emoji: "✏️",
    intro: [
      "En preescolar, la primera palabra que un niño quiere escribir es casi siempre su nombre. Por eso conviene empezar con esas letras, en letra script (de molde), en mayúsculas o en minúsculas según lo haga su escuela.",
      "Trazar sobre líneas punteadas enseña la forma de la letra y el orden de los trazos. Lo importante no es que quede perfecta, sino empezar en el lugar correcto e ir en la dirección correcta.",
    ],
    tips: [
      "Dos o tres letras por sesión son suficientes. Empiecen con las de su nombre.",
      "Muestra el punto de partida: casi todas las letras empiezan arriba.",
      "Primero con el dedo, sobre la mesa o en el aire; después con un crayón grueso.",
      "Si se sale de las líneas, no pasa nada: la precisión llega con el tiempo.",
    ],
    activity: {
      title: "Su nombre en plastilina",
      material: "Plastilina y una hoja con su nombre escrito en letras grandes.",
      steps: [
        "Escribe el nombre de tu hijo o hija en letras muy grandes en una hoja.",
        "Hagan juntos rollitos de plastilina y pónganlas sobre cada trazo de las letras.",
        "Después, sigan cada letra con el dedo, diciendo su nombre: «eme, a, ere…».",
        "Al final, que escriba su nombre con crayón al lado del modelo.",
      ],
    },
    links: [
      fichas("trazo-de-letras", "Fichas de trazo de letras"),
      game("traza-la-letra", "Juego: traza la letra"),
      { label: "El abecedario, letra por letra", pathname: "/alphabet" },
    ],
  },
  {
    level: "preescolar",
    slug: "colorear",
    en: "coloring",
    title: "Colorear las letras en preescolar",
    metaTitle: "Colorear las letras en preescolar: aprender el abecedario coloreando",
    summary: "Colorear una letra grande y sus dibujos: la mano se ejercita y la letra se vuelve familiar.",
    emoji: "🖍️",
    intro: [
      "Colorear ya es trabajar la mano: agarrar el crayón, quedarse más o menos dentro de la forma, cambiar de color. Son los mismos músculos que se usan para escribir.",
      "Cuando la hoja muestra una letra grande y dibujos que empiezan con ella, el niño la mira un buen rato y habla de ella: aprende sin darse cuenta.",
    ],
    tips: [
      "Deja que elija los colores: el objetivo es practicar, no que quede «bien».",
      "No hace falta terminar la hoja. Diez minutos están muy bien.",
      "Mientras colorea, nombren la letra y los dibujos: «la eme, de mono».",
      "Los lápices de colores bien afilados se controlan mejor que los marcadores gruesos.",
    ],
    activity: {
      title: "Colorea lo que te digo",
      material: "Una ficha para colorear y colores.",
      steps: [
        "Imprime la ficha de una letra, por ejemplo la M.",
        "Pide: «Colorea la manzana de rojo y la mariposa de azul».",
        "Coloreen al final la letra grande, diciendo juntos su nombre.",
        "Pongan la ficha en el refrigerador: se la enseñará a toda la familia.",
      ],
    },
    links: [
      fichas("colorear-letras", "Fichas para colorear letras"),
      fichas("colores", "Fichas de colores"),
      { label: "Las tarjetas con dibujos", pathname: "/flashcards" },
    ],
  },
  // --------------------------------------------------------------- kínder
  {
    level: "kinder",
    slug: "silabas",
    title: "Las sílabas en kínder",
    metaTitle: "Las sílabas en kínder: aplaudir, contar y unir ma, me, mi, mo, mu",
    summary: "Separar las palabras en sílabas aplaudiendo, y después unir una consonante con una vocal: m con a, «ma».",
    emoji: "👏",
    intro: [
      "En español se lee por sílabas. Antes de leer, el niño aprende a escuchar que las palabras tienen pedazos: «ma-ri-po-sa» tiene cuatro, «sol» solo una. Este trabajo de oído, aplaudiendo, es la base de la lectura.",
      "Después llega el gran paso: unir una consonante con una vocal. La m con la a hace «ma», y con las cinco vocales salen ma, me, mi, mo, mu. Con unas pocas sílabas ya se leen palabras de verdad: mamá, mano, mesa.",
    ],
    tips: [
      "Aplaudan las sílabas mientras dicen la palabra: to-ma-te, tres palmadas.",
      "Empiecen con los nombres de la familia: cada quien aplaude el suyo.",
      "Para unir, alarguen la consonante y deslícense hacia la vocal: «mmmm… a… ¡ma!». Las consonantes que se pueden alargar (m, s, l, f, n) son las más fáciles.",
      "Una consonante nueva a la vez, con sus cinco sílabas, y palabras que solo usen lo que ya conoce.",
    ],
    activity: {
      title: "La canasta de las sílabas",
      material: "Una canasta o una caja y algunos objetos de la casa (cuchara, pelota, vaso, peine…).",
      steps: [
        "Saca un objeto de la canasta y di su nombre.",
        "Tu hijo o hija aplaude las sílabas y las cuenta: pe-lo-ta, tres sílabas.",
        "Formen montones: los de una sílaba, los de dos, los de tres.",
        "Para los más grandes: busquen un objeto que empiece con la misma sílaba (pe-lo-ta, pe-ra).",
      ],
    },
    links: [
      silabas("contar-silabas", "Contar las sílabas"),
      silabas("silabas-directas", "Las sílabas directas: ma, me, mi, mo, mu"),
      game("aplaude-las-silabas", "Juego: aplaude las sílabas"),
      fichas("silabas", "Fichas de sílabas"),
    ],
  },
  {
    level: "kinder",
    slug: "palabras-frecuentes",
    en: "sight-words",
    title: "Las palabras frecuentes en kínder",
    metaTitle: "Palabras frecuentes en kínder: el, la, y, en, un, es…",
    summary: "Las palabras cortas que aparecen en casi todas las oraciones (el, la, y, en, un, es) y que se aprenden a reconocer de un vistazo.",
    emoji: "🧩",
    intro: [
      "Hay palabras que aparecen en casi todas las oraciones: el, la, los, un, una, y, en, es, de, con… Reconocerlas de un vistazo permite leer una oración sin detenerse en cada palabra.",
      "En español casi todas se pueden leer por sílabas, pero verlas muchas veces hace que se lean solas, sin esfuerzo. En kínder se descubren unas cuantas, en los cuentos y en las oraciones del salón; en primer grado se aprenden muchas más.",
    ],
    tips: [
      "Tres o cuatro palabras a la vez, no más. Se agregan otras cuando esas ya se conocen.",
      "Búsquenlas en un cuento o en una caja de cereal: «¿Dónde dice la?».",
      "Escríbanlas en tarjetas y péguenlas en el refrigerador.",
      "Formen oraciones con las palabras frecuentes y los nombres de la familia: «Papá y Ana».",
    ],
    activity: {
      title: "El bingo de las palabras",
      material: "Tarjetas con cuatro palabras frecuentes escritas dos veces, y fichas o botones.",
      steps: [
        "Escribe cuatro palabras frecuentes (el, la, un, y) en un tablero, y las mismas en tarjetas.",
        "Saca una tarjeta y lee la palabra en voz alta.",
        "Tu hijo o hija pone una ficha sobre la misma palabra en su tablero.",
        "Cuando ya conozca las palabras, será quien saque y lea las tarjetas.",
      ],
    },
    links: [
      silabas("palabras-frecuentes", "Las palabras frecuentes (sílabas)"),
      fichas("palabras-frecuentes", "Fichas de palabras frecuentes"),
      { label: "Los cuentos para leer", pathname: "/stories" },
    ],
  },
  {
    level: "kinder",
    slug: "letra-cursiva",
    en: "handwriting",
    title: "La letra cursiva en kínder",
    metaTitle: "La letra cursiva en kínder: la letra ligada en doble raya",
    summary: "De la letra script a la letra ligada, en el cuaderno de doble raya, empezando por los bucles.",
    emoji: "✍️",
    intro: [
      "Cada país, y a veces cada escuela, decide cuándo se empieza la letra cursiva (ligada, enlazada o manuscrita): en muchas escuelas de Chile, Colombia, Perú o España se aprende desde los 5 o 6 años; en México muchas empiezan con la letra script y pasan a la cursiva en primero o segundo grado.",
      "Se aprende en un cuaderno de doble raya, respetando la altura de cada letra. Se empieza por las letras hechas de bucles y puentes (e, l, i, u, n, m), luego el nombre y palabras cortas. Cada letra tiene un punto de partida y una dirección: eso es lo que permite unirlas.",
    ],
    tips: [
      "Bien sentado, con los pies en el piso y la hoja un poco inclinada: la postura importa tanto como la letra.",
      "El lápiz se toma entre el pulgar y el índice, apoyado en el dedo medio, sin apretar.",
      "Primero hagan la letra en grande, en el aire o en un pizarrón, antes de escribirla en las líneas.",
      "Mejor sesiones cortas y frecuentes que una página entera de letras.",
      "Sigan el modelo de la escuela: si la maestra enseña otra cursiva, usen la suya.",
    ],
    activity: {
      title: "Los bucles en el pizarrón",
      material: "Un pizarrón blanco y un marcador, o una hoja y un lápiz.",
      steps: [
        "Tracen una línea y hagan juntos una fila de bucles pequeños (como la e), sin levantar el lápiz.",
        "Después, una fila de bucles grandes (como la l).",
        "Alternen: bucle pequeño, bucle grande. ¡Acaban de escribir «el»!",
        "Terminen escribiendo su nombre en cursiva, para que lo repase con un marcador.",
      ],
    },
    links: [
      fichas("letra-cursiva", "Fichas de letra cursiva"),
      game("traza-la-letra", "Juego: traza la letra (en cursiva)"),
      { label: "El abecedario, letra por letra", pathname: "/alphabet" },
    ],
  },
];

export function topicsOfEs(level: SchoolLevelEs): SchoolTopicEs[] {
  return schoolTopicsEs.filter((t) => t.level === level);
}

export function getSchoolTopicEs(level: SchoolLevelEs, slug: string): SchoolTopicEs | undefined {
  return schoolTopicsEs.find((t) => t.level === level && t.slug === slug);
}

// ---------------------------------------------------------------- hubs

export type SchoolHubEs = {
  pathname: "/preschool" | "/kindergarten";
  topicPathname: "/preschool/[topic]" | "/kindergarten/[topic]";
  name: string;
  title: string;
  metaTitle: string;
  description: string;
  age: string;
  /** For JSON-LD typicalAgeRange. */
  ageRange: string;
  intro: string;
  learns: { title: string; text: string }[];
  resources: TopicLinkEs[];
  faq: { question: string; answer: string }[];
};

export const SCHOOL_HUBS_ES: Record<SchoolLevelEs, SchoolHubEs> = {
  preescolar: {
    pathname: "/preschool",
    topicPathname: "/preschool/[topic]",
    name: "Preescolar",
    title: "Aprender en preescolar, de 3 a 5 años",
    metaTitle: "Preescolar: actividades para aprender las letras (3 a 5 años)",
    description:
      "Trazos, primeras letras, colorear y escuchar las sílabas: ideas, juegos y fichas para acompañar en casa a un niño de 3 a 5 años.",
    age: "3 a 5 años",
    ageRange: "3-5",
    intro:
      "De los 3 a los 5 años se aprende jugando: se conversa mucho, se reconoce el propio nombre, se descubren algunas letras y se prepara la mano para escribir. No hay prisa: cada niño avanza a su ritmo. Aquí tienes ideas para acompañarlo en casa, con calma.",
    learns: [
      { title: "Hablar y escuchar", text: "Aprender palabras nuevas, contar lo que pasó, jugar con rimas, canciones y adivinanzas." },
      { title: "Reconocer letras", text: "Primero las de su nombre, después las vocales y otras letras del abecedario." },
      { title: "Preparar la mano", text: "Trazos, colorear, plastilina y recortar: los movimientos que servirán para escribir." },
      { title: "Escuchar las sílabas", text: "Aplaudir las sílabas de las palabras y reconocer las vocales al principio de una palabra." },
    ],
    resources: [
      { label: "El abecedario", pathname: "/alphabet" },
      { label: "Las tarjetas con dibujos", pathname: "/flashcards" },
      { label: "Los juegos", pathname: "/games" },
      { label: "Las actividades", pathname: "/activities" },
      { label: "Las fichas para imprimir", pathname: "/worksheets" },
    ],
    faq: [
      {
        question: "¿Mi hijo debe saber todo el abecedario a los 4 años?",
        answer:
          "No. A esta edad, reconocer algunas letras, sobre todo las de su nombre y las vocales, ya está muy bien. El abecedario completo se va construyendo hasta los 5 o 6 años.",
      },
      {
        question: "¿Hay que enseñarle a leer en preescolar?",
        answer:
          "No hace falta. Lo que más ayuda es leerle cuentos, conversar y jugar con las palabras: rimas, sílabas, «veo, veo». Si muestra interés por las letras, acompáñalo, sin presionar.",
      },
      {
        question: "¿Cuánto tiempo al día?",
        answer:
          "Unos minutos bastan, cuando tenga ganas. Una canción, una letra buscada en un cuento o una hoja para colorear ya es mucho.",
      },
      {
        question: "Mi hijo de 3 años no agarra bien el lápiz. ¿Es grave?",
        answer:
          "No, es normal. La plastilina, las pinzas de ropa, recortar y los crayones gruesos fortalecen la mano poco a poco. La forma correcta de tomar el lápiz llega hacia los 4 o 5 años.",
      },
    ],
  },
  kinder: {
    pathname: "/kindergarten",
    topicPathname: "/kindergarten/[topic]",
    name: "Kínder",
    title: "Aprender en kínder, de 5 a 6 años",
    metaTitle: "Kínder: letras, sílabas y primeras lecturas (5 a 6 años)",
    description:
      "Todas las letras, las sílabas, las primeras palabras y la letra cursiva: ideas, juegos y fichas para el año antes de primer grado, de 5 a 6 años.",
    age: "5 a 6 años",
    ageRange: "5-6",
    intro:
      "El último año antes de la primaria (kínder, tercero de preescolar, transición, sala de 5 o último curso de infantil, según el país) prepara para leer y escribir. El niño aprende a reconocer todas las letras, a escuchar y unir las sílabas, y a veces empieza la letra cursiva. Es un año importante, pero se sigue aprendiendo jugando.",
    learns: [
      { title: "Todas las letras", text: "El nombre de las 27 letras, con la ñ, en mayúscula y minúscula, y su sonido." },
      { title: "Las sílabas", text: "Separar las palabras en sílabas, encontrar la primera sílaba y unir ma, me, mi, mo, mu." },
      { title: "Las primeras palabras", text: "Leer palabras cortas con las sílabas que conoce y reconocer palabras frecuentes (el, la, y, un)." },
      { title: "La escritura", text: "Su nombre y palabras cortas, en letra script y, en muchas escuelas, en cursiva sobre doble raya." },
    ],
    resources: [
      { label: "El abecedario", pathname: "/alphabet" },
      { label: "Las sílabas", pathname: "/phonics" },
      { label: "Los juegos", pathname: "/games" },
      { label: "Los cuentos", pathname: "/stories" },
      { label: "Las fichas para imprimir", pathname: "/worksheets" },
    ],
    faq: [
      {
        question: "¿Mi hijo debe saber leer al terminar el kínder?",
        answer:
          "No necesariamente. En muchos países se aprende a leer en primer grado. Al terminar el kínder se espera sobre todo que conozca las letras, escuche las sílabas y lea algunas. Unos niños ya leen palabras y otros todavía no: las dos cosas son normales.",
      },
      {
        question: "¿Letra script o cursiva: qué practicamos en casa?",
        answer:
          "La de su escuela. Cada escuela elige su modelo y su momento para la cursiva. En casa, hagan bucles y puentes, y escriban su nombre como lo escribe su maestra o maestro.",
      },
      {
        question: "¿Cómo lo preparo para primer grado?",
        answer:
          "Léele un cuento cada día, jueguen con las sílabas («¿qué empieza como mamá?») y déjalo escribir la lista de compras o una tarjeta. El gusto por los libros importa más que ir adelantado.",
      },
      {
        question: "¿Y si todavía confunde la b y la d?",
        answer:
          "Es muy común hasta primer grado, y aun después. Trabajen una letra a la vez, con una pista (la b tiene «la panza adelante») y el juego «Encuentra la letra».",
      },
    ],
  },
};
