import { getEntryTypeLabel, getVenueLabel } from "@/data/venues";

export function buildGuestWhatsAppMessage({
  guestName,
  partySize,
  venue,
  entryType,
}: {
  guestName: string;
  partySize: number;
  venue: string;
  entryType: string;
}): string {
  const venueLabel = getVenueLabel(venue);
  const typeLabel = getEntryTypeLabel(entryType);

  return `Hello ${guestName}! Welcome to Hopcity Brew Co. 🍺

Your ${typeLabel.toLowerCase()} for ${partySize} guest${partySize > 1 ? "s" : ""} at ${venueLabel} is confirmed.

The World in Your Glass — we can't wait to host you!

— Hopcity Team
Sarath City Capital Mall, 5th Floor, Hyderabad`;
}

export function whatsAppUrl(mobileNo: string, message: string): string {
  const digits = mobileNo.replace(/\D/g, "");
  const phone = digits.length === 10 ? `91${digits}` : digits;
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}
