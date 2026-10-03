import type { Metadata } from "next";
import { alternatesFor } from "@/lib/i18n/routes";

export const aboutMetadataPt: Metadata = {
  title: "Quem somos",
  description:
    "O AlphaBes ajuda crianças de 3 a 8 anos a aprender as letras e as sílabas e a dar os primeiros passos na leitura.",
  alternates: alternatesFor("pt", "/about"),
};

export default function AboutPt() {
  return (
    <main id="main-content" className="mx-auto max-w-2xl px-6 py-12">
      <h1 className="text-4xl font-extrabold">Quem somos</h1>
      <div className="mt-6 space-y-4 text-chalkboard/80 leading-relaxed">
        <p>
          O AlphaBes nasceu de uma ideia simples: deixar o primeiro passo da leitura, as letras e
          os seus sons, ao alcance das crianças de 3 a 8 anos e das famílias e dos professores que
          as acompanham.
        </p>
        <p>
          Cada lição liga uma letra ao seu som, a palavras de verdade e a atividades concretas,
          como traçar a letra ou descobrir com que sílaba começa uma palavra. Assim, a criança
          encontra a mesma letra de vários jeitos antes de passar para a próxima.
        </p>
        <p>
          A versão em português não é uma simples tradução: os nomes das letras, as palavras de
          exemplo, as sílabas e a letra cursiva seguem o que as crianças aprendem na escola no
          Brasil, com as famílias silábicas (ba, be, bi, bo, bu), os dígrafos e os sons nasais,
          na ordem da alfabetização.
        </p>
        <p>
          O site foi feito para funcionar bem no celular e no tablet, porque é ali que muitas
          crianças praticam. A tela é simples o bastante para a criança se virar sozinha, depois
          que um adulto a ajudou a começar.
        </p>
      </div>
    </main>
  );
}
