"use client";

import { FormEvent, useState } from "react";

type Status = "idle" | "loading" | "success" | "error";

export function WaitlistForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setMessage("");

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setStatus("error");
        setMessage(data.error ?? "Something went wrong.");
        return;
      }

      setStatus("success");
      setMessage(data.message ?? "You're on the list. We'll be in touch.");
      setEmail("");
    } catch {
      setStatus("error");
      setMessage("Could not connect. Please try again.");
    }
  }

  return (
    <div className="w-full max-w-md">
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
        <label htmlFor="email" className="sr-only">
          Email address
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          required
          disabled={status === "loading" || status === "success"}
          className="flex-1 rounded-full border border-hop-gold/25 bg-black/40 px-5 py-3 text-sm text-hop-cream placeholder:text-hop-cream/40 outline-none transition focus:border-hop-gold/60 focus:ring-1 focus:ring-hop-gold/30 disabled:opacity-60"
        />
        <button
          type="submit"
          disabled={status === "loading" || status === "success"}
          className="rounded-full bg-hop-gold px-6 py-3 text-sm font-medium tracking-wide text-hop-dark transition hover:bg-hop-gold-light disabled:cursor-not-allowed disabled:opacity-60"
        >
          {status === "loading" ? "Joining…" : "Notify Me"}
        </button>
      </form>
      {message && (
        <p
          role="status"
          className={`mt-3 text-center text-sm ${
            status === "error" ? "text-red-400" : "text-hop-green-light"
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
}
