import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { generateAll } from "../scripts/generate.mjs";
import { validateProject } from "../scripts/validate.mjs";

test("validateProject accepts generated project output", async () => {
  const root = await mkdtemp(join(tmpdir(), "software-design-validate-"));
  try {
    await generateAll(root);
    const result = await validateProject(root);
    assert.equal(result.cardCount, 119);
    assert.equal(result.skillCount, 7);
    assert.equal(result.adapterCount, 3);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test("validateProject rejects missing generated adapter skill files", async () => {
  const root = await mkdtemp(join(tmpdir(), "software-design-validate-"));
  try {
    await generateAll(root);
    await rm(join(root, "adapters/claude-code/skills/solid-principles/SKILL.md"));
    await assert.rejects(() => validateProject(root));
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test("validateProject rejects missing generated adapter catalog card files", async () => {
  const root = await mkdtemp(join(tmpdir(), "software-design-validate-"));
  try {
    await generateAll(root);
    await rm(join(root, "adapters/opencode/catalog/principles/solid/single-responsibility.md"));
    await assert.rejects(() => validateProject(root));
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test("validateProject rejects Claude Code plugin author that is not an object with name", async () => {
  const root = await mkdtemp(join(tmpdir(), "software-design-validate-"));
  try {
    await generateAll(root);
    const pluginPath = join(root, "adapters/claude-code/.claude-plugin/plugin.json");
    const plugin = JSON.parse(await readFile(pluginPath, "utf8"));
    plugin.author = "software-design contributors";
    await writeFile(pluginPath, `${JSON.stringify(plugin, null, 2)}\n`, "utf8");

    await assert.rejects(
      () => validateProject(root),
      /Claude Code plugin author should be an object with contributor name/,
    );
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
