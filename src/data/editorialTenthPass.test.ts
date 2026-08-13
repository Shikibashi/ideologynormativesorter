import { describe, expect, it } from "vitest";
import {
  coreQuestions,
  QUESTION_BANK_VERSION,
  questionById,
} from "./effectiveQuestions";
import {
  EDITORIAL_TENTH_PASS_VERSION,
  tenthPassRewritesById,
} from "./editorialTenthPass";
import {
  EDITORIAL_FOURTEENTH_PASS_VERSION,
  fourteenthPassRewritesById,
} from "./editorialFourteenthPass";
import {
  EDITORIAL_TWENTIETH_PASS_VERSION,
  twentiethPassRewritesById,
} from "./editorialTwentiethPass";
import {
  confidenceCoverageTierPromotions,
  EDITORIAL_TWENTY_THIRD_PASS_VERSION,
} from "./editorialTwentyThirdPass";
import {
  descriptiveConstructCorrectionsById,
  EDITORIAL_TWENTY_FIFTH_PASS_VERSION,
} from "./editorialTwentyFifthPass";

describe("tenth editorial pass", () => {
  it("separates the live religion/public-law duplicate without changing score fields", () => {
    expect(QUESTION_BANK_VERSION).toContain(EDITORIAL_TENTH_PASS_VERSION);
    expect(Object.keys(tenthPassRewritesById)).toEqual([
      "q0242",
      "q0406",
      "q0248",
      "q0328",
      "q0350",
      "q0368",
    ]);

    const q0242 = questionById.get("q0242")!;
    const q0406 = questionById.get("q0406")!;
    const q0248 = questionById.get("q0248")!;
    const q0328 = questionById.get("q0328")!;
    const q0350 = questionById.get("q0350")!;
    const q0368 = questionById.get("q0368")!;
    expect(q0242.active).toBe(true);
    expect(q0406.active).toBe(true);
    expect(q0242.version).toBe(EDITORIAL_TENTH_PASS_VERSION);
    expect(q0406.version).toBe(EDITORIAL_TENTH_PASS_VERSION);
    expect(q0242.reviewStatus).toBe("approved");
    expect(q0406.reviewStatus).toBe("approved");
    expect(q0242.prompt).toBe(tenthPassRewritesById.q0242.prompt);
    expect(q0406.prompt).toBe(tenthPassRewritesById.q0406.prompt);
    expect(q0248.prompt).toBe(
      fourteenthPassRewritesById.q0248?.prompt ??
        tenthPassRewritesById.q0248.prompt,
    );
    expect(q0328.prompt).toBe(twentiethPassRewritesById.q0328.prompt);
    expect(q0350.prompt).toBe(tenthPassRewritesById.q0350.prompt);
    expect(q0368.prompt).toBe(
      fourteenthPassRewritesById.q0368?.prompt ??
        tenthPassRewritesById.q0368.prompt,
    );
    for (const question of [q0248, q0328, q0350, q0368]) {
      expect(question.active).toBe(true);
      expect(question.version).toBe(
        descriptiveConstructCorrectionsById[String(question.id)]
          ? EDITORIAL_TWENTY_FIFTH_PASS_VERSION
          : confidenceCoverageTierPromotions[String(question.id)]
            ? EDITORIAL_TWENTY_THIRD_PASS_VERSION
            : twentiethPassRewritesById[String(question.id)]
              ? EDITORIAL_TWENTIETH_PASS_VERSION
              : fourteenthPassRewritesById[String(question.id)]
                ? EDITORIAL_FOURTEENTH_PASS_VERSION
                : EDITORIAL_TENTH_PASS_VERSION,
      );
      expect(question.reviewStatus).toBe("approved");
    }
    expect(q0242.prompt).not.toBe(q0406.prompt);
    expect(q0242.contextNote).toContain("justificatory standard");
    expect(q0406.contextNote).toContain("final legal authority");
    expect(q0242.sources?.map((source) => source.title)).toEqual([
      "Religion and Political Theory",
      "International Covenant on Civil and Political Rights",
    ]);
    expect(q0406.sources?.map((source) => source.title)).toEqual([
      "Constitutional Interpretation and Constitutionalism in the Arab World",
      "International Covenant on Civil and Political Rights",
    ]);
    expect(q0242.axisWeights).toEqual([
      { axisId: "moral-traditionalism", weight: -1 },
      { axisId: "authority-legitimacy", weight: -0.8 },
      { axisId: "liberty-noninterference", weight: 0.3 },
      { axisId: "secularism-religious", weight: -0.8 },
    ]);
    expect(q0406.axisWeights).toEqual([
      { axisId: "secularism-religious", weight: -1 },
      { axisId: "liberty-noninterference", weight: 0.4 },
      { axisId: "authority-legitimacy", weight: -0.3 },
    ]);
  });

  it("does not change the active-bank cardinality or reactivate quarantined findings", () => {
    expect(
      coreQuestions.filter((question) => question.active !== false),
    ).toHaveLength(338);
    for (const id of ["q0410", "q0238", "q0298"]) {
      expect(questionById.get(id)?.active, `${id} remains quarantined`).toBe(
        false,
      );
    }
  });
});
