const defaults = {
  principle: {
    useWhen: ["A design decision needs a constraint before adding structure."],
    avoidWhen: ["The principle is being used as a slogan without a concrete code pressure."],
    apply: ["Name the concrete pressure.", "Prefer the smallest change that improves the design.", "Check that the new boundary is easier to understand and test."],
    verify: ["The change has a concrete reason and does not add speculative abstraction."],
    related: ["KISS", "YAGNI", "Implementation Review"],
  },
  pattern: {
    useWhen: ["The same design problem is recurring and a simple function or refactoring is not enough."],
    avoidWhen: ["The pattern would add roles, files, or indirection before they are needed."],
    apply: ["State the recurring problem.", "Map each pattern role to an existing domain concept.", "Introduce the smallest stable interface needed by the caller."],
    verify: ["Callers became simpler or change impact became smaller."],
    related: ["KISS", "YAGNI", "Pattern Selection"],
  },
  smell: {
    useWhen: ["Code is harder to change, understand, or test for the named reason."],
    avoidWhen: ["The code is stable, local, readable, and the suspected smell has no change cost."],
    apply: ["Confirm the symptom with code evidence.", "Pick one safe refactoring at a time.", "Keep behavior unchanged until tests prove otherwise."],
    verify: ["The symptom is reduced and behavior is preserved."],
    related: ["Code Smell Diagnosis", "Refactoring Selection"],
  },
  refactoring: {
    useWhen: ["A behavior-preserving structural change makes the next edit safer or clearer."],
    avoidWhen: ["Behavior is unclear and there is no test or observable check to protect it."],
    apply: ["Add or identify a behavior check.", "Make one small transformation.", "Run the behavior check before continuing."],
    verify: ["Tests pass and public behavior is unchanged."],
    related: ["Refactoring Selection", "Implementation Review"],
  },
};

const list = (items) => items.map((item) => `- ${item}`).join("\n");
const steps = (items) => items.map((item, index) => `${index + 1}. ${item}`).join("\n");

export function renderCard(item) {
  const content = defaults[item.kind];
  if (!content) {
    throw new Error(`Unknown catalog item kind: ${item.kind}`);
  }

  return `# ${item.title}

Type: ${item.kind}
Group: ${item.group}
Source: ${item.sourceUrl}

Summary:
${item.summary ?? `${item.title} is a compact ${item.kind} reference card.`}

Use when:
${list(content.useWhen)}

Avoid when:
${list(content.avoidWhen)}

Apply:
${steps(content.apply)}

Verify:
${list(content.verify)}

Related:
${list(content.related)}
`;
}
