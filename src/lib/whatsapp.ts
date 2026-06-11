import { VENUES } from "@/data/venues";
import {
  formatDateRangeLabel,
  formatTime,
  reservationEntryTypeLabel,
  reservationServiceWindowLabel,
  reservationVenueLabel,
  type ReservationRecord,
} from "@/lib/reservations";
import {
  DINNER_WINDOW_LABEL,
  LUNCH_WINDOW_LABEL,
  type ServiceWindow,
  type WindowStats,
} from "@/lib/service-windows";

export type ReportStats = {
  totalEntries: number;
  totalGuests: number;
  walkins: number;
  reserved: number;
  byVenue: Record<string, { entries: number; guests: number }>;
  byWindow?: Record<ServiceWindow, WindowStats>;
};

export function buildStaffReportMessage({
  from,
  to,
  stats,
  reservations,
}: {
  from: string;
  to: string;
  stats: ReportStats;
  reservations: ReservationRecord[];
}): string {
  const lines: string[] = [
    "*HOPCITY GUEST REPORT*",
    formatDateRangeLabel(from, to),
    "_All times IST (Asia/Kolkata)_",
    "",
    "*SUMMARY*",
    `Guests: ${stats.totalGuests}`,
    `Entries: ${stats.totalEntries}`,
    `Walk-in: ${stats.walkins} | Reserved: ${stats.reserved}`,
    "",
    "*SERVICE WINDOWS (IST)*",
    `Lunch (${LUNCH_WINDOW_LABEL}): ${stats.byWindow?.lunch.guests ?? 0} guests (${stats.byWindow?.lunch.entries ?? 0} entries)`,
    `Dinner (${DINNER_WINDOW_LABEL}): ${stats.byWindow?.dinner.guests ?? 0} guests (${stats.byWindow?.dinner.entries ?? 0} entries)`,
  ];

  const offHours = stats.byWindow?.["off-hours"];
  if (offHours && offHours.entries > 0) {
    lines.push(
      `Off-hours: ${offHours.guests} guests (${offHours.entries} entries)`,
    );
  }

  lines.push("", "*BY VENUE*");

  for (const v of VENUES) {
    const row = stats.byVenue[v.id];
    lines.push(`• ${v.label}: ${row?.guests ?? 0} guests (${row?.entries ?? 0} entries)`);
  }

  if (reservations.length > 0) {
    lines.push("", "*GUEST LIST*");
    reservations.forEach((r, i) => {
      lines.push(
        `${i + 1}. ${r.guestName} | ${r.mobileNo} | ${r.partySize} pax | ${reservationVenueLabel(r.venue)} | ${reservationEntryTypeLabel(r.entryType)} | ${reservationServiceWindowLabel(r.createdAt)} | ${formatTime(r.createdAt)} IST`,
      );
    });
  } else {
    lines.push("", "No guest entries in this period.");
  }

  lines.push("", "— Hopcity Staff Portal");

  return lines.join("\n");
}

export function whatsAppUrl(mobileNo: string, message: string): string {
  const digits = mobileNo.replace(/\D/g, "");
  const phone = digits.length === 10 ? `91${digits}` : digits;
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

export function getReportRecipient(): string {
  return process.env.NEXT_PUBLIC_STAFF_REPORT_WHATSAPP ?? "7013884485";
}
