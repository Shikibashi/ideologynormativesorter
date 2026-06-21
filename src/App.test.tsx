import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import App from './App'
import { questionsForTier } from './data/questions'

const quickQuestions = questionsForTier('quick')

describe('App', () => {
  it('walks through intro, the quick quiz, and renders results', () => {
    render(<App />)

    expect(screen.getByRole('heading', { name: /political judgment decomposition/i })).toBeInTheDocument()
    fireEvent.click(screen.getByRole('radio', { name: /quick/i }))
    fireEvent.click(screen.getByRole('button', { name: /begin/i }))

    for (let i = 0; i < quickQuestions.length; i++) {
      expect(screen.getByText(`Question ${i + 1} of ${quickQuestions.length}`, { exact: false })).toBeInTheDocument()
      const scaleButtons = screen.getAllByRole('button', { name: /agree|disagree|neutral/i })
      fireEvent.click(scaleButtons[Math.floor(scaleButtons.length / 2)])
    }

    expect(screen.getByRole('heading', { name: /your results/i })).toBeInTheDocument()
    expect(screen.getByText(/normative profile/i)).toBeInTheDocument()
    expect(screen.getByText(/descriptive profile/i)).toBeInTheDocument()
    expect(screen.getByText(/prescriptive profile/i)).toBeInTheDocument()
    expect(screen.getByText(/nearest ideology labels/i)).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /start over/i }))
    expect(screen.getByRole('heading', { name: /political judgment decomposition/i })).toBeInTheDocument()
  })

  it('lets a descriptive item be answered as "I don\'t know" and still advances', () => {
    render(<App />)
    fireEvent.click(screen.getByRole('radio', { name: /quick/i }))
    fireEvent.click(screen.getByRole('button', { name: /begin/i }))

    const firstDescriptiveIndex = quickQuestions.findIndex((q) => q.allowDontKnow)
    for (let i = 0; i < firstDescriptiveIndex; i++) {
      const scaleButtons = screen.getAllByRole('button', { name: /agree|disagree|neutral/i })
      fireEvent.click(scaleButtons[0])
    }

    expect(screen.getByText(`Question ${firstDescriptiveIndex + 1} of ${quickQuestions.length}`, { exact: false })).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: /i don't know/i }))
    expect(screen.getByText(`Question ${firstDescriptiveIndex + 2} of ${quickQuestions.length}`, { exact: false })).toBeInTheDocument()
  })
})
