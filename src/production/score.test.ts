import { describe, expect, it } from "vitest";
import { createCanonicalRegistry } from "../domain/registry";
import {
  CANONICAL_MANIFEST_SCHEMA_VERSION,
  type CanonicalManifest,
} from "../domain/canonicalManifest";
import {
  PRODUCTION_SCORING_VERSION,
  canonicalProductionLabels,
  createProductionScorer,
  scoreProduction,
} from "./index";

const manifest: CanonicalManifest = {
  metadata: {
    schemaVersion: CANONICAL_MANIFEST_SCHEMA_VERSION,
    version: "test-registry-v1",
    fingerprint: null,
  },
  taxonomy: [
    {
      id: "taxonomy/test",
      name: "Test taxonomy",
      conceptualStatus: "canonical",
      measurementStatus: "unmeasured",
      publicRoleStatus: "context",
    },
  ],
  ontology: [],
  constructs: [
    {
      id: "construct/autonomy",
      name: "Autonomy",
      taxonomyId: "taxonomy/test",
      conceptualStatus: "canonical",
      measurementStatus: "validated",
      publicRoleStatus: "primary",
    },
    {
      id: "construct/equality",
      name: "Equality",
      taxonomyId: "taxonomy/test",
      conceptualStatus: "canonical",
      measurementStatus: "validated",
      publicRoleStatus: "primary",
    },
  ],
  facets: [],
  items: [
    {
      id: "item/autonomy",
      prompt: "Autonomy item",
      constructIds: ["construct/autonomy"],
      conceptualStatus: "canonical",
      measurementStatus: "validated",
      publicRoleStatus: "primary",
    },
    {
      id: "item/equality",
      prompt: "Equality item",
      constructIds: ["construct/equality"],
      conceptualStatus: "canonical",
      measurementStatus: "validated",
      publicRoleStatus: "primary",
    },
  ],
  mappings: [],
  contexts: { taxonomy: [], question: [] },
};

const registry = createCanonicalRegistry(manifest);

const gatedRegistry = createCanonicalRegistry({
  ...manifest,
  nodes: [
    {
      id: "node/gated",
      canonicalName: "Gated profile",
      conceptualKind: "broad-tradition",
      canonicalDefinition: "A profile requiring constitutive evidence.",
      conceptualStatus: "canonical",
      measurementStatus: "compatibility-scored-unvalidated",
      publicRoleStatus: "primary",
      version: "test-registry-v1",
    },
  ],
  productionProfiles: [
    {
      id: "profile/gated",
      nodeId: "node/gated",
      labelId: "label/gated",
      version: "test-profile-v1",
      rootConstructIds: ["construct/autonomy"],
      centroid: { "construct/autonomy": 1 },
      requiredRootConstructIds: ["construct/autonomy"],
      minimumItemCounts: { "construct/autonomy": 1 },
      status: "compatibility-scored-unvalidated",
    },
  ],
});
const labels = [
  {
    id: "label/balanced",
    name: "Balanced",
    centroid: {
      "construct/autonomy": 1,
      "construct/equality": 1,
    },
    interpretation: "A configured profile-similarity endpoint.",
  },
  {
    id: "label/opposed",
    name: "Opposed",
    centroid: {
      "construct/autonomy": -1,
      "construct/equality": -1,
    },
  },
] as const;

