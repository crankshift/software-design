# Strategy

Type: pattern
Group: behavioral
Source: https://refactoring.guru/design-patterns/strategy

Summary:
Swap interchangeable algorithms behind a stable interface.

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
