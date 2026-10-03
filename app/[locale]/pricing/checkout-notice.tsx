"use client";

import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";

// Message after coming back to the pricing page from the subscribe route or
// PayPal (?billing=canceled|soon|error|invalid_plan). Read in the browser so
// the page itself stays static.
export default function CheckoutNotice() {
  const t = useTranslations("Checkout");
  const billing = useSearchParams().get("billing");
  const key =
    billing === "canceled" ? "canceled" : billing === "soon" ? "soon" : billing === "error" || billing === "invalid_plan" ? "error" : null;
  if (!key) return null;
  return (
    <p role="status" className="mt-6 mx-auto max-w-2xl rounded-block bg-crayon-yellow/30 border border-crayon-yellow px-5 py-3 text-center font-bold">
      {t(key)}
    </p>
  );
}
