import type { Question } from "../types";
import {
  CONFIDENCE_COVERAGE_VERSION,
  confidenceCoverageQuestions,
} from "./confidenceCoverage";
import {
  CONFIDENCE_COVERAGE_SECOND_PASS_VERSION,
  confidenceCoverageSecondPassQuestions,
} from "./confidenceCoverageSecondPass";
import {
  CONFIDENCE_COVERAGE_THIRD_PASS_VERSION,
  confidenceCoverageThirdPassQuestions,
} from "./confidenceCoverageThirdPass";
import { statementQuestions } from "./statementQuestions";

export const QUESTION_BANK_VERSION = `2026-06-v4+${CONFIDENCE_COVERAGE_VERSION}+${CONFIDENCE_COVERAGE_SECOND_PASS_VERSION}+${CONFIDENCE_COVERAGE_THIRD_PASS_VERSION}`;
export const SCORING_VERSION = "2026-06-25";

export function getBankFingerprint(): string {
  return QUESTION_BANK_VERSION; // stable for this PR; can be content hash later
}

import { baseQuestionsPart01 } from "./questionBankParts/baseQuestionsPart01";
import { baseQuestionsPart02 } from "./questionBankParts/baseQuestionsPart02";
import { baseQuestionsPart03 } from "./questionBankParts/baseQuestionsPart03";
import { baseQuestionsPart04 } from "./questionBankParts/baseQuestionsPart04";
import { baseQuestionsPart05 } from "./questionBankParts/baseQuestionsPart05";
import { baseQuestionsPart06 } from "./questionBankParts/baseQuestionsPart06";
import { baseQuestionsPart07 } from "./questionBankParts/baseQuestionsPart07";
import { baseQuestionsPart08 } from "./questionBankParts/baseQuestionsPart08";
import { baseQuestionsPart09 } from "./questionBankParts/baseQuestionsPart09";

const baseQuestions: Question[] = [
  ...baseQuestionsPart01,
  ...baseQuestionsPart02,
  ...baseQuestionsPart03,
  ...baseQuestionsPart04,
  ...baseQuestionsPart05,
  ...baseQuestionsPart06,
  ...baseQuestionsPart07,
  ...baseQuestionsPart08,
  ...baseQuestionsPart09,
];

export const rawCoreQuestions: Question[] = [
  ...baseQuestions,
  ...confidenceCoverageQuestions,
  ...confidenceCoverageSecondPassQuestions,
  ...confidenceCoverageThirdPassQuestions,
  ...statementQuestions,
];

export const questions: Question[] = rawCoreQuestions.slice();

export const allQuestions: Question[] = [...rawCoreQuestions];

export const questionById = new Map(allQuestions.map((q) => [q.id, q]));

const TIER_RANK: Record<Question["tier"], number> = {
  blitz: 0,
  quick: 1,
  moderate: 2,
  extensive: 3,
};

function diversifyQuickOrder(selectedQuestions: Question[]): Question[] {
  const domainOrder = [...new Set(selectedQuestions.map((q) => q.domain))];
  const byDomain = new Map(
    domainOrder.map((domain) => [
      domain,
      selectedQuestions.filter((q) => q.domain === domain),
    ]),
  );
  const maxDomainDepth = Math.max(
    ...[...byDomain.values()].map((domainQuestions) => domainQuestions.length),
  );
  const diversified: Question[] = [];

  for (let depth = 0; depth < maxDomainDepth; depth += 1) {
    for (const domain of domainOrder) {
      const question = byDomain.get(domain)?.[depth];
      if (question) diversified.push(question);
    }
  }

  return diversified;
}

/** Quick is a subset of moderate, which is a subset of extensive (the full core bank). */
export function questionsForTier(tier: Question["tier"]): Question[] {
  const selectedQuestions = rawCoreQuestions.filter(
    (q) => TIER_RANK[q.tier] <= TIER_RANK[tier] && q.active !== false,
  );
  return tier === "quick"
    ? diversifyQuickOrder(selectedQuestions)
    : selectedQuestions;
}
