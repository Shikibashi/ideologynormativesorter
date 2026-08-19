import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import type { CanonicalContentBundle } from "../../v2/packages/contracts/src/content";
import {
  prepareAssessmentResponses,
  scoreConstructLayer,
  scoreModifiers,
  scorePrimaryProfiles,
} from "../../v2/packages/engine/src";
import { canonicalProductionModifierMatches } from "../../src/production";
import type { ProductionResponse } from "../../src/production";

const generatedBundle = JSON.parse(
  readFileSync("v2/generated/content.bundle.json", "utf8"),
) as CanonicalContentBundle;

interface SyntheticItem {
  id: string;
  responseType: "likert7";
  role?: "core";
  layer?: "normative";
  reverseScored?: boolean;
  scoring: {
    mappingMode: "item";
    contributions: { constructId: string; weight: number; polarity: -1 | 1 }[];
  };
}

function syntheticBundle(
  modifiers: CanonicalContentBundle["modifiers"],
  items: SyntheticItem[],
  constructs: Record<string, unknown>[] = [{ id: "c-alpha", role: "normative", name: "Alpha" }],
): CanonicalContentBundle {
  return {
    metadata: {
      contentSchemaVersion: "synthetic-phase6",
      contentVersion: "synthetic-phase6",
      contentFingerprint: "synthetic-phase6-fingerprint",
      scoringVersion: "synthetic-phase6",
      responseSchemaVersion: "synthetic-phase6",
      resultSchemaVersion: "synthetic-phase6-result",
      researchSchemaVersion: "synthetic-phase6-research",
    },
    domains: [],
    constructs,
    items: items.map((item) => ({
      status: "active",
      role: "core",
      layer: "normative",
      tier: "quick",
      reverseScored: false,
      domainId: "d-alpha",
      ...item,
    })),
    profiles: [],
    modifiers,
    specialists: [],
    specialistModules: [],
    specialistCandidates: [],
    specialistAssignment: { strategy: "none", rosterVersion: "synthetic", orderedModuleIds: [] },
    ontologyNodes: [],
    ontologyRelations: [],
    provenanceSources: [],
  } as unknown as CanonicalContentBundle;
}

function modifier(
  overrides: Partial<CanonicalContentBundle["modifiers"][number]> = {},
): CanonicalContentBundle["modifiers"][number] {
  return {
    id: "profile:modifier:alpha",
    name: "Alpha modifier",
    role: "modifier",
    modifierId: "modifier:alpha",
    availability: "core-construct",
    constructName: "Alpha direct construct",
    note: "A synthetic direct construct used for Phase 6 contract tests.",
    indicators: [
      { itemId: "i-one", direction: 1, weight: 1 },
      { itemId: "i-two", direction: -1, weight: 1 },
      { itemId: "i-three", direction: 1, weight: 2 },
    ],
    minimumAnsweredItems: 2,
    minimumEvidenceRatio: 0.4,
    fitThreshold: 0.65,
    gates: [],
    ...overrides,
  };
}

const syntheticItems: SyntheticItem[] = [
  { id: "i-one", responseType: "likert7", scoring: { mappingMode: "item", contributions: [{ constructId: "c-alpha", weight: 1, polarity: 1 }] } },
  { id: "i-two", responseType: "likert7", scoring: { mappingMode: "item", contributions: [{ constructId: "c-alpha", weight: 1, polarity: 1 }] } },
  { id: "i-three", responseType: "likert7", scoring: { mappingMode: "item", contributions: [{ constructId: "c-alpha", weight: 1, polarity: 1 }] } },
  { id: "unrelated", responseType: "likert7", scoring: { mappingMode: "item", contributions: [{ constructId: "c-alpha", weight: 1, polarity: 1 }] } },
];

function assessmentFor(
  bundle: CanonicalContentBundle,
  overrides: Record<string, Record<string, unknown>> = {},
) {
  const responses = bundle.items.map((item) => overrides[item.id] ?? { state: "missing", itemId: item.id });
  return scoreConstructLayer(prepareAssessmentResponses(responses, bundle), bundle);
}

