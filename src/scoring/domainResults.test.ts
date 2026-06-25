import { describe, expect, it } from 'vitest'
import type { Domain, Question } from '../types'
import { computeDomainMiniResults } from './domainResults'

const domain: Domain = { id: 'test-domain', name: 'Test Domain', description: 'd' }

function baseQuestion(partial: Partial<Question>): Question {
  return {
    id: partial.id ?? 'q',
    prompt: partial.prompt ?? 'p',
    domain: 'test-domain',
    layer: partial.layer ?? 'normative',
    theoryContext: partial.theoryContext ?? 'mixed',
    responseType: partial.responseType ?? 'likert7',
    tier: partial.tier ?? 'extensive',
    axisWeights: partial.axisWeights ?? [{ axisId: 'norm-axis', weight: 1 }],
    reverseScored: partial.reverseScored,
    statementOptions: partial.statementOptions,
  }
}


describe('computeDomainMiniResults', () => {
  it('uses reverse-scored Likert semantics', () => {
    const question = baseQuestion({ id: 'reverse', reverseScored: true })
    const result = computeDomainMiniResults([question], { reverse: { questionId: 'reverse', value: 3 } }, [domain])[0]

    expect(result.normative.mean).toBeCloseTo(-1)
    expect(result.normative.itemCount).toBe(1)
  })

  it('uses selected statement option weights instead of treating the option index as a score', () => {
    const question = baseQuestion({
      id: 'statement',
      responseType: 'statementChoice',
      axisWeights: [],
      statementOptions: [
        { id: 'a', text: 'a', axisWeights: [{ axisId: 'norm-axis', weight: 0.2 }] },
        { id: 'b', text: 'b', axisWeights: [{ axisId: 'norm-axis', weight: 0.4 }] },
        { id: 'c', text: 'c', axisWeights: [{ axisId: 'norm-axis', weight: 0.6 }] },
        { id: 'd', text: 'd', axisWeights: [{ axisId: 'norm-axis', weight: -0.75 }] },
      ],
    })
    const result = computeDomainMiniResults([question], { statement: { questionId: 'statement', value: 3 } }, [domain])[0]

    expect(result.normative.mean).toBeCloseTo(-0.75)
    expect(result.normative.itemCount).toBe(1)
  })

  it('averages all applicable axis contributions for a multi-axis question', () => {
    const question = baseQuestion({
      id: 'multi',
      axisWeights: [
        { axisId: 'norm-a', weight: 1 },
        { axisId: 'norm-b', weight: -0.5 },
      ],
    })
    const result = computeDomainMiniResults([question], { multi: { questionId: 'multi', value: 3 } }, [domain])[0]

    expect(result.normative.mean).toBeCloseTo(0.25)
    expect(result.normative.itemCount).toBe(1)
  })

  it('excludes dont_know answers', () => {
    const question = baseQuestion({ id: 'unknown' })
    const result = computeDomainMiniResults([question], { unknown: { questionId: 'unknown', value: 'dont_know' } }, [domain])[0]

    expect(result.normative.mean).toBe(0)
    expect(result.normative.itemCount).toBe(0)
  })
})
