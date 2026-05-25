# Software Design Orchestrator

Use these instructions when working in this repository or when installing the generated adapters into Claude Code, Codex, or OpenCode.

## Routing

1. Start with the primary skills in `skills/`.
2. Load only the workflow skill that matches the current task.
3. Load one to three catalog cards from `catalog/` for the specific design decision.
4. Prefer KISS and YAGNI before adding abstractions or patterns.
5. Use `core/agent.md` as the canonical orchestrator prompt.

## Primary Skills

- `skills/software-design-orchestrator/SKILL.md`
- `skills/solid-principles/SKILL.md`
- `skills/dry-kiss-yagni/SKILL.md`
- `skills/pattern-selection/SKILL.md`
- `skills/code-smell-diagnosis/SKILL.md`
- `skills/refactoring-selection/SKILL.md`
- `skills/implementation-review/SKILL.md`

## Constraints

- Do not load broad catalogs into context.
- Do not force design patterns when a simpler refactoring is enough.
- Do not add speculative abstractions without a concrete requirement.
- Verify generated adapters with `npm run check` before release.
