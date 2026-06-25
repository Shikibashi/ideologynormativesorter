import type { Answer, AnswerMap, AxisId, Domain, DomainMiniResult, Question } from '../types'
import { contributionForQuestionAxis } from './aggregate'

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}

function axisIdsForAnswer(question: Question, answer: Answer): AxisId[] {
  const weights =
    question.responseType === 'statementChoice' && typeof answer.value === 'number'
      ? question.statementOptions?.[answer.value]?.axisWeights
      : question.axisWeights
  return Array.from(new Set((weights ?? []).map((weight) => weight.axisId)))
}
export function computeDomainMiniResults(questions: Question[], answers: AnswerMap, domains: Domain[]): DomainMiniResult[] {
  const results: DomainMiniResult[] = []

  for (const domain of domains) {
    const domainQs = questions.filter(q => q.domain === domain.id)
    if (domainQs.length === 0) continue

    const byLayer: Record<string, Question[]> = { normative: [], descriptive: [], prescriptive: [] }
    for (const q of domainQs) {
      byLayer[q.layer].push(q)
    }

    const getMean = (qs: Question[]) => {
      if (qs.length === 0) return { mean: 0, itemCount: 0 }
      let sum = 0
      let count = 0
      for (const q of qs) {
        const a = answers[q.id]
        if (!a || a.value === 'dont_know') continue

        const contributions = axisIdsForAnswer(q, a)
          .map((axisId) => contributionForQuestionAxis(q, a, axisId))
          .filter((value): value is number => value !== null)
        if (contributions.length === 0) continue

        sum += contributions.reduce((total, value) => total + value, 0) / contributions.length
        count++
      }
      return { mean: count > 0 ? clamp(sum / count, -1, 1) : 0, itemCount: count }
    }

    const norm = getMean(byLayer.normative)
    const desc = getMean(byLayer.descriptive)
    const pres = getMean(byLayer.prescriptive)

    results.push({
      domain: domain.id,
      normative: norm,
      descriptive: desc,
      prescriptive: pres
    })
  }

  return results
}