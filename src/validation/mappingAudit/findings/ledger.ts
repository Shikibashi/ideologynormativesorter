import type { AuditFinding } from '../types'
import { seedFindingsFromSemanticAudit } from './seedFromSemanticAudit'
import { seedSeparabilityFindings } from './seedSeparability'
import { seedModuleFindings } from './seedModuleAudit'
import { seedStatementFindings } from './seedStatementAudit'
import { seedProvisionalReviews } from '../reviews/seedProvisional'

const seeded = seedProvisionalReviews([
  ...seedFindingsFromSemanticAudit(),
  ...seedModuleFindings(),
  ...seedStatementFindings(),
  ...seedSeparabilityFindings(),
])

export const findings: AuditFinding[] = seeded.findings

export function findingById(findingId: string): AuditFinding | undefined {
  return findings.find((f) => f.findingId === findingId)
}

export function findingsForSubject(subjectId: string): AuditFinding[] {
  return findings.filter((f) => f.subjectIds.includes(subjectId))
}

export { seeded as seededFindingsAndReviews }
