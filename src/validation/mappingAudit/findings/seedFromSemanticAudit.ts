import {
  semanticCorrections,
  needsRewriteById,
  SEMANTIC_AUDIT_VERSION,
} from '../../../data/semanticAudit'
import type { AuditFinding, IssueClass, VersionBumpClass } from '../types'

function mapIssue(issue: string): IssueClass {
  const allowed: IssueClass[] = [
    'sign-inversion',
    'construct-mismatch',
    'template-carryover',
    'double-barreled',
    'non-discriminating',
    'underspecified',
  ]
  if ((allowed as string[]).includes(issue)) return issue as IssueClass
  return 'underspecified'
}

/**
 * Seed findings ledger from the existing main-corpus semantic audit.
 * Corrections → already-applied overlay findings.
 * Needs-rewrite → deactivate findings (subjects already active:false in effective bank).
 */
export function seedFindingsFromSemanticAudit(): AuditFinding[] {
  const findings: AuditFinding[] = []
  const overlayImpact: VersionBumpClass = 'semantic-overlay'

  for (const [questionId, correction] of Object.entries(semanticCorrections)) {
    findings.push({
      findingId: `finding:${mapIssue(correction.issue)}:${questionId}:1`,
      severity: 'major',
      issueClass: mapIssue(correction.issue),
      subjectIds: [questionId],
      inventorySet: 'overlay',
      evidence: correction.rationale,
      evidenceCiteIds: [],
      proposedDisposition: 'correct-overlay',
      lifecycle: 'applied',
      resultingChange: `semanticCorrections[${questionId}] @ ${SEMANTIC_AUDIT_VERSION}`,
      versionImpact: overlayImpact,
      linkedTestIds: ['semantic question audit'],
    })
  }

  for (const [questionId, rewrite] of Object.entries(needsRewriteById)) {
    findings.push({
      findingId: `finding:${mapIssue(rewrite.issue)}:${questionId}:1`,
      severity: 'blocker',
      issueClass: mapIssue(rewrite.issue),
      subjectIds: [questionId],
      inventorySet: 'effective-retained',
      evidence: rewrite.rationale,
      evidenceCiteIds: [],
      proposedDisposition: 'deactivate',
      lifecycle: 'applied',
      resultingChange: `needsRewriteById[${questionId}] active:false @ ${SEMANTIC_AUDIT_VERSION}`,
      versionImpact: overlayImpact,
      linkedTestIds: ['semantic question audit'],
    })
  }

  findings.push({
    findingId: 'finding:affinity-quarantine:bank:1',
    severity: 'info',
    issueClass: 'affinity-quarantine',
    subjectIds: ['bank'],
    inventorySet: 'raw',
    evidence:
      'IdeologyAffinity remains type-only; scoring must not populate or consume affinities.',
    evidenceCiteIds: [],
    proposedDisposition: 'no-change',
    lifecycle: 'approved',
    versionImpact: 'none',
    linkedTestIds: ['ideologyAffinities quarantine'],
  })

  return findings.sort((a, b) => a.findingId.localeCompare(b.findingId))
}
