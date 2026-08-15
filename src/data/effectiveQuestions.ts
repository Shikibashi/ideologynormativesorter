import type { Question } from "../types";
import {
  allQuestions as rawAllQuestions,
  rawCoreQuestions,
  getBankFingerprint as getRawBankFingerprint,
  QUESTION_BANK_VERSION as RAW_QUESTION_BANK_VERSION,
  SCORING_VERSION,
} from "./questions";
import { applySemanticReview, SEMANTIC_AUDIT_VERSION } from "./semanticAudit";
import {
  applyStatementSemanticReview,
  STATEMENT_SEMANTIC_AUDIT_VERSION,
} from "./statementSemanticAudit";
import {
  applyRespondentQuestionReview,
  RESPONDENT_QUESTION_REVIEW_VERSION,
} from "./respondentQuestionReview";
import {
  applyEditorialFifthPass,
  EDITORIAL_FIFTH_PASS_VERSION,
} from "./editorialFifthPass";
import {
  applyEditorialSeventhPass,
  EDITORIAL_SEVENTH_PASS_VERSION,
} from "./editorialSeventhPass";
import {
  applyEditorialEighthPass,
  EDITORIAL_EIGHTH_PASS_VERSION,
} from "./editorialEighthPass";
import {
  applyDescriptiveEvidence,
  DESCRIPTIVE_EVIDENCE_VERSION,
} from "./descriptiveEvidence";
import {
  applyDescriptiveEvidenceSecondPass,
  DESCRIPTIVE_EVIDENCE_SECOND_PASS_VERSION,
} from "./descriptiveEvidenceSecondPass";
import {
  applyDescriptiveEvidenceThirdPass,
  DESCRIPTIVE_EVIDENCE_THIRD_PASS_VERSION,
} from "./descriptiveEvidenceThirdPass";
import {
  applyDescriptiveEvidenceFourthPass,
  DESCRIPTIVE_EVIDENCE_FOURTH_PASS_VERSION,
} from "./descriptiveEvidenceFourthPass";
import {
  applyDescriptiveEvidenceFifthPass,
  DESCRIPTIVE_EVIDENCE_FIFTH_PASS_VERSION,
} from "./descriptiveEvidenceFifthPass";
import {
  applyEditorialNinthPass,
  EDITORIAL_NINTH_PASS_VERSION,
} from "./editorialNinthPass";
import {
  applyEditorialTenthPass,
  EDITORIAL_TENTH_PASS_VERSION,
} from "./editorialTenthPass";
import {
  applyEditorialTwelfthPass,
  EDITORIAL_TWELFTH_PASS_VERSION,
} from "./editorialTwelfthPass";
import {
  applyEditorialThirteenthPass,
  EDITORIAL_THIRTEENTH_PASS_VERSION,
} from "./editorialThirteenthPass";
import {
  applyEditorialFourteenthPass,
  EDITORIAL_FOURTEENTH_PASS_VERSION,
} from "./editorialFourteenthPass";
import {
  applyEditorialFifteenthPass,
  EDITORIAL_FIFTEENTH_PASS_VERSION,
} from "./editorialFifteenthPass";
import {
  applyEditorialSixteenthPass,
  EDITORIAL_SIXTEENTH_PASS_VERSION,
} from "./editorialSixteenthPass";
import {
  applyEditorialSeventeenthPass,
  EDITORIAL_SEVENTEENTH_PASS_VERSION,
} from "./editorialSeventeenthPass";
import {
  applyEditorialEighteenthPass,
  EDITORIAL_EIGHTEENTH_PASS_VERSION,
} from "./editorialEighteenthPass";
import {
  applyEditorialNineteenthPass,
  EDITORIAL_NINETEENTH_PASS_VERSION,
} from "./editorialNineteenthPass";
import {
  applyEditorialTwentiethPass,
  EDITORIAL_TWENTIETH_PASS_VERSION,
} from "./editorialTwentiethPass";
import {
  applyEditorialTwentyFirstPass,
  EDITORIAL_TWENTY_FIRST_PASS_VERSION,
} from "./editorialTwentyFirstPass";
import {
  applyEditorialTwentySecondPass,
  EDITORIAL_TWENTY_SECOND_PASS_VERSION,
} from "./editorialTwentySecondPass";
import {
  applyEditorialTwentyThirdPass,
  EDITORIAL_TWENTY_THIRD_PASS_VERSION,
} from "./editorialTwentyThirdPass";
import {
  applyEditorialTwentyFourthPass,
  EDITORIAL_TWENTY_FOURTH_PASS_VERSION,
} from "./editorialTwentyFourthPass";
import {
  applyEditorialTwentyFifthPass,
  EDITORIAL_TWENTY_FIFTH_PASS_VERSION,
} from "./editorialTwentyFifthPass";
import {
  applyEditorialTwentySixthPass,
  EDITORIAL_TWENTY_SIXTH_PASS_VERSION,
} from "./editorialTwentySixthPass";
import {
  applyEditorialTwentySeventhPass,
  EDITORIAL_TWENTY_SEVENTH_PASS_VERSION,
} from "./editorialTwentySeventhPass";
import {
  applyEditorialTwentyEighthPass,
  EDITORIAL_TWENTY_EIGHTH_PASS_VERSION,
} from "./editorialTwentyEighthPass";
import { SPECIALIST_DESCRIPTIVE_EVIDENCE_VERSION } from "./specialistDescriptiveEvidence";
import {
  applyQuestionContext,
  QUESTION_CONTEXT_VERSION,
} from "./questionContext";
import {
  applyQuestionPromptReview,
  QUESTION_PROMPT_REVIEW_VERSION,
} from "./questionPromptReview";
import { applyResearchItemMetadata } from "./itemMetadata";

