import { describe, expect, it } from "vitest";
import { labels } from "./labels";
import { primaryScoringLabels, roleForLabel } from "./labelTaxonomy";
import {
  IDENTITY_SOVEREIGNTY_CONSTRUCT_IDS,
  IDENTITY_SOVEREIGNTY_MODULE_ID,
  identitySovereigntyModuleItems,
  identitySovereigntyTraditionProfiles,
  scoreIdentitySovereigntyTraditions,
  type IdentitySovereigntyAnswers,
} from "./identitySovereigntyBreadth";

interface Archetype {
  id: string;
  targetId: string;
  targetVariant: string;
  answers: IdentitySovereigntyAnswers;
}

const ARCHETYPES: Archetype[] = [
  {
    id: "core-ethnonationalist",
    targetId: "ethnonationalist",
    targetVariant: "core ethnonationalism",
    answers: {
      "fm-id-1": 3,
      "fm-id-2": -3,
      "fm-id-3": 3,
      "fm-id-4": -3,
      "fm-id-5": -2,
      "fm-id-6": 2,
      "fm-id-7": 0,
      "fm-id-8": 1,
      "fm-id-9": 0,
      "fm-id-10": 0,
      "fm-id-11": 0,
      "fm-id-12": 0,
      "fm-id-13": 0,
      "fm-id-14": 0,
      "fm-id-15": 0,
      "fm-id-16": 0,
      "fm-id-17": 0,
      "fm-id-18": 0,
    },
  },
  {
    id: "liberal-multiculturalist",
    targetId: "multiculturalism",
    targetVariant: "liberal multiculturalism",
    answers: {
      "fm-id-1": -2,
      "fm-id-2": 3,
      "fm-id-3": -3,
      "fm-id-4": 3,
      "fm-id-5": 3,
      "fm-id-6": -3,
      "fm-id-7": 2,
      "fm-id-8": -2,
      "fm-id-9": 0,
      "fm-id-10": 0,
      "fm-id-11": 0,
      "fm-id-12": 1,
      "fm-id-13": 0,
      "fm-id-14": 1,
      "fm-id-15": 1,
      "fm-id-16": 0,
      "fm-id-17": 0,
      "fm-id-18": 0,
    },
  },
  {
    id: "black-community-nationalist",
    targetId: "black-nationalism",
    targetVariant: "community nationalism",
    answers: {
      "fm-id-1": 0,
      "fm-id-2": 1,
      "fm-id-3": -1,
      "fm-id-4": 2,
      "fm-id-5": 2,
      "fm-id-6": -2,
      "fm-id-7": 2,
      "fm-id-8": -2,
      "fm-id-9": 3,
      "fm-id-10": 3,
      "fm-id-11": -2,
      "fm-id-12": 2,
      "fm-id-13": 0,
      "fm-id-14": 0,
      "fm-id-15": 0,
      "fm-id-16": 0,
      "fm-id-17": 1,
      "fm-id-18": 1,
    },
  },
  {
    id: "black-separatist-nationalist",
    targetId: "black-nationalism",
    targetVariant: "separatist nationalism",
    answers: {
      "fm-id-1": 0,
      "fm-id-2": 0,
      "fm-id-3": -1,
      "fm-id-4": 1,
      "fm-id-5": 1,
      "fm-id-6": -1,
      "fm-id-7": 3,
      "fm-id-8": -3,
      "fm-id-9": 3,
      "fm-id-10": 1,
      "fm-id-11": 3,
      "fm-id-12": -3,
      "fm-id-13": 0,
      "fm-id-14": 0,
      "fm-id-15": 0,
      "fm-id-16": 0,
      "fm-id-17": 1,
      "fm-id-18": 0,
    },
  },
  {
    id: "indigenous-institutional-self-government",
    targetId: "indigenism",
    targetVariant: "institutional self-government",
    answers: {
      "fm-id-1": 0,
      "fm-id-2": 1,
      "fm-id-3": -2,
      "fm-id-4": 2,
      "fm-id-5": 2,
      "fm-id-6": -2,
      "fm-id-7": 3,
      "fm-id-8": -3,
      "fm-id-9": 1,
      "fm-id-10": 1,
      "fm-id-11": 0,
      "fm-id-12": 2,
      "fm-id-13": 3,
      "fm-id-14": 3,
      "fm-id-15": 3,
      "fm-id-16": -1,
      "fm-id-17": 0,
      "fm-id-18": 0,
      "fm-id-21": 3,
      "fm-id-22": -1,
    },
  },
  {
    id: "indigenous-resurgence-refusal",
    targetId: "indigenism",
    targetVariant: "resurgence and refusal",
    answers: {
      "fm-id-1": 0,
      "fm-id-2": 0,
      "fm-id-3": -2,
      "fm-id-4": 2,
      "fm-id-5": 1,
      "fm-id-6": -1,
      "fm-id-7": 3,
      "fm-id-8": -3,
      "fm-id-9": 2,
      "fm-id-10": 1,
      "fm-id-11": 0,
      "fm-id-12": 1,
      "fm-id-13": 3,
      "fm-id-14": 3,
      "fm-id-15": -3,
      "fm-id-16": 3,
      "fm-id-17": 0,
      "fm-id-18": 0,
      "fm-id-21": -3,
      "fm-id-22": 3,
    },
  },
  {
    id: "pan-african-transnationalist",
    targetId: "pan-africanism",
    targetVariant: "transnational solidarity and unity",
    answers: {
      "fm-id-1": 0,
      "fm-id-2": 1,
      "fm-id-3": -1,
      "fm-id-4": 1,
      "fm-id-5": 1,
      "fm-id-6": -1,
      "fm-id-7": 0,
      "fm-id-8": 0,
      "fm-id-9": 1,
      "fm-id-10": 2,
      "fm-id-11": -1,
      "fm-id-12": 1,
      "fm-id-13": 0,
      "fm-id-14": 0,
      "fm-id-15": 0,
      "fm-id-16": 0,
      "fm-id-17": 3,
      "fm-id-18": 3,
    },
  },
];

