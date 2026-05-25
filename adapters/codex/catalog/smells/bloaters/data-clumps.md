# Data Clumps

Type: smell
Group: bloaters
Source: https://refactoring.guru/smells/data-clumps

Summary:
Data Clumps is a compact smell reference card.

Use when:
- Code is harder to change, understand, or test for the named reason.

Avoid when:
- The code is stable, local, readable, and the suspected smell has no change cost.

Apply:
1. Confirm the symptom with code evidence.
2. Pick one safe refactoring at a time.
3. Keep behavior unchanged until tests prove otherwise.

Verify:
- The symptom is reduced and behavior is preserved.

Related:
- Code Smell Diagnosis
- Refactoring Selection
