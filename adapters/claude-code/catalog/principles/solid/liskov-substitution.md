# Liskov Substitution

Type: principle
Group: solid
Source: internal://software-design/principles

Summary:
Subtypes must preserve the promises of their base type.

Use when:
- A design decision needs a constraint before adding structure.

Avoid when:
- The principle is being used as a slogan without a concrete code pressure.

Apply:
1. Name the concrete pressure.
2. Prefer the smallest change that improves the design.
3. Check that the new boundary is easier to understand and test.

Verify:
- The change has a concrete reason and does not add speculative abstraction.

Related:
- KISS
- YAGNI
- Implementation Review
