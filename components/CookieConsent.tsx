"use client";

// Gates Google Analytics behind an explicit accept/decline choice, matching
// the commitment already made in /cookies and /privacy-policy ("analytics
// cookies... only load after consent"). The decision is read from
// localStorage only after mount (never during the server render) so there
// is nothing for the client to hydration-mismatch against -- the same
// pattern used for the games' random starting state earlier this session.
import { useEffect, useState } from "react";
import Script from "next/script";

const GA_ID = "G-Z06LXRGHBR";
export const CONSENT_STORAGE_KEY = "alphabes-cookie-consent";

type Consent = "accepted" | "declined" | null;

export default function CookieConsent() {
  const [mounted, setMounted] = useState(false);
  const [consent, setConsent] = useState<Consent>(null);

  useEffect(() => {
    setMounted(true);
    try {
      const stored = localStorage.getItem(CONSENT_STORAGE_KEY);
      if (stored === "accepted" || stored === "declined") setConsent(stored);
    } catch {
      // localStorage unavailable (private browsing, blocked storage) -- just
      // show the banner every visit rather than failing.
    }
  }, []);

  function choose(value: "accepted" | "declined") {
    setConsent(value);
    try {
      localStorage.setItem(CONSENT_STORAGE_KEY, value);
    } catch {
      // Non-fatal if storage can't persist the choice.
    }
  }

  return (
    <>
      {consent === "accepted" && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
          <Script id="ga4-init" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_ID}');
            `}
          </Script>
        </>
      )}

      {mounted && consent === null && (
        <div
          role="region"
          aria-label="Cookie consent"
          className="fixed inset-x-0 bottom-0 z-50 bg-chalkboard text-paper print:hidden"
        >
          <div className="mx-auto max-w-4xl px-6 py-4 flex flex-wrap items-center justify-between gap-4">
            <p className="text-sm text-paper/90 max-w-2xl">
              We use optional analytics cookies to understand how AlphaBes is used. See our{" "}
              <a href="/cookies" className="underline font-bold">
                Cookie Policy
              </a>
              .
            </p>
            <div className="flex gap-3 shrink-0">
              <button
                type="button"
                onClick={() => choose("declined")}
                className="rounded-block border border-paper/30 px-4 py-2 text-sm font-display font-bold hover:border-paper transition"
              >
                Decline
              </button>
              <button
                type="button"
                onClick={() => choose("accepted")}
                className="rounded-block bg-crayon-green text-paper px-4 py-2 text-sm font-display font-bold shadow-block hover:shadow-blockHover transition"
              >
                Accept
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
