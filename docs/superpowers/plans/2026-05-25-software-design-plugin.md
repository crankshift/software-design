# Software Design Plugin Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a portable software-design plugin for Claude Code, Codex, and OpenCode using a small set of orchestration skills and a compact complete design catalog.

**Architecture:** The canonical source lives at the repository root. `scripts/generate.mjs` renders compact catalog cards and generated platform adapters from `scripts/lib/catalog.mjs`; `scripts/validate.mjs` checks completeness and generated output. Runtime plugin behavior is file-based, with no service dependency.

**Tech Stack:** Markdown, Node.js ESM scripts, built-in `node:test`, no npm runtime dependencies.

---

## File Structure

- Create `package.json`: npm scripts for test, generate, validate, and full check.
- Create `core/agent.md`: cross-platform orchestration instructions.
- Create `skills/*/SKILL.md`: seven primary workflow skills only.
- Create `scripts/lib/catalog.mjs`: canonical catalog data for 8 principles, 22 patterns, 23 smells, and 66 refactorings.
- Create `scripts/lib/render-card.mjs`: turns one catalog item into a compact Markdown card.
- Create `scripts/generate.mjs`: renders `catalog/**`, `adapters/claude-code/**`, `adapters/codex/**`, and `adapters/opencode/**`.
- Create `scripts/validate.mjs`: validates canonical files, generated files, required sections, and adapter manifests.
- Create `tests/*.test.mjs`: node tests for catalog completeness, card rendering, generation, and validation.
- Create `README.md`: project overview and install instructions for each platform.

Version control note: this workspace is not a git repository, and commits were not requested. Do not run `git init` or `git commit` unless the user explicitly asks.

---

### Task 1: Package Metadata And Catalog Data

**Files:**
- Create: `package.json`
- Create: `scripts/lib/catalog.mjs`
- Create: `tests/catalog-data.test.mjs`

- [ ] **Step 1: Write the failing catalog data test**

Create `tests/catalog-data.test.mjs`:

```js
import test from "node:test";
import assert from "node:assert/strict";
import { allItems, patterns, principles, refactorings, smells } from "../scripts/lib/catalog.mjs";

test("catalog contains the approved coverage", () => {
  assert.equal(principles.length, 8);
  assert.equal(patterns.length, 22);
  assert.equal(smells.length, 23);
  assert.equal(refactorings.length, 66);
  assert.equal(allItems.length, 119);
});

test("catalog paths and slugs are unique", () => {
  assert.equal(new Set(allItems.map((item) => item.slug)).size, allItems.length);
  assert.equal(new Set(allItems.map((item) => item.path)).size, allItems.length);
});

test("catalog items include required metadata", () => {
  for (const item of allItems) {
    assert.ok(item.title, "title is required");
    assert.ok(item.slug, `${item.title} slug is required`);
    assert.ok(item.kind, `${item.title} kind is required`);
    assert.ok(item.group, `${item.title} group is required`);
    assert.ok(item.path, `${item.title} path is required`);
    assert.ok(item.sourceUrl, `${item.title} sourceUrl is required`);
  }
});
```

- [ ] **Step 2: Run the failing test**

Run: `node --test tests/catalog-data.test.mjs`

Expected: FAIL with `Cannot find module` for `scripts/lib/catalog.mjs`.

- [ ] **Step 3: Create package metadata**

Create `package.json`:

```json
{
  "name": "software-design-plugin",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "description": "Portable software design skills and catalog for Claude Code, Codex, and OpenCode.",
  "scripts": {
    "test": "node --test tests/*.test.mjs",
    "generate": "node scripts/generate.mjs",
    "validate": "node scripts/validate.mjs",
    "check": "npm test && npm run generate && npm run validate"
  },
  "engines": {
    "node": ">=20"
  }
}
```

- [ ] **Step 4: Create the canonical catalog module**

Create `scripts/lib/catalog.mjs` with helper functions plus complete item lists. Use `sourceUrl` values from Refactoring.Guru for patterns, smells, and refactorings.

```js
const patternSource = (slug) => `https://refactoring.guru/design-patterns/${slug}`;
const smellSource = (slug) => `https://refactoring.guru/smells/${slug}`;
const refactoringSource = (slug) => `https://refactoring.guru/${slug}`;

const principle = (title, slug, group, summary) => ({
  title,
  slug,
  kind: "principle",
  group,
  summary,
  sourceUrl: "internal://software-design/principles",
  path: `catalog/principles/${group}/${slug}.md`,
});

const pattern = (title, slug, group, summary) => ({
  title,
  slug,
  kind: "pattern",
  group,
  summary,
  sourceUrl: patternSource(slug),
  path: `catalog/patterns/${group}/${slug}.md`,
});

