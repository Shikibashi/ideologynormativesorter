import { describe, it, expect } from 'vitest'
import { labels } from '../../../data/labels'
import type { IdeologyDossier } from '../types'
import { dossiers } from '../dossiers/index'
import { isMatchPoolMember } from '../predicates'
import {
  NEAR_DUPLICATE_DISTANCE,
  buildNearDuplicateFindings,
  computeSeparabilityDiagnostics,
  separabilityDiagnostics,
} from './diagnostics'

function stubDossier(
  labelId: string,
  centroid: Record<string, number>,
  family = 'test-family',
): IdeologyDossier {
  return {
    dossierId: `dossier:${labelId}`,
    labelId: labelId as IdeologyDossier['labelId'],
    lifecycle: 'active',
    family,
    aliases: [],
    survivorOf: [],
    claims: [],
    centroid,
    centroidRationales: {},
    matchPoolMember: true,
    linkedFindingIds: [],
    linkedTestIds: [],
    provisionalExpertOnly: true,
  }
}

describe('separability.suite', () => {
  const matchPool = dossiers.filter(isMatchPoolMember)

  it('diagnostics array is non-empty', () => {
    expect(separabilityDiagnostics.length).toBeGreaterThan(0)
  })

  it('runs diagnostics for all match-pool labels', () => {
    expect(matchPool.length).toBe(labels.length)

    const coherence = separabilityDiagnostics.filter(
      (d) => d.analysisType === 'cluster-coherence',
    )
    expect(coherence.length).toBe(matchPool.length)

    for (const dossier of matchPool) {
      const diagnostic = coherence.find(
        (d) => d.diagnosticId === `sep:coherence:${dossier.labelId}`,
      )
      expect(diagnostic, `missing coherence for ${dossier.labelId}`).toBeDefined()
      expect(diagnostic!.labelIdA).toBe(dossier.labelId)
      expect(diagnostic!.euclideanDistance).toBeGreaterThanOrEqual(0)
    }
  })

  it('emits near-duplicate diagnostics and proposed findings when distance < 0.35', () => {
    const identical = { 'authority-legitimacy': 0.5, equality: -0.2 }
    const synthetic = [
      stubDossier('sep-test-a', identical, 'same-family'),
      stubDossier('sep-test-b', { ...identical }, 'same-family'),
      stubDossier('sep-test-c', { 'authority-legitimacy': -1, equality: 1 }, 'other'),
    ]

    const diagnostics = computeSeparabilityDiagnostics(synthetic)
    const nearDup = diagnostics.filter(
      (d) =>
        d.analysisType === 'pairwise-distance' && d.result === 'near-duplicate',
    )

    expect(nearDup.length).toBe(1)
    expect(nearDup[0]!.diagnosticId).toBe('sep:near-duplicate:sep-test-a:sep-test-b')
    expect(nearDup[0]!.euclideanDistance).toBeLessThan(NEAR_DUPLICATE_DISTANCE)

    const findings = buildNearDuplicateFindings(diagnostics, synthetic)
    expect(findings.length).toBe(1)
    expect(findings[0]!.issueClass).toBe('near-duplicate-centroid')
    expect(findings[0]!.severity).toBe('major')
    expect(findings[0]!.lifecycle).toBe('proposed')
    expect(findings[0]!.proposedDisposition).toBe('merge')
    expect(findings[0]!.subjectIds).toEqual(['sep-test-a', 'sep-test-b'])
  })

  it('near-duplicate findings exist for every live pair below the threshold', () => {
    const nearDupDiagnostics = separabilityDiagnostics.filter(
      (d) =>
        d.analysisType === 'pairwise-distance' &&
        d.result === 'near-duplicate' &&
        d.euclideanDistance < NEAR_DUPLICATE_DISTANCE,
    )
    const findings = buildNearDuplicateFindings(separabilityDiagnostics)

    expect(findings.length).toBe(nearDupDiagnostics.length)
    for (const diagnostic of nearDupDiagnostics) {
      const [a, b] =
        diagnostic.labelIdA <= diagnostic.labelIdB
          ? [diagnostic.labelIdA, diagnostic.labelIdB]
          : [diagnostic.labelIdB, diagnostic.labelIdA]
      expect(
        findings.some(
          (f) =>
            f.findingId === `finding:near-duplicate-centroid:${a}:${b}:1` &&
            f.lifecycle === 'proposed',
        ),
      ).toBe(true)
    }
  })

  it('does not retune or mutate live label centroids', () => {
    const before = labels.map((l) => JSON.stringify(l.centroid))
    computeSeparabilityDiagnostics()
    const after = labels.map((l) => JSON.stringify(l.centroid))
    expect(after).toEqual(before)
  })
})
