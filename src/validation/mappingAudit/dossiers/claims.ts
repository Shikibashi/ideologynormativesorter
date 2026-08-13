import { labels } from "../../../data/labels";
import { axes } from "../../../data/axes";
import type { AxisId } from "../../../types/common";
import type { IdeologyLabel } from "../../../types/label";
import type { ClaimMatrixEntry } from "../types";
import {
  ensureLabelBankCitations,
  labelBankPrimaryCiteId,
  scholarlyCiteIdsForFamily,
} from "../citations/registry";
import {
  formatCentroidStatement,
  formatDefinitionStatement,
  formatFamilyStatement,
  formatPerspectives,
} from "./formatters";

function buildClaim(
  label: IdeologyLabel,
  fieldPath: string,
  statement: string,
): ClaimMatrixEntry {
  return {
    claimId: `claim:${label.id}:${fieldPath}:1`,
    labelId: label.id,
    fieldPath,
    statement,
    primaryCiteId: labelBankPrimaryCiteId(label.id),
    scholarlyCiteIds: scholarlyCiteIdsForFamily(label.family),
    perspectives: formatPerspectives(label, fieldPath),
    // Researched clean-room fill awaiting qualified-expert textual review.
    textualStatus: "in-review",
    // No qualified-expert available yet — must remain non-pass.
    expertStatus: "not-started",
    // Empirical gate withheld until consented respondent data.
    empiricalStatus: "insufficient-data",
  };
}

/**
 * WP3 claim-matrix fill for one live label:
 * definition + family + one claim per axis centroid (26).
 * Statements use instrument-operational framing; scholarly cites are family baselines.
 * Expert/empirical gates stay non-pass.
 */
export function buildClaimsForLabel(label: IdeologyLabel): ClaimMatrixEntry[] {
  const claims: ClaimMatrixEntry[] = [
    buildClaim(label, "definition", formatDefinitionStatement(label)),
    buildClaim(label, "family", formatFamilyStatement(label)),
  ];

  for (const axis of axes) {
    const axisId = axis.id as AxisId;
    const value = label.centroid[axisId] ?? 0;
    claims.push(
      buildClaim(
        label,
        `centroid.${axisId}`,
        formatCentroidStatement(label, axis, value),
      ),
    );
  }

  return claims;
}

/** @deprecated Prefer buildClaimsForLabel — alias kept for existing call sites/tests. */
export function buildClaimStubsForLabel(
  label: IdeologyLabel,
): ClaimMatrixEntry[] {
  return buildClaimsForLabel(label);
}

/** Build claims for every live catalog label. Seeds citation registry once. */
export function buildAllClaims(): ClaimMatrixEntry[] {
  ensureLabelBankCitations(labels.map((l) => l.id));
  return labels.flatMap((label) => buildClaimsForLabel(label));
}

/** @deprecated Prefer buildAllClaims. */
export function buildAllClaimStubs(): ClaimMatrixEntry[] {
  return buildAllClaims();
}

/** Expected field paths for the WP3 matrix (definition, family, 26 centroids). */
export function expectedClaimFieldPaths(): string[] {
  return ["definition", "family", ...axes.map((a) => `centroid.${a.id}`)];
}
