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
import { questionPromptAfterReview } from "./questionPromptReview";

const axisIds = new Set(axes.map((axis) => axis.id));

function effectiveVersionFor(id: string, fallback: string): string {
  return precisionRewritesById[id]
    ? EDITORIAL_TWENTY_SEVENTH_PASS_VERSION
    : v26Corrections[id]
      ? EDITORIAL_TWENTY_SIXTH_PASS_VERSION
      : descriptiveConstructCorrectionsById[id]
        ? EDITORIAL_TWENTY_FIFTH_PASS_VERSION
        : confidenceCoverageTierPromotions[id]
          ? EDITORIAL_TWENTY_THIRD_PASS_VERSION
          : fallback;
}

function expectedWordingPrompt(
  id: string,
  fallback: string,
): string | undefined {
  const precisionRewrite = precisionRewritesById[id];
  const twentiethRewrite = twentiethPassRewritesById[id];
  const eighteenthRewrite = eighteenthPassRewritesById[id];
  const seventeenthRewrite = seventeenthPassRewritesById[id];
  const sixteenthRewrite = sixteenthPassRewritesById[id];
  const fifteenthRewrite = fifteenthPassRewritesById[id];
  const fourteenthRewrite = fourteenthPassRewritesById[id];
  const thirteenthRewrite = thirteenthPassRewritesById[id];
  const eighthRewrite = eighthPassRewritesById[id];
  const seventhRewrite = seventhPassRewritesById[id];
  const tenthRewrite = tenthPassRewritesById[id];

  if (precisionRewrite)
    return questionPromptAfterReview(id, precisionRewrite.prompt);
  if (twentiethRewrite)
    return questionPromptAfterReview(id, twentiethRewrite.prompt);
  if (eighteenthRewrite)
    return questionPromptAfterReview(
      id,
      v26Corrections[id]?.prompt ?? eighteenthRewrite.prompt,
    );
  if (seventeenthRewrite)
    return questionPromptAfterReview(
      id,
      v26Corrections[id]?.prompt ?? seventeenthRewrite.prompt,
    );
  if (sixteenthRewrite)
    return questionPromptAfterReview(id, sixteenthRewrite.prompt);
  if (fifteenthRewrite)
    return questionPromptAfterReview(id, fifteenthRewrite.prompt);
  if (fourteenthRewrite)
    return questionPromptAfterReview(id, fourteenthRewrite.prompt);
  if (thirteenthRewrite)
    return questionPromptAfterReview(id, thirteenthRewrite.prompt);
  if (eighthPassReplacementRequiredById[id]) return undefined;
  if (eighthRewrite) return questionPromptAfterReview(id, eighthRewrite.prompt);
  if (seventhPassReplacementRequiredById[id]) return undefined;
  if (seventhRewrite)
    return questionPromptAfterReview(id, seventhRewrite.prompt);
  if (tenthRewrite) return questionPromptAfterReview(id, tenthRewrite.prompt);
  return questionPromptAfterReview(id, fallback);
}

