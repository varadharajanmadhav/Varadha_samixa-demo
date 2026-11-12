import { hashPassword, type UserStore } from "../users/userStore.ts";

export const MAX_FAILED_LOGINS = 5;
export const LOCKOUT_MS = 15 * 60 * 1000;

export type LoginResult =
  | { ok: true; userId: string }
  | { ok: false; reason: "invalid_credentials" | "locked" };

export function login(
  store: UserStore,
  email: string,
  password: string,
  now: number = Date.now(),
): LoginResult {
  const user = store.findByEmail(email);
  if (!user) {
    return { ok: false, reason: "invalid_credentials" };
  }

  if (user.lockedUntil !== null && now < user.lockedUntil) {
    return { ok: false, reason: "locked" };
  }

  if (hashPassword(password, user.salt) !== user.passwordHash) {
    user.failedLogins += 1;
    if (user.failedLogins >= MAX_FAILED_LOGINS) {
      user.lockedUntil = now + LOCKOUT_MS;
      user.failedLogins = 0;
    }
    return { ok: false, reason: "invalid_credentials" };
  }

  user.failedLogins = 0;
  user.lockedUntil = null;
  return { ok: true, userId: user.id };
}
