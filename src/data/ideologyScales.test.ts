import { describe, expect, it } from 'vitest'
import {
  ANALYTICAL_SCALE_GUIDANCE,
  IDEOLOGY_SCALE_SOURCES,
  IDEOLOGY_SCALE_VERSION,
  ideologyScaleMetadataForLabel,
} from './ideologyScales'
import { modifierScoringLabels, publicCatalogLabels, primaryScoringLabels, PROVISIONAL_SPECIALIST_LABEL_IDS } from './labelTaxonomy'

describe('analytical ideology scales', () => {
  it('keeps the scale vocabulary versioned and academically bounded', () => {
    expect(IDEOLOGY_SCALE_VERSION).toMatch(/^2026-08-analytical-scale-v2$/)
    expect(IDEOLOGY_SCALE_SOURCES.length).toBeGreaterThanOrEqual(4)
    expect(IDEOLOGY_SCALE_SOURCES.every((source) => source.url.startsWith('https://'))).toBe(true)
    expect(IDEOLOGY_SCALE_SOURCES.some((source) => source.sourceId === 'routledge-maynard-four-levels')).toBe(true)
    expect(ANALYTICAL_SCALE_GUIDANCE.nano).toMatch(/analysis-only proposed sublevel/i)
  })

  it('gives every public label scale guidance without turning scale into a scoring role', () => {
    for (const label of publicCatalogLabels) {
      expect(label.taxonomy.analyticalScale.commonScales.length, label.id).toBeGreaterThan(0)
      expect(label.taxonomy.analyticalScale.sources.length, label.id).toBeGreaterThanOrEqual(4)
      expect(label.taxonomy.analyticalScale.commonScales).not.toContain('nano')
    }
  })

  it('keeps broad and specialist entries distinct while separating micro uptake from nano analysis', () => {
    expect(primaryScoringLabels.every((label) => label.taxonomy.analyticalScale.commonScales.includes('macro'))).toBe(true)
    expect(PROVISIONAL_SPECIALIST_LABEL_IDS.every((labelId) => {
      const label = publicCatalogLabels.find((candidate) => candidate.id === labelId)
      return label?.taxonomy.analyticalScale.commonScales.includes('meso')
    })).toBe(true)

    const allAssignedScales = publicCatalogLabels.flatMap((label) => label.taxonomy.analyticalScale.commonScales)
    expect(allAssignedScales).not.toContain('micro')
    expect(allAssignedScales).not.toContain('nano')
    expect(primaryScoringLabels.every((label) => label.taxonomy.analyticalScale.respondentMeasurementScale === 'micro')).toBe(true)
    expect(modifierScoringLabels.every((label) => label.taxonomy.analyticalScale.respondentMeasurementScale === 'micro')).toBe(true)
    expect(publicCatalogLabels.filter((label) => label.taxonomy.role === 'specialist').every((label) => label.taxonomy.analyticalScale.respondentMeasurementScale === null)).toBe(true)
    expect(publicCatalogLabels.filter((label) => label.taxonomy.role === 'context').every((label) => label.taxonomy.analyticalScale.respondentMeasurementScale === null)).toBe(true)
  })

  it('uses role-specific wording instead of implying that a label is a fixed social level', () => {
    expect(ideologyScaleMetadataForLabel('broad-anchor', 'primary').note).toMatch(/respondent.*micro-level uptake/i)
    expect(ideologyScaleMetadataForLabel('broad-anchor', 'primary').respondentMeasurementScale).toBe('micro')
    expect(ideologyScaleMetadataForLabel('institutional-context', 'context').note).toMatch(/institutional arrangement/i)
    expect(ideologyScaleMetadataForLabel('institutional-context', 'context').respondentMeasurementScale).toBeNull()
    expect(ideologyScaleMetadataForLabel('cross-cutting', 'modifier').note).toMatch(/not a complete ideology/i)
  })
})
