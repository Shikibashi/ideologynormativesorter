import type { AnswerMap, Question, QuizTier } from '../types'

export const RESEARCH_SCHEMA_VERSION = '2026-07-v2'
export const RESEARCH_CONSENT_VERSION = '2026-07-18-v1'
const PARTICIPANT_STORAGE_KEY = 'political-judgment-research-participant-v1'

export type ResearchAdministration = 'test' | 'retest'

export interface ResearchConsent {
  ageConfirmed: true
  voluntaryParticipation: true
  dataUseAccepted: true
  consentVersion: string
  consentedAt: string
}

export interface ResearchIdentity {
  selfLabelId?: string
  ageBand?: '18-24' | '25-34' | '35-44' | '45-54' | '55-64' | '65+'
  genderGroup?: 'woman' | 'man' | 'nonbinary-or-another'
}

export interface ResearchItemSnapshot {
  questionId: string
  layer: Question['layer']
  responseType: Question['responseType']
  axisWeights: Array<{ axisId: string; weight: number }>
  reverseScored: boolean
  reviewStatus: Question['reviewStatus']
  evidenceNote?: string
  sourceCount: number
}

export interface ResearchSubmission {
  schemaVersion: string
  studyId: string
  participantId: string
  administration: ResearchAdministration
  submittedAt: string
  startedAt: string
  completedAt: string
  durationMs: number
  resumed: boolean
  presentationOrder: string[]
  bankVersion: string
  scoringVersion: string
  tier: QuizTier
  consent: ResearchConsent
  identity: ResearchIdentity
  predictedLabelIds: string[]
  answers: AnswerMap
  itemMap: ResearchItemSnapshot[]
}

export type ResearchSubmissionStatus =
  | { status: 'submitted'; endpoint: string }
  | { status: 'export-only' }
  | { status: 'failed'; reason: string }

interface StorageLike {
  getItem(key: string): string | null
  setItem(key: string, value: string): void
}

function safeToken(value: string): string {
  return value.replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 96)
}

function durationBetween(startedAt: string, completedAt: string): number {
  const started = Date.parse(startedAt)
  const completed = Date.parse(completedAt)
  if (!Number.isFinite(started) || !Number.isFinite(completed)) return 0
  return Math.max(0, completed - started)
}

export function isResearchMode(search = window.location.search): boolean {
  return new URLSearchParams(search).get('research') === '1'
}

export function researchAdministration(search = window.location.search): ResearchAdministration {
  return new URLSearchParams(search).get('administration') === 'retest' ? 'retest' : 'test'
}

export function researchStudyId(search = window.location.search): string {
  const configured = safeToken(new URLSearchParams(search).get('study') ?? '')
  return configured || 'public-pilot'
}

export function getOrCreateParticipantId(
  storage: StorageLike = window.localStorage,
  createId: () => string = () => crypto.randomUUID(),
): string {
  const existing = storage.getItem(PARTICIPANT_STORAGE_KEY)
  if (existing) return existing
  const participantId = `p_${safeToken(createId())}`
  storage.setItem(PARTICIPANT_STORAGE_KEY, participantId)
  return participantId
}

export function buildResearchSubmission(input: {
  studyId: string
  participantId: string
  administration: ResearchAdministration
  bankVersion: string
  scoringVersion: string
  tier: QuizTier
  consent: ResearchConsent
  identity: ResearchIdentity
  predictedLabelIds: string[]
  answers: AnswerMap
  questions: Question[]
  startedAt: string
  completedAt: string
  resumed: boolean
  submittedAt?: string
}): ResearchSubmission {
  return {
    schemaVersion: RESEARCH_SCHEMA_VERSION,
    studyId: safeToken(input.studyId) || 'public-pilot',
    participantId: safeToken(input.participantId),
    administration: input.administration,
    submittedAt: input.submittedAt ?? new Date().toISOString(),
    startedAt: input.startedAt,
    completedAt: input.completedAt,
    durationMs: durationBetween(input.startedAt, input.completedAt),
    resumed: input.resumed,
    presentationOrder: input.questions.map((question) => String(question.id)),
    bankVersion: input.bankVersion,
    scoringVersion: input.scoringVersion,
    tier: input.tier,
    consent: input.consent,
    identity: input.identity,
    predictedLabelIds: input.predictedLabelIds.slice(0, 5),
    answers: input.answers,
    itemMap: input.questions.map((question) => ({
      questionId: String(question.id),
      layer: question.layer,
      responseType: question.responseType,
      axisWeights: question.axisWeights.map((weight) => ({ axisId: String(weight.axisId), weight: weight.weight })),
      reverseScored: question.reverseScored === true,
      reviewStatus: question.reviewStatus,
      evidenceNote: question.evidenceNote,
      sourceCount: question.sources?.length ?? 0,
    })),
  }
}

export async function submitResearchSubmission(
  submission: ResearchSubmission,
  endpoint: string | undefined,
  send: typeof fetch = fetch,
): Promise<ResearchSubmissionStatus> {
  if (!endpoint?.trim()) return { status: 'export-only' }
  let resolvedEndpoint: URL
  try {
    resolvedEndpoint = new URL(endpoint, window.location.href)
  } catch {
    return { status: 'failed', reason: 'Study endpoint is not a valid URL.' }
  }
  const localDevelopment = ['localhost', '127.0.0.1', '[::1]'].includes(resolvedEndpoint.hostname)
  if (resolvedEndpoint.protocol !== 'https:' && !localDevelopment) {
    return { status: 'failed', reason: 'Study endpoint must use HTTPS outside local development.' }
  }
  try {
    const response = await send(resolvedEndpoint.toString(), {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(submission),
      credentials: 'omit',
      referrerPolicy: 'no-referrer',
    })
    if (!response.ok) return { status: 'failed', reason: `Study endpoint returned HTTP ${response.status}.` }
    return { status: 'submitted', endpoint: resolvedEndpoint.toString() }
  } catch (error) {
    const reason = error instanceof Error ? error.message : 'Unknown network error.'
    return { status: 'failed', reason }
  }
}

export function downloadResearchSubmission(submission: ResearchSubmission): void {
  const filename = `${submission.studyId}-${submission.participantId}-${submission.administration}.json`
  const blob = new Blob([JSON.stringify(submission, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  anchor.click()
  URL.revokeObjectURL(url)
}
