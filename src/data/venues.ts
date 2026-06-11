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

export function getVenueLabel(id: string): string {
  return VENUES.find((v) => v.id === id)?.label ?? id;
}

export function getEntryTypeLabel(id: string): string {
  return ENTRY_TYPES.find((e) => e.id === id)?.label ?? id;
}

export function todayDateString(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
