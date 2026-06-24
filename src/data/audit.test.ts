import { describe, expect, it } from 'vitest'
import { auditCorpus } from './audit'

describe('auditCorpus', () => {
  it('real corpus has zero problems', () => {
    const report = auditCorpus()
    expect(report.problems).toEqual([])
    expect(report.totals.totalQuestions).toBeGreaterThan(30)
  })

})