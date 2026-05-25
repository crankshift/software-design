---
name: software-design-orchestrator
description: Use when a development task needs design triage before implementation or review.
version: 0.1.0
---

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
