import type { Question, QuestionSource } from "../types";
import { questionContextSources } from "./questionContext";

export const EDITORIAL_THIRTEENTH_PASS_VERSION = "2026-08-editorial-v13";
export const EDITORIAL_THIRTEENTH_PASS_DATE = "2026-08-12";

export interface ThirteenthPassRewrite {
  prompt: string;
  rationale: string;
  evidenceNote: string;
  sourceIds: readonly string[];
}

/**
 * This pass narrows three high-risk active items after source review:
 * worker status versus organizational form, a shared civil-liberty default,
 * and pressure in plea bargaining. It preserves each item's layer, response
 * type, and score mapping while making the evidence boundary visible.
 */
export const thirteenthPassRewritesById: Readonly<
  Record<string, ThirteenthPassRewrite>
> = {
  q0093: {
    prompt:
      "An ideal labor regime would extend basic legal protection to workers regardless of whether they are classified as employees, independent contractors, or members of a worker cooperative.",
    rationale:
      "Separate worker-status classifications from unions and partnerships, which are collective or firm-level institutions rather than parallel employment statuses. The ILO supports protecting workers across contractual arrangements while preserving distinctions in legal status and bargaining institutions.",
    evidenceNote:
      "Scope to the ILO distinction among employees, self-employed workers, and workers in cooperatives: compare whether workers receive the protection due under the facts of the work relationship, including where contractual labels may disguise dependence. Equal baseline protection does not mean identical rules for every contract, equal bargaining power, or that unions and partnerships are employment-status categories.",
    sourceIds: [
      "employmentRelationship",
      "cooperativesWorkRights",
      "labourRights",
    ],
  },
  q0173: {
    prompt:
      "An ideal rights regime would protect core civil liberties by default, requiring any restriction on expression, association, religion, encryption, or due process to satisfy a specific, publicly justified legal test.",
    rationale:
      "Turn the list of rights into one coherent default-protection principle and state that restrictions require justification. The ICCPR supplies the legal-rights frame, while cryptographic standards provide the narrower technical context for encryption; the item does not claim that all five examples share one limitation test.",
    evidenceNote:
      "Read this as a normative standard for default protection and publicly justified limits, not as a claim that expression, association, religion, encryption, and due process have identical legal rules. The ICCPR recognizes several civil and political rights and lawful limitation or emergency frameworks; encryption is a technical protection whose security properties and policy limits require separate analysis.",
    sourceIds: ["civilPoliticalRights", "cryptography", "liberalism"],
  },
  q0191: {
    prompt:
      "In plea-bargaining systems, the prospect of a substantially harsher outcome after trial can pressure some defendants—including some who maintain innocence—to accept a plea, although the size and direction of the effect vary by case and are difficult to estimate.",
    rationale:
      "Replace the universal-sounding claim about innocent or overcharged defendants surrendering trial rights with a scoped pressure mechanism. Empirical research supports concern about innocent pleas in some settings but also finds an innocence effect and substantial selection limits, so the item should not imply that most pleas are false or that every plea/trial gap is coercive.",
    evidenceNote:
      "Scope to empirical plea-bargaining research: experimental and observational studies identify cases in which defendants who maintain innocence accept pleas or in which plea/trial selection is associated with miscarriage-of-justice concerns, while other work finds innocent defendants can reject offers attractive to similarly situated guilty defendants. Factual innocence and counterfactual trial outcomes are difficult to observe, and the strongest real-case estimates are jurisdiction-specific; this is not a claim about a universal coercion rate.",
    sourceIds: ["pleaInnocenceEffect", "pleaMiscarriageJustice"],
  },
};

function sourcesFor(sourceIds: readonly string[]): QuestionSource[] {
  return sourceIds
    .map((sourceId) => questionContextSources[sourceId])
    .filter((source): source is QuestionSource => source !== undefined)
    .map((source) => ({ ...source }));
}

export function applyEditorialThirteenthPass(question: Question): Question {
  if (question.active === false || question.module !== undefined)
    return question;

  const rewrite = thirteenthPassRewritesById[String(question.id)];
  if (!rewrite) return question;

  return {
    ...question,
    prompt: rewrite.prompt,
    evidenceNote: rewrite.evidenceNote,
    sources: sourcesFor(rewrite.sourceIds),
    active: true,
    reviewStatus: "approved",
    version: EDITORIAL_THIRTEENTH_PASS_VERSION,
    updatedAt: EDITORIAL_THIRTEENTH_PASS_DATE,
    deprecationReason: undefined,
  };
}
