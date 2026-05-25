import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, readdir, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { generateCatalog } from "../scripts/generate.mjs";

async function countMarkdownFiles(directory) {
  let count = 0;
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) {
      count += await countMarkdownFiles(path);
    } else if (entry.isFile() && entry.name.endsWith(".md")) {
      count += 1;
    }
  }
  return count;
}

test("generateCatalog writes all catalog cards", async () => {
  const root = await mkdtemp(join(tmpdir(), "software-design-catalog-"));
  try {
    const count = await generateCatalog(root);
    assert.equal(count, 119);
    assert.equal(await countMarkdownFiles(join(root, "catalog")), 119);

    const strategy = await readFile(join(root, "catalog/patterns/behavioral/strategy.md"), "utf8");
    assert.match(strategy, /^# Strategy/m);
    assert.match(strategy, /Use when:/);
    assert.match(strategy, /Avoid when:/);
    assert.match(strategy, /Apply:/);
    assert.match(strategy, /Verify:/);
    assert.match(strategy, /Related:/);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
