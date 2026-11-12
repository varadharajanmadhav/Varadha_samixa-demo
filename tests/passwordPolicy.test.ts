import { test } from "node:test";
import assert from "node:assert/strict";
import { validatePassword } from "../src/utils/passwordPolicy.ts";

test("a password without a digit is rejected", () => {
  assert.deepEqual(validatePassword("abcdefgh"), { ok: false, reason: "needs_digit" });
});

test("a password without a letter is rejected", () => {
  assert.deepEqual(validatePassword("12345678"), { ok: false, reason: "needs_letter" });
});

test("a valid 8-character password is accepted", () => {
  assert.deepEqual(validatePassword("abcd1234"), { ok: true });
});

// DEMO-1 is open: there is deliberately no test for the 7-character boundary yet.
