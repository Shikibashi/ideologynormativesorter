import type { AnswerMap, Question, QuizTier } from './types'

const SAVE_KEY = 'ideology-quiz-save'

export interface QuizSave {
  questions: Question[]
  answers: AnswerMap
  index: number
  tier: QuizTier
}

export function saveQuizState(state: QuizSave): void {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(state))
  } catch {
    // localStorage full or disabled — silently skip
  }
}

export function loadQuizState(): QuizSave | null {
  try {
    const raw = localStorage.getItem(SAVE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (isQuizSave(parsed)) return parsed
    clearQuizState()
    return null
  } catch {
    clearQuizState()
    return null
  }
}

export function clearQuizState(): void {
  try {
    localStorage.removeItem(SAVE_KEY)
  } catch {
    // noop
  }
}

export function getQuizProgress(): { tier: QuizTier; answered: number; total: number } | null {
  const save = loadQuizState()
  if (!save) return null
  return { tier: save.tier, answered: Math.min(Object.keys(save.answers).length, save.questions.length), total: save.questions.length }
}

function isQuizSave(value: unknown): value is QuizSave {
  if (!value || typeof value !== 'object') return false
  const candidate = value as Partial<QuizSave>
  const index = candidate.index
  return (
    Array.isArray(candidate.questions) &&
    candidate.questions.length > 0 &&
    candidate.answers !== null &&
    typeof candidate.answers === 'object' &&
    !Array.isArray(candidate.answers) &&
    Number.isInteger(index) &&
    typeof index === 'number' &&
    index >= 0 &&
    index < candidate.questions.length &&
    (candidate.tier === 'quick' || candidate.tier === 'moderate' || candidate.tier === 'extensive')
  )
}
