import { describe, it, expect } from 'vitest'
import type { Answer, Question } from '../../../types'
import { normalizeAnswer, salienceFactor } from '../../../scoring/normalize'
import * as AggregateModule from '../../../scoring/aggregate'
import { buildContributionRecords } from './build'
import { expandSelectableResponses } from './expand'

const baseQuestion: Question = {
  id: 'audit-inv-q1',
  prompt: 'Invariant probe',
  domain: 'state-legitimacy',
  layer: 'normative',
  theoryContext: 'ideal',
  responseType: 'likert7',
  tier: 'extensive',
  axisWeights: [
    { axisId: 'authority-legitimacy', weight: 0.5 },
    { axisId: 'anti-domination', weight: -0.5 },
  ],
}

describe('contribution.invariants', () => {
  it('expandSelectableResponses covers likert7 values and optional dont_know', () => {
    const withoutDk = expandSelectableResponses(baseQuestion)
    expect(withoutDk.map((r) => r.responseKey)).toEqual([
      'likert:-3',
      'likert:-2',
      'likert:-1',
      'likert:0',
      'likert:1',
      'likert:2',
      'likert:3',
    ])

    const withDk = expandSelectableResponses({ ...baseQuestion, allowDontKnow: true })
    expect(withDk.some((r) => r.responseKey === 'dont_know')).toBe(true)
  })

  it('dont_know yields null contribution and exclusionReason', () => {
    const rows = buildContributionRecords(
      [{ ...baseQuestion, allowDontKnow: true }],
      { corpus: 'main', inventorySet: 'raw' },
    )
    const dk = rows.filter((r) => r.responseKey === 'dont_know')
    expect(dk.length).toBe(2)
    for (const row of dk) {
      expect(row.normalizedUnit).toBeNull()
      expect(row.effectiveSignedContribution).toBeNull()
      expect(row.exclusionReason).toBe('dont_know')
    }
  })

  it('reverseScored flips normalized unit', () => {
    const plain = buildContributionRecords([baseQuestion], {
      corpus: 'main',
      inventorySet: 'raw',
    })
    const reversed = buildContributionRecords(
      [{ ...baseQuestion, reverseScored: true }],
      { corpus: 'main', inventorySet: 'raw' },
    )
    const plainPos = plain.find(
      (r) => r.responseKey === 'likert:3' && r.axisId === 'authority-legitimacy',
    )!
    const revPos = reversed.find(
      (r) => r.responseKey === 'likert:3' && r.axisId === 'authority-legitimacy',
    )!
    expect(plainPos.normalizedUnit).toBe(1)
    expect(revPos.normalizedUnit).toBe(-1)
    expect(revPos.effectiveSignedContribution).toBe(
      -(plainPos.effectiveSignedContribution ?? 0),
    )
  })

  it('salience scales descriptive confidence and prescriptive priority', () => {
    const descriptive: Question = {
      ...baseQuestion,
      id: 'audit-inv-desc',
      layer: 'descriptive',
      axisWeights: [{ axisId: 'market-process-confidence', weight: 1 }],
    }
    expect(salienceFactor(descriptive, { questionId: descriptive.id, value: 3, confidence: 1 })).toBe(0.2)
    expect(salienceFactor(descriptive, { questionId: descriptive.id, value: 3, confidence: 5 })).toBe(1)

    const prescriptive: Question = {
      ...baseQuestion,
      id: 'audit-inv-pres',
      layer: 'prescriptive',
      axisWeights: [{ axisId: 'redistribution', weight: 1 }],
    }
    expect(salienceFactor(prescriptive, { questionId: prescriptive.id, value: 3, priority: 1 })).toBe(0.2)
    expect(salienceFactor(prescriptive, { questionId: prescriptive.id, value: 3, priority: 5 })).toBe(1)
  })

  it('manifest signed contribution matches normalize × weight × salience', () => {
    const rows = buildContributionRecords([baseQuestion], {
      corpus: 'main',
      inventorySet: 'raw',
    })
    for (const row of rows) {
      if (row.exclusionReason) {
        expect(row.effectiveSignedContribution).toBeNull()
        continue
      }
      const answer: Answer = { questionId: baseQuestion.id, value: row.responseValue as number }
      const unit = normalizeAnswer(baseQuestion, answer)
      const salience = salienceFactor(baseQuestion, answer)
      expect(row.normalizedUnit).toBe(unit)
      expect(row.salience).toBe(salience)
      expect(row.effectiveSignedContribution).toBe(
        (unit ?? 0) * row.configuredWeight * salience,
      )
    }
  })

  it('statementChoice expands one row-set per option with unit=1', () => {
    const statementQ: Question = {
      ...baseQuestion,
      id: 'stmt-inv-1',
      responseType: 'statementChoice',
      axisWeights: [],
      statementOptions: [
        {
          id: 'a',
          text: 'A',
          axisWeights: [{ axisId: 'authority-legitimacy', weight: 0.8 }],
        },
        {
          id: 'b',
          text: 'B',
          axisWeights: [{ axisId: 'anti-domination', weight: 0.6 }],
        },
      ],
    }
    const rows = buildContributionRecords([statementQ], {
      corpus: 'statement',
      inventorySet: 'raw',
    })
    expect(rows).toHaveLength(2)
    expect(rows[0].responseKey).toBe('option:0|a')
    expect(rows[0].normalizedUnit).toBe(1)
    expect(rows[0].effectiveSignedContribution).toBe(0.8)
    expect(rows[1].responseKey).toBe('option:1|b')
    expect(rows[1].effectiveSignedContribution).toBe(0.6)
  })

  it('scoring aggregate remains affinity-free and exports axis scoring', () => {
    const answer: Answer = { questionId: baseQuestion.id, value: 3 }
    const unit = normalizeAnswer(baseQuestion, answer)!
    const expected = unit * 0.5 * salienceFactor(baseQuestion, answer)
    expect(expected).toBe(0.5)
    expect(typeof AggregateModule.computeAxisScores).toBe('function')
    expect(
      Object.keys(AggregateModule).some((k) => k.toLowerCase().includes('affinity')),
    ).toBe(false)
  })
})
