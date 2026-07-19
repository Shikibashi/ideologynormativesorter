import {
  semanticCorrections,
  needsRewriteById,
} from '../../../data/semanticAudit'
import { axes } from '../../../data/axes'
import type { Question } from '../../../types'
import type { Disposition, IssueClass } from '../types'

export interface QuestionAuditAnnotation {
  questionId: string
  constructRationale: string
  disposition: Disposition
  issueClass?: IssueClass
  source: 'semantic-correction' | 'needs-rewrite' | 'axis-derived' | 'manual'
}

function axisNames(question: Question): string {
  const names = question.axisWeights.map((w) => {
    const axis = axes.find((a) => a.id === w.axisId)
    const pole = w.weight >= 0 ? 'positive' : 'negative'
    return `${axis?.name ?? w.axisId} (${pole}, |w|=${Math.abs(w.weight)})`
  })
  return names.join('; ')
}

/**
 * Derive a provisional construct rationale when no semantic-audit entry exists.
 * These remain provisional-agent quality until dual review upgrades them.
 */
export function deriveConstructRationale(question: Question): string {
  const weights = axisNames(question)
  if (question.responseType === 'statementChoice') {
    const optionSummary = (question.statementOptions ?? [])
      .map((opt, i) => {
        const aw = opt.axisWeights
          .map((w) => `${w.axisId}:${w.weight}`)
          .join(',')
        return `option[${i}|${opt.id}]→{${aw}}`
      })
      .join('; ')
    return `Statement-choice item maps discrete options to axis poles. ${optionSummary}`
  }
  return `Agreement on this ${question.layer}/${question.theoryContext} prompt contributes to: ${weights || 'no configured axis weights'}.`
}

export function annotationForQuestion(question: Question): QuestionAuditAnnotation {
  const correction = semanticCorrections[question.id]
  if (correction) {
    return {
      questionId: question.id,
      constructRationale: correction.rationale,
      disposition: 'no-change',
      issueClass: correction.issue as IssueClass,
      source: 'semantic-correction',
    }
  }

  const rewrite = needsRewriteById[question.id]
  if (rewrite) {
    return {
      questionId: question.id,
      constructRationale: rewrite.rationale,
      disposition: 'deactivate',
      issueClass: rewrite.issue as IssueClass,
      source: 'needs-rewrite',
    }
  }

  return {
    questionId: question.id,
    constructRationale: deriveConstructRationale(question),
    disposition: 'no-change',
    source: 'axis-derived',
  }
}

export function buildAnnotationMap(
  questions: Question[],
): Record<string, QuestionAuditAnnotation> {
  const map: Record<string, QuestionAuditAnnotation> = {}
  for (const question of questions) {
    map[question.id] = annotationForQuestion(question)
  }
  return map
}
