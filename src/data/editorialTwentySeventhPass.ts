import type { Question } from "../types";

export const EDITORIAL_TWENTY_SEVENTH_PASS_VERSION = "2026-08-editorial-v27";
export const EDITORIAL_TWENTY_SEVENTH_PASS_DATE = "2026-08-13";

interface PrecisionRewrite {
  prompt: string;
  rationale: string;
}

/**
 * Narrows two remaining normative items whose effective wording bundled
 * distinct institutional mechanisms. The axis mappings remain unchanged:
 * these are content-precision corrections, not new psychometric claims.
 */
export const precisionRewritesById: Readonly<Record<string, PrecisionRewrite>> =
  {
    q0085: {
      prompt:
        "Legal barriers that restrict workers’ ability to enter or leave employment can be forms of labor-market coercion.",
      rationale:
        "The previous list combined occupational licensing, immigration controls, and zoning, which have different legal purposes and causal pathways. The revised item isolates the normative claim that legally restricted entry or exit can create coercive dependence without treating those mechanisms as equivalent.",
    },
    q0407: {
      prompt:
        "Productive assets are most legitimate when the people who work with them have a direct governance claim over how they are used.",
      rationale:
        "Ownership and governance are related but distinct institutional arrangements. The revised item isolates worker governance, leaving ownership form, capital provision, management, and performance for separate questions.",
    },
  };

export function applyEditorialTwentySeventhPass(question: Question): Question {
  if (question.active === false || question.module !== undefined)
    return question;

  const rewrite = precisionRewritesById[String(question.id)];
  if (!rewrite) return question;

  return {
    ...question,
    prompt: rewrite.prompt,
    reviewStatus: "approved",
    version: EDITORIAL_TWENTY_SEVENTH_PASS_VERSION,
    updatedAt: EDITORIAL_TWENTY_SEVENTH_PASS_DATE,
  };
}
