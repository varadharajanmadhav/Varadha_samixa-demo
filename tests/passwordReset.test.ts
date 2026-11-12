import { test } from "node:test";
import assert from "node:assert/strict";
import { UserStore } from "../src/users/userStore.ts";
import { FakeEmailSender } from "../src/notifications/emailSender.ts";
import { PasswordResetService, RESET_TOKEN_TTL_MS } from "../src/auth/passwordReset.ts";
import { login } from "../src/auth/login.ts";

function setup() {
  const store = new UserStore();
  store.add("ana@example.test", "secret123");
  const email = new FakeEmailSender();
  return { store, email, service: new PasswordResetService(store, email) };
}

function tokenFrom(body: string): string {
  return new URL(body).searchParams.get("token") ?? "";
}

test("reset email contains a link with a token", () => {
  const { email, service } = setup();
  service.requestReset("ana@example.test");
  assert.equal(email.sent.length, 1);
  assert.match(email.sent[0].body, /token=/);
});

test("unknown email gets the same neutral response and no email", () => {
  const { email, service } = setup();
  assert.deepEqual(service.requestReset("nobody@example.test"), { accepted: true });
  assert.equal(email.sent.length, 0);
});

test("token resets the password once", () => {
  const { store, email, service } = setup();
  service.requestReset("ana@example.test", 0);
  const token = tokenFrom(email.sent[0].body);
  assert.deepEqual(service.completeReset(token, "newpass99", 1), { ok: true });
  assert.equal(login(store, "ana@example.test", "newpass99").ok, true);
  assert.deepEqual(service.completeReset(token, "another99", 2), { ok: false, reason: "already_used" });
});

test("token expires after 60 minutes", () => {
  const { email, service } = setup();
  service.requestReset("ana@example.test", 0);
  const token = tokenFrom(email.sent[0].body);
  assert.deepEqual(service.completeReset(token, "newpass99", RESET_TOKEN_TTL_MS + 1), { ok: false, reason: "expired" });
});
