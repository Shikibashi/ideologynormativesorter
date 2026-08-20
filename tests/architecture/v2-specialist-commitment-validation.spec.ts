import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { validateContentSchema } from "../../v2/packages/content/src";
import type { CanonicalContentBundle } from "../../v2/packages/contracts/src/content";

const sourceBundle = JSON.parse(
  readFileSync("v2/generated/content.bundle.json", "utf8"),
) as CanonicalContentBundle;

function cloneBundle(): CanonicalContentBundle {
  return JSON.parse(JSON.stringify(sourceBundle)) as CanonicalContentBundle;
}

function firstVariantCommitment(bundle: CanonicalContentBundle): Record<string, unknown> {
  const variant = bundle.specialists.flatMap((profile) => profile.variants ?? []).find(
    (entry) => entry.commitments.length > 0,
  );
  if (!variant) throw new Error("Canonical bundle has no specialist variant commitment");
  return variant.commitments[0] as unknown as Record<string, unknown>;
}

describe("specialist commitment schema validation", () => {
  it("rejects a missing operator operand without throwing", () => {
    const bundle = cloneBundle();
    firstVariantCommitment(bundle).criterion = { operator: "minimum" };
    expect(() => validateContentSchema(bundle)).not.toThrow();
    const report = validateContentSchema(bundle);
    expect(report.success).toBe(false);
    expect(report.issues.some((issue) => issue.path.endsWith(".criterion.minimum"))).toBe(true);
  });

  it("rejects out-of-range and inverted interval bounds", () => {
    const outOfRange = cloneBundle();
    firstVariantCommitment(outOfRange).criterion = { operator: "maximum", maximum: 1.5 };
    const outOfRangeReport = validateContentSchema(outOfRange);
    expect(outOfRangeReport.success).toBe(false);
    expect(outOfRangeReport.issues.some((issue) => issue.message.includes("within [-1,1]"))).toBe(true);

    const inverted = cloneBundle();
    firstVariantCommitment(inverted).criterion = {
      operator: "interval",
      minimum: 0.7,
      maximum: -0.2,
    };
    const invertedReport = validateContentSchema(inverted);
    expect(invertedReport.success).toBe(false);
    expect(invertedReport.issues.some((issue) => issue.message.includes("minimum cannot exceed maximum"))).toBe(true);
  });

  it("reports malformed commitment arrays instead of throwing", () => {
    const bundle = cloneBundle();
    const variant = bundle.specialists.flatMap((profile) => profile.variants ?? [])[0];
    if (!variant) throw new Error("Canonical bundle has no specialist variant");
    (variant as unknown as { commitments: unknown }).commitments = { malformed: true };
    expect(() => validateContentSchema(bundle)).not.toThrow();
    const report = validateContentSchema(bundle);
    expect(report.success).toBe(false);
    expect(report.issues.some((issue) => issue.path.endsWith(".commitments"))).toBe(true);
  });
});
