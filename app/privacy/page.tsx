import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  alternates: { canonical: "https://alphabes.com/privacy" },
};

export default function PrivacyPage() {
  return (
    <main id="main-content" className="mx-auto max-w-2xl px-6 py-12">
      <h1 className="text-4xl font-extrabold">Privacy Policy</h1>
      <p className="mt-2 text-sm text-chalkboard/50">Last updated: [date]</p>

      <div className="mt-8 space-y-6 text-chalkboard/80 leading-relaxed">
        <section>
          <h2 className="font-display font-bold text-xl">Our approach to children&apos;s privacy</h2>
          <p className="mt-2">
            AlphaBes is built for children ages 3-8, and we collect only what is necessary to
            deliver lessons and track progress. Child profiles store a first name and an age
            range only — never a photo, address, phone number, or other contact information for
            the child.
          </p>
        </section>
        <section>
          <h2 className="font-display font-bold text-xl">Information we collect from parents</h2>
          <p className="mt-2">
            When a parent creates an account, we collect an email address, name, and a securely
            hashed password. If a parent subscribes to AlphaBes Pro, payment is processed by
            Stripe; we do not store full card numbers on our servers.
          </p>
        </section>
        <section>
          <h2 className="font-display font-bold text-xl">How we use information</h2>
          <p className="mt-2">
            We use account information to operate the service: authenticating logins, tracking a
            child&apos;s lesson progress for the parent dashboard, and managing subscriptions.
          </p>
        </section>
        <section>
          <h2 className="font-display font-bold text-xl">Cookies</h2>
          <p className="mt-2">
            We use cookies for authentication sessions and, where consented to, analytics. See our{" "}
            <a href="/cookies" className="font-bold text-crayon-blue">Cookie Policy</a> for details.
          </p>
        </section>
        <section>
          <h2 className="font-display font-bold text-xl">Contact</h2>
          <p className="mt-2">
            Questions about this policy can be sent through our{" "}
            <a href="/contact" className="font-bold text-crayon-blue">Contact page</a>.
          </p>
        </section>
      </div>

      <p className="mt-10 text-sm text-chalkboard/50 border-t border-chalkboard/10 pt-4">
        Placeholder policy — because AlphaBes is directed at children, this page should be
        reviewed by a lawyer familiar with COPPA (US), PIPEDA (Canada), and UK GDPR/ICO
        children&apos;s code requirements before launch.
      </p>
    </main>
  );
}
