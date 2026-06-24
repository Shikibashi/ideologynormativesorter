import { axes } from './axes'
import { domains } from './domains'
import { labels } from './labels'
import { questions } from './questions'

export interface AuditReport {
  totals: {
    totalQuestions: number
    activeQuestions: number
    axes: number
    domains: number
    labels: number
  }
  coverage: {
    domains: number
    layers: Record<string, number>
    axes: number
  }
  problems: string[]
}

export function auditCorpus(): AuditReport {
  const totals = {
    totalQuestions: questions.length,
    activeQuestions: questions.filter(q => q.active !== false).length,
    axes: axes.length,
    domains: domains.length,
    labels: labels.length
  }

  const problems: string[] = []

  // basic coverage checks
  const domainSet = new Set(questions.map(q => q.domain))
  if (domainSet.size !== domains.length) problems.push('domain coverage mismatch')

  const layerCounts: Record<string, number> = { normative: 0, descriptive: 0, prescriptive: 0 }
  for (const q of questions) layerCounts[q.layer] = (layerCounts[q.layer] || 0) + 1
  if (layerCounts.normative === 0 || layerCounts.descriptive === 0 || layerCounts.prescriptive === 0) {
    problems.push('missing layer coverage')
  }

  // descriptive dont_know
  for (const q of questions) {
    if (q.layer === 'descriptive' && q.allowDontKnow && !q.confidencePrompt) {
      problems.push(`descriptive missing confidencePrompt: ${q.id}`)
    }
  }

  // duplicate ids
  const ids = new Set<string>()
  for (const q of questions) {
    if (ids.has(q.id)) problems.push(`duplicate id: ${q.id}`)
    ids.add(q.id)
  }

  return {
    totals,
    coverage: {
      domains: domains.length,
      layers: layerCounts,
      axes: axes.length
    },
    problems
  }
}