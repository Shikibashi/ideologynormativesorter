import type { Question, QuestionSource } from "../types";
import { questionContextSources } from "./questionContext";

export const EDITORIAL_FIFTEENTH_PASS_VERSION = "2026-08-editorial-v15";
export const EDITORIAL_FIFTEENTH_PASS_DATE = "2026-08-12";

export interface FifteenthPassRewrite {
  prompt: string;
  rationale: string;
  evidenceNote: string;
  sourceIds: readonly string[];
}

/**
 * This pass narrows six active prescriptive items whose earlier prompts bundled
 * distinct institutional choices or treated procedural safeguards as broad
 * ideological commitments.
 */
export const fifteenthPassRewritesById: Readonly<
  Record<string, FifteenthPassRewrite>
> = {
  q0033: {
    prompt:
      "An ideal property regime should distinguish personal possessions from ownership or control of productive assets.",
    rationale:
      "Replace a four-part bundle about possessions, productive assets, land rents, and state-created privileges with one property-regime distinction that respondents can evaluate without taking a position on every adjacent policy instrument.",
    evidenceNote:
      "Scope to the distinction between personal possessions and ownership or control of productive resources. Property scholarship treats land, natural resources, means of production, and manufactured goods as potentially different objects of property rules; agreement here does not settle land taxation, redistribution, or the legitimacy of private property generally.",
    sourceIds: ["property", "distributiveJustice"],
  },
  q0036: {
    prompt:
      "Legal systems should make it easier for workers to form and govern worker-owned cooperatives.",
    rationale:
      "Replace a bundle of cooperatives, small firms, mutual aid, and independent work with the specific institutional model supported by the cited cooperative research: worker-owned and worker-governed firms.",
    evidenceNote:
      "Scope to legal and institutional conditions for worker cooperatives. The ILO describes these as member-worker-owner enterprises with democratic governance; that does not make cooperatives, small firms, mutual-aid associations, and independent contracting interchangeable or imply that every business-form barrier should be removed.",
    sourceIds: ["workerCooperatives", "cooperativesWorkRights"],
  },
  q0193: {
    prompt:
      "An ideal justice system should use incapacitation only when necessary to prevent serious harm.",
    rationale:
      "Separate incapacitation from restitution and prevention so agreement measures a single coercive threshold rather than three different aims of legal justice.",
    evidenceNote:
      "Scope to the use of incapacitation as a preventive restriction on liberty. The item does not deny restitution, rehabilitation, deterrence, or other justice aims; it asks whether incapacitation requires a necessity condition tied to preventing serious harm rather than administrative convenience or retribution alone.",
    sourceIds: ["legalPunishment", "civilPoliticalRights"],
  },
  q0354: {
    prompt:
      "Expert agencies should give affected people transparent reasons for consequential decisions and a meaningful way to appeal them.",
    rationale:
      "Replace four heterogeneous safeguards—transparency, appeal, sunset review, and competitive alternatives—with a coherent accountability construct centered on reasons and challenge rights for affected people.",
    evidenceNote:
      "Scope to procedural accountability for consequential agency decisions. Transparency, reasons, and appeal are distinct safeguards that can be implemented in different ways; sunset review and competitive alternatives remain separate institutional choices and are not implied by agreement with this item.",
    sourceIds: ["regulatorGovernance", "regulatorAppeals"],
  },
  q0375: {
    prompt:
      "Government access to private data should require case-specific authorization under clear legal rules.",
    rationale:
      "Replace a bundle of warrants, minimization, and adversarial oversight with one authorization principle that can be evaluated across different data-access regimes without presupposing one procedural form.",
    evidenceNote:
      "Scope to the legal authorization of government access to private data. UN Human Rights Committee guidance treats privacy interference as requiring a lawful basis, defined circumstances, designated authorization, case-by-case control, and avenues for complaint; the item does not claim that every jurisdiction must use a U.S.-style warrant or that authorization alone guarantees proportionality.",
    sourceIds: ["iccprPrivacy", "civilPoliticalRights"],
  },
  q0376: {
    prompt:
      "People affected by a consequential public algorithm should be able to inspect an audit of its use and challenge the resulting decision.",
    rationale:
      "Replace the three-domain bundle about benefits, policing, and immigration with one cross-domain contestability construct while retaining the two safeguards that define it: auditability and a route to challenge a decision.",
    evidenceNote:
      "Scope to contestability when a public algorithm contributes to a consequential decision. Audit access and appeal rights are related but distinct safeguards, and their design depends on the decision context, legal authority, confidentiality, and error costs; agreement does not imply one universal algorithmic procedure.",
    sourceIds: ["aiRisk", "aiEthics", "civilPoliticalRights"],
  },
};

function sourcesFor(sourceIds: readonly string[]): QuestionSource[] {
  return sourceIds
    .map((sourceId) => questionContextSources[sourceId])
    .filter((source): source is QuestionSource => source !== undefined)
    .map((source) => ({ ...source }));
}

export function applyEditorialFifteenthPass(question: Question): Question {
  if (question.active === false || question.module !== undefined)
    return question;

  const rewrite = fifteenthPassRewritesById[String(question.id)];
  if (!rewrite) return question;

  return {
    ...question,
    prompt: rewrite.prompt,
    evidenceNote: rewrite.evidenceNote,
    sources: sourcesFor(rewrite.sourceIds),
    active: true,
    reviewStatus: "approved",
    version: EDITORIAL_FIFTEENTH_PASS_VERSION,
    updatedAt: EDITORIAL_FIFTEENTH_PASS_DATE,
    deprecationReason: undefined,
  };
}