const smell = (title, slug, group) => ({
  title,
  slug,
  kind: "smell",
  group,
  sourceUrl: smellSource(slug),
  path: `catalog/smells/${group}/${slug}.md`,
});

const refactoring = (title, slug, group) => ({
  title,
  slug,
  kind: "refactoring",
  group,
  sourceUrl: refactoringSource(slug),
  path: `catalog/refactorings/${group}/${slug}.md`,
});

export const principles = [
  principle("Single Responsibility", "single-responsibility", "solid", "A unit should have one clear reason to change."),
  principle("Open/Closed", "open-closed", "solid", "Prefer extension points over repeated edits to stable code."),
  principle("Liskov Substitution", "liskov-substitution", "solid", "Subtypes must preserve the promises of their base type."),
  principle("Interface Segregation", "interface-segregation", "solid", "Clients should depend only on the operations they use."),
  principle("Dependency Inversion", "dependency-inversion", "solid", "High-level policy should depend on abstractions, not concrete details."),
  principle("DRY", "dry", "core", "Remove knowledge duplication, not harmless repetition."),
  principle("KISS", "kiss", "core", "Prefer the simplest design that satisfies the current requirements."),
  principle("YAGNI", "yagni", "core", "Do not add abstractions or features before there is a concrete need."),
];

export const patterns = [
  pattern("Factory Method", "factory-method", "creational", "Create objects through an overridable method instead of direct construction."),
  pattern("Abstract Factory", "abstract-factory", "creational", "Create families of related objects without binding clients to concrete classes."),
  pattern("Builder", "builder", "creational", "Construct complex objects step by step using the same construction process."),
  pattern("Prototype", "prototype", "Copy existing objects without depending on their concrete classes."),
  pattern("Singleton", "singleton", "Provide one shared instance while controlling access to it."),
  pattern("Adapter", "adapter", "structural", "Make incompatible interfaces collaborate through a wrapper."),
  pattern("Bridge", "bridge", "structural", "Split abstraction and implementation so both can vary independently."),
  pattern("Composite", "composite", "structural", "Treat individual objects and object trees through the same interface."),
  pattern("Decorator", "decorator", "structural", "Add behavior by wrapping an object rather than changing its class."),
  pattern("Facade", "facade", "structural", "Expose a simpler interface over a complex subsystem."),
  pattern("Flyweight", "flyweight", "structural", "Share common immutable state across many lightweight objects."),
  pattern("Proxy", "proxy", "structural", "Control access to another object through a substitute."),
  pattern("Chain of Responsibility", "chain-of-responsibility", "behavioral", "Pass a request through handlers until one handles it."),
  pattern("Command", "command", "behavioral", "Represent a request as an object so it can be queued, logged, or undone."),
  pattern("Iterator", "iterator", "behavioral", "Traverse a collection without exposing its representation."),
  pattern("Mediator", "mediator", "behavioral", "Reduce direct dependencies by routing collaboration through a mediator."),
  pattern("Memento", "memento", "behavioral", "Capture and restore state without exposing internals."),
  pattern("Observer", "observer", "behavioral", "Notify subscribers when an observed object changes."),
  pattern("State", "state", "behavioral", "Move state-specific behavior into separate state objects."),
  pattern("Strategy", "strategy", "behavioral", "Swap interchangeable algorithms behind a stable interface."),
  pattern("Template Method", "template-method", "behavioral", "Define an algorithm skeleton while letting subclasses override steps."),
  pattern("Visitor", "visitor", "behavioral", "Separate operations from the object structure they operate on."),
];

export const smells = [
  smell("Long Method", "long-method", "bloaters"),
  smell("Large Class", "large-class", "bloaters"),
  smell("Primitive Obsession", "primitive-obsession", "bloaters"),
  smell("Long Parameter List", "long-parameter-list", "bloaters"),
  smell("Data Clumps", "data-clumps", "bloaters"),
  smell("Switch Statements", "switch-statements", "oo-abusers"),
  smell("Temporary Field", "temporary-field", "oo-abusers"),
  smell("Refused Bequest", "refused-bequest", "oo-abusers"),
  smell("Alternative Classes with Different Interfaces", "alternative-classes-with-different-interfaces", "oo-abusers"),
  smell("Divergent Change", "divergent-change", "change-preventers"),
  smell("Shotgun Surgery", "shotgun-surgery", "change-preventers"),
  smell("Parallel Inheritance Hierarchies", "parallel-inheritance-hierarchies", "change-preventers"),
  smell("Comments", "comments", "dispensables"),
  smell("Duplicate Code", "duplicate-code", "dispensables"),
  smell("Lazy Class", "lazy-class", "dispensables"),
  smell("Data Class", "data-class", "dispensables"),
  smell("Dead Code", "dead-code", "dispensables"),
  smell("Speculative Generality", "speculative-generality", "dispensables"),
  smell("Feature Envy", "feature-envy", "couplers"),
  smell("Inappropriate Intimacy", "inappropriate-intimacy", "couplers"),
  smell("Message Chains", "message-chains", "couplers"),
  smell("Middle Man", "middle-man", "couplers"),
  smell("Incomplete Library Class", "incomplete-library-class", "couplers"),
];

