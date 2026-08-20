import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import type { CanonicalContentBundle } from "../../v2/packages/contracts/src/content";
import {
  prepareAssessmentResponses,
  prepareSpecialistAssessment,
  scoreConstructLayer,
  scoreSpecialists,
} from "../../v2/packages/engine/src";

const generatedBundle = JSON.parse(
  readFileSync("v2/generated/content.bundle.json", "utf8"),
) as CanonicalContentBundle;

function activation() {
  return {
    strategy: "explicit-request" as const,
    minimumAnsweredItems: 2,
    minimumAnsweredWeightRatio: 0.5,
    minimumConstructCoverageRatio: 0.5,
  };
}

function answered(itemId: string, value = 3): Record<string, unknown> {
  return { state: "answered", itemId, responseType: "likert7", value };
}

function syntheticBundle(): CanonicalContentBundle {
  const item = (
    id: string,
    moduleId?: string,
    constructIds: string[] = ["root:core"],
  ): Record<string, unknown> => ({
    id,
    status: "active",
    role: moduleId ? "specialist" : "core",
    layer: "normative",
    tier: "quick",
    responseType: "likert7",
    domainId: "domain:test",
    ...(moduleId === undefined ? {} : { moduleId }),
    scoring: {
      mappingMode: "item",
      contributions: constructIds.map((constructId) => ({
        constructId,
        weight: 1,
        polarity: 1,
      })),
    },
  });
  const profile = (
    id: string,
    variantId: string,
    moduleId: string,
    gate = false,
  ): Record<string, unknown> => ({
    id,
    name: id,
    role: "specialist",
    specialistId: `node:${moduleId}`,
    itemIds:
      moduleId === "module:a"
        ? ["a:one", "a:two", "a:three"]
        : ["b:one", "b:two"],
    activation: {},
    outputType: "primary",
    moduleId,
    requirements: [],
    gates: [],
    status: "active",
    variants: [
      {
        id: variantId,
        sourceKey: variantId,
        name: id,
        description: id,
        status: "active",
        commitments: [
          {
            id: `${variantId}:commitment`,
            constructId: `${moduleId}:one`,
            relation: "core",
            criterion: { operator: "minimum", minimum: 0.25 },
            weight: 1,
            rationale: "Synthetic specialist commitment",
          },
        ],
        gates: gate
          ? [
              {
                id: `${variantId}:gate`,
                operator: "minimum",
                constructId: `${moduleId}:one`,
                minimum: 2,
              },
            ]
          : [],
      },
    ],
  });
  const module = (
    id: string,
    itemIds: string[],
    constructIds: string[],
    profileIds: string[],
  ): Record<string, unknown> => ({
    id,
    version: "synthetic-phase7",
    title: id,
    shortTitle: id,
    description: id,
    invitationNote: id,
    estimatedMinutes: 1,
    activation: activation(),
    itemIds,
    constructIds,
    candidateIds: [],
    outputProfileIds: profileIds,
  });
  return {
    metadata: {
      contentSchemaVersion: "synthetic-phase7",
      contentVersion: "synthetic-phase7",
      contentFingerprint: "synthetic-phase7-fingerprint",
      scoringVersion: "synthetic-phase7",
      responseSchemaVersion: "synthetic-phase7",
      resultSchemaVersion: "synthetic-phase7-result",
      researchSchemaVersion: "synthetic-phase7-research",
    },
    domains: [{ id: "domain:test", name: "Test" }],
    constructs: [
      { id: "root:core", name: "Core", role: "normative", scope: "root" },
      {
        id: "module:a:one",
        name: "A one",
        role: "specialist",
        scope: "specialist",
        moduleId: "module:a",
      },
      {
        id: "module:a:two",
        name: "A two",
        role: "specialist",
        scope: "specialist",
        moduleId: "module:a",
      },
      {
        id: "module:b:one",
        name: "B one",
        role: "specialist",
        scope: "specialist",
        moduleId: "module:b",
      },
    ],
    items: [
      item("core:one"),
      item("a:one", "module:a", ["root:core", "module:a:one"]),
      item("a:two", "module:a", ["root:core", "module:a:two"]),
      item("a:three", "module:a", ["root:core", "module:a:one"]),
      item("b:one", "module:b", ["root:core", "module:b:one"]),
      item("b:two", "module:b", ["root:core", "module:b:one"]),
    ],
    profiles: [],
    modifiers: [],
    specialists: [
      profile("profile:a-one", "variant:a-one", "module:a"),
      profile("profile:a-two", "variant:a-two", "module:a", true),
      profile("profile:b", "variant:b", "module:b"),
    ],
    specialistModules: [
      module(
        "module:a",
        ["a:one", "a:two", "a:three"],
        ["module:a:one", "module:a:two"],
        ["profile:a-one", "profile:a-two"],
      ),
      module("module:b", ["b:one", "b:two"], ["module:b:one"], ["profile:b"]),
    ],
    specialistCandidates: [],
    specialistAssignment: {
      strategy: "synthetic",
      rosterVersion: "synthetic",
      orderedModuleIds: ["module:a", "module:b"],
    },
    ontologyNodes: [
      { id: "node:module:a", label: "A", nodeScope: "specialist" },
      { id: "node:module:b", label: "B", nodeScope: "specialist" },
    ],
    ontologyRelations: [],
    provenanceSources: [],
  } as unknown as CanonicalContentBundle;
}

