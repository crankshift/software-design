# Single Source Plugin Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the repository itself the single installable package for Claude Code, Codex, and OpenCode, with no tracked generated adapter copies.

**Architecture:** Keep `skills/`, `catalog/`, `AGENTS.md`, and `core/agent.md` as canonical root content. Add only small platform metadata/glue under `.claude-plugin/`, `.codex-plugin/`, and `.opencode/`. Replace generator validation with canonical package validation.

**Tech Stack:** Markdown, Node.js ESM scripts, built-in `node:test`, OpenCode JavaScript plugin hooks, Claude Code plugin manifest, Codex plugin manifest.

---

## Commit Authorization

The task steps include commit commands because this plan is written for agentic execution workflows. Execute the commit steps only when the user has explicitly authorized commits in the current session. Without commit authorization, skip the commit command and report the files that would have been committed.

## File Structure

- Create `.claude-plugin/plugin.json`: Claude Code plugin metadata at the repository root.
- Create `.codex-plugin/plugin.json`: Codex plugin metadata pointing `skills` to `./skills/`.
- Create `.opencode/INSTALL.md`: OpenCode install and troubleshooting notes.
- Create `.opencode/plugins/software-design.js`: OpenCode plugin hook that registers the root `skills/` directory.
- Modify `package.json`: remove `generate`, set OpenCode plugin `main`, keep test/validate/check scripts.
- Modify `AGENTS.md`: describe the root package and forbid adapter duplication.
- Modify `README.md`: document direct repository installation instead of generated adapters.
- Modify `scripts/validate.mjs`: validate canonical root files and platform metadata only.
- Modify `tests/project-files.test.mjs`: enforce package structure and absence of generated source files.
- Create `tests/platform-metadata.test.mjs`: validate root platform metadata and OpenCode glue.
- Modify `tests/readme.test.mjs`: validate direct install docs and absence of adapter-generation docs.
- Modify `tests/validate.test.mjs`: validate canonical fixtures instead of generated adapter output.
- Modify `tests/catalog-data.test.mjs`: validate catalog files directly from `catalog/`.
- Delete `adapters/`: remove tracked generated adapter trees.
- Delete `scripts/generate.mjs`: generation is no longer part of the package architecture.
- Delete `scripts/lib/catalog.mjs`: catalog metadata duplication is no longer needed.
- Delete `scripts/lib/render-card.mjs`: card rendering is no longer needed.
- Delete `tests/adapters.test.mjs`: adapter-copy tests are obsolete.
- Delete `tests/generate-catalog.test.mjs`: catalog generation tests are obsolete.
- Delete `tests/render-card.test.mjs`: renderer tests are obsolete.

---

### Task 1: Root Platform Metadata And Package Entry

**Files:**
- Create: `.claude-plugin/plugin.json`
- Create: `.codex-plugin/plugin.json`
- Create: `.opencode/INSTALL.md`
- Create: `.opencode/plugins/software-design.js`
- Create: `tests/platform-metadata.test.mjs`
- Modify: `package.json`

- [ ] **Step 1: Write failing platform metadata tests**

Create `tests/platform-metadata.test.mjs`:

```js
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
  assert.match(body, /plugin/);
  assert.match(body, /repository root/);
  assert.match(body, /skills/);
});

test("OpenCode plugin glue registers the root skills directory", async () => {
  const body = await readFile(".opencode/plugins/software-design.js", "utf8");

  assert.match(body, /export const SoftwareDesignPlugin/);
  assert.match(body, /\.\.\/\.\.\/skills/);
  assert.match(body, /config\.skills/);
  assert.match(body, /config\.skills\.paths/);
});
```

- [ ] **Step 2: Run the failing platform metadata tests**

Run: `node --test tests/platform-metadata.test.mjs`

Expected: FAIL with `ENOENT` for `.claude-plugin/plugin.json`.

- [ ] **Step 3: Add root package metadata and OpenCode plugin entry**

Replace `package.json` with:

```json
{
  "name": "software-design-plugin",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "main": ".opencode/plugins/software-design.js",
  "description": "Portable software design skills and catalog for Claude Code, Codex, and OpenCode.",
  "scripts": {
    "test": "node --test tests/*.test.mjs",
    "validate": "node scripts/validate.mjs",
    "check": "npm test && npm run validate"
  },
  "engines": {
    "node": ">=20"
  }
}
```

Create `.claude-plugin/plugin.json`:

```json
{
  "name": "software-design",
  "version": "0.1.0",
  "description": "Portable software design skills and catalog for Claude Code, Codex, and OpenCode.",
  "author": {
    "name": "software-design contributors"
  }
}
```

Create `.codex-plugin/plugin.json`:

