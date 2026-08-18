import { describe, expect, it } from "vitest";
import {
  MODIFIER_MEASUREMENT_VERSION,
  PRIMARY_MEASUREMENT_VERSION,
  QUESTION_BANK_VERSION,
  questionsForTier,
  TAXONOMY_VERSION,
} from "../domain/selectors";
import { RESULT_SCORING_VERSION } from "../scoring";
import type { AnswerMap } from "../types";
import {
  buildResearchSubmission,
  buildSpecialistDispositionSubmission,
  buildSpecialistResearchSubmission,
  MODIFIER_LABEL_ROSTER_FINGERPRINT,
  PRIMARY_LABEL_ROSTER_FINGERPRINT,
  RESEARCH_CONSENT_VERSION,
  RESEARCH_QUALITY_RULE_VERSION,
  RESEARCH_SCHEMA_VERSION,
  RESEARCH_STUDY_ID,
  type ResearchConsent,
} from "./index";
import { buildContributionQuestionForm, RESEARCH_FORM_VERSION } from "./forms";
import {
  assignSpecialistModule,
  buildSpecialistQuestionForm,
  scoreSpecialistModule,
  SPECIALIST_ASSIGNMENT_ROSTER_VERSION,
  SPECIALIST_ASSIGNMENT_STRATEGY,
  specialistModuleDefinitions,
} from "../specialist";
import canonicalContractArtifact from "../../research-worker/generated/canonical-contract.json";
// @ts-expect-error The production Worker is a native JavaScript module outside the browser bundle.
import { validateSubmission } from "../../research-worker/src/worker.mjs";

const collectorEnvironment = {
  CANONICAL_CONTRACT_ARTIFACT: JSON.stringify(canonicalContractArtifact),
  EXPECTED_STUDY_ID: RESEARCH_STUDY_ID,
  EXPECTED_SCHEMA_VERSION: RESEARCH_SCHEMA_VERSION,
  EXPECTED_CONSENT_VERSION: RESEARCH_CONSENT_VERSION,
  EXPECTED_QUALITY_RULE_VERSION: RESEARCH_QUALITY_RULE_VERSION,
  EXPECTED_FORM_VERSION: RESEARCH_FORM_VERSION,
  EXPECTED_BANK_VERSION: canonicalContractArtifact.bankVersion,
  EXPECTED_SCORING_VERSION: RESULT_SCORING_VERSION,
  EXPECTED_TAXONOMY_VERSION: TAXONOMY_VERSION,
  EXPECTED_PRIMARY_MEASUREMENT_VERSION: PRIMARY_MEASUREMENT_VERSION,
  EXPECTED_MODIFIER_MEASUREMENT_VERSION: MODIFIER_MEASUREMENT_VERSION,
  EXPECTED_PRIMARY_LABEL_ROSTER_FINGERPRINT: PRIMARY_LABEL_ROSTER_FINGERPRINT,
  EXPECTED_MODIFIER_LABEL_ROSTER_FINGERPRINT: MODIFIER_LABEL_ROSTER_FINGERPRINT,
  EXPECTED_CONTRACT_VERSION: canonicalContractArtifact.contractVersion,
  EXPECTED_SOURCE_MANIFEST_SHA256:
    canonicalContractArtifact.sourceManifestSha256,
  EXPECTED_MANIFEST_SCHEMA_VERSION:
    canonicalContractArtifact.manifestSchemaVersion,
  EXPECTED_MANIFEST_VERSION: canonicalContractArtifact.manifestVersion,
  EXPECTED_MANIFEST_FINGERPRINT:
    canonicalContractArtifact.canonicalManifestFingerprint,
  EXPECTED_SERIALIZATION_VERSION:
    canonicalContractArtifact.serializationVersion,
  EXPECTED_SERIALIZATION_FINGERPRINT:
    canonicalContractArtifact.serializationFingerprint,
  EXPECTED_CONTRACT_SCHEMA_VERSION:
    canonicalContractArtifact.schemaContractVersion,
  EXPECTED_SCHEMA_FINGERPRINT: canonicalContractArtifact.schemaFingerprint,
  EXPECTED_CONTRACT_ROUTE: canonicalContractArtifact.contractRoute,
  EXPECTED_COHORT: canonicalContractArtifact.cohort,
  EXPECTED_COHORT_VERSION: canonicalContractArtifact.cohortVersion,
  EXPECTED_COHORT_FINGERPRINT: canonicalContractArtifact.cohortFingerprint,
  EXPECTED_SPECIALIST_ASSIGNMENT_STRATEGY: SPECIALIST_ASSIGNMENT_STRATEGY,
  EXPECTED_SPECIALIST_ASSIGNMENT_ROSTER_VERSION:
    SPECIALIST_ASSIGNMENT_ROSTER_VERSION,
  EXPECTED_SPECIALIST_ASSIGNMENT_MODULE_IDS:
    "feminist-faction-module,identity-sovereignty-module,anarchist-families-module,green-morphology-module,socialist-families-module,conservative-variants-module,religious-national-politics-module,technology-governance-module,monarchist-municipal-module",
  EXPECTED_MODERATE_ITEM_COUNT: "206",
  EXPECTED_EXTENSIVE_ITEM_COUNT: "338",
};

