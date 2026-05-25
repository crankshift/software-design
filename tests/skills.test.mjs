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
    assert.ok(body.startsWith("---"), `${skill} should start with frontmatter`);
    assert.match(body, new RegExp(`name: ${skill}`));
    assert.match(body, /description:/);
    assert.match(body, /version: 0\.1\.0/);
    assert.match(body, /^# /m);
    assert.match(body, /catalog\//);
    assert.ok(body.length < 3500, `${skill} should stay compact`);
  }
});

test("root instructions route refactors through smells and features through core principles", async () => {
  const body = await readFile("AGENTS.md", "utf8");
  assert.match(body, /KISS/);
  assert.match(body, /YAGNI/);
  assert.match(body, /Do not force design patterns/);
  assert.match(body, /code-smell-diagnosis/);
  assert.match(body, /refactor/i);
  assert.match(body, /solid-principles/);
  assert.match(body, /dry-kiss-yagni/);
  assert.match(body, /feature/i);
  assert.match(body, /project/i);
  assert.match(body, /relevant catalog cards/);
});

test("refactor and feature workflow skills declare mandatory triage", async () => {
  const orchestrator = await readFile("skills/software-design-orchestrator/SKILL.md", "utf8");
  const smells = await readFile("skills/code-smell-diagnosis/SKILL.md", "utf8");
  const refactoring = await readFile("skills/refactoring-selection/SKILL.md", "utf8");

  assert.match(orchestrator, /refactor/i);
  assert.match(orchestrator, /code-smell-diagnosis/);
  assert.match(orchestrator, /solid-principles/);
  assert.match(orchestrator, /dry-kiss-yagni/);
  assert.match(orchestrator, /pattern-selection/);
  assert.match(orchestrator, /relevant workflow skills/);

  assert.match(smells, /refactor/i);
  assert.match(smells, /triage/i);
  assert.match(smells, /workflow skills/);

  assert.match(refactoring, /code-smell-diagnosis/);
});
