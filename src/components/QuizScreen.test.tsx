import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import type { Question } from '../types'
import { QuizScreen } from './QuizScreen'

const descriptiveChoice: Question = {
  id: 'test-descriptive-choice',
  prompt: 'Which empirical account seems most plausible?',
  domain: 'markets-planning',
  layer: 'descriptive',
  theoryContext: 'mixed',
  responseType: 'statementChoice',
  tier: 'quick',
  confidencePrompt: 'How confident are you in this empirical claim?',
  axisWeights: [],
  statementOptions: [
    {
      id: 'a',
      text: 'Institutions usually perform well.',
      axisWeights: [{ axisId: 'state-capacity-confidence', weight: 1 }],
    },
    {
      id: 'b',
      text: 'Institutions usually perform poorly.',
      axisWeights: [{ axisId: 'state-capacity-confidence', weight: -1 }],
    },
    {
      id: 'c',
      text: 'Performance varies too much for a broad claim.',
      axisWeights: [{ axisId: 'state-capacity-confidence', weight: 0 }],
    },
  ],
}

const prescriptiveChoice: Question = {
  ...descriptiveChoice,
  id: 'test-prescriptive-choice',
  prompt: 'Which policy should be preferred?',
  layer: 'prescriptive',
  priorityPrompt: 'How important is this strategic question to your overall outlook?',
}

afterEach(cleanup)

describe('QuizScreen descriptive questions', () => {
  it('offers I do not know even when the data item omits allowDontKnow', () => {
    const onComplete = vi.fn()
    render(<QuizScreen questions={[descriptiveChoice]} onComplete={onComplete} />)

    fireEvent.click(screen.getByRole('button', { name: /i don't know/i }))

    expect(onComplete).toHaveBeenCalledWith({
      'test-descriptive-choice': {
        questionId: 'test-descriptive-choice',
        value: 'dont_know',
      },
    })
  })

  it('uses a neutral fallback confidence prompt for descriptive choices', () => {
    render(<QuizScreen questions={[descriptiveChoice]} onComplete={vi.fn()} />)

    fireEvent.click(screen.getByRole('button', { name: /institutions usually perform well/i }))

    expect(screen.getByText('How confident are you in the answer you just gave?')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /high/i })).toBeInTheDocument()
  })

  it('states that skipping a rating excludes the substantive answer from the result', () => {
    const onComplete = vi.fn()
    render(<QuizScreen questions={[descriptiveChoice]} onComplete={onComplete} />)

    fireEvent.click(screen.getByRole('button', { name: /institutions usually perform well/i }))
    expect(screen.getByText(/skipping the rating excludes the answer from your result/i)).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: /skip rating and exclude this answer from my result/i }))

    expect(onComplete).toHaveBeenCalledWith({
      'test-descriptive-choice': {
        questionId: 'test-descriptive-choice',
        value: 0,
        salienceSkipped: true,
      },
    })
  })
})

describe('QuizScreen research nonresponse', () => {
  it('offers a distinct refusal only when research mode enables it', () => {
    const onComplete = vi.fn()
    const { rerender } = render(<QuizScreen questions={[descriptiveChoice]} onComplete={onComplete} />)
    expect(screen.queryByRole('button', { name: /prefer not to answer/i })).not.toBeInTheDocument()

    rerender(<QuizScreen questions={[descriptiveChoice]} onComplete={onComplete} allowRefusal />)
    fireEvent.click(screen.getByRole('button', { name: /prefer not to answer/i }))
    expect(onComplete).toHaveBeenCalledWith({
      'test-descriptive-choice': {
        questionId: 'test-descriptive-choice',
        value: 'prefer_not_to_answer',
      },
    })
  })
})

describe('QuizScreen prescriptive follow-up', () => {
  it('asks about the selected policy rather than the importance of the question', () => {
    render(<QuizScreen questions={[prescriptiveChoice]} onComplete={vi.fn()} />)

    fireEvent.click(screen.getByRole('button', { name: /institutions usually perform well/i }))

    expect(screen.getByText('How important is the policy or strategy you selected, relative to other changes?')).toBeInTheDocument()
    expect(screen.queryByText('How important is this strategic question to your overall outlook?')).not.toBeInTheDocument()
  })
})
