export const SPECIAL_OCCASIONS = [
  { id: "birthday", label: "Birthday" },
  { id: "anniversary", label: "Anniversary" },
  { id: "other", label: "Others" },
] as const;

export type SpecialOccasionId = (typeof SPECIAL_OCCASIONS)[number]["id"];

const OTHER_PREFIX = "other:";

export function formatOtherOccasionLabel(label: string): string {
  return `${OTHER_PREFIX}${label.trim()}`;
}

export function getSpecialOccasionLabel(
  id: string | null | undefined,
  customLabel?: string | null,
): string {
  if (!id || id === "none") return "";
  if (id === "other") {
    const fromStored = customLabel?.startsWith(OTHER_PREFIX)
      ? customLabel.slice(OTHER_PREFIX.length)
      : customLabel;
    return fromStored?.trim() || "Special visit";
  }
  return SPECIAL_OCCASIONS.find((o) => o.id === id)?.label ?? id;
}

export function hasSpecialOccasion(id: string | null | undefined): boolean {
  return Boolean(id && id !== "none");
}
