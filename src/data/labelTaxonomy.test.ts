import { describe, expect, it } from 'vitest'
import { axes } from './axes'
import { questions } from './effectiveQuestions'
import {
  CONTEXT_LABEL_IDS,
  LABEL_IDS_BY_ROLE,
  MODIFIER_LABEL_IDS,
  PRIMARY_LABEL_IDS,
  PROVISIONAL_SPECIALIST_LABEL_IDS,
  RETIRED_LABEL_IDS,
  SPECIALIST_LABEL_IDS,
  primaryScoringLabels,
  publicCatalogLabels,
  researchIdentityLabels,
  roleForLabel,
  specialistModuleByLabel,
} from './labelTaxonomy'
import { labels } from './labels'
import { specialistModuleDefinitions } from '../specialist'

const MAJOR_PRIMARY_FAMILIES = [
  'anarchist',
  'authoritarian',
  'communitarian',
  'conservative',
  'democratic',
  'distributist',
  'green',
  'liberal',
  'nationalist',
  'republican',
  'social-democratic',
  'socialist',
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

const LIBERAL_LIBERTARIAN_LABEL_IDS = [
  'decentralist-market-skeptic-of-state',
  'geolibertarian',
  'anarcho-capitalist',
  'minarchist',
  'agorist',
  'paleolibertarianism',
  'objectivism',
  'voluntaryism',
  'georgism',
] as const

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
    expect(primaryScoringLabels.length).toBeGreaterThanOrEqual(20)
    expect(primaryScoringLabels.length).toBeLessThanOrEqual(45)
    expect(primaryScoringLabels).toHaveLength(PRIMARY_LABEL_IDS.length)
  })

  it('covers the major political families in the primary pool', () => {
    const families = new Set(primaryScoringLabels.map((label) => label.family))
    for (const family of MAJOR_PRIMARY_FAMILIES) {
      expect(families.has(family), `primary scoring pool is missing ${family}`).toBe(true)
    }
  })

  it('places market and right-libertarian traditions in the liberal lineage without absorbing socialist or anarchist uses', () => {
    const labelById = new Map(labels.map((label) => [label.id, label]))

    for (const labelId of LIBERAL_LIBERTARIAN_LABEL_IDS) {
      expect(labelById.get(labelId)?.family, `${labelId} should be grouped under liberal`).toBe('liberal')
    }

    expect(labelById.get('libertarian-socialism')?.family).toBe('socialist')
    expect(labelById.get('left-wing-market-anarchism')?.family).toBe('anarchist')
    expect(labelById.get('libertarian-municipalism')?.family).not.toBe('liberal')
  })

  it('keeps adjacent anarchist and anti-state labels from inheriting narrower doctrines as required subtypes', () => {
    const labelById = new Map(labels.map((label) => [label.id, label]))

    expect(labelById.get('left-wing-market-anarchism')?.prescriptivePhilosophies).not.toContain('Mutualism')
    expect(labelById.get('individualist-anarchism')?.philosophies).not.toEqual(expect.arrayContaining(['Stirnerism', 'Egoism']))
    expect(labelById.get('individualist-anarchism')?.subTheories).not.toContain('Post-Left Anarchism')
    expect(labelById.get('voluntaryism')?.aliases ?? []).not.toContain('Contractual Anarchism')
    expect(labelById.get('stirnerism')?.philosophies).not.toContain('Nihilism')
    expect(labelById.get('stirnerism')?.subTheories).toEqual([])
    expect(labelById.get('techno-anarchism')?.philosophies).not.toContain('Cyber-Libertarianism')
    expect(labelById.get('techno-anarchism')?.subTheories).toEqual([])
    expect(labelById.get('queer-anarchism')?.subTheories).not.toContain('Gender Abolition')
    expect(labelById.get('anarcha-feminism')?.prescriptivePhilosophies).toContain('Anarcha-Feminism')
  })

  it('keeps socialist lineages broad without forcing adjacent traditions into Marxism or one generic subfamily', () => {
    const labelById = new Map(labels.map((label) => [label.id, label]))
    const socialDemocrat = labelById.get('social-democrat')!

    expect(socialDemocrat.philosophies).not.toContain('Marxism')
    expect(socialDemocrat.descriptivePhilosophies).toEqual([])
    expect(labelById.get('council-communist')?.subTheories).not.toContain('Luxemburgism')
    expect(labelById.get('christian-socialism')?.subfamily).toBe('religious-socialist')
    expect(labelById.get('utopian-socialism')?.subfamily).toBe('early-socialist')
    expect(labelById.get('marxist-leninist')?.subTheories).not.toContain('Titoism')
    expect(labelById.get('maoism')?.philosophies).toContain('Maoism')
    expect(labelById.get('maoism')?.prescriptivePhilosophies).toContain('Maoism')
    expect(labelById.get('trotskyism')?.philosophies).toContain('Trotskyism')
    expect(labelById.get('trotskyism')?.prescriptivePhilosophies).toContain('Trotskyism')
    expect(labelById.get('guild-socialism')?.philosophies).not.toContain('Distributism')
    expect(labelById.get('guild-socialism')?.normativePhilosophies).not.toContain('Distributism')
    expect(labelById.get('christian-socialism')?.subTheories).toBeUndefined()
    expect(labelById.get('anti-imperialism')?.family).toBe('anti-colonial')
  })

  it('keeps conservative traditions distinct from thin positions, influences, and catalog-specific hybrids', () => {
    const labelById = new Map(labels.map((label) => [label.id, label]))
    const neoconservative = labelById.get('neoconservative')!
    const fiscalConservatism = labelById.get('fiscal-conservatism')!
    const nationalConservatism = labelById.get('national-conservatism')!

    expect(neoconservative.philosophies).not.toContain('Straussianism')
    expect(neoconservative.subTheories).toBeUndefined()
    expect(neoconservative.usageNote).toMatch(/not a definition or subtype/)
    expect(labelById.get('paleoconservatism')?.subTheories).toBeUndefined()
    expect(labelById.get('paleoconservatism')?.prescriptivePhilosophies).toContain('Paleoconservatism')
    expect(labelById.get('one-nation-conservatism')?.subTheories).toBeUndefined()
    expect(fiscalConservatism.philosophies).toEqual(['Fiscal Conservatism'])
    expect(fiscalConservatism.normativePhilosophies).toEqual([])
    expect(fiscalConservatism.descriptivePhilosophies).toEqual([])
    expect(labelById.get('social-conservatism')?.subTheories).toBeUndefined()
    expect(labelById.get('social-conservatism')?.descriptivePhilosophies).toEqual([])
    expect(nationalConservatism.philosophies).not.toContain('Realism')
    expect(nationalConservatism.descriptivePhilosophies).toEqual([])
    expect(labelById.get('liberal-conservatism')?.descriptivePhilosophies).toEqual([])
    expect(labelById.get('conservative-liberalism')?.usageNote).toMatch(/not a universal taxonomy/)
    expect(labelById.get('liberal-conservatism')?.usageNote).toMatch(/not a universal taxonomy/)
  })

  it('keeps nationalist membership and sovereignty traditions distinct from required subtypes and explanatory theories', () => {
    const labelById = new Map(labels.map((label) => [label.id, label]))

    expect(labelById.get('civic-nationalist')?.normativePhilosophies).toContain('Civic Nationalism')
    expect(labelById.get('indigenism')?.prescriptivePhilosophies).toContain('Indigenism')
    expect(labelById.get('hindutva')?.prescriptivePhilosophies).toContain('Hindutva')
    expect(labelById.get('religious-nationalism')?.prescriptivePhilosophies).toContain('Religious Nationalism')
    expect(labelById.get('zionism')?.prescriptivePhilosophies).toContain('Zionism')
    expect(labelById.get('left-wing-nationalism')?.prescriptivePhilosophies).toContain('Anti-Colonialism')
    expect(labelById.get('expansionist-nationalism')?.philosophies).not.toContain('Realism')
    expect(labelById.get('expansionist-nationalism')?.philosophies).not.toContain('Social Darwinism')
    expect(labelById.get('expansionist-nationalism')?.descriptivePhilosophies).toEqual([])
    expect(labelById.get('separatist-nationalism')?.usageNote).toMatch(/does not by itself establish a right to unilateral secession/)
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

  it('keeps context-only concepts out of scoring while keeping them browsable', () => {
    for (const labelId of CONTEXT_LABEL_IDS) {
      expect(primaryScoringLabels.some((label) => label.id === labelId)).toBe(false)
      expect(publicCatalogLabels.some((label) => label.id === labelId)).toBe(true)
      expect(publicCatalogLabels.find((label) => label.id === labelId)?.taxonomy.measurementStatus).toBe('context-only')
    }
  })

  it('uses the same primary pool for research self-identification as for predicted results', () => {
    expect(researchIdentityLabels.map((label) => label.id)).toEqual(primaryScoringLabels.map((label) => label.id))
  })

  it('requires every non-provisional specialist label to have an existing, substantive depth module', () => {
    const moduleCounts = new Map<string, number>(
      specialistModuleDefinitions.map((module) => [module.id, module.questions.length]),
    )
    const provisionalSpecialists = new Set<string>(PROVISIONAL_SPECIALIST_LABEL_IDS)

    expect(Object.keys(specialistModuleByLabel)).toHaveLength(
      SPECIALIST_LABEL_IDS.length - provisionalSpecialists.size,
    )
    for (const labelId of SPECIALIST_LABEL_IDS) {
      const moduleId = specialistModuleByLabel[labelId]
      if (provisionalSpecialists.has(labelId)) {
        expect(moduleId, `${labelId} must remain unmapped until it has a dedicated module`).toBeUndefined()
        continue
      }
      expect(moduleId, `${labelId} has no depth-module mapping`).toBeTruthy()
      expect(moduleCounts.get(moduleId!) ?? 0, `${labelId} maps to a missing or tiny module ${moduleId}`).toBeGreaterThanOrEqual(4)
    }
  })

  it('promotes the first specialist module wave without adding those labels to primary scoring', () => {
    expect(specialistModuleByLabel['council-communist']).toBe('socialist-families-module')
    expect(specialistModuleByLabel['maoism']).toBe('socialist-families-module')
    expect(specialistModuleByLabel['trotskyism']).toBe('socialist-families-module')
    expect(PROVISIONAL_SPECIALIST_LABEL_IDS).not.toContain('council-communist')
  })

  it('exposes socialist feminism only through its construct-matched specialist module', () => {
    expect(roleForLabel('socialist-feminism')).toBe('specialist')
    expect(primaryScoringLabels.some((label) => label.id === 'socialist-feminism')).toBe(false)
    expect(publicCatalogLabels.some((label) => label.id === 'socialist-feminism')).toBe(true)
    expect(specialistModuleByLabel['socialist-feminism']).toBe('feminist-faction-module')
  })

  it('routes labels according to what the current instrument can actually distinguish', () => {
    expect(roleForLabel('liberal-feminism')).toBe('specialist')
    expect(specialistModuleByLabel['liberal-feminism']).toBe('feminist-faction-module')
    expect(roleForLabel('constitutional-monarchism')).toBe('context')
    expect(roleForLabel('civil-libertarian-cosmopolitan')).toBe('retired')
  })

  it('does not route world federalism through nationalist discriminators', () => {
    expect(roleForLabel('world-federalism')).toBe('context')
    expect(publicCatalogLabels.find((label) => label.id === 'world-federalism')?.taxonomy.measurementStatus).toBe('context-only')
    expect(PROVISIONAL_SPECIALIST_LABEL_IDS).not.toContain('world-federalism')
    expect(specialistModuleByLabel['world-federalism']).toBeUndefined()
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
