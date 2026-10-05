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
      <p className="mt-2 text-sm text-chalkboard/50">Última atualização: 5 de outubro de 2026</p>

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
            em{" "}
            <a href="mailto:hello@alphabes.com" className="font-bold text-crayon-blue">
              hello@alphabes.com
            </a>{" "}
            ou pela{" "}
            <Link href="/contact" className="font-bold text-crayon-blue">
              página de contato
            </Link>
            .
          </p>
          {/* PLACEHOLDER: postal address, to be decided by the owner with a lawyer/accountant (docs/paypal-plan.md). */}
          <p className="mt-2">Endereço postal: [a definir]</p>
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
            No plano anual, enviamos um e-mail de lembrete cerca de 7 dias antes de cada
            renovação, com a data e o valor.
          </p>
          <p className="mt-2">
            Se um pagamento de renovação falhar, o PayPal tenta de novo; se continuar falhando, o
            Pro fica pausado até a forma de pagamento ser atualizada no PayPal ou uma nova
            assinatura ser feita.
          </p>
          <p className="mt-2">
            Você pode pedir o reembolso total em até 14 dias depois do primeiro pagamento de uma
            assinatura mensal ou anual; os pagamentos de renovação não são reembolsados. Todos os
            detalhes estão na nossa{" "}
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
        <section>
          <h2 className="font-display font-bold text-xl">Sua privacidade</h2>
          <p className="mt-2">
            Como coletamos e usamos dados pessoais, inclusive os da sua criança, está explicado na
            nossa{" "}
            <Link href="/privacy-policy" className="font-bold text-crayon-blue">
              política de privacidade
            </Link>
            .
          </p>
        </section>
        <section>
          <h2 className="font-display font-bold text-xl">Encerramento de conta</h2>
          <p className="mt-2">
            Você pode parar de usar o AlphaBes quando quiser e pedir por escrito que a gente exclua
            a sua conta. Se você tiver uma assinatura, cancele antes para que ela não seja
            renovada.
          </p>
          <p className="mt-2">
            Podemos suspender ou encerrar uma conta que não respeite estes termos, por exemplo se
            ela redistribuir ou revender o nosso conteúdo, fizer uso abusivo do serviço ou fizer
            pagamentos fraudulentos. Se encerrarmos por outro motivo uma conta com assinatura
            ativa, cancelamos a assinatura e devolvemos a parte do período que você pagou e não
            usou.
          </p>
        </section>
        <section>
          <h2 className="font-display font-bold text-xl">Limitação de responsabilidade</h2>
          <p className="mt-2">
            Trabalhamos para que o AlphaBes seja correto e esteja disponível, mas ele é oferecido
            “no estado em que se encontra” e não podemos garantir que funcione sempre sem erros ou
            interrupções. Na medida permitida pela lei, não respondemos por danos indiretos, e a
            nossa responsabilidade total perante você fica limitada ao valor que você nos pagou
            nos 12 meses anteriores à reclamação. Nada nestes termos limita uma responsabilidade
            que a lei não permite limitar, nem os direitos que a lei de defesa do consumidor do seu
            país garante a você.
          </p>
        </section>
        <section>
          <h2 className="font-display font-bold text-xl">Lei aplicável</h2>
          <p className="mt-2">
            Estes termos são regidos pela lei do Marrocos, e as disputas são resolvidas nos
            tribunais do Marrocos. Se você usa o AlphaBes como consumidor, continua protegido pelas
            normas obrigatórias de defesa do consumidor do país onde mora e pode entrar com uma
            ação na justiça desse país.
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
