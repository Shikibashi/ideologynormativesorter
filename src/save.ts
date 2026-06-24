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
    return JSON.parse(raw) as QuizSave
  } catch {
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
  return { tier: save.tier, answered: save.index, total: save.questions.length }
}
