import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

test("README documents direct package installs without generated adapters", async () => {
  const body = await readFile("README.md", "utf8");

  assert.match(body, /Software Design Plugin/);
  assert.match(body, /single installable package/i);
  assert.match(body, /Claude Code/);
  assert.match(body, /Codex/);
  assert.match(body, /OpenCode/);
  assert.match(body, /\.claude-plugin\/plugin\.json/);
  assert.match(body, /\.codex-plugin\/plugin\.json/);
  assert.match(body, /\.opencode\/INSTALL\.md/);
  assert.match(body, /\.opencode\/plugins\/software-design\.js/);
  assert.match(body, /npm run validate/);
  assert.match(body, /npm test/);
  assert.match(body, /npm run check/);
  assert.doesNotMatch(body, /npm run generate/);
  assert.doesNotMatch(body, /adapters\//);
});
