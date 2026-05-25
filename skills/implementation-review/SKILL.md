---
name: implementation-review
description: Use before claiming a design-related implementation is complete.
version: 0.1.0
---

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
