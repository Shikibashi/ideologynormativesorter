import type {
  AuditFinding,
  ClaimMatrixEntry,
  FindingLifecycle,
  IdeologyDossier,
  ReleaseSummary,
  ReviewRecord,
} from './types'

export function isApprovedDisposition(f: AuditFinding): boolean {
  // Structural check: lifecycle is terminal-approved AND both required reviews present.
  // Full expert gate (qualificationStatus) checked by isExpertGateSatisfied.
  return (
    (f.lifecycle === 'approved' || f.lifecycle === 'applied') &&
    f.domainReviewId != null &&
    f.measurementReviewId != null
  )
}

export function isUnresolvedActive(f: AuditFinding): boolean {
  const unresolvedStates: FindingLifecycle[] = [
    'proposed',
    'domain-reviewed',
    'measurement-reviewed',
    'adjudicated',
  ]
  return unresolvedStates.includes(f.lifecycle) && !isApprovedDisposition(f)
}

export function isMatchPoolMember(dossier: IdeologyDossier): boolean {
  return (
    ['active', 'survivor', 'split-active'].includes(dossier.lifecycle) &&
    dossier.mergedInto == null &&
    dossier.matchPoolMember === true
  )
}

export function isExpertGateSatisfied(
  claims: ClaimMatrixEntry[],
  reviews: ReviewRecord[],
): boolean {
  const allExpertPass = claims.every(c => c.expertStatus === 'pass')
  const allReviewsQualified = reviews.every(
    r => r.qualificationStatus === 'qualified-expert',
  )
  return allExpertPass && allReviewsQualified
}

/**
 * Release acceptance:
 * - fingerprints / unresolved / freshness checks
 * - any gate with status `fail` blocks
 * - expert gate must be present and `pass` (qualified-expert only)
 * - empirical may remain `insufficient-data` or `deferred` without blocking
 */
export function releaseGate(
  summary: ReleaseSummary,
  liveBankFingerprint: string,
  liveScoringVersion: string,
): { pass: boolean; failures: string[] } {
  const failures: string[] = []

  if (summary.generatedFrom.bankFingerprint !== liveBankFingerprint) {
    failures.push('bankFingerprint mismatch')
  }
  if (summary.generatedFrom.scoringVersion !== liveScoringVersion) {
    failures.push('scoringVersion mismatch')
  }
  if (summary.unresolvedActiveCount > 0) {
    failures.push(
      `${summary.unresolvedActiveCount} unresolved active findings`,
    )
  }
  if (
    summary.lastAppliedDispositionTimestamp &&
    summary.generatedAt < summary.lastAppliedDispositionTimestamp
  ) {
    failures.push('summary generated before last applied disposition')
  }

  const failedGates = summary.gateStatuses.filter(g => g.status === 'fail')
  if (failedGates.length > 0) {
    failures.push(
      `${failedGates.length} failed gates: ${failedGates.map(g => g.gate).join(', ')}`,
    )
  }

  const expertGate = summary.gateStatuses.find(g => g.gate === 'expert')
  if (expertGate == null) {
    failures.push('expert gate missing')
  } else if (expertGate.status !== 'pass') {
    failures.push(
      `expert gate requires pass (qualified-expert); current=${expertGate.status}`,
    )
  }

  const empiricalGate = summary.gateStatuses.find(g => g.gate === 'empirical')
  if (
    empiricalGate != null &&
    empiricalGate.status !== 'pass' &&
    empiricalGate.status !== 'insufficient-data' &&
    empiricalGate.status !== 'deferred'
  ) {
    failures.push(
      `empirical gate unacceptable status=${empiricalGate.status}`,
    )
  }

  return { pass: failures.length === 0, failures }
}
