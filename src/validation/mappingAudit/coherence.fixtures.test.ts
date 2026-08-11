import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { primaryScoringLabels } from '../../data/labelTaxonomy'
import { allCalibrationFixtures } from '../../scoring/calibration.fixtures'
import { dossiers } from './dossiers/index'
import { isMatchPoolMember } from './predicates'

const FORBIDDEN_ACCURACY = [
  'empirically validated accuracy',
  'respondent-proven match',
  'scientifically confirmed ideology',
]

describe('coherence.fixtures', () => {
  it('every match-pool label has a synthetic calibration fixture (coherence-only)', () => {
    const matchPool = dossiers.filter(isMatchPoolMember)
    const covered = new Set(
      allCalibrationFixtures.map((f) => f.expectedLabelIds[0]),
    )

    for (const dossier of matchPool) {
      expect(
        covered.has(dossier.labelId),
        `missing coherence fixture for ${dossier.labelId}`,
      ).toBe(true)
    }

    expect(matchPool.length).toBe(primaryScoringLabels.length)
  })

  it('calibration fixture module documents synthetic/coherence-only intent', () => {
    const source = readFileSync('src/scoring/calibration.fixtures.ts', 'utf8')
    const lower = source.toLowerCase()

    // Coherence markers: synthetic centroid-aligned fixtures, not respondent accuracy.
    expect(
      lower.includes('synthetic') ||
        lower.includes('centroid') ||
        lower.includes('fixture'),
    ).toBe(true)

    for (const phrase of FORBIDDEN_ACCURACY) {
      expect(lower.includes(phrase)).toBe(false)
    }
  })

  it('archetype-sweep test source keeps coherence/reflexivity language (no accuracy claim)', () => {
    const source = readFileSync('src/scoring/archetype-sweep.test.ts', 'utf8')
    const lower = source.toLowerCase()
    expect(lower.includes('reflexivity') || lower.includes('synthetic')).toBe(
      true,
    )
    for (const phrase of FORBIDDEN_ACCURACY) {
      expect(lower.includes(phrase)).toBe(false)
    }
  })
})
