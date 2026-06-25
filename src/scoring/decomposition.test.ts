import { describe, expect, it } from 'vitest'
import { axes } from '../data/axes'
import { domains } from '../data/domains'
import { questions } from '../data/questions'
import { labels } from '../data/labels'
import { detectDivergencesAndContradictions } from './divergence'
import { computeDomainMiniResults } from './domainResults'
import { computeReasonBreakdowns } from './reasonDecomposition'
import { buildResultProfile } from './index'
import type { Axis, Question } from '../types'

const ALL = questions

describe('decomposition modules', () => {
  it('detectDivergencesAndContradictions returns reports for synthetic', () => {
    const answers = Object.fromEntries(questions.slice(0, 10).map(q => [q.id, { questionId: q.id, value: 3 }]))
    const res = buildResultProfile(ALL, answers, axes, labels)
    const reports = detectDivergencesAndContradictions(res.scores, res.gaps)
    expect(Array.isArray(reports)).toBe(true)
  })

  it('detectDivergencesAndContradictions detects layer divergence', () => {
    const normativeLibertyQ = questions.find(q => q.layer === 'normative' && q.axisWeights.some(w => w.axisId === 'liberty-noninterference'))!
    const prescriptiveRegQ = questions.find(q => q.layer === 'prescriptive' && q.axisWeights.some(w => w.axisId === 'regulation-vs-deregulation'))!

    const answers = {
      [normativeLibertyQ.id]: { questionId: normativeLibertyQ.id, value: 3 },
      [prescriptiveRegQ.id]: { questionId: prescriptiveRegQ.id, value: 3 }
    }

    const res = buildResultProfile(ALL, answers, axes, labels)
    const reports = detectDivergencesAndContradictions(res.scores, res.gaps)
    const div = reports.find(r => r.type === 'layer_divergence')
    expect(div).toBeDefined()
    expect(div?.description).toContain('Layer divergence')
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

  it('computeReasonBreakdowns skips prescriptive dont_know answers', () => {
    const question: Question = {
      id: 'p-dont-know',
      prompt: 'p',
      domain: 'strategy-change',
      layer: 'prescriptive',
      theoryContext: 'mixed',
      responseType: 'likert7',
      tier: 'extensive',
      axisWeights: [{ axisId: 'pres-a', weight: 1 }],
    }
    const axis: Axis = { id: 'pres-a', layer: 'prescriptive', name: 'P', positivePole: 'p', negativePole: 'n', description: 'd' }

    expect(computeReasonBreakdowns([question], { [question.id]: { questionId: question.id, value: 'dont_know' } }, [axis])).toEqual([])
  })

  it('computeReasonBreakdowns skips neutral prescriptive answers', () => {
    const question: Question = {
      id: 'p-neutral',
      prompt: 'p',
      domain: 'strategy-change',
      layer: 'prescriptive',
      theoryContext: 'mixed',
      responseType: 'likert7',
      tier: 'extensive',
      axisWeights: [{ axisId: 'pres-a', weight: 1 }],
    }
    const axis: Axis = { id: 'pres-a', layer: 'prescriptive', name: 'P', positivePole: 'p', negativePole: 'n', description: 'd' }

    expect(computeReasonBreakdowns([question], { [question.id]: { questionId: question.id, value: 0 } }, [axis])).toEqual([])
  })

  it('computeReasonBreakdowns chooses the largest absolute prescriptive contribution', () => {
    const question: Question = {
      id: 'p-multi',
      prompt: 'p',
      domain: 'strategy-change',
      layer: 'prescriptive',
      theoryContext: 'mixed',
      responseType: 'likert7',
      tier: 'extensive',
      axisWeights: [
        { axisId: 'pres-small', weight: 0.25 },
        { axisId: 'pres-large', weight: -0.75 },
      ],
    }
    const syntheticAxes: Axis[] = [
      { id: 'pres-small', layer: 'prescriptive', name: 'Small', positivePole: 'p', negativePole: 'n', description: 'd' },
      { id: 'pres-large', layer: 'prescriptive', name: 'Large', positivePole: 'p', negativePole: 'n', description: 'd' },
    ]

    const [breakdown] = computeReasonBreakdowns([question], { [question.id]: { questionId: question.id, value: 3 } }, syntheticAxes)

    expect(breakdown.policyPosition).toBe('policy-p-multi')
    expect(breakdown.dominantLayer).toBe('prescriptive')
    expect(breakdown.dominantAxes).toEqual(['pres-large'])
  })
})