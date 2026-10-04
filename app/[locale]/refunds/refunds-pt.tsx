import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { alternatesFor } from "@/lib/i18n/routes";

export const refundsMetadataPt: Metadata = {
  title: "Política de reembolso",
  description: "Como funcionam o cancelamento e os reembolsos do AlphaBes Pro, pago pelo PayPal.",
  alternates: alternatesFor("pt", "/refunds"),
};

export default function RefundsPt() {
  return (
    <main id="main-content" className="mx-auto max-w-2xl px-6 py-12">
      <h1 className="text-4xl font-extrabold">Política de reembolso</h1>
      <p className="mt-2 text-sm text-chalkboard/50">Última atualização: 4 de outubro de 2026</p>

      <div className="mt-8 space-y-6 text-chalkboard/80 leading-relaxed">
        <section>
          <h2 className="font-display font-bold text-xl">Cancelar</h2>
          <p className="mt-2">
            Você pode cancelar o AlphaBes Pro quando quiser, na{" "}
            <Link href="/dashboard" className="font-bold text-crayon-blue">
              sua conta
            </Link>{" "}
            (“Cancelar assinatura”) ou na sua conta do PayPal, na parte de pagamentos automáticos.
            Não haverá novas cobranças, e você continua com o Pro até o fim do mês ou do ano que já
            pagou.
          </p>
        </section>

        <section>
          <h2 className="font-display font-bold text-xl">Plano mensal</h2>
          <p className="mt-2">
            Os pagamentos mensais (US$ 7,99) não são reembolsados, nem por um mês usado só em parte.
            Para evitar a próxima cobrança, cancele antes da data de renovação que aparece na sua
            conta.
          </p>
        </section>

        <section>
          <h2 className="font-display font-bold text-xl">Plano anual</h2>
          <p className="mt-2">
            Se você assinar o plano anual (US$ 59) e mudar de ideia, devolvemos o valor total se
            você pedir em até 14 dias depois desse primeiro pagamento anual. Depois de 14 dias, o
            pagamento anual não é reembolsado, mas você sempre pode cancelar para que ele não seja
            renovado.
          </p>
        </section>

        <section>
          <h2 className="font-display font-bold text-xl">Como pedir um reembolso</h2>
          <p className="mt-2">
            Escreva para a gente pela{" "}
            <Link href="/contact" className="font-bold text-crayon-blue">
              página de contato
            </Link>{" "}
            com o e-mail da sua conta do AlphaBes. O reembolso é feito pelo PayPal, para a conta ou
            o cartão usado no pagamento; o PayPal costuma mostrá-lo em poucos dias úteis. Quando um
            pagamento é reembolsado, a assinatura é cancelada e o Pro termina na hora.
          </p>
          <p className="mt-2">
            Se houve algum problema com um pagamento, fale com a gente antes de abrir uma disputa no
            PayPal: em geral resolvemos mais rápido.
          </p>
        </section>

        <section>
          <h2 className="font-display font-bold text-xl">Seus direitos</h2>
          <p className="mt-2">
            Esta política não limita nenhum dos direitos que a lei de defesa do consumidor do seu
            país garante a você. Os preços são em dólares americanos; se o PayPal converter o valor
            para a sua moeda, a taxa de câmbio e as tarifas são definidas pelo PayPal.
          </p>
        </section>
      </div>

      <p className="mt-10 text-sm text-chalkboard/50 border-t border-chalkboard/10 pt-4">
        Texto provisório: recomendamos uma revisão jurídica antes do lançamento, em especial do
        direito de arrependimento (artigo 49 do Código de Defesa do Consumidor), das regras de
        cancelamento no Brasil e em Portugal e das regras da União Europeia.
      </p>
    </main>
  );
}
