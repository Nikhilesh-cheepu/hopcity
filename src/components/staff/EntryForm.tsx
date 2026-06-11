"use client";

import { FormEvent, useState } from "react";
import {
  ENTRY_TYPES,
  STAFF_TYPES,
  VENUES,
  type EntryType,
  type StaffType,
  type VenueId,
} from "@/data/venues";
import { GlassCard } from "./GlassCard";

const inputClass =
  "min-h-12 w-full rounded-xl border border-hop-green/20 bg-black/50 px-4 py-3 text-base text-hop-white placeholder:text-hop-white/30 shadow-[inset_0_2px_8px_rgba(0,0,0,0.4)] outline-none transition focus:border-hop-green/60 focus:shadow-[0_0_20px_rgba(116,194,116,0.15)]";

const labelClass =
  "mb-1.5 block text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-hop-green/80";

export function EntryForm({
  date,
  onSuccess,
}: {
  date: string;
  onSuccess: () => void;
}) {
  const [staffType, setStaffType] = useState<StaffType>(STAFF_TYPES[0]);
  const [entryType, setEntryType] = useState<EntryType>("walkin");
  const [guestName, setGuestName] = useState("");
  const [mobileNo, setMobileNo] = useState("");
  const [partySize, setPartySize] = useState("2");
  const [venue, setVenue] = useState<VenueId>(VENUES[0].id);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setMessage("");

    try {
      const res = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          staffType,
          entryType,
          guestName,
          mobileNo,
          partySize: Number(partySize),
          venue,
          visitDate: date,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setStatus("error");
        setMessage(data.error ?? "Could not save entry.");
        return;
      }

      setStatus("success");
      setMessage(`${guestName} checked in successfully.`);
      setGuestName("");
      setMobileNo("");
      setPartySize("2");
      setEntryType("walkin");
      onSuccess();

      setTimeout(() => {
        setStatus("idle");
        setMessage("");
      }, 2500);
    } catch {
      setStatus("error");
      setMessage("Network error. Try again.");
    }
  }

  return (
    <GlassCard glow>
      <p className="mb-4 text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-hop-green">
        Guest Entry
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <span className={labelClass}>Entry Type</span>
          <div className="grid grid-cols-2 gap-2">
            {ENTRY_TYPES.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setEntryType(t.id)}
                className={`min-h-11 rounded-xl border text-sm font-semibold transition ${
                  entryType === t.id
                    ? "border-hop-green/50 bg-hop-green/20 text-hop-green-light shadow-[0_0_16px_rgba(116,194,116,0.15)]"
                    : "border-white/10 bg-black/30 text-hop-white/45"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label htmlFor="staffType" className={labelClass}>
            Staff Type
          </label>
          <select
            id="staffType"
            value={staffType}
            onChange={(e) => setStaffType(e.target.value as StaffType)}
            className={inputClass}
          >
            {STAFF_TYPES.map((t) => (
              <option key={t} value={t} className="bg-hop-black">
                {t}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="guestName" className={labelClass}>
            Guest Name
          </label>
          <input
            id="guestName"
            type="text"
            value={guestName}
            onChange={(e) => setGuestName(e.target.value)}
            placeholder="Full name"
            required
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="mobileNo" className={labelClass}>
            Mobile No.
          </label>
          <input
            id="mobileNo"
            type="tel"
            inputMode="numeric"
            value={mobileNo}
            onChange={(e) => setMobileNo(e.target.value)}
            placeholder="10-digit mobile"
            required
            maxLength={10}
            className={inputClass}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="partySize" className={labelClass}>
              No. of People
            </label>
            <input
              id="partySize"
              type="number"
              min={1}
              max={50}
              value={partySize}
              onChange={(e) => setPartySize(e.target.value)}
              required
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="venue" className={labelClass}>
              Venue
            </label>
            <select
              id="venue"
              value={venue}
              onChange={(e) => setVenue(e.target.value as VenueId)}
              className={inputClass}
            >
              {VENUES.map((v) => (
                <option key={v.id} value={v.id} className="bg-hop-black">
                  {v.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          type="submit"
          disabled={status === "loading"}
          className="min-h-13 w-full rounded-xl bg-hop-green py-3.5 text-base font-bold tracking-wide text-hop-black shadow-[0_4px_24px_rgba(116,194,116,0.35)] transition active:scale-[0.98] hover:bg-hop-green-light hover:shadow-[0_6px_32px_rgba(116,194,116,0.45)] disabled:opacity-60"
        >
          {status === "loading" ? "Saving…" : "Check In Guest"}
        </button>

        {message && (
          <p
            role="status"
            className={`text-center text-sm ${
              status === "error" ? "text-red-400" : "text-hop-green"
            }`}
          >
            {message}
          </p>
        )}
      </form>
    </GlassCard>
  );
}
