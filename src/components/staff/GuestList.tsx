"use client";

import { useEffect, useState } from "react";
import { VENUES } from "@/data/venues";
import {
  formatTime,
  reservationEntryTypeLabel,
  reservationVenueLabel,
  type ReservationRecord,
} from "@/lib/reservations";
import { GlassCard } from "./GlassCard";
import { WhatsAppButton } from "./WhatsAppButton";

export function GuestList({ date }: { date: string }) {
  const [venueFilter, setVenueFilter] = useState("all");

  return (
    <div className="space-y-3">
      <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <VenueChip
          label="All"
          active={venueFilter === "all"}
          onClick={() => setVenueFilter("all")}
        />
        {VENUES.map((v) => (
          <VenueChip
            key={v.id}
            label={v.label}
            active={venueFilter === v.id}
            onClick={() => setVenueFilter(v.id)}
          />
        ))}
      </div>

      <GuestListResults
        key={`${date}-${venueFilter}`}
        date={date}
        venueFilter={venueFilter}
      />
    </div>
  );
}

function GuestListResults({
  date,
  venueFilter,
}: {
  date: string;
  venueFilter: string;
}) {
  const [reservations, setReservations] = useState<ReservationRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const params = new URLSearchParams({ date });
    if (venueFilter !== "all") params.set("venue", venueFilter);

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
  }, [date, venueFilter]);

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
          No guests for this date{venueFilter !== "all" ? " at this venue" : ""}.
        </p>
      </GlassCard>
    );
  }

  return (
    <ul className="space-y-3">
      {reservations.map((r) => (
        <li key={r.id}>
          <GlassCard className="!p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <p className="truncate text-base font-semibold text-hop-white">
                  {r.guestName}
                </p>
                <p className="mt-0.5 text-sm text-hop-white/45">{r.mobileNo}</p>
              </div>
              <div className="shrink-0 text-right">
                <span
                  className={`inline-block rounded-full border px-2.5 py-0.5 text-[0.65rem] font-medium uppercase tracking-wide ${
                    r.entryType === "reserved"
                      ? "border-hop-green/40 bg-hop-green/15 text-hop-green"
                      : "border-white/15 bg-white/5 text-hop-white/55"
                  }`}
                >
                  {reservationEntryTypeLabel(r.entryType)}
                </span>
                <p className="mt-1.5 text-lg font-bold text-hop-green-light">
                  {r.partySize}
                  <span className="ml-1 text-[0.65rem] font-normal text-hop-white/40">
                    pax
                  </span>
                </p>
              </div>
            </div>

            <div className="mt-2">
              <span className="inline-block rounded-full border border-hop-green/30 bg-hop-green/10 px-2.5 py-0.5 text-[0.65rem] font-medium uppercase tracking-wide text-hop-green">
                {reservationVenueLabel(r.venue)}
              </span>
            </div>

            <div className="mt-3 flex items-center justify-between border-t border-white/5 pt-3 text-[0.65rem] text-hop-white/35">
              <span>{r.staffType}</span>
              <span>{formatTime(r.createdAt)}</span>
            </div>

            <WhatsAppButton
              guestName={r.guestName}
              mobileNo={r.mobileNo}
              partySize={r.partySize}
              venue={r.venue}
              entryType={r.entryType}
              className="mt-3 w-full"
            />
          </GlassCard>
        </li>
      ))}
    </ul>
  );
}

function VenueChip({
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
          ? "border border-hop-green/50 bg-hop-green/20 text-hop-green-light shadow-[0_0_20px_rgba(174,201,176,0.2)]"
          : "border border-white/10 bg-white/5 text-hop-white/50 hover:border-hop-green/25"
      }`}
    >
      {label}
    </button>
  );
}
