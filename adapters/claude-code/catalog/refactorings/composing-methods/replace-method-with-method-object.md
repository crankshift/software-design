# Replace Method with Method Object

Type: refactoring
Group: composing-methods
Source: https://refactoring.guru/replace-method-with-method-object

Summary:
Replace Method with Method Object is a compact refactoring reference card.

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
