import { describe, expect, it } from 'vitest'
import { questionsForTier, QUESTION_BANK_VERSION } from '../data/effectiveQuestions'
import { RESULT_SCORING_VERSION } from '../scoring'
import type { AnswerMap } from '../types'
import {
  buildResearchSubmission,
  buildSpecialistDispositionSubmission,
  buildSpecialistResearchSubmission,
  RESEARCH_CONSENT_VERSION,
  RESEARCH_QUALITY_RULE_VERSION,
  RESEARCH_SCHEMA_VERSION,
  type ResearchConsent,
} from './index'
import { buildContributionQuestionForm, RESEARCH_FORM_VERSION } from './forms'
import {
  buildSpecialistQuestionForm,
  scoreSpecialistModule,
  specialistModuleDefinitions,
} from '../specialist'
// @ts-expect-error The production Worker is a native JavaScript module outside the browser bundle.
import { validateSubmission } from '../../research-worker/src/worker.mjs'

const collectorEnvironment = {
  EXPECTED_STUDY_ID: 'community-2026',
  EXPECTED_SCHEMA_VERSION: RESEARCH_SCHEMA_VERSION,
  EXPECTED_CONSENT_VERSION: RESEARCH_CONSENT_VERSION,
  EXPECTED_QUALITY_RULE_VERSION: RESEARCH_QUALITY_RULE_VERSION,
  EXPECTED_FORM_VERSION: RESEARCH_FORM_VERSION,
  EXPECTED_MODERATE_ITEM_COUNT: '149',
  EXPECTED_EXTENSIVE_ITEM_COUNT: '309',
  ALLOWED_MATRIX_ITEM_COUNTS: '120',
}

function endpointConsent(): ResearchConsent {
  return {
    ageConfirmed: true,
    voluntaryParticipation: true,
    dataUseAccepted: true,
    consentVersion: RESEARCH_CONSENT_VERSION,
    consentedAt: '2026-08-10T12:00:00.000Z',
    disclosureSnapshot: {
      endpointConfigured: true,
      transferAndWithdrawalNotice: 'Responses are sent to the website endpoint.',
      retentionNotice: 'A retention statement is published.',
      contactNotice: 'A site-owner contact is published.',
    },
  }
}

describe('Cloudflare contribution collector compatibility', () => {
  it.each([
    ['moderate', 149],
    ['extensive', 309],
  ] as const)('accepts the complete %s profile produced by the frontend', (tier, expectedCount) => {
    const form = buildContributionQuestionForm(questionsForTier(tier), 'p_compatibility', 'test', null)
    const answers = Object.fromEntries(form.map((question) => [
      question.id,
      { questionId: question.id, value: 'prefer_not_to_answer' },
    ])) as AnswerMap
    const submission = buildResearchSubmission({
      studyId: 'community-2026',
      participantId: 'p_compatibility',
      administration: 'test',
      bankVersion: QUESTION_BANK_VERSION,
      scoringVersion: RESULT_SCORING_VERSION,
      tier,
      consent: endpointConsent(),
      identity: { selfReportedIdeologies: 'A tradition not yet listed' },
      predictedLabelIds: [],
      answers,
      questions: form,
      startedAt: '2026-08-10T12:00:00.000Z',
      completedAt: '2026-08-10T12:20:00.000Z',
      submittedAt: '2026-08-10T12:20:00.000Z',
      resumed: false,
      requestedFormSize: null,
      recruitmentSource: 'direct-or-unknown',
      locale: 'en-US',
      submissionId: `submission_compatibility_${tier}`,
    })

    expect(form).toHaveLength(expectedCount)
    expect(JSON.stringify(submission).length).toBeLessThan(2_000_000)
    expect(validateSubmission(submission, collectorEnvironment)).toBe(true)
  })

  it('accepts the specialist completion and decline records produced by the frontend', () => {
    const module = specialistModuleDefinitions[0]
    const questions = buildSpecialistQuestionForm(module.id, 'p_compatibility', 'test')
    const answers = Object.fromEntries(questions.map((question) => [
      question.id,
      { questionId: question.id, value: 'prefer_not_to_answer' },
    ])) as AnswerMap
    const assignment = { moduleId: module.id, strategy: 'balanced-hash-v1' as const }
    const specialist = buildSpecialistResearchSubmission({
      studyId: 'community-2026',
      participantId: 'p_compatibility',
      administration: 'test',
      consent: endpointConsent(),
      moduleId: module.id,
      moduleVersion: module.version,
      assignment,
      bankVersion: QUESTION_BANK_VERSION,
      scoringVersion: RESULT_SCORING_VERSION,
      criterion: { selectedIds: [], noneOrUnsure: true, confidence: 'low' },
      answers,
      questions,
      constructWeightsByQuestionId: module.constructWeightsByQuestionId,
      outcome: scoreSpecialistModule(module.id, answers),
      startedAt: '2026-08-10T12:20:00.000Z',
      completedAt: '2026-08-10T12:25:00.000Z',
      submittedAt: '2026-08-10T12:25:00.000Z',
      submissionId: 'specialist_compatibility',
    })
    const disposition = buildSpecialistDispositionSubmission({
      studyId: 'community-2026',
      participantId: 'p_compatibility',
      administration: 'test',
      consent: endpointConsent(),
      moduleId: module.id,
      moduleVersion: module.version,
      assignment,
      disposition: 'declined-before-start',
      answeredCount: 0,
      startedAt: '2026-08-10T12:20:00.000Z',
      occurredAt: '2026-08-10T12:20:00.000Z',
      submissionId: 'disposition_compatibility',
    })

    expect(questions.length).toBeGreaterThan(0)
    expect(validateSubmission(specialist, collectorEnvironment)).toBe(true)
    expect(validateSubmission(disposition, collectorEnvironment)).toBe(true)
  })
})
