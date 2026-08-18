import { describe, expect, it } from "vitest";
import {
  CANONICAL_MANIFEST,
  axes,
  domains,
  getBankFingerprint,
  modifierScoringLabels,
  primaryScoringLabels,
  questionById,
  questions,
  questionsForTier,
  publicCatalogLabels,
} from "./selectors";

describe("canonical runtime selectors", () => {
  it("projects the canonical roots, active core items, and public labels", () => {
    expect(axes).toHaveLength(CANONICAL_MANIFEST.constructs.length);
    expect(questions).toHaveLength(
      CANONICAL_MANIFEST.activeCoreItemIds?.length ?? 0,
    );
    expect(primaryScoringLabels).toHaveLength(16);
    expect(modifierScoringLabels).toHaveLength(7);
    expect(publicCatalogLabels).toHaveLength(137);
    expect(domains).toHaveLength(20);
  });

  it("retains canonical item metadata and tier nesting", () => {
    const item = questionById.get("q0007");
    expect(item).toMatchObject({
      id: "q0007",
      layer: "descriptive",
      responseType: "likert7",
      allowDontKnow: true,
      contextNote: expect.any(String),
    });
    expect(
      questionsForTier("blitz").every((question) => question.tier === "blitz"),
    ).toBe(true);
    expect(questionsForTier("quick").length).toBeGreaterThan(
      questionsForTier("blitz").length,
    );
    expect(questionsForTier("moderate").length).toBeGreaterThan(
      questionsForTier("quick").length,
    );
  });

  it("uses the immutable canonical fingerprint and frozen projections", () => {
    expect(getBankFingerprint()).toBe(CANONICAL_MANIFEST.metadata.fingerprint);
    expect(Object.isFrozen(axes)).toBe(true);
    expect(Object.isFrozen(questions)).toBe(true);
    expect(Object.isFrozen(publicCatalogLabels)).toBe(true);
  });
});
