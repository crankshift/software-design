---
name: refactoring-selection
description: Use when behavior should stay the same while structure improves.
version: 0.1.0
---

# Refactoring Selection

Use when behavior should stay the same while structure improves.

Workflow:
1. Identify the exact behavior that must be preserved.
2. If the user asked broadly for a refactor and `code-smell-diagnosis` has not already run, load it first and use its symptoms to guide this choice.
3. Load relevant cards from `catalog/refactorings/` for the diagnosed transformation.
4. Choose one small transformation at a time.
5. Run tests or an observable check after each transformation.
6. Stop before mixing refactoring with feature behavior.

Stop when:
- Behavior is unclear and cannot be checked.
- The next change would require product or API decisions.
