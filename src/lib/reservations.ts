import { getBookingSourceLabel, getEntryTypeLabel, getVenueLabel } from "@/data/venues";
import { getServiceWindow, serviceWindowShort, type ServiceWindow } from "@/lib/service-windows";

const IST = "Asia/Kolkata";

export type ReservationRecord = {
  id: string;
  staffType: string;
  entryType: string;
  bookingSource: string;
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
    timeZone: IST,
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
    timeZone: IST,
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

export function formatDateTimeIST(iso: string): string {
  return new Date(iso).toLocaleString("en-IN", {
    timeZone: IST,
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

export function getReservationServiceWindow(iso: string): ServiceWindow {
  return getServiceWindow(iso);
}

export function reservationServiceWindowLabel(iso: string): string {
  return serviceWindowShort(getServiceWindow(iso));
}

export function reservationVenueLabel(venue: string): string {
  return getVenueLabel(venue);
}

export function reservationEntryTypeLabel(entryType: string): string {
  return getEntryTypeLabel(entryType);
}

export function reservationBookingSourceLabel(
  bookingSource: string | null | undefined,
): string {
  return getBookingSourceLabel(bookingSource);
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
