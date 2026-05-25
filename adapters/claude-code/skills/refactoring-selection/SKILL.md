---
name: refactoring-selection
description: Use when behavior should stay the same while structure improves.
version: 0.1.0
---

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
