import { describe, expect, it, vi } from 'vitest'
import type { AnswerMap, Question } from '../types'
import {
  buildResearchSubmission,
  buildSpecialistDispositionSubmission,
  buildSpecialistResearchSubmission,
  getOrCreateParticipantId,
  MODIFIER_LABEL_ROSTER_FINGERPRINT,
  PRIMARY_LABEL_ROSTER_FINGERPRINT,
  submitResearchSubmission,
  type ResearchConsent,
} from './index'
import {
  SPECIALIST_ASSIGNMENT_ROSTER_VERSION,
  SPECIALIST_ASSIGNMENT_STRATEGY,
} from '../specialist'
import { TAXONOMY_VERSION } from '../data/labelTaxonomy'
import { PRIMARY_MEASUREMENT_VERSION } from '../data/primaryMeasurement'
import { MODIFIER_MEASUREMENT_VERSION } from '../data/modifierMeasurement'

const consent: ResearchConsent = {
  ageConfirmed: true,
  voluntaryParticipation: true,
  dataUseAccepted: true,
  consentVersion: 'test-consent',
  consentedAt: '2026-07-18T12:00:00.000Z',
  disclosureSnapshot: {
    endpointConfigured: false,
    transferAndWithdrawalNotice: 'No endpoint.',
    retentionNotice: 'No retention notice.',
    contactNotice: 'No contact configured.',
  },
}

const question: Question = {
  id: 'q-test',
  prompt: 'Test prompt',
  domain: 'test-domain',
  layer: 'normative',
  theoryContext: 'mixed',
  responseType: 'likert7',
  tier: 'quick',
  axisWeights: [{ axisId: 'test-axis', weight: -1 }],
  reviewStatus: 'approved',
  sources: [{ title: 'Source', url: 'https://example.test/source' }],
  evidenceNote: 'Adults in a defined population over one year.',
  contextNote: 'This is neutral background context for interpreting the item without changing its wording or scoring.',
}

const answers: AnswerMap = {
  'q-test': { questionId: 'q-test', value: 2 },
}

const timing = {
  startedAt: '2026-07-18T12:10:00.000Z',
  completedAt: '2026-07-18T12:20:00.000Z',
  resumed: false,
}

