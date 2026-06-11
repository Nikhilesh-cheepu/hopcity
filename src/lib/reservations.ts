import { getEntryTypeLabel, getVenueLabel } from "@/data/venues";

export type ReservationRecord = {
  id: string;
  staffType: string;
  entryType: string;
  guestName: string;
  mobileNo: string;
  partySize: number;
  venue: string;
  visitDate: string;
  createdAt: string;
};

export function formatVisitDate(dateStr: string): string {
  const d = new Date(`${dateStr}T12:00:00`);
  return d.toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function formatDateRangeLabel(from: string, to: string): string {
  if (from === to) return formatVisitDate(from);
  return `${formatVisitDate(from)} – ${formatVisitDate(to)}`;
}

export function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function reservationVenueLabel(venue: string): string {
  return getVenueLabel(venue);
}

export function reservationEntryTypeLabel(entryType: string): string {
  return getEntryTypeLabel(entryType);
}

export function parseVisitDate(dateStr: string): Date {
  return new Date(`${dateStr}T12:00:00.000Z`);
}

export function parseDateRange(from: string, to: string): { gte: Date; lte: Date } {
  const gte = parseVisitDate(from);
  const lte = parseVisitDate(to);
  if (gte > lte) {
    throw new Error("Invalid date range");
  }
  return { gte, lte };
}
