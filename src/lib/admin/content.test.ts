import assert from "node:assert/strict";
import { test } from "node:test";
import { parseBlogContent } from "./content";

test("rejects content shapes that would crash reading-time calculation or public rendering", () => {
  for (const value of ["{}", "[null]", '[{"type":"list","items":"bad"}]', '[{"type":"heading","text":42}]', '[{"type":"paragraph","text":{"x":1}}]', '[{"type":"quote","text":"OK","attribution":{}}]', '[{"type":"html","text":"bad"}]', JSON.stringify(Array(101).fill({ type: "paragraph", text: "OK" }))]) {
    assert.deepEqual(parseBlogContent(value), []);
  }
});

test("preserves supported text and lists while discarding unexpected properties", () => {
  const content = [{ type: "heading", text: "Title" }, { type: "paragraph", text: "Body", ignored: "value" }, { type: "quote", text: "Quote", attribution: "Team" }, { type: "list", items: ["One", "Two"] }];
  assert.deepEqual(parseBlogContent(JSON.stringify(content)), content.map(({ ...block }) => {
    delete (block as { ignored?: string }).ignored;
    return block;
  }));
});
