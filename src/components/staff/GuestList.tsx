"use client";

import { useEffect, useState } from "react";
import { getSpecialOccasionLabel, hasSpecialOccasion } from "@/data/occasions";
import { BOOKING_SOURCES, VENUES } from "@/data/venues";
import {
  formatTime,
  reservationBookingSourceLabel,
  reservationEntryTypeLabel,
  reservationServiceWindowLabel,
  reservationVenueLabel,
  type ReservationRecord,
} from "@/lib/reservations";
import { getServiceWindow } from "@/lib/service-windows";
import { AddReminderForm } from "./AddReminderForm";
import { GlassCard } from "./GlassCard";
import { SetOccasionForm } from "./SetOccasionForm";
import { WhatsAppIconButton } from "./WhatsAppIconButton";

type ExpandedPanel = { id: string; type: "reminder" | "occasion" } | null;

export function GuestList({ from, to }: { from: string; to: string }) {
  const [venueFilter, setVenueFilter] = useState("all");
  const [sourceFilter, setSourceFilter] = useState("all");

  return (
    <div className="space-y-3">
      <div>
        <p className="mb-1.5 text-[0.6rem] font-semibold uppercase tracking-[0.16em] text-hop-white/35">
          Venue
        </p>
        <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <FilterChip
            label="All"
            active={venueFilter === "all"}
            onClick={() => setVenueFilter("all")}
          />
          {VENUES.map((v) => (
            <FilterChip
              key={v.id}
              label={v.label}
              active={venueFilter === v.id}
              onClick={() => setVenueFilter(v.id)}
            />
          ))}
        </div>
      </div>

      <div>
        <p className="mb-1.5 text-[0.6rem] font-semibold uppercase tracking-[0.16em] text-hop-white/35">
          Source
        </p>
        <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <FilterChip
            label="All"
            active={sourceFilter === "all"}
            onClick={() => setSourceFilter("all")}
          />
          {BOOKING_SOURCES.map((s) => (
            <FilterChip
              key={s.id}
              label={s.label}
              active={sourceFilter === s.id}
              onClick={() => setSourceFilter(s.id)}
            />
          ))}
        </div>
      </div>

      <GuestListResults
        key={`${from}-${to}-${venueFilter}-${sourceFilter}`}
        from={from}
        to={to}
        venueFilter={venueFilter}
        sourceFilter={sourceFilter}
      />
    </div>
  );
}

