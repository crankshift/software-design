---
name: software-design-orchestrator
description: Use when a development task needs design triage before implementation or review.
version: 0.1.0
---

# Software Design Orchestrator

Use when a task needs design triage before implementation or review.

Workflow:
1. Classify the request: refactor, new feature, project, review, or mechanical change.
2. For refactor requests, load `code-smell-diagnosis` first and identify observable symptoms before choosing follow-up skills.
3. Load all relevant workflow skills supported by evidence: `refactoring-selection`, `solid-principles`, `dry-kiss-yagni`, `pattern-selection`, or `implementation-review`.
4. For new feature or project work, always load `solid-principles` and `dry-kiss-yagni` before implementation planning.
5. Load `pattern-selection` only when the user asks for patterns or recurring design pressure remains after simpler checks.
6. Load relevant catalog cards from `catalog/`; stop when additional cards add noise instead of evidence.
7. Explain the chosen design move in terms of concrete change cost.

Stop when:
- The task is purely mechanical and no design judgment is needed.
- More catalog cards would add noise instead of evidence.
