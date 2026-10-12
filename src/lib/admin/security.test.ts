import assert from "node:assert/strict";
import { test } from "node:test";
import { adminPageNumber, canWriteAdmin, isAdminRole, safeAdminPath } from "./security";

test("unknown roles never gain admin or write access", () => {
  assert.equal(canWriteAdmin("owner"), true);
  assert.equal(canWriteAdmin("admin"), true);
  assert.equal(isAdminRole("editor"), true);
  for (const role of ["editor", "OWNER", "disabled", "", null, undefined]) assert.equal(canWriteAdmin(role), false);
  for (const role of ["disabled", "OWNER", "", null, undefined]) assert.equal(isAdminRole(role), false);
});

test("redirects stay inside the admin panel without traversal or login loops", () => {
  assert.equal(safeAdminPath("/admin/enquiries?page=2"), "/admin/enquiries?page=2");
  for (const value of ["https://evil.example", "//evil.example", "/administrator", "/admin/../contact", "/admin/%2e%2e/contact", "/admin/login?next=/admin", "/admin\\evil", "/admin\r\n", null]) {
    assert.equal(safeAdminPath(value), "/admin", String(value));
  }
});

test("pagination rejects fractional, infinite and oversized offsets", () => {
  assert.equal(adminPageNumber("12"), 12);
  assert.equal(adminPageNumber("999999"), 100_000);
  for (const value of ["Infinity", "NaN", "1.5", "-1", "0", "1e9", "9999999999", ["1", "2"], undefined]) assert.equal(adminPageNumber(value), 1);
});