```json
{
  "name": "software-design",
  "version": "0.1.0",
  "description": "Portable software design skills and catalog for Claude Code, Codex, and OpenCode.",
  "author": {
    "name": "software-design contributors"
  },
  "keywords": [
    "software-design",
    "skills",
    "refactoring",
    "design-patterns"
  ],
  "skills": "./skills/",
  "interface": {
    "displayName": "Software Design",
    "shortDescription": "Software design triage, refactoring, smells, and pattern-selection skills",
    "longDescription": "Use Software Design to guide coding agents through design triage, SOLID checks, DRY/KISS/YAGNI decisions, code-smell diagnosis, refactoring selection, implementation review, and focused catalog-card lookup.",
    "developerName": "software-design contributors",
    "category": "Coding",
    "capabilities": [
      "Interactive",
      "Read",
      "Write"
    ],
    "defaultPrompt": [
      "Review this design before implementation.",
      "Help me refactor this code safely."
    ],
    "brandColor": "#2563EB"
  }
}
```

Create `.opencode/INSTALL.md`:

```md
# Installing Software Design Plugin for OpenCode

## Prerequisites

- OpenCode installed.
- A local checkout or git-backed package spec for this repository.

## Installation

Add the repository root to the `plugin` array in your global or project `opencode.json`.

OpenCode loads the package entry point from `package.json`, which points to `.opencode/plugins/software-design.js`. The plugin registers the canonical root `skills/` directory automatically.

Restart OpenCode after updating configuration.

## Verify

Ask OpenCode to list available skills. The software-design skills should be discoverable from the repository root `skills/` directory.

## Troubleshooting

1. Confirm the `plugin` entry points at the repository root, not `.opencode/` and not an `adapters/` directory.
2. Confirm `.opencode/plugins/software-design.js` exists.
3. Confirm `skills/software-design-orchestrator/SKILL.md` exists.
4. Restart OpenCode so plugin configuration is reloaded.
```

Create `.opencode/plugins/software-design.js`:

```js
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const SoftwareDesignPlugin = async () => {
  const skillsDir = path.resolve(__dirname, "../../skills");

  return {
    config: async (config) => {
      config.skills = config.skills || {};
      config.skills.paths = config.skills.paths || [];

      if (!config.skills.paths.includes(skillsDir)) {
        config.skills.paths.push(skillsDir);
      }
    },
  };
};
```

- [ ] **Step 4: Run the platform metadata tests**

Run: `node --test tests/platform-metadata.test.mjs`

Expected: PASS.

- [ ] **Step 5: Commit Task 1 changes**

Run only with commit authorization:

```bash
git add package.json .claude-plugin/plugin.json .codex-plugin/plugin.json .opencode/INSTALL.md .opencode/plugins/software-design.js tests/platform-metadata.test.mjs
git commit -m "feat: add root plugin metadata"
```

---

### Task 2: Direct Install Documentation

**Files:**
- Modify: `README.md`
- Modify: `AGENTS.md`
- Modify: `tests/readme.test.mjs`
- Modify: `tests/project-files.test.mjs`

- [ ] **Step 1: Write failing README and root instruction tests**

Replace `tests/readme.test.mjs` with:

```js
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
```

Replace `tests/project-files.test.mjs` with:

```js
import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

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
```

- [ ] **Step 2: Run the failing documentation tests**

Run: `node --test tests/readme.test.mjs tests/project-files.test.mjs`

Expected: FAIL because `README.md` still documents generated adapters and `AGENTS.md` still mentions generated adapters.

- [ ] **Step 3: Rewrite README and root AGENTS instructions**

Replace `README.md` with:

```md
# Software Design Plugin

Portable software design skills and catalog cards for Claude Code, Codex, and OpenCode.

## Why It Exists

This project keeps software design guidance useful without flooding an agent's context. It uses a few primary skills for workflow decisions, plus compact catalog cards for specific design decisions.

Agents should start with the primary skills, then load only one to three catalog cards when a decision needs focused guidance. That keeps active context small while still making a broad software design catalog available.

## Architecture

This repository is the single installable package. The source of truth is the root content:

- `AGENTS.md` for cross-platform orchestration instructions.
- `core/agent.md` for the canonical orchestrator prompt.
- `skills/` for the primary workflow skills.
- `catalog/` for compact design reference cards.

Platform directories contain only metadata or install glue:

- `.claude-plugin/plugin.json`
- `.codex-plugin/plugin.json`
- `.opencode/INSTALL.md`
- `.opencode/plugins/software-design.js`

There are no checked-in generated adapter copies.

## Catalog Coverage

The catalog contains 119 compact cards total:

- 8 principles
- 22 patterns
- 23 smells
- 66 refactorings

These cards are intended to be loaded selectively, not all at once.

## Prerequisites

Node.js 20+ and npm are required to run validation and tests.

## Validate

Run `npm run validate` to check that the canonical package files satisfy the project validation rules.

## Install In Claude Code

Install this repository root through Claude Code's local plugin install flow. Claude Code discovers `.claude-plugin/plugin.json`, root-level `skills/`, and other plugin content from the repository root.

## Install In Codex

Install this repository root as a Codex plugin. `.codex-plugin/plugin.json` points Codex at the canonical `./skills/` directory and describes the plugin interface.

## Install In OpenCode

Follow `.opencode/INSTALL.md`. OpenCode loads the package entry point from `package.json`, then `.opencode/plugins/software-design.js` registers the canonical root `skills/` directory.

## Development Workflow

Use the normal checks before relying on package output:

- `npm run validate` validates the canonical package.
- `npm test` runs the test suite.
- `npm run check` runs tests and validation together.

For catalog changes, update `catalog/`, run `npm run validate`, and run `npm test`. For release-style verification, run `npm run check`.
```

