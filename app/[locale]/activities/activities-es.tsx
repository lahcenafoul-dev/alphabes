import type { Metadata } from "next";
import Link from "next/link";
import { absoluteUrl, alternatesFor, localizedPath } from "@/lib/i18n/routes";
import { buildBreadcrumbJsonLd } from "@/lib/json-ld";

const title = "Actividades para aprender las letras y las sílabas, sin pantallas";
const description =
  "Ocho actividades fáciles para hacer en casa o en el salón con lo que hay a la mano: buscar letras, plastilina, la bandeja de sal, «Veo, veo» con sílabas, aplaudir y saltar las sílabas, bingo y juego de memoria. De 3 a 7 años.";

export const activitiesMetadataEs: Metadata = {
  title,
  description,
  alternates: alternatesFor("es", "/activities"),
  openGraph: { title, description, url: absoluteUrl("es", "/activities") },
};

type Activity = {
  id: string;
  emoji: string;
  title: string;
  age: string;
  summary: string;
  material: string;
  steps: string[];
  link: { label: string; href: string };
};

const fichas = (category: string) => localizedPath("es", "/worksheets/[category]", { category });
const juego = (slug: string) => localizedPath("es", "/games/[slug]", { slug });
const silabas = (skill: string) => localizedPath("es", "/phonics/[skill]", { skill });

// Words that mean the same thing in every Spanish-speaking country
// (docs/spanish-plan.md, D2): no gis, plumón, frijol, lotería or memorama.
const activities: Activity[] = [
  {
    id: "busca-las-letras",
    emoji: "🔎",
    title: "Busca las letras de tu nombre",
    age: "3 a 6 años",
    summary: "Encontrar las letras de su nombre en revistas, recortarlas y pegarlas en orden.",
    material: "Revistas o folletos viejos, tijeras de punta redonda, pegamento y una hoja.",
    steps: [
      "Escribe el nombre de tu hijo o hija en letras grandes en la parte de arriba de la hoja.",
      "Busquen juntos cada letra del nombre en las revistas.",
      "Tu hijo o hija recorta (o arranca) las letras que encuentra y las pega debajo del modelo, en orden.",
      "Lean el nombre señalando cada letra con el dedo.",
    ],
    link: { label: "Juego: encuentra la letra", href: juego("encuentra-la-letra") },
  },
  {
    id: "letras-de-plastilina",
    emoji: "🟠",
    title: "Letras de plastilina",
    age: "3 a 5 años",
    summary: "Hacer rollitos de plastilina y formar las letras sobre un modelo grande.",
    material: "Plastilina y modelos de letras en grande (sirve una ficha de trazo).",
    steps: [
      "Pon delante de tu hijo o hija el modelo de una letra.",
      "Tu hijo o hija hace rollitos de plastilina y los pone sobre cada trazo de la letra.",
      "Después sigue la letra de plastilina con el dedo, diciendo su nombre.",
      "Para los más grandes: formar la letra sin modelo, y luego una palabra corta (mamá, sol).",
    ],
    link: { label: "Fichas de trazo de letras", href: fichas("trazo-de-letras") },
  },
  {
    id: "bandeja-de-sal",
    emoji: "🏖️",
    title: "Escribir en la bandeja de sal",
    age: "3 a 6 años",
    summary: "Trazar las letras con el dedo en una bandeja con sal, arena o harina.",
    material: "Una bandeja o una caja plana, sal (o arena, harina) y tarjetas con letras.",
    steps: [
      "Pon una capa delgada de sal en la bandeja.",
      "Muestra una tarjeta y traza la letra con el dedo en la sal, empezando por el lugar correcto.",
      "Tu hijo o hija la traza después. Se agita la bandeja para borrar.",
      "Variante: tú trazas una letra y adivina cuál es.",
    ],
    link: { label: "Juego: traza la letra", href: juego("traza-la-letra") },
  },
  {
    id: "veo-veo-silabas",
    emoji: "👀",
    title: "«Veo, veo» con sílabas",
    age: "4 a 6 años",
    summary: "El juego de siempre, pero con la primera sílaba: «Veo, veo una cosa que empieza con pa…».",
    material: "Nada: solo mirar alrededor, en la casa, en el parque o en el auto.",
    steps: [
      "Elige algo que los dos puedan ver, por ejemplo una pelota.",
      "Di: «Veo, veo una cosa que empieza con… pe».",
      "Tu hijo o hija busca y nombra cosas hasta que adivina: «¡pe-lo-ta!».",
      "Cambien de papel: ahora él o ella elige la cosa y dice la sílaba.",
    ],
    link: { label: "Juego: ¿con qué sílaba empieza?", href: juego("primera-silaba") },
  },
  {
    id: "salta-las-silabas",
    emoji: "🦘",
    title: "Aplaude y salta las sílabas",
    age: "4 a 6 años",
    summary: "Una palmada o un salto por sílaba: el cuerpo ayuda a escuchar los pedazos de las palabras.",
    material: "Nada, o unos aros o cojines en el piso.",
    steps: [
      "Di una palabra: «ma-ri-po-sa».",
      "Tu hijo o hija da un salto (o pasa de un cojín a otro) en cada sílaba.",
      "Cuenta sus saltos: cuatro saltos, cuatro sílabas.",
      "Prueben con los nombres de la familia, y luego con palabras largas: «hi-po-pó-ta-mo».",
    ],
    link: { label: "Juego: aplaude las sílabas", href: juego("aplaude-las-silabas") },
  },
  {
    id: "silabas-en-tapas",
    emoji: "🔤",
    title: "Palabras con tapas de botella",
    age: "5 a 7 años",
    summary: "Escribir sílabas en tapas de botella y juntarlas para formar palabras: ma + no = mano.",
    material: "Unas quince tapas de botellas de plástico y un marcador permanente.",
    steps: [
      "Escribe en las tapas sílabas que tu hijo o hija ya conozca: ma, me, mi, mo, mu, pa, no, sa, la…",
      "Forma una palabra con dos tapas, por ejemplo «ma» y «no», y léanla juntos: «mano».",
      "Ahora le toca: ¿qué palabras puede formar? mamá, mesa, pato, sopa…",
      "Para los más grandes: con tres tapas (pe-lo-ta, to-ma-te).",
    ],
    link: { label: "Las sílabas directas", href: silabas("silabas-directas") },
  },
  {
    id: "bingo-de-letras",
    emoji: "🎲",
    title: "El bingo de las letras",
    age: "4 a 6 años",
    summary: "Un bingo hecho en casa para reconocer las letras jugando entre varios.",
    material: "Tableros de 6 casillas con letras, tarjetas con las mismas letras y fichas o botones.",
    steps: [
      "Cada jugador recibe un tablero con seis letras.",
      "Se saca una tarjeta y se dice el nombre de la letra.",
      "Quien tiene esa letra en su tablero pone una ficha encima.",
      "Gana quien llena primero su tablero. Para los más grandes, se dice una sílaba (ma) y se busca la letra con la que empieza.",
    ],
    link: { label: "Fichas para reconocer letras", href: fichas("reconocer-letras") },
  },
  {
    id: "memoria-mayusculas-minusculas",
    emoji: "🃏",
    title: "Juego de memoria: mayúscula y minúscula",
    age: "5 a 7 años",
    summary: "Encontrar las parejas A-a, B-b, Ñ-ñ… para unir las dos formas de cada letra.",
    material: "Tarjetas hechas en casa: una letra en mayúscula en una, la misma en minúscula en otra.",
    steps: [
      "Preparen de 6 a 10 parejas de tarjetas y pónganlas boca abajo.",
      "Por turnos, cada quien voltea dos tarjetas diciendo el nombre de las letras.",
      "Si es la misma letra (A y a), se queda con la pareja y vuelve a jugar.",
      "Gana quien tenga más parejas al final.",
    ],
    link: { label: "El abecedario, letra por letra", href: localizedPath("es", "/alphabet") },
  },
];

