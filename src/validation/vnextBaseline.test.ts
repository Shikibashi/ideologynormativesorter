import { describe, expect, it } from "vitest";
import { assertVNextBaseline, vnextBaselineManifest } from "./vnextBaseline";

describe("vNext baseline manifest", () => {
  it("matches the frozen v13 effective surface", () => {
    expect(() => assertVNextBaseline()).not.toThrow();
    expect(vnextBaselineManifest.production).toMatchObject({
      activeCoreQuestions: 338,
      historicalCoreRecords: 496,
      effectiveQuestions: 406,
      statementChoiceQuestions: 6,
      roots: 26,
      primaryLabels: 16,
      specialistLabels: 78,
      modifierLabels: 24,
      contextLabels: 19,
      retiredLabels: 8,
    });
    expect(vnextBaselineManifest.specialist).toMatchObject({
      moduleCount: 9,
      moduleQuestionCount: 68,
      mappedLabelCount: 39,
      provisionalLabelCount: 39,
      rosterVersion: "2026-08-specialist-roster-v1",
      assignmentStrategy: "balanced-hash-v2",
    });
  });

  it("fails closed when the supplied commit is not the frozen baseline", () => {
    expect(() =>
      assertVNextBaseline(vnextBaselineManifest, "not-the-baseline"),
    ).toThrow(/not the frozen baseline/);
  });
});
