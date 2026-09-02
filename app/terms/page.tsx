import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  alternates: { canonical: "https://alphabes.com/terms" },
};

export default function TermsPage() {
  return (
    <main id="main-content" className="mx-auto max-w-2xl px-6 py-12">
      <h1 className="text-4xl font-extrabold">Terms of Service</h1>
      <p className="mt-2 text-sm text-chalkboard/50">Last updated: [date]</p>

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
          <h2 className="font-display font-bold text-xl">Subscriptions and billing</h2>
          <p className="mt-2">
            AlphaBes Pro is billed monthly ($7.99) or annually ($59) through Stripe. Subscriptions
            renew automatically until canceled from your account settings.
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
      </div>

      <p className="mt-10 text-sm text-chalkboard/50 border-t border-chalkboard/10 pt-4">
        Placeholder terms — recommend legal review before launch, particularly around
        subscription billing terms and consumer protection rules in the US, Canada, and UK.
      </p>
    </main>
  );
}
