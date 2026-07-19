import { describe, it, expect } from 'vitest'
import { axes } from '../../../data/axes'
import { dossiers } from './index'
import { WP0_FREEZE } from '../inventory/freeze'
import { reviewsForFinding } from '../reviews/records'
import { findingsForSubject } from '../findings/ledger'

describe('centroid.validity', () => {
  it('every dossier centroid covers all axes in [-1, 1]', () => {
    expect(dossiers.length).toBe(WP0_FREEZE.labelCount)

    for (const dossier of dossiers) {
      for (const axis of axes) {
        const value = dossier.centroid[axis.id]
        expect(value, `${dossier.labelId} missing ${axis.id}`).toBeTypeOf('number')
        expect(value).toBeGreaterThanOrEqual(-1)
        expect(value).toBeLessThanOrEqual(1)
      }
      expect(Object.keys(dossier.centroid).length).toBe(axes.length)
    }
  })

  it('every dossier has a centroid rationale per axis', () => {
    for (const dossier of dossiers) {
      for (const axis of axes) {
        const rationale = dossier.centroidRationales[axis.id]
        expect(
          rationale && rationale.length > 0,
          `${dossier.labelId} missing rationale for ${axis.id}`,
        ).toBe(true)
      }
    }
  })

  it('no dossier claims expert pass without qualified reviews', () => {
    for (const dossier of dossiers) {
      for (const claim of dossier.claims) {
        if (claim.expertStatus === 'pass') {
          const related = findingsForSubject(dossier.labelId)
          for (const finding of related) {
            const reviews = reviewsForFinding(finding.findingId)
            expect(
              reviews.every((r) => r.qualificationStatus === 'qualified-expert'),
            ).toBe(true)
          }
        }
      }
    }
  })
})
