import { describe, expect, it } from 'vitest'
import { labels } from './labels'
import { primaryScoringLabels } from './labelTaxonomy'
import {
  FEMINIST_CONSTRUCT_IDS,
  FEMINIST_MODULE_ID,
  feministConstructDistance,
  feministModuleItems,
  feministSpecialistCandidates,
  scoreFeministSpecialists,
  type FeministModuleAnswers,
} from './feministBreadth'

const candidateById = new Map(feministSpecialistCandidates.map((candidate) => [candidate.id, candidate]))

const ARCHETYPES: Array<{ id: string; targetId: string; answers: FeministModuleAnswers }> = [
  {
    id: 'liberal-rights-reformer',
    targetId: 'liberal-feminism',
    answers: {
      'fm-fem-1': 3,
      'fm-fem-2': 1,
      'fm-fem-3': 0,
      'fm-fem-4': 0,
      'fm-fem-5': -2,
      'fm-fem-6': 3,
      'fm-fem-7': -3,
      'fm-fem-8': -3,
    },
  },
  {
    id: 'radical-patriarchy-centered',
    targetId: 'radical-feminism',
    answers: {
      'fm-fem-1': -1,
      'fm-fem-2': 3,
      'fm-fem-3': 3,
      'fm-fem-4': 1,
      'fm-fem-5': 1,
      'fm-fem-6': 0,
      'fm-fem-7': 0,
      'fm-fem-8': 0,
    },
  },
  {
    id: 'socialist-materialist',
    targetId: 'socialist-feminism',
    answers: {
      'fm-fem-1': -1,
      'fm-fem-2': 2,
      'fm-fem-3': 2,
      'fm-fem-4': 3,
      'fm-fem-5': 3,
      'fm-fem-6': 1,
      'fm-fem-7': 0,
      'fm-fem-8': 0,
    },
  },
  {
    id: 'anarcha-anti-hierarchical',
    targetId: 'anarcha-feminism',
    answers: {
      'fm-fem-1': -2,
      'fm-fem-2': 3,
      'fm-fem-3': 3,
      'fm-fem-4': 2,
      'fm-fem-5': 2,
      'fm-fem-6': -3,
      'fm-fem-7': 3,
      'fm-fem-8': 3,
    },
  },
]

describe('feminist breadth module', () => {
  it('keeps the specialist measurement surface isolated from ordinary quiz tiers', () => {
    expect(feministModuleItems).toHaveLength(8)
    expect(new Set(feministModuleItems.map((item) => item.question.id)).size).toBe(feministModuleItems.length)

    for (const item of feministModuleItems) {
      expect(item.question.module).toBe(FEMINIST_MODULE_ID)
      expect(item.question.domain).toBe('family-gender-feminism')
      expect(item.question.responseType).toBe('likert7')
      expect(item.question.tier).toBe('extensive')
    }
  })

  it('measures every specialist construct with multiple independent items', () => {
    for (const constructId of FEMINIST_CONSTRUCT_IDS) {
      const coverage = feministModuleItems.filter((item) => {
        const weight = item.constructWeights[constructId]
        return weight !== undefined && weight !== 0
      }).length

      expect(coverage, `${constructId} has insufficient module coverage`).toBeGreaterThanOrEqual(2)
    }
  })

  it('keeps specialist candidate prototypes meaningfully separated', () => {
    let minimumDistance = Number.POSITIVE_INFINITY
    let closestPair = ''

    for (let i = 0; i < feministSpecialistCandidates.length; i++) {
      for (let j = i + 1; j < feministSpecialistCandidates.length; j++) {
        const left = feministSpecialistCandidates[i]
        const right = feministSpecialistCandidates[j]
        const distance = feministConstructDistance(left.centroid, right.centroid)
        if (distance < minimumDistance) {
          minimumDistance = distance
          closestPair = `${left.id} / ${right.id}`
        }
      }
    }

    expect(minimumDistance, `closest feminist specialist pair: ${closestPair}`).toBeGreaterThanOrEqual(0.4)
  })

  it('keeps specialist traditions out of primary scoring and quarantines the unlisted candidate', () => {
    const catalogIds = new Set(labels.map((label) => label.id))
    const primaryIds = new Set(primaryScoringLabels.map((label) => label.id))

    expect(catalogIds.has('liberal-feminism')).toBe(true)
    expect(catalogIds.has('anarcha-feminism')).toBe(true)
    expect(primaryIds.has('liberal-feminism')).toBe(true)
    expect(primaryIds.has('anarcha-feminism')).toBe(false)

    expect(candidateById.get('socialist-feminism')?.status).toBe('existing-specialist')
    expect(catalogIds.has('socialist-feminism')).toBe(true)
    expect(primaryIds.has('socialist-feminism')).toBe(false)

    expect(candidateById.get('radical-feminism')?.status).toBe('candidate-specialist')
    expect(catalogIds.has('radical-feminism'), 'radical-feminism was promoted before validation').toBe(false)
    expect(primaryIds.has('radical-feminism'), 'radical-feminism leaked into the primary pool').toBe(false)
  })

  for (const archetype of ARCHETYPES) {
    it(`${archetype.id} resolves to ${archetype.targetId}`, () => {
      const matches = scoreFeministSpecialists(archetype.answers)
      expect(matches[0]?.id).toBe(archetype.targetId)
      expect(matches[0]?.fit).toBeGreaterThan(0.5)
    })
  }
})
