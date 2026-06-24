import { describe, expect, it } from 'vitest'
import { axes } from '../data/axes'
import { domains } from '../data/domains'
import { questions } from '../data/questions'
import { labels } from '../data/labels'
import { detectDivergencesAndContradictions } from './divergence'
import { computeDomainMiniResults } from './domainResults'
import { computeReasonBreakdowns } from './reasonDecomposition'
import { buildResultProfile } from './index'

const ALL = questions

describe('decomposition modules', () => {
  it('detectDivergencesAndContradictions returns reports for synthetic', () => {
    const answers = Object.fromEntries(questions.slice(0, 10).map(q => [q.id, { questionId: q.id, value: 3 }]))
    const res = buildResultProfile(ALL, answers, axes, labels)
    const reports = detectDivergencesAndContradictions(res.scores, res.gaps)
    expect(Array.isArray(reports)).toBe(true)
  })

  it('computeDomainMiniResults produces results', () => {
    const answers = Object.fromEntries(questions.slice(0, 5).map(q => [q.id, { questionId: q.id, value: 0 }]))
    const res = computeDomainMiniResults(questions, answers, domains)
    expect(res.length).toBeGreaterThan(0)
  })

  it('computeReasonBreakdowns produces breakdowns', () => {
    const presQs = questions.filter(q => q.layer === 'prescriptive').slice(0, 3)
    const answers = Object.fromEntries(presQs.map(q => [q.id, { questionId: q.id, value: 3 }]))
    const res = computeReasonBreakdowns(questions, answers, axes)
    expect(Array.isArray(res)).toBe(true)
  })
})