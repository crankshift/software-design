import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { allItems } from "./lib/catalog.mjs";

const rootFromHere = dirname(dirname(fileURLToPath(import.meta.url)));

const skills = [
  "software-design-orchestrator",
  "solid-principles",
  "dry-kiss-yagni",
  "pattern-selection",
  "code-smell-diagnosis",
  "refactoring-selection",
  "implementation-review",
];

const adapters = ["claude-code", "codex", "opencode"];

const cardSections = ["Use when:", "Avoid when:", "Apply:", "Verify:", "Related:"];

async function pathExists(path) {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

async function readRequired(path) {
  try {
    return await readFile(path, "utf8");
  } catch (error) {
    throw new Error(`Missing or unreadable file: ${path}`, { cause: error });
  }
}

async function validateCatalog(root) {
  assert.equal(allItems.length, 119, "catalog data should contain 119 items");

  for (const item of allItems) {
    const body = await readRequired(join(root, item.path));
    for (const section of cardSections) {
      assert.ok(body.includes(section), `${item.path} should contain ${section}`);
    }
  }

  return allItems.length;
}

function validateSkillBody(skill, body) {
  assert.ok(body.startsWith("---"), `${skill} should start with frontmatter`);
  assert.match(body, new RegExp(`^name: ${skill}$`, "m"));
  assert.match(body, /^description:/m, `${skill} should have a description`);
  assert.match(body, /^version: 0\.1\.0$/m, `${skill} should have version 0.1.0`);
  assert.match(body, /^# /m, `${skill} should have a Markdown heading`);
  assert.match(body, /catalog\//, `${skill} should reference catalog/`);
  assert.ok(body.length < 3500, `${skill} should stay under 3500 characters`);
}

async function skillPath(root, skill) {
  const generatedPath = join(root, "skills", skill, "SKILL.md");
  return (await pathExists(generatedPath)) ? generatedPath : join(rootFromHere, "skills", skill, "SKILL.md");
}

async function validateSkills(root) {
  for (const skill of skills) {
    const body = await readRequired(await skillPath(root, skill));
    validateSkillBody(skill, body);
  }

  return skills.length;
}

async function validateAdapterCopies(root, adapter) {
  const adapterRoot = join(root, "adapters", adapter);
  await validateCatalog(adapterRoot);

  for (const skill of skills) {
    const body = await readRequired(join(adapterRoot, "skills", skill, "SKILL.md"));
    validateSkillBody(skill, body);
  }
}

async function validateAdapters(root) {
  const plugin = await readRequired(join(root, "adapters/claude-code/.claude-plugin/plugin.json"));
  const claudePlugin = JSON.parse(plugin);
  assert.equal(claudePlugin.name, "software-design");
  assert.deepEqual(
    claudePlugin.author,
    { name: "software-design contributors" },
    "Claude Code plugin author should be an object with contributor name",
  );

  const claudeAgent = await readRequired(join(root, "adapters/claude-code/agents/software-design.md"));
  assert.match(claudeAgent, /^---\n/);
  assert.match(claudeAgent, /^name: software-design$/m);
  assert.match(claudeAgent, /^description:/m);
  assert.match(claudeAgent, /^model: inherit$/m);
  assert.match(claudeAgent, /^color: blue$/m);
  assert.match(claudeAgent, /Software Design Orchestrator/);

  const claudeInstructions = await readRequired(join(root, "adapters/claude-code/AGENTS.md"));
  assert.match(claudeInstructions, /Software Design Orchestrator/);

  const claudeReadme = await readRequired(join(root, "adapters/claude-code/README.md"));
  assert.match(claudeReadme, /Software Design Plugin/);
  assert.match(claudeReadme, /Claude Code/);

  const codexAgent = await readRequired(join(root, "adapters/codex/AGENTS.md"));
  assert.match(codexAgent, /Software Design Orchestrator/);

  const codexReadme = await readRequired(join(root, "adapters/codex/README.md"));
  assert.match(codexReadme, /Software Design Plugin/);
  assert.match(codexReadme, /Codex/);

  const opencodeAgent = await readRequired(join(root, "adapters/opencode/AGENTS.md"));
  assert.match(opencodeAgent, /Software Design Orchestrator/);

  const opencodeReadme = await readRequired(join(root, "adapters/opencode/README.md"));
  assert.match(opencodeReadme, /Software Design Plugin/);
  assert.match(opencodeReadme, /OpenCode/);

  const opencodeConfig = await readRequired(join(root, "adapters/opencode/opencode.jsonc"));
  assert.deepEqual(JSON.parse(opencodeConfig), {
    $schema: "https://opencode.ai/config.json",
    instructions: ["AGENTS.md"],
    skills: {
      paths: ["skills"],
    },
  });

  for (const adapter of adapters) {
    await validateAdapterCopies(root, adapter);
  }

  return adapters.length;
}

export async function validateProject(root = rootFromHere) {
  const cardCount = await validateCatalog(root);
  const skillCount = await validateSkills(root);
  const adapterCount = await validateAdapters(root);
  return { cardCount, skillCount, adapterCount };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const result = await validateProject();
  console.log(`Validation passed: ${result.cardCount} cards, ${result.skillCount} skills, ${result.adapterCount} adapters.`);
}
