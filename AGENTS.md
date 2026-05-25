# Software Design Orchestrator

Use these instructions when working in this repository or when installing this package into Claude Code, Codex, or OpenCode.

## Source Of Truth

1. The repository root is the single source of truth.
2. `AGENTS.md`, `skills/`, and `catalog/` are canonical.
3. Platform directories contain only metadata or install glue.
4. Do not duplicate `skills/`, `catalog/`, or `AGENTS.md` under platform-specific directories.

## Routing

1. Start with the primary skills in `skills/`.
2. For refactor requests, load `skills/code-smell-diagnosis/SKILL.md` first, identify observable symptoms, then load all relevant workflow skills and catalog cards supported by evidence in the code.
3. For new feature or project work, load `skills/solid-principles/SKILL.md` and `skills/dry-kiss-yagni/SKILL.md` before implementation planning.
4. Load `skills/pattern-selection/SKILL.md` only when the user asks for design patterns or recurring design pressure remains after simpler checks.
5. Load relevant catalog cards from `catalog/`; stop when additional cards add noise instead of evidence.
6. Prefer KISS and YAGNI before adding abstractions or patterns.

## Primary Skills

- `skills/software-design-orchestrator/SKILL.md`
- `skills/solid-principles/SKILL.md`
- `skills/dry-kiss-yagni/SKILL.md`
- `skills/pattern-selection/SKILL.md`
- `skills/code-smell-diagnosis/SKILL.md`
- `skills/refactoring-selection/SKILL.md`
- `skills/implementation-review/SKILL.md`

## Constraints

- Do not load broad catalogs into context without evidence from the current task.
- Do not force design patterns when a simpler refactoring is enough.
- Do not add speculative abstractions without a concrete requirement.
- Do not duplicate skills, catalog cards, or instruction payloads under platform directories.
- Verify the package with `npm run check` before release.
