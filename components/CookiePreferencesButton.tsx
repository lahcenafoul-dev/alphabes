"use client";

import { CONSENT_STORAGE_KEY } from "./CookieConsent";

export default function CookiePreferencesButton() {
  function resetConsent() {
    try {
      localStorage.removeItem(CONSENT_STORAGE_KEY);
    } catch {
      // Non-fatal if storage is unavailable.
    }
    window.location.reload();
  }

  return (
    <button
      type="button"
      onClick={resetConsent}
      className="mt-3 rounded-block border border-chalkboard/20 px-4 py-2 text-sm font-display font-bold hover:border-crayon-blue transition"
    >
      Manage cookie preferences
    </button>
  );
}
