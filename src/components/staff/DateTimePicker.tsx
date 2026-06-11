"use client";

import {
  combineISTDateTime,
  defaultReminderTime,
  TIME_OPTIONS,
  todayDateString,
} from "@/lib/datetime-ui";
import { DateField } from "./DateField";

const selectClass =
  "w-full rounded-lg border border-hop-green/20 bg-black/50 px-3 py-2.5 text-sm text-hop-white outline-none focus:border-hop-green/50 [color-scheme:dark]";

export function DateTimePicker({
  date,
  time,
  onDateChange,
  onTimeChange,
}: {
  date: string;
  time: string;
  onDateChange: (date: string) => void;
  onTimeChange: (time: string) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-2">
      <DateField
        label="Date"
        value={date}
        onChange={onDateChange}
        quickPicks={["today", "tomorrow"]}
      />
      <div>
        <span className="mb-2 block text-[0.6rem] font-semibold uppercase tracking-wide text-hop-white/40">
          Time (IST)
        </span>
        <select
          value={time}
          onChange={(e) => onTimeChange(e.target.value)}
          className={selectClass}
          required
        >
          {TIME_OPTIONS.map((t) => (
            <option key={t.value} value={t.value} className="bg-hop-black">
              {t.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

export function useReminderDateTimeDefaults() {
  return {
    date: todayDateString(),
    time: defaultReminderTime(),
  };
}

export function reminderDateTimeToISO(date: string, time: string): string {
  return combineISTDateTime(date, time);
}
