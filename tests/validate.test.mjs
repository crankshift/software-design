import test from "node:test";
import assert from "node:assert/strict";
import { cp, mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { validateProject } from "../scripts/validate.mjs";

const fixtureEntries = [
  "AGENTS.md",
  "README.md",
  "package.json",
  ".claude-plugin",
  ".codex-plugin",
  ".opencode",
  "catalog",
  "skills",
];

async function copyCanonicalFixture(root) {
  for (const entry of fixtureEntries) {
    await cp(entry, join(root, entry), { recursive: true });
  }
}

test("validateProject accepts canonical package fixtures", async () => {
  const root = await mkdtemp(join(tmpdir(), "software-design-validate-"));
  try {
    await copyCanonicalFixture(root);
    const result = await validateProject(root);

    assert.equal(result.cardCount, 119);
    assert.equal(result.skillCount, 7);
    assert.equal(result.platformCount, 3);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test("validateProject rejects missing canonical skill files", async () => {
  const root = await mkdtemp(join(tmpdir(), "software-design-validate-"));
  try {
    await copyCanonicalFixture(root);
    await rm(join(root, "skills/solid-principles/SKILL.md"));

    await assert.rejects(() => validateProject(root), /Missing or unreadable file/);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test("validateProject rejects missing canonical catalog card files", async () => {
  const root = await mkdtemp(join(tmpdir(), "software-design-validate-"));
  try {
    await copyCanonicalFixture(root);
    await rm(join(root, "catalog/principles/solid/single-responsibility.md"));

    await assert.rejects(() => validateProject(root), /catalog should contain 119 markdown cards/);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test("validateProject rejects Claude Code plugin author that is not an object with name", async () => {
  const root = await mkdtemp(join(tmpdir(), "software-design-validate-"));
  try {
    await copyCanonicalFixture(root);
    const pluginPath = join(root, ".claude-plugin/plugin.json");
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

test("validateProject rejects legacy package-output trees", async () => {
  const root = await mkdtemp(join(tmpdir(), "software-design-validate-"));
  try {
    await copyCanonicalFixture(root);
    await mkdir(join(root, "adapters", "opencode"), { recursive: true });

    await assert.rejects(() => validateProject(root), /legacy architecture/i);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test("validateProject rejects legacy core prompt files", async () => {
  const root = await mkdtemp(join(tmpdir(), "software-design-validate-"));
  try {
    await copyCanonicalFixture(root);
    await mkdir(join(root, "core"), { recursive: true });
    await writeFile(join(root, "core", "agent.md"), "# Legacy\n", "utf8");

    await assert.rejects(() => validateProject(root), /legacy architecture/i);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test("validateProject rejects old capped routing instructions", async () => {
  const root = await mkdtemp(join(tmpdir(), "software-design-validate-"));
  try {
    await copyCanonicalFixture(root);
    const agentsPath = join(root, "AGENTS.md");
    const cappedCards = ["one", "to", "three"].join(" ");
    const oldWorkflow = ["Load only", "the matching workflow skill"].join(" ");
    const body = await readFile(agentsPath, "utf8");
    await writeFile(agentsPath, `${body}\n${oldWorkflow}. Load ${cappedCards} catalog cards.\n`, "utf8");

    await assert.rejects(() => validateProject(root), /old capped routing/i);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
