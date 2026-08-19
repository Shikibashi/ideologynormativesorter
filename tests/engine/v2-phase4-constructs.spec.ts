import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import type { CanonicalContentBundle } from "../../v2/packages/contracts/src/content";
import type { ConstructResult } from "../../v2/packages/contracts/src/constructs";
import {
  ScoringError,
  createEngineContentIndex,
  prepareAssessmentResponses,
  scoreConstructLayer,
  scoreConstructs,
} from "../../v2/packages/engine/src";
import {
  computeAxisScores,
  contributionForQuestionAxis,
} from "../../src/scoring/aggregate";

type ResponseType = "likert5" | "likert7" | "statement-choice";
interface ItemSpec {
  readonly id: string;
  readonly responseType: ResponseType;
  readonly layer: "normative" | "descriptive" | "prescriptive";
  readonly reverseScored?: boolean;
  readonly scoring: {
    readonly mappingMode: "item" | "options";
    readonly contributions?: readonly {
      readonly constructId: string;
      readonly weight: number;
      readonly polarity: -1 | 1;
    }[];
  };
  readonly options?: readonly {
    readonly id: string;
    readonly text: string;
    readonly contributions: readonly {
      readonly constructId: string;
      readonly weight: number;
      readonly polarity: -1 | 1;
    }[];
  }[];
}

function directItem(
  id: string,
  constructId: string,
  weight = 1,
  layer: ItemSpec["layer"] = "normative",
  responseType: ResponseType = "likert5",
  extras: Partial<Pick<ItemSpec, "reverseScored">> = {},
): ItemSpec {
  return {
    id,
    responseType,
    layer,
    ...extras,
    scoring: {
      mappingMode: "item",
      contributions: [{ constructId, weight, polarity: 1 }],
    },
  };
}

function makeBundle(
  items: readonly ItemSpec[],
  constructs: readonly Record<string, unknown>[] = [
    { id: "c-alpha", role: "normative", name: "Alpha" },
  ],
): CanonicalContentBundle {
  return {
    metadata: {
      contentVersion: "v2-phase4-test",
      scoringVersion: "v2-phase4-test",
      responseSchemaVersion: "v2-phase4-test",
      contentFingerprint: "v2-phase4-test-fingerprint",
      resultSchemaVersion: "v2-phase4-test-result",
    },
    constructs,
    items: items.map((item) => ({ status: "active", ...item })),
    domains: [],
    profiles: [],
    modifiers: [],
    specialists: [],
    specialistModules: [],
    ontologyNodes: [],
    ontologyRelations: [],
    provenance: [],
  } as unknown as CanonicalContentBundle;
}

function answered(
  itemId: string,
  responseType: ResponseType,
  value: number,
  extras: Record<string, unknown> = {},
): Record<string, unknown> {
  return {
    state: "answered",
    itemId,
    responseType,
    value,
    ...extras,
  };
}

function responsesFor(
  bundle: CanonicalContentBundle,
  overrides: Record<string, Record<string, unknown>> = {},
): Record<string, unknown>[] {
  const items = (bundle as unknown as { items: readonly ItemSpec[] }).items;
  return items.map((item) => overrides[item.id] ?? {
    state: "missing",
    itemId: item.id,
  });
}

function preparedFor(
  bundle: CanonicalContentBundle,
  overrides: Record<string, Record<string, unknown>> = {},
) {
  return prepareAssessmentResponses(responsesFor(bundle, overrides), bundle);
}

function resultFor(
  assessment: ReturnType<typeof scoreConstructLayer>,
  constructId: string,
): ConstructResult {
  const result = assessment.constructs.find(
    (candidate) => candidate.constructId === constructId,
  );
  if (!result) throw new Error(`Missing construct result ${constructId}`);
  return result;
}

function scored(result: ConstructResult) {
  expect(result.status).toBe("scored");
  if (result.status !== "scored") throw new Error("Expected scored construct");
  return result;
}

function abstained(result: ConstructResult) {
  expect(result.status).toBe("abstained");
  if (result.status !== "abstained") {
    throw new Error("Expected abstained construct");
  }
  return result;
}

function errorCode(callback: () => unknown): string {
  try {
    callback();
  } catch (error) {
    expect(error).toBeInstanceOf(ScoringError);
    return (error as ScoringError).code;
  }
  throw new Error("Expected ScoringError");
}

