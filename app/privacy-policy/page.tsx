import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  alternates: { canonical: "https://alphabes.com/privacy-policy" },
};

export default function PrivacyPolicyPage() {
  return (
    <main id="main-content" className="mx-auto max-w-2xl px-6 py-12">
      <h1 className="text-4xl font-extrabold">Privacy Policy</h1>
      <p className="mt-2 text-sm text-chalkboard/50">Last updated: [date]</p>

      <div className="mt-8 space-y-6 text-chalkboard/80 leading-relaxed">
        <section>
          <h2 className="font-display font-bold text-xl">Overview</h2>
          <p className="mt-2">
            AlphaBes (&quot;we,&quot; &quot;us&quot;) provides alphabet, phonics, and reading
            lessons, worksheets, and games for children ages 3-8. This policy explains what
            information we collect, how we use it, and the choices you have. AlphaBes accounts are
            created and managed by a parent, guardian, or teacher — never directly by a child.
          </p>
        </section>

        <section>
          <h2 className="font-display font-bold text-xl">Information we collect</h2>
          <p className="mt-2">
            <strong>Account information.</strong> When a parent, guardian, or teacher creates an
            account, we collect an email address, a name, and a securely hashed password (handled
            through NextAuth). We never store your plain-text password.
          </p>
          <p className="mt-2">
            <strong>Child profile information.</strong> A child profile stores only a first name
            and an age range — never a photo, address, phone number, school, or any other contact
            information for the child. Lesson and worksheet progress is linked to the child profile
            so a parent can see it on their dashboard.
          </p>
          <p className="mt-2">
            <strong>Subscription and billing information.</strong> If you subscribe to AlphaBes
            Pro, payment is handled by our payment provider (currently being finalized; the site
            previously integrated with Stripe). We do not store full card numbers on our servers —
            our payment provider processes and stores that information under its own privacy
            policy.
          </p>
          <p className="mt-2">
            <strong>Technical information.</strong> Our servers and hosting provider automatically
            log standard technical data such as IP address and request timing, used for security,
            abuse prevention (for example, rate-limiting login and signup attempts), and diagnosing
            problems.
          </p>
        </section>

        <section>
          <h2 className="font-display font-bold text-xl">How we use your information</h2>
          <p className="mt-2">
            We use the information above to: create and authenticate your account; operate the
            lessons, worksheets, and games you and your child use; show progress on the parent
            dashboard; process and manage subscriptions; keep the service secure and prevent abuse;
            and communicate with you about your account (for example, billing or security notices).
          </p>
          <p className="mt-2">
            Once Google AdSense is approved for this site, we also intend to use limited, non-account
            browsing information to display advertising, as described in the Cookies section below.
          </p>
        </section>

        <section>
          <h2 className="font-display font-bold text-xl">Cookies and similar technologies</h2>
          <p className="mt-2">
            <strong>Essential cookies.</strong> We use a session cookie to keep you securely logged
            in. This is required for the site to function and cannot be turned off.
          </p>
          <p className="mt-2">
            <strong>Analytics cookies.</strong> With your consent, we may use analytics tools (such
            as Google Analytics) to understand how the site is used so we can improve lessons and
            fix problems. These only load after consent, in line with applicable rules such as the
            UK&apos;s PECR.
          </p>
          <p className="mt-2">
            <strong>Advertising cookies.</strong> AlphaBes intends to display advertising through
            Google AdSense once our application is approved. Once enabled, Google and its partners
            may set cookies on your device to serve ads, including based on your visits to this
            and other websites. You can learn more about how Google uses this information, and opt
            out of personalized advertising, at{" "}
            <a
              href="https://policies.google.com/technologies/partner-sites"
              className="font-bold text-crayon-blue"
            >
              policies.google.com/technologies/partner-sites
            </a>{" "}
            and{" "}
            <a href="https://adssettings.google.com" className="font-bold text-crayon-blue">
              Google Ads Settings
            </a>
            . Because this site is directed in part at children, we intend to configure AdSense to
            serve non-personalized, contextual ads only, consistent with Google&apos;s requirements
            for child-directed content — not ads based on tracking a child&apos;s activity.
          </p>
          <p className="mt-2">
            See our{" "}
            <a href="/cookies" className="font-bold text-crayon-blue">
              Cookie Policy
            </a>{" "}
            for more detail, and use your browser settings to control or delete cookies at any
            time.
          </p>
        </section>

        <section>
          <h2 className="font-display font-bold text-xl">Third-party services we use</h2>
          <p className="mt-2">
            We rely on the following categories of service providers, each governed by its own
            privacy policy:
          </p>
          <ul className="mt-2 list-disc pl-6 space-y-1">
            <li>
              <strong>Database hosting</strong> — our Postgres database, where account, child
              profile, and progress data is stored.
            </li>
            <li>
              <strong>Site hosting and infrastructure</strong> — Netlify, which serves the website
              and processes requests to it.
            </li>
            <li>
              <strong>Authentication</strong> — NextAuth, used to manage secure login sessions.
            </li>
            <li>
              <strong>Payments</strong> — our payment provider (see &quot;Subscription and billing
              information&quot; above), used only for parents/guardians who subscribe to AlphaBes
              Pro.
            </li>
            <li>
              <strong>Advertising</strong> — Google AdSense, once our application is approved.
            </li>
            <li>
              <strong>Analytics</strong> — an analytics provider such as Google Analytics, only if
              and when you consent to analytics cookies.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="font-display font-bold text-xl">Children&apos;s privacy (COPPA)</h2>
          <p className="mt-2">
            AlphaBes is directed in part at children under 13, so we take extra care with
            children&apos;s information under the US Children&apos;s Online Privacy Protection Act
            (COPPA) and similar laws elsewhere.
          </p>
          <p className="mt-2">
            An AlphaBes account can only be created by a parent, guardian, or teacher, who confirms
            they are an adult when signing up — a child cannot create their own account. Creating a
            child profile within a parent&apos;s account is how we obtain the parent&apos;s consent
            for a child to use the service.
          </p>
          <p className="mt-2">
            We collect only a first name and age range for a child profile — never an email
            address, precise location, photo, or any other contact information directly from a
            child. We do not knowingly collect personal information directly from children, and we
            do not allow children to create accounts, communicate with other users, or make
            purchases.
          </p>
          <p className="mt-2">
            A parent or guardian may review, correct, or request deletion of their child&apos;s
            profile information at any time — see &quot;Your rights&quot; below.
          </p>
        </section>

        <section>
          <h2 className="font-display font-bold text-xl">Data retention</h2>
          <p className="mt-2">
            We keep account and child profile information for as long as your account is active,
            so lessons and progress stay available to you. If you delete your account, we delete or
            anonymize your account and child profile data within a reasonable period, except where
            we must keep limited records to comply with legal, tax, or security obligations (for
            example, basic billing records).
          </p>
        </section>

        <section>
          <h2 className="font-display font-bold text-xl">Your rights</h2>
          <p className="mt-2">
            Depending on where you live, you may have rights to access, correct, export, or delete
            your personal information, and your child&apos;s profile information, and to withdraw
            consent for optional cookies (such as analytics or advertising) at any time. You can:
          </p>
          <ul className="mt-2 list-disc pl-6 space-y-1">
            <li>Review and update your account details from your account settings.</li>
            <li>Request a copy of your data, or deletion of your account and child profiles, by contacting us (below).</li>
            <li>Manage or withdraw cookie consent through your browser settings and, where offered, our cookie controls.</li>
          </ul>
          <p className="mt-2">
            We will respond to verified requests within a reasonable timeframe.
          </p>
        </section>

        <section>
          <h2 className="font-display font-bold text-xl">Data security</h2>
          <p className="mt-2">
            We use industry-standard measures to protect your information, including encrypted
            connections and secure password hashing. No method of storage or transmission is
            perfectly secure, but we work to protect your information appropriately for the type of
            data we hold.
          </p>
        </section>

        <section>
          <h2 className="font-display font-bold text-xl">Changes to this policy</h2>
          <p className="mt-2">
            We may update this policy as AlphaBes changes — for example, once our AdSense
            application or payment provider integration is finalized. We&apos;ll update the
            &quot;Last updated&quot; date above when we do, and encourage you to review this page
            periodically.
          </p>
        </section>

        <section>
          <h2 className="font-display font-bold text-xl">Contact us</h2>
          <p className="mt-2">
            Questions about this policy, or requests about your data, can be sent through our{" "}
            <a href="/contact" className="font-bold text-crayon-blue">
              Contact page
            </a>
            .
          </p>
        </section>
      </div>

      <p className="mt-10 text-sm text-chalkboard/50 border-t border-chalkboard/10 pt-4">
        Placeholder policy — because AlphaBes is directed at children and processes payments,
        this page should be reviewed by a lawyer familiar with COPPA (US), PIPEDA (Canada), and
        UK GDPR/ICO children&apos;s code requirements, as well as Google AdSense&apos;s
        child-directed content policies, before launch.
      </p>
    </main>
  );
}
