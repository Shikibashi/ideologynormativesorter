import { labels } from '../../../data/labels'
import { axes } from '../../../data/axes'
import type { AxisId } from '../../../types/common'
import type { IdeologyLabel } from '../../../types/label'
import type { ClaimMatrixEntry, PerspectiveEntry } from '../types'
import {
  LABEL_BANK_SCHOLARLY_STUB_IDS,
  ensureLabelBankCitations,
  labelBankPrimaryCiteId,
} from '../citations/registry'

/** Shared unavailable perspective stubs — wave fill supplies real text. */
const PENDING_PERSPECTIVES: Record<
  'sympathetic' | 'critical' | 'neutral',
  PerspectiveEntry
> = {
  sympathetic: {
    unavailableReason: 'PENDING_PERSPECTIVE: sympathetic not yet researched',
  },
  critical: {
    unavailableReason: 'PENDING_PERSPECTIVE: critical not yet researched',
  },
  neutral: {
    unavailableReason: 'PENDING_PERSPECTIVE: neutral not yet researched',
  },
}

function stubClaim(
  labelId: string,
  fieldPath: string,
  statement: string,
): ClaimMatrixEntry {
  return {
    claimId: `claim:${labelId}:${fieldPath}:1`,
    labelId,
    fieldPath,
    statement,
    primaryCiteId: labelBankPrimaryCiteId(labelId),
    scholarlyCiteIds: [...LABEL_BANK_SCHOLARLY_STUB_IDS],
    perspectives: { ...PENDING_PERSPECTIVES },
    textualStatus: 'not-started',
    // No qualified-expert available yet — must remain non-pass.
    expertStatus: 'not-started',
    // Empirical gate withheld until consented respondent data.
    empiricalStatus: 'insufficient-data',
  }
}

/**
 * WP3 claim-matrix stubs for one live label:
 * definition + family + one claim per axis centroid (26).
 * Evidence cites are secondary-seed placeholders; expert/empirical gates stay non-pass.
 */
export function buildClaimStubsForLabel(label: IdeologyLabel): ClaimMatrixEntry[] {
  const claims: ClaimMatrixEntry[] = [
    stubClaim(
      label.id,
      'definition',
      `PENDING_CLAIM_STUB: audit bank definition for ${label.name}: ${label.description}`,
    ),
    stubClaim(
      label.id,
      'family',
      `PENDING_CLAIM_STUB: audit hierarchy placement of ${label.name} under family ${label.family}`,
    ),
  ]

  for (const axis of axes) {
    const axisId = axis.id as AxisId
    const value = label.centroid[axisId] ?? 0
    claims.push(
      stubClaim(
        label.id,
        `centroid.${axisId}`,
        `PENDING_CLAIM_STUB: audit centroid ${axisId}=${value} for ${label.name} (rationale pending; not empirical validity)`,
      ),
    )
  }

  return claims
}

/** Build claim stubs for every live catalog label. Seeds citation registry once. */
export function buildAllClaimStubs(): ClaimMatrixEntry[] {
  ensureLabelBankCitations(labels.map((l) => l.id))
  return labels.flatMap((label) => buildClaimStubsForLabel(label))
}

/** Expected field paths for the WP3 skeleton (definition, family, 26 centroids). */
export function expectedClaimFieldPaths(): string[] {
  return ['definition', 'family', ...axes.map((a) => `centroid.${a.id}`)]
}
