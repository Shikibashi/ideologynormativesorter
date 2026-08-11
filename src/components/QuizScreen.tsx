import { useEffect, useRef, useState } from 'react'
import { getQuestionHelpText, getSalienceHelpText } from '../data/questionHelpText'
import {
  DEFAULT_CONFIDENCE_PROMPT,
  DEFAULT_PRIORITY_PROMPT,
  SALIENCE_LEVELS,
  SKIP_SALIENCE_LABEL,
  scaleLabel,
  scaleValues,
} from '../questionPresentation'
import { saveQuizState } from '../save'
import { announceStatus } from '../status'
import type { Answer, AnswerMap, Question, QuizTier } from '../types'

type ProgressSaveResult = { saved: true } | { saved: false; reason: string }

export interface QuizScreenStatus {
  current: number
  total: number
  layer: Question['layer']
  save: 'current' | 'unavailable'
}

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
  /** Research-only refusal option. Kept separate from empirical uncertainty. */
  allowRefusal?: boolean
  onStatusChange?: (status: QuizScreenStatus) => void
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
  allowRefusal = false,
  onStatusChange,
}: QuizScreenProps) {
  const [index, setIndex] = useState(initialIndex ?? 0)
  const [answers, setAnswers] = useState<AnswerMap>(initialAnswers ?? {})
  const [pendingValue, setPendingValue] = useState<Answer['value'] | null>(null)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [saveState, setSaveState] = useState<QuizScreenStatus['save']>('current')
  const question = questions[index]
  const selected = answers[question.id]
  const isLast = index === questions.length - 1

  const salienceField = question.layer === 'descriptive' ? 'confidence' : question.layer === 'prescriptive' ? 'priority' : null
  const salienceQuestion = typeof pendingValue === 'number' ? salienceField : null
  const canAnswerDontKnow = question.layer === 'descriptive' || question.allowDontKnow === true
  const saveSuccessAnnounced = useRef(false)

  useEffect(() => {
    onStatusChange?.({ current: index + 1, total: questions.length, layer: question.layer, save: saveState })
  }, [index, onStatusChange, question.layer, questions.length, saveState])

  // Persist only when the answer object changes. This also avoids Strict Mode
  // replaying a save announcement for an untouched restored session.
  const lastPersistedAnswers = useRef(answers)
  useEffect(() => {
    if (lastPersistedAnswers.current === answers) return
    lastPersistedAnswers.current = answers
    if (Object.keys(answers).length === 0) return

    const result = progressSaver
      ? progressSaver({ answers, index })
      : tier
        ? saveQuizState({ questions, answers, index, tier: tier as QuizTier })
        : null

    if (result?.saved === false) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- safe: saveError is not a dep
      setSaveError(result.reason)
      setSaveState('unavailable')
      announceStatus(result.reason)
    } else if (result?.saved === true) {
      setSaveError(null)
      setSaveState('current')
      if (!saveSuccessAnnounced.current) {
        saveSuccessAnnounced.current = true
        announceStatus('Assessment progress saved locally.')
      }
    }
  }, [answers, index, progressSaver, questions, tier])

  function commit(value: Answer['value'], rating?: number, salienceSkipped = false) {
    const answer: Answer = { questionId: question.id, value }
    if (salienceField === 'confidence' && rating !== undefined) answer.confidence = rating
    if (salienceField === 'priority' && rating !== undefined) answer.priority = rating
    if (salienceSkipped) answer.salienceSkipped = true

    const next: AnswerMap = { ...answers, [question.id]: answer }
    setAnswers(next)
    setPendingValue(null)
    announceStatus(isLast ? 'Answer recorded. Assessment complete.' : `Answer recorded; advanced to item ${index + 2} of ${questions.length}.`)
    if (isLast) {
      onComplete(next)
    } else {
      setIndex(index + 1)
    }
  }

  function chooseValue(value: Answer['value']) {
    if (typeof value === 'number' && salienceField) {
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
      ? DEFAULT_CONFIDENCE_PROMPT
      : DEFAULT_PRIORITY_PROMPT
    const helpText = getSalienceHelpText(salienceQuestion)

    return (
      <section
        className="screen quiz-screen"
        data-question-id={question.id}
        data-question-index={index}
        data-layer={question.layer}
      >
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
        <button type="button" className="back-link" onClick={() => commit(pendingValue as Answer['value'], undefined, true)}>
          {SKIP_SALIENCE_LABEL}
        </button>
        {onExit && <button type="button" className="back-link" onClick={onExit}>Stop follow-up</button>}
      </section>
    )
  }

  const helpText = question.helpText ?? getQuestionHelpText(question)

  return (
    <section
      className="screen quiz-screen"
      data-question-id={question.id}
      data-question-index={index}
      data-layer={question.layer}
    >
      <div className="section-band">
        <span className="section-band-label">ASSESSMENT / QUESTION</span>
        <span className="section-band-status">
          {saveState === 'current' ? 'LOCAL SAVE ENABLED' : 'LOCAL SAVE UNAVAILABLE'}
        </span>
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
              data-answer-value={optionIndex}
              aria-pressed={selected?.value === optionIndex}
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
              data-answer-value={value}
              aria-pressed={selected?.value === value}
              onClick={() => chooseValue(value)}
            >
              {scaleLabel(question.responseType, value)}
            </button>
          ))}
        </div>
      )}

      {canAnswerDontKnow && (
        <button
          type="button"
          className={`dont-know-button${selected?.value === 'dont_know' ? ' selected' : ''}`}
          data-answer-value="dont_know"
          aria-pressed={selected?.value === 'dont_know'}
          onClick={() => chooseValue('dont_know')}
        >
          I don't know
        </button>
      )}

      {allowRefusal && (
        <button
          type="button"
          className={`dont-know-button${selected?.value === 'prefer_not_to_answer' ? ' selected' : ''}`}
          data-answer-value="prefer_not_to_answer"
          aria-pressed={selected?.value === 'prefer_not_to_answer'}
          onClick={() => chooseValue('prefer_not_to_answer')}
        >
          Prefer not to answer
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
