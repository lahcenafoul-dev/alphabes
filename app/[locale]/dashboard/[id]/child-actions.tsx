"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { localizedPath } from "@/lib/i18n/routes";
import { useApiErrorMessage } from "@/lib/i18n/use-api-error";

type Props = {
  childId: string;
  firstName: string;
  ageBand: string;
};

export default function ChildActions({ childId, firstName, ageBand }: Props) {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("ChildForm");
  const apiError = useApiErrorMessage();
  const [editing, setEditing] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const form = new FormData(e.currentTarget);
    const res = await fetch(`/api/children/${childId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        firstName: form.get("firstName"),
        ageBand: form.get("ageBand"),
      }),
    });

    setLoading(false);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(apiError(data));
      return;
    }

    setEditing(false);
    router.refresh();
  }

  async function handleDelete() {
    setLoading(true);
    setError(null);

    const res = await fetch(`/api/children/${childId}`, { method: "DELETE" });

    setLoading(false);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(apiError(data));
      return;
    }

    router.push(localizedPath(locale, "/dashboard"));
    router.refresh();
  }

  if (!editing) {
    return (
      <div className="mt-4 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => setEditing(true)}
          className="rounded-block bg-crayon-blue text-paper font-display px-5 py-2.5 font-bold"
        >
          {t("edit")}
        </button>

        {!confirmDelete ? (
          <button
            type="button"
            onClick={() => setConfirmDelete(true)}
            className="rounded-block border border-crayon-red text-crayon-red px-5 py-2.5 font-display font-bold"
          >
            {t("delete")}
          </button>
        ) : (
          <div className="flex items-center gap-3">
            <span className="text-sm text-chalkboard/70">{t("confirmDelete")}</span>
            <button
              type="button"
              onClick={handleDelete}
              disabled={loading}
              className="rounded-block bg-crayon-red text-white px-4 py-2 font-display font-bold text-sm"
            >
              {loading ? t("deleting") : t("yesDelete")}
            </button>
            <button
              type="button"
              onClick={() => setConfirmDelete(false)}
              className="text-sm text-chalkboard/60"
            >
              {t("cancel")}
            </button>
          </div>
        )}
        {error && <p className="w-full text-sm text-crayon-red">{error}</p>}
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSave}
      className="mt-4 max-w-sm rounded-block border border-chalkboard/10 p-6 shadow-block"
    >
      <div>
        <label htmlFor="firstName" className="block text-sm font-bold">
          {t("firstName")}
        </label>
        <input
          id="firstName"
          name="firstName"
          defaultValue={firstName}
          required
          className="mt-1 w-full rounded-block border border-chalkboard/20 px-3 py-2"
        />
      </div>

      <div className="mt-4">
        <label htmlFor="ageBand" className="block text-sm font-bold">
          {t("ageRange")}
        </label>
        <select
          id="ageBand"
          name="ageBand"
          defaultValue={ageBand}
          required
          className="mt-1 w-full rounded-block border border-chalkboard/20 px-3 py-2"
        >
          <option value="3-4">{t("age34")}</option>
          <option value="5-6">{t("age56")}</option>
          <option value="7-8">{t("age78")}</option>
        </select>
      </div>

      {error && <p className="mt-3 text-sm text-crayon-red">{error}</p>}

      <div className="mt-5 flex gap-3">
        <button
          type="submit"
          disabled={loading}
          className="rounded-block bg-crayon-yellow font-display font-bold px-5 py-2.5"
        >
          {loading ? t("saving") : t("save")}
        </button>
        <button
          type="button"
          onClick={() => setEditing(false)}
          className="rounded-block px-5 py-2.5 font-display font-bold text-chalkboard/70"
        >
          {t("cancel")}
        </button>
      </div>
    </form>
  );
}
