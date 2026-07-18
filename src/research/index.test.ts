import { describe, expect, it, vi } from 'vitest'
import type { AnswerMap, Question } from '../types'
import {
  buildResearchSubmission,
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

  it('builds a versioned record with item metadata and pre-result criterion labels', () => {
    const submission = buildResearchSubmission({
      studyId: 'pilot one!',
      participantId: 'p_abc-123',
      administration: 'test',
      bankVersion: 'bank-v1',
      scoringVersion: 'score-v1',
      tier: 'quick',
      consent,
      identity: { selfLabelId: 'market-liberal', ageBand: '25-34' },
      predictedLabelIds: ['market-liberal', 'classical-liberalism'],
      answers,
      questions: [question],
      submittedAt: '2026-07-18T12:30:00.000Z',
    })

    expect(submission.studyId).toBe('pilotone')
    expect(submission.identity.selfLabelId).toBe('market-liberal')
    expect(submission.predictedLabelIds).toEqual(['market-liberal', 'classical-liberalism'])
    expect(submission.itemMap[0]).toMatchObject({
      questionId: 'q-test',
      reverseScored: false,
      sourceCount: 1,
    })
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
    })
    await expect(submitResearchSubmission(submission, undefined, send)).resolves.toEqual({ status: 'export-only' })
    expect(send).not.toHaveBeenCalled()
  })

  it('posts JSON without credentials to a configured endpoint', async () => {
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
})
