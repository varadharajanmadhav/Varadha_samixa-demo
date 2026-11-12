import { createHash, randomBytes } from "node:crypto";

export interface User {
  id: string;
  email: string;
  passwordHash: string;
  salt: string;
  failedLogins: number;
  lockedUntil: number | null;
}

export function hashPassword(password: string, salt: string): string {
  return createHash("sha256").update(salt + ":" + password).digest("hex");
}

export class UserStore {
  private readonly users = new Map<string, User>();

  add(email: string, password: string): User {
    const salt = randomBytes(8).toString("hex");
    const user: User = {
      id: randomBytes(6).toString("hex"),
      email: email.toLowerCase(),
      passwordHash: hashPassword(password, salt),
      salt,
      failedLogins: 0,
      lockedUntil: null,
    };
    this.users.set(user.email, user);
    return user;
  }

  findByEmail(email: string): User | undefined {
    return this.users.get(email.toLowerCase());
  }

  setPassword(user: User, password: string): void {
    user.salt = randomBytes(8).toString("hex");
    user.passwordHash = hashPassword(password, user.salt);
  }
}