function endpointConsent(): ResearchConsent {
  return {
    ageConfirmed: true,
    voluntaryParticipation: true,
    dataUseAccepted: true,
    consentVersion: RESEARCH_CONSENT_VERSION,
    consentedAt: "2026-08-10T12:00:00.000Z",
    disclosureSnapshot: {
      endpointConfigured: true,
      transferAndWithdrawalNotice:
        "Responses are sent to the website endpoint.",
      retentionNotice: "A retention statement is published.",
      contactNotice: "A site-owner contact is published.",
    },
  };
}

describe("Cloudflare contribution collector compatibility", () => {
  it.each([
    ["moderate", 206],
    ["extensive", 338],
  ] as const)(
    "accepts the complete %s profile produced by the frontend",
    (tier, expectedCount) => {
      const form = buildContributionQuestionForm(
        questionsForTier(tier),
        "p_compatibility",
        "test",
        null,
      );
      const answers = Object.fromEntries(
        form.map((question) => [
          question.id,
          { questionId: question.id, value: "prefer_not_to_answer" },
        ]),
      ) as AnswerMap;
      const submission = buildResearchSubmission({
        studyId: RESEARCH_STUDY_ID,
        participantId: "p_compatibility",
        administration: "test",
        bankVersion: QUESTION_BANK_VERSION,
        scoringVersion: RESULT_SCORING_VERSION,
        tier,
        consent: endpointConsent(),
        identity: { selfReportedIdeologies: "A tradition not yet listed" },
        predictedLabelIds: [],
        answers,
        questions: form,
        startedAt: "2026-08-10T12:00:00.000Z",
        completedAt: "2026-08-10T12:20:00.000Z",
        submittedAt: "2026-08-10T12:20:00.000Z",
        resumed: false,
        requestedFormSize: null,
        recruitmentSource: "direct-or-unknown",
        locale: "en-US",
        submissionId: `submission_compatibility_${tier}`,
      });

      expect(form).toHaveLength(expectedCount);
      expect(JSON.stringify(submission).length).toBeLessThan(2_000_000);
      expect(validateSubmission(submission, collectorEnvironment)).toBe(true);
    },
  );

  it("accepts the specialist completion and decline records produced by the frontend", () => {
    const assignment = assignSpecialistModule(
      "p_compatibility",
      RESEARCH_STUDY_ID,
    );
    const module = specialistModuleDefinitions.find(
      (candidate) => candidate.id === assignment.moduleId,
    )!;
    const questions = buildSpecialistQuestionForm(
      module.id,
      "p_compatibility",
      "test",
    );
    const answers = Object.fromEntries(
      questions.map((question) => [
        question.id,
        { questionId: question.id, value: "prefer_not_to_answer" },
      ]),
    ) as AnswerMap;
    const specialist = buildSpecialistResearchSubmission({
      studyId: RESEARCH_STUDY_ID,
      participantId: "p_compatibility",
      administration: "test",
      consent: endpointConsent(),
      moduleId: module.id,
      moduleVersion: module.canonicalVersion ?? module.version,
      assignment,
      bankVersion: QUESTION_BANK_VERSION,
      scoringVersion: RESULT_SCORING_VERSION,
      criterion: { selectedIds: [], noneOrUnsure: true, confidence: "low" },
      answers,
      questions,
      constructWeightsByQuestionId: module.constructWeightsByQuestionId,
      outcome: scoreSpecialistModule(module.id, answers),
      startedAt: "2026-08-10T12:20:00.000Z",
      completedAt: "2026-08-10T12:25:00.000Z",
      submittedAt: "2026-08-10T12:25:00.000Z",
      submissionId: "specialist_compatibility",
    });
    const disposition = buildSpecialistDispositionSubmission({
      studyId: RESEARCH_STUDY_ID,
      participantId: "p_compatibility",
      administration: "test",
      consent: endpointConsent(),
      moduleId: module.id,
      moduleVersion: module.version,
      assignment,
      disposition: "declined-before-start",
      answeredCount: 0,
      startedAt: "2026-08-10T12:20:00.000Z",
      occurredAt: "2026-08-10T12:20:00.000Z",
      submissionId: "disposition_compatibility",
    });

    expect(questions.length).toBeGreaterThan(0);
    expect(validateSubmission(specialist, collectorEnvironment)).toBe(true);
    expect(validateSubmission(disposition, collectorEnvironment)).toBe(true);
  });
});
