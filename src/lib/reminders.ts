export type ReminderRecord = {
  id: string;
  reservationId: string | null;
  guestName: string;
  mobileNo: string;
  venue: string | null;
  specialOccasion: string | null;
  specialOccasionLabel: string | null;
  remindAt: string;
  note: string | null;
  status: string;
  createdAt: string;
  completedAt: string | null;
};

const IST = "Asia/Kolkata";

export function formatReminderDateTime(iso: string): string {
  return new Date(iso).toLocaleString("en-IN", {
    timeZone: IST,
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

export function isReminderOverdue(iso: string): boolean {
  return new Date(iso).getTime() < Date.now();
}

export function isReminderToday(iso: string): boolean {
  const d = new Date(iso);
  const now = new Date();
  const fmt = (date: Date) =>
    date.toLocaleDateString("en-CA", { timeZone: IST });
  return fmt(d) === fmt(now);
}
