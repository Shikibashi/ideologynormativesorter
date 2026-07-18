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

    expect(screen.getByText('How confident are you in this empirical claim?')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /high/i })).toBeInTheDocument()
  })
})
