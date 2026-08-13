import { describe, expect, it } from "vitest";
import type { AnswerMap, IdeologyLabel } from "../types";
import { axes } from "../data/axes";
import {
  modifierScoringLabels,
  primaryScoringLabels,
  publicCatalogLabels,
} from "../data/labelTaxonomy";
import { questions } from "../data/effectiveQuestions";
import { buildResultProfile } from "./index";
import { computeDirectModifierMatches } from "./modifierConstructMatch";

function answer(questionId: string, value = 3): AnswerMap[string] {
  return { questionId, value };
}

const civilLibertarian = modifierScoringLabels.find(
  (label) => label.id === "civil-libertarianism",
)!;
const catalogOnlyPopulism = publicCatalogLabels.find(
  (label) => label.id === "populism",
)!;

const civilLibertiesAnswers: AnswerMap = {
  q0161: answer("q0161"),
  q0164: answer("q0164"),
  q0173: answer("q0173"),
};

describe("direct modifier construct matching", () => {
  it("returns a modifier only from its declared direct indicators", () => {
    const matches = computeDirectModifierMatches(
      questions,
      civilLibertiesAnswers,
      [civilLibertarian],
    );

    expect(matches).toHaveLength(1);
    expect(matches[0]).toMatchObject({
      labelId: "civil-libertarianism",
      fit: 1,
      evidenceStrength: 1,
      measuredAxisCount: 3,
      totalAxisCount: 3,
      uncertaintyBand: "low",
      modifierConstruct: {
        name: "Civil-liberties constraint",
        answeredQuestionIds: ["q0161", "q0164", "q0173"],
        indicatorQuestionIds: ["q0161", "q0164", "q0173"],
        minimumAnsweredItems: 2,
      },
    });
  });

  it("does not let unrelated primary-profile answers alter a direct modifier match", () => {
    const baseline = computeDirectModifierMatches(
      questions,
      civilLibertiesAnswers,
      [civilLibertarian],
    );
    const withUnrelatedAnswer = computeDirectModifierMatches(
      questions,
      { ...civilLibertiesAnswers, q0001: answer("q0001", -3) },
      [civilLibertarian],
    );

    expect(withUnrelatedAnswer).toEqual(baseline);
  });

  it("abstains below the direct-coverage minimum even when the one answered indicator is an exact fit", () => {
    expect(
      computeDirectModifierMatches(questions, { q0161: answer("q0161") }, [
        civilLibertarian,
      ]),
    ).toEqual([]);
  });

  it("cannot promote a catalog-only modifier through a full ideology centroid", () => {
    expect(
      computeDirectModifierMatches(questions, civilLibertiesAnswers, [
        catalogOnlyPopulism,
      ]),
    ).toEqual([]);
  });

  it("uses the direct matcher on the ordinary result path", () => {
    const result = buildResultProfile(
      questions,
      civilLibertiesAnswers,
      axes,
      primaryScoringLabels,
      [civilLibertarian, catalogOnlyPopulism] as IdeologyLabel[],
    );

    const modifierMatches = result.modifierMatches ?? [];
    expect(modifierMatches).toHaveLength(1);
    expect(modifierMatches[0]?.labelId).toBe("civil-libertarianism");
    expect(modifierMatches[0]?.modifierConstruct?.name).toBe(
      "Civil-liberties constraint",
    );
  });
});
