"use client";

import { useEffect, useState } from "react";
import { VENUES } from "@/data/venues";
import { formatVisitDate } from "@/lib/reservations";
import { GlassCard } from "./GlassCard";

type Stats = {
  totalEntries: number;
  totalGuests: number;
  byVenue: Record<string, { entries: number; guests: number }>;
};

export function TodayStats({ date }: { date: string }) {
  return <TodayStatsInner key={date} date={date} />;
}

function TodayStatsInner({ date }: { date: string }) {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    fetch(`/api/reservations/stats?date=${date}`)
      .then((r) => r.json())
      .then((data) => {
        if (!cancelled && !data.error) setStats(data);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [date]);

  return (
    <GlassCard glow className="space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-hop-green">
            Today&apos;s Overview
          </p>
          <p className="mt-1 text-sm text-hop-white/50">{formatVisitDate(date)}</p>
        </div>
        {loading && (
          <span className="text-xs text-hop-white/30 animate-pulse">Updating…</span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl border border-hop-green/20 bg-hop-green/10 px-3 py-3 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
          <p className="text-2xl font-bold text-hop-green-light">
            {stats?.totalGuests ?? "—"}
          </p>
          <p className="mt-0.5 text-[0.65rem] uppercase tracking-wider text-hop-white/45">
            Guests
          </p>
        </div>
        <div className="rounded-xl border border-hop-green/20 bg-hop-green/10 px-3 py-3 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
          <p className="text-2xl font-bold text-hop-green-light">
            {stats?.totalEntries ?? "—"}
          </p>
          <p className="mt-0.5 text-[0.65rem] uppercase tracking-wider text-hop-white/45">
            Entries
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {VENUES.map((v) => (
          <div
            key={v.id}
            className="rounded-xl border border-white/5 bg-black/30 px-2.5 py-2.5 text-center"
          >
            <p className="text-[0.6rem] font-medium uppercase tracking-wide text-hop-white/40">
              {v.label}
            </p>
            <p className="mt-1 text-lg font-semibold text-hop-white">
              {stats?.byVenue[v.id]?.guests ?? 0}
            </p>
            <p className="text-[0.6rem] text-hop-white/30">
              {stats?.byVenue[v.id]?.entries ?? 0} entries
            </p>
          </div>
        ))}
      </div>
    </GlassCard>
  );
}
