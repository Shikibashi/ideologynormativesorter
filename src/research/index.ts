import type { AnswerMap, Question, QuizTier } from '../types'
import { getQuestionHelpText, getSalienceHelpText } from '../data/questionHelpText'
import {
  DEFAULT_CONFIDENCE_PROMPT,
  SALIENCE_LEVELS,
  presentedResponseOptions,
  type PresentedResponseOption,
} from '../questionPresentation'
import { RESEARCH_FORM_VERSION, researchFormFingerprint } from './forms'
import type {
  SpecialistCriterionResponse,
  SpecialistMatch,
  SpecialistModuleAssignment,
  SpecialistModuleId,
  SpecialistOutcome,
} from '../specialist'

export const RESEARCH_SCHEMA_VERSION = '2026-08-v6'
export const RESEARCH_CONSENT_VERSION = '2026-08-10-v6'
export const RESEARCH_QUALITY_RULE_VERSION = 'data-quality-v2'
export const PUBLIC_RESEARCH_ENTRYPOINT = '?contribute=1&collection=community-2026'
const PARTICIPANT_STORAGE_KEY = 'political-judgment-research-participant-v1'

export type ResearchAdministration = 'test' | 'retest'
export type SpecialistDisposition = 'declined-before-start' | 'declined-after-partial' | 'declined-after-completion'

export interface ResearchConsent {
  ageConfirmed: true
  voluntaryParticipation: true
  dataUseAccepted: true
  consentVersion: string
  consentedAt: string
  disclosureSnapshot: {
    endpointConfigured: boolean
    transferAndWithdrawalNotice: string
    retentionNotice: string
    contactNotice: string
  }
}

export interface ResearchIdentity {
  selfLabelId?: string
  /** Optional respondent-supplied names of one or more ideologies or traditions. */
  selfReportedIdeologies?: string
  ageBand?: '18-24' | '25-34' | '35-44' | '45-54' | '55-64' | '65+'
  genderGroup?: 'woman' | 'man' | 'nonbinary-or-another'
}

export interface ResearchItemSnapshot {
  questionId: string
  prompt: string
  helpText: string
  domain: string
  layer: Question['layer']
  theoryContext: Question['theoryContext']
  responseType: Question['responseType']
  responseOptions: PresentedResponseOption[]
  axisWeights: Array<{ axisId: string; weight: number }>
  statementOptions?: Array<{
    id: string
    text: string
    axisWeights: Array<{ axisId: string; weight: number }>
  }>
  constructWeights?: Record<string, number>
  reverseScored: boolean
  confidencePrompt?: string
  priorityPrompt?: string
  salience?: {
    kind: 'confidence' | 'priority'
    prompt: string
    helpText: string
    options: Array<{ value: number | 'skipped'; label: string }>
  }
  reviewStatus: Question['reviewStatus']
  evidenceNote?: string
  contextNote?: string
  sourceCount: number
}

interface ResearchRecordBase {
  schemaVersion: string
  submissionId: string
  studyId: string
  participantId: string
  administration: ResearchAdministration
  submittedAt: string
  startedAt: string
  completedAt: string
  durationMs: number
  consent: ResearchConsent
  locale: string
  qualityRuleVersion: string
}

export interface ResearchFormMetadata {
  algorithmVersion: string
  requestedItemCount: number | null
  assignedItemCount: number
  fingerprint: string
}

export interface ResearchSamplingMetadata {
  design: 'open-opt-in-nonprobability'
  populationInference: false
  weighting: 'none'
  recruitmentSource: string
  recruitmentSourceProvenance: 'url-parameter-unverified'
}

export interface CoreResearchSubmission extends ResearchRecordBase {
  recordType: 'core'
  resumed: boolean
  presentationOrder: string[]
  form: ResearchFormMetadata
  sampling: ResearchSamplingMetadata
  bankVersion: string
  scoringVersion: string
  tier: QuizTier
  identity: ResearchIdentity
  predictedLabelIds: string[]
  specialistAssignment?: SpecialistModuleAssignment
  answers: AnswerMap
  itemMap: ResearchItemSnapshot[]
}

export interface SpecialistResearchSubmission extends ResearchRecordBase {
  recordType: 'specialist'
  moduleId: SpecialistModuleId
  moduleVersion: string
  assignment: SpecialistModuleAssignment
  presentationOrder: string[]
  bankVersion: string
  scoringVersion: string
  criterion: SpecialistCriterionResponse
  answers: AnswerMap
  itemMap: ResearchItemSnapshot[]
  constructScores: Record<string, number>
  matches: SpecialistMatch[]
}

export interface SpecialistDispositionSubmission extends ResearchRecordBase {
  recordType: 'specialist-disposition'
  moduleId: SpecialistModuleId
  moduleVersion: string
  assignment: SpecialistModuleAssignment
  disposition: SpecialistDisposition
  answeredCount: number
}

export type ResearchSubmission = CoreResearchSubmission | SpecialistResearchSubmission | SpecialistDispositionSubmission

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

