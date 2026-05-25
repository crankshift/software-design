import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

test("root AGENTS.md provides cross-platform orchestrator instructions", async () => {
  const body = await readFile("AGENTS.md", "utf8");
  assert.match(body, /Software Design Orchestrator/);
  assert.match(body, /primary skills/);
  assert.match(body, /one to three catalog cards/);
  assert.match(body, /catalog\//);
});

test("root README remains present", async () => {
  const body = await readFile("README.md", "utf8");
  assert.match(body, /Software Design Plugin/);
});
