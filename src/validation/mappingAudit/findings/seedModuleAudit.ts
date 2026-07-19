import {
  moduleSemanticCorrections,
  moduleNeedsRewriteById,
  MODULE_SEMANTIC_AUDIT_VERSION,
} from '../../../data/moduleSemanticAudit'
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
 * Seed findings ledger from the module semantic audit.
 */
export function seedModuleFindings(): AuditFinding[] {
  const findings: AuditFinding[] = []
  const overlayImpact: VersionBumpClass = 'semantic-overlay'

  // Map corrections to applied overlay findings
  for (const [questionId, correction] of Object.entries(moduleSemanticCorrections)) {
    let issue: IssueClass = 'construct-mismatch'
    if (questionId === 'fm-market-7') {
      issue = 'sign-inversion'
    }

    findings.push({
      findingId: `finding:${issue}:${questionId}:1`,
      severity: 'major',
      issueClass: issue,
      subjectIds: [questionId],
      inventorySet: 'overlay',
      evidence: correction.rationale,
      evidenceCiteIds: [],
      proposedDisposition: 'correct-overlay',
      lifecycle: 'applied',
      resultingChange: `moduleSemanticCorrections[${questionId}] @ ${MODULE_SEMANTIC_AUDIT_VERSION}`,
      versionImpact: overlayImpact,
      linkedTestIds: ['module question audit'],
    })
  }

  // Map needs-rewrite to deactivate findings
  for (const [questionId, rewrite] of Object.entries(moduleNeedsRewriteById)) {
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
      resultingChange: `moduleNeedsRewriteById[${questionId}] active:false @ ${MODULE_SEMANTIC_AUDIT_VERSION}`,
      versionImpact: overlayImpact,
      linkedTestIds: ['module question audit'],
    })
  }

  return findings.sort((a, b) => a.findingId.localeCompare(b.findingId))
}
