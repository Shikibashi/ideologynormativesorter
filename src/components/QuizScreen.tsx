import { useState } from 'react'
import type { Answer, AnswerMap, Question } from '../types'

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

interface QuizScreenProps {
  questions: Question[]
  onComplete: (answers: AnswerMap) => void
}

export function QuizScreen({ questions, onComplete }: QuizScreenProps) {
  const [index, setIndex] = useState(0)
  const [answers, setAnswers] = useState<AnswerMap>({})

  const question = questions[index]
  const selected = answers[question.id]
  const isLast = index === questions.length - 1

  function recordAndAdvance(value: Answer['value']) {
    const next: AnswerMap = { ...answers, [question.id]: { questionId: question.id, value } }
    setAnswers(next)
    if (isLast) {
      onComplete(next)
    } else {
      setIndex(index + 1)
    }
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

      <div className="scale" role="group" aria-label="Agreement scale">
        {scaleValues(question.responseType).map((value) => (
          <button
            key={value}
            type="button"
            className={`scale-button${selected?.value === value ? ' selected' : ''}`}
            onClick={() => recordAndAdvance(value)}
          >
            {scaleLabels(question.responseType)[value]}
          </button>
        ))}
      </div>

      {question.allowDontKnow && (
        <button
          type="button"
          className={`dont-know-button${selected?.value === 'dont_know' ? ' selected' : ''}`}
          onClick={() => recordAndAdvance('dont_know')}
        >
          I don't know
        </button>
      )}

      {index > 0 && (
        <button type="button" className="back-link" onClick={() => setIndex(index - 1)}>
          Back
        </button>
      )}
    </section>
  )
}