describe("production scoring boundary", () => {
  it("returns byte-for-byte stable values and labels for repeated input", () => {
    const request = {
      responses: [
        { itemId: "item/equality", value: 1 },
        { itemId: "item/autonomy", value: 1 },
      ],
      labels,
    } as const;
    const first = scoreProduction(request, { registry });
    const second = scoreProduction(request, { registry });

    expect(second).toEqual(first);
    expect(first.decision).toBe("scored");
    expect(first.profile.scoringVersion).toBe(PRODUCTION_SCORING_VERSION);
    expect(first.interpretation.scoringVersion).toBe(
      PRODUCTION_SCORING_VERSION,
    );
    expect(first.profile.scores).toEqual([
      expect.objectContaining({ dimensionId: "construct/autonomy", value: 1 }),
      expect.objectContaining({ dimensionId: "construct/equality", value: 1 }),
    ]);
    expect(first.labels.map((label) => label.labelId)).toEqual([
      "label/balanced",
      "label/opposed",
    ]);
    expect(first.interpretation.labelSource).toBe("configuration");
  });

  it("abstains with high uncertainty when evidence is missing or refused", () => {
    const result = scoreProduction(
      {
        responses: [
          { itemId: "item/autonomy", status: "refused" },
          { itemId: "item/equality", status: "missing" },
        ],
        labels,
      },
      { registry },
    );

    expect(result.decision).toBe("abstain");
    expect(result.labels).toEqual([]);
    expect(result.evidenceCoverage).toMatchObject({
      answeredItems: 0,
      expectedItems: 2,
      coverage: 0,
      status: "none",
    });
    expect(result.uncertainty.band).toBe("high");
    expect(result.abstentions.map((entry) => entry.code)).toEqual(
      expect.arrayContaining([
        "refused-response",
        "missing-response",
        "insufficient-evidence",
      ]),
    );
  });

  it("keeps an explicit adapter isolated from the production contract", () => {
    const scorer = createProductionScorer({
      registry,
      minimumEvidenceCoverage: 0,
      adapter: {
        id: "test-adapter",
        score: ({ dimensions }) => ({
          values: Object.fromEntries(
            dimensions.map((dimension) => [dimension.id, 0.25]),
          ),
        }),
      },
    });
    const result = scorer({
      responses: [{ itemId: "item/autonomy", value: 1 }],
    });

    expect(result.decision).toBe("scored");
    expect(result.profile.scores.map((score) => score.value)).toEqual([
      0.25,
      null,
    ]);
    expect(result.interpretation.mode).toBe("profile-similarity");
  });
  it("rejects malformed custom registries before scoring", () => {
    const malformedRegistry = {
      manifest: {
        ...manifest,
        metadata: null,
      },
    };
    expect(() =>
      scoreProduction(
        { responses: [] },
        { registry: malformedRegistry as never },
      ),
    ).toThrow(/Invalid canonical production registry/);
  });

  it("abstains rather than throwing on malformed response status and labels", () => {
    expect(() =>
      scoreProduction(
        {
          responses: [{ itemId: "item/autonomy", status: { invalid: true } }],
          labels: [{ id: "label/bad", name: {}, centroid: null }],
        } as never,
        { registry },
      ),
    ).not.toThrow();
    const result = scoreProduction(
      {
        responses: [{ itemId: "item/autonomy", status: { invalid: true } }],
        labels: [{ id: "label/bad", name: {}, centroid: null }],
      } as never,
      { registry },
    );
    expect(result.decision).toBe("abstain");
  });
  it("requires constitutive evidence before exposing an unvalidated profile", () => {
    const labelsWithoutGates = canonicalProductionLabels(gatedRegistry).map(
      (label) => ({
        ...label,
        requiredRootConstructIds: [],
        minimumItemCounts: {},
      }),
    );
    const result = scoreProduction(
      {
        responses: [
          { itemId: "item/autonomy", value: 1 },
          { itemId: "item/equality", value: 1 },
        ],
        labels: labelsWithoutGates,
      },
      { registry: gatedRegistry },
    );

    expect(result.decision).toBe("abstain");
    expect(result.labels).toEqual([]);
  });

  it("matches a gated profile on constitutive evidence despite unrelated sparse coverage", () => {
    const labels = canonicalProductionLabels(gatedRegistry);
    const result = scoreProduction(
      {
        responses: [{ itemId: "item/autonomy", value: 1 }],
        labels,
      },
      { registry: gatedRegistry, minimumEvidenceCoverage: 1 },
    );

    expect(result.decision).toBe("scored");
    expect(result.labels.map((label) => label.labelId)).toEqual([
      "label/gated",
    ]);
    expect(result.labels[0]?.evidenceCoverage).toMatchObject({
      answeredItems: 1,
      expectedItems: 1,
      status: "sufficient",
    });
    expect(result.evidenceCoverage.status).toBe("partial");
  });

  it("withholds a gated profile when its required construct is unanswered", () => {
    const result = scoreProduction(
      {
        responses: [{ itemId: "item/equality", value: 1 }],
        labels: canonicalProductionLabels(gatedRegistry),
      },
      { registry: gatedRegistry },
    );

    expect(result.decision).toBe("abstain");
    expect(result.labels).toEqual([]);
  });
  it("enforces the declared minimum item count for a required construct", () => {
    const labelsWithHigherMinimum = canonicalProductionLabels(
      gatedRegistry,
    ).map((label) => ({
      ...label,
      minimumItemCounts: { "construct/autonomy": 2 },
    }));
    const result = scoreProduction(
      {
        responses: [{ itemId: "item/autonomy", value: 1 }],
        labels: labelsWithHigherMinimum,
      },
      { registry: gatedRegistry },
    );

    expect(result.decision).toBe("abstain");
    expect(result.labels).toEqual([]);
  });
  it("does not throw on malformed profile gate metadata", () => {
    expect(() =>
      scoreProduction(
        {
          responses: [{ itemId: "item/autonomy", value: 1 }],
          labels: [
            {
              id: "label/malformed-gate",
              name: "Malformed gate",
              centroid: { "construct/autonomy": 1 },
              profileStatus: "compatibility-scored-unvalidated",
              rootConstructIds: null,
              requiredRootConstructIds: null,
              minimumItemCounts: null,
            },
          ],
        } as never,
        { registry },
      ),
    ).not.toThrow();
  });
});
