import { describe, expect, it } from 'vitest'
import { labels } from './labels'
import { primaryScoringLabels, publicCatalogLabels } from './labelTaxonomy'
import { catalogRelatedTraditions } from './catalogRelatedTraditions'
import { identitySovereigntyTraditionProfiles } from './identitySovereigntyBreadth'

describe('related ideology traditions', () => {
  it('keeps unmeasured catalog candidates outside every scored label pool', () => {
    const allLabelIds = new Set(labels.map((label) => label.id))
    const primaryIds = new Set(primaryScoringLabels.map((label) => label.id))
    const publicLabelIds = new Set(publicCatalogLabels.map((label) => label.id))

    for (const tradition of catalogRelatedTraditions) {
      expect(allLabelIds.has(tradition.id), `${tradition.id} has an unsupported scoring centroid`).toBe(false)
      expect(primaryIds.has(tradition.id), `${tradition.id} leaked into primary scoring`).toBe(false)
      expect(publicLabelIds.has(tradition.id), `${tradition.id} leaked into scored catalog labels`).toBe(false)
    }
  })

  it('has unique searchable metadata and source-backed explanatory copy', () => {
    expect(new Set(catalogRelatedTraditions.map((tradition) => tradition.id)).size).toBe(catalogRelatedTraditions.length)
    expect(new Set(catalogRelatedTraditions.map((tradition) => tradition.name)).size).toBe(catalogRelatedTraditions.length)

    for (const tradition of catalogRelatedTraditions) {
      expect(tradition.family.length).toBeGreaterThan(0)
      expect(tradition.subfamily.length).toBeGreaterThan(0)
      expect(tradition.description.length).toBeGreaterThan(80)
      expect(tradition.sourceUrls.length).toBeGreaterThan(0)
      expect(tradition.sourceUrls.every((url) => url.startsWith('https://'))).toBe(true)
    }
  })

  it('keeps broad libertarianism qualified and links focused candidates to a real module', () => {
    const marketLibertarian = publicCatalogLabels.find(
      (label) => label.id === 'market-right-libertarianism',
    )
    expect(marketLibertarian).toMatchObject({
      id: 'market-right-libertarianism',
      family: 'liberal',
      subfamily: 'right-libertarian',
    })
    expect(marketLibertarian?.aliases).not.toContain('Libertarianism')
    expect(marketLibertarian?.aliases).toContain('Market / Right-Libertarianism')
    expect(marketLibertarian?.description).toMatch(/broad right-libertarian family/i)

    const focusedCandidateIds = catalogRelatedTraditions
      .filter((tradition) => tradition.status === 'focused-follow-up')
      .map((tradition) => tradition.id)

    expect(focusedCandidateIds).toEqual([])
    for (const id of ['black-nationalism', 'pan-africanism']) {
      expect(publicCatalogLabels.find((label) => label.id === id)?.taxonomy.measurementStatus).toBe('provisional-specialist')
      expect(identitySovereigntyTraditionProfiles.some((profile) => profile.id === id)).toBe(true)
    }
  })
})
