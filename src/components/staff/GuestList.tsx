"use client";

import { useEffect, useState } from "react";
import { VENUES } from "@/data/venues";
import {
  formatTime,
  reservationEntryTypeLabel,
  reservationServiceWindowLabel,
  reservationVenueLabel,
  type ReservationRecord,
} from "@/lib/reservations";
import { getServiceWindow } from "@/lib/service-windows";
import { GlassCard } from "./GlassCard";

export function GuestList({ from, to }: { from: string; to: string }) {
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
        key={`${from}-${to}-${venueFilter}`}
        from={from}
        to={to}
        venueFilter={venueFilter}
      />
    </div>
  );
}

function GuestListResults({
  from,
  to,
  venueFilter,
}: {
  from: string;
  to: string;
  venueFilter: string;
}) {
  const [reservations, setReservations] = useState<ReservationRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const params = new URLSearchParams({ from, to });
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
  }, [from, to, venueFilter]);

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
          No guests for this period{venueFilter !== "all" ? " at this venue" : ""}.
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

            <div className="mt-2 flex flex-wrap gap-2">
              <span className="inline-block rounded-full border border-[#74c274]/30 bg-[#74c274]/10 px-2.5 py-0.5 text-[0.65rem] font-medium uppercase tracking-wide text-[#74c274]">
                {reservationVenueLabel(r.venue)}
              </span>
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
          ? "border border-[#74c274] bg-[#74c274]/20 text-[#85d985] shadow-[0_0_20px_rgba(116,194,116,0.3)]"
          : "border border-white/10 bg-white/5 text-hop-white/50 hover:border-hop-green/25"
      }`}
    >
      {label}
    </button>
  );
}
