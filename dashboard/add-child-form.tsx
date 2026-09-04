"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddChildForm() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const form = new FormData(e.currentTarget);
    const res = await fetch("/api/children", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        firstName: form.get("firstName"),
        ageBand: form.get("ageBand"),
      }),
    });

    setLoading(false);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Something went wrong. Please try again.");
      return;
    }

    setOpen(false);
    router.refresh();
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => { alert("الزر خدام!"); setOpen(true); }}
        className="rounded-block bg-crayon-blue text-paper font-display font-bold px-5 py-2.5 shadow-block hover:shadow-blockHover transition"
      >
        Add Child Profile
      </button>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto max-w-sm text-left rounded-block border border-chalkboard/10 p-5 shadow-block"
    >
      <div>
        <label htmlFor="firstName" className="block text-sm font-bold">
          Child's First Name
        </label>
        <input
          id="firstName"
          name="firstName"
          type="text"
          required
          maxLength={50}
          className="mt-1 w-full rounded-block border border-chalkboard/20 px-3 py-2"
        />
      </div>
      <div className="mt-4">
        <label htmlFor="ageBand" className="block text-sm font-bold">
          Age Range
        </label>
        <select
          id="ageBand"
          name="ageBand"
          required
          className="mt-1 w-full rounded-block border border-chalkboard/20 px-3 py-2"
        >
          <option value="3-4">3-4 years</option>
          <option value="5-6">5-6 years</option>
          <option value="7-8">7-8 years</option>
        </select>
      </div>
      {error && <p className="mt-3 text-sm text-crayon-red">{error}</p>}
      <div className="mt-5 flex gap-3">
        <button
          type="submit"
          disabled={loading}
          className="rounded-block bg-crayon-yellow font-display font-bold px-5 py-2.5 shadow-block hover:shadow-blockHover transition disabled:opacity-60"
        >
          {loading ? "Adding…" : "Add Child"}
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="rounded-block px-5 py-2.5 font-display font-bold text-chalkboard/60 hover:text-chalkboard"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
