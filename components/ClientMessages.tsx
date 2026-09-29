import { getMessages } from "next-intl/server";
import { TIME_ZONE } from "@/i18n/request";
import type { Locale } from "@/i18n/routing";
import type messages from "@/messages/en.json";
import IntlClientProvider from "./IntlClientProvider";

type Namespace = keyof typeof messages;

// Hands a client component only the message namespaces it uses, so pages
// don't all ship every form's strings. A nested provider replaces the
// messages of the outer one, so list everything the subtree needs.
export default async function ClientMessages({
  locale,
  namespaces,
  children,
}: {
  locale: Locale;
  namespaces: readonly Namespace[];
  children: React.ReactNode;
}) {
  const all = await getMessages({ locale });
  const picked = Object.fromEntries(namespaces.map((ns) => [ns, all[ns]]));
  return (
    <IntlClientProvider locale={locale} messages={picked} timeZone={TIME_ZONE}>
      {children}
    </IntlClientProvider>
  );
}
