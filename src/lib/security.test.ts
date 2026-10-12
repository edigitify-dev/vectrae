import assert from "node:assert/strict";
import { test } from "node:test";
import { escapeHtml, isSafeAssetUrl, isSameOriginRequest, isUuid, safeExternalUrl } from "./security";

test("rejects executable, credential-bearing and malformed external URLs", () => {
  for (const value of ["javascript:alert(1)", "java\nscript:alert(1)", "data:text/html,test", "//evil.example", "https://user:pass@example.com", "https://example.com\\@evil.example", "https://example.com/\r\n", "x".repeat(2049), null]) {
    assert.equal(safeExternalUrl(value), null, String(value));
  }
  assert.equal(safeExternalUrl("https://example.com/resume.pdf?x=1&y=2"), "https://example.com/resume.pdf?x=1&y=2");
  assert.equal(safeExternalUrl("http://example.com/resume"), "http://example.com/resume");
  assert.equal(isSafeAssetUrl("/images/photo.webp"), true);
  assert.equal(isSafeAssetUrl("https://images.example/photo.webp"), true);
  assert.equal(isSafeAssetUrl("//evil.example/photo.webp"), false);
  assert.equal(isSafeAssetUrl("javascript:alert(1)"), false);
});

test("escapes HTML text and attributes in form notification emails", () => {
  assert.equal(escapeHtml('<a href="x">\'&'), "&lt;a href=&quot;x&quot;&gt;&#39;&amp;");
});

test("cookie-authenticated API writes require the same origin", () => {
  const request = (origin?: string, site?: string) => new Request("https://vectrae.com/api/admin/upload", {
    method: "POST", headers: { ...(origin ? { origin } : {}), ...(site ? { "sec-fetch-site": site } : {}) },
  });
  assert.equal(isSameOriginRequest(request("https://vectrae.com", "same-origin")), true);
  for (const origin of [undefined, "null", "https://evil.example", "https://vectrae.com.evil.example", "http://vectrae.com"]) {
    assert.equal(isSameOriginRequest(request(origin)), false);
  }
  assert.equal(isSameOriginRequest(request("https://vectrae.com", "cross-site")), false);
});

test("validates IDs before they reach UUID database columns", () => {
  assert.equal(isUuid("5d902d8e-a146-4fd7-962a-b4804fcc1357"), true);
  for (const id of ["", "----", "not-a-uuid", "' OR 1=1", null, 10]) assert.equal(isUuid(id), false);
});
