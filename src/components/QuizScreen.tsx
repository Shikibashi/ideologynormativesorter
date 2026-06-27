import { useEffect, useRef, useState } from 'react'
import { axisById } from '../data/axes'
import { saveQuizState } from '../save'
import type { Answer, AnswerMap, AxisWeight, Question, QuizTier } from '../types'
const SALIENCE_LEVELS: { label: string; value: number }[] = [
  { label: 'Low', value: 1 },
  { label: 'Medium', value: 3 },
  { label: 'High', value: 5 },
]

const LIKERT_LABELS: Record<number, string> = {
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

const LAYER_HELP: Record<Question['layer'], string> = {
  normative: 'This question measures what you think is justified',
  descriptive: 'This question measures what you think usually happens',
  prescriptive: 'This question measures what approach you would prioritize',
}

const SALIENCE_HELP: Record<'confidence' | 'priority', string> = {
  confidence: '“Confidence” means how sure you are that your answer is accurate. This rating controls how strongly this empirical answer counts in your result.',
  priority: '“Priority” means how important this reform is compared with other changes. This rating controls how strongly this policy preference counts in your result.',
}

function scaleValues(responseType: Question['responseType']): number[] {
  return responseType === 'likert5' ? [-2, -1, 0, 1, 2] : [-3, -2, -1, 0, 1, 2, 3]
}

function scaleLabels(responseType: Question['responseType']): Record<number, string> {
  return responseType === 'likert5' ? LIKERT5_LABELS : LIKERT_LABELS
}

function cleanSentence(value: string): string {
  return value.trim().replace(/[.!?]$/, '')
}

function collectAxisWeights(question: Question): AxisWeight[] {
  if (question.axisWeights.length > 0) return question.axisWeights
  return question.statementOptions?.flatMap((option) => option.axisWeights) ?? []
}

function primaryAxisWeight(question: Question): AxisWeight | undefined {
  return collectAxisWeights(question).reduce<AxisWeight | undefined>((primary, current) => {
    if (!primary) return current
    return Math.abs(current.weight) > Math.abs(primary.weight) ? current : primary
  }, undefined)
}

function questionHelpText(question: Question): string {
  const primary = primaryAxisWeight(question)
  const axis = primary ? axisById.get(primary.axisId) : undefined
  if (!axis) return `${LAYER_HELP[question.layer]} for this topic.`

  return `${LAYER_HELP[question.layer]} through “${axis.name}.” ${cleanSentence(axis.description)}.`
}

interface QuizScreenProps {
  questions: Question[]
  onComplete: (answers: AnswerMap) => void
  /** Tier label for save/display only — no filtering logic. */
  tier?: string
  initialAnswers?: AnswerMap
  initialIndex?: number
}

export function QuizScreen({ questions, onComplete, tier, initialAnswers, initialIndex }: QuizScreenProps) {
  const [index, setIndex] = useState(initialIndex ?? 0)
  const [answers, setAnswers] = useState<AnswerMap>(initialAnswers ?? {})
  const [pendingValue, setPendingValue] = useState<Answer['value'] | null>(null)
  const [saveError, setSaveError] = useState<string | null>(null)
  const question = questions[index]
  const selected = answers[question.id]
  const isLast = index === questions.length - 1

  const salienceField = question.layer === 'descriptive' ? 'confidence' : question.layer === 'prescriptive' ? 'priority' : null
  const salienceQuestion = pendingValue !== null && pendingValue !== 'dont_know' ? salienceField : null

  // Persist progress on every answer change (skip on first render if restoring)
  const isRestored = useRef(!!initialAnswers)
  useEffect(() => {
    if (isRestored.current) {
      isRestored.current = false
      return
    }
    if (Object.keys(answers).length > 0 && tier) {
      const result = saveQuizState({ questions, answers, index, tier: tier as QuizTier })
      if (result.saved === false) {
        // eslint-disable-next-line react-hooks/set-state-in-effect -- safe: saveError is not a dep
        setSaveError(result.reason)
      } else {
        setSaveError(null)
      }
    }
  }, [answers, index])

  function commit(value: Answer['value'], rating?: number) {
    const answer: Answer = { questionId: question.id, value }
    if (salienceField === 'confidence' && rating !== undefined) answer.confidence = rating
    if (salienceField === 'priority' && rating !== undefined) answer.priority = rating

    const next: AnswerMap = { ...answers, [question.id]: answer }
    setAnswers(next)
    setPendingValue(null)
    if (isLast) {
      onComplete(next)
    } else {
      setIndex(index + 1)
    }
  }

  function chooseValue(value: Answer['value']) {
    if (value !== 'dont_know' && salienceField) {
      setPendingValue(value)
    } else {
      commit(value)
    }
  }

  function goBack() {
    setPendingValue(null)
    setIndex(index - 1)
  }

  if (salienceQuestion) {
    const prompt = salienceQuestion === 'confidence' ? question.confidencePrompt : question.priorityPrompt
    return (
      <section className="screen quiz-screen">
        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${((index + 1) / questions.length) * 100}%` }} />
        </div>
        <p className="muted">
          Question {index + 1} of {questions.length} &middot; {salienceQuestion}
        </p>
        <p className="prompt">{prompt}</p>
        <p className="muted question-help">{SALIENCE_HELP[salienceQuestion]}</p>
        <div className="scale" role="group" aria-label={`${salienceQuestion} rating`}>
          {SALIENCE_LEVELS.map((level) => (
            <button
              key={level.value}
              type="button"
              className="scale-button"
              onClick={() => commit(pendingValue as Answer['value'], level.value)}
            >
              {level.label}
            </button>
          ))}
        </div>
        <button type="button" className="back-link" onClick={() => setPendingValue(null)}>
          Back
        </button>
        <button type="button" className="back-link" onClick={() => commit(pendingValue as Answer['value'])}>
          Skip
        </button>
      </section>
    )
  }

  return (
    <section className="screen quiz-screen">
      <div className="progress-track">
        <div className="progress-fill" style={{ width: `${((index + 1) / questions.length) * 100}%` }} />
      </div>
      <p className="muted">
        Question {index + 1} of {questions.length} &middot; {question.layer}
        {question.theoryContext !== 'mixed' ? ` · ${question.theoryContext}` : ''}
      </p>

      <p className="prompt">{question.prompt}</p>
      <p className="muted question-help">{questionHelpText(question)}</p>
      {saveError && <p className="muted error-inline" role="alert">{saveError}</p>}

      {question.responseType === 'statementChoice' ? (
        <div className="statement-list" role="group" aria-label="Which best represents your view">
          {question.statementOptions?.map((option, optionIndex) => (
            <button
              key={option.id}
              type="button"
              className={`statement-button${selected?.value === optionIndex ? ' selected' : ''}`}
              onClick={() => chooseValue(optionIndex)}
            >
              {option.text}
            </button>
          ))}
        </div>
      ) : (
        <div className="scale" role="group" aria-label="Agreement scale">
          {scaleValues(question.responseType).map((value) => (
            <button
              key={value}
              type="button"
              className={`scale-button${selected?.value === value ? ' selected' : ''}`}
              onClick={() => chooseValue(value)}
            >
              {scaleLabels(question.responseType)[value]}
            </button>
          ))}
        </div>
      )}

      {question.allowDontKnow && (
        <button
          type="button"
          className={`dont-know-button${selected?.value === 'dont_know' ? ' selected' : ''}`}
          onClick={() => chooseValue('dont_know')}
        >
          I don't know
        </button>
      )}

      {index > 0 && (
        <button type="button" className="back-link" onClick={goBack}>
          Back
        </button>
      )}
    </section>
  )
}
