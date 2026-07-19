import { describe, it, expect } from 'vitest'
import { questions } from '../../data/effectiveQuestions'
import { needsRewriteById } from '../../data/semanticAudit'
import { responseContributions } from './manifests/responseContributions'
import { isUnresolvedActive } from './predicates'
import { findings } from './findings/ledger'

describe('activePool.clean', () => {
  it('effective-active scoring pool contains no needs-rewrite subjects', () => {
    for (const question of questions) {
      expect(
        needsRewriteById[question.id],
        `${question.id} is active but marked needs-rewrite`,
      ).toBeUndefined()
      expect(question.active).not.toBe(false)
      expect(question.reviewStatus).not.toBe('needs-rewrite')
    }
  })

  it('effective-active contributions never carry deactivate disposition', () => {
    for (const row of responseContributions) {
      expect(row.disposition).not.toBe('deactivate')
    }
  })

  it('no unresolved-active findings remain for applied semantic-audit subjects', () => {
    const unresolved = findings.filter((f) => isUnresolvedActive(f))
    expect(unresolved).toEqual([])
  })
})
