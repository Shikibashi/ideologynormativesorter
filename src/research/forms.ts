import type { Question } from '../types'
import type { ResearchAdministration } from './index'

export const RESEARCH_FORM_VERSION = 'profile-form-v3'

function hash32(value: string): number {
  let hash = 2166136261
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index)
    hash = Math.imul(hash, 16777619)
  }
  return hash >>> 0
}

function primaryAxis(question: Question): string {
  const weights = question.responseType === 'statementChoice'
    ? question.statementOptions?.flatMap((option) => option.axisWeights) ?? []
    : question.axisWeights
  if (weights.length === 0) return String(question.domain)
  return String([...weights].sort((a, b) => Math.abs(b.weight) - Math.abs(a.weight))[0].axisId)
}

function shuffled<T>(values: T[], seed: string, key: (value: T) => string): T[] {
  return [...values].sort((left, right) => {
    const leftHash = hash32(`${seed}:${key(left)}`)
    const rightHash = hash32(`${seed}:${key(right)}`)
    return leftHash - rightHash || key(left).localeCompare(key(right))
  })
}

export function researchFormSize(search = window.location.search): number | null {
  const params = new URLSearchParams(search)
  // Public contribution links now use the complete profile selected on the
  // ordinary start screen. Keep explicit matrix sizes only for controlled
  // research URLs so an old public link cannot silently launch a short form.
  if (params.get('research') !== '1') return null
  const raw = params.get('formSize')
  if (!raw) return null
  const parsed = Number.parseInt(raw, 10)
  return Number.isFinite(parsed) && parsed >= 12 ? parsed : null
}

export function buildContributionQuestionForm(
  questionPool: Question[],
  participantId: string,
  administration: ResearchAdministration,
  requestedSize: number | null,
): Question[] {
  // With no explicit research matrix size, contribution mode is an optional
  // layer on the exact selected consumer profile, not a separate assessment.
  if (requestedSize === null) return [...questionPool]
  return buildResearchQuestionForm(questionPool, participantId, administration, requestedSize)
}

export function buildResearchQuestionForm(
  questionPool: Question[],
  participantId: string,
  administration: ResearchAdministration,
  requestedSize: number | null,
): Question[] {
  const eligible = questionPool.filter((question) => question.active !== false && question.reviewStatus !== 'needs-rewrite')
  // Item assignment must stay fixed between test and retest. Administration is
  // used only for presentation order so stability is not confounded with two
  // different matrix forms.
  const assignmentSeed = `${RESEARCH_FORM_VERSION}:${participantId}:assignment`
  const presentationSeed = `${RESEARCH_FORM_VERSION}:${participantId}:${administration}:presentation`
  const targetSize = requestedSize === null ? eligible.length : Math.min(requestedSize, eligible.length)

  const groups = new Map<string, Question[]>()
  for (const question of eligible) {
    const key = `${question.layer}:${primaryAxis(question)}`
    const group = groups.get(key) ?? []
    group.push(question)
    groups.set(key, group)
  }

  const orderedGroups = shuffled([...groups.entries()], assignmentSeed, ([key]) => key)
    .map(([key, values]) => [key, shuffled(values, `${assignmentSeed}:${key}`, (question) => String(question.id))] as const)
  const selected: Question[] = []
  let depth = 0
  while (selected.length < targetSize) {
    let added = false
    for (const [, group] of orderedGroups) {
      const question = group[depth]
      if (!question) continue
      selected.push(question)
      added = true
      if (selected.length === targetSize) break
    }
    if (!added) break
    depth += 1
  }

  return shuffled(selected, presentationSeed, (question) => String(question.id))
}

export function researchFormFingerprint(questions: Question[]): string {
  const canonical = questions.map((question) => String(question.id)).sort().join('|')
  return `rf_${hash32(`${RESEARCH_FORM_VERSION}:${canonical}`).toString(16).padStart(8, '0')}`
}