Replace `AGENTS.md` with:

```md
# Software Design Orchestrator

Use these instructions when working in this repository or when installing this package into Claude Code, Codex, or OpenCode.

## Source Of Truth

1. The repository root is the single source of truth.
2. `skills/`, `catalog/`, `AGENTS.md`, and `core/agent.md` are canonical.
3. Platform directories contain only metadata or install glue.
4. Do not duplicate `skills/`, `catalog/`, or `AGENTS.md` under platform-specific directories.

## Routing

1. Start with the primary skills in `skills/`.
2. Load only the workflow skill that matches the current task.
3. Load one to three catalog cards from `catalog/` for the specific design decision.
4. Prefer KISS and YAGNI before adding abstractions or patterns.
5. Use `core/agent.md` as the canonical orchestrator prompt.

## Primary Skills

- `skills/software-design-orchestrator/SKILL.md`
- `skills/solid-principles/SKILL.md`
- `skills/dry-kiss-yagni/SKILL.md`
- `skills/pattern-selection/SKILL.md`
- `skills/code-smell-diagnosis/SKILL.md`
- `skills/refactoring-selection/SKILL.md`
- `skills/implementation-review/SKILL.md`

## Constraints

- Do not load broad catalogs into context.
- Do not force design patterns when a simpler refactoring is enough.
- Do not add speculative abstractions without a concrete requirement.
- Do not recreate adapter copy trees.
- Verify the package with `npm run check` before release.
```

- [ ] **Step 4: Run the documentation tests**

Run: `node --test tests/readme.test.mjs tests/project-files.test.mjs`

Expected: PASS.

- [ ] **Step 5: Commit Task 2 changes**

Run only with commit authorization:

```bash
git add README.md AGENTS.md tests/readme.test.mjs tests/project-files.test.mjs
git commit -m "docs: document single-source package"
```

---

### Task 3: Canonical Validation Script

**Files:**
- Modify: `scripts/validate.mjs`
- Modify: `tests/validate.test.mjs`

- [ ] **Step 1: Write failing validation tests for canonical fixtures**

Replace `tests/validate.test.mjs` with:

```js
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
  "core",
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

test("validateProject rejects reintroduced adapter copy trees", async () => {
  const root = await mkdtemp(join(tmpdir(), "software-design-validate-"));
  try {
    await copyCanonicalFixture(root);
    await mkdir(join(root, "adapters/opencode"), { recursive: true });

    await assert.rejects(() => validateProject(root), /adapters\/ should not exist/);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
```

- [ ] **Step 2: Run the failing validation tests**

Run: `node --test tests/validate.test.mjs`

Expected: FAIL because `scripts/validate.mjs` still imports generator catalog data and still validates generated adapter copies.

- [ ] **Step 3: Rewrite validation for canonical root files**

Replace `scripts/validate.mjs` with:

```js
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
  assert.match(opencodeInstall, /repository root/);
  assert.match(opencodeInstall, /skills/);

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
```

- [ ] **Step 4: Run the validation tests**

Run: `node --test tests/validate.test.mjs`

Expected: PASS.

- [ ] **Step 5: Commit Task 3 changes**

Run only with commit authorization:

```bash
git add scripts/validate.mjs tests/validate.test.mjs
git commit -m "refactor: validate canonical package"
```

---

### Task 4: Remove Generated Adapter Source And Generator Code

**Files:**
- Modify: `tests/catalog-data.test.mjs`
- Modify: `tests/project-files.test.mjs`
- Delete: `adapters/`
- Delete: `scripts/generate.mjs`
- Delete: `scripts/lib/catalog.mjs`
- Delete: `scripts/lib/render-card.mjs`
- Delete: `tests/adapters.test.mjs`
- Delete: `tests/generate-catalog.test.mjs`
- Delete: `tests/render-card.test.mjs`

