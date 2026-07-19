import { RESULT_SCORING_VERSION } from '../../../scoring/index'
import { QUESTION_BANK_VERSION } from '../../../data/effectiveQuestions'
import type { GateStatus, ReleaseSummary, ValidationGateRecord } from '../types'
import { getBankFingerprint } from '../inventory/snapshot'
import { WP0_FREEZE } from '../inventory/freeze'
import {
  allCorpusContributions,
  statementContributions,
} from '../manifests/responseContributions'
import { dossiers } from '../dossiers/index'
import { findings } from '../findings/ledger'
import { isUnresolvedActive, releaseGate } from '../predicates'

const GENERATED_AT = '2026-07-19T12:00:00.000Z'

/**
 * Roll up the textual evidence gate from real per-claim `textualStatus` fields
 * (never hardcode this — it must track claims.ts, which currently seeds every
 * claim as `not-started` pending WP3 wave fill of real primary+scholarly text).
 */
function aggregateTextualStatus(): GateStatus {
  const allClaims = dossiers.flatMap(d => d.claims)
  if (allClaims.length === 0) return 'not-started'
  const passCount = allClaims.filter(c => c.textualStatus === 'pass').length
  if (passCount === allClaims.length) return 'pass'
  if (passCount === 0) return 'not-started'
  return 'in-review'
}

function buildGateStatuses(): ValidationGateRecord[] {
  const now = GENERATED_AT
  return [
    {
      gate: 'textual',
      // Truthful: every claim.textualStatus is currently 'not-started' (WP3
      // dossiers are schema-valid PENDING_CLAIM_STUB scaffolds awaiting wave
      // fill). Do NOT hardcode 'pass' — that would contradict claims.ts.
      status: aggregateTextualStatus(),
      subjectId: 'mapping-audit:catalog',
      updatedAt: now,
      evidenceRefs: [
        'dossiers/claims.ts (every claim.textualStatus === not-started)',
        'docs/labels-academic-audit.md, docs/ideology-label-review.md, docs/contested-label-research-verification.md, docs/ideology-family-research-verification.md (candidate primary/scholarly sources for wave fill; not yet linked into claim citations)',
        'findings/ledger.ts',
      ],
    },
    {
      gate: 'expert',
      // Truthful: provisional-agent dual reviews exist; qualified-expert not yet complete.
      // Do NOT mark fail — releaseGate blocks until this becomes pass.
      status: 'in-review',
      subjectId: 'mapping-audit:catalog',
      updatedAt: now,
      evidenceRefs: [
        'reviews/records.ts',
        'provisional-agent dual reviews only; qualified-expert spot-check pending',
      ],
    },
    {
      gate: 'empirical',
      status: 'insufficient-data',
      subjectId: 'mapping-audit:catalog',
      updatedAt: now,
      evidenceRefs: [
        'psychometrics empty-study path',
        'no consented respondent pilot data',
      ],
    },
    {
      gate: 'artifact',
      status: 'pass',
      subjectId: 'mapping-audit:catalog',
      updatedAt: now,
      evidenceRefs: [
        'inventory/freeze.ts',
        'dossiers/index.ts',
        'docs/ideology-mapping-validation-audit-report.md',
      ],
    },
    {
      gate: 'test',
      status: 'pass',
      subjectId: 'mapping-audit:catalog',
      updatedAt: now,
      evidenceRefs: [
        'src/validation/mappingAudit/**/*.test.ts',
        'affinity.quarantine.test.ts',
        'releaseGate.test.ts',
      ],
    },
  ]
}

/** Build the current release summary from live inventory + audit ledgers. */
export function buildReleaseSummary(generatedAt: string = GENERATED_AT): ReleaseSummary {
  const bankFingerprint = getBankFingerprint()
  const unresolvedActiveCount = findings.filter(isUnresolvedActive).length

  return {
    releaseId: `release:${QUESTION_BANK_VERSION}:${RESULT_SCORING_VERSION}`,
    generatedAt,
    generatedFrom: {
      bankFingerprint,
      scoringVersion: RESULT_SCORING_VERSION,
    },
    lastAppliedDispositionTimestamp: GENERATED_AT,
    totalContributions:
      allCorpusContributions().length + statementContributions.length,
    totalDossiers: dossiers.length,
    totalFindings: findings.length,
    unresolvedActiveCount,
    gateStatuses: buildGateStatuses(),
    linkedTestIds: [
      'WP0 freeze inventory',
      'responseContributions.coverage',
      'contribution.invariants',
      'dossiers.coverage',
      'claims.evidence',
      'centroid.validity',
      'separability.suite',
      'separability.policy',
      'coherence.fixtures',
      'findings.schema',
      'activePool.clean',
      'ideologyAffinities quarantine',
      'version matrix',
      'copy overclaim guards',
      'releaseGate',
      'report.link',
    ],
  }
}

export const releaseSummaries: ReleaseSummary[] = [buildReleaseSummary()]

export function latestRelease(): ReleaseSummary | undefined {
  return releaseSummaries[releaseSummaries.length - 1]
}

/** Convenience: evaluate releaseGate against live fingerprint/scoring version. */
export function evaluateCurrentReleaseGate(): {
  pass: boolean
  failures: string[]
  summary: ReleaseSummary
} {
  const summary = latestRelease() ?? buildReleaseSummary()
  const result = releaseGate(
    summary,
    getBankFingerprint(),
    RESULT_SCORING_VERSION,
  )
  return { ...result, summary }
}

export { WP0_FREEZE }
