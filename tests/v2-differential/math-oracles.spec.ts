import { describe, expect, it } from "vitest";
import { assertNearlyEqual } from "./reference-types";
import { evidenceRatio, normalizeLikert, profileDistance, salience, weightedConstruct } from "./spec-oracles";

describe("Phase 10 hand-calculated mathematical oracles", () => {
  it("normalizes and reverses Likert exactly once", () => {
    expect(normalizeLikert(-2, 2)).toBe(-1);
    expect(normalizeLikert(3, 3, true)).toBe(-1);
    expect(normalizeLikert(0, 3, true)).toBe(0);
  });

  it("applies explicit salience rules", () => {
    expect(salience("normative", undefined)).toBe(1);
    expect(salience("descriptive", 1)).toBe(0.2);
    expect(salience("prescriptive", 5)).toBe(1);
    expect(salience("descriptive", 5, true)).toBe(0);
  });

  it("uses weighted signed arithmetic and null for zero evidence", () => {
    expect(weightedConstruct([{ value: 1, weight: 2, polarity: 1 }, { value: -1, weight: 1, polarity: 1 }])).toBe(1 / 3);
    expect(weightedConstruct([{ value: 1, weight: 2, polarity: -1 }])).toBe(-1);
    expect(weightedConstruct([])).toBeNull();
  });

  it("uses normalized RMS profile distance and bounded similarity", () => {
    const result = profileDistance([1, 0], [0, 0]);
    assertNearlyEqual(result.distance, Math.sqrt(0.5), "distance");
    assertNearlyEqual(result.similarity, 1 - Math.sqrt(0.5) / 2, "similarity");
  });

  it("uses explicit evidence ratios", () => {
    expect(evidenceRatio(0, 3)).toBe(0);
    expect(evidenceRatio(1, 2)).toBe(0.5);
    expect(evidenceRatio(4, 2)).toBe(1);
  });
});
