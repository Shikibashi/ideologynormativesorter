import type { AnswerMap, Domain, DomainMiniResult, Question } from '../types'

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
        const unit = (a.value as number) / (q.responseType === 'likert7' ? 3 : 2)
        sum += unit * (q.axisWeights[0]?.weight || 1)
        count++
      }
      return { mean: count > 0 ? sum / count : 0, itemCount: count }
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