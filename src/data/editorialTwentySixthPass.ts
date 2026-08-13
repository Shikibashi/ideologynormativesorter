import type { AxisWeight, Question } from "../types";

export const EDITORIAL_TWENTY_SIXTH_PASS_VERSION = "2026-08-editorial-v26";
export const EDITORIAL_TWENTY_SIXTH_PASS_DATE = "2026-08-12";

interface ConstructCorrection {
  rationale: string;
  prompt?: string;
  axisWeights: readonly AxisWeight[];
}

/**
 * Removes residual cross-loadings where a sourced descriptive result was being
 * treated as evidence for capture, state capacity, or expertise without the
 * prompt making that institutional claim. The environmental item also corrects
 * a directional overclaim contradicted by the cited EPA/Census evidence.
 */
export const descriptiveConstructCorrectionsById: Readonly<
  Record<string, ConstructCorrection>
> = {
  q0089: {
    prompt:
      "In the U.S. occupations studied, licensing increased wages for licensed workers while reducing employment, with effects varying by occupation and model.",
    rationale:
      "Keep the studied labor-market incidence result without converting it into an unsupported universal claim about incumbent protection or consumer welfare; the item is best aligned with market allocation rather than regulatory capture.",
    axisWeights: [{ axisId: "market-process-confidence", weight: -0.6 }],
  },
  q0108: {
    rationale:
      "The housing evidence concerns supply constraints and price formation. It does not by itself establish zoning-board capture or general administrative competence.",
    axisWeights: [{ axisId: "market-process-confidence", weight: 0.8 }],
  },
  q0127: {
    rationale:
      "The claim is about whether low-cost switching allows competition to discipline issuers. It directly measures market-process confidence, not state competence or public-sector capture.",
    axisWeights: [{ axisId: "market-process-confidence", weight: 1 }],
  },
  q0171: {
    rationale:
      "Persistence safeguards concern the risk that public institutions retain exceptional powers or incentives beyond their original justification; they do not measure routine administrative execution capacity.",
    axisWeights: [{ axisId: "public-choice-skepticism", weight: 1 }],
  },
  q0308: {
    prompt:
      "Environmental regulations can alter competitive conditions when compliance costs vary by establishment or firm size.",
    rationale:
      "The cited EPA/Census evidence reports size-related cost incidence that can run in different directions and, in the paper’s main results, increases with establishment and firm size. Use a neutral competitive-incidence prompt rather than asserting a small-firm penalty or capture mechanism.",
    axisWeights: [{ axisId: "market-process-confidence", weight: -0.4 }],
  },
  q0348: {
    rationale:
      "Limited information acquisition in low-salience settings is a voter-information mechanism. It does not measure expert authority or public-institution capture.",
    axisWeights: [{ axisId: "democratic-confidence", weight: -1 }],
  },
};

export function applyEditorialTwentySixthPass(question: Question): Question {
  if (question.active === false || question.module !== undefined)
    return question;

  const correction = descriptiveConstructCorrectionsById[String(question.id)];
  if (!correction) return question;

  return {
    ...question,
    ...(correction.prompt ? { prompt: correction.prompt } : {}),
    axisWeights: [...correction.axisWeights],
    reviewStatus: "approved",
    version: EDITORIAL_TWENTY_SIXTH_PASS_VERSION,
    updatedAt: EDITORIAL_TWENTY_SIXTH_PASS_DATE,
  };
}
