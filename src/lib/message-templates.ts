import { getSpecialOccasionLabel } from "@/data/occasions";
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

Thank you for celebrating with us at {venue}. We hope your {occasion} was memorable.

Our team would love to welcome you again soon.

Warm wishes,
Team {venue}`,

  review: `Hello {guestName}!

Thank you for visiting {venue}. We hope you had a wonderful time.

If you have a moment, we'd truly appreciate your feedback — it helps us serve you better.

Thank you,
Team {venue}`,

  reminder: `Hello {guestName}!

This is a friendly reminder from Team {venue}. We look forward to seeing you again.

Please let us know if you need anything.

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
    .replaceAll("{visitDate}", formatVisitDate(ctx.visitDate));
}
