import test from "node:test";
import assert from "node:assert/strict";
import { access, readFile, readdir } from "node:fs/promises";
import { join } from "node:path";

const forbiddenRoutingPhrases = [
  ["one", "to", "three"].join(" "),
  ["1", "3"].join("-"),
  ["Load only", "the matching workflow skill"].join(" "),
  ["load only", "the matching workflow skill"].join(" "),
];
const forbiddenArchitecturePhrases = [
  ["core", "agent.md"].join("/"),
  ["generated", "adapter"].join(" "),
  ["adapter", "copy"].join(" "),
  ["adapter", "copies"].join(" "),
  ["adapter", "trees"].join(" "),
  ["adapters", ""].join("/"),
  ["scripts", "generate.mjs"].join("/"),
  ["scripts", "lib"].join("/"),
  ["3", "adapters"].join(" "),
];
const forbiddenRepositoryPhrases = [...forbiddenRoutingPhrases, ...forbiddenArchitecturePhrases];
const legacyArchitecturePaths = [
  "core",
  "adapters",
  ["scripts", "generate.mjs"].join("/"),
  ["scripts", "lib"].join("/"),
  join("docs", "superpowers", "plans", "2026-05-25-software-design-plugin.md"),
  join("docs", "superpowers", "specs", "2026-05-25-software-design-plugin-design.md"),
  join("docs", "superpowers", "plans", "2026-05-25-single-source-plugin-redesign.md"),
  join("docs", "superpowers", "specs", "2026-05-25-single-source-plugin-redesign-design.md"),
];

const scannedExtensions = new Set([".md", ".mjs", ".js", ".json"]);
const ignoredDirectories = new Set([".git", "node_modules"]);

async function listTextFiles(directory) {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (!ignoredDirectories.has(entry.name)) {
        files.push(...(await listTextFiles(join(directory, entry.name))));
      }
    } else if (entry.isFile() && scannedExtensions.has(entry.name.slice(entry.name.lastIndexOf(".")))) {
      files.push(join(directory, entry.name));
    }
  }

  return files.sort();
}

async function pathExists(path) {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

test("root AGENTS.md describes the single-source orchestrator package", async () => {
  const body = await readFile("AGENTS.md", "utf8");

  assert.match(body, /Software Design Orchestrator/);
  assert.match(body, /primary skills/);
  assert.match(body, /code-smell-diagnosis/);
  assert.match(body, /solid-principles/);
  assert.match(body, /dry-kiss-yagni/);
  assert.match(body, /relevant catalog cards/);
  assert.match(body, /catalog\//);
  assert.match(body, /single source of truth/i);
  assert.doesNotMatch(body, /core\/agent\.md/);
});

test("repository text avoids stale routing and architecture references", async () => {
  const files = await listTextFiles(".");

  for (const file of files) {
    const body = await readFile(file, "utf8");
    for (const phrase of forbiddenRepositoryPhrases) {
      assert.ok(!body.includes(phrase), `${file} should not contain ${phrase}`);
    }
  }
});

test("legacy architecture artifacts are absent", async () => {
  for (const path of legacyArchitecturePaths) {
    assert.equal(await pathExists(path), false, `${path} should not exist`);
  }
});

test("package metadata exposes the OpenCode plugin entry point", async () => {
  const pkg = JSON.parse(await readFile("package.json", "utf8"));

  assert.equal(pkg.main, ".opencode/plugins/software-design.js");
  assert.equal(pkg.scripts.test, "node --test tests/*.test.mjs");
  assert.equal(pkg.scripts.validate, "node scripts/validate.mjs");
  assert.equal(pkg.scripts.check, "npm test && npm run validate");
  assert.equal(pkg.scripts.generate, undefined);
});
