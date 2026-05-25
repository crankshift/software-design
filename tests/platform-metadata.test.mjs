import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

test("Claude Code plugin manifest lives at the repository root", async () => {
  const plugin = JSON.parse(await readFile(".claude-plugin/plugin.json", "utf8"));

  assert.equal(plugin.name, "software-design");
  assert.equal(plugin.version, "0.1.0");
  assert.match(plugin.description, /software design/i);
  assert.deepEqual(plugin.author, { name: "software-design contributors" });
});

test("Codex plugin manifest points at the canonical skills directory", async () => {
  const plugin = JSON.parse(await readFile(".codex-plugin/plugin.json", "utf8"));

  assert.equal(plugin.name, "software-design");
  assert.equal(plugin.version, "0.1.0");
  assert.equal(plugin.skills, "./skills/");
  assert.equal(plugin.interface.displayName, "Software Design");
  assert.match(plugin.interface.longDescription, /catalog/i);
});

test("OpenCode install docs describe plugin loading from this package", async () => {
  const body = await readFile(".opencode/INSTALL.md", "utf8");

  assert.match(body, /Installing Software Design Plugin for OpenCode/);
  assert.match(body, /\[OpenCode\.ai\]\(https:\/\/opencode\.ai\) installed/);
  assert.match(body, /Add software-design-plugin to the `plugin` array/);
  assert.match(body, /software-design-plugin@git\+https:\/\/github\.com\//);
  assert.match(body, /Restart OpenCode\. The plugin installs through OpenCode's plugin manager and\s+registers all skills\./);
  assert.match(body, /Verify by asking: "Tell me about software design"/);
  assert.match(body, /Migrating from the old symlink-based install/);
  assert.match(body, /rm -f ~\/\.config\/opencode\/plugins\/software-design\.js/);
  assert.match(body, /use skill tool to load software-design\/software-design-orchestrator/);
  assert.match(body, /To pin a specific version:/);
  assert.match(body, /opencode run --print-logs "hello" 2>&1 \| grep -i software-design/);
  assert.match(body, /Windows install issues/);
  assert.match(body, /Tool mapping/);
  assert.match(body, /Getting Help/);
});

test("OpenCode plugin glue registers the root skills directory", async () => {
  const body = await readFile(".opencode/plugins/software-design.js", "utf8");

  assert.match(body, /export const SoftwareDesignPlugin/);
  assert.match(body, /\.\.\/\.\.\/skills/);
  assert.match(body, /config\.skills/);
  assert.match(body, /config\.skills\.paths/);
});
