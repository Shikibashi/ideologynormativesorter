import type { AnswerMap, DomainId, IdealNonIdealGap, Question } from '../types'
import { normalizeAnswer } from './normalize'

/**
 * For each domain that has at least one answered ideal-context item and at
 * least one answered nonideal-context item, computes the mean normalized
 * response in each context and the gap between them. Domains without both
 * contexts answered are omitted rather than reported as a zero gap.
 */
export function computeIdealNonIdealGaps(questions: Question[], answers: AnswerMap): IdealNonIdealGap[] {
  const byDomain = new Map<DomainId, { ideal: number[]; nonIdeal: number[] }>()

  for (const question of questions) {
    if (question.theoryContext !== 'ideal' && question.theoryContext !== 'nonideal') continue

    const answer = answers[question.id]
    if (!answer) continue

    const unit = normalizeAnswer(question, answer)
    if (unit === null) continue

    if (!byDomain.has(question.domain)) {
      byDomain.set(question.domain, { ideal: [], nonIdeal: [] })
    }
    const bucket = byDomain.get(question.domain)!
    if (question.theoryContext === 'ideal') bucket.ideal.push(unit)
    else bucket.nonIdeal.push(unit)
  }

  const gaps: IdealNonIdealGap[] = []
  for (const [domain, bucket] of byDomain) {
    if (bucket.ideal.length === 0 || bucket.nonIdeal.length === 0) continue

    const ideal = average(bucket.ideal)
    const nonIdeal = average(bucket.nonIdeal)
    gaps.push({
      domain,
      ideal,
      nonIdeal,
      gap: ideal - nonIdeal,
      idealItemCount: bucket.ideal.length,
      nonIdealItemCount: bucket.nonIdeal.length,
    })
  }

  return gaps
}

function average(values: number[]): number {
  return values.reduce((sum, v) => sum + v, 0) / values.length
}
