import assert from "node:assert/strict";
import { test } from "node:test";
import { GetObjectCommand, HeadObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { COMPANY_PROFILE_MAX_BYTES, validateCompanyProfile } from "./company-profile-file";
import { downloadCompanyProfile, getCompanyProfile, uploadCompanyProfile } from "./r2";
import { GET } from "../app/company-profile/route";

// All R2 requests in this file are intercepted. No real bucket is accessed.
process.env.R2_ACCOUNT_ID = "test-account";
process.env.R2_ACCESS_KEY_ID = "test-key";
process.env.R2_SECRET_ACCESS_KEY = "test-secret";
process.env.R2_BUCKET_NAME = "test-bucket";

test("company profile rejects missing, empty, oversized, and disguised documents", async () => {
  assert.ok(await validateCompanyProfile(null));
  assert.ok(await validateCompanyProfile("https://example.com/profile.pdf"));
  assert.ok(await validateCompanyProfile(new File([], "empty.pdf", { type: "application/pdf" })));
  assert.ok(await validateCompanyProfile(new File([new Uint8Array(COMPANY_PROFILE_MAX_BYTES + 1)], "large.pdf", { type: "application/pdf" })));
  assert.ok(await validateCompanyProfile(new File(["<script>alert(1)</script>"], "fake.pdf", { type: "application/pdf" })));
  assert.ok(await validateCompanyProfile(new File(["%PDF-1.7"], "fake.html", { type: "application/pdf" })));
  assert.ok(await validateCompanyProfile(new File(["%PDF-1.7"], "profile.pdf", { type: "text/html" })));
  assert.equal(await validateCompanyProfile(new File(["%PDF-1.7"], "Profile.PDF", { type: "application/pdf" })), null);
});

test("replacing the profile overwrites the same R2 object and preserves Unicode filenames", async (t) => {
  const commands: PutObjectCommand[] = [];
  t.mock.method(S3Client.prototype, "send", async (command: PutObjectCommand) => {
    assert.ok(command instanceof PutObjectCommand);
    commands.push(command);
    return {};
  });
  await uploadCompanyProfile(new File(["%PDF-1.7 old"], "old.pdf", { type: "application/pdf" }));
  const profile = await uploadCompanyProfile(new File(["%PDF-1.7 new"], "Company – 2026.pdf", { type: "application/pdf" }));
  assert.equal(commands.length, 2);
  assert.equal(commands[0].input.Key, commands[1].input.Key);
  assert.equal(commands[1].input.CacheControl, "no-store");
  assert.equal(commands[1].input.ContentType, "application/pdf");
  assert.equal(decodeURIComponent(commands[1].input.Metadata!.filename), profile.filename);
  assert.equal(new TextDecoder().decode(commands[1].input.Body as Uint8Array), "%PDF-1.7 new");
});

test("metadata distinguishes an absent profile from a storage failure", async (t) => {
  t.mock.method(S3Client.prototype, "send", async (command: HeadObjectCommand) => {
    assert.ok(command instanceof HeadObjectCommand);
    return { ContentLength: 1234, Metadata: { filename: encodeURIComponent("Company – 2026.pdf") }, LastModified: new Date("2026-10-13T00:00:00Z") };
  });
  assert.deepEqual(await getCompanyProfile(), { filename: "Company – 2026.pdf", size: 1234, updatedAt: "2026-10-13T00:00:00.000Z" });
  t.mock.restoreAll();
  t.mock.method(S3Client.prototype, "send", async () => { throw Object.assign(new Error("missing"), { name: "NotFound" }); });
  assert.equal(await getCompanyProfile(), null);
  t.mock.restoreAll();
  t.mock.method(S3Client.prototype, "send", async () => { throw new Error("AccessDenied"); });
  await assert.rejects(getCompanyProfile, /AccessDenied/);
});

test("download streams the PDF as an attachment without caching stale versions", async (t) => {
  t.mock.method(S3Client.prototype, "send", async (command: GetObjectCommand) => {
    assert.ok(command instanceof GetObjectCommand);
    return { Body: { transformToWebStream: () => new ReadableStream({
      start(controller) {
        controller.enqueue(new TextEncoder().encode("%PDF-1.7 current"));
        controller.close();
      },
    }) } };
  });
  const response = await GET();
  assert.equal(response.status, 200);
  assert.equal(response.headers.get("Content-Type"), "application/pdf");
  assert.equal(response.headers.get("Content-Disposition"), 'attachment; filename="Vectrae-Company-Profile.pdf"');
  assert.equal(response.headers.get("Cache-Control"), "no-store");
  assert.equal(await response.text(), "%PDF-1.7 current");
});

test("download returns 404 when no profile has been uploaded", async (t) => {
  t.mock.method(S3Client.prototype, "send", async () => { throw Object.assign(new Error("missing"), { name: "NoSuchKey" }); });
  assert.equal(await downloadCompanyProfile(), null);
  assert.equal((await GET()).status, 404);
});
