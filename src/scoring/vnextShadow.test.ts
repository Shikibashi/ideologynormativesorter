import { describe, expect, it } from "vitest";
import { computeVNextShadowScores } from "./vnextShadow";
import { vnextItemAnnotations } from "../data/vnextItemAnnotations";
import type { AnswerMap, Question } from "../types";

function question(overrides: Partial<Question> = {}): Question {
  return {
    id: "q0001",
    prompt: "test",
    domain: "state-legitimacy",
    layer: "normative",
    theoryContext: "ideal",
    responseType: "likert7",
    tier: "extensive",
    axisWeights: [{ axisId: "authority-legitimacy", weight: 1 }],
    ...overrides,
  };
}

describe("vNext shadow scorer", () => {
  it("preserves missingness instead of converting an unmeasured root/facet to zero", () => {
    const result = computeVNextShadowScores([question()], {});
    const root = result.rootScores.find(
      (score) => score.id === "authority-legitimacy",
    );
    const facet = result.facetScores.find(
      (score) => score.id === "authority.accountability",
    );
    expect(root).toMatchObject({ measured: false, answeredItemCount: 0 });
    expect(facet).toMatchObject({ measured: false, answeredItemCount: 0 });
    expect(root?.score).toBeUndefined();
    expect(facet?.score).toBeUndefined();
    expect(root?.missingness.omitted).toBe(1);
  });

  it("keeps layer masks and reverse-scored signs explicit", () => {
    const q = question({
      id: "q0001",
      reverseScored: true,
      layer: "normative",
      axisWeights: [{ axisId: "authority-legitimacy", weight: 1 }],
    });
    const answers: AnswerMap = { q0001: { questionId: "q0001", value: 3 } };
    const result = computeVNextShadowScores([q], answers);
    expect(
      result.rootScores.find((score) => score.id === "authority-legitimacy"),
    ).toMatchObject({
      measured: true,
      score: -1,
    });
    expect(result.measuredLayerMask).toEqual({
      normative: true,
      descriptive: false,
      prescriptive: false,
    });
  });

  it("uses statement-choice option weights without touching production ResultProfile", () => {
    const q = question({
      id: "sq01",
      responseType: "statementChoice",
      axisWeights: [],
      statementOptions: [
        {
          id: "a",
          text: "a",
          axisWeights: [{ axisId: "authority-legitimacy", weight: 1 }],
        },
        {
          id: "b",
          text: "b",
          axisWeights: [{ axisId: "authority-legitimacy", weight: -1 }],
        },
        {
          id: "c",
          text: "c",
          axisWeights: [{ axisId: "authority-legitimacy", weight: 0 }],
        },
        {
          id: "d",
          text: "d",
          axisWeights: [{ axisId: "authority-legitimacy", weight: 1 }],
        },
      ],
    });
    const result = computeVNextShadowScores([q], {
      sq01: { questionId: "sq01", value: 1 },
    });
    expect(
      result.rootScores.find((score) => score.id === "authority-legitimacy"),
    ).toMatchObject({
      measured: true,
      score: -1,
      answeredItemCount: 1,
    });
  });

  it("fails closed for answered items without an approved facet estimator", () => {
    const annotation = vnextItemAnnotations.find((item) =>
      item.facetIds.includes("authority.accountability"),
    );
    expect(annotation).toBeDefined();
    const q = question({
      id: annotation!.itemId,
      axisWeights: [{ axisId: annotation!.intendedRootIds[0]!, weight: 1 }],
    });
    const result = computeVNextShadowScores([q], {
      [q.id]: { questionId: q.id, value: 6 },
    });
    expect(
      result.facetScores.find(
        (score) => score.id === "authority.accountability",
      ),
    ).toMatchObject({
      measured: false,
      evidenceStatus: "abstained",
      answeredItemCount: 0,
      eligibleItemCount: 1,
      claimCeiling: "PC0",
      abstentionRationale: expect.stringContaining(
        "root weights cannot be reused",
      ),
    });
    expect(result.surfaceManifestId).toBe(
      "vnext-analysis-surface:core:2026-08-v1",
    );
    expect(result.versionTuple.vnextSurfaceManifestVersion).toBe(
      "2026-08-vnext-surface-manifests-v1",
    );
  });
});
