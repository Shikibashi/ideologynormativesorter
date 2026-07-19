import { describe, it, expect } from 'vitest'
import { labels } from '../../../data/labels'
import { axes } from '../../../data/axes'
import { dossiers, dossierByLabelId } from './index'
import {
  buildClaimStubsForLabel,
  expectedClaimFieldPaths,
} from './claims'
import {
  citationById,
  citationRegistry,
  LABEL_BANK_SCHOLARLY_STUB_IDS,
  labelBankPrimaryCiteId,
} from '../citations/registry'
import { ingressQueue } from '../citations/ingressQueue'
import { WP0_FREEZE } from '../inventory/freeze'

const PERSPECTIVE_KINDS = ['sympathetic', 'critical', 'neutral'] as const

function hasPerspectiveContent(entry: {
  text?: string
  unavailableReason?: string
}): boolean {
  return (
    (typeof entry.text === 'string' && entry.text.length > 0) ||
    (typeof entry.unavailableReason === 'string' &&
      entry.unavailableReason.length > 0)
  )
}

describe('claims.evidence', () => {
  it('every live label dossier has definition, family, and 26 centroid claims', () => {
    expect(labels.length).toBe(WP0_FREEZE.labelCount)
    expect(axes.length).toBe(WP0_FREEZE.axisCount)

    const expectedPaths = expectedClaimFieldPaths()
    expect(expectedPaths).toHaveLength(2 + WP0_FREEZE.axisCount)

    for (const label of labels) {
      const dossier = dossierByLabelId(label.id)
      expect(dossier, `missing dossier for ${label.id}`).toBeDefined()
      expect(dossier!.claims.length).toBe(expectedPaths.length)

      const paths = dossier!.claims.map((c) => c.fieldPath).sort()
      expect(paths).toEqual([...expectedPaths].sort())

      for (const claim of dossier!.claims) {
        expect(claim.labelId).toBe(label.id)
        expect(claim.claimId).toBe(`claim:${label.id}:${claim.fieldPath}:1`)
        expect(claim.statement.length).toBeGreaterThan(0)
        expect(claim.statement.startsWith('PENDING_CLAIM_STUB:')).toBe(true)
      }
    }
  })

  it('every claim meets Primary+2 scholarly+3 perspectives schema minima', () => {
    for (const dossier of dossiers) {
      for (const claim of dossier.claims) {
        expect(claim.primaryCiteId.length).toBeGreaterThan(0)
        expect(claim.scholarlyCiteIds.length).toBeGreaterThanOrEqual(2)

        for (const kind of PERSPECTIVE_KINDS) {
          const perspective = claim.perspectives[kind]
          expect(perspective, `${claim.claimId} missing ${kind}`).toBeDefined()
          expect(hasPerspectiveContent(perspective)).toBe(true)
        }
      }
    }
  })

  it('empiricalStatus is insufficient-data or deferred; expertStatus is never pass', () => {
    for (const dossier of dossiers) {
      for (const claim of dossier.claims) {
        expect(
          claim.empiricalStatus === 'insufficient-data' ||
            claim.empiricalStatus === 'deferred',
          `${claim.claimId} empiricalStatus=${claim.empiricalStatus}`,
        ).toBe(true)
        expect(
          claim.expertStatus,
          `${claim.claimId} expertStatus must not be pass`,
        ).not.toBe('pass')
      }
    }
  })

  it('claim cite ids resolve to secondary-seed registry entries', () => {
    expect(citationRegistry.length).toBeGreaterThanOrEqual(
      labels.length + LABEL_BANK_SCHOLARLY_STUB_IDS.length,
    )

    for (const label of labels) {
      const primary = citationById(labelBankPrimaryCiteId(label.id))
      expect(primary, `missing primary cite for ${label.id}`).toBeDefined()
      expect(primary!.kind).toBe('secondary-seed')
    }

    for (const citeId of LABEL_BANK_SCHOLARLY_STUB_IDS) {
      const scholarly = citationById(citeId)
      expect(scholarly, `missing scholarly stub ${citeId}`).toBeDefined()
      expect(scholarly!.kind).toBe('secondary-seed')
    }

    for (const dossier of dossiers) {
      for (const claim of dossier.claims) {
        expect(citationById(claim.primaryCiteId)).toBeDefined()
        for (const citeId of claim.scholarlyCiteIds) {
          expect(citationById(citeId)).toBeDefined()
        }
      }
    }
  })

  it('shared scholarly stubs are queued as unpromoted secondary-seed ingress', () => {
    for (const citeId of LABEL_BANK_SCHOLARLY_STUB_IDS) {
      const queued = ingressQueue.find((c) => c.citeId === citeId)
      expect(queued, `missing ingress entry ${citeId}`).toBeDefined()
      expect(queued!.kind).toBe('secondary-seed')
      expect(queued!.cleanRoomChecked).toBe(false)
      expect(queued!.independenceChecked).toBe(false)
      expect(queued!.promotedTo).toBeUndefined()
    }
  })

  it('buildClaimStubsForLabel matches dossier attachment for a sample label', () => {
    const label = labels[0]
    const built = buildClaimStubsForLabel(label)
    const attached = dossierByLabelId(label.id)!.claims
    expect(attached.map((c) => c.claimId)).toEqual(built.map((c) => c.claimId))
  })

  it('claim statements do not assert empirical respondent validity', () => {
    const forbidden = /respondent accuracy|empirically valid|validated against respondents/i
    for (const dossier of dossiers) {
      for (const claim of dossier.claims) {
        expect(forbidden.test(claim.statement)).toBe(false)
      }
    }
  })
})