describe("Phase 4 construct aggregation", () => {
  it("uses the explicit mapping-weight denominator and salience-weighted numerator", () => {
    const bundle = makeBundle([
      directItem("positive", "c-alpha", 2),
      directItem("negative", "c-alpha", 1),
    ]);
    const assessment = scoreConstructLayer(
      preparedFor(bundle, {
        positive: answered("positive", "likert5", 2),
        negative: answered("negative", "likert5", -1),
      }),
      bundle,
    );
    const result = scored(resultFor(assessment, "c-alpha"));
    expect(result.numerator).toBeCloseTo(1.5);
    expect(result.denominator).toBe(3);
    expect(result.score).toBeCloseTo(0.5);
    expect(result.evidence.scoredMappedWeight).toBe(3);
    expect(result.evidence.scoredEffectiveWeight).toBe(3);
  });

  it("keeps missing, skipped, abstained, and refused evidence distinct", () => {
    const bundle = makeBundle([
      directItem("missing", "c-alpha"),
      directItem("skipped", "c-alpha"),
      directItem("abstained", "c-alpha"),
      directItem("refused", "c-alpha"),
    ]);
    const assessment = scoreConstructLayer(
      preparedFor(bundle, {
        skipped: { state: "skipped", itemId: "skipped" },
        abstained: { state: "abstained", itemId: "abstained" },
        refused: { state: "refused", itemId: "refused" },
      }),
      bundle,
    );
    const result = abstained(resultFor(assessment, "c-alpha"));
    expect(result.abstentionReason).toBe("insufficient_evidence");
    expect(result.evidence.expectedItemCount).toBe(4);
    expect(result.evidence.answeredItemCount).toBe(0);
    expect(result.evidence.missingItemCount).toBe(1);
    expect(result.evidence.skippedItemCount).toBe(1);
    expect(result.evidence.abstainedItemCount).toBe(1);
    expect(result.evidence.refusedItemCount).toBe(1);
    expect(result.evidence.totalEligibleWeight).toBe(4);
    expect(result.evidence.missingWeight).toBe(1);
    expect(result.evidence.skippedWeight).toBe(1);
    expect(result.evidence.abstainedWeight).toBe(1);
    expect(result.evidence.refusedWeight).toBe(1);
    expect(result.support.uncertaintyLevel).toBe("high");
    expect(result.support.uncertaintyReasons).toContain("refusal");
  });

  it.each([
    ["missing", "all_responses_missing"],
    ["skipped", "all_responses_skipped"],
    ["abstained", "all_responses_abstained"],
    ["refused", "all_responses_refused"],
  ] as const)("uses the closed abstention reason for all %s evidence", (state, reason) => {
    const bundle = makeBundle([directItem("only", "c-alpha")]);
    const assessment = scoreConstructLayer(
      preparedFor(bundle, {
        only: { state, itemId: "only" },
      }),
      bundle,
    );
    const result = abstained(resultFor(assessment, "c-alpha"));
    expect(result.score).toBeNull();
    expect(result.abstentionReason).toBe(reason);
    expect(Number.isFinite(result.numerator)).toBe(true);
    expect(Number.isFinite(result.denominator)).toBe(true);
  });

  it("treats the minimum evidence ratio as inclusive and abstains below it", () => {
    const exactBundle = makeBundle([
      directItem("answered", "c-alpha"),
      directItem("missing", "c-alpha"),
    ]);
    const exact = scored(
      resultFor(
        scoreConstructLayer(
          preparedFor(exactBundle, {
            answered: answered("answered", "likert5", 2),
          }),
          exactBundle,
        ),
        "c-alpha",
      ),
    );
    expect(exact.evidence.structuralCoverage).toBe(0.5);
    expect(exact.support.evidenceStatus).toBe("sufficient");
    expect(exact.support.nearThreshold).toBe(true);

    const belowBundle = makeBundle([
      directItem("answered", "c-alpha"),
      directItem("missing-a", "c-alpha"),
      directItem("missing-b", "c-alpha"),
    ]);
    const below = abstained(
      resultFor(
        scoreConstructLayer(
          preparedFor(belowBundle, {
            answered: answered("answered", "likert5", 2),
          }),
          belowBundle,
        ),
        "c-alpha",
      ),
    );
    expect(below.abstentionReason).toBe("insufficient_evidence");
    expect(below.support.evidenceRatio).toBeCloseTo(1 / 3);
  });

  it("applies descriptive salience to the numerator without changing the mapping denominator", () => {
    const bundle = makeBundle([
      directItem("confidence", "c-alpha", 2, "descriptive"),
    ], [{ id: "c-alpha", role: "descriptive", name: "Confidence" }]);
    const assessment = scoreConstructLayer(
      preparedFor(bundle, {
        confidence: answered("confidence", "likert5", 2, { confidence: 1 }),
      }),
      bundle,
    );
    const result = scored(resultFor(assessment, "c-alpha"));
    expect(result.numerator).toBeCloseTo(0.4);
    expect(result.denominator).toBe(2);
    expect(result.score).toBeCloseTo(0.2);
    expect(result.evidence.scoredEffectiveWeight).toBeCloseTo(0.4);
    expect(result.evidence.salienceCoverage).toBeCloseTo(0.2);
  });

  it("reverses exactly once and preserves independent multi-construct contributions", () => {
    const reverseBundle = makeBundle([
      directItem("reverse", "c-alpha", 1, "normative", "likert7", {
        reverseScored: true,
      }),
    ]);
    const reversePrepared = preparedFor(reverseBundle, {
      reverse: answered("reverse", "likert7", 3),
    });
    const reverseAssessment = scoreConstructLayer(reversePrepared, reverseBundle);
    const reverseResult = scored(resultFor(reverseAssessment, "c-alpha"));
    expect(reversePrepared.responses[0].normalizedValue).toBe(-1);
    expect(reverseResult.score).toBe(-1);

    const multiBundle = makeBundle([
      {
        id: "multi",
        responseType: "likert5",
        layer: "normative",
        scoring: {
          mappingMode: "item",
          contributions: [
            { constructId: "c-alpha", weight: 2, polarity: 1 },
            { constructId: "c-beta", weight: 3, polarity: -1 },
          ],
        },
      },
    ], [
      { id: "c-alpha", role: "normative", name: "Alpha" },
      { id: "c-beta", role: "normative", name: "Beta" },
    ]);
    const multiAssessment = scoreConstructLayer(
      preparedFor(multiBundle, {
        multi: answered("multi", "likert5", 2),
      }),
      multiBundle,
    );
    expect(scored(resultFor(multiAssessment, "c-alpha")).score).toBe(1);
    expect(scored(resultFor(multiAssessment, "c-beta")).score).toBe(-1);
    expect(multiAssessment.contributions).toHaveLength(2);
  });

  it("uses only the selected statement option and does not inherit another option's mapping", () => {
    const bundle = makeBundle([
      {
        id: "choice",
        responseType: "statement-choice",
        layer: "normative",
        scoring: { mappingMode: "options" },
        options: [
          {
            id: "a",
            text: "A",
            contributions: [{ constructId: "c-alpha", weight: 1, polarity: 1 }],
          },
          {
            id: "b",
            text: "B",
            contributions: [{ constructId: "c-beta", weight: 1, polarity: -1 }],
          },
        ],
      },
    ], [
      { id: "c-alpha", role: "normative", name: "Alpha" },
      { id: "c-beta", role: "normative", name: "Beta" },
    ]);
    const assessment = scoreConstructLayer(
      preparedFor(bundle, {
        choice: {
          state: "answered",
          itemId: "choice",
          responseType: "statement-choice",
          optionId: "b",
        },
      }),
      bundle,
    );
    const alpha = abstained(resultFor(assessment, "c-alpha"));
    expect(alpha.abstentionReason).toBe("no_eligible_items");
    expect(alpha.evidence.expectedItemCount).toBe(0);
    expect(scored(resultFor(assessment, "c-beta")).score).toBe(-1);
  });

  it("balances structural evidence weights across non-answer states", () => {
    const bundle = makeBundle([
      directItem("answered", "c-alpha", 2),
      directItem("missing", "c-alpha", 3),
      directItem("skipped", "c-alpha", 4),
      directItem("abstained", "c-alpha", 5),
      directItem("refused", "c-alpha", 6),
    ]);
    const assessment = scoreConstructLayer(
      preparedFor(bundle, {
        answered: answered("answered", "likert5", 0),
        skipped: { state: "skipped", itemId: "skipped" },
        abstained: { state: "abstained", itemId: "abstained" },
        refused: { state: "refused", itemId: "refused" },
      }),
      bundle,
    );
    const evidence = resultFor(assessment, "c-alpha").evidence;
    expect(evidence.totalEligibleWeight).toBe(20);
    expect(evidence.answeredEligibleWeight).toBe(2);
    expect(
      evidence.answeredEligibleWeight +
        evidence.missingWeight +
        evidence.skippedWeight +
        evidence.abstainedWeight +
        evidence.refusedWeight,
    ).toBe(evidence.totalEligibleWeight);
    expect(evidence.expectedItemCount).toBe(
      evidence.answeredItemCount +
        evidence.missingItemCount +
        evidence.skippedItemCount +
        evidence.abstainedItemCount +
        evidence.refusedItemCount,
    );
  });

  it("keeps statement non-answer eligibility deterministic without counting alternatives twice", () => {
    const bundle = makeBundle([
      {
        id: "choice",
        responseType: "statement-choice",
        layer: "normative",
        scoring: { mappingMode: "options" },
        options: [
          {
            id: "a",
            text: "A",
            contributions: [{ constructId: "c-alpha", weight: 1, polarity: 1 }],
          },
          {
            id: "b",
            text: "B",
            contributions: [{ constructId: "c-alpha", weight: 3, polarity: -1 }],
          },
        ],
      },
    ]);
    const assessment = scoreConstructLayer(
      preparedFor(bundle, {
        choice: { state: "skipped", itemId: "choice" },
      }),
      bundle,
    );
    const result = abstained(resultFor(assessment, "c-alpha"));
    expect(result.evidence.expectedItemCount).toBe(1);
    expect(result.evidence.skippedItemCount).toBe(1);
    expect(result.evidence.skippedWeight).toBe(3);
    expect(result.evidence.totalEligibleWeight).toBe(3);
  });

  it("is invariant to response and contribution ordering and returns an immutable result", () => {
    const bundle = makeBundle([
      directItem("a", "c-alpha", 1),
      directItem("b", "c-alpha", 2),
    ]);
    const inputs = responsesFor(bundle, {
      a: answered("a", "likert5", -1),
      b: answered("b", "likert5", 2),
    });
    const firstPrepared = prepareAssessmentResponses(inputs, bundle);
    const secondPrepared = prepareAssessmentResponses([...inputs].reverse(), bundle);
    const first = scoreConstructLayer(firstPrepared, bundle);
    const second = scoreConstructLayer(secondPrepared, bundle);
    expect(second).toEqual(first);

    const reordered = {
      ...firstPrepared,
      contributions: Object.freeze([...firstPrepared.contributions].reverse()),
    } as typeof firstPrepared;
    expect(scoreConstructs(reordered, createEngineContentIndex(bundle))).toEqual(first);
    expect(Object.isFrozen(first)).toBe(true);
    expect(Object.isFrozen(first.constructs)).toBe(true);
    expect(Object.isFrozen(first.evidence.overall)).toBe(true);
  });

  it("rejects non-finite contribution arithmetic before producing a result", () => {
    const bundle = makeBundle([directItem("a", "c-alpha")]);
    const prepared = preparedFor(bundle, {
      a: answered("a", "likert5", 2),
    });
    const invalid = {
      ...prepared,
      contributions: Object.freeze([
        { ...prepared.contributions[0], weightedContribution: Number.NaN },
      ]),
    } as typeof prepared;
    expect(errorCode(() => scoreConstructLayer(invalid, bundle))).toBe(
      "INVALID_CONTRIBUTION",
    );
  });
});

