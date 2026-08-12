import { describe, it, expect } from 'vitest'
import { questionWaves } from './partition'
import {
  responseContributions,
  statementContributions,
} from '../manifests/responseContributions'
import { findingsForSubject, findings } from '../findings/ledger'
import { reviewsForFinding } from '../reviews/records'
import { needsRewriteById, semanticCorrections } from '../../../data/semanticAudit'
import { isApprovedDisposition } from '../predicates'

function contributionsForWave(waveId: string) {
  const wave = questionWaves().find((w) => w.waveId === waveId)!
  const pool =
    wave.corpus === 'main'
      ? responseContributions
      : statementContributions
  return pool.filter((r) => wave.subjectIds.includes(r.questionId))
}

describe('waveCoverage', () => {
  it('every question wave has 100% contribution coverage for its subjects', () => {
    for (const wave of questionWaves()) {
      const rows = contributionsForWave(wave.waveId)
      const coveredQuestions = new Set(rows.map((r) => r.questionId))
      expect(coveredQuestions.size, wave.waveId).toBe(wave.subjectIds.length)
      for (const row of rows) {
        expect(row.constructRationale.length).toBeGreaterThan(0)
      }
    }
  })

  it('every semantic correction and rewrite has a finding with dual provisional reviews', () => {
    const subjectIds = [
      ...Object.keys(semanticCorrections),
      ...Object.keys(needsRewriteById),
    ]
    for (const subjectId of subjectIds) {
      const subjectFindings = findingsForSubject(subjectId)
      expect(subjectFindings.length, subjectId).toBeGreaterThan(0)
      for (const finding of subjectFindings) {
        expect(isApprovedDisposition(finding)).toBe(true)
        const reviews = reviewsForFinding(finding.findingId)
        expect(reviews.some((r) => r.role === 'domain')).toBe(true)
        expect(reviews.some((r) => r.role === 'measurement')).toBe(true)
        expect(
          reviews.every((r) => r.qualificationStatus === 'provisional-agent'),
        ).toBe(true)
      }
    }
  })

  it('seeded findings ledger is non-empty and id-unique', () => {
    expect(findings.length).toBeGreaterThan(100)
    const ids = findings.map((f) => f.findingId)
    expect(new Set(ids).size).toBe(ids.length)
  })
})