export const QUESTION_BANK_VERSION = [
  RAW_QUESTION_BANK_VERSION,
  SEMANTIC_AUDIT_VERSION,
  STATEMENT_SEMANTIC_AUDIT_VERSION,
  RESPONDENT_QUESTION_REVIEW_VERSION,
  EDITORIAL_FIFTH_PASS_VERSION,
  EDITORIAL_SEVENTH_PASS_VERSION,
  EDITORIAL_EIGHTH_PASS_VERSION,
  DESCRIPTIVE_EVIDENCE_VERSION,
  DESCRIPTIVE_EVIDENCE_SECOND_PASS_VERSION,
  DESCRIPTIVE_EVIDENCE_THIRD_PASS_VERSION,
  SPECIALIST_DESCRIPTIVE_EVIDENCE_VERSION,
  EDITORIAL_NINTH_PASS_VERSION,
  EDITORIAL_TENTH_PASS_VERSION,
  EDITORIAL_TWELFTH_PASS_VERSION,
  EDITORIAL_THIRTEENTH_PASS_VERSION,
  EDITORIAL_FOURTEENTH_PASS_VERSION,
  EDITORIAL_FIFTEENTH_PASS_VERSION,
  EDITORIAL_SIXTEENTH_PASS_VERSION,
  EDITORIAL_SEVENTEENTH_PASS_VERSION,
  EDITORIAL_EIGHTEENTH_PASS_VERSION,
  EDITORIAL_NINETEENTH_PASS_VERSION,
  EDITORIAL_TWENTIETH_PASS_VERSION,
  EDITORIAL_TWENTY_FIRST_PASS_VERSION,
  EDITORIAL_TWENTY_SECOND_PASS_VERSION,
  EDITORIAL_TWENTY_THIRD_PASS_VERSION,
  EDITORIAL_TWENTY_FOURTH_PASS_VERSION,
  EDITORIAL_TWENTY_FIFTH_PASS_VERSION,
  EDITORIAL_TWENTY_SIXTH_PASS_VERSION,
  EDITORIAL_TWENTY_SEVENTH_PASS_VERSION,
  EDITORIAL_TWENTY_EIGHTH_PASS_VERSION,
  DESCRIPTIVE_EVIDENCE_FOURTH_PASS_VERSION,
  DESCRIPTIVE_EVIDENCE_FIFTH_PASS_VERSION,
  QUESTION_CONTEXT_VERSION,
  QUESTION_PROMPT_REVIEW_VERSION,
].join("+");
export { SCORING_VERSION };

