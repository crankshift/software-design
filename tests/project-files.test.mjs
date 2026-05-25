import test from "node:test";
import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";

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
  assert.match(body, /one to three catalog cards/);
  assert.match(body, /catalog\//);
  assert.match(body, /single source of truth/i);
  assert.doesNotMatch(body, /generated adapters/i);
});

test("package metadata exposes the OpenCode plugin entry point", async () => {
  const pkg = JSON.parse(await readFile("package.json", "utf8"));

  assert.equal(pkg.main, ".opencode/plugins/software-design.js");
  assert.equal(pkg.scripts.test, "node --test tests/*.test.mjs");
  assert.equal(pkg.scripts.validate, "node scripts/validate.mjs");
  assert.equal(pkg.scripts.check, "npm test && npm run validate");
  assert.equal(pkg.scripts.generate, undefined);
});

test("generated adapter and generator source files are absent", async () => {
  assert.equal(await pathExists("adapters"), false, "adapters/ should not exist");
  assert.equal(await pathExists("scripts/generate.mjs"), false, "scripts/generate.mjs should not exist");
  assert.equal(await pathExists("scripts/lib/catalog.mjs"), false, "scripts/lib/catalog.mjs should not exist");
  assert.equal(await pathExists("scripts/lib/render-card.mjs"), false, "scripts/lib/render-card.mjs should not exist");
});
