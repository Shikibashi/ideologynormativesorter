import type { Question } from './types'

export const DEFAULT_CONFIDENCE_PROMPT = 'How confident are you in the answer you just gave?'
export const DEFAULT_PRIORITY_PROMPT = 'How important is the policy or strategy you selected, relative to other changes?'
export const SKIP_SALIENCE_LABEL = 'Skip rating and exclude this answer from my result'
export const SALIENCE_LEVELS = [
  { label: 'Low', value: 1 },
  { label: 'Medium', value: 3 },
  { label: 'High', value: 5 },
] as const

const LIKERT7_LABELS: Record<number, string> = {
  '-3': 'Strongly disagree',
  '-2': 'Disagree',
  '-1': 'Somewhat disagree',
  '0': 'Neutral',
  '1': 'Somewhat agree',
  '2': 'Agree',
  '3': 'Strongly agree',
}

const LIKERT5_LABELS: Record<number, string> = {
  '-2': 'Disagree',
  '-1': 'Somewhat disagree',
  '0': 'Neutral',
  '1': 'Somewhat agree',
  '2': 'Agree',
}

export interface PresentedResponseOption {
  value: number | 'dont_know' | 'prefer_not_to_answer'
  label: string
  optionId?: string
}

export function scaleValues(responseType: Question['responseType']): number[] {
  return responseType === 'likert5' ? [-2, -1, 0, 1, 2] : [-3, -2, -1, 0, 1, 2, 3]
}

export function scaleLabel(responseType: Question['responseType'], value: number): string {
  return (responseType === 'likert5' ? LIKERT5_LABELS : LIKERT7_LABELS)[value]
}

/** Exact primary response options shown in the current research UI. */
export function presentedResponseOptions(question: Question, includeRefusal = false): PresentedResponseOption[] {
  const options: PresentedResponseOption[] = question.responseType === 'statementChoice'
    ? (question.statementOptions ?? []).map((option, index) => ({ value: index, label: option.text, optionId: option.id }))
    : scaleValues(question.responseType).map((value) => ({ value, label: scaleLabel(question.responseType, value) }))

  if (question.layer === 'descriptive' || question.allowDontKnow === true) {
    options.push({ value: 'dont_know', label: "I don't know" })
  }
  if (includeRefusal) options.push({ value: 'prefer_not_to_answer', label: 'Prefer not to answer' })
  return options
}
