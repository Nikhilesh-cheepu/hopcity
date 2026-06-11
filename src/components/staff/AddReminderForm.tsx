"use client";

import { FormEvent, useState } from "react";
import {
  DateTimePicker,
  reminderDateTimeToISO,
  useReminderDateTimeDefaults,
} from "./DateTimePicker";

const inputClass =
  "min-h-10 w-full rounded-lg border border-hop-green/20 bg-black/50 px-3 py-2 text-sm text-hop-white outline-none focus:border-hop-green/50";

export function AddReminderForm({
  guestName,
  mobileNo,
  venue,
  reservationId,
  specialOccasion,
  specialOccasionLabel,
  onSaved,
  onCancel,
}: {
  guestName: string;
  mobileNo: string;
  venue: string;
  reservationId?: string;
  specialOccasion?: string | null;
  specialOccasionLabel?: string | null;
  onSaved: () => void;
  onCancel: () => void;
}) {
  const defaults = useReminderDateTimeDefaults();
  const [remindDate, setRemindDate] = useState(defaults.date);
  const [remindTime, setRemindTime] = useState(defaults.time);
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/reminders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          guestName,
          mobileNo,
          venue,
          reservationId,
          specialOccasion,
          specialOccasionLabel,
          remindAt: reminderDateTimeToISO(remindDate, remindTime),
          note: note.trim() || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Could not save.");
        return;
      }
      onSaved();
    } catch {
      setError("Network error.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-3 space-y-3 rounded-lg border border-white/8 bg-black/30 p-3">
      <p className="text-[0.6rem] font-semibold uppercase tracking-wide text-hop-white/40">
        Add reminder
      </p>

      <DateTimePicker
        date={remindDate}
        time={remindTime}
        onDateChange={setRemindDate}
        onTimeChange={setRemindTime}
      />

      <input
        type="text"
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Note (optional)"
        maxLength={120}
        className={inputClass}
      />

      <div className="flex gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="min-h-9 flex-1 rounded-lg border border-white/10 text-xs font-semibold text-hop-white/50"
        >
          Cancel
        </button>
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
