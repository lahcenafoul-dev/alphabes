import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { alternatesFor } from "@/lib/i18n/routes";

export const privacyPolicyMetadataPt: Metadata = {
  title: "Política de privacidade",
  description:
    "Os dados que o AlphaBes coleta, como os usamos e os seus direitos, em especial sobre os perfis das crianças.",
  alternates: alternatesFor("pt", "/privacy-policy"),
};

export default function PrivacyPolicyPt() {
  return (
    <main id="main-content" className="mx-auto max-w-2xl px-6 py-12">
      <h1 className="text-4xl font-extrabold">Política de privacidade</h1>
      <p className="mt-2 text-sm text-chalkboard/50">Última atualização: 4 de outubro de 2026</p>

      <div className="mt-8 space-y-6 text-chalkboard/80 leading-relaxed">
        <section>
          <h2 className="font-display font-bold text-xl">Em resumo</h2>
          <p className="mt-2">
            O AlphaBes (“nós”) oferece lições, atividades e jogos para que crianças de 3 a 8 anos
            aprendam o alfabeto, as sílabas e a leitura. Esta política explica quais informações
            coletamos, como as usamos e quais escolhas você tem. As contas do AlphaBes são criadas e
            administradas por uma mãe, um pai, um responsável legal ou um professor, nunca
            diretamente por uma criança.
          </p>
        </section>

        <section>
          <h2 className="font-display font-bold text-xl">As informações que coletamos</h2>
          <p className="mt-2">
            <strong>Dados da conta.</strong> Quando uma mãe, um pai, um responsável ou um professor
            cria uma conta, coletamos um e-mail, um nome e uma senha protegida por criptografia (com
            o NextAuth). Nunca guardamos a sua senha em texto legível.
          </p>
          <p className="mt-2">
            <strong>Perfil da criança.</strong> Um perfil de criança contém apenas um nome e uma
            faixa de idade: nunca uma foto, um endereço, um telefone, uma escola ou qualquer outro
            dado de contato da criança. O progresso nas lições e nas atividades fica salvo no
            perfil, para que a família possa acompanhá-lo pela sua conta.
          </p>
          <p className="mt-2">
            <strong>Assinatura e pagamento.</strong> Se você assinar o AlphaBes Pro, vai pagar pelo
            PayPal, que processa o pagamento segundo a sua própria{" "}
            <a href="https://www.paypal.com/myaccount/privacy/privacyhub" className="font-bold text-crayon-blue">
              declaração de privacidade
            </a>
            . Nunca recebemos nem guardamos os dados do seu cartão ou do seu banco. Do PayPal,
            guardamos só o necessário para administrar a sua assinatura: o identificador dela no
            PayPal, o seu plano, a situação da assinatura e as datas do último pagamento, da próxima
            renovação e de um eventual cancelamento, além de um registro dos avisos do PayPal sobre
            ela (um identificador, o tipo e a data). Usamos esses dados para liberar o Pro, mostrar a
            sua assinatura na sua conta e cuidar de cancelamentos e reembolsos.
          </p>
          <p className="mt-2">
            <strong>Dados técnicos.</strong> Os nossos servidores e o nosso provedor de hospedagem
            registram automaticamente dados técnicos comuns, como o endereço IP e o horário das
            solicitações. Usamos esses dados para a segurança, para evitar abusos (por exemplo,
            limitar as tentativas de login e de cadastro) e para diagnosticar problemas.
          </p>
        </section>

        <section>
          <h2 className="font-display font-bold text-xl">Como usamos as informações</h2>
          <p className="mt-2">
            Usamos essas informações para: criar a sua conta e confirmar a sua identidade; fazer
            funcionar as lições, as atividades e os jogos que você e a sua criança usam; mostrar o
            progresso na sua conta; administrar as assinaturas; manter o serviço seguro e evitar
            abusos; e entrar em contato sobre a sua conta (por exemplo, sobre cobrança ou
            segurança).
          </p>
          <p className="mt-2">
            Pela LGPD, as bases legais desses usos são a execução do contrato (a sua conta e a
            assinatura), o consentimento (os cookies opcionais e os dados da criança, dado pelo
            responsável), o cumprimento de obrigações legais e o nosso legítimo interesse em manter
            o serviço seguro.
          </p>
          <p className="mt-2">
            Quando o Google AdSense aprovar o nosso pedido, também planejamos usar informações de
            navegação limitadas, não ligadas à sua conta, para mostrar publicidade, como explicado
            na seção de cookies abaixo.
          </p>
        </section>

        <section>
          <h2 className="font-display font-bold text-xl">Cookies e tecnologias parecidas</h2>
          <p className="mt-2">
            <strong>Cookies necessários.</strong> Um cookie de sessão mantém você conectado com
            segurança. Ele é necessário para o site funcionar e não pode ser desativado.
          </p>
          <p className="mt-2">
            <strong>Preferência de idioma.</strong> Se você escolher um idioma com os botões EN /
            FR / ES / PT, guardamos essa escolha em um cookie por um ano.
          </p>
          <p className="mt-2">
            <strong>Cookies de medição de audiência.</strong> Se você aceitar, podemos usar
            ferramentas de medição (como o Google Analytics) para entender como o site é usado,
            melhorar as lições e corrigir problemas. Eles só são instalados depois do seu
            consentimento.
          </p>
          <p className="mt-2">
            <strong>Cookies de publicidade.</strong> O AlphaBes planeja mostrar publicidade com o
            Google AdSense quando o pedido for aprovado. O Google e os seus parceiros poderão então
            instalar cookies para mostrar anúncios. Saiba mais e recuse a publicidade
            personalizada em{" "}
            <a
              href="https://policies.google.com/technologies/partner-sites?hl=pt-BR"
              className="font-bold text-crayon-blue"
            >
              policies.google.com/technologies/partner-sites
            </a>{" "}
            e nas{" "}
            <a href="https://adssettings.google.com/?hl=pt-BR" className="font-bold text-crayon-blue">
              configurações de anúncios do Google
            </a>
            . Como este site é dirigido em parte a crianças, planejamos configurar o AdSense para
            mostrar apenas anúncios contextuais, não personalizados, como exigem as regras do Google
            para conteúdo dirigido a crianças.
          </p>
          <p className="mt-2">
            Para mais detalhes, veja a nossa{" "}
            <Link href="/cookies" className="font-bold text-crayon-blue">
              política de cookies
            </Link>
            . Você também pode controlar ou apagar os cookies a qualquer momento nas configurações
            do seu navegador.
          </p>
        </section>

        <section>
          <h2 className="font-display font-bold text-xl">Os provedores que usamos</h2>
          <p className="mt-2">
            Trabalhamos com os seguintes tipos de provedores, cada um com a sua própria política de
            privacidade. Alguns guardam ou processam dados fora do Brasil; nesses casos, a
            transferência segue as regras da LGPD para transferência internacional de dados.
          </p>
          <ul className="mt-2 list-disc pl-6 space-y-1">
            <li>
              <strong>Banco de dados</strong>: o nosso banco de dados Postgres (Neon), onde ficam as
              contas, os perfis das crianças e o progresso.
            </li>
            <li>
              <strong>Hospedagem do site</strong>: Cloudflare, que serve o site e processa as
              solicitações.
            </li>
            <li>
              <strong>Autenticação</strong>: NextAuth, para gerenciar as sessões com segurança.
            </li>
            <li>
              <strong>Pagamentos</strong>: o PayPal (veja “Assinatura e pagamento” acima), só para
              as famílias que assinam o AlphaBes Pro.
            </li>
            <li>
              <strong>Publicidade</strong>: Google AdSense, quando o nosso pedido for aprovado.
            </li>
            <li>
              <strong>Medição de audiência</strong>: uma ferramenta como o Google Analytics, só se
              você aceitar os cookies de medição.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="font-display font-bold text-xl">A privacidade das crianças</h2>
          <p className="mt-2">
            O AlphaBes é dirigido em parte a crianças. Por isso, cuidamos de forma especial dos
            dados delas, de acordo com a Lei Geral de Proteção de Dados (LGPD, Lei 13.709/2018), em
            especial o artigo 14, que exige o consentimento específico de pelo menos um dos pais ou
            do responsável legal e o tratamento no melhor interesse da criança, além do Estatuto da
            Criança e do Adolescente (ECA), do RGPD europeu, da lei marroquina 09-08 e das normas
            equivalentes de outros países.
          </p>
          <p className="mt-2">
            Só uma mãe, um pai, um responsável ou um professor pode criar uma conta no AlphaBes,
            confirmando que é maior de idade: uma criança não pode criar a própria conta. Criar um
            perfil de criança na conta da família vale como o consentimento da mãe, do pai ou do
            responsável para que a criança use o serviço.
          </p>
          <p className="mt-2">
            Para um perfil de criança coletamos apenas um nome e uma faixa de idade: nunca um
            e-mail, uma localização precisa, uma foto ou qualquer outro dado de contato diretamente
            da criança. As crianças não podem criar contas, falar com outros usuários nem fazer
            compras.
          </p>
          <p className="mt-2">
            Uma mãe, um pai ou um responsável pode consultar, corrigir ou pedir a exclusão do
            perfil da sua criança a qualquer momento (veja “Os seus direitos” abaixo).
          </p>
        </section>

        <section>
          <h2 className="font-display font-bold text-xl">Por quanto tempo guardamos os dados</h2>
          <p className="mt-2">
            Guardamos os dados da conta e dos perfis das crianças enquanto a sua conta estiver
            ativa, para que as lições e o progresso continuem disponíveis. Se você excluir a sua
            conta, apagamos ou anonimizamos esses dados em um prazo razoável, exceto os dados
            limitados que precisamos guardar para cumprir obrigações legais, fiscais ou de segurança
            (por exemplo, os dados básicos de cobrança).
          </p>
        </section>

        <section>
          <h2 className="font-display font-bold text-xl">Os seus direitos</h2>
          <p className="mt-2">
            Pela LGPD (artigo 18) e, conforme o país onde você mora, por outras leis, você pode
            pedir a confirmação de que tratamos os seus dados e o acesso a eles e aos do perfil da
            sua criança, a correção, a anonimização, o bloqueio ou a eliminação de dados, a
            portabilidade, informações sobre com quem compartilhamos os dados, e revogar a qualquer
            momento o seu consentimento, inclusive para os cookies opcionais. Você pode:
          </p>
          <ul className="mt-2 list-disc pl-6 space-y-1">
            <li>Consultar e alterar os dados da sua conta nas configurações.</li>
            <li>Pedir uma cópia dos seus dados, ou a exclusão da sua conta e dos perfis das crianças, escrevendo para nós (veja abaixo).</li>
            <li>Gerenciar ou retirar o seu consentimento aos cookies nas configurações do navegador e, quando disponíveis, com as nossas ferramentas de cookies.</li>
          </ul>
          <p className="mt-2">
            Respondemos às solicitações verificadas em um prazo razoável. Você também pode
            apresentar uma reclamação à autoridade de proteção de dados do seu país (por exemplo, a
            ANPD no Brasil, a CNPD em Portugal ou a CNDP no Marrocos).
          </p>
        </section>

        <section>
          <h2 className="font-display font-bold text-xl">Segurança dos dados</h2>
          <p className="mt-2">
            Usamos medidas de segurança reconhecidas para proteger as suas informações, como
            conexões criptografadas e uma criptografia segura das senhas. Nenhum método de
            armazenamento ou de transmissão é perfeitamente seguro, mas cuidamos das suas
            informações de forma adequada aos dados que guardamos.
          </p>
        </section>

        <section>
          <h2 className="font-display font-bold text-xl">Mudanças nesta política</h2>
          <p className="mt-2">
            Esta política pode mudar junto com o AlphaBes, por exemplo quando o nosso pedido ao
            AdSense for aprovado. Nesse caso,
            atualizaremos a data de “última atualização” acima; convidamos você a rever esta página
            de vez em quando.
          </p>
        </section>

        <section>
          <h2 className="font-display font-bold text-xl">Contato e encarregado de dados</h2>
          <p className="mt-2">
            Se você tiver alguma pergunta sobre esta política ou algum pedido sobre os seus dados,
            escreva para o nosso encarregado pelo tratamento de dados pessoais pela nossa{" "}
            <Link href="/contact" className="font-bold text-crayon-blue">
              página de contato
            </Link>
            .
          </p>
        </section>
      </div>

      <p className="mt-10 text-sm text-chalkboard/50 border-t border-chalkboard/10 pt-4">
        Texto provisório: como o AlphaBes é dirigido a crianças e processa pagamentos, um advogado
        que conheça a LGPD (em especial o artigo 14 e as orientações da ANPD sobre dados de crianças
        e o encarregado), o RGPD europeu, a lei marroquina 09-08 e as regras do Google AdSense para
        conteúdo dirigido a crianças deve revisar esta página antes do lançamento.
      </p>
    </main>
  );
}
