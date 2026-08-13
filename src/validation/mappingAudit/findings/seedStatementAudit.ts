import {
  statementSemanticCorrections,
  statementNeedsRewriteById,
  STATEMENT_SEMANTIC_AUDIT_VERSION,
} from "../../../data/statementSemanticAudit";
import type { AuditFinding, IssueClass, VersionBumpClass } from "../types";

function mapIssue(issue: string): IssueClass {
  const allowed: IssueClass[] = [
    "sign-inversion",
    "construct-mismatch",
    "template-carryover",
    "double-barreled",
    "non-discriminating",
    "underspecified",
  ];
  if ((allowed as string[]).includes(issue)) return issue as IssueClass;
  return "underspecified";
}

/**
 * Seed findings ledger from the statement-corpus semantic audit.
 *
 * sq03/sq08/sq10/sq16 are deliberately out of scope here: they are already
 * seeded by `seedFindingsFromSemanticAudit` off the main overlay's
 * `needsRewriteById`, since `statementQuestions` is folded into
 * `coreQuestions` and reviewed by `applySemanticReview`. Seeding them again
 * from this module would double up findings for the same subject id.
 */
export function seedStatementFindings(): AuditFinding[] {
  const findings: AuditFinding[] = [];
  const overlayImpact: VersionBumpClass = "semantic-overlay";

  for (const [questionId, correction] of Object.entries(
    statementSemanticCorrections,
  )) {
    findings.push({
      findingId: `finding:construct-mismatch:${questionId}:1`,
      severity: "major",
      issueClass: "construct-mismatch",
      subjectIds: [questionId],
      inventorySet: "overlay",
      evidence: correction.rationale,
      evidenceCiteIds: [],
      proposedDisposition: "correct-overlay",
      lifecycle: "applied",
      resultingChange: `statementSemanticCorrections[${questionId}] @ ${STATEMENT_SEMANTIC_AUDIT_VERSION}`,
      versionImpact: overlayImpact,
      linkedTestIds: ["statement question audit"],
    });
  }

  for (const [questionId, rewrite] of Object.entries(
    statementNeedsRewriteById,
  )) {
    findings.push({
      findingId: `finding:${mapIssue(rewrite.issue)}:${questionId}:1`,
      severity: "blocker",
      issueClass: mapIssue(rewrite.issue),
      subjectIds: [questionId],
      inventorySet: "effective-retained",
      evidence: rewrite.rationale,
      evidenceCiteIds: [],
      proposedDisposition: "deactivate",
      lifecycle: "applied",
      resultingChange: `statementNeedsRewriteById[${questionId}] active:false @ ${STATEMENT_SEMANTIC_AUDIT_VERSION}`,
      versionImpact: overlayImpact,
      linkedTestIds: ["statement question audit"],
    });
  }

  return findings.sort((a, b) => a.findingId.localeCompare(b.findingId));
}
