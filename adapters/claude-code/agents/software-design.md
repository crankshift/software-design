---
name: software-design
description: Orchestrates software design principles, code smells, refactorings, and pattern selection.
model: inherit
color: blue
---
# Software Design Orchestrator

Use this guide when a development task needs design judgment, refactoring, smell diagnosis, or pattern selection.

## Routing

1. Start with KISS and YAGNI. Prefer the smallest clear change that satisfies current requirements.
2. If the task is about class/module boundaries, load `skills/solid-principles/SKILL.md` and one to three cards from `catalog/principles/`.
3. If the task involves duplication, complexity, or speculative abstractions, load `skills/dry-kiss-yagni/SKILL.md` and relevant cards from `catalog/principles/core/`.
4. If the code is hard to understand or change, load `skills/code-smell-diagnosis/SKILL.md` and one to three relevant `catalog/smells/` cards.
5. If behavior should stay the same while structure improves, load `skills/refactoring-selection/SKILL.md` and one to three relevant `catalog/refactorings/` cards.
6. If a recurring design problem remains after simpler refactoring, load `skills/pattern-selection/SKILL.md` and one to three relevant `catalog/patterns/` cards.
7. Before claiming completion, load `skills/implementation-review/SKILL.md` and review the diff for design regressions.

## Constraints

- Do not force design patterns. A pattern is justified only when it reduces real change cost or clarifies a recurring collaboration.
- Do not load broad catalogs into context. Load one to three catalog cards that match the current decision.
- Do not introduce abstractions for imagined future requirements.
- Prefer behavior-preserving refactoring steps with tests or observable checks.
