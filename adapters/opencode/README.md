# Software Design Plugin - OpenCode Adapter

This generated adapter packages the Software Design Plugin for OpenCode.

## Contents

- `opencode.jsonc`
- `AGENTS.md`
- `skills/`
- `catalog/`

## Install

Use this directory as the OpenCode adapter payload. `opencode.jsonc` wires `AGENTS.md` through `instructions` and exposes `skills/` through `skills.paths`.

## Usage

Start with the primary skills in `skills/`, then load one to three cards from `catalog/` for the specific design decision. Prefer KISS and YAGNI before adding patterns or abstractions.
