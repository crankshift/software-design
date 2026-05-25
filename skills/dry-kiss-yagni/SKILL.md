---
name: dry-kiss-yagni
description: Use when duplication, complexity, or proposed future-proofing needs design judgment.
version: 0.1.0
---

# DRY KISS YAGNI

Use when a task involves duplication, complexity, or proposed future-proofing.

Workflow:
1. For new feature or project work, treat this as a mandatory design check alongside `solid-principles`.
2. Load relevant cards from `catalog/principles/core/`.
3. Separate knowledge duplication from harmless similar code.
4. Prefer the simplest design that satisfies current requirements.
5. Remove speculative configuration, hooks, abstractions, and extension points unless there is a concrete caller.
6. Keep the resulting code easy to read at the call site.

Stop when:
- The duplication is intentional locality and removing it would couple unrelated behavior.
- A future requirement is only imagined, not requested or already integrated.
