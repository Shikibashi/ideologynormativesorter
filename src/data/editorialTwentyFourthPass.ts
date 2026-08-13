import type { AxisWeight, Question } from "../types";

export const EDITORIAL_TWENTY_FOURTH_PASS_VERSION = "2026-08-editorial-v24";
export const EDITORIAL_TWENTY_FOURTH_PASS_DATE = "2026-08-12";

interface BoundaryRewrite {
  prompt: string;
  rationale: string;
  axisWeights?: readonly AxisWeight[];
}

/**
 * Separates adjacent identity and religion constructs that were previously
 * compressed into broad contrasts. The edits preserve the layer and question
 * IDs while making the intended construct explicit.
 */
export const boundaryRewritesById: Readonly<Record<string, BoundaryRewrite>> = {
  q0405: {
    prompt:
      "Religious tradition may legitimately inform public law even when some citizens do not share it.",
    rationale:
      "Replace “shared religious heritage” with the more precise claim about religious tradition informing coercive law; heritage, doctrinal authority, and public-law legitimacy are related but not identical constructs.",
  },
  q0415: {
    prompt:
      "A nation’s political membership should be defined by shared citizenship and institutions rather than ancestry.",
    rationale:
      "Remove the compound comparison between civic, ethnic, and religious identity. The item now measures civic membership versus ancestry, while the neighboring religion-and-law items cover the separate religious-authority construct.",
    axisWeights: [{ axisId: "political-community-boundary", weight: 0.8 }],
  },
};

export function applyEditorialTwentyFourthPass(question: Question): Question {
  if (question.active === false || question.module !== undefined)
    return question;

  const rewrite = boundaryRewritesById[String(question.id)];
  if (!rewrite) return question;

  return {
    ...question,
    prompt: rewrite.prompt,
    ...(rewrite.axisWeights ? { axisWeights: [...rewrite.axisWeights] } : {}),
    reviewStatus: "approved",
    version: EDITORIAL_TWENTY_FOURTH_PASS_VERSION,
    updatedAt: EDITORIAL_TWENTY_FOURTH_PASS_DATE,
  };
}
