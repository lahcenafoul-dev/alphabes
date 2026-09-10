import type { Metadata } from "next";
import CookiePreferencesButton from "@/components/CookiePreferencesButton";

export const metadata: Metadata = {
  title: "Cookie Policy",
  alternates: { canonical: "https://alphabes.com/cookies" },
};

export default function CookiesPage() {
  return (
    <main id="main-content" className="mx-auto max-w-2xl px-6 py-12">
      <h1 className="text-4xl font-extrabold">Cookie Policy</h1>
      <p className="mt-2 text-sm text-chalkboard/50">Last updated: September 9, 2026</p>

      <div className="mt-8 space-y-6 text-chalkboard/80 leading-relaxed">
        <section>
          <h2 className="font-display font-bold text-xl">Essential cookies</h2>
          <p className="mt-2">
            We use a session cookie to keep parents logged in securely. This cookie is required
            for the site to function and cannot be turned off.
          </p>
        </section>
        <section>
          <h2 className="font-display font-bold text-xl">Analytics cookies</h2>
          <p className="mt-2">
            With consent, we use Google Analytics to understand how the site is used, so we can
            improve lessons and fix problems. These cookies are optional and only load after
            consent, in line with UK PECR and similar regional rules.
          </p>
        </section>
        <section>
          <h2 className="font-display font-bold text-xl">Managing cookies</h2>
          <p className="mt-2">
            You can control or delete cookies through your browser settings at any time. Blocking
            essential cookies may prevent you from staying logged in. If you've already made a
            choice about analytics cookies, you can revisit it below.
          </p>
          <CookiePreferencesButton />
        </section>
      </div>

      <p className="mt-10 text-sm text-chalkboard/50 border-t border-chalkboard/10 pt-4">
        Placeholder policy — recommend legal review before launch, particularly around UK PECR and
        similar regional consent rules given this site's audience.
      </p>
    </main>
  );
}
