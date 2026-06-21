import { describe, expect, it } from 'vitest'
import type { Layer, QuizTier } from '../types'
import { axes, axisById } from './axes'
import { domainById, domains } from './domains'
import { factionModules } from './factionModules'
import { labelById, labels } from './labels'
import { moduleQuestionById, moduleQuestions } from './moduleQuestions'
import { questionById, questions, questionsForTier } from './questions'

const TIERS: QuizTier[] = ['quick', 'moderate', 'extensive']

const LAYERS: Layer[] = ['normative', 'descriptive', 'prescriptive']

describe('domains', () => {
  it('covers all 20 required policy domains exactly once', () => {
    expect(domains).toHaveLength(20)
    expect(new Set(domains.map((d) => d.id)).size).toBe(20)
  })
})

describe('axes', () => {
  it('defines 24 axes, split 8 normative / 7 descriptive / 9 prescriptive', () => {
    expect(axes).toHaveLength(24)
    const expectedPerLayer: Record<Layer, number> = { normative: 8, descriptive: 7, prescriptive: 9 }
    for (const layer of LAYERS) {
      expect(axes.filter((a) => a.layer === layer)).toHaveLength(expectedPerLayer[layer])
    }
  })

  it('has no duplicate axis ids', () => {
    expect(new Set(axes.map((a) => a.id)).size).toBe(axes.length)
  })
})

describe('questions', () => {
  it('has at least 30 items', () => {
    expect(questions.length).toBeGreaterThanOrEqual(30)
  })

  it('has no duplicate question ids', () => {
    expect(new Set(questions.map((q) => q.id)).size).toBe(questions.length)
  })

  it('only references domains that exist', () => {
    for (const question of questions) {
      expect(domainById.has(question.domain), `${question.id} references unknown domain ${question.domain}`).toBe(true)
    }
  })

  it('only references axes that exist and share the question layer', () => {
    for (const question of questions) {
      for (const weight of question.axisWeights) {
        const axis = axisById.get(weight.axisId)
        expect(axis, `${question.id} references unknown axis ${weight.axisId}`).toBeDefined()
        expect(axis!.layer, `${question.id} (${question.layer}) references ${weight.axisId} (${axis!.layer})`).toBe(question.layer)
      }
    }
  })

  it('every domain has at least one item in each layer', () => {
    for (const domain of domains) {
      for (const layer of LAYERS) {
        const count = questions.filter((q) => q.domain === domain.id && q.layer === layer).length
        expect(count, `${domain.id} has no ${layer} item`).toBeGreaterThan(0)
      }
    }
  })

  it('has at least one domain with both an ideal and a nonideal item, to support gap scoring', () => {
    const domainsWithBoth = domains.filter((domain) => {
      const items = questions.filter((q) => q.domain === domain.id)
      return items.some((q) => q.theoryContext === 'ideal') && items.some((q) => q.theoryContext === 'nonideal')
    })
    expect(domainsWithBoth.length).toBeGreaterThan(0)
  })

  it('every descriptive item that allows dont_know provides a confidence prompt', () => {
    for (const question of questions.filter((q) => q.layer === 'descriptive' && q.allowDontKnow)) {
      expect(question.confidencePrompt, `${question.id} is missing a confidencePrompt`).toBeTruthy()
    }
  })

  it('every prescriptive item provides a priority prompt', () => {
    for (const question of questions.filter((q) => q.layer === 'prescriptive')) {
      expect(question.priorityPrompt, `${question.id} is missing a priorityPrompt`).toBeTruthy()
    }
  })
})

describe('quiz tiers', () => {
  it('nests quick within moderate within extensive', () => {
    const quick = new Set(questionsForTier('quick').map((q) => q.id))
    const moderate = new Set(questionsForTier('moderate').map((q) => q.id))
    const extensive = new Set(questionsForTier('extensive').map((q) => q.id))

    expect(extensive.size).toBe(questions.length)
    for (const id of quick) expect(moderate.has(id)).toBe(true)
    for (const id of moderate) expect(extensive.has(id)).toBe(true)
  })

  it('every domain has at least one item per layer in every tier', () => {
    for (const tier of TIERS) {
      const pool = questionsForTier(tier)
      for (const domain of domains) {
        for (const layer of LAYERS) {
          const count = pool.filter((q) => q.domain === domain.id && q.layer === layer).length
          expect(count, `${domain.id}/${layer} has no item in the ${tier} tier`).toBeGreaterThan(0)
        }
      }
    }
  })
})

describe('labels', () => {
  it('has no duplicate label ids', () => {
    expect(new Set(labels.map((l) => l.id)).size).toBe(labels.length)
  })

  it('every centroid covers every axis', () => {
    const axisIds = axes.map((a) => a.id)
    for (const label of labels) {
      for (const axisId of axisIds) {
        expect(label.centroid[axisId], `${label.id} is missing a centroid value for ${axisId}`).toBeTypeOf('number')
      }
    }
  })

  it('every confoundedWith reference resolves to a real label', () => {
    for (const label of labels) {
      for (const otherId of label.confoundedWith ?? []) {
        expect(labelById.has(otherId), `${label.id} references unknown confounded label ${otherId}`).toBe(true)
      }
    }
  })
})

describe('moduleQuestions', () => {
  it('has no duplicate ids and no overlap with the main bank', () => {
    expect(new Set(moduleQuestions.map((q) => q.id)).size).toBe(moduleQuestions.length)
    for (const q of moduleQuestions) {
      expect(questionById.has(q.id), `${q.id} collides with a main-bank question id`).toBe(false)
    }
  })

  it('only references domains and same-layer axes that exist', () => {
    for (const question of moduleQuestions) {
      expect(domainById.has(question.domain), `${question.id} references unknown domain ${question.domain}`).toBe(true)
      for (const weight of question.axisWeights) {
        const axis = axisById.get(weight.axisId)
        expect(axis, `${question.id} references unknown axis ${weight.axisId}`).toBeDefined()
        expect(axis!.layer).toBe(question.layer)
      }
    }
  })
})

describe('factionModules', () => {
  it('every triggerLabelId resolves to a real label', () => {
    for (const module of factionModules) {
      for (const labelId of module.triggerLabelIds) {
        expect(labelById.has(labelId), `${module.id} references unknown label ${labelId}`).toBe(true)
      }
    }
  })

  it('every questionId resolves to a real module question', () => {
    for (const module of factionModules) {
      expect(module.questionIds.length).toBeGreaterThan(0)
      for (const questionId of module.questionIds) {
        expect(moduleQuestionById.has(questionId), `${module.id} references unknown question ${questionId}`).toBe(true)
      }
    }
  })

  it('has no duplicate module ids', () => {
    expect(new Set(factionModules.map((m) => m.id)).size).toBe(factionModules.length)
  })
})
