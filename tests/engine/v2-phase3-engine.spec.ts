import { readFileSync, readdirSync } from "node:fs";
import { join, resolve } from "node:path";
import { describe, expect, it } from "vitest";
import type { CanonicalContentBundle } from "../../v2/packages/contracts/src/content";
import type { RawResponseEnvelope } from "../../v2/packages/contracts/src/responses";
import {
  ScoringError,
  prepareAssessmentResponses,
} from "../../v2/packages/engine/src";
import { normalizeAnswer } from "../../src/scoring/normalize";

type ResponseType = "likert5" | "likert7" | "statement-choice";
type Layer = "normative" | "descriptive" | "prescriptive";

interface SyntheticItem {
  readonly id: string;
  readonly status: "active";
  readonly responseType: ResponseType;
  readonly layer: Layer;
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

const syntheticBundle = {
  metadata: {
    contentVersion: "v2-synthetic",
    scoringVersion: "v2-synthetic",
    responseSchemaVersion: "v2-synthetic",
    contentFingerprint: "synthetic-fingerprint",
  },
  constructs: [
    { id: "c-alpha", role: "normative", name: "Alpha" },
    { id: "c-beta", role: "descriptive", name: "Beta" },
  ],
  items: [
    {
      id: "i-l5",
      status: "active",
      responseType: "likert5",
      layer: "normative",
      scoring: {
        mappingMode: "item",
        contributions: [{ constructId: "c-alpha", weight: 2, polarity: 1 }],
      },
    },
    {
      id: "i-l7",
      status: "active",
      responseType: "likert7",
      layer: "normative",
      scoring: {
        mappingMode: "item",
        contributions: [{ constructId: "c-beta", weight: 1, polarity: -1 }],
      },
    },
    {
      id: "i-reverse",
      status: "active",
      responseType: "likert7",
      layer: "normative",
      reverseScored: true,
      scoring: {
        mappingMode: "item",
        contributions: [{ constructId: "c-alpha", weight: 1, polarity: 1 }],
      },
    },
    {
      id: "i-descriptive",
      status: "active",
      responseType: "likert5",
      layer: "descriptive",
      scoring: {
        mappingMode: "item",
        contributions: [{ constructId: "c-alpha", weight: 1, polarity: 1 }],
      },
    },
    {
      id: "i-prescriptive",
      status: "active",
      responseType: "likert5",
      layer: "prescriptive",
      scoring: {
        mappingMode: "item",
        contributions: [{ constructId: "c-beta", weight: 1, polarity: 1 }],
      },
    },
    {
      id: "i-multi",
      status: "active",
      responseType: "likert5",
      layer: "normative",
      scoring: {
        mappingMode: "item",
        contributions: [
          { constructId: "c-alpha", weight: 1, polarity: 1 },
          { constructId: "c-beta", weight: 0.5, polarity: -1 },
        ],
      },
    },
    {
      id: "i-statement",
      status: "active",
      responseType: "statement-choice",
      layer: "normative",
      scoring: { mappingMode: "options" },
      options: [
        {
          id: "option-a",
          text: "A",
          contributions: [{ constructId: "c-alpha", weight: 1, polarity: 1 }],
        },
        {
          id: "option-b",
          text: "B",
          contributions: [{ constructId: "c-beta", weight: 1, polarity: -1 }],
        },
      ],
    },
  ] satisfies readonly SyntheticItem[],
} as unknown as CanonicalContentBundle;

function errorCode(callback: () => unknown): string {
  try {
    callback();
  } catch (error) {
    expect(error).toBeInstanceOf(ScoringError);
    return (error as ScoringError).code;
  }
  throw new Error("Expected ScoringError");
}

function response(
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

function envelope(
  responses: readonly unknown[],
  overrides: Partial<RawResponseEnvelope> = {},
): RawResponseEnvelope {
  return {
    responseSchemaVersion: syntheticBundle.metadata.responseSchemaVersion,
    contentFingerprint: syntheticBundle.metadata.contentFingerprint,
    responses,
    ...overrides,
  } as unknown as RawResponseEnvelope;
}

describe("Phase 3 response normalization and contribution generation", () => {
  it("normalizes Likert 5 and Likert 7 raw scales exactly once", () => {
    const prepared = prepareAssessmentResponses(
      [
        response("i-l5", "likert5", -2),
        response("i-l7", "likert7", 3),
        response("i-reverse", "likert7", 3),
      ],
      syntheticBundle,
    );
    const byId = new Map(prepared.responses.map((item) => [item.itemId, item]));
    expect(byId.get("i-l5")).toMatchObject({
      rawValue: -2,
      normalizedValue: -1,
      reverseScored: false,
    });
    expect(byId.get("i-l7")).toMatchObject({
      rawValue: 3,
      normalizedValue: 1,
      reverseScored: false,
    });
    expect(byId.get("i-reverse")).toMatchObject({
      rawValue: 3,
      normalizedValue: -1,
      reverseScored: true,
    });
  });

  it("emits independent records for each explicit multi-construct mapping", () => {
    const prepared = prepareAssessmentResponses(
      [response("i-multi", "likert5", 2)],
      syntheticBundle,
    );
    const records = prepared.contributions.filter(
      (record) => record.sourceItemId === "i-multi",
    );
    expect(records).toHaveLength(2);
    expect(records.map((record) => record.targetConstructId)).toEqual([
      "c-alpha",
      "c-beta",
    ]);
    expect(records.map((record) => record.weightedContribution)).toEqual([1, -0.5]);
  });

  it("uses only the selected statement-choice option mapping", () => {
    const prepared = prepareAssessmentResponses(
      [
        {
          state: "answered",
          itemId: "i-statement",
          responseType: "statement-choice",
          optionId: "option-b",
        },
      ],
      syntheticBundle,
    );
    const records = prepared.contributions.filter(
      (record) => record.sourceItemId === "i-statement",
    );
    expect(records).toHaveLength(1);
    expect(records[0]).toMatchObject({
      sourceItemId: "i-statement",
      optionId: "option-b",
      normalizedInput: 1,
      direction: -1,
      included: true,
      weightedContribution: -1,
    });
  });

  it("preserves all response states and creates explicit exclusions", () => {
    const prepared = prepareAssessmentResponses(
      [
        { state: "skipped", itemId: "i-l5" },
        { state: "abstained", itemId: "i-l7" },
        { state: "refused", itemId: "i-reverse" },
      ],
      syntheticBundle,
    );
    expect(prepared.responseSummary).toEqual({
      answeredCount: 0,
      missingCount: 4,
      skippedCount: 1,
      abstainedCount: 1,
      refusedCount: 1,
    });
    expect(prepared.contributions.filter((item) => item.sourceItemId === "i-l5")[0])
      .toMatchObject({
        sourceResponseState: "skipped",
        normalizedInput: null,
        included: false,
        exclusionReason: "skipped_response",
        weightedContribution: 0,
      });
    expect(prepared.contributions.filter((item) => item.sourceItemId === "i-l7")[0])
      .toMatchObject({ exclusionReason: "explicit_abstention" });
    expect(prepared.contributions.filter((item) => item.sourceItemId === "i-reverse")[0])
      .toMatchObject({ exclusionReason: "refused_response" });
    expect(
      prepared.contributions.some((item) => item.sourceItemId === "i-statement"),
    ).toBe(false);
  });

  it("maps descriptive confidence and prescriptive priority without changing normative salience", () => {
    const prepared = prepareAssessmentResponses(
      [
        response("i-descriptive", "likert5", 2, { confidence: 1 }),
        response("i-prescriptive", "likert5", 2, { priority: 5 }),
        response("i-l5", "likert5", 2, { confidence: 1, priority: 1 }),
      ],
      syntheticBundle,
    );
    expect(prepared.contributions).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          sourceItemId: "i-descriptive",
          salienceKind: "confidence",
          salienceFactor: 0.2,
          effectiveWeight: 0.2,
          weightedContribution: 0.2,
        }),
        expect.objectContaining({
          sourceItemId: "i-prescriptive",
          salienceKind: "priority",
          salienceFactor: 1,
          effectiveWeight: 1,
          weightedContribution: 1,
        }),
        expect.objectContaining({
          sourceItemId: "i-l5",
          salienceKind: "neutral",
          salienceFactor: 1,
          weightedContribution: 2,
        }),
      ]),
    );
  });

  it("excludes nonnormative answered items when their salience rating is absent", () => {
    const prepared = prepareAssessmentResponses(
      [response("i-descriptive", "likert5", 2)],
      syntheticBundle,
    );
    expect(prepared.contributions[0]).toMatchObject({
      salienceKind: "confidence",
      salienceFactor: 0,
      included: false,
      exclusionReason: "salience_skipped",
      weightedContribution: 0,
    });
  });

  it("is invariant to response order and does not mutate the input", () => {
    const input = [
      response("i-multi", "likert5", 2),
      response("i-l5", "likert5", -2),
    ];
    const original = structuredClone(input);
    const first = prepareAssessmentResponses(input, syntheticBundle);
    const second = prepareAssessmentResponses([...input].reverse(), syntheticBundle);
    expect(input).toEqual(original);
    expect(second).toEqual(first);
    expect(Object.isFrozen(first)).toBe(true);
    expect(Object.isFrozen(first.responses)).toBe(true);
    expect(Object.isFrozen(first.responses[0])).toBe(true);
    expect(Object.isFrozen(first.contributions)).toBe(true);
    expect(Object.isFrozen(first.contributions[0])).toBe(true);
  });

  it("rejects malformed, out-of-range, duplicated, and version-incompatible responses", () => {
    expect(errorCode(() => prepareAssessmentResponses(
      [response("unknown", "likert5", 0)],
      syntheticBundle,
    ))).toBe("UNKNOWN_ITEM");
    expect(errorCode(() => prepareAssessmentResponses(
      [response("i-l5", "likert5", 3)],
      syntheticBundle,
    ))).toBe("INVALID_LIKERT_VALUE");
    expect(errorCode(() => prepareAssessmentResponses(
      [response("i-l5", "likert5", Number.NaN)],
      syntheticBundle,
    ))).toBe("NONFINITE_VALUE");
    expect(errorCode(() => prepareAssessmentResponses(
      [response("i-l5", "likert7", 0)],
      syntheticBundle,
    ))).toBe("INVALID_RESPONSE_TYPE");
    expect(errorCode(() => prepareAssessmentResponses(
      [{
        state: "answered",
        itemId: "i-statement",
        responseType: "statement-choice",
        optionId: "not-an-option",
      }],
      syntheticBundle,
    ))).toBe("UNKNOWN_STATEMENT_OPTION");
    expect(errorCode(() => prepareAssessmentResponses(
      [
        response("i-l5", "likert5", 0),
        response("i-l5", "likert5", 1),
      ],
      syntheticBundle,
    ))).toBe("DUPLICATE_RESPONSE");
    expect(errorCode(() => prepareAssessmentResponses(
      envelope([response("i-l5", "likert5", 0)], {
        responseSchemaVersion: "wrong-version",
      }),
      syntheticBundle,
    ))).toBe("RESPONSE_SCHEMA_VERSION_MISMATCH");
    expect(errorCode(() => prepareAssessmentResponses(
      envelope([response("i-l5", "likert5", 0)], {
        contentFingerprint: "wrong-fingerprint",
      }),
      syntheticBundle,
    ))).toBe("CONTENT_FINGERPRINT_MISMATCH");
  });

  it("keeps the engine boundary free of v1 runtime, UI, and aggregation imports", () => {
    const sourceRoot = resolve(process.cwd(), "v2/packages/engine/src");
    const sourceFiles = readdirSync(sourceRoot, { recursive: true })
      .filter((file): file is string => file.endsWith(".ts"))
      .map((file) => join(sourceRoot, file));
    const source = sourceFiles
      .map((file) => readFileSync(file, "utf8"))
      .join("\n");
    expect(source).not.toMatch(/src\/(scoring|domain|data|types)\//);
    expect(source).not.toMatch(/(react|localStorage|window\.|document\.)/i);
    expect(source).not.toMatch(/(profileSimilarity|modifierMatching|specialistScoring)/i);
  });
});

