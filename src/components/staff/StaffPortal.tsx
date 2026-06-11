"use client";

import { useState, type ReactNode } from "react";
import { todayDateString } from "@/data/venues";
import { ClearDataButton } from "./ClearDataButton";
import { DateField, DateRangeFields } from "./DateField";
import { EntryForm } from "./EntryForm";
import { FollowUpTab } from "./FollowUpTab";
import { GuestList } from "./GuestList";
import { SendReportButton } from "./SendReportButton";
import { TodayStats } from "./TodayStats";

type Tab = "entry" | "guests" | "followup";

export function StaffPortal() {
  const [tab, setTab] = useState<Tab>("entry");
  const today = todayDateString();
  const [dateFrom, setDateFrom] = useState(today);
  const [dateTo, setDateTo] = useState(today);
  const [refreshKey, setRefreshKey] = useState(0);

  function handleEntrySuccess() {
    setRefreshKey((k) => k + 1);
  }

  function handleFromChange(value: string) {
    setDateFrom(value);
    if (value > dateTo) setDateTo(value);
  }

  function handleToChange(value: string) {
    setDateTo(value);
    if (value < dateFrom) setDateFrom(value);
  }

  return (
    <div className="mx-auto w-full max-w-lg space-y-4 pb-8 sm:max-w-xl lg:max-w-2xl">
      <header className="text-center">
        <p className="hop-text-brand text-[0.65rem] font-semibold uppercase tracking-[0.28em]">
          Staff Portal
        </p>
        <h1 className="mt-1 text-xl font-bold text-hop-white sm:text-2xl">
          Guest Reservations
        </h1>
      </header>

      <div className="rounded-xl border border-hop-green/15 bg-white/[0.03] px-4 py-3 shadow-[0_4px_24px_rgba(0,0,0,0.35)]">
        <p className="mb-2 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-hop-green/80">
          {tab === "entry" ? "Entry Date" : "Date Range"}
        </p>
        {tab === "entry" ? (
          <DateField
            value={dateFrom}
            onChange={handleFromChange}
            quickPicks={["today", "tomorrow"]}
          />
        ) : (
          <DateRangeFields
            from={dateFrom}
            to={dateTo}
            onFromChange={handleFromChange}
            onToChange={handleToChange}
          />
        )}
      </div>

      <div className="flex rounded-2xl border border-hop-green/15 bg-black/40 p-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
        <TabButton active={tab === "entry"} onClick={() => setTab("entry")}>
          Entry
        </TabButton>
        <TabButton active={tab === "guests"} onClick={() => setTab("guests")}>
          Guests
        </TabButton>
        <TabButton active={tab === "followup"} onClick={() => setTab("followup")}>
          Follow-up
        </TabButton>
      </div>

      {tab === "entry" ? (
        <EntryForm date={dateFrom} onSuccess={handleEntrySuccess} />
      ) : tab === "guests" ? (
        <>
          <TodayStats
            key={`stats-${refreshKey}-${dateFrom}-${dateTo}`}
            from={dateFrom}
            to={dateTo}
          />
          <SendReportButton from={dateFrom} to={dateTo} />
          <GuestList
            key={`guests-${refreshKey}-${dateFrom}-${dateTo}`}
            from={dateFrom}
            to={dateTo}
          />
          <ClearDataButton onCleared={() => setRefreshKey((k) => k + 1)} />
        </>
      ) : (
        <FollowUpTab
          key={`followup-${refreshKey}-${dateFrom}-${dateTo}`}
          from={dateFrom}
          to={dateTo}
          refreshKey={refreshKey}
        />
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
          ? "hop-tab-active"
          : "text-hop-white/45 hover:text-hop-white/70"
      }`}
    >
      {children}
    </button>
  );
}
