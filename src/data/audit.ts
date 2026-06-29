import type { Axis, AxisWeight, Domain, IdeologyLabel, Question } from '../types'
import { axes } from './axes'
import { domains } from './domains'
import { labels } from './labels'
import { moduleQuestions } from './moduleQuestions'
import { questions, questionsForTier } from './questions'
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

interface AuditInput {
  questions: Question[]
  moduleQuestions: Question[]
  axes: Axis[]
  domains: Domain[]
  labels: IdeologyLabel[]
  tierQuestions: Question[]
  hasModuleRegistry: boolean
}

function isFiniteUnit(value: number): boolean {
  return Number.isFinite(value) && value >= -1 && value <= 1
}

function auditAxisWeights(
  source: string,
  layer: Question['layer'],
  weights: AxisWeight[],
  axisById: Map<string, Axis>,
  referencedAxes: Set<string>,
  problems: string[],
): void {
  const seen = new Set<string>()
  for (const weight of weights) {
    if (seen.has(weight.axisId)) problems.push(`duplicate axis reference: ${source} -> ${weight.axisId}`)
    seen.add(weight.axisId)

    if (!isFiniteUnit(weight.weight)) problems.push(`invalid axis weight: ${source} -> ${weight.axisId}`)
    const axis = axisById.get(weight.axisId)
    if (!axis) {
      problems.push(`unknown axis: ${source} -> ${weight.axisId}`)
      referencedAxes.add(weight.axisId)
      continue
    }
    referencedAxes.add(weight.axisId)
    if (axis.layer !== layer) problems.push(`cross-layer axis: ${source} (${layer}) -> ${weight.axisId} (${axis.layer})`)
  }
}

export function auditCorpus(input?: Partial<AuditInput>): AuditReport {
  const auditInput: AuditInput = {
    questions,
    moduleQuestions,
    axes,
    domains,
    labels,
    tierQuestions: ['blitz', 'quick', 'moderate', 'extensive'].flatMap((tier) => questionsForTier(tier as Question['tier'])),
    hasModuleRegistry: false,
    ...input,
  }
  const activeQuestions = auditInput.questions.filter(q => q.active !== false)
  const totals = {
    totalQuestions: auditInput.questions.length,
    activeQuestions: activeQuestions.length,
    axes: auditInput.axes.length,
    domains: auditInput.domains.length,
    labels: auditInput.labels.length
  }

  const problems: string[] = []
  const knownDomainIds = new Set(auditInput.domains.map((domain) => domain.id))
  const axisById = new Map(auditInput.axes.map((axis) => [axis.id, axis]))
  const referencedDomains = new Set<string>()
  const referencedAxes = new Set<string>()

  const ids = new Set<string>()
  const layerCounts: Record<string, number> = { normative: 0, descriptive: 0, prescriptive: 0 }
  for (const q of activeQuestions) {
    if (ids.has(q.id)) problems.push(`duplicate question id: ${q.id}`)
    ids.add(q.id)
    layerCounts[q.layer] = (layerCounts[q.layer] || 0) + 1

    referencedDomains.add(q.domain)
    if (!knownDomainIds.has(q.domain)) problems.push(`unknown domain: ${q.id} -> ${q.domain}`)

    if (q.layer === 'descriptive' && q.allowDontKnow && !q.confidencePrompt) problems.push(`descriptive missing confidencePrompt: ${q.id}`)
    if (q.layer === 'prescriptive' && !q.priorityPrompt) problems.push(`prescriptive missing priorityPrompt: ${q.id}`)

    auditAxisWeights(q.id, q.layer, q.axisWeights, axisById, referencedAxes, problems)

    if (q.responseType === 'statementChoice') {
      if (!q.statementOptions || q.statementOptions.length === 0) problems.push(`statement options missing: ${q.id}`)
      const optionIds = new Set<string>()
      for (const option of q.statementOptions ?? []) {
        if (option.id.trim().length === 0) problems.push(`statement option empty id: ${q.id}`)
        if (option.text.trim().length === 0) problems.push(`statement option empty text: ${q.id}/${option.id}`)
        if (optionIds.has(option.id)) problems.push(`duplicate statement option id: ${q.id}/${option.id}`)
        optionIds.add(option.id)
        auditAxisWeights(`${q.id}/${option.id}`, q.layer, option.axisWeights, axisById, referencedAxes, problems)
      }
    }
  }
  if (layerCounts.normative === 0 || layerCounts.descriptive === 0 || layerCounts.prescriptive === 0) problems.push('missing layer coverage')

  const axisIds = new Set(auditInput.axes.map((axis) => axis.id))
  for (const label of auditInput.labels) {
    for (const axisId of Object.keys(label.centroid)) {
      if (!axisIds.has(axisId)) problems.push(`unknown label centroid axis: ${label.id} -> ${axisId}`)
      const value = label.centroid[axisId]
      if (!Number.isFinite(value) || value < -1 || value > 1) problems.push(`invalid label centroid value: ${label.id} -> ${axisId}`)
    }
    for (const axis of auditInput.axes) {
      if (label.centroid[axis.id] === undefined) problems.push(`label centroid missing axis: ${label.id} -> ${axis.id}`)
    }
  }

  const tierQuestionIds = new Set(auditInput.tierQuestions.map((q) => q.id))
  for (const q of auditInput.moduleQuestions) {
    if (!q.module || q.module.trim().length === 0) problems.push(`module question missing module: ${q.id}`)
    if (tierQuestionIds.has(q.id)) problems.push(`module question in tier pool: ${q.id}`)
  }
  if (auditInput.moduleQuestions.length > 0 && !auditInput.hasModuleRegistry) {
    problems.push('module registry missing for module question validation')
  }

  return {
    totals,
    coverage: {
      domains: referencedDomains.size,
      layers: layerCounts,
      axes: referencedAxes.size
    },
    problems
  }
}