"use client";

import { useState, type ReactNode } from "react";
import { todayDateString } from "@/data/venues";
import { EntryForm } from "./EntryForm";
import { GuestList } from "./GuestList";
import { TodayStats } from "./TodayStats";

type Tab = "entry" | "guests";

export function StaffPortal() {
  const [tab, setTab] = useState<Tab>("entry");
  const [date, setDate] = useState(todayDateString);
  const [refreshKey, setRefreshKey] = useState(0);

  function handleEntrySuccess() {
    setRefreshKey((k) => k + 1);
  }

  return (
    <div className="mx-auto w-full max-w-lg space-y-4 pb-8 sm:max-w-xl lg:max-w-2xl">
      <header className="text-center">
        <p className="text-[0.65rem] font-semibold uppercase tracking-[0.28em] text-hop-green">
          Staff Portal
        </p>
        <h1 className="mt-1 text-xl font-bold text-hop-white sm:text-2xl">
          Guest Reservations
        </h1>
      </header>

      <div className="flex items-center justify-between gap-3 rounded-xl border border-hop-green/15 bg-white/[0.03] px-4 py-2.5 shadow-[0_4px_24px_rgba(0,0,0,0.35)]">
        <label
          htmlFor="visitDate"
          className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-hop-green/80"
        >
          Date
        </label>
        <input
          id="visitDate"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="rounded-lg border border-hop-green/20 bg-black/50 px-3 py-2 text-sm text-hop-white outline-none focus:border-hop-green/50 focus:shadow-[0_0_16px_rgba(174,201,176,0.12)]"
        />
      </div>

      <div className="flex rounded-2xl border border-hop-green/15 bg-black/40 p-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
        <TabButton active={tab === "entry"} onClick={() => setTab("entry")}>
          Entry
        </TabButton>
        <TabButton active={tab === "guests"} onClick={() => setTab("guests")}>
          Guest List
        </TabButton>
      </div>

      {tab === "entry" ? (
        <EntryForm date={date} onSuccess={handleEntrySuccess} />
      ) : (
        <>
          <TodayStats key={`stats-${refreshKey}-${date}`} date={date} />
          <GuestList key={`guests-${refreshKey}-${date}`} date={date} />
        </>
      )}
    </div>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex-1 rounded-xl py-3 text-sm font-semibold uppercase tracking-[0.12em] transition ${
        active
          ? "bg-hop-green text-hop-black shadow-[0_4px_20px_rgba(174,201,176,0.35)]"
          : "text-hop-white/45 hover:text-hop-white/70"
      }`}
    >
      {children}
    </button>
  );
}
