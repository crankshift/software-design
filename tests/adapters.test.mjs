import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { generateAll } from "../scripts/generate.mjs";

test("generateAll writes Claude Code, Codex, and OpenCode adapters", async () => {
  const root = await mkdtemp(join(tmpdir(), "software-design-adapters-"));
  try {
    const result = await generateAll(root);
    assert.equal(result.catalogCount, 119);
    assert.equal(result.adapterCount, 3);

    const claude = await readFile(join(root, "adapters/claude-code/.claude-plugin/plugin.json"), "utf8");
    const claudePlugin = JSON.parse(claude);
    assert.equal(claudePlugin.name, "software-design");
    assert.deepEqual(claudePlugin.author, { name: "software-design contributors" });

    const claudeAgent = await readFile(join(root, "adapters/claude-code/agents/software-design.md"), "utf8");
    assert.match(claudeAgent, /^---\n/);
    assert.match(claudeAgent, /^name: software-design$/m);
    assert.match(claudeAgent, /^description:/m);
    assert.match(claudeAgent, /^model: inherit$/m);
    assert.match(claudeAgent, /^color: blue$/m);
    assert.match(claudeAgent, /Software Design Orchestrator/);

    const codex = await readFile(join(root, "adapters/codex/AGENTS.md"), "utf8");
    assert.match(codex, /Software Design Orchestrator/);

    const opencode = await readFile(join(root, "adapters/opencode/opencode.jsonc"), "utf8");
    assert.deepEqual(JSON.parse(opencode), {
      $schema: "https://opencode.ai/config.json",
      instructions: ["AGENTS.md"],
      skills: {
        paths: ["skills"],
      },
    });

    const opencodeAgent = await readFile(join(root, "adapters/opencode/AGENTS.md"), "utf8");
    assert.match(opencodeAgent, /Software Design Orchestrator/);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
