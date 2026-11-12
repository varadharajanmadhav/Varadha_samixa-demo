import { test } from "node:test";
import assert from "node:assert/strict";
import { UserStore } from "../src/users/userStore.ts";
import { login, MAX_FAILED_LOGINS, LOCKOUT_MS } from "../src/auth/login.ts";

test("valid credentials sign in", () => {
  const store = new UserStore();
  const user = store.add("ana@example.test", "secret123");
  assert.deepEqual(login(store, "ANA@example.test", "secret123"), { ok: true, userId: user.id });
});

test("wrong password is rejected", () => {
  const store = new UserStore();
  store.add("ana@example.test", "secret123");
  assert.deepEqual(login(store, "ana@example.test", "nope"), { ok: false, reason: "invalid_credentials" });
});

test("account locks after the maximum failed attempts and unlocks later", () => {
  const store = new UserStore();
  store.add("ana@example.test", "secret123");
  const t0 = 1_000_000;
  for (let i = 0; i < MAX_FAILED_LOGINS; i++) login(store, "ana@example.test", "nope", t0);
  assert.deepEqual(login(store, "ana@example.test", "secret123", t0 + 1), { ok: false, reason: "locked" });
  assert.equal(login(store, "ana@example.test", "secret123", t0 + LOCKOUT_MS + 1).ok, true);
});
