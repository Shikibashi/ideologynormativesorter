import { describe, it, expect } from 'vitest'
import { RESULT_SCORING_VERSION } from '../../../scoring/index'
import { getBankFingerprint } from '../inventory/snapshot'
import { releaseGate, isUnresolvedActive } from '../predicates'
import {
  buildReleaseSummary,
  evaluateCurrentReleaseGate,
  latestRelease,
} from './summary'
import { findings } from '../findings/ledger'
import { dossiers } from '../dossiers/index'
import { WP0_FREEZE } from '../inventory/freeze'

describe('releaseGate', () => {
  it('latest summary fingerprints match live bank + scoring versions', () => {
    const summary = latestRelease()!
    expect(summary.generatedFrom.bankFingerprint).toBe(getBankFingerprint())
    expect(summary.generatedFrom.scoringVersion).toBe(RESULT_SCORING_VERSION)
    expect(summary.generatedFrom.scoringVersion).toBe(WP0_FREEZE.versions.resultScoring)
  })

  it('releaseGate() fails overall while expert remains non-pass (truthful in-review)', () => {
    const result = evaluateCurrentReleaseGate()
    expect(result.pass).toBe(false)
    expect(
      result.failures.some((f) =>
        f.includes('expert gate requires pass'),
      ),
    ).toBe(true)
    // Fingerprint/unresolved checks still clean — only expert blocks.
    expect(result.failures).not.toContain('bankFingerprint mismatch')
    expect(result.failures).not.toContain('scoringVersion mismatch')
    expect(
      result.failures.some((f) => f.includes('unresolved active')),
    ).toBe(false)
  })

  it('unresolvedActiveCount is zero and matches ledger predicate', () => {
    const summary = latestRelease()!
    const liveUnresolved = findings.filter(isUnresolvedActive).length
    expect(summary.unresolvedActiveCount).toBe(0)
    expect(summary.unresolvedActiveCount).toBe(liveUnresolved)
  })

  it('dossier and finding cardinalities are populated', () => {
    const summary = latestRelease()!
    expect(summary.totalDossiers).toBe(dossiers.length)
    expect(summary.totalDossiers).toBe(WP0_FREEZE.labelCount)
    expect(summary.totalFindings).toBe(findings.length)
    expect(summary.totalFindings).toBeGreaterThan(100)
    expect(summary.totalContributions).toBe(
      WP0_FREEZE.effectiveActiveContributionCardinality
        + WP0_FREEZE.statementContributionCardinality,
    )
  })

  it('empirical gate is insufficient-data; expert gate is in-review (not fail, not pass)', () => {
    const summary = latestRelease()!
    const empirical = summary.gateStatuses.find((g) => g.gate === 'empirical')
    const expert = summary.gateStatuses.find((g) => g.gate === 'expert')
    expect(empirical?.status).toBe('insufficient-data')
    expect(expert?.status).toBe('in-review')
    expect(expert?.status).not.toBe('pass')
    expect(expert?.status).not.toBe('fail')
  })

  it('textual gate reflects researched-but-unreviewed rollup (in-review, not hardcoded pass)', () => {
    const summary = latestRelease()!
    const textual = summary.gateStatuses.find((g) => g.gate === 'textual')
    const allClaims = dossiers.flatMap((d) => d.claims)
    expect(allClaims.length).toBeGreaterThan(0)
    expect(allClaims.every((c) => c.textualStatus === 'in-review')).toBe(true)
    expect(textual?.status).toBe('in-review')
    expect(textual?.status).not.toBe('pass')
    expect(textual?.status).not.toBe('not-started')
  })

  it('textual in-review does not block release when expert is pass', () => {
    const summary = buildReleaseSummary()
    const withExpertPass = {
      ...summary,
      gateStatuses: summary.gateStatuses.map((g) =>
        g.gate === 'expert' ? { ...g, status: 'pass' as const } : g,
      ),
    }
    const textual = withExpertPass.gateStatuses.find((g) => g.gate === 'textual')
    expect(textual?.status).toBe('in-review')
    const result = releaseGate(
      withExpertPass,
      getBankFingerprint(),
      RESULT_SCORING_VERSION,
    )
    expect(result.pass).toBe(true)
    expect(result.failures.some((f) => f.toLowerCase().includes('textual'))).toBe(
      false,
    )
  })

  it('fails freshness check when fingerprint is stale', () => {
    const summary = buildReleaseSummary()
    const result = releaseGate(summary, 'stale-fingerprint', RESULT_SCORING_VERSION)
    expect(result.pass).toBe(false)
    expect(result.failures).toContain('bankFingerprint mismatch')
  })

  it('passes when expert is pass and empirical is insufficient-data', () => {
    const summary = buildReleaseSummary()
    const withExpertPass = {
      ...summary,
      gateStatuses: summary.gateStatuses.map((g) =>
        g.gate === 'expert' ? { ...g, status: 'pass' as const } : g,
      ),
    }
    const result = releaseGate(
      withExpertPass,
      getBankFingerprint(),
      RESULT_SCORING_VERSION,
    )
    expect(result.failures).toEqual([])
    expect(result.pass).toBe(true)
  })
})