describe("Phase 3 real canonical smoke", () => {
  const realBundle = JSON.parse(
    readFileSync(
      resolve(process.cwd(), "v2/generated/content.bundle.json"),
      "utf8",
    ),
  ) as CanonicalContentBundle;

  it("prepares every active v2 item using only its declared response semantics", () => {
    const records = (realBundle as unknown as {
      readonly items: readonly Record<string, unknown>[];
    }).items;
    const activeItems = records.filter((item) => item.status === "active");
    const responses = activeItems.map((item, index) => {
      const itemId = item.id;
      const responseType = item.responseType as ResponseType;
      const layer = item.layer ?? item.role;
      const salience =
        layer === "descriptive"
          ? { confidence: (index % 3 === 0 ? 1 : index % 3 === 1 ? 3 : 5) }
          : layer === "prescriptive"
            ? { priority: (index % 3 === 0 ? 1 : index % 3 === 1 ? 3 : 5) }
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

    const first = prepareAssessmentResponses(responses, realBundle);
    const second = prepareAssessmentResponses([...responses].reverse(), realBundle);
    expect(first.responseSummary.answeredCount).toBe(activeItems.length);
    expect(first.responseSummary.missingCount).toBe(0);
    expect(first.responses).toHaveLength(activeItems.length);
    expect(first.contributions.length).toBeGreaterThan(0);
    expect(first).toEqual(second);
    for (const record of first.contributions) {
      expect(Number.isFinite(record.weight)).toBe(true);
      expect(Number.isFinite(record.weightedContribution)).toBe(true);
      expect(record.included).toBe(true);
    }
  });
});

describe("Phase 3 v1 differential oracle", () => {
  it("matches v1 for legal Likert normalization while intentionally rejecting v1 clamping", () => {
    const legacyQuestion = {
      responseType: "likert5",
      reverseScored: false,
      reverse: false,
    } as Parameters<typeof normalizeAnswer>[0];
    const legacyAnswer = { value: 2 } as Parameters<typeof normalizeAnswer>[1];
    const legacyNormalized = normalizeAnswer(legacyQuestion, legacyAnswer);
    const v2Prepared = prepareAssessmentResponses(
      [response("i-l5", "likert5", 2)],
      syntheticBundle,
    );
    const v2Normalized = v2Prepared.responses.find(
      (item) => item.itemId === "i-l5",
    );
    expect(legacyNormalized).toBe(v2Normalized?.normalizedValue);
    expect(normalizeAnswer(
      legacyQuestion,
      { value: 99 } as Parameters<typeof normalizeAnswer>[1],
    )).toBe(1);
    expect(errorCode(() => prepareAssessmentResponses(
      [response("i-l5", "likert5", 99)],
      syntheticBundle,
    ))).toBe("INVALID_LIKERT_VALUE");
  });
});
