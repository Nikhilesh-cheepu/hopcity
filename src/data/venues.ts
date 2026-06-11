export const VENUES = [
  { id: "c53", label: "C53" },
  { id: "boilerroom", label: "Boiler Room" },
  { id: "firefly", label: "Firefly" },
  { id: "thehub", label: "The Hub" },
] as const;

export type VenueId = (typeof VENUES)[number]["id"];

export const STAFF_TYPES = [
  "Host",
  "Reception",
  "Floor Manager",
  "Server",
  "Security",
] as const;

export type StaffType = (typeof STAFF_TYPES)[number];

export const ENTRY_TYPES = [
  { id: "walkin", label: "Walk-in" },
  { id: "reserved", label: "Reserved" },
] as const;

export type EntryType = (typeof ENTRY_TYPES)[number]["id"];

export const BOOKING_SOURCES = [
  { id: "direct", label: "Direct" },
  { id: "swiggy", label: "Swiggy" },
  { id: "zomato", label: "Zomato" },
  { id: "call", label: "Call" },
  { id: "eatos", label: "Eatos" },
  { id: "other", label: "Others" },
] as const;

/** Shown in the reserved check-in dropdown (walk-ins use direct). */
export const RESERVED_BOOKING_SOURCES = BOOKING_SOURCES.filter((s) => s.id !== "direct");

export type BookingSource = (typeof BOOKING_SOURCES)[number]["id"];
export type ReservedBookingSource = (typeof RESERVED_BOOKING_SOURCES)[number]["id"];

const BOOKING_SOURCE_PREFIX = "other:";

export function formatOtherBookingSource(label: string): string {
  return `${BOOKING_SOURCE_PREFIX}${label.trim()}`;
}

export function isOtherBookingSource(id: string): boolean {
  return id === "other" || id.startsWith(BOOKING_SOURCE_PREFIX);
}

export function parseOtherBookingSourceLabel(id: string): string {
  if (id.startsWith(BOOKING_SOURCE_PREFIX)) return id.slice(BOOKING_SOURCE_PREFIX.length);
  return "";
}

export function getVenueLabel(id: string): string {
  return VENUES.find((v) => v.id === id)?.label ?? id;
}

export function getEntryTypeLabel(id: string): string {
  return ENTRY_TYPES.find((e) => e.id === id)?.label ?? id;
}

export function getBookingSourceLabel(id: string): string {
  const custom = parseOtherBookingSourceLabel(id);
  if (custom) return custom;
  return BOOKING_SOURCES.find((s) => s.id === id)?.label ?? id;
}

export function todayDateString(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