function answered(itemId: string, value: number): Record<string, unknown> {
  return { state: "answered", itemId, responseType: "likert7", value };
}

describe("Phase 6 modifier matching", () => {
  it("scores explicit directed indicators with independent modifier weights", () => {
    const bundle = syntheticBundle([modifier()], syntheticItems);
    const assessment = assessmentFor(bundle, {
      "i-one": answered("i-one", 3),
      "i-two": answered("i-two", -3),
      "i-three": answered("i-three", 3),
    });
    const result = scoreModifiers(assessment, bundle).modifiers[0];
    expect(result).toMatchObject({ status: "active", fit: 1, distance: 0, measurementState: "measured" });
    expect(result.evidence).toMatchObject({ measuredIndicatorCount: 3, totalIndicatorCount: 3, indicatorCoverage: 1, measuredWeight: 4 });
    expect(result.comparisons.every((comparison) => comparison.contributionIds.length > 0)).toBe(true);
  });

  it("keeps a measured but low-fit modifier as below-threshold instead of dropping it", () => {
    const bundle = syntheticBundle([modifier()], syntheticItems);
    const assessment = assessmentFor(bundle, {
      "i-one": answered("i-one", -3),
      "i-two": answered("i-two", 3),
      "i-three": answered("i-three", -3),
    });
    const result = scoreModifiers(assessment, bundle).modifiers[0];
    expect(result.status).toBe("below-threshold");
    expect(result.reason).toBe("fit_below_threshold");
    expect(result.fit).toBe(0);
  });

  it("distinguishes partial evidence from no measured evidence", () => {
    const bundle = syntheticBundle([modifier()], syntheticItems);
    const partial = scoreModifiers(assessmentFor(bundle, {
      "i-one": answered("i-one", 3),
      "i-two": answered("i-two", -3),
    }), bundle).modifiers[0];
    expect(partial.status).toBe("active");
    expect(partial.uncertainty.level).toBe("medium");
    expect(partial.evidence.measuredIndicatorCount).toBe(2);

    const empty = scoreModifiers(assessmentFor(bundle, {
      "i-one": { state: "refused", itemId: "i-one" },
      "i-two": { state: "skipped", itemId: "i-two" },
      "i-three": { state: "abstained", itemId: "i-three" },
    }), bundle).modifiers[0];
    expect(empty.status).toBe("inactive");
    expect(empty.reason).toBe("no_measured_indicators");
    expect(empty.fit).toBeNull();
    expect(empty.comparisons.map((comparison) => comparison.exclusionReason).sort()).toEqual([
      "refused_response",
      "skipped_response",
      "explicit_abstention",
    ].sort());
  });

  it("keeps catalog-only and focused-follow-up records visible as unavailable", () => {
    const bundle = syntheticBundle([
      modifier(),
      modifier({ id: "profile:modifier:catalog", name: "Catalog", modifierId: "modifier:catalog", availability: "catalog-only", indicators: [], minimumAnsweredItems: undefined, minimumEvidenceRatio: undefined, fitThreshold: undefined }),
      modifier({ id: "profile:modifier:follow-up", name: "Follow-up", modifierId: "modifier:follow-up", availability: "focused-follow-up", indicators: [], minimumAnsweredItems: undefined, minimumEvidenceRatio: undefined, fitThreshold: undefined }),
    ], syntheticItems);
    const results = scoreModifiers(assessmentFor(bundle, {
      "i-one": answered("i-one", 3),
      "i-two": answered("i-two", -3),
    }), bundle).modifiers;
    expect(results).toHaveLength(3);
    expect(results.find((entry) => entry.modifierId === "modifier:catalog")).toMatchObject({ status: "unavailable", reason: "catalog_only" });
    expect(results.find((entry) => entry.modifierId === "modifier:follow-up")).toMatchObject({ status: "unavailable", reason: "focused_follow_up" });
  });

  it("uses construct assessment gates without borrowing primary-profile scores", () => {
    const bundle = syntheticBundle([modifier({ gates: [{ id: "gate-alpha", operator: "minimum", constructId: "c-alpha", minimum: 1.1 }] })], syntheticItems);
    const assessment = assessmentFor(bundle, {
      "i-one": answered("i-one", 3),
      "i-two": answered("i-two", -3),
      "i-three": answered("i-three", 3),
    });
    const result = scoreModifiers(assessment, bundle).modifiers[0];
    expect(result.status).toBe("inactive");
    expect(result.reason).toBe("constitutive_gate_failed");
    expect(result.gates[0]).toMatchObject({ status: "failed", reason: "value_below_minimum" });
  });

  it("is invariant to response and modifier source order and deeply freezes output", () => {
    const firstBundle = syntheticBundle([modifier()], syntheticItems);
    const secondBundle = syntheticBundle([modifier()], [...syntheticItems].reverse());
    const overrides = { "i-one": answered("i-one", 3), "i-two": answered("i-two", -3), "i-three": answered("i-three", 3) };
    const firstAssessment = assessmentFor(firstBundle, overrides);
    const secondAssessment = scoreConstructLayer(
      prepareAssessmentResponses(Object.values(overrides).reverse(), secondBundle),
      secondBundle,
    );
    const first = scoreModifiers(firstAssessment, firstBundle);
    const second = scoreModifiers(secondAssessment, secondBundle);
    expect(second).toEqual(first);
    expect(Object.isFrozen(first)).toBe(true);
    expect(Object.isFrozen(first.modifiers[0])).toBe(true);
    expect(Object.isFrozen(first.modifiers[0].comparisons[0])).toBe(true);
  });

  it("does not change primary-profile output and does not double-apply item reversal", () => {
    const bundle = syntheticBundle([modifier()], [
      ...syntheticItems.map((item) => item.id === "i-one" ? { ...item, reverseScored: true } : item),
    ], [{ id: "c-alpha", role: "normative", name: "Alpha" }]);
    const assessment = assessmentFor(bundle, {
      "i-one": answered("i-one", -3),
      "i-two": answered("i-two", -3),
      "i-three": answered("i-three", 3),
    });
    const before = scorePrimaryProfiles(assessment, bundle);
    const modifiers = scoreModifiers(assessment, bundle);
    const after = scorePrimaryProfiles(assessment, bundle);
    expect(modifiers.modifiers[0].comparisons[0].observedValue).toBe(1);
    expect(after).toEqual(before);
  });
});

