import { randomBytes } from "node:crypto";
import type { UserStore } from "../users/userStore.ts";
import type { EmailSender } from "../notifications/emailSender.ts";
import { validatePassword } from "../utils/passwordPolicy.ts";

export const RESET_TOKEN_TTL_MS = 60 * 60 * 1000;
export const RESET_LINK_BASE = "https://portal.example.test/reset-password";

interface ResetToken {
  email: string;
  expiresAt: number;
  used: boolean;
}

export type CompleteResetResult =
  | { ok: true }
  | { ok: false; reason: "invalid_token" | "expired" | "already_used" | "too_short" | "needs_digit" | "needs_letter" };

export class PasswordResetService {
  private readonly tokens = new Map<string, ResetToken>();
  private readonly store: UserStore;
  private readonly email: EmailSender;

  constructor(store: UserStore, email: EmailSender) {
    this.store = store;
    this.email = email;
  }

  /**
   * "Forgot password". Always returns the same neutral response so callers
   * cannot tell whether the account exists.
   */
  requestReset(email: string, now: number = Date.now()): { accepted: true } {
    const user = this.store.findByEmail(email);
    if (user) {
      const token = randomBytes(16).toString("hex");
      this.tokens.set(token, { email: user.email, expiresAt: now + RESET_TOKEN_TTL_MS, used: false });
      this.email.send(user.email, "Reset your password", `${RESET_LINK_BASE}?token=${token}`);
    }
    return { accepted: true };
  }

  completeReset(token: string, newPassword: string, now: number = Date.now()): CompleteResetResult {
    const entry = this.tokens.get(token);
    if (!entry) return { ok: false, reason: "invalid_token" };
    if (entry.used) return { ok: false, reason: "already_used" };
    if (now > entry.expiresAt) return { ok: false, reason: "expired" };

    const policy = validatePassword(newPassword);
    if (!policy.ok) return { ok: false, reason: policy.reason };

    const user = this.store.findByEmail(entry.email);
    if (!user) return { ok: false, reason: "invalid_token" };

    this.store.setPassword(user, newPassword);
    entry.used = true;
    return { ok: true };
  }
}