function coreAssessment(bundle: CanonicalContentBundle, value?: number) {
  const coreItem = bundle.items.find((item) => item.role === "core");
  if (!coreItem)
    throw new Error("Synthetic or canonical bundle has no core item");
  const itemId = String(coreItem.id);
  const response =
    value === undefined
      ? { state: "missing", itemId }
      : answered(itemId, value);
  return scoreConstructLayer(
    prepareAssessmentResponses([response], bundle),
    bundle,
  );
}

describe("Phase 7 specialist module activation and scoring", () => {
  it("requires explicit activation and rejects responses from unrequested modules", () => {
    const bundle = syntheticBundle();
    expect(() =>
      prepareSpecialistAssessment(
        { requestedModuleIds: [], responses: [answered("a:one")] },
        bundle,
      ),
    ).toThrow();
    expect(() =>
      prepareSpecialistAssessment(
        { requestedModuleIds: ["module:a"], responses: [answered("b:one")] },
        bundle,
      ),
    ).toThrow();
    const prepared = prepareSpecialistAssessment(
      { requestedModuleIds: [], responses: [] },
      bundle,
    );
    const result = scoreSpecialists(coreAssessment(bundle), prepared, bundle);
    expect(
      result.modules.find((module) => module.moduleId === "module:a"),
    ).toMatchObject({
      status: "not_activated",
      activationStatus: "not_activated",
    });
  });

  it("keeps specialist mappings local and prevents root construct contamination", () => {
    const bundle = syntheticBundle();
    const prepared = prepareSpecialistAssessment(
      {
        requestedModuleIds: ["module:a"],
        responses: [answered("a:one"), answered("a:two"), answered("a:three")],
      },
      bundle,
    );
    expect(
      prepared.modules[0]?.prepared.contributions.every((entry) =>
        entry.targetConstructId.startsWith("module:a:"),
      ),
    ).toBe(true);
    const result = scoreSpecialists(coreAssessment(bundle), prepared, bundle);
    const module = result.modules.find(
      (entry) => entry.moduleId === "module:a",
    );
    expect(
      module?.constructAssessment?.constructs.map((entry) => entry.constructId),
    ).toEqual(["module:a:one", "module:a:two"]);
    expect(
      module?.constructAssessment?.constructs.some(
        (entry) => entry.constructId === "root:core",
      ),
    ).toBe(false);
  });

  it("distinguishes activated insufficient evidence from not activated", () => {
    const bundle = syntheticBundle();
    const prepared = prepareSpecialistAssessment(
      {
        requestedModuleIds: ["module:a"],
        responses: [answered("a:one")],
      },
      bundle,
    );
    const result = scoreSpecialists(coreAssessment(bundle), prepared, bundle);
    expect(
      result.modules.find((module) => module.moduleId === "module:a")?.status,
    ).toBe("activated_insufficient_evidence");
    expect(
      result.modules.find((module) => module.moduleId === "module:b")?.status,
    ).toBe("not_activated");
  });

  it("ranks profiles only inside their module and makes ties deterministic", () => {
    const bundle = syntheticBundle();
    const prepared = prepareSpecialistAssessment(
      {
        requestedModuleIds: ["module:a"],
        responses: [answered("a:one"), answered("a:two"), answered("a:three")],
      },
      bundle,
    );
    const module = scoreSpecialists(
      coreAssessment(bundle),
      prepared,
      bundle,
    ).modules.find((entry) => entry.moduleId === "module:a");
    expect(module?.status).toBe("scored");
    expect(module?.topProfileIds).toEqual(["profile:a-one"]);
    expect(module?.ranking).toHaveLength(1);
    expect(
      module?.profiles.find((profile) => profile.profileId === "profile:a-two")
        ?.status,
    ).toBe("abstained");
  });

  it("is independent of the core construct values and deterministic under input reordering", () => {
    const bundle = syntheticBundle();
    const first = prepareSpecialistAssessment(
      {
        requestedModuleIds: ["module:b"],
        responses: [answered("b:one"), answered("b:two")],
      },
      bundle,
    );
    const second = prepareSpecialistAssessment(
      {
        requestedModuleIds: ["module:b"],
        responses: [answered("b:two"), answered("b:one")],
      },
      bundle,
    );
    const firstResult = scoreSpecialists(coreAssessment(bundle), first, bundle);
    const secondResult = scoreSpecialists(
      coreAssessment(bundle, 3),
      second,
      bundle,
    );
    expect(secondResult.modules).toEqual(firstResult.modules);
    expect(Object.isFrozen(firstResult)).toBe(true);
    expect(Object.isFrozen(firstResult.modules[0])).toBe(true);
  });

  it("does not let retained legacy target vectors affect specialist results", () => {
    const bundle = syntheticBundle();
    const legacyMutated = JSON.parse(JSON.stringify(bundle)) as CanonicalContentBundle;
    for (const profile of legacyMutated.specialists) {
      for (const requirement of profile.requirements ?? []) {
        requirement.targetValue = requirement.targetValue > 0 ? -1 : 1;
        requirement.weight = 999;
      }
    }
    const input = {
      requestedModuleIds: ["module:a"],
      responses: [answered("a:one"), answered("a:two"), answered("a:three")],
    };
    const firstPrepared = prepareSpecialistAssessment(input, bundle);
    const secondPrepared = prepareSpecialistAssessment(input, legacyMutated);
    const first = scoreSpecialists(coreAssessment(bundle), firstPrepared, bundle);
    const second = scoreSpecialists(coreAssessment(legacyMutated), secondPrepared, legacyMutated);
    expect(second.modules).toEqual(first.modules);
  });

  it("covers the real canonical specialist corpus without cross-module ownership", () => {
    const modules = generatedBundle.specialistModules;
    const ownership = new Map<string, string>();
    for (const module of modules) {
      expect(module.activation.strategy).toBe("explicit-request");
      expect(module.activation.minimumAnsweredItems).toBeGreaterThanOrEqual(0);
      for (const itemId of module.itemIds) {
        expect(ownership.has(String(itemId))).toBe(false);
        ownership.set(String(itemId), String(module.id));
      }
      for (const constructId of module.constructIds) {
        const construct = generatedBundle.constructs.find(
          (entry) => String(entry.id) === String(constructId),
        );
        expect(construct?.scope).toBe("specialist");
        expect(String(construct?.moduleId)).toBe(String(module.id));
      }
    }
    const specialistItems = generatedBundle.items.filter(
      (item) => item.role === "specialist",
    );
    expect(ownership.size).toBe(specialistItems.length);
    const responses = specialistItems.map((item) => answered(String(item.id)));
    const prepared = prepareSpecialistAssessment(
      {
        requestedModuleIds: modules.map((module) => String(module.id)),
        responses,
      },
      generatedBundle,
    );
    const result = scoreSpecialists(
      coreAssessment(generatedBundle),
      prepared,
      generatedBundle,
    );
    expect(result.summary.moduleCount).toBe(modules.length);
    expect(result.summary.activatedModuleCount).toBe(modules.length);
    expect(
      result.modules.every((module) => module.constructAssessment !== null),
    ).toBe(true);
    for (const module of result.modules) {
      expect(
        module.constructAssessment?.constructs.every(
          (construct) =>
            String(construct.constructId).startsWith(
              `specialist:${module.moduleId.replace(/-module$/, "")}`,
            ) ||
            generatedBundle.specialistModules
              .find((entry) => String(entry.id) === module.moduleId)
              ?.constructIds.includes(construct.constructId),
        ),
      ).toBe(true);
      expect(
        module.ranking.every((entry) =>
          module.profiles.some(
            (profile) => profile.profileId === entry.profileId,
          ),
        ),
      ).toBe(true);
    }
  });
});