describe('research submission', () => {
  it('uses a stable pseudonymous participant id', () => {
    const values = new Map<string, string>()
    const storage = {
      getItem: (key: string) => values.get(key) ?? null,
      setItem: (key: string, value: string) => values.set(key, value),
    }
    const first = getOrCreateParticipantId(storage, () => 'abc-123')
    const second = getOrCreateParticipantId(storage, () => 'different')
    expect(first).toBe('p_abc-123')
    expect(second).toBe(first)
  })

  it('uses separate participant ids for separate studies', () => {
    const values = new Map<string, string>()
    const storage = {
      getItem: (key: string) => values.get(key) ?? null,
      setItem: (key: string, value: string) => values.set(key, value),
    }

    const firstStudy = getOrCreateParticipantId(storage, () => 'study-one-id', 'study-one')
    const secondStudy = getOrCreateParticipantId(storage, () => 'study-two-id', 'study-two')

    expect(firstStudy).toBe('p_study-one-id')
    expect(secondStudy).toBe('p_study-two-id')
  })

  it('builds a versioned core record with item metadata, timing, criterion labels, and specialist assignment', () => {
    const submission = buildResearchSubmission({
      studyId: 'pilot one!',
      participantId: 'p_abc-123',
      administration: 'test',
      bankVersion: 'bank-v1',
      scoringVersion: 'score-v1',
      tier: 'quick',
      consent,
      identity: {
        selfLabelId: 'market-liberal',
        selfReportedIdeologies: '  Mutualism;  Pan-Africanism  ',
        ageBand: '25-34',
      },
      predictedLabelIds: ['market-liberal', 'classical-liberalism'],
      predictedModifierIds: ['religious-nationalism', 'progressivism'],
      specialistAssignment: {
        moduleId: 'feminist-faction-module',
        strategy: SPECIALIST_ASSIGNMENT_STRATEGY,
        rosterVersion: SPECIALIST_ASSIGNMENT_ROSTER_VERSION,
      },
      answers,
      questions: [question],
      submittedAt: '2026-07-18T12:30:00.000Z',
      ...timing,
    })

    expect(submission.recordType).toBe('core')
    expect(submission.studyId).toBe('pilotone')
    expect(submission.identity.selfLabelId).toBe('market-liberal')
    expect(submission.identity.selfReportedIdeologies).toBe('Mutualism; Pan-Africanism')
    expect(submission.predictedLabelIds).toEqual(['market-liberal', 'classical-liberalism'])
    expect(submission.predictedModifierIds).toEqual(['religious-nationalism', 'progressivism'])
    expect(submission.taxonomyVersion).toBe(TAXONOMY_VERSION)
    expect(submission.primaryMeasurementVersion).toBe(PRIMARY_MEASUREMENT_VERSION)
    expect(submission.modifierMeasurementVersion).toBe(MODIFIER_MEASUREMENT_VERSION)
    expect(submission.primaryLabelIds).toContain('conservative')
    expect(submission.modifierLabelIds).toContain('technocratic-orientation')
    expect(submission.modifierLabelIds).not.toContain('theocrat')
    expect(submission.primaryLabelRosterFingerprint).toBe(PRIMARY_LABEL_ROSTER_FINGERPRINT)
    expect(submission.modifierLabelRosterFingerprint).toBe(MODIFIER_LABEL_ROSTER_FINGERPRINT)
    expect(submission.specialistAssignment?.moduleId).toBe('feminist-faction-module')
    expect(submission.specialistAssignment?.rosterVersion).toBe(SPECIALIST_ASSIGNMENT_ROSTER_VERSION)
    expect(submission.durationMs).toBe(600_000)
    expect(submission.presentationOrder).toEqual(['q-test'])
    expect(submission.form).toMatchObject({
      assignedItemCount: 1,
      requestedItemCount: null,
    })
    expect(submission.form.fingerprint).toMatch(/^rf_[0-9a-f]{8}$/)
    expect(submission.sampling).toEqual({
      design: 'open-opt-in-nonprobability',
      populationInference: false,
      weighting: 'none',
      recruitmentSource: 'direct-or-unknown',
      recruitmentSourceProvenance: 'url-parameter-unverified',
    })
    expect(submission.itemMap[0]).toMatchObject({
      questionId: 'q-test',
      prompt: 'Test prompt',
      domain: 'test-domain',
      theoryContext: 'mixed',
      reverseScored: false,
      contextNote: 'This is neutral background context for interpreting the item without changing its wording or scoring.',
      sourceCount: 1,
    })
    expect(submission.itemMap[0].responseOptions).toContainEqual({
      value: 'prefer_not_to_answer',
      label: 'Prefer not to answer',
    })
  })

  it('builds a separate specialist record with construct weights and pre-result self-identification', () => {
    const submission = buildSpecialistResearchSubmission({
      studyId: 'pilot',
      participantId: 'p_abc-123',
      administration: 'test',
      consent,
      moduleId: 'feminist-faction-module',
      moduleVersion: '2026-08-v1',
      assignment: {
        moduleId: 'feminist-faction-module',
        strategy: SPECIALIST_ASSIGNMENT_STRATEGY,
        rosterVersion: SPECIALIST_ASSIGNMENT_ROSTER_VERSION,
      },
      bankVersion: 'bank-v1',
      scoringVersion: 'score-v1',
      criterion: { selectedIds: ['liberal-feminism'], noneOrUnsure: false, confidence: 'high' },
      answers,
      questions: [question],
      constructWeightsByQuestionId: { 'q-test': { 'legal-equality-reform': 1 } },
      outcome: {
        moduleId: 'feminist-faction-module',
        constructScores: { 'legal-equality-reform': 0.8 },
        matches: [{ id: 'liberal-feminism', name: 'Liberal Feminism', status: 'existing-primary', fit: 0.9 }],
      },
      submittedAt: '2026-07-18T12:30:00.000Z',
      startedAt: timing.startedAt,
      completedAt: timing.completedAt,
    })

    expect(submission.recordType).toBe('specialist')
    expect(submission.moduleId).toBe('feminist-faction-module')
    expect(submission.criterion.selectedIds).toEqual(['liberal-feminism'])
    expect(submission.constructScores['legal-equality-reform']).toBe(0.8)
    expect(submission.itemMap[0].constructWeights).toEqual({ 'legal-equality-reform': 1 })
    expect(submission.durationMs).toBe(600_000)
  })

  it('builds a lightweight specialist disposition record for explicit nonresponse', () => {
    const submission = buildSpecialistDispositionSubmission({
      studyId: 'pilot',
      participantId: 'p_abc-123',
      administration: 'test',
      consent,
      moduleId: 'identity-sovereignty-module',
      moduleVersion: '2026-08-v1',
      assignment: {
        moduleId: 'identity-sovereignty-module',
        strategy: SPECIALIST_ASSIGNMENT_STRATEGY,
        rosterVersion: SPECIALIST_ASSIGNMENT_ROSTER_VERSION,
      },
      disposition: 'declined-after-partial',
      answeredCount: 4,
      startedAt: '2026-07-18T12:10:00.000Z',
      occurredAt: '2026-07-18T12:14:00.000Z',
    })

    expect(submission.recordType).toBe('specialist-disposition')
    expect(submission.disposition).toBe('declined-after-partial')
    expect(submission.answeredCount).toBe(4)
    expect(submission.durationMs).toBe(240_000)
  })

  it('does not transmit when no endpoint is configured', async () => {
    const send = vi.fn<typeof fetch>()
    const submission = buildResearchSubmission({
      studyId: 'pilot',
      participantId: 'p_1',
      administration: 'test',
      bankVersion: 'bank-v1',
      scoringVersion: 'score-v1',
      tier: 'quick',
      consent,
      identity: {},
      predictedLabelIds: [],
      answers,
      questions: [question],
      ...timing,
    })
    await expect(submitResearchSubmission(submission, undefined, send)).resolves.toEqual({ status: 'export-only' })
    expect(send).not.toHaveBeenCalled()
  })

  it('rejects a record whose answers do not match its assigned instrument', () => {
    expect(() => buildResearchSubmission({
      studyId: 'pilot',
      participantId: 'p_1',
      administration: 'test',
      bankVersion: 'bank-v1',
      scoringVersion: 'score-v1',
      tier: 'quick',
      consent,
      identity: {},
      predictedLabelIds: [],
      answers: {},
      questions: [question],
      ...timing,
    })).toThrow(/answer coverage mismatch/i)
  })

  it('posts JSON without credentials to a configured HTTPS endpoint', async () => {
    const send = vi.fn<typeof fetch>().mockResolvedValue(new Response(null, { status: 202 }))
    const submission = buildResearchSubmission({
      studyId: 'pilot',
      participantId: 'p_1',
      administration: 'retest',
      bankVersion: 'bank-v1',
      scoringVersion: 'score-v1',
      tier: 'quick',
      consent,
      identity: {},
      predictedLabelIds: [],
      answers,
      questions: [question],
      ...timing,
    })

    await expect(submitResearchSubmission(submission, 'https://study.example.test/submit', send)).resolves.toEqual({
      status: 'submitted',
      endpoint: 'https://study.example.test/submit',
    })
    expect(send).toHaveBeenCalledWith('https://study.example.test/submit', expect.objectContaining({
      method: 'POST',
      credentials: 'omit',
      referrerPolicy: 'no-referrer',
    }))
  })

  it('rejects insecure remote endpoints before sending', async () => {
    const send = vi.fn<typeof fetch>()
    const submission = buildResearchSubmission({
      studyId: 'pilot',
      participantId: 'p_1',
      administration: 'test',
      bankVersion: 'bank-v1',
      scoringVersion: 'score-v1',
      tier: 'quick',
      consent,
      identity: {},
      predictedLabelIds: [],
      answers,
      questions: [question],
      ...timing,
    })
    await expect(submitResearchSubmission(submission, 'http://study.example.test/submit', send)).resolves.toEqual({
      status: 'failed',
      reason: 'The website collection endpoint must use HTTPS.',
    })
    expect(send).not.toHaveBeenCalled()
  })
})
