import assert from "node:assert/strict";
import { test } from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { isLeadershipId, parseLeadershipForm } from "./leadership-input";
import { defaultLeadership, splitLeadership } from "@/data/leadership";
import AboutLeadershipClient from "@/components/sections/about/AboutLeadershipClient";

function form(values: Record<string, string> = {}) {
  const result = new FormData();
  for (const [key, value] of Object.entries({ name: " Example member ", designation: " Director ", sortOrder: "2", ...values })) {
    result.set(key, value);
  }
  return result;
}

test("validates and normalizes new and edited member fields", () => {
  const parsed = parseLeadershipForm(form({ id: defaultLeadership[0].id, isFeatured: "on",
    imageUrl: "https://images.example/member.webp", linkedinUrl: "https://www.linkedin.com/in/example", bio: "Biography" }));
  assert.ok(parsed.values);
  assert.equal(parsed.values.name, "Example member");
  assert.equal(parsed.values.designation, "Director");
  assert.equal(parsed.values.sortOrder, 2);
  assert.equal(parsed.values.isFeatured, true);
  assert.equal(parsed.values.bio, "Biography");
  assert.equal(parseLeadershipForm(form()).values?.imageUrl, "");
  assert.equal(parseLeadershipForm(form({ imageUrl: "/images/team/photo.png" })).error, undefined);
});

test("rejects invalid IDs, empty names, long biographies and invalid ordering", () => {
  const invalidInputs: Record<string, string>[] = [{ id: "----" }, { name: " " }, { designation: "" },
    { bio: "x".repeat(5001) }, { sortOrder: "-1" }, { sortOrder: "2.5" }, { sortOrder: "abc" }];
  for (const invalid of invalidInputs) {
    assert.ok(parseLeadershipForm(form(invalid)).error);
  }
  assert.equal(isLeadershipId("-".repeat(36)), false);
  assert.equal(isLeadershipId(defaultLeadership[0].id), true);
});

test("rejects unsafe image links and LinkedIn lookalike domains", () => {
  for (const imageUrl of ["javascript:alert(1)", "//evil.example/photo.png", "http://images.example/photo.png", "https://user:pass@images.example/photo.png"]) {
    assert.ok(parseLeadershipForm(form({ imageUrl })).error);
  }
  for (const linkedinUrl of ["javascript:alert(1)", "https://linkedin.com.evil.example/profile", "https://notlinkedin.com/profile"]) {
    assert.ok(parseLeadershipForm(form({ linkedinUrl })).error);
  }
});

test("featured selection supports an empty section and a team without a featured member", () => {
  assert.deepEqual(splitLeadership([]), { featured: undefined, team: [] });
  const normal = splitLeadership(defaultLeadership);
  assert.equal(normal.featured?.name, "Dinesh Kamra");
  assert.equal(normal.team.length, 6);
  const unfeatured = defaultLeadership.map((member) => ({ ...member, isFeatured: false }));
  assert.equal(splitLeadership(unfeatured).team.length, 7);
});

test("public leadership renders edited records and photos instead of hardcoded profiles", () => {
  const member = { ...defaultLeadership[0], name: "Updated member", designation: "Updated role",
    bio: "An updated biography", imageUrl: "https://images.example/new-photo.webp",
    linkedinUrl: "https://www.linkedin.com/in/updated" };
  const html = renderToStaticMarkup(createElement(AboutLeadershipClient, { members: [member] }));
  assert.ok(html.includes("Updated member"));
  assert.ok(html.includes("Updated role"));
  assert.ok(html.includes("An updated biography"));
  assert.ok(html.includes("https://images.example/new-photo.webp"));
  assert.ok(html.includes("https://www.linkedin.com/in/updated"));
  assert.ok(!html.includes("Dinesh Kamra"));
  assert.equal(renderToStaticMarkup(createElement(AboutLeadershipClient, { members: [] })), "");
});
