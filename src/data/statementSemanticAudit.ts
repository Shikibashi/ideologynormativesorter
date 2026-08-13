import type { Question, StatementOption } from "../types";

/**
 * Statement-corpus semantic overlay (WP2 fills corrections).
 *
 * sq03/sq08/sq10/sq16 are intentionally NOT mirrored here: they are already
 * covered by `needsRewriteById` in `./semanticAudit.ts`. `statementQuestions`
 * is folded into `coreQuestions` (see `./questions.ts`) and every core item —
 * statement items included — passes through `applySemanticReview` in
 * `./effectiveQuestions.ts`. The main overlay is authoritative for those four
 * shared ids; duplicating them here would risk a second, possibly divergent
 * deprecation record for the same question id.
 */
export const STATEMENT_SEMANTIC_AUDIT_VERSION = "2026-07-statement-semantic-v1";
export const STATEMENT_SEMANTIC_AUDIT_DATE = "2026-07-19";

export type StatementSemanticCorrection = {
  statementOptions: StatementOption[];
  rationale: string;
};

export const statementSemanticCorrections: Record<
  string,
  StatementSemanticCorrection
> = {};

// High-confidence, statement-only construct finding (not present in the main
// overlay's needsRewriteById): sq04 forces a single choice across two
// distinct empirical constructs (public-choice-skepticism and
// state-capacity-confidence), the same "different constructs, not mutually
// exclusive" defect already used to deactivate sq03/sq08/sq10/sq16.
export const statementNeedsRewriteById: Record<
  string,
  { issue: string; rationale: string }
> = {
  sq04: {
    issue: "double-barreled",
    rationale:
      "Forced options conflate public-choice-skepticism (capture/self-interest of welfare administrators) with state-capacity-confidence (administrative competence): e.g. option b implies both low skepticism and high capacity as a single package, so picking one option cannot cleanly discriminate either construct.",
  },
};

export function applyStatementSemanticReview(question: Question): Question {
  const correction = statementSemanticCorrections[String(question.id)];
  if (correction) {
    return {
      ...question,
      statementOptions: correction.statementOptions,
      reviewStatus: "approved",
      version: STATEMENT_SEMANTIC_AUDIT_VERSION,
      updatedAt: STATEMENT_SEMANTIC_AUDIT_DATE,
    };
  }

  const rewrite = statementNeedsRewriteById[String(question.id)];
  if (rewrite) {
    return {
      ...question,
      active: false,
      reviewStatus: "needs-rewrite",
      version: STATEMENT_SEMANTIC_AUDIT_VERSION,
      updatedAt: STATEMENT_SEMANTIC_AUDIT_DATE,
      deprecatedAt: STATEMENT_SEMANTIC_AUDIT_DATE,
      deprecationReason: `${rewrite.issue}: ${rewrite.rationale}`,
    };
  }

  return question;
}
