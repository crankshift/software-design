---
name: code-smell-diagnosis
description: Use when code is hard to understand, change, test, or localize.
version: 0.1.0
---

# Code Smell Diagnosis

Use when code is hard to understand, change, test, or localize.

Workflow:
1. For refactor requests, use this as the triage step before `refactoring-selection` or other design workflow skills.
2. Identify observable symptoms in the code before naming a smell.
3. Load relevant cards from `catalog/smells/` for symptoms that affect the current change.
4. Use the diagnosed smells to choose all relevant workflow skills and catalog cards needed next.
5. Map the smell to the smallest behavior-preserving refactoring.
6. Avoid fixing unrelated smells in the same pass.
7. Verify the symptom is reduced after the change.

Stop when:
- The suspected smell has no current change cost.
- The code is intentionally explicit and local for readability.
