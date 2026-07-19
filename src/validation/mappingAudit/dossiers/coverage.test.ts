import { describe, it, expect } from 'vitest'
import { labels } from '../../../data/labels'
import { axes } from '../../../data/axes'
import { dossiers, dossierByLabelId } from './index'
import { isMatchPoolMember } from '../predicates'
import { WP0_FREEZE } from '../inventory/freeze'
import { labelLifecycleEntries } from '../labels/lifecycle'

describe('dossiers.coverage', () => {
  it('has one dossier per live labelId', () => {
    expect(labels.length).toBe(WP0_FREEZE.labelCount)
    expect(dossiers.length).toBe(labels.length)

    for (const label of labels) {
      const dossier = dossierByLabelId(label.id)
      expect(dossier, `missing dossier for ${label.id}`).toBeDefined()
      expect(dossier!.dossierId).toBe(`dossier:${label.id}`)
      expect(dossier!.family).toBe(label.family)
    }
  })

  it('every dossier centroid covers all axes in [-1,1]', () => {
    for (const dossier of dossiers) {
      for (const axis of axes) {
        const value = dossier.centroid[axis.id]
        expect(value, `${dossier.labelId} missing ${axis.id}`).toBeTypeOf('number')
        expect(value).toBeGreaterThanOrEqual(-1)
        expect(value).toBeLessThanOrEqual(1)
        expect(dossier.centroidRationales[axis.id]?.length).toBeGreaterThan(0)
      }
    }
  })

  it('match-pool members satisfy isMatchPoolMember predicate', () => {
    for (const dossier of dossiers.filter((d) => d.matchPoolMember)) {
      expect(isMatchPoolMember(dossier)).toBe(true)
    }
  })

  it('lifecycle registry covers every live label', () => {
    expect(labelLifecycleEntries.length).toBe(labels.length)
    for (const label of labels) {
      expect(
        labelLifecycleEntries.some((e) => e.labelId === label.id),
      ).toBe(true)
    }
  })
})
