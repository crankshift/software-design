import test from "node:test";
import assert from "node:assert/strict";
import { renderCard } from "../scripts/lib/render-card.mjs";

test("renderCard emits required compact card sections", () => {
  const markdown = renderCard({
    title: "Strategy",
    slug: "strategy",
    kind: "pattern",
    group: "behavioral",
    summary: "Swap interchangeable algorithms behind a stable interface.",
    sourceUrl: "https://refactoring.guru/design-patterns/strategy",
    path: "catalog/patterns/behavioral/strategy.md",
  });

  assert.match(markdown, /^# Strategy/m);
  assert.match(markdown, /Type: pattern/);
  assert.match(markdown, /Group: behavioral/);
  assert.match(markdown, /Source: https:\/\/refactoring\.guru\/design-patterns\/strategy/);
  assert.match(markdown, /Summary:/);
  assert.match(markdown, /Use when:/);
  assert.match(markdown, /Avoid when:/);
  assert.match(markdown, /Apply:/);
  assert.match(markdown, /Verify:/);
  assert.match(markdown, /Related:/);
  assert.ok(markdown.length < 1500);
});
