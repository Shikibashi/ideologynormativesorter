import { questions as rawMainQuestions } from "../../../data/questions";
import {
  questions as effectiveActiveQuestions,
  coreQuestions as effectiveRetainedQuestions,
  QUESTION_BANK_VERSION as EFFECTIVE_BANK_VERSION,
} from "../../../data/effectiveQuestions";
import { statementQuestions } from "../../../data/statementQuestions";
import { STATEMENT_SEMANTIC_AUDIT_VERSION } from "../../../data/statementSemanticAudit";
import { SEMANTIC_AUDIT_VERSION } from "../../../data/semanticAudit";
import type { Disposition, ResponseContributionRecord } from "../types";
import { buildContributionRecords } from "./build";
import { buildAnnotationMap } from "./annotations";

function splitAnnotations(questions: Parameters<typeof buildAnnotationMap>[0]) {
  const map = buildAnnotationMap(questions);
  const rationales: Record<string, string> = {};
  const dispositions: Record<string, Disposition> = {};
  for (const [id, ann] of Object.entries(map)) {
    rationales[id] = ann.constructRationale;
    dispositions[id] = ann.disposition;
  }
  return { rationales, dispositions };
}

const mainActiveAnn = splitAnnotations(effectiveActiveQuestions);
const mainRawAnn = splitAnnotations(rawMainQuestions);
const mainRetainedAnn = splitAnnotations(effectiveRetainedQuestions);
const statementAnn = splitAnnotations(statementQuestions);

/** Effective-active main corpus — public quiz/scoring pool (release coverage). */
export const responseContributions: ResponseContributionRecord[] =
  buildContributionRecords(effectiveActiveQuestions, {
    corpus: "main",
    inventorySet: "effective-active",
    bankVersion: EFFECTIVE_BANK_VERSION,
    overlayVersion: SEMANTIC_AUDIT_VERSION,
    rationales: mainActiveAnn.rationales,
    dispositions: mainActiveAnn.dispositions,
  });

/** Raw main corpus baseline. */
export const rawMainContributions: ResponseContributionRecord[] =
  buildContributionRecords(rawMainQuestions, {
    corpus: "main",
    inventorySet: "raw",
    overlayVersion: SEMANTIC_AUDIT_VERSION,
    rationales: mainRawAnn.rationales,
    dispositions: mainRawAnn.dispositions,
  });

/** Effective-retained main (includes active===false). */
export const effectiveRetainedContributions: ResponseContributionRecord[] =
  buildContributionRecords(effectiveRetainedQuestions, {
    corpus: "main",
    inventorySet: "effective-retained",
    bankVersion: EFFECTIVE_BANK_VERSION,
    overlayVersion: SEMANTIC_AUDIT_VERSION,
    rationales: mainRetainedAnn.rationales,
    dispositions: mainRetainedAnn.dispositions,
  });

/**
 * Statement corpus view. All statementQuestions ids also live in the main bank;
 * this export audits the statementQuestions surface with statement overlay versioning.
 */
export const statementContributions: ResponseContributionRecord[] =
  buildContributionRecords(statementQuestions, {
    corpus: "statement",
    inventorySet: "raw",
    overlayVersion: STATEMENT_SEMANTIC_AUDIT_VERSION,
    rationales: statementAnn.rationales,
    dispositions: statementAnn.dispositions,
  });

export function contributionById(
  id: string,
): ResponseContributionRecord | undefined {
  return (
    responseContributions.find((r) => r.id === id) ??
    statementContributions.find((r) => r.id === id) ??
    effectiveRetainedContributions.find((r) => r.id === id) ??
    rawMainContributions.find((r) => r.id === id)
  );
}

/** Main audit pool used for uniqueness/release cardinality. */
export function allCorpusContributions(): ResponseContributionRecord[] {
  return [...responseContributions];
}
