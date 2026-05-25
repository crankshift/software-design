import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

test("README documents purpose, generation, validation, and installs", async () => {
  const body = await readFile("README.md", "utf8");
  assert.match(body, /Software Design Plugin/);
  assert.match(body, /Claude Code/);
  assert.match(body, /Codex/);
  assert.match(body, /OpenCode/);
  assert.match(body, /npm run generate/);
  assert.match(body, /npm run validate/);
  assert.match(body, /Node\.js 20\+|Node >=20/);
  assert.match(body, /npm test/);
  assert.match(body, /npm run check/);
  assert.match(body, /adapters\/claude-code\/\.claude-plugin\/plugin\.json/);
  assert.match(body, /adapters\/claude-code\/agents\/software-design\.md/);
  assert.match(body, /adapters\/codex\/AGENTS\.md/);
  assert.match(body, /adapters\/opencode\/opencode\.jsonc/);
  assert.match(body, /instructions: \["AGENTS\.md"\]/);
  assert.match(body, /skills\.paths: \["skills"\]/);
});