export function getBankFingerprint(): string {
  return [
    getRawBankFingerprint(),
    SEMANTIC_AUDIT_VERSION,
    STATEMENT_SEMANTIC_AUDIT_VERSION,
    RESPONDENT_QUESTION_REVIEW_VERSION,
    EDITORIAL_FIFTH_PASS_VERSION,
    EDITORIAL_SEVENTH_PASS_VERSION,
    EDITORIAL_EIGHTH_PASS_VERSION,
    DESCRIPTIVE_EVIDENCE_VERSION,
    DESCRIPTIVE_EVIDENCE_SECOND_PASS_VERSION,
    DESCRIPTIVE_EVIDENCE_THIRD_PASS_VERSION,
    DESCRIPTIVE_EVIDENCE_FOURTH_PASS_VERSION,
    SPECIALIST_DESCRIPTIVE_EVIDENCE_VERSION,
    EDITORIAL_NINTH_PASS_VERSION,
    EDITORIAL_TENTH_PASS_VERSION,
    EDITORIAL_TWELFTH_PASS_VERSION,
    EDITORIAL_THIRTEENTH_PASS_VERSION,
    EDITORIAL_FOURTEENTH_PASS_VERSION,
    EDITORIAL_FIFTEENTH_PASS_VERSION,
    EDITORIAL_SIXTEENTH_PASS_VERSION,
    EDITORIAL_SEVENTEENTH_PASS_VERSION,
    EDITORIAL_EIGHTEENTH_PASS_VERSION,
    EDITORIAL_NINETEENTH_PASS_VERSION,
    EDITORIAL_TWENTIETH_PASS_VERSION,
    EDITORIAL_TWENTY_FIRST_PASS_VERSION,
    EDITORIAL_TWENTY_SECOND_PASS_VERSION,
    EDITORIAL_TWENTY_THIRD_PASS_VERSION,
    EDITORIAL_TWENTY_FOURTH_PASS_VERSION,
    EDITORIAL_TWENTY_FIFTH_PASS_VERSION,
    EDITORIAL_TWENTY_SIXTH_PASS_VERSION,
    EDITORIAL_TWENTY_SEVENTH_PASS_VERSION,
    EDITORIAL_TWENTY_EIGHTH_PASS_VERSION,
    DESCRIPTIVE_EVIDENCE_FIFTH_PASS_VERSION,
    QUESTION_CONTEXT_VERSION,
    QUESTION_PROMPT_REVIEW_VERSION,
  ].join("+");
}

function applyEffectiveReview(question: Question): Question {
  let reviewed = applySemanticReview(question);
  reviewed = applyStatementSemanticReview(reviewed);
  reviewed = applyRespondentQuestionReview(reviewed);
  reviewed = applyEditorialFifthPass(reviewed);
  reviewed = applyEditorialSeventhPass(reviewed);
  reviewed = applyEditorialEighthPass(reviewed);
  reviewed = applyDescriptiveEvidence(reviewed);
  reviewed = applyDescriptiveEvidenceSecondPass(reviewed);
  reviewed = applyDescriptiveEvidenceThirdPass(reviewed);
  reviewed = applyEditorialNinthPass(reviewed);
  reviewed = applyEditorialTenthPass(reviewed);
  reviewed = applyEditorialTwelfthPass(reviewed);
  reviewed = applyEditorialThirteenthPass(reviewed);
  reviewed = applyEditorialFourteenthPass(reviewed);
  reviewed = applyEditorialFifteenthPass(reviewed);
  reviewed = applyEditorialSixteenthPass(reviewed);
  reviewed = applyEditorialSeventeenthPass(reviewed);
  reviewed = applyEditorialEighteenthPass(reviewed);
  reviewed = applyEditorialNineteenthPass(reviewed);
  reviewed = applyEditorialTwentiethPass(reviewed);
  reviewed = applyEditorialTwentyFirstPass(reviewed);
  reviewed = applyEditorialTwentySecondPass(reviewed);
  reviewed = applyEditorialTwentyThirdPass(reviewed);
  reviewed = applyEditorialTwentyFourthPass(reviewed);
  reviewed = applyEditorialTwentyFifthPass(reviewed);
  reviewed = applyEditorialTwentySixthPass(reviewed);
  reviewed = applyEditorialTwentySeventhPass(reviewed);
  reviewed = applyEditorialTwentyEighthPass(reviewed);
  reviewed = applyDescriptiveEvidenceFourthPass(reviewed);
  reviewed = applyDescriptiveEvidenceFifthPass(reviewed);
  return applyResearchItemMetadata(
    applyQuestionPromptReview(applyQuestionContext(reviewed)),
  );
}

/** All reviewed core items, including deactivated items retained for traceability. */
export const coreQuestions: Question[] =
  rawCoreQuestions.map(applyEffectiveReview);
/** Active reviewed items used by the public quiz and result scoring. */
export const questions: Question[] = coreQuestions.filter(
  (question) => question.active !== false,
);
export const allQuestions: Question[] =
  rawAllQuestions.map(applyEffectiveReview);
export const questionById = new Map(
  allQuestions.map((question) => [question.id, question]),
);

const TIER_RANK: Record<Question["tier"], number> = {
  blitz: 0,
  quick: 1,
  moderate: 2,
  extensive: 3,
};

function diversifyQuickOrder(selectedQuestions: Question[]): Question[] {
  const domainOrder = [
    ...new Set(selectedQuestions.map((question) => question.domain)),
  ];
  const byDomain = new Map(
    domainOrder.map((domain) => [
      domain,
      selectedQuestions.filter((question) => question.domain === domain),
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

export function questionsForTier(tier: Question["tier"]): Question[] {
  const selectedQuestions = questions.filter(
    (question) => TIER_RANK[question.tier] <= TIER_RANK[tier],
  );
  return tier === "quick"
    ? diversifyQuickOrder(selectedQuestions)
    : selectedQuestions;
}
