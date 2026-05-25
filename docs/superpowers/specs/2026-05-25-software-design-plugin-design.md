# Software Design Plugin Design

## Purpose

Build a portable AI coding plugin that helps Claude Code, Codex, and OpenCode agents apply software design principles, diagnose code smells, choose refactorings, and select design patterns without flooding the agent context.

## Scope

The project will provide one canonical source tree with generated platform adapters. It will include a small set of workflow skills and a complete compact catalog covering SOLID, DRY, KISS, YAGNI, Refactoring.Guru design patterns, code smells, and refactoring techniques.

## Architecture

The plugin uses a few high-signal skills for orchestration and many compact catalog cards for on-demand reference.

Canonical layout:

```text
core/
  agent.md
skills/
  software-design-orchestrator/
  solid-principles/
  dry-kiss-yagni/
  pattern-selection/
  code-smell-diagnosis/
  refactoring-selection/
  implementation-review/
catalog/
  principles/
  patterns/
  smells/
  refactorings/
adapters/
  claude-code/
  codex/
  opencode/
```

## Orchestration Model

`core/agent.md` is the main routing guide. It instructs the AI agent to inspect the task, decide whether the work needs principles, smell diagnosis, refactoring, pattern selection, or implementation review, then load only the relevant skill and one to three relevant catalog cards.

The orchestrator must prevent pattern forcing. KISS and YAGNI are default constraints. A design pattern should be recommended only when the problem is recurring, the simpler solution is insufficient, and the pattern improves changeability or clarity.

## Skills

The plugin will include these primary skills:

- `software-design-orchestrator`: task triage and catalog routing.
- `solid-principles`: applies single responsibility, open/closed, Liskov substitution, interface segregation, and dependency inversion.
- `dry-kiss-yagni`: applies duplication, simplicity, and unnecessary-abstraction checks.
- `pattern-selection`: chooses and validates design pattern fit.
- `code-smell-diagnosis`: identifies smells and maps them to safe refactorings.
- `refactoring-selection`: selects behavior-preserving refactoring sequences.
- `implementation-review`: reviews completed changes for design regressions.

Each skill should be short, operational, and AI-facing. Skills should reference catalog paths rather than embedding full pattern, smell, or refactoring content.

## Catalog Cards

Each catalog item is a compact Markdown reference card, not a separate skill. This avoids context pollution while preserving complete coverage.

Card format:

```md
# Name

Use when:
- Concrete trigger conditions.

Avoid when:
- Conditions where this would overcomplicate or mislead.

Apply:
1. Safe, behavior-preserving steps.

Verify:
- Checks, tests, or review questions.

Related:
- Related principles, smells, refactorings, or patterns.
```

Coverage includes:

- Principle cards for single responsibility, open/closed, Liskov substitution, interface segregation, dependency inversion, DRY, KISS, and YAGNI.
- Creational design patterns: Factory Method, Abstract Factory, Builder, Prototype, Singleton.
- Structural design patterns: Adapter, Bridge, Composite, Decorator, Facade, Flyweight, Proxy.
- Behavioral design patterns: Chain of Responsibility, Command, Iterator, Mediator, Memento, Observer, State, Strategy, Template Method, Visitor.
- Refactoring.Guru code smells: Long Method, Large Class, Primitive Obsession, Long Parameter List, Data Clumps, Switch Statements, Temporary Field, Refused Bequest, Alternative Classes with Different Interfaces, Divergent Change, Shotgun Surgery, Parallel Inheritance Hierarchies, Comments, Duplicate Code, Lazy Class, Data Class, Dead Code, Speculative Generality, Feature Envy, Inappropriate Intimacy, Message Chains, Middle Man, Incomplete Library Class.
- Refactoring.Guru refactoring techniques: Extract Method, Inline Method, Extract Variable, Inline Temp, Replace Temp with Query, Split Temporary Variable, Remove Assignments to Parameters, Replace Method with Method Object, Substitute Algorithm, Move Method, Move Field, Extract Class, Inline Class, Hide Delegate, Remove Middle Man, Introduce Foreign Method, Introduce Local Extension, Change Value to Reference, Change Reference to Value, Duplicate Observed Data, Self Encapsulate Field, Replace Data Value with Object, Replace Array with Object, Change Unidirectional Association to Bidirectional, Change Bidirectional Association to Unidirectional, Encapsulate Field, Encapsulate Collection, Replace Magic Number with Symbolic Constant, Replace Type Code with Class, Replace Type Code with Subclasses, Replace Type Code with State/Strategy, Replace Subclass with Fields, Consolidate Conditional Expression, Consolidate Duplicate Conditional Fragments, Decompose Conditional, Replace Conditional with Polymorphism, Remove Control Flag, Replace Nested Conditional with Guard Clauses, Introduce Null Object, Introduce Assertion, Add Parameter, Remove Parameter, Rename Method, Separate Query from Modifier, Parameterize Method, Introduce Parameter Object, Preserve Whole Object, Remove Setting Method, Replace Parameter with Explicit Methods, Replace Parameter with Method Call, Hide Method, Replace Constructor with Factory Method, Replace Error Code with Exception, Replace Exception with Test, Pull Up Field, Pull Up Method, Pull Up Constructor Body, Push Down Field, Push Down Method, Extract Subclass, Extract Superclass, Extract Interface, Collapse Hierarchy, Form Template Method, Replace Inheritance with Delegation, and Replace Delegation with Inheritance.

## Platform Adapters

Adapters are generated from the canonical source.

Claude Code adapter:

- Emits `.claude-plugin/plugin.json`.
- Emits `skills/*/SKILL.md` for primary workflow skills.
- Emits `agents/software-design.md` for the orchestrator agent.
- Keeps catalog files available as bundled references.

Codex adapter:

- Emits Codex-compatible skill folders.
- Adds `agents/openai.yaml` metadata where useful.
- Emits `AGENTS.md` or install notes that tell Codex how to use the orchestrator and catalog.

OpenCode adapter:

- Emits OpenCode-compatible plugin/config files and install instructions.
- Provides a project/global install path for the same primary skills and catalog.
- Avoids custom runtime tools for the first version unless plain file-based skills are insufficient.

## Validation

The project should include validation scripts that check:

- Required skill folders exist.
- Required catalog cards exist for all listed principles, patterns, smells, and refactorings.
- Catalog cards use the required sections.
- Generated adapters contain expected manifest/config files.
- Documentation lists install instructions for Claude Code, Codex, and OpenCode.

## Non-Goals

- Do not create every pattern, smell, or refactoring technique as a separate skill.
- Do not copy long-form Refactoring.Guru content.
- Do not require a runtime service for basic use.
- Do not force design patterns when a simpler refactoring or principle is enough.

## Success Criteria

- The project installs or can be copied into Claude Code, Codex, and OpenCode.
- Agents can use a small number of skills without scanning hundreds of skill descriptions.
- The catalog covers the requested principles, patterns, smells, and refactorings.
- The orchestrator guides agents toward minimal, safe design improvements.
- Validation catches missing catalog entries and malformed generated adapters.