describe("Phase 6 real-corpus and v1 differential checks", () => {
  it("scores the complete canonical modifier corpus and matches the direct v1 fit oracle where v1 exposes it", () => {
    const responses = generatedBundle.items.map((item) => item.responseType === "statement-choice"
      ? { state: "answered", itemId: item.id, responseType: "statement-choice", optionId: item.options[0].id }
      : { state: "answered", itemId: item.id, responseType: item.responseType, value: item.responseType === "likert7" ? 3 : 2, ...(item.layer === "descriptive" ? { confidence: 5 } : {}), ...(item.layer === "prescriptive" ? { priority: 5 } : {}) });
    const assessment = scoreConstructLayer(prepareAssessmentResponses(responses, generatedBundle), generatedBundle);
    const v2 = scoreModifiers(assessment, generatedBundle);
    const v1Responses: ProductionResponse[] = generatedBundle.modifiers
      .filter((modifierEntry) => modifierEntry.availability === "core-construct")
      .flatMap((modifierEntry) => modifierEntry.indicators.map((indicator) => ({ itemId: indicator.itemId, value: indicator.direction })));
    const v1 = canonicalProductionModifierMatches(v1Responses);
    expect(v2.modifiers).toHaveLength(generatedBundle.modifiers.length);
    expect(v2.modifiers.filter((entry) => entry.status === "active")).toHaveLength(7);
    for (const legacy of v1) {
      const current = v2.modifiers.find((entry) => entry.modifierId === `modifier:${legacy.labelId}`);
      expect(current).toBeDefined();
      expect(current?.fit).toBeCloseTo(legacy.fit);
      expect(current?.evidence.measuredIndicatorCount).toBe(legacy.measuredItemCount);
    }
  });
});
