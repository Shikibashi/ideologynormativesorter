import { RESULT_SCORING_VERSION } from '../../../scoring/index'
import { QUESTION_BANK_VERSION } from '../../../data/effectiveQuestions'
import type { AuditFinding, ReviewRecord } from '../types'

/**
 * Stamp provisional-agent dual reviews onto applied/approved findings.
 * These cannot satisfy isExpertGateSatisfied / qualified-expert release.
 */
export function seedProvisionalReviews(findings: AuditFinding[]): {
  reviews: ReviewRecord[]
  findings: AuditFinding[]
} {
  const reviews: ReviewRecord[] = []
  const stamped: AuditFinding[] = []
  const now = '2026-07-19T00:00:00.000Z'

  for (const finding of findings) {
    if (
      finding.lifecycle !== 'applied' &&
      finding.lifecycle !== 'approved'
    ) {
      stamped.push(finding)
      continue
    }

    const domainId = `review:${finding.findingId}:domain:1`
    const measurementId = `review:${finding.findingId}:measurement:1`

    reviews.push({
      reviewId: domainId,
      findingId: finding.findingId,
      role: 'domain',
      qualificationStatus: 'provisional-agent',
      reviewerKey: 'agent:domain-provisional',
      decision: finding.proposedDisposition,
      rationale: `Provisional domain acceptance of seeded disposition (${finding.issueClass}).`,
      evidenceCiteIds: finding.evidenceCiteIds,
      timestamp: now,
      bankVersion: QUESTION_BANK_VERSION,
      scoringVersion: RESULT_SCORING_VERSION,
      linkedTestIds: finding.linkedTestIds,
    })

    reviews.push({
      reviewId: measurementId,
      findingId: finding.findingId,
      role: 'measurement',
      qualificationStatus: 'provisional-agent',
      reviewerKey: 'agent:measurement-provisional',
      decision: finding.proposedDisposition,
      rationale: `Provisional measurement acceptance; expert gate remains non-pass until qualified-expert review.`,
      evidenceCiteIds: finding.evidenceCiteIds,
      timestamp: now,
      bankVersion: QUESTION_BANK_VERSION,
      scoringVersion: RESULT_SCORING_VERSION,
      linkedTestIds: finding.linkedTestIds,
    })

    stamped.push({
      ...finding,
      domainReviewId: domainId,
      measurementReviewId: measurementId,
    })
  }

  return { reviews, findings: stamped }
}
