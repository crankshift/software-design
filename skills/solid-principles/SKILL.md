---
name: solid-principles
description: Use when code boundaries, inheritance, interfaces, or dependencies make change harder.
version: 0.1.0
---

# SOLID Principles

Use when code boundaries, inheritance, interfaces, or dependencies are making change harder.

Workflow:
1. Identify which SOLID pressure is present: responsibility, extension, substitution, interface size, or dependency direction.
2. For new feature or project work, treat this as a mandatory design check alongside `dry-kiss-yagni`.
3. Load relevant cards from `catalog/principles/solid/` for the identified pressure.
4. Prefer a local boundary improvement before introducing a framework or broad abstraction.
5. Check that callers can understand the unit without reading its internals.
6. Verify that the change reduces a concrete reason to change.

Stop when:
- The current code is simple and the SOLID change would only add indirection.
- The design concern is actually duplication, premature abstraction, or a code smell handled by another skill.