function normalizeSelfReportedIdeologies(value?: string): string | undefined {
  const normalized = value?.replace(/\s+/g, ' ').trim().slice(0, 240)
  return normalized || undefined
}

function normalizeLocale(value?: string): string {
  return value?.replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 32) || 'und'
}

function validateAnswerCoverage(answers: AnswerMap, questions: Question[]): void {
  const questionIds = new Set(questions.map((question) => String(question.id)))
  const answerIds = Object.keys(answers)
  const missing = [...questionIds].filter((questionId) => answers[questionId] === undefined)
  const unexpected = answerIds.filter((questionId) => !questionIds.has(questionId))
  if (missing.length > 0 || unexpected.length > 0) {
    throw new Error(`Research answer coverage mismatch: ${missing.length} missing and ${unexpected.length} unexpected item(s).`)
  }
}

function buildItemMap(
  questions: Question[],
  constructWeightsByQuestionId?: Record<string, Record<string, number>>,
): ResearchItemSnapshot[] {
  return questions.map((question) => ({
    questionId: String(question.id),
    prompt: question.prompt,
    helpText: question.helpText ?? getQuestionHelpText(question),
    domain: String(question.domain),
    layer: question.layer,
    theoryContext: question.theoryContext,
    responseType: question.responseType,
    responseOptions: presentedResponseOptions(question, true),
    axisWeights: question.axisWeights.map((weight) => ({ axisId: String(weight.axisId), weight: weight.weight })),
    statementOptions: question.statementOptions?.map((option) => ({
      id: option.id,
      text: option.text,
      axisWeights: option.axisWeights.map((weight) => ({ axisId: String(weight.axisId), weight: weight.weight })),
    })),
    constructWeights: constructWeightsByQuestionId?.[String(question.id)],
    reverseScored: question.reverseScored === true,
    confidencePrompt: question.layer === 'descriptive'
      ? question.confidencePrompt ?? DEFAULT_CONFIDENCE_PROMPT
      : undefined,
    priorityPrompt: question.priorityPrompt,
    salience: question.layer === 'descriptive' || question.layer === 'prescriptive'
      ? {
          kind: question.layer === 'descriptive' ? 'confidence' : 'priority',
          prompt: question.layer === 'descriptive'
            ? question.confidencePrompt ?? DEFAULT_CONFIDENCE_PROMPT
            : question.priorityPrompt ?? '',
          helpText: getSalienceHelpText(question.layer === 'descriptive' ? 'confidence' : 'priority'),
          options: [
            ...SALIENCE_LEVELS.map((level) => ({ value: level.value, label: level.label })),
            { value: 'skipped' as const, label: 'Skip rating' },
          ],
        }
      : undefined,
    reviewStatus: question.reviewStatus,
    evidenceNote: question.evidenceNote,
    contextNote: question.contextNote,
    sourceCount: question.sources?.length ?? 0,
  }))
}

export function isResearchMode(search = window.location.search): boolean {
  const params = new URLSearchParams(search)
  return params.get('contribute') === '1' || params.get('research') === '1'
}

export function researchAdministration(search = window.location.search): ResearchAdministration {
  return new URLSearchParams(search).get('administration') === 'retest' ? 'retest' : 'test'
}

export function researchStudyId(search = window.location.search): string {
  const params = new URLSearchParams(search)
  const configured = safeToken(params.get('collection') ?? params.get('study') ?? '')
  return configured || 'community-2026'
}

export function researchRecruitmentSource(search = window.location.search): string {
  const configured = safeToken(new URLSearchParams(search).get('source') ?? '')
  return configured || 'direct-or-unknown'
}

export function getOrCreateParticipantId(
  storage: StorageLike = window.localStorage,
  createId: (() => string) | undefined = undefined,
  studyId = 'community-2026',
): string {
  const storageKey = `${PARTICIPANT_STORAGE_KEY}:${safeToken(studyId) || 'community-2026'}`
  const existing = storage.getItem(storageKey)
  if (existing) return existing
  const participantId = `p_${safeToken((createId ?? (() => crypto.randomUUID()))())}`
  storage.setItem(storageKey, participantId)
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
  specialistAssignment?: SpecialistModuleAssignment
  answers: AnswerMap
  questions: Question[]
  startedAt: string
  completedAt: string
  resumed: boolean
  requestedFormSize?: number | null
  recruitmentSource?: string
  locale?: string
  submissionId?: string
  submittedAt?: string
}): CoreResearchSubmission {
  validateAnswerCoverage(input.answers, input.questions)
  return {
    schemaVersion: RESEARCH_SCHEMA_VERSION,
    submissionId: safeToken(input.submissionId ?? crypto.randomUUID()),
    recordType: 'core',
    studyId: safeToken(input.studyId) || 'community-2026',
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
    locale: normalizeLocale(input.locale),
    qualityRuleVersion: RESEARCH_QUALITY_RULE_VERSION,
    identity: {
      ...input.identity,
      selfReportedIdeologies: normalizeSelfReportedIdeologies(input.identity.selfReportedIdeologies),
    },
    predictedLabelIds: input.predictedLabelIds.slice(0, 5),
    specialistAssignment: input.specialistAssignment,
    form: {
      algorithmVersion: RESEARCH_FORM_VERSION,
      requestedItemCount: input.requestedFormSize ?? null,
      assignedItemCount: input.questions.length,
      fingerprint: researchFormFingerprint(input.questions),
    },
    sampling: {
      design: 'open-opt-in-nonprobability',
      populationInference: false,
      weighting: 'none',
      recruitmentSource: safeToken(input.recruitmentSource ?? '') || 'direct-or-unknown',
      recruitmentSourceProvenance: 'url-parameter-unverified',
    },
    answers: input.answers,
    itemMap: buildItemMap(input.questions),
  }
}

