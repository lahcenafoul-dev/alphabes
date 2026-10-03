"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useApiErrorMessage } from "@/lib/i18n/use-api-error";

// "Cancel subscription" with a confirmation step. PayPal stops the payments;
// Pro stays until the end of the paid period (the card shows the date after
// the refresh).
export default function CancelSubscription({ periodEnd }: { periodEnd: string | null }) {
  const router = useRouter();
  const t = useTranslations("Billing");
  const apiError = useApiErrorMessage();
  const [confirming, setConfirming] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function cancel() {
    setError(null);
    setLoading(true);
    const res = await fetch("/api/paypal/cancel", { method: "POST" }).catch(() => null);
    setLoading(false);
    if (!res?.ok) {
      setError(apiError(await res?.json().catch(() => null)));
      return;
    }
    setConfirming(false);
    router.refresh();
  }

  if (!confirming) {
    return (
      <button
        type="button"
        onClick={() => setConfirming(true)}
        className="rounded-block border border-chalkboard/20 px-5 py-2.5 font-display font-bold hover:border-chalkboard/40 transition"
      >
        {t("cancel")}
      </button>
    );
  }

  return (
    <div role="alertdialog" aria-labelledby="cancel-question" className="rounded-block border border-crayon-red/40 p-4 max-w-md">
      <p id="cancel-question">
        {periodEnd ? t("cancelConfirm", { date: new Date(periodEnd) }) : t("cancelConfirmNoDate")}
      </p>
      <div className="mt-3 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={cancel}
          disabled={loading}
          className="rounded-block bg-chalkboard text-paper px-4 py-2 font-display font-bold disabled:opacity-60"
        >
          {loading ? t("canceling") : t("cancelYes")}
        </button>
        <button
          type="button"
          onClick={() => setConfirming(false)}
          disabled={loading}
          autoFocus
          className="rounded-block bg-crayon-yellow px-4 py-2 font-display font-bold"
        >
          {t("cancelNo")}
        </button>
      </div>
      {error && (
        <p role="alert" className="mt-3 text-sm text-crayon-red">
          {error}
        </p>
      )}
    </div>
  );
}
