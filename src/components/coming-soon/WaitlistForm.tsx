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
    <div className="w-full">
      <form
        onSubmit={handleSubmit}
        className="flex w-full flex-col gap-3 md:max-w-md md:flex-row md:items-stretch lg:max-w-lg"
      >
        <label htmlFor="email" className="sr-only">
          Email address
        </label>
        <input
          id="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          required
          disabled={status === "loading" || status === "success"}
          className="min-h-12 w-full flex-1 rounded-full border border-hop-green/30 bg-white/5 px-5 py-3 text-base text-hop-white placeholder:text-hop-white/35 outline-none transition focus:border-hop-green focus:ring-2 focus:ring-hop-green/20 disabled:opacity-60"
        />
        <button
          type="submit"
          disabled={status === "loading" || status === "success"}
          className="min-h-12 w-full shrink-0 rounded-full bg-hop-green px-6 py-3 text-base font-semibold tracking-wide text-hop-black transition active:scale-[0.98] hover:bg-hop-green-light disabled:cursor-not-allowed disabled:opacity-60 md:w-auto"
        >
          {status === "loading" ? "Joining…" : "Notify Me"}
        </button>
      </form>
      {message && (
        <p
          role="status"
          className={`mt-3 text-center text-sm ${
            status === "error" ? "text-red-400" : "text-hop-green"
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
}
