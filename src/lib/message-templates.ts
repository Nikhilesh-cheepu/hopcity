import { getSpecialOccasionLabel } from "@/data/occasions";
import { VENUE_HELP_CONTACT } from "@/data/venue-contact";
import { getVenueLabel } from "@/data/venues";
import { formatVisitDate } from "@/lib/reservations";

export type MessageTemplateKind = "followup" | "review" | "reminder";

type TemplateContext = {
  guestName: string;
  venue: string;
  visitDate: string;
  specialOccasion?: string | null;
  specialOccasionLabel?: string | null;
};

const TEMPLATES: Record<MessageTemplateKind, string> = {
  followup: `Hello {guestName}!

Thank you for visiting *{venue}*. We hope your {occasion} was wonderful and that you had a memorable time with us.

If you need any help or would like to share feedback, please reach out to *{contactName}* at *{contactMobile}* — available for all our outlets.

We would love to welcome you back again soon.

Warm wishes,
Team {venue}`,

  review: `Hello {guestName}!

Thank you for dining with us at *{venue}* on {visitDate}. We hope you enjoyed your experience.

Your feedback and reviews mean a lot to us. If you have a moment, we would truly appreciate hearing from you.

For any help, please contact *{contactName}* at *{contactMobile}*.

Thank you for choosing us,
Team {venue}`,

  reminder: `Hello {guestName}!

This is a friendly reminder from *Team {venue}*. We look forward to connecting with you again.

If you need anything in the meantime, please contact *{contactName}* at *{contactMobile}*.

Warm regards,
Team {venue}`,
};

export const MESSAGE_TEMPLATE_LABELS: Record<MessageTemplateKind, string> = {
  followup: "Follow-up",
  review: "Ask review",
  reminder: "Reminder",
};

function occasionPhrase(ctx: TemplateContext): string {
  const label = getSpecialOccasionLabel(ctx.specialOccasion, ctx.specialOccasionLabel);
  if (!label) return "visit";
  return label.toLowerCase();
}

export function buildTemplateMessage(
  kind: MessageTemplateKind,
  ctx: TemplateContext,
): string {
  const venueLabel = getVenueLabel(ctx.venue);
  return TEMPLATES[kind]
    .replaceAll("{guestName}", ctx.guestName)
    .replaceAll("{venue}", venueLabel)
    .replaceAll("{occasion}", occasionPhrase(ctx))
    .replaceAll("{visitDate}", formatVisitDate(ctx.visitDate))
    .replaceAll("{contactName}", VENUE_HELP_CONTACT.name)
    .replaceAll("{contactMobile}", VENUE_HELP_CONTACT.mobile);
}
