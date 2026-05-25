# Facade

Type: pattern
Group: structural
Source: https://refactoring.guru/design-patterns/facade

Summary:
Expose a simpler interface over a complex subsystem.

Use when:
- The same design problem is recurring and a simple function or refactoring is not enough.

Avoid when:
- The pattern would add roles, files, or indirection before they are needed.

Apply:
1. State the recurring problem.
2. Map each pattern role to an existing domain concept.
3. Introduce the smallest stable interface needed by the caller.

Verify:
- Callers became simpler or change impact became smaller.

Related:
- KISS
- YAGNI
- Pattern Selection
