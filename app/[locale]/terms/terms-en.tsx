import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { alternatesFor } from "@/lib/i18n/routes";

export const termsMetadataEn: Metadata = {
  title: "Terms of Service",
  alternates: alternatesFor("en", "/terms"),
};

export default function TermsEn() {
  return (
    <main id="main-content" className="mx-auto max-w-2xl px-6 py-12">
      <h1 className="text-4xl font-extrabold">Terms of Service</h1>
      <p className="mt-2 text-sm text-chalkboard/50">Last updated: October 5, 2026</p>

      <div className="mt-8 space-y-6 text-chalkboard/80 leading-relaxed">
        <section>
          <h2 className="font-display font-bold text-xl">Who can create an account</h2>
          <p className="mt-2">
            AlphaBes accounts are created and managed by a parent, guardian, or teacher — not
            directly by a child. By creating an account you confirm you are at least 18 years old
            or the age of majority in your jurisdiction.
          </p>
        </section>
        <section>
          <h2 className="font-display font-bold text-xl">Who runs AlphaBes</h2>
          <p className="mt-2">
            AlphaBes is operated by Lahcen Afoullousse, Morocco. You can reach us at{" "}
            <a href="mailto:hello@alphabes.com" className="font-bold text-crayon-blue">
              hello@alphabes.com
            </a>{" "}
            or through the{" "}
            <Link href="/contact" className="font-bold text-crayon-blue">
              contact page
            </Link>
            .
          </p>
          {/* PLACEHOLDER: postal address, to be decided by the owner with a lawyer/accountant (docs/paypal-plan.md). */}
          <p className="mt-2">Postal address: [to be added]</p>
        </section>
        <section>
          <h2 className="font-display font-bold text-xl">AlphaBes Pro</h2>
          <p className="mt-2">
            AlphaBes Pro adds the premium games, whole-bundle PDF downloads and any story marked
            Pro, as described on the{" "}
            <Link href="/pricing" className="font-bold text-crayon-blue">
              pricing page
            </Link>
            . Everything that is free on AlphaBes stays free.
          </p>
        </section>
        <section>
          <h2 className="font-display font-bold text-xl">Subscriptions and billing</h2>
          <p className="mt-2">
            AlphaBes Pro costs $7.99 a month or $59 a year, in US dollars, and is paid through
            PayPal (with a PayPal account or, where PayPal offers it, a card). PayPal handles the
            payment; we never see your card or bank details. If PayPal converts the amount into
            your currency, its rate and any fee are set by PayPal.
          </p>
          <p className="mt-2">
            Your subscription renews automatically at the end of each month or year, and PayPal
            charges the same payment method, until you cancel. You can cancel at any time from
            your dashboard or in your PayPal account: you won&apos;t be charged again, and you keep
            Pro until the end of the period you&apos;ve already paid for.
          </p>
          <p className="mt-2">
            For the yearly plan, we email you a reminder about 7 days before each renewal, with
            the date and the amount.
          </p>
          <p className="mt-2">
            If a renewal payment fails, PayPal tries again; if it still fails, Pro is paused until
            the payment method is updated in PayPal or a new subscription is started.
          </p>
          <p className="mt-2">
            You can ask for a full refund within 14 days of the first payment of a monthly or
            yearly subscription; renewal payments are not refunded. Details are in our{" "}
            <Link href="/refunds" className="font-bold text-crayon-blue">
              Refund Policy
            </Link>
            . If we change the price of Pro, we&apos;ll give subscribers at least 30 days&apos;
            notice before the new price applies to them, so you can cancel first if you prefer.
          </p>
        </section>
        <section>
          <h2 className="font-display font-bold text-xl">Acceptable use</h2>
          <p className="mt-2">
            Worksheets and printable materials are licensed for personal, classroom, or household
            use. Redistributing or reselling AlphaBes content is not permitted.
          </p>
        </section>
        <section>
          <h2 className="font-display font-bold text-xl">Changes to the service</h2>
          <p className="mt-2">
            We may update lessons, worksheets, and features over time. We&apos;ll aim to give
            reasonable notice of any change that materially affects a paid subscription.
          </p>
        </section>
        <section>
          <h2 className="font-display font-bold text-xl">Your privacy</h2>
          <p className="mt-2">
            How we collect and use personal information, including your child&apos;s, is explained
            in our{" "}
            <Link href="/privacy-policy" className="font-bold text-crayon-blue">
              Privacy Policy
            </Link>
            .
          </p>
        </section>
        <section>
          <h2 className="font-display font-bold text-xl">Closing an account</h2>
          <p className="mt-2">
            You can stop using AlphaBes at any time, and ask us to delete your account by writing
            to us. If you have a subscription, cancel it first so it doesn&apos;t renew.
          </p>
          <p className="mt-2">
            We may suspend or close an account that breaks these terms, for example by
            redistributing or reselling our content, misusing the service, or making fraudulent
            payments. If we close an account with an active subscription for any other reason, we
            cancel the subscription and refund the part of the period you&apos;ve paid for and not
            used.
          </p>
        </section>
        <section>
          <h2 className="font-display font-bold text-xl">Limitation of liability</h2>
          <p className="mt-2">
            We work to keep AlphaBes accurate and available, but it is provided &quot;as is&quot;
            and we can&apos;t promise it will always be free of errors or interruptions. To the
            extent the law allows, we are not liable for indirect or consequential losses, and our
            total liability to you is limited to the amount you paid us in the 12 months before
            the claim. Nothing in these terms limits liability that cannot be limited by law, or
            your rights under the consumer law of your country.
          </p>
        </section>
        <section>
          <h2 className="font-display font-bold text-xl">Governing law</h2>
          <p className="mt-2">
            These terms are governed by the law of Morocco, and disputes go to the courts of
            Morocco. If you use AlphaBes as a consumer, you also keep the protection of the
            mandatory consumer law of the country where you live, and you can bring a claim in its
            courts.
          </p>
        </section>
      </div>

      <p className="mt-10 text-sm text-chalkboard/50 border-t border-chalkboard/10 pt-4">
        Placeholder terms — recommend legal review before launch, particularly around
        subscription billing terms and consumer protection rules in the US, Canada, and UK.
      </p>
    </main>
  );
}
