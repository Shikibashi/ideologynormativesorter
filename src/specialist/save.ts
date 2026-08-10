import type { AnswerMap } from '../types'
import type { ResearchAdministration } from '../research'
import type { SpecialistModuleId } from './index'

const SAVE_PREFIX = 'political-judgment-specialist-progress-v1'

export interface SpecialistProgressSave {
  participantId: string
  administration: ResearchAdministration
  moduleId: SpecialistModuleId
  answers: AnswerMap
  index: number
  startedAt: string
}

export type SpecialistSaveResult = { saved: true } | { saved: false; reason: string }

function storageKey(participantId: string, administration: ResearchAdministration, moduleId: SpecialistModuleId): string {
  return `${SAVE_PREFIX}:${participantId}:${administration}:${moduleId}`
}

export function saveSpecialistProgress(state: SpecialistProgressSave): SpecialistSaveResult {
  try {
    localStorage.setItem(storageKey(state.participantId, state.administration, state.moduleId), JSON.stringify(state))
    return { saved: true }
  } catch {
    return {
      saved: false,
      reason: "Your browser storage is full or disabled. Follow-up progress won't be saved, but you can still complete the module.",
    }
  }
}

export function loadSpecialistProgress(
  participantId: string,
  administration: ResearchAdministration,
  moduleId: SpecialistModuleId,
): SpecialistProgressSave | null {
  try {
    const raw = localStorage.getItem(storageKey(participantId, administration, moduleId))
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (isSpecialistProgressSave(parsed, participantId, administration, moduleId)) return parsed
    clearSpecialistProgress(participantId, administration, moduleId)
    return null
  } catch {
    clearSpecialistProgress(participantId, administration, moduleId)
    return null
  }
}

export function clearSpecialistProgress(
  participantId: string,
  administration: ResearchAdministration,
  moduleId: SpecialistModuleId,
): boolean {
  try {
    localStorage.removeItem(storageKey(participantId, administration, moduleId))
    return true
  } catch {
    return false
  }
}

function isSpecialistProgressSave(
  value: unknown,
  participantId: string,
  administration: ResearchAdministration,
  moduleId: SpecialistModuleId,
): value is SpecialistProgressSave {
  if (!value || typeof value !== 'object') return false
  const candidate = value as Partial<SpecialistProgressSave>
  return (
    candidate.participantId === participantId
    && candidate.administration === administration
    && candidate.moduleId === moduleId
    && candidate.answers !== null
    && typeof candidate.answers === 'object'
    && !Array.isArray(candidate.answers)
    && typeof candidate.index === 'number'
    && Number.isInteger(candidate.index)
    && candidate.index >= 0
    && typeof candidate.startedAt === 'string'
  )
}