- [ ] **Step 1: Replace catalog tests with filesystem-based tests**

Replace `tests/catalog-data.test.mjs` with:

```js
import test from "node:test";
import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import { join, relative, sep } from "node:path";

const expectedCatalogCounts = new Map([
  ["principles", 8],
  ["patterns", 22],
  ["smells", 23],
  ["refactorings", 66],
]);

const cardSections = ["Use when:", "Avoid when:", "Apply:", "Verify:", "Related:"];

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

test("catalog contains the approved coverage as canonical files", async () => {
  const files = await listMarkdownFiles("catalog");
  const counts = new Map([...expectedCatalogCounts].map(([kind]) => [kind, 0]));

  for (const file of files) {
    const [kind] = relative("catalog", file).split(sep);
    if (counts.has(kind)) {
      counts.set(kind, counts.get(kind) + 1);
    }
  }

  assert.equal(files.length, 119);
  for (const [kind, expected] of expectedCatalogCounts) {
    assert.equal(counts.get(kind), expected, `catalog/${kind} should contain ${expected} cards`);
  }
});

test("catalog file paths are unique", async () => {
  const files = await listMarkdownFiles("catalog");
  assert.equal(new Set(files).size, files.length);
});

test("catalog cards include required sections", async () => {
  for (const file of await listMarkdownFiles("catalog")) {
    const body = await readFile(file, "utf8");
    for (const section of cardSections) {
      assert.ok(body.includes(section), `${file} should contain ${section}`);
    }
  }
});
```

- [ ] **Step 2: Add structure checks that fail while generated source remains**

Replace `tests/project-files.test.mjs` with:

```js
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
```

- [ ] **Step 3: Run the failing structure tests**

Run: `node --test tests/catalog-data.test.mjs tests/project-files.test.mjs`

Expected: FAIL because `adapters/`, `scripts/generate.mjs`, and `scripts/lib/*.mjs` still exist.

- [ ] **Step 4: Delete generated adapter and generator files**

Delete these paths:

```text
adapters/
scripts/generate.mjs
scripts/lib/catalog.mjs
scripts/lib/render-card.mjs
tests/adapters.test.mjs
tests/generate-catalog.test.mjs
tests/render-card.test.mjs
```

- [ ] **Step 5: Run the updated structure and catalog tests**

Run: `node --test tests/catalog-data.test.mjs tests/project-files.test.mjs tests/platform-metadata.test.mjs`

Expected: PASS.

- [ ] **Step 6: Commit Task 4 changes**

Run only with commit authorization:

```bash
git add tests/catalog-data.test.mjs tests/project-files.test.mjs
git rm -r adapters scripts/generate.mjs scripts/lib/catalog.mjs scripts/lib/render-card.mjs tests/adapters.test.mjs tests/generate-catalog.test.mjs tests/render-card.test.mjs
git commit -m "refactor: remove generated adapter copies"
```

---

### Task 5: Final Verification And Cleanup

**Files:**
- Modify only if verification exposes a defect in files changed by Tasks 1-4.

- [ ] **Step 1: Run the full test suite**

Run: `npm test`

Expected: PASS for all remaining `tests/*.test.mjs` files.

- [ ] **Step 2: Run canonical package validation**

Run: `npm run validate`

Expected: PASS with output similar to `Validation passed: 119 cards, 7 skills, 3 platforms.`

- [ ] **Step 3: Run the release-style check**

Run: `npm run check`

Expected: PASS. The command must not run generation and must not recreate `adapters/`.

- [ ] **Step 4: Inspect working tree state**

Run: `git status --short`

Expected: only intentional files from the redesign are listed, unless earlier commit steps were authorized and completed.

- [ ] **Step 5: Commit final verification fixes**

Run only with commit authorization and only if Step 1-4 required additional fixes:

```bash
git add package.json AGENTS.md README.md .claude-plugin .codex-plugin .opencode scripts tests docs/superpowers/specs/2026-05-25-single-source-plugin-redesign-design.md docs/superpowers/plans/2026-05-25-single-source-plugin-redesign.md
git commit -m "chore: verify single-source plugin package"
```

---

## Self-Review Notes

- Spec coverage: Tasks 1-2 implement root package metadata, documentation, and platform integration. Task 3 implements canonical validation. Task 4 removes adapter duplication and generator code. Task 5 verifies the final package.
- Placeholder scan: The plan contains no deferred implementation sections. Each file creation or replacement step includes complete file content.
- Type and name consistency: The OpenCode entry point is consistently `.opencode/plugins/software-design.js`, the exported plugin is consistently `SoftwareDesignPlugin`, and validation consistently returns `platformCount`.
