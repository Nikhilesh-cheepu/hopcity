"use client";

import {
  ALL_TIME_FROM_DATE,
  daysAgoDateString,
  todayDateString,
  tomorrowDateString,
} from "@/lib/datetime-ui";

const inputClass =
  "w-full rounded-lg border border-hop-green/20 bg-black/50 px-3 py-2.5 text-sm text-hop-white outline-none focus:border-hop-green/50 focus:shadow-[0_0_16px_rgba(116,194,116,0.12)] [color-scheme:dark]";

export function DateField({
  value,
  onChange,
  min,
  max,
  quickPicks = ["today", "tomorrow"],
  label,
}: {
  value: string;
  onChange: (value: string) => void;
  min?: string;
  max?: string;
  quickPicks?: ("today" | "tomorrow")[];
  label?: string;
}) {
  const today = todayDateString();
  const tomorrow = tomorrowDateString();

  return (
    <div className="space-y-2">
      {label && (
        <span className="block text-[0.6rem] font-semibold uppercase tracking-wide text-hop-white/40">
          {label}
        </span>
      )}
      {quickPicks.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {quickPicks.includes("today") && (
            <QuickChip active={value === today} onClick={() => onChange(today)}>
              Today
            </QuickChip>
          )}
          {quickPicks.includes("tomorrow") && (
            <QuickChip
              active={value === tomorrow}
              onClick={() => onChange(tomorrow)}
              disabled={Boolean(max && tomorrow > max)}
            >
              Tomorrow
            </QuickChip>
          )}
        </div>
      )}
      <input
        type="date"
        value={value}
        min={min}
        max={max}
        onChange={(e) => onChange(e.target.value)}
        className={inputClass}
      />
    </div>
  );
}

export function DateRangeFields({
  from,
  to,
  onFromChange,
  onToChange,
}: {
  from: string;
  to: string;
  onFromChange: (value: string) => void;
  onToChange: (value: string) => void;
}) {
  const today = todayDateString();
  const last7 = daysAgoDateString(6);

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        <QuickChip
          active={from === today && to === today}
          onClick={() => {
            onFromChange(today);
            onToChange(today);
          }}
        >
          Today
        </QuickChip>
        <QuickChip
          active={from === last7 && to === today}
          onClick={() => {
            onFromChange(last7);
            onToChange(today);
          }}
        >
          Last 7 days
        </QuickChip>
        <QuickChip
          active={from === ALL_TIME_FROM_DATE && to === today}
          onClick={() => {
            onFromChange(ALL_TIME_FROM_DATE);
            onToChange(today);
          }}
        >
          All time
        </QuickChip>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <DateField
          label="From"
          value={from}
          max={to}
          onChange={onFromChange}
          quickPicks={[]}
        />
        <DateField
          label="To"
          value={to}
          min={from}
          onChange={onToChange}
          quickPicks={[]}
        />
      </div>
    </div>
  );
}

function QuickChip({
  children,
  active,
  onClick,
  disabled,
}: {
  children: React.ReactNode;
  active: boolean;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`rounded-full px-3 py-1.5 text-xs font-semibold transition disabled:opacity-40 ${
        active
          ? "border border-[#74c274] bg-[#74c274]/20 text-[#85d985]"
          : "border border-white/10 bg-white/5 text-hop-white/50 hover:border-hop-green/25"
      }`}
    >
      {children}
    </button>
  );
}
