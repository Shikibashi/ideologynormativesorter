import type { Answer, Question } from "../../../types";
import { normalizeAnswer, salienceFactor } from "../../../scoring/normalize";
import { RESULT_SCORING_VERSION } from "../../../scoring/index";
import { QUESTION_BANK_VERSION as RAW_QUESTION_BANK_VERSION } from "../../../data/questions";
import { SEMANTIC_AUDIT_VERSION } from "../../../data/semanticAudit";
import type {
  CorpusId,
  Disposition,
  InventorySetId,
  ResponseContributionRecord,
} from "../types";
import {
  contributionId,
  corpusForQuestion,
  expandSelectableResponses,
} from "./expand";

const LIKERT_MAX: Record<"likert5" | "likert7", number> = {
  likert5: 2,
  likert7: 3,
};

export interface ContributionBuildOptions {
  corpus: CorpusId;
  inventorySet: InventorySetId;
  bankVersion?: string;
  overlayVersion?: string;
  scoringVersion?: string;
  /** Per-question construct rationale stubs (WP2 fills). */
  rationales?: Record<string, string>;
  /** Per-contribution or per-question disposition overrides. */
  dispositions?: Record<string, Disposition>;
  defaultDisposition?: Disposition;
  defaultRationale?: string;
}

function syntheticAnswer(
  question: Question,
  responseValue: number | string | null,
): Answer {
  if (responseValue === "dont_know") {
    return { questionId: question.id, value: "dont_know" };
  }
  if (typeof responseValue === "number") {
    return { questionId: question.id, value: responseValue };
  }
  return { questionId: question.id, value: 0 };
}

function signedContribution(
  question: Question,
  responseValue: number | string | null,
  weight: number,
): {
  normalizedUnit: number | null;
  salience: number;
  effectiveSignedContribution: number | null;
  exclusionReason: string | null;
} {
  const answer = syntheticAnswer(question, responseValue);
  const unit = normalizeAnswer(question, answer);
  const salience = salienceFactor(question, answer);

  if (responseValue === "dont_know" || unit === null) {
    return {
      normalizedUnit: null,
      salience,
      effectiveSignedContribution: null,
      exclusionReason: "dont_know",
    };
  }

  return {
    normalizedUnit: unit,
    salience,
    effectiveSignedContribution: unit * weight * salience,
    exclusionReason: null,
  };
}

/**
 * Build production-identical contribution rows for a question set.
 * Default salience (no confidence/priority) matches coverage primary key.
 */
export function buildContributionRecords(
  questions: Question[],
  options: ContributionBuildOptions,
): ResponseContributionRecord[] {
  const bankVersion = options.bankVersion ?? RAW_QUESTION_BANK_VERSION;
  const overlayVersion = options.overlayVersion ?? SEMANTIC_AUDIT_VERSION;
  const scoringVersion = options.scoringVersion ?? RESULT_SCORING_VERSION;
  const defaultDisposition = options.defaultDisposition ?? "no-change";
  const defaultRationale = options.defaultRationale ?? "PENDING_TEXTUAL_AUDIT";
  const records: ResponseContributionRecord[] = [];

  for (const question of questions) {
    const corpus = corpusForQuestion(question, options.corpus);
    const rationale = options.rationales?.[question.id] ?? defaultRationale;
    const questionDisposition =
      options.dispositions?.[question.id] ?? defaultDisposition;

    for (const response of expandSelectableResponses(question)) {
      for (const axisWeight of response.axisWeights) {
        const id = contributionId(
          question.id,
          response.responseKey,
          axisWeight.axisId,
        );
        const signed = signedContribution(
          question,
          response.responseValue,
          axisWeight.weight,
        );
        const disposition = options.dispositions?.[id] ?? questionDisposition;

        records.push({
          id,
          corpus,
          inventorySet: options.inventorySet,
          questionId: question.id,
          responseKey: response.responseKey,
          responseType: question.responseType,
          responseValue: response.responseValue,
          reverseScored: question.reverseScored === true,
          layer: question.layer,
          theoryContext: question.theoryContext,
          axisId: axisWeight.axisId,
          configuredWeight: axisWeight.weight,
          normalizedUnit: signed.normalizedUnit,
          salience: signed.salience,
          effectiveSignedContribution: signed.effectiveSignedContribution,
          exclusionReason: signed.exclusionReason,
          constructRationale: rationale,
          evidenceCiteIds: [],
          disposition,
          linkedTestIds: [],
          bankVersion,
          overlayVersion,
          scoringVersion,
        });
      }
    }
  }

  return records;
}

/** Exported for invariant tests: Likert max table mirrors normalize.ts. */
export const AUDIT_LIKERT_MAX = LIKERT_MAX;
