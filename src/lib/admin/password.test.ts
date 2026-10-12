import assert from "node:assert/strict";
import { test } from "node:test";
import { describePasswordProblem, hashPassword, MAX_PASSWORD_LENGTH, verifyPassword } from "./password";

test("password verification rejects wrong credentials and malformed hashes", async () => {
  const hash = await hashPassword("ValidPassword1");
  assert.equal(await verifyPassword("ValidPassword1", hash), true);
  assert.equal(await verifyPassword("OtherPassword2", hash), false);
  for (const value of ["", "plain-password", "scrypt$bad$bad", `scrypt$${"z".repeat(32)}$${"0".repeat(128)}`]) {
    assert.equal(await verifyPassword("ValidPassword1", value), false);
  }
  assert.equal(await verifyPassword("x".repeat(MAX_PASSWORD_LENGTH + 1), hash), false);
  assert.ok(describePasswordProblem("Aa1" + "x".repeat(MAX_PASSWORD_LENGTH)));
});
