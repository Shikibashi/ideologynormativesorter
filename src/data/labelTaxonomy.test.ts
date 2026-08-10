import { describe, expect, it } from 'vitest'
import { axes } from './axes'
import { questions } from './effectiveQuestions'
import {
  CONTEXT_LABEL_IDS,
  LABEL_IDS_BY_ROLE,
  MODIFIER_LABEL_IDS,
  PRIMARY_LABEL_IDS,
  RETIRED_LABEL_IDS,
  SPECIALIST_LABEL_IDS,
  primaryScoringLabels,
  publicCatalogLabels,
  researchIdentityLabels,
  roleForLabel,
  specialistModuleByLabel,
} from './labelTaxonomy'
import { labels } from './labels'
import { moduleQuestions } from './moduleQuestions'

const MAJOR_PRIMARY_FAMILIES = [
  'anarchist',
  'authoritarian',
  'communitarian',
  'conservative',
  'democratic',
  'distributist',
  'green',
  'liberal',
  'libertarian-leaning',
  'nationalist',
  'republican',
  'social-democratic',
  'socialist',
  'technocratic',
]

const NON_IDEOLOGY_ENDPOINTS = [
  'accelerationism',
  'cyberocracy',
  'dataism',
  'liquid-democracy',
  'radical-centrism',
  'singularitarianism',
  'social-investment-state',
  'transhumanism',
  'universal-basic-income',
]

const THIN_OR_CROSS_CUTTING_ENDPOINTS = [
  'anti-imperialism',
  'eco-authoritarianism',
  'fiscal-conservatism',
  'internationalism',
  'left-wing-nationalism',
  'left-wing-populism',
  'multiculturalism',
  'regionalism',
  'right-wing-populism',
  'separatist-nationalism',
  'theocrat',
  'welfare-chauvinism',
]

function centroidDistance(a: Record<string, number>, b: Record<string, number>): number {
  return Math.sqrt(
    axes.reduce((sum, axis) => {
      const delta = (a[axis.id] ?? 0) - (b[axis.id] ?? 0)
      return sum + delta * delta
    }, 0),
  )
}

describe('ideology taxonomy', () => {
  it('assigns every catalog label to exactly one role', () => {
    const assigned = Object.values(LABEL_IDS_BY_ROLE).flat()
    const assignedSet = new Set(assigned)
    const catalogSet = new Set(labels.map((label) => label.id))

    expect(assigned).toHaveLength(assignedSet.size)
    expect(assignedSet).toEqual(catalogSet)
    for (const label of labels) expect(roleForLabel(label.id)).toBeDefined()
  })

  it('keeps the default scoring pool broad but bounded', () => {
    expect(primaryScoringLabels.length).toBeGreaterThanOrEqual(25)
    expect(primaryScoringLabels.length).toBeLessThanOrEqual(45)
    expect(primaryScoringLabels).toHaveLength(PRIMARY_LABEL_IDS.length)
  })

  it('covers the major political families in the primary pool', () => {
    const families = new Set(primaryScoringLabels.map((label) => label.family))
    for (const family of MAJOR_PRIMARY_FAMILIES) {
      expect(families.has(family), `primary scoring pool is missing ${family}`).toBe(true)
    }
  })

  it('does not score policy proposals, futurist concepts, or governance mechanisms as primary ideologies', () => {
    for (const labelId of NON_IDEOLOGY_ENDPOINTS) {
      expect(roleForLabel(labelId), `${labelId} should not be primary`).not.toBe('primary')
      expect(primaryScoringLabels.some((label) => label.id === labelId)).toBe(false)
    }
  })

  it('keeps thin and cross-cutting positions as modifiers rather than standalone primary identities', () => {
    for (const labelId of THIN_OR_CROSS_CUTTING_ENDPOINTS) {
      expect(MODIFIER_LABEL_IDS).toContain(labelId)
      expect(roleForLabel(labelId)).toBe('modifier')
    }
  })

  it('keeps retired synthetic labels out of both scoring and the public label browser', () => {
    for (const labelId of RETIRED_LABEL_IDS) {
      expect(primaryScoringLabels.some((label) => label.id === labelId)).toBe(false)
      expect(publicCatalogLabels.some((label) => label.id === labelId)).toBe(false)
    }
  })

  it('keeps context-only concepts out of both scoring and the public label browser', () => {
    for (const labelId of CONTEXT_LABEL_IDS) {
      expect(primaryScoringLabels.some((label) => label.id === labelId)).toBe(false)
      expect(publicCatalogLabels.some((label) => label.id === labelId)).toBe(false)
    }
  })

  it('uses the same primary pool for research self-identification as for predicted results', () => {
    expect(researchIdentityLabels.map((label) => label.id)).toEqual(primaryScoringLabels.map((label) => label.id))
  })

  it('requires every specialist label to have an existing, substantive depth module', () => {
    const moduleCounts = new Map<string, number>()
    for (const question of moduleQuestions) {
      if (!question.module) continue
      moduleCounts.set(question.module, (moduleCounts.get(question.module) ?? 0) + 1)
    }

    expect(Object.keys(specialistModuleByLabel)).toHaveLength(SPECIALIST_LABEL_IDS.length)
    for (const labelId of SPECIALIST_LABEL_IDS) {
      const moduleId = specialistModuleByLabel[labelId]
      expect(moduleId, `${labelId} has no depth-module mapping`).toBeTruthy()
      expect(moduleCounts.get(moduleId!) ?? 0, `${labelId} maps to a missing or tiny module ${moduleId}`).toBeGreaterThanOrEqual(4)
    }
  })

  it('measures the strongest distinctions between every primary label and its nearest primary neighbor', () => {
    for (const label of primaryScoringLabels) {
      const neighbors = primaryScoringLabels
        .filter((candidate) => candidate.id !== label.id)
        .map((candidate) => ({ candidate, distance: centroidDistance(label.centroid, candidate.centroid) }))
        .sort((a, b) => a.distance - b.distance)

      const nearest = neighbors[0]?.candidate
      expect(nearest, `${label.id} has no primary neighbor`).toBeDefined()

      const strongestDifferences = axes
        .map((axis) => ({
          axisId: axis.id,
          difference: Math.abs(label.centroid[axis.id] - nearest!.centroid[axis.id]),
        }))
        .sort((a, b) => b.difference - a.difference)
        .slice(0, 3)

      for (const difference of strongestDifferences) {
        const itemCount = questions.filter((question) =>
          question.axisWeights.some((weight) => weight.axisId === difference.axisId),
        ).length
        expect(
          itemCount,
          `${label.id} vs ${nearest!.id} depends on undermeasured axis ${difference.axisId}`,
        ).toBeGreaterThanOrEqual(2)
      }
    }
  })
})
