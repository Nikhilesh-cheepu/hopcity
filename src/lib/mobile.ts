/** Valid Indian mobile: 10 digits starting with 6–9. */
const INDIAN_MOBILE_REGEX = /^[6-9]\d{9}$/;

/**
 * Normalize pasted or typed Indian mobiles to 10 digits.
 * Accepts +91, 91, spaces, dashes, leading 0, etc.
 */
export function normalizeIndianMobile(input: string): string | null {
  let digits = input.replace(/\D/g, "");
  if (!digits) return null;

  // 0 + 10 digits (e.g. 09876543210)
  if (digits.length === 11 && digits.startsWith("0")) {
    digits = digits.slice(1);
  }

  // Country code 91 + 10 digits
  if (digits.length === 12 && digits.startsWith("91")) {
    digits = digits.slice(2);
  }

  // Rare: 0 + 91 + 10 digits
  if (digits.length === 13 && digits.startsWith("091")) {
    digits = digits.slice(3);
  }

  if (!INDIAN_MOBILE_REGEX.test(digits)) {
    return null;
  }

  return digits;
}

/** wa.me expects country code + number, no + sign (e.g. 919876543210). */
export function formatMobileForWhatsApp(mobile: string): string {
  const normalized = normalizeIndianMobile(mobile);
  if (normalized) return `91${normalized}`;

  const digits = mobile.replace(/\D/g, "");
  if (digits.length === 12 && digits.startsWith("91")) return digits;
  if (digits.length === 10) return `91${digits}`;

  return digits;
}

/** Display/storage: always 10 digits when valid. */
export function formatMobileDisplay(mobile: string): string {
  return normalizeIndianMobile(mobile) ?? mobile.replace(/\D/g, "");
}

export function isValidIndianMobile(input: string): boolean {
  return normalizeIndianMobile(input) !== null;
}
