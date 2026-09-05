"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  childId: string;
  firstName: string;
  ageBand: string;
};

export default function ChildActions({ childId, firstName, ageBand }: Props) {
  const router = useRouter();
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
      setError(data.error || "Something went wrong. Please try again.");
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
      setError(data.error || "Something went wrong. Please try again.");
      return;
    }

    router.push("/dashboard");
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
          Edit Profile
        </button>

        {!confirmDelete ? (
          <button
            type="button"
            onClick={() => setConfirmDelete(true)}
            className="rounded-block border border-crayon-red text-crayon-red px-5 py-2.5 font-display font-bold"
          >
            Delete Profile
          </button>
        ) : (
          <div className="flex items-center gap-3">
            <span className="text-sm text-chalkboard/70">Are you sure?</span>
            <button
              type="button"
              onClick={handleDelete}
              disabled={loading}
              className="rounded-block bg-crayon-red text-white px-4 py-2 font-display font-bold text-sm"
            >
              {loading ? "Deleting…" : "Yes, delete"}
            </button>
            <button
              type="button"
              onClick={() => setConfirmDelete(false)}
              className="text-sm text-chalkboard/60"
            >
              Cancel
            </button>
          </div>
        )}
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
          Child's First Name
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
          Age Range
        </label>
        <select
          id="ageBand"
          name="ageBand"
          defaultValue={ageBand}
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
          className="rounded-block bg-crayon-yellow font-display font-bold px-5 py-2.5"
        >
          {loading ? "Saving…" : "Save Changes"}
        </button>
        <button
          type="button"
          onClick={() => setEditing(false)}
          className="rounded-block px-5 py-2.5 font-display font-bold text-chalkboard/70"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}