import { describe, expect, it } from "vitest";
import type { AnswerMap } from "../types";
import { axisById } from "../data/axes";
import {
  SPECIALIST_ASSIGNMENT_MODULE_IDS,
  SPECIALIST_ASSIGNMENT_ROSTER_VERSION,
  SPECIALIST_ASSIGNMENT_STRATEGY,
  assignSpecialistModule,
  buildSpecialistQuestionForm,
  scoreSpecialistModule,
  specialistModuleDefinitions,
  specialistModuleById,
} from "./index";

function answerMap(values: Record<string, number>): AnswerMap {
  return Object.fromEntries(
    Object.entries(values).map(([questionId, value]) => [
      questionId,
      { questionId, value },
    ]),
  );
}

describe("specialist module registry", () => {
  it("contains unique, respondent-facing modules", () => {
    expect(specialistModuleDefinitions.length).toBeGreaterThanOrEqual(2);
    expect(
      new Set(specialistModuleDefinitions.map((module) => module.id)).size,
    ).toBe(specialistModuleDefinitions.length);
    for (const module of specialistModuleDefinitions) {
      expect(module.questions.length).toBeGreaterThanOrEqual(4);
      expect(module.criterionOptions.length).toBeGreaterThanOrEqual(4);
      expect(module.estimatedMinutes).toBeGreaterThan(0);
      expect(
        new Set(module.questions.map((question) => question.id)).size,
      ).toBe(module.questions.length);
    }
  });

  it("freezes the ordered assignment roster against the registered modules", () => {
    expect(SPECIALIST_ASSIGNMENT_MODULE_IDS).toEqual(
      specialistModuleDefinitions.map((module) => module.id),
    );
  });

  it("versions focused module revisions separately from the experimental wave roster", () => {
    expect(specialistModuleById.get("feminist-faction-module")?.version).toBe(
      "2026-08-v5",
    );
    expect(
      specialistModuleById.get("identity-sovereignty-module")?.version,
    ).toBe("2026-08-v4");
    expect(
      specialistModuleById.get("monarchist-municipal-module")?.version,
    ).toBe("2026-08-specialist-v10");
  });

  it("keeps specialist compatibility axes in the question layer", () => {
    for (const module of specialistModuleDefinitions) {
      for (const question of module.questions) {
        for (const weight of question.axisWeights) {
          const axis = axisById.get(weight.axisId);
          expect(
            axis,
            `${module.id}/${question.id} references ${weight.axisId}`,
          ).toBeDefined();
          expect(
            axis?.layer,
            `${module.id}/${question.id} crosses layers`,
          ).toBe(question.layer);
        }
      }
    }
  });

  it("assigns the same module across test and retest for a participant", () => {
    const first = assignSpecialistModule("p_example", "pilot");
    const second = assignSpecialistModule("p_example", "pilot");
    expect(first).toEqual(second);
    expect(first).toEqual({
      moduleId: "identity-sovereignty-module",
      strategy: SPECIALIST_ASSIGNMENT_STRATEGY,
      rosterVersion: SPECIALIST_ASSIGNMENT_ROSTER_VERSION,
    });
  });

  it("spreads deterministic assignments across the available modules", () => {
    const assigned = new Set(
      Array.from(
        { length: 64 },
        (_, index) => assignSpecialistModule(`p_${index}`, "pilot").moduleId,
      ),
    );
    expect(assigned).toEqual(new Set(SPECIALIST_ASSIGNMENT_MODULE_IDS));
  });

  it("uses a deterministic but administration-specific presentation order", () => {
    const assignment = assignSpecialistModule("p_order", "pilot");
    const module = specialistModuleById.get(assignment.moduleId);
    expect(module).toBeDefined();

    const testForm = buildSpecialistQuestionForm(
      assignment.moduleId,
      "p_order",
      "test",
    );
    const repeatTestForm = buildSpecialistQuestionForm(
      assignment.moduleId,
      "p_order",
      "test",
    );
    const retestForm = buildSpecialistQuestionForm(
      assignment.moduleId,
      "p_order",
      "retest",
    );

    expect(testForm.map((question) => question.id)).toEqual(
      repeatTestForm.map((question) => question.id),
    );
    expect(new Set(testForm.map((question) => question.id))).toEqual(
      new Set(module?.questions.map((question) => question.id)),
    );
    expect(retestForm.map((question) => question.id)).not.toEqual(
      testForm.map((question) => question.id),
    );
  });

  it("adapts rich AnswerMap values into specialist scoring", () => {
    const feminist = specialistModuleDefinitions.find(
      (module) => module.id === "feminist-faction-module",
    );
    expect(feminist).toBeDefined();
    const outcome = scoreSpecialistModule(
      "feminist-faction-module",
      answerMap({
        "fm-fem-1": 3,
        "fm-fem-2": 1,
        "fm-fem-3": 0,
        "fm-fem-4": 0,
        "fm-fem-5": -2,
        "fm-fem-6": 3,
        "fm-fem-7": -3,
        "fm-fem-8": -3,
      }),
    );
    expect(outcome.matches[0]?.id).toBe("liberal-feminism");
    expect(outcome.constructScores["legal-equality-reform"]).toBeGreaterThan(0);
  });

  it("exposes an abstention state when a follow-up has no answered evidence", () => {
    const outcome = scoreSpecialistModule(
      "feminist-faction-module",
      answerMap({}),
    );

    expect(outcome.evidence?.status).toBe("insufficient-evidence");
    expect(
      outcome.matches.every(
        (match) => match.insufficientEvidence && match.fit === 0,
      ),
    ).toBe(true);
  });

  it("keeps experimental module matches separate and evidence-aware", () => {
    const module = specialistModuleById.get("green-morphology-module");
    expect(module).toBeDefined();

    const empty = scoreSpecialistModule(
      "green-morphology-module",
      answerMap({}),
    );
    expect(empty.evidence?.status).toBe("insufficient-evidence");
    expect(
      empty.matches.every((match) => match.status === "insufficient evidence"),
    ).toBe(true);

    const answered = answerMap(
      Object.fromEntries(
        module!.questions.map((question) => [String(question.id), 3]),
      ),
    );
    const outcome = scoreSpecialistModule("green-morphology-module", answered);
    expect(outcome.evidence?.status).toBe("sufficient");
    expect(outcome.matches[0]?.status).toBe("experimental");
    expect(
      outcome.matches.every((match) => match.evidenceStatus === "sufficient"),
    ).toBe(true);
  });

  it("separates researched religious-national personas without promoting them", () => {
    const islamicDemocracy = scoreSpecialistModule(
      "religious-national-politics-module",
      answerMap({
        "fm-rn-1": 3,
        "fm-rn-2": 0,
        "fm-rn-3": 0,
        "fm-rn-4": 2,
        "fm-rn-5": 2,
        "fm-rn-6": 2,
        "fm-rn-7": 3,
        "fm-rn-8": 3,
      }),
    );
    expect(islamicDemocracy.matches[0]?.id).toBe("islamic-democracy");
    expect(islamicDemocracy.matches[0]?.status).toBe("experimental");
    expect(islamicDemocracy.matches[0]?.evidenceStatus).toBe("sufficient");

    const hindutva = scoreSpecialistModule(
      "religious-national-politics-module",
      answerMap({
        "fm-rn-1": 1,
        "fm-rn-2": 1,
        "fm-rn-3": 3,
        "fm-rn-4": -1,
        "fm-rn-9": 3,
      }),
    );
    expect(hindutva.matches[0]?.id).toBe("hindutva");
    expect(hindutva.matches[0]?.status).toBe("experimental");
  });

  it("requires direct religious-national fusion before showing a religious-national comparison", () => {
    const module = specialistModuleById.get(
      "religious-national-politics-module",
    );
    expect(module).toBeDefined();

    const baseAnswers = Object.fromEntries(
      module!.questions.map((question) => [String(question.id), 3]),
    );
    const withoutFusion = scoreSpecialistModule(
      "religious-national-politics-module",
      answerMap({ ...baseAnswers, "fm-rn-3": -3 }),
    ).matches.find((match) => match.id === "religious-nationalism");
    const withFusion = scoreSpecialistModule(
      "religious-national-politics-module",
      answerMap({ ...baseAnswers, "fm-rn-3": 3 }),
    ).matches.find((match) => match.id === "religious-nationalism");

    expect(withoutFusion?.gateStatus).toBe("blocked");
    expect(withoutFusion?.fit).toBe(0);
    expect(withFusion?.gateStatus).toBe("passed");
  });

  it("requires two direct religious-authority items before showing theocratic politics", () => {
    const withoutBothItems = scoreSpecialistModule(
      "religious-national-politics-module",
      answerMap({ "fm-rn-2": 3 }),
    ).matches.find((match) => match.id === "theocrat");
    const contradicted = scoreSpecialistModule(
      "religious-national-politics-module",
      answerMap({ "fm-rn-2": -3, "fm-rn-11": -3 }),
    ).matches.find((match) => match.id === "theocrat");
    const supported = scoreSpecialistModule(
      "religious-national-politics-module",
      answerMap({ "fm-rn-2": 3, "fm-rn-11": 3 }),
    ).matches.find((match) => match.id === "theocrat");

    expect(withoutBothItems?.status).toBe("insufficient evidence");
    expect(withoutBothItems?.gateStatus).toBe("insufficient-evidence");
    expect(contradicted?.status).toBe("blocked by constitutive gate");
    expect(contradicted?.gateStatus).toBe("blocked");
    expect(contradicted?.fit).toBe(0);
    expect(supported?.status).toBe("experimental");
    expect(supported?.gateStatus).toBe("passed");
    expect(supported?.evidenceStatus).toBe("sufficient");
  });

  it("separates researched technology-governance personas without promoting them", () => {
    const cyberocracy = scoreSpecialistModule(
      "technology-governance-module",
      answerMap({
        "fm-te-1": 2,
        "fm-te-2": 3,
        "fm-te-3": 0,
        "fm-te-4": 1,
      }),
    );
    expect(cyberocracy.matches[0]?.id).toBe("cyberocracy");
    expect(cyberocracy.matches[0]?.status).toBe("experimental");
    expect(cyberocracy.matches[0]?.evidenceStatus).toBe("sufficient");

    const technoAnarchism = scoreSpecialistModule(
      "technology-governance-module",
      answerMap({
        "fm-te-1": -1,
        "fm-te-2": -1,
        "fm-te-3": 3,
        "fm-te-4": 1,
        "fm-te-6": -1,
      }),
    );
    expect(technoAnarchism.matches[0]?.id).toBe("techno-anarchism");
    expect(technoAnarchism.matches[0]?.status).toBe("experimental");
  });

  it("keeps the ordered specialist waves broad enough to include the new family anchors", () => {
    const anarchist = specialistModuleDefinitions.find(
      (module) => module.id === "anarchist-families-module",
    );
    const green = specialistModuleDefinitions.find(
      (module) => module.id === "green-morphology-module",
    );
    const socialist = specialistModuleDefinitions.find(
      (module) => module.id === "socialist-families-module",
    );
    const religious = specialistModuleDefinitions.find(
      (module) => module.id === "religious-national-politics-module",
    );

    expect(
      anarchist?.criterionOptions.map((option) => option.traditionId),
    ).toEqual(
      expect.arrayContaining([
        "social-anarchism",
        "market-anarchism",
        "mutualist",
      ]),
    );
    expect(
      green?.criterionOptions.map((option) => option.traditionId),
    ).toContain("ecomodernist");
    expect(
      socialist?.criterionOptions.map((option) => option.traditionId),
    ).toEqual(
      expect.arrayContaining([
        "democratic-socialist",
        "marxian-socialism",
        "guild-socialism",
      ]),
    );
    expect(
      religious?.criterionOptions.map((option) => option.traditionId),
    ).toEqual(expect.arrayContaining(["religious-nationalism", "theocrat"]));
    expect(
      religious?.criterionOptions.map((option) => option.traditionId),
    ).not.toEqual(
      expect.arrayContaining([
        "christian-reconstructionism",
        "fundamentalist-theocracy",
      ]),
    );
    expect(religious?.constructWeightsByQuestionId["fm-rn-3"]).toEqual({
      "civilizational-nationalism": 1,
      "religious-national-fusion": 1,
    });
    expect(religious?.constructWeightsByQuestionId["fm-rn-5"]).toEqual({
      "constitutional-review": 1,
    });
    expect(religious?.constructWeightsByQuestionId["fm-rn-6"]).toEqual({
      "party-competition": 1,
    });
    expect(religious?.constructWeightsByQuestionId["fm-rn-7"]).toEqual({
      "islamic-public-law": 1,
    });
    expect(religious?.constructWeightsByQuestionId["fm-rn-8"]).toEqual({
      "interpretive-pluralism": 1,
    });
    expect(religious?.constructWeightsByQuestionId["fm-rn-9"]).toEqual({
      "hindu-civilizational-belonging": 1,
    });
    expect(religious?.constructWeightsByQuestionId["fm-rn-10"]).toEqual({
      "jewish-national-self-determination": 1,
    });
    expect(religious?.constructWeightsByQuestionId["fm-rn-11"]).toEqual({
      "religious-authority": 1,
    });
    const technology = specialistModuleDefinitions.find(
      (module) => module.id === "technology-governance-module",
    );
    expect(technology?.constructWeightsByQuestionId["fm-te-5"]).toEqual({
      "market-acceleration": 1,
    });
    expect(
      technology?.criterionOptions.map((option) => option.traditionId),
    ).toEqual(
      expect.arrayContaining([
        "left-accelerationism",
        "right-accelerationism",
        "technology-centered-accelerationism",
      ]),
    );
  });

  it("separates experimental accelerationist directions without promoting them", () => {
    const left = scoreSpecialistModule(
      "technology-governance-module",
      answerMap({
        "fm-te-1": 0,
        "fm-te-2": 0,
        "fm-te-3": 0,
        "fm-te-4": 3,
        "fm-te-5": -3,
      }),
    );
    expect(left.matches[0]?.id).toBe("left-accelerationism");
    expect(left.matches[0]?.status).toBe("experimental");

    const right = scoreSpecialistModule(
      "technology-governance-module",
      answerMap({
        "fm-te-1": 0,
        "fm-te-2": 0,
        "fm-te-3": 0,
        "fm-te-4": 3,
        "fm-te-5": 3,
      }),
    );
    expect(right.matches[0]?.id).toBe("right-accelerationism");
    expect(right.matches[0]?.status).toBe("experimental");
  });

  it("keeps specialist layer wording aligned with the response contract", () => {
    const questions = specialistModuleDefinitions.flatMap(
      (module) => module.questions,
    );
    const descriptive = questions.filter(
      (question) => question.layer === "descriptive",
    );
    expect(descriptive.length).toBe(6);
    expect(descriptive.every((question) => question.allowDontKnow)).toBe(true);
    expect(descriptive.every((question) => question.confidencePrompt)).toBe(
      true,
    );
    expect(
      descriptive.every((question) => !/\bshould\b/i.test(question.prompt)),
    ).toBe(true);

    const confederalItem = questions.find(
      (question) => question.id === "fm-mm-4",
    );
    expect(confederalItem?.layer).toBe("prescriptive");
    expect(confederalItem?.prompt).toMatch(/should be coordinated/i);
    expect(confederalItem?.prompt).not.toMatch(
      /delegated|recallable|non-sovereign/i,
    );
  });

  it("keeps identity criterion variants distinct without multiplying tradition ids", () => {
    const identity = specialistModuleDefinitions.find(
      (module) => module.id === "identity-sovereignty-module",
    );
    expect(identity).toBeDefined();
    const optionIds =
      identity?.criterionOptions.map((option) => option.id) ?? [];
    expect(optionIds).toContain("black-nationalism:community");
    expect(optionIds).toContain("black-nationalism:separatist");
    expect(optionIds).toContain("indigenism:institutional");
    expect(optionIds).toContain("indigenism:resurgence");
    expect(new Set(optionIds).size).toBe(optionIds.length);
  });
});
