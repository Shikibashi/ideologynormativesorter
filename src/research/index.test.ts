import { describe, expect, it, vi } from 'vitest'
import type { AnswerMap, Question } from '../types'
import {
  buildResearchSubmission,
  buildSpecialistDispositionSubmission,
  buildSpecialistResearchSubmission,
  getOrCreateParticipantId,
  submitResearchSubmission,
  type ResearchConsent,
} from './index'

const consent: ResearchConsent = {
  ageConfirmed: true,
  voluntaryParticipation: true,
  dataUseAccepted: true,
  consentVersion: 'test-consent',
  consentedAt: '2026-07-18T12:00:00.000Z',
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
      specialistAssignment: { moduleId: 'feminist-faction-module', strategy: 'balanced-hash-v1' },
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
    expect(submission.specialistAssignment?.moduleId).toBe('feminist-faction-module')
    expect(submission.durationMs).toBe(600_000)
    expect(submission.presentationOrder).toEqual(['q-test'])
    expect(submission.itemMap[0]).toMatchObject({
      questionId: 'q-test',
      reverseScored: false,
      sourceCount: 1,
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
      assignment: { moduleId: 'feminist-faction-module', strategy: 'balanced-hash-v1' },
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
      assignment: { moduleId: 'identity-sovereignty-module', strategy: 'balanced-hash-v1' },
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
      reason: 'Study endpoint must use HTTPS outside local development.',
    })
    expect(send).not.toHaveBeenCalled()
  })
})
