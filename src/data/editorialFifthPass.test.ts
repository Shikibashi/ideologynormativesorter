import { describe, expect, it } from "vitest";
import { axes } from "./axes";
import {
  EDITORIAL_FIFTH_PASS_VERSION,
  fifthPassMappingCorrectionsById,
  fifthPassReplacementRequiredById,
  fifthPassWordingCorrectionsById,
} from "./editorialFifthPass";
import {
  EDITORIAL_SEVENTH_PASS_VERSION,
  seventhPassReplacementRequiredById,
  seventhPassRewritesById,
} from "./editorialSeventhPass";
import {
  EDITORIAL_EIGHTH_PASS_VERSION,
  eighthPassReplacementRequiredById,
  eighthPassRewritesById,
} from "./editorialEighthPass";
import {
  EDITORIAL_TENTH_PASS_VERSION,
  tenthPassRewritesById,
} from "./editorialTenthPass";
import {
  EDITORIAL_THIRTEENTH_PASS_VERSION,
  thirteenthPassRewritesById,
} from "./editorialThirteenthPass";
import {
  EDITORIAL_FOURTEENTH_PASS_VERSION,
  fourteenthPassRewritesById,
} from "./editorialFourteenthPass";
import {
  EDITORIAL_FIFTEENTH_PASS_VERSION,
  fifteenthPassRewritesById,
} from "./editorialFifteenthPass";
import {
  EDITORIAL_SIXTEENTH_PASS_VERSION,
  sixteenthPassRewritesById,
} from "./editorialSixteenthPass";
import {
  EDITORIAL_SEVENTEENTH_PASS_VERSION,
  seventeenthPassRewritesById,
} from "./editorialSeventeenthPass";
import {
  EDITORIAL_EIGHTEENTH_PASS_VERSION,
  eighteenthPassRewritesById,
} from "./editorialEighteenthPass";
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
import {
  descriptiveConstructCorrectionsById as v26Corrections,
  EDITORIAL_TWENTY_SIXTH_PASS_VERSION,
} from "./editorialTwentySixthPass";
import {
  EDITORIAL_TWENTY_SEVENTH_PASS_VERSION,
  precisionRewritesById,
} from "./editorialTwentySeventhPass";
import {
  allQuestions,
  QUESTION_BANK_VERSION,
  questionById,
  questionsForTier,
} from "./effectiveQuestions";

const axisIds = new Set(axes.map((axis) => axis.id));