describe("Phase 4 full canonical corpus", () => {
  const realBundle = JSON.parse(
    readFileSync(
      resolve(process.cwd(), "v2/generated/content.bundle.json"),
      "utf8",
    ),
  ) as CanonicalContentBundle;

  function corpusResponses(
    mode: "answered" | "mixed",
  ): Record<string, unknown>[] {
    const items = (realBundle as unknown as {
      readonly items: readonly Record<string, unknown>[];
    }).items.filter((item) => item.status === "active");
    return items.map((item, index) => {
      const itemId = String(item.id);
      if (mode === "mixed") {
        const state = ["missing", "skipped", "abstained", "refused"][index % 7];
        if (state) return { state, itemId };
      }
      const responseType = item.responseType as ResponseType;
      const layer = item.layer ?? item.role;
      const salience =
        layer === "descriptive"
          ? { confidence: index % 3 === 0 ? 1 : index % 3 === 1 ? 3 : 5 }
          : layer === "prescriptive"
            ? { priority: index % 3 === 0 ? 1 : index % 3 === 1 ? 3 : 5 }
            : {};
      if (responseType === "statement-choice") {
        const options = item.options as readonly Record<string, unknown>[];
        return {
          state: "answered",
          itemId,
          responseType,
          optionId: options[0].id,
          ...salience,
        };
      }
      return {
        state: "answered",
        itemId,
        responseType,
        value: responseType === "likert5" ? (index % 5) - 2 : (index % 7) - 3,
        ...salience,
      };
    });
  }

  it("scores every active canonical item into deterministic construct results", () => {
    const responses = corpusResponses("answered");
    const first = scoreConstructLayer(
      prepareAssessmentResponses(responses, realBundle),
      realBundle,
    );
    const second = scoreConstructLayer(
      prepareAssessmentResponses([...responses].reverse(), realBundle),
      realBundle,
    );
    expect(first).toEqual(second);
    expect(first.constructs).toHaveLength(realBundle.constructs.length);
    const activeItemCount = (realBundle as unknown as {
      readonly items: readonly Record<string, unknown>[];
    }).items.filter((item) => item.status === "active").length;
    expect(first.responseSummary.answeredCount).toBe(activeItemCount);
    expect(first.responseSummary.missingCount).toBe(0);
    for (const result of first.constructs) {
      if (result.status === "scored") {
        expect(Number.isFinite(result.score)).toBe(true);
        expect(result.score).toBeGreaterThanOrEqual(-1);
        expect(result.score).toBeLessThanOrEqual(1);
      } else {
        expect(result.score).toBeNull();
        expect(result.abstentionReason).toBeTruthy();
      }
      expect(Number.isFinite(result.numerator)).toBe(true);
      expect(Number.isFinite(result.denominator)).toBe(true);
    }
  });

  it("preserves evidence balance for every construct under mixed response states", () => {
    const assessment = scoreConstructLayer(
      prepareAssessmentResponses(corpusResponses("mixed"), realBundle),
      realBundle,
    );
    expect(assessment.constructs).toHaveLength(realBundle.constructs.length);
    for (const result of assessment.constructs) {
      const evidence = result.evidence;
      expect(
        evidence.answeredItemCount +
          evidence.missingItemCount +
          evidence.skippedItemCount +
          evidence.abstainedItemCount +
          evidence.refusedItemCount,
      ).toBe(evidence.expectedItemCount);
      expect(
        evidence.answeredEligibleWeight +
          evidence.missingWeight +
          evidence.skippedWeight +
          evidence.abstainedWeight +
          evidence.refusedWeight,
      ).toBeCloseTo(evidence.totalEligibleWeight);
      expect(evidence.structuralCoverage).toBeGreaterThanOrEqual(0);
      expect(evidence.structuralCoverage).toBeLessThanOrEqual(1);
      expect(evidence.scoredWeightCoverage).toBeGreaterThanOrEqual(0);
      expect(evidence.scoredWeightCoverage).toBeLessThanOrEqual(1);
    }
  });

  it("matches v1 answered weighted arithmetic while keeping v2 evidence explicit", () => {
    const bundle = makeBundle([
      directItem("descriptive", "c-alpha", 2, "descriptive"),
    ], [{ id: "c-alpha", role: "descriptive", name: "Alpha" }]);
    const v2 = scoreConstructLayer(
      preparedFor(bundle, {
        descriptive: answered("descriptive", "likert5", 2, { confidence: 1 }),
      }),
      bundle,
    );
    const question = {
      id: "descriptive",
      responseType: "likert5",
      layer: "descriptive",
      reverseScored: false,
      axisWeights: [{ axisId: "c-alpha", weight: 2 }],
    } as Parameters<typeof contributionForQuestionAxis>[0];
    const answer = {
      value: 2,
      confidence: 1,
    } as Parameters<typeof contributionForQuestionAxis>[1];
    const legacyContribution = contributionForQuestionAxis(
      question,
      answer,
      "c-alpha" as Parameters<typeof contributionForQuestionAxis>[2],
    );
    const legacyScore = computeAxisScores(
      [question],
      { descriptive: answer } as Parameters<typeof computeAxisScores>[1],
      [{ id: "c-alpha", layer: "descriptive" }] as Parameters<
        typeof computeAxisScores
      >[2],
    )[0];
    const result = scored(resultFor(v2, "c-alpha"));
    expect(legacyContribution).toBeCloseTo(0.4);
    expect(legacyScore.raw).toBeCloseTo(0.4);
    expect(legacyScore.normalized).toBeCloseTo(0.2);
    expect(result.numerator).toBeCloseTo(legacyScore.raw);
    expect(result.score).toBeCloseTo(legacyScore.normalized);
  });
});

describe("Phase 4 reliability terminology boundary", () => {
  it("keeps construct aggregation free of psychometric reliability claims", () => {
    const source = readFileSync(
      resolve(process.cwd(), "v2/packages/engine/src/constructs/evidence.ts"),
      "utf8",
    ) + readFileSync(
      resolve(process.cwd(), "v2/packages/engine/src/constructs/uncertainty.ts"),
      "utf8",
    );
    expect(source).not.toMatch(/reliabilityForAxis|reliabilityForLabel|\b(alpha|omega|consistency)\b/i);
  });
});
