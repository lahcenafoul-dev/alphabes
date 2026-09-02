"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export default function RegisterForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const form = new FormData(e.currentTarget);
    const payload = {
      name: form.get("name"),
      email: form.get("email"),
      password: form.get("password"),
    };

    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Something went wrong. Please try again.");
      setLoading(false);
      return;
    }

    await signIn("credentials", {
      email: payload.email,
      password: payload.password,
      redirect: false,
    });

    setLoading(false);
    router.push("/dashboard");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-bold">
          Your Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          autoComplete="name"
          className="mt-1 w-full rounded-block border border-chalkboard/20 px-3 py-2"
        />
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-bold">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          className="mt-1 w-full rounded-block border border-chalkboard/20 px-3 py-2"
        />
      </div>
      <div>
        <label htmlFor="password" className="block text-sm font-bold">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          className="mt-1 w-full rounded-block border border-chalkboard/20 px-3 py-2"
        />
        <p className="mt-1 text-xs text-chalkboard/50">At least 8 characters.</p>
      </div>
      {error && <p className="text-sm text-crayon-red">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-block bg-crayon-yellow font-display font-bold px-5 py-2.5 shadow-block hover:shadow-blockHover transition disabled:opacity-60"
      >
        {loading ? "Creating account…" : "Start Learning Free"}
      </button>
    </form>
  );
}
