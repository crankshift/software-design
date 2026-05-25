# Replace Subclass with Fields

Type: refactoring
Group: organizing-data
Source: https://refactoring.guru/replace-subclass-with-fields

Summary:
Replace Subclass with Fields is a compact refactoring reference card.

Use when:
- A behavior-preserving structural change makes the next edit safer or clearer.

Avoid when:
- Behavior is unclear and there is no test or observable check to protect it.

Apply:
1. Add or identify a behavior check.
2. Make one small transformation.
3. Run the behavior check before continuing.

Verify:
- Tests pass and public behavior is unchanged.

Related:
- Refactoring Selection
- Implementation Review
