import { fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import App from './App'
import { questionsForTier } from './data/questions'
import { encodeAnswers } from './share'
import type { Question } from './types'

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

// Hand-authored cross-layer intent: egalitarian/anti-domination values,
// market-confident empirical beliefs, deregulatory/decentralist strategy.
const CROSS_LAYER_INTENT: Record<string, number> = {
   'equality-theory': 1,
   'anti-domination': 1,
   'authority-legitimacy': -1,
   'liberty-noninterference': 1,
   'property-legitimacy': 0.3,
   'market-process-confidence': 1,
   'public-choice-skepticism': 1,
   'state-capacity-confidence': -1,
   'expert-confidence': -1,
   'coordination-optimism': 1,
   'centralization-preference': -1,
   'state-action-vs-exit': -1,
   'regulation-vs-deregulation': -1,
   'redistribution-vs-predistribution': -0.5,
   'coercion-strategy': -1,
}

function intentDot(weights: { axisId: string; weight: number }[]): number {
   return weights.reduce((s, w) => s + (CROSS_LAYER_INTENT[w.axisId] ?? 0) * w.weight, 0)
}

/** Answer the currently-rendered question according to the cross-layer intent. */
function answerByIntent(question: Question) {
   const statementButtons = Array.from(document.querySelectorAll<HTMLElement>('.statement-button'))
   if (statementButtons.length > 0 && question.statementOptions) {
      let bestIdx = 0
      let bestScore = -Infinity
      statementButtons.forEach((btn, i) => {
         const opt = question.statementOptions!.find((o) => (btn.textContent ?? '').startsWith(o.text.slice(0, 30)))
         const score = opt ? intentDot(opt.axisWeights) : -Infinity
         if (score > bestScore) {
            bestScore = score
            bestIdx = i
         }
      })
      fireEvent.click(statementButtons[bestIdx])
      return
   }

   const scaleButtons = Array.from(document.querySelectorAll<HTMLElement>('.scale-button'))
   const sign = Math.sign(intentDot(question.axisWeights))
   // 7-point scale: index 0 = strongly disagree ... 6 = strongly agree
   const index = sign > 0 ? 6 : sign < 0 ? 0 : 3
   fireEvent.click(scaleButtons[index] ?? scaleButtons[0])
}

/** Handle a confidence/priority salience sub-screen if one is currently shown. */
function handleSalienceIfPresent() {
   const salienceButtons = screen.queryAllByRole('button', { name: /^(low|medium|high)$/i })
   if (salienceButtons.length > 0) {
      fireEvent.click(salienceButtons[salienceButtons.length - 1]) // High
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
   it('renders the layer-conflation section with agreement chips for a cross-layer profile', () => {
      render(<App />)
      fireEvent.click(screen.getByRole('radio', { name: /quick/i }))
      fireEvent.click(screen.getByRole('button', { name: /begin/i }))

      for (let i = 0; i < quickQuestions.length; i++) {
         expect(screen.getByText(`Question ${i + 1} of ${quickQuestions.length}`, { exact: false })).toBeInTheDocument()
         answerByIntent(quickQuestions[i])
         handleSalienceIfPresent()
      }

      expect(screen.getByRole('heading', { name: /your results/i })).toBeInTheDocument()
      // The cross-layer profile must surface the layer-conflation section.
      expect(screen.getByRole('heading', { name: /labels that conflate your layers/i })).toBeInTheDocument()

      // At least one flag with per-layer agreement chips must render.
      const chips = Array.from(document.querySelectorAll('.layer-chip'))
      expect(chips.length).toBeGreaterThanOrEqual(3)
      // Each flag shows all three layers, and exactly one is marked as matched per flag.
      expect(document.querySelector('.layer-chip.matched')).toBeInTheDocument()
      const chipText = chips.map((c) => c.textContent ?? '').join(' ')
      expect(chipText).toMatch(/normative/i)
      expect(chipText).toMatch(/descriptive/i)
      expect(chipText).toMatch(/prescriptive/i)
      expect(chipText).toMatch(/%/)
   })

   it('renders nearest ideology labels grouped into family-tree groups with readable family names', () => {
      render(<App />)
      fireEvent.click(screen.getByRole('radio', { name: /quick/i }))
      fireEvent.click(screen.getByRole('button', { name: /begin/i }))

      for (let i = 0; i < quickQuestions.length; i++) {
         answerByIntent(quickQuestions[i])
         handleSalienceIfPresent()
      }

      expect(screen.getByRole('heading', { name: /your results/i })).toBeInTheDocument()
      expect(screen.getByRole('heading', { name: /nearest ideology labels/i })).toBeInTheDocument()

      // The family-tree grouping must render at least one family group.
      const groups = Array.from(document.querySelectorAll('.family-group'))
      expect(groups.length).toBeGreaterThanOrEqual(1)

      // Family names are rendered human-readable (title-cased, de-hyphenated): no raw kebab-case.
      const familyNames = Array.from(document.querySelectorAll('.family-name')).map((h) => h.textContent ?? '')
      expect(familyNames.length).toBeGreaterThanOrEqual(1)
      for (const name of familyNames) {
         expect(name).not.toMatch(/-/)
         expect(name[0]).toBe(name[0]?.toUpperCase())
      }

      // Each group lists at least one label with a percentage match.
      const firstGroupLabels = groups[0].querySelectorAll('.label-list li')
      expect(firstGroupLabels.length).toBeGreaterThanOrEqual(1)
      expect(groups[0].textContent ?? '').toMatch(/%/)
   })

})