export const refactorings = [
  refactoring("Extract Method", "extract-method", "composing-methods"),
  refactoring("Inline Method", "inline-method", "composing-methods"),
  refactoring("Extract Variable", "extract-variable", "composing-methods"),
  refactoring("Inline Temp", "inline-temp", "composing-methods"),
  refactoring("Replace Temp with Query", "replace-temp-with-query", "composing-methods"),
  refactoring("Split Temporary Variable", "split-temporary-variable", "composing-methods"),
  refactoring("Remove Assignments to Parameters", "remove-assignments-to-parameters", "composing-methods"),
  refactoring("Replace Method with Method Object", "replace-method-with-method-object", "composing-methods"),
  refactoring("Substitute Algorithm", "substitute-algorithm", "composing-methods"),
  refactoring("Move Method", "move-method", "moving-features-between-objects"),
  refactoring("Move Field", "move-field", "moving-features-between-objects"),
  refactoring("Extract Class", "extract-class", "moving-features-between-objects"),
  refactoring("Inline Class", "inline-class", "moving-features-between-objects"),
  refactoring("Hide Delegate", "hide-delegate", "moving-features-between-objects"),
  refactoring("Remove Middle Man", "remove-middle-man", "moving-features-between-objects"),
  refactoring("Introduce Foreign Method", "introduce-foreign-method", "moving-features-between-objects"),
  refactoring("Introduce Local Extension", "introduce-local-extension", "moving-features-between-objects"),
  refactoring("Change Value to Reference", "change-value-to-reference", "organizing-data"),
  refactoring("Change Reference to Value", "change-reference-to-value", "organizing-data"),
  refactoring("Duplicate Observed Data", "duplicate-observed-data", "organizing-data"),
  refactoring("Self Encapsulate Field", "self-encapsulate-field", "organizing-data"),
  refactoring("Replace Data Value with Object", "replace-data-value-with-object", "organizing-data"),
  refactoring("Replace Array with Object", "replace-array-with-object", "organizing-data"),
  refactoring("Change Unidirectional Association to Bidirectional", "change-unidirectional-association-to-bidirectional", "organizing-data"),
  refactoring("Change Bidirectional Association to Unidirectional", "change-bidirectional-association-to-unidirectional", "organizing-data"),
  refactoring("Encapsulate Field", "encapsulate-field", "organizing-data"),
  refactoring("Encapsulate Collection", "encapsulate-collection", "organizing-data"),
  refactoring("Replace Magic Number with Symbolic Constant", "replace-magic-number-with-symbolic-constant", "organizing-data"),
  refactoring("Replace Type Code with Class", "replace-type-code-with-class", "organizing-data"),
  refactoring("Replace Type Code with Subclasses", "replace-type-code-with-subclasses", "organizing-data"),
  refactoring("Replace Type Code with State/Strategy", "replace-type-code-with-state-strategy", "organizing-data"),
  refactoring("Replace Subclass with Fields", "replace-subclass-with-fields", "organizing-data"),
  refactoring("Consolidate Conditional Expression", "consolidate-conditional-expression", "simplifying-conditional-expressions"),
  refactoring("Consolidate Duplicate Conditional Fragments", "consolidate-duplicate-conditional-fragments", "simplifying-conditional-expressions"),
  refactoring("Decompose Conditional", "decompose-conditional", "simplifying-conditional-expressions"),
  refactoring("Replace Conditional with Polymorphism", "replace-conditional-with-polymorphism", "simplifying-conditional-expressions"),
  refactoring("Remove Control Flag", "remove-control-flag", "simplifying-conditional-expressions"),
  refactoring("Replace Nested Conditional with Guard Clauses", "replace-nested-conditional-with-guard-clauses", "simplifying-conditional-expressions"),
  refactoring("Introduce Null Object", "introduce-null-object", "simplifying-conditional-expressions"),
  refactoring("Introduce Assertion", "introduce-assertion", "simplifying-conditional-expressions"),
  refactoring("Add Parameter", "add-parameter", "simplifying-method-calls"),
  refactoring("Remove Parameter", "remove-parameter", "simplifying-method-calls"),
  refactoring("Rename Method", "rename-method", "simplifying-method-calls"),
  refactoring("Separate Query from Modifier", "separate-query-from-modifier", "simplifying-method-calls"),
  refactoring("Parameterize Method", "parameterize-method", "simplifying-method-calls"),
  refactoring("Introduce Parameter Object", "introduce-parameter-object", "simplifying-method-calls"),
  refactoring("Preserve Whole Object", "preserve-whole-object", "simplifying-method-calls"),
  refactoring("Remove Setting Method", "remove-setting-method", "simplifying-method-calls"),
  refactoring("Replace Parameter with Explicit Methods", "replace-parameter-with-explicit-methods", "simplifying-method-calls"),
  refactoring("Replace Parameter with Method Call", "replace-parameter-with-method-call", "simplifying-method-calls"),
  refactoring("Hide Method", "hide-method", "simplifying-method-calls"),
  refactoring("Replace Constructor with Factory Method", "replace-constructor-with-factory-method", "simplifying-method-calls"),
  refactoring("Replace Error Code with Exception", "replace-error-code-with-exception", "simplifying-method-calls"),
  refactoring("Replace Exception with Test", "replace-exception-with-test", "simplifying-method-calls"),
  refactoring("Pull Up Field", "pull-up-field", "dealing-with-generalization"),
  refactoring("Pull Up Method", "pull-up-method", "dealing-with-generalization"),
  refactoring("Pull Up Constructor Body", "pull-up-constructor-body", "dealing-with-generalization"),
  refactoring("Push Down Field", "push-down-field", "dealing-with-generalization"),
  refactoring("Push Down Method", "push-down-method", "dealing-with-generalization"),
  refactoring("Extract Subclass", "extract-subclass", "dealing-with-generalization"),
  refactoring("Extract Superclass", "extract-superclass", "dealing-with-generalization"),
  refactoring("Extract Interface", "extract-interface", "dealing-with-generalization"),
  refactoring("Collapse Hierarchy", "collapse-hierarchy", "dealing-with-generalization"),
  refactoring("Form Template Method", "form-template-method", "dealing-with-generalization"),
  refactoring("Replace Inheritance with Delegation", "replace-inheritance-with-delegation", "dealing-with-generalization"),
  refactoring("Replace Delegation with Inheritance", "replace-delegation-with-inheritance", "dealing-with-generalization"),
];

