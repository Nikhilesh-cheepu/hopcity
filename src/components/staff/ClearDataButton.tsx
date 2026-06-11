"use client";

import { FormEvent, useState } from "react";
import { GlassCard } from "./GlassCard";

const inputClass =
  "min-h-11 w-full rounded-xl border border-red-500/25 bg-black/50 px-4 py-2.5 text-sm text-hop-white placeholder:text-hop-white/30 outline-none transition focus:border-red-400/50";

export function ClearDataButton({ onCleared }: { onCleared: () => void }) {
  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmText, setConfirmText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/clear", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, confirm: confirmText }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Could not clear data.");
        return;
      }

      setOpen(false);
      setPassword("");
      setConfirmText("");
      onCleared();
    } catch {
      setError("Network error. Try again.");
    } finally {
      setLoading(false);
    }
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="w-full rounded-xl border border-red-500/25 bg-red-500/5 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-red-300/80 transition hover:bg-red-500/10"
      >
        Clear All Data
      </button>
    );
  }

  return (
    <GlassCard className="!border-red-500/20">
      <p className="mb-1 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-red-300">
        Danger Zone
      </p>
      <p className="mb-4 text-sm text-hop-white/50">
        Permanently deletes all guest entries and waitlist signups. This cannot be undone.
      </p>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label htmlFor="clearPassword" className="mb-1 block text-[0.6rem] text-hop-white/40">
            Clear password
          </label>
          <input
            id="clearPassword"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter clear password"
            required
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="clearConfirm" className="mb-1 block text-[0.6rem] text-hop-white/40">
            Type DELETE to confirm
          </label>
          <input
            id="clearConfirm"
            type="text"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            placeholder="DELETE"
            required
            className={inputClass}
          />
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              setPassword("");
              setConfirmText("");
              setError("");
            }}
            className="min-h-11 flex-1 rounded-xl border border-white/10 bg-black/30 text-sm font-semibold text-hop-white/60"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading || confirmText !== "DELETE"}
            className="min-h-11 flex-1 rounded-xl border border-red-500/40 bg-red-600/80 text-sm font-bold text-white transition hover:bg-red-500 disabled:opacity-50"
          >
            {loading ? "Clearing…" : "Delete All"}
          </button>
        </div>

        {error && <p className="text-center text-xs text-red-400">{error}</p>}
      </form>
    </GlassCard>
  );
}
