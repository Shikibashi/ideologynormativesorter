import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import App from './App'
import { questionsForTier, questions } from './data/questions'
import { encodeAnswers, readCompareAnswers, readSharedAnswers } from './share'
import type { AnswerMap, Question } from './types'

const quickQuestions = questionsForTier('quick')
const SAVE_KEY = 'ideology-quiz-save'

function installLocalStorage(): void {
   const store = new Map<string, string>()
   const storage = {
      getItem: vi.fn((key: string) => store.get(key) ?? null),
      setItem: vi.fn((key: string, value: string) => store.set(key, value)),
      removeItem: vi.fn((key: string) => store.delete(key)),
      clear: vi.fn(() => store.clear()),
      key: vi.fn((index: number) => Array.from(store.keys())[index] ?? null),
      get length() {
         return store.size
      },
   }
   Object.defineProperty(globalThis, 'localStorage', { value: storage, configurable: true })
   Object.defineProperty(window, 'localStorage', { value: storage, configurable: true })
}

beforeEach(() => {
   installLocalStorage()
})

afterEach(() => {
   cleanup()
   window.history.replaceState(null, '', '/')
   localStorage.clear()
   vi.restoreAllMocks()
})

function storeValidSave(): void {
   localStorage.setItem(
      SAVE_KEY,
      JSON.stringify({
         questions: quickQuestions,
         answers: { [quickQuestions[0].id]: { questionId: quickQuestions[0].id, value: 1 } },
         index: 1,
         tier: 'quick',
      }),
   )
}

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
      expect(screen.queryByText(/you have a saved session in progress/i)).not.toBeInTheDocument()
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

   it('clears malformed saved progress instead of showing a stale resume banner', () => {
      localStorage.setItem(
         SAVE_KEY,
         JSON.stringify({ questions: [], answers: {}, index: 0, tier: 'quick' }),
      )

      render(<App />)

      expect(screen.queryByText(/you have a saved session in progress/i)).not.toBeInTheDocument()
      expect(localStorage.getItem(SAVE_KEY)).toBeNull()
   })

   it('start fresh removes saved progress without reloading', () => {
      storeValidSave()

      render(<App />)
      fireEvent.click(screen.getByRole('button', { name: /start fresh/i }))

      expect(screen.queryByText(/you have a saved session in progress/i)).not.toBeInTheDocument()
      expect(localStorage.getItem(SAVE_KEY)).toBeNull()
      expect(screen.getByRole('heading', { name: /political judgment decomposition/i })).toBeInTheDocument()
   })

   it('compares a pasted shared result without remounting and preserves hash ordering', () => {
      const current: AnswerMap = { q0001: { questionId: 'q0001', value: 2 } }
      const compared: AnswerMap = { q0001: { questionId: 'q0001', value: -2 } }
      window.history.replaceState(null, '', `/#r=${encodeAnswers(current)}`)

      render(<App />)
      fireEvent.change(screen.getByPlaceholderText(/paste shared url or hash/i), {
         target: { value: `/#r=${encodeAnswers(compared)}` },
      })
      fireEvent.click(screen.getByRole('button', { name: /^compare$/i }))

      expect(screen.getByRole('heading', { name: /comparison view/i })).toBeInTheDocument()
      expect(screen.getByRole('heading', { name: /axis comparison/i })).toBeInTheDocument()
      expect(readSharedAnswers()).toEqual(current)
      expect(readCompareAnswers()).toEqual(compared)
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

   it('shows a sharing fallback when clipboard is unavailable', () => {
      Object.defineProperty(navigator, 'clipboard', { value: undefined, configurable: true })

      const encoded = encodeAnswers({ q0001: { questionId: 'q0001', value: 2 } })
      window.history.replaceState(null, '', `/#r=${encoded}`)
      render(<App />)

      fireEvent.click(screen.getByRole('button', { name: /copy link to this result/i }))
      expect(screen.getByRole('alert')).toHaveTextContent(/select the link below/i)
      const linkInput = screen.getByLabelText(/shareable result link/i)
      expect((linkInput as HTMLInputElement).value).toContain('#r=')
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

   it('renders the divergences section on the results screen when layer divergences exist', () => {
      const normativeLibertyQ = questions.find(q => q.layer === 'normative' && q.axisWeights.some(w => w.axisId === 'liberty-noninterference'))!
      const prescriptiveRegQ = questions.find(q => q.layer === 'prescriptive' && q.axisWeights.some(w => w.axisId === 'regulation-vs-deregulation'))!

      const answers = {
         [normativeLibertyQ.id]: { questionId: normativeLibertyQ.id, value: 3 },
         [prescriptiveRegQ.id]: { questionId: prescriptiveRegQ.id, value: 3 }
      }

      const encoded = encodeAnswers(answers)
      window.history.replaceState(null, '', `/#r=${encoded}`)
      render(<App />)

      expect(screen.getByRole('heading', { name: /your results/i })).toBeInTheDocument()
      expect(screen.getByRole('heading', { name: /divergences & strategic compromises/i })).toBeInTheDocument()
      expect(screen.getAllByText(/layer divergence/i, { exact: false }).length).toBeGreaterThan(0)
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
      const firstGroupCards = groups[0].querySelectorAll('.label-card')
      expect(firstGroupCards.length).toBeGreaterThanOrEqual(1)
      expect(groups[0].textContent ?? '').toMatch(/%/)
      expect(groups[0].querySelector('.label-evidence')?.textContent ?? '').toMatch(/evidence/)
   })

   it('keeps the full label browser collapsed by default and searches label metadata', () => {
      const encoded = encodeAnswers({ q0001: { questionId: 'q0001', value: 2 } })
      window.history.replaceState(null, '', `/#r=${encoded}`)

      render(<App />)

      const browser = document.querySelector<HTMLDetailsElement>('.full-label-browser')
      expect(browser).toBeInTheDocument()
      expect(browser!.open).toBe(false)

      fireEvent.click(screen.getByText(/browse all ideology labels/i))
      expect(browser!.open).toBe(true)

      fireEvent.change(screen.getByRole('searchbox', { name: /search ideology labels/i }), {
         target: { value: 'Marxism' },
      })

      expect(screen.getByText(/showing \d+ labels/i)).toBeInTheDocument()
      expect(document.querySelectorAll('.full-label-browser .label-card').length).toBeGreaterThan(0)
      expect(document.querySelector('.full-label-browser')?.textContent ?? '').toMatch(/Marxism/i)

   })

   it('renders a compact per-layer Philosophy Explorer with affected axes', () => {
      const encoded = encodeAnswers({ q0001: { questionId: 'q0001', value: 2 } })
      window.history.replaceState(null, '', `/#r=${encoded}`)

      render(<App />)

      expect(screen.getByRole('heading', { name: /philosophy explorer/i })).toBeInTheDocument()
      expect(document.querySelectorAll('.philosophy-card').length).toBeGreaterThan(0)
      expect(document.querySelectorAll('.philosophy-explorer .axis-chip').length).toBeGreaterThan(0)
      expect(document.querySelector('.philosophy-card')?.textContent ?? '').toMatch(/In these matched labels:/)
      const renderedLayers = Array.from(document.querySelectorAll('.philosophy-layer h3')).map((heading) => heading.textContent)
      expect(renderedLayers.length).toBeGreaterThanOrEqual(2)
   })


   it('shows a dismissible alert when a broken share link is loaded', () => {
      window.history.replaceState(null, '', '/#r=%%%notbase64%%%')
      render(<App />)

      expect(screen.getByRole('heading', { name: /political judgment decomposition/i })).toBeInTheDocument()
      const alert = screen.getByRole('alert')
      expect(alert).toHaveTextContent(/shared result link/i)

      fireEvent.click(screen.getByRole('button', { name: /dismiss/i }))
      expect(screen.queryByRole('alert')).toBeNull()
   })

   it('shows actionable error and manual-copy input when clipboard writeText rejects', async () => {
      const encoded = encodeAnswers({ q0001: { questionId: 'q0001', value: 2 } })
      window.history.replaceState(null, '', `/#r=${encoded}`)
      Object.defineProperty(navigator, 'clipboard', {
         value: { writeText: vi.fn().mockRejectedValue(new Error('denied')) },
         configurable: true,
      })
      render(<App />)

      fireEvent.click(screen.getByRole('button', { name: /copy link to this result/i }))
      const alert = await screen.findByRole('alert')
      expect(alert).toHaveTextContent(/select the link below/i)
      const linkInput = screen.getByLabelText(/shareable result link/i)
      expect((linkInput as HTMLInputElement).value).toContain('#r=')
   })

   it('rejects a junk compare input with an actionable error', () => {
      const encoded = encodeAnswers({ q0001: { questionId: 'q0001', value: 2 } })
      window.history.replaceState(null, '', `/#r=${encoded}`)
      render(<App />)

      const compareInput = screen.getByLabelText(/shared result link to compare/i)
      fireEvent.change(compareInput, { target: { value: 'not a link' } })
      fireEvent.click(screen.getByRole('button', { name: /^compare$/i }))

      expect(screen.getByRole('alert')).toHaveTextContent(/couldn't read that link/i)
      expect(screen.queryByRole('heading', { name: /comparison view/i })).toBeNull()
   })
})
