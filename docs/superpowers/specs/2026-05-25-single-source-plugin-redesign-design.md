# Single Source Plugin Redesign Design

## Purpose

Redesign the Software Design Plugin so the repository itself is the single installable package for Claude Code, Codex, and OpenCode. The current tracked `adapters/` trees duplicate `skills/`, `catalog/`, and orchestrator instructions. The redesign removes those copies and follows the Superpowers model: one canonical content tree plus small platform metadata and install glue.

## Scope

The redesign covers the current three supported platforms only:

- Claude Code.
- Codex.
- OpenCode.

It does not add Gemini, Cursor, Copilot, or other harness support. It does not change the software-design skill behavior or expand catalog coverage except where required to keep paths accurate after removing adapters.

## Architecture

The repository root becomes the source of truth and the installable unit.

Target layout:

```text
AGENTS.md
README.md
package.json
.claude-plugin/plugin.json
.codex-plugin/plugin.json
.opencode/INSTALL.md
.opencode/plugins/software-design.js
catalog/
core/
skills/
scripts/validate.mjs
tests/
```

Canonical content remains in these paths:

- `AGENTS.md` provides cross-platform repository and orchestrator instructions.
- `core/agent.md` remains the canonical agent prompt used by root docs and platform glue.
- `skills/*/SKILL.md` contains the seven primary workflow skills.
- `catalog/**/*.md` contains the compact catalog cards.

Platform directories contain only metadata or glue. They must not contain copied `skills/`, copied `catalog/`, or copied `AGENTS.md` payloads.

## Platform Integration

Claude Code uses `.claude-plugin/plugin.json` at the repository root. The manifest describes the package and relies on the canonical root content rather than a generated `adapters/claude-code` tree.

Codex uses `.codex-plugin/plugin.json` at the repository root. The manifest points to `./skills/` and describes the plugin for Codex. Codex-facing instructions should direct users to the root `AGENTS.md` and canonical catalog.

OpenCode uses `.opencode/INSTALL.md` for install instructions and `.opencode/plugins/software-design.js` for automatic skill registration. The plugin file registers the root `skills/` directory through OpenCode configuration. It is platform glue, not generated content.

## Removed Generated Artifacts

The tracked `adapters/` directory is removed entirely:

- Remove `adapters/claude-code/**`.
- Remove `adapters/codex/**`.
- Remove `adapters/opencode/**`.

`scripts/generate.mjs` is removed because the redesign no longer emits copied adapter trees. If future generated release artifacts are needed, they should be produced outside the source tree or ignored by git.

## Validation And Tests

Validation changes from checking generated adapter copies to checking the canonical package shape.

`package.json` scripts become:

- `npm test` runs the test suite.
- `npm run validate` validates canonical root files.
- `npm run check` runs `npm test && npm run validate`.

`npm run generate` is removed.

`scripts/validate.mjs` should verify:

- The catalog contains the approved 119 cards.
- Each catalog card has the required sections.
- Each required skill exists, has valid frontmatter, references `catalog/`, and stays compact.
- Root `AGENTS.md` and `core/agent.md` contain orchestrator instructions.
- `.claude-plugin/plugin.json`, `.codex-plugin/plugin.json`, and OpenCode install/glue files exist and describe the package.
- No `adapters/` source tree exists in the repository.

Tests should enforce the same architecture:

- Adapter-copy tests are replaced with platform-metadata tests.
- README tests assert direct repo install instructions for Claude Code, Codex, and OpenCode.
- Project structure tests assert there is no `adapters/` source tree.
- Existing catalog, skill, and card-render tests remain where still relevant.

## Documentation

`README.md` should describe the repository as the installable package, not as a generator for adapter payloads. It should keep one install section per supported platform, modeled after Superpowers' direct install documentation.

The README should explain that:

- `skills/`, `catalog/`, and `AGENTS.md` are canonical.
- Platform directories are metadata/glue only.
- There is no checked-in generated adapter output.
- `scripts/` exists only for validation.

## Error Handling

The runtime surface is mostly file-based. Error handling focuses on validation and install clarity:

- Validation should fail with direct messages for missing skills, malformed catalog cards, missing platform manifests, or accidental reintroduction of adapter copies.
- OpenCode install docs should include enough troubleshooting for users to verify the plugin loads and skills are discoverable.
- Platform metadata should avoid depending on copied files that can drift from the root source.

## Migration

The implementation should preserve canonical content before deleting generated copies:

- Confirm `skills/`, `catalog/`, `AGENTS.md`, and `core/agent.md` have the content needed by all three platforms.
- Add root platform metadata and OpenCode install/glue.
- Update tests and validation to the new architecture.
- Remove generated adapter trees and generator code.
- Run `npm run check`.

## Non-Goals

- Do not add support for new platforms.
- Do not create a release packaging system unless validation proves it is necessary.
- Do not duplicate `skills/`, `catalog/`, or `AGENTS.md` under platform folders.
- Do not change skill behavior or catalog coverage as part of the structural redesign.
- Do not introduce third-party dependencies.

## Success Criteria

- The repo itself is the installable package for Claude Code, Codex, and OpenCode.
- There is one canonical copy of each skill and catalog card.
- Platform-specific directories contain only metadata, install docs, or minimal glue.
- `adapters/` and `scripts/generate.mjs` are gone.
- `npm run check` passes without regenerating adapter copies.
- README instructions clearly explain installation without telling users to use generated adapter directories.
