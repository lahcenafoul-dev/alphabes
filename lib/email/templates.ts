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

export type WelcomeToPro = {
  name: string | null;
  plan: "PRO_MONTHLY" | "PRO_ANNUAL";
  renewsOn: Date | null;
  dashboardUrl: string;
  downloadsUrl: string;
};

// Once, when a PayPal subscription becomes active (lib/billing/welcome.ts).
export function welcomeToProEmail(locale: Locale, w: WelcomeToPro): { subject: string; text: string } {
  const date = w.renewsOn ? formatDate(locale, w.renewsOn) : null;
  const name = w.name?.trim().replace(/[\r\n]+/g, " ") || null;
  const yearly = w.plan === "PRO_ANNUAL";
  switch (locale) {
    case "fr":
      return {
        subject: "Bienvenue dans AlphaBes Pro !",
        text: [
          name ? `Bonjour ${name},` : "Bonjour,",
          `Merci ! Votre abonnement AlphaBes Pro ${yearly ? "annuel" : "mensuel"} est actif. Vous avez maintenant accès aux jeux Pro et aux packs de fiches complets en PDF.`,
          `Les packs de fiches à télécharger : ${w.downloadsUrl}`,
          `Votre tableau de bord, pour voir votre abonnement${date ? ` (prochain renouvellement le ${date})` : ""} ou le résilier à tout moment : ${w.dashboardUrl}`,
          "PayPal vous envoie de son côté le reçu de chaque paiement.",
          "Bon apprentissage avec AlphaBes !\nL'équipe AlphaBes",
        ].join("\n\n"),
      };
    case "es":
      return {
        subject: "¡Te damos la bienvenida a AlphaBes Pro!",
        text: [
          name ? `Hola, ${name}:` : "Hola:",
          `¡Gracias! Tu plan ${yearly ? "anual" : "mensual"} de AlphaBes Pro ya está activo. Ahora puedes usar los juegos Pro y descargar los paquetes completos de fichas en PDF.`,
          `Los paquetes de fichas para descargar: ${w.downloadsUrl}`,
          `Tu cuenta, para ver tu suscripción${date ? ` (se renueva el ${date})` : ""} o cancelarla cuando quieras: ${w.dashboardUrl}`,
          "PayPal te envía aparte el recibo de cada pago.",
          "¡Que disfruten aprendiendo con AlphaBes!\nEl equipo de AlphaBes",
        ].join("\n\n"),
      };
    case "pt":
      return {
        subject: "Boas-vindas ao AlphaBes Pro!",
        text: [
          name ? `Olá, ${name}!` : "Olá!",
          `Obrigado! A sua assinatura ${yearly ? "anual" : "mensal"} do AlphaBes Pro está ativa. Agora você tem acesso aos jogos Pro e aos pacotes completos de atividades em PDF.`,
          `Os pacotes de atividades para baixar: ${w.downloadsUrl}`,
          `A sua conta, para ver a assinatura${date ? ` (renovação em ${date})` : ""} ou cancelar quando quiser: ${w.dashboardUrl}`,
          "O PayPal envia separadamente o recibo de cada pagamento.",
          "Bons estudos com o AlphaBes!\nEquipe AlphaBes",
        ].join("\n\n"),
      };
    default:
      return {
        subject: "Welcome to AlphaBes Pro!",
        text: [
          name ? `Hello ${name},` : "Hello,",
          `Thank you! Your AlphaBes Pro ${yearly ? "yearly" : "monthly"} subscription is active. You now have the Pro games and the complete worksheet bundles as PDFs.`,
          `Download the worksheet bundles: ${w.downloadsUrl}`,
          `Your dashboard, to see your subscription${date ? ` (next renewal on ${date})` : ""} or cancel it at any time: ${w.dashboardUrl}`,
          "PayPal sends you a receipt for each payment separately.",
          "Happy learning with AlphaBes!\nThe AlphaBes team",
        ].join("\n\n"),
      };
  }
}

export type DuplicateAlert = {
  sandbox: boolean;
  parentEmail: string;
  userId: string;
  duplicateSubscriptionId: string;
  keptSubscriptionId: string | null;
  payment: { id: string; amount: string | null; time: string } | null;
};

// To the owner (CONTACT_TO_EMAIL), in English: a second subscription was
// canceled automatically and its payment needs a refund
// (lib/billing/duplicate.ts).
export function duplicateAlertEmail(d: DuplicateAlert): { subject: string; text: string } {
  const prefix = d.sandbox ? "[sandbox] " : "";
  return {
    subject: `${prefix}AlphaBes: refund a duplicate subscription payment (${d.parentEmail.replace(/[\r\n]+/g, " ")})`,
    text: [
      `A parent paid for a second AlphaBes Pro subscription while the first one was active (two checkouts at once). AlphaBes canceled the second one at PayPal automatically. Please refund its payment in full; the parent keeps Pro through the first subscription.`,
      [
        `Parent: ${d.parentEmail} (account ${d.userId})`,
        d.payment
          ? `Payment to refund: ${d.payment.id}${d.payment.amount ? `, ${d.payment.amount}` : ""}, ${d.payment.time}`
          : `Payment to refund: not listed by PayPal yet; search PayPal Activity for subscription ${d.duplicateSubscriptionId}`,
        `Duplicate subscription (canceled): ${d.duplicateSubscriptionId}`,
        `Subscription the parent keeps: ${d.keptSubscriptionId ?? "unknown"}`,
      ].join("\n"),
      `To refund: PayPal${d.sandbox ? " sandbox" : ""} → Activity → search for the payment ID → Issue a refund (full amount). Refunding it does not affect the parent's Pro access.`,
    ].join("\n\n"),
  };
}
