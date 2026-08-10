import { useEffect, useRef, useState } from 'react'
import { getQuestionHelpText, getSalienceHelpText } from '../data/questionHelpText'
import { saveQuizState } from '../save'
import { announceStatus } from '../status'
import type { Answer, AnswerMap, Question, QuizTier } from '../types'

const DEFAULT_CONFIDENCE_PROMPT = 'How confident are you in this empirical claim?'
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

function scaleValues(responseType: Question['responseType']): number[] {
  return responseType === 'likert5' ? [-2, -1, 0, 1, 2] : [-3, -2, -1, 0, 1, 2, 3]
}

function scaleLabels(responseType: Question['responseType']): Record<number, string> {
  return responseType === 'likert5' ? LIKERT5_LABELS : LIKERT_LABELS
}

type ProgressSaveResult = { saved: true } | { saved: false; reason: string }

interface QuizScreenProps {
  questions: Question[]
  onComplete: (answers: AnswerMap) => void
  /** Tier label for core-quiz save/display only — no filtering logic. */
  tier?: string
  initialAnswers?: AnswerMap
  initialIndex?: number
  contextLabel?: string
  progressSaver?: (state: { answers: AnswerMap; index: number }) => ProgressSaveResult
  onExit?: () => void
}

export function QuizScreen({
  questions,
  onComplete,
  tier,
  initialAnswers,
  initialIndex,
  contextLabel,
  progressSaver,
  onExit,
}: QuizScreenProps) {
  const [index, setIndex] = useState(initialIndex ?? 0)
  const [answers, setAnswers] = useState<AnswerMap>(initialAnswers ?? {})
  const [pendingValue, setPendingValue] = useState<Answer['value'] | null>(null)
  const [saveError, setSaveError] = useState<string | null>(null)
  const question = questions[index]
  const selected = answers[question.id]
  const isLast = index === questions.length - 1

  const salienceField = question.layer === 'descriptive' ? 'confidence' : question.layer === 'prescriptive' ? 'priority' : null
  const salienceQuestion = pendingValue !== null && pendingValue !== 'dont_know' ? salienceField : null
  const canAnswerDontKnow = question.layer === 'descriptive' || question.allowDontKnow === true

  // Persist progress on every answer change (skip on first render if restoring).
  const isRestored = useRef(!!initialAnswers)
  useEffect(() => {
    if (isRestored.current) {
      isRestored.current = false
      return
    }
    if (Object.keys(answers).length === 0) return

    const result = progressSaver
      ? progressSaver({ answers, index })
      : tier
        ? saveQuizState({ questions, answers, index, tier: tier as QuizTier })
        : null

    if (result?.saved === false) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- safe: saveError is not a dep
      setSaveError(result.reason)
      announceStatus(result.reason)
    } else if (result?.saved === true) {
      setSaveError(null)
      announceStatus('Assessment progress saved locally.')
    }
  }, [answers, index, progressSaver, questions, tier])

  function commit(value: Answer['value'], rating?: number) {
    const answer: Answer = { questionId: question.id, value }
    if (salienceField === 'confidence' && rating !== undefined) answer.confidence = rating
    if (salienceField === 'priority' && rating !== undefined) answer.priority = rating

    const next: AnswerMap = { ...answers, [question.id]: answer }
    setAnswers(next)
    setPendingValue(null)
    announceStatus(isLast ? 'Answer recorded. Assessment complete.' : `Answer recorded. Question ${index + 2} of ${questions.length}.`)
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

  const positionLabel = `${contextLabel ? `${contextLabel} · ` : ''}Question ${index + 1} of ${questions.length}`

  if (salienceQuestion) {
    const prompt = salienceQuestion === 'confidence'
      ? question.confidencePrompt ?? DEFAULT_CONFIDENCE_PROMPT
      : question.priorityPrompt
    const helpText = getSalienceHelpText(salienceQuestion)

    return (
      <section className="screen quiz-screen">
        <div className="section-band">
          <span className="section-band-label">ASSESSMENT / FOLLOW-UP</span>
          <span className="section-band-status">ANSWER REVIEW</span>
        </div>
        <div
          className="progress-track"
          role="progressbar"
          aria-label="Assessment progress"
          aria-valuemin={1}
          aria-valuemax={questions.length}
          aria-valuenow={index + 1}
          aria-valuetext={`${positionLabel}`}
        >
          <div className="progress-fill" style={{ width: `${((index + 1) / questions.length) * 100}%` }} />
        </div>
        <p className="muted question-context">
          {positionLabel} &middot; {salienceQuestion}
        </p>
        <p className="prompt">{prompt}</p>
        <p className="muted question-help">{helpText}</p>
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
        {onExit && <button type="button" className="back-link" onClick={onExit}>Stop follow-up</button>}
      </section>
    )
  }

  const helpText = question.helpText ?? getQuestionHelpText(question)

  return (
    <section className="screen quiz-screen">
      <div className="section-band">
        <span className="section-band-label">ASSESSMENT / QUESTION</span>
        <span className="section-band-status">LOCAL SAVE ENABLED</span>
      </div>
      <div
        className="progress-track"
        role="progressbar"
        aria-label="Assessment progress"
        aria-valuemin={1}
        aria-valuemax={questions.length}
        aria-valuenow={index + 1}
        aria-valuetext={positionLabel}
      >
        <div className="progress-fill" style={{ width: `${((index + 1) / questions.length) * 100}%` }} />
      </div>
      <p className="muted question-context">
        {positionLabel} &middot; {question.layer}
        {question.theoryContext !== 'mixed' ? ` · ${question.theoryContext}` : ''}
      </p>

      <p className="prompt">{question.prompt}</p>
      <p className="muted question-help help-text">{helpText}</p>
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

      {canAnswerDontKnow && (
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
      {onExit && <button type="button" className="back-link" onClick={onExit}>Stop follow-up</button>}
    </section>
  )
}
