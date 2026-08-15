// Decision IDs: D-00, D-10, D-11, D-12, D-29.
import { describe, expect, it } from "vitest";
import { axes } from "../data/axes";
import { primaryScoringLabels, TAXONOMY_VERSION } from "../data/labelTaxonomy";
import { questions } from "../data/effectiveQuestions";
import { allCalibrationFixtures } from "../scoring/calibration.fixtures";
import { buildResultProfile, RESULT_SCORING_VERSION } from "../scoring";
import {
  comparisonStabilityLabel,
  coverageLabel,
  labelProximityLabel,
} from "../resultLanguage";

describe("production baseline contract", () => {
  it("preserves a representative score, label neighborhood, and gate state", () => {
    const fixture = allCalibrationFixtures.find(
      (candidate) => candidate.expectedLabelIds[0] === "conservative",
    );
    expect(fixture).toBeDefined();

    const result = buildResultProfile(
      questions,
      fixture!.answers,
      axes,
      primaryScoringLabels,
    );

    expect(result.bankVersion).toBeTypeOf("string");
    expect(result.scoringVersion).toBe(RESULT_SCORING_VERSION);
    expect(result.nearestLabels.length).toBeGreaterThan(0);
    expect(
      result.nearestLabels.slice(0, 5).map((match) => match.labelId),
    ).toEqual([
      "conservative",
      "christian-democrat",
      "liberal-conservatism",
      "social-liberalism",
      "national-conservatism",
    ]);
    expect(
      result.nearestLabels.find((match) => match.labelId === "conservative")
        ?.coreGateStatus,
    ).toBe("passed");
    expect(TAXONOMY_VERSION).toBe("2026-08-taxonomy-v13");
  });

  it("keeps participant-facing comparison language qualitative", () => {
    expect(labelProximityLabel(0.9)).toBe("Very close axis profile");
    expect(coverageLabel("insufficient")).toBe("too little answer coverage");
    expect(comparisonStabilityLabel("high")).toBe("very tentative comparison");
  });
});
