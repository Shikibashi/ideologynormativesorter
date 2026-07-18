import { describe, expect, it } from 'vitest'
import type { AnswerMap, Axis, Question } from '../types'
import { analyzePsychometricStudy, cronbachAlpha, pearsonCorrelation, type ValidationResponse } from './psychometrics'

const axis: Axis = {
  id: 'test-axis',
  layer: 'normative',
  name: 'Test Axis',
  negativePole: 'Negative',
  positivePole: 'Positive',
  description: 'Test axis',
}

const items: Question[] = Array.from({ length: 4 }, (_, index) => ({
  id: `test-q${index + 1}`,
  prompt: `Test item ${index + 1}`,
  domain: 'test-domain',
  layer: 'normative',
  theoryContext: 'mixed',
  responseType: 'likert7',
  tier: 'extensive',
  axisWeights: [{ axisId: axis.id, weight: index === 3 ? -1 : 1 }],
  reverseScored: index === 3,
}))

function answersFor(value: number): AnswerMap {
  return Object.fromEntries(items.map((item) => [item.id, { questionId: item.id, value }]))
}

describe('psychometric primitives', () => {
  it('computes perfect alpha for identical varying items', () => {
    const matrix = [
      [-1, -1, -1],
      [-0.5, -0.5, -0.5],
      [0, 0, 0],
      [0.5, 0.5, 0.5],
      [1, 1, 1],
    ]
    expect(cronbachAlpha(matrix)).toBeCloseTo(1)
  })

  it('returns a perfect Pearson correlation for a linear relationship', () => {
    expect(pearsonCorrelation([1, 2, 3, 4], [2, 4, 6, 8])).toBeCloseTo(1)
  })
})

describe('analyzePsychometricStudy', () => {
  it('reports not-collected instead of fabricating estimates', () => {
    const report = analyzePsychometricStudy([], items, [axis], [], { minimumCompleteCases: 10 })
    expect(report.status).toBe('not-collected')
    expect(report.axisReports[0].cronbachAlpha.status).toBe('insufficient-data')
    expect(report.selfLabelConcordance.status).toBe('insufficient-data')
  })

  it('estimates internal consistency and test-retest stability from respondent records', () => {
    const records: ValidationResponse[] = []
    for (let index = 0; index < 60; index += 1) {
      const value = (index % 7) - 3
      records.push({ respondentId: `r${index}`, administration: 'test', answers: answersFor(value) })
      if (index < 30) {
        records.push({ respondentId: `r${index}`, administration: 'retest', answers: answersFor(value) })
      }
    }

    const report = analyzePsychometricStudy(records, items, [axis], [], {
      minimumCompleteCases: 50,
      minimumRetestPairs: 20,
      pilotRespondents: 50,
    })
    const axisReport = report.axisReports[0]

    expect(report.status).toBe('estimable')
    expect(axisReport.cronbachAlpha.status).toBe('estimated')
    expect(axisReport.cronbachAlpha.value).toBeCloseTo(1)
    expect(axisReport.splitHalfReliability.status).toBe('estimated')
    expect(axisReport.testRetestCorrelation.status).toBe('estimated')
    expect(axisReport.testRetestCorrelation.value).toBeCloseTo(1)
  })

  it('excludes needs-rewrite and statement-choice items from consistency estimates', () => {
    const excluded: Question[] = [
      { ...items[0], id: 'rewrite', reviewStatus: 'needs-rewrite' },
      {
        ...items[0],
        id: 'choice',
        responseType: 'statementChoice',
        axisWeights: [],
        statementOptions: [
          { id: 'a', text: 'A', axisWeights: [{ axisId: axis.id, weight: 1 }] },
          { id: 'b', text: 'B', axisWeights: [{ axisId: axis.id, weight: -1 }] },
          { id: 'c', text: 'C', axisWeights: [{ axisId: axis.id, weight: 0.2 }] },
        ],
      },
    ]
    const report = analyzePsychometricStudy([], [...items, ...excluded], [axis], [])
    expect(report.axisReports[0].eligibleItemCount).toBe(4)
    expect(report.excludedQuestionIds).toContain('rewrite')
    expect(report.excludedQuestionIds).toContain('choice')
  })
})
