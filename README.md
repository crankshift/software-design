# Software Design Plugin

Portable software design skills and catalog cards for Claude Code, Codex, and OpenCode.

## Quickstart

Give your agent Software Design: [Claude Code](#claude-code), [Codex CLI](#codex-cli), [Codex App](#codex-app), [OpenCode](#opencode).

## Why It Exists

This project keeps software design guidance useful without flooding an agent's context. It uses a few primary skills for workflow decisions, plus compact catalog cards for specific design decisions.

Agents should start with the primary skills, then load only one to three catalog cards when a decision needs focused guidance. That keeps active context small while still making a broad software design catalog available.

## Architecture

This repository is the single installable package. The source of truth is the root content:

- [`AGENTS.md`](AGENTS.md) for cross-platform orchestration instructions.
- [`core/agent.md`](core/agent.md) for the canonical orchestrator prompt.
- [`skills/`](skills/) for the primary workflow skills.
- [`catalog/`](catalog/) for compact design reference cards.

Platform directories contain only metadata or install glue:

- [`.claude-plugin/plugin.json`](.claude-plugin/plugin.json)
- [`.codex-plugin/plugin.json`](.codex-plugin/plugin.json)
- [`.opencode/INSTALL.md`](.opencode/INSTALL.md)
- [`.opencode/plugins/software-design.js`](.opencode/plugins/software-design.js)

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

## Installation

Installation differs by harness. If you use more than one, install Software Design separately for each one.

### Claude Code

Register this repository as a plugin marketplace, then install Software Design:

```text
/plugin marketplace add crankshift/software-design
/plugin install software-design@software-design
```

Claude Code discovers [`.claude-plugin/plugin.json`](.claude-plugin/plugin.json), root-level [`skills/`](skills/), and other plugin content from the repository root.

### Codex CLI

Register this repository as a plugin marketplace, then install Software Design:

```bash
codex plugin marketplace add crankshift/software-design
codex plugin add software-design@software-design
```

Codex reads [`.codex-plugin/plugin.json`](.codex-plugin/plugin.json), which points at the canonical [`skills/`](skills/) directory.

### Codex App

Open Plugins in the Codex app sidebar, add this repository as a marketplace, then install Software Design:

```text
https://github.com/crankshift/software-design
```

Codex reads [`.codex-plugin/plugin.json`](.codex-plugin/plugin.json), which points at the canonical [`skills/`](skills/) directory.

### OpenCode

Add Software Design to the `plugin` array in your `opencode.json`:

```json
{
  "$schema": "https://opencode.ai/config.json",
  "plugin": ["software-design-plugin@git+https://github.com/crankshift/software-design.git"]
}
```

Restart OpenCode. OpenCode loads the package entry point from [`package.json`](package.json), then [`.opencode/plugins/software-design.js`](.opencode/plugins/software-design.js) registers the canonical root [`skills/`](skills/) directory.

Detailed OpenCode instructions are in [`.opencode/INSTALL.md`](.opencode/INSTALL.md).

## Plugin Metadata

Claude Code discovers [`.claude-plugin/plugin.json`](.claude-plugin/plugin.json), root-level [`skills/`](skills/), and other plugin content from the repository root.

Codex reads [`.codex-plugin/plugin.json`](.codex-plugin/plugin.json), which points Codex at the canonical [`skills/`](skills/) directory and describes the plugin interface.

OpenCode follows [`.opencode/INSTALL.md`](.opencode/INSTALL.md). It loads the package entry point from [`package.json`](package.json), then [`.opencode/plugins/software-design.js`](.opencode/plugins/software-design.js) registers the canonical root [`skills/`](skills/) directory.

## Development Workflow

Use the normal checks before relying on package output:

- `npm run validate` validates the canonical package.
- `npm test` runs the test suite.
- `npm run check` runs tests and validation together.

For catalog changes, update [`catalog/`](catalog/), run `npm run validate`, and run `npm test`. For release-style verification, run `npm run check`.

## License

MIT License. See [`LICENSE`](LICENSE) for details.
