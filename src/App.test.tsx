import { fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import App from './App'
import { questionsForTier } from './data/questions'
import { encodeAnswers } from './share'

const quickQuestions = questionsForTier('quick')

afterEach(() => {
  window.history.replaceState(null, '', '/')
})

function answerOptionButtons(): HTMLElement[] {
  return Array.from(document.querySelectorAll<HTMLElement>('.scale-button, .statement-button'))
}

function clickScaleAndAnySalienceFollowUp(index: number) {
  const optionButtons = answerOptionButtons()
  fireEvent.click(optionButtons[index] ?? optionButtons[0])

  const salienceButtons = screen.queryAllByRole('button', { name: /^(low|medium|high)$/i })
  if (salienceButtons.length > 0) {
    fireEvent.click(salienceButtons[1])
  }
}

describe('App', () => {
  it('walks through intro, the quick quiz, and renders results', () => {
    render(<App />)

    expect(screen.getByRole('heading', { name: /political judgment decomposition/i })).toBeInTheDocument()
    fireEvent.click(screen.getByRole('radio', { name: /quick/i }))
    fireEvent.click(screen.getByRole('button', { name: /begin/i }))

    for (let i = 0; i < quickQuestions.length; i++) {
      expect(screen.getByText(`Question ${i + 1} of ${quickQuestions.length}`, { exact: false })).toBeInTheDocument()
      const optionButtons = answerOptionButtons()
      clickScaleAndAnySalienceFollowUp(Math.floor(optionButtons.length / 2))
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
      clickScaleAndAnySalienceFollowUp(0)
    }

    expect(screen.getByText(`Question ${firstDescriptiveIndex + 1} of ${quickQuestions.length}`, { exact: false })).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: /i don't know/i }))
    expect(screen.getByText(`Question ${firstDescriptiveIndex + 2} of ${quickQuestions.length}`, { exact: false })).toBeInTheDocument()
  })

  it('lets a confidence/priority rating be skipped without losing the primary answer', () => {
    render(<App />)
    fireEvent.click(screen.getByRole('radio', { name: /quick/i }))
    fireEvent.click(screen.getByRole('button', { name: /begin/i }))

    const ratedIndex = quickQuestions.findIndex((q) => q.layer !== 'normative')
    for (let i = 0; i < ratedIndex; i++) {
      clickScaleAndAnySalienceFollowUp(0)
    }

    fireEvent.click(answerOptionButtons()[0])
    fireEvent.click(screen.getByRole('button', { name: /^skip$/i }))
    expect(screen.getByText(`Question ${ratedIndex + 2} of ${quickQuestions.length}`, { exact: false })).toBeInTheDocument()
  })

  it('lands directly on results when loaded with a shared #r= link', () => {
    const encoded = encodeAnswers({ q0001: { questionId: 'q0001', value: 2 } })
    window.history.replaceState(null, '', `/#r=${encoded}`)

    render(<App />)

    expect(screen.getByRole('heading', { name: /your results/i })).toBeInTheDocument()
  })

  it('copies a shareable link to the clipboard from the results screen', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true })

    const encoded = encodeAnswers({ q0001: { questionId: 'q0001', value: 2 } })
    window.history.replaceState(null, '', `/#r=${encoded}`)
    render(<App />)

    fireEvent.click(screen.getByRole('button', { name: /copy link to this result/i }))
    expect(writeText).toHaveBeenCalledWith(expect.stringContaining('#r='))
    await screen.findByRole('button', { name: /link copied/i })
  })
})
