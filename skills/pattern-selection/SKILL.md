---
name: pattern-selection
description: Use when a recurring design problem remains after simpler refactoring and principle checks.
version: 0.1.0
---

# Pattern Selection

Use when a recurring design problem remains after simpler refactoring and principle checks.

Workflow:
1. Confirm the user asked for patterns or simpler SOLID, KISS, YAGNI, smell, and refactoring checks left recurring design pressure.
2. State the recurring problem in plain language.
3. Load relevant candidate cards from `catalog/patterns/`.
4. Reject any pattern that adds roles not present in the domain.
5. Choose the smallest pattern-shaped implementation that reduces caller complexity or change impact.
6. Document why a simpler function, object, or module boundary is insufficient.

Stop when:
- KISS or YAGNI explains why the pattern is premature.
- The pattern name is being used to justify unnecessary ceremony.
