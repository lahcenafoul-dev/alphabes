import type { Locale } from "@/i18n/routing";

// Emails written per language (like the long-form pages), for parents.

const DATE_LOCALE: Record<Locale, string> = { en: "en-US", fr: "fr-FR", es: "es-MX", pt: "pt-BR" };

export function formatDate(locale: Locale, date: Date): string {
  return new Intl.DateTimeFormat(DATE_LOCALE[locale], { dateStyle: "long", timeZone: "UTC" }).format(date);
}

export type RenewalReminder = {
  name: string | null;
  renewsOn: Date;
  dashboardUrl: string;
  refundsUrl: string;
};

// About 7 days before a yearly renewal (lib/billing/reminders.ts).
export function renewalReminderEmail(locale: Locale, r: RenewalReminder): { subject: string; text: string } {
  const date = formatDate(locale, r.renewsOn);
  const name = r.name?.trim().replace(/[\r\n]+/g, " ") || null;
  switch (locale) {
    case "fr":
      return {
        subject: `Votre abonnement annuel AlphaBes Pro se renouvelle le ${date}`,
        text: [
          name ? `Bonjour ${name},` : "Bonjour,",
          `Petit rappel : votre abonnement annuel AlphaBes Pro se renouvelle le ${date}. PayPal prélèvera 59 $ US (dollars américains) sur le moyen de paiement que vous avez choisi.`,
          `Vous n'avez rien à faire pour garder Pro. Si vous ne souhaitez pas le renouveler, résiliez avant le ${date} depuis votre tableau de bord : ${r.dashboardUrl} (ou dans votre compte PayPal, rubrique des paiements automatiques). Vous garderez Pro jusqu'à la fin de l'année déjà payée.`,
          `Si l'abonnement est renouvelé et que vous changez d'avis, vous pouvez demander un remboursement complet dans les 14 jours qui suivent le paiement : ${r.refundsUrl}`,
          "Merci d'apprendre avec AlphaBes !\nL'équipe AlphaBes",
        ].join("\n\n"),
      };
    case "es":
      return {
        subject: `Tu plan anual de AlphaBes Pro se renueva el ${date}`,
        text: [
          name ? `Hola, ${name}:` : "Hola:",
          `Te recordamos que tu suscripción anual a AlphaBes Pro se renueva el ${date}. PayPal cobrará US$59 (dólares estadounidenses) al medio de pago que elegiste.`,
          `No tienes que hacer nada para conservar Pro. Si prefieres no renovarla, cancélala antes del ${date} desde tu cuenta: ${r.dashboardUrl} (o en tu cuenta de PayPal, en la sección de pagos automáticos). Conservarás Pro hasta el final del año que ya pagaste.`,
          `Si se renueva y cambias de opinión, puedes pedir el reembolso completo dentro de los 14 días siguientes al pago: ${r.refundsUrl}`,
          "¡Gracias por aprender con AlphaBes!\nEl equipo de AlphaBes",
        ].join("\n\n"),
      };
    case "pt":
      return {
        subject: `Seu plano anual do AlphaBes Pro será renovado em ${date}`,
        text: [
          name ? `Olá, ${name}!` : "Olá!",
          `Este é um lembrete de que a sua assinatura anual do AlphaBes Pro será renovada em ${date}. O PayPal vai cobrar US$ 59 (dólares americanos) na forma de pagamento que você escolheu.`,
          `Você não precisa fazer nada para continuar com o Pro. Se preferir não renovar, cancele antes de ${date} na sua conta: ${r.dashboardUrl} (ou na sua conta do PayPal, em pagamentos automáticos). Você continua com o Pro até o fim do ano que já pagou.`,
          `Se a assinatura for renovada e você mudar de ideia, pode pedir o reembolso total em até 14 dias depois do pagamento: ${r.refundsUrl}`,
          "Bons estudos com o AlphaBes!\nEquipe AlphaBes",
        ].join("\n\n"),
      };
    default:
      return {
        subject: `Your AlphaBes Pro yearly plan renews on ${date}`,
        text: [
          name ? `Hello ${name},` : "Hello,",
          `This is a reminder that your AlphaBes Pro yearly subscription renews on ${date}. PayPal will charge $59 (US dollars) to the payment method you chose.`,
          `You don't need to do anything to keep Pro. If you'd rather not renew, cancel before ${date} from your dashboard: ${r.dashboardUrl} (or in your PayPal account, under automatic payments). You'll keep Pro until the end of the year you've already paid for.`,
          `If it renews and you change your mind, you can ask for a full refund within 14 days of the payment: ${r.refundsUrl}`,
          "Thank you for learning with AlphaBes!\nThe AlphaBes team",
        ].join("\n\n"),
      };
  }
}
