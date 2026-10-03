import type { Metadata } from "next";
import { alternatesFor } from "@/lib/i18n/routes";
import CookiePreferencesButton from "@/components/CookiePreferencesButton";

export const cookiesMetadataPt: Metadata = {
  title: "Política de cookies",
  description: "Os cookies que o AlphaBes usa e como gerenciar as suas preferências.",
  alternates: alternatesFor("pt", "/cookies"),
};

export default function CookiesPt() {
  return (
    <main id="main-content" className="mx-auto max-w-2xl px-6 py-12">
      <h1 className="text-4xl font-extrabold">Política de cookies</h1>
      <p className="mt-2 text-sm text-chalkboard/50">Última atualização: 3 de outubro de 2026</p>

      <div className="mt-8 space-y-6 text-chalkboard/80 leading-relaxed">
        <section>
          <h2 className="font-display font-bold text-xl">Cookies necessários</h2>
          <p className="mt-2">
            Usamos um cookie de sessão para que as famílias continuem conectadas com segurança. Esse
            cookie é necessário para o site funcionar e não pode ser desativado.
          </p>
        </section>
        <section>
          <h2 className="font-display font-bold text-xl">Cookies de medição de audiência</h2>
          <p className="mt-2">
            Se você aceitar, usamos o Google Analytics para entender como o site é usado, melhorar
            as lições e corrigir problemas. Esses cookies são opcionais e só são instalados depois do
            seu consentimento, de acordo com a LGPD, o RGPD europeu e as normas equivalentes de
            outros países.
          </p>
        </section>
        <section>
          <h2 className="font-display font-bold text-xl">Preferência de idioma</h2>
          <p className="mt-2">
            Se você trocar de idioma com os botões EN / FR / ES / PT, guardamos a sua escolha em um
            cookie (NEXT_LOCALE) por um ano, para que o site abra no seu idioma da próxima vez. Ele só
            é instalado quando você faz essa escolha e contém apenas o código do idioma.
          </p>
        </section>
        <section>
          <h2 className="font-display font-bold text-xl">Gerenciar os cookies</h2>
          <p className="mt-2">
            Você pode controlar ou apagar os cookies a qualquer momento nas configurações do seu
            navegador. Se bloquear os cookies necessários, talvez não consiga continuar conectado. Se
            já escolheu uma opção para os cookies de medição de audiência, pode mudá-la aqui embaixo.
          </p>
          <CookiePreferencesButton />
        </section>
      </div>

      <p className="mt-10 text-sm text-chalkboard/50 border-t border-chalkboard/10 pt-4">
        Texto provisório: recomendamos que um advogado o revise antes do lançamento, em especial
        segundo a Lei Geral de Proteção de Dados brasileira (LGPD, Lei 13.709/2018), o RGPD europeu
        e a lei marroquina 09-08.
      </p>
    </main>
  );
}
