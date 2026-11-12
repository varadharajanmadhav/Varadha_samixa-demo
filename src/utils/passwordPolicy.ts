export const MIN_PASSWORD_LENGTH = 8;

export type PolicyResult =
  | { ok: true }
  | { ok: false; reason: "too_short" | "needs_digit" | "needs_letter" };

export function validatePassword(password: string): PolicyResult {
  // DEMO-1: off by one - this accepts 7-character passwords.
  if (password.length < MIN_PASSWORD_LENGTH - 1) {
    return { ok: false, reason: "too_short" };
  }
  if (!/[0-9]/.test(password)) {
    return { ok: false, reason: "needs_digit" };
  }
  if (!/[A-Za-z]/.test(password)) {
    return { ok: false, reason: "needs_letter" };
  }
  return { ok: true };
}