export const allItems = [...principles, ...patterns, ...smells, ...refactorings];
```

- [ ] **Step 5: Run the catalog test**

Run: `node --test tests/catalog-data.test.mjs`

Expected: PASS.

---

### Task 2: Catalog Card Renderer

**Files:**
- Create: `scripts/lib/render-card.mjs`
- Create: `tests/render-card.test.mjs`

- [ ] **Step 1: Write the failing renderer test**

Create `tests/render-card.test.mjs`:

```js
import test from "node:test";
import assert from "node:assert/strict";
import { renderCard } from "../scripts/lib/render-card.mjs";

test("renderCard emits required compact card sections", () => {
  const markdown = renderCard({
    title: "Strategy",
    slug: "strategy",
    kind: "pattern",
    group: "behavioral",
    summary: "Swap interchangeable algorithms behind a stable interface.",
    sourceUrl: "https://refactoring.guru/design-patterns/strategy",
    path: "catalog/patterns/behavioral/strategy.md",
  });

  assert.match(markdown, /^# Strategy/m);
  assert.match(markdown, /Source: https:\/\/refactoring\.guru\/design-patterns\/strategy/);
  assert.match(markdown, /Use when:/);
  assert.match(markdown, /Avoid when:/);
  assert.match(markdown, /Apply:/);
  assert.match(markdown, /Verify:/);
  assert.match(markdown, /Related:/);
  assert.ok(markdown.length < 1500);
});
```

- [ ] **Step 2: Run the failing renderer test**

Run: `node --test tests/render-card.test.mjs`

Expected: FAIL with `Cannot find module` for `scripts/lib/render-card.mjs`.

- [ ] **Step 3: Implement the renderer**

Create `scripts/lib/render-card.mjs`:

```js
const defaults = {
  principle: {
    useWhen: ["A design decision needs a constraint before adding structure."],
    avoidWhen: ["The principle is being used as a slogan without a concrete code pressure."],
    apply: ["Name the concrete pressure.", "Prefer the smallest change that improves the design.", "Check that the new boundary is easier to understand and test."],
    verify: ["The change has a concrete reason and does not add speculative abstraction."],
    related: ["KISS", "YAGNI", "Implementation Review"],
  },
  pattern: {
    useWhen: ["The same design problem is recurring and a simple function or refactoring is not enough."],
    avoidWhen: ["The pattern would add roles, files, or indirection before they are needed."],
    apply: ["State the recurring problem.", "Map each pattern role to an existing domain concept.", "Introduce the smallest stable interface needed by the caller."],
    verify: ["Callers became simpler or change impact became smaller."],
    related: ["KISS", "YAGNI", "Pattern Selection"],
  },
  smell: {
    useWhen: ["Code is harder to change, understand, or test for the named reason."],
    avoidWhen: ["The code is stable, local, readable, and the suspected smell has no change cost."],
    apply: ["Confirm the symptom with code evidence.", "Pick one safe refactoring at a time.", "Keep behavior unchanged until tests prove otherwise."],
    verify: ["The symptom is reduced and behavior is preserved."],
    related: ["Code Smell Diagnosis", "Refactoring Selection"],
  },
  refactoring: {
    useWhen: ["A behavior-preserving structural change makes the next edit safer or clearer."],
    avoidWhen: ["Behavior is unclear and there is no test or observable check to protect it."],
    apply: ["Add or identify a behavior check.", "Make one small transformation.", "Run the behavior check before continuing."],
    verify: ["Tests pass and public behavior is unchanged."],
    related: ["Refactoring Selection", "Implementation Review"],
  },
};

const list = (items) => items.map((item) => `- ${item}`).join("\n");
const steps = (items) => items.map((item, index) => `${index + 1}. ${item}`).join("\n");

export function renderCard(item) {
  const content = defaults[item.kind];
  if (!content) {
    throw new Error(`Unknown catalog item kind: ${item.kind}`);
  }

  return `# ${item.title}

Type: ${item.kind}
Group: ${item.group}
Source: ${item.sourceUrl}

Summary:
${item.summary ?? `${item.title} is a compact ${item.kind} reference card.`}

Use when:
${list(content.useWhen)}

Avoid when:
${list(content.avoidWhen)}

Apply:
${steps(content.apply)}

Verify:
${list(content.verify)}

Related:
${list(content.related)}
`;
}
```

- [ ] **Step 4: Run the renderer test**

Run: `node --test tests/render-card.test.mjs`

Expected: PASS.

---

### Task 3: Canonical Catalog Generation

**Files:**
- Create: `scripts/generate.mjs`
- Create: `tests/generate-catalog.test.mjs`

- [ ] **Step 1: Write the failing generator test**

Create `tests/generate-catalog.test.mjs`:

```js
import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { generateCatalog } from "../scripts/generate.mjs";

test("generateCatalog writes all catalog cards", async () => {
  const root = await mkdtemp(join(tmpdir(), "software-design-catalog-"));
  try {
    const count = await generateCatalog(root);
    assert.equal(count, 119);

    const strategy = await readFile(join(root, "catalog/patterns/behavioral/strategy.md"), "utf8");
    assert.match(strategy, /^# Strategy/m);
    assert.match(strategy, /Use when:/);
    assert.match(strategy, /Avoid when:/);
    assert.match(strategy, /Apply:/);
    assert.match(strategy, /Verify:/);
    assert.match(strategy, /Related:/);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
```

- [ ] **Step 2: Run the failing generator test**

Run: `node --test tests/generate-catalog.test.mjs`

Expected: FAIL with `Cannot find module` or missing `generateCatalog` export.

- [ ] **Step 3: Implement catalog generation**

Create `scripts/generate.mjs`:

```js
import { mkdir, rm, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { allItems } from "./lib/catalog.mjs";
import { renderCard } from "./lib/render-card.mjs";

const rootFromHere = dirname(dirname(fileURLToPath(import.meta.url)));

async function writeText(root, relativePath, content) {
  const target = join(root, relativePath);
  await mkdir(dirname(target), { recursive: true });
  await writeFile(target, content, "utf8");
}

export async function generateCatalog(root = rootFromHere) {
  await rm(join(root, "catalog"), { recursive: true, force: true });
  for (const item of allItems) {
    await writeText(root, item.path, renderCard(item));
  }
  return allItems.length;
}

export async function generateAll(root = rootFromHere) {
  const catalogCount = await generateCatalog(root);
  return { catalogCount };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const result = await generateAll();
  console.log(`Generated ${result.catalogCount} catalog cards.`);
}
```

- [ ] **Step 4: Run generator tests and generate the catalog**

Run: `node --test tests/generate-catalog.test.mjs`

Expected: PASS.

Run: `npm run generate`

Expected: `Generated 119 catalog cards.`

---

### Task 4: Primary Skills And Orchestrator

**Files:**
- Create: `core/agent.md`
- Create: `skills/software-design-orchestrator/SKILL.md`
- Create: `skills/solid-principles/SKILL.md`
- Create: `skills/dry-kiss-yagni/SKILL.md`
- Create: `skills/pattern-selection/SKILL.md`
- Create: `skills/code-smell-diagnosis/SKILL.md`
- Create: `skills/refactoring-selection/SKILL.md`
- Create: `skills/implementation-review/SKILL.md`
- Create: `tests/skills.test.mjs`

- [ ] **Step 1: Write the failing skills test**

Create `tests/skills.test.mjs`:

```js
import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const skills = [
  "software-design-orchestrator",
  "solid-principles",
  "dry-kiss-yagni",
  "pattern-selection",
  "code-smell-diagnosis",
  "refactoring-selection",
  "implementation-review",
];

test("primary skills exist and route to catalog instead of embedding everything", async () => {
  for (const skill of skills) {
    const body = await readFile(`skills/${skill}/SKILL.md`, "utf8");
    assert.match(body, /^# /m);
    assert.match(body, /catalog\//);
    assert.ok(body.length < 3500, `${skill} should stay compact`);
  }
});

test("core agent prevents pattern forcing", async () => {
  const body = await readFile("core/agent.md", "utf8");
  assert.match(body, /KISS/);
  assert.match(body, /YAGNI/);
  assert.match(body, /Do not force design patterns/);
  assert.match(body, /one to three catalog cards/);
});
```

- [ ] **Step 2: Run the failing skills test**

Run: `node --test tests/skills.test.mjs`

Expected: FAIL with missing `skills/*/SKILL.md` files.

- [ ] **Step 3: Create `core/agent.md`**

Create `core/agent.md`:

```md
# Software Design Orchestrator

Use this guide when a development task needs design judgment, refactoring, smell diagnosis, or pattern selection.

## Routing

1. Start with KISS and YAGNI. Prefer the smallest clear change that satisfies current requirements.
2. If the task is about class/module boundaries, load `skills/solid-principles/SKILL.md` and one to three cards from `catalog/principles/`.
3. If the task involves duplication, complexity, or speculative abstractions, load `skills/dry-kiss-yagni/SKILL.md` and relevant cards from `catalog/principles/core/`.
4. If the code is hard to understand or change, load `skills/code-smell-diagnosis/SKILL.md` and one to three relevant `catalog/smells/` cards.
5. If behavior should stay the same while structure improves, load `skills/refactoring-selection/SKILL.md` and one to three relevant `catalog/refactorings/` cards.
6. If a recurring design problem remains after simpler refactoring, load `skills/pattern-selection/SKILL.md` and one to three relevant `catalog/patterns/` cards.
7. Before claiming completion, load `skills/implementation-review/SKILL.md` and review the diff for design regressions.

## Constraints

- Do not force design patterns. A pattern is justified only when it reduces real change cost or clarifies a recurring collaboration.
- Do not load broad catalogs into context. Load one to three catalog cards that match the current decision.
- Do not introduce abstractions for imagined future requirements.
- Prefer behavior-preserving refactoring steps with tests or observable checks.
```

- [ ] **Step 4: Create the seven compact skill files**

Create `skills/software-design-orchestrator/SKILL.md`:

```md
# Software Design Orchestrator

Use when a task needs design triage before implementation or review.

Workflow:
1. Classify the pressure: principle, smell, refactoring, pattern, or review.
2. Load only the matching workflow skill.
3. Load one to three matching cards from `catalog/`.
4. Prefer KISS and YAGNI before adding abstractions.
5. Explain the chosen design move in terms of concrete change cost.

Stop when:
- The task is purely mechanical and no design judgment is needed.
- More catalog cards would add noise instead of evidence.
```

Create `skills/solid-principles/SKILL.md`:

```md
# SOLID Principles

Use when code boundaries, inheritance, interfaces, or dependencies are making change harder.

Workflow:
1. Identify which SOLID pressure is present: responsibility, extension, substitution, interface size, or dependency direction.
2. Load one to three matching cards from `catalog/principles/solid/`.
3. Prefer a local boundary improvement before introducing a framework or broad abstraction.
4. Check that callers can understand the unit without reading its internals.
5. Verify that the change reduces a concrete reason to change.

Stop when:
- The current code is simple and the SOLID change would only add indirection.
- The design concern is actually duplication, premature abstraction, or a code smell handled by another skill.
```

Create `skills/dry-kiss-yagni/SKILL.md`:

```md
# DRY KISS YAGNI

Use when a task involves duplication, complexity, or proposed future-proofing.

Workflow:
1. Load relevant cards from `catalog/principles/core/`.
2. Separate knowledge duplication from harmless similar code.
3. Prefer the simplest design that satisfies current requirements.
4. Remove speculative configuration, hooks, abstractions, and extension points unless there is a concrete caller.
5. Keep the resulting code easy to read at the call site.

Stop when:
- The duplication is intentional locality and removing it would couple unrelated behavior.
- A future requirement is only imagined, not requested or already integrated.
```

Create `skills/pattern-selection/SKILL.md`:

```md
# Pattern Selection

Use when a recurring design problem remains after simpler refactoring and principle checks.

Workflow:
1. State the recurring problem in plain language.
2. Load one to three candidate cards from `catalog/patterns/`.
3. Reject any pattern that adds roles not present in the domain.
4. Choose the smallest pattern-shaped implementation that reduces caller complexity or change impact.
5. Document why a simpler function, object, or module boundary is insufficient.

Stop when:
- KISS or YAGNI explains why the pattern is premature.
- The pattern name is being used to justify unnecessary ceremony.
```

Create `skills/code-smell-diagnosis/SKILL.md`:

```md
# Code Smell Diagnosis

Use when code is hard to understand, change, test, or localize.

Workflow:
1. Identify observable symptoms in the code before naming a smell.
2. Load one to three matching cards from `catalog/smells/`.
3. Map the smell to the smallest behavior-preserving refactoring.
4. Avoid fixing unrelated smells in the same pass.
5. Verify the symptom is reduced after the change.

Stop when:
- The suspected smell has no current change cost.
- The code is intentionally explicit and local for readability.
```

Create `skills/refactoring-selection/SKILL.md`:

```md
# Refactoring Selection

Use when behavior should stay the same while structure improves.

Workflow:
1. Identify the exact behavior that must be preserved.
2. Load one to three relevant cards from `catalog/refactorings/`.
3. Choose one small transformation at a time.
4. Run tests or an observable check after each transformation.
5. Stop before mixing refactoring with feature behavior.

Stop when:
- Behavior is unclear and cannot be checked.
- The next change would require product or API decisions.
```

Create `skills/implementation-review/SKILL.md`:

```md
# Implementation Review

Use before claiming a design-related implementation is complete.

Workflow:
1. Review the changed files for new complexity, duplication, and speculative abstractions.
2. Load relevant cards from `catalog/principles/`, `catalog/smells/`, or `catalog/refactorings/` only when there is concrete evidence.
3. Check whether each new unit has one clear purpose and a stable interface.
4. Confirm pattern usage is justified by recurring design pressure.
5. Verify tests or observable checks cover preserved behavior.

Stop when:
- The review finds no design regression and verification has run.
- Further critique would be stylistic rather than risk-based.
```

- [ ] **Step 5: Run the skills test**

Run: `node --test tests/skills.test.mjs`

Expected: PASS.

---

### Task 5: Platform Adapter Generation

**Files:**
- Modify: `scripts/generate.mjs`
- Create: `tests/adapters.test.mjs`

- [ ] **Step 1: Write the failing adapter test**

Create `tests/adapters.test.mjs`:

```js
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
    assert.equal(JSON.parse(claude).name, "software-design");

    const codex = await readFile(join(root, "adapters/codex/AGENTS.md"), "utf8");
    assert.match(codex, /Software Design Orchestrator/);

    const opencode = await readFile(join(root, "adapters/opencode/opencode.jsonc"), "utf8");
    assert.match(opencode, /software-design/);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
```

- [ ] **Step 2: Run the failing adapter test**

Run: `node --test tests/adapters.test.mjs`

Expected: FAIL because `generateAll` does not return `adapterCount` and does not write adapters.

- [ ] **Step 3: Replace `scripts/generate.mjs` with adapter generation**

Replace `scripts/generate.mjs` with this complete file:

```js
import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { allItems } from "./lib/catalog.mjs";
import { renderCard } from "./lib/render-card.mjs";

const rootFromHere = dirname(dirname(fileURLToPath(import.meta.url)));
const skillNames = [
  "software-design-orchestrator",
  "solid-principles",
  "dry-kiss-yagni",
  "pattern-selection",
  "code-smell-diagnosis",
  "refactoring-selection",
  "implementation-review",
];

async function writeText(root, relativePath, content) {
  const target = join(root, relativePath);
  await mkdir(dirname(target), { recursive: true });
  await writeFile(target, content, "utf8");
}

async function copyIfExists(root, from, to) {
  await cp(join(root, from), join(root, to), { recursive: true });
}

export async function generateCatalog(root = rootFromHere) {
  await rm(join(root, "catalog"), { recursive: true, force: true });
  for (const item of allItems) {
    await writeText(root, item.path, renderCard(item));
  }
  return allItems.length;
}

export async function generateAdapters(root = rootFromHere) {
  await rm(join(root, "adapters"), { recursive: true, force: true });

  await writeText(root, "adapters/claude-code/.claude-plugin/plugin.json", `${JSON.stringify({
    name: "software-design",
    version: "0.1.0",
    description: "Software design principles, smells, refactorings, and pattern-selection skills.",
    author: "software-design-plugin",
  }, null, 2)}\n`);
  await writeText(root, "adapters/claude-code/agents/software-design.md", await readFile(join(root, "core/agent.md"), "utf8"));

  await writeText(root, "adapters/codex/AGENTS.md", await readFile(join(root, "core/agent.md"), "utf8"));
  await writeText(root, "adapters/opencode/AGENTS.md", await readFile(join(root, "core/agent.md"), "utf8"));
  await writeText(root, "adapters/opencode/opencode.jsonc", `{
  "$schema": "https://opencode.ai/config.json",
  "plugin": [],
  "instructions": ["AGENTS.md"]
}\n`);

  for (const adapter of ["claude-code", "codex", "opencode"]) {
    await copyIfExists(root, "catalog", `adapters/${adapter}/catalog`);
    for (const skillName of skillNames) {
      await copyIfExists(root, `skills/${skillName}`, `adapters/${adapter}/skills/${skillName}`);
    }
  }

  return 3;
}

export async function generateAll(root = rootFromHere) {
  const catalogCount = await generateCatalog(root);
  const adapterCount = await generateAdapters(root);
  return { catalogCount, adapterCount };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const result = await generateAll();
  console.log(`Generated ${result.catalogCount} catalog cards and ${result.adapterCount} platform adapters.`);
}
```

- [ ] **Step 4: Run adapter tests and regenerate**

Run: `node --test tests/adapters.test.mjs`

Expected: PASS.

Run: `npm run generate`

Expected: `Generated 119 catalog cards and 3 platform adapters.`

---

### Task 6: Validation Script

**Files:**
- Create: `scripts/validate.mjs`
- Create: `tests/validate.test.mjs`

- [ ] **Step 1: Write the failing validation test**

Create `tests/validate.test.mjs`:

```js
import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, rm } from "node:fs/promises";
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
```

- [ ] **Step 2: Run the failing validation test**

Run: `node --test tests/validate.test.mjs`

Expected: FAIL with `Cannot find module` for `scripts/validate.mjs`.

- [ ] **Step 3: Implement validation**

Create `scripts/validate.mjs` with `validateProject(root)` that checks:

- All 119 generated catalog files exist.
- Each catalog file contains `Use when:`, `Avoid when:`, `Apply:`, `Verify:`, and `Related:`.
- Seven primary `skills/*/SKILL.md` files exist.
- Claude Code, Codex, and OpenCode adapter manifest/instruction files exist.

When run directly, print `Validation passed: 119 cards, 7 skills, 3 adapters.` and exit with code 0.

- [ ] **Step 4: Run validation tests**

Run: `node --test tests/validate.test.mjs`

Expected: PASS.

Run: `npm run validate`

Expected: `Validation passed: 119 cards, 7 skills, 3 adapters.`

---

### Task 7: README And Install Documentation

**Files:**
- Create: `README.md`
- Create: `tests/readme.test.mjs`

- [ ] **Step 1: Write the failing README test**

Create `tests/readme.test.mjs`:

```js
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
});
```

- [ ] **Step 2: Run the failing README test**

Run: `node --test tests/readme.test.mjs`

Expected: FAIL with missing `README.md`.

- [ ] **Step 3: Create README**

Create `README.md` with these sections:

- `# Software Design Plugin`
- `## Why It Exists`
- `## Architecture`
- `## Catalog Coverage`
- `## Generate`
- `## Validate`
- `## Install In Claude Code`
- `## Install In Codex`
- `## Install In OpenCode`
- `## Development Workflow`

Document that agents should use primary skills first and load only one to three catalog cards for a design decision.

- [ ] **Step 4: Run README test**

Run: `node --test tests/readme.test.mjs`

Expected: PASS.

---

### Task 8: Full Verification

**Files:**
- Generated: `catalog/**`
- Generated: `adapters/**`

- [ ] **Step 1: Run the full check**

Run: `npm run check`

Expected: all tests pass, generation completes, and validation prints `Validation passed: 119 cards, 7 skills, 3 adapters.`

- [ ] **Step 2: Inspect generated output**

Run: `node -e "import('./scripts/lib/catalog.mjs').then(({ allItems }) => console.log(allItems.length))"`

Expected: `119`.

- [ ] **Step 3: Confirm no oversized skill files**

Run: `node -e "import('node:fs/promises').then(async fs => { const skills = ['software-design-orchestrator','solid-principles','dry-kiss-yagni','pattern-selection','code-smell-diagnosis','refactoring-selection','implementation-review']; for (const s of skills) { const b = await fs.readFile('skills/' + s + '/SKILL.md', 'utf8'); if (b.length >= 3500) throw new Error(s + ' too large'); } console.log('Skill sizes OK'); })"`

Expected: `Skill sizes OK`.

---

## Self-Review

- Spec coverage: tasks cover canonical source, compact catalog cards, primary skills, core orchestrator, generated adapters, validation, and README install docs.
- Placeholder scan: implementation steps name exact files, commands, expected results, and required generated outputs.
- Type consistency: catalog exports are `principles`, `patterns`, `smells`, `refactorings`, and `allItems`; tests and scripts use the same names.
