import { describe, expect, it } from 'vitest'
import type { Layer } from '../types'
import { axes, axisById } from './axes'
import { domainById, domains } from './domains'
import { factionModules } from './factionModules'
import { labelById, labels } from './labels'
import { questions } from './questions'

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

describe('factionModules', () => {
  it('every triggerLabelId resolves to a real label', () => {
    for (const module of factionModules) {
      for (const labelId of module.triggerLabelIds) {
        expect(labelById.has(labelId), `${module.id} references unknown label ${labelId}`).toBe(true)
      }
    }
  })
})
