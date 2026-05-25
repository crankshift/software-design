import test from "node:test";
import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import { join, relative, sep } from "node:path";

const expectedCatalogCounts = new Map([
  ["principles", 8],
  ["patterns", 22],
  ["smells", 23],
  ["refactorings", 66],
]);

const cardSections = ["Use when:", "Avoid when:", "Apply:", "Verify:", "Related:"];

async function listMarkdownFiles(directory) {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await listMarkdownFiles(path)));
    } else if (entry.isFile() && entry.name.endsWith(".md")) {
      files.push(path);
    }
  }
  return files.sort();
}

test("catalog contains the approved coverage as canonical files", async () => {
  const files = await listMarkdownFiles("catalog");
  const counts = new Map([...expectedCatalogCounts].map(([kind]) => [kind, 0]));

  for (const file of files) {
    const [kind] = relative("catalog", file).split(sep);
    if (counts.has(kind)) {
      counts.set(kind, counts.get(kind) + 1);
    }
  }

  assert.equal(files.length, 119);
  for (const [kind, expected] of expectedCatalogCounts) {
    assert.equal(counts.get(kind), expected, `catalog/${kind} should contain ${expected} cards`);
  }
});

test("catalog file paths are unique", async () => {
  const files = await listMarkdownFiles("catalog");
  assert.equal(new Set(files).size, files.length);
});

test("catalog cards include required sections", async () => {
  for (const file of await listMarkdownFiles("catalog")) {
    const body = await readFile(file, "utf8");
    for (const section of cardSections) {
      assert.ok(body.includes(section), `${file} should contain ${section}`);
    }
  }
});
