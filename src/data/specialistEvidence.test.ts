import { describe, expect, it } from 'vitest'
import { scoreFeministSpecialists } from './feministBreadth'
import { scoreIdentitySovereigntyTraditions } from './identitySovereigntyBreadth'
import { summarizeSpecialistEvidence } from './specialistEvidence'

describe('specialist evidence accounting', () => {
  it('does not turn an unanswered module into zero-valued evidence', () => {
    const feministMatches = scoreFeministSpecialists({})
    const identityMatches = scoreIdentitySovereigntyTraditions({})

    expect(feministMatches.every((match) => match.evidence.insufficientEvidence && match.fit === 0)).toBe(true)
    expect(identityMatches.every((match) => match.evidence.insufficientEvidence && match.fit === 0)).toBe(true)
  })

  it('reports weighted coverage and effective answered item count', () => {
    const summary = summarizeSpecialistEvidence(
      [
        { question: { id: 'one' }, constructWeights: { a: 1 } },
        { question: { id: 'two' }, constructWeights: { a: 2 } },
      ],
      { one: 3 },
      ['a'],
    )

    expect(summary.answeredItemCount).toBe(1)
    expect(summary.answeredCoverage).toBe(0.5)
    expect(summary.weightedAnsweredCoverage).toBeCloseTo(1 / 3)
    expect(summary.effectiveItemCount).toBeCloseTo(2 / 3)
    expect(summary.status).toBe('insufficient-evidence')
    expect(summary.constructs.a.sufficient).toBe(false)
  })

  it('allows a sufficiently measured narrow profile without requiring every module construct', () => {
    const matches = scoreIdentitySovereigntyTraditions({ 'fm-id-17': 3, 'fm-id-18': 3 })
    const panAfrican = matches.find((match) => match.id === 'pan-africanism')

    expect(panAfrican?.evidence.insufficientEvidence).toBe(false)
    expect(panAfrican?.fit).toBeGreaterThan(0.9)
  })
})
