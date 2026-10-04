import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { alternatesFor } from "@/lib/i18n/routes";

export const refundsMetadataEn: Metadata = {
  title: "Refund Policy",
  description: "How canceling and refunds work for AlphaBes Pro, billed through PayPal.",
  alternates: alternatesFor("en", "/refunds"),
};

export default function RefundsEn() {
  return (
    <main id="main-content" className="mx-auto max-w-2xl px-6 py-12">
      <h1 className="text-4xl font-extrabold">Refund Policy</h1>
      <p className="mt-2 text-sm text-chalkboard/50">Last updated: October 4, 2026</p>

      <div className="mt-8 space-y-6 text-chalkboard/80 leading-relaxed">
        <section>
          <h2 className="font-display font-bold text-xl">Canceling</h2>
          <p className="mt-2">
            You can cancel AlphaBes Pro at any time, from your{" "}
            <Link href="/dashboard" className="font-bold text-crayon-blue">
              dashboard
            </Link>{" "}
            (&quot;Cancel subscription&quot;) or in your PayPal account under automatic payments.
            You won&apos;t be charged again, and you keep Pro until the end of the month or year
            you&apos;ve already paid for.
          </p>
        </section>

        <section>
          <h2 className="font-display font-bold text-xl">Monthly plan</h2>
          <p className="mt-2">
            Monthly payments ($7.99) are not refunded, including for a month you&apos;ve only
            partly used. To avoid the next payment, cancel before your renewal date, shown on your
            dashboard.
          </p>
        </section>

        <section>
          <h2 className="font-display font-bold text-xl">Yearly plan</h2>
          <p className="mt-2">
            We refund a yearly payment ($59) in full when you ask within 14 days of it, whether
            it&apos;s your first yearly payment or a renewal. About 7 days before each yearly
            renewal, we email you a reminder with the date and the amount, so you can cancel first
            if you prefer. After 14 days, the payment is not refunded, but you can still cancel so
            the plan doesn&apos;t renew.
          </p>
        </section>

        <section>
          <h2 className="font-display font-bold text-xl">How to ask for a refund</h2>
          <p className="mt-2">
            Write to us through the{" "}
            <Link href="/contact" className="font-bold text-crayon-blue">
              contact page
            </Link>{" "}
            with the email address of your AlphaBes account. We refund through PayPal, to the
            account or card you paid with; PayPal usually shows it within a few business days.
            When a payment is refunded, the subscription is canceled and Pro ends at once.
          </p>
          <p className="mt-2">
            If something went wrong with a payment, please contact us before opening a dispute
            with PayPal: we can usually sort it out faster.
          </p>
        </section>

        <section>
          <h2 className="font-display font-bold text-xl">Your rights</h2>
          <p className="mt-2">
            This policy doesn&apos;t limit any right you have under the consumer law of your
            country. Prices are in US dollars; if PayPal converts the amount into your currency,
            its conversion rate and any fee are set by PayPal.
          </p>
        </section>
      </div>

      <p className="mt-10 text-sm text-chalkboard/50 border-t border-chalkboard/10 pt-4">
        Placeholder policy — recommend legal review before launch, particularly around consumer
        protection and cancellation rules in the US, Canada, the UK, and the EU.
      </p>
    </main>
  );
}
