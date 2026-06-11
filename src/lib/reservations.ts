import { getVenueLabel } from "@/data/venues";

export type ReservationRecord = {
  id: string;
  staffType: string;
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

export function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function reservationVenueLabel(venue: string): string {
  return getVenueLabel(venue);
}

export function parseVisitDate(dateStr: string): Date {
  return new Date(`${dateStr}T00:00:00.000Z`);
}
