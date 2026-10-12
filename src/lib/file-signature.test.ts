import assert from "node:assert/strict";
import { test } from "node:test";
import { fileContentMatches, fileHasExpectedSignature } from "./file-signature";

test("rejects HTML disguised using an allowed image or document MIME type", () => {
  const html = new TextEncoder().encode("<script>alert(1)</script>");
  for (const type of ["image/jpeg", "image/png", "image/webp", "image/avif", "application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"]) {
    assert.equal(fileContentMatches(type, html), false);
  }
});

test("accepts expected binary signatures and rejects empty files", async () => {
  const png = new Uint8Array([0x89,0x50,0x4e,0x47,0x0d,0x0a,0x1a,0x0a]);
  assert.equal(fileContentMatches("image/png", png), true);
  assert.equal(fileContentMatches("image/jpeg", new Uint8Array([0xff,0xd8,0xff])), true);
  assert.equal(fileContentMatches("image/webp", new TextEncoder().encode("RIFF1234WEBP")), true);
  assert.equal(fileContentMatches("image/avif", new TextEncoder().encode("0000ftypavif")), true);
  assert.equal(fileContentMatches("application/pdf", new TextEncoder().encode("%PDF-1.7")), true);
  assert.equal(await fileHasExpectedSignature(new File([png], "test.png", { type: "image/png" })), true);
  assert.equal(await fileHasExpectedSignature(new File([], "empty.png", { type: "image/png" })), false);
});
