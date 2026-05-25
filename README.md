# Software Design Plugin

Portable software design skills and catalog cards for Claude Code, Codex, and OpenCode.

## Why It Exists

This project keeps software design guidance useful without flooding an agent's context. It uses a few primary skills for the main workflow, plus compact catalog cards for specific design decisions.

Agents should start with the primary skills, then load only one to three catalog cards when a decision needs focused guidance. That keeps the active context small while still making a broad software design catalog available.

## Architecture

The source catalog and skill content are platform-neutral. Generation creates adapter-specific output for each supported agent platform.

Generated adapters live under:

- `adapters/claude-code`
- `adapters/codex`
- `adapters/opencode`

Root `AGENTS.md` provides cross-platform repository instructions. Each generated adapter also includes its own `README.md` with platform-specific install notes.

## Catalog Coverage

The catalog contains 119 compact cards total:

- 8 principles
- 22 patterns
- 23 smells
- 66 refactorings

These cards are intended to be loaded selectively, not all at once.

## Prerequisites

Node.js 20+ and npm are required to run generation, validation, and tests.

## Generate

Run `npm run generate` to rebuild generated adapter output from the shared source catalog and skills.

## Validate

Run `npm run validate` to check that the catalog and generated artifacts satisfy the project validation rules.

## Install In Claude Code

Generate the adapters, then point Claude Code's local plugin install flow at `adapters/claude-code/`. This directory is a Claude Code plugin root containing `.claude-plugin/plugin.json`, `AGENTS.md`, `agents/software-design.md`, `README.md`, `skills/`, and `catalog/`.

Key generated files include `adapters/claude-code/.claude-plugin/plugin.json` and `adapters/claude-code/agents/software-design.md`.

## Install In Codex

Generate the adapters, then use `adapters/codex/` as the project or global instructions and skills payload for Codex. This adapter contains `AGENTS.md`, `README.md`, `skills/`, and `catalog/`, with `adapters/codex/AGENTS.md` serving as the orchestrator instructions file.

## Install In OpenCode

Generate the adapters, then use `adapters/opencode/` as the OpenCode adapter payload. This adapter contains `opencode.jsonc`, `AGENTS.md`, `README.md`, `skills/`, and `catalog/`.

The generated `adapters/opencode/opencode.jsonc` wires the adapter by setting `instructions: ["AGENTS.md"]` and `skills.paths: ["skills"]`.

## Development Workflow

Use the normal checks before relying on generated output:

- `npm run generate` rebuilds adapters.
- `npm run validate` validates the catalog and generated artifacts.
- `npm test` runs the test suite.
- `npm run check` runs tests, generation, and validation together.

For catalog changes, update the source content, run `npm run generate`, then run `npm run validate` and `npm test`. For release-style verification, run `npm run check`.
