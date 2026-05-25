---
name: pattern-selection
description: Use when a recurring design problem remains after simpler refactoring and principle checks.
version: 0.1.0
---

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
