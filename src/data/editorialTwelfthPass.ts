import type { Question, QuestionSource } from "../types";
import { questionContextSources } from "./questionContext";

export const EDITORIAL_TWELFTH_PASS_VERSION = "2026-08-editorial-v12";
export const EDITORIAL_TWELFTH_PASS_DATE = "2026-08-12";

export interface TwelfthPassRewrite {
  prompt: string;
  rationale: string;
  evidenceNote: string;
  sourceIds: readonly string[];
}

/**
 * This pass corrects one descriptive item whose prior wording turned
 * heterogeneous target-group evidence into a universal-sounding comparison.
 * It changes no layer, response type, or score mapping.
 */
export const twelfthPassRewritesById: Readonly<
  Record<string, TwelfthPassRewrite>
> = {
  q0207: {
    prompt:
      "In randomized intergroup-contact studies with outcomes measured at least one day later, most comparisons reported lower measured prejudice, but effect sizes varied by target group and evidence for durable reductions in adults’ racial or ethnic prejudice was limited.",
    rationale:
      "Keep the review’s qualified positive average while specifying random assignment and delayed outcomes; remove the unsupported implication that religious and immigrant targets uniformly showed weaker effects and surface the review’s adult racial/ethnic evidence gap.",
    evidenceNote:
      "Scope to the 27 randomized intergroup-contact experiments in the review with outcomes measured at least one day after the intervention began: most comparisons reported positive effects, but effects varied significantly by target group, larger studies tended to show weaker effects, and the evidence did not include interracial contact effects on adults over 25. This is evidence about a defined, policy-relevant research subset, not a guarantee that contact will reduce prejudice in every setting.",
    sourceIds: ["intergroupContactUpdated", "intergroupContactMetaAnalysis"],
  },
};

function sourcesFor(sourceIds: readonly string[]): QuestionSource[] {
  return sourceIds
    .map((sourceId) => questionContextSources[sourceId])
    .filter((source): source is QuestionSource => source !== undefined)
    .map((source) => ({ ...source }));
}

export function applyEditorialTwelfthPass(question: Question): Question {
  if (question.active === false || question.module !== undefined)
    return question;

  const rewrite = twelfthPassRewritesById[String(question.id)];
  if (!rewrite) return question;

  return {
    ...question,
    prompt: rewrite.prompt,
    evidenceNote: rewrite.evidenceNote,
    sources: sourcesFor(rewrite.sourceIds),
    active: true,
    reviewStatus: "approved",
    version: EDITORIAL_TWELFTH_PASS_VERSION,
    updatedAt: EDITORIAL_TWELFTH_PASS_DATE,
    deprecationReason: undefined,
  };
}
