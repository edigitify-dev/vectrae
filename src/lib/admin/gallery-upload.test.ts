import assert from "node:assert/strict";
import { test } from "node:test";
import { galleryImageError, uploadGalleryImages, type GalleryUploadEntry } from "./gallery-upload";

function entry(name: string): GalleryUploadEntry {
  return {
    id: name, file: new File(["image"], name, { type: "image/png" }),
    previewUrl: "", alt: `Alt for ${name}`, caption: `Caption for ${name}`, status: "ready",
  };
}

function queue(...names: string[]) {
  const entries = names.map(entry);
  return {
    entries,
    onUpdate(id: string, update: Partial<GalleryUploadEntry>) {
      Object.assign(entries.find((item) => item.id === id)!, update);
    },
  };
}

test("accepts supported images and rejects empty, oversized and unsupported files", () => {
  for (const type of ["image/jpeg", "image/png", "image/webp", "image/avif"]) {
    assert.equal(galleryImageError({ size: 8 * 1024 * 1024, type }), undefined);
  }
  assert.match(galleryImageError({ size: 0, type: "image/png" })!, /non-empty/);
  assert.match(galleryImageError({ size: 8 * 1024 * 1024 + 1, type: "image/png" })!, /8 MB/);
  assert.match(galleryImageError({ size: 10, type: "application/pdf" })!, /JPG/);
});

test("continues after an upload failure and saves each image with its own metadata", async () => {
  const state = queue("one.png", "two.png", "three.png");
  const calls: string[] = [];
  const result = await uploadGalleryImages({
    ...state, categoryId: "events",
    upload: async (file) => {
      calls.push(`upload:${file.name}`);
      if (file.name === "two.png") throw new Error("Connection lost");
      return `https://images.example/${file.name}`;
    },
    saveImage: async (form) => {
      const name = String(form.get("url")).split("/").at(-1)!;
      calls.push(`save:${name}`);
      assert.equal(form.get("categoryId"), "events");
      assert.equal(form.get("alt"), `Alt for ${name}`);
      assert.equal(form.get("caption"), `Caption for ${name}`);
      return { success: name };
    },
  });
  assert.deepEqual(result, { saved: 2, failed: 1 });
  assert.deepEqual(calls, ["upload:one.png", "save:one.png", "upload:two.png", "upload:three.png", "save:three.png"]);
  assert.deepEqual(state.entries.map((item) => item.status), ["saved", "error", "saved"]);
  assert.equal(state.entries[1].error, "Connection lost");
});

test("retry skips confirmed saves and reuses an uploaded URL after a save failure", async () => {
  const state = queue("one.png", "two.png");
  const uploads: string[] = [];
  let rejectSave = true;
  const savedUrls: string[] = [];
  const options = {
    ...state, categoryId: "projects",
    upload: async (file: File) => { uploads.push(file.name); return `https://images.example/${file.name}`; },
    saveImage: async (form: FormData) => {
      const url = String(form.get("url"));
      if (rejectSave && url.endsWith("two.png")) return { error: "Database unavailable" };
      savedUrls.push(url);
      return { success: url };
    },
  };
  assert.deepEqual(await uploadGalleryImages(options), { saved: 1, failed: 1 });
  assert.equal(state.entries[1].url, "https://images.example/two.png");
  rejectSave = false;
  assert.deepEqual(await uploadGalleryImages(options), { saved: 1, failed: 0 });
  assert.deepEqual(uploads, ["one.png", "two.png"]);
  assert.deepEqual(savedUrls, ["https://images.example/one.png", "https://images.example/two.png"]);
  assert.deepEqual(state.entries.map((item) => item.status), ["saved", "saved"]);
  assert.equal(state.entries[1].error, undefined);
});

test("invalid selections never reach the upload API or database", async () => {
  const state = queue("empty.png");
  state.entries[0].file = new File([], "empty.png", { type: "image/png" });
  const result = await uploadGalleryImages({
    ...state, categoryId: "events",
    upload: async () => { assert.fail("Invalid image reached uploader"); },
    saveImage: async () => { assert.fail("Invalid image reached database"); },
  });
  assert.deepEqual(result, { saved: 0, failed: 1 });
  assert.equal(state.entries[0].status, "error");
});

test("reports API errors and malformed responses without saving broken URLs", async (context) => {
  const responses = [
    Response.json({ error: "Unauthorized" }, { status: 401 }),
    new Response("Upload temporarily unavailable", { status: 503 }),
    Response.json({ url: null }),
  ];
  context.mock.method(globalThis, "fetch", async () => responses.shift()!);
  const state = queue("one.png", "two.png", "three.png");
  const result = await uploadGalleryImages({
    ...state, categoryId: "events",
    saveImage: async () => { assert.fail("Failed upload reached database"); },
  });
  assert.deepEqual(result, { saved: 0, failed: 3 });
  assert.equal(state.entries[0].error, "Unauthorized");
  assert.ok(state.entries.every((item) => item.status === "error" && !item.url));
});
