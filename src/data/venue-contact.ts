/** Shared help & feedback contact for all outlets. */
export const VENUE_HELP_CONTACT = {
  name: "Anil Pavuluri",
  mobile: "7073456789",
} as const;

export function formatHelpContactLine(): string {
  return `For any help or feedback, please contact ${VENUE_HELP_CONTACT.name} at ${VENUE_HELP_CONTACT.mobile}.`;
}
