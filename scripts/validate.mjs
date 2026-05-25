import assert from "node:assert/strict";
import { access, readdir, readFile } from "node:fs/promises";
import { dirname, join, relative, sep } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

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

const cardSections = ["Use when:", "Avoid when:", "Apply:", "Verify:", "Related:"];

const expectedCatalogCounts = new Map([
  ["principles", 8],
  ["patterns", 22],
  ["smells", 23],
  ["refactorings", 66],
]);

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

async function listMarkdownFiles(directory) {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await listMarkdownFiles(path)));
    } else if (entry.isFile() && entry.name.endsWith(".md")) {
      files.push(path);
    }
  }
  return files.sort();
}

async function validateCatalog(root) {
  const catalogRoot = join(root, "catalog");
  const files = await listMarkdownFiles(catalogRoot);
  assert.equal(files.length, 119, "catalog should contain 119 markdown cards");

  const counts = new Map([...expectedCatalogCounts].map(([kind]) => [kind, 0]));
  for (const file of files) {
    const relativePath = relative(catalogRoot, file);
    const [kind] = relativePath.split(sep);
    if (counts.has(kind)) {
      counts.set(kind, counts.get(kind) + 1);
    }

    const body = await readRequired(file);
    for (const section of cardSections) {
      assert.ok(body.includes(section), `${relative(root, file)} should contain ${section}`);
    }
  }

  for (const [kind, expected] of expectedCatalogCounts) {
    assert.equal(counts.get(kind), expected, `catalog/${kind} should contain ${expected} cards`);
  }

  return files.length;
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

async function validateSkills(root) {
  for (const skill of skills) {
    const body = await readRequired(join(root, "skills", skill, "SKILL.md"));
    validateSkillBody(skill, body);
  }

  return skills.length;
}

async function validateRootInstructions(root) {
  const agents = await readRequired(join(root, "AGENTS.md"));
  assert.match(agents, /Software Design Orchestrator/);
  assert.match(agents, /single source of truth/i);
  assert.match(agents, /primary skills/);
  assert.match(agents, /one to three catalog cards/);
  assert.doesNotMatch(agents, /generated adapters/i);

  const coreAgent = await readRequired(join(root, "core/agent.md"));
  assert.match(coreAgent, /Software Design Orchestrator/);
  assert.match(coreAgent, /KISS/);
  assert.match(coreAgent, /YAGNI/);
  assert.match(coreAgent, /Do not force design patterns/);
}

async function readJson(path) {
  return JSON.parse(await readRequired(path));
}

async function validatePlatformMetadata(root) {
  assert.equal(await pathExists(join(root, "adapters")), false, "adapters/ should not exist");

  const claudePlugin = await readJson(join(root, ".claude-plugin/plugin.json"));
  assert.equal(claudePlugin.name, "software-design");
  assert.equal(claudePlugin.version, "0.1.0");
  assert.deepEqual(
    claudePlugin.author,
    { name: "software-design contributors" },
    "Claude Code plugin author should be an object with contributor name",
  );

  const codexPlugin = await readJson(join(root, ".codex-plugin/plugin.json"));
  assert.equal(codexPlugin.name, "software-design");
  assert.equal(codexPlugin.version, "0.1.0");
  assert.equal(codexPlugin.skills, "./skills/");
  assert.equal(codexPlugin.interface.displayName, "Software Design");

  const opencodeInstall = await readRequired(join(root, ".opencode/INSTALL.md"));
  assert.match(opencodeInstall, /Installing Software Design Plugin for OpenCode/);
  assert.match(opencodeInstall, /Add software-design-plugin to the `plugin` array/);
  assert.match(opencodeInstall, /software-design-plugin@git\+https:\/\/github\.com\/crankshift\/software-design\.git/);
  assert.match(opencodeInstall, /Migrating from the old symlink-based install/);
  assert.match(opencodeInstall, /Tool mapping/);

  const opencodePlugin = await readRequired(join(root, ".opencode/plugins/software-design.js"));
  assert.match(opencodePlugin, /export const SoftwareDesignPlugin/);
  assert.match(opencodePlugin, /\.\.\/\.\.\/skills/);
  assert.match(opencodePlugin, /config\.skills\.paths/);

  return 3;
}

export async function validateProject(root = rootFromHere) {
  const cardCount = await validateCatalog(root);
  const skillCount = await validateSkills(root);
  await validateRootInstructions(root);
  const platformCount = await validatePlatformMetadata(root);
  return { cardCount, skillCount, platformCount };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const result = await validateProject();
  console.log(`Validation passed: ${result.cardCount} cards, ${result.skillCount} skills, ${result.platformCount} platforms.`);
}
