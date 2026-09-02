"use client";

import { useState } from "react";

export default function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    const form = new FormData(e.currentTarget);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.get("name"),
          email: form.get("email"),
          message: form.get("message"),
        }),
      });
      setStatus(res.ok ? "sent" : "error");
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return <p className="text-center text-crayon-green font-display font-bold">Thanks — we&apos;ll get back to you soon.</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-bold">Name</label>
        <input id="name" name="name" type="text" required className="mt-1 w-full rounded-block border border-chalkboard/20 px-3 py-2" />
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-bold">Email</label>
        <input id="email" name="email" type="email" required className="mt-1 w-full rounded-block border border-chalkboard/20 px-3 py-2" />
      </div>
      <div>
        <label htmlFor="message" className="block text-sm font-bold">Message</label>
        <textarea id="message" name="message" required rows={4} className="mt-1 w-full rounded-block border border-chalkboard/20 px-3 py-2" />
      </div>
      {status === "error" && <p className="text-sm text-crayon-red">Something went wrong. Please try again.</p>}
      <button
        type="submit"
        disabled={status === "sending"}
        className="w-full rounded-block bg-crayon-yellow font-display font-bold px-5 py-2.5 shadow-block hover:shadow-blockHover transition disabled:opacity-60"
      >
        {status === "sending" ? "Sending…" : "Send Message"}
      </button>
    </form>
  );
}
