"use client";

import { FormEvent, useState } from "react";
import { hasSpecialOccasion, SPECIAL_OCCASIONS, type SpecialOccasionId } from "@/data/occasions";
import type { ReservationRecord } from "@/lib/reservations";

const inputClass =
  "min-h-10 w-full rounded-lg border border-hop-green/20 bg-black/50 px-3 py-2 text-sm text-hop-white outline-none focus:border-hop-green/50";

export function SetOccasionForm({
  reservation,
  onSaved,
  onCancel,
}: {
  reservation: ReservationRecord;
  onSaved: (updated: ReservationRecord) => void;
  onCancel: () => void;
}) {
  const existing = hasSpecialOccasion(reservation.specialOccasion);
  const [specialOccasion, setSpecialOccasion] = useState<SpecialOccasionId>(
    existing && reservation.specialOccasion !== "none"
      ? (reservation.specialOccasion as SpecialOccasionId)
      : "birthday",
  );
  const [otherText, setOtherText] = useState(
    reservation.specialOccasionLabel?.startsWith("other:")
      ? reservation.specialOccasionLabel.slice(6)
      : "",
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/reservations", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: reservation.id,
          hasSpecialOccasion: true,
          specialOccasion,
          specialOccasionOther: specialOccasion === "other" ? otherText.trim() : undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Could not save.");
        return;
      }
      onSaved(data.reservation);
    } catch {
      setError("Network error.");
    } finally {
      setLoading(false);
    }
  }

  async function handleRemove() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/reservations", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: reservation.id, hasSpecialOccasion: false }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Could not remove.");
        return;
      }
      onSaved(data.reservation);
    } catch {
      setError("Network error.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-3 space-y-3 rounded-lg border border-amber-500/20 bg-amber-500/5 p-3">
      <p className="text-[0.6rem] font-semibold uppercase tracking-wide text-amber-200/80">
        {existing ? "Edit occasion" : "Add occasion"}
      </p>
      <div className="grid grid-cols-3 gap-2">
        {SPECIAL_OCCASIONS.map((o) => (
          <button
            key={o.id}
            type="button"
            onClick={() => {
              setSpecialOccasion(o.id);
              if (o.id !== "other") setOtherText("");
            }}
            className={`min-h-10 rounded-lg border text-xs font-semibold transition ${
              specialOccasion === o.id
                ? "border-amber-400/50 bg-amber-500/15 text-amber-200"
                : "border-white/10 bg-black/30 text-hop-white/45"
            }`}
          >
            {o.label}
          </button>
        ))}
      </div>
      {specialOccasion === "other" && (
        <input
          type="text"
          value={otherText}
          onChange={(e) => setOtherText(e.target.value)}
          placeholder="e.g. Promotion"
          required
          maxLength={40}
          className={inputClass}
        />
      )}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="min-h-9 flex-1 rounded-lg border border-white/10 text-xs font-semibold text-hop-white/50"
        >
          Cancel
        </button>
        {existing && (
          <button
            type="button"
            onClick={handleRemove}
            disabled={loading}
            className="min-h-9 rounded-lg border border-white/10 px-3 text-xs font-semibold text-hop-white/40"
          >
            Remove
          </button>
        )}
        <button
          type="submit"
          disabled={loading}
          className="min-h-9 flex-1 rounded-lg bg-[#74c274] text-xs font-bold text-black disabled:opacity-50"
        >
          {loading ? "Saving…" : "Save"}
        </button>
      </div>
      {error && <p className="text-xs text-red-400">{error}</p>}
    </form>
  );
}
