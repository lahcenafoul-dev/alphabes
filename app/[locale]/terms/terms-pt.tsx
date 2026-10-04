import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
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
      <p className="mt-2 text-sm text-chalkboard/50">Última atualização: 4 de outubro de 2026</p>

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
          <h2 className="font-display font-bold text-xl">Quem mantém o AlphaBes</h2>
          <p className="mt-2">
            O AlphaBes é mantido por Lahcen Afoullousse, no Marrocos. Você pode escrever para a gente
            pela{" "}
            <Link href="/contact" className="font-bold text-crayon-blue">
              página de contato
            </Link>
            .
          </p>
        </section>
        <section>
          <h2 className="font-display font-bold text-xl">AlphaBes Pro</h2>
          <p className="mt-2">
            O AlphaBes Pro acrescenta os jogos premium, o download dos pacotes de atividades em um
            único PDF e as histórias marcadas como Pro, como descrito na{" "}
            <Link href="/pricing" className="font-bold text-crayon-blue">
              página de preços
            </Link>
            . Tudo o que é grátis no AlphaBes continua grátis.
          </p>
        </section>
        <section>
          <h2 className="font-display font-bold text-xl">Assinaturas e pagamentos</h2>
          <p className="mt-2">
            O AlphaBes Pro custa US$ 7,99 por mês ou US$ 59 por ano, em dólares americanos, e é pago
            pelo PayPal (com uma conta do PayPal ou, onde o PayPal oferecer, com cartão). O pagamento
            é processado pelo PayPal: nunca vemos os dados do seu cartão ou do seu banco. Se o
            PayPal converter o valor para a sua moeda, a taxa de câmbio e as tarifas são definidas
            pelo PayPal.
          </p>
          <p className="mt-2">
            A assinatura é renovada automaticamente no fim de cada mês ou de cada ano, e o PayPal
            cobra a mesma forma de pagamento, até você cancelar. Você pode cancelar quando quiser na
            sua conta do AlphaBes ou na sua conta do PayPal: não haverá novas cobranças, e você
            continua com o Pro até o fim do período já pago.
          </p>
          <p className="mt-2">
            Se um pagamento de renovação falhar, o PayPal tenta de novo; se continuar falhando, o
            Pro fica pausado até a forma de pagamento ser atualizada no PayPal ou uma nova
            assinatura ser feita.
          </p>
          <p className="mt-2">
            Os reembolsos são explicados na nossa{" "}
            <Link href="/refunds" className="font-bold text-crayon-blue">
              política de reembolso
            </Link>
            . Se mudarmos o preço do Pro, avisaremos quem assina com pelo menos 30 dias de
            antecedência antes de o novo preço valer para essa pessoa, para que possa cancelar antes,
            se preferir.
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
