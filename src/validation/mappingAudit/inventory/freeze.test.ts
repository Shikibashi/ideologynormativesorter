import { describe, it, expect } from 'vitest'
import { WP0_FREEZE, liveFreezeMetrics, generateFullInventorySnapshots } from './freeze'
import { getBankFingerprint } from './snapshot'

describe('WP0 freeze inventory', () => {
  it('live metrics match frozen recount', () => {
    const live = liveFreezeMetrics()
    expect(live.rawMainQuestionCount).toBe(WP0_FREEZE.rawMainQuestionCount)
    expect(live.effectiveActiveQuestionCount).toBe(
      WP0_FREEZE.effectiveActiveQuestionCount,
    )
    expect(live.effectiveRetainedQuestionCount).toBe(
      WP0_FREEZE.effectiveRetainedQuestionCount,
    )
    expect(live.statementQuestionCount).toBe(WP0_FREEZE.statementQuestionCount)
    expect(live.labelCount).toBe(WP0_FREEZE.labelCount)
    expect(live.axisCount).toBe(WP0_FREEZE.axisCount)
    expect(live.familyCount).toBe(WP0_FREEZE.familyCount)
    expect(live.subfamilyPairCount).toBe(WP0_FREEZE.subfamilyPairCount)
    expect(live.overlayCorrectionCount).toBe(WP0_FREEZE.overlayCorrectionCount)
    expect(live.needsRewriteCount).toBe(WP0_FREEZE.needsRewriteCount)
    expect(live.rawMainContributionCardinality).toBe(
      WP0_FREEZE.rawMainContributionCardinality,
    )
    expect(live.effectiveActiveContributionCardinality).toBe(
      WP0_FREEZE.effectiveActiveContributionCardinality,
    )
    expect(live.statementContributionCardinality).toBe(
      WP0_FREEZE.statementContributionCardinality,
    )
    expect(live.families).toEqual([...WP0_FREEZE.families])
    expect(live.versions).toEqual(WP0_FREEZE.versions)
  })

  it('generateFullInventorySnapshots covers raw + effective + overlay sets', () => {
    const snapshots = generateFullInventorySnapshots()
    const sets = new Set(snapshots.map((s) => `${s.inventorySet}:${s.corpus}`))
    expect(sets.has('raw:main')).toBe(true)
    expect(sets.has('raw:statement')).toBe(true)
    expect(sets.has('raw:catalog')).toBe(true)
    expect(sets.has('effective-active:main')).toBe(true)
    expect(sets.has('effective-retained:main')).toBe(true)
    expect(sets.has('overlay:catalog')).toBe(true)
    for (const snapshot of snapshots) {
      expect(snapshot.fingerprint).toBe(getBankFingerprint())
      expect(snapshot.snapshotId.startsWith('inv:')).toBe(true)
    }
  })
})
