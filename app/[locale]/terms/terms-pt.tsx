import type { Metadata } from "next";
import { alternatesFor } from "@/lib/i18n/routes";

export const termsMetadataPt: Metadata = {
  title: "Termos de uso",
  description: "Os termos de uso do AlphaBes: contas, assinaturas e uso das atividades.",
  alternates: alternatesFor("pt", "/terms"),
};

export default function TermsPt() {
  return (
    <main id="main-content" className="mx-auto max-w-2xl px-6 py-12">
      <h1 className="text-4xl font-extrabold">Termos de uso</h1>
      <p className="mt-2 text-sm text-chalkboard/50">Última atualização: 3 de outubro de 2026</p>

      <div className="mt-8 space-y-6 text-chalkboard/80 leading-relaxed">
        <section>
          <h2 className="font-display font-bold text-xl">Quem pode criar uma conta</h2>
          <p className="mt-2">
            As contas do AlphaBes são criadas e administradas por uma mãe, um pai, um responsável
            legal ou um professor, nunca diretamente por uma criança. Ao criar uma conta, você
            confirma que tem pelo menos 18 anos ou a maioridade do seu país.
          </p>
        </section>
        <section>
          <h2 className="font-display font-bold text-xl">Assinaturas e pagamentos</h2>
          <p className="mt-2">
            O AlphaBes Pro é cobrado por mês (US$ 7,99) ou por ano (US$ 59). As assinaturas são
            renovadas automaticamente até você cancelá-las nas configurações da sua conta.
          </p>
        </section>
        <section>
          <h2 className="font-display font-bold text-xl">Uso permitido</h2>
          <p className="mt-2">
            As atividades e os materiais para imprimir são para uso pessoal, familiar ou em sala de
            aula. Não é permitido redistribuir nem revender o conteúdo do AlphaBes.
          </p>
        </section>
        <section>
          <h2 className="font-display font-bold text-xl">Mudanças no serviço</h2>
          <p className="mt-2">
            As lições, as atividades e as funções podem mudar com o tempo. Faremos o possível para
            avisar você com antecedência razoável de qualquer mudança que afete de forma importante
            uma assinatura paga.
          </p>
        </section>
      </div>

      <p className="mt-10 text-sm text-chalkboard/50 border-t border-chalkboard/10 pt-4">
        Texto provisório: recomendamos uma revisão jurídica antes do lançamento, em especial das
        condições de assinatura e das normas de defesa do consumidor no Brasil (Código de Defesa do
        Consumidor), em Portugal e na União Europeia.
      </p>
    </main>
  );
}