export default function ActivitiesEs() {
  const url = absoluteUrl("es", "/activities");
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Inicio", url: absoluteUrl("es", "/") },
    { name: "Actividades", url },
  ]);
  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Actividades para aprender las letras y las sílabas",
    itemListElement: activities.map((a, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: a.title,
      url: `${url}#${a.id}`,
    })),
  };

  return (
    <main id="main-content" className="mx-auto max-w-5xl px-6 py-12">
      <nav aria-label="Ruta de navegación" className="text-sm text-chalkboard/60">
        <ol className="flex gap-2">
          <li><Link href={localizedPath("es", "/")}>Inicio</Link> /</li>
          <li aria-current="page" className="font-bold">Actividades</li>
        </ol>
      </nav>

      <h1 className="mt-6 text-4xl font-extrabold">Actividades para aprender, sin pantallas</h1>
      <p className="mt-2 text-chalkboard/70 max-w-2xl">
        Ideas sencillas, con lo que hay en casa, para acompañar las letras y las sílabas de la
        semana. Cada actividad dura de diez a quince minutos y funciona igual de bien en familia
        que en el salón de clases.
      </p>

      <ul className="mt-8 grid sm:grid-cols-2 gap-5">
        {activities.map((a) => (
          <li key={a.id} id={a.id} className="flex flex-col rounded-block border border-chalkboard/10 p-6 shadow-block scroll-mt-24">
            <div className="flex items-start justify-between gap-3">
              <h2 className="font-display font-bold text-lg">
                <span aria-hidden="true">{a.emoji} </span>
                {a.title}
              </h2>
              <span className="shrink-0 rounded-full bg-crayon-yellow/25 px-3 py-1 text-xs font-bold">{a.age}</span>
            </div>
            <p className="mt-2 text-sm text-chalkboard/70">{a.summary}</p>
            <p className="mt-3 text-sm">
              <strong>Material:</strong> {a.material}
            </p>
            <ol className="mt-3 space-y-1 list-decimal list-inside text-sm text-chalkboard/80">
              {a.steps.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ol>
            <Link href={a.link.href} className="mt-auto pt-4 text-sm font-bold text-crayon-blue underline underline-offset-2">
              {a.link.label} →
            </Link>
          </li>
        ))}
      </ul>

      <Link
        href={localizedPath("es", "/worksheets")}
        className="mt-8 inline-block rounded-block bg-crayon-green text-paper font-display font-bold px-5 py-2.5 shadow-block hover:shadow-blockHover transition"
      >
        Las fichas para imprimir
      </Link>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }} />
    </main>
  );
}