function expectedWordingVersion(id: string): string {
  if (precisionRewritesById[id]) return EDITORIAL_TWENTY_SEVENTH_PASS_VERSION;
  if (twentiethPassRewritesById[id])
    return effectiveVersionFor(id, EDITORIAL_TWENTIETH_PASS_VERSION);
  if (eighteenthPassRewritesById[id])
    return effectiveVersionFor(id, EDITORIAL_EIGHTEENTH_PASS_VERSION);
  if (seventeenthPassRewritesById[id])
    return effectiveVersionFor(id, EDITORIAL_SEVENTEENTH_PASS_VERSION);
  if (sixteenthPassRewritesById[id])
    return effectiveVersionFor(id, EDITORIAL_SIXTEENTH_PASS_VERSION);
  if (fifteenthPassRewritesById[id])
    return effectiveVersionFor(id, EDITORIAL_FIFTEENTH_PASS_VERSION);
  if (fourteenthPassRewritesById[id])
    return effectiveVersionFor(id, EDITORIAL_FOURTEENTH_PASS_VERSION);
  if (thirteenthPassRewritesById[id])
    return effectiveVersionFor(id, EDITORIAL_THIRTEENTH_PASS_VERSION);
  if (eighthPassReplacementRequiredById[id] || eighthPassRewritesById[id])
    return EDITORIAL_EIGHTH_PASS_VERSION;
  if (seventhPassReplacementRequiredById[id])
    return effectiveVersionFor(id, EDITORIAL_SEVENTH_PASS_VERSION);
  if (seventhPassRewritesById[id]) return EDITORIAL_SEVENTH_PASS_VERSION;
  if (tenthPassRewritesById[id])
    return effectiveVersionFor(id, EDITORIAL_TENTH_PASS_VERSION);
  return effectiveVersionFor(id, EDITORIAL_FIFTH_PASS_VERSION);
}

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
      if (twentySeventhRewrite) {
        expect(question!.active).not.toBe(false);
        expect(question!.axisWeights).toEqual(latestMappedWeights);
        expect(question!.version).toBe(EDITORIAL_TWENTY_SEVENTH_PASS_VERSION);
      } else if (twentiethRewrite) {
        expect(question!.active).not.toBe(false);
        expect(question!.axisWeights).toEqual(latestMappedWeights);
        expect(question!.version).toBe(
          effectiveVersionFor(id, EDITORIAL_TWENTIETH_PASS_VERSION),
        );
      } else if (eighteenthRewrite) {
        expect(question!.active).not.toBe(false);
        expect(question!.axisWeights).toEqual(latestMappedWeights);
        expect(question!.version).toBe(
          effectiveVersionFor(id, EDITORIAL_EIGHTEENTH_PASS_VERSION),
        );
      } else if (seventeenthRewrite) {
        expect(question!.active).not.toBe(false);
        expect(question!.axisWeights).toEqual(latestMappedWeights);
        expect(question!.version).toBe(
          effectiveVersionFor(id, EDITORIAL_SEVENTEENTH_PASS_VERSION),
        );
      } else if (sixteenthRewrite) {
        expect(question!.active).not.toBe(false);
        expect(question!.axisWeights).toEqual(latestMappedWeights);
        expect(question!.version).toBe(
          effectiveVersionFor(id, EDITORIAL_SIXTEENTH_PASS_VERSION),
        );
      } else if (fifteenthRewrite) {
        expect(question!.active).not.toBe(false);
        expect(question!.axisWeights).toEqual(latestMappedWeights);
        expect(question!.version).toBe(
          effectiveVersionFor(id, EDITORIAL_FIFTEENTH_PASS_VERSION),
        );
      } else if (fourteenthRewrite) {
        expect(question!.active).not.toBe(false);
        expect(question!.axisWeights).toEqual(latestMappedWeights);
        expect(question!.version).toBe(
          effectiveVersionFor(id, EDITORIAL_FOURTEENTH_PASS_VERSION),
        );
      } else if (thirteenthRewrite) {
        expect(question!.active).not.toBe(false);
        expect(question!.axisWeights).toEqual(latestMappedWeights);
        expect(question!.version).toBe(
          effectiveVersionFor(id, EDITORIAL_THIRTEENTH_PASS_VERSION),
        );
      } else if (eighthReplacement) {
        expect(question!.active).toBe(false);
        expect(question!.version).toBe(
          effectiveVersionFor(id, EDITORIAL_EIGHTH_PASS_VERSION),
        );
      } else if (eighthRewrite) {
        expect(question!.active).not.toBe(false);
        expect(question!.axisWeights).toEqual(eighthRewrite.axisWeights);
        expect(question!.version).toBe(EDITORIAL_EIGHTH_PASS_VERSION);
      } else if (seventhReplacement) {
        expect(question!.active).toBe(false);
        expect(question!.version).toBe(
          effectiveVersionFor(id, EDITORIAL_SEVENTH_PASS_VERSION),
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
          effectiveVersionFor(id, EDITORIAL_TENTH_PASS_VERSION),
        );
      } else {
        expect(
          question!.active,
          `${id} mapping references an inactive item`,
        ).not.toBe(false);
        expect(question!.axisWeights).toEqual(latestMappedWeights);
        expect(question!.version).toBe(
          effectiveVersionFor(id, EDITORIAL_FIFTH_PASS_VERSION),
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
      const seventhReplacement = seventhPassReplacementRequiredById[id];
      const eighthReplacement = eighthPassReplacementRequiredById[id];
      const expectedPrompt = expectedWordingPrompt(id, correction.prompt);
      if (expectedPrompt) expect(question!.prompt).toBe(expectedPrompt);
      expect(question!.active === false).toBe(
        Boolean(seventhReplacement || eighthReplacement),
      );
      expect(question!.version).toBe(expectedWordingVersion(id));
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
        expect(question!.prompt).toBe(
          questionPromptAfterReview(id, eighthRewrite.prompt),
        );
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
