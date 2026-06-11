const IST_OFFSET = "+05:30";

/** Combine yyyy-mm-dd + HH:mm (24h) as IST instant. */
export function combineISTDateTime(date: string, time24: string): string {
  return new Date(`${date}T${time24}:00${IST_OFFSET}`).toISOString();
}

export function todayDateString(): string {
  return new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });
}

export function tomorrowDateString(): string {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });
}

export function daysAgoDateString(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });
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
