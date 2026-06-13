const IST = "Asia/Kolkata";
const IST_OFFSET = "+05:30";

/** Earliest date for "All time" guest history. */
export const ALL_TIME_FROM_DATE = "2025-01-01";

/** Combine yyyy-mm-dd + HH:mm (24h) as IST instant. */
export function combineISTDateTime(date: string, time24: string): string {
  return new Date(`${date}T${time24}:00${IST_OFFSET}`).toISOString();
}

export function todayDateString(): string {
  return new Date().toLocaleDateString("en-CA", { timeZone: IST });
}

export function addDaysToDateString(dateStr: string, days: number): string {
  const base = new Date(`${dateStr}T12:00:00${IST_OFFSET}`);
  base.setUTCDate(base.getUTCDate() + days);
  return base.toLocaleDateString("en-CA", { timeZone: IST });
}

export function tomorrowDateString(): string {
  return addDaysToDateString(todayDateString(), 1);
}

export function daysAgoDateString(days: number): string {
  return addDaysToDateString(todayDateString(), -days);
}

/** 12:00–23:30 IST in 30-minute steps. */
export function buildTimeOptions(): { value: string; label: string }[] {
  const options: { value: string; label: string }[] = [];
  for (let h = 12; h <= 23; h++) {
    for (const m of [0, 30]) {
      const value = `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
      const hour12 = h % 12 === 0 ? 12 : h % 12;
      const ampm = h < 12 ? "am" : "pm";
      const label = `${hour12}:${String(m).padStart(2, "0")} ${ampm}`;
      options.push({ value, label });
    }
  }
  return options;
}

export const TIME_OPTIONS = buildTimeOptions();

export function defaultReminderTime(): string {
  return "18:00";
}