export function buildSpecialistResearchSubmission(input: {
  studyId: string
  participantId: string
  administration: ResearchAdministration
  consent: ResearchConsent
  moduleId: SpecialistModuleId
  moduleVersion: string
  assignment: SpecialistModuleAssignment
  bankVersion: string
  scoringVersion: string
  criterion: SpecialistCriterionResponse
  answers: AnswerMap
  questions: Question[]
  constructWeightsByQuestionId: Record<string, Record<string, number>>
  outcome: SpecialistOutcome
  startedAt: string
  completedAt: string
  submittedAt?: string
  locale?: string
  submissionId?: string
}): SpecialistResearchSubmission {
  validateAnswerCoverage(input.answers, input.questions)
  return {
    schemaVersion: RESEARCH_SCHEMA_VERSION,
    submissionId: safeToken(input.submissionId ?? crypto.randomUUID()),
    recordType: 'specialist',
    studyId: safeToken(input.studyId) || 'community-2026',
    participantId: safeToken(input.participantId),
    administration: input.administration,
    submittedAt: input.submittedAt ?? new Date().toISOString(),
    startedAt: input.startedAt,
    completedAt: input.completedAt,
    durationMs: durationBetween(input.startedAt, input.completedAt),
    consent: input.consent,
    locale: normalizeLocale(input.locale),
    qualityRuleVersion: RESEARCH_QUALITY_RULE_VERSION,
    moduleId: input.moduleId,
    moduleVersion: input.moduleVersion,
    assignment: input.assignment,
    presentationOrder: input.questions.map((question) => String(question.id)),
    bankVersion: input.bankVersion,
    scoringVersion: input.scoringVersion,
    criterion: input.criterion,
    answers: input.answers,
    itemMap: buildItemMap(input.questions, input.constructWeightsByQuestionId),
    constructScores: input.outcome.constructScores,
    matches: input.outcome.matches,
  }
}

export function buildSpecialistDispositionSubmission(input: {
  studyId: string
  participantId: string
  administration: ResearchAdministration
  consent: ResearchConsent
  moduleId: SpecialistModuleId
  moduleVersion: string
  assignment: SpecialistModuleAssignment
  disposition: SpecialistDisposition
  answeredCount: number
  startedAt?: string
  occurredAt?: string
  submittedAt?: string
  locale?: string
  submissionId?: string
}): SpecialistDispositionSubmission {
  const completedAt = input.occurredAt ?? new Date().toISOString()
  const startedAt = input.startedAt ?? completedAt
  return {
    schemaVersion: RESEARCH_SCHEMA_VERSION,
    submissionId: safeToken(input.submissionId ?? crypto.randomUUID()),
    recordType: 'specialist-disposition',
    studyId: safeToken(input.studyId) || 'community-2026',
    participantId: safeToken(input.participantId),
    administration: input.administration,
    submittedAt: input.submittedAt ?? completedAt,
    startedAt,
    completedAt,
    durationMs: durationBetween(startedAt, completedAt),
    consent: input.consent,
    locale: normalizeLocale(input.locale),
    qualityRuleVersion: RESEARCH_QUALITY_RULE_VERSION,
    moduleId: input.moduleId,
    moduleVersion: input.moduleVersion,
    assignment: input.assignment,
    disposition: input.disposition,
    answeredCount: Math.max(0, Math.floor(input.answeredCount)),
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
    return { status: 'failed', reason: 'The website collection endpoint is not a valid URL.' }
  }
  const localDevelopment = ['localhost', '127.0.0.1', '[::1]'].includes(resolvedEndpoint.hostname)
  if (resolvedEndpoint.protocol !== 'https:' && !localDevelopment) {
    return { status: 'failed', reason: 'The website collection endpoint must use HTTPS.' }
  }
  try {
    const response = await send(resolvedEndpoint.toString(), {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(submission),
      credentials: 'omit',
      referrerPolicy: 'no-referrer',
    })
    if (!response.ok) return { status: 'failed', reason: `The website could not receive the contribution (HTTP ${response.status}).` }
    return { status: 'submitted', endpoint: resolvedEndpoint.toString() }
  } catch (error) {
    const reason = error instanceof Error ? error.message : 'Unknown network error.'
    return { status: 'failed', reason }
  }
}
