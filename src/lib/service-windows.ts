export type ServiceWindow = "lunch" | "dinner" | "off-hours";

export const LUNCH_WINDOW_LABEL = "12 PM – 6 PM";
export const DINNER_WINDOW_LABEL = "6 PM – 12:30 AM";

const IST = "Asia/Kolkata";

export function getISTMinutes(iso: string): number {
  const parts = new Intl.DateTimeFormat("en-IN", {
    timeZone: IST,
    hour: "numeric",
    minute: "numeric",
    hour12: false,
  }).formatToParts(new Date(iso));

  const hour = Number(parts.find((p) => p.type === "hour")?.value ?? 0);
  const minute = Number(parts.find((p) => p.type === "minute")?.value ?? 0);
  return hour * 60 + minute;
}

/** Lunch 12:00–6:00 PM IST · Dinner 6:00 PM–12:30 AM IST */
export function getServiceWindow(iso: string): ServiceWindow {
  const minutes = getISTMinutes(iso);

  if (minutes >= 18 * 60 || minutes <= 30) {
    return "dinner";
  }
  if (minutes >= 12 * 60 && minutes < 18 * 60) {
    return "lunch";
  }
  return "off-hours";
}

export function serviceWindowLabel(window: ServiceWindow): string {
  switch (window) {
    case "lunch":
      return `Lunch (${LUNCH_WINDOW_LABEL})`;
    case "dinner":
      return `Dinner (${DINNER_WINDOW_LABEL})`;
    default:
      return "Off-hours";
  }
}

export function serviceWindowShort(window: ServiceWindow): string {
  switch (window) {
    case "lunch":
      return "Lunch";
    case "dinner":
      return "Dinner";
    default:
      return "Off-hours";
  }
}

export type WindowStats = {
  entries: number;
  guests: number;
};

export function emptyWindowStats(): Record<ServiceWindow, WindowStats> {
  return {
    lunch: { entries: 0, guests: 0 },
    dinner: { entries: 0, guests: 0 },
    "off-hours": { entries: 0, guests: 0 },
  };
}

export function addToWindowStats(
  stats: Record<ServiceWindow, WindowStats>,
  iso: string,
  partySize: number,
): void {
  const window = getServiceWindow(iso);
  stats[window].entries += 1;
  stats[window].guests += partySize;
}
