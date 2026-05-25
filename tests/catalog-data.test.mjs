import test from "node:test";
import assert from "node:assert/strict";
import { allItems, patterns, principles, refactorings, smells } from "../scripts/lib/catalog.mjs";

test("catalog contains the approved coverage", () => {
  assert.equal(principles.length, 8);
  assert.equal(patterns.length, 22);
  assert.equal(smells.length, 23);
  assert.equal(refactorings.length, 66);
  assert.equal(allItems.length, 119);
});

test("catalog paths and slugs are unique", () => {
  assert.equal(new Set(allItems.map((item) => item.slug)).size, allItems.length);
  assert.equal(new Set(allItems.map((item) => item.path)).size, allItems.length);
});

test("catalog items include required metadata", () => {
  for (const item of allItems) {
    assert.ok(item.title, "title is required");
    assert.ok(item.slug, `${item.title} slug is required`);
    assert.ok(item.kind, `${item.title} kind is required`);
    assert.ok(item.group, `${item.title} group is required`);
    assert.ok(item.path, `${item.title} path is required`);
    assert.ok(item.sourceUrl, `${item.title} sourceUrl is required`);
  }
});
