import { describe, it, expect } from 'vitest'
import { labels } from '../../../data/labels'
import { findings } from '../findings/ledger'
import { labelLifecycleEntries } from '../labels/lifecycle'
import {
  NEAR_DUPLICATE_DISTANCE,
  buildNearDuplicateFindings,
  separabilityDiagnostics,
} from './diagnostics'

describe('separability.policy', () => {
  it('no active label has an applied reject-forced-spread violation', () => {
    const activeLabelIds = new Set(
      labelLifecycleEntries
        .filter((e) => e.lifecycle === 'active')
        .map((e) => e.labelId),
    )

    // Live catalog labels remain active unless lifecycle registry says otherwise.
    for (const label of labels) {
      if (!activeLabelIds.has(label.id)) activeLabelIds.add(label.id)
    }

    const violations = findings.filter(
      (f) =>
        f.proposedDisposition === 'reject-forced-spread' &&
        f.lifecycle === 'applied' &&
        f.subjectIds.some((id) => activeLabelIds.has(id as typeof labels[number]['id'])),
    )

    expect(violations).toEqual([])
  })

  it('near-duplicate findings exist when pairs are closer than 0.35', () => {
    const nearDupPairs = separabilityDiagnostics.filter(
      (d) =>
        d.analysisType === 'pairwise-distance' &&
        d.euclideanDistance < NEAR_DUPLICATE_DISTANCE,
    )
    const nearDupFindings = buildNearDuplicateFindings(separabilityDiagnostics).filter(
      (f) => f.issueClass === 'near-duplicate-centroid',
    )

    expect(nearDupFindings.length).toBe(nearDupPairs.length)

    for (const diagnostic of nearDupPairs) {
      const hit = nearDupFindings.find(
        (f) =>
          f.subjectIds.includes(diagnostic.labelIdA) &&
          f.subjectIds.includes(diagnostic.labelIdB),
      )
      expect(hit, `missing finding for ${diagnostic.diagnosticId}`).toBeDefined()
      expect(hit!.lifecycle).toBe('proposed')
      expect(['park-separability', 'merge']).toContain(hit!.proposedDisposition)
      expect(hit!.severity).toBe('major')
    }
  })

  it('near-duplicate findings are never auto-applied', () => {
    const nearDupFindings = findings.filter(
      (f) => f.issueClass === 'near-duplicate-centroid',
    )
    for (const finding of nearDupFindings) {
      expect(finding.lifecycle).toBe('proposed')
      expect(finding.lifecycle).not.toBe('applied')
    }
  })
})
