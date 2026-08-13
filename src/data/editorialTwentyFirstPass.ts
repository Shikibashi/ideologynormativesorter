import type { Question, QuestionSource } from "../types";
import { questionContextSources } from "./questionContext";

export const EDITORIAL_TWENTY_FIRST_PASS_VERSION = "2026-08-editorial-v21";
export const EDITORIAL_TWENTY_FIRST_PASS_DATE = "2026-08-12";

export interface TwentyFirstPassRewrite {
  prompt: string;
  rationale: string;
  evidenceNote: string;
  sourceIds: readonly string[];
}

/**
 * This pass replaces loaded shorthand in three prescriptive items with
 * source-matched institutional choices. The raw IDs and scoring axes remain
 * stable; only the respondent-facing wording and explanatory source trail
 * change.
 */
export const twentyFirstPassRewritesById: Readonly<
  Record<string, TwentyFirstPassRewrite>
> = {
  q0135: {
    prompt:
      "Bank-resolution rules should protect insured depositors while allocating losses to shareholders and unsecured or uninsured creditors before public funds.",
    rationale:
      "Replace the inaccurate “currency holders” category and the unsupported claim about managers with the claims hierarchy used in international resolution standards. Management accountability can be a separate governance question; deposit insurance and public solvency support are distinct safeguards.",
    evidenceNote:
      "This prescriptive item concerns bank resolution rather than ordinary bankruptcy or monetary policy. International standards distinguish shareholders, unsecured or uninsured creditors, insured depositors, and public solvency support; jurisdictions vary in the exact hierarchy and safeguards, so the item does not prescribe one national resolution procedure.",
    sourceIds: ["bankResolution", "bankFailureResolution"],
  },
  q0136: {
    prompt:
      "People should generally be free to hold and use private, foreign, or digital currencies, subject to rules addressing fraud, insolvency, consumer protection, and payment-system stability.",
    rationale:
      "Keep the alternative-currency preference while naming the regulatory boundary that the original item omitted. Private money, foreign currency, commodity-linked instruments, and digital assets do not have identical legal-tender, redemption, or systemic-risk properties.",
    evidenceNote:
      "This prescriptive item concerns permission to hold or use alternative forms of money, not a claim that all currencies are interchangeable. Private and digital monies can expand payment choice but may create fraud, redemption, consumer-protection, run, and payment-fragmentation risks; foreign-currency use also depends on jurisdictional law and monetary conditions.",
    sourceIds: ["privateMoneyPayments", "monetaryPolicy"],
  },
  q0318: {
    prompt:
      "Climate policy should prioritize reducing carbon and material intensity through technology and efficiency rather than broad consumption limits.",
    rationale:
      "Remove the undefined “abundance” and motive-imputing “austerity imposed by bureaucracy.” The revised item compares two recognizable policy strategies while leaving empirical questions about absolute decoupling, rebound, distribution, and sufficiency open.",
    evidenceNote:
      "This prescriptive item compares technology-and-efficiency strategies with broad consumption limits. Carbon intensity, energy intensity, material intensity, GDP growth, and absolute emissions are different measures; IPCC evidence finds decoupling varies by place and period and is not by itself sufficient for climate stabilization.",
    sourceIds: ["climateDecoupling", "climateAssessment"],
  },
};

function sourcesFor(sourceIds: readonly string[]): QuestionSource[] {
  return sourceIds
    .map((sourceId) => questionContextSources[sourceId])
    .filter((source): source is QuestionSource => source !== undefined)
    .map((source) => ({ ...source }));
}

export function applyEditorialTwentyFirstPass(question: Question): Question {
  if (question.active === false || question.module !== undefined)
    return question;

  const rewrite = twentyFirstPassRewritesById[String(question.id)];
  if (!rewrite) return question;

  return {
    ...question,
    prompt: rewrite.prompt,
    evidenceNote: rewrite.evidenceNote,
    sources: sourcesFor(rewrite.sourceIds),
    active: true,
    reviewStatus: "approved",
    version: EDITORIAL_TWENTY_FIRST_PASS_VERSION,
    updatedAt: EDITORIAL_TWENTY_FIRST_PASS_DATE,
    deprecationReason: undefined,
  };
}
