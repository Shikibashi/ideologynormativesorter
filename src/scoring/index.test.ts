import { describe, expect, it } from "vitest";
import type { AnswerMap, Question } from "../types";
import { createCanonicalRegistry } from "../domain/registry";
import {
  CANONICAL_MANIFEST_SCHEMA_VERSION,
  type CanonicalManifest,
} from "../domain/canonicalManifest";
import { buildResultProfile } from "./index";

const questions: Question[] = [
  {
    id: "legacy-question",
    prompt: "A legacy scoring item",
    domain: "test",
    layer: "normative",
    theoryContext: "ideal",
    responseType: "likert5",
    tier: "quick",
    axisWeights: [],
  },
];

const answers: AnswerMap = {
  "legacy-question": {
    questionId: "legacy-question",
    value: 1,
  },
};
const canonicalManifest: CanonicalManifest = {
  metadata: {
    schemaVersion: CANONICAL_MANIFEST_SCHEMA_VERSION,
    version: "test-canonical-production-v1",
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
      id: "construct/test",
      name: "Test construct",
      taxonomyId: "taxonomy/test",
      conceptualStatus: "canonical",
      measurementStatus: "validated",
      publicRoleStatus: "primary",
    },
  ],
  facets: [],
  items: [
    {
      id: "item/test",
      prompt: "Test item",
      constructIds: ["construct/test"],
      conceptualStatus: "canonical",
      measurementStatus: "validated",
      publicRoleStatus: "primary",
    },
  ],
  mappings: [],
  contexts: { taxonomy: [], question: [] },
};
const canonicalRegistry = createCanonicalRegistry(canonicalManifest);

describe("buildResultProfile production metadata", () => {
  it("abstains through the canonical scorer when evidence is absent", () => {
    const first = buildResultProfile(questions, answers, [], []);
    const second = buildResultProfile(questions, answers, [], []);

    expect(first).toEqual(second);
    expect(first.production).toMatchObject({
      contractVersion: "production-result-v1",
      decision: "abstain",
      abstentions: [
        { code: "no-responses", itemIds: [] },
        { code: "insufficient-evidence", itemIds: [] },
      ],
      interpretation: {
        mode: "profile-similarity",
        labelSource: "configuration",
        transform: "weighted-mean-v1",
        adapterId: "weighted-mean-v1",
      },
    });
    expect(first.scores).toEqual({
      normative: [],
      descriptive: [],
      prescriptive: [],
    });
    expect(first.nearestLabels).toEqual([]);
  });
  it("scores explicit canonical responses deterministically", () => {
    const productionInput = {
      registry: canonicalRegistry,
      responses: [{ itemId: "item/test", value: 1 }],
      labels: [
        {
          id: "label/test",
          name: "Test endpoint",
          centroid: { "construct/test": 1 },
        },
      ],
    } as const;
    const first = buildResultProfile(
      questions,
      answers,
      [],
      [],
      [],
      productionInput,
    );
    const second = buildResultProfile(
      questions,
      answers,
      [],
      [],
      [],
      productionInput,
    );

    expect(second.production).toEqual(first.production);
    expect(first.production).toMatchObject({
      decision: "scored",
      evidenceCoverage: {
        answeredItems: 1,
        expectedItems: 1,
        coverage: 1,
        status: "sufficient",
      },
      profile: {
        scores: [
          expect.objectContaining({
            dimensionId: "construct/test",
            value: 1,
          }),
        ],
      },
      labels: [
        expect.objectContaining({
          labelId: "label/test",
          rank: 1,
        }),
      ],
    });
    expect(first.nearestLabels).toMatchObject([
      {
        labelId: "label/test",
        name: "Test endpoint",
        fit: 1,
        distance: 0,
        evidenceStrength: 1,
      },
    ]);
  });
});
