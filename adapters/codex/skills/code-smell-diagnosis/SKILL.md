---
name: code-smell-diagnosis
description: Use when code is hard to understand, change, test, or localize.
version: 0.1.0
---

# Code Smell Diagnosis

Use when code is hard to understand, change, test, or localize.

Workflow:
1. Identify observable symptoms in the code before naming a smell.
2. Load one to three matching cards from `catalog/smells/`.
3. Map the smell to the smallest behavior-preserving refactoring.
4. Avoid fixing unrelated smells in the same pass.
5. Verify the symptom is reduced after the change.

Stop when:
- The suspected smell has no current change cost.
- The code is intentionally explicit and local for readability.
