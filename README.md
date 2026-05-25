# Software Design Plugin

Portable software design skills and catalog cards for Claude Code, Codex, and OpenCode.

## Why It Exists

This project keeps software design guidance useful without flooding an agent's context. It uses a few primary skills for workflow decisions, plus compact catalog cards for specific design decisions.

Agents should start with the primary skills, then load only one to three catalog cards when a decision needs focused guidance. That keeps active context small while still making a broad software design catalog available.

## Architecture

This repository is the single installable package. The source of truth is the root content:

- `AGENTS.md` for cross-platform orchestration instructions.
- `core/agent.md` for the canonical orchestrator prompt.
- `skills/` for the primary workflow skills.
- `catalog/` for compact design reference cards.

Platform directories contain only metadata or install glue:

- `.claude-plugin/plugin.json`
- `.codex-plugin/plugin.json`
- `.opencode/INSTALL.md`
- `.opencode/plugins/software-design.js`

There are no checked-in generated adapter copies.

## Catalog Coverage

The catalog contains 119 compact cards total:

- 8 principles
- 22 patterns
- 23 smells
- 66 refactorings

These cards are intended to be loaded selectively, not all at once.

## Prerequisites

Node.js 20+ and npm are required to run validation and tests.

## Validate

Run `npm run validate` to check that the canonical package files satisfy the project validation rules.

## Install In Claude Code

Install this repository root through Claude Code's local plugin install flow. Claude Code discovers `.claude-plugin/plugin.json`, root-level `skills/`, and other plugin content from the repository root.

## Install In Codex

Install this repository root as a Codex plugin. `.codex-plugin/plugin.json` points Codex at the canonical `./skills/` directory and describes the plugin interface.

## Install In OpenCode

Follow `.opencode/INSTALL.md`. OpenCode loads the package entry point from `package.json`, then `.opencode/plugins/software-design.js` registers the canonical root `skills/` directory.

## Development Workflow

Use the normal checks before relying on package output:

- `npm run validate` validates the canonical package.
- `npm test` runs the test suite.
- `npm run check` runs tests and validation together.

For catalog changes, update `catalog/`, run `npm run validate`, and run `npm test`. For release-style verification, run `npm run check`.