describe("fifth editorial pass", () => {
  it("versions the effective bank and applies every high-confidence mapping correction", () => {
    expect(QUESTION_BANK_VERSION).toContain(EDITORIAL_FIFTH_PASS_VERSION);

    for (const [id, correction] of Object.entries(
      fifthPassMappingCorrectionsById,
    )) {
      const question = questionById.get(id);
      expect(question, `${id} mapping references a missing item`).toBeDefined();
      expect(
        fifthPassReplacementRequiredById[id],
        `${id} cannot be mapped and quarantined together`,
      ).toBeUndefined();
      const seventhRewrite = seventhPassRewritesById[id];
      const seventhReplacement = seventhPassReplacementRequiredById[id];
      const eighthRewrite = eighthPassRewritesById[id];
      const eighthReplacement = eighthPassReplacementRequiredById[id];
      const tenthRewrite = tenthPassRewritesById[id];
      const thirteenthRewrite = thirteenthPassRewritesById[id];
      const fourteenthRewrite = fourteenthPassRewritesById[id];
      const fifteenthRewrite = fifteenthPassRewritesById[id];
      const sixteenthRewrite = sixteenthPassRewritesById[id];
      const seventeenthRewrite = seventeenthPassRewritesById[id];
      const eighteenthRewrite = eighteenthPassRewritesById[id];
      const twentiethRewrite = twentiethPassRewritesById[id];
      const twentySeventhRewrite = precisionRewritesById[id];
      const latestMappedWeights =
        v26Corrections[id]?.axisWeights ??
        descriptiveConstructCorrectionsById[id]?.axisWeights ??
        seventhRewrite?.axisWeights ??
        correction.axisWeights;
      const versionFor = (fallback: string) =>
        twentySeventhRewrite
          ? EDITORIAL_TWENTY_SEVENTH_PASS_VERSION
          : v26Corrections[id]
            ? EDITORIAL_TWENTY_SIXTH_PASS_VERSION
            : descriptiveConstructCorrectionsById[id]
              ? EDITORIAL_TWENTY_FIFTH_PASS_VERSION
              : confidenceCoverageTierPromotions[id]
                ? EDITORIAL_TWENTY_THIRD_PASS_VERSION
                : fallback;
      if (twentySeventhRewrite) {
        expect(question!.active).not.toBe(false);
        expect(question!.axisWeights).toEqual(latestMappedWeights);
        expect(question!.version).toBe(EDITORIAL_TWENTY_SEVENTH_PASS_VERSION);
      } else if (twentiethRewrite) {
        expect(question!.prompt).toBe(twentiethRewrite.prompt);
        expect(question!.active).not.toBe(false);
        expect(question!.axisWeights).toEqual(latestMappedWeights);
        expect(question!.version).toBe(
          versionFor(EDITORIAL_TWENTIETH_PASS_VERSION),
        );
      } else if (eighteenthRewrite) {
        expect(question!.active).not.toBe(false);
        expect(question!.axisWeights).toEqual(latestMappedWeights);
        expect(question!.version).toBe(
          versionFor(EDITORIAL_EIGHTEENTH_PASS_VERSION),
        );
      } else if (seventeenthRewrite) {
        expect(question!.active).not.toBe(false);
        expect(question!.axisWeights).toEqual(latestMappedWeights);
        expect(question!.version).toBe(
          versionFor(EDITORIAL_SEVENTEENTH_PASS_VERSION),
        );
      } else if (sixteenthRewrite) {
        expect(question!.active).not.toBe(false);
        expect(question!.axisWeights).toEqual(latestMappedWeights);
        expect(question!.version).toBe(
          versionFor(EDITORIAL_SIXTEENTH_PASS_VERSION),
        );
      } else if (fifteenthRewrite) {
        expect(question!.active).not.toBe(false);
        expect(question!.axisWeights).toEqual(latestMappedWeights);
        expect(question!.version).toBe(
          versionFor(EDITORIAL_FIFTEENTH_PASS_VERSION),
        );
      } else if (fourteenthRewrite) {
        expect(question!.active).not.toBe(false);
        expect(question!.axisWeights).toEqual(latestMappedWeights);
        expect(question!.version).toBe(
          versionFor(EDITORIAL_FOURTEENTH_PASS_VERSION),
        );
      } else if (thirteenthRewrite) {
        expect(question!.active).not.toBe(false);
        expect(question!.axisWeights).toEqual(latestMappedWeights);
        expect(question!.version).toBe(
          versionFor(EDITORIAL_THIRTEENTH_PASS_VERSION),
        );
      } else if (eighthReplacement) {
        expect(question!.active).toBe(false);
        expect(question!.version).toBe(
          versionFor(EDITORIAL_EIGHTH_PASS_VERSION),
        );
      } else if (eighthRewrite) {
        expect(question!.active).not.toBe(false);
        expect(question!.axisWeights).toEqual(eighthRewrite.axisWeights);
        expect(question!.version).toBe(EDITORIAL_EIGHTH_PASS_VERSION);
      } else if (seventhReplacement) {
        expect(question!.active).toBe(false);
        expect(question!.version).toBe(
          versionFor(EDITORIAL_SEVENTH_PASS_VERSION),
        );
      } else if (seventhRewrite) {
        expect(question!.active).not.toBe(false);
        expect(question!.axisWeights).toEqual(seventhRewrite.axisWeights);
        expect(question!.version).toBe(EDITORIAL_SEVENTH_PASS_VERSION);
      } else if (tenthRewrite) {
        expect(
          question!.active,
          `${id} mapping references an inactive item`,
        ).not.toBe(false);
        expect(question!.axisWeights).toEqual(latestMappedWeights);
        expect(question!.version).toBe(
          versionFor(EDITORIAL_TENTH_PASS_VERSION),
        );
      } else {
        expect(
          question!.active,
          `${id} mapping references an inactive item`,
        ).not.toBe(false);
        expect(question!.axisWeights).toEqual(latestMappedWeights);
        expect(question!.version).toBe(
          versionFor(EDITORIAL_FIFTH_PASS_VERSION),
        );
      }
      expect(correction.rationale.length).toBeGreaterThan(20);

      const seen = new Set<string>();
      for (const axisWeight of correction.axisWeights) {
        expect(
          axisIds.has(axisWeight.axisId),
          `${id} references unknown axis ${axisWeight.axisId}`,
        ).toBe(true);
        expect(
          seen.has(axisWeight.axisId),
          `${id} repeats axis ${axisWeight.axisId}`,
        ).toBe(false);
        expect(
          Math.abs(axisWeight.weight),
          `${id}/${axisWeight.axisId} has invalid weight`,
        ).toBeLessThanOrEqual(1);
        seen.add(axisWeight.axisId);
      }
    }
  });

  it("applies every wording correction without changing layer or response type", () => {
    for (const [id, correction] of Object.entries(
      fifthPassWordingCorrectionsById,
    )) {
      const question = questionById.get(id);
      expect(question, `${id} wording references a missing item`).toBeDefined();
      expect(
        fifthPassReplacementRequiredById[id],
        `${id} cannot be rewritten and quarantined together`,
      ).toBeUndefined();
      const seventhRewrite = seventhPassRewritesById[id];
      const seventhReplacement = seventhPassReplacementRequiredById[id];
      const eighthRewrite = eighthPassRewritesById[id];
      const eighthReplacement = eighthPassReplacementRequiredById[id];
      const tenthRewrite = tenthPassRewritesById[id];
      const thirteenthRewrite = thirteenthPassRewritesById[id];
      const fourteenthRewrite = fourteenthPassRewritesById[id];
      const fifteenthRewrite = fifteenthPassRewritesById[id];
      const sixteenthRewrite = sixteenthPassRewritesById[id];
      const seventeenthRewrite = seventeenthPassRewritesById[id];
      const eighteenthRewrite = eighteenthPassRewritesById[id];
      const twentiethRewrite = twentiethPassRewritesById[id];
      const twentySeventhRewrite = precisionRewritesById[id];
      const versionFor = (fallback: string) =>
        v26Corrections[id]
          ? EDITORIAL_TWENTY_SIXTH_PASS_VERSION
          : descriptiveConstructCorrectionsById[id]
            ? EDITORIAL_TWENTY_FIFTH_PASS_VERSION
            : confidenceCoverageTierPromotions[id]
              ? EDITORIAL_TWENTY_THIRD_PASS_VERSION
              : fallback;
      if (twentySeventhRewrite) {
        expect(question!.prompt).toBe(twentySeventhRewrite.prompt);
        expect(question!.active).not.toBe(false);
        expect(question!.version).toBe(EDITORIAL_TWENTY_SEVENTH_PASS_VERSION);
      } else if (twentiethRewrite) {
        expect(question!.prompt).toBe(twentiethRewrite.prompt);
        expect(question!.active).not.toBe(false);
        expect(question!.version).toBe(
          versionFor(EDITORIAL_TWENTIETH_PASS_VERSION),
        );
      } else if (eighteenthRewrite) {
        expect(question!.prompt).toBe(
          v26Corrections[id]?.prompt ?? eighteenthRewrite.prompt,
        );
        expect(question!.active).not.toBe(false);
        expect(question!.version).toBe(
          versionFor(EDITORIAL_EIGHTEENTH_PASS_VERSION),
        );
      } else if (seventeenthRewrite) {
        expect(question!.prompt).toBe(
          v26Corrections[id]?.prompt ?? seventeenthRewrite.prompt,
        );
        expect(question!.active).not.toBe(false);
        expect(question!.version).toBe(
          versionFor(EDITORIAL_SEVENTEENTH_PASS_VERSION),
        );
      } else if (sixteenthRewrite) {
        expect(question!.prompt).toBe(sixteenthRewrite.prompt);
        expect(question!.active).not.toBe(false);
        expect(question!.version).toBe(
          versionFor(EDITORIAL_SIXTEENTH_PASS_VERSION),
        );
      } else if (fifteenthRewrite) {
        expect(question!.prompt).toBe(fifteenthRewrite.prompt);
        expect(question!.active).not.toBe(false);
        expect(question!.version).toBe(
          versionFor(EDITORIAL_FIFTEENTH_PASS_VERSION),
        );
      } else if (fourteenthRewrite) {
        expect(question!.prompt).toBe(fourteenthRewrite.prompt);
        expect(question!.active).not.toBe(false);
        expect(question!.version).toBe(
          versionFor(EDITORIAL_FOURTEENTH_PASS_VERSION),
        );
      } else if (thirteenthRewrite) {
        expect(question!.prompt).toBe(thirteenthRewrite.prompt);
        expect(question!.active).not.toBe(false);
        expect(question!.version).toBe(
          versionFor(EDITORIAL_THIRTEENTH_PASS_VERSION),
        );
      } else if (eighthReplacement) {
        expect(question!.active).toBe(false);
        expect(question!.version).toBe(EDITORIAL_EIGHTH_PASS_VERSION);
      } else if (eighthRewrite) {
        expect(question!.prompt).toBe(eighthRewrite.prompt);
        expect(question!.active).not.toBe(false);
        expect(question!.version).toBe(EDITORIAL_EIGHTH_PASS_VERSION);
      } else if (seventhReplacement) {
        expect(question!.active).toBe(false);
        expect(question!.version).toBe(
          versionFor(EDITORIAL_SEVENTH_PASS_VERSION),
        );
      } else if (seventhRewrite) {
        expect(question!.prompt).toBe(seventhRewrite.prompt);
        expect(question!.active).not.toBe(false);
        expect(question!.version).toBe(EDITORIAL_SEVENTH_PASS_VERSION);
      } else if (tenthRewrite) {
        expect(question!.prompt).toBe(tenthRewrite.prompt);
        expect(question!.active).not.toBe(false);
        expect(question!.version).toBe(
          versionFor(EDITORIAL_TENTH_PASS_VERSION),
        );
      } else {
        expect(question!.prompt).toBe(correction.prompt);
        expect(question!.active).not.toBe(false);
        expect(question!.version).toBe(
          versionFor(EDITORIAL_FIFTH_PASS_VERSION),
        );
      }
      expect(correction.rationale.length).toBeGreaterThan(20);
    }
  });

  it("quarantines items that require a split, new construct, or redesigned choice set", () => {
    for (const [id, finding] of Object.entries(
      fifthPassReplacementRequiredById,
    )) {
      const question = questionById.get(id);
      expect(
        question,
        `${id} quarantine references a missing item`,
      ).toBeDefined();
      expect(
        fifthPassMappingCorrectionsById[id],
        `${id} cannot be quarantined and remapped together`,
      ).toBeUndefined();
      expect(
        fifthPassWordingCorrectionsById[id],
        `${id} cannot be quarantined and rewritten together`,
      ).toBeUndefined();
      const eighthRewrite = eighthPassRewritesById[id];
      if (eighthRewrite) {
        expect(question!.active).toBe(true);
        expect(question!.reviewStatus).toBe("approved");
        expect(question!.version).toBe(
          confidenceCoverageTierPromotions[id]
            ? EDITORIAL_TWENTY_THIRD_PASS_VERSION
            : EDITORIAL_EIGHTH_PASS_VERSION,
        );
        expect(question!.prompt).toBe(eighthRewrite.prompt);
        expect(question!.axisWeights).toEqual(eighthRewrite.axisWeights);
      } else {
        expect(question!.active).toBe(false);
        expect(question!.reviewStatus).toBe("needs-rewrite");
        expect(question!.version).toBe(
          confidenceCoverageTierPromotions[id]
            ? EDITORIAL_TWENTY_THIRD_PASS_VERSION
            : EDITORIAL_FIFTH_PASS_VERSION,
        );
        expect(
          questionsForTier(question!.tier).some((item) => item.id === id),
        ).toBe(false);
      }
      expect(finding.rationale.length).toBeGreaterThan(20);
      expect(finding.proposedReplacement.length).toBeGreaterThan(20);
    }
  });

  it("keeps every active question mapped only to axes in its own layer", () => {
    const layerByAxis = new Map(axes.map((axis) => [axis.id, axis.layer]));
    for (const question of allQuestions.filter(
      (item) => item.active !== false,
    )) {
      for (const axisWeight of question.axisWeights) {
        expect(
          layerByAxis.get(axisWeight.axisId),
          `${question.id}/${axisWeight.axisId}`,
        ).toBe(question.layer);
      }
    }
  });
});
