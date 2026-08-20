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

function answered(itemId: string, value = 3): Record<string, unknown> {
  return { state: "answered", itemId, responseType: "likert7", value };
}

function coreAssessment(bundle: CanonicalContentBundle) {
  const coreItem = bundle.items.find(
    (item) => item.role === "core" && item.status === "active" && item.responseType === "likert7",
  );
  if (!coreItem) throw new Error("Canonical bundle has no active Likert core item");
  return scoreConstructLayer(
    prepareAssessmentResponses([answered(String(coreItem.id))], bundle),
    bundle,
  );
}

function scoredSpecialistSurfaces(bundle: CanonicalContentBundle): unknown {
  return {
    variants: bundle.specialists.flatMap((profile) => profile.variants ?? []),
    candidates: bundle.specialistCandidates,
  };
}

describe("specialist commitment scoring target-vector lockout", () => {
  it("contains no legacy targetValue fields on scored specialist variants or candidates", () => {
    expect(JSON.stringify(scoredSpecialistSurfaces(generatedBundle))).not.toContain('"targetValue"');
  });

  it("ignores hostile legacy profile requirements injected beside commitment-backed variants", () => {
    const module = generatedBundle.specialistModules.find(
      (entry) => entry.itemIds.length > 0 && entry.outputProfileIds.length > 0 && entry.constructIds.length > 0,
    );
    if (!module) throw new Error("Canonical bundle has no scored specialist module");

    const baselineBundle = JSON.parse(JSON.stringify(generatedBundle)) as CanonicalContentBundle;
    const mutatedBundle = JSON.parse(JSON.stringify(generatedBundle)) as CanonicalContentBundle;
    const moduleId = String(module.id);
    const hostileConstructId = module.constructIds[0];

    for (const profile of mutatedBundle.specialists) {
      if (String(profile.moduleId ?? "") !== moduleId || !(profile.variants?.length)) continue;
      const hostileRequirement = {
        constructId: hostileConstructId,
        targetValue: -1,
        weight: 999,
        minimumAnsweredItems: 999,
      };
      profile.requirements = [{ ...hostileRequirement }];
      for (const variant of profile.variants ?? []) {
        (variant as unknown as { requirements: unknown[] }).requirements = [
          { ...hostileRequirement },
        ];
      }
    }

    const responses = module.itemIds.map((itemId) => answered(String(itemId)));
    const input = { requestedModuleIds: [moduleId], responses };
    const baselinePrepared = prepareSpecialistAssessment(input, baselineBundle);
    const mutatedPrepared = prepareSpecialistAssessment(input, mutatedBundle);
    const baseline = scoreSpecialists(
      coreAssessment(baselineBundle),
      baselinePrepared,
      baselineBundle,
    );
    const mutated = scoreSpecialists(
      coreAssessment(mutatedBundle),
      mutatedPrepared,
      mutatedBundle,
    );

    expect(mutated.modules).toEqual(baseline.modules);
  });
});