function GuestListResults({
  from,
  to,
  venueFilter,
  sourceFilter,
}: {
  from: string;
  to: string;
  venueFilter: string;
  sourceFilter: string;
}) {
  const [reservations, setReservations] = useState<ReservationRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<ExpandedPanel>(null);

  useEffect(() => {
    let cancelled = false;
    const params = new URLSearchParams({ from, to });
    if (venueFilter !== "all") params.set("venue", venueFilter);
    if (sourceFilter !== "all") params.set("bookingSource", sourceFilter);

    fetch(`/api/reservations?${params}`)
      .then((r) => r.json())
      .then((data) => {
        if (!cancelled && !data.error) setReservations(data.reservations ?? []);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [from, to, venueFilter, sourceFilter]);

  function updateReservation(updated: ReservationRecord) {
    setReservations((list) => list.map((r) => (r.id === updated.id ? updated : r)));
    setExpanded(null);
  }

  function togglePanel(id: string, type: "reminder" | "occasion") {
    setExpanded((current) =>
      current?.id === id && current.type === type ? null : { id, type },
    );
  }

  if (loading) {
    return (
      <GlassCard>
        <p className="py-6 text-center text-sm text-hop-white/40 animate-pulse">
          Loading guests…
        </p>
      </GlassCard>
    );
  }

  if (reservations.length === 0) {
    return (
      <GlassCard>
        <p className="py-6 text-center text-sm text-hop-white/40">
          No guests for this period
          {venueFilter !== "all" || sourceFilter !== "all" ? " with these filters" : ""}.
        </p>
      </GlassCard>
    );
  }

  return (
    <ul className="space-y-3">
      {reservations.map((r) => (
        <li key={r.id}>
          <GlassCard className="!p-4">
            <div className="flex items-start gap-2">
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <p className="truncate text-base font-semibold text-hop-white">
                    {r.guestName}
                  </p>
                  <div className="flex shrink-0 items-center gap-2">
                    <WhatsAppIconButton mobileNo={r.mobileNo} guestName={r.guestName} />
                    <span
                      className={`rounded-full border px-2 py-0.5 text-[0.6rem] font-medium uppercase tracking-wide ${
                        r.entryType === "reserved"
                          ? "border-hop-green/40 bg-hop-green/15 text-hop-green"
                          : "border-white/15 bg-white/5 text-hop-white/55"
                      }`}
                    >
                      {reservationEntryTypeLabel(r.entryType)}
                    </span>
                  </div>
                </div>
                <p className="mt-0.5 text-sm text-hop-white/45">{r.mobileNo}</p>
                <p className="mt-1 text-lg font-bold text-hop-green-light">
                  {r.partySize}
                  <span className="ml-1 text-[0.65rem] font-normal text-hop-white/40">pax</span>
                </p>
              </div>
            </div>

            <div className="mt-2 flex flex-wrap gap-2">
              <span className="inline-block rounded-full border border-[#74c274]/30 bg-[#74c274]/10 px-2.5 py-0.5 text-[0.65rem] font-medium uppercase tracking-wide text-[#74c274]">
                {reservationVenueLabel(r.venue)}
              </span>
              <span className="inline-block rounded-full border border-sky-500/30 bg-sky-500/10 px-2.5 py-0.5 text-[0.65rem] font-medium uppercase tracking-wide text-sky-300">
                {reservationBookingSourceLabel(r.bookingSource)}
              </span>
              {hasSpecialOccasion(r.specialOccasion) && (
                <span className="inline-block rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-0.5 text-[0.65rem] font-medium uppercase tracking-wide text-amber-200">
                  {getSpecialOccasionLabel(r.specialOccasion, r.specialOccasionLabel)}
                </span>
              )}
              <span
                className={`inline-block rounded-full border px-2.5 py-0.5 text-[0.65rem] font-medium uppercase tracking-wide ${
                  getServiceWindow(r.createdAt) === "dinner"
                    ? "border-amber-500/30 bg-amber-500/10 text-amber-300"
                    : getServiceWindow(r.createdAt) === "lunch"
                      ? "border-[#74c274]/30 bg-[#74c274]/10 text-[#74c274]"
                      : "border-white/15 bg-white/5 text-hop-white/45"
                }`}
              >
                {reservationServiceWindowLabel(r.createdAt)}
              </span>
              {from !== to && (
                <span className="text-[0.65rem] text-hop-white/35">{r.visitDate}</span>
              )}
            </div>

            <div className="mt-3 flex items-center justify-between border-t border-white/5 pt-3 text-[0.65rem] text-hop-white/35">
              <span>{r.staffType}</span>
              <span>{formatTime(r.createdAt)} IST</span>
            </div>

            <div className="mt-2 flex gap-3">
              <button
                type="button"
                onClick={() => togglePanel(r.id, "reminder")}
                className="text-[0.65rem] font-semibold uppercase tracking-wide text-hop-white/40 transition hover:text-[#74c274]"
              >
                {expanded?.id === r.id && expanded.type === "reminder" ? "− Reminder" : "+ Reminder"}
              </button>
              <button
                type="button"
                onClick={() => togglePanel(r.id, "occasion")}
                className="text-[0.65rem] font-semibold uppercase tracking-wide text-hop-white/40 transition hover:text-amber-300"
              >
                {expanded?.id === r.id && expanded.type === "occasion"
                  ? "− Occasion"
                  : hasSpecialOccasion(r.specialOccasion)
                    ? "Edit occasion"
                    : "+ Occasion"}
              </button>
            </div>

            {expanded?.id === r.id && expanded.type === "reminder" && (
              <AddReminderForm
                guestName={r.guestName}
                mobileNo={r.mobileNo}
                venue={r.venue}
                reservationId={r.id}
                specialOccasion={r.specialOccasion}
                specialOccasionLabel={r.specialOccasionLabel}
                onSaved={() => setExpanded(null)}
                onCancel={() => setExpanded(null)}
              />
            )}

            {expanded?.id === r.id && expanded.type === "occasion" && (
              <SetOccasionForm
                reservation={r}
                onSaved={updateReservation}
                onCancel={() => setExpanded(null)}
              />
            )}
          </GlassCard>
        </li>
      ))}
    </ul>
  );
}

function FilterChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`shrink-0 rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wide transition ${
        active
          ? "border border-[#74c274] bg-[#74c274]/20 text-[#85d985] shadow-[0_0_20px_rgba(116,194,116,0.3)]"
          : "border border-white/10 bg-white/5 text-hop-white/50 hover:border-hop-green/25"
      }`}
    >
      {label}
    </button>
  );
}
