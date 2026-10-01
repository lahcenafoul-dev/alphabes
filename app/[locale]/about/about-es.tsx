import type { Metadata } from "next";
import { alternatesFor } from "@/lib/i18n/routes";

export const aboutMetadataEs: Metadata = {
  title: "Quiénes somos",
  description:
    "AlphaBes ayuda a niños de 3 a 8 años a aprender las letras y las sílabas, y a dar sus primeros pasos en la lectura.",
  alternates: alternatesFor("es", "/about"),
};

export default function AboutEs() {
  return (
    <main id="main-content" className="mx-auto max-w-2xl px-6 py-12">
      <h1 className="text-4xl font-extrabold">Quiénes somos</h1>
      <div className="mt-6 space-y-4 text-chalkboard/80 leading-relaxed">
        <p>
          AlphaBes nació de una idea sencilla: hacer que el primer paso de la lectura, las letras
          y sus sonidos, esté al alcance de los niños de 3 a 8 años y de las familias y los
          maestros que los acompañan.
        </p>
        <p>
          Cada lección une una letra con su sonido, con palabras de verdad y con actividades
          concretas, como trazar la letra o buscar la sílaba con la que empieza una palabra. Así,
          el niño se encuentra con la misma letra de varias maneras antes de pasar a la
          siguiente.
        </p>
        <p>
          La versión en español no es una simple traducción: los nombres de las letras, las
          palabras de ejemplo, las sílabas y la letra cursiva siguen lo que los niños aprenden en
          la escuela, con el método silábico (ma, me, mi, mo, mu) que usan tantas aulas de
          Latinoamérica y de España.
        </p>
        <p>
          El sitio está hecho para funcionar bien en el celular y en la tableta, porque ahí es
          donde muchos niños practican. La pantalla es lo bastante sencilla para que un niño se
          oriente solo, una vez que un adulto le ayudó a empezar.
        </p>
      </div>
    </main>
  );
}
