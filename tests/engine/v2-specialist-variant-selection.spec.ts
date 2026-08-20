import { describe, expect, it } from "vitest";
import type { CanonicalContentBundle } from "../../v2/packages/contracts/src/content";
import {
  prepareAssessmentResponses,
  prepareSpecialistAssessment,
  scoreConstructLayer,
  scoreSpecialists,
} from "../../v2/packages/engine/src";

function answered(itemId: string, value = 2): Record<string, unknown> {
  return { state: "answered", itemId, responseType: "likert7", value };
}

function bundle(): CanonicalContentBundle {
  return {
    metadata: {
      contentSchemaVersion: "variant-selection-test",
      contentVersion: "variant-selection-test",
      contentFingerprint: "variant-selection-test-fingerprint",
      scoringVersion: "variant-selection-test",
      responseSchemaVersion: "variant-selection-test",
      resultSchemaVersion: "variant-selection-test-result",
      researchSchemaVersion: "variant-selection-test-research",
    },
    domains: [{ id: "domain:test", name: "Test" }],
    constructs: [
      { id: "root:core", name: "Core", role: "normative", scope: "root" },
      {
        id: "module:x:one",
        name: "Module X one",
        role: "specialist",
        scope: "specialist",
        moduleId: "module:x",
      },
    ],
    items: [
      {
        id: "core:one",
        status: "active",
        role: "core",
        layer: "normative",
        tier: "quick",
        responseType: "likert7",
        domainId: "domain:test",
        scoring: {
          mappingMode: "item",
          contributions: [{ constructId: "root:core", weight: 1, polarity: 1 }],
        },
      },
      {
        id: "x:one",
        status: "active",
        role: "specialist",
        moduleId: "module:x",
        layer: "normative",
        tier: "quick",
        responseType: "likert7",
        domainId: "domain:test",
        scoring: {
          mappingMode: "item",
          contributions: [{ constructId: "module:x:one", weight: 1, polarity: 1 }],
        },
      },
    ],
    profiles: [],
    modifiers: [],
    specialists: [
      {
        id: "profile:multi",
        name: "Multi-variant profile",
        role: "specialist",
        specialistId: "node:multi",
        itemIds: ["x:one"],
        activation: {},
        outputType: "primary",
        moduleId: "module:x",
        requirements: [],
        gates: [],
        status: "active",
        variants: [
          {
            id: "variant:declared-first-lower-affinity",
            sourceKey: "declared-first-lower-affinity",
            name: "Declared first lower affinity",
            description: "Both variants pass, but this one should lose on affinity.",
            status: "active",
            commitments: [
              {
                id: "commitment:lower-affinity",
                constructId: "module:x:one",
                relation: "core",
                criterion: { operator: "minimum", minimum: 0.5 },
                weight: 1,
                rationale: "Higher threshold yields lower graded support at the observed score.",
              },
            ],
            gates: [],
          },
          {
            id: "variant:declared-second-higher-affinity",
            sourceKey: "declared-second-higher-affinity",
            name: "Declared second higher affinity",
            description: "Both variants pass, and this one should win on affinity.",
            status: "active",
            commitments: [
              {
                id: "commitment:higher-affinity",
                constructId: "module:x:one",
                relation: "core",
                criterion: { operator: "minimum", minimum: 0 },
                weight: 1,
                rationale: "Lower threshold yields higher graded support at the observed score.",
              },
            ],
            gates: [],
          },
        ],
      },
    ],
    specialistModules: [
      {
        id: "module:x",
        version: "variant-selection-test",
        title: "Module X",
        shortTitle: "X",
        description: "Synthetic module",
        invitationNote: "Synthetic module",
        estimatedMinutes: 1,
        activation: {
          strategy: "explicit-request",
          minimumAnsweredItems: 1,
          minimumAnsweredWeightRatio: 1,
          minimumConstructCoverageRatio: 1,
        },
        itemIds: ["x:one"],
        constructIds: ["module:x:one"],
        candidateIds: [],
        outputProfileIds: ["profile:multi"],
      },
    ],
    specialistCandidates: [],
    specialistAssignment: {
      strategy: "synthetic",
      rosterVersion: "synthetic",
      orderedModuleIds: ["module:x"],
    },
    ontologyNodes: [{ id: "node:multi", label: "Multi", nodeScope: "specialist" }],
    ontologyRelations: [],
    provenanceSources: [],
  } as unknown as CanonicalContentBundle;
}

describe("specialist multi-variant selection", () => {
  it("selects the highest-affinity valid variant rather than the first declared variant", () => {
    const content = bundle();
    const core = scoreConstructLayer(
      prepareAssessmentResponses([answered("core:one", 3)], content),
      content,
    );
    const prepared = prepareSpecialistAssessment(
      { requestedModuleIds: ["module:x"], responses: [answered("x:one", 2)] },
      content,
    );
    const result = scoreSpecialists(core, prepared, content);
    const profile = result.modules[0]?.profiles[0];

    expect(profile?.status).toBe("scored");
    expect(profile?.variantId).toBe("variant:declared-second-higher-affinity");
    expect(profile?.affinity).toBeGreaterThan(0.8);
  });
});
