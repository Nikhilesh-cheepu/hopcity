"use client";

import { FormEvent, useState } from "react";
import { SPECIAL_OCCASIONS, type SpecialOccasionId } from "@/data/occasions";
import {
  ENTRY_TYPES,
  RESERVED_BOOKING_SOURCES,
  STAFF_TYPES,
  VENUES,
  type EntryType,
  type ReservedBookingSource,
  type StaffType,
  type VenueId,
} from "@/data/venues";
import { buildGuestWelcomeMessage, whatsAppUrl } from "@/lib/whatsapp";
import { normalizeIndianMobile } from "@/lib/mobile";
import { GlassCard } from "./GlassCard";

const inputClass =
  "min-h-12 w-full rounded-xl border border-hop-green/20 bg-black/50 px-4 py-3 text-base text-hop-white placeholder:text-hop-white/30 shadow-[inset_0_2px_8px_rgba(0,0,0,0.4)] outline-none transition focus:border-hop-green/60 focus:shadow-[0_0_20px_rgba(116,194,116,0.15)]";

const labelClass =
  "mb-1.5 block text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-[#74c274]";

export function EntryForm({
  date,
  onSuccess,
}: {
  date: string;
  onSuccess: () => void;
}) {
  const [staffType, setStaffType] = useState<StaffType>(STAFF_TYPES[0]);
  const [entryType, setEntryType] = useState<EntryType>("walkin");
  const [bookingSource, setBookingSource] = useState<ReservedBookingSource>("call");
  const [otherSourceText, setOtherSourceText] = useState("");
  const [guestName, setGuestName] = useState("");
  const [mobileNo, setMobileNo] = useState("");
  const [partySize, setPartySize] = useState("2");
  const [venue, setVenue] = useState<VenueId>(VENUES[0].id);
  const [hasSpecialOccasion, setHasSpecialOccasion] = useState(false);
  const [specialOccasion, setSpecialOccasion] = useState<SpecialOccasionId>("birthday");
  const [specialOccasionOther, setSpecialOccasionOther] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  function handleEntryTypeChange(next: EntryType) {
    setEntryType(next);
    if (next === "walkin") {
      setOtherSourceText("");
    } else {
      setBookingSource("call");
    }
  }

  function handleMobileBlur() {
    const normalized = normalizeIndianMobile(mobileNo);
    if (normalized) setMobileNo(normalized);
  }

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
          bookingSource: entryType === "reserved" ? bookingSource : "direct",
          bookingSourceOther:
            entryType === "reserved" && bookingSource === "other"
              ? otherSourceText.trim()
              : undefined,
          guestName,
          mobileNo,
          partySize: Number(partySize),
          venue,
          visitDate: date,
          hasSpecialOccasion,
          specialOccasion: hasSpecialOccasion ? specialOccasion : "none",
          specialOccasionOther:
            hasSpecialOccasion && specialOccasion === "other"
              ? specialOccasionOther.trim()
              : undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setStatus("error");
        setMessage(data.error ?? "Could not save entry.");
        return;
      }

      const savedName = guestName.trim();
      const savedMobile = normalizeIndianMobile(mobileNo) ?? mobileNo.replace(/\D/g, "");
      const savedPartySize = Number(partySize);
      const savedVenue = venue;
      const checkInAt = data.reservation.createdAt as string;

      onSuccess();

      const welcomeMessage = buildGuestWelcomeMessage({
        guestName: savedName,
        partySize: savedPartySize,
        venue: savedVenue,
        checkInAt,
      });

      window.location.href = whatsAppUrl(savedMobile, welcomeMessage);
    } catch {
      setStatus("error");
      setMessage("Network error. Try again.");
    }
  }

  return (
    <GlassCard glow>
      <p className="hop-text-brand mb-4 text-[0.65rem] font-semibold uppercase tracking-[0.22em]">
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
                onClick={() => handleEntryTypeChange(t.id)}
                className={`min-h-11 rounded-xl border text-sm font-semibold transition ${
                  entryType === t.id
                    ? "border-[#74c274] bg-[#74c274]/20 text-[#74c274] shadow-[0_0_16px_rgba(116,194,116,0.25)]"
                    : "border-white/10 bg-black/30 text-hop-white/45"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {entryType === "reserved" && (
          <div className="space-y-3 rounded-xl border border-hop-green/15 bg-black/20 p-3">
            <div>
              <label htmlFor="bookingSource" className={labelClass}>
                Reservation Source
              </label>
              <select
                id="bookingSource"
                value={bookingSource}
                onChange={(e) => {
                  const value = e.target.value as ReservedBookingSource;
                  setBookingSource(value);
                  if (value !== "other") setOtherSourceText("");
                }}
                className={inputClass}
              >
                {RESERVED_BOOKING_SOURCES.map((s) => (
                  <option key={s.id} value={s.id} className="bg-hop-black">
                    {s.label}
                  </option>
                ))}
              </select>
            </div>

            {bookingSource === "other" && (
              <div>
                <label htmlFor="otherSourceText" className={labelClass}>
                  Specify Source
                </label>
                <input
                  id="otherSourceText"
                  type="text"
                  value={otherSourceText}
                  onChange={(e) => setOtherSourceText(e.target.value)}
                  placeholder="e.g. Instagram, company booking"
                  required
                  maxLength={40}
                  className={inputClass}
                />
              </div>
            )}
          </div>
        )}

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
            inputMode="tel"
            autoComplete="tel"
            value={mobileNo}
            onChange={(e) => setMobileNo(e.target.value)}
            onBlur={handleMobileBlur}
            onPaste={(e) => {
              const pasted = e.clipboardData.getData("text");
              const normalized = normalizeIndianMobile(pasted);
              if (normalized) {
                e.preventDefault();
                setMobileNo(normalized);
              }
            }}
            placeholder="Paste +91 or 10-digit mobile"
            required
            className={inputClass}
          />
          <p className="mt-1 text-[0.6rem] text-hop-white/30">
            +91, spaces, and dashes are OK — we clean it automatically
          </p>
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

        <div>
          <button
            type="button"
            onClick={() => {
              setHasSpecialOccasion((v) => !v);
              if (hasSpecialOccasion) setSpecialOccasionOther("");
            }}
            className="text-sm font-medium text-[#74c274]/80 transition hover:text-[#74c274]"
          >
            {hasSpecialOccasion ? "− Remove special occasion" : "+ Special occasion? (optional)"}
          </button>

          {hasSpecialOccasion && (
            <div className="mt-3 space-y-3 rounded-xl border border-amber-500/20 bg-amber-500/5 p-3">
              <div className="grid grid-cols-3 gap-2">
                {SPECIAL_OCCASIONS.map((o) => (
                  <button
                    key={o.id}
                    type="button"
                    onClick={() => {
                      setSpecialOccasion(o.id);
                      if (o.id !== "other") setSpecialOccasionOther("");
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
                  value={specialOccasionOther}
                  onChange={(e) => setSpecialOccasionOther(e.target.value)}
                  placeholder="e.g. Promotion, proposal"
                  required
                  maxLength={40}
                  className={inputClass}
                />
              )}
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={status === "loading"}
          className="hop-btn-primary min-h-13 w-full rounded-xl py-3.5 text-base tracking-wide transition active:scale-[0.98]"
        >
          {status === "loading" ? "Checking in…" : "Check In Guest"}
        </button>

        <p className="text-center text-[0.65rem] text-hop-white/35">
          Saves entry & opens WhatsApp welcome message to guest
        </p>

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
