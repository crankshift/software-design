import { access, cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { allItems } from "./lib/catalog.mjs";
import { renderCard } from "./lib/render-card.mjs";

const rootFromHere = dirname(dirname(fileURLToPath(import.meta.url)));

async function writeText(root, relativePath, content) {
  const target = join(root, relativePath);
  await mkdir(dirname(target), { recursive: true });
  await writeFile(target, content, "utf8");
}

async function pathExists(path) {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

async function sourceRootFor(root, relativePath) {
  return (await pathExists(join(root, relativePath))) ? root : rootFromHere;
}

async function writeCatalog(root, prefix = "") {
  for (const item of allItems) {
    await writeText(root, join(prefix, item.path), renderCard(item));
  }
  return allItems.length;
}

function adapterReadme(platform, files, installNote) {
  return `# Software Design Plugin - ${platform} Adapter

This generated adapter packages the Software Design Plugin for ${platform}.

## Contents

${files.map((file) => `- \`${file}\``).join("\n")}

## Install

${installNote}

## Usage

Start with the primary skills in \`skills/\`, then load one to three cards from \`catalog/\` for the specific design decision. Prefer KISS and YAGNI before adding patterns or abstractions.
`;
}

export async function generateCatalog(root = rootFromHere) {
  await rm(join(root, "catalog"), { recursive: true, force: true });
  return await writeCatalog(root);
}

export async function generateAdapters(root = rootFromHere) {
  const coreRoot = await sourceRootFor(root, "core/agent.md");
  const skillsRoot = await sourceRootFor(root, "skills");
  const agent = await readFile(join(coreRoot, "core/agent.md"), "utf8");
  const claudeAgent = `---
name: software-design
description: Orchestrates software design principles, code smells, refactorings, and pattern selection.
model: inherit
color: blue
---
${agent}`;

  const adapters = [
    {
      name: "claude-code",
      files: [
        [
          ".claude-plugin/plugin.json",
          `${JSON.stringify(
            {
              name: "software-design",
              version: "0.1.0",
              description: "Portable software design skills and catalog for Claude Code, Codex, and OpenCode.",
              author: {
                name: "software-design contributors",
              },
            },
            null,
            2,
          )}\n`,
        ],
        ["AGENTS.md", agent],
        ["agents/software-design.md", claudeAgent],
        [
          "README.md",
          adapterReadme("Claude Code", [".claude-plugin/plugin.json", "AGENTS.md", "agents/software-design.md", "skills/", "catalog/"], "Point Claude Code's local plugin install flow at this adapter directory."),
        ],
      ],
    },
    {
      name: "codex",
      files: [
        ["AGENTS.md", agent],
        [
          "README.md",
          adapterReadme("Codex", ["AGENTS.md", "skills/", "catalog/"], "Use this directory as the project or global instructions and skills payload for Codex. `AGENTS.md` is the orchestrator instructions file."),
        ],
      ],
    },
    {
      name: "opencode",
      files: [
        ["AGENTS.md", agent],
        [
          "opencode.jsonc",
          `{
  "$schema": "https://opencode.ai/config.json",
  "instructions": ["AGENTS.md"],
  "skills": {
    "paths": ["skills"]
  }
}
`,
        ],
        [
          "README.md",
          adapterReadme("OpenCode", ["opencode.jsonc", "AGENTS.md", "skills/", "catalog/"], "Use this directory as the OpenCode adapter payload. `opencode.jsonc` wires `AGENTS.md` through `instructions` and exposes `skills/` through `skills.paths`."),
        ],
      ],
    },
  ];

  for (const adapter of adapters) {
    const adapterPath = join(root, "adapters", adapter.name);
    await rm(adapterPath, { recursive: true, force: true });
    for (const [relativePath, content] of adapter.files) {
      await writeText(adapterPath, relativePath, content);
    }
    await cp(join(skillsRoot, "skills"), join(adapterPath, "skills"), { recursive: true });
    await writeCatalog(root, join("adapters", adapter.name));
  }

  return adapters.length;
}

export async function generateAll(root = rootFromHere) {
  const catalogCount = await generateCatalog(root);
  const adapterCount = await generateAdapters(root);
  return { catalogCount, adapterCount };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const result = await generateAll();
  console.log(`Generated ${result.catalogCount} catalog cards and ${result.adapterCount} platform adapters.`);
}
