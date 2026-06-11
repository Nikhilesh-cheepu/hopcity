"use client";

import { useEffect, useState } from "react";
import { VENUES } from "@/data/venues";
import { formatDateRangeLabel } from "@/lib/reservations";

type Stats = {
  totalEntries: number;
  totalGuests: number;
  walkins: number;
  reserved: number;
  byVenue: Record<string, { entries: number; guests: number }>;
};

export function TodayStats({ from, to }: { from: string; to: string }) {
  return <TodayStatsInner key={`${from}-${to}`} from={from} to={to} />;
}

function TodayStatsInner({ from, to }: { from: string; to: string }) {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    let cancelled = false;
    const params = new URLSearchParams({ from, to });

    fetch(`/api/reservations/stats?${params}`)
      .then((r) => r.json())
      .then((data) => {
        if (!cancelled && !data.error) setStats(data);
      });

    return () => {
      cancelled = true;
    };
  }, [from, to]);

  return (
    <div className="rounded-xl border border-hop-green/15 bg-white/[0.03] px-3 py-2.5 shadow-[0_4px_20px_rgba(0,0,0,0.35)]">
      <p className="mb-1.5 text-[0.6rem] text-hop-white/40">
        {formatDateRangeLabel(from, to)}
      </p>
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
        <span className="font-semibold text-hop-green-light">
          {stats?.totalGuests ?? 0} guests
        </span>
        <span className="text-hop-white/25">·</span>
        <span className="text-hop-white/55">{stats?.totalEntries ?? 0} entries</span>
        <span className="text-hop-white/25">·</span>
        <span className="text-hop-white/45">{stats?.walkins ?? 0} walk-in</span>
        <span className="text-hop-white/25">·</span>
        <span className="text-hop-white/45">{stats?.reserved ?? 0} reserved</span>
      </div>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {VENUES.map((v) => (
          <span
            key={v.id}
            className="rounded-full border border-white/8 bg-black/30 px-2 py-0.5 text-[0.6rem] text-hop-white/50"
          >
            {v.label}{" "}
            <span className="font-medium text-hop-green/80">
              {stats?.byVenue[v.id]?.guests ?? 0}
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
