import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { labels } from './labels'

const review = readFileSync('docs/editorial-review-third-pass-2026-08.md', 'utf8')
const labelById = new Map(labels.map((label) => [label.id, label]))

function normalizeTaxonomyTerm(value: string): string {
  return value
    .normalize('NFKD')
    .replace(/\p{Diacritic}/gu, '')
    .toLocaleLowerCase('en-US')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
}

describe('editorial third pass', () => {
  it('keeps Islamic democratic constitutionalism in a religious-political family without generic ideology tags', () => {
    const label = labelById.get('islamic-democracy')!

    expect(label.family).toBe('religious-political')
    expect(label.philosophies).toEqual([
      'Islamic Democracy',
      'Religious Constitutionalism',
    ])
    expect(label.philosophies).not.toContain('Conservatism')
    expect(label.philosophies).not.toContain('Islamism')
  })

  it('keeps cyberocracy scoped to information-system governance', () => {
    const label = labelById.get('cyberocracy')!

    expect(label.philosophies).not.toContain('Progressivism')
    expect(label.subTheories).toEqual(['Algorithmic Governance'])
    expect(label.subTheories).not.toContain('Syntheism')
  })

   it('keeps aliases, neighboring ideologies, policies, and research fields out of subtype lists', () => {
      expect(labelById.get('left-wing-market-anarchism')!.subTheories).toEqual(['Left-Rothbardianism'])
      expect(labelById.get('national-bolshevism')!.aliases).toBeUndefined()
      expect(labelById.get('integralism')!.aliases).toContain('Catholic Integralism')
      expect(labelById.get('integralism')!.subTheories).toBeUndefined()
      expect(labelById.get('world-federalism')!.subTheories).toBeUndefined()
    expect(labelById.get('islamic-democracy')!.subTheories).toBeUndefined()

    const liquidDemocracy = labelById.get('liquid-democracy')!
    expect(liquidDemocracy.subTheories).toBeUndefined()
    expect(liquidDemocracy.philosophies).not.toContain('Delegative Democracy')

    expect(labelById.get('bleeding-heart-libertarianism')!.subTheories).toBeUndefined()
    expect(labelById.get('dataism')!.subTheories).toBeUndefined()
    expect(labelById.get('singularitarianism')!.subTheories).toBeUndefined()
    expect(labelById.get('paleoconservatism')!.subTheories).toBeUndefined()
    expect(labelById.get('traditional-monarchist')!.subTheories).toBeUndefined()
    expect(labelById.get('civic-nationalist')!.subTheories).toEqual(['Liberal Nationalism'])
  })

  it('removes parent concepts, self-restatements, and filler placeholders from subtypes', () => {
    expect(labelById.get('anarcho-primitivism')!.aliases).toBeUndefined()
    expect(labelById.get('anarcho-primitivism')!.subTheories).toBeUndefined()
    expect(labelById.get('strasserism')!.subTheories).toBeUndefined()
    expect(labelById.get('theocrat')!.aliases).toBeUndefined()
    expect(labelById.get('theocrat')!.subTheories).toBeUndefined()

    const radicalCentrism = labelById.get('radical-centrism')!
    expect(radicalCentrism.aliases).toEqual(['Radical Center'])
    expect(radicalCentrism.subTheories).toEqual(['Third Way', 'Post-Ideological Politics'])

    const fillerTerms = new Set([
      'Internal Branches',
      'Internal Schools',
      'Internal Strands',
      'Internal Traditions',
    ])
    for (const label of labels) {
      for (const subTheory of label.subTheories ?? []) {
        expect(fillerTerms.has(subTheory), `${label.id} retains filler subtype "${subTheory}"`).toBe(false)
      }
    }
  })

  it('uses scope-accurate display families for narrowed and cross-cutting labels', () => {
    const corporatism = labelById.get('corporatism')!
    expect(corporatism.name).toBe('State Corporatism')
    expect(corporatism.subTheories).toBeUndefined()
    expect(corporatism.philosophies).toContain('State Corporatism')
    expect(corporatism.philosophies).not.toContain('Corporatism')

    const regionalism = labelById.get('regionalism')!
    expect(regionalism.family).toBe('regionalist')
    expect(regionalism.subTheories).toBeUndefined()
  })

  it('does not present a label name or one of its aliases as its own subtype', () => {
    for (const label of labels) {
      const parentTerms = new Set(
        [label.name, ...(label.aliases ?? [])].map(normalizeTaxonomyTerm),
      )

      for (const subTheory of label.subTheories ?? []) {
        expect(
          parentTerms.has(normalizeTaxonomyTerm(subTheory)),
          `${label.id} repeats parent term "${subTheory}" as a subtype`,
        ).toBe(false)
      }
    }
  })

  it('keeps every structured influence attached to a declared philosophy', () => {
    for (const label of labels) {
      const philosophies = new Set(label.philosophies ?? [])
      for (const influence of label.philosophyInfluences ?? []) {
        expect(
          philosophies.has(influence.philosophy),
          `${label.id} influence "${influence.philosophy}" is not a declared philosophy`,
        ).toBe(true)
      }
    }
  })

  it('records the corrected labels and unresolved question debt in the dated review', () => {
    for (const id of [
      'cyberocracy',
      'hindutva',
      'zionism',
      'islamic-democracy',
      'corporatism',
      'world-federalism',
      'liquid-democracy',
      'regionalism',
      'radical-centrism',
      'q0211',
      'q0297',
      'q0346',
      'q0048',
      'q0410',
    ]) {
      expect(review, `${id} is missing from the third-pass review`).toContain(`\`${id}\``)
    }

    expect(review).toContain('No centroid or question axis weight changed')
    expect(review).toContain('cognitive interviews')
  })
})
