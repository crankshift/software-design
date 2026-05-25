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

test("core agent prevents pattern forcing", async () => {
  const body = await readFile("core/agent.md", "utf8");
  assert.match(body, /KISS/);
  assert.match(body, /YAGNI/);
  assert.match(body, /Do not force design patterns/);
  assert.match(body, /one to three catalog cards/);
});
