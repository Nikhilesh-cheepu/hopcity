export const STAFF_SESSION_KEY = "hopcity-staff-authenticated";

export const STAFF_PASSWORD = "staff";

export function isStaffAuthenticated(): boolean {
  if (typeof window === "undefined") return false;
  return sessionStorage.getItem(STAFF_SESSION_KEY) === "1";
}

export function setStaffAuthenticated(): void {
  sessionStorage.setItem(STAFF_SESSION_KEY, "1");
}

export function clearStaffAuthentication(): void {
  sessionStorage.removeItem(STAFF_SESSION_KEY);
}