function profileById(id: string) {
  return identitySovereigntyTraditionProfiles.filter(
    (profile) => profile.id === id,
  );
}

describe("identity and sovereignty breadth module", () => {
  it("keeps the specialist measurement surface isolated and well formed", () => {
    expect(identitySovereigntyModuleItems).toHaveLength(22);
    expect(
      new Set(identitySovereigntyModuleItems.map((item) => item.question.id))
        .size,
    ).toBe(22);

    for (const item of identitySovereigntyModuleItems) {
      expect(item.question.module).toBe(IDENTITY_SOVEREIGNTY_MODULE_ID);
      expect([
        "national-identity-sovereignty",
        "race-ethnicity-multiculturalism",
      ]).toContain(item.question.domain);
      expect(item.question.responseType).toBe("likert7");
      expect(item.question.tier).toBe("extensive");
    }
  });

  it("measures each local construct with at least two items", () => {
    for (const constructId of IDENTITY_SOVEREIGNTY_CONSTRUCT_IDS) {
      const coverage = identitySovereigntyModuleItems.filter((item) => {
        const weight = item.constructWeights[constructId];
        return weight !== undefined && weight !== 0;
      }).length;

      expect(
        coverage,
        `${constructId} has insufficient specialist coverage`,
      ).toBeGreaterThanOrEqual(2);
    }
  });

  it("splits multicultural accommodation into independent policy dimensions", () => {
    const prompts = identitySovereigntyModuleItems.map(
      (item) => item.question.prompt,
    );
    expect(
      prompts.find((prompt) => prompt.includes("language rights")),
    ).toBeUndefined();
    expect(
      prompts.some((prompt) => prompt.includes("minority languages")),
    ).toBe(true);
    expect(
      prompts.some((prompt) => prompt.includes("religious exemptions")),
    ).toBe(true);
    expect(
      prompts.some((prompt) =>
        prompt.includes("guaranteed or reserved political representation"),
      ),
    ).toBe(true);
  });

  it("preserves current production roles and quarantines unvalidated additions", () => {
    const catalogIds = new Set(labels.map((label) => label.id));
    const primaryIds = new Set(primaryScoringLabels.map((label) => label.id));

    expect(roleForLabel("ethnonationalist")).toBe("modifier");
    expect(roleForLabel("multiculturalism")).toBe("modifier");
    expect(roleForLabel("indigenism")).toBe("specialist");
    expect(
      profileById("ethnonationalist").every(
        (profile) => profile.status === "existing-modifier",
      ),
    ).toBe(true);

    for (const existingId of [
      "ethnonationalist",
      "multiculturalism",
      "indigenism",
    ]) {
      expect(catalogIds.has(existingId)).toBe(true);
    }
    expect(primaryIds.has("ethnonationalist")).toBe(false);
    expect(primaryIds.has("multiculturalism")).toBe(false);
    expect(primaryIds.has("indigenism")).toBe(false);

    for (const candidateId of ["black-nationalism", "pan-africanism"]) {
      expect(
        catalogIds.has(candidateId),
        `${candidateId} is missing from the specialist catalog`,
      ).toBe(true);
      expect(
        primaryIds.has(candidateId),
        `${candidateId} leaked into the primary pool`,
      ).toBe(false);
      expect(roleForLabel(candidateId)).toBe("specialist");
    }
    expect(
      profileById("black-nationalism").every(
        (profile) => profile.status === "candidate-specialist",
      ),
    ).toBe(true);
    expect(
      profileById("pan-africanism").every(
        (profile) => profile.status === "candidate-role-review",
      ),
    ).toBe(true);
  });

  it("models variants without multiplying catalog labels", () => {
    expect(
      profileById("black-nationalism")
        .map((profile) => profile.variant)
        .sort(),
    ).toEqual(["community nationalism", "separatist nationalism"]);
    expect(
      profileById("indigenism")
        .map((profile) => profile.variant)
        .sort(),
    ).toEqual(["institutional self-government", "resurgence and refusal"]);
  });

  for (const archetype of ARCHETYPES) {
    it(`${archetype.id} resolves to ${archetype.targetId} / ${archetype.targetVariant}`, () => {
      const matches = scoreIdentitySovereigntyTraditions(archetype.answers);
      expect(matches[0]?.id).toBe(archetype.targetId);
      expect(matches[0]?.variant).toBe(archetype.targetVariant);
      expect(matches[0]?.fit).toBeGreaterThan(0.75);
    });
  }

  it("allows Black community nationalism and Pan-Africanism to co-occur", () => {
    const community = ARCHETYPES.find(
      (archetype) => archetype.id === "black-community-nationalist",
    );
    expect(community).toBeDefined();
    const answers = {
      ...community!.answers,
      "fm-id-17": 3,
      "fm-id-18": 3,
    };

    const matches = scoreIdentitySovereigntyTraditions(answers);
    const blackNationalism = matches.find(
      (match) => match.id === "black-nationalism",
    );
    const panAfricanism = matches.find(
      (match) => match.id === "pan-africanism",
    );
    const ethnonationalism = matches.find(
      (match) => match.id === "ethnonationalist",
    );

    expect(blackNationalism?.variant).toBe("community nationalism");
    expect(blackNationalism?.fit).toBeGreaterThan(0.75);
    expect(panAfricanism?.fit).toBeGreaterThan(0.9);
    expect(ethnonationalism?.fit).toBeLessThan(0.6);
  });
});
